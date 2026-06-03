// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-biometric-attendence-summary-report',
//   templateUrl: './biometric-attendence-summary-report.component.html',
//   styles: []
// })
// export class BiometricAttendenceSummaryReportComponent implements OnInit {

//   constructor() { }

//   ngOnInit() {
//   }

// }



import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
//import { SscagendsService } from 'src/app/Services/HRMS/sscagends.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { DatePipe } from '@angular/common';
import * as jsPDF from 'jspdf';
// import { PageCriteria } from 'src/app/Models/pagecriteria';
import { PageCriteria } from 'src/app/Models/Loans/Masters/pagecriteria';
//import { HrmseployeeattendanceService } from 'src/app/Services/HRMS/hrmseployeeattendance.service';
//import { HrmsreportsService } from 'src/app/Services/HRMS/hrmsreports.service';
import { debounceTime, distinctUntilChanged, switchMap, tap, catchError } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { Observable, Subject, concat, of } from 'rxjs';
import { Console } from 'console';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-biometric-attendence-summary-report',
  templateUrl: './biometric-attendence-summary-report.component.html',
  styles: []
})
export class BiometricAttendenceSummaryReportComponent implements OnInit {
 // @ViewChild('myTable') table: any;
   @ViewChild('myTable', { static: false }) table: any;
  BioAttSumaryForm: FormGroup;
  pageCriteria:PageCriteria;
  currencysymbol: any;
  GridData: any = [];
  calendarMonthData: any = [];
  public Today = new Date();
  formValidationMessages: any = {};
  today: string;
  splidate: any = [];
  MonthName: any;
  CalendarYear: any;
  employeeList: any = [];
  dropDownDataSearchLength: any = this.commonservice.searchfilterlength;
  searchplaceholder: any = this.commonservice.searchplaceholder;
  showEmployeeGrid: any = false;
  calendarYearData: any = [];
  showicons = false
  leavetypelst: any = [];

  CalendarId: any;
  MonthId: any;
  BranchId: any;
  EmployeeCode: any;
  contactSearchevent = new Subject<string>();
  public disablesavebutton = false;
  showbuttontext = "Show";
  showbuttonbool: boolean = false;
  public dpConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpConfig2: Partial<BsDatepickerConfig> = new BsDatepickerConfig();

  // constructor(private fb: FormBuilder, private commonservice: CommonService) {
  //   this.dpConfig1.containerClass = this.commonservice.datePickerPropertiesSetup("containerClass");
  //   this.dpConfig1.dateInputFormat = this.commonservice.datePickerPropertiesSetup("dateInputFormat");
  //   this.dpConfig1.maxDate = new Date();
  //   this.dpConfig1.showWeekNumbers = false;

  //   this.dpConfig2.containerClass = this.commonservice.datePickerPropertiesSetup("containerClass");
  //   this.dpConfig2.dateInputFormat = this.commonservice.datePickerPropertiesSetup("dateInputFormat");
  //   this.dpConfig2.maxDate = new Date();
  //   this.dpConfig2.showWeekNumbers = false;
  //   this.pageCriteria=new PageCriteria();

  // }
  constructor(private fb: FormBuilder, private commonservice: CommonService) {
  this.dpConfig1.containerClass = this.commonservice.datePickerPropertiesSetup("containerClass");
  this.dpConfig1.dateInputFormat = this.commonservice.datePickerPropertiesSetup("dateInputFormat") || 'DD-MMM-YYYY';
  this.dpConfig1.maxDate = new Date();
  this.dpConfig1.showWeekNumbers = false;

  this.dpConfig2.containerClass = this.commonservice.datePickerPropertiesSetup("containerClass");
  this.dpConfig2.dateInputFormat = this.commonservice.datePickerPropertiesSetup("dateInputFormat") || 'DD-MMM-YYYY';
  this.dpConfig2.maxDate = new Date();
  this.dpConfig2.showWeekNumbers = false;

  this.pageCriteria = new PageCriteria();
}




