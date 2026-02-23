#!/bin/bash

# Fix macOS file limit for Expo/Metro bundler
# This is a common issue when running React Native/Expo projects

echo "🔧 Fixing macOS file watching limits..."

# Check current limits
echo "Current limits:"
ulimit -n
launchctl limit maxfiles

# Increase file limit for current session
ulimit -n 65536

echo ""
echo "✅ File limit increased to 65536 for this session"
echo ""

# Make it permanent (optional)
read -p "Make this change permanent? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "Creating /Library/LaunchDaemons/limit.maxfiles.plist..."
    sudo tee /Library/LaunchDaemons/limit.maxfiles.plist > /dev/null <<'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>Label</key>
    <string>limit.maxfiles</string>
    <key>ProgramArguments</key>
    <array>
      <string>launchctl</string>
      <string>limit</string>
      <string>maxfiles</string>
      <string>65536</string>
      <string>200000</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>ServiceIPC</key>
    <false/>
  </dict>
</plist>
EOF
    
    sudo chown root:wheel /Library/LaunchDaemons/limit.maxfiles.plist
    sudo launchctl load -w /Library/LaunchDaemons/limit.maxfiles.plist
    
    echo "✅ Change will persist after reboot"
else
    echo "⏩ Skipping permanent change"
fi

echo ""
echo "Now restart Expo with:"
echo "  cd mobile && npx expo start"
