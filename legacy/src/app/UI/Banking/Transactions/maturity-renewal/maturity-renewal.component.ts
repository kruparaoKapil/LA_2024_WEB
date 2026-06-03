// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-maturity-renewal',
//   templateUrl: './maturity-renewal.component.html',
//   styles: []
// })
// export class MaturityRenewalComponent implements OnInit {

//   constructor() { }

//   ngOnInit() {
//   }

// }





import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../../../Services/common.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AccountingTransactionsService } from '../../../../Services/Accounting/accounting-transactions.service';
import { MaturityPaymentService } from '../../../../Services/Banking/Transactions/maturity-payment.service';
import { FdRdTransactionsService } from 'src/app/Services/Banking/Transactions/fd-rd-transactions.service';
import { isNullOrUndefined } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MaturityPaymentRenewalComponent } from '../Maturity Payment/maturity-payment-renewal.component';
//import { MaturityPaymentRenewalComponent } from './maturity-payment-renewal.component';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { FdReceiptService } from '../../../../Services/Banking/Transactions/fd-receipt.service';
import { DatePipe } from '@angular/common';
import { RdReceiptService } from 'src/app/Services/Banking/Transactions/rd-receipt.service';
import { CoJointmemberService } from 'src/app/Services/Common/co-jointmember.service';
import { RdTransactionsService } from 'src/app/Services/Banking/Transactions/rd-transactions.service';
import { CoReferralService } from 'src/app/Services/Common/co-referral.service';
declare let $: any;

@Component({
  selector: 'app-maturity-renewal',
  templateUrl: './maturity-renewal.component.html',
 styles: []
})
export class MaturityRenewalComponent implements OnInit {

  // ─── Child Component Reference ────────────────────────────────────────────────
  @ViewChild(MaturityPaymentRenewalComponent, { static: false })
  maturityPaymentRenewalComponent: MaturityPaymentRenewalComponent;

  // ─── Form ─────────────────────────────────────────────────────────────────────
  MaturityRenewalForm: FormGroup;
  formValidationMessages: any = {};


  // ─── Lists ────────────────────────────────────────────────────────────────────
  /** Only "Renewal" is available; Payment option is removed. */
  // PaymentTypeList: any[] = [{ PaymentType: 'Renewal' }];
  //MaturityMemberDetails: any[] = [];
   MaturityMemberDetails: any;
   PaymentTypeList: any[]=[];
  //FdDetailsList: any[] = [];
   public FdDetailsList: any;
  staticFDDetails: any[] = [];
  MaturityPaymentList: any[] = [];

  // ─── Flags ────────────────────────────────────────────────────────────────────
  ShowRenewalGrid: boolean = false;
  ShowRenewalFdTransaction: boolean = false;
  ShowRenewal: boolean = false;
  allRowsSelected: boolean = false;
  disablesavebutton: boolean = false;
  disabletransactiondate: boolean = false;
  showModal: boolean = false;

  // ─── UI State ─────────────────────────────────────────────────────────────────
  savebutton: string = 'Next';
  totalRenewalAmount: any = 0;
  Tabposition: number = 1;

  // ─── Session / User ───────────────────────────────────────────────────────────
  userDetails: any;
  userNameF: any;
  userIdF: any;

  // ─── Member event snapshot ────────────────────────────────────────────────────
  MemberEvent: any;

  // ─── Session tracking ────────────────────────────────────────────────────────
  currreferralStatus: any;
  currNomineeAndReferralStatus: any;

  // ─── Date picker config ───────────────────────────────────────────────────────
  public pMaturitypaymentdateConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();

  // ─── Constructor ──────────────────────────────────────────────────────────────
  constructor(
    private _FormBuilder: FormBuilder,
    private _commonService: CommonService,
    private toastr: ToastrService,
    private _AccountingTransactionsService: AccountingTransactionsService,
    private _MaturityPaymentService: MaturityPaymentService,
    private router: Router,
    private _fdrdttranscationservice: FdRdTransactionsService,
    private _FdReceiptService: FdReceiptService,
    private datePipe: DatePipe,
    private _CoJointmemberService: CoJointmemberService,
    private _rdttranscationservice: RdTransactionsService,
    public _CoReferralService: CoReferralService,
    private _RdReceiptService: RdReceiptService
  ) {
    this.pMaturitypaymentdateConfig.containerClass   = 'theme-dark-blue';
    this.pMaturitypaymentdateConfig.showWeekNumbers  = false;
    this.pMaturitypaymentdateConfig.maxDate           = new Date();
    this.pMaturitypaymentdateConfig.dateInputFormat   = 'DD/MM/YYYY';
  }

