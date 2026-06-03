import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../../../Services/common.service';
import { AccountingMastresService } from '../../../../Services/Accounting/accounting-mastres.service';
import { AccountingTransactionsService } from '../../../../Services/Accounting/accounting-transactions.service';
import { State, GroupDescriptor, DataResult, process } from '@progress/kendo-data-query';
declare let $: any
@Component({
  selector: 'app-accounts-master',
  templateUrl: './accounts-master.component.html',
  styles: []
})
export class AccountsMasterComponent implements OnInit {
  @Input() parrentId: any;
  @Input() accountid: any;
  @Input() formtype: any;
  @Input() parrentaccountname: any;
  @Input() chracctype: any;
  @Input() showacctype = false;
  @Output() emitevent = new EventEmitter()
  AccountMasterForm: FormGroup;
  showPage = true;
  submitted = false;
  acctype: string;
  openingdate: string;
  showaccledger = true;
  showaccgroup = true;
  showopeningbalance = false;
  showsubledgergrid = false;
  public gridView: any = [];
  public gridData: any[] = [];
  public loading = true;
  disablesavebutton = false;
  savebutton = "Save";
  constructor(private _routes: Router, private formbuilder: FormBuilder, private _CommonService: CommonService, private _AccountingMastresService: AccountingMastresService, private _AccountingTransactionsService: AccountingTransactionsService) { }
 
  ngOnInit() {
   
    this.AccountMasterForm = this.formbuilder.group({
      pAccountname: ['', Validators.required],
      pOpeningamount: [''],
      pOpeningdate: ['', Validators.required],
      pChracctype: ['', Validators.required],
      pParentId: [''],
      pParrentAccountname: [''],
      pFormtype: [''],
      pOpeningBalanceType: [''],
     pCreatedby: ['']
    
    })

    this.AccountMasterForm.controls.pOpeningBalanceType.setValue(0)
  }
 get f() { return this.AccountMasterForm.controls; }
 showErrorMessage(errormsg: string) {
    this._CommonService.showErrorMessage(errormsg);
  }

  showInfoMessage(errormsg: string) {
    this._CommonService.showInfoMessage(errormsg);
  }

  SaveAccounts() {
    
    this.submitted = true;
    this.disablesavebutton = true;
    this.savebutton = 'Processing';
    //if (this.showacctype == false) {
    //  this.AccountMasterForm['controls']['pChracctype'].setValue(this.chracctype);
    //}
    //if (this.chracctype == "2" && this.formtype !== "Sibling") {
    //  this.AccountMasterForm['controls']['pChracctype'].setValue("3");
    //}
   
    if (this.AccountMasterForm.valid) {
      try {
        let Parentid = this.formtype == "Sibling" ? this.parrentId : this.accountid;
        this.acctype = this.GetAcctype();
        this.AccountMasterForm['controls']['pParentId'].setValue(Parentid);
        this.AccountMasterForm['controls']['pFormtype'].setValue(this.formtype);
        this.AccountMasterForm['controls']['pChracctype'].setValue(this.acctype);
        this.AccountMasterForm['controls']['pCreatedby'].setValue(this._CommonService.pCreatedby);

        if (this.AccountMasterForm['controls']['pOpeningamount'].value == null) {
          this.AccountMasterForm['controls']['pOpeningamount'].setValue(0);
        }
        let Accountname = this.AccountMasterForm['controls']['pAccountname'].value;
        this._AccountingMastresService.CheckAccountnameDuplicate(Accountname, this.acctype, Parentid).subscribe(count => {
          if (count > 0) {
            this.showErrorMessage("Accountname Already Exists");
            this.AccountMasterForm['controls']['pAccountname'].setValue('');
            this.disablesavebutton = false;
            this.savebutton = 'Save';
          }
          else {
            let data = JSON.stringify(this.AccountMasterForm.value);
            this._AccountingMastresService.SaveAccounts(data).subscribe(res => {
              if (res) {
                this.disablesavebutton = false;
                this.savebutton = 'Save';
                this.showInfoMessage("Saved sucessfully");

                this.clearAccountFormDeatails();
                this.emitevent.emit()

              }


            },
              (error) => {

                this.showErrorMessage(error);
                this.disablesavebutton = false;
                this.savebutton = 'Save';
              });

          }



        });


      } catch (e) {
        this.showErrorMessage(e);
      }
    }
    else {
      this.disablesavebutton = false;
      this.savebutton = 'Save';
    }
    

    }
  clearAccountFormDeatails(): void {
    this.AccountMasterForm.reset();
    this.AccountMasterForm['controls']['pParentId'].setValue('');
    this.AccountMasterForm['controls']['pFormtype'].setValue('');
    this.submitted = false;

    $('#add-detail').modal('hide');

  }

  GetAcctype(): string {
    let acctype;
    if (this.chracctype == "1" && this.formtype != "Sibling") {
      acctype = this.AccountMasterForm['controls']['pChracctype'].value;
    }
    if (this.chracctype == "2" && this.formtype !== "Sibling") {
      acctype = "3";
    }
    if (this.formtype =="Sibling") {
      acctype = this.chracctype;
    }
    return acctype;
  }

  Isseleted() {
    
    let rdbchracctype = this.AccountMasterForm.controls.pChracctype.value;
    if (rdbchracctype == "1") {
      this.showopeningbalance = false;
    }
    else {
      this.showopeningbalance = true;
    }
  }

  public GetSubLedgerData(pledgerid) {
    
    this._AccountingTransactionsService.GetSubLedgerData(pledgerid).subscribe(json => {
      
      this.loading = false;
      if (json != null) {
        //this.paymentslist = json;
        this.gridData = json;
        this.gridData.reduce((acc, item, index) => {
          this.gridData[index].accountbalance = parseFloat(item.accountbalance) < 0 ? this._CommonService.currencyformat(Math.abs(item.accountbalance)) + ' Cr' : this._CommonService.currencyformat(item.accountbalance) + ' Dr';;
        },0);

        this.gridView = this.gridData
      }
      
    },
      (error) => {

        this._CommonService.showErrorMessage(error);
      });
  }
  public onFilter(inputValue: string): void {
    this.gridView = process(this.gridData, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'psubledgername',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'accountbalance',
            operator: 'contains',
            value: inputValue
          }
        ],
      }
    }).data;

    // this.dataBinding.skip = 0;
  }
  }

