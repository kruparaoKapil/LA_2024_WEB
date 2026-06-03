import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { FIIndividualService } from 'src/app/Services/Loans/Transactions/fiindividual.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { SavingtranscationService } from 'src/app/Services/Banking/savingtranscation.service';
import { Router } from '@angular/router';
import { FdRdServiceService } from 'src/app/Services/Banking/fd-rd-service.service';
import { FdRdTransactionsService } from 'src/app/Services/Banking/Transactions/fd-rd-transactions.service';
import { FdTransactionNewComponent } from './fd-transaction-new.component';
declare let $: any
@Component({
  selector: 'app-fd-referral',
  templateUrl: './fd-referral.component.html',
  styles: []
})
export class FdReferralComponent implements OnInit {
 
  constructor(private fiIndividualService: FIIndividualService, private _fb: FormBuilder, private _commonService: CommonService, private savingtranscationservice: SavingtranscationService, private zone: NgZone, private router: Router,private _fdrdtranscationservice:FdRdTransactionsService) { }
  referralAgents: any;
  referralAgentsList:any
  allEmployeeDetails: any;
  referralForm: any;
  editdata:any;
  referralTypeErrorMessage={}
  employeeReferenceId: any;
  agentReferenceId: any;
  firsttabdata:any=[]
  loading: boolean = false;
  buttontype:any;
  ShowReferral: boolean = false;
  ShowSaveClearbuttons: boolean = true;
  ngOnInit()
   {
    this.FormGroup();
    this.getReferralAgentDetails();
   this.getallEmployeeDetails();
   this.buttontype = this._fdrdtranscationservice.Newstatus();
   if(this.buttontype=="edit")
   {
     debugger
    this.EditData()
   }
   this.BlurEventAllControll(this.referralForm)
  
  }
  FormGroup() {
    this.referralForm = this._fb.group({
      pFdAccountId:[0],
      pFdaccountNo:[0],
      pReferralId: ['',Validators.required],
      pCommisionValue:[0],
      pAdvocateName: [''],
      pReferralCode: [''],
      pContactId: [''],
      pSalesPersonName: ['',Validators.required],
      pIsReferralsapplicable: [false],
      pTypeofOperation: ['CREATE'],
      pCommissionType:[''],
      pCreatedby: [this._commonService.pCreatedby]

    });
  }
  getReferralAgentDetails() {
   
    
      let type = 'ALL'
      //this.loading = true;
    this.fiIndividualService.getReferralDetails().subscribe(response => {
      
     
      if (response != null) {
        
        this.referralAgents = response;
        
        }

    });
    
  }