  ngOnInit(): void {
    if (this._commonService.comapnydetails != null) {
      this.disabletransactiondate = this._commonService.comapnydetails.pdatepickerenablestatus;
    }

    this.formValidationMessages = {};
    this.userDetails = JSON.parse(sessionStorage.getItem('Urc'));
    this.userNameF   = this.userDetails.pUserName;
    this.userIdF     = this.userDetails.pUserID;
    this.MaturityRenewalForm = this._FormBuilder.group({
      pnarration:            ['', Validators.required],
      pMemberid:             [null, Validators.required],
      pMembername:           [''],
      pBranch:               [''],
      pBranchId:             [''],
      pMaturitypaymentdate:  [new Date(), Validators.required],
      pPaymentType:          [null, Validators.required],  // will be auto-set to 'Renewal'
      pStatus:               [true],
      ppaymentid:            [''],
      ptotalpaidamount:      [''],
      pCreatedby:            [this._commonService.pCreatedby],
      pStatusname:           [this._commonService.pStatusname],
      ptypeofoperation:      [this._commonService.ptypeofoperation],
      pDocStorePath:         [''],
      pMaturityPaymentlist:  this.buildMaturityPaymentListGroup()
    });
     this.GetPaymentTypes();


    //this.MaturityRenewalForm.controls.pPaymentType.setValue('Renewal');


    //this.GetMaturityMembers('Renewal', 'FD');
    this.ShowRenewal          = true;
    this.ShowRenewalFdTransaction = false;

    // Notify joint-member service
    this._fdrdttranscationservice.Newformstatus('New');
    this.BlurEventAllControll(this.MaturityRenewalForm);
    this._CoJointmemberService._SetCoJointmembervalidation('unsuccess');
  }

   GetPaymentTypes() {
    this.PaymentTypeList = [{ PaymentType: 'Renewal' }];
  }

  buildMaturityPaymentListGroup(): FormGroup {
    return this._FormBuilder.group({
      pTransTypeid:       [''],
      pMaturityjvdate:    [''],
      pPaidAmount:        [0],
      pAccountno:         [0],
      pJvid:              0,
      pVoucherid:         0,
      pOutstandingAmount: [0],
      pLateFeeAmount:     [0]
    });
  }


  customSearchFn(term: string, item: any): boolean {
    term = term.toLowerCase();
    return (
      (item.pMembername  && item.pMembername.toLowerCase().includes(term)) ||
      (item.pMembercode  && item.pMembercode.toLowerCase().includes(term)) ||
      (item.pMobileno    && item.pMobileno.toString().includes(term))
    );
  }
  PaymentTypeChange(event: any): void {
    this.MaturityRenewalForm.controls.pMemberid.setValue(null);
    this.FdDetailsList        = [];
    this.staticFDDetails      = [];
    this.MaturityMemberDetails = [];
    this.formValidationMessages.pMemberid = '';
    this.ShowRenewalGrid          = false;
    this.ShowRenewalFdTransaction = false;
    this.allRowsSelected          = false;

    if (!isNullOrUndefined(event)) {
      this.ShowRenewal          = true;
      this.ShowRenewalFdTransaction = false;
      this.disablesavebutton    = false;
      // Deposit type is always FD for renewal
      this.GetMaturityMembers('Renewal', 'FD');
    } else {
      this.ShowRenewal = false;
    }
  }

