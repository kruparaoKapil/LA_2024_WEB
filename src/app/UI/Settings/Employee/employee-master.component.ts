import { Component, ViewChild, OnInit, Output } from '@angular/core';
import { PersonalDetailsComponent } from '../../Common/personal-details/personal-details.component';
import { EmployeeService } from 'src/app/Services/Settings/employee.service';
import { EmployeeDetailsComponent } from '../../Common/employee-details/employee-details.component';
import { BankdetailsComponent } from '../../Common/bankdetails/bankdetails.component';
import { KYCDocumentsComponent } from '../../Common/kycdocuments/kycdocuments.component';
import { ContactSelectComponent } from '../../Common/contact-select/contact-select.component';
import { CommonService } from 'src/app/Services/common.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { isNullOrUndefined } from 'util';

declare let $: any
@Component({
    selector: 'app-employee-master',
    templateUrl: './employee-master.component.html',
    styles: []
})
export class EmployeeMasterComponent implements OnInit {
    @ViewChild(ContactSelectComponent, { static: false }) contactDetails: ContactSelectComponent;
    @ViewChild(KYCDocumentsComponent, { static: false }) kycDetails: KYCDocumentsComponent;
    @ViewChild(EmployeeDetailsComponent, { static: false }) employeeDetails: EmployeeDetailsComponent;
    @ViewChild(PersonalDetailsComponent, { static: false }) personalDetails: PersonalDetailsComponent;
    @ViewChild(BankdetailsComponent, { static: false }) bankDetails: BankdetailsComponent;
    personalDetailsForm: any;
    familyDetailsForm: any;
    employeeDetailsForm: any;
    bankDetailsForm: any;
    contactSelectForm: any;
    kycDocumentsForm: any;
    backbutton: any;
    savebutton: any;
    nextbutton: any;
    selectedtype: any;
    path: any;
    Title: any;
    EmployeeForm = {};
    buttonName = "Save";
    public isLoading: boolean = false;
    Employeeid: any;
    buttonStatus: any;
    dataToBind: any;
    personaldetails = {};
    public loading = false;
    Status: Boolean;
    // public disablesavebutton = false;

    constructor(private _commonService: CommonService, private router: Router, private _Employee: EmployeeService, private _route: ActivatedRoute, private toastr: ToastrService) { }

    ngOnInit() {
        debugger;
        this.Status = true;
        this.backbutton = false;
        this.savebutton = false;
        this.nextbutton = true;

        // this.personalDetails.showPersonal=true;
        this.selectedtype = "Select Employee";
        this._Employee.getTitleOnClick(this.selectedtype);

        const routeParams = this._route.snapshot.params['id'];
        if (routeParams !== undefined) {
            this.buttonName = "Update";
            this.loading = true;
            this.Employeeid = this._Employee.SendEmployeeIdForUpdate();
            this._Employee.GetDetailsForUpdate(this.Employeeid).subscribe(employeedata => {
                debugger;
               
                this.dataToBind = employeedata;
                
                this.personaldetails['presidentialstatus'] = this.dataToBind.presidentialstatus;
                this.personaldetails['pplaceofbirth'] = this.dataToBind.pplaceofbirth;
                this.personaldetails['pcountryofbirth'] = this.dataToBind.pcountryofbirth;
                this.personaldetails['pnationality'] = this.dataToBind.pnationality;
                this.personaldetails['pminoritycommunity'] = this.dataToBind.pminoritycommunity;
                this.personaldetails['pmaritalstatus'] = this.dataToBind.pmaritalstatus;
                this.personaldetails['pListFamilyDetails'] = this.dataToBind.pListFamilyDetails;
                this.personalDetails.getEmployeeDataForUpdate(this.personaldetails);
                this.kycDetails.GetDataForEmployeeUpdate(this.dataToBind.pListEmpKYC);
                this.bankDetails.getDataForEmployeeUpdate(this.dataToBind.pListEmpBankDetails);
                this.employeeDetails.GetDataForEmployeeUpdate(this.dataToBind);
                this._commonService._SetContactUpdate(this.dataToBind.pContactId);
                //this.contactDetails.updatecontact(this.dataToBind.pContactId);
                this.loading = false;
            })
        }
        this.bankDetailsForm = this._commonService._GetBankData();
        this._Employee._GetButtonShowHide().subscribe(data => {
            this.buttonShowHide("Select Employee");
        }
        )
    }

