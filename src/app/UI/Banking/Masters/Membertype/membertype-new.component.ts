import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { LoansmasterService } from "../../../../Services/Loans/Masters/loansmaster.service";
import { CommonService } from '../../../../Services/common.service';

import { MemberService } from '../../../../Services/Banking/member.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-membertype-new',
  templateUrl: './membertype-new.component.html',
  styles: []
})
export class MembertypeNewComponent implements OnInit {

  MemberTypeForm: FormGroup

  constructor(private fb: FormBuilder, private _loanmasterservice: LoansmasterService,
    private _CommonService: CommonService, private _MemberService: MemberService,
    private _router: Router, private _toastr: ToastrService,private router:Router) { }

  MemberTypeErrorMessages: any
  ButtonText: string = "Save";
  disablesavebutton=false;
  isLoading = false;

  CompanyDetails: any
  Ccode: string
  Bcode: string
  MemberCode: string

  MemberNameandCode: string
  public pmemberfeeApplicable:boolean=false;
  ngOnInit() {
    debugger

    // var dateString = "12/26/2019";
    // var date1 = new Date(dateString);
    // var daysPrior = 28;
    // date1.setDate(date1.getDate() - daysPrior);
    // console.log("New Date",date1);
    // console.log("New Date",date1.toISOString());

    this.ButtonText = "Save";
    this.disablesavebutton=false;
    this.MemberNameandCode='';
    this.MemberTypeErrorMessages = {}
    this.MemberTypeForm = this.fb.group({
      pmembertypeid: ['0'],
      pmembertype: ['', [Validators.required, Validators.maxLength(50)]],
      pmembertypecode: ['', [Validators.required, Validators.maxLength(10)]],
      pcompanycode: [''],
      pbranchcode: [''],
      pseries: ['00001', [Validators.required]],
      pserieslength: ['5'],
      pmembercode: [''],
      pmemberfee: [0],
      pissharesissueapplicable: [false],
      pisaccounttypecreationapplicable: [false],
      pismembershipfeeapplicable: [false],
      pCreatedby: [this._CommonService.pCreatedby]
    })
    this.MemberTypeForm.controls.pissharesissueapplicable.setValue(false);
    this.MemberTypeForm.controls.pisaccounttypecreationapplicable.setValue(false);
    this.MemberTypeForm.controls.pismembershipfeeapplicable.setValue(false);
    this.BlurEventAllControll(this.MemberTypeForm);
    this._loanmasterservice.GetCompanyBranchDetails().subscribe(json => {
      this.CompanyDetails = json
      this.Ccode = this.CompanyDetails[0].pEnterprisecode
      this.Bcode = this.CompanyDetails[0].pBranchcode
      this.MemberTypeForm.controls.pcompanycode.setValue(this.Ccode)
      this.MemberTypeForm.controls.pbranchcode.setValue(this.Bcode)
    })

    let ButtonType = this._MemberService.GetButtonType()
    if (ButtonType != "New" && ButtonType != undefined ) {
      this.ButtonText = "Update";
      this.disablesavebutton=false;
      this.LoadDataForEdit()
    }


  }

  LoadDataForEdit() {
    debugger
    let data = this._MemberService.GetMemberDetailsForEdit()

    if (data != undefined) {

      this.MemberTypeForm.controls.pmembertypeid.setValue(data.pmembertypeid)
      this.MemberTypeForm.controls.pmembertype.setValue(data.pmembertype)
      this.MemberTypeForm.controls.pmembertypecode.setValue(data.pmembertypecode)
      this.MemberTypeForm.controls.pcompanycode.setValue(data.pcompanycode)
      this.Ccode = data.pcompanycode
      this.MemberTypeForm.controls.pbranchcode.setValue(data.pbranchcode)
      this.Bcode = data.pbranchcode
      this.MemberTypeForm.controls.pseries.setValue(data.pseries)
      this.MemberTypeForm.controls.pserieslength.setValue(data.pserieslength)
      this.MemberTypeForm.controls.pmembercode.setValue(data.pmembercode)
      this.MemberNameandCode = data.pmembercode
      this.MemberTypeForm.controls.pissharesissueapplicable.setValue(data.pissharesissueapplicable)
      this.MemberTypeForm.controls.pCreatedby.setValue(data.pCreatedby)


    }

  }



