import { Component, OnInit, ViewChild } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr'
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { debug } from 'util';
import { DatePipe, JsonPipe } from '@angular/common';
import { Router } from '@angular/router';
import { ExportAsService, ExportAsConfig, SupportedExtensions } from 'ngx-export-as';
import { formatDate } from "@angular/common";
import { Page } from 'src/app/UI/Common/Paging/page';
import { PageCriteria } from 'src/app/Models/Loans/Masters/pagecriteria'
import { State, process, GroupDescriptor,orderBy, SortDescriptor, groupBy } from '@progress/kendo-data-query';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { LienEntryService } from 'src/app/Services/Banking/lien-entry.service';
import { CommonService } from 'src/app/Services/common.service';
@Component({
  selector: 'app-agent-commission-report',
  templateUrl: './agent-commission-report.component.html',
  styles: []
})
export class AgentCommissionReportComponent implements OnInit {
  agentCommissionForm: FormGroup;
  @ViewChild('myTable', { static: false })
  config: any = [];
  public today: Date = new Date();
  agentid = 0;
  agentname = "All";

  public savebutton = 'Show';
  public loading = false;
  public isLoading = false;
  validation = false;
  formValidationMessages: any;
  gridData: any = [];
  public ShowAgentnames: any = []

  agentCommissionErrors: any
  date: any;
  commencementgridPage = new Page();
  startindex: any;
  endindex: any
  pageCriteria: PageCriteria;
  public dpFromConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  nettotalamount :number=0;
  netReleasedAmount :number=0;
  netTdsAmount :number=0;
  netPaidAmount :number=0;
  commissionTotalaAount :number=0;
  tdsTotalaAount:number=0;
  totalPaidAmount:number=0;
  pClosingBal:number=0;
  public hdnpPaymentstatus = true;
 // public group: GroupDescriptor[] = [{ field: 'pstatus' }];
group: GroupDescriptor[] = [{
    field: 'pstatus',
    aggregates: [
      { field: 'preleasedamount', aggregate: 'sum' },
      { field: 'pTdsamount', aggregate: 'sum' },
      { field: 'ppaidamount', aggregate: 'sum' },
      { field: 'pNetPayableAmount', aggregate: 'sum' }
    ]
  }];

  public sort: SortDescriptor[] = [{
    field: 'pstatus1',
    dir: 'desc'
  }];
    agentCommissionRepData1: any = [];

 


  monthof: string;
  minDate: Date;
  agentCommissionRepData: any = [];
    agentPan: any;

  constructor(private FB: FormBuilder, private _LienEntryService: LienEntryService, private _CommonService: CommonService, private datepipe: DatePipe, private router: Router, private exportAsService: ExportAsService) {

      
      this.dpFromConfig.dateInputFormat = 'MMM-YYYY'  

      this.dpFromConfig.maxDate = new Date();
      this.dpFromConfig.showWeekNumbers = false;

      this.dpFromConfig.minDate = this.minDate = new Date('2024-07-01T00:00:00+05:30');


     
      this.pageCriteria = new PageCriteria();
      //this.allData = this.allData.bind(this);

  }


  ngOnInit() {
      this.agentCommissionForm = this.FB.group({
          pagentname: [''],
          pagentid: ['0'],
          pMonthOf: ['',Validators.required],


      })
      this.commencementgridPage.pageNumber = 0
      this.commencementgridPage.size = 2;
      this.startindex = 0;
      this.endindex = this.commencementgridPage.size;
      this.commencementgridPage.totalElements = 2;
      this.agentCommissionErrors = {};
      this.BlurEventAllControll(this.agentCommissionForm);
      this.validation = false;
      this.date = new Date();
      this.GetAgentDetails();

     
      // this.agentCommissionForm['controls']['pToMonthOf'].setValue(this.date);

  }
  public onOpenCalendar(container) {
    container.monthSelectHandler = (event: any): void => {
        container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
}

  GetAgentDetails() {
      debugger;
      this._LienEntryService.GetAgentDetails().subscribe(result => {
          debugger;
          if (result) {
              // this.ShowAgentnames = result;
              let json: any = [];
              json = result;
              let testArray = [{ pagentid: 0, pagentname: "All" }];
              this.ShowAgentnames = [...testArray, ...json];
              //this.ShowAgentnames = json;

              this.ShowAgentnames.sort((a, b) => a.pagentname.localeCompare(b.pagentname));


              this.agentCommissionForm.controls.pagentname.setValue('All');
              this.agentCommissionForm.controls.pagentid.setValue(0);
          }
      })
  }

  agentnamechange($event) {
      debugger;
      $event
      this.agentid = $event.pagentid;
      this.agentname = $event.pagentname;
      this.agentCommissionRepData = [];

  }
 
  GetShowAgentdetails() {
      debugger;
      this.netReleasedAmount = 0;
      this.netTdsAmount = 0;
      this.netPaidAmount = 0;
      this.pClosingBal = 0;

      this._LienEntryService.ShowPromoterSalaryDetails1(this.agentid,this.monthof).subscribe(json => {
        let aaa:any = json;
        console.log(json);

        let bbb :any = json;
        console.log(bbb);
        

        this.agentCommissionRepData = bbb.map(obj => {
            obj.pNetPayableAmount = obj.preleasedamount - obj.pTdsamount ;
          
    
            return obj;
          });
        
        let sortedData = orderBy(aaa, this.sort);

        let groupedData = groupBy(sortedData, this.group);

        this.agentCommissionRepData = groupedData;
        this.agentPan = this.agentCommissionRepData[0].items[0].pagentpan;

        console.log(this.agentCommissionRepData);


        
        

        this.netReleasedAmount = aaa.reduce((sum, item) => sum + Number(item.preleasedamount), 0).toFixed(2);
        this.netTdsAmount = aaa.reduce((sum, item) => sum + Number(item.pTdsamount), 0).toFixed(2);
        this.netPaidAmount = aaa.reduce((sum, item) => sum + Number(item.ppaidamount), 0).toFixed(2);

        this.pClosingBal = this.netReleasedAmount - this.netTdsAmount - this.netPaidAmount;
       
      })
  }

  DateChange($event: any) {
    debugger;
    //this.monthof = this.datepipe.transform($event, 'yyyy-MM');
    this.monthof = this.datepipe.transform($event, 'MMM-yyyy').toUpperCase();

    let minMonth = new Date('2024-06-01');
    let selectedMonth = new Date($event);

    if (selectedMonth < minMonth) {
      this.agentCommissionForm['controls']['pMonthOf'].setValue('');
      this._CommonService.showWarningMessage('The selected month should not be before JULY 2024.');
      return
    }
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
                  this.agentCommissionErrors[key] = '';
                  if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
                      let lablename;
                      lablename = (document.getElementById(key) as HTMLInputElement).title;
                      let errormessage;
                      for (const errorkey in formcontrol.errors) {
                          if (errorkey) {
                              errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                              this.agentCommissionErrors[key] += errormessage + ' ';
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
 

    // public allData(): ExcelExportData {
    //   const result: ExcelExportData = {
    //     data: process(this.agentCommissionRepData, {
    //       group: this.group,
    //       sort: [{ field: "pPaymentstatus", dir: "asc" }],
    //     }).data,
    //     group: this.group,
    //   };
  
    //   return result;
    // }
}
