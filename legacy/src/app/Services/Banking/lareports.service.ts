import { Injectable } from '@angular/core';
import { CommonService } from '../common.service';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import * as jsPDF from 'jspdf';


@Injectable({
    providedIn: 'root'
})


export class LAReportsService {

    Data: any;
    ButtonClickType: any;
    ShowData: any = [];

    constructor(private commonservice: CommonService) { }

    ShowInterestPaymentReport() {
        return this.commonservice.callGetAPI('/Banking/Report/LAReports/ShowInterestPaymentReport', '', 'No');
    }
    ShowInterestTrendShemeAndDatewiseDetails(schemename, maturitydate) {
        const params = new HttpParams().set('schemename', schemename).set('maturitydate', maturitydate);
        return this.commonservice.callGetAPI('/Banking/Report/LAReports/ShowInterestTrendShemeAndDatewiseDetails', params, 'Yes');
    }
    ShowInterestTrendGrandTotalDatewiseDetails(maturitydate) {
        const params = new HttpParams().set('maturitydate', maturitydate);
        return this.commonservice.callGetAPI('/Banking/Report/LAReports/ShowInterestTrendGrandTotalDatewiseDetails', params, 'Yes');
    }

    ShowMaturityTrendGridHeader() {
        return this.commonservice.callGetAPI('/Banking/Report/LAReports/ShowMaturityTrendGridHeader', '', 'No');
    }
    ShowMaturityTrendReport() {
        return this.commonservice.callGetAPI('/Banking/Report/LAReports/ShowMaturityTrendReport', '', 'No');
    }
    ShowShemeAndDatewiseDetails(schemename, maturitydate) {
        const params = new HttpParams().set('schemename', schemename).set('maturitydate', maturitydate);
        return this.commonservice.callGetAPI('/Banking/Report/LAReports/ShowShemeAndDatewiseDetails', params, 'Yes');
    }
    PrintMaturityTrendDetails(maturitydate)
    {
        const params = new HttpParams().set('maturitydate', maturitydate);
        return this.commonservice.callGetAPI('/Banking/Report/LAReports/PrintMaturityTrendDetailsReport', params, 'Yes');
    }
    PrintInterestPaymentTrendDetails(maturitydate)
    {
        const params = new HttpParams().set('maturitydate', maturitydate);
        return this.commonservice.callGetAPI('/Banking/Report/LAReports/PrintInterestTrendDetailsReport', params, 'Yes');
    }
    ShowGrandTotalDatewiseDetails(maturitydate) {
        const params = new HttpParams().set('maturitydate', maturitydate);
        return this.commonservice.callGetAPI('/Banking/Report/LAReports/ShowGrandTotalDatewiseDetails', params, 'Yes');
    }
    SaveMaturityIntimationReport(data1) {
        debugger;
        return this.commonservice.callPostAPI('/Banking/Report/LAReports/SaveMaturityIntimationReport', data1)

    }
    GetMemberEnquiryDetailsReport(FdAccountNo)
    {
        const params = new HttpParams().set('FdAccountNo', FdAccountNo);
        return this.commonservice.callGetAPI('/Banking/Report/MemberEnquiry/GetMemberEnquiryDetailsReport', params, 'Yes');
    }



    GetMaturityIntimationLetter(fdaccountno) {
        const params = new HttpParams().set('fdaccountno', fdaccountno);
        return this.commonservice.callGetAPI('/Banking/Report/LAReports/GetMaturityIntimationLetter', params, 'Yes')
    }
    GetShowmaturityReport(schemeid, branchname, frommonthof, tomonthof) {
        debugger

        const params = new HttpParams().set('schemeid', schemeid).set('branchname', branchname).set('fromdate', frommonthof).set('todate', tomonthof);
        return this.commonservice.callGetAPI('/Banking/Report/LAReports/ShowMaturityIntimationReport', params, 'Yes')


    }


