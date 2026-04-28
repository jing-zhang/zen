<script setup lang="ts">
import TopPanel from './TopPanel.vue'
import StartButton from './StartButton.vue'
</script>

<template>
  <div class="main-screen">
    <TopPanel />
    <div class="main-content">
      <StartButton />
    </div>
  </div>
</template>

<style scoped>
.main-screen {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--background);
  color: var(--text);
}

.main-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-xl);
  min-height: 0;
}
</style>
