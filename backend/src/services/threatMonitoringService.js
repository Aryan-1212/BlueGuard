import SMSNotificationService from './smsNotificationService.js';
import User from '../models/User.js';

/**
 * Threat monitoring service that tracks threats and sends SMS alerts only once
 */
export class ThreatMonitoringService {
  
  // In-memory storage for tracking sent alerts (in production, use Redis or database)
  static threatAlertHistory = new Map();
  
  // Threat thresholds and configurations
  static threatConfigs = {
    ALGAL_BLOOM: {
      threshold: 0.6, // 60% confidence threshold
      name: 'Algal Bloom',
      severity: 'Medium',
      recommendation: 'Monitor water quality and avoid affected areas'
    },
    CYCLONE: {
      threshold: 0.7, // 70% confidence threshold
      name: 'Cyclone',
      severity: 'High',
      recommendation: 'Prepare for strong winds and heavy rainfall'
    },
    EROSION: {
      threshold: 0.5, // 50% confidence threshold
      name: 'Coastal Erosion',
      severity: 'High',
      recommendation: 'Avoid coastal areas and monitor erosion rates'
    },
    SEA_LEVEL: {
      threshold: 0.8, // 80% confidence threshold
      name: 'Sea Level Rise',
      severity: 'Medium',
      recommendation: 'Monitor water levels and prepare for potential flooding'
    }
  };

  /**
   * Process threat predictions and send SMS alerts if needed
   * @param {Object} predictions - Threat predictions from AI model
   * @param {Object} inputData - Input data used for predictions
   * @returns {Object} - Processing results
   */
  static async processThreatPredictions(predictions, inputData) {
    try {
      console.log('🔍 Processing threat predictions...');
      
      const results = {
        threatsDetected: [],
        alertsSent: [],
        alertsSkipped: [],
        timestamp: new Date().toISOString()
      };

      // Process each threat type
      for (const [threatType, config] of Object.entries(this.threatConfigs)) {
        const prediction = predictions[threatType];
        
        if (prediction) {
          const { status, confidence, level } = prediction;
          const isThreat = status === 'THREAT' && confidence >= config.threshold;
          
          if (isThreat) {
            results.threatsDetected.push({
              type: threatType,
              status,
              confidence,
              level,
              threshold: config.threshold
            });

            // Check if we should send an alert (only once per threat type)
            const alertKey = `${threatType}_${this.getDateKey()}`;
            const hasAlertedToday = this.threatAlertHistory.has(alertKey);

            if (!hasAlertedToday) {
              // Send SMS alert to all verified users
              const alertResult = await this.sendThreatAlert(threatType, {
                status,
                confidence,
                level,
                inputData,
                config
              });

              if (alertResult.success) {
                // Mark this threat as alerted today
                this.threatAlertHistory.set(alertKey, {
                  timestamp: new Date(),
                  threatType,
                  confidence,
                  usersNotified: alertResult.successCount
                });

                results.alertsSent.push({
                  threatType,
                  usersNotified: alertResult.successCount,
                  messageId: alertResult.messageId
                });

                console.log(`🚨 Threat alert sent for ${threatType} to ${alertResult.successCount} users`);
              } else {
                results.alertsSkipped.push({
                  threatType,
                  reason: 'Failed to send SMS',
                  error: alertResult.error
                });
              }
            } else {
              results.alertsSkipped.push({
                threatType,
                reason: 'Already alerted today',
                lastAlert: this.threatAlertHistory.get(alertKey)
              });
            }
          }
        }
      }

      // Clean up old alert history (older than 7 days)
      this.cleanupAlertHistory();

      console.log(`✅ Threat processing complete: ${results.threatsDetected.length} threats, ${results.alertsSent.length} alerts sent`);
      
      return results;

    } catch (error) {
      console.error('❌ Error processing threat predictions:', error);
      throw error;
    }
  }

