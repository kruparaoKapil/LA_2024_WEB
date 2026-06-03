# LA_2024_WEB — Migration notes (Angular 8 → 21 + PrimeNG)

Final handoff document for the `migration/angular-21-primeng` branch. Phase history and checklists live alongside this file under `migration/`.

## Summary

| Item | Before (legacy) | After (current) |
|------|-----------------|-----------------|
| Angular | 8.2.2 | 21.2.x |
| TypeScript | 3.5.3 | 5.9.x |
| RxJS | 6.4 + `rxjs-compat` | 7.8 (no compat) |
| UI | Kendo + ngx-bootstrap + assorted widgets | PrimeNG 21 (Aura) + `shared/ui` wrappers |
| Modules | Single `app.module.ts` (~1341 LOC), 387 inline routes | Standalone components, 8 lazy `*.routes.ts` feature modules |
| Change detection | Zone.js | Zoneless (`provideZonelessChangeDetection`) |
| Tests | Karma / Jasmine / Protractor | Vitest (`ng test`) |
| Source location | Repo root `src/` | Repo root `src/` (legacy archived to `legacy/`) |
| Build output | `dist/PresentationPages/` | Same path (preserved for deploy scripts) |

**Strategy:** Greenfield app built beside legacy (`app-v21/`), feature ports Phases 5–10, cutover Phase 11, QA Phase 12. Incremental `ng update` 8→21 was avoided because of the monolithic module and 249 Kendo grids.

**API contract:** Backend URLs and payloads are unchanged. Services were consolidated and reimplemented on `ApiClient`, but HTTP paths and query/body shapes match legacy.

---

## Repository layout (post–Phase 11)

```
LA_2024_WEB/
├── src/app/
│   ├── core/           # ApiClient, auth, loader, toast, interceptors, export utils
│   ├── features/       # common, settings, loans, banking, accounting, hrms, tds, auth, home
│   ├── layout/         # AppShellComponent (menu + outlet)
│   ├── models/         # Shared DTO-style interfaces
│   └── shared/
│       ├── directives/ # Business validators (IFSC, debounce-click, InitCap, …)
│       ├── pipes/      # INR currency, number-to-words, negative value
│       └── ui/         # PrimeNG wrappers (<app-data-grid>, <app-tabs>, …)
├── public/assets/      # appsettings.json (API host; often gitignored locally)
├── legacy/             # Frozen Angular 8 tree for reference / rollback comparison
├── migration/          # Plan, QA, route inventory, analysis scripts
└── dist/PresentationPages/   # Production build
```

---

## What was replaced (and why)

### UI libraries

| Removed | Replaced with | Why |
|---------|---------------|-----|
| `@progress/kendo-angular-grid` (+ excel/pdf export) | `<app-data-grid>` → `p-table` + `ExcelExportService` / `PdfExportService` | One grid, no Kendo license, signal-friendly, lazy-friendly bundle |
| Kendo dateinputs, dropdowns, dialog, editor, treeview, menu, toolbar, theme | PrimeNG equivalents via `shared/ui` | Single design system (Aura) |
| `@swimlane/ngx-datatable`, `ng-multiselect-dropdown`, `ngx-select-ex`, `@ng-select/ng-select` | `p-table`, `p-multiSelect`, `p-select`, `p-autoComplete` | Convergence |
| `ngx-bootstrap` (datepicker, tabs) | `p-datepicker`, `<app-tabs>` (`p-tabs`) | Drop second bootstrap stack |
| `ngx-toastr` | PrimeNG Toast + `ToastService` | Align with `MessageService` |
| `ngx-loading`, `ng4-loading-spinner` | `LoaderService` (signal) + shell overlay | One loader |
| `ngx-treeview` | `<app-tree>` | Convergence |
| `ngx-export-as` | Direct `xlsx` / jsPDF | Fewer wrappers |
| `ngx-filter-pipe` | `computed()` over row signals | Idiomatic Angular 21 |
| `rxjs-compat` | Removed | RxJS 7 native APIs only |

### Cross-cutting code

| Legacy | New | Notes |
|--------|-----|-------|
| `CommonService.callGetAPI` / `callPostAPI` | `ApiClient.get/post/...` | Central HTTP; JWT via functional interceptor |
| `AuthGuard` (class) | `authGuard` (`CanActivateFn`) | Reads `AuthStore` signal |
| `environment.apiURL` + per-call settings fetch | `AppConfigService` + `provideAppInitializer` | Loads `public/assets/appsettings.json` once |
| Ad-hoc `Subject` flags in services | `signal()` / `computed()` for UI state | Cold HTTP still uses `Observable` |
| 249× inline Kendo grid config | Column defs on `<app-data-grid>` | Sort, filter, paginate, export in one wrapper |