  public GenerateMemberCode(event) {
    debugger
    this.MemberCode = ""
    let MemberType = event.currentTarget.value;
     let memberid= this.MemberTypeForm.controls.pmembertypeid.value;
    let MemberTypeCode= this.MemberTypeForm.controls.pmembertypecode.value;
    if (MemberType != "") {

      this._MemberService.CheckMemberNameMemberCodeDuplicate(memberid,MemberType,MemberTypeCode).subscribe(result => {
             debugger
        if (Number(result.pSchemeCount) == 0) {
          let tempdata = MemberType.split(' ')
          for (var i = 0; i < tempdata.length; i++) {
            this.MemberCode += tempdata[i].charAt(0)
          }
          this.MemberTypeForm.controls.pmembertypecode.setValue(this.MemberCode);
          this.MemberNameandCode = this.MemberCode + this.Ccode + this.Bcode + this.MemberTypeForm.controls.pseries.value;
          this.MemberTypeForm.controls.pmembercode.setValue(this.MemberNameandCode);
         // this.MemberCodeDupicateCheck(this.MemberCode);
        }
        else {
          this.MemberTypeForm.controls.pmembertype.setValue("");
          this.MemberTypeForm.controls.pmembertypecode.setValue("");
          this.MemberTypeErrorMessages.pmembertypecode=null;
          this.MemberTypeForm.controls.pseries.setValue('00001');
          this.MemberNameandCode = "";
          this._CommonService.showWarningMessage("Duplicate Member Types are not allowed ");
        }

      })

    }
    else {
      this.MemberTypeForm.controls.pmembertypecode.setValue("");
      this.MemberTypeForm.controls.pseries.setValue('00001');
      this.MemberNameandCode = "";
    }
  }

  public ChangeMemberCode(event) {
    debugger
    let code = event.currentTarget.value;
    // if (code != "") {
    //   this.MemberNameandCode = this.MemberTypeForm.controls.pmembertypecode.value + this.Ccode + this.Bcode + this.MemberTypeForm.controls.pseries.value;
    //   this.MemberTypeForm.controls.pmembercode.setValue(this.MemberNameandCode);
    // }
    // else {
    //   this.MemberNameandCode = "";
    // }
    this.MemberCodeDupicateCheck(code);
  }
  MemberCodeDupicateCheck(MemberTypeCode){
    debugger;
    let memberid= this.MemberTypeForm.controls.pmembertypeid.value;
    let MemberType= this.MemberTypeForm.controls.pmembertype.value;
    if (MemberTypeCode != "") {
      this._MemberService.CheckMemberNameMemberCodeDuplicate(memberid,MemberType,MemberTypeCode).subscribe(result => {
             debugger
        if (Number(result.pSchemeCodeCount) == 0) {
           this.MemberNameandCode = this.MemberTypeForm.controls.pmembertypecode.value + this.Ccode + this.Bcode + this.MemberTypeForm.controls.pseries.value;
           this.MemberTypeForm.controls.pmembercode.setValue(this.MemberNameandCode);
        }
        else{
            this.MemberTypeForm.controls.pmembertypecode.setValue("");
            this.MemberTypeForm.controls.pseries.setValue('00001');
           this._CommonService.showWarningMessage("Duplicate Member Codes are not allowed ");
           this.MemberNameandCode = "";
        }
      })
    }
  }

