import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../../Services/common.service';
import { ToastrService } from 'ngx-toastr';
import { debug } from 'util';
import { DatePipe, JsonPipe } from '@angular/common';
import { LienEntryService } from '../../../Services/Banking/lien-entry.service';
import { LAReportsService } from '../../../Services/Banking/lareports.service';
import { Router } from '@angular/router';
import { AccountingTransactionsService } from '../../../Services/Accounting/accounting-transactions.service';
import { ExportAsService, ExportAsConfig, SupportedExtensions } from 'ngx-export-as';
import { FdReceiptService } from 'src/app/Services/Banking/Transactions/fd-receipt.service';
import { empty } from 'rxjs';
import { Page } from '../../Common/Paging/page';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';

@Component({
  selector: 'app-self-adjustment-report',
  templateUrl: './self-adjustment-report.component.html',
  styles: []
})
export class SelfAdjustmentReportComponent implements OnInit {
  SelfAdjustmentForm: FormGroup;
  companyname = "All";
  branchname = "All";
  showCompany: any;

  paymenttype = 'SELF';
  public CompanyDetails: any = []
  public BranchDetails: any = []
  public savebutton = 'Show';
  public betweenorason = "Between";
  public today: Date = new Date();
  showFrommonth: any;
  showTomonth: any;
  frommonthof: any;
  tomonthof: any;
  returndata: any[];
  gridData: any = [];
  validation = false;
  formValidationMessages: any;
  SelfAdjustmentErrors: any;
  fromdate: any;
  todate: any;
  date: any;
  table: any;
  company1: any;
  branch1: any;
  frommonthof1: any;
  tomonthof1: any;
  public dpFromConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpToConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  constructor(private FB: FormBuilder, private _CommonService: CommonService, private _LAReportsService: LAReportsService, private _FdReceiptService: FdReceiptService, private _LienEntryService: LienEntryService, private datepipe: DatePipe, private _AccountingTransactionsService: AccountingTransactionsService, private router: Router, private toastr: ToastrService, private exportAsService: ExportAsService) {
   // this.dpFromConfig.dateInputFormat = 'DD-MMM-YYYY'
    this.dpFromConfig.dateInputFormat = 'DD-MMM-YYYY'
    this.dpFromConfig.maxDate = new Date();
    this.dpFromConfig.showWeekNumbers = false;

//    this.dpToConfig.dateInputFormat = 'DD-MMM-YYYY'
    this.dpToConfig.dateInputFormat = 'DD-MMM-YYYY'
    this.dpToConfig.maxDate = new Date();
    this.dpToConfig.showWeekNumbers = false;
  }
  commencementgridPage = new Page();
  startindex: any;
  endindex: any;
  ngOnInit() {

    this.SelfAdjustmentForm = this.FB.group({
      pbranch: ['All', Validators.required],
      pcompanyname: ['All', Validators.required],
      padjustmenttype: ['SELF', Validators.required],
      pFromMonthOf: [this.today, Validators.required],
      pToMonthOf: [this.today, Validators.required],

    })
    this.commencementgridPage.pageNumber = 0
    this.commencementgridPage.size = 10;
    this.startindex = 0;
    this.endindex = this.commencementgridPage.size;
    this.commencementgridPage.totalElements = 10;
    this.SelfAdjustmentErrors = {};
    // this.date = new Date();
    this.showCompany = false;
    this.frommonthof = new Date();
    this.tomonthof = new Date();
    // this.fromdate = this.datepipe.transform(this.frommonthof, "yyyy-MM-dd");
    // this.todate = this.datepipe.transform(this.tomonthof, "yyyy-MM-dd");
    this.fromdate = this.datepipe.transform(this.frommonthof, "yyyy-MM-dd");
    this.todate = this.datepipe.transform(this.tomonthof, "yyyy-MM-dd");
    this.frommonthof1 = this.datepipe.transform(this.frommonthof, "yyyy-MM-dd");
    this.tomonthof1 = this.datepipe.transform(this.tomonthof, "yyyy-MM-dd");
    let company1 = this.SelfAdjustmentForm['controls']['pcompanyname'].value;
    let branch1 = this.SelfAdjustmentForm['controls']['pbranch'].value;
    this.companyname = company1;
    this.branchname = branch1;
  }

  GetCompanydetails() {
    this.gridData = [];
    // this.CompanyDetails=[];   
    this._LAReportsService.GetCompanydetails().subscribe(result => {
      if (result != null) {
        this.CompanyDetails = result;
      }
      console.log(this.CompanyDetails)
    })
  }

