# 🚀 Deploy Closetly - Share with Friends! (FREE)

## 🎯 What You'll Get
After 15 minutes, your friends can access:
- **Frontend**: `https://closetly.vercel.app` (or your custom name)
- **Backend**: `https://closetly-backend.onrender.com`
- **Database**: Already on MongoDB Atlas ✅

---

## ⚡ Quick Deploy (15 Minutes - 100% FREE)

### Step 1: Push Code to GitHub (5 min)

1. **Create a GitHub account** (if you don't have): https://github.com/signup

2. **Create new repository**:
   - Go to: https://github.com/new
   - Repository name: `closetly-rental-marketplace`
   - Make it **Public**
   - Don't add README (we have one)
   - Click **Create repository**

3. **Push your code** (run in Terminal):
   ```bash
   cd /Users/faviananoronha/Developer/rental-marketplace
   
   # Initialize git (if not already)
   git init
   
   # Add all files
   git add .
   
   # Commit
   git commit -m "Initial commit - Closetly rental marketplace"
   
   # Connect to GitHub (replace YOUR-USERNAME with your GitHub username)
   git remote add origin https://github.com/YOUR-USERNAME/closetly-rental-marketplace.git
   
   # Push
   git branch -M main
   git push -u origin main
   ```

---

### Step 2: Deploy Backend on Render (5 min)

1. **Sign Up for Render**: https://dashboard.render.com/register
   - Use GitHub to sign in (easiest)

2. **Create New Web Service**:
   - Click **New** → **Web Service**
   - Connect your GitHub account
   - Select repository: `closetly-rental-marketplace`
   - Click **Connect**

3. **Configure Service**:
   - **Name**: `closetly-backend` (or any name you like)
   - **Region**: Oregon (closest to you)
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

4. **Add Environment Variables** (click "Advanced" → "Add Environment Variable"):
   ```
   NODE_ENV = production
   PORT = 5001
   MONGODB_URI = mongodb+srv://Faviana_noronha:nts4p2YWBB92lQfL@closetly.xzvpgw5.mongodb.net/rental-marketplace?appName=closetly
   JWT_SECRET = YOUR-SUPER-SECRET-KEY-HERE
   CLIENT_URL = https://closetly.vercel.app
   ```
   
   **Generate JWT_SECRET** (run this in Terminal):
   ```bash
   openssl rand -base64 32
   ```
   Copy the output and paste as JWT_SECRET

5. **Click "Create Web Service"**
   - Wait 3-5 minutes for deployment
   - You'll get a URL like: `https://closetly-backend.onrender.com`
   - **Save this URL!** You need it for Step 3

6. **Test Backend**:
   - Open: `https://closetly-backend.onrender.com/api/health`
   - Should show: `{"status":"ok","mongodb":"connected"}`

---

### Step 3: Deploy Frontend on Vercel (5 min)

1. **Sign Up for Vercel**: https://vercel.com/signup
   - Use GitHub to sign in

2. **Import Project**:
   - Click **Add New** → **Project**
   - Select `closetly-rental-marketplace` repository
   - Click **Import**

3. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Add Environment Variable**:
   - Click **Environment Variables**
   - Add:
     ```
     Name: VITE_API_URL
     Value: https://closetly-backend.onrender.com/api
     ```
   (Replace with YOUR backend URL from Step 2!)

5. **Click "Deploy"**
   - Wait 2-3 minutes
   - You'll get a URL like: `https://closetly.vercel.app`

6. **Update Backend CORS**:
   - Go back to Render dashboard
   - Click your backend service
   - Go to **Environment** tab
   - Edit `CLIENT_URL` to your Vercel URL
   - Click **Save Changes**
   - Service will auto-redeploy (wait 1 min)

---

## ✅ Test Your Deployment

1. **Open your Vercel URL**: `https://closetly.vercel.app`

2. **Login with**:
   - Email: `demo@closetly.com`
   - Password: `Demo@123`

3. **Share with friends!** 🎉

---

## 🔧 Update Environment Variables (IMPORTANT)

### Backend (Render)
Go to Render Dashboard → Your Service → Environment:

```env
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://Faviana_noronha:nts4p2YWBB92lQfL@closetly.xzvpgw5.mongodb.net/rental-marketplace?appName=closetly
JWT_SECRET=[Your generated secret from openssl]
CLIENT_URL=https://[your-vercel-url].vercel.app
RAZORPAY_KEY_ID=rzp_test_xxxxxxxx (optional - for payments)
RAZORPAY_KEY_SECRET=your_secret (optional - for payments)
```

### Frontend (Vercel)
Go to Vercel Dashboard → Your Project → Settings → Environment Variables:

```env
VITE_API_URL=https://[your-render-url].onrender.com/api
```

---

## 🎨 Customize Your URLs (Optional)

### Vercel:
- Go to Project Settings → Domains
- Add custom domain or change to: `closetly-[yourname].vercel.app`

### Render:
- Go to Service Settings → Name
- Change URL to: `closetly-api-[yourname].onrender.com`

---

## 📱 Share with Friends

Send them:
```
🎉 Check out Closetly - Fashion Rental Marketplace!

🌐 Website: https://closetly.vercel.app

👤 Login with:
Email: demo@closetly.com
Password: Demo@123

Try:
✨ Browse fashion items
❤️ Like products
📅 Book rentals
🔔 Get notifications
```

---

## 🐛 Troubleshooting

### Backend not connecting:
1. Check Render logs: Dashboard → Service → Logs
2. Verify MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
3. Check environment variables are set correctly

### Frontend can't reach backend:
1. Open browser console (F12)
2. Check if API calls are going to correct backend URL
3. Verify CORS settings in backend (CLIENT_URL must match Vercel URL)

### Login not working:
1. Make sure backend is deployed successfully
2. Check backend logs for errors
3. Verify MONGODB_URI is correct
4. Run seeder on production: SSH into Render or add seed script

---

## 💰 Costs

**Everything is FREE:**
- ✅ Render: Free tier (750 hours/month)
- ✅ Vercel: Free tier (unlimited deployments)
- ✅ MongoDB Atlas: Free tier (512MB storage)

**Note**: Render free tier goes to sleep after 15 min of inactivity. First request takes 30-60 seconds to wake up.

---

## 🚀 Next Steps

1. **Add More Products**: Run seeder with more items
2. **Razorpay**: Add test keys for payment testing
3. **Custom Domain**: Buy a domain and connect it
4. **Analytics**: Add Google Analytics
5. **SEO**: Add meta tags and og:image

---

## 📞 Need Help?

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas**: https://www.mongodb.com/docs/atlas/

---

**Happy Deploying! 🎉**
