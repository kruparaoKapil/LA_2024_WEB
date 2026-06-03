import { Component, OnInit, ViewChild } from '@angular/core';
import { PDFExportComponent } from '@progress/kendo-angular-pdf-export';
import { Workbook } from '@progress/kendo-angular-excel-export';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { LAReportsService } from 'src/app/Services/Banking/lareports.service';
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig } from 'ngx-bootstrap';

@Component({
  selector: 'app-interest-report-detailed',
  templateUrl: './interest-report-detailed.component.html',
  styles: []
}) 
export class InterestReportDetailedComponent implements OnInit {
  @ViewChild('pdfExport', { static: true }) pdfExport!: PDFExportComponent;
    excelinterestlist:any[] = [];

      maturityDetailsReportForm:FormGroup;
         public today: Date = new Date();
         maturityList: any = [];
        IssuedChequeValidation: any = {};
        showdate = true;
        todate: any;
        selecteddate = true;
        betweendates: any;
        FromDate: any;
        inbetween: any;
        betweenfrom: any;
        betweento: any;
        fromdate: any;
        hidegridcolumn = true;
        date: any;
        validation = false;
        maturityDetailsList: any = [];
        fromDates: any;
        toDates: any;
        Type: any = 'Pre-Maturity';
        gridData: any = [];
        monthList: string[] = [];
        mothsToShowData : any[] = [];
        mothsToShowDataList : any[] = [];
        matchedKeys: any[] = [];
        // monthstoShow = [
        //   { id: 0, monthName: "pjan25" },
        //   { id: 1, monthName: "pfeb25" },
        //   { id: 2, monthName: "pmarch25" },
        //   { id: 3, monthName: "papril25" },
        //   { id: 4, monthName: "pmay25" },
        //   { id: 5, monthName: "pjun25" },
        //   { id: 6, monthName: "pjul25" },
        //   { id: 7, monthName: "paug25" },
        //   { id: 8, monthName: "psep25" },
        //   { id: 9, monthName: "poct25" },
        //   { id: 10, monthName: "pnov25" },
        //   { id: 11, monthName: "pdec25" },
        // ];
        
        public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
        public dppConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  totalFDAmount: any;
  gridheaders: any;
       
          constructor(private fb:FormBuilder , private _CommonService: CommonService, private datepipe: DatePipe, private formbuilder:FormBuilder, private maturityService:LAReportsService) { 
            this.dpConfig.dateInputFormat = 'DD/MM/YYYY';
            this.dpConfig.containerClass = 'theme-dark-blue';
            //this.dpConfig.maxDate = new Date();
            this.dpConfig.showWeekNumbers = false;
            this.dppConfig.dateInputFormat = 'DD/MM/YYYY';
            this.dppConfig.containerClass = 'theme-dark-blue';
            //this.dppConfig.minDate = new Date();
            this.dppConfig.showWeekNumbers = false;
          }
  
    ngOnInit() {
     
      this.maturityDetailsReportForm = this.formbuilder.group({
        fromDate: [this.today],
        toDate: [this.today],
  
        dfromdate: [this.today],
        dtodate: [this.today],
        date: [''],
        pMaturityType: [''],
      })
  
      // this.FromDate = 'From Date'
      // this.date = new Date();
      // this.betweendates = "ASON"
      // this.inbetween = ""
      // this.showdate = false;
      // this.todate = "";
      // this.FromDate = ''
      // this.hidegridcolumn = true;
  
      // this.maturityDetailsReportForm['controls']['date'].setValue(true)
      // this.maturityDetailsReportForm['controls']['dfromdate'].setValue(this.date);
      // this.maturityDetailsReportForm['controls']['dtodate'].setValue(this.date);
      // this.betweenfrom = this.datepipe.transform(this.date, "dd-MMM-yyyy");
  
      // this.maturityDetailsReportForm.controls.dfromdate.setValue(this.today);
      // this.maturityDetailsReportForm.controls.dtodate.setValue(this.today);

  
      }
  
      // checkox(event) {
  
      //   this.maturityDetailsReportForm.controls.dfromdate.setValue(new Date());
      //   this.maturityDetailsReportForm.controls.dtodate.setValue(new Date());
    
      //   this.gridData = []
      //   if (event.target.checked == false) {
      //     this.selecteddate = false
      //     this.showdate = true;
      //     this.betweendates = "Between"
      //     this.FromDate = 'From Date'
      //     this.inbetween = "and";
      //     this.validationfordates();
      //     this.betweenfrom = this.datepipe.transform(this.fromdate, "dd-MMM-yyyy");
      //     this.betweento = this.datepipe.transform(this.todate, "dd-MMM-yyyy");
    
