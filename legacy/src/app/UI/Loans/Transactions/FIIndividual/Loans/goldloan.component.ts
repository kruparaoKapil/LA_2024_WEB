import { Component, OnInit, EventEmitter, Input, Output, NgZone, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Form, Validators, FormArray } from '@angular/forms'
import { CommonService } from 'src/app/Services/common.service';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { FIIndividualLoanspecficService } from 'src/app/Services/Loans/Transactions/fiindividual-loanspecfic.service';
import { FiLoanspecficComponent } from '../fi-loanspecfic.component';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { FIIndividualService } from 'src/app/Services/Loans/Transactions/fiindividual.service';
import { Router } from '@angular/router';

declare const $: any;
@Component({
  selector: 'app-goldloan',
  templateUrl: './goldloan.component.html',
  styles: []
})
export class GoldloanComponent implements OnInit {
	_FirstInformationTabsData: any = [];
   
  
  @Input() ApplicantLoanSpecificDetails: any;

  goldForm: FormGroup;

  public gridData: any[] = [];
  details: any = [];
  existedgoldLoansDatas = [];
  goldLoansDatas = [];

  lstGoldLoanTypes: any;
  goldConfigErrorMessage: any;
  goldLoanDataTableInfo: any;
  goldLoanAmountsDataTableInfo: any;
  goldLoanFileName: any;
  goldLoanFilePath: any;
  goldLoanTypeColumns: any;
  goldLoanResponse: any;
  downloadFile: any;
  name: any;
  fileType: any;
  contentType: any;
  size: any;
  base64: any;
  result: any;
  data: any;

  isEditable = false;
  submitted = false;
  netWeightFlag: Boolean = true;
  indexValue: number;
  computeTotalAppraisedValue: number = 0;
  dropdoenTabname: string;
  public pdateofestablishmentConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();



  constructor(
    private formbuilder: FormBuilder, 
    private zone: NgZone, 
    private _commonService: CommonService, 
    private http: HttpClient, 
    private fiIndividualLoanServices: FIIndividualLoanspecficService, private fiindividualservics:FIIndividualService, private router:Router) {
    this.pdateofestablishmentConfig.containerClass = 'theme-dark-blue';
    this.pdateofestablishmentConfig.showWeekNumbers = false;
    this.pdateofestablishmentConfig.maxDate = new Date();
    this.pdateofestablishmentConfig.dateInputFormat = 'DD/MM/YYYY';
  }
  ngOnChanges(): void {
    this.fiindividualservics.GetFirstInformationTabs().subscribe(json => {
      if (json != null) {
        this._FirstInformationTabsData = json;
      }
    })
  }
  ngOnInit() {
    this.goldConfigErrorMessage = {};
    this.goldForm = this.formbuilder.group({
      pGoldArticleType: ['', Validators.maxLength(75)],
      pDetailsofGoldArticle: [''],
      pCarat: ['', Validators.maxLength(20)],
      pGrossweight: ['', Validators.maxLength(12)],
      pobservations: ['', Validators.maxLength(150)],
      pNetWeight: ['', Validators.maxLength(12)],
      pGoldArticlePath: [''],
      pAppraisedValue: ['', Validators.maxLength(12)],
      pAppraisalDate: [''],
      pAppraisorName: ['', Validators.maxLength(50)],
      pDocStorePath: [''],
      pDocFileType: [''],
    })
    this.BlurEventAllControll(this.goldForm);
  }
/** <----(start) clear gold from data (start)----> */
  clearGoldFormData($event) {
    let pGoldArticleType = $event.target.value;
    this.goldForm = this.formbuilder.group({
      pGoldArticleType: [pGoldArticleType, Validators.maxLength(75)],
      pDetailsofGoldArticle: [''],
      pCarat: ['', Validators.maxLength(20)],
      pGrossweight: ['', Validators.maxLength(12)],
      pobservations: ['', Validators.maxLength(150)],
      pNetWeight: ['', Validators.maxLength(12)],
      pGoldArticlePath: [''],
      pAppraisedValue: ['', Validators.maxLength(12)],
      pAppraisalDate: [''],
      pAppraisorName: ['', Validators.maxLength(50)],
      pDocStorePath: [''],
      pDocFileType: [''],

    });
    if ($('#fileGoldLoan').val()) {
      $('#fileGoldLoan').val(null);
      this.goldLoanResponse.name = '';
    }
  }
/** <----(end) clear gold from data (end)----> */

