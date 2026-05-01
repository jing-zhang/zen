import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { LoadConfig, SaveConfig, SessionComplete, SessionCancelled } from '../../wailsjs/go/main/App'
import { main } from '../../wailsjs/go/models'

// ============================================================================
// Types and Constants
// ============================================================================

export type Mode = 'idle' | 'zen'

export interface ZenState {
  mode: Mode
  selectedDuration: number // minutes, 1–60
  activePreset: string | null // 'think' | 'study' | 'work' | null
  remainingSeconds: number
  totalSeconds: number // set at session start; used to compute arc progress
  intervalId: ReturnType<typeof setInterval> | null
}

export const PRESETS: Record<string, number> = {
  think: 10,
  study: 25,
  work: 50,
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Clamps a duration value to the valid range [1, 60].
 * @param minutes - The duration in minutes
 * @returns The clamped duration
 */
export function clampDuration(minutes: number): number {
  return Math.max(1, Math.min(60, minutes))
}

/**
 * Formats seconds as MM:SS (zero-padded).
 * @param seconds - The number of seconds
 * @returns Formatted time string
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

/**
 * Parses a MM:SS formatted string back to total seconds.
 * @param timeStr - The formatted time string
 * @returns Total seconds
 */
export function parseMMSS(timeStr: string): number {
  const [minutes, seconds] = timeStr.split(':').map(Number)
  return minutes * 60 + seconds
}

// ============================================================================
// Pinia Store
// ============================================================================

export const useZenStore = defineStore('zen', () => {
  // State
  const mode = ref<Mode>('idle')
  const selectedDuration = ref<number>(25) // default 25 minutes
  const activePreset = ref<string | null>(null)
  const remainingSeconds = ref<number>(0)
  const totalSeconds = ref<number>(0)
  const intervalId = ref<ReturnType<typeof setInterval> | null>(null)
  const showFallbackAlert = ref<boolean>(false)

  // ========================================================================
  // Getters
  // ========================================================================

  /**
   * Computes the arc progress as a ratio of remaining to total seconds.
   * Returns 1.0 when totalSeconds is 0 (no session active).
   * Clamped to [0, 1].
   */
  const arcProgress = computed(() => {
    if (totalSeconds.value === 0) {
      return 1
    }
    const progress = remainingSeconds.value / totalSeconds.value
    return Math.max(0, Math.min(1, progress))
  })

  // ========================================================================
  // Actions
  // ========================================================================

  /**
   * Initializes the store from persisted config.
   * Seeds selectedDuration from config; sets activePreset if duration matches a preset.
   */
  function initFromConfig(config: main.AppConfig): void {
    const duration = clampDuration(config.lastDurationMinutes)
    selectedDuration.value = duration

    // Check if the duration matches a preset
    for (const [presetName, presetDuration] of Object.entries(PRESETS)) {
      if (presetDuration === duration) {
        activePreset.value = presetName
        return
      }
    }

    // No preset match
    activePreset.value = null
  }

  /**
   * Selects a preset by name.
   * Sets selectedDuration from PRESETS[preset]; sets activePreset to preset name.
   */
  function selectPreset(preset: string): void {
    if (preset in PRESETS) {
      selectedDuration.value = PRESETS[preset]
      activePreset.value = preset
    }
  }

  /**
   * Sets a custom duration.
   * Clamps to [1, 60]; sets selectedDuration; sets activePreset to null.
   */
  function setCustomDuration(minutes: number): void {
    selectedDuration.value = clampDuration(minutes)
    activePreset.value = null
  }

  /**
   * Starts a Zen session.
   * Transitions mode to 'zen'; sets remainingSeconds and totalSeconds to selectedDuration * 60;
   * starts setInterval calling tick() every 1000 ms with drift correction.
   */
  function startSession(): void {
    mode.value = 'zen'
    const durationSeconds = selectedDuration.value * 60
    remainingSeconds.value = durationSeconds
    totalSeconds.value = durationSeconds

    // Clear any existing interval
    if (intervalId.value !== null) {
      clearInterval(intervalId.value)
    }

    // Start the countdown interval with drift correction
    const startTime = Date.now()
    
    intervalId.value = setInterval(() => {
      const now = Date.now()
      const elapsedMs = now - startTime
      const elapsedSeconds = Math.floor(elapsedMs / 1000)
      
      // Calculate remaining seconds based on actual elapsed time
      const newRemainingSeconds = Math.max(0, totalSeconds.value - elapsedSeconds)
      remainingSeconds.value = newRemainingSeconds

      if (remainingSeconds.value <= 0) {
        remainingSeconds.value = 0
        completeSession()
      }
    }, 1000)
  }

  /**
   * Decrements remainingSeconds by 1.
   * Calls completeSession() when remainingSeconds reaches 0.
   * Note: This is kept for backward compatibility with tests.
   * The actual timer uses Date.now() delta for accuracy.
   */
  function tick(): void {
    remainingSeconds.value -= 1

    if (remainingSeconds.value <= 0) {
      remainingSeconds.value = 0
      completeSession()
    }
  }

  /**
   * Completes a session.
   * Clears interval; calls Go SessionComplete via Wails binding;
   * transitions mode to 'idle'; resets totalSeconds to 0.
   * If SessionComplete fails (e.g., notification denied), sets showFallbackAlert to true.
   */
  async function completeSession(): Promise<void> {
    // Clear the interval
    if (intervalId.value !== null) {
      clearInterval(intervalId.value)
      intervalId.value = null
    }

    // Call Go backend
    try {
      await SessionComplete()
    } catch (error) {
      console.error('SessionComplete failed:', error)
      // Show fallback alert if notification was denied
      showFallbackAlert.value = true
    }

    // Transition to idle
    mode.value = 'idle'
    totalSeconds.value = 0
  }

  /**
   * Cancels an active session.
   * Clears interval; calls Go SessionCancelled;
   * transitions mode to 'idle'; resets totalSeconds to 0.
   */
  async function cancelSession(): Promise<void> {
    // Clear the interval
    if (intervalId.value !== null) {
      clearInterval(intervalId.value)
      intervalId.value = null
    }

    // Call Go backend
    try {
      await SessionCancelled()
    } catch (error) {
      console.error('SessionCancelled failed:', error)
    }

    // Transition to idle
    mode.value = 'idle'
    totalSeconds.value = 0
  }

  /**
   * Saves the current duration and closes the app.
   * Calls Go SaveConfig with selectedDuration.
   * Logs errors but doesn't prevent app close.
   */
  async function saveAndClose(): Promise<void> {
    try {
      await SaveConfig(selectedDuration.value)
    } catch (error) {
      console.error('SaveConfig failed:', error)
      // Log error but continue - don't prevent app close
    }
  }

  /**
   * Dismisses the fallback alert.
   */
  function dismissFallbackAlert(): void {
    showFallbackAlert.value = false
  }

  return {
    // State
    mode,
    selectedDuration,
    activePreset,
    remainingSeconds,
    totalSeconds,
    intervalId,
    showFallbackAlert,

    // Getters
    arcProgress,

    // Actions
    initFromConfig,
    selectPreset,
    setCustomDuration,
    startSession,
    tick,
    completeSession,
    cancelSession,
    saveAndClose,
    dismissFallbackAlert,
  }
})
