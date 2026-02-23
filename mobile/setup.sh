#!/bin/bash

echo "🚀 Setting up Closetly Mobile App"
echo "=================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Check if in mobile directory
if [ ! -f "package.json" ]; then
    echo "📂 Changing to mobile directory..."
    cd mobile
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "✨ Setup Complete!"
echo ""
echo "🎯 Next Steps:"
echo ""
echo "1. Install Expo Go on your phone:"
echo "   • iOS: https://apps.apple.com/app/expo-go/id982107779"
echo "   • Android: https://play.google.com/store/apps/details?id=host.exp.exponent"
echo ""
echo "2. Start the development server:"
echo "   npm start"
echo ""
echo "3. Scan the QR code with your phone"
echo ""
echo "📖 Full documentation: mobile/README.md"
echo ""