  GetBranchDetailsIP($event: any) {
    debugger;
    this.gridData = [];
    this.BranchDetails = [];
    this.companyname = $event.target.value;
    const typevalue = $event.target.value;
    if ($event.target.value == "All") {
      this.SelfAdjustmentForm.controls.pbranch.setValue('All');

    }
    this._LAReportsService.GetBranchDetailsIP(typevalue).subscribe(result => {
      if (result != null) {
        this.BranchDetails = result
      }
      console.log(this.BranchDetails)



    })
  }



  branchNameChange($event: any) {
    debugger;
    this.gridData = [];
    this.branchname = $event.target.value;

  }


  adjustmentTypeChange($event: any) {
    debugger;
    const typevalue = $event.target.value;
    this.paymenttype = $event.target.value;
    this.gridData = [];
    this.CompanyDetails = [];
    this.BranchDetails = [];
    if (typevalue == "ADJUSTMENT") {
      // this.SelfAdjustmentForm['controls']['pFromMonthOf'].setValue(this.date);
      //  this.SelfAdjustmentForm['controls']['pToMonthOf'].setValue(this.date);

      this.showCompany = true;
      this.GetCompanydetails();

    }
    else if (typevalue == "SELF") {
      this.showCompany = false;

    }
    // this.clearadjustmenttypechange();
    // this.printbtnvalidation(typevalue);
  }
  clearadjustmenttypechange() {

    try {

      this.SelfAdjustmentForm.reset();
      this.SelfAdjustmentForm['controls']['padjustmenttype'].setValue('SELF');
      this.SelfAdjustmentForm['controls']['pcompanyname'].setValue('ALL');
      this.SelfAdjustmentForm['controls']['pbranch'].setValue('ALL');

      this.formValidationMessages = {};
      this.SelfAdjustmentErrors = {};


    } catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }


  toggleExpandGroup(group) {
    debugger;
    console.log('Toggled Expand Group!', group);
    this.table.groupHeader.toggleExpandGroup(group);
  }
  onDetailToggle(event) {
    console.log('Detail Toggled', event);
  }


  FromDateChange($event: any) {
    debugger;
    this.gridData = [];

    this.frommonthof = $event;
    //this.fromdate = this.datepipe.transform(this.frommonthof, "yyyy-MM-dd");
    this.fromdate = this.datepipe.transform(this.frommonthof, "yyyy-MM-dd");
    this.frommonthof1 = this.datepipe.transform(this.frommonthof, "yyyy-MM-dd");


    if (!isNullOrEmptyString(this.tomonthof)) {
      this.validatedates();
    }

  }
  ToDateChange($event: any) {
    debugger;
    this.gridData = [];
    this.tomonthof = $event;
   // this.todate = this.datepipe.transform(this.tomonthof, "yyyy-MM-dd");
    this.todate = this.datepipe.transform(this.tomonthof, "yyyy-MM-dd");
    this.tomonthof1 = this.datepipe.transform(this.tomonthof, "yyyy-MM-dd");
    if (!isNullOrEmptyString(this.frommonthof)) {
      this.validatedates();
    }
    //if (this.frommonthof != [] || this.frommonthof == null || this.frommonthof == '') {
    //  this.validatedates();
    //}

  }
  validatedates() {
    debugger;

    // if (this.frommonthof  >  this.tomonthof) {

    if (this.fromdate > this.todate) {

      this.validation = true
    }

    else {
      this.validation = false;
    }

  }
  GetSelfAdjustmentDetails() {
    debugger;
    let isValid = false;
    this.showbtnvalidation(this.paymenttype)
    this.gridData.empty;
    this.gridData = [];
    if (this.paymenttype == "ADJUSTMENT") {
      let company1 = this.SelfAdjustmentForm['controls']['pcompanyname'].value;
      let branch1 = this.SelfAdjustmentForm['controls']['pbranch'].value;
      this.companyname = company1;
      this.branchname = branch1;

    }
    else {
      this.companyname = '';
      this.branchname = '';
    }

    // let fromDate = this.datepipe.transform(this.SelfAdjustmentForm['controls']['pFromMonthOf'].value, "yyyy-MM-dd");
    // let toDate = this.datepipe.transform(this.SelfAdjustmentForm['controls']['pToMonthOf'].value, "yyyy-MM-dd");
    let fromDate = this.datepipe.transform(this.SelfAdjustmentForm['controls']['pFromMonthOf'].value, 'yyyy-MM-dd');
    let toDate = this.datepipe.transform(this.SelfAdjustmentForm['controls']['pToMonthOf'].value, 'yyyy-MM-dd');
    this.frommonthof = fromDate;
    this.tomonthof = toDate;
    this._LAReportsService.GetselfadjustmentReport(this.paymenttype, this.companyname, this.branchname, this.frommonthof, this.tomonthof).subscribe(result => {

      if (result != null) {
        this.gridData = result
      }

      console.log("Grid data", this.gridData)


    })
  }


