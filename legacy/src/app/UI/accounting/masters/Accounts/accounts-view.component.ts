import { Component, ViewChild, OnInit,ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder,Validators } from '@angular/forms';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { AccountingMastresService } from '../../../../Services/Accounting/accounting-mastres.service';
import { AccountsMasterComponent } from './accounts-master.component';
import { CommonService } from 'src/app/Services/common.service';
import { forkJoin } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
declare let $: any
@Component({
  selector: 'app-accounts-view',
  templateUrl: './accounts-view.component.html',
  styles: []
})
export class AccountsViewComponent implements OnInit {
  @ViewChild(ContextMenuComponent, { static: false }) public basicMenu: ContextMenuComponent;
  AccountTreeForm: FormGroup;
  button = "Save";
  AccountTreeFormErrorMessages: any;
  isGstNotApplicableFlag: boolean = true;
  disablegst: boolean;
  showOrHideAccounTreeGrid: boolean = false;
  showOrHideAccounTreesearchGrid: boolean = false;
  treeData: any;
  tempTreeData: any = [];
  searchTreeData: any;
  tdssectionlist: any;
  gstPercentagesList: any;
  ShowHideMenuItem: boolean;
  Accountmaster: any;
  AccountmasterSavingDetails: any;
  MainAccountHeadName: any;
  HeadName: any;
  AccountLedgerChecked: any;
  GroupChecked: any;
  subledgergriddata: any;
  subledgergriddatatemp:any;
  showsubledgergrid: boolean = true;
  showInclude: boolean = false;
  showExclude: boolean = false;
  showgst: boolean = false;
  showtds: boolean = false;
  disablesavebutton = false;
  isLoading: boolean = false;
  public currencysymbol: any;
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  constructor(private _CommonService: CommonService,private formbuilder: FormBuilder,private _Accountingmasterservice: AccountingMastresService, private cd: ChangeDetectorRef) { 
    this.ShowHideMenuItem = false;
    this.Accountmaster = {};
    this.AccountmasterSavingDetails = { parent_id: "", ChailsorSibling: "", chracc_type: "", account_id: "", account_name: "", account_balance: "" }

    //this.currencysymbol = this._CommonService.datePickerPropertiesSetup("currencysymbol");
    this.dpConfig.dateInputFormat = 'DD/MM/YYYY';
    this.dpConfig.containerClass = 'theme-dark-blue';
    // this.dpConfig.minDate = new Date();
    this.dpConfig.maxDate = new Date();
    this.dpConfig.showWeekNumbers = false;
  }
 
  ngOnInit() {
    this.AccountTreeFormErrorMessages = {};
    this.isGstNotApplicableFlag = true;
    this.disablegst = false;
    this.AccountTreeForm = this.formbuilder.group({
      pAccountname: ['', Validators.required],
      pOpeningamount: [''],
      pOpeningdate: [new Date(), Validators.required],
      pChracctype: ['', Validators.required],
      pParentId: [''],
      pParrentAccountname: [''],
      pFormtype: [''],
      pOpeningBalanceType: ['Debit'],
      pCreatedby: [this._CommonService.pCreatedby],
      schema: [''],
      pisgstapplicable: [false],
      pgsttype: [''],
      pgstpercentage: [''],
      pistdsapplicable: [false],
      ptdscalculationtype: [''],
      pRecordId: [''],
    });
     this.BlurEventAllControll(this.AccountTreeForm)
     this.BindAccountTree();
     this.getTDSsectiondetails();

    this._Accountingmasterservice.getGstPercentages().subscribe(result => {
      debugger;
      this.gstPercentagesList = result
      if (this.gstPercentagesList.length == 1) {
        this.AccountTreeForm.controls.pgstpercentage.setValue(this.gstPercentagesList[0].gstpercentage)
      }
    });
  }
  BindAccountTree() {
    debugger;
    let AccountTree = this._Accountingmasterservice.GetAccountTree();
    forkJoin([AccountTree]).subscribe(results => {
      debugger;
      this.showOrHideAccounTreeGrid = true;
      this.showOrHideAccounTreesearchGrid = false;
      this.treeData = results[0];
      this.tempTreeData = results[0];
      this.searchTreeData = results[0];
    });
  }
  getTDSsectiondetails(): void {
    this._Accountingmasterservice.getTDSsectiondetails().subscribe(
      (json) => {
        if (json != null) {
          console.log("TDS", json)
          this.tdssectionlist = json;
        }
      },
      (error) => {
        this._CommonService.showErrorMessage(error);
      }
    );
  }


