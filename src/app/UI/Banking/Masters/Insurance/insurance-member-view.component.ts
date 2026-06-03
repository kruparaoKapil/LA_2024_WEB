import { Component, OnInit, ViewChild } from '@angular/core';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { State, process, GroupDescriptor, DataResult } from '@progress/kendo-data-query';
import { CommonService } from '../../../../Services/common.service';
import { SelectableSettings, GridDataResult } from '@progress/kendo-angular-grid';
import { InsuranceMemberService } from '../../../../Services/Insurance/insurance-member.service';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
@Component({
  selector: 'app-insurance-member-view',
  templateUrl: './insurance-member-view.component.html',
  styles: []
})
export class InsuranceMemberViewComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  public InsuranceMembersList: any[];
  public gridView: GridDataResult;
  
  public pageSize = 10;
  public skip = 0;
  private data: Object[];
  public gridData: any;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10
  };
  public headerCells: any = {
    textAlign: 'center'
  };
  constructor(private _commonService: CommonService, private _insurancememberService: InsuranceMemberService, private router: Router) { }
  MemberReferenceID:any;
  createdby=this._commonService.pCreatedby
  ngOnInit() {
    debugger;
    this.getLoadData();
  }
  getLoadData() {

    this._insurancememberService.GetInsuranceMembersMainGrid().subscribe(json => {

      //console.log(json)
      if (json != null) {
        this.gridData = json
        console.log(this.gridData)
        this.InsuranceMembersList = this.gridData;

      
       
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
  NewButtonClick(type) 
  {
    debugger
    this._insurancememberService.SetButtonClickType(type)
  }
  removeHandler(event)
  {
    debugger
     this.MemberReferenceID=event.dataItem.pMembercode
     this._insurancememberService.DeleteInsuranceMember(this.MemberReferenceID,this.createdby).subscribe(res=>
      {
       debugger;
       if(res)
       {
        this.getLoadData();
       }
     })
  }
  datatableclickedit(event)
  {
    //this.MemberReferenceID=event.dataItem.pMembercode
    let Recordid = event.dataItem.pRecordid;
    this._insurancememberService.SetButtonClickType('Edit')
    this._insurancememberService.GetMemberDetailsforEdit(event.dataItem.pMembercode, Recordid).subscribe(res=>{
      debugger
      console.log( "from db",res)
      this._insurancememberService.SetInsuranceMemberDetailsForEdit(res)
      this.router.navigateByUrl('/InsuranceMemberNew')
    })
  }
  public SearchRecord(inputValue: string): void {
    debugger
  
    this.InsuranceMembersList = process(this.gridData, {
      filter: {
        logic: "or",
        filters: [

          {
            field: 'pMembername',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pMemberCodeandName',
            operator: 'contains',
            value: inputValue
          }
        ],
      }
    }).data;
    this.dataBinding.skip = 0;
  }
}
