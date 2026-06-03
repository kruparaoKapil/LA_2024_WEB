import { Component, OnInit, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CommonService } from 'src/app/Services/common.service';
@Component({
  selector: 'app-collection-reports-detail-section',
  templateUrl: './collection-reports-detail-section.component.html',
  styles: []
})
export class CollectionReportsDetailSectionComponent implements OnInit {
  
  @Input() collectionreports;
  @Input() startDatesReport;
  @Input() endDatesReport;
  public gridDataDetails: any = [];
  public gridViewDetails: any = [];
  public totalReceiptamount: any;
  ApplicantId:any;
  LoanType:any;
  ApplicantName:any;
  constructor(private datePipe: DatePipe, private _CommonService: CommonService) { }

  ngOnInit() {
    debugger
    this.ApplicantId = this.collectionreports.pVchapplicationid;
    this.LoanType = this.collectionreports.pLoantype;
    this.ApplicantName = this.collectionreports.pApplicantname;

    this._CommonService.GetCollectiondetails(this.startDatesReport, this.endDatesReport, this.ApplicantId).subscribe(json => {
      
      this.gridDataDetails = json;
      this.gridViewDetails = this.gridDataDetails;
      this.totalReceiptamount = this.gridViewDetails.reduce((sum, c) => sum + c.pReceiptamount, 0);
    });
  }


}
