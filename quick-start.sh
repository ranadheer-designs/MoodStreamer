#!/bin/bash

echo "🚀 Quick Start - Full Stack Application"
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."

echo "Installing web dependencies..."
cd web
npm install
cd ..

echo "Installing mobile dependencies..."
cd mobile
npm install
cd ..

echo ""
echo "🔧 Setting up environment..."

# Create .env files if they don't exist
if [ ! -f .env ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your configuration before starting the applications."
fi

if [ ! -f web/.env ]; then
    echo "Creating web/.env file from template..."
    cp web/.env.example web/.env
fi

if [ ! -f mobile/.env ]; then
    echo "Creating mobile/.env file from template..."
    cp mobile/.env.example mobile/.env
fi

echo ""
echo "🎯 Ready to start applications!"
echo ""
echo "To start the web application:"
echo "  cd web && npm run dev"
echo ""
echo "To start the mobile application:"
echo "  cd mobile && npm start"
echo ""
echo "To deploy with Docker:"
echo "  ./deploy.sh"
echo ""
echo "📖 For more information, see README.md"