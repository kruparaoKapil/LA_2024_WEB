import { Component, OnInit, Input, Output, EventEmitter, NgZone, ViewChild } from '@angular/core';
import { CommonService } from "../../../Services/common.service"
import { FormBuilder, FormGroup, Validators, NgForm, FormArray } from '@angular/forms';
import { DefaultProfileImageService } from '../../../Services/Loans/Masters/default-profile-image.service';
import { EmployeeService } from 'src/app/Services/Settings/employee.service';
import { isUndefined } from 'util';

declare let $: any

@Component({
  selector: 'app-member-select',
  templateUrl: './member-select.component.html',
  styles: []
})
export class MemberSelectComponent implements OnInit {

    forIndividualApplicantName: boolean = false;
    ContactType: any
    ContactDetails: any
    DisplayCardData: any
    ShowImageCard: Boolean
    hidewhileupdate: any;
    @Input() SelectType: string;
    @Output() ContactpersondataEventemit = new EventEmitter<any>();
    @Output() ApplicantAndOthers = new EventEmitter<any>();
    pApplicantid: any
    pContactreferenceid: any
    pBusinessEntitycontactNos: any;
    pApplicantname: any
    pBusinessEntitycontactNo: any
    pContacttype: any

    ContactData: any
    croppedImage: any

    ContactSelectForm: FormGroup

    validation: any;
    ContactPersonInformation: any

    constructor(private zone: NgZone, private fb: FormBuilder, private _CommonService: CommonService, private _defaultimage: DefaultProfileImageService, private _Employee: EmployeeService) {

        window['CallingFunctionOutsideContactPersonData'] = {
            zone: this.zone,
            componentFn: (value) => this.ContactPersonData(value),
            component: this,
        };

        window['CallingFunctionOutsideDisplayDetails'] = {
            zone: this.zone,
            componentFn: (value) => this.PersonDetails(value),
            component: this,
        };

        window['CallingFunctionToHideCardInCancelClick'] = {
            zone: this.zone,
            componentFn: () => this.HideingCardInCancelClick(),
            component: this,
        };


    }

    ngOnInit() {

        this.ShowImageCard = false
        this.hidewhileupdate = true;
        this.croppedImage = "assets/images/user.svg"
        this.ContactDetails = []
        //console.log("------------------>",this.SelectType);

        if (this.SelectType == "Contact") {
            this.ContactType = "Individual";
        } else if (this.SelectType == "Business Entity") {
            this.ContactType = this.SelectType
        }
        else {
            this.ContactType = ""
            this.SelectType = "Contact"
        }

        this.ContactSelectForm = this.fb.group({
            pContactId: ['', Validators.required],
            pContactName: [''],
            pBusinessEntitycontactNo: [''],
            pReferenceId: [''],
        })


        this._CommonService._GetContactUpdate().subscribe(data => {
            //console.log("updatecontact : ",data);

            this.updatecontact(data)
        });

    this.GetGroupCreationMembers();

     
        this._Employee._GetButtonShowHide().subscribe(data => {
            this.Validations();
        })
        //this.DataforEmployee=0;
    }

    CancelClick(e) {
        let dataItem = e.dataItem;

        window['CallingFunctionToHideCardInCancelClick'].componentFn()
    }
    HideingCardInCancelClick() {
      debugger;
      this.ContactSelectForm.controls.pContactId.setValue('');
        this.ShowImageCard = false;
        this.ContactpersondataEventemit.emit(null)
    }