 /**<---- (start)validation for Net Weight and Gross weight By Ravi Shankar thrymr team(start)----> */
 /**<---- (start) Net Weight can not be greater than Gross weight<---- (start)----> */
  netWeightAndGrossweightValidation() {
    let pGrossweight = Number(this.goldForm.value.pGrossweight);
    let pNetWeight = Number(this.goldForm.value.pNetWeight);
    if (pGrossweight && pNetWeight) {
      if (pNetWeight > pGrossweight) {
        this.netWeightFlag = false;
        this._commonService.showWarningMessage('Net Weight can not be greater than Gross weight');
      } else {
        this.netWeightFlag = true;
      }
    }
  }
 /**<---- (end)validation for Net Weight and Gross weight By Ravi Shankar thrymr team(end)----> */

 /**<-----(start) Add gold loan data to grid (start)----> */ 
 submit() {
    if (this.netWeightFlag == false) {
      this._commonService.showWarningMessage('Net Weight can not be greater than Gross weight');
    } else {
      let isvalid = true;
      let addFlag: boolean = false;
      if (this.goldForm.value.pGoldArticleType ||
        this.goldForm.value.pDetailsofGoldArticle ||
        this.goldForm.value.pCarat ||
        this.goldForm.value.pGrossweight ||
        this.goldForm.value.pNetWeight ||
        this.goldForm.value.pobservations ||
        this.goldForm.value.pAppraisedValue
      ) {
        addFlag = true;
      }
      else {
        addFlag = false;
        if ($('#fileGoldLoan').val()) {
          $('#fileGoldLoan').val(null);
          this.goldLoanResponse.name = '';
        }
      }
      if (addFlag) {
        if (this.checkValidations(this.goldForm, isvalid)) {
          // this.ApplicantLoanSpecificDetails.lstGoldLoanDTO.lstGoldLoanDetailsDTO.push(this.goldForm.getRawValue());
          //this.kycDocumentForm.reset();
          let cs = this.goldForm.value;



          let addDatatoGrid = {
            "pGoldArticleType": this.goldForm.value["pGoldArticleType"],
            "pDetailsofGoldArticle": this.goldForm.value["pDetailsofGoldArticle"],
            "pCarat": this.goldForm.value["pCarat"],
            "pGrossweight": this.goldForm.value["pGrossweight"],
            "pNetWeight": this.goldForm.value["pNetWeight"],
            "pAppraisedValue": this.goldForm.value["pAppraisedValue"] ? this._commonService.currencyformat(this.goldForm.value["pAppraisedValue"]) : 0,
            "pobservations": this.goldForm.value["pobservations"],
            "pUploadfilename": this.goldLoanFileName,
            "pGoldArticlePath": this.goldLoanFilePath,
            "ptypeofoperation": "CREATE"
          }
          this.ApplicantLoanSpecificDetails.lstGoldLoanDTO.lstGoldLoanDetailsDTO.push(addDatatoGrid);
          this.computeTotalAppraisedValue = 0;
          this.computeTotalAppraisedValue = this._commonService.currencyformat(this.computeTotalAppraisedValue);
          for (let i = 0; i < this.ApplicantLoanSpecificDetails.lstGoldLoanDTO.lstGoldLoanDetailsDTO.length; i++) {
            this.computeTotalAppraisedValue = Number((this.computeTotalAppraisedValue.toString()).replace(/,/g, "")) + (this.ApplicantLoanSpecificDetails.lstGoldLoanDTO.lstGoldLoanDetailsDTO[i].pAppraisedValue ? Number((this.ApplicantLoanSpecificDetails.lstGoldLoanDTO.lstGoldLoanDetailsDTO[i].pAppraisedValue.toString()).replace(/,/g, "")) : 0);
          }
          this.computeTotalAppraisedValue = this._commonService.currencyformat(this.computeTotalAppraisedValue);
          this.goldLoanFileName = '';
          this.goldLoanFilePath = '';
          //this.goldLoanResponse.name='';
          this.BlurEventAllControll(this.goldForm);
          if ($('#fileGoldLoan').val()) {
            $('#fileGoldLoan').val(null);
            this.goldLoanResponse.name = '';
          }
          this.goldForm = this.formbuilder.group({
            pGoldArticleType: ['', Validators.maxLength(75)],
            pDetailsofGoldArticle: [''],
            pCarat: ['', Validators.maxLength(20)],
            pGrossweight: ['', Validators.maxLength(12)],
            pobservations: ['', Validators.maxLength(150)],
            pNetWeight: ['', Validators.maxLength(12)],
            pGoldArticlePath: [''],
            pAppraisedValue: ['', Validators.maxLength(12)],
            pAppraisalDate: [''],
            pAppraisorName: ['', Validators.maxLength(50)],
            pDocStorePath: [''],
            pDocFileType: [''],

          });
        }
      }
    }
  }
 /**<-----(end) Add gold loan data to grid (end)----> */ 

