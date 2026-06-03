import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { AccountingMastresService } from 'src/app/Services/Accounting/accounting-mastres.service';

import { ToastrService } from 'ngx-toastr';

import { Router } from '@angular/router';

@Component({
  selector: 'app-chequemanagement-master',
  templateUrl: './chequemanagement-master.component.html',
  styles: []
})
export class ChequemanagementMasterComponent implements OnInit {

  chequemanagementform: FormGroup
  chequemanagementvalidations: any = {}
  bankdetails: any;
  bookid: any;
  recordid: any;
  totalcheques: any;
  selectedbank: any;
  noofcheque: any;
  cheq: any;
  bankname: any;
  buttonname = "Save"
  buttonnameactive = "Save & Generate"
  fromcheqno: 0;
  tocheqno = 0;
  pageSize=10;
  gridData: any = []
  public disablesavebutton = false;
  public disablesaveactivebutton = false;
  constructor(private fb: FormBuilder, private router: Router, private toaster: ToastrService, private _commonservice: CommonService, private accountingmasterservice: AccountingMastresService) { }


  ngOnInit() {
    this.chequemanagementform = this.fb.group
      ({
        pBankId: [''],
        pBankname: ['', Validators.required],
        pNoofcheques: ['', Validators.required],
        pChequeto: ['', Validators.required],
        pChequefrom: ['', Validators.required],
        pChqegeneratestatus: [''],
        pStatusname: ['Active'],
        ptypeofoperation: ['CREATE'],
        pCreatedby: [this._commonservice.pCreatedby],

      })


    this.BlurEventAllControll(this.chequemanagementform)
    this.accountingmasterservice.GetBAnkDetails().subscribe(data => {
      this.bankdetails = data
      //console.log(this.bankdetails)
    })

  }
  validategridData(): boolean {
    let isValid = true;

    //let dependentOnLoanRange = this.chargesConfigForm.controls.pIsChargedependentOnLoanRange.value;

    if (this.chequemanagementform.controls['pNoofcheques'].value == "") {

      this.chequemanagementvalidations['pNoofcheques'] = "Upi ID Required"
      isValid = false;
    }

    if (this.chequemanagementform.controls['pChequeto'].value == "") {

      this.chequemanagementvalidations['pChequeto'] = "Upi Link with";
      isValid = false;
    }
    if (this.chequemanagementform.controls['pChequefrom'].value == "") {

      this.chequemanagementvalidations['pChequefrom'] = "Upi Link with";
      isValid = false;
    }
    let fromcheq;
    let tocheq;
    if (this.chequemanagementform.controls.pChequefrom.value != null)
      fromcheq = parseFloat(this.chequemanagementform.controls.pChequefrom.value.toString().replace(/,/g, ""));
    if (this.chequemanagementform.controls.pChequeto.value != null)
      tocheq = parseFloat(this.chequemanagementform.controls.pChequeto.value.toString().replace(/,/g, ""));

    // let Applicanttype = this.chequemanagementform.controls.pApplicanttype.value;


    let data = this.gridData;
    if (data != null) {
      if (data.length > 0) {


        for (let i = 0; i < data.length; i++) {

          let fromchq;
          let tochq;
          if (data[i].pChequefrom != null)
            fromchq = parseFloat(data[i].pChequefrom.toString().replace(/,/g, ""));
          if (data[i].pChequeto != null)
            tochq = parseFloat(data[i].pChequeto.toString().replace(/,/g, ""));



          if (this.selectedbank == data[i].pBankname) {

            if (parseFloat(fromcheq) >= parseFloat(fromchq) && parseFloat(fromcheq) <= parseFloat(tochq)) {
              //this.showErrorMessage('Given range already exists');
              isValid = false;
              break;
            }
            if (parseFloat(tocheq) >= parseFloat(fromchq) && parseFloat(tocheq) <= parseFloat(tochq)) {
              //this.showErrorMessage('Given range already exists');
              isValid = false;
              break;
            }
            if (parseFloat(fromcheq) <= parseFloat(fromchq) && parseFloat(tocheq) >= parseFloat(tochq)) {
              //this.showErrorMessage('Given range already exists');
              isValid = false;
              break;
            }
            if (parseFloat(fromcheq) >= parseFloat(fromchq) && parseFloat(tocheq) <= parseFloat(tochq)) {
              //this.showErrorMessage('Given range already exists');
              isValid = false;
              break;
            }


          }

        }
      }

    }

    return isValid;
  }

