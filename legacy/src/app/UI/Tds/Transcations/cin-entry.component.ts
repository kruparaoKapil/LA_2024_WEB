import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { AccountingTransactionsService } from 'src/app/Services/Accounting/accounting-transactions.service';
import { CommonService } from 'src/app/Services/common.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LienEntryService } from 'src/app/Services/Banking/lien-entry.service';
import { TdsreportService } from 'src/app/Services/Tds/tdsreport.service';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { process } from '@progress/kendo-data-query';


@Component({
  selector: 'app-cin-entry',
  templateUrl: './cin-entry.component.html',
  styles: []
})
export class CINEntryComponent implements OnInit {
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpFromConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  challanano: any;
  gridData: any = []
  VoucherId: any;
  ReferenceNo: any;
  PaidDate: string;
  Bankname: any;
  totalamount : any=0;
  totaltdsamount : any =0;
  totalactualtdsamount : any =0;
  totalcaltds : any =0;
  constructor(private CommissionFormBuilder: FormBuilder, private datePipe: DatePipe, private tdsreportservice: TdsreportService, private _CommonService: CommonService, private datepipe: DatePipe, private router: Router, private _AccountingTransactionsService: AccountingTransactionsService) {
    this.dpConfig.dateInputFormat = "DD/MM/YYYY";
    this.dpConfig.maxDate = new Date();
    this.dpConfig.showWeekNumbers = false;

    this.dpFromConfig.dateInputFormat = "DD/MM/YYYY";
    this.dpFromConfig.maxDate = new Date();
    this.dpFromConfig.showWeekNumbers = false;

    this.allData = this.allData.bind(this);
  }
  public savebutton: any = 'Show';
  CINEntryform: FormGroup;
  challanalist: any = []
  FromDate:any;
  ToDate:any;
  CommisionPaymentErrors = {}
  ngOnInit() {
    this.CINEntryform = this.CommissionFormBuilder.group({


      pChallanaNo:[null,Validators.required],
      pFromDate:[''],
      pToDate:[''],
      pChallanaId: [''],
      pVoucherId: [''],
      pReferenceNo: [''],
      pPaidDate: [''],
      pPaidBank: [''],
      pBsrCode: ['',Validators.required],
      pChallanaSNO: ['',Validators.required],
      pChallanaBank: ['',Validators.required],
      pChallanaDate: [new Date(),Validators.required],
      ptypeofoperation: ['CREATE']

    })

    // this.asondate = this.today
    this.GetChallanaPaymentNumbers();
    // this.getLoadData();
    this.CommisionPaymentErrors = {};
    this.BlurEventAllControll(this.CINEntryform);
  }

