import { Component, OnInit, ViewChild,Input, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContacmasterService } from 'src/app/Services/Loans/Masters/contacmaster.service';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/Services/common.service';
import { HttpClient } from '@angular/common/http';
import { FIIndividualLoanspecficService } from 'src/app/Services/Loans/Transactions/fiindividual-loanspecfic.service';
import { AddressComponent } from 'src/app/UI/Common/address/address.component';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

declare let $: any
@Component({
  selector: 'app-businessloan',
  templateUrl: './businessloan.component.html',
  styles: []
})
export class BusinessloanComponent implements OnInit {

  finperyear: any = [{ ytype: 'current year' }, { ytype: '2018' }, { ytype: '2017' }, { ytype: '2016' }, { ytype: '2015' }, { ytype: '2014' }]

	_FirstInformationTabsData: any = [];
  @Input()
  set FirstInformationTabsData(FirstInformationTabsData: any) {
    this._FirstInformationTabsData = FirstInformationTabsData;
  }
  
  /**<-----(start) Forms declarations statred (start)------>*/
  finperform: FormGroup;
  credittrendpurchaseform: FormGroup;
  credittrendforsalesform: FormGroup
  stockpositionform: FormGroup
  costofprojectform: FormGroup
  unitform: FormGroup
  turnoverform: FormGroup
  addyeartypeform: FormGroup
  businessaddressForm: FormGroup
  /**<-----(end) Forms declarations (end)------>*/
  contryname: any;
  stateGet: any;
  pisscholarshipsapplicable = false;
  totalProjectCost: number = 0;
  previousData: number;
  countryDetails: any;
  stateDetails: any;
  districtDetails: any;
  arrow: boolean;
  addressdetails: any
  associateConcernsExist: boolean = true;
  associateConcernDetails: boolean = true;
  passociateconcernsexist = true;
  pisancillaryunit = true;
  isEditable = false;
  uploadSuccess: boolean;

  imageResponse: any
  businessLoanErrorMessage: any;
  pdescriptionoftheactivity: any = null;
  submitted: boolean = false;
  fileName: any = '';
  filePath: any;
  percentDone: number;

    /**<-----(start) Grid data array's declartions ------>*/
  finperDetails = [];
  public gridData: any[] = [];
  ceditpurchasedetails = [];
  ceditsalesdetails = [];
  stockposdetails = [];
  costprojdetails = [];
  unitDetails = [];
  turnoverDetails = [];
  identificationproof = [];

  /**<-----(start)data edit varibles ------>*/
  indexValue: number;
  arrowfinper: boolean;
  arrowpurchase: boolean;
  arrowsales: boolean;
  arrowcostofpro: any;
  arrowstock: boolean;
  arrowturnover: boolean;
  editdataofpur: any;
  editdataoffinper: any;
  editdtaofsales: any;
  editdataofstock: any;
  editdataofunit: any;
  editdataofturn: any;
  editdataofsales: any;
  oldValue: any;
  pNetProfitAmountFlag: Boolean = true;
  restrictyearflag: boolean = true;

  constructor(private http: HttpClient, private formBuilder: FormBuilder, private router: Router,
    private _commonService: CommonService, private loanSpecificService: FIIndividualLoanspecficService, private _contacmasterservice: ContacmasterService) { }




