import { Component, OnInit, Output, EventEmitter, NgZone, DebugElement, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm, FormArray } from '@angular/forms';
import { LoansmasterService } from 'src/app/Services/Loans/Masters/loansmaster.service';
import { CommonService } from '../../../../Services/common.service'
import { FIIndividualService } from '../../../../Services/Loans//Transactions/fiindividual.service'
import { ChargemasterService } from '../../../../Services/Loans/Masters/chargemaster.service';
import { DatePipe } from '@angular/common';
import { State } from '@progress/kendo-data-query';
import { SelectableSettings } from '@progress/kendo-angular-grid';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { BsDatepickerConfig } from 'ngx-bootstrap';
declare let $: any;
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { Router, Route, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-fi-loandetails',
  templateUrl: './fi-loandetails.component.html',
  styles: [],
  providers: [DatePipe]
})
export class FiLoandetailsComponent implements OnInit {

  @Output() loanDetails = new EventEmitter();
  @Output() forCoapplicantAndGuarantersDataEmit = new EventEmitter();
  @Output() forGettingContactDataEmit = new EventEmitter();

  @Input() forClearButton: boolean;
  _FirstInformationTabsData: any = [];

  @Input()
  set FirstInformationTabsData(FirstInformationTabsData: any) {
    this._FirstInformationTabsData = FirstInformationTabsData;
  }
  forThirdrdTabBackButton: boolean = false;
  validateIntervalFlag: boolean = true;
  nextStepValidateBoolean: boolean = false;
  amountRequestedFlag: boolean = false;
  interestFlag: boolean = false;
  Disablemitype: boolean = false;
  amountCheckFlag: boolean = false;
  tensureFlag: boolean = false;
  openPartPrincipalText: boolean = false;
  schemedisable: Boolean
  disabletransactiondate: boolean;
  schemeFlag: Boolean = false;
  public isLoading: boolean = false;
  forSavingFlag: boolean = true;
  loading: boolean = false;
  pIsschemesapplicableFlag: Boolean = false;
  emiFlag: Boolean = false;
  hideCalculateEmiButton: Boolean = false;
  maxinterestRate:any;
  mininterestRate:any;
  pLoaninstalmentpaymentmode: any;
  selectedLoanInstallmentMode: any;
  enteredAmountRequestedValue: any;
  SchemeNamesData: any;
  loadPayIn: any;
  LoanDetailsErrorMessages: any;
  minValue: any;
  maxValue: any;
  SchemeNamesList: any;
  LoanidforSchems: any;
  pContactType: any;
  pApplicantType: any;
  emiAggregates: any;
  editSchemeCode: any = '';
  LoanInterestratetypes: any;
  Loanpayins: any;
  vchApplicationId: any;
  interestType: any;
  LoanInstllmentModes: any;
  IntrestRatesList: any;
  Tab1dataToSave: any;
  Loanid: any;
  Contacttype: any;
  Applicanttype: any;
  TabsDataToSave: any
  firstinformationDTO: any
  fiEmiSchesuleview: any;
  Loanpayin;
  installmentAmount: any = ' ';

  FiLoanDetailsForm: FormGroup;

  bsValue = new Date();
  maxDate = new Date();

  dropdoenTabname: string;
  buttonName = "Save & Continue";
  dateFormat = 'dd/MM/yyyy';

  schemeid: number = 0;
  forDatePickerCount: number = 0;

  modalData = [];
  currencyFormatModalData = [];
  public state: State = {
    sort: [],
    skip: 0,
    take: 10
  };
  total = 'Total';
  public gridView: any = [];
  public pageSize = 10;
  public skip = 0;
  public selectableSettings: SelectableSettings;

  public pDateOfApplicationConf: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public LoanType: any;
  public FdRdTabData: any = [];
  public FDRdDetailsView: boolean = false;
  allRowsSelected: boolean = false;
  peligibleamount: number = 0;
  constructor(private zone: NgZone,
    private _ChargemasterService: ChargemasterService,
    private datePipe: DatePipe,
    private _FIIndividualService: FIIndividualService,
    private fb: FormBuilder,
    private _loanmasterservice: LoansmasterService
    , private _commonService: CommonService, private router:Router, private route:ActivatedRoute) {

    window['CallingFunctionOutsideContact'] = {
      zone: this.zone,
      componentFn: (value) => this.schemeDetails(value),
      component: this,
    };
    this.pDateOfApplicationConf.containerClass = 'theme-dark-blue';
    this.pDateOfApplicationConf.showWeekNumbers = false;
    this.pDateOfApplicationConf.maxDate = new Date();
    this.pDateOfApplicationConf.dateInputFormat = 'DD/MM/YYYY'
  }

