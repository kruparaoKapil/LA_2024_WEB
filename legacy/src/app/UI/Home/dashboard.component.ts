import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { BsDatepickerConfig } from 'ngx-bootstrap';
declare const $: any;
import { State, process, GroupDescriptor, SortDescriptor } from '@progress/kendo-data-query';
import { UsersService } from 'src/app/Services/Settings/Users/Users.service';
import { Router } from '@angular/router';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { CommonService } from 'src/app/Services/common.service';
import { ProfessionaltaxService } from 'src/app/Services/HRMS/Reports/professionaltax.service';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
})
export class DashboardComponent implements OnInit {
  public dpFromConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpToConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dppConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpChequeFromConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpChequeToConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();

  /* previous month */
  public dpFromConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpToConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpChequeFromConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpChequeToConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();

  /* LAST MONTH */
  public dpFromConfig2: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpToConfig2: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpChequeFromConfig2: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpChequeToConfig2: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  /*  */

 controlsLsit = [
        'drfromdate',
        'drtodate',
        'pFromMonthOf',
        'pToMonthOf',
        'pChequFromMonthOf',
        'pchequeToMonthOf',
        'vFromMonthOf',
        'vToMonthOf',
        'vChequFromMonthOf',
        'vchequeToMonthOf',
        'LFromMonthOf',
        'LToMonthOf',
        'LChequFromMonthOf',
        'LchequeToMonthOf'
    ];
  dashboardForm: FormGroup;
  public today: Date = new Date();
  gridData: any = [];
  frommonthof: any;
  tomonthof: any;
  frommonthof1: any;
  tomonthof1: any;
  public betweenorason = "Between";
 dateType = 'ASON';
  validation = false;
  fromdate: any;
  todate: any;
  // data = [

  // ];
  // data1 = [

  // ];
  selectedCustomers: string[] = [];
  selectedCommission: string[] = [];
  isModalVisible = false;
  isModalVisible1 = false;
  showcollectionandscope = false;
  ShowReportErrorMsg = false;
  showtrenddisbursement = false;
  certificatesData: any = [];
  certificatesFlag: boolean = false;
  detailedByBranchList: any = [];
  detailedBranchFlag: boolean = false;
  depositCount: any;
  agentCommissionCount: any;
  depositAmount: any;
  agentSummaryData: any;
  totalCommissionAmount: any;
  agentSummaryFlag: boolean = false;
  agentSummaryDetList: any = [];

  interestdetailsData: any = [];
  StatutoryData: any = [];
  detailedTransListAgent: any = [];
  detailedAgentFlag: boolean = false;
  bankData: any = [];
  bankAmount: any;
  banksCount: any;
  bankDataDetailed: any = [];
  bankDataDetailedFlag: boolean = false;
  interestData: any = [];
  interestDataFlag: boolean = false;
  interestAmount: any;
  interestPayable: any;
  tdsAmount: any;
  showdate = true;
  selecteddate = true;
  betweendates: any;
  FromDate: any;
  inbetween: any;
  betweenfrom: any;
  betweento: any;
  hidegridcolumn = true;
  date: any;
  maturityDetailsList: any = [];
  fromDates: any;
  toDates: any;
  netbusinessFlag: boolean = false;
  netDateFlag: boolean = false;
  interestdetailsFlag:boolean=false
  StatutoryFlag:boolean=false
  totalNo: any;
  totalValue: any;
  totalNoList: any = [];
  totalNoListOld: any = [];
  agentId: string = '';
  totalValueOld: any;
  // {schemeName:'Sale Advance HRB',certNo:'KINLJ33/23',TotalCertificates:'24',Branch:'Hyderabad',total:500000,lastmonth:10000,currentmonth:200000},{schemeName:'Sale Advance',certNo:'PVSPI17/23',TotalCertificates:'51',Branch:'Amalapuram',total:500000,lastmonth:10000,currentmonth:200000}
  userDetails: any;
  userNameF: any;
  userIdF: any;
  public groups: GroupDescriptor[] = [{ field: 'ppremschemeName' }];
  public groups1: GroupDescriptor[] = [{ field: 'pschemeName' }];
  public groups2: GroupDescriptor[] = [{ field: 'pmschemeName' }];

  /* bhargavi */
  maturityFlag: boolean = false;
  pre_maturityFlag: boolean = false;
  MaturityCount: any;
  MaturityAmount: any;
  PreMaturityCount: any;
  PreMaturityAmount: any;
  /*  */
  Rfrommonthof: any;
  Rtomonthof: any;
  Rfromdate: any;
  Rtodate: any;
  /* previous  */
  Rfrommonthof1: any;
  Rtomonthof1: any;
  Rfromdate1: any;
  Rtodate1: any;
  Vvalidation = false;
  requiredDate1: any;
  ctodatechange1: any;
  /* LAST MONTH */
  Rfrommonthof2: any;
  Rtomonthof2: any;
  Rfromdate2: any;
  Rtodate2: any;
  Lvalidation = false;
  requiredDate2: any;
  ctodatechange2: any;
  /*  */
  Rvalidation = false;
  requiredDate: any;
  ctodatechange0: any;
  /*  */
  Cfrommonthof: any;
  Ctomonthof: any;
  Cfromdate: any;
  Ctodate: any;
  /* PREVIOUS */
  Cfrommonthof1: any;
  Ctomonthof1: any;
  Cfromdate1: any;
  Ctodate1: any;

  /* LAST */
  Cfrommonthof2: any;
  Ctomonthof2: any;
  Cfromdate2: any;
  Ctodate2: any;

  showDateFlag: boolean = false;
  maturityData: any = [];
  pre_maturityData: any = [];
  type: any;
  net_Business_gridData: any = [];
  saleAdvanceList: any[];
  saleAdvanceHrbList: any[];
  showBranchDetails = false;
selectedBranch = '';
selectedScheme = '';
  branchDetailsList: any[] = [];

    DepositCount: any;
  DepositAmount: any;
  LivecertificatesData: any=[];
 SaleAdvanceList: any[] = [];
 SaleAdvanceHrbList:any[]=[];
  LivecertificatesFlag:boolean=false;
  showLiveBranchDetails=false;
   BranchDetailsList: any[] = [];




  constructor(private FB: FormBuilder, private datepipe: DatePipe, private userService: UsersService, private router: Router,private _commonService:CommonService,private _ProfessionalTaxService:ProfessionaltaxService) {
    this.dpFromConfig.dateInputFormat = 'DD-MMM-YYYY'
    this.dpFromConfig.maxDate = new Date();
    this.dpFromConfig.showWeekNumbers = false;
    this.dpToConfig.dateInputFormat = 'MMM-YYYY'
    this.dpChequeFromConfig.dateInputFormat = 'DD-MMM-YYYY'
    this.dpChequeToConfig.dateInputFormat = 'DD-MMM-YYYY'
    /* previous month */
    this.dpFromConfig1.dateInputFormat = 'DD-MMM-YYYY'
    this.dpFromConfig1.maxDate = new Date();
    this.dpFromConfig1.showWeekNumbers = false;
    this.dpToConfig1.dateInputFormat = 'DD-MMM-YYYY'
    this.dpChequeFromConfig1.dateInputFormat = 'DD-MMM-YYYY'
    this.dpChequeToConfig1.dateInputFormat = 'DD-MMM-YYYY'

    /* LAST MONTH */
    this.dpFromConfig2.dateInputFormat = 'DD-MMM-YYYY'
    this.dpFromConfig2.maxDate = new Date();
    this.dpFromConfig2.showWeekNumbers = false;
    this.dpToConfig2.dateInputFormat = 'DD-MMM-YYYY'
    this.dpChequeFromConfig2.dateInputFormat = 'DD-MMM-YYYY'
    this.dpChequeToConfig2.dateInputFormat = 'DD-MMM-YYYY'


    this.dpConfig.containerClass = 'theme-dark-blue';
    this.dpConfig.showWeekNumbers = false;
    this.dpConfig.maxDate = new Date();
    this.dpConfig.dateInputFormat = 'DD-MM-YYYY'
    this.dppConfig.containerClass = 'theme-dark-blue';
    this.dppConfig.showWeekNumbers = false;
    this.dppConfig.maxDate = new Date();
    this.dppConfig.dateInputFormat = 'DD-MM-YYYY'
    this.allDataCertifiacteDetails = this.allDataCertifiacteDetails.bind(this);
    this.allDataCertificates = this.allDataCertificates.bind(this);
    this.allDataAgentSummary = this.allDataAgentSummary.bind(this);
    this.allDataAgentSummaryDetails = this.allDataAgentSummaryDetails.bind(this);
    this.allDataBank = this.allDataBank.bind(this);



  }

