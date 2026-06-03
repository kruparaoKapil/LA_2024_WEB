import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { LAReportsService } from 'src/app/Services/Banking/lareports.service';
import { forkJoin } from 'rxjs';
import { isNullOrUndefined } from '@swimlane/ngx-datatable';
import { CommonService } from 'src/app/Services/common.service';
import { GroupDescriptor } from '@progress/kendo-data-query';
import { anyChanged } from '@progress/kendo-angular-common';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { process } from '@progress/kendo-data-query';

@Component({
  selector: 'app-cash-flow-report',
  templateUrl: './cash-flow-report.component.html',
  styles: []
})
export class CashFlowReportComponent implements OnInit {
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  monthof: any;
  showvalidation:boolean=false
  date: string;
  
  selecteddate:any;
  monthtype:any;
  public groups: GroupDescriptor[] = [{ field: 'pSchemename' }];
  monthname: any;
  showcashflow:boolean=false
  showcashflowparticulars:boolean=false
  constructor(private _fb:FormBuilder,private _CommonService:CommonService,private datepipe: DatePipe,private laservice:LAReportsService){ 
    this.dpConfig.dateInputFormat = 'MMM-YYYY'
    this.dpConfig.minDate = new Date();
    this.dpConfig.showWeekNumbers = false;
    this.allData = this.allData.bind(this);
  
   }
   CashFlowForm:FormGroup;
   cashflowsummary:any=[];
   DatetoShow:any;
   MonthtoShow:any;
   cashflowparticulars:any=[]
   cashflowdetails:any=[];
   cashflowvalidations={}
  ngOnInit()
   {
     this.formgroup();
     this.BlurEventAllControll(this.CashFlowForm)
     this.monthtype="ALL";
     
     this.date = this.datepipe.transform(this.CashFlowForm.controls.ptransdate.value, 'MMM-yyyy');
     this.selecteddate = this.datepipe.transform(this.CashFlowForm.controls.ptransdate.value, 'MMM-yyyy');
     this.DatetoShow=this.date
  }
formgroup()
  {
    this.CashFlowForm=this._fb.group
    ({
      ptransdate:[new Date()],
      month:['',Validators.required]
    })
  }
  public onOpenCalendar(container) {
    container.monthSelectHandler = (event: any): void => {
        container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
}
DateChange($event)
{
 debugger;
 this.cashflowdetails=[];
 this.cashflowsummary=[];
 this.cashflowparticulars=[];
 this.showcashflow=false;
 this.showcashflowparticulars=false
 this.date = this.datepipe.transform($event, 'MMM-yyyy');
 this.selecteddate=this.datepipe.transform($event, 'MMM-yyyy')
 this.DatetoShow=this.date
}
Monthchanges(event)
{
  debugger
  this.cashflowdetails=[];
  this.cashflowsummary=[];
  this.cashflowparticulars=[];
  this.showcashflow=false;
  this.showcashflowparticulars=false
  this.monthof=Number(event.target.value)
  this.MonthtoShow=this.monthof
 
}
GetMonth(dataItem)
{
  debugger;
  this.monthtype=dataItem.pperticulars;
  this.cashflowdetails=[];

  this.monthname=dataItem.pperticulars;
let test=dataItem.pperticulars.includes("Upto");

  if(test==true)

  {
    
    this.selecteddate = this.datepipe.transform(this.CashFlowForm.controls.ptransdate.value, 'MMM-yyyy');
    //this.date = this.datepipe.transform(this.CashFlowForm.controls.ptransdate.value, 'MMM-yyyy');
    this.CallDetailsApi()
  }
  else if(dataItem.pperticulars=="Cash" || dataItem.pperticulars=="Cheques on Hand"
   || dataItem.pperticulars=="Fixed Deposit Receipts" ||  dataItem.pperticulars=="Bank Balances"
   || dataItem.pperticulars=="Chits Details")
  {
    this.showcashflowparticulars=true;
    this.showcashflow=false
    this.CallPerticularsApi()
  }
  else
  {
    this.selecteddate="";
    this.showcashflowparticulars=false;
    this.showcashflow=true
    this.CallDetailsApi()
  }
  
}

CallPerticularsApi()
{
  debugger;
  this.selecteddate = this.datepipe.transform(this.CashFlowForm.controls.ptransdate.value, 'MMM-yyyy');
  this.laservice.GetCashFlowPerticularsDetails(this.monthname,this.selecteddate).subscribe(json=>
  {
    debugger;
    this.cashflowparticulars=[]
     this.cashflowparticulars=json;
     console.log("cashflowparticulars",this.cashflowparticulars)
  })
}
CallDetailsApi()
{
  this.laservice.GetCashFlowDetails(this.selecteddate,this.monthtype).subscribe(json=>
    {
      debugger;
      this.showcashflow=true;
      this.cashflowdetails=json
      console.log("cashflowdetails",this.cashflowdetails)
     
    })
}
showdetails()
{
debugger
let isValid = true;
this.monthtype="ALL";
this.monthname=""
this.cashflowsummary=[];
this.cashflowdetails=[]
if(this.checkValidations(this.CashFlowForm, isValid))
{
  let cashflowsummarygrid = this.laservice.GetCashFlowSummary(this.date,this.monthof)
  let cashflowdetailsgrid = this.laservice.GetCashFlowDetails("",this.monthtype)
  
  this.showcashflow=true;
  this.showcashflowparticulars=false
  
  forkJoin([cashflowsummarygrid, cashflowdetailsgrid]).subscribe(result => 
    {
      debugger
        
      this.cashflowsummary=result[0];
      if(this.cashflowsummary.length>0){
        this.cashflowsummary.filter(function (df) { df.pStatus = (df.pperticulars=="Total" ||df.pperticulars=="Excess/Shortfall" ||df.pperticulars=="Excess/Shortfall (Chits)")?false:true  });
      }
     
      this.cashflowdetails=result[1];
      console.log("result",result)
         
         
    })


    this.selecteddate = this.datepipe.transform(this.CashFlowForm.controls.ptransdate.value, 'MMM-yyyy');
  
}
 
}
editClick(event)
{

}
checkValidations(group: FormGroup, isValid: boolean): boolean {
  debugger
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
              this.cashflowvalidations[key] = '';
              if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
                  let lablename;
                  lablename = (document.getElementById(key) as HTMLInputElement).title;
                  let errormessage;
                  for (const errorkey in formcontrol.errors) {
                      if (errorkey) {
                          errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                          this.cashflowvalidations[key] += errormessage + ' ';
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

public allData(): ExcelExportData {
    const result: ExcelExportData =  {
        data: process(this.cashflowdetails, { }).data
    };

    return result;
}
}
