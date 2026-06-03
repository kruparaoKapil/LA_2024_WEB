import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr'
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { debug } from 'util';
import { DatePipe, JsonPipe } from '@angular/common';
import { Router } from '@angular/router';
import { ExportAsService, ExportAsConfig, SupportedExtensions } from 'ngx-export-as';
import { formatDate } from "@angular/common";
import { Page } from 'src/app/UI/Common/Paging/page'
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { GroupDescriptor } from '@progress/kendo-data-query';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { process } from '@progress/kendo-data-query';
import { LAReportsService } from 'src/app/Services/Banking/lareports.service';
import { CommonService } from 'src/app/Services/common.service';
import { LienEntryService } from 'src/app/Services/Banking/lien-entry.service';

@Component({
  selector: 'app-maturity-report-new1',
  templateUrl: './maturity-report-new1.component.html',
  styles: []
})

export class MaturityReportNew1Component implements OnInit {
  PrematurityForm: FormGroup;
  frommonthof: any;
  public today: Date = new Date();
  tomonthof: any;
  frommonthof1: any;
  tomonthof1: any;
  pDatetype: ['ASON'];
  displaytodate = "As On";
  public loading = false;
  public isLoading = false;
  validation = false;
  pdatecheked = "ASON";
  type = "ALL";
  public savebutton = 'Show';
  showFrommonth: any;
  showTomonth: any;
  selecteddate = true;
  formValidationMessages: any;
  fromdate: any;
  todate: any;
  date: any;
  public dpFromConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpToConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  table: any;
  returndata: any[];
  prematuritylist: any;
  PrematurityErrors: any
  public betweenorason = "As On";
  commencementgridPage = new Page();
  startindex: any;
  endindex: any;
    public group: GroupDescriptor[] = [{ field: 'pSchemename' }];
    public hdnp = true;

  constructor(private FB: FormBuilder, private _LAReportsService: LAReportsService, private _LienEntryService: LienEntryService, private _CommonService: CommonService, private datepipe: DatePipe, private router: Router, private exportAsService: ExportAsService) {

    this.dpFromConfig.dateInputFormat = 'DD-MMM-YYYY'
    this.dpFromConfig.maxDate = new Date();
    this.dpFromConfig.showWeekNumbers = false;

    this.dpToConfig.dateInputFormat = 'DD-MMM-YYYY'
    this.dpToConfig.maxDate = new Date();
    this.dpToConfig.showWeekNumbers = false;

    this.allData = this.allData.bind(this);

  }

  ngOnInit() {
    this.PrematurityForm = this.FB.group({

      pDatetype: ['ASON'],
      pFromMonthOf: [this.today],
      pToMonthOf: [this.today],
      pmodofDate: [''],
      ptype: ['ALL'],


    })
    this.commencementgridPage.pageNumber = 0
    this.commencementgridPage.size = 10;
    this.commencementgridPage.totalElements = 3;

 //this.commencementgridPage.pageNumber = 0
    //this.commencementgridPage.size = 10;
    this.startindex = 0;
    this.endindex = this.commencementgridPage.size;
    //this.commencementgridPage.totalElements = 10;
    this.DatetypeChange('ASON');
    this.date = new Date();
    this.frommonthof = new Date();
    this.tomonthof = new Date();
    // this.fromdate = this.datepipe.transform(this.frommonthof, "yyyy-MM-dd");
    // this.todate = this.datepipe.transform(this.tomonthof, "yyyy-MM-dd");
    this.fromdate = this.datepipe.transform(this.frommonthof, "dd-MMM-yyyy");
    this.todate = this.datepipe.transform(this.tomonthof, "dd-MMM-yyyy");
    this.PrematurityForm['controls']['pToMonthOf'].setValue(this.date);
    this.PrematurityErrors = {};
  }