  EditData()
  {
    debugger
     this.editdata=this._fdrdtranscationservice.GetDetailsForEdit()
    console.log("editdetails for refferal",this.editdata);
    if(this.editdata.pIsReferralsapplicable==true)
    {
      this.referralForm.controls.pIsReferralsapplicable.setValue(this.editdata.pIsReferralsapplicable)
      this.ShowReferral=true;
      this.getReferralAgentDetails()
      this.referralForm.controls.pAdvocateName.setValue(this.editdata.pAdvocateName)
      this.referralForm.controls.pSalesPersonName.setValue(this.editdata.pSalesPersonName)
      this.referralForm.controls.pReferralId.setValue(parseInt( this.editdata.pReferralId))
      this.referralForm.controls.pCommisionValue.setValue(this.editdata.pCommisionValue)    
      this.referralForm.controls.pCreatedby.setValue(this._commonService.pCreatedby)
      this.referralForm.controls.pTypeofOperation.setValue("UPDATE")
      this.referralForm.controls.pFdAccountId.setValue(this.editdata.pFdAccountId)
      this.referralForm.controls.pFdaccountNo.setValue(this.editdata.pFdaccountNo)
      this.referralForm.controls.pReferralCode.setValue(this.editdata.pReferralCode)
      this.referralForm.controls.pContactId.setValue(this.editdata.pReferralContactId)
    }
    else{
      this.referralForm.controls.pIsReferralsapplicable.setValue(this.editdata.pIsReferralsapplicable)
      this.ShowReferral=false;
     
    }
    
     
  }
  getallEmployeeDetails() {
    try {
      this.fiIndividualService.getallEmployeeDetails().subscribe(response => {
        if (response != null) {
          this.allEmployeeDetails = response;
        }

      });
    } catch (error) {
      
      
    }
  }
  referralAgentDetails(data) 
  {
   
    if(data!=undefined)
    {
      this.referralForm.controls.pAdvocateName.setValue(data.pAdvocateName);
      this.referralForm.controls.pReferralCode.setValue(data.pReferralCode);
      this.referralForm.controls.pContactId.setValue(data.pContactId);
     
    }
   
    //this.referralForm.controls.pReferralId.setValue(data.pReferralId)
  }
  employeeDetails(data) 
  {
    if(data!=undefined)
    {
      this.employeeReferenceId = data.pContactRefNo;
      this.referralForm.controls.pSalesPersonName.setValue(data.pEmployeeName);
    
    }
   
    
  }
  RefferalApplicable() 
  {
    debugger
    let Isreferral = this.referralForm.controls.pIsReferralsapplicable.value;
    if (Isreferral) {
      this.ShowReferral = true;
     this.referralForm.controls.pReferralId.setValidators(Validators.required)
     this.referralForm.controls.pSalesPersonName.setValidators(Validators.required)

    }
    else {
      this.ShowReferral = false;
    }
  }
  GetDataForJointMember()
  {
    
    let a= this._fdrdtranscationservice._GetDataForJointMember();
    this.referralForm.controls.pFdAccountId.setValue(a['FdAccountId'])
    this.referralForm.controls.pFdaccountNo.setValue(a['Fdaccountno'])
  }
  checkValidations(group: FormGroup, isValid: boolean): boolean 
  {
    debugger
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
  GetValidationByControl(formGroup: FormGroup, key: string, isValid: boolean): boolean 
  {
    debugger
    try {
      let formcontrol;
      formcontrol = formGroup.get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          this.checkValidations(formcontrol, isValid)
        }
        else if (formcontrol.validator) {
          this.referralTypeErrorMessage[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.referralTypeErrorMessage[key] += errormessage + ' ';
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
  
  SaveReferral()
  {
    debugger
    let isValid = true;
    this.GetDataForJointMember()
    if(this.ShowReferral==true)
    {
      
      
        if(this.checkValidations(this.referralForm,isValid))  
        {
          this.savingtheform()       
        } 
        
      
      else{
        if(this.checkValidations(this.referralForm,isValid))  
        {
          this.savingtheform()       
        } 
      }       
    }
    else
    {
      this.referralForm.controls.pReferralId.setValue(0);
      this.savingtheform()   
    }
  
  }
  savingtheform()
  {
    debugger
     let commisiondata=this._fdrdtranscationservice._GetCommisiontype()
     console.log(commisiondata)
    debugger
    this.referralForm.controls.pCommisionValue.setValue(commisiondata['commissionvalue'])
    this.referralForm.controls.pCommissionType.setValue(commisiondata['commissiontype'])
    let data=JSON.stringify(this.referralForm.value)
    console.log(data)
    // if(this.buttontype=="edit")
    // {
      
    //   this.referralForm.controls.pTypeofOperation.setValue("UPDATE")
    // }
    // else{
    //   this.referralForm.controls.pTypeofOperation.setValue("CREATE")
    // }
    this._fdrdtranscationservice.SaveRefferalform(data).subscribe(json=>{
      if(json)
      {
       
        this._commonService.showInfoMessage("Saved successfully")
        this.FormGroup();
      
        this.ShowReferral=false;
        let str = "selectmember"
        $('.nav-item a[href="#' + str + '"]').tab('show'); 
      

      }
    })
  }
  clear()
  {
    debugger
    this.referralForm.reset();
    this.referralForm.controls.pAdvocateName.setValue("")
    this.referralForm.controls.pSalesPersonName.setValue("")
    this.referralForm.controls.pFdAccountId.setValue(0)
    this.referralForm.controls.pFdaccountNo.setValue(0)
    this.FormGroup();
    console.log(this.referralForm.value);
    this.buttontype= this._fdrdtranscationservice.Newformstatus("new")
    this.ShowReferral=false;
  }
}
