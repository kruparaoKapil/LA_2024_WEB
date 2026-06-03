import { Injectable } from '@angular/core';
import { CommonService } from '../../common.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import * as jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root'
})

export class ProfessionaltaxService {

  constructor(private _CommonService:CommonService) { }

  getProcessApproveEmployes(branchid) :Observable<any>{
    debugger;
    const params = new HttpParams().set('BranchId',branchid);
    return this._CommonService.callGetAPI('/HRMS/getProcessApproveEmployes',params,"YES");
  }

  
GetCalendarYear() {
  debugger;
  return this._CommonService.callGetAPI('/HRMS/GetCalendarYear', '' ,'NO');

}

GetCalendarYearMonthDetails(CalendarId,empContactId): Observable<any> {
  debugger;
  const params = new HttpParams().set('CalendarId', CalendarId).set('empContactId',empContactId);
  return this._CommonService.callGetAPI('/HRMS/GetCalendarYearMonthPayrollAuthorised', params, 'YES');

}

GetPayslipDetails(MonthYear): Observable<any> {
  debugger;
  const params = new HttpParams().set('MonthYear', MonthYear);
  return this._CommonService.callGetAPI('/HRMS/GetPayslipDetails', params, 'YES');

}

showProffesionalTaxDetails(Month): Observable<any> {

  const params = new HttpParams().set('MonthYear', Month);

  return this._CommonService.callGetAPI('/HRMS/getProffesionalTaxDetailsList', params, 'YES');

}

///api/HRMS/GetLoyalityCalendarYearMonth
getLoyalityCalendarYearMonth(CalendarId) : Observable<any>{
  debugger;
  try{
    const params = new HttpParams().set('CalendarId',CalendarId);
    return this._CommonService.callGetAPI('/HRMS/GetLoyalityCalendarYearMonth',params,"YES");
  }
  catch(e){
    this._CommonService.showErrorMessage(e);
  }
}


///api/HRMS/GetLoyalityReport
getLoyalityReport(MonthYear) : Observable<any>{
  debugger;
  try{
    const params = new HttpParams().set('MonthYear',MonthYear);
    return this._CommonService.callGetAPI('/HRMS/GetLoyalityReport',params,"YES")
  }
  catch(e){
    this._CommonService.showErrorMessage(e);
  }
}

getEmployeeDetails(BranchId): Observable<any> {
  debugger;
  try {
    debugger;
    const params = new HttpParams().set('BranchId', BranchId);
    return this._CommonService.callGetAPI('/HRMS/getEmployeeDetails', params, 'YES');
  }
  catch (e) {
    this._CommonService.showErrorMessage(e);
  }
}


  ///api/HRMS/GetEmployeeBonusDetails
  getEmployeeBonusDetails(monthyear):Observable<any>{
    debugger;
    try{
      const params = new HttpParams().set('MonthYear',monthyear);
      return this._CommonService.callGetAPI('/HRMS/GetEmployeeBonusDetails',params,"YES");
    }
    catch(e){
      this._CommonService.showErrorMessage(e);
    }
  }



  //​/api​/HRMS​/GetEmployeeELDetails
  getEmployeeELDetails(monthyear) :Observable<any>{
    debugger;
    try{
      const params = new HttpParams().set('MonthYear',monthyear);
      return this._CommonService.callGetAPI('/HRMS/GetEmployeeELDetails',params,"YES");
    }
    catch(e){
      this._CommonService.showErrorMessage(e);
    }
  }


  ///api/HRMS/SaveEarnedLeaves
  saveEarnedLeaves(data):Observable<any>{
    debugger;
    try{
      return this._CommonService.callPostAPI('/HRMS/SaveEarnedLeaves',data);
    }
    catch(e){
      this._CommonService.showErrorMessage(e);
    }
  }


