import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/Services/common.service';
import { GroupDescriptor,process } from '@progress/kendo-data-query';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataBindingDirective, RowArgs } from '@progress/kendo-angular-grid';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';


@Component({
  selector: 'app-collections-report',
  templateUrl: './collections-report.component.html',
  styles: []
})
export class CollectionsReportComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  CollectionReport: FormGroup;
  public startDatesReport: any;
  public ApplicantName: any;
  public LoanType: any;
  public ApplicantId: any;

  public endDatesReport: any;
  public today: Date = new Date();
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public CollectionValidationErrors: any;
  public gridData: any[] = [];
  public mySelection: string[] = [];
  public gridView: any = [];
  public totalprincipleamount: any;
  public totalInterestamount: any;
  public totalPenalityamount: any;
  public totalChargesamount: any;
  public totalTotalamount: any;
  public gridDataDetails: any = [];
  public gridViewDetails: any = [];
  public totalReceiptamount: any;
  public ShowDetailSection: boolean = false;

  constructor(private datePipe: DatePipe, private _routes: Router, private formbuilder: FormBuilder, private _CommonService: CommonService, ) {
    this.dpConfig.containerClass = 'theme-dark-blue';
    this.dpConfig.dateInputFormat = 'DD-MM-YYYY';
    this.dpConfig.maxDate = new Date();
    this.dpConfig.showWeekNumbers = false;
    this.dpConfig1.containerClass = 'theme-dark-blue';
    this.dpConfig1.dateInputFormat = 'DD-MM-YYYY';
    this.dpConfig1.maxDate = new Date();
    this.dpConfig1.showWeekNumbers = false;
  }

  ngOnInit() {
    this.endDatesReport = this.datePipe.transform(this.today, "dd-MMM-yyyy");
    this.startDatesReport = this.datePipe.transform(this.today, "dd-MMM-yyyy");
    this.GetformData();
    this.AddEvent();
  }

  public GetformData() {
    this.CollectionValidationErrors = {}
    this.CollectionReport = this.formbuilder.group({
      fromDate: [this.today],
      toDate: [this.today]
    });
    this.ShowDetailSection = false;
  }

  AddEvent() {
    debugger;
    let isValid = true;
    let fromDate = this.datePipe.transform(this.CollectionReport['controls']['fromDate'].value, "dd-MMM-yyyy");
    let toDate = this.datePipe.transform(this.CollectionReport['controls']['toDate'].value, "dd-MMM-yyyy");
    this.startDatesReport = fromDate;
    this.endDatesReport = toDate
    let recordid=0;
    let fieldname="ALL";
    let fieldtype="ALL"
    this._CommonService.GetCollectionReport(fromDate, toDate,recordid,fieldname,fieldtype).subscribe(json => {
      
      this.gridData = json;
      this.gridView = this.gridData;
      // this.GetformData();
      this.gridDataDetails = [];
      this.gridViewDetails = [];
      this.totalReceiptamount = ""
      let totprincipleamount:number = this.gridView.reduce((sum, c) => sum + c.pPrinciple, 0);
      this.totalprincipleamount = totprincipleamount.toFixed(2);

      let totInterestamount:number = this.gridView.reduce((sum, c) => sum + c.pInterest, 0);
      this.totalInterestamount = totInterestamount.toFixed(2);

      let totPenalityamount:number = this.gridView.reduce((sum, c) => sum + c.pPenality, 0);
      this.totalPenalityamount = totPenalityamount.toFixed(2);
      
      let totChargesamount:number = this.gridView.reduce((sum, c) => sum + c.pCharges, 0);
      this.totalChargesamount = totChargesamount.toFixed(2);

      let totTotalamount:number = this.gridView.reduce((sum, c) => sum + c.pTotalamount, 0);
      this.totalTotalamount = totTotalamount.toFixed(2);
      this.ShowDetailSection = false;
    });

  }


  addHandler({dataItem}) {
    debugger;
    let applicationid = dataItem.pVchapplicationid;
    this.ApplicantName = dataItem.pApplicantname;
    this.LoanType = dataItem.pLoantype;
    this.ApplicantId = dataItem.pVchapplicationid;
   // let applicationid = context.selectedRows[0].dataItem.pVchapplicationid
    this._CommonService.GetCollectiondetails(this.startDatesReport, this.endDatesReport, applicationid).subscribe(json => {
      
      this.ShowDetailSection = true;
      this.gridDataDetails = json;
      this.gridViewDetails = this.gridDataDetails;
       let totReceiptamount:number= this.gridViewDetails.reduce((sum, c) => sum + c.pReceiptamount, 0);
       this.totalReceiptamount = totReceiptamount.toFixed(2)
    });
  }

  print() {
    
    let printContents, popupWin;
    printContents = document.getElementById('temp-box').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Collection Report</title>
          <link rel="stylesheet" type="text/css" href="assets/css/bootstrap.min.css"/>
          <link rel="stylesheet" type="text/css" href="assets/css/custom.css" />
         
          <style>
          //........Customized style.......
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }


  //----------------VALIDATION----------------------- //
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
          this.CollectionValidationErrors[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {

            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                let lablename;
                lablename = (document.getElementById(key) as HTMLInputElement).title;
                let errormessage;
                errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.CollectionValidationErrors[key] += errormessage + ' ';
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
  //----------------VALIDATION----------------------- //

  public ChequeDateChange(event) {
    
    this.dpConfig1.minDate = event;
    this.CollectionReport.controls.toDate.setValue(this.today)
  }

  public onFilter(inputValue: string): void {
    this.gridView = process(this.gridData, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'pApplicantname',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pLoantype',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pVchapplicationid',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pPrinciple',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pInterest',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pPenality',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pCharges',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pTotalamount',
            operator: 'contains',
            value: inputValue
          }
        ],
      }
    }).data;
    this.totalprincipleamount = this.gridView.reduce((sum, c) => sum + c.pPrinciple, 0);
    this.totalInterestamount = this.gridView.reduce((sum, c) => sum + c.pInterest, 0);
    this.totalPenalityamount = this.gridView.reduce((sum, c) => sum + c.pPenality, 0);
    this.totalChargesamount = this.gridView.reduce((sum, c) => sum + c.pCharges, 0);
    this.totalTotalamount = this.gridView.reduce((sum, c) => sum + c.pTotalamount, 0);
    this.dataBinding.skip = 0;
  }
}
