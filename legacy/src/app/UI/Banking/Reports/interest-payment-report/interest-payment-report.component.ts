import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../../../Services/common.service';
import { ToastrService } from 'ngx-toastr';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { debug } from 'util';
import { DatePipe, JsonPipe, formatDate } from '@angular/common';
import { LienEntryService } from '../../../../Services/Banking/lien-entry.service';
import { Router } from '@angular/router';
import { AccountingTransactionsService } from '../../../../Services/Accounting/accounting-transactions.service';
import { ExportAsService, ExportAsConfig, SupportedExtensions } from 'ngx-export-as';
import { LAReportsService } from 'src/app/Services/Banking/lareports.service';
import { GroupDescriptor,process } from '@progress/kendo-data-query';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';


@Component({
    selector: 'app-interest-payment-report',
    templateUrl: './interest-payment-report.component.html',
    styleUrls: ['./interest-payment-report.component.css']
})
export class InterestPaymentReportComponent implements OnInit {

    public group: GroupDescriptor[] = [{ field: 'pPaymentstatus' }];
    public hdnpPaymentstatus = true;

    InterestPaymentForm: FormGroup;
    // exportAsConfig: ExportAsConfig = {

    //     type: 'pdf', // the type you want to download
    //     //type: 'xls',
    //     elementId: 'gridData', // the id of html/table element
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


    frommonthof: any;
    tomonthof: any;
    frommonthof1: any;
    tomonthof1: any;
    public today: Date = new Date();
    toUpperCase: any;
    paymenttype = 'SELF';
    pDatetype: ['ASON'];
    pToMonthOf = this.today;
    pvoucherno: any;
    public savebutton = 'Show';
    displaytodate = "As On";
    public loading = false;
    public isLoading = false;
    validation = false;
    pdatecheked = "ASON";
    type = "ALL";
    accountno :any;
    pFdAccNo = "ALL";
    schemetype="undefined";
    public betweenorason = "As On";
    schemeid = 0;
    companyname: any;
    branchname: any;
    showCompany: any;
    showFrommonth: any;
    showTomonth: any;
    selecteddate = true;
    formValidationMessages: any;
    intrestpaymentlist: any;
    gridData: any = [];
    public SchemeDetails: any = []
    public BranchDetails: any = []
    public CompanyDetails: any = []
    public selectedvalues: any = []
    public AccNodetails:any=[]
    InterestPaymentErrors: any
    date: any;
    doc: any;
    fromdate: any;
    todate: any;
    table: any;
   // AccNodetails:any;



    JSONdataItem: any = [];


    public dpFromConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
    public dpToConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
    returndata: any[];
    netPaidAmount: any = 0;