      //     this.hidegridcolumn = false;
    
    
      //   }
      //   else {
      //     this.betweendates = "ASON"
      //     this.inbetween = ""
      //     this.showdate = false;
      //     this.selecteddate = true;
      //     this.todate = "";
      //     this.FromDate = '';
      //     this.betweento = ""
      //     this.betweenfrom = this.datepipe.transform(this.date, "dd-MMM-yyyy");
      //     this.hidegridcolumn = true;
      //   }
      // }
    
      checkfromdate(event) {
    
        // debugger
        // this.fromdate = this.maturityDetailsReportForm['controls']['dfromdate'].setValue(event);;
        // this.fromdate = this.datepipe.transform(this.fromdate, "dd/MM/yyyy");
        // this.validationfordates()
        // if (this.fromdate > this.todate) {
        //   this.validation = true;
        // }
        // else {
        //   this.validation = false;
        // }
    
      }
      checktodate(event) {
        // debugger
        // this.todate = this.maturityDetailsReportForm['controls']['dtodate'].setValue(event);
        // this.todate = this.datepipe.transform(this.todate, "dd/MM/yyyy");
    
        // this.validationfordates()
        // if (this.fromdate > this.todate) {
        //   this.validation = true;
        // }
        // else {
        //   this.validation = false;
        // }
    
      }
      // validationfordates() {
    
      //   let isValid = true;
    
    
      //   if (this.selecteddate == true) {
      //     this.fromdate = this.maturityDetailsReportForm.controls.dfromdate.value
      //     this.todate = this.maturityDetailsReportForm.controls.dfromdate.value
      //   }
      //   else {
      //     this.fromdate = this.maturityDetailsReportForm.controls.dfromdate.value
      //     this.todate = this.maturityDetailsReportForm.controls.dtodate.value
      //   }
      //   this.fromdate = this.datepipe.transform(this.fromdate, "yyyy/MM/dd");
      //   this.todate = this.datepipe.transform(this.todate, "yyyy/MM/dd");
      //   return isValid
      // }

      // getMonthsInRange(from: Date, to: Date): string[] {
      //   debugger;
      //   const months = [];
      //   const date = new Date(from); 
      //   let count = 0;
    
      //   while (date <= to && count < 12) {
      //     const month = date.toLocaleString('default', { month: 'short' });
      //     const year = date.getFullYear().toString().slice(-2);
      //     months.push(`${month}-${year}`);
      //     date.setMonth(date.getMonth() + 1);
      //     count++;
      //   }
    
      //   return months;
      // }
      getMonthsInRange(from: Date, to: Date): string[] {
        const months = [];
        const date = new Date(from.getFullYear(), from.getMonth(), 1); 
        const end = new Date(to.getFullYear(), to.getMonth(), 1); 
        let count = 0;
      
        while (date <= end && count < 12) {
          const month = date.toLocaleString('default', { month: 'short' });
          const year = date.getFullYear().toString().slice(-2);
          months.push(`${month}-${year}`);
          date.setMonth(date.getMonth() + 1);
          count++;
        }
      
        return months;
      }
      
    

      // getMaturityDetails(){
      //   debugger;  
       
        
      //   const fromDate = this.datepipe.transform(this.maturityDetailsReportForm.controls.dfromdate.value, "yyyy/MM/dd");
      //   const toDate = this.datepipe.transform(this.maturityDetailsReportForm.controls.dtodate.value, "yyyy/MM/dd");
      //   const fromDate2 = this.maturityDetailsReportForm.controls.dfromdate.value;
      //   const toDate2 = this.maturityDetailsReportForm.controls.dtodate.value;
    
      //   this.fromDates = this.datepipe.transform(this.maturityDetailsReportForm.controls.dfromdate.value, "yyyy/MM/dd");
      //   this.toDates = this.datepipe.transform(this.maturityDetailsReportForm.controls.dtodate.value, "yyyy/MM/dd");
        
      //   this.monthList = [];
      //   this.monthList = this.getMonthsInRange(fromDate2, toDate2);
      //   console.log("these are months : ",this.monthList);
      //   this.excelinterestlist = [];
      //   let startMonthNo = fromDate2.getMonth();
      //   let endMonthNo = toDate2.getMonth();

      //   this.mothsToShowData = [];
      //   this.mothsToShowDataList = [];

      //   for (let i = startMonthNo; i <= endMonthNo; i++) {
      //     this.mothsToShowData.push(this.monthstoShow[i].monthName);
      //   }

      //   this.mothsToShowDataList = this.mothsToShowData;

