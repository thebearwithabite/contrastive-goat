# Contrastive Goat Development Instructions

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Quick Start
- Install dependencies: `npm install` (takes ~15 seconds)
- Build the project: `npm run build` (takes ~1-2 seconds - very fast!)
- Start development server: `npm run dev` (available at http://localhost:5173)
- Start preview server: `npm run preview` (available at http://localhost:4173)

### Essential Commands
```bash
# Using npm (traditional)
npm install                    # Install dependencies (~15 seconds)
npm run build                 # Build for production (~1-2 seconds)
npm run dev                   # Start development server (http://localhost:5173)
npm run preview               # Start preview server (http://localhost:4173)
npm run lint:content          # Content linting (<1 second)

# Using Makefile (recommended)
make install                  # Install dependencies
make build                    # Build project (~1-2 seconds)
make dev                      # Start development server
make preview                  # Start preview server
make lint-content             # Run content linting (<1 second)
make help                     # Show all available commands
```

### CI Pipeline and Testing

**CRITICAL TIMING INFORMATION:**
- **Build**: ~1-2 seconds - NEVER set timeout below 60 seconds for safety
- **Content Lint**: <1 second  
- **Playwright Installation**: FAILS in most environments due to browser download issues
- **Full CI Suite**: May take 5-15 minutes when Playwright works - NEVER CANCEL

#### Working CI Commands
```bash
# These commands work reliably:
make build                    # Production build (1-2 seconds)
make lint-content             # Content validation (<1 second)
npm run build                 # Same as make build
npm run lint:content          # Same as make lint-content
```

#### Playwright Issues
**CRITICAL**: Playwright browser installation often fails with download errors. This is a known environment limitation.

```bash
# These commands will FAIL due to browser download issues:
npx playwright install --with-deps    # FAILS - browser download error  
npm run test                         # FAILS - requires browsers
npm run test:axe                     # FAILS - requires browsers
npm run test:lh                      # FAILS - requires browsers
npm run ci:all                       # FAILS - requires browsers
make test                            # FAILS - requires browsers
make quick-check                     # FAILS - calls test-unit which requires browsers
```

**Workaround**: Document any Playwright-related functionality as "Cannot be tested in this environment due to browser installation limitations."

## Validation Scenarios

### After Making Changes, Always Test These User Scenarios:

1. **Basic Application Functionality**:
   - Run `npm run build` - verify it completes in 1-2 seconds
   - Run `npm run preview` - verify server starts at http://localhost:4173
   - Visit application routes: `/`, `/predict`, `/feelings`, `/goat`
   - Verify no console errors in browser developer tools

2. **Content Validation**:
   - Run `npm run lint:content` - verify it passes
   - Check that images are under 300KB and have alt text
   - Check that audio files are under 3MB

3. **Build Artifacts**:
   - Verify `dist/` directory is created after build
   - Verify `dist/404.html` exists (SPA fallback)
   - Check bundle size in build output (should be ~70KB gzipped)

### Manual Testing Requirements
- **NEVER** simply start and stop the application - you must test actual functionality
- **ALWAYS** visit at least 2-3 routes and verify they load correctly
- **ALWAYS** check browser console for errors
- **ALWAYS** verify the build output shows reasonable bundle sizes

## Repository Structure

### Key Directories
```
src/                          # React application source
├── main.jsx                  # Application entry point
├── routes/                   # Route components (App, Home, Predict, Feelings, Goat)
└── lib/analytics.js          # Local analytics tracking

data/                         # Application data files
├── feelings_items.json       # Must have alt text for images
├── goat_pairs.json          # Contrastive learning pairs
└── predict_sets.json        # Prediction game data

tests/                        # Playwright tests (require browser installation)
├── smoke.spec.ts            # Basic functionality tests  
└── axe.spec.ts              # Accessibility tests

tools/                        # Build and validation tools
└── content-lint.mjs         # Content policy enforcement

ops/                          # Configuration and policies
└── policy.json              # Performance budgets and asset limits

.github/workflows/            # CI/CD pipelines
├── pages.yaml               # GitHub Pages deployment
└── codex-cron.yaml         # Automated maintenance
```

### Configuration Files
- `package.json` - Dependencies and npm scripts
- `vite.config.js` - Vite build configuration with GitHub Pages support
- `lighthouserc.json` - Lighthouse performance testing config
- `mcp_config.yaml` - Model Context Protocol server configuration
- `ops/policy.json` - Performance budgets and content policies

## Architecture Overview

### Technology Stack
- **Frontend**: React 18 + React Router 6 + Vite 6
- **Styling**: CSS (no framework)
- **Testing**: Playwright (when browsers available)
- **Performance**: Lighthouse CI with 90+ mobile score requirement
- **Accessibility**: axe-core for critical issue detection
- **Deployment**: GitHub Pages with SPA routing support

### Build System
- **Vite**: Ultra-fast development and build tool
- **Bundle Size**: Must stay under 250KB gzipped (currently ~70KB)
- **Performance**: Lighthouse mobile score ≥90 required
- **SPA Routing**: `404.html` fallback for GitHub Pages

### Content Policies (Enforced by CI)
- Images: Max 300KB each, alt text required
- Audio: Max 3MB each, transcripts required  
- Performance: Lighthouse mobile ≥90
- Accessibility: No critical axe-core violations
- Bundle: Max 250KB gzipped

## Development Workflows

### Making Changes
1. **Create feature branch**: `git checkout -b feature/your-feature-name`
2. **Install dependencies**: `make install`
3. **Start dev server**: `make dev`
4. **Make your changes** following coding standards
5. **Test locally**: `make build && make lint-content`
6. **Commit changes**: `git commit -m "feat: descriptive message"`
7. **Push and create PR**: `git push origin feature/your-feature-name`

### Pre-commit Validation
```bash
# Working validation commands (use these):
make lint-content && make build    # Content validation + build verification
# or manually:
make build                         # Verify build succeeds  
make lint-content                  # Verify content policies

# NOTE: make quick-check FAILS due to Playwright dependency - use above instead
```

### MCP Server Development
- Configuration: `mcp_config.yaml`
- Validation: `make mcp-config`
- Languages: Python and Go environments available in dev container
- Ports: 8000 (MCP server), 5173 (dev), 4173 (preview)

## Common Issues and Solutions

### Build Failures
- **Problem**: Vite build fails
- **Solution**: Check for missing dependencies with `npm install`
- **Timing**: Builds are very fast (1-2 seconds), slow builds indicate problems

### Content Linting Failures  
- **Problem**: Content lint fails
- **Solution**: Check `ops/policy.json` for limits and ensure:
  - Images have alt text in `data/feelings_items.json`
  - Image files <300KB, audio files <3MB
  - No missing required fields

### Development Server Issues
- **Problem**: Dev server won't start
- **Solution**: Check if port 5173 is available, kill existing processes

### Browser Testing Limitations
- **Problem**: Playwright tests fail with download errors
- **Solution**: This is expected in many environments - document as limitation
- **Never**: Spend time trying to fix browser installation issues

## Performance Requirements

### Bundle Size Monitoring
- Current: ~70KB gzipped (well under 250KB limit)
- Monitor build output for size increases
- Use code splitting for large features

### Lighthouse Scores (Mobile)
- Performance: ≥90 (enforced by CI)
- Accessibility: ≥90 (recommended)
- SEO: ≥90 (recommended)
- Best Practices: ≥90 (recommended)

## Accessibility Standards
- No critical axe-core violations allowed
- Focus management required
- Alt text required for all images
- Keyboard navigation support

## Frequently Used Commands Output

### Repository Root Listing
```
$ ls -la
total 120
drwxr-xr-x  17 user  staff   544 Aug 26 13:44 .
drwxr-xr-x   3 user  staff    96 Aug 26 13:44 ..
-rw-r--r--   1 user  staff   130 Aug 26 13:44 .gitignore
drwxr-xr-x   3 user  staff    96 Aug 26 13:44 .devcontainer
drwxr-xr-x   3 user  staff    96 Aug 26 13:44 .github
drwxr-xr-x   5 user  staff   160 Aug 26 13:44 .lighthouseci
-rw-r--r--   1 user  staff  7892 Aug 26 13:44 CONTRIBUTING.md
-rw-r--r--   1 user  staff  2999 Aug 26 13:44 Makefile
-rw-r--r--   1 user  staff  4983 Aug 26 13:44 README.md
-rw-r--r--   1 user  staff   918 Aug 26 13:44 SECURITY.md
drwxr-xr-x   4 user  staff   128 Aug 26 13:44 agents
drwxr-xr-x   5 user  staff   160 Aug 26 13:44 data
drwxr-xr-x   3 user  staff    96 Aug 26 13:44 dist
-rw-r--r--   1 user  staff   489 Aug 26 13:44 index.html
-rw-r--r--   1 user  staff  1396 Aug 26 13:44 lighthouserc.json
-rw-r--r--   1 user  staff  7306 Aug 26 13:44 mcp_config.yaml
drwxr-xr-x   3 user  staff    96 Aug 26 13:44 ops
-rw-r--r--   1 user  staff   847 Aug 26 13:44 package.json
drwxr-xr-x   4 user  staff   128 Aug 26 13:44 public
drwxr-xr-x   3 user  staff    96 Aug 26 13:44 specs
drwxr-xr-x   4 user  staff   128 Aug 26 13:44 src
drwxr-xr-x   3 user  staff    96 Aug 26 13:44 test-results
drwxr-xr-x   4 user  staff   128 Aug 26 13:44 tests
drwxr-xr-x   3 user  staff    96 Aug 26 13:44 tools
-rw-r--r--   1 user  staff   310 Aug 26 13:44 vite.config.js
```

### Package.json Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build", 
    "preview": "vite preview --port 4173",
    "postbuild": "cp dist/index.html dist/404.html 2>/dev/null || copy dist\\index.html dist\\404.html",
    "test": "playwright test",
    "test:axe": "playwright test tests/axe.spec.ts", 
    "test:lh": "vite preview --port 4173 & wait-on http://localhost:4173 && lhci autorun",
    "lint:content": "node tools/content-lint.mjs",
    "ci:all": "npm run build && npm run lint:content && npx playwright install --with-deps && vite preview --port 4173 & wait-on http://localhost:4173 && npm test && npm run test:axe && npm run test:lh"
  }
}
```

### Typical Build Output
```
$ npm run build
> vite build

