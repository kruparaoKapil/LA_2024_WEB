import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PreclosureService } from 'src/app/Services/Loans/Masters/preclosuremaster.service';
import { ToastrService } from 'ngx-toastr';
import { LoansmasterService } from 'src/app/Services/Loans/Masters/loansmaster.service';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/Services/common.service';


@Component({
  selector: 'app-preclosure-master',
  templateUrl: './preclosure-master.component.html',
  styles: []
})
export class PreclosureMasterComponent implements OnInit {

  constructor(private router:Router, private _preclosuremaster: PreclosureService, private toastr: ToastrService, private _loanmasterservice: LoansmasterService, private _commonservice:CommonService) { }
  loanTypes;
  loanNames;
  submitted = false;
  editinfo: any;
  public loading =false;
  public isLoading: boolean = false;
  ploantypeid;
  buttonname = "Save";
  showchargetype = false;
  showinclude = false;
  showexclude = true;
  dataBind: any;
  status:any;
  disable=false;
  fixedcharge:any;
  Preclouserchargesform:FormGroup;

  



  ngOnInit() {
    this.Preclouserchargesform = new FormGroup({
      pLoantypeid: new FormControl('', Validators.required),
      //pRecordid:['']
      pLoanid: new FormControl('', Validators.required),
      pLockingperiod: new FormControl('', Validators.required),
      pLockingperiodtype: new FormControl('', Validators.required),
      pIschargeapplicable: new FormControl('Y'),
      pChargecaltype: new FormControl('percentage'),
      pChargecalonfield: new FormControl('Future and Outstanding Principal'),
      pChargesvalue: new FormControl('', Validators.required),
      pIstaxapplicable: new FormControl('Y'),
      pTaxtype: new FormControl('excluded'),
      pTaxpercentage: new FormControl('', Validators.required),
      pCreatedby: new FormControl(this._commonservice.pCreatedby)
    });
    this._preclosuremaster.getLoanTypes().subscribe(data => {
      this.loanTypes = data;
    })
    this.status=this._preclosuremaster.sendStatusToPreclosureMaster();
    if(this.status == "update"){
      this.disable=true;
      this.editinfo = this._preclosuremaster.getEditInformation();
      this.buttonname ="Update";
      this.loading = true;
      this._preclosuremaster.getDatatobind(this.editinfo).subscribe(data => {
        
        this.dataBind = data[0];
        
        this.ploantypeid = this.dataBind["pLoantypeid"];
        if (this.dataBind["pChargecaltype"] == "fixed") {
          this.showchargetype = true;
          this.dataBind.pChargesvalue=this._commonservice.currencyformat(this.dataBind.pChargesvalue);

        }

        if (this.dataBind["pTaxtype"] == "Included") {
          this.showinclude = true;
          this.showexclude = false;
          
        }

        if (this.dataBind["pTaxtype"] == "excluded") {
          this.showexclude = true;
          this.showinclude = false;
         
        }

        if (this.dataBind["pTaxtype"] == "nogst") {
          this.showinclude = false;
          this.showexclude = false;
          
        }

        this._loanmasterservice.getLoanMasterLoanNames(this.ploantypeid).subscribe(data => {

          this.loanNames = data;
        });
        
        this.Preclouserchargesform.setValue({ "pLoantypeid": this.dataBind["pLoantypeid"],"pCreatedby":this._commonservice.pCreatedby, "pIschargeapplicable": this.dataBind["pIschargeapplicable"], "pLoanid": this.dataBind["pLoanid"], "pIstaxapplicable": this.dataBind["pIstaxapplicable"], "pLockingperiod": this.dataBind["pLockingperiod"], "pLockingperiodtype": this.dataBind["pLockingperiodtype"], "pChargecaltype": this.dataBind["pChargecaltype"], "pChargesvalue": this.dataBind["pChargesvalue"], "pChargecalonfield": this.dataBind["pChargecalonfield"], "pTaxtype": this.dataBind["pTaxtype"], "pTaxpercentage": this.dataBind["pTaxpercentage"] });
        this.loading = false;
      },error=>{this.toastr.error(error, 'Error');
      this.loading = false;})
     
    }
   
   
  }
  
 
  