  ngOnInit(): void {
    debugger;
    this.BranchId = sessionStorage.getItem('branchId');
    this.bindformControls();
    this.contactSearch();
    this.leavetypelst = [{ leavetypee: "ALL", leavetype: "L" }, { leavetypee: "Present", leavetype: "P" }, { leavetypee: "Absent", leavetype: "A" }];

  }

  selectleavetype($event) {
    debugger
    let value = $event;
    this.BioAttSumaryForm.controls.leavetype.setValue(value);
    this.GridData = [];
  }


  bindformControls() {
    this.BioAttSumaryForm = this.fb.group({

      //pPeriodType: [null, Validators.required],
      pEmployeecode: [null],
      //pCalendarMonth: [null, Validators.required],
      fromdate: [this.Today],
      todate: [this.Today],
      leavetype: [null, Validators.required],
      pEmployeeName: [''],
    })
  }

  private contactSearch() {
    debugger;
    this.employeeList = concat(
      of([]), // default items
      this.contactSearchevent.pipe(
        distinctUntilChanged(),
        tap(),
        switchMap(term => this.commonservice.getEmployeeDetails(term, this.BranchId).pipe(
          catchError(() => of([])), // empty list on error
          tap()
        ))
      )
    );
    //this.sscAgendaService.getEmployeeDetails(null, this.BranchId).subscribe(res=>{
   //   this.employeeList = res;
    //});
    console.log(this.employeeList);
  }

  ContactGridRowSelect(selected) {
    debugger;
    try {
      if (selected) {
        debugger;
        this.BioAttSumaryForm.controls['pEmployeecode'].setValue(selected.pEmployeecode);
        this.BioAttSumaryForm.controls['pEmployeeName'].setValue(selected.pEmployeeName.toString());
      }
      else {
        this.BioAttSumaryForm.controls['pEmployeecode'].setValue(null);
        this.BioAttSumaryForm.controls['pEmployeeName'].setValue('');

        this.BioAttSumaryForm.controls.pPeriodType.setValue(null);
        this.BioAttSumaryForm.controls.pCalendarMonth.setValue(null);
        this.calendarMonthData = [];
        this.GridData = [];
        // this.ShowMonthBonusDetails();
        // this.employeeList = [];
      }
    }
    catch (error) {
      this.commonservice.exceptionHandlingMessages('Earned Leaves', 'ContactGridRowSelect', error);
    }
  }

  setPageModel() {
    this.pageCriteria.pageSize = this.commonservice.pageSize;
    this.pageCriteria.offset = 0;
    this.pageCriteria.pageNumber = 1;
    this.pageCriteria.footerPageHeight = 50;
  }


