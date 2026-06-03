import { Component, OnInit, ViewChild } from '@angular/core';
import { FdRdServiceService } from 'src/app/Services/Banking/fd-rd-service.service';
import { DataBindingDirective, PageChangeEvent  } from '@progress/kendo-angular-grid';
import { ToastrService } from 'ngx-toastr';
import {  process } from '@progress/kendo-data-query';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/Services/common.service';

@Component({
  selector: 'app-fd-config-view',
  templateUrl: './fd-config-view.component.html',
  styles: []
})
export class FdConfigViewComponent implements OnInit {
  fdItemsList = [];
  fdViewData = []; 
  public mySelection: string[] = [];
  public pageSize = 10;
  public skip = 0;
  public gridView: any = [];
  isLoading:boolean = false;
  public headerCells: any = {
    textAlign: 'center'
  };
  // public groups: GroupDescriptor[] = [{ field: 'pRdname',dir:'desc' }];
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;

  constructor(private rdFdService:FdRdServiceService,
    private toastr: ToastrService,
    private router : Router,
    private commonService: CommonService) { 
        this.allData = this.allData.bind(this);
    }

  ngOnInit() {
    this.getFdConfigDetails();
  }

  getFdConfigDetails() {
    this.isLoading = true;
    this.rdFdService.getFdConfigDetails().subscribe((response: any) => {
      this.isLoading = false;
      if(response) {
        this.fdItemsList = response;
        this.gridView =  this.fdItemsList;
        console.log("view grid",this.gridView)
      }
    }, (error) => {
      this.isLoading = false;
      // this.toastr.error("Something went wrong from server side, Please try after sometime", "Error!");
    } )
  }
  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.loadFiDatas();
  }
  private loadFiDatas(): void {
    this.gridView = {
      data: this.fdViewData.slice(this.skip, this.skip + this.pageSize),
      total: this.fdViewData.length
    };
  }


  public allData(): ExcelExportData {
    const result: ExcelExportData =  {
        data: process(this.fdItemsList, { }).data
    };

    return result;
}

public onFilter(inputValue: string): void {
  
  this.gridView = process(this.fdItemsList, {
    filter: {
      logic: "or",
      filters: [
        {
          field: 'pFDname',
          operator: 'contains',
          value: inputValue
        },
        {
          field: 'pFdnamecode',
          operator: 'contains',
          value: inputValue
        }
      ]
    }
  }).data;

   this.dataBinding.skip = 0;
}

editHandler(event)
 {
   debugger
  let totalData = btoa(JSON.stringify(event.dataItem));
  this.router.navigateByUrl('/FdNew/' + totalData);
}

public removeHandler({ dataItem }) {
  
  // pFDconfigid
  
  this.rdFdService.removeItemFromFdViewGrid(dataItem.pFDconfigid).subscribe((response: any) => {
    if(response) {
      this.commonService.showInfoMessage("Record Deleted Successfully");
      this.getFdConfigDetails();
    }
  })


  // const index: number = this.gridView.indexOf(dataItem);
  // if (index !== -1) {
  //   this.gridView.splice(index, 1);
  // }
}

}
