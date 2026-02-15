# Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites
Make sure you have:
- Node.js (v16+) installed
- MongoDB installed and running
- npm or yarn package manager

### Step 1: Install Dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd client
npm install
```

### Step 2: Configure Environment

```bash
cd server
cp .env.example .env
```

Edit `.env` file with these **MINIMUM** required settings:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/rental-marketplace
JWT_SECRET=your-very-secure-random-string-here
JWT_REFRESH_SECRET=another-secure-random-string
CLIENT_URL=http://localhost:3000
```

**IMPORTANT:** Replace `your-very-secure-random-string-here` with actual random strings!

Generate secure secrets with:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Step 3: Start MongoDB

**Windows:**
```bash
mongod
```

**Mac/Linux:**
```bash
sudo service mongod start
# or
brew services start mongodb-community
```

### Step 4: Run the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

You should see:
```
MongoDB Connected: localhost
Server running in development mode on port 5000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### Step 5: Access the Application

Open your browser and go to: **http://localhost:3000**

## 🎯 Test the Application

### Create Your First Account

1. Click "Sign Up" in the navigation
2. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
3. You'll be automatically logged in!

### Create Your First Listing

1. Click "List Item"
2. Fill in the product details
3. Upload some images (optional - will use placeholder if skipped)
4. Click "Create Listing"

### Browse Products

1. Click "Browse" in the navigation
2. Use filters to search
3. Click on any product to view details

## 🔧 Troubleshooting

### MongoDB Connection Error

**Error:** `MongoServerError: connect ECONNREFUSED`

**Solution:**
- Make sure MongoDB is running: `mongod`
- Check if MongoDB is on port 27017
- Update MONGODB_URI in .env if using different port

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
- Change PORT in .env to a different port (e.g., 5001)
- Or kill the process using port 5000

### Cannot Find Module Error

**Error:** `Cannot find module 'xyz'`

**Solution:**
```bash
cd server
rm -rf node_modules package-lock.json
npm install

cd ../client
rm -rf node_modules package-lock.json
npm install
```

## 📝 Default Data

The application starts with an empty database. You can:
1. Create accounts and test all features
2. Use the demo account mentioned in README.md (if you seed it)
3. Import sample data (you'll need to create seed scripts)

## 🎉 You're Ready!

You now have a fully functional rental marketplace running locally. Explore the features:

- ✅ User registration and login
- ✅ Create product listings
- ✅ Browse and search products
- ✅ Add items to favorites
- ✅ Manage your listings in dashboard
- ✅ Update your profile
- ✅ And much more!

## 📚 Next Steps

- Read the full README.md for detailed documentation
- Check out the API endpoints section
- Customize the application to your needs
- Add more features and improvements

---

**Need Help?** Open an issue in the repository or check the README.md for more information.
