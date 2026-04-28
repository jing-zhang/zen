import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PresetButton from '../src/components/PresetButton.vue'

describe('PresetButton.vue', () => {
  it('should render the preset name', () => {
    const wrapper = mount(PresetButton, {
      props: {
        name: 'Study',
        isActive: false,
      },
    })
    expect(wrapper.text()).toContain('Study')
  })

  it('should apply active class when isActive is true', () => {
    const wrapper = mount(PresetButton, {
      props: {
        name: 'Study',
        isActive: true,
      },
    })
    expect(wrapper.find('button').classes()).toContain('active')
  })

  it('should not apply active class when isActive is false', () => {
    const wrapper = mount(PresetButton, {
      props: {
        name: 'Study',
        isActive: false,
      },
    })
    expect(wrapper.find('button').classes()).not.toContain('active')
  })

  it('should emit select event on click', async () => {
    const wrapper = mount(PresetButton, {
      props: {
        name: 'Study',
        isActive: false,
      },
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')).toHaveLength(1)
  })

  it('should render different preset names correctly', () => {
    const presets = ['Think', 'Study', 'Work']
    presets.forEach((preset) => {
      const wrapper = mount(PresetButton, {
        props: {
          name: preset,
          isActive: false,
        },
      })
      expect(wrapper.text()).toContain(preset)
    })
  })
})
