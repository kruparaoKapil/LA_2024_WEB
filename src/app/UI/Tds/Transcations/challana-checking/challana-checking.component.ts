import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AccountingTransactionsService } from 'src/app/Services/Accounting/accounting-transactions.service';
import { TdsreportService } from 'src/app/Services/Tds/tdsreport.service';
import { CommonService } from 'src/app/Services/common.service';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { CompanyconfigService } from '../../../../Services/Settings/companyconfig.service';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { process } from '@progress/kendo-data-query';
import { ReportService } from 'src/app/Services/Accounting/report.service';


@Component({
  selector: 'app-challana-checking',
  templateUrl: './challana-checking.component.html',
  styleUrls: ['./challana-checking.component.css']
})
export class ChallanaCheckingComponent implements OnInit {
  challanachecking: any;
  ChallanaCheckingForm: FormGroup
  frommonthof: any;
  tomonthof: any;
  fromdate: any;
  todate: any;
  monthof: any;
  month: any;
  gridData: any = []
  tdssectionlist: any;
  public today: Date = new Date();
  public savebutton: any = 'Show';
  public dpFromConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpToConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  section: any;
  validation: boolean;
  companytype: any;
  companyid: any;
  pantype: any;
  allStudentsSelected: boolean;
  allchecked: boolean;
  allSelectedModels: any = [];
  totaltdsamount: any;
  actualtotaltdsamount: any;
  paidamount: any;
  tds: any = []
  sectionList: any = [];
  netActualTdsAmount: number = 0;
  netCalTdsAmount: number = 0;
  netPaidAmount: number = 0;
  public total: number = 0;
  public totalPayment: number = 0;
  challanaValue: number = 0;
  fromDateBind: any;
  toDateBind: any;
  monthBind: any;
  gridView: any = [];
  creditamount: number;
  totaldebitamount: any;
  totalcreditamount: number;
  totalbalanceamount: any;
  gridData1: any = [];
  loading: boolean = false;
  constructor(private formbuilder: FormBuilder, private tdsreportservice: TdsreportService, private _CommonService: CommonService, private datePipe: DatePipe, private AccountingTransactionsService: AccountingTransactionsService, private _companyconfigservice: CompanyconfigService, private tdsService: TdsreportService, private _ReportService: ReportService) {
    this.dpFromConfig.dateInputFormat = 'DD-MMM-YYYY'
    this.dpFromConfig.minDate = new Date('2024-07-01T00:00:00+05:30');
    this.dpFromConfig.maxDate = new Date();
    this.dpFromConfig.showWeekNumbers = false;

    this.dpToConfig.dateInputFormat = 'DD-MMM-YYYY'
    this.dpToConfig.minDate = new Date('2024-07-01T00:00:00+05:30');
    this.dpToConfig.maxDate = new Date();
    this.dpToConfig.showWeekNumbers = false;

    this.dpConfig.dateInputFormat = 'MMM-YYYY'
    this.dpConfig.minMode = 'month';
   this.dpConfig.maxDate = this.today;
    this.dpConfig.showWeekNumbers = false;

    this.allData = this.allData.bind(this);

  }


  ngOnInit() {
    this.GetCompanyDetails();
    this.GetformData();
    // this.getSectionList();
    this.frommonthof = new Date();
    this.tomonthof = new Date();
    this.fromdate = this.datePipe.transform(this.frommonthof, "yyyy-MM-dd");
    this.todate = this.datePipe.transform(this.tomonthof, "yyyy-MM-dd");
    this.BlurEventAllControll(this.ChallanaCheckingForm)

  }
  public GetformData() {
    this.challanachecking = {}
    this.ChallanaCheckingForm = this.formbuilder.group({

      pTdsSection: ['', Validators.required],
      pCompanyType: ['', Validators.required],
      pTdsType: ['', Validators.required],
      pFromDate: [this.today],
      pToDate: [this.today],
      pTotalTdsAmount: [''],
      pActualTotalTdsAmount: [''],
      pTotalPaidAmount: [''],
      pCompanyId: [''],
      pSectionname: [''],
      ptypeofoperation: ['CREATE'],
      pMonthOf: ['', Validators.required]
    });
    this.getTDSsectiondetails()
  }
  getTDSsectiondetails(): void {
    this.tdsService.getTDSSections1().subscribe(
      (json) => {
        if (json != null) {
          console.log("TDS", json)
          this.tdssectionlist = json;
        }
      },
      (error) => {
        this._CommonService.showErrorMessage(error);
      }
    );
  }

