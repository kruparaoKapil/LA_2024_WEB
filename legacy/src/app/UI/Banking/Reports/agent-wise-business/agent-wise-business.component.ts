import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { debug } from 'util';
import { DatePipe, JsonPipe } from '@angular/common';
import { Router } from '@angular/router';
import { ExportAsService, ExportAsConfig, SupportedExtensions } from 'ngx-export-as';
import { FdReceiptService } from 'src/app/Services/Banking/Transactions/fd-receipt.service';
import { empty } from 'rxjs';
import { GroupDescriptor, SortDescriptor,process } from '@progress/kendo-data-query';
import { CommonService } from 'src/app/Services/common.service';
import { LienEntryService } from 'src/app/Services/Banking/lien-entry.service';
import { AccountingTransactionsService } from 'src/app/Services/Accounting/accounting-transactions.service';
import { LAReportsService } from 'src/app/Services/Banking/lareports.service';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';

@Component({
  selector: 'app-agent-wise-business',
  templateUrl: './agent-wise-business.component.html',
  styles: []
})
export class AgentWiseBusinessComponent implements OnInit {
  AgentPointForm: FormGroup;

  public today: Date = new Date();
  //public today1: Date = new Date();
  showFrommonth: any;
  showTomonth: any;
  Rfrommonthof: any;
  Rtomonthof: any;
  Cfrommonthof: any;
  Ctomonthof: any;
  pageSize=10;
  returndata: any[];
  gridData: any = [];
  Rvalidation = false;
  Cvalidation = false;
  public savebutton = 'Show';
  formValidationMessages: any;
  AgentpointErrors: any;
  Rfromdate: any;
  Rtodate: any;
  Cfromdate: any;
  Ctodate: any;
  date: any;
  table: any;
  fromDateecepit: any;
  todatereceipt: any;
  requiredDate: any;
  ctodatechange1: any;
    company: any;
    Agentname: any;
    Agentname1: any;
    public comapnydata: any;
    public pCompanyName: any;
   
    public pAddress1: any;
    public pAddress2: any;
    public pcity: any;
    public pCountry: any;
    public pState: any;
    public pDistrict: any;
    public pPincode: any;
    public pCinNo: any;
    public pGstinNo: any;
    public pBranchname: any

  public totalagentamount: any;
  Detailsdata: any = [];
  public hdnTranDate = true;


  public aggregates: any[] = [{ field: 'preceivedamount', aggregate: 'sum' }];

  public groups: GroupDescriptor[] = [{ field: 'preferralname', aggregates: this.aggregates }];

  // public groups: GroupDescriptor[] = [{ field: 'pAgentname' }];

  public sort: SortDescriptor[] = [{
    field: 'pfdreceipttdate',
    dir: 'asc'
  }];



  // group: {
  //   field: "pDepositamount", aggregates: { field: "pDepositamount", aggregate: "sum" }

  // }
 
  showdetails: boolean = false
  public dpFromConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpToConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  constructor(private FB: FormBuilder, private _CommonService: CommonService, private _LAReportsService: LAReportsService, private _FdReceiptService: FdReceiptService, private _LienEntryService: LienEntryService, private datepipe: DatePipe, private _AccountingTransactionsService: AccountingTransactionsService, private router: Router, private toastr: ToastrService, private exportAsService: ExportAsService) {
    this.dpFromConfig.dateInputFormat = 'DD-MMM-YYYY'
    this.dpFromConfig.maxDate = new Date();
    this.dpFromConfig.showWeekNumbers = false;

    this.dpToConfig.dateInputFormat = 'DD-MMM-YYYY'
   // this.dpToConfig.maxDate = new Date();
    //this.dpToConfig.showWeekNumbers = false;
    this.allData = this.allData.bind(this);

  }

