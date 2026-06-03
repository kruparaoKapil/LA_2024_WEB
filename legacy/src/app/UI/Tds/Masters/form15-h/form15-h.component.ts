import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { distinctUntilChanged, tap, switchMap, catchError } from 'rxjs/operators';
import { CommonService } from 'src/app/Services/common.service';
import { Subject, of, concat } from 'rxjs';
import { DatePipe, formatCurrency } from '@angular/common';

@Component({
  selector: 'app-form15-h',
  templateUrl: './form15-h.component.html',
  styleUrls: ['./form15-h.component.css']
})
export class Form15HComponent implements OnInit {
  @Input() selectedContactId;
  Form15Group: FormGroup;
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  CalendarYear: any[] = [];
  calendarYearData: any[] = [];
  nextyear: any;
  previousyear: any;
  getAssessmentYear: any;
  assessmentYear: any;
  statename: any[] = [];
  districtname: any[] = [];
  selected = [];
  pCreatedby: number = 0;
  tanNoList: any[] = [];
  Form15uiddetails: any[] = [];
  disablesavebutton: boolean;
  savebutton: string;
  disableSubscriberName = false;
  form15ValidationErrors: any = {};
  introducedSearchevent = new Subject<string>();
  subIntroducedSearchevent = new Subject<string>();
  subIntroducedList: any;
  //identificationno:any;
  uanno: any[] = [];
  dropDownDataSearchLength: any = this._commonService.searchfilterlength;
  imageResponse: any;
  uploadedguid: any = ''
  kycFileName: any;
  formEntryType: string;
  //searchplaceholder: any = this._commonService.searchplaceholder;
  contactsList: any = [];
  valNumber: any
  transactiontype = 'CREATE';
  eligibilityamount: 10000;
  estimated_income_declartion_amount: 10000;
  // :estimated_total_income_amount10000;
  contactSearchevent = new Subject<string>();
  showkyc: boolean;
  is194ASection: boolean = false;
  fiscalYear: any;
  Companyreportdetails: any;
  localschema: any;
  companynames: any[] = [];
  disablesaveform15hbutton: boolean;
  contactid: any[] = [];
  relatedareanameslist: any;
  isEdit: Boolean = false;
  existingAmount: any = 0;
  disableControls: any
  updatedAmount: any;
  allowedit: boolean = false;
  privousyear: any;
  roleid: any;
  schemaname: any;
  lastfinancialyrDate: any
  contactType = 'Individual';
  Contactid: any;
  selectedvalues: any = []
  // M.Tulasi Ayyappa  19/02/2026
  constructor(private datepipe: DatePipe,
    private _commonService: CommonService,
    private __fb: FormBuilder,) {

    //this.dpConfig.dateInputFormat = this._commonService.datePickerPropertiesSetup("dateInputFormat");
    this.dpConfig.dateInputFormat = 'DD-MMM-YYYY';
    this.dpConfig.containerClass = this._commonService.datePickerPropertiesSetup("containerClass");
    this.dpConfig.showWeekNumbers = false;
    this.dpConfig.maxDate = new Date();

    this.dpConfig1.dateInputFormat = 'DD-MMM-YYYY';
    //this.dpConfig1.dateInputFormat = this._commonService.datePickerPropertiesSetup("dateInputFormat");
    this.dpConfig1.containerClass = this._commonService.datePickerPropertiesSetup("containerClass");
    this.dpConfig1.showWeekNumbers = false;
    this.dpConfig1.maxDate = new Date();
  }
  // M.Tulasi Ayyappa  19/02/2026

