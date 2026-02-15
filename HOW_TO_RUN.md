# How to Run Backend and Frontend Together

This guide shows you exactly how to run both the backend and frontend servers for the RentStyle rental marketplace.

## 📋 What You Need First

Before starting, make sure you have:
- ✅ Node.js installed (v16 or higher) - Check with: `node --version`
- ✅ MongoDB installed and running - Check with: `mongod --version`
- ✅ npm installed - Check with: `npm --version`

---

## 🚀 Complete Setup (First Time Only)

### 1️⃣ Install Backend Dependencies

```bash
cd server
npm install
```

This installs all the packages needed for the backend server.

### 2️⃣ Install Frontend Dependencies

```bash
cd client
npm install
```

This installs all the packages needed for the React frontend.

### 3️⃣ Set Up Environment Variables

```bash
cd server
cp .env.example .env
```

Now edit the `server/.env` file and add:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/rental-marketplace
JWT_SECRET=your-secure-random-string-here
JWT_REFRESH_SECRET=another-secure-random-string-here
CLIENT_URL=http://localhost:3000
```

**Generate secure secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Run this command twice and use the outputs for JWT_SECRET and JWT_REFRESH_SECRET.

---

## 🎯 Running Both Servers (Every Time)

You need to run THREE things in separate terminal windows:

### Terminal 1: Start MongoDB

**Mac (Homebrew):**
```bash
brew services start mongodb-community
```

**Mac (Manual):**
```bash
mongod
```

**Windows:**
```bash
mongod
```

**Linux:**
```bash
sudo service mongod start
```

Keep this terminal open while working.

---

### Terminal 2: Start Backend Server

```bash
cd server
npm run dev
```

**What you should see:**
```
MongoDB Connected: localhost
Server running in development mode on port 5000
```

✅ If you see this, your backend is running!
❌ If you see errors, check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

**Leave this terminal open!**

---

### Terminal 3: Start Frontend Server

Open a NEW terminal window and run:

```bash
cd client
npm run dev
```

**What you should see:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

✅ If you see this, your frontend is running!

**Leave this terminal open!**

---

## 🌐 Access Your Application

Open your browser and go to:

### **http://localhost:3000**

You should see the RentStyle homepage!

---

## 🎬 Visual Overview

Here's what your setup looks like:

```
┌─────────────────────────────────────────────────────┐
│  Terminal 1: MongoDB                                 │
│  $ mongod                                            │
│  [MongoDB server 127.0.0.1:27017]                    │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  Terminal 2: Backend (Node.js/Express)               │
│  $ cd server && npm run dev                          │
│  Server running on port 5000                         │
│  http://localhost:5000/api                           │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  Terminal 3: Frontend (React/Vite)                   │
│  $ cd client && npm run dev                          │
│  Running on port 3000                                │
│  http://localhost:3000                               │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  Browser: http://localhost:3000                      │
│  RentStyle Application                               │
└─────────────────────────────────────────────────────┘
```

---

## ⚡ Quick Commands Cheat Sheet

### First Time Setup
```bash
# Backend
cd server
npm install
cp .env.example .env
# Edit .env file with your settings

# Frontend
cd client
npm install
```

### Every Time You Work
```bash
# Terminal 1 - MongoDB
mongod

# Terminal 2 - Backend
cd server
npm run dev

# Terminal 3 - Frontend
cd client
npm run dev
```

### Stopping Everything
- Press `Ctrl + C` in each terminal window
- For MongoDB: `Ctrl + C` or `brew services stop mongodb-community`

---

## ✅ Verification Checklist

Use this to make sure everything is working:

- [ ] MongoDB is running (Terminal 1 shows database server started)
- [ ] Backend is running (Terminal 2 shows "Server running in development mode on port 5000")
- [ ] Frontend is running (Terminal 3 shows "Local: http://localhost:3000/")
- [ ] Browser can access http://localhost:3000
- [ ] Backend API works: http://localhost:5000/api/health should return JSON

---

## 🔧 Common Issues

### "Port 5000 already in use"
Someone is using port 5000. Kill the process:
```bash
# Mac/Linux
kill -9 $(lsof -ti:5000)

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### "Port 3000 already in use"
Someone is using port 3000. Kill the process:
```bash
# Mac/Linux
kill -9 $(lsof -ti:3000)
```

### "Cannot connect to MongoDB"
Make sure MongoDB is running in Terminal 1.

### Frontend shows blank page
1. Check backend is running
2. Check browser console for errors (F12)
3. Try http://localhost:5000/api/health to verify backend

### Need more help?
See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for detailed solutions.

---

## 📚 What Each Server Does

### Backend (Port 5000)
- Handles all API requests
- Manages database (MongoDB)
- User authentication
- File uploads
- Business logic

### Frontend (Port 3000)
- User interface (React)
- Makes API calls to backend
- Displays data
- Handles user interactions

### MongoDB (Port 27017)
- Stores all data
- Users, products, reviews, etc.

---

## 🎓 Development Workflow

**Typical workflow when developing:**

1. Start MongoDB (Terminal 1) - Leave running
2. Start Backend (Terminal 2) - Restarts automatically when you change backend code
3. Start Frontend (Terminal 3) - Restarts automatically when you change frontend code
4. Open http://localhost:3000 in browser
5. Make changes to your code
6. Changes appear automatically in browser! ✨

**When you're done:**
- Press `Ctrl + C` in Terminal 2 (Backend)
- Press `Ctrl + C` in Terminal 3 (Frontend)
- Press `Ctrl + C` in Terminal 1 (MongoDB) or leave running for next time

---

## 🆘 Still Need Help?

1. Check [QUICKSTART.md](QUICKSTART.md) - 5-minute quick start guide
2. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Detailed troubleshooting
3. Check [README.md](README.md) - Complete documentation
4. Open an issue on GitHub with your error messages

---

**You're all set! Happy coding! 🚀**
