import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, ControlContainer } from '@angular/forms';
import { CommonService } from '../../../Services/common.service';
import { Router, Route } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { State, process } from '@progress/kendo-data-query';
import { DataBindingDirective, slice } from '@progress/kendo-angular-grid';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { GenerateidService } from '../../../Services/Settings/generateid.service';
declare let $: any
@Component({
  selector: 'app-generateid-master',
  templateUrl: './generateid-master.component.html',
  styles: []
})
export class GenerateidMasterComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;

  constructor(private fb: FormBuilder, private _CommonService: CommonService, private _GenerateidService: GenerateidService, private router: Router, private toastr: ToastrService, private _routes: Router) { }
  GenerateIdForm: FormGroup;
  FormNamesData: any;
  ModeofTransactionData: any;
  GenerateIdData: any;
  TempGenerateIdData: any;
  ModeofTransactions: any;
  FormName: any;
  hideModeofTransaction = true;
  submitted = false;
  disablesavebutton = false;
  savebutton = "Save";
  SericeReset: any[];
 
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10
  };
  ngOnInit() {
    this.submitted = false;
    this.GenerateIdData = [];
    this.GenerateIdForm = this.fb.group({
      pFormName: ['', Validators.required],
      pTransactionModeId: ['', Validators.required],
      pTransactionModeName:[''],
      pTransactionCode: ['', Validators.required],
      pTransactionSerice: ['', Validators.required],
      pSericeReset: ['', Validators.required],
      
    });
    this.GenerateIdForm.controls.pSericeReset.setValue('No');
    this.GetSericeReset();
    this.GetGenerateIdMasterList();
  
  //  this.GetFormNames();
  }
  get errorsGenerateIdForm() { return this.GenerateIdForm.controls; }
 

  GetGenerateIdMasterList() {
    debugger;
    this._GenerateidService.GetGenerateidmasterList().subscribe(data => {
      debugger;
      this.GenerateIdData = data;
      this.TempGenerateIdData = JSON.parse(JSON.stringify(this.GenerateIdData));
      
      this.GenerateIdData.filter(function (df) { df.pStatus = false; });
      
    });
  }
 
  GetSericeReset() {
    debugger;
    this.SericeReset = [{ text: 'Financial Year', value: "Financial Year" }, { text: 'Calendar Year', value: "Calendar Year" }, { text: 'NO', value: "NO" }];
  }
 

  showErrorMessage(errormsg: string) {
    this._CommonService.showErrorMessage(errormsg);
  }

  showInfoMessage(errormsg: string) {
    this._CommonService.showInfoMessage(errormsg);
  }
 
  public removeHandler({ dataItem }) {

    const index: number = this.GenerateIdData.indexOf(dataItem);
    if (index !== -1) {
      this.GenerateIdData.splice(index, 1);
    }

  }
  ModeofTransaction_Change($event: any): void {
    debugger;
    const Recordid = $event.target.value;
    const TransactionmodeName = $event.target.options[$event.target.selectedIndex].text;
    this.GenerateIdForm.controls.pTransactionModeName.setValue(TransactionmodeName);
  }
  saveGenerateIdmaster() {
    debugger;
    this.disablesavebutton = true;
    this.savebutton = 'Processing';
   // if (this.validatesaveGenerateIdmaster()) {

    try {
      let filterdata = this.GenerateIdData.filter(itm => itm.pStatus === true);
      if (filterdata.length > 0) {
        let newdata = { pGenerateidMasterlist: filterdata };
        let data = JSON.stringify(newdata);
        this._GenerateidService.SaveGenerateIdMaster(data).subscribe(res => {

          if (res) {
            this.disablesavebutton = false;
            this.savebutton = 'Save';
            this._CommonService.showInfoMessage("Saved sucessfully");
            this.GetSericeReset();
            this.GetGenerateIdMasterList();
          }


        },
          (error) => {
            //this.isLoading = false;
            this._CommonService.showErrorMessage(error);
            this.disablesavebutton = false;
            this.savebutton = 'Save';
          });
      }
      else {
        this.disablesavebutton = false;
        this.savebutton = 'Save';
      }
      } catch (e) {
      this.disablesavebutton = false;
      this.savebutton = 'Save';
      }
   // }
    //else {
    //  this.disablesavebutton = false;
    //  this.savebutton = 'Save';
    //}

  }
  validatesaveGenerateIdmaster(): boolean {

    let isValid: boolean = true;

    try {
     
      if (this.GenerateIdData.length > 0) {
        isValid = true;
      }
      else {
        // this.AddGenerateIdlist();
        this.submitted = true;
        isValid = false;
      }
    } catch (e) {
      this._CommonService.showErrorMessage(e);
    }

    return isValid;
  }
  GridCell_Chnage($event,dataItem,index) {
    debugger;
    let Value = $event.currentTarget.value;
    this.GenerateIdData[index].pTransactionCode;


  }
  Code_Change($event, dataItem, rowindex) {
    debugger;
    let TransactionCode = $event.currentTarget.value;
    let count;
    if (TransactionCode != '') {

      if (this.TempGenerateIdData[rowindex].pTransactionCode.toUpperCase() != TransactionCode.toUpperCase()) {
        this._GenerateidService.checkTransactionCodeExist(TransactionCode.toUpperCase()).subscribe(res => {
          debugger;
          count = res;
          if (count > 0) {
            this.showErrorMessage("Transaction Code Already Exist");
            $("#TransactionCode_" + rowindex).val(this.TempGenerateIdData[rowindex].pTransactionCode.toUpperCase());
            this.GenerateIdData[rowindex].pTransactionCode = this.TempGenerateIdData[rowindex].pTransactionCode.toUpperCase();
            this.setStatus(rowindex);
          }
          else {
            this.GenerateIdData[rowindex].pTransactionCode = TransactionCode.toUpperCase();
            this.setStatus(rowindex);
          }
        });
      }
      else {
        this.GenerateIdData[rowindex].pTransactionCode = this.TempGenerateIdData[rowindex].pTransactionCode.toUpperCase();
        this.setStatus(rowindex);
      }
      //
    }
    else {


      $("#TransactionCode_" + rowindex).val(this.TempGenerateIdData[rowindex].pTransactionCode.toUpperCase());
      this.GenerateIdData[rowindex].pTransactionCode = this.TempGenerateIdData[rowindex].pTransactionCode.toUpperCase();
    }
  }

  Serice_Change($event, dataItem, rowindex) {
    debugger;
    let TransactionSerice = $event.currentTarget.value;
    if (TransactionSerice == '') {
      $event.currentTarget.value = this.TempGenerateIdData[rowindex].pTransactionSerice;
      this.setStatus(rowindex);
    }
    else {
      this.GenerateIdData[rowindex].pTransactionSerice = TransactionSerice;
      this.setStatus(rowindex);
    }
  }
  SericeReset_Change($event, dataItem, rowindex) {
    debugger;
    let SericeReset = $event.currentTarget.value;
    if (this.TempGenerateIdData[rowindex].pSericeReset != SericeReset) {
      this.GenerateIdData[rowindex].pSericeReset = SericeReset;
      this.setStatus(rowindex);
    }
    else {
      this.GenerateIdData[rowindex].pSericeReset = this.TempGenerateIdData[rowindex].pSericeReset;
      this.setStatus(rowindex);
    }

  }
  setStatus(rowindex) {
    if (this.GenerateIdData[rowindex].pTransactionCode.toUpperCase() == this.TempGenerateIdData[rowindex].pTransactionCode.toUpperCase() && this.GenerateIdData[rowindex].pTransactionSerice == this.TempGenerateIdData[rowindex].pTransactionSerice && this.GenerateIdData[rowindex].pSericeReset.toUpperCase() == this.TempGenerateIdData[rowindex].pSericeReset.toUpperCase()) {
      this.GenerateIdData[rowindex].pStatus = false;
    }
    else {
      this.GenerateIdData[rowindex].pStatus = true;
    }
  }

   //GetFormNames() {
  //  debugger;
  //  this._GenerateidService.GetFormNames().subscribe(data => {
  //    debugger;
  //    this.FormNamesData = data;
  //  });
  //}
   //SelectModeofTransaction(event: any) {
  //  debugger;
  //  this.FormName = event.target.value;
  //  this._GenerateidService.GetModeOfTransaction(this.FormName).subscribe(data => {
  //    debugger;
  //    this.ModeofTransactionData = data;
  //    if (this.ModeofTransactionData.length > 0) {
  //      this.hideModeofTransaction = true;

  //      this.GenerateIdForm.controls.pTransactionModeId.setValidators(Validators.required);

  //    }
  //    else {

  //      this.GenerateIdForm.controls.pTransactionModeId.clearValidators();
  //      this.GenerateIdForm.controls.pTransactionModeId.updateValueAndValidity();
  //      this.hideModeofTransaction = false;
  //    }
  //  });
  //}
  //AddGenerateIdlist() {
  //  debugger;
  //  this.submitted = true;
  //  if (this.validateaddAddGenerateIdlist()) {

  //    // const control = <FormGroup>this.GenerateIdForm['controls']['ppaymentsslistcontrols'];
  //    this.GenerateIdData.push(this.GenerateIdForm.value)
  //    this.clearGenerateidDetails();
  //  }
  //}

   //validateaddAddGenerateIdlist(): boolean {

  //  let isValid: boolean = true;

  //  try {
  //    isValid = this.GenerateIdForm.valid;
  //    let Formname = this.GenerateIdForm.controls.pFormName.value;
  //    let TransactionMode = this.GenerateIdForm.controls.pTransactionModeName.value;
  //    let TransactionCode = this.GenerateIdForm.controls.pTransactionCode.value;

  //    let griddata = this.GenerateIdData;

  //    let count = 0;


  //    for (let i = 0; i < griddata.length; i++) {
  //      if (griddata[i].pFormName == Formname && griddata[i].pTransactionModeName == TransactionMode && griddata[i].pTransactionCode == TransactionCode) {
  //        count = 1;
  //        break;
  //      }

  //    }
  //    if (count == 1) {
  //      this._CommonService.showWarningMessage('FormName, Mode Of Transaction,Transaction Code  already exists in grid');
  //      isValid = false;
  //    }
  //  } catch (e) {
  //    this._CommonService.showErrorMessage(e);
  //  }

  //  return isValid;
  //}

  //clearGenerateidDetails() {

  //  this.GenerateIdForm.reset();
  //  this.GenerateIdForm.updateValueAndValidity();

  //  this.submitted = false;
  //  this.GenerateIdForm.controls.pSericeReset.setValue('No');
  // // this.GenerateIdForm.setValue({ "pFormname": "", "pModeofTransaction": "", "pTransactionCode": "", "pTransactionSerice": "", "pSericeReset": "NO"})   
  ////  this.errorsGenerateIdForm = {};

  //}
   //CheckTransactionCodeExist(code): boolean {
  //  debugger;
  //  let isValid: boolean = true;
  //  let count;
  //  if (code != "") { 
  //    this._GenerateidService.checkTransactionCodeExist(code).subscribe(res => {
  //    count = res;
  //    if (count > 0) {
  //      this.showErrorMessage("Transaction Code Already Exists");
  //      //this.GenerateIdForm.controls.pTransactionCode.setValue('');
  //      isValid = true;
  //    }
  //  });
  //  }
  //  return isValid;
  //}
}
