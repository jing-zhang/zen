import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DurationSelector from './DurationSelector.vue'

describe('DurationSelector.vue', () => {
  it('should render the label', () => {
    const wrapper = mount(DurationSelector, {
      props: {
        modelValue: 25,
      },
    })
    expect(wrapper.text()).toContain('Duration (min):')
  })

  it('should display the current modelValue', () => {
    const wrapper = mount(DurationSelector, {
      props: {
        modelValue: 30,
      },
    })
    const input = wrapper.find('input')
    expect(input.element.value).toBe('30')
  })

  it('should update displayed value when modelValue prop changes', async () => {
    const wrapper = mount(DurationSelector, {
      props: {
        modelValue: 25,
      },
    })
    await wrapper.setProps({ modelValue: 35 })
    const input = wrapper.find('input')
    expect(input.element.value).toBe('35')
  })

  it('should emit update:modelValue on input change', async () => {
    const wrapper = mount(DurationSelector, {
      props: {
        modelValue: 25,
      },
    })
    const input = wrapper.find('input')
    await input.setValue('30')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([30])
  })

  it('should clamp value to min (1) on blur', async () => {
    const wrapper = mount(DurationSelector, {
      props: {
        modelValue: 25,
      },
    })
    const input = wrapper.find('input')
    await input.setValue('0')
    await input.trigger('blur')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted?.[emitted.length - 1]).toEqual([1])
  })

  it('should clamp value to max (60) on blur', async () => {
    const wrapper = mount(DurationSelector, {
      props: {
        modelValue: 25,
      },
    })
    const input = wrapper.find('input')
    await input.setValue('100')
    await input.trigger('blur')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted?.[emitted.length - 1]).toEqual([60])
  })

  it('should clamp value to min (1) on change', async () => {
    const wrapper = mount(DurationSelector, {
      props: {
        modelValue: 25,
      },
    })
    const input = wrapper.find('input')
    await input.setValue('-5')
    await input.trigger('change')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted?.[emitted.length - 1]).toEqual([1])
  })

  it('should clamp value to max (60) on change', async () => {
    const wrapper = mount(DurationSelector, {
      props: {
        modelValue: 25,
      },
    })
    const input = wrapper.find('input')
    await input.setValue('120')
    await input.trigger('change')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted?.[emitted.length - 1]).toEqual([60])
  })

  it('should default to 25 when NaN is entered on blur', async () => {
    const wrapper = mount(DurationSelector, {
      props: {
        modelValue: 25,
      },
    })
    const input = wrapper.find('input')
    await input.setValue('')
    await input.trigger('blur')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted?.[emitted.length - 1]).toEqual([25])
  })

  it('should default to 25 when NaN is entered on change', async () => {
    const wrapper = mount(DurationSelector, {
      props: {
        modelValue: 25,
      },
    })
    const input = wrapper.find('input')
    await input.setValue('')
    await input.trigger('change')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted?.[emitted.length - 1]).toEqual([25])
  })

  it('should have correct input attributes', () => {
    const wrapper = mount(DurationSelector, {
      props: {
        modelValue: 25,
      },
    })
    const input = wrapper.find('input')
    expect(input.attributes('type')).toBe('number')
    expect(input.attributes('min')).toBe('1')
    expect(input.attributes('max')).toBe('60')
    expect(input.attributes('id')).toBe('duration-input')
  })

  it('should accept valid duration values', async () => {
    const wrapper = mount(DurationSelector, {
      props: {
        modelValue: 25,
      },
    })
    const validValues = [1, 15, 25, 45, 60]
    for (const value of validValues) {
      await wrapper.setProps({ modelValue: value })
      const input = wrapper.find('input')
      expect(input.element.value).toBe(String(value))
    }
  })
})
