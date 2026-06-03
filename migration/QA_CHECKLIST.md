# Phase 12 — Manual smoke checklist

Use hash URLs (`http://localhost:4200/#/...`) after `npm start`. Sign in with a test user that has access to all modules.

## Auth & shell

- [ ] `#/Login` — valid/invalid credentials, loader, toast errors
- [ ] `#/Dashboard` — user name, sign-out
- [ ] Branch selection (if prompted) persists on reload

## Common

- [ ] `#/GroupView` — grid sort/filter, double-click edit
- [ ] `#/GroupCreation` — save, member add/remove

## Settings

- [ ] `#/UsersView` / `#/UsersRegistration`
- [ ] `#/BranchConfig` — dialog + address sub-form
- [ ] `#/AdvocateLawyerView` / `#/ReferralAgentView` / `#/GenerateidMaster`
- [ ] Placeholder screens open without console errors (Company Config, Employee Master, etc.)

## Loans

- [ ] `#/Fiindividual` — list → open shell, tab through sub-forms
- [ ] `#/ContactView` / `#/ContactNew`
- [ ] `#/Televerification` / `#/ApprovalView` / `#/DisbursementView`
- [ ] `#/LoanreceiptView` / `#/LoanpreclosureView`
- [ ] `#/SanctionLetterView` — print preview
- [ ] One dues/collections report — run report, Excel export, PDF export

## Banking

- [ ] `#/MemberView` / `#/FdView` / `#/FDACCreationView`
- [ ] `#/FdReceiptView` — save receipt flow
- [ ] `#/MaturityPayment` — batch selection
- [ ] One banking report (e.g. `#/InterestPaymentReport`) — filters + grid export
- [ ] One letter route — edit template, print

## Accounting

- [ ] `#/AccountTree` / `#/BankView`
- [ ] `#/JournalvoucherView` or payment voucher view
- [ ] `#/CashBook` or `#/DayBook` report
- [ ] Cheque enquiry / cancel if used in production

## HRMS

- [ ] `#/EmployeeNewView` / `#/EmployeeNewHrms`
- [ ] `#/PayrollProcess` / `#/PayrollApproval`
- [ ] `#/PaySlip` report
- [ ] `#/ChallanaEntryHRMS`

## TDS

- [ ] `#/PanUpdate` / `#/PanValidation`
- [ ] `#/ChallanaChecking` / `#/ChallanaPayment`
- [ ] `#/TdsReport`

## Visual parity notes

| Screen | Legacy OK? | New OK? | Notes |
|--------|:----------:|:-------:|-------|
| Login | | | |
| Dashboard | | | |
| FI Individual shell | | | |
| Member list | | | |
| Cash book report | | | |

Attach screenshots to your release ticket or store under `migration/screenshots/` (gitignored) if needed.
