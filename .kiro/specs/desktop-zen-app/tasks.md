# Implementation Plan: Desktop Zen App

## Overview

Implement a cross-platform desktop Zen app using Go (backend), Wails v2 (desktop bridge), and Vue 3 + TypeScript (frontend). The implementation proceeds in layers: project scaffolding → Go backend → Pinia store + pure logic → Vue components → wiring and integration.

## Tasks

- [x] 1. Scaffold the Wails + Vue 3 project
  - Run `wails init` with the Vue 3 TypeScript template to generate the project skeleton
  - Confirm `wails.json`, `main.go`, `app.go`, and `frontend/` directory are present
  - Install frontend dependencies (`npm install` inside `frontend/`)
  - Add `pinia` and `fast-check` (dev) and `vitest` (dev) to `frontend/package.json`
  - Configure `vitest` in `vite.config.ts` with a `test` block
  - _Requirements: 9.4_

- [x] 2. Implement Go backend
  - [x] 2.1 Implement `AppConfig` struct and config file path resolution
    - Define `AppConfig{LastDurationMinutes int}` in `app.go`
    - Implement `configFilePath()` using `os.UserConfigDir()` to resolve the platform-appropriate path (`desktop-zen-app/config.json`)
    - _Requirements: 10.1, 10.2, 10.3_

  - [x] 2.2 Implement `LoadConfig` and `SaveConfig`
    - `LoadConfig()` reads and unmarshals `config.json`; returns `AppConfig{LastDurationMinutes: 25}` if file is missing, corrupt, or value is outside [1, 60]
    - `SaveConfig(durationMinutes int)` marshals and writes `config.json`; logs error silently if directory is not writable
    - _Requirements: 10.1, 10.2, 10.3_

  - [ ]* 2.3 Write Go unit tests for `LoadConfig` and `SaveConfig`
    - Test: missing file returns default (25 min)
    - Test: corrupt JSON returns default
    - Test: out-of-range value returns default
    - Test: round-trip `SaveConfig(d)` → `LoadConfig()` returns `d` for valid `d`
    - _Requirements: 10.1, 10.2, 10.3_

  - [x] 2.4 Implement `clampDuration` helper and Go unit tests
    - `clampDuration(x int) int` returns `1` for `x < 1`, `60` for `x > 60`, `x` otherwise
    - Write table-driven tests covering boundaries and mid-range values
    - _Requirements: 3.3_

  - [x] 2.5 Implement `SessionComplete` and `SessionCancelled` on `App`
    - `SessionComplete()` sends an OS notification via the `beeep` library with message `"Zen session complete"` and plays the embedded audio asset; logs errors without crashing
    - `SessionCancelled()` is a no-op (exists for symmetry)
    - Embed a short WAV/MP3 completion chime using `//go:embed` in a dedicated `assets.go` file
    - _Requirements: 8.1, 8.2, 8.3_

  - [x] 2.6 Wire `App` methods into Wails `main.go`
    - Register `LoadConfig`, `SaveConfig`, `SessionComplete`, `SessionCancelled` as Wails-bound methods
    - Add `OnBeforeClose` hook that calls `SaveConfig` with the last known duration (passed from frontend via a Wails event or a dedicated method)
    - _Requirements: 10.1, 9.4_

- [x] 3. Checkpoint — Go backend complete
  - Run `go test ./...` and confirm all Go tests pass
  - Run `wails build` (or `wails dev`) and confirm the binary compiles without errors
  - Ask the user if any questions arise before proceeding to the frontend.

