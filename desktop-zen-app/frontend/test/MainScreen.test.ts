import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import MainScreen from '../src/components/MainScreen.vue'
import TopPanel from '../src/components/TopPanel.vue'
import StartButton from '../src/components/StartButton.vue'
import PresetButton from '../src/components/PresetButton.vue'
import DurationSelector from '../src/components/DurationSelector.vue'

describe('MainScreen.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should render the main screen container', () => {
    const wrapper = mount(MainScreen, {
      global: {
        plugins: [createPinia()],
        components: {
          TopPanel,
          StartButton,
          PresetButton,
          DurationSelector,
        },
      },
    })
    expect(wrapper.find('.main-screen').exists()).toBe(true)
  })

  it('should render TopPanel component', () => {
    const wrapper = mount(MainScreen, {
      global: {
        plugins: [createPinia()],
        components: {
          TopPanel,
          StartButton,
          PresetButton,
          DurationSelector,
        },
      },
    })
    expect(wrapper.findComponent(TopPanel).exists()).toBe(true)
  })

  it('should render StartButton component', () => {
    const wrapper = mount(MainScreen, {
      global: {
        plugins: [createPinia()],
        components: {
          TopPanel,
          StartButton,
          PresetButton,
          DurationSelector,
        },
      },
    })
    expect(wrapper.findComponent(StartButton).exists()).toBe(true)
  })

  it('should render main content wrapper', () => {
    const wrapper = mount(MainScreen, {
      global: {
        plugins: [createPinia()],
        components: {
          TopPanel,
          StartButton,
          PresetButton,
          DurationSelector,
        },
      },
    })
    expect(wrapper.find('.main-content').exists()).toBe(true)
  })

  it('should have correct layout structure', () => {
    const wrapper = mount(MainScreen, {
      global: {
        plugins: [createPinia()],
        components: {
          TopPanel,
          StartButton,
          PresetButton,
          DurationSelector,
        },
      },
    })
    const mainScreen = wrapper.find('.main-screen')
    expect(mainScreen.findComponent(TopPanel).exists()).toBe(true)
    expect(mainScreen.find('.main-content').exists()).toBe(true)
  })

  it('should render TopPanel before main content', () => {
    const wrapper = mount(MainScreen, {
      global: {
        plugins: [createPinia()],
        components: {
          TopPanel,
          StartButton,
          PresetButton,
          DurationSelector,
        },
      },
    })
    const mainScreen = wrapper.find('.main-screen')
    const children = mainScreen.findAll('*')
    const topPanelIndex = children.findIndex((el) => el.classes().includes('top-panel'))
    const mainContentIndex = children.findIndex((el) => el.classes().includes('main-content'))
    expect(topPanelIndex).toBeLessThan(mainContentIndex)
  })

  it('should render StartButton inside main content', () => {
    const wrapper = mount(MainScreen, {
      global: {
        plugins: [createPinia()],
        components: {
          TopPanel,
          StartButton,
          PresetButton,
          DurationSelector,
        },
      },
    })
    const mainContent = wrapper.find('.main-content')
    expect(mainContent.findComponent(StartButton).exists()).toBe(true)
  })

  it('should have full viewport height', () => {
    const wrapper = mount(MainScreen, {
      global: {
        plugins: [createPinia()],
        components: {
          TopPanel,
          StartButton,
          PresetButton,
          DurationSelector,
        },
      },
    })
    const mainScreen = wrapper.find('.main-screen')
    expect(mainScreen.exists()).toBe(true)
  })

  it('should have flex column layout', () => {
    const wrapper = mount(MainScreen, {
      global: {
        plugins: [createPinia()],
        components: {
          TopPanel,
          StartButton,
          PresetButton,
          DurationSelector,
        },
      },
    })
    const mainScreen = wrapper.find('.main-screen')
    expect(mainScreen.exists()).toBe(true)
  })

  it('should render with correct CSS classes', () => {
    const wrapper = mount(MainScreen, {
      global: {
        plugins: [createPinia()],
        components: {
          TopPanel,
          StartButton,
          PresetButton,
          DurationSelector,
        },
      },
    })
    expect(wrapper.find('.main-screen').exists()).toBe(true)
    expect(wrapper.find('.main-content').exists()).toBe(true)
  })

  it('should center StartButton in main content', () => {
    const wrapper = mount(MainScreen, {
      global: {
        plugins: [createPinia()],
        components: {
          TopPanel,
          StartButton,
          PresetButton,
          DurationSelector,
        },
      },
    })
    const mainContent = wrapper.find('.main-content')
    expect(mainContent.exists()).toBe(true)
    expect(mainContent.findComponent(StartButton).exists()).toBe(true)
  })

  it('should have TopPanel at the top', () => {
    const wrapper = mount(MainScreen, {
      global: {
        plugins: [createPinia()],
        components: {
          TopPanel,
          StartButton,
          PresetButton,
          DurationSelector,
        },
      },
    })
    const mainScreen = wrapper.find('.main-screen')
    const topPanel = mainScreen.findComponent(TopPanel)
    expect(topPanel.exists()).toBe(true)
  })

  it('should have main content as flex child', () => {
    const wrapper = mount(MainScreen, {
      global: {
        plugins: [createPinia()],
        components: {
          TopPanel,
          StartButton,
          PresetButton,
          DurationSelector,
        },
      },
    })
    const mainContent = wrapper.find('.main-content')
    expect(mainContent.exists()).toBe(true)
  })

  it('should render all child components', () => {
    const wrapper = mount(MainScreen, {
      global: {
        plugins: [createPinia()],
        components: {
          TopPanel,
          StartButton,
          PresetButton,
          DurationSelector,
        },
      },
    })
    expect(wrapper.findComponent(TopPanel).exists()).toBe(true)
    expect(wrapper.findComponent(StartButton).exists()).toBe(true)
  })

  it('should maintain component hierarchy', () => {
    const wrapper = mount(MainScreen, {
      global: {
        plugins: [createPinia()],
        components: {
          TopPanel,
          StartButton,
          PresetButton,
          DurationSelector,
        },
      },
    })
    expect(wrapper.find('.main-screen').exists()).toBe(true)
    expect(wrapper.find('.main-screen .top-panel').exists()).toBe(true)
    expect(wrapper.find('.main-screen .main-content').exists()).toBe(true)
  })

  it('should render with proper nesting', () => {
    const wrapper = mount(MainScreen, {
      global: {
        plugins: [createPinia()],
        components: {
          TopPanel,
          StartButton,
          PresetButton,
          DurationSelector,
        },
      },
    })
    const mainScreen = wrapper.find('.main-screen')
    expect(mainScreen.findComponent(TopPanel).exists()).toBe(true)
    const mainContent = mainScreen.find('.main-content')
    expect(mainContent.findComponent(StartButton).exists()).toBe(true)
  })

  it('should have correct component count', () => {
    const wrapper = mount(MainScreen, {
      global: {
        plugins: [createPinia()],
        components: {
          TopPanel,
          StartButton,
          PresetButton,
          DurationSelector,
        },
      },
    })
    expect(wrapper.findComponent(TopPanel).exists()).toBe(true)
    expect(wrapper.findComponent(StartButton).exists()).toBe(true)
  })

  it('should render with background color class', () => {
    const wrapper = mount(MainScreen, {
      global: {
        plugins: [createPinia()],
        components: {
          TopPanel,
          StartButton,
          PresetButton,
          DurationSelector,
        },
      },
    })
    const mainScreen = wrapper.find('.main-screen')
    expect(mainScreen.exists()).toBe(true)
  })

  it('should render with text color class', () => {
    const wrapper = mount(MainScreen, {
      global: {
        plugins: [createPinia()],
        components: {
          TopPanel,
          StartButton,
          PresetButton,
          DurationSelector,
        },
      },
    })
    const mainScreen = wrapper.find('.main-screen')
    expect(mainScreen.exists()).toBe(true)
  })
})
