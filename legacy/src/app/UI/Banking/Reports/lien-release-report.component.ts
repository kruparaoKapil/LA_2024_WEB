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


@Component({
  selector: 'app-lien-release-report',
  templateUrl: './lien-release-report.component.html',
  styles: []
})
export class LienReleaseReportComponent implements OnInit {


  LineReleaseForm: FormGroup;
  public BranchDetails: any = [];
  public savebutton = 'Show';
  public betweenorason = "Between";
  public Ason = "As On ";
  public today: Date = new Date();
  // branchname: any;
  frommonthof: any;
  returndata: any[];
  tomonthof: any;
  frommonthof1: any;
  tomonthof1: any;
  gridData: any = [];
  branchname = "All";
  validation = false;
  formValidationMessages: any;
  LienReleaseErrors: any;



  table: any;
  public dpFromConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpToConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  fromdate: any;
  todate: any;
  constructor(private FB: FormBuilder, private _CommonService: CommonService, private _LAReportsService: LAReportsService, private _FdReceiptService: FdReceiptService, private _LienEntryService: LienEntryService, private datepipe: DatePipe, private _AccountingTransactionsService: AccountingTransactionsService, private router: Router, private toastr: ToastrService, private exportAsService: ExportAsService) {
    this.dpFromConfig.dateInputFormat = 'DD-MMM-YYYY'
    this.dpFromConfig.maxDate = new Date();
    this.dpFromConfig.showWeekNumbers = false;

    this.dpToConfig.dateInputFormat = 'DD-MMM-YYYY'
    this.dpToConfig.maxDate = new Date();
    this.dpToConfig.showWeekNumbers = false;
  }

  ngOnInit() {
    debugger;
    this.LineReleaseForm = this.FB.group({
      pbranch: ['All',Validators.required ],
      pFromMonthOf: [this.today,Validators.required],
      pToMonthOf: [this.today,Validators.required],

    })

    this.GetBranchDetails();
    this.LienReleaseErrors = {};
    this.frommonthof = new Date();
    this.tomonthof = new Date();
    this.fromdate = this.datepipe.transform(this.frommonthof, "yyyy-MM-dd");
    this.todate = this.datepipe.transform(this.tomonthof, "yyyy-MM-dd");
    // this.BlurEventAllControll(this.LienReleaseForm);
  }
  GetBranchDetails() {
    debugger;
    this._LAReportsService.GetLienBranchDetails().subscribe(result => {
      this.BranchDetails = result;

    })
  }
  branch_change($event: any) {
    debugger;
    this.gridData.empty;
    this.frommonthof = new Date();
    this.tomonthof = new Date();
    this.fromdate = this.datepipe.transform(this.frommonthof, "yyyy-MM-dd");
    this.todate = this.datepipe.transform(this.tomonthof, "yyyy-MM-dd");
    this.gridData = [];
    this.branchname = $event.target.value;
  }
  // clearmethods(){
  //   this.gridData.empty;
  //     this.frommonthof=new Date();
  //     this.tomonthof=new Date();

  // }


  FromDateChange(event) {
    debugger;
    this.gridData = [];

    this.frommonthof = event;
    this.fromdate = this.datepipe.transform(this.frommonthof, "yyyy-MM-dd");

    if (this.tomonthof != [] || this.tomonthof == null || this.tomonthof == '') {
      this.validatedates();
    }
  }

  ToDateChange(event) {
    debugger;
    this.gridData = [];
    this.tomonthof = event;
    this.todate = this.datepipe.transform(this.tomonthof, "yyyy-MM-dd");
    if (this.frommonthof != [] || this.frommonthof == null || this.frommonthof == '') {
      this.validatedates();
    }
  }
  validatedates() {
    debugger;
    if (this.fromdate > this.todate) {

      this.validation = true
    }

    else {
      this.validation = false;
    }

  }

  Getlinereleasedetails() {
    debugger;
    let isValid: boolean = true;
    //if(this.checkValidations(this.LienReleaseForm,isValid)){
    if (this.showbtnvalidation) {
      this.gridData.empty;
      this.gridData = [];

      let fromDate = this.datepipe.transform(this.LineReleaseForm['controls']['pFromMonthOf'].value, "dd-MMM-yyyy");
      let toDate = this.datepipe.transform(this.LineReleaseForm['controls']['pToMonthOf'].value, "dd-MMM-yyyy");
      this.frommonthof = fromDate;
      this.tomonthof = toDate;
      this._LAReportsService.GetLeanreleaseReport(this.branchname, this.frommonthof, this.tomonthof).subscribe(result => {

        this.gridData = result;
        console.log(this.gridData);
      })

    }
  }


