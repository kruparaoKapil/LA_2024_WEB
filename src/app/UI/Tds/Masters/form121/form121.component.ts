import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,FormArray, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { distinctUntilChanged, tap, switchMap, catchError } from 'rxjs/operators';
import { CommonService } from 'src/app/Services/common.service';
import { Subject,of, concat } from 'rxjs';
//import { SubscriberConfigurationService } from '../../ChitConfiguration/subscriber-configuration.service';
import { VerificationService } from 'src/app/Services/Loans/Transactions/verification.service';
//import { VerificationService } from 'src/app/Services/BPO/verification.service';
import { DatePipe, formatCurrency } from '@angular/common';
//import { GeneralReceiptCancelService } from 'src/app/Services/Transactions/general-receipt-cancel.service';

@Component({
  selector: 'app-form121',
  templateUrl: './form121.component.html',
  styleUrls: ['./form121.component.css']
})
export class Form121Component implements OnInit {
 @Input() selectedContactId;
  form121Group: FormGroup;
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
  tanNoList: any[] = [];
  Form121uiddetails:any[]=[];
  disablesavebutton: boolean;
  savebutton: string;
  disableSubscriberName = false;
  form121ValidationErrors: any = {};
   introducedSearchevent = new Subject<string>();
  subIntroducedSearchevent = new Subject<string>();
  subIntroducedList: any;
  //identificationno:any;
  uanno:any[]=[];
  dropDownDataSearchLength: any = this._commonService.searchfilterlength;
   imageResponse: any;
   uploadedguid:any=''
   kycFileName:any;
  formEntryType: string;
 searchplaceholder: any = this._commonService.searchplaceholder;
  contactsList :any=[];
  valNumber:any
   transactiontype='CREATE'
   contactSearchevent = new Subject<string>();
  employeeSearchevent = new Subject<string>();
  contactType = 'Individual';
  showkyc: boolean;
   is194ASection: boolean = false;
  fiscalYear:any;
  Companyreportdetails: any;
  localschema:any;
  companynames: any[] = [];
  disablesaveform121button: boolean;
  contactid :any[] = [];
  relatedareanameslist: any;
  isEdit:Boolean=false;
  EditSection:Boolean=false;
existingAmount:any=0;
disableControls:any
updatedAmount:any;
allowedit:boolean=false;
privousyear:any;
roleid:any;
lastfinancialyrDate:any
Previousformdetails:boolean=false;
previoustwoyearsstatus:boolean=false
ShowItrdetails:boolean=false;
previousItrYears: any[] = [];
authorizedbylist:any=[] = [];
Contactid: any;
selectedvalues: any = []
  pCreatedby: number = 0;

  constructor(private _commonService: CommonService,
    private __fb: FormBuilder,private datepipe: DatePipe,
   // private _SubscriberConfigurationService: SubscriberConfigurationService.
    private _VerificationService: VerificationService
  // , private _generalreceiptcancelservice: GeneralReceiptCancelService
  ) {
    //this.dpConfig.dateInputFormat = this._commonService.datePickerPropertiesSetup("dateInputFormat");
    this.dpConfig.dateInputFormat = 'DD-MMM-YYYY';
    this.dpConfig.containerClass = this._commonService.datePickerPropertiesSetup("containerClass");
    this.dpConfig.showWeekNumbers = false;
    this.dpConfig.maxDate = new Date();

     //this.dpConfig1.dateInputFormat = this._commonService.datePickerPropertiesSetup("dateInputFormat");
     this.dpConfig1.dateInputFormat = 'DD-MMM-YYYY';
    this.dpConfig1.containerClass = this._commonService.datePickerPropertiesSetup("containerClass");
    this.dpConfig1.showWeekNumbers = false;
    this.dpConfig1.maxDate = new Date();
    }

  ngOnInit() {
    this.formGroup();

    // this.loadAssessmentYears();
    this.BlurEventAllControll(this.form121Group);
    this.contactSearch(); 
  
   this.applyTdsSectionRule();
   this.getcompanyNames();
   this.getFiscalYear();
   this.GetEmployeeSearch();
  // this.lastfinancialyrDate=this.getFinancialYearLastDate()
  // this.localschema = this._commonService.getschemaname();
 // const selectedYear = this.form121Group.get('assessmentYear')?.value;
 // if (selectedYear) {
 //   this.CalendarYear_change(selectedYear);
 // }
   this.roleid = sessionStorage.getItem('roleid');
   if (this.roleid == "2") {
    this.allowedit=true;
    this.form121Group.get('estimated_total_income_amount').disable();
   }else{
     this.form121Group.get('estimated_total_income_amount').disable();
   }

  
 // this.GetUanNo(); 
  this.form121Group.get('estimatedIncome').valueChanges.subscribe(val => {
  if (val !== null && val !== undefined) {
    this.form121Group.patchValue({
      incomePaid: val,
      declarationIncome: val
    }, { emitEvent: false });
  }
});  
  }
   private GetEmployeeSearch() {
    debugger;
    this.authorizedbylist = concat(
      of([]), // default items
      this.employeeSearchevent.pipe(
        distinctUntilChanged(),
        tap(),
        switchMap(term => this._VerificationService.GetAuthorizedforform121(term).pipe(
          catchError(() => of([])), // empty list on error
          tap()
        ))
      )
    );
  }

