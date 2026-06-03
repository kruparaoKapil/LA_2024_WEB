import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { MaturityPaymentService } from 'src/app/Services/Banking/Transactions/maturity-payment.service';
import { isNullOrUndefined } from '@swimlane/ngx-datatable';
import { CoJointmemberService } from 'src/app/Services/Common/co-jointmember.service';
import { RdReceiptService } from 'src/app/Services/Banking/Transactions/rd-receipt.service';
import { DatePipe } from '@angular/common';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { FdRdTransactionsService } from 'src/app/Services/Banking/Transactions/fd-rd-transactions.service';
import { SavingtranscationService } from 'src/app/Services/Banking/savingtranscation.service';
import { CoReferralService } from 'src/app/Services/Common/co-referral.service';
import { RdTransactionsService } from 'src/app/Services/Banking/Transactions/rd-transactions.service';
import { CoNomineedetailsComponent } from 'src/app/UI/Common/co-nomineedetails/co-nomineedetails.component';
import { NomineedetailsComponent } from '../FD-AC-Creation/nomineedetails.component';
import { ActivatedRoute } from '@angular/router';
import { CoReferral1Component } from 'src/app/UI/Common/co-referral1/co-referral1.component';
declare let $: any


@Component({
  selector: 'app-maturity-payment-renewal-new',
  templateUrl: './maturity-payment-renewal-new.component.html',
  styles: []
})
export class MaturityPaymentRenewalNewComponent implements OnInit {
  @Input() jointmemberdata: any;
  @ViewChild(NomineedetailsComponent, { static: false }) nomineeDetails: NomineedetailsComponent
  @ViewChild(CoNomineedetailsComponent, { static: false }) conomineeDetails: NomineedetailsComponent
  @ViewChild(CoReferral1Component, {static : false}) CoReferral:CoReferral1Component;
  MaturityPaymentForm : FormGroup;
  FdTranscationform : FormGroup;
  disabletransactiondate = false;
  public pMaturitypaymentdateConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  formValidationMessages: any;
  PaymentTypeList: any;
  MaturityMemberDetails: any = [];
  public FdDetailsList: any = [];
  public addGridData: any = [];
  public staticFDDetails:any;
  MaturityPaymentList: any = [];
  SavingsAccounts:any=[];
  allRowsSelected: boolean = false;
  showMaturitytab: boolean = false;
  ShowFixeddepositdetails: boolean = false;
  showPrematurity: boolean = false;
  ShowPaymentGrid: boolean = false;
  ShowRenewalGrid: boolean = false;
  MemberEvent: any;
  ShowmaturityBondsList: boolean = false;
  disablesavebutton = false;
  ShowRenewalFdTransaction: boolean = false;
  ShowRenewal: boolean = false;
  totalRenewalAmount: any;
  memberID: any;
  memberCODE: any;
  memberNAME: any;
  pContactid: any;
  pContactrefid: any;
  pMemberTypeid: any;
  pMemberType: any;
  pBranch: any;
  pBranchId: any;
  mutationList: any = [];
  showchit: boolean = false;
  Branchdetails: any = [];
  ApplicantTypes: any= [];
  membertypedetails: any = [];
  Applicanttype: any;
  Memberid: any;
  Membercode: any;
  Contactid: any;
  contactrefid: any;
  MemberTypeid: any;
  SelectedMembertype: any;
  MemberType: any;
  MemberidSave: any;
  memberdetails: any = [];
  FdSchemes: any = [];
  Fdname: any;
  Fdconfigid: any;
  TenureMode: any;
  Tenure: any;
  depositamount: any;
  FdCalculationmode: null;
  showIntrestcompounding: boolean;
  Showmaturityamount: boolean;
  Showmaturityamountforintrest: boolean = false;
  ShowIntrestamountforintrest: boolean = false;
  ShowIntrestamount: boolean;
  DepositAmountBaseconintrest: boolean = false;
  DepositAmountBasedontable: boolean = false
  FdSchemeDetails: any = [];
  Multiplesof: any;
  IntrestCompounding: any;
  Caltype: any;
  Investmentperiodfrom: any;
  Investmentperiodto: any;
  MinDepositAmount: any;
  IntrestrateTo: any;
  IntrestrateFrom: any;
  MaxDepositAmount: any;
  Valueper100: any;
  Totalnooffromdays: any;
  Totalnooftodays: any;
  calculatedepositamount: any;
  showcalculate: boolean = false;
  IntrestAmount: string;
  MaturityAmnt: string;
  intrestamountontable: any;
  Matrityamountontable: any;
  RenewalAmount: any;
  FdNameandCode: any;
  tenureontable: boolean = false;
  showtenureonintrest: boolean = false
  Showbranchcontacttype: boolean = false;
  showintrestrate: boolean;
  griddata: any = [];
  showgrid: boolean;
  Tenuremodedetails: any=[];
  showcard: boolean = false;
  Intrestpayout: any;
  DepositAmountdetails: any=[];
  showvalueper100: boolean;
  Intrestratedisable: boolean;
  ratepersquareyard: any;
  Intrestrate: any;
  interestvalidation: number;
  buttontype: any;
  tenuremodelist: any = [];
  depositamountontable: number;
  SelectMemberFlag: boolean = false;
  savebutton = "Save & Continue to Joint Member Details";
  Nomineedetails: any;
  FdAccountId: any;
  FdaccountNo: any;
  ratesquareyard: number;
  contactType = "Individual";
  Tabposition = 1;

  // /////////////////////////////////


  gridsum: any;
  accounttype: any;
  ShowJointmembersvalidation:any;
  AddNomineevalidation: any;
  showNominee = false;
  nomineeDetailsEditData: any;
  JointMemberErrorMessages: any = {}
  MembersandContactDetailsList: any = []
  ShowJointmembers: boolean = false;
  jointMembervalidation: boolean = false;
  MemberDetailsListAll: any = [];
  Data: any = [];
  editdata: any = [];
  ShowSaveClearbuttons: boolean = true;
  newlist = []
  nomineeList: any;
  Showbuttons:boolean=true;
  JointMemberAndNomineeForm: FormGroup;
  MaturityMemberDetails1: any = [];
  referralDetailsFlag : boolean = false;
  jointMemberFlag : boolean = false;


  constructor(private _commonService:CommonService, private _FormBuilder:FormBuilder, private _MaturityPaymentService:MaturityPaymentService, private _CoJointmemberService:CoJointmemberService, private _RdReceiptService:RdReceiptService, private datePipe:DatePipe, private _fdrdttranscationservice:FdRdTransactionsService, private savingtranscationservice:SavingtranscationService, private _CoReferralService:CoReferralService, private _rdttranscationservice:RdTransactionsService, private _route: ActivatedRoute) { 
    this.pMaturitypaymentdateConfig.containerClass = 'theme-dark-blue';
    this.pMaturitypaymentdateConfig.showWeekNumbers = false;
    this.pMaturitypaymentdateConfig.maxDate = new Date();
    this.pMaturitypaymentdateConfig.dateInputFormat = 'DD/MM/YYYY';
  }

  ngOnInit() {
    if (this._commonService.comapnydetails != null)
      this.disabletransactiondate = this._commonService.comapnydetails.pdatepickerenablestatus;
    this.formValidationMessages = {};

    this.PaymentTypeList = [{ PaymentType: 'Payment' }, { PaymentType: 'Renewal' }];


    // My FORM

   

    //ACTUAL FORM

    this.MaturityPaymentForm = this._FormBuilder.group({
      ppaymentid: [''],
      ptotalpaidamount: [''],
      Depositype: ['FD'],
      pnarration: ['', Validators.required],
      pmodofpayment: ['BANK'],
      pbankname: [''],
      pbranchname: [''],
      ptranstype: ['CHEQUE', Validators.required],
      pCardNumber: [''],
      pUpiname: [''],
      pUpiid: [''],
      ptypeofpayment: [''],
      pChequenumber: [''],
      pchequedate: [''],
      pbankid: [0],
      pSavingsMemberAccountid:[0],
      pCreatedby: [this._commonService.pCreatedby],
      pStatusname: [this._commonService.pStatusname],
      ptypeofoperation: [this._commonService.ptypeofoperation],
      pMemberid: [null, Validators.required],
      pBranch: [''],
      pBranchId: [''],
      pMembername: [''],
      pTransTypeid: [''],
      pTransType: [''],
      pMaturitypaymentdate: [new Date(), Validators.required],
      pPaymentType: ['Renewal', Validators.required],
      pDocStorePath: [''],
      pNarration: [''],
      pStatus: [true],

      pMaturityPaymentlist: this.addMaturityPaymentslistcontrols()
    })

    // lllll

    this.FdTranscationform = this._FormBuilder.group({
      pTransdate: [new Date(), Validators.required],
      pMemberType: [''],
      pContactid: [''],
      pContactrefid: [''],
      pSquareyard: [''],
      pMembertypeId: ['', Validators.required],
      pApplicantType: ['', Validators.required],
      pContacttype: [''],
      pEntitytype: [''],
      pMemberName: [''],
      pMemberCode: [''],
      pCaltype: [''],
      pMemberId: ['', Validators.required],
      pFdConfigId: ['', Validators.required],
      pFdname: [''],
      pFdcode: [''],
      fdtranscationradio: [''],
      fdtranscationradio1: [''],
      pFdnameCode: [''],
      pFdAccountNo: ['0'],
      pFdAccountId: ['0'],
      pInterestRate: ['', Validators.required],
      pFdCalculationmode: [''],
      pInterestPayOut: [null, Validators.required],
      pInterestType: [''],
      pInterestTenureMode: ['', Validators.required],
      pInterestTenure: ['', Validators.required],
      pChitbranchId: ['0'],
      pChitbranchname: [null, Validators.required],
      pDepositAmount: ['', Validators.required],
      pMaturityAmount: [0],
      pInterestAmount: [0],
      pMaturityDate: [new Date()],
      pDepositDate: [new Date()],
      pIsAutoRenew: [false],
      pIsinterestDepositinBank: [false],
      pIsRenewOnlyPrincipleandInterest: [false],
      pIsRenewOnlyPrinciple: [false],
      pIsinterestDepositinSaving: [false],
      pIsJointMembersapplicable: [false],
      pIsReferralsapplicable: [false],
      pIsNomineesapplicable: [false],
      pCreatedby: this._commonService.pCreatedby,
      pTypeofOperation: ['CREATE']
    })
    
    this.GetMaturityMembers('Renewal','FD');

    this.GetBranchstatus()

    // 

    this.FormGroup();
    this.showNominee = false;
    this.accounttype = this.jointmemberdata.accounttype;
    this.Showbuttons=this.jointmemberdata.Button;
    this.JointMemberAndNomineeForm.controls.paccounttype.setValue(this.accounttype);
    this.ShowJointmembersvalidation = this.jointmemberdata.AddJointMembervalidation;
    if (this.ShowJointmembersvalidation == true) {
      this.ShowJointmembers = true;
      this.GetMembers();
      this.jointMembervalidation = true
      this.JointMemberAndNomineeForm.controls.pIsjointapplicableorNot.setValue(true)
    } else {
      this.ShowJointmembers = false;
      this.jointMembervalidation = false
      this.JointMemberAndNomineeForm.controls.pIsjointapplicableorNot.setValue(false)
    }
    this.AddNomineevalidation = this.jointmemberdata.AddNomineevalidation;
    if (this.AddNomineevalidation == true) {
      this.JointMemberAndNomineeForm.controls.pIsNomineesApplicableorNot.setValue(true)
      this.showNominee = true;
    } else {
      this.JointMemberAndNomineeForm.controls.pIsNomineesApplicableorNot.setValue(false)
      this.showNominee = false;
    }
   // this._rdtranscationservice.getMemberNomineeDetails().subscribe(message => { this.newlist = message; });
    console.log('2nd tab nominee',this.newlist);
    if (this._route.snapshot.params['id']) {
      this.Editdata();
    }
  }

