import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountingMastresService } from 'src/app/Services/Accounting/accounting-mastres.service';
import { Router } from '@angular/router';
import { State, process, GroupDescriptor } from '@progress/kendo-data-query';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { DataBindingDirective } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-bank-view',
  templateUrl: './bank-view.component.html',
  styles: []
})
export class BankViewComponent implements OnInit 
{
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  recordid: any;
  newform = false;
  public gridState: State = {
    sort: [],
    take: 10
  };
  public loading = false;
  public pageSize = 10;
  public headerCells: any = {
    textAlign: 'center'
  };
  gridData: any = [];
  gridView: any = []
  constructor(private accountingmasterservice: AccountingMastresService, private router: Router) { }

  ngOnInit() {
    
    this.loading = true;
    this.accountingmasterservice.viewbankinformation().subscribe(data => {
      
      // console.log(data)
      //  let Data:any=[]
      //     Data=data;
      // data=this.gridData
      //  for(let i=0;i<Data.length;i++){
      //  //  Data[i].pStatusname="In-Active"
      //    if(Data[i].pStatusname=="Active"){
      //      Data[i]['ptoggle']=true;
      //    }
      //    else{
      //     Data[i]['ptoggle']=false;
      //    }
      //  }
     
      this.gridView = data;
      this.gridData = this.gridView;
      this.loading = false;
    })
  }
  newschemeform() {
    // this.newform="new";
    this.accountingmasterservice.newformstatus("new")
  }
  editClick(event) {
    //console.log(event.dataItem)
  }
  editHandler(event) {
    ;
    this.router.navigate(['/BankMaster']);
    this.accountingmasterservice.newformstatus("edit")
    //console.log(event.dataItem)
    this.recordid = event.dataItem.pRecordid
    this.accountingmasterservice.getbankdetails(this.recordid)
  }
  public group: any[] = [{
    field: 'pBankname'
  }];

  public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.gridData, { group: this.group, sort: [{ field: 'pBankname', dir: 'desc' }] }).data,
      group: this.group
    };

    return result;
  }

  addHandler(event) {
    //console.log(event)
  }
  
  public onFilter(inputValue: string): void {
    this.gridData = process(this.gridView, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'pBankname',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pAccountnumber',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pAccountname',
            operator: 'contains',
            value: inputValue
          },


        ],
      }
    }).data;
    this.dataBinding.skip = 0;
  }
}
