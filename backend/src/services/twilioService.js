import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config("./../.env");

// Debug: Check if environment variables are loaded
console.log('🔍 Twilio Environment Check:');
console.log('TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID ? '✅ Loaded' : '❌ Missing');
console.log('TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN ? '✅ Loaded' : '❌ Missing');
console.log('TWILIO_PHONE_NUMBER:', process.env.TWILIO_PHONE_NUMBER ? '✅ Loaded' : '❌ Missing');

// Validate required environment variables
if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
  console.error('❌ Missing required Twilio environment variables!');
  console.error('Please check your .env file and ensure all Twilio credentials are set.');
}

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

/**
 * Send SMS message to a phone number
 * @param {string} to - Recipient phone number (with country code)
 * @param {string} message - Message content
 * @returns {Promise<Object>} - Twilio message object
 */
export const sendSMS = async (to, message) => {
  try {
    // Check if Twilio client is properly initialized
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      throw new Error('Twilio credentials not configured. Please check your .env file.');
    }

    // Format phone number to ensure it has country code
    const formattedNumber = formatPhoneNumber(to);
    
    console.log(`📤 Attempting to send SMS to ${formattedNumber}`);
    console.log(`📱 From: ${TWILIO_PHONE_NUMBER}`);
    console.log(`📝 Message: ${message.substring(0, 50)}...`);
    
    const messageResponse = await client.messages.create({
      body: message,
      from: TWILIO_PHONE_NUMBER,
      to: formattedNumber
    });

    console.log(`✅ SMS sent successfully to ${formattedNumber}`);
    console.log(`📱 Message SID: ${messageResponse.sid}`);
    
    return {
      success: true,
      messageId: messageResponse.sid,
      status: messageResponse.status
    };
  } catch (error) {
    console.error(`❌ Error sending SMS to ${to}:`, error.message);
    console.error(`🔍 Error details:`, error);
    
    // Provide more specific error messages
    if (error.message.includes('username is required')) {
      throw new Error('Twilio authentication failed. Please check your Account SID and Auth Token.');
    } else if (error.message.includes('not a valid phone number')) {
      throw new Error('Invalid phone number format. Please check the phone number.');
    } else if (error.message.includes('not a valid phone number')) {
      throw new Error('Invalid phone number format. Please check the phone number.');
    } else {
      throw new Error(`Failed to send SMS: ${error.message}`);
    }
  }
};

/**
 * Send verification code via SMS
 * @param {string} phoneNumber - User's phone number
 * @param {string} code - Verification code
 * @returns {Promise<Object>} - SMS result
 */
export const sendVerificationCode = async (phoneNumber, code) => {
  const message = `🔐 Your BlueGuard verification code is: ${code}\n\nThis code will expire in 10 minutes. Do not share this code with anyone.`;
  
  return await sendSMS(phoneNumber, message);
};

/**
 * Send welcome message via SMS
 * @param {string} phoneNumber - User's phone number
 * @param {string} userName - User's name
 * @returns {Promise<Object>} - SMS result
 */
export const sendWelcomeMessage = async (phoneNumber, userName) => {
  const message = `🎉 Welcome to BlueGuard, ${userName}!\n\nYour account has been successfully created. You'll receive coastal threat alerts and updates via SMS.\n\nThank you for joining us in protecting coastal communities!`;
  
  return await sendSMS(phoneNumber, message);
};

/**
 * Send coastal threat alert via SMS
 * @param {string} phoneNumber - User's phone number
 * @param {Object} alertData - Alert information
 * @returns {Promise<Object>} - SMS result
 */
export const sendThreatAlert = async (phoneNumber, alertData) => {
  const { threatType, severity, location, recommendation } = alertData;
  
  const message = `🚨 COASTAL THREAT ALERT 🚨\n\nType: ${threatType}\nSeverity: ${severity}\nLocation: ${location}\n\nRecommendation: ${recommendation}\n\nStay safe and follow local authorities' instructions.`;
  
  return await sendSMS(phoneNumber, message);
};

/**
 * Send crisis monitoring update via SMS
 * @param {string} phoneNumber - User's phone number
 * @param {Object} updateData - Update information
 * @returns {Promise<Object>} - SMS result
 */
export const sendCrisisUpdate = async (phoneNumber, updateData) => {
  const { timestamp, threats, status } = updateData;
  
  const message = `📊 Crisis Monitoring Update\n\nTime: ${timestamp}\nActive Threats: ${threats}\nStatus: ${status}\n\nMonitor your dashboard for detailed information.`;
  
  return await sendSMS(phoneNumber, message);
};

/**
 * Format phone number to ensure proper format for Twilio
 * @param {string} phoneNumber - Raw phone number
 * @returns {string} - Formatted phone number
 */
const formatPhoneNumber = (phoneNumber) => {
  // Remove all non-digit characters except +
  let cleaned = phoneNumber.replace(/[^\d+]/g, '');
  
  // If no country code, assume US (+1)
  if (!cleaned.startsWith('+')) {
    // If it's a 10-digit US number, add +1
    if (cleaned.length === 10) {
      cleaned = '+1' + cleaned;
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
      cleaned = '+' + cleaned;
    } else {
      // For other cases, add +1 as default
      cleaned = '+1' + cleaned;
    }
  }
  
  return cleaned;
};

/**
 * Validate phone number format
 * @param {string} phoneNumber - Phone number to validate
 * @returns {boolean} - Whether the phone number is valid
 */
export const validatePhoneNumber = (phoneNumber) => {
  const cleaned = phoneNumber.replace(/[^\d+]/g, '');
  
  // Basic validation: should be 10-15 digits with optional country code
  if (cleaned.startsWith('+')) {
    return cleaned.length >= 11 && cleaned.length <= 16;
  } else {
    return cleaned.length >= 10 && cleaned.length <= 15;
  }
};

export default {
  sendSMS,
  sendVerificationCode,
  sendWelcomeMessage,
  sendThreatAlert,
  sendCrisisUpdate,
  validatePhoneNumber
};
