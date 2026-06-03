import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FdRdTransactionsService } from 'src/app/Services/Banking/Transactions/fd-rd-transactions.service';
import { isNullOrUndefined } from 'util';
import { CommonService } from 'src/app/Services/common.service';

@Component({
  selector: 'app-transfer-new',
  templateUrl: './transfer-new.component.html',
  styles: []
})
export class TransferNewComponent implements OnInit {
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  Transferform:FormGroup;
  schemenames:any=[];
  MemberDetails:any=[];
  ToDetails:any=[]
  Branchname:any;
  Membercode:any
  Branchdetails:any=[];
  fromfddetails:any=[];
  Accountno:any;
  Fdaccountid:any;
  Membername:any;
  Deposiamount:any;
  Maturityamount:any;
  Deposidate:any;
  Maturitydate:any;
  Interestrate:any;
  InterestPayble:any;
  AdvanceAccountno:any;
  InterestPayout:any;
  InterestType:any;
  Tenor:any;
  Tenortype:any;
  ShowFromdetails:boolean=false;
  ShowTodetails:boolean=false
  Transferformvalidations:any;
  fdaccountno:any;
  tofdaccountno: any;
  constructor(private _fb:FormBuilder,private _fdrdtranscationservice:FdRdTransactionsService,private commonservice:CommonService)
   { 
    this.dpConfig.dateInputFormat = 'DD/MM/YYYY'
    this.dpConfig.maxDate = new Date();
    this.dpConfig.minDate = new Date();
    this.dpConfig.showWeekNumbers = false;

   }

  ngOnInit() 
  {
    this.Formgroup();
    this.GetSchemeNames();
    this.GetBranchdetails();
    this.GetFromAccountDetails();
    this.Transferformvalidations={};
    this.BlurEventAllControll(this.Transferform)
    this.ShowFromdetails=false;
    this.ShowTodetails=false;
  }
  Formgroup()
  {
    this.Transferform=this._fb.group
    ({
      pTransferdate:[new Date()],
      pFdname:['',Validators.required],
      pChitbranchname:['',Validators.required],
      pFromAccountId:['',Validators.required],
      pFromMemberId:[''],
      pToMemberId:[''],
      pMemberid:['',Validators.required],
      pToAccountId:['',Validators.required]
    })
  }

