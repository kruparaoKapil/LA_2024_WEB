import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { PreclosureService } from 'src/app/Services/Loans/Masters/preclosuremaster.service';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/Services/common.service';
import { State, process, GroupDescriptor } from '@progress/kendo-data-query';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
declare let $: any;

@Component({
  selector: 'app-preclosure-view',
  templateUrl: './preclosure-view.component.html',
  styles: []
})
export class PreclosureViewComponent implements OnInit {

  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  constructor(private _preclosuremaster: PreclosureService, private zone: NgZone, private router: Router, private _commonService: CommonService) {

  }
  public groups: GroupDescriptor[] = [{ field: 'pLoantype' }];
  public gridState: State = {
    sort: [],
    take: 10
  };
  TableColumnsDynamic: any;
  DatatableInIt: any;
  GridData: any;
  gridView: any = []
  status;
  public loading = false;
  public headerCells: any = {
    textAlign: 'center'
  };
  editdata = {};
  deleteData = {};
  ngOnInit() {
    
    this.loading = true;

    this._preclosuremaster.getDatatopreclosureview().subscribe(data => {
      this.gridView = data;
      this.GridData = this.gridView;

      this.loading = false;

    })



  }
  public group: any[] = [{
    field: 'pLoantype'
  }];
  public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.GridData, { group: this.group, sort: [{ field: 'pLoantype', dir: 'desc' }] }).data,
      group: this.group
    };

    return result;
  }
  editHandler(event) {
    
    this.status = "update";
    this._preclosuremaster.getStatusFromPreclosureView(this.status);
    this.editdata["pRecordid"] = event.dataItem.pRecordid;
    this.editdata["pLoanid"] = event.dataItem.pLoanid
    this._preclosuremaster.loadEditInformation(this.editdata);
    this.router.navigate(['/PreclosureMaster']);
  }
  removeHandler(event) {

    let id = this._commonService.pCreatedby;
    this._preclosuremaster.deletePreclosureMaster(event.dataItem.pLoanid, event.dataItem.pRecordid, id).subscribe(value => {

      this._preclosuremaster.getDatatopreclosureview().subscribe(data => {
        this.GridData = data;


      })
    })

  }

  onClickStatus() {
    
    this.status = "new";
    this._preclosuremaster.getStatusFromPreclosureView(this.status);
  }
  public onFilter(inputValue: string): void {
    this.GridData = process(this.gridView, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'pLoantype',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pLoanname',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pLockingperiod',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pChargecaltype',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pChargecalonfield',
            operator: 'contains',
            value: inputValue
          },




        ],
      }
    }).data;
    this.dataBinding.skip = 0;
  }

}