 /**<-----(start)update gold loan data from grid (start)----> */ 
  edit(obj, index) {
    this.isEditable = true;
    this.indexValue = index;
    this.goldForm.patchValue({
      pGoldArticleType: obj.pGoldArticleType,
      pDetailsofGoldArticle: obj.pDetailsofGoldArticle,
      pCarat: obj.pCarat,
      pGrossweight: obj.pGrossweight,
      pNetWeight: obj.pNetWeight,
      pAppraisedValue: obj.pAppraisedValue,
      pobservations: obj.pobservations,
      pGoldArticlePath: obj.pGoldArticlePath,
    })
    let updateData = this.ApplicantLoanSpecificDetails.lstGoldLoanDTO.lstGoldLoanDetailsDTO;
    updateData[index].pTypeofoperation = 'UPDATE';
  }
 /**<-----(end)update gold loan data from grid (end)----> */ 

 /**<-----(start)remove gold loan data from grid (start)----> */ 
  delete(index: any) {
    if ((Object.keys(this.ApplicantLoanSpecificDetails.lstGoldLoanDTO.lstGoldLoanDetailsDTO[index]).length <= 10)) {
      this.ApplicantLoanSpecificDetails.lstGoldLoanDTO.lstGoldLoanDetailsDTO.splice(index, 1);
    } else {
      let deleteData = this.ApplicantLoanSpecificDetails.lstGoldLoanDTO.lstGoldLoanDetailsDTO;
      deleteData[index].pTypeofoperation = 'DELETE';
    }

  }
 /**<-----(end)remove gold loan data from grid (end)----> */ 