  public ShoeSiblings(item: any): boolean {
    let status;
    if (item.parent_id == "") { status = false; } else { status = true; }
    return status;
  }
  public ShowChild(item: any): boolean {
    let status
    if (item.subcategorycreationstatus == true) { status = true; } else { status = true; } return status;
  }
  returnClass2(data, index) {

    if (data.chracc_type == '1') {
      return 'caret text-danger';
    } else {
      return 'caret text-info'
    }
    // if (TdataSecond.children[index].children !== undefined) {
    //   if (TdataSecond.chracc_type == '1') {
    //     return 'caret text-danger';
    //   } else {
    //     return 'caret text-info'
    //   }
    // } else {
    //   return ''
    // }

    // return (TdataSecond.children[index].children !== undefined) ? 'caret text-danger' : ''

  }
  returnClass22(TdataSecond, index) {

    if (TdataSecond.chracc_type == '1') {
      return 'text-danger';
    } else {
      return 'text-info'
    }
  }
  returnClass3(TdataSecond, index) {
    if (TdataSecond.chracc_type == '1') {
      return 'caret text-danger';
    } else {
      return 'caret text-info'
    }
  }
  returnClass33(TdataSecond, index) {
    if (TdataSecond.chracc_type == '1') {
      return 'text-danger';
    } else {
      return 'text-info'
    }
  }
  returnClass4(TdataSecond, index) {
    if (TdataSecond.chracc_type == '1') {
      return 'caret text-danger';
    } else {
      return 'caret text-info'
    }
  }
  returnClass44(TdataSecond, index) {
    if (TdataSecond.chracc_type == '1') {
      return 'text-danger';
    } else {
      return 'text-info'
    }
  }
  ActivateClass(event) {
    debugger;
    event.currentTarget.parentElement.querySelector(".nested").classList.toggle("active");

    let a = event.currentTarget.classList.toggle("caret-down");
    event.currentTarget.classList.toggle("caret-down");
  }
 