  fixedchargetype() {
    
    
    this.showchargetype = true;
    if (this.buttonname == "Save") {
      this.Preclouserchargesform.controls.pChargesvalue.setValue("");
      this.Preclouserchargesform.controls.pChargecalonfield.setValue("");
    }
    if (this.buttonname == "Update") {
      if (this.dataBind["pChargecaltype"] == "fixed") {
        this.Preclouserchargesform.controls.pChargesvalue.setValue(this.dataBind["pChargesvalue"]);
        this.Preclouserchargesform.controls.pChargecalonfield.setValue("");
      }
      else {
        this.Preclouserchargesform.controls.pChargesvalue.setValue("");
      }
    }
  }
  percentagechargetype() {
    this.showchargetype = false;
    this.Preclouserchargesform.controls.pChargesvalue.setValue("");
    this.Preclouserchargesform.controls.pChargecalonfield.setValue("Future and Outstanding Principal");
    if (this.buttonname == "Update") {
      if (this.dataBind["pChargecaltype"] == "percentage") {
        this.Preclouserchargesform.controls.pChargesvalue.setValue(this.dataBind["pChargesvalue"]);
      }
      else {
        this.Preclouserchargesform.controls.pChargesvalue.setValue("");
      }
    }
  }

  includedgst() {
    
    this.showinclude = true;
    this.showexclude = false;
    if (this.buttonname == "Save") {
      this.Preclouserchargesform.controls.pTaxpercentage.setValue("");
    }
    if (this.buttonname == "Update") {
      if (this.dataBind["pTaxtype"] == "Included") {
        this.Preclouserchargesform.controls.pTaxpercentage.setValue(this.dataBind["pTaxpercentage"]);
      }
      else {
        this.Preclouserchargesform.controls.pTaxpercentage.setValue("");
      }
    }
    this.Preclouserchargesform.controls.pIstaxapplicable.setValue("Y");
  }

  excludedgst() {
    
    this.showexclude = true;
    this.showinclude = false;
    if (this.buttonname == "Save") {
      this.Preclouserchargesform.controls.pTaxpercentage.setValue("");
    }
    if (this.buttonname == "Update") {
      if (this.dataBind["pTaxtype"] == "excluded") {
        this.Preclouserchargesform.controls.pTaxpercentage.setValue(this.dataBind["pTaxpercentage"]);
      }
      else {
        this.Preclouserchargesform.controls.pTaxpercentage.setValue("");
      }
    }
    this.Preclouserchargesform.controls.pIstaxapplicable.setValue("Y");
  }

