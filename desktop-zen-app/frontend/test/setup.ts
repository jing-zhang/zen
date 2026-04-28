import { vi } from 'vitest'

// Mock Wails bindings - use vi.mock with inline factory
vi.mock('../../wailsjs/go/main/App', () => {
  return {
    LoadConfig: vi.fn().mockResolvedValue({}),
    SaveConfig: vi.fn().mockResolvedValue({}),
    SessionComplete: vi.fn().mockResolvedValue({}),
    SessionCancelled: vi.fn().mockResolvedValue({}),
  }
})

vi.mock('../../wailsjs/go/models', () => {
  return {
    main: {
      AppConfig: class AppConfig {
        lastDurationMinutes = 25
      },
    },
  }
})
