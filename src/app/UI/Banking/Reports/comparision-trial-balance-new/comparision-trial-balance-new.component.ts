import { Component, OnInit, ViewChild } from '@angular/core';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { ToastrService } from 'ngx-toastr';
import { ReportService } from 'src/app/Services/Accounting/report.service';
import { match } from 'minimatch';
import { isNullOrUndefined } from 'util';
import { DomSanitizer } from '@angular/platform-browser';
import { GroupDescriptor, DataResult, process } from '@progress/kendo-data-query';
import { AccountingTransactionsService } from 'src/app/Services/Accounting/accounting-transactions.service';
@Component({
  selector: 'app-comparision-trial-balance-new',
  templateUrl: './comparision-trial-balance-new.component.html',
  styles: []
})
export class ComparisionTrialBalanceNewComponent implements OnInit {
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();

  ComparisionTBForm: FormGroup;
   savebutton: string = "Show";
  disablesavebutton = false;
  pdfSource: any = '';
  window_open: any = '';
  branchId: any;

  constructor(
   private _accountingreportservice: AccountingTransactionsService,private _commonService: CommonService,private formbuilder: FormBuilder, private _commonservice: CommonService,
 public sanitizer: DomSanitizer
  ) {

    this.dpConfig.containerClass = 'theme-dark-blue';
    this.dpConfig.dateInputFormat = 'DD-MM-YYYY';
    this.dpConfig.maxDate = new Date();
    this.dpConfig.showWeekNumbers = false;

    this.dpConfig1 = { ...this.dpConfig };
  }

  ngOnInit(): void {

    this.ComparisionTBForm = this.formbuilder.group({
      fromdate: [new Date(), Validators.required],
      todate: [new Date(), Validators.required]
    });

    const branch = JSON.parse(sessionStorage.getItem("SetBranch"));
    this.branchId = branch.pbranch_id;
  }

  // show() {
  //   debugger;
  //   try {
  //     this.disablesavebutton = true;
  //     this.window_open = '';

  //     let fromdate = this._commonService.getFormatDateNormal(
  //       this.ComparisionTBForm.controls.fromdate.value
  //     );

  //     let todate = this._commonService.getFormatDateNormal(
  //       this.ComparisionTBForm.controls.todate.value
  //     );

  //     this._accountingreportservice
  //       .Updatecomparisionid(fromdate, todate, this.branchId, "LA_CO")
  //       .subscribe((res) => {

  //         let file: any = new Blob([res], { type: 'application/json' });
  //         let content: any = '';

  //         file.text().then(value => {
  //           content = value;

  //           if (content !== 'Trial Balance Amounts Not Tallied....'
  //             && content !== 'No Records....') {

  //             this.window_open = res;
  //             const url = window.URL.createObjectURL(res);
  //             this.pdfSource = this.sanitizer
  //               .bypassSecurityTrustResourceUrl(url + '#toolbar=0&view=FitH');
  //           }
  //           else {
  //             this._commonService.showWarningMessage(content);
  //           }

  //           this.disablesavebutton = false;
  //         })
  //         .catch(error => {
  //           this._commonService.showErrorMessage(error);
  //           this.disablesavebutton = false;
  //         });

  //       }, (error) => {
  //         this._commonService.showErrorMessage(error);
  //         this.disablesavebutton = false;
  //       });
  //   }
  //   catch (e) {
  //     this._commonService.showErrorMessage(e);
  //     this.disablesavebutton = false;
  //   }
  // }


 show() {
  debugger
  try {
    this.savebutton = 'Processing';
    // this.disablesavebutton = true;
    this.window_open = '';

    let fromdate = this._commonService.getFormatDateNormal(this.ComparisionTBForm.controls.fromdate.value );
    let todate = this._commonService.getFormatDateNormal(  this.ComparisionTBForm.controls.todate.value  );
    let ConnInfo = '';

    this._accountingreportservice.Updatecomparisionid(fromdate, todate, this.branchId, "LA_CO").subscribe((res) => {
        console.log(res);
        let blob = res as Blob;
        let file: any = new Blob([blob], { type: 'application/json' });
        let content: any = '';
        file.text().then(value => {
          content = value;
          console.log(content);

     if (content != 'Trial Balance Amounts Not Tallied....' && content != 'No Records....') {
            this.window_open = blob;
            let url = window.URL.createObjectURL(blob);
            this.pdfSource = this.sanitizer .bypassSecurityTrustResourceUrl(url + '#toolbar=0&view=FitH');
            this.savebutton = 'Show';
            this.disablesavebutton = false;
          }
          else {
            this._commonservice.showWarningMessage(content);
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
    let blobUrl = window.URL.createObjectURL(this.window_open);
    let iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = blobUrl;
    document.body.appendChild(iframe);
    iframe.contentWindow.print();
  }

  pdf() {
    let url = window.URL.createObjectURL(this.window_open);
    window.open(
      url + "#toolbar=1&view=FitH", "", "resizable=yes, scrollbars=yes, width=1024, height=900"
    );
  }

}