  GetMaturityMembers(paymentType: string, depositType: string): void {
    this._MaturityPaymentService.GetMaturityMembers(paymentType, depositType).subscribe(result => {
      this.MaturityMemberDetails = result;
    });
  }
  MemberChange(event: any): void {
    this.FdDetailsList        = [];
    this.staticFDDetails      = [];
    this.MaturityPaymentList  = [];
    this.allRowsSelected      = false;

    if (!isNullOrUndefined(event)) {
      const paymentDate = this.MaturityRenewalForm.controls.pMaturitypaymentdate.value;

      this.MaturityRenewalForm.controls.pMembername.setValue(event.pMembername);
      this._CoJointmemberService._setfdMembercode(event.pMembercode, event.pMemberid);
      this._MaturityPaymentService.GetMaturityFdDetails('Renewal', event.pMemberid, this.datePipe.transform(new Date(paymentDate), 'yyyy-MM-dd'))
        .subscribe(result => {
          this.FdDetailsList   = result;
          this.staticFDDetails = this.FdDetailsList.map(x => ({ ...x }));
          this.FdDetailsList.forEach(df => {
            df.pStatus       = false;
            df.IsRenewal     = false;
            df.pRenewalAmount = '';
            df.Editable      = true;
            df.islatefee     = false;
          });
          this.ShowRenewalGrid = true;
        });

      this.MemberEvent = {
        pMemberId:      event.pMemberid,
        pMemberName:    event.pMembername,
        pMemberCode:    event.pMembercode,
        pContactid:     event.pContactid,
        pContactrefid:  event.pContactrefid,
        pMemberTypeid:  event.pMemberTypeid,
        pMemberType:    event.pMemberType
      };

      this.MaturityRenewalForm.controls.pBranch.setValue(event.pBranch);
      this.MaturityRenewalForm.controls.pBranchId.setValue(event.pBranchId);
    } else {
      this.MemberEvent = '';
    }
  }

  SelectMaturitybond(event: any, dataItem: any, rowIndex: number): void {
    if (event.target.checked) {
      this.FdDetailsList[rowIndex].pStatus       = true;
      this.FdDetailsList[rowIndex].IsRenewal     = true;
      this.FdDetailsList[rowIndex].islatefee     = false;
      this.FdDetailsList[rowIndex].Editable      = false;
      this.FdDetailsList[rowIndex].pRenewalAmount = '';
    } else {
      this.FdDetailsList[rowIndex].pStatus          = false;
      this.FdDetailsList[rowIndex].IsRenewal        = false;
      this.FdDetailsList[rowIndex].islatefee        = false;
      this.FdDetailsList[rowIndex].Editable         = true;
      this.FdDetailsList[rowIndex].pNetPayable      = this.staticFDDetails[rowIndex].pNetPayable;
      this.FdDetailsList[rowIndex].pLateFeeAmount   = this.staticFDDetails[rowIndex].pLateFeeAmount;
      this.FdDetailsList[rowIndex].pPending_Amount  = this.staticFDDetails[rowIndex].pPending_Amount;
      this.FdDetailsList[rowIndex].pRenewalAmount   = '';
    }
    this.recalcTotalRenewal();
  }

