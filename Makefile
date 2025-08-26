# Contrastive Goat Makefile
# Common developer tasks for the project

.PHONY: help install dev build preview test test-axe test-lighthouse lint-content format clean ci-all

# Default target
help: ## Show this help message
	@echo "Contrastive Goat Development Tasks"
	@echo "=================================="
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install dependencies
	@echo "📦 Installing dependencies..."
	npm install
	@echo "✅ Dependencies installed"

dev: ## Start development server
	@echo "🚀 Starting development server..."
	npm run dev

build: ## Build the project
	@echo "🔨 Building project..."
	npm run build
	@echo "✅ Build complete"

preview: ## Start preview server (requires build first)
	@echo "👀 Starting preview server..."
	npm run preview

test: ## Run all tests and CI checks
	@echo "🧪 Running full test suite..."
	npm run ci:all
	@echo "✅ All tests passed"

test-unit: ## Run unit tests only
	@echo "🧪 Running unit tests..."
	npm run test

test-axe: ## Run accessibility tests
	@echo "♿ Running accessibility tests..."
	npm run test:axe

test-lighthouse: ## Run Lighthouse performance tests
	@echo "🚨 Running Lighthouse tests..."
	npm run test:lh

lint-content: ## Run content linting (images, alt text, etc.)
	@echo "📝 Running content linter..."
	npm run lint:content

format: ## Format code (placeholder - add your preferred formatter)
	@echo "✨ Formatting code..."
	@echo "ℹ️  Add your preferred formatter here (prettier, eslint --fix, etc.)"
	# Example: npx prettier --write "src/**/*.{js,jsx,ts,tsx}"
	# Example: npx eslint --fix "src/**/*.{js,jsx}"

clean: ## Clean build artifacts and dependencies
	@echo "🧹 Cleaning build artifacts..."
	rm -rf dist
	rm -rf node_modules
	rm -rf test-results
	rm -rf .vite
	@echo "✅ Clean complete"

ci-all: build lint-content test-unit test-axe test-lighthouse ## Run complete CI pipeline
	@echo "🎉 All CI checks passed!"

# MCP Server targets
mcp-config: ## Validate MCP configuration
	@echo "🔧 Validating MCP configuration..."
	@if [ -f mcp_config.yaml ]; then \
		echo "✅ mcp_config.yaml found"; \
		python -c "import yaml; yaml.safe_load(open('mcp_config.yaml'))" && echo "✅ YAML syntax valid" || echo "❌ YAML syntax invalid"; \
	else \
		echo "❌ mcp_config.yaml not found"; \
	fi

mcp-server: ## Start MCP server (placeholder)
	@echo "🤖 Starting MCP server..."
	@echo "ℹ️  Implement your MCP server startup here"
	# Example: python -m uvicorn mcp_server:app --host 0.0.0.0 --port 8000

# Development helpers
setup: install ## Complete development setup
	@echo "🛠️  Setting up development environment..."
	npx playwright install --with-deps
	@echo "✅ Development environment ready"

quick-check: lint-content test-unit ## Quick validation before commit
	@echo "⚡ Running quick pre-commit checks..."
	@echo "✅ Quick checks passed"

# Docker helpers (if needed)
docker-build: ## Build Docker image (placeholder)
	@echo "🐳 Building Docker image..."
	@echo "ℹ️  Add Docker build commands here if needed"

docker-run: ## Run in Docker container (placeholder)
	@echo "🐳 Running Docker container..."
	@echo "ℹ️  Add Docker run commands here if needed"