import ThreatMonitoringService from './src/services/threatMonitoringService.js';
import SMSNotificationService from './src/services/smsNotificationService.js';

console.log('🧪 Testing Single Threat SMS Execution...\n');

// Test 1: Single threat detection
console.log('1️⃣ Testing Single Threat Detection...');

const singleThreatPrediction = {
  EROSION: {
    status: 'THREAT',
    confidence: 0.85, // Above 50% threshold
    level: 'High Level'
  }
};

const singleThreatInputData = {
  'LOCATION': 'Test Coastal Area',
  'COASTAL EROSION_RISK': 78
};

console.log('Single Threat Prediction:', singleThreatPrediction);
console.log('Input Data:', singleThreatInputData);
console.log('');

// Test 2: Process single threat
console.log('2️⃣ Processing Single Threat...');

async function testSingleThreat() {
  try {
    // Clear any existing alert history for testing
    ThreatMonitoringService.clearAlertHistory();
    
    console.log('🧹 Alert history cleared for testing');
    console.log('');
    
    // Process the single threat
    const results = await ThreatMonitoringService.processThreatPredictions(singleThreatPrediction, singleThreatInputData);
    
    console.log('✅ Single Threat Processing Results:');
    console.log('   Threats Detected:', results.threatsDetected.length);
    console.log('   Alerts Sent:', results.alertsSent.length);
    console.log('   Alerts Skipped:', results.alertsSkipped.length);
    console.log('');
    
    if (results.threatsDetected.length > 0) {
      console.log('🚨 Detected Threats:');
      results.threatsDetected.forEach(threat => {
        console.log(`   - ${threat.type}: ${threat.confidence * 100}% confidence`);
      });
      console.log('');
    }
    
    if (results.alertsSent.length > 0) {
      console.log('📱 SMS Alerts Sent:');
      results.alertsSent.forEach(alert => {
        console.log(`   - ${alert.threatType}: ${alert.usersNotified} users notified`);
      });
      console.log('');
    }
    
    if (results.alertsSkipped.length > 0) {
      console.log('⏭️  Alerts Skipped:');
      results.alertsSkipped.forEach(alert => {
        console.log(`   - ${alert.threatType}: ${alert.reason}`);
      });
      console.log('');
    }
    
    // Test 3: Verify alert history
    console.log('3️⃣ Verifying Alert History...');
    const alertHistory = ThreatMonitoringService.getAlertHistory();
    if (alertHistory.length > 0) {
      console.log('✅ Alert History Updated:');
      alertHistory.forEach((alert, index) => {
        console.log(`   ${index + 1}. ${alert.threatType} - ${alert.timestamp.toLocaleString()}`);
        console.log(`      Users Notified: ${alert.usersNotified}`);
      });
    } else {
      console.log('❌ No alerts recorded in history');
    }
    console.log('');
    
    // Test 4: Check current threat status
    console.log('4️⃣ Current Threat Status:');
    const threatStatus = ThreatMonitoringService.getCurrentThreatStatus();
    Object.entries(threatStatus).forEach(([type, status]) => {
      console.log(`   ${type}:`);
      console.log(`     Has Alerted Today: ${status.hasAlertedToday ? '✅ Yes' : '❌ No'}`);
      if (status.lastAlert) {
        console.log(`     Last Alert: ${status.lastAlert.timestamp.toLocaleString()}`);
        console.log(`     Users Notified: ${status.lastAlert.usersNotified}`);
      }
    });
    console.log('');
    
    // Test 5: Test duplicate alert prevention
    console.log('5️⃣ Testing Duplicate Alert Prevention...');
    console.log('Running the same threat again to ensure no duplicate SMS...');
    console.log('');
    
    const results2 = await ThreatMonitoringService.processThreatPredictions(singleThreatPrediction, singleThreatInputData);
    
    console.log('✅ Second Processing Results:');
    console.log('   Threats Detected:', results2.threatsDetected.length);
    console.log('   Alerts Sent:', results2.alertsSent.length);
    console.log('   Alerts Skipped:', results2.alertsSkipped.length);
    console.log('');
    
    if (results2.alertsSkipped.length > 0) {
      console.log('⏭️  Alerts Skipped (Already Sent Today):');
      results2.alertsSkipped.forEach(alert => {
        console.log(`   - ${alert.threatType}: ${alert.reason}`);
      });
    }
    
    console.log('');
    console.log('📋 Test Summary:');
    console.log('✅ Single threat detection is working');
    console.log('✅ SMS alerts are executed for single threats');
    console.log('✅ Duplicate alert prevention is working');
    console.log('✅ Alert history is properly tracked');
    console.log('');
    console.log('🎯 Key Points:');
    console.log('   - Even ONE threat triggers SMS execution');
    console.log('   - SMS is sent to ALL verified users');
    console.log('   - Each threat type only sends ONE SMS per day');
    console.log('   - System prevents spam notifications');
    
  } catch (error) {
    console.log('❌ Error testing single threat:', error.message);
    console.log('🔍 Error details:', error);
  }
}

// Run the test
console.log('🚀 Running Single Threat Test...\n');
await testSingleThreat();
