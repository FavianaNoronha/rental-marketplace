# 📱 Closetly Mobile App - React Native

Complete mobile application for iOS and Android using React Native + Expo.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo Go app on your phone (for testing)

### Installation

```bash
# Navigate to mobile folder
cd mobile

# Install dependencies
npm install

# Start Expo development server
npm start
```

### Test on Your Phone

1. **Install Expo Go**:
   - iOS: https://apps.apple.com/app/expo-go/id982107779
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent

2. **Scan QR Code**:
   - iOS: Use Camera app to scan QR code from terminal
   - Android: Open Expo Go app and scan QR code

3. **Start Testing**!
   - App will open on your phone
   - Hot reload enabled (changes appear instantly)

---

## 📂 Project Structure

```
mobile/
├── App.js                          # Main app entry point
├── app.json                        # Expo configuration
├── package.json                    # Dependencies
├── babel.config.js                 # Babel config
│
├── src/
│   ├── context/
│   │   └── AuthContext.js          # Authentication state
│   │
│   ├── navigation/
│   │   └── RootNavigator.js        # Navigation setup
│   │
│   ├── screens/
│   │   ├── Auth/
│   │   │   ├── LoginScreen.js      # Email/Password login
│   │   │   ├── PhoneLoginScreen.js # Phone OTP login
│   │   │   └── RegisterScreen.js   # Registration
│   │   ├── Home/
│   │   │   └── HomeScreen.js       # Home feed
│   │   ├── Explore/
│   │   │   └── ExploreScreen.js    # Search & browse
│   │   ├── Profile/
│   │   │   └── ProfileScreen.js    # User profile
│   │   └── Product/
│   │       └── ProductDetailScreen.js # Product details
│   │
│   └── services/
│       └── api.js                  # API client (Axios)
│
└── assets/                         # Images, fonts, etc.
```

---

## 🎨 Features Implemented

### ✅ Authentication
- **Email + Password Login** (traditional)
- **Phone + OTP Login** (passwordless)
- **Auto-login** (token persistence)
- **Logout** functionality

### ✅ Navigation
- **Stack Navigation** (screens)
- **Bottom Tab Navigation** (Home, Explore, Profile)
- **Authentication Flow** (auto-redirect based on login status)

### ✅ API Integration
- **Axios client** configured
- **Auto token injection** on all requests
- **Error handling** and 401 redirect
- **AsyncStorage** for token persistence

---

## 🔧 Configuration

### API URL

Edit `app.json` to change backend URL:

```json
{
  "expo": {
    "extra": {
      "apiUrl": "https://closetly-backend-vbm0.onrender.com/api"
    }
  }
}
```

For local testing:
```json
"apiUrl": "http://YOUR-LOCAL-IP:5001/api"
```
**Note**: Use your computer's local IP (not localhost) for phone testing.

---

## 📱 Testing Locally

### Test with Backend on Render:
```bash
# Already configured in app.json
npm start
```

### Test with Local Backend:
1. **Find your local IP**:
   ```bash
   # macOS/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # Windows
   ipconfig
   ```

2. **Update app.json**:
   ```json
   "apiUrl": "http://192.168.1.100:5001/api"
   ```
   (Replace with your actual IP)

3. **Make sure backend is running**:
   ```bash
   cd ../server
   npm start
   ```

4. **Start mobile app**:
   ```bash
   npm start
   ```

---

## 🧪 Test Accounts

### Email Login:
- **Email**: demo@closetly.com
- **Password**: Demo@123

### Phone Login:
- **Phone**: Any 10-digit number (e.g., 9876543210)
- **OTP**: Check server console (development mode)

---

## 📦 Build for Production

### Build APK (Android)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build APK
eas build --platform android --profile preview
```

Download APK from Expo dashboard and install on Android device.

### Build IPA (iOS)

```bash
# Build for iOS
eas build --platform ios --profile preview
```

**Note**: iOS builds require Apple Developer account ($99/year).

---

## 🚢 Deployment Options

### Option 1: Expo Go (Development)
✅ **Free**  
✅ **Instant testing**  
❌ Limited to Expo modules  

### Option 2: Development Build
✅ **Free**  
✅ **Custom native code**  
✅ **All React Native modules**  
❌ Requires build step  

### Option 3: Standalone App (Production)
✅ **Full native app**  
✅ **Publish to App Store/Play Store**  
❌ Requires developer accounts:
  - Google Play: $25 (one-time)
  - Apple App Store: $99/year

---

## 🔐 Environment Variables

Create `.env` file (optional):

```env
API_URL=https://closetly-backend-vbm0.onrender.com/api
```

Access in code:
```javascript
import Constants from 'expo-constants';
const apiUrl = Constants.expoConfig.extra.apiUrl;
```

---

## 🎯 Next Steps

### Immediate (MVP):
- [ ] Product listing screen
- [ ] Product detail screen with images
- [ ] Search functionality
- [ ] Add to favorites
- [ ] Rental booking flow

### Phase 2:
- [ ] Image upload (camera + gallery)
- [ ] Location-based search
- [ ] Real-time notifications
- [ ] Payment integration (Razorpay)
- [ ] Chat functionality

### Phase 3:
- [ ] Push notifications
- [ ] Offline support
- [ ] Deep linking
- [ ] App analytics
- [ ] A/B testing

---

## 📚 Useful Commands

```bash
# Start development server
npm start

# Open on iOS simulator (requires Xcode)
npm run ios

# Open on Android emulator (requires Android Studio)
npm run android

# Clear cache and restart
expo start -c

# View logs
expo logs

# Check for issues
expo doctor
```

---

## 🐛 Troubleshooting

### Can't connect to backend?
1. Check if backend is running
2. Verify API URL in app.json
3. Use local IP (not localhost) for phone testing
4. Check firewall settings

### Phone can't scan QR code?
1. Make sure phone and computer on same WiFi
2. Try tunnel mode: `expo start --tunnel`
3. Manually enter URL from Expo Go app

### Build fails?
1. Clear cache: `expo start -c`
2. Delete node_modules: `rm -rf node_modules && npm install`
3. Check Expo SDK compatibility

---

## 📖 Resources

- **Expo Docs**: https://docs.expo.dev/
- **React Navigation**: https://reactnavigation.org/
- **React Native**: https://reactnative.dev/
- **Expo Forums**: https://forums.expo.dev/

---

## 💡 Tips

1. **Hot Reload**: Shake device to open developer menu
2. **Debugging**: Use React Native Debugger or Expo Dev Tools
3. **Testing**: Test on real devices, not just simulators
4. **Performance**: Use FlatList for long lists
5. **Images**: Optimize images before uploading

---

**Ready to build the future of fashion rental! 🚀**
