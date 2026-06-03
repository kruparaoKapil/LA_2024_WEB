import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { LienEntryService } from 'src/app/Services/Banking/lien-entry.service';
import { MaturityPaymentService } from '../../../../Services/Banking/Transactions/maturity-payment.service';
import { FdReceiptService } from 'src/app/Services/Banking/Transactions/fd-receipt.service';
import { isNullOrUndefined, debug } from 'util';
import { CommonService } from '../../../../Services/common.service';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-maturity-bondnew',
  templateUrl: './maturity-bondnew.component.html',
  styles: []
})
export class MaturityBondnewComponent implements OnInit {
  public dpConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  MaturityBondForm: FormGroup
  public today: Date = new Date();
  disablesavebutton = true;
  savebutton = "Save";
  public formValidationMessages: any;
  public MaturityTypeList: any;
  public TransactionTypeDetails: any = [];
  public Schemedata: any = [];
  public Accountdata: any = [];
  public MaturityDetails: any = [];
  public MaturityType: any;
  MaturityTyperadio: boolean = false;
  ShowFixeddepositdetails: boolean = false;
  public TransactionData: any = [];
  Deposiamount: any;
  disabletransactiondate = false;
  maturityTypeForRt: any;
  LienEntryDataonFdaccount: any = [];
  panNoAVailability: any;
  netPayable: number;
  netvalue: any;
  damvalue: any;
  totalnetval: number;
  damageval: number = 100;
  //bstart
  os_sale: any;
  hs_sale: any;
  pannumber: any;
  netPayableAmount: any;
  // damagesFlag: boolean = false;
  //bend
  constructor(private formbuilder: FormBuilder, private router: Router, private toastr: ToastrService, private datePipe: DatePipe, private zone: NgZone, private _LienEntryService: LienEntryService, private _MaturityPaymentService: MaturityPaymentService, private _commonservice: CommonService,
    private _FdReceiptService: FdReceiptService) {
    this.dpConfig1.dateInputFormat = 'DD/MM/YYYY'
    this.dpConfig1.maxDate = new Date();
    this.dpConfig1.showWeekNumbers = false;
  }

