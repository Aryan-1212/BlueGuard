import dotenv from 'dotenv';
import twilio from 'twilio';

// Load environment variables
dotenv.config();

console.log('🔍 Testing Twilio Connection...\n');

// Check environment variables
console.log('1️⃣ Environment Variables:');
console.log('TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID ? `✅ ${process.env.TWILIO_ACCOUNT_SID.substring(0, 10)}...` : '❌ Missing');
console.log('TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN ? '✅ Set' : '❌ Missing');
console.log('TWILIO_PHONE_NUMBER:', process.env.TWILIO_PHONE_NUMBER ? `✅ ${process.env.TWILIO_PHONE_NUMBER}` : '❌ Missing');
console.log('');

if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
  console.log('❌ Cannot test connection - missing credentials');
  console.log('🔧 Please create a .env file with your Twilio credentials');
  process.exit(1);
}

async function testTwilioConnection() {
  try {
    console.log('2️⃣ Testing Twilio Client Connection...');
    
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    
    // Try to get account info
    const account = await client.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
    console.log('✅ Twilio connection successful!');
    console.log('Account Name:', account.friendlyName);
    console.log('Account Status:', account.status);
    console.log('');
    
    // Check phone numbers
    console.log('3️⃣ Checking Phone Numbers...');
    const phoneNumbers = await client.incomingPhoneNumbers.list();
    
    if (phoneNumbers.length > 0) {
      console.log('✅ Found phone numbers:');
      phoneNumbers.forEach((number, index) => {
        console.log(`   ${index + 1}. ${number.phoneNumber} (${number.friendlyName || 'No name'})`);
        console.log(`      SMS: ${number.capabilities.SMS ? '✅' : '❌'}, Voice: ${number.capabilities.voice ? '✅' : '❌'}`);
      });
      console.log('');
      
      // Check if configured number matches
      const configuredNumber = process.env.TWILIO_PHONE_NUMBER;
      const matchingNumber = phoneNumbers.find(num => num.phoneNumber === configuredNumber);
      
      if (matchingNumber) {
        console.log('✅ Configured phone number matches your account!');
        console.log('✅ Ready to send SMS alerts!');
      } else {
        console.log('❌ MISMATCH: Configured number not found in account');
        console.log(`   Configured: ${configuredNumber}`);
        console.log(`   Available: ${phoneNumbers.map(n => n.phoneNumber).join(', ')}`);
      }
    } else {
      console.log('❌ No phone numbers found in your account');
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
}

// Run the test
testTwilioConnection();