  ngAfterViewInit() {
    this.cd.detectChanges();
  }
  trackByFn(index, item) {
    return index; // or item.id
  }
  GetAcctype(): string {
    let acctype;
    if (this.AccountmasterSavingDetails.chracc_type == "1" && this.AccountmasterSavingDetails.ChailsorSibling != "Sibling") {
      acctype = this.AccountTreeForm['controls']['pChracctype'].value;
    }
    if (this.AccountmasterSavingDetails.chracc_type == "2" && this.AccountmasterSavingDetails.ChailsorSibling !== "Sibling") {
      acctype = "3";
    }
    if (this.AccountmasterSavingDetails.ChailsorSibling == "Sibling") {
      acctype = this.AccountmasterSavingDetails.chracc_type;
    }
    return acctype;
  }
  OpenModelpopup(data: any, ChailsorSibling) {
    debugger;
    this.AccountTreeForm.controls.pOpeningBalanceType.setValue("DEBIT");
    this.MainAccountHeadName = data.item.main_accountname;
    let checkTwotypecount = 0;
    if (ChailsorSibling != "Sibling") { this.HeadName = data.item.account_name } else { this.HeadName = data.item.parent_account_name }
    this.Accountmaster.showopeningbalance = (data.item.chracc_type == '1' && (ChailsorSibling == "Sibling")) ? false : true;

    if ((data.item.chracc_type == '1' || data.item.chracc_type == '2') && ChailsorSibling == "Child") {
      if (data.item.children !== undefined) {
        let newData = data.item.children
        newData.filter(function(x) {
          debugger;
          if (x.parent_id == data.item.account_id && x.chracc_type == 2) {
            checkTwotypecount++;
          }
        });
        if (checkTwotypecount > 0 && newData.length > 0 && (data.item.chracc_type == '1' || data.item.chracc_type == '2')) {

          this.AccountTreeForm.patchValue({ 'pChracctype': "2" });
          this.Accountmaster.showopeningbalance = true;
          this.AccountLedgerChecked = "2";
          this.Accountmaster.showaccledger = true;
          this.Accountmaster.showaccgroup = false;
          this.Isseleted();
        }
        if (checkTwotypecount == 0 && newData.length == 0 && data.item.chracc_type == '2') {

          this.AccountTreeForm.patchValue({ 'pChracctype': "2" });
          this.Accountmaster.showopeningbalance = true;
          this.AccountLedgerChecked = "2";
          this.Accountmaster.showaccledger = true;
          this.Accountmaster.showaccgroup = false;
          this.Isseleted();
        }
        if (checkTwotypecount == 0 && newData.length == 0 && data.item.chracc_type == '1') {
          this.AccountTreeForm.patchValue({ 'pChracctype': "1" });
          this.GroupChecked = "1";
          this.Accountmaster.showaccledger = true;
          this.Accountmaster.showaccgroup = true;
          this.Isseleted();
        }
        if (checkTwotypecount == 0 && newData.length > 0 && data.item.chracc_type == '1') {
          this.GroupChecked = "1";
          this.AccountTreeForm.patchValue({ 'pChracctype': "1" });
          this.Accountmaster.showaccledger = false;
          this.Accountmaster.showaccgroup = true;
          this.Isseleted();
        }

      }
    }
    if ((data.item.chracc_type == '1' || data.item.chracc_type == '2') && ChailsorSibling == "Sibling") {
      if (data.item.chracc_type == '1') {
        this.GroupChecked = "1";
        this.AccountTreeForm.patchValue({ 'pChracctype': "1" });
        this.Accountmaster.showaccledger = false;
        this.Accountmaster.showaccgroup = true;
        this.Isseleted();
      }
      if (data.item.chracc_type == '2') {
        this.AccountTreeForm.patchValue({ 'pChracctype': "2" });
        this.Accountmaster.showopeningbalance = true;
        this.AccountLedgerChecked = "2";
        this.Accountmaster.showaccledger = true;
        this.Accountmaster.showaccgroup = false;
        this.Isseleted();
      }
    }


    if (data.item.chracc_type == '2' && ChailsorSibling == "Child") {
      this.AccountTreeForm.patchValue({ 'pChracctype': "2" });
      this.GetSubLedgerdata(data.item.account_id)
      this.showsubledgergrid = true;
    }

    this.AccountmasterSavingDetails = { parent_id: data.item.parent_id, ChailsorSibling: ChailsorSibling, chracc_type: data.item.chracc_type, account_id: data.item.account_id, account_name: data.item.account_name, account_balance: data.item.account_balance }
    $('#add-detail').modal('show');

  }
 
  GetSubLedgerdata(ledgerid) {
    debugger
    this.subledgergriddata = [];
    this.subledgergriddatatemp=[];
    //this.Accounting.GetSubLedgerdata(ledgerid, branchschema).subscribe(result => {
      this._Accountingmasterservice.GetSubLedgerData(ledgerid).subscribe(result => {
       this.subledgergriddatatemp= result;
       this.subledgergriddata =[... this.subledgergriddatatemp];
    })
    debugger
  }
  Isseleted() {
    debugger;
    let rdbchracctype = this.AccountTreeForm.controls.pChracctype.value;
    if (rdbchracctype == "1") {
      this.Accountmaster.showopeningbalance = false;
      this.AccountTreeForm.controls.pOpeningamount.setValidators(null);
      this.AccountTreeForm.controls.pOpeningamount.clearValidators();
      this.AccountTreeForm.controls.pOpeningamount.updateValueAndValidity();
      this.closeModel("clearonly");
    }
    else {
      this.Accountmaster.showopeningbalance = true;
      this.AccountTreeForm.controls.pOpeningamount.setValidators(Validators.required);
      this.closeModel("clearonly");
    }

  }

  get formcontrols() { return this.AccountTreeForm.controls; }

