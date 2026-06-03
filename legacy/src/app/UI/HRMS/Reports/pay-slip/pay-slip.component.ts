import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { DatePipe } from '@angular/common';
import { CommonService } from 'src/app/Services/common.service';
import { Observable, Subject, concat, of } from 'rxjs';
import { State, process, GroupDescriptor, SortDescriptor } from '@progress/kendo-data-query';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { ContacmasterService } from 'src/app/Services/Loans/Masters/contacmaster.service';
import { ProfessionaltaxService } from 'src/app/Services/HRMS/Reports/professionaltax.service';
import * as jsPDF from 'jspdf';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { NumberToWordsPipe } from 'src/app/Pipes/number-to-words.pipe';

@Component({
  selector: 'app-pay-slip',
  templateUrl: './pay-slip.component.html',
  styles: [],
  providers: [
    NumberToWordsPipe
],
})
export class PaySlipComponent implements OnInit {

  ProfessionalTaxForm: FormGroup;
  employeeList: any[] = [];
  calendarYearData: any;
  ProfessionalTaxList: any[] = [];
  public tempProfessionalTaxList: any = [];
  today: string;
  public CalendarMonth: any;
  public disableshowbutton = false;
  dropDownControlName: any = '';
  currencysymbol: any;
  splidate: any = [];
  pageeventstatus: any = false;
  controleventstatus: any = false;
  MonthName: any;
  CalendarYear: any;
  public Type: any;
  showEmployeeGrid: any = false;
  calendarMonthData: any = [];
  public showbutton = "Run Payroll Process";
  PayrollMonth: any;
  EmloyeeId: any;
  pEsino: any;
  pEmployeeName: any;
  pNoofLOP: any;
  pGrossSalary: any;
  pEmpEsiAmt: any;
  public pageSize = 10; public gridState: State = {
    sort: [],
    take: 10
  };
  public headerCells: any = {
    textAlign: 'center'
  };
  empContactId: any;
  selectedEmployeeId: string;
  CalendarId: string;
  MonthId: any;
  BranchId: any;
  EmployeeCode: any;
  totalGrossSalary: string = '0';
  totalNetSalary: string = '0';
  totalTax: string = '0';
  sort: any = [{ field: 'pEmployeecode', dir: 'asc' }];
  group: { field: string, dir: string }[] = [{ field: 'pEmployeecode', dir: 'asc' }];
  groups: any[] = this.group;


  // 

  selectedvalues: any;
  paySlipForm: FormGroup;
  gridView: any = [];
  ProfessionalTaxFormValidationErrorMessages: any;
  payslipdetails: any=[];
  comapnydetails: any;
  selectedEmployeeCode: any;


  constructor(private _commonService: CommonService, private fb: FormBuilder, private _contactMaster: ProfessionaltaxService, private numbertowords:NumberToWordsPipe) { 
    this.allData = this.allData.bind(this); }


  ngOnInit() {
    debugger;
    let data = JSON.parse(sessionStorage.getItem('SetBranch') || '{}');
    if (data && data.pbranch_id) {
      this.BranchId = data.pbranch_id;
    }

    this.paySlipForm = this.fb.group({
      "pEmployeeId": [''],
      "pEmployeeName": [''],
      "pPeriodType": [''],
      "pCalendarMonth": [''],

    })

    this.getProcessApproveEmployes();
    this.BindCalendarYear();
    this.BindCalendarMonth();
  }

  getProcessApproveEmployes() {
    debugger;
    this._contactMaster.getProcessApproveEmployes(this.BranchId).subscribe(res => {
      let staticarray = [{"pEmployeeName":'All',"pEmployeeId":'0'}];
      this.employeeList = [...staticarray,...res];
    })
  }

  BindCalendarYear() {
    debugger;
    this._contactMaster.GetCalendarYear().subscribe(res => {
      if (res != null) {
        this.calendarYearData = res;

      }
    })
  }

  CalendarYear_change(event) {
    debugger;
    if (event) {
      this.CalendarId = event.pCalenderPeriodId;
      this.CalendarYear = event.pPeriodType;
      this.paySlipForm.controls.pCalendarMonth.setValue(null);
      this.BlurEventAllControll(this.paySlipForm);
      this.BindCalendarMonth();
    }
    else {
      this.calendarMonthData = [];
      this.paySlipForm.controls.pCalendarMonth.setValue(null);
      this.ProfessionalTaxList = [];
    }
  }

