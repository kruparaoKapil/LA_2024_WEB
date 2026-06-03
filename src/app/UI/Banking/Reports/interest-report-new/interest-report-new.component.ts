import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { LienEntryService } from 'src/app/Services/Banking/lien-entry.service';
import { DatePipe } from '@angular/common';
import { AccountingTransactionsService } from 'src/app/Services/Accounting/accounting-transactions.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { State, process, GroupDescriptor, SortDescriptor } from '@progress/kendo-data-query';
@Component({
  selector: 'app-interest-report-new',
  templateUrl: './interest-report-new.component.html',
  styles: []
})
export class InterestReportNewComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  
    InterestReportForm: FormGroup;
    public total: number = 0;    
    public today: Date = new Date();
    paymenttype = 'SELF';
    schemeid: any;
    showCheque: any;
    public SchemeDetails: any=[]
    public BranchDetails: any=[]
    public CompanyDetails: any = []
    public Showmembers: any = [];
    public ShowmembersFil: any = [];
    intrestpaymentlist: any;
      monthof: any;
    companyname:string;
    branchname: string
    showOnline: any;
    showdebitcard: any;
    showupi: any;
    showCompany: any;
    InterestPaymentErrors: any
    totalAdvanceAmount:number=0
    totalinterestpayable:number=0
    totalinterestamount:number=0;
    totaltdsamount:number=0
    totalnetamount:number=0
    public pageSize = 10;
  
    public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
    public interestpaymentdateConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
    nettotalamount:number=0;
    schemeName: any;
    minDate: Date;
    loading :boolean = false;

    //public group: GroupDescriptor[] = [{ field: 'pMembername' }];
    //public sort: SortDescriptor[] = [{ field: 'pmaturitydate', dir: 'asc' }];
  
    constructor(private FB: FormBuilder, private _CommonService: CommonService, private _LienEntryService: LienEntryService, private datepipe: DatePipe, private _AccountingTransactionsService: AccountingTransactionsService, private router: Router, private toastr: ToastrService)
    
    {
       this.dpConfig.dateInputFormat = 'MMM-YYYY'       
      // this.dpConfig.maxDate = new Date();
      // this.dpConfig.showWeekNumbers = false;
      this.dpConfig.minDate = this.minDate = new Date('2024-07-01T00:00:00+05:30');

      this.dpConfig.maxDate =this.today;
      this.allData = this.allData.bind(this);
  
    }
    public onOpenCalendar(container) {
      container.monthSelectHandler = (event: any): void => {
          container._store.dispatch(container._actions.select(event.date));
      };
      container.setViewMode('month');
  }
    ngOnInit() 
    {
      this.InterestReportForm = this.FB.group({
        ppaymentid: [''],
       
        padjustmenttype: [''],
       
        pCreatedby: [this._CommonService.pCreatedby],
       
       
        pschemename: ['', Validators.required],
        pSchemeId: ['', Validators.required],
  
        pcompanyname: ['', Validators.required],
        pbranchnamemain: ['', Validators.required],
        pMonthOf: ['', Validators.required],
      
       
     
        
    })
    this.InterestReportForm.controls.padjustmenttype.value == 'SELF'
    this.InterestReportForm.controls.padjustmenttype.value == 'ADJUSTMENT'
    this.GetSchemedetails();
    this.showCheque = true;
    this.showOnline = false;
    this.showdebitcard = false;
    this.showCompany = false;
   // this.GetCompanydetails();     
   
    this.InterestPaymentErrors = {};
   
    this.BlurEventAllControll(this.InterestReportForm);
    }
    GetSchemedetails() {
      debugger;
      this._LienEntryService.GetSchemedetails().subscribe(result => {
          debugger;
          this.SchemeDetails = result;
          console.log(this.SchemeDetails)
      })
  }
    GetCompanydetails() {
      debugger;
      this._LienEntryService.GetCompanydetails().subscribe(result => {
          debugger;
          this.CompanyDetails = result;
          console.log(this.CompanyDetails)
      })
  }
  DateChange($event: any) {
      debugger;
      this.monthof = this.datepipe.transform($event, 'MMM-yyyy');

      let minMonth = new Date('2024-06-01');
      let selectedMonth = new Date($event);

      if (selectedMonth < minMonth) {
        this.InterestReportForm['controls']['pMonthOf'].setValue('');
        this._CommonService.showWarningMessage('The selected month should not be before JULY 2024.');
        return
      }
  }
  GetShowmemberdetails() {
      debugger;
      let isValid = false;
      this.Showmembers = [];
      this.totalAdvanceAmount = 0;
      this.totalinterestpayable = 0;
      this.totalinterestamount = 0;
      this.totaltdsamount = 0;
      this.totalnetamount = 0;
      this.nettotalamount = 0;
      this.showbtnvalidation(this.paymenttype) 
          this.Showmembers.empty;
          debugger;
          this.loading = true;
      this._LienEntryService.GetInterestReport(this.monthof,this.schemeid, this.paymenttype, this.companyname, this.branchname).subscribe(result => {
              debugger;
              this.Showmembers = result;
              this.ShowmembersFil = result;
              console.log(this.Showmembers);
              this.loading = false;
              let month = this.datepipe.transform(this.InterestReportForm['controls']['pMonthOf'].value, 'MMM-yyyy');
            if(this.Showmembers.length == 0){
                this._CommonService.showWarningMessage('No Data To Show For The Month of' + ' ' + month);
                this.loading = false;
            }
              for(let i=0;i<this.Showmembers.length;i++)
              {
                  this.totalAdvanceAmount=this.totalAdvanceAmount + this.Showmembers[i].pdepositeamount;
  
                  // this.totalinterestpayable=this.totalinterestpayable + this.Showmembers[i].pInterestPayable;
                   this.totalinterestamount=this.totalinterestamount + this.Showmembers[i].pIntrestamount;
                   this.totaltdsamount=this.totaltdsamount + this.Showmembers[i].pTdsamount;
                  //  this.totalnetamount=this.totalnetamount + this.Showmembers[i].ptotalamount;
  
                  //  let invoiceAmount = this.Showmembers.reduce((sum, item) => sum + Number(item.invoice_amount), 0).toFixed(2);
  
                  // this.totamountEX = this.Showmembers[i].ptotalamount.reduce((sum, item) => sum + item.ptotalamount, 0);
              }
             // console.log("totamountEX8888",this.totamountEX)
              console.log("members",this.totalAdvanceAmount)
              console.log("int",this.totalinterestamount)
              console.log("net",this.totalnetamount)
              this.nettotalamount = this.Showmembers.reduce((sum, item) => sum + Number(item.ptotalamount), 0).toFixed(2);
  
              console.log("nettotalamount",this.nettotalamount)

              this.Showmembers = this.Showmembers.map(obj => {
                obj.fullData = obj.pbankname_bankbranch_banAccountno.split('/');
                obj.companySplit = obj.fullData[0].trim();
                obj.branchSplit = obj.fullData[1].trim();
                obj.groupCodeSplit = obj.fullData[2].trim();
                return obj;
              });
  
  
          },(error)=>{
            this._CommonService.showErrorMessage(error);
            this.loading = false;
          });
  
      
  }
  showbtnvalidation(type)
      {
          debugger
         
          let pSchemeId = <FormGroup>this.InterestReportForm['controls']['pSchemeId'];
          let padjustmenttype = <FormGroup>this.InterestReportForm['controls']['padjustmenttype'];
          let pcompanyname = <FormGroup>this.InterestReportForm['controls']['pcompanyname'];
          let pbranchnamemain = <FormGroup>this.InterestReportForm['controls']['pbranchnamemain'];
          let pMonthOf = <FormGroup>this.InterestReportForm['controls']['pMonthOf'];
                  
          if (type == 'SELF' || type == 'ALL') {
              
              pSchemeId.setValidators(Validators.required)
              padjustmenttype.setValidators(Validators.required)
              pMonthOf.setValidators(Validators.required)
              this.companyname='';
              this.branchname=''
  
  
          }
          else if (type == 'ADJUSTMENT') {
             
              pSchemeId.setValidators(Validators.required)
              padjustmenttype.setValidators(Validators.required)
              pMonthOf.setValidators(Validators.required)
              pcompanyname.setValidators(Validators.required)
              pbranchnamemain.setValidators(Validators.required)
  
  
          }
          else {
             
              pSchemeId.clearValidators()
              padjustmenttype.clearValidators()
              pMonthOf.clearValidators()
              pcompanyname.clearValidators()
              pbranchnamemain.clearValidators()
          }
          
  
       
          pSchemeId.updateValueAndValidity();
          padjustmenttype.updateValueAndValidity();
          pMonthOf.updateValueAndValidity();
          pcompanyname.updateValueAndValidity();
          pbranchnamemain.updateValueAndValidity();
         
      }
      shemename_change($event: any) {
          debugger;
          this.intrestpaymentlist = [];
          this.Showmembers = [];
          this.schemeid = $event.target.value;

          this.schemeName =  $event.target.options[$event.target.selectedIndex].text
  
      }
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
                  this.InterestPaymentErrors[key] = '';
                  if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
                      let lablename;
                      lablename = (document.getElementById(key) as HTMLInputElement).title;
                      let errormessage;
                      for (const errorkey in formcontrol.errors) {
                          if (errorkey) {
                              errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                              this.InterestPaymentErrors[key] += errormessage + ' ';
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
  debugger;
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
  adjustmentTypeChange($event: any) {
    debugger;
    const typevalue = $event.target.value;
    this.paymenttype = $event.target.value;
    this.CompanyDetails = [];
    this.BranchDetails = [];
    this.intrestpaymentlist = [];
    this.Showmembers = [];
    if (typevalue == "ADJUSTMENT") {
      this.showCompany = true;
     this.GetCompanydetails();
  
  }
  else {
      this.showCompany = false;
  
  }
   
  
  }
  branchNameChange($event: any) {
      debugger;
  
      this.intrestpaymentlist = [];
      this.Showmembers = [];
      this.branchname = $event.target.value;
  
  }
  GetBranchDetailsIP($event: any) {
      debugger;
      this.companyname = $event.target.value;
      const typevalue = $event.target.value;
     // this.intrestpaymentlist = [];
      this.Showmembers = [];
      this._LienEntryService.GetBranchName1(typevalue).subscribe(result => {
          debugger;
          this.BranchDetails = result;
      })
  }
  
    public allData(): ExcelExportData {
      const result: ExcelExportData = {
        data: process(this.Showmembers, {
          // group: this.group,
          sort: [{ field: "preceiptdate", dir: "asc" }],
        }).data,
      //  group: this.group,
      };
  
      return result;
    }


    onFilter(inputValue: string) {

        this.Showmembers = process(this.ShowmembersFil, {
          filter: {
            logic: "or",
            filters: [
              {
                field: 'pFdaccountno',
                operator: 'contains',
                value: inputValue
              },
              {
                field: 'pMembername',
                operator: 'contains',
                value: inputValue
              }, {
                field: 'pdepositeamount',
                operator: 'contains',
                value: inputValue
              }
            ],
          }
        }).data;
        this.dataBinding.skip = 0;
      }

    
  }
