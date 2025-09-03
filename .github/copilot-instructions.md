# Islamic Habits - Copilot Instructions

Islamic Habits is a React + TypeScript + Vite web application for tracking Islamic habits and daily practices. The app uses Tailwind CSS for styling and is deployed on Vercel.

**ALWAYS reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Prerequisites

- Node.js version 18.x, 20.x, or 22.x (tested with Node 20.19.4)
- npm 10.x+ (tested with npm 10.8.2)

### Bootstrap and Build Process

1. **Install dependencies:**

   ```bash
   npm install
   ```

   - Takes ~33 seconds (first install) or ~1 second (subsequent installs). NEVER CANCEL. Set timeout to 60+ seconds.
   - May show moderate security vulnerabilities - these are acceptable for this project
   - Will show "71 packages are looking for funding" - this is normal

2. **Type checking:**

   ```bash
   npm run typecheck
   ```

   - Takes ~1.3 seconds. Quick validation of TypeScript types.
   - Use this before making TypeScript changes

3. **Linting:**

   ```bash
   npm run lint
   ```

   - Takes ~1 second. Runs ESLint for code quality
   - ALWAYS run this before committing changes or CI will fail

4. **Code formatting:**

   ```bash
   npm run format
   ```

   - Takes ~0.6 seconds. Runs Prettier formatting
   - ALWAYS run this before committing changes or CI will fail

5. **Build for production:**

   ```bash
   npm run build
   ```

   - Takes ~1.6 seconds. NEVER CANCEL. Set timeout to 120+ seconds.
   - Outputs to `dist/` directory
   - Includes assets with hashed filenames for caching

### Development Workflow

#### Development Server

```bash
npm run dev
```

- Starts Vite dev server on http://localhost:5173/
- Hot module replacement enabled
- Browser opens automatically (configured in vite.config.ts)
- ALWAYS test functionality after making changes

#### Preview Server (Production Build Testing)

```bash
npm run preview
```

- Serves the production build on http://localhost:4173/
- Use this to test production build behavior locally
- Run after `npm run build`

### Validation Requirements

After making any changes, ALWAYS run this validation sequence:

1. `npm run typecheck` - Ensure no TypeScript errors
2. `npm run lint` - Check code quality
3. `npm run format` - Format code consistently
4. `npm run build` - Verify production build works
5. Test the application manually by:
   - Starting dev server: `npm run dev`
   - Opening http://localhost:5173/
   - Clicking the "Count" button to verify functionality
   - Checking that the counter increments correctly

**CRITICAL**: The GitHub Actions CI (.github/workflows/node.js.yml) runs `npm test` but there is NO test script defined in package.json. This causes CI failures. Do NOT add a test script unless specifically requested - document this limitation instead.

## Codebase Structure

### Key Files and Directories

```
├── src/
│   ├── App.tsx           # Main React component with counter functionality
│   ├── main.tsx          # React app entry point
│   └── index.css         # Tailwind CSS imports
├── .github/
│   └── workflows/
│       └── node.js.yml   # CI workflow (has test issue - no test script)
├── dist/                 # Build output directory (generated)
├── index.html           # HTML template
├── package.json         # Project configuration and scripts
├── vite.config.ts       # Vite bundler configuration
├── tailwind.config.ts   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
├── eslint.config.js     # ESLint configuration
├── .prettierrc          # Prettier configuration
├── vercel.json          # Vercel deployment configuration
└── README.md           # Project documentation
```

### Important Code Locations

- **Main application logic**: `src/App.tsx`
  - Contains the habit counter functionality
  - Uses React hooks (useState)
  - Styled with Tailwind CSS classes
- **TypeScript configuration**: Import paths should NOT include `.tsx` extension
  - ❌ Wrong: `import App from './App.tsx'`
  - ✅ Correct: `import App from './App'`
- **Styling**: All styling uses Tailwind CSS utility classes
- **Routing**: Single page application - no routing configured

### Development Environment Details

- **Vite server**: Configured to run on port 5173 with auto-open
- **Alias configuration**: `@/` points to `src/` directory
- **Build output**: Static files in `dist/` directory
- **Hot reload**: Enabled for all file changes

## Common Issues and Workarounds

### TypeScript Import Extensions

- **Issue**: TypeScript compiler rejects `.tsx` extensions in imports
- **Solution**: Always import without file extensions: `import App from './App'`

### CI Test Failures

- **Issue**: GitHub Actions runs `npm test` but no test script exists
- **Workaround**: This is expected behavior. CI will fail on the test step
- **Fix**: DO NOT add test script unless specifically requested

### Build Performance

- **Issue**: Build seems fast but don't cancel prematurely
- **Solution**: Always wait for complete build output showing file sizes

## Deployment

### Vercel Deployment

- **Configuration**: `vercel.json` contains deployment settings
- **Build command**: `npm run build`
- **Output directory**: `dist`
- **SPA routing**: Configured to serve `index.html` for all routes

### Custom Domain Setup

- See `CNAME_SETUP.md` for detailed Cloudflare + Vercel configuration
- See `domains/README.md` for quick setup reference

## Validation Scenarios

### Basic Functionality Test

1. Start development server: `npm run dev`
2. Navigate to http://localhost:5173/
3. Verify page loads with "Islamic Habits" title
4. Click the "Count: 0" button
5. Verify counter increments to "Count: 1"
6. Verify no console errors

### Production Build Test

1. Build the project: `npm run build`
2. Check `dist/` directory contains generated files
3. Start preview server: `npm run preview`
4. Navigate to http://localhost:4173/
5. Test the same functionality as development

### Code Quality Test

```bash
npm run typecheck && npm run lint && npm run format
```

All commands should complete without errors.

## Quick Reference Commands

```bash
# Full development setup from fresh clone
npm install
npm run typecheck
npm run lint
npm run format
npm run build
npm run dev

# Pre-commit validation
npm run typecheck && npm run lint && npm run format && npm run build

# Start development
npm run dev

# Test production build
npm run build && npm run preview
```

## Repository Insights from package.json

```json
{
  "name": "islamic-habits",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit",
    "lint": "eslint .",
    "format": "prettier -w ."
  }
}
```

**Note**: No test script defined - this causes CI failures but is expected behavior.
