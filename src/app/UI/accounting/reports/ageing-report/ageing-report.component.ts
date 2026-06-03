import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { BrStatementService } from 'src/app/Services/Accounting/br-statement.service';
import { CommonService } from 'src/app/Services/common.service';
@Component({
  selector: 'app-ageing-report',
  templateUrl: './ageing-report.component.html',
  styles: []
})
export class AgeingReportComponent implements OnInit {

  ageingForm: FormGroup;
  public dateConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  currentDate: Date = new Date();
  periodsList: any = [];
  accountsList: any = [];
  typeList: any = [];
  isLoading: boolean = false;
  loading: boolean = false;
  ngloading: boolean = false;
  title: any;
  asondate: any;
  isShowPDF: boolean = false;

  ageingData: any = [];
  monthyear: string;
  period: any;
  accountHeadName: any;
  gridheaders: any;


  constructor(private fb: FormBuilder, private _commonservice: CommonService, private datepipe: DatePipe, private ageingService: BrStatementService, private datePipe: DatePipe) {
    this.dateConfig.showWeekNumbers = false;
    this.dateConfig.dateInputFormat = "DD/MM/YYYY";
  }


  ngOnInit() {
    debugger;
    this.ageingForm = this.fb.group({
      period: [''],
      account: [''],
      date: [this.currentDate],
      type: ['']
    });

    this.periodsList = [{ "name": "Monthly", "value": "MONTHLY" }, { "name": "Quarterly", "value": "QUARTERLY" },
    { "name": "Half-Yearly", "value": "HALF-YEARLY" }, { "name": "Yearly", "value": "YEARLY" }];


    this.typeList = [{ "name": 'Accounts', "value": "Accounts" }];

    this.getAccountHeads();
    this.ageingForm.controls.type.setValue('Accounts')
  }

  getAccountHeads() {
    debugger;
    this.ageingService.getAgeingAccountDetail().subscribe(json => {
      this.accountsList = json;
    })
  }

  accHeadChange(event) {
    debugger;
    this.accountHeadName = event.paccountname;
  }

  periodChange(event){
    debugger;
    this.ageingData = [];
    this.isShowPDF = false;
  }


  printAgeing() {
    debugger;
    let accountname = this.ageingForm.controls.account.value;
    this.period = this.ageingForm.controls.period.value;
    this.asondate = this.datepipe.transform(this.ageingForm.controls.date.value, 'yyyy-MM-dd');
    let type = this.ageingForm.controls.type.value;
    this.title = "Ageing Analysis For The Period Of " + this.period + "";
    this.isLoading = true;
    this.loading = true;

    if (this.period == '') {
      this._commonservice.showWarningMessage("Please Select  Period!");
      this.isShowPDF = false;
      return;
    }

    if (accountname == '') {
      this._commonservice.showWarningMessage("Please Select Account Head!");
      this.isShowPDF = false;
      return;
    }

    if (type == '') {
      this._commonservice.showWarningMessage("Please Select Type!");
      this.isShowPDF = false;
      return;
    }

    this.ageingService.getAgeingReport(accountname, this.asondate, this.period).subscribe(res => {
      this.ageingData = res;
      this.isLoading = false;
      this.loading = false;
      this.isShowPDF = true;
      if (this.ageingData.length == 0) {
        this._commonservice.showWarningMessage('No Data To Show with The Account Head' + ' - ' + this.accountHeadName);
        this.isShowPDF = false;
      }
    });

  }

