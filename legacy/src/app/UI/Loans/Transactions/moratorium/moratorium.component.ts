import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { ChargemasterService } from 'src/app/Services/Loans/Masters/chargemaster.service';
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { LoanreceiptService } from 'src/app/Services/Loans/Transactions/loanreceipt.service';
import { Router } from '@angular/router';
import { FIIndividualService } from 'src/app/Services/Loans/Transactions/fiindividual.service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { MoratoriumService } from 'src/app/Services/Loans/Transactions/moratorium.service';
import { DisbusementService } from 'src/app/Services/Loans/Transactions/disbusement.service';

declare var $: any;

@Component({
  selector: 'app-moratorium',
  templateUrl: './moratorium.component.html',
  styles: []
})
export class MoratoriumComponent implements OnInit {
  loandropForm: FormGroup;
  pFormname: any = "MORATORIUM"

  notApplicableForReferralFlag: boolean = true;
  forNarrationError = false;
  loading = false;
  formValidationMessages: any;
  public today: Date = new Date();
  disabletransactiondate: boolean;
  noaddbuttonforcharges: boolean = true;
  buttonName = "Save";
  public isLoading: boolean = false;
  loantypeid: any
  LoanNames: any[] = [];
  loandetailsOfApplicationid = [];
  LoanTypes: Response;
  loanreceiptAppliactionId: any;
  dataOfLoan = [];
  pApplicantname: any;
  pContactid: any;
  pDateofapplication: any;
  pLoanname: any;
  pPurposeofloan: any;
  pAmountrequested: any;
  pTenureofloan: any;
  pRateofinterest: any;
  pLoanpayin: any;
  pApprovedamount = 0;
  // pPrinciplereceivable: any;
  public TotalInterest: any;
  public Totalprinciple: any;
  public Totalinstallmentmount: any;
  public Emistartdate: any;
  public Loanaccountno: any;
  public EmichartData: any;
  public GridData: any[];
  pLoantype;
  pLoantypeid;
  narration;
  pApplicationid: number;
  pLoanId: number;
  pSubledgerid: any;
  pLoanid: any;
  pInteresttype: any;
  pLoantypeloandetails: any;
  pEmiAmount: any;
  forNarrationErrorValid: boolean = false;
  public dpConfig2: Partial<BsDatepickerConfig> = new BsDatepickerConfig();

  pLoanstatus: any;
  pConid: any;
  pContacttype: any;
  forDatepicckerconfig: Date;
  pApproveddate: any;
  ploaninstalmentpaymentmode: any;
  pdisbursementpayinmode: any;

  amount: number = 0;
  pPrinciplereceivable: number = 0;
  pIntrestreceivable: number = 0;
  installmentDues: number = 0;
  installmentDate: any;
  installmentAmount: number = 0;
  lastreceiptAmount: number = 0;
  Futureprinciple: number = 0;
  Futureinterest: number = 0;
  Futureduecount: number = 0;
  nextEmiDate: any;
  pdisbursementdate: any;
  constructor(public datePipe: DatePipe, private _commonService: CommonService, private formbuilder: FormBuilder, private zone: NgZone, private _moratoriumsevices: MoratoriumService, private loanreceiptServices: LoanreceiptService, private _DisbusementService: DisbusementService) {
    //kendo dropdown for application number started
    window['CallingFunctionOutsideSelectApplicantId' + this.dynamicLoanapplicationId] = {
      zone: this.zone,
      componentFn: (value) => this.selectedDetails(value),
      component: this,
    };
    window['CallingFunctionToHideCard' + this.dynamicLoanapplicationId] = {
      zone: this.zone,
      componentFn: () => this.HideCard(),
      component: this,
    };
    //kendo dropdown for application number ended

    //<----datepicker functionalities started---->
    this.dpConfig2.showWeekNumbers = false;
    this.dpConfig2.containerClass = 'theme-dark-blue';
    this.dpConfig2.dateInputFormat = 'DD/MM/YYYY';
    //this.dpConfig2.maxDate = new Date();
    this.dpConfig2.minDate = new Date();
    this.dpConfig2.showWeekNumbers = false;
    //<----datepicker functionalities ended---->
  }

