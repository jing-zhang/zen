# 🎯 Setup Diagram

## Quick Visual Guide

```
┌─────────────────────────────────────────────────────────────┐
│                  Desktop Zen App Setup                      │
└─────────────────────────────────────────────────────────────┘

STEP 1: Prerequisites
┌─────────────────────────────────────────────────────────────┐
│ ✅ Go 1.20+          → https://golang.org/dl/              │
│ ✅ Node.js 16+       → https://nodejs.org/                 │
│ ✅ Linux only: GTK/WebKit libs                             │
│    sudo apt-get install libwebkit2gtk-4.1-dev              │
└─────────────────────────────────────────────────────────────┘
                            ↓
STEP 2: Navigate
┌─────────────────────────────────────────────────────────────┐
│ $ cd desktop-zen-app                                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
STEP 3: Choose Your Path
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  🚀 DEVELOPMENT          🧪 TESTING         🏗️  PRODUCTION │
│  ─────────────────────────────────────────────────────────  │
│  $ ./run.sh              $ ./test.sh        $ ./build.sh    │
│  (or run.bat)            (or test.bat)      (or build.bat)  │
│                                                             │
│  ✅ Hot reload           ✅ 192 tests       ✅ Executable   │
│  ✅ Dev server           ✅ All checks      ✅ Production   │
│  ✅ Browser access       ✅ Pass/fail       ✅ Distributable│
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
STEP 4: Access the App
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Native Window:  http://localhost:34115                    │
│  Browser:        http://localhost:5174                     │
│                                                             │
│  🎉 App is running!                                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## File Structure

```
zen/
├── GETTING_STARTED.md          ← 📖 Start here!
├── SETUP_DIAGRAM.md            ← 📊 This file
├── README.md                   ← 📚 Full docs
│
└── desktop-zen-app/
    ├── run.sh / run.bat        ← 🚀 Start dev server
    ├── test.sh / test.bat      ← 🧪 Run tests
    ├── build.sh / build.bat    ← 🏗️  Build for production
    ├── QUICKSTART.md           ← ⚡ Quick reference
    ├── SCRIPTS_GUIDE.md        ← 📜 Script details
    ├── README.md               ← 📚 Full documentation
    │
    ├── main.go                 ← Go entry point
    ├── app.go                  ← Go backend
    ├── app_test.go             ← Go tests
    ├── wails.json              ← Wails config
    │
    └── frontend/
        ├── src/
        │   ├── App.vue         ← Root component
        │   ├── components/     ← Vue components
        │   └── stores/         ← Pinia state
        ├── test/               ← Frontend tests
        └── package.json        ← Node dependencies
```

---

## Decision Tree

```
                    Want to run the app?
                            │
                ┌───────────┴───────────┐
                │                       │
            YES │                       │ NO
                ↓                       ↓
        Development?              Testing?
            │                       │
        ┌───┴───┐              ┌───┴───┐
        │       │              │       │
       YES     NO             YES     NO
        │       │              │       │
        ↓       ↓              ↓       ↓
    ./run.sh  ./build.sh   ./test.sh  ?
    (dev)     (prod)       (verify)   
        │       │              │
        ↓       ↓              ↓
    Hot reload Executable  Pass/Fail
    Browser    Standalone   Report
    Native     Ready to
    Window     distribute
```

---

## Time Estimates

```
Task                          Time        Command
─────────────────────────────────────────────────────────
First-time setup              2-5 min     ./run.sh
Subsequent runs               5 sec       ./run.sh
Running tests                 10 sec      ./test.sh
Building for production       30-60 sec   ./build.sh
```

---

## Common Scenarios

### Scenario 1: I want to develop
```bash
cd desktop-zen-app
./run.sh
# Edit files, see changes instantly
# Press Ctrl+C to stop
```

### Scenario 2: I want to test my changes
```bash
cd desktop-zen-app
./test.sh
# See if all 192 tests pass
```

### Scenario 3: I want to create a release
```bash
cd desktop-zen-app
./build.sh
# Get executable in build/bin/
```

### Scenario 4: I want to share the app
```bash
cd desktop-zen-app
./build.sh
# Share build/bin/desktop-zen-app (Linux)
# Share build/bin/desktop-zen-app.app (macOS)
# Share build/bin/desktop-zen-app.exe (Windows)
```

---

## Troubleshooting Flowchart

```
Something not working?
        │
        ├─→ Blank window?
        │   └─→ Linux: sudo apt-get install libwebkit2gtk-4.1-dev
        │
        ├─→ "Command not found"?
        │   ├─→ wails: go install github.com/wailsapp/wails/v2/cmd/wails@latest
        │   ├─→ go: Install from https://golang.org/dl/
        │   └─→ node: Install from https://nodejs.org/
        │
        ├─→ Port already in use?
        │   └─→ Vite will use next available port (check console)
        │
        ├─→ Tests failing?
        │   └─→ Check error message, fix code, run ./test.sh again
        │
        └─→ Still stuck?
            └─→ Check GETTING_STARTED.md or README.md
```

---

## Next Steps

1. **Read**: [GETTING_STARTED.md](GETTING_STARTED.md)
2. **Run**: `cd desktop-zen-app && ./run.sh`
3. **Develop**: Edit files and see changes instantly
4. **Test**: `./test.sh` before committing
5. **Build**: `./build.sh` for production

---

**You're ready to go! 🚀**

```bash
cd desktop-zen-app
./run.sh
```
