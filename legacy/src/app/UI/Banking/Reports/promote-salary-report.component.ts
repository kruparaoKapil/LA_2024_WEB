import { Component, OnInit, ViewChild } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr'
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { debug } from 'util';
import { DatePipe, JsonPipe } from '@angular/common';
import { Router } from '@angular/router';
import { ExportAsService, ExportAsConfig, SupportedExtensions } from 'ngx-export-as';
import { LienEntryService } from '../../../Services/Banking/lien-entry.service';
import { CommonService } from '../../../Services/common.service';
import { formatDate } from "@angular/common";
import { Page } from 'src/app/UI/Common/Paging/page';
import { PageCriteria } from 'src/app/Models/Loans/Masters/pagecriteria'
import { State, process, GroupDescriptor, SortDescriptor } from '@progress/kendo-data-query';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';

@Component({
    selector: 'app-promote-salary-report',
    templateUrl: './promote-salary-report.component.html',
    styles: []
})
export class PromoteSalaryReportComponent implements OnInit {
    PromoterSalaryForm: FormGroup;
    @ViewChild('myTable', { static: false })
    // exportAsConfig: ExportAsConfig = {

    //     type: 'pdf', // the type you want to download
    //     //type: 'xls',
    //     elementId: 'promotersalarylist', // the id of html/table element
    //     options: {
    //         //jsPDF: {
    //         orientation: 'potrait'
    //         //},
    //         //margin: {
    //         //    top: '10',
    //         //    bottom: '10'
    //         //},

    //         //pdfCallbackFn: this.pdfCallbackFn // to add header and footer
    //     }
    // }
    config: any = [];
    comapnydata: any;
    frommonthof: any;
    public today: Date = new Date();
    tomonthof: any;
    frommonthof1: any;
    tomonthof1: any;
    agentid = 0;
    agentname = "undefined";

    toUpperCase: any;
    pDatetype: ['ASON'];
    public savebutton = 'Show';
    displaytodate = "As On";
    public loading = false;
    public isLoading = false;
    validation = false;
    pdatecheked = "ASON";
    type = "ALL";
    public betweenorason = "As On";



    showFrommonth: any;
    showTomonth: any;
    selecteddate = true;
    formValidationMessages: any;
    //promotersalarylist: any;
    gridData: any = [];
    public ShowAgentnames: any = []

    public selectedvalues: any = []
    PromoterSalaryErrors: any
    date: any;
    doc: any;
    fromdate: any;
    todate: any;
    table: any;
    returndata: any[];
    promotersalarylist: any;
    JSONdataItem: any = [];
    commencementgridPage = new Page();
    startindex: any;
    endindex: any
    pageCriteria: PageCriteria;
    public dpFromConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
    public dpToConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
    nettotalamount :number=0;
    commissionTotalaAount :number=0;
    tdsTotalaAount:number=0;
    totalPaidAmount:number=0;
    public hdnpPaymentstatus = true;
    public group: GroupDescriptor[] = [{ field: 'pPaymentstatus' }];

    constructor(private FB: FormBuilder, private _LienEntryService: LienEntryService, private _CommonService: CommonService, private datepipe: DatePipe, private router: Router, private exportAsService: ExportAsService) {

        // this.dpFromConfig.dateInputFormat = 'DD-MMM-YYYY'
        this.dpFromConfig.dateInputFormat = 'YYYY-MM-DD'
        this.dpFromConfig.maxDate = new Date();
        this.dpFromConfig.showWeekNumbers = false;

        // this.dpToConfig.dateInputFormat = 'DD-MMM-YYYY'
        this.dpToConfig.dateInputFormat = 'YYYY-MM-DD'
        this.dpToConfig.maxDate = new Date();
        this.dpToConfig.showWeekNumbers = false;
        this.pageCriteria = new PageCriteria();
        this.allData = this.allData.bind(this);

    }