  nogst() {
    this.showinclude = false;
    this.showexclude = false;
    this.Preclouserchargesform.controls.pTaxpercentage.setValue("0");
    this.Preclouserchargesform.controls.pIstaxapplicable.setValue("N");
  }


savePreclouserchargesform() {

    this.submitted = true;
    if(this.Preclouserchargesform.controls.pChargecaltype.value=="fixed"){
      this.Preclouserchargesform.controls.pChargesvalue.setValue(this.Preclouserchargesform.controls.pChargesvalue.value.toString().replace(/,/g, ""));
    }
   //console.log(this.Preclouserchargesform.value)
    if (this.buttonname == "Save" &&  this.Preclouserchargesform.valid==true) {
    
      this._preclosuremaster.checkPreClosureDuplicates(this.Preclouserchargesform.value['pLoanid']).subscribe(data=>{
      
      this.buttonname="Processing";
      this.isLoading=true;
        if(data){
          this.toastr.info("Already Exists",'Info');
          this.clear();
          this.buttonname="Save";
          this.isLoading=false;
        }
        else{
         
  
          let formdata = JSON.stringify(this.Preclouserchargesform.value);
          this._preclosuremaster.sendPreclosurechargesform(formdata).subscribe( value=> {
            
            this.toastr.success("Saved Successfully", 'Success')
            this.router.navigateByUrl("/PreclosureView")
            this.buttonname="Save";
            this.isLoading=false;
          },error=>{this.toastr.error(error, 'Error')
          this.buttonname="Save";
          this.isLoading=false;})
        
       
        }
      },error=>{this.toastr.error(error, 'Error');
      this.buttonname="Save";
      this.isLoading=false;
    })
      
    }
    if (this.buttonname == "Update" &&  this.Preclouserchargesform.valid==true ) {
      this.buttonname="Processing";
      this.isLoading=true;
      if (this.Preclouserchargesform.value["pChargecaltype"] == "fixed") {
        this.Preclouserchargesform.controls.pChargecalonfield.setValue("");
      }
     if(this.Preclouserchargesform.value["pTaxtype"] =="Included" || this.Preclouserchargesform.value["pTaxtype"] =="excluded")
      {
        this.Preclouserchargesform.controls.pIstaxapplicable.setValue("Y");
      }
      else{
        this.Preclouserchargesform.controls.pIstaxapplicable.setValue("N");
      }
      let recordid=this._preclosuremaster.getEditInformation()
      this.Preclouserchargesform.value["pRecordid"]=recordid.pRecordid;
      let updateddata = JSON.stringify(this.Preclouserchargesform.value);
    
      this._preclosuremaster.saveUpdatedform(updateddata).subscribe(data => {
       
        if(data){
          this.toastr.success("Updated Successfully", 'Success')
          this.router.navigateByUrl("/PreclosureView")
        }
        this.buttonname="Save";
        this.isLoading=false;
      },error=>{this.toastr.error(error, 'Error');
      this.buttonname="Save";
      this.isLoading=false;})
    }
  }

  getLoanTypeId(event) {
      
    
    this.Preclouserchargesform.controls.pChargesvalue.setValue("");
    this.Preclouserchargesform.controls.pLockingperiod.setValue("");
    this.Preclouserchargesform.controls.pLockingperiodtype.setValue("");
    this.Preclouserchargesform.controls.pTaxpercentage.setValue("");
    this._loanmasterservice.getLoanMasterLoanNames(event.target.value).subscribe(data => {
      this.loanNames = data;
    })
  }

  showErrorMessage(errormsg: string) {
     
    this.toastr.error(errormsg);
  }
  showInfoMessage(errormsg: string) {
     
    this.toastr.success(errormsg);
  }

  clear() {
    
    this.submitted = false;
    this.showinclude = false;
    this.showexclude = true;
    this.showchargetype = false;
   
    this.Preclouserchargesform.reset();
    this.Preclouserchargesform.controls.pChargecaltype.setValue("percentage");
    this.Preclouserchargesform.controls.pChargecalonfield.setValue("Future and Outstanding Principal");
    this.Preclouserchargesform.controls.pTaxtype.setValue("excluded");

    this.Preclouserchargesform.controls.pTaxpercentage.setValue("");
    this.Preclouserchargesform.controls.pLoantypeid.setValue("");
    this.Preclouserchargesform.controls.pLoanid.setValue("");
    this.Preclouserchargesform.controls.pLockingperiodtype.setValue("");
    this.Preclouserchargesform.controls.pCreatedby.setValue(this._commonservice.pCreatedby)
    if(this.buttonname=="Update"){
      
      this.Preclouserchargesform.controls.pLoantypeid.setValue(this.dataBind["pLoantypeid"]);
      this.Preclouserchargesform.controls.pLoanid.setValue(this.dataBind["pLoanid"])
    }
   
  }
  trackByFn(index, item) {
    return index; // or item.id
  }
}
