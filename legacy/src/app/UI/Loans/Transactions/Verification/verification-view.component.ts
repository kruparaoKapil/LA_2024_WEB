import { Component, OnInit, ViewChild } from '@angular/core';
import { VerificationService } from 'src/app/Services/Loans/Transactions/verification.service';
import { CommonService } from '../../../../Services/common.service';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { State, process, GroupDescriptor } from '@progress/kendo-data-query';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { DataBindingDirective } from '@progress/kendo-angular-grid';


declare let $: any
@Component({
  selector: 'app-verification-view',
  templateUrl: './verification-view.component.html',
  styles: []
})
export class VerificationViewComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  public loading = false;
  gridData: any;
  GridDataTemp: any
  pagesize: 10;
  loanamount: any;
  public groups: GroupDescriptor[] = [{ field: 'pdateofapplication', dir: 'desc', aggregates: [{ field: "pLoanAmount", aggregate: "sum" }] }];
  public gridState: State = {
    sort: [],
    take: 10
  };
  public headerCells: any = {
    textAlign: 'center'
  };
  constructor(private _VerificationService: VerificationService, private _commonService: CommonService, private router: Router) {
    this.allData = this.allData.bind(this);
  }

  ngOnInit() {

    this.loading = true;
    this._VerificationService.GetAllApplicantVerificationDetails().subscribe(res => {
     if(res){
      this.gridData = res;
      this.GridDataTemp = res
      this.getColumnWisetotals();
      
     }
      this.loading = false;
    });
  }
  TeleVerif(data, VorNoV) {

    this._VerificationService._addDataToVerification(data, "Televerification");
    // var myparams  = btoa( data.pVchapplicationid);
    if (VorNoV == "NotVerified") { this.router.navigate(['/Televerification', { id: btoa(data.pvchapplicationid) }]); }
  }
  FieldVerif(data, VorNoV) {

    this._VerificationService._addDataToVerification(data, "FieldVerification");
    if (VorNoV == "NotVerified") { this.router.navigate(['/Fieldverification', { id: btoa(data.pvchapplicationid) }]); }
  }
  DocumentVerif(data, VorNoV) {

    this._VerificationService._addDataToVerification(data, "DocumentVerification");
    if (VorNoV == "NotVerified") { this.router.navigate(['/Documentverification', { id: btoa(data.pvchapplicationid) }]); }


  }

  getColumnWisetotals() {
    debugger;
    if (this.gridData.length > 0) {
      this.loanamount = (this.gridData.reduce((sum, c) => sum + c.pLoanAmount, 0));
      this.loanamount = parseFloat(this.loanamount)
    }
  }
  SearchRecord(inputValue: string): void {

    this.gridData = process(this.GridDataTemp, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'pvchapplicationid',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pLoantype',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pApplicantName',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pbusinessentitycontactno',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pdateofapplication',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pvchapplicationid',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pLoanAmount',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pLoanName',
            operator: 'contains',
            value: inputValue
          }

        ],
      }
    }).data;

    this.dataBinding.skip = 0;
  }
  public group: any[] = [{
    field: 'preceiptdate'
  }];

  public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.gridData, { group: this.group, sort: [{ field: 'pdateofapplication', dir: 'desc' }] }).data,
      group: this.group
    };

    return result;
  }

}