  ngOnInit() {
    debugger;
    // this.userDetails = JSON.parse(sessionStorage.getItem("Urc"));
    // this.userNameF = this.userDetails.pUserName;
    // this.userIdF = this.userDetails.pUserID;

    this.dashboardForm = this.FB.group({
      pFromMonthOf: [this.today],
      pToMonthOf: [this.today],
      pChequFromMonthOf: [this.today],
      pchequeToMonthOf: [this.today],

      vFromMonthOf: [this.today],
      vToMonthOf: [this.today],
      vChequFromMonthOf: [this.today],
      vchequeToMonthOf: [this.today],

      LFromMonthOf: [this.today],
      LToMonthOf: [this.today],
      LChequFromMonthOf: [this.today],
      LchequeToMonthOf: [this.today],

      monthname: [this.today],
       dfromdate: [''],
       dtodate: [''],
      drfromdate: [this.today],
      drtodate: [this.today],
       date: [''],
    })

    this.FromDate = 'From Date'
    this.date = new Date();
    this.betweendates = "ASON"
    // this.inbetween = ""
    this.showdate = false;
     this.todate = "";
     this.FromDate = ''
    // this.hidegridcolumn = true;
    /* PRESENT  MONTH */
    this.Rfrommonthof = new Date();
    this.Rtomonthof = new Date();
    this.Rfromdate = this.datepipe.transform(this.Rfrommonthof, "yyyy-MM-dd");
    this.Rtodate = this.datepipe.transform(this.Rtomonthof, "yyyy-MM-dd");
    this.Cfrommonthof = new Date();
    this.Ctomonthof = new Date();
    this.Cfromdate = this.datepipe.transform(this.Cfrommonthof, "yyyy-MM-dd");
    this.Ctodate = this.datepipe.transform(this.Ctomonthof, "yyyy-MM-dd");
    /* PREVIOUS MONTH */
    this.Rfrommonthof1 = new Date();
    this.Rtomonthof1 = new Date();
    this.Rfromdate1 = this.datepipe.transform(this.Rfrommonthof1, "yyyy-MM-dd");
    this.Rtodate1 = this.datepipe.transform(this.Rtomonthof1, "yyyy-MM-dd");
    this.Cfrommonthof1 = new Date();
    this.Ctomonthof1 = new Date();
    this.Cfromdate1 = this.datepipe.transform(this.Cfrommonthof1, "yyyy-MM-dd");
    this.Ctodate1 = this.datepipe.transform(this.Ctomonthof1, "yyyy-MM-dd");

    /* LAST MONTH */
    this.Rfrommonthof2 = new Date();
    this.Rtomonthof2 = new Date();
    this.Rfromdate2 = this.datepipe.transform(this.Rfrommonthof2, "yyyy-MM-dd");
    this.Rtodate2 = this.datepipe.transform(this.Rtomonthof2, "yyyy-MM-dd");
    this.Cfrommonthof2 = new Date();
    this.Ctomonthof2 = new Date();
    this.Cfromdate2 = this.datepipe.transform(this.Cfrommonthof2, "yyyy-MM-dd");
    this.Ctodate2 = this.datepipe.transform(this.Ctomonthof2, "yyyy-MM-dd");

    this.dashboardForm['controls']['date'].setValue(true)
    this.dashboardForm['controls']['dfromdate'].setValue(this.date);
     this.dashboardForm['controls']['dtodate'].setValue(this.date);
   this.betweenfrom = this.datepipe.transform(this.date, "dd-MMM-yyyy");
    this.dashboardForm['controls']['drfromdate'].setValue(this.date);
   this.dashboardForm['controls']['drtodate'].setValue(this.date);
    this.getDepositesDatadashboard();
    this.getAgentSummaryDashboard();
    this.getBankDataDashboard();
    this.getInterestDataDashboard();
    this.getMaturityDatadashboard()
    this.getPreMaturityDatadashboard();
    this.getLiveCertificatesDatadashboard();
    this.extradays();
    this.extradays1();
    this.extradays_previous1();
    this.extradays_previous2();
    this.extradays_previous3();
    this.extradays_previous4()
  }


  /* datepicker methods  FOR PRESENT MONTH*/

  RFromDateChange($event: any) {
    debugger;
    // this.totalNoList = [];
    // this.totalNoList.empty;
    // this.clearmethod();
    this.net_Business_gridData=[]
   // this.dpToConfig.minDate = this.dashboardForm.controls.pFromMonthOf.value;
    this.Rfrommonthof = $event;
    this.Rfromdate = this.datepipe.transform(this.Rfrommonthof, "yyyy-MM-dd");


    if (this.Rtomonthof != [] || this.Rtomonthof == null || this.Rtomonthof == '') {
      this.Rvalidatedates();
    }
    this.extradays();


  }

  RToDateChange($event: any) {
    debugger;
    // this.totalNoList = [];
    // this.totalNoList.empty;
    // this.clearmethod();
    //this. Datesbind();
    this.net_Business_gridData=[]
    this.Rtomonthof = $event;
    this.Rtodate = this.datepipe.transform(this.Rtomonthof, "yyyy-MM-dd");

    if (this.Rfrommonthof != [] || this.Rfrommonthof == null || this.Rfrommonthof == '') {
      this.Rvalidatedates();
    }
    this.extradays1();
    this.dpChequeFromConfig.minDate = this.dashboardForm.controls.pFromMonthOf.value;
    this.dpChequeToConfig.minDate = this.dashboardForm.controls.pToMonthOf.value;
  }

  Rvalidatedates() {
    debugger;


    if (this.Rfromdate > this.Rtodate) {

      this.Rvalidation = true
    }

    else {
      this.Rvalidation = false;
    }

  }

  extradays() {
    debugger;
    let cdate = this.Rfrommonthof;
    // let dd=cdate.getDate();
    // let mm=cdate.getMonth()+1;
    // let yy=cdate.getFullYear();
    // let chqfdate=(dd+5)+'-'+mm+'-'+yy;
    // let date= new Date(chqfdate)
    // let datefromc =this.datepipe.transform(date, "dd-MMM-yyyy");
    this.requiredDate = new Date(cdate.getFullYear(), cdate.getMonth(), cdate.getDate() + 5)
    this.dashboardForm.controls['pChequFromMonthOf'].setValue(this.requiredDate);
  }

  extradays1() {
    let ctodate = this.Rtomonthof;

    this.ctodatechange0 = new Date(ctodate.getFullYear(), ctodate.getMonth(), ctodate.getDate() + 5)
    this.dashboardForm.controls['pchequeToMonthOf'].setValue(this.ctodatechange0);


  }
  /* datepick methods FOR PREVIOUS MONTH*/

  VFromDateChange($event: any) {
    debugger;
    // this.totalNoList = [];
    // this.totalNoList.empty;
    // this.clearmethod();
    this.net_Business_gridData=[]
    this.dpToConfig1.minDate = this.dashboardForm.controls.vFromMonthOf.value;
    this.Rfrommonthof1 = $event;
    this.Rfromdate1 = this.datepipe.transform(this.Rfrommonthof1, "yyyy-MM-dd");


    if (this.Rtomonthof1 != [] || this.Rtomonthof1 == null || this.Rtomonthof1 == '') {
      this.Rvalidatedates1();
    }
    this.extradays_previous1();


  }

