import { Component, OnInit,ViewChild } from '@angular/core';
import { CommonService } from 'src/app/Services/common.service';
import { Observable } from 'rxjs/Rx';
import {ShareapplicationService } from 'src/app/Services/Banking/shareapplication.service';
import { State, process,GroupDescriptor } from '@progress/kendo-data-query';
import { DataBindingDirective, SelectableSettings } from '@progress/kendo-angular-grid';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
// { process, GroupDescriptor } from '@progress/kendo-data-query';

@Component({
  selector: 'app-share-app-view',
  templateUrl: './share-app-view.component.html'
})
export class ShareAppViewComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  public selectableSettings: SelectableSettings;
  constructor(private _ShareapplicationService:ShareapplicationService,private commonService: CommonService) { 
        this.allData = this.allData.bind(this);
  }
public group: GroupDescriptor[];
  public gridData = [];
  public gridView = [];
  public mySelection: string[] = [];
  public pageSize = 10;
  public skip = 0;
  public headerCells: any = {
    textAlign: 'center'
  };

  shareApplicationGridDetails: any = [];

  ngOnInit() {
    this.getShareAppExistingDetails();
  }

  getShareAppExistingDetails() {
    try {
      debugger
      this.gridView = [];
      this.shareApplicationGridDetails = [];
      this._ShareapplicationService.getShareApplicationViewDetails().subscribe(res => {
        if (res) {
          this.shareApplicationGridDetails = res;
          this.gridView = this.gridData=this.shareApplicationGridDetails;
        }
      });
    } catch (error) {
      this.commonService.showErrorMessage(error);
    }
  }

  editHandler(dataItem) {

  }

  removeHandler({ dataItem }) {
     debugger
    try {
      if (dataItem.pshareapplicationid) {
        this._ShareapplicationService.DeleteShareDetails(dataItem.pshareapplicationid).subscribe(res => {
          if (true) {
            this.commonService.showInfoMessage('Deleted Successfully');
            this.getShareAppExistingDetails();
          }else{
            this.commonService.showErrorMessage('Not Deleted...');
          }
        });
      }
    } catch (error) {
      this.commonService.showErrorMessage(error);
    }
   }

   SearchRecord(inputValue: string) {

    this.gridView = process(this.gridData, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'pShareAccountNo',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pmembername',
            operator: 'contains',
            value: inputValue
          },
            {
            field: 'pnoofsharesissued',
            operator: 'contains',
            value: inputValue
          },
            {
            field: 'pdistinctivefrom',
            operator: 'contains',
            value: inputValue
          },
            {
            field: 'pdistinctiveto',
            operator: 'contains',
            value: inputValue
          },
            {
            field: 'ptotalamount',
            operator: 'contains',
            value: inputValue
          }
        ],
      }
    }).data;
    this.dataBinding.skip = 0;
  }
  //  public allData = (): Observable<any> => {
  //   return this.gridView
  // };
  public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.gridView, {}).data,
      group: this.group
    };

    return result;
  }
}
