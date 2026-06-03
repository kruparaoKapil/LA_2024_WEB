import { Component,Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TdsdetailsService } from 'src/app/Services/tdsdetails.service';
import { CommonService } from 'src/app/Services/common.service';
import { ShareconfigService } from 'src/app/Services/Banking/shareconfig.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-share-referral-commission',
  templateUrl: './share-referral-commission.component.html',
  styleUrls: []
})
export class ShareReferralCommissionComponent implements OnInit {
 @Input () sharenameedit:any;
  constructor(private fb: FormBuilder, private router: Router, private _TdsService: TdsdetailsService, private _commonservice: CommonService, private shareconfigservice: ShareconfigService) { }

  showcommisionpayout = false;
  tdsshow = false;
  editdata: any;
 Savebutton='Save';
 disablesavebutton=false;
  checkedtype: any;
  CommissionValueFlag:boolean=false;
  Tab2details: any;
  forFixed: boolean = true;;
  forPercentage: boolean = false;
  buttontype: any;
  public TDSsectiondetails: any;
  Sharereferalcommisionform: FormGroup
  ngOnInit() {
    debugger;
    this.forFixed=false;
    this.forPercentage=true;
    this.Savebutton='Save';
    this.CommissionValueFlag=false;
    this.disablesavebutton=false;
    this.Sharereferalcommisionform = this.fb.group({
      "precordid": 0,
      "pshareconfigid": 0,
      "psharename": (''),
      "psharecode": (''),
      "pisreferralcommissionapplicable": (false),
      "preferralcommissiontype": ('Percentage'),
      "pcommissionValue": 0,
      "pistdsapplicable": (false),
      "ptdsaccountid": (''),
      "ptdssection": (''),
      "ptdspercentage": 0,
      "pCreatedby": this._commonservice.pCreatedby

    })
    this.getTDSsectiondetails()
   if(this.sharenameedit){
    this.buttontype = this.shareconfigservice.Newstatus();
   }
   else{
     this.buttontype='New';
   }
    if (this.buttontype == "edit") {
      debugger
      this.editdata = this.shareconfigservice.SetTab3data()

      console.log(this.editdata)
      if(this.editdata){
      this.Sharereferalcommisionform.controls.pisreferralcommissionapplicable.setValue(this.editdata.pisreferralcommissionapplicable)
      if (this.editdata.pisreferralcommissionapplicable == true) {
        // if (this.editdata.preferralcommissiontype == "Fixed" || this.editdata.preferralcommissiontype == "Percentage") 
        // {
        //  
        //   
        //  
        // }
        this.Sharereferalcommisionform.controls.pisreferralcommissionapplicable.setValue(this.editdata.pisreferralcommissionapplicable)
        this.Sharereferalcommisionform.controls.preferralcommissiontype.setValue(this.editdata.preferralcommissiontype)
         this.Sharereferalcommisionform.controls.pcommissionValue.setValue(this.editdata.pcommissionValue)
        this.showcommisionpayout = true;
        let type = (this.editdata.preferralcommissiontype);
        if (type == 'Fixed') {
          this.forFixed = true;
          this.forPercentage = false;
        }
        else {
          this.forFixed = false;
          this.forPercentage = true;
        }
        if (this.editdata.pistdsapplicable == true) {

          this.Sharereferalcommisionform.controls.pistdsapplicable.setValue(this.editdata.pistdsapplicable)
          this.tdsshow = true
          this._TdsService.getTDSsectiondetails().subscribe(
            (json) => {

              if (json != null) {
                this.TDSsectiondetails = json;
              }
              this.Sharereferalcommisionform.controls.ptdssection.setValue(this.editdata.ptdssection)
            })

        }
        else {
          this.Sharereferalcommisionform.controls.pistdsapplicable.setValue(this.editdata.pistdsapplicable)
        }
      }
      else {
        this.Sharereferalcommisionform.controls.pistdsapplicable.setValue(false)
      }
      this.Sharereferalcommisionform.controls.psharecode.setValue(this.editdata.psharecode)
      this.Sharereferalcommisionform.controls.psharename.setValue(this.editdata.psharename)
      this.Sharereferalcommisionform.controls.pshareconfigid.setValue(this.editdata.pshareconfigid)
      this.Sharereferalcommisionform.controls.precordid.setValue(this.editdata.precordid)
    }
    }
  }

