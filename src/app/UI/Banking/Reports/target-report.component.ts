import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../../Services/common.service';
import { ToastrService } from 'ngx-toastr';
import { debug } from 'util';
import { forkJoin } from 'rxjs';
import { DatePipe, JsonPipe } from '@angular/common';
import { LienEntryService } from '../../../Services/Banking/lien-entry.service';
import { LAReportsService } from '../../../Services/Banking/lareports.service';
import { Router } from '@angular/router';
import { AccountingTransactionsService } from '../../../Services/Accounting/accounting-transactions.service';
import { ExportAsService, ExportAsConfig, SupportedExtensions } from 'ngx-export-as';
import { FdReceiptService } from 'src/app/Services/Banking/Transactions/fd-receipt.service';
import { empty, from } from 'rxjs';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { State, process, GroupDescriptor, SortDescriptor } from '@progress/kendo-data-query';

@Component({
    selector: 'app-target-report',
    templateUrl: './target-report.component.html',
    styles: []
})
export class TargetReportComponent implements OnInit {
    TargetreportForm: FormGroup;
    public today: Date = new Date();
    //public today1: Date = new Date();
    showFrommonth: any;
    showTomonth: any;
    public pageSize = 10;
    public pageSize1=10;
  public skip = 0;
    Rfrommonthof: any;
    Rtomonthof: any;
    Cfrommonthof: any;
    Ctomonthof: any;
    returndata: any[];
    gridData: any = [];
    Rvalidation = false;
    Cvalidation = false;
    public savebutton = 'Show';
    formValidationMessages: any;
    TargetreportErrors: any;
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
    Detailsdata: any = [];
    showdetails: boolean = false
    public totalmatureamout: any;
    public totalreceiptamount: any;
    public totalachived: any;
    Branchtye: any;
    branchname: any;
    showsummary: boolean = false
    showdetailsgrid: boolean = false
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

    public dpFromConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
    public dpChequeFromConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
    public dpToConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
    public dpChequeToConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
    constructor(private FB: FormBuilder, private _CommonService: CommonService, private _LAReportsService: LAReportsService, private _FdReceiptService: FdReceiptService, private _LienEntryService: LienEntryService, private datepipe: DatePipe, private _AccountingTransactionsService: AccountingTransactionsService, private router: Router, private toastr: ToastrService, private exportAsService: ExportAsService) {
        this.dpFromConfig.dateInputFormat = 'DD-MMM-YYYY'
        this.dpFromConfig.maxDate = new Date();
        this.dpFromConfig.showWeekNumbers = false;

        this.dpToConfig.dateInputFormat = 'DD-MMM-YYYY'
        // this.dpToConfig.maxDate = new Date();
        // this.dpToConfig.showWeekNumbers = false;
        this.dpChequeFromConfig.dateInputFormat = 'DD-MMM-YYYY'
        this.dpChequeToConfig.dateInputFormat = 'DD-MMM-YYYY'

        this.allData = this.allData.bind(this);
        this.allData1 = this.allData1.bind(this);
    }

    ngOnInit() {
        debugger;
        this.TargetreportForm = this.FB.group({

            pFromMonthOf: [this.today, Validators.required],
            pToMonthOf: [this.today, Validators.required],

            //pChequFromMonthOf: [this.today.getDate()+5,this.today.getMonth(), this.today.getFullYear],
            //pchequeToMonthOf: [this.today.getDate()+5+'-'+this.today.getMonth()+1+'-'+this.today.getFullYear(), Validators.required],
            pChequFromMonthOf: [this.today, Validators.required],

            pchequeToMonthOf: [this.today, Validators.required],

        })

        this.TargetreportErrors = {};

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
        this.Branchtye = "ALL";
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
        this.TargetreportForm.controls['pChequFromMonthOf'].setValue(this.requiredDate);
    }
    extradays1() {
        let ctodate = this.Rtomonthof;

        this.ctodatechange1 = new Date(ctodate.getFullYear(), ctodate.getMonth(), ctodate.getDate() + 5)
        this.TargetreportForm.controls['pchequeToMonthOf'].setValue(this.ctodatechange1);

    }

