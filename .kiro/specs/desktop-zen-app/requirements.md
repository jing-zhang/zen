# Requirements Document

## Introduction

Desktop Zen App is a cross-platform desktop application built with Golang, Wails, and Vue/React. Its purpose is to help users enter a distraction-free focus state for a defined period of time. The UI is intentionally minimal: a single prominent button to start Zen mode, a top panel with predefined duration presets (e.g., Study, Work, Think), and a custom duration selector ranging from 1 to 60 minutes. When Zen mode is active, the application creates a calm, non-distracting environment until the session ends or the user manually exits.

## Glossary

- **App**: The Desktop Zen application.
- **Zen_Mode**: The active focus state during which the App displays a distraction-free screen and counts down the selected duration.
- **Session**: A single Zen Mode run from start to finish (either timer expiry or user cancellation).
- **Preset**: A named, predefined duration (e.g., Study = 25 min, Work = 50 min, Think = 10 min).
- **Duration_Selector**: The UI control that allows the user to choose a custom duration between 1 and 60 minutes.
- **Timer**: The countdown mechanism that tracks remaining time in a Session.
- **Top_Panel**: The horizontal bar at the top of the App window containing Presets and the Duration_Selector.
- **Start_Button**: The single large button centered on the main screen used to initiate Zen Mode.
- **Notification**: A system-level alert delivered to the user when a Session ends.
- **Arc_Indicator**: The circular/arc-shaped SVG progress element displayed during Zen_Mode that visually depletes as the Session timer counts down.

---

## Requirements

### Requirement 1: Main Screen Layout

**User Story:** As a user, I want a clean, minimal main screen with a single prominent button, so that I can start a Zen session without distraction.

#### Acceptance Criteria

1. THE App SHALL display the Top_Panel at the top of the main screen at all times when Zen_Mode is not active.
2. THE App SHALL display the Start_Button centered on the main screen when Zen_Mode is not active.
3. THE Start_Button SHALL be visually dominant, occupying at least 20% of the main screen area.
4. THE App SHALL display no other interactive controls on the main screen outside of the Top_Panel and the Start_Button when Zen_Mode is not active.

---

### Requirement 2: Predefined Duration Presets

**User Story:** As a user, I want to quickly select a named focus duration (e.g., Study, Work, Think), so that I can start a session without manually choosing a time.

#### Acceptance Criteria

1. THE Top_Panel SHALL display at least three Presets: "Think" (10 minutes), "Study" (25 minutes), and "Work" (50 minutes).
2. WHEN the user selects a Preset, THE App SHALL set the Session duration to the value associated with that Preset.
3. WHEN the user selects a Preset, THE App SHALL visually highlight the selected Preset to indicate it is active.
4. WHEN the user selects a different Preset or a custom duration, THE App SHALL remove the highlight from the previously selected Preset.

---

### Requirement 3: Custom Duration Selection

**User Story:** As a user, I want to select a custom duration between 1 and 60 minutes, so that I can tailor the session length to my needs.

#### Acceptance Criteria

1. THE Top_Panel SHALL include a Duration_Selector that allows the user to choose a duration value between 1 minute and 60 minutes inclusive.
2. WHEN the user sets a value in the Duration_Selector, THE App SHALL set the Session duration to that value in minutes.
3. IF the user enters a duration value less than 1 minute or greater than 60 minutes, THEN THE App SHALL reset the Duration_Selector to the nearest valid boundary (1 or 60 minutes).
4. WHEN the user modifies the Duration_Selector, THE App SHALL deselect any currently active Preset.

---

### Requirement 4: Starting Zen Mode

**User Story:** As a user, I want to press the Start Button to enter Zen Mode, so that I can begin my distraction-free focus session.

#### Acceptance Criteria

1. WHEN the user presses the Start_Button, THE App SHALL transition to Zen_Mode using the currently selected duration.
2. WHEN the user presses the Start_Button and no duration has been explicitly selected, THE App SHALL use a default duration of 25 minutes.
3. WHEN Zen_Mode starts, THE App SHALL start the Timer counting down from the selected duration.
4. WHEN Zen_Mode starts, THE App SHALL replace the main screen content with the Zen_Mode screen.

---

### Requirement 5: Zen Mode Screen

**User Story:** As a user, I want the Zen Mode screen to be calm and distraction-free, so that I can maintain focus during my session.

#### Acceptance Criteria

