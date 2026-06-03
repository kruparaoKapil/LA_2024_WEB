import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
// import { ContactNewIndividualComponent } from '';
import { ContacmasterService } from 'src/app/Services/Loans/Masters/contacmaster.service';
import { CommonService } from 'src/app/Services/common.service';
//import { ContactNewIndividualComponent } from '../contact-new-individual.component';
//import { ContactNewBusinessComponent } from '../contact-new-business.component';
import { SelectSubscriberGlobalComponent } from '../select-subscriber-global/select-subscriber-global.component';
import { ContactNewIndividualGlobalComponent } from '../contact-new-individual-global/contact-new-individual-global.component';
import { ContactNewBusinessGlobalComponent } from '../contact-new-business-global/contact-new-business-global.component';
@Component({
  selector: 'app-contact-new-global',
  templateUrl: './contact-new-global.component.html',
  styles: []
})
export class ContactNewGlobalComponent implements OnInit {
  formName = 'Contact Master';
  controlName = 'Contact Number / Name';
  contactForm: FormGroup;
  referenceid: string;
  formtype: string;
  contactType: string;
  ID: string;
  buttonname = 'Save & Continue';
  MobileNo: string;
  enableRadio = false;
  isave = false;
  editinfo = []; ng
  disablesavebutton = false;
  savebutton = "Save Contact";
  @ViewChild(SelectSubscriberGlobalComponent, { static: false }) ContactSelectComponent: SelectSubscriberGlobalComponent;
  @ViewChild(ContactNewIndividualGlobalComponent, { static: false }) contactindividual: ContactNewIndividualGlobalComponent;
  @ViewChild(ContactNewBusinessGlobalComponent, { static: false }) contactbusiness: ContactNewBusinessGlobalComponent;
  buttonstatus: any;
  constructor(private _contacmasterservice: ContacmasterService, private formbuilder: FormBuilder, private commonservice: CommonService) { }

  ngOnInit() {
    this.buttonname = 'Save & Continue';
    this.buttonstatus = this._contacmasterservice.setstatus()
    try {
      this.contactForm = this.formbuilder.group({
        Contacttype: [''],
      })
      //this.contactType_Click('Individual');
      this._contacmasterservice.loadContactForm.subscribe(json => {

        if (json != undefined && json != null) {
          this.contactindividual.showPage = true;
          this.contactindividual.referenceid.setValue('');
          this.contactbusiness.showPage = false;
          this.contactindividual.contactType = 'Individual';
          this.contactForm['controls']['Contacttype'].setValue('Individual');
          this.formtype = 'Save';
          this.contactType = 'Individual';
          this.enableRadio = false;
        }

      })
      // this.contactForm['controls']['Contacttype'].setValue('Individual');
      // this.formtype = 'Save';
      // this.contactType = 'Individual';
      // this.enableRadio = false;
      this.loadData();

    } catch (e) {
      alert(e);
    }
  }

