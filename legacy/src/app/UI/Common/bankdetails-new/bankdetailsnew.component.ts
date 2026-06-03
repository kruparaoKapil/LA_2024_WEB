import { Component, OnInit, Output, Input } from '@angular/core';
import { State } from '@progress/kendo-data-query';
import { SelectableSettings } from '@progress/kendo-angular-grid';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/Services/common.service';
import { EventEmitter } from 'events';

@Component({
  selector: 'app-bankdetailsnew',
  templateUrl: './bankdetailsnew.component.html',
  styles: []
})
export class BankdetailsnewComponent implements OnInit {
  BankForm: FormGroup;
  @Output() CallParentMethod = new EventEmitter()
  @Input() showBank: any;
  showBankTitle = true;
  public mySelection: number[] = [1];
  public bankdetailslist: any = [];
  public deletedBankDetails=[];
  lstApplicantsandothers = [];
  public newList = [];
  pbanktypeTypeChk: any;
  public BankAccountName: any;
  Bankindex = 0;
  public Bankpersonname: any = '';
  public BankValidationErrors: any;
  public EditIndexid: number;
  public submitted = false;
  public checkboxOnly = false;
  public isNew: boolean;
  globalBanksList: any= [];
  buttontext = "Add";
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10
  };
  trackByFn(index, item) {
    return index; // or item.id
  }
  public selectableSettings: SelectableSettings;
  public mode = 'single';
  public Buttonlabel = "Add";
  public today = new Date();
  contactData: any;
  constructor(private formbuilder: FormBuilder,
    public Toast: ToastrService,
    private _route: ActivatedRoute,
    private _commonService: CommonService) 
    {
      this.setSelectableSettings();
     }
 

  ngOnInit()
   {
    debugger;
    this.bankdetailslist = [];
    this.deletedBankDetails=[];
    this.GetFormgroupData();
    this._commonService._GetContactData().subscribe(data => {
      this.BankForm.controls.pBankAccountname.setValue(data.pContactName);
      this.Bankpersonname = data.pContactName;

    });
    this._commonService._GetBankUpdate().subscribe(data => {
      debugger;
      if (data.length > 0) {
        let datatabledisplay2 = data.filter(function (loanname2) {
          return loanname2.pIsprimaryAccount == true;
        }

        );

        this.bankdetailslist = data;
        this.BankForm['controls']['pbanktypeTypeChk'].setValue(datatabledisplay2[0].pBankAccountNo);
      }
      //this.bankdetailslist = data;
    });
    this._commonService._GetFiTab1Data().subscribe(res => {
      if (res != null && res != undefined && res != "") {
        for (let i = 0; i < this.lstApplicantsandothers.length; i++) {
          if (this.lstApplicantsandothers[i].papplicanttype == 'Applicant') {
            break;
          }
          else {
          }
        }
      }
    })

    /*friday*/
    this.GetGlobalBanks();

    this._commonService._GetContactData().subscribe(data => {
      //console.log("data : ", data);
      debugger;
      this.contactData = data;
      if (data.pContactName) {
        this.BankForm.controls.pContactId.setValue(data.pContactId)
        // this.contactname = data.pContactName;
        // this.selectedApplicantData = { "pApplicantname": data.pContactName, "pApplicantype": data.pContacttype, "pContactreferenceid": data.pReferenceId, "pcontactid": data.pContactId }
      }
    })
  }
  GetFormgroupData() {
    this.BankValidationErrors = {}
    this.BankForm = this.formbuilder.group({
      pbanktypeTypeChk: [''],
      bankcontrols: this.addBankcontrlos(),
       pContactId: [0],

      // pRefbankId: [0],
      // pReferralId: [0],
       pBankAccountname: ['']
      // precordid: [0],
      // pBankId: [''],
      // pBankName: ['', Validators.required],
      // pBankAccountNo: ['', Validators.required],
      // pBankifscCode: [''],
      // pBankBranch: [''],
      // pIsprimaryAccount: Boolean,
      //  pCreatedby: [this._commonService.pCreatedby],
      // pStatusname: [this._commonService.pStatusname],
      // ptypeofoperation: [this._commonService.ptypeofoperation]
    });
    this.BlurEventAllControll(this.BankForm)




  }
  addBankcontrlos(): FormGroup {
    return this.formbuilder.group({
      pContactId: [0],
      precordid: [0],
      pBankId: ['', Validators.required],
      pBankName: [''],
      pBankAccountNo: ['', Validators.required],
      pipaddress: [sessionStorage.getItem("ipaddress")],
      pCreatedby: [this._commonService.pCreatedby],
      pBankifscCode: [''],
      pBankBranch: [''],
      pIsprimaryAccount: Boolean,
      ptypeofoperation: [''],
    })

  }
  GetGlobalBanks() {
    debugger;
    //this._commonService.GetGlobalBanks().subscribe(json => {
    this._commonService.GetBankNames().subscribe(json => {
      debugger;

      if (json != null) {

        this.globalBanksList = json;
       
        //let data = this.globalBanksList.filter(function (loanname2) {
        //    return loanname2.pBank == true;
        //  }

        //  );

        //this.globalBanksList = data;
        }
     
    },
      (error) => {

        this._commonService.showErrorMessage(error);
      });
  }
  //this._commonService.GetBankList().subscribe(banklist => {
  //  this.BankList = banklist;
  //})
  bankName_Change($event: any): void {

    debugger;
    this.BankForm['controls']['bankcontrols']['controls']['pBankName'].setValue($event.pBankname);
   // this.BankForm['controls']['bankcontrols']['controls']['pBankId'].setValue($event.pBankId);
    debugger;
    this.BankForm['controls']['bankcontrols']['controls']['pBankAccountNo'].setValue('');
    this.BankForm['controls']['bankcontrols']['controls']['pBankifscCode'].setValue('');
    this.BankForm['controls']['bankcontrols']['controls']['pBankBranch'].setValue('');

    this.BankValidationErrors['pBankAccountNo'] = '';

    //const bankname = $event.pBankname;
    //const pbankid = $event.pBankId;

    //if (pbankid != '')
    //  this.BankForm.controls.bankcontrols['controls'].pBankName.setValue(bankname);
    //else
    //  this.BankForm.controls.bankcontrols['controls'].pBankName.setValue('');

  }
  get f() { return this.BankForm.controls; }
  BankDeatails(index): void {

    try {


      const control = <FormGroup>this.BankForm['controls']['bankcontrols'];
      control.patchValue(this.bankdetailslist[index])
      // this.BankForm.controls.pBankName.setValue(bankname);

      this.buttontext = 'Update';
      this.Bankindex = index;
      // this.readonlyaddressdetals = true;
    }
    catch (e) {
      this.showErrorMessage(e);
    }
  }


  // editing method for edit row from bank details grid
  editBankDeatails(index): void {

    try {
      debugger;
      const control1 = <FormGroup>this.BankForm['controls']['bankcontrols'];
      control1.patchValue(this.bankdetailslist[index]);
      this.buttontext = 'Update';
      this.Bankindex = index;
    }
    catch (e) {
      this.showErrorMessage(e);
    }
  }
  // deleting method for remove row from bank details grid
  deleteBankDeatails(row,index): void {

    try {

if(row.ptypeofoperation!='CREATE'){
     let deleterow:[]=row;
     this.deletedBankDetails=[...this.deletedBankDetails,...deleterow]
     this.deletedBankDetails=this.deletedBankDetails.filter(data=>data.ptypeofoperation='DELETE')
    
    }
      this.bankdetailslist.splice(index, 1);
      this.buttontext = 'Add';
      this.Bankindex = 0;
      if (this.bankdetailslist.length >= 1) {
        this.BankForm['controls']['pbanktypeTypeChk'].setValue(this.bankdetailslist[0].pBankAccountNo);
        this.bankdetailslist[0].pIsprimaryAccount = true;
         this.bankdetailslist[0].ptypeofoperation = 'UPDATE';
      }

    }
    catch (e) {
      this.showErrorMessage(e);
    }
  }




  AddorUpdatedata() {

    debugger;

    const Bankcontrols = <FormGroup>this.BankForm['controls']['bankcontrols'];
    if (this.checkValidations(Bankcontrols)) {


      let accountnovalidate = true;
      let accountno = Bankcontrols['controls']['pBankAccountNo'].value;
      if (accountno) {
        if (this.buttontext == 'Update') {
        for (var i = 0; this.bankdetailslist.length > i; i++) {
          if (this.bankdetailslist[i].pBankAccountNo == accountno.trim() &&  i!=this.Bankindex) {
            accountnovalidate = false;
          }
        }
      }
      else{
        for (var i = 0; this.bankdetailslist.length > i; i++) {
          if (this.bankdetailslist[i].pBankAccountNo == accountno.trim()) {
            accountnovalidate = false;
          }
      }
    }
  }
      if (accountnovalidate == true) {
        debugger;
        if (this.buttontext == 'Update') {
          Bankcontrols['controls']['ptypeofoperation'].setValue('UPDATE');
          Bankcontrols['controls']['precordid'].setValue(this.bankdetailslist[this.Bankindex].precordid);
          this.bankdetailslist[this.Bankindex] = Bankcontrols.value;
          if (this.bankdetailslist.length == 1) {
            this.BankForm['controls']['pbanktypeTypeChk'].setValue(this.bankdetailslist[0].pBankAccountNo);
            this.bankdetailslist[this.Bankindex].pIsprimaryAccount == true;
          }
        }
        else {

          Bankcontrols['controls']['ptypeofoperation'].setValue('CREATE')
          if (this.bankdetailslist.length == 0) {
            debugger;
            this.BankForm['controls']['pbanktypeTypeChk'].setValue(Bankcontrols.controls.pBankAccountNo.value);
            Bankcontrols['controls']['pIsprimaryAccount'].setValue(true);
          }
          else {
            Bankcontrols['controls']['pIsprimaryAccount'].setValue(false);
          }

          Bankcontrols['controls']['pContactId'].setValue(this.contactData.pContactId)
          this.bankdetailslist.push(Bankcontrols.value);
        }
        Bankcontrols.reset();

        this.BankValidationErrors = {};
        this.buttontext = 'Add';
      }
      else {
        this._commonService.showWarningMessage("Account Number Already Exist");
        Bankcontrols['controls']['pBankAccountNo'].setValue('');
      }


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
  changePriority(event, row, rowIndex, group) {
    debugger;
    try {
      for (var i = 0; this.bankdetailslist.length > i; i++) {
        if (this.bankdetailslist[i].pBankAccountNo == row.pBankAccountNo) {
          this.bankdetailslist[i].pIsprimaryAccount = true;
        }
        else {
          this.bankdetailslist[i].pIsprimaryAccount = false;

        }
      }
    } catch (e) {
      alert(e);

    }
  }
  removeHandler($event, row, rowIndex, group) {
    this.bankdetailslist.splice(rowIndex, 1);
    if (row.pIsprimaryAccount == true) {
      if (this.bankdetailslist && this.bankdetailslist.length > 0) {
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
  checkValidations(group: FormGroup): boolean {
    let isValid = true;
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
          this.checkValidations(formcontrol)
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
  changeBankPriority(index: number) {
    debugger;
    this.BankForm['controls']['pbanktypeTypeChk'].setValue(this.bankdetailslist[index].pBankAccountNo);

    for (let i = 0; i < this.bankdetailslist.length; i++) {

      if (this.bankdetailslist[i].ptypeofoperation != 'CREATE')
        this.bankdetailslist[i].ptypeofoperation = 'UPDATE';
      if (index == i) {
        this.bankdetailslist[i].pIsprimaryAccount = true;
      }
      else {
        this.bankdetailslist[i].pIsprimaryAccount = false;
      }
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
    this.deletedBankDetails=[];
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
