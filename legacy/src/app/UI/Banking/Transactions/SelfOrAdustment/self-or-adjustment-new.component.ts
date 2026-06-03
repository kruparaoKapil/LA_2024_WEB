import { Component, OnInit, NgZone, DebugElement } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../../../Services/common.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { SelfAdjustmentService } from '../../../../Services/Banking/Transactions/self-adjustment.service';
import { LienEntryService } from 'src/app/Services/Banking/lien-entry.service';
import { FdReceiptService } from 'src/app/Services/Banking/Transactions/fd-receipt.service';
import { IfStmt } from '@angular/compiler';
import { isNullOrUndefined } from '@swimlane/ngx-datatable';
import { T } from '@angular/cdk/keycodes';
declare let $: any
@Component({
  selector: 'app-self-or-adjustment-new',
  templateUrl: './self-or-adjustment-new.component.html',
  styles: []
})
export class SelfOrAdjustmentNewComponent implements OnInit {
  public transdate: Date = new Date();
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public depositdateConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  SelforAdjustmentForm: FormGroup
  public hdnTranDate = true;
  isLoading = true;

  constructor(private fb: FormBuilder, private _CommonService: CommonService, private zone: NgZone, private router: Router,
    private _SelfOrAdjustmentservice: SelfAdjustmentService, private _LienEntryService: LienEntryService, private _FdReceiptService: FdReceiptService, private _route: ActivatedRoute) {
    this.dpConfig.dateInputFormat = 'DD/MM/YYYY'
    this.dpConfig.minDate = new Date();
    this.dpConfig.maxDate = new Date();
    this.dpConfig.showWeekNumbers = false;

    window['CallingFunctionOutsideMemberData'] = {
      zone: this.zone,
      componentFn: (value) => this.MemberChanges(value),
      component: this,
    };
    window['CallingFunctionOutsideFdAccountData'] = {
      zone: this.zone,
      componentFn: (value) => this.fdChanges(value),
      component: this,
    };
    window['CallingFunctionToHideCard'] = {
      zone: this.zone,
      componentFn: () => this.HideCard(),
      component: this,
    };
    window['CallingFunctionToHidefDCard'] = {
      zone: this.zone,
      componentFn: () => this.HideFDCard(),
      component: this,
    };
  }

  showself: boolean = false;
  showAdjustment: boolean = false;
  showSelfForEdit: boolean = true;
  showAdjustmentForEdit: boolean = true;
  SchemeNames: any = []
  BranchDetails: any = [];
  fdaccountid: any;
  contactid: any;
  buttontype: any;
  Branchname: any;
  Schemeid: any;
  Memberchangeflag: boolean = false
  Fdchangeflag: boolean = false;
  ShowFixeddepositdetails: boolean = false;
  Memberid: any;
  memberdetails: any = [];
  SelfAdjustmentErrors: any
  Fdaccountdetails: any = []
  companydetails: any = []
  Datatobind: any;
  BranchdetailsAdjustment: any = []


  public FdDetailsListByid: any;
  public Fdaccountno: any;
  public Membername: any;
  public Deposiamount: any;
  public Maturityamount: any;
  public Tenortype: any;
  public Tenor: any;
  public Interesttype: any;
  public Interestrate: any;
  public InterestPayble: any;
  public InterestPayout: any;
  public MemberType: any;
  public Depositamount: any;
  public TransDate: any;
  public DepositDate: any;
  public MaturityDate: any;
  public TotalAmount: any = 0;
  public ReceivedAmount: any;
  public BalanceAmount: any = 0;
  public PendingChequeAmount: any = 0;
  disabledforButtons: boolean = true;

  buttonName: any = 'Save';
  caoDetails: any = [];
  easyChitBranchDetails: any = [];
  adjustToDetails: any = [];
  public globalBanksList: any = [];
 branchnamedata:any=[];

