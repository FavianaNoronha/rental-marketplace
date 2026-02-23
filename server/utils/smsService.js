/**
 * SMS Service for sending OTPs
 * Supports multiple providers: Twilio, MSG91, AWS SNS
 * Configure via environment variables
 */

const axios = require('axios');

class SMSService {
  constructor() {
    this.provider = process.env.SMS_PROVIDER || 'console'; // console, twilio, msg91, aws
    this.config = {
      twilio: {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        fromNumber: process.env.TWILIO_PHONE_NUMBER
      },
      msg91: {
        authKey: process.env.MSG91_AUTH_KEY,
        senderId: process.env.MSG91_SENDER_ID || 'CLOSLY',
        templateId: process.env.MSG91_TEMPLATE_ID
      },
      aws: {
        region: process.env.AWS_REGION || 'ap-south-1',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    };
  }

  /**
   * Send OTP via SMS
   * @param {string} phone - Phone number with country code (e.g., +919876543210)
   * @param {string} otp - 6-digit OTP
   * @param {string} purpose - Purpose of OTP (login, registration, etc.)
   */
  async sendOTP(phone, otp, purpose = 'login') {
    // Format phone number
    const formattedPhone = this.formatPhoneNumber(phone);
    
    // Generate message
    const message = this.generateMessage(otp, purpose);
    
    try {
      switch (this.provider) {
        case 'twilio':
          return await this.sendViaTwilio(formattedPhone, message);
        case 'msg91':
          return await this.sendViaMsg91(formattedPhone, otp, purpose);
        case 'aws':
          return await this.sendViaAWS(formattedPhone, message);
        case 'console':
          return await this.sendViaConsole(formattedPhone, otp, message);
        default:
          console.log(`[SMS] ${formattedPhone}: ${message}`);
          return { success: true, provider: 'console' };
      }
    } catch (error) {
      console.error('SMS Send Error:', error.message);
      throw new Error('Failed to send OTP. Please try again.');
    }
  }

  /**
   * Format phone number to E.164 format
   */
  formatPhoneNumber(phone) {
    // Remove all non-digits
    let cleaned = phone.replace(/\D/g, '');
    
    // Add +91 if not present (India)
    if (!cleaned.startsWith('91') && cleaned.length === 10) {
      cleaned = '91' + cleaned;
    }
    
    return '+' + cleaned;
  }

  /**
   * Generate OTP message
   */
  generateMessage(otp, purpose) {
    const purposeText = {
      login: 'login to',
      registration: 'register on',
      verification: 'verify your account on'
    };
    
    return `${otp} is your OTP to ${purposeText[purpose] || 'authenticate on'} Closetly. Valid for 10 minutes. Do not share with anyone.`;
  }

  /**
   * Send via Twilio
   */
  async sendViaTwilio(phone, message) {
    const { accountSid, authToken, fromNumber } = this.config.twilio;
    
    if (!accountSid || !authToken || !fromNumber) {
      throw new Error('Twilio credentials not configured');
    }

    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
    
    const response = await axios.post(url, 
      new URLSearchParams({
        To: phone,
        From: fromNumber,
        Body: message
      }),
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    return {
      success: true,
      provider: 'twilio',
      messageId: response.data.sid
    };
  }

  /**
   * Send via MSG91 (Popular in India)
   */
  async sendViaMsg91(phone, otp, purpose) {
    const { authKey, senderId, templateId } = this.config.msg91;
    
    if (!authKey) {
      throw new Error('MSG91 credentials not configured');
    }

    // Remove + from phone for MSG91
    const cleanPhone = phone.replace('+', '');

    const url = 'https://api.msg91.com/api/v5/otp';
    
    const response = await axios.post(url, {
      template_id: templateId,
      mobile: cleanPhone,
      authkey: authKey,
      otp: otp,
      sender: senderId,
      otp_expiry: 10 // minutes
    }, {
      headers: {
        'Content-Type': 'application/json',
        'authkey': authKey
      }
    });

    return {
      success: true,
      provider: 'msg91',
      messageId: response.data.request_id
    };
  }

  /**
   * Send via AWS SNS
   */
  async sendViaAWS(phone, message) {
    // Note: Requires AWS SDK
    // This is a placeholder - install @aws-sdk/client-sns for actual implementation
    const { region, accessKeyId, secretAccessKey } = this.config.aws;
    
    if (!accessKeyId || !secretAccessKey) {
      throw new Error('AWS credentials not configured');
    }

    console.log('[AWS SNS] Would send:', phone, message);
    
    // TODO: Implement AWS SNS when needed
    // const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');
    
    return {
      success: true,
      provider: 'aws',
      note: 'AWS SNS implementation pending'
    };
  }

  /**
   * Console logging (for development/testing)
   */
  async sendViaConsole(phone, otp, message) {
    console.log('\n' + '='.repeat(60));
    console.log('📱 SMS OTP (Development Mode)');
    console.log('='.repeat(60));
    console.log(`Phone: ${phone}`);
    console.log(`OTP: ${otp}`);
    console.log(`Message: ${message}`);
    console.log('='.repeat(60) + '\n');
    
    return {
      success: true,
      provider: 'console',
      otp: otp // Only in dev mode!
    };
  }
}

module.exports = new SMSService();
