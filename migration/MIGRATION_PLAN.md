# LA_2024_WEB — Angular 8 → Angular 21 + PrimeNG Migration Plan

> Working document. Final summary lives in `MIGRATION_NOTES.md` after Phase 13.

## Source-of-truth tag and branch

- Snapshot tag: `pre-migration-snapshot` (commit `bcaca3f` on `main`)
- Working branch: `migration/angular-21-primeng`
- Remote: `https://github.com/kruparaoKapil/LA_2024_WEB.git`

## Project signature (captured from current state)


| Metric                             | Value                                            |
| ---------------------------------- | ------------------------------------------------ |
| Angular                            | 8.2.2 (target: 21.x)                             |
| TypeScript                         | 3.5.3 (target: 5.x)                              |
| RxJS                               | 6.4 + `rxjs-compat` (target: 7.x without compat) |
| Components (`*.component.ts`)      | ~437                                             |
| Services                           | 86                                               |
| Custom directives                  | ~40                                              |
| Routes (inline in `app.module.ts`) | 387                                              |
| Lazy-loaded modules                | 0                                                |
| Routing mode                       | hash (`useHash: true`) — preserved               |
| Templates using `kendo-grid`       | 249                                              |


## Strategy

**Greenfield Angular 21 standalone app at `app-v21/`** built side-by-side with the legacy code, ported feature-by-feature, then cut over. Avoids the impossible chain `ng update 8→9→…→21` against a 1341-line `app.module.ts` with duplicated declarations.

## Phases

1. Baseline & safety net (in progress)
2. Scaffold `app-v21/` with PrimeNG (Aura), zoneless change detection, hash routing, functional interceptors
3. Port cross-cutting layer: Models, Services (signals + `inject()`), Interceptors (functional), Pipes, retained directives, login/layout shell
4. Build `shared/ui` PrimeNG wrapper library
5. Lazy routing skeleton
6. Port `Common`
7. Port `Settings`
8. Port `Loans`
9. Port `Accounting`
10. Port `Banking`
11. Port `HRMS`, `TDS`, remaining
12. Cutover (replace `src/`, drop legacy deps)
13. QA + performance + bundle measurement
14. Write `MIGRATION_NOTES.md` (final replacement-rationale doc)

## Library replacement table (target state)


