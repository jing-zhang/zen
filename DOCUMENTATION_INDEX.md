# 📚 Documentation Index

Complete guide to all documentation and resources for the Desktop Zen App.

---

## 🚀 Getting Started (Start Here!)

### For First-Time Users
1. **[GETTING_STARTED.md](GETTING_STARTED.md)** ⭐ **START HERE**
   - 30-second quick start
   - Prerequisites checklist
   - Common tasks
   - Troubleshooting

2. **[SETUP_DIAGRAM.md](SETUP_DIAGRAM.md)**
   - Visual setup flowchart
   - Decision tree
   - Time estimates
   - Common scenarios

---

## 📖 Main Documentation

### Root Level
- **[README.md](README.md)** - Project overview and features
- **[GETTING_STARTED.md](GETTING_STARTED.md)** - Quick start guide
- **[SETUP_DIAGRAM.md](SETUP_DIAGRAM.md)** - Visual guides
- **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** - This file

### In `desktop-zen-app/` Directory
- **[README.md](desktop-zen-app/README.md)** - Complete app documentation
- **[QUICKSTART.md](desktop-zen-app/QUICKSTART.md)** - Fast reference
- **[SCRIPTS_GUIDE.md](desktop-zen-app/SCRIPTS_GUIDE.md)** - Script details

---

## 🛠️ Easy-Run Scripts

All scripts are in `desktop-zen-app/` directory:

### Development
```bash
cd desktop-zen-app
./run.sh          # Linux/macOS
run.bat           # Windows
```
- Starts development server
- Hot reload enabled
- Browser access at http://localhost:5174

### Testing
```bash
cd desktop-zen-app
./test.sh         # Linux/macOS
test.bat          # Windows
```
- Runs all 192 frontend tests
- Runs all 18 backend tests
- Reports pass/fail

### Production Build
```bash
cd desktop-zen-app
./build.sh        # Linux/macOS
build.bat         # Windows
```
- Creates standalone executable
- Ready to distribute
- Cross-platform support

**See [SCRIPTS_GUIDE.md](desktop-zen-app/SCRIPTS_GUIDE.md) for detailed script documentation.**

---

## 📋 Documentation by Topic

