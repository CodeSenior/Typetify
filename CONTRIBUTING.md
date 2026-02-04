# Contributing to typetify

Thank you for your interest in contributing to typetify! We welcome contributions from the community.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/typetify.git
   cd typetify
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```

## Development Workflow

### Running Tests

```bash
npm test              # Run tests once
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

### Type Checking

```bash
npm run typecheck
```

### Building

```bash
npm run build
```

## Code Guidelines

1. **Write tests** for all new functionality
2. **Follow TypeScript best practices**:
   - Use strict typing
   - Avoid `any` types
   - Provide proper JSDoc comments
3. **Keep functions small and focused**
4. **Ensure backward compatibility** unless it's a breaking change
5. **Update documentation** in README.md if needed

## Commit Messages

Use clear and descriptive commit messages:
- `feat: add new function X`
- `fix: resolve issue with Y`
- `docs: update README for Z`
- `test: add tests for W`
- `refactor: improve performance of V`

## Pull Request Process

1. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. **Make your changes** and commit them
3. **Push to your fork**:
   ```bash
   git push origin feat/your-feature-name
   ```
4. **Open a Pull Request** on GitHub
5. **Ensure CI passes** (tests, type checking, build)
6. **Wait for review** and address any feedback

## Adding New Functions

When adding a new utility function:

1. **Create the function file** in the appropriate category folder (e.g., `src/collection/`, `src/async/`)
2. **Write comprehensive tests** in `tests/[category]/[function].test.ts`
3. **Export from category index** in `src/[category]/index.ts`
4. **Export from main index** in `src/index.ts`
5. **Update README.md** with usage examples
6. **Update tsup.config.ts** if adding a new category

## Questions?

Feel free to open an issue for any questions or discussions about contributing.

## Code of Conduct

Be respectful and constructive in all interactions. We're here to build something useful together.
