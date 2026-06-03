import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr'
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { debug } from 'util';
import { DatePipe, JsonPipe } from '@angular/common';
import { Router } from '@angular/router';
import { ExportAsService, ExportAsConfig, SupportedExtensions } from 'ngx-export-as';
import { LienEntryService } from '../../../../Services/Banking/lien-entry.service';
import { CommonService } from '../../../../Services/common.service';
import { formatDate } from "@angular/common";
import { Page } from 'src/app/UI/Common/Paging/page'
import { LAReportsService } from '../../../../Services/Banking/lareports.service';

@Component({
  selector: 'app-member-details-report',
  templateUrl: './member-details-report.component.html',
  styles: []
})
export class MemberDetailsReportComponent implements OnInit {
 MemberDetailsReportForm: FormGroup;
 showbetween:boolean=false;
  frommonthof: any;
  public today: Date = new Date();
  tomonthof: any;
  public loading = false;
  public isLoading = false;
  validation = false;
  public betweenorason = "As On";

  membername = 0;
  membertype: any
  public showbutton = 'Show';
  getmemberreceipt: any;
  showFrommonth: any;
  showTomonth: any;
  selecteddate = true;
  formValidationMessages: any;
  fromdate: any;
  todate: any;
  date: any;
  public dpFromConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpToConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  table: any;
  returndata: any[];
  MemberDetailsList: any;
  MemberDetailsReportErrors: any
  membernameid="undefined";
  commencementgridPage = new Page()
  constructor(private FB: FormBuilder, private _LAReportsService: LAReportsService, private _LienEntryService: LienEntryService, private _CommonService: CommonService, private datepipe: DatePipe, private router: Router, private exportAsService: ExportAsService) {

    this.dpFromConfig.dateInputFormat = 'DD-MMM-YYYY'
    this.dpFromConfig.maxDate = new Date();
    this.dpFromConfig.showWeekNumbers = false;

    this.dpToConfig.dateInputFormat = 'DD-MMM-YYYY'
    this.dpToConfig.maxDate = new Date();
    this.dpToConfig.showWeekNumbers = false;
  }