  GenerateSeries(event) {
    debugger
    let str = event.currentTarget.value
    if (str != "") {
      if(Number(str)<=0){
        this.MemberTypeForm.controls.pseries.setValue('');
        this.MemberNameandCode='';
        this._CommonService.showWarningMessage("Series should not be Zero");
        return;
    }
      if (this.MemberTypeForm.controls.pmembertype.value != "" && this.MemberTypeForm.controls.pmembertypecode.value != "") {
        this.MemberNameandCode = this.MemberTypeForm.controls.pmembertypecode.value + this.Ccode + this.Bcode + str

        this.MemberTypeForm.controls.pserieslength.setValue(str.length)
        this.MemberTypeForm.controls.pmembercode.setValue(this.MemberNameandCode)
      }
    }
  }

  SharesIssuedOrNot(event,value) {
    debugger
    let checked = event.currentTarget.checked
    if(value=='AreShareIssueApplicable'){
      if (checked == true) {
        this.MemberTypeForm.controls.pissharesissueapplicable.setValue(true)
      } else {
        this.MemberTypeForm.controls.pissharesissueapplicable.setValue(false)
      }  
    }
    if(value=='AreAcTypeCreationApplicable'){
      if (checked == true) {
        this.MemberTypeForm.controls.pisaccounttypecreationapplicable.setValue(true)
      } else {
        this.MemberTypeForm.controls.pisaccounttypecreationapplicable.setValue(false)       
      }
    }
    if(value=='AreMembershipFeeApplicable'){ 
      if (checked == true) {
        this.MemberTypeForm.controls.pismembershipfeeapplicable.setValue(true);
        this.MemberTypeForm.controls.pmemberfee.setValue('');
        this.pmemberfeeApplicable=true;
        this.MemberTypeForm.controls['pmemberfee'].setValidators([Validators.required]);
        this.MemberTypeForm.controls['pmemberfee'].updateValueAndValidity();
      } else {
        this.MemberTypeForm.controls.pismembershipfeeapplicable.setValue(false)   ;
        this.MemberTypeForm.controls.pmemberfee.setValue(0);    
        this.pmemberfeeApplicable=false;
        this.MemberTypeForm.controls['pmemberfee'].clearValidators();
        this.MemberTypeForm.controls['pmemberfee'].updateValueAndValidity();

      }    
    }
  }

