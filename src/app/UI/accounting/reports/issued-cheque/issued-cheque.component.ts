import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { ReportService } from 'src/app/Services/Accounting/report.service';
import { Router } from '@angular/router';
import { BankbookService } from 'src/app/Services/Accounting/bankbook.service';
import { GroupDescriptor } from '@progress/kendo-data-query';
import { AccountingTransactionsService } from '../../../../Services/Accounting/accounting-transactions.service';
import { ToastrService } from 'ngx-toastr';
import { GridComponent } from '@progress/kendo-angular-grid';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { State, process} from '@progress/kendo-data-query';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
@Component({
  selector: 'app-issued-cheque',
  templateUrl: './issued-cheque.component.html',
  styles: []
})
export class IssuedChequeComponent implements OnInit {
  
@ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  //@ViewChild(GridComponent, { static: false }) grid;
  @ViewChild(GridComponent, { static: true })
  public grid: GridComponent;
  FrmIssuedCheque: FormGroup;
  public UnUsedChequeList: [];
  public BankData: [];
  public lstBankChequeDetails: any;
  public savebutton = "Submit";
  public isLoading = false;
  public isSubmited = false;
  public _BankId: any;
  public _ChqBookId: any;
  public _ChqFromNo: any;
  public _ChqToNo: any;
  gridData: any = [];
  gridDataDetails: any = [];
  DataForCancel = [];
  public strChqNo: any;
  loading = false;
  IssuedChequeValidation: any = {};
  disablesavebutton = false;
  public groups: GroupDescriptor[] = [{ field: 'pchequestatus' }];
  constructor(private _routes: Router, private formbuilder: FormBuilder, private _reportservice: ReportService, private _CommonService: CommonService, private _bankBookService: BankbookService, private _accountingtransaction: AccountingTransactionsService, private toastr: ToastrService) {
    this.allData = this.allData.bind(this);
   }

  ngOnInit() {

    this.FrmIssuedCheque = this.formbuilder.group({
      pbankname: [null, Validators.required],
      pchqfromto: [null, Validators.required]
    })

    this.bankBookDetails();
    this.BlurEventAllControll(this.FrmIssuedCheque);

  }
  get f() { return this.FrmIssuedCheque.controls; }

  public bankBookDetails() {
    debugger;
    this._bankBookService.GetBankNames().subscribe(res => {
      debugger;
      this.BankData = res;
    },
      (error) => {
        this._CommonService.showErrorMessage(error);
      });
  }
  public BankName_Cahange($event) {
    debugger;
    let BankId
    this.gridData = [];
    this.gridDataDetails = [];
    this.lstBankChequeDetails = [];
    this.FrmIssuedCheque['controls']['pchqfromto'].setValue(null);
    this.IssuedChequeValidation = {};
    if ($event != undefined) {
      debugger;
      BankId = $event.pbankaccountid;
      if (BankId != "") {
        this._reportservice.GetBankChequeDetails(BankId).subscribe(res => {
          debugger;
          if (res != null) {
            this.lstBankChequeDetails = res;
          }
        },
          (error) => {
            this._CommonService.showErrorMessage(error);
          }
        );
      }
    }
  }
  GetIssuedBankDetails($event) {
    this.isSubmited = true;
    if (this.FrmIssuedCheque.valid) {
      debugger;
      this.FrmIssuedCheque.value;
      this._BankId = this.FrmIssuedCheque['controls']['pbankname'].value;
      this._ChqBookId = this.FrmIssuedCheque['controls']['pchqfromto'].value;
      //this.strChqNo = $event.target.options[$event.target.selectedIndex].text;
      this.strChqNo = $event.pchqfromto;
      this.GetData();

    }

  }
  GetData() {
    debugger;

    var Chqno = this.strChqNo.split('-');
    this._ChqFromNo = Chqno[0];
    this._ChqToNo = Chqno[1];
    this._reportservice.GetIssuedBankDetails(this._BankId, this._ChqBookId, this._ChqFromNo, this._ChqToNo).subscribe(res => {
      debugger;

      this.gridData = res;
      this.gridDataDetails = JSON.parse(JSON.stringify(this.gridData));
      //for (let j = 0; j < this.gridDataDetails.length; j++) {
      //  this.grid.collapseGroup(j.toString());
      //}

      this.gridData = this.gridData.filter(
        itm => itm.pchequestatus === "UnUsed-Cheques");
      for (let i = 0; i < this.gridData.length; i++) {
        this.grid.collapseGroup(i.toString());
      }
    });
  }
  checkedCancel(event, data) {
    debugger;
    if (event.target.checked == true) {
      debugger;
      for (let i = 0; i < this.gridData.length; i++) {
        if (this.gridData[i].pchequenumber == data.pchequenumber) {
          data.pbankaccountid = this.FrmIssuedCheque['controls']['pbankname'].value;
          data.pCreatedby = this._CommonService.pCreatedby;
          this.DataForCancel.push(data);
          break;
        }
      }
    }
    else if (event.target.checked == false) {
      debugger;
      for (let d of this.DataForCancel) {
        if (d.pchequenumber == data.pchequenumber) {
          this.DataForCancel.splice(this.DataForCancel.indexOf(d));
          break;
        }
      }
    }

  }
  UnusedChequeCancel() {
    let isValid = true;
    if (this.checkValidations(this.FrmIssuedCheque, isValid)) {
      if (this.DataForCancel.length > 0) {
        debugger;
        this.savebutton = "Processing"
        let newdata = { lstIssuedCheque: this.DataForCancel };
        let form = JSON.stringify(newdata);
        this._accountingtransaction.UnusedhequeCancel(form).subscribe(data => {

          if (data) {
            this.toastr.success("Cancelled Successfully", 'Success');
            this.savebutton = "Submit";
            this.DataForCancel = [];
            this.gridData = [];
            this.GetData();
            this.IssuedChequeValidation = {};
          }

        }, error => {
          this.toastr.error(error, 'Error');

        });
      }
    }
  }

  public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.gridDataDetails,{
      }).data,
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
      this._CommonService.showErrorMessage(e);
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
          this.IssuedChequeValidation[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.IssuedChequeValidation[key] += errormessage + ' ';
                isValid = false;
              }
            }
          }
        }
      }
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
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
      this._CommonService.showErrorMessage(e);
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
      this._CommonService.showErrorMessage(e);
      return false;
    }



  }

  public collapseGroups(topGrid) {
    debugger;
    this.gridDataDetails.forEach((item, idx) => {
      debugger;
      topGrid.collapseGroup(idx);
    })
  }


}