  addMaturityPaymentslistcontrols(): FormGroup {
    return this._FormBuilder.group({

      pTransTypeid: [''],
      pTransType: [''],
      pmemberName: [''],
      pMaturityjvdate: [''],
      pPaidAmount: [0],
      pAccountno: [0],
      pJvid: 0,
      pVoucherid:0,
      pOutstandingAmount: [0],
      pLateFeeAmount: [0]
    })
  }

//   PaymentTypeChange(event,PaymentTypes) {
// debugger
//     this.MaturityPaymentForm.controls.pmodofpayment.setValue('BANK');
    
//     let pPaymentType = this.MaturityPaymentForm.controls.pPaymentType.value;
//     this.GetMaturityMembers('Renewal','FD');
  
//   }


    GetMaturityMembers(PaymentType,Depositype) {
      debugger
      // this._MaturityPaymentService.GetMaturityMembers(PaymentType,Depositype).subscribe(result => {
      //   this.MaturityMemberDetails = result;
      // })

      this._MaturityPaymentService.getRenwalMembers(Depositype).subscribe(result => {
        this.MaturityMemberDetails = result;
      })
    }
    MemberChange(event) {
      debugger;
      //this.FdDetailsList = [];
      this.staticFDDetails=[];
      this.MaturityPaymentList = [];
      this.SavingsAccounts=[];
      this.allRowsSelected = false;
      this.showMaturitytab = false;
      this.ShowFixeddepositdetails = false;
      let PaymentType = this.MaturityPaymentForm.controls.pPaymentType.value;
      let paymentDate = this.MaturityPaymentForm.controls.pMaturitypaymentdate.value;

      this._MaturityPaymentService.GetMaturityMembersForDuplicate('Renewal','FD', event.pMembername).subscribe(result => {
        this.MaturityMemberDetails1 = result;

        this._CoJointmemberService._setfdMembercode(this.MaturityMemberDetails1[0].pMembercode, this.MaturityMemberDetails1[0].pMemberid);
      this.memberID = this.MaturityMemberDetails1[0].pMemberid;
      this.memberCODE = this.MaturityMemberDetails1[0].pMembercode;
      this.memberNAME = this.MaturityMemberDetails1[0].pMembername;
      this.pContactid = this.MaturityMemberDetails1[0].pContactid;
      this.pContactrefid = this.MaturityMemberDetails1[0].pContactrefid;
      this.pMemberTypeid = this.MaturityMemberDetails1[0].pMemberTypeid;
      this.pMemberType = this.MaturityMemberDetails1[0].pMemberType;
      this.pBranch = this.MaturityMemberDetails1[0].pBranch;
      this.pBranchId = this.MaturityMemberDetails1[0].pBranchId;

      //this.formValidationMessages.pTransTypeid = "";
      if (!isNullOrUndefined(event)) {
        //this.GetAccountDetails(this.MaturityMemberDetails1[0].pMembercode);
        this.MaturityPaymentForm.controls.pMembername.setValue(this.MaturityMemberDetails1[0].pMembername);
          //  // // // // 
        // this._MaturityPaymentService.GetMaturityFdDetails(PaymentType, event.pMemberid, this.datePipe.transform(new Date(paymentDate), "yyyy-MM-dd")).subscribe(result => {
        //   this.FdDetailsList = result;
        //   this.staticFDDetails = this.FdDetailsList.map(x => ({ ...x }));
        //   this.FdDetailsList.filter(function (df) { df.pStatus = false; df.IsRenewal = false; df.pRenewalAmount, df.Editable = true ,df.islatefee=false});
        //   if (PaymentType == "Payment") {
        //     this.ShowPaymentGrid = true;
        //     this.ShowRenewalGrid = false;
        //   }
        //   if (PaymentType == "Renewal") {
        //     this.ShowRenewal = true;
        //     this.ShowPaymentGrid = false;
        //     this.ShowRenewalGrid = true;
        //   }
  
        // })
        // this.MemberEvent = ({ pMemberId: event.pMemberid, pMemberName: event.pMembername, pMemberCode: event.pMembercode, pContactid: event.pContactid, pContactrefid: event.pContactrefid, pMemberTypeid: event.pMemberTypeid, pMemberType: event.pMemberType })
        // this.MaturityPaymentForm.controls.pBranch.setValue(event.pBranch);
        // this.MaturityPaymentForm.controls.pBranchId.setValue(event.pBranchId);
  
  //       this.maturityPaymentRenewalComponent.FdTranscationform['controls']['pChitbranchname'].setValue(event.pBranch)
  
  //  this.maturityPaymentRenewalComponent.FdTranscationform.controls.pChitbranchname.setValue(event.pBranch);
  //     this.maturityPaymentRenewalComponent.FdTranscationform.controls.pChitbranchId.setValue(event.pBranchId);
        
      }
      else {
        this.ShowmaturityBondsList = false;
        this.MemberEvent = "";
      }
      });     
      
    }

    GetMemberDetailsData(){
      debugger;
      this.mutationList = [];
   
      let PaymentType = this.MaturityPaymentForm.controls.pPaymentType.value;
      let paymentDate = this.MaturityPaymentForm.controls.pMaturitypaymentdate.value;
      if(this.memberID == ''){
        this._commonService.showWarningMessage('Please Select Member');
        return;
      }
      this._MaturityPaymentService.GetMaturityFdDetails(PaymentType, this.memberID, this.datePipe.transform(new Date(paymentDate), "yyyy-MM-dd")).subscribe(result => {
        this.mutationList = result;

        this.mutationList = this.mutationList.map(obj => {

          obj.pmemberName = this.memberNAME;   
          return obj;
        });

        if(this.FdDetailsList.length > 0){
          for (let index = 0; index < this.FdDetailsList.length; index++) {
            if(this.mutationList[0].pFdaccountno == this.FdDetailsList[index].pFdaccountno){
              this._commonService.showWarningMessage('Data With The Member'+ ' - ' + this.memberNAME + ' ' +'Already Exits');
              this.MaturityPaymentForm.controls.pMemberid.setValue('');
              return;
            }
            
          }
        }
        

        if (this.mutationList && Array.isArray(this.mutationList)) {

          this.FdDetailsList.push(this.mutationList); 
          this.FdDetailsList = [...this.FdDetailsList.flat()];
          this.addGridData = this.FdDetailsList;
        } else {
          console.error('mutationList is not an array:', this.mutationList);
        }
    
        console.log('Updated FdDetailsList:', this.FdDetailsList);
        
        this.staticFDDetails = this.FdDetailsList.map(x => ({ ...x }));
        this.FdDetailsList.filter(function (df) { df.pStatus = false; df.IsRenewal = false; df.pRenewalAmount, df.Editable = true ,df.islatefee=false});
        
          this.ShowRenewal = true;
          this.ShowPaymentGrid = false;
          this.ShowRenewalGrid = true;
        

      })
      this.MemberEvent = ({ pMemberId: this.memberID, pMemberName: this.memberNAME, pMemberCode: this.memberCODE, pContactid: this.pContactid, pContactrefid: this.pContactrefid, pMemberTypeid: this.pMemberTypeid, pMemberType: this.pMemberType })
      this.MaturityPaymentForm.controls.pBranch.setValue(this.pBranch);
      this.MaturityPaymentForm.controls.pBranchId.setValue(this.pBranchId);
      this.memberID = '';
    }

    gridDataDelete(row, rowIndex) {
      debugger;
      this.addGridData.splice(rowIndex, 1);
      this.FdDetailsList = this.addGridData;
      
    }

    SelectMaturitybond(event, dataItem, rowIndex) {
      debugger;
      if (event.target.checked) {
        this.FdDetailsList[rowIndex].pStatus = true;
        this.FdDetailsList[rowIndex].IsRenewal = true;
        this.FdDetailsList[rowIndex].islatefee = false;
        this.FdDetailsList[rowIndex].Editable = false;
        this.FdDetailsList[rowIndex].pRenewalAmount = "";
        this.totalRenewalAmount = this.FdDetailsList.reduce((sum, c) => sum + parseFloat(isNullOrEmptyString(c.pRenewalAmount) ? 0 : c.pRenewalAmount.toString().replace(/,/g, "")), 0)
        if (isNaN(this.totalRenewalAmount))
          this.totalRenewalAmount = 0;
        //const control = <FormGroup>this.MaturityPaymentForm['controls']['pMaturityPaymentlist'];
        //control.controls.pTransTypeid.setValue(dataItem.pFdaccountid);
        //control.controls.pPaidAmount.setValue(dataItem.pNetPayable);
        //control.controls.pAccountno.setValue(dataItem.pAccountno);
        //this.allRowsSelected = this.FdDetailsList.length == this.MaturityPaymentList.length ? true : false;
        //this.MaturityPaymentList.push(control.value);
  
  
  
  
      }
      else {
        this.FdDetailsList[rowIndex].pStatus = false;
        this.FdDetailsList[rowIndex].IsRenewal = false;
        this.FdDetailsList[rowIndex].islatefee = false;
        this.FdDetailsList[rowIndex].Editable = true;
        this.FdDetailsList[rowIndex].pNetPayable = this.staticFDDetails[rowIndex].pNetPayable
        this.FdDetailsList[rowIndex].pLateFeeAmount =this.staticFDDetails[rowIndex].pLateFeeAmount
        this.FdDetailsList[rowIndex].pPending_Amount = this.staticFDDetails[rowIndex].pPending_Amount
        this.FdDetailsList[rowIndex].pRenewalAmount = "";
            
  
        this.totalRenewalAmount = this.FdDetailsList.reduce((sum, c) => sum + parseFloat(isNullOrEmptyString(c.pRenewalAmount) ? 0 : c.pRenewalAmount.toString().replace(/,/g, "")), 0)
        if (isNaN(this.totalRenewalAmount))
          this.totalRenewalAmount = 0;
        //const index: number = this.MaturityPaymentList.findIndex(elem => { return elem.pTransTypeid === dataItem.pFdaccountid});
  
        //if (index !== -1) {
        //  this.MaturityPaymentList.splice(index, 1);
        //}
        //this.allRowsSelected = this.FdDetailsList.length == this.MaturityPaymentList.length ? true : false;
  
  
      }
    }

