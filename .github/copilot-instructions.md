# Contrastive Goat Development Instructions

**ALWAYS follow these instructions first and only fallback to additional search and context gathering if the information in the instructions is incomplete or found to be in error.**

Contrastive Goat is a React/Vite PWA (Progressive Web App) featuring contrastive learning experiments. It includes an MCP (Model Context Protocol) server for AI model serving and is deployed to GitHub Pages with comprehensive CI/CD automation.

## Working Effectively

### Bootstrap and Build
Run these commands in exact order to set up the development environment:

```bash
npm install
# Takes ~30 seconds, expect some deprecation warnings (normal)

npm run build
# Takes ~1 second - this is an extremely fast build! NEVER CANCEL.
# Expected output: dist/ folder with ~69KB gzipped main bundle (well under 250KB limit)
```

### Development Server
Start the development environment:

```bash
npm run dev
# Starts on http://localhost:5173
# NEVER CANCEL - runs continuously for development
```

### Preview Production Build
Test the production build locally:

```bash
npm run preview
# Requires build first - starts on http://localhost:4173
# NEVER CANCEL - runs continuously for testing
```

### Run Content Linting
Validate images, audio files, and alt text:

```bash
npm run lint:content
# Takes <1 second, validates against ops/policy.json requirements
```

### Validate MCP Configuration
Check MCP server configuration:

```bash
make mcp-config
# Takes <1 second, validates mcp_config.yaml syntax
```

### Alternative Commands (Makefile)
You can use Makefile commands instead of npm:

```bash
make install    # equivalent to npm install
make dev        # equivalent to npm run dev
make build      # equivalent to npm run build
make preview    # equivalent to npm run preview
make test       # equivalent to npm run ci:all (see testing section)
```

## Testing

### ⚠️ CRITICAL LIMITATION: Playwright Browser Install
**DO NOT attempt to install Playwright browsers in this environment.** The command `npx playwright install --with-deps` will fail due to download limitations. 

```bash
# This WILL FAIL in the current environment:
# npx playwright install --with-deps
```

### Content and Build Testing (Safe)
Run these tests that work without Playwright:

```bash
npm run build         # Build validation - 1 second
npm run lint:content  # Content policy validation - <1 second
make mcp-config      # MCP configuration validation - <1 second
```

### Full CI Pipeline (Limited)
The complete CI pipeline includes Playwright tests that may not work in this environment:

```bash
npm run ci:all
# This runs: build + lint:content + playwright install + preview server + tests
# EXPECT: Playwright install may fail, causing the full pipeline to fail
# TIMEOUT: Set 10+ minutes if Playwright install succeeds
```

## Validation Scenarios

After making changes, ALWAYS manually validate by testing these user scenarios:

### 1. Application Routes
Navigate to each route and verify content:
- `http://localhost:5173/` - Shows "You are not allowed to remember. Only to predict."
- `http://localhost:5173/predict` - Predict the Future Frame experiment
- `http://localhost:5173/feelings` - Label the Feeling experiment  
- `http://localhost:5173/goat` - Contrastive Goat experiment

### 2. Navigation Flow
- Header shows "I ONLY KNOW WHAT HAPPENS NEXT"
- Navigation links work: Home, Predict, Feelings, Goat
- Footer text changes based on route
- Export Events button functions

### 3. Performance Validation
After changes, verify bundle size:
```bash
npm run build
# Check output - main bundle MUST be <250KB gzipped (currently ~69KB)
```

## Performance and Accessibility Requirements

### Bundle Size Limits (CRITICAL)
- Main bundle MUST be <250KB gzipped (enforced by CI)
- Current bundle: ~69KB gzipped (safe margin)

### Image and Audio Limits
- Images MUST be <300KB each
- Audio files MUST be <3MB each
- Alt text REQUIRED for all images

### Lighthouse Requirements
- Mobile performance score MUST be ≥90 (enforced by CI)
- Accessibility score MUST be ≥90
- SEO score MUST be ≥90
- Best practices score MUST be ≥90

### Pre-commit Validation
ALWAYS run before committing changes:

```bash
npm run build         # Verify build succeeds
npm run lint:content  # Verify content policy compliance
```

## Common Tasks

### File Structure Reference
```
/src/main.jsx           # Entry point with React Router setup
/src/routes/App.jsx     # Main app component with navigation
/src/routes/Home.jsx    # Home page component  
/src/routes/Predict.jsx # Predict experiment page
/src/routes/Feelings.jsx# Feelings experiment page
/src/routes/Goat.jsx    # Goat experiment page
/ops/policy.json        # Performance and accessibility budgets
/lighthouserc.json     # Lighthouse CI configuration
/mcp_config.yaml       # MCP server configuration
/tools/content-lint.mjs # Content validation script
```

### Key Configuration Files
Always check these when making infrastructure changes:
- `vite.config.js` - Build configuration, base path for GitHub Pages
- `package.json` - Dependencies and scripts
- `.github/workflows/pages.yaml` - Deployment pipeline
- `Makefile` - Development task automation

### MCP Server Development
The MCP server is partially implemented:
```bash
make mcp-server
# Currently a placeholder - implementation needed
# Configuration in mcp_config.yaml is valid
```

## Timing Expectations

**NEVER CANCEL these operations - use these timeouts:**

- `npm install`: 30-45 seconds
- `npm run build`: 1-2 seconds (extremely fast!)
- `npm run dev`: Starts in 1-2 seconds, runs continuously
- `npm run preview`: Starts in 1-2 seconds, runs continuously  
- `npm run lint:content`: <1 second
- `make mcp-config`: <1 second
- `npm run ci:all`: 5-15 minutes IF Playwright works (often fails in this environment)

## Troubleshooting

### Build Issues
If build fails, check:
1. Node.js version (requires Node 18+)
2. Clean install: `rm -rf node_modules package-lock.json && npm install`
3. Clear Vite cache: `rm -rf .vite`

### Performance Issues  
If bundle size exceeds limits:
1. Check `npm run build` output for largest files
2. Review lazy loading in `/src/main.jsx`
3. Verify tree shaking is working properly

### Content Policy Violations
If content linting fails:
1. Check image sizes in `/public` and `/assets`
2. Verify alt text in `data/feelings_items.json`
3. Review audio file sizes

## Development Best Practices

- ALWAYS test on both dev server (5173) and preview server (4173)
- ALWAYS validate bundle size after changes
- ALWAYS test manual navigation scenarios
- Use lazy loading for new routes (see `/src/main.jsx` examples)
- Follow React Router patterns established in existing routes
- Keep components focused and minimal for bundle size