    updatecontact(data) {

        //this.DataforEmployee=data;
        let contactdata = {
            "pContactId": data
        };
        this.ContactSelectForm.controls.pContactId.setValue(data);
        this.PersonDetails(contactdata);
        this.hidewhileupdate = false;
    }
    SelectContact(e) {
     debugger;

        if (e.dataItem) {
            var dataItem = e.dataItem;
            //this.DataforEmployee=dataItem.pContactId;
            window['CallingFunctionOutsideDisplayDetails'].componentFn(dataItem)
        }
        else{
           this.HideingCardInCancelClick() ;
        }

    }
    ContactPersonData(data) {
        debugger
        //console.log("data : ",data);
        //console.log("this.ContactType : ",this.ContactType);

        this.pApplicantid = data.pContactId;
        this.pApplicantname = data.pContactName
        this.pContactreferenceid = data.pReferenceId
        this.pBusinessEntitycontactNo = data.pBusinessEntitycontactNo
        this.pContacttype = this.ContactType
        this.ContactData = this.pApplicantid + ',' + this.pApplicantname + ',' + this.pContactreferenceid + ',' + this.pContacttype + ',' + this.pBusinessEntitycontactNo
        //this.ContactData ={"pApplicantid":this.pApplicantid,"pApplicantname":this.pApplicantname,"pContactreferenceid":this.pContactreferenceid,"pContacttype":this.pContacttype,"pBusinessEntitycontactNo":this.pBusinessEntitycontactNo}
        if (this.pContacttype) {
            data["pContacttype"] = this.pContacttype;
        }

        this.ContactpersondataEventemit.emit(data);
        //this.ContactpersondataEventemit.emit(this.ContactData);
    }
GetGroupCreationMembers(){
       this._CommonService.GetGroupCreationMemberDetails().subscribe(contacts => {

            if (contacts) {

                this.ContactDetails = contacts

            }
            $("#contacts").kendoMultiColumnComboBox({
                dataTextField: "pContactName",
                dataValueField: "pContactId",
                height: 400,
                columns: [
                    {
                        field: "pContactName: ", title: "Contact Name", template: "<div class='customer-photo'" +
                            "style='background-image: url(../content/web/Customers/#:data.CustomerID#.jpg);'></div>" +
                            "<span class='customer-name'>#: pContactName #</span>", width: 200
                    },
                    { field: "pBusinessEntitycontactNo", title: "Contact Number", width: 200 },
                    { field: "pReferenceId", title: "Reference ID", width: 200 },

                ],
                footerTemplate: 'Total #: instance.dataSource.total() # items found',
                filter: "contains",
                filterFields: ["pContactName", "pBusinessEntitycontactNo", "pReferenceId"],
                dataSource: this.ContactDetails,
                select: this.SelectContact,
                change: this.CancelClick,

            });


        });
}
    PersonDetails(data) {
        debugger
        //console.log("PersonDetails ");

        this._CommonService.GetContactDetailsbyId(data.pContactId).subscribe(details => {
       debugger;
            this.DisplayCardData = details;
            //  this._CommonService._SetFiTab1Data(this.DisplayCardData.pContactId);      
            if (this.DisplayCardData.pContactimagepath == "") {
                this.croppedImage = this._defaultimage.GetdefaultImage()
                this.ShowImageCard = true;
                window['CallingFunctionOutsideContactPersonData'].componentFn(data)
            }
            else {
                this._CommonService.ConvertImagepathtobase64(this.DisplayCardData.pContactimagepath).subscribe(imagepath => {
                    this.croppedImage = "data:image/png;base64," + imagepath;
                    window['CallingFunctionOutsideContactPersonData'].componentFn(data)
                    this.ShowImageCard = true

                })


                // this.croppedImage = "data:image/png;base64," + json.pPhoto;    
                //window['CallingFunctionOutsideContactPersonData'].componentFn(this.DisplayCardData)
                //this.ShowImageCard = true
            }
        })

    }

    refreshContactSelectComponent() {
       debugger;

        // if (this.value == false) {
        var multicolumncombobox = $("#contacts").data("kendoMultiColumnComboBox");
        if (!isUndefined(multicolumncombobox))
            multicolumncombobox.value("")
        // this.ngOnInit();
        this.ContactSelectForm.reset();
         this.ShowImageCard=false;
        this.DisplayCardData = "";
        //}

    }

    Validations() {

        let validator = $("#myform").kendoValidator().data("kendoValidator");
        if (validator.validateInput($("input[name=Contact]"))) {
            this.validation = true;
        }
        else {
            this.validation = false;
        }
    }

}
