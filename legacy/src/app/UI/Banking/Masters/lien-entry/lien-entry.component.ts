import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MemberService } from '../../../../Services/Banking/member.service';
import { LienEntryService } from 'src/app/Services/Banking/lien-entry.service';
import { FdReceiptService } from 'src/app/Services/Banking/Transactions/fd-receipt.service';
import { CommonService } from 'src/app/Services/common.service';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { isNullOrUndefined, debug } from 'util';
import { MaturityPaymentService } from 'src/app/Services/Banking/Transactions/maturity-payment.service';
import { SelfAdjustmentService } from 'src/app/Services/Banking/Transactions/self-adjustment.service';
declare let $: any
@Component({
  selector: 'app-lien-entry',
  templateUrl: './lien-entry.component.html',
  styles: []
})
export class LienEntryComponent implements OnInit {
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  LienEntryform: FormGroup;
  MemberDetailsListAll: any;
  FddetaisList: any;
  BranchDetails: any;
  ToBranchDetails: any;
  MemberFdDetails: any;
  LienEntryformErrorMessages: any;
  LienEntryDataonFdaccount: any;
  ClearButtonHideShowInEdit: boolean = true;

  TransDate: any;


  Amount: any;


  BalanceAmount: any = 0.00;
  clearcount: any;
  public selectedvalues: any = []

  public Fdaccountno: any;
  public Membername: any;
  public Depositamount: any = 0.00;
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
  public LienAmount: any = 0;


  public ReceivedAmount: any;
  public TotalBalanceAmount: any;
  Clearmember: boolean;
  ClearFd: boolean;
  notEditable: boolean = false;
  IsFddetailsview: boolean = false;
  public ShowFixeddepositdetails: boolean = false;
  public ShowRecenttransaction: boolean = false;
  disabledforButtons: boolean = true;
  companyName: any;
  pAddress: any;
  companyNameDisplay: any;
  MaturityDetails: any = [];
  asonAmount: any = 0.00;
  maturityType: any;
  //bhargavi
  depositeamount: any;
  //bhargavi
    groupcodeticketDetails: any = [];
  constructor(private _route: ActivatedRoute, private router: Router, private zone: NgZone, private datePipe: DatePipe,
    private toastr: ToastrService, private fb: FormBuilder, private _MemberService: MemberService,
    private _LienEntryService: LienEntryService, private _commonservice: CommonService, private _FdReceiptService: FdReceiptService, private _MaturityPaymentService: MaturityPaymentService,private _SelfOrAdjustmentservice: SelfAdjustmentService) {
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
    //window['CallingFunctionOutsideFdData'] = {
    //  zone: this.zone,
    //  componentFn: (value) => this.FdCreationChange(value),
    //  component: this,
    //};
    //window['CallingFunctionToFDHideCard'] = {
    //  zone: this.zone,
    //  componentFn: (value) => this.ClearFdAccountno(value),
    //  component: this,
    //};

  }

  ngOnInit() {
    debugger;
    this.LienEntryformErrorMessages = {};
    this.LienEntryform = this.fb.group({
      pLienid: [0],
      pLiendate: [new Date()],
      pMemberid: [null, [Validators.required]],
      pFdaccountno: [''],
      pFdaccoutid: [''],
      pBranchname: [null, [Validators.required]],
      pFdacctid: [null, [Validators.required]],
      pCompanybranch: [null, [Validators.required]],
      pLienadjuestto: ['', [Validators.required]],
      pLienamount: ['', [Validators.required]],
      pMembercode: [''],
      pCompanyname: [''],
      pReceipttype: ['LIEN'],
      ptypeofoperation: ['CREATE'],
      pCreatedby: [this._commonservice.pCreatedby],
    })
    this.GetBranchDetails();
    this.GetToBranchDetails();
    this.BlurEventAllControll(this.LienEntryform);
    if (this._route.snapshot.params['id']) {
      debugger
      let Lienid = atob(this._route.snapshot.params['id']);
      Lienid = Lienid
      let ButtonType = this._LienEntryService.GetButtonClickType();
      if (ButtonType == 'Edit') {
        this.ClearButtonHideShowInEdit = false;
        this.BindData();
        this.notEditable = true;
      }
      // this.notEditable = true;
    }

  }
  //GetMembers() {
  //  this._MemberService.GeFIMemberDetailsList().subscribe(result => {

