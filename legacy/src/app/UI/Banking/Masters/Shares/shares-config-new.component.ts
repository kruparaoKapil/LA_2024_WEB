import { Component, OnInit, ViewChild, ViewContainerRef, ɵConsole } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators, ControlContainer } from '@angular/forms';
import { ToastrService } from 'ngx-toastr'
import { CommonService } from 'src/app/Services/common.service';
import { CompanynameCompanycodeComponent } from 'src/app/UI/Common/companyname-companycode/companyname-companycode.component';
import { ShareCapitalComponent } from './share-capital.component';
import { ShareconfigService } from 'src/app/Services/Banking/shareconfig.service';
import { ThreeDigitDecimaNumberDirective } from 'src/app/Directives/three-digit-decima-number.directive';
declare let $: any
@Component({
  selector: 'app-shares-config-new',
  templateUrl: './shares-config-new.component.html',
  styles: []
})
export class SharesConfigNewComponent implements OnInit {
  @ViewChild(CompanynameCompanycodeComponent, { static: false }) sharenamecode;

  public isLoading: boolean;
  public selectedtype: any;
  public clearselection: any;
 
  public ClearHideandShow: boolean;
  public BackHideandShow: boolean;
  public NextHideandShow: boolean;
  sharenamecodeform: any;
  sharedetails = {};
  duplicate: any;
  ShowDetailsOnTab: Boolean = false;
  sharedata: any;
  sharenameedit:any;
  sharename:any;
  sharecode:any;
  sharenameandcode:any;
  editdata: any;
  buttontype: any;
  public SaveHideandShow: boolean;
  public button: any = 'Submit';
  public path: any;
  public buttondata: any = [{ id: 1, data: "share-capital-name", type: "Share Capital Name and Code", clear: true, next: true, back: false, save: false }, { id: 2, data: "share-config", type: "Share Configuration", clear: true, next: true, back: true, save: false }, { id: 3, data: "referral-commission", type: "Referral Commission", clear: true, next: false, back: true, save: true }];

  constructor(private toastr: ToastrService, private shareconfigservice: ShareconfigService, private _commonService: CommonService, private formbuilder: FormBuilder, private router: Router,private ActRoute: ActivatedRoute) { }


  ngOnInit() {
debugger;
this.sharenameedit='';
  $( "#myTab" ).prop( "disabled", true );
    this.selectedtype = "Share Capital Name and Code";
    this.clearselection = this.selectedtype.replace(/\s/g, "").replace("/", "");
    this.ClearHideandShow = true;
    this.BackHideandShow = false;
    this.NextHideandShow = true;
    this.SaveHideandShow = false;
    if (this.ActRoute.snapshot.params['name']) {
      debugger;   
      this.sharenameedit = atob(this.ActRoute.snapshot.params['name']);
    }
    else{
      this.sharenameedit='';
    }
    
    //this.sharenamecode.EditData(this.editdata)
this.GetSetTab1data();

  }

  public ShowTitle(type) {
    debugger
    this.selectedtype = type;

    if (this.selectedtype == "Share Capital Name and Code") {
      this.ClearHideandShow = true;
      this.NextHideandShow = true
    }
    else {
      this.ClearHideandShow = false;
      this.NextHideandShow = false
    }

    this.clearselection = this.selectedtype.replace(/\s/g, "").replace("/", "");
  }

  public NavigateLinks(data, type) {
    this.selectedtype = type
    this.componentchange(data, type)

  }

  public buttonfn() {
    debugger
    for (var n = 0; n < this.buttondata.length; n++) {
      if (this.buttondata[n].type == "Share Capital Name and Code") {
        this.ClearHideandShow = this.buttondata[n].clear;
        this.NextHideandShow = this.buttondata[n].next;
        this.BackHideandShow = this.buttondata[n].back;
        this.SaveHideandShow = this.buttondata[n].save;
      }
    }
  }

