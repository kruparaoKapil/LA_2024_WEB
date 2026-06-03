# Phase 12 — QA report

Generated: 2026-06-03 (branch `migration/angular-21-primeng`)

## Automated checks

| Check | Result |
|-------|--------|
| `npm run build:prod` | Pass — output `dist/PresentationPages/` |
| `npm test` (Vitest) | Pass — 4 tests (app shell + Excel/PDF export) |
| Route inventory diff | See `route-coverage.json` |
| Bundle measurement | See `bundle-stats.json` |

Re-run analysis:

```bash
npm run build:prod -- --stats-json
npm run qa
```

## Route coverage (vs Phase-0 inventory)

Source: `migration/route-inventory.raw.txt` (382 unique paths)

| Metric | Count |
|--------|------:|
| Legacy paths | 382 |
| New app paths | 316 |
| Exact path match + **implemented** shell | 134 |
| Exact path match + **placeholder** | 47 |
| Param-alias match (`:id` → `:applicationId`, etc.) | 3 |
| Legacy-only (not wired yet) | 198 |

**Interpretation:** Many legacy screens collapse into parameterized shells (e.g. one `banking-report-shell` for 25 report routes). Exact path parity is not 1:1 with component count. Placeholder routes keep bookmarks alive for deferred work (Settings multi-tab masters, Banking insurance/savings, HRMS SSC agenda, TDS accounts setup, etc.).

Full lists: `migration/route-coverage.json` (`legacyOnlyPaths`, `placeholders`, `paramAliasMatches`).

## Bundle / performance (production)

| Metric | Value |
|--------|------:|
| Total build output | ~4086 KB |
| JS | ~3426 KB |
| CSS | ~42 KB |
| `browser/` on disk | ~3455 KB |
| Initial transfer (CLI estimate) | ~160 KB |
| Largest lazy chunk | ~1310 KB (`chunk-2EEIQSN3.js` — jsPDF/html2canvas/canvg chain) |

Legacy Angular 8 prod build used very high budgets (50 MB initial); the new app is **lazy-loaded by feature** with a much smaller first paint. Further optimization: dynamic-import jsPDF only from grid export actions.

## Export parity

| Capability | Implementation | Automated test |
|------------|----------------|----------------|
| Excel export | `ExcelExportService` + `<app-data-grid>` toolbar | `excel-export.service.spec.ts` |
| PDF table export | `PdfExportService` + grid toolbar | `pdf-export.service.spec.ts` |
| Narrative letters | HTML templates + `window.print()` in letter shells | Manual (see checklist) |

## Visual parity

No screenshot baseline is stored in the repo. Compare manually:

1. Run legacy: `cd legacy && npm install && npm start` (Node 14–16 if needed).
2. Run new app: `npm start` from repo root.
3. Use the same `public/assets/appsettings.json` API host.
4. Follow `migration/QA_CHECKLIST.md` and capture side-by-side screenshots for sign-off.

Reference commit for legacy UI: tag `pre-migration-snapshot`.

## Known gaps (post-migration)

- **198** legacy routes not yet implemented (see `legacyOnlyPaths` in `route-coverage.json`).
- **47** routes show `<app-feature-placeholder>` until follow-up ports.
- E2E (Cypress/Playwright) not added — recommended for login → dashboard → one report per feature.
- Company config, employee master (Settings), insurance/savings banking masters, and full Form 15-H/121 tabs remain deferred.

## Sign-off

- [ ] Login / branch selection / dashboard
- [ ] One smoke path per feature (Loans, Banking, Accounting, HRMS, TDS, Settings, Common)
- [ ] Grid Excel + PDF export on a report screen
- [ ] Letter print preview (Loans or Banking)
- [ ] Stakeholder accepts placeholder screens list for go-live scope