  BindCalendarMonth(employeeId?: string) {
    debugger;
    this.calendarMonthData = [];
    const empContactId = this.paySlipForm.get('pEmployeeId').value;
    console.log('Selected empContactId:', empContactId);

    if (empContactId) {
      debugger;
      this._contactMaster.GetCalendarYearMonthDetails(this.CalendarId, empContactId).subscribe(res => {
        if (res != null) {
          this.calendarMonthData = res;
        }
      });
    } else {
      console.log('Employee contact ID is not selected.');
    }
  }

  EmployeeId_change(event) {
    debugger;
    console.log(this.paySlipForm);
    if (this.paySlipForm) {
      this.selectedEmployeeId = event.pEmployeeName;
      this.selectedEmployeeCode = event.pEmployeecode;
      console.log('Selected Employee ID:', this.selectedEmployeeId);
      this.paySlipForm.get('pEmployeeId').setValue(event);
      this.paySlipForm['controls']['pEmployeeId'].setValue(event.pEmployeeId);
      this.BindCalendarMonth();
    }
  }


  CalendarMonth_change(event) {
    debugger;
    if (event) {
      this.ProfessionalTaxList = [];
      this.MonthId = event.pCalenderPeriodDetailsId;
      this.MonthName = event.pCalendarMonth;
    }
    else {
      this.ProfessionalTaxList = [];
    }
  }

  // runPaySlip() {
  //   debugger;

  //   this._contactMaster.GetPayslipDetails(this.MonthName).subscribe(json => {
  //     this.gridView = json
  //     this.selectedvalues += JSON.stringify(this.gridView) ;
  //     let receipt = btoa(this.selectedvalues);
  //     window.open('/#/PaySlipData?id=' + receipt);
  //   })





  // }



