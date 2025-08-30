# 🚀 Twilio SMS Integration Setup Guide

This guide explains how to set up and use the Twilio SMS integration for BlueGuard's coastal threat alert system.

## 📋 Prerequisites

1. **Twilio Account**: Sign up at [twilio.com](https://www.twilio.com)
2. **Node.js Backend**: Ensure your backend is running
3. **Environment Variables**: Configure your `.env` file

## 🔑 Required Environment Variables

Add these to your `.env` file:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

## 📱 Getting Your Twilio Credentials

### 1. Account SID & Auth Token
1. Log into your [Twilio Console](https://console.twilio.com/)
2. Go to **Dashboard** → **Account Info**
3. Copy your **Account SID** and **Auth Token**

### 2. Phone Number
1. In Twilio Console, go to **Phone Numbers** → **Manage** → **Active numbers**
2. Buy a new number or use an existing one
3. Copy the phone number (format: +1234567890)

## 🚀 Features Implemented

### 1. **User Registration with Phone Verification**
- Sends 6-digit verification code via SMS
- Code expires in 10 minutes
- Phone number validation and formatting

### 2. **Welcome Messages**
- Personalized welcome SMS after phone verification
- Includes user's name and welcome message

### 3. **Coastal Threat Alerts**
- Real-time threat notifications
- Personalized with user's name
- Includes threat type, severity, location, and recommendations

### 4. **Crisis Monitoring Updates**
- Regular updates on crisis status
- Threat summaries and active threat counts
- Personalized notifications

### 5. **Emergency Notifications**
- Evacuation notices
- Weather warnings
- System maintenance alerts

## 📡 API Endpoints

### Authentication & Phone Verification
```
POST /api/auth/register          - User registration with SMS verification
POST /api/auth/verify-phone      - Verify phone number with code
POST /api/auth/resend-verification - Resend verification code
```

### SMS Notifications (via services)
```javascript
import SMSNotificationService from '../services/smsNotificationService.js';

// Send threat alert to all users
await SMSNotificationService.sendThreatAlertToAll(alertData);

// Send crisis update to specific users
await SMSNotificationService.sendCrisisUpdateToUsers(userIds, updateData);

// Send personalized threat alert
await SMSNotificationService.sendThreatAlert(phoneNumber, alertData, userName);
```

## 🔧 Usage Examples

### 1. **Sending Threat Alerts**
```javascript
const alertData = {
  threatType: "Sea Level Rise",
  severity: "High",
  location: "Coastal Area A",
  recommendation: "Monitor water levels and prepare for potential flooding",
  timestamp: new Date().toLocaleString()
};

// Send to all verified users
const result = await SMSNotificationService.sendThreatAlertToAll(alertData);
console.log(`Alert sent to ${result.successCount} users`);
```

### 2. **Sending Crisis Updates**
```javascript
const updateData = {
  timestamp: new Date().toLocaleString(),
  threats: "2 active threats detected",
  status: "Monitoring",
  summary: "Sea level and erosion threats detected in coastal regions"
};

// Send to specific users
const userIds = ['user1', 'user2', 'user3'];
const result = await SMSNotificationService.sendCrisisUpdateToUsers(userIds, updateData);
```

### 3. **Sending Emergency Notices**
```javascript
const evacuationData = {
  location: "Coastal Zone B",
  reason: "Rising sea levels and storm surge",
  safeZone: "Community Center, 123 Main St",
  instructions: "Bring essential items only, follow evacuation routes"
};

await SMSNotificationService.sendEvacuationNotice(phoneNumber, evacuationData, userName);
```

## 📊 SMS Message Templates

### Verification Code
```
🔐 Your BlueGuard verification code is: 123456

This code will expire in 10 minutes. Do not share this code with anyone.
```

### Welcome Message
```
🎉 Welcome to BlueGuard, John!

Your account has been successfully created. You'll receive coastal threat alerts and updates via SMS.

Thank you for joining us in protecting coastal communities!
```

### Threat Alert
```
🚨 COASTAL THREAT ALERT 🚨

Hi John,

Type: Sea Level Rise
Severity: High
Location: Coastal Area A
Time: 12/25/2024, 2:30:00 PM

Recommendation: Monitor water levels and prepare for potential flooding

Stay safe and follow local authorities' instructions.

- BlueGuard Team
```

## ⚠️ Important Notes

### 1. **Phone Number Formatting**
- Automatically adds country code (+1 for US) if missing
- Removes spaces and special characters
- Validates format before sending

### 2. **Rate Limiting**
- Twilio has rate limits (check your plan)
- Implement delays between bulk SMS if needed
- Monitor your Twilio usage dashboard

### 3. **Error Handling**
- SMS failures don't break user registration
- All errors are logged for debugging
- Failed SMS are tracked in results

### 4. **Cost Considerations**
- Each SMS has a cost (check Twilio pricing)
- Test thoroughly in development
- Monitor usage in production

## 🧪 Testing

### 1. **Test Phone Number**
Use a real phone number for testing (Twilio doesn't support fake numbers)

### 2. **Test Messages**
```javascript
// Send test message
await SMSNotificationService.sendTestMessage(phoneNumber, "Test User");
```

### 3. **Verification Flow**
1. Register user → SMS verification code sent
2. Verify phone → Welcome message sent
3. Test various notification types

## 🔒 Security Considerations

1. **Verification Codes**: 6-digit random codes, expire in 10 minutes
2. **Phone Validation**: Server-side validation of phone numbers
3. **Rate Limiting**: Implement rate limiting for verification requests
4. **Logging**: All SMS activities are logged for audit purposes

## 📈 Monitoring & Analytics

### 1. **Twilio Console**
- Monitor message delivery status
- View usage statistics
- Check error logs

### 2. **Application Logs**
- SMS success/failure logs
- User verification tracking
- Notification delivery status

### 3. **User Preferences**
- Users can control SMS preferences
- Opt-out options for different notification types
- Personalized notification settings

## 🚨 Troubleshooting

### Common Issues

1. **"Invalid phone number"**
   - Check phone number format
   - Ensure country code is included
   - Verify number is not blocked

2. **"Authentication failed"**
   - Verify TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN
   - Check if credentials are correct
   - Ensure environment variables are loaded

3. **"Phone number not verified"**
   - User must verify phone before receiving alerts
   - Check verification status in database
   - Resend verification code if needed

### Debug Steps

1. Check environment variables
2. Verify Twilio credentials
3. Test with simple SMS first
4. Check application logs
5. Monitor Twilio console for errors

## 📞 Support

- **Twilio Support**: [support.twilio.com](https://support.twilio.com)
- **Documentation**: [twilio.com/docs](https://www.twilio.com/docs)
- **Community**: [twilio.com/community](https://www.twilio.com/community)

---

**Note**: This integration requires a Twilio account with SMS capabilities. Free trial accounts have limitations on SMS sending.
