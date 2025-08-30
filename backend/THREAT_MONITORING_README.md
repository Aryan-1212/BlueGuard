# 🚨 Threat Monitoring & SMS Alert System

This system automatically monitors coastal threats and sends SMS alerts to verified users **only once per threat type per day** to prevent spam notifications.

## 🎯 **Key Features**

### ✅ **Smart Alert Management**
- **One SMS per threat type per day** - No spam notifications
- **Configurable thresholds** for each threat type
- **Automatic alert tracking** with daily reset
- **Alert history** for monitoring and debugging

### ✅ **Threat Types Supported**
- **ALGAL_BLOOM** - Monitors water quality and algal growth
- **CYCLONE** - Tracks storm and cyclone threats
- **EROSION** - Monitors coastal erosion risks
- **SEA_LEVEL** - Tracks sea level rise threats

### ✅ **SMS Integration**
- **Automatic SMS sending** to all verified users
- **Personalized messages** with user names
- **Rich threat information** including recommendations
- **Twilio integration** for reliable delivery

## 🚀 **How It Works**

### 1. **Threat Detection**
```javascript
// When your AI model makes predictions
const predictions = {
  ALGAL_BLOOM: { status: 'THREAT', confidence: 0.75, level: 'High Level' },
  EROSION: { status: 'THREAT', confidence: 0.85, level: 'High Level' }
};

const inputData = {
  'LOCATION': 'Coastal Area A',
  'CHLOROPHYLL MG_M3': 2.8,
  'COASTAL EROSION_RISK': 78
};
```

### 2. **Automatic Processing**
```javascript
// Send to backend for processing
const response = await fetch('/api/threats/process', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ predictions, inputData })
});
```

### 3. **Smart SMS Alerts**
- **First time**: SMS sent to all verified users
- **Subsequent times**: Alert skipped (already notified today)
- **Next day**: New alerts can be sent again

## 📡 **API Endpoints**

### **Process Threat Predictions**
```
POST /api/threats/process
```
**Body:**
```json
{
  "predictions": {
    "ALGAL_BLOOM": { "status": "THREAT", "confidence": 0.75, "level": "High Level" },
    "EROSION": { "status": "THREAT", "confidence": 0.85, "level": "High Level" }
  },
  "inputData": {
    "LOCATION": "Coastal Area A",
    "CHLOROPHYLL MG_M3": 2.8,
    "COASTAL EROSION_RISK": 78
  }
}
```

### **Get Threat Status**
```
GET /api/threats/status
```
**Response:**
```json
{
  "success": true,
  "threatStatus": {
    "ALGAL_BLOOM": {
      "hasAlertedToday": true,
      "lastAlert": { "timestamp": "2024-12-25T10:30:00.000Z", "usersNotified": 5 }
    }
  },
  "alertHistory": [...]
}
```

### **Get Threat Configuration**
```
GET /api/threats/config
```
**Response:**
```json
{
  "success": true,
  "configs": {
    "ALGAL_BLOOM": {
      "threshold": 0.6,
      "name": "Algal Bloom",
      "severity": "Medium",
      "recommendation": "Monitor water quality and avoid affected areas"
    }
  }
}
```

### **Update Threat Configuration**
```
PUT /api/threats/config/ALGAL_BLOOM
Authorization: Bearer <token>
```
**Body:**
```json
{
  "threshold": 0.7,
  "severity": "High",
  "recommendation": "Immediate action required"
}
```

### **Test Threat Alert**
```
POST /api/threats/test-alert
Authorization: Bearer <token>
```
**Body:**
```json
{
  "threatType": "ALGAL_BLOOM",
  "phoneNumber": "+15551234567"
}
```

## 🔧 **Configuration**

### **Default Thresholds**
```javascript
ALGAL_BLOOM: 60% confidence
CYCLONE: 70% confidence  
EROSION: 50% confidence
SEA_LEVEL: 80% confidence
```

### **Customizing Thresholds**
```javascript
// Update threshold for algal bloom
await fetch('/api/threats/config/ALGAL_BLOOM', {
  method: 'PUT',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ threshold: 0.8 }) // 80%
});
```

## 📱 **SMS Message Examples**

### **Algal Bloom Alert**
```
🚨 COASTAL THREAT ALERT 🚨

Hi John,

Type: Algal Bloom
Severity: Medium
Location: Coastal Area A
Time: 12/25/2024, 2:30:00 PM
Confidence: 75.0%

Additional Info: Chlorophyll Level: 2.8 mg/m³

Recommendation: Monitor water quality and avoid affected areas

Stay safe and follow local authorities' instructions.

- BlueGuard Team
```

