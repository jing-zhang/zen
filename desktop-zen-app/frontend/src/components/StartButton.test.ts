import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import StartButton from './StartButton.vue'
import { useZenStore } from '../stores/zenStore'

describe('StartButton.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should render with "Start" label when in idle mode', () => {
    const wrapper = mount(StartButton, {
      global: {
        plugins: [createPinia()],
      },
    })
    expect(wrapper.text()).toContain('Start')
  })

  it('should render with "Cancel" label when in zen mode', async () => {
    const wrapper = mount(StartButton, {
      global: {
        plugins: [createPinia()],
      },
    })
    const store = useZenStore()
    store.mode = 'zen'
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Cancel')
  })

  it('should apply "start" class when in idle mode', () => {
    const wrapper = mount(StartButton, {
      global: {
        plugins: [createPinia()],
      },
    })
    expect(wrapper.find('button').classes()).toContain('start')
  })

  it('should apply "cancel" class when in zen mode', async () => {
    const wrapper = mount(StartButton, {
      global: {
        plugins: [createPinia()],
      },
    })
    const store = useZenStore()
    store.mode = 'zen'
    await wrapper.vm.$nextTick()
    expect(wrapper.find('button').classes()).toContain('cancel')
  })

  it('should be disabled when duration is below minimum (< 1)', async () => {
    const wrapper = mount(StartButton, {
      global: {
        plugins: [createPinia()],
      },
    })
    const store = useZenStore()
    store.selectedDuration = 0
    await wrapper.vm.$nextTick()
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('should be disabled when duration is above maximum (> 60)', async () => {
    const wrapper = mount(StartButton, {
      global: {
        plugins: [createPinia()],
      },
    })
    const store = useZenStore()
    store.selectedDuration = 61
    await wrapper.vm.$nextTick()
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('should be disabled when duration is not an integer', async () => {
    const wrapper = mount(StartButton, {
      global: {
        plugins: [createPinia()],
      },
    })
    const store = useZenStore()
    store.selectedDuration = 25.5
    await wrapper.vm.$nextTick()
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('should be enabled when duration is valid and in idle mode', async () => {
    const wrapper = mount(StartButton, {
      global: {
        plugins: [createPinia()],
      },
    })
    const store = useZenStore()
    store.selectedDuration = 25
    store.mode = 'idle'
    await wrapper.vm.$nextTick()
    expect(wrapper.find('button').attributes('disabled')).toBeUndefined()
  })

  it('should be enabled when in zen mode regardless of duration', async () => {
    const wrapper = mount(StartButton, {
      global: {
        plugins: [createPinia()],
      },
    })
    const store = useZenStore()
    store.mode = 'zen'
    store.selectedDuration = 0 // Invalid duration
    await wrapper.vm.$nextTick()
    expect(wrapper.find('button').attributes('disabled')).toBeUndefined()
  })

  it('should call startSession when clicked in idle mode', async () => {
    const wrapper = mount(StartButton, {
      global: {
        plugins: [createPinia()],
      },
    })
    const store = useZenStore()
    store.selectedDuration = 25
    store.mode = 'idle'
    vi.spyOn(store, 'startSession')
    await wrapper.vm.$nextTick()
    await wrapper.find('button').trigger('click')
    expect(store.startSession).toHaveBeenCalled()
  })

  it('should call cancelSession when clicked in zen mode', async () => {
    const wrapper = mount(StartButton, {
      global: {
        plugins: [createPinia()],
      },
    })
    const store = useZenStore()
    store.mode = 'zen'
    vi.spyOn(store, 'cancelSession')
    await wrapper.vm.$nextTick()
    await wrapper.find('button').trigger('click')
    expect(store.cancelSession).toHaveBeenCalled()
  })

  it('should not call any handler when disabled and clicked', async () => {
    const wrapper = mount(StartButton, {
      global: {
        plugins: [createPinia()],
      },
    })
    const store = useZenStore()
    store.selectedDuration = 0 // Invalid
    store.mode = 'idle'
    vi.spyOn(store, 'startSession')
    await wrapper.vm.$nextTick()
    await wrapper.find('button').trigger('click')
    expect(store.startSession).not.toHaveBeenCalled()
  })

  it('should have correct button styling classes', () => {
    const wrapper = mount(StartButton, {
      global: {
        plugins: [createPinia()],
      },
    })
    expect(wrapper.find('button').classes()).toContain('start-button')
  })

  it('should update label when mode changes from idle to zen', async () => {
    const wrapper = mount(StartButton, {
      global: {
        plugins: [createPinia()],
      },
    })
    const store = useZenStore()
    expect(wrapper.text()).toContain('Start')
    store.mode = 'zen'
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Cancel')
  })

  it('should update label when mode changes from zen to idle', async () => {
    const wrapper = mount(StartButton, {
      global: {
        plugins: [createPinia()],
      },
    })
    const store = useZenStore()
    store.mode = 'zen'
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Cancel')
    store.mode = 'idle'
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Start')
  })

  it('should handle boundary duration values correctly', async () => {
    const wrapper = mount(StartButton, {
      global: {
        plugins: [createPinia()],
      },
    })
    const store = useZenStore()
    store.mode = 'idle'

    // Test minimum valid duration
    store.selectedDuration = 1
    await wrapper.vm.$nextTick()
    expect(wrapper.find('button').attributes('disabled')).toBeUndefined()

    // Test maximum valid duration
    store.selectedDuration = 60
    await wrapper.vm.$nextTick()
    expect(wrapper.find('button').attributes('disabled')).toBeUndefined()
  })
})
