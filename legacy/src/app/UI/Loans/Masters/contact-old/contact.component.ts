import { Component, OnInit, ViewChild } from '@angular/core';
import { ContactIndividualComponent } from './contact-individual.component';
import { ContactBusinessComponent } from './contact-business.component'
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { ContacmasterService } from '../../../../Services/Loans/Masters/contacmaster.service'
import { CommonService } from '../../../../Services/common.service';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
})
export class ContactComponent implements OnInit {

  contactForm: FormGroup;
  
  referenceid: string;
  formtype: string;
  contactType: string;
  enableRadio = false;
  editinfo = [];
  @ViewChild(ContactIndividualComponent, { static: false }) contactindividual: ContactIndividualComponent;
  @ViewChild(ContactBusinessComponent, { static: false }) contactbusiness: ContactBusinessComponent;
  constructor(private formbuilder: FormBuilder, private _contacmasterservice: ContacmasterService, private _commonService: CommonService) { }

  ngOnInit() {
    
    try {
     

  

      this.contactForm = this.formbuilder.group({
        Contacttype: [''],
      })
      
      this._contacmasterservice.loadContactForm.subscribe(json => 
        {
         
        
        this.contactindividual.showPage = true;
        this.contactbusiness.showPage = false;
        this.contactindividual.contactType = 'Individual';
        this.contactForm['controls']['Contacttype'].setValue('Individual');
       
        this.formtype = 'Save';
        this.contactType = 'Individual';
        this.enableRadio = false;
       
      })
     
      this.loadData();
     
     
    } catch (e) {
      alert(e);
    }
  }


  showErrorMessage(errormsg: string) {
    this._commonService.showErrorMessage(errormsg);
  }

  showInfoMessage(errormsg: string) {
    this._commonService.showInfoMessage(errormsg);
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

    this.editinfo = this._contacmasterservice.getEditInformation();
    this._contacmasterservice.editinfo = [];
    if (this.editinfo.length > 0) {
      this.referenceid = this.editinfo[0].referecnceid;
      this.formtype = 'Update';
      let contacttype = this.editinfo[0].contacttype;
      this.contactForm['controls']['Contacttype'].setValue(contacttype);
      this.contactType = contacttype;
      this.enableRadio = true;
    }
    else {
      this.contactForm['controls']['Contacttype'].setValue('Individual');
      this.formtype = 'Save';
      this.contactType = 'Individual';
      this.enableRadio = false;
    }
   

  }
}