- [x] 4. Implement Pinia store and pure logic utilities
  - [x] 4.1 Create `zenStore.ts` with state, getters, and action stubs
    - Define `ZenState` interface: `mode`, `selectedDuration`, `activePreset`, `remainingSeconds`, `totalSeconds`, `intervalId`
    - Define `PRESETS` constant: `{ think: 10, study: 25, work: 50 }`
    - Implement `initFromConfig(config)`: seeds `selectedDuration` from config; sets `activePreset` if duration matches a preset value
    - Implement `arcProgress` getter: returns `remainingSeconds / totalSeconds` (clamped to [0, 1]); returns `1` when `totalSeconds === 0`
    - _Requirements: 10.2, 10.3, 10.4, 11.2_

  - [x] 4.2 Implement `selectPreset` and `setCustomDuration` actions
    - `selectPreset(preset)`: sets `selectedDuration` from `PRESETS[preset]`; sets `activePreset` to preset name
    - `setCustomDuration(minutes)`: clamps to [1, 60]; sets `selectedDuration`; sets `activePreset` to `null`
    - _Requirements: 2.2, 2.3, 2.4, 3.2, 3.3, 3.4_

  - [ ]* 4.3 Write property-based tests for `setCustomDuration` and `selectPreset`
    - **Property 1: Duration clamping is idempotent** — generate arbitrary integers; assert `clamp(clamp(x)) === clamp(x)` and boundary behaviour
    - **Validates: Requirements 3.3**
    - **Property 2: Custom duration deselects preset** — generate arbitrary preset + arbitrary valid duration; assert `activePreset === null` and `selectedDuration` equals clamped input
    - **Validates: Requirements 3.2, 3.4**
    - **Property 3: Preset selection sets correct duration and highlights preset** — generate arbitrary preset name; assert `selectedDuration === PRESETS[name]` and `activePreset === name`; select second preset and assert first is cleared
    - **Validates: Requirements 2.2, 2.3, 2.4**
    - _Requirements: 2.2, 2.3, 2.4, 3.2, 3.3, 3.4_

  - [x] 4.4 Implement `startSession`, `tick`, `completeSession`, and `cancelSession` actions
    - `startSession()`: transitions `mode` to `'zen'`; sets `remainingSeconds` and `totalSeconds` to `selectedDuration * 60`; starts `setInterval` calling `tick()` every 1000 ms
    - `tick()`: decrements `remainingSeconds` by 1; calls `completeSession()` when it reaches 0
    - `completeSession()`: clears interval; calls Go `SessionComplete` via Wails binding; transitions `mode` to `'idle'`; resets `totalSeconds` to 0
    - `cancelSession()`: clears interval; calls Go `SessionCancelled`; transitions `mode` to `'idle'`; resets `totalSeconds` to 0
    - _Requirements: 4.1, 4.3, 6.1, 6.3, 7.2, 7.4, 11.3, 11.4_

  - [ ]* 4.5 Write property-based tests for session state transitions
    - **Property 4: Start session initialises Zen state correctly** — generate arbitrary `d` in [1,60]; call `startSession()`; assert `mode === 'zen'`, `remainingSeconds === d * 60`, and `totalSeconds === d * 60`
    - **Validates: Requirements 4.1, 4.3**
    - **Property 5: Timer tick decrements by exactly one second** — generate arbitrary `remainingSeconds > 0`; call `tick()`; assert `remainingSeconds` decreased by exactly 1
    - **Validates: Requirements 6.1**
    - **Property 7: Session completion transitions to idle** — set `remainingSeconds` to 1; call `tick()`; assert `mode === 'idle'` and `remainingSeconds === 0`
    - **Validates: Requirements 6.3**
    - **Property 10: Cancel restores idle state without notification** — generate arbitrary `remainingSeconds > 0`; call `cancelSession()`; assert `mode === 'idle'` and `SessionComplete` not called
    - **Validates: Requirements 7.2, 7.4**
    - **Property 14: Arc progress is 1.0 at session start** — generate arbitrary `d` in [1,60]; call `startSession()`; assert `arcProgress === 1.0`
    - **Validates: Requirements 11.3**
    - **Property 15: Arc progress depletes monotonically** — generate arbitrary session; call `tick()` repeatedly; assert `arcProgress` is non-increasing and never negative
    - **Validates: Requirements 11.2, 11.5**
    - **Property 16: Arc progress is 0.0 at timer zero** — set `remainingSeconds` to 1; call `tick()`; assert `arcProgress === 0.0`
    - **Validates: Requirements 11.4**
    - **Property 17: Arc progress equals remaining/total ratio** — generate arbitrary `remainingSeconds` in [0, totalSeconds]; assert `arcProgress === remainingSeconds / totalSeconds`
    - **Validates: Requirements 11.2**
    - **Property 18: Toggle button state follows mode** — assert `mode === 'zen'` after `startSession()`; assert `mode === 'idle'` after `cancelSession()` or `completeSession()`
    - **Validates: Requirements 5.2, 5.5, 5.6**
    - _Requirements: 4.1, 4.3, 6.1, 6.3, 7.2, 7.4, 11.2, 11.3, 11.4, 11.5_

  - [ ]* 4.6 Write property-based tests for session completion side effects
    - **Property 8: Session completion dispatches notification with correct message** — mock `SessionComplete`; complete session; assert mock called once
    - **Validates: Requirements 6.4, 8.1, 8.3**
    - **Property 9: Session completion triggers audio playback** — mock audio function; complete session; assert mock called exactly once
    - **Validates: Requirements 8.2**
    - _Requirements: 6.4, 8.1, 8.2, 8.3_

  - [x] 4.7 Implement `formatTime` utility and `saveAndClose` action
    - `formatTime(seconds: number): string` formats as `MM:SS` (zero-padded)
    - `saveAndClose()` calls Go `SaveConfig` with `selectedDuration`
    - _Requirements: 6.2, 10.1_

  - [ ]* 4.8 Write property-based tests for `formatTime` and config round-trip
    - **Property 6: Timer display round-trip** — generate arbitrary seconds in [0, 3600]; assert `parseMMSS(formatMMSS(s)) === s`
    - **Validates: Requirements 6.2**
    - **Property 13: Preset highlight restored from persisted duration on launch** — generate preset values {10, 25, 50}; save config; init store; assert correct preset is highlighted
    - **Validates: Requirements 10.4**
    - _Requirements: 6.2, 10.4_

