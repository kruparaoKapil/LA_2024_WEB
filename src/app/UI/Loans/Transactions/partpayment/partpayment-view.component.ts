import { Component, OnInit,ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoanreceiptService } from 'src/app/Services/Loans/Transactions/loanreceipt.service';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { DatePipe } from '@angular/common';
import { CommonService } from 'src/app/Services/common.service';
import { State, GroupDescriptor, DataResult, process } from '@progress/kendo-data-query';
@Component({
  selector: 'app-partpayment-view',
  templateUrl: './partpayment-view.component.html',
  styleUrls: []
})
export class PartpaymentViewComponent implements OnInit {
  loanReceiptData = [];
  gridView = [];
  loangrid: any = [];
   @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  partPaymentForm: FormGroup
   ReceiptDetailsList: any;
  GridList: any;
  InputFdAccountNo: any;
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dppConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public isLoading = false;
  public ShowDates: boolean = false;
  public ShowSearch: boolean = true;
  savebutton = "Show"
  constructor(private fb: FormBuilder,private _commonservice:CommonService,private _loaanreceiptServie: LoanreceiptService, public datePipe: DatePipe) {
    this.dpConfig.containerClass = 'theme-dark-blue';
    this.dpConfig.showWeekNumbers = false;
    this.dpConfig.maxDate = new Date();
    this.dpConfig.dateInputFormat = 'DD/MM/YYYY'


    this.dppConfig.containerClass = 'theme-dark-blue';
    this.dppConfig.showWeekNumbers = false;
    this.dppConfig.maxDate = new Date();
    this.dppConfig.dateInputFormat = 'DD/MM/YYYY'
  }
   ngOnInit() {
     debugger;
     this.partPaymentForm = this.fb.group
      ({
        pFromDate: [new Date()],
        pTodate: [new Date()],
       
      })
    this.getLoanPreclosureViewData();
  }
  checkox(event) {
    debugger;
    if (event.target.checked) {
      this.partPaymentForm.controls.pFromDate.setValue(new Date());
      this.partPaymentForm.controls.pTodate.setValue(new Date());
      this.ShowDates = true;
      this.ShowSearch = false;
    }
    else {
      this.ShowDates = false;
      this.ShowSearch = true;
      this.partPaymentForm.controls.pFromDate.setValue(new Date());
      this.partPaymentForm.controls.pTodate.setValue(new Date());
      this.getLoanPreclosureViewData();
    }
  }
  getLoanPreclosureViewData() {
    debugger;
    //  let date = this.datePipe.transform(new Date(), 'MM/dd/yyyy').toString();
    let gridEffectfromdate = this.datePipe.transform(this.partPaymentForm.controls.pFromDate.value, "dd-MM-yyyy");
    let gridEffectToDate = this.datePipe.transform(this.partPaymentForm.controls.pTodate.value, "dd-MM-yyyy");
     if( this._commonservice.formatDateFromDDMMYYYY(gridEffectfromdate) > this._commonservice.formatDateFromDDMMYYYY(gridEffectToDate)){
        this._commonservice.showWarningMessage('To Date must be greater than or equal to From Date');
        return;
     }
    let fromdate =this.datePipe.transform(this.partPaymentForm.controls.pFromDate.value, "dd-MMM-yyyy");
    let todate =this.datePipe.transform(this.partPaymentForm.controls.pTodate.value, "dd-MMM-yyyy")
    this._loaanreceiptServie.getReceiptViewData(fromdate,todate, 'PART PAYMENT').subscribe((data: any) => {
      debugger;
      this.loangrid = data;
      this.loanReceiptData = this.loangrid;
      for (let i = 0; i < this.loanReceiptData.length; i++) {
        this.loanReceiptData[i].pReceiptdate = this.loanReceiptData[i].pReceiptdate;
      }

      //console.log(data,"data");

      //console.log(" this.loanReceiptData", this.loanReceiptData);
    })

  }
 checkingfrommdate() {
    this.dppConfig.minDate = this.partPaymentForm.controls.pFromDate.value
  }
  checkdatevalidation() {
    this.dpConfig.maxDate = this.partPaymentForm.controls.pTodate.value
  }
  public removeHandler({ dataItem }) {
    

    let receipt = btoa(dataItem.pReceiptno);
    window.open('/#/GeneralReceiptReports?id=' + receipt);
  }
  public onFilter(inputValue: string): void {
    this.loanReceiptData = process(this.loangrid, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'pReceiptdate',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pReceiptno',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pLoanno',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pCustomername',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pModeofreceipt',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pBankname',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pChequeno',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pTotalreceived',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pNarration',
            operator: 'contains',
            value: inputValue
          }
        ],
      }
    }).data;

    this.dataBinding.skip = 0;
  }

}
