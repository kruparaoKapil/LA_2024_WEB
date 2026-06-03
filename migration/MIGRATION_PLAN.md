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

**Greenfield Angular 21 standalone app** (scaffolded under `app-v21/`, then cut over to repo root in Phase 11) built side-by-side with the legacy code, ported feature-by-feature. Avoids the impossible chain `ng update 8→9→…→21` against a 1341-line `app.module.ts` with duplicated declarations.

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
- [x] Phase 5 (partial): Common slice — `app-v21/src/app/features/common/`
  - `group.service.ts` — port of `Services/Common/group.service.ts` over `ApiClient`; signal-stashed `rowEditId` replaces ad-hoc field
  - `location.service.ts` — country/state/district lookups with per-id Map cache (replaces `ContacmasterService.getCountryDetails / getStates / getDistrictDetails` and dozens of duplicate calls)
  - `group/group-view.component.ts` — full port over `<app-data-grid>`, signals, paged + sortable; row dbl-click → edit
  - `group/group-creation.component.ts` — signal-driven form (no FormBuilder), inline member add/edit, integrates `<app-select>` for role lookup; full member-pick dialog flows through Phase 7 `<app-contact-select>`
  - `branch-selection/branch-selection.component.ts` — multi-branch picker over `p-listbox`, persists via `AuthStore.setBranch`
  - `address/address-subform.component.ts` — reusable CVA with cascading country→state→district from `LocationService`, signal-only state, replaces 325-LOC legacy `address.component.ts`
  - `<app-validation-message>` shipped under `shared/ui/` (accepts both `[message]` and legacy mis-spelled `[messgae]`)
  - Bank/KYC/Personal/Contact-select sub-forms ship in-context with FIIndividual (Phase 7)
- [x] Phase 6 (partial): Settings — `app-v21/src/app/features/settings/`
  - 8 services ported off `CommonService.callGetAPI/callPostAPI` onto the new `ApiClient`:
    - `users.service.ts` — Settings/Users surface (the legacy `UsersService` Banking-dashboard methods will move to `BankingDashboardService` in Phase 9)
    - `menu-modules.service.ts` — modules / submodules / functions / sort order
    - `branch-config.service.ts`, `company-config.service.ts`
    - `employee.service.ts` — list / save / update / dup-check (legacy `Subject` flags replaced by signals)
    - `generate-id.service.ts` — id-generator master
    - `advocate-lawyer.service.ts`, `referral-agent.service.ts` — were empty stubs in legacy; now have real CRUD surfaces
  - 6 components shipped fresh on PrimeNG + signals:
    - `users/users-view.component.ts` (replaces `usersview.component.ts`)
    - `users/users-registration.component.ts` (replaces `usersregistration.component.ts`)
    - `branch-config/branch-config.component.ts` (uses `<app-dialog>` + `<app-address-subform>`; replaces 600-LOC kendo-grid + bsDatepicker version)
    - `advocate-lawyer/advocate-lawyer.component.ts` — list + dialog edit
    - `referral-agent/referral-agent.component.ts` — list + dialog edit
    - `generate-id/generate-id.component.ts` — list + dialog edit with form/mode cascade
  - Settings routes wired both at PrimeNG-style paths (`/settings/users`, `/settings/branch-config`) and legacy hash names (`/UsersView`, `/BranchConfig`, `/AdvocateLawyerView`, `/AdvocateLawyerMaster`, `/ReferralAgentView`, `/ReferralAgentMaster`, `/GenerateidMaster`).
  - Multi-tab forms (Company Config, Employee Master, User Rights / Add Menu / Menu Sorting, Party Master / Contacts) deferred — they share sub-form building blocks (KYC, Family Details, Contact tree) with FIIndividual and port together in Phase 7.