- [x] 5. Checkpoint — Store and logic complete
  - Run `npx vitest --run` inside `frontend/` and confirm all store tests pass
  - Ask the user if any questions arise before proceeding to UI components.

- [x] 6. Implement Vue components — main screen
  - [x] 6.1 Create `PresetButton.vue`
    - Renders a single named preset chip; accepts `name` and `isActive` props
    - Emits `select` event on click
    - Applies an `active` CSS class when `isActive` is true
    - _Requirements: 2.1, 2.3, 2.4_

  - [x] 6.2 Create `DurationSelector.vue`
    - Renders a numeric `<input type="number">` clamped to [1, 60]
    - Clamps value on `blur` and `change` events; emits `update:modelValue`
    - _Requirements: 3.1, 3.2, 3.3_

  - [x] 6.3 Create `TopPanel.vue`
    - Renders three `PresetButton` components (Think, Study, Work) and the `DurationSelector`
    - Connects preset selection and duration changes to the Pinia store
    - _Requirements: 1.1, 2.1, 3.1_

  - [x] 6.4 Create `StartButton.vue`
    - Large centered button; calls `zenStore.startSession()` when `mode === 'idle'`, calls `zenStore.cancelSession()` when `mode === 'zen'`
    - Renders with start label/style when `mode === 'idle'`; renders with cancel label/style (different color and label, e.g. "Cancel") when `mode === 'zen'`
    - Disabled state when `mode === 'idle'` and `selectedDuration` is not a valid integer in [1, 60]
    - _Requirements: 1.2, 1.3, 4.1, 5.2, 5.5, 5.6, 7.1_

- [x] 7. Implement Vue components — Zen mode screen
  - [x] 7.1 Create `TimerDisplay.vue`
    - Accepts `remainingSeconds` prop; renders formatted time using `formatTime`
    - _Requirements: 5.1, 6.2_

  - [x] 7.2 Create `ArcIndicator.vue`
    - SVG circular arc element; accepts `progress` prop (0.0–1.0)
    - Computes the SVG arc `stroke-dashoffset` from `progress` so the arc depletes as `progress` decreases from 1 to 0
    - Uses CSS variables from the minimal color palette for stroke color
    - _Requirements: 11.1, 11.2, 11.6_

  - [x] 7.3 Create `ZenScreen.vue`
    - Full-screen view shown when `mode === 'zen'`
    - Displays `ArcIndicator` (passing `zenStore.arcProgress`) surrounding or accompanying `TimerDisplay`
    - Displays `StartButton` (which renders in cancel state automatically based on `mode`)
    - Uses a minimal color palette with no animated distractions beyond the arc depletion
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 7.1, 7.2, 11.1, 11.5_