  VToDateChange($event: any) {
    debugger;
    // this.totalNoList = [];
    // this.totalNoList.empty;
    // this.clearmethod();
    //this. Datesbind();
    this.net_Business_gridData=[]
    this.Rtomonthof1 = $event;
    this.Rtodate1 = this.datepipe.transform(this.Rtomonthof1, "yyyy-MM-dd");

    if (this.Rfrommonthof1 != [] || this.Rfrommonthof1 == null || this.Rfrommonthof1 == '') {
      this.Rvalidatedates1();
    }
    this.extradays_previous2();
    this.dpChequeFromConfig1.minDate = this.dashboardForm.controls.vFromMonthOf.value;
    this.dpChequeToConfig1.minDate = this.dashboardForm.controls.vToMonthOf.value;
  }

  Rvalidatedates1() {
    debugger;


    if (this.Rfromdate1 > this.Rtodate1) {

      this.Vvalidation = true
    }

    else {
      this.Vvalidation = false;
    }

  }


  extradays_previous1() {
    debugger;
    let cdate = this.Rfrommonthof1;
    // let dd=cdate.getDate();
    // let mm=cdate.getMonth()+1;
    // let yy=cdate.getFullYear();
    // let chqfdate=(dd+5)+'-'+mm+'-'+yy;
    // let date= new Date(chqfdate)
    // let datefromc =this.datepipe.transform(date, "dd-MMM-yyyy");
    this.requiredDate1 = new Date(cdate.getFullYear(), cdate.getMonth(), cdate.getDate() + 5)
    this.dashboardForm.controls['vChequFromMonthOf'].setValue(this.requiredDate1);
  }

  extradays_previous2() {
    let ctodate = this.Rtomonthof1;

    this.ctodatechange1 = new Date(ctodate.getFullYear(), ctodate.getMonth(), ctodate.getDate() + 5)
    this.dashboardForm.controls['vchequeToMonthOf'].setValue(this.ctodatechange1);


  }

  /* datepick methods FOR LAST MONTH*/

  LFromDateChange($event: any) {
    debugger;
    // this.totalNoList = [];
    // this.totalNoList.empty;
    // this.clearmethod();
    this.net_Business_gridData=[]
    this.dpToConfig2.minDate = this.dashboardForm.controls.LFromMonthOf.value;
    this.Rfrommonthof2 = $event;
    this.Rfromdate2 = this.datepipe.transform(this.Rfrommonthof2, "yyyy-MM-dd");


    if (this.Rtomonthof2 != [] || this.Rtomonthof2 == null || this.Rtomonthof2 == '') {
      this.Rvalidatedates2();
    }
    this.extradays_previous3();


  }

  LToDateChange($event: any) {
    debugger;
    // this.totalNoList = [];
    // this.totalNoList.empty;
    // this.clearmethod();
    //this. Datesbind();
    this.net_Business_gridData=[]
    this.Rtomonthof2 = $event;
    this.Rtodate2 = this.datepipe.transform(this.Rtomonthof2, "yyyy-MM-dd");

    if (this.Rfrommonthof2 != [] || this.Rfrommonthof2 == null || this.Rfrommonthof2 == '') {
      this.Rvalidatedates2();
    }
    this.extradays_previous4();
    this.dpChequeFromConfig2.minDate = this.dashboardForm.controls.LFromMonthOf.value;
    this.dpChequeToConfig2.minDate = this.dashboardForm.controls.LToMonthOf.value;

    this.getNetBusinessFreshRenewals()

  }

  Rvalidatedates2() {
    debugger;


    if (this.Rfromdate2 > this.Rtodate2) {

      this.Lvalidation = true
    }

    else {
      this.Lvalidation = false;
    }

  }
  extradays_previous3() {
    debugger;
    let cdate = this.Rfrommonthof2;
    // let dd=cdate.getDate();
    // let mm=cdate.getMonth()+1;
    // let yy=cdate.getFullYear();
    // let chqfdate=(dd+5)+'-'+mm+'-'+yy;
    // let date= new Date(chqfdate)
    // let datefromc =this.datepipe.transform(date, "dd-MMM-yyyy");
    this.requiredDate2 = new Date(cdate.getFullYear(), cdate.getMonth(), cdate.getDate() + 5)
    this.dashboardForm.controls['LChequFromMonthOf'].setValue(this.requiredDate2);
  }

  extradays_previous4() {
    let ctodate = this.Rtomonthof2;

    this.ctodatechange2 = new Date(ctodate.getFullYear(), ctodate.getMonth(), ctodate.getDate() + 5)
    this.dashboardForm.controls['LchequeToMonthOf'].setValue(this.ctodatechange2);


  }

  /* END */

   checkox(event: any) {
  debugger;

  let today = new Date();
    this.validation = false;

  if (event.target.checked) {
    this.betweendates = 'ASON';
    this.showdate = false;
    this.selecteddate = true;
    this.FromDate = 'Date';
    ;

    this.dashboardForm.controls.dfromdate.setValue(today);
    this.dashboardForm.controls.dtodate.setValue(today);
  }
  else {
    this.betweendates = 'Between';
    this.showdate = true;
    this.selecteddate = false;
     this.FromDate = 'From Date';
  }

  this.getDetailedCertificatesDashboard();
  this.getDetailedMaturityDashboard();
  this.getDetailedPreMaturityDashboard();
   this.getAgentSummaryDetails();
   this.getDetailedLiveCertificatesDashboard();

}



checkfromdate() {
  debugger;

    if (this.betweendates === 'ASON') {
    this.validation = false;
    return;
  }

  let from = new Date(this.dashboardForm.controls.dfromdate.value);
  let to = new Date(this.dashboardForm.controls.dtodate.value);

  if (from > to) {
    this.validation = true;
    return;
  }

  this.validation = false;
  this.getDetailedCertificatesDashboard();
  this.getDetailedMaturityDashboard();
   this.getDetailedPreMaturityDashboard();
    this.getAgentSummaryDetails();
    this.getDetailedLiveCertificatesDashboard();



}



  checktodate() {
  debugger;

    if (this.betweendates === 'ASON') {
    this.validation = false;
    return;
  }

  let from = new Date(this.dashboardForm.controls.dfromdate.value);
  let to = new Date(this.dashboardForm.controls.dtodate.value);

  if (from > to) {
    this.validation = true;
    return;
  }

  this.validation = false;
  this.getDetailedCertificatesDashboard();
  this.getDetailedMaturityDashboard();
   this.getDetailedPreMaturityDashboard();
    this.getAgentSummaryDetails();
    this.getDetailedLiveCertificatesDashboard();

}


  validationfordates() {

    let isValid = true;


    if (this.selecteddate == true) {
      this.fromdate = this.dashboardForm.controls.dfromdate.value
      this.todate = this.dashboardForm.controls.dfromdate.value
    }
    else {
      this.fromdate = this.dashboardForm.controls.dfromdate.value
      this.todate = this.dashboardForm.controls.dtodate.value
    }
    this.fromdate = this.datepipe.transform(this.fromdate, "yyyy-MM-dd");
    this.todate = this.datepipe.transform(this.todate, "yyyy-MM-dd");
    return isValid
  }

