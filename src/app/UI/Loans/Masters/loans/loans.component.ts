import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { LoansmasterService } from "../../../../Services/Loans/Masters/loansmaster.service";
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { State, GroupDescriptor, process } from '@progress/kendo-data-query';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { CommonService } from '../../../../Services/common.service';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
declare let $: any


@Component({
  selector: 'app-loans',
  templateUrl: './loans.component.html',
  styles: []
})
export class LoansComponent implements OnInit 
{
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  public loading = false;
  DisplayData: any
  gridView:any=[]
  public gridState: State = {
    sort: [],
    take: 10
  };
  DatatableInIt: any
  TableColumnsDynamic: any
  public headerCells: any = {
    textAlign: 'center'
  };
  public groups: GroupDescriptor[] = [{ field: 'pLoantype' }];
    constructor(private _commonService: CommonService, private _loanmasterservice: LoansmasterService, private zone: NgZone, private router: Router) {
      this.allData = this.allData.bind(this);
    // window['CallingFunctionOutsideAngularEdit'] = {
    //   zone: this.zone,
    //   componentFn: (value) => this.datatableclickedit(value),
    //   component: this,
    // };

    // window['CallingFunctionOutsideAngularDelete'] = {
    //   zone: this.zone,
    //   componentFn: (value) => this.datatableclickdelete(value),
    //   component: this,
    // };

  }

  ngOnInit() {
  
    // this.TableColumnsDynamic = [
     
    //   // {
    //   //   "title": "S.No.", "data": null,
    //   //   render: function (data, type, row, meta) {
    //   //     return meta.row + meta.settings._iDisplayStart + 1;
    //   //   }
    //   // },

    //   { "title": "Loan Type", "data": "pLoantype", className: 'loantype' },
    //   { "title": "Loan Name", "data": "pLoanname", className: 'loanname' },
    //   { "title": "Loan ID", "data": "pLoanidcode", className: 'cancelloancodedate' },
    //   { "title": "Status", "data": "pStatusname", className: 'status' },
    //   {
    //     "title": "", "data": "null", "mData": null,
    //     "bSortable": false,
    //     "mRender": function (data, type, full) {
    //       if (data.pStatusname.toUpperCase() == "ACTIVE") {
    //         return '<a  src=""><div id="icon-edit"></div></a> '
    //       }
    //       else {
    //         return '';
    //       }
    //     }
    //   },
    //   {
    //     "title": "", "data": "null", "mData": null,
    //     "bSortable": false,
    //     "mRender": function (data, type, full) {
    //       return '<a  src=""><div id="icon-delete"></div></a>';
    //     }
    //   }

    // ];
    this.loading = true;
    this._loanmasterservice.GetNameCodeData().subscribe(json => {

     
     this.DisplayData = json
      if (this.DisplayData != "" && this.DisplayData != null) {
        //this.CalDataTable(this.DisplayData)
       // this.DisplayData = json
        this.gridView = json;
        this.DisplayData = this.gridView;
        this.loading = false;

        let data = this.DisplayData[0].instalmentdatedetailslist
        this._loanmasterservice.SetLoanInstallmentDueData(data)
      }else{
        //this.CalDataTable(this.DisplayData)
        this.DisplayData = json
        this.loading = false;
      }
    
    })

  }

  NewButtonClick(type) {
    this._loanmasterservice.SetButtonClickType(type)
    this._loanmasterservice._SetLoanNameAndCodeToNextTab("")
    this._loanmasterservice.SetLoanInstallmentDueData("")
    this._loanmasterservice.SetLoanReferralCommissionData("")
  }

