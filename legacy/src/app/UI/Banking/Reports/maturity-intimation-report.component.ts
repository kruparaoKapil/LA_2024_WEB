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
import { Page } from 'src/app/UI/Common/Paging/page'
import { GroupDescriptor, SortDescriptor } from '@progress/kendo-data-query';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { process } from '@progress/kendo-data-query';

@Component({
    selector: 'app-maturity-intimation-report',
    templateUrl: './maturity-intimation-report.component.html',
    styles: []
})
export class MaturityIntimationReportComponent implements OnInit {
    MaturityIntimationForm: FormGroup;
    public SchemeDetails: any = [];
    public BranchDetails: any = [];
    schemeid = 0;
    branchname = "All";
    public savebutton = 'Show';
    public today: Date = new Date();
    frommonthof: any;
    tomonthof: any;
    frommonthof1: any;
    tomonthof1: any;
    public betweenorason = "Between";
   
    gridData: any = [];
    validation = false;
    MaturityIntimationErrors: any;
    formValidationMessages: any;
    public dpFromConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
    public dpToConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
    returndata: any[];
    fromdate: any;
    todate: any;
    public group: GroupDescriptor[] = [{ field: 'pbranchname' }];
    isBold = true;
    public sort: SortDescriptor[] = [{
        field: 'pmaturitydate1',
        dir: 'desc'
      }];

    constructor(private FB: FormBuilder, private _CommonService: CommonService, private _LAReportsService: LAReportsService, private _FdReceiptService: FdReceiptService, private _LienEntryService: LienEntryService, private datepipe: DatePipe, private _AccountingTransactionsService: AccountingTransactionsService, private router: Router, private toastr: ToastrService, private exportAsService: ExportAsService) {

        this.dpFromConfig.dateInputFormat = 'DD-MMM-YYYY'
        this.dpFromConfig.maxDate = new Date();
        this.dpFromConfig.showWeekNumbers = false;

        this.dpToConfig.dateInputFormat = 'DD-MMM-YYYY'
        //this.dpToConfig.maxDate = new Date();
        //this.dpToConfig.showWeekNumbers = false;
        this.allData = this.allData.bind(this);

    }
    selectedvalues: string = ""
    allRowsSelected: boolean;
    selectedrow: any = []
    selectedrow1: any = []
    count = 0;
     
     schemetype="undefined";
    
    check: boolean = false;
    duplicatecheck: boolean;
    commencementgridPage = new Page();
    startindex: any;
    endindex: any;
    pfdaccountnumbers: string = "";
    table: any;
    selectallcheckbox: boolean
    ngOnInit() {
        this.MaturityIntimationForm = this.FB.group({

            pschemename: ['', Validators.required],
            pSchemeId: [0, Validators.required],
            pbranch: ['All', Validators.required],
            pFromMonthOf: [this.today, Validators.required],
            pToMonthOf: [this.today],
        })
         this.commencementgridPage.pageNumber = 0
        this.commencementgridPage.size = 10;
        this.startindex = 0;
        this.endindex = this.commencementgridPage.size;
        this.commencementgridPage.totalElements = 10;
        this.GetSchemedetails();
       this.GetBranchDetails();
        //  this.BlurEventAllControll(this.MaturityIntimationForm);
        this.validation = false;
        this.selectallcheckbox = true;
        this.MaturityIntimationErrors = {};
       

        this.frommonthof = new Date();
        this.tomonthof = new Date();
        this.fromdate = this.datepipe.transform(this.frommonthof, "yyyy-MM-dd");
        this.todate = this.datepipe.transform(this.tomonthof, "yyyy-MM-dd");

    }

    //Binding  MeFIMemberContactFormthods
    GetSchemedetails() {
        debugger;
        this._LAReportsService.GetMaturityscheme().subscribe(result => {
            this.SchemeDetails = result;
           
            console.log(this.SchemeDetails);
        })
        
    }
    GetBranchDetails() {
        debugger;
        this._LAReportsService.GetmaturityBranchDetails(this.schemeid).subscribe(result => {
            this.BranchDetails = result;

        })
    }
    //Change Events
    shemename_change($event: any) {
        debugger;
        this.gridData = [];
        this.schemeid = $event.target.value;
        this.schemetype= $event.target.options[$event.target.selectedIndex].text; 
        this.GetBranchDetails()  ;
    }
    branch_change($event: any) {
        debugger;
        this.gridData = [];
        this.branchname = $event.target.value;
    }
    onDetailToggle(event) {
        console.log('Detail Toggled', event);
    }
    toggleExpandGroup(group) {
        console.log('Toggled Expand Group!', group);
        this.table.groupHeader.toggleExpandGroup(group);
    }
    FromDateChange($event: any) {
        debugger;
        this.gridData = [];
        this.frommonthof = $event;
        this.fromdate = this.datepipe.transform(this.frommonthof, "yyyy-MM-dd");

        if (this.tomonthof != [] || this.tomonthof == null || this.tomonthof == '') {
            this.validatedates();
        }
    }

