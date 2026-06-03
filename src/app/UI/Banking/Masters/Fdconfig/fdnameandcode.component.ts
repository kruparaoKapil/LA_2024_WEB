import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { LoansmasterService } from 'src/app/Services/Loans/Masters/loansmaster.service';
import { ActivatedRoute } from '@angular/router';
import { FdRdServiceService } from 'src/app/Services/Banking/fd-rd-service.service';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { EALREADY } from 'constants';
import { IfStmt } from '@angular/compiler';
declare let $: any
@Component({
  selector: 'app-fdnameandcode',
  templateUrl: './fdnameandcode.component.html',
  styles: []
})
export class FdnameandcodeComponent implements OnInit {
  fdNameAndCodeform: FormGroup;
  CompanyDetails: any;
  fdName:any;
  fdNameAndCode:string;
  fdCode:string;
  cCode: string = ""
  bCode: string = ""
  form:any;
  checkingduplicates:boolean
  totalData: any;
  formValidationMessages:any;
  forDisableFirstTab: boolean = false;
  constructor(private fb: FormBuilder,
    private _commonService:CommonService,
    private activatedRouter: ActivatedRoute,
    private rdAndFdService: FdRdServiceService,
    private _loanmasterservice:LoansmasterService) { }

  ngOnInit() {
    this.fdNameAndCode = '';
    this.checkingduplicates=false;
    this.forDisableFirstTab = false;
    if(this.activatedRouter.snapshot.params['id']) {
      this.totalData = JSON.parse(atob(this.activatedRouter.snapshot.params['id']));
      if(this.totalData && this.totalData.pFDconfigid) {
        this.getFdNameAndCodeDetails();
        this.forDisableFirstTab = true;
       // $('.nav-item a').removeClass('disableTabs');
      }
      else {
        this.forDisableFirstTab = false;
      }
    }
    else {
      this.forDisableFirstTab = false;
    }
    
    this.formValidationMessages = {};
    this.fdNameAndCodeform = this.fb.group({
      pFdconfigid:[0] ,
      pFdname: ['', Validators.required],
      pFdcode: ['', Validators.required],
      pCompanycode: [''],
      pBranchcode: [''],
      pSeries: ['00001'],
      pSerieslength: 0,
      pFdnamecode: [''],
      pCreatedby: [this._commonService.pCreatedby],
      ptypeofoperation:['CREATE']
    })
    this._loanmasterservice.GetCompanyBranchDetails().subscribe(json => {
      debugger
      this.CompanyDetails = json
      this.cCode = this.CompanyDetails[0].pEnterprisecode
      this.bCode = this.CompanyDetails[0].pBranchcode
      this.fdNameAndCodeform.controls.pCompanycode.setValue(this.cCode)
      this.fdNameAndCodeform.controls.pBranchcode.setValue(this.bCode)
  
    })
    this.BlurEventAllControll(this.fdNameAndCodeform);
  }

  getFdNameAndCodeDetails() {
    
    this.rdAndFdService.getFdNameAndCode(this.totalData.pFDname,this.totalData.pFdnamecode).subscribe((resposne: any) => {
      if(resposne) {
        resposne.pCreatedby = this._commonService.pCreatedby;
        this.fdNameAndCodeform.patchValue(resposne);
        this.fdNameAndCode = resposne.pFdnamecode;
      }
    }, (error) => {
      // this._commonService.showErrorMessage("Something went wrong from serverside, please try again sftter sometime");
    })
  }

