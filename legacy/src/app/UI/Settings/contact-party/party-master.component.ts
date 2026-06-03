import { Component, OnInit, ViewChild, ViewContainerRef, ɵConsole } from '@angular/core';
import { PartMasterService } from "src/app/Services/Loans/Masters/part-master.service";
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { BankdetailsComponent } from 'src/app/UI/Common/bankdetails/bankdetails.component';
import { ContactSelectComponent } from 'src/app/UI/Common/contact-select/contact-select.component';
import { TDSDetailsComponent } from 'src/app/UI/Common/tdsdetails/tdsdetails.component';
import { KYCDocumentsComponent } from 'src/app/UI/Common/kycdocuments/kycdocuments.component';
import { FormGroup, FormControl, FormBuilder, Validators, ControlContainer } from '@angular/forms';
import { CommonService } from '../../../Services/common.service';
import { ToastrService } from 'ngx-toastr'

declare let $: any

@Component({
  selector: 'app-party-master',
  templateUrl: './party-master.component.html',
  styles: []
})
export class PartyMasterComponent implements OnInit {
  ReferalMasterForm: FormGroup

  public selectedtype: any;
  public clearselection: any;
  public path: any;
  public ClearHideandShow: boolean;
  public BackHideandShow: boolean;
  public NextHideandShow: boolean;
  public SaveHideandShow: boolean;
  public buttondata: any = [{ id: 1, data: "selectreferral", type: "Select Party", clear: true, next: true, back: false, save: false }, { id: 2, data: "kyc-Documents", type: "KYC Documents", clear: true, next: true, back: true, save: false }, { id: 3, data: "bankdetails", type: "Bank Details", clear: true, next: true, back: true, save: false }, { id: 4, data: "taxes", type: "Taxes", clear: true, next: false, back: true, save: true }];
  public today: Date = new Date();
  public Referraldata: any;
  public button: any = 'Submit';
  public isLoading: boolean;
  constructor(private _Partyservice: PartMasterService, private toastr: ToastrService, private _commonService: CommonService, private formbuilder: FormBuilder, private router: Router) { }

  @ViewChild(ContactSelectComponent, { static: false }) SelectReferralAgent: ContactSelectComponent;
  @ViewChild(BankdetailsComponent, { static: false }) BankDetails: BankdetailsComponent;
  @ViewChild(TDSDetailsComponent, { static: false }) Taxes: TDSDetailsComponent;
  @ViewChild(KYCDocumentsComponent, { static: false }) IdentificationDocuments: KYCDocumentsComponent;

  ngOnInit() {
    
    this.selectedtype = "Select Party";
    this.clearselection = this.selectedtype.replace(/\s/g, "").replace("/", "");
    this.ClearHideandShow = true;
    this.BackHideandShow = false;
    this.NextHideandShow = true;
    this.SaveHideandShow = false;

    this.getformdata();
    this._commonService._GetBankData().subscribe(data => {
      this.ReferalMasterForm.controls.referralbankdetailslist.setValue(data);
    });
    this._commonService._GetKYCData().subscribe(data => {
      this.ReferalMasterForm.controls.documentstorelist.setValue(data);
    });
    this._commonService._GetTDSData().subscribe(data => {
      this.ReferalMasterForm.controls.referraltaxdetailslist.setValue(data);
    });
    this.getReferralData();
  }

  getformdata() {
    this.ReferalMasterForm = this.formbuilder.group({
      createdby: [this._commonService.pCreatedby],
      modifiedby: [0],
      documentstorelist: [''],
      referralbankdetailslist: [''],
      referraltaxdetailslist: [''],
      pContactName: [''],
      pReferralId: [0],  //auto generate
      pAdvocateName: [''],  //auto generate
      pDocumentId: [0],
      pDocumentName: [''],
      pRecordid: [0],
      pContactId: [],
      pTitleName: [''],
      pName: [''],
      pSurName: [''],
      pBusinessEntitycontactNo: [''],
      pBusinessEntityEmailId: [''],
      pContactimagepath: [''],
      pReferenceId: [0],
      pPhoto: [''],
      pCreatedby: [this._commonService.pCreatedby],
      ppanno: [''],
      //pModifiedby: [0],
      // pCreateddate: [this.today],
      // pModifieddate: [''],
      // pStatusid: [1],
      pStatusname: [this._commonService.pStatusname],
      // pEffectfromdate: [''],
      // pEffecttodate: [''],
      ptypeofoperation: [this._commonService.ptypeofoperation]
    })
  }

