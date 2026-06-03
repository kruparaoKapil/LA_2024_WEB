import { Component, OnInit, Output, EventEmitter, ViewChild, Input, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { FIIndividualService } from 'src/app/Services/Loans/Transactions/fiindividual.service';
import { Router } from '@angular/router';
import { ContactSelectComponent } from 'src/app/UI/Common/contact-select/contact-select.component';
import { ToastrService } from 'ngx-toastr';

declare let $: any
@Component({
  selector: 'app-fi-applicantsandothers',
  templateUrl: './fi-applicantsandothers.component.html',
  styles: []
})
export class FiApplicantsandothersComponent implements OnInit {

  @ViewChild(ContactSelectComponent, { static: false }) ContacttypeComp: ContactSelectComponent;

  @Output() forGettingKYCAndCreditScoreData = new EventEmitter();
  @Output() forGettingLoanDetailsDataEmit = new EventEmitter();

  @Input() SelectType: any;
  @Input() forClearButton: boolean;
  _FirstInformationTabsData: any = [];
  @Input()
  set FirstInformationTabsData(FirstInformationTabsData: any) {
    this._FirstInformationTabsData = FirstInformationTabsData;
  }
  applicantAndOtherForm: FormGroup;

  selectedContactForDelete: any;
  selectedContactRemoveContactIndex: any;
  contactType: any;
  validation: any;
  selectedContact: any;
  lstOtherApplicants: any;
  chargesConfigErrorMessage: any;
  data: any;
  pVchapplicationid: any;
  pApplicantid: any;
  CheckDplicateContactData: any
  dropdoenTabname: any;
  pContactTypeForSelectContact: any;
  ApplicantData: any;

  checkApplicantExist: boolean = false;
  submitted = false;
  notApplicableCoApplicantsFlag: boolean = true;
  loading: boolean = false;
  public isLoading: boolean = false;

  typeOfUsersArray = [];
  ApplicantList = [];
  applicantNameList = [];
  itemList = [];
  selectedItems = [];
  applicants = [];
  userData = [];

  settings = {};

  TabName: string;
  buttonName = "Save & Continue";

  constructor(private formBuilder: FormBuilder,
    private route: Router,
    private _commonService: CommonService,
    private toastr: ToastrService,
    private FIServices: FIIndividualService, private router: Router) { }
  ngOnChanges(): void {
    debugger
    this.dropdoenTabname = this._commonService.GetFiTabName();
    const example = this._FirstInformationTabsData.filter(data => data.pTabsectionname === this.dropdoenTabname);
  }

  getApplicantDetail() {
    // return this.FIServices.applicantName;
  }

  ngOnInit() {
    debugger
    //get pVchapplicationid from previous tab
    this._commonService._GetFiTab1Data().subscribe(res => {
      if (res != null && res != undefined && res != "") {
        //console.log("res in 3rd  : ",res);
        this.pApplicantid = res.pApplicantid;
        this.pVchapplicationid = (res.pVchapplicationid);
        this.pContactTypeForSelectContact = res.pContacttype;
        this.getCoapplicantsAndGuarrantersData();
      }
    })

    this.CheckDplicateContactData = []
    this.TabName = "FiOtherDetails"
    this.lstOtherApplicants = [];
    this.data = this.userData
    this.chargesConfigErrorMessage = {};
    this.applicantAndOtherForm = this.formBuilder.group({
      createdby: 0,
      modifiedby: 0,
      pRecordid: 0,
      pContactreferenceid: "",
      pContactid: "",
      pSurityapplicanttype: ['', Validators.required],
      pContactname: "",
      pCreatedby: this._commonService.pCreatedby,
      pModifiedby: 0,
      pStatusid: "",
      pStatusname: "ACTIVE",
      pEffectfromdate: "",
      pEffecttodate: "",
      ptypeofoperation: "CREATE"

    })
    this.BlurEventAllControll(this.applicantAndOtherForm);
    this.getCoapplicantsAndGuarrantersData();
  }

  onItemSelect(item: any) {
    let defid = this.selectedItems.findIndex(i => i.id == -1);
    if (defid >= 0) {
      this.selectedItems.splice(defid, 1);
    }
  }
  OnItemDeSelect(item: any) {
  }
  onSelectAll(items: any) {
  }
  onDeSelectAll(items: any) {
  }
  checkValidations(group: FormGroup, isValid: boolean): boolean {

    try {

      Object.keys(group.controls).forEach((key: string) => {

        isValid = this.GetValidationByControl(group, key, isValid);
      })

    }
    catch (e) {

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
          this.chargesConfigErrorMessage[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;

            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.chargesConfigErrorMessage[key] += errormessage + ' ';
                isValid = false;
              }
            }

          }
        }
      }
    }
    catch (e) {

      return false;
    }
    return isValid;
  }
  BlurEventAllControll(fromgroup: FormGroup) {

    try {

      Object.keys(fromgroup.controls).forEach((key: string) => {
        this.setBlurEvent(fromgroup, key);
      })

    }
    catch (e) {

      return false;
    }
  }
  showWarningMessage(message) {
    this.toastr.warning(message, 'Warning!');
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
      return false;
    }
  }

  getListData(): any {
    return this.lstOtherApplicants;
  }

  /**----(Start)--- If user will click on Yes button in delete modal pop-up. 
   *                 This method will execute.
   */
  delete(i) {
    debugger
    let data = {
      strapplictionid: this.pVchapplicationid,
      strconrefid: this.lstOtherApplicants[i].pcontactreferenceid,
      Createdby: this._commonService.pCreatedby
    }

    this.FIServices.deleteApplicantAndOthers(data).subscribe((response: any) => {
      this._commonService.showInfoMessage("Contact - " + this.selectedContactForDelete + " removed successfully")
    });

    for (let j = 0; j < this.typeOfUsersArray.length; j++) {
      if (this.typeOfUsersArray[j].pContactreferenceid == this.lstOtherApplicants[i].pcontactreferenceid) {
        this.typeOfUsersArray.splice(j, 1);
      }
    }

    this.lstOtherApplicants.splice(i, 1);
    this.FIServices.getApplicantandOthersData.emit();
  }
  /**------(End)------- for delete contact----------(End)------------------------ */

  //Not Applicable
  notApplicableCoApplicants(event) {
    let checked = event.target.checked;
    if (checked == true) {
      this.notApplicableCoApplicantsFlag = true;
      // this.lstOtherApplicants = [];
      this.FIServices.getApplicantandOthersData.emit()
    } else {
      this.notApplicableCoApplicantsFlag = false;
      this.getSurityapplicants();
    }
    this.selectedContact = null;
  }

  /**-------(Start)----- For saving 3rd tab data--------(Start)-------------- */
  nextTabClick() {
    debugger
    let saveBoolean: boolean = false;
    this.submitted = true;
    let data = {
      pvchapplicationid: this.pVchapplicationid,
      pissurietypersonsapplicable: !this.notApplicableCoApplicantsFlag,
      lstsurityapplicantsDTO: this.typeOfUsersArray
    }
    this.buttonName = "Processing";
    this.isLoading = true;
    let a = JSON.stringify(data);
    this.FIServices.saveApplicantsAndOthers(data).subscribe(response => {
      if (response == true) {
        this.buttonName = "Save & Continue";
        this.isLoading = false;

        let str;
        let temptabname;
        this.dropdoenTabname = this._commonService.GetFiTabName();
        let tempFirstInformationTabsData = this._FirstInformationTabsData;
        let data = this.FIServices.moevToNextTab(tempFirstInformationTabsData, this.dropdoenTabname);
        str = data.tabId;
        temptabname = data.tabName;
        if (str == '' && temptabname == '') {
          this.buttonName = "Submit";
          this.isLoading = false;
          this._commonService.showInfoMessage('Saved successfully');
          this.router.navigateByUrl('/FiView');
          return
        }
        this._commonService.SetFiTabName(temptabname);
        // let str = "applicants-others"
        // this.dropdoenTabname = "Applicants and Others";
        this.dropdoenTabname = temptabname;
        $('.nav-item a[href="#' + str + '"]').tab('show').addClass('active show');


        // let str = "kyc-Documents"
        // this.dropdoenTabname = "KYC Documents";
        // $('.nav-item a[href="#' + str + '"]').tab('show');
        /**--------(Start)----- For 4th tab get API afer saving 3rd tab data-------(Start)------ 
         * --------> This event Emitter is using in Fi-master component.
        */
        this.forGettingKYCAndCreditScoreData.emit(true);
        /**--------(End)----- For 4th tab get API afer saving 3rd tab data-------(End)------ */
      }
      else {
        this.buttonName = "Save & Continue";
        this.isLoading = false;
        // this._commonService.showErrorMessage("Something went wrong from serverside, Please try after sometime!  ")
      }
    }, (error) => {
      this.buttonName = "Save & Continue";
      this.isLoading = false;
    })
  }
  /**-------(End)----- For saving 3rd tab data--------(End)-------------- */

  /**------(Start)--- Selcted user data coming form <app-contact-select>-----------(Start)------ */
  GetContactPersonDataInFiOther(data) {
    this.selectedContact = data;
  }
  /**------(End)--- Selcted user data coming form <app-contact-select>-----------(End)------ */

  /**-----------(Start)------- For adding selected grid data to grid-----------(Start)---------- */
  addDataToTable() {
    debugger
    if (this.applicantAndOtherForm.value.pSurityapplicanttype) {
      if (this.selectedContact) {
        if (this.pApplicantid == this.selectedContact.pContactId) {
          this.checkApplicantExist = false;
          this._commonService.showWarningMessage("This User already existed");
        }
        else {
          this.checkApplicantExist = true;
          this.selectedContact["papplicanttype"] = this.applicantAndOtherForm.controls.pSurityapplicanttype.value
          this.ApplicantData = {
            pcontactid: this.selectedContact.pContactId,
            papplicantname: this.selectedContact.pContactName,
            pcontactreferenceid: this.selectedContact.pReferenceId,
            pcontacttype: this.selectedContact.pContacttype,
            papplicanttype: this.applicantAndOtherForm.controls.pSurityapplicanttype.value,
            papplicantconfigstatus: 'NO',
            pBusinessEntitycontactNo: this.selectedContact.pBusinessEntitycontactNo
          };
        }
      }
      else {
        this._commonService.showWarningMessage("Please select any contact");
        return;
      }
    }
    else {
      if (this.selectedContact == null || this.selectedContact == undefined || this.selectedContact == '') {
        this._commonService.showWarningMessage("Please select contact type and any contact");
        return;
      }
      else {
        this._commonService.showWarningMessage("Please select contact type");
        return;
      }
    }

    let isvalid = true;
    let addFlag: boolean = true;
    if (this.checkApplicantExist == true) {
      if (this.lstOtherApplicants && this.lstOtherApplicants.length > 0) {
        for (let i = 0; i < this.lstOtherApplicants.length; i++) {
          if (this.ApplicantData.pcontactid == this.lstOtherApplicants[i].pcontactid) {
            addFlag = false;
            break;
          }
          else {
            addFlag = true;
          }
        }
      }
      else {
        this.lstOtherApplicants = [];
        addFlag = true;
      }
      if (addFlag) {
        if (this.ApplicantData) {
          if (this.applicantAndOtherForm.value.pSurityapplicanttype) {
            if (this.selectedContact) {
              this.applicantAndOtherForm.controls.pContactname.setValue(this.ApplicantData.papplicantname);
              this.applicantAndOtherForm.controls.pContactid.setValue(this.ApplicantData.pcontactid);
              this.applicantAndOtherForm.controls.pContactreferenceid.setValue(this.ApplicantData.pcontactreferenceid);

              let dataExist = JSON.stringify(this.CheckDplicateContactData).includes(JSON.stringify(this.ApplicantData));

              this.lstOtherApplicants.push(this.ApplicantData);
              this.CheckDplicateContactData.push(this.ApplicantData)
              this.FIServices.getApplicantandOthersData.emit();
              this.ContacttypeComp.refreshContactSelectComponent();
              this.ContacttypeComp.ShowImageCard = false;
              this.typeOfUsersArray.push(this.applicantAndOtherForm.value);
              this.selectedContact = null;

              this.applicantAndOtherForm = this.formBuilder.group({
                createdby: 0,
                modifiedby: 0,
                pRecordid: 0,
                pContactreferenceid: "",
                pContactid: "",
                pSurityapplicanttype: ['', Validators.required],
                pContactname: "",
                pCreatedby: this._commonService.pCreatedby,
                pModifiedby: 0,
                pStatusid: "",
                pStatusname: "ACTIVE",
                pEffectfromdate: "",
                pEffecttodate: "",
                ptypeofoperation: "CREATE"

              })
              this.BlurEventAllControll(this.applicantAndOtherForm);
              this.BlurEventAllControll(this.ContacttypeComp.ContactSelectForm);
            }
            else {
              this._commonService.showWarningMessage("Please select any contact");
            }
          }
          else {
            this._commonService.showWarningMessage("Please select contact type");
          }
        }
      }
      else {
        if (this.selectedContact)
          this._commonService.showWarningMessage("This User already existed");
      }
    }
  }
  /**-----------(End)------- For adding selected grid data to grid-----------(End)---------- */

  /**------------(Start)------ Cahnge event for selecting contact----------- (Start)---------- */
  onChange(event) {
    this.contactType = event.target.value;
    this.applicantAndOtherForm.controls.pSurityapplicanttype.setValue(event.target.value)
  }
  /**------------(End)------ Cahnge event for selecting contact----------- (End)---------- */

  //-------------------------------------------------------------------------------------------------->
  /**-----------(Start)------ For Contact users data------------ (Start)---------------- */
  getCoapplicantsAndGuarrantersData() {
    debugger
    this.lstOtherApplicants = [];
    this.loading = true;
    this.FIServices.getFiCoapplicantsAndGuarrantersData(this.pVchapplicationid).subscribe((response: any) => {
      if (response) {
        this.loading = false;
        this.notApplicableCoApplicantsFlag = !(response.pissurietypersonsapplicable);
        let tempArr = response.lstsurityapplicantsDTO;
        if (tempArr && tempArr.length > 0) {
          let localArr = [];
          for (let i = 0; i < tempArr.length; i++) {
            let obj = {
              papplicantname: tempArr[i].pContactname,
              papplicanttype: tempArr[i].pSurityapplicanttype,
              pcontactid: tempArr[i].pContactid,
              psuritycontactno: tempArr[i].psuritycontactno,
              pcontactreferenceid: tempArr[i].pContactreferenceid,
              papplicantconfigstatus: 'NO',
              pcontacttype: tempArr[i].pContacttype,
            }
            localArr.push(obj);
          }
          this.lstOtherApplicants = [...localArr];
          this.typeOfUsersArray = response.lstsurityapplicantsDTO;
        }
        this.FIServices.getApplicantandOthersData.emit()
      }
      else {
        this.loading = false;
        // this._commonService.showErrorMessage("Something went wrong from server side, please try after sometime");
      }
    }, (error) => {
      this.loading = false;
    })
  }
  /**-----------(End)------ For Contact users data------------ (End)---------------- */
  //-------------------------------------------------------------------------------------------------->

  /**------ (Start)----- For Contact types drop down data-----------------(Start)----------- */
  getSurityapplicants() {
    try {
      this.FIServices.getSurityapplicants(this.pContactTypeForSelectContact).subscribe(response => {
        this.loading = false;
        if (response) {
          this.applicants = response;
        }
      });
    } catch (error) {
      this.showWarningMessage(error);
    }
  }
  /**------ (End)----- For Contact types drop down data-----------------(End)----------- */

  /**----------(Start)------ To move 2nd tab --------(Start)-------- */
  moveToPreviousTab() {

    let str;
    let temptabname;
    this.dropdoenTabname = this._commonService.GetFiTabName();
    let tempFirstInformationTabsData = this._FirstInformationTabsData;
    for (let i = 0; i < tempFirstInformationTabsData.length; i++) {
      let pTabsectionname = tempFirstInformationTabsData[i].pTabsectionname;
      if (pTabsectionname == this.dropdoenTabname) {
        str = tempFirstInformationTabsData[i - 1].pTabsectionid;
        temptabname = tempFirstInformationTabsData[i - 1].pTabsectionname;
        this._commonService.SetFiTabName(temptabname);
      }
    }
    this.dropdoenTabname = temptabname;
    $('.nav-item a[href="#' + str + '"]').tab('show').addClass('active show');


    // let str = 'loan-details';
    // this.dropdoenTabname = this._commonService.GetFiTabName();
    // $('.nav-item a[href="#' + str + '"]').tab('show');
    let data = {
      event: true,
      pVchapplicationid: this.pVchapplicationid
    }
    this.forGettingLoanDetailsDataEmit.emit(data);
  }
  /**----------(End)------ To move 2nd tab --------(End)-------- */

  /**--------(Start)------ If user click on Yes button in delete modal pop-up--------(Start)------ */
  removeContact() {
    this.delete(this.selectedContactRemoveContactIndex);
  }
  /**--------(End)------ If user click on Yes button in delete modal pop-up--------(End)------ */

  /**--------(Start)----- For modal pop-up when user click on the delete button -----------(Start)-----
   * --------> In this modal pop-up we will have Yes and No buttons.
   */
  confirmForDelete(index) {
    this.selectedContactForDelete = this.lstOtherApplicants[index].papplicantname;
    this.selectedContactRemoveContactIndex = index;
    if (confirm("Do you want to delete contact - " + this.selectedContactForDelete)) {
      this.delete(this.selectedContactRemoveContactIndex);
    }
    // $('#contactModal').modal({
    //   backdrop: 'static',
    //   keyboard: false});
  }
  /**--------(End)----- For modal pop-up when user click on the delete button -----------(End)----- */

  clearForm() {
    this.chargesConfigErrorMessage = {};
    this.applicantAndOtherForm = this.formBuilder.group({
      createdby: 0,
      modifiedby: 0,
      pRecordid: 0,
      pContactreferenceid: "",
      pContactid: "",
      pSurityapplicanttype: ['', Validators.required],
      pContactname: "",
      pCreatedby: this._commonService.pCreatedby,
      pModifiedby: 0,
      pStatusid: "",
      pStatusname: "ACTIVE",
      pEffectfromdate: "",
      pEffecttodate: "",
      ptypeofoperation: "CREATE"

    })
    this.BlurEventAllControll(this.applicantAndOtherForm);
    this.ContacttypeComp.ShowImageCard = false;
    this.selectedContact = null;
    this.ContacttypeComp.refreshContactSelectComponent();
  }

}