  pdfOrprint(printorpdf) {
    debugger;
    let Designation;
    if (this.ageingData.length > 0) {
      let rows = [];
      let reportname = "AGEING ANALYSIS" + ' - ' + this.period;
      let accountHead = this.accountHeadName;
      let asOnDate = this.datepipe.transform(this.asondate, 'dd-MMM-yyyy');
      if (this.period == 'MONTHLY') {
        this.gridheaders = [
          ['S.No', 'Accountname', 'Trans. Date', 'Days', '0-30 Days', '31-60 Days', '61-90 Days', '91-120 Days', 'Above 120 Days', 'Amount']
        ];
      }
      else if (this.period == 'QUARTERLY') {
        this.gridheaders = [
          ['S.No', 'Accountname', 'Trans. Date', 'Days', '0-90 Days', '91-180 Days', '181-270 Days', '271-360 Days', 'Above 360 Days', 'Amount']
        ];
      }
      else if (this.period == 'HALF-YEARLY') {
        this.gridheaders = [
          ['S.No', 'Accountname', 'Trans. Date', 'Days', '0-180 Days', '181-360 Days', '361-540 Days', '541-720 Days', 'Above 720 Days', 'Amount']
        ];
      }
      else if (this.period == 'YEARLY'){
        this.gridheaders = [
          ['S.No', 'Accountname', 'Trans. Date', 'Days', '0-1 Years', '1-2 Years', '2-3 Years', '3-4 Years', 'Above 4 Years', 'Amount']
        ];
      }

      let colWidthHeight = {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 'auto', halign: 'center' },
        2: { cellWidth: 'auto', halign: 'center' },
        3: { cellWidth: 'auto', halign: 'right' },
        4: { cellWidth: 'auto', halign: 'right' },
        5: { cellWidth: 'auto', halign: 'right' },
        6: { cellWidth: 'auto', halign: 'right' },
        7: { cellWidth: 'auto', halign: 'right' },
        8: { cellWidth: 'auto', halign: 'right' },
        9: { cellWidth: 'auto', halign: 'right' },
        10: { cellWidth: 'auto', halign: 'right' },

      }
      this.ageingData.forEach((element, index) => {
        debugger
        let upToThirty = this._commonservice.currencyformat(element.pdays30);
        let upToSixty = this._commonservice.currencyformat(element.pdays60);
        let upToNintey = this._commonservice.currencyformat(element.pdays90);
        let upToOneTwenty = this._commonservice.currencyformat(element.pdays120);
        let OneTwenty = this._commonservice.currencyformat(element.pdays150);
        let amount = this._commonservice.currencyformat(element.pamount);
        let serialNumber = index + 1;

        let temp = [
          serialNumber,
          element.pparentaccountname,
          element.pdatdate,
          element.pdays,
          this._commonservice.currencyformat(upToThirty),
          this._commonservice.currencyformat(upToSixty),
          this._commonservice.currencyformat(upToNintey),
          this._commonservice.currencyformat(upToOneTwenty),
          this._commonservice.currencyformat(OneTwenty),
          this._commonservice.currencyformat(amount),


        ]
        rows.push(temp);



      })
      let gridtotals = {};
      gridtotals['upToSixty'] = this.ageingData.reduce((sum, c) => sum + c.pdays60, 0);
      gridtotals['upToSixty'] = this._commonservice.currencyformat(gridtotals['upToSixty']);
      gridtotals['upToThirty'] = this.ageingData.reduce((sum, c) => sum + c.pdays30, 0);
      gridtotals['upToThirty'] = this._commonservice.currencyformat(gridtotals['upToThirty']);
      gridtotals['upToNintey'] = this.ageingData.reduce((sum, c) => sum + c.pdays90, 0);
      gridtotals['upToNintey'] = this._commonservice.currencyformat(gridtotals['upToNintey']);
      gridtotals['upToOneTwenty'] = this.ageingData.reduce((sum, c) => sum + c.pdays120, 0);
      gridtotals['upToOneTwenty'] = this._commonservice.currencyformat(gridtotals['upToOneTwenty']);
      gridtotals['OneTwenty'] = this.ageingData.reduce((sum, c) => sum + c.pdays150, 0);
      gridtotals['OneTwenty'] = this._commonservice.currencyformat(gridtotals['OneTwenty']);
      gridtotals['amount'] = this.ageingData.reduce((sum, c) => sum + c.pamount, 0);
      gridtotals['amount'] = this._commonservice.currencyformat(gridtotals['amount']);


      // // pass Type of Sheet Ex : a4 or lanscspe
      if (printorpdf == "Pdf") {
        this.ageingService._downloadAgeingReport(reportname, accountHead, asOnDate, rows, this.gridheaders, colWidthHeight, "landscape", "As On", (new Date()), null, printorpdf, gridtotals, this.ageingData.length);
      }
      else {
        this.ageingService._downloadAgeingReport(reportname, accountHead, asOnDate, rows, this.gridheaders, colWidthHeight, "landscape", "As On", this._commonservice.getFormatDateGlobal(new Date()), "", printorpdf, gridtotals, this.ageingData.length);
      }
    }
  }


  export(): void{
    let rows = [];
    this.ageingData.forEach(element => {
      let dataobject;
      if (this.period == 'MONTHLY') {
      dataobject = {
        "Account Name": element.pparentaccountname,
        "TRans Date": element.pdatdate,
         "Days": element.pdays,
         "0-30 Days": element.pdays30,
         "31-60 Days":element.pdays60,
         "61-90 Days":element.pdays90,
         "91-120 Days":element.pdays120,
         "Above 120 Days":element.pdays150,
         "Amount":element.pamount,      
        
      }
    }
   else if (this.period == 'QUARTERLY') {
      dataobject = {
        "Account Name": element.pparentaccountname,
        "TRans Date": element.pdatdate,
         "Days": element.pdays,
         "0-90 Days": element.pdays30,
         "91-180 Days":element.pdays60,
         "181-270 Days":element.pdays90,
         "271-360 Days":element.pdays120,
         "Above 360 Days":element.pdays150,
         "Amount":element.pamount,      
        
      }
    }

    else  if (this.period == 'HALF-YEARLY') {
        dataobject = {
          "Account Name": element.pparentaccountname,
          "TRans Date": element.pdatdate,
           "Days": element.pdays,
           "0-180 Days": element.pdays30,
           "181-360 Days":element.pdays60,
           "361-540 Days":element.pdays90,
           "541-720 Days":element.pdays120,
           "Above 720 Days":element.pdays150,
           "Amount":element.pamount,      
          
        }
      }
       else if (this.period == 'YEARLY') {
          dataobject = {
            "Account Name": element.pparentaccountname,
            "TRans Date": element.pdatdate,
             "Days": element.pdays,
             "0-1 Years": element.pdays30,
             "1-2 Years":element.pdays60,
             "2-3 Years":element.pdays90,
             "3-4 Years":element.pdays120,
             "Above 4 Years":element.pdays150,
             "Amount":element.pamount,      
            
          }
    }
      rows.push(dataobject);
    });
    this.ageingService.exportAsExcelFile(rows, 'Ageing Report');
  
  }

}
