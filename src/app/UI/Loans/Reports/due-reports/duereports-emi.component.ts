import { Component, OnInit, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CommonService } from 'src/app/Services/common.service';
import { DuesReportsService } from 'src/app/Services/Loans/Transactions/dues-reports.service';
import { GroupDescriptor } from '@progress/kendo-data-query';

@Component({
  selector: 'app-duereports-emi',
  templateUrl: './duereports-emi.component.html',
  styles: []
})
export class DuereportsEmiComponent implements OnInit {

  @Input() dueemireports;
  @Input() fromdate;
  @Input() GroupType;
  @Input() todate;
  public gridView: any;
  public installmentreceivableGrid: any;
  public penaltyreceivableGrid: any;
  public loading = false;
  public pPrinciplereceivabletot:any=0;
  public pIntrestreceivabletot:any=0;
  public pInstalmentduetot:any=0;
  public pPenaltyreceivabletot:any=0;
  constructor(private datePipe: DatePipe, private _CommonService: CommonService, private _DueReportsServices: DuesReportsService) { }
  
  ngOnInit() {
    debugger
    // let transdate = this.fromdate;
    // transdate = this.datePipe.transform(transdate, "yyyy-MM-dd");
    let loanid = this.dueemireports['pLoanaccountno'];
    this._DueReportsServices.GetDueReportEmiByDate(loanid, this.fromdate,this.todate,this.GroupType).subscribe(res => {
      this.gridView = res;
      this.installmentreceivableGrid = this.gridView.filter(item => item.pParticularsname === "INSTALLMENT RECEIVABLE");
      let pPrinciplereceivabletots = this.installmentreceivableGrid.reduce((sum, item) => sum + item.pPrinciplereceivable, 0);
      this.pPrinciplereceivabletot = Number(pPrinciplereceivabletots).toFixed(2);
      let pIntrestreceivabletots = this.installmentreceivableGrid.reduce((sum, item) => sum + item.pIntrestreceivable, 0);
      this.pIntrestreceivabletot = Number(pIntrestreceivabletots).toFixed(2);
      let pInstalmentduetots = this.installmentreceivableGrid.reduce((sum, item) => sum + item.pInstalmentdue, 0);
      this.pInstalmentduetot = Number(pInstalmentduetots).toFixed(2)
      this.penaltyreceivableGrid = this.gridView.filter(item => item.pParticularsname === "PENALTY RECEIVABLE");
      this.pPenaltyreceivabletot = this.penaltyreceivableGrid.reduce((sum, item) => sum + item.pPenaltyreceivable, 0).toFixed(2);
    },
      (error) => {
        this.showErrorMessage(error);
      });
  }

  public showErrorMessage(errormsg: string) {
    this._CommonService.showErrorMessage(errormsg);
  }
}
