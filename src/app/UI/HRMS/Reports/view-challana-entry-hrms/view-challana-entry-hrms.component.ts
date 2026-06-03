import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/Services/common.service';
import { ProfessionaltaxService } from 'src/app/Services/HRMS/Reports/professionaltax.service';
import { EmployeeAttendanceService } from 'src/app/Services/HRMS/Transactions/employee-attendance.service';
import { State, process} from '@progress/kendo-data-query';


@Component({
  selector: 'app-view-challana-entry-hrms',
  templateUrl: './view-challana-entry-hrms.component.html',
  styles: []
})
export class ViewChallanaEntryHrmsComponent implements OnInit {
  gridData: any = [];
  totalChallanaAmount: any;
  public pageSize = 10; public gridState: State = {
      sort: [],
      take: 10
    };
    public headerCells: any = {
      textAlign: 'center'
    };

  constructor(private challanaService: EmployeeAttendanceService, private commonService:CommonService, private datePipe:DatePipe, private _ProfessionalTaxService:ProfessionaltaxService) { }

  ngOnInit() {
    this.viewHrmsChallana();
  }

  viewHrmsChallana(){
    debugger;
    this.challanaService.viewHrmsChallana().subscribe(res => {
      this.gridData = res;
      this.totalChallanaAmount = this.gridData.reduce((sum, c) => sum + parseFloat(c.pchallanamount), 0);

    })
  }

 pdfOrprint(printorpdf) {
    debugger;
    if (this.gridData.length > 0) {
      let rows = [];
      let reportname = "Challana Entry";

      let gridheaders = ["Challana Type", "Challana Date", "Challana No.", "Challana Amount", "Challana Month"];
      let format = "";
      let fromDate = "";
      let toDate = new Date();

      let colWidthHeight = {
        0: { cellWidth: '20', halign: 'center' }, 1: { cellWidth: '30', halign: 'center' }, 2: { cellWidth: '25', halign: 'center' }, 3: { cellWidth: '30', halign: 'right' }, 4: { cellWidth: 20, halign: 'center' }
      }
      this.gridData.forEach(element => {
        debugger;
        let temp;
        let pchallanamount = this.commonService.currencyformat(element.pchallanamount);
        
        let challanaDate = this.datePipe.transform(element.pchallandate, 'dd-MM-yyyy') ;
     
        temp = [element.pchallantype, challanaDate, element.pchallanno,pchallanamount,element.pchallanmonth];
        rows.push(temp);
      });
      //Grand Totals
      let gridtotals={};
      gridtotals['grandtotal'] = this.commonService.currencyformat(this.totalChallanaAmount);
      let total=["","","Total : ",gridtotals['grandtotal'],"",""];
      rows.push(total);

      this._ProfessionalTaxService._downLoadChallanaEntryPDF(reportname, rows, gridheaders, colWidthHeight, "landscape", "", fromDate, toDate, printorpdf);
    }
    else {
      this.commonService.showInfoMessage("No Data");
    }
  }

}
