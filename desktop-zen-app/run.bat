@echo off
REM Desktop Zen App - Easy Run Script for Windows
REM This script sets up and runs the Desktop Zen App in development mode

setlocal enabledelayedexpansion

echo.
echo 🧘 Desktop Zen App - Development Mode
echo ======================================
echo.

REM Check if Go is installed
where go >nul 2>nul
if errorlevel 1 (
    echo ❌ Go is not installed. Please install Go 1.20+ from https://golang.org/dl/
    pause
    exit /b 1
)

REM Check if Node.js is installed
where node >nul 2>nul
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if Wails is installed
where wails >nul 2>nul
if errorlevel 1 (
    echo ⚠️  Wails CLI is not installed. Installing now...
    go install github.com/wailsapp/wails/v2/cmd/wails@latest
)

echo ✅ All checks passed!
echo.

REM Install frontend dependencies if needed
if not exist "frontend\node_modules" (
    echo 📦 Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)

echo.
echo 🚀 Starting development server...
echo.
echo    Native Window: http://localhost:34115
echo    Browser:      http://localhost:5174
echo.
echo    Press Ctrl+C to stop
echo.

REM Run Wails dev
call wails dev

pause
