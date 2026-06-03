import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../../../Services/common.service';
import { SAReceiptService } from 'src/app/Services/Banking/Transactions/sa-receipt.service';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { DatePipe } from '@angular/common';
import { ShareapplicationService } from 'src/app/Services/Banking/shareapplication.service';
import { State, GroupDescriptor, DataResult, process } from '@progress/kendo-data-query';
@Component({
  selector: 'app-share-withdrawal-view',
  templateUrl: './share-withdrawal-view.component.html',
  styleUrls: []
})
export class ShareWithdrawalViewComponent implements OnInit {
  public ShareWithdrawaldata:any=[];
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dppConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public isLoading = false;
  public ShowDates: boolean = false;
  public ShowSearch: boolean = true;
  ShareWithdrawalViewForm: FormGroup
  GridList:any=[];
  savebutton = "Show"
  constructor(private fb: FormBuilder,private _commonService: CommonService,private _SaReceiptService: SAReceiptService,private datepipe: DatePipe, private _ShareapplicationService: ShareapplicationService) {
    this.dpConfig.containerClass = 'theme-dark-blue';
    this.dpConfig.showWeekNumbers = false;
    this.dpConfig.maxDate = new Date();
    this.dpConfig.dateInputFormat = 'DD/MM/YYYY'
    this.dppConfig.containerClass = 'theme-dark-blue';
    this.dppConfig.showWeekNumbers = false;
    this.dppConfig.maxDate = new Date();
    this.dppConfig.dateInputFormat = 'DD/MM/YYYY';
   }

  ngOnInit() {
    debugger
    this.ShareWithdrawalViewForm = this.fb.group
    ({
      pFromDate: [new Date()],
      pTodate: [new Date()],
     
    })
  this.ShareWithdrawaldata=[];

  this.getShareWithdrawaldata();
  }
  getShareWithdrawaldata(){
    debugger
    let Fromdate = this.datepipe.transform(this.ShareWithdrawalViewForm.controls.pFromDate.value, "yyyy-MM-dd");
    let Todate = this.datepipe.transform(this.ShareWithdrawalViewForm.controls.pTodate.value, "yyyy-MM-dd");
    this._ShareapplicationService.GetShareAccountWithDrawalsDetails(Fromdate,Todate).subscribe(json => {
      debugger;
        if (json != null) {
          this.ShareWithdrawaldata = json;
          this.GridList= this.ShareWithdrawaldata;
          
        }
      },
        (error) => {
  
          this._commonService.showErrorMessage(error);
        });
  }
  checkingfrommdate() {
    this.dppConfig.minDate = this.ShareWithdrawalViewForm.controls.pFromDate.value
  }
  checkdatevalidation() {
    this.dpConfig.maxDate = this.ShareWithdrawalViewForm.controls.pTodate.value
  }
  checkox(event) {
    if (event.target.checked) {
      this.ShowDates = true;
      this.ShowSearch = false;
    }
    else {
      this.ShowDates = false;
      this.ShowSearch = true;
      this.ShareWithdrawalViewForm.controls.pFromDate.setValue(new Date());
      this.ShareWithdrawalViewForm.controls.pTodate.setValue(new Date());
      this.getShareWithdrawaldata();
    }
  }
  public SearchRecord(inputValue: string): void {
    this.ShareWithdrawaldata = process(this.GridList, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'pvoucherno',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pMembername',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'paccountno',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pPaymentdate',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'ppaidamount',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pModeOfpayment',
            operator: 'contains',
            value: inputValue
          }
        ],
      }
    }).data;


  }
}
