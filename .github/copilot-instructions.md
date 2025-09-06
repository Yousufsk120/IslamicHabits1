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

   - Takes ~42 seconds (first install) or ~1 second (subsequent installs). NEVER CANCEL. Set timeout to 60+ seconds.
   - Shows "2 moderate severity vulnerabilities" - these are acceptable for this project
   - Will show "71 packages are looking for funding" - this is normal

2. **Type checking:**

   ```bash
   npm run typecheck
   ```

   - Takes ~2.6 seconds. Quick validation of TypeScript types.
   - Use this before making TypeScript changes

3. **Linting:**

   ```bash
   npm run lint
   ```

   - Takes ~1.3 seconds. Runs ESLint for code quality
   - Shows 11 warnings (0 errors) - these are existing unused variable warnings, acceptable
   - ALWAYS run this before committing changes or CI will fail

4. **Code formatting:**

   ```bash
   npm run format
   ```

   - Takes ~0.9 seconds. Runs Prettier formatting
   - ALWAYS run this before committing changes or CI will fail

5. **Build for production:**

   ```bash
   npm run build
   ```

   - Takes ~3.6 seconds. NEVER CANCEL. Set timeout to 120+ seconds.
   - Outputs to `dist/` directory
   - Includes assets with hashed filenames for caching
   - Output: ~315KB JS bundle, ~25KB CSS bundle (gzipped: ~99KB JS, ~5KB CSS)

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
2. `npm run lint` - Check code quality (11 warnings expected, 0 errors)
3. `npm run format` - Format code consistently
4. `npm run build` - Verify production build works
5. Test the application manually by:
   - Starting dev server: `npm run dev`
   - Opening http://localhost:5173/
   - Clicking "Gaming Mode" button to enter dhikr interface
   - Clicking dhikr buttons (Subhanallah, Alhamdulillah, etc.) to verify counters increment
   - Checking that rewards and total dhikr counts increase
   - Verifying prayer times and Qibla compass display correctly

**Complete validation sequence (takes ~8.2 seconds total):**

```bash
npm run typecheck && npm run lint && npm run format && npm run build
```

**CRITICAL**: The GitHub Actions CI (.github/workflows/node.js.yml) runs `npm test` but there is NO test script defined in package.json. This causes CI failures with "Missing script: test". Do NOT add a test script unless specifically requested - document this limitation instead.

## Codebase Structure

### Key Files and Directories

```
├── src/
│   ├── App.tsx                    # Main React component with routing logic
│   ├── main.tsx                   # React app entry point
│   ├── index.css                  # Tailwind CSS imports
│   ├── vite-env.d.ts             # Vite TypeScript environment definitions
│   ├── components/
│   │   ├── GamingMode.tsx         # Interactive dhikr gaming interface
│   │   ├── LoginForm.tsx          # Authentication form component
│   │   ├── PrayerTimesCard.tsx    # Islamic prayer times calculator
│   │   ├── QiblaCompass.tsx       # Qibla direction compass
│   │   └── UserDashboard.tsx      # User profile and statistics
│   ├── contexts/
│   │   └── AuthContext.tsx        # Firebase authentication context
│   └── hooks/
│       └── useStats.ts            # Statistics and dhikr counting logic
├── .github/
│   └── workflows/
│       └── node.js.yml            # CI workflow (has test issue - no test script)
├── domains/
│   └── README.md                  # Quick domain setup guide
├── dist/                          # Build output directory (generated)
├── index.html                     # HTML template
├── package.json                   # Project configuration and scripts
├── vite.config.ts                 # Vite bundler configuration
├── tailwind.config.ts             # Tailwind CSS configuration
├── tsconfig.json                  # TypeScript configuration
├── eslint.config.js               # ESLint configuration
├── postcss.config.js              # PostCSS configuration
├── .prettierrc                    # Prettier configuration
├── vercel.json                    # Vercel deployment configuration
├── components.json                # shadcn/ui components configuration
├── README.md                      # Project documentation
├── replit.md                      # Replit-specific quickstart guide
└── CNAME_SETUP.md                 # Detailed Cloudflare + Vercel setup guide
```

