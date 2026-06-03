import { Component, OnInit, ViewChild } from '@angular/core';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { SelectableSettings, GridDataResult } from '@progress/kendo-angular-grid';
import { State, process, GroupDescriptor, DataResult } from '@progress/kendo-data-query';
import { CommonService } from '../../../../Services/common.service';
import { SavingaccountconfigService } from '../../../../Services/Banking/savingaccountconfig.service';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
@Component({
  selector: 'app-savings-config-view',
  templateUrl: './savings-config-view.component.html',
  styles: []
})
export class SavingsConfigViewComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  public SavingAccountConfiglist: any[];
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
  public selectableSettings: SelectableSettings;
  constructor(private _commonService: CommonService, private _savingaccountconfigService: SavingaccountconfigService, private router: Router) {
     this.allData = this.allData.bind(this);
  }

  ngOnInit() {
    debugger;
    this.getLoadData();
  }
  getLoadData() {

    this._savingaccountconfigService.GetSavingAccountConfigData().subscribe(json => {

      //console.log(json)
      if (json != null) {
        this.gridData = json
        this.SavingAccountConfiglist = this.gridData;

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
  NewButtonClick(type) {
    this._savingaccountconfigService.SetButtonClickType(type)
    this._savingaccountconfigService._SetAccountNameAndCodeToNextTab("")
    this._savingaccountconfigService.SetSavingAccountConfigurationData("")
    this._savingaccountconfigService.SetIdentificationProofsData("")
    this._savingaccountconfigService.SetLoanFacilityData("")
    this._savingaccountconfigService.SetReferralCommissioData("")
  }
public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.gridData, {}).data
    };

    return result;
  }
  datatableclickedit(event) {

    debugger;
    //this.router.navigate(['/LoansCreation', { id: data.pLoanid }]);
    let data = event.dataItem
    this._savingaccountconfigService.GetSavingAccountConfigDataToEdit(data.pSavingAccountid).subscribe(json => {
      debugger;
      let data = json
      this._savingaccountconfigService.SetButtonClickType("Edit")
      this._savingaccountconfigService.SetDatatableRowEditClick(data[0])
      this._savingaccountconfigService.SetSavingAccountConfigurationData(data[0].savingAccountConfiglist)
      this._savingaccountconfigService.SetIdentificationProofsData(data[0].getidentificationdocumentsList)
      this._savingaccountconfigService.SetLoanFacilityData(data[0].loanFacilityList)
      this._savingaccountconfigService.SetReferralCommissioData(data[0].referralCommissionList)
      
      // let url = "/SavingsNew"
      // this.router.navigate([url]);
       var myparams = btoa(event.dataItem.pSavingAccountid);
       this.router.navigate(['/SavingsNew', { id: myparams }]);
    })
  }
  removeHandler(event) {
    debugger;
    let data = event.dataItem
    let savingaccountid = data.pSavingAccountid;
    let Modifiedby = this._commonService.pCreatedby;
    this._savingaccountconfigService.DeleteSavingaccountconfig(data.pSavingAccountid, Modifiedby).subscribe(json => {
      debugger;
      if (json) {
        this._commonService.showInfoMessage('Record Deleted Successfully')
        this.getLoadData();
      }

      
    })
  }

  SearchRecord(inputValue: string) {

    this.SavingAccountConfiglist = process(this.gridData, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'pSavingAccountname',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pSavingaccnamecode',
            operator: 'contains',
            value: inputValue
          }
        ],
      }
    }).data;
    this.dataBinding.skip = 0;
  }
}
