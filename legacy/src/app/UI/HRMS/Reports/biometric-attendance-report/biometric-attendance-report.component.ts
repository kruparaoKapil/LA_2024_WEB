// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-biometric-attendance-report',
//   templateUrl: './biometric-attendance-report.component.html',
//   styles: []
// })
// export class BiometricAttendanceReportComponent implements OnInit {

//   constructor() { }

//   ngOnInit() {
//   }

// }


import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
//import { PageCriteria } from 'src/app/Models/pagecriteria';
import { PageCriteria } from 'src/app/Models/Loans/Masters/pagecriteria';

//import { HrmseployeeattendanceService } from 'src/app/Services/HRMS/hrmseployeeattendance.service';
import { CommonService } from 'src/app/Services/common.service';
import * as jsPDF from 'jspdf';
import { error } from 'console';
@Component({
  selector: 'app-biometric-attendance-report',
  templateUrl: './biometric-attendance-report.component.html',
  styles: []
})
export class BiometricAttendanceReportComponent implements OnInit {
  BiometricAttendanceReportForm:FormGroup;
  showbuttontext="Show";
  showbuttonbool:boolean=false;
  public dpConfig1:Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpConfig2:Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  ngxgridData:any=[];
  pageCriteria:PageCriteria;
  leavetypelst:any=[];
  BiometricAttendanceReportFormValidation:any={};
  constructor(private fb:FormBuilder,private commonservice:CommonService) {
    this.dpConfig1.containerClass=this.commonservice.datePickerPropertiesSetup("containerClass");
    this.dpConfig1.dateInputFormat=this.commonservice.datePickerPropertiesSetup("dateInputFormat");
    this.dpConfig1.maxDate=new Date();
    this.dpConfig1.showWeekNumbers=false;

    this.dpConfig2.containerClass=this.commonservice.datePickerPropertiesSetup("containerClass");
    this.dpConfig2.dateInputFormat=this.commonservice.datePickerPropertiesSetup("dateInputFormat");
    this.dpConfig2.maxDate=new Date();
    this.dpConfig2.showWeekNumbers=false;
    this.pageCriteria=new PageCriteria();
  }

