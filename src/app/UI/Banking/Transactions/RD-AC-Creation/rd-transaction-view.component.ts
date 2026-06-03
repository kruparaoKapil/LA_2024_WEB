import { Component, OnInit, ViewChild } from '@angular/core';
import { FdRdTransactionsService } from 'src/app/Services/Banking/Transactions/fd-rd-transactions.service';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { CommonService } from 'src/app/Services/common.service';
import { Router } from '@angular/router';
import { process } from '@progress/kendo-data-query';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { RdTransactionsService } from 'src/app/Services/Banking/Transactions/rd-transactions.service';
declare let $: any
@Component({
  selector: 'app-rd-transaction-view',
  templateUrl: './rd-transaction-view.component.html',
  styles: []
})
export class RdTransactionViewComponent implements OnInit {

  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  constructor(private _rdtranscationservice:RdTransactionsService,private _commonservice:CommonService,private router:Router) {
     this.allData = this.allData.bind(this);
   }
  gridview:any=[];
  Editdata:any;
  gridData:any=[]
  public mySelection: string[] = [];
  public pageSize = 5;
  public skip = 0;
  pCreatedby=this._commonservice.pCreatedby
  ngOnInit() 
  {
    this.Editdata=[];
    this.Getrddata()
  }
  Getrddata()
  {

    debugger;
    this._rdtranscationservice.GetRdTransactionData().subscribe(json => {
      console.log(json);
      this.Editdata=[];
      this.gridData = json;
      this.gridview = this.gridData;
   })
  }
  removeHandler(event)
  {
   debugger
    this._rdtranscationservice.DeleteRdTransactions(event.dataItem.pRdaccountNo,this.pCreatedby).subscribe(res=>
      {
        debugger
      if(res)
      {
        this.Getrddata()
        this._commonservice.showInfoMessage("Deleted Sucessfully")
      }
    })

  }
  editHandler(event)
  {
    debugger
   // this.router.navigateByUrl('/MaturityRenewal')
    this._rdtranscationservice.Newformstatus("edit")
    
     this._rdtranscationservice.GetRdTransactionDetailsforEdit(event.dataItem.pRdaccountNo,event.dataItem.pRdAccountId,'RD Transaction').subscribe(res=>{
       this.Editdata=res;
       
       var paarams=event.dataItem.pRdaccountNo+","+event.dataItem.pRdAccountId;
       var myparams = btoa(paarams);
       this.router.navigate(['/RdTransactionNew', { id: myparams }]);
       this._rdtranscationservice.SetDetailsForEdit(this.Editdata)
       //this.router.navigateByUrl('/FdTransactionNew')
     })
    
  }
  Newform() {
    // this.newform="new";
    this._rdtranscationservice.Newformstatus("new")
  }
  onFilter(inputValue: string) {

    this.gridview = process(this.gridData, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'pMemberType',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pApplicantType',
            operator: 'contains',
            value: inputValue
          }, {
            field: 'pRdname',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pRdaccountNo',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pMemberName',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pDepositDate',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pMaturityDate',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pTenure',
            operator: 'contains',
            value: inputValue
          }
        ],
      }
    }).data;
    this.dataBinding.skip = 0;
  }
public allData(): ExcelExportData {
    const result: ExcelExportData =  {
        data: process(this.gridData, { }).data
    };

    return result;
}
}
