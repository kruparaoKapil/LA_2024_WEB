import { Component, ViewChild, OnInit, DoCheck, NgZone } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { State, process } from '@progress/kendo-data-query';
import { SelectableSettings } from '@progress/kendo-angular-grid';
import { Toast, ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../Services/common.service';
import { AdvocateService } from "src/app/Services/Loans/Masters/advocate.service";
import { ReferralAgentMasterComponent } from "src/app/UI/Settings/Referral-Agent/referral-agent-master.component";
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { DataBindingDirective, RowArgs } from '@progress/kendo-angular-grid';

@Component({
    selector: 'app-advocate-lawyer-view',
    templateUrl: './advocate-lawyer-view.component.html',
    styles: []
})
export class AdvocateLawyerViewComponent implements OnInit {
    public submitted = false;
    public selectableSettings: SelectableSettings;
    @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
    public checkboxOnly = false;
    public Referralview: any;
    public gridData: any;
    public gridState: State = {
        sort: [],
        take: 10
    };
    public loading = false;
    public pageSize = 10;
    public skip = 0;
    public headerCells: any = {
        textAlign: 'center'
    };

    @ViewChild(ReferralAgentMasterComponent, { static: false }) ReferralAgentData: ReferralAgentMasterComponent;
    constructor(private _advocateservice: AdvocateService, private formbuilder: FormBuilder, public Toast: ToastrService, private _commonService: CommonService, private router: Router) { }

    ngOnInit() {

        this.getreferraldetail('All');
    }

    public getreferraldetail(data) {
        this.loading = true;
        this._advocateservice.getAdvocateDetails(data).subscribe(json => {
            this.gridData = json;
            this.Referralview = this.gridData
            this.loading = false;
        });
    }

    //----------------Kendo Grid----------------------- //

    public removeHandler({ dataItem }) {

        let removegriddata =
        {
            "pStatusid": null,
            "pStatusname": "In-Active",
            "pReferralId": dataItem.pReferralId,
            "pCreatedby": this._commonService.pCreatedby,
        }
        this._advocateservice.DeleteAdvocateDetail(removegriddata).subscribe(res => {
            this.getreferraldetail('All');
        });
    }
    public editHandler({ dataItem }) {
        let referralid: any = dataItem
        this._commonService._SetReferralViewData(referralid.pReferralId)
        this.router.navigate(['/AdvocateLawyerMaster/:id']);
    }

    public AddNew() {

        this.router.navigate(['/AdvocateLawyerMaster']);
        this._commonService._SetReferralViewData('')
    }

    public searchgrid(event) {
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

