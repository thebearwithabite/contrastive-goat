# Contrastive Goat Development Instructions

**ALWAYS** reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

Contrastive Goat is a React 18 + Vite 6 progressive web application featuring three experiments in contrastive learning. It's deployed on GitHub Pages with comprehensive CI/CD testing including accessibility, performance, and content validation.

## Working Effectively

### Bootstrap and Install Dependencies
- **CRITICAL**: Node.js v20+ required (currently v20.19.4, npm v10.8.2)
- `npm install` -- takes 4-15 seconds, installs 431 packages. NEVER CANCEL.
- Alternative: `make install` (same as npm install)
- **TIMEOUT**: Set 60 seconds minimum for npm install

### Build the Application
- `npm run build` -- takes 1.4 seconds. Vite build is very fast.
- `make build` -- same as npm run build with status messages
- Build output goes to `dist/` directory
- **TIMEOUT**: Set 30 seconds minimum (though typically completes in 1-2 seconds)

### Development Server
- `npm run dev` -- starts in 0.2 seconds on http://localhost:5173/
- `make dev` -- same as npm run dev
- **No timeout needed** - starts almost instantly

### Preview Production Build
- `npm run preview` -- starts instantly on http://localhost:4173/
- `make preview` -- same as npm run preview  
- **CRITICAL**: Must run `npm run build` first
- **No timeout needed** - starts immediately

### Content Linting
- `npm run lint:content` -- takes 0.18 seconds
- `make lint-content` -- same as npm run lint:content
- Validates images ≤300KB, audio ≤3MB, requires alt text per `ops/policy.json`
- **No timeout needed** - very fast

## Testing and CI

### **CRITICAL ISSUE: Playwright Browser Install Failures**
- `npx playwright install` frequently fails with network download errors
- `npx playwright install --with-deps` also fails (tested, takes 2+ minutes before failing)
- **Workaround**: Document that tests require manual Playwright setup
- If Playwright install fails, document it as "Playwright install fails due to network limitations"

### Testing Commands (Require Playwright Browsers)
- `npm test` -- Playwright tests, **fails without browsers installed**
- `npm run test:axe` -- Accessibility tests, **fails without browsers installed**
- `npm run test:lh` -- Lighthouse performance tests, **requires preview server + browsers**
- `make test` -- runs full CI suite, **fails without browsers installed**

### Full CI Pipeline
- `npm run ci:all` -- **NEVER CANCEL: Expected time 5-10 minutes when working**
  - Builds application (1.4s)
  - Runs content linting (0.18s)
  - Installs Playwright dependencies (usually fails)
  - Starts preview server
  - Runs smoke tests
  - Runs accessibility tests  
  - Runs Lighthouse performance tests
- **TIMEOUT**: Set 15+ minutes for full CI pipeline
- **Known Issue**: Usually fails at Playwright install step

### MCP (Model Context Protocol) Development
- `make mcp-config` -- validates `mcp_config.yaml` syntax (0.045 seconds)
- Python 3.12.3 and Go 1.24.6 available for MCP server development
- `mcp_config.yaml` contains server configuration
- **No timeout needed** - validation is instant

## Manual Validation Requirements

### **CRITICAL**: Always Test Application Functionality
After making changes, **ALWAYS** validate by running complete user scenarios:

1. **Build and serve the application**:
   ```bash
   npm run build && npm run preview
   ```

2. **Test all routes manually**:
   - http://localhost:4173/ (Home - should show "You are not allowed to remember")
   - http://localhost:4173/predict (Prediction interface)
   - http://localhost:4173/feelings (Feelings experiment)
   - http://localhost:4173/goat (Contrastive Goat game)

3. **Verify core functionality**:
   - Navigation between all routes works
   - Page content loads correctly
   - No console errors in browser
   - Service worker registers (PWA functionality)