    testlinks(data, type) {
        this.buttonShowHide(type);
        let str = data
        this.path = data
        this.selectedtype = type;
        this._Employee.getTitleOnClick(this.selectedtype)
        $('.nav-item a[href="#' + str + '"]').tab('show');
    }

    ShowTitle(title) {
        this.selectedtype = title;
        this._Employee.getTitleOnClick(this.selectedtype)
        this.buttonShowHide(title);
    }

    NextTabClick() {

        this.Title = this._Employee.sendTitle()
        if (this.Title == "Select Employee") {
            this.contactDetails.Validations();

            if (this.contactDetails.validation == true) {
                let str = "kyc-Documents";
                $('.nav-item a[href="#' + str + '"]').tab('show');
                this.selectedtype = "KYC Documents";
                this._Employee.getTitleOnClick(this.selectedtype);
            }
            this.buttonShowHide(this.selectedtype);
        }
        if (this.Title == "KYC Documents") {
            let str = "employee-details";
            $('.nav-item a[href="#' + str + '"]').tab('show');
            this.selectedtype = "Employment Details";
            this._Employee.getTitleOnClick(this.selectedtype);
            this.buttonShowHide(this.selectedtype);
        }
        if (this.Title == "Employment Details") {
            this.employeeDetails.Validations();
            if (this.employeeDetails.validate == true) {
                let str = "personaldetails";
                $('.nav-item a[href="#' + str + '"]').tab('show');
                this.selectedtype = "Personal Details";
                this._Employee.getTitleOnClick(this.selectedtype);
            }
            this.buttonShowHide(this.selectedtype);
        }
        if (this.Title == "Personal Details") {
            let str = "bankdetails";
            $('.nav-item a[href="#' + str + '"]').tab('show');
            this.selectedtype = "Bank Details";
            this._Employee.getTitleOnClick(this.selectedtype);
            this.buttonShowHide(this.selectedtype);
        }
    }

    BackTabClick() {

        this.Title = this._Employee.sendTitle()
        if (this.Title == "KYC Documents") {
            let str = "selectemployee";
            $('.nav-item a[href="#' + str + '"]').tab('show');
            this.selectedtype = "Select Employee";
            this._Employee.getTitleOnClick(this.selectedtype);
            this.buttonShowHide(this.selectedtype);
        }
        if (this.Title == "Employment Details") {
            let str = "kyc-Documents";
            $('.nav-item a[href="#' + str + '"]').tab('show');
            this.selectedtype = "KYC Documents";
            this._Employee.getTitleOnClick(this.selectedtype);
            this.buttonShowHide(this.selectedtype);
        }
        if (this.Title == "Personal Details") {
            let str = "employee-details";
            $('.nav-item a[href="#' + str + '"]').tab('show');
            this.selectedtype = "Employment Details";
            this._Employee.getTitleOnClick(this.selectedtype);
            this.buttonShowHide(this.selectedtype);
        }
        if (this.Title == "Bank Details") {
            let str = "personaldetails";
            $('.nav-item a[href="#' + str + '"]').tab('show');
            this.selectedtype = "Personal Details";
            this._Employee.getTitleOnClick(this.selectedtype);
            this.buttonShowHide(this.selectedtype);
        }
    }

