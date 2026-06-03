import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../../../../Services/common.service';
import { AccountingTransactionsService } from '../../../../Services/Accounting/accounting-transactions.service';
import { SelectableSettings, GridDataResult } from '@progress/kendo-angular-grid';
import { State, GroupDescriptor, DataResult, process } from '@progress/kendo-data-query';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { debug } from 'util';

@Component({
  selector: 'app-journalvoucher-view',
  templateUrl: './journalvoucher-view.component.html',
  styles: []
})
export class JournalvoucherViewComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  public Journalvoucherlist: any[];
  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  private data: Object[];
  public gridData: any;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10
  };
  public headerCells: any = {
    textAlign: 'center'
  };
  public selectableSettings: SelectableSettings;
  constructor(private _commonService: CommonService, private _AccountingTransactionsService: AccountingTransactionsService) {
    this.allData = this.allData.bind(this);
  }

  ngOnInit() {
    this.getLoadData();
  }

  public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.Journalvoucherlist, { sort: [{ field: 'preceiptdate', dir: 'desc' }] }).data
    };

    return result;
  }

  public onFilter(inputValue: string): void {
    this.Journalvoucherlist = process(this.gridData, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'pjvdate',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pjvnumber',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'ptotalpaidamount',
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

  getLoadData() {
    
    this._AccountingTransactionsService.GetJournalVoucherData().subscribe(json => {
      
      //console.log(json)
      if (json != null) 
      {
        console.log("grid data",json)
        this.gridData = json
        this.Journalvoucherlist = this.gridData;

        //this.lstLoanTypes = json
        //this.titleDetails = json as string
        //this.titleDetails = eval("(" + this.titleDetails + ')');
        //this.titleDetails = this.titleDetails.FT;
      }
    },
      (error) => {

        this._commonService.showErrorMessage(error);
      });
  }
  removeHandler({ dataItem }) {
    debugger;
    let receipt = btoa(dataItem.pjvnumber + ',' + 'Journal Voucher');
    //this.router.navigate(['/PaymentVoucherReports', receipt]);

    window.open('/#/JournalvoucherReport?id=' + receipt);
    // window.open('/#/EmiChartReport');
  }
}