  GenerateRdname(event)
  {
    debugger
    this.fdName=event.target.value;
    let fdconfigid=this.fdNameAndCodeform.controls.pFdconfigid.value;
    let fdcode=this.fdNameAndCodeform.controls.pFdcode.value;
    this.fdCode ="";
    if( this.fdName!=''){
      this.rdAndFdService.CheckFDNameCodeDupllicate(fdconfigid,this.fdName,fdcode).subscribe(res=>{
       debugger;
       if(Number(res.pSchemeCount)==0){
         this.Setfdcode();
       }
       else{
        this._commonService.showWarningMessage("Fixed Deposit Name Already Exists.");
        this.fdNameAndCodeform.controls.pFdcode.setValue("");
        this.fdNameAndCodeform.controls.pFdname.setValue("");
        this.fdNameAndCodeform.controls.pFdnamecode.setValue("");
        this.fdNameAndCode="";
        this.formValidationMessages.pFdcode=null;
       }
     })
    }
    else{
         this.fdNameAndCodeform.controls.pFdcode.setValue("");
        this.fdNameAndCodeform.controls.pFdname.setValue("");
        this.fdNameAndCodeform.controls.pFdnamecode.setValue("");
        this.fdNameAndCode="";
        this.formValidationMessages.pFdcode=null;
    }
  
  }
  Setfdcode()
  {
    let temp = this.fdName.split(' ')
    for (let i = 0; i < temp.length; i++) {
      this.fdCode += temp[i].charAt(0)
    }
    this.fdNameAndCodeform.controls.pFdcode.setValue(this.fdCode)
    this.fdNameAndCode = this.fdCode + this.cCode + this.bCode + this.fdNameAndCodeform.controls.pSeries.value
    this.fdNameAndCodeform.controls.pFdnamecode.setValue(this.fdNameAndCode)
  }
  Checkduplicates()
  {
    debugger
   
    this.rdAndFdService.Checkduplicatename(this.fdName,this.fdNameAndCode).subscribe(result => {
      debugger;

      if (result['pSchemeCodeCount']==0 && result['pSchemeCount']==0) 
      {
       
        this.checkingduplicates=true;

      }
      
      else if(result['pSchemeCodeCount']>0 && result['pSchemeCount']>0)
      {
        this.checkingduplicates=false;
        this._commonService.showWarningMessage("Scheme Name & code  Already exists");
        this.fdNameAndCodeform.controls.pFdcode.setValue("");
        this.fdNameAndCodeform.controls.pFdname.setValue("");
        this.fdNameAndCodeform.controls.pFdnamecode.setValue("");
        this.fdNameAndCode=""
      }
      else if(result['pSchemeCount']>0)
      {
        this._commonService.showWarningMessage("Scheme Name Already exists");
        this.fdNameAndCodeform.controls.pFdname.setValue("");
        this.fdNameAndCodeform.controls.pFdnamecode.setValue("")
        this.checkingduplicates=false;
        this.fdNameAndCode=""
        
      }
      else if(result['pSchemeCodeCount']>0)
      {
        this._commonService.showWarningMessage("Scheme Code Already exists");
        this.fdNameAndCodeform.controls.pFdcode.setValue(""); 
         this.fdNameAndCodeform.controls.pFdnamecode.setValue("")
        this.checkingduplicates=false;
        this.fdNameAndCode=""
       
      }
      
    })

   
  }
  changeRdcode(event)
  {
    debugger
    this.fdCode=""
    this.fdCode=event.target.value;
    let fdname=this.fdNameAndCodeform.controls.pFdname.value;
    let fdconfigid=this.fdNameAndCodeform.controls.pFdconfigid.value;
    if(this.fdCode!=''){
          this.rdAndFdService.CheckFDNameCodeDupllicate(fdconfigid,fdname,this.fdCode).subscribe(res=>{
       debugger;
       if(Number(res.pSchemeCodeCount)==0){
         this.checkrdcode();
       }
       else{
        this._commonService.showWarningMessage("Fixed Deposit Code Already Exists.");
        this.fdNameAndCodeform.controls.pFdcode.setValue("");
        this.fdNameAndCodeform.controls.pFdnamecode.setValue("");
        this.fdNameAndCode="";
       }
     })

    }
    else{
        this.fdNameAndCodeform.controls.pFdcode.setValue("");
        this.fdNameAndCodeform.controls.pFdnamecode.setValue("");
        this.fdNameAndCode="";
    }
   

  }
  checkrdcode()
  {
    this.fdNameAndCode=this.fdCode + this.cCode + this.bCode + this.fdNameAndCodeform.controls.pSeries.value
    this.fdNameAndCodeform.controls.pFdnamecode.setValue(this.fdNameAndCode)
  }
  GenerateSeries(event) {
    debugger;
    let str = event.currentTarget.value
    if (str != "") {
      if(Number(str)<=0){
        this.fdNameAndCode='';
        this.fdNameAndCodeform.controls.pSeries.setValue('');
        this._commonService.showWarningMessage('Series should not be Zero.');
        return;
      }
      if (this.fdNameAndCodeform.controls.pFdname.value != "" && this.fdNameAndCodeform.controls.pFdcode.value != "") {
        this.fdNameAndCode = this.fdNameAndCodeform.controls.pFdcode.value + this.cCode + this.bCode + str
        this.fdNameAndCode = this.fdNameAndCode.toUpperCase();
        this.fdNameAndCodeform.controls.pSerieslength.setValue(str.length)
       // this.fdNameAndCodeform.controls.pSeries.setValue()
        this.fdNameAndCodeform.controls.pFdnamecode.setValue(this.fdNameAndCode);
      }
    }
    else {
      this.fdNameAndCode = this.fdNameAndCodeform.controls.pFdcode.value + this.cCode + this.bCode;
    }
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
      //this.showErrorMessage(e);
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
            let lablename;

            //if (key == 'pTitleName')
            //  lablename = 'Title';
            //else
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;

            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
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
      //this.showErrorMessage(key);
      return false;
    }
    return isValid;
  }

}