  getReferralData() {
    
    let RefData = this._commonService._GetReferralViewData();
    let Referralid = RefData;
    if (Referralid == undefined) {
      Referralid = ''
    }
    this.Referraldata = [];
    if (Referralid != '') {
      this._Partyservice.getViewPartyDetails(Referralid).subscribe(json => {
        let Referraldata = json;
        if (json.documentstorelist.length != 0) {
          this._commonService._SetKYCUpdate(json.documentstorelist);
        }
        else {
          this._commonService.GetContactDetailsforKYC(json.pContactId).subscribe(data => {
            this._commonService._SetKYCUpdate(data);
          })
        }

        this._commonService._SetBankUpdate(json.referralbankdetailslist);
        this._commonService._SetContactUpdate(json.pContactId);
        this._commonService._SetTDSUpdate(json.referraltaxdetailslist);
        this.ReferalMasterForm.setValue({ "createdby": json.createdby, "pContactName": '', "modifiedby": json.modifiedby, "documentstorelist": json.documentstorelist, "referralbankdetailslist": json.referralbankdetailslist, "pDocumentId": json.pDocumentId, "referraltaxdetailslist": json.referraltaxdetailslist, "pReferralId": json.pReferralId, "pDocumentName": '', "pRecordid": 0, "pAdvocateName": json.pAdvocateName, "pContactId": json.pContactId, "pName": json.pName, "pSurName": json.pSurName, "pTitleName": json.pTitleName, "pBusinessEntitycontactNo": json.pBusinessEntitycontactNo, "pBusinessEntityEmailId": json.pBusinessEntityEmailId, "pCreatedby": this._commonService.pCreatedby, "pStatusname": json.pStatusname, "ptypeofoperation": 'UPDATE', "pContactimagepath": '', "pReferenceId": '', 'pPhoto': '', })
        //console.log(JSON.stringify(this.ReferalMasterForm.value))
        this._commonService._SetReferralid(json.pReferralId);
        //alert(json.pReferralId)
      });
    }
  }
  //-----------------------------Button--------------------------------//
  public ShowTitle(type) {
    
    this.selectedtype = type;
    this.clearselection = this.selectedtype.replace(/\s/g, "").replace("/", "");
    this._Partyservice.SetSelectTitileRefferalCreation(type);
    this.buttonfn();
  }

  public testlinks(data, type) {
    
    let str = data
    this.path = data
    this.selectedtype = type
    this.componentchange(data, type)
    this.buttonfn();
  }

  public buttonfn() {
    for (var n = 0; n < this.buttondata.length; n++) {
      if (this.buttondata[n].type === this.selectedtype) {
        this.ClearHideandShow = this.buttondata[n].clear;
        this.NextHideandShow = this.buttondata[n].next;
        this.BackHideandShow = this.buttondata[n].back;
        this.SaveHideandShow = this.buttondata[n].save;
      }
    }
  }