    ngOnInit() {
        //  this.setPageModel();
        this.PromoterSalaryForm = this.FB.group({
            pagentname: [''],
            pagentid: ['0'],
            ptype: ['ALL'],
            pDatetype: ['ASON'],
            pFromMonthOf: [this.today],
            pToMonthOf: [this.today],
            pmodofDate: [''],


        })
        this.commencementgridPage.pageNumber = 0
        this.commencementgridPage.size = 2;
        this.startindex = 0;
        this.endindex = this.commencementgridPage.size;
        this.commencementgridPage.totalElements = 2;
        this.PromoterSalaryErrors = {};
        this.DatetypeChange('ASON');
        //this.BlurEventAllControll(this.PromoterSalaryForm);
        this.validation = false;
        this.date = new Date();
        this.GetAgentDetails();

        this.frommonthof = new Date();
        this.tomonthof = new Date();
        // this.fromdate = this.datepipe.transform(this.frommonthof, "yyyy-MM-dd");
        // this.todate = this.datepipe.transform(this.tomonthof, "yyyy-MM-dd");
        this.fromdate = this.datepipe.transform(this.frommonthof, "yyyy-MM-dd");
        this.todate = this.datepipe.transform(this.tomonthof, "yyyy-MM-dd");
        this.frommonthof1 = this.datepipe.transform(this.frommonthof, "yyyy-MM-dd");
        this.tomonthof1 = this.datepipe.transform(this.tomonthof, "yyyy-MM-dd");
        this.PromoterSalaryForm['controls']['pToMonthOf'].setValue(this.date);

    }
    getVoucherno(row) {
        debugger;
        window.open('/#/PaymentVoucherReports?id=' + btoa(row.pvoucherno + ',' + 'Payment Voucher'));

    }
    setPageModel() {
        debugger
        this.pageCriteria.pageSize = this._CommonService.pageSize
        this.pageCriteria.offset = 0;
        this.pageCriteria.pageNumber = 1;
        this.pageCriteria.footerPageHeight = 50;
    }
    GetAgentDetails() {
        debugger;
        this._LienEntryService.GetAgentDetails().subscribe(result => {
            debugger;
            if (result) {
                // this.ShowAgentnames = result;
                let json: any = [];
                json = result;
                let testArray = [{ pagentid: 0, pagentname: "All" }];
                this.ShowAgentnames = [...testArray, ...json];

                this.ShowAgentnames.sort((a, b) => a.pagentname.localeCompare(b.pagentname));


                this.PromoterSalaryForm.controls.pagentname.setValue('All');
                this.PromoterSalaryForm.controls.pagentid.setValue(0);
            }
        })
    }

    agentnamechange($event) {
        debugger;
        $event
        this.agentid = $event.pagentid;
        this.agentname = $event.pagentname;
        this.promotersalarylist = [];

    }
    public onOpenCalendar(container) {
        container.monthSelectHandler = (event: any): void => {
            container._store.dispatch(container._actions.select(event.date));
        };
        container.setViewMode('month');
    }
    GetShowAgentdetails() {
        debugger;
        if (this.showbtnvalidation) {
            this.promotersalarylist = [];
            this.nettotalamount = 0;
            this.commissionTotalaAount = 0;
            this.tdsTotalaAount = 0;
            this.totalPaidAmount = 0;
            debugger;
            // this.frommonthof = this.datepipe.transform(this.frommonthof, "yyyy-MM-dd");
            // this.tomonthof = this.datepipe.transform(this.tomonthof, "yyyy-MM-dd");
            this.frommonthof = this.datepipe.transform(this.frommonthof, "yyyy-MM-dd");
            this.tomonthof = this.datepipe.transform(this.tomonthof, "yyyy-MM-dd");
            this._LienEntryService.ShowPromoterSalaryReport(this.agentid, this.frommonthof, this.tomonthof, this.type, this.pdatecheked).subscribe(result => {
                debugger;
                this.promotersalarylist = result;

                this.nettotalamount = this.promotersalarylist.reduce((sum, item) => sum + Number(item.pDepositamount), 0).toFixed(2);
                this.commissionTotalaAount = this.promotersalarylist.reduce((sum, item) => sum + Number(item.pCommissionamount), 0).toFixed(2);
                this.tdsTotalaAount = this.promotersalarylist.reduce((sum, item) => sum + Number(item.pTdsamount), 0).toFixed(2);
                this.totalPaidAmount = this.promotersalarylist.reduce((sum, item) => sum + Number(item.ptotalamount), 0).toFixed(2);
            })

        }


    }
    onFooterPageChange(event): void {
        this.pageCriteria.offset = event.page - 1;
        if (this.pageCriteria.totalrows < event.page * this.pageCriteria.pageSize) {
            this.pageCriteria.currentPageRows = this.pageCriteria.totalrows % this.pageCriteria.pageSize;
        }
        else {
            this.pageCriteria.currentPageRows = this.pageCriteria.pageSize;
        }
    }
    showbtnvalidation() {
        debugger
        let pagentid = <FormGroup>this.PromoterSalaryForm['controls']['pagentid'];
        let pFromMonthOf = <FormGroup>this.PromoterSalaryForm['controls']['pFromMonthOf'];
        let pToMonthOf = <FormGroup>this.PromoterSalaryForm['controls']['pToMonthOf'];
        let ptype = <FormGroup>this.PromoterSalaryForm['controls']['ptype'];

        pagentid.setValidators(Validators.required)
        ptype.setValidators(Validators.required)
        pToMonthOf.setValidators(Validators.required)
        if (this.pdatecheked == 'BETWEEN') {
            pFromMonthOf.setValidators(Validators.required)
        }
        pFromMonthOf.updateValueAndValidity();
        pToMonthOf.updateValueAndValidity();
        ptype.updateValueAndValidity();
        pagentid.updateValueAndValidity();


    }
    toggleExpandGroup(group) {
        debugger;
        console.log('Toggled Expand Group!', group);
        this.table.groupHeader.toggleExpandGroup(group);
    }