    constructor(private FB: FormBuilder, private _CommonService: CommonService, private _LAReportsService: LAReportsService, private _LienEntryService: LienEntryService, private datepipe: DatePipe, private _AccountingTransactionsService: AccountingTransactionsService, private router: Router, private toastr: ToastrService, private exportAsService: ExportAsService) {
        this.dpFromConfig.dateInputFormat = 'MMM-YYYY'
        this.dpFromConfig.maxDate = new Date();
        this.dpFromConfig.showWeekNumbers = false;

        this.dpToConfig.dateInputFormat = 'MMM-YYYY'
        this.dpToConfig.maxDate = new Date();
        this.dpToConfig.showWeekNumbers = false;
        this.allData = this.allData.bind(this);

    }
    ngOnInit() {
        this.InterestPaymentForm = this.FB.group({

            padjustmenttype: ['SELF'],
            ptype: ['ALL'],
            pDatetype: ['ASON'],
            pschemename: ['All'],
            pSchemeId: [''],

            pcompanyname: ['', Validators.required],
            pbranchnamemain: ['', Validators.required],
            pbranchname: ['', Validators.required],
            pFromMonthOf: [this.today, Validators.required],
            pToMonthOf: [this.today, Validators.required],
            pmodofDate: [''],
            pFdAccNo:['ALL'],


        })

        this.showCompany = false;
        this.GetSchemedetails();
        this.GetAccnodetails();
        
        this.InterestPaymentErrors = {};
        this.DatetypeChange('ASON');
        this.BlurEventAllControll(this.InterestPaymentForm);
        this.validation = false;
        this.date = new Date();
        this.frommonthof = new Date();
        this.tomonthof = new Date();
        this.fromdate = this.datepipe.transform(this.frommonthof, "yyyy-MM");
        this.todate = this.datepipe.transform(this.tomonthof, "yyyy-MM");
        this.frommonthof1 = this.datepipe.transform(this.frommonthof, "MMM-yyyy");
        this.tomonthof1 = this.datepipe.transform(this.tomonthof, "MMM-yyyy");

        this.InterestPaymentForm['controls']['pToMonthOf'].setValue(this.date);


    }
    public onOpenCalendar(container) {
        container.monthSelectHandler = (event: any): void => {
            container._store.dispatch(container._actions.select(event.date));
        };
        container.setViewMode('month');
    }
    accno_change($event: any) {
        debugger;   
        this.gridData = [];
        this.accountno = $event.target.value;
    }
 GetAccnodetails() {
     debugger;
    this.gridData = [];
    this.AccNodetails =[];
    debugger;
     this._LAReportsService.GetAccnodetails(this.paymenttype, this.companyname, this.branchname, this.schemeid).subscribe(result => {
          debugger;
           this.AccNodetails = result;
           console.log(this.AccNodetails);
    
         })
    }
    getVoucherno(row) {
        debugger;
        window.open('/#/PaymentVoucherReports?id=' + btoa(row.pvoucherno + ',' + 'Payment Voucher'));
        
    }
    FromDateChange($event: any) {
        debugger;
        this.gridData = [];

        this.frommonthof = $event;
        this.fromdate = this.datepipe.transform(this.frommonthof, "yyyy-MM");
        this.frommonthof1 = this.datepipe.transform(this.frommonthof, "MMM-yyyy");

        if (this.pdatecheked == "BETWEEN") {
            if (this.tomonthof != [] || this.tomonthof == null || this.tomonthof == '') {
                this.validatedates();
            }
        }

    }
    ToDateChange($event: any) {
        debugger;
        this.gridData = [];
        this.tomonthof = $event;
        this.todate = this.datepipe.transform(this.tomonthof, "yyyy-MM");
        this.tomonthof1 = this.datepipe.transform(this.tomonthof, "MMM-yyyy");

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
    // FromDateChange($event: any) {
    //     debugger;
    //     this.gridData = [];

    //     this.frommonthof = $event;
    //     this.fromdate = this.datepipe.transform(this.frommonthof, "yyyy-MM-dd");

    //     if (this.pdatecheked == "BETWEEN") {
    //         if (this.tomonthof != [] || this.tomonthof == null || this.tomonthof == '') {
    //             this.validatedates();
    //         }
    //     }
    // }

    // ToDateChange($event: any) {
    //     debugger;
    //     this.gridData = [];
    //     this.tomonthof = $event;
    //     this.todate = this.datepipe.transform(this.tomonthof, "yyyy-MM-dd");

    //     if (this.pdatecheked == "BETWEEN") {
    //         if (this.frommonthof != [] || this.frommonthof == null || this.frommonthof == '') {
    //             this.validatedates();
    //         }
    //     }
    // }
    // validatedates() {
    //     debugger;
    //     if (this.fromdate > this.todate) {

    //         this.validation = true
    //       }

    //       else {
    //         this.validation = false;
    //       }

    // }

    TypeChange($event: any) {
        debugger;
        this.gridData = [];
        this.type = $event.target.value;
    }

    // export() {
    //     debugger;
    //     // download the file using old school javascript method
    //     this.exportAsService.save(this.exportAsConfig, 'InterestPayment').subscribe(() => {
    //         // save started
    //     });
    //     // get the data as base64 or json object for json type - this will be helpful in ionic or SSR
    //     this.exportAsService.get(this.config).subscribe(content => {
    //         console.log(content);
    //     });

    // }
    pdfCallbackFn(pdf: any) {
        // example to add page number as footer to every page of pdf
        const noOfPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= noOfPages; i++) {
            pdf.setPage(i);
            pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 100, pdf.internal.pageSize.getHeight() - 30);
            // pdf.img('')
        }
    }
    pdf() {
        debugger;
        let temp;
        let rows = [];
        let reportname = "Interest Payment";
        let gridheaders = ["Scheme Name","Member Name", "Advance Account No.", "Advance Amount", "Advance Date", "Maturity Date", "Interest Rate", "Interest Amount", "Tds Amount", "Paid Amount", "Bank Name", "Bank Branch", "Voucher No.", "Payment Date", "Mode of Payment", "Bank Name", "Branch Name", "Cheque No."];

        let colWidthHeight = {
          //  paccountname: { cellWidth: 'auto' }, ledger: { cellWidth: 'auto' }, popeningbal: { cellWidth: 'auto' }, pdebitamount: { cellWidth: 'auto' }, pcreditamount: { cellWidth: 'auto' }, pclosingbal: { cellWidth: 'auto' }
          0: { cellWidth: 'auto' }, 1: { cellWidth: 'auto' }, 2: { cellWidth: 'auto' }, 3: { cellWidth: 'auto',halign: 'right'  }, 4: { cellWidth: 'auto' }, 5: { cellWidth: 'auto'}, 6: { cellWidth: 'auto' }, 7: { cellWidth: 'auto' ,halign: 'right' },8: { cellWidth: 'auto',halign: 'right'  },9: { cellWidth: 'auto',halign: 'right' },10: { cellWidth: 'auto' },11: { cellWidth: 'auto' },12: { cellWidth: 'auto' },13: { cellWidth: 'auto' },14: { cellWidth: 'auto' },15: { cellWidth: 'auto' },
          16: { cellWidth: 'auto' }        }

        let data = "true"
        if (data == "true") {
            this.returndata = this._CommonService._getGroupingGridExportData(this.gridData, "pPaymentstatus", false)
        }
        else {
            this.returndata = this.gridData
        }
        this.returndata.forEach(element => {
            debugger;

            let deposit;
            let maturity;
            let payment;
            let depositedate = element.pdepositedate;
            let maturitydate = element.pmaturitydate;
            let paymentdate = element.ppaymentdate;
            //if (depositedate !== null) {
            //    let DateFormat3 = this._CommonService.formatDateFromYYYYMMDD(depositedate);
            //    deposit = this.datepipe.transform(DateFormat3, 'dd-MM-yyyy')
            //}
            //else {
            //    deposit = depositedate;
            //}
            //if (maturitydate !== null) {
            //    let DateFormat4 = this._CommonService.formatDateFromYYYYMMDD(maturitydate);
            //    maturity = this.datepipe.transform(DateFormat4, 'dd-MM-yyyy')
            //}
            //else {
            //    maturity = maturitydate;
            //}
            //if (paymentdate !== null) {
            //    let DateFormat5 = this._CommonService.formatDateFromYYYYMMDD(paymentdate);
            //    payment = this.datepipe.transform(DateFormat5, 'dd-MM-yyyy')
            //}
            //else {
            //    payment = paymentdate;
            //}

            deposit = depositedate;
            maturity = maturitydate;
            payment = paymentdate;
            let depositamount = this._CommonService.currencyformat(parseFloat(element.pdepositeamount).toFixed(2));
            let interestamount = this._CommonService.currencyformat(parseFloat(element.pIntrestamount).toFixed(2));
            let tdsamount = this._CommonService.currencyformat(parseFloat(element.pTdsamount).toFixed(2));
            let totalamount = this._CommonService.currencyformat(parseFloat(element.ptotalamount).toFixed(2));
            if (element.group !== undefined) {
                temp = [element.group,element.pSchemename, element.pMembername, element.pFdaccountno, depositamount, deposit, maturity, element.pinterestrate,
                    interestamount, tdsamount,
                    totalamount, element.pbankname, element.pbankbranch,
                element.pvoucherno, payment, element.pmodeofpayment, element.ppaybankname, element.ppaybankbranchname, element.ppaychequeno];

            }
            else {
                temp = [element.pSchemename,element.pMembername, element.pFdaccountno,
                    depositamount, deposit,
                    maturity, element.pinterestrate,
                    interestamount, tdsamount,
                    totalamount, element.pbankname, element.pbankbranch, element.pvoucherno, payment, element.pmodeofpayment, element.ppaybankname, element.ppaybankbranchname, element.ppaychequeno];
            }

            rows.push(temp);
        });
        // pass Type of Sheet Ex : a4 or lanscspe  

        this._CommonService._downloadReportsPdf11(reportname, rows, gridheaders, colWidthHeight, "landscape", this.betweenorason, this.frommonthof1, this.tomonthof1,this.schemetype, this.paymenttype, this.companyname, this.branchname, this.type,this.accountno);


    }
    DatetypeChange(type) {
        debugger;
        //this.InterestPaymentForm['controls']['pFromMonthOf'].setValue(this.date);
        //this.InterestPaymentForm['controls']['pToMonthOf'].setValue(this.date);
        if (type == "ASON") {
            this.InterestPaymentForm['controls']['pToMonthOf'].setValue(this.date);
            this.showFrommonth = false;
            this.showTomonth = true;
            this.displaytodate = "As On";
            this.pdatecheked = "ASON";
            this.betweenorason = "As On";
        }
        else if (type == "BETWEEN") {
            this.InterestPaymentForm['controls']['pFromMonthOf'].setValue(this.date);
            this.InterestPaymentForm['controls']['pToMonthOf'].setValue(this.date);
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
    GetSchemedetails() {

       debugger;
        this._LAReportsService.GetInterestreportscheme().subscribe(result => {
            debugger;
            this.SchemeDetails = result;
            console.log(this.SchemeDetails)
        })
    }
    GetCompanydetails() {
        debugger;
        this._LienEntryService.GetCompanydetails().subscribe(result => {
            debugger;
            this.CompanyDetails = result;
            console.log(this.CompanyDetails)
        })
    }
    GetBranchDetailsIP($event: any) {
        debugger;
        this.companyname = $event.target.value;
        const typevalue = $event.target.value;
        this.AccNodetails = [];
        this._LienEntryService.GetBranchName1(typevalue).subscribe(result => {
            debugger;
            this.BranchDetails = result;
        })
    }
    GetPrint() {
        debugger;
        this.loading = true;
        this.isLoading = true;
        let companyname;
        let branchname;
        //this.savebutton = 'Processing';
        debugger;


        debugger;
        let isValid = false;
        //this.printbtnvalidation(this.paymenttype)

        let schemeid = this.schemeid;
        let paymenttype = this.paymenttype;

        if (this.paymenttype == 'SELF') {
            companyname = null;
            branchname = null;
        }
        else {
            companyname = this.companyname;
            branchname = this.branchname;

        }

        let monthof = this.tomonthof;
        this.selectedvalues += schemeid + ',' + paymenttype + ',' + monthof + ',' + companyname + ',' + branchname;
        let receipt = btoa(this.selectedvalues);
        //window.open('/#/InterestPaymentPreview?id=' + this.selectedvalues);
        window.open('/#/InterestPaymentPreview?id=' + receipt);
        this.clearadjustmenttypechange();
        this.clearInterestPayment();
        this.selectedvalues = "";


    }

    toggleExpandGroup(group) {
        debugger;
        console.log('Toggled Expand Group!', group);
        this.table.groupHeader.toggleExpandGroup(group);
    }

    onDetailToggle(event) {
        console.log('Detail Toggled', event);
    }


    GetShowmemberdetails() {
        debugger;
      //  let isValid = false;
        let isValid = true;
        this.showbtnvalidation(this.paymenttype)
        if(this.checkValidations(this.InterestPaymentForm,isValid))
        { this.gridData = [];
            this.gridData.empty;
            debugger;
            let branch1 = this.InterestPaymentForm['controls']['pFdAccNo'].value;
            this.accountno = branch1;
    debugger;
            this._LienEntryService.GetShowInterestPaymentReport(this.schemeid, this.paymenttype, this.companyname, this.branchname, this.pdatecheked, this.frommonthof1, this.tomonthof1, this.type,this.accountno).subscribe(result => {
                debugger;
               // this.gridData = result;
                //this.clearInterestPayment();
                if (result != null) {
                    this.gridData = result


                    this.netPaidAmount = this.gridData.reduce((sum, item) => sum + Number(item.ptotalamount), 0).toFixed(2);

                    console.log("nettotalamount",this.netPaidAmount)

                  }
            
                  console.log("Grid data", this.gridData)
            })
    
        }
       
       

    }
    showbtnvalidation(type) {
        debugger
        //let pSchemeId = <FormGroup>this.InterestPaymentForm['controls']['pSchemeId'];
        let padjustmenttype = <FormGroup>this.InterestPaymentForm['controls']['padjustmenttype'];
        let pcompanyname = <FormGroup>this.InterestPaymentForm['controls']['pcompanyname'];
        let pbranchnamemain = <FormGroup>this.InterestPaymentForm['controls']['pbranchnamemain'];
        let pFromMonthOf = <FormGroup>this.InterestPaymentForm['controls']['pFromMonthOf'];
        let pToMonthOf = <FormGroup>this.InterestPaymentForm['controls']['pToMonthOf'];
        let ptype = <FormGroup>this.InterestPaymentForm['controls']['ptype'];


        if (type == 'SELF') {
            //pSchemeId.setValidators(Validators.required)
            padjustmenttype.setValidators(Validators.required)
            ptype.setValidators(Validators.required)
            if (this.pdatecheked == 'ASON') {
                pToMonthOf.setValidators(Validators.required)
            }
            else if (this.pdatecheked == 'BETWEEN') {
                pFromMonthOf.setValidators(Validators.required)
                pToMonthOf.setValidators(Validators.required)
            }


        }
        else if (type == 'ADJUSTMENT') {

            //pSchemeId.setValidators(Validators.required)
            padjustmenttype.setValidators(Validators.required)
            pcompanyname.setValidators(Validators.required)
            pbranchnamemain.setValidators(Validators.required)
            ptype.setValidators(Validators.required)

            if (this.pdatecheked == 'ASON') {
                pToMonthOf.setValidators(Validators.required)
            }
            else if (this.pdatecheked == 'BETWEEN') {
                pFromMonthOf.setValidators(Validators.required)
                pToMonthOf.setValidators(Validators.required)
            }

        }
        else {

            //pSchemeId.clearValidators()
            padjustmenttype.clearValidators()
            pFromMonthOf.clearValidators()
            pToMonthOf.clearValidators()
            pcompanyname.clearValidators()
            pbranchnamemain.clearValidators()
            ptype.clearValidators()


        }

        //pSchemeId.updateValueAndValidity();
        padjustmenttype.updateValueAndValidity();
        pFromMonthOf.updateValueAndValidity();
        pToMonthOf.updateValueAndValidity();
        pcompanyname.updateValueAndValidity();
        pbranchnamemain.updateValueAndValidity();
        ptype.updateValueAndValidity();


    }
    adjustmentTypeChange($event: any) {
        debugger;
        const typevalue = $event.target.value;
        this.paymenttype = $event.target.value;
        this.gridData = [];
        this.CompanyDetails = [];
        this.BranchDetails = [];
        this.AccNodetails = [];
        if (typevalue == "ADJUSTMENT") {
            this.showCompany = true;
            this.GetCompanydetails();

        }
        else if (typevalue == "SELF") {
            this.showCompany = false;
            this.GetAccnodetails();

        }
        this.clearadjustmenttypechange();
        //this.printbtnvalidation(typevalue);

    }

    clearadjustmenttypechange() {
        this.InterestPaymentForm.patchValue({
            pcompanyname: '',
            pbranchnamemain: '',
        })
        this.InterestPaymentErrors = {}
    }
    clearInterestPayment() {

        try {
            this.intrestpaymentlist = [];
            this.InterestPaymentForm.reset();
            this.InterestPaymentForm['controls']['padjustmenttype'].setValue('SELF');
            this.InterestPaymentForm['controls']['pDatetype'].setValue('ASON');
            this.InterestPaymentForm['controls']['ptype'].setValue('ALL');

            this.formValidationMessages = {};
            this.InterestPaymentErrors = {};


        } catch (e) {
            this._CommonService.showErrorMessage(e);
        }
    }
    shemename_change($event: any) {
        debugger;
        this.gridData = [];
        this.CompanyDetails = [];
        this.BranchDetails = [];
        this.AccNodetails =[];
       
        this.InterestPaymentForm['controls']['padjustmenttype'].setValue('SELF');
        if ($event.target.value > 0) {
            this.schemeid = $event.target.value;
            this.schemetype=$event.target.options[$event.target.selectedIndex].text;  
               this.InterestPaymentForm.controls.pFdAccNo.setValue("ALL");
            this.GetAccnodetails();
        }
       
        else {
            this.schemeid = 0;
           this.InterestPaymentForm.controls.pFdAccNo.setValue("ALL");
          // this.InterestPaymentForm['controls']['pFdAccNo'].setValue('ALL');
            this.formValidationMessages = {};
            this.InterestPaymentErrors = {};
        }
        
       // this.GetAccnodetails();
        this.paymenttype = 'SELF';
        this.showCompany = false;
      

    }
    branchNameChange($event: any) {
        debugger;
        this.branchname = $event.target.value;
        this.AccNodetails = [];
        this.GetAccnodetails();

    }

    public allData(): ExcelExportData {
        const result: ExcelExportData = {
          data: process(this.gridData, {
            group: this.group,
            sort: [{ field: "preceiptdate", dir: "asc" }],
          }).data,
          group: this.group,
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
                    this.InterestPaymentErrors[key] = '';
                    if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
                        let lablename;
                        lablename = (document.getElementById(key) as HTMLInputElement).title;
                        let errormessage;
                        for (const errorkey in formcontrol.errors) {
                            if (errorkey) {
                                errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                                this.InterestPaymentErrors[key] += errormessage + ' ';
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
