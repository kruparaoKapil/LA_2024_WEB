import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../../../Services/common.service';
import { SavingtranscationService } from 'src/app/Services/Banking/savingtranscation.service';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { DatePipe } from '@angular/common';
import { State, GroupDescriptor, DataResult, process } from '@progress/kendo-data-query';
@Component({
  selector: 'app-sa-withdrawal-view',
  templateUrl: './sa-withdrawal-view.component.html',
  styleUrls: []
})
export class SaWithdrawalViewComponent implements OnInit {
public SAWithdrawaldata:any=[];
public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
public dppConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
public isLoading = false;
public ShowDates: boolean = false;
public ShowSearch: boolean = true;
SAWithdrawalViewForm: FormGroup
GridList:any=[];
savebutton = "Show"
  constructor(private fb: FormBuilder,private _commonService: CommonService, private savingtranscationservice: SavingtranscationService,private datepipe: DatePipe) {
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
    this.SAWithdrawalViewForm = this.fb.group
      ({
        pFromDate: [new Date()],
        pTodate: [new Date()],
       
      })
    this.SAWithdrawaldata=[];

    this.getSAWithdrawal();
  }
  getSAWithdrawal(){
    debugger
    let Fromdate = this.datepipe.transform(this.SAWithdrawalViewForm.controls.pFromDate.value, "yyyy-MM-dd");
    let Todate = this.datepipe.transform(this.SAWithdrawalViewForm.controls.pTodate.value, "yyyy-MM-dd");
    this.savingtranscationservice.GetSavingAccountWithDrawalsDetails(Fromdate,Todate).subscribe(json => {
      debugger;
        if (json != null) {
          this.SAWithdrawaldata = json
          this.GridList=this.SAWithdrawaldata;
        }
      },
        (error) => {
  
          this._commonService.showErrorMessage(error);
        });
  }
  checkingfrommdate() {
    this.dppConfig.minDate = this.SAWithdrawalViewForm.controls.pFromDate.value
  }
  checkdatevalidation() {
    this.dpConfig.maxDate = this.SAWithdrawalViewForm.controls.pTodate.value
  }
  checkox(event) {
    if (event.target.checked) {
      this.ShowDates = true;
      this.ShowSearch = false;
    }
    else {
      this.ShowDates = false;
      this.ShowSearch = true;
      this.SAWithdrawalViewForm.controls.pFromDate.setValue(new Date());
      this.SAWithdrawalViewForm.controls.pTodate.setValue(new Date());
      this.getSAWithdrawal();
    }
  }
  public SearchRecord(inputValue: string): void {
    this.SAWithdrawaldata = process(this.GridList, {
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
