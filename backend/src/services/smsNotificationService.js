import { sendSMS } from './twilioService.js';
import User from '../models/User.js';

/**
 * Send SMS notifications to all users or specific users
 */
export class SMSNotificationService {
  
  /**
   * Send coastal threat alert to all verified users
   * @param {Object} alertData - Alert information
   * @param {Array} excludeUsers - Array of user IDs to exclude
   */
  static async sendThreatAlertToAll(alertData, excludeUsers = []) {
    try {
      const users = await User.find({
        phoneVerified: true,
        'smsPreferences.threatAlerts': true,
        _id: { $nin: excludeUsers }
      }).select('number name');

      if (users.length === 0) {
        console.log('⚠️ No verified users found for threat alerts');
        return { success: false, message: 'No users to notify' };
      }

      const results = [];
      for (const user of users) {
        try {
          const result = await this.sendThreatAlert(user.number, alertData, user.name);
          results.push({ userId: user._id, success: true, result });
        } catch (error) {
          console.error(`❌ Failed to send threat alert to ${user.number}:`, error.message);
          results.push({ userId: user._id, success: false, error: error.message });
        }
      }

      const successCount = results.filter(r => r.success).length;
      console.log(`✅ Threat alert sent to ${successCount}/${users.length} users`);

      return {
        success: true,
        totalUsers: users.length,
        successCount,
        failedCount: users.length - successCount,
        results
      };
    } catch (error) {
      console.error('❌ Error sending threat alerts to all users:', error);
      throw error;
    }
  }

  /**
   * Send crisis monitoring update to specific users
   * @param {Array} userIds - Array of user IDs to notify
   * @param {Object} updateData - Update information
   */
  static async sendCrisisUpdateToUsers(userIds, updateData) {
    try {
      const users = await User.find({
        _id: { $in: userIds },
        phoneVerified: true,
        'smsPreferences.crisisUpdates': true
      }).select('number name');

      if (users.length === 0) {
        console.log('⚠️ No verified users found for crisis updates');
        return { success: false, message: 'No users to notify' };
      }

      const results = [];
      for (const user of users) {
        try {
          const result = await this.sendCrisisUpdate(user.number, updateData, user.name);
          results.push({ userId: user._id, success: true, result });
        } catch (error) {
          console.error(`❌ Failed to send crisis update to ${user.number}:`, error.message);
          results.push({ userId: user._id, success: false, error: error.message });
        }
      }

      const successCount = results.filter(r => r.success).length;
      console.log(`✅ Crisis update sent to ${successCount}/${users.length} users`);

      return {
        success: true,
        totalUsers: users.length,
        successCount,
        failedCount: users.length - successCount,
        results
      };
    } catch (error) {
      console.error('❌ Error sending crisis updates:', error);
      throw error;
    }
  }

  /**
   * Send personalized threat alert
   * @param {string} phoneNumber - User's phone number
   * @param {Object} alertData - Alert information
   * @param {string} userName - User's name for personalization
   */
  static async sendThreatAlert(phoneNumber, alertData, userName = '') {
    const { threatType, severity, location, recommendation, timestamp } = alertData;
    
    const message = `🚨 COASTAL THREAT ALERT 🚨\n\n${userName ? `Hi ${userName},\n\n` : ''}Type: ${threatType}\nSeverity: ${severity}\nLocation: ${location}\nTime: ${timestamp || new Date().toLocaleString()}\n\nRecommendation: ${recommendation}\n\nStay safe and follow local authorities' instructions.\n\n- BlueGuard Team`;
    
    return await sendSMS(phoneNumber, message);
  }

  /**
   * Send crisis monitoring update
   * @param {string} phoneNumber - User's phone number
   * @param {Object} updateData - Update information
   * @param {string} userName - User's name for personalization
   */
  static async sendCrisisUpdate(phoneNumber, updateData, userName = '') {
    const { timestamp, threats, status, summary } = updateData;
    
    const message = `📊 Crisis Monitoring Update\n\n${userName ? `Hi ${userName},\n\n` : ''}Time: ${timestamp || new Date().toLocaleString()}\nStatus: ${status}\nActive Threats: ${threats}\n\nSummary: ${summary}\n\nMonitor your dashboard for detailed information.\n\n- BlueGuard Team`;
    
    return await sendSMS(phoneNumber, message);
  }

