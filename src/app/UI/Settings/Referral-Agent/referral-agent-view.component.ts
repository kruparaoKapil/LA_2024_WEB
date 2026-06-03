import { Component, ViewChild, OnInit, DoCheck, NgZone } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { State, process } from '@progress/kendo-data-query';
import { Toast, ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../Services/common.service';
import { ReferralAgentMasterService } from "src/app/Services/Loans/Masters/referral-agent-master.service";
import { ReferralAgentMasterComponent } from "src/app/UI/Settings/Referral-Agent/referral-agent-master.component";
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
// import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { DataBindingDirective } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-referral-agent-view',
  templateUrl: './referral-agent-view.component.html',
  styles: []
})
export class ReferralAgentViewComponent implements OnInit {
  public submitted = false;
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  // public selectableSettings: SelectableSettings;
  public gridData: any;
  public checkboxOnly = false;
  public Referralview: any;
  public gridState: State = {
    sort: [],
    take: 10
  };
  public loading=false;
  public pageSize = 10;
  // public skip = 0;
  // private data: Object[];
  // private items: any[] = [];

  public headerCells: any = {
    textAlign: 'center'
};
  @ViewChild(ReferralAgentMasterComponent, { static: false }) ReferralAgentData: ReferralAgentMasterComponent;
  constructor(private _referalagentmasterservice: ReferralAgentMasterService, private formbuilder: FormBuilder, public Toast: ToastrService, private _commonService: CommonService, private router: Router) {
   // this.loadItems();
  }

  ngOnInit() {
   
    this.getreferraldetail('All');
  }

    getreferraldetail(data) {
        this.loading = true;
    this._referalagentmasterservice.getReferralDetails(data).subscribe(json => {
     // this.Referralview = json;
      this.gridData = json;
      this.Referralview = this.gridData
      this.loading=false;
    });
  }

//   private loadItems(): void {
//     this.Referralview = {
//         data: this.items.slice(this.skip, this.skip + this.pageSize),
//         total: this.items.length
//     };
// }

// public pageChange(event: PageChangeEvent): void {
//   this.skip = event.skip;
//   this.loadItems();
// }

  //----------------Kendo Grid----------------------- //
  // public setSelectableSettings(): void {

  //   this.selectableSettings = {
  //     checkboxOnly: this.checkboxOnly,
  //     //mode: this.mode
  //     mode: "single",

  //   };
  // }
  public removeHandler({ dataItem }) {
    
    let removegriddata =
    {
      "pStatusid": null,
      "pStatusname": "In-Active",
      "pReferralId": dataItem.pReferralId,
      "pCreatedby": this._commonService.pCreatedby,
    }
    // {
    //   "pReferralId": dataItem.pReferralId,
    //   "pCreatedby": 1,
    //   "pStatusid": null,
    //   "pStatusname": "In-Active"
    // };

    this._referalagentmasterservice.DeleteReferralDetail(removegriddata).subscribe(res => {
      this.getreferraldetail('All');
    });
  }
  public editHandler({ dataItem }) {
    let referralid: any = dataItem
    
    this.router.navigate(['/ReferralAgentMaster/:id']);
    this._commonService._SetReferralViewData(referralid.pReferralId)
    // let url = "/ReferralAgentMaster"
    // this.router.navigate([url]);
    // this.ReferralAgentData.getReferralData();

  }

  AddNew() {
    
    // this.ReferralAgentData.ClearForm();
    // let url = "/ReferralAgentMaster"
    // this.router.navigate([url]);
    this.router.navigate(['/ReferralAgentMaster']);
    this._commonService._SetReferralViewData('')
  }

  searchgrid(event) {
    let searchtext = event.currentTarget.value
    if (searchtext != '') {
      this.getreferraldetail(searchtext);
    }
    else {
      this.getreferraldetail('All');
    }
  }
  //----------------Kendo Grid----------------------- //

  public onFilter(inputValue: string): void {
    this.Referralview = process(this.gridData, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'pAdvocateName',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pBusinessEntitycontactNo',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pBusinessEntityEmailId',
            operator: 'contains',
            value: inputValue
          }
        ],
      }
    }).data;

    this.dataBinding.skip = 0;
  }
}
