import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
//import { IrisgstServiceService } from '../../Services/irisgst-service.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/Services/common.service';
import { PageCriteria } from 'src/app/Models/Loans/Masters/pagecriteria';
import * as XLSX from 'xlsx';
import { BrStatementService } from 'src/app/Services/Accounting/br-statement.service';

interface GSTRItem {
  type: string;
  invoicenumber: string;
  gstnumber: string;
  date: string;
  additionalInfo: string;
  creditNoteType: string;
  debitNoteType: string;
}
interface DTO {
  pgstinOfSupplier: string;
  plegalName: string;
  pinvoiceNumber: number;
  pinvoicetype: string;
  pinvoicedate: string;
  pinvoiceValue: number;
  pplaceOfSupply: string;
  psupplyAttractReverseCharge: string;
  //prate: number;
  ptaxableValue: number;
  pintegratedTax: number;
  pcentralTax: any;
  pstateOrUtTax: any;
  pcess: any;
  pGSTR1IFFGSTR5Period: string,
  pGSTR1IFFGSTR5FilingDate: string,
  pitcAvailability: string,

  preason: string,
  papplicablePerOfTaxRate: number,
  psource: string,
  pirn: string,
  pirnDate: string,

  poriginalInvoiceNumber: string,
  poriginalInvoiceDate: string,

  pnoteNumber: number,
  pnoteType: string,
  pnoteSupplyType: string,
  pnoteDate: string,
  pnoteValue: number,
  // placeOfSupply:string,

  poriginalNoteType: string,
  poriginalNoteNumber: number,
  poriginalNoteDate: string,
  ptype: string
}
@Component({
  selector: 'app-projection-report',
  templateUrl: './projection-report.component.html',
  styles: []
})
 
 
export class ProjectionReportComponent implements OnInit {
  centralgstForm: FormGroup;
  data: GSTRItem[] = [];
  pageCriteria: PageCriteria;

  selectedValue: string = '';
  selectValidation: any;
  Exceldata: any = [];
  columns: any[] = [];
  columnHeaders: string[] = [];
  normalizedHeaders: string[] = [];
  NormalizedExcelData: any;
  headers: any;
  SaveStatus: boolean = false;
  gridData: any;
  dataMap: DTO[];
  mappedJsonData: DTO[];




  selectedSection: string = 'uploadFile';
  excelData: any[] = [];
  constructor(private fb: FormBuilder,
    private activatedRoute: ActivatedRoute, private toastr: ToastrService, private commonService: CommonService, private router: Router, private _brservice: BrStatementService) {
    this.pageCriteria = new PageCriteria();
  }


  ngOnInit() {
    this.formdetails();
    this.Exceldata = '';
    this.setPageModel();
  }

  formdetails() {
    this.centralgstForm = this.fb.group({
      // pSelectFile: ['Select format', Validators.required],
      pMonth: ['', Validators.required],
      pUploadFile: ['', Validators.required]
    });
  }
  showSuccess() {
    this.toastr.success('Saved Successfully');
  }
  showError() {
    this.toastr.error('Error while saving');
  }
  showErrorMessage(msg: string) {
    this.toastr.error(msg);
  }
  onSelectChange(event: Event) {
    debugger;

    // this.selectedValue = this.centralgstForm.controls['pSelectFile'].value;
    console.log('This selected value', this.selectedValue);

    if (this.selectedValue != 'Select format') {
      this.selectValidation = '';
    }
    else {
      this.selectValidation = 'Please select type of format to upload';
    }
    this.Exceldata = '';
    this.columns = [];
    this.columnHeaders = [];
    this.gridData = '';
    this.NormalizedExcelData = '';
    this.centralgstForm.controls['pUploadFile'].setValue('');
    this.headers = [];
  }
  getB2AData() {
    return this.data.filter(item => item.type === 'B2A');
  }

  getB2BAData() {

    return this.data.filter(item => item.type === 'B2BA');
  }

  getB2BCreditNoteData() {

    return this.data.filter(item => item.type === 'B2BCreditNote');
  }

  getB2BDebitNoteData() {

    return this.data.filter(item => item.type === 'B2BDebitNote');
  }



  convertDate(excelDate: any): string | null {
    console.log("Input to convertDate:", excelDate);

    if (excelDate === undefined || excelDate === null) {
      return null;
    }

    //if (typeof excelDate === 'number') {
    // const date = new Date(Math.round((excelDate - 25569) * 86400 * 1000));
    // return date.toISOString().split('T')[0];
    //}

    if (typeof excelDate === 'string' && excelDate.trim() !== '') {
      const parts = excelDate.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        const parsedDate = new Date(year, month, day);
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      }
    }

