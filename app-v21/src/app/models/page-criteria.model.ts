/**
 * Pagination/grid metadata shape used by legacy `<kendo-grid>` paging code.
 * Fields kept verbatim so the new `<app-data-grid>` (Phase 3) can adapt them.
 */
export class PageCriteria {
  pageSize: number = 10;
  offset: number = 0;
  pageNumber: number = 1;
  totalrows: number = 0;
  count: number = 0;
  currentPageRows: number = 0;
  isShowGrid: boolean = false;
  footerPageHeight: number = 50;
  footerMessagetext1: string = 'out of';
  footerMessagetext2: string = 'records';
  headerHeight: number = 50;
  rowHeight: number = 50;
  TotalPages: number = 1;
  CurrentPage: number = 1;
}