1. WHILE Zen_Mode is active, THE App SHALL display the remaining time of the Timer prominently on screen.
2. WHILE Zen_Mode is active, THE App SHALL display the Start_Button in a visually distinct cancel state as the sole interactive control for ending the Session.
3. WHILE Zen_Mode is active, THE App SHALL hide the Top_Panel.
4. WHILE Zen_Mode is active, THE App SHALL use a minimal color palette with no animated distractions.
5. WHEN Zen_Mode starts, THE Start_Button SHALL change its visual appearance (label, color, or style) to indicate it will cancel the active Session.
6. WHEN Zen_Mode ends, THE Start_Button SHALL revert to its original visual appearance for starting a new Session.

---

### Requirement 6: Timer Countdown

**User Story:** As a user, I want the timer to count down accurately, so that I know exactly how much time remains in my session.

#### Acceptance Criteria

1. WHILE Zen_Mode is active, THE Timer SHALL decrement the remaining time by one second every second.
2. WHILE Zen_Mode is active, THE App SHALL display the remaining time in MM:SS format.
3. WHEN the Timer reaches zero, THE App SHALL end the Session and transition back to the main screen.
4. WHEN the Timer reaches zero, THE App SHALL deliver a Notification to the user indicating the Session has completed.

---

### Requirement 7: Cancelling a Session

**User Story:** As a user, I want to cancel an active Zen session at any time, so that I can exit focus mode if needed.

#### Acceptance Criteria

1. WHILE Zen_Mode is active, THE Start_Button SHALL be displayed in a cancel state that the user can activate to end the Session early.
2. WHEN the user activates the Start_Button in cancel state, THE App SHALL stop the Timer and transition back to the main screen.
3. WHEN the user activates the Start_Button in cancel state, THE App SHALL restore the Top_Panel on the main screen.
4. WHEN the user activates the Start_Button in cancel state, THE App SHALL NOT deliver a session-complete Notification.

---

### Requirement 8: Session Completion Notification

**User Story:** As a user, I want to receive a notification when my session ends, so that I know my focus time is complete even if I am not watching the screen.

#### Acceptance Criteria

1. WHEN the Timer reaches zero, THE App SHALL send a system Notification with the message "Zen session complete".
2. WHEN the Timer reaches zero, THE App SHALL play an audible completion sound.
3. IF the operating system denies notification permission, THEN THE App SHALL display an in-app alert indicating the Session has ended.

---

### Requirement 9: Cross-Platform Compatibility

**User Story:** As a user on macOS, Windows, or Linux, I want the App to run natively on my operating system, so that I can use it regardless of my platform.

#### Acceptance Criteria

1. THE App SHALL run on macOS 11 (Big Sur) or later.
2. THE App SHALL run on Windows 10 or later.
3. THE App SHALL run on Ubuntu 20.04 LTS or later.
4. THE App SHALL produce a single distributable binary per target platform via the Wails build system.
5. WHEN the App is launched on any supported platform, THE App SHALL render the main screen within 3 seconds of launch.

---

### Requirement 10: State Persistence

**User Story:** As a user, I want the App to remember my last-used duration, so that I do not have to re-select it every time I open the application.

#### Acceptance Criteria

1. WHEN the user closes the App, THE App SHALL persist the most recently selected duration to local storage.
2. WHEN the App is launched, THE App SHALL restore the most recently persisted duration as the default selection.
3. IF no persisted duration exists, THEN THE App SHALL use a default duration of 25 minutes on launch.
4. WHEN the App restores a persisted duration that matches a Preset value, THE App SHALL highlight that Preset as selected.

---

### Requirement 11: Countdown Animation

**User Story:** As a user, I want a visual animation during Zen Mode, so that I have a calm, ambient sense of how much time remains without having to read the digits.

#### Acceptance Criteria

1. WHILE Zen_Mode is active, THE App SHALL display a circular arc progress indicator that surrounds or accompanies the Timer display.
2. WHILE Zen_Mode is active, THE Arc_Indicator SHALL be filled to a proportion equal to the ratio of remaining time to total Session duration.
3. WHEN Zen_Mode starts, THE Arc_Indicator SHALL be fully filled (100% of the arc).
4. WHEN the Timer reaches zero, THE Arc_Indicator SHALL be fully depleted (0% of the arc).
5. WHILE Zen_Mode is active, THE Arc_Indicator SHALL update its fill proportion continuously as the Timer decrements.
6. THE Arc_Indicator SHALL use a visual style consistent with the minimal color palette defined for the Zen Mode screen.