| Removed                                                                                             | Used where                        | Replaced with                                                                                    | Why                                                          |
| --------------------------------------------------------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| `@progress/kendo-angular-grid` (+ `excel-export`, `pdf-export`)                                     | 249 templates                     | PrimeNG `Table` (`p-table`) + custom `PdfExportService`/`ExcelExportService`                     | Single grid component, free, signal-friendly, smaller bundle |
| `@progress/kendo-angular-dateinputs`                                                                | Date / time pickers               | PrimeNG `DatePicker`                                                                             | Unified date+time control, `en-IN` locale support            |
| `@progress/kendo-angular-dropdowns`                                                                 | Dropdowns / combos / autocomplete | PrimeNG `Select`, `MultiSelect`, `AutoComplete`                                                  | Single source, signal inputs, virtual scroll                 |
| `@progress/kendo-angular-dialog`                                                                    | Modals / confirmations            | PrimeNG `Dialog`, `DynamicDialog`, `ConfirmDialog`                                               | Built-in service-based dialog API                            |
| `@progress/kendo-angular-editor`                                                                    | Rich text editor                  | PrimeNG `Editor` (Quill)                                                                         | Mature, smaller                                              |
| `@progress/kendo-angular-treeview`                                                                  | Tree pickers                      | PrimeNG `Tree`, `TreeTable`                                                                      | Built-in checkbox/lazy modes                                 |
| `@progress/kendo-angular-menu`                                                                      | Menus                             | PrimeNG `Menu`, `Menubar`, `PanelMenu`                                                           | Same paradigm                                                |
| `@progress/kendo-angular-pdf-export`                                                                | PDF exports / receipts            | jsPDF + autoTable (existing dep)                                                                 | Already vendored, removes a heavy lib                        |
| `@progress/kendo-angular-excel-export`                                                              | Excel exports                     | `xlsx` (existing dep)                                                                            | Already vendored                                             |
| `@progress/kendo-angular-toolbar`, `layout`, `buttons`, `inputs`, `popup`, `common`, `intl`, `l10n` | UI primitives                     | PrimeNG `Toolbar`, `Card`, `Panel`, `Button`, `InputText`, `InputNumber`, `InputMask`, `Popover` | Single dependency                                            |
| `@progress/kendo-theme-default`                                                                     | Global theme                      | `@primeng/themes` (Aura preset, blue)                                                            | Modern design tokens                                         |
| `@progress/kendo-data-query`, `@progress/kendo-drawing`                                             | Grid filtering, drawing           | Native filtering on `p-table` + jsPDF/Canvas2D                                                   | Removed                                                      |
| `@swimlane/ngx-datatable`                                                                           | Secondary tables                  | PrimeNG `Table`                                                                                  | Convergence on one grid                                      |
| `@ng-select/ng-select` (+ highlight)                                                                | Searchable selects                | PrimeNG `Select` / `AutoComplete`                                                                | Convergence                                                  |
| `ng-multiselect-dropdown`                                                                           | Multi-select                      | PrimeNG `MultiSelect`                                                                            | Convergence                                                  |
| `ngx-select-ex`                                                                                     | Searchable select                 | PrimeNG `Select`                                                                                 | Convergence                                                  |
| `ngx-bootstrap` (datepicker, tabs)                                                                  | Date picker, tabs                 | PrimeNG `DatePicker`, `Tabs`                                                                     | Drop ngx-bootstrap entirely                                  |
| `ngx-toastr`                                                                                        | Toast notifications               | PrimeNG `Toast` + `MessageService`                                                               | Service-based, signals-friendly                              |
| `ngx-loading` + `ng4-loading-spinner`                                                               | Loader overlay                    | PrimeNG `BlockUI` + `ProgressSpinner`, driven by `LoaderService` (signal)                        | Single overlay, signal state                                 |
| `ngx-treeview`                                                                                      | Tree picker                       | PrimeNG `Tree`                                                                                   | Convergence                                                  |
| `ngx-contextmenu` + `context-menu`                                                                  | Context menus                     | PrimeNG `ContextMenu`                                                                            | Convergence                                                  |
| `amazing-time-picker`                                                                               | Time picker                       | PrimeNG `DatePicker` (timeOnly)                                                                  | Convergence                                                  |
| `ngx-export-as`                                                                                     | Export helpers                    | direct jsPDF / xlsx                                                                              | Removed wrapper                                              |
| `ngx-filter-pipe`                                                                                   | List filtering pipe               | `computed()` signals over arrays                                                                 | Idiomatic Angular 21                                         |
| `ngx-image-cropper` (1.4)                                                                           | Image cropping                    | `ngx-image-cropper` (latest, A21-compatible)                                                     | Library still maintained — version bump only                 |
| `ngx-cookie-service`                                                                                | Cookies                           | `ngx-cookie-service` (latest)                                                                    | Compatible                                                   |
| `rxjs-compat`                                                                                       | RxJS 5 → 6 shim                   | Removed                                                                                          | No longer needed; using RxJS 7 patterns                      |
| `tslib` (1.x)                                                                                       | Helper runtime                    | `tslib` (2.x)                                                                                    | TypeScript 5 requirement                                     |
| `tslint`, `codelyzer`                                                                               | Linting                           | `eslint` + `@angular-eslint`                                                                     | TSLint deprecated                                            |
| `karma`, `jasmine`, `protractor`                                                                    | Test runners                      | Vitest + Cypress (or Jest)                                                                       | Karma & Protractor retired                                   |


## Custom directive disposition (40 directives)

**To remove (PrimeNG primitives cover):**

- `numbersonly`, `nuberswithzero`, `alphanumericcharsonly`, `charactersonly`, `emailpattern`, `time-mask`, `two-digit-decima-number`, `three-digit-decima-number`, `mycurrency-formatter`, `uppercase`, `addressformat`, `enterprisenameformat`, `AlphaNumericWithSpecialCharacters`, `alpha-numeric`, `decimalwithcurrencyformat`

**To keep (business logic) — convert to signal-input directives:**

