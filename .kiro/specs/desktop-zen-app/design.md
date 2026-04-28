# Design Document: Desktop Zen App

## Overview

Desktop Zen App is a cross-platform desktop application that creates a distraction-free focus environment for a user-defined period. The application is built with **Go** (backend logic), **Wails v2** (native desktop bridge), and **Vue 3** (frontend UI). Wails compiles the entire application into a single native binary per target platform, embedding the Vue frontend as a WebView.

The user experience is intentionally minimal:

- A **Top Panel** with named presets (Think, Study, Work) and a custom duration selector.
- A single large **Start Button** centered on the screen — the same button doubles as the cancel control during Zen Mode, changing its visual style to indicate the active state.
- A full-screen **Zen Mode** view showing the countdown timer, a circular arc progress indicator, and the toggle button in its cancel state.

When a session ends naturally the app sends a system notification and plays an audible chime. The last-used duration is persisted to disk so the user never has to re-select it on relaunch.

### Technology Choices

| Layer | Technology | Rationale |
|---|---|---|
| Backend / Logic | Go 1.21+ | Single-binary compilation, excellent cross-platform support, simple concurrency model for the timer |
| Desktop bridge | Wails v2 | Embeds a WebView, exposes Go methods to JS, produces native binaries for macOS/Windows/Linux |
| Frontend | Vue 3 + TypeScript | Lightweight reactive UI, no heavy framework overhead, good Wails integration |
| Styling | Plain CSS / CSS variables | Keeps the bundle small; no external CSS framework needed for a minimal UI |
| Persistence | OS user-config directory (JSON file) | Simple, no database dependency, works on all three platforms |
| Notifications | Wails `runtime.EventsEmit` + OS notification via Go | Wails exposes `BrowserOpenURL`; system notifications via `beeep` library |
| Audio | Embedded WAV/MP3 via Go `embed` | Single binary, no external asset dependency |

---

## Architecture

The application follows a **thin-backend / reactive-frontend** pattern. All UI state lives in the Vue frontend (Pinia store). The Go backend exposes a small set of methods that the frontend calls via Wails bindings. The timer itself runs in the frontend using `setInterval` for sub-second UI responsiveness; the backend is responsible for persistence, system notifications, and audio playback.

```mermaid
graph TD
    subgraph Frontend (WebView / Vue 3)
        UI[Vue Components]
        Store[Pinia Store\nzenStore]
        Bindings[Wails JS Bindings]
    end

    subgraph Backend (Go)
        App[App struct\nWails App]
        Persist[Persistence\nconfig.json]
        Notify[Notification\nbeeep]
        Audio[Audio\nembedded asset]
    end

    UI <--> Store
    Store --> Bindings
    Bindings --> App
    App --> Persist
    App --> Notify
    App --> Audio
```

### Data Flow

1. **App launch** → Go reads `config.json` → returns `AppConfig` to frontend → Pinia store initialises with persisted duration.
2. **User selects preset / custom duration** → store updates `selectedDuration` → UI reflects change.
3. **User presses Start** → store transitions to `zen` state → `setInterval` starts countdown.
4. **Timer tick** → store decrements `remainingSeconds` → Vue reactivity updates display.
5. **Timer reaches zero** → store calls `App.SessionComplete()` via Wails binding → Go sends OS notification + plays audio → store transitions back to `idle`.
6. **User cancels** → store stops interval → calls `App.SessionCancelled()` → store transitions to `idle`.
7. **App close** → frontend calls `App.SaveConfig(duration)` → Go writes `config.json`.

---

## Components and Interfaces

### Go Backend (`app.go`)

```go
type App struct {
    ctx context.Context
}

// Called by Wails on startup; ctx is used for runtime calls
func (a *App) startup(ctx context.Context)

// Returns the persisted AppConfig (last duration, etc.)
func (a *App) LoadConfig() AppConfig

// Persists the given duration to disk
func (a *App) SaveConfig(durationMinutes int) error

// Sends OS notification + plays completion audio
func (a *App) SessionComplete() error

// No-op on the backend; exists for symmetry / future analytics
func (a *App) SessionCancelled()
```

### AppConfig (Go struct / JSON)

```go
type AppConfig struct {
    LastDurationMinutes int `json:"lastDurationMinutes"`
}
```

### Vue Components