      //   console.log("These are HTML months:", this.mothsToShowDataList);
      //   this.maturityService.getInterestpaymentdetails(fromDate,toDate).subscribe(res =>{
      //     if(res){
      //       console.log("this is data : ",res);
      //       this.excelinterestlist = res;
      //       for (let i = 0; i < this.excelinterestlist.length; i++) {
      //         let total = 0;
      //         for (let k = 0; k < this.mothsToShowDataList.length; k++) {
      //           const monthKey = this.mothsToShowDataList[k];
      //           const value = parseFloat(this.excelinterestlist[i][monthKey]) || 0;
      //           total += value;
      //         }
      //         this.excelinterestlist[i].pGrandtotal = total;
      //       }
      //     }
      //   });
        
        
      

      //   // this.excelinterestlist =[
      //   //   {
      //   //     s_no:1,Member:'fghfg' , FD_Amount:345,Applicant_Date:'4-23-52003', 
      //   //     Tenure:58,Interest_Rate:56 ,Mode_of_Interest:566675,Jan_24:5464,
      //   //     Feb_24:5,Mar_24:65,Apr_24:7868,May_24:3424,Jun_24:2342,Jul_24:432,
      //   //     Aug_24:434,Sep_24:45345,Oct_24:675,Nov_24:423,Dec_24:6786,Grand_Total:54345435,
      //   //     monthList: [
      //   //       {month:300},
      //   //       {month:400},
      //   //       {month:500},
      //   //       {month:600}
      //   //   ]
      //   //   }
      //   //   ]
    
      //   // this.maturityService.getPreMaturityMonthWise(this.Type,this.betweendates,fromDate,toDate).subscribe(details => {
      //   //   this.maturityDetailsList = details;
      //   //   console.log("month wise : ",this.maturityDetailsList);
      //   //   if(this.maturityDetailsList.length == 0){
      //   //     this._CommonService.showWarningMessage('No Data To Show');
      //   //   }
      //   // })
      // }
      getMaturityDetails() {
        debugger;
        // this.isLoading = true;
        const fromDate2: Date = this.maturityDetailsReportForm.controls.dfromdate.value;
        const toDate2: Date = this.maturityDetailsReportForm.controls.dtodate.value;
    
        const fromDate = this.datepipe.transform(fromDate2, 'yyyy-MM-dd');
        const toDate = this.datepipe.transform(toDate2, 'yyyy-MM-dd');
    
        this.monthList = [];
        this.monthList = this.getMonthsInRange(fromDate2, toDate2);
        console.log('These are months:', this.monthList);
        this.mothsToShowData = [];
        this.mothsToShowDataList = [];
        this.excelinterestlist = [];
        this.matchedKeys = [];
        this.maturityService.getInterestpaymentdetails(fromDate,toDate).subscribe(res =>{
          if(res){
            console.log("this is data : ",res);
            this.excelinterestlist = res;
            // for (let i = 0; i < this.excelinterestlist.length; i++) {
            //   let total = 0;
            //   for (let k = 0; k < this.mothsToShowDataList.length; k++) {
            //     const monthKey = this.mothsToShowDataList[k];
            //     const value = parseFloat(this.excelinterestlist[i][monthKey]) || 0;
            //     total += value;
            //   }
            //   this.excelinterestlist[i].pGrandtotal = total;
            // }
           // this.totalFDAmount = this.excelinterestlist.reduce((sum, c) => sum + parseFloat(c.pdepositeamount), 0);
           if(this.excelinterestlist){
            console.log(true,this.excelinterestlist);
           for (const monthStr of this.monthList) {
            const [month, year] = monthStr.split('-');
            const key = 'p' + month.toLowerCase() + year;
              
              for (const item of this.excelinterestlist) {
                if (item.hasOwnProperty(key)) {
                  this.matchedKeys.push(key);
                  break;
                }
              }
            }
            
            console.log("this is matched keys : ",this.matchedKeys);
          }
          
          }
          if(this.excelinterestlist.length ==0)
          this._CommonService.showWarningMessage('No Data To Show');
        });
    
        
      }

      trackByFn(index, item) {
        return index; // or item.id
      }