### Narrative vs tabular output

| Use case | Legacy | New |
|----------|--------|-----|
| Reports, masters lists | Kendo grid + Kendo Excel/PDF | `<app-data-grid>` toolbar |
| Sanction / disbursement / banking letters | Kendo PDF with embedded CSS | HTML template + `@media print` + optional `<app-rich-editor>` |
| Bond preview | Kendo PDF | Grid selection + print layout |

---

## Directives

**Removed** (covered by PrimeNG `pInputText`, `p-inputNumber`, `pKeyFilter`, or `<app-currency-input>`):  
`numbersonly`, `nuberswithzero`, `alphanumericcharsonly`, `charactersonly`, `emailpattern`, `time-mask`, decimal/currency formatters, `addressformat`, `enterprisenameformat`, etc.

**Kept** under `src/app/shared/directives/` (standalone, `host` bindings):

| Legacy name | New selector / file | Purpose |
|-------------|---------------------|---------|
| `ifsccodevalidator` | `appIfscCode` / `ifsc-code.directive.ts` | Indian IFSC validation |
| `button-double-click` | `appDebounceClick` | Prevent double submit |
| `auto-focus` | `appAutoFocus` | Focus on show |
| `InitCap` | `appInitCap` | Capitalize first letter |
| `titlecaseword` | `appTitleCaseWord` | Title case |
| `roundecimal` | `appRoundDecimal` | Decimal rounding |
| `emailformat` | `appEmailFormat` | Custom email regex |
| `uppercase` | `appUppercase` | Force upper case |
| `newline` | `appNewline` | Multiline behaviour |
| — | `appNumberRange` | Min/max numeric guard |

---

## Pipes

| Legacy | New | Location |
|--------|-----|----------|
| `mycurrencypipe` | `IndianCurrencyPipe` | `shared/pipes/indian-currency.pipe.ts` |
| `currencypipewithdecimal` | `CurrencyWithDecimalPipe` | `shared/pipes/currency-with-decimal.pipe.ts` |
| `negativevalue` | `NegativeValuePipe` | `shared/pipes/negative-value.pipe.ts` |
| `number-to-words` | `NumberToWordsPipe` | `shared/pipes/number-to-words.pipe.ts` (Lakh/Crore) |

Locale: `en-IN`, `LOCALE_ID` in `app.config.ts`; currency inputs use INR in `<app-currency-input>`.

---

## Signal and form patterns

### Components

- **Default:** `ChangeDetectionStrategy.OnPush`, `inject()`, `signal()` / `computed()` for view state.
- **Lists:** `rows = signal<T[]>([])`; grid uses `[(selection)]` where needed.
- **Route parameters:** `ActivatedRoute.snapshot.data` for `kind`, `reportKind`, `formKind` on generic shells.

### Forms

- **Simple screens:** Template-driven `[(ngModel)]` on signals or plain fields (settings masters, challana entry).
- **Heavy FI Individual:** Sub-forms implement **CVA** (`ControlValueAccessor`); parent shell holds a composite object and calls `loadApplication()` to patch children.
- **Multi-tab masters:** `<app-tabs>` (not legacy ngx-bootstrap `tabset`).

### Services

- Consolidated per feature (e.g. `banking-masters.service.ts`, `hrms.service.ts`, `loan-reports.service.ts`) instead of dozens of near-duplicate legacy files.
- `editingXId = signal<number | null>(null)` replaces mutable “edit id” fields on services.

### Generic shells (reduce 387 → ~316 route entries)

| Pattern | `data` key | Examples |
|---------|------------|----------|
| Report shell | `reportKind` | `banking-report-shell`, `hrms-report-shell`, `accounting-report-shell`, `tds-report-shell`, `loan-report-shell` |
| Transaction shell | `kind` | `payroll-shell` (process/approval), `challana-tds-shell`, `bank-receipt-shell`, `maturity-shell` |
| Letter shell | `letterKind` / route path | `banking-letter-shell`, `letter-shell` (loans) |
| Master shell | `kind` | `deposit-config-shell` (fd/rd), `employee-shell` |
| Deferred route | — | `FeaturePlaceholderComponent` + breadcrumb |