  addtoGrid() {

    
    let validate = true;


    
    if (this.checkValidations(this.chequemanagementform, validate)) {
      if (this.validategridData()) {
        this.accountingmasterservice.GetExistingChequeCount(this.recordid, this.fromcheqno, this.tocheqno).subscribe(res => {
          if (res == 0) {
            this.chequemanagementform['controls']['pCreatedby'].setValue(this._commonservice.pCreatedby)
            this.chequemanagementform['controls']['pStatusname'].setValue("Active")
            this.chequemanagementform['controls']['ptypeofoperation'].setValue("CREATE")
            this.gridData.push(this.chequemanagementform.value)
            this.totalcheques = "";
            this.fromcheqno = 0;
            this.tocheqno = 0;
            this.noofcheque = ""
            this.chequemanagementform['controls']['pNoofcheques'].setValue("")
            this.chequemanagementform['controls']['pChequefrom'].setValue("")
            this.chequemanagementform['controls']['pChequeto'].setValue("")
            this.chequemanagementvalidations['pNoofcheques'] = "";
            this.chequemanagementvalidations['pChequefrom'] = "";
            this.chequemanagementvalidations['pChequeto'] = "";
          }
          else {
            this.toaster.info("cheque No already exists", 'Info');

          }
        })

      }


    }

  }
  getrecordid(event) {
    
    for (let i = 0; i < this.bankdetails.length; i++) {
      if (event.target.value == this.bankdetails[i].pBankname) {
        //console.log(this.bankdetails[i].pRecordid)
        this.recordid = this.bankdetails[i].pRecordid
        this.selectedbank = this.bankdetails[i].pBankname
      }
    }

    this.chequemanagementform.controls['pBankId'].setValue(this.recordid)
    this.gridData = []

  }
  noofcheques($event) {
    
    this.totalcheques = 0;
    this.noofcheque = 0;

    this.noofcheque = ($event.target.value)


    if (this.noofcheque == 1) {
      this.chequemanagementform.controls['pChequeto'].setValue(this.fromcheqno)
    }

    else if (this.noofcheque != "" && this.noofcheque != undefined) {
      this.totalcheques = this.noofcheque - 1
      let ps = this.totalcheques
      if (ps != "" && ps != null && ps != -1) {

        if (ps.toString().includes(',')) {
          this.cheq = this.functiontoRemoveCommas(ps);
          this.cheq = +this.totalcheques;
        }
        else {
          this.cheq = +ps
        }
      }
    }

    if (this.chequemanagementform.controls['pChequefrom'].value != "" && this.chequemanagementform.controls['pNoofcheques'].value != 1
      && this.chequemanagementform.controls['pNoofcheques'].value != "") {
      this.tocheqno = +this.fromcheqno + this.cheq
      this.chequemanagementform.controls['pChequeto'].setValue(this.tocheqno)
    }



  }
  fromchequeno(event) {
    
    this.fromcheqno = event.target.value
    if (event.target.value == "") {

      this.chequemanagementform.controls['pChequeto'].setValue("")

    }

    else if (this.noofcheque == 1) {
      this.chequemanagementform.controls['pChequeto'].setValue(this.fromcheqno)
    }

    else if (this.totalcheques == 0 || this.totalcheques == undefined || this.totalcheques == -1) {

      this.chequemanagementform.controls['pChequeto'].setValue("")

    }
    else {
      this.fromcheqno = event.target.value
      let ps = this.totalcheques
      if (ps != "" && ps != null && ps != undefined && ps != -1) {

        if (ps.toString().includes(',')) {
          this.cheq = this.functiontoRemoveCommas(ps);
          this.cheq = +this.totalcheques;
        }
        else {
          this.cheq = +ps
        }
      }
      this.tocheqno = +this.fromcheqno + this.cheq
      this.chequemanagementform.controls['pChequeto'].setValue(this.tocheqno)
    }

    //console.log(this.tocheqno)
  }
  public functiontoRemoveCommas(value) {
    let a = value.split(',')
    let b = a.join('')
    let c = b
    return c;
  }
  checkValidations(group: FormGroup, validate: boolean): boolean {

    try {
      Object.keys(group.controls).forEach((key: string) => {
        validate = this.GetValidationByControl(group, key, validate);
      })
    }
    catch (e) {
      this.showErrorMessage(e);
      return false;
    }
    return validate;
  }
  GetValidationByControl(formGroup: FormGroup, key: string, validate: boolean): boolean {

    try {
      let formcontrol;
      formcontrol = formGroup.get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          this.checkValidations(formcontrol, validate)
        }
        else if (formcontrol.validator) {
          this.chequemanagementvalidations[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonservice.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.chequemanagementvalidations[key] += errormessage + ' ';
                validate = false;
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
    return validate;
  }
  showErrorMessage(errormsg: string) {

    this._commonservice.showErrorMessage(errormsg);
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
  removeHandler(event) {
    this.gridData.splice(event.rowIndex, 1);
  }
  save(type) {
    let validate = true;
    
debugger
    if (this.gridData.length > 0) {
      if (type == "Active") {
        this.disablesaveactivebutton = true;
        this.buttonnameactive = 'Processing'
      }
      else {
        this.disablesavebutton = true;
        this.buttonname = 'Processing'
      }
      this.chequemanagementform['controls']['pChqegeneratestatus'].setValue(type)
      let chequemanagement = { lstChequemanagementDTO: this.gridData }
      let chequemanagementdata = Object.assign(this.chequemanagementform.value, chequemanagement);

      //console.log(chequemanagementdata)
      let data = JSON.stringify(chequemanagementdata)
      this.accountingmasterservice.SaveChequeManagement(data).subscribe(saveddata => {
        debugger;
        if (saveddata) 
        {
          debugger
          this.disablesaveactivebutton = false;
          this.disablesavebutton = false;
          this.toaster.success("Saved Successfully", 'Success');
          this.router.navigateByUrl("/ChequemanagementView")
        }

      },(error) => {
        this._commonservice.showErrorMessage(error);
        this.disablesaveactivebutton = false;
          this.disablesavebutton = false;
         })
      //this.chequemanagementform.reset();
      //this.gridData=[]
    }

  }

  clear() {
    this.chequemanagementform.reset();
    this.gridData = []
    this.chequemanagementform['controls']['pNoofcheques'].setValue("")
    this.chequemanagementform['controls']['pChequefrom'].setValue("")
    this.chequemanagementform['controls']['pChequeto'].setValue("")
    this.totalcheques = ""
    this.fromcheqno = 0;
    this.tocheqno = 0;
    this.noofcheque = ""
    this.chequemanagementvalidations = {}



  }
}
