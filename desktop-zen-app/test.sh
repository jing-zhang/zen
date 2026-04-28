#!/bin/bash

# Desktop Zen App - Test Script for Linux/macOS
# This script runs all tests (frontend and backend)

set -e

echo ""
echo "🧘 Desktop Zen App - Test Suite"
echo "================================"
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

echo "🧪 Running backend tests (Go)..."
echo ""
go test ./... -v
echo ""

if [ $? -ne 0 ]; then
    echo "❌ Backend tests failed!"
    exit 1
fi

echo "✅ Backend tests passed!"
echo ""

echo "🧪 Running frontend tests (Vue/TypeScript)..."
echo ""
cd frontend
npm test -- --run
cd ..
echo ""

if [ $? -ne 0 ]; then
    echo "❌ Frontend tests failed!"
    exit 1
fi

echo "✅ Frontend tests passed!"
echo ""
echo "🎉 All tests passed successfully!"
echo ""
