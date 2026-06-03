import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../../../../Services/common.service';
import { Router } from '@angular/router';
import { DisbusementService } from '../../../../Services/Loans/Transactions/disbusement.service';
import { State, process, GroupDescriptor } from '@progress/kendo-data-query';
import { DataBindingDirective } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-disbursement-view',
  templateUrl: './disbursement-view.component.html',
  styles: []
})
export class DisbursementViewComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  public GridApprovedLoanlist = [];
  public GridToataldisbursedlist = [];
  public Gridpartdisbursedlist = [];
  public Gridstagedisbursedlist = [];
  Sanctionedamount: any;
  Disbursementamount: any;
  partSanctionedamount: any;
  partDisbursementamount: any;
  partpayable: any;
  stagewiseSanctionedamount: any;
  stagewiseDisbursementamount: any;
  stagewisepayable: any;
  public groups: GroupDescriptor[] = [{ field: 'ploanname', aggregates: [{ field: "ploanapprovedamount", aggregate: "sum" }] }];
  public groupstotaldisbursed: GroupDescriptor[] = [{ field: 'ploanname', aggregates: [{ field: "pdisbursementamount", aggregate: "sum" }] }];
  public groupsPartAmountDisbursed: GroupDescriptor[] = [{ field: 'ploanname', aggregates: [{ field: "ploanapprovedamount", aggregate: "sum" }, { field: "pdisbursementamount", aggregate: "sum" }, { field: "pdisbursementbalance", aggregate: "sum" }] }];
  public groupsStagewiseDisbursed: GroupDescriptor[] = [{ field: 'ploanname', aggregates: [{ field: "ploanapprovedamount", aggregate: "sum" }, { field: "pdisbursementamount", aggregate: "sum" }, { field: "pdisbursementbalance", aggregate: "sum" }] }];

  constructor(private _commonService: CommonService, private _routes: Router, private _DisbusementService: DisbusementService) { }

  papprovedloanslist = [];
  ptotaldisbusedlist = [];
  ppartdisbursedlist = [];
  pstagedisbursedlist = [];

  ngOnInit() {
    debugger;
    this.GetDisbursementViewData();
  }
  GetDisbursementViewData() {

    this._DisbusementService.GetDisbursementViewData().subscribe(json => {
      debugger;
      //console.log(json)
      if (json != null) {

        this.GridApprovedLoanlist = json.papprovedloanslist;

        this.papprovedloanslist = this.GridApprovedLoanlist;
        this.getColumnWisetotalsapproved()
        this.GridToataldisbursedlist = json.ptotaldisbusedlist;
        this.ptotaldisbusedlist = this.GridToataldisbursedlist;
        this.getColumnWisetotalstotaldisbusedlist()
        this.Gridpartdisbursedlist = json.ppartdisbursedlist;
        this.ppartdisbursedlist = this.Gridpartdisbursedlist;
        this.getColumnWisetotalspartdisbursedlist()
        this.Gridstagedisbursedlist = json.pstagedisbursedlist;
        this.pstagedisbursedlist = this.Gridstagedisbursedlist;
        this.getColumnWisetotalsstagedisbursedlist()

        //this.lstLoanTypes = json
        //this.titleDetails = json as string
        //this.titleDetails = eval("(" + this.titleDetails + ')');
        //this.titleDetails = this.titleDetails.FT;
      }
    },
      (error) => {

        this._commonService.showErrorMessage(error);
      });
  }

  public onFilter(inputValue: string): void {
    this.papprovedloanslist = process(this.GridApprovedLoanlist, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'pvchapplicationid',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'ploantype',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'ploanname',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'papplicantname',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pcontactno',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'ploanapprovedamount',
            operator: 'contains',
            value: inputValue
          }
        ],
      }
    }).data;

    this.dataBinding.skip = 0;
  }
  getColumnWisetotalsapproved() {
    debugger;
    if (this.papprovedloanslist.length > 0) {
      this.Sanctionedamount = (this.papprovedloanslist.reduce((sum, c) => sum + c.ploanapprovedamount, 0));
      this.Sanctionedamount = parseFloat(this.Sanctionedamount)
    }
  }
  getColumnWisetotalstotaldisbusedlist() {
    debugger;
    if (this.ptotaldisbusedlist.length > 0) {
      this.Disbursementamount = (this.ptotaldisbusedlist.reduce((sum, c) => sum + c.pdisbursementamount, 0));
      this.Disbursementamount = parseFloat(this.Disbursementamount)
    }
  }
  getColumnWisetotalspartdisbursedlist() {
    debugger;
    if (this.ppartdisbursedlist.length > 0) {
      this.partSanctionedamount = (this.ppartdisbursedlist.reduce((sum, c) => sum + c.ploanapprovedamount, 0));
      this.partSanctionedamount = parseFloat(this.partSanctionedamount)
      this.partDisbursementamount = (this.ppartdisbursedlist.reduce((sum, c) => sum + c.pdisbursementamount, 0));
      this.partDisbursementamount = parseFloat(this.partDisbursementamount)
      this.partpayable = (this.ppartdisbursedlist.reduce((sum, c) => sum + c.pdisbursementbalance, 0));
      this.partpayable = parseFloat(this.partpayable)
    }
  }
  getColumnWisetotalsstagedisbursedlist() {
    debugger;
    if (this.pstagedisbursedlist.length > 0) {
      this.stagewiseSanctionedamount = (this.pstagedisbursedlist.reduce((sum, c) => sum + c.ploanapprovedamount, 0));
      this.stagewiseSanctionedamount = parseFloat(this.stagewiseSanctionedamount)
      this.stagewiseDisbursementamount = (this.pstagedisbursedlist.reduce((sum, c) => sum + c.pdisbursementamount, 0));
      this.stagewiseDisbursementamount = parseFloat(this.stagewiseDisbursementamount)
      this.stagewisepayable = (this.pstagedisbursedlist.reduce((sum, c) => sum + c.pdisbursementbalance, 0));
      this.stagewisepayable = parseFloat(this.stagewisepayable)
    }
  }
  public onFiltertotaldisbursed(inputValue: string): void {
    this.ptotaldisbusedlist = process(this.GridToataldisbursedlist, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'pvchapplicationid',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'ploantype',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'ploanname',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'papplicantname',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pcontactno',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pdisbursementamount',
            operator: 'contains',
            value: inputValue
          }
        ],
      }
    }).data;

    this.dataBinding.skip = 0;
  }

  public onFilterpartdisbursed(inputValue: string): void {
    this.ppartdisbursedlist = process(this.Gridpartdisbursedlist, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'pvchapplicationid',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'ploantype',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'ploanname',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'papplicantname',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pcontactno',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pdisbursementamount',
            operator: 'contains',
            value: inputValue
          }
        ],
      }
    }).data;

    this.dataBinding.skip = 0;
  }


  public onFilterstagedisbursed(inputValue: string): void {
    this.pstagedisbursedlist = process(this.Gridstagedisbursedlist, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'pvchapplicationid',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'ploantype',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'ploanname',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'papplicantname',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pcontactno',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pdisbursementamount',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'ploanapprovedamount',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pdisbursementbalance',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pendingstatgesno',
            operator: 'contains',
            value: inputValue
          }
        ],
      }
    }).data;

    this.dataBinding.skip = 0;
  }

  encrypt(data) {
    debugger
    let id = btoa(data)
    //  alert(id)
    return id

  }


}
