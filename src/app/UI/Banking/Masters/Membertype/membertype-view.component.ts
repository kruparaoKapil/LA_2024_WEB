import { Component, OnInit, ViewChild } from '@angular/core';
import { MemberService } from '../../../../Services/Banking/member.service';
import { State, GroupDescriptor, process } from '@progress/kendo-data-query';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CommonService } from '../../../../Services/common.service';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';

@Component({
  selector: 'app-membertype-view',
  templateUrl: './membertype-view.component.html',
  styles: []
})
export class MembertypeViewComponent implements OnInit {

  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  MemberDetailsList: any
  gridView: any = []
  constructor(private _CommonService:CommonService,private _MemberService: MemberService, private toastr: ToastrService, private _router: Router) { 
      this.allData = this.allData.bind(this);
  }

  public groups: GroupDescriptor[] = [];
  public gridState: State = {
    sort: [],
    take: 10
  };

  ngOnInit() {
    debugger
    this._CommonService.Getmemberdetails('member').subscribe(result => {
      this.gridView = result;
      this.MemberDetailsList = result
    })

  }

  public onFilter(inputValue: string): void {
    this.MemberDetailsList = process(this.gridView, {
      filter: {
        logic: "or",
        filters: [

          {
            field: 'pmembertype',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pmembercode',
            operator: 'contains',
            value: inputValue
          },

        ],
      }
    }).data;
    this.dataBinding.skip = 0;
  }
  // ChangeStatus(data: any) {
  //   debugger
  //   let a = data
  //   var Memberid = data.pmembertypeid
  //   let status;
  //   if (data.pstatus == false) {
  //     status = 'ACTIVE';
  //   }
  //   else {
  //     status = 'INACTIVE';
  //   }
  //   this._MemberService.DeleteMemberDetails(Memberid).subscribe(result => {
  //     debugger
  //     if (Boolean(result) == true) {
  //       this.toastr.success("Successfully Status Updated", "Success");
  //       this._MemberService.GetMemberDetailsList().subscribe(res => {
  //         debugger
  //         this.MemberDetailsList = res
  //       })
  //     }
  //   })

  // }


  EditMemberDetails(data: any) {
    debugger
    this._MemberService.SetMemberDetailsForEdit(data.dataItem)
    this._MemberService.SetButtonType("Update")
    this._router.navigate(['/MembertypeNew'])
  }

  datatableclickdelete(data: any) {
    debugger
    let Data=data.dataItem
    var Memberid = Data.pmembertypeid
    this._MemberService.DeleteMemberDetails(Memberid).subscribe(result => {
      debugger
      if (Boolean(result) == true) {
        this.toastr.success("Record Deleted Successfully", "Success");
        this._CommonService.Getmemberdetails('member').subscribe(res => {
          debugger
          this.MemberDetailsList = res
        })
      }
    })
  }

  NewButtonClick() {
    this._MemberService.SetMemberDetailsForEdit(undefined)
    this._MemberService.SetButtonType("New")
  }

 public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.gridView, {}).data
    };

    return result;
  }

}