  // checkedfixed(event) {
  //   debugger
  // this.forFixed=true
   
  //   if (this.buttontype == "edit") {
  //     if (this.editdata.preferralcommissiontype == "Fixed") 
  //     {
  //       this.forFixed = true;
  //       this.Sharereferalcommisionform.controls.preferralcommissiontype.setValue(this.editdata.preferralcommissiontype)
  //       this.Sharereferalcommisionform.controls.pcommissionValue.setValue(this.editdata.pcommissionValue)
       
       
  //     }
  //     else
  //      {
  //       this.forFixed = false
  //       this.Sharereferalcommisionform.controls.preferralcommissiontype.setValue('Fixed')
  //       this.Sharereferalcommisionform.controls.pcommissionValue.setValue("")
  //     }

  //   }
  

  // }
  onCommissionChange(event) {
    console.log("event taeget : ", event.target.value);
    let type = event.target.value;
    this.CommissionValueFlag=false;
    if (type == 'Fixed') {
      this.forFixed = true;
      this.forPercentage = false;
      this.Sharereferalcommisionform.patchValue({
        pcommissionValue: '',
        preferralcommissiontype: type
      })
    }
    else {
      this.forFixed = false;
      this.forPercentage = true;
      this.Sharereferalcommisionform.patchValue({
        pcommissionValue: '0',
        preferralcommissiontype: type
      })
    }
  }
  clear()
  {
  
    this.Sharereferalcommisionform.reset()
    this.forFixed=false;
    this.forPercentage=true;
    this.tdsshow=false;
    this.CommissionValueFlag=false;
    this.Savebutton='Save';
    this.disablesavebutton=false;
    this.showcommisionpayout=false;
    this.Sharereferalcommisionform
    this.Sharereferalcommisionform.controls.pisreferralcommissionapplicable.setValue(false);
    this.Sharereferalcommisionform.controls.pistdsapplicable.setValue(false)
    this.Sharereferalcommisionform.controls.pcommissionValue.setValue(0)
    this.Sharereferalcommisionform.controls.pshareconfigid.setValue(this.editdata.pshareconfigid)
    this.Sharereferalcommisionform.controls.ptdspercentage.setValue(0)
    this.Sharereferalcommisionform.controls.precordid.setValue(this.editdata.precordid)
    this.Sharereferalcommisionform.controls.pCreatedby.setValue(this._commonservice.pCreatedby)
    this.Sharereferalcommisionform.controls.psharename.setValue(this.editdata.psharename)
    this.Sharereferalcommisionform.controls.psharecode.setValue(this.editdata.psharecode)
    this.Sharereferalcommisionform.controls.ptdsaccountid.setValue(this.editdata.ptdsaccountid)
    this.Sharereferalcommisionform.controls.ptdssection.setValue(this.editdata.ptdssection)
    this.Sharereferalcommisionform.controls.preferralcommissiontype.setValue(this.editdata.preferralcommissiontype)

  }

  getTDSsectiondetails(): void {

    this._TdsService.getTDSsectiondetails().subscribe(
      (json) => {

        if (json != null) {
          this.TDSsectiondetails = json;
        }
      },
      (error) => {

        this._commonservice.showErrorMessage(error);
      }
    );
  }
  tdsCheck(event) {
    this.Sharereferalcommisionform.controls.ptdssection.setValue('');
    if (event.target.checked) {
      this.tdsshow = true;
      this.Sharereferalcommisionform.controls.pistdsapplicable.setValue(true)     
    }
    else {
      this.tdsshow = false
      
    }

  }
  validatetds()
  {
     let isValid = true;
   if(this.tdsshow==true)
   {
    if(this.Sharereferalcommisionform.controls.ptdssection.value=="")
    {
      this._commonservice.showWarningMessage("please select section No");
      isValid=false
    }
   }
      
    
    return isValid
  }
  Getsharecapitaldetails() {
    debugger
    this.Tab2details = this.shareconfigservice.Sendsharenameandcodedetails()
    console.log(this.Tab2details)
  }
  // checkedpercentage(event)
  //  {
  //   debugger
   
