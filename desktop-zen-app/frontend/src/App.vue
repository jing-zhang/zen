<script setup lang="ts">
import { onMounted } from 'vue'
import { useZenStore } from './stores/zenStore'
import { LoadConfig } from '../wailsjs/go/main/App'
import { EventsOn } from '../wailsjs/runtime'
import MainScreen from './components/MainScreen.vue'
import ZenScreen from './components/ZenScreen.vue'

const zenStore = useZenStore()

/**
 * On component mount:
 * 1. Load config from Go backend
 * 2. Initialize store from config
 * 3. Register saveAndClose on Wails OnBeforeClose event
 */
onMounted(async () => {
  try {
    // Load persisted config from Go backend
    const config = await LoadConfig()
    
    // Initialize store from config
    zenStore.initFromConfig(config)
  } catch (error) {
    console.error('Failed to load config:', error)
    // Store will use default values if config load fails
  }

  // Register saveAndClose on Wails OnBeforeClose event
  try {
    EventsOn('wails:beforeclose', async () => {
      await zenStore.saveAndClose()
    })
  } catch (error) {
    console.error('Failed to register event listener:', error)
  }
})
</script>

<template>
  <div id="app">
    <!-- Conditionally render MainScreen or ZenScreen based on mode -->
    <MainScreen v-if="zenStore.mode === 'idle'" />
    <ZenScreen v-else-if="zenStore.mode === 'zen'" />

    <!-- Fallback alert modal for denied notifications -->
    <div v-if="zenStore.showFallbackAlert" class="fallback-alert-overlay" @click="zenStore.dismissFallbackAlert()">
      <div class="fallback-alert-modal" @click.stop>
        <h2>Session Complete</h2>
        <p>Your Zen session has ended.</p>
        <button @click="zenStore.dismissFallbackAlert()">Dismiss</button>
      </div>
    </div>
  </div>
</template>

<style>
#app {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.fallback-alert-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.fallback-alert-modal {
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 300px;
}

.fallback-alert-modal h2 {
  margin: 0 0 12px 0;
  font-size: 20px;
  color: #333;
}

.fallback-alert-modal p {
  margin: 0 0 20px 0;
  font-size: 14px;
  color: #666;
}

.fallback-alert-modal button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.fallback-alert-modal button:hover {
  background-color: #45a049;
}
</style>
