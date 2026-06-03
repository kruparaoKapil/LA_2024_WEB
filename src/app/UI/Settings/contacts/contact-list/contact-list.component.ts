import { Component, OnInit } from '@angular/core';
import { ContacmasterService } from '../../../../Services/Loans/Masters/contacmaster.service'
import { State, process, GroupDescriptor } from '@progress/kendo-data-query';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { CommonService } from "../../../../Services/common.service"
import { DefaultProfileImageService } from '../../../../Services/Loans/Masters/default-profile-image.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';


@Component({
    selector: 'app-contact-list',
    templateUrl: './contact-list.component.html',
    styles: []
})
export class ContactListComponent implements OnInit {
    public loading = false;
    LoadCount: any = 0;

    displayContacts: any = 100;

    showContacts: any = 100;

    croppedImage: any
    ImagePath: any

    ContactListData: any
    TempContactListData: any
    RawContactsList: any
    constructor(private _ContacmasterService: ContacmasterService, private router: Router,
        private _CommonService: CommonService, private _defaultimage: DefaultProfileImageService,
        private spinnerService: Ng4LoadingSpinnerService) { }

    ngOnInit() {

        this.loading = true;
        this._ContacmasterService.GetContactDetailsList("Contacts").subscribe(result => {
            debugger;
            this.ContactListData = result
            this.RawContactsList = result


            for (var i = 0; i < this.ContactListData.length; i++) {
                if (this.ContactListData[i]['pImage'] != null) {
                    this.ContactListData[i]['pImage'] = "data:image/png;base64," + this.ContactListData[i]['pImage'][0];
                } else {
                    this.ContactListData[i]['pImage'] = this._defaultimage.GetdefaultImage()
                }
            }

            let filterdata = []
            this.ContactListData.filter(function (data) {

                if (data.pContactType == "Individual") {
                    filterdata.push(data)
                }
            })
            this.ContactListData = filterdata
            this.TempContactListData = filterdata
            this.loading = false;
            if (parseFloat(this.showContacts) > parseFloat(this.ContactListData.length)) {
                this.showContacts = this.ContactListData.length;
            }

        })

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

    LoadLess() {


        this.showContacts -= parseFloat(this.displayContacts);

    }

    SelectType(type) {
        debugger;
        this.loading = true;
        // this.spinnerService.show();
        if (type != undefined && type != "") {

            if (type != "Contacts") {
                this._ContacmasterService.GetContactDetailsList(type).subscribe(result => {
                    debugger;
                    this.ContactListData = result
                    this.TempContactListData = result
                    for (var i = 0; i < this.ContactListData.length; i++) {
                        if (this.ContactListData[i]['pImage'] != null) {
                            this.ContactListData[i]['pImage'] = "data:image/png;base64," + this.ContactListData[i]['pImage'][0];
                        } else {
                            this.ContactListData[i]['pImage'] = this._defaultimage.GetdefaultImage()
                        }
                    }
                    if (this.ContactListData.length > parseFloat(this.displayContacts)) {
                        this.showContacts = parseFloat(this.displayContacts)
                    } else {
                        this.showContacts = this.ContactListData.length
                    }
                    this.loading = false;
                    //setTimeout(()=>this.spinnerService.hide(),3000)
                })
            } else {
                this._ContacmasterService.GetContactDetailsList(type).subscribe(result => {
                    debugger;
                    this.ContactListData = result
                    this.RawContactsList = result                   
                    for (var i = 0; i < this.ContactListData.length; i++) {
                        if (this.ContactListData[i]['pImage'] != null) {
                            this.ContactListData[i]['pImage'] = "data:image/png;base64," + this.ContactListData[i]['pImage'][0];
                        } else {
                            this.ContactListData[i]['pImage'] = this._defaultimage.GetdefaultImage()
                        }
                    }
                    let filterdata = []
                    this.ContactListData.filter(function (data) {

                        if (data.pContactType == "Individual") {
                            filterdata.push(data)
                        }
                    })
                    this.ContactListData = filterdata
                    this.TempContactListData = filterdata
                    if (this.ContactListData.length > parseFloat(this.displayContacts)) {
                        this.showContacts = parseFloat(this.displayContacts)
                    } else {
                        this.showContacts = this.ContactListData.length
                    }
                    this.loading = false;
                    //setTimeout(()=>this.spinnerService.hide(),3000)
                })
            }

        } else {
            this.ContactListData = []
            this.TempContactListData = []
        }
    }

    ContactsBinding(contacttype) {

        if (contacttype == "Individual") {
            this.ContactListData = this.RawContactsList
            let filterdata = []
            this.ContactListData.filter(function (data) {

                if (data.pContactType == "Individual") {
                    filterdata.push(data)
                }
            })
            this.ContactListData = filterdata
            this.TempContactListData = filterdata

            if (this.ContactListData.length > parseFloat(this.displayContacts)) {
                this.showContacts = parseFloat(this.displayContacts)
            } else {
                this.showContacts = this.ContactListData.length
            }
        }
        else {
            this.ContactListData = this.RawContactsList
            let filterdata = []
            this.ContactListData.filter(function (data) {

                if (data.pContactType == "Business Entity") {
                    filterdata.push(data)
                }
            })
            this.ContactListData = filterdata
            this.TempContactListData = filterdata
            if (this.ContactListData.length > parseFloat(this.displayContacts)) {
                this.showContacts = parseFloat(this.displayContacts)
            } else {
                this.showContacts = this.ContactListData.length
            }
        }
    }

    SearchRecord(inputValue: string) {

        this.ContactListData = process(this.TempContactListData, {
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
                        field: 'pRefNo',
                        operator: 'contains',
                        value: inputValue
                    }
                    // {
                    //   field: 'pMobileno',
                    //   operator: 'contains',
                    //   value: inputValue
                    // }

                ],
            }
        }).data;

    }

    NavigateContactListDetailView(RefId) {

        var myparams = btoa(RefId);
        this.router.navigate(['/ContactListDetailView', { id: myparams }])
    }

    trackByFn(index, item) {
        return index; // or item.id
    }


}