    buttonShowHide(title) {
        if (title == "Select Employee") {
            this.backbutton = false;
            this.savebutton = false;
            this.nextbutton = true;
        }
        if (title == "KYC Documents") {
            this.backbutton = true;
            this.savebutton = false;
            this.nextbutton = true;
        }
        if (title == "Employment Details") {
            this.backbutton = true;
            this.savebutton = false;
            this.nextbutton = true;
        }
        if (title == "Personal Details") {
            this.backbutton = true;
            this.savebutton = false;
            this.nextbutton = true;
        }
        if (title == "Bank Details") {
            this.backbutton = true;
            this.savebutton = true;
            this.nextbutton = false;
        }
    }

    Clear() {
        debugger;
        this.Title = this._Employee.sendTitle();
        if (this.buttonName == "Update") {
           
            this.router.navigate(['/EmployeeMaster'])
        }
        else {
            if (this.Title == "Select Employee") {
                this.router.navigate(['/EmployeeMaster']);
                this.contactDetails.refreshContactSelectComponent();
                this.contactDetails.ShowImageCard = false;
                this.kycDetails.ngOnInit();
                this.employeeDetails.Clear();
                this.personalDetails.Clear();
                this.bankDetails.clearfn();
            }
            if (this.Title == "KYC Documents") {
                this.kycDetails.clearfn();
            }
            else if (this.Title == "Employment Details") {
                this.employeeDetails.Clear();
            }
            else if (this.Title == "Personal Details") {
                this.personalDetails.Clear();
            }
            else if (this.Title == "Bank Details") {
                this.bankDetails.clearfn();
            }
        }
    }

