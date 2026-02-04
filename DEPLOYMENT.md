# Deployment Guide

This guide explains how to deploy typetify to npm and manage releases on GitHub.

## Prerequisites

1. **npm account**: Create an account at [npmjs.com](https://www.npmjs.com/)
2. **GitHub repository**: Push your code to GitHub
3. **npm token**: Generate an automation token from npm

## Initial Setup

### 1. Update package.json

Replace placeholders in `package.json`:
- `"author"`: Your name and email
- Repository URLs: Replace `yourusername` with your GitHub username

### 2. Configure npm Token

1. Go to [npmjs.com](https://www.npmjs.com/) → Account → Access Tokens
2. Generate a new **Automation** token
3. Add it to GitHub Secrets:
   - Go to your GitHub repo → Settings → Secrets and variables → Actions
   - Create a new secret named `NPM_TOKEN`
   - Paste your npm token

### 3. Initialize Git Repository

```bash
cd /Users/hosmann/Projects/Typetify
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/typetify.git
git push -u origin main
```

## Publishing to npm

### Method 1: Manual Publishing

```bash
# Ensure everything is ready
npm run typecheck
npm test
npm run build

# Login to npm (first time only)
npm login

# Publish
npm publish
```

### Method 2: Automated Publishing via GitHub Release

1. **Update version** in `package.json`:
   ```bash
   npm version patch  # 0.1.0 → 0.1.1
   npm version minor  # 0.1.0 → 0.2.0
   npm version major  # 0.1.0 → 1.0.0
   ```

2. **Push the version tag**:
   ```bash
   git push && git push --tags
   ```

3. **Create a GitHub Release**:
   - Go to your GitHub repo → Releases → Create a new release
   - Choose the tag you just pushed
   - Add release notes
   - Publish release

4. **GitHub Actions will automatically**:
   - Run tests
   - Build the package
   - Publish to npm

## Version Management

Follow [Semantic Versioning](https://semver.org/):

- **Patch** (0.1.0 → 0.1.1): Bug fixes
- **Minor** (0.1.0 → 0.2.0): New features (backward compatible)
- **Major** (0.1.0 → 1.0.0): Breaking changes

## CI/CD Workflows

### Continuous Integration (`.github/workflows/ci.yml`)
- Runs on every push and pull request
- Tests on Node.js 18.x and 20.x
- Runs type checking, tests, and builds

### Publish Workflow (`.github/workflows/publish.yml`)
- Triggers on GitHub release creation
- Automatically publishes to npm
- Requires `NPM_TOKEN` secret

## Pre-publish Checklist

Before publishing a new version:

- [ ] All tests pass (`npm test`)
- [ ] Type checking passes (`npm run typecheck`)
- [ ] Build succeeds (`npm run build`)
- [ ] README.md is up to date
- [ ] CHANGELOG updated (if you create one)
- [ ] Version bumped in package.json
- [ ] Git committed and pushed

## Troubleshooting

### "Package name already exists"
If `typetify` is taken on npm, update the `name` field in `package.json` to something unique (e.g., `@yourusername/typetify`).

### "Authentication failed"
Ensure your `NPM_TOKEN` is:
- An **Automation** token (not Classic or Publish)
- Correctly added to GitHub Secrets
- Not expired

### Build fails in CI
Check that all dependencies are in `package.json` and not just installed locally.

## Post-publish

After publishing:
1. Verify the package on npm: `https://www.npmjs.com/package/typetify`
2. Test installation: `npm install typetify` in a new project
3. Update documentation site (if applicable)
4. Announce the release

## Unpublishing (Emergency Only)

```bash
# Unpublish a specific version (within 72 hours)
npm unpublish typetify@0.1.0

# Deprecate instead (preferred)
npm deprecate typetify@0.1.0 "Use version 0.1.1 instead"
```

**Note**: Unpublishing is discouraged and only allowed within 72 hours of publishing.