  GetSchemeNames()
  {
    this._fdrdtranscationservice.GetTransferSchemeNames().subscribe(res=>{
     this.schemenames=res
    })
    console.log("schemenames are", this.schemenames)
  }
 GetFromAccountDetails()
 {
    this._fdrdtranscationservice.GetFromAccountDetails().subscribe(res=>{
      this.fromfddetails=res;
      console.log("formfddetails",this.fromfddetails)
    })
 }
  GetBranchdetails()
  {
   
    this._fdrdtranscationservice.Getbranchdetails().subscribe(res=>
      {
        debugger
      this.Branchdetails=res;
     
    })
   
  }
  FromAccountchanges(event)
  {
    debugger
    if(!isNullOrUndefined(event))
    {
       this.Transferform.controls.pFromAccountId.setValue(event.pFdaccountid)
       this.Transferform.controls.pFromMemberId.setValue(event.pMemberId)
       this.fdaccountno=event.pFdaccountno;
       this.GetFromCardDetails()
      
    }
  }
  ToAccountChanges(event)
  {
    debugger
    if(!isNullOrUndefined(event))
    {
      this.Transferform.controls.pToAccountId.setValue(event.pFdaccountid)
      this.Transferform.controls.pToMemberId.setValue(event.pMemberId);
      this.tofdaccountno=event.pFdaccountno;
      this.GetToCardDetails()
      
    }
  }
  GetFromDetailsCardview()
  {
    
    this.ShowFromdetails=true;
    this.ShowTodetails=false;
    this.GetFromCardDetails()
  }
  GettoDetailsCardview()
  {
    this.ShowFromdetails=false;
    this.ShowTodetails=true;
    this.GetToCardDetails()
    
  
  }
  GetToCardDetails()
  {
    this._fdrdtranscationservice.GetFdToaccountdetailsbyid(this.tofdaccountno).subscribe(res=>{
      console.log("Todetails",res);
      if(res)
      {
        this.ShowTodetails=true;
        this.ShowFromdetails=false
        this.Accountno=res[0].pAccountno;
        this.Fdaccountid=res[0].pFdaccountid;
        this.AdvanceAccountno=res[0].pFdaccountno;
        this.Deposiamount=res[0].pDeposiamount;
        this.Maturityamount=res[0].pMaturityamount;
        this.Deposidate=res[0].pDeposidate;
        this.Maturitydate=res[0].pMaturitydate;
        this.InterestPayble=res[0].pInterestPayble;
        this.InterestPayout=res[0].pInterestPayout;
        this.InterestType=res[0].pInteresttype;
        this.Interestrate=res[0].pInterestrate;
        this.Tenor=res[0].pTenor;
        this.Tenortype=res[0].pTenortype;
        this.Membername=res[0].pMembername
      }
     
    })
  }
  BranchChange(event){
    debugger;
    
    if (!isNullOrUndefined(event)) 
    {
      this.Transferform.controls.pToAccountId.setValue("");
      this.Transferform.controls.pMemberid.setValue("")
       this.Branchname=event.pBranchname
     this._fdrdtranscationservice.GetTransferMemberDetails(this.Branchname).subscribe(res=>
      {
        debugger
        this.MemberDetails=res;
        console.log("member details",this.MemberDetails);
        this.GetToDetails()
     })
     // this.GetFdDetails(object);
    }
   
    
    }
    Memberchange(event)
    {
      debugger;
      if(event!=undefined)
      {
        this.Transferform.controls.pToAccountId.setValue("")
        this.Membercode=event.pMembercode;
        this.GetToDetails()
      }
     
     
    }
    GetFromCardDetails()
    {
      debugger
      this._fdrdtranscationservice.GetFdfromaccountdetailsbyid(this.fdaccountno).subscribe(res=>{
        console.log("fromdetails",res)
        this.ShowFromdetails=true;
        this.ShowTodetails=false;
        if(res)
        {
          this.Accountno=res[0].pAccountno;
          this.Fdaccountid=res[0].pFdaccountid;
          this.AdvanceAccountno=res[0].pFdaccountno;
          this.Deposiamount=res[0].pDeposiamount;
          this.Maturityamount=res[0].pMaturityamount;
          this.Deposidate=res[0].pDeposidate;
          this.Maturitydate=res[0].pMaturitydate;
          this.InterestPayble=res[0].pInterestPayble;
          this.InterestPayout=res[0].pInterestPayout;
          this.InterestType=res[0].pInteresttype;
          this.Interestrate=res[0].pInterestrate;
          this.Tenor=res[0].pTenor;
          this.Tenortype=res[0].pTenortype;
          this.Membername=res[0].pMembername
        }
        
      })
    }
    GetToDetails()
    {
      debugger
      if(this.Branchname!=null && this.Membercode!=null)
      {
        this._fdrdtranscationservice.GetToAccountDetails(this.Branchname,this.Membercode).subscribe(res=>{
          this.ToDetails=res;
          console.log("fdtodetails",this.ToDetails);
         
        })
      }
     
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
     
      try {
        let formcontrol;
        formcontrol = formGroup.get(key);
        if (formcontrol) {
          if (formcontrol instanceof FormGroup) {
            this.checkValidations(formcontrol, isValid)
          }
          else if (formcontrol.validator) {
            this.Transferformvalidations[key] = '';
            if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
              let lablename;
              lablename = (document.getElementById(key) as HTMLInputElement).title;
              let errormessage;
              for (const errorkey in formcontrol.errors) {
                if (errorkey) {
                  errormessage = this.commonservice.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                  this.Transferformvalidations[key] += errormessage + ' ';
                  isValid = false;
                }
              }
            }
          }
        }
      }
      catch (e) {
        // this.showErrorMessage(e);
        // return false;
      }
      return isValid;
    }
    showErrorMessage(errormsg: string) {
      this.commonservice.showErrorMessage(errormsg);
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
    SaveForm()
    {
      let isValid=true
      if(this.checkValidations(this.Transferform,isValid))
      {
         let data=JSON.stringify(this.Transferform.value)
         console.log(data)
         this._fdrdtranscationservice.SaveTransferform(data).subscribe(res=>
          {
            if(res)
            {
              this.commonservice.showInfoMessage("Saved Sucessfully");
              this.clearform()
            }

         })
      }
    }
    clearform()
    {
      this.Formgroup();
      this.Transferformvalidations={};
      this.ShowFromdetails=false;
       this.Deposidate="";
       this.Fdaccountid="";
       this.Maturitydate="";
       this.Deposiamount="";
       this.Interestrate="";
       this.InterestPayble="";
       this.InterestPayout="";
       this.InterestType="";
       this.AdvanceAccountno="";
       this.Accountno="";
       this.Maturityamount="";
       this.Membername="";
       this.Tenortype="";
       this.Tenor=""
    }
}