  public onOpenCalendar(container) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
    this.showcollectionandscope = false;
    this.showtrenddisbursement = false;

  }

  FromDateChange($event: any) {
    debugger;
    this.gridData = [];
    this.frommonthof = $event;
    this.fromdate = this.datepipe.transform(this.frommonthof, "yyyy-MM-dd");

    if (this.tomonthof != [] || this.tomonthof == null || this.tomonthof == '') {
      this.validatedates();
    }
  }

  // ToDateChange($event: any) {
  //   debugger;
  //   this.gridData = [];
  //   this.tomonthof = $event;
  //   this.todate = this.datepipe.transform(this.tomonthof, "yyyy-MM-dd");
  //   if (this.frommonthof != [] || this.frommonthof == null || this.frommonthof == '') {
  //     this.validatedates();
  //   }
  // }

  ToDateChange($event: any) {
  debugger;

  if (!$event) {
    return;
  }

  let month = this.datepipe.transform($event, 'MMM-yyyy');
  if (!month) {
    return;
  }

  this.userService.getNetBusiness(month).subscribe(resp => {
    console.log('Net business API:', resp);
    this.net_Business_gridData = resp;
  });
}

  validatedates() {
    debugger;
    if (this.fromdate > this.todate) {

      this.validation = true
    }

    else {
      this.validation = false;
    }

  }

  showModal(item: any): void {
    debugger
    item;
    $('#exampleModalCenter').modal('show');

    // debugger
    // event.preventDefault();
    // this.selectedCustomers = customers;
    // this.isModalVisible = true;
  }

  closeModal(): void {
    this.isModalVisible = false;
  }

  showModalCommission(customers: string[], event: Event): void {
    debugger
    event.preventDefault();
    this.selectedCommission = customers;
    this.isModalVisible1 = true;
  }

  closeModalCommission(): void {
    this.isModalVisible1 = false;
  }

  // Test dashboard -- Test

 getAllArrays(){
  this.LivecertificatesData=[];
     this.certificatesData = [];
  this.saleAdvanceList = [];
  this.saleAdvanceHrbList = [];
  this.branchDetailsList = [];
  this.BranchDetailsList=[];
  this.maturityData = [];
  this.pre_maturityData = [];
  this.agentSummaryData = [];
  this.agentSummaryDetList = [];
  this.detailedTransListAgent = [];
  this.bankDataDetailed = [];
  this.net_Business_gridData = [];
  this.interestdetailsData = [];
  this.StatutoryData = [];
  }

  certificatesClick() {
  debugger;

  this.type = 'certificate';
  this.betweendates = 'ASON';
      this.FromDate = 'Date'
  this.controlsLsit.forEach(item => {
    this.dashboardForm.controls[item].setValue(this.today);
  });
 this.getAllArrays();

  this.showBranchDetails = false;
this.LivecertificatesFlag=false;
 this.showLiveBranchDetails=false;
  this.certificatesFlag = true;
  this.detailedBranchFlag = false;
  this.netDateFlag = true;
  this.showdate = false;
  this.selecteddate = true;

  this.pre_maturityFlag = false;
  this.maturityFlag = false;
  this.agentSummaryFlag = false;
  this.detailedAgentFlag = false;
  this.bankDataDetailedFlag = false;
  this.interestdetailsFlag = false;
  this.netbusinessFlag = false;
  this.StatutoryFlag = false;
  this.getDetailedCertificatesDashboard();
}

LivecertificatesClick(){
   debugger;
  this.type = 'Livecertificate';
  this.betweendates = 'ASON';
      this.FromDate = 'Date'
  this.controlsLsit.forEach(item => {
    this.dashboardForm.controls[item].setValue(this.today);
  });
this.getAllArrays();
this.LivecertificatesFlag=true;
  this.showBranchDetails = false;
 this.showLiveBranchDetails=true;
  this.certificatesFlag = false;
  this.detailedBranchFlag = false;
  this.netDateFlag = true;
  this.showdate = false;
  this.selecteddate = true;

  this.pre_maturityFlag = false;
  this.maturityFlag = false;
  this.agentSummaryFlag = false;
  this.detailedAgentFlag = false;
  this.bankDataDetailedFlag = false;
  this.interestdetailsFlag = false;
  this.netbusinessFlag = false;
  this.StatutoryFlag = false;
  this.getDetailedLiveCertificatesDashboard();
}

getDetailedLiveCertificatesDashboard() {
  debugger;
 this.LivecertificatesData=[];
  this.SaleAdvanceList = [];
  this.SaleAdvanceHrbList = [];
  this.BranchDetailsList = [];
  this.showLiveBranchDetails=false;

  let fromDate = this.datepipe.transform( this.dashboardForm.controls.dfromdate.value, 'yyyy-MM-dd' );
  let toDate = this.datepipe.transform(this.dashboardForm.controls.dtodate.value,'yyyy-MM-dd');

  this.userService.getDetailedLiveCertificatesDashboard(this.betweendates,fromDate,toDate).subscribe(res => {

      this.LivecertificatesData = res;

     this.SaleAdvanceList = res.filter(
  (x: any) => x.pschemeName && x.pschemeName.trim() === 'SALE ADVANCE'
     );

this.SaleAdvanceHrbList = res.filter(
  (x: any) => x.pschemeName && x.pschemeName.trim() === 'SALE ADVANCE-HRB'
     );

    });
}


    getLiveCertificatesDatadashboard() {
    debugger;
    //let fromDate = this.datepipe.transform(this.dashboardForm.controls.dfromdate.value, "yyyy-MM-dd");
    //let toDate = this.datepipe.transform(this.dashboardForm.controls.dtodate.value, "yyyy-MM-dd");

    //this.userService.getDepositesDatadashboard(this.betweendates, fromDate, toDate).subscribe(res => {
    this.userService.getLiveCertificatesDatadashboard(this.betweendates).subscribe(res => {
      this.DepositCount = res[0].pDepositcount;
      this.DepositAmount = res[0].pDepositamount;
    })
  }

 MaturityClick() {
    debugger;
    this.type = 'maturity';
    this.betweendates = 'ASON';
         this.FromDate = 'Date'

     this.controlsLsit.forEach(item=>{
      this.dashboardForm.controls[item].setValue(this.today)
    })

   this.getAllArrays();
    this.netDateFlag = true;
    this.maturityFlag = true;
     this.selecteddate = true;
    // this.showDateFlag = false;
       this.showdate = false;
       this.LivecertificatesFlag=false;
 this.showLiveBranchDetails=false;

    this.pre_maturityFlag = false;
    this.certificatesFlag = false;
    this.agentSummaryFlag = false;
    this.detailedAgentFlag = false;
    this.bankDataDetailedFlag = false;
    this.detailedBranchFlag = false;
    this.netbusinessFlag = false;
     this.interestdetailsFlag=false;
    this.StatutoryFlag=false;
      this.showBranchDetails = false;
   this.getDetailedMaturityDashboard()
  }


  PreMaturityClick() {
    debugger;
    this.type = 'prematurity';
    this.betweendates = 'ASON';
         this.FromDate = 'Date'

     this.controlsLsit.forEach(item=>{
      this.dashboardForm.controls[item].setValue(this.today)
    })
 this.getAllArrays();
    this.netDateFlag = true;
    this.pre_maturityFlag = true;
      this.selecteddate = true;
      this.LivecertificatesFlag=false;
 this.showLiveBranchDetails=false;
    this.maturityFlag = false;
    // this.showDateFlag = false;
       this.showdate = false;

    this.certificatesFlag = false;
    this.agentSummaryFlag = false;
    this.detailedAgentFlag = false;
    this.bankDataDetailedFlag = false;
    this.detailedBranchFlag = false;
    this.netbusinessFlag = false;
    this.StatutoryFlag=false;
      this.showBranchDetails = false;
     this.getDetailedPreMaturityDashboard()

  }
   agentSummaryClick() {
    debugger;
    this.type = 'agentsummary';
        this.betweendates = 'ASON';

         this.FromDate = 'Date'
    // this.dashboardForm.controls.drfromdate.setValue(this.today);
    // this.dashboardForm.controls.drtodate.setValue(this.today);
     this.controlsLsit.forEach(item=>{
      this.dashboardForm.controls[item].setValue(this.today)
    })
   this.getAllArrays();
    this.agentSummaryFlag = true;
     this.netDateFlag = true;
     this.LivecertificatesFlag=false;
 this.showLiveBranchDetails=false;
         this.selecteddate = true;
    this.maturityFlag = false;
    // this.showDateFlag = false;
     this.showdate = false;
    this.pre_maturityFlag = false;
    this.certificatesFlag = false;
    this.detailedAgentFlag = false;
    this.bankDataDetailedFlag = false;
    this.detailedBranchFlag = false;
    this.netbusinessFlag = false;
     this.interestdetailsFlag=false;

      this.showBranchDetails = false;
    this.StatutoryFlag=false;
    this.getAgentSummaryDetails();
  }

  getDepositesDatadashboard() {
    debugger;
    //let fromDate = this.datepipe.transform(this.dashboardForm.controls.dfromdate.value, "yyyy-MM-dd");
    //let toDate = this.datepipe.transform(this.dashboardForm.controls.dtodate.value, "yyyy-MM-dd");

    //this.userService.getDepositesDatadashboard(this.betweendates, fromDate, toDate).subscribe(res => {
    this.userService.getDepositesDatadashboard(this.betweendates).subscribe(res => {
      this.depositCount = res[0].pDepositCount;
      this.depositAmount = res[0].pDepositAmount;
    })
  }

  getMaturityDatadashboard() {
    debugger;
    //let fromDate = this.datepipe.transform(this.dashboardForm.controls.dfromdate.value, "yyyy-MM-dd");
    //let toDate = this.datepipe.transform(this.dashboardForm.controls.dtodate.value, "yyyy-MM-dd");

    //this.userService.getDepositesDatadashboard(this.betweendates, fromDate, toDate).subscribe(res => {
    this.userService.getMaturityDatadashboard().subscribe(res => {
      this.MaturityCount = res[0].pMaturityCount;
      this.MaturityAmount = res[0].pMaturityAmount;
    })
  }

  getPreMaturityDatadashboard() {
    debugger;
    //let fromDate = this.datepipe.transform(this.dashboardForm.controls.dfromdate.value, "yyyy-MM-dd");
    //let toDate = this.datepipe.transform(this.dashboardForm.controls.dtodate.value, "yyyy-MM-dd");

    //this.userService.getDepositesDatadashboard(this.betweendates, fromDate, toDate).subscribe(res => {
    this.userService.getPreMaturityDatadashboard().subscribe(res => {
      console.log('pre amount:', res);

      this.PreMaturityCount = res[0].pPreMaturityCount;
      this.PreMaturityAmount = res[0].pPreMaturityAmount;
    })
  }

  // getDetailedCertificatesDashboard() {
  //   debugger;
  //   //let fromDate = this.datepipe.transform(this.dashboardForm.controls.dfromdate.value, "yyyy-MM-dd");
  //   //let toDate = this.datepipe.transform(this.dashboardForm.controls.dtodate.value, "yyyy-MM-dd");

  //   let fromDate = this.datepipe.transform(this.dashboardForm.controls.drfromdate.value, "yyyy-MM-dd");
  //   let toDate = this.datepipe.transform(this.dashboardForm.controls.drtodate.value, "yyyy-MM-dd");

  //   // this.userService.getDetailedCertificatesDashboard(this.betweendates, fromDate, toDate).subscribe(res => {

  //   this.userService.getDetailedCertificatesDashboard(fromDate, toDate).subscribe(res => {
  //     console.log('certificate griddata:', res);
  //     this.certificatesData = res;
  //   })
  // }

  //   getDetailedCertificatesDashboard() {
  //   debugger;
  //   //let fromDate = this.datepipe.transform(this.dashboardForm.controls.dfromdate.value, "yyyy-MM-dd");
  //   //let toDate = this.datepipe.transform(this.dashboardForm.controls.dtodate.value, "yyyy-MM-dd");

  //   let fromDate = this.datepipe.transform(this.dashboardForm.controls.drfromdate.value, "yyyy-MM-dd");
  //   let toDate = this.datepipe.transform(this.dashboardForm.controls.drtodate.value, "yyyy-MM-dd");

  //   // this.userService.getDetailedCertificatesDashboard(this.betweendates, fromDate, toDate).subscribe(res => {

  //     this.userService.getDetailedCertificatesDashboard( fromDate, toDate).subscribe(res => {

  //     this.certificatesData = res;
  //   })
  // }