  GetChallanaPaymentNumbers() {
    let isValid = true

    this.tdsreportservice.GetChallanaPaymentNumbers().subscribe(json => {
      this.challanalist = json;

    })


  }
  GetCinEntryData() {
    debugger
    let isValid: boolean = true;
    this.totalamount =0;
    this.totaltdsamount =0;
    this.totalactualtdsamount = 0;
    this.totalcaltds = 0;
    this.GetValidationByControl(this.CINEntryform, 'pChallanaNo', true);
      this.tdsreportservice.GetCinEntryData(this.challanano).subscribe(res => {
        console.log("cin entry grid", res);
        if(res){
          this.gridData = res['challanaPaymentList'];
          this.VoucherId=res['pVoucherno'];
          this.ReferenceNo=res['pChequenumber'];
       
          this.CINEntryform.controls.pVoucherId.setValue(res['pVoucherno'])
          this.CINEntryform.controls.pReferenceNo.setValue(res['pChequenumber'])
  
          let date = this.datePipe.transform(res['pPaymentdate'], "dd-MMM-yyyy");
          this.CINEntryform.controls.pPaidDate.setValue(date)
          this.PaidDate=date;
          this.CINEntryform.controls.pPaidBank.setValue(res['pBankname'])
          this.Bankname=res['pBankname'];
                          
          this.totalamount = this.gridData.reduce((sum, c) => sum + Number(c.pAmount), 0).toFixed(2);
          this.totaltdsamount = this.gridData.reduce((sum, c) => sum + Number(c.pTdsAmount), 0).toFixed(2);
          this.totalactualtdsamount = this.gridData.reduce((sum, c) => sum + Number(c.pActualTdsAmount), 0).toFixed(2);
          this.totalcaltds = this.gridData.reduce((sum, c) => sum + Number(c.pBalance), 0).toFixed(2);

        }
        
       
      })
    


  }
  challanachange(event) {
    debugger;
    this.gridData=[]
    this.challanano = event.pChallanaNo;
    this.FromDate=event.pFromdate
    this.ToDate=event.pTodate
    this.CINEntryform.controls.pFromDate.setValue(event.pFromdate)
    this.CINEntryform.controls.pToDate.setValue(event.pTodate)
    this.CINEntryform.controls.pChallanaId.setValue(event.pChallanaId)
  }
  checkValidations(group: FormGroup, isValid: boolean): boolean {

    try {

      Object.keys(group.controls).forEach((key: string) => {

        isValid = this.GetValidationByControl(group, key, isValid);
      })

    }
    catch (e) {
      return false;
    }
    return isValid;
  }
  GetValidationByControl(formGroup: FormGroup, key: string, isValid: boolean): boolean {

    try {
      let formcontrol;
      formcontrol = formGroup.get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          this.checkValidations(formcontrol, isValid)
        }
        else if (formcontrol.validator) {
          this.CommisionPaymentErrors[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.CommisionPaymentErrors[key] += errormessage + ' ';
                isValid = false;
              }
            }
          }
        }
      }
    }
    catch (e) {
      // this.showErrorMessage(e);
      // return false;
    }
    return isValid;
  }
  showErrorMessage(errormsg: string) {
    this._CommonService.showErrorMessage(errormsg);
  }
  BlurEventAllControll(fromgroup: FormGroup) {
    try {
      Object.keys(fromgroup.controls).forEach((key: string) => {
        this.setBlurEvent(fromgroup, key);
      })
    }
    catch (e) {
      this.showErrorMessage(e);
      return false;
    }
  }
  setBlurEvent(fromgroup: FormGroup, key: string) {
    try {
      let formcontrol;
      formcontrol = fromgroup.get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          this.BlurEventAllControll(formcontrol)
        }
        else {
          if (formcontrol.validator)
            fromgroup.get(key).valueChanges.subscribe((data) => { this.GetValidationByControl(fromgroup, key, true) })
        }
      }
    }
    catch (e) {
      this.showErrorMessage(e);
      return false;
    }
  }
  saveCinEntry()
  {
    let isValid: boolean = true;
    if (this.checkValidations(this.CINEntryform, isValid)) 
    {
      if(this.gridData.length>0)
      {
        let data=JSON.stringify(this.CINEntryform.value);
        this.tdsreportservice.SaveCinEntry(data).subscribe(json=>
          {
            console.log("json is",json)
          if(json)
          {
            this._CommonService.showInfoMessage("Saved Successfully");
            this.CINEntryform.reset();
            this.GetChallanaPaymentNumbers();
            this.CINEntryform.controls.ptypeofoperation.setValue('CREATE');
            this.CINEntryform.controls.pChallanaDate.setValue(new Date());
            this.CINEntryform.controls.pChallanaNo.setValue(null);
           
            this.Bankname="";
            this.FromDate="";
            this.ToDate="";
            this.VoucherId="";
            this.ReferenceNo="";
            this.PaidDate="";
            this.gridData=[];
            this.CommisionPaymentErrors={}
          }
        })
      }
      else{
        this._CommonService.showWarningMessage("There are no records in grid")
      }
      
    }
  }

  public allData(): ExcelExportData {
      const result: ExcelExportData = {
        data: process(this.gridData, {
          sort: [{ field: "pDepositdate", dir: "asc" }],
        }).data,
      };
  
      return result;
    }
  }
