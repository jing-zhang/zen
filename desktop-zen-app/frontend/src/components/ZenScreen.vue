<script setup lang="ts">
import { useZenStore } from '../stores/zenStore'
import ArcIndicator from './ArcIndicator.vue'
import TimerDisplay from './TimerDisplay.vue'
import StartButton from './StartButton.vue'

const zenStore = useZenStore()
</script>

<template>
  <div class="zen-screen">
    <div class="zen-content">
      <!-- Arc indicator surrounding the timer -->
      <div class="arc-container">
        <ArcIndicator :progress="zenStore.arcProgress" />
        <div class="timer-wrapper">
          <TimerDisplay :remaining-seconds="zenStore.remainingSeconds" />
        </div>
      </div>

      <!-- Cancel button -->
      <div class="button-container">
        <StartButton />
      </div>
    </div>
  </div>
</template>

<style scoped>
.zen-screen {
  width: 100%;
  height: 100vh;
  background-color: var(--zen-background);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.zen-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  gap: 3rem;
}

.arc-container {
  position: relative;
  width: 350px;
  height: 350px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.timer-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
}

.button-container {
  margin-top: 2rem;
}
</style>