  // Validation Checking Methods Start
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
          this.MemberTypeErrorMessages[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.MemberTypeErrorMessages[key] += errormessage + ' ';
                isValid = false;
              }
            }
          }
        }
      }
    }
    catch (e) {
      // this.showErrorMessage(e);
      return false;
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
  // Validation Checking Methods End

  SaveAndUpdateMemberType() {
    debugger
    let isValid = true;
    if (this.checkValidations(this.MemberTypeForm, isValid)) {
      if (this.MemberTypeForm.valid) {

          let MemberTypeCode= this.MemberTypeForm.controls.pmembertypecode.value;
          let MemberType= this.MemberTypeForm.controls.pmembertype.value;
          let memberid= this.MemberTypeForm.controls.pmembertypeid.value;
         this._MemberService.CheckMemberNameMemberCodeDuplicate(memberid,MemberType,MemberTypeCode).subscribe(result => {
          debugger
          if (Number(result.pSchemeCount) == 0 && Number(result.pSchemeCodeCount)==0) {
            this.isLoading = true;
            if(this.pmemberfeeApplicable==true){
              let pmemberfee = this.MemberTypeForm.controls.pmemberfee.value;
              pmemberfee = this._CommonService.removeCommasInAmount(pmemberfee);
              this.MemberTypeForm.controls.pmemberfee.setValue(pmemberfee);
            }
            let data = JSON.stringify(this.MemberTypeForm.value)
            if (this.MemberTypeForm.controls.pmembertypeid.value == 0) {
              this.ButtonText="Processing";
              this.disablesavebutton=true;
              this._MemberService.SaveMemberTypeDetails(data).subscribe(result => {
                let a = result
                this.MemberTypeForm.reset()
                this.MemberTypeForm.controls.pseries.setValue('00001');
                this.MemberNameandCode = "";
                this._CommonService.showInfoMessage("Saved successfully")
                this.isLoading = false;
                this.ButtonText="Save";
                this.disablesavebutton=false;
                this._router.navigate(['/MembertypeView'])
              }, err => {
                this.isLoading = false;
                this.ButtonText="Save";
                this.disablesavebutton=false;
                this._CommonService.showWarningMessage("Duplicate Member Types are not allowed ")
              })
            }
            else {
              this.ButtonText="Processing";
              this.disablesavebutton=true;
              this._MemberService.UpdateMemberTypeDetails(data).subscribe(result => {
                let a = result
                this.MemberTypeForm.reset()
                this.MemberTypeForm.controls.pseries.setValue('00001');
                this.MemberNameandCode = "";
                this._CommonService.showInfoMessage("Updated successfully")
                this._MemberService.SetMemberDetailsForEdit(undefined)
                this.isLoading = false;
                 this.ButtonText="Save";
                 this.disablesavebutton=false;
                this._router.navigate(['/MembertypeView'])
              }, err => {
                this.isLoading = false;
               this.ButtonText="Update";
               this.disablesavebutton=false;
                this._CommonService.showWarningMessage("Duplicate Member Type are not allowed ")
              })
            }

          } else {
            if(Number(result.pSchemeCodeCount)!=0){
            this.MemberTypeForm.controls.pmembertypecode.setValue("");
            this.MemberTypeForm.controls.pseries.setValue('00001');
            this._CommonService.showWarningMessage("Duplicate Member Codes are not allowed ");
            this.MemberNameandCode = "";
            }
            else if(Number(result.pSchemeCount) != 0){
            this.MemberTypeForm.controls.pmembertype.setValue("");
            this.MemberTypeForm.controls.pmembertypecode.setValue("");
            this.MemberTypeErrorMessages.pmembertypecode=null;
            this.MemberTypeForm.controls.pseries.setValue('00001');
            this._CommonService.showWarningMessage("Duplicate Member Type are not allowed ");
            this.MemberNameandCode = "";
            }
          }


        })

      }
    } else {
      // this._toastr.error("Error occured while saveing,check details again")
    }



  }
Cleardetails(){
  debugger;
  this.ButtonText = "Save";
    this.disablesavebutton=false;
    this.MemberTypeErrorMessages = {}
    this.MemberTypeForm.patchValue({
      pmembertypeid:'0',
      pmembertype: '',
      pmembertypecode: '', 
      pcompanycode: '',
      pbranchcode: '',
      pseries: '00001', 
      pserieslength: '5',
      pmembercode: '',
      pmemberfee:0,
      pissharesissueapplicable: false,
      pisaccounttypecreationapplicable: false,
      pismembershipfeeapplicable: false,
      pCreatedby: this._CommonService.pCreatedby
    })
    this._loanmasterservice.GetCompanyBranchDetails().subscribe(json => {
      this.CompanyDetails = json
      this.Ccode = this.CompanyDetails[0].pEnterprisecode
      this.Bcode = this.CompanyDetails[0].pBranchcode
      this.MemberTypeForm.controls.pcompanycode.setValue(this.Ccode)
      this.MemberTypeForm.controls.pbranchcode.setValue(this.Bcode)
    })

    let ButtonType = this._MemberService.GetButtonType()
    if (ButtonType != "New" && ButtonType != undefined ) {
      this.ButtonText = "Update";
      this.disablesavebutton=false;
      this.LoadDataForEdit()
    }
    this.MemberNameandCode='';
    this.pmemberfeeApplicable=false;
    this.MemberTypeErrorMessages={};

}

  back(){
    debugger;
    this.router.navigate(['/MembertypeView']);
  }

}