  ngOnInit() {
    this.getYearsList();
    this.businessLoanErrorMessage = {}
    this.businessaddressForm = this.formBuilder.group({

      businesspaddress1: ['', Validators.maxLength(200)],
      businesspaddress2: ['', Validators.maxLength(200)],
      businesspcity: ['', Validators.maxLength(75)],
      pCountryId: [''],
      pStateId: [''],
      pDistrictId: [''],
      businesspCountry: [''],
      businesspState: [''],
      businesspDistrict: [''],
      businessPincode: [''],
      pTypeofoperation: ['CREATE'],
      pRecordid: [0]
    })
    this.BlurEventAllControll(this.businessaddressForm);

    this.getCountryDetails();




    // this.businessaddressFormdata.addressformErrorMessage = {};
    /**<---- add year type field------>*/
    this.addyeartypeform = this.formBuilder.group({
      ytype: ['']
    })
    /**<----  validations of finacial performance------>*/
    this.businessLoanErrorMessage = {};
    this.finperform = this.formBuilder.group({
      finyear: [''],
      finturnover: [''],
      finnetprofit: [''],
      finupbalsheet: [''],
      pTypeofoperation: "CREATE",
      pRecordid: [0]


    })
    this.BlurEventAllControll(this.finperform);
   /**<----   validations of Credit trend purchase form----->*/
    this.credittrendpurchaseform = this.formBuilder.group({
      trendpurchaseperiod: [''],
      trendpurchasemajorsup: [''],
      trendpurchaseAddress: [''],
      trendpurchaseConNo: [''],
      trendpurchasemaxcreditrec: [''],
      trendpurchasemincreditrec: [''],
      trendpurtotalrec: [''],
      pTypeofoperation: "CREATE",
      pRecordid: [0]
    })
    this.BlurEventAllControll(this.credittrendpurchaseform);

      /**<----   validations of Credit trend sales form----->*/
    this.credittrendforsalesform = this.formBuilder.group({
      salesperiod: [''],
      salesnameofmajorcust: [''],
      dalesaddress: [''],
      salescontactno: [''],
      salesmaxcredit: [''],
      salesmincredit: [''],
      salestotalcredit: [''],
      pTypeofoperation: "CREATE",
      pRecordid: [0]
    })
    this.BlurEventAllControll(this.credittrendforsalesform);

      /**<----    validations of stock position form----->*/
    this.stockpositionform = this.formBuilder.group({
      stockperiod: [''],
      stockmaxcarried: [''],
      stockmincarried: [''],
      stockavgcarried: [''],
      pTypeofoperation: "CREATE",
      pRecordid: [0]
    })
    this.BlurEventAllControll(this.stockpositionform);

    /**<----- validations of cost of projection form----->*/
    this.costofprojectform = this.formBuilder.group({
      costofland: [''],
      bulidingcivilworks: [''],
      plantandmachine: [''],
      Equipment: [''],
      Testingequ: [''],
      misc: [''],
      Erection: [''],
      Preliminary: [''],
      provision: [''],
      marginofworking: [''],
      pRecordid: [0]
    })
    this.BlurEventAllControll(this.costofprojectform);

    /**<----  validations of unit form----->*/
    this.unitform = this.formBuilder.group({
      associateconcern: [''],
      natureassociation: [''],
      natureofactivity: [''],
      itemstraded: [''],
      pTypeofoperation: "CREATE",
      pRecordid: [0]
    })
    this.BlurEventAllControll(this.unitform);

    /**<------validations of turnover form----->*/
    this.turnoverform = this.formBuilder.group({
      turnoveryear: [''],
      turnover: [''],
      turnoverprofit: [''],
      pTypeofoperation: "CREATE",
      pRecordid: [0]
    })
    this.BlurEventAllControll(this.turnoverform);
  }

  getYearsList() {
    this.finperyear = [];
    let currentYear = new Date().getFullYear();
    let limitYear = currentYear - 15;
    for (let i = currentYear; i >= limitYear; i--) {
      let data = {
        ytype: i
      }
      this.finperyear.push(data);
    }
  }