  saveContactDetails() {

    debugger
    if (this.contactindividual.showPage == true) {
      this.contactindividual.saveContactDetails();

    }
    if (this.contactbusiness.showPage == true) {
      this.contactbusiness.saveContactDetails();
    }
  }
  ReturnData1(event) {
    debugger;
    if (event) {
      this.referenceid = event.contactreferenceid;
      this.formtype = 'Save';
      this.buttonname = 'Save';
      let contacttype = event.contacttype;
      this.contactForm['controls']['Contacttype'].setValue(contacttype);
      this.contactType = contacttype;
      this.enableRadio = true;
      if (event.contacttype == 'Individual') {
        this.contactindividual.showPage = true;
        this.contactbusiness.showPage = false;
        this.contactindividual.contactType = event.contacttype;
        this.contactindividual.formtype = 'Save';
        this.contactindividual.referenceid = event.contactreferenceid;
        this._contacmasterservice.setContactGlobalDataOnChange(event);
        this._contacmasterservice.loadEditInformation(event.contacttype, event.contactreferenceid);
        this.contactindividual.loadEditDetails();
      }
      else {
        debugger;
        this.contactindividual.showPage = false;
        this.contactbusiness.showPage = true;
        this.contactbusiness.formtype = 'Save';
        this.contactbusiness.contactType = event.contacttype;
        this.contactbusiness.referenceid = event.contactreferenceid;
        this._contacmasterservice.loadEditInformation(event.contacttype, event.contactreferenceid);
        this._contacmasterservice.setContactGlobalDataOnChange(event);
        this.contactbusiness.loadEditDetails();
      }
    }
    else {
      this.clearContactFormDeatails();
      this.contactForm['controls']['Contacttype'].setValue('Individual');
      this.buttonname = 'Save & Continue';
      this.formtype = 'Save';
      this.contactType = 'Individual';
      this.enableRadio = false;
      this.contactType_Click('Individual');
    }
  }
  GoNextContactDetails() {

    if (this.contactindividual.showPage == true) {
      this.contactindividual.ContactMore = true;
      this.contactindividual.saveContactDetails();
    }
    if (this.contactbusiness.showPage == true) {

      this.contactbusiness.ContactMore = true;
      // this.contactbusiness.isenterprise= this.contactbusiness.checkenterprisetype();
      // this.contactbusiness.isbusineetype= this.contactbusiness.checkBusineetype();
      debugger;
      this.contactbusiness.saveContactDetails();
      // if (this.contactbusiness.isenterprise == true && this.contactbusiness.isbusineetype == true) {
      //   debugger;
      //   this.contactbusiness.saveContactDetails();
      // }
    }
  }
  clearContactFormDeatails(): void {
    this.buttonname = 'Save & Continue';
    this.contactForm['controls']['Contacttype'].setValue('Individual');
    this.formtype = 'Save';
    this.contactType = 'Individual';
    this.enableRadio = false;
    //this.ContactSelectComponent.contactSelectForm.controls.contactname.setValue("");
    this.ContactSelectComponent.clearContact();
    // this.ContactSelectComponent.formValidationMessages = {};
    if (this.contactindividual.showPage == true) {
      this.contactindividual.clearContactFormDeatails();
      // this.contactindividual.BankDetailsComponent.clearfn();
      // this.contactindividual.IdentificationDocuments.clearfn();
    }
    if (this.contactbusiness.showPage == true) {
      this.contactbusiness.clearContactFormDeatails();
      // this.contactbusiness.BankDetailsComponent.clearfn();
      // this.contactbusiness.IdentificationDocuments.clearfn();
    }
    this.contactType_Click('Individual');
  }
  showErrorMessage(errormsg: string) {
    this.commonservice.showErrorMessage(errormsg);
  }

  showInfoMessage(errormsg: string) {
    this.commonservice.showInfoMessage(errormsg);
  }
  contactType_Click(selectedtype: String): void {

    if (selectedtype == 'Individual') {
      this.contactindividual.showPage = true;
      this.contactbusiness.showPage = false;
      this.contactindividual.contactType = selectedtype;

    }
    else {
      this.contactindividual.showPage = false;
      this.contactbusiness.showPage = true;
      this.contactbusiness.contactType = selectedtype;
      this.contactbusiness.getAddressTypeDetails();
      this.contactbusiness.getTypeofEnterprise();
      this.contactbusiness.getNatureofBussiness();
      this.contactbusiness.getCountryDetails();
    }
  }

  loadData() {
    debugger
    if (this.buttonstatus != 'Save') {
      this.editinfo = this._contacmasterservice.getEditInformation();
      this._contacmasterservice.editinfo = [];
      if (this.editinfo.length > 0) {
        this.referenceid = this.editinfo[0].referecnceid;
        this.formtype = 'Save';
        this.buttonname = 'Save'
        let contacttype = this.editinfo[0].contacttype;
        this.contactForm['controls']['Contacttype'].setValue(contacttype);
        this.contactType = contacttype;
        this.enableRadio = true;
      }
      else {
        this.contactForm['controls']['Contacttype'].setValue('Individual');
        this.buttonname = 'Save & Continue';
        this.formtype = 'Save';
        this.contactType = 'Individual';
        this.enableRadio = false;
      }

    }
    else {
      this.contactForm['controls']['Contacttype'].setValue('Individual');
      this.buttonname = 'Save & Continue';
      this.formtype = 'Save';
      this.contactType = 'Individual';
      this.enableRadio = false;
    }
  }
  Refresh() {
    this.ContactSelectComponent.contactSelectForm.controls.contactname.setValue("");
    this.ContactSelectComponent.formValidationMessages = {}
  }
}

