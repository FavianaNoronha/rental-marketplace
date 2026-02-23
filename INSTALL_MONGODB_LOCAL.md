# 🔧 Install MongoDB Locally - Step by Step Guide

Follow these steps **IN ORDER**. Each step must complete before moving to the next.

---

## ✅ **Step 1: Install Homebrew**

**Copy and paste this into your Terminal:**

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**What will happen:**
- It will ask for your **Mac password** (type it and press Enter)
- It will ask you to press **RETURN/ENTER** to continue
- Installation takes **5-10 minutes**

**Expected output:**
```
==> Installation successful!
```

**IMPORTANT - If you have Apple Silicon (M1/M2/M3 Mac):**

After Homebrew installs, run these 2 commands:

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
source ~/.zshrc
```

**Verify Homebrew is installed:**
```bash
brew --version
```

You should see: `Homebrew 4.x.x`

---

## ✅ **Step 2: Install MongoDB**

**Copy and paste these commands ONE BY ONE:**

```bash
brew tap mongodb/brew
```

Then:

```bash
brew install mongodb-community@7.0
```

**What will happen:**
- Download MongoDB (~200MB)
- Takes **3-5 minutes**

**Expected output:**
```
🍺 mongodb-community@7.0 was successfully installed!
```

---

## ✅ **Step 3: Start MongoDB**

**Choose ONE option:**

### Option A: Start as Background Service (Recommended)
MongoDB will auto-start whenever you restart your Mac:

```bash
brew services start mongodb-community@7.0
```

**Expected output:**
```
==> Successfully started `mongodb-community` (label: homebrew.mxcl.mongodb-community)
```

### Option B: Start Manually (Only for this session)
MongoDB will stop when you close Terminal:

```bash
mongod --config /opt/homebrew/etc/mongod.conf --fork
```

---

## ✅ **Step 4: Verify MongoDB is Running**

**Check if MongoDB is running:**

```bash
brew services list | grep mongodb
```

**You should see:**
```
mongodb-community started
```

**Test connection:**

```bash
mongosh --eval "db.version()"
```

**You should see:**
```
7.0.x
```

---

## ✅ **Step 5: Seed Your Database**

**Run the seeder to add 10 fashion products:**

```bash
cd /Users/faviananoronha/Developer/rental-marketplace/server
npm run seed
```

**Expected output:**
```
🌱 Starting database seeding...
✅ Connected to MongoDB
✅ Demo seller created
📦 Seeding products...
✅ Successfully seeded 10 products

📊 Product Summary:
   Utsav: 4 products
   Safar: 2 products
   Alankrit: 2 products
   Niche-Luxe: 2 products

🎉 Database seeding completed!
```

---

## ✅ **Step 6: Restart Your Backend**

**Kill the current backend (if running):**

```bash
pkill -f "node server.js"
```

**Start the backend:**

```bash
cd /Users/faviananoronha/Developer/rental-marketplace/server
npm start
```

**Expected output:**
```
Server running in development mode on port 5001
✅ MongoDB connected successfully
```

---

## ✅ **Step 7: Test Everything Works**

**Check backend health:**

```bash
curl http://localhost:5001/api/health
```

**You should see:**
```json
{
  "status": "ok",
  "mongodb": "connected",  ← SHOULD SAY "connected"!
  "environment": "development"
}
```

**Open your website:**
- Go to: http://localhost:3001/feed
- You should see **10 fashion products with real images**!

---

## 🎉 **SUCCESS! You're Done!**

Your full stack is now running:
- ✅ Frontend: http://localhost:3001
- ✅ Backend: http://localhost:5001
- ✅ MongoDB: Running locally
- ✅ 10 Products: Seeded with real images

---

## 🛠️ **Useful Commands**

### Stop MongoDB:
```bash
brew services stop mongodb-community@7.0
```

### Restart MongoDB:
```bash
brew services restart mongodb-community@7.0
```

### Check MongoDB Status:
```bash
brew services list
```

### View MongoDB Logs:
```bash
tail -f /opt/homebrew/var/log/mongodb/mongo.log
```

### Connect to MongoDB Shell:
```bash
mongosh
```

### Clear Database (if needed):
```bash
mongosh rental-marketplace --eval "db.dropDatabase()"
```

---

## ❌ **Troubleshooting**

### "brew: command not found"
- Homebrew didn't install correctly
- For Apple Silicon: Run the "IMPORTANT" commands from Step 1
- Try: `which brew` to see if it's installed

### "MongoDB won't start"
```bash
# Check what's wrong:
brew services list

# Check logs:
cat /opt/homebrew/var/log/mongodb/mongo.log

# Try manual start:
mongod --config /opt/homebrew/etc/mongod.conf
```

### "Port 27017 already in use"
```bash
# Find what's using it:
lsof -ti:27017

# Kill it:
lsof -ti:27017 | xargs kill -9

# Restart MongoDB:
brew services restart mongodb-community@7.0
```

### "Seeder fails"
- Make sure MongoDB is running: `brew services list`
- Check connection: `mongosh --eval "db.version()"`
- Check `.env` file has: `MONGODB_URI=mongodb://localhost:27017/rental-marketplace`

---

## 📝 **Quick Reference**

**Your MongoDB Details:**
- **Host**: localhost
- **Port**: 27017
- **Database**: rental-marketplace
- **Connection String**: `mongodb://localhost:27017/rental-marketplace`
- **Config File**: `/opt/homebrew/etc/mongod.conf`
- **Data Directory**: `/opt/homebrew/var/mongodb`
- **Log File**: `/opt/homebrew/var/log/mongodb/mongo.log`

**Login Credentials (Demo Account):**
- **Email**: demo@closetly.com
- **Password**: Demo@123

---

**🚀 Start from Step 1 and follow in order. Good luck!**
