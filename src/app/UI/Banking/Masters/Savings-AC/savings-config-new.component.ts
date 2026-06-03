import { Component, OnInit } from '@angular/core';
import { SavingaccountconfigService } from '../../../../Services/Banking/savingaccountconfig.service';
import { Router,ActivatedRoute } from '@angular/router';
declare let $: any
@Component({
  selector: 'app-savings-config-new',
  templateUrl: './savings-config-new.component.html',
  styles: []
})
export class SavingsConfigNewComponent implements OnInit {
  public selectedtype: any;
  public clearselection: any;
  AccountCode: string;
  AccNameandCode: string;
  Accname: string;
  EditsavingID='';
  SavingAccountid: any;
  savingAccountconfig: any;
  public ClearHideandShow: boolean;
  public BackHideandShow: boolean;
  public NextHideandShow: boolean;
  public SaveHideandShow: boolean;
  ShowDetailsOnTab: Boolean = false;
  formtype: string;
  public buttondata: any = [{ id: 1, data: "savingnameandcode", type: "Savings a/c Name and Code", clear: true, next: true, back: false, save: false }, { id: 2, data: "savingconfig", type: "Savings a/c Configuration", clear: true, next: true, back: true, save: false }, { id: 3, data: "loanfacility", type: "Loan Facility and Pre-Maturity", clear: true, next: false, back: true, save: true }, { id: 4, data: "mandatorykyc", type: "Identification Documents", clear: true, next: false, back: true, save: true }, { id: 5, data: "referral-commission", type: "refferral", clear: true, next: false, back: true, save: true }];
  constructor(private _savingaccountconfigService: SavingaccountconfigService,private router:Router, private ActRoute: ActivatedRoute,) { }

  ngOnInit() {
    this.formtype = "SavingAccountConfig";
    this.EditsavingID='';
    this.selectedtype = "Savings a/c Name and Code";
    this.clearselection = this.selectedtype.replace(/\s/g, "").replace("/", "");
    this.ClearHideandShow = true;
    this.BackHideandShow = false;
    this.NextHideandShow = true;
    this.SaveHideandShow = false;
    if (this.ActRoute.snapshot.params['id']) {
      debugger
      this.EditsavingID = atob(this.ActRoute.snapshot.params['id']);
    }
    else{
        this.EditsavingID ='';
    }
      this.GetAccountNameAndCode();
  }
  public GetAccountNameAndCode() {

    this._savingaccountconfigService._GetAccountNameAndCode().subscribe(res => {
      if (res != null && res != undefined && res != "") {
        debugger;
        //console.log("LoanDetails : ",res);
        this.AccountCode = res.Accountcode;
        this.AccNameandCode = res.Accountnamecode;
        this.Accname = res.AccName;
        this.SavingAccountid = res.Accountconfigid;
        this.ShowDetailsOnTab = true;
        this.savingAccountconfig = res;
        //console.log("res in master", res);

      }
    })
  }
  public ShowTitle(type) {
    debugger
    this.selectedtype = type;
    this.clearselection = this.selectedtype.replace(/\s/g, "").replace("/", "");
    this.buttonfn();
  }
  public NavigateLinks(data, type) {
    this.selectedtype = type
    this.componentchange(data, type)
    this.buttonfn();
  }
  public buttonfn() {
    for (var n = 0; n < this.buttondata.length; n++) {
      if (this.buttondata[n].type == this.selectedtype) {
        this.ClearHideandShow = this.buttondata[n].clear;
        this.NextHideandShow = this.buttondata[n].next;
        this.BackHideandShow = this.buttondata[n].back;
        this.SaveHideandShow = this.buttondata[n].save;
      }
    }
  }
  public componentchange(data, type) {
    this.selectedtype = type
    $('.nav-item a[href="#' + data + '"]').tab('show');
  }
  public nextcomponent() {
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
  back(){
    debugger;
    this.router.navigate(['/SavingsView']);
  }
}
