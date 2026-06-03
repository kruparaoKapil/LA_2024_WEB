import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { CommonService } from 'src/app/Services/common.service';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { EmployeeDetailsComponent } from 'src/app/UI/Common/employee-details/employee-details.component';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs-compat/operator/filter';
import { saveAs } from '@progress/kendo-file-saver';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { DomSanitizer } from '@angular/platform-browser';
import { AccountingTransactionsService } from 'src/app/Services/Accounting/accounting-transactions.service';

declare let $: any;

@Component({
  selector: 'app-schedule-trail-balance-report',
  templateUrl: './schedule-trail-balance-report.component.html',
  styles: []
})

export class ScheduleTrailBalanceReportComponent implements OnInit {

  public dpConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpConfig2: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  asonDate: boolean = true;
  DocumentsForm: FormGroup;
  savebutton: string = "Show";
  branchschema: any;
  disabletransactiondate = false;
  pdfSource: any = '';
  window_open: any = '';
  disablesavebutton: boolean = false;
  Branchname: any;
  branchId: any;
  Type: any;
  STBflag: boolean;
  isLoading: boolean;
  pALflag: boolean;
  STBLflag: boolean;
  hide = true;
  FromDate = "Date";
  grouptype = "BETWEEN";
    userDetails: any;
  userNameF: any;

  constructor(private _accountingreportservice: AccountingTransactionsService,   
    private _commonService: CommonService,
    private formbuilder: FormBuilder,
    private _commonservice: CommonService,
    public sanitizer: DomSanitizer
  ) {

    this.dpConfig.containerClass = 'theme-dark-blue';
    this.dpConfig.dateInputFormat = 'DD-MM-YYYY';
    this.dpConfig.maxDate = new Date();
    this.dpConfig.showWeekNumbers = false;


  }


  ngOnInit(): void {
    debugger;
    this.userDetails = JSON.parse(sessionStorage.getItem("Urc"));
     this.userNameF = this.userDetails.pUserName;
    if (this._commonService.comapnydetails != null)
      if (this._commonService.comapnydetails.pdatepickerenablestatus || this._commonService.comapnydetails.pfinclosingjvallowstatus) {
       // this.disabletransactiondate = true
      }
      else {
        //this.disabletransactiondate = false
      }
      this.hide = false;

    this.branchschema = '';
    this.DocumentsForm = this.formbuilder.group({
      fromdate: [new Date(), Validators.required],
      todate: [new Date(), Validators.required],

    });
    debugger

    this.Branchname = JSON.parse(sessionStorage.getItem("SetBranch"));
    this.branchId = this.Branchname.pbranch_id;

    this.scheduleTBClick();
  }

  scheduleTBClick(){
    debugger;
    this.Type = 'STB';
    this.STBflag = true;
    this.pALflag = false;
    this.STBLflag = false;
    this.isLoading = false;
    this.pdfSource = "";
  }

  profitAndLossClick(){
    debugger;
    this.Type = 'PAL';
    this.STBflag = false;
    this.pALflag = true;
    this.STBLflag = false;
    this.isLoading = false;
    this.pdfSource = "";
  }
  stbsubledgerclick(){
    debugger;
    this.Type = 'STBL';
    this.STBflag = false;
    this.STBLflag = true;
    this.pALflag = false;
    this.isLoading = false;
    this.pdfSource = "";
  }

  checkboxChecked(event) {
    
    if (event.target.checked == true) {
      this.hide = false;
      this.grouptype = "ASON";
      this.DocumentsForm.controls.fromdate.setValue(new Date());
      this.DocumentsForm.controls.todate.setValue(new Date());
      this.FromDate = "Date";
    }
    else {
      this.hide = true;
      this.grouptype = "BETWEEN";
      this.DocumentsForm.controls.fromdate.setValue(new Date());
      this.DocumentsForm.controls.todate.setValue(new Date());
      this.FromDate = "From Date";
    }

  }

  checkox(event) {
    if (event.target.checked) {
      this.asonDate = false;
    } else {
      this.asonDate = true;
    }
    // this.LegalForm['controls']['todate'].setValue(new Dat);
  }


  show() {
    debugger
    try {
      this.savebutton = 'Processing';
      this.disablesavebutton = true;
      this.window_open = '';
    let date =  this.DocumentsForm.controls.fromdate.value
      
      let asondate = this._commonService.getFormatDateNormal(date);
      let ConnInfo = '';
      this._accountingreportservice.UpdateScheduleid(asondate,"LA_CO",this.branchId).subscribe((res) => {
        console.log(res)
        let file: any = new Blob([res], { type: 'application/json' });
        let content: any = '';
        file.text().then(value => {
          content = value;
          console.log(content);
          if (content != 'Trial Balance Amounts Not Tallied....' && content != 'No Records....') {
            this.window_open = res;
            const url = window.URL.createObjectURL(res);
            this.pdfSource = this.sanitizer.bypassSecurityTrustResourceUrl(url + '#toolbar=0&view=FitH');
            this.savebutton = 'Show';
            this.disablesavebutton = false;
          }
          else {
            this._commonservice.showWarningMessage(content)
            this.savebutton = 'Show';
            this.disablesavebutton = false;
          }
        })
          .catch(error => {
            this._commonservice.showErrorMessage(error);
            this.savebutton = 'Show';
            this.disablesavebutton = false;
          });
      }, (error) => {
        this._commonservice.showErrorMessage(error);
        this.savebutton = 'Show';
        this.disablesavebutton = false;
      });
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
      this.savebutton = 'Show';
      this.disablesavebutton = false;
    }
  }

