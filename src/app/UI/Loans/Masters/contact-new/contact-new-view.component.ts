import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { ContactNewIndividualComponent } from './contact-new-individual.component';
import { ContactNewBusinessComponent } from './contact-new-business.component';
import { ContactNewComponent } from './contact-new.component';
import { PageCriteria } from 'src/app/Models/Loans/Masters/pagecriteria';
import { State, process } from '@progress/kendo-data-query';
import { CommonService } from 'src/app/Services/common.service';
import { DefaultProfileImageService } from 'src/app/Services/Loans/Masters/default-profile-image.service';
import { ContacmasterService } from 'src/app/Services/Loans/Masters/contacmaster.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
@Component({
  selector: 'app-contact-new-view',
  templateUrl: './contact-new-view.component.html',
  styles: []
})
export class ContactNewViewComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  public gridState: State = {
    sort: [],
    take: 10
  };

  public loading = false;
  LoadCount: any = 0;

  displayContacts: any = 100;

  showContacts: any = 100;

  croppedImage: any
  ImagePath: any

  ContactListData: any
  TempContactListData: any
  RawContactsList: any
  public count = 100;
  public pageSize = 3;
  public limit = 2;
  public offset = 0;
  GridData: any = []
  disable = false;
  gridView: any = [];
  public pageno: any;
  public TotalPages: any;
  public offsetp: any;
  public showContactsitems: any;
  public headerCells: any = {
    textAlign: 'center'
  };
  public nopan = 'No Pan'
  @ViewChild(ContactNewIndividualComponent, { static: false }) contactindividual: ContactNewIndividualComponent;
  @ViewChild(ContactNewBusinessComponent, { static: false }) contactbusiness: ContactNewBusinessComponent;
  @ViewChild(ContactNewComponent, { static: false }) contactmaster: ContactNewComponent;

  busstatus: boolean = true;
  statusname: boolean = true
  updated: any = []
  TableColumnsDynamic = [];
  pageCriteria: PageCriteria;
  ContactListDataFiltered: any = [];
  constructor(private zone: NgZone, private _contacmasterservice: ContacmasterService, private toastr: ToastrService, private _routes: Router, private formbuilder: FormBuilder, private _commonService: CommonService, private _defaultimage: DefaultProfileImageService) {
    this.pageCriteria = new PageCriteria();

    this.allData = this.allData.bind(this);

  }
  lstContactTotalDetails: any;
  DatatableInIt: any;
  contactViewForm: FormGroup;
  ngOnInit() {
    this.loading = true;
    debugger;
    this.showContactsitems = 0;
    this.pageno = 1;
    this.offsetp = 0;
    this.TotalPages = 0;
    debugger
    this.GetContactDetails("Contacts", this.offsetp, '');
    this.GetContactCount("Contacts", '');
    this.setPageModel();
    this.contactViewForm = this.formbuilder.group({
      pSearchText: [''],


    })
    this.getContactTotalDetails('ALL');
  }
  GetContactDetails(Contacts, pageno, searchby) {
    debugger
    this._contacmasterservice.GetContactDetailsListIndex(Contacts, pageno, searchby).subscribe(result => {
      debugger;
      this.ContactListData = result
      this.RawContactsList = result
      console.log("details", this.ContactListData)

      for (var i = 0; i < this.ContactListData.length; i++) {

        if (this.ContactListData[i].pGender == "M") {
          this.ContactListData[i].pFatherName = "S/o - " + this.ContactListData[i].pFatherName
        }
        else if (this.ContactListData[i].pGender == "F") {
          this.ContactListData[i].pFatherName = "D/o - " + this.ContactListData[i].pFatherName
        }
        if (this.ContactListData[i]['pImage'] != null) {
          this.ContactListData[i]['pImage'] = "data:image/png;base64," + this.ContactListData[i]['pImage'][0];
        } else {
          this.ContactListData[i]['pImage'] = this._defaultimage.GetdefaultImage()
        }
      }

      // let filterdata = []
      // this.ContactListData.filter(function (data) {

      //     if (data.pContactType == "Individual") {
      //         filterdata.push(data)
      //     }
      // })
      this.ContactListData = result
      this.TempContactListData = result
      this.loading = false;
      if (parseFloat(this.showContacts) > parseFloat(this.ContactListData.length)) {
        this.showContacts = this.ContactListData.length;
      }

      this.ContactListDataFiltered = this.ContactListData.filter(forPan => forPan.pPan == '');
      console.log(this.ContactListDataFiltered);


    })
  }
  Previous() {
    if (this.offsetp != 0) {
      this.offsetp = this.offsetp - 10;
      this.pageno = this.pageno - 1;
      this.GetContactDetails("Contacts", this.offsetp, '');
    }
  }
  Next() {
    debugger
    if (this.pageno != this.TotalPages) {
      this.offsetp = this.offsetp + 10;
      this.pageno = this.pageno + 1;
      this.GetContactDetails("Contacts", this.offsetp, '');
    }
  }
  GetContactCount(Contacts, searchby) {
    this._contacmasterservice.GetContactDetailsListCount(Contacts, searchby).subscribe(result => {
      debugger;
      this.showContactsitems = result;

      if (this.showContactsitems < 10) {
        this.TotalPages = 1;
      }
      else {
        let itc = this.showContactsitems % 10;
        if (itc == 0) {
          this.TotalPages = parseInt((this.showContactsitems / 10).toString());
        }
        else {
          this.TotalPages = parseInt((this.showContactsitems / 10).toString()) + 1;
        }
      }
    });
  }
  LoadMore() {


    let a = this.ContactListData.slice(0, this.showContacts)
    let arr = this.ContactListData.length - a.length

    if (arr > parseFloat(this.displayContacts)) {
      this.showContacts += parseFloat(this.displayContacts);
    } else {
      this.showContacts += arr;
    }


  }
  // ContactsBinding(contacttype) {
  // debugger;
  //   if (contacttype == "Individual") {
  //       this.ContactListData = this.RawContactsList
  //       let filterdata = []
  //       this.ContactListData.filter(function (data) {

  //           if (data.pContactType == "Individual") {
  //               filterdata.push(data)
  //           }
  //       })
  //       this.ContactListData = filterdata
  //       this.TempContactListData = filterdata

  //       if (this.ContactListData.length > parseFloat(this.displayContacts)) {
  //           this.showContacts = parseFloat(this.displayContacts)
  //       } else {
  //           this.showContacts = this.ContactListData.length
  //       }
  //   }
  //   else {
  //       this.ContactListData = this.RawContactsList
  //       let filterdata = []
  //       this.ContactListData.filter(function (data) {

  //           if (data.pContactType == "Business Entity") {
  //               filterdata.push(data)
  //           }
  //       })
  //       this.ContactListData = filterdata
  //       this.TempContactListData = filterdata
  //       if (this.ContactListData.length > parseFloat(this.displayContacts)) {
  //           this.showContacts = parseFloat(this.displayContacts)
  //       } else {
  //           this.showContacts = this.ContactListData.length
  //       }
  //   }
  // }
  NavigateContactListDetailView(RefId, contacttype) {
    debugger;
    //var myparams = btoa(RefId);
    this._contacmasterservice.loadEditInformation(contacttype, RefId)
    this._routes.navigate(['/ContactNew']);
      //this._routes.navigate(['/ContactNewGlobal']);
    this._contacmasterservice.sendstatus("Update")
    // this.router.navigate(['/ContactListDetailView', { id: myparams }])
  }
  NavigateContactListDetaillist(RefId) {
    debugger;
    //var myparams = btoa(RefId);
    // this._contacmasterservice.loadEditInformation(contacttype,RefId)
    // this._routes.navigate(['/configuration/ContactListView'])
    this._routes.navigate(['/ContactNewViewDetailed'], { queryParams: { ID: RefId } })

    // this.router.navigate(['/ContactListDetailView', { id: myparams }])
  }

  NavigateNew() {
    debugger;
    //ContactNewGlobal this._contacmasterservice.loadEditInformation('','');

    //this._routes.navigate(['/ContactNew']);
     this._routes.navigate(['/ContactNewGlobal']);



    this._contacmasterservice.sendstatus("Save")
    // window.location.href='/configuration/contact';

  }
  trackByFn(index, item) {
    return index; // or item.id
  }
  LoadLess() {


    this.showContacts -= parseFloat(this.displayContacts);

  }
  searchChange() {
    this.getContactTotalDetails(this.contactViewForm.controls.pSearchText.value);
  }
  // binding contact details to grid based on type default it will display all contacts
  getContactTotalDetails(type): void {

    this.loading = true;
    this._contacmasterservice.getContactTotalDetails(type).subscribe(json => {
      if (json != null) {
        this.gridView = json;
        this.GridData = this.gridView;

        this.pageCriteria.totalrows = this.GridData.length;

        if (this.GridData.length < this.pageCriteria.pageSize) {
          this.pageCriteria.currentPageRows = this.GridData.length;
        }
        else {
          this.pageCriteria.currentPageRows = this.pageCriteria.pageSize;
        }

      }
      this.loading = false;
    });

  }

  showErrorMessage(errormsg: string) {
    this._commonService.showErrorMessage(errormsg);
  }
  // public onPage(event): void {
  //   console.log(event);
  //   this.count = event.count;
  //   this.pageSize = event.pageSize;
  //   this.limit = event.limit;
  //   this.offset = event.offset;
  // }

  setPageModel() {
    this.pageCriteria.pageSize = this._commonService.pageSize;
    this.pageCriteria.offset = 0;
    this.pageCriteria.pageNumber = 1;
    this.pageCriteria.footerPageHeight = 50;
  }
  showInfoMessage(errormsg: string) {
    this._commonService.showInfoMessage(errormsg);
  }

  status(data: any) {
    debugger;
    let status = data.pStatusname


    data.pCreatedby = this._commonService.pCreatedby;
    if (data.pStatusname == true || data.pStatusname == null) {
      data.pStatusname = false;
      status = false;
    }
    else {
      status = true;
      data.pStatusname = true;
    }

    this._contacmasterservice.deleteContactIndividual(data).subscribe(res => {

      this.getContactTotalDetails(this.contactViewForm.controls.pSearchText.value);
      this.toastr.success("Successfully Status Updated", "Success");

    });
  }
  // grid edit event when click on edit button
  editDetails(event, row, rowIndex, group) {
    debugger;
    try {
      this._contacmasterservice.loadEditInformation(row.pContactType, row.pContactId)
      this._routes.navigate(['/ContactNew'])
    } catch (e) {
      alert(e);

    }
  }
  // grid delete event when click on delete button

  deleteDetails(event, row, rowIndex, group) {
    let data = row;
    this._contacmasterservice.deleteContactIndividual(data).subscribe(res => {
      this.getContactTotalDetails('ALL');

      this.toastr.success("Successfully Status Updated", "Success");

    });
  }



  // public onSearch(event): void {
  //   // let inputValue=event.toString();
  //   // this.GetContactDetails("Contacts",this.offsetp,inputValue);
  //   // this.GetContactCount("Contacts",inputValue);
  //   this.ContactListData = process(this.RawContactsList, {
  //     filter: {
  //       logic: "or",
  //       filters: [
  //         {
  //           field: 'pContactName',
  //           operator: 'contains',
  //           //value: inputValue
  //         },
  //         {
  //           field: 'pContactNumber',
  //           operator: 'contains',
  //           //value: inputValue
  //         },
  //         // {
  //         //   field: 'pBusinessEntityEmailid',
  //         //   operator: 'contains',
  //         //   value: inputValue
  //         // },
  //         // {
  //         //   field: 'pContactId',
  //         //   operator: 'contains',
  //         //   value: inputValue
  //         // },
  //         // {
  //         //   field: 'pReferenceId',
  //         //   operator: 'contains',
  //         //   value: inputValue
  //         // },
  //         // {
  //         //   field: 'pContactType',
  //         //   operator: 'contains',
  //         //   value: inputValue
  //         // },




  //       ],
  //     }
  //   }).data;
  //   this.dataBinding.skip = 0;
  // }

  public onFilter(inputValue: string): void {
    this.ContactListData = process(this.RawContactsList, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'pContactName',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pContactNumber',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pPan',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pContactdId',
            operator: 'contains',
            value: inputValue
          }
        ],
      }
    }).data;

    // this.dataBinding.skip = 0;
  }

  // public onSearch(event): void {
  //   let inputValue=event.toString();

  //   this.GridData = process(this.gridView, {
  //     filter: {
  //       logic: "or",
  //       filters: [
  //         {
  //           field: 'pName',
  //           operator: 'contains',
  //           value: inputValue
  //         },
  //         {
  //           field: 'pBusinessEntityContactno',
  //           operator: 'contains',
  //           value: inputValue
  //         },
  //         {
  //           field: 'pBusinessEntityEmailid',
  //           operator: 'contains',
  //           value: inputValue
  //         },
  //         {
  //           field: 'pContactId',
  //           operator: 'contains',
  //           value: inputValue
  //         },
  //         {
  //           field: 'pReferenceId',
  //           operator: 'contains',
  //           value: inputValue
  //         },
  //         {
  //           field: 'pContactType',
  //           operator: 'contains',
  //           value: inputValue
  //         },




  //       ],
  //     }
  //   }).data;
  //   this.dataBinding.skip = 0;
  // }

  onFooterPageChange(event): void {
    this.pageCriteria.offset = event.page - 1;
    if (this.pageCriteria.totalrows < event.page * this.pageCriteria.pageSize) {
      this.pageCriteria.currentPageRows = this.pageCriteria.totalrows % this.pageCriteria.pageSize;
    }
    else {
      this.pageCriteria.currentPageRows = this.pageCriteria.pageSize;
    }
  }

  public allData(): ExcelExportData {
    const result: ExcelExportData =  {
        data: process(this.ContactListDataFiltered, { }).data
    };

    return result;
}
}