### Important Code Locations

- **Main application logic**: `src/App.tsx`
  - Contains routing between home, gaming mode, dashboard, and login views
  - Uses React hooks (useState) and Framer Motion for animations
  - Integrates Firebase authentication context
- **Gaming Mode**: `src/components/GamingMode.tsx`
  - Interactive dhikr buttons with animated feedback
  - Tracks Subhanallah, Alhamdulillah, La ilaha illallah, Allahu Akbar counts
  - Shows real-time rewards and progress statistics
- **Prayer Times**: `src/components/PrayerTimesCard.tsx`
  - Uses Adhan library for accurate Islamic prayer time calculations
  - Default location: New York, NY (lat: 40.7128, lng: -74.0060)
  - Shows Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha times
- **Qibla Compass**: `src/components/QiblaCompass.tsx`
  - Calculates direction to Mecca using great circle method
  - Shows direction in degrees and cardinal directions (e.g., "58.5° (ENE)")
  - Displays distance to Mecca in kilometers
- **Statistics**: `src/hooks/useStats.ts`
  - Manages dhikr counting and coin rewards
  - Syncs with Firebase user data when authenticated
  - Falls back to localStorage for unauthenticated users
- **Authentication**: `src/contexts/AuthContext.tsx`
  - Firebase integration for Google, Apple, email, and phone login
  - User profile management and data persistence
- **TypeScript configuration**: Import paths should NOT include `.tsx` extension
  - ❌ Wrong: `import App from './App.tsx'`
  - ✅ Correct: `import App from './App'`
- **Styling**: All styling uses Tailwind CSS utility classes
- **Routing**: Single page application with view state management (no React Router)

### Development Environment Details

- **Vite server**: Configured to run on port 5173 with auto-open
- **Alias configuration**: `@/` points to `src/` directory
- **Build output**: Static files in `dist/` directory with hashed filenames
- **Hot reload**: Enabled for all file changes
- **Dependencies**:
  - Core: React 18.3.1, TypeScript 5.5.4, Vite 5.4.2
  - UI: Tailwind CSS 3.4.10, Framer Motion 12.x, Lucide React 0.542.0
  - Islamic features: Adhan 4.4.3 (prayer times)
  - Backend: Firebase 12.2.1 (authentication, data storage)
  - Build tools: ESLint 9.x, Prettier 3.3.3, PostCSS 8.4.x

## Common Issues and Workarounds

### TypeScript Import Extensions

- **Issue**: TypeScript compiler rejects `.tsx` extensions in imports
- **Solution**: Always import without file extensions: `import App from './App'`

### CI Test Failures

- **Issue**: GitHub Actions runs `npm test` but no test script exists
- **Error Message**: "Missing script: 'test'"
- **Workaround**: This is expected behavior. CI will fail on the test step
- **Fix**: DO NOT add test script unless specifically requested

### ESLint Warnings

- **Issue**: 11 ESLint warnings appear during linting (0 errors)
- **Warnings**: Mostly unused variables in AuthContext.tsx and GamingMode.tsx
- **Solution**: These are acceptable for this project. Focus on fixing errors, not warnings

### Build Performance

- **Issue**: Build seems fast but don't cancel prematurely
- **Solution**: Always wait for complete build output showing file sizes

### Firebase Configuration

- **Issue**: Firebase authentication requires proper configuration
- **Solution**: Ensure Firebase config is properly set up for Google/Apple login
- **Note**: Login functionality requires Firebase project setup

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
3. Verify page loads with "Islamic Habits" title and green gradient background
4. Check prayer times card shows New York, NY times with current next prayer
5. Check Qibla compass shows direction (58.5° ENE) and distance (10306 km)
6. Verify no console errors

### Gaming Mode Functionality Test