    ToDateChange($event: any) {
        debugger;
        this.gridData = [];
        this.tomonthof = $event;
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
    GetShowMaturitDetails() {
        debugger;
        let isValid: boolean = true;
        if (this.showbtnvalidation) {
            this.gridData = [];
            let fromDate = this.datepipe.transform(this.MaturityIntimationForm['controls']['pFromMonthOf'].value, "dd-MMM-yyyy");
            let toDate = this.datepipe.transform(this.MaturityIntimationForm['controls']['pToMonthOf'].value, "dd-MMM-yyyy");
            this.frommonthof = fromDate;
            this.tomonthof = toDate;
            this._LAReportsService.GetShowmaturityReport(this.schemeid, this.branchname, this.frommonthof, this.tomonthof).subscribe(result => {
                if (result != null) {
                    this.gridData = result;

                    this.gridData = this.gridData.map(obj => {
                        obj.pmaturitydate1 = new Date(obj.pmaturitydate) ;
                        return obj;
                      });

                      this.sort = this.sort;
        this.applySorting();
                }
                else{
                    this._CommonService.showWarningMessage('NO DATA RETRIEVED');
                }
                this.gridData.filter(function (df) { df.pIscheck = false; });
                console.log("grid data", this.gridData)
                if (this.gridData) {
                    this.selectallcheckbox = false
                }
            })
        }
    }


    public onSortChange(sort: SortDescriptor[]): void {
        debugger
        this.sort = sort;
        this.applySorting();
      }
    
      // Apply sorting logic manually
      private applySorting(): void {
        if (this.sort.length > 0) {
          const { field, dir } = this.sort[0]; // Assuming only one field is sorted
          this.gridData.sort((a, b) => {
            const fieldA = a[field];
            const fieldB = b[field];
    
            let comparison = 0;
            if (fieldA > fieldB) comparison = 1;
            if (fieldA < fieldB) comparison = -1;
    
            return dir === 'desc' ? -comparison : comparison;
          });
        }
      }


    selectAll(event, row, rowIndex) {
        debugger;
        if (event.target.checked) {
            if (this.gridData.length != 0) {
                this.allRowsSelected = true;
                this.check = true;
                this.duplicatecheck = true;
                this.gridData.filter(function (df) { df.pIscheck = true; });

                for (let i = 0; i < this.gridData.length; i++) {
                    this.selectedrow.push(this.gridData[i]);


                }
            }

            console.log("all selected rows", this.selectedrow)

        }
        else {
            this.check = false;
            this.duplicatecheck = false;
            this.gridData.filter(function (df) { df.pIscheck = false; });
            this.allRowsSelected = false;
            this.selectedrow = [];
            this.selectedvalues = ""
        }

    }

    selectrows(event, row, rowIndex) {
        debugger;
        if (event.target.checked) {
            this.selectedrow.push(row);
            this.gridData.filter(function (df) { df.pIscheck = true; });

        }
        else {
            this.selectedrow.splice(event.rowIndex, 1);
            this.allRowsSelected = false
        }
        console.log("after deleting", this.selectedrow)

    }

    GenerateReport() {

        //Saving
        let maturityintimationdata = Object.assign(this.selectedrow);
        debugger;
        let newData = ({ pmaturityintimationlist: maturityintimationdata })
        //let MaturityIntimationForm = Object.assign(this.MaturityIntimationForm.value, newData);
        let data = JSON.stringify(newData);
        this._LAReportsService.SaveMaturityIntimationReport(data).subscribe(res => {
            debugger;
            if (res) {
                debugger;
                // this.selectedrow = [];
            }

        },
            (error) => {
                this._CommonService.showErrorMessage(error);
            });

        // this.check=false;
        debugger
        this.check = null;
        this.duplicatecheck = null;
        this.duplicatecheck = false;
        // this.selectedrow = this.selectedrow.toString().replace(/@/g, "'").slice(0, -1)
        if (this.selectedrow != "") {

            for (let i = 0; i < this.selectedrow.length; i++) {
                if (this.selectedrow[i].pfdaccountno.length != 0) {
                   this.count = this.count+ 1;
                    if (this.count == this.selectedrow.length)
                    {
                        this.pfdaccountnumbers += this.selectedrow[i].pfdaccountno + "'";
                    }
                    else
                    {
                        this.pfdaccountnumbers += this.selectedrow[i].pfdaccountno + "','";
                    }
                    
                }
               
            }
            let receipt = btoa(this.pfdaccountnumbers);            
            this.gridData.filter(function (df) { df.pIscheck = false; });
            window.open('/#/MaturityIntimationPreview?id=' + receipt);
            this.allRowsSelected = false;
            this.check = false;
            // this.duplicatecheck = true;
            setTimeout(() => {
                this.duplicatecheck = false;
            }, 200);
            //this.selectedrow = "";
            //this.selectedrow = [];

        }
        else if (this.gridData.length == 0) {
            this._CommonService.showErrorMessage("Please Click on Show Button to View The Data")
        }
        else {
            this._CommonService.showErrorMessage("Please Select Atleast One Checkbox")
        }


    }





    // pdf() {
    //     debugger;
    //     let temp;
    //     let rows = [];
    //     let reportname = "Maturity Intimation Report";
    //     let gridheaders = ["Branch Name", "Member Name", "FD Account No.", "Scheme Name", "Tenure", "Deposite Amount", "Interest Rate", "Maturity Amount", "Deposit Date", "Maturity Date"];


    //     let colWidthHeight = {
    //         paccountname: { cellWidth: 'auto' }, ledger: { cellWidth: 'auto' }, popeningbal: { cellWidth: 'auto' }, pdebitamount: { cellWidth: 'auto' }, pcreditamount: { cellWidth: 'auto' }, pclosingbal: { cellWidth: 'auto' }
    //     }
    //     let gridData = "true"
    //     if (gridData == "true") {
    //         this.returndata = this._CommonService._getGroupingGridExportData(this.selectedrow, "pbranchname", false)
    //     }
    //     else {
    //         this.returndata = this.selectedrow
    //     }
    //     this.returndata.forEach(element => {

    //         let deposit;
    //         let maturity;
    //         let depositedate = element.pdepositdate;
    //         let maturitydate = element.pmaturitydate;

    //         if (depositedate !== null) {
    //             let DateFormat3 = this._CommonService.formatDateFromYYYYMMDD(depositedate);
    //             deposit = this.datepipe.transform(DateFormat3, 'dd-MM-yyyy')
    //         }
    //         else {
    //             deposit = depositedate;
    //         }
    //         if (maturitydate !== null) {
    //             let DateFormat4 = this._CommonService.formatDateFromYYYYMMDD(maturitydate);
    //             maturity = this.datepipe.transform(DateFormat4, 'dd-MM-yyyy')
    //         }
    //         else {
    //             maturity = maturitydate;
    //         }

    //         if (element.group !== undefined) {
    //             temp = [element.group, element.pmembername, element.pfdaccountno, element.pschemename, element.ptenor, element.pdepositamount, element.pinterestrate, element.pmaturityamount, deposit, maturity];
    //         }
    //         else {
    //             temp = [element.pbranchname, element.pmembername, element.pfdaccountno, element.pschemename, element.ptenor, element.pdepositamount, element.pinterestrate, element.pmaturityamount, deposit, maturity];
    //         }


    //         rows.push(temp);
    //     });
    //     // pass Type of Sheet Ex : a4 or lanscspe  
    //     this._CommonService._downloadReportsPdf(reportname, rows, gridheaders, colWidthHeight, "landscape");

    //     let maturityintimationdata = Object.assign(this.selectedrow);
    //     debugger;
    //     let newData = ({ pmaturityintimationlist: maturityintimationdata })

    //     //let MaturityIntimationForm = Object.assign(this.MaturityIntimationForm.value, newData);
    //     let data = JSON.stringify(newData);
    //     this._LAReportsService.SaveMaturityIntimationReport(data).subscribe(res => {
    //         debugger;
    //         if (res) {
    //             debugger;
    //             this.selectedrow = [];
    //         }

    //     },
    //         (error) => {
    //             this._CommonService.showErrorMessage(error);
    //         });
    // }


    showbtnvalidation() {
        debugger;
        let pSchemeId = <FormGroup>this.MaturityIntimationForm['controls']['pSchemeId'];
        let pbranch = <FormGroup>this.MaturityIntimationForm['controls']['pbranch'];
        let pFromMonthOf = <FormGroup>this.MaturityIntimationForm['controls']['pFromMonthOf'];
        let pToMonthOf = <FormGroup>this.MaturityIntimationForm['controls']['pToMonthOf'];

        pSchemeId.setValidators(Validators.required)
        pbranch.setValidators(Validators.required)
        pFromMonthOf.setValidators(Validators.required)
        pToMonthOf.setValidators(Validators.required)

        pFromMonthOf.updateValueAndValidity();
        pToMonthOf.updateValueAndValidity();
        pSchemeId.updateValueAndValidity();
        pbranch.updateValueAndValidity();

    }


    pdf() {
        debugger;
        let temp;
        let rows = [];
        let type;
        let gridheaders;
        let reportname = "Maturity Intimation Report";

        gridheaders = ["Member Name", "Advance Account No.", "Branch", "Tenure", "Advance Amount", "Interest Rate", "Maturity Amount", "Advance Date", "Maturity Date"];

        let colWidthHeight = {
            //paccountname: { cellWidth: 'auto' }, ledger: { cellWidth: 'auto' }, popeningbal: { cellWidth: 'auto' }, pdebitamount: { cellWidth: 'auto' }, pcreditamount: { cellWidth: 'auto' }, pclosingbal: { cellWidth: 'auto' }
            0: { cellWidth: 'auto' }, 1: { cellWidth: 'auto' }, 2: { cellWidth: 'auto' }, 3: { cellWidth: 'auto'  }, 4: { cellWidth: 'auto',halign: 'right' }, 5: { cellWidth: 'auto'}, 6: { cellWidth: 'auto',halign: 'right'}, 7: { cellWidth: 'auto' },8: { cellWidth: 'auto' }
        }

        let data = "true"
        if (data == "true") {
            this.returndata = this._CommonService._getGroupingGridExportData(this.gridData, "pschemename", false)
        }
        else {
            this.returndata = this.gridData
        }
        this.returndata.forEach(element => {
            let date;
            let maturitydate;
            let depositedate = element.pdepositdate;
            let maturity = element.pmaturitydate;
            date = depositedate;
            maturitydate = maturity;
            let pdepositamount = this._CommonService.currencyformat(parseFloat(element.pdepositamount).toFixed(2));
            let pinterestrate = this._CommonService.currencyformat(parseFloat(element.pinterestrate).toFixed(2));
            let pmaturityamount = this._CommonService.currencyformat(parseFloat(element.pmaturityamount).toFixed(2));
            //   let pReceivedamount = this._CommonService.currencyformat(parseFloat(element.pReceivedamount).toFixed(2));
            if (element.group !== undefined) {
                temp = [element.group, element.pmembername, element.pfdaccountno, element.pbranchname, element.ptenor, pdepositamount, pinterestrate, pmaturityamount, date, maturitydate];
            }

            else {
                temp = [element.pmembername, element.pfdaccountno, element.pbranchname, element.ptenor, pdepositamount, pinterestrate, pmaturityamount, date, maturitydate];
            }


            rows.push(temp);
        });
        // pass Type of Sheet Ex : a4 or lanscspe  
        this._CommonService._downloadReportsPdfmaturityintimation(reportname, rows, gridheaders, colWidthHeight, "landscape", this.betweenorason, this.frommonthof, this.tomonthof,this.schemetype, this.branchname,);
        let maturityintimationdata = Object.assign(this.selectedrow);
        debugger;
        let newData = ({ pmaturityintimationlist: maturityintimationdata })

        //let MaturityIntimationForm = Object.assign(this.MaturityIntimationForm.value, newData);
        let data1 = JSON.stringify(newData);
        this._LAReportsService.SaveMaturityIntimationReport(data1).subscribe(res => {
            debugger;
            if (res) {
                debugger; 
                this.selectedrow = [];
            }

        },
            (error) => {
                this._CommonService.showErrorMessage(error);
            });
    }


    // public allData(): ExcelExportData {
    //     const result: ExcelExportData = {
    //       data: process(this.gridData, { group: this.group, sort: [{ field: 'pmaturitydate', dir: 'desc' }] }).data,
    //       group: this.group
    //     };
    
    //     return result;
    //   }
    public allData(): ExcelExportData {
        
        const sortedData = this.gridData.sort((a, b) => {
            const dateA = new Date(a.pmaturitydate);
            const dateB = new Date(b.pmaturitydate);
            return dateB.getTime() - dateA.getTime();
        });
    
        
        const result: ExcelExportData = {
            data: process(sortedData, { group: this.group }).data,
            group: this.group
        };
    
        return result;
    }

    //Validations
    checkValidations(group: FormGroup, isValid: boolean): boolean {
        debugger;
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
        debugger;
        try {
            let formcontrol;
            formcontrol = formGroup.get(key);
            if (formcontrol) {
                if (formcontrol instanceof FormGroup) {
                    this.checkValidations(formcontrol, isValid)
                }
                else if (formcontrol.validator) {
                    this.MaturityIntimationErrors[key] = '';
                    if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
                        let lablename;
                        lablename = (document.getElementById(key) as HTMLInputElement).title;
                        let errormessage;
                        for (const errorkey in formcontrol.errors) {
                            if (errorkey) {
                                errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                                this.MaturityIntimationErrors[key] += errormessage + ' ';
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
        debugger;
        this._CommonService.showErrorMessage(errormsg);
    }
    showInfoMessage(errormsg: string) {
        debugger;
        this._CommonService.showInfoMessage(errormsg);
    }
    BlurEventAllControll(fromgroup: FormGroup) {
        debugger;
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
        debugger;
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
