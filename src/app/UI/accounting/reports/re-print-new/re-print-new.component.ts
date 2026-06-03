import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { ToastrService } from 'ngx-toastr';
import { ReprintService } from 'src/app/Services/Accounting/reprint.service';
@Component({
  selector: 'app-re-print-new',
  templateUrl: './re-print-new.component.html',
  styles: []
})
export class RePrintNewComponent implements OnInit {
  public loading = false;
  public RePrintForm: FormGroup;
  public submitted = false;
  public paymentVouecherServicesData: any;
  public reprintData: any;
  public gridView: any;
  public savebutton = 'Generate Report';
  public isLoading = false;
  public Transactiontypename: string;
  public TransactiontypeData: any = [{"id":1,"maturityType":"Maturity"},{"id":2,"maturityType":"Pre-Maturity"}];
  public receiptno: any;
  public generalreceiptreportsshow = false;
  public selectedvalues: any = []
  pmaturitybondid: any;
  constructor(private datePipe: DatePipe, private _routes: Router, private formbuilder: FormBuilder, private _CommonService: CommonService, public toaster: ToastrService, private reprintservices: ReprintService) { }

  ngOnInit() {
    
    this.submitted = false;
    //this.transctionTypes();
    this.RePrintForm = this.formbuilder.group({
      Transactiontype: ['',Validators.required],
      TransactionNo: ['', Validators.required]
    })
  }

  transChange(event){
    debugger;
  }
  get f() { return this.RePrintForm.controls; }

  public showErrorMessage(errormsg: string) {
    this._CommonService.showErrorMessage(errormsg);
  }

  public showInfoMessage(errormsg: string) {
    this._CommonService.showInfoMessage(errormsg);
  }

  //----------------VALIDATION----------------------- //
  public checkValidations(group: FormGroup, isValid: boolean): boolean {
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
  public GetValidationByControl(formGroup: FormGroup, key: string, isValid: boolean): boolean {
    try {
      let formcontrol;
      formcontrol = formGroup.get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          this.checkValidations(formcontrol, isValid)
        }
        else if (formcontrol.validator) {
          this.paymentVouecherServicesData[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.paymentVouecherServicesData[key] += errormessage + ' ';
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
  public BlurEventAllControll(fromgroup: FormGroup) {
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
  public setBlurEvent(fromgroup: FormGroup, key: string) {
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

  getReprintReport() {
    debugger
    this.submitted = true;
   
    if (this.RePrintForm.valid) {
      this.generalreceiptreportsshow = false;
      let sendreceiptno = this.RePrintForm.controls['TransactionNo'].value;
      let maturityType = this.RePrintForm.controls['Transactiontype'].value;

     this.reprintservices.getMaturityBondConut(sendreceiptno,maturityType).subscribe(res => {
      if(res.count == 0){
        this.toaster.info('Invalid Account Number');
        this.RePrintForm.controls['TransactionNo'].setValue('');
        this.isLoading = false;
        this.savebutton = 'Generate Report';
        return;
      }
      else{     

      this.reprintservices.GetMaturitybondprintbyid(sendreceiptno).subscribe(respon => {
        this.pmaturitybondid = respon.pmaturitybondid;

        if (maturityType == 'Pre-Maturity') {
          let receipt = btoa(this.pmaturitybondid + ',' + 'Pre-Maturity');
          window.open('/#/PreMaturityDetailsPreview?id=' + receipt);
        }
  
        if (maturityType == 'Maturity') {
          let receipt = btoa(this.pmaturitybondid + ',' + 'Maturity');
          window.open('/#/PreMaturityDetailsPreview?id=' + receipt);
        }
      })
      }
     })
     }
  } 

}
