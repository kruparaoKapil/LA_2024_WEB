import { Component, OnInit, ViewChild } from '@angular/core';
import { LienEntryService } from 'src/app/Services/Banking/lien-entry.service';
import { CommonService } from 'src/app/Services/common.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FdTranscationDetailsComponent } from '../../Transactions/FD-AC-Creation/fd-transcation-details.component';
declare let $: any
import { process } from '@progress/kendo-data-query';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';

@Component({
  selector: 'app-lien-release-view',
  templateUrl: './lien-release-view.component.html',
  styles: []
})
export class LienReleaseViewComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;

  @ViewChild(FdTranscationDetailsComponent, { static: true }) fdTranscationDetailsComponent: FdTranscationDetailsComponent;
  LienGridlist: any;
  LienDataForEdit: any;
  gridview: any = [];
  constructor(private router: Router, private datePipe: DatePipe, private _LienEntryService: LienEntryService, private _commonservice: CommonService) { 
    this.allData = this.allData.bind(this);

  }

  ngOnInit() {
    this.BindData();
  }
  NewButtonClick(type) {
    debugger
    this._LienEntryService.SetButtonClickType(type)
  }
  GetAccountDetails(DataItem) {
    debugger;

    this.fdTranscationDetailsComponent.BindData(DataItem.pFdaccountno,DataItem.pFdaccountID);
    $('#add-detail').modal('show');
  }
  BindData() {
    debugger;
    this._LienEntryService.GetLienReleaseMaingridView().subscribe(res => {
      debugger;
      if (res) 
      {
        console.log("lien release data is",res)
        let data = res;
        this.LienGridlist = data["lienReleaselist"];
        this.gridview = this.LienGridlist;
        if (this.LienGridlist.length > 0) {
          this.LienGridlist = this.LienGridlist.filter(x => x.pLienrealsedate = this.datePipe.transform(x.pLienrealsedate, "dd/MMM/yyyy"));
        }
      }
      
    });
  }
  removeHandler(event) {
    debugger;
    let data = event.dataItem
    let LienId = data.pLienid;

    this._LienEntryService.DeleteLienRelease(LienId).subscribe(json => {
      debugger;
      if (json) {
        this.BindData();
      }


    })
  }

  SearchRecord(inputValue: string) {
    debugger
    this.LienGridlist = process(this.gridview, {
       filter: {
         logic: "or",
         filters: [
           {
             field: 'pFdaccountno',
             operator: 'contains',
             value: inputValue
           },
           {
             field: 'pLiendate',
             operator: 'contains',
             value: inputValue
           }, {
             field: 'pLienrealsedate',
             operator: 'contains',
             value: inputValue
           },
           {
             field: 'pMembername',
             operator: 'contains',
             value: inputValue
           },
           {
             field: 'pDepositamount',
             operator: 'contains',
             value: inputValue
           },
           {
             field: 'pLienamount',
             operator: 'contains',
             value: inputValue
           },
           {
             field: 'pCompanybranch',
             operator: 'contains',
             value: inputValue
           },
           {
             field: 'pLienadjuestto',
             operator: 'contains',
             value: inputValue
           }
         ],
       }
     }).data;
     this.dataBinding.skip = 0;
   }

   public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.LienGridlist, {
       
        // sort: [{ field: "pLienrealsedate", dir: "desc" }],
      }).data,
   
    };

    return result;
  }
}