 /**<-----(start) cheking validations for all form groups (start)------>*/
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
          this.businessLoanErrorMessage[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;

            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.businessLoanErrorMessage[key] += errormessage + ' ';
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
 /**<-----(end) cheking validations for all form groups (end)------>*/

  /**<-----(start) saving data of creit trend purchase form(start)------>*/
  submitpurchase() {
    let isvalid = true;
    let addFlag: boolean = false;
    if (this.credittrendpurchaseform.value.trendpurchaseperiod ||
      this.credittrendpurchaseform.value.trendpurchasemajorsup ||
      this.credittrendpurchaseform.value.trendpurchaseAddress ||
      this.credittrendpurchaseform.value.trendpurchaseConNo ||
      this.credittrendpurchaseform.value.trendpurchasemaxcreditrec ||
      this.credittrendpurchaseform.value.trendpurchasemincreditrec ||
      this.credittrendpurchaseform.value.trendpurtotalrec) {
      addFlag = true;
    }
    else {
      addFlag = false;
    }

    if (addFlag) {
      if (this.checkValidations(this.credittrendpurchaseform, isvalid)) {

        if (this.credittrendpurchaseform.valid) {
          this.credittrendpurchaseform.value.trendpurchasemaxcreditrec = this.credittrendpurchaseform.value.trendpurchasemaxcreditrec ? this._commonService.currencyformat(this.credittrendpurchaseform.value.trendpurchasemaxcreditrec) : 0;
          this.credittrendpurchaseform.value.trendpurchasemincreditrec = this.credittrendpurchaseform.value.trendpurchasemincreditrec ? this._commonService.currencyformat(this.credittrendpurchaseform.value.trendpurchasemincreditrec) : 0;
          this.credittrendpurchaseform.value.trendpurtotalrec = this.credittrendpurchaseform.value.trendpurtotalrec ? this._commonService.currencyformat(this.credittrendpurchaseform.value.trendpurtotalrec) : 0;

          this.isEditable ? this.ceditpurchasedetails.splice(this.indexValue, 1, this.credittrendpurchaseform.value) : this.ceditpurchasedetails.push(this.credittrendpurchaseform.value)
        }
        if (this.isEditable) {
          this.credittrendpurchaseform.value.pTypeofoperation = "UPDATE";
          this.credittrendpurchaseform.value.pRecordid = this.editdataofpur.dataItem.pRecordid
        }

        this.credittrendpurchaseform = this.formBuilder.group({
          trendpurchaseperiod: [''],
          trendpurchasemajorsup: [''],
          trendpurchaseAddress: [''],
          trendpurchaseConNo: [''],
          trendpurchasemaxcreditrec: [''],
          trendpurchasemincreditrec: [''],
          trendpurtotalrec: [''],
          pTypeofoperation: "CREATE",
          pRecordid: [0]

        })
      }
    }
  }
  /**<-----(end) saving data of creit trend purchase form(end)------>*/

 /**<-----(start) saving data of creit trend sales form(start)------>*/
  submitsales() {
    let isvalid = true;
    let addFlag: boolean = false;
    if (this.credittrendforsalesform.value.salesperiod ||
      this.credittrendforsalesform.value.salesnameofmajorcust ||
      this.credittrendforsalesform.value.dalesaddress ||
      this.credittrendforsalesform.value.salescontactno ||
      this.credittrendforsalesform.value.salesmaxcredit ||
      this.credittrendforsalesform.value.salesmincredit ||
      this.credittrendforsalesform.value.salestotalcredit) {
      addFlag = true
    }
    else {
      addFlag = false;
    }

    if (addFlag) {
      if (this.checkValidations(this.credittrendforsalesform, isvalid)) {
        this.credittrendforsalesform.value.salesmaxcredit = this.credittrendforsalesform.value.salesmaxcredit ? this._commonService.currencyformat(this.credittrendforsalesform.value.salesmaxcredit) : 0;
        this.credittrendforsalesform.value.salesmincredit = this.credittrendforsalesform.value.salesmincredit ? this._commonService.currencyformat(this.credittrendforsalesform.value.salesmincredit) : 0;
        this.credittrendforsalesform.value.salestotalcredit = this.credittrendforsalesform.value.salestotalcredit ? this._commonService.currencyformat(this.credittrendforsalesform.value.salestotalcredit) : 0;
        if (this.credittrendforsalesform.valid) {
          this.isEditable ? this.ceditsalesdetails.splice(this.indexValue, 1, this.credittrendforsalesform.value) : this.ceditsalesdetails.push(this.credittrendforsalesform.value)
        }
        if (this.isEditable) {
          this.credittrendforsalesform.value.pTypeofoperation = "UPDATE"
          this.credittrendforsalesform.value.pRecordid = this.editdataofsales.dataItem.pRecordid
        }
        this.credittrendforsalesform = this.formBuilder.group({
          salesperiod: [''],
          salesnameofmajorcust: [''],
          dalesaddress: [''],
          salescontactno: [''],
          salesmaxcredit: [''],
          salesmincredit: [''],
          salestotalcredit: [''],
          pTypeofoperation: ['CREATE'],
          pRecordid: [0]

        })
      }
    }
  }
 /**<-----(end) saving data of creit trend sales form(end)------>*/

  /**<-----(start) saving data of stock position form(start)------>*/
  submitstock() {
    let isvalid = true;
    let addFlag: boolean = false;
    if (this.stockpositionform.value.stockperiod ||
      this.stockpositionform.value.stockmaxcarried ||
      this.stockpositionform.value.stockmincarried ||
      this.stockpositionform.value.stockavgcarried) {
      addFlag = true;
    }
    else {
      addFlag = false;
    }

    if (addFlag) {
      if (this.checkValidations(this.stockpositionform, isvalid)) {


        this.stockpositionform.value.stockavgcarried = this.stockpositionform.value.stockavgcarried ? this._commonService.currencyformat(this.stockpositionform.value.stockavgcarried) : 0;
        this.stockpositionform.value.stockmaxcarried = this.stockpositionform.value.stockmaxcarried ? this._commonService.currencyformat(this.stockpositionform.value.stockmaxcarried) : 0;
        this.stockpositionform.value.stockmincarried = this.stockpositionform.value.stockmincarried ? this._commonService.currencyformat(this.stockpositionform.value.stockmincarried) : 0;
        if (this.stockpositionform.valid) {
          this.isEditable ? this.stockposdetails.splice(this.indexValue, 1, this.stockpositionform.value) : this.stockposdetails.push(this.stockpositionform.value)
        }
        if (this.isEditable) {
          this.stockpositionform.value.pTypeofoperation = "UPDATE"
          this.stockpositionform.value.pRecordid = this.editdataofstock.dataItem.pRecordid
        }
        this.stockpositionform = this.formBuilder.group({
          stockperiod: [''],
          stockmaxcarried: [''],
          stockmincarried: [''],
          stockavgcarried: [''],
          pTypeofoperation: "CREATE",
          pRecordid: [0]

        })
      }
    }
  }
  /**<-----(end) saving data of stock position form(end)------>*/

  /**<-----(start) saving data of unit form(start)------>*/
  submitunitform() {

    let addFlag: boolean = false;
    if (this.unitform.value.associateconcern ||
      this.unitform.value.natureassociation ||
      this.unitform.value.natureofactivity ||
      this.unitform.value.itemstraded) {
      addFlag = true;
    }
    else {
      addFlag = false;
    }

    let isvalid = true;
    if (addFlag) {

      if (this.checkValidations(this.unitform, isvalid)) {
      }
      if (this.unitform.valid) {
        this.isEditable ? this.unitDetails.splice(this.indexValue, 1, this.unitform.value) : this.unitDetails.push(this.unitform.value)
      }
      if (this.isEditable) {
        this.unitform.value.pTypeofoperation = "UPDATE"
        this.unitform.value.pRecordid = this.editdataofunit.dataItem.pRecordid
      }
      this.unitform = this.formBuilder.group({

        associateconcern: [''],
        natureassociation: [''],
        natureofactivity: [''],
        itemstraded: [''],
        pTypeofoperation: "CREATE",
        pRecordid: [0]

      })
    }

  }
  /**<-----(end) saving data of unit form(end)------>*/

  /**<-----(start) saving data of turn over form(start)------>*/
  submitturnoverform() {
    if (this.pNetProfitAmountFlag == false) {
      this._commonService.showWarningMessage('Net Profit amount can not be greater than Turnover');
    } else {
      let isvalid = true;
      let addFlag: boolean = false;
      if (this.turnoverform.value.turnoveryear ||
        this.turnoverform.value.turnover ||
        this.turnoverform.value.turnoverprofit) {
        addFlag = true;
      }
      else {
        addFlag = false;
      }

      if (addFlag) {
        if (this.checkValidations(this.turnoverform, isvalid)) {

          if (this.turnoverform.valid) {
            this.turnoverform.value.turnover = this.turnoverform.value.turnover ? this._commonService.currencyformat(this.turnoverform.value.turnover) : 0;
            this.turnoverform.value.turnoverprofit = this.turnoverform.value.turnoverprofit ? this._commonService.currencyformat(this.turnoverform.value.turnoverprofit) : 0;
            this.isEditable ? this.turnoverDetails.splice(this.indexValue, 1, this.turnoverform.value) : this.turnoverDetails.push(this.turnoverform.value);
          }

          if (this.isEditable) {
            this.turnoverform.value.pTypeofoperation = "UPDATE"
            this.turnoverform.value.pRecordid = this.editdataofturn.dataItem.pRecordid
          }
          this.turnoverform = this.formBuilder.group({

            turnoveryear: [''],
            turnover: [''],
            turnoverprofit: [''],
            pTypeofoperation: "CREATE",
            pRecordid: [0]

          })
        }
      }
    }
  }
  /**<-----(end) saving data of turn over form(end)------>*/

  /**<-----(start) saving add year field in array(start)------>*/
  addYear() {
    this.finperyear[0] = this.addyeartypeform.value
  }
  /**<-----(end) saving add year field in array(end)------>*/

  /**<-----(start) ancillaryDetailsChange event(start)------>*/
  ancillaryDetailsChange(event) {
    if (this.pisancillaryunit == true) {
      this.associateConcernDetails = true
    } else {
      this.associateConcernDetails = false
    }
  }
  /**<-----(end) ancillaryDetailsChange event(end)------>*/


  /**<-----(start) associateConcernsChange event(start)------>*/
  associateConcernsChange(event) {
    if (this.passociateconcernsexist == true) {
      this.associateConcernsExist = true
    } else {
      this.associateConcernsExist = false
    }
  }
  /**<-----(end) associateConcernsChange event(end)------>*/


 /**<-----(start) edit data for finper form(start)------>*/
  editfinper(event) {
    this.editdataoffinper = event

    this.isEditable = true;
    this.indexValue = event.rowIndex;
    this.finperform.patchValue({
      finyear: event.dataItem.finyear,
      finturnover: event.dataItem.finturnover,
      finnetprofit: event.dataItem.finnetprofit,
      finupbalsheet: event.dataItem.pProoffilepath,
    })
  }
 /**<-----(end) edit data for finper form(end)------>*/

  /**<-----(start) remove fincial performance row of grid data(start)------>*/
  deletefinper(event) {
    this.gridData.splice(event.rowIndex, 1);
  }
 /**<-----(end)   remove fincial performance row of grid data (end)------>*/

 /**<-----(start)  edit data for finper form(start)------>*/
  editcreditpur(eventpur) {
    this.editdataofpur = eventpur
    this.indexValue = eventpur.rowIndex;
    this.isEditable = true;
    this.credittrendpurchaseform.patchValue({
      trendpurchaseperiod: eventpur.dataItem.trendpurchaseperiod,
      trendpurchasemajorsup: eventpur.dataItem.trendpurchasemajorsup,
      trendpurchaseAddress: eventpur.dataItem.trendpurchaseAddress,
      trendpurchaseConNo: eventpur.dataItem.trendpurchaseConNo,
      trendpurchasemaxcreditrec: eventpur.dataItem.trendpurchasemaxcreditrec,
      trendpurchasemincreditrec: eventpur.dataItem.trendpurchasemincreditrec,
      trendpurtotalrec: eventpur.dataItem.trendpurtotalrec,
    })
  }
 /**<-----(end)  edit data for finper form(end)------>*/

  /**<-----(start) deleting a particular row for credit trend purchase grid data (start)------>*/
  deletecreditpur(event) {
    this.ceditpurchasedetails.splice(event.rowIndex, 1);
  }
  /**<-----(end) deleting a particular row for credit trend purchase grid data (end)------>*/

  /**<-----(start) updaing credit trend sales form data (start)------>*/
  editceditsales(event) {
    this.editdataofsales = event

    this.isEditable = true;
    this.indexValue = event.rowIndex;

    this.credittrendforsalesform.patchValue({
      salesperiod: event.dataItem.salesperiod,
      salesnameofmajorcust: event.dataItem.salesnameofmajorcust,
      dalesaddress: event.dataItem.dalesaddress,
      salescontactno: event.dataItem.salescontactno,
      salesmaxcredit: event.dataItem.salesmaxcredit,
      salesmincredit: event.dataItem.salesmincredit,
      salestotalcredit: event.dataItem.salestotalcredit,
    })
  }
  /**<-----(end) updaing credit trend sales form data (end)------>*/

  /**<-----(start) deleting a particular row for credit sales grid data (start)------->*/
  deleteceditsales(event) {
    this.ceditsalesdetails.splice(event.rowIndex, 1);
  }
  /**<-----(end) deleting a particular row for credit sales grid data (end)------->*/

  /**<-----(start) updating a particular row for stock position grid data (start)------->*/
     editstockpos(event) {
    this.editdataofstock = event
    this.isEditable = true;
    this.indexValue = event.rowIndex;
    this.stockpositionform.patchValue({
      stockperiod: event.dataItem.stockperiod,
      stockmaxcarried: event.dataItem.stockmaxcarried,
      stockmincarried: event.dataItem.stockmincarried,
      stockavgcarried: event.dataItem.stockavgcarried,
    })
  }
  /**<-----(end) updating a particular row for stock position grid data (end)------->*/
  
  /**<-----(start) deleting a particular row for stock position grid data (start)------->*/
  deletestockpos(event) {
    this.stockposdetails.splice(event.rowIndex, 1);
  }
  /**<-----(end) deleting a particular row for stock position grid data (end)------->*/

  /**<-----(start) updaing unit form data(start)------>*/
  editunit(event) {
    this.editdataofunit = event
    this.isEditable = true;
    this.indexValue = event.rowIndex;
    this.unitform.patchValue({
      associateconcern: event.dataItem.associateconcern,
      natureassociation: event.dataItem.natureassociation,
      natureofactivity: event.dataItem.natureofactivity,
      itemstraded: event.dataItem.itemstraded,
    })
  }
  /**<-----(end) updaing unit form data(end)------>*/

 /**<-----(start) deleting a particular row for unitform grid data (start)------>*/
  deleteunit(event) {
    this.unitDetails.splice(event.rowIndex, 1);
  }
  /**<-----(end) deleting a particular row for unitform grid data (end)------>*/

  /**<-----(start) Updating turn over form data (start)------>*/
  editturnover(event) {
    this.editdataofturn = event
    this.isEditable = true;
    this.indexValue = event.rowIndex;

    this.turnoverform.patchValue({
      turnoveryear: event.dataItem.turnoveryear,
      turnover: event.dataItem.turnover,
      turnoverprofit: event.dataItem.turnoverprofit,
    })
  }
  /**<-----(end) Updating turn over form data (end)------>*/

  /**<-----(start) deleting a particular row for turnover grid data (start)------>*/
  deleteturnover(event) {
    this.turnoverDetails.splice(event.rowIndex, 1);
  } 
  /**<-----(end) deleting a particular row for turnover grid data (end)------>*/

  /**<-----(start) hiding fields of cost of projections (start)------>*/
  notApplicableKyc(event) {

    var checked = event.target.checked
    if (checked == true) {
      this.pisscholarshipsapplicable = true;
      this.costofprojectform.controls['costofland'].setValue('');
      this.costofprojectform.controls['bulidingcivilworks'].setValue('');
      this.costofprojectform.controls['plantandmachine'].setValue('');
      this.costofprojectform.controls['Equipment'].setValue('');
      this.costofprojectform.controls['Testingequ'].setValue('');
      this.costofprojectform.controls['misc'].setValue('');
      this.costofprojectform.controls['Erection'].setValue('');
      this.costofprojectform.controls['Preliminary'].setValue('');
      this.costofprojectform.controls['provision'].setValue('');
      this.costofprojectform.controls['marginofworking'].setValue('');

      this.costofprojectform.controls['costofland'].disable();
      this.costofprojectform.controls['bulidingcivilworks'].disable();
      this.costofprojectform.controls['plantandmachine'].disable();
      this.costofprojectform.controls['Equipment'].disable();
      this.costofprojectform.controls['Testingequ'].disable();
      this.costofprojectform.controls['misc'].disable();
      this.costofprojectform.controls['Erection'].disable();
      this.costofprojectform.controls['Preliminary'].disable();
      this.costofprojectform.controls['provision'].disable();
      this.costofprojectform.controls['marginofworking'].disable();
    }
    else {
      this.pisscholarshipsapplicable = false;
      this.costofprojectform.controls['costofland'].setValue('');
      this.costofprojectform.controls['bulidingcivilworks'].setValue('');
      this.costofprojectform.controls['plantandmachine'].setValue('');
      this.costofprojectform.controls['Equipment'].setValue('');
      this.costofprojectform.controls['Testingequ'].setValue('');
      this.costofprojectform.controls['misc'].setValue('');
      this.costofprojectform.controls['Erection'].setValue('');
      this.costofprojectform.controls['Preliminary'].setValue('');
      this.costofprojectform.controls['provision'].setValue('');
      this.costofprojectform.controls['marginofworking'].setValue('');

      this.costofprojectform.controls['costofland'].enable();
      this.costofprojectform.controls['bulidingcivilworks'].enable();
      this.costofprojectform.controls['plantandmachine'].enable();
      this.costofprojectform.controls['Equipment'].enable();
      this.costofprojectform.controls['Testingequ'].enable();
      this.costofprojectform.controls['misc'].enable();
      this.costofprojectform.controls['Erection'].enable();
      this.costofprojectform.controls['Preliminary'].enable();
      this.costofprojectform.controls['provision'].enable();
      this.costofprojectform.controls['marginofworking'].enable();
    }

  }
  /**<-----(end) hiding fields of cost of projections (end)------>*/

  /**<-----(start) fileupload for finacialperformance form (start)------>*/
  uploadAndProgress(event: any, files) {
    let file = event.target.files[0];
    if (event && file) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = e => {
        this.imageResponse = {
          name: file.name,
          fileType: "imageResponse",
          contentType: file.type,
          size: file.size,

        };
      };
    }
    let fname = "";
    if (files.length === 0) {
      return;
    }
    var size = 0;
    const formData = new FormData();
    for (var i = 0; i < files.length; i++) {
      size += files[i].size;
      fname = files[i].name
      formData.append(files[i].name, files[i]);
      formData.append('NewFileName', this.finperform.value["pDocumentName"] + '.' + files[i]["name"].split('.').pop());
    }
    size = size / 1024;
    this._commonService.fileUpload(formData).subscribe(data => {
      this.fileName = data[1];
      if(this.imageResponse)
      this.imageResponse.name = data[1];
      this.filePath = data[0];
    })
  }
 /**<-----(end) fileupload for finacialperformance form (end)------>*/