### Setup & Installation
- [GETTING_STARTED.md](GETTING_STARTED.md) - Quick setup
- [SETUP_DIAGRAM.md](SETUP_DIAGRAM.md) - Visual guides
- [desktop-zen-app/README.md](desktop-zen-app/README.md#-quick-start) - Prerequisites

### Running the App
- [GETTING_STARTED.md](GETTING_STARTED.md#-quick-start-30-seconds) - 30-second start
- [desktop-zen-app/QUICKSTART.md](desktop-zen-app/QUICKSTART.md) - Fast reference
- [desktop-zen-app/SCRIPTS_GUIDE.md](desktop-zen-app/SCRIPTS_GUIDE.md) - Script details

### Using the App
- [desktop-zen-app/README.md](desktop-zen-app/README.md#-how-to-use) - User guide
- [GETTING_STARTED.md](GETTING_STARTED.md#-using-the-app) - Quick usage

### Development
- [desktop-zen-app/README.md](desktop-zen-app/README.md#-development) - Dev stack
- [desktop-zen-app/README.md](desktop-zen-app/README.md#-customization) - Customization

### Testing
- [desktop-zen-app/README.md](desktop-zen-app/README.md#-testing) - Test info
- [desktop-zen-app/SCRIPTS_GUIDE.md](desktop-zen-app/SCRIPTS_GUIDE.md#2-testsh--testbat---run-all-tests) - Test script

### Building & Distribution
- [desktop-zen-app/README.md](desktop-zen-app/README.md#-building) - Build info
- [desktop-zen-app/SCRIPTS_GUIDE.md](desktop-zen-app/SCRIPTS_GUIDE.md#3-buildsh--buildbat---build-for-production) - Build script

### Troubleshooting
- [GETTING_STARTED.md](GETTING_STARTED.md#-troubleshooting) - Common issues
- [SETUP_DIAGRAM.md](SETUP_DIAGRAM.md#troubleshooting-flowchart) - Troubleshooting flowchart
- [desktop-zen-app/README.md](desktop-zen-app/README.md#-troubleshooting) - Detailed troubleshooting

---

## 🎯 Quick Reference

### I want to...

**...start developing**
→ [GETTING_STARTED.md](GETTING_STARTED.md#-quick-start-30-seconds)
```bash
cd desktop-zen-app && ./run.sh
```

**...run tests**
→ [desktop-zen-app/SCRIPTS_GUIDE.md](desktop-zen-app/SCRIPTS_GUIDE.md#2-testsh--testbat---run-all-tests)
```bash
cd desktop-zen-app && ./test.sh
```

**...build for production**
→ [desktop-zen-app/SCRIPTS_GUIDE.md](desktop-zen-app/SCRIPTS_GUIDE.md#3-buildsh--buildbat---build-for-production)
```bash
cd desktop-zen-app && ./build.sh
```

**...understand the project**
→ [README.md](README.md)

**...see visual guides**
→ [SETUP_DIAGRAM.md](SETUP_DIAGRAM.md)

**...learn about scripts**
→ [desktop-zen-app/SCRIPTS_GUIDE.md](desktop-zen-app/SCRIPTS_GUIDE.md)

**...fix a problem**
→ [SETUP_DIAGRAM.md](SETUP_DIAGRAM.md#troubleshooting-flowchart)

---

## 📁 File Structure

```
zen/
├── GETTING_STARTED.md          ← 🌟 Start here
├── SETUP_DIAGRAM.md            ← 📊 Visual guides
├── DOCUMENTATION_INDEX.md      ← 📚 This file
├── README.md                   ← 📖 Project overview
│
└── desktop-zen-app/
    ├── run.sh / run.bat        ← 🚀 Start dev
    ├── test.sh / test.bat      ← 🧪 Run tests
    ├── build.sh / build.bat    ← 🏗️  Build
    ├── QUICKSTART.md           ← ⚡ Quick ref
    ├── SCRIPTS_GUIDE.md        ← 📜 Script docs
    ├── README.md               ← 📚 Full docs
    │
    ├── .kiro/specs/            ← 📋 Spec files
    ├── main.go                 ← Go entry
    ├── app.go                  ← Go backend
    ├── wails.json              ← Config
    │
    └── frontend/
        ├── src/                ← Vue code
        ├── test/               ← Tests
        └── package.json        ← Dependencies
```

---

## 🔗 Documentation Links

### Getting Started
- [GETTING_STARTED.md](GETTING_STARTED.md) - 30-second setup
- [SETUP_DIAGRAM.md](SETUP_DIAGRAM.md) - Visual flowcharts

### Main Docs
- [README.md](README.md) - Project overview
- [desktop-zen-app/README.md](desktop-zen-app/README.md) - Complete documentation

### Quick References
- [desktop-zen-app/QUICKSTART.md](desktop-zen-app/QUICKSTART.md) - Fast reference
- [desktop-zen-app/SCRIPTS_GUIDE.md](desktop-zen-app/SCRIPTS_GUIDE.md) - Script details

### Specifications
- [.kiro/specs/desktop-zen-app/requirements.md](.kiro/specs/desktop-zen-app/requirements.md) - Requirements
- [.kiro/specs/desktop-zen-app/design.md](.kiro/specs/desktop-zen-app/design.md) - Design
- [.kiro/specs/desktop-zen-app/tasks.md](.kiro/specs/desktop-zen-app/tasks.md) - Implementation tasks

---

## 📊 Documentation Statistics

| Document | Purpose | Read Time |
|----------|---------|-----------|
| GETTING_STARTED.md | Quick setup | 2 min |
| SETUP_DIAGRAM.md | Visual guides | 3 min |
| README.md | Project overview | 5 min |
| desktop-zen-app/README.md | Full documentation | 10 min |
| desktop-zen-app/QUICKSTART.md | Quick reference | 2 min |
| desktop-zen-app/SCRIPTS_GUIDE.md | Script details | 5 min |

---

## 🎯 Recommended Reading Order

### For First-Time Users
1. [GETTING_STARTED.md](GETTING_STARTED.md) (2 min)
2. [SETUP_DIAGRAM.md](SETUP_DIAGRAM.md) (3 min)
3. Run `./run.sh` and try the app!

### For Developers
1. [GETTING_STARTED.md](GETTING_STARTED.md) (2 min)
2. [desktop-zen-app/README.md](desktop-zen-app/README.md) (10 min)
3. [desktop-zen-app/SCRIPTS_GUIDE.md](desktop-zen-app/SCRIPTS_GUIDE.md) (5 min)
4. Start developing!

### For Contributors
1. [README.md](README.md) (5 min)
2. [desktop-zen-app/README.md](desktop-zen-app/README.md) (10 min)
3. [.kiro/specs/desktop-zen-app/requirements.md](.kiro/specs/desktop-zen-app/requirements.md)
4. [.kiro/specs/desktop-zen-app/design.md](.kiro/specs/desktop-zen-app/design.md)
5. [.kiro/specs/desktop-zen-app/tasks.md](.kiro/specs/desktop-zen-app/tasks.md)

---

## 🚀 Quick Start

```bash
# 1. Navigate to app directory
cd desktop-zen-app

# 2. Run the app
./run.sh          # Linux/macOS
# or
run.bat           # Windows

# 3. Open in browser
# http://localhost:5174
```

**That's it!** 🎉

---

## 📞 Need Help?

1. **Quick questions?** → Check [SETUP_DIAGRAM.md](SETUP_DIAGRAM.md#troubleshooting-flowchart)
2. **Setup issues?** → See [GETTING_STARTED.md](GETTING_STARTED.md#-troubleshooting)
3. **Script questions?** → Read [desktop-zen-app/SCRIPTS_GUIDE.md](desktop-zen-app/SCRIPTS_GUIDE.md)
4. **Full documentation?** → Check [desktop-zen-app/README.md](desktop-zen-app/README.md)

---

**Last Updated**: April 28, 2026
**Version**: 1.0.0
**Status**: ✅ Complete and Ready to Use

🎉 **Everything is set up and ready to go!**
