import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CommonService } from 'src/app/Services/common.service';
import { LoansmasterService } from 'src/app/Services/Loans/Masters/loansmaster.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoanreceiptService } from 'src/app/Services/Loans/Transactions/loanreceipt.service';
import { LoanStatementServicesService } from 'src/app/Services/Loans/Transactions/loan-statement-services.service';
import { DefaultProfileImageService } from 'src/app/Services/Loans/Masters/default-profile-image.service';
import { LoanStatementReportComponent } from './loan-statement-report.component';
declare var $: any;
@Component({
    selector: 'app-loan-statement',
    templateUrl: './loan-statement.component.html',
    styles: []
})
export class LoanStatementComponent implements OnInit {


    public formValidationMessages: any;
    public LoanTypes: Response;
    public pLoanid: any;
    public LoanStatementForm: FormGroup
    public isLoading = false;
    public loading = false;

    public loanreceiptAppliactionId: any;
    public pApplicationid: any;
    public dynamicLoanapplicationId: any;
    public loantypeid: any;
    public pLoantype: any;
    public LoanNames: any;
    public savebutton = 'Generate Report';
    public LoanStatementData: any;

    public pName: any;
    public pFathername: any;
    public pAddress: any;
    public pMobileno: any;
    public pEmailid: any;
    public pAadharno: any;
    public pPanNo: any;
    public pLoanno: any;
    public pInstalmentamount: any;
    public pLoanamount: any;
    public pFirstinstalmentdate: any;
    public pLoantypes: any;
    public pLastinstalmentdate: any;
    public pTenure: any;
    public pLoanpayin: any;
    public pCurrentStatus: any;
    public pInterest: any;
    public pLoanclosedDate: any;
    public pDisbursedDate: any;
    public pApplicationids: any;
    public pVchapplicationid: any;
    public pLoanname: any;
    public pTitlename: any;
    public todaydate: any;
    public pTransactionListDetails: any;
    public pContactImagePath: any;
    public LoanAccountStatementView = false;
    constructor(public datePipe: DatePipe, private _commonService: CommonService, private _loanmasterservice: LoansmasterService, private formbuilder: FormBuilder, private router: Router, private _loaanreceiptServie: LoanreceiptService, private zone: NgZone, private _LoanStatementServicesService: LoanStatementServicesService, private _defaultimage: DefaultProfileImageService) {
        window['CallingFunctionOutsideSelectApplicantId' + this.dynamicLoanapplicationId] = {
            zone: this.zone,
            componentFn: (value) => this.selectedDetails(value),
            component: this,
        };
        window['CallingFunctionToHideCard' + this.dynamicLoanapplicationId] = {
            zone: this.zone,
            componentFn: () => this.HideCard(),
            component: this,
        };
    }

    ngOnInit() {
        //this.loanstatement.LoanAccountStatementView = this.LoanAccountStatementView;
        this.todaydate = new Date()
        this.formValidationMessages = {};
        this.LoanStatementForm = this.formbuilder.group({
            loanname: ['', Validators.required],
            loanapplication: ['', Validators.required]

        })
        this.BlurEventAllControll(this.LoanStatementForm)
        this.getLoanNames();
    }

    @ViewChild(LoanStatementReportComponent, { static: false }) loanstatement: LoanStatementReportComponent;

    LoanStatement() {
        this.LoanAccountStatementView = false;
        let isvalid = true;
        if (this.checkValidations(this.LoanStatementForm, isvalid)) {
            debugger;
            try {
                this.loading = true;
                this.isLoading = true;
                this.savebutton = 'Processing';
                this.LoanStatementForm.value;
                let VchapplicationID = this.LoanStatementForm['controls']['loanapplication'].value;
                this.LoanAccountStatementView = true;
                this.loanstatement.LoanAccountStatementView = this.LoanAccountStatementView;
                this.loanstatement.LoanStatement(VchapplicationID);

                this.loading = false;
                this.isLoading = false;
                this.savebutton = 'Generate Report';

            } catch (e) {
                this._commonService.showErrorMessage(e);
                this.loading = false;
                this.isLoading = false;
                this.savebutton = 'Generate Report';
            }

        }
    }


    trackByFn(index, item) {
        return index; // or item.id
    }
    getLoanNames() {
        this._loanmasterservice.getLoanNamesForLoanReceipt().subscribe((data: any) => {
            this.LoanTypes = data
            //console.log(data);
            for (let i = 0; i < data.length; i++) {
                this.pLoanid = data[i].pLoanid;
            }
        });
    }