 /**<-----(start) saving data of fincial performance (start)------>*/
  submitFinperfrom() {
    if (this.finperDetails.length > 0) {
      for (let i = 0; i < this.finperDetails.length; i++) {
        if (this.finperDetails[i].finyear == this.finperform.value.finyear) {
          this.restrictyearflag = false;
          this._commonService.showWarningMessage('Finacial year already exist');
          break;
        }
        else {
          this.restrictyearflag = true;
        }
      }
    }
    if (this.pNetProfitAmountFlag == false) {
      this._commonService.showWarningMessage('Net Profit amount can not be greater than Turnover');
    } else {
      let isvalid = true;

      let addFlag: boolean = false;
      if (this.finperform.value.finyear ||
        this.finperform.value.finturnover ||
        this.finperform.value.finnetprofit) {
        addFlag = true;
      }
      else {
        addFlag = false;
        if ($('#fileBalanceSheet').val()) {
          $('#fileBalanceSheet').val(null);
          this.fileName = '';
          this.filePath = '';
          if(this.imageResponse)
          this.imageResponse.name = '';
        }
      }
      if (addFlag && this.restrictyearflag) {
        if (this.checkValidations(this.finperform, isvalid)) {
          this.finperDetails.push(this.finperform.getRawValue());
          let addDatatoGrid = {

            "finyear": this.finperform.value["finyear"],
            "finturnover": this.finperform.value["finturnover"] ? this._commonService.currencyformat(this.finperform.value["finturnover"]) : 0,
            "finnetprofit": this.finperform.value["finnetprofit"] ? this._commonService.currencyformat(this.finperform.value["finnetprofit"]) : 0,
            "finupbalsheet": this.finperform.value["finupbalsheet"],
            "pUploadfilename": this.fileName,
            "pProoffilepath": this.filePath,
            "pTypeofoperation": "CREATE",
            "pRecordid": 0

          };

          this.isEditable ? this.gridData.splice(this.indexValue, 1, addDatatoGrid) : this.gridData.push(addDatatoGrid);
          this.fileName = '';
          this.filePath = '';
          if (this.isEditable) {
            addDatatoGrid.pTypeofoperation = "UPDATE"
            this.finperform.value.pRecordid = this.editdataoffinper.dataItem.pRecordid
          }
          if ($('#fileBalanceSheet').val()) {
            $('#fileBalanceSheet').val(null);
            if(this.imageResponse)
            this.imageResponse.name = '';
          }

          addDatatoGrid = {
            "finyear": '',
            "finturnover": '',
            "finnetprofit": '',
            "finupbalsheet": '',
            "pUploadfilename": '',
            "pProoffilepath": '',
            "pTypeofoperation": '',
            "pRecordid": 0
          };
          this.finperform = this.formBuilder.group({
            finyear: [''],
            finturnover: [''],
            finnetprofit: [''],
            finupbalsheet: [''],
            pProoffilepath: [''],
            pDocFileType: [''],
            pDocIsDownloadable: [true],
            pTypeofoperation: "CREATE"
          })
        }
      }
    }
  }
 /**<-----(end) saving data of fincial performance (end)------>*/

