# 🚀 Getting Started with Desktop Zen App

Welcome! This guide will help you get the Desktop Zen App running in minutes.

## ⚡ Quick Start (30 seconds)

### Step 1: Navigate to the app directory
```bash
cd desktop-zen-app
```

### Step 2: Run the app
**On Linux/macOS:**
```bash
./run.sh
```

**On Windows:**
```cmd
run.bat
```

### Step 3: Open in browser or native window
- **Native Window**: Opens automatically
- **Browser**: http://localhost:5174

That's it! 🎉

---

## 📋 What You Need

### Required:
- ✅ **Go** 1.20+ - [Download](https://golang.org/dl/)
- ✅ **Node.js** 16+ - [Download](https://nodejs.org/)

### Optional (auto-installed):
- ✅ **Wails CLI** - Installed automatically if missing

### Linux Only:
```bash
sudo apt-get install libwebkit2gtk-4.1-dev libgtk-3-dev libayatana-appindicator3-dev
```

---

## 📁 Easy-Run Scripts

All scripts are in the `desktop-zen-app/` directory:

| Script | Purpose | Command |
|--------|---------|---------|
| `run.sh` / `run.bat` | Start development server | `./run.sh` or `run.bat` |
| `test.sh` / `test.bat` | Run all tests | `./test.sh` or `test.bat` |
| `build.sh` / `build.bat` | Build for production | `./build.sh` or `build.bat` |

---

## 🎯 Common Tasks

### Run the app in development mode
```bash
cd desktop-zen-app
./run.sh          # Linux/macOS
# or
run.bat           # Windows
```

### Run all tests
```bash
cd desktop-zen-app
./test.sh         # Linux/macOS
# or
test.bat          # Windows
```

### Build for production
```bash
cd desktop-zen-app
./build.sh        # Linux/macOS
# or
build.bat         # Windows
```

### Access in browser during development
```
http://localhost:5174
```

---

## 🧘 Using the App

1. **Select Duration**: Click a preset (Think, Study, Work) or enter custom (1-60 min)
2. **Start Session**: Click the large "Start" button
3. **Watch Timer**: See countdown with arc progress indicator
4. **Complete**: Get notification when done, or click "Cancel" to stop early
5. **Switch Language**: Click "EN" or "中文" in top panel

---

## 📚 More Information

- **[QUICKSTART.md](desktop-zen-app/QUICKSTART.md)** - Detailed quick start guide
- **[README.md](desktop-zen-app/README.md)** - Full documentation
- **[Spec Files](.kiro/specs/desktop-zen-app/)** - Design and requirements

---

## 🐛 Troubleshooting

### "Command not found: wails"
```bash
go install github.com/wailsapp/wails/v2/cmd/wails@latest
```

### "Blank window on Linux"
```bash
sudo apt-get install libwebkit2gtk-4.1-dev
```

### "Port already in use"
Vite will automatically use the next available port. Check console output.

### "npm: command not found"
Install Node.js from https://nodejs.org/

---

## 🎉 You're Ready!

```bash
cd desktop-zen-app
./run.sh
```

Enjoy your focused work sessions! 🧘‍♂️

---

**Questions?** Check the full [README.md](desktop-zen-app/README.md) or [QUICKSTART.md](desktop-zen-app/QUICKSTART.md)
