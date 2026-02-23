#!/bin/bash

# 🚀 Closetly End-to-End Setup Script
# Run this to test everything locally before deploying

set -e  # Exit on any error

echo "========================================"
echo "🚀 Closetly End-to-End Setup"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check Node.js
echo "📦 1/6 - Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org${NC}"
    exit 1
fi
NODE_VERSION=$(node --version)
echo -e "${GREEN}✅ Node.js found: $NODE_VERSION${NC}"
echo ""

# Check npm
echo "📦 2/6 - Checking npm..."
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found${NC}"
    exit 1
fi
NPM_VERSION=$(npm --version)
echo -e "${GREEN}✅ npm found: $NPM_VERSION${NC}"
echo ""

# Install backend dependencies
echo "📦 3/6 - Installing backend dependencies..."
cd server
if [ ! -d "node_modules" ]; then
    echo "Installing server dependencies..."
    npm install
else
    echo -e "${GREEN}✅ Server dependencies already installed${NC}"
fi
cd ..
echo ""

# Install frontend dependencies
echo "📦 4/6 - Installing frontend dependencies..."
cd client
if [ ! -d "node_modules" ]; then
    echo "Installing client dependencies..."
    npm install
else
    echo -e "${GREEN}✅ Client dependencies already installed${NC}"
fi
cd ..
echo ""

# Create backend .env if not exists
echo "⚙️  5/6 - Checking backend .env file..."
if [ ! -f "server/.env" ]; then
    echo "Creating server/.env file..."
    cat > server/.env << 'EOF'
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
    echo -e "${GREEN}✅ Created server/.env file${NC}"
else
    echo -e "${GREEN}✅ server/.env file already exists${NC}"
fi
echo ""

# Test MongoDB connection
echo "🔌 6/6 - Testing MongoDB Atlas connection..."
echo -e "${YELLOW}⏳ Attempting to connect to MongoDB...${NC}"

# Start backend temporarily to test
cd server
npm start &
BACKEND_PID=$!
sleep 5

# Test health endpoint
if curl -s http://localhost:5001/api/health | grep -q "ok"; then
    echo -e "${GREEN}✅ Backend connected to MongoDB successfully!${NC}"
else
    echo -e "${RED}❌ Backend couldn't connect to MongoDB${NC}"
    echo -e "${YELLOW}⚠️  You need to update MongoDB Atlas IP whitelist:${NC}"
    echo "   1. Go to https://cloud.mongodb.com"
    echo "   2. Click 'Network Access'"
    echo "   3. Click 'Add IP Address'"
    echo "   4. Select 'Allow Access from Anywhere' (0.0.0.0/0)"
    echo "   5. Wait 1-2 minutes and run this script again"
fi

# Stop temporary backend
kill $BACKEND_PID 2>/dev/null || true
cd ..
echo ""

echo "========================================"
echo "🎉 Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo ""
echo "1️⃣  Start Backend (Terminal 1):"
echo "   cd server && npm start"
echo ""
echo "2️⃣  Start Frontend (Terminal 2):"
echo "   cd client && npm run dev"
echo ""
echo "3️⃣  Open Browser:"
echo "   http://localhost:5173"
echo ""
echo "4️⃣  Login with:"
echo "   Email: demo@closetly.com"
echo "   Password: Demo@123"
echo ""
echo "📱 Or test Phone OTP:"
echo "   Phone: 9876543210"
echo "   (OTP will appear in backend terminal)"
echo ""
echo "📖 Full guide: END_TO_END_GUIDE.md"
echo ""
echo "🚀 Ready to deploy? See DEPLOY_NOW.md"
echo "========================================"