- `ifsccodevalidator` (Indian IFSC validator)
- `button-double-click` (rate-limit submit buttons)
- `auto-focus`
- `InitCap`, `titlecaseword`
- `roundecimal`, `remove-zero`, `zero`
- `newline`
- `emailformat` (custom regex)
- `longitudeformat`
- `ThreeDigitNumber`, `nuberswithzero` (final review may merge into `pKeyFilter` regex)

## Pipe disposition (5 pipes)

- `mycurrencypipe` → `IndianCurrencyPipe` using `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })`
- `currencypipewithdecimal` → variant of above with `minimumFractionDigits: 2`
- `negativevalue` → keep, signal-friendly (pure)
- `number-to-words` → keep (custom Indian numbering Lakh/Crore logic)

## Form strategy

- New screens: **signal-based** (`linkedSignal`, `model`, `forms` — Angular 21 reactive primitives), `inject(NonNullableFormBuilder)` for cases needing validators/array helpers.
- Heavy multi-step forms (FI Individual ~10 children) keep `FormGroup` + `FormArray` because they remain the most ergonomic for cross-field validation; they expose values via `toSignal(form.valueChanges)` for templates.

## API contract guarantee

All `*.service.ts` retain identical method signatures and HTTP request/response shapes. Backend endpoints are not modified. Only internal state management is rewritten.

## Routing strategy

- Hash routing preserved (`withHashLocation()`) so existing user bookmarks `#/Dashboard`, `#/Login` etc. continue to work unchanged.
- Inline 387-route monolith broken into per-feature `*.routes.ts` files behind `loadChildren`.
- Auth guard rewritten as a functional `CanActivateFn`.

## Risk register


| Risk                                                          | Mitigation                                                                                                                                    |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 249 `kendo-grid` blocks with rich features                    | Build `<app-data-grid>` once with feature parity (filter, sort, group, paginate, virtual-scroll, Excel/PDF export) before porting any feature |
| Indian rupee + lakhs/crores formatting                        | Centralize in `IndianCurrencyPipe` and `<app-currency-input>`                                                                                 |
| Letters use kendo PDF export with embedded CSS                | Switch narrative letters to HTML print routes; tabular receipts use jsPDF                                                                     |
| Hash-routing bookmarks                                        | Keep `withHashLocation()`                                                                                                                     |
| 86 services with hand-rolled subjects                         | Convert hot state to signals; keep cold streams as Observables                                                                                |
| Dual loader libraries (`ng4-loading-spinner` + `ngx-loading`) | Single `LoaderService` driving `<app-loader>`                                                                                                 |
| Test coverage near zero                                       | Add Cypress smoke tests on critical paths in Phase 12                                                                                         |
| Long migration window blocking other work                     | Side-by-side `app-v21/` keeps old build releasable                                                                                            |


## Progress checklist

- Phase 0: snapshot tag + branch
- Phase 0: route inventory captured (`route-inventory.raw.txt`, 387 entries)
- Phase 1: scaffold `app-v21/` (Angular 21.2.0, TS 5.9, RxJS 7.8, Vitest)
- Phase 1: PrimeNG 21 + Aura + primeicons installed (`@primeuix/themes`)
- Phase 1: zoneless change detection enabled (`provideZonelessChangeDetection()`)
- Phase 1: hash routing preserved (`provideRouter(routes, withHashLocation())`)
- Phase 1: functional `jwt.interceptor.ts` + `error.interceptor.ts` wired
- Phase 1: `en-IN` locale + INR rupee setup
- Phase 1: signal-based placeholder Login + Dashboard, dev build green (2.04 MB initial)
- Phase 2A: cross-cutting foundation (this session) — see `app-v21/src/app/core/**` and `shared/{pipes,directives,utils}`
  - `core/config/app-config.service.ts` (loads appsettings.json once, exposes signals)
  - `core/api/api-client.service.ts` (replaces `callGetAPI`/`callPostAPI`, with shims)
  - `core/notifications/toast.service.ts` (replaces ngx-toastr)
  - `core/loader/loader.service.ts` (signal-based, replaces dual spinner libs)
  - `core/auth/{auth.types,auth.store,auth.service,auth.guard,role.guard}.ts` (signal-backed)
  - `core/utils/{date.util,excel-export.service,pdf-export.service}.ts`, `core/validation/validation.util.ts`
  - `models/{page-criteria,contact,loans,fi-personal-information}.model(s).ts`
  - 4 standalone pipes: `mycurrencypipe`, `currencypipewithdecimal`, `negativevalue`, `numberToWords`
  - 10 standalone directives: `appIfsccodevalidator`, `appButtonDoubleClick`, `appAutoFocus`, `appInitCap`, `appTitlecaseword`, `appRoundecimal`, `appEmailFormat`, `appUppercase`, `appNewline`, `appNumberRange`
  - `app.config.ts`: `provideAppInitializer(() => inject(AppConfigService).load())` ensures API host resolved before first call
  - Real `LoginComponent` wired to `AuthService.login()` with `returnUrl` propagation
  - `DashboardComponent` reads `AuthStore.user()`, supports sign-out
  - Build green (2.07 MB initial dev), tests pass, 0 lint errors
