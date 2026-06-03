import type { Routes } from '@angular/router';
import { FeaturePlaceholderComponent } from '../../shared/ui/feature-placeholder/feature-placeholder.component';

const placeholder = (screen: string) => ({
  component: FeaturePlaceholderComponent,
  data: { feature: 'TDS', screen, phase: 'Phase 10' },
});

export const TDS_ROUTES: Routes = [
  { path: 'masters', ...placeholder('TDS Masters') },
  { path: 'transactions', ...placeholder('TDS Transactions') },
  { path: 'reports', ...placeholder('TDS Reports') },

  { path: 'PanUpdate', ...placeholder('PAN Update') },
  { path: 'PanValidation', ...placeholder('PAN Validation') },
  { path: 'TdsAccountsSetup', ...placeholder('TDS Accounts Setup') },
  { path: 'Form15h', ...placeholder('Form 15-H') },
  { path: 'Form15hreprint', ...placeholder('Form 15-H Reprint') },
  { path: 'Form121', ...placeholder('Form 121') },
  { path: 'Form121Reprint', ...placeholder('Form 121 Reprint') },
  { path: 'TdsReport', ...placeholder('TDS Report') },
  { path: 'ChallanaChecking', ...placeholder('Challana Checking') },
  { path: 'ChallanaPayment', ...placeholder('Challana Payment') },
  { path: 'Challanapaymentreport', ...placeholder('Challana Payment Report') },
  { path: 'Challanapaymentreport/:id', ...placeholder('Challana Payment Report') },
  { path: 'CINEntry', ...placeholder('CIN Entry') },
  { path: 'CINEntryReport', ...placeholder('CIN Entry Report') },
  { path: 'SectionWiseReport', ...placeholder('Section Wise Report') },
];
