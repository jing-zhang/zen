@echo off
REM Desktop Zen App - Test Script for Windows
REM This script runs all tests (frontend and backend)

setlocal enabledelayedexpansion

echo.
echo 🧘 Desktop Zen App - Test Suite
echo ================================
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

echo 🧪 Running backend tests (Go)...
echo.
go test ./... -v
echo.

if errorlevel 1 (
    echo ❌ Backend tests failed!
    pause
    exit /b 1
)

echo ✅ Backend tests passed!
echo.

echo 🧪 Running frontend tests (Vue/TypeScript)...
echo.
cd frontend
call npm test -- --run
cd ..
echo.

if errorlevel 1 (
    echo ❌ Frontend tests failed!
    pause
    exit /b 1
)

echo ✅ Frontend tests passed!
echo.
echo 🎉 All tests passed successfully!
echo.

pause