  show() {
    debugger;
    if (this.checkValidations(this.BioAttSumaryForm, true)) {
      this.showbuttontext = "Processing";
      this.showbuttonbool = true;
      let empcode = this.BioAttSumaryForm.controls.pEmployeecode.value;
      let fromdate = this.commonservice.getFormatDateNormal(this.BioAttSumaryForm.controls.fromdate.value);
      let todate = this.commonservice.getFormatDateNormal(this.BioAttSumaryForm.controls.todate.value);
      let leavetype = this.BioAttSumaryForm.controls.leavetype.value;
      this.GridData = [];
      // this.hrmsEmployeeAttendanceService.getBiometricAttendancesumarryReportData(this.commonservice.getschemaname(), empcode, fromdate, todate, leavetype).subscribe(res => {
      //   this.GridData = res;
      //   if(this.GridData.length>0)
      //     {
      //       this.showicons=true
      //     }
      //     else{
      //       this.showicons=false
      //     }
      //   this.showbuttontext = "Show";
      //   this.showbuttonbool = false;
      //   console.log('GridData', this.GridData);


      // }, (error) => {
      //   this.commonservice.showErrorMessage(error);
      //   this.showbuttontext = "Show";
      //   this.showbuttonbool = false;
      // })
      let GetAttendance = this.commonservice.getBiometricAttendancesumarryReportData(this.commonservice.getschemaname(), empcode, fromdate, todate, leavetype);
      let getBiometricAttendance = this.commonservice.getBiometricAttendanceReportSqlData(this.commonservice.getschemaname(), fromdate, todate);
      forkJoin(GetAttendance, getBiometricAttendance).subscribe(res => {
        this.GridData = res[0];
        console.log('Initial GridData:', this.GridData);

        this.showbuttontext = 'Show';
        this.showbuttonbool = false;

        let biometricdata: any[] = Array.isArray(res[1]) ? res[1] : [];

        // Format intime & outtime in biometricdata
        biometricdata = biometricdata.map(item => ({
          ...item,
          intime: item.intime ? item.intime.split(" ")[1] : null,
          outtime: item.outtime ? item.outtime.split(" ")[1] : null,
        }));

         biometricdata= biometricdata.map(emp => {
          emp.date = emp.date.split("T")[0]; // Extract YYYY-MM-DD
          return emp;
        });
        console.log('Formatted BiometricData:', biometricdata);

        // Normalize GridData dates to match BiometricData format (YYYY-MM-DD)
        this.GridData = this.GridData.map(emp => {
          emp.date = emp.date.split("-").reverse().join("-"); // Convert DD-MM-YYYY → YYYY-MM-DD
          return emp;
        });

        // Function to convert time (HH:mm:ss) to seconds
        function timeToSeconds(timeStr: string): number {
          if (!timeStr) return 0;
          let [hours, minutes, seconds] = timeStr.split(":").map(Number);
          return hours * 3600 + minutes * 60 + seconds;
        }

        // Merge intime, outtime, and calculate total duration
        this.GridData = this.GridData.map(emp => {
          let bio = biometricdata.find(b => b.employeecode === emp.employeecode && b.date === emp.date);

          if (bio) {
            emp.intime = bio.intime || null;
            emp.outtime = bio.outtime || null;

            // Calculate total duration if intime and outtime exist
            if (emp.intime && emp.outtime) {
              let intimeSec = timeToSeconds(emp.intime);
              let outtimeSec = timeToSeconds(emp.outtime);
              let durationSec = outtimeSec - intimeSec;

              let hours = Math.floor(durationSec / 3600);
              let minutes = Math.floor((durationSec % 3600) / 60);
              let seconds = durationSec % 60;

              emp.totalduration = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
            } else {
              emp.totalduration = null;
            }
          }
          return emp;
        });

        console.log('Updated GridData:', this.GridData);

        let value;
        this.pageCriteria.totalrows = this.GridData.length;
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
        if (this.GridData.length < this.pageCriteria.pageSize) {
          this.pageCriteria.currentPageRows = this.GridData.length;
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
  todateChange($event) {
    this.dpConfig2.minDate = $event
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

  onDetailToggle(event) {
    debugger;
    console.log('Detail Toggled', event);
  }

  getGroupTotal(groupData: any[], leaveType?: string): number | Record<string, number> {
    let count = groupData.reduce((acc: Record<string, number>, item: any) => {
      if (item.leavetype) {
        acc[item.leavetype] = (acc[item.leavetype] || 0) + 1;
      }
      return acc;
    }, {});

    if (leaveType) {
      return count[leaveType] || 0;
    }

    return count;
  }



pdfOrprint(pdfOrprint) {
  debugger;
  let fromdate = this.commonservice.getFormatDateGlobal(this.BioAttSumaryForm.controls.fromdate.value);
  let todate = this.commonservice.getFormatDateGlobal(this.BioAttSumaryForm.controls.todate.value);

  if (this.GridData.length > 0) {
      let columnStyles = {
          0: { cellWidth: 'auto', halign: 'left' },
          1: { cellWidth: 'auto', halign: 'left' },
          2: { cellWidth: 'auto', halign: 'left' },
          3: { cellWidth: 'auto', halign: 'center' },
          4: { cellWidth: 'auto', halign: 'center' },
          5: { cellWidth: 'auto', halign: 'left' },
          6: { cellWidth: 'auto', halign: 'center' },
          7: { cellWidth: 'auto', halign: 'left' }
      };

      let groupedData = this.groupBy(this.GridData, 'employeecode'); // Group by Employee Code
      this.downloadLeaveDetails(pdfOrprint, groupedData, fromdate, todate, columnStyles);
  } else {
      this.commonservice.showWarningMessage('No data to print/save!!');
  }
}


downloadLeaveDetails(printOrPdf, groupedData, fromDate, toDate, columnStyles) {
  debugger;
  let doc = new jsPDF('p', 'mm', 'a4');
  let reportName = 'Biometric Attendance Report';
  let companyDetails = this.commonservice._getCompanyDetails();
  let companyAddress = this.commonservice.getcompanyaddress();
  let today = this.commonservice.pdfProperties("Date");
  let companyLogo = this.commonservice.getKapilGroupLogo();
  let totalPagesPlaceholder = '{total_pages_count_string}';

  let isFirstPage = true;

  Object.keys(groupedData).forEach((employeeCode) => {
    debugger;
      let employeeData = groupedData[employeeCode];
      let employeeName = employeeData[0].employeename || '';
      let department = employeeData[0].branchname || '';
      let designationName=employeeData[0].designation_name || '';
      let authorizedy=employeeData[0].authorized_by_name || '';

      let headers = [['Date', 'InTime', 'OutTime', 'Total Duration', 'Status', 'Remarks']];
      let gridRows = [];

      employeeData.forEach(element => {
          let date = element.date;
          let intime = element.intime;
          let outtime = element.outtime;
          let leavetype = element.leavetype;
          let remarks = element.remarks || '--NA--';
          let totalDuration = this.calculateTimeDifference(intime, outtime);

          gridRows.push([date, intime, outtime, totalDuration, leavetype, remarks]);
      });

      if (!isFirstPage) {
          doc.addPage();
      }
      isFirstPage = false;

      // **Header Section**
      let pageSize = doc.internal.pageSize;
      let pageWidth = pageSize.width;
      doc.setFont("Times-Italic");
      doc.setFontSize(15);
      doc.addImage(companyLogo, 'JPEG', 10, 15, 20, 20);
      doc.setTextColor('black');
      //doc.text(companyDetails.pCompanyName, 60, 20);
      doc.text(companyDetails.pCompanyName, 40, 20);

      doc.setFontSize(8);
      //doc.text(companyAddress, 40, 27, 0, 0, 'left');
      doc.text(companyAddress, 50, 27, 0, 0, 'left');

      if (companyDetails.pCinNo) {
          doc.text('CIN: ' + companyDetails.pCinNo, 85, 32);
      }
      doc.setFontSize(14);
      doc.text(reportName, pageWidth / 2, 42, { align: 'center' });
      doc.setFontSize(10);
     // doc.text(`Branch: ${companyDetails.pBranchname}`, 161, 52);
       doc.text(`Branch: ${companyDetails.pBranchname}`, 140, 52);

      doc.text(`From Date: ${fromDate}`, 15, 52);
      doc.text(`To Date: ${toDate}`, 54, 52);

      doc.line(10, 64, pageWidth - 15, 64);

      doc.setFontSize(11);
      doc.text(`Employee Name: ${employeeName}`, 15, 72);
      doc.text(`Employee Code: ${employeeCode}`, 15, 78);
      doc.text(`Department: ${department}`, 15, 84);
      doc.text(`Designation: ${designationName}`,120,72);
      doc.text(`Appointed  By: ${authorizedy}`,120,78);


      doc.autoTable({
        theme: 'grid',
        headStyles: {
            fillColor: this.commonservice.pdfProperties("Header Color"),
            halign: this.commonservice.pdfProperties("Header Alignment"),
            fontSize: this.commonservice.pdfProperties("Header Fontsize")
        },
        styles: {
            cellPadding: 1,
            fontSize: this.commonservice.pdfProperties("Cell Fontsize"),
            cellWidth: 'wrap',
            rowPageBreak: 'avoid',
            overflow: 'linebreak'
        },
        head: headers,
        bodyStyles: { lineColor: [0, 0, 0], textColor: [0, 0, 0] },
        columnStyles: columnStyles,
        body: gridRows,
        startY: 90,
        didDrawPage: function (data) {
            let pageNum = "Page " + doc.internal.getNumberOfPages();
            if (typeof doc.putTotalPages === 'function') {
                pageNum += ' of ' + totalPagesPlaceholder;
            }
            let pageHeight = doc.internal.pageSize.height;
            doc.line(5, pageHeight - 10, pageWidth - 15, pageHeight - 10);
            doc.setFontSize(10);
            doc.text("Printed on: " + today, data.settings.margin.left, pageHeight - 5);
            doc.text(pageNum, pageWidth - data.settings.margin.right - 20, pageHeight - 5);
        }
      });

      // **Calculate Summary**
      let totalDurationSeconds = 0;
      let presentDays = 0;
      let absentDays = 0;

      gridRows.forEach(row => {
          let duration = row[3];  // "HH:mm:ss"
          let status = row[4];

          if (duration) {
              let [hours, minutes, seconds] = duration.split(':').map(Number);
              totalDurationSeconds += (hours * 3600) + (minutes * 60) + seconds;
          }

          if (status === 'P') {
              presentDays++;
          } else if (status === 'LOP') {
              absentDays++;
          }
      });

      let totalHours = Math.floor(totalDurationSeconds / 3600);
      let totalMinutes = Math.floor((totalDurationSeconds % 3600) / 60);
      let totalSeconds = totalDurationSeconds % 60;
      let formattedTotalDuration = `${totalHours}h ${totalMinutes}m ${totalSeconds}s`;

      // **Print Summary Below the Table**
      let summaryY = doc.autoTable.previous.finalY + 10;
      doc.setFontSize(11);
      doc.text(`Total Duration: ${formattedTotalDuration}`, 15, summaryY);
      doc.text(`Total Present Days: ${presentDays}`, 15, summaryY + 6);
      doc.text(`Total Absent Days: ${absentDays}`, 15, summaryY + 12);
  });

  // Add total pages
  if (typeof doc.putTotalPages === 'function') {
      doc.putTotalPages(totalPagesPlaceholder);
  }

  // Save or Print
  if (printOrPdf === "Pdf") {
      doc.save(reportName + '.pdf');
  } else if (printOrPdf === "Print") {
      this.commonservice.setiFrameForPrint(doc);
  }



//Excel
else if(printOrPdf ==="Excel")
  {
    debugger;
     //doc.save(reportName + '.excel');
  // this.exportAsExcelFile();
this.exportAsExcelFile(groupedData, fromDate, toDate);
  }

}


 //exportAsExcelFile() {
exportAsExcelFile(groupedData: any, fromDate?: any, toDate?: any) {
  debugger;
  let reportName = 'Biometric Attendance Report';

  let companyDetails = this.commonservice._getCompanyDetails();
  let companyAddress = this.commonservice.getcompanyaddress();
  let today = this.commonservice.pdfProperties("Date");

  const excelRows = [];
console.log("excel data",groupedData)
Object.keys(groupedData).forEach((employeeCode) => {

  let employeeData = groupedData[employeeCode];

  let employeeName = employeeData[0].employeename || '';
  let designation  = employeeData[0].designation_name || '';
  let department   = employeeData[0].branchname || '';
  let authorizedy =employeeData[0].authorized_by_name || '';
  let gridRows = [];

  let totalDurationSeconds = 0;
  let presentDays = 0;
  let absentDays = 0;

  excelRows.push([`Employee: ${employeeName}`, `Designation: ${designation}`]);
  excelRows.push([`Employee Code: ${employeeCode}`]);
  excelRows.push([`Department: ${department}`]);
  excelRows.push([`Appointed  By: ${authorizedy}`]);
  excelRows.push(["Date", "InTime", "OutTime", "Duration", "Status", "Remarks"]);


  employeeData.forEach(element => {

    let totalDuration = this.calculateTimeDifference(element.intime, element.outtime);

    // push row
    excelRows.push([
      element.date,
      element.intime,
      element.outtime,
      totalDuration,
      element.leavetype,
      element.remarks || '--NA--'
    ]);



    if (totalDuration) {
      let [h, m, s] = totalDuration.split(':').map(Number);
      totalDurationSeconds += (h * 3600) + (m * 60) + (s || 0);
    }

    // present/absent logic
    if (element.leavetype === 'P') {
      presentDays++;
    } else if (element.leavetype === 'LOP') {
      absentDays++;
    }
  });


  let totalHours = Math.floor(totalDurationSeconds / 3600);
  let totalMinutes = Math.floor((totalDurationSeconds % 3600) / 60);
  let totalSeconds = totalDurationSeconds % 60;

  let formattedTotalDuration = `${totalHours}h ${totalMinutes}m ${totalSeconds}s`;


  excelRows.push([]);
  excelRows.push([`Total Duration: ${formattedTotalDuration}`]);
  excelRows.push([`Total Present Days: ${presentDays}`]);
  excelRows.push([`Total Absent Days: ${absentDays}`]);

  excelRows.push([]); // spacing between employees
});

  // const excelHeaderData = [
  //   ["Report Name", reportName],
  //   ["Company Details", companyDetails?.pCompanyName],
  //   ["Company Address", companyAddress],
  //   ["Date", today],
  //   //[""]
  //     ["", ""]
  // ];
  const excelHeaderData = [
  ["Report Name", reportName],
  ["Company Details", companyDetails ? companyDetails.pCompanyName : ''],
  ["Company Address", companyAddress],
  ["Date", today],
  ["", ""]
];

  const dataWithHeaders = [...excelHeaderData, ...excelRows];

  //const safeSheetName = reportName.substring(0, 31);
  const safeSheetName = reportName;

  const worksheet: XLSX.WorkSheet =
    XLSX.utils.aoa_to_sheet(dataWithHeaders);

  const workbook: XLSX.WorkBook = {
    Sheets: { [safeSheetName]: worksheet },
    SheetNames: [safeSheetName]
  };

  const excelBuffer: any = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array'
  });

  const data: Blob = new Blob([excelBuffer], {
    type: 'application/octet-stream'
  });

  FileSaver.saveAs(
    data,
    `${safeSheetName}_${new Date().getTime()}.xlsx`
  );
}

//========================================



calculateTimeDifference(inTime, outTime) {
    if (!inTime || !outTime) return '00:00:00';

    let start :any = new Date(`1970-01-01T${inTime}`);
    let end :any = new Date(`1970-01-01T${outTime}`);

    if (end < start) {
        end.setDate(end.getDate() + 1); // Handle overnight shifts
    }

    let diffMs = end - start;
    let hours = Math.floor(diffMs / (1000 * 60 * 60));
    let minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}



// Helper function to group data by Employee Code
groupBy(array, key) {
  return array.reduce((result, currentValue) => {
      (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
      return result;
  }, {});
}


















  ///-------------------Validations
  BlurEventAllControll(fromgroup: FormGroup) {

    try {

      Object.keys(fromgroup.controls).forEach((key: string) => {
        this.setBlurEvent(fromgroup, key);
      })

    }
    catch (error) {
      this.commonservice.exceptionHandlingMessages('PF Statement', 'BlurEventAllControll', error);

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
    catch (error) {
      this.commonservice.exceptionHandlingMessages('PF Statement', 'setBlurEvent', error);

      return false;
    }
  }

  checkValidations(group: FormGroup, isValid: boolean): boolean {
    try {
      Object.keys(group.controls).forEach((key: string) => {
        isValid = this.GetValidationByControl(group, key, isValid);
        if (!isValid)
          console.log(key + ' : ' + isValid);
      })

    }
    catch (error) {
      this.commonservice.exceptionHandlingMessages('PF Statement', 'checkValidations', error);

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

        }
        else if (formcontrol.validator) {
          this.formValidationMessages[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                lablename = (document.getElementById(key) as HTMLInputElement).title;
                errormessage = this.commonservice.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.formValidationMessages[key] += errormessage + ' ';
                isValid = false;
              }
            }
          }
        }
      }
    }
    catch (error) {
      this.commonservice.exceptionHandlingMessages(' PF Statement', 'GetValidationByControl', error);
      this.commonservice.showErrorMessage(key);
      return false;
    }
    return isValid;
  }
}