  runPaySlip() {
    debugger;

    let isValid = true;
    // if (this.checkValidations(this.MonthBonusForm, isValid)) {
      let code = this.selectedEmployeeCode;
      
    this._contactMaster.GetPayslipDetails(this.MonthName).subscribe(res => {
      this.gridView = res
        if(res.length>0){
          this.gridView=res
          // console.log(this.temppayslipdetails,159)
          if(this.selectedEmployeeCode){
            this.gridView.forEach(element =>{ debugger
              if(element.pEmployeecode == this.selectedEmployeeCode){
                // console.log('Working employee')
                this.payslipdetails=[];
                this.payslipdetails.push(element)
                // console.log(this.payslipdetails,166)

              }
            })

          }
          else{
            this.payslipdetails=res
            //pLossOfPayAmt
            console.log(' this.payslipdetails'+ this.payslipdetails);
          }

          // console.log(this.payslipdetails,158)
          debugger
          let count=0
          let i;
          var doc = new jsPDF('a4');

        let pageSize = doc.internal.pageSize;
        let pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
        let pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
          for(i=0; i<this.payslipdetails.length; i++){
           count=count+1
            var lMargin = 15; //left margin in mm
            var rMargin = 15; //right margin in mm
            var pdfInMM = 210;  // width of A4 in mm
            let Easy_chit_Img = this._commonService.getKapilGroupLogo();
            doc.addImage(Easy_chit_Img, 'JPEG', 5, 5);

            doc.setTextColor('black');
           doc.setFontStyle('normal');
            doc.setFontSize(11);           
            this.comapnydetails = JSON.parse(sessionStorage.getItem("companydetails"));
            let address = this.comapnydetails.pAddress1 + ' ' + this.comapnydetails.pAddress2 + ' ' + this.comapnydetails.pDistrict + ' ' + this.comapnydetails.pcity + ' ' + this.comapnydetails.pState + ' - ' + this.comapnydetails.pPincode;
            console.log(address);
            let Companyreportdetails = this._commonService.comapnydetails;
            console.log(Companyreportdetails); 
          
           doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.setTextColor('black');
            
            let reportname = "Pay Slip";
            
            doc.text(Companyreportdetails.pCompanyName,pageWidth/2,15,{align:'center'});

            doc.setFontSize(8);
            doc.text(address, 40, 22, 0, 0, 'left');
            if(!isNullOrEmptyString(Companyreportdetails.pCinNo)){
            doc.text('CIN : ' + Companyreportdetails.pCinNo + '',85, 27);
            }
            doc.setFontSize(8);
            
             doc.text(reportname, 100, 33);

             doc.text('Branch : ' + Companyreportdetails.pBranchname + '', 163, 33 ,{align:'center'});
             doc.setDrawColor(0, 0, 0);
                  

            pdfInMM = 233;
             doc.line(10, 35, (pdfInMM - lMargin - rMargin), 35) // horizontal line

            doc.setFontSize(10);
            
            doc.text("Name               :"+" "+this.payslipdetails[i].pEmployeeName,15,40);
            doc.text("ID                          :"+" "+this.payslipdetails[i].pEmployeecode,130,40);
            doc.text("Designation      :"+" "+this.payslipdetails[i].pDeptName,15,45);
            doc.text("Month                    :"+" "+this.payslipdetails[i].pPayrollMonth,130,45);
            doc.text("PF No.              :"+" "+this.payslipdetails[i].pPfno,15,50);
            doc.text("ESI No.                  :"+" "+this.payslipdetails[i].pEsino,130,50);
                  let date = new Date(this.payslipdetails[i].pDateOfReporting);
                    let day = ("0" + date.getDate()).slice(-2);
                    let month = date.toLocaleString('default', { month: 'short' });
                    let year = date.getFullYear();
                     let formattedDate = `${day}-${month}-${year}`;
                     doc.text("Date of Joining      :" + " " + formattedDate, 130, 55);

            doc.text("UAN No.           :"+" "+this.payslipdetails[i].pUANno,15,55);
             doc.text("Leave Balance :"+" ",15,60);
             doc.text("Loss of Pay Days  :" +" "+this.payslipdetails[i].pNoofLOP,130,60);
            doc.text("CL :"+" "+this.payslipdetails[i].pCasualleaves,42,60);
            doc.text("SL :"+" "+this.payslipdetails[i].pSickleaves,60,60);
            doc.setDrawColor(0, 0, 0);
            pdfInMM = 233;
             doc.line(10, 68, (pdfInMM - lMargin - rMargin), 68) // horizontal line
            let rupeeImage=this._commonService._getRupeeSymbol();
            doc.setFont("helvetica", "bold");
            doc.text("EARNINGS",50,73);
            doc.setFont("helvetica", "bold");
            doc.text("DEDUCTIONS",130,73);
            doc.setFont("helvetica", "normal");
            doc.setDrawColor(0, 0, 0);
            pdfInMM = 233;
            doc.line(10, 75, (pdfInMM - lMargin - rMargin), 75) // horizontal line
            pdfInMM = 233;
            doc.line(100,75,100,155); // vertical line
           doc.text("Basic Salary                :"+"       "+this._commonService.currencyformat(this.payslipdetails[i].pBasicAmount),20,80);
           doc.addImage(rupeeImage, 59, 78, 1.9, 1.9);
           doc.text("PF                       :"+"     "+this._commonService.currencyformat(this.payslipdetails[i].pEmpPFAmt),120,80);
           doc.addImage(rupeeImage, 150, 78, 1.9, 1.9);
           doc.text("ESI                      :"+"     "+this._commonService.currencyformat(this.payslipdetails[i].pEmpEsiAmt),120,90 );
           doc.addImage(rupeeImage, 150, 88, 1.9, 1.9);
           doc.text("Professional Tax :"+"     "+this._commonService.currencyformat(this.payslipdetails[i].pProffTaxAmt),120,100);
           doc.addImage(rupeeImage, 150, 98, 1.9, 1.9);
          doc.text("Advance              :"+"     "+this._commonService.currencyformat(this.payslipdetails[i].pAdvanceAmt),120,110);
           doc.addImage(rupeeImage, 150, 108, 1.9, 1.9);
           doc.text("Arrears                        :"+"       "+this._commonService.currencyformat(this.payslipdetails[i].pArrearsAmt),20,90);
           doc.addImage(rupeeImage, 59, 88, 1.9, 1.9);
           doc.text("Insurance            :"+"     "+this._commonService.currencyformat(this.payslipdetails[i].pInsuranceAmt),120,120);
           doc.addImage(rupeeImage, 150, 118, 1.9, 1.9);

           doc.text("Medical Allowance       :"+"      "+this._commonService.currencyformat(this.payslipdetails[i].pMedicalAllowAmt
            ),20,100);

           doc.addImage(rupeeImage, 59, 98, 1.9, 1.9);

           doc.text("ConveyanceAllowance :"+"     "+this._commonService.currencyformat(this.payslipdetails[i].pConvencyAllowAmt),20,110);
           doc.addImage(rupeeImage, 59, 108, 1.9, 1.9);

           doc.text("HRA                             :"+"      "+this._commonService.currencyformat(this.payslipdetails[i].pHraAmt ),20,120);
            doc.addImage(rupeeImage, 59, 118, 1.9, 1.9);

           this.payslipdetails[i].pOtherAllowAmt=this.payslipdetails[i].pGrossSalary-this.payslipdetails[i].pBasicAmount-this.payslipdetails[i].pArrearsAmt-this.payslipdetails[i].pMedicalAllowAmt-this.payslipdetails[i].pConvencyAllowAmt-this.payslipdetails[i].pHraAmt-this.payslipdetails[i].pSpecialAllowAmt-this.payslipdetails[i].pLoyaltyAllowAmt;

           doc.text("Other Allowance           :"+"      "+this._commonService.currencyformat(this.payslipdetails[i].pOtherAllowAmt),20,130);
           doc.addImage(rupeeImage, 59, 128, 1.9, 1.9);

            doc.text("Loyalty Allowance        :"+"      "+this._commonService.currencyformat(this.payslipdetails[i].pLoyaltyAllowAmt),20,150);
            doc.addImage(rupeeImage, 59, 148, 1.9, 1.9);

           doc.text("Special Allowance        :"+"      "+this._commonService.currencyformat(this.payslipdetails[i].pSpecialAllowAmt),20,140);
           doc.addImage(rupeeImage, 59, 138, 1.9, 1.9);
         
           doc.text("Income Tax          :"+"     "+this._commonService.currencyformat(this.payslipdetails[i].pIncomeTaxAmt),120,130);
           doc.addImage(rupeeImage, 150, 128, 1.9, 1.9);

           doc.text("Gross Salary             :"+"     "+this._commonService.currencyformat(this.payslipdetails[i].pGrossSalary),20,160);
           doc.addImage(rupeeImage, 56, 158, 1.9, 1.9);
           doc.text("Absent                 :"+"     "+this._commonService.currencyformat(this.payslipdetails[i].pLossOfPayAmt),120,140);
           doc.addImage(rupeeImage, 150, 138, 1.9, 1.9);
           doc.text("Recoveries          :"+"     "+this._commonService.currencyformat(this.payslipdetails[i].pRecoveryAmt),120,150);
           doc.addImage(rupeeImage, 150, 148, 1.9, 1.9);
           doc.text("Total            :"+"           "+this._commonService.currencyformat(this.payslipdetails[i].pDedectionAmt),120,160);
           doc.addImage(rupeeImage, 56, 158, 1.9, 1.9);
           doc.setDrawColor(0, 0, 0);
           pdfInMM = 233;
           doc.line(10, 155, (pdfInMM - lMargin - rMargin), 155) // horizontal line
           doc.setDrawColor(0, 0, 0);
           pdfInMM = 233;
           doc.line(10, 165, (pdfInMM - lMargin - rMargin), 165) // horizontal line
           doc.text("Paid Through                  : SALARY ACCOUNT",20,172);
           doc.setFont("helvetica", "bold");
           doc.text("Net Salary      :"+"     "+this._commonService.currencyformat(this.payslipdetails[i].pNetSalary),120,172);
           doc.addImage(rupeeImage, 146, 158, 1.9, 1.9);
           doc.setFont("helvetica", "normal");
           doc.text("Amount In Words            : "+"Rupees "+this.titleCase(this.numbertowords.transform(this.payslipdetails[i].pNetSalary))+" Only.",20,182);
           doc.setDrawColor(0, 0, 0);        

           const yPosition = 192;  // Set the common vertical position

           // Combine all the details into one label
           let bankDetailsLabel = "Emp Bank Details          : Acc No " + this.payslipdetails[i].paccountno + " - " + this.payslipdetails[i].pbankname1 +
                                  " - " + this.payslipdetails[i].pbankname ;
           doc.text(bankDetailsLabel, 20, yPosition);

           doc.text("** This is system generated document that does not require Signature.",20,230);

           if(count != this.payslipdetails.length){
            doc.addPage();
           }
          
           }
           doc.save('Payslip.pdf');
          }
          else{
            this._commonService.showWarningMessage('No Data To Retrieve')
          }
      });
    
  }

  titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
  }




  public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.ProfessionalTaxList, {}).data,
    };

    return result;
  }

  checkValidations(group: FormGroup, isValid: boolean): boolean {
    try {
      Object.keys(group.controls).forEach((key: string) => {
        isValid = this.GetValidationByControl(group, key, isValid);
      })
    }
    catch (e) {

      this._commonService.showErrorMessage(e);
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
          this.ProfessionalTaxFormValidationErrorMessages[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                lablename = (document.getElementById(key) as HTMLInputElement).title;
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.ProfessionalTaxFormValidationErrorMessages[key] += errormessage + ' ';
                isValid = false;
              }
            }
          }
        }
      }
    }
    catch (e) {
      return false;
    }
    return isValid;
  }

  BlurEventAllControll(fromgroup: FormGroup) {
    try {
      Object.keys(fromgroup.controls).forEach((key: string) => {
        this.setBlurEvent(fromgroup, key);
      })
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
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
      this._commonService.showErrorMessage(e);
      return false;
    }
  }

}
