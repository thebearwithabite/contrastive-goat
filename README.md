# Contrastive Goat

Mobile-first PWA microsite for **"I Only Know What Happens Next"** with integrated MCP (Model Context Protocol) server support.

Routes:
- `/` — intro
- `/predict` — Predict the Future Frame
- `/feelings` — Label the Feeling
- `/goat` — Contrastive Goat

## Quickstart

### Using npm (Traditional)
```bash
npm install
npm run dev
# open http://localhost:5173
```

### Using Makefile (Recommended)
```bash
make install
make dev
# open http://localhost:5173
```

### Using Dev Container (VS Code)
1. Install [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
2. Open in VS Code and select "Reopen in Container"
3. Environment auto-configures with Node.js, Python, and Go

## Build & Preview
```bash
npm run build
npm run preview
# open http://localhost:4173

# Or using Makefile
make build
make preview
```

## MCP Server Setup & Usage

The project includes a Model Context Protocol (MCP) server for AI model serving and inference capabilities.

### Configuration

The MCP server is configured via `mcp_config.yaml`:

```yaml
# Basic server settings
server:
  host: "0.0.0.0"
  port: 8000
  debug: true

# Model configurations
models:
  contrastive_goat:      # Contrastive learning for goat image pairs
  feelings_classifier:   # Emotion classification from text/images  
  frame_predictor:       # Future frame prediction using diffusion
```

### Quick Start MCP Server

1. **Validate configuration**
   ```bash
   make mcp-config
   ```

2. **Start MCP server** (implementation needed)
   ```bash
   make mcp-server
   # or
   python -m uvicorn mcp_server:app --host 0.0.0.0 --port 8000
   ```

3. **Health check**
   ```bash
   curl http://localhost:8000/health
   ```

### MCP Features

- **Multi-model serving**: Contrastive learning, classification, and generative models
- **Performance monitoring**: Metrics, tracing, and health checks
- **Caching**: Model, inference, and data caching for performance
- **Security**: API key auth, rate limiting, input validation
- **Development**: Auto-reload, mock mode, test endpoints

### Integration with PWA

The MCP server integrates with the web application:

- **CORS configured** for localhost development and GitHub Pages
- **WebSocket support** for real-time model inference
- **REST API** for batch processing and model management
- **Async processing** for computationally intensive tasks

See `mcp_config.yaml` for detailed configuration options.

## Development Tools

### Makefile Commands

```bash
make help              # Show all available commands
make install           # Install dependencies  
make dev              # Start development server
make build            # Build the project
make test             # Run full test suite
make format           # Format code
make clean            # Clean build artifacts
make mcp-config       # Validate MCP configuration
make quick-check      # Pre-commit validation
```

### Available Scripts

- `npm run dev` — Start Vite development server
- `npm run build` — Build for production
- `npm run preview` — Preview production build
- `npm run test` — Run Playwright tests
- `npm run test:axe` — Run accessibility tests
- `npm run test:lh` — Run Lighthouse performance tests
- `npm run lint:content` — Validate content (images, alt text)
- `npm run ci:all` — Run complete CI pipeline

## CI Gates
- Playwright smoke + axe a11y
- Lighthouse (mobile) via `lighthouserc.json`
- Content linter (size + alt text) via `ops/policy.json`

## Deploy (GitHub Pages)
- Push to `main`. Workflow `.github/workflows/pages.yaml` will build/test and deploy to Pages.
- SPA fallback handled by `404.html` (prebuild and postbuild).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed development guidelines including:

- Development setup and workflows
- Coding standards and best practices  
- Commit message guidelines
- CI/CD processes
- MCP server development
- Accessibility and performance requirements

## Architecture

### Frontend (PWA)
- **React 18** with functional components and hooks
- **Vite** for fast development and optimized builds
- **React Router** for client-side navigation
- **Service Worker** for offline capabilities
- **Responsive design** with mobile-first approach

### Backend (MCP Server)
- **Python/FastAPI** for high-performance API serving
- **Multi-model support** for different AI tasks
- **Async processing** for scalable inference
- **Monitoring & observability** built-in

### Data & Policy
- **JSON data files** for game content and configuration
- **Policy-driven development** with `ops/policy.json`
- **Content validation** for accessibility and performance
- **Asset optimization** with size limits and compression

## Data Files
- `data/predict_sets.json`
- `data/feelings_items.json`
- `data/goat_pairs.json`

## Policy
- `ops/policy.json` controls budgets and requirements.

## Security & Dependencies
- Dependencies are kept up-to-date for security
- Vite 6.x for modern build tooling
- Lighthouse CI 0.15.x for performance monitoring
- Regular security audits via `npm audit`
