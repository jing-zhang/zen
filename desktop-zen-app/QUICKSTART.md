# 🚀 Quick Start Guide

Get the Desktop Zen App running in seconds!

## ⚡ One-Command Start

### On Linux/macOS:
```bash
./run.sh
```

### On Windows:
```cmd
run.bat
```

That's it! The app will:
1. ✅ Check for required dependencies (Go, Node.js, Wails)
2. 📦 Install frontend dependencies if needed
3. 🚀 Start the development server

The app will open at:
- **Native Window**: http://localhost:34115
- **Browser**: http://localhost:5174

---

## 📋 Prerequisites

Before running the app, make sure you have:

### Required:
- **Go** 1.20+ → [Download](https://golang.org/dl/)
- **Node.js** 16+ → [Download](https://nodejs.org/)

### Optional (auto-installed):
- **Wails CLI** → Auto-installed if missing

### Linux Only:
If you're on Linux, install GTK and WebKit development libraries:
```bash
sudo apt-get install libwebkit2gtk-4.1-dev libgtk-3-dev libayatana-appindicator3-dev
```

---

## 🧪 Running Tests

### On Linux/macOS:
```bash
./test.sh
```

### On Windows:
```cmd
test.bat
```

This runs:
- ✅ Backend tests (Go)
- ✅ Frontend tests (Vue/TypeScript)
- ✅ All 192 tests

---

## 🏗️ Building for Production

### On Linux/macOS:
```bash
./build.sh
```

### On Windows:
```cmd
build.bat
```

Output:
- **Linux**: `build/bin/desktop-zen-app`
- **macOS**: `build/bin/desktop-zen-app.app`
- **Windows**: `build/bin/desktop-zen-app.exe`

---

## 🎯 Using the App

### Start a Session:
1. Select a preset (Think: 10min, Study: 25min, Work: 50min)
2. Or enter a custom duration (1-60 minutes)
3. Click the large "Start" button
4. Watch the timer count down with the arc progress indicator

### During Session:
- Click "Cancel" to stop early
- The app will return to idle mode

### When Complete:
- Desktop notification appears
- Your duration is saved for next time

### Language:
- Click "EN" or "中文" in the top panel to switch languages
- Your preference is saved

---

## 📁 Project Structure

```
desktop-zen-app/
├── run.sh / run.bat          ← Start development server
├── test.sh / test.bat        ← Run all tests
├── build.sh / build.bat      ← Build for production
├── README.md                 ← Full documentation
├── QUICKSTART.md             ← This file
├── main.go                   ← Wails entry point
├── app.go                    ← Go backend
├── wails.json                ← Wails config
└── frontend/                 ← Vue 3 + TypeScript
    ├── src/
    │   ├── App.vue
    │   ├── components/
    │   └── stores/
    └── test/
```

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
Vite will automatically use the next available port. Check the console output.

### "npm: command not found"
Install Node.js from https://nodejs.org/

---

## 📚 More Information

- **Full Documentation**: See `README.md`
- **Development Guide**: See `README.md` → Development section
- **Customization**: See `README.md` → Customization section

---

## 🎉 You're Ready!

Run `./run.sh` (or `run.bat` on Windows) and start focusing!

Happy coding! 🧘‍♂️