  ngOnInit() {
    // this.LoanType='';
    // this.FDRdDetailsView = false;
    this.peligibleamount=0;
    this.allRowsSelected = false;
    this.forDatePickerCount = 0;
    this.forSavingFlag = true;
    if (this._commonService.comapnydetails != null)
      this.disabletransactiondate = this._commonService.comapnydetails.pdatepickerenablestatus;

    this.emiAggregates = {};
    this.loadPayIn = '';
    this.interestType = '';
    this.maxinterestRate=0;
    this.mininterestRate=0;
    this.enteredAmountRequestedValue = 0;
    this.schemeid = 0;
    this.schemedisable = false
    this.LoanDetailsErrorMessages = {}

    this.FiLoanDetailsForm = this.fb.group({
      pDateofapplication: [new Date(), Validators.required],
      pAmountrequested: ['', Validators.required],
      pPurposeofloan: [''],
      pInteresttype: ['', Validators.required],
      pLoanpayin: ['', Validators.required],
      pTenureofloan: ['', Validators.required],
      pTenuretype: [''],
      pRateofinterest: ['', Validators.required],
      pemitype: [''],
      emitype: ['REGULAR'],
      pIsschemesapplicable: [false],
      pLoaninstalmentpaymentmode: ['', Validators.required],
      pLoaninstalmentpaymentmodecode: [''],
      pSchemename: [''],
      pSchemecode: [''],
      pInstalmentamount: [{ value: '', disabled: true }],
      ptypeofoperation: ['CREATE'],
      pPartprinciplepaidinterval: [''],
      pCreatedby: [this._commonService.pCreatedby]
    })

    this.LoanInstllmentModes = [];
    this.IntrestRatesList = [];

    this.BlurEventAllControll(this.FiLoanDetailsForm);
    this.FiLoanDetailsForm.controls.pIsschemesapplicable.setValue(false)
    this.GetFITabFdRdDetails();
    
    this._commonService._GetFiTab1Data().subscribe(res => {
      debugger
      if (res != null && res != undefined) {
        this.Tab1dataToSave = res;
        this.vchApplicationId = this.Tab1dataToSave.pVchapplicationid;
        this.LoanType = this.Tab1dataToSave.pLoantype;
        if (this.LoanType == 'Loan Against Deposits' && (this.Tab1dataToSave.pLoanname== "Fd Loan" || this.Tab1dataToSave.pLoanname== "Rd Loan")) {
          this.FDRdDetailsView = true;
          if (this.route.snapshot.params['id']) {
            this._FIIndividualService.GetFITabFdRdEditDetails(res.pVchapplicationid, res.pLoanname).subscribe((resposne: any) => {
              this.FdRdTabData=resposne;
              this.peligibleamount=0;
              for (let index = 0; index < this.FdRdTabData.length; index++) {
                const element = this.FdRdTabData[index].pstatus;
                if (element) {
                  this.peligibleamount += this.FdRdTabData[index].peligibleamount;
                }
                
              }
            });
          }else{
            this.GetFITabFdRdDetails();
          }
        } else {
          this.FDRdDetailsView = false;
          this.allRowsSelected = false;
          this.FdRdTabData = '';
        }
        this.Loanid = this.Tab1dataToSave.pLoanid
        let type = this.Tab1dataToSave.pContacttype
        this.Contacttype = type.toUpperCase()
        this.Applicanttype = this.Tab1dataToSave.pApplicanttype
        this.LoanidforSchems = res.pLoanid;
        this.pContactType = res.pContacttype;
        this.pApplicantType = res.pApplicanttype;
        this.schemeid = 0;
        this.getScheme();
        this.getFiLoanData(this.LoanidforSchems, this.pContactType, this.pApplicantType, this.schemeid, this.loadPayIn);
          // if (this.route.snapshot.params['id']) {
       this.getInterestRatesEdit();
     //}
      }
    });
   
  }
  GetFITabFdRdDetails() {
    this._FIIndividualService._GetFITabFdRdDetails().subscribe((data: any) => {
      this.FdRdTabData = data.tabdata;
      this.FdRdTabData.filter(function (df) { df.pstatus = false; });
    });
  }
  selectAll(event, row, rowIndex) {
    debugger
    this.peligibleamount = 0;
    if (this.route.snapshot.params['id']) {

    }else{


    }
    if (event.target.checked) {
      this.allRowsSelected = true;
      this.FdRdTabData.filter(x => x.pstatus = true);
      this.FdRdTabData.forEach((item) => {
        this.peligibleamount += this._commonService.removeCommasForEntredNumber(item.peligibleamount);
      });
      if (isNaN(this.peligibleamount))
        this.peligibleamount = 0;
    }
    else {
      this.allRowsSelected = false;
      this.FdRdTabData.filter(x => x.pstatus = false);
      this.peligibleamount = 0;
    }
  }
  SelectIndividualElegibleAmount(event, dataItem, rowIndex) {
    debugger;
    if (event.target.checked) {
      this.FdRdTabData[rowIndex].pstatus = true;
      this.peligibleamount += this.FdRdTabData[rowIndex].peligibleamount;
    }
    else {
      this.FdRdTabData[rowIndex].pstatus = false;
      this.peligibleamount -= this.FdRdTabData[rowIndex].peligibleamount;
    }
  }

  /** ----------(Start) for getting Loan pay-ins and Interest rate types----(Start)-------------------- */
  getFiLoanData(LoanidforSchems, pContactType, pApplicantType, schemeid, loanpayin) {
    this._FIIndividualService.getLoanpayins(LoanidforSchems, pContactType, pApplicantType, schemeid).subscribe(payins => {
      if (payins != null) {
        this.Loanpayins = payins
      }
    });
    this._FIIndividualService.getLoanInterestTypes(this.LoanidforSchems, schemeid, pContactType, pApplicantType, loanpayin).subscribe(interestRates => {
      if (interestRates != null) {
        this.LoanInterestratetypes = interestRates;
      }
    });
  }
  /** ----------(End) for getting Loan pay-ins and Interest rate types----(End)-------------------- */

  /** -------(Start)---- For showing data in kendo grid data for Schemes------- (Start)-------- */
  getSchemeDropDownDataTable(SchemeData) {
    if (SchemeData.length != 0) {
      $("#SchemeDataList").kendoMultiColumnComboBox({
        dataTextField: "pSchemecode",
        dataValueField: "pSchemename",
        height: 400,
        columns: [
          {
            field: "pSchemecode", title: "Scheme Code", width: 200
          },
          { field: "pSchemename", title: "Scheme Name", width: 200 },

        ],
        footerTemplate: 'Total #: instance.dataSource.total() # items found',
        filter: "contains",
        filterFields: ["pSchemecode", "pSchemename"],
        dataSource: SchemeData,
        select: this.selectallSchemeNames,
      });
    }
  }
  /** -------(End)---- For showing data in kendo grid data for Schemes------- (End)-------- */

  /** ------ (Start)---------- For scheme details binding------- (Start)--------------
   * -------> In this method, componentFn() will call below schemeDetails().
   */
  selectallSchemeNames(e) {
    if (e.dataItem) {
      var dataItem = e.dataItem;
      window['CallingFunctionOutsideContact'].componentFn(dataItem)
    }
  }
  /** ---------(End)------- For scheme details binding-------- (End)-------------- */

  /**
   * ------- (Start)---- For Scheme details kendo grid------ (Start)--------------
   * -------> On changing scheme we are calling Loan Pay-in's, Interest Rates, Interest Types API
   */
  schemeDetails(data) {
    let a = data;
    this.FiLoanDetailsForm.patchValue({
      pSchemename: data.pSchemename,
      pSchemecode: data.pSchemecode
    })
    this.schemeid = data.pschemeid;
    if (this.schemeid) {
      this.getFiLoanData(this.LoanidforSchems, this.pContactType, this.pApplicantType, this.schemeid, this.loadPayIn);
      this.getInterestRates();
    }
    if (this.FiLoanDetailsForm.value.pSchemecode &&
      this.FiLoanDetailsForm.value.pSchemename) {
      this.LoanDetailsErrorMessages.pSchemecode = '';
    }
    else {
      this.LoanDetailsErrorMessages.pSchemecode = 'Scheme required';
    }
  }
  /** ------- (End)---- For Scheme details kendo grid------ (End)-------------- */

  getTab1Data() {
    return this.Tab1dataToSave;
  }