 /**<-----(start)upload file functionality (start)----> */ 
    upload(event, files) {
    let file = event.target.files[0];
    if (event && file) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = e => {
        this.goldLoanResponse = {
          name: file.name,
          fileType: "goldLoanResponse",
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
      formData.append('NewFileName', this.goldForm.value["pGoldArticleType"] + '.' + files[i]["name"].split('.').pop());
    }
    size = size / 1024;
    size = size / 1024
    //console.log(size.toFixed(2) + ' MB');
    this._commonService.fileUpload(formData).subscribe(data => {
      this.goldLoanFileName = data[1];
      this.goldLoanFilePath = data[0];

    })
  }
 /**<-----(end)upload file functionality (end)----> */ 

 /**<-----(start)show error message (start)----> */ 
  showErrorMessage(errormsg: string) {
    this._commonService.showErrorMessage(errormsg);
  }
  showInfoMessage(errormsg: string) {
    this._commonService.showInfoMessage(errormsg);
  }
 /**<-----(end)show error message (end)----> */ 

 /**<-----(start)checking validations based on formgroup (start)----> */ 
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
          this.goldConfigErrorMessage[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;

            //if (key == 'pTitleName')
            //  lablename = 'Title';
            //else
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;

            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.goldConfigErrorMessage[key] += errormessage + ' ';
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
 /**<-----(end)checking validations based on formgroup (end)----> */ 

 /**<-----(start)saving gold form data to api (start)----> */ 
    addGoldLoanData() {
    try {
      let saveFlag: boolean = false;

      this.ApplicantLoanSpecificDetails.pCreatedby = this._commonService.pCreatedby;
      this.ApplicantLoanSpecificDetails.lstGoldLoanDTO.pAppraisalDate = this.goldForm.value.pAppraisalDate;
      this.ApplicantLoanSpecificDetails.lstGoldLoanDTO.pAppraisorName = this.goldForm.value.pAppraisorName;
      this.ApplicantLoanSpecificDetails.lstGoldLoanDTO.pTotalAppraisedValue = Number(this.computeTotalAppraisedValue ? (this.computeTotalAppraisedValue).toString().replace(/,/g, "") : 0);
      for (let i = 0; i < this.ApplicantLoanSpecificDetails.lstGoldLoanDTO.lstGoldLoanDetailsDTO.length; i++) {
        this.ApplicantLoanSpecificDetails.lstGoldLoanDTO.lstGoldLoanDetailsDTO[i].pAppraisedValue = this.ApplicantLoanSpecificDetails.lstGoldLoanDTO.lstGoldLoanDetailsDTO[i].pAppraisedValue ? Number((this.ApplicantLoanSpecificDetails.lstGoldLoanDTO.lstGoldLoanDetailsDTO[i].pAppraisedValue.toString()).replace(/,/g, "")) : 0;
      }
      // let name = this.goldForm.value.pAppraisorName.trim();
      // if(this.ApplicantLoanSpecificDetails.lstGoldLoanDTO.lstGoldLoanDetailsDTO && this.ApplicantLoanSpecificDetails.lstGoldLoanDTO.lstGoldLoanDetailsDTO.length > 0 &&
      //   this.goldForm.value.pAppraisalDate && 
      //   name && this.computeTotalAppraisedValue != null) {
      //     saveFlag = true;
      //   }
      //   else {
      //     saveFlag =  false;
      //   }
      //   //console.log("saveFlag : ",saveFlag);

      // if(saveFlag) {
      //console.log("hiiiiiii");

      this.fiIndividualLoanServices.saveLoanData(this.ApplicantLoanSpecificDetails).subscribe(res => {
        //console.log("deeeeee");

        this.ApplicantLoanSpecificDetails.lstGoldLoanDTO.lstGoldLoanDetailsDTO = [];
        this.BlurEventAllControll(this.goldForm);
        this.goldForm = this.formbuilder.group({
          pGoldArticleType: ['', Validators.maxLength(75)],
          pDetailsofGoldArticle: [''],
          pCarat: ['', Validators.maxLength(20)],
          pGrossweight: ['', Validators.maxLength(12)],
          pobservations: ['', Validators.maxLength(150)],
          pNetWeight: ['', Validators.maxLength(12)],
          pGoldArticlePath: [''],
          pAppraisedValue: ['', Validators.maxLength(12)],
          pAppraisalDate: [''],
          pAppraisorName: ['', Validators.maxLength(50)],
          pDocStorePath: [''],
          pDocFileType: [''],

        });
        // let str = 'references';
        // this.dropdoenTabname = "references"

        // $('.nav-item a[href="#' + str + '"]').tab('show');
        let str;
            let temptabname;
            this.dropdoenTabname = this._commonService.GetFiTabName();
            let tempFirstInformationTabsData = this._FirstInformationTabsData;
            let data = this.fiindividualservics.moevToNextTab(tempFirstInformationTabsData, this.dropdoenTabname);
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


      },
        (error) => {

          this.showErrorMessage(error);
        });
      // }
    }

    // }


    catch (e) {

    }
  }
 /**<-----(end)saving gold form data to api (end)----> */ 

  public removeHandler({ dataItem }) {
    const index: number = this.ApplicantLoanSpecificDetails.lstGoldLoanDTO.lstGoldLoanDetailsDTO.indexOf(dataItem);
    if (index !== -1) {
      this.ApplicantLoanSpecificDetails.lstGoldLoanDTO.lstGoldLoanDetailsDTO.splice(index, 1);
    }
    this.computeTotalAppraisedValue = 0;
    for (let i = 0; i < this.ApplicantLoanSpecificDetails.lstGoldLoanDTO.lstGoldLoanDetailsDTO.length; i++) {
      this.computeTotalAppraisedValue = Number(this.computeTotalAppraisedValue) + Number(this.ApplicantLoanSpecificDetails.lstGoldLoanDTO.lstGoldLoanDetailsDTO[i].pAppraisedValue);
    }
  }
  // public editHandler({ dataItem }) {

  //   this.Buttonlabel = "Update"
  //   this.BankForm.controls.pBankName.setValue(dataItem.pBankName);
  //   this.BankForm.controls.pBankAccountNo.setValue(dataItem.pBankAccountNo);
  //   this.BankForm.controls.pBankifscCode.setValue(dataItem.pBankifscCode);
  //   this.BankForm.controls.pBankBranch.setValue(dataItem.pBankBranch);
  //   this.EditIndexid = this.bankdetailslist.indexOf(dataItem);
  // }
  // computedTotalAppraisedValue(){
  //   for (let i = 0; i < this.ApplicantLoanSpecificDetails.lstGoldLoanDTO.lstGoldLoanDetailsDTO.length; i++) {
  //     this.computeTotalAppraisedValue= this.computeTotalAppraisedValue+Number(this.ApplicantLoanSpecificDetails.lstGoldLoanDTO.lstGoldLoanDetailsDTO[i].pAppraisedValue)
  //   }
  // }

}