    generateSTBL() {
    debugger
    try {
      this.savebutton = 'Processing';
      this.disablesavebutton = true;
      this.window_open = '';
    let date =  this.DocumentsForm.controls.fromdate.value
      
      let asondate = this._commonService.getFormatDateNormal(date);
      let ConnInfo = '';
      this._accountingreportservice.UpdateScheduleledgerid(asondate,"LA_CO",this.branchId).subscribe((res) => {
        console.log(res)
        let file: any = new Blob([res], { type: 'application/json' });
        let content: any = '';
        file.text().then(value => {
          content = value;
          console.log(content);
          if (content != 'Trial Balance Amounts Not Tallied....' && content != 'No Records....') {
            this.window_open = res;
            const url = window.URL.createObjectURL(res);
            this.pdfSource = this.sanitizer.bypassSecurityTrustResourceUrl(url + '#toolbar=0&view=FitH');
            this.savebutton = 'Show';
            this.disablesavebutton = false;
          }
          else {
            this._commonservice.showWarningMessage(content)
            this.savebutton = 'Show';
            this.disablesavebutton = false;
          }
        })
          .catch(error => {
            this._commonservice.showErrorMessage(error);
            this.savebutton = 'Show';
            this.disablesavebutton = false;
          });
      }, (error) => {
        this._commonservice.showErrorMessage(error);
        this.savebutton = 'Show';
        this.disablesavebutton = false;
      });
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
      this.savebutton = 'Show';
      this.disablesavebutton = false;
    }
  }

  generatePAL() {
    debugger
    try {
      this.savebutton = 'Processing';
      this.disablesavebutton = true;
      this.window_open = '';
      let asondate = this._commonService.getFormatDateNormal(this.DocumentsForm.controls.todate.value);
      let ConnInfo = '';
      this._accountingreportservice.getProfitAndLoss(asondate,this.branchId, "LA_CO").subscribe((res) => {
        console.log(res)
        let file: any = new Blob([res], { type: 'application/json' });
        let content: any = '';
        file.text().then(value => {
          content = value;
          console.log(content);
          if (content != 'Trial Balance Amounts Not Tallied....' && content != 'No Records....') {
            this.window_open = res;
            const url = window.URL.createObjectURL(res);
            this.pdfSource = this.sanitizer.bypassSecurityTrustResourceUrl(url + '#toolbar=0&view=FitH');
            this.savebutton = 'Show';
            this.disablesavebutton = false;
          }
          else {
            this._commonservice.showWarningMessage(content)
            this.savebutton = 'Show';
            this.disablesavebutton = false;
          }
        })
          .catch(error => {
            this._commonservice.showErrorMessage(error);
            this.savebutton = 'Show';
            this.disablesavebutton = false;
          });
      }, (error) => {
        this._commonservice.showErrorMessage(error);
        this.savebutton = 'Show';
        this.disablesavebutton = false;
      });
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
      this.savebutton = 'Show';
      this.disablesavebutton = false;
    }
  }

  Print_Crystal_Report() {
    debugger;
    if(this.userNameF != "admin@kapilit.com" && this.userNameF != "coordinator@kapilit.com"){
      this._commonService.showWarningMessage('You dont have rights to print');
      return;
    }

    /* ---- By using iframe ------ */
    const blobUrl = window.URL.createObjectURL((this.window_open));
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = blobUrl;
    document.body.appendChild(iframe);
    iframe.contentWindow.print();
    /* --------End----------- */


    // this.pdfSource = ""
    // this.window_open = ""

    /* By Using window.open */
    // let url = window.URL.createObjectURL(this.window_open);
    // window.open( url + "#toolbar=1&view=FitH", "","resizable=yes, scrollbars=yes, titlebar=yes, #toolbar=0, width=1024, height=900, top=10, left=10 "
    //  ); 
    /* --------End----------- */

    // const file = new window.Blob([this.window_open], { type: "contentType" });
    // const downloadAncher = document.createElement("a");
    // downloadAncher.style.display = "none";
    // const fileURL = URL.createObjectURL(file);
    // downloadAncher.href = fileURL;
    // downloadAncher.download = __filename;
    // downloadAncher.click();

  }

  pdf(){
    debugger;
    if(this.userNameF != "admin@kapilit.com" && this.userNameF != "coordinator@kapilit.com"){
      this._commonService.showWarningMessage('You dont have rights to download');
      return;
    }
    let url = window.URL.createObjectURL(this.window_open);
    window.open( url + "#toolbar=1&view=FitH", "","resizable=yes, scrollbars=yes, titlebar=yes, #toolbar=0, width=1024, height=900, top=10, left=10 "
     );
  }


}