    GetLeanreleaseReport(branchname, frommonthof, tomonthof) {
        debugger;
        const params = new HttpParams().set('branchname', branchname).set('fromdate', frommonthof).set('todate', tomonthof);
        return this.commonservice.callGetAPI('/Banking/Report/LAReports/ShowLienReleaseReport', params, 'Yes')

    }
    GetLienBranchDetails() {
        return this.commonservice.callGetAPI('/Banking/Report/LAReports/GetLienbrnach', '', 'No');
    }
    GetmaturityBranchDetails(schemeid) {
        const params = new HttpParams().set('schemeid', schemeid);
        return this.commonservice.callGetAPI('/Banking/Report/LAReports/GetMaturitybrnach', params, 'Yes');
    }
    GetMaturityscheme() {
        return this.commonservice.callGetAPI('/Banking/Report/LAReports/GetMaturityscheme', '', 'No');
    }
    GetInterestreportscheme() {
        return this.commonservice.callGetAPI('/Banking/Report/LAReports/GetInterestreportscheme', '', 'No');
    }
    GetBranchDetailsIP(companyname) {
        const params = new HttpParams().set('companyname', companyname);
        return this.commonservice.callGetAPI('/Banking/Report/LAReports/GetSelfAdjustmentbrnach', params, 'Yes')

    }
    GetCompanydetails() {
        return this.commonservice.callGetAPI('/Banking/Report/LAReports/GetSelfAdjustmentcompany', '', 'No')

    }

    GetselfadjustmentReport(paymenttype, companyname, branchname, frommonthof, tomonthof) {
        debugger;
        const params = new HttpParams().set('paymenttype', paymenttype).set('companyname', companyname).set('branchname', branchname).set('fromdate', frommonthof).set('todate', tomonthof);
        return this.commonservice.callGetAPI('/Banking/Report/LAReports/ShowSelfAdjustmentReport', params, 'Yes')

    }
    ShowPrematurityReport(frommonthof, tomonthof, type, pdatecheked) {
        const params = new HttpParams().set('fromdate', frommonthof).set('todate', tomonthof).set('type', type).set('pdatecheked', pdatecheked);
        return this.commonservice.callGetAPI('/Banking/Report/LAReports/ShowPreMaturityReport', params, 'Yes')

    }
    ShowmemberreceiptReport(membername, frommonthof, tomonthof, pdatecheked) {
        const params = new HttpParams().set('memberid', membername).set('fromdate', frommonthof).set('todate', tomonthof).set('pdatecheked', pdatecheked);
        return this.commonservice.callGetAPI('/Banking/Report/LAReports/ShowMemberwiseReceiptsReport', params, 'Yes')

    }
    GetMemberdetails() {
        return this.commonservice.callGetAPI('/Banking/Report/LAReports/GetMemberName', '', 'No');
    }

    GetAccnodetails(paymenttype, companyname, branchname, schemeid) {

        const params = new HttpParams().set('paymenttype', paymenttype).set('companyname', companyname).set('branchname', branchname).set('schemeid', schemeid);
        return this.commonservice.callGetAPI('/Banking/Report/LAReports/GetInterestreportfdaccountnos', params, 'Yes');
    }
    GetCashFlowSummary(date,months)
    {
        const params = new HttpParams().set('date', date).set('months', months);
        return this.commonservice.callGetAPI('/Banking/Report/LAReports/GetCashFlowSummary', params, 'Yes');
    }
    GetCashFlowDetails(Asonmonth,month)
    {
        const params = new HttpParams().set('Asonmonth', Asonmonth).set('month', month);
        return this.commonservice.callGetAPI('/Banking/Report/LAReports/GetCashFlowDetails', params, 'Yes');
    }
    GetCashFlowPerticularsDetails(perticulars,Asonmonth)
    {
        debugger
        const params = new HttpParams().set('perticulars', perticulars).set('Asonmonth', Asonmonth);
        return this.commonservice.callGetAPI('/Banking/Report/LAReports/GetCashFlowPerticularsDetails', params, 'Yes');
    }
    GetAgentPointsSummary(Rfrommonthof, Rtomonthof,Cfrommonthof ,Ctomonthof ) {

        const params = new HttpParams().set('receiptfromdate', Rfrommonthof).set('receipttodate', Rtomonthof).set('chequefromdate', Cfrommonthof).set('chequetodate',Ctomonthof);
        return this.commonservice.callGetAPI('/Banking/Report/LAReports/GetAgentPointsSummary', params, 'Yes');
    }
    GetAgentPointsDetails(Agentname) {
        const params = new HttpParams().set('Agentname', Agentname)
        return this.commonservice.callGetAPI('/Banking/Report/LAReports/GetAgentPointsDetails', params, 'Yes');

    }