- Phase 2B: per-feature service ports happen alongside their feature phases (5–10)
- Phase 3: shared/ui PrimeNG wrapper library — `app-v21/src/app/shared/ui/`
  - `data-grid/` — `<app-data-grid>` over `p-table` with toolbar (search/Excel/PDF), sortable/filterable columns, paginator, single/multi selection, row-double-click; replaces 249 `kendo-grid` blocks
  - `date-input/` — `<app-date-input>` (ControlValueAccessor) over `p-datepicker`, dd/MM/yyyy en-IN
  - `currency-input/` — `<app-currency-input>` (CVA) over `p-inputNumber`, locale en-IN, INR currency
  - `select/`, `multi-select/` — `<app-select>` / `<app-multi-select>` (CVA) over `p-select` / `p-multiSelect`
  - `dialog/` — `<app-dialog>` over `p-dialog` with header/footer template slots and built-in OK/Cancel
  - `confirm-button/` — `<app-confirm-button>` raises `ConfirmationService` before emitting `confirmed`
  - `tree/` — `<app-tree>` over `p-tree`
  - `tabs/` — `<app-tabs>` over `p-tabs` (replaces ngx-bootstrap `tabset`)
  - `toolbar/` — `<app-toolbar>` over `p-toolbar` with `[slot=start]` / `[slot=end]` content slots
  - `rich-editor/` — `<app-rich-editor>` (CVA) over `p-editor` (Quill)
  - `index.ts` barrel for one-line consumer imports
  - Wrappers tree-shake: 0 KB initial impact when not consumed; build still 2.07 MB initial.
- [x] Phase 4: AppShell + lazy routing skeleton
  - `layout/app-shell.component.ts` — header (brand, company, user avatar, sign-out) + collapsible PanelMenu sidebar + content `<router-outlet />`
  - `shared/ui/feature-placeholder/` — single component renders "Feature X — Phase Y" via route `data`; consumed by every un-ported route so links never 404
  - 7 feature `*.routes.ts` files registered as lazy children of the shell:
    - `features/common/common.routes.ts` (3 routes — Phase 5)
    - `features/settings/settings.routes.ts` (~30 routes — Phase 6)
    - `features/loans/loans.routes.ts` (~70 routes — Phase 7)
    - `features/accounting/accounting.routes.ts` (~50 routes — Phase 8)
    - `features/banking/banking.routes.ts` (~30 routes — Phase 9)
    - `features/hrms/hrms.routes.ts` (~25 routes — Phase 10)
    - `features/tds/tds.routes.ts` (~15 routes — Phase 10)
  - All shell-children also mounted at `path: ''` so legacy un-prefixed bookmarks (`#/CashBook`, `#/Fiindividual`) resolve unchanged.
  - Bundle: chunks split per feature (loans-routes 6.2 KB, accounting-routes 5.9 KB, etc.); only the shell + dashboard load on first visit.
- Phase 5: Common
- Phase 6: Settings
- Phase 7: Loans
- Phase 8: Accounting
- Phase 9: Banking
- Phase 10: HRMS, TDS, rest
- Phase 11: cutover
- Phase 12: QA + perf
- Phase 13: write `MIGRATION_NOTES.md`

