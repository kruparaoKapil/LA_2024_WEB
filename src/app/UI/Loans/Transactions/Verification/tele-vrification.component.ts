import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { VerificationService } from 'src/app/Services/Loans/Transactions/verification.service';
import { CommonService } from '../../../../Services/common.service';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
declare let $: any
@Component({
  selector: 'app-tele-vrification',
  templateUrl: './tele-vrification.component.html',
  styles: []
})
export class TeleVrificationComponent implements OnInit {

  public pDobConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  TeleVerification: FormGroup
  ApplicantName: any;
  LoanType: any;
  LoanName: any;
  MobileNo: any;
  ApplicationID: any
  showContact: boolean;
  showResponce: boolean;
  Other: boolean;
  Employees: any;
  Verificationdata: Response;
  Investigationexecutivename: any;
  InvestigationexecutivenameId: any;
  button = 'Submit';
  isLoading = false;
    submitted = false;
    disabletransactiondate = false;
  constructor(private datePipe: DatePipe, private _VerificationService: VerificationService, private _commonService: CommonService, private router: Router, private activatedroute: ActivatedRoute) {
    this.pDobConfig.containerClass = 'theme-dark-blue';
    this.pDobConfig.showWeekNumbers = false;
    this.pDobConfig.dateInputFormat = 'DD/MM/YYYY'
  }
  ngOnInit() {
      
      if (this._commonService.comapnydetails != null)
          this.disabletransactiondate = this._commonService.comapnydetails.pdatepickerenablestatus;

    this.pageLoad();

  }
  pageLoad() {

    

    this.TeleVerification = new FormGroup({

      papplicationid: new FormControl(),
      pvchapplicationid: new FormControl(),
      pcontactid: new FormControl(),
      pcontactreferenceid: new FormControl(),
      precordid: new FormControl(),
      pverificationdate: new FormControl(),
      pverificationtime: new FormControl(),
      pinvestigationexecutiveid: new FormControl(),
      pinvestigationexecutivename: new FormControl('', Validators.required),
      pteleverifierscomments: new FormControl('', Validators.required),
      pteleverifiersrating: new FormControl('Positive'),
      pCreatedby: new FormControl(),
      pModifiedby: new FormControl(),
      pStatusid: new FormControl(),
      pStatusname: new FormControl(),
      pEffectfromdate: new FormControl(),
      pEffecttodate: new FormControl(),
      ptypeofoperation: new FormControl(),
      spoketoDTO: new FormGroup({
        pspoketo: new FormControl('Applicant'),
        spoketoOtherDTO: new FormGroup({
          pnameoftheperson: new FormControl(''),
          prelationshipwithapplicant: new FormControl()
        })
      }),
      customerAvailabilityDTO: new FormGroup({
        pcustomeravailability: new FormControl(true),
        pcontacttype: new FormControl('MobileNo')
      })
    });
    let date = new Date()
    this.TeleVerification.controls.pverificationdate.setValue(this.datePipe.transform(date, 'dd/MM/yyyy'));
    this.TeleVerification.controls.pverificationtime.setValue(this.datePipe.transform(new Date(), 'hh:mm'))
    this.showContact = true;
    this.showResponce = false;
    this.Other = false;
    
    this._VerificationService.GetEmployees().subscribe(res => {
      this.Employees = res;
    });
    //  const routeParams = this.activatedroute.snapshot.params['id'];
    const routeParams = atob(this.activatedroute.snapshot.params['id']);
    if (routeParams !== undefined && routeParams != "") {
      this._VerificationService.GetVerificationdetails(routeParams).subscribe(res => {
        debugger;
        this.Verificationdata = res;
        this.ApplicantName = this.Verificationdata["pApplicantName"]
        this.LoanType = this.Verificationdata["pLoantype"]
        this.LoanName = this.Verificationdata["pLoanName"]
        this.MobileNo = this.Verificationdata["pconctano"]
        this.ApplicationID = this.Verificationdata['pvchapplicationid']
        this.pDobConfig.minDate = this._commonService.formatDateFromDDMMYYYY(res["pDateofApplication"]);
        this.pDobConfig.maxDate = this._commonService.formatDateFromDDMMYYYY(res["pDateofDisbursement"]);
        
      });
    }


  }