    return null;
  }
  convertExcelDate(value: any): string | number {
    if (typeof value === 'number') {
      const excelDateThreshold = 1;
      const currentYear = new Date().getFullYear();
      const maxExcelDate = Math.floor((new Date(currentYear, 11, 31).getTime() - new Date(1900, 0, 1).getTime()) / (1000 * 60 * 60 * 24)) + 1; // Max date for the current year

      if (value >= excelDateThreshold && value <= maxExcelDate) {
        const date = new Date((value - 25569) * 86400 * 1000);
        return date.toLocaleDateString();
      }
    }
    return value;
  }
  // mapData(jsonData: any[]) {
  //   debugger
  //   this.dataMap = jsonData.map(row => {
  //     const unifiedRow: DTO = {
  //       pgstinOfSupplier: row['GSTIN of supplier'] || null,
  //       plegalName: row['Trade/Legal name'] || null,
  //       pinvoiceNumber: row['Invoice number'] || null,
  //       pinvoicetype: row['Invoice type'] || null,
  //       pinvoicedate: this.convertDate(row['Invoice Date']),
  //       pinvoiceValue: row['Invoice Value(₹)'] || null,
  //       pplaceOfSupply: row['Place of supply'] || null,
  //       psupplyAttractReverseCharge: row['Supply Attract Reverse Charge'] || null,
  //       //prate: row['Rate(%)'] || null,
  //       ptaxableValue: row['Taxable Value (₹)'] !== undefined ? Number(row['Taxable Value (₹)']) : null,
  //       pintegratedTax: row['Integrated Tax(₹)'] !== undefined ? Number(row['Integrated Tax(₹)']) : null,
  //       pcentralTax: row['Central Tax(₹)'] !== undefined ? row['Central Tax(₹)'] : null,
  //       pstateOrUtTax: row['State/UT Tax(₹)'] !== undefined ? Number(row['State/UT Tax(₹)']) : null,
  //       pcess: row['Cess(₹)'] !== undefined ? Number(row['Cess(₹)']) : null,
  //       pGSTR1IFFGSTR5Period: row['GSTR-1/IFF/GSTR-5 Period'] || null,
  //       pGSTR1IFFGSTR5FilingDate: this.convertDate(row['GSTR-1/IFF/GSTR-5 Filing Date']),
  //       pitcAvailability: row['ITC Availability'] || null,
  //       preason: row['Reason'] || null,
  //       papplicablePerOfTaxRate: row['Applicable % of Tax Rate'] || null,
  //       psource: row['Source'] || null,
  //       pirn: row['IRN'] || null,
  //       pirnDate: this.convertDate(row['IRN Date']),
  //       poriginalInvoiceNumber: row['Original invoice number'] || null,
  //       poriginalInvoiceDate: this.convertDate(row['Original invoice date']),
  //       pnoteNumber: row['Note number'] !== undefined && row['Note number'] !== null ? Number(row['Note number']) : 0, // Assign 0 if not present
  //       pnoteType: row['Note type'] || null,
  //       pnoteSupplyType: row['Note supply type'] || null,
  //       pnoteDate: this.convertDate(row['Note date']),
  //       pnoteValue: row['Notevalue (₹)'] !== undefined && row['Notevalue (₹)'] !== null ? Number(row['Notevalue (₹)']) : 0,
  //       poriginalNoteType: row['Original note type'] || null,
  //       poriginalNoteNumber: row['Original note number'] || null,
  //       poriginalNoteDate: this.convertDate(row['Original note date']),
  //       ptype: this.selectedValue
  //     };
  //     return unifiedRow;
  //   });
  //   return this.dataMap;
  // }

  // 5/11/2025 onFileChange(event: any) {
  //   const file = event.target.files[0];
  //   if (!file) return;

  //   const allowedExtensions = ['xls', 'xlsx', 'ods'];
  //   const ext = file.name.split('.').pop().toLowerCase();

  //   if (!allowedExtensions.includes(ext)) {
  //     this.showErrorMessage('Upload only Excel or ODS files');
  //     return;
  //   }

  //   const reader = new FileReader();
  //   if (ext === 'ods') {
  //     reader.readAsArrayBuffer(file);
  //   } else {
  //     reader.readAsBinaryString(file);
  //   }

  //   reader.onload = (e: any) => {
  //     const rawData = this.commonService.excelupload(e.target.result);

  //     this.excelData = rawData.slice(1).map((row: any[]) => ({
  //       product: row[0] || '',

  //       oct: {
  //         proj: row[1] || '',
  //         ach: row[2] || '',
  //         short: row[3] || '',
  //         per: row[4] || ''
  //       },

  //       nov: {
  //         proj: row[5] || '',
  //         ach: row[6] || '',
  //         short: row[7] || '',
  //         per: row[8] || ''
  //       },

  //       dec: {
  //         proj: row[9] || '',
  //         ach: row[10] || '',
  //         short: row[11] || '',
  //         per: row[12] || ''
  //       },

  //       total: {
  //         proj: row[13] || '',
  //         ach: row[14] || '',
  //         short: row[15] || '',
  //         per: row[16] || ''
  //       }
  //     }));

  //     console.log('Final ExcelData:', this.excelData);
  //   };
  // }


  //---------------------


  // perfect  onFileChange(event: any) {
  //   const file = event.target.files[0];
  //   if (!file) return;

  //   const allowedExtensions = ['xls', 'xlsx', 'ods'];
  //   const ext = file.name.split('.').pop().toLowerCase();

  //   if (!allowedExtensions.includes(ext)) {
  //     this.showErrorMessage('Upload only Excel or ODS files');
  //     return;
  //   }

  //   const reader = new FileReader();

  //   if (ext === 'ods') {
  //     reader.readAsArrayBuffer(file);
  //   } else {
  //     reader.readAsBinaryString(file);
  //   }

  //   reader.onload = (e: any) => {
  //     let fileData = e.target.result;

  //     // ✅ Read Excel/ODS file into workbook
  //     let workbook = XLSX.read(fileData, { 
  //       type: ext === 'ods' ? 'array' : 'binary',
  //       cellDates: true
  //     });

  //     // ✅ Use the first sheet only
  //     const sheetName = workbook.SheetNames[0];
  //     const sheet = workbook.Sheets[sheetName];

  //     // ✅ Convert sheet to JSON in 2D Array format
  //     let rows: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  //     // ✅ Remove header row
  //     rows.shift();

  //     // ✅ Map rows to your required structure
  //     // okkthis.excelData = rows.map((row: any[]) => ({
  //     //   product: row[0] || '',

  //     //   oct: { proj: row[1] || '', ach: row[2] || '', short: row[3] || '', per: row[4] || '' },

  //     //   nov: { proj: row[5] || '', ach: row[6] || '', short: row[7] || '', per: row[8] || '' },

  //     //   dec: { proj: row[9] || '', ach: row[10] || '', short: row[11] || '', per: row[12] || '' },

  //     //   total: { proj: row[13] || '', ach: row[14] || '', short: row[15] || '', per: row[16] || '' }
  //     // }));
  // this.excelData = rows.map((row: any[]) => ({
  //   product: row[0] || '',

  //   oct: { 
  //     proj: row[1] || '', 
  //     ach: row[2] || '', 
  //     short: row[3] || '', 
  //     per: this.formatPercentage(row[4]) 
  //   },

  //   nov: { 
  //     proj: row[5] || '', 
  //     ach: row[6] || '', 
  //     short: row[7] || '', 
  //     per: this.formatPercentage(row[8]) 
  //   },

  //   dec: { 
  //     proj: row[9] || '', 
  //     ach: row[10] || '', 
  //     short: row[11] || '', 
  //     per: this.formatPercentage(row[12]) 
  //   },

  //   total: { 
  //     proj: row[13] || '', 
  //     ach: row[14] || '', 
  //     short: row[15] || '', 
  //     per: this.formatPercentage(row[16]) 
  //   }
  // }));

  //     console.log('✅ Final ExcelData:', this.excelData);
  //   };
  // }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const allowedExtensions = ['xls', 'xlsx', 'ods'];
    const ext = file.name.split('.').pop().toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      this.showErrorMessage('Upload only Excel or ODS files');
      return;
    }

    const reader = new FileReader();
    if (ext === 'ods') {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsBinaryString(file);
    }

    reader.onload = (e: any) => {
      let fileData = e.target.result;

      //   Read Excel/ODS file
      let workbook = XLSX.read(fileData, {
        type: ext === 'ods' ? 'array' : 'binary',
        cellDates: true
      });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      let rows: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      //   Skip first 2 header rows from Excel
      rows.splice(0, 2);

      //   Convert to table rows
      // originalthis.excelData = rows.map((row: any[]) => ({
      //   product: row[0] || '',
      //   oct: { proj: row[1] || '', ach: row[2] || '', short: row[3] || '', per: this.formatPercentage(row[4]) },
      //   nov: { proj: row[5] || '', ach: row[6] || '', short: row[7] || '', per: this.formatPercentage(row[8]) },
      //   dec: { proj: row[9] || '', ach: row[10] || '', short: row[11] || '', per: this.formatPercentage(row[12]) },
      //   total: { proj: row[13] || '', ach: row[14] || '', short: row[15] || '', per: this.formatPercentage(row[16]) }
      // }));
    
      // perfecttttt this.excelData = rows.map((row: any[]) => {
      //   const calcPercent = (proj: any, ach: any) => {
      //     if (!proj || proj == 0) return '';
      //     let p = ((ach / proj) * 100);
      //     return p.toFixed(2) + '%';
      //   };

      //   return {
      //     product: row[0] || '',

      //     oct: {
      //       proj: row[1] || '',
      //       ach: row[2] || '',
      //       short: row[3] || '',
      //       per: calcPercent(row[1], row[2])
      //     },

      //     nov: {
      //       proj: row[5] || '',
      //       ach: row[6] || '',
      //       short: row[7] || '',
      //       per: calcPercent(row[5], row[6])
      //     },

      //     dec: {
      //       proj: row[9] || '',
      //       ach: row[10] || '',
      //       short: row[11] || '',
      //       per: calcPercent(row[9], row[10])
      //     },

      //     total: {
      //       proj: row[14] || '',
      //       ach: row[15] || '',
      //       short: row[16] || '',
      //       per: calcPercent(row[14], row[15])
      //     }
      //   };
      // });
 
this.excelData = rows.map((row: any[], index: number) => {
  const isLastRow = index === rows.length - 1; // ✅ identify total row

  const calcPercent = (proj: any, ach: any) => {
    if (!proj || proj == 0) return '';
    return ((ach / proj) * 100).toFixed(2) + '%';
  };

  return {
    product: row[0] || '',

    oct: {
      proj: row[1] || '',
      ach: row[2] || '',
      short: row[3] || '',
      per: isLastRow ? '' : calcPercent(row[1], row[2])  // ✅ no % in last row
    },

    nov: {
      proj: row[5] || '',
      ach: row[6] || '',
      short: row[7] || '',
      per: isLastRow ? '' : calcPercent(row[5], row[6])
    },

    dec: {
      proj: row[9] || '',
      ach: row[10] || '',
      short: row[11] || '',
      per: isLastRow ? '' : calcPercent(row[9], row[10])
    },

    total: {
      proj: row[14] || '',
      ach: row[15] || '',
      short: row[16] || '',
      per: isLastRow ? '' : calcPercent(row[14], row[15])
    }
  };
});

      console.log('  Final ExcelData:', this.excelData);
    };
  }

  formatPercentage(value: any) {
    if (value === '' || value === null || value === undefined) return '';
    if (isNaN(value)) return value; // if it's already like 90%
    return (parseFloat(value) * 100).toFixed(2) + '%';
  }


  //1st formatPercentage(value: any): string {
  //   if (value === '' || value === null || value === undefined) return '';
  //   const num = Number(value);
  //   if (isNaN(num)) return value;  
  //   return (num * 100).toFixed(2) + '%';
  // }


  onFooterPageChange(event): void {
    this.pageCriteria.offset = event.page - 1;
    if (this.pageCriteria.totalrows < event.page * this.pageCriteria.pageSize) {
      this.pageCriteria.currentPageRows = this.pageCriteria.totalrows % this.pageCriteria.pageSize;
    }
    else {
      this.pageCriteria.currentPageRows = this.pageCriteria.pageSize;
    }
  }
  setPageModel() {
    this.pageCriteria.pageSize = this.commonService.pageSize;
    this.pageCriteria.offset = 0;
    this.pageCriteria.pageNumber = 1;
    this.pageCriteria.footerPageHeight = 20;
  }



  SaveGstr() {
    debugger;
    if (this.excelData.length === 0) {
      alert("No data to preview!");
      return;
    }
    // this._brservice.setTableData(this.excelData);   
    // localStorage.setItem('previewData', JSON.stringify(this.excelData));
    sessionStorage.setItem('previewData', JSON.stringify(this.excelData));
    window.open(`/#/projectionPreview?id`, '_blank');

  }



}