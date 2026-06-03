import { Component, OnInit, ViewChild } from '@angular/core';
//import { MaturityPaymentService } from '../../../../Services/Banking/Transactions/maturity-payment.service';
import { Router } from '@angular/router';
import { Page } from 'src/app/UI/Common/Paging/page';
//import { FdTranscationDetailsComponent } from '../FD-AC-Creation/fd-transcation-details.component';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { process } from '@progress/kendo-data-query';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { FdTranscationDetailsComponent } from '../../FD-AC-Creation/fd-transcation-details.component';
import { MaturityPaymentService } from 'src/app/Services/Banking/Transactions/maturity-payment.service';
declare let $: any

@Component({
  selector: 'app-maturity-renewal-view',
  templateUrl: './maturity-renewal-view.component.html',
  styles: []
})
export class MaturityRenewalViewComponent implements OnInit {
@ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  @ViewChild(FdTranscationDetailsComponent, { static: true }) fdTranscationDetailsComponent: FdTranscationDetailsComponent;
  GridList: any;
  GridView: any = [];
  constructor(private _MaturityPaymentService: MaturityPaymentService, private router: Router) {
    this.allData = this.allData.bind(this);

  }
  commencementgridPage = new Page();
  startindex: any;
  endindex: any
  ngOnInit() {
    debugger;
    this.commencementgridPage.pageNumber = 0
    this.commencementgridPage.size = 10;
    this.startindex = 0;
    this.endindex = this.commencementgridPage.size;
    this.commencementgridPage.totalElements = 5;
    this.BindData();
  }
  BindData() {
    this._MaturityPaymentService.GetMaturityRenewalDetailsView().subscribe(res => {
      this.GridList = res;
      this.GridView = this.GridList;
    });
  }
  GetAccountDetails(DataItem) {
    debugger;

    this.fdTranscationDetailsComponent.BindData(DataItem.pFdaccountno, DataItem.pFdaccountID);
    $('#add-detail').modal('show');
  }

  public SearchRecord(inputValue: string): void {
    this.GridList = process(this.GridView, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'pMembername',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pMembercode',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pFdaccountno',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pMaturitypaymentdate',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pDepositdate',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pDepositamount',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pMaturityamount',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pInterestpayout',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pTenure',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pPaidAmount',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pPaymentType',
            operator: 'contains',
            value: inputValue
          },
          // {
          //   field: 'pRenewal_fdaccountid',
          //   operator: 'contains',
          //   value: inputValue
          // },
          {
            field: 'pRenewal_fdaccountno',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pRenewal_membername',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pRenewal_chitbranchname',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pagent_name',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pRenewal_depositdate',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pRenewal_maturitydate',
            operator: 'contains',
            value: inputValue
          },

        ],
      }
    }).data;

    this.dataBinding.skip = 0;
  }

  public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.GridList, {

        // sort: [{ field: "pLienrealsedate", dir: "desc" }],
      }).data,

    };

    return result;
  }
}
