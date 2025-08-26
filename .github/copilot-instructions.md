# AutoGoat (Contrastive Goat) - Mobile-first PWA Microsite

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

This is a React PWA microsite called "I Only Know What Happens Next" with three contrastive learning experiments: Predict the Future Frame, Label the Feeling, and Contrastive Goat. It's deployed to GitHub Pages at `/contrastive-goat/` subpath.

## Working Effectively

### Bootstrap, Build, and Test
- Dependencies are managed via npm. Repository includes `package-lock.json`.
- `npm install` - Install dependencies. Takes ~30 seconds. NEVER CANCEL - set timeout to 60+ seconds.
- `npm run build` - Build for production. Takes ~2 seconds. Output goes to `dist/` directory.
- `npm run lint:content` - Run content linting via custom script. Takes <1 second.

### Development Servers
- `npm run dev` - Start development server on http://localhost:5173/. Ready in ~200ms.
- `npm run preview` - Start preview server for built app on http://localhost:4173/. Instant startup.
- Both servers support hot reload and serve all routes correctly.

### Testing Infrastructure
- **KNOWN ISSUE**: Playwright browser installation fails due to network download issues in sandboxed environments.
- **WORKAROUND**: Manual validation is required for browser-dependent tests.
- `npm test` - Runs Playwright tests (requires browser installation that often fails).
- `npm run test:axe` - Runs accessibility tests with axe-core.
- `npm run test:lh` - Runs Lighthouse performance tests.
- **NEVER CANCEL**: Test suite may take 5-15 minutes when browsers are available. Set timeout to 30+ minutes.

### Full CI Pipeline
- `npm run ci:all` - Complete CI pipeline: build + lint + install browsers + preview + test + axe + lighthouse.
- **NEVER CANCEL**: Full pipeline takes 10-20 minutes. Set timeout to 45+ minutes.
- Often fails on browser installation step - this is a known environmental limitation.

## Application Structure

### Routes and Functionality
- `/` - Home page with welcome and navigation to three experiments
- `/predict` - "Predict the Future Frame" experiment
- `/feelings` - "Label the Feeling" experiment  
- `/goat` - "Contrastive Goat" experiment

### Key Files
- `src/main.jsx` - React app entry point
- `src/routes/` - Page components (Home.jsx, Predict.jsx, Feelings.jsx, Goat.jsx, App.jsx)
- `data/` - JSON data files for experiments:
  - `feelings_items.json` - Items for feeling labeling (4 items)
  - `goat_pairs.json` - Goat sequence data (3 items)  
  - `predict_sets.json` - Prediction sets data (2 items)
- `public/` - Static assets including PWA manifest and service worker
- `tools/content-lint.mjs` - Custom content linting script
- `ops/policy.json` - Policy configuration for budgets and requirements

### Configuration Files
- `vite.config.js` - Vite bundler config with GitHub Pages base path support
- `lighthouserc.json` - Lighthouse CI configuration
- `package.json` - Dependencies and scripts
- `.github/workflows/pages.yaml` - GitHub Pages deployment workflow

## Validation Scenarios

### Manual Testing Requirements
Always test the following scenarios after making changes:

1. **Basic Navigation**:
   - Start preview server: `npm run preview`
   - Visit http://localhost:4173/ and verify home page loads
   - Navigate to each route (/predict, /feelings, /goat) and verify they load without errors
   - Check that all navigation links work correctly

2. **Data Integrity**: 
   - Validate all JSON data files load correctly:
   ```bash
   node -e "
   const fs = require('fs');
   ['data/feelings_items.json', 'data/goat_pairs.json', 'data/predict_sets.json'].forEach(f => {
     const data = JSON.parse(fs.readFileSync(f, 'utf8'));
     console.log('✓', f, 'valid with', Array.isArray(data) ? data.length : Object.keys(data).length, 'items');
   });
   "
   ```

3. **Build Validation**:
   - Run full build: `npm run build && npm run lint:content`
   - Start preview server and verify all routes work
   - Check that `dist/404.html` exists (SPA fallback)

4. **Content Policy Compliance**:
   - Run `npm run lint:content` to verify images ≤300KB, audio ≤3MB, alt text present
   - Policy defined in `ops/policy.json`

## Known Issues and Limitations

### Playwright Browser Installation
- **ISSUE**: `npx playwright install` consistently fails with download errors in sandboxed environments
- **IMPACT**: Cannot run automated browser tests (`npm test`, `npm run test:axe`, `npm run test:lh`)
- **WORKAROUND**: Use manual validation instead - test routes via curl or browser
- **DO NOT**: Attempt to fix browser download issues - it's an environmental limitation

### GitHub Pages Deployment
- App deployed to subpath `/contrastive-goat/` via `VITE_BASE` environment variable
- Service worker and manifest use relative paths to support subpath deployment
- SPA routing handled by copying `index.html` to `404.html` in postbuild step

## Development Workflow

### Before Making Changes
1. Run `npm run build` to ensure baseline works (~2 seconds)
2. Run `npm run lint:content` to check content policy compliance (<1 second)
3. Start preview server and manually test affected routes

### After Making Changes  
1. Run `npm run build` to verify build still works
2. Run `npm run lint:content` if you modified data files or assets
3. Test manually by starting preview server and exercising the changed functionality
4. If modifying CSS/styling, verify across all four routes

### Release Readiness
- Build succeeds: `npm run build`
- Content linting passes: `npm run lint:content`  
- Manual route testing passes for all routes
- If possible, run `npm run ci:all` (may fail on browser installation)

## Performance and Accessibility

### Budgets (from ops/policy.json)
- Lighthouse mobile score: ≥90
- Main bundle size: ≤250KB gzipped
- Images: ≤300KB each
- Audio: ≤3MB each
- Alt text required for all images
- Critical accessibility violations blocked

### Lighthouse Testing
- Run `npm run test:lh` when browsers available
- Tests performance on all four main routes
- Requires preview server running on port 4173

## Agents and AI Integration

### Codex AI Agent
- Located in `agents/codex/` directory
- Requires `CODEX_API_KEY` environment variable
- Run with `agents/codex/run.sh scaffold` or `agents/codex/run.sh fix`
- Uses prompts in `agents/codex/prompts/` for system instructions
- Configured to honor accessibility and performance budgets

## Common Commands Reference

```bash
# Development
npm install              # Install dependencies (~30s)
npm run dev             # Start dev server (port 5173)
npm run build           # Production build (~2s)
npm run preview         # Preview built app (port 4173)

# Validation  
npm run lint:content    # Content policy check (<1s)
npm test               # Playwright tests (requires browsers)
npm run test:axe       # Accessibility tests (requires browsers)
npm run test:lh        # Lighthouse tests (requires browsers)

# Full pipeline
npm run ci:all         # Complete CI pipeline (10-20 mins, may fail on browsers)

# Manual data validation
node -e "require('fs').readdirSync('data').forEach(f => console.log(f, JSON.parse(require('fs').readFileSync('data/'+f)).length))"
```

## Important Notes

- **NEVER CANCEL** builds or tests - they complete quickly but may appear to hang
- Always use manual validation when automated tests fail due to browser issues  
- Content linting is strictly enforced - run before committing changes
- PWA features include service worker and web app manifest
- GitHub Pages deployment is automatic on push to main branch