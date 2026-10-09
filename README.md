# Forma — gym tracker starter

A responsive gym tracker built with Next.js App Router, TypeScript, Tailwind CSS 4, and Lucide icons. The charcoal and lime interface includes a polished homepage and a usable dashboard.

## Run locally

Use Node.js **22.13 or newer** (Node 24 is recommended) and npm.

```sh
npm ci
npm run dev
```

Open `http://localhost:3000`. The homepage is `/`; the tracker is `/dashboard`.

To serve a production build:

```sh
npm run build
npm run start
```

No environment variables, external services, or credentials are required. Fonts use the system stack, so the build does not download remote fonts.

## What works

- Responsive homepage and dashboard, including a mobile navigation layout.
- Log workouts by name, type, duration, and date; remove workouts.
- Track training sessions and minutes over the last seven days.
- Add daily calorie intake against an illustrative 2,200 kcal goal.
- Log weight in kilograms, update a day's entry, and view the latest eight check-ins.
- Accessible SVG weight chart, training bars, and calorie progress ring.
- Browser-local persistence, cross-tab updates, and visible storage error messages.
- Reset all local entries to sample data after confirmation.
- Native keyboard-accessible modal forms, labeled inputs, and reduced-motion support.

**This is a demo starter.** The dashboard initializes with explicitly labeled sample data relative to your current local date. Subsequent changes are saved under `forma-tracker-v1` in this browser's local storage. Data is not encrypted, synced, backed up, or shared across devices. Clearing browser storage removes it. When storage is unavailable, changes last only for the current page session. The homepage's preview values are static illustrative samples.

**Authentication and database persistence are not implemented.** There is no backend account, medical advice, calorie-burn estimate, or individualized nutrition target. The calorie goal is a demo constant in `src/lib/tracker.ts`. Add real authentication and server-side persistence in a subsequent feature phase.

## Validation

```sh
npm run lint
npm run typecheck
npm run build
npx playwright install chromium
npm run test:e2e
```

The browser suite tests desktop and mobile navigation, horizontal overflow, workout persistence/deletion, calorie and weight updates, demo reset confirmation, and corrupt/unavailable storage. Build before running the suite; it starts the production server automatically. Port 3000 must be available, or an existing server there must serve this project. In CI, `reuseExistingServer` is disabled.

If Chromium is already installed, skip the browser download and point Playwright to it:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e
```

On a Linux machine missing browser system libraries, follow Playwright's supported system dependency installation (`npx playwright install --with-deps chromium`). If npm's default cache is unwritable, use `npm --cache /tmp/forma-npm-cache ci`.

## Project structure

```text
src/
  app/
    layout.tsx               Root layout and metadata
    page.tsx                 Homepage
    globals.css              Tailwind import, design tokens, responsive styles
    dashboard/page.tsx        Dashboard route
  components/
    brand.tsx                Shared wordmark
    ui.tsx                   Panel and stat card primitives
    charts.tsx               Lightweight accessible data visualizations
    dashboard.tsx            Dashboard composition and entry actions
    entry-dialog.tsx         Reusable entry and reset modal
  lib/
    tracker.ts               Types, demo seed, dates, validation, constants
    use-tracker.ts           Local storage store and cross-tab subscription
tests/tracker.spec.ts         End-to-end behavior tests
```

The project uses strict TypeScript, the `@/*` import alias, ESLint's Next.js presets, and a committed npm lockfile. Run the existing checkout directly; cloud tasks already provide an isolated workspace and do not need a separate Git worktree.

Next.js generates `next-env.d.ts` and route types; these generated files are ignored. The type-check command generates them before checking, so it works on a fresh checkout. Development origins permit `localhost` by default and explicitly allow `127.0.0.1` for local browser tests. ESLint 9 is pinned to match the peer requirements of the current Next.js lint plugins; npm may show its upstream support warning.

## Next steps

Add real accounts and a database, exercise sets/reps/loads, editable nutrition goals, and entry export/import. Keep the current local demo clearly separated from authenticated data when adding those features.
