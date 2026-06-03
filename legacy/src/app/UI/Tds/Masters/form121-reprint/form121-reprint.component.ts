import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/Services/common.service';
import { VerificationService } from 'src/app/Services/Loans/Transactions/verification.service';
//import { VerificationService } from 'src/app/Services/BPO/verification.service';
import { DatePipe } from '@angular/common';
import { NumberToWordsPipe } from 'src/app/Pipes/number-to-words.pipe';
import html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';

@Component({
  selector: 'app-form121-reprint',
  templateUrl: './form121-reprint.component.html',
  styleUrls: ['./form121-reprint.component.css'],
  providers: [NumberToWordsPipe]
})
export class Form121ReprintComponent implements OnInit {
 //@ViewChild('pdf') pdf;
  @Output() printedDate: any;

  form121Group: FormGroup;
  formData: any =[];
  loading = false;
  errorMessage = '';
  identificationno = '';
  localschema = '';
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
  cancelled: boolean = false;
  previoustaxstatus:boolean
  previous_two_years_status:boolean
     printedon: any;
  companyAddress: string;
   itrDetailsList:any=[]
uid: any;
  constructor( private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _VerificationService: VerificationService,
    private _commonService: CommonService,
    private datePipe: DatePipe,
    private numberToWords: NumberToWordsPipe
  ) {
    this.printedon = this._commonService.pdfProperties("Date");
    this.form121Group = this.fb.group({
      uid: ['']
    });
  }

  ngOnInit() {
    this.todayDate = this._commonService.getFormatDateGlobal(this.today);
    
    this.handleRouteParams();
  }
private handleRouteParams(): void {
  debugger;
  this.activatedRoute.queryParams.subscribe(params => {
    const encoded1 = params['id'];
    if (!encoded1) {
      this._commonService.showErrorMessage('Missing Form 121 parameters.');
      return;
    }

    try {
       const decoded = atob(encoded1.replace(/\s/g, '+'));
      //const decoded = atob(encoded1);
       const splitData = decoded.split(',');
     // const result = decoded.split('@');
       //console.log(result);
       //this.uid = result[0] || '';
       //this.reportType = result[2];
      this.uid = splitData[0] || '';
     // this.localschema = splitData[3] || '';
      this.form121Group.patchValue({
        uid: this.uid
      });

      if (this.uid ) {
        this.getForm121Details(this.uid);
      } else {
        this._commonService.showWarningMessage('Invalid or incomplete Form 15H parameters.');
      }

       this.printFileName = `Form121_${this.uid}`;

    } catch (e) {
      console.error('Error decoding Form 121 reprint params:', e);
      this._commonService.showErrorMessage('Invalid or corrupted Form 121 parameters.');
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
 getForm121Details(uid) {
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
          this.previoustaxstatus= this.formData.previoustaxstatus;
          this.previous_two_years_status= this.formData.previous_two_years_status;
          this.itrDetailsList = this.formData.previousitrdetails;
          this.cancelled = this.formData.cancelled === 1;
          console.log(' Form 121 Data:', this.formData);
        } else {
          this._commonService.showWarningMessage('No Form 121 data found for this Pan No.');
        }
      },
      error: (err) => {
        console.error(' Error fetching Form 121 report:', err);
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
          <title>Form 121</title>
          <link rel="stylesheet" type="text/css" href="assets/css/bootstrap.min.css"/>
          <link rel="stylesheet" type="text/css" href="assets/css/custom.css" />
         <style>
@page {
    size: A4;
    margin: 10mm; /* Margin for printing */
    border: 2px solid #000;
}

body, html {
    margin: 0;
    padding: 0;
    font-size:16px;
    font-family: Arial, sans-serif;
}

.form15h-container {
    width: 100%;
}

.page {
    width: 100%;
    height:297mm;    
    padding:10mm 5mm;      
    box-sizing: border-box;
    page-break-after: always;
}

.page:last-child {
    page-break-after: auto;
}

.print-content {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
}
.print-table {
    border-collapse: collapse !important;
    margin-bottom:15px;
}

    .print-table tr, .print-table td {
        color:#000 !important;
        font-size: 14px !important;
        padding: 0.25rem !important;
        border: 1px solid #000 !important;
      }
      ul, ol {
        padding-inline-start: 18px;
      }
      ul li{
      list-style: decimal !important;
       padding-inline-start: 15px;
      font-size: 16px !important;
      line-height:30px !important; 
    }
     ul.lower-alpha li{
      list-style: lower-alpha !important;
    }
/* === Print media adjustments === */
@media print {
    body, html {
        margin: 0;
        padding: 0;
    }

    .page {
        page-break-after: always;
    }

    .no-print {
        display: none !important;
    }

    * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
    }
}

/* === Headers and subheaders === */
.header h6,
.header .part-title {
    font-weight: bold;
    font-size: 20px;
    text-align: center;
    margin: 0 0 2mm 0;
    padding-bottom: 2px;
}

.sub-header {
    font-size: 16px;
    text-align: center;
    margin: 2px 0 5px 0;
}

/* === Section Titles === */
.section-title {
    font-weight: bold;
    font-size: 16px;
    margin: 4px 0 2px 0;
    border-bottom: 1px solid #000;
    padding-bottom: 2px;
}

/* === Labels & Values === */
.label {
    font-weight: 600;
    font-size: 16px;
    display: block;
    margin-bottom: 1px;
}

.value {
    display: block;
    font-size: 16px;
}

.declaration, .declarationpart2-content, .signature-section {
    line-height: 1.6;
    font-size: 16px;
    text-align: justify;
    margin-bottom: 5mm;
    padding: 0 2mm;
}

.signature-row {
    display: flex;
}

.signature-left, .signature-right {
    width: 48%;
}

/* === Underline fields === */
.underline-value {
    display: inline-block;
    min-width: 100px;
    border-bottom: 1px dotted #000;
    text-align: center;
    font-weight: 600;
    font-size: 12px;
    padding:0px 5px;
}

.underline-long {
    display: inline-block;
    width: 250px;
    border-bottom: 1px solid #000;
    text-align: center;
    font-weight: 600;
    font-size: 16px;
}

/* === Checkbox styling === */
.checkbox-row {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 16px;
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
    position: absolute;
    top: -1px;
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

    pdf.save("Form121.pdf");
  });
}



  closeWindow(): void {
    window.close();
  }
}