  ngOnInit() {
    this.pApproveddate = null;
    this.ploaninstalmentpaymentmode = null;
    this.pdisbursementpayinmode = null;
    this.EmichartData = null;
    this.GridData = [];
    this.TotalInterest = 0;
    this.Totalprinciple = 0;
    this.Totalinstallmentmount = 0;
    if (this._commonService.comapnydetails != null)
      this.disabletransactiondate = this._commonService.comapnydetails.pdatepickerenablestatus;


    this.formValidationMessages = {};
    this.loandropForm = this.formbuilder.group({
      loanname: [''],
      loanapplication: [''],
      moratoriummonthscount: ['', Validators.required],
      interestmode: ['FALSE'],
      pDattransdate: [this.today],
    })
    this.BlurEventAllControll(this.loandropForm);
    this._moratoriumsevices.GetLoannames().subscribe((data: any) => {
      this.LoanTypes = data
      for (let i = 0; i < data.length; i++) {
        this.pLoanid = data[i].pLoantypeid;
      }

    });
  }

  notApplicableAllForReferral(event) {
    var checked = event.target.checked
    if (checked == true) {
      this.notApplicableForReferralFlag = true;
      this.loandropForm.controls.interestmode.setValue('TRUE');
    }
    else {
      this.notApplicableForReferralFlag = false;
      this.loandropForm.controls.interestmode.setValue('FALSE');
    }
  }
  //<----Validation for formgroup started---->
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
          this.formValidationMessages[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {

            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                let lablename;
                lablename = (document.getElementById(key) as HTMLInputElement).title;
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.formValidationMessages[key] += errormessage + ' ';
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
  //<----Validation for formgroup ended---->


  //<-----select application id in kendo dropdown started--->
  selectApplicantId(e) {

    if (e.dataItem) {
      var dataItem = e.dataItem;
      window['CallingFunctionOutsideSelectApplicantId' + this.dynamicLoanapplicationId].componentFn(dataItem);
    }
  }
  //<-----select application id in kendo dropdown ended--->

  //<-----select application id details in kendo dropdown started--->
  selectedDetails(data) {
    debugger;
    this.pLoanId = null;
    if (data) {
      if (this.pLoantype == data.loanTypye) {
        this.loandropForm.controls.loanapplication.setValue(data.pVchapplicationid);
        this.loanreceiptAppliactionId = data.pVchapplicationid;
        this.pApplicationid = data.pApplicationid;
        this.pLoanId = data.pLoanId;
        if (this.loanreceiptAppliactionId) {
          this.changeLoanApplicationId();
        }
      }
    }
  }
  //<-----select application id details in kendo dropdown ended--->

  //<-----refresh details after changing the application id details in kendo dropdown started--->
  refreshloanDataForSelectApplicant() {
    this.loandropForm.controls.loanapplication.setValue('');
    var multicolumncombobox: any;
    multicolumncombobox = $("#" + this.dynamicLoanapplicationId).data("kendoMultiColumnComboBox");
    if (multicolumncombobox) {
      multicolumncombobox.value("")
    }
    this.formValidationMessages.loanapplication = '';
  }
  //<-----refresh details after changing the application id details in kendo dropdown ended--->

  //<-----cancel buuton function in kendo dropdown started--->
  CancelClick() {
    window['CallingFunctionToHideCard' + this.dynamicLoanapplicationId].componentFn()
  }
  HideCard() {
    if (this.loandropForm.controls['pVchapplicationid'].value) {
      this.loandropForm.controls['pVchapplicationid'].setValue('');
      this.BlurEventAllControll(this.loandropForm);
    }
  }
  //<-----cancel buuton function in kendo dropdown ended--->
  dynamicLoanapplicationId: any;

  //<-----after selecting loan type getting the data of appliaction id dropdown function started--->
  ChangeLoanType(args) {
    let str = args.target.options[args.target.selectedIndex].text
    if (str.toString().toUpperCase() == 'SELECT') {
      this.refreshloanDataForSelectApplicant();
      $("#" + this.dynamicLoanapplicationId).data("kendoMultiColumnComboBox").dataSource = [];
      this.formValidationMessages.loanname = '';
    }
    this.resetData();
    this.BlurEventAllControll(this.loandropForm)
    if (this.loandropForm.value.loanapplication) {
      this.refreshloanDataForSelectApplicant();
    }
    this.loantypeid = args.currentTarget.value;
    let loanName = args.currentTarget.value.replace(/ +/g, "");
    this.dynamicLoanapplicationId = loanName;
    this.pLoantype = str
    this._moratoriumsevices.getReceiptApplicationId(this.loantypeid, this.pFormname).subscribe((data: any) => {
      this.LoanNames = [];
      this.loandetailsOfApplicationid = data;
      for (let index = 0; index < data.length; index++) {
        let loanTypye = {
          'loanTypye': this.loantypeid
        }
        var dataResponse = Object.assign(loanTypye, data[index]);
        this.LoanNames.push(dataResponse);
      }
      if (this.LoanNames) {
        $("#" + loanName).kendoMultiColumnComboBox({
          dataTextField: "pVchapplicationid",
          height: 400,
          columns: [
            {
              field: "pVchapplicationid", title: "Application Id", width: 150
            },
            { field: "pApplicantname", title: "Applicant Name", width: 150 },
            { field: "pLoanname", title: "Loan Name", width: 150 },
          ],
          footerTemplate: 'Total #: instance.dataSource.total() # items found',
          filter: "contains",
          filterFields: ["pVchapplicationid", "pApplicantname", "pLoanname"],
          dataSource: this.LoanNames,
          select: this.selectApplicantId,
        });

      }
    })
  }
  //<-----after selecting loan type getting the data of appliaction id dropdown function ended--->
  dateChnage(event) {
    this.changeMoratoriummonths();
    this.getParticulars();
  }
  //<-----Moratorium Months Add (started)---->
  changeMoratoriummonths() {
debugger
    //this.loading = true;
    this.nextEmiDate = null;
    let pDattransdates = this.datePipe.transform(this.loandropForm.controls.pDattransdate.value, 'yyyy-MM-dd');
    let moratoriummonthscount = parseFloat(this.loandropForm.controls.moratoriummonthscount.value);
    if (pDattransdates && this.pLoanpayin && moratoriummonthscount) {
      this._moratoriumsevices.GetNextEmiDate(this.pLoanpayin, pDattransdates, moratoriummonthscount,this.loanreceiptAppliactionId).subscribe((data: any) => {
        if (data)
          this.nextEmiDate = data[0].pnextemidate;
        this.loading = false;
      }, (error) => {
        this.nextEmiDate = null;
        this.loading = false;
      });
    } else {
      this.nextEmiDate = null;
      this.loading = false;
    }
    this.loading = false;
  }
  //<-----Moratorium Months Add ended--->

  //<-----getting particulars of selecting appliaction number (started)---->
  getParticulars() {
    debugger
    //this.loading = true;
    this._moratoriumsevices.getParticularsById(this.loanreceiptAppliactionId, this.datePipe.transform(this.loandropForm.controls.pDattransdate.value, 'dd-MMM-yyyy').toString(), 'Preclosure').subscribe((data: any) => {
      this.loading = false;
      if (data) {
        for (let i = 0; i < data.length; i++) {

          if (data[i].pParticularsname == 'OUTSTANDING PRINCIPLE') {
            this.amount = data[i].pAmount
            this.pPrinciplereceivable = data[i].pPrinciplereceivable;
            this.pIntrestreceivable = data[i].pIntrestreceivable;
            this.installmentDues = data[i].pInstalmentdues;
            this.installmentDate = data[i].pLastreceiptdate;
            this.installmentAmount = data[i].pEmiamount;
            this.lastreceiptAmount = data[i].pLastreceiptamount;
            this.Futureprinciple = data[i].pFutureprinciple;
            this.Futureinterest = data[i].pFutureinterest;
            this.Futureduecount = data[i].pFutureduecount;
          }

        }
      }
    }, (error) => {
      this.loading = false;
    });
    this.loading = false;
  }
  //<-----getting particulars of selecting appliaction number (ended)---->
  //<-----getting loan details of selecting appliaction number (started)---->
  loanDetails() {
    //this.loading = true;
    this._moratoriumsevices.getLoanDeatilsInReceiptform(this.loanreceiptAppliactionId).subscribe((data: any) => {
      console.log('pLoantype',this.pLoantype)
      console.log('loan data', data);
      this.loading = false;
      this.dataOfLoan = data;
      if (this.pLoantype == data[0].pLoantype) {
        for (let i = 0; i < this.dataOfLoan.length; i++) {
          this.pApplicantname = this.dataOfLoan[i].pApplicantname;
          this.pLoanname = this.dataOfLoan[i].pLoanname;
          this.pApprovedamount = this.dataOfLoan[i].pApprovedamount;
          this.pDateofapplication = this._commonService.formatDateFromDDMMYYYY(this.dataOfLoan[i].pDateofapplication);
          this.pLoantypeloandetails = this.dataOfLoan[i].pLoantype;
          this.pPurposeofloan = this.dataOfLoan[i].pPurposeofloan;
          this.pAmountrequested = this.dataOfLoan[i].pAmountrequested;
          this.pTenureofloan = this.dataOfLoan[i].pTenureofloan;
          this.pRateofinterest = this.dataOfLoan[i].pRateofinterest;
          this.pLoanpayin = this.dataOfLoan[i].pLoanpayin;
          this.pInteresttype = this.dataOfLoan[i].pInteresttype;
          this.pEmiAmount = this.dataOfLoan[i].pEmiAmount;
          this.pLoanstatus = this.dataOfLoan[i].pLoanstatus;
          this.pApproveddate = this.dataOfLoan[i].pApproveddate;
          this.ploaninstalmentpaymentmode = this.dataOfLoan[i].ploaninstalmentpaymentmode;
          this.pdisbursementpayinmode = this.dataOfLoan[i].pdisbursementpayinmode;
          this.pdisbursementdate = this.dataOfLoan[i].pdisbursementdate;
          let temppdisbursementdate = new Date(this.dataOfLoan[i].pdisbursementdate);
          var todayData = new Date(this.dataOfLoan[i].pinstallmentstartdate);
          var dd = String(todayData.getDate());
          var mm = String(todayData.getMonth() + 1); //January is 0!
          var yyyy = todayData.getFullYear();
          let v = dd + '/' + mm + '/' + yyyy;
          this.dpConfig2.minDate = new Date(v);
          this.loandropForm.controls.pDattransdate.setValue(this.today);
        }
      }
      this.getParticulars();
    },
      (error) => {
        this.loading = false;
      });
    this.loading = false;
  }
  //<-----getting loan details of selecting appliaction number (ended)---->



  //<-----after changed appliaction id geting called all api's for appliaction id (started)---->
  changeLoanApplicationId() {
    debugger;
    this.resetData();
    this.loanDetails();
    for (let i = 0; i < this.loandetailsOfApplicationid.length; i++) {
      if (this.loandetailsOfApplicationid[i].pVchapplicationid == this.loanreceiptAppliactionId) {
        this.pApplicantname = this.loandetailsOfApplicationid[i].pApplicantname;
        this.pLoanname = this.loandetailsOfApplicationid[i].pLoanname;
      }
    }
    for (let i = 0; i < this.LoanNames.length; i++) {
      if (this.LoanNames[i].pVchapplicationid == this.loanreceiptAppliactionId) {
        this.pSubledgerid = this.LoanNames[i].pAccountid;
        this.pContactid = this.LoanNames[i].pContactid;
        this.pConid = this.LoanNames[i].pConid;
        this.pContacttype = this.LoanNames[i].pContacttype;
      }
    }

  }
  //<-----after changed appliaction id geting called all api's for appliaction id (ended)---->


  //<----error message functions (started)---->
  showErrorMessage(errormsg: string) {
    this._commonService.showErrorMessage(errormsg);
  }
  showInfoMessage(errormsg: string) {
    this._commonService.showInfoMessage(errormsg);
  }
  //<----error message functions (ended)---->



  //<-----validation for narration---->
  forNarration(event) {
    if (event.target.value == '') {
      this.forNarrationErrorValid = false;
    }
    else {
      this.forNarrationErrorValid = true;
    }
  }
  //<-----saving data to api(started)---->
  saveLoanReceipt() {
    debugger
    let isvalid = true;
    this.forNarrationError = true;
    if (this.checkValidations(this.loandropForm, isvalid) && this.forNarrationErrorValid) {
      let moratoriummonthscountValue = parseFloat(this.loandropForm.controls.moratoriummonthscount.value);
      if (moratoriummonthscountValue == 0) {
        this._commonService.showErrorMessage('Moratorium months can not be zero...');
        return
      }

      this.buttonName = "Processing";
      this.isLoading = true;
      let data = {
        pApplicationid: this.loanreceiptAppliactionId,
        pMoratoriumdate: this.loandropForm.controls.pDattransdate.value,
        pMoratoriumno: this.loandropForm.controls.moratoriummonthscount.value ? Number((this.loandropForm.controls.moratoriummonthscount.value.toString()).replace(/,/g, "")) : 0,
        pInterestMode: this.loandropForm.controls.interestmode.value,
        pRemarks: this.narration,
        pCreatedby: this._commonService.pCreatedby,
        pCreateddate: this.today,
        pnextemidate:this.nextEmiDate? (this.nextEmiDate) : null
      }

      this.UpdatemoratoriuminstalmentsData();
      this._moratoriumsevices.SaveMoratorium(data).subscribe((data: any) => {
        if (data) {
          this.emiChart();
          this.forNarrationErrorValid = false;
          this.buttonName = "Save";
          this.isLoading = false;
          this.forNarrationError = false;
          this.noaddbuttonforcharges = true;
          this.showInfoMessage("Saved Successfully");
          this.clearData();
          this.loandropForm.reset();
          this.BlurEventAllControll(this.loandropForm);
          this.refreshloanDataForSelectApplicant();
          this.LoanNames = [];
          $("#" + this.dynamicLoanapplicationId).data("kendoMultiColumnComboBox").dataSource = [];
          this.ngOnInit();
        }
        else {
          this.buttonName = "Save";
          this.isLoading = false;
          this.forNarrationError = false;
        }
      },
        (error) => {
          this.buttonName = "Save";
          this.isLoading = false;
          this.forNarrationError = false;

          // this.showErrorMessage(error);
        });


    }
    else {
      this._commonService.showWarningMessage("Please enter details");
    }
    this.loading = false;
  }
  //<-----saving data to api(ended)---->


  //<----clear the data (started)---->
  clearData() {
    this.noaddbuttonforcharges = true;
    this.notApplicableForReferralFlag = false;
    this.loanreceiptAppliactionId = null;
    this.resetData();
    this.refreshloanDataForSelectApplicant();
    this.loandropForm.reset();
    this.BlurEventAllControll(this.loandropForm);
  }
  //<----clear the data (started)---->

  //<----reset the data (started)---->
  resetData() {
    this.nextEmiDate = null;
    this.pdisbursementdate = null;
    this.amount = 0;
    this.pPrinciplereceivable = 0;
    this.pIntrestreceivable = 0;
    this.installmentDues = 0;
    this.installmentDate = null;
    this.installmentAmount = 0;
    this.lastreceiptAmount = 0;
    this.Futureprinciple = 0;
    this.Futureinterest = 0;
    this.Futureduecount = 0;
    this.pApproveddate = null;
    this.ploaninstalmentpaymentmode = null;
    this.pdisbursementpayinmode = null;
    this.dpConfig2.minDate = new Date();
    this.narration = null;
    this.pApprovedamount = 0;
    this.pApplicantname = null;
    this.pDateofapplication = null;
    this.pLoantypeloandetails = null;
    this.pLoanname = null;
    this.pPurposeofloan = null;
    this.pAmountrequested = null;
    this.pTenureofloan = null;
    this.pRateofinterest = null;
    this.pLoanpayin = null;
    this.pInteresttype = null;
    this.pEmiAmount = null;
    this.EmichartData = null;
    this.GridData = [];
    this.TotalInterest = 0;
    this.Totalprinciple = 0;
    this.Totalinstallmentmount = 0;
    this.loading = false;
    this.notApplicableForReferralFlag = false;
  }
  //<----reset the data (ended)---->

  emiChart() {
    window.open('/#/EmiChartReport?id=' + btoa(this.loanreceiptAppliactionId));
  }

  //<----change the negative amount to positive(started)---->
  changeToPositive(data) {
    if (data) {
      let enteredData = Number(data.toString().replace(/,/g, ""));
      if (enteredData < 0) {
        return ("(" + (Math.abs(enteredData).toFixed(2)) + ")");
      }
      else {
        return enteredData;
      }
    }
    else {
      return 0;
    }
  }
  //<----change the negative amount to positive(ended)---->

  //<!-- Emi Report Generate-->
  UpdatemoratoriuminstalmentsData() {
    debugger
    try {
      let applicationid = this.loanreceiptAppliactionId;
      let moratoriumdate = this.loandropForm.controls.pDattransdate.value;
      moratoriumdate = this.datePipe.transform(moratoriumdate, 'yyyy-MM-dd').toString()
      let moratoriummonthscount = parseFloat(this.loandropForm.controls.moratoriummonthscount.value);
      let interestmode = this.loandropForm.controls.interestmode.value;
      if (applicationid && moratoriummonthscount > 0 && moratoriumdate && interestmode) {
        this._moratoriumsevices.UpdatemoratoriuminstalmentsData(applicationid, moratoriumdate, moratoriummonthscount, interestmode).subscribe(json => {
          debugger
        });
      }
    } catch (error) {
      this._commonService.showErrorMessage(error);
    }

  }

  //<!--Installments Chart Generate-->
  public GetEmiChartReportbyid() {
    //this.loading = true;
    if (this.loanreceiptAppliactionId) {
      this._DisbusementService.GetEmiChartReport(this.loanreceiptAppliactionId).subscribe(res => {
        this.EmichartData = res;
        this.GridData = this.EmichartData.pEmichartlist;
        this.TotalInterest = this.GridData.reduce((sum, item) => sum + item.pInstalmentinterest, 0);
        this.Totalprinciple = this.GridData.reduce((sum, item) => sum + item.pInstalmentprinciple, 0);
        this.Totalinstallmentmount = this.GridData.reduce((sum, item) => sum + item.pInstalmentamount, 0);
        this.loading = false;
        $('#emiModal').modal('show')
      },
        (error) => {
          this.loading = false;
          this.showErrorMessage(error);
        });
    } else {
      this.loading = false;
      this._commonService.showWarningMessage('Please Select Loan Application No...')
    }
  }

}
