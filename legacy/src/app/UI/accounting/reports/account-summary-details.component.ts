import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/Services/Accounting/report.service';
import { CommonService } from 'src/app/Services/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { DatePipe } from '@angular/common';
import { debug } from 'util';
import { GroupDescriptor,process } from '@progress/kendo-data-query';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';

declare let $: any
@Component({
  selector: 'app-account-summary-details',
  templateUrl: './account-summary-details.component.html',
  styles: []
})
export class AccountSummaryDetailsComponent implements OnInit {
  public groups: GroupDescriptor[] = [{
    field: 'pparentname', aggregates: [{ field: "pdebitamount", aggregate: "sum" }, { field: "pcreditamount", aggregate: "sum" }],
  }];
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dppConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  ledgerNameDisplay: any;
  totalPayment: any = 0;
  constructor(private _reportservice: ReportService, private _commonservice: CommonService, private fb: FormBuilder, private datepipe: DatePipe) {
    this.dpConfig.containerClass = 'theme-dark-blue';
    this.dpConfig.showWeekNumbers = false;
    this.dpConfig.maxDate = new Date();
    this.dpConfig.dateInputFormat = 'DD/MM/YYYY'

    this.dppConfig.containerClass = 'theme-dark-blue';
    this.dppConfig.showWeekNumbers = false;
    this.dppConfig.maxDate = new Date();
    this.dppConfig.dateInputFormat = 'DD/MM/YYYY'

    this.allData = this.allData.bind(this);
  }
  ledgeraccountslist: any;
  Accontsummaryform: FormGroup;
  fromdate: any;
  date: any;
  FromDate: any;
  inbetween: any;
  id: any;
  hidegridcolumn = true;
  ledger = true;
  showdate = true;
  todate: any;
  selecteddate = true;
  validationforledger = false;
  validation = false;
  betweenfrom: any;
  caldebitamount: any;
  savebutton = "Generate Report"
  public isLoading = false;
  public loading = false;
  calcreditamount: any;
  betweento: any;
  betweendates: any;
  gridData: any = [];
  accountid = [];
  accountsummaryvalidations: any = {};
  ngOnInit() {
    this.Accontsummaryform = this.fb.group({
      dfromdate: [''],
      dtodate: [''],
      pledgerid: ['', Validators.required],
      date: [''],
      pledgername: ['']
    })

    this.FromDate = 'From Date'
    this.date = new Date();
    this.betweendates = "As On"
    this.inbetween = ""
    this.showdate = false;
    this.todate = "";
    this.FromDate = ''
    this.hidegridcolumn = true;
    this.ledger = true
    this.Accontsummaryform['controls']['date'].setValue(true)
    this.Accontsummaryform['controls']['dfromdate'].setValue(this.date);
    this.Accontsummaryform['controls']['dtodate'].setValue(this.date);
    this.betweenfrom = this.datepipe.transform(this.date, "dd-MMM-yyyy");
    this._reportservice.GetLedgerAccountList('ACCOUNT LEDGER').subscribe(json => {

      let JSONDATA = json
      // console.log(json)
      if (json != null) {
        this.ledgeraccountslist = json;


        // $("#MultiSelctdropdown").select2({
        //   placeholder: "Multi Select",
        //   allowClear: true,
        //   data: json
        // });
        // $("#MultiSelctdropdown").change(function () {
        //   


        //   let dropdowndata = $("#MultiSelctdropdown").val();

        //   if (dropdowndata == null) {
        //     this.validationforledger = true
        //   }
        //   else {
        //     this.validationforledger = false
        //   }
        //   //console.log(selectedValue)
        //   //this.accountid = selectedValue
        //   // this.accountid=""
        //   //  selectedValue.reduce((acc, item) =>
        //   //   {
        //   //      this.accountid+=item+',';
        //   //   });



        // });

      }
    },
      (error) => {
        this._commonservice.showErrorMessage(error);
      });
this.BlurEventAllControll(this.Accontsummaryform)

  }


