import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import TopPanel from './TopPanel.vue'
import { useZenStore } from '../stores/zenStore'
import PresetButton from './PresetButton.vue'
import DurationSelector from './DurationSelector.vue'

describe('TopPanel.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should render the top panel container', () => {
    const wrapper = mount(TopPanel, {
      global: {
        plugins: [createPinia()],
        components: {
          PresetButton,
          DurationSelector,
        },
      },
    })
    expect(wrapper.find('.top-panel').exists()).toBe(true)
  })

  it('should render presets section', () => {
    const wrapper = mount(TopPanel, {
      global: {
        plugins: [createPinia()],
        components: {
          PresetButton,
          DurationSelector,
        },
      },
    })
    expect(wrapper.find('.presets').exists()).toBe(true)
  })

  it('should render DurationSelector component', () => {
    const wrapper = mount(TopPanel, {
      global: {
        plugins: [createPinia()],
        components: {
          PresetButton,
          DurationSelector,
        },
      },
    })
    expect(wrapper.findComponent(DurationSelector).exists()).toBe(true)
  })

  it('should render PresetButton components for each preset', () => {
    const wrapper = mount(TopPanel, {
      global: {
        plugins: [createPinia()],
        components: {
          PresetButton,
          DurationSelector,
        },
      },
    })
    const presetButtons = wrapper.findAllComponents(PresetButton)
    expect(presetButtons.length).toBeGreaterThan(0)
  })

  it('should pass correct props to PresetButton components', () => {
    const wrapper = mount(TopPanel, {
      global: {
        plugins: [createPinia()],
        components: {
          PresetButton,
          DurationSelector,
        },
      },
    })
    const presetButtons = wrapper.findAllComponents(PresetButton)
    presetButtons.forEach((button) => {
      expect(button.props('name')).toBeDefined()
      expect(button.props('isActive')).toBeDefined()
    })
  })

  it('should pass correct props to DurationSelector', () => {
    const wrapper = mount(TopPanel, {
      global: {
        plugins: [createPinia()],
        components: {
          PresetButton,
          DurationSelector,
        },
      },
    })
    const durationSelector = wrapper.findComponent(DurationSelector)
    expect(durationSelector.props('modelValue')).toBeDefined()
  })

  it('should call selectPreset when PresetButton emits select', async () => {
    const wrapper = mount(TopPanel, {
      global: {
        plugins: [createPinia()],
        components: {
          PresetButton,
          DurationSelector,
        },
      },
    })
    const store = useZenStore()
    vi.spyOn(store, 'selectPreset')

    const presetButtons = wrapper.findAllComponents(PresetButton)
    if (presetButtons.length > 0) {
      await presetButtons[0].vm.$emit('select')
      expect(store.selectPreset).toHaveBeenCalled()
    }
  })

  it('should call setCustomDuration when DurationSelector emits update', async () => {
    const wrapper = mount(TopPanel, {
      global: {
        plugins: [createPinia()],
        components: {
          PresetButton,
          DurationSelector,
        },
      },
    })
    const store = useZenStore()
    vi.spyOn(store, 'setCustomDuration')

    const durationSelector = wrapper.findComponent(DurationSelector)
    await durationSelector.vm.$emit('update:modelValue', 30)
    expect(store.setCustomDuration).toHaveBeenCalledWith(30)
  })

  it('should display active preset with isActive prop', async () => {
    const wrapper = mount(TopPanel, {
      global: {
        plugins: [createPinia()],
        components: {
          PresetButton,
          DurationSelector,
        },
      },
    })
    const store = useZenStore()
    store.activePreset = 'think'
    await wrapper.vm.$nextTick()

    const presetButtons = wrapper.findAllComponents(PresetButton)
    const activeButton = presetButtons.find((btn) => btn.props('isActive'))
    expect(activeButton).toBeDefined()
  })

  it('should update DurationSelector value from store', async () => {
    const wrapper = mount(TopPanel, {
      global: {
        plugins: [createPinia()],
        components: {
          PresetButton,
          DurationSelector,
        },
      },
    })
    const store = useZenStore()
    store.selectedDuration = 30
    await wrapper.vm.$nextTick()

    const durationSelector = wrapper.findComponent(DurationSelector)
    expect(durationSelector.props('modelValue')).toBe(30)
  })

  it('should have correct CSS classes for layout', () => {
    const wrapper = mount(TopPanel, {
      global: {
        plugins: [createPinia()],
        components: {
          PresetButton,
          DurationSelector,
        },
      },
    })
    expect(wrapper.find('.top-panel').exists()).toBe(true)
    expect(wrapper.find('.presets').exists()).toBe(true)
  })

  it('should render preset buttons with capitalized names', () => {
    const wrapper = mount(TopPanel, {
      global: {
        plugins: [createPinia()],
        components: {
          PresetButton,
          DurationSelector,
        },
      },
    })
    const presetButtons = wrapper.findAllComponents(PresetButton)
    presetButtons.forEach((button) => {
      const name = button.props('name')
      expect(name).toBe(name.charAt(0).toUpperCase() + name.slice(1))
    })
  })

  it('should handle multiple preset selections', async () => {
    const wrapper = mount(TopPanel, {
      global: {
        plugins: [createPinia()],
        components: {
          PresetButton,
          DurationSelector,
        },
      },
    })
    const store = useZenStore()
    vi.spyOn(store, 'selectPreset')

    const presetButtons = wrapper.findAllComponents(PresetButton)
    if (presetButtons.length >= 2) {
      await presetButtons[0].vm.$emit('select')
      await presetButtons[1].vm.$emit('select')
      expect(store.selectPreset).toHaveBeenCalledTimes(2)
    }
  })

  it('should handle duration changes', async () => {
    const wrapper = mount(TopPanel, {
      global: {
        plugins: [createPinia()],
        components: {
          PresetButton,
          DurationSelector,
        },
      },
    })
    const store = useZenStore()
    vi.spyOn(store, 'setCustomDuration')

    const durationSelector = wrapper.findComponent(DurationSelector)
    await durationSelector.vm.$emit('update:modelValue', 20)
    await durationSelector.vm.$emit('update:modelValue', 30)
    expect(store.setCustomDuration).toHaveBeenCalledTimes(2)
  })

  it('should render with correct structure', () => {
    const wrapper = mount(TopPanel, {
      global: {
        plugins: [createPinia()],
        components: {
          PresetButton,
          DurationSelector,
        },
      },
    })
    const topPanel = wrapper.find('.top-panel')
    expect(topPanel.find('.presets').exists()).toBe(true)
    expect(topPanel.findComponent(DurationSelector).exists()).toBe(true)
  })
})