    RFromDateChange($event: any) {
        debugger;
        this.gridData = [];
        this.Detailsdata = [];
        this.Detailsdata.empty;
        this.clearmethod();
        this.dpToConfig.minDate = this.TargetreportForm.controls.pFromMonthOf.value;
        this.Rfrommonthof = $event;
        this.Rfromdate = this.datepipe.transform(this.Rfrommonthof, "yyyy-MM-dd");


        if (this.Rtomonthof != [] || this.Rtomonthof == null || this.Rtomonthof == '') {
            this.Rvalidatedates();
        }
        this.extradays();




          // this.gridData = result[0];
         
          // this.Detailsdata = result[1];
          // console.log("result", result)

    }
    RToDateChange($event: any) {
        debugger;
        this.gridData = [];
        this.Detailsdata = [];
        this.Detailsdata.empty;
        this.clearmethod();
        //this. Datesbind();
        this.Rtomonthof = $event;
        this.Rtodate = this.datepipe.transform(this.Rtomonthof, "yyyy-MM-dd");

        if (this.Rfrommonthof != [] || this.Rfrommonthof == null || this.Rfrommonthof == '') {
            this.Rvalidatedates();
        }
        this.extradays1();
  this.dpChequeFromConfig.minDate = this.TargetreportForm.controls.pFromMonthOf.value;
  this.dpChequeToConfig.minDate = this.TargetreportForm.controls.pToMonthOf.value;
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
    GetTargetdetails() {
        debugger;
        let isValid: boolean = true;

        this.Branchtye = "ALL";
        this.branchname = ""
        this.clearmethod();
        this.gridData.empty;
        this.Detailsdata.empty
        this.gridData = [];
        this.Detailsdata = [];
        let fromDate1 = this.datepipe.transform(this.Rfrommonthof, "dd-MMM-yyyy");
        let toDate1 = this.datepipe.transform(this.Rtomonthof, "dd-MMM-yyyy");
        let fromDate = this.datepipe.transform(this.TargetreportForm['controls']['pChequFromMonthOf'].value, "dd-MMM-yyyy");
        let toDate = this.datepipe.transform(this.TargetreportForm['controls']['pchequeToMonthOf'].value, "dd-MMM-yyyy");
        this.Rfrommonthof = fromDate1;
        this.Rtomonthof = toDate1;
        this.Cfrommonthof = fromDate;
        this.Ctomonthof = toDate;


        this._LAReportsService.GetTargetdetailsReport(this.Rfrommonthof, this.Rtomonthof, this.Cfrommonthof, this.Ctomonthof).subscribe(json => {
            debugger;

            this.gridData = json
            this.getDetailsColumnWisetotals();
            if (json != null) {
                this.Detailsdata = [];
                this._LAReportsService.ShowtargetDetails(this.Branchtye).subscribe(json => {
                    debugger;

                    this.Detailsdata = json
                })
            }
        })

        //let targetsummarygrid = this._LAReportsService.GetTargetdetailsReport(this.Rfrommonthof, this.Rtomonthof, this.Cfrommonthof, this.Ctomonthof)
        //let targetdetailsgrid = this._LAReportsService.ShowtargetDetails(this.Branchtye)


        //forkJoin([targetsummarygrid, targetdetailsgrid]).subscribe(result => {
        //    debugger

        //    this.gridData = result[0];
        //    this.Detailsdata = result[1];
        //    console.log("result", result)


        //})

        



    }

    GetBranch(dataItem) {
        debugger;
        this.Branchtye = dataItem.pbranchsummary;
        this.Detailsdata = []
        this.branchname = dataItem.pbranchsummary
        this._LAReportsService.ShowtargetDetails(this.Branchtye).subscribe(json => {
            debugger;

            this.Detailsdata = json
        })
    }




    getDetailsColumnWisetotals() {
        let data = this.Detailsdata;
        if (this.gridData.length > 0) {
            this.totalreceiptamount = this.gridData.reduce((sum, c) => sum + c.preceiptamountsummary, 0);
            this.totalreceiptamount = parseFloat(this.totalreceiptamount)

            this.totalmatureamout = this.gridData.reduce((sum, c) => sum + c.pprematureamoutsummary, 0);
            this.totalmatureamout = parseFloat(this.totalmatureamout)

            this.totalachived = this.gridData.reduce((sum, c) => sum + c.pachivedsummary, 0);
            this.totalachived = parseFloat(this.totalachived)


        }
        else {
            this.totalreceiptamount = 0;
            this.totalmatureamout = 0;
            this.totalachived = 0;


        }
    }
    clearmethod() {
        this.totalmatureamout = "";
        this.totalreceiptamount = "";
        this.totalachived = "";
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
            //group: this.groups,
           // sort: [{ field: "preceiptdate", dir: "asc" }],
          }).data,
          //group: this.groups,
        };
    
        return result;
      }

      public allData1(): ExcelExportData {
        const result: ExcelExportData = {
          data: process(this.Detailsdata, {
            
          }).data,
          
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
                    this.TargetreportErrors[key] = '';
                    if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
                        let lablename;
                        lablename = (document.getElementById(key) as HTMLInputElement).title;
                        let errormessage;
                        for (const errorkey in formcontrol.errors) {
                            if (errorkey) {
                                errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                                this.TargetreportErrors[key] += errormessage + ' ';
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
