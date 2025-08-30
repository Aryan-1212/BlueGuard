import dotenv from 'dotenv';
import { sendSMS } from './src/services/twilioService.js';

// Load environment variables
dotenv.config();

// Get phone number from command line argument
const testPhoneNumber = process.argv[2];

if (!testPhoneNumber) {
  console.log('❌ Please provide a phone number to test with:');
  console.log('node test-twilio-send.js <phone_number>');
  console.log('Example: node test-twilio-send.js +15551234567');
  process.exit(1);
}

console.log('🧪 Testing Twilio SMS Sending...\n');
console.log(`📱 Test phone number: ${testPhoneNumber}`);
console.log('');

// Check if credentials are set
if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
  console.log('❌ Missing Twilio credentials!');
  console.log('Please create a .env file with your Twilio credentials.');
  process.exit(1);
}

// Test SMS sending
async function testSMSSending() {
  try {
    console.log('📤 Sending test SMS...');
    
    const testMessage = `🧪 Test message from BlueGuard!\n\nThis is a test SMS to verify your Twilio integration is working correctly.\n\nTime: ${new Date().toLocaleString()}\n\n- BlueGuard Team`;
    
    const result = await sendSMS(testPhoneNumber, testMessage);
    
    console.log('✅ Test SMS sent successfully!');
    console.log('📱 Message ID:', result.messageId);
    console.log('📊 Status:', result.status);
    console.log('');
    console.log('🎉 Your Twilio integration is working!');
    
  } catch (error) {
    console.log('❌ Failed to send test SMS:');
    console.log(error.message);
    console.log('');
    console.log('🔧 Troubleshooting tips:');
    console.log('1. Check your Twilio credentials in .env file');
    console.log('2. Verify your Twilio account has SMS capabilities');
    console.log('3. Check your Twilio account balance');
    console.log('4. Ensure the phone number format is correct');
  }
}

// Run the test
testSMSSending();
