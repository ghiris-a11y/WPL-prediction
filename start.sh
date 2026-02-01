#!/bin/bash

echo "🏏 WPL Playoff Oracle - Quick Start Script"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "✅ Dependencies installed successfully!"
echo ""

# Check for .env file
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Creating from template..."
    cp .env.example .env
    echo "📝 Please edit .env file and add your VITE_RAPIDAPI_KEY"
    echo "   Get your key from: https://rapidapi.com/cricketapilive/api/cricbuzz-cricket"
fi

echo ""
echo "🎯 Choose an option:"
echo "   1) Start development server"
echo "   2) Build for production"
echo "   3) Preview production build"
echo "   4) Deploy to Vercel"
echo "   5) Exit"
echo ""
read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Starting development server..."
        echo "   Opening at http://localhost:3000"
        npm run dev
        ;;
    2)
        echo ""
        echo "🔨 Building for production..."
        npm run build
        if [ $? -eq 0 ]; then
            echo "✅ Build successful! Output in ./dist/"
        fi
        ;;
    3)
        echo ""
        echo "👀 Building and previewing production build..."
        npm run build && npm run preview
        ;;
    4)
        if ! command -v vercel &> /dev/null; then
            echo "Installing Vercel CLI..."
            npm i -g vercel
        fi
        echo ""
        echo "🚀 Deploying to Vercel..."
        vercel
        ;;
    5)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac
