# 🚀 MongoDB Setup - Quick Start

## ✅ OPTION 1: MongoDB Atlas (Cloud - Recommended)

**No installation required! Free forever for small projects.**

### Steps (5 minutes):

1. **Create Free Account:**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up with email or Google

2. **Create Free Cluster:**
   - Click "Build a Database"
   - Choose **FREE** tier (M0)
   - Select region closest to you (Singapore or Mumbai)
   - Click "Create Cluster"

3. **Setup Database Access:**
   - Go to "Database Access" → "Add New Database User"
   - Username: `closetly`
   - Password: Click "Autogenerate Secure Password" (copy it!)
   - User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Setup Network Access:**
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String:**
   - Go back to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string (looks like):
   ```
   mongodb+srv://closetly:<password>@cluster0.xxxxx.mongodb.net/
   ```
   - Replace `<password>` with the password you copied earlier

6. **Update Your .env File:**
   ```bash
   # Edit server/.env
   MONGODB_URI=mongodb+srv://closetly:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/rental-marketplace?retryWrites=true&w=majority
   ```

7. **Test Connection:**
   ```bash
   cd server
   npm start
   ```

**That's it! ✅ Your database is ready in the cloud!**

---

## ⚙️ OPTION 2: Local MongoDB Installation

### For macOS (Apple Silicon / Intel):

**Step 1: Install Homebrew (if not installed)**
```bash
# Run this in Terminal:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# For Apple Silicon (M1/M2/M3), add Homebrew to PATH:
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
source ~/.zshrc
```

**Step 2: Install MongoDB**
```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
```

**Step 3: Start MongoDB**
```bash
# Option A: Start as a service (runs automatically)
brew services start mongodb-community@7.0

# Option B: Start manually (for this session only)
mongod --config /opt/homebrew/etc/mongod.conf
```

**Step 4: Verify Installation**
```bash
# Check if MongoDB is running
brew services list | grep mongodb

# Connect to MongoDB shell (optional)
mongosh
```

**Step 5: Update Your .env File:**
```bash
# Edit server/.env
MONGODB_URI=mongodb://localhost:27017/rental-marketplace
```

**Step 6: Test Connection:**
```bash
cd server
npm start
```

---

## 🌱 Seed Your Database

Once MongoDB is connected (either Atlas or Local):

```bash
cd server
npm run seed
```

**Expected Output:**
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

## 🧪 Test Your Setup

### 1. Start Backend:
```bash
cd server
npm start
```

**Expected:**
```
Server running on port 5001
MongoDB connected successfully
```

### 2. View Your Feed:
- Go to: http://localhost:3001/feed
- You should see 10 fashion products with real images!

### 3. Login (Optional):
- Email: `demo@closetly.com`
- Password: `Demo@123`

---

## ❓ Troubleshooting

### "MongoDB connection failed"
- **Atlas:** Check IP whitelist, verify connection string, check password
- **Local:** Run `brew services list` to see if MongoDB is running

### "Seeder fails"
- Make sure MongoDB is connected first
- Check `MONGODB_URI` in `.env` file
- Try connecting with: `mongosh "YOUR_CONNECTION_STRING"`

### "Port 27017 already in use"
```bash
# Find and kill the process
lsof -ti:27017 | xargs kill -9

# Restart MongoDB
brew services restart mongodb-community
```

---

## 💡 Pro Tips

### MongoDB Atlas (Cloud):
- ✅ No installation or maintenance
- ✅ Automatic backups
- ✅ Free 512MB storage
- ✅ Works from anywhere
- ✅ Best for development and small projects

### Local MongoDB:
- ✅ Faster (no network latency)
- ✅ Works offline
- ✅ Full control
- ❌ Need to maintain/backup yourself

**For your rental marketplace, I recommend starting with Atlas!**

---

## 🎯 Next Steps After Setup:

1. ✅ Connect MongoDB (Atlas or Local)
2. ✅ Run `npm run seed` to add products
3. ✅ Start backend with `npm start`
4. ✅ Browse feed at http://localhost:3001/feed
5. ✅ See 10 beautiful fashion products with real images!

**Ready to launch! 🚀**
