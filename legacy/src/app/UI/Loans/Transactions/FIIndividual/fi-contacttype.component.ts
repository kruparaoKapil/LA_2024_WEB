import { Component, OnInit, ViewChild, EventEmitter, NgZone, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm, FormArray } from '@angular/forms';
import { FIIndividualService } from '../../../../Services/Loans//Transactions/fiindividual.service'
import { LoansmasterService } from '../../../../Services/Loans/Masters/loansmaster.service'
import { SchememasterService } from 'src/app/Services/Loans/Masters/schememaster.service';
import { CommonService } from '../../../../Services/common.service';
import { DefaultProfileImageService } from '../../../../Services/Loans/Masters/default-profile-image.service';
import { ContactSelectComponent } from '../../../Common/contact-select/contact-select.component';
import { TitleCasePipe } from '@angular/common';
import { MemberService } from 'src/app/Services/Banking/member.service';
import { Router } from '@angular/router';

declare let $: any

@Component({
  selector: 'app-fi-contacttype',
  templateUrl: './fi-contacttype.component.html',
  styles: []
})
export class FiContacttypeComponent implements OnInit {

  @ViewChild(ContactSelectComponent, { static: false }) ContactSelectComp;

  @Output() totalTwotabsData = new EventEmitter();
  @Output() onSelectContactType = new EventEmitter();
  @Output() refreshSecondTabData = new EventEmitter();
  @Output() forContactTypeEmit = new EventEmitter();

  @Input() notEditable: boolean;

  @Input() routePchApplicationId: any;

  FiContactForm: FormGroup;
  GetFITabFdRdDetails: any = [];
  contactValidationErrors: any;
  forSecondTabEditingPContactreferenceid: any;
  pApplicantType: any;
  LoanTypes: any;
  loantypeid: any;
  LoanNames: any;
  ApplicantData: any;
  ApplicantTypes: any;
  ContactDetails: any;
  DisplayCardData: any;
  croppedImage: any;
  pApplicantid: any;
  pContactreferenceid: any;
  pApplicantname: any;
  pBusinessEntitycontactNo: any;
  ContactType: any;
  validation: any;
  pVchapplicationid: any;
  totalLoanDetails: any;
  dropdoenTabname;
  contacttypesDatas: any;
  lastClickedIndex: any;
  companytype: any;
  addressTypeErrorMessage = {};

  forIndividualApplicantName: boolean = false;
  forBusinessApplicantName: boolean = false;
  ShowContactIndividual: Boolean;
  ShowContactBusiness: Boolean;

  SelectType: string;
  TabName: string;

  ShowImageCard: Boolean;
  hideFlagIndividual: boolean = true;
  hideFlagBusiness: boolean = true;
  public isLoading: boolean = false;

  buttonName = "Next";
  _FirstInformationTabsData: any = [];
  GetFICompanyData: any = [];
  pcompanyname:any;
  @Input()
  set FirstInformationTabsData(FirstInformationTabsData: any) {
    this._FirstInformationTabsData = FirstInformationTabsData;
  }


  constructor(private zone: NgZone,
    private fb: FormBuilder,
    private _FIIndividualService: FIIndividualService,
    private _schememasterservice: SchememasterService,
    private _loanmasterservice: LoansmasterService,
    private _commonService: CommonService,
    private _defaultimage: DefaultProfileImageService,
    private titlecasePipe: TitleCasePipe,
    private _memberservices: MemberService, private router:Router) {

    window['CallingFunctionOutsideContactDataForIndividual'] = {
      zone: this.zone,
      componentFn: (value) => this.PersonDetails(value, null),
      component: this,
    };

    window['CallingFunctionOutsideContactDataForBusiness'] = {
      zone: this.zone,
      componentFn: (value) => this.PersonDetails(value, null),
      component: this,
    };

    window['CallingFunctionToHideCard'] = {
      zone: this.zone,
      componentFn: () => this.HideCard(),
      component: this,
    };

  }

  ngOnChanges(): void {
    this.GetFICompany();

  }