  ngOnInit() {
    debugger;
    this.AgentPointForm = this.FB.group({

      pFromMonthOf: [this.today, Validators.required],
      pToMonthOf: [this.today, Validators.required],
      // pChequFromMonthOf: [this.today.getDate()+5+'-'+this.today.getMonth()+1+'-'+this.today.getFullYear(), Validators.required],
      // pchequeToMonthOf: [this.today.getDate()+5+'-'+this.today.getMonth()+1+'-'+this.today.getFullYear(), Validators.required],

      pChequFromMonthOf: [this.today, Validators.required],

      pchequeToMonthOf: [this.today, Validators.required],
    })
    this.AgentpointErrors = {};
    // this.date = new Date();
    this.Rfrommonthof = new Date();
    this.Rtomonthof = new Date();
    this.Rfromdate = this.datepipe.transform(this.Rfrommonthof, "yyyy-MM-dd");
    this.Rtodate = this.datepipe.transform(this.Rtomonthof, "yyyy-MM-dd");
    this.Cfrommonthof = new Date();
    this.Ctomonthof = new Date();
    this.Cfromdate = this.datepipe.transform(this.Cfrommonthof, "yyyy-MM-dd");
    this.Ctodate = this.datepipe.transform(this.Ctomonthof, "yyyy-MM-dd");
    this.extradays();
      this.extradays1();
      this.Agentname = "ALL";
      this.getComapnyName();
    
  }
 

  extradays() {
    debugger;
    let cdate = this.Rfrommonthof;
    // let dd=cdate.getDate();
    // let mm=cdate.getMonth()+1;
    // let yy=cdate.getFullYear();
    // let chqfdate=(dd+5)+'-'+mm+'-'+yy;
    // let date= new Date(chqfdate)
    // let datefromc =this.datepipe.transform(date, "dd-MMM-yyyy");
    this.requiredDate = new Date(cdate.getFullYear(), cdate.getMonth(), cdate.getDate() + 5)
    this.AgentPointForm.controls['pChequFromMonthOf'].setValue(this.requiredDate);
  }
  extradays1() {
    let ctodate = this.Rtomonthof;

    this.ctodatechange1 = new Date(ctodate.getFullYear(), ctodate.getMonth(), ctodate.getDate() + 5)
    this.AgentPointForm.controls['pchequeToMonthOf'].setValue(this.ctodatechange1);


  }
  RFromDateChange($event: any) {
    debugger;
    this.gridData = [];
    this.Detailsdata=[];
    this.Rfrommonthof = $event;
    this.Rfromdate = this.datepipe.transform(this.Rfrommonthof, "yyyy-MM-dd");


    if (this.Rtomonthof != [] || this.Rtomonthof == null || this.Rtomonthof == '') {
      this.Rvalidatedates();
    }
    let cdate = this.Rfrommonthof;

    var requiredDate = new Date(cdate.getFullYear(), cdate.getMonth(), cdate.getDate() + 5)
    this.AgentPointForm.controls['pChequFromMonthOf'].setValue(requiredDate);

  }
  RToDateChange($event: any) {
    debugger;
    this.gridData = [];
    this.Detailsdata=[];
    this.Rtomonthof = $event;
    this.Rtodate = this.datepipe.transform(this.Rtomonthof, "yyyy-MM-dd");

    if (this.Rfrommonthof != [] || this.Rfrommonthof == null || this.Rfrommonthof == '') {
      this.Rvalidatedates();
    }
    let ctodate = this.Rtomonthof;

    var ctodatechange1 = new Date(ctodate.getFullYear(), ctodate.getMonth(), ctodate.getDate() + 5)
    this.AgentPointForm.controls['pchequeToMonthOf'].setValue(ctodatechange1);

  }
  Rvalidatedates() {
    debugger;

    if (this.Rfromdate > this.Rtodate) {

      this.Rvalidation = true
    }

    else {
      this.Rvalidation = false;
    }

  }
  