  public nextcomponent() {
    debugger
    if (this.selectedtype == 'Select Party') {
      // Surendra 14-02-2025
      // this.ReferalMasterForm.controls.ppanno.setValue(this.ReferalMasterForm.controls.documentstorelist.value[0].pDocReferenceno);
      let documentstorelist = this.ReferalMasterForm.controls.documentstorelist.value;
      let onlyPan = documentstorelist.filter(pan => pan.pDocumentName.toUpperCase() == "PAN CARD");
      this.ReferalMasterForm.controls.ppanno.setValue(onlyPan[0].pDocReferenceno);
      if (this.ReferalMasterForm.controls.pName.value == '') {
        this.SelectReferralAgent.refreshContactSelectComponent();
        this.SelectReferralAgent.Validations();
        return
      }
    }
    // else if (this.selectedtype == 'KYC Documents') {
    //   let temparr = this.ReferalMasterForm.controls.documentstorelist.value
    //   if (temparr.length == 0) {
    //     this.IdentificationDocuments.addKycDocument();
    //     return
    //   }
    // }
    // else if (this.selectedtype == 'Bank Details') {
    //   let temparr = this.ReferalMasterForm.controls.referralbankdetailslist.value
    //   if (temparr.length == 0) {
    //     this.BankDetails.AddorUpdatedata();
    //     return
    //   }
    // }

    for (var n = 0; n < this.buttondata.length; n++) {
      if (this.buttondata[n].type === this.selectedtype) {
        this.ClearHideandShow = this.buttondata[n + 1].clear;
        this.NextHideandShow = this.buttondata[n + 1].next;
        this.BackHideandShow = this.buttondata[n + 1].back;
        this.SaveHideandShow = this.buttondata[n + 1].save;
        this.componentchange(this.buttondata[n + 1].data, this.buttondata[n + 1].type);
        return
      }

    }
  }

  public backcomponent() {
    
    for (var n = 0; n < this.buttondata.length; n++) {
      if (this.buttondata[n].type === this.selectedtype) {
        this.ClearHideandShow = this.buttondata[n - 1].clear;
        this.NextHideandShow = this.buttondata[n - 1].next;
        this.BackHideandShow = this.buttondata[n - 1].back;
        this.SaveHideandShow = this.buttondata[n - 1].save;
        this.componentchange(this.buttondata[n - 1].data, this.buttondata[n - 1].type)
        return
      }
    }
  }

  public componentchange(data, type) {
    this.selectedtype = type
    this._Partyservice.SetSelectTitileRefferalCreation(type)
    $('.nav-item a[href="#' + data + '"]').tab('show');
  }

  //-----------------------------Button--------------------------------//



    clearcomponent() {
        debugger;
    if (this.ReferalMasterForm.controls.pReferralId.value == 0) {
      if (this.selectedtype === "Select Party") {
        
        this.ClearForm();
      }
      else if (this.selectedtype === "KYC Documents") {
        this.IdentificationDocuments.clearfn();
        //this.SelectReferralAgent.refreshContactSelectComponent();
        this.ReferalMasterForm.controls.documentstorelist.setValue('');
        //this.BankDetails.clearfn();
      }
      else if (this.selectedtype === "Bank Details") {
        this.BankDetails.clearfn();
        //this.SelectReferralAgent.refreshContactSelectComponent();
        this.ReferalMasterForm.controls.referralbankdetailslist.setValue('');
      }
      else if (this.selectedtype === "Taxes") {
        this.Taxes.clearfn()
        this.ReferalMasterForm.controls.referraltaxdetailslist.setValue('');
        //this.Taxes.clearfn();
      }

      //let cleartabwise = this.clearselection 
      //this.cleartabwise.clearselection();
      //this.clearselection="SelectReferralAgent"
      //this.SelectReferralAgent.Test()
      // this.clearselection.test
      //this.FiContacttype.ApplicantData;
    }
    else {
      this.ClearForm();
    }
  }

  testclick() {

    //  this.SelectReferralAgent.Test()
    // this.clearselection=this.SelectReferralAgent
    //this.clearselection.Test()

    //const componentRef = this.entry.createComponent(this.clearselection);
    //componentRef.Test()
    //componentRef.instance.message = message;

  }

