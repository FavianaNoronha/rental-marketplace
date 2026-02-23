# 📱 SMS OTPSetup Guide for Phone Login

## Overview
Closetly now supports phone number login with OTP verification. Users can choose between:
- **Email + Password** (traditional)
- **Phone + OTP** (passwordless, India-focused)

---

## 🔧 SMS Provider Options

### Option 1: Console Mode (Development - FREE)
**Best for**: Testing locally, no setup required

**Setup**:
```env
# server/.env
SMS_PROVIDER=console
```

OTPs will be logged to server console. Perfect for development!

---

### Option 2: MSG91 (Recommended for India)
**Best for**: Production in India, affordable pricing

**Pricing**: 
- Free trial with credits
- ₹0.15-0.30 per SMS
- OTP templates available

**Setup**:
1. Sign up: https://msg91.com/signup
2. Verify your account
3. Get your Auth Key: Dashboard → API → Show Auth Key
4. Create OTP template (or use default)

```env
# server/.env
SMS_PROVIDER=msg91
MSG91_AUTH_KEY=your_auth_key_here
MSG91_SENDER_ID=CLOSLY
MSG91_TEMPLATE_ID=your_template_id
```

**Template Example**:
```
##OTP## is your OTP to login to Closetly. Valid for 10 minutes. Do not share with anyone.
```

---

### Option 3: Twilio (Global)
**Best for**: International markets, reliable delivery

**Pricing**:
- $15 trial credit (free to start!)
- ~$0.0075 per SMS (India)

**Setup**:
1. Sign up: https://www.twilio.com/try-twilio
2. Get phone number from console
3. Copy credentials from Dashboard

```env
# server/.env
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

---

### Option 4: AWS SNS (Advanced)
**Best for**: High scale, existing AWS infrastructure

**Pricing**:
- $0.00645 per SMS (India with SNS)
- Requires AWS account

```env
# server/.env
SMS_PROVIDER=aws
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

**Note**: Requires installing `@aws-sdk/client-sns`

---

## 🚀 Quick Start (MSG91 - Recommended)

### 1. Create MSG91 Account
```bash
1. Go to: https://msg91.com/signup
2. Verify email and phone
3. Get FREE trial credits
```

### 2. Get API Credentials
```bash
1. Login to MSG91 dashboard
2. Go to: API → Auth Key
3. Copy "Auth Key"
```

### 3. Create OTP Template (Optional)
```bash
1. Go to: OTP → Create Template
2. Template name: closetly_login
3. Content: ##OTP## is your OTP to login to Closetly. Valid for 10 minutes.
4. Copy template ID after creating
```

### 4. Update Environment Variables
```bash
# In Render.com or your server
SMS_PROVIDER=msg91
MSG91_AUTH_KEY=your_auth_key_from_step_2
MSG91_SENDER_ID=CLOSLY
MSG91_TEMPLATE_ID=your_template_id_from_step_3
```

### 5. Restart Server
```bash
# Backend will automatically start using MSG91
```

---

## 🧪 Testing

### Local Development (Console Mode)
```bash
# No SMS provider needed!
# OTP will print in terminal

1. Start backend: npm start (in server folder)
2. Click "Phone OTP" on login page
3. Enter phone: 9876543210
4. Check terminal for OTP
5. Enter OTP and login
```

### With Real SMS (MSG91/Twilio)
```bash
1. Set environment variables
2. Restart server
3. Try login with your real phone number
4. You'll receive actual SMS
```

---

## 📊 Environment Variables Reference

### Development
```env
NODE_ENV=development
SMS_PROVIDER=console
```

### Production (MSG91)
```env
NODE_ENV=production
SMS_PROVIDER=msg91
MSG91_AUTH_KEY=your_auth_key
MSG91_SENDER_ID=CLOSLY
MSG91_TEMPLATE_ID=template_id (optional)
```

### Production (Twilio)
```env
NODE_ENV=production
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=ACxxxx
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
```

---

## 🔐 Security Best Practices

1. **Rate Limiting**: Already implemented (5 attempts max per OTP)
2. **OTP Expiry**: 10 minutes
3. **Auto-deletion**: Expired OTPs automatically deleted from DB
4. **Phone Validation**: Only accepts valid Indian numbers (6-9 starting digits)
5. **No OTP in Response**: OTPs never sent in API response (except dev mode)

---

## 💰 Cost Comparison

| Provider | India SMS Cost | Trial/Free Tier | Best For |
|----------|---------------|----------------|----------|
| Console | FREE | Unlimited | Development |
| MSG91 | ₹0.15-0.30 | Free credits | India production |
| Twilio | ~₹0.60 | $15 credit | Global/Reliable |
| AWS SNS | ~₹0.50 | AWS Free tier | High scale |

**Recommendation for India**: MSG91 for cost-effectiveness

---

## 🐛 Troubleshooting

### OTP not received?
1. Check SMS provider credentials in env variables
2. Check server logs for errors
3. Verify phone number format (10 digits, starts with 6-9)
4. Check SMS provider dashboard for delivery status

### "Invalid OTP" error?
1. OTPs expire in 10 minutes
2. Maximum 5 attempts per OTP
3. Check if OTP copied correctly (6 digits)
4. In dev mode, check console for OTP

### Phone already registered?
- Same phone can only have one account
- User with existing phone will directly login (no name needed)
- New phone numbers require name during first login

---

## 📱 User Experience Flow

### First-time User:
1. Click "Phone OTP" tab
2. Enter phone number → Send OTP
3. Receive SMS with 6-digit OTP
4. Enter OTP
5. System asks for name (new user)
6. Account created → Logged in

### Returning User:
1. Click "Phone OTP" tab
2. Enter phone number → Send OTP
3. Receive SMS with OTP
4. Enter OTP → Logged in (no name needed)

---

## 🔄 Migration from Email to Phone

Users can have both:
- Email login works as before
- Phone login works independently
- Future: Allow linking email to phone account

---

##  Next Steps

1. **Choose SMS Provider** (MSG91 recommended)
2. **Sign up and get API keys**
3. **Add environment variables to Render**
4. **Test phone login locally first**
5. **Deploy and test in production**
6. **Monitor SMS costs in provider dashboard**

---

**Questions?** The backend supports all providers - just set the env variables and it works! 🚀
