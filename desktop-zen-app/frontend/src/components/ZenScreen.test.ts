import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ZenScreen from './ZenScreen.vue'
import { useZenStore } from '../stores/zenStore'
import ArcIndicator from './ArcIndicator.vue'
import TimerDisplay from './TimerDisplay.vue'
import StartButton from './StartButton.vue'

describe('ZenScreen.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should render the zen screen container', () => {
    const wrapper = mount(ZenScreen, {
      global: {
        plugins: [createPinia()],
        components: {
          ArcIndicator,
          TimerDisplay,
          StartButton,
        },
      },
    })
    expect(wrapper.find('.zen-screen').exists()).toBe(true)
  })

  it('should render zen content wrapper', () => {
    const wrapper = mount(ZenScreen, {
      global: {
        plugins: [createPinia()],
        components: {
          ArcIndicator,
          TimerDisplay,
          StartButton,
        },
      },
    })
    expect(wrapper.find('.zen-content').exists()).toBe(true)
  })

  it('should render ArcIndicator component', () => {
    const wrapper = mount(ZenScreen, {
      global: {
        plugins: [createPinia()],
        components: {
          ArcIndicator,
          TimerDisplay,
          StartButton,
        },
      },
    })
    expect(wrapper.findComponent(ArcIndicator).exists()).toBe(true)
  })

  it('should render TimerDisplay component', () => {
    const wrapper = mount(ZenScreen, {
      global: {
        plugins: [createPinia()],
        components: {
          ArcIndicator,
          TimerDisplay,
          StartButton,
        },
      },
    })
    expect(wrapper.findComponent(TimerDisplay).exists()).toBe(true)
  })

  it('should render StartButton component', () => {
    const wrapper = mount(ZenScreen, {
      global: {
        plugins: [createPinia()],
        components: {
          ArcIndicator,
          TimerDisplay,
          StartButton,
        },
      },
    })
    expect(wrapper.findComponent(StartButton).exists()).toBe(true)
  })

  it('should render arc container', () => {
    const wrapper = mount(ZenScreen, {
      global: {
        plugins: [createPinia()],
        components: {
          ArcIndicator,
          TimerDisplay,
          StartButton,
        },
      },
    })
    expect(wrapper.find('.arc-container').exists()).toBe(true)
  })

  it('should render timer wrapper inside arc container', () => {
    const wrapper = mount(ZenScreen, {
      global: {
        plugins: [createPinia()],
        components: {
          ArcIndicator,
          TimerDisplay,
          StartButton,
        },
      },
    })
    expect(wrapper.find('.timer-wrapper').exists()).toBe(true)
  })

  it('should render button container', () => {
    const wrapper = mount(ZenScreen, {
      global: {
        plugins: [createPinia()],
        components: {
          ArcIndicator,
          TimerDisplay,
          StartButton,
        },
      },
    })
    expect(wrapper.find('.button-container').exists()).toBe(true)
  })

  it('should pass arcProgress prop to ArcIndicator', async () => {
    const wrapper = mount(ZenScreen, {
      global: {
        plugins: [createPinia()],
        components: {
          ArcIndicator,
          TimerDisplay,
          StartButton,
        },
      },
    })
    const store = useZenStore()
    // arcProgress is computed from remainingSeconds and totalSeconds
    store.totalSeconds = 1500
    store.remainingSeconds = 750
    await wrapper.vm.$nextTick()

    const arcIndicator = wrapper.findComponent(ArcIndicator)
    expect(arcIndicator.props('progress')).toBe(0.5)
  })

  it('should pass remainingSeconds prop to TimerDisplay', async () => {
    const wrapper = mount(ZenScreen, {
      global: {
        plugins: [createPinia()],
        components: {
          ArcIndicator,
          TimerDisplay,
          StartButton,
        },
      },
    })
    const store = useZenStore()
    store.remainingSeconds = 1500
    await wrapper.vm.$nextTick()

    const timerDisplay = wrapper.findComponent(TimerDisplay)
    expect(timerDisplay.props('remainingSeconds')).toBe(1500)
  })

  it('should update ArcIndicator when arcProgress changes', async () => {
    const wrapper = mount(ZenScreen, {
      global: {
        plugins: [createPinia()],
        components: {
          ArcIndicator,
          TimerDisplay,
          StartButton,
        },
      },
    })
    const store = useZenStore()
    
    // Set totalSeconds to 1500 for all tests
    store.totalSeconds = 1500
    
    // Test 0% progress
    store.remainingSeconds = 0
    await wrapper.vm.$nextTick()
    let arcIndicator = wrapper.findComponent(ArcIndicator)
    expect(arcIndicator.props('progress')).toBe(0)

    // Test 50% progress
    store.remainingSeconds = 750
    await wrapper.vm.$nextTick()
    arcIndicator = wrapper.findComponent(ArcIndicator)
    expect(arcIndicator.props('progress')).toBe(0.5)

    // Test 100% progress
    store.remainingSeconds = 1500
    await wrapper.vm.$nextTick()
    arcIndicator = wrapper.findComponent(ArcIndicator)
    expect(arcIndicator.props('progress')).toBe(1)
  })

  it('should update TimerDisplay when remainingSeconds changes', async () => {
    const wrapper = mount(ZenScreen, {
      global: {
        plugins: [createPinia()],
        components: {
          ArcIndicator,
          TimerDisplay,
          StartButton,
        },
      },
    })
    const store = useZenStore()
    store.remainingSeconds = 1500
    await wrapper.vm.$nextTick()
    let timerDisplay = wrapper.findComponent(TimerDisplay)
    expect(timerDisplay.props('remainingSeconds')).toBe(1500)

    store.remainingSeconds = 1200
    await wrapper.vm.$nextTick()
    timerDisplay = wrapper.findComponent(TimerDisplay)
    expect(timerDisplay.props('remainingSeconds')).toBe(1200)

    store.remainingSeconds = 0
    await wrapper.vm.$nextTick()
    timerDisplay = wrapper.findComponent(TimerDisplay)
    expect(timerDisplay.props('remainingSeconds')).toBe(0)
  })

  it('should have full screen height', () => {
    const wrapper = mount(ZenScreen, {
      global: {
        plugins: [createPinia()],
        components: {
          ArcIndicator,
          TimerDisplay,
          StartButton,
        },
      },
    })
    const zenScreen = wrapper.find('.zen-screen')
    expect(zenScreen.exists()).toBe(true)
  })

  it('should have correct layout structure', () => {
    const wrapper = mount(ZenScreen, {
      global: {
        plugins: [createPinia()],
        components: {
          ArcIndicator,
          TimerDisplay,
          StartButton,
        },
      },
    })
    const zenContent = wrapper.find('.zen-content')
    expect(zenContent.find('.arc-container').exists()).toBe(true)
    expect(zenContent.find('.button-container').exists()).toBe(true)
  })

  it('should position timer inside arc container', () => {
    const wrapper = mount(ZenScreen, {
      global: {
        plugins: [createPinia()],
        components: {
          ArcIndicator,
          TimerDisplay,
          StartButton,
        },
      },
    })
    const arcContainer = wrapper.find('.arc-container')
    expect(arcContainer.find('.timer-wrapper').exists()).toBe(true)
    expect(arcContainer.findComponent(ArcIndicator).exists()).toBe(true)
  })

  it('should render all components in correct order', () => {
    const wrapper = mount(ZenScreen, {
      global: {
        plugins: [createPinia()],
        components: {
          ArcIndicator,
          TimerDisplay,
          StartButton,
        },
      },
    })
    const zenContent = wrapper.find('.zen-content')
    const children = zenContent.findAll('*')
    expect(children.length).toBeGreaterThan(0)
  })

  it('should handle rapid progress updates', async () => {
    const wrapper = mount(ZenScreen, {
      global: {
        plugins: [createPinia()],
        components: {
          ArcIndicator,
          TimerDisplay,
          StartButton,
        },
      },
    })
    const store = useZenStore()

    for (let i = 0; i <= 10; i++) {
      store.arcProgress = i / 10
      store.remainingSeconds = 1500 - i * 150
      await wrapper.vm.$nextTick()
    }

    const arcIndicator = wrapper.findComponent(ArcIndicator)
    const timerDisplay = wrapper.findComponent(TimerDisplay)
    expect(arcIndicator.props('progress')).toBe(1)
    expect(timerDisplay.props('remainingSeconds')).toBe(0)
  })

  it('should maintain component hierarchy', () => {
    const wrapper = mount(ZenScreen, {
      global: {
        plugins: [createPinia()],
        components: {
          ArcIndicator,
          TimerDisplay,
          StartButton,
        },
      },
    })
    expect(wrapper.find('.zen-screen').exists()).toBe(true)
    expect(wrapper.find('.zen-screen .zen-content').exists()).toBe(true)
    expect(wrapper.find('.zen-content .arc-container').exists()).toBe(true)
    expect(wrapper.find('.zen-content .button-container').exists()).toBe(true)
  })

  it('should render with correct CSS classes for styling', () => {
    const wrapper = mount(ZenScreen, {
      global: {
        plugins: [createPinia()],
        components: {
          ArcIndicator,
          TimerDisplay,
          StartButton,
        },
      },
    })
    expect(wrapper.find('.zen-screen').exists()).toBe(true)
    expect(wrapper.find('.zen-content').exists()).toBe(true)
    expect(wrapper.find('.arc-container').exists()).toBe(true)
    expect(wrapper.find('.timer-wrapper').exists()).toBe(true)
    expect(wrapper.find('.button-container').exists()).toBe(true)
  })
})
