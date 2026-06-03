import { Component, OnInit,ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { DatePipe } from '@angular/common';
import { CommonService } from 'src/app/Services/common.service';
import { State, GroupDescriptor, DataResult, process } from '@progress/kendo-data-query';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { RdReceiptService } from 'src/app/Services/Banking/Transactions/rd-receipt.service';

declare let $: any
@Component({
  selector: 'app-rdreceipt-view',
  templateUrl: './rdreceipt-view.component.html',
  styleUrls: []
})
export class RdreceiptViewComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  SavingReceiptForm: FormGroup
   ReceiptDetailsList: any;
  GridList: any;
  InputFdAccountNo: any;
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dppConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public isLoading = false;
  public ShowDates: boolean = false;
  public ShowSearch: boolean = true;
  savebutton = "Show"
  constructor(private fb: FormBuilder,private _commonservice:CommonService, private _RdReceiptService:RdReceiptService, private datepipe: DatePipe) {
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
    this.SavingReceiptForm = this.fb.group
      ({
        pFromDate: [new Date()],
        pTodate: [new Date()],
       
      })
    this.BindData();
  }

  BindData() {
    debugger;
    this.isLoading = false;
    this.savebutton = 'Show';
    let gridEffectfromdate = this.datepipe.transform(this.SavingReceiptForm.controls.pFromDate.value, "dd-MM-yyyy");
    let gridEffectToDate = this.datepipe.transform(this.SavingReceiptForm.controls.pTodate.value, "dd-MM-yyyy");
     if( this._commonservice.formatDateFromDDMMYYYY(gridEffectfromdate) > this._commonservice.formatDateFromDDMMYYYY(gridEffectToDate)){
        this._commonservice.showWarningMessage('To Date must be greater than or equal to From Date');
        return;
     }
    let Fromdate = this.datepipe.transform(this.SavingReceiptForm.controls.pFromDate.value, "yyyy-MM-dd");
    let Todate = this.datepipe.transform(this.SavingReceiptForm.controls.pTodate.value, "yyyy-MM-dd");;
    this._RdReceiptService.GetRDReceiptDetails(Fromdate, Todate).subscribe(res => {
      debugger;
      this.isLoading = false;
      this.savebutton = 'Show';
      this.ReceiptDetailsList = res;
      this.GridList = this.ReceiptDetailsList;

    });
  }
  getReceipt(DataItem) {
    console.log(event)
    debugger;
    window.open('/#/GeneralReceiptReports?id=' + btoa(DataItem.pReceiptno + ',' + 'Receipt Voucher'));
  }
  checkingfrommdate() {
    this.dppConfig.minDate = this.SavingReceiptForm.controls.pFromDate.value
  }
  checkdatevalidation() {
    this.dpConfig.maxDate = this.SavingReceiptForm.controls.pTodate.value
  }
  checkox(event) {
    if (event.target.checked) {
      this.ShowDates = true;
      this.ShowSearch = false;
    }
    else {
      this.ShowDates = false;
      this.ShowSearch = true;
      this.SavingReceiptForm.controls.pFromDate.setValue(new Date());
      this.SavingReceiptForm.controls.pTodate.setValue(new Date());
      this.BindData();
    }
  }
  public SearchRecord(inputValue: string): void {
    this. ReceiptDetailsList = process(this.GridList, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'pMembername',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pMembercode',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'ptotalpaidamount',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pFdaccountno',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pReceiptdate',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pDueamount',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pReceivedAmount',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pModeOfReceipt',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pReceiptno',
            operator: 'contains',
            value: inputValue
          }
        ],
      }
    }).data;

    this.dataBinding.skip = 0;
  }
}
