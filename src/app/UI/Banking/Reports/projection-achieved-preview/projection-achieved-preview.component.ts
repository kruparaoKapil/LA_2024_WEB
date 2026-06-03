import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/Services/common.service';


@Component({
  selector: 'app-projection-achieved-preview',
  templateUrl: './projection-achieved-preview.component.html',
  styles: []
})
 
 
export class ProjectionAchievedPreviewComponent implements OnInit {
  branchId: any;
  branchName: any;
  path: string;
  projectionData: any = [];
  fileName: string;
  fileType: string;
  groupedColumns: any = [];
  previewData: any = [];

  displayedColumns: any = [];
  excelData: any = [];

  // Dynamic headers
  mainHeaders: any[] = [];
  subHeaders: any[] = [];

  constructor(
    private http: HttpClient,
    private activatedroute: ActivatedRoute,
    private commonservice: CommonService
  ) {}

  // original
   ngOnInit() {
    const encodedData = this.activatedroute.snapshot.queryParamMap.get('id');
    const encodedCols = this.activatedroute.snapshot.queryParamMap.get('cols');

    if (encodedData && encodedCols) {
      try {
        this.excelData = JSON.parse(atob(encodedData));
        this.displayedColumns = JSON.parse(atob(encodedCols));

        //  Convert percentage values (like 0.9 → 90.00%)
        this.excelData = this.excelData.map((row: any[]) =>
          row.map((val: any, i: number) => {
            // If column header has "%", multiply and format
            if (this.displayedColumns[i] && this.displayedColumns[i].includes('%')) {
              const num = parseFloat(val);
              if (!isNaN(num)) return (num * 100).toFixed(2) + '%';
            }
            // Or detect by value pattern (if between 0 and 2, treat as percentage)
            if (!isNaN(val) && val > 0 && val <= 2 && !String(val).includes('%')) {
              return (parseFloat(val) * 100).toFixed(2) + '%';
            }
            return val;
          })
        );

      } catch (e) {
        console.error('Error decoding preview data:', e);
        this.excelData = [];
        this.displayedColumns = [];
      }
    }

    console.log('Preview Columns:', this.displayedColumns);
    console.log('Preview Data:', this.excelData);

    this.generateDynamicHeaders();
  }
 
  generateDynamicHeaders() {
    if (!this.excelData || this.excelData.length === 0) return;

    const headerRow = this.excelData[0];
    const subGroupSize = 4; // (Projections, Achieved, Excess/(Short), %)
    this.mainHeaders = [];
    this.subHeaders = [];

    // Only ONE Product Name column (not repeated)
    this.mainHeaders.push({ label: 'Product Name', colspan: 1 });
    this.subHeaders.push('Product Name');

    //  Extract month names from displayedColumns dynamically
    let potentialMonthNames = this.displayedColumns.filter(
      (x: string) =>
        x &&
        ![
          'Product Name',
          'Projections',
          'Achieved',
          'Excess/(Short)',
          '%',
          'Month 5'
        ].includes(x)
    );

    // 🔹 Remove duplicates and blanks
    potentialMonthNames = potentialMonthNames.filter(
      (v, i, a) => a.indexOf(v) === i && v.trim() !== ''
    );

    let monthCounter = 0;
    for (let i = 1; i < headerRow.length; i += subGroupSize) {
      const group = headerRow.slice(i, i + subGroupSize);

      // skip empty/null groups
      if (group.every((x: any) => x == null || x === '')) continue;

      const label =
        potentialMonthNames[monthCounter] ||
        (monthCounter === potentialMonthNames.length - 1
          ? 'Total'
          : `Month ${monthCounter + 1}`);

      this.mainHeaders.push({ label, colspan: group.length });
      this.subHeaders.push(...group);

      monthCounter++;
    }

    // Remove extra "Month 5" or undefined headers if any
    this.mainHeaders = this.mainHeaders.filter(
      (h) => h.label && !h.label.toLowerCase().includes('month 5')
    );

    console.log(' Main Headers:', this.mainHeaders);
    console.log(' Sub Headers:', this.subHeaders);
  }

  functionA() {
    if (!this.fileName) {
      this.commonservice.showWarningMessage('You haven’t uploaded a file');
      return;
    }
    const openFile = this.path + this.fileName;
    window.open(openFile, '_blank');
  }
}