  ngOnInit() {
    debugger
    this._commonService._GetFiTab1Data().subscribe(res => {
      if (res != null && res != undefined && res != "") {
        this.pVchapplicationid = (res.pVchapplicationid);
      }
    })
    this.pcompanyname='';
    this.ApplicantData = {};
    this.SelectType = "Contact"
    this.TabName = "FiContactType"
    this.ShowContactIndividual = true
    this.ShowImageCard = false
    this.contactValidationErrors = {};
    this.FiContactForm = this.fb.group({
      pVchapplicationid: [this.pVchapplicationid],
      pLoantypeid: ['', Validators.required],
      pLoanid: ['', Validators.required],
      pContacttype: [''],
      pContactreferenceid: [''],
      pApplicanttype: [''],
      pLoantype: [''],
      pLoanname: [''],
      pBusinessEntitycontactNo: [''],
      pApplicantname: [''],
      pApplicantid: [''],
      ptypeofoperation: ['CREATE'],
      pCreatedby: [this._commonService.pCreatedby],
      pStatusname: ["ACTIVE"],
      pVchapplicantstatus: ['N'],
    })
    this.FiContactForm.controls.pContacttype.setValue("Individual")
    this.BlurEventAllControll(this.FiContactForm);

    this._FIIndividualService.getFiLoanTypes().subscribe(json => {
      this.LoanTypes = json;
    })

    this._loanmasterservice._FindingValidationsBetweenComponents().subscribe(() => {
      if (this.FiContactForm.valid) {
        this._loanmasterservice._setValidationStatus(true);
      }
      else {
        this._loanmasterservice._setValidationStatus(false);
        let str = "loan-details"
        $('.nav-item a[href="#' + str + '"]').tab('show');
      }
    });

    /**---- For getting 1st and 2nd tab data 
     * ----(We will get data when we have vchApplicationId i.e => this.routePchApplicationId)
     **/
    this.getFiIndividualUserData();
    this.GetFICompany();
  }
  GetFICompany() {
    this._FIIndividualService.GetFICompany().subscribe(json => {
      if (json != null) {
        if (json.length > 0) {
          this.GetFICompanyData = json;
            this.companytype = this.GetFICompanyData[0].pFirsttabcombo;
            this.pcompanyname = this.GetFICompanyData[0].pcompanyname;
          
        } else {
          this.companytype = 'Contact';
        }
      }
    })
  }
  // ----(Start)---------For getting 1st and 2nd tab (for both tabs only one API here)------(Start)-- //
  getFiIndividualUserData() {
    if (this.routePchApplicationId) {
      this._FIIndividualService.getFiIndividualUserData(this.routePchApplicationId).subscribe((response: any) => {
        if (response && response[0]) {
          response[0].pVchapplicationid = this.routePchApplicationId;
          this.forSecondTabEditingPContactreferenceid = response[0].pContactreferenceid;
          this.getLoanNameByLoneType(response[0].pLoantypeid);
          this.loantypeid = response[0].pLoanid;
          this.getContacttypes(response[0].pLoanid);
          this.pApplicantType = response[0].pContacttype;
          this.ChangeContactType(this.titlecasePipe.transform(this.pApplicantType));
          this.PersonDetails(response[0], response[0].pContactreferenceid);
          if (response[0].pContactreferenceid) {
            this.ShowImageCard = true;
          }
          else {
            this.ShowImageCard = false;
          }
          //-----(Start)--- Binding data(In edit) for 1st tab ----------(Start)-----------------------//
          this.FiContactForm.patchValue({
            pVchapplicationid: this.routePchApplicationId,
            pLoantypeid: response[0].pLoantypeid,
            pLoanid: response[0].pLoanid,
            pContacttype: response[0].pContacttype,
            pContactreferenceid: response[0].pContactreferenceid,
            pApplicanttype: response[0].pApplicanttype,
            pLoantype: response[0].pLoantype,
            pLoanname: response[0].pLoanname,
            pBusinessEntitycontactNo: response[0].pBusinessEntitycontactNo ? response[0].pBusinessEntitycontactNo : null,
            pApplicantname: response[0].pApplicantname,
            pApplicantid: response[0].pApplicantid,
            ptypeofoperation: response[0].ptypeofoperation,
            pCreatedby: response[0].pCreatedby,
            pStatusname: response[0].pStatusname,
            pVchapplicantstatus: response[0].pVchapplicantstatus
          })
          //-----(End)--- Binding data(In edit) for 1st tab ----------(End)--------------------------//

          /**
           * 2nd Tab Edit Dat Bind Strat
           */


           /**
           * 2nd Tab Edit Dat Bind Strat
           */


          //------(Start)----- For 2nd tab we are emitting data into FI-Master component---------(Start)-----//   
          let data = {
            ShowDetailsOnTab: true,
            LoanDetails: response[0],
          }
          this.totalTwotabsData.emit(data);
          //------(End)----- For 2nd tab we are emitting data into FI-Master component---------(End)-----//
        }
      })
    }
  }
  // ----(End)---------For getting 1st and 2nd tab (for both tabs only one API here)------(End)-- //

