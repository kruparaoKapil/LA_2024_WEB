import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SchememasterService } from 'src/app/Services/Loans/Masters/schememaster.service';
import { CommonService } from 'src/app/Services/common.service';
import { State, process, GroupDescriptor } from '@progress/kendo-data-query';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
declare let $: any;
@Component({
  selector: 'app-scheme',
  templateUrl: './scheme-view.component.html',
})
export class SchemeViewComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  

  public mySelection: string[] = [];
  GridData: any = [];
  public loading = false;
  public gridState: State = {
    sort: [],
    take: 10
  };
  public groups: GroupDescriptor[] = [{ field: 'pLoanname' }];
  gridView: any = []
  newform = false;
  public pageSize = 10;
  public headerCells: any = {
    textAlign: 'center'
  };
  recordid: any;
  deletedrow: any;
  constructor(private _schememasterservice: SchememasterService, private zone: NgZone, private router: Router, private _commonservice: CommonService) {

  }

  ngOnInit() {
    this.loading = true;
    this._schememasterservice.getDataToGrid().subscribe(data => {
      this.gridView = data;
      this.GridData = this.gridView;

      this.loading = false;
    })

  }
  public group: any[] = [{
    field: 'pLoanname'
  }];

  public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.GridData, { group: this.group, sort: [{ field: 'pLoanname', dir: 'desc' }] }).data,
      group: this.group
    };

    return result;
  }
  editHandler(event) {
    this._schememasterservice.newformstatus("edit")
    let d = { 'sid': event.dataItem.pSchemeid, 'lid': event.dataItem.pLoanid, }
    this._schememasterservice.loadEditInformation(d);
    //this._schememasterservice.getRecordid(this.recordid) 
    this.router.navigate(['/SchemeMaster']);
  }
  removeHandler(event) {
    event.dataItem.pCreatedby = this._commonservice.pCreatedby
    this._schememasterservice.DeleteSchemeMaster(event.dataItem).subscribe(deleteddata => {


      
      //console.log(deleteddata)
      this.deletedrow = deleteddata
      if (this.deletedrow == true) {
        this._schememasterservice.getDataToGrid().subscribe(data => {
          
          this.GridData = data;


        })
      }
    })
  }
  newschemeform() {
    // this.newform="new";
    this._schememasterservice.newformstatus("new")
  }


  public onFilter(inputValue: string): void {
    this.GridData = process(this.gridView, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'pSchemename',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pSchemecode',
            operator: 'contains',
            value: inputValue
          },
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
            field: 'pEffectfromdate',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pEffecttodate',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pStatusname',
            operator: 'contains',
            value: inputValue
          },



        ],
      }
    }).data;
    this.dataBinding.skip = 0;
  }

}
