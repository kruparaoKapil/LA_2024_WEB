import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debug } from 'console';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { BrStatementService } from 'src/app/Services/Accounting/br-statement.service';
import { CommonService } from 'src/app/Services/common.service';
import * as XLSX from 'xlsx';
 
@Component({
  selector: 'app-projection-achieved-report',
  templateUrl: './projection-achieved-report.component.html',
  styles: []
})


 

export class ProjectionAchievedReportComponent implements OnInit {
  projectForm: FormGroup;
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();

  imageResponse: any;
  kycFileName: any;
  kycFilePath: any;

  displayedColumns: any = [];
  excelData: any = [];
  message: string = '';
  pdate: any;
  today: any;
  selectedvalues: any = []
  PlotsLayoutsValidationErrors: any;
  projectionData: any[];
  constructor(private fb: FormBuilder, private datepipe: DatePipe, private _CommonService: CommonService, private _brsService: BrStatementService) {
  }
  ngOnInit() {
    // this.today = this.datepipe.transform(new Date(), 'MMM-yyyy');
    this.today = new Date();

    this.projectForm = this.fb.group({
      // pdate: [this.today, Validators.required],
      pdate: ['', Validators.required],
      pupload: ['']

    });
    let currentdate = new Date();
    // let firstDayOfCurrentMonth = new Date(currentdate.getFullYear(), currentdate.getMonth(), 1);
    // let lastDayOfCurrentYear = new Date(currentdate.getFullYear(), 11, 31);

    this.dpConfig = {
      minMode: 'month',
      dateInputFormat: 'MMM-YYYY',
      showWeekNumbers :false,  
      containerClass :'theme-dark-blue',
      // minDate: firstDayOfCurrentMonth,
      // maxDate: lastDayOfCurrentYear
    };
    this.BlurEventAllControll(this.projectForm);
    this.PlotsLayoutsValidationErrors = {};


  }


  // prevous originalcode  DateChange(event: Date) {
  //   let selectedMonth = new Date(event.getFullYear(), event.getMonth(), 1);
  //   let currentMonth = new Date(this.today.getFullYear(), this.today.getMonth(), 1);

  //   if (selectedMonth < currentMonth) {
  //     this.projectForm.controls['pdate'].setValue(null);
  //     this._CommonService.showWarningMessage(
  //       'Please select a month in the current year and not before this month.'
  //     );
  //   }

  //   this.pdate = this.datepipe.transform(selectedMonth, 'MMM-yyyy');
  // }

  // public onOpenCalendar(container) {
  //   container.monthSelectHandler = (event: any): void => {
  //     container._store.dispatch(container._actions.select(event.date));
  //   };
  //   container.setViewMode('month');
  // }

DateChange(event: Date) {
    if (event) {
      const formatted = this.datepipe.transform(event, 'MMM-yyyy');
      this.projectForm.patchValue({pdate: formatted });
      console.log('Selected Month-Year:', formatted);
    }
  }

  onOpenCalendar(container) {
    if (container && container.setViewMode) {
      container.setViewMode('month');
    }
  }

  //orihnalll uploadAndProgress(event: any, files: FileList | null) {
  //   debugger;
  //   if (!files || files.length === 0) return;
  //   const file = files[0];

  //   this.imageResponse = { name: file.name };
  //   this.projectForm.patchValue({ pupload: file });

  //   const extParts = file.name.split('.');
  //   const ext = extParts.length > 1 ? extParts.pop().toLowerCase() : '';

  //   if (ext === 'xlsx' || ext === 'xls' || ext === 'ods') {
  //     const reader: FileReader = new FileReader();
  //     reader.readAsBinaryString(file);
  //     reader.onload = (e: any) => {
  //       try {
  //         const workbook: XLSX.WorkBook = XLSX.read(e.target.result, { type: 'binary' });
  //         const sheet = workbook.Sheets[workbook.SheetNames[0]];
  //         let data: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