vite v6.3.5 building for production...
transforming...
✓ 39 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                  1.66 kB │ gzip:  0.89 kB
dist/assets/index-DfoKwUkz.js  215.83 kB │ gzip: 70.35 kB
✓ built in 1.07s
```

## Environment Limitations

### Known Working Features
- ✅ Node.js and npm (v20.19.4 / v10.8.2)
- ✅ Vite development server (port 5173)
- ✅ Vite preview server (port 4173)  
- ✅ Production builds (1-2 seconds)
- ✅ Content linting (<1 second)
- ✅ MCP configuration validation
- ✅ Makefile commands
- ✅ GitHub Pages deployment (via CI)

### Known Failing Features  
- ❌ Playwright browser installation (download errors)
- ❌ End-to-end testing (requires browsers)
- ❌ Accessibility testing (requires browsers)
- ❌ Lighthouse testing (requires browsers)
- ❌ Full CI pipeline (requires browsers)

### Workarounds
- Use build + content lint for validation instead of full CI
- Test UI changes manually in preview mode
- Document E2E scenarios rather than running automated tests
- Focus on fast feedback loop with build + preview testing

## Success Criteria

When you've successfully implemented changes:

1. ✅ `make build` completes in 1-2 seconds without errors
2. ✅ `make lint-content` passes without violations  
3. ✅ `make preview` starts server and application loads correctly
4. ✅ Manual testing of key user flows works as expected
5. ✅ Bundle size remains under 250KB gzipped
6. ✅ No console errors in browser developer tools
7. ✅ All modified routes/components render correctly

**Remember**: The build is extremely fast in this project (~1-2 seconds). If builds are slow, something is wrong.