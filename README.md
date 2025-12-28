# Contrastive Goat

**"I Only Know What Happens Next"** — A beautiful, surreal multimedia experience exploring contrastive predictive coding through poetic interactions, ambient soundscapes, and evolving visuals.

Mobile-first PWA microsite with integrated MCP (Model Context Protocol) server support.

## ✨ Features

- 🎨 **Beautiful & Surreal** — Animated gradients, particle systems, and dreamlike transitions
- 🔊 **Immersive Audio** — Ambient soundscapes, audio clustering, and poetic sound design
- 🌐 **Embed Ready** — iframe integration with PostMessage API for seamless embedding
- 📱 **Mobile First** — Responsive design optimized for all devices
- ♿ **Accessible** — WCAG compliant with keyboard navigation and screen reader support
- ⚡ **Fast** — ~90KB gzipped bundle, Lighthouse score >90

## 🎮 Routes

- `/` — Cinematic intro with floating cards and ambient audio
- `/predict` — Predict the Future Frame with audio feedback
- `/feelings` — Label the Feeling by clustering audio samples
- `/goat` — Contrastive Goat with animated SVG creatures

## 🚀 Quickstart

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

## 🎵 Audio System

The application includes a sophisticated audio system with:

- **Ambient Soundscapes** — Background drones that evolve with user interaction
- **Audio Effects** — Synthesized success/failure tones and interaction sounds
- **Audio Clustering** — Play and compare audio samples in the Feelings experiment
- **Volume Controls** — Accessible mute/volume UI in bottom-right corner

### Placeholder Audio Files

The `/public/audio/` directory contains minimal placeholder files. To use real audio:

1. Replace the `.m4a` files with your own recordings (max 3MB each)
2. Or generate placeholders in the browser console:
   ```javascript
   window.generatePlaceholderAudio()
   ```
3. Convert WAV to M4A:
   ```bash
   ffmpeg -i soft_rain.wav -c:a aac -b:a 128k soft_rain.m4a
   ```

Required files:
- `soft_rain.m4a` — Gentle ambience (loopable)
- `metal_scrape.m4a` — Harsh texture
- `distant_piano.m4a` — Melancholic melody
- `alarm_beep.m4a` — Urgent alert
- `ambient_drone.m4a` — Background atmosphere (loopable)

## 🌐 Embedding in Your Site

Embed the experience in any website with full iframe support:

```html
<iframe 
  src="https://thebearwithabite.github.io/contrastive-goat/"
  width="100%" 
  height="800px"
  allow="autoplay"
  style="border: none; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.3);"
  title="I Only Know What Happens Next">
</iframe>
```

### Embed Options

Add URL parameters to customize the embedded experience:

```html
<!-- Minimal UI mode (no header/footer) -->
<iframe src="https://thebearwithabite.github.io/contrastive-goat/?minimal=true"></iframe>

<!-- Disable audio -->
<iframe src="https://thebearwithabite.github.io/contrastive-goat/?noAudio=true"></iframe>

<!-- Start automatically -->
<iframe src="https://thebearwithabite.github.io/contrastive-goat/?autoStart=true"></iframe>
```

### PostMessage API

The embed communicates with the parent window via PostMessage:

```javascript
// Listen for events from the embed
window.addEventListener('message', (event) => {
  if (event.data.source === 'contrastive-goat') {
    console.log('Event type:', event.data.type);
    console.log('Event data:', event.data.data);
  }
});

// Send commands to the embed
const iframe = document.querySelector('iframe');
iframe.contentWindow.postMessage({
  type: 'mute',
  data: { muted: true }
}, '*');
```

Events emitted:
- `ready` — Embed loaded and initialized
- `navigation` — User navigated to a new route
- `interaction` — User interacted with an element
- `state` — Application state changed

## 🏗️ Build & Preview
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
- **React 19** with functional components and hooks
- **Vite 7** for fast development and optimized builds
- **React Router 7** for client-side navigation
- **Service Worker** for offline capabilities
- **Web Audio API** for immersive sound design
- **Canvas** for particle systems and visual effects
- **Responsive design** with mobile-first approach

### Multimedia Libraries
- `src/lib/audio.js` — Audio management with Web Audio API
- `src/lib/animations.js` — Animation utilities (fade, pulse, glitch, etc.)
- `src/lib/particles.js` — Particle system for backgrounds
- `src/lib/embedAPI.js` — iframe communication via PostMessage

### UI Components
- `src/components/AudioPlayer.jsx` — Audio controls and volume
- `src/components/ParticleField.jsx` — Animated background particles
- `src/components/PoeticLoader.jsx` — Loading states with rotating phrases

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
- `data/predict_sets.json` — Prediction prompts and choices
- `data/feelings_items.json` — Audio samples with clustering metadata
- `data/goat_pairs.json` — Goat sequence pairs

## Policy
- `ops/policy.json` controls budgets and requirements.

## Security & Dependencies
- Dependencies are kept up-to-date for security
- Vite 7.x for modern build tooling
- Lighthouse CI 0.15.x for performance monitoring
- Regular security audits via `npm audit`

## 💙 About

This is a deeply personal project honoring a friend's vision for a Contrastive Predictive Coding demo that blends **50% beauty and 50% surrealism** with multimedia elements.

The experience should feel:
- **Gentle but strange**
- **Beautiful but unsettling**
- **Familiar but alien**
- **Sad but hopeful**
- **Scientific but poetic**

Every interaction should feel like touching a dream.

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
