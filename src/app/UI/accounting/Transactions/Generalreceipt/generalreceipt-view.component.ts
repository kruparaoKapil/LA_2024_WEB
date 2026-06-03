import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../../../../Services/common.service';
import { AccountingTransactionsService } from '../../../../Services/Accounting/accounting-transactions.service';
import { SelectableSettings, GridDataResult } from '@progress/kendo-angular-grid';
import { State, GroupDescriptor, DataResult, process } from '@progress/kendo-data-query';
import { Router } from '@angular/router';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { DataBindingDirective } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-generalreceipt-view',
  templateUrl: './generalreceipt-view.component.html',
  styles: []
})
export class GeneralreceiptViewComponent implements OnInit {

  public gridData: any[] = [];
  public mySelection: string[] = [];
  public gridView: any = [];
  public headerCells: any = {
    textAlign: 'center'
  };
 // public groups: GroupDescriptor[] = [{ field: 'preceiptdate', dir: 'desc' }];
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
    
    this.getLoadData();
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

  getLoadData() {
    
    this._AccountingTransactionsService.GetGeneralReceiptExistingData().subscribe(json => {
      
      if (json != null) {
        this.gridData = json;
        this.gridView = this.gridData
      }
    },
      (error) => {

        this._commonService.showErrorMessage(error);
      });
  }

  public removeHandler({ dataItem }) {
    
    let receipt = btoa(dataItem.preceiptid + ',' + 'General Receipt');

    //this._commonService._setReportLableName(value);
    window.open('/#/GeneralReceiptReports?id=' + receipt );
    //this.router.navigate(['/GeneralReceiptReports', receipt]);
    //this._commonService._SetGeneralReceiptView(receipt)
  }

  public onFilter(inputValue: string): void {
    this.gridView = process(this.gridData, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'preceiptdate',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'preceiptid',
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
  public value: any = [{ text: "preceiptdate", value: 2 }];
  public isItemSelected(itemText: string): boolean {
    return this.value.some(item => item.text === itemText);
  }

  public columns: any = [
    { text: "preceiptdate", value: 1 },
    { text: "preceiptid", value: 2 },
    { text: "pmodofreceipt", value: 3 },
    { text: "pbankname", value: 4 },
    { text: "pChequenumber", value: 5 },
    { text: "pnarration", value: 4 },
    { text: "ptotalreceivedamount", value: 5 }
  ];

  public hiddenColumns: string[] = [];

  public isHidden(columnName: string): boolean {
    return this.hiddenColumns.indexOf(columnName) > -1;
  }

  public isDisabled(columnName: string): boolean {
    return this.columns.length - this.hiddenColumns.length === 1 && !this.isHidden(columnName);
  }

  public hideColumn(columnName: string): void {
    const hiddenColumns = this.hiddenColumns;

    if (!this.isHidden(columnName)) {
      hiddenColumns.push(columnName);
    } else {
      hiddenColumns.splice(hiddenColumns.indexOf(columnName), 1);
    }
  }
}