  //   if (this.buttontype == "edit") {
  //     if (this.editdata.preferralcommissiontype == "Percentage") 
  //     {
  //       this.forPercentage=true
  //       this.Sharereferalcommisionform.controls.preferralcommissiontype.setValue(this.editdata.preferralcommissiontype)
  //       this.Sharereferalcommisionform.controls.pcommissionValue.setValue(this.editdata.pcommissionValue)
  //     }
  //     else {
  //       this.forPercentage=true
  //       this.Sharereferalcommisionform.controls.preferralcommissiontype.setValue("Percentage");
  //       this.Sharereferalcommisionform.controls.pcommissionValue.setValue("")
  //     }
  //   }


  // }
  Referralexists(event) {
    debugger;
    this.forFixed=false;
    this.CommissionValueFlag=false;
    this.forPercentage=true;
    if (event.target.checked) {
      this.showcommisionpayout = true; 
      this.Sharereferalcommisionform.controls.preferralcommissiontype.setValue('Percentage');
      this.Sharereferalcommisionform.controls.pisreferralcommissionapplicable.setValue(true)

    }
    else {
      this.showcommisionpayout = false;
      this.Sharereferalcommisionform.controls.preferralcommissiontype.setValue('');
      this.Sharereferalcommisionform.controls.pistdsapplicable.setValue(false)
      this.clear()
    }


  }
CommissionValue_change(event){
  debugger;
  let commissionvalue=event.target.value;
  if(commissionvalue!=''){
    this.CommissionValueFlag=false;
  }
  else{
   this.CommissionValueFlag=true;
  }
}
  saveshareReferralform() {
    debugger
   
     if(this.validatetds())
     {
      if (this.buttontype == "New") {
        this.Getsharecapitaldetails();
        this.Sharereferalcommisionform.controls.pshareconfigid.setValue(this.Tab2details.pshareconfigid)
        this.Sharereferalcommisionform.controls.psharename.setValue(this.Tab2details.psharename)
        this.Sharereferalcommisionform.controls.psharecode.setValue(this.Tab2details.psharecode)
      }
      let IsReferralCommission = this.Sharereferalcommisionform.controls.pisreferralcommissionapplicable.value;
    if (IsReferralCommission) {
        let commisionval=this.Sharereferalcommisionform.controls.pcommissionValue.value;
                   
      //commisionval = parseFloat(commisionval.toString().replace(/,/g, ""));
      if(commisionval==null || commisionval=='' || commisionval==0){
          this.Sharereferalcommisionform.controls.pcommissionValue.setValue('');
          this.CommissionValueFlag=true;
           this._commonservice.showWarningMessage('Commision Value Must be Greater Than Zero.');
           return;
      }
      this.Sharereferalcommisionform.controls.pcommissionValue.setValue(commisionval);
      
    }
      let data = JSON.stringify(this.Sharereferalcommisionform.value)
      console.log(data)
      this.Savebutton='Processing';
      this.disablesavebutton=true;
      this.shareconfigservice.SaveShareConfigurationReferralDeatils(data).subscribe(res => {
        if (res) {
          this.Savebutton='Save';
          this.disablesavebutton=false;
          if (this.buttontype == "New") {
            this._commonservice.showInfoMessage("Saved Sucessfully");
          }
          else {
            this._commonservice.showInfoMessage("Updated Sucessfully");
          }
  
          this.router.navigateByUrl("/SharesConfigView")
  
  
        }
  
      })
     }
   
  }
}