- [x] 8. Implement root `App.vue` and global styles
  - `App.vue` conditionally renders `MainScreen` (TopPanel + StartButton) or `ZenScreen` (ArcIndicator + TimerDisplay + StartButton in cancel state) based on `zenStore.mode`
  - On `mounted`, call `LoadConfig` via Wails binding and call `zenStore.initFromConfig(config)`
  - Register `saveAndClose` on the Wails `OnBeforeClose` event
  - Define CSS variables for the minimal color palette (background, text, accent, cancel-accent) in `main.css`
  - _Requirements: 1.1, 1.2, 1.4, 4.4, 5.3, 5.5, 5.6, 10.2_

- [x] 9. Implement in-app fallback alert for denied notifications
  - Add a reactive `showFallbackAlert` flag to `zenStore`
  - When `SessionComplete` Go call returns an error (notification denied), set `showFallbackAlert` to `true`
  - Render a simple modal overlay in `App.vue` when `showFallbackAlert` is true; dismiss on click
  - _Requirements: 8.3_

- [x] 10. Checkpoint — Full UI wired together
  - Run `wails dev` locally and manually verify:
    - Main screen renders with TopPanel and StartButton
    - Selecting a preset highlights it and deselects others
    - Custom duration input clamps correctly
    - Start button enters Zen mode and countdown begins
    - Start button changes to cancel style (different color/label) during Zen mode
    - Arc indicator is fully filled at session start and depletes smoothly as time passes
    - Pressing the cancel-state button returns to main screen without notification; button reverts to start style
    - Timer reaching zero triggers notification and audio; arc is fully depleted
  - Run `npx vitest --run` and confirm all frontend tests still pass
  - Ask the user if any questions arise before final polish.

- [x] 11. Apply styling and cross-platform polish
  - [x] 11.1 Style the main screen
    - Center `StartButton` vertically and horizontally; ensure it occupies at least 20% of screen area
    - Style `TopPanel` as a horizontal bar pinned to the top
    - Apply CSS variables for consistent theming
    - _Requirements: 1.2, 1.3, 5.4_

  - [x] 11.2 Style the Zen mode screen
    - Full-screen dark/neutral background; large centered timer font inside or alongside the arc indicator
    - `ArcIndicator` SVG sized to frame the timer display; stroke width and color use CSS variables
    - `StartButton` in cancel state uses a distinct color (e.g., muted red or desaturated accent) and label "Cancel"
    - No additional animations or distracting elements beyond the arc depletion
    - _Requirements: 5.1, 5.2, 5.4, 5.5, 11.1, 11.6_

  - [x] 11.3 Configure `wails.json` for cross-platform builds
    - Set app name, version, and window dimensions in `wails.json`
    - Verify `wails build -platform windows/amd64`, `darwin/amd64`, and `linux/amd64` each produce a binary without errors
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [x] 12. Final checkpoint — Ensure all tests pass
  - Run `go test ./...` and confirm all Go tests pass
  - Run `npx vitest --run` inside `frontend/` and confirm all frontend tests pass
  - Run `wails build` for the host platform and confirm the binary launches and renders within 3 seconds
  - Ensure all tests pass; ask the user if any questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Checkpoints (tasks 3, 5, 10, 12) ensure incremental validation at each layer boundary
- Property tests use **fast-check** (minimum 100 iterations per property) and are tagged with `// Feature: desktop-zen-app, Property N: <property text>`
- Unit tests use **Vitest** for the frontend and the standard `testing` package for Go
- The timer runs in the frontend (`setInterval`) for sub-second UI responsiveness; the Go backend handles persistence, notifications, and audio only
- Config is stored in the OS user-config directory via `os.UserConfigDir()` — no database dependency
