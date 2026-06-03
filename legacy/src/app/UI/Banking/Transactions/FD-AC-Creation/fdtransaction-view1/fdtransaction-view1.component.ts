import { Component, OnInit, ViewChild } from '@angular/core';
import { FdRdTransactionsService } from 'src/app/Services/Banking/Transactions/fd-rd-transactions.service';
import { CommonService } from 'src/app/Services/common.service';
import { Router } from '@angular/router';
import { process } from '@progress/kendo-data-query';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { RdTransactionsService } from 'src/app/Services/Banking/Transactions/rd-transactions.service';
import { FormBuilder, FormGroup } from '@angular/forms';
declare let $: any

@Component({
  selector: 'app-fdtransaction-view1',
  templateUrl: './fdtransaction-view1.component.html',
  styles: []
})
export class FdtransactionView1Component implements OnInit {
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  UrlName: any;
  pFunctionUrl: any;
  filteresData: any = [];
  filteresData1: any = [];
  constructor(private _fdrdtranscationservice: FdRdTransactionsService, private _commonservice: CommonService, private router: Router, private _rdtranscationservice: RdTransactionsService, private FB: FormBuilder) {
    this.allData = this.allData.bind(this);

  }
  gridview: any = [];
  Editdata: any;
  gridData: any = []
  gridDataSearch: any = []
  droudownsearch: any = []
  public mySelection: string[] = [];
  public pageSize = 5;
  public skip = 0;
  pCreatedby = this._commonservice.pCreatedby
  advSearchform: FormGroup;

  ngOnInit() {
    debugger
    this.Editdata = [];
    this.Getfddata();
    this.UrlName = sessionStorage.UrlName;
    this.pFunctionUrl = sessionStorage.pFunctionUrl;
    console.log(this.UrlName);
    console.log(this.pFunctionUrl);

    this.advSearchform = this.FB.group({

      pSearch: ['']
    });
  }
  Getfddata() {

    debugger;
    this._fdrdtranscationservice.GetFdTransactionData().subscribe(json => {
      debugger;
      this.gridData = json
      this.gridview = this.gridData

      console.log(this.gridview);

      this.filteresData1 = json;

      let data = this.filteresData1

      this.filteresData = this.removeDuplicates(data);

      this.filteresData.sort((a, b) => a.pChitbranchname.localeCompare(b.pChitbranchname));


      this.gridview.filter(function (df) { df.selecteditem = false; });
    })
  }

  removeDuplicates(myArray) {
    debugger
    return myArray.filter(
      (v, i, a) =>
        a.findIndex((t) => t.pChitbranchname === v.pChitbranchname) === i
    );

  }

  Serachadata(event) {
    debugger
    //this.griddataview=[];
    let inputValue = event.pChitbranchname;
    // this.Allocationdata=[];
    // this.Allocationdata = this.Allocationdata.filter(obj => obj.pProjectname == data );
    this.gridview = process(this.gridData, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'pChitbranchname',
            operator: 'contains',
            value: inputValue
          },
        ],
      }
    }).data;
    this.dataBinding.skip = 0;

  }
  removeHandler(event) {

    this._fdrdtranscationservice.DeleteFdTranscation(event.dataItem.pFdaccountNo, this.pCreatedby).subscribe(res => {
      debugger
      if (res) {
        this.Getfddata()
        this._commonservice.showInfoMessage("Deleted Sucessfully")
      }
    })

  }
  editHandler(event) {
    debugger
    // this.router.navigateByUrl('/MaturityRenewal')
    this._fdrdtranscationservice.Newformstatus("edit")

    this._fdrdtranscationservice.GetFdTransactionDetailsforEdit(event.dataItem.pFdaccountNo, event.dataItem.pFdAccountId).subscribe(res => {
      this.Editdata = [];
      this.Editdata = res;
      var paarams = event.dataItem.pFdaccountNo + "," + event.dataItem.pFdAccountId;
      var myparams = btoa(paarams);
      this.router.navigate(['/FdTransactionNew1', { id: myparams }]);
      this._rdtranscationservice.SetDetailsForEdit(this.Editdata)
      //this.fdtr.SetDetailsForEdit(this.Editdata)
      //this.router.navigateByUrl('/FdTransactionNew')
    })

  }
  Newform() {
    // this.newform="new";
    this._fdrdtranscationservice.Newformstatus("new")
  }
  onFilter(inputValue: string) {

    this.gridview = process(this.gridData, {
      filter: {
        logic: "or",
        filters: [
          // {
          //   field: 'pApplicantType',
          //   operator: 'contains',
          //   value: inputValue
          // },
          // {
          //   field: 'pFdname',
          //   operator: 'contains',
          //   value: inputValue
          // },
           {
            field: 'pFdaccountNo',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pInterestPayout',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pMemberName',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pDepositAmount',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pMaturityAmount',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pInterestRate',
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
            field: 'pTransDate',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pTenure',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pChitbranchname',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pStatus',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pVoucherNo',
            operator: 'contains',
            value: inputValue            
          },
          {
            field: 'pPaymentDate',
            operator: 'contains',
            value: inputValue                
          },
          {
            field: 'pRenewalId',
            operator: 'contains',
            value: inputValue                
          },
          {
            field: 'pRenewalDate',
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
