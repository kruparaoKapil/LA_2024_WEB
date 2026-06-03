import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AccountingMastresService } from '../../../../Services/Accounting/accounting-mastres.service';
import { TreeviewModule, TreeviewItem } from 'ngx-treeview';
import { forkJoin } from 'rxjs';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { isNullOrUndefined } from 'util';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountingTransactionsService } from '../../../../Services/Accounting/accounting-transactions.service';
import { CommonService } from '../../../../Services/common.service';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
declare let $: any
@Component({
  selector: 'app-account-tree',
  templateUrl: './account-tree.component.html',
  styles: []
})
export class AccountTreeComponent implements OnInit {
  treeData: any;
  AccountTreeForm: FormGroup;
  AccountTreeFormformErrorMessages: any;
  HeadName: any;
  button = "Save";
  parrentaccountname: any;
  showopeningbalance = false;
  showsubledgergrid = false;
  showaccledger = true;
  showaccgroup = true;
  showgst: boolean = false;
  showtds: boolean = false;
  showInclude: boolean = false;
  showExclude: boolean = false;
  isLoading: boolean = false;
  disablesavebutton = false;
  AccountLedgerChecked: any;
  GroupChecked: any;
  AccountmasterSavingDetails: any;
  subledgergriddata: any;
  MainAccountHeadName: any;
  gstPercentagesList: any;
  tdssectionlist: any;
  showOrHideAccounTreeGrid: boolean = false;
  showOrHideAccounTreesearchGrid: boolean = false;
  searchTreeData: any;