  clearData() {
    this.CancelClick();
    this.refreshContactSelectComponent();
    this.GetFITabFdRdDetails = [];
    if (this.FiContactForm.controls['pLoanid'].value) {
      this.FiContactForm.controls['pLoanid'].setValue('');
      this.contactValidationErrors.pLoanid = '';
    }
    if (this.FiContactForm.controls['pApplicanttype'].value) {
      this.FiContactForm.controls['pApplicanttype'].setValue('');
      this.contactValidationErrors.pApplicanttype = ''
    }
    if (this.lastClickedIndex == 0) {
      this.contacttypesDatas = [];
      this.lastClickedIndex = null;
      this.hideFlagIndividual = true;
      this.hideFlagBusiness = true;
    }
  }

  ChangeLoanType(args) {
    this.clearData();
    this.loantypeid = args.currentTarget.value
    let str = args.target.options[args.target.selectedIndex].text
    this.FiContactForm.controls.pLoantype.setValue(str)
    this._schememasterservice.getLoanNames(this.loantypeid).subscribe(data => {
      this.LoanNames = data;
    })

  }

  // Getting loan names by using loan type 
  getLoanNameByLoneType(loneTypeId) {
    this._schememasterservice.getLoanNames(loneTypeId).subscribe(data => {
      this.LoanNames = data;
    })
  }

  // Get FI-Contacttypes  data - Ravi Shankar 
  getContacttypes(loanid) {
    if (loanid && loanid != '') {
      this._FIIndividualService.getContacttypes(loanid).subscribe(response => {
        if (response && response != null) {
          this.contacttypesDatas = response;
          if (this.contacttypesDatas.length == 1) {
            this.pApplicantType = response[0].pContacttype;
          }
          if (this.forSecondTabEditingPContactreferenceid == '' ||
            this.forSecondTabEditingPContactreferenceid == null ||
            this.forSecondTabEditingPContactreferenceid == undefined) {
            this.lastClickedIndex = 0;
            this.changeActive(this.lastClickedIndex);
          }
          else {
            for (let i = 0; i < this.contacttypesDatas.length; i++) {
              if (this.pApplicantType) {
                if ((this.pApplicantType).toUpperCase() == (this.contacttypesDatas[i].pContacttype).toUpperCase()) {

                  this.lastClickedIndex = i;
                }
              }
            }
          }

          if (this.contacttypesDatas && this.contacttypesDatas.length == 1) {
            if (this.titlecasePipe.transform(this.contacttypesDatas[0].pContacttype) == 'Business Entity') {
              this.hideFlagIndividual = true;
              this.hideFlagBusiness = false;
              this.lastClickedIndex = 0;
            } else {
              this.getApplicantTypes(this.contacttypesDatas[0].pContacttype, this.loantypeid);
              this.hideFlagBusiness = true;
              this.hideFlagIndividual = false;
            }

          } else {
            this.getApplicantTypes(this.pApplicantType, this.loantypeid)
            this.hideFlagBusiness = false;
            this.hideFlagIndividual = false;
          }
        }
      })
    }
  }

  //to get acrive contact type index - Ravi Shankar 
  changeActive(i) {
    debugger
    this.lastClickedIndex = i;
    this.ChangeContactType(this.titlecasePipe.transform(this.contacttypesDatas[i].pContacttype));
    if (this.FiContactForm.value.pApplicantname) {
      this.FiContactForm.patchValue({
        pApplicantname: ''
      })
    }
  }