  public componentchange(data, type) {
    debugger

    this.selectedtype = type
    $('.nav-item a[href="#' + data + '"]').tab('show');

  }

  public nextcomponent() {
    debugger
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

  public clearcomponent() {
    debugger
    this.sharenamecode.clear()
  }
  public GetSetTab1data(){
    debugger;
    this.buttontype = this.shareconfigservice.Newstatus();
    if(this.buttontype!="New")
    {
      let tabldata=this.shareconfigservice.SetTab1data();
      if(tabldata!=null){
        this.ShowDetailsOnTab=true;
        this.ClearHideandShow=false
        this.sharename = tabldata.psharename;
        this.sharecode = tabldata.psharecode;
        this.sharenameandcode=tabldata.psharenamecode;
      }
    }
    
  }

  public SaveShareConfig() {
    let isValid = true;
    debugger
    this.sharenamecodeform = this.sharenamecode.CompanyNameCodeForm.value;
    let shareconfigid = this.sharenamecode.CompanyNameCodeForm.controls.pshareconfigid.value;
    this.sharename = this.sharenamecode.CompanyNameCodeForm.controls.psharename.value;
    this.sharecode = this.sharenamecode.CompanyNameCodeForm.controls.psharecode.value;
    this.sharenameandcode=this.sharenamecode.CompanyNameCodeForm.controls.psharenamecode.value
   

    let data = JSON.stringify(this.sharenamecodeform)
    if (this.sharenamecode.checkValidations(this.sharenamecode.CompanyNameCodeForm, isValid)) {
      this.shareconfigservice.CheckShareNameShareCodeDuplicate(shareconfigid,this.sharename,this.sharecode).subscribe(res => {
        
        debugger
        if (Number(res.pSchemeCount)== 0 && Number(res.pSchemeCodeCount)== 0) {
          this.shareconfigservice.savesharenameandcode(data).subscribe(res => {
            if (res) {

              this.shareconfigservice.GetShareNameAndCodeDetails( this.sharename, this.sharecode).subscribe(res => {
                debugger
                console.log(res)
                this.sharedata = res

                this.shareconfigservice.Getsharenameandcodedetails(this.sharedata)
                let str = "share-config"
                $('.nav-item a[href="#' + str + '"]').tab('show');
                this.ShowDetailsOnTab=true
                this.NextHideandShow = false;
                this.ClearHideandShow = false
               // $('.nav-item a').removeClass('disableTabs');
              })



            }
          })
        }
        else{
          if(Number(res.pSchemeCodeCount)!=0){
                 this.sharenamecode.CompanyNameCodeForm.controls.psharecode.setValue("");
                // this.sharenamecode.CompanyNameCodeForm.controls.psharename.setValue("");
                this.sharenamecode.CompanyNameCodeForm.controls.psharenamecode.setValue("");
               // this.sharenamecode.NameandCodeValidationErrors.psharecode=null;
               this.sharenamecode.CompanyNameCodeForm.controls.pseries.setValue('00001');
               this._commonService.showWarningMessage('Share Capital Code Already Exists.');
               this.sharenamecode.ShareNameCode = "";

          }
        else if(Number(res.pSchemeCount)!=0){
                this.sharenamecode.CompanyNameCodeForm.controls.psharecode.setValue("");
                 this.sharenamecode.CompanyNameCodeForm.controls.psharename.setValue("");
                this.sharenamecode.CompanyNameCodeForm.controls.psharenamecode.setValue("");
                this.sharenamecode.NameandCodeValidationErrors.psharecode=null;
               this.sharenamecode.CompanyNameCodeForm.controls.pseries.setValue('00001');
               this._commonService.showWarningMessage('Share Capital Name Already Exists.');
               this.sharenamecode.ShareNameCode = "";
          }
        }
      })

    }

  }
  back(){
    debugger;
    this.router.navigate(['/SharesConfigView']);
  }

}