  GetAgentdetails() {
    debugger;
    let isValid: boolean = true;
      this.Agentname = "ALL";
    // this.gridData.empty;
    // this.Detailsdata.empty;
    this.gridData = [];
    let fromDate1 = this.datepipe.transform(this.Rfrommonthof, "dd-MMM-yyyy");
    let toDate1 = this.datepipe.transform(this.Rtomonthof, "dd-MMM-yyyy");
    let fromDate = this.datepipe.transform(this.AgentPointForm['controls']['pChequFromMonthOf'].value, "dd-MMM-yyyy");
    let toDate = this.datepipe.transform(this.AgentPointForm['controls']['pchequeToMonthOf'].value, "dd-MMM-yyyy");
    this.Rfrommonthof = fromDate1;
    this.Rtomonthof = toDate1;
    this.Cfrommonthof = fromDate;
    this.Ctomonthof = toDate;

      this._LAReportsService.GetAgentwiseBusinessReport(this.Rfrommonthof, this.Rtomonthof, this.Cfrommonthof, this.Ctomonthof).subscribe(result => {
      if (result != null) {
          this.gridData = result
          this.Detailsdata = [];
          // this._LAReportsService.GetAgentPointsDetails(this.Agentname).subscribe(result => {
          //     if (result != null) {
          //         this.Detailsdata = result;
          //     }
          //     this.showdetails = true;

          //    // this.getDetailsColumnWisetotals();

          // })
      }
      console.log("Grid data", this.gridData)
          

    })
   
    }
    GetAgentDetails(dataItem) {
        debugger;
        this.Agentname = dataItem.pAgentnamesummary;
        this.Agentname1 = dataItem.pAgentnamesummary;
        this.Detailsdata = []        
        this._LAReportsService.GetAgentPointsDetails(this.Agentname).subscribe(json => {
            debugger;

            this.Detailsdata = json
        })
    }

  getDetailsColumnWisetotals() {
    let data=this.Detailsdata;
    if (this.Detailsdata.length > 0) {
        this.totalagentamount = this.Detailsdata.reduce((sum, c) => sum + c.pDepositamount, 0);
        this.totalagentamount = parseFloat(this.totalagentamount)


    }
    else {
        this.totalagentamount = 0;

    }
}
pdfGenerate() {
  debugger;
  this.company.hidden=false;
  let printContents, popupWin;
  printContents = document.getElementById('temp-box').innerHTML;
  popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
  popupWin.document.open();
  popupWin.document.write(`
    <html>
      <head>
        <title>Againts</title>
        <link rel="stylesheet" type="text/css" href="assets/css/bootstrap.min.css"/>
        <link rel="stylesheet" type="text/css" href="assets/css/custom.css" />
       
        <style>
        //........Customized style.......
        </style>
      </head>
  <body onload="window.pdf();window.download();window.close()">${printContents}</body>
    </html>`
  );
  popupWin.document.close();
}
public getComapnyName() {
  debugger;
    this.comapnydata = this._CommonService.comapnydetails;;
    this.pCompanyName = this.comapnydata['pCompanyName'];
    this.pAddress1 = this.comapnydata['pAddress1'];
    this.pAddress2 = this.comapnydata['pAddress2'];
    this.pcity = this.comapnydata['pcity'];
    this.pCountry = this.comapnydata['pCountry'];
    this.pState = this.comapnydata['pState'];
    this.pDistrict = this.comapnydata['pDistrict'];
    this.pPincode = this.comapnydata['pPincode'];
    this.pCinNo = this.comapnydata['pCinNo'];
    this.pGstinNo = this.comapnydata['pGstinNo'];
    this.pBranchname = this.comapnydata['pBranchname'];
}

public allData(): ExcelExportData {
  const result: ExcelExportData = {
    data: process(this.gridData, {
       group: this.groups,
      sort: [{ field: "pfdreceipttdate", dir: "asc" }],
    }).data,
    group: this.groups,
  };

  return result;
}


  //Validations
  checkValidations(group: FormGroup, isValid: boolean): boolean {

    try {
      Object.keys(group.controls).forEach((key: string) => {
        isValid = this.GetValidationByControl(group, key, isValid);
      })
    }
    catch (e) {
      this.showErrorMessage(e);
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
          this.AgentpointErrors[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.AgentpointErrors[key] += errormessage + ' ';
                isValid = false;
              }
            }
          }
        }
      }
    }
    catch (e) {
      this.showErrorMessage(e);
      return false;
    }
    return isValid;
  }
  showErrorMessage(errormsg: string) {

    this._CommonService.showErrorMessage(errormsg);
  }
  showInfoMessage(errormsg: string) {

    this._CommonService.showInfoMessage(errormsg);
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
  //End Validations
}