  selectAll(event: any): void {
    if (event.target.checked) {
      this.allRowsSelected = true;
      this.FdDetailsList.forEach(x => {
        x.pStatus   = true;
        x.IsRenewal = true;
        x.islatefee = false;
        x.Editable  = false;
      });
    } else {
      this.allRowsSelected = false;
      this.FdDetailsList = this.staticFDDetails.map(x => ({ ...x }));
      this.FdDetailsList.forEach(x => {
        x.pStatus        = false;
        x.IsRenewal      = false;
        x.islatefee      = false;
        x.Editable       = true;
        x.pRenewalAmount = '';
      });
    }
    this.recalcTotalRenewal();
  }
  checkRenewalAmount(event: any, rowIndex: number): void {
    const val = event.target.value;
    this.FdDetailsList[rowIndex].IsRenewal     = isNullOrEmptyString(val);
    this.FdDetailsList[rowIndex].pRenewalAmount = isNullOrEmptyString(val) ? '' : val;

    this.FdDetailsList = [...this.FdDetailsList];
  }
  ValidateRenewalAmount(event: any, dataItem: any, rowIndex: number): void {
    const entered = parseFloat(event.target.value.toString().replace(/,/g, ''));
    const pending  = parseFloat(dataItem.pPending_Amount);
    if (entered > pending) {
      this._commonService.showWarningMessage('Renewal Amount should not be greater than Pending Amount.');
      this.FdDetailsList[rowIndex].IsRenewal     = true;
      this.FdDetailsList[rowIndex].pRenewalAmount = '';
    } else {
      this.recalcTotalRenewal();
    }
  }
  private recalcTotalRenewal(): void {
    this.totalRenewalAmount = this.FdDetailsList.reduce((sum, c) => {
      const amt = isNullOrEmptyString(c.pRenewalAmount)
        ? 0
        : parseFloat(c.pRenewalAmount.toString().replace(/,/g, ''));
      return sum + (isNaN(amt) ? 0 : amt);
    }, 0);
  }
  AddRenewal(): void {
    const selected = this.FdDetailsList.filter(item => item.pStatus === true);
    if (selected.length === 0) {
      this._commonService.showWarningMessage('Please Select At Least One Checkbox');
      return;
    }

    const missingAmount = selected.filter(item => isNullOrEmptyString(item.pRenewalAmount));
    if (missingAmount.length > 0) {
      this._commonService.showWarningMessage('Please Enter Renewal Amount for all selected rows.');
      return;
    }
    let fdAccountNos = selected.map(d => `'${d.pFdaccountno}'`).join(',');
    this.GetFdTransactionDetails(fdAccountNos);
    this.ShowRenewalFdTransaction = true;
    this.disablesavebutton        = false;
  }
  GetFdTransactionDetails(fdAccountNos: string): void {
    if (isNullOrEmptyString(fdAccountNos)) return;

    this._MaturityPaymentService.GetFdTransactionDetails(fdAccountNos).subscribe(result => {
      const jointMemberDetails = result['fdMembersandContactDetailsList'] || [];
      const nomineeDetails     = result['fdMemberNomineeDetailsList']     || [];
      const jc = this.maturityPaymentRenewalComponent.fdJointmemberComponent;

      this.maturityPaymentRenewalComponent.RenewalAmount = this.totalRenewalAmount;
      this.maturityPaymentRenewalComponent.FdTranscationform.controls.pChitbranchname
        .setValue(this.MaturityRenewalForm.controls.pBranch.value);
      this.maturityPaymentRenewalComponent.FdTranscationform.controls.pChitbranchId
        .setValue(this.MaturityRenewalForm.controls.pBranchId.value);

      this.maturityPaymentRenewalComponent.MemberChanges(this.MemberEvent);

      if (jointMemberDetails.length > 0) {
        jc.ShowJointmemberstable = true;
        jc.ShowJointmembers      = true;
        jc.JointMemberAndNomineeForm.controls.pIsjointMembersapplicableorNot.setValue(true);
        jc.fdMembersandContactDetailsList = jointMemberDetails;
      }
      jc.nomineeDetails.nomineeList = nomineeDetails;
    });
  }
  saveMaturityRenewal(): void {
    try {
      this.disablesavebutton = true;
       this.savebutton        = 'Processing';

       const fdList = this.FdDetailsList || [];
      const selected      = this.FdDetailsList.filter(item => item.pStatus === true);
      const missingAmount = selected.filter(item => isNullOrEmptyString(item.pRenewalAmount));

      if (missingAmount.length > 0) {
        this._commonService.showWarningMessage('Please Enter Renewal Amount for all selected rows.');
        this.disablesavebutton = false;
        this.savebutton        = 'Next';
        return;
      }

      const validation = this._CoJointmemberService._GettCoJointmembervalidation();
      if (validation === 'success') {
        this.Tabposition = 3;
      }

      if (this.Tabposition === 1) { this.FirstTabSave(); }
      if (this.Tabposition === 2) { this.SecondTabSave(); }
      if (this.Tabposition === 3) { this.ThirdTabSave(); }

    } catch (e) {
      this._commonService.showErrorMessage(e);
      this.disablesavebutton = false;
      this.savebutton        = 'Next';
    }
  }
  FirstTabSave(): void {
    debugger;
    this.MaturityRenewalForm.controls.ptotalpaidamount.setValue(
      this.MaturityPaymentList.reduce((sum, c) => sum + parseFloat(c.pPaidAmount), 0)
    );

    if (!this.validateRenewalForm()) {
      this.disablesavebutton = false;
      this.savebutton        = 'Next';
      return;
    }
     if (!this.ShowRenewalFdTransaction) {
    this.disablesavebutton = false;
    this.savebutton        = 'Next';
    return;
  }
    this.MaturityPaymentList = [];
    const control   = this.MaturityRenewalForm.get('pMaturityPaymentlist') as FormGroup;
    const selected  = this.FdDetailsList.filter(item => item.pStatus === true);

    for (const paymentItem of selected) {
      const fddata = this.FdDetailsList.find(item => item.pFdaccountid === paymentItem.pFdaccountid);
      if (!fddata) continue;

      control.controls.pTransTypeid.setValue(fddata.pFdaccountid);

      if (fddata.pRenewalAmount) {
        fddata.pRenewalAmount = this._commonService.removeCommasForEntredNumber(fddata.pRenewalAmount);
        control.controls.pPaidAmount.setValue(fddata.pRenewalAmount);
      }

      control.controls.pAccountno.setValue(fddata.pFdaccountid);
      control.controls.pOutstandingAmount.setValue(fddata.pNetPayable);
      control.controls.pLateFeeAmount.setValue(fddata.pLateFeeAmount);

      const renewalData = { IsRenewal: fddata.IsRenewal, pRenewalAmount: fddata.pRenewalAmount };
      this.MaturityPaymentList.push(Object.assign({}, control.value, renewalData));
    }
    const renewalComp = this.maturityPaymentRenewalComponent;
     Object.keys(renewalComp.FdTranscationform.controls).forEach(key => {
  const ctrl = renewalComp.FdTranscationform.get(key);
  ctrl.markAsTouched();
  ctrl.markAsDirty();
  ctrl.updateValueAndValidity({ emitEvent: true }); // ← ADDED
});
    if (renewalComp.FdTranscationform.invalid) {
    this.disablesavebutton = false;
    this.savebutton        = 'Next';
    return;
    }
    if (renewalComp.FdTranscationform.controls.pMaturityAmount.value == 0) {
      const tenureMode    = renewalComp.TenureMode.toUpperCase();
      const tenure        = parseInt(renewalComp.Tenure);
      const intrestPayout = renewalComp.Intrestpayout.toUpperCase();
      const depositAmount = parseInt(renewalComp.depositamount);
      const intrestComp   = renewalComp.IntrestCompounding.toUpperCase();

      let caltype = renewalComp.Caltype;
     if (renewalComp.Intrestpayout == 'Monthly')     { caltype = 'Interest Rate'; }
     if (renewalComp.Intrestpayout == 'On Maturity') { caltype = 'Value Per 100'; }

      this._fdrdttranscationservice
       // .GetIntrestAmount(tenureMode, tenure, depositAmount, intrestPayout, intrestComp, renewalComp.Intrestrate, renewalComp.Caltype)
       .GetIntrestAmount(tenureMode, tenure, depositAmount, intrestPayout, intrestComp, renewalComp.Intrestrate, caltype)
        .subscribe(res => {
          renewalComp.FdTranscationform.controls.pMaturityAmount.setValue(res[0].pMatueritytAmount);
          renewalComp.MaturityAmnt  = res[0].pMatueritytAmount;
          renewalComp.IntrestAmount = res[0].pInterestamount;
          renewalComp.FdTranscationform.controls.pInterestAmount.setValue(res[0].pInterestamount);
          renewalComp.Caltype = caltype;
          renewalComp.FdTranscationform.controls.pCaltype.setValue(caltype);
          this.SaveRenewal();
        },
        error => {
          this._commonService.showErrorMessage(error);
          this.disablesavebutton = false;
          this.savebutton = 'Next';
        }
      );
    } else {
      this.SaveRenewal();
    }
  }
  SecondTabSave(): void {
    this.disablesavebutton = false;
    this.savebutton        = 'Next';
    this.maturityPaymentRenewalComponent.SecondTabSave();
  }
  ThirdTabSave(): void {
    this.disablesavebutton = false;
    this.savebutton        = 'Next';
    this.maturityPaymentRenewalComponent.ThirdTabSave();
  }
  SaveRenewal(): void {
    debugger
    const renewalComp = this.maturityPaymentRenewalComponent;
     console.log('Interest Amount on screen  :', renewalComp.IntrestAmount);
  console.log('pInterestAmount in form    :', renewalComp.FdTranscationform.controls.pInterestAmount.value);
  console.log('MaturityPaymentsList       :', JSON.stringify(this.MaturityPaymentList));

    this.calculateRatePerSquareYard();

    if (!renewalComp.Showmaturityamountforintrest && !renewalComp.ShowIntrestamountforintrest) {
      this.savebutton = 'Next';
      this._commonService.showWarningMessage('Please Click Calculate Button');
      return;
    }

    if (renewalComp.MaturityAmnt === '' && renewalComp.IntrestAmount === '') {
      this.savebutton = 'Next';
      this._commonService.showWarningMessage('Please Click Calculate Button');
      return;
    }

    if (renewalComp.FdTranscationform.controls.pContactid.value === '') {
      renewalComp.FdTranscationform.controls.pContactid.setValue(0);
    }

    renewalComp.FdTranscationform.controls.pMemberId.setValue(renewalComp.MemberidSave);
    renewalComp.FdTranscationform.controls.pContacttype.setValue(renewalComp.contactType);
    renewalComp.FdTranscationform.controls.pTransdate.setValue(
      this.MaturityRenewalForm.controls.pMaturitypaymentdate.value
    );

    const payload = Object.assign(this.MaturityRenewalForm.value, {
      MaturityPaymentsList:   this.MaturityPaymentList,
      _FdMemberandSchemeSave: renewalComp.FdTranscationform.value
    });
    const data = JSON.stringify(payload);

    this._MaturityPaymentService.SaveMaturityRenewal(data).subscribe(json => {
      this._commonService.showWarningMessage('Add Nominee Details');

      const saved = !!json;
      sessionStorage.setItem('nomineeDetailsMP',     JSON.stringify(saved));
      sessionStorage.setItem('onlyNomineeDetailsMP', JSON.stringify(saved));

      $('.nav-item a[href="#add-joint-member"]').tab('show');
      this.Tabposition       = 2;
      this.disablesavebutton = false;
      this.savebutton        = 'Next';
      const resdata = { accountId: json['pFdAccountId'], accountNo: json['pFdaccountNo'] };
      this._CoJointmemberService._SetShareAccountdata(resdata);

      renewalComp.fdJointmemberComponent.ShowSaveClearbuttons = false;
      renewalComp.GetApplicanttypes(renewalComp.contactType);
      renewalComp.clearform();
      renewalComp.showgrid = false;

      this._fdrdttranscationservice._Setgriddata(renewalComp.griddata);
      renewalComp.FdaccountNo  = json['pFdaccountNo'];
      renewalComp.FdAccountId  = json['pFdAccountId'];
      this._fdrdttranscationservice._SetDataForJointMember(
        renewalComp.Applicanttype,
        renewalComp.FdAccountId,
        renewalComp.FdaccountNo,
        renewalComp.Contactid,
        renewalComp.contactrefid
      );

      this._rdttranscationservice.GetMemberNomineeDetails(renewalComp.Membercode).subscribe(nomineeJson => {
        renewalComp.Nomineedetails = nomineeJson;
        this._fdrdttranscationservice._SetNomineedetails(renewalComp.Nomineedetails);
      });

      // Reset interest-related UI state in sub-component
      renewalComp.showIntrestcompounding   = false;
      renewalComp.showintrestrate          = false;
      renewalComp.FdSchemeDetails          = '';
      renewalComp.DepositAmountBaseconintrest = false;
      renewalComp.Showmaturityamount       = false;
      renewalComp.Multiplesof              = '';
      renewalComp.IntrestCompounding       = '';

    }, error => {
      this._commonService.showErrorMessage(error);
      this.disablesavebutton = false;
      this.savebutton        = 'Next';
    });
  }
  private calculateRatePerSquareYard(): void {
    const comp = this.maturityPaymentRenewalComponent;
    if (comp.ratepersquareyard && comp.ratepersquareyard !== 0) {
      comp.ratesquareyard = comp.depositamount / comp.ratepersquareyard;
      comp.FdTranscationform.controls.pSquareyard.setValue(comp.ratesquareyard);
    }
  }
 private markFormGroupTouched(group: FormGroup): void {
  Object.keys(group.controls).forEach(key => {
    const ctrl = group.get(key);
    if (ctrl instanceof FormGroup) {
      this.markFormGroupTouched(ctrl);
    } else {
      ctrl.markAsTouched();
      ctrl.markAsDirty();
    }
  });
}
  private validateRenewalForm(): boolean {
  this.markFormGroupTouched(this.MaturityRenewalForm); // ← ADDED
  let isValid = this.checkValidations(this.MaturityRenewalForm, true);

    const fdList = this.FdDetailsList || [];
    const selected = this.FdDetailsList.filter(item => item.pStatus === true);
    if (selected.length === 0) {
      this._commonService.showWarningMessage('Please Select At Least One Checkbox');
      isValid = false;
    }

    const emptyAmount = selected.filter(item => isNullOrEmptyString(item.pRenewalAmount));
    if (emptyAmount.length > 0) {
      this._commonService.showWarningMessage('Please Enter the Renewal Amount.');
      isValid = false;
    }

    return isValid;
  }
  ClearDetails(): void {
    this.ngOnInit();
    this.ShowRenewalGrid          = false;
    this.ShowRenewalFdTransaction = false;
    this.FdDetailsList            = [];
    this.staticFDDetails          = [];
    this.MaturityPaymentList      = [];
    this.totalRenewalAmount       = 0;
  }
  back(): void {
    const referralStatus  = sessionStorage.referralStatusMP    ? JSON.parse(sessionStorage.referralStatusMP)    : null;
    const nomineeStatus   = sessionStorage.nomineeDetailsMP    ? JSON.parse(sessionStorage.nomineeDetailsMP)    : null;

    if (referralStatus === true || nomineeStatus === true) {
      this.showModal = true;
    } else {
      this.router.navigate(['/MaturityrenewalView']);
    }
  }

