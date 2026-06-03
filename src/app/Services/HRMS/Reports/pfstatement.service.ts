import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from '../../common.service';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import * as jsPDF from 'jspdf';
@Injectable({
  providedIn: 'root'
})
export class PfstatementService {

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

  GetPFStatementDetails(Month,BranchId): Observable<any> {
    debugger;
    const params = new HttpParams().set('MonthYear', Month).set('BranchId',BranchId);
  
    return this._CommonService.callGetAPI('/HRMS/GetEmployeePFDetails', params, 'YES');
  
  }

  _downloadPFStatementReportsPdf(reportName, gridData, gridheaders, colWidthHeight, pagetype, betweenorason, fromdate, todate, totalContribution, employerContribution, employeeContribution, pfContribution, printorpdf,totalamounts) {
    debugger;
    let address = this._CommonService.comapnydetails.pAddress1 + ' ' + this._CommonService.comapnydetails.pAddress2 + ' ' + this._CommonService.comapnydetails.pDistrict + ' ' + this._CommonService.comapnydetails.pcity + ' ' + this._CommonService.comapnydetails.pState + ' - ' + this._CommonService.comapnydetails.pPincode;

    let Companyreportdetails =this._CommonService.comapnydetails;
    let doc = new jsPDF(pagetype);
    //  let currency = this.currencysymbol;
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
      columnStyles: {
        0: { cellWidth: 'auto', },
        1: { cellWidth: 'auto', },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 40, },
        5: { cellWidth: 'auto', halign: 'right' },
        6: { cellWidth: 'auto', halign: 'right' },
        7: { cellWidth: 'auto', halign: 'right' },
        8: { cellWidth: 'auto', halign: 'right' },
        9: { cellWidth: 'auto', halign: 'right' },
        10: { cellWidth: 'auto', halign: 'right' },
        11: { cellWidth: 'auto', halign: 'right' },
        12: { cellWidth: 'auto', halign: 'right' },
        13: { cellWidth: 'auto', halign: 'right' },
        14: { cellWidth: 'auto', halign: 'right' }
      },
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
            doc.text(Companyreportdetails.pCompanyName, pageWidth/2,10,{align:'center'});
            doc.setFontSize(8);
            doc.text(address, 100, 15, 0, 0, 'left');
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
            //doc.text(Companyreportdetails.pCompanyName, 100, 10);
            doc.text(Companyreportdetails.pCompanyName, pageWidth/2,10,{align:'center'});
            doc.setFontSize(10);
            //doc.text(address, 80, 15, 0, 0, 'left');
            doc.text(address, 100, 15, 0, 0, 'left');
            if (!isNullOrEmptyString(Companyreportdetails.pCinNo)) {
              doc.text('CIN : ' + Companyreportdetails.pCinNo + '', 125, 20);
            }
            doc.setFontSize(14);

            //doc.text(reportName, 130, 30);
            doc.text(reportName, 100, 30);
            doc.setFontSize(10);

            doc.text('Branch : ' + Companyreportdetails.pBranchname + '', 235, 40);

            if (betweenorason == "Between") {

              doc.text('Between  : ' + fromdate + '  And  ' + todate + ' ', 15, 40);
            }
            else {

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
      //   debugger;
      //   if ((data.section == "body" && data.cell.colSpan != 18) && data.cell.raw != "0") {
      //     data.cell.text[0] = data.cell.raw;
      //   }
      //   // if (data.cell.raw == "0") {
      //   //   debugger;
      //   //   data.cell.text[0] = ' ' + data.cell.raw;
      //   // }
      // },
      didDrawCell: function (data) {

        if ((data.column.index == 6 || data.column.index == 7 || data.column.index == 8 || data.column.index == 9 || data.column.index == 10 || data.column.index == 11 || data.column.index == 12 || data.column.index == 13 || data.column.index == 5) && data.cell.section === 'body') {
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

    console.log(totalamounts)
    //let img = "data:image/png;base64,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";

    doc.setFontSize(10)
    // if (currencyformat == "₹") {
    //   doc.addImage(rupeeImage, 'JPEG', 87, doc.autoTable.previous.finalY + 18, 1.9, 1.9);
    // }
    //doc.text("Total                    " + "                 :     " + totalContribution + "", 30, doc.autoTable.previous.finalY + 20);
    doc.text("Total                    " + "               :  " + totalContribution + "", 30, doc.autoTable.previous.finalY + 20);

    // if (currencyformat == "₹") {
    //   doc.addImage(rupeeImage, 'JPEG', 87, doc.autoTable.previous.finalY + 23, 1.9, 1.9);
    // }
    doc.setFontSize(8)
    doc.text(totalamounts.totalGrossSalary + '',207, doc.autoTable.previous.finalY + 4);

    doc.text("Employer Contribution(13%)                 :     " + employerContribution + "", 30, doc.autoTable.previous.finalY + 25);
    // if (currencyformat == "₹") {
    //   doc.addImage(rupeeImage, 'JPEG', 87, doc.autoTable.previous.finalY + 28, 1.9, 1.9);
    // }
    doc.setFontSize(8)
    doc.text(totalamounts.employeercontributiontotal + '',274, doc.autoTable.previous.finalY + 4);

   
    doc.text("Employee Contribution(12%)      " + "           :     " + employeeContribution + "", 30, doc.autoTable.previous.finalY + 30);
    // if (currencyformat == "₹") {
    //   doc.addImage(rupeeImage, 'JPEG', 87, doc.autoTable.previous.finalY + 33, 1.9, 1.9);
    // }
    doc.setFontSize(8)
    doc.text(totalamounts.emppfwagestotal + '',224, doc.autoTable.previous.finalY + 4);

    doc.setFontSize(8)
    doc.text(totalamounts.employeecontributiontotal + '',250, doc.autoTable.previous.finalY + 4);
    

    doc.text("Total PF                     " + "                   :     " + pfContribution + "", 30, doc.autoTable.previous.finalY + 35);

    doc.text("Cheque NO.", 15, doc.autoTable.previous.finalY + 80);
    doc.text("Bank", 115, doc.autoTable.previous.finalY + 80);

    doc.text("A.G.M", 15, doc.autoTable.previous.finalY + 100);
    doc.text("R.M", 95, doc.autoTable.previous.finalY + 100);
    doc.text("Manager", 165, doc.autoTable.previous.finalY + 100);
    doc.text("Account Officer", 225, doc.autoTable.previous.finalY + 100);

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