getDetailedCertificatesDashboard() {
  debugger;

  this.certificatesData = [];
  this.saleAdvanceList = [];
  this.saleAdvanceHrbList = [];
  this.branchDetailsList = [];
  this.showBranchDetails = false;

  let fromDate = this.datepipe.transform( this.dashboardForm.controls.dfromdate.value, 'yyyy-MM-dd' );
  let toDate = this.datepipe.transform(this.dashboardForm.controls.dtodate.value,'yyyy-MM-dd');

  this.userService.getDetailedCertificatesDashboard(this.betweendates,fromDate,toDate).subscribe(res => {

      this.certificatesData = res;

     this.saleAdvanceList = res.filter(
  (x: any) => x.pschemeName && x.pschemeName.trim() === 'SALE ADVANCE'
     );

this.saleAdvanceHrbList = res.filter(
  (x: any) => x.pschemeName && x.pschemeName.trim() === 'SALE ADVANCE-HRB'
     );

    });
}


downloadSaleAdvancePdf(printorpdf: 'Pdf' | 'Print') {

  if (!this.certificatesData || this.certificatesData.length === 0) {
    this._commonService.showInfoMessage('No Data');
    return;
  }

  const saleAdvance = this.certificatesData.filter(
    x => x.pschemeName && x.pschemeName.trim() === 'SALE ADVANCE'
  );

  const saleAdvanceHRB = this.certificatesData.filter(
    x => x.pschemeName && x.pschemeName.trim() === 'SALE ADVANCE-HRB'
  );

  const maxRows = Math.max(saleAdvance.length, saleAdvanceHRB.length);

  const rows: any[] = [];

  for (let i = 0; i < maxRows; i++) {
  rows.push([
  // LEFT TABLE → SALE ADVANCE-HRB
  saleAdvanceHRB[i] ? saleAdvanceHRB[i].pBranchName : '',
  saleAdvanceHRB[i] ? saleAdvanceHRB[i].ptotalCertificates : '',
  saleAdvanceHRB[i]
    ? this._commonService.currencyformat(saleAdvanceHRB[i].ptotal)
    : '',

  '', '',

  // RIGHT TABLE → SALE ADVANCE
  saleAdvance[i] ? saleAdvance[i].pBranchName : '',
  saleAdvance[i] ? saleAdvance[i].ptotalCertificates : '',
  saleAdvance[i]
    ? this._commonService.currencyformat(saleAdvance[i].ptotal)
    : '',
]);



  }

  const headers = [
    'Branch', 'No.s', 'Value', '', '',
    'Branch', 'No.s', 'Value'
  ];

  const colWidthHeight = {
    0: { cellWidth: 50 },
    1: { cellWidth: 20, halign: 'center' },
    2: { cellWidth: 40, halign: 'right' },
    // 3: { cellWidth: 20 },
    // 4: { cellWidth: 20 },
    3: {
  cellWidth: 20,
  lineWidth: 0,
  fillColor: [255, 255, 255],
  textColor: [255, 255, 255]
},
4: {
  cellWidth: 20,
  lineWidth: 0,
  fillColor: [255, 255, 255],
  textColor: [255, 255, 255]
},

    5: { cellWidth: 50 },
    6: { cellWidth: 20, halign: 'center' },
    7: { cellWidth: 40, halign: 'right' }
  };

  const reportName = 'Total Certificates Reports';

  this._ProfessionalTaxService._downloadSaleAdvancePDF(
    reportName,
    rows,
    headers,
    colWidthHeight,
    'landscape',
    printorpdf
  );
}

downloadExcel() {

  const saleAdvance = this.certificatesData
    .filter(x => x.pschemeName === 'SALE ADVANCE');

  const saleAdvanceHRB = this.certificatesData
    .filter(x => x.pschemeName === 'SALE ADVANCE-HRB');

  const data: any[][] = [];

  // Headers
  data.push(['SALE ADVANCE', '', '', '', 'SALE ADVANCE-HRB']);
  data.push(['Branch', 'No.s', 'Value', '', 'Branch', 'No.s', 'Value']);

  const maxRows = Math.max(saleAdvance.length, saleAdvanceHRB.length);

  for (let i = 0; i < maxRows; i++) {

    const sa = saleAdvance[i];
    const sah = saleAdvanceHRB[i];

    data.push([
      sa ? sa.pBranchName : '',
      sa ? sa.ptotalCertificates : '',
      sa ? sa.ptotal : '',
      '',
      sah ? sah.pBranchName : '',
      sah ? sah.ptotalCertificates : '',
      sah ? sah.ptotal : ''
    ]);
  }

  const ws = XLSX.utils.aoa_to_sheet(data);

  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } },
    { s: { r: 0, c: 4 }, e: { r: 0, c: 6 } }
  ];

  ws['!cols'] = [
    { wch: 18 }, { wch: 8 }, { wch: 14 },
    { wch: 4 },
    { wch: 18 }, { wch: 8 }, { wch: 14 }
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Certificates');

  const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([buffer]), 'Certificates_Report.xlsx');
}

