# Using Terminals in VS Code and Mac

This guide explains how to open and use terminals in VS Code and Mac to run your backend and frontend servers.

## 🖥️ Using VS Code Terminal (Recommended for Development)

VS Code has a built-in terminal that's perfect for development. Here's how to use it:

### Opening Terminals in VS Code

**Method 1: Using Menu**
1. Go to `Terminal` → `New Terminal` in the menu bar
2. Or use keyboard shortcut: `Ctrl + ` ` (backtick) on Windows/Linux or `Cmd + ` ` on Mac

**Method 2: Split Terminals (Best for This Project)**
1. Open first terminal: `Cmd + ` ` (Mac) or `Ctrl + ` ` (Windows/Linux)
2. Click the **Split Terminal** button (icon with two panels) in the terminal toolbar
3. Repeat to create a third terminal

### Setting Up 3 Terminals in VS Code

```
┌─────────────────────────────────────────────────┐
│  VS Code Window                                  │
│  ├── Your Code Editor (top)                     │
│  └── Terminal Panel (bottom) - Split into 3:    │
│      ├── Terminal 1: MongoDB                     │
│      ├── Terminal 2: Backend                     │
│      └── Terminal 3: Frontend                    │
└─────────────────────────────────────────────────┘
```

### Step-by-Step: Running in VS Code

1. **Open VS Code in your project folder:**
   ```bash
   cd /path/to/rental-marketplace
   code .
   ```

2. **Terminal 1 - Start MongoDB:**
   - Open terminal: `Cmd + ` `
   - Type:
     ```bash
     mongod
     ```
   - Leave this terminal running

3. **Terminal 2 - Start Backend:**
   - Split terminal (click split icon)
   - Type:
     ```bash
     cd server
     npm run dev
     ```
   - You should see: `Server running in development mode on port 5000`
   - Leave this terminal running

4. **Terminal 3 - Start Frontend:**
   - Split terminal again
   - Type:
     ```bash
     cd client
     npm run dev
     ```
   - You should see: `Local: http://localhost:3000/`
   - Leave this terminal running

5. **Access your app:**
   - Open browser to `http://localhost:3000`

### VS Code Terminal Tips

**Navigate between split terminals:**
- Click on the terminal you want to use
- Or use `Cmd + Up/Down` arrows

**Clear terminal:**
- Type `clear` or press `Cmd + K`

**Kill a running process:**
- Press `Ctrl + C` in the terminal

**Scroll in terminal:**
- Use mouse scroll wheel
- Or `Cmd + Up/Down`

---

## 🍎 Using Mac Terminal (Native Terminal App)

If you prefer the native Mac Terminal app:

### Opening Multiple Mac Terminals

**Method 1: Multiple Windows**
1. Open Terminal app (from Applications → Utilities → Terminal)
2. Press `Cmd + N` to open a new terminal window
3. Repeat to have 3 terminal windows
4. Arrange them on your screen

**Method 2: Multiple Tabs (Cleaner)**
1. Open Terminal app
2. Press `Cmd + T` to open a new tab
3. Press `Cmd + T` again for a third tab
4. Switch between tabs with `Cmd + 1`, `Cmd + 2`, `Cmd + 3`

### Step-by-Step: Running in Mac Terminal

1. **Navigate to your project:**
   ```bash
   cd ~/path/to/rental-marketplace
   ```

2. **Tab/Window 1 - Start MongoDB:**
   ```bash
   mongod
   # or if using Homebrew:
   brew services start mongodb-community
   ```

3. **Tab/Window 2 - Start Backend:**
   - Open new tab: `Cmd + T`
   - Type:
     ```bash
     cd ~/path/to/rental-marketplace/server
     npm run dev
     ```

4. **Tab/Window 3 - Start Frontend:**
   - Open new tab: `Cmd + T`
   - Type:
     ```bash
     cd ~/path/to/rental-marketplace/client
     npm run dev
     ```

### Mac Terminal Tips

**Switch between tabs:**
- `Cmd + 1`, `Cmd + 2`, `Cmd + 3`

**Switch between windows:**
- `Cmd + ~` (backtick)

**Clear terminal:**
- Type `clear` or press `Cmd + K`

**Close tab/window:**
- `Cmd + W`

---

## 🔄 Which One Should I Use?

### Use **VS Code Terminal** if:
- ✅ You're already using VS Code for coding
- ✅ You want everything in one window
- ✅ You like split terminals side-by-side
- ✅ You're new to development (easier to manage)

### Use **Mac Terminal** if:
- ✅ You prefer native Mac apps
- ✅ You want terminals in separate windows
- ✅ You're comfortable with terminal
- ✅ You use other editors besides VS Code

**Recommendation:** Use **VS Code Terminal** - it's integrated and easier to manage all 3 terminals in one place!

---

## 📱 Other Terminal Options for Mac

### iTerm2 (Advanced Users)
- Download from: https://iterm2.com/
- More features than default Terminal
- Better split panes and customization
- Popular among developers