  GetContactPersonData(event) {
    debugger
    if (this.ReferalMasterForm.controls.pReferralId.value == 0) {
      this.ReferalMasterForm.controls.pContactId.setValue(event.pContactId);
      this._commonService.GetContactDetailsforKYC(event.pContactId).subscribe(data => {
        this._commonService._SetKYCUpdate(data);
        this.ReferalMasterForm.controls.documentstorelist.setValue(data)
      })
      this.ReferalMasterForm.controls.pTitleName.setValue(event.pTitleName);
      this.ReferalMasterForm.controls.pName.setValue(event.pContactName);
      this.ReferalMasterForm.controls.pBusinessEntitycontactNo.setValue(event.pBusinessEntitycontactNo);
      this._commonService._SetContactData(event);
    }
    else {
      this.ReferalMasterForm.controls.pContactId.setValue(event.pContactId);
      this._commonService.GetContactDetailsforKYC(event.pContactId).subscribe(data => {
        this._commonService._SetKYCUpdate(data);
        this.ReferalMasterForm.controls.documentstorelist.setValue(data)
      })
      this.ReferalMasterForm.controls.pTitleName.setValue(event.pTitleName);
      this.ReferalMasterForm.controls.pName.setValue(event.pContactName);
      this.ReferalMasterForm.controls.pBusinessEntitycontactNo.setValue(event.pBusinessEntitycontactNo);
      this._commonService._SetContactData(event);
    }

  }

  Savereferralagent() {
    debugger
    this.Taxes.AddorUpdatedata();
    let count = 0;
    let contactid = this.ReferalMasterForm.controls.pContactId.value;
    let RefId = this.ReferalMasterForm.controls.pReferralId.value;
    if (contactid == null || contactid == undefined) {
      this.SelectReferralAgent.Validations();
      this.ClearHideandShow = this.buttondata[0].clear;
      this.NextHideandShow = this.buttondata[0].next;
      this.BackHideandShow = this.buttondata[0].back;
      this.SaveHideandShow = this.buttondata[0].save;
      this.componentchange(this.buttondata[0].data, this.buttondata[0].type);
      this.isLoading = false;
      this.button = 'Submit'
      return
    }
    else if (this.Taxes.getFormData() == false) {
      this.componentchange(this.buttondata[3].data, this.buttondata[3].type);
      this.isLoading = false;
      this.button = 'Submit'
      return
    }
    this._Partyservice.checkContactIndividual(contactid, RefId).subscribe(res => {
      if (res > 0) {
        count = 1;
        this.showErrorMessage('Contact already exists');
        this.isLoading = false;
        this.button = 'Submit'
      }
      else {
        this.isLoading = true;
        this.button = 'Processing';


        let data = this.ReferalMasterForm.value
        console.log(data);
        
        this._Partyservice.savePartydata(data).subscribe(res => {

          //  this.SelectReferralAgent.refreshContactSelectComponent();
          this.IdentificationDocuments.clearfn();
          this.BankDetails.clearfn();
          this.Taxes.clearfn()
          this.getformdata();
          this.ShowTitle('selectreferral');
          this._commonService.showInfoMessage('Saved Successfully');
          this.router.navigate(['/PartyView'])
          //this.ClearForm();
        },
          (error) => {
            this.isLoading = false;
            this.button = 'Submit'
            this.showErrorMessage(error);
          });
      }
    });

  }
  showErrorMessage(errormsg: string) {
    this._commonService.showErrorMessage(errormsg);
  }


  ClearForm() {
    
     this.IdentificationDocuments.ngOnInit();
     this.BankDetails.ngOnInit();
     this.Taxes.ngOnInit();
     this.SelectReferralAgent.ngOnInit();
     this.SelectReferralAgent.refreshContactSelectComponent();
     this.getformdata();
     this.componentchange(this.buttondata[0].data, this.buttondata[0].type);
     this.ClearHideandShow = this.buttondata[0].clear;
     this.NextHideandShow = this.buttondata[0].next;
     this.BackHideandShow = this.buttondata[0].back;
     this.SaveHideandShow = this.buttondata[0].save;
  
      this._commonService._SetReferralViewData('');
      this.router.navigate(['/PartyMaster']);
    // }
  }
}