  // pdf() {
  //   debugger;
  //   let temp;
  //   let rows = [];
  //   let reportname = "Self Adjustment";
  //   let gridheaders = ["Member Name", "Advance Account No.", "Deposit Amount", "Scheme Name", "Deposit Date", "Maturity Date", "Tenure", "Maturity Amount", "Branch"];

  //   let colWidthHeight = {
  //     paccountname: { cellWidth: 'auto' }, ledger: { cellWidth: 'auto' }, popeningbal: { cellWidth: 'auto' }, pdebitamount: { cellWidth: 'auto' }, pcreditamount: { cellWidth: 'auto' }, pclosingbal: { cellWidth: 'auto' }
  //   }

  //   let data = "true"
  //   if (data == "true") {
  //     this.returndata = this._CommonService._getGroupingGridExportData(this.gridData, '', false)
  //   }
  //   else {
  //     this.returndata = this.gridData
  //   }
  //   this.returndata.forEach(element => {
  //     debugger;
  //     let depositedate;
  //     let maturitydate;
  //     let depositdate = element.pdepositdate;
  //     let mdate = element.pmaturitydate;     
  //     depositedate=depositdate;
  //     maturitydate=mdate;
  //     let pdepositamount = this._CommonService.currencyformat(parseFloat(element.pdepositamount).toFixed(2));
  //     let maturityamount = this._CommonService.currencyformat(parseFloat(element.pmaturityamount).toFixed(2));
  //     if (element.group !== undefined) {
  //         temp = [element.pmembername, element.pfdaccountno, pdepositamount, element.pschemename, depositedate, maturitydate, element.ptenor, maturityamount, element.pbranchname];

  //     }
  //     else {
  //       temp = [element.pmembername, element.pfdaccountno, pdepositamount, element.pschemename, depositedate, maturitydate, element.ptenor, maturityamount, element.pbranchname];
  //     }

  //     rows.push(temp);
  //   });
  //   // pass Type of Sheet Ex : a4 or lanscspe  
  //   this._CommonService._downloadReportsPdf(reportname, rows, gridheaders, colWidthHeight, "landscape");

  // }

  // pdf() {
  //   debugger;
  //   let temp;
  //   let rows = [];
  //   let reportname = "Self Adjustment";
  //   let gridheaders = ["Member Name", "Advance Account No.", "Deposit Amount", "Scheme Name", "Deposit Date", "Maturity Date", "Tenure", "Maturity Amount", "Branch"];

  //   let colWidthHeight = {
  //     paccountname: { cellWidth: 'auto' }, ledger: { cellWidth: 'auto' }, popeningbal: { cellWidth: 'auto' }, pdebitamount: { cellWidth: 'auto' }, pcreditamount: { cellWidth: 'auto' }, pclosingbal: { cellWidth: 'auto' }
  //   }

  //   let data = "true"
  //   if (data == "true") {
  //     this.returndata = this._CommonService._getGroupingGridExportData(this.gridData, "", false)
  //   }
  //   else {
  //     this.returndata = this.gridData
  //   }
  //   this.returndata.forEach(element => {
  //     debugger;
  //     let depositedate;
  //     let maturitydate;
  //     let depositdate = element.pdepositdate;
  //     let mdate = element.pmaturitydate;
  //     // if (depositdate !== null) {
  //     //   let DateFormat3 = this._CommonService.formatDateFromYYYYMMDD(depositdate);
  //     //   depositedate = this.datepipe.transform(DateFormat3, 'dd-MM-yyyy')
  //     // }
  //     // if (mdate !== null) {
  //     //   let DateFormat3 = this._CommonService.formatDateFromYYYYMMDD(mdate);
  //     //   maturitydate = this.datepipe.transform(DateFormat3, 'dd-MM-yyyy')
  //     // }
  //     depositedate=depositdate;
  //     maturitydate=mdate;
  //     let pdepositamount = this._CommonService.currencyformat(parseFloat(element.pdepositamount).toFixed(2));
  //     let maturityamount = this._CommonService.currencyformat(parseFloat(element.pmaturityamount).toFixed(2));
  //       if (element.group !== undefined) {
  //         temp = [element.group,element.pmembername, element.pfdaccountno, pdepositamount, element.pschemename, depositedate, maturitydate, element.ptenor, maturityamount, element.pbranchname];