  //         data = (data || []).filter((row: any[]) => row && row.some(cell => cell));

  //         if (data.length > 1 && data[0].length > 0) {
  //           this.displayedColumns = data[0] as string[];
  //           console.log('this is displayed column:', this.displayedColumns);
  //           sessionStorage.setItem('tablecolumns', this.displayedColumns);
 
  //           this.excelData = data.slice(1).map(row =>
  //             row.map((cell, idx) => {
  //               // const colName = this.displayedColumns[idx]?.toLowerCase();
  //               const colName = this.displayedColumns[idx]
  //                 ? this.displayedColumns[idx].toLowerCase()
  //                 : '';


  //               if (colName.includes('%') || colName.includes('percent')) {
  //                 if (typeof cell === 'number') {
  //                   return (cell * 100).toFixed(2) + '%';
  //                 }
  //               }

  //               return typeof cell === 'number'
  //                 ? Number(cell.toFixed(2)) // 
  //                 : cell;
  //             })
  //           ); 
 
  //           console.log('this is excel data:', this.excelData);
  //           sessionStorage.setItem('tabledata', this.excelData);

  //           this.message = '';
  //         } else {
  //           this.displayedColumns = [];
  //           this.excelData = [];
  //           this.message = 'No tabular data found in this file.';
  //         }
  //       } catch (err) {
  //         console.error(err);
  //         this.displayedColumns = [];
  //         this.excelData = [];
  //         this.message = 'Error reading the file.';
  //       }
  //     };
  //   } else {
  //     this.displayedColumns = [];
  //     this.excelData = [];
  //     this.message = 'Unsupported file format. Please upload an Excel/ODS file.';
  //   }
  // }

  












  // saveWithPrint() {
  //   const encoded = btoa(JSON.stringify(this.excelData));
  //   const encoded1 = btoa(JSON.stringify(this.displayedColumns));
  //   window.open(`/#/projectionPreview?id=${encoded}&cols=${encoded1}`, '_blank');
  // }

  


// -----------------------------------


//to make percentage as m=same in excel file also

uploadAndProgress(event: any, files: FileList | null) {
  if (!files || files.length === 0) return;
  const file = files[0];

  this.imageResponse = { name: file.name };
  this.projectForm.patchValue({ pupload: file });

  const extParts = file.name.split('.');
  const ext = extParts.length > 1 ? extParts.pop().toLowerCase() : '';

  
  if (['xlsx', 'xls', 'ods'].includes(ext)) {
  const reader: FileReader = new FileReader();
  reader.readAsBinaryString(file);

   
reader.onload = (e: any) => {
  try {
    const workbook: XLSX.WorkBook = XLSX.read(e.target.result, { type: 'binary' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    let data: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false }) as any[][];

    // Remove empty rows
    data = data.filter((row: any[]) => row && row.some(cell => cell));

    if (data.length > 1) {
      this.displayedColumns = data[0] as string[];
      sessionStorage.setItem('tablecolumns', JSON.stringify(this.displayedColumns));

      //  Keep data exactly as in Excel
      this.excelData = data.slice(1).map(row =>
        row.map(cell => (cell === undefined || cell === null ? '' : String(cell).trim()))
      );

      console.log(' Exact Excel Data:', this.excelData);
      sessionStorage.setItem('tabledata', JSON.stringify(this.excelData));
      this.message = '';
    } else {
      this.displayedColumns = [];
      this.excelData = [];
      this.message = 'No tabular data found in this file.';
    }
  } catch (err) {
    console.error(err);
    this.displayedColumns = [];
    this.excelData = [];
    this.message = 'Error reading the file.';
  }
};


}

  else {
    this.displayedColumns = [];
    this.excelData = [];
    this.message = 'Unsupported file format. Please upload an Excel/ODS file.';
  }
}

 


saveWithPrint() {
  debugger;
  if (!this.excelData || this.excelData.length === 0) {
    this._CommonService.showWarningMessage('No data to save.');
    return;
  }

  // Convert uploaded data to API format
  //original const projectionList = this.excelData.map((row: any) => {
  //   return {
  //     productName: row[0] || '', // 1st column → Product Name
  //     month: this.datepipe.transform(this.projectForm.controls['pdate'].value, 'MMM-yyyy'),
  //     projection: Number(row[1]) || 0,
  //     acheived: Number(row[2]) || 0,
  //     excessOrShort: Number(row[3]) || 0,
  //     percentage: row[4] ? parseFloat(String(row[4]).replace('%', '').trim()) : 0, //  fixed
  //     typeOfOperation: 'INSERT',
  //     created_by: this._CommonService.pCreatedby || 'system',
  //     current_month: this.datepipe.transform(new Date(), 'MMM-yyyy')
  //   };
  // });
const projectionList = this.excelData.map((row: any) => ({
  productName: row[0] || '',
  month: this.datepipe.transform(this.projectForm.controls['pdate'].value, 'MMM-yyyy'),
  projection: Number(row[1]) || 0,
  achieved: Number(row[2]) || 0,          
  excessOrShort: Number(row[3]) || 0,
  percentage: Number(row[4]) || 0,
  typeOfOperation: 'INSERT',
  created_by: String(this._CommonService.pCreatedby || 'system'),  
  current_month: this.datepipe.transform(new Date(), 'MMM-yyyy')
}));

  const payload = { _ProductProjection: projectionList };

  console.log('📦 Final Payload Sent to API:', payload);

  //  Call API before opening preview
  this._brsService.saveProjection(payload).subscribe({
    next: (res) => {
      this._CommonService.showInfoMessage('Projection data saved successfully.');

      // Then open preview page
      const encoded = btoa(JSON.stringify(this.excelData));
      const encodedCols = btoa(JSON.stringify(this.displayedColumns));
      window.open(`/#/projectionAchievedPreview?id=${encoded}&cols=${encodedCols}`, '_blank');
    },
    error: (err) => {
      console.error(' Save failed:', err);
      this._CommonService.showErrorMessage('Failed to save projection data.');
    }
  });
}









