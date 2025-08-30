import dotenv from 'dotenv';
import { sendSMS, validatePhoneNumber } from './src/services/twilioService.js';

// Load environment variables
dotenv.config();

console.log('🧪 Testing Twilio Configuration...\n');

// Test 1: Check environment variables
console.log('1️⃣ Environment Variables Check:');
console.log('TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID ? '✅ Set' : '❌ Missing');
console.log('TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN ? '✅ Set' : '❌ Missing');
console.log('TWILIO_PHONE_NUMBER:', process.env.TWILIO_PHONE_NUMBER ? '✅ Set' : '❌ Missing');
console.log('');

// Test 2: Validate phone number format
console.log('2️⃣ Phone Number Validation Test:');
const testNumbers = ['5551234567', '+15551234567', '555-123-4567', '(555) 123-4567'];
testNumbers.forEach(num => {
  const isValid = validatePhoneNumber(num);
  console.log(`${num}: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
});
console.log('');

// Test 3: Test SMS sending (only if credentials are set)
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
  console.log('3️⃣ SMS Test (will attempt to send real SMS):');
  console.log('⚠️  This will send a real SMS to the test number!');
  console.log('⚠️  Make sure you have a real phone number to test with!');
  console.log('');
  
  // Ask user if they want to proceed
  console.log('To test SMS sending, run:');
  console.log('node test-twilio-send.js <phone_number>');
  console.log('');
} else {
  console.log('3️⃣ SMS Test: ❌ Skipped - Missing Twilio credentials');
  console.log('');
}

// Test 4: Environment file check
console.log('4️⃣ Environment File Check:');
console.log('Make sure you have a .env file in your backend directory with:');
console.log('TWILIO_ACCOUNT_SID=your_account_sid_here');
console.log('TWILIO_AUTH_TOKEN=your_auth_token_here');
console.log('TWILIO_PHONE_NUMBER=+1234567890');
console.log('');

console.log('🔧 To fix the "username is required" error:');
console.log('1. Create a .env file in your backend directory');
console.log('2. Add your Twilio credentials from console.twilio.com');
console.log('3. Restart your backend server');
console.log('4. Test again with this script');
