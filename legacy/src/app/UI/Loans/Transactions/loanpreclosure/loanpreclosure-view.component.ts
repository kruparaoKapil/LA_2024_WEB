import { Component, OnInit, ViewChild } from '@angular/core';
import { LoanreceiptService } from 'src/app/Services/Loans/Transactions/loanreceipt.service';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { State, GroupDescriptor, DataResult, process } from '@progress/kendo-data-query';
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';

@Component({
  selector: 'app-loanpreclosure-view',
  templateUrl: './loanpreclosure-view.component.html',
  styles: []
})
export class LoanpreclosureViewComponent implements OnInit {
  loanReceiptData = [];
  PreclosureForm:FormGroup;
  gridView = [];
  loangrid: any = [];
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dppConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public isLoading = false;
  public ShowDates: boolean = false;
  public ShowSearch: boolean = true;
  savebutton = "Show";
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
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
     this.PreclosureForm = this.fb.group
      ({
        pFromDate: [new Date()],
        pTodate: [new Date()],
       
      })
    this.getLoanPreclosureViewData();
  }
 checkox(event) {
    debugger;
    if (event.target.checked) {
        this.PreclosureForm.controls.pFromDate.setValue(new Date());
      this.PreclosureForm.controls.pTodate.setValue(new Date());
      this.ShowDates = true;
      this.ShowSearch = false;
    }
    else {
      this.ShowDates = false;
      this.ShowSearch = true;
      this.PreclosureForm.controls.pFromDate.setValue(new Date());
      this.PreclosureForm.controls.pTodate.setValue(new Date());
      this.getLoanPreclosureViewData();
    }
  }
  getLoanPreclosureViewData() {
    //  let date = this.datePipe.transform(new Date(), 'MM/dd/yyyy').toString();

    
    let gridEffectfromdate = this.datePipe.transform(this.PreclosureForm.controls.pFromDate.value, "dd-MM-yyyy");
    let gridEffectToDate = this.datePipe.transform(this.PreclosureForm.controls.pTodate.value, "dd-MM-yyyy");
     if( this._commonservice.formatDateFromDDMMYYYY(gridEffectfromdate) > this._commonservice.formatDateFromDDMMYYYY(gridEffectToDate)){
        this._commonservice.showWarningMessage('To Date must be greater than or equal to From Date');
        return;
     }
    this._loaanreceiptServie.getReceiptViewData(gridEffectfromdate, gridEffectToDate, 'PRECLOSURE').subscribe((data: any) => {
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
    this.dppConfig.minDate = this.PreclosureForm.controls.pFromDate.value
  }
  checkdatevalidation() {
    this.dpConfig.maxDate = this.PreclosureForm.controls.pTodate.value
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