  closeModal(): void {
    this.showModal = false;
  }
  BlurEventAllControll(fromgroup: FormGroup): void {
    try {
      Object.keys(fromgroup.controls).forEach(key => this.setBlurEvent(fromgroup, key));
    } catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }

  setBlurEvent(fromgroup: FormGroup, key: string): void {
    try {
      const ctrl = fromgroup.get(key);
      if (ctrl) {
        if (ctrl instanceof FormGroup) {
          this.BlurEventAllControll(ctrl);
        } else if (ctrl.validator) {
          fromgroup.get(key).valueChanges.subscribe(() =>
            this.GetValidationByControl(fromgroup, key, true)
          );
        }
      }
    } catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }

  checkValidations(group: FormGroup, isValid: boolean): boolean {
    try {
      Object.keys(group.controls).forEach(key => {
        isValid = this.GetValidationByControl(group, key, isValid);
      });
    } catch (e) {
      return false;
    }
    return isValid;
  }

  // GetValidationByControl(formGroup: FormGroup, key: string, isValid: boolean): boolean {
  //   try {
  //     const ctrl = formGroup.get(key);
  //     if (ctrl) {
  //       if (ctrl instanceof FormGroup) {
  //         if (key !== 'pMaturityPaymentlist') {
  //           this.checkValidations(ctrl, isValid);
  //         }
  //       } else if (ctrl.validator) {
  //         this.formValidationMessages[key] = '';
  //         if (ctrl.errors || ctrl.invalid || ctrl.touched || ctrl.dirty) {
  //           const labelEl  = document.getElementById(key) as HTMLInputElement;
  //           const label    = labelEl ? labelEl.title : key;
  //           for (const errorkey in ctrl.errors) {
  //             const msg = this._commonService.getValidationMessage(ctrl, errorkey, label, key, '');
  //             this.formValidationMessages[key] += msg + ' ';
  //             isValid = false;
  //           }
  //         }
  //       }
  //     }
  //   } catch (e) {
  //     return false;
  //   }
  //   return isValid;
  // }

  GetValidationByControl(formGroup: FormGroup, key: string, isValid: boolean): boolean {
  try {
    const ctrl = formGroup.get(key);
    if (ctrl) {
      if (ctrl instanceof FormGroup) {
        if (key !== 'pMaturityPaymentlist') {
          this.checkValidations(ctrl, isValid);
        }
      } else if (ctrl.validator) {
        this.formValidationMessages[key] = '';
        // CHANGED: ctrl.invalid instead of touched/dirty
        if (ctrl.invalid) {
          const labelEl = document.getElementById(key) as HTMLInputElement;
          const label   = labelEl ? labelEl.title : key;
          for (const errorkey in ctrl.errors) {
            const msg = this._commonService.getValidationMessage(ctrl, errorkey, label, key, '');
            this.formValidationMessages[key] += msg + ' ';
            isValid = false;
          }
        }
      }
    }
  } catch (e) {
    return false;
  }
  return isValid;
}

}