  public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.gridData, {
        // sort: [{ field: "pDepositdate", dir: "asc" }],
      }).data,
    };

    return result;
  }


  // getSectionList() {
  //   try {
  //     debugger;
  //     this.tdsService.getTDSSections().subscribe(json => {
  //       debugger;
  //       try {
  //         if (json != null) {
  //           this.sectionList = json;

  //         }
  //       }
  //       catch (error) {

  //       }
  //     },
  //       (error) => {

  //         this._CommonService.showErrorMessage(error);
  //       });
  //   }
  //   catch (error) {
  //     //this._commonService.exceptionHandlingMessages('Subscriber Configuration', 'GetSubscriberContactDetails', error);
  //   }
  // }
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
          this.challanachecking[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {

            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                let lablename;
                lablename = (document.getElementById(key) as HTMLInputElement).title;
                errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.challanachecking[key] += errormessage + ' ';
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
  FromDateChange(event) {
    debugger;
    this.gridData = [];
    this.netActualTdsAmount = 0;
    this.netCalTdsAmount = 0;
    this.netPaidAmount = 0;
    this.total = 0;
    this.totalPayment = 0;


    this.frommonthof = event;
    this.fromdate = this.datePipe.transform(this.frommonthof, "yyyy-MM-dd");
    if (this.tomonthof != [] || this.tomonthof == null || this.tomonthof == '') {
      this.validatedates();
    }
  }
  ToDateChange(event) {
    debugger;
    this.gridData = [];
    this.netActualTdsAmount = 0;
    this.netCalTdsAmount = 0;
    this.netPaidAmount = 0;
    this.total = 0;
    this.totalPayment = 0;
    this.tomonthof = event;
    this.todate = this.datePipe.transform(this.tomonthof, "yyyy-MM-dd");
    if (this.frommonthof != [] || this.frommonthof == null || this.frommonthof == '') {
      this.validatedates();
    }
  }

  DateChange(event) {
    debugger;
    this.gridData = [];
    this.netActualTdsAmount = 0;
    this.netCalTdsAmount = 0;
    this.netPaidAmount = 0;
    this.total = 0;
    this.totalPayment = 0;
    this.monthof = event;
    this.month = this.datePipe.transform(this.monthof, 'MMM-yyyy');
    const year = this.monthof.getFullYear();
    const month = this.monthof.getMonth();
    const fromDate = new Date(year, month, 1);
    const toDate = new Date(year, month + 1, 0);

    this.frommonthof = this.datePipe.transform(fromDate, 'dd-MMM-yyyy');
    this.tomonthof = this.datePipe.transform(toDate, 'dd-MMM-yyyy');

    this.fromdate = this.frommonthof;
    this.todate = this.tomonthof;
  }


  onOpenCalendar(container) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
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
  Companytypechanges(event) {
    this.gridData = [];
    this.netActualTdsAmount = 0;
    this.netCalTdsAmount = 0;
    this.netPaidAmount = 0;
    this.total = 0;
    this.totalPayment = 0;
    this.companytype = event.target.value;
    this.ChallanaCheckingForm.controls.pCompanyType.setValue(this.companytype)
  }
  Pantypechanges(event) {
    this.gridData = [];
    this.netActualTdsAmount = 0;
    this.netCalTdsAmount = 0;
    this.netPaidAmount = 0;
    this.total = 0;
    this.totalPayment = 0;
    this.pantype = event.target.value;
    this.ChallanaCheckingForm.controls.pTdsType.setValue(this.pantype)
  }
  sectionchange(event) {
    debugger
    this.netActualTdsAmount = 0;
    this.netCalTdsAmount = 0;
    this.netPaidAmount = 0;
    this.total = 0;
    this.totalPayment = 0;
    this.gridData = [];
    this.ChallanaCheckingForm.controls.pSectionname.setValue(event.pSectionname);
    if (event.pSection === '194A') {
      this.challanaValue = this.AccountingTransactionsService.getChallanaAmount();
      console.log("Challana Value (Account ledger amount):", this.challanaValue);
    }
    else {
      this.challanaValue = 0;
    }
  }
  GetCompanyDetails() {
    this._companyconfigservice.Getcompanydetails().subscribe(data => {
      debugger
      console.log("get data:", data)
      if (data['pnameofenterprise'] != undefined || data['pnameofenterprise'] != null) {

        this.companyid = data['pCompanyId']
      }
    })
  }
  GetChallanaDetails() {
    debugger;
    let isValid: boolean = true;

    if (this.checkValidations(this.ChallanaCheckingForm, isValid)) {

      // this.gridData.empty;
      //this.gridData = [];
      this.netActualTdsAmount = 0;
      this.netCalTdsAmount = 0;
      this.netPaidAmount = 0;
      this.total = 0;
      this.totalPayment = 0;
      // let fromdate = this.datePipe.transform(this.ChallanaCheckingForm['controls']['pFromDate'].value, "dd-MMM-yyyy");
      // let todate = this.datePipe.transform(this.ChallanaCheckingForm['controls']['pToDate'].value, "dd-MMM-yyyy");
      // this.frommonthof = fromdate;
      // this.tomonthof = todate;

      let fromdate = this.frommonthof;
      let todate = this.tomonthof;
      let sectionName = this.ChallanaCheckingForm.controls.pTdsSection.value;
      let section = this.ChallanaCheckingForm.controls.pSectionname.value;
      this.toDateBind = todate;
      this.fromDateBind = fromdate;

      if (this.ChallanaCheckingForm.controls.pTdsSection.value == '194A') {
        this._ReportService.GetLedgerReport(fromdate, todate, 20799, 0).subscribe(json => {
          debugger
          this.gridData1 = json;
          console.log("account ledger", this.gridData1)
          this.gridData1 = this.gridData1.filter(x => x.ptransactiondate = this._CommonService.formatDateFromDDMMYYYY(x.ptransactiondate))
          this.gridView = this.gridData1;

          this.creditamount = Number(this.gridView[0].pcreditamount || 0);
          this.totaldebitamount = this.gridData1.reduce((sum, c) => sum + c.pdebitamount, 0).toFixed(2);
          this.totalcreditamount = Number(this.gridData1.reduce((sum, c) => sum + c.pcreditamount, 0));
          this.totalbalanceamount = this.gridData1.reduce((sum, c) => sum + c.popeningbal, 0).toFixed(2);
          this.challanaValue = this.totalcreditamount - this.creditamount;
          console.log('this is acount led value:', this.challanaValue);
        });
      }

      //bhargavi start
      this.tdsreportservice.GetChallanaDetails(fromdate, todate, sectionName, this.companytype, this.pantype, section).subscribe(result => {
        this.loading = false;
        this.gridData = result;
        if (this.gridData != null && this.gridData.length !== 0) {
          console.log("grid data", this.gridData);
          this.netActualTdsAmount = this.gridData.reduce((sum, item) => sum + Number(item.pActualTdsAmount), 0).toFixed(2);

          this.netCalTdsAmount = this.gridData.reduce((sum, item) => sum + Number(item.pCalTdsAmount), 0).toFixed(2);

          this.netPaidAmount = this.gridData.reduce((sum, item) => sum + Number(item.pAmount), 0).toFixed(2);
        }
        else {
          this._CommonService.showWarningMessage('No Data To Show For The Date of' + ' ' + fromdate);
          this.loading = false;
        }

        // if (result) {
        //   this.gridData = result;
        //   this.netActualTdsAmount = this.gridData.reduce((sum, item) => sum + Number(item.pActualTdsAmount), 0).toFixed(2);

        //   this.netCalTdsAmount = this.gridData.reduce((sum, item) => sum + Number(item.pCalTdsAmount), 0).toFixed(2);

        //   this.netPaidAmount = this.gridData.reduce((sum, item) => sum + Number(item.pAmount), 0).toFixed(2);
        // }
        // console.log(this.gridData);

      }, (error) => {
        this._CommonService.showErrorMessage(error);
        this.loading = false;
      })
      //bhargavi end

    }
    //if(this.checkValidations(this.LienReleaseForm,isValid)){

  }
  selectAllStudentsChange($event: any, dataItem, rowIndex) {
    debugger

    if ($event.target.checked) {
      this.total = 0;
      this.totalPayment = 0;
      this.allStudentsSelected = true;
      this.gridData.filter(a => a.add = true);

      for (let i = 0; i < this.gridData.length; i++) {
        this.gridData[i].add = true;
        this.gridData[i].selectvalue = true;
        this.total += (this.gridData[i].pActualTdsAmount);
        this.totalPayment += (this.gridData[i].pAmount);
        //this.total += parseFloat(dataItem.ptotalamount);
        this.allSelectedModels.push(this.gridData[i]);
      }

      this.allSelectedModels = this.allSelectedModels.map(obj => {
        obj.pPaidAmount = obj.pCalTdsAmount + obj.pAmount;


        return obj;
      });

      //this.allSelectedModels=this.gridData;
      // this.allSelectedModels.push(this.gridData);
      this.totaltdsamount = this.gridData.reduce((sum, c) => sum + parseFloat((c.pTdsAmount)), 0);
      this.actualtotaltdsamount = this.gridData.reduce((sum, c) => sum + parseFloat((c.pActualTdsAmount)), 0);
      this.paidamount = this.gridData.reduce((sum, c) => sum + parseFloat((c.pPaidAmount)), 0);

      this.netActualTdsAmount = this.gridData.reduce((sum, c) => sum + Number(c.pActualTdsAmount), 0);
      this.netCalTdsAmount = this.gridData.reduce((sum, c) => sum + Number(c.pCalTdsAmount), 0);
      this.netPaidAmount = this.gridData.reduce((sum, c) => sum + Number(c.pAmount), 0);

    } else {
      this.allStudentsSelected = false;
      this.gridData.filter(a => a.add = false);
      this.allSelectedModels = []
      this.total = 0;
      this.totalPayment = 0;
      this.netActualTdsAmount = 0;
      this.netCalTdsAmount = 0;
      this.netPaidAmount = 0;

    }

    console.log("selecting all", this.allSelectedModels)
  }
  clickselectforpayments($event: any, dataItem, rowIndex) {
    debugger;
    if (this.gridData.length == 1) {
      this.allStudentsSelected = true;
    }

    if ($event.target.checked) {
      this.gridData[rowIndex].add = true
      this.total += dataItem.pActualTdsAmount;
      this.totalPayment += dataItem.pAmount;
      this.allSelectedModels.push(dataItem);

      this.allSelectedModels = this.allSelectedModels.map(obj => {
        obj.pPaidAmount = obj.pCalTdsAmount + obj.pAmount;


        return obj;
      });

      this.totaltdsamount = this.allSelectedModels.reduce((sum, c) => sum + parseFloat((c.pTdsAmount)), 0);
      this.actualtotaltdsamount = this.allSelectedModels.reduce((sum, c) => sum + parseFloat((c.pActualTdsAmount)), 0);
      this.paidamount = this.allSelectedModels.reduce((sum, c) => sum + parseFloat((c.pPaidAmount)), 0);

      this.netActualTdsAmount = this.allSelectedModels.reduce((sum, c) => sum + Number(c.pActualTdsAmount), 0).toFixed(2);
      this.netCalTdsAmount = this.allSelectedModels.reduce((sum, c) => sum + Number(c.pCalTdsAmount), 0).toFixed(2);
      this.netPaidAmount = this.allSelectedModels.reduce((sum, c) => sum + Number(c.pAmount), 0).toFixed(2);

    }
    else {

      this.gridData[rowIndex].add = false
      this.allSelectedModels = this.gridData.filter(a => a.add == true);
      //this.tds=this.gridData.filter(a=>a.pTdsAmount==true)
      this.allStudentsSelected = false;

      if (this.total > parseFloat(dataItem.pActualTdsAmount)) {
        this.total -= parseFloat(dataItem.pActualTdsAmount);
      } else {
        this.total = parseFloat(dataItem.pActualTdsAmount) - this.total;

      }

      //this.totalPayment += dataItem.pAmount;

      if (this.totalPayment > parseFloat(dataItem.pAmount)) {
        this.totalPayment -= parseFloat(dataItem.pAmount);
      } else {
        this.totalPayment = parseFloat(dataItem.pAmount) - this.totalPayment;

      }

      this.allSelectedModels = this.allSelectedModels.map(obj => {
        obj.pPaidAmount = obj.pCalTdsAmount + obj.pAmount;


        return obj;
      });

      this.totaltdsamount = this.allSelectedModels.reduce((sum, c) => sum + parseFloat((c.pTdsAmount)), 0);
      this.actualtotaltdsamount = this.allSelectedModels.reduce((sum, c) => sum + parseFloat((c.pActualTdsAmount)), 0);
      this.paidamount = this.allSelectedModels.reduce((sum, c) => sum + parseFloat((c.pPaidAmount)), 0);


      this.netActualTdsAmount = this.allSelectedModels.reduce((sum, c) => sum + Number(c.pActualTdsAmount), 0).toFixed(2);
      this.netCalTdsAmount = this.allSelectedModels.reduce((sum, c) => sum + Number(c.pCalTdsAmount), 0).toFixed(2);
      this.netPaidAmount = this.allSelectedModels.reduce((sum, c) => sum + Number(c.pAmount), 0).toFixed(2);

    }
    console.log("if selecting one", this.allSelectedModels)
  }
  SaveForm() {
    debugger;
    //this.GetChallanaDetails()
     const selectedMonth = this.ChallanaCheckingForm.controls.pMonthOf.value;
  if (selectedMonth) {
    const today = new Date();
    const selected = new Date(selectedMonth);
    console.log('selected month:', selected.getMonth(), selected.getFullYear());
    console.log('current month:', today.getMonth(), today.getFullYear());
    if (selected.getMonth() === today.getMonth() && selected.getFullYear() === today.getFullYear()) {
      this._CommonService.showWarningMessage('Cannot save data for an incomplete month.');
      return;
    }
  }
    let isValid: boolean = true;
    if (this.checkValidations(this.ChallanaCheckingForm, isValid)) {
      if (this.gridData.length > 0) {
        // this.allSelectedModels = this.allSelectedModels.map(obj => {
        //   obj.pPaidAmount = obj.pCalTdsAmount + obj.pAmount ;


        //   return obj;
        // });
        if (this.allSelectedModels.length > 0) {
         this.ChallanaCheckingForm.controls.pFromDate.setValue(this.fromDateBind);
          this.ChallanaCheckingForm.controls.pToDate.setValue(this.toDateBind);
          this.ChallanaCheckingForm.controls.pTotalTdsAmount.setValue(this.totaltdsamount)
          this.ChallanaCheckingForm.controls.pActualTotalTdsAmount.setValue(this.actualtotaltdsamount)
          this.ChallanaCheckingForm.controls.pTotalPaidAmount.setValue(this.paidamount);
          this.ChallanaCheckingForm.controls.pCompanyId.setValue(this.companyid);

          let t = Array.from(new Set(this.allSelectedModels))
          for (let index = 0; index < this.allSelectedModels.length; index++) {
            if (this.allSelectedModels[index].pBalance == null) {
              this.allSelectedModels[index].pBalance = 0;
            }
            if (this.allSelectedModels[index].pTdsAmount == null) {
              this.allSelectedModels[index].pTdsAmount = 0;
            }

          }
          let challana = { _ChallanaEntryDetails: this.allSelectedModels }
          let challanaform = Object.assign(this.ChallanaCheckingForm.value, challana);
          let data = JSON.stringify(challanaform)
          console.log("challana form", data);
          this.tdsreportservice.SaveChallanaEntry(data).subscribe(res => {
            console.log("res is", res);
            if (res) {
              this._CommonService.showInfoMessage("Saved Successfully");
              this.resetData();
              this.allSelectedModels = [];
            }
          })


        }
        else {
          this._CommonService.showWarningMessage("please select atleast one checkbox")
        }

      }
      else {
        this._CommonService.showWarningMessage("There are no records in grid")
      }

    }
  }

  resetData() {
    this.gridData = [];
    this.allStudentsSelected = false;
    this.total = 0;
    this.totalPayment = 0;
    this.netActualTdsAmount = 0;
    this.netCalTdsAmount = 0;
    this.netPaidAmount = 0;
    this.total = 0;
    this.ChallanaCheckingForm.reset();
    this.ChallanaCheckingForm.controls.pFromDate.setValue(this.today);
    this.ChallanaCheckingForm.controls.pToDate.setValue(this.today);
    this.ChallanaCheckingForm.controls.ptypeofoperation.setValue('CREATE');

    this.challanachecking.pTdsSection = '';
    this.challanachecking.pCompanyType = '';
    this.challanachecking.pTdsType = '';
  }

  // GetZeroTdsDetails() {
  //   debugger;

  //   let isValid: boolean = true;

  //   if (this.checkValidations(this.ChallanaCheckingForm, isValid)) {

  //     this.netActualTdsAmount = 0;
  //     this.netCalTdsAmount = 0;
  //     this.netPaidAmount = 0;
  //     this.total = 0;
  //     this.totalPayment = 0;
  //     let fromdate = this.datePipe.transform(this.ChallanaCheckingForm['controls']['pFromDate'].value, "dd-MMM-yyyy");
  //     let todate = this.datePipe.transform(this.ChallanaCheckingForm['controls']['pToDate'].value, "dd-MMM-yyyy");
  //     let sectionName = this.ChallanaCheckingForm.controls.pTdsSection.value;
  //     let section = this.ChallanaCheckingForm.controls.pSectionname.value;

  //     this.tdsreportservice.GetZeroTdsChallanaDetails( fromdate,todate,sectionName, this.companytype,this.pantype,
  //       section).subscribe(result => {
  //       this.gridData = result;
  //       if (this.gridData && this.gridData.length > 0) {
  //         this.netActualTdsAmount = this.gridData.reduce((sum, item) => sum + Number(item.pActualTdsAmount), 0).toFixed(2);
  //         this.netCalTdsAmount = this.gridData.reduce((sum, item) => sum + Number(item.pCalTdsAmount), 0).toFixed(2);
  //         this.netPaidAmount = this.gridData.reduce((sum, item) => sum + Number(item.pAmount), 0).toFixed(2);

  //       } else {
  //         this._CommonService.showWarningMessage('No Zero TDS Data Found');
  //       }

  //     }, (error) => {
  //       this._CommonService.showErrorMessage(error);
  //     });
  //   }
  // }

GetZeroTdsDetails() {
  debugger;
  let isValid: boolean = true;

  if (this.checkValidations(this.ChallanaCheckingForm, isValid)) {

    this.netActualTdsAmount = 0;
    this.netCalTdsAmount = 0;
    this.netPaidAmount = 0;
    this.total = 0;
    this.totalPayment = 0;

    let fromdate = this.datePipe.transform(this.ChallanaCheckingForm['controls']['pFromDate'].value, "dd-MMM-yyyy");
    let todate = this.datePipe.transform(this.ChallanaCheckingForm['controls']['pToDate'].value, "dd-MMM-yyyy");

    this.frommonthof = fromdate;
    this.tomonthof = todate;

    let sectionName = this.ChallanaCheckingForm.controls.pTdsSection.value;
    let section = this.ChallanaCheckingForm.controls.pSectionname.value;

    this.toDateBind = todate;
    this.fromDateBind = fromdate;
    if (this.ChallanaCheckingForm.controls.pTdsSection.value == '194A') {
      this._ReportService.GetLedgerReport(fromdate, todate, 20799, 0).subscribe(json => {
        debugger
        this.gridData1 = json;
        console.log("account ledger", this.gridData1)

        this.gridData1 = this.gridData1.filter(x => x.ptransactiondate = this._CommonService.formatDateFromDDMMYYYY(x.ptransactiondate))

        this.gridView = this.gridData1;

        this.creditamount = Number(this.gridView[0].pcreditamount || 0);
        this.totaldebitamount = this.gridData1.reduce((sum, c) => sum + c.pdebitamount, 0).toFixed(2);
        this.totalcreditamount = Number(this.gridData1.reduce((sum, c) => sum + c.pcreditamount, 0));
        this.totalbalanceamount = this.gridData1.reduce((sum, c) => sum + c.popeningbal, 0).toFixed(2);
        this.challanaValue = this.totalcreditamount - this.creditamount;

        console.log('this is acount led value:', this.challanaValue);
      });
    }
    this.tdsreportservice.GetZeroTdsChallanaDetails(fromdate, todate, sectionName, this.companytype, this.pantype, section).subscribe(result => {
      this.loading = false;
      this.gridData = result;

      if (this.gridData != null && this.gridData.length !== 0) {
        console.log("grid data", this.gridData);

        this.netActualTdsAmount = this.gridData.reduce((sum, item) => sum + Number(item.pActualTdsAmount), 0).toFixed(2);
        this.netCalTdsAmount = this.gridData.reduce((sum, item) => sum + Number(item.pCalTdsAmount), 0).toFixed(2);
        this.netPaidAmount = this.gridData.reduce((sum, item) => sum + Number(item.pAmount), 0).toFixed(2);

      } else {
        this._CommonService.showWarningMessage('No Zero TDS Data Found');
        this.loading = false;
      }

    }, (error) => {
      this._CommonService.showErrorMessage(error);
      this.loading = false;
    });
  }
}


}
