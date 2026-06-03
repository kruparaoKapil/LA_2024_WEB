import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../../../../Services/common.service';
import { AccountingTransactionsService } from '../../../../Services/Accounting/accounting-transactions.service';
import { SelectableSettings, GridDataResult } from '@progress/kendo-angular-grid';
import { State, GroupDescriptor, DataResult, process } from '@progress/kendo-data-query';
import { Router } from '@angular/router';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { DataBindingDirective } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-paymentvoucher-view',
  templateUrl: './paymentvoucher-view.component.html',
  styles: []
})
export class PaymentvoucherViewComponent implements OnInit {
  paymentslist: any;
  public gridData: any[] = [];
  public mySelection: string[] = [];
  public gridView: any = [];
  public headerCells: any = {
    textAlign: 'center'
  };
  public groups: GroupDescriptor[] = [{ field: 'ppaymentdate' }];
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  // public pageSize = 10;
  // public skip = 0;
  // private data: Object[];
  // public gridState: State = {
  //   sort: [],
  //   skip: 0,
  //   take: 10
  // };

  public selectableSettings: SelectableSettings;
  constructor(private _commonService: CommonService, private _AccountingTransactionsService: AccountingTransactionsService, private router: Router) {
    this.allData = this.allData.bind(this);
  }

  ngOnInit() {
    debugger;
    this.getLoadData();
  }

  getLoadData() {
    
    this._AccountingTransactionsService.GetPaymentVoucherExistingData().subscribe(json => {
      
      if (json != null) {
        //this.paymentslist = json;
        this.gridData = json;
        this.gridView = this.gridData
      }
    },
      (error) => {

        this._commonService.showErrorMessage(error);
      });
  }

  public group: any[] = [{
    field: 'preceiptdate'
  }];

  public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.gridView, { group: this.group, sort: [{ field: 'preceiptdate', dir: 'desc' }] }).data,
      group: this.group
    };

    return result;
  }

  public removeHandler({ dataItem }) {
    
    let receipt = btoa(dataItem.ppaymentid + ',' + 'Payment Voucher');
    //this.router.navigate(['/PaymentVoucherReports', receipt]);

    window.open('/#/PaymentVoucherReports?id=' + receipt);

    //this._commonService._SetPaymentView(receipt)
  }

  public onFilter(inputValue: string): void {
    this.gridView = process(this.gridData, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'ppaymentdate',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'ppaymentid',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pmodofreceipt',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pbankname',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pChequenumber',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pnarration',
            operator: 'contains',
            value: inputValue
          }
        ],
      }
    }).data;

    this.dataBinding.skip = 0;
  }
}
