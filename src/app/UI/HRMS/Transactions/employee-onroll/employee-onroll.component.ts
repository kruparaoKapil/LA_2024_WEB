import {  Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { CommonService } from 'src/app/Services/common.service';
import { process } from '@progress/kendo-data-query';
import { DatePipe } from '@angular/common';
import { EmployeeOnrollService } from 'src/app/Services/HRMS/Transactions/employee-onroll.service';
import { error } from 'console';
declare const $: any;
@Component({
  selector: 'app-employee-onroll',
  templateUrl: './employee-onroll.component.html',
  styles: []
})
export class EmployeeOnrollComponent implements OnInit {

  loading : boolean = false;
  pbranch_id : any;
  contact_id : any;
  employeeClickData : any;
  employeeOnrollList : any = [];
  popupbutton : any;
  FileName: any;
  imageResponse: any;
  sscminutesdate :any;


  //Allowance
  allowancesForm :FormGroup;
  allowancesForm2 : FormGroup;
  allowanceShow : boolean = false;
  advanceShow : boolean = false;
  recoveriesShow : boolean = false;
  allowanceGrid : any = [];
  allowancesDDL: any = [];
  authorizedbylist : any = [];
  allowanceGridData: any = [];
  allowanceAddedGridarray : any = [];
  allowanceAddedGridData :any = [];
  basicamount : any;
  grossSalary : any;
  totallowanceamount :any;
  allowancegridaddbtn : any = 'Add';
  allowancerowIndex: any;

  allowancesTypeDDL : any = [{ value: 'M', name: 'Monthly' },
    { value: 'Q', name: 'Quarterly' },
    { value: 'H', name: 'Half Yearly' },
    { value: 'Y', name: 'Yearly' }];

  ErrorMessages: { [key: string]: string } = {};

  //Advance
  advanceForm : FormGroup;
  advanceForm2 : FormGroup;
  advanceGrid : any =[];
  advanceGridData :any = [];
  advanceTypes :any = [];
  advanceGridAddedData :any =[];
  advanceGridAddedarray :any = [];
  advancegridaddbtn : any = 'Add';
  advancerowIndex : any;
  currentdate : Date = new Date();
  currentdate2 :any = this.datepipe.transform(new Date(),"MM/dd/yyyy");


  //Recovery
  recoveriesForm : FormGroup;
  recoveriesForm2 : FormGroup;
  recoveryGrid : any = [];
  recoveryGridData :any = [];
  recoveriesTypesDDL :any =[];

  recoverydeductionTypes : any = [
    { value: 'M', name: 'Monthly' },
    { value: 'Q', name: 'Quarterly' },
    { value: 'H', name: 'Half Yearly' },
    { value: 'Y', name: 'Yearly' }
  ];

  recoveryAddedGridarray :any = [];
  recoveryAddedGridData : any = [];
  recoverygridaddbtn : any = 'Add';
  recoveryrowIndex : any;



  public dateConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dateConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dateConfig2: Partial<BsDatepickerConfig> = new BsDatepickerConfig();

  employeeonrollarray : any = [];
  periodvalidate: string;
  totalAllowanceAmount:any;
  totalDeductionAmount: any;
  totalRecoveryAmount: any;
  employeeClickName : string;
  employeeClickDesignation : string;

  constructor(private fb:FormBuilder,private _commonService : CommonService,private _emponrollser : EmployeeOnrollService, private datepipe:DatePipe) {
    this.dateConfig.dateInputFormat = "DD/MM/YYYY";
    this.dateConfig.showWeekNumbers = false;
    this.dateConfig1.dateInputFormat = "DD/MM/YYYY";
    this.dateConfig1.showWeekNumbers = false;
    this.dateConfig2.dateInputFormat = "DD/MM/YYYY";
    this.dateConfig2.showWeekNumbers = false;
  }

  ngOnInit() {
    debugger;
     this.getEmployeeDetails();
    // this.periodvalidate = "([1-9]|1[0-2])";

    this.allowancesForm = this.fb.group({
      typeofallowance : [null,Validators.required],
      effectedfromdate : [null,Validators.required],
      isrecurring : [true],
      allowancetype : [null,Validators.required],
      allowancetypeid :[],
      allowanceperiod : [null,Validators.required],
      allowanceamount :[null,Validators.required],
      branchid : [this.pbranch_id],
      //branchcode: [''],
    });
    this.allowancesForm2 = this.fb.group({
      authorizedbyid : ['',Validators.required],
      comments : ['',Validators.required],
      originalfilename: [],
      filename :[]
    });


    this.advanceForm = this.fb.group({
      advancetype : [null,Validators.required],
      advancetypeid :[],
      advanceamount :[null,Validators.required],
      advancedeductionperiod :[null,Validators.required],
      advancedeductionamount :[],
      effectedFrom :[this.currentdate,Validators.required],
      effectedTo :[this.currentdate2,Validators.required],
    });
    this.advanceForm2 = this.fb.group({
      advancecomments :[null,Validators.required],
      filename :[],
      advanceauthorizedbyid :[null,Validators.required],
      originalfilename :[]
    });


    this.recoveriesForm = this.fb.group({
      recoverytype : [null,Validators.required],
      recoveryamount :[null,Validators.required],
      recoverydeductiontype :[null,Validators.required],
      recoverytypeid : [],
      recoverydeductionperiod :[null,Validators.required],
      recoverydeductionamount :[],
      recoveryeffectedfrom :[null,Validators.required],
      sscminutesdate: [],
    });
    this.recoveriesForm2 = this.fb.group({
      originalfilename :[],
      filename :[],
      recoveryauthorizedby :[null,Validators.required],
      recoverycomments :[null,Validators.required]
    });


    this.popupbutton = "Allowance";
    this.BlurEventAllControll(this.allowancesForm);
    this.BlurEventAllControll(this.allowancesForm2);
    this.BlurEventAllControll(this.advanceForm);
    this.BlurEventAllControll(this.advanceForm2);
    this.BlurEventAllControll(this.recoveriesForm);
    this.BlurEventAllControll(this.recoveriesForm2);
  }


  getEmployeeDetails(){
    debugger;
    this.loading = true;
    let branchid = JSON.parse(sessionStorage.getItem('SetBranch'));
    this.pbranch_id = branchid.pbranch_id;
      this._emponrollser.getEmployeeDetails(this.pbranch_id).subscribe( json =>{
        debugger;
        this.loading = false;
        console.log(json);
        this.employeeonrollarray = json;
        this.employeeOnrollList = json ;
        if(this.employeeOnrollList.length == 0){
          this._commonService.showWarningMessage("No Data To Show");
        }
      },(error) =>{
        this._commonService.showErrorMessage(error);
        this.loading = false;
      });
  }


  public searchRecord(inputValue: string): void {
    this.employeeOnrollList = process(this.employeeonrollarray, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'pEmployeeId',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pEmployeeName',
            operator: 'contains',
            value: inputValue
          }
        ],
      }
    }).data;
  }


  openPopupView(data){
    debugger;
    this.contact_id = data.pContactId;
    this.employeeClickData = data;
    this.allowanceShow = true;
    this.basicamount = this.employeeClickData.pBasicAmount;
    this.grossSalary = this.employeeClickData.pCtcAmount;
    this.totallowanceamount = this.employeeClickData.pAllowanceAmount;
    this.sscminutesdate = this.employeeClickData.pDateOfJoining;
    this.employeeClickName = this.employeeClickData.pEmployeeName;
    this.employeeClickDesignation = this.employeeClickData.pDesignation;
    $('#employeeonrollDetails').modal('show');
    this.popupbutton = "Allowance";
    this.allowanceClick();
  }


  allowanceClick(){
    debugger;
    this.allowanceShow = true;
    this.GetAllowanceDetails();
    this.GetAllowanceTypes();
    this.GetSubInterducedDetails();
    this.advanceShow = false;
    this.recoveriesShow = false;
  }


  BlurEventAllControll(fromgroup: FormGroup) : boolean
  {
    debugger;
    try {
      debugger
      Object.keys(fromgroup.controls).forEach((key: string) => {
        this.setBlurEvent(fromgroup, key);
      })
      return true;
    }
    catch (e) {
      debugger
      this._commonService.showErrorMessage(e);
      return false;
    }
  }


  setBlurEvent(fromgroup: FormGroup, key: string) : boolean
  {
    debugger;
    try {
      debugger
      let formcontrol;
      formcontrol = fromgroup.get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          debugger;
          this.BlurEventAllControll(formcontrol)
        }
        else {
          if (formcontrol.validator)
            fromgroup.get(key).valueChanges.subscribe((data) => { this.GetValidationByControl(fromgroup, key, true) })
        }
      }
      return true;
    }
    catch (e) {
      debugger;
      this._commonService.showErrorMessage(e);
      return false;
    }
  }


  checkValidations(group: FormGroup, isValid: boolean): boolean
  {
    debugger
    try
    {
      Object.keys(group.controls).forEach((key: string) => {
        isValid = this.GetValidationByControl(group, key, isValid);
      });
    }
    catch (e)
    {
      this.showErrorMessage(e);
      return false;
    }
    return isValid;
  }


  GetValidationByControl(formGroup: FormGroup, key: string, isValid: boolean): boolean
  {
    debugger;
    try
    {
      const formcontrol = formGroup.get(key);
      if (formcontrol)
      {
        if (formcontrol instanceof FormGroup)
        {
          this.checkValidations(formcontrol, isValid);
        }
        else if (formcontrol.validator)
        {
          this.ErrorMessages[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty)
          {
            const element = document.getElementById(key);
            const lablename = element ? element.title : key;
            let errormessage;
            for (const errorkey in formcontrol.errors)
            {
              if (errorkey)
              {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.ErrorMessages[key] += errormessage + ' ';
                isValid = false;
              }
            }
          }
        }
      }
    }
    catch (e)
    {
      this.showErrorMessage(e);
      return false;
    }
    return isValid;
  }


  showErrorMessage(errormsg: any)
  {
    debugger
    this._commonService.showErrorMessage(errormsg);
  }


  GetAllowanceDetails(){
    debugger;
    this._emponrollser.GetAllowanceDetails(this.employeeClickData.pContactId).subscribe(res =>{
      debugger;
      this.allowanceGrid = res;
      this.allowanceGridData = this.allowanceGrid;

      this.totalAllowanceAmount = this.allowanceGridData.reduce((sum, c) => sum + parseFloat((c.allowanceamount)), 0);
    });
  }



  recurringChange(event){
    debugger;
    if(event.target.checked){
      this.allowancesForm.controls.isrecurring.setValue(true);
    }
    else{
      this.allowancesForm.controls.isrecurring.setValue(true);
    }
  }











