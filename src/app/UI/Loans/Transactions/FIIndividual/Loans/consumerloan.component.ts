import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { FIIndividualLoanspecficService } from 'src/app/Services/Loans/Transactions/fiindividual-loanspecfic.service';
import { FIIndividualService } from 'src/app/Services/Loans/Transactions/fiindividual.service';
import { Router } from '@angular/router';

declare const $: any;
@Component({
  selector: 'app-consumerloan',
  templateUrl: './consumerloan.component.html',
  styles: []
})
export class ConsumerloanComponent implements OnInit {
	_FirstInformationTabsData: any = [];
  
  
  /**
   * To get 1st tab and 2nd tab data while create and update.
   */
  @Input() ApplicantLoanSpecificDetailsforConsumerLoan: any;

  /**
   * To get loan details .
   */
  @Input() loanDetailsofchild: any

  /**
   * Flag sending to 9th tab to get the data.
   */
  @Output() forFiReferencesDataForGetData = new EventEmitter();

  /**
   * Consumer form declaration.
   */
  consumerLoanForm: FormGroup;
  productTypeModelForm: FormGroup;

  show = false;
  warrantyFlag: false;
  warrantyType: boolean = true;
  guaranteeType: boolean = false;
  downPaymentFlag: boolean = false;
  otherCostFlag: boolean = false;
  insuranceCostFlag: boolean = false;

  totalBalance: number = 0;
  totalDownPayment: number = 0;
  totalProducts: number = 0;
  toatlCostOfProduct: number = 0;
  balanceAmount: number = 0;
  pAmountrequested: number = 0;

  idProductTypeMessage: any;
  consumerLoanErrorMessage: any;
  fiSecondTabdata: any;

  gridData = [];
  getExistingConsumableproductTypes = [];

  dropdoenTabname: string;

