import { Component,ViewChild, OnInit, NgZone, Pipe, PipeTransform } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { Router } from '@angular/router';
import { SAReceiptService } from 'src/app/Services/Banking/Transactions/sa-receipt.service';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { ToastrService } from 'ngx-toastr';
import { isNullOrUndefined, debug } from 'util';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { DatePipe } from '@angular/common';
import { State, GroupDescriptor, DataResult, process } from '@progress/kendo-data-query';
import { FdReceiptService } from 'src/app/Services/Banking/Transactions/fd-receipt.service';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
declare let $: any


@Component({
  selector: 'app-sa-receipt-view',
  templateUrl: './sa-receipt-view.component.html',
  styles: []
})
export class SavingReceiptViewComponent implements OnInit {

  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  SavingReceiptForm: FormGroup
   SavingReceiptDetailsList: any;
  GridList: any;
  InputFdAccountNo: any;
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dppConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public isLoading = false;
  public ShowDates: boolean = false;
  public ShowSearch: boolean = true;
  savebutton = "Show"
  constructor(private fb: FormBuilder,private _commonservice:CommonService,private _SAReceiptService: SAReceiptService, private datepipe: DatePipe) {
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
    let gridEffectToDate = this.datepipe.transform(this.SavingReceiptForm.controls.pTodate.value, "dd-MM-yyyy");;
     if(this._commonservice.formatDateFromDDMMYYYY(gridEffectfromdate) > this._commonservice.formatDateFromDDMMYYYY(gridEffectToDate)){
        this._commonservice.showWarningMessage('To Date must be greater than or equal to From Date');
        return;
     }

    let Fromdate = this.datepipe.transform(this.SavingReceiptForm.controls.pFromDate.value, "yyyy-MM-dd");
    let Todate = this.datepipe.transform(this.SavingReceiptForm.controls.pTodate.value, "yyyy-MM-dd");;
    this._SAReceiptService.GetSavingReceiptDetails(Fromdate, Todate).subscribe(res => {
      debugger;
      this.isLoading = false;
      this.savebutton = 'Show';
      this.SavingReceiptDetailsList = res;
      this.GridList = this. SavingReceiptDetailsList;

    });
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
    this. SavingReceiptDetailsList = process(this.GridList, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'preceiptno',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'preceiptdate',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pmembername',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'psavingaccountno',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'preceivedamount',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pmodeofreceipt',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pChequeStatus',
            operator: 'contains',
            value: inputValue
          }
        ],
      }
    }).data;

    this.dataBinding.skip = 0;
  }
  getReceipt(DataItem) {
    console.log(event)
    window.open('/#/GeneralReceiptReports?id=' + btoa(DataItem.preceiptno + ',' + 'Receipt Voucher'));
  }

}