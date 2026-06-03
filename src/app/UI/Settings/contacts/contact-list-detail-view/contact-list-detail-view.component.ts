import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ContacmasterService } from '../../../../Services/Loans/Masters/contacmaster.service'
import { timingSafeEqual } from 'crypto';
import { DefaultProfileImageService } from '../../../../Services/Loans/Masters/default-profile-image.service';
import { State, GroupDescriptor, DataResult, process } from '@progress/kendo-data-query';

import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { DataBindingDirective, SelectableSettings } from '@progress/kendo-angular-grid';
import { CommonService } from '../../../../Services/common.service';
import { LoanStatementReportComponent } from '../../../Loans/Reports/loan-statement/loan-statement-report.component';
import { ContactListPartyComponent } from '../contact-list-party/contact-list-party.component';
import { isNullOrUndefined } from 'util';
declare let $: any
@Component({
    selector: 'app-contact-list-detail-view',
    templateUrl: './contact-list-detail-view.component.html',
    styles: []
})
export class ContactListDetailViewComponent implements OnInit {
    public loading = false;
    ContactTotalData: any
    contactRefId: any;
    CardsShowOrHide: Boolean
    CardLoanDetailsShowOrHide: Boolean
    Loandetails: any

    AppLoanCounts: any
    AppGuarantorCount: any
    AppCoAppCount: any

    PartyStatus: any
    ReferralStatus: any
    AdvacateStatus: any
    EmployeeStatus: any

    BankDetails: any;
    KYCIdentificationDetails: any;
    ContactPersonalInfo: any

    personaldetailslist: any;
    nomineedetailslist: any;
    showrefferal = false;
    showloans = true;
    showemployee = false;
    showadvacate = false;
    showparty = false;

    applicantdetailslist: any = [];
    gurantordetailslist: any = [];
    coapplicantdetailslist: any = [];
    partydetailslist: any = [];
    referraldetails: any ;
    referralloansdetailslist: any = [];
    advacatedetailslist: any = [];
    employeedetailslist: any;
    cicdetailslist: any
    reportheadername = '';

    ContactPersonTransactionDetails: any
    transactiondate: any;
    public LoansData: any = [];

    public mySelection: string[] = [];
    public gridView: any = [];
    public headerCells: any = {
        textAlign: 'center'
    };
    public groups: GroupDescriptor[] = [{ field: 'preceiptdate', dir: 'desc' }];
    @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
    @ViewChild(LoanStatementReportComponent, { static: false }) loanstatement: LoanStatementReportComponent;
    @ViewChild(ContactListPartyComponent, { static: false }) contactlistpartycomponent: ContactListPartyComponent;

    // public pageSize = 10;
    // public skip = 0;
    // private data: Object[];
    // public gridState: State = {
    //   sort: [],
    //   skip: 0,
    //   take: 10
    // };

    public selectableSettings: SelectableSettings;

    constructor(private _CommonService: CommonService, private _ContacmasterService: ContacmasterService, private activatedroute: ActivatedRoute, private _defaultimage: DefaultProfileImageService) { }

    ngOnInit() {

        this.transactiondate = this._CommonService.getFormatDate(new Date())
        $("#sidebarCollapse").click(function () {
            $("#contact-list").toggleClass("active");
            $("img.expand").toggleClass("expand2");
            $(".contact-wrapper").toggleClass("t1");
        });

        this.contactRefId = atob(this.activatedroute.snapshot.params['id']);
        this.loading = true;

        this._ContacmasterService.GetContactListPersonDetails(this.contactRefId).subscribe(result => {
            debugger;
            try {
                this.ContactTotalData = result

                this.KYCIdentificationDetails = this.ContactTotalData["lstKycDocDTO"];
                this.BankDetails = this.ContactTotalData["lstContactBankDetaisDTO"];
                this.ContactPersonalInfo = this.ContactTotalData["contactViewDTO"];

                this.personaldetailslist = this.ContactTotalData["contactpersonaldetailslist"];
                this.nomineedetailslist = this.ContactTotalData["contactnomineedetailslist"];

                if (this.ContactPersonalInfo['pImage'] != "" && this.ContactPersonalInfo['pImage'] != null) {
                    this.ContactPersonalInfo['pImage'] = "data:image/png;base64," + this.ContactPersonalInfo['pImage'][0];
                } else {
                    this.ContactPersonalInfo['pImage'] = this._defaultimage.GetdefaultImage()
                }
                this.AppLoanCounts = this.ContactTotalData['pLoansCount'];
                this.AppGuarantorCount = this.ContactTotalData['pGuratorCount'];
                this.AppCoAppCount = this.ContactTotalData['pCoApplicantCount'];

                this.PartyStatus = this.ContactTotalData['pPartyStatus'];
                this.ReferralStatus = this.ContactTotalData['pReferralStatus'];
                this.AdvacateStatus = this.ContactTotalData['pAdvacateStatus'];
                this.EmployeeStatus = this.ContactTotalData['pEmployeeStatus'];
                this.cicdetailslist = this.ContactTotalData['cicdetailslist'];
                this.applicantdetailslist = this.ContactTotalData['applicantdetailslist'];
                //this.gurantordetailslist = this.ContactTotalData['gurantordetailslist'];
                //this.coapplicantdetailslist = this.ContactTotalData['coapplicantdetailslist'];

                //this.partydetailslist = this.ContactTotalData['partydetailslist'];
                //this.referraldetails = this.ContactTotalData['referraldetails'];
                //this.referralloansdetailslist = this.ContactTotalData['referralloansdetailslist'];

                //this.advacatedetailslist = this.ContactTotalData['advacatedetailslist'];
                //this.employeedetailslist = this.ContactTotalData['employeedetailslist'];

                this.LoansClick('APPLICANT')
            } catch (e) {
                this._CommonService.showErrorMessage(e);
            }

            this.loading = false;
        },
            (error) => {

                this._CommonService.showErrorMessage(error);
            })
    }