  /**
   *  ---- (Start)--------- Saving 2nd Tab Data-------------------(Start)-----------
   *  ----> Here, First we are hitting get EMI chart API for Loan Installment Amount, then after we are
   *       saving 2nd tab data. Because if user without clicking on Calculate EMI button, that time also 
   *       we have to send Loan Installment Amount. So that's why we are hitting EMI chart API.
   */
  nextButtonClick() {
    debugger;
    let saveBoolean: boolean = false;
    let isValid = true;
    let data = this.FiLoanDetailsForm.value;
    if (this.FiLoanDetailsForm.controls['pAmountrequested'].value) {
      this.forSavingFlag = false;
      this.onEnteredAmountValue(null);
    }
     if (this.FiLoanDetailsForm.controls['pRateofinterest'].value) {
      this.onChangeInterestRate(null);
    }
    if (this.checkValidations(this.FiLoanDetailsForm, isValid)) {
      if (this.interestFlag && this.amountRequestedFlag && this.tensureFlag) {
        if (this.nextStepValidateBoolean == true) {
          this.FiLoanDetailsForm.controls['pTenuretype'].setValue(this.FiLoanDetailsForm.controls['pLoanpayin'].value);
          let emitype = this.FiLoanDetailsForm.controls.emitype.value;
          this.FiLoanDetailsForm.controls.pemitype.setValue(emitype);
          let loanamount = ((this.FiLoanDetailsForm.controls['pAmountrequested'].value).toString()).replace(/,/g, "");
          loanamount = parseFloat(loanamount)
          if (this.LoanType == 'Loan Against Deposits' && (this.Tab1dataToSave.pLoanname== "Fd Loan" || this.Tab1dataToSave.pLoanname== "Rd Loan")) {
            var filterFdRdTabData = [];
            if (this.FdRdTabData.length > 0) {
              debugger;
              filterFdRdTabData = this.FdRdTabData.filter(function (data) {
                return data.pstatus == true;
              });
              filterFdRdTabData.forEach((item) => {
                item.pcreatedby = this._commonService.pCreatedby;
                item.pcreateddate = new Date().toISOString();
                item.pStatusid = 1;
                item.pmaturitydate = item.pmaturitydate.split("/").reverse().join("/");
                item.pdepositdate = item.pdepositdate.split("/").reverse().join("/");
                item.ptransdate = item.ptransdate.split("/").reverse().join("/");
              });
              //filterFdRdTabData = filterFdRdTabData.map(({ paccountid, pconfigid, ptransdate, pmaturityamount, pdepositdate, pstatus, ...rest }) => ({ ...rest }));
            }
            if (filterFdRdTabData.length == 0) {
              this._commonService.showWarningMessage('Select Atleast one  from eligible amount from grid...');
              return;
            }
            if (loanamount > this.peligibleamount) {
              this._commonService.showWarningMessage('Eligble Amount must be less than  loan amount...');
              return;
            }
            if(this.peligibleamount<this.minValue){
              this._commonService.showWarningMessage('Amount should be greater than eligible amount');
              return;
            }
            if(this.peligibleamount>this.maxValue){
              this._commonService.showWarningMessage('Amount should be greater than eligible amount');
              return;
            }
          }
          let interesttype = this.FiLoanDetailsForm.controls['pInteresttype'].value;
          let loanpayin = this.FiLoanDetailsForm.controls['pLoanpayin'].value;
          let interestrate = this.FiLoanDetailsForm.controls['pRateofinterest'].value;
          let tenureofloan = this.FiLoanDetailsForm.controls['pTenureofloan'].value;
          for (let i = 0; i < this.LoanInstllmentModes.length; i++) {
            if (this.FiLoanDetailsForm.value.pLoaninstalmentpaymentmodecode == this.LoanInstllmentModes[i].pLoaninstalmentpaymentmodecode) {
              this.pLoaninstalmentpaymentmode = this.LoanInstllmentModes[i].pLoaninstalmentpaymentmode;
              break;
            }
          }
          let Loaninstalmentmode = this.pLoaninstalmentpaymentmode;
          let emiprincipalpayinterval: any;
          let forSaveFlag = true;
          if (this.selectedLoanInstallmentMode == 'PP') {
            emiprincipalpayinterval = Number(this.FiLoanDetailsForm.controls['pPartprinciplepaidinterval'].value);
            if (emiprincipalpayinterval == 0) {
              forSaveFlag = false;
            }
            else {
              forSaveFlag = true;
            }
          }
          else {
            emiprincipalpayinterval = 0;
            forSaveFlag = true;
          }
          this.buttonName = "Processing";
          this.isLoading = true;
          if (forSaveFlag == true) {
            this.validateIntervalFlag = true;
            this.LoanDetailsErrorMessages.pPartprinciplepaidinterval = '';
            let emitype=this.FiLoanDetailsForm.controls['emitype'].value;
            this._FIIndividualService.getFiEmiSchesuleview(Number(loanamount), interesttype, loanpayin, Number(interestrate), Number(tenureofloan), Loaninstalmentmode, emiprincipalpayinterval,emitype).subscribe(response => {
              if (response != null) {
                this.buttonName = "Save & Continue";
                this.isLoading = false;
                this.fiEmiSchesuleview = response;
                if (this.fiEmiSchesuleview.lstInstalmentsgenerationDTO.length > 0) {
                  let pInstalmentamounts = [];
                  this.fiEmiSchesuleview.lstInstalmentsgenerationDTO.forEach(element => {
                    pInstalmentamounts.push(Number(element.pInstalmentamount));
                  });
                  this.installmentAmount = pInstalmentamounts.length ? this._commonService.currencyformat(Math.max(...pInstalmentamounts)) : 0;
                  if (this.installmentAmount) {
                    this.FiLoanDetailsForm.controls.pInstalmentamount.setValue(this.installmentAmount);
                  }
                }

                if (this.FiLoanDetailsForm.controls.pAmountrequested.value.toString().includes(',')) {
                  this.FiLoanDetailsForm.controls.pAmountrequested.setValue(this._commonService.functiontoRemoveCommas(this.FiLoanDetailsForm.controls.pAmountrequested.value))
                }
                this.FiLoanDetailsForm.value.pInstalmentamount = Number(((this.installmentAmount).toString()).replace(/,/g, ""));
                for (let i = 0; i < this.LoanInstllmentModes.length; i++) {
                  if (this.FiLoanDetailsForm.value.pLoaninstalmentpaymentmodecode == this.LoanInstllmentModes[i].pLoaninstalmentpaymentmodecode) {
                    this.FiLoanDetailsForm.value.pLoaninstalmentpaymentmode = this.LoanInstllmentModes[i].pLoaninstalmentpaymentmode;
                    break;
                  }
                }
                this.FiLoanDetailsForm.value.pPartprinciplepaidinterval = this.FiLoanDetailsForm.value.pPartprinciplepaidinterval ? Number(this.FiLoanDetailsForm.value.pPartprinciplepaidinterval) : 0;
                let Tab1data = this.getTab1Data();

                if (Number(this.FiLoanDetailsForm.value.pAmountrequested) > 0 &&
                  Number(this.FiLoanDetailsForm.value.pTenureofloan) > 0 &&
                  Number(this.FiLoanDetailsForm.value.pRateofinterest) > 0) {
                  saveBoolean = true;
                }
                else {
                  saveBoolean = false;
                }
                this.FiLoanDetailsForm.value.ptypeofoperation = this.forThirdrdTabBackButton ? 'UPDATE' : 'CREATE';
                let totalLoanDetailsData = Object.assign(Tab1data, this.FiLoanDetailsForm.value);
                delete totalLoanDetailsData.pBusinessEntitycontactNo;
                delete totalLoanDetailsData.pLoaninstalmentpaymentmodecode;
                let data = { "firstinformationDTO": totalLoanDetailsData, "lstFITabFdRdDetailsDTO": filterFdRdTabData };
                if (this.validateIntervalFlag == true) {
                  if (saveBoolean) {
                    data.firstinformationDTO.pDateofapplication = new Date(Date.UTC(data.firstinformationDTO.pDateofapplication.getFullYear(), data.firstinformationDTO.pDateofapplication.getMonth(), data.firstinformationDTO.pDateofapplication.getDate(), data.firstinformationDTO.pDateofapplication.getHours(), data.firstinformationDTO.pDateofapplication.getMinutes()))
                    this.buttonName = "Processing";
                    this.isLoading = true;
                    let datas = JSON.stringify(data);
                    this._FIIndividualService.SaveFiTabDetails(data).subscribe(result => {
                      debugger
                      this.forDatePickerCount = 0;
                      this.forSavingFlag = true;

                      if (result) {
                        this.buttonName = "Save & Continue";
                        this.isLoading = false;
                        this.Tab1dataToSave.pVchapplicationid = result[0];
                        this._commonService.SetFiTab1Data(this.Tab1dataToSave);
                        this._commonService._SetFiTab1Data(this.Tab1dataToSave);
                        let str;
                        let temptabname;
                        this.dropdoenTabname = this._commonService.GetFiTabName();
                        let tempFirstInformationTabsData = this._FirstInformationTabsData;
                        let data = this._FIIndividualService.moevToNextTab(tempFirstInformationTabsData, this.dropdoenTabname);
                        str = data.tabId;
                        temptabname = data.tabName;
                        if(str=='' && temptabname==''){
                          this.buttonName = "Submit";
                          this.isLoading = false;
                          this._commonService.showInfoMessage('Saved successfully');
                          this.router.navigateByUrl('/FiView');
                          return
                        }
                        this._commonService.SetFiTabName(temptabname);
                          // let str = "applicants-others"
                          // this.dropdoenTabname = "Applicants and Others";
                          this.dropdoenTabname = temptabname;
                          $('.nav-item a[href="#' + str + '"]').tab('show').addClass('active show');
                        // let str = "applicants-others"
                        // this.dropdoenTabname = "Applicants and Others";
                        // $('.nav-item a[href="#' + str + '"]').tab('show');
                        if (result[0]) {
                          let data = {
                            event: true,
                            forEditFirstTabEdit: false
                          }
                          /**----(Start)--- This event emitter is for getting 3rd tab data----(Start)----- */
                          // this.forCoapplicantAndGuarantersDataEmit.emit(data);
                          /**----(End)--- This event emitter is for getting 3rd tab data----(End)----- */
                        }
                      }
                      else {
                        this.buttonName = "Save & Continue";
                        this.isLoading = false;
                      }
                    }, (error) => {
                      this.buttonName = "Save & Continue";
                      this.forDatePickerCount = 0;
                      this.isLoading = false;
                    })
                    this.FiLoanDetailsForm.controls['pAmountrequested'].clearValidators()
                    this.FiLoanDetailsForm.controls['pAmountrequested'].updateValueAndValidity();
                    this.LoanDetailsErrorMessages.pAmountrequested = '';
                    this.loanDetails.emit(this.FiLoanDetailsForm.value);

                  }
                }
                else {
                  this.LoanDetailsErrorMessages.pPartprinciplepaidinterval = "Interval should not be greater than Tenure of Loan";
                }
              } else {
                this.buttonName = "Save & Continue";
                this.isLoading = false;
                this._commonService.showErrorMessage('No data Foound');
              }
            }, (error) => {
              this.buttonName = "Save & Continue";
              this.isLoading = false;
            })
          }
          else {
            this.LoanDetailsErrorMessages.pPartprinciplepaidinterval = 'Interval should be greater than zero';
            this.validateIntervalFlag = false;
          }
        }
        else {
          this.FiLoanDetailsForm.controls['pAmountrequested'].setValidators([Validators.required])
          this.FiLoanDetailsForm.controls['pAmountrequested'].updateValueAndValidity();
          this.LoanDetailsErrorMessages.pAmountrequested = "Amount should be in between " + this._commonService.currencyformat(this.minValue) + ' and ' + this._commonService.currencyformat(this.maxValue);
        }
      }
      else {
        if (this.tensureFlag == false) {
          this.LoanDetailsErrorMessages.pTenureofloan = 'Please enter valid Tenure of Loan';
        }
        if (this.amountRequestedFlag == false) {
          this.LoanDetailsErrorMessages.pAmountrequested = 'Please enter valid Amount Requested';
        }
        if (this.interestFlag == false) {
          this.LoanDetailsErrorMessages.pRateofinterest = 'Please enter valid Interest Rate';
        }
      }
    }
  }
  /** ---- (End)--------- Saving 2nd Tab Data-------------------(End)----------- */