  showbtnvalidation() {
    debugger;

    let pbranch = <FormGroup>this.LineReleaseForm['controls']['pbranch'];
    let pFromMonthOf = <FormGroup>this.LineReleaseForm['controls']['pFromMonthOf'];
    let pToMonthOf = <FormGroup>this.LineReleaseForm['controls']['pToMonthOf'];


    pbranch.setValidators(Validators.required)
    pFromMonthOf.setValidators(Validators.required)
    pToMonthOf.setValidators(Validators.required)

    pFromMonthOf.updateValueAndValidity();
    pToMonthOf.updateValueAndValidity();
    pbranch.updateValueAndValidity();

  }

  //  pdf() {
  //     debugger;
  //     let rows = [];
  //     let reportname = "Lien Release";
  //     let gridheaders = ["Member Name", "Advance Account No.", "Deposit Amount","Scheme Name", "Tenor", "Interest Rate", "Lien Amount","Lien Release Date"];         

  //     let colWidthHeight = {
  //         paccountname: { cellWidth: 'auto' }, ledger: { cellWidth: 'auto' }, popeningbal: { cellWidth: 'auto' }, pdebitamount: { cellWidth: 'auto' }, pcreditamount: { cellWidth: 'auto' }, pclosingbal: { cellWidth: 'auto' }
  //     }
  //     this.gridData.forEach(element => {
  //         debugger;    
  //         let temp = [element.pmembername, element.pfdaccountno, element.pdepositamount, element.pschemename, element.ptenor, element.pinterestrate, element.plienamount,element.plienreleasedate];
  //         rows.push(temp);
  //     });
  //     // pass Type of Sheet Ex : a4 or lanscspe  
  //     this._CommonService._downloadReportsPdf(reportname, rows, gridheaders, colWidthHeight, "landscape");

  // }
  pdf() {
    debugger;
    let temp;
    let rows = [];
    let reportname = "Lien Release";
    let gridheaders = ["Member Name", "Advance Account No.", "Advance Amount", "Scheme Name", "Tenure", "Interest Rate", "Lien Amount", "Lien Release Date"];

    let colWidthHeight = {
      //paccountname: { cellWidth: 'auto' }, ledger: { cellWidth: 'auto' }, popeningbal: { cellWidth: 'auto' }, pdebitamount: { cellWidth: 'auto' }, pcreditamount: { cellWidth: 'auto' }, pclosingbal: { cellWidth: 'auto' }
      0: { cellWidth: 'auto' }, 1: { cellWidth: 'auto' }, 2: { cellWidth: 'auto',halign: 'right' }, 3: { cellWidth: 'auto'  }, 4: { cellWidth: 'auto' }, 5: { cellWidth: 'auto'}, 6: { cellWidth: 'auto',halign: 'right'}, 7: { cellWidth: 'auto' }
    }

    let data = "true"
    if (data == "true") {
      this.returndata = this._CommonService._getGroupingGridExportData(this.gridData, "pbranchname", false)
    }
    else {
      this.returndata = this.gridData
    }
    this.returndata.forEach(element => {
      debugger;
      let releasedate;
      let liendepositedate = element.plienreleasedate;
      // if (liendepositedate!== null) {
      //   let DateFormat3 = this._CommonService.formatDateFromYYYYMMDD(liendepositedate);
      //   releasedate = this.datepipe.transform(DateFormat3,'dd-MM-yyyy')
      // }
      releasedate = liendepositedate;
      let depositamount = this._CommonService.currencyformat(parseFloat(element.pdepositamount).toFixed(2));
      let lienamount = this._CommonService.currencyformat(parseFloat(element.plienamount).toFixed(2));
      if (element.group !== undefined) {
        temp = [element.group, element.pmembername, element.pfdaccountno, depositamount, element.pschemename, element.ptenor, element.pinterestrate, lienamount, releasedate];

      }
      else {
        temp = [element.pmembername, element.pfdaccountno, depositamount, element.pschemename, element.ptenor, element.pinterestrate, lienamount, releasedate];
      }

      rows.push(temp);
    });
    // pass Type of Sheet Ex : a4 or lanscspe  
    this._CommonService._downloadReportsPdflienrelease(reportname, rows, gridheaders, colWidthHeight, "landscape", this.betweenorason, this.frommonthof, this.tomonthof,this.branchname);

  }


  onDetailToggle(event) {
    console.log('Detail Toggled', event);
  }
  toggleExpandGroup(group) {
    console.log('Toggled Expand Group!', group);
    this.table.groupHeader.toggleExpandGroup(group);
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
          this.LienReleaseErrors[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.LienReleaseErrors[key] += errormessage + ' ';
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
