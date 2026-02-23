# 📱 Closetly Mobile App - Complete Guide

**Platform**: React Native + Expo  
**iOS**: ✅ Supported  
**Android**: ✅ Supported  
**Last Updated**: February 24, 2026

---

## 🚀 Quick Start (Test on Your Phone in 5 Minutes)

### Step 1: Install Expo Go on Your Phone

**iPhone/iPad**:
- Open App Store
- Search for "Expo Go"
- Download: https://apps.apple.com/app/expo-go/id982107779

**Android**:
- Open Google Play Store
- Search for "Expo Go"
- Download: https://play.google.com/store/apps/details?id=host.exp.exponent

### Step 2: Install Dependencies
```bash
cd /Users/faviananoronha/Developer/rental-marketplace/mobile
npm install
```

### Step 3: Update API URL

Make sure the app points to your backend:

```bash
# Open app.json
code app.json  # or nano app.json
```

Update the `apiUrl` in the `extra` section:
```json
{
  "expo": {
    "extra": {
      "apiUrl": "https://closetly-backend-vbm0.onrender.com/api"
    }
  }
}
```

Save the file.

### Step 4: Start the App
```bash
npm start
```

You'll see:
```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
```

### Step 5: Scan QR Code

**iPhone**:
1. Open the default Camera app
2. Point it at the QR code in terminal
3. Tap the notification that appears
4. App will open in Expo Go

**Android**:
1. Open Expo Go app
2. Tap "Scan QR Code"
3. Point camera at QR code
4. App will load

### Step 6: Test the App! 🎉

You should see:
- Beautiful gradient header
- Category cards (Utsav, Safar, Alankrit, Niche-Luxe)
- **Bento Grid Layout** with featured products
- Trust badges (Sanitized, KYC Verified)
- Distance tags (e.g., "2.3 km")

Try:
1. **Login with Email**:
   - Email: demo@closetly.com
   - Password: Demo@123

2. **Login with Phone OTP**:
   - Phone: 9876543210
   - Check your backend terminal for OTP
   - Or set up real SMS (see SMS_OTP_SETUP.md)

---

## 🏗️ Build Production App (APK/IPA)

Want to install the app permanently on your phone or share with friends? Build a standalone app!

### Option A: Development Build (Recommended for Testing)

#### Step 1: Install EAS CLI
```bash
npm install -g eas-cli
```

#### Step 2: Login to Expo
```bash
eas login
```

Create a free Expo account if you don't have one.

#### Step 3: Configure Project
```bash
cd /Users/faviananoronha/Developer/rental-marketplace/mobile
eas build:configure
```

Select:
- Platform: **All** (iOS + Android)

This creates `eas.json` file.

#### Step 4: Build Android APK (Free)
```bash
eas build --platform android --profile preview
```

This will:
- Upload your code to Expo servers
- Build the APK in the cloud (10-20 minutes)
- Give you a download link

**Cost**: FREE ✅

#### Step 5: Download and Install APK

Once build completes:
1. You'll get a URL like: `https://expo.dev/artifacts/eas/...`
2. Open URL on your Android phone
3. Download APK
4. Install it (allow "Install from unknown sources" if prompted)

#### Step 6: Build iOS App (Requires Apple Developer Account)
```bash
eas build --platform ios --profile preview
```

**Requirements**:
- Apple Developer Account ($99/year)
- Need to provide:
  - Bundle ID: `com.closetly.app`
  - Apple ID credentials
  - Certificates (EAS handles automatically)

**Output**: IPA file you can install via TestFlight

---

### Option B: APK for Direct Sharing (No Expo Account Needed)

Build a standalone APK that friends can install directly:

#### Step 1: Update app.json
```json
{
  "expo": {
    "android": {
      "package": "com.closetly.app",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#6366F1"
      }
    }
  }
}
```

#### Step 2: Build APK
```bash
eas build -p android --profile preview
```

#### Step 3: Share APK with Friends
1. Download APK from Expo dashboard
2. Upload to Google Drive or Dropbox
3. Share link with friends
4. They download and install on Android phones

**Note**: iOS requires TestFlight or App Store (no direct APK sharing)

---

## 📲 Publish to App Stores (Production)

### Google Play Store (Android)

**Requirements**:
- Google Play Console account ($25 one-time fee)
- Privacy Policy URL
- App icon and screenshots

**Steps**:

1. **Create App Bundle**:
```bash
eas build --platform android --profile production
```

