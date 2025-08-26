# AutoGoat - Contrastive Learning PWA

Mobile-first Progressive Web App featuring three interactive contrastive learning games: **Predict the Future Frame**, **Label the Feeling**, and **Contrastive Goat**. Built with React + Vite and optimized for performance with comprehensive testing.

**Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Quick Setup & Build
Bootstrap and validate the application:
```bash
npm install                    # Install dependencies (~3 seconds)
npm run build                  # Build for production (~2 seconds) 
npm run lint:content           # Validate content policy (instant)
```

### Development
```bash
npm run dev                    # Start dev server on http://localhost:5173
npm run preview               # Preview built app on http://localhost:4173
```

### Critical Build Information
- **Build time: ~2 seconds** - This is an extremely fast build. NEVER CANCEL builds.
- **Install time: ~3 seconds** - Dependencies install very quickly.
- Set timeout to **60 seconds minimum** for any build commands to be safe.

### Testing & Validation  
**IMPORTANT**: Playwright browser installation may fail in some environments due to download issues. This is normal - tests will work in CI but may not work locally.

```bash
# Content validation (always works)
npm run lint:content

# Playwright tests (may fail locally due to browser download issues)
npx playwright install --with-deps    # May fail - document as known issue
npm run test                          # Smoke tests
npm run test:axe                      # Accessibility tests

# Full CI pipeline (may fail locally on Playwright step)  
npm run ci:all                        # NEVER CANCEL - Set timeout to 30+ minutes
```

**If Playwright installation fails**: Document this as a known limitation. Tests will work in GitHub Actions CI but not in local development environments with restricted network access.

## Manual Validation Scenarios

**ALWAYS manually test these scenarios after making changes:**

### 1. Navigation Test
- Load http://localhost:5173/ (dev) or http://localhost:4173/ (preview)
- Verify all navigation links work: Home, Predict, Feelings, Goat
- Confirm smooth transitions between routes

### 2. Interactive Functionality Test
**Predict Game**: 
- Navigate to `/predict`
- Click any answer button (e.g., "ripples spread")
- Verify score increments and new question loads
- Verify analytics logging in browser console

**Feelings Game**:
- Navigate to `/feelings` 
- Drag/click items between piles
- Verify items move correctly between "Pile A" and "Pile B"

**Goat Game**:
- Navigate to `/goat`
- Click "Left was next" or "Right was next" buttons
- Verify score updates and new goat images load

### 3. Performance Validation
- Check Network tab: Initial load should be under 250KB gzipped
- Verify PWA functionality: service worker registers correctly
- Test mobile responsive design at 375px width

## Routes & Application Structure

### Main Routes
- `/` - Welcome page with game introductions
- `/predict` - Predict the Future Frame game
- `/feelings` - Label the Feeling sorting game  
- `/goat` - Contrastive Goat sequence game

### Key Files & Directories
- `src/main.jsx` - Application entry point with React Router setup
- `src/routes/` - Individual route components
- `data/*.json` - Game data files (predict_sets.json, feelings_items.json, goat_pairs.json)
- `public/sw.js` - Service worker for PWA functionality
- `ops/policy.json` - Performance and accessibility budgets
- `tests/*.spec.ts` - Playwright test files

## Content & Asset Policy

Content must comply with `ops/policy.json`:
- Images: Max 300KB each
- Audio: Max 3MB each  
- Alt text required for all images
- Lighthouse mobile score: ≥90 required

**Always run `npm run lint:content` before committing changes.**

## Deployment & CI

### GitHub Pages Deployment
- Deploys automatically on push to `main` branch
- Uses `.github/workflows/pages.yaml` 
- Sets `VITE_BASE=/contrastive-goat/` for GitHub Pages subpath
- SPA routing handled by copying `index.html` to `404.html`

### CI Pipeline
The full CI runs: build → content lint → Playwright install → tests → accessibility → Lighthouse
```bash
npm run ci:all   # Full pipeline - NEVER CANCEL, set 30+ minute timeout
```

## Common Tasks

### Adding New Game Content
1. Update appropriate JSON file in `data/` directory
2. Run `npm run lint:content` to validate  
3. Test manually by playing the updated game
4. Ensure alt text is provided for any new images

### Debugging Build Issues
- Check `vite.config.js` for build configuration
- Verify `base` path is correct for deployment target
- Build outputs to `dist/` directory
- 404.html is auto-generated for SPA routing

### Performance Optimization  
- Monitor bundle size: current target is 213KB gzipped
- Check Lighthouse scores with `npm run test:lh`
- Verify policy compliance with `npm run lint:content`

## Known Issues & Limitations

### Playwright Browser Installation
**Issue**: `npx playwright install` may fail with download errors in restricted environments.
**Workaround**: Tests will work in GitHub Actions CI. Document this limitation for local development.
**Error Message**: "Download failed: size mismatch" or "Download failure, code=1"

### Environment Requirements
- Node.js (version specified in `.github/workflows/pages.yaml`)
- Modern browser with ES modules support
- Network access for dependency installation

## Quick Reference

### Port Usage
- Development: `http://localhost:5173`
- Preview: `http://localhost:4173`  
- Test server: `http://localhost:4173` (used by Playwright and Lighthouse)

### File Size Limits (ops/policy.json)
- Images: 300KB max
- Audio: 3MB max  
- Main bundle: 250KB gzipped target

### Required Scores
- Lighthouse mobile: ≥90
- Accessibility: Zero critical violations
- Performance budget: Enforced by content linter

Always test the complete user journey through at least one game after making changes to ensure functionality remains intact.