  AvailabilityofthecustomerCheck(Status) {
    

    if (Status == "Yes") {
      this.showContact = true;
      this.showResponce = false;
      this.TeleVerification.controls.spoketoDTO.get("pspoketo").setValue('Applicant');
      this.Nameofthepersonspokento("Applicant");
      this.TeleVerification.controls.customerAvailabilityDTO.get("pcontacttype").setValue('MobileNo');
      this.TeleVerification.controls.customerAvailabilityDTO.get("pcontacttype").setValidators(null);
      this.TeleVerification.controls.customerAvailabilityDTO.get("pcontacttype").updateValueAndValidity();
    }
    if (Status == "No") {

      this.TeleVerification.controls.spoketoDTO.get("pspoketo").setValue('Other');
      this.Nameofthepersonspokento("Other");
      this.showContact = false;
      this.showResponce = true;
      this.TeleVerification.controls.customerAvailabilityDTO.get("pcontacttype").setValue('');
      this.TeleVerification.controls.customerAvailabilityDTO.get("pcontacttype").setValidators(Validators.required);
      this.TeleVerification.controls.customerAvailabilityDTO.get("pcontacttype").updateValueAndValidity();
    }
  }
  Nameofthepersonspokento(person) {
    
    if (person == "Applicant") {
      this.Other = false;
    }
    if (person == "Other") {
      this.Other = true;
    }
  }
  EmployeeSelect($event) {
    
    this.Investigationexecutivename = $event.target.options[$event.target.options.selectedIndex].text;
    this.InvestigationexecutivenameId = $event.target.options[$event.target.options.selectedIndex].value;

  }
  SaveTeliverification() {
    
    this.submitted = true;
    if (this.TeleVerification.valid) {
      let VjsonData = JSON.stringify(this.Verificationdata);
debugger;
      

       let date = this.TeleVerification.value["pverificationdate"];
      if((date.toString()).indexOf("/")!== -1){
        let d = this.TeleVerification.value["pverificationdate"].split('/')
        this.TeleVerification.value["pverificationdate"] = (d[2] + '-' + d[1] + '-' + d[0]);
      }
      else {
        this.TeleVerification.value["pverificationdate"] = this.datePipe.transform(this.TeleVerification.value["pverificationdate"], 'yyyy-MM-dd');
        this.TeleVerification.value["pverificationtime"] = this.datePipe.transform(this.TeleVerification.value["pverificationdate"], 'hh:mm');

      }
      // this.TeleVerification.value["pverificationdate"] = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      // this.TeleVerification.value["pverificationtime"] = this.datePipe.transform(new Date(), 'hh:mm');

      this.TeleVerification.value["pApplicantName"] = this.Verificationdata["pApplicantName"]
      this.TeleVerification.value["papplicationid"] = this.Verificationdata["papplicationid"]
      this.TeleVerification.value["pconctano"] = this.Verificationdata["pconctano"]
      this.TeleVerification.value["pcontactid"] = this.Verificationdata["pcontactid"]
      this.TeleVerification.value["pcontactreferenceid"] = this.Verificationdata["pcontactreferenceid"]
      this.TeleVerification.value["pCreatedby"] = this._commonService.pCreatedby;;
      this.TeleVerification.value["pModifiedby"] = this._commonService.pCreatedby;;
      this.TeleVerification.value["pLoanName"] = this.Verificationdata["pLoanName"]
      this.TeleVerification.value["pLoantype"] = this.Verificationdata["pLoantype"]
      this.TeleVerification.value["precordid"] = 0;
      this.TeleVerification.value["pvchapplicationid"] = this.Verificationdata["pvchapplicationid"]
      this.TeleVerification.value["pinvestigationexecutivename"] = this.Investigationexecutivename
      this.TeleVerification.value["pinvestigationexecutiveid"] = parseInt(this.InvestigationexecutivenameId);

      let teledata = this.TeleVerification.value;

      let jsonData = JSON.stringify(teledata);
      this.isLoading = true;
      this.button = 'Processing';
      this._VerificationService.SaveTeleVerification(teledata).subscribe(res => {
        this.isLoading = false;
        this.router.navigate(['/VerificationView']);
      });
    }
  }
  ClearTeleverification() {

    this.TeleVerification.reset();
    this.TeleVerification.patchValue({
      pteleverifiersrating: "Positive",
      "pinvestigationexecutivename": '',
      customerAvailabilityDTO: { "pcustomeravailability": true, pcontacttype: "MobileNo" },
      spoketoDTO: { "pspoketo": 'Applicant' }
    });
    this.AvailabilityofthecustomerCheck("Yes");
    this.Nameofthepersonspokento("Applicant");
    this.submitted = false;
    this.TeleVerification.clearValidators();
    this.TeleVerification.controls.pverificationdate.setValue(this.datePipe.transform(new Date(), 'dd/MM/yyyy'));
    this.TeleVerification.controls.pverificationtime.setValue(this.datePipe.transform(new Date(), 'hh:mm'))
  }
}
