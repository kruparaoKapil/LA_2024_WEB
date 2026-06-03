import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/Services/common.service';
import { DatePipe } from '@angular/common';
import html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';
import { NumberToWordsPipe } from 'src/app/Pipes/number-to-words.pipe';
import { VerificationService } from 'src/app/Services/Loans/Transactions/verification.service';

@Component({
  selector: 'app-form15hreprint',
  templateUrl: './form15hreprint.component.html',
  styleUrls: ['./form15hreprint.component.css'],
  providers: [NumberToWordsPipe]
})
export class Form15hreprintComponent implements OnInit {
 //@ViewChild('pdf') pdf;
  @Output() printedDate: any;

  Form15Group: FormGroup;
  formData: any =[];
  loading = false;
  errorMessage = '';
  identificationno = '';
  //localschema = '';
  reportType = ''; // 'Original' or 'Reprint'
  printFileName = '';
  todayDate: any;
  today: number = Date.now();
  companyData: any;
  pCompanyName: any;
  pAddress1: any;
  pAddress2: any;
  pCinNo: any;
  pGstinNo: any;
  pBranchname: any;
  duplicate: any;
  income_paiddate: any;
  declarationreceived_date: any;
  cancelled: boolean = false;
     printedon: any;
  companyAddress: string;
  uid: any;
  constructor(
    private datepipe: DatePipe,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _VerificationService: VerificationService,
    private _commonService: CommonService,
    private datePipe: DatePipe,
    private numberToWords: NumberToWordsPipe
  ) {
    this.printedon = this._commonService.pdfProperties("Date");
    this.Form15Group = this.fb.group({
      uid: ['']
    });
  }

  ngOnInit(): void {
    debugger;
    this.todayDate = this._commonService.getFormatDateGlobal(this.today);
    
    this.handleRouteParams();
    
  }

private handleRouteParams(): void {
  debugger;
  this.activatedRoute.queryParams.subscribe(params => {
    const encoded1 = params['id'];
    if (!encoded1) {
      this._commonService.showErrorMessage('Missing Form 15H parameters.');
      return;
    }

    try {
      // const decoded = atob(encoded1.replace(/\s/g, '+'));
      const decoded = atob(encoded1);
      // const splitData = decoded.split(',');
       const result = decoded.split('@');
       console.log(result);
       this.uid = result[0] || '';
       this.reportType = result[2];
       console.log("Decoded UID:", this.uid);
       this.Form15Group.patchValue({
        uid: this.uid
      });

      if (this.uid) {
        this.getForm15hDetails(this.uid);
      } else {
        this._commonService.showWarningMessage('Invalid or incomplete Form 15H parameters.');
      }

       this.printFileName = `Form15H_${this.uid}`;

    } catch (e) {
      console.error('Error decoding Form 15H reprint params:', e);
      this._commonService.showErrorMessage('Invalid or corrupted Form 15H parameters.');
    }
  });
}

formatDate(dateStr: string) {
  debugger;
  if (!dateStr) return '';
  const [datePart] = dateStr.split(' ');
  const [day, month, year] = datePart.split('-');
  const date = new Date(+year, +month - 1, +day);
  return this.datePipe.transform(date, 'dd-MMM-yyyy');
}


 getForm15hDetails(uid) {
  debugger;
  this.loading = true;
  this._commonService.GetForm15hReport(uid)
    .subscribe({
      next: (res) => {
        this.loading = false;
        if (res && res.length > 0) {
          this.formData = res[0];
        this.formData.income_paiddate = this.formatDate(this.formData.income_paiddate);
        this.formData.declarationreceived_date = this.formatDate(this.formData.declarationreceived_date);
          this.cancelled = this.formData.cancelled === 1;
          console.log(' Form 15H Data:', this.formData);
        } else {
          this._commonService.showWarningMessage('No Form 15H data found for this Pan No.');
        }
      },
      error: (err) => {
        console.error(' Error fetching Form 15H report:', err);
        this._commonService.showErrorMessage('Failed to fetch Form 15H data.');
        this.loading = false;
      }
    });
}

