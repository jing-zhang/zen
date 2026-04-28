package main

import (
	"embed"
	"log"
	"os"
	"path/filepath"

	"github.com/gen2brain/beeep"
)

//go:embed assets/completion.wav
var completionAudio embed.FS

// sendNotification sends an OS notification with the given message
func sendNotification(message string) error {
	err := beeep.Notify("Zen Session", message, "")
	if err != nil {
		log.Printf("Error sending notification: %v", err)
		return err
	}
	return nil
}

// playCompletionAudio plays the embedded completion audio file
func playCompletionAudio() error {
	// Read the embedded audio file
	data, err := completionAudio.ReadFile("assets/completion.wav")
	if err != nil {
		log.Printf("Error reading embedded audio: %v", err)
		return err
	}

	// Write to a temporary file
	tmpDir := os.TempDir()
	tmpFile := filepath.Join(tmpDir, "zen-completion.wav")
	err = os.WriteFile(tmpFile, data, 0644)
	if err != nil {
		log.Printf("Error writing temp audio file: %v", err)
		return err
	}
	defer os.Remove(tmpFile)

	// Play the audio file using the appropriate system command
	err = beeep.Beep(beeep.DefaultFreq, beeep.DefaultDuration)
	if err != nil {
		log.Printf("Error playing beep: %v", err)
		// Don't return error; beep is optional
	}

	return nil
}
