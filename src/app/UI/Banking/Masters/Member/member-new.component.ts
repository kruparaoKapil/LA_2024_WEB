import { Component, OnInit, NgZone, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MemberService } from '../../../../Services/Banking/member.service';
import { LoansmasterService } from "../../../../Services/Loans/Masters/loansmaster.service";
import { CommonService } from '../../../../Services/common.service';
import { DefaultProfileImageService } from '../../../../Services/Loans/Masters/default-profile-image.service';
import { FIIndividualService } from '../../../../Services/Loans//Transactions/fiindividual.service'
import { FiKycandidentificationComponent } from '../../../../UI/Loans/Transactions/FIIndividual/fi-kycandidentification.component';
import { FiPersonaldetailsComponent } from '../../../../UI/Loans/Transactions/FIIndividual//fi-personaldetails.component';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AccountingTransactionsService } from 'src/app/Services/Accounting/accounting-transactions.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TdsdetailsService } from 'src/app/Services/tdsdetails.service';
import { Router } from '@angular/router';
import { FiReferencesComponent } from '../../../Loans/Transactions/FIIndividual/fi-references.component';
import { DatePipe } from '@angular/common';



declare let $: any


@Component({
  selector: 'app-member-new',
  templateUrl: './member-new.component.html',
  styles: []
})
export class MemberNewComponent implements OnInit {

  @ViewChild(FiKycandidentificationComponent, { static: false }) FiKycandidentification: FiKycandidentificationComponent;
  @ViewChild(FiPersonaldetailsComponent, { static: false }) FiPersonaldetails: FiPersonaldetailsComponent;
  @ViewChild(FiReferencesComponent, { static: false }) fiReferences: FiReferencesComponent;
  //@Output() forGettingReferencesDataEmit = new EventEmitter();