  /**
   *  ------- (Start)--- For getting Schemes List------ (Start)----------
   */
  getScheme() {
    this._FIIndividualService.GetSchemeNames(this.LoanidforSchems).subscribe(schemenames => {
      if (schemenames) {
        this.SchemeNamesList = schemenames;
        if (this.SchemeNamesList.length == 0) {
          this.schemeFlag = true;
        } else {
          this.getSchemeDropDownDataTable(this.SchemeNamesList)
        }
      }
    });
  }
  /** ------- (End)--- For getting Schemes List------ (End)---------- */

  /** 
   * ------ (Start)----- Change event for Scheme selection-----------(Start)----------
   */
  CheckScheme(data) {

    if (data.currentTarget.checked == true) {
      this.getScheme();
      this.schemedisable = true
      this.FiLoanDetailsForm.controls.pIsschemesapplicable.setValue(true)
      this.FiLoanDetailsForm.controls.pSchemecode.setValidators([Validators.required])
      this.FiLoanDetailsForm.controls.pSchemecode.updateValueAndValidity()
    } else {
      this.schemeid = 0;
      this.getFiLoanData(this.LoanidforSchems, this.pContactType, this.pApplicantType, this.schemeid, this.loadPayIn);
      this.schemedisable = false
      if (this.FiLoanDetailsForm.controls.pSchemecode.value && this.FiLoanDetailsForm.controls.pSchemename.value) {
        this.FiLoanDetailsForm.patchValue({
          pSchemename: '',
          pSchemecode: ''
        });
      }
      this.FiLoanDetailsForm.controls.pIsschemesapplicable.setValue(false)
      this.FiLoanDetailsForm.controls.pSchemecode.clearValidators()
      this.FiLoanDetailsForm.controls.pSchemecode.updateValueAndValidity()
      this.LoanDetailsErrorMessages.pSchemecode = '';
    }
  }
  /**------ (End)----- Change event for Scheme selection-----------(End)---------- */

  /**
   * ------ (Start)----- Change event for Installment modes---------(Start)---------
   */
  ChangeInstallmentMode(event) {
    let selectedLoanInstallmentMode = event.target.value;
    this.selectedLoanInstallmentMode = event.target.value;
    this.FiLoanDetailsForm.patchValue({
      pLoaninstalmentpaymentmodecode: event.target.value
    })
    this.hideCalculateEmiButton = false;
    if (this.FiLoanDetailsForm.controls['pInteresttype'].value.toUpperCase() == 'DIMINISHING' &&
      this.FiLoanDetailsForm.value.pLoaninstalmentpaymentmodecode == 'OI') {
      this.hideCalculateEmiButton = true;
    }
    if (selectedLoanInstallmentMode == 'PP') {
      this.openPartPrincipalText = true;
      this.FiLoanDetailsForm.patchValue({
        pPartprinciplepaidinterval: ''
      })
      this.FiLoanDetailsForm.controls.pPartprinciplepaidinterval.setValidators([Validators.required]);
      this.FiLoanDetailsForm.controls.pPartprinciplepaidinterval.updateValueAndValidity()
      this.BlurEventAllControll(this.FiLoanDetailsForm);
    }
    else {
      this.FiLoanDetailsForm.controls.pPartprinciplepaidinterval.clearValidators();
      this.FiLoanDetailsForm.controls.pPartprinciplepaidinterval.updateValueAndValidity()
      this.BlurEventAllControll(this.FiLoanDetailsForm);
      this.openPartPrincipalText = false;
      this.validateIntervalFlag = true;
    }
    for (let i = 0; i < this.LoanInstllmentModes.length; i++) {
      if (this.FiLoanDetailsForm.value.pLoaninstalmentpaymentmodecode == this.LoanInstllmentModes[i].pLoaninstalmentpaymentmodecode) {
        this.pLoaninstalmentpaymentmode = this.LoanInstllmentModes[i].pLoaninstalmentpaymentmode;
        break;
      }
    }
    if (this.FiLoanDetailsForm.value.pPartprinciplepaidinterval) {
      this.FiLoanDetailsForm.controls.pPartprinciplepaidinterval.setValue('');
      this.LoanDetailsErrorMessages.pPartprinciplepaidinterval = '';
    }
    if (this.installmentAmount) {
      this.installmentAmount = 0;
    }
  }
  /** ------ (End)----- Change event for Installment modes---------(End)--------- */

