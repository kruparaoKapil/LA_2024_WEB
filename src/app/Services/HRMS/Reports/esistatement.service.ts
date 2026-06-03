import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from '../../common.service';
import { Observable } from 'rxjs';
import { formatDate } from '@angular/common';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import * as jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class EsistatementService {

  constructor(private _CommonService:CommonService ) { }

  getProcessApproveEmployes(branchid) :Observable<any>{
    debugger;
    const params = new HttpParams().set('BranchId',branchid);
    return this._CommonService.callGetAPI('/HRMS/getProcessApproveEmployes',params,"YES");
  }


  // HERE Start from Employee Salary Update report //

GetCalendarYear() {
  debugger;
  return this._CommonService.callGetAPI('/HRMS/GetCalendarYear', '' ,'NO');

}

GetCalendarYearMonthDetails(CalendarId,empContactId): Observable<any> {
  debugger;
  const params = new HttpParams().set('CalendarId', CalendarId).set('empContactId',empContactId);
  return this._CommonService.callGetAPI('/HRMS/GetCalendarYearMonthPayrollAuthorised', params, 'YES');

}

showEsiStatementDetails(Month): Observable<any> {

  const params = new HttpParams().set('MonthYear', Month);

  return this._CommonService.callGetAPI('/HRMS/GetEmployeeEsiDetails', params, 'YES');

}

_downloadEsiStatementReportPdf(reportName, gridData, gridheaders, colWidthHeight, pagetype, betweenorason, fromdate, employeercontributionamt, totalempesiamt, totalesiamt, printorpdf, totalamounts) {
  debugger;
  let address = this._CommonService.comapnydetails.pAddress1 + ' ' + this._CommonService.comapnydetails.pAddress2 + ' ' + this._CommonService.comapnydetails.pDistrict + ' ' + this._CommonService.comapnydetails.pcity + ' ' + this._CommonService.comapnydetails.pState + ' - ' + this._CommonService.comapnydetails.pPincode;
  let Companyreportdetails = this._CommonService.comapnydetails;
  let doc = new jsPDF(pagetype);
  // let doc = new jsPDF('lanscape');
  let totalPagesExp = '{total_pages_count_string}'
  let today = formatDate(new Date(), 'dd-MMM-yyyy  h:mm:ss a', 'en-IN');
 // let Easy_chit_Img = this._CommonService.Easy_chit_Img;
  let kapil_logo=this._CommonService.getKapilGroupLogo();
  //let currencyformat = this._CommonService.currencysymbol;
  //let rupeeImage = this._CommonService._getRupeeSymbol();
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
      fontSize:this._CommonService.pdfProperties("Header Fontsize")
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
      debugger;
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
            //syam
         doc.text(Companyreportdetails.pCompanyName,pageWidth/2,20,{align:'center'});

          doc.setFontSize(8);
          doc.text(address, 40, 27, 0, 0, 'left');
          if(!isNullOrEmptyString(Companyreportdetails.pCinNo)){
          doc.text('CIN : ' + Companyreportdetails.pCinNo + '',85, 32);
          }
          doc.setFontSize(14);



          doc.text(reportName, 90, 42);


          doc.setFontSize(10);

          //  doc.text('Printed On : ' + today + '', 15, 57);
          doc.text('Branch : ' + Companyreportdetails.pBranchname + '', 163, 47);
          doc.setFontSize(10);

           if (betweenorason == "As On") {

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
          //doc.text(Companyreportdetails.pCompanyName, 100, 10);
          //syam
          doc.text(Companyreportdetails.pCompanyName, pageWidth/2,10,{align:'center'});
          doc.setFontSize(10);
          //doc.text(address, 350, 15, 0, 0, 'left');
          doc.text(address, 100, 15, 0, 0, 'left');
          if(!isNullOrEmptyString(Companyreportdetails.pCinNo)){
          doc.text('CIN : ' + Companyreportdetails.pCinNo + '',120,20 );
          }
          doc.setFontSize(14);

          //doc.text(reportName, 130, 30);
          doc.text(reportName, 100, 30);
          doc.setFontSize(10);
          //  doc.text('Printed On : ' + today + '', 15, 57);
          doc.text('Branch : ' + Companyreportdetails.pBranchname + '',235, 40);
          doc.setFontSize(10);
          if (betweenorason == "As On") {

            if (fromdate != "") {
              doc.text('As on  : ' + fromdate + '', 15, 40);
            }
          }
          doc.setDrawColor(0, 0, 0);
          pdfInMM = 315;
          doc.line(10,45, (pdfInMM - lMargin - rMargin), 45) // horizontal line
        }
      }
      else {
        data.settings.margin.top = 20;
        data.settings.margin.bottom = 15;
      }
      debugger;
      var pageCount = doc.internal.getNumberOfPages();
      if (doc.internal.getNumberOfPages() == totalPagesExp) {

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
    didDrawCell: function(data) {
      if ((data.column.index == 4 || data.column.index == 5) && data.cell.section == 'body') {
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

  doc.setFontSize(8);
  console.log(totalamounts)
  doc.text('Total', 90, doc.autoTable.previous.finalY + 4);
  // if (currencyformat == "₹") {
  //   doc.addImage(rupeeImage, 188, doc.autoTable.previous.finalY + 2, 1, 2);
  // }
  doc.text(totalamounts.totalGrossSalary + '', 190, doc.autoTable.previous.finalY + 4);
  // if (currencyformat == "₹") {
  //   doc.addImage(rupeeImage, 256, doc.autoTable.previous.finalY + 2, 1, 2);
  // }
  doc.text(totalamounts.totalEmpEsiAmount + '', 258, doc.autoTable.previous.finalY + 4);




  doc.setFontSize(10)
  // if (currencyformat == "₹") {
  //   doc.addImage(rupeeImage, 'JPEG', 88, doc.autoTable.previous.finalY + 18, 1.9, 1.9);
  // }
  doc.text("Employer Contribution(3.25%)      " + "                  :      " + employeercontributionamt + "", 15, doc.autoTable.previous.finalY + 20);
  // if (currencyformat == "₹") {
  //   doc.addImage(rupeeImage, 'JPEG', 88, doc.autoTable.previous.finalY + 23, 1.9, 1.9);
  // }
  doc.text("Employee Contribution(0.75%)                                    :      " + totalempesiamt + "", 15, doc.autoTable.previous.finalY + 25);
  // if (currencyformat == "₹") {
  //   doc.addImage(rupeeImage, 'JPEG', 88, doc.autoTable.previous.finalY + 28, 1.9, 1.9);
  // }
  doc.text("Total E.S.I       " + "                                                 :     " + totalesiamt + "", 15, doc.autoTable.previous.finalY + 30);

  doc.text("Cheque NO.", 15, doc.autoTable.previous.finalY + 50);
  doc.text("BANK", 115, doc.autoTable.previous.finalY + 50);

  doc.text("A.G.M", 15, doc.autoTable.previous.finalY + 65);
  doc.text("R.M", 95, doc.autoTable.previous.finalY + 65);
  doc.text("Manager", 165, doc.autoTable.previous.finalY + 65);
  doc.text("Account Officer", 225, doc.autoTable.previous.finalY + 65);

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
}
