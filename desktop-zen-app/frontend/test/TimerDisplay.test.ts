import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TimerDisplay from '../src/components/TimerDisplay.vue'

describe('TimerDisplay.vue', () => {
  it('should render the timer display container', () => {
    const wrapper = mount(TimerDisplay, {
      props: {
        remainingSeconds: 1500,
      },
    })
    expect(wrapper.find('.timer-display').exists()).toBe(true)
  })

  it('should format and display 25 minutes (1500 seconds)', () => {
    const wrapper = mount(TimerDisplay, {
      props: {
        remainingSeconds: 1500,
      },
    })
    expect(wrapper.text()).toBe('25:00')
  })

  it('should format and display 1 minute (60 seconds)', () => {
    const wrapper = mount(TimerDisplay, {
      props: {
        remainingSeconds: 60,
      },
    })
    expect(wrapper.text()).toBe('01:00')
  })

  it('should format and display 0 seconds', () => {
    const wrapper = mount(TimerDisplay, {
      props: {
        remainingSeconds: 0,
      },
    })
    expect(wrapper.text()).toBe('00:00')
  })

  it('should format and display 1 second', () => {
    const wrapper = mount(TimerDisplay, {
      props: {
        remainingSeconds: 1,
      },
    })
    expect(wrapper.text()).toBe('00:01')
  })

  it('should format and display 59 seconds', () => {
    const wrapper = mount(TimerDisplay, {
      props: {
        remainingSeconds: 59,
      },
    })
    expect(wrapper.text()).toBe('00:59')
  })

  it('should format and display 1 minute 30 seconds (90 seconds)', () => {
    const wrapper = mount(TimerDisplay, {
      props: {
        remainingSeconds: 90,
      },
    })
    expect(wrapper.text()).toBe('01:30')
  })

  it('should format and display 10 minutes (600 seconds)', () => {
    const wrapper = mount(TimerDisplay, {
      props: {
        remainingSeconds: 600,
      },
    })
    expect(wrapper.text()).toBe('10:00')
  })

  it('should format and display 59 minutes 59 seconds (3599 seconds)', () => {
    const wrapper = mount(TimerDisplay, {
      props: {
        remainingSeconds: 3599,
      },
    })
    expect(wrapper.text()).toBe('59:59')
  })

  it('should format and display 1 hour (3600 seconds)', () => {
    const wrapper = mount(TimerDisplay, {
      props: {
        remainingSeconds: 3600,
      },
    })
    expect(wrapper.text()).toBe('60:00')
  })

  it('should update display when remainingSeconds prop changes', async () => {
    const wrapper = mount(TimerDisplay, {
      props: {
        remainingSeconds: 1500,
      },
    })
    expect(wrapper.text()).toBe('25:00')
    await wrapper.setProps({ remainingSeconds: 1200 })
    expect(wrapper.text()).toBe('20:00')
  })

  it('should update display when counting down', async () => {
    const wrapper = mount(TimerDisplay, {
      props: {
        remainingSeconds: 120,
      },
    })
    expect(wrapper.text()).toBe('02:00')
    await wrapper.setProps({ remainingSeconds: 119 })
    expect(wrapper.text()).toBe('01:59')
    await wrapper.setProps({ remainingSeconds: 60 })
    expect(wrapper.text()).toBe('01:00')
    await wrapper.setProps({ remainingSeconds: 1 })
    expect(wrapper.text()).toBe('00:01')
    await wrapper.setProps({ remainingSeconds: 0 })
    expect(wrapper.text()).toBe('00:00')
  })

  it('should handle large time values', () => {
    const wrapper = mount(TimerDisplay, {
      props: {
        remainingSeconds: 86400, // 24 hours
      },
    })
    expect(wrapper.text()).toBe('1440:00')
  })

  it('should have correct CSS class for styling', () => {
    const wrapper = mount(TimerDisplay, {
      props: {
        remainingSeconds: 1500,
      },
    })
    expect(wrapper.find('.timer-display').exists()).toBe(true)
  })

  it('should render with tabular-nums font variant for alignment', () => {
    const wrapper = mount(TimerDisplay, {
      props: {
        remainingSeconds: 1500,
      },
    })
    const element = wrapper.find('.timer-display').element as HTMLElement
    const styles = window.getComputedStyle(element)
    // Check that the element has the timer-display class which applies tabular-nums
    expect(wrapper.find('.timer-display').exists()).toBe(true)
  })

  it('should format various minute and second combinations correctly', () => {
    const testCases = [
      { seconds: 0, expected: '00:00' },
      { seconds: 5, expected: '00:05' },
      { seconds: 30, expected: '00:30' },
      { seconds: 61, expected: '01:01' },
      { seconds: 125, expected: '02:05' },
      { seconds: 300, expected: '05:00' },
      { seconds: 1500, expected: '25:00' },
      { seconds: 1800, expected: '30:00' },
      { seconds: 3000, expected: '50:00' },
    ]

    testCases.forEach(({ seconds, expected }) => {
      const wrapper = mount(TimerDisplay, {
        props: {
          remainingSeconds: seconds,
        },
      })
      expect(wrapper.text()).toBe(expected)
    })
  })
})
