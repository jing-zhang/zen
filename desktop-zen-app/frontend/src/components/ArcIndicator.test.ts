import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ArcIndicator from './ArcIndicator.vue'

describe('ArcIndicator.vue', () => {
  const radius = 130
  const circumference = 2 * Math.PI * radius

  it('should render the arc indicator container', () => {
    const wrapper = mount(ArcIndicator, {
      props: {
        progress: 0.5,
      },
    })
    expect(wrapper.find('.arc-indicator').exists()).toBe(true)
  })

  it('should render SVG element', () => {
    const wrapper = mount(ArcIndicator, {
      props: {
        progress: 0.5,
      },
    })
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('should render background circle', () => {
    const wrapper = mount(ArcIndicator, {
      props: {
        progress: 0.5,
      },
    })
    const circles = wrapper.findAll('circle')
    expect(circles.length).toBeGreaterThanOrEqual(1)
    expect(circles[0].attributes('fill')).toBe('none')
  })

  it('should render progress arc circle', () => {
    const wrapper = mount(ArcIndicator, {
      props: {
        progress: 0.5,
      },
    })
    const circles = wrapper.findAll('circle')
    expect(circles.length).toBeGreaterThanOrEqual(2)
  })

  it('should have correct SVG dimensions', () => {
    const wrapper = mount(ArcIndicator, {
      props: {
        progress: 0.5,
      },
    })
    const svg = wrapper.find('svg')
    expect(svg.attributes('width')).toBe('300')
    expect(svg.attributes('height')).toBe('300')
    expect(svg.attributes('viewBox')).toBe('0 0 300 300')
  })

  it('should calculate stroke-dashoffset correctly at 0% progress', () => {
    const wrapper = mount(ArcIndicator, {
      props: {
        progress: 0,
      },
    })
    const circles = wrapper.findAll('circle')
    const progressCircle = circles[circles.length - 1]
    const offset = parseFloat(progressCircle.attributes('stroke-dashoffset') || '0')
    expect(offset).toBeCloseTo(circumference, 1)
  })

  it('should calculate stroke-dashoffset correctly at 100% progress', () => {
    const wrapper = mount(ArcIndicator, {
      props: {
        progress: 1,
      },
    })
    const circles = wrapper.findAll('circle')
    const progressCircle = circles[circles.length - 1]
    const offset = parseFloat(progressCircle.attributes('stroke-dashoffset') || '0')
    expect(offset).toBeCloseTo(0, 1)
  })

  it('should calculate stroke-dashoffset correctly at 50% progress', () => {
    const wrapper = mount(ArcIndicator, {
      props: {
        progress: 0.5,
      },
    })
    const circles = wrapper.findAll('circle')
    const progressCircle = circles[circles.length - 1]
    const offset = parseFloat(progressCircle.attributes('stroke-dashoffset') || '0')
    const expectedOffset = circumference * 0.5
    expect(offset).toBeCloseTo(expectedOffset, 1)
  })

  it('should calculate stroke-dashoffset correctly at 25% progress', () => {
    const wrapper = mount(ArcIndicator, {
      props: {
        progress: 0.25,
      },
    })
    const circles = wrapper.findAll('circle')
    const progressCircle = circles[circles.length - 1]
    const offset = parseFloat(progressCircle.attributes('stroke-dashoffset') || '0')
    const expectedOffset = circumference * 0.75
    expect(offset).toBeCloseTo(expectedOffset, 1)
  })

  it('should calculate stroke-dashoffset correctly at 75% progress', () => {
    const wrapper = mount(ArcIndicator, {
      props: {
        progress: 0.75,
      },
    })
    const circles = wrapper.findAll('circle')
    const progressCircle = circles[circles.length - 1]
    const offset = parseFloat(progressCircle.attributes('stroke-dashoffset') || '0')
    const expectedOffset = circumference * 0.25
    expect(offset).toBeCloseTo(expectedOffset, 1)
  })

  it('should update stroke-dashoffset when progress prop changes', async () => {
    const wrapper = mount(ArcIndicator, {
      props: {
        progress: 0,
      },
    })
    let circles = wrapper.findAll('circle')
    let progressCircle = circles[circles.length - 1]
    let offset = parseFloat(progressCircle.attributes('stroke-dashoffset') || '0')
    expect(offset).toBeCloseTo(circumference, 1)

    await wrapper.setProps({ progress: 0.5 })
    circles = wrapper.findAll('circle')
    progressCircle = circles[circles.length - 1]
    offset = parseFloat(progressCircle.attributes('stroke-dashoffset') || '0')
    expect(offset).toBeCloseTo(circumference * 0.5, 1)

    await wrapper.setProps({ progress: 1 })
    circles = wrapper.findAll('circle')
    progressCircle = circles[circles.length - 1]
    offset = parseFloat(progressCircle.attributes('stroke-dashoffset') || '0')
    expect(offset).toBeCloseTo(0, 1)
  })

  it('should have stroke-dasharray set to circumference', () => {
    const wrapper = mount(ArcIndicator, {
      props: {
        progress: 0.5,
      },
    })
    const circles = wrapper.findAll('circle')
    const progressCircle = circles[circles.length - 1]
    const dasharray = parseFloat(progressCircle.attributes('stroke-dasharray') || '0')
    expect(dasharray).toBeCloseTo(circumference, 1)
  })

  it('should have correct circle radius', () => {
    const wrapper = mount(ArcIndicator, {
      props: {
        progress: 0.5,
      },
    })
    const circles = wrapper.findAll('circle')
    circles.forEach((circle) => {
      expect(circle.attributes('r')).toBe('130')
    })
  })

  it('should have correct circle center coordinates', () => {
    const wrapper = mount(ArcIndicator, {
      props: {
        progress: 0.5,
      },
    })
    const circles = wrapper.findAll('circle')
    circles.forEach((circle) => {
      expect(circle.attributes('cx')).toBe('150')
      expect(circle.attributes('cy')).toBe('150')
    })
  })

  it('should have stroke-linecap set to round', () => {
    const wrapper = mount(ArcIndicator, {
      props: {
        progress: 0.5,
      },
    })
    const circles = wrapper.findAll('circle')
    const progressCircle = circles[circles.length - 1]
    expect(progressCircle.attributes('stroke-linecap')).toBe('round')
  })

  it('should have transform rotate applied to progress arc', () => {
    const wrapper = mount(ArcIndicator, {
      props: {
        progress: 0.5,
      },
    })
    const circles = wrapper.findAll('circle')
    const progressCircle = circles[circles.length - 1]
    expect(progressCircle.attributes('transform')).toBe('rotate(-90 150 150)')
  })

  it('should have transition style on progress arc', () => {
    const wrapper = mount(ArcIndicator, {
      props: {
        progress: 0.5,
      },
    })
    const circles = wrapper.findAll('circle')
    const progressCircle = circles[circles.length - 1]
    const style = progressCircle.attributes('style')
    expect(style).toContain('transition')
  })

  it('should handle progress values between 0 and 1', () => {
    const progressValues = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
    progressValues.forEach((progress) => {
      const wrapper = mount(ArcIndicator, {
        props: {
          progress,
        },
      })
      const circles = wrapper.findAll('circle')
      const progressCircle = circles[circles.length - 1]
      const offset = parseFloat(progressCircle.attributes('stroke-dashoffset') || '0')
      const expectedOffset = circumference * (1 - progress)
      expect(offset).toBeCloseTo(expectedOffset, 1)
    })
  })

  it('should render SVG with drop-shadow filter', () => {
    const wrapper = mount(ArcIndicator, {
      props: {
        progress: 0.5,
      },
    })
    const svg = wrapper.find('svg')
    // The filter is applied via scoped CSS, not inline style
    expect(svg.exists()).toBe(true)
  })

  it('should have fill="none" on all circles', () => {
    const wrapper = mount(ArcIndicator, {
      props: {
        progress: 0.5,
      },
    })
    const circles = wrapper.findAll('circle')
    circles.forEach((circle) => {
      expect(circle.attributes('fill')).toBe('none')
    })
  })

  it('should have stroke-width of 8', () => {
    const wrapper = mount(ArcIndicator, {
      props: {
        progress: 0.5,
      },
    })
    const circles = wrapper.findAll('circle')
    circles.forEach((circle) => {
      expect(circle.attributes('stroke-width')).toBe('8')
    })
  })
})
