<script setup lang="ts">
import { useZenStore, PRESETS } from '../stores/zenStore'
import { useLanguageStore } from '../stores/languageStore'
import PresetButton from './PresetButton.vue'
import DurationSelector from './DurationSelector.vue'

const zenStore = useZenStore()
const languageStore = useLanguageStore()

function handlePresetSelect(preset: string): void {
  zenStore.selectPreset(preset)
}

function handleDurationChange(minutes: number): void {
  zenStore.setCustomDuration(minutes)
}

function toggleLanguage(): void {
  const newLang = languageStore.language === 'en' ? 'zh' : 'en'
  languageStore.setLanguage(newLang)
}
</script>

<template>
  <div class="top-panel">
    <div class="presets">
      <PresetButton
        v-for="(duration, preset) in PRESETS"
        :key="preset"
        :name="languageStore.t(preset as any)"
        :is-active="zenStore.activePreset === preset"
        @select="handlePresetSelect(preset)"
      />
    </div>
    <DurationSelector
      :model-value="zenStore.selectedDuration"
      @update:model-value="handleDurationChange"
    />
    <button class="language-toggle" @click="toggleLanguage" :title="`Switch to ${languageStore.language === 'en' ? 'Chinese' : 'English'}`">
      {{ languageStore.language === 'en' ? '中文' : 'EN' }}
    </button>
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

.language-toggle {
  padding: 0.5rem 1rem;
  border: 2px solid var(--accent);
  border-radius: 4px;
  background-color: var(--panel-background);
  color: var(--text);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.language-toggle:hover {
  background-color: var(--accent);
  color: white;
}

.language-toggle:active {
  transform: scale(0.95);
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

  .language-toggle {
    align-self: flex-end;
  }
}
</style>