    SaveEmployeeForm() {
        debugger

        this.kycDocumentsForm = this.kycDetails.gridData;
        this.employeeDetailsForm = this.employeeDetails.EmployeeDetailsForm.value;
        this.personalDetailsForm = this.personalDetails.sendFormData();
        this.familyDetailsForm = this._Employee.sendFamilyDetailsForm();
        this.contactSelectForm = this.contactDetails.DisplayCardData;
        //this.bankDetailsForm = this.bankDetails.getFormData();
        if (this.contactSelectForm == undefined || this.contactSelectForm == "") {
            let str = "selectemployee";
            $('.nav-item a[href="#' + str + '"]').tab('show');
            this.selectedtype = "Select Employee";
            this._Employee.getTitleOnClick(this.selectedtype);
            this.buttonShowHide(this.selectedtype);
            this.contactDetails.Validations();
            this.buttonName = "Save";
            this.isLoading = false;

        }
        else {
            if (this.buttonName == "Save") {
                this.buttonName = "Processing";
                this.isLoading = true;
                this.EmployeeForm['createdby'] = 0;
                this.EmployeeForm['pStatusname'] = "Active";
                this.EmployeeForm['pMainTransactionType'] = "Create";
                this.EmployeeForm['precordid'] = 0;
                this.EmployeeForm['pCreatedby'] = this._commonService.pCreatedby;
                /*select contact*/
                this.EmployeeForm['pContactName'] = this.contactSelectForm.pContactName;
                this.EmployeeForm['pContactId'] = this.contactSelectForm.pContactId;
                this.EmployeeForm['pEmployeeId'] = 0;
                this.EmployeeForm['pEmployeeName'] = this.contactSelectForm.pContactName;
                if (this.contactSelectForm.pEmployeeSurName == null) {
                    this.EmployeeForm['pEmployeeSurName'] = "";
                }
                else {
                    this.EmployeeForm['pEmployeeSurName'] = this.contactSelectForm.pEmployeeSurName;
                }
                this.EmployeeForm['pEmployeeTitleName'] = this.contactSelectForm.pTitleName;
                this.EmployeeForm['pEmployeeContactNo'] = this.contactSelectForm.pBusinessEntitycontactNo;
                this.EmployeeForm['pEmployeeContactEmail'] = this.contactSelectForm.pBusinessEntityEmailId;
                this.EmployeeForm['pContactRefNo'] = this.contactSelectForm.pReferenceId;
                /*kyc details*/
                this.EmployeeForm['pListEmpKYC'] = this.kycDocumentsForm;
                for (let k = 0; k < this.EmployeeForm['pListEmpKYC'].length; k++) {
                    this.EmployeeForm['pListEmpKYC'][k].pContactId = this.contactSelectForm.pContactId;
                }
                /*employement details*/
                this.EmployeeForm['pEmploymentBasicSalary'] = this.employeeDetailsForm.pEmploymentBasicSalary;
                this.EmployeeForm['pEmploymentAllowanceORvda'] = this.employeeDetailsForm.pEmploymentAllowanceORvda;
                this.EmployeeForm['pEmploymentDesignation'] = this.employeeDetailsForm.pEmploymentDesignation;
                if (isNullOrUndefined(this.employeeDetailsForm.pEmploymentRoleId) || this.employeeDetailsForm.pEmploymentRoleId == "") {
                    this.EmployeeForm['pEmploymentRoleId'] = 0;
                }
                else {
                    this.EmployeeForm['pEmploymentRoleId'] = this.employeeDetailsForm.pEmploymentRoleId;
                }

                this.EmployeeForm['pEmploymentRoleName'] = this.employeeDetailsForm.pEmploymentRoleName;
                this.EmployeeForm['pEmploymentJoiningDate'] = this.employeeDetailsForm.pEmploymentJoiningDate;
                this.EmployeeForm['pEmploymentCTC'] = this.employeeDetailsForm.pEmploymentCTC;
                /*personal details*/
                this.EmployeeForm['pListFamilyDetails'] = this.familyDetailsForm;
                this.EmployeeForm['presidentialstatus'] = this.personalDetailsForm.presidentialstatus;
                this.EmployeeForm['pmaritalstatus'] = this.personalDetailsForm.pmaritalstatus;
                this.EmployeeForm['pplaceofbirth'] = this.personalDetailsForm.pplaceofbirth;
                this.EmployeeForm['pcountryofbirth'] = this.personalDetailsForm.pcountryofbirth;
                this.EmployeeForm['pnationality'] = this.personalDetailsForm.pnationality;
                this.EmployeeForm['pminoritycommunity'] = this.personalDetailsForm.pminoritycommunity;
                /*bank details*/
                this.EmployeeForm['pListEmpBankDetails'] = this.bankDetails.bankdetailslist;

                let formData = JSON.stringify(this.EmployeeForm);
                this._Employee.CheckDuplicates(formData).subscribe(value => {


                    if (value) {
                        this.toastr.info("Already Exists", 'Info');
                        this.buttonName = "Save";
                        this.isLoading = false;
                    }
                    else {
                        this._Employee.SaveEmployeeForm(formData).subscribe(data => {

                            if (data) {
                                this.buttonName = "Save";
                                this.isLoading = false;
                                this.toastr.success("Saved Successfully", 'Success');
                                this.router.navigate(['/EmployeeView']);

                            }

                        }, error => {
                            this.toastr.error(error, 'Error');
                            this.buttonName = "Save";
                            this.isLoading = false;
                        })
                    }
                }, error => {
                    this.toastr.error(error, 'Error');
                    this.buttonName = "Save";
                    this.isLoading = false;
                })


            }
        }
        if (this.buttonName == "Update") {
            this.buttonName = "Processing";
            this.isLoading = true;
            this.EmployeeForm['createdby'] = this.dataToBind.createdby;
            this.EmployeeForm['pStatusname'] = "Active";
            this.EmployeeForm['pMainTransactionType'] = "Update";
            this.EmployeeForm['precordid'] = this.dataToBind.pEmployeeId;
            this.EmployeeForm['pCreatedby'] = this._commonService.pCreatedby;
            /*select contact*/
            this.EmployeeForm['pContactName'] = this.dataToBind.pContactName;
            this.EmployeeForm['pContactId'] = this.dataToBind.pContactId;
            this.EmployeeForm['pEmployeeId'] = this.dataToBind.pEmployeeId;
            this.EmployeeForm['pEmployeeName'] = this.dataToBind.pEmployeeName;
            if (this.dataToBind.pEmployeeSurName == null) {
                this.EmployeeForm['pEmployeeSurName'] = "";
            }
            else {
                this.EmployeeForm['pEmployeeSurName'] = this.dataToBind.pEmployeeSurName;
            }
            this.EmployeeForm['pEmployeeTitleName'] = this.dataToBind.pEmployeeTitleName;
            this.EmployeeForm['pEmployeeContactNo'] = this.dataToBind.pEmployeeContactNo;
            this.EmployeeForm['pEmployeeContactEmail'] = this.dataToBind.pEmployeeContactEmail;
            this.EmployeeForm['pContactRefNo'] = this.dataToBind.pContactRefNo;
            /*kyc details*/
            this.EmployeeForm['pListEmpKYC'] = this.kycDocumentsForm;
            for (let k = 0; k < this.EmployeeForm['pListEmpKYC'].length; k++) {
                this.EmployeeForm['pListEmpKYC'][k].pContactId = this.dataToBind.pContactId;

            }
            /*employement details*/
            this.EmployeeForm['pEmploymentBasicSalary'] = this.employeeDetailsForm.pEmploymentBasicSalary;
            this.EmployeeForm['pEmploymentAllowanceORvda'] = this.employeeDetailsForm.pEmploymentAllowanceORvda;
            this.EmployeeForm['pEmploymentDesignation'] = this.employeeDetailsForm.pEmploymentDesignation;
            if (this.employeeDetailsForm.pEmploymentRoleId == "") {
                this.EmployeeForm['pEmploymentRoleId'] = 0;
            }
            else {
                this.EmployeeForm['pEmploymentRoleId'] = this.employeeDetailsForm.pEmploymentRoleId;
            }
            this.EmployeeForm['pEmploymentRoleName'] = this.employeeDetailsForm.pEmploymentRoleName;
            this.EmployeeForm['pEmploymentJoiningDate'] = this.employeeDetailsForm.pEmploymentJoiningDate;


            this.EmployeeForm['pEmploymentCTC'] = this.employeeDetailsForm.pEmploymentCTC;
            /*personal details*/
            this.EmployeeForm['pListFamilyDetails'] = this.familyDetailsForm;
            this.EmployeeForm['presidentialstatus'] = this.personalDetailsForm.presidentialstatus;
            this.EmployeeForm['pmaritalstatus'] = this.personalDetailsForm.pmaritalstatus;
            this.EmployeeForm['pplaceofbirth'] = this.personalDetailsForm.pplaceofbirth;
            this.EmployeeForm['pcountryofbirth'] = this.personalDetailsForm.pcountryofbirth;
            this.EmployeeForm['pnationality'] = this.personalDetailsForm.pnationality;
            this.EmployeeForm['pminoritycommunity'] = this.personalDetailsForm.pminoritycommunity;
            /*bank details*/
            this.EmployeeForm['pListEmpBankDetails'] = this.bankDetails.getFormData();
            let updatedform = JSON.stringify(this.EmployeeForm);
            //console.log(updatedform)
            this._Employee.UpdateEmployeeForm(updatedform).subscribe(data => {

                if (data) {
                    this.toastr.success("Updated Successfully", 'Success');
                    this.router.navigate(['/EmployeeView']);
                    this.contactDetails.refreshContactSelectComponent();
                    this.kycDetails.clearfn();
                    this.employeeDetails.Clear();
                    this.personalDetails.Clear();
                    this.bankDetails.clearfn();
                }
                this.buttonName = "Save";
                this.isLoading = false;
            }, error => {
                this.toastr.error(error, 'Error');
                this.buttonName = "Update";
                this.isLoading = false;
            })

        }
    }


    GetContactPersonData(event) {
        debugger
        this._commonService.GetContactDetailsforKYC(event.pContactId).subscribe(data => {
            this._commonService._SetKYCUpdate(data);
        })
        this._commonService._SetContactData(event);

    }
    showInfoMessage(errormsg: string) {
        this.toastr.success(errormsg);
    }
    showErrorMessage(errormsg: string) {
        this.toastr.error(errormsg);
    }
}
