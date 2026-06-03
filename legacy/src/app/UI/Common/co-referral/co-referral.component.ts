import { Component, OnInit, NgZone, Input } from '@angular/core';
import { FIIndividualService } from 'src/app/Services/Loans/Transactions/fiindividual.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { SavingtranscationService } from 'src/app/Services/Banking/savingtranscation.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RdTransactionsService } from 'src/app/Services/Banking/Transactions/rd-transactions.service';
import { ShareapplicationService } from 'src/app/Services/Banking/shareapplication.service';
import { CoJointmemberService } from 'src/app/Services/Common/co-jointmember.service'
import { CoReferralService } from 'src/app/Services/Common/co-referral.service';
declare let $: any
@Component({
  selector: 'app-co-referral',
  templateUrl: './co-referral.component.html',
  styleUrls: []
})
export class CoReferralComponent implements OnInit {
  @Input() referraldata: any;
  constructor(private fiIndividualService: FIIndividualService, private _fb: FormBuilder, private _commonService: CommonService, private savingtranscationservice: SavingtranscationService, private zone: NgZone, private router: Router, private _rdtranscationservice: RdTransactionsService, private _ShareapplicationService: ShareapplicationService, public _CoReferralService: CoReferralService, private _CoJointmemberService: CoJointmemberService, private _route: ActivatedRoute) { }
  accounttype: any;
  validation: any;
  referralAgents: any;
  referralAgentsList: any
  allEmployeeDetails: any;
  referralForm: any;
  editdata: any;
  referralTypeErrorMessage = {}
  employeeReferenceId: any;
  agentReferenceId: any;
  firsttabdata: any = []
  loading: boolean = false;
  buttontype: any;
  returnurl: any;
  ShowReferral: boolean = true;
  ShowSaveClearbuttons: boolean = true;
  Showbuttons:boolean=true;
  ngOnInit() {
    debugger;
    this.FormGroup();
    this.accounttype = this.referraldata.accounttype;
    this.referralForm.controls.paccounttype.setValue(this.accounttype);
   this.Showbuttons=this.referraldata.Button;
    this.validation = this.referraldata.validation;
    this.returnurl = this.referraldata.returnurl;
    // if (this.validation == true) {
      this.ShowReferral = true;
      this.referralForm.controls.pIsReferralsapplicable.setValue(true);
      this.referralForm.controls.pReferralname.setValidators([Validators.required]);
      this.referralForm.controls.pReferralname.updateValueAndValidity();
      this.referralForm.controls.pSalesPersonName.setValidators([Validators.required]);
      this.referralForm.controls.pSalesPersonName.updateValueAndValidity();
    // } else {
    //   this.ShowReferral = false;
    //   this.referralForm.controls.pIsReferralsapplicable.setValue(false);
    //   this.referralForm.controls.pReferralname.clearValidators('');
    //   this.referralForm.controls.pReferralname.updateValueAndValidity();
    //   this.referralForm.controls.pSalesPersonName.clearValidators('');
    //   this.referralForm.controls.pSalesPersonName.updateValueAndValidity();
    // }
    this.getReferralAgentDetails();
    this.getallEmployeeDetails();
    //this.buttontype = this._rdtranscationservice.Newstatus();
    if (this._route.snapshot.params['id']) {
      debugger
      this.EditData()
    }
    this.BlurEventAllControll(this.referralForm)

  }
  FormGroup() {
    this.referralForm = this._fb.group({
      paccounttype: [''],
      pAccountId: [''],
      paccountNo: [''],
      pReferralId: ['0'],
      pReferralCode: [''],
      pContactId: [0],
      pReferralname: [''],
      pEmployeeidId: [0],
      pSalesPersonName: [''],
      pCommisionValue: [0],
      pCommissionType: [''],
      pTypeofOperation: ['CREATE'],
      pCreatedby: [this._commonService.pCreatedby],
      pIsReferralsapplicable: [false]
    });
  }
  getReferralAgentDetails() {

    debugger
    let type = 'ALL'
    //this.loading = true;
    this._CoReferralService.getReferralDetails().subscribe(response => {


      if (response != null) {

        this.referralAgents = response;

      }

    });

  }