2. **Download AAB file** (Android App Bundle)

3. **Upload to Google Play Console**:
   - Go to: https://play.google.com/console
   - Create New App
   - Upload AAB
   - Fill in store listing:
     - Title: Closetly
     - Description: P2P Fashion Rental Marketplace
     - Category: Lifestyle
     - Screenshots: 2-8 images
   - Set pricing: Free
   - Submit for review

**Timeline**: 1-7 days for approval

---

### Apple App Store (iOS)

**Requirements**:
- Apple Developer Account ($99/year)
- App Store Connect access
- Privacy Policy URL
- App icon and screenshots

**Steps**:

1. **Create App in App Store Connect**:
   - Go to: https://appstoreconnect.apple.com
   - My Apps → + → New App
   - Bundle ID: `com.closetly.app`
   - Name: Closetly

2. **Build IPA**:
```bash
eas build --platform ios --profile production
```

3. **Submit to App Store**:
```bash
eas submit --platform ios
```

4. **Fill Store Listing**:
   - Description
   - Keywords: fashion, rental, sustainable, sharing economy
   - Screenshots: 3-10 images (required sizes)
   - Age rating: 4+
   - Price: Free

5. **Submit for Review**

**Timeline**: 1-3 days for approval

---

## 🎨 Current Features (Already Implemented)

### ✅ Authentication
- Email + Password login
- Phone + OTP login (passwordless)
- JWT token persistence (AsyncStorage)
- Auto-logout on 401 errors

### ✅ Universal UI Components
- **Button**: 44-56px touch targets, 3 variants
- **Input**: Error states, password toggle
- **Card**: Flexible layouts
- **BentoGrid**: Modern modular layouts
- **Badge**: Trust indicators (KYC, Sanitized)

### ✅ Screens Implemented
- **Login**: Email/password with demo credentials
- **PhoneLogin**: OTP verification with timer
- **Home**: Bento grid with featured products
- **Explore**: Search and filters (placeholder)
- **Profile**: User info and logout

### ✅ Navigation
- Stack navigation (Auth flow)
- Tab navigation (Main app)
- Deep linking ready

### ✅ Accessibility
- WCAG AAA compliant (4.5:1+ contrast)
- 44x44px minimum touch targets
- Screen reader compatible
- High contrast colors for older users

---

## 🔄 What's Next: Phase 2 Features

### Coming Soon (Not Yet Implemented):

#### 1. Aadhaar KYC Integration
```javascript
// Coming in Phase 2
import SignzySDK from '@signzy/react-native-sdk';

const performKYC = async () => {
  const result = await SignzySDK.startVideoKYC({
    aadhaarNumber: masked,
    redirectUrl: 'closetly://kyc-complete',
  });
  // Lock device fingerprint
  // Set trust score to 100
};
```

#### 2. iOS Live Activities
```swift
// Coming in Phase 3
import ActivityKit

// Real-time courier tracking on lock screen
// Dynamic Island integration
// "Courier 2km away - 5 min ETA"
```

#### 3. QR Code Handover
```javascript
// Coming in Phase 4
const scanHandoverQR = async (qrData) => {
  // Verify location (10km radius)
  // Release escrow payment
  // Update rental status
};
```

#### 4. AI Features
- Background removal for product photos
- Style Twins (body similarity matching)
- Smart sizing recommendations

#### 5. Payments
- Razorpay integration
- Escrow system
- 80/20 commission split

---

## 🐛 Troubleshooting

### Issue: "Network Error" when logging in

**Fix**:
1. Check `apiUrl` in `mobile/app.json`
2. Should be: `https://closetly-backend-vbm0.onrender.com/api`
3. Restart Expo: `npm start --clear`

---

### Issue: QR code not showing in terminal

**Fix**:
1. Try: `npm start --tunnel`
2. Or: `npm start --localhost`

---

### Issue: App crashes on startup