### **Erosion Alert**
```
🚨 COASTAL THREAT ALERT 🚨

Hi Sarah,

Type: Coastal Erosion
Severity: High
Location: Coastal Area A
Time: 12/25/2024, 2:30:00 PM
Confidence: 85.0%

Additional Info: Risk Index: 78

Recommendation: Avoid coastal areas and monitor erosion rates

Stay safe and follow local authorities' instructions.

- BlueGuard Team
```

## 🎯 **Frontend Integration**

### **1. Send Predictions for Processing**
```javascript
// In your dashboard or prediction component
const processThreats = async (predictions, inputData) => {
  try {
    const response = await fetch('/api/threats/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ predictions, inputData })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Threats processed:', result.results);
      
      // Show results to user
      if (result.results.alertsSent.length > 0) {
        showNotification(`SMS alerts sent for ${result.results.alertsSent.length} threats`);
      }
      
      if (result.results.alertsSkipped.length > 0) {
        showNotification(`${result.results.alertsSkipped.length} threats already alerted today`);
      }
    }
  } catch (error) {
    console.error('Failed to process threats:', error);
  }
};
```

### **2. Check Threat Status**
```javascript
// Check if alerts have been sent today
const checkThreatStatus = async () => {
  try {
    const response = await fetch('/api/threats/status');
    const status = await response.json();
    
    // Update UI based on status
    Object.entries(status.threatStatus).forEach(([type, info]) => {
      if (info.hasAlertedToday) {
        // Show "Already Alerted" indicator
        updateThreatUI(type, 'alerted');
      } else {
        // Show "Ready to Alert" indicator
        updateThreatUI(type, 'ready');
      }
    });
  } catch (error) {
    console.error('Failed to get threat status:', error);
  }
};
```

### **3. Real-time Integration**
```javascript
// Call this whenever you get new predictions
useEffect(() => {
  if (predictions && inputData) {
    processThreats(predictions, inputData);
  }
}, [predictions, inputData]);
```

## 🧪 **Testing**

### **Run Test Script**
```bash
node test-threat-monitoring.js
```

### **Test Individual Endpoints**
```bash
# Check threat status
curl http://localhost:5000/api/threats/status

# Get configuration
curl http://localhost:5000/api/threats/config

# Process test threats
curl -X POST http://localhost:5000/api/threats/process \
  -H "Content-Type: application/json" \
  -d '{"predictions":{"ALGAL_BLOOM":{"status":"THREAT","confidence":0.75}},"inputData":{"LOCATION":"Test Area"}}'
```

## ⚙️ **Customization**

### **Adding New Threat Types**
```javascript
// In ThreatMonitoringService.js
static threatConfigs = {
  // ... existing threats
  TSUNAMI: {
    threshold: 0.9, // 90% confidence
    name: 'Tsunami Warning',
    severity: 'Critical',
    recommendation: 'Immediate evacuation required'
  }
};
```

### **Modifying Alert Logic**
```javascript
// Customize when alerts are sent
const shouldSendAlert = (threatType, confidence, status) => {
  // Add your custom logic here
  return status === 'THREAT' && confidence >= config.threshold;
};
```

## 🔒 **Security & Privacy**

- **Authentication required** for configuration changes
- **User consent** for SMS notifications
- **Phone verification** required before alerts
- **Rate limiting** to prevent abuse
- **Audit logging** of all alert activities

## 📊 **Monitoring & Analytics**

### **Alert Metrics**
- Total alerts sent per day
- Users notified per threat type
- Alert delivery success rates
- Threat frequency patterns

### **Dashboard Integration**
```javascript
// Get analytics for your dashboard
const getAlertAnalytics = async () => {
  const response = await fetch('/api/threats/status');
  const data = await response.json();
  
  // Process data for charts and metrics
  return processAnalytics(data);
};
```

## 🚀 **Next Steps**

1. **Test the system** with `node test-threat-monitoring.js`
2. **Integrate with your frontend** by calling `/api/threats/process`
3. **Customize thresholds** based on your requirements
4. **Monitor alert delivery** in Twilio console
5. **Set up user preferences** for different threat types

---

**🎉 Your threat monitoring system is now ready to automatically protect coastal communities with smart SMS alerts!**
