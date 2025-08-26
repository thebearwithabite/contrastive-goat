# Contrastive Goat - GitHub Copilot Instructions

Mobile-first PWA microsite for **"I Only Know What Happens Next"** - a React application with contrastive learning experiments.

**ALWAYS reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Bootstrap and Build
Run these commands in sequence to set up the development environment:

1. **Install dependencies**: `npm install` -- takes ~3 seconds
2. **Build application**: `npm run build` -- takes ~2 seconds, builds to `dist/` directory
3. **Run content linting**: `npm run lint:content` -- takes <1 second, validates assets and alt text

### Development Server
- **Start dev server**: `npm run dev` -- starts on http://localhost:5173/, includes hot reload
- **Start preview server**: `npm run preview` -- starts on http://localhost:4173/, serves built version

### Testing
- **Playwright tests**: `npm test` -- requires `npx playwright install --with-deps` first
- **Accessibility tests**: `npm run test:axe` -- runs axe-core a11y checks on all routes
- **Lighthouse tests**: `npm run test:lh` -- performance/SEO analysis, requires preview server running
- **Content linting**: `npm run lint:content` -- validates image sizes and alt text requirements

### Full CI Pipeline
- **Complete CI**: `npm run ci:all` -- NEVER CANCEL: runs full build + test + lint pipeline
- **Expected time**: 5-10 minutes when Playwright browsers install successfully
- **Timeout recommendation**: Set to 15+ minutes minimum

## Known Issues and Workarounds

### Playwright Installation
- **Issue**: `npx playwright install --with-deps` may fail due to download issues
- **Workaround**: Playwright browser install failures do not prevent application functionality
- **Alternative**: Use manual testing via browser at http://localhost:4173/ or http://localhost:5173/

### Test Commands When Playwright Fails
If Playwright installation fails, tests will fail with "Executable doesn't exist" errors. The application still works correctly for manual testing.

## Application Routes and Validation

The application has 4 main routes that should be tested after making changes:

### Routes to Validate
1. **Home** (`/`) - Welcome page with navigation to experiments
2. **Predict** (`/predict`) - "Predict the Future Frame" game
3. **Feelings** (`/feelings`) - "Label the Feeling" sorting interface  
4. **Goat** (`/goat`) - "Contrastive Goat" sequence prediction game

### Manual Validation Steps
After making changes, ALWAYS validate functionality by:

1. **Start preview server**: `npm run preview`
2. **Navigate to each route** and verify:
   - Page loads without errors
   - Navigation works between all routes
   - Interactive elements are functional
   - Content displays correctly
3. **Test user interactions**:
   - Click buttons in Predict game
   - Drag/drop functionality in Feelings game  
   - Answer questions in Goat game
   - Export Events button functionality

## Repository Structure

### Key Directories
- `src/` - React application source code
  - `src/routes/` - Page components (App.jsx, Home.jsx, Predict.jsx, Feelings.jsx, Goat.jsx)
  - `src/main.jsx` - Application entry point
- `data/` - Game data files
  - `predict_sets.json` - Future frame prediction data
  - `feelings_items.json` - Feeling categorization data  
  - `goat_pairs.json` - Goat sequence data
- `tests/` - Playwright test suites
  - `smoke.spec.ts` - Basic functionality tests
  - `axe.spec.ts` - Accessibility tests
- `ops/policy.json` - Content policy and budgets
- `tools/content-lint.mjs` - Custom content linting script
- `.github/workflows/pages.yaml` - GitHub Pages deployment

### Configuration Files
- `package.json` - Dependencies and npm scripts
- `vite.config.js` - Vite build configuration
- `lighthouserc.json` - Lighthouse CI configuration
- `ops/policy.json` - Asset size limits and accessibility requirements

## Content Policy and Budgets

The application enforces strict content policies via `ops/policy.json`:

- **Image size limit**: 300KB max
- **Audio size limit**: 3MB max  
- **Alt text**: Required for all images
- **Lighthouse mobile score**: 90+ required
- **Bundle size**: 250KB gzipped max

**ALWAYS run `npm run lint:content` before committing changes** to validate against these policies.

## Build Optimization

### Build Process
1. Vite builds React app to `dist/`
2. Postbuild copies `index.html` to `404.html` for SPA routing
3. Generates optimized bundle ~213KB (~69KB gzipped)

### GitHub Pages Deployment
- Deployment triggers on push to `main` branch
- Uses `.github/workflows/pages.yaml`
- Sets `VITE_BASE=/contrastive-goat/` for correct asset paths
- Includes SPA fallback via `404.html`

## Common Commands Summary

```bash
# Quick setup
npm install                    # 3 seconds
npm run build                  # 2 seconds  
npm run lint:content          # <1 second

# Development
npm run dev                   # Start dev server (localhost:5173)
npm run preview              # Start preview server (localhost:4173)

# Testing (requires Playwright browsers)
npm test                     # Playwright smoke tests
npm run test:axe            # Accessibility tests
npm run test:lh             # Lighthouse tests (needs preview server)

# Full pipeline
npm run ci:all              # NEVER CANCEL: 5-10 minutes
```

## Emergency Commands

If builds fail or tests break:

1. **Reset dependencies**: `rm -rf node_modules package-lock.json && npm install`
2. **Clean build**: `rm -rf dist && npm run build`
3. **Manual validation**: Start `npm run preview` and test routes manually
4. **Skip Playwright**: Run `npm run lint:content` and `npm run test:lh` only

## PWA Features

The application includes Progressive Web App features:
- Service worker for offline caching (`public/sw.js`)
- Web app manifest (`public/manifest.webmanifest`)
- Mobile-first responsive design
- Optimized for GitHub Pages subpath deployment

Always test PWA functionality after making changes to routing or asset loading.