      exportToExcel(): void {
        debugger;
        const rows: any[] = [];
      
        const border = { color: '#000000', size: 1 };
        const borderAll = { top: border, bottom: border, left: border, right: border };
      
        const headerStyle = {
          bold: true,
          background: '#003366',
          color: '#FFFFFF',
          textAlign: 'center',
          verticalAlign: 'center',
          border: borderAll
        };
      
        const cellStyle = {
          border: borderAll,
          textAlign: 'center',
          verticalAlign: 'center'
        };
      
        const currencyPipe = (value: any): string => {
          return typeof value === 'number' ? value.toFixed(2) : (value || '0');
        };
      
      
        const staticHeaders = ['S.NO', 'Member', 'Certificate Amount', 'Applicant Date', 'Tenure', 'Interest Rate', 'Mode Of Interest'];
        const monthHeaders = this.monthList || [];
        const finalHeaders = [...staticHeaders, ...monthHeaders, 'Grand Total','Payment Type','TDS Status'];
      
        // Push header row
        rows.push({
          cells: finalHeaders.map(header => ({
            value: header,
            ...headerStyle
          }))
        });
      
        // Add table rows from data
        if (this.excelinterestlist) {
          this.excelinterestlist.forEach((details: any, index: number) => {
            const rowCells: any[] = [];
            let pDate = this.datepipe.transform(new Date(details.pdepositedate), "dd-MM-yyyy")

            rowCells.push({ value: index + 1, ...cellStyle });
            rowCells.push({ value: details.pMembername || '', ...cellStyle });
            rowCells.push({ value: details.pdepositeamount || '', ...cellStyle });
            rowCells.push({ value: pDate || '', ...cellStyle });
            rowCells.push({ value: details.ptenor || '', ...cellStyle });
            rowCells.push({ value: details.pinterestrate || '', ...cellStyle });
            rowCells.push({ value: details.pInterestpayout || '', ...cellStyle });
            rowCells.push({ value: details.pGrandtotal || '', ...cellStyle });
          
            for (const month of this.matchedKeys || []) {
              const val = details[month];
              rowCells.push({ value: currencyPipe(val), ...cellStyle });
            }
      
            rowCells.push({ value: currencyPipe(details.pGrandtotal), ...cellStyle });
            rowCells.push({ value: details.ppaymenttype || '', ...cellStyle });
            rowCells.push({ value: details.pTDSnotdedut || '', ...cellStyle });
      
            rows.push({ cells: rowCells });
          });
        }
      
        const columnWidths = finalHeaders.map(() => ({ width: 120 }));
      
        const workbook = new Workbook({
          sheets: [{
            name: 'Detailed Interest Details',
            rows: rows,
            columns: columnWidths
          }]
        });
      
        workbook.toDataURL().then((dataUrl) => {
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = 'Detailed_Interest_Report.xlsx';
          link.click();
        });
      }

    

  pdfOrprint(printorpdf) {
    debugger;
    if (this.excelinterestlist.length > 0) {
      let rows = [];
      const fromDate2: Date = this.maturityDetailsReportForm.controls.dfromdate.value;
        const toDate2: Date = this.maturityDetailsReportForm.controls.dtodate.value;
      let fromDates = this.datepipe.transform(fromDate2, 'dd-MM-yyyy');
        let toDates = this.datepipe.transform(toDate2, 'dd-MM-yyyy');
      let reportname = "Interest Report "+fromDates + 'To ' + toDates ;

      if(this.monthList.length == 2){
        this.gridheaders = ["S.NO", "Member", "FD Amount", "Applicant Date", "Tenure","Interest Rate","Mode Of Interest",this.monthList[0],this.monthList[1]];
      }
      if(this.monthList.length == 3){
      this.gridheaders = ["S.NO", "Member", "FD Amount", "Applicant Date", "Tenure","Interest Rate","Mode Of Interest",this.monthList[0],this.monthList[1],this.monthList[2]];
      }
      let format = "";
      let fromDate = "";
      let toDate = new Date();

      let colWidthHeight = {
        0: { cellWidth: '20', halign: 'center' }, 1: { cellWidth: '30', halign: 'center' }, 2: { cellWidth: '25', halign: 'right' }, 3: { cellWidth: '30', halign: 'center' }, 4: { cellWidth: 20, halign: 'center' }
      }
      this.excelinterestlist.forEach((element, index) => {
        debugger;
        let temp;
        let serialNumber = index + 1;

        let pdepositeamount = this._CommonService.currencyformat(element.pdepositeamount);
        
        let pdepositedate = this.datepipe.transform(element.pdepositedate, 'dd-MM-yyyy') ;
     
        temp = [serialNumber, element.pMembername, pdepositeamount,pdepositedate,element.ptenor,element.pinterestrate,element.pInterestpayout,this.excelinterestlist[0].mothsToShowDataList[0],this.excelinterestlist[0].mothsToShowDataList[1],this.excelinterestlist[0].mothsToShowDataList[2]];
        rows.push(temp);
      });
      //Grand Totals
      let gridtotals={};
      gridtotals['grandtotal'] = this._CommonService.currencyformat(this.totalFDAmount);
      let total=["","Grand Total : ",gridtotals['grandtotal'],"",""];
      rows.push(total);

      this.maturityService._downLoadLoyaltystatementPDF(reportname, rows, this.gridheaders, colWidthHeight, "landscape", "", fromDate, toDate, printorpdf);
    }
    else {
      this._CommonService.showInfoMessage("No Data");
    }
  }
  
  }