    selectAll(event, row, rowIndex) {
      //this.MaturityPaymentList = [];
      if (event.target.checked) {
        this.allRowsSelected = true;
        this.FdDetailsList.filter(x => x.pStatus = true);
        this.FdDetailsList.filter(x => x.IsRenewal = true);
        this.FdDetailsList.filter(x => x.islatefee = false);
        this.FdDetailsList.filter(x => x.Editable = false);
        this.totalRenewalAmount = this.FdDetailsList.reduce((sum, c) => sum + parseFloat(isNullOrEmptyString(c.pRenewalAmount) ? 0 : c.pRenewalAmount.toString().replace(/,/g, "")), 0)
        if (isNaN(this.totalRenewalAmount))
          this.totalRenewalAmount = 0;
        //const control = <FormGroup>this.MaturityPaymentForm['controls']['pMaturityPaymentlist'];
        //for (let i = 0; i < this.FdDetailsList.length; i++) {
        //  control.controls.pTransTypeid.setValue(this.FdDetailsList[i].pFdaccountid);
        //  control.controls.pPaidAmount.setValue(this.FdDetailsList[i].pNetPayable);
        //  control.controls.pAccountno.setValue(this.FdDetailsList[i].pAccountno);
        //  this.MaturityPaymentList.push(control.value);
        //}
      }
      else {
        this.allRowsSelected = false;
        this.FdDetailsList=this.staticFDDetails;
        this.FdDetailsList.filter(x => x.pStatus = false);
        this.FdDetailsList.filter(x => x.IsRenewal = false);
        this.FdDetailsList.filter(x => x.islatefee = false);
        this.FdDetailsList.filter(x => x.Editable = true);
        this.FdDetailsList.filter(x => x.pRenewalAmount = "");
        this.totalRenewalAmount = this.FdDetailsList.reduce((sum, c) => sum + parseFloat(isNullOrEmptyString(c.pRenewalAmount) ? 0 : c.pRenewalAmount.toString().replace(/,/g, "")), 0)
        if (isNaN(this.totalRenewalAmount))
          this.totalRenewalAmount = 0;
  
      }
    }

    ValidateRenewalAmount(event, dataItem, rowIndex) {
      debugger;
      if (parseFloat(event.target.value.toString().replace(/,/g, "")) > parseFloat(dataItem.pPending_Amount)) {
        this._commonService.showWarningMessage("Renewal Amount Should not be greter than Pending Amount..")
        this.FdDetailsList[rowIndex].IsRenewal = true;
        this.FdDetailsList[rowIndex].pRenewalAmount = "";
      }
      else {
        this.totalRenewalAmount = this.FdDetailsList.reduce((sum, c) => sum + parseFloat(isNullOrEmptyString(c.pRenewalAmount) ? 0 : c.pRenewalAmount.toString().replace(/,/g, "")), 0)
        if (isNaN(this.totalRenewalAmount))
          this.totalRenewalAmount = 0;
      }
    }

    checkRenewalAmount(event, rowIndex) {
      this.FdDetailsList[rowIndex].IsRenewal = isNullOrEmptyString(event.target.value) ? true : false;
      this.FdDetailsList[rowIndex].pRenewalAmount = isNullOrEmptyString(event.target.value) ? "" : event.target.value;
      console.log(event.target.value);
    }
    CheckLateFeeAmount(event,rowIndex,dataItem) {
      debugger;
           let OutstandingAmount =isNullOrEmptyString( this.staticFDDetails[rowIndex].pNetPayable)? 0 : this.staticFDDetails[rowIndex].pNetPayable.toString().replace(/,/g, "");
           let Oldlatefeeamount=isNullOrEmptyString(this.staticFDDetails[rowIndex].pLateFeeAmount)?0 : this.staticFDDetails[rowIndex].pLateFeeAmount.toString().replace(/,/g, "");
           let paidamount=isNullOrEmptyString(this.staticFDDetails[rowIndex].pPaid_Amount) ? 0 : this.staticFDDetails[rowIndex].pPaid_Amount.toString().replace(/,/g, "");
  
           let NewLateFeeAmount=isNullOrEmptyString(event.target.value)? 0 : event.target.value;
           let oustandingwithoutLFee=Number(OutstandingAmount)-Number(Oldlatefeeamount);
  
           //this.FdDetailsList[rowIndex].pLateFeeAmount.push(NewLateFeeAmount);
           this.FdDetailsList[rowIndex].pNetPayable=Number(oustandingwithoutLFee)+Number(NewLateFeeAmount.toString().replace(/,/g, ""));
           this.FdDetailsList[rowIndex].pPending_Amount=Number(this.FdDetailsList[rowIndex].pNetPayable)-Number(paidamount);
           this.FdDetailsList=[...this.FdDetailsList]
      if(!isNullOrEmptyString(event.target.value)){
       this.FdDetailsList[rowIndex].islatefee =false;
       this.FdDetailsList[rowIndex].pLateFeeAmount=event.target.value;
      }
      else{
        this.FdDetailsList[rowIndex].islatefee =true;
         this.FdDetailsList[rowIndex].pLateFeeAmount ='';
      }
         
  
      
    }


    AddRenewal() {
        debugger;
        let data = [];
        data = this.FdDetailsList.filter(item => item.pStatus == true);
        if (data.length == 0) {
          this._commonService.showWarningMessage("Please Select Atleast One Checkbox")
        }
        else {
          let FdAccountnos = "";
    
          for (let i = 0; i < data.length; i++) {
            FdAccountnos += '@' + data[i].pFdaccountno + '@,'
          }
          let count = data.filter(item => isNullOrEmptyString(item.pRenewalAmount)).length;
          if (count == 0) {
            FdAccountnos = FdAccountnos.toString().replace(/@/g, "'").slice(0, -1)
            this.GetFdTransactionDetails(FdAccountnos);
            this.ShowRenewalFdTransaction = true;
            this.disablesavebutton = false;
    
          }
          //this.showchit = true

          this.SelectMemberFlag = true;
    
        }
      }

      GetFdTransactionDetails(FdAccountnos) {
        if (!isNullOrEmptyString(FdAccountnos)) {
          this._MaturityPaymentService.GetFdTransactionDetails(FdAccountnos).subscribe(result => {
            debugger;
            let JointmemberDetails = [];
            let NomineeDetails = [];
            this.FdTranscationform.controls.pChitbranchname.setValue(this.MaturityPaymentForm.controls.pBranch.value);
            this.FdTranscationform.controls.pChitbranchId.setValue(this.MaturityPaymentForm.controls.pBranchId.value);




           // let JointmemberComponent = this.maturityPaymentRenewalComponent.fdJointmemberComponent;
            //this.maturityPaymentRenewalComponent.RenewalAmount = this.totalRenewalAmount;
    
           // this.maturityPaymentRenewalComponent.FdTranscationform.controls.pChitbranchname.setValue(this.MaturityPaymentForm.controls.pBranch.value); DONE
           // this.maturityPaymentRenewalComponent.FdTranscationform.controls.pChitbranchId.setValue(this.MaturityPaymentForm.controls.pBranchId.value);
    
            JointmemberDetails = result["fdMembersandContactDetailsList"];
            NomineeDetails = result["fdMemberNomineeDetailsList"];
            this.MemberChanges(this.MemberEvent);
            // if (JointmemberDetails.length > 0) {
            //   JointmemberComponent.ShowJointmemberstable = true;
            //   JointmemberComponent.ShowJointmembers = true;
            //   JointmemberComponent.JointMemberAndNomineeForm.controls.pIsjointMembersapplicableorNot.setValue(true);
            //   JointmemberComponent.fdMembersandContactDetailsList = JointmemberDetails
            // }
            //JointmemberComponent.nomineeDetails.nomineeList = NomineeDetails;
            // this.maturityPaymentRenewalComponent.fdJointmemberComponent.fdMembersandContactDetailsList = JointmemberAndNmineeDetaails["fdMembersandContactDetailsList"];
            //this.fdJointmemberComponent.nomineeDetails.nomineeList = JointmemberAndNmineeDetaails["FDMemberNomineeDetailsList"];
          })
        }
      }

    GetAccountDetails(Membercode) {
      debugger
      this._RdReceiptService.GetAccountDetails(Membercode).subscribe(json => {
      debugger;
      if(json){
          this.SavingsAccounts = json["rdSavingsAccountDetailsDTOList"];
      }
       
      });
    }


    GetBranchdetails() {

      this._fdrdttranscationservice.Getbranchdetails().subscribe(res => {
        debugger
        this.Branchdetails = res
        console.log("branch details", this.Branchdetails)
      })
  
    }
    GetBranchstatus() {
      debugger
      this._fdrdttranscationservice.Getbranchstatus().subscribe(json => {
        debugger
        console.log(json)
        if (json) {
          console.log("chit status", json)
          this.showchit = true
          this.GetBranchdetails()
          this.GetApplicanttypes()
        }
      })
    }

    chitbranchchanges(event) {
      debugger;
      this.FdTranscationform.controls.pChitbranchId.setValue(event.pBranchId)
      //this.FdTranscationform.controls.pChitbranchname.setValue(event.pBranchname)
    }

    GetApplicanttypes() {
      debugger
      this._fdrdttranscationservice.GetapplicantTypes("Individual").subscribe(json => {
        debugger;
        this.membertypedetails = json['_FIMembertypeDTOList'];
  
  
        this.ApplicantTypes = json['_FIApplicantTypeDTO'];
  
        this.FdTranscationform.controls.pMembertypeId.setValue(this.membertypedetails[0].pMembertypeId)
        let obj = ({ pMemberType: this.membertypedetails[0].pMemberType })
        this.MemberTypeChange(obj)
  
  
      })
    }