  EditData() {
    debugger
    this.editdata = this._rdtranscationservice.GetDetailsForEdit()
    console.log("editdetails for refferal", this.editdata);
    // if (this.editdata.pIsReferralsapplicable == true) {
      this.ShowReferral = true;

      this.referralForm.controls.pIsReferralsapplicable.setValue(this.editdata.pIsReferralsapplicable)
      this.getReferralAgentDetails()
      this.referralForm.controls.pSalesPersonName.setValue(this.editdata.memberReferalDetails.pSalesPersonName)
      this.referralForm.controls.pReferralId.setValue(parseInt(this.editdata.memberReferalDetails.pReferralId))
      this.referralForm.controls.pCommisionValue.setValue(this.editdata.memberReferalDetails.pCommisionValue)
      this.referralForm.controls.pCreatedby.setValue(this._commonService.pCreatedby)
      this.referralForm.controls.pTypeofOperation.setValue("UPDATE")
      this.referralForm.controls.pReferralCode.setValue(this.editdata.memberReferalDetails.pReferralCode)
      this.referralForm.controls.pContactId.setValue(this.editdata.memberReferalDetails.pContactId)
      this.referralForm.controls.pReferralname.setValue(this.editdata.memberReferalDetails.pReferralname);
    // }
    // else {
    //   this.referralForm.controls.pIsReferralsapplicable.setValue(this.editdata.pIsReferralsapplicable)
    //   this.ShowReferral = false;

    // }


  }
  getallEmployeeDetails() {
    try {
      this._CoReferralService.getallEmployeeDetails().subscribe(response => {
        if (response != null) {
          this.allEmployeeDetails = response;
        }

      });
    } catch (error) {


    }
  }
  referralAgentDetails(data) {
    debugger
    if (data != undefined) {
      this.BlurEventAllControll(this.referralForm);
      this.referralForm.controls.pReferralCode.setValue(data.pReferralCode);
      this.referralForm.controls.pContactId.setValue(data.pContactId);
      this.referralForm.controls.pReferralname.setValue(data.pAdvocateName);
    }

    //this.referralForm.controls.pReferralId.setValue(data.pReferralId)
  }
  employeeDetails(data) {
    debugger
    if (data != undefined) {
      this.BlurEventAllControll(this.referralForm);
      this.employeeReferenceId = data.pContactRefNo;
      this.referralForm.controls.pSalesPersonName.setValue(data.pEmployeeName);
      this.referralForm.controls.pEmployeeidId.setValue(data.pEmployeeId);
    }


  }
  RefferalApplicable(event) {
    debugger
    if (event.target.checked) {
      this.ShowReferral = true;
      this.referralForm.controls.pIsReferralsapplicable.setValue(true);
      this.referralForm.controls.pReferralname.setValidators([Validators.required]);
      this.referralForm.controls.pReferralname.updateValueAndValidity();
      this.referralForm.controls.pSalesPersonName.setValidators([Validators.required]);
      this.referralForm.controls.pSalesPersonName.updateValueAndValidity();
    }
    else {
      this.ShowReferral = false;
      this.referralForm.controls.pIsReferralsapplicable.setValue(false);

      this.referralForm.controls.pReferralCode.setValue('');
      this.referralForm.controls.pContactId.setValue(0);
      this.referralForm.controls.pReferralname.setValue('');
      this.referralForm.controls.pReferralId.setValue(0);
      
      this.referralForm.controls.pSalesPersonName.setValue('');
      this.referralForm.controls.pEmployeeidId.setValue(0);
   
      this.referralForm.controls.pSalesPersonName.clearValidators('');
      this.referralForm.controls.pSalesPersonName.updateValueAndValidity();

      this.referralForm.controls.pReferralname.clearValidators('');
      this.referralForm.controls.pReferralname.updateValueAndValidity();


    }
    //  let Isreferral = this.referralForm.controls.pIsReferralsapplicable.value;
    //  if (Isreferral) {
    //    this.ShowReferral = true;
    //   this.referralForm.controls.pReferralId.setValidators(Validators.required)
    //   this.referralForm.controls.pSalesPersonName.setValidators(Validators.required)

    //  }
    //  else {
    //    this.ShowReferral = false;
    //  }
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
          this.referralTypeErrorMessage[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.referralTypeErrorMessage[key] += errormessage + ' ';
                isValid = false;
              }
            }
          }
        }
      }
    }
    catch (e) {
      this.showErrorMessage(e);
      return false;
    }
    return isValid;
  }
  showErrorMessage(errormsg: string) {
    //this._commonService.showErrorMessage(errormsg);
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

  SaveReferral() {
    debugger
    this._CoReferralService._SetCoReferralvalidation('unsuccess');
    let Membercodedata = this._CoJointmemberService._GetShareAccountdata();
    this.referralForm.controls.pAccountId.setValue(Membercodedata['accountId']);
    this.referralForm.controls.paccountNo.setValue(Membercodedata['accountNo']);
    if (this.ShowReferral == true) {
      let isValid = true;
      if (this.checkValidations(this.referralForm, isValid)) {
        this.savingtheform()
      }
    } else {
      this.savingtheform();
    }

  }
  savingtheform() {

    debugger
    let GetCommisiondata=this._CoReferralService._GetCommisiontype();
    let commissionvalue=GetCommisiondata['commissionvalue'];
    if(commissionvalue==null){
      commissionvalue=0;
    }    

  //  let commValue = JSON.parse(sessionStorage.getItem("commisionValue"));
  //  let commissionType = sessionStorage.getItem("commissionType");

  //  if(commissionvalue == '' || commissionvalue == null){
  //   this.referralForm.controls.pCommisionValue.setValue(commValue);
  //  }
  //  else{
  //   this.referralForm.controls.pCommisionValue.setValue(commissionvalue);
  //  }

  this.referralForm.controls.pCommisionValue.setValue(commissionvalue);
  this.referralForm.controls.pCommissionType.setValue(GetCommisiondata['commissiontype']);

  //  if(GetCommisiondata == '' || GetCommisiondata == {}){
  //   this.referralForm.controls.pCommissionType.setValue(commissionType);
  // }
  //  else{
  //   this.referralForm.controls.pCommissionType.setValue(GetCommisiondata['commissiontype']);
  // }




    

    this.referralForm.controls.pIsReferralsapplicable.setValue(true);


    let data = JSON.stringify(this.referralForm.value);
    this._CoReferralService.SaveReferralData(data).subscribe(json => {
      if (json) {
        this._commonService.showInfoMessage("Saved successfully");
        this._CoReferralService._SetCoReferralvalidation('success');
        sessionStorage.setItem('nomineeAndReferralStatus', JSON.stringify(false));
        sessionStorage.setItem('onlynomineeAndReferralStatus', JSON.stringify(false));
        sessionStorage.setItem('referralStatus', JSON.stringify(false));
        sessionStorage.setItem('onlyreferralStatus', JSON.stringify(false));



        if (this.returnurl == '') {
          let str = "selectmember"
          $('.nav-item a[href="#' + str + '"]').tab('show');
        }
        else {
          this.router.navigate(['/' + this.returnurl + '']);
        }
      }
    })



  }
  clear() {
    debugger
   // this.referralForm.reset();
   this.ShowReferral = true;
   this.referralForm.controls.pIsReferralsapplicable.setValue(false);

   this.referralForm.controls.pReferralCode.setValue('');
   this.referralForm.controls.pContactId.setValue(0);
   this.referralForm.controls.pReferralname.setValue('');
   this.referralForm.controls.pReferralId.setValue(0);
   
   this.referralForm.controls.pSalesPersonName.setValue('');
   this.referralForm.controls.pEmployeeidId.setValue(0);

   this.referralForm.controls.pSalesPersonName.clearValidators('');
   this.referralForm.controls.pSalesPersonName.updateValueAndValidity();

   this.referralForm.controls.pReferralname.clearValidators('');
   this.referralForm.controls.pReferralname.updateValueAndValidity();
    // this.referralForm.controls.pReferralname.setValidators([Validators.required]);
    // this.referralForm.controls.pReferralname.updateValueAndValidity();
    // this.referralForm.controls.pSalesPersonName.setValidators([Validators.required]);
    // this.referralForm.controls.pSalesPersonName.updateValueAndValidity();
   //this.FormGroup();
    console.log(this.referralForm.value);
    this.buttontype = this._rdtranscationservice.Newformstatus("new")
    //this.ShowReferral = false;
  }

  referralSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    return item.pAdvocateName.toLowerCase().indexOf(term) > -1 || item.pReferralCode.toLowerCase().indexOf(term) > -1;
  }
}