  ngOnInit() {

    debugger;
    this.Formgroup()
    this.SelfAdjustmentErrors = {}
    this.showself = true;

    this.buttontype = 'new';

    // this.GetBankDetails()
    this.GetGlobalBanks();
    this.GetBranchDetails()
    this.buttontype = this._SelfOrAdjustmentservice.Newstatus()
    this.SelforAdjustmentForm.controls.pPaymenttype.setValue('SELF');


    this.selfvalidation('GET')
    // if (this.buttontype == "edit") {
    //   debugger
    //   this.Datatobind = this._SelfOrAdjustmentservice._GetEditdetails()
    //   console.log("data to bind", this.Datatobind);
    //   this.EditData()

    // }


    if (this._route.snapshot.params['id']) {
      this.buttontype = "edit";
      if (this.buttontype == "edit") {
        this.Datatobind = [];
        this.Datatobind = this._SelfOrAdjustmentservice._GetEditdetails()
        this.EditData()
      }
    }

    // this.SelforAdjustmentForm.controls.pPaymenttype.setValue(self)
    this.BlurEventAllControll(this.SelforAdjustmentForm)
    this.getEasyChitBranchCao();
    this.getEasyChitBranch();
  }

  Formgroup() {
    this.SelforAdjustmentForm = this.fb.group({
      pTransdate: [new Date()],
      pRecordid: [0],
      pSchemeName: [null, Validators.required],
      pCompnayname: [''],
      fdtranscationradio: [''],
      pBranchname: [''],
      pMemberid: ['', Validators.required],
      pFdaccountid: ['', Validators.required],
      pGroupcodeticketno: [''],
      //bstart
      // pSubscriber: [''],
      psubscribername: [''],
      //bend
      pChitpersonname: [''],
      pPaymenttype: ["SELF"],
      pBankname: [''],
      pBankbranch: [''],
      pBankaccountno: [''],
      pIfsccode: [''],
      branch: [null, Validators.required],
      pCreatdby: [this._CommonService.pCreatedby],
      chitbranchname: [''],
      // pCao: [''],

    })
  }

  //bhargavi start

  adjustChange(event) {
    debugger;
    this.SelforAdjustmentForm.controls.psubscribername.setValue('');
    let sbscibename=event.psubscribername;
    this.SelforAdjustmentForm.controls.psubscribername.setValue(sbscibename);

  }

  //bhargavi end
  getSchemeNames(Branchname) {
    this._SelfOrAdjustmentservice.GetSchemeNames(Branchname).subscribe(res => {
      this.SchemeNames = res
      console.log('this is scheme data:',this.SchemeNames);
      
    })
  }
  GetBranchDetails() {
    this._SelfOrAdjustmentservice.GetFDBranchDetails().subscribe(result => {
      this.BranchDetails = result;
    })
  }
  schemetypechanges(event) {
    debugger

    this.memberdetails = [];
    this.Fdaccountdetails = [];
    this.ShowFixeddepositdetails = false
    this.SelforAdjustmentForm.controls.pMemberid.setValue(null);
    this.SelforAdjustmentForm.controls.pFdaccountid.setValue(null);
    this.SelfAdjustmentErrors.pMemberid = "";
    this.SelfAdjustmentErrors.pFdaccountid = "";
    this.Schemeid = event.pSchemeid;
    if (!isNullOrUndefined(event)) {
      this._SelfOrAdjustmentservice.GetMembers(this.Branchname, event.pSchemeid).subscribe(res => {
        debugger
        this.memberdetails = res;

      })
    }
  }
  GetCompanyAdjustment() {
    this._SelfOrAdjustmentservice.GetCompanyAdjustment().subscribe(json => {
      this.companydetails = json;


    })
  }
  companynamechange(event) {
    debugger;
    if (event != undefined) {
      this.SelforAdjustmentForm.controls.pBranchname.setValue("");
      this.SelfAdjustmentErrors = {}
      this._SelfOrAdjustmentservice.GetBranchAdjustment(event.pcompanyname).subscribe(json => {
        this.BranchdetailsAdjustment = json;
        console.log(this.BranchdetailsAdjustment);
      })
    }

  }
  getEasyChitBranchCao() {
    debugger;
    this._SelfOrAdjustmentservice.getEasyChitBranchCao().subscribe(res => {
      this.caoDetails = res;
      console.log('thi is cao data:', this.caoDetails);

    })
  }
  //bhargavi start
  caoChange(event) {
    debugger;
     
    this.SelforAdjustmentForm.controls.pGroupcodeticketno.setValue('');
    this.SelforAdjustmentForm.controls.psubscribername.setValue('');
    this.SelfAdjustmentErrors.pGroupcodeticketno = '';
    this._SelfOrAdjustmentservice.getChitGroupCode(event.pbranchname).subscribe(res => {
      this.adjustToDetails = res;
      console.log('this is adjust data based on cao:', this.adjustToDetails)
      this.isLoading = false;
    })

  }