    selectApplicantId(e) {
        debugger;
        if (e.dataItem) {
            debugger;
            var dataItem = e.dataItem;
            window['CallingFunctionOutsideSelectApplicantId' + this.dynamicLoanapplicationId].componentFn(dataItem);
        }
    }
    HideCard() {
        if (this.LoanStatementForm.controls['pVchapplicationid'].value) {
            this.LoanStatementForm.controls['pVchapplicationid'].setValue('');
            this.BlurEventAllControll(this.LoanStatementForm);
        }
    }

    selectedDetails(data) {
        debugger;
        if (data) {
            //console.log(data, "hhhhhh");
            if (this.pLoantype == data.loanTypye) {
                this.LoanStatementForm.controls.loanapplication.setValue(data.pVchapplicationid);
                this.loanreceiptAppliactionId = data.pVchapplicationid;
                this.pApplicationid = data.pApplicationid;

            }
        }
    }
    refreshloanDataForSelectApplicant() {
        this.LoanStatementForm.controls.loanapplication.setValue('');
        var multicolumncombobox: any;
        multicolumncombobox = $("#" + this.dynamicLoanapplicationId).data("kendoMultiColumnComboBox");
        if (multicolumncombobox) {
            multicolumncombobox.value("")
        }
        this.formValidationMessages.loanapplication = '';
    }
    ChangeLoanType(args) {
        debugger;
        this.LoanAccountStatementView = false;
        this.BlurEventAllControll(this.LoanStatementForm)
        if (this.LoanStatementForm.value.loanapplication) {
            this.refreshloanDataForSelectApplicant();
        }
        this.loantypeid = args.currentTarget.value;
        let loanName = args.currentTarget.value.replace(/ +/g, "");
        this.dynamicLoanapplicationId = loanName;
        //console.log("loan name", this.loantypeid);

        let str = args.target.options[args.target.selectedIndex].text
        this.pLoantype = str
        this._loaanreceiptServie.getReceiptApplicationId(this.loantypeid,'Loan Statement').subscribe(data => {
            debugger;
            this.LoanNames = [];
            // this.LoanNames = data;
            for (let index = 0; index < data.length; index++) {
                let loanTypye = {
                    'loanTypye': this.loantypeid
                }
                var dataResponse = Object.assign(loanTypye, data[index]);
                this.LoanNames.push(dataResponse);
            }

            if (this.LoanNames) {
                $("#" + loanName).kendoMultiColumnComboBox({
                    dataTextField: "pVchapplicationid",
                    height: 400,
                    columns: [
                        {
                            field: "pVchapplicationid", title: "ApplicationId", width: 150
                        },
                        { field: "pApplicantname", title: "Applicantname", width: 150 },
                        { field: "pLoanname", title: "Loan Name", width: 150 },
                    ],
                    footerTemplate: 'Total #: instance.dataSource.total() # items found',
                    filter: "contains",
                    filterFields: ["pVchapplicationid", "pApplicantname", "pLoanname"],
                    dataSource: this.LoanNames,
                    select: this.selectApplicantId,
                    // change:this.CancelClick



                });

            }


            // console.log("this.LoanNames", this.LoanNames);
            //       for (let i = 0; i < this.LoanNames.length; i++) {
            //         this.pSubledgerid = this.LoanNames[i].pAccountid;
            //         this.pContactid = this.LoanNames[i].pContactid
            // console.log( this.pSubledgerid, "this.pSubledgerid");

            //       }

        })

    }



    BlurEventAllControll(fromgroup: FormGroup) {
        try {
            Object.keys(fromgroup.controls).forEach((key: string) => {
                this.setBlurEvent(fromgroup, key);
            })
        }
        catch (e) {
            this._commonService.showErrorMessage(e);
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
            this._commonService.showErrorMessage(e);
            return false;
        }
    }

    checkValidations(group: FormGroup, isValid: boolean): boolean {
        try {
            Object.keys(group.controls).forEach((key: string) => {
                isValid = this.GetValidationByControl(group, key, isValid);
            })
        }
        catch (e) {
            this._commonService.showErrorMessage(e);
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
                    this.formValidationMessages[key] = '';
                    if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {

                        let errormessage;
                        for (const errorkey in formcontrol.errors) {
                            if (errorkey) {
                                let lablename;
                                lablename = (document.getElementById(key) as HTMLInputElement).title;
                                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                                this.formValidationMessages[key] += errormessage + ' ';
                                isValid = false;
                            }
                        }
                    }
                }
            }
        }
        catch (e) {
            this._commonService.showErrorMessage(key);
            return false;
        }
        return isValid;
    }

   
}