  taxTypeChange(type) {
    debugger;
    try {
      if (type == 'Include') {
        this.AccountTreeForm.controls.pgsttype.setValue("I");
        this.showInclude = true;
        this.showExclude = false;
        this.AccountTreeForm.controls.pgstpercentage.setValue("");
        this.AccountTreeForm.controls.pgstpercentage.setValidators([Validators.required]);
        this.AccountTreeForm.controls.pgstpercentage.updateValueAndValidity();
        this.AccountTreeFormErrorMessages = {};
        this._Accountingmasterservice.getGstPercentages().subscribe(result => {
          debugger;
          this.gstPercentagesList = result
          if (this.gstPercentagesList.length == 1) {
            this.AccountTreeForm.controls.pgstpercentage.setValue(this.gstPercentagesList[0].gstpercentage)
          }
        })
      }
      else if (type == 'Exclude') {
        this.AccountTreeForm.controls.pgsttype.setValue("E");
        this.AccountTreeForm.controls.pgstpercentage.setValue("");
        this.showInclude = false;
        this.showExclude = true;
        this.AccountTreeFormErrorMessages = {};
      }
    }
    catch (e) {
      // this.showErrorMessage(e);
    }
  }
  isGstApplicableOrNot(event) {
    debugger
    let checked = event.target.checked;
    if (checked == true) {
      this.showgst = true;
      this.AccountTreeForm.controls.pisgstapplicable.setValue(checked);
      this.AccountTreeForm.controls.pgsttype.setValue("E");
      this.showInclude = false;
      this.showExclude = true;

      this.AccountTreeForm.controls.pgstpercentage.setValidators([Validators.required])
      this.AccountTreeForm.controls.pgstpercentage.updateValueAndValidity();
      this.BlurEventAllControll(this.AccountTreeForm);
      this.AccountTreeFormErrorMessages = {};

    } else {
      this.showgst = false;
      this.AccountTreeForm.controls.pisgstapplicable.setValue(checked);
      this.AccountTreeForm.controls.pgstpercentage.setValue("");
      this.AccountTreeForm.controls.pgstpercentage.clearValidators();
      this.AccountTreeForm.controls.pgstpercentage.updateValueAndValidity();

      this.AccountTreeForm.controls.pgstpercentage.clearValidators();
      this.AccountTreeForm.controls.pgstpercentage.updateValueAndValidity();
      this.BlurEventAllControll(this.AccountTreeForm);
      this.AccountTreeFormErrorMessages = {};
    }
  }
  isTdsApplicableOrNot(event) {
    debugger
    let checked = event.target.checked;
    if (checked == true) {
      this.showtds = true;
      this.AccountTreeForm.controls.ptdscalculationtype.setValue("I");
      this.AccountTreeForm.controls.pRecordId.setValue("");

      this.AccountTreeForm.controls.pRecordId.setValidators([Validators.required])
      this.AccountTreeForm.controls.pRecordId.updateValueAndValidity();
      this.BlurEventAllControll(this.AccountTreeForm);
      this.AccountTreeFormErrorMessages = {};
    } else {
      this.showtds = false;

      this.AccountTreeForm.controls.pRecordId.clearValidators();
      this.AccountTreeForm.controls.pRecordId.updateValueAndValidity();
      this.BlurEventAllControll(this.AccountTreeForm);
      this.AccountTreeFormErrorMessages = {};
    }
  }

  tdsTaxTypeChange() {
    this.AccountTreeForm.controls.pRecordId.setValue("");
    this.AccountTreeFormErrorMessages = {};
  }

  closeModel(type) {
    debugger;
    if (type != "clearonly") {
      $("#add-detail").modal("hide");
    }

    this.AccountTreeForm.controls.pAccountname.setValue("");
    this.AccountTreeForm.controls.pOpeningamount.setValue("");
    this.AccountTreeForm.controls.pRecordId.setValue("");

    this.AccountTreeForm.controls.pisgstapplicable.setValue(false);
    this.AccountTreeForm.controls.pgstpercentage.setValue("");
    this.AccountTreeForm.controls.pistdsapplicable.setValue(false);
    this.AccountTreeForm.controls.ptdscalculationtype.setValue("");
    this.AccountTreeForm.controls.pRecordId.setValue("")
    this.showgst = false;
    this.showtds = false;
    this.AccountTreeFormErrorMessages = {};
  }
  
