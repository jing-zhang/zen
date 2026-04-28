<script setup lang="ts">
import { formatTime } from '../stores/zenStore'

interface Props {
  remainingSeconds: number
}

defineProps<Props>()
</script>

<template>
  <div class="timer-display">
    {{ formatTime(remainingSeconds) }}
  </div>
</template>

<style scoped>
.timer-display {
  font-size: var(--font-size-timer);
  font-weight: 300;
  letter-spacing: 0.1em;
  color: var(--text);
  font-variant-numeric: tabular-nums;
  text-align: center;
  line-height: 1;
}
</style>
