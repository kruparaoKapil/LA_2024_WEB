import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe, JsonPipe } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AccountingMastresService } from 'src/app/Services/Accounting/accounting-mastres.service';
import { State } from '@progress/kendo-data-query';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/Services/common.service';
import { AddressComponent } from 'src/app/UI/Common/address/address.component';
import { debug } from 'util';
import { DataBindingDirective } from '@progress/kendo-angular-grid';

import { Router } from '@angular/router';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { daysInMonth } from 'ngx-bootstrap/chronos/units/month';

@Component({
  selector: 'app-bank-master',
  templateUrl: './bank-master.component.html',
  styles: []
})
export class BankMasterComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  @ViewChild(AddressComponent, { static: false }) addressdetails;
  AdresssDetailsForm: any;
  accuntnumber = false;
  upiname: any = []
  duplicateupi = "";
  duplicatebank = "";
  duplicatedebitcard = 0;
  duplicateaccountno = "";
  todate = false;
  openingbls: any;
  openingtype = false;
  submitted = false;
   minDate: Date = new Date();
  maxDate: Date = new Date()
  public loading = false;
  buttonname = "Save"
  date: any;
  disable = false;
  debitcard: any;
  cardno = false;
  accountno = false;
  datatobind: any;
  editdata: any
  public disablesavebutton = false;
  checkduplicate: any;
  validationforupigriddata = false;
  validationfordebitcarddetails = false;
  upigridvalidation = false;
  upisetup: any = {}
  addressvalid: any;
  bankmastervalidations: any = {};
  gridData: any = []
  debitcarddetails = false;
  bankupidetails = false;
  addressstatus: false;
  buttontype: any;
  debitcardhideandshow: any;
  bankupihideandshow: any;
  public gridState: State = {
    sort: [],
    take: 10
  };


  public pageSize = 2;
  public skip = 0;
  bankmasterform: FormGroup
  public currentdate: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public ddpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  constructor(private fb: FormBuilder, private router: Router, private toaster: ToastrService, private _commonService: CommonService, private datepipe: DatePipe, private _accountingmasterserive: AccountingMastresService) {
    this.dpConfig.containerClass = 'theme-dark-blue';
    this.dpConfig.showWeekNumbers = false;

    this.dpConfig.maxDate = new Date();
    //this.dpConfig.minDate = new Date();
    this.dpConfig.dateInputFormat = 'MM/YYYY'

    this.ddpConfig.containerClass = 'theme-dark-blue';
    this.ddpConfig.showWeekNumbers = false;
    //this.ddpConfig.maxDate = new Date();
    this.ddpConfig.minDate = new Date();
    this.ddpConfig.dateInputFormat = 'MM/YYYY'
  }
  ValidFrom(event){
debugger;


if((event)>new Date())
{
  console.log(event);
  this.bankmasterform.controls.pValidfrom.setValue("")
}
  }
  ValidTo(event){
    debugger;
    
    
    if((event)<new Date())
    {
      console.log(event);
      this.bankmasterform.controls.pValidto.setValue("")
    }
      }
  public onOpenCalendar(container) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
  }
  ngOnInit() {

    this.bankupihideandshow = false;
    this.debitcardhideandshow = false;
    this.bankmasterform = this.fb.group
      ({
        pCreatedby: [this._commonService.pCreatedby],
        pBankdate: [''],
        pAcctountype: [''],
        pBankname: ['', Validators.required],
        pBankbranch: [''],
        pAccountnumber: [''],
        pIfsccode: [''],
        pAccountname: [''],
        pOverdraft: [''],
        pOpeningBalance: [''],
        pOpeningBalanceType: [''],
        pRecordid: ['0'],
        pStatusname: ['Active'],
        ptypeofoperation: ['CREATE'],
        pCardNo: [],
        pIsdebitcardapplicable: [false],
        pCardName: [''],
        pValidfrom: [''],
        pValidto: [''],
        pUpiid: [''],
        pUpiname: [''],
        popeningjvno: [''],
        pIsupiapplicable: [false],
        pAddress1: [''],
        pAddress2: [''],
        pCity: [''],
        pState: [''],
        pDistrict: [''],
        pBankId: [''],
        pPincode: [''],
        pCountry: [''],
        lstBankdebitcarddtlsDTO: this.fb.array([]),
        lstBankUPI: [],
        //lstChequemanagement :this.fb.array([]),
        lstBankInformationAddressDTO: this.fb.array([]),
      })
    this.currentdate.containerClass = 'theme-dark-blue';
    this.currentdate.showWeekNumbers = false;
    this.currentdate.minDate = new Date();
    this.currentdate.maxDate = new Date();
    this.currentdate.dateInputFormat = 'DD/MM/YYYY';
    this.date = new Date();
    this.bankmasterform['controls']['pBankdate'].setValue(this.date);
    this.bankmasterform['controls']['pOpeningBalanceType'].setValue('D')
    this.BlurEventAllControll(this.bankmasterform)
    this._accountingmasterserive.GetBankUPIDetails().subscribe(data => {
      this.upiname = data
    })

    this.buttontype = this._accountingmasterserive.newstatus();
    //console.log(this.buttontype)

    if (this.buttontype == "edit") {
       debugger;
      this.editdata = this._accountingmasterserive.editbankdetails();
      //console.log( this.editdata)
      this.loading = true;
      this._accountingmasterserive.viewbank(this.editdata).subscribe(data => {

        // console.log(data)
        debugger
        this.datatobind = data
        this.buttonname = "Update"
        this.disable = true;
        this.loading = false;
        this.bankmasterform.controls['pBankdate'].setValue(this._commonService.formatDateFromDDMMYYYY(this.datatobind.pBankdate))
        this.bankmasterform.controls['pBankname'].setValue(this.datatobind.pBankname)
        this.bankmasterform.controls['pBankbranch'].setValue(this.datatobind.pBankbranch)
        //  this.bankmasterform.controls['pRecordid'].setValue(this.datatobind.pRecordid)
        if (this.datatobind.pAccountnumber != '' && this.datatobind.pAccountnumber != null) {
          this.accountno = true;
          this.bankmasterform.controls['pAccountnumber'].setValue(this.datatobind.pAccountnumber)
        }
        else {
          this.bankmasterform.controls['pAccountnumber'].setValue('')
        }
        this.bankmasterform.controls['pAccountnumber'].setValue(this.datatobind.pAccountnumber)
        this.bankmasterform.controls['pIfsccode'].setValue(this.datatobind.pIfsccode)
        this.bankmasterform.controls['pAccountname'].setValue(this.datatobind.pAccountname)
        this.bankmasterform.controls['ptypeofoperation'].setValue("UPDATE");
        this.bankmasterform.controls['pOverdraft'].setValue(this._commonService.currencyformat(this.datatobind.pOverdraft))
        this.bankmasterform.controls['pAcctountype'].setValue(this.datatobind.pAcctountype)
        this.bankmasterform.controls['pOpeningBalance'].setValue(this._commonService.currencyformat(this.datatobind.pOpeningBalance))
        this.bankmasterform.controls['popeningjvno'].setValue(this.datatobind.popeningjvno)
        if (this.datatobind.pOpeningBalanceType == "") {
          this.bankmasterform.controls['pOpeningBalanceType'].setValue('D')
        }
        else {
          this.bankmasterform.controls['pOpeningBalanceType'].setValue(this.datatobind.pOpeningBalanceType)
        }



        if (this.datatobind.pIsupiapplicable == true) {
          this.bankmasterform.controls['pIsupiapplicable'].setValue(this.datatobind.pIsupiapplicable)
          this.bankupihideandshow = true;
          this.bankupidetails = true;
          this.gridData = this.datatobind.lstBankUPI
        }

        if (this.datatobind.pIsdebitcardapplicable == true) {
          this.bankmasterform.controls['pIsdebitcardapplicable'].setValue(this.datatobind.pIsdebitcardapplicable)
          this.debitcardhideandshow = true
          this.debitcarddetails = true;


          if (this.datatobind.lstBankdebitcarddtlsDTO.length > 0) {
            if (this.datatobind.lstBankdebitcarddtlsDTO[0].pCardNo != '' && this.datatobind.lstBankdebitcarddtlsDTO[0].pCardNo != null) {
              this.cardno = true;
              this.bankmasterform.controls['pCardNo'].patchValue(this.datatobind.lstBankdebitcarddtlsDTO[0].pCardNo)
            }
            else {
              this.bankmasterform.controls['pCardNo'].patchValue('')
            }
          }
          else {
            this.bankmasterform.controls['pCardNo'].patchValue('')
          }

          this.bankmasterform.controls['pCardName'].patchValue(this.datatobind.lstBankdebitcarddtlsDTO[0].pCardName)

          this.bankmasterform.controls['pValidfrom'].setValue(this._commonService.formatDateFromMMDDYYYY(this.datatobind.lstBankdebitcarddtlsDTO[0].pValidfrom))
          this.bankmasterform.controls['pValidto'].setValue(this._commonService.formatDateFromMMDDYYYY(this.datatobind.lstBankdebitcarddtlsDTO[0].pValidto))
          // this.bankmasterform.controls['pRecordid'].setValue(this.datatobind.lstBankdebitcarddtlsDTO[0].pRecordid);
        }
        if (this.datatobind.lstBankInformationAddressDTO != 0) {
          this.addressdetails.editdata(this.datatobind.lstBankInformationAddressDTO,'Bank')
        }
        //console.log(this.bankmasterform.value)
      })

    }
  }


  Bankdebitcarddtls() {
    return this.fb.group
      ({
        pCardNo: [''],
        pCardName: [''],
        pValidfrom: [''],
        pValidto: [''],
        pRecordid: [''],
        pStatusname: ['Active'],
        ptypeofoperation: ['CREATE'],
        pCreatedby: [this._commonService.pCreatedby],
      })
  }
  BankInformationAddress() {
    return this.fb.group
      ({
        pAddress1: [''],
        pAddress2: [''],
        pCity: [''],
        pState: [''],
        pDistrict: [''],
        pPincode: [''],
        pCountry: [''],
        pRecordid: [''],

      })
  }
  bankdebitcardchecked(event) {

    this.bankmastervalidations = {}

    if (event.target.checked == true) {

      this.debitcarddetails = true;
      this.debitcardvalidation('GET');
      this.debitcardhideandshow = true
    }
    else {
      this.debitcardhideandshow = false
      this.debitcarddetails = false;
      this.debitcardvalidation('SET');
    }
  }

  removeHandler(event) {

    this.gridData.splice(event.rowIndex, 1);
  }
  upivalidation(type) {
   debugger
    let pUpiid = <FormGroup>this.bankmasterform['controls']['pUpiid'];
    let pUpiname = <FormGroup>this.bankmasterform['controls']['pUpiname'];

    if (type == 'GET') {
      pUpiid.setValidators(Validators.required);
      pUpiname.setValidators(Validators.required);

    }
    else {
      pUpiid.clearValidators();
      pUpiname.clearValidators();

    }
    pUpiid.updateValueAndValidity();
    pUpiname.updateValueAndValidity();
  }
  debitcardvalidation(type) {


    let pCardNo = <FormGroup>this.bankmasterform['controls']['pCardNo'];
    //  let pValidfrom = <FormGroup>this.bankmasterform['controls']['pValidfrom'];
    //  let pValidto = <FormGroup>this.bankmasterform['controls']['pValidto'];
    if (type == 'GET') {
      pCardNo.setValidators(Validators.required);
      // pValidfrom.setValidators(Validators.required);
      // pValidto.setValidators(Validators.required);
    }
    else {
      pCardNo.clearValidators();
      // pValidfrom.clearValidators();
      // pValidto.clearValidators();
    }
    pCardNo.updateValueAndValidity();
    // pValidfrom.updateValueAndValidity();
    // pValidto.updateValueAndValidity();
  }

  validateopeningbalancetype(type) {

    debugger
    let pOpeningBalanceType = <FormGroup>this.bankmasterform['controls']['pOpeningBalanceType'];

    if (type == "GET") {
      pOpeningBalanceType.setValidators(Validators.required)

    }
    else {
      pOpeningBalanceType.clearValidators();


    }
    pOpeningBalanceType.updateValueAndValidity();
  }


  bankupichecked(event) {
    this.bankmastervalidations = {}
    if (event.target.checked == true) {
      this.bankupidetails = true;
      this.bankupihideandshow = true
      this.upivalidation('GET')
    }
    else {
      this.bankupihideandshow = false

    }
  }
  bankupi(event)
  {
debugger
if(event.target.value!="" && event.target.value!=null)
{
  if (this.bankmasterform.controls['pUpiid'].value != "") {
    this.upigridvalidation = false;
    this.bankmastervalidations['pUpiid'] = "";
    this.upivalidation('SET')
    
  }

  if (this.bankmasterform.controls['pUpiname'].value != "") {
    this.upigridvalidation = false;
    this.bankmastervalidations['pUpiname'] = "";
    this.upivalidation('SET')
  }
    
}
  }
  addtogrid() 
  {
    debugger
    this.submitted = true

    if (this.validateupi()) {
      this.duplicateupi = this.bankmasterform.controls['pUpiid'].value
      this.upisetup['pUpiid'] = this.bankmasterform.controls['pUpiid'].value
      this.upisetup['pUpiname'] = this.bankmasterform.controls['pUpiname'].value
      this.upisetup['pCreatedby'] = this.bankmasterform.controls['pCreatedby'].value
      this.upisetup['pStatusname'] = this.bankmasterform.controls['pStatusname'].value
      this.upisetup['ptypeofoperation'] = "CREATE";
      this.gridData.push(this.upisetup);

      this.bankmasterform.controls['pUpiid'].setValue("");
      this.bankmasterform.controls['pUpiname'].setValue("");
      this.submitted = false;
      this.bankmastervalidations['pUpiname'] = "";
      this.bankmastervalidations['pUpiid'] = ""
      //this.getapi();

      this.upisetup = {}
    }
  }
  validateupi(): boolean {
debugger
    let isValid = true;

    if (this.bankmasterform.controls['pUpiid'].value == "") {
      this.upigridvalidation = true;
      this.bankmastervalidations['pUpiid'] = "Upi ID Required"
      isValid = false;
    }

    if (this.bankmasterform.controls['pUpiname'].value == "") {
      this.upigridvalidation = true;
      this.bankmastervalidations['pUpiname'] = "Upi Link with";
      isValid = false;
    }
    let upiiddata = this.gridData.filter(data => {
      return data.pUpiid == this.bankmasterform.controls['pUpiid'].value;
    });

    if (upiiddata != null) {
      if (upiiddata.length > 0) {
        isValid = false;
      }
    }

    let upinamedata = this.gridData.filter(c => c.pUpiname == this.bankmasterform.controls['pUpiname'].value)

    //let upinamedata = this.gridData.filter(data1 => {
    //  return data1.pUpiname == this.upisetup['pUpiname'];
    //});

    if (upinamedata != null) {
      if (upinamedata.length > 0) {
        isValid = false;
      }
    }

    this.upigridvalidation = false;


    return isValid
  }

  getapi() {
    return this.upisetup
  }
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
          this.bankmastervalidations[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.bankmastervalidations[key] += errormessage + ' ';
                isValid = false;
              }
            }
          }
        }
      }
    }
    catch (e) {
      //this.showErrorMessage(e);
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

  clear() {


    this.disable = false;
    this.cardno = false;
    this.accountno = false;
    this.buttonname = "Save"
    this.buttontype = "new";
    this._accountingmasterserive.newformstatus(this.buttontype);
    this.bankmasterform.reset();
    this.addressdetails.clear();
    this.ngOnInit()
    this.debitcarddetails = false;
    this.bankupidetails = false;
    this.bankmastervalidations = {}
    this.gridData = []
    this.bankmasterform['controls']['pBankdate'].setValue(this.date);


  }
  validatedatepicker(): boolean {

    let isValid = true;
    let from_date = this.datepipe.transform(this.bankmasterform.controls['pValidfrom'].value, 'yyyy-MM-dd');
    let to_date = this.datepipe.transform(this.bankmasterform.controls['pValidto'].value, 'yyyy-MM-dd');
    if (from_date > to_date) {
      this.todate = true;
      isValid = false;
    }
    else {
      this.todate = false;
    }

    return isValid
  }
 cardchange()
  {
    this.GetValidationByControl(this.bankmasterform, 'pCardNo', true);
  }
  save() {

  debugger
    this.AdresssDetailsForm = this.addressdetails.addressForm.value;


    if(this.bankupidetails==true)
    {
      if(this.gridData.length==0)
      {
        this.bankupihideandshow=false;
        this.bankmasterform.controls['pIsupiapplicable'].setValue(false)
      }
     
    }else{
      this.upivalidation('')
    }
    let c = this._commonService.removeCommasForEntredNumber(this.bankmasterform.controls['pOpeningBalance'].value)

    if (c > 0) {
      this.validateopeningbalancetype('GET')
    }
    else {
      this.validateopeningbalancetype('SET')
    }

    let i = this.validatedatepicker()
    if (this.debitcarddetails == true && i == true) {
      this.validationfordebitcarddetails = true;
    }
    else {
      this.validationfordebitcarddetails = false;
    }

    let isValid = true;
    if (this.checkValidations(this.bankmasterform, isValid)) {



      if (this.validationfordebitcarddetails == true) {
        let Chargescontrolbankdebitcard = <FormArray>this.bankmasterform.controls['lstBankdebitcarddtlsDTO'];
        Chargescontrolbankdebitcard.push(this.Bankdebitcarddtls());


        this.bankmasterform['controls']['lstBankdebitcarddtlsDTO']['controls'][0].patchValue(this.bankmasterform.value);
        // console.log(this.datatobind.lstBankdebitcarddtlsDTO[0].pRecordid)
        if (this.buttontype == "edit") {
          if (this.datatobind.lstBankdebitcarddtlsDTO.length > 0) {
            this.bankmasterform.value["lstBankdebitcarddtlsDTO"][0]["pRecordid"] = this.datatobind.lstBankdebitcarddtlsDTO[0].pRecordid
          }
        }



      }

      if (this.AdresssDetailsForm['paddress1'] != "" || this.AdresssDetailsForm['paddress2'] != "" || this.AdresssDetailsForm['pcity'] != "" ||
        this.AdresssDetailsForm['pState'] != "" || this.AdresssDetailsForm['pDistrict'] != "" || this.AdresssDetailsForm['pCountry'] != ""
        || this.AdresssDetailsForm['Pincode'] != "") {
        let Chargescontrolbankadress = <FormArray>this.bankmasterform.controls['lstBankInformationAddressDTO'];
        Chargescontrolbankadress.push(this.BankInformationAddress());
        this.bankmasterform.value["lstBankInformationAddressDTO"][0]["pAddress1"] = this.AdresssDetailsForm['paddress1']
        this.bankmasterform.value["lstBankInformationAddressDTO"][0]["pAddress2"] = this.AdresssDetailsForm['paddress2']
        this.bankmasterform.value["lstBankInformationAddressDTO"][0]["pCity"] = this.AdresssDetailsForm['pcity']
        this.bankmasterform.value["lstBankInformationAddressDTO"][0]["pState"] = this.AdresssDetailsForm['pState']
        this.bankmasterform.value["lstBankInformationAddressDTO"][0]["pDistrict"] = this.AdresssDetailsForm['pDistrict']
        this.bankmasterform.value["lstBankInformationAddressDTO"][0]["pCountry"] = this.AdresssDetailsForm['pCountry']
        this.bankmasterform.value["lstBankInformationAddressDTO"][0]["pPincode"] = this.AdresssDetailsForm['Pincode']
        this.bankmasterform.value["lstBankInformationAddressDTO"][0]["pStatusname"] = this.bankmasterform.controls['pStatusname'].value
        this.bankmasterform.value["lstBankInformationAddressDTO"][0]["ptypeofoperation"] = this.bankmasterform.controls['ptypeofoperation'].value
        this.bankmasterform.value["lstBankInformationAddressDTO"][0]["pCreatedby"] = this.bankmasterform.controls['pCreatedby'].value;
        this.bankmasterform.value["lstBankInformationAddressDTO"][0]["pRecordid"] = this.AdresssDetailsForm['pRecordid']
      }

      if (this.bankmasterform.controls.pOverdraft.value == "") {
        this.bankmasterform.controls.pOverdraft.setValue(0);
      }
      else {

        let b = this._commonService.removeCommasForEntredNumber(this.bankmasterform.controls['pOverdraft'].value)

        this.bankmasterform.controls['pOverdraft'].setValue(b)

      }
      if (this.bankmasterform.controls.pOpeningBalance.value == "") {
        this.bankmasterform.controls.pOpeningBalance.setValue(0);
      }
      else {
        let a = this._commonService.removeCommasForEntredNumber(this.bankmasterform.controls['pOpeningBalance'].value)
        this.bankmasterform.controls['pOpeningBalance'].setValue(a)

      }

      //this.bankmasterform.controls.pBankdate.setValue(this._commonService.getFormatDate(this.bankmasterform.controls.pBankdate.value))

      this.bankmasterform['controls']['lstBankUPI'].setValue(this.gridData);


      // this.bankmasterform.controls['pBankname'].setValue(this.captilizebank)
      if (this.buttontype == "edit") {
        this.bankmasterform.controls['pRecordid'].setValue(this.datatobind.pRecordid)


      }
      let data = JSON.stringify(this.bankmasterform.value);
      //console.log(this.bankmasterform.value)
      this._accountingmasterserive.GetCheckDuplicateDebitCardNo(data).subscribe(res => {


        if (res[0] == "TRUE") {
          this.disablesavebutton = true;
          this.buttonname = 'Processing';
          this._accountingmasterserive.savebankinformation(data).subscribe(saveddata => {

            //console.log(saveddata)
            if (saveddata) {
              this.disablesavebutton = false;
              this.router.navigateByUrl("/BankView")
              this.bankmasterform.reset();
              this.addressdetails.clear();
              this.gridData = []
              this.bankupihideandshow = false;
              this.debitcardhideandshow = false;
              this.bankmasterform['controls']['pBankdate'].setValue(this.date);
              if (this.buttontype == "edit") {
                this.toaster.success("Updated Successfully", 'Success');
              }
              else {
                this.toaster.success("Saved Successfully", 'Success');
              }

            }
          },
          (error) => {
            this._commonService.showErrorMessage(error);
            this.disablesavebutton = false;
          })
        }
        else if (res[0] == "Bank Already Exist") {
          this.toaster.info("Bank Already Exist")
        }
        else if (res[0] == "Debit Card Already Exist") {
          this.toaster.info("Debit Card Already Exist")
        }
        else if (res[0] == "UPI Id Already Exist") {
          this.toaster.info("UPI Id Already Exist")
        }
      },(error) => {
        this._commonService.showErrorMessage(error);
        this.disablesavebutton = false;
         
       } )
      //

      let Chargescontrolbankdebitcard1 = <FormArray>this.bankmasterform.controls['lstBankdebitcarddtlsDTO'];
      for (let i = Chargescontrolbankdebitcard1.length - 1; i >= 0; i--) {
        Chargescontrolbankdebitcard1.removeAt(i)
      }
      let Chargescontrolbankadress1 = <FormArray>this.bankmasterform.controls['lstBankInformationAddressDTO'];
      for (let i = Chargescontrolbankadress1.length - 1; i >= 0; i--) {
        Chargescontrolbankadress1.removeAt(i)
      }
    }


  }
}