GetAdvanceDetails(){
  debugger;
  this._emponrollser.GetAdvanceDetails(this.employeeClickData.pContactId).subscribe(res =>{
    debugger;
    this.advanceGrid = res;
    this.advanceGridData = this.advanceGrid;
    this.totalDeductionAmount = this.advanceGridData.reduce((sum, c) => sum + parseFloat((c.advanceamount)), 0);
  });
}


GetRecoveryDetails(){
  debugger;
  this._emponrollser.GetRecoveryDetails(this.employeeClickData.pContactId).subscribe(res =>{
    debugger;
    this.recoveryGrid = res;
    this.recoveryGridData = this.recoveryGrid;
    this.totalRecoveryAmount = this.recoveryGridData.reduce((sum, c) => sum + parseFloat((c.recoveryamount)), 0);
  });
}





  GetAllowanceTypes(){
    debugger;
    this._emponrollser.GetAllowanceTypes().subscribe(json =>{
      debugger;
      console.log(json);
      this.allowancesDDL = json;
      this.allowancesDDL = this.allowancesDDL.filter(item => item.allowancetypeid !== 13 && item.allowancetype !== 'LOYALTY ALLOWANCES');
    });
  }


  GetSubInterducedDetails(){
    debugger;
    this._emponrollser.GetSubInterducedDetails().subscribe(res =>{
      debugger;
      console.log(res);
      this.authorizedbylist = res;
    });
  }




  allowanceGridAdd(){
    debugger;
    if(this.checkValidations(this.allowancesForm,true)){
      debugger;
      if(this.allowancegridaddbtn =='Add'){
        let data = {
          "allowancetype": this.allowancesForm.controls.allowancetype.value,
          "allowanceamount": Number(this._commonService.removeCommasForEntredNumber(this.allowancesForm.controls.allowanceamount.value)),
          "effectedfromdate": this.datepipe.transform(this.allowancesForm.controls.effectedfromdate.value, "yyyy-MM-dd"),
          "isrecurring": this.allowancesForm.controls.isrecurring.value,
          "typeofallowance": this.allowancesForm.controls.typeofallowance.value,
          "allowanceperiod": Number(this.allowancesForm.controls.allowanceperiod.value),
          "allowancetypeid": this.allowancesForm.controls.allowancetypeid.value,
        };

        console.log(data);
        this.allowanceAddedGridarray.push(data);
        this.allowanceAddedGridData = [...this.allowanceAddedGridarray];

        this.clearDataInAllowanceGridAdd();
      }
      else if(this.allowancegridaddbtn == 'Update'){
      this.updateAllowanceAddedGrid();
      }
    }
  }


  clearDataInAllowanceGridAdd(){
    debugger;
    this.allowancesForm.controls.allowancetype.setValue('');
    this.allowancesForm.controls.allowanceamount.setValue('');
    this.allowancesForm.controls.effectedfromdate.setValue('');
    this.allowancesForm.controls.typeofallowance.setValue('');
    this.allowancesForm.controls.allowanceperiod.setValue('');
    this.allowancesForm.controls.isrecurring.setValue(true);

    this.ErrorMessages.allowancetype = '';
    this.ErrorMessages.allowanceamount = '';
    this.ErrorMessages.typeofallowance = '';
    this.ErrorMessages.allowanceperiod = '';
    this.ErrorMessages.effectedfromdate = '';
  }


  editAllowanceAddedGrid(event){
    debugger;
    this.allowancerowIndex = event.rowIndex;
    this.allowancegridaddbtn = 'Update';
    console.log(event.dataItem.allowancetype);
    this.allowancesForm.controls.allowancetype.setValue(event.dataItem.allowancetype);
    this.allowancesForm.controls.allowanceamount.setValue(this._commonService.currencyformat(event.dataItem.allowanceamount));
    this.allowancesForm.controls.effectedfromdate.setValue(new Date(event.dataItem.effectedfromdate));
    this.allowancesForm.controls.isrecurring.setValue(event.dataItem.isrecurring);
    this.allowancesForm.controls.typeofallowance.setValue(event.dataItem.typeofallowance);
    this.allowancesForm.controls.allowanceperiod.setValue(event.dataItem.allowanceperiod);
  }


  updateAllowanceAddedGrid(){
    debugger;
    if(this.allowancegridaddbtn == 'Update'){
      debugger;
      this.allowancerowIndex;
      this.allowanceAddedGridarray[this.allowancerowIndex].allowancetype = this.allowancesForm.controls.allowancetype.value;

      this.allowanceAddedGridarray[this.allowancerowIndex].allowanceamount = this._commonService.removeCommasForEntredNumber(this.allowancesForm.controls.allowanceamount.value);

      this.allowanceAddedGridarray[this.allowancerowIndex].effectedfromdate = this.datepipe.transform(this.allowancesForm.controls.effectedfromdate.value,"yyyy-MM-dd");

      this.allowanceAddedGridarray[this.allowancerowIndex].isrecurring = this.allowancesForm.controls.isrecurring.value;

      this.allowanceAddedGridarray[this.allowancerowIndex].typeofallowance = this.allowancesForm.controls.typeofallowance.value;

      this.allowanceAddedGridarray[this.allowancerowIndex].allowanceperiod = this.allowancesForm.controls.allowanceperiod.value;

      this.clearDataInAllowanceGridAdd();
      this.allowancegridaddbtn = 'Add';
    }
  }


  removeAllowanceAddedGrid(event){
    debugger;
    const index: number = event.rowIndex;
    if (index !== -1) {
      this.allowanceAddedGridarray.splice(index, 1);
      this.allowanceAddedGridData = [...this.allowanceAddedGridarray];
    }
  }

  removeAllowanceDetails(event){
    debugger;
    let dataItem = event.dataItem;
    let createdby=this._commonService.pCreatedby;
    let employeeonrollallowanceid=dataItem.employeeonrollallowanceid;
    let ptypeofoperation='DELETE';
    let data = [{ 
      "pCreatedby":createdby,
      "allowanceid": employeeonrollallowanceid, 
      "ptypeofoperation": ptypeofoperation      
    }];

    this._emponrollser.deleteAllowanceDetails(dataItem.employeeonrollallowanceid).subscribe(res => {      
      this.GetAllowanceDetails();
      this._commonService.showInfoMessage('Allowance Deteted Successfully');
    });
  }

  removeAdvanceDetails(event){
    debugger;
    let dataItem = event.dataItem;
    let createdby=this._commonService.pCreatedby;
    let employeeonrollallowanceid=dataItem.employeeonrolladvanceid;
    let ptypeofoperation='DELETE';
    let data = [{ 
      "pCreatedby":createdby,
      "documentstoreid": employeeonrollallowanceid, 
      "ptypeofoperation": ptypeofoperation      
    }];

    this._emponrollser.deleteAdvanceDetails(dataItem.employeeonrolladvanceid).subscribe(res => {      
      this.GetAdvanceDetails();
      this._commonService.showInfoMessage('Advance Deteted Successfully');
    });
  }

  removeRecoveryDetails(event){
    debugger;
    let dataItem = event.dataItem;
    let createdby=this._commonService.pCreatedby;
    let employeeonrollallowanceid=dataItem.employeeonrollrecoveriesid;
    let ptypeofoperation='DELETE';
    let data = [{ 
      "pCreatedby":createdby,
      "documentstoreid": employeeonrollallowanceid, 
      "ptypeofoperation": ptypeofoperation      
    }];

    this._emponrollser.deleteRecoveryDetails(dataItem.employeeonrollrecoveriesid).subscribe(res => {      
      this.GetRecoveryDetails();
      this._commonService.showInfoMessage('Recovery Details Deteted Successfully');
    });
  }


  advanceClick(){
    this.advanceShow = true;
    this.GetAdvanceDetails();
    this.GetAdvanceTypes();
    this.GetSubInterducedDetails();
    this.allowanceShow = false;
    this.recoveriesShow = false;
  }

  advanceGridAdd(){
    debugger;
    if(this.checkValidations(this.advanceForm,true)){
      debugger;
      if(this.advancegridaddbtn == 'Add'){
        let data = {
          "nameofadvance": this.advanceForm.controls.advancetype.value,
          "advanceamount": Number(this._commonService.removeCommasForEntredNumber(this.advanceForm.controls.advanceamount.value)),
          "deductedfromdate": this.datepipe.transform(this.advanceForm.controls.effectedFrom.value,"yyyy-MM-dd"),
          "deductedtodate": this.datepipe.transform(this.advanceForm.controls.effectedTo.value,"yyyy-MM-dd"),
          "deductionperiod": Number(this.advanceForm.controls.advancedeductionperiod.value),
          "deductionamount": Number(this._commonService.removeCommasForEntredNumber(this.advanceForm.controls.advancedeductionamount.value))
        };

        console.log(data);
        this.advanceGridAddedarray.push(data);
        this.advanceGridAddedData = [...this.advanceGridAddedarray];

        this.clearDataInAdvanceGridAdd();

      }
      else if(this.advancegridaddbtn == 'Update'){
        this.updateAdvanceAddedGrid();
      }
    }
  }


  editAdvanceAddedGrid(event){
    debugger;
    this.advancerowIndex = event.rowIndex;
    this.advancegridaddbtn = 'Update';
    console.log(event.dataItem.nameofadvance);
    this.advanceForm.controls.advancetype.setValue(event.dataItem.nameofadvance);
    this.advanceForm.controls.advanceamount.setValue(this._commonService.currencyformat(event.dataItem.advanceamount));
    this.advanceForm.controls.effectedFrom.setValue(new Date(event.dataItem.deductedfromdate));
    this.advanceForm.controls.effectedTo.setValue(event.dataItem.deductedtodate);
    this.advanceForm.controls.advancedeductionperiod.setValue(event.dataItem.deductionperiod);
    this.advanceForm.controls.advancedeductionamount.setValue(this._commonService.currencyformat(event.dataItem.deductionamount));
  }


  updateAdvanceAddedGrid(){
    debugger;
    if(this.advancegridaddbtn == 'Update'){
      debugger;
      this.advancerowIndex;
      this.advanceGridAddedarray[this.advancerowIndex].nameofadvance = this.advanceForm.controls.advancetype.value;

      this.advanceGridAddedarray[this.advancerowIndex].advanceamount = this._commonService.removeCommasForEntredNumber(this.advanceForm.controls.advanceamount.value);

      this.advanceGridAddedarray[this.advancerowIndex].deductedfromdate = this.datepipe.transform(this.advanceForm.controls.effectedFrom.value,"yyyy-MM-dd");

      this.advanceGridAddedarray[this.advancerowIndex].deductedtodate = this.datepipe.transform(this.advanceForm.controls.effectedTo.value,"yyyy-MM-dd");

      this.advanceGridAddedarray[this.advancerowIndex].deductionperiod = this.datepipe.transform(this.advanceForm.controls.advancedeductionperiod.value,"yyyy-MM-dd");

      this.advanceGridAddedarray[this.advancerowIndex].deductionamount = this._commonService.removeCommasForEntredNumber(this.advanceForm.controls.advancedeductionamount.value);

      this.clearDataInAdvanceGridAdd();
      this.advancegridaddbtn = 'Add';
    }
  }


  removeAdvanceAddedGrid(event){
    debugger;
    const index: number = event.rowIndex;
    if (index !== -1) {
      this.advanceGridAddedarray.splice(index, 1);
      this.advanceGridAddedData = [...this.advanceGridAddedarray];
    }
  }


  clearDataInAdvanceGridAdd(){
    debugger;
    this.advanceForm.controls.advancetype.setValue('');
    this.advanceForm.controls.advanceamount.setValue('');
    this.advanceForm.controls.effectedFrom.setValue(this.currentdate);
    this.advanceForm.controls.effectedTo.setValue(this.currentdate2);
    this.advanceForm.controls.advancedeductionperiod.setValue('');
    this.advanceForm.controls.advancedeductionamount.setValue('');

    this.ErrorMessages.advancetype = '';
    this.ErrorMessages.advanceamount = '';
    this.ErrorMessages.advancedeductionperiod = '';
    this.ErrorMessages.effectedFrom = '';
    this.ErrorMessages.effectedTo = '';

  }


  calculateDeductionAmount() {
    // debugger;
    // let advanceamt = Number(this._commonService.removeCommasInAmount(this.advanceForm.controls.advanceamount.value));
    // let durationperiod = Number(this.advanceForm.controls.advancedeductionperiod.value);
    // if(durationperiod != 0){
    //   let value = advanceamt / durationperiod;
    //   value = parseFloat(parseFloat(value.toString()).toFixed(2));
    //   this.advanceForm.controls.advancedeductionamount.setValue(value);
    // }
    // else{
    //   this.advanceForm.controls.advancedeductionamount.setValue(advanceamt);
    // }
    debugger;
    let advanceamt = Number(this._commonService.removeCommasInAmount(this.advanceForm.controls.advanceamount.value));
    let durationperiod = Number(this.advanceForm.controls.advancedeductionperiod.value);
    let employeebasicamount = this.basicamount;
    let employeeallowanceamount = this.totallowanceamount;
    let deductionAmt = 0;

    if (this.grossSalary >= advanceamt) {
      if (advanceamt > 0 && durationperiod > 0) {
        durationperiod = Number(this.advanceForm.controls.advancedeductionperiod.value);
        deductionAmt = (advanceamt / durationperiod)
        deductionAmt = Math.round(deductionAmt);
        this.advanceForm.controls.advancedeductionamount.setValue(deductionAmt);
      }
      else
        this.advanceForm.controls.advancedeductionamount.setValue(deductionAmt);
      this.onDeductionPeriodChange();
    }
    else {
      this.advanceForm.controls.advancedeductionamount.setValue(deductionAmt);
      this.advanceForm.controls.advancedeductionperiod.setValue('');
      this.advanceForm.controls.advanceamount.setValue('');
      this._commonService.showWarningMessage('Loan/Advance Amount less than or equal to Gross Salary Amount.');
    }
  }


  onDeductionPeriodChange() {
    debugger;
    let deductperiod = parseInt(this.advanceForm.controls.advancedeductionperiod.value);
    if (deductperiod) {
      let dt: Date = (this.advanceForm.controls.effectedFrom.value);
      let newdate = new Date(dt.getFullYear(), dt.getMonth() + deductperiod, dt.getDate());
      this.advanceForm.controls.effectedTo.setValue(this.datepipe.transform(newdate,"MM/dd/yyyy"));
    }
  }


  validateFile(fileName) {
    try {
      debugger
      if (fileName == undefined || fileName == "") {
        return true
      }
      else {
        var ext = fileName.substring(fileName.lastIndexOf('.') + 1);
        if (ext.toLowerCase() == 'jpg' || ext.toLowerCase() == 'pdf' || ext.toLowerCase() == 'jpeg' || ext.toLowerCase() == 'doc') {
          return true
        }
      }
      return false
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }


  uploadAndProgress(event: any, files, formname) {
    debugger;
    var extention = event.target.value.substring(event.target.value.lastIndexOf('.') + 1);
    if (!this.validateFile(event.target.value)) {
      this._commonService.showWarningMessage("Upload jpg or png or pdf files");
    }
    else {
      let file = event.target.files[0];
      //this.imageResponse;

      if (event && file) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = e => {
          this.imageResponse = {
            name: file.name,
            fileType: "imageResponse",
            contentType: file.type,
            size: file.size,
          };
        };
      }

      let fname = "";

      if (files.length === 0) {
        return;
      }

      var size = 0;
      const formData = new FormData();

      for (var i = 0; i < files.length; i++) {
        size += files[i].size;
        fname = files[i].name;

        if (formname === 'Allowance') {
          this.allowancesForm2.controls.originalfilename.setValue(fname);
          formData.append(files[i].name, files[i]);
          formData.append('NewFileName', 'Employee Allowance' + '.' + files[i]["name"].split('.').pop());
        }

        if (formname === 'Adavance') {
          this.advanceForm2.controls.originalfilename.setValue(fname);
          formData.append(files[i].name, files[i]);
          formData.append('NewFileName', 'Employee Advance' + '.' + files[i]["name"].split('.').pop());
        }

        if (formname === 'Recoveries') {
          this.recoveriesForm2.controls.originalfilename.setValue(fname);
          formData.append(files[i].name, files[i]);
          formData.append('NewFileName', 'Employee Recoveries' + '.' + files[i]["name"].split('.').pop());
        }
      }

      size = size / 1024;

      this._commonService.fileUpload(formData).subscribe(data => {
        debugger;
        if (extention.toLowerCase() == 'pdf') {
          this.imageResponse.name = data[0];
        }
        else {

          this.FileName = data[1];
          this.imageResponse.name = data[1];
        }
        if (formname === 'Allowance') {
          this.allowancesForm.controls.filename.setValue(this.imageResponse.name);
        }
        if (formname === 'Adavance') {
          this.advanceForm.controls.filename.setValue(this.imageResponse.name);
        }
        if (formname === 'Recoveries') {
          this.recoveriesForm.controls.filename.setValue(this.imageResponse.name);
        }
      });
    }
  }


  allowanceChange(event){
    debugger;
    this.allowancesForm.controls.allowancetypeid.setValue(event.allowancetypeid);
  }


  SaveAllowanceDetails(){
    debugger;
    if(this.allowanceAddedGridData.length !=0){
      if(this.checkValidations(this.allowancesForm2,true)){
        debugger;
        let data = {
          "branchid": Number(this.pbranch_id),
          "employeecontactid": Number(this.employeeClickData.pContactId ),
          "allowancetypeid": Number(this.allowancesForm.controls.allowancetypeid.value),
          "allowancetype": this.allowancesForm.controls.allowancetype.value,
          "allowanceamount": Number(this._commonService.removeCommasForEntredNumber(this.allowancesForm.controls.allowanceamount.value)),
          "effectedfromdate": this.datepipe.transform(this.allowancesForm.controls.effectedfromdate.value,"yyyy-MM-dd"),
          "isrecurring": this.allowancesForm.controls.isrecurring.value,
          "typeofallowance": this.allowancesForm.controls.typeofallowance.value,
          "allowanceperiod": Number(this.allowancesForm.controls.allowanceperiod.value),
          "authorizedbyid": Number(this.allowancesForm2.controls.authorizedbyid.value),
          "filename": this.allowancesForm2.controls.originalfilename.value,
          "comments": this.allowancesForm2.controls.comments.value,
          "lstAllowance":this.allowanceAddedGridarray,
          "ptypeofoperation": "CREATE",
          "pCreatedby":this._commonService.pCreatedby,
        };

        console.log(data);

        this._emponrollser.SaveAllowanceDetails(data).subscribe(res =>{
          debugger;
          console.log(res);
          this._commonService.showInfoMessage('Successfully Saved !');


        this.GetAllowanceDetails();

        this.allowanceAddedGridData = [];
        this.allowanceAddedGridarray = [];

        this.allowancesForm2.controls.comments.setValue('');
        this.allowancesForm2.controls.originalfilename.setValue('');
        this.allowancesForm2.controls.authorizedbyid.setValue('');

        this.ErrorMessages.comments = '';
        this.ErrorMessages.authorizedbyid = '';
        },(error) =>{
          this._commonService.showErrorMessage(error);
        });

      }
    }
    else{
      this._commonService.showWarningMessage('Please Add Data To Grid !');
    }
  }


  recoveriesClick(){
    this.recoveriesShow = true;
    this.GetRecoveryDetails();
    this.GetSubInterducedDetails();
    this.GetRecoveryTypes();
    this.allowanceShow = false;
    this.advanceShow = false;
  }


  GetRecoveryTypes(){
    debugger;
    this._emponrollser.GetRecoveryTypes().subscribe(res =>{
      debugger;
      console.log(res);
      this.recoveriesTypesDDL = res;
    });
  }


  recoveryChange(event){
    debugger;
    this.recoveriesForm.controls.recoverytypeid.setValue(event.recoverytypeid);
  }


  recoveryGridAdd(){
    debugger;
    if(this.checkValidations(this.recoveriesForm,true)){
      debugger;
      if(this.recoverygridaddbtn == 'Add'){
        // this.recoveryAddedGridData = [];
        let data = {
          "recoverytype": this.recoveriesForm.controls.recoverytype.value,
          "recoverytypeid": this.recoveriesForm.controls.recoverytypeid.value,
          "sscminutesdate": this.sscminutesdate,
          "recoveryamount": Number(this._commonService.removeCommasForEntredNumber(this.recoveriesForm.controls.recoveryamount.value)),
          "typeofdeduction": this.recoveriesForm.controls.recoverydeductiontype.value,
          "deductionperiod": Number(this.recoveriesForm.controls.recoverydeductionperiod.value),
          "deductionamount": Number(this._commonService.removeCommasForEntredNumber(this.recoveriesForm.controls.recoverydeductionamount.value)),
          "deductedfromdate": this.datepipe.transform(this.recoveriesForm.controls.recoveryeffectedfrom.value,"yyyy-MM-dd"),

        };

        console.log(data);
        this.recoveryAddedGridarray.push(data);
        this.recoveryAddedGridData = [...this.recoveryAddedGridarray];

        this.clearDataInRecoveryGridAdd();

      }
      else if(this.recoverygridaddbtn == 'Update'){
        this.updateRecveryAddedGrid();
      }
    }
  }


  updateRecveryAddedGrid(){
    debugger;
    if(this.recoverygridaddbtn == 'Update'){
      debugger;
      this.recoveryrowIndex;
      this.recoveryAddedGridarray[this.recoveryrowIndex].recoverytype = this.recoveriesForm.controls.recoverytype.value;

      this.recoveryAddedGridarray[this.recoveryrowIndex].recoveryamount = this._commonService.removeCommasForEntredNumber(this.recoveriesForm.controls.recoveryamount.value);

      this.recoveryAddedGridarray[this.recoveryrowIndex].typeofdeduction = this.recoveriesForm.controls.recoverydeductiontype.value;

      this.recoveryAddedGridarray[this.recoveryrowIndex].deductionperiod = Number(this.recoveriesForm.controls.recoverydeductionperiod.value);

      this.recoveryAddedGridarray[this.recoveryrowIndex].deductionamount = this._commonService.removeCommasForEntredNumber(this.recoveriesForm.controls.recoverydeductionamount.value);

      this.recoveryAddedGridarray[this.recoveryrowIndex].deductedfromdate = this.datepipe.transform(this.recoveriesForm.controls.recoveryeffectedfrom.value,"yyyy-MM-dd");

      this.clearDataInRecoveryGridAdd();
      this.recoverygridaddbtn = 'Add';
    }
  }


  clearDataInRecoveryGridAdd(){
    debugger;
    this.recoveriesForm.controls.recoverytype.setValue('');
    this.recoveriesForm.controls.recoveryamount.setValue('');
    this.recoveriesForm.controls.recoverydeductiontype.setValue('');
    this.recoveriesForm.controls.recoverydeductionperiod.setValue('');
    this.recoveriesForm.controls.recoverydeductionamount.setValue('');
    this.recoveriesForm.controls.recoveryeffectedfrom.setValue('');

    this.ErrorMessages.recoverytype = '';
    this.ErrorMessages.recoveryamount = '';
    this.ErrorMessages.recoverydeductiontype = '';
    this.ErrorMessages.recoverydeductionperiod = '';
    this.ErrorMessages.recoveryeffectedfrom = '';
  }


  editRecoveryAddedGrid(event){
    debugger;
    this.recoveryrowIndex = event.rowIndex;
    this.recoverygridaddbtn = 'Update';
    console.log(event.dataItem.recoverytype);
    this.recoveriesForm.controls.recoverytype.setValue(event.dataItem.recoverytype);
    this.recoveriesForm.controls.recoveryamount.setValue(this._commonService.currencyformat(event.dataItem.recoveryamount));
    this.recoveriesForm.controls.recoverydeductiontype.setValue(event.dataItem.typeofdeduction);
    this.recoveriesForm.controls.recoverydeductionperiod.setValue(event.dataItem.deductionperiod);
    this.recoveriesForm.controls.recoverydeductionamount.setValue(this._commonService.currencyformat(event.dataItem.deductionamount));
    this.recoveriesForm.controls.recoveryeffectedfrom.setValue(new Date(event.dataItem.deductedfromdate));

  }


  removeRecoveryAddedGrid(event){
    debugger;
    const index: number = event.rowIndex;
    if (index !== -1) {
      this.recoveryAddedGridarray.splice(index, 1);
      this.recoveryAddedGridData = [...this.recoveryAddedGridarray];
    }
  }


  clearRecovery(){
    debugger;
    this.recoveriesForm.controls.recoverytype.setValue('');
    this.recoveriesForm.controls.recoveryamount.setValue('');
    this.recoveriesForm.controls.recoverydeductiontype.setValue('');
    this.recoveriesForm.controls.recoverydeductionperiod.setValue('');
    this.recoveriesForm.controls.recoverydeductionamount.setValue('');
    this.recoveriesForm.controls.recoveryeffectedfrom.setValue('');
    this.recoveriesForm.controls.recoverycomments.setValue('');
    this.recoveriesForm.controls.originalfilename.setValue('');
    this.recoveriesForm.controls.recoveryauthorizedby.setValue('');

    this.recoveryGridData = [];
    this.recoveryAddedGridarray = [];
    this.recoveryAddedGridData = [];

    this.clearDataInRecoveryGridAdd();

    this.ErrorMessages.recoverycomments = '';
    this.ErrorMessages.recoveryauthorizedby = '';
  }

  calculateRecoveriesDeductionAmount(){
    debugger;
    let recoveryamount = Number(this._commonService.removeCommasInAmount(this.recoveriesForm.controls.recoveryamount.value));
    let deductionperiod = Number(this.recoveriesForm.controls.recoverydeductionperiod.value);
    if(deductionperiod != 0){
    let deductionAmt = (recoveryamount / deductionperiod);
    deductionAmt = parseFloat(parseFloat(deductionAmt.toString()).toFixed(2));
    this.recoveriesForm.controls.recoverydeductionamount.setValue(deductionAmt);
    }
    else{
      this.recoveriesForm.controls.recoverydeductionamount.setValue(recoveryamount);
    }
  }


  SaveRecoveryDetails(){
    debugger;
    if(this.recoveryAddedGridData.length !=0){
      if(this.checkValidations(this.recoveriesForm2,true)){
        debugger;
        let data = {
          "branchid": Number(this.pbranch_id),
          "employeecontactid": Number(this.employeeClickData.pContactId),
          "recoverytypeid": Number(this.recoveriesForm.controls.recoverytypeid.value),
          "recoverytype": this.recoveriesForm.controls.recoverytype.value,
          "recoveryamount": Number(this._commonService.removeCommasForEntredNumber(this.recoveriesForm.controls.recoveryamount.value)),
          "deductedfromdate": this.datepipe.transform(this.recoveriesForm.controls.recoveryeffectedfrom.value,"yyyy-MM-dd"),
          "typeofdeduction": this.recoveriesForm.controls.recoverydeductiontype.value,
          "deductionperiod": Number(this.recoveriesForm.controls.recoverydeductionperiod.value),
          "authorizedbyid": Number(this.recoveriesForm2.controls.recoveryauthorizedby.value),
          "filename": this.recoveriesForm2.controls.originalfilename.value,
          "comments": this.recoveriesForm2.controls.recoverycomments.value,
          "sscminutesno":null,
          "sscminutesdate":this.sscminutesdate,
          "lstRecovery":this.recoveryAddedGridarray,
          "ptypeofoperation": "CREATE"
        };

        console.log(data);
        this._emponrollser.SaveRecoveryDetails(data).subscribe(res =>{
          debugger;
          console.log(res);
          this._commonService.showInfoMessage('Successfully Saved !');

          this.GetRecoveryDetails();

        this.recoveriesForm2.controls.recoverycomments.setValue('');
        this.recoveriesForm2.controls.originalfilename.setValue('');
        this.recoveriesForm2.controls.recoveryauthorizedby.setValue('');

        this.ErrorMessages.recoverycomments = '';
        this.ErrorMessages.recoveryauthorizedby = '';

        this.recoveryAddedGridData = [];
        this.recoveryAddedGridarray = [];
        },(error) =>{
          this._commonService.showErrorMessage(error);
        });




      }
    }
    else{
      this._commonService.showWarningMessage('Please Add Data To Grid !');
    }
  }


  GetAdvanceTypes(){
  debugger;
  this._emponrollser.GetAdvanceTypes().subscribe(res =>{
    debugger;
    console.log(res);
    this.advanceTypes = res;
   });
  }


  advanceChange(event){
    debugger;
    this.advanceForm.controls.advancetypeid.setValue(event.advancetypeid);
  }


  saveAdvanceDetails(){
    debugger;
    if(this.advanceGridAddedData.length != 0){
      if(this.checkValidations(this.advanceForm2,true)){
        debugger;
        let data = {
          "branchid": Number(this.pbranch_id),
          "employeecontactid": Number(this.employeeClickData.pContactId) ,
          "advancetypeid": Number(this.advanceForm.controls.advancetypeid.value),
          "nameofadvance": this.advanceForm.controls.advancetype.value,
          "advanceamount": Number(this._commonService.removeCommasForEntredNumber(this.advanceForm.controls.advanceamount.value)),
          "deductionamount": Number(this._commonService.removeCommasForEntredNumber(this.advanceForm.controls.advancedeductionamount.value)),
          "deductedfromdate": this.datepipe.transform(this.advanceForm.controls.effectedFrom.value,"yyyy-MM-dd"),
          "deductedtodate": this.datepipe.transform(this.advanceForm.controls.effectedTo.value,"yyyy-MM-dd"),
          "deductionperiod": Number(this.advanceForm.controls.advancedeductionperiod.value),
          "authorizedbyid": Number(this.advanceForm2.controls.advanceauthorizedbyid.value),
          "filename": this.advanceForm2.controls.originalfilename.value,
          "comments": this.advanceForm2.controls.advancecomments.value,
          "lstAdvance":this.advanceGridAddedarray,
          "ptypeofoperation": "CREATE"
        };

        console.log(data);
        this._emponrollser.SaveAdvanceDetails(data).subscribe(res =>{
          debugger;
          this._commonService.showInfoMessage('Successfully Saved !');
          console.log(res);


        this.GetAdvanceDetails();

        this.advanceForm2.controls.advancecomments.setValue('');
        this.advanceForm2.controls.advanceauthorizedbyid.setValue('');
        this.advanceForm2.controls.originalfilename.setValue('');

        this.ErrorMessages.advancecomments = '';
        this.ErrorMessages.advanceauthorizedbyid = '';

        this.advanceGridAddedData = [];
        this.advanceGridAddedarray = [];
        },(error) =>{
          this._commonService.showErrorMessage(error);
        });

      }
    }
    else{
      this._commonService.showWarningMessage('Please Add Data To Grid !');
    }
  }


  clearAdvance(){
    debugger;
    this.advanceForm.controls.advancecomments.setValue('');
    this.advanceForm.controls.originalfilename.setValue('');
    this.advanceForm.controls.advanceauthorizedbyid.setValue('');
    this.advanceForm.controls.advancetype.setValue('');
    this.advanceForm.controls.advanceamount.setValue('');
    this.advanceForm.controls.effectedFrom.setValue(this.currentdate);
    this.advanceForm.controls.effectedTo.setValue(this.currentdate2);
    this.advanceForm.controls.advancedeductionperiod.setValue('');
    this.advanceForm.controls.advancedeductionamount.setValue('');

    this.advanceGridData = [];
    this.advanceGridAddedarray = [];
    this.advanceGridAddedData = [];

    this.clearDataInAdvanceGridAdd();

    this.ErrorMessages.advancecomments = '';
    this.ErrorMessages.advanceauthorizedbyid = '';
  }


  clearAllowanceDetails(){
    debugger;
    this.allowancesForm.controls.allowancetype.setValue('');
    this.allowancesForm.controls.allowanceamount.setValue('');
    this.allowancesForm.controls.effectedfromdate.setValue('');
    this.allowancesForm.controls.typeofallowance.setValue('');
    this.allowancesForm.controls.allowanceperiod.setValue('');
    this.allowancesForm2.controls.comments.setValue('');
    this.allowancesForm2.controls.originalfilename.setValue('');
    this.allowancesForm2.controls.authorizedbyid.setValue('');
    this.allowancesForm.controls.isrecurring.setValue(true);

    this.allowanceAddedGridData = [];
    this.allowanceAddedGridarray = [];
    this.allowanceGridData = [];

    this.clearDataInAllowanceGridAdd();

    this.ErrorMessages.comments = '';
    this.ErrorMessages.authorizedbyid = '';
  }


  closemodel(){
    debugger;
    this.employeeClickName = "";
    this.employeeClickDesignation = "";
    this.contact_id = null;
    this.employeeClickData = null;
    this.basicamount = null;
    this.totallowanceamount = null;
    this.sscminutesdate = null;
    this.allowanceAddedGridData = [];
    this.allowanceAddedGridarray = [];
    this.recoveryAddedGridData = [];
    this.recoveryAddedGridarray = [];
    this.advanceGridAddedData = [];
    this.advanceGridAddedarray = [];
    this.allowancesForm.reset();
    this.allowancesForm2.reset();
    this.advanceForm.reset();
    this.advanceForm2.reset();
    this.advanceForm.controls.effectedFrom.setValue(this.currentdate);
    this.advanceForm.controls.effectedTo.setValue(this.currentdate2);
    this.recoveriesForm.reset();
    this.recoveriesForm2.reset();
    this.ErrorMessages = {};
    $('#employeeonrollDetails').modal('hide');
    this.getEmployeeDetails();
  }

}

