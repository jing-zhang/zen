package main

import (
	"context"
	"encoding/json"
	"log"
	"os"
	"path/filepath"
)

// AppConfig represents the persisted application configuration
type AppConfig struct {
	LastDurationMinutes int `json:"lastDurationMinutes"`
}

// App struct
type App struct {
	ctx                context.Context
	lastDurationMinutes int
	configPathOverride string // For testing only
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{
		lastDurationMinutes: 25, // default
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// configFilePath returns the platform-appropriate path to the config file
func (a *App) configFilePath() (string, error) {
	if a.configPathOverride != "" {
		return a.configPathOverride, nil
	}
	configDir, err := os.UserConfigDir()
	if err != nil {
		return "", err
	}
	appConfigDir := filepath.Join(configDir, "desktop-zen-app")
	return filepath.Join(appConfigDir, "config.json"), nil
}

// clampDuration clamps a duration value to the range [1, 60]
func clampDuration(x int) int {
	if x < 1 {
		return 1
	}
	if x > 60 {
		return 60
	}
	return x
}

// LoadConfig reads and unmarshals the config file.
// Returns AppConfig{LastDurationMinutes: 25} if file is missing, corrupt, or value is outside [1, 60]
func (a *App) LoadConfig() AppConfig {
	filePath, err := a.configFilePath()
	if err != nil {
		log.Printf("Error resolving config path: %v", err)
		return AppConfig{LastDurationMinutes: 25}
	}

	data, err := os.ReadFile(filePath)
	if err != nil {
		// File doesn't exist or can't be read; return default
		return AppConfig{LastDurationMinutes: 25}
	}

	var config AppConfig
	err = json.Unmarshal(data, &config)
	if err != nil {
		// Corrupt JSON; return default
		log.Printf("Error unmarshaling config: %v", err)
		return AppConfig{LastDurationMinutes: 25}
	}

	// Validate the value is in range [1, 60]
	if config.LastDurationMinutes < 1 || config.LastDurationMinutes > 60 {
		log.Printf("Config value out of range: %d, using default", config.LastDurationMinutes)
		return AppConfig{LastDurationMinutes: 25}
	}

	a.lastDurationMinutes = config.LastDurationMinutes
	return config
}

// SaveConfig marshals and writes the config file.
// Logs error silently if directory is not writable.
func (a *App) SaveConfig(durationMinutes int) error {
	// Clamp the duration to valid range
	durationMinutes = clampDuration(durationMinutes)
	a.lastDurationMinutes = durationMinutes

	filePath, err := a.configFilePath()
	if err != nil {
		log.Printf("Error resolving config path: %v", err)
		return err
	}

	// Ensure the directory exists
	dir := filepath.Dir(filePath)
	err = os.MkdirAll(dir, 0755)
	if err != nil {
		log.Printf("Error creating config directory: %v", err)
		return err
	}

	config := AppConfig{LastDurationMinutes: durationMinutes}
	data, err := json.MarshalIndent(config, "", "  ")
	if err != nil {
		log.Printf("Error marshaling config: %v", err)
		return err
	}

	err = os.WriteFile(filePath, data, 0644)
	if err != nil {
		log.Printf("Error writing config file: %v", err)
		return err
	}

	return nil
}

// SessionComplete sends an OS notification and plays the embedded audio asset
func (a *App) SessionComplete() error {
	// Send OS notification
	err := sendNotification("Zen session complete")
	if err != nil {
		log.Printf("Error sending notification: %v", err)
		return err
	}

	// Play embedded audio
	err = playCompletionAudio()
	if err != nil {
		log.Printf("Error playing audio: %v", err)
		return err
	}

	return nil
}

// SessionCancelled is a no-op (exists for symmetry)
func (a *App) SessionCancelled() {
	// No-op
}

// onBeforeClose is called when the app is about to close
// It saves the current duration to config
func (a *App) onBeforeClose(ctx context.Context) (prevent bool) {
	// Save the last known duration
	_ = a.SaveConfig(a.lastDurationMinutes)
	return false
}
