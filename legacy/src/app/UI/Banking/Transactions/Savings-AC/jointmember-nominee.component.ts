import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { SavingtranscationService } from 'src/app/Services/Banking/savingtranscation.service';
import { MemberService } from '../../../../Services/Banking/member.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { State } from '@progress/kendo-data-query';
import { FiPersonaldetailsNomineeComponent } from '../../../Loans/Transactions/FIIndividual/PersonalDetails/fi-personaldetails-nominee.component';
import { log } from 'util';
declare let $: any
@Component({
  selector: 'app-jointmember-nominee',
  templateUrl: './jointmember-nominee.component.html',
  styles: []
})
export class JointmemberNomineeComponent implements OnInit {
@ViewChild(FiPersonaldetailsNomineeComponent, { static: false }) nomineeDetails: FiPersonaldetailsNomineeComponent;

  JointMemberAndNomineeForm: any;
  JointMemberErrorMessages: any;
  MemberDetailsListAll: any
  SavingAccountid: any;
  ContactDetails: any;
  buttontype: any;
  newlist: any;

  Jointmembergrid: any = [];

  ShowJointmembers: boolean = false;
  NomineeStatus: boolean = false;
  public loading = false;
  showNominee = false;
  

  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10
  };
  constructor(private _MemberService: MemberService, private toastr: ToastrService, private router: Router, private savingtranscationservice: SavingtranscationService,
    private _commonService: CommonService, private _fb: FormBuilder) { }
  ngDoCheck() {
    //
   
    this.buttontype = this.savingtranscationservice.GetButtonClickType()
    if (this.buttontype == "Edit" && this.NomineeStatus) {
      let EditData = this.savingtranscationservice.GetSavingTransactionDetailsForEdit();
      let Nomineelist = EditData[0].applicationPersonalNomineelist;
      if (this.nomineeDetails) {
      this.JointMemberAndNomineeForm.controls.pIsnomineeapplicable.setValue(Nomineelist.length > 0 ? true : false);
        this.showNominee = Nomineelist.length > 0 ? true : false;
        this.nomineeDetails.nomineeList = Nomineelist;
      }
      
    }

  }
  ngOnInit() {
    debugger;
  
    this.JointMemberErrorMessages = {}
    this.FormGroup();
    this.GetMembers();
    this.buttontype = this.savingtranscationservice.GetButtonClickType()
  
    if (this.buttontype == "Edit") {
      
      this.BindData()

    }
   
  }
  FormGroup() {
    this.JointMemberAndNomineeForm = this._fb.group
      ({
        pRecordid:[0],
        pSavingaccountid: [''],
        pSavingaccountno: [''],
        pMemberid: [null, [Validators.required]],
        pMembercode: [''],
        pMembername: [''],
        pContactid: [null],
        pContacttype: [''],
        pContactno:[''],
        pContactreferenceid: [null],
        pIsjointapplicable: [false],
        pIsnomineeapplicable: [false],
        ptypeofoperation: ['CREATE'],
        pCreatedby: [this._commonService.pCreatedby],

      })
  }
  GetMembers() {
    this._MemberService.GeFIMemberDetailsList().subscribe(result => {
      debugger
      
      this.MemberDetailsListAll = result
     
    })
  }
  MemberChange(event) {
    debugger;
    if (event != undefined && event != "" && event != null) {
      
        this.JointMemberAndNomineeForm.controls.pMembercode.setValue(event.pMemberReferenceId);
        this.JointMemberAndNomineeForm.controls.pMembername.setValue(event.pContactName);
        this.GetContactDetails(event.pMembertypeId)
      
     

    }

  }
  
  GetContactDetails(MemberID) {
    debugger
    if (MemberID && MemberID != undefined && MemberID != '') {
      this.savingtranscationservice.GetContactDetails(MemberID).subscribe(json => {
        debugger
        this.ContactDetails = json
        this.JointMemberAndNomineeForm.controls.pContactid.setValue(this.ContactDetails.pContactid);
        this.JointMemberAndNomineeForm.controls.pContacttype.setValue(this.ContactDetails.pContacttype);
        this.JointMemberAndNomineeForm.controls.pContactreferenceid.setValue(this.ContactDetails.pContactreferenceid);
        this.JointMemberAndNomineeForm.controls.pContactno.setValue(this.ContactDetails.pContactno);  
      })
    }

  }
  AddJointMembers() {
    debugger;
    let isValid: boolean = true;
    if (this.checkValidations(this.JointMemberAndNomineeForm, isValid)) {
      let data = this.savingtranscationservice.GetAccountNoAndId();
      
      this.JointMemberAndNomineeForm.controls.pSavingaccountid.setValue(data.pSavingaccountid);
      this.JointMemberAndNomineeForm.controls.pSavingaccountno.setValue(data.pSavingaccountno);
      let membeid = this.JointMemberAndNomineeForm.controls.pMemberid.value;
      const Checkexistcount = this.Jointmembergrid.filter(s => s.pMemberid == membeid).length;
      if (Checkexistcount == 0) {

        data = this.JointMemberAndNomineeForm.value;
        this.Jointmembergrid.push(data);
        this.FormGroup();
        this.JointMemberAndNomineeForm.controls.pIsjointapplicable.setValue(true);  
      }
      else {
        this._commonService.showWarningMessage("Member already exists in grid.")
      }
     
    }
  }
  JointMemberchange() {
    let IsJointmember = this.JointMemberAndNomineeForm.controls.pIsjointapplicable.value;
    if (IsJointmember) {
      this.ShowJointmembers = true
    }
    else {
      this.ShowJointmembers = false
      this.FormGroup();
      this.Jointmembergrid = [];
    }
  }
  Nomineechange() {
    debugger;
    let IsNominee = this.JointMemberAndNomineeForm.controls.pIsnomineeapplicable.value;
   this.NomineeStatus = false;
    if (IsNominee) {
      this.showNominee = true;

    }
    else {
      this.showNominee = false;
     
     
    }
  }
  SaveJointMemberAndNominee() {
    debugger
    this.loading = true;
    //if (this.Jointmembergrid.length > 0 || this.nomineeDetails.nomineeList.length > 0) {
      if (this.showNominee) {
        this.getConfigNomineeDetails();
      }
      let GetSavingAccountData = this.savingtranscationservice.GetAccountNoAndId();
      let newdata = { pCreatedby: this._commonService.pCreatedby, pvchapplicationid: GetSavingAccountData.pSavingaccountno, papplicationid: GetSavingAccountData.pSavingaccountid, pIsjointapplicable: this.Jointmembergrid.length > 0 ? true : false, JointMembersList: this.Jointmembergrid, PersonalNomineeList: this.newlist };
      
      let data = JSON.stringify(newdata);
      this.savingtranscationservice.SaveJointmemberAndNominee(data).subscribe(res => {
        debugger;
         this.loading = false;
        if (res) {
          let SavingAccounttransdetails = null;
           this.loading = false;
        
          let str = "refferral"
          $('.nav-item a[href="#' + str + '"]').tab('show');
        }
      }, err => {
         this.loading = false;
        this._commonService.showErrorMessage("Error while saving")
      });
    //}
    // else {
    //   this.loading = false;
    //    let str = "refferral"
    //       $('.nav-item a[href="#' + str + '"]').tab('show');
    // }
    
  }
  getConfigNomineeDetails() {
    debugger;
    this.newlist = [];
    let formData;
    if (this.showNominee) {
      if (this.nomineeDetails) {
        let NomineeData = null;
        formData = this.nomineeDetails.nomineeList;
        if (formData && formData.length > 0) {
          for (let i = 0; i < formData.length; i++) {
            NomineeData = this.loadPreviousData(this.showNominee);
          
            NomineeData = Object.assign(NomineeData, formData[i]);
            this.newlist.push(NomineeData);
          }        
        }
       
      }
    }
 
  }
  loadPreviousData(isapplicable): any {
    let rowdata = this.savingtranscationservice.GetAccountNoAndId();
   
    let pCreatedby = this._commonService.pCreatedby;
    let data;
    data = { pcontactid: rowdata.pContactid, pcontactreferenceid: rowdata.pContactreferenceid, papplicanttype: "SAVING ACCOUNTS", pisapplicable: isapplicable, pCreatedby: pCreatedby }
    return data;
  }
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

         
        }
        else if (formcontrol.validator) {
          this.JointMemberErrorMessages[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {

            let errormessage;

            for (const errorkey in formcontrol.errors) {
              if (errorkey) {

                let lablename;

                lablename = (document.getElementById(key) as HTMLInputElement).title;
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.JointMemberErrorMessages[key] += errormessage + ' ';
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
  public removeHandler({ dataItem }) {

    const index: number = this.Jointmembergrid.indexOf(dataItem);
    if (index !== -1) {
      this.Jointmembergrid.splice(index, 1);
    }

  }
  BindData() {
    debugger;
    let EditData = this.savingtranscationservice.GetSavingTransactionDetailsForEdit();
    let savingTransData = EditData[0].savingAccountTransactionlist;
    let Jointmemberslist = EditData[0].jointMemberslist;
    let Nomineelist = EditData[0].applicationPersonalNomineelist;
    this.JointMemberAndNomineeForm.controls.pIsjointapplicable.setValue(savingTransData.pIsjointapplicable);
    this.NomineeStatus = (Nomineelist.length > 0)? true: false;
    if (savingTransData.pIsjointapplicable) {
      this.ShowJointmembers = true;
      this.Jointmembergrid = Jointmemberslist;
     
    }
    






  }
}