**Fix**:
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npm start --clear
```

---

### Issue: "Unable to resolve module"

**Fix**:
```bash
# Reset metro bundler
watchman watch-del-all
npm start -- --reset-cache
```

---

### Issue: Can't connect to backend from phone

**Fix**:
1. Make sure phone and computer are on **same WiFi**
2. Or use `--tunnel` flag: `npm start --tunnel`
3. Or deploy backend to Render (already done!)

---

## 📊 Mobile vs Web Feature Comparison

| Feature | Web (Vite) | Mobile (Expo) | Status |
|---------|------------|---------------|--------|
| Email Login | ✅ | ✅ | Working |
| Phone OTP | ✅ | ✅ | Working |
| Product Browse | ✅ | ✅ | Working |
| Bento Grid Layout | ✅ | ✅ | Working |
| Trust Badges | ✅ | ✅ | Working |
| Aadhaar KYC | ⏳ | ⏳ | Phase 2 |
| Live Activities | ❌ | ⏳ | Phase 3 (iOS only) |
| QR Handover | ⏳ | ⏳ | Phase 4 |
| Push Notifications | ⏳ | ⏳ | Phase 3 |
| Camera (QR scan) | ❌ | ⏳ | Phase 4 |
| Geolocation | ⏳ | ⏳ | Phase 3 |

---

## 🎯 Testing Checklist

Use this to verify everything works:

### On Expo Go (Development)
- [ ] App loads without errors
- [ ] Can see gradient header
- [ ] Category cards display
- [ ] Bento grid shows 3 products
- [ ] Trust badges visible (Sanitized, KYC)
- [ ] Can tap products (navigation works)
- [ ] Login with email works
- [ ] Login with phone OTP works
- [ ] Profile shows user info
- [ ] Logout works

### On Production Build (APK/IPA)
- [ ] App installs successfully
- [ ] Icon displays correctly
- [ ] Splash screen shows
- [ ] API calls work (not localhost)
- [ ] Images load
- [ ] Navigation smooth (no lag)
- [ ] Can login and browse
- [ ] No crashes

---

## 📱 Share with Friends

Once you have the app working:

### Option 1: Expo Go (Easiest)
Share this with friends:
```
📱 Test Closetly Mobile App!

1. Install Expo Go:
   iPhone: https://apps.apple.com/app/expo-go/id982107779
   Android: https://play.google.com/store/apps/details?id=host.exp.exponent

2. Scan this QR code:
   [Screenshot of QR code from your terminal]

3. Login:
   Email: demo@closetly.com
   Password: Demo@123
   
   OR
   
   Phone: 9876543210
   (OTP will be sent)
```

### Option 2: APK File (Android Only)
1. Build APK: `eas build -p android --profile preview`
2. Download APK from Expo
3. Upload to Google Drive
4. Share link with Android friends
5. They install directly (no Expo Go needed)

### Option 3: TestFlight (iOS, Best for Beta Testing)
1. Build iOS: `eas build -p ios --profile preview`
2. Submit to TestFlight: `eas submit -p ios`
3. Invite friends via email in App Store Connect
4. They download via TestFlight app
5. Much better than Expo Go (feels like real app)

---

## 🚀 Next Steps

### Today: Test Locally
```bash
cd mobile
npm install
npm start
# Scan QR with Expo Go
```

### This Week: Build APK
```bash
npm install -g eas-cli
eas build --platform android --profile preview
# Share APK with 10 friends
```

### Next Week: Phase 2 Implementation
- Aadhaar KYC integration
- Trust Score system
- Digital sanitization certificates

### Month 2: App Store Launch
- Submit to Google Play
- Submit to Apple App Store
- Marketing push in Hyderabad

---

## 📞 Quick Commands Reference

```bash
# Start development
npm start

# Start with tunnel (for remote testing)
npm start --tunnel

# Clear cache
npm start --clear

# Install dependencies
npm install

# Build Android APK
eas build -p android --profile preview

# Build iOS
eas build -p ios --profile preview

# Submit to stores
eas submit -p android
eas submit -p ios

# Check build status
eas build:list
```

---

## 📖 Additional Resources

- **Mobile README**: `mobile/README.md` (detailed architecture)
- **Expert Architecture**: `MOBILE_ARCHITECTURE_EXPERT.md` (full roadmap)
- **Phase 1 Guide**: `PHASE_1_IMPLEMENTATION.md` (UI components)
- **SMS Setup**: `SMS_OTP_SETUP.md` (phone authentication)
- **Deployment**: `END_TO_END_GUIDE.md` (web deployment)

---

## 🎉 You're Ready to Launch!

Your mobile app has:
- ✅ Production-grade UI components
- ✅ WCAG AAA accessibility
- ✅ Phone + Email authentication
- ✅ Beautiful Bento grid layouts
- ✅ Trust indicators (badges)
- ✅ Smooth navigation
- ✅ Token persistence

**Time to build**: 5 minutes for Expo Go, 20 minutes for APK

**Let's get this app on your phone!** 🚀📱
