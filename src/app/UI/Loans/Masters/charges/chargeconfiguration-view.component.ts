import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { ChargemasterService } from '../../../../Services/Loans/Masters/chargemaster.service';
import { CommonService } from '../../../../Services/common.service';
import { Router } from '@angular/router';
import { State, process, GroupDescriptor } from '@progress/kendo-data-query';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
declare let $: any;
@Component({
  selector: 'app-chargeconfiguration-view',
  templateUrl: './chargeconfiguration-view.component.html',
  styles: []
})
export class ChargeconfigurationViewComponent implements OnInit 
{
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  public gridState: State = {
    sort: [],
    take: 10
  };
  public pageSize = 10;
  public loading = false;
  public headerCells: any = {
    textAlign: 'center'
  };
  constructor(private zone: NgZone, private _ChargemasterService: ChargemasterService, private _CommonService: CommonService, private _routes: Router) {
    this.allData = this.allData.bind(this);
  }

  loanChargeTypeColumns: any;

  loanChargeTypeDataTableInfo: any;
  lstChargeTypes: any;
  
  gridView:any=[]
  ngOnInit() {
     
    //document.getElementById("ChargeAmountsDataTable").style.display = "block";
    //this.loadoanChargeTypeDataTableData([]);
   
    
    
    this.getLoanChargeTypes();
    
  }

  // loadoanChargeTypeDataTableColumns(): void {
  //   this.loanChargeTypeColumns = [
  //     // {
  //     //   "title": "S.No.", "data": null,
  //     //   render: function (data, type, row, meta) {
  //     //     return meta.row + meta.settings._iDisplayStart + 1;
  //     //   }
  //     // },
  //     { "title": "Loan Charge ID", "data": "pLoanChargeid", "visible": false, className: 'pLoanChargeid' },
  //     { "title": "Loan Type ID", "data": "pLoantypeid", "visible": false, className: 'pLoantypeid' },
  //     { "title": "Loan Type", "data": "pLoantype", className: 'pLoantype' },
  //     { "title": "Loan ID", "data": "pLoanid", "visible": false, className: 'pLoanid' },
  //     { "title": "Loan Name", "data": "pLoanNmae", className: 'pLoanNmae' },

  //     { "title": "Charge / Fee", "data": "pChargename", className: 'pChargename' },
  //     { "title": "Status", "data": "pStatusname", "visible": false, className: 'pStatusname' },
  //      {
  //        "title": "", "data": "null", "mData": null,
  //        "bSortable": false,
  //        "mRender": function (data, type, full) {
          
  //          if (data.pStatusname.toUpperCase() == "ACTIVE") {
  //            return '<a  src=""><div id="icon-edit-config"></div></a> '
  //          }
  //          else {
  //            return '';
  //          }
  //        }
  //      },
  //      {
  //        "title": "", "data": "null", "mData": null,
  //        "bSortable": false,
  //        "mRender": function (data, type, full) {
  //          return '<a><div id ="icon-delete"></div></a>';
  //        }
  //      },
  //   ];
    
  // }
  // loadoanChargeTypeDataTableData(jasonData): void {

  //   //console.log(json)
  //   if (jasonData != null) {

  //     //this.lstContactTotalDetails = json as string
  //     //this.lstContactTotalDetails = eval("(" + this.lstContactTotalDetails + ')');
  //     //this.lstContactTotalDetails = this.lstContactTotalDetails.FT;

  //     let tablename = '#loanChargeTypeDataTable'
  //     if (this.loanChargeTypeDataTableInfo != null) {
  //       this.loanChargeTypeDataTableInfo.destroy();
  //     }
  //     $('#loanChargeTypeDataTable tbody').off('click', 'tr');
  //     this.loanChargeTypeDataTableInfo = $(tablename).DataTable({
  //       "searching": true,
  //       language: { searchPlaceholder: "Search Contact", search: "" },
  //       "bDestroy": true,
  //       'columnDefs': [
  //         {
  //           'targets': 0,
  //           'checkboxes': {
  //             'selectRow': true
  //           }
  //         }
  //       ],
  //       "processing": true,
  //       "bPaginate": true,
  //       "bInfo": false,
  //       "bFilter": false,
  //       //"Sort":false,
  //       //"bSort": false,
  //       'select': {
  //         'style': 'multi',
  //       },
  //       responsive: true,
  //       data: jasonData,
  //       dom: 'Bfrtip',
  //       columns: this.loanChargeTypeColumns,
  //       initComplete: function () {
  //         var $buttons = $('.dt-buttons').hide();
  //       }
  //     });
  //     let dataTableInfo = this.loanChargeTypeDataTableInfo

  //     $('#loanChargeTypeDataTable tbody').on('click', 'tr', function (e) {

  //       let ClickValue = e.target.id;

  //       if (ClickValue == "icon-delete") {
         
  //         window['loanChargeTypedeleteDetails'].componentFn(this)
  //       }

  //       if (ClickValue == "icon-edit-config") {
        
  //         window['loanChargeTypeEditDetails'].componentFn(this)

  //       }
  //     });
  //   }


  // }
 
  getLoanChargeTypes(): void {
   
    this.loading = true;
    this._ChargemasterService.getLoanChargeTypes('ALL').subscribe(json => {
     

      //console.log(json)
      if (json != null) {
        this.gridView = json;
        this.lstChargeTypes = this.gridView;
        this.loading=false;
       // this.CalDataTable(this.lstChargeTypes)
        //this.titleDetails = json as string
        //this.titleDetails = eval("(" + this.titleDetails + ')');
        //this.titleDetails = this.titleDetails.FT;
      }
      
      
    },
      (error) => {

        //this.showErrorMessage(error);
      });
  }
  public groups: GroupDescriptor[] = [{ field: 'pLoantype' }];
  public group: any[] = [{
    field: 'pLoantype'
  }];
  public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.lstChargeTypes, { group: this.group, sort: [{ field: 'pLoantype', dir: 'desc' }] }).data,
      group: this.group
    };

    return result;
  }
  loanChargeTypedeleteDetails(event) {

    
    //let rowIndex = this.loanChargeTypeDataTableInfo.row(rowinfo).index();
    let data = event.dataItem
    let statusName = '';
    if (data.pStatusname.toUpperCase() == 'ACTIVE') {
      statusName = 'In-Active';
      data.pStatusname = 'In-Active';
    }
    else {
      statusName = 'Active';
      data.pStatusname = 'Active';
    }
      let chargeTypeDetails = {
          'precordid': 0, 'pCreatedby': this._CommonService.pCreatedby, 'pStatusname': statusName, 'pLoanid': data.pLoanid, 'pLoanChargeid': data.pLoanChargeid
    }
    let jsonData = JSON.stringify(chargeTypeDetails);
    this._ChargemasterService.deleteLoanChargeType(jsonData).subscribe(json => {
      
      //console.log(json)
      if (json) {

        this.lstChargeTypes = json;
        this.getLoanChargeTypes();
      }
    },
      (error) => {

        this._CommonService.showErrorMessage(error);
      });

  }
  loanChargeTypeEditDetails(event) {

    
    //let data = this.loanChargeTypeDataTableInfo.row(event.dataItem).data();
    this._ChargemasterService.loadEditInformation(event.dataItem)
    this._routes.navigate(['/ChargeconfigurationMaster'])
  }
  public onFilter(inputValue: string): void {
    this.lstChargeTypes = process(this.gridView, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'pLoantype',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pLoanNmae',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pChargename',
            operator: 'contains',
            value: inputValue
          },
         

        ],
      }
    }).data;
    this.dataBinding.skip = 0;
  }
}