  constructor(private formBuilder: FormBuilder, private _commonService: CommonService, private fiIndividualLoanServices: FIIndividualLoanspecficService, private fiIndividualServices:FIIndividualService, private router:Router) { }
  ngOnChanges(): void {
    this.fiIndividualServices.GetFirstInformationTabs().subscribe(json => {
      if (json != null) {
        this._FirstInformationTabsData = json;
      }
    })
  }
  ngOnInit() {
    this._commonService._GetFiTab1Data().subscribe(res => {
      if (res != null && res != undefined && res != "") {
        this.fiSecondTabdata = res;
        this.pAmountrequested = this.fiSecondTabdata.pAmountrequested;
        this.pAmountrequested = this._commonService.currencyformat(this.pAmountrequested);
      }
    });

    this.idProductTypeMessage = {};
    this.consumerLoanErrorMessage = {};
    this.productTypeModelForm = this.formBuilder.group({
      pCreatedby: [this._commonService.pCreatedby],
      pproducttype: [''],
    });

    /**
     * Consumer Loan form initialization (start)
     */
    this.consumerLoanForm = this.formBuilder.group({
      pproducttype: [''],
      pproductname: [''],
      pmanufacturer: [''],
      pproductmodel: [''],
      pquantity: [''],
      pcostofproduct: [''],
      pinsurancecostoftheproduct: [''],
      pothercost: [''],
      ptotalcostofproduct: [''],
      pperiod: [''],
      pperiodtype: ['Days'],
      ptotalproductcost: [''],
      pdownpayment: [''],
      pbalanceamount: [''],
    });

    /**
     * Consumer Loan form initialization (end)
     */

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
          this.consumerLoanErrorMessage[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;

            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;

            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.consumerLoanErrorMessage[key] += errormessage + ' ';
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


  /**
   * On changing of product type setting form value to key.
   */
  changeCategory($event) {
    let productType = $event.target.value;
    this.consumerLoanForm = this.formBuilder.group({
      pproducttype: [productType],
      pproductname: [''],
      pmanufacturer: [''],
      pproductmodel: [''],
      pquantity: [''],
      pcostofproduct: [''],
      pinsurancecostoftheproduct: [''],
      pothercost: [''],
      ptotalcostofproduct: [''],
      pperiod: [''],
      pperiodtype: ['Days'],
      ptotalproductcost: [''],
      pdownpayment: [''],
      pbalanceamount: [''],
    });
  }

  /**
   * Calculation of total cost of product and total balance amount (start).
   */
  calculateTotalCostOfProductAndTotalBalance() {
    let costOfProduct = 0
    let insuranceCostCfProduct = 0;
    let otherCost = 0;
    let downPayment = 0;
    let tcp = 0;

    this.toatlCostOfProduct = 0;
    this.balanceAmount = 0;

    if (this.consumerLoanForm.value['pquantity']) {
      costOfProduct = Number(((this.consumerLoanForm.value["pcostofproduct"]).toString()).replace(/,/g, ""));
      insuranceCostCfProduct = Number(((this.consumerLoanForm.value["pinsurancecostoftheproduct"]).toString()).replace(/,/g, ""));
      otherCost = Number(((this.consumerLoanForm.value["pothercost"]).toString()).replace(/,/g, ""));
      downPayment = Number(((this.consumerLoanForm.value["pdownpayment"]).toString()).replace(/,/g, ""));
      if ((otherCost > 0) && (otherCost > costOfProduct)) {
        this.otherCostFlag = false;
        this._commonService.showWarningMessage('Other cost can not be greater than Cost of Product');
      } else if ((insuranceCostCfProduct > 0) && (insuranceCostCfProduct > costOfProduct)) {
        this.insuranceCostFlag = false;
        this._commonService.showWarningMessage('Insurance cost can not be greater than Cost of Product');
      } else {
        this.insuranceCostFlag = true;
        this.otherCostFlag = true;

        tcp = Number(costOfProduct) + Number(insuranceCostCfProduct) + Number(otherCost);
        this.toatlCostOfProduct = tcp * Number(((this.consumerLoanForm.value['pquantity']).toString()).replace(/,/g, ""));
        if (downPayment > 0) {
          if (downPayment < Number(this.toatlCostOfProduct)) {
            this.downPaymentFlag = true;
            this.balanceAmount = Number(this.toatlCostOfProduct) - (Number(downPayment));
            this.balanceAmount = this._commonService.currencyformat(this.balanceAmount);
          } else {
            this.downPaymentFlag = false;
            this._commonService.showWarningMessage('DownPayment should not be greater than Total Cost of Product');
          }
        } else {
          this.downPaymentFlag = true;
          this.balanceAmount = this._commonService.currencyformat(this.toatlCostOfProduct);
        }
        this.toatlCostOfProduct = this._commonService.currencyformat(this.toatlCostOfProduct);
        downPayment = this._commonService.currencyformat(downPayment) == 0 ? '' : this._commonService.currencyformat(downPayment);

        this.consumerLoanForm.controls['pdownpayment'].setValue(downPayment);


        this.consumerLoanForm.controls['ptotalcostofproduct'].setValue(this.toatlCostOfProduct);
        this.consumerLoanForm.controls['pbalanceamount'].setValue(this.balanceAmount);
      }
    }
  }
  /**
   * Calculation of total cost of product and total balance amount (end).
   */


  /**
   * Functiont to save grid data using a proper dto dtructure (start).
   */
  saveToApi() {
    this.ApplicantLoanSpecificDetailsforConsumerLoan.consumerLoanDTO.lstConsumerLoanDetailsDTO = [];
    if (this.ApplicantLoanSpecificDetailsforConsumerLoan) {
      this.ApplicantLoanSpecificDetailsforConsumerLoan.pCreatedby = this._commonService.pCreatedby;
    }
    for (let index = 0; index < this.gridData.length; index++) {

      /**
       * proper DTO structure.
       */
      let gridObj = {
        "pproducttype": this.gridData[index].pproducttype,
        "pproductname": this.gridData[index].pproductname,
        "pproductmodel": this.gridData[index].pproductmodel,
        "pquantity": this.gridData[index].pquantity ? Number(((this.gridData[index].pquantity).toString()).replace(/,/g, "")) : 0,
        "pcostofproduct": this.gridData[index].pcostofproduct ? Number(((this.gridData[index].pcostofproduct).toString()).replace(/,/g, "")) : 0,
        "pinsurancecostoftheproduct": this.gridData[index].pinsurancecostoftheproduct ? Number(((this.gridData[index].pinsurancecostoftheproduct).toString()).replace(/,/g, "")) : 0,
        "pothercost": this.gridData[index].pothercost ? Number(((this.gridData[index].pothercost).toString()).replace(/,/g, "")) : 0,
        "ptotalcostofproduct": this.gridData[index].ptotalcostofproduct ? Number(((this.gridData[index].ptotalcostofproduct).toString()).replace(/,/g, "")) : 0,
        "pperiod": this.gridData[index].pperiod ? Number(((this.gridData[index].pperiod).toString()).replace(/,/g, "")) : 0,
        "pperiodtype": this.gridData[index].pperiodtype,
        "pRecordid": this.gridData[index].pRecordid,
        "piswarrantyapplicable": this.gridData[index].piswarrantyapplicable,
        "pmanufacturer": this.gridData[index].pmanufacturer,
        "pTypeofoperation": this.gridData[index].pTypeofoperation,
      }
      this.ApplicantLoanSpecificDetailsforConsumerLoan.consumerLoanDTO.pdownpayment = this.totalDownPayment ? Number(((this.totalDownPayment).toString()).replace(/,/g, "")) : 0;
      this.ApplicantLoanSpecificDetailsforConsumerLoan.consumerLoanDTO.pbalanceamount = this.totalBalance ? Number(((this.totalBalance).toString()).replace(/,/g, "")) : 0;
      this.ApplicantLoanSpecificDetailsforConsumerLoan.consumerLoanDTO.ptotalproductcost = this.totalProducts ? Number(((this.totalProducts).toString()).replace(/,/g, "")) : 0;
      this.ApplicantLoanSpecificDetailsforConsumerLoan.consumerLoanDTO.lstConsumerLoanDetailsDTO.push(gridObj);

    }

    this.fiIndividualLoanServices.saveLoanData(this.ApplicantLoanSpecificDetailsforConsumerLoan).subscribe(response => {
      this.consumerLoanForm = this.formBuilder.group({
        pproducttype: [''],
        pproductname: [''],
        pmanufacturer: [''],
        pproductmodel: [''],
        pquantity: [''],
        pcostofproduct: [''],
        pinsurancecostoftheproduct: [''],
        pothercost: [''],
        ptotalcostofproduct: [''],
        pperiod: [''],
        pperiodtype: [''],
        ptotalproductcost: [''],
        pdownpayment: [''],
        pbalanceamount: [''],
      });
      this.BlurEventAllControll(this.consumerLoanForm);
      // let str = 'references';
      // this.dropdoenTabname = "References";

      // $('.nav-item a[href="#' + str + '"]').tab('show');

      let str;
      let temptabname;
      this.dropdoenTabname = this._commonService.GetFiTabName();
      let tempFirstInformationTabsData = this._FirstInformationTabsData;
      let data = this.fiIndividualServices.moevToNextTab(tempFirstInformationTabsData, this.dropdoenTabname);
      str = data.tabId;
      temptabname = data.tabName;
      if(str=='' && temptabname==''){
        this._commonService.showInfoMessage('Saved successfully');
        this.router.navigateByUrl('/FiView');
        return
      }
      this._commonService.SetFiTabName(temptabname);
      this.dropdoenTabname = temptabname;
      $('.nav-item a[href="#' + str + '"]').tab('show').addClass('active show');
      this.forFiReferencesDataForGetData.emit(true);
    });
  }
  /**
   * Functiont to save grid data using a proper dto dtructure (end).
   */

  /**
   * Consumer form data adding to grid (start).
   */
  addDatatoGrid() {

    let addFlag: boolean = false;
    if (this.consumerLoanForm.value.pproducttype ||
      this.consumerLoanForm.value.pproductname ||
      this.consumerLoanForm.value.pproductmodel ||
      this.consumerLoanForm.value.pquantity ||
      this.consumerLoanForm.value.pcostofproduct ||
      this.consumerLoanForm.value.pinsurancecostoftheproduct ||
      this.consumerLoanForm.value.pothercost ||
      this.consumerLoanForm.value.pdownpayment ||
      this.consumerLoanForm.value.pperiod ||
      this.consumerLoanForm.value.pmanufacturer) {
      addFlag = true;
    }
    else {
      addFlag = false;
    }

    let isvalid = true;
    if (this.downPaymentFlag == false) {
      this._commonService.showWarningMessage('DownPayment should not be greater than Total Cost of Product');
    } else if (this.otherCostFlag == false) {
      this._commonService.showWarningMessage('Other cost can not be greater than Cost of Product');
    } else if (this.insuranceCostFlag == false) {
      this._commonService.showWarningMessage('Insurance cost can not be greater than Cost of Product');
    } else {
      if (addFlag) {
        if (this.checkValidations(this.consumerLoanForm, isvalid)) {
          let addDatatoGrid = {
            "pRecordid": 0,
            "pproducttype": this.consumerLoanForm.value["pproducttype"],
            "pproductname": this.consumerLoanForm.value["pproductname"],
            "pproductmodel": this.consumerLoanForm.value["pproductmodel"],
            "pquantity": this.consumerLoanForm.value["pquantity"] ? this._commonService.currencyformat(this.consumerLoanForm.value["pquantity"]) : 0,
            "pcostofproduct": this.consumerLoanForm.value["pcostofproduct"] ? this._commonService.currencyformat(this.consumerLoanForm.value["pcostofproduct"]) : 0,
            "pinsurancecostoftheproduct": this.consumerLoanForm.value["pinsurancecostoftheproduct"] ? this._commonService.currencyformat(this.consumerLoanForm.value["pinsurancecostoftheproduct"]) : 0,
            "pothercost": this.consumerLoanForm.value["pothercost"] ? this._commonService.currencyformat(this.consumerLoanForm.value["pothercost"]) : 0,
            "ptotalcostofproduct": this.consumerLoanForm.value["ptotalcostofproduct"] ? this._commonService.currencyformat(this.consumerLoanForm.value["ptotalcostofproduct"]) : 0,
            "pperiod": this.consumerLoanForm.value["pperiod"] ? this._commonService.currencyformat(this.consumerLoanForm.value["pperiod"]) : 0,
            "pperiodtype": this.consumerLoanForm.value["pperiodtype"],
            "piswarrantyapplicable": true,
            "ptotalproductcost": this.consumerLoanForm.value["ptotalproductcost"] ? this._commonService.currencyformat(this.consumerLoanForm.value["ptotalproductcost"]) : 0,
            "pmanufacturer": this.consumerLoanForm.value["pmanufacturer"],
            "pdownpayment": this.consumerLoanForm.value["pdownpayment"] ? this._commonService.currencyformat(this.consumerLoanForm.value["pdownpayment"]) : 0,
            "pbalanceamount": this.consumerLoanForm.value["pbalanceamount"] ? this._commonService.currencyformat(this.consumerLoanForm.value["pbalanceamount"]) : 0,
            "pTypeofoperation": "CREATE"
          }
          this.gridData.push(addDatatoGrid);
          this.totalBalance = 0;
          this.totalDownPayment = 0;
          this.totalProducts = 0;

          /**
           * Calculation of total balance ,total downpayment and total products cost using grid data.
           */
          for (let index = 0; index < this.gridData.length; index++) {
            this.totalBalance = (this.totalBalance ? Number((this.totalBalance.toString()).replace(/,/g, "")) : 0) + (this.gridData[index].pbalanceamount ? Number((this.gridData[index].pbalanceamount.toString()).replace(/,/g, "")) : 0);
            this.totalDownPayment = (this.totalDownPayment ? Number((this.totalDownPayment.toString()).replace(/,/g, "")) : 0) + (this.gridData[index].pdownpayment ? Number((this.gridData[index].pdownpayment.toString()).replace(/,/g, "")) : 0);
            this.totalProducts = (this.totalProducts ? Number((this.totalProducts.toString()).replace(/,/g, "")) : 0) + (this.gridData[index].ptotalcostofproduct ? Number((this.gridData[index].ptotalcostofproduct.toString()).replace(/,/g, "")) : 0);
            this.totalBalance = this._commonService.currencyformat(this.totalBalance);
            this.totalDownPayment = this._commonService.currencyformat(this.totalDownPayment);
            this.totalProducts = this._commonService.currencyformat(this.totalProducts);
          }

          this.consumerLoanForm = this.formBuilder.group({
            pproducttype: [''],
            pproductname: [''],
            pmanufacturer: [''],
            pproductmodel: [''],
            pquantity: [''],
            pcostofproduct: [''],
            pinsurancecostoftheproduct: [''],
            pothercost: [''],
            ptotalcostofproduct: [''],
            pperiod: [''],
            pperiodtype: [''],
            ptotalproductcost: [''],
            pdownpayment: [''],
            pbalanceamount: [''],
          });

        }
      }
    }
  }

  /**
   * To show error message.
   */
  showErrorMessage(errormsg: string) {
    this._commonService.showErrorMessage(errormsg);
  }

  /**
   * To show info message.
   */
  showInfoMessage(errormsg: string) {
    this._commonService.showInfoMessage(errormsg);
  }

  /**
   * Getting existing product type. 
   */
  getConsumableproductTypes() {
    this.fiIndividualLoanServices.getConsumableproductTypes().subscribe(response => {
      if (response != null) {
        this.getExistingConsumableproductTypes = response
      }
    },
      (error) => {
        this.showErrorMessage(error);
      });
  }

  /**
   * To save product type modal data (start).
   */
  saveConsumableproductTypes(): void {

    try {

      let isvalid = true;
      if (this.checkValidations(this.productTypeModelForm, isvalid)) {
        this.productTypeModelForm['controls']['pCreatedby'].setValue(this._commonService.pCreatedby);
        this.fiIndividualLoanServices.saveConsumableproductTypes(this.productTypeModelForm.value).subscribe(res => {
          this.showInfoMessage("Saved Sucessfully");
          $('#idProductTypeModel').modal('hide');
          this.productTypeModelForm['controls']['pproducttype'].setValue('');
          this.getConsumableproductTypes();
        },
          (error) => {

            this.showErrorMessage(error);
          });

      }
    }
    catch (e) {
      this.showErrorMessage(e);
    }
  }
  /**
   *To save product type modal data (end). 
   */

  /**
   * Remove functionality for grid row (start).
   */
  public removeHandler({ dataItem }) {
    this.totalBalance = 0;
    this.totalDownPayment = 0;
    this.totalProducts = 0;
    const index: number = this.gridData.indexOf(dataItem);
    if (index !== -1) {
      this.gridData.splice(index, 1);
    }
    this.totalBalance = 0;
    this.totalDownPayment = 0;
    this.totalProducts = 0;
    /**
     * Calculation of total balance ,total downpayment and total products cost using grid data.
     */
    for (let index = 0; index < this.gridData.length; index++) {
      this.totalBalance = (this.totalBalance ? Number((this.totalBalance.toString()).replace(/,/g, "")) : 0) + (this.gridData[index].pbalanceamount ? Number((this.gridData[index].pbalanceamount.toString()).replace(/,/g, "")) : 0);
      this.totalDownPayment = (this.totalDownPayment ? Number((this.totalDownPayment.toString()).replace(/,/g, "")) : 0) + (this.gridData[index].pdownpayment ? Number((this.gridData[index].pdownpayment.toString()).replace(/,/g, "")) : 0);
      this.totalProducts = (this.totalProducts ? Number((this.totalProducts.toString()).replace(/,/g, "")) : 0) + (this.gridData[index].ptotalcostofproduct ? Number((this.gridData[index].ptotalcostofproduct.toString()).replace(/,/g, "")) : 0);
      this.totalBalance = this._commonService.currencyformat(this.totalBalance);
      this.totalDownPayment = this._commonService.currencyformat(this.totalDownPayment);
      this.totalProducts = this._commonService.currencyformat(this.totalProducts);
    }

  }

  /**
   * Remove functionality for grid row (end).
   */

  /**
   * Warranty and gurantee type sending flag to backend. 
   */
  onSelect(selectedType) {
    if (selectedType == 'warranty') {
      this.warrantyType = true;
      this.guaranteeType = false;
    }
    else {
      this.warrantyType = false;
      this.guaranteeType = true;
    }
  }

  /**
   * Re-initialization of ngonit 
   */
  loadInitData() {
    this.idProductTypeMessage = {};
    this.consumerLoanErrorMessage = {};
    this.productTypeModelForm = this.formBuilder.group({
      pCreatedby: [this._commonService.pCreatedby],
      pproducttype: [''],
    });
    this.consumerLoanForm = this.formBuilder.group({
      pproducttype: [''],
      pproductname: [''],
      pmanufacturer: [''],
      pproductmodel: [''],
      pquantity: [''],
      pcostofproduct: [''],
      pinsurancecostoftheproduct: [''],
      pothercost: [''],
      ptotalcostofproduct: [''],
      pperiod: [''],
      pperiodtype: ['Days'],
      ptotalproductcost: [''],
      pdownpayment: [''],
      pbalanceamount: [''],
    });
  }
}