  ngOnInit() {
    debugger;
    this.formGroup();

    // this.loadAssessmentYears();
    this.BlurEventAllControll(this.Form15Group);
    this.contactSearch();
    // this.contactsList = [];

    this.applyTdsSectionRule();
    this.getcompanyNames();
    this.getFiscalYear();


    //this.localschema = this._commonService.getschemaname();

    this.roleid = sessionStorage.getItem('roleid');
    if (this.roleid == "2") {
      this.allowedit = true;
      this.Form15Group.get('estimated_total_income_amount').disable();
    } else {
      this.Form15Group.get('estimated_total_income_amount').disable();
    }

    this.Form15Group.get('estimatedIncome').valueChanges.subscribe(val => {
      if (val !== null && val !== undefined) {
        this.Form15Group.patchValue({
          incomePaid: val,
          declarationIncome: val
        }, { emitEvent: false });
      }
    })

  }
  getFiscalYear() {
    debugger;
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const month1 = today.getMonth();
    const fyEndYear = month <= 2 ? year : year + 1;
    //this.lastfinancialyrDate= this._commonService.getFormatDateGlobal(new Date(fyEndYear, 2, 31),);
    let lastfinancialyrDate = new Date(fyEndYear, 2, 31);
    this.lastfinancialyrDate = this.datepipe.transform(lastfinancialyrDate, 'dd-MMM-yyyy')
    this.fiscalYear = (month >= 4)
      ? `${year}-${year + 1}`
      : `${year - 1}-${year}`;

    //  this.Form15Group.get('fiscalYear')?.setValue(this.fiscalYear);
    this.Form15Group.controls.fiscalYear.setValue(this.fiscalYear)
    this.Form15Group.controls.incomeNature.setValue('')
    this.Form15Group.controls.incometaxact.setValue('')
    this.Form15Group.controls.eligibilityamount.setValue('')
    // this.Form15Group.controls.estimated_total_income_amount.setValue('10000')
    //this.Form15Group.controls.income_paidamount.setValue('10000')
    //this.Form15Group.controls.aggregateamount.setValue('10000')
    // this.Form15Group.controls.estimated_income_declartion_amount.setValue('10000')
    const [startYear, endYear] = this.fiscalYear.split('-').map(Number);
    this.assessmentYear = `${startYear + 1}-${endYear + 1}`;
    this.Form15Group.controls.previousyear.setValue(this.fiscalYear)
    this.Form15Group.controls.assessmentYear.setValue(this.assessmentYear)
    this.Form15Group.controls.form15_filedcount.setValue('')
    //this.Form15Group.controls.investorreceiptno.setValue('1')
    this.Form15Group.controls.nextyear.setValue(this.lastfinancialyrDate)
  }

  GetContactDetailsByContactID(contactid) {

    try {
      this._commonService.GetContactDetailsByContactID(contactid).subscribe(json => {

        try {
          if (json != null) {


          }
        }
        catch (error) {
          this._commonService.exceptionHandlingMessages('Subscriber Configuration', 'GetOtherBranches', error);
        }
      },
        (error) => {

          this._commonService.showErrorMessage(error);
        });
    }
    catch (error) {
      this._commonService.exceptionHandlingMessages('Subscriber Configuration', 'GetOtherBranches', error);
    }
  }


  validateRelatedareanameslist() {
    if (this.relatedareanameslist.length > 0) {
      return true;
    }
    else {
      this._commonService.showWarningMessage("Add atleast one related name to grid.");
      return false;
    }
  }


  CalendarYear_change(event: any) {
    let assessmentYear = typeof event === 'string' ? event : event.pPeriodType;
    if (!assessmentYear) {
      this.Form15Group.patchValue({ assessmentYear: null, previousyear: null }, { emitEvent: false });
      return;
    }
    const [startYear, endYear] = this.previousyear.split('-').map(Number);
    assessmentYear = `${startYear + 1}-${endYear + 1}`;
    this.Form15Group.patchValue({
      assessmentYear: assessmentYear,
      // previousyear: previousYear
    }, { emitEvent: false });
  }