| Component | Responsibility |
|---|---|
| `App.vue` | Root component; switches between `MainScreen` and `ZenScreen` based on store state |
| `TopPanel.vue` | Renders preset buttons and the duration selector; emits selection events to store |
| `PresetButton.vue` | Single named preset chip; highlights when active |
| `DurationSelector.vue` | Numeric input (1–60) or slider; clamps value on blur/change |
| `StartButton.vue` | Large centered button; calls `startSession()` when idle, `cancelSession()` when in Zen Mode; changes label/color based on `mode` |
| `ZenScreen.vue` | Full-screen countdown view; shows `ArcIndicator` + `MM:SS` and the `StartButton` in cancel state |
| `TimerDisplay.vue` | Formats and renders remaining seconds as `MM:SS` |
| `ArcIndicator.vue` | SVG circular arc that depletes proportionally to elapsed time; accepts `progress` prop (0–1) |

### Pinia Store (`zenStore.ts`)

```typescript
interface ZenState {
  mode: 'idle' | 'zen';
  selectedDuration: number;      // minutes, 1–60
  activePreset: string | null;   // 'think' | 'study' | 'work' | null
  remainingSeconds: number;
  totalSeconds: number;          // set at session start; used to compute arc progress
  intervalId: ReturnType<typeof setInterval> | null;
}
```

Key actions:

| Action | Description |
|---|---|
| `initFromConfig(config)` | Seeds store from persisted AppConfig on launch |
| `selectPreset(preset)` | Sets duration from preset map; clears custom selection |
| `setCustomDuration(minutes)` | Clamps to [1,60]; clears active preset |
| `startSession()` | Transitions to `zen`, sets `totalSeconds`, starts interval |
| `tick()` | Decrements `remainingSeconds`; calls `completeSession()` at zero |
| `completeSession()` | Stops interval, calls Go `SessionComplete`, transitions to `idle` |
| `cancelSession()` | Stops interval, calls Go `SessionCancelled`, transitions to `idle` |
| `saveAndClose()` | Calls Go `SaveConfig` before window closes |
| `arcProgress` (getter) | Returns `remainingSeconds / totalSeconds` (1.0 at start, 0.0 at end); returns `1` when `totalSeconds === 0` |

### Preset Map

```typescript
const PRESETS: Record<string, number> = {
  think: 10,
  study: 25,
  work:  50,
};
```

---

## Data Models

### Persisted Config (`~/.config/desktop-zen-app/config.json` on Linux, equivalent paths on macOS/Windows)

```json
{
  "lastDurationMinutes": 25
}
```

The Go backend resolves the config directory using `os.UserConfigDir()`, which returns the platform-appropriate path:

- **macOS**: `~/Library/Application Support/desktop-zen-app/`
- **Windows**: `%APPDATA%\desktop-zen-app\`
- **Linux**: `~/.config/desktop-zen-app/`

### Session State (in-memory, frontend only)

```typescript
type Mode = 'idle' | 'zen';