  ngOnInit() {
    if (this._commonservice.comapnydetails != null)
      this.disabletransactiondate = this._commonservice.comapnydetails.pdatepickerenablestatus;
    this.formValidationMessages = {};
    this.MaturityBondForm = this.formbuilder.group({
      pTransdate: [this.today],
      pMemberid: ['', Validators.required],
      pTranstype: [''],
      pTranstypeid: [''],
      pMatureamount: [''],
      pPreinterestrate: [''],
      pInterestpayble: [''],
      pAgentcommssionvalue: [0],
      pAgentcommssionPayable: [0],
      pDamages: [this.damvalue],
      pInterestpaid: [0],
      pCommissionpaid: [0],
      pJv_id: [''],
      pMaturityType: [null, Validators.required],
      pNarration: ['', Validators.required],
      pNetpayble: [''],
      pStatus: [''],
      ptypeofoperation: ["CREATE"],
      ptdsamount: [0],
      psuspenceamount: [0],
      paccountno: [null, Validators.required],
      pSchemeName: [null, Validators.required],
      pSchemeid: ['']

    });
    this.GetMeturityTypes();
    //this.GetTransactionTypeDetails();
    this.BlurEventAllControll(this.MaturityBondForm);
  }
  GetMeturityTypes() {
    this.MaturityTypeList = [{ MaturityType: 'Pre-Maturity' }, { MaturityType: 'Maturity' }];
  }
  MaturityTypeChange(event) {
    debugger;
    this.Deposiamount = '';
    this.MaturityType = event.MaturityType;
    this.MaturityBondForm.controls.pTranstype.setValue('');
    this.MaturityBondForm.controls.pTranstypeid.setValue('');
    this.formValidationMessages.pTranstype = null;
    this.formValidationMessages.pSchemeName = null;
    this.formValidationMessages.paccountno = null;

    this.MaturityBondForm.controls.pTranstype.setValue('FD');
    //this.MaturityBondForm.controls.pTranstype.disable();
    //this.GetSchemedata();
    this.GetSchemedata();

  }
  GetTransactionTypeDetails() {
    this.TransactionTypeDetails = [{ Transtype: 'FD', Transtypeid: 1 }, { Transtype: 'RD', Transtypeid: 2 }];
  }
  TransactionType(event) {
    debugger;

    // this.MaturityBondForm.controls.pTranstype.setValue(event.Transtype);
    // this.GetSchemedata();
  }
  GetSchemedata() {
    debugger
    this.Deposiamount = '';
    this.Accountdata = [];
    this.MaturityBondForm.controls.paccountno.setValue('');
    this.formValidationMessages.paccountno = null;
    this.MaturityDetails = [];
    this.ShowFixeddepositdetails = false;
    this.MaturityTyperadio = false;
    this.MaturityBondForm.controls.pSchemeName.setValue('');
    this.MaturityBondForm.controls.pSchemeid.setValue('');
    this.formValidationMessages.pSchemeName = null;
    this.Schemedata = [];
    this.TransactionData = [];
    let MaturityType = this.MaturityBondForm.controls.pMaturityType.value;
    let Transtype = this.MaturityBondForm.controls.pTranstype.value;
    if (MaturityType != '' && Transtype != '') {

      this._MaturityPaymentService.GetSchemeType(MaturityType, Transtype).subscribe(Response => {
        this.Schemedata = Response;
        //bstart
        // this.os_sale=this.Schemedata[0].pSchemeName;
        //bend
      });
    }

  }
  SchemeNameChange(event) {
    debugger
    this.Deposiamount = '';
    this.MaturityBondForm.controls.pSchemeName.setValue(event.pSchemeName);
    this.MaturityBondForm.controls.pSchemeid.setValue(event.pSchemeid);
    this.GetAccountNo();
  }
  GetAccountNo() {
    debugger;
    this.Accountdata = [];
    this.MaturityBondForm.controls.paccountno.setValue('');
    this.formValidationMessages.paccountno = null;
    this.MaturityDetails = [];
    this.ShowFixeddepositdetails = false;
    this.MaturityTyperadio = false;
    this.TransactionData = [];
    let MaturityType = this.MaturityBondForm.controls.pMaturityType.value;
    let Deposittype = this.MaturityBondForm.controls.pTranstype.value;
    let Schemeid = this.MaturityBondForm.controls.pSchemeid.value;
    this._MaturityPaymentService.GetDeposit(MaturityType, Deposittype, Schemeid).subscribe(Response => {
      this.Accountdata = Response;
    });
  }
  AccountNoChange(event) {
    debugger
    this.Deposiamount = '';
    this.MaturityDetails = [];
    this.TransactionData = [];
    this.ShowFixeddepositdetails = false;
    this.MaturityTyperadio = false;
    // //bstart

    // this.netpayabletotal=Number(this.MaturityBondForm.controls.pNetpayble.value)-this.damvalue
    // this.MaturityBondForm.controls.pNetpayble.setValue(this.netpayabletotal);
    // //bend
    this.MaturityBondForm.controls.paccountno.setValue(event.paccountno);
    this.MaturityBondForm.controls.pMemberid.setValue(event.pMemberid);
    this.MaturityBondForm.controls.pTranstypeid.setValue(event.paccountid);
    let paccountid = event.paccountid;
    let paccountno = event.paccountno;
    let Transdate = this.datePipe.transform(this.MaturityBondForm.controls.pTransdate.value, "yyyy-MM-dd");
    let MaturityType = this.MaturityBondForm.controls.pMaturityType.value;
    let Deposittype = this.MaturityBondForm.controls.pTranstype.value;

    this._MaturityPaymentService.GetMaturityDetails(paccountno, Transdate, MaturityType, Deposittype, paccountid,).subscribe(Response => {
      this.MaturityDetails = Response;
      //bstart
      console.log('this is maturity details:', this.MaturityDetails);
      let schemeName = this.MaturityBondForm.controls.pSchemeName.value;
      this.pannumber = this.MaturityDetails.pPan
      if (schemeName == 'OS-SALE ADVANCE' || schemeName == 'HS-SALE ADVANCE') {
      // this.damagesFlag = true;
      let damvalue = (this.MaturityDetails.psquareyard) * this.damageval;
      this.damvalue = (this.MaturityDetails.psquareyard) * this.damageval;
      this.MaturityBondForm.controls.pDamages.setValue(this._commonservice.currencyformat(this.damvalue));
      let netvalue = this.MaturityDetails.pNetpay;
      this.netvalue = this.MaturityDetails.pSubtotal;
      console.log('this is netpayable :', this.netvalue);
      this.totalnetval = Number(this.netvalue) - Number(this.damvalue);
      this.netPayableAmount = this.totalnetval
      console.log('this is total netpayable:', this.totalnetval);
      //bend
      this.panNoAVailability = this.MaturityDetails.pPan;
      console.log(this.panNoAVailability);
      this.MaturityBondForm.controls.pInterestpayble.setValue(this._commonservice.currencyformat(this.MaturityDetails.pCalcinterestamt));
      this.MaturityBondForm.controls.pAgentcommssionPayable.setValue(this._commonservice.currencyformat(this.MaturityDetails.pPromotorsalary));
      //bstart
      // this.MaturityBondForm.controls.pNetpayble.setValue(this._commonservice.currencyformat(this.MaturityDetails.pNetpay));
      this.MaturityBondForm.controls.pNetpayble.setValue(this._commonservice.currencyformat(this.totalnetval));
      //bend
      this.MaturityBondForm.controls.ptdsamount.setValue(this._commonservice.currencyformat(this.MaturityDetails.pTdsPayble));
      }
      else {
        this.MaturityBondForm.controls.pDamages.setValue(0);
        // this.damagesFlag = false;
        this.panNoAVailability = this.MaturityDetails.pPan;
        console.log(this.panNoAVailability);
        this.MaturityBondForm.controls.pInterestpayble.setValue(this._commonservice.currencyformat(this.MaturityDetails.pCalcinterestamt));
        this.MaturityBondForm.controls.pAgentcommssionPayable.setValue(this._commonservice.currencyformat(this.MaturityDetails.pPromotorsalary));
        this.MaturityBondForm.controls.pNetpayble.setValue(this._commonservice.currencyformat(this.MaturityDetails.pNetpay));
        this.MaturityBondForm.controls.ptdsamount.setValue(this._commonservice.currencyformat(this.MaturityDetails.pTdsPayble));
        this.netPayableAmount = this.MaturityDetails.pNetpay;

      }
      if (MaturityType == 'Maturity') {
        this.MaturityTyperadio = false;
        this.ShowFixeddepositdetails = true;
      }
      else {
        this.MaturityTyperadio = true;
        this.ShowFixeddepositdetails = false;
      }
      this.TransactionDetails();
      if (this.panNoAVailability == '') {
        this._commonservice.showWarningMessage('Member Pan is empty please enter Member Pan No.');
      }
    });
  }
  GetSchemAndMaturityDetails(type) {
    debugger;
    if (type == "SchemeDetails") {
      this.ShowFixeddepositdetails = true;
      this.MaturityTyperadio = false;
    }
    else {
      this.ShowFixeddepositdetails = false;
      this.MaturityTyperadio = true;

    }
    console.log('this idjfhdf  :', this.MaturityBondForm.value);


  }
  DamagesChange(event) {
    debugger;
    if (event.target.value != "") {
      let Damages = parseFloat(event.target.value.toString().replace(/,/g, ""));
      let Netpay = this.MaturityDetails.pNetpay - Damages;
      if (Netpay < 0) {
        this._commonservice.showWarningMessage("Damages should not be greater than Net Payble")
        this.MaturityBondForm.controls.pDamages.setValue(0);
        this.MaturityBondForm.controls.pNetpayble.setValue(this._commonservice.currencyformat(this.MaturityDetails.pNetpay));
      }
      else {
        this.MaturityBondForm.controls.pNetpayble.setValue(this._commonservice.currencyformat(Netpay));
      }

    }
    else {
      this.MaturityBondForm.controls.pDamages.setValue(0);
      this.MaturityBondForm.controls.pNetpayble.setValue(this._commonservice.currencyformat(this.MaturityDetails.pNetpay));
    }
  }
  TransactionDetails() {
    debugger
    let pTranstype = this.MaturityBondForm.controls.pTranstype.value;
    let paccountno = this.MaturityBondForm.controls.paccountno.value;
    this.TransactionData = [];
    if (pTranstype == 'FD') {
      this.FDTransactionDetails(paccountno);
    }
    else {
      this.RdTransactionDetails(paccountno);
    }

  }
  FDTransactionDetails(paccountno) {
    debugger
    let accID = this.MaturityBondForm.controls.pTranstypeid.value;
    this._MaturityPaymentService.GetFdDetailsById(paccountno, accID).subscribe(result => {
      this.TransactionData = result;
      console.log('this is transaction data:',this.TransactionData);
      this.MaturityBondForm.controls.pMatureamount.setValue(this._commonservice.currencyformat(this.TransactionData[0].pMaturityamount));
      this.MaturityBondForm.controls.pPreinterestrate.setValue(this.TransactionData[0].pInterestrate);
      this.MaturityBondForm.controls.pInterestpayble.setValue(this._commonservice.currencyformat(this.MaturityDetails.pCalcinterestamt));
      this.Deposiamount = this._commonservice.currencyformat(this.TransactionData[0].pDeposiamount);
      console.log('this is advance amount:', this.Deposiamount);

      let interestPayout = this.TransactionData[0].pInterestPayout;

      let interestAmount = this.MaturityDetails.pCalcinterestamt;

      // if (interestAmount > 0) {
      if (interestAmount > 10000) {

        if (interestPayout == 'On Maturity') {
          let accountId = this.MaturityBondForm.controls.pTranstypeid.value;
          this._MaturityPaymentService.getInOprativeCount(accountId).subscribe(res => {
            let count = res['pcount'];
            if (count > 0) {
              // this.MaturityBondForm.controls.ptdsamount.setValue(0);
              let percentage = 0.20;
              //let totalNetValue = this.MaturityDetails.pNetpay * percentage;
              let interestAMount = this.MaturityDetails.pCalcinterestamt;
              let totalNetValue = interestAMount * percentage;
              totalNetValue = Math.round(totalNetValue);
              // totalNetValue = totalNetValue + this.MaturityDetails.pCalcinterestamt
              this.MaturityBondForm.controls.ptdsamount.setValue(this._commonservice.currencyformat(totalNetValue));
              let depositAmount = this.TransactionData[0].pDeposiamount
              this.netPayable = depositAmount + interestAMount - totalNetValue;
              // this.netPayable = 72000.67;
              this.netPayable = Math.round(this.netPayable)
              this.MaturityBondForm.controls.pNetpayble.setValue(this._commonservice.currencyformat(this.netPayable));

            }
             // b 19-08-2025 changes
            // else if(this.pannumber !=''){
            //   let percentage = 0.10;
            //   //let totalNetValue = this.MaturityDetails.pNetpay * percentage;
            //   let interestAMount = this.MaturityDetails.pCalcinterestamt;
            //   let totalNetValue = interestAMount * percentage;
            //   totalNetValue = Math.round(totalNetValue);
            //   // totalNetValue = totalNetValue + this.MaturityDetails.pCalcinterestamt
            //   this.MaturityBondForm.controls.ptdsamount.setValue(this._commonservice.currencyformat(totalNetValue));
            //   let depositAmount = this.TransactionData[0].pDeposiamount
            //   this.netPayable = depositAmount + interestAMount - totalNetValue;
            //   // this.netPayable = 72000.67;
            //   this.netPayable = Math.round(this.netPayable);
            //   this.MaturityBondForm.controls.pNetpayble.setValue(this._commonservice.currencyformat(this.netPayable));
            // }
            // //bstart
            // else{
            //   let percentage = 0.20;
            //   //let totalNetValue = this.MaturityDetails.pNetpay * percentage;
            //   let interestAMount = this.MaturityDetails.pCalcinterestamt;
            //   let totalNetValue = interestAMount * percentage;
            //   totalNetValue = Math.round(totalNetValue);
            //   // totalNetValue = totalNetValue + this.MaturityDetails.pCalcinterestamt
            //   this.MaturityBondForm.controls.ptdsamount.setValue(this._commonservice.currencyformat(totalNetValue));
            //   let depositAmount = this.TransactionData[0].pDeposiamount
            //   this.netPayable = depositAmount + interestAMount - totalNetValue;
            //   // this.netPayable = 72000.67;
            //   this.netPayable = Math.round(this.netPayable)
            //   this.MaturityBondForm.controls.pNetpayble.setValue(this._commonservice.currencyformat(this.netPayable));
            // }
            //bend
          })
        }
      }
      // else{
      //   this._commonservice.showWarningMessage('Interest Amount Should be Greater than 5000')
      // }
     
    });

  }
  RdTransactionDetails(paccountno) {
    this._MaturityPaymentService.GetRDDetailsById(paccountno).subscribe(result => {
      this.TransactionData = result;
      this.MaturityBondForm.controls.pMatureamount.setValue(this._commonservice.currencyformat(this.TransactionData[0].pMaturityamount));
      this.MaturityBondForm.controls.pPreinterestrate.setValue(this.TransactionData[0].pInterestrate);
      this.MaturityBondForm.controls.pInterestpayble.setValue(this.MaturityDetails.pCalcinterestamt);
      this.Deposiamount = this._commonservice.currencyformat(this.TransactionData[0].pDeposiamount);

    });
  }
  SaveMaturityBond() {
    debugger;
    let IsValid: boolean = true;
    if (this.checkValidations(this.MaturityBondForm, IsValid)) {
      this.savebutton = 'Processing';

      if (this.panNoAVailability == '') {
        this._commonservice.showWarningMessage('Member Pan is empty please enter Member Pan No.');
        this.savebutton = 'Save';
        return
      }


      this._MaturityPaymentService.getLienRealseCount(this.MaturityBondForm.controls.paccountno.value).subscribe(result => {
        debugger;
        if (result) {
          // this.LienEntryDataonFdaccount = result;
          // console.log(this.LienEntryDataonFdaccount);

          let count = result['count'];
          if (count == 0) {

            this.maturityTypeForRt = this.MaturityBondForm.controls.pMaturityType.value;

            let Matureamount = parseFloat(this.MaturityBondForm.controls.pMatureamount.value.toString().replace(/,/g, ""));
            this.MaturityBondForm.controls.pMatureamount.setValue(Matureamount);

            let Interestpayble = parseFloat(this.MaturityBondForm.controls.pInterestpayble.value.toString().replace(/,/g, ""));
            this.MaturityBondForm.controls.pMatureamount.setValue(Interestpayble);

            let AgentcommssionPayable = parseFloat(this.MaturityBondForm.controls.pAgentcommssionPayable.value.toString().replace(/,/g, ""));
            this.MaturityBondForm.controls.pMatureamount.setValue(AgentcommssionPayable);

            let Netpayble = parseFloat(this.MaturityBondForm.controls.pNetpayble.value.toString().replace(/,/g, ""));
            this.MaturityBondForm.controls.pMatureamount.setValue(Netpayble);

            let tdsamount = parseFloat(this.MaturityBondForm.controls.ptdsamount.value.toString().replace(/,/g, ""));
            this.MaturityBondForm.controls.pMatureamount.setValue(tdsamount);

            if (this.MaturityBondForm.controls.pMaturityType.value == 'Pre-Maturity') {
              this.MaturityBondForm.controls.pInterestpaid.setValue(this.MaturityDetails.pInterestpaidamt);
            }


            let formdata = this.MaturityBondForm.value;
            let Jsondata = JSON.stringify(formdata);
            console.log("json data", Jsondata)
            this._MaturityPaymentService.SaveMaturitybond1(Jsondata).subscribe(result => {
              debugger;
              console.log('this is maturity bond json:', result);

              if (result['iSsaved']) {
                this.savebutton = 'Save';
                this.disablesavebutton = false;
                this._commonservice.showInfoMessage("Saved Successfully");
                if (this.maturityTypeForRt == 'Pre-Maturity') {
                  let receipt = btoa(result['maturitybondsid'] + ',' + 'Pre-Maturity');
                  window.open('/#/PreMaturityDetailsPreview?id=' + receipt);
                }

                if (this.maturityTypeForRt == 'Maturity') {
                  let receipt = btoa(result['maturitybondsid'] + ',' + 'Maturity');
                  window.open('/#/PreMaturityDetailsPreview?id=' + receipt);
                }
                this.router.navigate(['/MaturityBondView'])
              }
            },
              error => {
                this._commonservice.showErrorMessage(error);
                this.savebutton = 'Save';
                this.disablesavebutton = false;
              })

          }

          if (count != 0) {
            this._commonservice.showWarningMessage('Member Having Lien Release Them');
            this.savebutton = 'Save';
            // this.MaturityBondForm.reset();
          }

        }
      })
    }
  }
  ClearAllData() {
    this.MaturityBondForm.controls.pTransdate.setValue(this.today);
    this.MaturityBondForm.controls.pTranstype.setValue('');
    this.MaturityBondForm.controls.pTranstypeid.setValue('');
    this.MaturityBondForm.controls.pMaturityType.setValue('');
    this.MaturityBondForm.controls.pSchemeName.setValue('');
    this.MaturityBondForm.controls.pSchemeid.setValue('');
    this.MaturityBondForm.controls.pMemberid.setValue('');
    this.Accountdata = [];
    this.MaturityBondForm.controls.paccountno.setValue('');
    this.MaturityDetails = [];
    this.ShowFixeddepositdetails = false;
    this.MaturityTyperadio = false;
    this.Schemedata = [];
    this.TransactionData = [];
    this.BlurEventAllControll(this.MaturityBondForm);
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
          this.checkValidations(formcontrol, isValid)
        }
        else if (formcontrol.validator) {
          this.formValidationMessages[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {

            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                let lablename;
                lablename = (document.getElementById(key) as HTMLInputElement).title;
                errormessage = this._commonservice.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.formValidationMessages[key] += errormessage + ' ';
                isValid = false;
              }
            }
          }
        }
      }
    }
    catch (e) {
      // this.showErrorMessage(e);
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


}