import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DomSanitizer } from '@angular/platform-browser';
import { AccountingTransactionsService } from 'src/app/Services/Accounting/accounting-transactions.service';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ReportService } from 'src/app/Services/Accounting/report.service';
import { match } from 'minimatch';
import { isNullOrUndefined } from 'util';

declare let $: any;
@Component({
  selector: 'app-profit-and-loss-new',
  templateUrl: './profit-and-loss-new.component.html',
  styles: []
})
export class ProfitAndLossNewComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public submitted = false;
  scheduleTBandProfitAndLossForm: FormGroup;
  public today: Date = new Date();
  public startDate: any = new Date();
  public endDate: any = new Date();
  ShowAsOn = false;
  ShowBetween = true;
  asondate: any;
  from: any;
  to: any;
  validate: any;
  endDatesReport: any;
  startDatesReport: any;
  TotalAmount = 0;
  hide = true;
  gridData: any = [];
  profitandlossdata = [];
  grouptype = "BETWEEN";
  FromDate = "Date";
  fontcolor: any;
  public loading = false;
  public isLoading = false;
  Type: any;
  STBflag: boolean;
  pALflag: boolean;
  pdfSource: any = '';
  window_open: any = '';
  disablesavebutton: boolean = false;
  Branchname: any;
  branchId: any;
  public sanitizer: DomSanitizer
  savebutton: string;
  disabletransactiondate = false
  constructor(private datePipe: DatePipe, private _routes: Router, private formbuilder: FormBuilder, private _reportservice: ReportService, private _CommonService: CommonService, private toastr: ToastrService, private _accountingreportservice: AccountingTransactionsService) {
    this.dpConfig.containerClass = 'theme-dark-blue';
    this.dpConfig.dateInputFormat = 'DD-MM-YYYY';
    this.dpConfig.maxDate = new Date();
    this.dpConfig.showWeekNumbers = false;
    this.dpConfig1.containerClass = 'theme-dark-blue';
    this.dpConfig1.dateInputFormat = 'DD-MM-YYYY';
    this.dpConfig1.maxDate = new Date();
    this.dpConfig1.showWeekNumbers = false;
  }

  ngOnInit() {
    this.submitted = true;
    
    this.scheduleTBandProfitAndLossForm = this.formbuilder.group({
      fromDate: [this.today, Validators.required],
      toDate: [this.today, Validators.required]
    })
    this.submitted = false;
    this.hide = false;
    this.grouptype = "ASON";
    this.ShowAsOn = true;
    this.ShowBetween = false;
    this.scheduleTBandProfitAndLossForm.controls.fromDate.setValue(new Date());
    this.scheduleTBandProfitAndLossForm.controls.toDate.setValue(new Date());
    this.asondate = this.datePipe.transform(new Date(), "dd-MMM-yyyy");
    this.Branchname = JSON.parse(sessionStorage.getItem("SetBranch"));
    this.branchId = this.Branchname.pbranch_id;
    this.scheduleTBClick();
  }

  checkboxChecked(event) {
    
    if (event.target.checked == true) {
      this.hide = false;
      this.grouptype = "ASON";
      this.scheduleTBandProfitAndLossForm.controls.fromDate.setValue(new Date());
      this.scheduleTBandProfitAndLossForm.controls.toDate.setValue(new Date());
      this.FromDate = "Date";
    }
    else {
      this.hide = true;
      this.grouptype = "BETWEEN";
      this.scheduleTBandProfitAndLossForm.controls.fromDate.setValue(new Date());
      this.scheduleTBandProfitAndLossForm.controls.toDate.setValue(new Date());
      this.FromDate = "From Date";
    }

  }

  

  scheduleTBClick(){
    debugger;
    this.Type = 'STB';
    this.STBflag = true;
    this.pALflag = false;
    this.isLoading = false;
  }

  profitAndLossClick(){
    debugger;
    this.Type = 'PAL';
    this.STBflag = false;
    this.pALflag = true;
    this.isLoading = false;
  }

  GetScheduleReports(){
    debugger;
    try {
      this.isLoading = true;
      this.disablesavebutton = true;
      this.window_open = '';
      let asondate = this._CommonService.getFormatDateNormal(this.scheduleTBandProfitAndLossForm.controls.toDate.value);
      let ConnInfo = '';
      this._accountingreportservice.UpdateScheduleid(asondate, "LA_CO",this.branchId).subscribe((res) => {
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
            this.isLoading = false;
            this.disablesavebutton = false;
          }
          else {
            this._CommonService.showWarningMessage(content)
            this.savebutton = 'Show';
            this.disablesavebutton = false;
          }
        })
          .catch(error => {
            this._CommonService.showErrorMessage(error);
            this.savebutton = 'Show';
            this.disablesavebutton = false;
          });
      }, (error) => {
        this._CommonService.showErrorMessage(error);
        this.savebutton = 'Show';
        this.disablesavebutton = false;
      });
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
      this.savebutton = 'Show';
      this.disablesavebutton = false;
    }
    this._CommonService.showInfoMessage('SCHEDULE TB...');
  }

  GetProfitandlossReports(){
    debugger;
    this.isLoading = true;
    this._CommonService.showInfoMessage('PROFIT AD LOSS.');
    //this.isLoading = false;

  }


  Print_Crystal_Report() {

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
    let url = window.URL.createObjectURL(this.window_open);
    window.open( url + "#toolbar=1&view=FitH", "","resizable=yes, scrollbars=yes, titlebar=yes, #toolbar=0, width=1024, height=900, top=10, left=10 "
     ); 
    /* --------End----------- */

    // const file = new window.Blob([this.window_open], { type: "contentType" });
    // const downloadAncher = document.createElement("a");
    // downloadAncher.style.display = "none";
    // const fileURL = URL.createObjectURL(file);
    // downloadAncher.href = fileURL;
    // downloadAncher.download = __filename;
    // downloadAncher.click();

  }
  
 
}
