import { Component, OnInit, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Form, Validators } from '@angular/forms'
import { CommonService } from 'src/app/Services/common.service';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { FIIndividualLoanspecficService } from 'src/app/Services/Loans/Transactions/fiindividual-loanspecfic.service';
import { FIIndividualService } from 'src/app/Services/Loans/Transactions/fiindividual.service';
import { Router } from '@angular/router';

declare const $: any;

@Component({
  selector: 'app-loanagainstdepositsloan',
  templateUrl: './loanagainstdepositsloan.component.html',
  styles: []
})

export class LoanagainstdepositsloanComponent implements OnInit {
  @Input() ApplicantLoanSpecificDetailsForloanAgainstDeposits: any;
  _FirstInformationTabsData: any = [];

  loanagainstdepositsForm: FormGroup;
  details: any = [];
  loanAgainstDeposits = [];
  applicationdate: Date;
  loanagainstdepositErrorMessage: any;
  loanAgainstDepositResponse: any;
  loanAgainstDepositFileName: any;
  loanAgainstDepositFilePath: any;
  loanDetails: any;
  fileName: any = '';

  fileData = null;
  percentDone: number;
  totalDepositValue: Number = 0;
  indexValue: number;
  dropdoenTabname: string;
  uploadSuccess: boolean;
  isEditable = false;
  submitted = false;
  FdRdTabDetails: any = [];
  @Input()
  set FdRdTabData(FdRdTabDetails: any) {
    this.FdRdTabDetails = FdRdTabDetails;
    // let FilterFdRdTabDetails:any = FdRdTabDetails.filter(function (data) {
    //   return data.pstatus == true;
    // });
    // for (let index = 0; index < FilterFdRdTabDetails.length; index++) {
    //   let data={
    //     "pRecordid": 0,
    //     "pdeposittype": FilterFdRdTabDetails[index].pdeposittype,
    //     "pbankcreditfacility": FilterFdRdTabDetails[index].pbankcreditfacility,
    //     "pdepositaccountnumber": FilterFdRdTabDetails[index].pdepositaccountnumber,
    //     "pdepositamount": FilterFdRdTabDetails[index].pdepositamount,
    //     "pdepositinterestpercentage": FilterFdRdTabDetails[index].pdepositinterestpercentage,
    //     "pdepositdate": FilterFdRdTabDetails[index].pdepositdate,
    //     "pdeposittenure": FilterFdRdTabDetails[index].pdeposittenure,
    //     "pTypeofoperation": "CREATE"
    //   }
    //   this.loanAgainstDeposits.push(data);
    // }

    // console.log('this.loanAgainstDeposits',this.loanAgainstDeposits)
    // let peligibleamount=0;
    // this.loanAgainstDeposits = FilterFdRdTabDetails;
    // this.loanAgainstDeposits.forEach((item) => {
    //     peligibleamount += this._commonService.removeCommasForEntredNumber(item.pdepositamount);
    //   });
    //   this.totalDepositValue=this._commonService.currencyformat(peligibleamount);
    // console.log('this.loanAgainstDeposits',this.loanAgainstDeposits);
    // console.log('this.totalDepositValue',this.totalDepositValue);
  }
  public pdateofestablishmentConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();