 subIntroducedGridRowSelect(selected) {
    debugger;
    try {
      if (selected) {
        this.form121Group.controls['autorizedcontactid'].setValue(selected.subintroducedid);
        this.form121Group.controls['subintroducedname'].setValue(selected.subintroducedname.toString());
      }
      else
      {
        this.form121Group.controls['autorizedcontactid'].setValue('');
        this.form121Group.controls['subintroducedname'].setValue('');
      }
    }
    catch (error) {
      this._commonService.exceptionHandlingMessages('Form121', 'subIntroducedGridRowSelect', error);
    }
  }

getFiscalYear() {
  debugger;
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const month1 = today.getMonth();
    const fyEndYear = month <= 2 ? year : year + 1;
   // this.lastfinancialyrDate= this._commonService.getFormatDateGlobal(new Date(fyEndYear, 2, 31)); 
    let lastfinancialyrDate = new Date(fyEndYear, 2, 31);
    this.lastfinancialyrDate = this.datepipe.transform(lastfinancialyrDate, 'dd-MMM-yyyy')
    this.fiscalYear= (month >= 4) ? `${year}-${year + 1}`: `${year - 1}-${year}`;
   
      // this.fiscalYear='2025-2026'
    //  this.form121Group.get('fiscalYear')?.setValue(this.fiscalYear);
    this.form121Group.controls.fiscalYear.setValue(this.fiscalYear)
    this.form121Group.controls.incomeNature.setValue('Interest Other than Interest on Securities')
      const [startYear, endYear] = this.fiscalYear.split('-').map(Number);
     this.assessmentYear = `${startYear + 1}-${endYear + 1}`;
     this.form121Group.controls.previousyear.setValue(this.fiscalYear)
      this.form121Group.controls.assessmentYear.setValue(this.assessmentYear)
       this.form121Group.controls.form15_filedcount.setValue('')
       this.form121Group.controls.nextyear.setValue(this.lastfinancialyrDate)
  }

    GetContactDetailsByContactID(contactid) {
  
      try {
      // this._commonService.GetContactDetailsByContactID(this._commonService.getschemaname(), contactid).subscribe(json => {
  
      //     try {
      //       if (json != null) {
  
           
      //       }
      //     }
      //     catch (error) {
      //       this._commonService.exceptionHandlingMessages('Subscriber Configuration', 'GetOtherBranches', error);
      //     }
      //   },
      //     (error) => {
  
      //       this._commonService.showErrorMessage(error);
      //     });
      }
      catch (error) {
        this._commonService.exceptionHandlingMessages('Subscriber Configuration', 'GetOtherBranches', error);
      }
    }


    validateRelatedareanameslist(){
      if(this.relatedareanameslist.length>0){
        return true;
      }
      else{
        this._commonService.showWarningMessage("Add atleast one related name to grid.");
        return false;
      }
    }

CalendarYear_change(event: any) {
  let assessmentYear = typeof event === 'string'
    ? event
    : event.pPeriodType;  

  if (!assessmentYear) {
    this.form121Group.patchValue({
      assessmentYear: null,
      previousyear: null
    }, { emitEvent: false });
    return;
  }

  // Correct: split assessmentYear (not previousyear!)
  const [startYear, endYear] = this.previousyear.split('-').map(Number);
   assessmentYear = `${startYear + 1}-${endYear + 1}`;

  this.form121Group.patchValue({
    assessmentYear: assessmentYear,
    // previousyear: previousYear
  }, { emitEvent: false });
}

PreviousYear_change(event: any) {
  const previousYear = typeof event === 'string'
    ? event
    : event.pPeriodType;  

  if (!previousYear) {
    debugger;
    this.form121Group.patchValue({
      assessmentYear: null,
      previousyear: null
    }, { emitEvent: false });
    return;
  }

  const [startYear, endYear] = previousYear.split('-').map(Number);
  const AssessmentYear = `${startYear + 1}-${endYear + 1}`;

  this.form121Group.patchValue({
    assessmentYear: AssessmentYear,
    previousyear: previousYear
  }, { emitEvent: false });
}



