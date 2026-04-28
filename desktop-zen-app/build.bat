@echo off
REM Desktop Zen App - Build Script for Windows
REM This script builds the Desktop Zen App for production

setlocal enabledelayedexpansion

echo.
echo 🧘 Desktop Zen App - Build Script
echo ==================================
echo.

REM Check if Go is installed
where go >nul 2>nul
if errorlevel 1 (
    echo ❌ Go is not installed. Please install Go 1.20+ from https://golang.org/dl/
    pause
    exit /b 1
)

REM Check if Wails is installed
where wails >nul 2>nul
if errorlevel 1 (
    echo ⚠️  Wails CLI is not installed. Installing now...
    go install github.com/wailsapp/wails/v2/cmd/wails@latest
)

echo 🏗️  Building Desktop Zen App...
echo.

REM Run Wails build
call wails build

echo.
echo ✅ Build completed successfully!
echo.
echo 📦 Output: build\bin\desktop-zen-app.exe
echo.
echo To run the app:
echo    build\bin\desktop-zen-app.exe
echo.

pause