  //     }
  //     else {
  //       temp = [element.pmembername, element.pfdaccountno, pdepositamount, element.pschemename, depositedate, maturitydate, element.ptenor, maturityamount, element.pbranchname];
  //     }

  //     rows.push(temp);
  //   });
  //   // pass Type of Sheet Ex : a4 or lanscspe  
  //     this._CommonService._downloadReportsPdf1(reportname, rows, gridheaders, colWidthHeight, "landscape", this.betweenorason, this.frommonthof, this.tomonthof);

  // }
 

   
  showbtnvalidation(type) {
    debugger

    let padjustmenttype = <FormGroup>this.SelfAdjustmentForm['controls']['padjustmenttype'];
    let pcompanyname = <FormGroup>this.SelfAdjustmentForm['controls']['pcompanyname'];
    let pbranchnamemain = <FormGroup>this.SelfAdjustmentForm['controls']['pbranch'];
    let pFromMonthOf = <FormGroup>this.SelfAdjustmentForm['controls']['pFromMonthOf'];
    let pToMonthOf = <FormGroup>this.SelfAdjustmentForm['controls']['pToMonthOf'];
    if (type == 'SELF') {

      padjustmenttype.setValidators(Validators.required)
      pFromMonthOf.setValidators(Validators.required)
      pToMonthOf.setValidators(Validators.required)

    }
    else if (type == 'ADJUSTMENT') {


      padjustmenttype.setValidators(Validators.required)
      pcompanyname.setValidators(Validators.required)
      pbranchnamemain.setValidators(Validators.required)
      pFromMonthOf.setValidators(Validators.required)
      pToMonthOf.setValidators(Validators.required)


    }
    else {

      padjustmenttype.clearValidators()
      pFromMonthOf.clearValidators()
      pToMonthOf.clearValidators()
      pcompanyname.clearValidators()
      pbranchnamemain.clearValidators()
    }
    padjustmenttype.updateValueAndValidity();
    pFromMonthOf.updateValueAndValidity();
    pToMonthOf.updateValueAndValidity();
    pcompanyname.updateValueAndValidity();
    pbranchnamemain.updateValueAndValidity();

  }
  public onOpenCalendar(container) {
    container.monthSelectHandler = (event: any): void => {
        container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
}
   pdf() {
   debugger;
     let rows = [];
    let reportname = "Self / Adjustment";
   let gridheaders = ["Member Name", "Advance Account No.", "Advance Amount", "Scheme Name", "Advance Date", "Maturity Date", "Tenure", "Maturity Amount", "Branch"];

     let colWidthHeight = {
    // paccountname: { cellWidth: 'auto' }, ledger: { cellWidth: 'auto' }, popeningbal: { cellWidth: 'auto' }, pdebitamount: { cellWidth: 'auto' }, pcreditamount: { cellWidth: 'auto' }, pclosingbal: { cellWidth: 'auto' }
    0: { cellWidth: 'auto' }, 1: { cellWidth: 'auto' }, 2: { cellWidth: 'auto',halign: 'right'  }, 3: { cellWidth: 'auto' }, 4: { cellWidth: 'auto' }, 5: { cellWidth: 'auto'}, 6: { cellWidth: 'auto' }, 7: { cellWidth: 'auto' ,halign: 'right' },8: { cellWidth: 'auto' }
     }
     this.gridData.forEach(element => {
       debugger;
       let depositedate;
        let maturitydate;
       let depositdate = element.pdepositdate;
       let mdate = element.pmaturitydate;     
      depositedate=depositdate;
        maturitydate=mdate;
      let pdepositamount = this._CommonService.currencyformat(parseFloat(element.pdepositamount).toFixed(2));
     let maturityamount = this._CommonService.currencyformat(parseFloat(element.pmaturityamount).toFixed(2));
    let temp = [element.pmembername, element.pfdaccountno, pdepositamount, element.pschemename, depositedate, maturitydate, element.ptenor, maturityamount, element.pbranchname];
    
  
       rows.push(temp);
    });
     // pass Type of Sheet Ex : a4 or lanscspe  
     debugger;
     this.frommonthof = this.datepipe.transform(this.frommonthof, "MMM-yyyy");
        this.tomonthof = this.datepipe.transform(this.tomonthof, "MMM-yyyy");
  this._CommonService._downloadReportsPdfselfadjustment(reportname, rows, gridheaders, colWidthHeight, "landscape", this.betweenorason, this.frommonthof, this.tomonthof,this.paymenttype, this.companyname, this.branchname);


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
          this.SelfAdjustmentErrors[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.SelfAdjustmentErrors[key] += errormessage + ' ';
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