    MemberTypeChange(event) {
      debugger
      // this.FdTranscationform.controls.pMemberName.setValue("")
      if (event != undefined) {
        this.SelectedMembertype = event.pMemberType
        //alert(this.SelectedMembertype+" "+439);
        //this.FdTranscationform.controls.pMemberName.setValue(event.pMemberName)
        this.FdTranscationform.controls.pMemberType.setValue(event.pMemberType)
        this.GetMemberDetails("Individual", this.SelectedMembertype)
        //   this.FdTranscationform.controls.pFdConfigId.setValue("")
        // this.GetFdSchemes(this.Applicanttype, this.SelectedMembertype)
        //this.FdTranscationform.controls.pFdConfigId.setValue("")
  
        // var multicolumncombobox: any;
        // multicolumncombobox = $("#MemberData").data("kendoMultiColumnComboBox");
        // if (multicolumncombobox)
        //   multicolumncombobox.value("");
        // this.GetDataBasedOnTenure()
      }
      else {
        this.GetMemberDetails("Individual", "")
      }
  
    }
    GetMemberDetails(contacttype, membertype) {
      debugger
      if (membertype != "") {
        this._fdrdttranscationservice.GetMembersForFd("Individual", this.SelectedMembertype).subscribe(json => {
          debugger
          //console.log("Member details",json);
          this.memberdetails = json;
          $("#MemberData").kendoMultiColumnComboBox({
            dataTextField: "pMemberName",
            dataValueField: "pMemberId",
            height: 400,
            columns: [
              { field: "pMemberName", title: "Member Name", width: 200 },
              { field: "pMemberCode", title: "Member code", width: 200 },
              { field: "pContactnumber", title: "Contact Number", width: 200 },
  
            ],
            filter: "contains",
            filterFields: ["pMemberName", "pMemberId", "pContactnumber"],
            dataSource: this.memberdetails,
            select: this.SelectMemberData,
            change: this.CancelClick
          });
  
        })
      }
      else {
        this.memberdetails = ""
      }
  
    }
    CancelClick() {
      debugger
      window['CallingFunctionToHideCard'].componentFn()
    }
    SelectMemberData(e) {
      debugger
      if (e.dataItem) {
        var dataItem = e.dataItem;
        window['CallingFunctionOutsideMemberData'].componentFn(dataItem)
  
      }
    }
    MemberChanges(event) {
      debugger
      //console.log(event.pMemberId);
      if (event != undefined) {
        this.FdTranscationform.controls.pFdConfigId.setValue("");
        this.FdTranscationform.controls.pApplicantType.setValue("");
        this.formValidationMessages.pApplicantType = "";
        this.formValidationMessages.pFdConfigId = "";
  
        //this.clearfields()
        this.Memberid = event.pMemberId
        this.Membercode = event.pMemberCode
        this.Contactid = event.pContactid;
        this.contactrefid = event.pContactrefid;
        this.MemberTypeid=event.pMemberTypeid;
        this.SelectedMembertype=event.pMemberType;
        this.MemberType=event.pMemberType;
  
  
        //this.FdtranscationErrors.pMemberId=''
        this.FdTranscationform.controls.pContactid.setValue(this.Contactid);
        this.FdTranscationform.controls.pContactrefid.setValue(this.contactrefid);
        let data = ({ pMemberId: event.pMemberId, pMemberCode: event.pMemberCode, pMemberName: event.pMemberName })
        this._fdrdttranscationservice._setfdMembercode(event.pMemberCode, event.pMemberId)
        this.GetContactDetails(data)
        // this.FdTranscationform.controls.pFdConfigId.setValue("")
  
      }
    }
    GetContactDetails(event) {
      debugger
      if (event.pMemberId && event.pMemberId != undefined && event.pMemberId != '') {
        this.savingtranscationservice.GetContactDetails(event.pMemberId).subscribe(json => {
          debugger
          // this.ContactDetails = json;
         
          this.MemberidSave = event.pMemberId;
          this.FdTranscationform.controls.pMemberId.setValue(event.pMemberId)
          this.FdTranscationform.controls.pMemberCode.setValue(event.pMemberCode)
          this.FdTranscationform.controls.pMemberName.setValue(event.pMemberName)
          //this.FdTranscationform.controls.pContactid.setValue(json['pContactid']);
          //this.FdTranscationform.controls.pContactrefid.setValue(json['pContactreferenceid']);
          //this.FdTranscationform.controls.pContactid.setValue(json['pContactid']);
          //this.FdTranscationform.controls.pContactrefid.setValue(json['pContactreferenceid']);
        })
      }
  
    }
    ApplicanttypeChange(event) {
      debugger
      if (event != undefined) {
        this.Applicanttype = event.pApplicantType
        this.FdTranscationform.controls.pFdConfigId.setValue("")
        //this.clearfields()
        this.GetFdSchemes(this.Applicanttype, this.MemberType)
  
        this.GetDataBasedOnTenure()
      }
    }

    GetDataBasedOnTenure() {
        debugger
        console.log(this.Applicanttype);
        console.log(this.SelectedMembertype);
        console.log(this.Fdconfigid);
        console.log(this.Fdname);
        console.log(this.Tenure);
        console.log(this.TenureMode);
        console.log(this.depositamount);
        
        if (this.Applicanttype != undefined && this.SelectedMembertype != undefined && this.Fdconfigid != undefined &&
          this.Fdname != undefined && this.Tenure != undefined && this.Tenure != "" && this.TenureMode != "" && this.TenureMode != undefined && this.depositamount != undefined) {
          debugger
          this._fdrdttranscationservice.GetDataBasedOnTenure(this.Applicanttype, this.SelectedMembertype, this.Fdconfigid,
            this.Fdname, this.Tenure, this.TenureMode, this.depositamount).subscribe(json => {
              console.log("details", json)
              if (this.FdCalculationmode != null) {
                if (this.FdCalculationmode == "TABLE") {
                  this.showIntrestcompounding = false
    
                  this.Showmaturityamountforintrest = false;
                  this.ShowIntrestamountforintrest = false;
                  this.Showmaturityamount = false;
                  this.ShowIntrestamount = false;
                  this.DepositAmountBasedontable = true
                  this.DepositAmountBaseconintrest = false;
    
                  // this.FdTranscationform.controls.pInterestTenureMode.setValue(json['pInterestTenureMode'])
                  // this._fdrdttranscationservice.GetTenureDetails(this.FdTranscationform.controls.pFdname, this.Fdconfigid)
                  // this.FdTranscationform.controls.pInterestTenure.setValue(json['pInterestTenure'])
                  this.FdSchemeDetails = json['fdInterestPayoutList']
                  //this.FdTranscationform.controls.pDepositAmount.setValue(json['pDepositAmount'])
                  //  this.FdTranscationform.controls.pMaturityAmount.setValue(json['pMaturityAmount'])
                  //  this.FdTranscationform.controls.pInterestAmount.setValue(json['pInterestAmount'])
                  this.FdTranscationform.controls.pInterestRate.setValue(0)
    
                }
                else {
                  if (json['fdInterestPayoutList'] != null) {
                    this.FdSchemeDetails = json['fdInterestPayoutList'];
                    this.showIntrestcompounding = true;
    
                    this.Showmaturityamount = false;
                    this.ShowIntrestamount = false;
    
                    this.Multiplesof = json['pMultiplesof']
                    this.IntrestCompounding = json['pInterestType']
                    this.FdTranscationform.controls.pCaltype.setValue(json['pCaltype'])
                    this.Caltype = json['pCaltype']
                    //this.FdTranscationform.controls.pDepositAmount.setValue(0)
                    this.FdTranscationform.controls.pMaturityAmount.setValue(0)
                    this.Investmentperiodfrom = json['pInvestmentPeriodFrom']
                    this.CalculationforInvestmentperiodfrom(this.Investmentperiodfrom)
                    this.Investmentperiodto = json['pInvestmentPeriodTo']
                    this.CalculationforInvestmentperiodTo(this.Investmentperiodto)
                    this.IntrestrateFrom = json['pInterestRateFrom'];
                    this.IntrestrateTo = json['pInterestRateTo'];
                    this.MaxDepositAmount = json['pMaxdepositAmount']
                    this.MinDepositAmount = json['pMinDepositAmount']
                    //this.CalculationforIntrestRateFrom(this.IntrestrateFrom)
                    this.Valueper100 = json['pInterestOrValueForHundred']
                    this.FdTranscationform.controls.pInterestType.setValue(json['pInterestType'])
    
                  }
                  else {
                    this.FdSchemeDetails = "";
                    this._commonService.showWarningMessage("Enter Valid Tenure");
                    //this.clearfields()
                  }
    
    
                  // this.FdTranscationform.controls.pInterestPayOut.setValue(json['pInterestPayOut'])
                }  
              }
    
            })
    
        }
    
      }

      CalculationforInvestmentperiodfrom(Investmentperiodfrom) {
        debugger
        if (Investmentperiodfrom != 0 && Investmentperiodfrom != null) {
          let a = Investmentperiodfrom.split(' ')
          let Noofdaysinyears = (a[0].slice(0, -1)) * 365
          let Noofdaysinmonths = (a[0].slice(0, -1)) * 30
          let Noofdays = Number((a[0].slice(0, -1)))
          this.Totalnooffromdays = Noofdaysinyears + Noofdaysinmonths + Noofdays
        }
        else {
    
        }
    
      }
      CalculationforInvestmentperiodTo(InvestmentperiodTo) {
        debugger
        if (InvestmentperiodTo != 0 && InvestmentperiodTo != null) {
          let a = InvestmentperiodTo.split(' ')
          let Noofdaysinyears = (a[0].slice(0, -1)) * 365
          let Noofdaysinmonths = (a[0].slice(0, -1)) * 30
          let Noofdays = Number((a[0].slice(0, -1)))
          this.Totalnooftodays = Noofdaysinyears + Noofdaysinmonths + Noofdays
        }
    
      }
      calculateMaturityDate() {
        debugger
        let tenuremode = this.FdTranscationform.controls.pInterestTenureMode.value;
        let tenure = this.FdTranscationform.controls.pInterestTenure.value;
        let depositdate = this.FdTranscationform.controls.pDepositDate.value;
        var maturityDate = new Date(depositdate);
        if (tenuremode == 'Days') {
          maturityDate.setDate(depositdate.getDate() + Number(tenure));
          this.FdTranscationform.controls.pMaturityDate.setValue(maturityDate);
        } else if (tenuremode == 'Months') {
          maturityDate.setMonth((depositdate.getMonth()) + Number(tenure));
          // maturityDate.setDate(maturityDate.getDate()-1);
          this.FdTranscationform.controls.pMaturityDate.setValue(maturityDate);
        } else {
          maturityDate.setFullYear(depositdate.getFullYear() + Number(tenure));
          // maturityDate.setDate(maturityDate.getDate()-1);
          this.FdTranscationform.controls.pMaturityDate.setValue(maturityDate);
        }
      }

    GetFdSchemes(Applicanttype, membertype) {
      debugger
      if (Applicanttype != undefined || membertype != undefined) {
        this._fdrdttranscationservice.GetFdSchemes(this.Applicanttype, this.SelectedMembertype).subscribe(json => {
          debugger
          this.FdSchemes = json
          //console.log("fdschemename",json);
  
  
  
        })
      }
  
    }

