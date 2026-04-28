# Desktop Zen App

A cross-platform desktop application for distraction-free focus sessions. Built with **Wails**, **Vue 3**, and **Go**.

## 🎯 About

Desktop Zen App is a minimalist timer application designed to help you maintain focus and productivity through structured work sessions. It combines the Pomodoro technique with a clean, distraction-free interface.

### Key Features

- **Preset Durations**: Quick-select buttons for common focus durations (10, 25, 50 minutes)
- **Custom Duration**: Set any duration between 1-60 minutes
- **Visual Progress Indicator**: Arc-based progress visualization during sessions
- **Session Notifications**: Desktop notifications when sessions complete (with fallback alert)
- **Config Persistence**: Automatically saves your last used duration
- **Cross-Platform**: Runs on Windows, macOS, and Linux
- **Distraction-Free UI**: Minimal, focused interface with no unnecessary elements

## 🚀 Quick Start

### Prerequisites

- **Go** 1.20+ ([Download](https://golang.org/dl/))
- **Node.js** 16+ ([Download](https://nodejs.org/))
- **Wails CLI** ([Install](https://wails.io/docs/gettingstarted/installation))

For Linux, you'll also need GTK and WebKit development libraries:
```bash
sudo apt-get install libwebkit2gtk-4.1-dev libgtk-3-dev libayatana-appindicator3-dev
```

### Development Mode

Run the app in development mode with hot reload:

```bash
cd desktop-zen-app
wails dev
```

This starts:
- **Wails Dev Server**: http://localhost:34115 (native window)
- **Vite Dev Server**: http://localhost:5174 (browser access)

Changes to frontend code reload instantly. Changes to Go code require recompilation.

### Browser Access

You can also access the app in your browser at http://localhost:5174 during development.

## 📖 How to Use

### Starting a Session

1. **Select Duration**:
   - Click a preset button (Think: 10min, Study: 25min, Work: 50min)
   - Or manually enter a duration (1-60 minutes)

2. **Start Session**:
   - Click the large "Start" button
   - The app transitions to Zen mode

3. **During Session**:
   - View the countdown timer in the center
   - Watch the arc progress indicator fill as time passes
   - Click "Cancel" to stop the session early

4. **Session Complete**:
   - Desktop notification appears (or fallback alert if notifications denied)
   - App returns to idle mode
   - Your duration is saved for next time

### Configuration

The app automatically saves your last used duration to `~/.config/desktop-zen-app/config.json` (Linux/macOS) or `%APPDATA%\desktop-zen-app\config.json` (Windows).

## 🏗️ Building

### Production Build

Create a standalone executable:

```bash
cd desktop-zen-app
wails build
```

Output locations:
- **Linux**: `build/bin/desktop-zen-app`
- **macOS**: `build/bin/desktop-zen-app.app`
- **Windows**: `build/bin/desktop-zen-app.exe`

### Build Options

```bash
# Build for specific platform
wails build -platform linux/amd64
wails build -platform darwin/amd64
wails build -platform windows/amd64

# Build with optimizations
wails build -upx  # Compress binary (requires UPX)

# Clean build
wails build -clean
```

## 🧪 Testing

### Run All Tests

```bash
# Frontend tests (Vue components + store)
cd desktop-zen-app/frontend
npm run test -- --run

# Go backend tests
cd desktop-zen-app
go test ./...
```

### Test Coverage

- **Frontend**: 178 tests (component tests + property-based tests)
- **Backend**: 18 tests (config, notifications, session management)

### Test Files

- Frontend tests: `desktop-zen-app/frontend/test/`
- Go tests: `desktop-zen-app/app_test.go`

## 📁 Project Structure

```
desktop-zen-app/
├── main.go                 # Wails entry point
├── app.go                  # Go backend logic
├── app_test.go            # Go tests
├── wails.json             # Wails configuration
├── go.mod / go.sum        # Go dependencies
└── frontend/
    ├── src/
    │   ├── main.js        # Vue app entry
    │   ├── App.vue        # Root component
    │   ├── style.css      # Global styles
    │   ├── components/    # Vue components
    │   └── stores/        # Pinia state management
    ├── test/              # Frontend tests
    ├── package.json       # Node dependencies
    └── vite.config.js     # Vite configuration
```

## 🔧 Development

### Frontend Stack

- **Vue 3** - UI framework
- **Pinia** - State management
- **Vite** - Build tool
- **TypeScript** - Type safety
- **Vitest** - Testing framework

### Backend Stack

- **Go 1.20+** - Backend language
- **Wails v2** - Desktop framework
- **beeep** - Desktop notifications

### Key Components

**MainScreen.vue** - Idle mode with preset selection
**ZenScreen.vue** - Active session with timer and progress
**zenStore.ts** - Pinia store for state management
**app.go** - Go backend with config persistence and notifications

## 🎨 Customization

### Change Preset Durations

Edit `desktop-zen-app/frontend/src/stores/zenStore.ts`:

```typescript
export const PRESETS: Record<string, number> = {
  think: 10,    // Change these values
  study: 25,
  work: 50,
}
```

### Modify Colors

Edit `desktop-zen-app/frontend/src/style.css` to change CSS variables:

```css
:root {
  --background: #f5f5f5;
  --text: #333;
  --accent: #4a9eff;
  /* ... more variables ... */
}
```

## 🐛 Troubleshooting

### Blank Window on Linux

If you see a blank window, ensure WebKit development libraries are installed:

```bash
sudo apt-get install libwebkit2gtk-4.1-dev
```

### Pinia Store Error

If you see "getActivePinia() was called but there was no active Pinia", ensure `app.use(pinia)` is called in `main.js` before mounting the app.

### Port Already in Use

If ports 5173-5175 are in use, Vite will automatically use the next available port. Check the console output for the actual port.

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues, questions, or suggestions, please open an issue on the project repository.

---

**Built with ❤️ using Wails, Vue 3, and Go**