1. Click "Gaming Mode" button (purple button with gamepad icon)
2. Verify navigation to gaming interface with dhikr buttons
3. Click "Subhanallah" button and verify:
   - Total Rewards increases to 1
   - Total Dhikr increases to 1
   - Subhanallah count in progress section increases to 1
   - Animated feedback message appears ("Masha Allah! ✨")
4. Click "Alhamdulillah" button and verify:
   - Total counters increase to 2
   - Alhamdulillah count increases to 1
   - Different feedback message appears ("Your heart is shining! 💖")
5. Test all four dhikr buttons work correctly
6. Click "← Home" to return to main screen

### Production Build Test

1. Build the project: `npm run build`
2. Check `dist/` directory contains:
   - `index.html` (0.40 kB)
   - `assets/index-[hash].css` (~25 kB)
   - `assets/index-[hash].js` (~315 kB)
3. Start preview server: `npm run preview`
4. Navigate to http://localhost:4173/
5. Test the same functionality as development

### Code Quality Test

```bash
npm run typecheck && npm run lint && npm run format
```

All commands should complete without errors. Lint shows 11 warnings (acceptable).

## Quick Reference Commands

```bash
# Full development setup from fresh clone
npm install
npm run typecheck
npm run lint
npm run format
npm run build
npm run dev

# Pre-commit validation (takes ~8.2 seconds total)
npm run typecheck && npm run lint && npm run format && npm run build

# Start development
npm run dev

# Test production build
npm run build && npm run preview

# Check what happens when CI runs tests (will fail)
npm test  # Error: Missing script: "test"
```

## Key Application Features

### Islamic Functionality

- **Prayer Times**: Accurate calculation using Adhan library with Muslim World League method
- **Qibla Direction**: Real-time compass pointing to Mecca with distance calculation
- **Dhikr Tracking**: Four types of dhikr with Arabic text, transliteration, and translation
- **Rewards System**: Coin-based gamification for spiritual practice

### Technical Features

- **Authentication**: Firebase integration (Google, Apple, email, phone)
- **Data Persistence**: Firebase for authenticated users, localStorage for guests
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Animations**: Framer Motion for smooth transitions and feedback
- **Progressive Enhancement**: Works offline with cached data

### User Interface

- **Home Screen**: Overview with prayer times, Qibla compass, and feature highlights
- **Gaming Mode**: Interactive dhikr buttons with real-time feedback and progress tracking
- **Login Options**: Multiple authentication methods with social providers
- **Dashboard**: User profile and detailed statistics (requires authentication)

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

**Note**: No test script defined - this causes CI failures with "Missing script: test" but is expected behavior.

## Deployment Notes

### Vercel Configuration (vercel.json)

- **Build command**: `npm run build`
- **Output directory**: `dist`
- **Framework**: Vite (auto-detected)
- **SPA routing**: All routes redirect to `/index.html`
- **CORS headers**: Configured for `/api/*` endpoints

### Build Output

- **Total bundle size**: ~340 kB (uncompressed)
- **Gzipped size**: ~104 kB total
- **Assets**: Images, fonts, and static files included
- **Caching**: Hashed filenames for optimal cache invalidation

### Performance Metrics

- **Install time**: ~42 seconds (first time), ~1 second (cached)
- **Build time**: ~3.6 seconds
- **Dev server startup**: ~200ms
- **Hot reload**: Near-instant for most changes
- **Type checking**: ~2.6 seconds
- **Linting**: ~1.3 seconds
- **Formatting**: ~0.9 seconds

**IMPORTANT TIMEOUT VALUES**:

- npm install: 60+ seconds
- npm run build: 120+ seconds
- All other commands: 30+ seconds
- NEVER CANCEL long-running operations

<tool_calling>
You have the capability to call multiple tools in a single response. For maximum efficiency, whenever you need to perform multiple independent operations, ALWAYS invoke all relevant tools simultaneously rather than sequentially. Especially when exploring repository, reading files, viewing directories, validating changes or replying to comments.
</tool_calling>
