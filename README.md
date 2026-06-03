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

- **Handoff summary:** [`migration/MIGRATION_NOTES.md`](migration/MIGRATION_NOTES.md)
- Phase history: [`migration/MIGRATION_PLAN.md`](migration/MIGRATION_PLAN.md)
- QA: [`migration/QA_REPORT.md`](migration/QA_REPORT.md), [`migration/QA_CHECKLIST.md`](migration/QA_CHECKLIST.md)

Legacy Angular 8 sources are archived under [`legacy/`](legacy/README.md).
