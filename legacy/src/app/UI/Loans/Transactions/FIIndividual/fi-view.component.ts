import { Component, OnInit, ViewChild } from '@angular/core';
import { FIIndividualService } from 'src/app/Services/Loans/Transactions/fiindividual.service';
import { CommonService } from 'src/app/Services/common.service';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { SelectableSettings } from '@progress/kendo-angular-grid';
import { State, GroupDescriptor, DataResult, process } from '@progress/kendo-data-query';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { DataBindingDirective } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-fi-view',
  templateUrl: './fi-view.component.html',
  styles: []
})
export class FiViewComponent implements OnInit {
  fiViewData = [];
  public gridData: any[] = [];
  public gridView: any = [];
  public mySelection: string[] = [];
  public pageSize = 10;
  public skip = 0;
  public headerCells: any = {
    textAlign: 'center'
  };
  private data: Object[];
  dateFormat = 'dd/MM/yyyy';
  loading: boolean = false;
  public groups: GroupDescriptor[] = [{ field: 'pDateofapplication',dir:'desc' }];
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  constructor(private fiIndividualService: FIIndividualService,
    private router: Router, private datePipe: DatePipe,
    private _commonService: CommonService) {
      this.allData = this.allData.bind(this);
     }

  ngOnInit() {
    
    this.getAllFiIndividualData();
  }

  public removeHandler({ dataItem }) {
    

    const index: number = this.fiViewData.indexOf(dataItem);
    if (index !== -1) {
      this.fiViewData.splice(index, 1);
    }
  }

  public allData(): ExcelExportData {
    const result: ExcelExportData =  {
        data: process(this.gridView, { group: this.groups, sort: [{ field: 'pDateofapplication', dir: 'desc' }] }).data,
        group: this.groups
    };

    return result;
}

  getAllFiIndividualData() {
    
    this.loading = true;
    this.fiIndividualService.getAllFiIndividualDataForView().subscribe((response: any) => {
      //console.log("responnse for view : ", response);
      for (let index = 0; index < response.length; index++) {
        response[index].pDateofapplication = this.datePipe.transform(this._commonService.formatDateFromDDMMYYYY(response[index].pDateofapplication), this.dateFormat);
        // response[index].pDateofapplication = this.datePipe.transform(response[index].pDateofapplication, this.dateFormat);
        //response[index].pAmountrequested = response[index].pAmountrequested.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
        response[index].pAmountrequested=this._commonService.currencyformat(response[index].pAmountrequested);
        let id = {
          "sno": index + 1,
        }
        var dataResponse = Object.assign(id, response[index]);
       
        this.gridData.push(dataResponse);
        this.gridView = this.gridData;

      }
      this.loading = false;
      //this.loadFiDatas();
    }, (err) => {
      this.loading = false;
    })
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

  editHandler(event) {
    debugger
    //console.log("event : ", event);
    let vchApplicationId = btoa(event.dataItem.pVchapplicationid);
    this.router.navigateByUrl('Fiindividual/' + vchApplicationId);
  }

  public onFilter(inputValue: string): void {
    this.gridView = process(this.gridData, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'sno',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pVchapplicationid',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pDateofapplication',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pApplicantname',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pLoanname',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pAmountrequested',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pTenureofloan',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pLoanpayin',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pRateofinterest',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pStatusname',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pLoantype',
            operator: 'contains',
            value: inputValue
          }
        ],
      }
    }).data;

     this.dataBinding.skip = 0;
  }
}