- [x] Phase 7A: Loans Masters — `app-v21/src/app/features/loans/`
  - 5 services on `ApiClient`: `charges.service.ts`, `documents.service.ts`, `scheme.service.ts`, `preclosure.service.ts`, `loans-master.service.ts` (the legacy 358-LOC `LoansmasterService` was split — its API surface is the new service; the cross-tab state-bag goes into the LoanCreation form's local signals when ported in Phase 7B)
  - 4 master CRUD components, all signal-only with `<app-data-grid>` + `<app-dialog>`:
    - `charges/charges.component.ts` — Amount / Percentage type toggle
    - `documents/documents.component.ts` — two-tab (Groups | Documents) using `<app-tabs>`
    - `scheme/scheme.component.ts` — cascading Loan Type → Loan Name picker
    - `preclosure/preclosure.component.ts`
  - Routes wired at legacy hash names (`/ChargesMaster`, `/Documents`, `/SchemeView`, `/SchemeMaster`, `/PreclosureView`, `/PreclosureMaster`); LoanCreation, ChargeconfigurationView/Master remain placeholders pending Phase 7B
- [x] Phase 7B: FIIndividual shell + Contact / Bank / KYC / Personal sub-forms — `app-v21/src/app/features/loans/`
  - 3 services on `ApiClient`: `contact-master.service.ts` (replaces 549-LOC `ContacmasterService`), `fi-individual.service.ts` (replaces 543-LOC `FIIndividualService`, cross-tab `Subject`s converted to signals), `fi-individual-loan-specific.service.ts`
  - `contact/contact-view.component.ts` — listing of all contacts using `<app-data-grid>`
  - `contact/contact-select.component.ts` — autocomplete + applicant card replaces kendo-multi-column-combobox + `window` global callbacks
  - `sub-forms/bank-details-subform.component.ts` — CVA wrapper (replaces 555-LOC `BankdetailsnewComponent`); add/edit/delete with `ptypeofoperation` lifecycle, primary-account radio, IFSC validator, dup A/C-no guard
  - `sub-forms/kyc-documents-subform.component.ts` — CVA wrapper (replaces 746-LOC `KycdocumentsnewComponent`); cascading Group → Type, dup-doc guard, lifecycle markers (file-upload deferred to Phase 7C generic `<app-document-upload>`)
  - `sub-forms/personal-details-subform.component.ts` — CVA wrapper (replaces 235-LOC `PersonalDetailsComponent`); residential-status / marital-status radios, country-of-birth via `LocationService` (Phase 5)
  - `fi-individual/fi-individual-view.component.ts` — list of FI applications with `<app-data-grid>`
  - `fi-individual/fi-individual-shell.component.ts` — replaces multi-thousand-LOC FI tabset; 14-tab `<app-tabs>` shell with applicant banner; 5 tabs fully wired (Applicant, Address [Phase 5 sub-form], Bank Details, KYC, Personal); remaining 9 tabs render `<app-feature-placeholder>` pending Phase 7C
  - Routes: `/ContactView`, `/ContactViewNew`, `/FiView`, `/fi-individual`, `/fi-individual/new`, `/fi-individual/:applicationId` plus legacy hash aliases `/Fiindividual`, `/Fiindividual/:applicationId`
  - Cross-tab sharing pattern migrated: legacy `_GetContactData()`, `_GetBankUpdate()`, `_GetKYCUpdate()` Subjects → signals on `FIIndividualService` + parent shell holds the per-tab form models in plain class fields and signals (no global Subject hand-shake needed)
- [x] Phase 7C: remaining FIIndividual sub-forms + Verification / Approval / Disbursement — `app-v21/src/app/features/loans/`
  - Generic `<app-document-upload>` widget (`app-v21/src/app/shared/ui/document-upload/`) — single CVA-shaped widget that replaces the per-component file-upload code copy-pasted across legacy KYC, property, movable-property, employee, and verification screens. Uses PrimeNG `p-fileUpload` (basic mode) with custom upload to the legacy `/Common/UploadFile` endpoint, returning `{ filePath, fileName }`
  - `sub-forms/list-record.types.ts` — shared `ptypeofoperation` lifecycle helpers (`markDirty`, `deleteRow`, `filterVisible`, `asOldRows`) so the back-end keeps receiving the same `CREATE | UPDATE | DELETE | OLD` deltas without per-component plumbing
  - `sub-forms/family-details-subform.component.ts` — CVA list (replaces 209-LOC `FamilyDetailsComponent`); enforces total-members count, blocks `0000000000` placeholder phone
  - `sub-forms/property-details-subform.component.ts` — CVA list (replaces 309-LOC `PropertyDetailsComponent`); cascading title-deed dropdown, currency input, deed-document upload via `<app-document-upload>`
  - `sub-forms/movable-property-subform.component.ts` — CVA list (replaces 319-LOC `MovablePropertyDetailsComponent`); vehicle-make catalog from `FIIndividualLoanSpecificService.vehicleModels`
  - `sub-forms/employment-details-subform.component.ts` — single-record CVA replacing the FI-Individual-relevant slice of the 888-LOC `EmployeeDetailsNewComponent`; full HRMS career/training/education stays for Phase 10
  - `sub-forms/co-applicant-subform.component.ts` — CVA list (replaces 396-LOC `CoJointmemberComponent`); reuses Phase-7B `<app-contact-select>` autocomplete to pick co-applicants and guarantors, dedupes by contact id + role
  - `sub-forms/nominee-details-subform.component.ts` — CVA list (replaces 716-LOC `CoNomineedetailsComponent`); enforces ≤100% allocation total, exactly one primary nominee
  - `sub-forms/referral-subform.component.ts` — single-record CVA (replaces 399-LOC `CoReferralComponent`); referral applicable toggle, agent + sales-person selects, percentage / amount commission switch
  - `sub-forms/tds-details-subform.component.ts` — single-record CVA (replaces 536-LOC `TDSDetailsComponent`); independent TDS / GST toggles, GSTIN regex validation
  - `fi-individual/fi-individual-shell.component.ts` — all 13 sub-form tabs now wired (Applicant, Address, Bank, KYC, Personal, Family, Property, Movable, Employment, Co-Applicant, Nominee, Referral, TDS); the `application` tab continues to render `<app-feature-placeholder>` because it's owned by the LoanCreation flow (Phase 7D); `loadApplication()` rehydrates every list with `asOldRows()` and every record sub-form via spread
  - 3 services on `ApiClient`: `verification.service.ts` (replaces 159-LOC legacy, three plain `Telecerification`/`Documentverification`/`Fieldverification` fields → signals), `approval.service.ts` (replaces 43-LOC legacy), `disbursement.service.ts` (replaces 44-LOC legacy with the misspelled `Disbusement` filename fixed)
  - `verification/verification-view.component.ts` + `verification/verification-shell.component.ts` — single shared shell for Tele / Document / Field verification, kind-driven by route `data: { kind }`; saves ~1500 LOC vs three near-identical legacy components; document mode adds a checklist of KYC docs to verify
  - `approval/approval-view.component.ts` + `approval/approval-shell.component.ts` — status-filtered list (`PENDING|APPROVED|REJECTED|ALL`) plus decision shell with applicant summary, approved-amount / tenure / rate / date / status / remarks, and a live charges grid recomputed via `getLoanWiseCharges`
  - `disbursement/disbursement-view.component.ts` + `disbursement/disbursement-shell.component.ts` — list + shell that captures mode (Cash/Cheque/NEFT/RTGS/IMPS/UPI), dates, EMI day, and amount; live broken-days/advance-EMI recompute via the legacy endpoints; EMI schedule grid uses the same `<app-data-grid>` excel/PDF export
  - Routes wired (legacy hash names preserved): `/Televerification`, `/Documentverification`, `/Fieldverification` (each with `View` and `:applicationId` variants), `/VerificationView`, `/VerificationNew`, `/ApprovalView`, `/AprovalView`, `/AprovalNew`, `/Approval/:applicationId`, `/DisbursementView`, `/DisbursmentView`, `/DisbursementNew`, `/Disbursment/:applicationId`
- [x] Phase 7D: Loan Application tab + Receipts / PartPayment / Moratorium / Preclosure transactions + Letters + Reports — `app-v21/src/app/features/loans/`
  - `sub-forms/loan-application-subform.component.ts` — final FI-Individual tab; replaces the FI-applicable slice of the 1331-LOC `FiLoandetailsComponent`. Cascading dropdowns (loan type → loan name → contact + applicant → scheme → pay-in → interest type → installment mode) drive a live min/max amount + rate hint. The FI shell now wires all 14 sub-form tabs end-to-end
  - `services/loan-receipts.service.ts` — consolidates 51-LOC `LoanreceiptService` and 76-LOC `MoratoriumService` (they shared the entire `/Receipts` API surface; splitting them was a legacy artefact). Drives Receipts / PartPayment / Moratorium / Preclosure transactions
  - `services/loan-letters.service.ts` — single service for the four letter kinds (`sanction`, `disbursement`, `deliveryorder`, `acknowledgement`); replaces 4 nearly-identical legacy services (~150 LOC combined)
  - `services/loan-reports.service.ts` — replaces `LoanStatementServicesService`, `DuesReportsService`, and `DisbursmentReportsService`; covers loan-statement, EMI chart, dues, GST, collections, and disbursement reports through a single service
  - `receipts/receipts-view.component.ts` — single list shell driven by route `data: { formName }` for Receipts / PartPayment / Moratorium; builds on `<app-data-grid>` with a date-range filter
  - `receipts/receipts-shell.component.ts` — single new/edit shell for Receipts / PartPayment / Moratorium (and Preclosure transactions) — replaces 1693-LOC `loanreceipt-new`, 1893-LOC `partpayment`, and 670-LOC `moratorium` components (~4250 LOC saved). Renders a loan summary, particulars grid, mode-specific fields (cheque/UPI/transfer), and a live installment schedule
  - `preclosure/preclosure-tx-view.component.ts` — preclosure list (uses `formname=Preclosure` against the same endpoint family); the new screen routes through `<app-receipts-shell>` for the form
  - `letters/letter-view.component.ts` — single list shell parameterised by `data: { letterKind }` covers Sanction / Disbursement / Delivery Order / Acknowledgements
  - `letters/letter-shell.component.ts` — single edit/print shell using `<app-rich-editor>` (Quill) for the body. Native `window.print()` + a print-only CSS rule replaces the legacy Kendo PDF export (the rich editor renders cleanly to printable HTML). Replaces the 4 legacy letter components (~1100 LOC combined)
  - `reports/loan-report-shell.component.ts` — generic report shell with a date-range filter, auto-derived columns, Excel / PDF export through `<app-data-grid>`. Drives 6 report kinds (`statement`, `emi-chart`, `dues`, `gst`, `collections`, `disbursement-report`)
  - Routes wired (legacy hash names preserved): `/LoanreceiptView`, `/LoanreceiptNew`, `/PartPaymentView`, `/PartPayment`, `/MoratoriumView`, `/Moratorium`, `/LoanpreclosureView`, `/LoanpreclosureNew`, `/SanctionLetter(View)`, `/DisburementLetter(View)`, `/DeliveryorderView`, `/DeliveryorderNew`, `/AcknowledgementsView`, `/AcknowledgementsNew`, `/LoanStatement`, `/EmiChartView`, `/EmiChartReport`, `/Duereports`, `/CollectionsReport`, `/DisbursmentReports`, `/GstReport`
- [x] Phase 8: Accounting — `app-v21/src/app/features/accounting/`
  - `services/accounting-masters.service.ts` — replaces 172-LOC `AccountingMastresService`. Bank-information CRUD, cheque-management, account-tree, HSN codes, sub-categories, GST/TDS lookups.
  - `services/voucher.service.ts` — replaces the voucher half of the 389-LOC `AccountingTransactionsService`. Single API for Payment / TDS Payment / General Receipt / Journal / GST Voucher / GST Payment / Fund Transfer plus shared lookups (ledger list, sub-ledger, party, bank-by-id).
  - `services/cheques.service.ts` — replaces the cheque/BRS half of `AccountingTransactionsService` and the 539-LOC `BrStatementService`. One service drives Cheques-On-Hand / Cheques-Issued / Cheques-In-Bank list+save endpoints, BRS deposits/credits/JV, and cheque enquiry/cancel/return.
  - `services/accounting-reports.service.ts` — replaces 174-LOC `ReportService` plus 9 thin per-report services (`bankbook`, `cashbook`, `general-receipt`, `journal-voucher`, `payment-voucher`, `jv-list-report-services`, `ledger-extract-report`, `subaccountledger-report`, `subledgersummary-report`, `profiandloss-mtdytd-report`, `reprint`) — every one was a wrapper over the same `/AccountingReports` endpoint family.
  - `masters/bank-view.component.ts` + `masters/bank-master.component.ts` — Bank Information CRUD with IFSC validation.
  - `masters/account-tree.component.ts` — read-only chart-of-accounts tree using `<p-tree>` (replaces the legacy Kendo TreeView).
  - `masters/hsn-codes.component.ts` — HSN code master with inline edit.
  - `vouchers/voucher-view.component.ts` — single list shell driven by `data.voucherKind` for Payment / Receipt / Journal / TDS / GST / Pending Fund Transfer. Replaces five separate ~120-160 LOC `*-view` legacy components.
  - `vouchers/voucher-shell.component.ts` — single new/edit shell for every voucher kind. Replaces 1655-LOC `paymentvoucher-new`, 1769-LOC `generalreceipt-new`, 1702-LOC `journalvoucher-new`, plus the TDS / GST / Fund-Transfer voucher screens (~5500 LOC). Header captures voucher date, mode (Cash/Bank), trans-type-specific fields (Cheque / NEFT / RTGS / IMPS / UPI / Card), narration. The line grid handles ledger pick, amount, party, GST and TDS columns. Validation: at least one line + non-empty narration + voucher date.
  - `cheques/cheques-shell.component.ts` — single shell for Cheques-On-Hand / Cheques-Issued / Cheques-In-Bank parameterised by `data.bucket`. Bank dropdown + BRS-aware date-range filter feed the legacy `*_New` endpoints; multi-row save flushes the dirty rows back through the bucket-specific save endpoint.
  - `reports/accounting-report-shell.component.ts` — generic report shell with date-range / group / ledger filters, auto-derived columns, Excel/PDF export through `<app-data-grid>`. Drives ~20 report kinds (Day Book, Cash Book, Bank Book, Trial Balance, P&L, Balance Sheet, Comparison TB, Account Ledger, Party Ledger, Ledger Summary, Ledger Migration, GST, JV List, Payment / Receipt / TDS Payment voucher reports, Subaccount Ledger, Subledger Summary, Ageing Report). Replaces ~12 near-identical legacy `*-report.component.ts` files (~3000 LOC combined).
  - Routes wired (legacy hash names preserved): `/BankView`, `/BankMaster`, `/AccountTree`, `/HsnCodes`, `/PaymentvoucherView`, `/PaymentvoucherNew`, `/GeneralreceiptView`, `/GeneralreceiptNew`, `/JournalvoucherView`, `/JournalvoucherNew`, `/TDSPaymentvoucher`, `/TdsPaymentvoucherView`, `/GstVoucher`, `/GstpaymentVocher`, `/FundTransfer`, `/PendingFundTransfer`, `/ChequesonHandNew`, `/ChequesIssuedNew`, `/ChequesinBankNew`, `/DayBook`, `/CashBook`, `/BankBook`, `/TrialBalance`, `/ProfitAndLoss`, `/BalanceSheet`, `/ComparisionTrialBalance`, `/AccountLedger`, `/PartyLedger`, `/LedgerExtract`, `/AccountLedgerMigration`, `/GstReportNew`, `/JvList`, `/JournalvoucherReport`, `/PaymentVoucherReports`, `/GeneralReceiptReports`, `/TdsPaymentVoucherReports`, `/SubaccountLedgerreports`, `/SubledgerSummary`, `/AgeingReport`.
  - Deferred to a follow-up pass: BRS Statement viewer, Cheque Enquiry / Cancel / Return, BRS Reports + Preview (kept as `<app-feature-placeholder>` with breadcrumb).
- [x] Phase 9: Banking — `app-v21/src/app/features/banking/`
  - `services/banking-masters.service.ts` — replaces 156-LOC `MemberService`, 159-LOC `FdRdServiceService`, 122-LOC `ShareconfigService`, 188-LOC `SavingaccountconfigService`, and the masters slice of 254-LOC `LienEntryService`. The legacy split was 80% identical save/list/get/check-duplicate scaffolding around its own URL family — one service surface now drives every masters shell.
  - `services/deposits.service.ts` — replaces the 302-LOC `FdRdTransactionsService`, the 365-LOC `RdTransactionsService` (70% duplicated since FD and RD share the same scheme + tenure + maturity workflow), and 185-LOC `MaturityPaymentService`. Drives deposit-account creation, maturity, renewal, interest-payment.
  - `services/bank-receipts.service.ts` — consolidates 5 legacy receipt services (`FdReceiptService`, `RdReceiptService`, `SAReceiptService` for savings + share, `MemberReceiptService`) into one. Includes a `saveByKind` dispatcher.
  - `services/banking-reports.service.ts` — replaces the 443-LOC `LAReportsService` (which embedded a 175-LOC inline jsPDF builder — that responsibility now lives in `<app-data-grid>`'s PDF export) and 86-LOC `MembrEnquiryService`. ~25 report endpoints.
  - `masters/member-view.component.ts` + `masters/member-master.component.ts` — Member CRUD with phone / email validation.
  - `masters/deposit-config-view.component.ts` + `masters/deposit-config-shell.component.ts` — single FD/RD config shell parameterised by `data.kind`. Replaces ~6200 LOC across 4 files (`fdconfiguration` 2583, `fdconfig-new` 761, `rdconfiguration` 2145, `rdconfig-new` 743). Four-tab `<app-tabs>` view (Name & Code / Configuration / Loan Facility / Referral) with a two-step save (legacy backend wants name+code first, then full config).
  - `transactions/deposit-account-view.component.ts` + `transactions/deposit-account-shell.component.ts` — generic FD/RD account-creation shell. Three-tab signal-driven cascade: Member & Scheme → Nominees (CVA-style list with primary + allocation total ≤ 100%) → Payment. Live maturity recompute on every dependent field change.
  - `transactions/bank-receipt-view.component.ts` + `transactions/bank-receipt-shell.component.ts` — single receipt shell for FD / RD / Savings / Share / Member receipts (~2400 LOC of legacy code consolidated). Mode-specific cheque / NEFT / UPI fields, dispatches via `saveByKind`.
  - `transactions/maturity-shell.component.ts` — generic Maturity / Renewal / Interest-Payment / Pre-Maturity shell. Lists eligible accounts, multi-select, batch save.
  - `transactions/bond-preview.component.ts` — bond preview using `<app-data-grid>` selection + native `window.print()` against an `@media print` bond-card layout. Replaces the 800+ LOC Kendo-based legacy bond-preview.
  - `letters/banking-letter-shell.component.ts` — drives all 12 banking letters (welcome, cheque submission, default reminder, demand promissory note, disbursement request form, final disbursement advice, foreclosure / prepayment request, loan agreement, loan closing covering letter, loan closure certificate, part disbursement advice, sanction-letter-new). Built-in templates per kind, edit via `<app-rich-editor>`, native `window.print()` with `@media print` chrome hiding. Replaces ~3500 LOC of legacy letter components.
  - `reports/banking-report-shell.component.ts` — generic banking-report shell. Filters auto-show based on `data.reportKind` (date-range / as-on / month / branch / account / type / account-type). Columns auto-derived from the first row. Drives 25 report kinds (interest payment, interest trend, maturity trend, maturity intimation, pre-maturity, pre-maturity month-wise, lien release, self adjustment, member-wise / branch-wise receipts, agent points, agent business, target, cash flow, application form, member enquiry, member details, share issue, savings account, share-savings withdraw, production summary / achieved / target). Replaces ~3500 LOC of legacy report components.
  - Routes wired (legacy hash names preserved): masters (`/MemberView`, `/MemberNew`, `/FdView`, `/FdNew`, `/RdView`, `/RdNew`, plus placeholders for Savings / Shares / Insurance / Lien); transactions (`/FDACCreationView`, `/FDACCreationNew`, `/RDACCreationView`, `/RDACCreationNew`, `/FdReceiptView`, `/FdReceiptNew`, `/RdReceiptView`, `/RdReceiptNew`, `/SAReceipt`, `/ShareReceipt`, `/ShareReceiptView`, `/MemberReceipt`, `/MemberReceiptView`, `/MaturityPayment`, `/MaturityRenewal`, `/InterestPayment`, `/PreMaturity`, `/BondPreview`, `/MaturityBond`); letters (12 individual letter routes); reports (25 individual report routes).
  - Deferred to a follow-up pass: Insurance / Member-Type / Savings / Shares masters, Self-Adjustment / Transfer / Commission Payment transactions, BRS preview, lien-release, share-application/withdrawal — kept as `<app-feature-placeholder>` so the navigation stays intact.
- [x] Phase 10: HRMS + TDS — `app-v21/src/app/features/hrms/`, `app-v21/src/app/features/tds/`
  - `services/hrms.service.ts` — consolidates legacy HRMS payroll / attendance / on-roll / JV / employee / challana / report APIs (~10 legacy services). Shared calendar-year/month lookups; typed row interfaces (`HrmsReportRow`, `CalendarYear`, `CalendarMonth`).
  - `reports/hrms-report-shell.component.ts` — generic HRMS report shell driven by `data.reportKind` (salary statement, payroll approval, pay slip, loyalty, monthly bonus, ESI/PF, professional tax, earned leaves, biometric attendance/summary). Calendar year/month filters where required; `<app-data-grid>` with Excel/PDF export.
  - `transactions/payroll-shell.component.ts` — `process` | `approval` via `data.kind`; branch + calendar month cascade, grid edit/save/authorise.
  - `transactions/attendance-shell.component.ts` — branch employee list + month attendance save.
  - `transactions/onroll-shell.component.ts` — allowances / recoveries / advances tabs via `<app-tabs>`.
  - `masters/employee-view.component.ts` + `masters/employee-shell.component.ts` — employee list + create/edit shell (designation/branch/role lookups).
  - `transactions/jv-details-shell.component.ts` — JV type + authorised month grid save.
  - `transactions/challana-hrms-shell.component.ts` — `entry` | `view` via `data.kind`.
  - HRMS routes wired (legacy hash names preserved); placeholders for SSC Agenda, Salary Update, Leave Details, Promote Salary Report, Member Type.
  - `services/tds.service.ts` — challana checking/payment/CIN entry, TDS reports, PAN update/validation, Form 15-H / 121 APIs (legacy `/TDS/`, `/Banking/Transactions/FdReceipt/`, contact master paths).
  - `reports/tds-report-shell.component.ts` — TDS report, section-wise, challana payment, CIN entry reports.
  - `transactions/challana-tds-shell.component.ts` — `checking` | `payment` | `cin-entry` via `data.kind`.
  - `masters/pan-update.component.ts`, `masters/pan-validation.component.ts`, `masters/tds-form-shell.component.ts` — PAN maintenance + simplified Form 15-H/121/reprint (full legacy multi-tab forms deferred).
  - TDS routes wired; `TdsAccountsSetup` still placeholder.
- [x] Phase 11: Cutover — `app-v21/` promoted to repository root
  - Legacy Angular 8 tree archived under `legacy/` (`legacy/src`, `legacy/package.json`, `legacy/angular.json`, Karma/e2e).
  - Root `package.json` / `angular.json` / `tsconfig.*` now target Angular 21 + PrimeNG; project name `PresentationPages`, output `dist/PresentationPages/`.
  - Kendo, ngx-bootstrap, ngx-toastr, `rxjs-compat`, and related deps removed from the active install (remain only under `legacy/` if needed).
  - `public/assets/appsettings.json` remains the runtime API config entry point.
- Phase 12: QA + perf
- Phase 13: write `MIGRATION_NOTES.md`