    Depositchanges(event) {
        debugger
        this.depositamount = this._commonService.removeCommasForEntredNumber(event.target.value)
        if (this.depositamount  < this.RenewalAmount) {
          this._commonService.showWarningMessage("Advance Amount Is Should not be Less than Total Renewal Amount.");
          this.FdTranscationform.controls.pDepositAmount.setValue("");
        }
        else {
          
          this.GetDataBasedOnTenure()
          this.TenureMode = "";
          this.Tenure = "";
          this.FdTranscationform.controls.pInterestTenure.setValue("");
          this.FdTranscationform.controls.pInterestTenureMode.setValue("");
          this.FdTranscationform.controls.pInterestRate.setValue("");
          this.FdTranscationform.controls.pInterestPayOut.setValue("");
          this.IntrestAmount = "";
          this.MaturityAmnt = "";
          this.intrestamountontable = "";
          this.Matrityamountontable = "";
          // if(this.FdCalculationmode=='TABLE')
          // {
    
          // }
          // else
          // {
          //   if(this.Multiplesof!=0)
          //   {
          //     this.calculatedepositamount= this.depositamount%this.Multiplesof  
          //   if (this.depositamount >= this.MinDepositAmount &&  this.depositamount <= this.MaxDepositAmount)
          //  {
          //   this.CalculationForDepositAmount(this.calculatedepositamount)
    
          //   }
          //   else{
          //     this.commonservice.showWarningMessage("Deposit Amount is in between " + this.MinDepositAmount + "&" + this.MaxDepositAmount)
          //     this.FdTranscationform.controls.pDepositAmount.setValue("")
          //   }
          //   }
          //   else{
          //     if (this.depositamount < this.MinDepositAmount ||  this.depositamount > this.MaxDepositAmount)
          //     {
          //       this.commonservice.showWarningMessage("Deposit Amount is in between " + this.MinDepositAmount + "&" + this.MaxDepositAmount)   
          //       this.FdTranscationform.controls.pDepositAmount.setValue("")   
          //      }
          //   }
          // }
          this.formValidationMessages = {}
          this.GetDepositCount()
          this.ShowIntrestamountforintrest=false;
          this.Showmaturityamountforintrest=false;
          this.showcalculate=false;
        }
      }
      GetDepositCount() {
        debugger
        this._fdrdttranscationservice.GetDepositCount(this.Fdname, this.depositamount,this.SelectedMembertype).subscribe(res => {
          console.log("deposit count", res)
          let count = res
          if (!count) {
            this._commonService.showWarningMessage("Enter Valid Amount");
            this.FdTranscationform.controls.pDepositAmount.setValue("");
            this.depositamount = ""
          }
        })
      }
      CalculationForDepositAmount(depositamount) {
        if (this.calculatedepositamount != 0) {
          this._commonService.showWarningMessage("Deposit Amount is Multiples of" + this.MinDepositAmount + "&" + this.MaxDepositAmount)
          this.FdTranscationform.controls.pDepositAmount.setValue("")
        }
    
      }
      CalculationforTenure(tenuremode, tenure) {
        debugger;
    
        if (this.Totalnooffromdays != undefined || this.Totalnooftodays != undefined) {
          if (tenuremode == "Months") {
            let DaysinMonths = Number(tenure * 30)
            if (DaysinMonths < this.Totalnooffromdays || DaysinMonths > this.Totalnooftodays) {
              this._commonService.showWarningMessage("No of Days in between " + this.Totalnooffromdays + "&" + this.Totalnooftodays)
              this.FdTranscationform.controls.pInterestTenureMode.setValue("")
            }
          }
          else if (tenuremode == "Years") {
            let DaysinYears = Number(tenure * 365)
            if (DaysinYears < this.Totalnooffromdays || DaysinYears > this.Totalnooftodays) {
              this._commonService.showWarningMessage("No of Days in between " + this.Totalnooffromdays + "&" + this.Totalnooftodays)
              this.FdTranscationform.controls.pInterestTenureMode.setValue("")
            }
          }
          else if (tenuremode == "Days") {
            let Days = Number(tenure);
            if (Days < this.Totalnooffromdays || Days > this.Totalnooftodays) {
              this._commonService.showWarningMessage("No of Days in between " + this.Totalnooffromdays + "&" + this.Totalnooftodays)
              this.FdTranscationform.controls.pInterestTenureMode.setValue("")
            }
          }
        }
    
    
      }
      DepositDatechanges() {
        debugger;
    
        this.calculateMaturityDate()
      }


      Fdschemechange(event) {
          debugger;
          if (event != undefined) {
            this.FdNameandCode = event.pFdnameCode
            this.FdCalculationmode = event.pFdCalculationmode;
            //this.FdTranscationform.controls.pFdConfigId.setValue(event.pFdConfigId)
            this.Fdconfigid = event.pFdConfigId;
            this.Fdname = event.pFdname;
      
            this.FdTranscationform.controls.pFdname.setValue(event.pFdname)
            this.FdTranscationform.controls.pFdcode.setValue(event.pFdcode)
            this.FdTranscationform.controls.pFdnameCode.setValue(event.pFdnameCode)
            this.FdTranscationform.controls.pFdCalculationmode.setValue(event.pFdCalculationmode);
            //this.clearfields()
            // this._fdrdttranscationservice.GetFdSchemeDetails(event.pFdDetailsRecordid).subscribe(json => {
            //   debugger;
            //   console.log(json);
            //  
            if (this.FdCalculationmode == "TABLE") {
              this.tenureontable = true;
              this.DepositAmountBasedontable = true;
              this.DepositAmountBaseconintrest = false;
      
              this.showtenureonintrest = false;
              this.showintrestrate = false;
              this.showcalculate = false;
              this.IntrestCompounding = false;
              this.GetTotalDetails(this.Fdname, this.Applicanttype)
      
            }
            else {
              this.GetDataBasedOnTenure()
              this.tenureontable = false;
              this.showtenureonintrest = true;
              this.DepositAmountBasedontable = false;
              this.DepositAmountBaseconintrest = true;
              //this.showintrestrate = true;
              //this.showcalculate = true;
              this.GetTotalDetails(this.Fdname, this.Applicanttype)
              this.GetTenureModes(this.Fdname, this.Applicanttype)
      
            }
          }
      
        }
        Tenuremodechanges(event) {
          debugger
          this.buttontype == "edit"
          this.TenureMode = this.buttontype == "edit" ? event : event.target.value
      
          if (this.FdCalculationmode == "TABLE") {
            this.Tenuremodedetails=[];
      this.FdTranscationform.controls.pInterestTenure.setValue('');
      this.DepositAmountdetails=[];
      this.MaturityPaymentForm.controls.pDepositAmount.setValue('');
      this.FdSchemeDetails=[];
      this.FdTranscationform.controls.pInterestPayOut.setValue('');
      this.ShowIntrestamount=false;
      this.Showmaturityamount=false;
            this._fdrdttranscationservice.GetTenureDetails(this.Fdname, this.Fdconfigid, this.TenureMode,this.SelectedMembertype).subscribe(json => {
              debugger
              console.log("tenure mode details", json)
              this.Tenuremodedetails = json
            })
            //this.GetDataBasedOnTenure()
      
          }
          else {
            if (this.TenureMode != undefined && this.Tenure != "" && this.TenureMode != "" && this.Tenure != undefined) {
              // this.CalculationforTenure(this.TenureMode, this.Tenure)
      
              //this.GetTenureAndIntrestRate();
              this.FdSchemeDetails=[];
              this.FdTranscationform.controls.pInterestPayOut.setValue('');
              this.ShowIntrestamountforintrest=false;
              this.Showmaturityamountforintrest=false;
              this.GetDataBasedOnTenure()
              this.calculateMaturityDate()
              this.showcard = true
            }
          }
      
        }
        GetTenureAndIntrestRate() {
          debugger
          if (this.TenureMode != "" && this.Tenure != "") {
            this._fdrdttranscationservice.GetTenureAndIntrestRate(this.Fdname, this.depositamount, this.Tenure, this.TenureMode, this.Intrestpayout,this.SelectedMembertype).subscribe(res => {
              debugger
              //commisiontype:res['pReferralcommisiontype'],commisionvalue:res['pReferralCommisionvalue']}
              this._fdrdttranscationservice._setcommisiontype(res['pReferralcommisiontype'], res['pReferralCommisionvalue']);
              this._CoReferralService._setcommisiontype(res['pReferralcommisiontype'], res['pReferralCommisionvalue']);
              console.log("tenuredetails", res);
              if (res['pTenureCount'] != 0) {
                if (res['pMinInterestRate'] && res['pMaxInterestRate'] != 0) {
                  this.showintrestrate = true;
                  this.showcalculate = true;
                  this.showvalueper100 = false;
                  this.Intrestratedisable = false;
                  this.IntrestrateFrom = res['pMinInterestRate'];
                  this.ratepersquareyard = res['pRatePerSquareYard']
                  this.Intrestrate = this.IntrestrateFrom;
                  this.FdTranscationform.controls.pInterestRate.setValue(this.IntrestrateFrom)
                  this.IntrestrateTo = res['pMaxInterestRate'];
                  if (this.interestvalidation != 0 && this.interestvalidation != undefined && this.interestvalidation != null) {
                    this.callintrestratevalidation();
                  }
                }
                else {
      
                  this.Intrestratedisable = true;
                  this.showcalculate = true;
                  this.ratepersquareyard = res['pRatePerSquareYard']
                  this.Intrestrate = res['pValuefor100']
                  this.FdTranscationform.controls.pInterestRate.setValue(res['pValuefor100'])
                  this.showvalueper100 = true;
                  this.showintrestrate = false;
                }
      
      
      
      
                this.GetDataBasedOnTenure()
      
      
              }
              else {
                this._commonService.showWarningMessage("Enter valid tenure");
                this.FdTranscationform.controls.pInterestTenure.setValue("");
                this.FdTranscationform.controls.pInterestTenureMode.setValue("");
                this.FdTranscationform.controls.pInterestRate.setValue(0)
                this.TenureMode = "";
                this.Tenure = "";
      
                this.FdTranscationform.controls.pInterestPayOut.setValue("")
              }
            })
          }
      
        }

        callintrestratevalidation() {
          debugger
          if (this.IntrestrateFrom > 0 && this.IntrestrateTo > 0) {
            if (this.interestvalidation < this.IntrestrateFrom || this.interestvalidation > this.IntrestrateTo) {
              this._commonService.showWarningMessage("Enter valid Interest Rate")
              this.FdTranscationform.controls.pInterestRate.setValue("")
            }
            else {
              this.FdTranscationform.controls.pInterestRate.setValue(this.interestvalidation);
              this.Intrestrate = this.interestvalidation
            }
          }
      
        }
      
        Tenurechanges(event) {
          debugger
          //this.DepositAmountdetails=[]
          this.buttontype == "edit"
          this.Tenure = this.buttontype == "edit" ? event : event.target.value
          if (this.FdCalculationmode == "TABLE") {
            this.DepositAmountdetails=[];
      this.FdTranscationform.controls.pDepositAmount.setValue('');
      this.FdSchemeDetails=[];
      this.FdTranscationform.controls.pInterestPayOut.setValue('');
      this.ShowIntrestamount=false;
      this.Showmaturityamount=false;
            this._fdrdttranscationservice.GetDepositAmount(this.Fdname, this.Fdconfigid, this.TenureMode, this.Tenure,this.SelectedMembertype).subscribe(json => {
              debugger
              this.DepositAmountdetails = json;
              this.DepositAmountBasedontable = true;
              if (this.buttontype == "new") {
                this.FdTranscationform.controls.pDepositAmount.setValue('')
              }
              else {
      
              }
      
              console.log("deposit amounts", this.DepositAmountdetails);
      
      
            })
      
            //this.GetDataBasedOnTenure()
      
          }
          else {
            if (this.TenureMode != undefined && this.Tenure != "" && this.TenureMode != "") {
           
              this.FdTranscationform.controls.pInterestTenureMode.setValue('');
              this.FdSchemeDetails=[];
              this.FdTranscationform.controls.pInterestPayOut.setValue('');
              this.ShowIntrestamountforintrest=false;
              this.Showmaturityamountforintrest=false;
              // this.CalculationforTenure(this.TenureMode, this.Tenure);
              // this.GetDataBasedOnTenure()
              this.showcard = true
              this.calculateMaturityDate()
              //this.GetTenureAndIntrestRate()
              this.GetDataBasedOnTenure()
      
            }
          }
      
        }
        GetTenureModes(Fdname, Applicanttype) {
          debugger
          this._fdrdttranscationservice.GetTenureModesnames(Fdname, Applicanttype,this.SelectedMembertype).subscribe(json => {
            this.tenuremodelist = json
            console.log("tenuremode details", json)
          })
        }