  FIMemberContactForm: FormGroup
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  dob: any;
  constructor(private datePipe: DatePipe, private _fb: FormBuilder, private zone: NgZone, private _MemberService: MemberService,
    private _loanmasterservice: LoansmasterService, private _commonService: CommonService,
    private _defaultimage: DefaultProfileImageService, private _FIIndividualService: FIIndividualService,
    private _Accountservice: AccountingTransactionsService, private toaster: ToastrService,
    private _route: ActivatedRoute, private _TdsService: TdsdetailsService, private router: Router) {
    this.dpConfig.dateInputFormat = 'DD/MM/YYYY'
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

  TestData: any
  Originaldata: any

  FiMemberContactFormErrors: any

  notEditable: boolean = false;
  notEditableEdit: Boolean
  notEditableEditB: Boolean
  minDate: Date = new Date();
  maxDate: Date = new Date();
  bsValue = new Date();
  forHideButton: boolean = false;
  SelectType: string

  MemberTypesList: any
  ApplicantTypesList: any
  ContactDetailsList: any
  ShowImageCard: Boolean
  DisplayCardData: any
  croppedImage: any

  pApplicantid: any
  pContactreferenceid: any
  pApplicantname: any
  pBusinessEntitycontactNo: any
  ApplicantData: any

  lstApplicantandOthersData: any

  selectedContactType: string = "Individual";

  FIMemberTab1Data: any
  MemberDetailsForHeader: any
  pVchapplicationId: any
  pApplicantId: any
  ShowDetailsOnTab: Boolean = false

  ReferealComisionNotApplicableForLoan: Boolean = false;
  tdsnotApplicableforloan: Boolean
  ReferealNotApplicableForLoan: Boolean

  public tdssectionlist: any;
  tdslist: any

  ShowTdsFlag: boolean = false
  ShowReferalFlag: boolean = false
  ShowRefComisionFlag: boolean = false

  forIndividualApplicantName: boolean = false;
  forBusinessApplicantName: boolean = false;

  notApplicableForReferencFlag: boolean = true;

  routeVchApplicationId: string = undefined
  ButtonType: string = 'New';
  TDSsectiondetails: any

  isValid: boolean = false
  IsReferalDataEmptyOrNull: any

  pContactId: any

  FimemCount: any
  PreviousFixedAmount: any
  PreviousTdsType: any
  disabletransactiondate = false;
  ngOnInit() {
    debugger
    if (this._commonService.comapnydetails != null)
    this.disabletransactiondate = this._commonService.comapnydetails.pdatepickerenablestatus;

    this.FiMemberContactFormErrors = {}
    this.PreviousFixedAmount = ""
    this.PreviousTdsType = ""
    if (this._route.snapshot.params['id']) {
      debugger
      this.routeVchApplicationId = atob(this._route.snapshot.params['id']);
      this.pVchapplicationId = this.routeVchApplicationId
      this.notEditable = true;
    }
    else {
      this.notEditable = false;
    }

    this.FIMemberTab1Data = []
    this.ApplicantData = {}
    this.ShowImageCard = false
    this.SelectType = "Contact"

    this.ReferealComisionNotApplicableForLoan = true;
    this.tdsnotApplicableforloan = true
    this.ReferealNotApplicableForLoan = true;
    this.ShowTdsFlag = true
    this.ShowReferalFlag = true
    this.ShowRefComisionFlag = true

    this.FIMemberContactForm = this._fb.group({

      pFIMemberDate: [new Date()],
      pContacttype: [''],
      pContactName: ['', Validators.required],
      pContactReferenceId: [''],
      pContactId: 0,
      pContactNo: [''],
      // pApplicanttype: ['', Validators.required],
      pApplicanttype: [''],
      pMemberType: [''],
      pMembertypeId: ['', Validators.required],
      pMemberStatus: [''],
      pMemberReferenceId: [''],
      pMemberId: ['0'],
      pEmailId: [''],


      //Tab 5 Properties
      pIsReferralApplicableorNot: [false],
      isReferralCommisionpaidforthisLoan: [false],
      pCommisionPayoutType: [''],
      pCommisionPayoutAmountorPercentile: [''],
      pIsTdsapplicable: [false],
      pTdstype: [''],
      pTdsSection: [''],

      pEffectfromdate: [''],
      pEffecttodate: [''],
      pTdsamount: [' 0'],
      pTDSAccountId: [''],
      pMemberReferenceid: [''],
      //
      pCreatedby: [this._commonService.pCreatedby],
      pStatusid: ['1'],
      pStatusname: ['ACTIVE'],
      ptypeofoperation: ['CREATE'],
    })

    this.FIMemberContactForm.controls.pContacttype.setValue("Individual")
    // this._MemberService.GetMemberDetailsList().subscribe(result => {
    //   this.MemberTypesList = result
    //   //let memberid = args.target.value
    //  // this.FIMemberContactForm.controls.pMembertypeId.setValue(this.MemberTypesList[0].pmembertypeid)
    //   //let type = args.target.options[args.target.selectedIndex].text;
    //   //this.FIMemberContactForm.controls.pMemberType.setValue(this.MemberTypesList[0].pmembertype)

    // })
    this._commonService.Getmemberdetails('Member').subscribe(json => {
      this.MemberTypesList = json;
    });
    this.GetApplicantTypes("Individual");
    this.BindContactDetails("Individual")

    this._FIIndividualService.getApplicantandOthersData.subscribe(json => {
      this.getApplicantandOthersData();
    })

    this._FIIndividualService.getKycAndCreditscoreData.subscribe(json => {
      this.forGettingKYCAndCreditScoreData(true);
    })

    this._MemberService._GetFiMemberTab1Data().subscribe(res => {
      debugger
      if (res != null && res != undefined && res != "") {
        this.MemberDetailsForHeader = res
        this.pVchapplicationId = this.MemberDetailsForHeader[0].pMemberReferenceId;
        this.pApplicantId = this.MemberDetailsForHeader[0].pMemberId;
        this.ShowDetailsOnTab = true
      }

    })

    this._TdsService.getTDSsectiondetails().subscribe(
      (json) => {

        if (json != null) {
          this.TDSsectiondetails = json;

        }
      },
      (error) => {

        this._commonService.showErrorMessage(error);
      }
    );

    this.BlurEventAllControll(this.FIMemberContactForm);

    this.ButtonType = this._MemberService.GetButtonType();
    if (this._route.snapshot.params['id']) {
      if (this.ButtonType != "New") {
        //this.BttonText = "Update"
        this.notEditableEdit = true
        this.notEditableEditB = true
        this.LoadDataForEdit()
      }
    } else {
      this.ButtonType = "New";
    }

  }

  LoadDataForEdit() {
    debugger
    if (this.pVchapplicationId) {
      this._MemberService.GetFIMemberDataToEditById(this.pVchapplicationId).subscribe(response => {
        debugger
        let d = response;
        console.log("response is", d)
        let Tab1Data = response["_FiMemberContactDetailsDTO"]
        let Tab5data = response["_FiMemberReferralDTO"]


        this.FIMemberContactForm.controls.pMemberReferenceId.setValue(Tab1Data.pMemberReferenceId)
        this.FIMemberContactForm.controls.pMemberReferenceid.setValue(Tab1Data.pMemberReferenceId)
        this.FIMemberContactForm.controls.pMemberId.setValue(Tab1Data.pMemberId)

        this.FIMemberContactForm.controls.pContacttype.setValue(Tab1Data.pContacttype)
        this.FIMemberContactForm.controls.pMemberType.setValue(Tab1Data.pMemberType)
        this.FIMemberContactForm.controls.pMembertypeId.setValue(Tab1Data.pMembertypeId)
        this.FIMemberContactForm.controls.pApplicanttype.setValue(Tab1Data.pApplicantType)

        this.FIMemberTab1Data.push(Tab1Data)
        this._MemberService._SetFiMemberTab1Data(this.FIMemberTab1Data)
        this.PersonDetails(Tab1Data, Tab1Data.pContactReferenceId);

        debugger;
        if (Tab5data != null) {
          this.IsReferalDataEmptyOrNull = true
          if (Tab5data.pIsReferralApplicableorNot == true) {

            this.ReferealNotApplicableForLoan = false;
            this.ReferealComisionNotApplicableForLoan = false;
            this.tdsnotApplicableforloan = false;
            this.FIMemberContactForm.controls.pIsReferralApplicableorNot.setValue(true)
            this.FIMemberContactForm.controls.isReferralCommisionpaidforthisLoan.setValue(false)
            this.FIMemberContactForm.controls.isReferralCommisionpaidforthisLoan.setValue(false)
            this.ShowReferalFlag = false
            this.ShowRefComisionFlag = false
            this.ShowTdsFlag = false
            //this.FIMemberContactForm.controls.pTdsSection.setValidators([Validators.required]);
            //this.FIMemberContactForm.controls.pCommisionPayoutAmountorPercentile.setValidators([Validators.required]);
            //this.FIMemberContactForm.controls.pTdsSection.updateValueAndValidity();
            //this.FIMemberContactForm.controls.pCommisionPayoutAmountorPercentile.updateValueAndValidity();
            this.FIMemberContactForm.controls.pCommisionPayoutType.setValue("Fixed")
            if (Tab5data.isReferralCommisionpaidforthisLoan == true) {

              this.ReferealComisionNotApplicableForLoan = false;
              this.FIMemberContactForm.controls.isReferralCommisionpaidforthisLoan.setValue(true)
              this.ShowRefComisionFlag = false;

              this.FIMemberContactForm.controls.pCommisionPayoutType.setValue(Tab5data.pCommisionPayoutType)
              let amount = this._commonService.currencyformat(Tab5data.pCommisionPayoutAmountorPercentile)
              this.PreviousFixedAmount = amount
              this.FIMemberContactForm.controls.pCommisionPayoutAmountorPercentile.setValue(amount)

              this.FIMemberContactForm.controls.pCommisionPayoutAmountorPercentile.setValidators([Validators.required])
              this.FIMemberContactForm.controls.pCommisionPayoutAmountorPercentile.updateValueAndValidity()
              this.BlurEventAllControll(this.FIMemberContactForm);
            }

            if (Tab5data.pIsTdsapplicable == true) {
              this.tdsnotApplicableforloan = false;
              this.FIMemberContactForm.controls.pIsTdsapplicable.setValue(true)
              this.ShowTdsFlag = false
              this.PreviousTdsType = Tab5data.pTdsSection
              this.FIMemberContactForm.controls.pTdsSection.setValue(Tab5data.pTdsSection)
            }

          }
        } else {
          this.IsReferalDataEmptyOrNull = false
        }
        if (Tab1Data.pContacttype == "Business Entity") {
          this.SelectType = "Business Entity"
          this.selectedContactType = "Business Entity";
        } else {
          this.SelectType = "Contact"
          this.selectedContactType = "Individual";
        }
      })
    }
  }


  getApplicantandOthersData() {
    debugger
    this.lstApplicantandOthersData = [];

    let data = this.ApplicantData;
    //console.log("Dataaaaaaa", data)
    this.lstApplicantandOthersData.push(data)

    // let lstApplicantsandothers = this.FiApplicantsandothers.lstOtherApplicants;
    // if (lstApplicantsandothers && lstApplicantsandothers.length > 0)
    //   this.lstApplicantandOthersData.push(...lstApplicantsandothers);
    for (let i = 0; i < this.lstApplicantandOthersData.length; i++) {
      let obj = {
        status: false
      }
      this.lstApplicantandOthersData[i] = Object.assign(obj, this.lstApplicantandOthersData[i])
    }

    this.FiKycandidentification.lstApplicantsandothers = this.lstApplicantandOthersData;
    let forFifthTabUsersData = JSON.parse(JSON.stringify(this.lstApplicantandOthersData));
    if (forFifthTabUsersData && forFifthTabUsersData.length > 0) {
      for (let y = 0; y < forFifthTabUsersData.length; y++) {
        forFifthTabUsersData[y].status = false;
      }
    }
    this.FiPersonaldetails.lstApplicantsandothers = forFifthTabUsersData
    // let forSecurityColletralArray = JSON.parse(JSON.stringify(this.lstApplicantandOthersData));
    // for (let index = 0; index < forSecurityColletralArray.length; index++) {
    //   let obj = {
    //     status: false
    //   }
    //   forSecurityColletralArray[index] = Object.assign(obj,forSecurityColletralArray[index])
    // }
    //console.log("forSecurityColletralArray :::::::: ",forSecurityColletralArray);

    // this.FiSecurityandcollateral.lstApplicantsandothers = forSecurityColletralArray;
    // this.fiReferences.lstApplicantandOthersData = this.lstApplicantandOthersData;

    // this.fiLoanSpecific.lstApplicantandOthersData = this.lstApplicantandOthersData;
    // if(this.fiLoanSpecific.loanagainstPropertyFormdata) {
    //  this.fiLoanSpecific.loanagainstPropertyFormdata.movablepropertydetailsParent.lstApplicantsandothers = this.lstApplicantandOthersData;
    //  this.fiLoanSpecific.loanagainstPropertyFormdata.propertydetailsParent.lstApplicantsandothers = this.lstApplicantandOthersData;
    // }
  }

  forGettingKYCAndCreditScoreData(event) {
    debugger
    if (event) {
      //this.dropdoenTabname = "KYC Documents";
      if (this.routeVchApplicationId) {
        this.FiKycandidentification.forCreate = false;
      }
      else {
        this.FiKycandidentification.forCreate = true;
      }
      this.FiKycandidentification.getKYCAndCreditScoreDataForEditing();
    }
  }
  ChangeMemberType(args) {
    debugger;
    if (args) {
      let memberid = args.pmembertypeid;
      this.FIMemberContactForm.controls.pMembertypeId.setValue(memberid)
      let type = args.pmembertype;
      this.FIMemberContactForm.controls.pMemberType.setValue(type)
    }
    else {
      this.FIMemberContactForm.controls.pMembertypeId.setValue('');
      this.FIMemberContactForm.controls.pMemberType.setValue('');
    }

  }
  ChangeContactType(type) {
    debugger
    if (type == "Individual") {
      this.SelectType = "Contact"
      this.selectedContactType = type
      this.FIMemberContactForm.controls.pContacttype.setValue(type)
      this.refreshContactSelectComponent()
      this.BindContactDetails(type)
      this.ShowImageCard = false
      if (this.FIMemberContactForm.value.pContactName) {
        this.FIMemberContactForm.patchValue({
          pContactName: ''
        })
      }
      this.forIndividualApplicantName = false;
    }
    else if (type == "Business Entity") {
      this.SelectType = "Business Entity"
      this.selectedContactType = type
      this.FIMemberContactForm.controls.pContacttype.setValue(type)
      // this.refreshContactSelectComponent()
      this.BindContactDetails(type)
      this.ShowImageCard = false
      if (this.FIMemberContactForm.value.pContactName) {
        this.FIMemberContactForm.patchValue({
          pContactName: ''
        })
      }
      this.forBusinessApplicantName = false;
    }
  }

  GetContactPersonData(event) {

    // this._commonService.GetContactDetailsforKYC(event.pContactId).subscribe(data => {
    //   this._commonService._SetKYCUpdate(data);
    // })
    // this._commonService._SetContactData(event);

  }

  GetApplicantTypes(type) {
    if (type != undefined && type != '') {
      this._loanmasterservice.GetApplicanttypes(type, 0).subscribe(json => {
        if (json) {
          this.ApplicantTypesList = json
        }
      })
    }
  }


  BindContactDetails(contacttype) {
    debugger
    this._commonService.GetContactDetails(contacttype).subscribe(contacts => {
      if (contacts) {
        this.ContactDetailsList = contacts
      }
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
          dataSource: this.ContactDetailsList,
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
          dataSource: this.ContactDetailsList,
          select: this.SelectContactDataForBusiness,
          change: this.CancelClick
        });
      }
    });
  }

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

  SelectContactDataForIndividual(e) {
    debugger
    if (e.dataItem) {
      var dataItem = e.dataItem;
      window['CallingFunctionOutsideContactDataForIndividual'].componentFn(dataItem)

    }
  }

  SelectContactDataForBusiness(e) {
    debugger
    if (e.dataItem) {
      var dataItem = e.dataItem;
      window['CallingFunctionOutsideContactDataForBusiness'].componentFn(dataItem)

    }
  }

  CancelClick() {
    window['CallingFunctionToHideCard'].componentFn()
  }
  HideCard() {
    debugger;
    this.ShowImageCard = false
    if (this.FIMemberContactForm.controls['pContactName'].value) {
      this.FIMemberContactForm.controls['pContactName'].setValue('');
      this.FiMemberContactFormErrors.pContactName = '';
    }
  }

  PersonDetails(data, conferenceId) {
    debugger
    this.pContactId = data.pContactId
    //data.pReferenceId
    this._MemberService.CheckContactDuplicate1(data.pContactId).subscribe(result => {
      debugger
      this.FimemCount = result


      if (this.FimemCount == 0) {

        this._commonService.GetContactDetailsbyId(this.pContactId).subscribe(details => {
          this.DisplayCardData = details;
          console.log("image", this.DisplayCardData)
          if (this.DisplayCardData.pContactimagepath == "") {

            this.croppedImage = this._defaultimage.GetdefaultImage()
          }
          else {
            this._commonService.ConvertImagepathtobase64(this.DisplayCardData.pContactimagepath).subscribe(imagepath => {
              this.croppedImage = "data:image/png;base64," + imagepath;
            })
          }

          this.ShowImageCard = true

          this.pApplicantid = this.DisplayCardData.pContactId
          this.pApplicantname = this.DisplayCardData.pContactName
          this.pContactreferenceid = this.DisplayCardData.pReferenceId
          this.pBusinessEntitycontactNo = this.DisplayCardData.pBusinessEntitycontactNo

          this.ApplicantData = { pcontactid: this.DisplayCardData.pContactId, papplicantname: this.DisplayCardData.pContactName, pcontactreferenceid: this.DisplayCardData.pReferenceId, pcontacttype: this.FIMemberContactForm.controls.pContacttype.value, papplicanttype: 'Member', papplicantconfigstatus: 'YES', pBusinessEntitycontactNo: this.DisplayCardData.pBusinessEntitycontactNo };

          this.FIMemberContactForm.controls.pContactId.setValue(this.DisplayCardData.pContactId)
          this.FIMemberContactForm.controls.pContactName.setValue(this.DisplayCardData.pContactName)
          this.FIMemberContactForm.controls.pContactReferenceId.setValue(this.DisplayCardData.pReferenceId)
          // this.FIMemberContactForm.controls.pBusinessEntitycontactNo.setValue(this.DisplayCardData.pBusinessEntitycontactNo);
          if (conferenceId) {
            this.FIMemberContactForm.controls.ptypeofoperation.setValue('UPDATE');
            var multicolumncombobox: any;
            if (this.SelectType == 'Contact') {
              multicolumncombobox = $("#contactsData").data("kendoMultiColumnComboBox");
            }
            else {
              multicolumncombobox = $("#businessContactsData").data("kendoMultiColumnComboBox");
            }
            if (multicolumncombobox)
              multicolumncombobox.value(this.DisplayCardData.pContactId)
          }
          else {
            this.FIMemberContactForm.controls.ptypeofoperation.setValue('CREATE')
          }
          if (this.SelectType == 'Contact') {
            if (this.FIMemberContactForm.value.pContactName == '' ||
              this.FIMemberContactForm.value.pContactName == null ||
              this.FIMemberContactForm.value.pContactName == undefined) {
              this.forIndividualApplicantName = true;
            }
            else {
              this.forIndividualApplicantName = false;
            }
          }
          else if (this.SelectType == "Business Entity") {
            if (this.FIMemberContactForm.value.pContactName == '' ||
              this.FIMemberContactForm.value.pContactName == null ||
              this.FIMemberContactForm.value.pContactName == undefined) {
              this.forBusinessApplicantName = true;
            }
            else {
              this.forBusinessApplicantName = false;
            }
          }
          this._FIIndividualService.getApplicantandOthersData.emit()
        })

      }
      else if (this.FimemCount > 0) {
        var multicolumncombobox: any;
        if (this.SelectType == 'Contact') {
          multicolumncombobox = $("#contactsData").data("kendoMultiColumnComboBox");
        }
        else {
          multicolumncombobox = $("#businessContactsData").data("kendoMultiColumnComboBox");
        }
        if (multicolumncombobox) {
          multicolumncombobox.value("")
          this.toaster.info("Member Already Exists")
        }


      }

    })




  }


  //Getting For Personal Details
  forGettingApplicantAndOthersDataEmit(event) {
    if (event) {
      // this.dropdoenTabname = this.FiKycandidentification.dropdoenTabname;
      // this.FiApplicantsandothers.getCoapplicantsAndGuarrantersData();
    }
  }
  //

  //Getting For References Data
  getFiReferencesGetDataEmit(event) {
    debugger
    if (event) {
      //this.dropdoenTabname = "References";
      this.fiReferences.getApplicationReferenceData();
    }
  }
  //

  //Getting For Personaldetails Data
  forPersonalDetailsGetAndEditEmitEvent(event) {
    debugger
    if (event) {
      //this.dropdoenTabname = "Personal Details";
      if (this.routeVchApplicationId) {
        if (this.FiPersonaldetails && this.FiPersonaldetails.employmentDetails) {
          this.FiPersonaldetails.employmentDetails.forUpdate = true;
        }
      }
      else {
        if (this.FiPersonaldetails && this.FiPersonaldetails.employmentDetails) {
          this.FiPersonaldetails.employmentDetails.forUpdate = false;
        }
      }
      this.FiPersonaldetails.getPersonalDetailsDataForEditingAndGetting();
    }
  }
  //

  forGettingPersonalDetailsDataEmit(event) {
    if (event) {
      // this.dropdoenTabname = this.FiSecurityandcollateral.dropdoenTabname;
      this.FiPersonaldetails.getPersonalDetailsDataForEditingAndGetting();
    }
  }

  ReferalNotApplicable(event) {
    debugger
    let checked = event.target.checked;
    if (checked == true) {
      this.ReferealNotApplicableForLoan = true;
      this.ReferealComisionNotApplicableForLoan = true;
      this.tdsnotApplicableforloan = true;
      this.FIMemberContactForm.controls.pIsReferralApplicableorNot.setValue(!checked)
      // this.FIMemberContactForm.controls.isReferralCommisionpaidforthisLoan.setValue(!checked)
      // this.FIMemberContactForm.controls.isReferralCommisionpaidforthisLoan.setValue(!checked)
      this.ShowReferalFlag = true
      this.ShowRefComisionFlag = true
      this.ShowTdsFlag = true
      this.FIMemberContactForm.controls.pCommisionPayoutType.setValue("")
      this.ReferalComisionNotApplicable(checked);
      this.TDSnotApplicableForLoan(checked);
    } else {

      this.ReferealNotApplicableForLoan = false;
      //this.ReferealComisionNotApplicableForLoan = true;
      this.tdsnotApplicableforloan = true;
      this.FIMemberContactForm.controls.pIsReferralApplicableorNot.setValue(!checked)
      //  this.FIMemberContactForm.controls.isReferralCommisionpaidforthisLoan.setValue(!checked)
      // this.FIMemberContactForm.controls.isReferralCommisionpaidforthisLoan.setValue(!checked)
      this.ShowReferalFlag = false
      this.ShowRefComisionFlag = true
      this.ShowTdsFlag = true
      this.FIMemberContactForm.controls.pCommisionPayoutType.setValue("Fixed")
      this.ReferalComisionNotApplicable(checked);
      this.TDSnotApplicableForLoan(checked);
    }
  }

  ReferalComisionNotApplicable(checked) {
    debugger
    //let checked = event.target.checked;
    this.FiMemberContactFormErrors.pCommisionPayoutAmountorPercentile="";
    if (checked == true) {
      this.ReferealComisionNotApplicableForLoan = true;
      this.FIMemberContactForm.controls.pCommisionPayoutType.setValue("")
      this.FIMemberContactForm.controls.pCommisionPayoutAmountorPercentile.setValue("")
      this.FIMemberContactForm.controls.pCommisionPayoutAmountorPercentile.clearValidators()
      this.FIMemberContactForm.controls.pCommisionPayoutAmountorPercentile.updateValueAndValidity()
      this.FIMemberContactForm.controls.isReferralCommisionpaidforthisLoan.setValue(!checked)
      this.ShowRefComisionFlag = true
    }
    else {
      this.ReferealComisionNotApplicableForLoan = false;
      this.FIMemberContactForm.controls.isReferralCommisionpaidforthisLoan.setValue(!checked)
      this.ShowRefComisionFlag = false;
      this.PreviousFixedAmount ? this.FIMemberContactForm.controls.pCommisionPayoutAmountorPercentile.setValue(this.PreviousFixedAmount) : this.FIMemberContactForm.controls.pCommisionPayoutAmountorPercentile.setValue("")

      // if (this.PreviousFixedAmount != "") {
      //   this.FIMemberContactForm.controls.pCommisionPayoutAmountorPercentile.setValue(this.PreviousFixedAmount)
      // } else {
      //   this.FIMemberContactForm.controls.pCommisionPayoutAmountorPercentile.setValue("")
      // }

      this.FIMemberContactForm.controls.pCommisionPayoutAmountorPercentile.setValidators([Validators.required])
      this.FIMemberContactForm.controls.pCommisionPayoutAmountorPercentile.updateValueAndValidity()
      this.FIMemberContactForm.controls.pCommisionPayoutType.setValue("Fixed")
      this.BlurEventAllControll(this.FIMemberContactForm);

    }
  }

  TDSnotApplicableForLoan(checked) {
    debugger
    //let checked = event.target.checked;
    if (checked == true) {
      this.tdsnotApplicableforloan = true;
      this.FIMemberContactForm.controls.pTdsSection.clearValidators();
      this.FIMemberContactForm.controls.pTdsSection.updateValueAndValidity()
      this.FIMemberContactForm.controls.pIsTdsapplicable.setValue(!checked)
      this.ShowTdsFlag = true
    } else {
      this.tdsnotApplicableforloan = false;
      this.FIMemberContactForm.controls.pIsTdsapplicable.setValue(!checked)
      this.ShowTdsFlag = false

      this.PreviousTdsType ? this.FIMemberContactForm.controls.pTdsSection.setValue(this.PreviousTdsType) : this.FIMemberContactForm.controls.pTdsSection.setValue("")
      // if (this.PreviousTdsType != "") {
      //   this.FIMemberContactForm.controls.pTdsSection.setValue(this.PreviousTdsType)
      // } else {
      //   this.FIMemberContactForm.controls.pTdsSection.setValue("")
      // }
      this.FIMemberContactForm.controls.pTdsSection.setValidators([Validators.required])
      this.FIMemberContactForm.controls.pTdsSection.updateValueAndValidity()
      this.BlurEventAllControll(this.FIMemberContactForm);
    }
  }

  ClearButtonClick() {
    this.FIMemberContactForm.reset();
    this.CancelClick();
    this.FiMemberContactFormErrors = {}
    this.FIMemberContactForm.controls.pFIMemberDate.setValue(new Date())
    this.FIMemberContactForm.controls.pContactName.setValue("")
  }

  moveToPreviousTab() {
debugger;
    let str = 'references'
    // this.dropdoenTabname = "References";
    $('.nav-item a[href="#' + str + '"]').tab('show');
    // this.forGettingReferencesDataEmit.emit(true);
    this.fiReferences.getApplicationReferenceData();
  }

  SaveButtonClick() {
    debugger
    if (this.checkValidations(this.FIMemberContactForm, this.isValid)) {
      if (this.IsReferalDataEmptyOrNull == true) {
        if (this.ButtonType != "New" && this.ButtonType != undefined) {
          this.FIMemberContactForm.controls.ptypeofoperation.setValue("UPDATE")
        }
      }
      else {
        this.FIMemberContactForm.controls.ptypeofoperation.setValue("CREATE")
      }
      let amount = this.FIMemberContactForm.controls.pCommisionPayoutAmountorPercentile.value
      amount = this._commonService.functiontoRemoveCommas(amount)
      this.FIMemberContactForm.controls.pCommisionPayoutAmountorPercentile.setValue(amount)
      console.log("member data", this.FIMemberContactForm.value)
      let data = JSON.stringify(this.FIMemberContactForm.value)
      console.log("Tab5-data", data)
      this._MemberService.SaveFIMemberReferalDetails(data).subscribe(res => {
        debugger
        let a = res
        this._commonService.showInfoMessage("Saved Successfully")
        this._MemberService.SetButtonType(undefined)
        this.router.navigate(['/MemberView'])
      })
    }

  }

  NextTabClick() {
    debugger

    this.isValid = true;

    if (this.checkValidations(this.FIMemberContactForm, this.isValid)) {

      if (this.ButtonType != "New" && this.ButtonType != undefined) {
        this.FIMemberContactForm.controls.ptypeofoperation.setValue("UPDATE")
      }
      let data = JSON.stringify(this.FIMemberContactForm.value)
      console.log("FiMem tab1-data-->", data)
      this.FIMemberTab1Data.push(this.FIMemberContactForm.value)
      this._commonService._SetFiTab1Data(data);
      this._MemberService.SaveFIMemberMasterDetails(data).subscribe(res => {
        debugger
        this.FIMemberTab1Data[0].fromForm = "FiMemberDetailsForm"
        this.FIMemberTab1Data[0].pMemberId = res["pMemberId"]
        this.dob = res['pDob'];
        ///gdfhghgf
        this._MemberService.SetDob(this.dob)

        this.FIMemberTab1Data[0].pMemberReferenceId = res["pMemberReferenceId"]

        this.FIMemberContactForm.controls.ptypeofoperation.setValue("UPDATE");
        this.FIMemberContactForm.controls.pMemberId.setValue(res["pMemberId"])
        this.FIMemberContactForm.controls.pMemberReferenceId.setValue(res["pMemberReferenceId"])
        this.FIMemberContactForm.controls.pMemberReferenceid.setValue(res["pMemberReferenceId"])

        this._MemberService._SetFiMemberTab1Data(this.FIMemberTab1Data)
        this.FiKycandidentification.getKYCAndCreditScoreDataForEditing();

        let str = "kyc-Documents"
        $('.nav-item a[href="#' + str + '"]').tab('show');

      })

    } else {
      if (this.FIMemberContactForm.controls.pApplicanttype.value == '') {
        this.FiMemberContactFormErrors.pApplicanttype = 'Applicant type required';
      } else {
        this.FiMemberContactFormErrors.pApplicanttype = '';
        if (this.SelectType == "Business Entity") {
          this.FIMemberContactForm.controls.pContacttype.setValue('Business Entity');
        }
        if (this.SelectType == "Contact") {
          this.FIMemberContactForm.controls.pContacttype.setValue('Individual');
        }
      }
      if (this.SelectType == 'Contact') {
        if (this.FIMemberContactForm.value.pContactName == '' ||
          this.FIMemberContactForm.value.pContactName == null ||
          this.FIMemberContactForm.value.pContactName == undefined) {
          this.forIndividualApplicantName = true;
        }
        else {
          this.forIndividualApplicantName = false;
        }
      }
      else if (this.SelectType == "Business Entity") {
        if (this.FIMemberContactForm.value.pContactName == '' ||
          this.FIMemberContactForm.value.pContactName == null ||
          this.FIMemberContactForm.value.pContactName == undefined) {
          this.forBusinessApplicantName = true;
        }
        else {
          this.forBusinessApplicantName = false;
        }
      }
      //this.buttonName="Next";
      // this.isLoading=false;
    }

    //this.dropdoenTabname = "Loan Details";

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
          this.FiMemberContactFormErrors[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.FiMemberContactFormErrors[key] += errormessage + ' ';
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



  MaskInput(event) {
    debugger

    //(input)="MaskInput($event)"
    //appMycurrencyFormatter

    let data = event.target.value
    if (this.TestData == undefined) {
      this.TestData = data
      this.Originaldata = data
    } else {
      this.TestData = this.TestData + data.substr(data.length - 1);
      this.Originaldata = this.Originaldata + data.substr(data.length - 1);
    }

    if (this.TestData.length <= 6) {
      this.TestData = data.replace(/\d(\d)/, "X$1");
      this.FIMemberContactForm.controls.pCommisionPayoutAmountorPercentile.setValue(this.TestData)
    } else {
      // this.TestData = this.TestData + data
      this.FIMemberContactForm.controls.pCommisionPayoutAmountorPercentile.setValue(data)
    }

  }
  back() {
    debugger;
    this.router.navigate(['/MemberView']);
  }


}
