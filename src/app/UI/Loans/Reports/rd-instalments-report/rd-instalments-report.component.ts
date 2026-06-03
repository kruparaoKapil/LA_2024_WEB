import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { RdReceiptService } from 'src/app/Services/Banking/Transactions/rd-receipt.service';
import { RdInstallmentsChartService } from 'src/app/Services/Banking/Transactions/rd-installments-chart.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-rd-instalments-report',
  templateUrl: './rd-instalments-report.component.html',
  styleUrls: []
})
export class RdInstalmentsReportComponent implements OnInit {
  RdinstalmentsForm: FormGroup;
  membertypedetails:any=[];
  memberdetails:any=[];
  formValidationMessages:any;
  AccountDetails:any=[];
  rdinstalmentsdata:any=[];
  public savebutton = 'Show';
  public loading = false;
  public savebuttonloading = false;
  fileName:any;
  constructor(private formbuilder: FormBuilder, private _commonService: CommonService, private _RdReceiptService: RdReceiptService, private _RdInstallmentsChartService:RdInstallmentsChartService,private datepipe: DatePipe) { }

  ngOnInit() {
    debugger
    this.fileName='';
    this.formValidationMessages = {};
    this.membertypedetails=[];
    this.RdinstalmentsFormGroup();
    this.GetMemberTypeDetails();
    this.BlurEventAllControll(this.RdinstalmentsForm);
  }
  RdinstalmentsFormGroup(){
    this.RdinstalmentsForm = this.formbuilder.group({
      pMembertypeid: [''],
      pMembertype: ['', Validators.required],
      pMemberid: [''],
      pMembername: ['', Validators.required],
      pMembercode: [''],
      pAccountid: [''],
      pAccountno: ['', Validators.required]    
    });
  }
  public GetMemberTypeDetails() {
     this._commonService.Getmemberdetails('RECURRING DEPOSIT').subscribe(json => {
      this.membertypedetails = json;
    });
  }
 
  MemberTypeChange(event) {
    debugger;
    if (event != undefined && event != "" && event != null) {
      this.fileName='';
      this.memberdetails=[];
      this.RdinstalmentsForm.controls.pMemberid.setValue('');
      this.RdinstalmentsForm.controls.pMembername.setValue('');
      this.RdinstalmentsForm.controls.pMembercode.setValue('');
      this.formValidationMessages.pMembername = '';
      this.AccountDetails=[];
      this.RdinstalmentsForm.controls.pAccountid.setValue('');
      this.RdinstalmentsForm.controls.pAccountno.setValue('');
      this.rdinstalmentsdata=[];
      this.formValidationMessages.pAccountno = '';
      this.RdinstalmentsForm.controls.pMembertype.setValue(event.pmembertype);
      this.RdinstalmentsForm.controls.pMembertypeid.setValue(event.Membertypeid);
      this.GetMemberDetails(event.pmembertype);
    }
  }

  GetMemberDetails(MemberType) {
    debugger
    this._RdReceiptService.GetMemberDetails(MemberType).subscribe(json => {
      this.memberdetails = json
    })
  }
  MemberChanges(event) {
    debugger
    if (event) {
      this.fileName='';
      this.AccountDetails=[];
      this.RdinstalmentsForm.controls.pAccountid.setValue('');
      this.RdinstalmentsForm.controls.pAccountno.setValue('');
      this.formValidationMessages.pAccountno = '';
      this.rdinstalmentsdata=[];
      this.RdinstalmentsForm.controls.pMemberid.setValue(event.pMemberid);
      this.RdinstalmentsForm.controls.pMembername.setValue(event.pName);
      this.RdinstalmentsForm.controls.pMembercode.setValue(event.pMembercode);
     this.GetAccountDetails(event.pMembercode);
    }
  }
  GetAccountDetails(Membercode) {
    debugger
    this._RdReceiptService.GetAccountDetails(Membercode).subscribe(json => {
      this.AccountDetails = json["rdAccountDetailsDTOList"];
    });
  }

AccountChanges(event) {
    debugger;
    this.rdinstalmentsdata=[];
    this.fileName='';
    this.RdinstalmentsForm.controls.pAccountid.setValue(event.paccountid);
    this.RdinstalmentsForm.controls.pAccountno.setValue(event.paccountno);
 
   }
  
  Showrdinstalmentsdetails(){
    let isValid = true;
    debugger
    if (this.checkValidations(this.RdinstalmentsForm, isValid)) {
    let Rdaccountno= this.RdinstalmentsForm.controls.pAccountno.value;
    let Membername=this.RdinstalmentsForm.controls.pMembername.value;
      this._RdInstallmentsChartService.GetMemberDetails(Rdaccountno).subscribe(json => {
        debugger;
        if (json) {
          this.rdinstalmentsdata = json;
          for(let i=0;i<this.rdinstalmentsdata.length;i++){
            let rdidate=this.rdinstalmentsdata[i].pinstalmentdate;
            let crdidate=this.datepipe.transform(rdidate, "dd/MM/yyyy");;
            this.rdinstalmentsdata[i].pinstalmentdate=crdidate;
          }
          
          this.fileName=Membername+'-'+Rdaccountno;
          //this.totalinstalmentamount = this.InstalmentsReportData.reduce((sum, c) => sum + c.pinstalmentamount, 0).toFixed(2);
        }
      });
    }
  }






  BlurEventAllControll(fromgroup: FormGroup) {
    try {
      Object.keys(fromgroup.controls).forEach((key: string) => {
        this.setBlurEvent(fromgroup, key);
      })
    }
    catch (e) {
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

            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                let lablename;
                lablename = (document.getElementById(key) as HTMLInputElement).title;
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
      return false;
    }
    return isValid;
  }
}
