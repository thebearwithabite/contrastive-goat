# GitHub Copilot Instructions for Contrastive Goat

## Project Overview

Contrastive Goat is a mobile-first PWA microsite with integrated MCP (Model Context Protocol) server support. The project focuses on accessibility, performance, and modern React development patterns.

## Technologies & Architecture

### Frontend Stack
- **React 18** with functional components and hooks
- **Vite 6.x** for fast development and optimized builds
- **React Router 6.x** for client-side navigation
- **Service Worker** for offline PWA capabilities
- **Responsive design** with mobile-first approach

### Backend/MCP Stack
- **Python/FastAPI** for MCP server development
- **Go** environment available for additional MCP services
- **Multi-model support** for AI tasks (contrastive learning, classification, generative)
- **WebSocket and REST API** integration

### Development Environment
- **Dev Container** with Node.js 20, Python 3.11, Go 1.21
- **Playwright** for end-to-end testing and accessibility
- **Lighthouse CI** for performance monitoring
- **Content validation** for accessibility compliance

## Coding Standards & Conventions

### React/JavaScript Patterns
- Use **functional components** with hooks, avoid class components
- Prefer **ES6+ syntax** and modern JavaScript patterns
- Use **React Router** for navigation (already configured)
- Follow existing file organization patterns in `src/`
- Export components as default exports
- Use descriptive component and function names

### File Organization
```
src/
├── routes/          # Page components (one per route)
├── components/      # Reusable UI components
├── utils/          # Utility functions and helpers
└── main.jsx        # Application entry point

data/               # Static JSON data files
public/             # Public assets and static files
tests/              # Playwright test files
ops/                # Policy and operations configuration
```

### Component Structure
```jsx
// Preferred component pattern
import { useState, useEffect } from 'react';

function ComponentName({ prop1, prop2 }) {
  const [state, setState] = useState(initialValue);
  
  useEffect(() => {
    // Side effects here
  }, [dependencies]);
  
  return (
    <div className="component-wrapper">
      {/* Component JSX */}
    </div>
  );
}

export default ComponentName;
```

### Accessibility Requirements (Critical)
- **All interactive elements** must be keyboard accessible
- **Images require `alt` attributes** (enforced by content linter)
- **Focus management** required for dynamic content and modals
- **ARIA labels** for complex interactions
- **Semantic HTML** elements preferred over divs when possible
- Components must pass **axe-core accessibility tests**
- Color contrast ratios must meet WCAG AA standards

### Performance Requirements (Critical)
- **Bundle size limit**: 250KB gzipped (enforced by CI)
- **Lighthouse mobile score**: ≥90 (enforced by CI)
- **Image files**: Under 300KB each
- **Audio files**: Under 3MB each
- Optimize imports and avoid unnecessary dependencies
- Use lazy loading for routes and heavy components

## Development Workflow

### Branch and Commit Strategy
1. Create feature branches: `git checkout -b feature/your-feature-name`
2. Use conventional commits: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`
3. Test locally before pushing: `npm run ci:all` or `make test`
4. Keep commits atomic and focused

### Testing Requirements
- **Add tests for new functionality** using Playwright
- **Update existing tests** when modifying behavior
- **Run accessibility tests**: `npm run test:axe`
- **Verify performance**: `npm run test:lh`
- **Content validation**: `npm run lint:content`

### MCP Server Development
- Use `mcp_config.yaml` for server configuration
- Python and Go environments available in dev container
- Include MCP-specific tests for new server functionality
- Update MCP documentation in README.md
- Follow async/await patterns for server endpoints

## Quick Commands Reference

### Development
```bash
npm run dev          # Start Vite development server
npm run build        # Build for production
npm run preview      # Preview production build
make dev            # Alternative: start dev server
make build          # Alternative: build project
```

### Testing
```bash
npm run ci:all       # Full CI pipeline (use before committing)
npm run test         # Playwright tests
npm run test:axe     # Accessibility tests
npm run test:lh      # Lighthouse performance tests
make test           # Alternative: run all tests
```

### MCP Server
```bash
make mcp-config     # Validate MCP configuration
make mcp-server     # Start MCP server (when implemented)
```

## Common Patterns & Examples

### Adding a New Route
1. Create component in `src/routes/`
2. Add route to router configuration in `src/main.jsx`
3. Update navigation if needed
4. Add corresponding test in `tests/`

### Data Integration
- Use JSON files in `data/` directory for static content
- Import data files directly: `import data from '../data/filename.json'`
- Validate data structure matches existing patterns
- Ensure images have alt text in data files

### Policy Compliance
- Check `ops/policy.json` for content and performance budgets
- Validate new images/assets meet size requirements
- Ensure accessibility standards are maintained
- Test performance impact with Lighthouse

### Error Handling
- Use try/catch for async operations
- Provide user-friendly error messages
- Maintain application stability on failures
- Log errors appropriately for debugging

## Getting Started for New Contributors

1. **Setup Development Environment**
   - Use the dev container for consistent environment
   - Run `npm install` to install dependencies
   - Start with `npm run dev` for development

2. **Understand the Project**
   - Read README.md and CONTRIBUTING.md thoroughly
   - Explore existing routes and components in `src/`
   - Review data files to understand content structure

3. **Run Tests Early**
   - Execute `npm run ci:all` to ensure everything works
   - Check that accessibility and performance tests pass
   - Familiarize yourself with the testing patterns

4. **Follow Existing Patterns**
   - Study existing components for coding style
   - Maintain consistency with established patterns
   - Respect accessibility and performance requirements

## Key Reminders

- **Never sacrifice accessibility** for functionality or aesthetics
- **Performance budgets are enforced** by CI - respect them
- **Test thoroughly** with the full CI suite before committing
- **Follow React best practices** with hooks and functional components
- **Mobile-first approach** is essential for this PWA
- **MCP integration** should be considered for AI-related features
- **Keep changes minimal** and focused on specific functionality

## Resources

- [CONTRIBUTING.md](../../CONTRIBUTING.md) - Detailed development guidelines
- [README.md](../../README.md) - Project overview and setup
- [mcp_config.yaml](../../mcp_config.yaml) - MCP server configuration
- [ops/policy.json](../../ops/policy.json) - Content and performance policies