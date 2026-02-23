# 🚀 End-to-End Complete Guide - Closetly Deployment & Testing

**Date**: February 23, 2026  
**Goal**: Get Closetly fully deployed and testable by friends in 30 minutes

---

## 📋 Quick Navigation

1. [Prerequisites Check](#1-prerequisites-check)
2. [Fix MongoDB Atlas](#2-fix-mongodb-atlas-critical)
3. [Test Backend Locally](#3-test-backend-locally)
4. [Test Frontend Locally](#4-test-frontend-locally)
5. [Deploy Backend (Render)](#5-deploy-backend-render)
6. [Deploy Frontend (Vercel)](#6-deploy-frontend-vercel)
7. [Test Mobile App](#7-test-mobile-app-optional)
8. [Share with Friends](#8-share-with-friends)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Prerequisites Check

Before starting, verify you have:

```bash
# Check Node.js (should be v18+)
node --version
# v18.0.0 or higher ✅

# Check npm
npm --version
# 9.0.0 or higher ✅

# Check Git
git --version
# Any recent version ✅

# Check if MongoDB is running locally (optional)
ps aux | grep mongod
# OR just use MongoDB Atlas (recommended)
```

**Accounts Needed**:
- ✅ GitHub account (you have this)
- ✅ MongoDB Atlas account (you have this)
- ⏳ Render.com account (free tier)
- ⏳ Vercel account (free tier)

---

## 2. Fix MongoDB Atlas (CRITICAL)

**Issue**: Your Render backend can't connect to MongoDB because of IP restrictions.

**Fix** (2 minutes):

### Step 2.1: Open MongoDB Atlas
1. Go to: https://cloud.mongodb.com
2. Log in with your credentials
3. Select your cluster: **Closetly**

### Step 2.2: Allow All IPs
1. Click **"Network Access"** in left sidebar
2. Click **"Add IP Address"** button
3. Click **"Allow Access from Anywhere"**
4. Confirm by clicking **"Add Entry"**

![MongoDB Network Access](https://i.imgur.com/example.png)

### Step 2.3: Wait & Verify
```bash
# Wait 1-2 minutes, then test
curl https://closetly-backend-vbm0.onrender.com/api/health

# Expected response:
# {"status":"ok","mongodb":"connected"}
```

✅ **If you see `"mongodb":"connected"`**, you're good!  
❌ **If you see connection error**, wait another minute and retry.

---

## 3. Test Backend Locally

Make sure your backend works before deploying.

### Step 3.1: Navigate to Server Folder
```bash
cd /Users/faviananoronha/Developer/rental-marketplace/server
```

### Step 3.2: Install Dependencies (if needed)
```bash
npm install
```

### Step 3.3: Create .env File
```bash
cat > .env << 'EOF'
# Database
MONGODB_URI=mongodb+srv://Faviana_noronha:nts4p2YWBB92lQfL@closetly.xzvpgw5.mongodb.net/rental-marketplace

# JWT Secret
JWT_SECRET=t4VJByrh3YmZ9H+d9dmvEJZTrFNZmntFUUbRAFYjkYA=

# Server
PORT=5001
NODE_ENV=development

# Client URL
CLIENT_URL=http://localhost:5173

# SMS Provider (Console mode for development)
SMS_PROVIDER=console
EOF
```

### Step 3.4: Start Backend
```bash
npm start
```

**Expected output**:
```
Server running in development mode on port 5001
MongoDB Connected: closetly.xzvpgw5.mongodb.net
```

### Step 3.5: Test API Endpoints
Open a new terminal and test:

```bash
# Health check
curl http://localhost:5001/api/health

# Get products
curl http://localhost:5001/api/products

# Test login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@closetly.com","password":"Demo@123"}'
```

✅ **If all return JSON**, backend is working!

**Leave this terminal running** and open a new one for frontend.

---

## 4. Test Frontend Locally

### Step 4.1: Navigate to Client Folder
```bash
cd /Users/faviananoronha/Developer/rental-marketplace/client
```

### Step 4.2: Install Dependencies
```bash
npm install
```

### Step 4.3: Start Frontend
```bash
npm run dev
```

**Expected output**:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Step 4.4: Open in Browser
1. Open: http://localhost:5173
2. You should see Closetly homepage
3. Click **"Login"**
4. Use demo credentials:
   - **Email**: demo@closetly.com
   - **Password**: Demo@123
5. Click **"Login"** button

✅ **If you see product listings**, everything works!

### Step 4.5: Test Phone OTP Login
1. Click **"Logout"** (if logged in)
2. Go to Login page
3. Click **"Phone"** tab
4. Enter phone: **9876543210**
5. Click **"Send OTP"**
6. Check terminal running backend - you'll see OTP in console:
   ```
   📱 SMS (Console Mode):
   To: +919876543210
   Message: 123456 is your OTP to login to Closetly. Valid for 10 minutes.
   ```
7. Enter the 6-digit OTP
8. Click **"Verify OTP"**

✅ **If you login successfully**, phone OTP works!

---

## 5. Deploy Backend (Render)

Your backend is already deployed at: https://closetly-backend-vbm0.onrender.com

### Step 5.1: Check Current Status
```bash
curl https://closetly-backend-vbm0.onrender.com/api/health
```

**If you see** `{"status":"ok","mongodb":"connected"}`:
- ✅ **Backend is already deployed and working!**
- Skip to Step 6 (Deploy Frontend)

**If you see an error**:
- Make sure you completed Step 2 (MongoDB Atlas fix)
- Go to https://dashboard.render.com
- Find your service: **closetly-backend**
- Click **"Manual Deploy"** → **"Deploy latest commit"**
- Wait 2-3 minutes for build to complete

### Step 5.2: Verify Deployment
```bash
# Test all endpoints
curl https://closetly-backend-vbm0.onrender.com/api/health
curl https://closetly-backend-vbm0.onrender.com/api/products
```

✅ **Backend deployed successfully!**

---

## 6. Deploy Frontend (Vercel)

### Step 6.1: Push Latest Code to GitHub
```bash
cd /Users/faviananoronha/Developer/rental-marketplace

# Check status
git status

# If there are changes, commit them
git add -A
git commit -m "Ready for Vercel deployment"
git push origin main
```

### Step 6.2: Sign Up for Vercel
1. Go to: https://vercel.com/signup
2. Click **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub

### Step 6.3: Import Project
1. Click **"Add New..."** → **"Project"**
2. Find **"rental-marketplace"** in the list
3. Click **"Import"**

### Step 6.4: Configure Build Settings
On the configuration page:

**Framework Preset**: Vite  
**Root Directory**: `client` ← Click "Edit" and select `client`  
**Build Command**: `npm run build`  
**Output Directory**: `dist`

### Step 6.5: Add Environment Variables
Click **"Environment Variables"** and add:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://closetly-backend-vbm0.onrender.com/api` |

### Step 6.6: Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. You'll get a URL like: `https://rental-marketplace-xyz.vercel.app`

### Step 6.7: Update Backend CORS
After deployment, update Render backend to allow your Vercel URL:

1. Go to: https://dashboard.render.com
2. Click your **closetly-backend** service
3. Click **"Environment"** tab
4. Find `CLIENT_URL` variable
5. Change value to: `https://your-vercel-url.vercel.app`
6. Click **"Save Changes"**
7. Backend will auto-redeploy (2-3 minutes)

### Step 6.8: Test Deployed Frontend
1. Open your Vercel URL
2. Login with demo credentials
3. Browse products
4. Test phone OTP login

✅ **Frontend deployed successfully!**

---

## 7. Test Mobile App (Optional)

### Step 7.1: Install Expo Go
On your phone:
- **iPhone**: https://apps.apple.com/app/expo-go/id982107779
- **Android**: https://play.google.com/store/apps/details?id=host.exp.exponent

### Step 7.2: Update API URL in Mobile App
```bash
cd /Users/faviananoronha/Developer/rental-marketplace/mobile

# Edit app.json
code app.json  # or nano app.json
```

Find the `extra` section and update:
```json
"extra": {
  "apiUrl": "https://closetly-backend-vbm0.onrender.com/api"
}
```

Save the file.

### Step 7.3: Install Dependencies
```bash
npm install
```

### Step 7.4: Start Expo
```bash
npm start
```

**You'll see a QR code in terminal**.

### Step 7.5: Scan QR Code
- **iPhone**: Open Camera app → Point at QR code → Tap notification
- **Android**: Open Expo Go app → Scan QR code

### Step 7.6: Test on Phone
1. Wait for app to load
2. See the beautiful Bento grid layout!
3. Try logging in with:
   - **Email**: demo@closetly.com / Demo@123
   - **Phone**: 9876543210 (check terminal for OTP)
4. Browse categories
5. See trust badges (Sanitized, KYC Verified)

✅ **Mobile app works!**

---

## 8. Share with Friends

### 8.1: Share Website URL
Send friends this link:
```
🎉 Check out Closetly - Fashion Rental Marketplace!

Website: https://your-vercel-url.vercel.app

Test Credentials:
Email: demo@closetly.com
Password: Demo@123

Or login with OTP:
Phone: 9876543210
(You'll get OTP via SMS)

Features to try:
✅ Browse 10 fashion items
✅ Phone OTP login (passwordless)
✅ Rent items with secure escrow
✅ List your own items
```

### 8.2: What Friends Can Do
1. **Create Account**:
   - Click "Sign Up"
   - Enter name, email, password
   - Login

2. **Login with Phone OTP**:
   - Click "Login" → "Phone" tab
   - Enter Indian phone number (10 digits starting with 6-9)
   - Get OTP via SMS
   - Verify and login

3. **Browse Products**:
   - See 10 pre-seeded items
   - Filter by category (Utsav, Safar, etc.)
   - View product details

4. **List an Item** (if implemented):
   - Click "List Item"
   - Upload photos
   - Set pricing
   - Add description

5. **Rent an Item**:
   - Select product
   - Choose dates
   - Complete payment

### 8.3: Collect Feedback
Ask friends:
- ✅ Was signup/login easy?
- ✅ Did phone OTP work?
- ✅ Is the UI intuitive?
- ✅ Any bugs or issues?
- ✅ What features are missing?

---

## 9. Troubleshooting

### Issue: Backend Not Connecting to MongoDB
**Error**: `MongooseServerSelectionError`

**Fix**:
1. Go to MongoDB Atlas → Network Access
2. Add IP: `0.0.0.0/0` (Allow from anywhere)
3. Wait 2 minutes
4. Restart Render service

---

### Issue: Frontend Can't Reach Backend
**Error**: `Network Error` or `CORS error`

**Fix**:
1. Check `VITE_API_URL` in Vercel environment variables
2. Check `CLIENT_URL` in Render environment variables
3. Make sure both match (no trailing slashes)
4. Redeploy both services

---

### Issue: Phone OTP Not Sending
**Error**: No OTP received

**Fix**:
1. Check backend logs: console mode logs OTP
2. For real SMS:
   - Sign up for MSG91 (₹0.15/SMS)
   - Add credentials to Render env variables:
     ```
     SMS_PROVIDER=msg91
     MSG91_AUTH_KEY=your-key
     MSG91_SENDER_ID=CLOSET
     ```
   - Redeploy backend

---

### Issue: Mobile App Won't Load
**Error**: "Cannot connect to server"

**Fix**:
1. Check `apiUrl` in `mobile/app.json`
2. Make sure it's: `https://closetly-backend-vbm0.onrender.com/api`
3. Stop and restart Expo: `npm start --clear`
4. Scan QR code again

---

### Issue: Vercel Build Fails
**Error**: Build fails with module not found

**Fix**:
1. Make sure Root Directory is set to `client`
2. Check Build Command: `npm run build`
3. Check Output Directory: `dist`
4. Check if `client/package.json` exists
5. Redeploy

---

### Issue: Images Not Loading
**Error**: Broken image icons

**Fix**:
1. Product images use placeholder URLs
2. To use real images:
   - Sign up for Cloudinary (free tier)
   - Update product schema to use Cloudinary URLs
   - Or upload images to `/client/public/` folder

---

## 10. Next Steps (Post-Launch)

Once friends are testing, prioritize:

### Week 1: Fix Critical Bugs
- [ ] Fix any login issues reported
- [ ] Fix payment flow bugs
- [ ] Fix image upload issues

### Week 2: Phase 2 - Trust Layer
- [ ] Integrate Aadhaar KYC (Signzy)
- [ ] Add digital sanitization certificates
- [ ] Implement trust score system

### Week 3: Phase 3 - Notifications
- [ ] Setup iOS Live Activities
- [ ] Setup Android Live Updates
- [ ] Add calendar-based nudges

### Week 4: Phase 4 - Payments
- [ ] Integrate Razorpay Route (escrow)
- [ ] Setup QR handover system
- [ ] Test commission split (80/20)

### Month 2: Hyderabad Launch
- [ ] Partner with 50 influencers
- [ ] Tie-up with wedding planners
- [ ] College ambassadors at BITS, IIIT-H
- [ ] Pop-up stores in Banjara Hills

---

## 🎉 Success Checklist

Use this to track your deployment:

- [ ] MongoDB Atlas IP whitelist updated (0.0.0.0/0)
- [ ] Backend running locally (localhost:5001)
- [ ] Frontend running locally (localhost:5173)
- [ ] Can login with demo@closetly.com
- [ ] Can login with phone OTP
- [ ] Backend deployed on Render (health check passes)
- [ ] Frontend deployed on Vercel
- [ ] CORS configured correctly
- [ ] Mobile app loads on phone (Expo Go)
- [ ] Shared URL with 5+ friends
- [ ] Collected initial feedback

---

## 📞 Quick Reference

### URLs
- **Backend**: https://closetly-backend-vbm0.onrender.com
- **Frontend**: https://your-vercel-url.vercel.app (update after deployment)
- **GitHub**: https://github.com/FavianaNoronha/rental-marketplace
- **MongoDB**: https://cloud.mongodb.com

### Demo Credentials
- **Email**: demo@closetly.com
- **Password**: Demo@123
- **Phone**: 9876543210 (OTP in backend console)

### Environment Variables
**Backend (Render)**:
```
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://...
JWT_SECRET=t4VJByrh3YmZ9H+d9dmvEJZTrFNZmntFUUbRAFYjkYA=
CLIENT_URL=https://your-vercel-url.vercel.app
SMS_PROVIDER=console
```

**Frontend (Vercel)**:
```
VITE_API_URL=https://closetly-backend-vbm0.onrender.com/api
```

### Support
- Architecture: [MOBILE_ARCHITECTURE_EXPERT.md](MOBILE_ARCHITECTURE_EXPERT.md)
- Phase 1: [PHASE_1_IMPLEMENTATION.md](PHASE_1_IMPLEMENTATION.md)
- Deployment: [DEPLOY_NOW.md](DEPLOY_NOW.md)
- SMS Setup: [SMS_OTP_SETUP.md](SMS_OTP_SETUP.md)

---

## 🚀 You're Ready!

**Estimated Time**: 30-45 minutes for complete deployment

**Support**: If you hit any issues, check the Troubleshooting section or refer to the detailed guides.

**What's Next**: Once deployed and tested by friends, we'll implement Phase 2 (Trust Layer) to make this production-ready for Hyderabad launch! 🏆🦄

Good luck! 🎉
