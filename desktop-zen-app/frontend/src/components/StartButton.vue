<script setup lang="ts">
import { computed } from 'vue'
import { useZenStore, clampDuration } from '../stores/zenStore'
import { useLanguageStore } from '../stores/languageStore'

const zenStore = useZenStore()
const languageStore = useLanguageStore()

const isDisabled = computed(() => {
  if (zenStore.mode === 'zen') {
    return false
  }
  // Disabled when idle and duration is not valid
  const duration = zenStore.selectedDuration
  return duration < 1 || duration > 60 || !Number.isInteger(duration)
})

const buttonLabel = computed(() => {
  return zenStore.mode === 'zen' ? languageStore.t('cancel') : languageStore.t('start')
})

const buttonClass = computed(() => {
  return zenStore.mode === 'zen' ? 'cancel' : 'start'
})

function handleClick(): void {
  if (zenStore.mode === 'idle') {
    zenStore.startSession()
  } else if (zenStore.mode === 'zen') {
    zenStore.cancelSession()
  }
}
</script>

<template>
  <button
    :class="['start-button', buttonClass]"
    :disabled="isDisabled"
    @click="handleClick"
  >
    {{ buttonLabel }}
  </button>
</template>

<style scoped>
.start-button {
  padding: 1.5rem 3rem;
  font-size: 1.5rem;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 200px;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Ensure button occupies at least 20% of screen area */
  width: 25%;
  height: 25%;
  max-width: 300px;
  max-height: 300px;
}

.start-button.start {
  background-color: var(--button-start-bg);
  color: var(--text);
}

.start-button.start:hover:not(:disabled) {
  background-color: var(--button-start-hover);
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(74, 158, 255, 0.3);
}

.start-button.start:active:not(:disabled) {
  transform: scale(0.98);
}

.start-button.start:disabled {
  background-color: var(--button-disabled-bg);
  color: var(--button-disabled-text);
  cursor: not-allowed;
  opacity: 0.6;
}

.start-button.cancel {
  background-color: var(--button-cancel-bg);
  color: var(--text);
}

.start-button.cancel:hover:not(:disabled) {
  background-color: var(--button-cancel-hover);
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(217, 83, 79, 0.3);
}

.start-button.cancel:active:not(:disabled) {
  transform: scale(0.98);
}

.start-button.cancel:disabled {
  background-color: var(--button-disabled-bg);
  color: var(--button-disabled-text);
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
