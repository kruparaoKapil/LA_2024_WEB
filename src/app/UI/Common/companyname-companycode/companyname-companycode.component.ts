import { Component, OnInit, ViewChild, DoCheck, NgZone, Output, EventEmitter, AfterViewInit, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { State, process } from '@progress/kendo-data-query';
import { Toast, ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../Services/common.service';
import { ActivatedRoute } from '@angular/router';
import { LoansmasterService } from 'src/app/Services/Loans/Masters/loansmaster.service';
import { ShareconfigService } from 'src/app/Services/Banking/shareconfig.service';
declare let $: any
@Component({
  selector: 'app-companyname-companycode',
  templateUrl: './companyname-companycode.component.html',
  styles: []
})
export class CompanynameCompanycodeComponent implements OnInit {
  @Input() sharenameedit:any;
  CompanyNameCodeForm: FormGroup;
  public NameandCodeValidationErrors: any;
  public Sharecode: any = "";
  public CompanyCode: any;
  public BranchCode: any;
  Duplicatesharename:any;
  public ShareNameCode: any;
  ShareNameDisable=false
  ShareCodeDisable=false
  seriesDisable=false
  editdata:any;
  buttontype:any;
  duplicate:any;
  ShowDetailsOnTab=false
  constructor(private formbuilder: FormBuilder, private shareconfigservice:ShareconfigService,public Toast: ToastrService, private _route: ActivatedRoute, private _commonService: CommonService, private _loanmasterservice: LoansmasterService) { }

  ngOnInit() 
  {
    debugger
    this.ShareNameDisable=false
    this.GetFormgroupData();
    this._loanmasterservice.GetCompanyBranchDetails().subscribe(json => {

      let CompanyDetails = json
      this.CompanyCode = CompanyDetails[0].pEnterprisecode
      this.BranchCode = CompanyDetails[0].pBranchcode
      this.CompanyNameCodeForm.controls.pcompanycode.setValue(this.CompanyCode)
      this.CompanyNameCodeForm.controls.pbranchcode.setValue(this.BranchCode)

    })
    if(this.sharenameedit){
        this.buttontype = this.shareconfigservice.Newstatus();
    }
    else{
      this.buttontype='New';
    }
   
    if(this.buttontype=="edit")
    {
      this.ShowDetailsOnTab=true
      this.ShareNameDisable=true
      this.ShareCodeDisable=true
      this.seriesDisable=true;
      
      // $('.nav-item a').removeClass('disableTabs');
      this.EditData()
    }
     
    this.BlurEventAllControll(this.CompanyNameCodeForm)
  }

  GetFormgroupData() {
    this.NameandCodeValidationErrors = {}
    this.CompanyNameCodeForm = this.formbuilder.group({
      pCreatedby: [this._commonService.pCreatedby],
      pshareconfigid: [0],
      psharename: ['',Validators.required],
      psharecode: ['',Validators.required],
      pcompanycode: [''],
      pbranchcode: [''],
      pseries: ['00001',Validators.required],
      pserieslength: [0],
      psharenamecode: ['']
    });
  }

  public GenerateShareCode(event) 
  { 
    debugger;
    this.Sharecode = ""
    let data = event.currentTarget.value;
    let shareid=this.CompanyNameCodeForm.controls.pshareconfigid.value;
    let ShareName=this.CompanyNameCodeForm.controls.psharename.value;
    let ShareCode=this.CompanyNameCodeForm.controls.psharenamecode.value;
      if (data != "") {
        this.shareconfigservice.CheckShareNameShareCodeDuplicate(shareid,ShareName,ShareCode).subscribe(result=>{
          if(result.pSchemeCount==0){
               let tempdata = data.split(' ')
              for (var i = 0; i < tempdata.length; i++) {
               this.Sharecode += tempdata[i].charAt(0)
                }
                this.CompanyNameCodeForm.controls.psharecode.setValue(this.Sharecode);
                this.ShareNameCode = this.Sharecode + this.CompanyCode + this.BranchCode + this.CompanyNameCodeForm.controls.pseries.value;
                this.CompanyNameCodeForm.controls.psharenamecode.setValue(this.ShareNameCode);
          }
          else{
            
                this.CompanyNameCodeForm.controls.psharecode.setValue("");
                 this.CompanyNameCodeForm.controls.psharename.setValue("");
                this.CompanyNameCodeForm.controls.psharenamecode.setValue("");
                this.NameandCodeValidationErrors.psharecode=null;
               this.CompanyNameCodeForm.controls.pseries.setValue('00001');
               this._commonService.showWarningMessage('Share Capital Name Already Exists.');
               this.ShareNameCode = "";
          }
        })
      }
    else {
      this.CompanyNameCodeForm.controls.psharecode.setValue("");
      this.CompanyNameCodeForm.controls.psharenamecode.setValue("");
       this.NameandCodeValidationErrors.psharenamecode=null;
      this.CompanyNameCodeForm.controls.pseries.setValue('00001');
      this.ShareNameCode = "";
    }
    
  }
  ShareCodeDuplicateCheck(sharecode){
    debugger;
       let shareid=this.CompanyNameCodeForm.controls.pshareconfigid.value;
    let ShareName=this.CompanyNameCodeForm.controls.psharename.value;
    let ShareCode=this.CompanyNameCodeForm.controls.psharecode.value;
    if (sharecode != "") {
      this.shareconfigservice.CheckShareNameShareCodeDuplicate(shareid,ShareName,ShareCode).subscribe(result => {
             debugger
        if (Number(result.pSchemeCodeCount) == 0) {
            if (sharecode != "") {
         this.ShareNameCode = this.CompanyNameCodeForm.controls.psharecode.value + this.CompanyCode + this.BranchCode + this.CompanyNameCodeForm.controls.pseries.value;
         this.CompanyNameCodeForm.controls.psharenamecode.setValue(this.ShareNameCode);
        }
       else {
         if (this.CompanyNameCodeForm.controls.psharecode.value == "") {
             this.CompanyNameCodeForm.controls.pseries.setValue('00001');
           this.ShareNameCode = "";
           this.CompanyNameCodeForm.controls.psharenamecode.setValue(this.ShareNameCode);
      }
       if (this.CompanyNameCodeForm.controls.pseries.value == "") {
     // this.CompanyNameCodeForm.controls.pseries.setValue('00001');
       this.ShareNameCode = this.CompanyNameCodeForm.controls.psharecode.value + this.CompanyCode + this.BranchCode;
      }
     }
        }
        else{
      this._commonService.showWarningMessage('Share Capital Code already exists');
      this.CompanyNameCodeForm.controls.psharecode.setValue("");
      this.CompanyNameCodeForm.controls.psharenamecode.setValue("");
      this.CompanyNameCodeForm.controls.pseries.setValue('00001');
      this.ShareNameCode = "";
        }
      })
    }
  }
clear()
{
  this.ngOnInit();
  this.ShareNameCode=""
  this.NameandCodeValidationErrors={}
}
  public ChangeCode(event) 
  {
    debugger
    let data = event.currentTarget.value;
    // if (data != "") {
    //   this.ShareNameCode = this.CompanyNameCodeForm.controls.psharecode.value + this.CompanyCode + this.BranchCode + this.CompanyNameCodeForm.controls.pseries.value;
    //   this.CompanyNameCodeForm.controls.psharenamecode.setValue(this.ShareNameCode);
    // }
    // else {
    //   if (this.CompanyNameCodeForm.controls.psharecode.value == "") {
    //     this.CompanyNameCodeForm.controls.pseries.setValue('00001');
    //     this.ShareNameCode = "";
    //     this.CompanyNameCodeForm.controls.psharenamecode.setValue(this.ShareNameCode);
    //   }
    //   if (this.CompanyNameCodeForm.controls.pseries.value == "") {
    //    // this.CompanyNameCodeForm.controls.pseries.setValue('00001');
    //     this.ShareNameCode = this.CompanyNameCodeForm.controls.psharecode.value + this.CompanyCode + this.BranchCode;
    //   }
    // }
    if(this.CompanyNameCodeForm.controls.pseries.value!='' && this.CompanyNameCodeForm.controls.pseries.value!=null && Number(this.CompanyNameCodeForm.controls.pseries.value)>0){
    this.ShareCodeDuplicateCheck(data);
    }
    else{
       this.CompanyNameCodeForm.controls.pseries.setValue('');
       this.ShareNameCode='';
        this._commonService.showWarningMessage("Series should not be Zero");
        return;
    }
  }

  checkduplicatesharename(data)
  {
    debugger
    let isValid: boolean = true;
    this.Duplicatesharename=data
    this.shareconfigservice.CheckDuplicateShareName(data).subscribe(res=>{
      
     this.duplicate=res
     if(this.duplicate>=1)
     {
       this._commonService.showWarningMessage('Name already exists');
       this.CompanyNameCodeForm.controls.psharename.setValue('');
       this.CompanyNameCodeForm.controls.psharecode.setValue('');
       this.ShareNameCode  = "";
       this.CompanyNameCodeForm.controls.psharenamecode.setValue('');   
       isValid = false;    
     }
     else{
       isValid=true
     }
     
    })
    return isValid
  }
   EditData()
  {
    debugger;
   this.editdata= this.shareconfigservice.SetTab1data()
   if(this.editdata){
    this.CompanyNameCodeForm.controls.psharename.setValue(this.editdata.psharename)
    this.CompanyNameCodeForm.controls.psharecode.setValue(this.editdata.psharecode)
    this.CompanyNameCodeForm.controls.psharenamecode.setValue(this.editdata.psharenamecode)
    this.CompanyNameCodeForm.controls.pshareconfigid.setValue(this.editdata.pshareconfigid)
    this.ShareNameCode=this.editdata.psharenamecode
    this.CompanyNameCodeForm.controls.pseries.setValue(this.editdata.pseries)
    this.CompanyNameCodeForm.controls.pserieslength.setValue(this.editdata.pserieslength)
    this.CompanyNameCodeForm.controls.pbranchcode.setValue(this.editdata.pbranchcode)
    this.BranchCode=this.editdata.pbranchcode
    this.CompanyCode=this.editdata.pcompanycode
    this.CompanyNameCodeForm.controls.pcompanycode.setValue(this.editdata.pcompanycode)
   }
  }
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
          this.NameandCodeValidationErrors[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.NameandCodeValidationErrors[key] += errormessage + ' ';
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

}