downloadSaleAdvancePdflive(printorpdf: 'Pdf' | 'Print') {
  debugger;

  if (!this.LivecertificatesData || this.LivecertificatesData.length === 0) {
    this._commonService.showInfoMessage('No Data');
    return;
  }

  const SaleAdvance = this.LivecertificatesData.filter(
    x => x.pschemeName && x.pschemeName.trim() === 'SALE ADVANCE'
  );

  const SaleAdvanceHRB = this.LivecertificatesData.filter(
    x => x.pschemeName && x.pschemeName.trim() === 'SALE ADVANCE-HRB'
  );

  const maxRows = Math.max(SaleAdvance.length, SaleAdvanceHRB.length);

  const rows: any[] = [];

  for (let i = 0; i < maxRows; i++) {
  rows.push([

  SaleAdvanceHRB[i] ? SaleAdvanceHRB[i].pBranchName : '',
  SaleAdvanceHRB[i] ? SaleAdvanceHRB[i].ptotalCertificates : '',
  SaleAdvanceHRB[i]
    ? this._commonService.currencyformat(SaleAdvanceHRB[i].ptotal)
    : '',

  '', '',

  SaleAdvance[i] ? SaleAdvance[i].pBranchName : '',
  SaleAdvance[i] ? SaleAdvance[i].ptotalCertificates : '',
  SaleAdvance[i]
    ? this._commonService.currencyformat(SaleAdvance[i].ptotal)
    : '',
]);



  }

  const headers = [
    'Branch', 'No.s', 'Value', '', '',
    'Branch', 'No.s', 'Value'
  ];

  const colWidthHeight = {
    0: { cellWidth: 50 },
    1: { cellWidth: 20, halign: 'center' },
    2: { cellWidth: 40, halign: 'right' },
    // 3: { cellWidth: 20 },
    // 4: { cellWidth: 20 },
    3: {
  cellWidth: 20,
  lineWidth: 0,
  fillColor: [255, 255, 255],
  textColor: [255, 255, 255]
},
4: {
  cellWidth: 20,
  lineWidth: 0,
  fillColor: [255, 255, 255],
  textColor: [255, 255, 255]
},

    5: { cellWidth: 50 },
    6: { cellWidth: 20, halign: 'center' },
    7: { cellWidth: 40, halign: 'right' }
  };


  const reportName = 'Total Certificates Reports';

  this._ProfessionalTaxService._downloadSaleAdvancePDF(
    reportName,
    rows,
    headers,
    colWidthHeight,
    'landscape',
    printorpdf
  );
}
downloadExcellive() {

  const SaleAdvance = this.LivecertificatesData
    .filter(x => x.pschemeName === 'SALE ADVANCE');

  const SaleAdvanceHRB = this.LivecertificatesData
    .filter(x => x.pschemeName === 'SALE ADVANCE-HRB');

  const data: any[][] = [];

  // Headers
  data.push(['SALE ADVANCE', '', '', '', 'SALE ADVANCE-HRB']);
  data.push(['Branch', 'No.s', 'Value', '', 'Branch', 'No.s', 'Value']);

  const maxRows = Math.max(SaleAdvance.length, SaleAdvanceHRB.length);

  for (let i = 0; i < maxRows; i++) {

    const sa = SaleAdvance[i];
    const sah = SaleAdvanceHRB[i];

    data.push([
      sa ? sa.pBranchName : '',
      sa ? sa.ptotalCertificates : '',
      sa ? sa.ptotal : '',
      '',
      sah ? sah.pBranchName : '',
      sah ? sah.ptotalCertificates : '',
      sah ? sah.ptotal : ''
    ]);
  }

  const ws = XLSX.utils.aoa_to_sheet(data);

  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } },
    { s: { r: 0, c: 4 }, e: { r: 0, c: 6 } }
  ];

  ws['!cols'] = [
    { wch: 18 }, { wch: 8 }, { wch: 14 },
    { wch: 4 },
    { wch: 18 }, { wch: 8 }, { wch: 14 }
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Certificates');

  const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([buffer]), 'Certificates_Report.xlsx');
}

onBranchClick(row: any, schemeName: string) {
  debugger;

  this.branchDetailsList = [];
  this.showBranchDetails = false;

  this.selectedBranch = row.pBranchName;
  this.selectedScheme = schemeName;

  let fromDate = this.datepipe.transform( this.dashboardForm.controls.dfromdate.value,'yyyy-MM-dd');

  let toDate = this.datepipe.transform( this.dashboardForm.controls.dtodate.value, 'yyyy-MM-dd' );

  this.userService.getDetailedCertificatesByBranch(row.pBranchName, this.betweendates, fromDate, toDate, schemeName).subscribe(res => {
      this.branchDetailsList = res;
      this.showBranchDetails = true;
    });
}

