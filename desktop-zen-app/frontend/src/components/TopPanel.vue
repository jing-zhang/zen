<script setup lang="ts">
import { useZenStore, PRESETS } from '../stores/zenStore'
import PresetButton from './PresetButton.vue'
import DurationSelector from './DurationSelector.vue'

const zenStore = useZenStore()

function handlePresetSelect(preset: string): void {
  zenStore.selectPreset(preset)
}

function handleDurationChange(minutes: number): void {
  zenStore.setCustomDuration(minutes)
}
</script>

<template>
  <div class="top-panel">
    <div class="presets">
      <PresetButton
        v-for="(duration, preset) in PRESETS"
        :key="preset"
        :name="preset.charAt(0).toUpperCase() + preset.slice(1)"
        :is-active="zenStore.activePreset === preset"
        @select="handlePresetSelect(preset)"
      />
    </div>
    <DurationSelector
      :model-value="zenStore.selectedDuration"
      @update:model-value="handleDurationChange"
    />
  </div>
</template>

<style scoped>
.top-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--panel-background);
  border-bottom: 1px solid var(--border-color);
  gap: var(--spacing-xl);
  height: var(--panel-height);
  flex-shrink: 0;
  width: 100%;
}

.presets {
  display: flex;
  gap: var(--spacing-sm);
}

@media (max-width: 600px) {
  .top-panel {
    flex-direction: column;
    gap: var(--spacing-md);
    height: auto;
    padding: var(--spacing-md);
  }

  .presets {
    width: 100%;
    justify-content: center;
  }
}
</style>
