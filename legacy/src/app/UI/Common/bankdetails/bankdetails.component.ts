import { Component, OnInit, ViewChild, DoCheck, NgZone, Output, EventEmitter, AfterViewInit, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { State, process } from '@progress/kendo-data-query';
import { Bankdetails } from 'src/app/Models/Loans/Masters/bankdetails';
import { SelectableSettings } from '@progress/kendo-angular-grid';
import { Toast, ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../Services/common.service';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from 'src/app/Services/Settings/employee.service';
import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { ReferralAgentMasterComponent } from 'src/app/UI/Settings/Referral-Agent/referral-agent-master.component';


@Component({
  selector: 'app-bankdetails',
  templateUrl: './bankdetails.component.html',
  styles: []
})
export class BankdetailsComponent implements OnInit {
  BankForm: FormGroup;
  @Output() CallParentMethod = new EventEmitter()
  @Input() showBank: any;

  public mySelection: number[] = [1];
  public bankdetailslist: any = [];
  lstApplicantsandothers = [];
  public newList = [];
  
  public BankAccountName: any;
  public Bankpersonname: any = '';
  public BankValidationErrors: any;
  public EditIndexid: number;
  public submitted = false;
  public checkboxOnly = false;
  public isNew: boolean;

  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10
  };
  public selectableSettings: SelectableSettings;
  public editDataItem: Bankdetails;
  public mode = 'single';
  public Buttonlabel = "Add";
  public today = new Date();


  constructor(
    private formbuilder: FormBuilder, 
    public Toast: ToastrService, 
    private _route: ActivatedRoute, 
    private _commonService: CommonService, 
    private _Employee: EmployeeService) {
    this.setSelectableSettings();
  }
  ngOnInit() {
    this.bankdetailslist = [];
    this.GetFormgroupData(); 
    this._commonService._GetContactData().subscribe(data => {  
    this.BankForm.controls.pBankAccountname.setValue(data.pContactName);
    this.Bankpersonname = data.pContactName;
      
    });
    this._commonService._GetBankUpdate().subscribe(data => {
      this.bankdetailslist = data;
    });
    this._commonService._GetFiTab1Data().subscribe(res => {     
      if (res != null && res != undefined && res != "") {
        for (let i = 0; i < this.lstApplicantsandothers.length; i++) {
          if( this.lstApplicantsandothers[i].papplicanttype == 'Applicant') {                      
            break;
          }
          else {          
          }
        }       
      }
    })
  }

  GetFormgroupData() {
    this.BankValidationErrors = {}
    this.BankForm = this.formbuilder.group({
      pRefbankId: [0],
      pReferralId: [0],
      pBankAccountname: [''],
      precordid: [0],
      pBankName: [''],
      pBankAccountNo: ['',Validators.required],
      pBankifscCode: [''],
      pBankBranch: [''],
      pIsprimaryAccount: [true],
      pCreatedby: [this._commonService.pCreatedby],
      pStatusname: [this._commonService.pStatusname],
      ptypeofoperation: [this._commonService.ptypeofoperation]
    });
    this.BlurEventAllControll(this.BankForm)
  }

  get f() { return this.BankForm.controls; }

  AddorUpdatedata() {
    debugger
    let isValid = true;
      if(this.BankForm.value.pBankAccountNo) {
        this.BankValidationErrors.pBankAccountNo = '';
        this.BlurEventAllControll(this.BankForm);
        if(this.BankForm.value.pBankName ||
          this.BankForm.value.pBankAccountNo ||
          this.BankForm.value.pBankifscCode ||
          this.BankForm.value.pBankBranch) { 
            this.submitted = true;     
            let xyz = this._commonService._GetReferralid();
            this.BankForm.controls.pReferralId.setValue(xyz);            
            let accountnovalidate = true;
            let accountno = this.BankForm.controls.pBankAccountNo.value;
            if(accountno) {
              for (var i = 0; this.bankdetailslist.length > i; i++) {
                if (this.bankdetailslist[i].pBankAccountNo == accountno) {
                  accountnovalidate = false;
                }
              }
            }
            if (accountnovalidate == true) {
              if (this.Buttonlabel == "Add") {
                if (this.Bankpersonname != '' && this.Bankpersonname != undefined) {
                  this.BankForm.controls.pBankAccountname.setValue(this.Bankpersonname)
                  this.BankForm.controls.ptypeofoperation.setValue("CREATE");
                  if (this.bankdetailslist.length > 0) {
                    this.BankForm.controls.pIsprimaryAccount.setValue(false);
                  }
                  else {
                    this.BankForm.controls.pIsprimaryAccount.setValue(true);
                  }
      
                  this.bankdetailslist.push(this.BankForm.value);
                  this.BankForm.reset();
                  this.GetFormgroupData();
                  this.BankForm.controls.pIsprimaryAccount.setValue('False');
                  this.submitted = false;
                }
                else {
                  this.CallParentMethod.emit()
                }
              }
              if (this.Buttonlabel == "Update") {      
                if (this.BankForm.controls.ptypeofoperation.value == 'OLD' || this.BankForm.controls.ptypeofoperation.value == 'UPDATE') {
                  this.BankForm.controls.ptypeofoperation.setValue("UPDATE");
                } else if (this.BankForm.controls.ptypeofoperation.value == 'CREATE') {
                  this.BankForm.controls.ptypeofoperation.setValue("CREATE");
                }
                this.bankdetailslist[this.EditIndexid] = this.BankForm.value;      
                this.BankForm.reset();
                this.GetFormgroupData();
                this.BankForm.controls.pIsprimaryAccount.setValue('False');
                this.Buttonlabel = "Add";
              }
            }
            else {
              this.Toast.warning("Account Number Already Exist");
              this.BankForm.controls.pBankAccountNo.setValue('');
            }      
            this.newList = this.bankdetailslist;
            let data = this.bankdetailslist;      
            this._commonService._SetBankData(data)
          }
      }
      else {
        this.BlurEventAllControll(this.BankForm);
        this.BankValidationErrors.pBankAccountNo = 'Account Number is required';
      }
  }

  //----------------Kendo Grid----------------------- //

  public Checkboxfn(dataItem, row) {
  let i = -1;
    this.bankdetailslist.filter(function (df) {
      i++;
      if (row == i) {
        df.pIsprimaryAccount = true;
        if (df.ptypeofoperation == 'OLD' || df.ptypeofoperation == 'UPDATE') {
          df.ptypeofoperation = "UPDATE";
        } else if (df.ptypeofoperation == 'CREATE') {
          df.ptypeofoperation = "CREATE";
        }
      }
      else {
        df.pIsprimaryAccount = false;
        if (df.ptypeofoperation == 'OLD' || df.ptypeofoperation == 'UPDATE') {
          df.ptypeofoperation = "UPDATE";
        } else if (df.ptypeofoperation == 'CREATE') {
          df.ptypeofoperation = "CREATE";
        }
      }
    })
    this.bankdetailslist = this.bankdetailslist;
    let data = this.bankdetailslist;
    this._commonService._SetBankData(data)
  }

  public setSelectableSettings(): void {
    this.selectableSettings = {
      checkboxOnly: this.checkboxOnly,
      mode: "single",
    };
  }

  public removeHandler({ dataItem }) {
    for (var n = 0; n < this.bankdetailslist.length; n++) {
      if (this.bankdetailslist[n].pBankName == dataItem.pBankName) {
        const index: number = this.bankdetailslist.indexOf(dataItem);
        if (index !== -1) {
          this.bankdetailslist.splice(index, 1);
        }
      }
    }
    if (dataItem.pIsprimaryAccount == true) {
      if(this.bankdetailslist && this.bankdetailslist.length > 0) {
        this.bankdetailslist[0].pIsprimaryAccount = true;
      }
    }
    let data = this.bankdetailslist;
    this._commonService._SetBankData(data)
  }

  public editHandler({ dataItem }) {
    
    this.Buttonlabel = "Update"
    this.BankForm.controls.pBankName.setValue(dataItem.pBankName);
    this.BankForm.controls.pBankAccountNo.setValue(dataItem.pBankAccountNo);
    this.BankForm.controls.pBankifscCode.setValue(dataItem.pBankifscCode);
    this.BankForm.controls.pBankBranch.setValue(dataItem.pBankBranch);
    this.BankForm.controls.ptypeofoperation.setValue(dataItem.ptypeofoperation);
    this.BankForm.controls.pIsprimaryAccount.setValue(dataItem.pIsprimaryAccount);
    this.BankForm.controls.pRefbankId.setValue(dataItem.pRefbankId);
    this.BankForm.controls.pReferralId.setValue(dataItem.pReferralId);
    this.BankForm.controls.pBankAccountname.setValue(dataItem.pBankAccountname);
    this.BankForm.controls.pCreatedby.setValue(this._commonService.pCreatedby);
    this.BankForm.controls.pStatusname.setValue(dataItem.pStatusname);
    this.EditIndexid = this.bankdetailslist.indexOf(dataItem);
  }
  //----------------Kendo Grid----------------------- //


  //----------------VALIDATION----------------------- //
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
          this.BankValidationErrors[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.BankValidationErrors[key] += errormessage + ' ';
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
    this._commonService.showErrorMessage(errormsg);
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
  //----------------VALIDATION----------------------- //

  clearfn() {

    this.BankForm.reset();
    this.GetFormgroupData();
  }

  getFormData(): any {
    return this.bankdetailslist;

  }
  setFormData(formData) {

    this.bankdetailslist = formData;
  }

  getDataForEmployeeUpdate(data) {
    this.bankdetailslist = data;
  }

  //---Kendo Hidden---- //

  public columns: string[] = [
    'pBankName'
  ];

  public hiddenColumns: string[] = [];

  public isHidden(columnName: string): boolean {
    return this.hiddenColumns.indexOf(columnName) > -1;
  }

  public isDisabled(columnName: string): boolean {
    return this.columns.length - this.hiddenColumns.length === 1 && !this.isHidden(columnName);
  }

  public hideColumn(columnName: string): void {
    const hiddenColumns = this.hiddenColumns;

    if (!this.isHidden(columnName)) {
      hiddenColumns.push(columnName);
    } else {
      hiddenColumns.splice(hiddenColumns.indexOf(columnName), 1);
    }
  }

  //---Kendo Hidden---- //

}