  /**<-----(start) css for accordian arrows (start)------>*/
  arrowChangeforfinper() {
    this.arrowfinper = !this.arrowfinper
  }
  arrowChangeforpurchase() {
    this.arrowpurchase = !this.arrowpurchase


  }
  arrowChangeforslaes() {
    this.arrowsales = !this.arrowsales

  }
  arrowChangeforstock() {
    this.arrowstock = !this.arrowstock

  }
  arrowChangeforcostofpro() {
    this.arrowcostofpro = !this.arrowcostofpro

  }
  arrowChangeforturnover() {
    this.arrowturnover = !this.arrowturnover
  }
  /**<-----(end) css for accordian arrows (end)------>*/

  pCountry_Change($event: any): void {

    const countryid = $event.target.value;

    if (countryid && countryid != '') {
      this.getSateDetails(countryid);
      const countryName = $event.target.options[$event.target.selectedIndex].text;
      this.businessaddressForm['controls']['businesspCountry'].setValue(countryName);
    }
    else {
      this.stateDetails = [];
      this.districtDetails = [];
      this.businessaddressForm['controls']['pStateId'].setValue('');
      this.businessaddressForm['controls']['pDistrictId'].setValue('');

    }
  }


  pState_Change($event: any): void {

    const stateid = $event.target.value;
    if (stateid && stateid != '') {
      const statename = $event.target.options[$event.target.selectedIndex].text;
      this.businessaddressForm['controls']["pStateId"].value;
      if (statename)
        this.businessaddressForm['controls']['businesspState'].setValue(statename);
      this.getDistrictDetails(stateid);

    }
    else {
      this.districtDetails = [];
      this.businessaddressForm['controls']['pDistrictId'].setValue('');
    }

  }
  getCountryDetails(): void {
    this._contacmasterservice.getCountryDetails().subscribe(json => {
      if (json != null) {
        this.countryDetails = json;
      }
    },
      (error) => {

        this.showErrorMessage(error);
      });

  }
  getSateDetails(countryid) {
    this._contacmasterservice.getSateDetails(countryid).subscribe(json => {
      this.stateDetails = json;
    },
      (error) => {

        this.showErrorMessage(error);
      });
  }
  showErrorMessage(errormsg: string) {
    this._commonService.showErrorMessage(errormsg);
  }

