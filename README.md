# LA_2024_WEB

Angular **21** + **PrimeNG** web client for LA 2024 (hash routing, zoneless, standalone components).

## Prerequisites

- **Node.js 20+** (LTS recommended)
- npm 10+

## Development

```bash
npm install
npm start
```

Open `http://localhost:4200/`. API base URL is loaded from `public/assets/appsettings.json` at startup.

## Production build

```bash
npm run build:prod
```

Output: `dist/PresentationPages/`

## Migration

Side-by-side migration notes and phase history: [`migration/MIGRATION_PLAN.md`](migration/MIGRATION_PLAN.md).

Legacy Angular 8 sources are archived under [`legacy/`](legacy/README.md).