  ChangeLoanName(args) {
    this.GetFITabFdRdDetails = [];
    if (this.FiContactForm.controls['pApplicanttype'].value) {
      this.FiContactForm.controls['pApplicanttype'].setValue('');
      this.contactValidationErrors.pApplicanttype = ''
      this.CancelClick();
      this.refreshContactSelectComponent();
    }
    this.loantypeid = args.currentTarget.value;
    let str = args.target.options[args.target.selectedIndex].text
    this.FiContactForm.controls.pLoanname.setValue(str)
    this.getContacttypes(this.loantypeid);
  }

  ChangeContactType(type) {
    if (type == "Individual") {
      this.FiContactForm.controls['pApplicanttype'].setValidators([Validators.required]);
      this.SelectType = "Contact";
      this.ContactType = type;
      this.BindContactDetails(this.ContactType);
      this.ShowContactIndividual = true;
      this.ShowImageCard = false;
      this.FiContactForm.controls.pContacttype.setValue(type);
      this.refreshContactSelectComponent();
      this.FiContactForm.controls.pApplicanttype.clearValidators();
      this.FiContactForm.controls.pApplicanttype.updateValueAndValidity();
      this.BlurEventAllControll(this.FiContactForm);
      this.getApplicantTypes(type, this.loantypeid ? this.loantypeid : 0);
    } else if (type == "Business Entity") {
      this.SelectType = "Business Entity";
      this.ContactType = type;
      this.BindContactDetails(this.ContactType);
      this.ShowContactIndividual = false;
      this.ShowImageCard = false;
      this.FiContactForm.controls.pContacttype.setValue(type);
      this.refreshContactSelectComponent();
      this.FiContactForm.controls.pApplicanttype.clearValidators();
      this.FiContactForm.controls.pApplicanttype.updateValueAndValidity();
      this.BlurEventAllControll(this.FiContactForm);
      this.getApplicantTypes(type, this.loantypeid ? this.loantypeid : 0);

      //-----(Start)---- For Applicant required validation------------(Start)-----------------------//  
      if (this.forIndividualApplicantName == true && this.forBusinessApplicantName == false) {
        this.forBusinessApplicantName = true;
      }
      //-----(End)---- For Applicant required validation------------(End)-----------------------//
    }

    this.onSelectContactType.emit(type);
  }

  getApplicantTypes(type, loanId) {
    if (type && type != undefined && type != '') {
      this._loanmasterservice.GetApplicanttypes(type, loanId).subscribe(json => {
        if (json) {
          this.ApplicantTypes = json;
        }
      })
    }
  }

