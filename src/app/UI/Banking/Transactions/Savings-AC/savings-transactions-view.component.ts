import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectableSettings, GridDataResult,DataBindingDirective} from '@progress/kendo-angular-grid';
import { CommonService } from '../../../../Services/common.service';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { State, process, GroupDescriptor, DataResult } from '@progress/kendo-data-query';
import { SavingtranscationService } from 'src/app/Services/Banking/savingtranscation.service';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { RdTransactionsService } from 'src/app/Services/Banking/Transactions/rd-transactions.service';
@Component({
  selector: 'app-savings-transactions-view',
  templateUrl: './savings-transactions-view.component.html',
  styles: []
})
export class SavingsTransactionsViewComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  public SavingAccountTransactionList: any[];
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
  constructor(private _commonService: CommonService, private savingtranscationservice: SavingtranscationService, private router: Router,private ActRoute: ActivatedRoute,private _rdtranscationservice:RdTransactionsService) {
     this.allData = this.allData.bind(this);
   }

  ngOnInit() {
    this.getLoadData();
  }
  getLoadData() {

    this.savingtranscationservice.GetSavingAccountTransactionMainGrid().subscribe(json => {
    debugger;
      //console.log(json)
      if (json != null) {
        this.gridData = json
      
        this.SavingAccountTransactionList = this.gridData;
      }
    },
      (error) => {

        this._commonService.showErrorMessage(error);
      });
  }
  NewButtonClick(type) {
    debugger
    this.savingtranscationservice.SetButtonClickType(type)
  }
  datatableclickedit(event) {
    debugger;
    //this.MemberReferenceID=event.dataItem.pMembercode
    let Recordid = event.dataItem.pSavingaccountid;
    this.savingtranscationservice.SetButtonClickType('Edit')
  let  accounttype= 'Savings Transaction';
  let  savingsaccountNo= event.dataItem.pSavingaccountno;
    this.savingtranscationservice.GetSavingAccountTransDetails(Recordid,accounttype,savingsaccountNo).subscribe(res => {
      debugger;
      var myparams = btoa(event.dataItem.pSavingaccountid);
      this._rdtranscationservice.SetDetailsForEdit('');
      this.savingtranscationservice.SetSavingTransactionDetailsForEdit(res)
    //  let data=Object.assign({}, res);
    Object.assign(res, {pIsJointMembersapplicable:res['pIsjointapplicable'],pIsReferralsapplicable:res['pIsreferralapplicable']});
      this._rdtranscationservice.SetDetailsForEdit(res)
      //this.router.navigateByUrl(['/SavingsTransactionsNew', { id: myparams }]);
             this.router.navigate(['/SavingsTransactionsNew', { id: myparams }]);

    })
  }
  removeHandler(event) {
    debugger;
    let data = event.dataItem
    let savingaccountid = data.pSavingaccountid;
    let Modifiedby = this._commonService.pCreatedby;
    this.savingtranscationservice.DeleteSavingTransaction(data.pSavingaccountid, Modifiedby).subscribe(json => {
      debugger;
      if (json) {
        this._commonService.showInfoMessage('Deleted Successfully');
        this.getLoadData();
      }
      else{
        this._commonService.showErrorMessage('Not Deleted...');
      }

    })
  }
  SearchRecord(inputValue: string) {

    this.SavingAccountTransactionList = process(this.gridData, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'pMembertype',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pApplicanttype',
            operator: 'contains',
            value: inputValue
          }, {
            field: 'pTransdate',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pContacttype',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pMembername',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pSavingaccname',
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
      data: process(this.gridData, {}).data
    };

    return result;
  }
}
