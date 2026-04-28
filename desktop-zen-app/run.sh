#!/bin/bash

# Desktop Zen App - Easy Run Script for Linux/macOS
# This script sets up and runs the Desktop Zen App in development mode

set -e

echo "🧘 Desktop Zen App - Development Mode"
echo "======================================"
echo ""

# Check if Go is installed
if ! command -v go &> /dev/null; then
    echo "❌ Go is not installed. Please install Go 1.20+ from https://golang.org/dl/"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ from https://nodejs.org/"
    exit 1
fi

# Check if Wails is installed
if ! command -v wails &> /dev/null; then
    echo "⚠️  Wails CLI is not installed. Installing now..."
    go install github.com/wailsapp/wails/v2/cmd/wails@latest
fi

# Check for Linux-specific dependencies
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "📦 Checking Linux dependencies..."
    
    # Check for GTK and WebKit
    if ! pkg-config --exists gtk+-3.0 webkit2gtk-4.1 2>/dev/null; then
        echo "⚠️  Missing GTK/WebKit development libraries"
        echo "   Run: sudo apt-get install libwebkit2gtk-4.1-dev libgtk-3-dev libayatana-appindicator3-dev"
        echo ""
        read -p "   Continue anyway? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
fi

# Install frontend dependencies if needed
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
fi

echo ""
echo "✅ All checks passed!"
echo ""
echo "🚀 Starting development server..."
echo ""
echo "   Native Window: http://localhost:34115"
echo "   Browser:      http://localhost:5174"
echo ""
echo "   Press Ctrl+C to stop"
echo ""

# Run Wails dev
wails dev