  DatetypeChange(type) {
    debugger;

    if (type == "ASON") {
      this.PrematurityForm['controls']['pToMonthOf'].setValue(this.date);
      this.showFrommonth = false;
      this.showTomonth = true;
      this.displaytodate = "As On";
      this.pdatecheked = "ASON";
      this.betweenorason="As On";
    }
    else if (type == "BETWEEN") {
      this.PrematurityForm['controls']['pFromMonthOf'].setValue(this.date);
      this.PrematurityForm['controls']['pToMonthOf'].setValue(this.date);
      this.showFrommonth = true;
      this.showTomonth = true;
      this.displaytodate = "To Date";
      this.pdatecheked = "BETWEEN";
      this.betweenorason="Between";
    }
    else {
      this.showFrommonth = false;
      this.showTomonth = false;
      this.displaytodate = "Month Of";

    }
    //this.datechangevalidations(type);
    //this.cleardatechange();

  }
  FromDateChange($event: any) {
    debugger;
   
    this.frommonthof = $event;
   this.prematuritylist = [];
   // this.fromdate = this.datepipe.transform(this.frommonthof, "yyyy-MM-dd");
   this.fromdate = this.datepipe.transform(this.frommonthof, "dd-MMM-yyyy");
    if (this.pdatecheked == "BETWEEN") {
    if (this.tomonthof != [] || this.tomonthof == null || this.tomonthof == '') {
      this.validatedates();
    }
  }

  }
  ToDateChange($event: any) {
    debugger;
    this.prematuritylist = [];
    this.tomonthof = $event;
   // this.todate = this.datepipe.transform(this.tomonthof, "yyyy-MM-dd");
   this.todate = this.datepipe.transform(this.tomonthof, "dd-MMM-yyyy");
    if (this.pdatecheked == "BETWEEN") {
    if (this.frommonthof != [] || this.frommonthof == null || this.frommonthof == '') {
      this.validatedates();
    }
  }

  }
  validatedates() {

    if (this.fromdate > this.todate) {
      this.validation = true
    }
    else {
      this.validation = false;
    }

  }
  TypeChange($event: any) {
    debugger;   
    this.prematuritylist = [];
    this.type = $event.target.value;
}
  GetPrematuritydetails() {
    debugger;
    if (this.showbtnvalidation) {
        this.prematuritylist = [];
        debugger;
        this.loading = true;
        // this.frommonthof = this.datepipe.transform(this.frommonthof, "yyyy-MM-dd");
        // this.tomonthof = this.datepipe.transform(this.tomonthof, "yyyy-MM-dd");
        this.frommonthof = this.datepipe.transform(this.frommonthof, "dd-MMM-yyyy");
        this.tomonthof = this.datepipe.transform(this.tomonthof, "dd-MMM-yyyy");
        this._LAReportsService.ShowPrematurityReport(this.frommonthof, this.tomonthof, this.type, this.pdatecheked).subscribe(result => {
           
            if (result != null) {
              this.prematuritylist = result
            }
            this.prematuritylist.filter(data=>data.pPaidAmount= isNullOrEmptyString(data.pPaidAmount)?0:data.pPaidAmount)
           
            console.log("Grid data", this.prematuritylist)
            this.loading = false;
      

        })

    }


}
showbtnvalidation() {
    debugger
    
    let pFromMonthOf = <FormGroup>this.PrematurityForm['controls']['pFromMonthOf'];
    let pToMonthOf = <FormGroup>this.PrematurityForm['controls']['pToMonthOf'];
    let ptype = <FormGroup>this.PrematurityForm['controls']['ptype'];

  
    ptype.setValidators(Validators.required)
    pToMonthOf.setValidators(Validators.required)
    if (this.pdatecheked == 'BETWEEN') {
        pFromMonthOf.setValidators(Validators.required)
    }
    pFromMonthOf.updateValueAndValidity();
    pToMonthOf.updateValueAndValidity();
    ptype.updateValueAndValidity();
   


}
  pdf() {
    debugger;
    let temp;
    let rows = [];
    let type;
    let gridheaders;
   
    let reportname = "Maturity Completed";
   
    gridheaders = ["Advance Account No.",  "Scheme Name","Advance Amount",  "Advance Date","Maturity Date","Maturity Amount", "Tenure", "Interest Rate", "Interest Payable", "Paid Amount", "Chit Branch"];
    
    let colWidthHeight = {
        paccountname: { cellWidth: 'auto' }, ledger: { cellWidth: 'auto' }, popeningbal: { cellWidth: 'auto' }, pdebitamount: { cellWidth: 'auto' }, pcreditamount: { cellWidth: 'auto' }, pclosingbal: { cellWidth: 'auto' }
    }

    let data = "true"
    if (data == "true") {
        this.returndata = this._CommonService._getGroupingGridExportData(this.prematuritylist, "pMembername", false)
    }
    else {
        this.returndata = this.prematuritylist
    }
    this.returndata.forEach(element => {
      let depositedate;
      let depositdate = element.pDepositdate;
      // if (depositdate !== null) {
      //   let DateFormat3 = this._CommonService.formatDateFromYYYYMMDD(depositdate);
      //   depositedate = this.datepipe.transform(DateFormat3, 'dd-MM-yyyy')
      // }
      let maturitydate;
      let mdate = element.pMaturitydate;
      // if (mdate !== null) {
      //   let DateFormat3 = this._CommonService.formatDateFromYYYYMMDD(mdate);
      //   maturitydate = this.datepipe.transform(DateFormat3, 'dd-MM-yyyy')
      // }
      depositedate=depositdate;
      maturitydate=mdate;
      let pDepositamount = this._CommonService.currencyformat(parseFloat(element.pDepositamount).toFixed(2));
      let pMaturityamount = this._CommonService.currencyformat(parseFloat(element.pMaturityamount).toFixed(2));
      let pInterestrate = this._CommonService.currencyformat(parseFloat(element.pInterestrate).toFixed(2));
      let pPaidAmount = this._CommonService.currencyformat(parseFloat(element.pPaidAmount).toFixed(2));
      let pInterestPayable = this._CommonService.currencyformat(parseFloat(element.pInterestPayable).toFixed(2));
        if (element.group !== undefined) {
            temp = [element.group,  element.pFdAccountNo ,element.pSchemename, pDepositamount,  depositedate, maturitydate, pMaturityamount, element.pTenor, pInterestrate, pInterestPayable, pPaidAmount, element.pChitbranchname];
        }
        else {
            temp = [element.pFdAccountNo ,element.pSchemename,pDepositamount, depositedate, maturitydate, pMaturityamount, element.pTenor, pInterestrate, pInterestPayable,pPaidAmount, element.pChitbranchname];
        } 


        rows.push(temp);
});
    // pass Type of Sheet Ex : a4 or lanscspe  
    debugger;
   
    this._CommonService._downloadReportsPdf1(reportname, rows, gridheaders, colWidthHeight, "landscape",this.betweenorason, this.frommonthof, this.tomonthof);



}