  BindContactDetails(contacttype) {
    if (this.pcompanyname == 'MAC') {
      this._memberservices.GetFIMemberNames(contacttype).subscribe(contacts => {
        debugger;
        if (contacts) {
          this.ContactDetails = contacts;
          this.membersDataBind();
        }
      });
    } else {
      this._commonService.GetContactDetails(contacttype).subscribe(contacts => {
        debugger;
        if (contacts) {
          this.ContactDetails = contacts
          this.contactsDataBind();
        }
      });
    }
  }
  membersDataBind() {
    if (this.SelectType == 'Contact') {
      $("#contactsData").kendoMultiColumnComboBox({
        dataTextField: "pContactName",
        dataValueField: "pContactId",
        height: 400,
        columns: [
          {
            field: "pContactName: ", title: "Member Name", template: "<div class='customer-photo'" +
              "style='background-image: url(../content/web/Customers/#:data.CustomerID#.jpg);'></div>" +
              "<span class='customer-name'>#: pContactName #</span>", width: 200
          },
          { field: "pContactNo", title: "Member Contact Number", width: 200 },
          { field: "pMemberReferenceId", title: "Member Reference ID", width: 200 },

        ],
        footerTemplate: 'Total #: instance.dataSource.total() # items found',
        filter: "contains",
        filterFields: ["pContactName", "pContactNo", "pMemberReferenceId"],
        dataSource: this.ContactDetails,
        select: this.SelectContactDataForIndividual,
        change: this.CancelClick
      });
    }
    else {
      $("#businessContactsData").kendoMultiColumnComboBox({
        dataTextField: "pContactName",
        dataValueField: "pContactId",
        height: 400,
        columns: [
          {
            field: "pContactName: ", title: "Contact Name", template: "<div class='customer-photo'" +
              "style='background-image: url(../content/web/Customers/#:data.CustomerID#.jpg);'></div>" +
              "<span class='customer-name'>#: pContactName #</span>", width: 200
          },
          { field: "pContactNo", title: "Contact Number", width: 200 },
          { field: "pMemberReferenceId", title: "Reference ID", width: 200 },

        ],
        footerTemplate: 'Total #: instance.dataSource.total() # items found',
        filter: "contains",
        filterFields: ["pContactName", "pContactNo", "pMemberReferenceId"],
        dataSource: this.ContactDetails,
        select: this.SelectContactDataForBusiness,
        change: this.CancelClick
      });
    }
  }
  contactsDataBind() {
    if (this.SelectType == 'Contact') {
      $("#contactsData").kendoMultiColumnComboBox({
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
        select: this.SelectContactDataForIndividual,
        change: this.CancelClick
      });
    }
    else {
      $("#businessContactsData").kendoMultiColumnComboBox({
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
        select: this.SelectContactDataForBusiness,
        change: this.CancelClick
      });
    }
  }

  //---(Start)---------- For remove selected contact ------------------------------(Start)--------//
  //------ This method's componentFn() will call below HideCard() -----------
  CancelClick() {
    window['CallingFunctionToHideCard'].componentFn()
  }

  HideCard() {
    this.ShowImageCard = false
    if (this.FiContactForm.controls['pApplicantname'].value) {
      this.FiContactForm.controls['pApplicantname'].setValue('');
      this.contactValidationErrors.pApplicanttype = '';
    }
  }

  //---(End)---------- For remove selected contact ------------------------------(End)--------//

  //-----(Start)----- For Binding select contact data for Both Individual and Business Entity----(Start)---//
  ///---- These below two methods will call same PersonDetails() method --------
  //----------(Start)---- For selected contact binding data For Individual--------(Start)----------//
  SelectContactDataForIndividual(e) {
    if (e.dataItem) {
      var dataItem = e.dataItem;
      window['CallingFunctionOutsideContactDataForIndividual'].componentFn(dataItem)
    }
  }
  //----------(End)---- For selected contact binding data For Individual--------(End)----------//

  //----------(Start)---- For selected contact binding data For Business Entity--------(Start)----------//
  SelectContactDataForBusiness(e) {
    if (e.dataItem) {
      var dataItem = e.dataItem;
      window['CallingFunctionOutsideContactDataForBusiness'].componentFn(dataItem)
    }
  }
  //----------(End)---- For selected contact binding data For Business Entity--------(End)----------//