  //bhargavi end

  getEasyChitBranch() {
    debugger;
    this._SelfOrAdjustmentservice.getEasyChitBranch().subscribe(res => {
      this.easyChitBranchDetails = res;
      console.log('this is kmss data:', this.easyChitBranchDetails)
    })
  }
  MemberChanges(event) {
    debugger;
    this.SelforAdjustmentForm.controls.pBankname.setValue("")
    this.SelforAdjustmentForm.controls.pBankaccountno.setValue("")
    this.SelforAdjustmentForm.controls.pBankbranch.setValue("")
    this.SelforAdjustmentForm.controls.pIfsccode.setValue("");
    this.Fdaccountdetails = [];
    this.ShowFixeddepositdetails = false
    this.SelforAdjustmentForm.controls.pFdaccountid.setValue(null);
    this.SelfAdjustmentErrors.pFdaccountid = "";
    this.SelfAdjustmentErrors = {}
    if (!isNullOrUndefined(event)) {
      this.Memberid = event.pMemberid;
      this.contactid = event.pContactid;
      //this.SelforAdjustmentForm.controls.pMemberid.setValue(event.pMemberid);
      this.GetBankDetails()
      this.Memberchangeflag = true
      this._SelfOrAdjustmentservice.GetFdAccNumbers(this.Branchname, this.Memberid, this.Schemeid).subscribe(json => {
        debugger

        this.Memberchangeflag = false
        this.Fdaccountdetails = json;
      })
    }
  }
  GetBankDetails() {
    debugger;
    if (this.contactid != undefined && this.contactid != null) {
      this._SelfOrAdjustmentservice.GetBankDetailsForSelf(this.contactid).subscribe(json => {
        debugger;
        console.log("bankdetails", json[0]);
        if (!isNullOrUndefined(json[0])) {
          this.SelforAdjustmentForm.controls.pBankname.setValue(json[0].pBankname)
          this.SelforAdjustmentForm.controls.pBankaccountno.setValue(json[0].pAccountno)
          this.SelforAdjustmentForm.controls.pBankbranch.setValue(json[0].pBranhname)
          this.SelforAdjustmentForm.controls.pIfsccode.setValue(json[0].pIfsccode)

        }
      })
    }



  }
  fdChanges(event) {
    debugger

    this.fdaccountid = event.pFdaccountid
    //this.SelforAdjustmentForm.controls.pFdaccountid.setValue(this.fdaccountid)
    this.Fdchangeflag = true
    this._FdReceiptService.GetFdDetailsById(event.pFdaccountnumber, this.fdaccountid).subscribe(result => {
      debugger;
      this.ShowFixeddepositdetails = true;
      this.disabledforButtons = false;
      if (result) {

        this.FdDetailsListByid = result;
        this.Fdaccountno = this.FdDetailsListByid[0].pFdaccountno;
        this.Membername = this.FdDetailsListByid[0].pMembername;
        this.Deposiamount = this.FdDetailsListByid[0].pDeposiamount;
        this.Maturityamount = this.FdDetailsListByid[0].pMaturityamount;
        this.Tenortype = this.FdDetailsListByid[0].pTenortype;
        this.Tenor = this.FdDetailsListByid[0].pTenor;
        this.Interesttype = this.FdDetailsListByid[0].pInteresttype;
        this.Interestrate = this.FdDetailsListByid[0].pInterestrate;
        this.InterestPayble = this.FdDetailsListByid[0].pInterestPayble;
        this.InterestPayout = this.FdDetailsListByid[0].pInterestPayout;
        this.Depositamount = this.FdDetailsListByid[0].pDeposiamount;
        this.DepositDate = this.FdDetailsListByid[0].pDeposidate;
        this.MaturityDate = this.FdDetailsListByid[0].pMaturitydate;
        this.TransDate = this.FdDetailsListByid[0].pTransdate;
        this.TotalAmount = this.FdDetailsListByid[0].pDeposiamount;
        this.ReceivedAmount = this.FdDetailsListByid[0].pClearedmount;
        this.BalanceAmount = this.FdDetailsListByid[0].pBalanceamount;
        this.PendingChequeAmount = this.FdDetailsListByid[0].pPendingchequeamount;

      }
    })
  }
  HideCard() {
    debugger
    if (!this.Memberchangeflag) {
      if (this.SelforAdjustmentForm.controls['pMemberid'].value) {
        this.SelforAdjustmentForm.controls['pMemberid'].setValue('');

      }
    }
    else {
      this.Memberchangeflag = false;
    }

  }
  HideFDCard() {
    debugger
    if (!this.Fdchangeflag) {
      if (this.SelforAdjustmentForm.controls['pFdaccountid'].value) {
        this.SelforAdjustmentForm.controls['pFdaccountid'].setValue('');

      }
    }
    else {
      this.Fdchangeflag = false
    }
  }
  Radiobuttonchecked(event, type) {
    debugger
    if (event.target.checked == true && type == 'SELF') {
      this.SelforAdjustmentForm.controls.chitbranchname.setValue(''),
        this.showself = true;
      this.GetBankDetails()
      this.showAdjustment = false;
      this.SelforAdjustmentForm.controls.pPaymenttype.setValue(type);
      this.selfvalidation('GET');
      this.SelforAdjustmentForm.controls.psubscribername.setValue('');
      this.clearonradiobutton()

    }
    else if (event.target.checked == true && type == 'ADJUSTMENT') {
      this.showself = false;
      this.showAdjustment = true;
      this.SelforAdjustmentForm.controls.pPaymenttype.setValue(type)

      this.AdjustmentValidation('GET')
      this.GetCompanyAdjustment()
      this.clearonradiobutton()
    }
  }
  clearonradiobutton() {
    this.SelforAdjustmentForm.patchValue({
      pCompnayname: '',
      pBranchname: '',
      pChitpersonname: '',
      pGroupcodeticketno: '',
      pBankaccountno: '',
      pBankbranch: '',
      pBankname: '',
      pIfsccode: ''
    })
    this.SelfAdjustmentErrors = {}
    this.buttontype = 'new';
  }
  AdjustmentValidation(type) {
    let pCompnayname = <FormGroup>this.SelforAdjustmentForm['controls']['pCompnayname'];
    let pBranchname = <FormGroup>this.SelforAdjustmentForm['controls']['pBranchname'];
    let pChitpersonname = <FormGroup>this.SelforAdjustmentForm['controls']['pChitpersonname'];
    let pGroupcodeticketno = <FormGroup>this.SelforAdjustmentForm['controls']['pGroupcodeticketno'];
    if (type == 'GET') {
      pCompnayname.setValidators(Validators.required)
      pBranchname.setValidators(Validators.required)
      pChitpersonname.setValidators(Validators.required)
      pGroupcodeticketno.setValidators(Validators.required)
    }
    else {
      pCompnayname.clearValidators()
      pBranchname.clearValidators()
      pChitpersonname.clearValidators()
      pGroupcodeticketno.clearValidators()
    }
    pCompnayname.updateValueAndValidity();
    pBranchname.updateValueAndValidity();
    pChitpersonname.updateValueAndValidity()
    pGroupcodeticketno.updateValueAndValidity()

  }
  selfvalidation(type) {
    let pBankname = <FormGroup>this.SelforAdjustmentForm['controls']['pBankname'];
    let pBankbranch = <FormGroup>this.SelforAdjustmentForm['controls']['pBankbranch'];
    let pBankaccountno = <FormGroup>this.SelforAdjustmentForm['controls']['pBankaccountno'];
    let pIfsccode = <FormGroup>this.SelforAdjustmentForm['controls']['pIfsccode'];
    if (type == 'GET') {
      pBankname.setValidators(Validators.required)
      pBankbranch.setValidators(Validators.required)
      pBankaccountno.setValidators(Validators.required)
      pIfsccode.setValidators(Validators.required)
    }
    else {
      pBankname.clearValidators()
      pBankbranch.clearValidators()
      pBankaccountno.clearValidators()
      pIfsccode.clearValidators()
    }
    pBankname.updateValueAndValidity();
    pBankbranch.updateValueAndValidity();
    pBankaccountno.updateValueAndValidity()
    pIfsccode.updateValueAndValidity()

  }
  BranchChange(event) {
    debugger
    this.SchemeNames = [];
    this.memberdetails = [];
    this.Fdaccountdetails = [];
    this.clearonradiobutton()
    this.ShowFixeddepositdetails = false;
    this.SelforAdjustmentForm.controls.pSchemeName.setValue(null);
    this.SelforAdjustmentForm.controls.pMemberid.setValue(null);
    this.SelforAdjustmentForm.controls.pFdaccountid.setValue(null);
    this.SelfAdjustmentErrors.pSchemeName = "";
    this.SelfAdjustmentErrors.pMemberid = "";
    this.SelfAdjustmentErrors.pFdaccountid = "";
    if (!isNullOrUndefined(event)) {
      this.Branchname = event.pBranchname;
      //this.SelforAdjustmentForm.controls.pSchemeName.setValue('SALE ADVANCE-HRB')
      this.getSchemeNames(this.Branchname);

      //this._SelfOrAdjustmentservice.GetMembers(this.Branchname).subscribe(res=>
      //  {
      //    debugger
      //  this.memberdetails = res;     
      //  $("#MemberData").kendoMultiColumnComboBox({
      //    dataTextField: "pMembername",
      //    dataValueField: "pMemberid",
      //    height: 400,
      //    columns: [
      //      { field: "pMembername", title: "Member Name", width: 200},
      //      { field: "pMembercode", title: "Member code", width: 200 },
      //      { field: "pMobileno", title: "Contact No", width: 200 },

      //    ],
      //    filter: "contains",
      //    filterFields: ["pMembername", "pMemberid", "pMobileno"],
      //    dataSource: this.memberdetails,
      //    select: this.SelectMemberData,
      //   change: this.CancelClick
      //  });
      //})

    }

  }
  EditData() {
    debugger

    this.buttonName = 'Update';


    $("#pSchemeName").prop("disabled", true);



    this.SelforAdjustmentForm.controls.pTransdate.setValue(new Date(this.Datatobind[0].pTransdate));
    this.SelforAdjustmentForm.controls.pRecordid.setValue(this.Datatobind[0].pRecordid)
    this.SelforAdjustmentForm.controls.pPaymenttype.setValue(this.Datatobind[0].pPaymenttype);
    this.SelforAdjustmentForm.controls.branch.setValue(this.Datatobind[0].branch);
    this.SelforAdjustmentForm.controls.pSchemeName.setValue(this.Datatobind[0].pfdname);

    this._SelfOrAdjustmentservice.GetMembers(this.Datatobind[0].branch, this.Datatobind[0].pfdconfigid).subscribe(res => {
      debugger
      this.memberdetails = res;

    })
    this.SelforAdjustmentForm.controls.pMemberid.setValue(this.Datatobind[0].pMemberName);
    this.SelforAdjustmentForm.controls.pFdaccountid.setValue(this.Datatobind[0].pFdAccountno);

    this._SelfOrAdjustmentservice.GetFdAccNumbers(this.Datatobind[0].branch, this.Datatobind[0].pMemberid, this.Datatobind[0].pfdconfigid).subscribe(json => {
      debugger

      // this.Memberchangeflag = false
      this.Fdaccountdetails = json;
    })

    if (this.Datatobind[0].pPaymenttype == 'SELF') {
      this.showself = true;
      this.showAdjustment = false;
      this.showSelfForEdit = true;
      this.showAdjustmentForEdit = false;
      this.SelforAdjustmentForm.controls.pBankname.setValue(this.Datatobind[0].pBankname)
      this.SelforAdjustmentForm.controls.pBankbranch.setValue(this.Datatobind[0].pBankbranch)
      this.SelforAdjustmentForm.controls.pBankaccountno.setValue(this.Datatobind[0].pBankaccountno)
      this.SelforAdjustmentForm.controls.pIfsccode.setValue(this.Datatobind[0].pIfsccode)
      //this.SelforAdjustmentForm.controls.pbranchname.setValue(this.Datatobind[0].pbranchname)
    }
    else {
      this.showself = false;
      this.showAdjustment = true;
      this.showSelfForEdit = false;
      this.showAdjustmentForEdit = true;
      //this.SelforAdjustmentForm.controls.pBranchname.setValue(this.Datatobind[0].pBranchname)
      this.SelforAdjustmentForm.controls.pBranchname.setValue(this.Datatobind[0].branch)
      this.SelforAdjustmentForm.controls.chitbranchname.setValue(this.Datatobind[0].chitbranchname)
      this.SelforAdjustmentForm.controls.pCompnayname.setValue(this.Datatobind[0].pCompnayname)
      this.SelforAdjustmentForm.controls.pChitpersonname.setValue(this.Datatobind[0].pChitpersonname)
      this._SelfOrAdjustmentservice.getChitGroupCode(this.Datatobind[0].branch).subscribe(res => {
        this.adjustToDetails = res;
        console.log('this is load adjust data:', this.adjustToDetails)
        this.isLoading = false;
      })
      this.SelforAdjustmentForm.controls.pGroupcodeticketno.setValue(this.Datatobind[0].pGroupcodeticketno)
      this.GetCompanyAdjustment();

      this._SelfOrAdjustmentservice.GetBranchAdjustment(this.Datatobind[0].pCompnayname).subscribe(json => {
        this.BranchdetailsAdjustment = json;
        console.log(this.BranchdetailsAdjustment);
      })
    }




  }
  checkValidations(group: FormGroup, isValid: boolean): boolean {
    debugger
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
          this.SelfAdjustmentErrors[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.SelfAdjustmentErrors[key] += errormessage + ' ';
                isValid = false;
              }
            }
          }
        }
      }
    }
    catch (e) {
      // this.showErrorMessage(e);
      // return false;
    }
    return isValid;
  }
  showErrorMessage(errormsg: string) {
    this._CommonService.showErrorMessage(errormsg);
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

  SelectMemberData(e) {
    debugger
    if (e.dataItem) {
      var dataItem = e.dataItem;
      window['CallingFunctionOutsideMemberData'].componentFn(dataItem)

    }
  }
  SelectFdAccuntData(e) {
    if (e.dataItem) {
      var dataItem = e.dataItem;
      window['CallingFunctionOutsideFdAccountData'].componentFn(dataItem)

    }
  }
  CancelClick() {
    debugger
    window['CallingFunctionToHideCard'].componentFn()
  }
  CancelfDClick() {
    window['CallingFunctionToHidefDCard'].componentFn()
  }
  back() {
    debugger;
    this.router.navigate(['/SelfOrAdjustmentView']);
  }
  SaveForm() {
    debugger
    let isValid = true;
    if (this.SelforAdjustmentForm.controls.pRecordid.value == 0) {
      this.SelforAdjustmentForm.controls.pMemberid.setValue(this.Memberid);
    }
    if (this.buttontype == "edit") {
      this.SelforAdjustmentForm.controls.pFdaccountid.setValue(this.Datatobind[0].pFdaccountid);

      this.SelforAdjustmentForm.controls.pMemberid.setValue(this.Datatobind[0].pMemberid);

      this.SelforAdjustmentForm.controls.branch.clearValidators();
      this.SelforAdjustmentForm.controls.branch.updateValueAndValidity();
    }

    if (this.buttontype == "new") {
      //this.SelforAdjustmentForm.controls.pFdaccountid.setValue(this.Datatobind[0].pFdaccountid);

      this.SelforAdjustmentForm.controls.pMemberid.setValue(this.Memberid);
      this.SelforAdjustmentForm.controls.pFdaccountid.setValue(this.fdaccountid);

    }



    if (this.checkValidations(this.SelforAdjustmentForm, isValid)) {
      let chitB = this.SelforAdjustmentForm.controls.pBranchname.value;
      //this.SelforAdjustmentForm.controls.chitbranchname.setValue(chitB);
      let data = JSON.stringify(this.SelforAdjustmentForm.value)
      console.log(data);
      this._SelfOrAdjustmentservice.SaveSelfOrAdjustment(data).subscribe(res => {

        debugger
        if (res) {


          if (this.buttontype == "new") {
            this._CommonService.showInfoMessage("Saved Sucessfully");
          }

          if (this.buttontype == "edit") {
            this._CommonService.showInfoMessage("Updated Sucessfully");
          }


          //this.Formgroup();
          this.showAdjustment = false;
          //this.showself=false;
          //this.BranchDetails=[];
          // this.SchemeNames=[];
          // this.SelforAdjustmentForm.controls.pPaymenttype.setValue("");
          this.clearonradiobutton();
          this.SelforAdjustmentForm.controls.pFdaccountid.setValue("");
          this.SelforAdjustmentForm.controls.pMemberid.setValue("");
          this.SelforAdjustmentForm.controls.branch.setValue("");
          this.SelforAdjustmentForm.controls.pSchemeName.setValue("");
          this.SelforAdjustmentForm.controls.pSchemeName.setValue("");
          this.SelforAdjustmentForm.controls.chitbranchname.setValue("");
          this.SelforAdjustmentForm.controls.psubscribername.setValue("");
          this.SelforAdjustmentForm.controls.pPaymenttype.setValue('SELF');
          this.showself = true;
          this.SelfAdjustmentErrors = {}

          this.showSelfForEdit = true;
          this.showAdjustmentForEdit = true;

        }
      })

    }

  }
  clear() {
    debugger
    this.Formgroup();

    this.SelforAdjustmentForm.controls.pPaymenttype.setValue('SELF');

    //  var multicolumncombobox1: any;
    //  multicolumncombobox1= $("#MemberData").data("kendoMultiColumnComboBox");
    //  if (multicolumncombobox1)
    //    multicolumncombobox1.value("");
    //    var multicolumncombobox2: any;
    //    multicolumncombobox2 = $("#FdAccount").data("kendoMultiColumnComboBox");
    //    if (multicolumncombobox2)
    //      multicolumncombobox2.value("");
    this.showAdjustment = false;
    this.showself = true;
  }

  DateChange(event: any) {
    debugger;
    event;
  }

    GetGlobalBanks() {
    debugger;
    this._CommonService.GetGlobalBankNames().subscribe(json => {
      debugger;
      this.globalBanksList = json;
    });
  }
    bankName_Change($event: any): void {
    debugger;
    this.SelforAdjustmentForm['controls']['pBankname'].setValue($event.pBankname);
    let bankname=$event.pBankname
    this._CommonService.GetBranchname(bankname).subscribe(res =>{
      this.branchnamedata=[];
      this.branchnamedata = res;
    })

 }
    branchnamesName_Change(event){
    debugger
    this.SelforAdjustmentForm['controls']['pIfsccode'].setValue(event.pIfsccode);
  }
}