interface SessionState {
  mode: Mode;
  durationMinutes: number;   // 1–60
  remainingSeconds: number;  // 0 – durationMinutes * 60
  totalSeconds: number;      // durationMinutes * 60, fixed at session start
  startedAt: Date | null;
}
```

### Validation Rules

| Field | Rule |
|---|---|
| `durationMinutes` | Integer, clamped to [1, 60] |
| `lastDurationMinutes` (persisted) | Integer; if missing or out of range, defaults to 25 |
| `remainingSeconds` | Non-negative integer; never exceeds `durationMinutes * 60` |

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Duration clamping is idempotent

*For any* integer input `x`, applying the clamp function once and applying it twice must produce the same result — i.e., `clamp(clamp(x)) === clamp(x)`. Additionally, for any `x < 1` the result is `1`, for any `x > 60` the result is `60`, and for any `x` in [1, 60] the result is `x` unchanged.

**Validates: Requirements 3.3**

### Property 2: Custom duration deselects preset

*For any* app state where a preset is active and any valid custom duration value in [1, 60], calling `setCustomDuration` must result in `activePreset` being `null` and `selectedDuration` equaling the (clamped) input value.

**Validates: Requirements 3.2, 3.4**

### Property 3: Preset selection sets correct duration and highlights preset

*For any* preset name in the preset map, selecting that preset must set `selectedDuration` to exactly the value defined in the preset map AND set `activePreset` to that preset name. Selecting a second different preset must clear the highlight from the first.

**Validates: Requirements 2.2, 2.3, 2.4**

### Property 4: Start session initialises Zen state correctly

*For any* valid duration `d` in [1, 60], calling `startSession()` must transition `mode` to `'zen'`, set `remainingSeconds` to exactly `d * 60`, and set `totalSeconds` to exactly `d * 60`.

**Validates: Requirements 4.1, 4.3**

### Property 5: Timer tick decrements by exactly one second

*For any* active Zen session with `remainingSeconds > 0`, calling `tick()` once must decrease `remainingSeconds` by exactly `1`.

**Validates: Requirements 6.1**

### Property 6: Timer display round-trip

*For any* non-negative integer `s` in [0, 3600], formatting `s` as `MM:SS` and then parsing the result back to total seconds must yield the original value `s`.

**Validates: Requirements 6.2**

### Property 7: Session completion transitions to idle

*For any* active Zen session, when `remainingSeconds` reaches `0` via `tick()`, the resulting `mode` must be `'idle'` and `remainingSeconds` must remain `0`.

**Validates: Requirements 6.3**

### Property 8: Session completion dispatches notification with correct message

*For any* Zen session that completes naturally (timer reaches zero), the `SessionComplete` backend call must be invoked exactly once, and the OS notification must be sent with the message `"Zen session complete"`. If the OS denies notification permission, an in-app alert must be displayed instead.

**Validates: Requirements 6.4, 8.1, 8.3**

### Property 9: Session completion triggers audio playback

*For any* Zen session that completes naturally, the audio playback function must be called exactly once.

**Validates: Requirements 8.2**

### Property 10: Cancel restores idle state without notification

*For any* active Zen session cancelled at any point in the countdown, the resulting `mode` must be `'idle'` and `SessionComplete` must NOT have been called.

**Validates: Requirements 7.2, 7.4**

### Property 11: Config persistence round-trip

*For any* valid duration value `d` in [1, 60], saving `d` via `SaveConfig(d)` and then loading via `LoadConfig()` must return `d` as `lastDurationMinutes`.

**Validates: Requirements 10.1, 10.2**

### Property 12: Out-of-range or missing config defaults to 25 minutes

*For any* config input where `lastDurationMinutes` is outside [1, 60], is not a valid integer, or is absent entirely, `LoadConfig()` must return a duration of `25` minutes.

**Validates: Requirements 10.3**

### Property 13: Preset highlight restored from persisted duration on launch

*For any* preset value `v` in {10, 25, 50}, if the persisted config contains `lastDurationMinutes === v`, then initialising the store from that config must result in `activePreset` being set to the corresponding preset name.

**Validates: Requirements 10.4**

### Property 14: Arc progress is 1.0 at session start

*For any* valid duration `d` in [1, 60], immediately after `startSession()`, the `arcProgress` getter must return exactly `1.0`.

**Validates: Requirements 11.3**

### Property 15: Arc progress depletes monotonically during countdown

*For any* active Zen session, after each call to `tick()` the `arcProgress` getter must be less than or equal to its value before the tick, and must never be negative.

**Validates: Requirements 11.2, 11.5**

### Property 16: Arc progress is 0.0 when timer reaches zero

*For any* active Zen session, when `remainingSeconds` reaches `0` via `tick()`, the `arcProgress` getter must return exactly `0.0`.

**Validates: Requirements 11.4**

### Property 17: Arc progress equals remaining/total ratio

*For any* active Zen session with `totalSeconds > 0` and any `remainingSeconds` in [0, totalSeconds], the `arcProgress` getter must return exactly `remainingSeconds / totalSeconds`.

**Validates: Requirements 11.2**

### Property 18: Toggle button is in cancel state during Zen Mode

*For any* active Zen session, the `mode` must be `'zen'`, which the `StartButton` component uses to render in cancel state. Transitioning back to `idle` (via `completeSession` or `cancelSession`) must result in `mode === 'idle'`, restoring the start state.

**Validates: Requirements 5.2, 5.5, 5.6**

---

## Error Handling

| Scenario | Handling Strategy |
|---|---|
| Config file missing on first launch | Go returns default `AppConfig{LastDurationMinutes: 25}`; no error surfaced to user |
| Config file corrupt / unparseable | Go logs the error, returns default config; app continues normally |
| Config directory not writable | Go logs the error; session proceeds but persistence silently fails; no crash |
| OS notification permission denied | Go catches the error from `beeep`; frontend falls back to an in-app modal alert |
| Audio file fails to play | Go logs the error; session still completes; no crash |
| Wails binding call fails | Frontend catches the rejected promise; logs to console; UI remains functional |
| Duration out of range (frontend) | `setCustomDuration` clamps to [1, 60] before updating store; invalid value never reaches backend |
| App closed during active session | `beforeunload` / Wails `OnBeforeClose` hook calls `SaveConfig` with current duration; timer is abandoned gracefully |

---

## Testing Strategy

### Unit Tests (Go)

Tested with the standard `testing` package:

- `LoadConfig` returns default when file is absent or corrupt.
- `SaveConfig` writes correct JSON; subsequent `LoadConfig` returns the same value (round-trip).
- `clampDuration` returns 1 for inputs < 1, 60 for inputs > 60, and the input itself for values in [1, 60].
- Config path resolution returns the correct OS-specific directory.

### Unit Tests (Vue / TypeScript)

Tested with **Vitest**:

- `setCustomDuration` clamps values correctly.
- `selectPreset` sets the right duration and clears `activePreset` when a different preset is chosen.
- `tick` decrements `remainingSeconds` and transitions to `idle` at zero.
- `cancelSession` sets mode to `idle` without triggering `SessionComplete`.
- `initFromConfig` correctly seeds the store, including preset highlight when duration matches a preset.
- `formatTime(s)` produces correct `MM:SS` strings for boundary values (0, 59, 60, 3599, 3600).
- `arcProgress` getter returns `1.0` at session start, `0.0` at zero, and the correct ratio mid-session.
- `StartButton` renders with start label/style when `mode === 'idle'` and cancel label/style when `mode === 'zen'`.

### Property-Based Tests (TypeScript — fast-check)

Using **fast-check** (minimum 100 iterations per property):

Each test is tagged with a comment in the format:
`// Feature: desktop-zen-app, Property N: <property text>`

