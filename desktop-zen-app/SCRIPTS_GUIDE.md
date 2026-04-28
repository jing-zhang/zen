# 📜 Scripts Guide

All easy-to-run scripts are in the `desktop-zen-app/` directory.

## 🚀 Available Scripts

### 1. **run.sh** / **run.bat** - Start Development Server

**What it does:**
- ✅ Checks for Go and Node.js
- ✅ Installs Wails CLI if missing
- ✅ Installs frontend dependencies if needed
- ✅ Starts the development server with hot reload

**Usage:**
```bash
# Linux/macOS
./run.sh

# Windows
run.bat
```

**Output:**
```
Native Window: http://localhost:34115
Browser:      http://localhost:5174
```

**When to use:**
- Daily development
- Testing changes
- Hot reload during coding

---

### 2. **test.sh** / **test.bat** - Run All Tests

**What it does:**
- ✅ Runs Go backend tests (18 tests)
- ✅ Runs Vue/TypeScript frontend tests (192 tests)
- ✅ Reports pass/fail status

**Usage:**
```bash
# Linux/macOS
./test.sh

# Windows
test.bat
```

**Output:**
```
✅ Backend tests passed!
✅ Frontend tests passed!
🎉 All tests passed successfully!
```

**When to use:**
- Before committing code
- Verifying changes don't break anything
- CI/CD pipelines

---

### 3. **build.sh** / **build.bat** - Build for Production

**What it does:**
- ✅ Checks for Go and Wails CLI
- ✅ Compiles Go backend
- ✅ Bundles Vue frontend
- ✅ Creates standalone executable

**Usage:**
```bash
# Linux/macOS
./build.sh

# Windows
build.bat
```

**Output:**
```
Linux:   build/bin/desktop-zen-app
macOS:   build/bin/desktop-zen-app.app
Windows: build/bin/desktop-zen-app.exe
```

**When to use:**
- Creating releases
- Distributing to users
- Production deployment

---

## 📋 Script Comparison

| Feature | run.sh/bat | test.sh/bat | build.sh/bat |
|---------|-----------|-----------|------------|
| Checks dependencies | ✅ | ✅ | ✅ |
| Installs missing tools | ✅ | ❌ | ✅ |
| Runs tests | ❌ | ✅ | ❌ |
| Starts dev server | ✅ | ❌ | ❌ |
| Creates executable | ❌ | ❌ | ✅ |
| Hot reload | ✅ | ❌ | ❌ |

---

## 🔄 Typical Workflow

### 1. Start Development
```bash
./run.sh
```
- App opens in native window
- Browser access at http://localhost:5174
- Changes reload automatically

### 2. Make Changes
- Edit Vue components
- Edit Go backend
- Frontend changes reload instantly
- Go changes require restart

### 3. Run Tests
```bash
./test.sh
```
- Verify all tests pass
- Check for regressions

### 4. Build for Release
```bash
./build.sh
```
- Creates production executable
- Ready to distribute

---

## 🛠️ Manual Commands

If you prefer not to use scripts, here are the manual commands:

### Start Development
```bash
wails dev
```

### Run Tests
```bash
# Frontend
cd frontend
npm test -- --run

# Backend
go test ./...
```

### Build
```bash
wails build
```

### Build for Specific Platform
```bash
wails build -platform linux/amd64
wails build -platform darwin/amd64
wails build -platform windows/amd64
```

---

## 🐛 Troubleshooting Scripts

### Script won't run (Linux/macOS)
```bash
chmod +x run.sh test.sh build.sh
```

### "Command not found: wails"
```bash
go install github.com/wailsapp/wails/v2/cmd/wails@latest
```

### "npm: command not found"
Install Node.js from https://nodejs.org/

### "go: command not found"
Install Go from https://golang.org/dl/

---

## 📝 Script Details

### run.sh / run.bat
- **Language**: Bash (sh) / Batch (bat)
- **Dependencies**: Go, Node.js, Wails CLI
- **Time**: ~30 seconds first run, ~5 seconds subsequent
- **Output**: Development server URLs

### test.sh / test.bat
- **Language**: Bash (sh) / Batch (bat)
- **Dependencies**: Go, Node.js
- **Time**: ~10 seconds
- **Output**: Test results (pass/fail)

### build.sh / build.bat
- **Language**: Bash (sh) / Batch (bat)
- **Dependencies**: Go, Wails CLI
- **Time**: ~30-60 seconds
- **Output**: Executable binary

---

## 🎯 Quick Reference

```bash
# Start development
./run.sh

# Run tests
./test.sh

# Build for production
./build.sh

# Stop development server
Ctrl+C

# Access in browser
http://localhost:5174
```

---

**All scripts are cross-platform and include helpful error messages!** 🎉
