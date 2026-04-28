package main

import (
	"context"
	"encoding/json"
	"os"
	"path/filepath"
	"testing"
)

// TestClampDuration tests the clampDuration helper function
func TestClampDuration(t *testing.T) {
	tests := []struct {
		name     string
		input    int
		expected int
	}{
		// Boundary tests
		{"Below minimum", 0, 1},
		{"Below minimum negative", -10, 1},
		{"Minimum boundary", 1, 1},
		{"Maximum boundary", 60, 60},
		{"Above maximum", 61, 60},
		{"Above maximum large", 1000, 60},
		// Mid-range tests
		{"Mid-range 25", 25, 25},
		{"Mid-range 30", 30, 30},
		{"Mid-range 10", 10, 10},
		{"Mid-range 50", 50, 50},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := clampDuration(tt.input)
			if result != tt.expected {
				t.Errorf("clampDuration(%d) = %d, want %d", tt.input, result, tt.expected)
			}
		})
	}
}

// TestClampDurationIdempotence tests that clamping twice gives the same result as clamping once
func TestClampDurationIdempotence(t *testing.T) {
	testValues := []int{-100, 0, 1, 25, 30, 60, 100, 1000}

	for _, val := range testValues {
		once := clampDuration(val)
		twice := clampDuration(clampDuration(val))
		if once != twice {
			t.Errorf("clampDuration is not idempotent for %d: once=%d, twice=%d", val, once, twice)
		}
	}
}

// TestLoadConfigMissing tests that LoadConfig returns default when file is missing
func TestLoadConfigMissing(t *testing.T) {
	tmpDir := t.TempDir()
	configPath := filepath.Join(tmpDir, "config.json")

	app := NewApp()
	app.configPathOverride = configPath
	config := app.LoadConfig()

	if config.LastDurationMinutes != 25 {
		t.Errorf("LoadConfig() with missing file returned %d, want 25", config.LastDurationMinutes)
	}
}

// TestLoadConfigDefault tests that LoadConfig returns default on startup
func TestLoadConfigDefault(t *testing.T) {
	tmpDir := t.TempDir()
	configPath := filepath.Join(tmpDir, "config.json")

	app := NewApp()
	app.configPathOverride = configPath
	config := app.LoadConfig()

	if config.LastDurationMinutes < 1 || config.LastDurationMinutes > 60 {
		t.Errorf("LoadConfig() returned out-of-range value %d", config.LastDurationMinutes)
	}
}

// TestSaveConfigCreatesDirectory tests that SaveConfig creates the config directory
func TestSaveConfigCreatesDirectory(t *testing.T) {
	tmpDir := t.TempDir()
	configPath := filepath.Join(tmpDir, "subdir", "config.json")

	app := NewApp()
	app.configPathOverride = configPath

	// Save a config value
	err := app.SaveConfig(42)
	if err != nil {
		t.Fatalf("SaveConfig() returned error: %v", err)
	}

	// Verify the file was created
	if _, err := os.Stat(configPath); os.IsNotExist(err) {
		t.Errorf("SaveConfig() did not create config file")
	}
}

// TestSaveConfigClamps tests that SaveConfig clamps out-of-range values
func TestSaveConfigClamps(t *testing.T) {
	tests := []struct {
		name     string
		input    int
		expected int
	}{
		{"Below minimum", 0, 1},
		{"Above maximum", 61, 60},
		{"Valid value", 25, 25},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tmpDir := t.TempDir()
			configPath := filepath.Join(tmpDir, "config.json")

			app := NewApp()
			app.configPathOverride = configPath
			err := app.SaveConfig(tt.input)
			if err != nil {
				t.Fatalf("SaveConfig(%d) returned error: %v", tt.input, err)
			}

			// Verify the app's internal state was clamped
			if app.lastDurationMinutes != tt.expected {
				t.Errorf("SaveConfig(%d) set lastDurationMinutes to %d, want %d", tt.input, app.lastDurationMinutes, tt.expected)
			}
		})
	}
}

// TestSaveLoadConfigRoundTrip tests that SaveConfig and LoadConfig round-trip correctly
func TestSaveLoadConfigRoundTrip(t *testing.T) {
	tmpDir := t.TempDir()
	configPath := filepath.Join(tmpDir, "config.json")

	app := NewApp()
	app.configPathOverride = configPath

	// Save a value
	err := app.SaveConfig(42)
	if err != nil {
		t.Fatalf("SaveConfig(42) returned error: %v", err)
	}

	// Load it back
	config := app.LoadConfig()
	if config.LastDurationMinutes != 42 {
		t.Errorf("Round-trip failed: saved 42, loaded %d", config.LastDurationMinutes)
	}
}

// TestLoadConfigCorruptJSON tests that LoadConfig returns default for corrupt JSON
func TestLoadConfigCorruptJSON(t *testing.T) {
	tmpDir := t.TempDir()
	configPath := filepath.Join(tmpDir, "config.json")

	// Write corrupt JSON
	err := os.WriteFile(configPath, []byte("{invalid json"), 0644)
	if err != nil {
		t.Fatalf("Failed to write corrupt JSON: %v", err)
	}

	app := NewApp()
	app.configPathOverride = configPath
	config := app.LoadConfig()

	if config.LastDurationMinutes != 25 {
		t.Errorf("LoadConfig() with corrupt JSON returned %d, want 25", config.LastDurationMinutes)
	}
}

// TestLoadConfigOutOfRange tests that LoadConfig returns default for out-of-range values
func TestLoadConfigOutOfRange(t *testing.T) {
	tests := []struct {
		name  string
		value int
	}{
		{"Below minimum", 0},
		{"Above maximum", 61},
		{"Negative", -10},
		{"Large value", 1000},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tmpDir := t.TempDir()
			configPath := filepath.Join(tmpDir, "config.json")

			// Write out-of-range value
			config := AppConfig{LastDurationMinutes: tt.value}
			data, _ := json.Marshal(config)
			os.WriteFile(configPath, data, 0644)

			app := NewApp()
			app.configPathOverride = configPath
			loadedConfig := app.LoadConfig()

			if loadedConfig.LastDurationMinutes != 25 {
				t.Errorf("LoadConfig() with value %d returned %d, want 25", tt.value, loadedConfig.LastDurationMinutes)
			}
		})
	}
}

// TestSessionCancelled tests that SessionCancelled is a no-op
func TestSessionCancelled(t *testing.T) {
	app := NewApp()
	// Should not panic or error
	app.SessionCancelled()
}

// TestOnBeforeClose tests that onBeforeClose returns false (don't prevent close)
func TestOnBeforeClose(t *testing.T) {
	app := NewApp()
	app.lastDurationMinutes = 42

	// Call onBeforeClose
	prevent := app.onBeforeClose(context.Background())

	if prevent {
		t.Errorf("onBeforeClose() returned true, want false")
	}
}

// TestAppConfigStruct tests that AppConfig marshals/unmarshals correctly
func TestAppConfigStruct(t *testing.T) {
	config := AppConfig{LastDurationMinutes: 30}

	// Marshal to JSON
	data, err := json.Marshal(config)
	if err != nil {
		t.Fatalf("Failed to marshal AppConfig: %v", err)
	}

	// Unmarshal back
	var config2 AppConfig
	err = json.Unmarshal(data, &config2)
	if err != nil {
		t.Fatalf("Failed to unmarshal AppConfig: %v", err)
	}

	if config2.LastDurationMinutes != 30 {
		t.Errorf("AppConfig round-trip failed: got %d, want 30", config2.LastDurationMinutes)
	}
}
