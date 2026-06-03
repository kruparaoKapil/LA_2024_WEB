import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/Services/common.service';
import { SelfAdjustmentService } from 'src/app/Services/Banking/Transactions/self-adjustment.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { GroupDescriptor, process } from '@progress/kendo-data-query';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { FdTranscationDetailsComponent } from '../FD-AC-Creation/fd-transcation-details.component';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
declare let $: any
@Component({
  selector: 'app-self-or-adjustment-view',
  templateUrl: './self-or-adjustment-view.component.html',
  styles: []
})
export class SelfOrAdjustmentViewComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  @ViewChild(FdTranscationDetailsComponent, { static: true }) fdTranscationDetailsComponent: FdTranscationDetailsComponent;
  selfView: boolean = false;
  adjustementView: boolean = false;
  constructor(private _selfadjustmentservice: SelfAdjustmentService, private datePipe: DatePipe, private router: Router) {
    this.allData = this.allData.bind(this);

  }
  gridData: any = []
  gridview: any = [];
  Editdetails: any;
  hidegridcolumn: boolean = false;
  Type: any;

  public group: GroupDescriptor[] = [{ field: 'pPaymenttype' }];

  ngOnInit() {
    this.GetViewdata()
    this.Type = 'SELF';
    this.selfViewClick();

  }

  selfViewClick() {
    debugger
    this.Type = "SELF";

    this.selfView = true;
    this.adjustementView = false;

    this.GetViewdata();

  }

  adjustementViewClick() {
    debugger;
    this.Type = "ADJUSTEMENT";

    this.selfView = false;
    this.adjustementView = true;
    this.GetViewdata();

  }

  GetViewdata() {
    debugger;
    this._selfadjustmentservice.GetSelfOrAdjustment().subscribe(res => {

      // this.gridData = res
      // this.gridview = this.gridData;
      // console.log("self adjustment form", this.gridData)

      if (this.Type == "SELF") {
        let data: any = []
        data = res;
        console.log('this is adjustment saved data:', data);

        this.gridData = data.filter(item => item.pPaymenttype == "SELF");

        this.gridview = this.gridData;
        console.log(this.gridData);
      }

      if (this.Type == "ADJUSTEMENT") {
        let data: any = []
        data = res;

        this.gridData = data.filter(item => item.pPaymenttype == "ADJUSTMENT");
        this.gridview = this.gridData;
        console.log(this.gridData);
      }




      //   if (this.gridview.length > 0) {
      //     this.gridview = this.gridview.filter(x => x.pTransdate = this.datePipe.transform(x.pTransdate, "dd-MMM-yyyy"));
      //     let c = this.gridview.filter(x => x.pPaymenttype == "Adjustment").length;
      //     if (c >= 0) {
      //       this.hidegridcolumn = false
      //     }
      //     else {
      //       this.hidegridcolumn = true
      //     }
      //   }

    })
  }
  Newform() {
    // this.newform="new";
    this._selfadjustmentservice.Newformstatus("new")
  }
  editHandler(event) {
    debugger

    this._selfadjustmentservice.GetDetailsForEdit(event.dataItem.pMemberid, event.dataItem.pFdaccountid).subscribe(res => {
      this.Editdetails = res;
      console.log("edit details", res);

      var paarams = event.dataItem.pMemberid + "," + event.dataItem.pFdaccountid;
      var myparams = btoa(paarams);
      this.router.navigate(['/SelfOrAdjustmentNew', { id: myparams }]);
      // this.router.navigateByUrl('/SelfOrAdjustmentNew');
      this._selfadjustmentservice.Newformstatus("edit")
      this._selfadjustmentservice._SetEditDetails(this.Editdetails)

    })

  }
  GetAccountDetails(DataItem) {
    debugger;

    this.fdTranscationDetailsComponent.BindData(DataItem.pFdAccountno, DataItem.pFdaccountid);
    $('#add-detail').modal('show');
  }
  onFilter(inputValue: string) {

    this.gridview = process(this.gridData, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'pPaymenttype',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pFdAccountno',
            operator: 'contains',
            value: inputValue
          }, {
            field: 'pCompnayname',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pChitpersonname',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pMemberName',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pBranchname',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pBankaccountno',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pBankname',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pIfsccode',
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
      data: process(this.gridview, {
        group: this.group,
        sort: [{ field: "pTransdate", dir: "asc" }],
      }).data,
      group: this.group,
    };

    return result;
  }

}
