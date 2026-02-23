#!/bin/bash

# Closetly Quick Start Script
# This script helps you get the application running in 5 minutes

set -e  # Exit on error

echo "🚀 Closetly Quick Start"
echo "======================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✓ Node.js found:${NC} $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ npm found:${NC} $(npm --version)"
echo ""

# Step 1: Install dependencies
echo -e "${BLUE}Step 1: Installing dependencies...${NC}"

if [ ! -d "server/node_modules" ]; then
    echo "→ Installing server dependencies..."
    cd server
    npm install --silent
    cd ..
    echo -e "${GREEN}✓ Server dependencies installed${NC}"
else
    echo -e "${YELLOW}⊘ Server dependencies already installed${NC}"
fi

if [ ! -d "client/node_modules" ]; then
    echo "→ Installing client dependencies..."
    cd client
    npm install --silent
    npm install react-calendar date-fns --silent
    cd ..
    echo -e "${GREEN}✓ Client dependencies installed${NC}"
else
    echo -e "${YELLOW}⊘ Client dependencies already installed${NC}"
fi

echo ""

# Step 2: Check environment variables
echo -e "${BLUE}Step 2: Checking environment variables...${NC}"

if [ ! -f "server/.env" ]; then
    echo -e "${YELLOW}⚠ No .env file found. Creating from example...${NC}"
    cp server/.env.example server/.env
    echo -e "${YELLOW}⚠ Please edit server/.env with your configuration${NC}"
    echo ""
    echo "Required variables:"
    echo "  - MONGODB_URI (get from mongodb.com/cloud/atlas)"
    echo "  - RAZORPAY_KEY_ID (get from dashboard.razorpay.com)"
    echo "  - RAZORPAY_KEY_SECRET"
    echo ""
    read -p "Press Enter when you've updated the .env file..."
else
    echo -e "${GREEN}✓ Environment file exists${NC}"
    
    # Check critical variables
    if grep -q "rzp_test_XXXXXXXXXX" server/.env; then
        echo -e "${YELLOW}⚠ Razorpay keys need to be updated in server/.env${NC}"
    fi
    
    if grep -q "mongodb://localhost:27017" server/.env; then
        echo -e "${YELLOW}⚠ Using local MongoDB. Make sure MongoDB is running.${NC}"
    fi
fi

echo ""

# Step 3: Check MongoDB
echo -e "${BLUE}Step 3: Checking database connection...${NC}"

read -p "Are you using MongoDB Atlas (cloud) or local MongoDB? (atlas/local): " db_choice

if [ "$db_choice" = "local" ]; then
    if pgrep -x "mongod" > /dev/null; then
        echo -e "${GREEN}✓ MongoDB is running${NC}"
    else
        echo -e "${YELLOW}⚠ MongoDB is not running${NC}"
        echo "Starting MongoDB..."
        
        # Try to start MongoDB
        if command -v brew &> /dev/null; then
            brew services start mongodb-community 2>/dev/null || echo "Couldn't start MongoDB automatically"
        else
            echo "Please start MongoDB manually:"
            echo "  mongod --dbpath=./mongodb-data --port 27017"
        fi
    fi
elif [ "$db_choice" = "atlas" ]; then
    echo -e "${GREEN}✓ Using MongoDB Atlas${NC}"
    echo "Make sure your MONGODB_URI in server/.env is correct"
fi

echo ""

# Step 4: Create directories
echo -e "${BLUE}Step 4: Setting up directories...${NC}"

mkdir -p server/uploads
mkdir -p mongodb-data

echo -e "${GREEN}✓ Upload directory created${NC}"
echo -e "${GREEN}✓ MongoDB data directory created${NC}"
echo ""

# Step 5: Start servers
echo -e "${BLUE}Step 5: Starting servers...${NC}"
echo ""
echo "This will open 2 terminal windows:"
echo "  1. Backend (http://localhost:5001)"
echo "  2. Frontend (http://localhost:3000)"
echo ""
read -p "Press Enter to start servers..."

# Kill any existing processes on ports 5001 and 3000
lsof -ti:5001 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Start backend in new terminal
osascript -e 'tell app "Terminal"
    do script "cd '"$(pwd)/server"' && echo \"🟢 Starting Backend Server...\" && npm start"
end tell'

# Wait a bit for backend to start
sleep 3

# Start frontend in new terminal  
osascript -e 'tell app "Terminal"
    do script "cd '"$(pwd)/client"' && echo \"🔵 Starting Frontend Server...\" && npm run dev"
end tell'

echo ""
echo -e "${GREEN}✅ Closetly is starting!${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔌 Backend:  http://localhost:5001"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📖 Documentation:"
echo "   • Complete Guide: COMPLETE_IMPLEMENTATION.md"
echo "   • Business Plan:  EXPERT_STRATEGIC_PLAN.md"
echo "   • Taxonomy:       TAXONOMY_SYSTEM.md"
echo ""
echo "🧪 Test Credentials:"
echo "   • Razorpay Test Card: 4111 1111 1111 1111"
echo "   • CVV: 123"
echo "   • Expiry: 12/28"
echo ""
echo "🐛 Troubleshooting:"
echo "   • Backend not starting? Check MongoDB connection"
echo "   • Payment failing? Check Razorpay keys in server/.env"
echo "   • Frontend errors? Check browser console (F12)"
echo ""
echo -e "${GREEN}Happy Building! 🚀${NC}"
echo ""

# Open browser after 5 seconds
sleep 5
open http://localhost:3000 2>/dev/null || echo "Please open http://localhost:3000 in your browser"