  titleCase(str: string): string {
    if (!str) return '';
    const splitStr = str.toLowerCase().split(' ');
    for (let i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
  }

  pdfOrprint(){
    let printContents = document.getElementById('temp-box').innerHTML;
    let popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Form 15H</title>
          <link rel="stylesheet" type="text/css" href="assets/css/bootstrap.min.css"/>
          <link rel="stylesheet" type="text/css" href="assets/css/custom.css" />
          <style>

 .form15h-container {
  width: 210mm;             
  min-height: 297mm; 
  margin: 0 auto;            
  padding: 0mm 0mm;        
  background: #fff;
  border: 1px solid #000;
  box-sizing: border-box;
  transform: none;          
}

.page-1,
.page-2 {
  width: 100%;
  min-height: 287mm;
  background: #fff;
  padding: 0mm;                  
  border: 1px solid #000;
  box-sizing: border-box;
  page-break-after: always;
}

/* === Print Optimization === */
@media print {
  body, html {
    width: 210mm;
    height: 297mm;
  
    background: #ffffffff;
    margin-left: 2mm;
    margin-right: 2mm;
    margin-top: 5mm;
    margin-bottom: 5mm;
  }

 


  .no-print {
    display: none !important;
  }
    /* Keep all internal lines sharp and black */
.info-row, .block-row {
  border-bottom: 1px solid rgba(0, 0, 0, 1);
}

.info-item, .block-cell {
  border-right: 1px solid rgba(0, 0, 0, 1);
}

.info-row, .block-row {
  border-collapse: collapse;
  border-spacing: 0;
}

* {
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

}

.header h6 {
  font-weight: bold;
  font-size: 20px;
  margin: 0;
  text-align: center;
}

.sub-header {
  text-align: center;
  font-size: 18px;
  margin: 2px 0;
}

.info-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 2px;
  box-sizing: border-box;
}

.section-title {
  font-weight: bold;
  font-size: 16px;
  padding: 1px 3px;
  margin: 4px 0 0 0;
  background: #f7f7f7;
  width: 100%;
  // box-sizing: border-box;
    border-bottom: 1px solid #000;
}

.info-row, .block-row {
  display: flex;
  width: 100%;
  margin: 0;
  padding: 1px 0;
  box-sizing: border-box;
}

.info-row:last-child, .block-row:last-child {
  border-bottom: none;
}

.info-item,
.block-cell {
  flex: 1;
  padding: 1px 6px;
  text-align: left;

  white-space: normal !important;
  word-wrap: break-word !important;
  overflow-wrap: break-word !important;
  word-break: break-word !important;
  text-overflow: unset !important;
}

.label, .value {
  white-space: normal !important;
  word-wrap: break-word !important;
  overflow-wrap: break-word !important;
  word-break: break-word !important;
}
#temp-box * {
  white-space: normal !important;
  word-break: break-word !important;
}

.label {
  font-weight: 600;
  font-size: 16px;
  margin: 0 0 1px 0;
  display: block;
}

.value {
  display: block;
  font-size: 17px;
  margin: 0;
  padding-bottom: 1px;
}
  .header .part-title {
   font-weight: bold;
  font-size: 17px;
  margin: 1px;
  text-align: center;
  border-bottom: 1px solid #000;
}


.declaration {
  padding: 4px 0;
  padding-left: 1mm;
  padding-right: 1mm;
  margin-top: 6px;
  text-align: justify;
  line-height: 2.0;
  font-size: 15px;
}

/* Separate styling for part 2 content */
.declarationpart2-content {
  padding: 4px 0;
  padding-left: 1mm;    
  padding-right: 1mm;    
  margin-top: 4px;
  text-align: justify;
  line-height: 1.6;
  font-size: 12px;        
}


/* Signature remains normal */
.signature-section {
  padding: 2px 0;
  margin-top: 7px;
  text-align: justify;
  line-height: 1.6;
  font-size: 14px;
}


.signature-row {
  display: flex;
  justify-content: space-between;
  margin-top: 7px;
}

.signature-left, .signature-right {
  width: 48%;
}
  /* === Underline field (for names, years, etc.) === */
.underline-value {
  display: inline-block;
  min-width: 100px;          /* adjustable width */
  border-bottom: 1px solid #000;
  text-align: center;
  line-height: 1.2;
  padding: 0 4px;
  font-weight: 600;
  font-size: 16px;
}

/* For longer underline fields (like full address or large text) */
.underline-long {
  display: inline-block;
  width: 250px;              /* increase width as needed */
  border-bottom: 1px solid #000;
  text-align: center;
  padding: 0 4px;
  font-weight: 600;
  font-size: 14px;
}


.signature-right {
  text-align: right;
}.checkbox-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.chk-label {
  font-size: 14px;
}

.checkbox-box {
  width: 14px;
  height: 14px;
  border: 1px solid #000;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.tick {
  font-size: 14px;
  font-weight: bold;
  line-height: 14px;
  position: absolute;
  top: -1px;
}
.name-col {
  flex: 2.2;   
}

.pan-col {
  flex: 1;      
}

.dob-col {
  flex: 0.8;    
}

.info-item {
  min-height: 70px;   
}

          </style>
        </head>
        <body onload="window.print();window.close()">${printContents}</body>
      </html>
    `);
    popupWin.document.close();
  }
downloadPdf(): void {
  const element = document.getElementById('temp-box');

  html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff'
  }).then(canvas => {

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "p",
      unit: "px",
    format: [1240, 1754]
    });

    pdf.addImage(
      imgData,
      "PNG",
      0,
      0,
      794,
      (canvas.height * 794) / canvas.width 
    );

    pdf.save("Form15H.pdf");
  });
}



  closeWindow(): void {
    window.close();
  }
}