---

## Routing

- **Hash routing:** `provideRouter(routes, withHashLocation())` — bookmarks like `#/Dashboard`, `#/Fiindividual` unchanged.
- **Structure:** `app.routes.ts` → `AppShellComponent` + parallel `loadChildren` for each feature **and** duplicate `path: ''` children so un-prefixed legacy paths resolve without `/loans` prefix.
- **Auth:** `/Login` outside shell; all other routes use `authGuard`.
- **Inventory:** Phase-0 list in `migration/route-inventory.raw.txt`; diff in `migration/route-coverage.json` (run `npm run qa`).

---

## Feature port status (high level)

| Feature | Status | Notes |
|---------|--------|-------|
| Common | Partial | Group view/creation, branch selection, address sub-form |
| Settings | Partial | Users, branch, advocate, referral, generate-id; company/employee/menu placeholders |
| Loans | Broad | FI Individual + sub-forms, verification/approval/disbursement, receipts, letters, reports |
| Accounting | Broad | Account tree, banks, vouchers, cheques, 24 report kinds; some BRS/cheque placeholders |
| Banking | Broad | Member, FD/RD config & accounts, receipts, maturity, 12 letters, 25 reports; insurance/savings/shares deferred |
| HRMS | Partial | Payroll, attendance, on-roll, JV, employee, challana, reports; SSC/salary placeholders |
| TDS | Partial | Challana, PAN, simplified forms, reports; accounts setup placeholder |

---

## Running the apps

### New (default)

```bash
npm install
npm start                 # http://localhost:4200/
npm run build:prod        # dist/PresentationPages/
npm test                  # Vitest
npm run qa:full           # build + route/bundle analysis
```

Configure API: `public/assets/appsettings.json` (array with `ApiHostUrl`, `ApiReportUrl`).

### Legacy (comparison / rollback UI)

```bash
cd legacy
npm install
npm start
```

Use Node 14–16 if the Angular 8 CLI fails on newer Node.

---

## Rollback plan

1. **Git tag:** `pre-migration-snapshot` (commit `bcaca3f` on `main`) — full pre-migration tree.
2. **Branch:** Stay on `main` + revert merge, or deploy last known good Angular 8 build from CI artifacts.
3. **Local compare:** `legacy/` folder in this repo matches archived Angular 8 layout (`legacy/src`, `legacy/package.json`).
4. **No backend rollback required** — API contracts were not changed.

**Forward fix (preferred):** Complete placeholder routes listed in `migration/route-coverage.json` rather than reverting the whole migration.

---

## Performance snapshot (Phase 12)

See `migration/QA_REPORT.md` and `migration/bundle-stats.json`.

- Initial transfer ~**160 KB** (lazy feature chunks on demand).
- Total `browser/` ~**3.5 MB**; largest chunk ~**1.3 MB** (jsPDF/html2canvas) — consider dynamic import on export click.
- Legacy prod budgets allowed **50 MB** initial; new app is structured for smaller first paint.

---

## Testing

| Layer | Tool | Status |
|-------|------|--------|
| Unit | Vitest via `ng test` | App shell + export services |
| E2E | Not added | Recommended: Cypress/Playwright on login + one path per feature |
| Manual | `migration/QA_CHECKLIST.md` | Per-feature smoke + screenshot table |

---

## Related documents

| File | Purpose |
|------|---------|
| `migration/MIGRATION_PLAN.md` | Full phase checklist and library table |
| `migration/QA_REPORT.md` | Automated QA results |
| `migration/QA_CHECKLIST.md` | Manual smoke steps |
| `migration/route-coverage.json` | Legacy vs new route diff |
| `legacy/README.md` | How to run archived app |

---

## Suggested next steps (post–Phase 13)

1. Merge `migration/angular-21-primeng` → `main` after stakeholder sign-off on `QA_CHECKLIST.md`.
2. Port high-traffic **placeholder** routes (company config, banking insurance/savings, TDS accounts setup).
3. Add E2E smoke suite against staging API.
4. Lazy-load jsPDF only from grid export handlers to shrink largest chunk.
5. Optional: `@angular-eslint` + CI `npm run build:prod && npm test && npm run qa`.

---

*Generated as part of Phase 13. Branch: `migration/angular-21-primeng`. Cutover commit series: Phases 5–12 on this branch; Phase 11 commit `0be9b05`, Phase 12 commit `b9ff300`.*
