#!/bin/bash
set -e

echo "🚀 Setting up Contrastive Goat development environment..."

# Install Node.js dependencies
echo "📦 Installing npm dependencies..."
npm install

# Install Playwright browsers
echo "🎭 Installing Playwright browsers..."
npx playwright install --with-deps

# Install Python dependencies for MCP development
echo "🐍 Setting up Python environment..."
pip install --upgrade pip
pip install pyyaml httpx uvicorn fastapi python-multipart

# Install Go modules for MCP development
echo "🏗️  Setting up Go environment..."
go version

# Create development directories
echo "📁 Creating development directories..."
mkdir -p tmp
mkdir -p logs

# Set up git hooks (optional)
echo "🔧 Configuring git..."
git config --global --add safe.directory /workspaces/contrastive-goat || true

# Build the project to verify setup
echo "🔨 Building project to verify setup..."
npm run build

echo "✅ Development environment setup complete!"
echo ""
echo "🎯 Quick commands:"
echo "  npm run dev          - Start development server"
echo "  npm run test         - Run tests"
echo "  npm run ci:all       - Run full CI suite"
echo "  make install         - Install dependencies"
echo "  make dev             - Start development server"
echo "  make test            - Run tests"
echo ""
echo "📖 See CONTRIBUTING.md for detailed development guidelines"