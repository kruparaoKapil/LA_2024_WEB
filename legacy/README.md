# Legacy Angular 8 application (archived)

This folder preserves the pre-migration **Angular 8.2** codebase (Kendo UI, ngx-bootstrap, `app.module.ts` monolith) for reference and rollback.

The active application now lives at the repository root (`src/`, `angular.json`, `package.json`).

## Run the old app (optional)

```bash
cd legacy
npm install
npm start
```

Use Node 14–16 if the legacy toolchain fails on newer Node versions.

## Rollback

To restore the old layout temporarily, check out commit `pre-migration-snapshot` or the last commit before Phase 11 cutover on branch `migration/angular-21-primeng`.