    public onFilter(inputValue: string): void {
        debugger;
        this.LoansData = process(this.gridView, {
            filter: {
                logic: "or",
                filters: [
                    {
                        field: 'pLoantype',
                        operator: 'contains',
                        value: inputValue
                    },
                    {
                        field: 'pLoanname',
                        operator: 'contains',
                        value: inputValue
                    },
                    {
                        field: 'pAmountrequested',
                        operator: 'contains',
                        value: inputValue
                    },
                    {
                        field: 'pInstalmentamount',
                        operator: 'contains',
                        value: inputValue
                    },
                    {
                        field: 'pTenureofloan',
                        operator: 'contains',
                        value: inputValue
                    },
                    {
                        field: 'pLoanpayin',
                        operator: 'contains',
                        value: inputValue
                    },
                    {
                        field: 'pNextEmiDate',
                        operator: 'contains',
                        value: inputValue
                    },
                    {
                        field: 'ploancloseddate',
                        operator: 'contains',
                        value: inputValue
                    }
                ],
            }
        }).data;

        this.dataBinding.skip = 0;
    }
    public value: any = [{ text: "pLoantype", value: 2 }];
    public isItemSelected(itemText: string): boolean {
        return this.value.some(item => item.text === itemText);
    }

    //public columns: any = [
    //    { text: "preceiptdate", value: 1 },
    //    { text: "preceiptid", value: 2 },
    //    { text: "pmodofreceipt", value: 3 },
    //    { text: "pbankname", value: 4 },
    //    { text: "pChequenumber", value: 5 },
    //    { text: "pnarration", value: 4 },
    //    { text: "ptotalreceivedamount", value: 5 }
    //];
    trackByFn(index, item) {
        return index; // or item.id
    }