  PersonDetails(data, conferenceId) {
    this.GetFITabFdRdDetails = [];
    if (this.FiContactForm.controls.pLoantype.value == 'Loan Against Deposits' && (this.FiContactForm.controls.pLoanname.value== "Fd Loan" || this.FiContactForm.controls.pLoanname.value== "Rd Loan")) {
      let pLoanname = this.FiContactForm.controls.pLoanname.value;
      this._memberservices.GetFITabFdRdDetails(data.pMemberId, pLoanname).subscribe(json => {
        debugger
        if (json) {
          this.GetFITabFdRdDetails = json;
        }
      });
    }

    this._commonService.GetContactDetailsbyId(data.pContactId ? data.pContactId : data.pApplicantid).subscribe(details => {
      this.DisplayCardData = details
      if (this.DisplayCardData.pContactimagepath == "") {
        this.croppedImage = this._defaultimage.GetdefaultImage()
      }
      else {
        this._commonService.ConvertImagepathtobase64(this.DisplayCardData.pContactimagepath).subscribe(imagepath => {
          this.croppedImage = "data:image/png;base64," + imagepath;
        })
      }

      this.ShowImageCard = true;
      this.pApplicantid = this.DisplayCardData.pContactId;
      this.pApplicantname = this.DisplayCardData.pContactName;
      this.pContactreferenceid = this.DisplayCardData.pReferenceId;
      this.pBusinessEntitycontactNo = this.DisplayCardData.pBusinessEntitycontactNo;
      this.ApplicantData = {
        pcontactid: this.DisplayCardData.pContactId,
        papplicantname: this.DisplayCardData.pContactName,
        pcontactreferenceid: this.DisplayCardData.pReferenceId,
        pcontacttype: this.FiContactForm.controls.pContacttype.value,
        papplicanttype: 'Applicant',
        papplicantconfigstatus: 'NO',
        pBusinessEntitycontactNo: this.DisplayCardData.pBusinessEntitycontactNo
      };

      this.FiContactForm.controls.pApplicantid.setValue(this.DisplayCardData.pContactId);
      this.FiContactForm.controls.pApplicantname.setValue(this.DisplayCardData.pContactName);
      this.FiContactForm.controls.pContactreferenceid.setValue(this.DisplayCardData.pReferenceId);
      this.FiContactForm.controls.pBusinessEntitycontactNo.setValue(this.DisplayCardData.pBusinessEntitycontactNo);
      if (conferenceId) {
        this.FiContactForm.controls.ptypeofoperation.setValue('UPDATE');
        var multicolumncombobox: any;
        if (this.SelectType == 'Contact') {
          multicolumncombobox = $("#contactsData").data("kendoMultiColumnComboBox");
        }
        else {
          multicolumncombobox = $("#businessContactsData").data("kendoMultiColumnComboBox");
        }
        if (multicolumncombobox)
          multicolumncombobox.value(this.pApplicantid)
      }
      else {
        this.FiContactForm.controls.ptypeofoperation.setValue('CREATE')
      }

      if (this.SelectType == 'Contact') {
        if (this.FiContactForm.value.pApplicantname == '' ||
          this.FiContactForm.value.pApplicantname == null ||
          this.FiContactForm.value.pApplicantname == undefined) {
          this.forIndividualApplicantName = true;
        }
        else {
          this.forIndividualApplicantName = false;
        }
      }
      else if (this.SelectType == "Business Entity") {
        if (this.FiContactForm.value.pApplicantname == '' ||
          this.FiContactForm.value.pApplicantname == null ||
          this.FiContactForm.value.pApplicantname == undefined) {
          this.forBusinessApplicantName = true;
        }
        else {
          this.forBusinessApplicantName = false;
        }
      }

      this._FIIndividualService.getApplicantandOthersData.emit()
    })
  }
  //-----(End)----- For Binding select contact data for Both Individual and Business Entity----(End)---//

  refreshContactSelectComponent() {
    var multicolumncombobox: any;
    if (this.SelectType == 'Contact') {
      multicolumncombobox = $("#contactsData").data("kendoMultiColumnComboBox");
    }
    else {
      multicolumncombobox = $("#businessContactsData").data("kendoMultiColumnComboBox");
    }
    if (multicolumncombobox)
      multicolumncombobox.value("")
  }

  Validations() {
    if (this.SelectType == 'Contact') {
      if (this.FiContactForm.value.pApplicantname == '' ||
        this.FiContactForm.value.pApplicantname == null ||
        this.FiContactForm.value.pApplicantname == undefined) {
        this.forIndividualApplicantName = true;
      }
      else {
        this.forIndividualApplicantName = false;
      }
    }
    else if (this.SelectType == "Business Entity") {
      if (this.FiContactForm.value.pApplicantname == '' ||
        this.FiContactForm.value.pApplicantname == null ||
        this.FiContactForm.value.pApplicantname == undefined) {
        this.forBusinessApplicantName = true;
      }
      else {
        this.forBusinessApplicantName = false;
      }
    }

    if (this.FiContactForm.controls.pApplicanttype.value == '') {
      this.contactValidationErrors.pApplicanttype = 'Applicant type required';
      return this.validation = false;
    } else {
      this.contactValidationErrors.pApplicanttype = '';
      if (this.SelectType == "Business Entity") {
        this.FiContactForm.controls.pContacttype.setValue('Business Entity');
        return this.validation = true;
      }
      else if (this.SelectType == "Contact") {
        this.FiContactForm.controls.pContacttype.setValue('Individual');
        return this.validation = true;
      }
    }
  }
  ChangeApplicantType(event) {
    this.GetFITabFdRdDetails = [];
    this.contactValidationErrors.pApplicanttype = '';
  }