  checkfromdate() {
     
    debugger
    this.fromdate = this.Accontsummaryform['controls']['dfromdate'].value
    this.fromdate = this.datepipe.transform(this.fromdate, "dd/MM/yyyy");
    this.validationfordates()
    if (this.fromdate > this.todate) {
      this.validation = true;
    }
    else {
      this.validation = false;
    }

  }
  checktodate() {
    debugger
    this.todate = this.Accontsummaryform['controls']['dtodate'].value
    this.todate = this.datepipe.transform(this.todate, "dd/MM/yyyy");

    this.validationfordates()
    if (this.fromdate > this.todate) {
      this.validation = true;
    }
    else {
      this.validation = false;
    }

  }
  validationfordates() {

    let isValid = true;


    if (this.selecteddate == true) {
      this.fromdate = this.Accontsummaryform.controls.dfromdate.value
      this.todate = this.Accontsummaryform.controls.dfromdate.value
    }
    else {
      this.fromdate = this.Accontsummaryform.controls.dfromdate.value
      this.todate = this.Accontsummaryform.controls.dtodate.value
    }
    this.fromdate = this.datepipe.transform(this.fromdate, "yyyy/MM/dd");
    this.todate = this.datepipe.transform(this.todate, "yyyy/MM/dd");
    return isValid
  }


  checkox(event) {

    this.Accontsummaryform.controls.dfromdate.setValue(new Date());
    this.Accontsummaryform.controls.dtodate.setValue(new Date());
    // $("#MultiSelctdropdown").val(null).trigger('change')
   // this.Accontsummaryform.controls.pledgerid.setValue(null);
    this.gridData = []
    this.caldebitamount = 0;
    this.calcreditamount = 0;
    if (event.target.checked == false) {
      this.selecteddate = false
      this.showdate = true;
      this.betweendates = "Between"
      this.FromDate = 'From Date'
      this.inbetween = "and";
      this.validationfordates();
      this.betweenfrom = this.datepipe.transform(this.fromdate, "dd-MMM-yyyy");
      this.betweento = this.datepipe.transform(this.todate, "dd-MMM-yyyy");

      this.hidegridcolumn = false;


    }
    else {
      this.betweendates = "As On"
      this.inbetween = ""
      this.showdate = false;
      this.selecteddate = true;
      this.todate = "";
      this.FromDate = '';
      this.betweento = ""
      this.betweenfrom = this.datepipe.transform(this.date, "dd-MMM-yyyy");
      this.hidegridcolumn = true;
    }
  }
  ledgerChange(event){
    debugger;
    const pledgerNames = event.map(item => item.pledgername).join(', ');

    this.Accontsummaryform.controls.pledgername.setValue(pledgerNames);
    this.ledgerNameDisplay = this.Accontsummaryform.controls.pledgername.value;
  }
  generateaccountsummary() {

    this.validationfordates();

    // let dropdowndata = $("#MultiSelctdropdown").val();
    debugger;
    let isValid = true;
    if (this.checkValidations(this.Accontsummaryform, isValid))
     {
       debugger
      this.loading = true
      this.isLoading = true;
      this.savebutton = 'Processing';
      let dropdowndata = this.Accontsummaryform.controls.pledgerid.value.toString();
      this.validationforledger = false;
      this.accountid = dropdowndata
      this.caldebitamount = 0;
      this.calcreditamount = 0;
      this.betweenfrom = this.datepipe.transform(this.fromdate, "dd-MMM-yyyy");

      if (this.selecteddate == true) {
        this.betweento = ""
      }
      else {
        this.betweento = this.datepipe.transform(this.todate, "dd-MMM-yyyy");
      }

      this._reportservice.GetLedgerSummary(this.fromdate, this.todate, this.accountid).subscribe(res => {
         debugger
        this.loading = false
        this.isLoading = false;
        this.savebutton = 'Generate Report';
        if (res.length != 0) {
          //this.Accontsummaryform.controls.pledgerid.setValue("");
          this.accountsummaryvalidations={}
        }
        this.gridData = res;
        for (let i = 0; i < this.gridData.length; i++) {

          if (this.gridData[i].pdebitamount < 0) {
            let debitamount = Math.abs(this.gridData[i].pdebitamount)
            this.gridData[i].pdebitamount = debitamount


          }
          if (this.gridData[i].pcreditamount < 0) {
            let creditamount = Math.abs(this.gridData[i].pcreditamount)
            this.gridData[i].pcreditamount = creditamount


          }

          this.caldebitamount = this.caldebitamount + this.gridData[i].pdebitamount
          this.calcreditamount = this.calcreditamount + this.gridData[i].pcreditamount       

       


        this.totalPayment = this.calcreditamount - this.caldebitamount
        console.log(this.totalPayment);
          if (this.gridData[i].popeningbal < 0) {
            let openingbal = Math.abs(this.gridData[i].popeningbal)
            this.gridData[i].popeningbal = this._commonservice.currencyformat(openingbal) + ' ' + " Cr";
          }
          else if (this.gridData[i].popeningbal == 0) {
            this.gridData[i].popeningbal = ' '
          }
          else {
            this.gridData[i].popeningbal = this._commonservice.currencyformat(this.gridData[i].popeningbal) + ' ' + " Dr";
          }
          if (this.gridData[i].pclosingbal < 0) {
            let closingbal = Math.abs(this.gridData[i].pclosingbal)

            this.gridData[i].pclosingbal = this._commonservice.currencyformat(closingbal) + ' ' + " Cr";
          }
          else if (this.gridData[i].pclosingbal == 0) {
            this.gridData[i].pclosingbal = ' '
          }
          else {
            this.gridData[i].pclosingbal = this._commonservice.currencyformat(this.gridData[i].pclosingbal) + ' ' + " Dr";
          }
        }
      })


    }
    else {
      this.validationforledger = true;
    }

    // $("#MultiSelctdropdown").val(null).trigger('change')
  }


