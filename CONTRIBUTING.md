# Contributing to Contrastive Goat

Thank you for your interest in contributing to this project! This document provides guidelines for development workflows, coding standards, commit practices, and CI processes.

## Development Setup

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/thebearwithabite/contrastive-goat.git
   cd contrastive-goat
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or using the Makefile
   make install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or using the Makefile
   make dev
   ```

4. **Run tests**
   ```bash
   npm run ci:all
   # or using the Makefile
   make test
   ```

### Development Container

For a consistent development environment, use the provided VS Code dev container:

1. Install the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
2. Open the project in VS Code
3. When prompted, click "Reopen in Container" or use Command Palette: "Dev Containers: Reopen in Container"

The dev container includes:
- Node.js environment for the React/Vite application
- Python and Go environments for MCP server development
- Pre-configured extensions and settings
- Automatic dependency installation

## Coding Standards

### JavaScript/React

- Use **ES6+ syntax** and modern React patterns
- Prefer **functional components** with hooks over class components
- Use **React Router** for navigation (already configured)
- Follow existing patterns in the codebase for consistency

### File Organization

```
src/
├── routes/          # Page components
├── components/      # Reusable UI components
├── utils/          # Utility functions
└── main.jsx        # Application entry point

data/               # Static data files
public/             # Public assets
tests/              # Test files
ops/                # Operations and policy configuration
```

### Accessibility

- All interactive elements must be keyboard accessible
- Images require `alt` text (enforced by content linter)
- Components must pass axe-core accessibility tests
- Focus management is required for dynamic content

### Performance

- Bundle size must stay under **250KB gzipped** (enforced by CI)
- Lighthouse mobile score must be **≥90** (enforced by CI)
- Images must be under **300KB** each
- Audio files must be under **3MB** each

## Commit Guidelines

### Commit Message Format

Use clear, descriptive commit messages:

```
type: brief description

Optional longer description explaining the change.

Fixes #issue-number (if applicable)
```

### Commit Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat: add contrastive learning game mode

Implements the core contrastive goat game with paired image selection
and scoring mechanism.

Fixes #123
```

```
fix: resolve accessibility issue in navigation

Adds proper ARIA labels and keyboard navigation support to main menu.
Ensures focus management meets WCAG 2.1 guidelines.
```

## CI/CD Process

### Automated Gates

All pull requests must pass these automated checks:

1. **Build** - Vite build must succeed
2. **Content Lint** - Images/audio within size limits, alt text present
3. **Playwright Tests** - Smoke tests and user flows
4. **Accessibility** - axe-core critical issues blocked
5. **Lighthouse** - Mobile performance score ≥90

### Running CI Locally

Before submitting a PR, run the full CI suite:

```bash
npm run ci:all
# or
make test
```

This will:
- Build the application
- Run content linting
- Install Playwright dependencies
- Start preview server
- Run smoke tests
- Run accessibility tests
- Run Lighthouse performance tests

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write code following the coding standards
   - Add tests for new functionality
   - Update documentation as needed

3. **Test locally**
   ```bash
   make test
   # or
   npm run ci:all
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: your descriptive commit message"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### MCP Server Development

For MCP (Model Context Protocol) server development:

1. **Configuration**: Use `mcp_config.yaml` for server settings
2. **Development**: Python and Go environments are available in the dev container
3. **Testing**: Include MCP-specific tests in your contributions
4. **Documentation**: Update MCP documentation in README.md

## Policy Configuration

The project uses policy-driven development with `ops/policy.json`:

- **Performance budgets** - Bundle size and Lighthouse scores
- **Accessibility requirements** - axe-core rules and focus management
- **Asset limits** - Image and audio file size constraints
- **Testing requirements** - Playwright test coverage

Changes to policies require team discussion and approval.

## Getting Help

- **Issues**: Check existing issues or create a new one
- **Discussions**: Use GitHub Discussions for questions
- **Code Review**: Tag reviewers for feedback on PRs

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help maintain a welcoming environment for all contributors

Thank you for contributing to Contrastive Goat! 🐐