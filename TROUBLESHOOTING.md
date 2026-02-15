# Safari & Browser Troubleshooting Guide

## 🔧 Safari "Cannot Connect to Server" Issue

If you're seeing "Safari can't open the page because it can't connect to the server" or similar errors, follow these steps:

### Quick Checklist

Before accessing http://localhost:3000 in Safari, verify:

1. ✅ **Backend server is running** on port 5000
2. ✅ **Frontend server is running** on port 3000
3. ✅ **MongoDB is running**
4. ✅ **No firewall blocking localhost**
5. ✅ **Correct URL format** (http://localhost:3000, not https)

---

## Step-by-Step Solution

### Step 1: Verify Backend Server is Running

Open Terminal 1 and run:

```bash
cd server
npm run dev
```

**Expected Output:**
```
MongoDB Connected: localhost
Server running in development mode on port 5000
```

**If you see errors:**
- MongoDB not running? See "Step 3: Start MongoDB" below
- Port 5000 in use? See "Port Already in Use" section below
- Module errors? Run `npm install` in the server folder

### Step 2: Verify Frontend Server is Running

Open Terminal 2 (new terminal window) and run:

```bash
cd client
npm run dev
```

**Expected Output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

**If you see errors:**
- Module errors? Run `npm install` in the client folder
- Port 3000 in use? See "Port Already in Use" section below

### Step 3: Start MongoDB

**Mac (Homebrew):**
```bash
brew services start mongodb-community
# or
mongod --config /usr/local/etc/mongod.conf
```

**Mac (Manual):**
```bash
mongod
```

**Windows:**
```bash
# Start MongoDB service
net start MongoDB

# Or run mongod directly
mongod
```

**Linux:**
```bash
sudo systemctl start mongod
# or
sudo service mongod start
```

**Verify MongoDB is running:**
```bash
# This should connect without errors
mongosh
# or for older versions
mongo
```

### Step 4: Access in Safari

1. Make sure **BOTH** servers are running (steps 1 & 2)
2. Open Safari
3. Type in the address bar: `http://localhost:3000`
4. Press Enter

**Important:** Use `http://` NOT `https://`

---

## Common Safari-Specific Issues

### Issue 1: Safari Requires "http://" Prefix

**Problem:** Safari shows "Server cannot be reached"

**Solution:**
- Type the full URL: `http://localhost:3000` (include http://)
- Don't just type `localhost:3000`

### Issue 2: Safari Cache Issues

**Problem:** Page shows old content or doesn't load

**Solution:**
1. Clear Safari cache: `Safari > Preferences > Privacy > Manage Website Data > Remove All`
2. Or use keyboard shortcut: `Cmd + Option + E`
3. Hard refresh: `Cmd + Shift + R`

### Issue 3: Safari Privacy Settings

**Problem:** Safari blocks localhost connections

**Solution:**
1. Go to `Safari > Preferences > Privacy`
2. Uncheck "Prevent cross-site tracking" for development
3. Make sure "Block all cookies" is not enabled

### Issue 4: Safari Content Blockers

**Problem:** Ad blockers or content blockers interfere

**Solution:**
1. Disable all Safari extensions temporarily
2. Go to `Safari > Preferences > Extensions`
3. Uncheck all extensions
4. Reload the page

---

## Alternative Browsers

If Safari continues to have issues, try these browsers:

### Google Chrome
```
http://localhost:3000
```
- Best for development
- Excellent developer tools
- Works well with React DevTools

### Firefox
```
http://localhost:3000
```
- Great privacy features
- Good developer tools
- Works well for testing

### Microsoft Edge
```
http://localhost:3000
```
- Based on Chromium
- Good compatibility
- Works well for testing

---

## Common Errors and Solutions

### Error: "Cannot Connect to Server" or "ERR_CONNECTION_REFUSED"

**Cause:** Frontend or backend server not running

**Solution:**
1. Check if backend is running: Open http://localhost:5000/api/health
   - Should show: `{"success":true,"message":"Server is running"...}`
2. If backend fails, check MongoDB is running
3. Check if frontend is running: Look for "VITE" message in terminal
4. Make sure both terminals are still running

### Error: "EADDRINUSE: address already in use :::5000"

**Cause:** Port 5000 is already being used

**Solution Option 1 - Find and kill the process:**

**Mac/Linux:**
```bash
# Find process using port 5000
lsof -ti:5000

# Kill the process
kill -9 $(lsof -ti:5000)
```

**Windows:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**Solution Option 2 - Change the port:**

Edit `server/.env`:
```env
PORT=5001
```

Then access backend at http://localhost:5001

### Error: "EADDRINUSE: address already in use :::3000"

**Cause:** Port 3000 is already being used

**Solution:**

**Mac/Linux:**
```bash
kill -9 $(lsof -ti:3000)
```

**Windows:**
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Error: "MongoServerError: connect ECONNREFUSED"

**Cause:** MongoDB is not running

**Solution:**
1. Start MongoDB (see Step 3 above)
2. Verify MongoDB is running on port 27017
3. Check MongoDB connection string in `server/.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/rental-marketplace
   ```

### Error: "Cannot find module"

**Cause:** Dependencies not installed

**Solution:**
```bash
# Backend
cd server
rm -rf node_modules package-lock.json
npm install

# Frontend
cd client
rm -rf node_modules package-lock.json
npm install
```

---

## Verification Checklist

Run through this checklist to ensure everything is set up correctly:

### ✅ Backend Verification

1. **MongoDB is running:**
   ```bash
   mongosh
   # Should connect without errors
   ```

2. **Backend server starts:**
   ```bash
   cd server
   npm run dev
   # Should show: "Server running in development mode on port 5000"
   ```

3. **Backend API responds:**
   - Open browser
   - Visit: http://localhost:5000/api/health
   - Should show JSON: `{"success":true,"message":"Server is running"...}`

### ✅ Frontend Verification

1. **Frontend server starts:**
   ```bash
   cd client
   npm run dev
   # Should show: "Local: http://localhost:3000/"
   ```

2. **Frontend loads in browser:**
   - Open Safari (or any browser)
   - Visit: http://localhost:3000
   - Should see the RentStyle homepage

### ✅ Full Application Test

1. Open http://localhost:3000 in Safari
2. Click "Sign Up" to create an account
3. If registration works, the application is running correctly!

---

## Network Tab Debugging (Advanced)

If the page loads but shows errors:

1. Open Safari Developer Tools:
   - Enable: `Safari > Preferences > Advanced > Show Develop menu in menu bar`
   - Open: `Develop > Show Web Inspector` or press `Cmd + Option + I`

2. Go to "Network" tab

3. Refresh the page (`Cmd + R`)

4. Look for failed requests (red):
   - If `/api/` requests fail → Backend not running or CORS issue
   - If main page fails → Frontend not running
   - If static assets fail → Path configuration issue

5. Check Console tab for error messages

---

## Still Having Issues?

### Option 1: Start Fresh

1. **Stop all servers:**
   - Press `Ctrl + C` in both terminal windows

2. **Clean installation:**
   ```bash
   # Backend
   cd server
   rm -rf node_modules package-lock.json
   npm install

   # Frontend
   cd client
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Start MongoDB:**
   ```bash
   # Mac
   brew services start mongodb-community

   # Windows
   net start MongoDB

   # Linux
   sudo systemctl start mongod
   ```

4. **Start servers in order:**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev

   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```

5. **Access application:**
   - Open Safari
   - Visit: http://localhost:3000

### Option 2: Check System Requirements

Make sure you have:
- ✅ Node.js v16 or higher: `node --version`
- ✅ npm v7 or higher: `npm --version`
- ✅ MongoDB v5 or higher: `mongod --version`

### Option 3: Use Different Browser

If Safari continues to have issues, use Chrome or Firefox for development:
- Chrome: http://localhost:3000
- Firefox: http://localhost:3000

---

## Quick Reference Commands

### Start Everything
```bash
# Terminal 1 - Start MongoDB
brew services start mongodb-community  # Mac
# or
mongod  # All platforms

# Terminal 2 - Start Backend
cd server && npm run dev

# Terminal 3 - Start Frontend
cd client && npm run dev
```

### Stop Everything
```bash
# Stop backend/frontend: Ctrl + C in each terminal

# Stop MongoDB
brew services stop mongodb-community  # Mac
# or press Ctrl + C in mongod terminal
```

### Check What's Running
```bash
# Check backend (port 5000)
curl http://localhost:5000/api/health

# Check frontend (port 3000)
curl http://localhost:3000

# Check MongoDB (port 27017)
mongosh
```

---

## Environment Setup

Make sure your `server/.env` file is configured:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/rental-marketplace

# JWT Configuration (generate secure random strings!)
JWT_SECRET=your-very-secure-random-string-here
JWT_REFRESH_SECRET=another-secure-random-string

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:3000

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Generate secure secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Need More Help?

If you're still experiencing issues:

1. Check the main README.md for detailed setup instructions
2. Review the QUICKSTART.md for step-by-step setup
3. Open an issue on GitHub with:
   - Your operating system
   - Browser version
   - Error messages (screenshots help!)
   - Console output from terminal
   - What you've tried so far

---

**Happy Coding! 🚀**