    onDetailToggle(event) {
        console.log('Detail Toggled', event);
    }
    DatetypeChange(type) {
        debugger;

        if (type == "ASON") {
            this.PromoterSalaryForm['controls']['pToMonthOf'].setValue(this.date);
            this.showFrommonth = false;
            this.showTomonth = true;
            this.displaytodate = "As On"
            this.pdatecheked = "ASON";
            this.betweenorason = "As On";
        }
        else if (type == "BETWEEN") {
            this.PromoterSalaryForm['controls']['pFromMonthOf'].setValue(this.date);
            this.PromoterSalaryForm['controls']['pToMonthOf'].setValue(this.date);
            this.showFrommonth = true;
            this.showTomonth = true;
            this.displaytodate = "To Month";
            this.pdatecheked = "BETWEEN";
            this.betweenorason = "Between";
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
        this.gridData = [];
        this.frommonthof = $event;
        this.promotersalarylist = [];
        //this.fromdate = this.datepipe.transform(this.frommonthof, "yyyy-MM-dd");
        this.fromdate = this.datepipe.transform(this.frommonthof, "yyyy-MM-dd");
        this.frommonthof1 = this.datepipe.transform(this.frommonthof, "yyyy-MM-dd");
        if (this.tomonthof != [] || this.tomonthof == null || this.tomonthof == '') {
            this.validatedates();
        }

    }
    ToDateChange($event: any) {
        debugger;
        this.gridData = [];
        this.promotersalarylist = [];
        this.tomonthof = $event;
        //this.todate = this.datepipe.transform(this.tomonthof, "yyyy-MM-dd");
        this.todate = this.datepipe.transform(this.tomonthof, "yyyy-MM-dd");
        this.tomonthof1 = this.datepipe.transform(this.tomonthof, "yyyy-MM-dd");
        if (this.frommonthof != [] || this.frommonthof == null || this.frommonthof == '') {
            this.validatedates();
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
        this.gridData = [];
        this.promotersalarylist = [];
        this.nettotalamount = 0;
        this.commissionTotalaAount = 0;
        this.tdsTotalaAount = 0;
        this.totalPaidAmount = 0;
        this.type = $event.target.value;
    }
    clearPromoterSalary() {

        try {
            this.promotersalarylist = [];
            this.PromoterSalaryForm.reset();
            this.PromoterSalaryForm['controls']['pagentid'].setValue('ALL');
            this.PromoterSalaryForm['controls']['pDatetype'].setValue('ASON');
            this.PromoterSalaryForm['controls']['ptype'].setValue('ALL');

            this.formValidationMessages = {};
            this.PromoterSalaryErrors = {};


        } catch (e) {
            this._CommonService.showErrorMessage(e);
        }
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
                    this.PromoterSalaryErrors[key] = '';
                    if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
                        let lablename;
                        lablename = (document.getElementById(key) as HTMLInputElement).title;
                        let errormessage;
                        for (const errorkey in formcontrol.errors) {
                            if (errorkey) {
                                errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                                this.PromoterSalaryErrors[key] += errormessage + ' ';
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
   

      public allData(): ExcelExportData {
        const result: ExcelExportData = {
          data: process(this.promotersalarylist, {
            group: this.group,
            sort: [{ field: "pPaymentstatus", dir: "asc" }],
          }).data,
          group: this.group,
        };
    
        return result;
      }
}