  GetContactPersonData(data) {

    if (data) {
      this.ApplicantData = { pApplicantid: data.pContactId, pApplicantname: data.pContactName, pContactreferenceid: data.pReferenceId, pContacttype: data.pContacttype, pApplicanttype: 'Applicant', pApplicantConfigStatus: 'NO', pBusinessEntitycontactNo: data.pBusinessEntitycontactNo };
      this.FiContactForm.controls.pApplicantid.setValue(data.pContactId)
      this.FiContactForm.controls.pApplicantname.setValue(data.pContactName)
      this.FiContactForm.controls.pContactreferenceid.setValue(data.pReferenceId)
      this.FiContactForm.controls.pContacttype.setValue(data.pContacttype)
      this.FiContactForm.controls.pBusinessEntitycontactNo.setValue(data.pBusinessEntitycontactNo);
      this.FiContactForm.controls.ptypeofoperation.setValue('CREATE');
      this._FIIndividualService.getApplicantandOthersData.emit()
    }
  }

  nextTabClick() {
    debugger;
    let str;
    let temptabname;
    //this.dropdoenTabname = this._commonService.GetFiTabName();
    /// $("#personal-details").addClass("active show");
    //let tempFirstInformationTabsData = this._FirstInformationTabsData;
    // for (let i = 0; i < tempFirstInformationTabsData.length; i++) {
    //   let pTabsectionname = tempFirstInformationTabsData[i].pTabsectionname;
    //   if (pTabsectionname == this.dropdoenTabname) {
    //     str = tempFirstInformationTabsData[i + 1].pTabsectionid;
    //     temptabname = tempFirstInformationTabsData[i + 1].pTabsectionname;
    //     this._commonService.SetFiTabName(temptabname);
    //   }
    // }

    // let data = this._FIIndividualService.moevToNextTab(tempFirstInformationTabsData, this.dropdoenTabname);
    // str = data.tabId;
    // temptabname = data.tabName;
    // if(str=='' && temptabname==''){
    //   this.buttonName = "Submit";
    //   this.isLoading = false;
    //   this._commonService.showInfoMessage('Saved successfully');
    //   this.router.navigateByUrl('/FiView');
    //   return
    // }
    // this._commonService.SetFiTabName(this.dropdoenTabname);
    let isValid = true;
    this.buttonName = "Processing";
    this.isLoading = true;
    if (this.checkValidations(this.FiContactForm, isValid)) {
      if (this.Validations()) {
        let data = this.FiContactForm.value;
        if (this.SelectType == 'Contact') {
          if (this.forIndividualApplicantName == false) {
            this._FIIndividualService._SetFITabFdRdDetails(this.GetFITabFdRdDetails, this.FiContactForm.controls.pLoantype.value);
            this._commonService.SetFiTab1Data(data);
            this._commonService._SetFiTab1Data(data);
            let str = "loan-details"
            $('.nav-item a[href="#' + str + '"]').tab('show');
            //$('.nav-item a[href="#' + str + '"]').tab('show').addClass('active show');
            this.dropdoenTabname = "Loan Details";
            this._commonService.SetFiTabName(this.dropdoenTabname);
            //this.dropdoenTabname = temptabname;
          }
        }
        if (this.SelectType == 'Business Entity') {
          if (this.forBusinessApplicantName == false) {
            this._FIIndividualService._SetFITabFdRdDetails(this.GetFITabFdRdDetails, this.FiContactForm.controls.pLoantype.value);
            this._commonService.SetFiTab1Data(data);
            this._commonService._SetFiTab1Data(data);
            let str = "loan-details"
            //$('.nav-item a[href="#' + str + '"]').tab('show').addClass('active show');
            $('.nav-item a[href="#' + str + '"]').tab('show');
            this.dropdoenTabname = "Loan Details";
            //this.dropdoenTabname = temptabname;
            this._commonService.SetFiTabName(this.dropdoenTabname);
          }
        }
      }
      this.buttonName = "Next";
      this.isLoading = false;
    }
    else {
      if (this.FiContactForm.controls.pApplicanttype.value == '') {
        this.contactValidationErrors.pApplicanttype = 'Applicant type required';
      } else {
        this.contactValidationErrors.pApplicanttype = '';
        if (this.SelectType == "Business Entity") {
          this.FiContactForm.controls.pContacttype.setValue('Business Entity');
        }
        if (this.SelectType == "Contact") {
          this.FiContactForm.controls.pContacttype.setValue('Individual');
        }
      }
      if (this.SelectType == 'Contact') {
        if (this.FiContactForm.value.pApplicantname == '' ||
          this.FiContactForm.value.pApplicantname == null ||
          this.FiContactForm.value.pApplicantname == undefined) {
          this.forIndividualApplicantName = true;
        }
        else {
          this.forIndividualApplicantName = false;
        }
      }
      else if (this.SelectType == "Business Entity") {
        if (this.FiContactForm.value.pApplicantname == '' ||
          this.FiContactForm.value.pApplicantname == null ||
          this.FiContactForm.value.pApplicantname == undefined) {
          this.forBusinessApplicantName = true;
        }
        else {
          this.forBusinessApplicantName = false;
        }
      }
      this.buttonName = "Next";
      this.isLoading = false;
    }
    //---- (Start) ------- For refreshing 2nd tab while creating---------------------- (Start) -----------//
    if (this.notEditable == false) {
      this.refreshSecondTabData.emit(true);
    }
    else {
      this.refreshSecondTabData.emit(false);
    }
    //---- (End) ------- For refreshing 2nd tab while creating---------------------- (End) -----------//

    //-----(Start)---- For 3rd tab getting data for <app-contact-select> component-----------(Start)----------//
    this.forContactTypeEmit.emit(this.SelectType);
    //-----(End)---- For 3rd tab getting data for <app-contact-select> component-----------(End)----------//
  }