    LoansClick(data) {
        debugger;

        this.LoansData = [];
        this.gridView = [];
        this.showloans = false;
        this.showrefferal = false;

        this.showemployee = false;
        this.showadvacate = false;
        this.showparty = false;
        this.contactlistpartycomponent.showreport = false;

        this.reportheadername = '';
        if (data == 'APPLICANT') {

           
            this.showloans = true;
            this.reportheadername = 'Applicant Loans';

            if (this.AppLoanCounts > 0 && this.applicantdetailslist.length == 0) {
                this.loading = true;
                this._ContacmasterService.GetContactDataDetails('APPLICANT', this.contactRefId).subscribe(result => {
                    debugger;
                    try {
                        this.applicantdetailslist = result['applicantdetailslist'];
                        this.LoansData = this.applicantdetailslist;
                        this.gridView = this.applicantdetailslist;
                    } catch (e) {
                        this._CommonService.showErrorMessage(e);
                    }

                    this.loading = false;
                },
                    (error) => {
                        this.loading = false;
                        this._CommonService.showErrorMessage(error);
                    })
            }
            else {
                this.LoansData = this.applicantdetailslist;
                this.gridView = this.applicantdetailslist;
            }
        }
        else if (data == 'GUARANTOR') {

            this.showloans = true;
            this.reportheadername = 'Guarantor Loans';
            if (this.AppGuarantorCount > 0 && this.gurantordetailslist.length == 0) {
                this.loading = true;
                this._ContacmasterService.GetContactDataDetails('APPLICANT', this.contactRefId).subscribe(result => {
                    debugger;
                    try {
                        this.gurantordetailslist = result['gurantordetailslist'];
                        this.LoansData = this.gurantordetailslist;
                        this.gridView = this.gurantordetailslist;
                    } catch (e) {
                        this._CommonService.showErrorMessage(e);
                    }

                    this.loading = false;
                },
                    (error) => {
                        this.loading = false;
                        this._CommonService.showErrorMessage(error);
                    })
            }
            else {
                this.LoansData = this.gurantordetailslist;
                this.gridView = this.gurantordetailslist;
            }
        }
        else if (data == 'COAPPLICANT') {

            this.showloans = true;
            this.reportheadername = 'Co-applicant Loans';
            if (this.AppCoAppCount > 0 && this.coapplicantdetailslist.length == 0) {
                this.loading = true;
                this._ContacmasterService.GetContactDataDetails('COAPPLICANT', this.contactRefId).subscribe(result => {
                    debugger;
                    try {
                        this.coapplicantdetailslist = result['coapplicantdetailslist'];
                        this.LoansData = this.coapplicantdetailslist;
                        this.gridView = this.coapplicantdetailslist;
                    } catch (e) {
                        this._CommonService.showErrorMessage(e);
                    }

                    this.loading = false;
                },
                    (error) => {
                        this.loading = false;
                        this._CommonService.showErrorMessage(error);
                    })
            }
            else {
                this.LoansData = this.coapplicantdetailslist;
                this.gridView = this.coapplicantdetailslist;
            }
        }
        else if (data == 'PARTY') {
            debugger;
            this.showparty = true;
            if (this.partydetailslist.length == 0) {
                this.loading = true;
                this._ContacmasterService.GetContactDataDetails('PARTY', this.contactRefId).subscribe(result => {
                    debugger;
                    try {

                        this.partydetailslist = result['partydetailslist'];
                        this.contactlistpartycomponent.showreport = true;
                        this.contactlistpartycomponent.loadData(this.ContactPersonalInfo.pRefNo, this.ContactPersonalInfo.pContactName, this.partydetailslist);

                    } catch (e) {
                        this._CommonService.showErrorMessage(e);
                    }

                    this.loading = false;
                },
                    (error) => {
                        this.loading = false;
                        this._CommonService.showErrorMessage(error);
                    })
            }
            else {
                this.contactlistpartycomponent.showreport = true;
                this.contactlistpartycomponent.loadData(this.ContactPersonalInfo.pRefNo, this.ContactPersonalInfo.pContactName, this.partydetailslist);
            }
        }
        else if (data == 'REFERRAL') {
            this.showrefferal = true;

            if (this.ReferralStatus == 'YES' && isNullOrUndefined(this.referraldetails)) {
                this.loading = true;
                this._ContacmasterService.GetContactDataDetails('REFERRAL', this.contactRefId).subscribe(result => {
                    debugger;
                    try {
                        this.referraldetails = result['referraldetails'];
                        this.referralloansdetailslist = result['referralloansdetailslist'];

                    } catch (e) {

                        this._CommonService.showErrorMessage(e);
                    }

                    this.loading = false;
                },
                    (error) => {
                        this.loading = false;
                        this._CommonService.showErrorMessage(error);
                    })
            }
        }
        else if (data == 'EMPLOYEE') {

            this.showemployee = true;

            if (this.EmployeeStatus == 'YES' && isNullOrUndefined( this.employeedetailslist)) {
                this.loading = true;
                this._ContacmasterService.GetContactDataDetails('EMPLOYEE', this.contactRefId).subscribe(result => {
                    debugger;
                    try {
                        this.employeedetailslist = result['employeedetailslist'];
                    } catch (e) {
                        this._CommonService.showErrorMessage(e);
                    }

                    this.loading = false;
                },
                    (error) => {
                        this.loading = false;
                        this._CommonService.showErrorMessage(error);
                    })
            }


        }
        else if (data == 'ADVOCATE') {
            this.showadvacate = true;

            if (this.AdvacateStatus == 'YES' && this.advacatedetailslist.length == 0) {
                this.loading = true;
                this._ContacmasterService.GetContactDataDetails('ADVOCATE', this.contactRefId).subscribe(result => {
                    debugger;
                    try {
                        this.advacatedetailslist = result['advacatedetailslist'];
                    } catch (e) {
                        this._CommonService.showErrorMessage(e);
                    }

                    this.loading = false;
                },
                    (error) => {
                        this.loading = false;
                        this._CommonService.showErrorMessage(error);
                    })
            }
        }
        this.loanstatement.LoanAccountStatementView = false;

    }

    ReferralClick(data) {
        debugger;

        this.LoansData = [];
        this.gridView = [];
        this.showloans = false;

        this.reportheadername = '';
        if (data == 'LOANS') {
            this.LoansData = this.referralloansdetailslist;
            this.gridView = this.referralloansdetailslist;
            this.showloans = true;
            this.reportheadername = 'Referral Loans';
        }
        else if (data == 'FD') {

        }
        else if (data == 'RD') {

        }
        else if (data == 'SD') {
        }

        this.loanstatement.LoanAccountStatementView = false;
    }
    public removeHandler({ dataItem }) {
        debugger;
        this.loanstatement.LoanAccountStatementView = true;
        this.loanstatement.LoanStatement(dataItem.pVchapplicationid);
    }

    getData(index) {
        return this.cicdetailslist[index].pcicscorepercentage + '%';
    }
}