  ngOnInit() {
    this.MemberDetailsList=[];
    this.MemberDetailsReportForm = this.FB.group({

      datecheck: ['ASON', Validators.required],
      pFromMonthOf: [this.today, Validators.required],
      pToMonthOf: [this.today, Validators.required]
    })
    this.commencementgridPage.pageNumber = 0
    this.commencementgridPage.size = 10;
    this.commencementgridPage.totalElements = 3;
    this.DatetypeChange('ASON');
    this.frommonthof = new Date();
    this.tomonthof = new Date();
    this.fromdate = this.datepipe.transform(this.frommonthof, "DD-MMM-YYYY");
    this.todate = this.datepipe.transform(this.tomonthof, "DD-MMM-YYYY");
    this.MemberDetailsReportForm['controls']['pToMonthOf'].setValue(new Date());
    this.MemberDetailsReportErrors = {};

  }
  DatetypeChange(type) {
    debugger;
   this.MemberDetailsList=[];
    if (type == "ASON") {
      this.MemberDetailsReportForm['controls']['pToMonthOf'].setValue(new Date());
      this.showbetween=false
      this.betweenorason="As On";
    }
    else if (type == "BETWEEN") {
      this.MemberDetailsReportForm['controls']['pFromMonthOf'].setValue(new Date());
      this.MemberDetailsReportForm['controls']['pToMonthOf'].setValue(new Date());
      this.showbetween=true;
      this.betweenorason="Between";
    }
    else {
     this.showbetween=false
    }

  }
  FromDateChange($event: any) {
    debugger;
     this.MemberDetailsList=[];
    this.frommonthof = $event;
    this.fromdate = this.datepipe.transform(this.frommonthof, "yyyy-MM-dd");
     if ( this.MemberDetailsReportForm.controls.datecheck.value== "BETWEEN") {
       this.Change_Date();
     }

  }
  ToDateChange($event: any) {
    debugger
    this.tomonthof = $event;
    this.todate = this.datepipe.transform(this.tomonthof, "yyyy-MM-dd");
     if ( this.MemberDetailsReportForm.controls.datecheck.value== "BETWEEN") {
       this.Change_Date();
     }
  }
 Change_Date() {
    debugger;
    let fromdate = this.datepipe.transform(this.MemberDetailsReportForm['controls']['pFromMonthOf'].value, "dd/MM/yyyy");
    let todate = this.datepipe.transform(this.MemberDetailsReportForm['controls']['pToMonthOf'].value, "dd/MM/yyyy");
    let finaltodate = this._CommonService.formatDateFromDDMMYYYY(todate);
    let finalfromdate = this._CommonService.formatDateFromDDMMYYYY(fromdate);
     if ( this.MemberDetailsReportForm.controls.datecheck.value== "BETWEEN") {
    if (finalfromdate > finaltodate) {
      this._CommonService.showWarningMessage("To Date must be greater than or equal to From Date");
      this.MemberDetailsReportForm['controls']['pToMonthOf'].setValue(new Date());
        }
     }  
   }
GetMemberDetails(){
  debugger;

  let datecheck=this.MemberDetailsReportForm.controls.datecheck.value;
  let fromdate=this.datepipe.transform(this.MemberDetailsReportForm.controls.pFromMonthOf.value,'yyyy-MM-dd');
  let todate=this.datepipe.transform(this.MemberDetailsReportForm.controls.pToMonthOf.value,'yyy-MM-dd');
  this._LAReportsService.GetMemberDetails(datecheck,fromdate,todate).subscribe(result=>{
    debugger;
    if(result){
    this.MemberDetailsList=result;
    }
  })
}
  onDetailToggle(event) {
    console.log('Detail Toggled', event);
  }
  toggleExpandGroup(group) {
    console.log('Toggled Expand Group!', group);
    this.table.groupHeader.toggleExpandGroup(group);
  }
 
  
  pdf() {
    debugger;
    let temp;
    let rows = [];
    let type;
    let gridheaders;
    let reportname = "Member Details Report";
   
    gridheaders = ["Member Name","Member Type","Member Code",  "Contact Type","Phone No.", "Address"];
    
    let colWidthHeight = {
       0: { cellWidth: 'auto' }, 1: { cellWidth: 'auto' }, 2: { cellWidth: 'auto' ,halign: 'right'  }, 3: { cellWidth: 'auto' }, 4: { cellWidth: 'auto' }, 5: { cellWidth: 'auto',halign: 'right'}, 6: { cellWidth: 'auto' }
    }

    // let data = "true"
    // if (data == "true") {
    //   debugger;
    //     this.returndata = this._CommonService._getGroupingGridExportData(this.MemberDetailsList, "pMembername", false)
    // }
    // else {
        this.returndata = this.MemberDetailsList
//}
    debugger;
    this.returndata.forEach(element => {  
      debugger;
        if (element.group !== undefined) {
            temp = [element.group,element.pmembertype ,element.pMembercode, element.pcontacttype,element.pphoneno,element.pAddress];
        }
        else {
            temp = [element.pMembername,element.pmembertype ,element.pMembercode, element.pcontacttype,element.pphoneno,element.pAddress];
        } 


        rows.push(temp);
});
    // pass Type of Sheet Ex : a4 or lanscspe  
    debugger;
    this._CommonService._downloadReportsPdfmemberDetailsReport(reportname, rows, gridheaders, colWidthHeight, "landscape",this.betweenorason, this.datepipe.transform(this.frommonthof,'dd-MMM-yyyy'), this.datepipe.transform(this.tomonthof,'dd-MMM-yyyy'));



}

  // Validation Methods ---------------
  checkValidations(group: FormGroup, isValid: boolean): boolean {
    debugger
    try {

      Object.keys(group.controls).forEach((key: string) => {

        isValid = this.GetValidationByControl(group, key, isValid);
      })

    }
    catch (e) {
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
          this.MemberDetailsReportErrors[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.MemberDetailsReportErrors[key] += errormessage + ' ';
                isValid = false;
              }
            }
          }
        }
      }
    }
    catch (e) {
      // this.showErrorMessage(e);
      // return false;
    }
    return isValid;
  }
  showErrorMessage(errormsg: string) {
    this._CommonService.showErrorMessage(errormsg);
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
  // End Validation Methods --------------

}
