import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { ChargemasterService } from 'src/app/Services/Loans/Masters/chargemaster.service';
import { FormGroup, FormControl, FormBuilder, Validators, ControlContainer } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../Services/common.service';
import { CookieService } from 'ngx-cookie-service';
import { State, process } from '@progress/kendo-data-query';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
declare let $: any

@Component({
  selector: 'app-charges',
  templateUrl: './charges-master.component.html',
})
export class ChargesMasterComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  public loading = false;
  dt: any;
  del: any;
  DisplayData: any[] = [];
  submitted = false;
  i: any;
  DatatableInIt: any;
  TableColumnsDynamic: any
  ChargeMasterForm: FormGroup
  IsCapsWarning:Boolean
  buttontype: any
  updatebuttonshow: Boolean
  savebuttonshow: Boolean
  gridView:any=[]
  public gridState: State = {
    sort: [],
    take: 10
  };
  constructor(private _commonservice: CookieService, private toastr: ToastrService, private _commonService: CommonService, private zone: NgZone, private chargemasterservice: ChargemasterService, private fb: FormBuilder, private r: Router) {
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

    this.updatebuttonshow = false
    this.savebuttonshow = true

    // this.TableColumnsDynamic = [
    //   // {
    //   //   "title": "S.No.", "data": null,
    //   //   render: function (data, type, row, meta) {
    //   //     return meta.row + meta.settings._iDisplayStart + 1;
    //   //   }
    //   // },
    //   { "title": "Charge", "data": "pChargeid", className: 'pChargeid', "visible": false },
    //   { "title": "Charge", "data": "pChargename", className: 'Loanchargetypes' },
    //   {
    //     "title": "", "data": "null", "mData": null,
    //     "bSortable": false,
    //     "mRender": function (data, type, full) {
    //       return '<a  src=""><div id="icon-edit"></div></a>';
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
    this.ChargeMasterForm = this.fb.group({
      pChargename: ['', Validators.required],
      pChargeid: ["0"],
      pStatusname: ['Active'],
      pCreatedby: [this._commonService.pCreatedby]
    })

    this.chargemasterservice.getChargeNames('ALL').subscribe(data => {
      this.gridView = data;
      this.DisplayData = this.gridView;
      //this.CalDataTable(this.DisplayData)
      this.loading = false;
    })

  }


  showErrorMessage(errormsg: string) {
    this._commonService.showErrorMessage(errormsg);
  }

  showInfoMessage(errormsg: string) {
    this._commonService.showInfoMessage(errormsg);
  }
  // CalDataTable(TableData) {

  //   let tablename = '#example'
  //   if (this.DatatableInIt != null) {
  //     this.DatatableInIt.destroy();
  //   }
  //   $('#example tbody').off('click', 'tr');
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

  //   $('#example tbody').on('click', 'tr', function (e) {

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
  get f() { return this.ChargeMasterForm.controls; }
  CheckDuplicateChargeNames() {
    
    this.buttontype = this.chargemasterservice.GetButtonType()
    if (this.buttontype == "Edit") {
      let chargename = this.ChargeMasterForm.controls.pChargename.value
      let chargeid = this.ChargeMasterForm.controls.pChargeid.value
      this.chargemasterservice.CheckChargeNameDuplicates(chargename, chargeid).subscribe(count => {
        
        if (count) {
          alert("charge name already exist")
          // this.ChargeMasterForm.reset()
          this.ChargeMasterForm.controls.pChargename.setValue("")
          this.submitted = false
        }
      })
    } else {
      let chargename = this.ChargeMasterForm.controls.pChargename.value
      let chargeid = 0
      this.chargemasterservice.CheckChargeNameDuplicates(chargename, chargeid).subscribe(count => {
        if (count) {
          alert("charge name already exist")
          this.ChargeMasterForm.controls.pChargename.setValue("")
          this.submitted = false
        }
      })
    }

  }
  OpenModel() {
    
    this.chargemasterservice.SetButtonType(undefined)
    this.updatebuttonshow = false
    this.savebuttonshow = true
    this.submitted = false
    this.ChargeMasterForm.reset()
    $('#add-detail').modal('show');
  }
  CloseModel() {
    this.ChargeMasterForm.reset()
    this.submitted = false
    $('#add-detail').modal('hide');
    this.chargemasterservice.SetButtonType(undefined)
    this.updatebuttonshow = false
    this.savebuttonshow = true
  }
  save() {
    
    this.submitted = true;
    this.ChargeMasterForm.controls.pCreatedby.setValue(this._commonService.pCreatedby)
    this.ChargeMasterForm.controls.pChargeid.setValue(0)
    if (this.ChargeMasterForm.valid) {

      let chargename = this.ChargeMasterForm.controls.pChargename.value
      let chargeid = 0
      this.chargemasterservice.CheckChargeNameDuplicates(chargename, chargeid).subscribe(count => {
        if (count) {
          alert("charge name already exist")
          this.ChargeMasterForm.controls.pChargename.setValue("")
          this.submitted = false
        }
        else{

          this.ChargeMasterForm.controls.pStatusname.setValue("Active")

        //  let name= this.ChargeMasterForm.controls.pChargename.value 
        //  name +=" "
        //  this.ChargeMasterForm.controls.pChargename.setValue(name)
debugger;
          let data = JSON.stringify(this.ChargeMasterForm.value)
          this.chargemasterservice.saveChargesName(data).subscribe(res => {
            
            if (res) {
              this.chargemasterservice.getChargeNames('ALL').subscribe(data => {
                this.DisplayData = data;
                //this.CalDataTable(this.DisplayData)
                this.ChargeMasterForm.reset()
                this.submitted = false
                this.toastr.success("Saved Successfully", "Success")
                $('#add-detail').modal('hide');
    
              })
    
            }
          })
        }
      })

     

    }

  }

  datatableclickedit(event) {

     let data= event.dataItem
    this.updatebuttonshow = true
    this.savebuttonshow = false
    this.chargemasterservice.SetButtonType("Edit")
    this.dt = data.pChargename;
    this.ChargeMasterForm.controls.pChargename.setValue(data.pChargename)
    this.ChargeMasterForm.controls.pChargeid.setValue(data.pChargeid)

    $('#add-detail').modal('show');
  }

  datatableclickdelete(event) 
  {
    debugger
    let data= event.dataItem
    this.del = data.pChargename
    data.pCreatedby = this._commonService.pCreatedby;
    if (data.pStatusname == 'ACTIVE' || data.pStatusname == null) {     
      this.ChargeMasterForm.controls.pStatusname.setValue("IN-ACTIVE")
    }
    this.ChargeMasterForm.controls.pChargename.setValue(data.pChargename)
    this.ChargeMasterForm.controls.pChargeid.setValue(data.pChargeid)  
    this.ChargeMasterForm.controls.pCreatedby.setValue(this._commonService.pCreatedby)
    let deletedata = JSON.stringify(this.ChargeMasterForm.value)
    console.log('deletedata',deletedata)
    this.chargemasterservice.deleteChargesName(deletedata).subscribe(res => {

      if (res) {
        
        this.chargemasterservice.getChargeNames('ALL').subscribe(data => {
          this.DisplayData = data;
         // this.CalDataTable(this.DisplayData)
          this.toastr.success("Deleted Successfully", "Success")
        })
      }
    });

    //this.loanid = this.DisplayData[0].pLoanid

  }

  UpdateChargesData() {
    debugger
    this.submitted = true;

    if (this.ChargeMasterForm.valid) {

      let chargename = this.ChargeMasterForm.controls.pChargename.value
      let chargeid = this.ChargeMasterForm.controls.pChargeid.value
      this.chargemasterservice.CheckChargeNameDuplicates(chargename, chargeid).subscribe(count => {
        
        if (count) {
          alert("charge name already exist")
          // this.ChargeMasterForm.reset()
          this.ChargeMasterForm.controls.pChargename.setValue("")
          this.submitted = false
        }
        else {
          this.ChargeMasterForm.controls.pStatusname.setValue("Active")
          this.ChargeMasterForm.controls.pCreatedby.setValue(1)
          let data = JSON.stringify(this.ChargeMasterForm.value);
          this.chargemasterservice.updateChargesName(data).subscribe(res => {
            if (res) {
              this.chargemasterservice.getChargeNames('ALL').subscribe(data => {
                this.DisplayData = data;
               // this.CalDataTable(this.DisplayData)
                this.ChargeMasterForm.reset()
                this.submitted = false
                this.chargemasterservice.SetButtonType(undefined)
                this.toastr.success("Updated Successfully", "Success")
                $('#add-detail').modal('hide');

              })
            }
          })
        }
      })



    }
  }

  ChargeName(event){
    
    if (event.getModifierState("CapsLock")) {
     this.IsCapsWarning=true
    } else {
      this.IsCapsWarning=false
    }
  }
  public onFilter(inputValue: string): void {
    this.DisplayData = process(this.gridView, {
      filter: {
        logic: "or",
        filters: [
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

  Clear() {
    
    this.ChargeMasterForm.reset();
  }

}