        GetTotalDetails(Fdname, applicantype) {
          debugger
          this._fdrdttranscationservice.GetTotalDetails(Fdname, applicantype,this.SelectedMembertype).subscribe(json => {
            debugger
            console.log("totaldetails", json)
            this.griddata = json;
            this.showgrid = true
          })
        }
       
      
        DepositAmountontablechanges(event) {
          debugger
          this.depositamountontable = parseInt(event.target.value)
          this.callintrestAmount()
      
          this.FdSchemeDetails=[];
          this.FdTranscationform.controls.pInterestPayOut.setValue('');
          this.ShowIntrestamount=false;
          this.Showmaturityamount=false;
        }   
  
        callintrestAmount() {
          this._fdrdttranscationservice.InterestamountsofTable(this.Fdname, this.Fdconfigid, this.TenureMode, this.Tenure, this.depositamountontable,this.SelectedMembertype).subscribe
            (json => {
              this.intrestamountontable = parseInt(json[0].pInterestAmount)
              debugger
              if (this.intrestamountontable > 0) {
                this.ShowIntrestamount = false;
                this.ShowIntrestamountforintrest = false;
                this.FdTranscationform.controls.pInterestAmount.setValue(json[0].pInterestAmount)
                this.CallMaturityAmount()
              }
            })
        }

        Intrestpayoutchanges(event) {
          debugger
          if (event != undefined) {
          this.Intrestpayout = event.pInterestPayOut;
      
          //this.Showmaturityamountforintrest=true;
          this.GetTenureAndIntrestRate()
          //this.ShowIntrestamountforintrest=true;
          this.ShowIntrestamountforintrest=false;
          this.Showmaturityamountforintrest=false;
          }
          if(this.DepositAmountBasedontable==true){
            this.ShowIntrestamount=true;
            this.Showmaturityamount=true;
          }
        }
        Intrestratechanges(event) {
          debugger
      
      
          this.ShowIntrestamountforintrest=false;
          this.Showmaturityamountforintrest=false;
          this.GetTenureAndIntrestRate()
      
          this.Intrestrate = this._commonService.removeCommasForEntredNumber(event.target.value);
          this.interestvalidation = this.Intrestrate
          // if(this.IntrestrateFrom >0 && this.IntrestrateTo>0)
          // {
          //   if(event.target.value  < this.IntrestrateFrom || event.target.value > this.IntrestrateTo)
          //   {
          //     this.commonservice.showWarningMessage("Intrest rate is in between" + this.IntrestrateFrom + "&" + this.IntrestrateTo)
          //     this.FdTranscationform.controls.pInterestRate.setValue("")
          //   }
          // }
          this.GetDataBasedOnTenure()
      
        }

        CallMaturityAmount() {
          debugger
          this._fdrdttranscationservice.MaturityamountsofTable(this.Fdname, this.Fdconfigid, this.TenureMode, this.Tenure, this.depositamountontable, this.intrestamountontable,this.SelectedMembertype).subscribe
            (json => {
              debugger
              this.Matrityamountontable = parseInt(json[0].pMaturityAmount)
              if (this.Matrityamountontable > 0) {
                this.Showmaturityamount = false;
                this.Showmaturityamountforintrest = false;
      
                this.FdTranscationform.controls.pMaturityAmount.setValue(json[0].pMaturityAmount)
                this.CallIntrestPayout()
              }
      
            })
        }
        CallIntrestPayout() {
          debugger
          this._fdrdttranscationservice.PayoutsofTable(this.Fdname, this.Fdconfigid, this.TenureMode, this.Tenure, this.depositamountontable, this.intrestamountontable, this.Matrityamountontable).subscribe(json => {
            console.log("FdSchemeDetails Intrest Payout",json);
            this.FdSchemeDetails = json
          })
        }

        GetintrestAmount() {
          debugger
          let isvalid = true
          let tenuremode = this.TenureMode.toUpperCase()
          let tenure = parseInt(this.Tenure)
          let intrestpayout = this.Intrestpayout.toUpperCase()
          let depositamount = parseInt(this.depositamount)
          let intrestcompunding = this.IntrestCompounding.toUpperCase()
      
          if(this.Intrestpayout == 'Monthly'){
            this.Caltype = 'Interest Rate'
            }
            
      
            if(this.Intrestpayout == 'On Maturity'){
              this.Caltype = 'Value Per 100'        
              }
      
          this._fdrdttranscationservice.GetIntrestAmount(tenuremode, tenure, depositamount,
            intrestpayout, intrestcompunding, this.Intrestrate, this.Caltype).subscribe(res => {
              debugger
              console.log("maturiti amount", res)
              this.Showmaturityamountforintrest = true;
              this.ShowIntrestamountforintrest = true;
              this.FdTranscationform.controls.pMaturityAmount.setValue(res[0].pMatueritytAmount)
              this.MaturityAmnt = res[0].pMatueritytAmount
              this.IntrestAmount = res[0].pInterestamount
              this.FdTranscationform.controls.pInterestAmount.setValue(res[0].pInterestamount)
              isvalid = true;
            })
          return isvalid
        }


        saveMaturityPayment() {
          debugger;
          try {
            this.disablesavebutton = true;
            this.savebutton = 'Processing';
            let PaymentType = this.MaturityPaymentForm.controls.pPaymentType.value;
            let IsValid: boolean = true;
            if (isNullOrEmptyString(PaymentType)) {
              this.disablesavebutton = false;
              this.savebutton = 'Save & Continue';
              this.checkValidations(this.MaturityPaymentForm, IsValid);
            }
            // if (PaymentType == "Payment") { this.SavePayments(); }
            if (PaymentType == "Renewal") {
              let data = [];
              data = this.FdDetailsList.filter(item => item.pStatus == true);
              let count = data.filter(item => isNullOrEmptyString(item.pRenewalAmount)).length;
              if (count == 0) {
      
                let validation=this._CoJointmemberService._GettCoJointmembervalidation();
                if(validation=='success'){
             this.Tabposition = 3;
                }
                if (this.Tabposition == 1)
                  this.FisrtTabSave();
                if (this.Tabposition == 2)
                  this.SecondTabSave();
                if (this.Tabposition == 3)
                  this.ThirdTabSave();
      
      
                //this.FisrtTabSave();
      
              }
              else {
                this.disablesavebutton = false;
                this.savebutton = 'Save & Continue';
              }
      
            }
          }
          catch (e) {
            this._commonService.showErrorMessage(e);
            this.disablesavebutton = false;
            this.savebutton = 'Save & Continue';
          }
      
        }
      
        FisrtTabSave() {
          debugger;
          this.MaturityPaymentForm.controls.ptotalpaidamount.setValue(this.MaturityPaymentList.reduce((sum, c) => sum + parseFloat(c.pPaidAmount), 0));
          //if (this.validatesaveMaturityPayment()) {
            let paymentdata = [];
            this.MaturityPaymentList = [];
            let PaymentType = 'Renewal';
const control = <FormGroup>this.MaturityPaymentForm['controls']['pMaturityPaymentlist'];

if (this.FdDetailsList.length > 0) {
  paymentdata = this.FdDetailsList.filter(item => item.pStatus == true);
}

for (let i = 0; i < paymentdata.length; i++) {
  let fddata = [];
  fddata = this.FdDetailsList.filter(item => item.pFdaccountid == paymentdata[i].pFdaccountid);
  
  if (fddata.length > 0) { // Ensure there's data to process
    control.controls.pTransTypeid.setValue(fddata[0].pFdaccountid);
    control.controls.pTransType.setValue(fddata[0].pFdaccountno);
    control.controls.pmemberName.setValue(fddata[0].pmemberName);
    
    if (fddata[0].pRenewalAmount) {
      fddata[0].pRenewalAmount = this._commonService.removeCommasForEntredNumber(fddata[0].pRenewalAmount);
      fddata[0].pRenewalAmount = parseInt(fddata[0].pRenewalAmount);
      control.controls.pPaidAmount.setValue(fddata[0].pRenewalAmount);
    }

    control.controls.pAccountno.setValue(fddata[0].pFdaccountid);
    control.controls.pOutstandingAmount.setValue(fddata[0].pNetPayable);
    control.controls.pLateFeeAmount.setValue(fddata[0].pLateFeeAmount);

    if (PaymentType !== "Payment") {
      let newdata = { IsRenewal: fddata[0].IsRenewal, pRenewalAmount: fddata[0].pRenewalAmount};
      let Renewaldata = Object.assign({}, control.value, newdata); // Merge properly
      this.MaturityPaymentList.push(Renewaldata);
    } else {
      this.MaturityPaymentList.push(control.value);
    }
  }
}

if (this.FdTranscationform.controls.pMaturityAmount.value == 0) {
  let tenuremode = this.TenureMode.toUpperCase()
  let tenure = parseInt(this.Tenure)
  let intrestpayout = this.Intrestpayout.toUpperCase()
  let depositamount = parseInt(this.depositamount)
  let intrestcompunding = this.IntrestCompounding.toUpperCase()
  this._fdrdttranscationservice.GetIntrestAmount(tenuremode, tenure, depositamount,
    intrestpayout, intrestcompunding, this.Intrestrate, this.Caltype).subscribe(res => {
      debugger
      console.log("maturiti amount", res)

      //this.maturityPaymentRenewalComponent.Showmaturityamountforintrest = true;
      // this.maturityPaymentRenewalComponent.ShowIntrestamountforintrest = true;
      this.FdTranscationform.controls.pMaturityAmount.setValue(res[0].pMatueritytAmount)
      this.MaturityAmnt = res[0].pMatueritytAmount
      this.IntrestAmount = res[0].pInterestamount
      this.FdTranscationform.controls.pInterestAmount.setValue(res[0].pInterestamount)
      this.SaveRenewal()

    })
}
else {
  this.SaveRenewal()

}

            // let PaymentType = this.MaturityPaymentForm.controls.pPaymentType.value;
            // const control = <FormGroup>this.MaturityPaymentForm['controls']['pMaturityPaymentlist'];
            // if (this.FdDetailsList.length > 0)
            //   paymentdata = this.FdDetailsList.filter(item => item.pStatus == true);
      
            // for (let i = 0; i < paymentdata.length; i++) {
            //   let fddata = [];
            //   fddata = this.FdDetailsList.filter(item => item.pFdaccountid == paymentdata[0].pFdaccountid);
            //   control.controls.pTransTypeid.setValue(fddata[0].pFdaccountid);
            //   if(fddata[0].pRenewalAmount){
            //     fddata[0].pRenewalAmount=this._commonService.removeCommasForEntredNumber(fddata[0].pRenewalAmount)
            //     fddata[0].pRenewalAmount = parseInt(fddata[0].pRenewalAmount);
            //     control.controls.pPaidAmount.setValue(fddata[0].pRenewalAmount);
      
            //     // fddata[i].pRenewalAmount = parseInt(fddata[i].pRenewalAmount);
            //     // control.controls.pPaidAmount.setValue(this._commonService.removeCommasForEntredNumber(fddata[i].pRenewalAmount));
            //   }
            //   // if(fddata[0].pAccountno==null){
            //   //   fddata[0].pAccountno=0;
            //   // }
            //   control.controls.pAccountno.setValue(fddata[0].pFdaccountid);
            //   control.controls.pOutstandingAmount.setValue(fddata[0].pNetPayable);
            //   control.controls.pLateFeeAmount.setValue(fddata[0].pLateFeeAmount);
            //   if (PaymentType !== "Payment") {
            //     let newdata = { IsRenewal: fddata[0].IsRenewal, pRenewalAmount: fddata[0].pRenewalAmount };
            //     let Renewaldata = Object.assign(control.value, newdata);
            //     this.MaturityPaymentList.push(Renewaldata);
            //   }
            //   else {
            //     this.MaturityPaymentList.push(control.value);
            //   }
            // }
            // // if (this.maturityPaymentRenewalComponent.ValidateFirstTab()) {
            //   if (this.FdTranscationform.controls.pMaturityAmount.value == 0) {
            //     let tenuremode = this.TenureMode.toUpperCase()
            //     let tenure = parseInt(this.Tenure)
            //     let intrestpayout = this.Intrestpayout.toUpperCase()
            //     let depositamount = parseInt(this.depositamount)
            //     let intrestcompunding = this.IntrestCompounding.toUpperCase()
            //     this._fdrdttranscationservice.GetIntrestAmount(tenuremode, tenure, depositamount,
            //       intrestpayout, intrestcompunding, this.Intrestrate, this.Caltype).subscribe(res => {
            //         debugger
            //         console.log("maturiti amount", res)
      
            //         //this.maturityPaymentRenewalComponent.Showmaturityamountforintrest = true;
            //         // this.maturityPaymentRenewalComponent.ShowIntrestamountforintrest = true;
            //         this.FdTranscationform.controls.pMaturityAmount.setValue(res[0].pMatueritytAmount)
            //         this.MaturityAmnt = res[0].pMatueritytAmount
            //         this.IntrestAmount = res[0].pInterestamount
            //         this.FdTranscationform.controls.pInterestAmount.setValue(res[0].pInterestamount)
            //         this.SaveRenewal()
      
            //       })
            //   }
            //   else {
            //     this.SaveRenewal()
      
            //   }
            // }
            // else {
            //   this.disablesavebutton = false;
            //   this.savebutton = 'Save & Continue';
            // }
          // }
          // else {
          //   this.disablesavebutton = false;
          //   this.savebutton = 'Save & Continue';
          // }
        }


