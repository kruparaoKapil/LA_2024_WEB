import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ContacmasterService } from '../../../../Services/Loans/Masters/contacmaster.service'
import { ContactIndividualComponent } from './contact-individual.component';
import { ContactBusinessComponent } from './contact-business.component'
import { ContactComponent } from './contact.component'
import { FormGroup, FormBuilder, AbstractControl, Validators, FormControl, FormArray } from '@angular/forms';
import { CommonService } from '../../../../Services/common.service';
import { State, process } from '@progress/kendo-data-query';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { idLocale } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
declare let $: any;
@Component({
  selector: 'app-contact-view',
  templateUrl: './contact-view.component.html',
  styles: []
})

export class ContactViewComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  public gridState: State = {
    sort: [],
    take: 10
  };
  GridData: any = []
  disable = false;
  gridView: any = []
  public headerCells: any = {
    textAlign: 'center'
  };
  @ViewChild(ContactIndividualComponent, { static: false }) contactindividual: ContactIndividualComponent;
  @ViewChild(ContactBusinessComponent, { static: false }) contactbusiness: ContactBusinessComponent;
  @ViewChild(ContactComponent, { static: false }) contactmaster: ContactComponent;

  busstatus: boolean = true;
  public loading = false;
  statusname: boolean = true
  updated: any = []
  TableColumnsDynamic = [];
  constructor(private zone: NgZone, private _contacmasterservice: ContacmasterService, private toastr: ToastrService, private _routes: Router, private formbuilder: FormBuilder, private _commonService: CommonService) {
    // window['editDetails'] = {
    //   zone: this.zone,
    //   componentFn: (value) => this.editDetails(value),
    //   component: this,
    // };
    // window['deleteDetails'] = {
    //   zone: this.zone,
    //   componentFn: (value) => this.deleteDetails(value),
    //   component: this,
    // };
    // window['viewDetails'] = {
    //   zone: this.zone,
    //   componentFn: (value) => this.viewDetails(value),
    //   component: this,
    // };
  }

  lstContactTotalDetails: any;
  DatatableInIt: any;
  contactViewForm: FormGroup;
  ngOnInit() {

    this.contactViewForm = this.formbuilder.group({
      pSearchText: [''],

    })

    // this.TableColumnsDynamic = [
    //   {
    //     "data": null, "sortable": false,
    //   },
    //   {
    //     "title": "S.No.", "data": null,
    //     render: function (data, type, row, meta) {
    //       return meta.row + meta.settings._iDisplayStart + 1;
    //     }
    //   },
    //     { "title": "Full Name", "data": "pName", className: 'pName' },
    //     { "title": "Contact No", "data": "pBusinessEntityContactno", className: 'pBusinessEntityContactno' },



    //     { "title": "Email ID", "data": "pBusinessEntityEmailid", className: 'pBusinessEntityEmailid' },
    //     { "title": "Reference ID", "data": "pReferenceId", className: 'pReferenceId' },
    //     { "title": "Contact Type", "data": "pContactType", className: 'pContactType' },
    //   { "title": "Status", "data": "pStatusname", className: 'pStatusname' },
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
    //   },
    //   {
    //    "title": "", "data": "null", "mData": null,
    //    "bSortable": false,
    //    "mRender": function (data, type, full) {
    //      return '<a  src=""><div id="icon-view"></div></a>';
    //    }
    //   }

    // ];


    this.getContactTotalDetails('ALL');


  }
  searchChange() {



    this.getContactTotalDetails(this.contactViewForm.controls.pSearchText.value);
  }
  getContactTotalDetails(type): void {

    this.loading = true;
    this._contacmasterservice.getContactTotalDetails(type).subscribe(json => {

      //console.log(json)
      if (json != null) {
        this.gridView = json;
        this.GridData = this.gridView;
        
      }
      this.loading = false;
    });

  }

  showErrorMessage(errormsg: string) {
    this._commonService.showErrorMessage(errormsg);
  }

  showInfoMessage(errormsg: string) {
    this._commonService.showInfoMessage(errormsg);
  }

  status(data: any) {

    let status = data.pStatusname


    data.pCreatedby = this._commonService.pCreatedby;
    if (data.pStatusname.toUpperCase() == 'ACTIVE' || data.pStatusname == null) {
      data.pStatusname = 'IN-ACTIVE'
      status = false;
    }
    else {
      status = true;
      data.pStatusname = 'ACTIVE'
    }

    this._contacmasterservice.deleteContactIndividual(data).subscribe(res => {

      this.getContactTotalDetails(this.contactViewForm.controls.pSearchText.value);
      this.toastr.success("Successfully Status Updated", "Success");

    });
  }
  editDetails(event) {
    let data = event.dataItem

    try {


      this._contacmasterservice.loadEditInformation(data.pContactType, data.pReferenceId)
      this._routes.navigate(['/ContactForm'])


    } catch (e) {
      alert(e);

    }
  }
  deleteDetails(event) {


    let data = event.dataItem


  }

  public onFilter(inputValue: string): void {
    this.GridData = process(this.gridView, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'pName',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pBusinessEntityContactno',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pBusinessEntityEmailid',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pReferenceId',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pContactType',
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
}
