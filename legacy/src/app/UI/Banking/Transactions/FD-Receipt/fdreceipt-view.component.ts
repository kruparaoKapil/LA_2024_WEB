import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/Services/common.service';
import { State, GroupDescriptor, DataResult, process } from '@progress/kendo-data-query';
import { FdReceiptService } from 'src/app/Services/Banking/Transactions/fd-receipt.service';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { FdTranscationDetailsComponent } from '../FD-AC-Creation/fd-transcation-details.component';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { JournalVoucherService } from 'src/app/Services/Accounting/journal-voucher.service';
declare let $: any
@Component({
  selector: 'app-fdreceipt-view',
  templateUrl: './fdreceipt-view.component.html',
  styles: []
})
export class FdreceiptViewComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  @ViewChild(FdTranscationDetailsComponent, { static: true }) fdTranscationDetailsComponent: FdTranscationDetailsComponent;
  FdReceiptViewForm: FormGroup
  FDReceiptDetailsList: any;
  GridList: any;
  InputFdAccountNo: any;
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dppConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public isLoading = false;
  public ShowDates: boolean = false;
  public ShowSearch: boolean = true;
  savebutton = "Show"
  constructor(private fb: FormBuilder,private _commonservice:CommonService, private _FdReceiptService: FdReceiptService, private datepipe: DatePipe, private _JvReportService:JournalVoucherService) {
    this.dpConfig.containerClass = 'theme-dark-blue';
    this.dpConfig.showWeekNumbers = false;
    this.dpConfig.maxDate = new Date();
    this.dpConfig.dateInputFormat = 'DD/MM/YYYY';


    this.dppConfig.containerClass = 'theme-dark-blue';
    this.dppConfig.showWeekNumbers = false;
    this.dppConfig.maxDate = new Date();
    this.dppConfig.dateInputFormat = 'DD/MM/YYYY'

    this.allData = this.allData.bind(this);

  }

  ngOnInit() {
    debugger;
    this.FdReceiptViewForm = this.fb.group
      ({
        pFromDate: [new Date()],
        pTodate: [new Date()],
       
      })
    this.BindData();
  }

  BindData() {
    this.isLoading = false;
    this.savebutton = 'Show';
    let gridEffectfromdate = this.datepipe.transform(this.FdReceiptViewForm.controls.pFromDate.value, "dd-MM-yyyy");
    let gridEffectToDate = this.datepipe.transform(this.FdReceiptViewForm.controls.pTodate.value, "dd-MM-yyyy");;
    // gridEffectfromdate = this._commonservice.formatDateFromDDMMYYYY(gridEffectfromdate);
    // gridEffectToDate = this._commonservice.formatDateFromDDMMYYYY(gridEffectToDate);
     if(this._commonservice.formatDateFromDDMMYYYY(gridEffectfromdate) > this._commonservice.formatDateFromDDMMYYYY(gridEffectToDate)){
        this._commonservice.showWarningMessage('To Date must be greater than or equal to From Date');
        return;
     }
    let Fromdate = this.datepipe.transform(this.FdReceiptViewForm.controls.pFromDate.value, "yyyy-MM-dd");
    let Todate = this.datepipe.transform(this.FdReceiptViewForm.controls.pTodate.value, "yyyy-MM-dd");;
    this._FdReceiptService.GetFDReceiptDetails(Fromdate, Todate).subscribe(res => {
      debugger;
      this.isLoading = false;
      this.savebutton = 'Show';
      this.FDReceiptDetailsList = res;
      this.GridList = this.FDReceiptDetailsList;

    });
  }
  checkingfrommdate() {
    this.dppConfig.minDate = this.FdReceiptViewForm.controls.pFromDate.value
   // this.FdReceiptViewForm.controls.pFromDate.value
  }
  checkdatevalidation() {
    this.dpConfig.maxDate = this.FdReceiptViewForm.controls.pTodate.value
  }
  checkox(event) {
    if (event.target.checked) {
      this.ShowDates = true;
      this.ShowSearch = false;
    }
    else {
      this.ShowDates = false;
      this.ShowSearch = true;
      this.FdReceiptViewForm.controls.pFromDate.setValue(new Date());
      this.FdReceiptViewForm.controls.pTodate.setValue(new Date());
      this.BindData();
    }
  }
  getReceipt(DataItem) {
    debugger
    // console.log(event)
    let receiptNo = DataItem.pReceiptno;
    if(receiptNo.startsWith('JV')){
      window.open('/#/JournalvoucherReport?id=' + btoa(DataItem.pReceiptno + ',' + 'Journal Voucher'));
    }
    else{
    window.open('/#/GeneralReceiptReports?id=' + btoa(DataItem.pReceiptno + ',' + 'General Receipt'));
    }
  }
  GetAccountDetails(DataItem) {
    debugger;
    this.InputFdAccountNo = DataItem.pFdaccountno;
    //this.fdTranscationDetailsComponent.InputFdAccountNo = this.InputFdAccountNo;
    this.fdTranscationDetailsComponent.BindData(this.InputFdAccountNo,DataItem.pFdaccountID);
    $('#add-detail').modal('show');
  }
  public SearchRecord(inputValue: string): void {
    this.FDReceiptDetailsList = process(this.GridList, {
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

  public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.FDReceiptDetailsList, {
       
        // sort: [{ field: "pLienrealsedate", dir: "desc" }],
      }).data,
   
    };

    return result;
  }

}