  PreviousYear_change(event: any) {
    const previousYear = typeof event === 'string' ? event : event.pPeriodType;
    if (!previousYear) {
      debugger;
      this.Form15Group.patchValue({
        assessmentYear: null, previousyear: null
      }, { emitEvent: false });
      return;
    }
    const [startYear, endYear] = previousYear.split('-').map(Number);
    const AssessmentYear = `${startYear + 1}-${endYear + 1}`;
    this.Form15Group.patchValue({
      assessmentYear: AssessmentYear,
      previousyear: previousYear
    }, { emitEvent: false });
  }
  formGroup(): void {
    this.form15ValidationErrors = {};
    this.Form15Group = this.__fb.group({
      // identificationno: [''],
      contactid: [null, Validators.required],
      //  identificationno: [''],
      dob: [''],
      mobile: [''],
      email: [''],
      pan: [''],
      aadhar: [''],
      flat: [''],
      street: [''],
      locality: [''],
      districtname: [''],
      statename: [''],
      pincode: [''],
      estimated_income_declartion_amount: [''],
      estimated_total_income_amount: ['', Validators.required],
      form15_filedcount: [''],
      declarationDate: ['', Validators.required],
      income_paidamount: [''],
      income_paiddate: ['', Validators.required],
      incometaxact: ['', Validators.required],
      investorreceiptno: ['', Validators.required],
      incomeNature: [''],
      assessmentYear: [''],
      companyName: [null, Validators.required],
      tanno: ['', Validators.required],
      //uid: [''],
      nextyear: ['', Validators.required],
      previousyear: [''],
      file_name: [''],
      uploadedguid: [''],
      fiscalYear: [''],
      aggregateamount: [''],
      eligibilityamount: [''],
      edituid: [''],
      previousExistamount: [''],
      contactname: ['']

    });
  }
  validateFile(fileName) {
    try {
      debugger
      if (fileName == undefined || fileName == "") {
        return true
      }
      else {
        var ext = fileName.substring(fileName.lastIndexOf('.') + 1);
        if (ext.toLowerCase() == 'jpg' || ext.toLowerCase() == 'png' || ext.toLowerCase() == 'pdf') {

          return true
        }
      }
      return false
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }

  // saveform15h() {
  //   debugger;
  //   let valnumber1;
  //   let eligibilityAmount = this._commonService.removeCommasForEntredNumber(this.Form15Group.controls.eligibilityamount.value);
  //   let income_amount = this._commonService.removeCommasForEntredNumber(this.Form15Group.controls.estimated_total_income_amount.value) + this.existingAmount
  //   if (this.isEdit) {
  //     valnumber1 = this.valNumber + this.existingAmount
  //   }
  //   else {
  //     valnumber1 = this.valNumber
  //   }
  //   let totalamount = this._commonService.removeCommasForEntredNumber(this.Form15Group.controls.estimated_total_income_amount.value) + this.existingAmount
  //   if (this.isEdit) {
  //     let previousform15amount = this._commonService.removeCommasForEntredNumber(this.Form15Group.controls.previousExistamount.value);
  //     if (previousform15amount = eligibilityAmount) {
  //       this._commonService.showWarningMessage("form15 Amount Already Equals the Eligible Amount");
  //       this.disablesavebutton = false;
  //     }
  //   }

  //   if (valnumber1 <= eligibilityAmount || income_amount <= eligibilityAmount || this.updatedAmount <= eligibilityAmount) {
  //     try {
  //       this.savebutton = "Processing";
  //       this.disablesavebutton = true;
  //       let transactiontype = "";
  //       let isValid = true;

  //       if (this.checkValidations(this.Form15Group, isValid)) {

  //         let income_paiddate = this.datepipe.transform(this.Form15Group.get('income_paiddate').value, 'yyyy-MM-dd');

  //         let declarationDate = this.datepipe.transform(this.Form15Group.get('declarationDate').value, 'yyyy-MM-dd');

  //         let nextyear = this.datepipe.transform(this.Form15Group.get('nextyear').value, 'yyyy-MM-dd');

  //         const FromBody = {
  //           transactiondate: this._commonService.getFormatDate(new Date()),
  //           //branchid: this.localschema,
  //           // pan: this.Form15Group.get('subscriberpanno')?.value,
  //           dob: this.Form15Group.get('dob').value,
  //           pan: this.Form15Group.get('pan').value,
  //           // identificationno: this.identificationno,
  //           //  identificationno:  this.Form15Group.controls.identificationno.value,
  //           contactid: this.Form15Group.get('contactid').value,
  //           incometaxact: this.Form15Group.get('incometaxact').value,
  //           // eligibilityAmount: this.Form15Group.get('eligibilityamount').value,
  //           // income_paidamount:this.Form15Group.get('income_paidamount').value,
  //           // aggregateamount:this.Form15Group.get('aggregateamount').value,
  //           // estimated_income_declartion_amount:this.Form15Group.get('estimated_income_declartion_amount').value,
  //           // estimated_total_income_amount:this.Form15Group.get('estimated_total_income_amount').value,
  //           // this.Form15Group['controls']['pCreatedby'].setValue(this._commonService.pCreatedby),
  //           // pipaddress: this._commonService.getipaddress(),
  //           declarationreceived_date: declarationDate,
  //           income_paiddate: income_paiddate,
  //           incomedetails: '',
  //           investorreceiptno: this.Form15Group.get('investorreceiptno').value,
  //           natur_of_income: this.Form15Group.get('incomeNature').value || '',
  //           nextyear: nextyear,
  //           assessmentYear: this.Form15Group.get('assessmentYear').value,
  //           previousyear: this.Form15Group.get('previousyear').value,
  //           companyid: this.Form15Group.get('companyName').value || '',
  //           tanno: this.Form15Group.get('tanno').value,
  //           form15_filedcount: this.Form15Group.get('form15_filedcount').value,
  //           filename: this.Form15Group.get('file_name').value || '',
  //           approvedby: null,
  //           approvedstatus: null,
  //           approveddate: null,
  //           estimated_income_declartion_amount: this._commonService.removeCommasForEntredNumber(
  //             this.Form15Group.get('estimated_income_declartion_amount').value),
  //           estimated_total_income_amount: this._commonService.removeCommasForEntredNumber(
  //             this.Form15Group.get('estimated_total_income_amount').value),
  //           aggregateamount: this._commonService.removeCommasForEntredNumber(
  //             this.Form15Group.get('aggregateamount').value),
  //           income_paidamount: this._commonService.removeCommasForEntredNumber(
  //             this.Form15Group.get('income_paidamount').value),
  //           eligibilityAmount: this._commonService.removeCommasForEntredNumber(
  //             this.Form15Group.get('eligibilityamount').value),
  //           fiscalYear: this.fiscalYear || '',
  //           transactiontype: this.transactiontype,
  //           userid: this.Form15Group.controls.edituid.value || '',

  //         };

  //         if (confirm("Do you want to save Form 15H?")) {
  //           debugger;
  //           // this._VerificationService.saveChitReceipt(data).subscribe(json =>
  //           // this._commonService.SaveForm15H(FromBody, this.localschema).subscribe(json =>{
  //           this._commonService.SaveForm15H(FromBody).subscribe(json => {
  //             let savedstatus = json[0];
  //             if ((savedstatus)) {
  //               this._commonService.showInfoMessage("Saved Successfully");

  //               this.savebutton = "Save";
  //               this.disablesavebutton = false;
  //               let panno = this.Form15Group.get('pan').value;
  //               let outparameter = json[1];
  //               let localschema = this.localschema;
  //               let reportName = 'Form 15H';
  //               let reportType = 'Reprint';

  //               //  // let uid = this.Form15Group.get('uid')?.value;
  //               let uid = outparameter;

  //               this.selectedvalues += uid + '@' + reportName + '@' + reportType
  //               //let encoded1 = btoa(`${uid},${reportName},${reportType},${localschema}`);
  //               let receipt = btoa(this.selectedvalues);

  //               //window.open('/#/form15ReprintPreview?id=' + receipt);
  //               // let encoded1 = btoa(`${uid},${reportName},${reportType}`);
  //               // window.open('/#/form15ReprintPreview?id=' + encoded1 + '', "_blank");
  //               this.resetForm();
  //               this.savebutton = "Save";
  //               this.disablesavebutton = false;
  //               this.isEdit = false;
  //             }
  //             error: (err) => {
  //               console.error("Error saving Form15H:", err);
  //               this._commonService.showErrorMessage("Error while saving Form 15H");
  //               this.savebutton = "Save";
  //               this.disablesavebutton = false;
  //               this.isEdit = false;
  //             }
  //           });
  //         } else {
  //           this.savebutton = "Save";
  //           this.disablesavebutton = false;
  //         }
  //       } else {
  //         this._commonService.showWarningMessage("Please fill all required fields.")
  //       }
  //     } catch (error) {
  //       this._commonService.showWarningMessage(error);
  //       this.savebutton = "Save";
  //       this.disablesavebutton = false;
  //     }
  //   }
  //   else {
  //     this._commonService.showWarningMessage("Estimated total income not Exceed the Eligible Amount");
  //   }
  // }



  //Thulasi Ayyappa

  saveform15h() {

    debugger;
    let urc = JSON.parse(sessionStorage.getItem("Urc") || '{}');
    let pCreatedby = urc.pUserID || 0;
    let eligibilityControl = this.Form15Group.get('eligibilityamount');
    let interestControl = this.Form15Group.get('estimated_total_income_amount');
    let eligibilityAmount = eligibilityControl ? this._commonService.removeCommasForEntredNumber(eligibilityControl.value || 0) : 0;
    let interestAmount = interestControl ? this._commonService.removeCommasForEntredNumber(interestControl.value || 0) : 0;
    if (interestAmount > eligibilityAmount) {
      this._commonService.showWarningMessage("Not eligible for Form 15H. Interest payment exceeds eligibility amount.");
      return;
    }
    if (!this.checkValidations(this.Form15Group, true)) {
      this._commonService.showWarningMessage("Please fill all required fields.");
      return;
    }
    this.disablesavebutton = true;
    this.savebutton = "Processing";
    let declarationControl = this.Form15Group.get('declarationDate');
    let incomePaidControl = this.Form15Group.get('income_paiddate');
    let declarationDate = declarationControl && declarationControl.value ? this.datepipe.transform(declarationControl.value, 'yyyy-MM-dd') : null;
    let incomePaidDate = incomePaidControl && incomePaidControl.value ? this.datepipe.transform(incomePaidControl.value, 'yyyy-MM-dd') : null;

    // let fromBody = {

    //   transactiondate: this._commonService.getFormatDate(new Date()),

    //   identificationno: null,

    //   contactid: this.Form15Group.get('contactid')
    //     ? this.Form15Group.get('contactid').value
    //     : null,

    //   incometaxact: this.Form15Group.get('incometaxact')
    //     ? this.Form15Group.get('incometaxact').value
    //     : null,

    //   estimated_income_declartion_amount: this._commonService.removeCommasForEntredNumber(
    //     this.Form15Group.get('estimated_income_declartion_amount')
    //       ? this.Form15Group.get('estimated_income_declartion_amount').value || 0
    //       : 0
    //   ),

    //   estimated_total_income_amount: interestAmount,

    //   form15_filedcount: this.Form15Group.get('form15_filedcount')
    //     ? this.Form15Group.get('form15_filedcount').value || 0
    //     : 0,

    //   aggregateamount: this._commonService.removeCommasForEntredNumber(
    //     this.Form15Group.get('aggregateamount')
    //       ? this.Form15Group.get('aggregateamount').value || 0
    //       : 0
    //   ),

    //   declarationreceived_date: declarationDate,

    //   income_paidamount: this._commonService.removeCommasForEntredNumber(
    //     this.Form15Group.get('income_paidamount')
    //       ? this.Form15Group.get('income_paidamount').value || 0
    //       : 0
    //   ),

    //   income_paiddate: incomePaidDate,

    //   investorreceiptno: this.Form15Group.get('investorreceiptno')
    //     ? this.Form15Group.get('investorreceiptno').value
    //     : null,

    //   natur_of_income: this.Form15Group.get('incomeNature')
    //     ? this.Form15Group.get('incomeNature').value
    //     : null,

    //   previousyear: this.Form15Group.get('previousyear')
    //     ? this.Form15Group.get('previousyear').value
    //     : null,

    //   nextyear: this.Form15Group.get('nextyear')
    //     ? this.Form15Group.get('nextyear').value
    //     : null,

    //   assessmentyear: this.Form15Group.get('assessmentYear')
    //     ? this.Form15Group.get('assessmentYear').value
    //     : null,

    //   companyid: this.Form15Group.get('companyName')
    //     ? this.Form15Group.get('companyName').value
    //     : null,

    //   tanno: this.Form15Group.get('tanno')
    //     ? this.Form15Group.get('tanno').value
    //     : null,

    //   filename: this.Form15Group.get('file_name')
    //     ? this.Form15Group.get('file_name').value
    //     : null,

    //   fiscalYear: this.Form15Group.get('fiscalYear')
    //     ? this.Form15Group.get('fiscalYear').value
    //     : null,

    //   transactiontype: "INSERT"
    // };

    let fromBody = {
      contactid: this.Form15Group.get('contactid').value,
      incometaxact: this.Form15Group.get('incometaxact').value,
      estimated_income_declartion_amount: interestAmount,
      estimated_total_income_amount: interestAmount,
      form15_filedcount: 1,
      aggregateamount: interestAmount,
      declarationreceived_date: declarationDate,
      income_paidamount: interestAmount,
      income_paiddate: incomePaidDate,
      investorreceiptno: this.Form15Group.get('investorreceiptno').value,
      natur_of_income: this.Form15Group.get('incomeNature').value,
      previousyear: this.Form15Group.get('previousyear').value,
      nextyear: this.Form15Group.get('nextyear').value,
      assessmentyear: this.Form15Group.get('assessmentYear').value,
      companyid: this.Form15Group.get('companyName').value,
      tanno: this.Form15Group.get('tanno').value,
      panno: this.Form15Group.get('pan').value,
      filename: '',
      fiscalYear: this.Form15Group.get('fiscalYear').value,
      transactiontype: "INSERT",
      userid: pCreatedby,
    };
    this._commonService.SaveForm15H(fromBody).subscribe({
      next: (json) => {
        let savedstatus = json[0];
        if((savedstatus)){
          this._commonService.showInfoMessage("Saved Successfully");
        };
        this.resetForm();
        this.disablesavebutton = false;
        this.savebutton = "Save";
           // let panno = this.Form15Group.get('pan')?.value;
                let outparameter = json[1];
                let localschema = this.localschema;
                let reportName = 'Form 15H';
                let reportType = 'Reprint';

           // let uid = this.Form15Group.get('uid')?.value;
             let uid = outparameter;

            this.selectedvalues += uid + '@' + reportName + '@' + reportType
            let receipt = btoa(this.selectedvalues);
            window.open('/#/form15ReprintPreview?id=' + receipt);
            //let encoded1 = btoa(`${uid},${reportName},${reportType}`);
           // window.open('/#/form15ReprintPreview?id=' + encoded1 + '', "_blank");
            this.resetForm();
            this.savebutton = "Save";
            this.disablesavebutton = false;
            this.isEdit = false;
      },

      error: (err) => {
        console.error(err);
        this._commonService.showErrorMessage("Error while saving Form 15H");
        this.disablesavebutton = false;
        this.savebutton = "Save";
      }

    });
  }

  // resetForm1(): void {
  //   debugger
  //   this.disableControls.forEach(ctrl => {
  //     this.Form15Group.get(ctrl).enable();
  //   });
  //   //this.Form15Group.reset();
  //   this.getcompanyNames();
  //   //  this.applyTdsSectionRule();
  //   this.isEdit = false;
  //   this.Form15uiddetails = [];
  //   this.getFiscalYear();
  //   this.tanNoList = [];
  //   this.Form15Group.controls.fiscalYear.setValue(this.fiscalYear);
  //   this.Form15Group.controls.contactid.reset();
  //   this.Form15Group.controls.contactname.reset();
  //   this.Form15Group.controls.dob.reset();
  //   this.Form15Group.controls.mobile.reset();
  //   this.Form15Group.controls.email.reset();
  //   this.Form15Group.controls.aadhar.reset();
  //   this.Form15Group.controls.pan.reset();
  //   this.Form15Group.controls.flat.reset();
  //   this.Form15Group.controls.street.reset();
  //   this.Form15Group.controls.locality.reset();
  //   this.Form15Group.controls.districtname.reset();
  //   this.Form15Group.controls.statename.reset();
  //   this.Form15Group.controls.pincode.reset();
  //   // this.Form15Group.controls.incometaxact.reset();
  //   this.Form15Group.controls.estimated_total_income_amount.reset();
  //   //this.Form15Group.controls.form15_filedcount.reset();
  //   this.Form15Group.controls.aggregateamount.reset();
  //   this.Form15Group.controls.declarationDate.reset();
  //   // this.Form15Group.get('declarationDate')?.setValue(new Date());

  //   this.Form15Group.controls.income_paidamount.reset();
  //   this.Form15Group.controls.income_paiddate.reset();
  //   this.Form15Group.controls.estimated_income_declartion_amount.reset();
  //   this.Form15Group.controls.investorreceiptno.reset();
  //   //  this.Form15Group.controls.incomeNature.reset();
  //   this.Form15Group.controls.companyName.reset();
  //   this.Form15Group.controls.tanno.reset();
  //   this.Form15Group.controls.eligibilityamount.reset();

  //   // this.Form15Group.controls.assessmentYear.reset();
  //   //  this.Form15Group.controls.nextyear.reset();
  //   //  this.Form15Group.controls.previousyear.reset();
  //   //this.Form15Group.controls.uid.reset();
  //   this.Form15Group.controls.uploadedguid.reset();
  //   this.form15ValidationErrors = {};
  //   this.Form15Group.get('edituid').setValue('');
  //   this.transactiontype = 'CREATE';

  // }


  // resetForm1() {
  //   this.Form15Group.reset();

  //   // If you want default values after reset, set here
  //   this.Form15Group.patchValue({
  //     companyName: null,
  //     tanno: null,

  //     contactid: null,
  //     dob: '',
  //     mobile: '',
  //     email: '',
  //     aadhar: '',
  //     pan: '',
  //     flat: '',
  //     street: '',
  //     locality: '',
  //     districtname: '',
  //     statename: '',
  //     pincode: '',
  //     incometaxact: '',
  //     eligibilityamount: '',
  //     estimated_total_income_amount: '',
  //     form15_filedcount: '',
  //     aggregateamount: '',
  //     declarationDate: null,
  //     income_paidamount: '',
  //     income_paiddate: null,
  //     estimated_income_declartion_amount: '',
  //     investorreceiptno: '',
  //    // incomeNature: '',
  //    // nextyear: '',
  //     //previousyear: null,
  //     //assessmentYear: ''
  //   });

  //   // Clear validation errors if you are using custom errors
  //   this.form15ValidationErrors = {};
  // }

  resetForm1() {

    let assessmentYear = this.Form15Group.controls.assessmentYear.value;
    let previousyear = this.Form15Group.controls.previousyear.value;
    let nextyear = this.Form15Group.controls.nextyear.value;
    let incomeNature = this.Form15Group.controls.incomeNature.value;
    let fiscalYear = this.Form15Group.controls.fiscalYear.value;
    this.Form15Group.reset();
    this.Form15Group.patchValue({
      assessmentYear: assessmentYear,
      previousyear: previousyear,
      nextyear: nextyear,
      incomeNature: incomeNature,
      fiscalYear: fiscalYear
    });

    this.form15ValidationErrors = {};
  }

  clearContactFields(): void {
    this.Form15Group.patchValue({
      dob: '',
      mobile: '',
      email: '',
      aadhar: '',
      pan: '',
      flat: '',
      street: '',
      locality: '',
      cityname: '',
      districtname: '',
      statename: '',
      pincode: '',
      estimated_total_income_amount: '',
      aggregateamount: '',
      income_paidamount: '',
      estimated_income_declartion_amount: '',
      investorreceiptno: ''
    }, { emitEvent: false });
  }


  resetForm(): void {
    debugger;

    this.form15ValidationErrors = {};
    // if (this.isEdit) {
    //   this.disableControls.forEach(ctrl => {
    //     this.Form15Group.get(ctrl).enable();
    //   });
    // }
    this.Form15Group.reset(
      {
        mobile: '',
        email: '',
        aadhar: '',
        dob: '',
        pan: '',
        flat: '',
        street: '',
        cityname: '',
        districtname: '',
        statename: '',
        pincode: '',
        declarationDate: '',
        nextyear: this.lastfinancialyrDate,
        previousyear: this.fiscalYear,
        fiscalYear: this.fiscalYear,
        assessmentYear: this.assessmentYear,
        incometaxact: '194A',
        incomeNature: 'INTEREST',
        form15_filedcount: '1',
        eligibilityamount: '',
        //eligibilityamount: '',
        //estimated_total_income_amount: '',
        estimated_total_income_amount: '',
        income_paidamount: '',
        aggregateamount: '',
        estimated_income_declartion_amount: '',
        investorreceiptno: ''

      },

      { emitEvent: false }
    );
    Object.keys(this.Form15Group.controls).forEach(key => {
      let control = this.Form15Group.get(key);
      if (control) {
        control.setErrors(null);
        control.markAsPristine();
        control.markAsUntouched();
      }
    });
    this.Form15Group.markAsPristine();
    this.Form15Group.markAsUntouched();

    this.applyTdsSectionRule();
    this.getcompanyNames();
    this.transactiontype = 'CREATE';
  }

  BlurEventAllControll(formgroup: FormGroup) {
    try {
      Object.keys(formgroup.controls).forEach((key: string) => {
        this.setBlurEvent(key);
      });
    } catch (e) {
      // this.showErrorMessage(e);
    }
  }

  checkValidations(group: FormGroup, isValid: boolean): boolean {
    try {
      Object.keys(group.controls).forEach((key: string) => {
        isValid = this.GetValidationByControl(key, isValid);
      });
    } catch (e) {
      // this.showErrorMessage(e);
    }
    return isValid;
  }

  GetValidationByControl(key: string, isValid: boolean): boolean {
    // debugger;
    try {
      let formcontrol = this.Form15Group.get(key);

      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          this.checkValidations(formcontrol, isValid);
        } else if (formcontrol.validator) {
          this.form15ValidationErrors[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let element = document.getElementById(key) as HTMLInputElement;
            let lablename = element ? element.title : key;
            let errormessage;
            for (let errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.form15ValidationErrors[key] += errormessage + ' ';
                isValid = false;
              }
            }
          }
        }
      }
    } catch (e) {
      // this.showErrorMessage(e);
    }
    return isValid;
  }

  setBlurEvent(key: string) {
    try {
      let formcontrol = this.Form15Group.get(key);
      if (formcontrol && !(formcontrol instanceof FormGroup)) {
        if (formcontrol.validator) {
          this.Form15Group.get(key).valueChanges.subscribe(() => {
            this.GetValidationByControl(key, true);
          });
        }
      }
    } catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }

  //  M.Tulasi Ayyappa  19/02/2026

  ContactGridRowSelect(selected: any) {
    debugger;
    this.clearContactFields();
    if (selected && selected.pContactId) {

      this.Contactid = selected.pContactId;
      let fy = this.fiscalYear.split('-');
      let fromDate = fy[0] + '-04-01';
      let toDate = fy[1] + '-03-31';
      this.Form15Group.controls.eligibilityamount.setValue('300000')
      this.Form15Group.controls.form15_filedcount.setValue('1')
      this.Form15Group.controls.incomeNature.setValue('INTEREST')
      this.Form15Group.controls.incometaxact.setValue('194A')


      this._commonService.GetContactDetailsById(this.Contactid, fromDate, toDate).subscribe(data => {
        if (data && data.length > 0) {
          let details = data[0];
          this.Form15Group.patchValue({
            dob: this._commonService.getFormatDate(details.pdob) || '',
            mobile: details.pContactNumber || '',
            email: details.pContactEmail || '',
            aadhar: details.pAadhar || '',
            pan: details.pPan || '',
            flat: details.paddress1 || '',
            street: details.paddress2 || '',
            cityname: details.pcity || '',
            districtname: details.pdistrict || '',
            statename: details.pstate || '',
            pincode: details.ppincode || ''
          });
          let interestAmount = details.total_interest || 0;
          this.Form15Group.patchValue({
            estimated_total_income_amount: interestAmount,
            aggregateamount: interestAmount,
            income_paidamount: interestAmount,
            estimated_income_declartion_amount: interestAmount,
            investorreceiptno: details.fd_receipts || ''
          });

        }
      });
    }
  }



  onTanChange(tanno: string) {
    // this.fetchAndPatchUan();
  }


  getcompanyNames() {
    this._commonService.GetCompanynames1().subscribe({
      next: (res: any) => {
        this.companynames = res;
        console.log("Company List:", res);
      },
      error: (err) => {
        console.error("Error loading company names:", err);
      }
    });
  }
  contactSearch() {
    debugger;
    this._commonService.GetContactData(this.contactType).subscribe(res => {
      this.contactsList = res;
      console.log("Contact list", res);
    });

  }

  applyTdsSectionRule() {
    let control = this.Form15Group.get('incometaxact');
    if (!control) return;

    this._commonService.GetTdsSectionNo().subscribe(
      (res: any[]) => {
        if (res && Array.isArray(res)) {

          let section194A = res.find(
            (x: any) => x.pTdsSection.toString().trim() === '194A'
          );

          if (section194A) {

            control.setValue('194A', { emitEvent: true });
            this.is194ASection = true;
            control.disable({ emitEvent: false });
          } else {

            control.setValue('', { emitEvent: false });
            this.is194ASection = false;
            control.enable({ emitEvent: false });
          }


          control.valueChanges.subscribe(value => {
            if (value.toString().trim() === '194A') {
              this.is194ASection = true;
              control.disable({ emitEvent: false });
            } else {
              this.is194ASection = false;
              control.enable({ emitEvent: false });
            }
          });
        }
      },
      (err) => {
        console.error('Error fetching TDS section number:', err);
      }
    );
  }



  findInvalidControls() {
    let invalid = [];
    let controls = this.Form15Group.controls;
    for (let name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  onCompanyChange(pCompanyId: string) {
    debugger;
    this.Form15Group.get('contactid').setValue('');
    this._commonService.GetTanNo(pCompanyId).subscribe({
      next: (res: any) => {
        this.tanNoList = res;
        if (this.tanNoList.length === 1) {
          this.Form15Group.get('tanno').setValue(this.tanNoList[0].ptannumber);
        } else {
          this.Form15Group.get('tanno').setValue('');
        }

      },
      error: (err) => {
        console.error("Error fetching TAN No:", err);
        this.tanNoList = [];
        this.Form15Group.get('tanno').setValue('');
      }
    });
    //this.resetForm1();
  }


  // EstimatedIncome_change(event: any) {
  //   debugger;

  //   let val = event.target.value;
  //   let existingAmount;
  //   // let updatedAmount

  //   let eligibilityAmount = this._commonService.removeCommasForEntredNumber(this.Form15Group.controls.eligibilityamount.value);
  //   this.valNumber = this._commonService.removeCommasForEntredNumber(val)

  //   if (this.isEdit) {
  //     existingAmount = this.existingAmount;
  //     this.updatedAmount = existingAmount + this.valNumber;

  //     if (this.updatedAmount <= eligibilityAmount) {
  //       let amount = Number(this.valNumber).toLocaleString('en-IN');
  //       this.Form15Group.patchValue(
  //         {
  //           income_paidamount: this._commonService.currencyformat(amount),
  //           estimated_income_declartion_amount: this._commonService.currencyformat(amount),
  //           aggregateamount: this._commonService.currencyformat(amount),
  //         },
  //         { emitEvent: false });



  //       // this.Form15Group.get('estimated_total_income_amount').valueChanges.subscribe(amount => {
  //       //   if (amount !== null && amount !== undefined) {
  //       //     this.Form15Group.patchValue(
  //       //       {
  //       //         income_paidamount: this._commonService.currencyformat(amount),
  //       //         estimated_income_declartion_amount: this._commonService.currencyformat(amount),
  //       //         aggregateamount: this._commonService.currencyformat(amount),
  //       //       },
  //       //       { emitEvent: false }
  //       //     );
  //       //   }
  //       // })
  //       //this.disablesavebutton = true;
  //     }
  //     else {
  //       this._commonService.showWarningMessage("Entered Amount not Exceed the Eligible Amount");
  //       // this.disablesavebutton = true;
  //     }

  //   }

  //   else {

  //     if (this.valNumber <= eligibilityAmount) {
  //       let amount = Number(this.valNumber).toLocaleString('en-IN');
  //       this.Form15Group.patchValue(
  //         {
  //           income_paidamount: amount,
  //           estimated_income_declartion_amount: amount,
  //           aggregateamount: amount
  //         },
  //         { emitEvent: false });



  //       this.Form15Group.get('estimated_total_income_amount').valueChanges.subscribe(amount => {
  //         if (amount !== null && amount !== undefined) {
  //           debugger;
  //           this.Form15Group.patchValue(
  //             {
  //               income_paidamount: amount,
  //               estimated_income_declartion_amount: amount,
  //               aggregateamount: amount
  //             },
  //             { emitEvent: false }
  //           );
  //         }
  //       });
  //       //   this.disablesavebutton = false;
  //     }
  //     else {
  //       this._commonService.showWarningMessage("Entered Amount not Exceed the Eligible Amount");
  //       //  this.disablesavebutton = true;
  //     }
  //   }
  // }

  EstimatedIncome_change(event: any) {

    const val = this._commonService.removeCommasForEntredNumber(event.target.value || 0);

    this.Form15Group.patchValue({
      income_paidamount: val,
      estimated_income_declartion_amount: val,
      aggregateamount: val
    }, { emitEvent: false });

  }


}