  ngOnInit(): void {
    this.FormDetails();
    this.setPageModel();
    this.leavetypelst=[{leavetypee:"ALL",leavetype:"L"},{leavetypee:"Present",leavetype:"P"},{leavetypee:"Absent",leavetype:"A"}];
  }
  FormDetails(){
    this.BiometricAttendanceReportForm=this.fb.group({
      fromdate:[new Date()],
      todate:[new Date()],
      leavetype:[null,Validators.required]
    });
  }
  show(){
    debugger
    if (this.checkValidations(this.BiometricAttendanceReportForm,true)){
    this.showbuttontext="Processing";
    this.showbuttonbool=true;
    let fromdate=this.commonservice.getFormatDateNormal(this.BiometricAttendanceReportForm.controls.fromdate.value);
    let todate=this.commonservice.getFormatDateNormal(this.BiometricAttendanceReportForm.controls.todate.value);
    let leavetype=this.BiometricAttendanceReportForm.controls.leavetype.value;
    this.commonservice.getBiometricAttendanceReportData(this.commonservice.getschemaname(),fromdate,todate,leavetype).subscribe(res=>{
      this.ngxgridData=res;
      this.showbuttontext="Show";
      this.showbuttonbool=false;
      console.log(this.ngxgridData);
      let value;
        this.pageCriteria.totalrows = this.ngxgridData.length;
        this.pageCriteria.TotalPages;
        if (this.pageCriteria.totalrows > 10) {
          value = this.pageCriteria.totalrows / 10;
          if (value.toString().includes('.')) {
            this.pageCriteria.TotalPages = parseInt((this.pageCriteria.totalrows / 10).toString()) + 1;
          }
          else {
            this.pageCriteria.TotalPages = parseInt((this.pageCriteria.totalrows / 10).toString());
          }
        }
        if (this.ngxgridData.length < this.pageCriteria.pageSize) {
          this.pageCriteria.currentPageRows = this.ngxgridData.length;
        }
        else {
          this.pageCriteria.currentPageRows = this.pageCriteria.pageSize;
        }
    },(error)=>{
      this.commonservice.showErrorMessage(error);
      this.showbuttontext="Show";
      this.showbuttonbool=false;
    })
    }
  }
  setPageModel() {
    this.pageCriteria.pageSize = this.commonservice.pageSize;
    this.pageCriteria.offset = 0;
    this.pageCriteria.pageNumber = 1;
    this.pageCriteria.footerPageHeight = 50;
  }
  onFooterPageChange(event): void {
    this.pageCriteria.offset = event.page - 1;
    this.pageCriteria.CurrentPage = event.page;
    if (this.pageCriteria.totalrows < event.page * this.pageCriteria.pageSize) {
      this.pageCriteria.currentPageRows = this.pageCriteria.totalrows % this.pageCriteria.pageSize;
    }
    else {
      this.pageCriteria.currentPageRows = this.pageCriteria.pageSize;
    }
  }
  pdfOrprint(pdfOrprint){
    debugger
    let fromdate=this.commonservice.getFormatDateGlobal(this.BiometricAttendanceReportForm.controls.fromdate.value);
    let todate=this.commonservice.getFormatDateGlobal(this.BiometricAttendanceReportForm.controls.todate.value);
    let headers=[['Branch','Employee Code','Employee Name','Date','Leave Type','Remarks']];
    let griddata=[];
    let columstyles={0:{cellWidth:'auto',halign: 'left'},
    1:{cellWidth:'auto',halign: 'left'},
    2:{cellWidth:'auto',halign: 'left'},
    3:{cellWidth:'auto',halign: 'center'},
    4:{cellWidth:'auto',halign: 'center'},
    5:{cellWidth:'auto',halign: 'left'}};
    this.ngxgridData.forEach(element=>{
      let temp;
      let date;
      if (element.date){
        date=this.commonservice.getFormatDateGlobal(element.date);
      }else{
        date='--NA--';
      }
      let leavetype;
      if (element.leavetype){
        leavetype=element.leavetype;
      }else{
        leavetype='--NA--';
      }
      let remarks;
      if (element.remarks){
        remarks=element.remarks;
      }else{
        remarks='--NA--';
      }
      temp=[element.branchname,element.employeecode,element.employeename,date,leavetype,remarks]
      griddata.push(temp);
    });
    if (this.ngxgridData.length>0){
      this.downloadleavedetails(pdfOrprint,headers,griddata,fromdate,todate,columstyles);
    }else{
      this.commonservice.showWarningMessage('No data to print/save!!');
    }
  }
  downloadleavedetails(printorpdf,headers,gridrows,fromdate,todate,columstyles){
    debugger
    let doc=new jsPDF('a4'); //a4
    let data=[];
    let reportName='Biometric Attendance Report';
    let temp=[]
    let address = this.commonservice.getcompanyaddress();
    let Companyreportdetails = this.commonservice._getCompanyDetails();
    let totalPagesExp = '{total_pages_count_string}'
    let today = this.commonservice.pdfProperties("Date");
    let kapil_logo = this.commonservice.getKapilGroupLogo();
    var lMargin = 15; //left margin in mm
    var rMargin = 15; //right margin in mm
    var pdfInMM=233;
    let pdfgridData=gridrows;
    console.log(fromdate,todate);
    let pagetype='a4';
    // if (pdfgridData.length>0){
      data=pdfgridData
    doc.autoTable({
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
      head:headers,
      bodyStyles: {lineColor: [0, 0, 0],textColor :[0,0,0]},
      columnStyles:columstyles,
      body:data,
      startY:60,
      didDrawPage: function (data) {
        let pageSize = doc.internal.pageSize;
        let pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
        let pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        // Header
        doc.setFontStyle('normal');
        if (doc.internal.getNumberOfPages() == 1) {
          debugger;
          doc.setFontSize(15);
          doc.setFont("Times-Italic")
          if (pagetype == "a4") {
            doc.addImage(kapil_logo, 'JPEG', 10, 15, 20, 20)
            doc.setTextColor('black');
            doc.text(Companyreportdetails.pCompanyName, 60, 20);
            doc.setFontSize(8);
            doc.text(address, 40, 27, 0, 0, 'left');
            if (!isNullOrEmptyString(Companyreportdetails.pCinNo)) {
              doc.text('CIN : ' + Companyreportdetails.pCinNo + '', 85, 32);
            }
            doc.setFontSize(14);
            doc.text(reportName, pageWidth/2, 42,{align:'center'}); // actual=90
            doc.setFontSize(10);
            //  doc.text('Printed On : ' + today + '', 15, 57);
            doc.text('Branch : ' + Companyreportdetails.pBranchname + '', 161, 52); //actual=163,50
              doc.text('From Date : ' + fromdate +' ', 15, 52);//50
              doc.text('To Date : ' + todate, 54, 52);
            doc.setDrawColor(0, 0, 0);
            pdfInMM = 233;
            // doc.line(10, 45, (pdfInMM - lMargin - rMargin), 45) // horizontal line
            doc.line(10, 56, (pdfInMM - lMargin - rMargin), 56) //added *
          }}
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
        doc.line(5, pageHeight - 10, (pdfInMM - lMargin - rMargin), pageHeight - 10) // horizontal linev
        doc.setFontSize(10);
        doc.text("Printed on : " + today, data.settings.margin.left, pageHeight - 5);

        doc.text(page, pageWidth - data.settings.margin.right - 20, pageHeight - 5);
      }
    });
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
  todateChange($event){
    this.dpConfig2.minDate=$event
  }
  selectleavetype($event){
    debugger
    let value=$event;
    this.BiometricAttendanceReportForm.controls.leavetype.setValue(value);
    this.ngxgridData=[];
  }
  checkValidations(group: FormGroup, isValid: boolean): boolean {

    try {
      Object.keys(group.controls).forEach((key: string) => {
        isValid = this.GetValidationByControl(group, key, isValid);
      })
    }
    catch (e) {

      this.showErrorMessage(e);
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
          this.BiometricAttendanceReportFormValidation[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this.commonservice.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.BiometricAttendanceReportFormValidation[key] += errormessage + ' ';
                isValid = false;
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
    return isValid;
  }
  showErrorMessage(errormsg: string) {
    this.commonservice.showErrorMessage(errormsg);
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

