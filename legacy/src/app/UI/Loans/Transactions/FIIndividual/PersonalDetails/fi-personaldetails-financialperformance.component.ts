import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';

declare let $: any

@Component({
  selector: 'app-fi-personaldetails-financialperformance',
  templateUrl: './fi-personaldetails-financialperformance.component.html',
  styles: []
})
export class FiPersonaldetailsFinancialperformanceComponent implements OnInit {

  businessfinacialperformnaceForm:FormGroup;

  businessFincialGriddata=[];
  finperyear=[];

  @Input() showBusinessFinacial: any;

  businessFincialperErrorMessage: any;
  financialPerformanceFilePath:any;
  imageResponse:any;
  financialPerformanceFileName:any;

  pNetProfitAmountFlag : Boolean = true;
  restrictyearflag:boolean =true;

  constructor(
    private formbuilder: FormBuilder,
    private _commonService: CommonService) { }

  ngOnInit() {
    this.businessFincialperErrorMessage={};
    this.businessfinacialperformnaceForm = this.formbuilder.group({
      pfinancialyear: [''],
      pturnoveramount : [''],
      pnetprofitamount : [''],
      pdocbalancesheetpath : [''],
      pCreatedby: [this._commonService.pCreatedby],
      precordid: [0],
      pStatusname: [this._commonService.pStatusname],  
      ptypeofoperation: [this._commonService.ptypeofoperation]  
    })  
    this.BlurEventAllControll(this.businessfinacialperformnaceForm);
    this.getYearsList();
  }