  /**
   * Send evacuation notice
   * @param {string} phoneNumber - User's phone number
   * @param {Object} evacuationData - Evacuation information
   * @param {string} userName - User's name for personalization
   */
  static async sendEvacuationNotice(phoneNumber, evacuationData, userName = '') {
    const { location, reason, safeZone, instructions } = evacuationData;
    
    const message = `🚨 EVACUATION NOTICE 🚨\n\n${userName ? `Hi ${userName},\n\n` : ''}Location: ${location}\nReason: ${reason}\n\nSafe Zone: ${safeZone}\n\nInstructions: ${instructions}\n\nPlease evacuate immediately and follow emergency protocols.\n\n- BlueGuard Emergency Team`;
    
    return await sendSMS(phoneNumber, message);
  }

  /**
   * Send weather warning
   * @param {string} phoneNumber - User's phone number
   * @param {Object} weatherData - Weather warning information
   * @param {string} userName - User's name for personalization
   */
  static async sendWeatherWarning(phoneNumber, weatherData, userName = '') {
    const { warningType, severity, duration, precautions } = weatherData;
    
    const message = `🌊 WEATHER WARNING 🌊\n\n${userName ? `Hi ${userName},\n\n` : ''}Warning Type: ${warningType}\nSeverity: ${severity}\nDuration: ${duration}\n\nPrecautions: ${precautions}\n\nStay informed and take necessary precautions.\n\n- BlueGuard Weather Team`;
    
    return await sendSMS(phoneNumber, message);
  }

  /**
   * Send system maintenance notification
   * @param {string} phoneNumber - User's phone number
   * @param {Object} maintenanceData - Maintenance information
   * @param {string} userName - User's name for personalization
   */
  static async sendMaintenanceNotification(phoneNumber, maintenanceData, userName = '') {
    const { type, duration, impact, alternativeContact } = maintenanceData;
    
    const message = `🔧 System Maintenance Notice\n\n${userName ? `Hi ${userName},\n\n` : ''}Type: ${type}\nDuration: ${duration}\nImpact: ${impact}\n\nAlternative Contact: ${alternativeContact}\n\nWe apologize for any inconvenience.\n\n- BlueGuard Support Team`;
    
    return await sendSMS(phoneNumber, message);
  }

  /**
   * Send monthly summary report
   * @param {string} phoneNumber - User's phone number
   * @param {Object} summaryData - Summary information
   * @param {string} userName - User's name for personalization
   */
  static async sendMonthlySummary(phoneNumber, summaryData, userName = '') {
    const { month, totalAlerts, threatTypes, recommendations } = summaryData;
    
    const message = `📈 Monthly Summary Report\n\n${userName ? `Hi ${userName},\n\n` : ''}Month: ${month}\nTotal Alerts: ${totalAlerts}\nThreat Types: ${threatTypes.join(', ')}\n\nKey Recommendations:\n${recommendations.map(r => `• ${r}`).join('\n')}\n\nThank you for using BlueGuard!\n\n- BlueGuard Team`;
    
    return await sendSMS(phoneNumber, message);
  }

  /**
   * Send test message to verify phone number
   * @param {string} phoneNumber - User's phone number
   * @param {string} userName - User's name for personalization
   */
  static async sendTestMessage(phoneNumber, userName = '') {
    const message = `🧪 Test Message\n\n${userName ? `Hi ${userName},\n\n` : ''}This is a test message from BlueGuard to verify your phone number is working correctly.\n\nIf you receive this message, your SMS notifications are properly configured!\n\n- BlueGuard Team`;
    
    return await sendSMS(phoneNumber, message);
  }
}

export default SMSNotificationService;