  onSearch(event) {
    debugger;
    let searchText = event.target.value.toString();
    if (searchText != "") {
      let columnName = "account_name";

      let AccountTree = this._Accountingmasterservice.GetAccountTreeSearch(searchText);
      forkJoin([AccountTree]).subscribe(results => {
        debugger;

        this.showOrHideAccounTreeGrid = false;
        this.showOrHideAccounTreesearchGrid = true;
        this.searchTreeData = results[0];
        // $(".nested").css("display", "block");

      });
      // document.getElementsByClassName(".nested")
      // event.currentTarget.parentElement.querySelector(".nested").styles.disp ="block";
      // this.Searchtransform(this.searchTreeData, searchText, columnName);
    }
    else {
      // $(".nested").css("display", "none");
      this.showOrHideAccounTreeGrid = true;
      this.showOrHideAccounTreesearchGrid = false;
      // this.sortedData = [];
      // this.treeData = this.tempTreeData;

    }
  }
 
  


  



  SaveAccountHeads() {

    debugger;

    if (this.AccountTreeForm.controls.pOpeningamount.value == "") {
      this.AccountTreeForm.controls.pOpeningamount.setValue(0);
    }

    let isValid = true;
    if (this.checkValidations(this.AccountTreeForm, isValid)) {
      if (this.AccountTreeForm.valid) {
        let Parentid = this.AccountmasterSavingDetails.ChailsorSibling == "Sibling" ? this.AccountmasterSavingDetails.parent_id : this.AccountmasterSavingDetails.account_id;
        let acctype = this.GetAcctype();
        this.AccountTreeForm.patchValue({ pParentId: Parentid, pFormtype: this.AccountmasterSavingDetails.ChailsorSibling, pChracctype: acctype })

        let Accountname = this.AccountTreeForm.value["pAccountname"];
        this.AccountTreeForm.controls.schema.setValue('');

        this._Accountingmasterservice.CheckAccountnameDuplicate(Accountname, acctype, Parentid).subscribe(count => {
          debugger;
          if (count > 0) {
            this.AccountTreeForm.controls.pAccountname.setValue("");
            this.AccountTreeForm.controls.pOpeningamount.setValue("")
            this._CommonService.showWarningMessage("Duplicate A/C  Ledger Or Sub Ledger Are Not Allowed")
          }
          else {
            if (confirm("Do you want to save ?")) {
            if (this.AccountTreeForm.controls.pOpeningamount.value == null || this.AccountTreeForm.controls.pOpeningamount.value == "") {
              this.AccountTreeForm.controls.pOpeningamount.setValue(0);
            } else {
              let openingamount = this.AccountTreeForm.controls.pOpeningamount.value
              this.AccountTreeForm.controls.pOpeningamount.setValue(this._CommonService.removeCommasInAmount(openingamount));
            }
            this.AccountTreeForm.controls.pRecordId.setValue(0);

            this.AccountTreeForm['controls']['pCreatedby'].setValue(this._CommonService.pCreatedby);
          
              this.button = "Processing";
              this.isLoading = true;
              this.disablesavebutton = true;
              let data = JSON.stringify(this.AccountTreeForm.value);
              this._Accountingmasterservice.SaveAccountsNew(data).subscribe(res => {
                if (res) {
                  this.BindAccountTree();
                  this.closeModel("clearandclose");
                  this._CommonService.showInfoMessage("Saved sucessfully");
                //this._CommonService.showWarningMessage("Saved sucessfully")
                  this.button = "Save";
                  this.isLoading = false;
                  this.disablesavebutton = false;
                }
              }, err => {

                this.button = "Save";
                this.isLoading = false;
                this.disablesavebutton = false;
              });
            }

          }

        });

      }
    } else {
      this.AccountTreeForm.controls.pOpeningamount.setValue("");
    }

  }






/**
   *  Validation Checking Methods Start
   */
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
          this.AccountTreeFormErrorMessages[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                lablename = (document.getElementById(key) as HTMLInputElement).title;
                errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.AccountTreeFormErrorMessages[key] += errormessage + ' ';
                isValid = false;
              }
            }
          }
        }
      }
    }
    catch (e) {
      // this.showErrorMessage(e);
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
  /**
   * Validation Checking Methods End
   */


}
