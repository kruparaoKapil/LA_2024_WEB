import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MemberService } from '../../../../Services/Banking/member.service';
import { LienEntryService } from 'src/app/Services/Banking/lien-entry.service';
import { FdReceiptService } from 'src/app/Services/Banking/Transactions/fd-receipt.service';
import { CommonService } from 'src/app/Services/common.service';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { State, process } from '@progress/kendo-data-query';
import { isNullOrUndefined } from '@swimlane/ngx-datatable';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
declare let $: any;
@Component({
  selector: 'app-lien-release-new',
  templateUrl: './lien-release-new.component.html',
  styles: []
})
export class LienReleaseNewComponent implements OnInit {
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  LienReleaseform: FormGroup;
  MemberDetailsListAll: any;
  LienReleaseformErrorMessages: any;
  LienEntryDataonFdaccount: any;
  FddetaisList: any;
  MemberFdDetails: any;
  BranchDetails: any;
  memberLienDetails: any;
  LienReleaseData: any;
  //Liendate: any;
  //MemberName: any;
  //Tenor: any;
  //Depositamount: any;
  TransDate: any;
  
  
  Amount: any;
 
  memberId: any;

  public Fdaccountno: any;
  public Membername: any;
  public Depositamount: any;
  public Maturityamount: any;
  public Tenortype: any;
  public Tenor: any;
  public Interesttype: any;
  public Interestrate: any;
  public InterestPayble: any;
  public InterestPayout: any;
  public MemberType: any;
  public DepositDate: any;
  public MaturityDate: any;
  public ReceivedAmount: any;
  public TotalBalanceAmount: any;
  public check: boolean = false;
  public allRowsSelected: boolean = false;
  public ShowFixeddepositdetails: boolean = false;
  public ShowRecenttransaction: boolean = false;
  disabledforButtons: boolean = true;
  public pageSize = 10;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10
  };
  IsFddetailsview: boolean = false;
  pFdaccountID: any;
  constructor(private router: Router, private zone: NgZone, private datePipe: DatePipe, private toastr: ToastrService,
    private fb: FormBuilder, private _MemberService: MemberService, private _LienEntryService: LienEntryService,
    private _commonservice: CommonService, private _FdReceiptService: FdReceiptService) {

    this.dpConfig.dateInputFormat = 'DD/MM/YYYY'
    this.dpConfig.maxDate = new Date();
    this.dpConfig.showWeekNumbers = false;

    window['CallingFunctionOutsideMemberData'] = {
      zone: this.zone,
     componentFn: (value) => this.MemberChange(value),
      component: this,
    };
    window['CallingFunctionToMemberHideCard'] = {
      zone: this.zone,
      componentFn: () => this.HideCard(),
      component: this,
    };
  }

  ngOnInit() {
    this.LienReleaseformErrorMessages = {};
    this.LienReleaseform = this.fb.group({
      pLienid:[0],
      pLienrealsedate: [new Date()],
      pMembercode: [null, [Validators.required]],
      pFdaccountno: [null, [Validators.required]],
      pCompanybranch: [null, [Validators.required]],
      pCreatedby: [this._commonservice.pCreatedby],
      pMemberid:[''],
      ptypeofoperation:['CREATE']
    })
    //this.GetMembers();
    this.GetBranchDetails();
    this.BlurEventAllControll(this.LienReleaseform);
  }
  BranchChange($event) {
    debugger;
    //this.ClearSchemeDetails();
    this.ShowFixeddepositdetails = false;
    this.ShowRecenttransaction = false;
    this.disabledforButtons = true;
    this.IsFddetailsview = false;
    this.LienReleaseform.controls.pMembercode.setValue(null);
    this.LienReleaseform.controls.pFdaccountno.setValue(null);
    this.LienReleaseformErrorMessages.pMembercode = "";
    this.LienReleaseformErrorMessages.pFdaccountno = "";
    this.FddetaisList = [];
    if (!isNullOrUndefined($event)) {
      let branchname = $event.pBranchname;
      this.GetMembers(branchname);
    }
    
  }

  GetMembers(Branchname) {
    this._LienEntryService.GetLienMembers(Branchname).subscribe(result => {
      debugger;
      this.MemberDetailsListAll = result;
      
    })
  }
  GetFDAndTransactionDetails(Type) {
    debugger;
    if (Type == "AccountDetails") {
      this.ShowFixeddepositdetails = true;
      this.ShowRecenttransaction = false;
    }
    else {
      this.ShowFixeddepositdetails = false;
      this.ShowRecenttransaction = true;
    }
  }
  MemberChange(event) {
    debugger;
    this.ShowFixeddepositdetails = false;
    this.ShowRecenttransaction = false;
    this.disabledforButtons = true;
    this.IsFddetailsview = false;
   // this.ClearSchemeDetails();
    this.LienReleaseform.controls.pFdaccountno.setValue(null);
    this.LienReleaseformErrorMessages.pFdaccountno = "";
    this.FddetaisList = [];
    if (!isNullOrUndefined(event)) {
      let membercode = event.pMembercode;
      this.LienReleaseform.controls.pMemberid.setValue(event.pMemberid);
      let BranchName = this.LienReleaseform.controls.pCompanybranch.value;
      this.GetFdDetails(membercode, BranchName);
    }
    
    //this.LienReleaseformErrorMessages.pMembercode = "";
  }
  GetFdDetails(membercode, BranchName) {
 
    this._LienEntryService.GetLienFdAccountNos(membercode, BranchName).subscribe(result => {
      debugger;
     
      this.FddetaisList = result;
  
    })
  }
  SelectMemberData(e) {
    debugger
    if (e.dataItem) {
      var dataItem = e.dataItem;
      window['CallingFunctionOutsideMemberData'].componentFn(dataItem)
    }
    else {
      var multicolumncombobox: any;
      multicolumncombobox = $("#MemberData").data("kendoMultiColumnComboBox");
      if (multicolumncombobox)
        multicolumncombobox.value("");
    }
  }
  CancelClick() {
    window['CallingFunctionToMemberHideCard'].componentFn()
  }
  HideCard() {
debugger;
    if (this.LienReleaseform.controls['pMembercode'].value) {
      this.clearFdAndLienDetails();
      this.LienReleaseform.controls['pMembercode'].setValue('');
      this.LienReleaseform.controls.pFdaccountno.setValue(null);
      this.LienReleaseformErrorMessages.pMembercode = '';
      this.LienReleaseformErrorMessages.pFdaccountno = '';
      this.FddetaisList = [];
    }

  }
  clearFdAndLienDetails() {
    debugger;
    this.IsFddetailsview = false;
    this.MemberFdDetails = [];
    this.memberLienDetails = [];
    this.LienReleaseform.controls.pCompanybranch.setValue(null);
    this.LienReleaseformErrorMessages.pCompanybranch = '';
  }
  GetLienEntryData(pFdaccountno,pFdaccountID) {
    debugger;
    let Membercode = this.LienReleaseform.controls.pMembercode.value;
    let LienDate = this.datePipe.transform(new Date(this.LienReleaseform.controls.pLienrealsedate.value), "yyyy-MM-dd");

    let FdAccountno = pFdaccountno;
    let FdaccountID = pFdaccountID;
    if (!isNullOrEmptyString(FdAccountno)) { 
    this._FdReceiptService.GetFdDetailsById(pFdaccountno,FdaccountID).subscribe(result => {
      debugger;

      this.ShowFixeddepositdetails = true;
      this.ShowRecenttransaction = false;
      this.disabledforButtons = false;

      if (result) {

        this.Fdaccountno = result[0].pFdaccountno;
        this.Membername = result[0].pMembername;
        this.Depositamount = result[0].pDeposiamount;
        this.Maturityamount = result[0].pMaturityamount;
        this.DepositDate = result[0].pDeposidate;
        this.MaturityDate = result[0].pMaturitydate;
        this.Tenortype = result[0].pTenortype;
        this.Tenor = result[0].pTenor;
        this.Interesttype = result[0].pInteresttype;
        this.Interestrate = result[0].pInterestrate;
        this.InterestPayble = result[0].pInterestPayble;
        this.InterestPayout = result[0].pInterestPayout;
        this.TransDate = result[0].pTransdate;
        this.ReceivedAmount = result[0].pClearedmount;
        this.TotalBalanceAmount = result[0].pBalanceamount;
      }
    })
    //this.clearFdAndLienDetails();
    this._LienEntryService.GetLienReleaseData(Membercode, FdAccountno, LienDate).subscribe(result => {
      debugger;
      if (result) {

        this.IsFddetailsview = true;
        this.memberLienDetails = result
        this.memberLienDetails.filter(function (df) { df.pIsprimaryLien = false; });
      }
    });
    let memberid = this.LienReleaseform.controls.pMemberid.value;
    this._LienEntryService.GetMemberFdDetails(memberid, pFdaccountno).subscribe(result => {
      debugger;

      if (result) {
        this.MemberFdDetails = result;
        this.TransDate = this.datePipe.transform(this.MemberFdDetails.pTransdate, "dd-MMM-yyyy");
        this.Membername = this.MemberFdDetails.pMembername;
        this.Amount = this.MemberFdDetails.pDepositamount;
        this.Fdaccountno = this.MemberFdDetails.pFdaccountno;
        this.Tenor = this.MemberFdDetails.pTenor;
        this.Tenortype = this.MemberFdDetails.pTenortype;

      }
    })
    this._LienEntryService.GetLiendata(pFdaccountno).subscribe(result => {
      debugger;
      if (result) {
        this.LienEntryDataonFdaccount = result;
      }
    })
  }
  }
  FdCreationChange(event) {
    debugger;
    //this.ClearSchemeDetails();
    this.ShowFixeddepositdetails = false;
    this.ShowRecenttransaction = false;
    this.disabledforButtons = true;
    this.IsFddetailsview = false;
    if (!isNullOrUndefined(event)) {
      this.pFdaccountID = event.pFdaccountID;
      this.GetLienEntryData(event.pFdaccountno,event.pFdaccountID);
      
    }
  }
  ClearSchemeDetails() {
    this.disabledforButtons = true;
    this.ShowFixeddepositdetails = false;
    this.IsFddetailsview = false;
    this.TransDate = "";
    this.Membername = "";
    this.Amount = "";
    this.Fdaccountno = "";
    this.Tenor = "";
    this.Tenortype = "";
  }
  GetBranchDetails() {
    this._LienEntryService.GetLienReleaseBranches().subscribe(result => {
      this.BranchDetails = result;

    })
      
  }
  selectAll(event, row, rowIndex) {
    debugger;
   
    if (event.target.checked) {
      this.allRowsSelected = true;
      this.check = true;
      this.memberLienDetails.filter(x => x.pIsprimaryLien = true);
     
    }
    else {
      this.check = false;
      this.allRowsSelected = false;
      this.memberLienDetails.filter(x => x.pIsprimaryLien = false);
    }

  }
  SelectLienAmount($event,dataItem, row) {
    debugger;
    let data = [];
    this.memberLienDetails[row].pIsprimaryLien = ($event.target.checked) ? true : false;
    data = this.memberLienDetails.filter(itm => itm.pIsprimaryLien === true);
    if (this.memberLienDetails.length == data.length) {
      this.allRowsSelected = true;
    }
    else {
      this.allRowsSelected = false;
    }
  }
  LienrealsedateChange() {
    let FDaccountId = this.LienReleaseform.controls.pFdaccountno.value;
    this.GetLienEntryData(FDaccountId,this.pFdaccountID);
  }
  SaveLienRelease() {
    debugger;
    this.LienReleaseData = [];
  let isValid: boolean = true;
    if (this.checkValidations(this.LienReleaseform, isValid)) {
      let data = this.memberLienDetails.filter(itm => itm.pIsprimaryLien === true);
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          this.LienReleaseform.controls.pLienid.setValue(data[i].pLienid);
          this.LienReleaseData.push(this.LienReleaseform.value);
        }
        let Formdata = JSON.stringify({ ListLienreleaseDTO: this.LienReleaseData});
        this._LienEntryService.SaveLienRelease(Formdata).subscribe(result => {
          debugger;
          if (result) {
            this._commonservice.showInfoMessage("Saved Successfully");
            //this.toastr.success("Saved Successfully");
            this.router.navigateByUrl("/LienReleaseView")
            this.LienReleaseform.reset();
          }
        },
          err => {
            // this.loading = false;
            this._commonservice.showErrorMessage("Error while saving");
          });
      }

    }
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

          //if (key != 'InsuranceMemberNomineeDetailsList')
          //  this.checkValidations(formcontrol, isValid)
        }
        else if (formcontrol.validator) {
          this.LienReleaseformErrorMessages[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {

            let errormessage;

            for (const errorkey in formcontrol.errors) {
              if (errorkey) {

                let lablename;

                lablename = (document.getElementById(key) as HTMLInputElement).title;
                errormessage = this._commonservice.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.LienReleaseformErrorMessages[key] += errormessage + ' ';
                isValid = false;
              }
            }

          }
        }
      }

    }
    catch (e) {
      this._commonservice.showErrorMessage(key);
      return false;
    }
    return isValid;
  }
  showErrorMessage(errormsg: string) {
    this._commonservice.showErrorMessage(errormsg);
  }
  BlurEventAllControll(fromgroup: FormGroup) {

    try {

      Object.keys(fromgroup.controls).forEach((key: string) => {
        this.setBlurEvent(fromgroup, key);
      })

    }
    catch (e) {
      this._commonservice.showErrorMessage(e);
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
      this._commonservice.showErrorMessage(e);
      return false;
    }



  }
  back(){
    debugger;
    this.router.navigate(['/LienReleaseView']);
  }


}
