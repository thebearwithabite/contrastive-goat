# AutoGoat (Scaffolded)

Mobile-first PWA microsite for **"I Only Know What Happens Next"**.

Routes:
- `/` — intro
- `/predict` — Predict the Future Frame
- `/feelings` — Label the Feeling
- `/goat` — Contrastive Goat

## Quickstart
```bash
npm i
npm run dev
# open http://localhost:5173
```

## Build & Preview
```bash
npm run build
npm run preview
# open http://localhost:4173
```

## CI Gates
- Playwright smoke + axe a11y
- Lighthouse (mobile) via `lighthouserc.json`
- Content linter (size + alt text) via `ops/policy.json`

## Deploy (GitHub Pages)
- Push to `main`. Workflow `.github/workflows/pages.yaml` will build/test and deploy to Pages.
- SPA fallback handled by `404.html` (prebuild and postbuild).

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
