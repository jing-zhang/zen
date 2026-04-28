<script setup lang="ts">
defineProps<{
  name: string
  isActive: boolean
}>()

defineEmits<{
  select: []
}>()
</script>

<template>
  <button
    :class="['preset-button', { active: isActive }]"
    @click="$emit('select')"
  >
    {{ name }}
  </button>
</template>

<style scoped>
.preset-button {
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;
  border: 2px solid var(--accent);
  background-color: transparent;
  color: var(--text);
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.preset-button:hover {
  background-color: var(--accent);
  color: var(--background);
}

.preset-button.active {
  background-color: var(--accent);
  color: var(--background);
  border-color: var(--accent);
}
</style>