  @ViewChild(ContextMenuComponent, { static: false }) public basicMenu: ContextMenuComponent;
  constructor(private formbuilder: FormBuilder, private cd: ChangeDetectorRef, private _Accountingmasterservice: AccountingMastresService, private _AccountingTransactionsService: AccountingTransactionsService, private _CommonService: CommonService) { }
  
  
  ngOnInit() {
    this.AccountTreeFormformErrorMessages = {};
    this.BindAccountTree();
    this.AccountTreeForm = this.formbuilder.group({
      pAccountname: ['', Validators.required],
      pOpeningamount: [''],
      pOpeningdate: ['', Validators.required],
      pChracctype: ['', Validators.required],
      pParentId: [''],
      pParrentAccountname: [''],
      pFormtype: [''],
      pOpeningBalanceType: [''],
      pCreatedby: [''],
      pisgstapplicable: [false],
      pgsttype: [''],
      pgstpercentage: [''],
      pistdsapplicable: [false],
      ptdscalculationtype: [''],
      pRecordId: ['']

    })
    
    
    debugger;
    this.getTDSsectiondetails();
    this._AccountingTransactionsService.getGstPercentages().subscribe(result => {
      debugger;
      this.gstPercentagesList = result
      if (this.gstPercentagesList.length == 1) {
        this.AccountTreeForm.controls.pgstpercentage.setValue(this.gstPercentagesList[0].gstpercentage)
      }
    });
    
  }
  get f() { return this.AccountTreeForm.controls; }
  // BindAccountTree() {
  //   debugger;
  //   let AccountTree = this._Accountingmasterservice.GetAccountTreeNewDetails();
  //   forkJoin([AccountTree]).subscribe(results => {
  //     this.treeData = results[0];
  //     console.log(results[0]);
  //   });
  // }
  BindAccountTree() {
    //this.loading=true;
    let AccountTree = this._Accountingmasterservice.GetAccountTreeNewDetails();
    forkJoin([AccountTree]).subscribe(results => {

      this.showOrHideAccounTreeGrid = true;
      this.showOrHideAccounTreesearchGrid = false;
      this.treeData = results[0];
      this.searchTreeData = results[0];
//this.loading=false;
    });
  }
  returnClass2(data, index) {

    if (data.pChracctype == '1') {
      return 'caret text-danger';
    } else {
      return 'caret text-info'
    }
   
  }
  returnClass22(TdataSecond, index) {

    if (TdataSecond.pChracctype == '1') {
      return 'text-danger';
    } else {
      return 'text-info'
    }
  }
  returnClass3(TdataSecond, index) {
    if (TdataSecond.pChracctype == '1') {
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
    if (TdataSecond.pChracctype == '1') {
      return 'caret text-danger';
    } else {
      return 'caret text-info'
    }
  }
  returnClass44(TdataSecond, index) {
    if (TdataSecond.pChracctype == '1') {
      return 'text-danger';
    } else {
      return 'text-info'
    }
  }
  ActivateClass(event) {
    debugger;
    event.currentTarget.parentElement.querySelector(".nested").classList.toggle("active");
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
    if (this.AccountmasterSavingDetails.pChracctype == "1" && this.AccountmasterSavingDetails.ChailsorSibling != "Sibling") {
      acctype = this.AccountTreeForm['controls']['pChracctype'].value;
    }
    if (this.AccountmasterSavingDetails.pChracctype == "2" && this.AccountmasterSavingDetails.ChailsorSibling !== "Sibling") {
      acctype = "3";
    }
    if (this.AccountmasterSavingDetails.ChailsorSibling == "Sibling") {
      acctype = this.AccountmasterSavingDetails.pChracctype;
    }
    return acctype;
  }
  public ShoeSiblings(item: any): boolean {
    debugger;
    let status;
    if (isNullOrUndefined( item.pParentId)) { status = false; } else { status = true; }
    return status;
  }
  public ShowChild(item: any): boolean {
    debugger;
    let status
    if (item.pHaschild == true) { status = true; } else { status = true; } return status;
  }
  OpenModelpopup(data: any, ChailsorSibling) {
    debugger;
    this.AccountTreeForm.controls.pOpeningBalanceType.setValue("DEBIT");
    this.MainAccountHeadName = data.item.main_accountname;
    this.AccountTreeForm.controls.pOpeningdate.setValue(data.item.pOpeningdate);
    let checkTwotypecount = 0;
    if (ChailsorSibling != "Sibling") { this.parrentaccountname = data.item.pAccountname } else { this.parrentaccountname = data.item.pParrentAccountname }
    this.showopeningbalance = (data.item.pChracctype == '1' && (ChailsorSibling == "Sibling")) ? false : true;

    if ((data.item.pChracctype == '1' || data.item.pChracctype == '2') && ChailsorSibling == "Child") {
      if (data.item.children !== undefined) {
        let newData = data.item.children
        newData.filter(function (x) {
          debugger;
          if (x.pParentId == data.item.pAccountid && x.pChracctype == 2) {
            checkTwotypecount++;
          }
        });
        if (checkTwotypecount > 0 && newData.length > 0 && (data.item.pChracctype == '1' || data.item.pChracctype == '2')) {

          this.AccountTreeForm.patchValue({ 'pChracctype': "2" });
          this.showopeningbalance = true;
          this.AccountLedgerChecked = "2";
          this.showaccledger = true;
          this.showaccgroup = false;
          this.Isseleted();
        }
        if (checkTwotypecount == 0 && newData.length == 0 && data.item.pChracctype == '2') {

          this.AccountTreeForm.patchValue({ 'pChracctype': "2" });
          this.showopeningbalance = true;
          this.AccountLedgerChecked = "2";
          this.showaccledger = true;
          this.showaccgroup = false;
          this.Isseleted();
        }
        if (checkTwotypecount == 0 && newData.length == 0 && data.item.pChracctype == '1') {
          this.AccountTreeForm.patchValue({ 'pChracctype': "1" });
          this.GroupChecked = "1";
          this.showaccledger = true;
          this.showaccgroup = true;
          this.Isseleted();
        }
        if (checkTwotypecount == 0 && newData.length > 0 && data.item.pChracctype == '1') {
          this.GroupChecked = "1";
          this.AccountTreeForm.patchValue({ 'pChracctype': "1" });
          this.showaccledger = true;
          this.showaccgroup = true;
          this.Isseleted();
        }

      }
    }
    if ((data.item.pChracctype == '1' || data.item.pChracctype == '2') && ChailsorSibling == "Sibling") {
      if (data.item.pChracctype == '1') {
        this.GroupChecked = "1";
        this.AccountTreeForm.patchValue({ 'pChracctype': "1" });
        this.showaccledger = true;
        this.showaccgroup = true;
        this.Isseleted();
      }
      if (data.item.pChracctype == '2') {
        this.AccountTreeForm.patchValue({ 'pChracctype': "2" });
        this.showopeningbalance = true;
        this.AccountLedgerChecked = "2";
        this.showaccledger = true;
        this.showaccgroup = false;
        this.Isseleted();
      }
    }


    if (data.item.pChracctype == '2' && ChailsorSibling == "Child") {
      this.AccountTreeForm.patchValue({ 'pChracctype': "2" });
      this.GetSubLedgerData(data.item.pAccountid)
      this.showsubledgergrid = true;
    }

    this.AccountmasterSavingDetails = { pParentId: data.item.pParentId, ChailsorSibling: ChailsorSibling, pChracctype: data.item.pChracctype, pAccountid: data.item.pAccountid, pAccountname: data.item.pAccountname, pAccountBalance: data.item.pAccountBalance }
    $('#add-detail').modal('show');

  }
  public GetSubLedgerData(pledgerid) {

    this._AccountingTransactionsService.GetSubLedgerData(pledgerid).subscribe(json => {

      //this.loading = false;
      if (json != null) {
        this.subledgergriddata = json;
        //this.paymentslist = json;
      
      }

    },
      (error) => {

        this._CommonService.showErrorMessage(error);
      });
  }
  Isseleted() {
    debugger;
    let rdbchracctype = this.AccountTreeForm.controls.pChracctype.value;
    if (rdbchracctype == "1") {
      this.showopeningbalance = false;
      this.AccountTreeForm.controls.pOpeningamount.setValidators(null);
      this.AccountTreeForm.controls.pOpeningamount.clearValidators();
      this.AccountTreeForm.controls.pOpeningamount.updateValueAndValidity();
      this.closeModel("clearonly");
    }
    else {
      this.showopeningbalance = true;
      this.AccountTreeForm.controls.pOpeningamount.setValidators(Validators.required);
      this.closeModel("clearonly");
    }

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
    this.AccountTreeFormformErrorMessages = {};
  }

  taxTypeChange(type) {
    try {
      if (type == 'Include') {
        this.AccountTreeForm.controls.pgsttype.setValue("I");
        this.showInclude = true;
        this.showExclude = false;
        this.AccountTreeForm.controls.pgstpercentage.setValue("");
        this.AccountTreeForm.controls.pgstpercentage.setValidators([Validators.required]);
        this.AccountTreeForm.controls.pgstpercentage.updateValueAndValidity();
        this.AccountTreeFormformErrorMessages = {};
        this._AccountingTransactionsService.getGstPercentages().subscribe(result => {
          debugger;
          this.gstPercentagesList = result
          // if (this.gstPercentagesList.length == 1) {
          //   this.AccountTreeForm.controls.pgstpercentage.setValue(this.gstPercentagesList[0].gstpercentage)
          // }
        })
      }
      else if (type == 'Exclude') {
        this.AccountTreeForm.controls.pgsttype.setValue("E");
        this.AccountTreeForm.controls.pgstpercentage.setValue("");
        this.showInclude = false;
        this.showExclude = true;
        this.AccountTreeFormformErrorMessages = {};
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
      this.AccountTreeFormformErrorMessages = {};

    } else {
      this.showgst = false;
      this.AccountTreeForm.controls.pisgstapplicable.setValue(checked);
      this.AccountTreeForm.controls.pgstpercentage.setValue("");
      this.AccountTreeForm.controls.pgstpercentage.clearValidators();
      this.AccountTreeForm.controls.pgstpercentage.updateValueAndValidity();

      this.AccountTreeForm.controls.pgstpercentage.clearValidators();
      this.AccountTreeForm.controls.pgstpercentage.updateValueAndValidity();
      this.BlurEventAllControll(this.AccountTreeForm);
      this.AccountTreeFormformErrorMessages = {};
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
      this.AccountTreeFormformErrorMessages = {};
    } else {
      this.showtds = false;

      this.AccountTreeForm.controls.pRecordId.clearValidators();
      this.AccountTreeForm.controls.pRecordId.updateValueAndValidity();
      this.BlurEventAllControll(this.AccountTreeForm);
      this.AccountTreeFormformErrorMessages = {};
    }
  }

  tdsTaxTypeChange() {
    this.AccountTreeForm.controls.pRecordId.setValue("");
    this.AccountTreeFormformErrorMessages = {};
  }

  getTDSsectiondetails(): void {
    this._AccountingTransactionsService.getTDSsectiondetails().subscribe(
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
  SaveAccountHeads() {

    debugger;

    if (this.AccountTreeForm.controls.pOpeningamount.value == "") {
      this.AccountTreeForm.controls.pOpeningamount.setValue(0);
    }

    let isValid = true;
    if (this.checkValidations(this.AccountTreeForm, isValid)) {
      if (this.AccountTreeForm.valid) {
        let Parentid = this.AccountmasterSavingDetails.ChailsorSibling == "Sibling" ? this.AccountmasterSavingDetails.pParentId : this.AccountmasterSavingDetails.pAccountid;
        let acctype = this.GetAcctype();
        this.AccountTreeForm.patchValue({ pParentId: Parentid, pFormtype: this.AccountmasterSavingDetails.ChailsorSibling, pChracctype: acctype })

        let Accountname = this.AccountTreeForm.value["pAccountname"];
       // this.AccountTreeForm.controls.schema.setValue(this._CommonService.getschemaname());

        this._Accountingmasterservice.CheckAccountnameDuplicate(Accountname, acctype, Parentid).subscribe(count => {
          debugger;
          if (count > 0) {
            this.AccountTreeForm.controls.pAccountname.setValue("");
            this.showErrorMessage("Duplicate A/C  Ledger Or Sub Ledger Are Not Allowed")
          }
          else {

            if (this.AccountTreeForm.controls.pOpeningamount.value == null || this.AccountTreeForm.controls.pOpeningamount.value == "") {
              this.AccountTreeForm.controls.pOpeningamount.setValue(0);
            } else {
              let openingamount = this.AccountTreeForm.controls.pOpeningamount.value
              this.AccountTreeForm.controls.pOpeningamount.setValue(this._CommonService.removeCommasInAmount(openingamount));
            }
            if (isNullOrEmptyString(this.AccountTreeForm.controls.pRecordId.value))
              this.AccountTreeForm.controls.pRecordId.setValue(0);

            this.AccountTreeForm['controls']['pCreatedby'].setValue(this._CommonService.pCreatedby);
            if (confirm("Do you want to save ?")) {
              this.button = "Processing";
              this.isLoading = true;
              this.disablesavebutton = true;
              let data = JSON.stringify(this.AccountTreeForm.value);
              this._Accountingmasterservice.SaveAccounts(data).subscribe(res => {
                if (res) {
                  this.BindAccountTree();
                  this.closeModel("clearandclose");
                  this.showInfoMessage("Saved sucessfully");

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
    }

  }
  showInfoMessage(errormsg: string) {
    this._CommonService.showInfoMessage(errormsg);
  }

  onSearch(event) {
    debugger
     let searchText = event.target.value.toString();
    // alert(searchText);
     if (searchText != "") {
       let columnName = "account_name";
 
       let AccountTree = this._Accountingmasterservice.GetAccountTreeSearch(searchText);
       forkJoin([AccountTree]).subscribe(results => {
     
         this.showOrHideAccounTreeGrid = false;
         this.showOrHideAccounTreesearchGrid = true;
         this.searchTreeData = results[0];
         this.ActivateClass(null);
         // $(".nested").css("display", "block");
 
       },(error) => {
         this._CommonService.showErrorMessage(error);
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
   

  // VALIDATIONS
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
          this.AccountTreeFormformErrorMessages[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                lablename = (document.getElementById(key) as HTMLInputElement).title;
                errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.AccountTreeFormformErrorMessages[key] += errormessage + ' ';
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
}
