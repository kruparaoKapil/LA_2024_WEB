import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonService } from '../common.service';
import { Observable } from 'rxjs';
import * as jsPDF from 'jspdf';
import { formatDate } from '@angular/common';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
import * as FileSaver from 'file-saver';


const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class BrStatementService {
  tableData: any=[];

  constructor(private http: HttpClient, private _CommonService: CommonService) { }

  GetBrStatementReportbyDates(fromdate,pBankAccountId): Observable<any> {
    try {
      
      const params = new HttpParams().set('fromdate', fromdate).set('_pBankAccountId', pBankAccountId);
      return this._CommonService.callGetAPI('/Accounting/AccountingReports/GetBrs', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  //bhragavi
// setTableData(data: any[]) {
//     this.tableData=data;
//   }

//   //   Called from preview component
//   getTableData() {
//     return this.tableData();
//   }
  //bhrgavi

  GetBrStatementReportbyDates1(fromDate,pBankAccountId): Observable<any> {
    try {
      
      const params = new HttpParams().set('fromDate', fromDate).set('pBankAccountId', pBankAccountId);
      return this._CommonService.callGetAPI('/Accounting/AccountingReports/GetBrs1', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  //Accounting/AccountingReports/GetBrsamoune
  GetBrsamoune(_pBankAccountId): Observable<any> {
    try {
      
      const params = new HttpParams().set('_pBankAccountId', _pBankAccountId);
      return this._CommonService.callGetAPI('/Accounting/AccountingReports/GetBrsamoune', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  // 
  UpdateScheduleid(asondate,ConnInfo): Observable<any> {
    debugger;
    const params = new HttpParams().set('asondate',asondate).set('ConnInfo',ConnInfo);                        
    return this._CommonService.getReportAPI('/api/Reports/ChitReports/UpdateScheduleid',params,'Yes');
  }

  //Accounting/AccountingTransactions/SaveBrs

  saveBRS(brsData) {
    
    return this._CommonService.callPostAPI('/Accounting/AccountingTransactions/SaveBrs', brsData)
  }

  //api/Accounting/AccountingTransactions/Getbrscount

  Getbrscount(brsdate): Observable<any> {
    try {
      
      const params = new HttpParams().set('brsdate', brsdate);
      return this._CommonService.callGetAPI('/Accounting/AccountingTransactions/Getbrscount', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }
/* bhargavi start */
  // api/Accounting/AccountingReports/SaveProductProjectionList  
 saveProjection(projectionData):Observable<any> {
     return this._CommonService.callPostAPI('/Accounting/AccountingReports/SaveacheivedProjectionList', projectionData)
  }

  ///api/Accounting/AccountingReports/GetAllProjections
 Getprojections( ): Observable<any> {
     return this._CommonService.callGetAPI('/Accounting/AccountingReports/GetAllProjections', '','NO');
  }

/* bhargavi end */
  //accounting/accountingtransactions/GetAgeingReport

  getAgeingReport(accountid,fromdate,period): Observable<any> {
    try {
      
      const params = new HttpParams().set('accountid', accountid).set('fromdate', fromdate).set('period', period);
      return this._CommonService.callGetAPI('/accounting/accountingtransactions/GetAgeingReport', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  //accounting/accountingtransactions/GetAgeingAccountDetails

  getAgeingAccountDetail() {
    debugger;

    return this._CommonService.callGetAPI('/accounting/accountingtransactions/GetAgeingAccountDetails', '' ,'NO');

  }

  _downloadAgeingReport(reportName,accountHead,asOnDate, gridData, gridheaders, colWidthHeight, pagetype, betweenorason, fromdate, todate, printorpdf,gridtotals,empCount) {
    debugger;
    let address = this._CommonService.comapnydetails.pAddress1 + ' ' + this._CommonService.comapnydetails.pAddress2 + ' ' + this._CommonService.comapnydetails.pDistrict + ' ' + this._CommonService.comapnydetails.pcity + ' ' + this._CommonService.comapnydetails.pState + ' - ' + this._CommonService.comapnydetails.pPincode;
    //let Companyreportdetails = this.comapnydetails;;
    let Companyreportdetails = this._CommonService.comapnydetails;
    let doc = new jsPDF(pagetype);
    //let currencyformat = this._CommonService.currencysymbol;
    //let rupeeImage = this._CommonService._getRupeeSymbol();
    let kapil_logo = this._CommonService.getKapilGroupLogo();
     //Sowjanya Starts//

     let pageSize = doc.internal.pageSize;
     console.log(`Page Size: ${pageSize}`);

     let pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
     console.log(`Page Width: ${pageWidth}`);

    //  if (Companyreportdetails.pCompanyName === "BVM DIGITAL MEDIA PVT LTD") {
    //    let BVM_Img = this._CommonService.getBvmLogo();

    //    doc.addImage(BVM_Img, 'PNG', 265,5);
    //  }


    // Sowjanya Ends//
    // let doc = new jsPDF('lanscape');
    let totalPagesExp = '{total_pages_count_string}'
    let today = formatDate(new Date(), 'dd-MMM-yyyy  h:mm:ss a', 'en-IN');
   var lMargin = 15; //left margin in mm
   var rMargin = 15; //right margin in mm
   var pdfInMM;
   let pageheight;
   let data2;

    var raw = gridData;
    var body = []
  
    for (var i = 0; i < raw.length; i++) {
      var row = []
      
      for (var key in raw[i]) {
        row.push(raw[i][key])

      }
    //   if (i % 2 === 0) {
    //     row.unshift({
    //       rowSpan: 2,
    //       content: row[1],
    //       styles: { valign: 'middle', halign: 'left'},
    //     })
    //     row.splice(2,1);
    //   }
    //   if (i % 2 === 0) {
    //     row.unshift({
    //       rowSpan: 2,
    //       content: row[1],
    //       styles: { valign: 'middle', halign: 'left'},
    //     })
    //     row.splice(2,1);
    //   }

      body.push(row);

    }
    doc.autoTable({
      head: gridheaders,
      body: body,
      theme: 'grid',//'striped'|'grid'|'plain'|'css' = 'striped'
      headStyles: {
        fillColor: this._CommonService.pdfProperties("Header Color"),
        halign: this._CommonService.pdfProperties("Header Alignment"),
        fontSize: this._CommonService.pdfProperties("Header Fontsize")
      }, // Red
      styles: {
        cellPadding: 1, fontSize: this._CommonService.pdfProperties("Cell Fontsize"), cellWidth: 'wrap',
        rowPageBreak: 'avoid',
        overflow: 'linebreak'
      },
      // Override the default above for the text column
      columnStyles: colWidthHeight,
      startY: 48,
      showHead: 'everyPage',//|'everyPage'|'never' = 'firstPage''
      showFoot: 'lastPage',
      didDrawPage: function(data) {

        let pageSize = doc.internal.pageSize;
        let pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
        let pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        data2 = data;
        // Header
        doc.setFontStyle('normal');
        if (doc.internal.getNumberOfPages() == 1) {
          debugger;
          doc.setFontSize(15);
          if (pagetype == "a4") {

            doc.addImage(kapil_logo, 'JPEG', 270, 5)
            doc.setTextColor('black');
            doc.setFont("helvetica", "bold");
            //doc.text(Companyreportdetails.pCompanyName, 60, 10);
           //doc.text(Companyreportdetails.pCompanyName, 75, 10);
           //syam
           doc.text(Companyreportdetails.pCompanyName, pageWidth/2,20,{align:'center'});

            doc.setFontSize(8);
            doc.setFont("helvetica", "bold");
            //doc.text(address, 40, 17, 0, 0, 'left');
            doc.text(address, pageWidth/2,20,{align:'center'});
            //doc.text(address, 60, 17, 0, 0, 'left');
            if (!isNullOrEmptyString(Companyreportdetails.pCinNo)) {
              doc.text('CIN : ' + Companyreportdetails.pCinNo + '', 100, 26);
            }
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
              doc.text(reportName, 100, 32);
            doc.setFontSize(10);
            // if (betweenorason == "Between") {

            //   doc.text('Between  : ' + fromdate + '  And  ' + todate + ' ', 15, 57);
            // }
            // else if (betweenorason == "As on") {

            //   if (fromdate != "") {
            //     doc.text('As on  : ' + fromdate + '', 15, 57);
            //   }
            // }
            doc.text('Branch : ' + Companyreportdetails.pBranchname + '', 163, 40 ,{align:'center'});
            doc.setDrawColor(0, 0, 0);
            pdfInMM = 233;
            doc.line(10, 43, (pdfInMM - lMargin - rMargin), 43) // horizontal line
          }
          if (pagetype == "landscape") {
            doc.addImage(kapil_logo, 'JPEG', 15, 5)
            doc.setTextColor('black');
            //doc.text(Companyreportdetails.pCompanyName, 110, 10);
            //doc.text(Companyreportdetails.pCompanyName, 100, 10);
            //syam
            doc.setFont("helvetica", "bold");

            doc.text(Companyreportdetails.pCompanyName, pageWidth/2, 10,{align:'center'});
            doc.setFontSize(10);
            //doc.text(address, 80, 17, 0, 0, 'left');
            doc.setFont("helvetica", "bold");
            doc.text(address, pageWidth/2,18,{align:'center'});
            //doc.text(address, 80, 17, 0, 0, 'left');
            doc.setFont("helvetica", "bold");
            if (!isNullOrEmptyString(Companyreportdetails.pCinNo)) {
              doc.text('CIN : ' + Companyreportdetails.pCinNo + '', 120, 22);
            }
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
              doc.text(reportName, 110, 32);

              doc.setFontSize(10);
              //  doc.text('Printed On : ' + today + '', 15, 57);
              doc.setFont("helvetica", "bold");
              doc.text('Branch : ' + Companyreportdetails.pBranchname + '', 235, 42);
              doc.text('As On : ' + asOnDate + '', 10, 42);
              doc.text('' + accountHead + '', 130, 42);
              doc.setDrawColor(0, 0, 0);
              pdfInMM = 315;
              doc.line(10, 45, (pdfInMM - lMargin - rMargin), 45) // horizontal line
            doc.setFontSize(10);
            // if (betweenorason == "Between") {

            //   doc.text('Between  : ' + fromdate + '  And  ' + todate + ' ', 15, 58);
            // }
            // else if (betweenorason == "As on") {

            //   if (fromdate != "") {
            //     doc.text('As on  : ' + fromdate + '', 15, 58);
            //   }
            // }
            // doc.text('Printed On : ' + today + '', 15, 57);
          }

        }
        else {

          data.settings.margin.top = 20;
          data.settings.margin.bottom = 15;
        }
      
        var pageCount = doc.internal.getNumberOfPages();
        if (doc.internal.getNumberOfPages() == totalPagesExp) {
          debugger;

        }
        // Footer
        let page = "Page " + doc.internal.getNumberOfPages()
        // Total page number plugin only available in jspdf v1.0+
        if (typeof doc.putTotalPages === 'function') {
          debugger;
          page = page + ' of ' + totalPagesExp
        }
        doc.line(5, pageHeight - 10, (pdfInMM - lMargin - rMargin), pageHeight - 10) // horizontal line

        doc.setFontSize(10);
        doc.text("Printed on : " + today, data.settings.margin.left, pageHeight - 5);

        //doc.text(officeCd, pageWidth / 2, pageHeight - 5, 'center');
        doc.text(page, pageWidth - data.settings.margin.right - 20, pageHeight - 5);

      },
      didDrawCell: function(data) {

        if ((data.column.index == 23||data.column.index == 3 || data.column.index == 4 || data.column.index == 5 || data.column.index == 6 || data.column.index == 7 || data.column.index == 8 || data.column.index == 9 || data.column.index == 10 || data.column.index == 11 || data.column.index == 12 || data.column.index == 13 || data.column.index == 14 || data.column.index == 15 || data.column.index == 16 || data.column.index == 17 || data.column.index == 18 || data.column.index == 19 || data.column.index == 20 || data.column.index == 21 || data.column.index == 22) && data.cell.section === 'body') {

          var td = data.cell.raw;
        //   if (td) {
        //     if (currencyformat == "₹") {
        //       var textPos = data.cell.textPos;
        //       doc.setFontStyle('normal');
        //       doc.addImage(rupeeImage, textPos.x - data.cell.contentWidth, textPos.y + 0.5, 1.5, 1.5);
        //     }
        //   }

        }

      }
    });

  const employeeCount =gridData.length;
 // console.log('employeeCount'+employeeCount);
 console.log('employeeCount'+employeeCount);



    doc.setFontSize(10);
    ///By Ramakanth adding extra page for the totals : 27-09-2021
    if(doc.autoTable.previous.finalY+50 < doc.internal.pageSize.getHeight() - 15)
    {
    doc.setFont("helvetica", "bold");
    //doc.text('Totals ', 20, doc.autoTable.previous.finalY + 8);
    doc.setFont("helvetica", "normal");
   // doc.text('No.of Employes        :'+empCount['No of Employees'], 20, doc.autoTable.previous.finalY +10 );

    // doc.text('Basic                  :'+"     "+gridtotals['basic'], 20, doc.autoTable.previous.finalY + 15);
    // if (currencyformat == "₹") {
    //   doc.addImage(rupeeImage, 'JPEG', 54, doc.autoTable.previous.finalY + 13, 1.9, 1.9);

    // }
    // doc.text('VDA                    :'+"     "+gridtotals['vda'], 20, doc.autoTable.previous.finalY + 20);
    // if (currencyformat == "₹") {
    //   doc.addImage(rupeeImage, 'JPEG', 54, doc.autoTable.previous.finalY + 18, 1.9, 1.9);
    // }
    // doc.text('Arrears               :'+"     "+gridtotals['arrears'], 20, doc.autoTable.previous.finalY + 25);
    // if (currencyformat == "₹") {
    //   doc.addImage(rupeeImage, 'JPEG', 54, doc.autoTable.previous.finalY + 23, 1.9, 1.9);
    // }
    // doc.text('Basic Protection :'+"     "+gridtotals['basicprotection'], 20, doc.autoTable.previous.finalY + 30);
    // if (currencyformat == "₹") {
    //   doc.addImage(rupeeImage, 'JPEG', 54, doc.autoTable.previous.finalY + 28, 1.9, 1.9);
    // }
    // doc.text('Allowances         :'+"     "+gridtotals['allowances'], 20, doc.autoTable.previous.finalY + 35);
    // if (currencyformat == "₹") {
    //   doc.addImage(rupeeImage, 'JPEG', 54, doc.autoTable.previous.finalY + 33, 1.9, 1.9);
    // }
    // doc.text('Special Allowance     :'+"     "+gridtotals['specialallowance'], 120, doc.autoTable.previous.finalY + 15);
    // if (currencyformat == "₹") {
    //   doc.addImage(rupeeImage, 'JPEG', 162, doc.autoTable.previous.finalY + 13, 1.9, 1.9);
    // }
    // doc.text('Increment Protection :'+"     "+gridtotals['incrementprotection'], 120, doc.autoTable.previous.finalY + 20);
    // if (currencyformat == "₹") {
    //   doc.addImage(rupeeImage, 'JPEG', 162, doc.autoTable.previous.finalY + 18, 1.9, 1.9);
    // }
    // doc.text('Advance                    :'+"     "+gridtotals['advances'], 120, doc.autoTable.previous.finalY + 25);
    // if (currencyformat == "₹") {
    //   doc.addImage(rupeeImage, 'JPEG', 162, doc.autoTable.previous.finalY + 23, 1.9, 1.9);
    // }
    // doc.text('Insurance                  :'+"     "+gridtotals['insurance'], 120, doc.autoTable.previous.finalY + 30);
    // // if (currencyformat == "₹") {
    // //   doc.addImage(rupeeImage, 'JPEG', 162, doc.autoTable.previous.finalY + 28, 1.9, 1.9);
    // // }
    // doc.text('Recoveries                :'+"     "+gridtotals['recoveries'], 120, doc.autoTable.previous.finalY + 35);
    // if (currencyformat == "₹") {
    //   doc.addImage(rupeeImage, 'JPEG', 162, doc.autoTable.previous.finalY + 33, 1.9, 1.9);

    // }


    //Sowjanya 14-11-2024//
    // doc.setFont("helvetica", "bold");
    // doc.text('No.Of Employes :'+" "+empCount, 220, doc.autoTable.previous.finalY +8);
    // doc.setFont("helvetica", "normal");
    // //sowjanya Ends//
    // doc.text('Income Tax :'+"     "+gridtotals['incometax'], 220, doc.autoTable.previous.finalY +15);
    // // if (currencyformat == "₹") {
    // //   doc.addImage(rupeeImage, 'JPEG', 245, doc.autoTable.previous.finalY + 13, 1.9, 1.9);
    // // }
    // doc.text('PF               :'+"     "+gridtotals['pf'], 220, doc.autoTable.previous.finalY + 20);
    // // if (currencyformat == "₹") {
    // //   doc.addImage(rupeeImage, 'JPEG', 245, doc.autoTable.previous.finalY + 18, 1.9, 1.9);
    // // }
    // doc.text('ESI              :'+"     "+gridtotals['esi'], 220, doc.autoTable.previous.finalY + 25);
    // // if (currencyformat == "₹") {
    // //   doc.addImage(rupeeImage, 'JPEG', 245, doc.autoTable.previous.finalY + 23, 1.9, 1.9);
    // // }
    // doc.text('Absent        :'+"     "+gridtotals['absenties'], 220, doc.autoTable.previous.finalY + 30);
    // // if (currencyformat == "₹") {
    // //   doc.addImage(rupeeImage, 'JPEG', 245, doc.autoTable.previous.finalY + 28, 1.9, 1.9);
    // // }
    // doc.text('Prof. Tax     :'+"     "+gridtotals['proftax'], 220, doc.autoTable.previous.finalY + 35);
    // // if (currencyformat == "₹") {
    // //   doc.addImage(rupeeImage, 'JPEG', 245, doc.autoTable.previous.finalY + 33, 1.9, 1.9);
    // // }
    doc.setDrawColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    pdfInMM = 315;
    doc.line(10, doc.autoTable.previous.finalY + 5, (pdfInMM - lMargin - rMargin), doc.autoTable.previous.finalY + 5);
    doc.text('Total :', 90, doc.autoTable.previous.finalY + 10);
    doc.text(''+"    "+gridtotals['upToThirty'], 130, doc.autoTable.previous.finalY + 10);
    // if (currencyformat == "₹") {
    //   doc.addImage(rupeeImage, 'JPEG', 59, doc.autoTable.previous.finalY + 43, 1.9, 1.9);
    // }
    doc.text(''+"    "+gridtotals['upToSixty'], 158, doc.autoTable.previous.finalY + 10);
    doc.text(''+"    "+gridtotals['upToNintey'], 185, doc.autoTable.previous.finalY + 10);
    doc.text(''+"    "+gridtotals['upToOneTwenty'], 216, doc.autoTable.previous.finalY + 10);
    doc.text(''+"    "+gridtotals['OneTwenty'], 240, doc.autoTable.previous.finalY + 10);
    doc.text(''+"    "+gridtotals['amount'], 262, doc.autoTable.previous.finalY + 10);
    // if (currencyformat == "₹") {
    //   doc.addImage(rupeeImage, 'JPEG', 154, doc.autoTable.previous.finalY + 43, 1.9, 1.9);
    // }
    // doc.text('Total Net Salary:'+"    "+gridtotals['amount'], 220, doc.autoTable.previous.finalY + 10);
    // if (currencyformat == "₹") {
    //   doc.addImage(rupeeImage, 'JPEG', 253,doc.autoTable.previous.finalY + 43, 1.9, 1.9);
    // }
    doc.setDrawColor(0, 0, 0);
    pdfInMM = 315;
    doc.line(10, doc.autoTable.previous.finalY + 15, (pdfInMM - lMargin - rMargin), doc.autoTable.previous.finalY + 15);
    // doc.text("Cheque No.", 15, doc.autoTable.previous.finalY + 60);
    // doc.text("Bank", 115, doc.autoTable.previous.finalY + 60);

    // doc.text("A.G.M", 15, doc.autoTable.previous.finalY + 70);
    // doc.text("R.M", 95, doc.autoTable.previous.finalY + 70);
    // doc.text("Manager", 165, doc.autoTable.previous.finalY + 70);
    // doc.text("Account Officer", 225, doc.autoTable.previous.finalY + 70);
  }else{
    doc.addPage();
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    //doc.text('Totals '+ '', 15, 10);
    doc.setFont("helvetica", "normal");
   
   doc.setFont("helvetica", "bold");
   doc.setFont("helvetica", "normal");
  
   doc.setDrawColor(0, 0, 0);
    pdfInMM = 315;
    doc.line(10,  68, (pdfInMM - lMargin - rMargin),  68);
    //////////////////////////////////////////////////////////////////////////////////////
    doc.text('Total Gross Salary:'+"     "+gridtotals['gross'], 15, 75);
    // if (currencyformat == "₹") {
    //   doc.addImage(rupeeImage, 'JPEG', 47, 73, 2,2);
    // }
    doc.text('Total Deductions:'+"      "+gridtotals['deductions'], 120, 75);
    // if (currencyformat == "₹") {
    //   doc.addImage(rupeeImage, 'JPEG', 150, 73, 1.9, 1.9);
    // }
    doc.text('Total Net Salary:'+"     "+gridtotals['net'], 220, 75);
    // if (currencyformat == "₹") {
    //   doc.addImage(rupeeImage, 'JPEG', 248,73, 1.9, 1.9);
    // }
    //////////////////////////////////////////////////////////////////////////////////////
    doc.setDrawColor(0, 0, 0);
    pdfInMM = 315;
    doc.line(10,80, (pdfInMM - lMargin - rMargin), 80);
    ///////////////////////////////////////////////////////////////////////////////////////

    doc.text("A.G.M", 15, 100);
    doc.text("R.M", 95, 100);
    doc.text("Manager", 165, 100);
    doc.text("Account Officer", 225, 100);

    //////////////////////////////////////////////////////////////////////////////////////////



  }
    if (typeof doc.putTotalPages === 'function') {
      debugger;
      doc.putTotalPages(totalPagesExp);

    }
    if (printorpdf == "Pdf") {
      doc.save('' + reportName + '.pdf');
    }
    if (printorpdf == "Print") {
      this._CommonService.setiFrameForPrint(doc);
    }

  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(data, fileName + "_Excel" + EXCEL_EXTENSION);
  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {

    const myworksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);

    const myworkbook: XLSX.WorkBook = { Sheets: { 'data': myworksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(myworkbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);


  }

}
