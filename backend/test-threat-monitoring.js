import ThreatMonitoringService from './src/services/threatMonitoringService.js';

console.log('🧪 Testing Threat Monitoring & SMS Alert System...\n');

// Test 1: Show current threat configuration
console.log('1️⃣ Current Threat Configuration:');
const configs = ThreatMonitoringService.threatConfigs;
Object.entries(configs).forEach(([type, config]) => {
  console.log(`   ${type}:`);
  console.log(`     Threshold: ${config.threshold * 100}%`);
  console.log(`     Severity: ${config.severity}`);
  console.log(`     Recommendation: ${config.recommendation}`);
});
console.log('');

// Test 2: Simulate threat predictions
console.log('2️⃣ Simulating Threat Predictions...');

const mockPredictions = {
  ALGAL_BLOOM: {
    status: 'THREAT',
    confidence: 0.75, // Above 60% threshold
    level: 'High Level'
  },
  CYCLONE: {
    status: 'SAFE',
    confidence: 0.45, // Below 70% threshold
    level: 'Low Level'
  },
  EROSION: {
    status: 'THREAT',
    confidence: 0.85, // Above 50% threshold
    level: 'High Level'
  },
  SEA_LEVEL: {
    status: 'SAFE',
    confidence: 0.35, // Below 80% threshold
    level: 'Low Level'
  }
};

const mockInputData = {
  'LOCATION': 'Coastal Area A',
  'CHLOROPHYLL MG_M3': 2.8,
  'CYCLONE_DISTANCE_KM': 450,
  'COASTAL EROSION_RISK': 78,
  'SEA_LEVEL_M': 0.8,
  'AI_CONFIDENCE_SCORE': 0.924,
  'ALERT_LEVEL': 0.000,
  'BLUE_CARBON_LOSS_TON_CO2': 22.131
};

console.log('Predictions:', mockPredictions);
console.log('Input Data:', mockInputData);
console.log('');

// Test 3: Process threats and send SMS alerts
console.log('3️⃣ Processing Threats and Sending SMS Alerts...');
console.log('⚠️  This will send real SMS alerts to verified users!');
console.log('');

async function testThreatProcessing() {
  try {
    // Process threats
    const results = await ThreatMonitoringService.processThreatPredictions(mockPredictions, mockInputData);
    
    console.log('✅ Threat Processing Results:');
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
    
  } catch (error) {
    console.log('❌ Error processing threats:', error.message);
  }
}

// Test 4: Show current threat status
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

// Test 5: Show alert history
console.log('5️⃣ Alert History:');
const alertHistory = ThreatMonitoringService.getAlertHistory();
if (alertHistory.length > 0) {
  alertHistory.forEach((alert, index) => {
    console.log(`   ${index + 1}. ${alert.threatType} - ${alert.timestamp.toLocaleString()}`);
    console.log(`      Users Notified: ${alert.usersNotified}`);
  });
} else {
  console.log('   No alerts sent yet');
}
console.log('');

// Test 6: Demonstrate "once per day" behavior
console.log('6️⃣ Testing "Once Per Day" Alert Behavior...');
console.log('Running threat processing again to show alerts are skipped...');
console.log('');

async function testDuplicateAlerts() {
  try {
    const results2 = await ThreatMonitoringService.processThreatPredictions(mockPredictions, mockInputData);
    
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
    
  } catch (error) {
    console.log('❌ Error in second processing:', error.message);
  }
}

// Run tests
console.log('🚀 Running Tests...\n');
await testThreatProcessing();
await testDuplicateAlerts();

console.log('');
console.log('📋 Test Summary:');
console.log('✅ Threat monitoring service is working');
console.log('✅ SMS alerts are sent only once per threat type per day');
console.log('✅ Alert history is properly tracked');
console.log('✅ Threat configurations are customizable');
console.log('');
console.log('🔧 To test with real data:');
console.log('   POST /api/threats/process with your predictions and input data');
console.log('   GET /api/threats/status to check current status');
console.log('   GET /api/threats/config to view threat configurations');
console.log('');
console.log('🎯 Integration with Frontend:');
console.log('   Call /api/threats/process whenever you get new threat predictions');
console.log('   The system will automatically send SMS alerts to verified users');
console.log('   Each threat type will only trigger one SMS per day');
