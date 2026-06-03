import { Component, OnInit, ViewChild } from '@angular/core';
import { MemberService } from '../../../../Services/Banking/member.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { State, GroupDescriptor, process } from '@progress/kendo-data-query';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { CommonService } from '../../../../Services/common.service';


@Component({
  selector: 'app-member-view',
  templateUrl: './member-view.component.html',
  styles: []
})
export class MemberViewComponent implements OnInit {


  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  gridView: any = []

  public gridState: State = {
    sort: [],
    take: 10
  };

  constructor(private _MemberService: MemberService, private toastr: ToastrService,
    private _router: Router, private router: Router,
    private _commonService: CommonService) { }

  MemberDetailsListAll: any
  ipAddress: any

  ngOnInit() {
    debugger
    this._MemberService.GeFIMemberDetailsList().subscribe(result => {
      debugger
     
      this.gridView = result;
      console.log("view grid member",this.gridView)
      this.MemberDetailsListAll = result
    })

  }


  public onFilter(inputValue: string): void {
    debugger
    this.MemberDetailsListAll = process(this.gridView, {
      filter: {
        logic: "or",
        filters: [

          {
            field: 'pContactName',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pContactNo',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pEmailId',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pContactReferenceId',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pContacttype',
            operator: 'contains',
            value: inputValue
          },

        ],
      }
    }).data;
    this.dataBinding.skip = 0;
  }

  ChangeStatus(data: any) {
    debugger
    let a = data
    var Memberid = data.pmembertypeid
    this.MemberDetailsListAll.filter(d => {
      if (d.pmembertypeid == data.pmembertypeid) {
        d.pstatus = false;
      }
    })
    this._MemberService.DeleteMemberDetails(Memberid).subscribe(result => {
      debugger
      if (Boolean(result) == true) {
        this.toastr.success("Successfully Status Updated", "Success");
        this._MemberService.GetMemberDetailsList().subscribe(res => {
          debugger
          this.MemberDetailsListAll = res
        })
      }
    })

  }


  EditMemberDetails(data: any) {
    debugger
    this._MemberService.SetFIMemberDetailsForEdit(data.dataItem)
    this._MemberService.SetButtonType("Update")

    let MemData = data.dataItem
    //pMemberReferenceId: "AMKITFD1900040"
    var myparams = btoa(MemData.pMemberReferenceId);
    this.router.navigate(['/MemberNew', { id: myparams }]);

  }

  datatableclickdelete(data: any) {
    debugger
    let Data = data.dataItem
    var MemberReferenceID = Data.pMemberReferenceId
    var Userid = this._commonService.pCreatedby
    this._MemberService.DeleteFiMemberDetails(MemberReferenceID, Userid).subscribe(result => {
      debugger
      if (Boolean(result) == true) {
        this.toastr.success("Record deleted successfully", "Success");
        this._MemberService.GeFIMemberDetailsList().subscribe(result => {
          this.gridView = result;
          this.MemberDetailsListAll = result

        })
      }
    })
  }

  NewButtonClick() {
    debugger
    //
    this._MemberService.SetButtonType("New")
    //this.router.navigate(['/MemberNew'])
    this._MemberService.SetMemberDetailsForEdit(undefined)

  }



}