  /**
   * Send threat alert SMS to all verified users
   * @param {string} threatType - Type of threat
   * @param {Object} threatData - Threat information
   * @returns {Object} - Alert result
   */
  static async sendThreatAlert(threatType, threatData) {
    try {
      const { status, confidence, level, inputData, config } = threatData;
      
      const alertData = {
        threatType: config.name,
        severity: config.severity,
        location: this.extractLocation(inputData),
        recommendation: config.recommendation,
        confidence: `${(confidence * 100).toFixed(1)}%`,
        timestamp: new Date().toLocaleString(),
        additionalInfo: this.getAdditionalInfo(threatType, inputData)
      };

      // Send to all verified users
      const result = await SMSNotificationService.sendThreatAlertToAll(alertData);
      
      return {
        success: true,
        successCount: result.successCount,
        messageId: result.results?.[0]?.result?.messageId || 'N/A'
      };

    } catch (error) {
      console.error(`❌ Failed to send threat alert for ${threatType}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Send personalized threat alert to specific user
   * @param {string} userId - User ID to alert
   * @param {string} threatType - Type of threat
   * @param {Object} threatData - Threat information
   * @returns {Object} - Alert result
   */
  static async sendPersonalizedThreatAlert(userId, threatType, threatData) {
    try {
      const user = await User.findById(userId).select('number name');
      if (!user || !user.phoneVerified) {
        return { success: false, error: 'User not found or phone not verified' };
      }

      const { status, confidence, level, inputData, config } = threatData;
      
      const alertData = {
        threatType: config.name,
        severity: config.severity,
        location: this.extractLocation(inputData),
        recommendation: config.recommendation,
        confidence: `${(confidence * 100).toFixed(1)}%`,
        timestamp: new Date().toLocaleString(),
        additionalInfo: this.getAdditionalInfo(threatType, inputData)
      };

      const result = await SMSNotificationService.sendThreatAlert(user.number, alertData, user.name);
      
      return {
        success: true,
        messageId: result.messageId,
        status: result.status
      };

    } catch (error) {
      console.error(`❌ Failed to send personalized threat alert:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Check if a threat alert has already been sent today
   * @param {string} threatType - Type of threat
   * @returns {boolean} - Whether alert was already sent
   */
  static hasAlertedToday(threatType) {
    const alertKey = `${threatType}_${this.getDateKey()}`;
    return this.threatAlertHistory.has(alertKey);
  }

  /**
   * Get alert history for a specific threat type
   * @param {string} threatType - Type of threat (optional)
   * @returns {Array} - Alert history
   */
  static getAlertHistory(threatType = null) {
    if (threatType) {
      return Array.from(this.threatAlertHistory.entries())
        .filter(([key]) => key.startsWith(threatType))
        .map(([key, value]) => ({ key, ...value }));
    }
    
    return Array.from(this.threatAlertHistory.entries())
      .map(([key, value]) => ({ key, ...value }));
  }

  /**
   * Clear alert history (useful for testing)
   */
  static clearAlertHistory() {
    this.threatAlertHistory.clear();
    console.log('🧹 Alert history cleared');
  }

  /**
   * Get current threat status for all threat types
   * @returns {Object} - Current threat status
   */
  static getCurrentThreatStatus() {
    const status = {};
    const today = this.getDateKey();

    for (const threatType of Object.keys(this.threatConfigs)) {
      const alertKey = `${threatType}_${today}`;
      const hasAlerted = this.threatAlertHistory.has(alertKey);
      
      status[threatType] = {
        hasAlertedToday: hasAlerted,
        lastAlert: hasAlerted ? this.threatAlertHistory.get(alertKey) : null,
        config: this.threatConfigs[threatType]
      };
    }

    return status;
  }

  /**
   * Update threat configuration
   * @param {string} threatType - Type of threat
   * @param {Object} config - New configuration
   */
  static updateThreatConfig(threatType, config) {
    if (this.threatConfigs[threatType]) {
      this.threatConfigs[threatType] = { ...this.threatConfigs[threatType], ...config };
      console.log(`⚙️ Updated threat config for ${threatType}`);
    }
  }

  /**
   * Get date key for tracking daily alerts
   * @returns {string} - Date key (YYYY-MM-DD)
   */
  static getDateKey() {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Clean up old alert history (older than 7 days)
   */
  static cleanupAlertHistory() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const cutoffDate = sevenDaysAgo.toISOString().split('T')[0];

    let cleanedCount = 0;
    for (const [key, value] of this.threatAlertHistory.entries()) {
      const alertDate = key.split('_')[1];
      if (alertDate < cutoffDate) {
        this.threatAlertHistory.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`🧹 Cleaned up ${cleanedCount} old alert records`);
    }
  }

  /**
   * Extract location information from input data
   * @param {Object} inputData - Input data
   * @returns {string} - Location string
   */
  static extractLocation(inputData) {
    // Try to extract location from various possible fields
    const locationFields = ['LOCATION', 'AREA', 'REGION', 'COORDINATES'];
    
    for (const field of locationFields) {
      if (inputData[field]) {
        return inputData[field];
      }
    }
    
    return 'Coastal Region'; // Default location
  }

  /**
   * Get additional information based on threat type
   * @param {string} threatType - Type of threat
   * @param {Object} inputData - Input data
   * @returns {string} - Additional information
   */
  static getAdditionalInfo(threatType, inputData) {
    switch (threatType) {
      case 'ALGAL_BLOOM':
        return `Chlorophyll Level: ${inputData['CHLOROPHYLL MG_M3'] || 'N/A'} mg/m³`;
      case 'CYCLONE':
        return `Distance: ${inputData['CYCLONE_DISTANCE_KM'] || 'N/A'} km`;
      case 'EROSION':
        return `Risk Index: ${inputData['COASTAL EROSION_RISK'] || 'N/A'}`;
      case 'SEA_LEVEL':
        return `Current Level: ${inputData['SEA_LEVEL_M'] || 'N/A'} m`;
      default:
        return '';
    }
  }
}

export default ThreatMonitoringService;