  sampleform() {
    debugger;
    // let pdfUrl = 'assets/Projection-data.pdf';
    // window.open(pdfUrl, '_blank');
  }


  //validations


  BlurEventAllControll(fromgroup: FormGroup) {
    try {
      Object.keys(fromgroup.controls).forEach((key: string) => {
        this.setBlurEvent(fromgroup, key);
      })
    }
    catch (e) {
      return false;
    }
  }
  setBlurEvent(fromgroup: FormGroup, key: string) {
    try {
      let formcontrol;
      formcontrol = fromgroup.get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          this.BlurEventAllControll(formcontrol)
        }
        else {
          if (formcontrol.validator)
            fromgroup.get(key).valueChanges.subscribe((data) => { this.GetValidationByControl(fromgroup, key, true) })
        }
      }
    }
    catch (e) {
      return false;
    }
  }

  checkValidations(group: FormGroup, isValid: boolean): boolean {
    try {
      Object.keys(group.controls).forEach((key: string) => {
        isValid = this.GetValidationByControl(group, key, isValid);
      })
    }
    catch (e) {
      return false;
    }
    return isValid;
  }

  GetValidationByControl(formGroup: FormGroup, key: string, isValid: boolean): boolean {
    try {

      let formcontrol;
      formcontrol = formGroup.get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          this.checkValidations(formcontrol, isValid)
        }
        else if (formcontrol.validator) {
          this.PlotsLayoutsValidationErrors[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {

            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                let lablename;
                lablename = (document.getElementById(key) as HTMLInputElement).title;
                errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.PlotsLayoutsValidationErrors[key] += errormessage + ' ';
                isValid = false;
              }
            }
          }
        }
      }
    }
    catch (e) {
      return false;
    }
    return isValid;
  }
}