  _downloadEmpBonusReportsPdf(reportName, gridData, gridheaders, colWidthHeight, pagetype, betweenorason, fromdate, todate, printorpdf) {
    debugger;
    let address = this._CommonService.comapnydetails.pAddress1 + ' ' + this._CommonService.comapnydetails.pAddress2 + ' ' + this._CommonService.comapnydetails.pDistrict + ' ' + this._CommonService.comapnydetails.pcity + ' ' + this._CommonService.comapnydetails.pState + ' - ' + this._CommonService.comapnydetails.pPincode;
    let Companyreportdetails = this._CommonService.comapnydetails;
    let doc = new jsPDF(pagetype);
    //let currencyformat = this.currencysymbol;
    //let rupeeImage = this._getRupeeSymbol();
    // let doc = new jsPDF('lanscape');
    let totalPagesExp = '{total_pages_count_string}'
    let today = formatDate(new Date(), 'dd-MMM-yyyy  h:mm:ss a', 'en-IN');
   // let Easy_chit_Img = this.Easy_chit_Img;
   let kapil_logo=this._CommonService.getKapilGroupLogo();
   var lMargin = 15; //left margin in mm
   var rMargin = 15; //right margin in mm
   var pdfInMM;

    doc.autoTable({
      columns: gridheaders,
      body: gridData,
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
      didDrawPage: function (data) {

        let pageSize = doc.internal.pageSize;
        let pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
        let pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        // Header
        doc.setFontStyle('normal');
        if (doc.internal.getNumberOfPages() == 1) {
          debugger;
          doc.setFontSize(15);
          if (pagetype == "a4") {
            
           
            doc.addImage(kapil_logo, 'JPEG', 10, 15, 20, 20)
            doc.setTextColor('black');
            //doc.text(Companyreportdetails.pCompanyName, 60, 20);
            //doc.text(Companyreportdetails.pCompanyName, 130, 20);
            doc.text(Companyreportdetails.pCompanyName, pageWidth/2,20,{align:'center'});
            doc.setFontSize(8);
            doc.text(address, 40, 27, 0, 0, 'left');
            //doc.text(address, 132, 27, 0, 0, 'left');
            if (!isNullOrEmptyString(Companyreportdetails.pCinNo)) {
              doc.text('CIN : ' + Companyreportdetails.pCinNo + '', 85, 32);
            }
            doc.setFontSize(14);
            doc.text(reportName, 90, 42);
            //doc.text(reportName, 70, 42);
            doc.setFontSize(10);
            doc.text('Branch : ' + Companyreportdetails.pBranchname + '', 163, 47);
            if (betweenorason == "Between") {

              doc.text('Between  : ' + fromdate + '  And  ' + todate + ' ', 15, 47);
            }
            else if (betweenorason == "As On") {

              if (fromdate != "") {
                doc.text('As on  : ' + fromdate + '', 15, 47);
              }
            }
            doc.setDrawColor(0, 0, 0);
            pdfInMM = 233;
            doc.line(10, 50, (pdfInMM - lMargin - rMargin), 50) // horizontal line
          }
          if (pagetype == "landscape") {
            doc.addImage(kapil_logo, 'JPEG', 10,5)
            doc.setTextColor('black');
            //doc.text(Companyreportdetails.pCompanyName, 110, 10);
            doc.text(Companyreportdetails.pCompanyName, pageWidth/2,10,{align:'center'});
            doc.setFontSize(10);
            //doc.text(address, 80, 15, 0, 0, 'left');
            doc.text(address, 100, 15, 0, 0, 'left');
            if (!isNullOrEmptyString(Companyreportdetails.pCinNo)) {
              doc.text('CIN : ' + Companyreportdetails.pCinNo + '', 125, 20);
            }
            doc.setFontSize(14);
           
            //doc.text(reportName, 125, 30);
            doc.text(reportName, 118, 30);
            doc.setFontSize(10);
            //  doc.text('Printed On : ' + today + '', 15, 57);
            doc.text('Branch : ' + Companyreportdetails.pBranchname + '', 235, 40);
            if (betweenorason == "Between") {

              doc.text('Between  : ' + fromdate + '  And  ' + todate + ' ', 15, 40);
            }
            else if (betweenorason == "As On") {

              if (fromdate != "") {
                doc.text('As on  : ' + fromdate + '', 15, 40);
              }
            }
            pdfInMM = 315;
            doc.setDrawColor(0, 0, 0);
            doc.line(10, 45, (pdfInMM - lMargin - rMargin), 45) // horizontal line
          }

        }
        else {

          data.settings.margin.top = 20;
          data.settings.margin.bottom = 15;
        }
        debugger;
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
        doc.text(page, pageWidth - data.settings.margin.right - 20, pageHeight - 5);
      },
      // willDrawCell: function (data) {

      //   if ((data.section == "body" && data.cell.colSpan != 15) && data.cell.raw != "0") {

      //     data.cell.text[0] = '                      ' + data.cell.raw

      //   }
      //   // if (data.cell.raw == "0") {
      //   //   debugger;
      //   //   data.cell.text[0] = "";

      //   // }
      // },
      didDrawCell: function (data) {

        if ((data.column.index == 2 || data.column.index ==3|| data.column.index ==4 || data.column.index == 5  || data.column.index == 6 || data.column.index == 7) && data.cell.section === 'body') {

          var td = data.cell.raw;
          if (td) {
            // if (currencyformat == "₹") {
            //   var textPos = data.cell.textPos;
            //   doc.setFontStyle('normal');
            //   doc.addImage(rupeeImage, textPos.x - data.cell.contentWidth, textPos.y + 0.5, 1.5, 1.5);
            // }
          }
        }

      }
    });
     
    if(typeof doc.putTotalPages === 'function') {
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

  _groupwiseGridwithSummaryExportData(griddata, groupdcol, basicsalary, vda, arrears, absent, total, bonus, sumstring, isgroupedcolDate) {
    debugger;

    let a = [];
    let keys = [];
    for (var i = 0; i < griddata.length; i++) {
      let Jsongroupcol;
      if (isgroupedcolDate == true) {
        Jsongroupcol = this._CommonService.getFormatDateGlobal(griddata[i][groupdcol]);
      }
      else {
        Jsongroupcol = griddata[i][groupdcol];
      }
      if (!a[Jsongroupcol]) {

        keys.push(Jsongroupcol);
        let k = { ...griddata[i] }
        a[Jsongroupcol] = [k];

      }
      a[Jsongroupcol].push(griddata[i]);

    }
    for (var RT = 0; RT < keys.length; RT++) {
      debugger;
      let keypair = a[keys[RT]]
      let emptyrow = {
      };
      a[keys[RT]].push(emptyrow);
    }
    let final = [];
    let vb = 0;
    for (var j = 0; j < keys.length; j++) {
      vb++;
      let keypair = a[keys[j]]
      let basicSum = 0;
      let VDASum = 0;
      let ArrearsSum = 0;
      let AbsentSum = 0;
      let TotalSum = 0;
      let BonusSum = 0;

      for (var k = 0; k <= keypair.length - 1; k++) {
        let groupcolHead
        if (k != 0 && k != (keypair.length - 1)) {
          basicSum += keypair[k][basicsalary];
          VDASum += keypair[k][vda];
          ArrearsSum += keypair[k][arrears];
          AbsentSum += keypair[k][absent];
          TotalSum += keypair[k][total];
          BonusSum += keypair[k][bonus];
        }
        if (k == 0) {
          if (isgroupedcolDate == true) {
            groupcolHead = this._CommonService.getFormatDateGlobal(keypair[k][groupdcol]);
          }
          else {
            groupcolHead = keypair[k][groupdcol];
          }
          keypair[k]["group"] = {
            content: '' + groupcolHead + '',
            colSpan: 8,
            styles: { halign: 'left', fillColor: "#e6f7ff" },
          };
        }
        if (k == (keypair.length - 1)) {
          keypair[k]["group"] = {
            content: this._CommonService.currencyformat(basicSum) + '                       ' + this._CommonService.currencyformat(VDASum) + '                                  ' + this._CommonService.currencyformat(ArrearsSum) + '                           ' + this._CommonService.currencyformat(AbsentSum) + '                                     ' + this._CommonService.currencyformat(TotalSum) + '                                                    ' + this._CommonService.currencyformat(BonusSum),
            colSpan: 8,
            styles: { halign: 'right', fillColor: "#ffffb3" },
          }
        }
        final.push(keypair[k])
      }
    }

    return final;
  }

  _downLoadEarnedLeavesPDF(reportName, gridData, gridheaders, colWidthHeight, pagetype, betweenorason, fromdate, todate, printorpdf) {
    debugger;
    let address = this._CommonService.comapnydetails.pAddress1 + ' ' + this._CommonService.comapnydetails.pAddress2 + ' ' + this._CommonService.comapnydetails.pDistrict + ' ' + this._CommonService.comapnydetails.pcity + ' ' + this._CommonService.comapnydetails.pState + ' - ' + this._CommonService.comapnydetails.pPincode;
    let Companyreportdetails = this._CommonService.comapnydetails;
    let doc = new jsPDF(pagetype);
   // let currencyformat = this.currencysymbol;
    //let rupeeImage = this._getRupeeSymbol();
    // let doc = new jsPDF('lanscape');
    let totalPagesExp = '{total_pages_count_string}'
    let today = this._CommonService.pdfProperties("Date");
    // let Easy_chit_Img = this.Easy_chit_Img;
    let kapil_logo = this._CommonService.getKapilGroupLogo();
    var lMargin = 15; //left margin in mm
    var rMargin = 15; //right margin in mm
    var pdfInMM;

    doc.autoTable({
      columns: gridheaders,
      body: gridData,
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
      didDrawPage: function (data) {

        let pageSize = doc.internal.pageSize;
        let pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
        let pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        // Header
        doc.setFontStyle('normal');
        if (doc.internal.getNumberOfPages() == 1) {
          debugger;
          doc.setFontSize(15);
          if (pagetype == "a4") {
            doc.addImage(kapil_logo, 'JPEG', 10, 15, 20, 20)
            doc.setTextColor('black');
            //doc.text(Companyreportdetails.pCompanyName, 60, 20);
            doc.text(Companyreportdetails.pCompanyName, pageWidth/2,20,{align:'center'});
            doc.setFontSize(8);
            doc.text(address, 40, 27, 0, 0, 'left');
            if (!isNullOrEmptyString(Companyreportdetails.pCinNo)) {
              doc.text('CIN : ' + Companyreportdetails.pCinNo + '', 85, 32);
            }
            doc.setFontSize(14);
            doc.text(reportName, 90, 42);
            doc.setFontSize(10);
            doc.text('Branch : ' + Companyreportdetails.pBranchname + '', 163, 47);
            if (betweenorason == "Between") {

              doc.text('Between  : ' + fromdate + '  And  ' + todate + ' ', 15, 47);
            }
            else {

              if (fromdate != "") {
                doc.text('As on  : ' + fromdate + '', 15, 47);
              }
            }
            doc.setDrawColor(0, 0, 0);
            pdfInMM = 233;
            doc.line(10, 50, (pdfInMM - lMargin - rMargin), 50) // horizontal line
          }
          if (pagetype == "landscape") {
            doc.addImage(kapil_logo, 'JPEG', 10, 5)
            doc.setTextColor('black');
            //doc.text(Companyreportdetails.pCompanyName, 110, 10);
            doc.text(Companyreportdetails.pCompanyName, pageWidth/2,10,{align:'center'});
            doc.setFontSize(10);
            doc.text(address, 100, 15, 0, 0, 'left');
            if (!isNullOrEmptyString(Companyreportdetails.pCinNo)) {
              doc.text('CIN : ' + Companyreportdetails.pCinNo + '', 125, 20);
            }
            doc.setFontSize(14);

            doc.text(reportName, 130, 30);
            doc.setFontSize(10);
            //  doc.text('Printed On : ' + today + '', 15, 57);
            doc.text('Branch : ' + Companyreportdetails.pBranchname + '', 235, 40);
            doc.setFontSize(10);
            if (betweenorason == "Between") {
              doc.text('Between  : ' + fromdate + '  And  ' + todate + ' ', 15, 40);
            }
            else {

              if (fromdate != "") {
                doc.text('As on  : ' + fromdate + '', 15, 40);
              }
            }
            doc.setDrawColor(0, 0, 0);
            pdfInMM = 315;
            doc.line(10, 45, (pdfInMM - lMargin - rMargin), 45) // horizontal line
          }

        }
        else {

          data.settings.margin.top = 20;
          data.settings.margin.bottom = 15;
        }
        debugger;
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
        doc.text(page, pageWidth - data.settings.margin.right - 20, pageHeight - 5);
      },
      // willDrawCell: function (data) {

      //   if ((data.section == "body" && data.cell.colSpan != 15) && data.cell.raw != "0") {

      //     data.cell.text[0] = ' ' + data.cell.raw

      //   }
      //   // if (data.cell.raw == "0") {
      //   //   debugger;
      //   //   data.cell.text[0] = "";
      //   // }
      // },
      didDrawCell: function (data) {

        if ((data.column.index == 2 || data.column.index == 3 || data.column.index == 5) && data.cell.section === 'body') {

          var td = data.cell.raw;
          // if (td) {
        //   if (currencyformat == "₹") {
        //     var textPos = data.cell.textPos;
        //     doc.setFontStyle('normal');
        //     doc.addImage(rupeeImage, textPos.x - data.cell.contentWidth, textPos.y + 0.5, 1.7, 1.7);
        //   }

        }

      }
    });

    doc.setFontSize(10)
    doc.text("", 15, doc.autoTable.previous.finalY + 80);
    doc.text("A.G.M", 15, doc.autoTable.previous.finalY + 80);
    doc.text("R.M", 95, doc.autoTable.previous.finalY + 80);
    doc.text("Manager", 165, doc.autoTable.previous.finalY + 80);
    doc.text("Account Officer", 225, doc.autoTable.previous.finalY + 80);


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

 
  _downLoadLoyaltystatementPDF(reportName, gridData, gridheaders, colWidthHeight, pagetype, betweenorason, fromdate, todate, printorpdf) {
    debugger;
    let address = this._CommonService.comapnydetails.pAddress1 + ' ' + this._CommonService.comapnydetails.pAddress2 + ' ' + this._CommonService.comapnydetails.pDistrict + ' ' + this._CommonService.comapnydetails.pcity + ' ' + this._CommonService.comapnydetails.pState + ' - ' + this._CommonService.comapnydetails.pPincode;
    let Companyreportdetails = this._CommonService.comapnydetails;
    let doc = new jsPDF(pagetype);
    //let currencyformat = this.currencysymbol;
    //let rupeeImage = this._getRupeeSymbol();
    // let doc = new jsPDF('lanscape');
    let totalPagesExp = '{total_pages_count_string}'
    let today = this._CommonService.pdfProperties("Date");
    // let Easy_chit_Img = this.Easy_chit_Img;
    let kapil_logo = this._CommonService.getKapilGroupLogo();
    var lMargin = 15; //left margin in mm
    var rMargin = 15; //right margin in mm
    var pdfInMM;

    doc.autoTable({
      columns: gridheaders,
      body: gridData,
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
      didDrawPage: function (data) {

        let pageSize = doc.internal.pageSize;
        let pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
        let pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        // Header
        doc.setFontStyle('normal');
        if (doc.internal.getNumberOfPages() == 1) {
          debugger;
          doc.setFontSize(15);
          if (pagetype == "a4") {
            doc.addImage(kapil_logo, 'JPEG', 10, 15, 20, 20)
            doc.setTextColor('black');
            //doc.text(Companyreportdetails.pCompanyName, 60, 20);
            doc.text(Companyreportdetails.pCompanyName, pageWidth/2,20,{align:'center'});
            doc.setFontSize(8);
            doc.text(address, 100, 17, 0, 0, 'left');
            if (!isNullOrEmptyString(Companyreportdetails.pCinNo)) {
              doc.text('CIN : ' + Companyreportdetails.pCinNo + '', 85, 32);
            }
            doc.setFontSize(14);
            doc.text(reportName, 70, 42);
            doc.setFontSize(10);
            doc.text('Branch : ' + Companyreportdetails.pBranchname + '', 163, 47);
            if (betweenorason == "Between") {

              doc.text('Between  : ' + fromdate + '  And  ' + todate + ' ', 15, 47);
            }
            else {

              if (fromdate != "") {
                doc.text('As on  : ' + fromdate + '', 15, 47);
              }
            }
            doc.setDrawColor(0, 0, 0);
            pdfInMM = 233;
            doc.line(10, 50, (pdfInMM - lMargin - rMargin), 50) // horizontal line
          }
          if (pagetype == "landscape") {
            doc.addImage(kapil_logo, 'JPEG', 10, 5)
            doc.setTextColor('black');
            //doc.text(Companyreportdetails.pCompanyName, 110, 10);
            doc.text(Companyreportdetails.pCompanyName, pageWidth/2,10,{align:'center'});
            doc.setFontSize(10);
            doc.text(address, 100, 15, 0, 0, 'left');
            if (!isNullOrEmptyString(Companyreportdetails.pCinNo)) {
              doc.text('CIN : ' + Companyreportdetails.pCinNo + '', 125, 20);
            }
            doc.setFontSize(14);

            doc.text(reportName, 100, 30);
            doc.setFontSize(10);
            //  doc.text('Printed On : ' + today + '', 15, 57);
            doc.text('Branch : ' + Companyreportdetails.pBranchname + '', 235, 40);
            doc.setFontSize(10);
            if (betweenorason == "Between") {
              doc.text('Between  : ' + fromdate + '  And  ' + todate + ' ', 15, 40);
            }
            else {

              if (fromdate != "") {
                doc.text('As on  : ' + fromdate + '', 15, 40);
              }
            }
            doc.setDrawColor(0, 0, 0);
            pdfInMM = 315;
            doc.line(10, 45, (pdfInMM - lMargin - rMargin), 45) // horizontal line
          }

        }
        else {

          data.settings.margin.top = 20;
          data.settings.margin.bottom = 15;
        }
        debugger;
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
        doc.text(page, pageWidth - data.settings.margin.right - 20, pageHeight - 5);
      },
      // willDrawCell: function (data) {

      //   if ((data.section == "body" && data.cell.colSpan != 15) && data.cell.raw != "0") {

      //     data.cell.text[0] = ' ' + data.cell.raw

      //   }
      //   // if (data.cell.raw == "0") {
      //   //   debugger;
      //   //   data.cell.text[0] = "";
      //   // }
      // },
      didDrawCell: function (data) {

        if ((data.column.index == 2) && data.cell.section === 'body') {

          var td = data.cell.raw;
          // if (td) {
        //   if (currencyformat == "₹") {
        //     var textPos = data.cell.textPos;
        //     doc.setFontStyle('normal');
        //     doc.addImage(rupeeImage, textPos.x - data.cell.contentWidth, textPos.y + 0.5, 1.7, 1.7);
        //   }

        }

      }
    });

    doc.setFontSize(10)
    // doc.text("", 15, doc.autoTable.previous.finalY + 80);
    // doc.text("A.G.M", 15, doc.autoTable.previous.finalY + 80);
    // doc.text("R.M", 95, doc.autoTable.previous.finalY + 80);
    // doc.text("Manager", 165, doc.autoTable.previous.finalY + 80);
    // doc.text("Account Officer", 225, doc.autoTable.previous.finalY + 80);


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

  _downloadProffesionalTaxReportsPdf(reportName, gridData, gridheaders, colWidthHeight, pagetype, betweenorason, fromdate, printorpdf, totalamounts) {
    let address = this._CommonService.comapnydetails.pAddress1 + ' ' + this._CommonService.comapnydetails.pAddress2 + ' ' + this._CommonService.comapnydetails.pDistrict + ' ' + this._CommonService.comapnydetails.pcity + ' ' + this._CommonService.comapnydetails.pState + ' - ' + this._CommonService.comapnydetails.pPincode;
    let Companyreportdetails = this._CommonService.comapnydetails;
    let doc = new jsPDF(pagetype);

    let totalPagesExp = '{total_pages_count_string}';
    let today = formatDate(new Date(), 'dd-MM-yyyy hh:mm', 'en-IN');
    let kapil_logo = this._CommonService.getKapilGroupLogo();
    var lMargin = 15; // left margin in mm
    var rMargin = 15; // right margin in mm
    var pdfInMM;

    doc.autoTable({
        columns: gridheaders,
        body: gridData,
        theme: 'grid',
        headStyles: {
            fillColor: this._CommonService.pdfProperties("Header Color"),
            halign: this._CommonService.pdfProperties("Header Alignment"),
            fontSize: this._CommonService.pdfProperties("Header Fontsize")
        },
        styles: {
            cellPadding: 1,
            fontSize: this._CommonService.pdfProperties("Cell Fontsize"),
            cellWidth: 'wrap',
            rowPageBreak: 'avoid',
            overflow: 'linebreak'
        },
        columnStyles: colWidthHeight,
        startY: 48,
        showHead: 'everyPage', // header on every page
        showFoot: 'lastPage', // footer on last page
        didDrawPage: function (data) {
            let pageSize = doc.internal.pageSize;
            let pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
            let pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();

            doc.setFontStyle('normal');
            if (doc.internal.getNumberOfPages() === 1) {
                doc.setFontSize(15);
                if (pagetype === "a4") {
                    doc.addImage(kapil_logo, 'JPEG', 10, 15, 20, 20)
                    doc.setTextColor('black');
                    doc.text(Companyreportdetails.pCompanyName, pageWidth / 2, 20, { align: 'center' });

                    doc.setFontSize(8);
                    doc.text(address,pageWidth / 2, 32, { align: 'right' });
                    

                    if (!isNullOrEmptyString(Companyreportdetails.pCinNo)) {
                        doc.text('CIN : ' + Companyreportdetails.pCinNo + '', 85, 32);
                    }
                    
                    doc.setFontSize(14);
                    doc.text(reportName, 90, 42);
                    doc.setFontSize(10);
                    doc.text('Branch : ' + Companyreportdetails.pBranchname + '', 163, 47);
                    doc.setDrawColor(0, 0, 0);
                    pdfInMM = 233;
                    doc.line(10, 50, (pdfInMM - lMargin - rMargin), 50) // horizontal line
                }

                if (pagetype === "landscape") {
                    debugger;
            doc.addImage(kapil_logo, 'JPEG', 10,5)
            doc.setTextColor('black');
            doc.text(Companyreportdetails.pCompanyName, pageWidth/2,10,{align:'center'});
            doc.setFontSize(10);
            doc.text(address, pageWidth/2-60,15);
            if (!isNullOrEmptyString(Companyreportdetails.pCinNo)) {
              doc.text('CIN : ' + Companyreportdetails.pCinNo + '', 125, 20);
            }
            doc.setFontSize(14);
            doc.text(reportName, 100, 30);
            doc.setFontSize(10);

            doc.text('Branch : ' + Companyreportdetails.pBranchname + '', 235, 40);
            doc.setDrawColor(0, 0, 0);
            pdfInMM = 315;
            doc.line(10, 45, (pdfInMM - lMargin - rMargin), 45) // horizontal line
                }
            }
            else{
                data.settings.margin.top = 20;
                data.settings.margin.bottom = 15;
            }


            let page = "Page " + doc.internal.getNumberOfPages();
            if (typeof doc.putTotalPages === 'function') {
                page = page + ' of ' + totalPagesExp;
            }
            doc.line(5, pageHeight - 10, (pdfInMM - lMargin - rMargin), pageHeight - 10) // horizontal line
            doc.setFontSize(10);
            doc.text("Printed on : " + today, data.settings.margin.left, pageHeight - 5);
            doc.text(page, pageWidth - data.settings.margin.right - 20, pageHeight - 5);
        },

        willDrawCell: function (data) {
            if (data.section === "body" && data.cell.colSpan !== 15 && data.cell.raw !== "0") {
                data.cell.text[0] = '' + data.cell.raw;
            }
        },
        didDrawCell: function (data) {
            if ((data.column.index === 4 || data.column.index === 5 || data.column.index === 6) && data.cell.section === 'body') {
                var td = data.cell.raw;
            }
        }
    });

    doc.setFontSize(8);
    doc.text('Total', 90, doc.autoTable.previous.finalY + 4);
    doc.text(totalamounts.totalGrossSalary + '', 160, doc.autoTable.previous.finalY + 4);
    doc.text(totalamounts.totalNetSalary + '', 200, doc.autoTable.previous.finalY + 4);
    doc.text(totalamounts.totalTax + '', 258, doc.autoTable.previous.finalY + 4);
    doc.setFontSize(10);


    doc.text("Cheque NO.", 15, doc.autoTable.previous.finalY + 20);
    doc.text("BANK", 115, doc.autoTable.previous.finalY + 20);
    doc.text("A.G.M", 15, doc.autoTable.previous.finalY + 35);
    doc.text("R.M", 95, doc.autoTable.previous.finalY + 35);
    doc.text("Manager", 165, doc.autoTable.previous.finalY + 35);
    doc.text("Accounts Officer", 225, doc.autoTable.previous.finalY + 35);

    if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPagesExp);
    }

    if (printorpdf === "Pdf") {
        doc.save(reportName + '.pdf');
    } else if (printorpdf === "Print") {
        this._CommonService.setiFrameForPrint(doc);
    }
}

_downLoadChallanaEntryPDF(reportName, gridData, gridheaders, colWidthHeight, pagetype, betweenorason, fromdate, todate, printorpdf) {
    debugger;
    let address = this._CommonService.comapnydetails.pAddress1 + ' ' + this._CommonService.comapnydetails.pAddress2 + ' ' + this._CommonService.comapnydetails.pDistrict + ' ' + this._CommonService.comapnydetails.pcity + ' ' + this._CommonService.comapnydetails.pState + ' - ' + this._CommonService.comapnydetails.pPincode;
    let Companyreportdetails = this._CommonService.comapnydetails;
    let doc = new jsPDF(pagetype);
    //let currencyformat = this.currencysymbol;
    //let rupeeImage = this._getRupeeSymbol();
    // let doc = new jsPDF('lanscape');
    let totalPagesExp = '{total_pages_count_string}'
    let today = this._CommonService.pdfProperties("Date");
    // let Easy_chit_Img = this.Easy_chit_Img;
    let kapil_logo = this._CommonService.getKapilGroupLogo();
    var lMargin = 15; //left margin in mm
    var rMargin = 15; //right margin in mm
    var pdfInMM;

    doc.autoTable({
      columns: gridheaders,
      body: gridData,
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
      didDrawPage: function (data) {

        let pageSize = doc.internal.pageSize;
        let pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
        let pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        // Header
        doc.setFontStyle('normal');
        if (doc.internal.getNumberOfPages() == 1) {
          debugger;
          doc.setFontSize(15);
          if (pagetype == "a4") {
            doc.addImage(kapil_logo, 'JPEG', 10, 15, 20, 20)
            doc.setTextColor('black');
            //doc.text(Companyreportdetails.pCompanyName, 60, 20);
            doc.text(Companyreportdetails.pCompanyName, pageWidth/2,20,{align:'center'});
            doc.setFontSize(8);
            doc.text(address, 100, 17, 0, 0, 'left');
            if (!isNullOrEmptyString(Companyreportdetails.pCinNo)) {
              doc.text('CIN : ' + Companyreportdetails.pCinNo + '', 85, 32);
            }
            doc.setFontSize(14);
            doc.text(reportName, 70, 42);
            doc.setFontSize(10);
            doc.text('Branch : ' + Companyreportdetails.pBranchname + '', 163, 47);
            if (betweenorason == "Between") {

              doc.text('Between  : ' + fromdate + '  And  ' + todate + ' ', 15, 47);
            }
            else {

              if (fromdate != "") {
                doc.text('As on  : ' + fromdate + '', 15, 47);
              }
            }
            doc.setDrawColor(0, 0, 0);
            pdfInMM = 233;
            doc.line(10, 50, (pdfInMM - lMargin - rMargin), 50) // horizontal line
          }
          if (pagetype == "landscape") {
            doc.addImage(kapil_logo, 'JPEG', 10, 5)
            doc.setTextColor('black');
            //doc.text(Companyreportdetails.pCompanyName, 110, 10);
            doc.text(Companyreportdetails.pCompanyName, pageWidth/2,10,{align:'center'});
            doc.setFontSize(10);
            doc.text(address, 80, 15, 0, 0, 'left');
            if (!isNullOrEmptyString(Companyreportdetails.pCinNo)) {
              doc.text('CIN : ' + Companyreportdetails.pCinNo + '', 125, 20);
            }
            doc.setFontSize(14);

            doc.text(reportName, 100, 30);
            doc.setFontSize(10);
            //  doc.text('Printed On : ' + today + '', 15, 57);
            doc.text('Branch : ' + Companyreportdetails.pBranchname + '', 235, 40);
            doc.setFontSize(10);
            if (betweenorason == "Between") {
              doc.text('Between  : ' + fromdate + '  And  ' + todate + ' ', 15, 40);
            }
            else {

              if (fromdate != "") {
                doc.text('As on  : ' + fromdate + '', 15, 40);
              }
            }
            doc.setDrawColor(0, 0, 0);
            pdfInMM = 315;
            doc.line(10, 45, (pdfInMM - lMargin - rMargin), 45) // horizontal line
          }

        }
        else {

          data.settings.margin.top = 20;
          data.settings.margin.bottom = 15;
        }
        debugger;
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
        doc.text(page, pageWidth - data.settings.margin.right - 20, pageHeight - 5);
      },
      // willDrawCell: function (data) {

      //   if ((data.section == "body" && data.cell.colSpan != 15) && data.cell.raw != "0") {

      //     data.cell.text[0] = ' ' + data.cell.raw

      //   }
      //   // if (data.cell.raw == "0") {
      //   //   debugger;
      //   //   data.cell.text[0] = "";
      //   // }
      // },
      didDrawCell: function (data) {

        if ((data.column.index == 2) && data.cell.section === 'body') {

          var td = data.cell.raw;
          // if (td) {
        //   if (currencyformat == "₹") {
        //     var textPos = data.cell.textPos;
        //     doc.setFontStyle('normal');
        //     doc.addImage(rupeeImage, textPos.x - data.cell.contentWidth, textPos.y + 0.5, 1.7, 1.7);
        //   }

        }

      }
    });

    doc.setFontSize(10)
    // doc.text("", 15, doc.autoTable.previous.finalY + 80);
    // doc.text("A.G.M", 15, doc.autoTable.previous.finalY + 80);
    // doc.text("R.M", 95, doc.autoTable.previous.finalY + 80);
    // doc.text("Manager", 165, doc.autoTable.previous.finalY + 80);
    // doc.text("Account Officer", 225, doc.autoTable.previous.finalY + 80);


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


_downloadSaleAdvancePDF(
  reportName: string,
  gridData: any[],
  gridHeaders: any[],
  colWidthHeight: any,
  pagetype: 'landscape' | 'a4',
  printorpdf: 'Pdf' | 'Print'
) {

  const Companyreportdetails = this._CommonService.comapnydetails;
  const address =
    Companyreportdetails.pAddress1 + ' ' +
    Companyreportdetails.pAddress2 + ' ' +
    Companyreportdetails.pDistrict + ' ' +
    Companyreportdetails.pcity + ' ' +
    Companyreportdetails.pState + ' - ' +
    Companyreportdetails.pPincode;

  const today = this._CommonService.pdfProperties('Date');
  const kapil_logo = this._CommonService.getKapilGroupLogo();

  const doc = new jsPDF(pagetype);
  const totalPagesExp = '{total_pages_count_string}';

  doc.autoTable({
    head: [gridHeaders],
    body: gridData,
    theme: 'grid',
    columnStyles: colWidthHeight,

    //startY: 60,
     margin: { top: 60 },
    showHead: 'everyPage',

    headStyles: {
      fillColor: this._CommonService.pdfProperties('Header Color'),
      textColor: 255,
      fontSize: this._CommonService.pdfProperties('Header Fontsize')
    },

    styles: {
      fontSize: this._CommonService.pdfProperties('Cell Fontsize'),
      cellPadding: 3,
      overflow: 'linebreak'
    },

    didParseCell: function (data) {
      if (data.section === 'head' && (data.column.index === 3 || data.column.index === 4)) {
        data.cell.styles.fillColor = [255, 255, 255];
        data.cell.styles.lineWidth = 0;
      }
    },

    didDrawPage: function () {

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();


      doc.addImage(kapil_logo, 'JPEG', 10, 8, 18, 18);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text(Companyreportdetails.pCompanyName, pageWidth / 2, 14, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(address, pageWidth / 2, 19, { align: 'center' });

      if (Companyreportdetails.pCinNo) {
        doc.text('CIN : ' + Companyreportdetails.pCinNo, pageWidth / 2, 23, { align: 'center' });
      }

      doc.setFontSize(14);
      doc.text(reportName, pageWidth / 2, 32, { align: 'center' });

      doc.setFontSize(10);
      doc.text('Printed On : ' + today, 15, 40);
      doc.text('Branch : ' + Companyreportdetails.pBranchname, pageWidth - 15, 40, { align: 'right' });

      doc.line(10, 45, pageWidth - 10, 45);



doc.setFont('helvetica', 'bold');
doc.setFontSize(11);
doc.setTextColor(0);

doc.setFillColor(198, 224, 180);
doc.rect(14, 50, 110, 8, 'F');
doc.text('SALE ADVANCE-HRB', 14 + 110 / 2, 56, { align: 'center' });

doc.setFillColor(198, 224, 180);
doc.rect(164, 50, 110, 8, 'F');
doc.text('SALE ADVANCE', 164 + 110 / 2, 56, { align: 'center' });


doc.setTextColor(20);

      let page = 'Page ' + doc.internal.getNumberOfPages();
      if (typeof doc.putTotalPages === 'function') {
        page += ' of ' + totalPagesExp;
      }

      doc.line(10, pageHeight - 12, pageWidth - 10, pageHeight - 12);
      doc.setFontSize(9);
      doc.text('Printed on : ' + today, 15, pageHeight - 5);
      doc.text(page, pageWidth - 30, pageHeight - 5);
    }
  });

  if (typeof doc.putTotalPages === 'function') {
    doc.putTotalPages(totalPagesExp);
  }

  if (printorpdf === 'Pdf') {
    doc.save(reportName + '.pdf');
  } else {
    this._CommonService.setiFrameForPrint(doc);
  }
}


}
