import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import fc from 'fast-check'
import {
  useZenStore,
  clampDuration,
  formatTime,
  parseMMSS,
  PRESETS,
} from './zenStore'
import * as AppBindings from '../../wailsjs/go/main/App'

// Mock the Wails bindings
vi.mock('../../wailsjs/go/main/App', () => ({
  LoadConfig: vi.fn(),
  SaveConfig: vi.fn(),
  SessionComplete: vi.fn(),
  SessionCancelled: vi.fn(),
}))

describe('zenStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  // ========================================================================
  // Unit Tests: clampDuration
  // ========================================================================

  describe('clampDuration', () => {
    it('should return 1 for values less than 1', () => {
      expect(clampDuration(0)).toBe(1)
      expect(clampDuration(-5)).toBe(1)
      expect(clampDuration(-100)).toBe(1)
    })

    it('should return 60 for values greater than 60', () => {
      expect(clampDuration(61)).toBe(60)
      expect(clampDuration(100)).toBe(60)
      expect(clampDuration(1000)).toBe(60)
    })

    it('should return the value unchanged for values in [1, 60]', () => {
      expect(clampDuration(1)).toBe(1)
      expect(clampDuration(30)).toBe(30)
      expect(clampDuration(60)).toBe(60)
    })
  })

  // ========================================================================
  // Unit Tests: formatTime
  // ========================================================================

  describe('formatTime', () => {
    it('should format 0 seconds as 00:00', () => {
      expect(formatTime(0)).toBe('00:00')
    })

    it('should format 59 seconds as 00:59', () => {
      expect(formatTime(59)).toBe('00:59')
    })

    it('should format 60 seconds as 01:00', () => {
      expect(formatTime(60)).toBe('01:00')
    })

    it('should format 3599 seconds as 59:59', () => {
      expect(formatTime(3599)).toBe('59:59')
    })

    it('should format 3600 seconds as 60:00', () => {
      expect(formatTime(3600)).toBe('60:00')
    })

    it('should zero-pad single-digit minutes and seconds', () => {
      expect(formatTime(65)).toBe('01:05')
      expect(formatTime(125)).toBe('02:05')
    })
  })

  // ========================================================================
  // Unit Tests: parseMMSS
  // ========================================================================

  describe('parseMMSS', () => {
    it('should parse 00:00 as 0 seconds', () => {
      expect(parseMMSS('00:00')).toBe(0)
    })

    it('should parse 01:00 as 60 seconds', () => {
      expect(parseMMSS('01:00')).toBe(60)
    })

    it('should parse 00:59 as 59 seconds', () => {
      expect(parseMMSS('00:59')).toBe(59)
    })

    it('should parse 59:59 as 3599 seconds', () => {
      expect(parseMMSS('59:59')).toBe(3599)
    })
  })

  // ========================================================================
  // Unit Tests: Store Initialization
  // ========================================================================

  describe('store initialization', () => {
    it('should initialize with default values', () => {
      const store = useZenStore()
      expect(store.mode).toBe('idle')
      expect(store.selectedDuration).toBe(25)
      expect(store.activePreset).toBeNull()
      expect(store.remainingSeconds).toBe(0)
      expect(store.totalSeconds).toBe(0)
      expect(store.intervalId).toBeNull()
    })
  })

  // ========================================================================
  // Unit Tests: initFromConfig
  // ========================================================================

  describe('initFromConfig', () => {
    it('should seed selectedDuration from config', () => {
      const store = useZenStore()
      store.initFromConfig({ lastDurationMinutes: 30 })
      expect(store.selectedDuration).toBe(30)
    })

    it('should set activePreset when duration matches a preset', () => {
      const store = useZenStore()
      store.initFromConfig({ lastDurationMinutes: 25 })
      expect(store.activePreset).toBe('study')
    })

    it('should set activePreset to null when duration does not match a preset', () => {
      const store = useZenStore()
      store.initFromConfig({ lastDurationMinutes: 30 })
      expect(store.activePreset).toBeNull()
    })

    it('should clamp out-of-range config values', () => {
      const store = useZenStore()
      store.initFromConfig({ lastDurationMinutes: 100 })
      expect(store.selectedDuration).toBe(60)
    })
  })

  // ========================================================================
  // Unit Tests: selectPreset
  // ========================================================================

  describe('selectPreset', () => {
    it('should set selectedDuration from PRESETS', () => {
      const store = useZenStore()
      store.selectPreset('think')
      expect(store.selectedDuration).toBe(10)
      store.selectPreset('study')
      expect(store.selectedDuration).toBe(25)
      store.selectPreset('work')
      expect(store.selectedDuration).toBe(50)
    })

    it('should set activePreset to the preset name', () => {
      const store = useZenStore()
      store.selectPreset('think')
      expect(store.activePreset).toBe('think')
    })

    it('should clear previous preset when selecting a new one', () => {
      const store = useZenStore()
      store.selectPreset('think')
      expect(store.activePreset).toBe('think')
      store.selectPreset('study')
      expect(store.activePreset).toBe('study')
    })
  })

  // ========================================================================
  // Unit Tests: setCustomDuration
  // ========================================================================

  describe('setCustomDuration', () => {
    it('should set selectedDuration to the provided value', () => {
      const store = useZenStore()
      store.setCustomDuration(30)
      expect(store.selectedDuration).toBe(30)
    })

    it('should clamp the value to [1, 60]', () => {
      const store = useZenStore()
      store.setCustomDuration(0)
      expect(store.selectedDuration).toBe(1)
      store.setCustomDuration(100)
      expect(store.selectedDuration).toBe(60)
    })

    it('should set activePreset to null', () => {
      const store = useZenStore()
      store.selectPreset('study')
      expect(store.activePreset).toBe('study')
      store.setCustomDuration(30)
      expect(store.activePreset).toBeNull()
    })
  })

  // ========================================================================
  // Unit Tests: startSession
  // ========================================================================

  describe('startSession', () => {
    it('should transition mode to zen', () => {
      const store = useZenStore()
      store.selectedDuration = 25
      store.startSession()
      expect(store.mode).toBe('zen')
    })

    it('should set remainingSeconds and totalSeconds to selectedDuration * 60', () => {
      const store = useZenStore()
      store.selectedDuration = 25
      store.startSession()
      expect(store.remainingSeconds).toBe(1500)
      expect(store.totalSeconds).toBe(1500)
    })

    it('should start an interval', () => {
      const store = useZenStore()
      store.selectedDuration = 25
      store.startSession()
      expect(store.intervalId).not.toBeNull()
      clearInterval(store.intervalId!)
    })
  })

  // ========================================================================
  // Unit Tests: tick
  // ========================================================================

  describe('tick', () => {
    it('should decrement remainingSeconds by 1', () => {
      const store = useZenStore()
      store.selectedDuration = 25
      store.startSession()
      const before = store.remainingSeconds
      store.tick()
      expect(store.remainingSeconds).toBe(before - 1)
      clearInterval(store.intervalId!)
    })

    it('should call completeSession when remainingSeconds reaches 0', async () => {
      const store = useZenStore()
      store.selectedDuration = 1
      store.startSession()
      store.remainingSeconds = 1
      await store.tick()
      expect(store.mode).toBe('idle')
      expect(store.remainingSeconds).toBe(0)
    })
  })

  // ========================================================================
  // Unit Tests: completeSession
  // ========================================================================

  describe('completeSession', () => {
    it('should clear the interval', async () => {
      const store = useZenStore()
      store.selectedDuration = 25
      store.startSession()
      const intervalId = store.intervalId
      await store.completeSession()
      expect(store.intervalId).toBeNull()
    })

    it('should call SessionComplete via Wails binding', async () => {
      const store = useZenStore()
      store.selectedDuration = 25
      store.startSession()
      await store.completeSession()
      expect(AppBindings.SessionComplete).toHaveBeenCalled()
    })

    it('should transition mode to idle', async () => {
      const store = useZenStore()
      store.selectedDuration = 25
      store.startSession()
      await store.completeSession()
      expect(store.mode).toBe('idle')
    })

    it('should reset totalSeconds to 0', async () => {
      const store = useZenStore()
      store.selectedDuration = 25
      store.startSession()
      await store.completeSession()
      expect(store.totalSeconds).toBe(0)
    })
  })

  // ========================================================================
  // Unit Tests: cancelSession
  // ========================================================================

  describe('cancelSession', () => {
    it('should clear the interval', async () => {
      const store = useZenStore()
      store.selectedDuration = 25
      store.startSession()
      await store.cancelSession()
      expect(store.intervalId).toBeNull()
    })

    it('should call SessionCancelled via Wails binding', async () => {
      const store = useZenStore()
      store.selectedDuration = 25
      store.startSession()
      await store.cancelSession()
      expect(AppBindings.SessionCancelled).toHaveBeenCalled()
    })

    it('should transition mode to idle', async () => {
      const store = useZenStore()
      store.selectedDuration = 25
      store.startSession()
      await store.cancelSession()
      expect(store.mode).toBe('idle')
    })

    it('should reset totalSeconds to 0', async () => {
      const store = useZenStore()
      store.selectedDuration = 25
      store.startSession()
      await store.cancelSession()
      expect(store.totalSeconds).toBe(0)
    })

    it('should NOT call SessionComplete', async () => {
      const store = useZenStore()
      store.selectedDuration = 25
      store.startSession()
      await store.cancelSession()
      expect(AppBindings.SessionComplete).not.toHaveBeenCalled()
    })
  })

  // ========================================================================
  // Unit Tests: arcProgress getter
  // ========================================================================

  describe('arcProgress getter', () => {
    it('should return 1 when totalSeconds is 0', () => {
      const store = useZenStore()
      expect(store.arcProgress).toBe(1)
    })

    it('should return 1.0 at session start', () => {
      const store = useZenStore()
      store.selectedDuration = 25
      store.startSession()
      expect(store.arcProgress).toBe(1)
      clearInterval(store.intervalId!)
    })

    it('should return 0.0 when remainingSeconds is 0', () => {
      const store = useZenStore()
      store.selectedDuration = 25
      store.startSession()
      store.remainingSeconds = 0
      expect(store.arcProgress).toBe(0)
      clearInterval(store.intervalId!)
    })

    it('should return the correct ratio mid-session', () => {
      const store = useZenStore()
      store.selectedDuration = 25
      store.startSession()
      store.remainingSeconds = 750 // half of 1500
      expect(store.arcProgress).toBe(0.5)
      clearInterval(store.intervalId!)
    })

    it('should be clamped to [0, 1]', () => {
      const store = useZenStore()
      store.totalSeconds = 100
      store.remainingSeconds = 150 // more than total
      expect(store.arcProgress).toBe(1)
      store.remainingSeconds = -50 // negative
      expect(store.arcProgress).toBe(0)
    })
  })

  // ========================================================================
  // Unit Tests: saveAndClose
  // ========================================================================

  describe('saveAndClose', () => {
    it('should call SaveConfig with selectedDuration', async () => {
      const store = useZenStore()
      store.selectedDuration = 30
      await store.saveAndClose()
      expect(AppBindings.SaveConfig).toHaveBeenCalledWith(30)
    })
  })

  // ========================================================================
  // Property-Based Tests
  // ========================================================================

  describe('Property-Based Tests', () => {
    // Property 1: Duration clamping is idempotent
    // Validates: Requirements 3.3
    it('Property 1: Duration clamping is idempotent', () => {
      fc.assert(
        fc.property(fc.integer(), (x) => {
          const clamped1 = clampDuration(x)
          const clamped2 = clampDuration(clamped1)
          expect(clamped2).toBe(clamped1)
          // Also verify boundary behavior
          if (x < 1) expect(clamped1).toBe(1)
          if (x > 60) expect(clamped1).toBe(60)
          if (x >= 1 && x <= 60) expect(clamped1).toBe(x)
        }),
        { numRuns: 100 }
      )
    })

    // Property 2: Custom duration deselects preset
    // Validates: Requirements 3.2, 3.4
    it('Property 2: Custom duration deselects preset', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('think', 'study', 'work'),
          fc.integer({ min: 1, max: 60 }),
          (preset, duration) => {
            const store = useZenStore()
            store.selectPreset(preset)
            expect(store.activePreset).toBe(preset)
            store.setCustomDuration(duration)
            expect(store.activePreset).toBeNull()
            expect(store.selectedDuration).toBe(duration)
          }
        ),
        { numRuns: 100 }
      )
    })

    // Property 3: Preset selection sets correct duration and highlights preset
    // Validates: Requirements 2.2, 2.3, 2.4
    it('Property 3: Preset selection sets correct duration and highlights preset', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('think', 'study', 'work'),
          fc.constantFrom('think', 'study', 'work'),
          (preset1, preset2) => {
            const store = useZenStore()
            store.selectPreset(preset1)
            expect(store.selectedDuration).toBe(PRESETS[preset1])
            expect(store.activePreset).toBe(preset1)
            if (preset1 !== preset2) {
              store.selectPreset(preset2)
              expect(store.selectedDuration).toBe(PRESETS[preset2])
              expect(store.activePreset).toBe(preset2)
            }
          }
        ),
        { numRuns: 100 }
      )
    })

    // Property 4: Start session initialises Zen state correctly
    // Validates: Requirements 4.1, 4.3
    it('Property 4: Start session initialises Zen state correctly', () => {
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 60 }), (d) => {
          const store = useZenStore()
          store.selectedDuration = d
          store.startSession()
          expect(store.mode).toBe('zen')
          expect(store.remainingSeconds).toBe(d * 60)
          expect(store.totalSeconds).toBe(d * 60)
          clearInterval(store.intervalId!)
        }),
        { numRuns: 100 }
      )
    })

    // Property 5: Timer tick decrements by exactly one second
    // Validates: Requirements 6.1
    it('Property 5: Timer tick decrements by exactly one second', () => {
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 3600 }), (remaining) => {
          const store = useZenStore()
          store.selectedDuration = 60
          store.startSession()
          store.remainingSeconds = remaining
          const before = store.remainingSeconds
          store.tick()
          if (remaining > 1) {
            expect(store.remainingSeconds).toBe(before - 1)
          }
          clearInterval(store.intervalId!)
        }),
        { numRuns: 100 }
      )
    })

    // Property 6: Timer display round-trip
    // Validates: Requirements 6.2
    it('Property 6: Timer display round-trip', () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 3600 }), (s) => {
          const formatted = formatTime(s)
          const parsed = parseMMSS(formatted)
          expect(parsed).toBe(s)
        }),
        { numRuns: 100 }
      )
    })

    // Property 14: Arc progress is 1.0 at session start
    // Validates: Requirements 11.3
    it('Property 14: Arc progress is 1.0 at session start', () => {
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 60 }), (d) => {
          const store = useZenStore()
          store.selectedDuration = d
          store.startSession()
          expect(store.arcProgress).toBe(1)
          clearInterval(store.intervalId!)
        }),
        { numRuns: 100 }
      )
    })

    // Property 15: Arc progress depletes monotonically during countdown
    // Validates: Requirements 11.2, 11.5
    it('Property 15: Arc progress depletes monotonically during countdown', () => {
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 60 }), (d) => {
          const store = useZenStore()
          store.selectedDuration = d
          store.startSession()
          let previousProgress = store.arcProgress
          for (let i = 0; i < d * 60; i++) {
            store.remainingSeconds -= 1
            const currentProgress = store.arcProgress
            expect(currentProgress).toBeLessThanOrEqual(previousProgress)
            expect(currentProgress).toBeGreaterThanOrEqual(0)
            previousProgress = currentProgress
          }
          clearInterval(store.intervalId!)
        }),
        { numRuns: 10 } // Reduced runs due to loop overhead
      )
    })

    // Property 16: Arc progress is 0.0 when timer reaches zero
    // Validates: Requirements 11.4
    it('Property 16: Arc progress is 0.0 when timer reaches zero', () => {
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 60 }), (d) => {
          const store = useZenStore()
          store.selectedDuration = d
          store.startSession()
          store.remainingSeconds = 0
          expect(store.arcProgress).toBe(0)
          clearInterval(store.intervalId!)
        }),
        { numRuns: 100 }
      )
    })

    // Property 17: Arc progress equals remaining/total ratio
    // Validates: Requirements 11.2
    it('Property 17: Arc progress equals remaining/total ratio', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 60 }),
          fc.integer({ min: 0, max: 3600 }),
          (d, remaining) => {
            const store = useZenStore()
            store.selectedDuration = d
            store.startSession()
            store.remainingSeconds = Math.min(remaining, d * 60)
            const expected = store.remainingSeconds / store.totalSeconds
            expect(store.arcProgress).toBe(expected)
            clearInterval(store.intervalId!)
          }
        ),
        { numRuns: 100 }
      )
    })

    // Property 13: Preset highlight restored from persisted duration on launch
    // Validates: Requirements 10.4
    it('Property 13: Preset highlight restored from persisted duration on launch', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(10, 25, 50),
          (presetValue) => {
            const store = useZenStore()
            store.initFromConfig({ lastDurationMinutes: presetValue })
            const presetName = Object.entries(PRESETS).find(
              ([_, v]) => v === presetValue
            )?.[0]
            expect(store.activePreset).toBe(presetName)
          }
        ),
        { numRuns: 100 }
      )
    })
  })
})
