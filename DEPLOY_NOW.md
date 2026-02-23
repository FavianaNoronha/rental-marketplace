# 🚀 Deploy Closetly - Click & Deploy (10 Minutes)

Your code is ready at: **https://github.com/FavianaNoronha/rental-marketplace**

---

## Step 1: Deploy Backend (5 minutes) ⚡

### 1.1 Sign Up for Render
👉 **Click here**: https://dashboard.render.com/register

- Choose "Sign in with GitHub" (easiest)
- Authorize Render to access your repositories

### 1.2 Create Web Service
👉 **After login, click**: https://dashboard.render.com/create?type=web

1. **Connect Repository**:
   - Find and click: `FavianaNoronha/rental-marketplace`
   - Click **Connect**

2. **Configure Service** (fill the form):
   ```
   Name: closetly-backend
   Region: Oregon (US West)
   Branch: main
   Root Directory: server
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

3. **Add Environment Variables** (click "Advanced" → "Add Environment Variable"):
   
   Copy and paste these ONE BY ONE:
   
   ```
   Variable Name: NODE_ENV
   Value: production
   ```
   
   ```
   Variable Name: PORT
   Value: 5001
   ```
   
   ```
   Variable Name: MONGODB_URI
   Value: mongodb+srv://Faviana_noronha:nts4p2YWBB92lQfL@closetly.xzvpgw5.mongodb.net/rental-marketplace?appName=closetly
   ```
   
   ```
   Variable Name: JWT_SECRET
   Value: t4VJByrh3YmZ9H+d9dmvEJZTrFNZmntFUUbRAFYjkYA=
   ```
   
   ```
   Variable Name: CLIENT_URL
   Value: https://closetly.vercel.app
   ```

4. **Click "Create Web Service"**

5. **Wait 3-5 minutes** - You'll see logs deploying

6. **Copy your backend URL** (will look like):
   ```
   https://closetly-backend-xxxx.onrender.com
   ```
   **SAVE THIS URL!** You need it for Step 2.

7. **Test it**: Open `https://YOUR-BACKEND-URL/api/health`
   - Should show: `{"status":"ok","mongodb":"connected"}`

---

## Step 2: Deploy Frontend (5 minutes) ⚡

### 2.1 Sign Up for Vercel
👉 **Click here**: https://vercel.com/signup

- Choose "Continue with GitHub"
- Authorize Vercel

### 2.2 Import Project
👉 **After login, click**: https://vercel.com/new

1. **Import Git Repository**:
   - Find: `FavianaNoronha/rental-marketplace`
   - Click **Import**

2. **Configure Project**:
   ```
   Framework Preset: Vite
   Root Directory: client (click Edit → type "client")
   Build Command: npm run build (auto-filled)
   Output Directory: dist (auto-filled)
   Install Command: npm install (auto-filled)
   ```

3. **Add Environment Variable**:
   - Click "Environment Variables"
   - Add:
     ```
     Name: VITE_API_URL
     Value: https://YOUR-BACKEND-URL-FROM-STEP-1/api
     ```
   - **Replace** `YOUR-BACKEND-URL-FROM-STEP-1` with the actual Render URL!
   - Example: `https://closetly-backend-abcd.onrender.com/api`

4. **Click "Deploy"**

5. **Wait 2-3 minutes** - Watch the build logs

6. **Your site is live!** You'll get a URL like:
   ```
   https://rental-marketplace-xxxx.vercel.app
   ```

### 2.3 Update Backend CORS
👉 **Go back to Render**: https://dashboard.render.com

1. Click your **closetly-backend** service
2. Click **Environment** in left menu
3. Find `CLIENT_URL` variable
4. Click Edit icon
5. Change value to your **Vercel URL** (from step 2.2.6)
6. Click **Save Changes**
7. Service will auto-redeploy (wait 1 minute)

---

## Step 3: Test & Share! 🎉

### Test Your Deployment
1. **Open your Vercel URL**: `https://rental-marketplace-xxxx.vercel.app`
2. **Click Login**
3. **Login with**:
   - Email: `demo@closetly.com`
   - Password: `Demo@123`
4. **Browse products, like items, test features!**

### Share with Friends
Send them this message:

```
🎉 Check out Closetly - Fashion Rental Marketplace!

🌐 Website: https://rental-marketplace-xxxx.vercel.app

👤 Demo Login:
Email: demo@closetly.com
Password: Demo@123

Try browsing fashion items and test the features!
```

---

## 🐛 Troubleshooting

### Backend not deploying?
- Check Render logs: Dashboard → Your Service → Logs
- Verify all environment variables are set correctly
- MongoDB Atlas must allow connections from anywhere (0.0.0.0/0)

### Frontend can't connect to backend?
- Check browser console (F12 → Console)
- Verify VITE_API_URL has `/api` at the end
- Verify CLIENT_URL in Render matches your Vercel URL exactly

### Login not working?
- Backend must be deployed successfully first
- Check backend health: `https://YOUR-BACKEND-URL/api/health`
- Verify MongoDB is connected (health check shows "connected")

---

## 📝 Quick Reference

### Your URLs:
- **GitHub**: https://github.com/FavianaNoronha/rental-marketplace
- **Render Backend**: `https://closetly-backend-xxxx.onrender.com`
- **Vercel Frontend**: `https://rental-marketplace-xxxx.vercel.app`

### Login Credentials:
- **Email**: demo@closetly.com
- **Password**: Demo@123

### JWT Secret:
```
t4VJByrh3YmZ9H+d9dmvEJZTrFNZmntFUUbRAFYjkYA=
```

---

## 💰 Cost: 100% FREE

- ✅ Render Free Tier: 750 hours/month
- ✅ Vercel Free Tier: Unlimited deployments
- ✅ MongoDB Atlas: 512MB free forever

**Note**: Render free tier sleeps after 15 min inactivity. First load takes 30-60 seconds to wake up.

---

## 🎯 Next Steps

Once deployed:
1. ✅ Change your Vercel domain name (Settings → Domains)
2. ✅ Add more products (run seeder with more items)
3. ✅ Add Razorpay test keys for payment testing
4. ✅ Invite friends to test!

---

**Ready? Start with Step 1! Click the Render link above! 🚀**