  constructor(
    private formbuilder: FormBuilder,
    private _commonService: CommonService,
    private http: HttpClient,
    private fiIndividualLoanServices: FIIndividualLoanspecficService, private fiindividualservics: FIIndividualService, private router: Router) {
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
    });
    if (this.FdRdTabDetails.length > 0) {
      let FilterFdRdTabDetails: any = this.FdRdTabDetails.filter(function (data) {
        return data.pstatus == true;
      });
      this.totalDepositValue = 0;
      this.loanAgainstDeposits = FilterFdRdTabDetails;
      let peligibleamount = 0;
      this.loanAgainstDeposits = FilterFdRdTabDetails;
      this.loanAgainstDeposits.forEach((item) => {
        peligibleamount += this._commonService.removeCommasForEntredNumber(item.pdepositamount);
        item.pdepositdate = item.pdepositdate.split("/").reverse().join("-");
        item.pMaturitydate = item.pMaturitydate.split("/").reverse().join("-");

      });
      this.totalDepositValue = this._commonService.currencyformat(peligibleamount);
    }
  }

  ngOnInit() {
    this.loanagainstdepositErrorMessage = {};
    this.loanagainstdepositsForm = this.formbuilder.group({
      deposittype: ['', Validators.required],
      bankcreditfacility: [''],
      depositacnumber: [''],
      amountindepositac: [''],
      depositinterest: [''],
      depositdate: [''],
      deposittenure: [''],
      uploaddocument: [''],
    });
    this.BlurEventAllControll(this.loanagainstdepositsForm);

  }
  /**<-----(start) config maxdate as date of application, getting from loan specific component(start)---->   */
  ngAfterViewChecked() {
    if (this.applicationdate) {
      this.pdateofestablishmentConfig.maxDate = new Date(this.applicationdate);
    }

  }

  /**<-----(end) config maxdate as date of application, getting from loan specific component(end)---->   */

  /**<-----(start) add form data to grid(start)---->   */
  submit() {
    try {
      let isvalid = true;
      if (this.checkValidations(this.loanagainstdepositsForm, isvalid)) {
        this.submitted = true;
        let data = {
          "pRecordid": 0,
          "pdeposittype": this.loanagainstdepositsForm.value['deposittype'],
          "pbankcreditfacility": this.loanagainstdepositsForm.value['bankcreditfacility'],
          "pdepositaccountnumber": this.loanagainstdepositsForm.value['depositacnumber'],
          "pdepositamount": this.loanagainstdepositsForm.value['amountindepositac'],
          "pdepositinterestpercentage": this.loanagainstdepositsForm.value['depositinterest'],
          "pdepositdate": this.loanagainstdepositsForm.value['depositdate'],
          "pdeposittenure": this.loanagainstdepositsForm.value['deposittenure'],
          "pUploadfilename": this.loanAgainstDepositFileName,
          "pdepositdocpath": this.loanAgainstDepositFilePath,
          "pTypeofoperation": "CREATE"
        }
        this.loanagainstdepositsForm.controls.uploaddocument.setValue(this.loanAgainstDepositFileName);
        this.loanAgainstDeposits.push(data);
        this.totalDepositValue = 0
        for (let index = 0; index < this.loanAgainstDeposits.length; index++) {
          this.totalDepositValue = (this.totalDepositValue ? Number((this.totalDepositValue.toString()).replace(/,/g, "")) : 0) + (this.loanAgainstDeposits[index].pdepositamount ? Number((this.loanAgainstDeposits[index].pdepositamount.toString()).replace(/,/g, "")) : 0);
          this.totalDepositValue = this._commonService.currencyformat(this.totalDepositValue);
        }

        if ($('#fileLoanAgainstDeposit').val()) {
          $('#fileLoanAgainstDeposit').val(null);
          if (this.loanAgainstDepositResponse) {
            this.loanAgainstDepositResponse.name = '';
          }
          this.loanAgainstDepositFileName = null;
          this.loanAgainstDepositFilePath = null;
        }
        this.loanagainstdepositErrorMessage = {};
        this.BlurEventAllControll(this.loanagainstdepositsForm);
        this.loanagainstdepositsForm = this.formbuilder.group({
          deposittype: ['', Validators.required],
          bankcreditfacility: [''],
          depositacnumber: [''],
          amountindepositac: [''],
          depositinterest: [''],
          depositdate: [''],
          deposittenure: [''],
          uploaddocument: [''],

        });
      }
    } catch (error) {
      this._commonService.errormessages(error);
    }
  }
  /**<-----(end) add form data to grid(end)---->   */

  /**<-----(start) update form data from grid(start)---->   */
  edit(obj, index) {
    this.isEditable = true;
    this.indexValue = index;
    this.loanagainstdepositsForm.patchValue({
      deposittype: obj.deposittype,
      bankcreditfacility: obj.bankcreditfacility,
      depositacnumber: obj.depositacnumber,
      amountindepositac: obj.amountindepositac,
      depositinterest: obj.depositinterest,
      depositdate: obj.depositdate,
      deposittenure: obj.deposittenure,
      goldarticletypeimage: obj.goldarticletypeimage,
      uploaddocument: obj.uploaddocument,

    })
  }
  /**<-----(end) update form data from grid(end)---->   */


  /**<-----(start) remove form data from grid(start)---->   */
  public removeHandler({ dataItem }) {
    const index: number = this.loanAgainstDeposits.indexOf(dataItem);
    if (index !== -1) {
      this.loanAgainstDeposits.splice(index, 1);
    }
    this.totalDepositValue = 0
    for (let index = 0; index < this.loanAgainstDeposits.length; index++) {
      this.totalDepositValue = (this.totalDepositValue ? Number((this.totalDepositValue.toString()).replace(/,/g, "")) : 0) + (this.loanAgainstDeposits[index].pdepositamount ? Number((this.loanAgainstDeposits[index].pdepositamount.toString()).replace(/,/g, "")) : 0);
      this.totalDepositValue = this._commonService.currencyformat(this.totalDepositValue);
    }
  }
  /**<-----(start) remove form data from grid(start)---->   */

  /**<-----(start) upload file functionality(start)---->   */
  //image uploading 
  upload(event, files) {
    let file = event.target.files[0];
    if (event && file) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = e => {
        this.loanAgainstDepositResponse = {
          name: file.name,
          fileType: "loanAgainstDepositResponse",
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
      formData.append('NewFileName', this.loanagainstdepositsForm.value["deposittype"] + '.' + files[i]["name"].split('.').pop());
    }
    size = size / 1024;
    size = size / 1024
    this._commonService.fileUpload(formData).subscribe(data => {
      this.loanAgainstDepositFileName = data[1];
      this.loanAgainstDepositFilePath = data[0];

    })
  }
  /**<-----(end) upload file functionality(end)---->   */

  /**<-----(start) checking validations based on formgroup(start)---->   */
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
          this.loanagainstdepositErrorMessage[key] = '';
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
                this.loanagainstdepositErrorMessage[key] += errormessage + ' ';
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
  /**<-----(end) checking validations based on formgroup(end)---->   */

  /**<-----(start) saving data to api(start)---->   */

  saveLoanAgainstDepositsData() {
    try {
      debugger
      this.ApplicantLoanSpecificDetailsForloanAgainstDeposits.pCreatedby = this._commonService.pCreatedby;
      this.ApplicantLoanSpecificDetailsForloanAgainstDeposits.lstLoanagainstDepositDTO = this.loanAgainstDeposits;
      this.fiIndividualLoanServices.saveLoanData(this.ApplicantLoanSpecificDetailsForloanAgainstDeposits).subscribe(res => {
        console.log('saved');
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
      if (str == '' && temptabname == '') {
        this._commonService.showInfoMessage('Saved successfully');
        this.router.navigateByUrl('/FiView');
        return
      }
      this._commonService.SetFiTabName(temptabname);
      this.dropdoenTabname = temptabname;
      $('.nav-item a[href="#' + str + '"]').tab('show').addClass('active show');
    } catch (error) {
      this._commonService.showErrorMessage(error);
    }
  }
  /**<-----(end) saving data to api(end)---->   */


}