| Property | Test Description |
|---|---|
| P1: Duration clamping idempotence | Generate arbitrary integers; assert `clamp(clamp(x)) === clamp(x)` and correct boundary behaviour |
| P2: Custom duration deselects preset | Generate arbitrary preset + arbitrary valid duration; assert `activePreset === null` and `selectedDuration` equals clamped input |
| P3: Preset selection sets correct duration and highlights | Generate arbitrary preset name; assert `selectedDuration === PRESETS[name]` and `activePreset === name`; then select second preset and assert first is cleared |
| P4: Start session initialises Zen state | Generate arbitrary `d` in [1,60]; call `startSession()`; assert `mode === 'zen'`, `remainingSeconds === d * 60`, and `totalSeconds === d * 60` |
| P5: Timer tick decrements by one | Generate arbitrary `remainingSeconds > 0`; call `tick()`; assert `remainingSeconds` decreased by exactly 1 |
| P6: Timer display round-trip | Generate arbitrary seconds in [0, 3600]; assert `parseMMSS(formatMMSS(s)) === s` |
| P7: Session completion → idle | Set `remainingSeconds` to 1; call `tick()`; assert `mode === 'idle'` and `remainingSeconds === 0` |
| P8: Session completion → notification with correct message | Mock `SessionComplete`; complete session; assert mock called once with message `"Zen session complete"` |
| P9: Session completion → audio played | Mock audio function; complete session; assert mock called exactly once |
| P10: Cancel → idle, no notification | Generate arbitrary `remainingSeconds > 0`; call `cancelSession()`; assert `mode === 'idle'` and `SessionComplete` not called |
| P11: Config round-trip | Generate arbitrary `d` in [1,60]; `SaveConfig(d)` then `LoadConfig()`; assert result equals `d` |
| P12: Out-of-range config defaults to 25 | Generate integers outside [1,60] or null/undefined; assert `LoadConfig()` returns 25 |
| P13: Preset highlight restored on launch | Generate preset values {10,25,50}; save config; init store; assert correct preset is highlighted |
| P14: Arc progress is 1.0 at session start | Generate arbitrary `d` in [1,60]; call `startSession()`; assert `arcProgress === 1.0` |
| P15: Arc progress depletes monotonically | Generate arbitrary session; call `tick()` repeatedly; assert `arcProgress` is non-increasing and never negative |
| P16: Arc progress is 0.0 at timer zero | Set `remainingSeconds` to 1; call `tick()`; assert `arcProgress === 0.0` |
| P17: Arc progress equals remaining/total ratio | Generate arbitrary `remainingSeconds` in [0, totalSeconds]; assert `arcProgress === remainingSeconds / totalSeconds` |
| P18: Toggle button state follows mode | Assert `mode === 'zen'` after `startSession()`; assert `mode === 'idle'` after `cancelSession()` or `completeSession()` |

### Integration / Smoke Tests

- Build the Wails app for the host platform (`wails build`) and verify the binary launches without error.
- Verify the main screen renders within 3 seconds of launch (manual or Playwright-based WebView test).
- Verify OS notification is delivered on session completion (manual smoke test per platform).
- Verify audio plays on session completion (manual smoke test per platform).

### Why PBT Applies Here

The core logic of this application — duration clamping, timer formatting, config serialization, and state transitions — consists of pure functions and deterministic state machines. These are ideal candidates for property-based testing because:

- Input spaces are large (arbitrary integers, arbitrary durations, arbitrary session states).
- Universal properties (idempotence, round-trips, monotonicity, invariants) hold across all valid inputs.
- Tests run entirely in-memory with no I/O, making 100+ iterations cost-effective.
