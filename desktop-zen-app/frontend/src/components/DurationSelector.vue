<script setup lang="ts">
import { computed } from 'vue'
import { clampDuration } from '../stores/zenStore'
import { useLanguageStore } from '../stores/languageStore'

const props = defineProps<{
  modelValue: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const languageStore = useLanguageStore()

const localValue = computed({
  get: () => props.modelValue,
  set: (value: number) => {
    emit('update:modelValue', value)
  },
})

function handleBlur(event: Event): void {
  const input = event.target as HTMLInputElement
  const value = parseInt(input.value, 10)
  const clamped = clampDuration(isNaN(value) ? 25 : value)
  localValue.value = clamped
}

function handleChange(event: Event): void {
  const input = event.target as HTMLInputElement
  const value = parseInt(input.value, 10)
  const clamped = clampDuration(isNaN(value) ? 25 : value)
  localValue.value = clamped
}
</script>

<template>
  <div class="duration-selector">
    <label for="duration-input">{{ languageStore.t('duration') }}</label>
    <input
      id="duration-input"
      type="number"
      :value="localValue"
      min="1"
      max="60"
      @blur="handleBlur"
      @change="handleChange"
      @input="(e) => (localValue = parseInt((e.target as HTMLInputElement).value, 10))"
    />
  </div>
</template>

<style scoped>
.duration-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text);
}

input[type='number'] {
  width: 60px;
  padding: 0.5rem;
  border: 2px solid var(--accent);
  border-radius: 4px;
  background-color: var(--panel-background);
  color: var(--text);
  font-size: 0.9rem;
  text-align: center;
}

input[type='number']:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(74, 158, 255, 0.2);
}
</style>
