import { Component, OnInit, ViewChild } from '@angular/core';
import { FdRdServiceService } from 'src/app/Services/Banking/fd-rd-service.service';
import { ToastrService } from 'ngx-toastr';
import { PageChangeEvent, DataBindingDirective } from '@progress/kendo-angular-grid';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { GroupDescriptor, process } from '@progress/kendo-data-query';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/Services/common.service';

@Component({
  selector: 'app-rdconfig-view',
  templateUrl: './rdconfig-view.component.html',
  styles: []
})
export class RdconfigViewComponent implements OnInit {

  rdItemsList = [];
  fiViewData = []; 
  public mySelection: string[] = [];
  public gridView: any = [];

  public pageSize = 10;
  public skip = 0;

  loading: boolean = false;

  public headerCells: any = {
    textAlign: 'center'
  };

  // public groups: GroupDescriptor[] = [{ field: 'pRdname',dir:'desc' }];
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  constructor(private rdFdService:FdRdServiceService, 
    private toastr: ToastrService,
    private router :Router,
    private commonService:CommonService) {
       this.allData = this.allData.bind(this);
     }

  ngOnInit() {
    this.getRdConfigDetails();
  }

  getRdConfigDetails() {
    this.loading = true;
    this.rdFdService.getRdConfigDetails().subscribe((response: any) => {
      this.loading = false;
      if(response) {
        this.rdItemsList = response;
        this.gridView =  this.rdItemsList;
      }
    }, (error) => {
      this.loading = false;
      // this.toastr.error("Something went wrong from server side, Please try after sometime", "Error!");
    } )
  }
  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.loadFiDatas();
  }

  private loadFiDatas(): void {
    this.gridView = {
      data: this.fiViewData.slice(this.skip, this.skip + this.pageSize),
      total: this.fiViewData.length
    };
  }

  public allData(): ExcelExportData {
    const result: ExcelExportData =  {
        data: process(this.rdItemsList, {}).data
    };
    return result;
}

public onFilter(inputValue: string): void {
  this.gridView = process(this.rdItemsList, {
    filter: {
      logic: "or",
      filters: [
        {
          field: 'pRdname',
          operator: 'contains',
          value: inputValue
        },
        {
          field: 'pRdnamecode',
          operator: 'contains',
          value: inputValue
        }
      ]
    }
  }).data;
   this.dataBinding.skip = 0;
}

editHandler(event) {
  debugger;
  let totalData = btoa(JSON.stringify(event.dataItem));
  this.router.navigateByUrl('/RdNew/' + totalData);
}

public removeHandler({ dataItem }) {
  this.rdFdService.removeItemFromRdViewGrid(dataItem.pRdconfigid).subscribe((response: any) => {
    if(response) {
      this.commonService.showInfoMessage("Record Deleted Successfully");
      this.getRdConfigDetails();
    }
  })
}
}
