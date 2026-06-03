import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { LoansmasterService } from 'src/app/Services/Loans/Masters/loansmaster.service';
import { ActivatedRoute } from '@angular/router';
import { FdRdServiceService } from 'src/app/Services/Banking/fd-rd-service.service';

@Component({
  selector: 'app-rdnameandcode',
  templateUrl: './rdnameandcode.component.html',
  styles: []
})
export class RdnameandcodeComponent implements OnInit {
  Rdnameandcodeform: FormGroup;
  CompanyDetails: any;
  rdname:any;
  rdnameandcode:string;
  rdcode:string;
  Ccode: string = ""
  Bcode: string = ""
  form:any;
  formValidationMessages:any;
  forDisableFirstTab:boolean = false;
  totalData: any;
  constructor(private fb: FormBuilder,
    private _commonService:CommonService,
    private activatedRouter: ActivatedRoute,
    private _loanmasterservice:LoansmasterService, 
    private fdRdService: FdRdServiceService) { }


  ngOnInit() 
  {
    this.rdnameandcode = '';
    this.forDisableFirstTab = false;
    if(this.activatedRouter.snapshot.params['id']) {
      this.totalData = JSON.parse(atob(this.activatedRouter.snapshot.params['id']));
      if(this.totalData && this.totalData.pRdconfigid) {
        this.getRdNameAndCodeDetails();
        this.forDisableFirstTab = true;
      }
      else {
        this.forDisableFirstTab = false;
      }
    }
    else {
      this.forDisableFirstTab = false;
    }

    this.formValidationMessages = {};
    this.Rdnameandcodeform = this.fb.group({
      pRdconfigid:[0],
      pRdname: ['', Validators.required],
      pRdcode: ['', Validators.required],
      pCompanycode: [''],
      pBranchcode: [''],
      pSeries: ['00001',Validators.required],
      pSerieslength: 0,
      pRdnamecode: [''],
      pCreatedby: [this._commonService.pCreatedby],
      ptypeofoperation:['CREATE']
    })
    this._loanmasterservice.GetCompanyBranchDetails().subscribe(json => {
      debugger
      this.CompanyDetails = json
      this.Ccode = this.CompanyDetails[0].pEnterprisecode
      this.Bcode = this.CompanyDetails[0].pBranchcode
      this.Rdnameandcodeform.controls.pCompanycode.setValue(this.Ccode)
      this.Rdnameandcodeform.controls.pBranchcode.setValue(this.Bcode)
  
    })
    this.BlurEventAllControll(this.Rdnameandcodeform);
  }
  GenerateRdname(event)
  {
    debugger
    this.rdname=event.target.value
    this.rdcode ="";
    this.formValidationMessages.pRdcode=null;
    let RDconfigid=this.Rdnameandcodeform.controls.pRdconfigid.value;
    let RDName=this.Rdnameandcodeform.controls.pRdname.value;
    let RdCode=this.Rdnameandcodeform.controls.pRdcode.value;
    if(this.rdname!=''){
    this.fdRdService.CheckRDNameCodeDuplicate(RDconfigid,RDName,RdCode).subscribe(res=>{
      if(res.pSchemeCount==0){
          let temp=this.rdname.split(' ')
         for(let i=0;i<temp.length;i++)
           {
           this.rdcode += temp[i].charAt(0)
             }
          this.Rdnameandcodeform.controls.pRdcode.setValue(this.rdcode)
          this.rdnameandcode=this.rdcode + this.Ccode + this.Bcode + this.Rdnameandcodeform.controls.pSeries.value
          this.Rdnameandcodeform.controls.pRdnamecode.setValue(this.rdnameandcode)
      }
      else{
        this._commonService.showWarningMessage('Recurring Deposit Name Already Exists.')
           this.Rdnameandcodeform.controls.pSeries.setValue('00001');
           this.Rdnameandcodeform.controls.pRdname.setValue('')
           this.Rdnameandcodeform.controls.pRdcode.setValue('');
           this.formValidationMessages.pRdcode=null;
           this.rdnameandcode="";
      }
    })
    }
    else{
           this.Rdnameandcodeform.controls.pSeries.setValue('00001');
           this.Rdnameandcodeform.controls.pRdcode.setValue('');
           this.Rdnameandcodeform.controls.pRdcode.clearValidators();
           this.Rdnameandcodeform.controls.pRdcode.updateValueAndValidity();
           this.rdnameandcode="";
    }
   
  }

  changeRdcode(event)
  {
    debugger
    this.rdcode=""
    this.rdcode=event.target.value
    let RDconfigid=this.Rdnameandcodeform.controls.pRdconfigid.value;
    let RDName=this.Rdnameandcodeform.controls.pRdname.value;
    let RdCode=this.Rdnameandcodeform.controls.pRdcode.value;
    if(this.rdcode!=''){
    this.fdRdService.CheckRDNameCodeDuplicate(RDconfigid,RDName,RdCode).subscribe(res=>{
      if(res.pSchemeCodeCount==0){
           this.rdnameandcode=this.rdcode + this.Ccode + this.Bcode + this.Rdnameandcodeform.controls.pSeries.value
           this.Rdnameandcodeform.controls.pRdnamecode.setValue(this.rdnameandcode);
        }
      else{
           this._commonService.showWarningMessage('Recurring Deposit Code Already Exists.')
           this.Rdnameandcodeform.controls.pSeries.setValue('00001');
           this.Rdnameandcodeform.controls.pRdcode.setValue('');
           this.rdnameandcode="";
         }
    })
    }
    else{
           this.Rdnameandcodeform.controls.pSeries.setValue('00001');
           this.Rdnameandcodeform.controls.pRdcode.setValue('');
           this.rdnameandcode="";
    }

  }
  GenerateSeries(event) {
    debugger;
    let str = event.currentTarget.value;
    if (str != "") {
       if( Number(str)<=0){
         this.Rdnameandcodeform.controls.pSeries.setValue('');
         this.rdnameandcode='';
        this._commonService.showWarningMessage("Series should not be Zero");
        return;
       }
      if (this.Rdnameandcodeform.controls.pRdname.value != "" && this.Rdnameandcodeform.controls.pRdcode.value != "") {
        this.rdnameandcode = this.Rdnameandcodeform.controls.pRdcode.value + this.Ccode + this.Bcode + str
        this.rdnameandcode = this.rdnameandcode.toUpperCase();
        this.Rdnameandcodeform.controls.pSerieslength.setValue(str.length)
        this.Rdnameandcodeform.controls.pRdnamecode.setValue(this.rdnameandcode);
      }
    }
    else {
      this.rdnameandcode = this.Rdnameandcodeform.controls.pRdcode.value + this.Ccode + this.Bcode;
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


  getRdNameAndCodeDetails() {
    
    this.fdRdService.getRdNameAndCode(this.totalData.pRdname,this.totalData.pRdnamecode).subscribe((resposne: any) => {
      if(resposne) {
        resposne.pCreatedby = this._commonService.pCreatedby;
        this.Rdnameandcodeform.patchValue(resposne);
        this.rdnameandcode = resposne.pRdnamecode;
      }
    }, (error) => {
      // this._commonService.showErrorMessage("Something went wrong from serverside, please try again sftter sometime");
    })
  }

}