  print() {
    let printContents, popupWin;
    printContents = document.getElementById('temp-box').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
   
      <html>
        <head>
          <title>Account Summary</title>
          <link rel="stylesheet" type="text/css" href="assets/css/bootstrap.min.css"/>
          <link rel="stylesheet" href="http://kendo.cdn.telerik.com/2019.3.917/styles/kendo.common.min.css" />
          <link rel="stylesheet" href="http://kendo.cdn.telerik.com/2019.3.917/styles/kendo.default.min.css" />
          <link rel="stylesheet" href="http://kendo.cdn.telerik.com/2019.3.917/styles/kendo.default.mobile.min.css" />
        <link rel="stylesheet" type="text/css" href="assets/css/custom.css" />
         
          <style>
          //........Customized style.......
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }

  public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.gridData, {
        group: this.groups,
        sort: [{ field: "pparentname", dir: "asc" }],
      }).data,
      group: this.groups,
    };

    return result;
  }


  checkValidations(group: FormGroup, validate: boolean): boolean {
debugger
    try {
      Object.keys(group.controls).forEach((key: string) => {
        validate = this.GetValidationByControl(group, key, validate);
      })
    }
    catch (e) {
      this.showErrorMessage(e);
      return false;
    }
    return validate;
  }
  GetValidationByControl(formGroup: FormGroup, key: string, validate: boolean): boolean {
debugger
    try {
      let formcontrol;
      formcontrol = formGroup.get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          this.checkValidations(formcontrol, validate)
        }
        else if (formcontrol.validator) {
          this.accountsummaryvalidations[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonservice.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.accountsummaryvalidations[key] += errormessage + ' ';
                validate = false;
              }
            }
          }
        }
      }
    }
    catch (e) {
      this.showErrorMessage(e);
      return false;
    }
    return validate;
  }
  showErrorMessage(errormsg: string) {

    this._commonservice.showErrorMessage(errormsg);
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
}