    //Banking/Report/LAReports/GetAgentwiseBusinessReport

    GetAgentwiseBusinessReport(Rfrommonthof, Rtomonthof,Cfrommonthof ,Ctomonthof ) {

        const params = new HttpParams().set('receiptfromdate', Rfrommonthof).set('receipttodate', Rtomonthof).set('chequefromdate', Cfrommonthof).set('chequetodate',Ctomonthof);
        return this.commonservice.callGetAPI('/Banking/Report/LAReports/GetAgentwiseBusinessReport', params, 'Yes');
    }

    GetTargetdetailsReport(Rfrommonthof, Rtomonthof,Cfrommonthof ,Ctomonthof ) {

        const params = new HttpParams().set('receiptfromdate', Rfrommonthof).set('receipttodate', Rtomonthof).set('chequefromdate', Cfrommonthof).set('chequetodate',Ctomonthof);
        return this.commonservice.callGetAPI('/Banking/Report/LAReports/GetTargetReportSummary', params, 'Yes');
    }
    ShowtargetDetails(Branchtye) {
        const params = new HttpParams().set('branch', Branchtye)
        return this.commonservice.callGetAPI('/Banking/Report/LAReports/GetTargetReportDetails', params, 'Yes');

    }
    GetApplicationFormDetails(FdAccountNo)
    {
        const params = new HttpParams().set('FdAccountNo', FdAccountNo);
        return this.commonservice.callGetAPI('/Banking/Report/LAReports/GetApplicationFormDetails', params, 'Yes');
    }
     GetMemberDetails(datecheck,fromdate,todate)
    {
        const params = new HttpParams().set('datecheck', datecheck).set('fromdate', fromdate).set('todate', todate);
        return this.commonservice.callGetAPI('/Banking/Report/MemberEnquiry/GetMemberDetailsReport', params, 'Yes');
    }
     GetShareIssueDetails(datecheck,fromdate,todate)
    {
        const params = new HttpParams().set('datecheck', datecheck).set('fromdate', fromdate).set('todate', todate);
        return this.commonservice.callGetAPI('/Banking/Report/MemberEnquiry/GetShareIssueReport', params, 'Yes');
    }
    GetSADetails(datecheck,fromdate,todate)
    {
        const params = new HttpParams().set('datecheck', datecheck).set('fromdate', fromdate).set('todate', todate);
        return this.commonservice.callGetAPI('/Banking/Report/MemberEnquiry/GetSavingAccountReport', params, 'Yes');
    }
    GetShareSADetails(accounttype,datecheck,fromdate,todate)
    {
        const params = new HttpParams().set('accounttype',accounttype).set('datecheck', datecheck).set('fromdate', fromdate).set('todate', todate);
        return this.commonservice.callGetAPI('/Banking/Report/MemberEnquiry/GetShareSavingWithdrawDetails', params, 'Yes');
    }