 onDetailToggle(event) {
console.log('Detail Toggled', event);
}
toggleExpandGroup(group) {
console.log('Toggled Expand Group!', group);
this.table.groupHeader.toggleExpandGroup(group);
} 

public allData(): ExcelExportData {
  debugger
  // Sort the data by pMaturitydate in ascending order
  const sortedData = this.prematuritylist.sort((a, b) => {
      const dateA = new Date(a.pMaturitydate);
      const dateB = new Date(b.pMaturitydate);
      return dateA.getTime() - dateB.getTime(); // ascending order
  });

  // Helper function to format date as DD-MM-YYYY
  const formatDate = (dateString: string): string => {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
  };

  // Modify the data to change pDepositdate and pMaturitydate format
  const formattedData = sortedData.map(item => {
      return {
          ...item,
          pDepositdate: item.pDepositdate ? formatDate(item.pDepositdate) : null,
          pMaturitydate: item.pMaturitydate ? formatDate(item.pMaturitydate) : null
      };
  });

  // Returning the formatted data for Excel export
  const result: ExcelExportData = {
      data: process(formattedData, {}).data,
  };

  return result;
}



// Validation Methods ---------------
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
              this.PrematurityErrors[key] = '';
              if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
                  let lablename;
                  lablename = (document.getElementById(key) as HTMLInputElement).title;
                  let errormessage;
                  for (const errorkey in formcontrol.errors) {
                      if (errorkey) {
                          errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                          this.PrematurityErrors[key] += errormessage + ' ';
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
  // End Validation Methods --------------

}