  /**------ (Start)--- Change event for Loan Pay-in ----- (Start)-------------
   * -------> This is very important method. Here many API we have to call
   * -------> Here onEnteredAmount() method we are calling two times, with data and without data.
   *         Because user will enter data directly in Amount Requested, without selecting 
   *         Loan pay-in. That's why we called two times. There is no problem with two times, because
   *         in that method we are checking. If we have amount requested, then only we are htting to API. 
   */
  changeLoanPayIn(event) {
    let payin = event.currentTarget.value;
    this.interestType = '';
    this.interestFlag = false;
    this.Disablemitype = false;
    if (this.FiLoanDetailsForm.value.pInteresttype) {
      this.FiLoanDetailsForm.patchValue({
        pInteresttype: '',
      })
      this.LoanDetailsErrorMessages.pInteresttype = 'Interest Type required';
    }
    // if(this.enteredAmountRequestedValue) {
    this.enteredAmountRequestedValue = null;
    // }
    if (this.FiLoanDetailsForm.value.pAmountrequested) {
      this.FiLoanDetailsForm.patchValue({
        pAmountrequested: '',
      })
      this.LoanDetailsErrorMessages.pAmountrequested = 'Amount Requested required';
    }
    this.amountRequestedFlag = false;
    if (this.FiLoanDetailsForm.value.pTenureofloan) {
      this.FiLoanDetailsForm.patchValue({
        pTenureofloan: '',
      })
      this.LoanDetailsErrorMessages.pTenureofloan = 'Tenure of Loan required';
    }
    if (this.FiLoanDetailsForm.value.pLoaninstalmentpaymentmode) {
      this.FiLoanDetailsForm.patchValue({
        pLoaninstalmentpaymentmode: '',
      })
      this.LoanDetailsErrorMessages.pLoaninstalmentpaymentmode = 'Loan Installment Mode required';
    }
    if (this.FiLoanDetailsForm.value.pRateofinterest) {
      this.FiLoanDetailsForm.patchValue({
        pRateofinterest: '',
      })
      this.LoanDetailsErrorMessages.pRateofinterest = 'Interest Rate required';
    }
    this.hideCalculateEmiButton = false;

    if (this.FiLoanDetailsForm.value.pInteresttype
      && this.FiLoanDetailsForm.controls.pAmountrequested.value
      && this.FiLoanDetailsForm.value.pTenureofloan
      && this.FiLoanDetailsForm.value.pRateofinterest) {
      this.onChangeInterestType(this.FiLoanDetailsForm.value.pInteresttype);
      this.onEnteredAmountValue(this.FiLoanDetailsForm.controls.pAmountrequested.value);
      this.onTensureOfLoanChange(this.FiLoanDetailsForm.value.pTenureofloan);
      this.onChangeInterestRate(this.FiLoanDetailsForm.value.pRateofinterest);
    }
    if(payin=='Weekly'){
      this.Disablemitype=true;
      this.FiLoanDetailsForm.controls.emitype.setValue('REGULAR');
    }else{

      this.Disablemitype=false;
    }
    this.loadPayIn = payin;
    this._FIIndividualService.getLoanInterestTypes(this.LoanidforSchems, this.schemeid, this.pContactType, this.pApplicantType, this.loadPayIn).subscribe(interestRates => {
      if (interestRates != null) {
        this.LoanInterestratetypes = interestRates;

      }
    });
    this.getInterestRates();
    this.getLoanInstallmentModes((this.loadPayIn ? this.loadPayIn : ''), (this.interestType ? this.interestType : ''));
    this.openPartPrincipalText = false;
    this.validateIntervalFlag = true;
    // this.onEnteredAmountValue(null);
  }
  /**------ (End)--- Change event for Loan Pay-in ----- (End)------------- */

