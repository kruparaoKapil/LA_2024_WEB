// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-leave-deatails',
//   templateUrl: './leave-deatails.component.html',
//   styles: []
// })
// export class LeaveDeatailsComponent implements OnInit {

//   constructor() { }

//   ngOnInit() {
//   }

// }


import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { element } from 'protractor';
//import { PageCriteria } from 'src/app/Models/pagecriteria';
import { PageCriteria } from 'src/app/Models/Loans/Masters/pagecriteria';

//import { HrmseployeeattendanceService } from 'src/app/Services/HRMS/hrmseployeeattendance.service';
import { CommonService } from 'src/app/Services/common.service';
import * as jsPDF from 'jspdf';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { forkJoin } from 'rxjs';
import { setDate } from 'ngx-bootstrap/chronos/utils/date-setters';

@Component({
  selector: 'app-leave-deatails',
  templateUrl: './leave-deatails.component.html',
   styles: []
})
export class LeaveDeatailsComponent implements OnInit {

 // @ViewChild('myTable') table: any;
 @ViewChild('myTable', { static: false }) table: any;
  LeaveDetailsForm:FormGroup;
  LeaveDetailsFormMessages:any={};
  public dpConfig1:Partial<BsDatepickerConfig>=new BsDatepickerConfig();
  public dpConfig2:Partial<BsDatepickerConfig>=new BsDatepickerConfig();
  pageCriteria:PageCriteria;
  ngxgriddata:any=[];
  showbuttontext:string='Show';
  showbuttonbool:boolean=false;
  selected:any=[];
  savebuttontext:string='Save';
  savebuttonbool:boolean=false;
  remarkslst:any=[];
  disabletransactiondate=false;
  constructor(private fb:FormBuilder,private commonservice:CommonService) {
    this.dpConfig1.containerClass=this.commonservice.datePickerPropertiesSetup("containerClass");
    this.dpConfig1.showWeekNumbers=false;
    this.dpConfig1.dateInputFormat=this.commonservice.datePickerPropertiesSetup("dateInputFormat");
    this.dpConfig1.maxDate=new Date();

    this.dpConfig2.containerClass=this.commonservice.datePickerPropertiesSetup("containerClass");
    this.dpConfig2.showWeekNumbers=false;
    this.dpConfig2.dateInputFormat=this.commonservice.datePickerPropertiesSetup("dateInputFormat");
    this.dpConfig2.maxDate=new Date();


    this.pageCriteria=new PageCriteria();
    // if (this.commonservice.comapnydetails != null){
    //   this.disabletransactiondate = this.commonservice.comapnydetails.pdatepickerenablestatus;
    //   if(this.disabletransactiondate==false){
    //     let backdate=new Date();
    //     //backdate.setDate(backdate.getDate() - 1);
    //     //backdate.setDate(backdate.getDate());
    //     this.dpConfig1.minDate=new Date(backdate);
    //   }
    // }
  }
  ngOnInit(): void { //*$*
    this.LeaveDetailsForm=this.fb.group({
      fromdate:[new Date(),Validators.required],
      todate:[new Date(),Validators.required],
      remarksdropdown:[null]
    });
    this.getleavetypes();
    //this.remarkslst=[{remarksname:'SL',remarksid:'Sick leave'},{remarksname:'OD',remarksid:'on duty'},{remarksname:'CL',remarksid:'Casual Leave'}]
    this.BlurEventAllControll(this.LeaveDetailsForm);
    this.setPageModel();
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
          this.LeaveDetailsFormMessages[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this.commonservice.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.LeaveDetailsFormMessages[key] += errormessage + ' ';
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
  setPageModel() {
    this.pageCriteria.pageSize = this.commonservice.pageSize;
    this.pageCriteria.offset = 0;
    this.pageCriteria.pageNumber = 1;
    this.pageCriteria.footerPageHeight = 50;
  }
  show(){
    debugger;
    if (this.checkValidations(this.LeaveDetailsForm,true)){
      this.ngxgriddata=[];
      this.showbuttontext='Processing';
      this.showbuttonbool=true;
      this.selected=[]
      //let branchschema=this.commonservice.getschemaname();
      let branchschema='public';

      // let fromdate=this.commonservice.getFormatDateNormal(this.LeaveDetailsForm.controls.fromdate.value);
      // let todate=this.commonservice.getFormatDateNormal(this.LeaveDetailsForm.controls.todate.value);
      // let GetAttendance=this.commonservice.GetAttendance(branchschema,fromdate,todate)

      let fromdate = new Date(this.LeaveDetailsForm.controls.fromdate.value) .toISOString().split('T')[0];

let todate = new Date(this.LeaveDetailsForm.controls.todate.value) .toISOString().split('T')[0];
  let GetAttendance=this.commonservice.GetAttendance(branchschema,fromdate,todate)
      let getBiometricAttendance=this.commonservice.getBiometricAttendance(branchschema,fromdate,todate)
       forkJoin(GetAttendance,getBiometricAttendance).subscribe(res=>{
        this.ngxgriddata=res[0];
        let biometricdata:any=[]
        let tempbiometricdata:any=[]
        biometricdata=res[1]
        tempbiometricdata=res[1]

        biometricdata=biometricdata.filter(ele=>ele.leavetype !='P')
        this.ngxgriddata=this.ngxgriddata.filter(ele=>ele.date=ele.date.slice(0,10))
        let list:any=res[0];
        list = list.filter(ele=>ele.date=ele.date.slice(0,10));
        this.ngxgriddata.forEach((element,index) => {
         biometricdata.forEach(ele=>{
                 if(ele.employeecode == element.employeecode && ele.date == element.date){
                   //this.ngxgriddata.splice(index,1)  ;
                   let Index = list.findIndex(x=>x.employeecode == element.employeecode && x.date == element.date)
                   list.splice(Index,1)
                   list=[...list]
            }
          })
        });

        this.ngxgriddata=list;

        biometricdata.forEach(element => {
          this.ngxgriddata.push(element)
        });
        this.showbuttontext='Show';
        this.showbuttonbool=false;
        if(tempbiometricdata.length==0){
          this.ngxgriddata.forEach(element=>{
            if(element.type == 'Present'){
              element['leavetype']='P'
            }
          })
        }
        this.ngxgriddata.forEach(element=>{

            // element['remarksonduty']='';
          //  element['leavetype']='';
          if(element.leavetype !=''){
            element['checkboxstatus']='F'
          }else{
            element['checkboxstatus']='N'
          }
            element['editabsent']=false;
            element['check_uncheck']=false;
            element['remarksbool']=true;
            element['remarkslist']=this.remarkslst;
        })


        this.ngxgriddata=[...this.ngxgriddata]
        console.log('ngxgriddata',this.ngxgriddata);
        let apidata = JSON.stringify(this.ngxgriddata);
        this.commonservice.SendMailGridData(apidata).subscribe(res=>{
          debugger;
          console.log(res);
        });


        let value;
        this.pageCriteria.totalrows = this.ngxgriddata.length;
        this.pageCriteria.TotalPages=1;
        if (this.pageCriteria.totalrows > 10) {
          value = this.pageCriteria.totalrows / 10;
          if (value.toString().includes('.')) {
            this.pageCriteria.TotalPages = parseInt((this.pageCriteria.totalrows / 10).toString()) + 1;
          }
          else {
            this.pageCriteria.TotalPages = parseInt((this.pageCriteria.totalrows / 10).toString());
          }
        }
        if (this.ngxgriddata.length < this.pageCriteria.pageSize) {
          this.pageCriteria.currentPageRows = this.ngxgriddata.length;
        }
        else {
          this.pageCriteria.currentPageRows = this.pageCriteria.pageSize;
        }
      },(error)=>{
        this.commonservice.showErrorMessage(error);
        this.showbuttontext='Show';
        this.showbuttonbool=false;
      });
    }
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
  // toggleExpandGroup(group) {
  //   debugger;
  //   console.log('Toggled Expand Group!', group);
  //   this.table.groupHeader.toggleExpandGroup(group);
  // }


toggleExpandGroup(group: any) {
  console.log('Toggled Expand Group!', group);
  this.table.groupHeader.toggleExpandGroup(group, !group.expanded);
}

// toggleExpandGroup(group: any) {
//   console.log('Toggled Expand Group!', group);
//   this.table.groupHeader.toggleExpandGroup(group, group.expanded);
// }

  onDetailToggle(event) {
    console.log('Detail Toggled', event);
  }
  editleavedetails(row,rowIndex,$event){
    debugger
    console.log(row,rowIndex);
    row['editabsent']=true;
  }
  selectca(event, row, rowindex) {
    debugger
    this.ngxgriddata.filter(res=>{
      // res.check_uncheck=false;
      res.editabsent=false;
    });
    rowindex=this.ngxgriddata.indexOf(row);
    if (event.target.checked == true) {
      this.ngxgriddata[rowindex]['check_uncheck']=true;
      this.ngxgriddata[rowindex]['editabsent']=true;
      this.selected.push(this.ngxgriddata[rowindex]);
      this.ngxgriddata[rowindex]['remarkslist']=this.remarkslst;
    }
    else {
      let rowind=this.selected.indexOf(row);
      this.ngxgriddata[rowindex]['check_uncheck']=false;
      this.ngxgriddata[rowindex]['editabsent']=false;
      this.ngxgriddata[rowindex]['remarkslist']=[];
      row.remarks='';
      row.leavetype="";
      this.selected.splice(rowind,1);
    }
    let checkall=this.selected.every(item=>item.check_uncheck==false);
    if (checkall){
      this.selected=[];
    }
    console.log(this.selected);
  }
  selectcheckbox($event,row,rowIndex){
    debugger
    if ($event.target.checked==true){
      row.leavetype=true;
    }else{
      row.leavetype=false;
    }
  }
  updateValue(row,$event){
    debugger
    if ($event != undefined){
      row.remarks=$event;
    }else{
      row.remarks=null;
    }
  }
  SaveLeaveDetails(){
    debugger
    let selectedbool
    let count=0
   let absentcount=this.ngxgriddata.filter(ele=>ele.type=='Absent')
   if(absentcount.length==0){
    this.selected.length=1
   }
    if(this.selected.length>0){
      if(absentcount.length>0){
    this.selected.forEach(element => {
      if(element.leavetype == ''){
        count++
      }
      if(element.leavetype == 'OD' && element.remarks == ''){
        count++

      }
    });
  }else{
    count=0
  }
    if(count == 0){
      this.ngxgriddata.forEach(element=>{
        element.ipaddress=this.commonservice.getipaddress();
        element.userid=this.commonservice.getcreatedby();
        element.schemaname=this.commonservice.getschemaname();
        element.fromdate=this.commonservice.getFormatDateNormal(this.LeaveDetailsForm.controls.fromdate.value);
        element.todate=this.commonservice.getFormatDateNormal(this.LeaveDetailsForm.controls.todate.value);
      })
      if(confirm("Do you want to save ?")){
      this.savebuttontext='Processing';
      this.savebuttonbool=true;
      let data=JSON.stringify(this.ngxgriddata);
      console.log(data);
      this.commonservice.SaveLeaveDetails(data).subscribe(res=>{
        if (res){
          this.commonservice.showSuccessMessage();
          this.savebuttontext='Save';
          this.savebuttonbool=false;
          this.selected=[];
          this.ngxgriddata.forEach(element=>{
            element['leavetype']=false;
            element['editabsent']=false;
            element['check_uncheck']=false;
            element['remarks']=null;
            });
            this.show()
        }
      },(error)=>{
        this.commonservice.showErrorMessage(error);
        this.savebuttontext='Save';
        this.savebuttonbool=false;
      })
      }
    }
    else{
      this.commonservice.showWarningMessage('Please enter the details of selected list');
    }
  }else{
    this.commonservice.showWarningMessage('Please select Atleast one record !!');
  }
   // }
    // else{
    //   if (selectedbool==false){
    //     this.commonservice.showWarningMessage('Please enter the details of selected list');
    //   }else{
    //     this.commonservice.showWarningMessage('Please select atleast one record !!');
    //   }
    // }
  }
  changeRemarks($event,row,rowIndex,leavetype){
    debugger
    console.log($event,row,rowIndex,leavetype);
    let rowindex=this.ngxgriddata.indexOf(row);
    if (leavetype == 'OD'){
      this.ngxgriddata[rowindex]['remarksbool']=false;
      this.ngxgriddata[rowindex]['leavetype']=leavetype;
    }else{
      this.ngxgriddata[rowindex]['remarksbool']=true;
      this.ngxgriddata[rowindex]['leavetype']=leavetype;
    }
  }
  getleavetypes(){
    debugger;
    this.commonservice.getleavetypes().subscribe(res=>{
      this.remarkslst=res;
      console.log(this.remarkslst);
    })
  }
  pdfOrprint(pdfOrprint){
    debugger
    let fromdate=this.commonservice.getFormatDateGlobal(this.LeaveDetailsForm.controls.fromdate.value);
    let todate=this.commonservice.getFormatDateGlobal(this.LeaveDetailsForm.controls.todate.value);
    let headers=[['Branch','Employee Code','Date','Employee Name','Absent/Present','Leave Type','Remarks']];
    let griddata=[];
    let columstyles={0:{cellWidth:'auto',halign: 'left'},
    1:{cellWidth:'auto',halign: 'left'},
    2:{cellWidth:'auto',halign: 'left'},
    3:{cellWidth:'auto',halign: 'left'},
    4:{cellWidth:'auto',halign: 'center'},
    5:{cellWidth:'auto',halign: 'left'},
    6:{cellWidth:'auto',halign: 'left'}};

    //let groupeddata=this.leavedetailsgrouping(this.ngxgriddata,'type',false);
    this.ngxgriddata.forEach(element=>{
      let temp;
      let date;
      if (element.date){
        date=this.commonservice.getFormatDateGlobal(element.date);
      }else{
        date='--NA--';
      }
      let _remarksonduty;
      if (element.leavetype){
        _remarksonduty=element.leavetype;
      }else{
        _remarksonduty='--NA--';
      }
      let _remarks
      if (element.remarks){
        _remarks=element.remarks;
      }else{
        _remarks='--NA--'
      }
      temp=[element.branchname,element.employeecode,date,element.employeename,element.type,_remarksonduty,_remarks]
      griddata.push(temp);
    });
    this.downloadleavedetails(pdfOrprint,headers,griddata,fromdate,todate,columstyles);
  }
  downloadleavedetails(printorpdf,headers,gridrows,fromdate,todate,columstyles){
    debugger
    let doc=new jsPDF('a4'); //a4
    let data=[];
    let reportName='Leave Details Report';
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
    // }
    // else{
    //   this.commonservice.showWarningMessage('No Data to Print/save');
    // }
  }
  leavedetailsgrouping(griddata, groupdcol, isgroupedcolDate) {
    debugger;
    let a = [];
    let keys = [];
    for (var i = 0; i < griddata.length; i++) {
      let Jsongroupcol;
      if (isgroupedcolDate == true) {
        //Jsongroupcol = formatDate(griddata[i][groupdcol], 'dd-MM-yyyy', 'en-IN');
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

    let final = [];
    for (var j = 0; j < keys.length; j++) {

      let keypair = a[keys[j]]
      for (var k = 0; k < keypair.length; k++) {
        let groupcolHead

        if (k == 0) {
          if (isgroupedcolDate == true) {
            //groupcolHead = formatDate(keypair[k][groupdcol], 'dd-MM-yyyy', 'en-IN');
          }
          else {
            groupcolHead = keypair[k][groupdcol];
          }
          keypair[k]["group"] = {
            content: '' + groupcolHead + '',
            colSpan: 9,
            styles: { halign: 'left', fillColor: "#e6f7ff" },
          };
        }

        final.push(keypair[k])
        debugger;
      }
    }

    return final;
  }
  export(): void{
    debugger;
    let rows = [];
    let groupcode;
    let ticketno;
    this.ngxgriddata.forEach(element => {
      let date;
      if (element.date){
        date=this.commonservice.getFormatDateGlobal(element.date);
      }else{
        date='--NA--';
      }
      let _remarksonduty;
      if (element.leavetype){
        _remarksonduty=element.leavetype;
      }else{
        _remarksonduty='--NA--';
      }
      let _remarks;
      if (element.remarks){
        _remarks=element.remarks;
      }else{
        _remarks='--NA--';
      }
      let dataobject;
      dataobject = {
        "Branch":element.branchname,
        "Employee Code":element.employeecode,
        "Date":date,
        "Employee Name":element.employeename,
        "Absent/Present":element.type,
        "Remarks on duty":_remarksonduty,
        "Remarks":_remarks
      }
      rows.push(dataobject);
    });
    this.commonservice.exportAsExcelFile(rows, 'Leave Details Report');

  }


}