    showBrancwiseReceiptsReport(Branchid, BranchName, fromdate, todate,pdatecheked) {
        const params = new HttpParams().set('Branchid', Branchid).set('BranchName', BranchName).set('fromdate', fromdate).set('todate', todate).set('pdatecheked', pdatecheked);
        return this.commonservice.callGetAPI('/Banking/Report/LAReports/ShowBrancwiseReceiptsReport', params, 'Yes')

    }
    //Banking/Report/LAReports/ShowBrancwiseReceiptsReport

//api/Banking/Transactions/MaturityPayment/GetPreMaturityMonthwise

getPreMaturityMonthWise(maturitytype, datetype, fromdate, todate) {
    const params = new HttpParams().set('maturitytype', maturitytype).set('datetype', datetype).set('fromdate', fromdate).set('todate', todate);
    return this.commonservice.callGetAPI('/Banking/Transactions/MaturityPayment/GetPreMaturityMonthwise', params, 'Yes')

}


//Banking/Transactions/MaturityPayment/GetPreMaturityMonthwise1

GetPreMaturityMonthwise1(datetype, fromdate, todate) {
  const params = new HttpParams().set('datetype', datetype).set('fromdate', fromdate).set('todate', todate);
  return this.commonservice.callGetAPI('/Banking/Transactions/MaturityPayment/GetPreMaturityMonthwise1', params, 'Yes')

}

//api/Banking/Transactions/IntrestPayment/GetInterestpaymentdetails
getInterestpaymentdetails(fromdate,todate) :Observable<any>{
    const params = new HttpParams().set('fromdate',fromdate).set('todate',todate);
    return this.commonservice.callGetAPI('/Banking/Transactions/IntrestPayment/GetInterestpaymentdetails',params,'YES');
}

_downLoadLoyaltystatementPDF(reportName, gridData, gridheaders, colWidthHeight, pagetype, betweenorason, fromdate, todate, printorpdf) {
    debugger;
    let address = this.commonservice.comapnydetails.pAddress1 + ' ' + this.commonservice.comapnydetails.pAddress2 + ' ' + this.commonservice.comapnydetails.pDistrict + ' ' + this.commonservice.comapnydetails.pcity + ' ' + this.commonservice.comapnydetails.pState + ' - ' + this.commonservice.comapnydetails.pPincode;
    let Companyreportdetails = this.commonservice.comapnydetails;
    let doc = new jsPDF(pagetype);
    //let currencyformat = this.currencysymbol;
    //let rupeeImage = this._getRupeeSymbol();
    // let doc = new jsPDF('lanscape');
    let totalPagesExp = '{total_pages_count_string}'
    let today = this.commonservice.pdfProperties("Date");
    // let Easy_chit_Img = this.Easy_chit_Img;
    let kapil_logo = this.commonservice.getKapilGroupLogo();
    var lMargin = 15; //left margin in mm
    var rMargin = 15; //right margin in mm
    var pdfInMM;

    doc.autoTable({
      columns: gridheaders,
      body: gridData,
      theme: 'grid',//'striped'|'grid'|'plain'|'css' = 'striped'
      headStyles: {
        fillColor: this.commonservice.pdfProperties("Header Color"),
        halign: this.commonservice.pdfProperties("Header Alignment"),
        fontSize: this.commonservice.pdfProperties("Header Fontsize")
      }, // Red
      styles: {
        cellPadding: 1, fontSize: this.commonservice.pdfProperties("Cell Fontsize"), cellWidth: 'wrap',
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
      this.commonservice.setiFrameForPrint(doc);
    }

  }

  GetAgentReportdetails(datetype, fromdate, todate,agentId) {
    const params = new HttpParams().set('datetype', datetype).set('fromdate', fromdate).set('todate', todate).set('agentId', agentId);
    return this.commonservice.callGetAPI('/Banking/Transactions/IntrestPayment/GetAgentReportdetails', params, 'Yes')

  }

 GetProductSummaryData(selectedmonth): Observable<any> {
      const params = new HttpParams().set('selectedmonth', selectedmonth);
      return this.commonservice.callGetAPI('/Banking/Transactions/FdReceipt/GetProjectSummarydata', params, 'Yes');
  }
   GetProdAchievedData(selectedmonth): Observable<any> {
      const params = new HttpParams().set('selectedmonth', selectedmonth);
      return this.commonservice.callGetAPI('/Banking/Transactions/FdReceipt/GetProjectAchievedData', params, 'Yes');
  }

  GetProductionTargetData(selectedmonth){
    debugger;
    const params = new HttpParams().set('selectedmonth',selectedmonth);
    return this.commonservice.callGetAPI('/Banking/Transactions/FdReceipt/GetTargetAchievedData',params,'YES');
  }



}