  formGroup(): void {
    this.form121ValidationErrors={};
    this.form121Group = this.__fb.group({
       itrDetails: this.__fb.array([]),
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
  estimated_income_declartion_amount: [],
  estimated_total_income_amount: ['', Validators.required],
  form15_filedcount: [''],
  aggregateamount: [null],
  declarationDate: ['', Validators.required],
  income_paidamount: [0],
  income_paiddate: ['', Validators.required],
  incometaxact: ['', Validators.required],
  investorreceiptno: ['', Validators.required],
  incomeNature: ['Interest Other than Interest on Securities'],
  assessmentYear: [''],
   companyName: [null, Validators.required],
  tanno: ['', Validators.required],
  //uid: [''],
  nextyear: ['', Validators.required],  
  previousyear: [''],
  file_name: [''],
  uploadedguid:[''],
  fiscalYear :[''],
  
  eligibilityamount:[''],
  edituid:[''],
  previousExistamount:[''],
  during_the_tax_year: ['no'],
  pitrfilestatus:['no'],
   autorizedcontactid: ['', Validators.required],
  subintroducedname:[''],
  ackNo:[''],
  ReturnIncome:[''],
//  contactname:['']

});
 }
 get itrDetails(): FormArray {
  return this.form121Group.get('itrDetails') as FormArray;
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
  uploadAndProgress(event: any, files) {
    debugger;
    var extention = event.target.value.substring(event.target.value.lastIndexOf('.') + 1);
    if (!this.validateFile(event.target.value)) {
      this._commonService.showWarningMessage("Upload jpg or png or pdf files");
    }
    else {
      let file = event.target.files[0];
      //this.imageResponse;
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
        fname = files[i].name;
 
       // this.addchalanaForm.controls.fileName.setValue(fname);
           formData.append(files[i].name, files[i]);
           formData.append('NewFileName', 'verifiedFile' + '.' + files[i]["name"].split('.').pop());
 
      }
      size = size / 1024
      this._commonService.fileUploadS3("verificationprocess",formData).subscribe(data => {
        debugger;
        if (extention.toLowerCase() == 'pdf') {
          this.uploadedguid=''
          this.uploadedguid=data[0]
          this.imageResponse.name = data[0];
          this.kycFileName = data[0];
        }
        else {
          this.uploadedguid=''
          this.uploadedguid=data[0]
          this.kycFileName = data[0];
          this.imageResponse.name = data[0];
        }
 
        this.form121Group.controls.file_name.setValue(this.imageResponse.name)

      },(error) => {
        this._commonService.showErrorMessage(error);
      });
    }
  }
pdf(guid) {
    if (guid !== null && guid !== "") {
      let type = guid.split(".")[1];
      if (type !== "pdf") {
        try{
        this._commonService.DownloadS3filesI("verificationprocess", guid).subscribe(base64Data => {
          if (base64Data["base64image"] !== "") {
            var a = document.createElement("a"); 
            a.href = "data:image/png;base64," + base64Data["base64image"]; 
            a.download = "Image.png";
            a.click();
          }
        },(error) => {
          this._commonService.showErrorMessage(error);
        });
      }
        catch (e) {
          this._commonService.showErrorMessage(e);
          return false;
        }
      } else {
        try{
        this._commonService.DownloadS3files("verificationprocess", guid).subscribe((data: Blob) => {
         
          let responseType = data.type;
          const url = window.URL.createObjectURL(data);
          window.open(url);
        },(error) => {
          this._commonService.showErrorMessage(error);
        });
      }
        catch (e) {
          this._commonService.showErrorMessage(e);
          return false;
        }
      }
    }
  }

SaveConfirmandSave(){
  debugger;
        if(!this.isEdit){
        this._commonService.CheckForm15hContactExist(this.form121Group.get('contactid').value,this.fiscalYear,this.form121Group.get('companyName').value ).subscribe(count => {
          console.log("count:",count);
          if (count == "0"){
           this.saveform15h();
         }else{
           this._commonService.showWarningMessage("This Contact Already Saved...") 
          }
          });
        }else{
          this.saveform15h();
        };
}

saveform15h() {
  debugger;
 //  let valnumber1;
//  let eligibilityAmount = this._commonService.removeCommasForEntredNumber(this.form121Group.controls.eligibilityamount.value);
//  let income_amount =this._commonService.removeCommasForEntredNumber(this.form121Group.controls.estimated_total_income_amount.value)+this.existingAmount
 // if(this.isEdit){
 //    valnumber1 =this.valNumber+this.existingAmount
 // }
  //  else{
  //      valnumber1 =this.valNumber
  //    }
 // let totalamount =this._commonService.removeCommasForEntredNumber(this.form121Group.controls.estimated_total_income_amount.value)+this.existingAmount
  // if(this.isEdit){
  //  let previousform15amount=this._commonService.removeCommasForEntredNumber(this.form121Group.controls.previousExistamount.value);
  //  if(previousform15amount=eligibilityAmount){
  //  this._commonService.showWarningMessage("form15 Amount Already Equals the Eligible Amount");
  //   this.disablesavebutton = false;
  // }
  // }
 
 // if(valnumber1<=eligibilityAmount || income_amount<=eligibilityAmount || this.updatedAmount<=eligibilityAmount ){
  try {
    this.savebutton = "Processing";
    this.disablesavebutton = true;
   let transactiontype="";

      let isValid = true;
     this.form121Group.markAllAsTouched();

     if (this.checkValidations(this.form121Group, isValid)) {
      const itrList = this.itrDetails.value;
     const formattedItrList = itrList.map((item: any) => ({
     taxYear: item.taxYear,
     ackNo: item.ackNo,
     returnIncome: this._commonService.removeCommasForEntredNumber(item.ReturnIncome)
     }));
    let urc = JSON.parse(sessionStorage.getItem("Urc") || '{}');
    let pCreatedby = urc.pUserID || 0;


    let declarationControl = this.form121Group.get('declarationDate');
    let incomePaidControl = this.form121Group.get('income_paiddate');
    let nextyearControl= this.form121Group.get('nextyear');
    let declarationDate = declarationControl && declarationControl.value ? this.datepipe.transform(declarationControl.value, 'yyyy-MM-dd') : null;
    let incomePaidDate = incomePaidControl && incomePaidControl.value ? this.datepipe.transform(incomePaidControl.value, 'yyyy-MM-dd') : null;
    let nextyeardate = nextyearControl.value ? this.datepipe.transform(nextyearControl.value, 'yyyy-MM-dd') : null;
    const FromBody = {
     //transactiondate: this._commonService.getFormatDate1(new Date()),
      //branchid: this.localschema,
      // pan: this.form121Group.get('subscriberpanno')?.value,
      panno: this.form121Group.get('pan').value,
      // identificationno: this.identificationno,
   //  identificationno:  this.form121Group.controls.identificationno.value,
      contactid: this.form121Group.get('contactid').value,
      incometaxact: this.form121Group.get('incometaxact').value,
      //pCreatedby: this._commonService.getcreatedby(),
     //pipaddress: this._commonService.getipaddress(),
    // declarationreceived_date: this._commonService.getFormatDate1(this.form121Group.get('declarationDate').value),
    declarationreceived_date:declarationDate,
      //income_paiddate: this._commonService.getFormatDate1(this.form121Group.get('income_paiddate').value),
      income_paiddate:incomePaidDate,
       incomedetails:  '',
      investorreceiptno: this.form121Group.get('investorreceiptno').value || null,
      natur_of_income: this.form121Group.get('incomeNature').value || null,
      //nextyear: this._commonService.getFormatDate1( this.form121Group.get('nextyear').value ),
      nextyear: nextyeardate,
      assessmentYear: this.form121Group.get('assessmentYear').value,
      previousyear: this.form121Group.get('previousyear').value,
      companyid: this.form121Group.get('companyName').value || '',
      tanno: this.form121Group.get('tanno').value,
      
     // uid: this.form121Group.get('uid')?.value,
      filename: this.form121Group.get('file_name').value || null,
      approvedby: null,
      approvedstatus: null,
      approveddate: null,
      estimated_income_declartion_amount: this._commonService.removeCommasForEntredNumber(
        this.form121Group.get('estimated_income_declartion_amount').value),
      estimated_total_income_amount: this._commonService.removeCommasForEntredNumber(
        this.form121Group.get('estimated_total_income_amount').value),
      income_paidamount: this._commonService.removeCommasForEntredNumber(
        this.form121Group.get('income_paidamount').value),
        eligibilityAmount: this._commonService.removeCommasForEntredNumber(
        this.form121Group.get('eligibilityamount').value),  
        fiscalYear: this.fiscalYear || null,
        transactiontype:this.transactiontype,
       // uid:this.form121Group.controls.edituid.value|| null,
        previoustaxstatus:this.Previousformdetails,
        previous_two_years_status:this.ShowItrdetails,
        form15_filedcount: this.form121Group.get('form15_filedcount').value,
        aggregateamount: this._commonService.removeCommasForEntredNumber(
        this.form121Group.get('aggregateamount') .value),
         formname:'FORM121',
         Previousitrdetails: formattedItrList,
         authorizedid:this.form121Group.get('autorizedcontactid').value,
         userid: pCreatedby,

        };
        
    if (confirm("Do you want to save Form 121?")) {
      debugger;
       // this._VerificationService.saveChitReceipt(data).subscribe(json =>
      this._commonService.SaveForm15H(FromBody).subscribe(json =>{
        
         let savedstatus = json[0];
         if ((savedstatus)){
          this._commonService.showInfoMessage("Saved Successfully");
          this.resetForm();
          this.savebutton = "Save";
          this.disablesavebutton = false;
           this.Previousformdetails=false
           this.ShowItrdetails=false
            // let panno = this.form121Group.get('pan')?.value;
            let outparameter = json[1];
            let localschema = this.localschema;
            let reportName = 'Form 15H';
            let reportType = 'Reprint';
            
             
           // let uid = this.form121Group.get('uid')?.value;
             let uid = outparameter;
            let encoded1 = btoa(`${uid},${reportName},${reportType}`);
            window.open('/#/Form121Reprint?id=' + encoded1 + '', "_blank");
            // let uid = outparameter;

            // this.selectedvalues += uid + '@' + reportName + '@' + reportType
            // let receipt = btoa(this.selectedvalues);
            //window.open('/#/Form121Reprint?id=' + receipt);
            this.resetForm();
            this.savebutton = "Save";
            this.disablesavebutton = false;
            this.isEdit = false;
         }
          error: (err) => {
            console.error("Error saving Form 121:", err);
            this._commonService.showErrorMessage("Error while saving Form 121");
            this.savebutton = "Save";
            this.disablesavebutton = false;
            this.isEdit = false;
          }
        });
    }
     else {
      this.savebutton = "Save";
      this.disablesavebutton = false;
    }
  
 
  }else{
    this._commonService.showWarningMessage("Please fill all required fields.")
  }
  } catch (error) {
    this._commonService.showWarningMessage(error);
    this.savebutton = "Save";
    this.disablesavebutton = false;
    
  }
//}
//else{
//this._commonService.showWarningMessage("Estimated total income not Exceed the Eligible Amount");
//}
}

// resetForm1(): void {
//     debugger
//     this.disableControls.forEach(ctrl => {
//             this.form121Group.get(ctrl).enable();
//           });
//     //this.form121Group.reset();
//     this.getcompanyNames();
//    //  this.applyTdsSectionRule();
//      this.isEdit = false;
//     // this.existcontact =false;
//      this.Form121uiddetails=[];
//     // this.getFiscalYear();
//      this.tanNoList = []; 
//   this.form121Group.controls.fiscalYear.setValue(this.fiscalYear);
//    this.form121Group.controls.contactid.reset();
//    //this.form121Group.controls.contactname.reset();
//   this.form121Group.controls.dob.reset();
//   this.form121Group.controls.mobile.reset();
//   this.form121Group.controls.email.reset();
//   this.form121Group.controls.aadhar.reset();
//   this.form121Group.controls.pan.reset();
//   this.form121Group.controls.flat.reset();
//   this.form121Group.controls.street.reset();
//   this.form121Group.controls.locality.reset();
//   this.form121Group.controls.districtname.reset();
//   this.form121Group.controls.statename.reset();
//   this.form121Group.controls.pincode.reset();
//   // this.form121Group.controls.incometaxact.reset();
//   this.form121Group.controls.estimated_total_income_amount.reset();
//   //this.form121Group.controls.form15_filedcount.reset();
//   // this.form121Group.controls.aggregateamount.reset();
//     this.form121Group.controls.aggregateamount.setValue('0');

//    this.form121Group.controls.declarationDate.reset();
//  // this.form121Group.get('declarationDate')?.setValue(new Date());

//   //this.form121Group.controls.income_paidamount.reset();
//   this.form121Group.controls.income_paidamount.setValue('0');

//   this.form121Group.controls.income_paiddate.reset();
//   this.form121Group.controls.estimated_income_declartion_amount.reset();
//   this.form121Group.controls.investorreceiptno.reset();
// //  this.form121Group.controls.incomeNature.reset();
//   this.form121Group.controls.companyName.reset();
//   this.form121Group.controls.tanno.reset();
//   this.form121Group.controls.eligibilityamount.reset();
 
//  // this.form121Group.controls.assessmentYear.reset();
// //  this.form121Group.controls.nextyear.reset();
// //  this.form121Group.controls.previousyear.reset();
//   //this.form121Group.controls.uid.reset();
//  this.form121Group.controls.uploadedguid.reset();
//  this.form121ValidationErrors={};
//  this.form121Group.get('edituid').setValue('');
//   this.transactiontype='CREATE';
//   this.form121Group.controls.during_the_tax_year.setValue('no');
//     this.form121Group.controls.pitrfilestatus.setValue('no');

//   this.Previousformdetails=false
//   this.ShowItrdetails=false

//   }

resetForm1(): void {
  debugger;

  // this.disableControls.forEach(ctrl => {
  //   this.form121Group.get(ctrl).enable();
  // });

  if (this.disableControls && this.disableControls.length > 0) {
  this.disableControls.forEach(ctrl => {
    if (this.form121Group.get(ctrl)) {
      this.form121Group.get(ctrl).enable();
    }
  });
}

  this.getcompanyNames();
  this.isEdit = false;
  this.Form121uiddetails = [];

  // Store values before reset
  const fiscalYear = this.form121Group.controls.fiscalYear.value;
  const previousyear = this.form121Group.controls.previousyear.value;
  const assessmentYear = this.form121Group.controls.assessmentYear.value;
  const nextyear = this.form121Group.controls.nextyear.value;

  this.tanNoList = [];

  // Keep existing functionality — only prevent these fields from clearing
  this.form121Group.controls.contactid.reset();
  this.form121Group.controls.dob.reset();
  this.form121Group.controls.mobile.reset();
  this.form121Group.controls.email.reset();
  this.form121Group.controls.aadhar.reset();
  this.form121Group.controls.pan.reset();
  this.form121Group.controls.flat.reset();
  this.form121Group.controls.street.reset();
  this.form121Group.controls.locality.reset();
  this.form121Group.controls.districtname.reset();
  this.form121Group.controls.statename.reset();
  this.form121Group.controls.pincode.reset();

  this.form121Group.controls.estimated_total_income_amount.reset();
  this.form121Group.controls.aggregateamount.setValue('0');

  this.form121Group.controls.declarationDate.reset();
  this.form121Group.controls.income_paidamount.setValue('0');

  this.form121Group.controls.income_paiddate.reset();
  this.form121Group.controls.estimated_income_declartion_amount.reset();
  this.form121Group.controls.investorreceiptno.reset();
  this.form121Group.controls.companyName.reset();
  this.form121Group.controls.tanno.reset();
  this.form121Group.controls.eligibilityamount.reset();

  this.form121Group.controls.uploadedguid.reset();

  // Restore values so they won't clear
  this.form121Group.controls.fiscalYear.setValue(fiscalYear);
  this.form121Group.controls.previousyear.setValue(previousyear);
  this.form121Group.controls.assessmentYear.setValue(assessmentYear);
  this.form121Group.controls.nextyear.setValue(nextyear);

  this.form121ValidationErrors = {};
  this.form121Group.get('edituid').setValue('');
  this.transactiontype = 'CREATE';

  this.form121Group.controls.during_the_tax_year.setValue('no');
  this.form121Group.controls.pitrfilestatus.setValue('no');

  this.Previousformdetails = false;
  this.ShowItrdetails = false;
}
resetForm(): void {
  debugger;
  //this.existcontact =false;
   this.Previousformdetails=false
     this.ShowItrdetails=false

  this.form121ValidationErrors = {};
  if(this.isEdit){
 this.disableControls.forEach(ctrl => {
           this.form121Group.get(ctrl).enable();
         });
        }
  this.form121Group.reset(
    {
      declarationDate: '',
        nextyear: this.lastfinancialyrDate,
      previousyear: this.fiscalYear,
      fiscalYear:this.fiscalYear,
      assessmentYear:this.assessmentYear,
      incomeNature: 'Interest Other than Interest on Securities',
      form15_filedcount:'',
      during_the_tax_year:'no',
      pitrfilestatus:'no'
     

     
    },
    
    { emitEvent: false }
   );
  Object.keys(this.form121Group.controls).forEach(key => {
    const control = this.form121Group.get(key);
    if (control) {
      control.setErrors(null);  // remove errors
      control.markAsPristine();
      control.markAsUntouched();
    }
  });

  this.form121Group.markAsPristine();
  this.form121Group.markAsUntouched();
 
    this.applyTdsSectionRule();
    this.getcompanyNames();
    this.transactiontype='CREATE';
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
      let formcontrol = this.form121Group.get(key);

      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          this.checkValidations(formcontrol, isValid);
        } else if (formcontrol.validator) {
          this.form121ValidationErrors[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            const element = document.getElementById(key) as HTMLInputElement;
            const lablename = element ? element.title : key;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.form121ValidationErrors[key] += errormessage + ' ';
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
      const formcontrol = this.form121Group.get(key);
      if (formcontrol && !(formcontrol instanceof FormGroup)) {
        if (formcontrol.validator) {
          this.form121Group.get(key).valueChanges.subscribe(() => {
            this.GetValidationByControl(key, true);
          });
        }
      }
    } catch (e) {
       this._commonService.showErrorMessage(e);
    }
  }


  
 contactSearch() {
    debugger;
    this._commonService.GetContactData(this.contactType).subscribe(res => {
      this.contactsList = res;
      console.log("Contact list", res);
    });
    // this.contactsList = concat(
    //   of([]), 
    //   this.contactSearchevent.pipe(
    //     distinctUntilChanged(),
    //     tap(),
    //     switchMap(term => this._VerificationService.GetSubscriberContactDetails(term, 'SUBSCRIBER', this._commonService.getschemaname()).pipe(
    //       catchError(() => of([])), 
    //       tap()
    //     ))
    //   )
    // );
  }


ContactGridRowSelect(selected: any) {
  debugger;
     // this.clearContactFields();
    if (selected && selected.pContactId) {

      this.Contactid = selected.pContactId;
      let fy = this.fiscalYear.split('-');
      let fromDate = fy[0] + '-04-01';
      let toDate = fy[1] + '-03-31';
      this.form121Group.controls.eligibilityamount.setValue('300000')
      this.form121Group.controls.form15_filedcount.setValue('1')
      this.form121Group.controls.incomeNature.setValue('INTEREST')
      this.form121Group.controls.incometaxact.setValue('1022')
            this._commonService.GetContactDetailsById(this.Contactid, fromDate, toDate).subscribe(data => {
        if (data && data.length > 0) {
          let details = data[0];
          this.form121Group.patchValue({
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
          this.form121Group.patchValue({
            estimated_total_income_amount: interestAmount,
            aggregateamount: interestAmount,
            income_paidamount: interestAmount,
            estimated_income_declartion_amount: interestAmount,
            investorreceiptno: details.fd_receipts || ''
          });

        }
      });
    }
  // if (selected && selected.contactid) { 
  //  // this.localschema = this._commonService.getschemaname();
  //   let finyear = this.fiscalYear;
  //   let companyid = this.form121Group.controls.companyName.value;
  //   debugger;
    // this._commonService.CheckForm15hContactExist(selected.contactid,finyear,companyid).subscribe(count => {
    //   if (count == "0") {
    //    this._commonService.CheckPanValidForForm15h(selected.contactid).subscribe(checkstatus => {
    //    if(checkstatus !="0"){
        //  this.GetContactDetails(selected.contactid,finyear,companyid)
    //    }
    //    else{
    //       this._commonService.showWarningMessage("This Contact Doesn't Have Valid Pan.");
    //       this.resetForm1();
    //     }
    //    });
    //   }
    //   else {
    //     this._commonService.showWarningMessage("This Contact Already Existed in Form15H.");
    //     this.resetForm1();
    //   }
    // });
     
  //  } 
  //  else {
  //   // No contact selected → reset form fully
  //   this.resetForm1();
  // }
}

// GetContactDetails(contactid: any,finyear: any,companyid:any) {
//   let totalamount
//     this._commonService.GetForm15HContactDetails(contactid,finyear,companyid)
//       .subscribe(data => {
//         if (data && data.length > 0) {
//           const details = data[0];

//           // Reset form with defaults
//           this.form121Group.reset({
//             declarationDate: '',
//             income_paiddate:'',
//             nextyear: this.form121Group.get('nextyear').value || null,
//             previousyear:this.form121Group.get('previousyear').value || null,
//             estimated_total_income_amount: null,
//             form15_filedcount: this.form121Group.get('form15_filedcount').value || null,
//             aggregateamount: 0,
//             income_paidamount: 0,
//             estimated_income_declartion_amount: null,
//             investorreceiptno: null,
//             incomeNature:this.form121Group.get('incomeNature').value || null,
           
//             assessmentYear: this.form121Group.get('assessmentYear').value || null,
//             eligibilityamount:null,
//             companyid: this.form121Group.get('companyid').value || null,
//            companyName: this.form121Group.get('companyName').value || '',
//            tanno: this.form121Group.get('tanno').value || '',
//            fiscalYear: this.fiscalYear || '',
//             during_the_tax_year:'no',
//             pitrfilestatus:'no'
           
//           }, { emitEvent: false });

//             if(data[0].interestamount>=data[0].form15h_max_amount){
//               totalamount =data[0].form15h_max_amount;
//             }
//             else{
//                totalamount =data[0].interestamount;
//             }
//             //  this.contactsList = [{
//             //    contactid: data[0].contactid,
//             //     contactname: data[0].contactname
//             //    }];
//           // Patch values from API
//           this.form121Group.patchValue({
           
//             // identificationno: data[0].contactreferenceid,
                    
//               contactid: data[0].contactid,  
//               contactname: data[0].contactname,            
//               dob: this._commonService.getFormatDate(data[0].dateofbirth),                 
//               districtname: data[0].districtname,            
//               pincode: data[0].pincode,                   
//               mobile: data[0].contactmobilenumber,  
//               statename: data[0].statename, 
//               email: data[0].contactemailid,              
//               aadhar: data[0].documentreferenceno ,
//               locality: data[0].areaname,
//               flat: data[0].contactaddress,
//             //  incometaxact: data[0].incometaxact,
//               //  street: data[0].street,
//               pan: data[0].subscriberpanno, 
              
//               estimated_total_income_amount:this._commonService.currencyformat(totalamount),
//               eligibilityamount:this._commonService.currencyformat(data[0].form15h_max_amount),
//               investorreceiptno:data[0].receiptnos,
//             //  aggregateamount:this._commonService.currencyformat(totalamount),
//              // income_paidamount:this._commonService.currencyformat(totalamount),
//               estimated_income_declartion_amount:this._commonService.currencyformat(totalamount),
//           }, { emitEvent: false });

//           // Apply your business rule
//           this.applyTdsSectionRule();
//      //   this.GetUanNo();
//           // Clear touched/dirty state
//           this.form121Group.markAsPristine();
//           this.form121Group.markAsUntouched();
//         }
//         else{
//           this._commonService.showWarningMessage("Effected Date Not Entered In Chit Advance");
//            this.resetForm1();
//           // this.transactiontype='CREATE';

//         }
//        // this.fiscalYear();
//       });
//   }

// CompanyNamechange(companyId: number) {
  
//   console.log('Selected CompanyId:', companyId);
//     this._VerificationService.GetCompanydetails(companyId, '').subscribe({
//     next: (res: any) => {
//       if (res && res.length) {
//          const company = res[0];
//         this.form121Group.controls['companyId'].setValue(company.pCompanyId);  
       
//       }
//       else {
//         this.form121Group.controls['companyId'].setValue(''); 
//         this.form121Group.controls['tanno'].setValue(''); 
//       }
//     },
//     error: (err) => {
//       console.error('Error fetching company details:', err);
//     }
//   });
// }

onTanChange(tanno: string) {
 // this.fetchAndPatchUan(); 
}

// fetchAndPatchUan(): void {
//   const schema = this._commonService.getschemaname();
//   const companyId = this.form121Group.get('companyName')?.value;
//   const tanno = this.form121Group.get('tanno')?.value;

//   if (!schema || !companyId || !tanno) {
//     return; 
//   }

//   this._commonService.getUidNumber(schema, companyId, tanno)
//     .subscribe({
//       next: (res) => {
//         if (res && res.uid) {
//           this.form121Group.patchValue({ uid: res.uid });
//           console.log('UAN patched:', res.uid);
//         }
//       },
//       error: (err) => {
//         console.error('Error fetching UAN:', err);
//       }
//     });
// }
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

applyTdsSectionRule() {
  const control = this.form121Group.get('incometaxact');
  if (!control) return;

  this._commonService.GetTdsSectionNo().subscribe(
    (res: any[]) => {
      if (res && Array.isArray(res)) {
        
        const section194A = res.find(
          (x: any) => x.pTdsSection.toString().trim() === '1022'
        );

        if (section194A) {
         
          control.setValue('1022', { emitEvent: true });
          this.is194ASection = true;
          control.disable({ emitEvent: false });
        } else {
         
          control.setValue('', { emitEvent: false });
          this.is194ASection = false;
          control.enable({ emitEvent: false });
        }

       
        control.valueChanges.subscribe(value => {
          if (value.toString().trim() === '1022') {
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
  const invalid = [];
  const controls = this.form121Group.controls;
  for (const name in controls) {
    if (controls[name].invalid) {
      invalid.push(name);
    }
  }
  return invalid;
}

onCompanyChange(pCompanyId: string) {
  debugger;
   this.form121Group.get('contactid').setValue('');
  this._commonService.GetTanNo(pCompanyId).subscribe({
    next: (res: any) => {
      this.tanNoList = res;
      //if (this.tanNoList.length === 1) {
      //   this.form121Group.get('tanno')?.setValue(this.tanNoList[0].ptan_no);
      //} else {
        this.form121Group.get('tanno').setValue('');
     // }
    
    },
    error: (err) => {
      console.error("Error fetching TAN No:", err);
      this.tanNoList = [];
      this.form121Group.get('tanno').setValue('');
    }
  });
  //this.resetForm1();
}

// EstimatedIncome_change(event: any) {
//   debugger;

//   const val = event.target.value;
//     let existingAmount;
//     // let updatedAmount 

//       let eligibilityAmount = this._commonService.removeCommasForEntredNumber(this.form121Group.controls.eligibilityamount.value);
//      this.valNumber = this._commonService.removeCommasForEntredNumber(val)

//    if(this.isEdit){
//     existingAmount = this.existingAmount;
//      this.updatedAmount = existingAmount+this.valNumber;

//    if(this.updatedAmount<=eligibilityAmount){
//    let amount = Number(this.valNumber).toLocaleString('en-IN');
//   this.form121Group.patchValue(
//     {
//     //  income_paidamount: this._commonService.currencyformat(amount),
//       estimated_income_declartion_amount: this._commonService.currencyformat(amount),
//     //  aggregateamount:this._commonService.currencyformat(amount),
//     },
//     { emitEvent: false } );
 
  

// this.form121Group.get('estimated_total_income_amount').valueChanges.subscribe(amount => {
//   if (amount !== null && amount !== undefined) {
//     this.form121Group.patchValue(
//       {
//        // income_paidamount: this._commonService.currencyformat(amount),
//         estimated_income_declartion_amount: this._commonService.currencyformat(amount),
//        // aggregateamount:this._commonService.currencyformat(amount),
//       },
//       { emitEvent: false }
//       );
//     }
//    });
//    //this.disablesavebutton = true;
//    }
//  else{
//     this._commonService.showWarningMessage("Entered Amount not Exceed the Eligible Amount");
//    // this.disablesavebutton = true;
//     }
 
//     }

//   else{

//          if(this.valNumber<=eligibilityAmount ){
//          let amount = Number(this.valNumber).toLocaleString('en-IN');
//           this.form121Group.patchValue(
//        {
//         //income_paidamount: amount,
//         estimated_income_declartion_amount: amount,
//       //  aggregateamount:amount
//        },
//        { emitEvent: false } );
 
  

//       this.form121Group.get('estimated_total_income_amount').valueChanges.subscribe(amount => {
//       if (amount !== null && amount !== undefined) {
//       debugger;
//       this.form121Group.patchValue(
//       {
//        // income_paidamount: amount,
//         estimated_income_declartion_amount: amount,
//        // aggregateamount:amount
//       },
//       { emitEvent: false }
//         );
//      }
//       });
//    //   this.disablesavebutton = false;
//      }
//       else{
//          this._commonService.showWarningMessage("Entered Amount not Exceed the Eligible Amount");
//        //  this.disablesavebutton = true;
//       }
// }
// }

  EstimatedIncome_change(event: any) {
  debugger;
    const val = this._commonService.removeCommasForEntredNumber(event.target.value || 0);

    this.form121Group.patchValue({
      income_paidamount: val,
      estimated_income_declartion_amount: val,
      aggregateamount: val
    }, { emitEvent: false });

  }

GetEdit(event: Event) {
  // this.isEdit = !this.isEdit;
 // this.isEdit = true;
   this.resetForm();
  if(this.isEdit = !this.isEdit){
  debugger
  this._VerificationService.GetUidForEdit().subscribe({
    next: (res: any) => {
    this.Form121uiddetails = res; 
    
    },
    error: (err) => {
      console.error("Error Fetching Uid:", err);
      this.Form121uiddetails = [];
      this.form121Group.get('edituid').setValue('');
     // this.isEdit = false;
    }
  });
}
else{
 // this.isEdit = false;
  this.Form121uiddetails=[];
  this.form121Group.get('edituid').setValue('');
  this.form121Group.get('previousExistamount').setValue('');
  this.resetForm1();
  this.transactiontype='CREATE';
  

}
}

// OnUidChangeforEdit(uid: string){
//   debugger;
//   let totalamountforedit
//   this._commonService.GetForm15HDetailsforEdit(uid)
//       .subscribe(data => {
//         if (data && data.length > 0) {
//           const details = data[0];
         
//           if(data[0].estimated_total_income_amount>=data[0].eligibilityAmount){
//               totalamountforedit =data[0].eligibilityAmount;
//             }
//             else{
//                totalamountforedit =data[0].estimated_total_income_amount;
//             }
//             this.companynames = [{
//                pCompanyId: data[0].companyid,
//                 pCompanyName: data[0].companyname
//                }];

//               //    this.contactsList = [{
//               //  contactid: data[0].contactid,
//               //   contactname: data[0].contactname
//               //  }];
//      //   this.contactsListArray.unshift(data[0]);
//       //     this.contactsList = of(this.contactsListArray);
//             this.existingAmount=this._commonService.removeCommasForEntredNumber(this._commonService.currencyformat(data[0].estimated_income_declartion_amount));
//           this.form121Group.patchValue({
//               contactid: data[0].contactid,  
//               contactname: data[0].contactid,            
//               dob: this._commonService.getFormatDate(data[0].dateofbirth),                 
//               districtname: data[0].districtname,            
//               pincode: data[0].pincode,                   
//               mobile: data[0].contactmobilenumber,  
//               statename: data[0].statename, 
//               email: data[0].contactemailid,              
//               aadhar: data[0].documentreferenceno,
//               locality: data[0].areaname,
//               flat: data[0].contactaddress,
//               pan: data[0].subscriberpanno, 
//               estimated_total_income_amount:this._commonService.currencyformat(totalamountforedit),
//               eligibilityamount:this._commonService.currencyformat(data[0].eligibilityAmount),
//               investorreceiptno:data[0].investorreceiptno,
//             //  aggregateamount:this._commonService.currencyformat(totalamountforedit),
//             //  income_paidamount:this._commonService.currencyformat(totalamountforedit),
//               estimated_income_declartion_amount:this._commonService.currencyformat(totalamountforedit),
//               declarationDate:  this._commonService.getFormatDate(data[0].declarationreceived_date), 
//               income_paiddate:  this._commonService.getFormatDate(data[0].income_paiddate),
//               nextyear: this._commonService.getFormatDate(data[0].nextyear),
//               previousyear: data[0].previousyear,
//               form15_filedcount:data[0].form15_filedcount,
//               incomeNature: data[0].natur_of_income,
//               assessmentYear:data[0].assessmentyear,
//               companyid: data[0].companyid,
//               companyName:data[0].companyid,
//               tanno: data[0].tanno,
//               previousExistamount:this._commonService.currencyformat(data[0].estimated_income_declartion_amount),
//           }, { emitEvent: false });
//               // this.form121Group.get('companyName')?.setValue(data[0].companyname);
              
//           this.disableControls = [
//             'contactid','companyid', 'companyName', 'tanno',
//             'estimated_income_declartion_amount','declarationDate','nextyear',
//             'previousyear','incomeNature','assessmentYear','income_paiddate'
//           ];  
           

//           this.disableControls.forEach(ctrl => {
//             this.form121Group.get(ctrl).disable();
//           });

//           this.form121Group.markAsPristine();
//           this.form121Group.markAsUntouched();
//         }
//        // this.fiscalYear();
//       });
     
//       this.transactiontype='UPDATE'
//      // uid=this.form121Group.controls.edituid.value;

// }
onDuringChange(event: any) {
  const value = event.target.value;
  console.log('Changed to:', value);
  this.form121Group.controls.form15_filedcount.setValue('');
 // this.form121Group.controls.aggregateamount.setValue('0');
   const val = this.form121Group.get('estimated_total_income_amount').value || 0;

  if (value === 'yes') {
   this.Previousformdetails =true;
     this.form121Group.patchValue({
    aggregateamount: val
  });
  } else {
      this.Previousformdetails =false;

  }
}

onpitrfilestatusChange(event: any) {
  debugger;
  let index =0
  const itrvalue = event.target.value;
  console.log('Changed to:', itrvalue);
  if (itrvalue === 'yes') {
  this.ShowItrdetails = true;

  const [start, end] = this.fiscalYear.split('-').map(Number);

  const years = [
    `${start - 2}-${end - 2}`,
    `${start - 1}-${end - 1}`
  ];

  this.itrDetails.clear();

  years.forEach((year, index) => {
    this.itrDetails.push(
      this.__fb.group({
        sno: [index + 1],
        taxYear: [year],
        ackNo: ['', Validators.required],
        ReturnIncome: ['', Validators.required]
      })
    );
     
  });
    this.itrDetails.controls.forEach((group: any) => {
      Object.keys(group.controls).forEach(key => {
        const control = group.get(key);
        control.markAsTouched();
        control.updateValueAndValidity();
      });
    });
    this.form121Group.updateValueAndValidity();
}else {
      this.ShowItrdetails =false;
      this.itrDetails.clear();
  }
 
}

}