  //    this.MemberDetailsListAll = result;
  //    $("#MemberData").kendoMultiColumnComboBox({
  //      dataTextField: "pMemberReferenceId",
  //      dataValueField: "pMembertypeId",
  //      height: 400,
  //      columns: [
  //        { field: "pContactName", title: "Member Name", width: 200 },
  //        { field: "pMemberReferenceId", title: "Member code", width: 200 },
  //        { field: "pContactNo", title: "Contact No", width: 200 },

  //      ],
  //      filter: "contains",
  //      filterFields: ["pContactName", "pMemberReferenceId", "pContactNo"],
  //      dataSource: this.MemberDetailsListAll,
  //      select: this.SelectMemberData,
  //      change: this.CancelClick,


  //    });
  //  })
  //}
  SelectMemberData(e) {
    debugger
    if (e.dataItem) {
      var dataItem = e.dataItem;
      window['CallingFunctionOutsideMemberData'].componentFn(dataItem)
    }

  }
  CancelClick() {

    this.Clearmember = true;
    window['CallingFunctionToMemberHideCard'].componentFn()
  }
  CancelFDAccountClick() {
    window['CallingFunctionToFDHideCard'].componentFn()
  }
  HideCard() {
    debugger;
    if (this.LienEntryform.controls['pMemberid'].value) {

      this.LienEntryform.controls['pMembercode'].setValue('');
      this.LienEntryform.controls['pMemberid'].setValue('');
      this.LienEntryform.controls['pFdacctid'].setValue('');
      this.LienEntryform.controls['pFdaccountno'].setValue('');
      this.LienEntryformErrorMessages.pMemberid = '';
      //this.GetFdDetails(0, "");

    }

  }
  ClearFdAccountno(event) {
    debugger;
    var multicolumncombobox: any;
    multicolumncombobox = $("#FdData").data("kendoMultiColumnComboBox");
    let test = multicolumncombobox.value;

    if (this.LienEntryform.controls['pFdacctid'].value) {
      this.LienEntryform.controls.pFdacctid.setValue('');
      this.LienEntryform.controls.pFdaccountno.setValue('');
      this.LienEntryformErrorMessages.pFdacctid = '';
      this.IsFddetailsview = false;
    }

  }
  GetFdDetails(event) {
    var multicolumncombobox: any;
    let ButtonType = this._LienEntryService.GetButtonClickType();
    this._LienEntryService.GetFdDetails(event.memberid, event.Branchname, ButtonType).subscribe(result => {
      debugger

      this.LienEntryform.controls.pMemberid.setValue(event.memberid);
      this.LienEntryform.controls.pMembercode.setValue(event.membercode);
      this.FddetaisList = result;
    })
  }
  BranchChange(event) {
    this.ShowFixeddepositdetails = false;
    this.ShowRecenttransaction = false;
    this.disabledforButtons = true;
    this.MemberDetailsListAll = [];
    this.FddetaisList = [];
    this.LienEntryform.controls.pMemberid.setValue(null);
    this.LienEntryform.controls.pMembercode.setValue('');
    this.LienEntryform.controls.pFdacctid.setValue(null);
    this.LienEntryform.controls.pFdaccountno.setValue('');
    this.LienEntryformErrorMessages.pMemberid = "";
    this.LienEntryformErrorMessages.pFdacctid = '';
    this.Depositamount = 0.00;
    this.BalanceAmount = 0.00;
    this.asonAmount = 0.00;

    this.groupcodeticketDetails = [];
  this.LienEntryform.controls.pLienadjuestto.setValue('');
  this.LienEntryform.controls.pCompanybranch.setValue(null);
  this.companyNameDisplay = '';

    if (!isNullOrUndefined(event)) {
      this._LienEntryService.GetMemberDetails(event.pBranchname).subscribe(result => {
        this.MemberDetailsListAll = result;
      })
    }

  }
  customSearchFn(term: string, item: any) {
    debugger;
    console.log(item)
    term = term.toLowerCase();
    return item.pContactName.toLowerCase().indexOf(term) > -1 || item.pMemberReferenceId.toLowerCase().indexOf(term) > -1 || item.pContactNo.toString().toLowerCase().indexOf(term) > -1;
  }
  MemberChange(event) {
    debugger;
    this.ShowFixeddepositdetails = false;
    this.ShowRecenttransaction = false;
    this.disabledforButtons = true;
    this.FddetaisList = [];

    this.LienEntryform.controls.pFdacctid.setValue(null);
    this.LienEntryform.controls.pFdaccountno.setValue('');
    this.LienEntryformErrorMessages.pFdacctid = '';
    this.Depositamount = 0.00;
    this.BalanceAmount = 0.00;
    this.asonAmount = 0.00;
    if (!isNullOrUndefined(event)) {
      this.Clearmember = false;
      let memberid = event.pMembertypeId;
      let membercode = event.pMemberReferenceId;
      let Branchname = this.LienEntryform.controls.pBranchname.value;
      this.IsFddetailsview = false;
      let object = ({ memberid: memberid, membercode: membercode, Branchname: Branchname })
      this.GetFdDetails(object);
    }
    else {
      this.LienEntryform.controls['pMembercode'].setValue('');
      this.LienEntryform.controls['pMemberid'].setValue('');
      this.LienEntryform.controls['pFdacctid'].setValue('');
      this.LienEntryform.controls['pFdaccountno'].setValue('');
      this.LienEntryformErrorMessages.pMemberid = '';
    }

  }
  FdCreationChange(event) {
    debugger;
    this.ShowFixeddepositdetails = false;
    this.ShowRecenttransaction = false;
    this.disabledforButtons = true;
    this.Depositamount = 0.00;
    this.BalanceAmount = 0.00;
    this.asonAmount = 0.00;
    if (!isNullOrUndefined(event)) {
      this.ClearFd = false;
      this.IsFddetailsview = true;

      let MemberId = this.LienEntryform.controls.pMemberid.value;
      this.LienEntryform.controls.pFdaccoutid.setValue(event.pFdacctid)


      this.LienEntryform.controls.pLienamount.setValue('');
      this.LienEntryformErrorMessages.pLienamount = "";
      this._FdReceiptService.GetFdDetailsById(event.pFdaccountno, event.pFdacctid).subscribe(json => {
        debugger;
        console.log('this is transaction details:', json);

        this.ShowFixeddepositdetails = true;
        this.ShowRecenttransaction = false;
        this.disabledforButtons = false;
        if (json) {

          this.Fdaccountno = json[0].pFdaccountno;
          this.Membername = json[0].pMembername;
          this.Depositamount = json[0].pDeposiamount;
          this.Maturityamount = json[0].pMaturityamount;
          this.DepositDate = json[0].pDeposidate;
          this.MaturityDate = json[0].pMaturitydate;
          this.Tenortype = json[0].pTenortype;
          this.Tenor = json[0].pTenor;
          this.Interesttype = json[0].pInteresttype;
          this.Interestrate = json[0].pInterestrate;
          this.InterestPayble = json[0].pInterestPayble;
          this.InterestPayout = json[0].pInterestPayout;
          this.TransDate = json[0].pTransdate;
          this.ReceivedAmount = json[0].pClearedmount;
          this.TotalBalanceAmount = json[0].pBalanceamount;
          this.companyName = json[0].pCompanyName;
          this.pAddress = json[0].pAddress;

          if (this.InterestPayout == 'On Maturity') {
            this.maturityType = 'Maturity'
          }
          if (this.InterestPayout == 'Monthly') {
            this.maturityType = 'Pre-Maturity'
          }
          this.GetMaturityDetails(event.pFdaccountno, this.datePipe.transform(new Date, "yyyy-MM-dd"), 'Pre-Maturity', 'FD', event.pFdacctid);

        }
      })
      this._LienEntryService.GetMemberFdDetails(MemberId, event.pFdaccountno).subscribe(result => {
        debugger;
        this.LienEntryform.controls.pFdaccountno.setValue(event.pFdaccountno);
        if (result) {
          this.MemberFdDetails = result;
          console.log('this is member details:', this.MemberFdDetails);

          //this.TransDate = this.datePipe.transform(this.MemberFdDetails.pTransdate, "dd-MMM-yyyy");
          //   this.Membername = this.MemberFdDetails.pMembername;
          this.Amount = this.MemberFdDetails.pDepositamount;
          //this.Fdaccountno = this.MemberFdDetails.pFdaccountno;
          // this.Tenor = this.MemberFdDetails.pTenor;
          //this.Tenortype = this.MemberFdDetails.pTenortype;
          this.BalanceAmount = parseFloat(this.LienAmount) + parseFloat(this.MemberFdDetails.pBalance);
        }
      })
      this._LienEntryService.GetLiendata(event.pFdaccountno).subscribe(result => {
        debugger;
        if (result) {
          this.LienEntryDataonFdaccount = result;
        }
      })
    }

  }
  LienAmountChange(event) {
    debugger;

    if (event.target.value != "") {
      let Amount = parseFloat(event.target.value.toString().replace(/,/g, ""));
      if (Amount > this.BalanceAmount) {
        this._commonservice.showWarningMessage("The Amount Should be in Less than " + this.BalanceAmount);
        this.LienEntryform.controls.pLienamount.setValue('');
      }
    }
  }
  GetToBranchDetails() {
    // this._LienEntryService.GetBranchDetails1().subscribe(result => {
    //   this.ToBranchDetails = result;

    // })

    this._SelfOrAdjustmentservice.getEasyChitBranchCao().subscribe(res => {
      this.ToBranchDetails = res;
      console.log('thi is cao data:', this.ToBranchDetails);

    })
  }
  toBranchChange(event) {
    debugger;
    this.LienEntryform.controls.pCompanyname.setValue(event.pCompanyname);
    this.companyNameDisplay = this.LienEntryform.controls.pCompanyname.value;

     this.LienEntryform.controls.pLienadjuestto.setValue('');
    this._SelfOrAdjustmentservice.getChitGroupCode(event.pbranchname).subscribe(res => {
      this.groupcodeticketDetails = res;
      console.log('this is adjust data based on cao:', this.groupcodeticketDetails)
    })
  }

// adjustChange(event) {
//   debugger;
//   if (event) {
//     let groupcode = event.pgroupcodeticketno;
//     this.LienEntryform.controls.pLienadjuestto.setValue(groupcode);
//   }
// }
  GetBranchDetails() {
    this._LienEntryService.GetFDBranchDetails().subscribe(result => {
      this.BranchDetails = result;

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
  SaveLienEntry() {

    let isValid: boolean = true;


    if (this.checkValidations(this.LienEntryform, isValid)) {

      let lienAmount = this.LienEntryform.controls.pLienamount.value;
      if (lienAmount == 0) {
        this.LienEntryform.controls.pLienamount.setValue('');
      }
      // if(this.checkValidations(this.LienEntryform,isValid)){

      let formdata = this.LienEntryform.value;

      debugger;
      let Jsondata = JSON.stringify(formdata);
      this._LienEntryService.SaveLienEntry1(Jsondata).subscribe(res => {

        if (res['iSsaved']) {
          debugger;
          this._commonservice.showInfoMessage("Saved Successfully");
          // this.toastr.success("Saved Successfully");
          this.router.navigateByUrl("/LienEntryView");
          debugger;
          //   let date = this.datePipe.transform(this.LienEntryform['controls']['pLiendate'].value, "dd-MMM-yyyy");
          //   let branch = this.LienEntryform.controls.pBranchname.value;         
          //   let member = this.Membername;
          //   let fdaccount = this.Fdaccountno;
          //   let amount = this._commonservice.currencyformat(parseFloat(this.Depositamount).toFixed(2));
          //   let adjustto = this.LienEntryform['controls']['pLienadjuestto'].value;
          //  let lienamount = this._commonservice.currencyformat(this.LienEntryform['controls']['pLienamount'].value);
          //  let companyName = this.companyName;
          //  let pAddress = this.pAddress;
          //  let pCompanybranch = this.LienEntryform.controls.pCompanybranch.value;

          //  let lienamount = this.LienEntryform['controls']['pLienamount'].value;
          // console.log("")

          // this.selectedvalues += date + '@' + branch + '@' + member +  '@' + fdaccount + '@' + amount + '@' + adjustto + ' @' + lienamount + '@' + companyName + '@' + pAddress + '@' +  pCompanybranch;
          // let receipt = btoa(this.selectedvalues);
          let receipt = btoa(res['pLienid'] + ',' + 'lienEntry');

          window.open('/#/LienEntryPreview?id=' + receipt);
          this.LienEntryform.reset();
        }
      },
        err => {
          // this.loading = false;
          this._commonservice.showErrorMessage("Error while saving");
        }
      );
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
          this.LienEntryformErrorMessages[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {

            let errormessage;

            for (const errorkey in formcontrol.errors) {
              if (errorkey) {

                let lablename;

                lablename = (document.getElementById(key) as HTMLInputElement).title;
                errormessage = this._commonservice.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.LienEntryformErrorMessages[key] += errormessage + ' ';
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
  BindData() {
    debugger;
    let EditData = this._LienEntryService.GetLienEntryDataForEdit();
    console.log('this is edittttt data:', EditData);

    this.LienAmount = EditData.pLienamount;
    this.BranchChange(({ pBranchname: EditData.pBranchname }));
    this.LienEntryform.controls.pBranchname.setValue(EditData.pBranchname),
      this.MemberChange({ pMembertypeId: EditData.pMemberId, pMemberReferenceId: EditData.pMemberCode })
    this.LienEntryform.controls.pMemberid.setValue(EditData.pMemberId);
    this.FdCreationChange({ pFdacctid: EditData.pFdAccountid, pFdaccountno: EditData.pFdaccountno })
    this.LienEntryform.patchValue({
      pLienid: EditData.pLienid,
      pLiendate: new Date(EditData.pLienDate),
      pCompanybranch: EditData.pTobranch,
      pFdaccountno: EditData.pFdaccountno,
      pFdacctid: EditData.pFdAccountid,
      pLienadjuestto: EditData.pLienadjuestto,
      pLienamount: this._commonservice.currencyformat(EditData.pLienamount),
      pMembercode: EditData.pMemberCode,
      ptypeofoperation: 'UPDATE'
    })


  }
  back() {
    debugger;
    this.router.navigate(['/LienEntryView']);
  }
  ClearLienEntryDetails() {

    this.MemberDetailsListAll = [];
    this.FddetaisList = [];
    //this.ToBranchDetails = [];
    this.LienEntryform.controls.pBranchname.setValue(null);
    this.LienEntryform.controls.pMemberid.setValue(null);
    this.LienEntryform.controls.pFdacctid.setValue(null);
    this.LienEntryform.controls.pCompanybranch.setValue(null);
    this.LienEntryform.controls.pLienadjuestto.setValue('');
    this.LienEntryform.controls.pLienamount.setValue('');
    this.Depositamount = 0;
    this.BalanceAmount = 0;
    this.asonAmount = 0.00;
    this.ShowFixeddepositdetails = false;
    this.ShowRecenttransaction = false;
    this.disabledforButtons = true;
    this.LienEntryformErrorMessages.pBranchname = "";
    this.LienEntryformErrorMessages.pMemberid = "";
    this.LienEntryformErrorMessages.pFdacctid = "";
    this.LienEntryformErrorMessages.pCompanybranch = "";
    this.LienEntryformErrorMessages.pLienadjuestto = "";
    this.LienEntryformErrorMessages.pLienamount = "";

    this.groupcodeticketDetails = [];
    this.companyNameDisplay = '';

  }
  GetMaturityDetails(paccountno, Transdate, MaturityType, Deposittype, paccountid) {
    debugger;
    this._MaturityPaymentService.GetMaturityDetails(paccountno, Transdate, MaturityType, Deposittype, paccountid,).subscribe(ress => {
      this.MaturityDetails = ress;
      console.log('this is maturity dateils:', this.MaturityDetails);

      this.asonAmount = this.MaturityDetails.pNetpay + this.MaturityDetails.pPromotorsalary;
      console.log(this.asonAmount);
      //bhargavi
      this.depositeamount = this.MaturityDetails.pBondamount;
      console.log('this is bond amount:', this.depositeamount);


      // original 
      // if (this.InterestPayout == 'On Maturity') {
      //   let ason = this.asonAmount;
      //   let percentage = 0.10;
      //   let totalLienAmount = this.LienEntryDataonFdaccount.reduce((sum, c) => sum + parseFloat((c.pLienamount)), 0);
      //   let eligibleAmount = ason * percentage;
      //   let amountToDeduct = ason - eligibleAmount;
      //   this.BalanceAmount =  Math.round(amountToDeduct - totalLienAmount);
      //   console.log('this is balance amount for eligible onmaturity:',this.BalanceAmount);

      //   // console.log(this.BalanceAmount);
      // }
      //b
      if (this.InterestPayout == 'On Maturity') {
        let bondamt = this.depositeamount;
        let percentage = 0.10;
        
        let totalLienAmount = this.LienEntryDataonFdaccount.reduce((sum, c) => sum + parseFloat((c.pLienamount)), 0);
        let eligibleAmount = bondamt * percentage;
        let amountToDeduct = bondamt - eligibleAmount;
        this.BalanceAmount = Math.round(amountToDeduct - totalLienAmount);
        console.log('this is balance amount for eligible onmaturity:', this.BalanceAmount);
      }
      //bhargavi
      if (this.InterestPayout == 'Monthly') {
        let ason = this.asonAmount;
        let percentage = 0.20;

        let totalLienAmount = this.LienEntryDataonFdaccount.reduce((sum, c) => sum + parseFloat((c.pLienamount)), 0);
        let eligibleAmount = ason * percentage;
        let amountToDeduct = ason - eligibleAmount;
        this.BalanceAmount = Math.round(amountToDeduct - totalLienAmount);
        console.log('this is balance amount for eligible monthly:', this.BalanceAmount);
      }


    });
  }
}