OnBranchClickLive(row: any, schemeName: string) {
  debugger;

  this.BranchDetailsList = [];
  this.showLiveBranchDetails=false;

  this.selectedBranch = row.pBranchName;
  this.selectedScheme = schemeName;

  let fromDate = this.datepipe.transform( this.dashboardForm.controls.dfromdate.value,'yyyy-MM-dd');

  let toDate = this.datepipe.transform( this.dashboardForm.controls.dtodate.value, 'yyyy-MM-dd' );

  this.userService.getDetailedLiveCertificatesByBranch(row.pBranchName, this.betweendates, fromDate, toDate, schemeName).subscribe(res => {
      this.BranchDetailsList = res;
     this.showLiveBranchDetails=true;
    });
}


   getDetailedMaturityDashboard() {
    debugger;
    //let fromDate = this.datepipe.transform(this.dashboardForm.controls.dfromdate.value, "yyyy-MM-dd");
    //let toDate = this.datepipe.transform(this.dashboardForm.controls.dtodate.value, "yyyy-MM-dd");

    let fromDate = this.datepipe.transform(this.dashboardForm.controls.dfromdate.value, "yyyy-MM-dd");
    let toDate = this.datepipe.transform(this.dashboardForm.controls.dtodate.value, "yyyy-MM-dd");

    // this.userService.getDetailedCertificatesDashboard(this.betweendates, fromDate, toDate).subscribe(res => {

    this.userService.getDetailedMaturityDashboard(this.betweendates,fromDate, toDate).subscribe(res => {
      console.log('maturity griddata:', res);
      this.maturityData = res;
    })
  }

  getDetailedPreMaturityDashboard() {
    debugger;
    //let fromDate = this.datepipe.transform(this.dashboardForm.controls.dfromdate.value, "yyyy-MM-dd");
    //let toDate = this.datepipe.transform(this.dashboardForm.controls.dtodate.value, "yyyy-MM-dd");

    let fromDate = this.datepipe.transform(this.dashboardForm.controls.dfromdate.value, "yyyy-MM-dd");
    let toDate = this.datepipe.transform(this.dashboardForm.controls.dtodate.value, "yyyy-MM-dd");

  // this.userService.getDetailedCertificatesDashboard(this.betweendates, fromDate, toDate).subscribe(res => {

    this.userService.getDetailedPreMaturityDashboard(this.betweendates,fromDate, toDate).subscribe(res => {
      console.log('prematurity griddata:', res);

      this.pre_maturityData = res;
    })
  }

  getNetBusinessFreshRenewals() {
    debugger;
    //let fromDate = this.datepipe.transform(this.dashboardForm.controls.dfromdate.value, "yyyy-MM-dd");
    //let toDate = this.datepipe.transform(this.dashboardForm.controls.dtodate.value, "yyyy-MM-dd");

    let receiptFromDate = this.datepipe.transform(this.dashboardForm.controls.pFromMonthOf.value, "yyyy-MM-dd");
    let receiptToDate = this.datepipe.transform(this.dashboardForm.controls.pToMonthOf.value, "yyyy-MM-dd");
    let chequeFromDate = this.datepipe.transform(this.dashboardForm.controls.pChequFromMonthOf.value, "yyyy-MM-dd");
    let chequeToDate = this.datepipe.transform(this.dashboardForm.controls.pchequeToMonthOf.value, "yyyy-MM-dd");
    let prevreceiptfromdate = this.datepipe.transform(this.dashboardForm.controls.vFromMonthOf.value, "yyyy-MM-dd");
    let prerecepttodate = this.datepipe.transform(this.dashboardForm.controls.vToMonthOf.value, "yyyy-MM-dd");
    let prevchequefromdate = this.datepipe.transform(this.dashboardForm.controls.vChequFromMonthOf.value, "yyyy-MM-dd");
    let prevchequetodate = this.datepipe.transform(this.dashboardForm.controls.vchequeToMonthOf.value, "yyyy-MM-dd");
    let lastreceiptfromdate = this.datepipe.transform(this.dashboardForm.controls.LFromMonthOf.value, "yyyy-MM-dd");
    let lastreceipttodate = this.datepipe.transform(this.dashboardForm.controls.LToMonthOf.value, "yyyy-MM-dd");
    let lastchequefromdate = this.datepipe.transform(this.dashboardForm.controls.LChequFromMonthOf.value, "yyyy-MM-dd");
    let lastchequetodate = this.datepipe.transform(this.dashboardForm.controls.LchequeToMonthOf.value, "yyyy-MM-dd");
    // this.userService.getDetailedCertificatesDashboard(this.betweendates, fromDate, toDate).subscribe(res => {

    this.userService.getNetBusinessFreshRenewals(receiptFromDate, receiptToDate, chequeFromDate, chequeToDate, prevreceiptfromdate, prerecepttodate, prevchequefromdate, prevchequetodate, lastreceiptfromdate, lastreceipttodate, lastchequefromdate, lastchequetodate).subscribe(res => {
      console.log('net business griddata:', res);

      this.net_Business_gridData = res;
    })
  }


  selectBranch(dataItem) {
    debugger;

    this.detailedBranchFlag = true;
    this.detailedAgentFlag = false;
    let fromDate = this.datepipe.transform(this.dashboardForm.controls.drfromdate.value, "yyyy-MM-dd");
    let toDate = this.datepipe.transform(this.dashboardForm.controls.drtodate.value, "yyyy-MM-dd");

    this.userService.getDetailedCertificatesByBranch(dataItem.pBranchName, this.betweendates, fromDate, toDate, dataItem.pschemeName).subscribe(json => {
      this.detailedByBranchList = json;
    })

  }

  // getAgentSummaryDashboard() {
  //   debugger;
  //   // let fromDate = this.datepipe.transform(this.dashboardForm.controls.dfromdate.value, "yyyy-MM-dd");
  //   //let toDate = this.datepipe.transform(this.dashboardForm.controls.dtodate.value, "yyyy-MM-dd");

  //   // this.userService.getAgentSummaryDashboard(this.betweendates, fromDate, toDate).subscribe(res => {
  //   this.userService.getAgentSummaryDashboard().subscribe(res => {

  //     this.agentSummaryData = res;

  //     this.totalCommissionAmount = this.agentSummaryData[0].pAgentCommissionValue;
  //   })
  // }


  getAgentSummaryDashboard() {
    debugger;
   // let fromDate = this.datepipe.transform(this.dashboardForm.controls.dfromdate.value, "yyyy-MM-dd");
    //let toDate = this.datepipe.transform(this.dashboardForm.controls.dtodate.value, "yyyy-MM-dd");

   // this.userService.getAgentSummaryDashboard(this.betweendates, fromDate, toDate).subscribe(res => {
     this.userService.getAgentSummaryDashboard(this.betweendates).subscribe(res => {

      this.agentSummaryData = res;
      this.agentCommissionCount=res[0].pCommissionCount;

     // this.totalCommissionAmount = this.agentSummaryData[0].pCommissionAmount;
      this.totalCommissionAmount = this.agentSummaryData[0].pAgentCommissionValue;

       // this.agentCommissionCount = this.agentSummaryData.length;

    })
  }

  // getStatutoryDetails()
  // {
  //    debugger;
  //     let fromDate = this.datepipe.transform(this.dashboardForm.controls.drfromdate.value, "yyyy-MM-dd");
  //   let toDate = this.datepipe.transform(this.dashboardForm.controls.drtodate.value, "yyyy-MM-dd");

  //   this.userService.GetStatutoryDetails().subscribe(res => {
  //     console.log('agent data:', res);

  //     this.StatutoryData = res;

  //   })

  // }
getStatutoryDetails()
{
  debugger;

  this.userService.GetStatutoryDetails().subscribe((res: any) => {
    console.log('agent data:', res);

    const order = ['TDS','GST' ,'PT', 'EPF', 'ESI'];

    let data: any[] = [];
    if (Array.isArray(res)) {
      data = res;
    } else if (res && res.Data && Array.isArray(res.Data)) {
      data = res.Data;
    }

    this.StatutoryData = data.sort(
      (a, b) => order.indexOf(a.particular) - order.indexOf(b.particular)
    );

  }, err => {
    console.error(err);
    this.StatutoryData = [];
  });
}



