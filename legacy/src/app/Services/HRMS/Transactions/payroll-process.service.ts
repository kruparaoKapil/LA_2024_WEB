import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {  HttpParams } from '@angular/common/http';
import { CommonService } from '../../common.service';
import { formatDate } from '@angular/common';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import * as jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class PayrollProcessService {

  constructor(private _commonservice : CommonService) { }

  ///api​/HRMS​/getProcessApproveEmployes

  getProcessApproveEmployes(branchid) :Observable<any>{
    debugger;
    const params = new HttpParams().set('BranchId',branchid);
    return this._commonservice.callGetAPI('/HRMS/getProcessApproveEmployes',params,"YES");
  }


  ///api/HRMS/GetCalendarYear

  getCalendarYear() : Observable<any>{
    debugger;
    return this._commonservice.callGetAPI('/HRMS/GetCalendarYear','',"NO");
  }


  ///api/HRMS//api/HRMS/GetCalendarYearMonthPayroll

  getCalendarYearMonth(CalendarId) :Observable<any>{
    debugger;
    const params = new HttpParams().set('CalendarId',CalendarId);
    return this._commonservice.callGetAPI('/HRMS/GetCalendarYearMonthPayroll',params,"YES");
  }


  ///api/HRMS/GetEmployeeDetailsPayroll

  getEmployeeDetailsPayroll(branchid,monthyear) : Observable<any>{
    debugger;
    try{
      const params = new HttpParams().set('BranchId',branchid).set('MonthYear',monthyear);
      return this._commonservice.callGetAPI('/HRMS/GetEmployeeDetailsPayroll',params,"YES");
    }
    catch (e){
      this._commonservice.showErrorMessage(e);
    }
    
  }


  ////api/HRMS/SaveEmpPayroll

  saveEmpPayroll(data) :Observable<any>{
    debugger;
    try{
      return this._commonservice.callPostAPI('/HRMS/SaveEmpPayroll',data);
    }
    catch (e){
      this._commonservice.showErrorMessage(e);
    }
  }

  GetPayRollApprovalDetails(BranchId, MonthYear): Observable<any> {
    debugger;
    try{
      const params = new HttpParams().set('BranchId',BranchId ).set('MonthYear', MonthYear);

      return this._commonservice.callGetAPI('/HRMS/GetEmployeeDetailsPayrollApproval', params, 'YES');
    }
    catch (e){
      this._commonservice.showErrorMessage(e);
    }

  }

  GetCalendarYear() {
    debugger;

    return this._commonservice.callGetAPI('/HRMS/GetCalendarYear', '' ,'NO');

  }

  SavePayrollApproval(data,Type) {
    debugger
    try {
      return this._commonservice.callPostAPI('/HRMS/AuthoriseEmpPayroll?Type='+ Type, data);
    }

    catch (e) {
      this._commonservice.showErrorMessage(e);
    }

  }
  GetCalendarYearMonthDetails(CalendarId:any): Observable<any> {
    debugger;
    const params = new HttpParams().set('CalendarId', CalendarId);
    return this._commonservice.callGetAPI('/HRMS/GetCalendarYearMonthPayrollBeforeAuthorised', params, 'YES');
  
  }


  // PDF AND PRINT FUNCTION
   _downloadPayrollProcessApprovalPdf(reportName, gridData, gridheaders, colWidthHeight, pagetype, betweenorason, fromdate, todate, printorpdf,gridtotals,empCount) {
          debugger;
          let address = this._commonservice.comapnydetails.pAddress1 + ' ' + this._commonservice.comapnydetails.pAddress2 + ' ' + this._commonservice.comapnydetails.pDistrict + ' ' + this._commonservice.comapnydetails.pcity + ' ' + this._commonservice.comapnydetails.pState + ' - ' + this._commonservice.comapnydetails.pPincode;
          //let Companyreportdetails = this.comapnydetails;;
          let Companyreportdetails = this._commonservice.comapnydetails;
          let doc = new jsPDF(pagetype);
          //let currencyformat = this._CommonService.currencysymbol;
          //let rupeeImage = this._CommonService._getRupeeSymbol();
          let kapil_logo = this._commonservice.getKapilGroupLogo();
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
            if (i % 2 === 0) {
              row.unshift({
                rowSpan: 2,
                content: row[1],
                styles: { valign: 'middle', halign: 'left'},
              })
              row.splice(2,1);
            }
            if (i % 2 === 0) {
              row.unshift({
                rowSpan: 2,
                content: row[1],
                styles: { valign: 'middle', halign: 'left'},
              })
              row.splice(2,1);
            }
      
            body.push(row);
      
          }
          doc.autoTable({
            head: gridheaders,
            body: body,
            theme: 'grid',//'striped'|'grid'|'plain'|'css' = 'striped'
            headStyles: {
              fillColor: this._commonservice.pdfProperties("Header Color"),
              halign: this._commonservice.pdfProperties("Header Alignment"),
              fontSize: this._commonservice.pdfProperties("Header Fontsize")
            }, // Red
            styles: {
              cellPadding: 1, fontSize: this._commonservice.pdfProperties("Cell Fontsize"), cellWidth: 'wrap',
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
                  //doc.text(Companyreportdetails.pCompanyName, 60, 10);
                 //doc.text(Companyreportdetails.pCompanyName, 75, 10);
                 //syam
                 doc.text(Companyreportdetails.pCompanyName, pageWidth/2,20,{align:'center'});
      
                  doc.setFontSize(8);
                  //doc.text(address, 40, 17, 0, 0, 'left');
                  doc.text(address, pageWidth/2,20,{align:'center'});
                  //doc.text(address, 60, 17, 0, 0, 'left');
                  if (!isNullOrEmptyString(Companyreportdetails.pCinNo)) {
                    doc.text('CIN : ' + Companyreportdetails.pCinNo + '', 98, 26);
                  }
                  doc.setFontSize(14);
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
                  doc.text(Companyreportdetails.pCompanyName, pageWidth/2, 10,{align:'center'});
                  doc.setFontSize(10);
                  //doc.text(address, 80, 17, 0, 0, 'left');
                  doc.text(address, pageWidth/2,20,{align:'center'});
                  //doc.text(address, 80, 17, 0, 0, 'left');
                  if (!isNullOrEmptyString(Companyreportdetails.pCinNo)) {
                    doc.text('CIN : ' + Companyreportdetails.pCinNo + '', 98, 26);
                  }
                  doc.setFontSize(14);
      
                    doc.text(reportName, 105, 32);
      
                    doc.setFontSize(10);
                    //  doc.text('Printed On : ' + today + '', 15, 57);
                    doc.text('Branch : ' + Companyreportdetails.pBranchname + '', 235, 42);
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
      
      
      
          doc.setFontSize(12);
          ///By Ramakanth adding extra page for the totals : 27-09-2021
          if(doc.autoTable.previous.finalY+50 < doc.internal.pageSize.getHeight() - 15)
          {
          doc.setFont("helvetica", "bold");
          doc.text('Totals ', 20, doc.autoTable.previous.finalY + 8);
          doc.setFont("helvetica", "normal");
         // doc.text('No.of Employes        :'+empCount['No of Employees'], 20, doc.autoTable.previous.finalY +10 );
      
          doc.text('Basic                  :'+"     "+gridtotals['basic'], 20, doc.autoTable.previous.finalY + 15);
          // if (currencyformat == "₹") {
          //   doc.addImage(rupeeImage, 'JPEG', 54, doc.autoTable.previous.finalY + 13, 1.9, 1.9);
      
          // }
          doc.text('VDA                    :'+"     "+gridtotals['vda'], 20, doc.autoTable.previous.finalY + 20);
          // if (currencyformat == "₹") {
          //   doc.addImage(rupeeImage, 'JPEG', 54, doc.autoTable.previous.finalY + 18, 1.9, 1.9);
          // }
          doc.text('Arrears               :'+"     "+gridtotals['arrears'], 20, doc.autoTable.previous.finalY + 25);
          // if (currencyformat == "₹") {
          //   doc.addImage(rupeeImage, 'JPEG', 54, doc.autoTable.previous.finalY + 23, 1.9, 1.9);
          // }
          doc.text('Basic Protection :'+"     "+gridtotals['basicprotection'], 20, doc.autoTable.previous.finalY + 30);
          // if (currencyformat == "₹") {
          //   doc.addImage(rupeeImage, 'JPEG', 54, doc.autoTable.previous.finalY + 28, 1.9, 1.9);
          // }
          doc.text('Allowances         :'+"     "+gridtotals['allowances'], 20, doc.autoTable.previous.finalY + 35);
          // if (currencyformat == "₹") {
          //   doc.addImage(rupeeImage, 'JPEG', 54, doc.autoTable.previous.finalY + 33, 1.9, 1.9);
          // }
          doc.text('Special Allowance     :'+"     "+gridtotals['specialallowance'], 120, doc.autoTable.previous.finalY + 15);
          // if (currencyformat == "₹") {
          //   doc.addImage(rupeeImage, 'JPEG', 162, doc.autoTable.previous.finalY + 13, 1.9, 1.9);
          // }
          doc.text('Increment Protection :'+"     "+gridtotals['incrementprotection'], 120, doc.autoTable.previous.finalY + 20);
          // if (currencyformat == "₹") {
          //   doc.addImage(rupeeImage, 'JPEG', 162, doc.autoTable.previous.finalY + 18, 1.9, 1.9);
          // }
          doc.text('Advance                    :'+"     "+gridtotals['advances'], 120, doc.autoTable.previous.finalY + 25);
          // if (currencyformat == "₹") {
          //   doc.addImage(rupeeImage, 'JPEG', 162, doc.autoTable.previous.finalY + 23, 1.9, 1.9);
          // }
          doc.text('Insurance                  :'+"     "+gridtotals['insurance'], 120, doc.autoTable.previous.finalY + 30);
          // if (currencyformat == "₹") {
          //   doc.addImage(rupeeImage, 'JPEG', 162, doc.autoTable.previous.finalY + 28, 1.9, 1.9);
          // }
          doc.text('Recoveries                :'+"     "+gridtotals['recoveries'], 120, doc.autoTable.previous.finalY + 35);
          // if (currencyformat == "₹") {
          //   doc.addImage(rupeeImage, 'JPEG', 162, doc.autoTable.previous.finalY + 33, 1.9, 1.9);
      
          // }
      
      
          //Sowjanya 14-11-2024//
          doc.setFont("helvetica", "bold");
          doc.text('No.Of Employes :'+" "+empCount, 220, doc.autoTable.previous.finalY +8);
          doc.setFont("helvetica", "normal");
          //sowjanya Ends//
          doc.text('Income Tax :'+"     "+gridtotals['incometax'], 220, doc.autoTable.previous.finalY +15);
          // if (currencyformat == "₹") {
          //   doc.addImage(rupeeImage, 'JPEG', 245, doc.autoTable.previous.finalY + 13, 1.9, 1.9);
          // }
          doc.text('PF               :'+"     "+gridtotals['pf'], 220, doc.autoTable.previous.finalY + 20);
          // if (currencyformat == "₹") {
          //   doc.addImage(rupeeImage, 'JPEG', 245, doc.autoTable.previous.finalY + 18, 1.9, 1.9);
          // }
          doc.text('ESI              :'+"     "+gridtotals['esi'], 220, doc.autoTable.previous.finalY + 25);
          // if (currencyformat == "₹") {
          //   doc.addImage(rupeeImage, 'JPEG', 245, doc.autoTable.previous.finalY + 23, 1.9, 1.9);
          // }
          doc.text('Absent        :'+"     "+gridtotals['absenties'], 220, doc.autoTable.previous.finalY + 30);
          // if (currencyformat == "₹") {
          //   doc.addImage(rupeeImage, 'JPEG', 245, doc.autoTable.previous.finalY + 28, 1.9, 1.9);
          // }
          doc.text('Prof. Tax     :'+"     "+gridtotals['proftax'], 220, doc.autoTable.previous.finalY + 35);
          // if (currencyformat == "₹") {
          //   doc.addImage(rupeeImage, 'JPEG', 245, doc.autoTable.previous.finalY + 33, 1.9, 1.9);
          // }
          doc.setDrawColor(0, 0, 0);
          pdfInMM = 315;
          doc.line(10, doc.autoTable.previous.finalY + 40, (pdfInMM - lMargin - rMargin), doc.autoTable.previous.finalY + 40);
          doc.text('Total Gross Salary :'+"    "+gridtotals['gross'], 20, doc.autoTable.previous.finalY + 45);
          // if (currencyformat == "₹") {
          //   doc.addImage(rupeeImage, 'JPEG', 59, doc.autoTable.previous.finalY + 43, 1.9, 1.9);
          // }
          doc.text('Total Deductions:'+"    "+gridtotals['deductions'], 120, doc.autoTable.previous.finalY + 45);
          // if (currencyformat == "₹") {
          //   doc.addImage(rupeeImage, 'JPEG', 154, doc.autoTable.previous.finalY + 43, 1.9, 1.9);
          // }
          doc.text('Total Net Salary:'+"    "+gridtotals['net'], 220, doc.autoTable.previous.finalY + 45);
          // if (currencyformat == "₹") {
          //   doc.addImage(rupeeImage, 'JPEG', 253,doc.autoTable.previous.finalY + 43, 1.9, 1.9);
          // }
          doc.setDrawColor(0, 0, 0);
          pdfInMM = 315;
          doc.line(10, doc.autoTable.previous.finalY + 50, (pdfInMM - lMargin - rMargin), doc.autoTable.previous.finalY + 50);
          // doc.text("Cheque No.", 15, doc.autoTable.previous.finalY + 60);
          // doc.text("Bank", 115, doc.autoTable.previous.finalY + 60);
      
          doc.text("A.G.M", 15, doc.autoTable.previous.finalY + 70);
          doc.text("R.M", 95, doc.autoTable.previous.finalY + 70);
          doc.text("Manager", 165, doc.autoTable.previous.finalY + 70);
          doc.text("Account Officer", 225, doc.autoTable.previous.finalY + 70);
        }else{
          doc.addPage();
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.text('Totals '+ '', 15, 10);
          doc.setFont("helvetica", "normal");
         //doc.text('No.of Employes        :'+"      "+empCount,50, 10 );
          doc.text('Basic                  :'+"      "+gridtotals['basic'], 15,20);
          // if (currencyformat == "₹") {
          //   doc.addImage(rupeeImage, 44,  18, 2, 2);
          // }
          doc.text('VDA                   :'+"       "+gridtotals['vda'], 15, 30);
          // if (currencyformat == "₹") {
          //   doc.addImage(rupeeImage, 'JPEG', 44, 28, 2,2);
          // }
          doc.text('Arrears               :'+"      "+gridtotals['arrears'], 15, 40);
          // if (currencyformat == "₹") {
          //   doc.addImage(rupeeImage, 'JPEG', 44, 38,2,2);
          // }
          doc.text('Basic Protection :'+"      "+gridtotals['basicprotection'], 15, 50);
          // if (currencyformat == "₹") {
          //   doc.addImage(rupeeImage, 'JPEG', 44, 48,2,2);
          // }
          doc.text('Allowances         :'+"      "+gridtotals['allowances'], 15, 60);
      
          // if (currencyformat == "₹") {
          //   doc.addImage(rupeeImage, 'JPEG', 44, 58,2,2);
          // }
         /////////////////////////////////////////////////////////////////
         doc.text('Special Allowance     :'+"     "+gridtotals['specialallowance'], 120, 20);
      //    if (currencyformat == "₹") {
      //      doc.addImage(rupeeImage, 'JPEG', 156, 18, 2, 2);
      //    }
         doc.text('Increment Protection :'+"     "+gridtotals['incrementprotection'], 120,  30);
      //    if (currencyformat == "₹") {
      //      doc.addImage(rupeeImage, 'JPEG', 156, 28,  2, 2);
      //    }
         doc.text('Advance                    :'+"     "+gridtotals['advances'], 120, 40);
      //    if (currencyformat == "₹") {
      //      doc.addImage(rupeeImage, 'JPEG', 156, 38,  2, 2);
      //    }
         doc.text('Insurance                  :'+"     "+gridtotals['insurance'], 120, 50);
      //    if (currencyformat == "₹") {
      //      doc.addImage(rupeeImage, 'JPEG', 156, 48,  2, 2);
      //    }
         doc.text('Recoveries                :'+"     "+gridtotals['recoveries'], 120, 60);
      //    if (currencyformat == "₹") {
      //      doc.addImage(rupeeImage, 'JPEG', 156, 58,  2, 2);
      //    }
         ///////////////////////////////////////////////////////////////////////////////////////
         doc.setFont("helvetica", "bold");
         doc.text('No.of Employes   :'+"      "+empCount,220, 10 );
         doc.setFont("helvetica", "normal");
         doc.text('Income Tax         :'+"      "+gridtotals['incometax'], 220, 20);
      //    if (currencyformat == "₹") {
      //      doc.addImage(rupeeImage, 'JPEG', 250, 18, 2, 2);
      //    }
         doc.text('PF                       :  '    +"      "+gridtotals['pf'], 220, 30);
      //    if (currencyformat == "₹") {
      //      doc.addImage(rupeeImage, 'JPEG', 250, 28, 2, 2);
      //    }
         doc.text('ESI                      :'+"       "+gridtotals['esi'], 220, 40);
      //    if (currencyformat == "₹") {
      //      doc.addImage(rupeeImage, 'JPEG', 250, 38, 2, 2);
      //    }
         doc.text('Absent                :'+"        "+gridtotals['absenties'], 220, 50);
      //    if (currencyformat == "₹") {
      //      doc.addImage(rupeeImage, 'JPEG', 250, 48, 2, 2);
      //    }
         doc.text('Prof. Tax             :'+"      "+gridtotals['proftax'], 220, 60);
      //    if (currencyformat == "₹") {
      //      doc.addImage(rupeeImage, 'JPEG', 250,58, 2, 2);
      //    }
         ///////////////////////////////////////////////////////////////////////////////////////
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
            this.setiFrameForPrint(doc);
          }
      
        }

        setiFrameForPrint(doc) {
          debugger;
          const iframe = document.createElement('iframe');
          iframe.id = "iprint";
          iframe.name = "iprint";
          iframe.src = doc.output('bloburl');
          iframe.setAttribute('style', 'display: none;');
          document.body.appendChild(iframe);
          iframe.contentWindow.print();
        }

_downloadReimbursementPdf(reportName, gridData, gridheaders, colWidthHeight, pagetype, betweenorason, fromdate, todate, printorpdf, gridtotals, empCount) {
  debugger;
  console.log('gridtotals in service:', gridtotals);
console.log('total value:', gridtotals['total']);
  let address = this._commonservice.comapnydetails.pAddress1 + ' ' + this._commonservice.comapnydetails.pAddress2 + ' ' + this._commonservice.comapnydetails.pDistrict + ' ' + this._commonservice.comapnydetails.pcity + ' ' + this._commonservice.comapnydetails.pState + ' - ' + this._commonservice.comapnydetails.pPincode;
  let Companyreportdetails = this._commonservice.comapnydetails;
  let doc = new jsPDF(pagetype);
  let kapil_logo = this._commonservice.getKapilGroupLogo();

  let pageSize = doc.internal.pageSize;
  let pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();

  let totalPagesExp = '{total_pages_count_string}'
  let today = formatDate(new Date(), 'dd-MMM-yyyy  h:mm:ss a', 'en-IN');
  var lMargin = 15;
  var rMargin = 15;
  var pdfInMM;
  let data2;

  var raw = gridData;
  var body = [];

  // Simple loop — NO rowSpan, one row per employee
  for (var i = 0; i < raw.length; i++) {
    var row = [];
    for (var key in raw[i]) {
      row.push(raw[i][key]);
    }
    body.push(row);
  }

  doc.autoTable({
    head: gridheaders,
    body: body,
    theme: 'grid',
    headStyles: {
      fillColor: this._commonservice.pdfProperties("Header Color"),
      halign: this._commonservice.pdfProperties("Header Alignment"),
      fontSize: this._commonservice.pdfProperties("Header Fontsize"),
      minCellHeight: 8,
      cellPadding: 2,
    },
    styles: {
      cellPadding: 3,
      fontSize: this._commonservice.pdfProperties("Cell Fontsize"),
      cellWidth: 'wrap',
      rowPageBreak: 'avoid',
      overflow: 'linebreak',
      minCellHeight: 8,
    },
    columnStyles: colWidthHeight,
    startY: 48,
    showHead: 'everyPage',
    showFoot: 'lastPage',
    didDrawPage: function(data) {
      let pageSize = doc.internal.pageSize;
      let pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
      let pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
      data2 = data;

      doc.setFontStyle('normal');
      if (doc.internal.getNumberOfPages() == 1) {
        doc.setFontSize(15);
        if (pagetype == "landscape") {
          doc.addImage(kapil_logo, 'JPEG', 15, 5);
          doc.setTextColor('black');
          doc.text(Companyreportdetails.pCompanyName, pageWidth / 2, 10, { align: 'center' });
          doc.setFontSize(10);
          doc.text(address, pageWidth / 2, 20, { align: 'center' });
          if (!isNullOrEmptyString(Companyreportdetails.pCinNo)) {
            doc.text('CIN : ' + Companyreportdetails.pCinNo + '', 98, 26);
          }
          doc.setFontSize(14);
          doc.text(reportName, 105, 32);
          doc.setFontSize(10);
          doc.text('Branch : ' + Companyreportdetails.pBranchname + '', 235, 42);
          doc.setDrawColor(0, 0, 0);
          pdfInMM = 315;
          doc.line(10, 45, (pdfInMM - lMargin - rMargin), 45);
        }
      } else {
        data.settings.margin.top = 20;
        data.settings.margin.bottom = 15;
      }

      var pageCount = doc.internal.getNumberOfPages();
      let page = "Page " + doc.internal.getNumberOfPages();
      if (typeof doc.putTotalPages === 'function') {
        page = page + ' of ' + totalPagesExp;
      }
      doc.line(5, pageHeight - 10, (pdfInMM - lMargin - rMargin), pageHeight - 10);
      doc.setFontSize(10);
      doc.text("Printed on : " + today, data.settings.margin.left, pageHeight - 5);
      doc.text(page, pageWidth - data.settings.margin.right - 20, pageHeight - 5);
    }
  });

  doc.setFontSize(12);
if (doc.autoTable.previous.finalY + 50 < doc.internal.pageSize.getHeight() - 15) {

  doc.setFont("helvetica", "bold");
  doc.text('Totals', 20, doc.autoTable.previous.finalY + 8);
  doc.setFont("helvetica", "normal");

  doc.setFont("helvetica", "bold");
  doc.text('No.Of Employes : ' + empCount, 220, doc.autoTable.previous.finalY + 8);
  doc.setFont("helvetica", "normal");

  // Separate totals
  doc.text('Education : ' + gridtotals['education'], 20,  doc.autoTable.previous.finalY + 15);
  doc.text('Loyalty    : ' + gridtotals['loyalty'],   120, doc.autoTable.previous.finalY + 15);
  doc.text('Vehicle    : ' + gridtotals['vehicle'],   220, doc.autoTable.previous.finalY + 15);

  doc.setDrawColor(0, 0, 0);
  pdfInMM = 315;
  doc.line(10, doc.autoTable.previous.finalY + 20, (pdfInMM - lMargin - rMargin), doc.autoTable.previous.finalY + 20);

  // Grand total
  doc.text('Total Reimbursement : ' + gridtotals['total'], 20, doc.autoTable.previous.finalY + 25);

  doc.setDrawColor(0, 0, 0);
  doc.line(10, doc.autoTable.previous.finalY + 30, (pdfInMM - lMargin - rMargin), doc.autoTable.previous.finalY + 30);

  doc.text("A.G.M",           15,  doc.autoTable.previous.finalY + 40);
  doc.text("R.M",             95,  doc.autoTable.previous.finalY + 40);
  doc.text("Manager",         165, doc.autoTable.previous.finalY + 40);
  doc.text("Account Officer", 225, doc.autoTable.previous.finalY + 40);

} else {

  doc.addPage();
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text('Totals', 15, 10);
  doc.setFont("helvetica", "normal");

  doc.setFont("helvetica", "bold");
  doc.text('No.Of Employes : ' + empCount, 220, 10);
  doc.setFont("helvetica", "normal");

  // Separate totals
  doc.text('Education : ' + gridtotals['education'], 15,  18);
  doc.text('Loyalty    : ' + gridtotals['loyalty'],   120, 18);
  doc.text('Vehicle    : ' + gridtotals['vehicle'],   220, 18);

  doc.setDrawColor(0, 0, 0);
  pdfInMM = 315;
  doc.line(10, 23, (pdfInMM - lMargin - rMargin), 23);

  // Grand total
  doc.text('Total Reimbursement : ' + gridtotals['total'], 15, 28);

  doc.setDrawColor(0, 0, 0);
  doc.line(10, 33, (pdfInMM - lMargin - rMargin), 33);

  doc.text("A.G.M",           15,  45);
  doc.text("R.M",             95,  45);
  doc.text("Manager",         165, 45);
  doc.text("Account Officer", 225, 45);
}

  if (typeof doc.putTotalPages === 'function') {
    doc.putTotalPages(totalPagesExp);
  }
  if (printorpdf == "Pdf") {
    doc.save('' + reportName + '.pdf');
  }
  if (printorpdf == "Print") {
    this.setiFrameForPrint(doc);
  }
}
}