        SaveRenewal() {
          this.calculateRatePerSqaureYard();
      
          
      
          if(this.Showmaturityamountforintrest == false && this.ShowIntrestamountforintrest == false){
            this.savebutton = 'Next';
            this._commonService.showWarningMessage("Please Click Calculate Button")
          return;
          }
      
          if(this.MaturityAmnt == '' && this.IntrestAmount == ''){
            this.savebutton = 'Next';
            this._commonService.showWarningMessage("Please Click Calculate Button")
          return;
          }
      
          if(this.FdTranscationform.controls.pContactid.value==""){
            this.FdTranscationform.controls.pContactid.setValue(0);
          }
          this.FdTranscationform.controls.pMemberId.setValue(this.MemberidSave);
          let isValid = true;
          //let data = JSON.stringify(this.maturityPaymentRenewalComponent.FdTranscationform.value)
      
          debugger
          this.FdTranscationform.controls.pContacttype.setValue(this.contactType)
          this.FdTranscationform.controls.pTransdate.setValue(this.MaturityPaymentForm.controls.pMaturitypaymentdate.value);
          // this.maturityPaymentRenewalComponent.FdTranscationform.controls.pChitbranchname.setValue(this.MaturityPaymentForm.controls.pBranch.value);
          // this.maturityPaymentRenewalComponent.FdTranscationform.controls.pChitbranchId.setValue(this.MaturityPaymentForm.controls.pBranchId.value);
          let newdata = { MaturityPaymentsList: this.MaturityPaymentList, _FdMemberandSchemeSave: this.FdTranscationform.value };
          let paymentVoucherdata = Object.assign(this.MaturityPaymentForm.value, newdata);
          console.log(paymentVoucherdata);
          let data = JSON.stringify(paymentVoucherdata)
          console.log(data)
          this._MaturityPaymentService.SaveMaturityRenewal(data).subscribe(json => {
            debugger;
            console.log(json)
            this._commonService.showWarningMessage("Member Details Saved Successfully Now Add Nominee Details");
      
            if(json){
             
              // sessionStorage.setItem('referralStatus', JSON.stringify(true));
              sessionStorage.setItem('nomineeDetailsMP', JSON.stringify(true));    
              sessionStorage.setItem('onlyNomineeDetailsMP', JSON.stringify(true));    
      
            }
            else{
              // sessionStorage.setItem('referralStatus', JSON.stringify(false));
              sessionStorage.setItem('nomineeDetailsMP', JSON.stringify(false));    
              sessionStorage.setItem('onlyNomineeDetailsMP', JSON.stringify(false));    
          
            
          }
            this.jointMemberFlag = true;
            this.SelectMemberFlag = false;
            this.referralDetailsFlag = false;
            let str = "add-joint-member"
            $('.nav-item a[href="#' + str + '"]').tab('show');
            this.Tabposition = 2;
            this.disablesavebutton = false;
            this.savebutton = 'Save & Continue To add Referral Details';
            this._rdttranscationservice.GetMemberNomineeDetails(this.Membercode).subscribe(json => {
              debugger
                this._CoJointmemberService.sendMemberNomineeDetails(json);
           })
           let resdata = { accountId:json['pFdAccountId'], accountNo:json['pFdaccountNo'] };
           this._CoJointmemberService._SetShareAccountdata(resdata);
            this.ShowSaveClearbuttons = false;
            this.GetApplicanttypes();
            //this.clearform();
            this.showgrid = false;
            // this.griddata=[]
            this._fdrdttranscationservice._Setgriddata(this.griddata)
            this.FdaccountNo = json['pFdaccountNo']
            this.FdAccountId = json['pFdAccountId']
            this._fdrdttranscationservice._SetDataForJointMember(this.Applicanttype, this.FdAccountId, this.FdaccountNo, this.Contactid, this.contactrefid)
      
            this._rdttranscationservice.GetMemberNomineeDetails(this.Membercode).subscribe(json => {
              debugger
      
              this.Nomineedetails = json;
              this._fdrdttranscationservice._SetNomineedetails(this.Nomineedetails)
            })
            debugger
           
            this.showIntrestcompounding = false;
            this.showintrestrate = false;
            this.FdSchemeDetails = ""
            this.DepositAmountBaseconintrest = false
            this.Showmaturityamount = false;
      
            this.Multiplesof = ""
            this.IntrestCompounding = ""
           
          }, (error) => {
            //this.isLoading = false;
            this._commonService.showErrorMessage(error);
            this.disablesavebutton = false;
            this.savebutton = 'Save & Continue';
          })
      
        }

        calculateRatePerSqaureYard() {
          debugger;
      
          if (this.ratepersquareyard != 0 && this.ratepersquareyard != undefined) {
            this.ratesquareyard = this.depositamount / this.ratepersquareyard;
            this.FdTranscationform.controls.pSquareyard.setValue(this.ratesquareyard);
      
          }
      
        }


        validatesaveMaturityPayment(): boolean {
          let isValid: boolean = true;
          let data = [];
          isValid = this.checkValidations(this.MaturityPaymentForm, isValid);
          data = this.FdDetailsList.filter(item => item.pStatus == true);
          if (data.length == 0) {
            this._commonService.showWarningMessage("Please Select Atleast One Checkbox")
            //this.showErrorMessage('Loan type, loan name and charge name already exists in grid');
            isValid = false;
          }
          else {
            let emptyamount = [];
            let latefeeamount=[];
            emptyamount = data.filter(item => isNullOrEmptyString(item.pRenewalAmount));
            if (emptyamount.length > 0) {
              this._commonService.showWarningMessage("Please Enter the Amount.")
              isValid = false;
            }
            latefeeamount = data.filter(item => isNullOrEmptyString(item.pLateFeeAmount));
            if (latefeeamount.length > 0) {
              this._commonService.showWarningMessage("Please Enter Late Fee Amount.")
              isValid = false;
            }
      
          }
          return isValid;
        }

        ClearDetails() {
          this.ngOnInit();
          //this.Showpayment = false;
          this.ShowRenewal = false;
          this.ShowPaymentGrid = false;
          this.ShowPaymentGrid = false;
          this.ShowRenewalGrid = false;
          this.ShowRenewalFdTransaction = false;
          this.showMaturitytab = false;
          this.ShowFixeddepositdetails = false;
          this.FdDetailsList = [];
          this.staticFDDetails=[];
          this.SavingsAccounts=[];
          this.MaturityPaymentList = [];
        }

// // /// // // / / / / / / /

 Editdata() {
    debugger
    this.editdata = this._rdttranscationservice.GetDetailsForEdit();
    this.JointMemberAndNomineeForm.controls.pTypeofOperation.setValue("UPDATE");
    this.JointMemberAndNomineeForm.controls.pIsNomineesApplicableorNot.setValue(this.editdata.pIsNomineesapplicable)
    if (this.editdata.jointMembersandContactDetailsList.length > 0) {
      // this.ShowJointmemberstable=true;
      this.ShowJointmembers = true;
      this.MembersandContactDetailsList = this.editdata.jointMembersandContactDetailsList
      this.JointMemberAndNomineeForm.controls.precordid.setValue(this.editdata['jointMembersandContactDetailsList'].precordid)
      this.JointMemberAndNomineeForm.controls.pIsjointapplicableorNot.setValue(this.editdata.pIsJointMembersapplicable)
      this.GetMembers();
    }
    else {
      this.JointMemberAndNomineeForm.controls.pIsNomineesApplicableorNot.setValue(false)
      //this.ShowJointmemberstable=false;
      this.ShowJointmembers = false;
      this.MembersandContactDetailsList = []
    }
    if (this.editdata.memberNomineeDetailsList.length > 0) {
      this.showNominee = true;
      this.JointMemberAndNomineeForm.controls.pIsNomineesApplicableorNot.setValue(true)
      this.showNominee = true;
      // this.JointMemberAndNomineeForm.controls.pIsNomineesApplicableorNot.setValue(this.editdata.pIsNomineesapplicable)
      //this.editdata.memberNomineeDetailsList = this.editdata.memberNomineeDetailsList.filter(itm => itm.pisprimarynominee = itm.pisprimarynominee.toString());
      this.newlist.push(this.editdata.memberNomineeDetailsList);
      this.nomineeDetailsEditData = this.editdata.memberNomineeDetailsList;
      // this.nomineeDetails.nomineeList.push(this.editdata.memberNomineeDetailsList)
      // let primary=this.nomineeDetails.nomineeList.filter(data=>data.pisprimarynominee=="true")
      // this.nomineeDetails.checkedlist=primary

    }
    //this.formatteddata=this.JointMemberAndNomineeForm.value

  }
  FormGroup() {
    this.JointMemberAndNomineeForm = this._FormBuilder.group
      ({
        precordid: [0],
        paccounttype: [''],
        pAccountId: [''],
        paccountNo: [''],
        pCreatedby: [this._commonService.pCreatedby],
        pIsjointapplicableorNot: false,
        pMemberId: [''],
        pIsNomineesApplicableorNot: false,
        pTypeofOperation: ['CREATE'],
      })
  }

