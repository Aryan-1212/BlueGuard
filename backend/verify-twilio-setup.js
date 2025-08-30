import dotenv from 'dotenv';
import twilio from 'twilio';

// Load environment variables
dotenv.config("./../.env");

console.log('🔍 Verifying Twilio Setup...\n');

// Check environment variables
console.log('1️⃣ Environment Variables:');
console.log('TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID ? `✅ ${process.env.TWILIO_ACCOUNT_SID.substring(0, 10)}...` : '❌ Missing');
console.log('TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN ? '✅ Set' : '❌ Missing');
console.log('TWILIO_PHONE_NUMBER:', process.env.TWILIO_PHONE_NUMBER ? `✅ ${process.env.TWILIO_PHONE_NUMBER}` : '❌ Missing');
console.log('');

// Test Twilio client connection
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  try {
    console.log('2️⃣ Testing Twilio Connection...');
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    
    // Try to get account info
    const account = await client.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
    console.log('✅ Twilio connection successful!');
    console.log('Account Name:', account.friendlyName);
    console.log('Account Status:', account.status);
    console.log('');
    
    // Try to get phone numbers for this account
    console.log('3️⃣ Checking Phone Numbers for Your Account...');
    const phoneNumbers = await client.incomingPhoneNumbers.list();
    
    if (phoneNumbers.length > 0) {
      console.log('✅ Found phone numbers in your account:');
      phoneNumbers.forEach((number, index) => {
        console.log(`   ${index + 1}. ${number.phoneNumber} (${number.friendlyName || 'No name'})`);
        console.log(`      Capabilities: SMS: ${number.capabilities.SMS ? '✅' : '❌'}, Voice: ${number.capabilities.voice ? '✅' : '❌'}`);
      });
      console.log('');
      
      // Check if your configured number matches
      const configuredNumber = process.env.TWILIO_PHONE_NUMBER;
      const matchingNumber = phoneNumbers.find(num => num.phoneNumber === configuredNumber);
      
      if (matchingNumber) {
        console.log('✅ Your configured phone number matches your account!');
      } else {
        console.log('❌ MISMATCH DETECTED!');
        console.log(`   Configured: ${configuredNumber}`);
        console.log(`   Available: ${phoneNumbers.map(n => n.phoneNumber).join(', ')}`);
        console.log('');
        console.log('🔧 To fix this:');
        console.log(`   Update TWILIO_PHONE_NUMBER in your .env file to one of the numbers above`);
      }
    } else {
      console.log('❌ No phone numbers found in your account!');
      console.log('🔧 You need to buy a phone number:');
      console.log('   1. Go to console.twilio.com');
      console.log('   2. Phone Numbers → Buy a number');
      console.log('   3. Choose a number with SMS capabilities');
    }
    
  } catch (error) {
    console.log('❌ Twilio connection failed:');
    console.log('Error:', error.message);
    console.log('');
    console.log('🔧 Check your:');
    console.log('   - Account SID');
    console.log('   - Auth Token');
    console.log('   - Internet connection');
  }
} else {
  console.log('❌ Cannot test connection - missing credentials');
}

console.log('');
console.log('📋 Summary:');
console.log('1. Make sure TWILIO_PHONE_NUMBER in .env matches a number in your Twilio account');
console.log('2. Restart your backend server after updating .env');
console.log('3. Test again with: node test-twilio-send.js <phone_number>');