4. **Use curl for basic validation**:
   ```bash
   curl -I http://localhost:4173/
   curl -I http://localhost:4173/predict
   curl -I http://localhost:4173/feelings  
   curl -I http://localhost:4173/goat
   ```
   All should return HTTP 200 OK

## Pre-Commit Validation

**ALWAYS** run these commands before committing changes:
- `npm run build` -- ensure build succeeds (1.4s)
- `npm run lint:content` -- validate content policy (0.18s)
- `make quick-check` -- runs lint-content + test-unit (will fail without browsers)

## Application Architecture

### Key Routes and Components
- `/` - Home page with main navigation
- `/predict` - Prediction experiment interface  
- `/feelings` - Feelings labeling experiment
- `/goat` - Contrastive Goat game

### File Structure
```
src/
├── routes/          # Page components (App.jsx, Home.jsx, Predict.jsx, Feelings.jsx, Goat.jsx)
├── components/      # Reusable UI components
├── lib/            # Utility libraries
└── main.jsx        # Application entry point with React Router setup

public/             # Static assets (icons, manifest, service worker)
data/               # Static data files (feelings_items.json)
tests/              # Playwright tests (smoke.spec.ts, axe.spec.ts)
ops/                # Policy configuration (policy.json)
tools/              # Build tools (content-lint.mjs)
```

### Configuration Files
- `package.json` - Dependencies and npm scripts
- `vite.config.js` - Build configuration with GitHub Pages support
- `lighthouserc.json` - Performance testing thresholds (90% performance required)
- `ops/policy.json` - Content and accessibility policies
- `mcp_config.yaml` - MCP server configuration
- `Makefile` - Developer commands with help (`make help`)

## GitHub Pages Deployment

- **Automatic deployment**: Push to `main` branch triggers `.github/workflows/pages.yaml`
- **Base URL**: `/contrastive-goat/` (configured via VITE_BASE environment variable)
- **SPA Support**: `404.html` fallback handled by postbuild script
- **CI Gates**: Build, content lint, Playwright tests, accessibility, Lighthouse performance

## Common Tasks and Quick Reference

### Makefile Commands (run `make help` for full list)
```bash
make install         # Install dependencies (15s)
make dev            # Start development server (0.2s)
make build          # Build project (1.4s)  
make preview        # Start preview server (instant)
make test           # Run all tests (fails without Playwright browsers)
make lint-content   # Run content linting (0.18s)
make clean          # Clean build artifacts
make mcp-config     # Validate MCP configuration (0.045s)
```

### Most Common Development Workflow
```bash
# Initial setup (from clean state)
npm install                    # 4-15 seconds, NEVER CANCEL
npm run build                  # 1.4 seconds  
npm run preview               # Start server

# Validate complete setup
curl -I http://localhost:4173/         # Should return HTTP 200
curl -I http://localhost:4173/predict  # Should return HTTP 200
curl -I http://localhost:4173/feelings # Should return HTTP 200
curl -I http://localhost:4173/goat     # Should return HTTP 200

# Development cycle
npm run dev                   # Development with hot reload
# Make changes...
npm run build                 # Build changes (1.4s)
npm run lint:content          # Validate content (0.18s)
npm run preview               # Test production build
# Test routes manually in browser
```

### Troubleshooting

**Build fails**: Check Node.js version (requires v20+), ensure dependencies installed
**Preview server not responding**: Ensure `npm run build` was run first
**Tests failing**: Playwright browsers likely not installed (known issue)
**Content lint failures**: Check image sizes (≤300KB) and alt text in `data/feelings_items.json`

## Performance and Accessibility Standards

- **Lighthouse Performance**: ≥90% score required (mobile)
- **Bundle Size**: Main bundle ~211KB gzipped (within 250KB limit)
- **Accessibility**: Zero critical axe-core violations required
- **Image Assets**: ≤300KB each
- **Audio Assets**: ≤3MB each
- **Alt Text**: Required for all images

**NEVER** remove accessibility features or performance optimizations to make builds pass.