  checkValidations(group: FormGroup, isValid: boolean): boolean {
    try {
      Object.keys(group.controls).forEach((key: string) => {
        isValid = this.GetValidationByControl(group, key, isValid);
      })
    }
    catch (e) {

      this.showErrorMessage(e);
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
          this.LoanDetailsErrorMessages[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.LoanDetailsErrorMessages[key] += errormessage + ' ';
                isValid = false;
              }
            }
          }
        }
      }
    }
    catch (e) {
      // this.showErrorMessage(e);
      return false;
    }
    return isValid;
  }

  showErrorMessage(errormsg: string) {
    this._commonService.showErrorMessage(errormsg);
  }

  BlurEventAllControll(fromgroup: FormGroup) {
    try {
      Object.keys(fromgroup.controls).forEach((key: string) => {
        this.setBlurEvent(fromgroup, key);
      })
    }
    catch (e) {
      this.showErrorMessage(e);
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
      this.showErrorMessage(e);
      return false;
    }
  }

  /** -------(Start)------- For getting EMI chart data from API-------------(Start)----- */
  getFiEmiSchesuleview() {
    if (this.FiLoanDetailsForm.controls['pAmountrequested'].value && this.amountCheckFlag == false) {
      this.onEnteredAmountValue(null);
    }

    this.gridView = [];
    let isValid = true;
    if (this.validateIntervalFlag == true) {
      if (this.checkValidations(this.FiLoanDetailsForm, isValid)) {
        if (this.amountCheckFlag) {
          if (this.tensureFlag && this.amountRequestedFlag && this.interestFlag) {

            if (this.nextStepValidateBoolean == true) {
              let loanamount = ((this.FiLoanDetailsForm.controls['pAmountrequested'].value).toString()).replace(/,/g, "");
              let interesttype = this.FiLoanDetailsForm.controls['pInteresttype'].value;
              let loanpayin = this.FiLoanDetailsForm.controls['pLoanpayin'].value;
              let interestrate = this.FiLoanDetailsForm.controls['pRateofinterest'].value;
              let tenureofloan = this.FiLoanDetailsForm.controls['pTenureofloan'].value;
              for (let i = 0; i < this.LoanInstllmentModes.length; i++) {
                if (this.FiLoanDetailsForm.value.pLoaninstalmentpaymentmodecode == this.LoanInstllmentModes[i].pLoaninstalmentpaymentmodecode) {
                  this.pLoaninstalmentpaymentmode = this.LoanInstllmentModes[i].pLoaninstalmentpaymentmode;
                  break;
                }
              }
              let Loaninstalmentmode = this.pLoaninstalmentpaymentmode;
              let emiprincipalpayinterval: any;
              if (this.selectedLoanInstallmentMode == 'PP') {
                emiprincipalpayinterval = Number(this.FiLoanDetailsForm.controls['pPartprinciplepaidinterval'].value);
              }
              else {
                emiprincipalpayinterval = 0;
              }
              this.emiFlag = true;
              this.buttonName = "Processing";
              this.isLoading = true;
              let emitype=this.FiLoanDetailsForm.controls['emitype'].value;
              this._FIIndividualService.getFiEmiSchesuleview(Number(loanamount), interesttype, loanpayin, Number(interestrate), Number(tenureofloan), Loaninstalmentmode,emiprincipalpayinterval, emitype).subscribe(response => {
                if (response != null) {
                  this.buttonName = "Save & Continue";
                  this.isLoading = false;
                  this.fiEmiSchesuleview = response;
                  this.modalData = this.fiEmiSchesuleview.lstInstalmentsgenerationDTO;
                  this.calculateAggregat(this.modalData);
                  this.loadEmiDatas();
                  if (this.fiEmiSchesuleview.lstInstalmentsgenerationDTO.length > 0) {
                    let pInstalmentamounts = [];
                    this.fiEmiSchesuleview.lstInstalmentsgenerationDTO.forEach(element => {
                      pInstalmentamounts.push(Number(element.pInstalmentamount));
                    });
                    this.installmentAmount = pInstalmentamounts.length ? this._commonService.currencyformat(Math.max(...pInstalmentamounts)) : 0;
                    if (this.installmentAmount) {
                      this.FiLoanDetailsForm.controls.pInstalmentamount.setValue(this.installmentAmount);
                    }
                  }
                } else {
                  this.buttonName = "Save & Continue";
                  this.isLoading = false;
                  this._commonService.showErrorMessage('No data Foound');
                }
              }, (error) => {
                this.buttonName = "Save & Continue";
                this.isLoading = false;
              })
            }
            else {
              this.FiLoanDetailsForm.controls['pAmountrequested'].setValidators([Validators.required])
              this.FiLoanDetailsForm.controls['pAmountrequested'].updateValueAndValidity();
              this.LoanDetailsErrorMessages.pAmountrequested = "Amount should be in between " + this._commonService.currencyformat(this.minValue) + ' and ' + this._commonService.currencyformat(this.maxValue);
            }
          }
          else {
            this.emiFlag = false;
            if (this.tensureFlag == false) {
              this.LoanDetailsErrorMessages.pTenureofloan = 'Please enter valid Tenure of Loan';
            }
            if (this.amountRequestedFlag == false) {
              this.LoanDetailsErrorMessages.pAmountrequested = 'Please enter valid Amount Requested';
            }
            if (this.interestFlag == false) {
              this.LoanDetailsErrorMessages.pRateofinterest = 'Please enter valid Interest Rate';
            }
          }
        }
        else {
          this.emiFlag = false;
          this.LoanDetailsErrorMessages.pAmountrequested = "Amount should be in between " + this._commonService.currencyformat(this.minValue) + ' and ' + this._commonService.currencyformat(this.maxValue)
        }
      }
      else {
        if (this.FiLoanDetailsForm.value.pAmountrequested == '' ||
          this.FiLoanDetailsForm.value.pAmountrequested == null) {
          this.LoanDetailsErrorMessages.pAmountrequested = 'Amount Requested required';
          this.amountRequestedFlag = false;
        }
        if (this.FiLoanDetailsForm.value.pRateofinterest == '' ||
          this.FiLoanDetailsForm.value.pRateofinterest == null) {
          this.LoanDetailsErrorMessages.pRateofinterest = 'Interest Rate required';
          this.interestFlag = false;
        }
        this.emiFlag = false;
      }
    }
  }
  /** -------(End)------- For getting EMI chart data from API-------------(End)----- */

  /**----------(Start)------ Change event for Interest Type-------------(Start)--------------- */
  onChangeInterestType(event) {
    debugger;
    if (this.FiLoanDetailsForm.controls['pLoaninstalmentpaymentmode'].value) {
      this.FiLoanDetailsForm.controls['pLoaninstalmentpaymentmode'].setValue('');
      this.LoanDetailsErrorMessages.pLoaninstalmentpaymentmode = '';
      this.hideCalculateEmiButton = false;
    }
    this.interestType = this.FiLoanDetailsForm.value.pInteresttype;
    this.getInterestRates();
    this.getLoanInstallmentModes((this.loadPayIn ? this.loadPayIn : ''), (this.interestType ? this.interestType : ''));
    this.openPartPrincipalText = false;
    this.validateIntervalFlag = true;
  }
  /**----------(End)------ Change event for Interest Type-------------(End)--------------- */

  /** -----(Start)----- Change Event for Amount Requested-------- (Start)-----------
   *  ----> Here this.forSavingFlag used to restrict to call getInterestRates(). Intially it is true, 
   *      But after clicked on Next or Save button, it will change to false.
   **/
  onEnteredAmountValue(event) {
    debugger
    this.amountCheckFlag = true;
    this.nextStepValidateBoolean = true;
    this.amountRequestedFlag = false;
    if (this.FiLoanDetailsForm.controls.pAmountrequested.value) {
      if (Number(this.FiLoanDetailsForm.controls.pAmountrequested.value.toString().replace(/,/g, "")) == 0) {
        this.amountRequestedFlag = false;
        this.LoanDetailsErrorMessages.pAmountrequested = 'Amount Requested should be greater than zero';
      }
      else {
        this.LoanDetailsErrorMessages.pAmountrequested = '';
        this.amountRequestedFlag = true;
        let validateFlag: boolean = false;
        this._FIIndividualService.getLoanMinAndMaxValues(this.Loanid, this.Contacttype, this.Applicanttype, this.loadPayIn, this.interestType, this.schemeid).subscribe((response: any) => {
          if (response) {
            this.minValue = Number(response[0].pMinloanamount);
            this.maxValue = Number(response[0].pMaxloanamount);
            this.enteredAmountRequestedValue = this._commonService.functiontoRemoveCommas(this.FiLoanDetailsForm.controls.pAmountrequested.value);

            if (this.minValue <= this.enteredAmountRequestedValue && this.enteredAmountRequestedValue <= this.maxValue) {
              if (this.forSavingFlag == true) {
                this.getInterestRates();
              }
              validateFlag = true;
              this.LoanDetailsErrorMessages.pAmountrequested = '';
              this.FiLoanDetailsForm.controls['pAmountrequested'].clearValidators();
              this.FiLoanDetailsForm.controls['pAmountrequested'].updateValueAndValidity();
            }
            else if (this.minValue == 0 && this.maxValue == 0) {
              validateFlag = true;
              if (this.forSavingFlag == true) {
                this.getInterestRates();
              }
              this.LoanDetailsErrorMessages.pAmountrequested = '';
              this.FiLoanDetailsForm.controls['pAmountrequested'].clearValidators();
              this.FiLoanDetailsForm.controls['pAmountrequested'].updateValueAndValidity();
            }
            else {
              validateFlag = false;
              this.FiLoanDetailsForm.controls['pAmountrequested'].setValidators([Validators.required])
              this.FiLoanDetailsForm.controls['pAmountrequested'].updateValueAndValidity();
              this.LoanDetailsErrorMessages.pAmountrequested = "Amount should be in between " + this._commonService.currencyformat(this.minValue) + ' and ' + this._commonService.currencyformat(this.maxValue);
            }
            if (validateFlag == false) {
              this._commonService.showWarningMessage("Amount should be in between " + this._commonService.currencyformat(this.minValue) + ' and ' + this._commonService.currencyformat(this.maxValue));
            }
            this.amountCheckFlag = validateFlag;
            this.nextStepValidateBoolean = validateFlag;

          }
        }
          , (err) => {
            this.amountCheckFlag = true;
            this.nextStepValidateBoolean = true;
          })
      }
    }
    else {
      this.amountRequestedFlag = false;
      this.amountCheckFlag = true;
      this.nextStepValidateBoolean = true;
      this.LoanDetailsErrorMessages.pAmountrequested = '';
    }

  }
  /** -----(End)----- Change Event for Amount Requested-------- (End)------------ */

  onDateChange(event) {
    let selectedDate = event.getDate();
    let selectedMonth = event.getMonth();
    let selectedYear = event.getFullYear();
    let selectedOnlyDate = new Date(selectedYear, selectedMonth, selectedDate);
    let now = new Date();
    let presentDate = now.getDate();
    let presentMonth = now.getMonth();
    let presentYear = now.getFullYear();
    let presentOnlyDate = new Date(presentYear, presentMonth, presentDate);

    if (this.forClearButton == true) {
      if (presentOnlyDate.getTime() >= selectedOnlyDate.getTime()) {
        this.forDatePickerCount++;
      }
    }
    if (this.forClearButton == false) {
      if (this.forDatePickerCount > 0) {
        this.getInterestRates();
      }
      else if (presentOnlyDate.getTime() > selectedOnlyDate.getTime()) {
        this.forDatePickerCount++;
      }
      else {
        this.forDatePickerCount = 0;
      }
    }
    if (this.forDatePickerCount > 0) {
      this.getInterestRates();
    }

  }

  /** -----(Start)----- For getting Interest Rates-------- (Start)------------ */
  getInterestRates() {
    this.maxinterestRate=0;
    this.mininterestRate=0;
    let data = {
      pLoanid: this.Loanid ? this.Loanid : 0,
      pContacttype: this.Contacttype ? this.Contacttype : '',
      pApplicanttype: this.Applicanttype ? this.Applicanttype : '',
      pschemeid: this.schemeid ? this.schemeid : 0,
      pLoanpayin: (this.FiLoanDetailsForm.value.pLoanpayin),
      pInteresttype: this.FiLoanDetailsForm.value.pInteresttype,
      pAmountrequested: this.FiLoanDetailsForm.value.pAmountrequested ? Number(this.FiLoanDetailsForm.value.pAmountrequested.toString().replace(/,/g, "")) : 0,
      pDateofapplication: this.FiLoanDetailsForm.value.pDateofapplication,
      pTenureofloan: this.FiLoanDetailsForm.value.pTenureofloan ? Number(this.FiLoanDetailsForm.value.pTenureofloan) : 0
    }

    if ((data.pLoanid != null && data.pLoanid != '') &&
      (data.pContacttype != null) &&
      (data.pApplicanttype != null) &&
      (data.pLoanpayin != null && data.pLoanpayin != '') &&
      (data.pInteresttype != null && data.pInteresttype != '') &&
      (data.pAmountrequested != 0) &&
      (data.pDateofapplication != null && data.pDateofapplication != '') &&
      (data.pTenureofloan != 0) && (data.pschemeid != null)) {
      this._FIIndividualService.GetInterestRates(data).subscribe(rates => {
        debugger; 
        console.log('rates data',rates);              
        this.IntrestRatesList = rates;
        if (this.IntrestRatesList && this.IntrestRatesList.length > 0) {
          this.FiLoanDetailsForm.patchValue({
            pRateofinterest: this.IntrestRatesList[0].pMinInterest
          });
          this.maxinterestRate=this.IntrestRatesList[0].pRateofinterest;
          this.mininterestRate=this.IntrestRatesList[0].pMinInterest;
        }
        else {
          this.FiLoanDetailsForm.patchValue({
            pRateofinterest: ''
          });
          this.maxinterestRate=0;
          this.mininterestRate=0;
          this.LoanDetailsErrorMessages.pRateofinterest = '';
        }
        if (this.FiLoanDetailsForm.value.pRateofinterest) {
          this.interestFlag = true;
        }
        else {
          this.interestFlag = false;
        }
      })
    }
  }
  /** -----(End)----- For getting Interest Rates-------- (End)------------ */

  /** -----(Start)----- Change event for Tenure-------- (Start)------------ */
  onTensureOfLoanChange(event) {
    this.tensureFlag = true;
    let enteredTensure = Number(this.FiLoanDetailsForm.value.pTenureofloan);

    if (enteredTensure == 0) {
      this.tensureFlag = false;
      this.LoanDetailsErrorMessages.pTenureofloan = 'Please enter valid Tenure of Loan';
    } else if (enteredTensure > 0) {
      this.FiLoanDetailsForm.controls.pTenureofloan.setValue(this._commonService.currencyformat(enteredTensure.toString().replace(/,/g, "").replace(/^0+/, '')));
      this.tensureFlag = true;
    }
    else {
      this.LoanDetailsErrorMessages.pTenureofloan = '';
      this.tensureFlag = true;
    }

    if (this.FiLoanDetailsForm.value.pPartprinciplepaidinterval) {
      if (enteredTensure < this.FiLoanDetailsForm.value.pPartprinciplepaidinterval) {
        this.FiLoanDetailsForm.patchValue({
          pPartprinciplepaidinterval: ''
        });
      } else {
        this.LoanDetailsErrorMessages.pPartprinciplepaidinterval = "";
        this.validateIntervalFlag = true;
      }
    }
    this.getInterestRates();
  }
  /** -----(End)----- Change event for Tenure-------- (End)------------ */

  /** -----(Start)----- Change event for Interest Rate-------- (Start)------------ */
  onChangeInterestRate(event) {
    debugger;
    this.interestFlag = true;
    let enteredInterestRate = this.FiLoanDetailsForm.value.pRateofinterest;
    if (enteredInterestRate) {
      if (enteredInterestRate == 0 || enteredInterestRate == 0.0 || enteredInterestRate == 0.) {
        this.LoanDetailsErrorMessages.pRateofinterest = 'Please enter valid Interest Rate';
        this.interestFlag = false;
      }
      else if (enteredInterestRate > 0) {
        if(parseFloat(this.maxinterestRate)>0){
        if(parseFloat(enteredInterestRate)>parseFloat(this.maxinterestRate) || parseFloat(enteredInterestRate)<parseFloat(this.mininterestRate)){
            this._commonService.showWarningMessage('Interest Rate in between '+this.mininterestRate +' & '+this.maxinterestRate );
           this.FiLoanDetailsForm.controls.pRateofinterest.setValue('');
           this.interestFlag = false;
            return;
        }
        else{
          this.interestFlag = true;
          this.LoanDetailsErrorMessages.pRateofinterest = '';
        }
        }
        else{
        this.interestFlag = true;
        this.LoanDetailsErrorMessages.pRateofinterest = '';
        }
      }
       else {
        this.LoanDetailsErrorMessages.pRateofinterest = '';
        this.interestFlag = true;
      }
    }
    else {
      this.LoanDetailsErrorMessages.pRateofinterest = 'Interest Rate required';
    }
  }
  /** -----(End)----- Change event for Interest Rate-------- (End)------------ */

  /**--------(Start)----- For showing total amount in EMI chart---------(Start)----------------- */
  calculateAggregat(modalData) {

    let totalamount = modalData.reduce((sum, c) => sum + parseFloat((c.pInstalmentprinciple)), 0);
    this.emiAggregates['pInstalmentprinciple'] = totalamount;

    totalamount = modalData.reduce((sum, c) => sum + parseFloat((c.pInstalmentinterest)), 0);
    this.emiAggregates['pInstalmentinterest'] = totalamount;


    totalamount = modalData.reduce((sum, c) => sum + parseFloat((c.pInstalmentamount)), 0);
    this.emiAggregates['pInstalmentamount'] = totalamount;
  }
  /**-------(End)----- For showing total amount in EMI chart---------(End)----------------- */

  /**------(Start)-----For EMI chart data--------------(Start)--------------------------- */
  private loadEmiDatas(): void {
    this.currencyFormatModalData = [];
    for (let index = 0; index < this.modalData.length; index++) {
      let dataModal = {
        pInstalmentno: this.modalData[index].pInstalmentno,
        pInstalmentprinciple: this._commonService.currencyformat(this.modalData[index].pInstalmentprinciple),
        pInstalmentinterest: this._commonService.currencyformat(this.modalData[index].pInstalmentinterest),
        pInstalmentamount: this._commonService.currencyformat(this.modalData[index].pInstalmentamount)
      }
      this.currencyFormatModalData.push(dataModal);
      this.gridView = this.currencyFormatModalData;
    }
  }
  /**------(End)-----For EMI chart data--------------(End)--------------------------- */

  /** -----(Start)------ For Installment modes drop down --------(Start)-----  */
  getLoanInstallmentModes(loanPayIn, interestType) {
    this._FIIndividualService.getInstallmentModes(loanPayIn, interestType).subscribe((response: any) => {
      if (response) {
        this.LoanInstllmentModes = response;
      }
    })
  }
  /** -----(End)------ For Installment modes drop down --------(End)-----  */

  /** -----(Start)------ For validate Part Principle Interval--------(Start)-----  */
  validateInterval(event) {
    let enteredInterval = Number(event.target.value);
    if (this.FiLoanDetailsForm.value.pTenureofloan) {
      if (enteredInterval == 0) {
        this.LoanDetailsErrorMessages.pPartprinciplepaidinterval = "Interval should be greater than zero";
      }
      else if (enteredInterval > Number(this.FiLoanDetailsForm.value.pTenureofloan)) {
        this.LoanDetailsErrorMessages.pPartprinciplepaidinterval = "Interval should not be greater than Tenure of Loan";
        this.validateIntervalFlag = false;
        this.emiFlag = false;
      }
      else {
        this.LoanDetailsErrorMessages.pPartprinciplepaidinterval = "";
        this.validateIntervalFlag = true;
      }
    }
    else {
      this._commonService.showWarningMessage("Please enter Tenure of Loan first");
      this.validateIntervalFlag = false;
      this.emiFlag = false;
    }
  }
  /** -----(End)------ For validate Part Principle Interval--------(End)-----  */

  /**-----(Start)---- For clear form ------(start)--------- */
  clearForm() {
    this.ngOnInit();
  }
  /**-----(End)---- For clear form ------(End)--------- */

  /** ------(Start) for back button--------------(Start)------------- */
  moveToPreviousTab() {
    debugger
    let str;
    let temptabname;
    this.dropdoenTabname = this._commonService.GetFiTabName();
    let tempFirstInformationTabsData = this._FirstInformationTabsData;
    for (let i = 0; i < tempFirstInformationTabsData.length; i++) {
      let pTabsectionname = tempFirstInformationTabsData[i].pTabsectionname;
      if (pTabsectionname == this.dropdoenTabname) {
        str = tempFirstInformationTabsData[i - 1].pTabsectionid;
        temptabname = tempFirstInformationTabsData[i - 1].pTabsectionname;
        this._commonService.SetFiTabName(temptabname);
      }
    }
    this.dropdoenTabname = temptabname;
    $('.nav-item a[href="#' + str + '"]').tab('show').addClass('active show');
    // let str = "select-applicant";
    // this.dropdoenTabname = 'Select Applicant';
    // $('.nav-item a[href="#' + str + '"]').tab('show');
    let backFlag = false;
    let data = {
      backFlag: false,
      event: true
    }
    this.forGettingContactDataEmit.emit(data);
  }
  /** --------(End) for back button--------------(End)------------- */

   getInterestRatesEdit() {
     debugger;
     if(Number(this.maxinterestRate)<=0){
    let data = {
      pLoanid: this.Loanid ? this.Loanid : 0,
      pContacttype: this.Contacttype ? this.Contacttype : '',
      pApplicanttype: this.Applicanttype ? this.Applicanttype : '',
      pschemeid: this.schemeid ? this.schemeid : 0,
      pLoanpayin: (this.FiLoanDetailsForm.value.pLoanpayin),
      pInteresttype: this.FiLoanDetailsForm.value.pInteresttype,
      pAmountrequested: this.FiLoanDetailsForm.value.pAmountrequested ? Number(this.FiLoanDetailsForm.value.pAmountrequested.toString().replace(/,/g, "")) : 0,
      pDateofapplication: this.FiLoanDetailsForm.value.pDateofapplication,
      pTenureofloan: this.FiLoanDetailsForm.value.pTenureofloan ? Number(this.FiLoanDetailsForm.value.pTenureofloan) : 0
    }

    if ((data.pLoanid != null && data.pLoanid != '') &&
      (data.pContacttype != null) &&
      (data.pApplicanttype != null) &&
      (data.pLoanpayin != null && data.pLoanpayin != '') &&
      (data.pInteresttype != null && data.pInteresttype != '') &&
      (data.pAmountrequested != 0) &&
      (data.pDateofapplication != null && data.pDateofapplication != '') &&
      (data.pTenureofloan != 0) && (data.pschemeid != null)) {
      this._FIIndividualService.GetInterestRates(data).subscribe(rates => {
        debugger;               
        this.IntrestRatesList = rates;
        if (this.IntrestRatesList && this.IntrestRatesList.length > 0) {
         
          this.maxinterestRate=this.IntrestRatesList[0].pRateofinterest;
          this.mininterestRate=this.IntrestRatesList[0].pMinInterest;
        }
        else {
          this.maxinterestRate=0;
          this.mininterestRate=0;
          }
      })
    }
     }
  }
}