  getDistrictDetails(stateid) {
    this._contacmasterservice.getDistrictDetails(stateid).subscribe(json => {
      this.districtDetails = json;
    },
      (error) => {

        this.showErrorMessage(error);
      });
  }


  pDistrict_Change($event: any): void {

    const districtid = $event.target.value;

    if (districtid && districtid != '') {
      const districtname = $event.target.options[$event.target.selectedIndex].text;

      this.businessaddressForm['controls']['businesspDistrict'].setValue(districtname);
    }
    else {

      this.businessaddressForm['controls']['businesspDistrict'].setValue('');
    }

  }

  onFocusValue(event) {
    this.oldValue = event.target.value;
  }

  calCostOfPro(event) {
    let enteredValue = event.target.value ? Number((event.target.value.toString()).replace(/,/g, "")) : 0;
    this.previousData = Number((this.totalProjectCost.toString()).replace(/,/g, ""));
    if (enteredValue) {
      if (this.oldValue) {
        this.totalProjectCost = Number((this.totalProjectCost.toString()).replace(/,/g, "")) + Number((enteredValue.toString()).replace(/,/g, "")) - Number((this.oldValue.toString()).replace(/,/g, ""));
      } else {
        this.totalProjectCost = Number((this.totalProjectCost.toString()).replace(/,/g, "")) + Number((enteredValue.toString()).replace(/,/g, ""));
      }
    }
    else {
      this.totalProjectCost = (this.totalProjectCost ? Number((this.totalProjectCost.toString()).replace(/,/g, "")) : 0) -
        ((this.costofprojectform.value.costofland ? Number((this.costofprojectform.value.costofland.toString()).replace(/,/g, "")) : 0)
          + (this.costofprojectform.value.bulidingcivilworks ? Number((this.costofprojectform.value.bulidingcivilworks.toString()).replace(/,/g, "")) : 0)
          + (this.costofprojectform.value.plantandmachine ? Number((this.costofprojectform.value.plantandmachine.toString()).replace(/,/g, "")) : 0)
          + (this.costofprojectform.value.Equipment ? Number((this.costofprojectform.value.Equipment.toString()).replace(/,/g, "")) : 0)
          + (this.costofprojectform.value.Testingequ ? Number((this.costofprojectform.value.Testingequ.toString()).replace(/,/g, "")) : 0)
          + (this.costofprojectform.value.misc ? Number((this.costofprojectform.value.misc.toString()).replace(/,/g, "")) : 0)
          + (this.costofprojectform.value.Erection ? Number((this.costofprojectform.value.Erection.toString()).replace(/,/g, "")) : 0)
          + (this.costofprojectform.value.Preliminary ? Number((this.costofprojectform.value.Preliminary.toString()).replace(/,/g, "")) : 0)
          + (this.costofprojectform.value.provision ? Number((this.costofprojectform.value.provision.toString()).replace(/,/g, "")) : 0)
          + (this.costofprojectform.value.marginofworking ? Number((this.costofprojectform.value.marginofworking.toString()).replace(/,/g, "")) : 0));
      this.totalProjectCost = Number(this.previousData) - Number(this.totalProjectCost);


    }
    this.totalProjectCost = this._commonService.currencyformat(this.totalProjectCost);

  }
  // To validate Financial performance net profit should not allow more than turnover
  // By Ravi Shankar thrymr team 27th Nov 2019 FS-1848
  netProfitAndTurnoverValidation() {
    let pTurnOverAmount = this.finperform.value.finturnover ? Number(this.finperform.value.finturnover.toString().replace(/,/g, '')) : 0;
    let pNetProfitAmount = this.finperform.value.finnetprofit ? Number(this.finperform.value.finnetprofit.toString().replace(/,/g, '')) : 0;
    if (pNetProfitAmount && pTurnOverAmount) {
      if (pNetProfitAmount > pTurnOverAmount) {
        this.pNetProfitAmountFlag = false;
        this._commonService.showWarningMessage('Net Profit amount can not be greater than Turnover');
      } else {
        this.pNetProfitAmountFlag = true;
      }
    } else {
      this.pNetProfitAmountFlag = true;
    }
  }

  turnverprofiTturnoverValidation() {
    let pTurnOverAmount = this.turnoverform.value.turnover ? Number(this.turnoverform.value.turnover.toString().replace(/,/g, '')) : 0;
    let pNetProfitAmount = this.turnoverform.value.turnoverprofit ? Number(this.turnoverform.value.turnoverprofit.toString().replace(/,/g, '')) : 0;
    if (pNetProfitAmount && pTurnOverAmount) {
      if (pNetProfitAmount > pTurnOverAmount) {
        this.pNetProfitAmountFlag = false;
        this._commonService.showWarningMessage('Net Profit amount can not be greater than Turnover');
      } else {
        this.pNetProfitAmountFlag = true;
      }
    } else {
      this.pNetProfitAmountFlag = true;
    }
  }

}