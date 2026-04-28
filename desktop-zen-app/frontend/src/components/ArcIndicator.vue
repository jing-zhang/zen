<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  progress: number // 0.0 to 1.0
}

const props = defineProps<Props>()

// SVG arc parameters
const size = 300
const radius = 130
const circumference = 2 * Math.PI * radius

// Compute stroke-dashoffset based on progress
// At progress = 1.0, offset = 0 (arc fully visible)
// At progress = 0.0, offset = circumference (arc fully hidden)
const strokeDashoffset = computed(() => {
  return circumference * (1 - props.progress)
})

// Center coordinates for the SVG
const cx = size / 2
const cy = size / 2
</script>

<template>
  <div class="arc-indicator">
    <svg :width="size" :height="size" viewBox="0 0 300 300">
      <!-- Background circle (faint) -->
      <circle
        :cx="cx"
        :cy="cy"
        :r="radius"
        fill="none"
        :stroke="'var(--arc-background)'"
        stroke-width="8"
      />

      <!-- Progress arc -->
      <circle
        :cx="cx"
        :cy="cy"
        :r="radius"
        fill="none"
        :stroke="'var(--arc-color)'"
        stroke-width="8"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="strokeDashoffset"
        style="transition: stroke-dashoffset 0.1s linear"
        transform="rotate(-90 150 150)"
      />
    </svg>
  </div>
</template>

<style scoped>
.arc-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

svg {
  filter: drop-shadow(0 0 20px rgba(74, 158, 255, 0.2));
}
</style>