### Warp (Modern Terminal)
- Download from: https://www.warp.dev/
- Modern, AI-powered terminal
- Great for beginners
- Has command suggestions

---

## 🎯 Quick Reference: Terminal Commands

### Opening Terminals

| Action | VS Code | Mac Terminal |
|--------|---------|--------------|
| New Terminal | `Cmd + ` ` | `Cmd + N` (window) or `Cmd + T` (tab) |
| Split Terminal | Click split icon | Not available |
| Close Terminal | `Cmd + W` | `Cmd + W` |
| Switch Terminal | Click or arrow keys | `Cmd + 1/2/3` |

### Running the Servers

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

### Stopping the Servers

```bash
# In each terminal, press:
Ctrl + C
```

---

## 🎬 Visual Guide: VS Code Terminal Setup

### Step 1: Open VS Code
```bash
cd /path/to/rental-marketplace
code .
```

### Step 2: Open First Terminal
Press `Cmd + ` ` (backtick key, below Escape)

### Step 3: Split Terminals
Click the split terminal icon twice to create 3 terminals:

```
╔══════════════════════════════════════════════╗
║  Code Editor (your files)                    ║
╠══════════════════════════════════════════════╣
║  Terminal 1    │ Terminal 2    │ Terminal 3  ║
║  $ mongod      │ $ cd server   │ $ cd client ║
║                │ $ npm run dev │ $ npm run   ║
║                │               │   dev       ║
╚══════════════════════════════════════════════╝
```

### Step 4: Run Commands in Each Terminal

**Terminal 1 (Left):**
```bash
mongod
```

**Terminal 2 (Middle):**
```bash
cd server
npm run dev
```

**Terminal 3 (Right):**
```bash
cd client
npm run dev
```

---

## 💡 Pro Tips

### VS Code Tips:
1. **Save terminal layout:** VS Code remembers your split terminals between sessions
2. **Rename terminals:** Right-click terminal → "Rename"
3. **Color code terminals:** Install "Terminal Tabs" extension
4. **Use terminal tasks:** Create tasks.json to run all servers with one command

### Mac Terminal Tips:
1. **Create profiles:** Terminal → Preferences → Profiles (different colors for each server)
2. **Save window arrangement:** Window → Save Window as...
3. **Auto-run commands:** Set up profiles to auto-run specific commands

### General Tips:
1. **Always start MongoDB first** - Both servers need the database
2. **Start backend second** - Frontend needs backend API
3. **Start frontend last** - This opens the browser automatically
4. **Keep terminals visible** - Don't close them while working
5. **Check for errors** - Look at each terminal for error messages

---

## 🆘 Troubleshooting

### "Command not found: code"
**Solution:** Install VS Code command line tools:
1. Open VS Code
2. Press `Cmd + Shift + P`
3. Type "Shell Command: Install 'code' command in PATH"
4. Press Enter

### "mongod: command not found"
**Solution:** Install MongoDB or add to PATH:
```bash
# If using Homebrew:
brew install mongodb-community

# Or add MongoDB to PATH in ~/.zshrc or ~/.bash_profile:
export PATH="/usr/local/opt/mongodb-community/bin:$PATH"
```

### Terminal is too small
**Solution:**
- **VS Code:** Drag the terminal divider up/down
- **Mac Terminal:** Click and drag window corner or use `Cmd + +` / `Cmd + -`

### Can't see all three terminals
**Solution in VS Code:**
- Make terminal panel larger (drag the divider up)
- Use horizontal split instead of vertical
- Reduce terminal font size: `Cmd + -`

---

## 🎓 Learning Resources

### VS Code Terminal
- Official docs: https://code.visualstudio.com/docs/terminal/basics
- Video tutorial: Search "VS Code terminal tutorial" on YouTube

### Mac Terminal
- Official docs: https://support.apple.com/guide/terminal/welcome/mac
- Beginner guide: Search "Mac terminal for beginners"

---

## ✅ Checklist: Are Your Terminals Set Up?

- [ ] I can open VS Code terminal with `Cmd + ` `
- [ ] I can split terminals in VS Code
- [ ] I have 3 terminals open and ready
- [ ] Terminal 1 is running MongoDB (`mongod` command)
- [ ] Terminal 2 is running backend (`npm run dev` in server folder)
- [ ] Terminal 3 is running frontend (`npm run dev` in client folder)
- [ ] I can see all three terminals at once
- [ ] I know how to stop servers (Ctrl + C)
- [ ] I can access http://localhost:3000 in my browser

**If all checked - you're ready to develop! 🎉**

---

## 📞 Need More Help?

- Check [HOW_TO_RUN.md](HOW_TO_RUN.md) - How to run backend and frontend
- Check [QUICKSTART.md](QUICKSTART.md) - Quick start guide
- Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Common issues and solutions
- Open an issue on GitHub with screenshots of your terminal setup

---

**Happy Coding! 🚀**