  // CalDataTable(TableData) {
  //   
  //   let tablename = '#Transfer'
  //   if (this.DatatableInIt != null) {
  //     this.DatatableInIt.destroy();
  //   }
  //   $('#Transfer tbody').off('click', 'tr');
  //   this.DatatableInIt = $(tablename).DataTable({
  //     "searching": true,
  //     language: { searchPlaceholder: "Search leads", search: "" },
  //     "bDestroy": true,
  //     'columnDefs': [
  //       {
  //         'targets': 0,
  //         'checkboxes': {
  //           'selectRow': true
  //         },
  //         //'render': function (data, type, full, meta) {
  //         //  return '<input type="radio" id="radio" name="id[]" value="' + $('<div/>').text(data).html() + '">';
  //         //}
  //       },
  //       {
  //         extend: 'selectAll',
  //         exportOptions: {
  //           columns: ':visible',
  //           modifier: {
  //             selected: null
  //           },
  //         }
  //       }, {
  //         extend: 'selectNone',
  //         exportOptions: {
  //           columns: ':visible',
  //           modifier: {
  //             selected: null
  //           },
  //         }
  //       }

  //     ],
  //     "processing": true,
  //     "bPaginate": true,
  //     "bInfo": false,
  //     "bFilter": false,
  //     "iDisplayLength": 10,
  //     // "Sort":false,
  //     //"bSort": false,
  //     'select': {
  //       'style': 'multi',
  //     },
  //     responsive: true,
  //     data: TableData,
  //     dom: 'Bfrtip',
  //     columns: this.TableColumnsDynamic,
  //     initComplete: function () {
  //       var $buttons = $('.dt-buttons').hide();
  //     }
  //   });

  //   let Newdatatable = this.DatatableInIt

  //   $('#Transfer tbody').on('click', 'tr', function (e) {

  //     let ClickValue = e.target.id;
  //     if (ClickValue == "icon-edit") {
  //       var data = Newdatatable.row(this).data();
  //       window['CallingFunctionOutsideAngularEdit'].componentFn(data)
  //     }
  //     else if (ClickValue == "icon-delete") {
  //       var data = Newdatatable.row(this).data();
  //       window['CallingFunctionOutsideAngularDelete'].componentFn(data)
  //     }
  //     else if (ClickValue == "radio") {
  //       var data = Newdatatable.row(this).data();
  //       // window['CallingFunctionOutsideAngularDelete'].componentFn(data)
  //     }


  //   });


  // }

  datatableclickedit(event) {
    

    //this.router.navigate(['/LoansCreation', { id: data.pLoanid }]);
    let data=event.dataItem
    this._loanmasterservice.GetLoanDataToEdit(data.pLoanid).subscribe(json => {
      
      let data = json
      console.log('edit data',data)
      this._loanmasterservice.SetButtonClickType("Edit")
      this._loanmasterservice.SetDatatableRowEditClick(data[0])
      this._loanmasterservice.SetLoanInstallmentDueData(data[0].instalmentdatedetailslist)
      this._loanmasterservice.SetLoanReferralCommissionData(data[0].referralCommissioLoanList)
      this._loanmasterservice.SetIdentificationProofsData(data[0].getidentificationdocumentsList)
      this._loanmasterservice._SetIdentificationProofsData(data[0].getidentificationdocumentsList)
      this._loanmasterservice.SetPenalinterestData(data[0].penaltyConfigurationList)
      let url = "/LoansCreation"
      this.router.navigate([url]);
    })
  }

  datatableclickdelete(event) 
  {
      debugger;
    let data=event.dataItem
    let dt = data
      let loanid = dt.pLoanid
      let modifiedby = this._commonService.pCreatedby;
    this._loanmasterservice.DataTableRowDeleteClick(loanid, modifiedby).subscribe(count => {
      this._loanmasterservice.GetNameCodeData().subscribe(json => {
        this.DisplayData = json
        //this.loanid = this.DisplayData[0].pLoanid
        //this.CalDataTable(this.DisplayData)
      })
    })
  }
  public onFilter(inputValue: string): void {
    this.DisplayData = process(this.gridView, {
      filter: {
        logic: "or",
        filters: [
         
          {
            field: 'pLoantype',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pLoanname',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pLoanidcode',
            operator: 'contains',
            value: inputValue
          },
          
          {
            field: 'pStatusname',
            operator: 'contains',
            value: inputValue
          },



        ],
      }
    }).data;
    this.dataBinding.skip = 0;
  }
  public group: any[] = [{
    field: 'pLoantype'
  }];
  public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.DisplayData, { group: this.group, sort: [{ field: 'pLoantype', dir: 'desc' }] }).data,
      group: this.group
    };

    return result;
  }

}
