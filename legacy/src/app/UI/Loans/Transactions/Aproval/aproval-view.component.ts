import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../../../../Services/common.service';
import { ApprovalService } from "../../../../Services/Loans/Transactions/approval.service"
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { State, process, GroupDescriptor } from '@progress/kendo-data-query';
import { HttpParams } from "@angular/common/http"
import { DataBindingDirective } from '@progress/kendo-angular-grid';




@Component({
  selector: 'app-aproval-view',
  templateUrl: './aproval-view.component.html',
  styles: []
})
export class AprovalViewComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  public loading = false;
  LoansDataNew: any
  LoansDataApproved: any
  LoansDataRejected: any
  loanamount1: any;
  loanamount2: any;
  loanamount3: any;
  LoansDataNewTemp: any
  LoansDataApprovedTemp: any
  LoansDataRejectedTemp: any

  LoansCountNew: any
  LoansCountApproved: any
  LoansCountRejected: any

  SelectedTabType: any
  public headerCells: any = {
    textAlign: 'center'
  };
  public groups: GroupDescriptor[] = [{ field: 'pDateofapplication', dir: 'desc', aggregates: [{ field: "pAmountrequested", aggregate: "sum" }], }];
  public groupsApproved: GroupDescriptor[] = [{ field: 'pDateofapplication', dir: 'desc', aggregates: [{ field: "pApprovedloanamount", aggregate: "sum" }], }];
  constructor(private _ApprovalService: ApprovalService, private router: Router) { }

  ngOnInit() {

    debugger;
    this.loading = true
    this.LoansDataNew = []
    this.LoansDataApproved = []
    this.LoansDataRejected = []
    this.SelectedTabType = "New"

    this._ApprovalService.GetApprovalsDataByStatus("New").subscribe(data => {

      this.LoansDataNew = data     
      this.LoansDataNewTemp = data
      this.LoansCountNew = this.LoansDataNew.length
      this.getColumnWisetotals1();
      this.loading = false
    })

    this._ApprovalService.GetApprovalsDataByStatus("Approved").subscribe(data => {

      this.LoansDataApproved = data
      this.LoansDataApprovedTemp = data
      this.LoansCountApproved = this.LoansDataApproved.length
      this.getColumnWisetotals2();
    })
    this._ApprovalService.GetApprovalsDataByStatus("Rejected").subscribe(data => {

      this.LoansDataRejected = data
      this.LoansDataRejectedTemp = data
      this.LoansCountRejected = this.LoansDataRejected.length
      this.getColumnWisetotals3();
    })


  }

  SelectTab(type) {
debugger
    this.loading = true
    if (type == "New") {
      this.SelectedTabType = type
      this._ApprovalService.GetApprovalsDataByStatus(type).subscribe(data => {
        this.LoansDataNew = data
        this.LoansCountNew = this.LoansDataNew.length
        this.getColumnWisetotals1();
        this.loading = false


      })
    } else if (type == "Approved") {
      this.SelectedTabType = type
      this._ApprovalService.GetApprovalsDataByStatus(type).subscribe(data => {
        this.LoansDataApproved = data
        this.LoansCountApproved = this.LoansDataApproved.length
        this.getColumnWisetotals2();
        this.loading = false
      })
    } else if (type == "Rejected") {
      this.SelectedTabType = type
      this._ApprovalService.GetApprovalsDataByStatus(type).subscribe(data => {
        this.LoansDataRejected = data
        this.LoansCountRejected = this.LoansDataRejected.length
        this.getColumnWisetotals3();
        this.loading = false
      })
    }
  }
  getColumnWisetotals1() {
    debugger;
    if (this.LoansDataNew.length > 0) {
      this.loanamount1 = (this.LoansDataNew.reduce((sum, c) => sum + c.pAmountrequested, 0));
      this.loanamount1 = parseFloat(this.loanamount1)
    }

  }
  getColumnWisetotals2() {
    debugger;
    if (this.LoansDataApproved.length > 0) {
      this.loanamount2 = (this.LoansDataApproved.reduce((sum, c) => sum + c.pApprovedloanamount, 0));
      this.loanamount2 = parseFloat(this.loanamount2)
    }

  }
  getColumnWisetotals3() {
    debugger;
    if (this.LoansDataRejected.length > 0) {
      this.loanamount3 = (this.LoansDataRejected.reduce((sum, c) => sum + c.pAmountrequested, 0));
      this.loanamount3 = parseFloat(this.loanamount3)
    }

  }
  SelectLoan(data, status) {

    var myparams = btoa(data.pVchapplicationid);
    if (status == "NotApproved") { this.router.navigate(['/AprovalNew', { id: myparams }]); }
    //if (status == "NotApproved") { this.router.navigate(['/AprovalNew', { queryParams: data.pVchapplicationid ,skipLocationChange: true}]); }

  }


  SearchRecord(inputValue: string) {

    // let a=inputValue.key

    if (this.SelectedTabType == "New") {


      this.LoansDataNew = process(this.LoansDataNewTemp, {
        filter: {
          logic: "or",
          filters: [
            {
              field: 'pVchapplicationid',
              operator: 'contains',
              value: inputValue
            },
            {
              field: 'pLoanname',
              operator: 'contains',
              value: inputValue
            },
            {
              field: 'pApplicantname',
              operator: 'contains',
              value: inputValue
            },
            {
              field: 'pMobileno',
              operator: 'contains',
              value: inputValue
            },
            {
              field: 'pAmountrequested',
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


    } else if (this.SelectedTabType == "Approved") {

      this.LoansDataApproved = process(this.LoansDataApprovedTemp, {
        filter: {
          logic: "or",
          filters: [
            {
              field: 'pVchapplicationid',
              operator: 'contains',
              value: inputValue
            },
            {
              field: 'pLoanname',
              operator: 'contains',
              value: inputValue
            },
            {
              field: 'pApplicantname',
              operator: 'contains',
              value: inputValue
            },
            {
              field: 'pMobileno',
              operator: 'contains',
              value: inputValue
            },
            {
              field: 'pAmountrequested',
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

    } else if (this.SelectedTabType == "Rejected") {

      this.LoansDataRejected = process(this.LoansDataRejectedTemp, {
        filter: {
          logic: "or",
          filters: [
            {
              field: 'pVchapplicationid',
              operator: 'contains',
              value: inputValue
            },
            {
              field: 'pLoanname',
              operator: 'contains',
              value: inputValue
            },
            {
              field: 'pApplicantname',
              operator: 'contains',
              value: inputValue
            },
            {
              field: 'pMobileno',
              operator: 'contains',
              value: inputValue
            },
            {
              field: 'pAmountrequested',
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

    }
    this.dataBinding.skip = 0;
  }

  onFilterNotsend(inputValue: string) {

    this.LoansDataNew = process(this.LoansDataNewTemp, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'pVchapplicationid',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pLoanname',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pApplicantname',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pMobileno',
            operator: 'contains',
            value: inputValue
          }

        ],
      }
    }).data;
  }

}
