#!/bin/bash

# Desktop Zen App - Build Script for Linux/macOS
# This script builds the Desktop Zen App for production

set -e

echo ""
echo "🧘 Desktop Zen App - Build Script"
echo "=================================="
echo ""

# Check if Go is installed
if ! command -v go &> /dev/null; then
    echo "❌ Go is not installed. Please install Go 1.20+ from https://golang.org/dl/"
    exit 1
fi

# Check if Wails is installed
if ! command -v wails &> /dev/null; then
    echo "⚠️  Wails CLI is not installed. Installing now..."
    go install github.com/wailsapp/wails/v2/cmd/wails@latest
fi

echo "🏗️  Building Desktop Zen App..."
echo ""

# Run Wails build
wails build

echo ""
echo "✅ Build completed successfully!"
echo ""

# Show output location
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "📦 Output: build/bin/desktop-zen-app.app"
    echo ""
    echo "To run the app:"
    echo "   open build/bin/desktop-zen-app.app"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "📦 Output: build/bin/desktop-zen-app"
    echo ""
    echo "To run the app:"
    echo "   ./build/bin/desktop-zen-app"
fi

echo ""