getIneterestDetails()
{
  debugger;
     let fromDate = this.datepipe.transform(this.dashboardForm.controls.drfromdate.value, "yyyy-MM-dd");
    let toDate = this.datepipe.transform(this.dashboardForm.controls.drtodate.value, "yyyy-MM-dd");

     this.userService.GetIntersestReportdetails().subscribe(res => {
      console.log('agent data:', res);

      this.interestdetailsData = res;

    })


}
   getAgentSummaryDetails() {
    debugger;
    // let fromDate = this.datepipe.transform(this.dashboardForm.controls.dfromdate.value, "yyyy-MM-dd");
    // let toDate = this.datepipe.transform(this.dashboardForm.controls.dtodate.value, "yyyy-MM-dd");

    let fromDate = this.datepipe.transform(this.dashboardForm.controls.dfromdate.value, "yyyy-MM-dd");
    let toDate = this.datepipe.transform(this.dashboardForm.controls.dtodate.value, "yyyy-MM-dd");


    this.userService.GetAgentReportdetails(this.betweendates, fromDate, toDate,  this.agentId).subscribe(res => {
      console.log('agent data:', res);

      this.agentSummaryDetList = res;

    })
  }
  selectAgentName(dataItem) {
    debugger
    dataItem.preferralid
    let fromDate = this.datepipe.transform(this.dashboardForm.controls.dfromdate.value, "yyyy-MM-dd");
    let toDate = this.datepipe.transform(this.dashboardForm.controls.dtodate.value, "yyyy-MM-dd");

    this.userService.getAgentSummaryByAgentId(dataItem.preferralid, this.betweendates, fromDate, toDate).subscribe(json => {
      this.detailedTransListAgent = json;
      this.detailedAgentFlag = true;
      this.detailedTransListAgent.forEach(item => {
        const [day, month, yearTime] = item.pAppDate.split('-');
        const [day1, month1, yearTime1] = item.pCertificatePeriod.split('-');
        const [year, time] = yearTime.split(' ');
        const [year1, time1] = yearTime1.split(' ');
        item.pAppDate = new Date(`${year}-${month}-${day}T${time || '00:00:00'}`);
        item.pCertificatePeriod = new Date(`${year1}-${month1}-${day1}T${time1 || '00:00:00'}`);
      });
    })
  }

  // getBankDataDashboard() {
  //   debugger;
  //   this.userService.getBankDataAmountTotal().subscribe(res => {
  //     this.bankData = res;
  //     console.log('bank data:', res);

  //     this.bankAmount = this.bankData[0].pBankBalanceTotal;
  //     this.banksCount = this.bankData.length;
  //   })
  // }

  getBankDataDashboard() {
  this.userService.getBankDataAmountTotal().subscribe(res => {
    if (res && res.length > 0) {
      this.banksCount = res.length;
      this.bankAmount = res.reduce( (sum, item) => sum + (item.pBankBalanceTotal || 0),  0 );
    }
    // else {
    //   this.banksCount = 0;
    //   this.bankAmount = 0;
    // }

  });
}

  bankDataClick() {
     this.controlsLsit.forEach(item=>{
      this.dashboardForm.controls[item].setValue(this.today)
    })
    this.bankDataDetailedFlag = true;
    this.maturityFlag = false;
this.getAllArrays();
    // this.showDateFlag = false;
    this.pre_maturityFlag = false;
    this.agentSummaryFlag = false;
    this.certificatesFlag = false;
    this.detailedAgentFlag = false;
    this.detailedBranchFlag = false;
    this.LivecertificatesFlag=false;
 this.showLiveBranchDetails=false;

    this.netbusinessFlag = false;
    this.netDateFlag = false;
    this.interestdetailsFlag=false;
     this.StatutoryFlag=false;
    this.getBankDetailedDashboard();
  }

  getBankDetailedDashboard() {
    debugger;
    this.userService.getBankDetailedDashboard().subscribe(res => {
      console.log('bank grid data:',res);

      this.bankDataDetailed = res;
      this.bankDataDetailedFlag = true;
    })
  }



  interestDataClick() {
     this.controlsLsit.forEach(item=>{
      this.dashboardForm.controls[item].setValue(this.today)
    })
    this.getAllArrays();
    this.bankDataDetailedFlag = false;
    this.maturityFlag = false;
    // this.showDateFlag = false;
    this.pre_maturityFlag = false;
    this.LivecertificatesFlag=false;
 this.showLiveBranchDetails=false;
    this.agentSummaryFlag = false;
    this.certificatesFlag = false;
    this.detailedAgentFlag = false;
    this.detailedBranchFlag = false;
    this.interestDataFlag = true;
    this.netbusinessFlag = true;
    this.netDateFlag = false;
    this.interestdetailsFlag=false;
     this.StatutoryFlag=false;

    this.viewInterestReport();
  }


  getInterestDataDashboard() {
    debugger;
    this.userService.getInterestDataDashboard().subscribe(res => {
      this.interestData = res;
      this.interestAmount = this.interestData[0].pInterestAmount;
      this.interestPayable = this.interestData[0].pInterestPayable;
      this.tdsAmount = this.interestData[0].pTdsAmount;
      this.interestDataFlag = true;
    })
  }

  netBusinessMovement() {
    debugger;
    this.type = 'netbusiness'
     this.controlsLsit.forEach(item=>{
      this.dashboardForm.controls[item].setValue(this.today)
    })

this.getAllArrays();
    this.netbusinessFlag = true;
    // this.showDateFlag = true;
    this.bankDataDetailedFlag = false;
    this.maturityFlag = false;
    this.pre_maturityFlag = false;
    this.agentSummaryFlag = false;
    this.certificatesFlag = false;
    this.detailedAgentFlag = false;
    this.LivecertificatesFlag=false;
 this.showLiveBranchDetails=false;
    this.detailedBranchFlag = false;
    this.interestDataFlag = false;
    this.netDateFlag = false;
    this.interestdetailsFlag=false;
     this.StatutoryFlag=false;
    // this.getFreshRenewals();
  }

  StatutoryClick()
  {
    debugger;
    this.type = 'Statutory'
     this.controlsLsit.forEach(item=>{
      this.dashboardForm.controls[item].setValue(this.today)
    })

    this.getAllArrays();
    this.netbusinessFlag = false;

    this.bankDataDetailedFlag = false;
    this.maturityFlag = false;
    this.pre_maturityFlag = false;
    this.LivecertificatesFlag=false;
 this.showLiveBranchDetails=false;
    this.agentSummaryFlag = false;
    this.certificatesFlag = false;
    this.detailedAgentFlag = false;
    this.detailedBranchFlag = false;
    this.interestDataFlag = false;
    this.netDateFlag = false;
    this.interestdetailsFlag=false;
     this.StatutoryFlag=true;
    this.getStatutoryDetails();




  }

    interestDetailsClick() {
    debugger;
    this.type = 'interestDetails'
     this.controlsLsit.forEach(item=>{
      this.dashboardForm.controls[item].setValue(this.today)
    })
	   this.getAllArrays();
    this.netbusinessFlag = false;
    // this.showDateFlag = true;
    this.bankDataDetailedFlag = false;
    this.maturityFlag = false;
    this.pre_maturityFlag = false;
    this.agentSummaryFlag = false;
    this.LivecertificatesFlag=false;
 this.showLiveBranchDetails=false;
    this.certificatesFlag = false;
    this.detailedAgentFlag = false;
    this.detailedBranchFlag = false;
    this.interestDataFlag = false;
    this.netDateFlag = false;
    this.StatutoryFlag=false;
    this.interestdetailsFlag=true;
    this.getIneterestDetails();

  }

  // DateChange(event) {
  //   debugger;
  //   this.getFreshRenewals();
  // }


  DateChange(event) {
    debugger;
    // if (this.certificatesClick) {
    //   this.getDetailedCertificatesDashboard();
    // }
    // else if (this.agentSummaryClick) {
    //   this.getAgentSummaryDetails();
    // }
    // else if (this.MaturityClick) {
    //   this.getDetailedMaturityDashboard();
    // }
    // else if (this.PreMaturityClick) {
    //   this.getDetailedPreMaturityDashboard()

    // }
    if (this.type == 'certificate') {
      this.getDetailedCertificatesDashboard();
    }
    else if (this.type == 'maturity') {
      this.getDetailedMaturityDashboard();
    }
    else if (this.type == 'prematurity') {
      this.getDetailedPreMaturityDashboard();
    }
    else if (this.type == 'agentsummary') {
      this.getAgentSummaryDetails();
    }
    else if (this.type == 'netbusiness') {
      this.getAgentSummaryDetails();
    }
    else if (this.type == 'interestDetails')
    {
       this.getIneterestDetails();

    }

      else if (this.type == 'Livecertificate') {
      this.getDetailedLiveCertificatesDashboard();
    }
  }


  getFreshRenewals() {
    debugger;
    let fromDate = this.datepipe.transform(this.dashboardForm.controls.drfromdate.value, 'yyyy-MM-dd');
    let toDate = this.datepipe.transform(this.dashboardForm.controls.drtodate.value, 'yyyy-MM-dd');
    this.userService.getFreshRenewals(fromDate, toDate, fromDate, toDate).subscribe(resp => {
      this.totalNoList = resp;
      console.log('totalnolist:', resp);

      this.totalValue = resp[0].pTotalValue;
    });
    this.getOldRenewalsDashboard();
  }

  getOldRenewalsDashboard() {
    debugger;
    let fromDate = this.datepipe.transform(this.dashboardForm.controls.drfromdate.value, 'yyyy-MM-dd');
    let toDate = this.datepipe.transform(this.dashboardForm.controls.drtodate.value, 'yyyy-MM-dd');
    this.userService.getOldRenewalsDashboard(fromDate, toDate, fromDate, toDate).subscribe(res => {
      this.totalNoListOld = res;
      this.totalValueOld = res[0].pTotalValue;
    })
  }



  public allDataCertifiacteDetails(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.detailedByBranchList, {
        sort: [{ field: "preceiptdate", dir: "asc" }],
      }).data,
    };

    return result;
  }

  public allDataCertificates(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.certificatesData, {
        sort: [{ field: "preceiptdate", dir: "asc" }],
      }).data,
    };

    return result;
  }

  public allDataLiveBranchCertificates = (): ExcelExportData => {

  const data = this.BranchDetailsList ? this.BranchDetailsList : [];

  console.log('Export count:', data.length);

  return {
    data: process(data, {
      skip: 0,
      take: data.length
    }).data
  };
};

  public allDataAgentSummary(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.agentSummaryDetList, {
        sort: [{ field: "preceiptdate", dir: "asc" }],
      }).data,
    };

    return result;
  }
  public allDataAgentSummaryDetails(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.detailedTransListAgent, {
        sort: [{ field: "preceiptdate", dir: "asc" }],
      }).data,
    };

    return result;
  }
  public allDataBank(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.bankDataDetailed, {
        sort: [{ field: "preceiptdate", dir: "asc" }],
      }).data,
    };

    return result;
  }

  public allDataBranchCertificates = (): ExcelExportData => {

  const data = this.branchDetailsList ? this.branchDetailsList : [];

  console.log('Export count:', data.length);

  return {
    data: process(data, {
      skip: 0,
      take: data.length
    }).data
  };
};



  viewInterestReport() {
    this.router.navigate(["/DetailedInterestReport"])
  }

  viewBankDetails() {
    this.router.navigate(["/BRStatment"])
  }


}