  JointMemberchange(event) {
    debugger
    if (event.target.checked) {
      this.ShowJointmembers = true;
      this.GetMembers();
      this.jointMembervalidation = true
      this.JointMemberAndNomineeForm.controls.pIsjointapplicableorNot.setValue(true)
    }
    else {
      this.jointMembervalidation = false;
      this.ShowJointmembers = false;
      this.MembersandContactDetailsList = [];
      this.JointMemberAndNomineeForm.controls.pMemberId.setValue('');
      this.Data=[];
      
    }
  }

  GetMembers() {
    debugger
    let a = this._CoJointmemberService._Getcontacttype();
    this._CoJointmemberService.GetJointMembers(a['membercode'], a['Contacttype']).subscribe(result => {
      this.MemberDetailsListAll = result
    })

  }
  MemberChange1(event) {

    console.log("event", event)
    if (event != undefined && event != "" && event != null)
     {
      this.Data = {
        pMemberName: event.pContactName, pMemberCode: event.pMemberReferenceId, pMemberId: event.pMembertypeId,
        pContactid: event.pContactId, pContactrefid: event.pContactReferenceId, pContacttype: event.pContacttype, pContactnumber: event.pContactNo, pTypeofOperation: 'CREATE', precordid: 0
      }
    }

  }
  AddJointMembers() {
    debugger
    let isValid: boolean = true;
    // if(this.checkValidations(this.JointMemberAndNomineeForm,isValid))
    // {
    let membeid = this.Data['pMemberId'];
    if(this.Data==''){
      this._commonService.showWarningMessage("Select Member");
      return;
    }
    const Checkexistcount = this.MembersandContactDetailsList.filter(s => s.pMemberId == membeid).length;
    if (Checkexistcount == 0) {

      this.MembersandContactDetailsList.push(this.Data);

      this.JointMemberAndNomineeForm.controls.pMemberId.setValue('');
      this.Data=[];
    }
    else {
      this._commonService.showWarningMessage("Member already exists in grid.")
    }
    // }
    //     return isValid


  }
  removeHandler(event) {
    this.MembersandContactDetailsList.splice(event.rowIndex, 1);
  }
  Nomineechange(event) {
    debugger;
    //  this.nomineeDetails.ngOnInit();
    if (event.target.checked) {
      this.showNominee = true;
      this.JointMemberAndNomineeForm.controls.pIsNomineesApplicableorNot.setValue(true);
      // this._CoJointmemberService.getMemberNomineeDetails().subscribe((response) => {
      //   debugger
      //   this.nomineeList = response;
      // });
    
    }
    else {
      this.showNominee = false
      //   this.nomineeDetails.showpercentage=false
      //this.conomineeDetails.nomineeList.length=0
      this.conomineeDetails.ngOnInit();
      this.JointMemberAndNomineeForm.controls.pIsNomineesApplicableorNot.setValue(false);
      this.nomineeList = [];
    }
  }

  NextTabclick() {
    debugger;
   this. _CoJointmemberService._SetCoJointmembervalidation('unsuccess');
    let Membercodedata = this._CoJointmemberService._GetShareAccountdata();
    this.JointMemberAndNomineeForm.controls.pAccountId.setValue(Membercodedata['accountId']);
    this.JointMemberAndNomineeForm.controls.paccountNo.setValue(Membercodedata['accountNo']);
    this.nomineeList = '';
    let nomineeListdata =this._CoJointmemberService._GetnomineeList();
    this.nomineeList = nomineeListdata;

    if (this.ShowJointmembers == true && this.MembersandContactDetailsList.length == 0) {
      this._commonService.showWarningMessage("Add Joint Member");
      return;
    }
    let nomineeListempty = this.isEmpty(this.nomineeList);
    if (this.showNominee == true && nomineeListempty == true) {
      this._commonService.showWarningMessage("Add To Grid");
      return;
    }


    if (this.showNominee == true) {
      if (this.validatepercentage()) {
        if (this.checkcount()) {
          this.Save()
        }
      }
    }else{
      this.Save()
    }




    // this.loading = true;




  }

  Save() {
    debugger

    // let Membercodedata = this._CoJointmemberService._GetShareAccountdata();
    // this.JointMemberAndNomineeForm.controls.pAccountId.setValue(Membercodedata['pRdAccountId']);
    // this.JointMemberAndNomineeForm.controls.paccountNo.setValue(Membercodedata['pRdaccountNo']);
    // this.nomineeList = '';
    // this.nomineeList = this._CoJointmemberService._GetnomineeList();

    // if (this.ShowJointmembers == true && this.MembersandContactDetailsList.length == 0) {
    //   this._commonservice.showWarningMessage("Add Member");
    //   return;
    // }
    
    let nomineeListempty = this.isEmpty(this.nomineeList);
    
    // if (this.showNominee == true && nomineeListempty == true) {
    //   this._commonservice.showWarningMessage("Add Nominee");
    //   return;
    // }
    for(let i=0;i<this.nomineeList.length;i++){
      let pdateofbirth= this.nomineeList[i].pdateofbirth;
      if(pdateofbirth!=null){
      this.nomineeList[i].pdateofbirth=this._commonService.formatDateFromYYYYMMDD(pdateofbirth);
    }
          }
          if(0<this.nomineeList.length){
            this.nomineeList = this.nomineeList.filter(nol => nol.pPercentage !=0);

          }
    let nominedetails = { nomineeDetailsList: this.nomineeList }
    if (nomineeListempty == true) {
      nominedetails = { nomineeDetailsList: [] }
    }
    if(this.showNominee == false){
      nominedetails = { nomineeDetailsList: [] }
    }

    let MembersandContactDetailsList = { jointDetailsList: this.MembersandContactDetailsList };
    let data = JSON.stringify(Object.assign(this.JointMemberAndNomineeForm.value, MembersandContactDetailsList, nominedetails));
    this._CoJointmemberService.SaveJointMember(data).subscribe(json => {
      if (json) {
         this._commonService.showWarningMessage("Joint Meber Saved Successfully Now Add Referral Details");
         this.referralDetailsFlag = true;
         this.jointMemberFlag = false;
        this.SelectMemberFlag = false;
        let str = "refferral"
        $('.nav-item a[href="#' + str + '"]').tab('show');
       this. _CoJointmemberService._SetCoJointmembervalidation('success');
      //  sessionStorage.setItem('nomineeAndReferralStatus', JSON.stringify(true));

      if(json){
       
        sessionStorage.setItem('referralStatusMP', JSON.stringify(true));
        sessionStorage.setItem('OnlyReferralStatusMP', JSON.stringify(true));

        sessionStorage.setItem('nomineeDetailsMP', JSON.stringify(false));    
        sessionStorage.setItem('onlyNomineeDetailsMP', JSON.stringify(false));    

      }
      else{
        sessionStorage.setItem('referralStatusMP', JSON.stringify(false));
        sessionStorage.setItem('OnlyReferralStatusMP', JSON.stringify(false));
        sessionStorage.setItem('nomineeDetailsMP', JSON.stringify(true));    
        sessionStorage.setItem('onlyNomineeDetailsMP', JSON.stringify(true));    
    
      
    }

      }
    })
  }
  isEmpty(obj) {
    return !obj || !Object.keys(obj).some(x => obj[x] !== void 0);
  }
clear(){
  debugger;
  
      if(this.AddNomineevalidation==false){
        this.ShowJointmembers = false;
        this.MembersandContactDetailsList = [];
        this.JointMemberAndNomineeForm.controls.pMemberId.setValue('');
        this.Data=[];
        this.showNominee = false;
        this.JointMemberAndNomineeForm.controls.pIsNomineesApplicableorNot.setValue(false);
          this.JointMemberAndNomineeForm.controls.pIsjointapplicableorNot.setValue(false);
        this.ShowJointmembersvalidation=false;
        this.JointMemberErrorMessages={};
       // this.nomineeDetails.ngOnInit();
        this.conomineeDetails.ngOnInit();
      }
     

}
  validatepercentage() {

    debugger;
    let isValid = true;
    if (this.nomineeList.length > 0) {
for(let i=0;i<this.nomineeList.length;i++){
  let Percentage=this.nomineeList[i].pPercentage;
  let Memberrefcode=this.nomineeList[i].pMemberrefcode;
  if(Percentage==="")
  {
    isValid = false;
    this._commonService.showWarningMessage("Enter Valid Percentage");
    return;
  }
  if(Percentage==0 && Memberrefcode=='')
  {
    isValid = false;
    this._commonService.showWarningMessage("Enter  Percentage in add Nominee");
    return;
  }
}
      let gridsum = 0;
      this.gridsum = this.nomineeList.reduce((sum, item) => sum + parseFloat(item.pPercentage), 0);
      if (this.gridsum == 0 || this.gridsum < 100) {
        isValid = false;
        this._commonService.showWarningMessage("Enter Valid Percentage")
      }
      else if (this.gridsum > 100) {
        isValid = false;
        this._commonService.showWarningMessage("Enter Valid Percentage")
      }

    }
    return isValid
  }
  checkcount() {
    debugger
    let isValid = true
    //console.log("nomineelist",this.nomineeDetails.nomineeList)
    let count = this.nomineeList.filter(data => data.pPercentage == 0).length
    if (count != 0 && this.gridsum > 100) {

      this._commonService.showWarningMessage("Enter valid percentage");
      // this.nomineeDetails.nomineeList[0].pPercentage.setValue("")
      isValid = false
    }
    else {
      isValid = true
    }
    return isValid

  }


  //VALIDATIONS

  //#region Validation controls
  BlurEventAllControll(fromgroup: FormGroup) {

    try {

      Object.keys(fromgroup.controls).forEach((key: string) => {
        this.setBlurEvent(fromgroup, key);
      })

    }
    catch (e) {
      this._commonService.showErrorMessage(e);
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
      this._commonService.showErrorMessage(e);
      return false;
    }



  }

  checkValidations(group: FormGroup, isValid: boolean): boolean {

    try {

      Object.keys(group.controls).forEach((key: string) => {

        isValid = this.GetValidationByControl(group, key, isValid);
      })

    }
    catch (e) {
      //this.showErrorMessage(e);
      return false;
    }
    return isValid;
  }
  GetValidationByControl(formGroup: FormGroup, key: string, isValid: boolean): boolean {

    try {
      let formcontrol;

      formcontrol = formGroup.get(key);
      if (!formcontrol)
        formcontrol = <FormGroup>this.MaturityPaymentForm['controls']['ppaymentsslistcontrols'].get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          if (key != 'ppaymentsslistcontrols')
            this.checkValidations(formcontrol, isValid)
        }
        else if (formcontrol.validator) {
          this.formValidationMessages[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;

            let errormessage;

            for (const errorkey in formcontrol.errors) {
              lablename = (document.getElementById(key) as HTMLInputElement).title;

              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.formValidationMessages[key] += errormessage + ' ';
                isValid = false;
              }
            }

          }
        }
      }
    }
    catch (e) {
      //this._commonService.showErrorMessage(key);
      return false;
    }
    return isValid;
  }

  SecondTabSave() {
    debugger
    //5157
   this.disablesavebutton = false;
   this.savebutton = 'Save & Continue';
    this.NextTabclick();
   
      
  }

  ThirdTabSave(){
    this.CoReferral.SaveReferral();
 }

}