  checkValidations(group: FormGroup, isValid: boolean): boolean {
    try {
      Object.keys(group.controls).forEach((key: string) => {
        isValid = this.GetValidationByControl(group, key, isValid);
      })
    }
    catch (e) {
      this.showErrorMessage(e);
      return false;
    }
    return isValid;
  }

  GetValidationByControl(formGroup: FormGroup, key: string, isValid: boolean): boolean {
    try {
      let formcontrol;
      formcontrol = formGroup.get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          this.checkValidations(formcontrol, isValid)
        }
        else if (formcontrol.validator) {
          this.contactValidationErrors[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.contactValidationErrors[key] += errormessage + ' ';
                isValid = false;
              }
            }
          }
        }
      }
    }
    catch (e) {
      this.showErrorMessage(e);
      return false;
    }
    return isValid;
  }

  showErrorMessage(errormsg: string) {
    this._commonService.showErrorMessage(errormsg);
  }

  BlurEventAllControll(fromgroup: FormGroup) {
    try {
      Object.keys(fromgroup.controls).forEach((key: string) => {
        this.setBlurEvent(fromgroup, key);
      })
    }
    catch (e) {
      this.showErrorMessage(e);
      return false;
    }
  }

  setBlurEvent(fromgroup: FormGroup, key: string) {
    try {
      let formcontrol;
      formcontrol = fromgroup.get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          this.BlurEventAllControll(formcontrol)
        }
        else {
          if (formcontrol.validator)
            fromgroup.get(key).valueChanges.subscribe((data) => { this.GetValidationByControl(fromgroup, key, true) })
        }
      }
    }
    catch (e) {
      this.showErrorMessage(e);
      return false;
    }
  }

  updatecontact(data) {
    let contactdata = {
      "pContactId": data
    };
    if (contactdata && contactdata.pContactId) {
      setTimeout(() => {
        this.PersonDetails(contactdata, '');
      }, 0);
    }
  }

  trackByFn(index, item) {
    return index; // or item.id
  }
}