  /**<-----(start) checking validations based on formgroup(start)-------> */
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
          this.businessFincialperErrorMessage[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;

            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.businessFincialperErrorMessage[key] += errormessage + ' ';
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
  /**<-----(end) checking validations based on formgroup(end)-------> */

  /**<-----(start) Add finacial performance form data to grid with checking validations(start)-------> */
  savebusinessfinacilperData(){    
  if(this.businessFincialGriddata.length > 0){
   for (let i = 0; i < this.businessFincialGriddata.length; i++) {
    if(this.businessFincialGriddata[i].pfinancialyear == this.businessfinacialperformnaceForm.value.pfinancialyear){
      this.restrictyearflag = false;
      this._commonService.showWarningMessage('Finacial year already exist');
      break;
    }
    else{
      this.restrictyearflag = true;
    }
      }   
    }
if (this.pNetProfitAmountFlag == false) {
    this._commonService.showWarningMessage('Net Profit amount can not be greater than Turnover');
   } else {
    let addFlag;
    if(this.businessfinacialperformnaceForm.value.pturnoveramount) {
      this.businessFincialperErrorMessage.pturnoveramount = '';
      this.BlurEventAllControll(this.businessfinacialperformnaceForm);
      if(this.businessfinacialperformnaceForm.value.pfinancialyear ||
        this.businessfinacialperformnaceForm.value.pturnoveramount  ||
        this.businessfinacialperformnaceForm.value.pnetprofitamount  ){
          addFlag = true;
        }
        else{
          addFlag = false;
          if ($('#filePdocBalanceSheetPath').val()) {
            $('#filePdocBalanceSheetPath').val(null);
          }
        }
      let isvalid = true;      
      if(addFlag && this.restrictyearflag){
      if (this.checkValidations(this.businessfinacialperformnaceForm, isvalid)) {
        this.businessfinacialperformnaceForm.controls.pdocbalancesheetpath.setValue(this.financialPerformanceFileName);
        this.businessfinacialperformnaceForm.value.pturnoveramount = this.businessfinacialperformnaceForm.value.pturnoveramount ? this._commonService.currencyformat(this.businessfinacialperformnaceForm.value.pturnoveramount):0;
        this.businessfinacialperformnaceForm.value.pnetprofitamount = this.businessfinacialperformnaceForm.value.pnetprofitamount ? this._commonService.currencyformat(this.businessfinacialperformnaceForm.value.pnetprofitamount):0; 
        this.businessFincialGriddata.push(this.businessfinacialperformnaceForm.value);
        this.financialPerformanceFilePath = null;
        this.financialPerformanceFileName = null;
        this.imageResponse = null;
      if(this.imageResponse)
       this.imageResponse.name='';
       if ($('#filePdocBalanceSheetPath').val()) {
        $('#filePdocBalanceSheetPath').val(null);
       }
  
       this.businessfinacialperformnaceForm = this.formbuilder.group({
        precordid: [0],
        pfinancialyear: [''],
        pturnoveramount : [''],
        pnetprofitamount : [''],
        pdocbalancesheetpath : [''],
        pCreatedby: [this._commonService.pCreatedby],   
        pStatusname: [this._commonService.pStatusname],    
        ptypeofoperation: [this._commonService.ptypeofoperation]     
     });
    
      this.BlurEventAllControll(this.businessfinacialperformnaceForm);
  
      }
    }
    }
    else {
      this.businessFincialperErrorMessage.pturnoveramount = 'Turnover amount is required';
      this.BlurEventAllControll(this.businessfinacialperformnaceForm);
    }
   }
  }
  /**<-----(end)Add finacial performance form data to grid with checking validations(end)-------> */
  
  /**<-----(start) year dropdown field list functionality(start)-------> */
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
  /**<-----(end) year dropdown field list functionality(end)-------> */
  
/**<-----(start) Get form data(start)-------> */
getFormData(): any {
    return this.businessFincialGriddata;
  }
/**<-----(end) Get form data(end)-------> */

/**<-----(start) Set data to form(start)-------> */
  setFormData(formData) {
    for (let i = 0; i < this.businessFincialGriddata.length; i++) {      
      this.businessFincialGriddata[i].pturnoveramount = this._commonService.currencyformat(formData[i].pturnoveramount);
      this.businessFincialGriddata[i].pnetprofitamount = this._commonService.currencyformat(formData[i].pnetprofitamount);
    }
    this.businessFincialGriddata = formData;
  }
/**<-----(end)  Set data to form(end)-------> */

/**<-----(start) Upload file functionality(start)-------> */
   uploadAndProgress(event: any, files) {
    this.financialPerformanceFilePath = null;
    this.imageResponse = null;
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
      formData.append('NewFileName', this.businessfinacialperformnaceForm.value['pdocbalancesheetpath'] + '.' + files[i]["name"].split('.').pop());
    }
    size = size / 1024;
    this._commonService.fileUpload(formData).subscribe(data => {
      this.financialPerformanceFileName = data[1];
      if(this.imageResponse)
      this.imageResponse.name = data[1];
      this.financialPerformanceFilePath = data[0];
      this.businessfinacialperformnaceForm.value.pdocbalancesheetpath=this.financialPerformanceFilePath
    })
  }
/**<-----(end) Upload file functionality(end)-------> */

/**<-----(start) remove one record to grid functionality(start)-------> */
   public removeHandler({ dataItem }) {
    const index: number = this.businessFincialGriddata.indexOf(dataItem);
          if (index !== -1) {
            this.businessFincialGriddata.splice(index, 1);
          }
  }
/**<-----(end) remove one record to grid functionality(end)-------> */

  // To validate Financial performance net profit should not allow more than turnover
  // By Ravi Shankar thrymr team 27th Nov 2019 FS-1848
  netProfitAndTurnoverValidation(){
    let pTurnOverAmount = this.businessfinacialperformnaceForm.value.pturnoveramount? Number(this.businessfinacialperformnaceForm.value.pturnoveramount.toString().replace(/,/g, '')) : 0;
    let pNetProfitAmount = this.businessfinacialperformnaceForm.value.pnetprofitamount ? Number(this.businessfinacialperformnaceForm.value.pnetprofitamount.toString().replace(/,/g, '')) : 0;
    if (pNetProfitAmount && pTurnOverAmount) {
      if (pNetProfitAmount > pTurnOverAmount) {
        this.pNetProfitAmountFlag = false;
        this._commonService.showWarningMessage('Net Profit amount can not be greater than Turnover');
      }else{
        this.pNetProfitAmountFlag = true;
      }
    }
  }

}
