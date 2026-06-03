import { Component, OnInit } from '@angular/core';
import { TransactionService } from 'src/app/Services/Transaction/transaction.service';
import { CommonService } from 'src/app/Services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FdRdServiceService } from 'src/app/Services/Banking/fd-rd-service.service';
import { LoansmasterService } from 'src/app/Services/Loans/Masters/loansmaster.service';
import { FIIndividualService } from 'src/app/Services/Loans/Transactions/fiindividual.service';
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Router } from '@angular/router';
import { FdRdTransactionsService } from 'src/app/Services/Banking/Transactions/fd-rd-transactions.service';
import { ShareapplicationService } from 'src/app/Services/Banking/shareapplication.service';
import { CoJointmemberService } from 'src/app/Services/Common/co-jointmember.service'
import { from } from 'rxjs';
import { RdTransactionsService } from 'src/app/Services/Banking/Transactions/rd-transactions.service';

declare const $: any;

@Component({
  selector: 'app-share-application',
  templateUrl: './share-application.component.html',
  styles: []
})
export class ShareApplicationComponent implements OnInit {

  /**
  * Bs Date picker initiliazation
  */
  public pdateofbirthConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public pshareissuedate: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  constructor(private transactionService: TransactionService,
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private _fdrdservice: FdRdServiceService,
    private _loanmasterservice: LoansmasterService,
    private _CoJointmemberService: CoJointmemberService,
    private _FIIndividualService: FIIndividualService,
    private datepipe: DatePipe,
    private router: Router, private _ShareapplicationService: ShareapplicationService,private _rdtranscationservice: RdTransactionsService) {
    this.pdateofbirthConfig.containerClass = 'theme-dark-blue';
    this.pdateofbirthConfig.dateInputFormat = 'DD/MM/YYYY';
    this.pdateofbirthConfig.maxDate = new Date();
    this.pdateofbirthConfig.showWeekNumbers = false;

    this.pshareissuedate.containerClass = 'theme-dark-blue';
    this.pshareissuedate.dateInputFormat = 'DD/MM/YYYY';
    this.pshareissuedate.minDate = new Date();
    this.pshareissuedate.showWeekNumbers = false;
  }
  shareAppForm: FormGroup;
  selectedShareCapitalConfigId: any;
  selectedShareCapitalName: any;
  memberTypeId: any
  memberType: any;
  shareAppErrorMessage: any;
  memberTypeDetails: any;
  shareCapitalNames: any;
  allSearchMembers: any;
  faceValueofShare: any;
  toatlFaceValueofShare: any;
  applicantTypes: any;
  applicantTypeId: any;
  applicantType: any;
  public Sharconfigdetails: any = [];
  public Maxshare: any;
  public Minshare: any;
  public IsmultiplesharesNotApplicable:boolean=true;
  public Multipleshares:any;
  public Multiplesharesarr:any=[];
  public searchMemberId: any;
  public searchMemberName: any;
  public loading = false;
  Membercode:any;
  disabletransactiondate = false;
  Nomineedetails: any = []
  ngOnInit() {
    if (this.commonService.comapnydetails != null)
    this.disabletransactiondate = this.commonService.comapnydetails.pdatepickerenablestatus;

    /**
     * Error message object initialization
     */
    this.shareAppErrorMessage = {};
this.Membercode='';
    this.shareAppForm = this.formBuilder.group({
      pshareapplicationid: 0,
      pShareAccountNo: [''],
      pismemberfeeapplicable: [true, Validators.required],
      pmembertypeid: ['', Validators.required],
      pmembertype: [''],
      pmemberid: [''],
      pmembername: ['',Validators.required],
      pmembercode: [''],
      pcontactid: [''],
      pApplicanttype: ['', Validators.required],
      pshareconfigid: ['', Validators.required],

      preferenceno:[''],
      pfacevalue: 0,
      pnoofsharesissued: ['', Validators.required],
      pdistinctivefrom: 0,
      pdistinctiveto: 0,
      ptotalamount: 0,
      pTransdate: [new Date()],
      psharedate: [new Date()],
      pshareissuedate: [new Date()],
      pprintstatus: ['N'],
      psharestatus: ['N'],
      pCreatedby: [this.commonService.pCreatedby],
      pShareName: [''],
    });
    /**
     * Form initialization of share App form (end).
     */
    this.cleadata();
    this.Membershipfeeapplicable('true');
    this.BlurEventAllControll(this.shareAppForm);
    this.Multiplesharesarr=[];
  
  }

  /////////masthn

  /**
   *Membershipfeeapplicable
   */
  Membershipfeeapplicable(click) {
    debugger
   click = (click == "true");
    this.shareAppForm.controls.pismemberfeeapplicable.setValue(click);
    this.cleadata();
    this.memberTypeDetails=[];
    // this.transactionService.getMemberTypeDetailsList().subscribe(json => {
    //   if (json) {
    //     this.memberTypeDetails = json;
    //     this.memberTypeDetails = this.memberTypeDetails.filter(itm => itm.pismembershipfeeapplicable == click);
    //   }
    // });
    let Getmemberdetailstype='SHARE';
    if(click==false){
      Getmemberdetailstype='SHARENO';
    }
    this.commonService.Getmemberdetails(Getmemberdetailstype).subscribe(json => {
      this.memberTypeDetails = json;
    });
  }
   /**
     * Transdate click
     */
  Transdateclick(){
  let Transdate =this.shareAppForm.controls.pTransdate.value;
  let shareissuedate =this.shareAppForm.controls.pshareissuedate.value;
  this.pshareissuedate.minDate =Transdate;
    if(Transdate>shareissuedate){
   //   this.shareAppForm.controls.pshareissuedate.setValue(Transdate);
   this.shareAppForm.controls.pshareissuedate.setValue(new Date());
    }
 
  }
   /**
     * Transdate click
     */
  /**
     * Member type changing here
     */
  memberTypeChange(event) {
    debugger
    if (event) {
      this.memberTypeId = Number(event.pmembertypeid);
      this.memberType = event.pmembertype;
      this.shareAppForm.controls.pmembertypeid.setValue(event.pmembertypeid);
      this.shareAppForm.controls.pmembertype.setValue(event.pmembertype);
      //this.shareAppErrorMessage.pmembertype = '';
      this.shareAppForm.controls['preferenceno'].setValue('');
      this.shareAppForm.controls['pmembercode'].setValue('');
      this.shareAppForm.controls['pcontactid'].setValue('');
      this.shareAppForm.controls['pmembername'].setValue('');
      this.shareAppForm.controls.pApplicanttype.setValue('');
      this.shareAppForm.controls.pshareconfigid.setValue('');
      this.shareAppForm.controls.pShareName.setValue('');
      this.shareAppForm.controls.ptotalamount.setValue('');
      this.shareAppForm.controls.pnoofsharesissued.setValue('');
      this.shareAppErrorMessage.pmembername = '';
      this.shareAppErrorMessage.pApplicanttype = '';
      this.shareAppErrorMessage.pshareconfigid = '';
      this.shareAppErrorMessage.pShareName = '';
      this.shareAppErrorMessage.pnoofsharesissued = '';
      
      this.selectedShareCapitalName='';
      this.Minshare='';
      this.Maxshare='';
      this.faceValueofShare='';
      this.shareCapitalNames=[];
    
      this.searchMemberId = '';
      this.searchMemberName ='';
      this.shareAppForm.controls.pmembercode.setValue('');
      this.Membercode = '';
      this.shareAppForm.controls.pcontactid.setValue('');

      let ismemberfeeapplicable = this.shareAppForm.value.pismemberfeeapplicable;
      this.getAllInsuranceSearchMembers(this.memberType, ismemberfeeapplicable);
      this.getApplicantTypes('Individual');

    }
  }
  /**
   * Member type changing here and calling (end).
   */


  /**
     *  search member (start).
     */
  getAllInsuranceSearchMembers(Membertype, Receipttype) {
    debugger;
    this._ShareapplicationService.GetMembers(Membertype, Receipttype).subscribe(json => {
      debugger;
      if (json) {
        this.allSearchMembers = json;


      }
    });

  }
  /**
 * Search member changing here 
 */
  MemberChanges(event) {
    debugger
    this.searchMemberId = '';
      this.searchMemberName ='';
      this.shareAppForm.controls.pmembercode.setValue('');
      this.Membercode = '';
      this.shareAppForm.controls.pcontactid.setValue('');
      this.shareAppForm.controls['preferenceno'].setValue('');
    // this.shareCapitalNames = [];
    // this.shareAppForm.controls.ptotalamount.setValue('');
    // this.shareAppForm.controls.pshareconfigid.setValue('');
    // this.selectedShareCapitalName='';
    // this.shareAppForm.controls.pApplicanttype.setValue('');
    if (event) {

      this.searchMemberId = event.pMemberId;
      this.searchMemberName = event.pMemberName;
      this.shareAppForm.controls.pmembercode.setValue(event.pMemberCode);
      this.Membercode = event.pMemberCode;
      this.shareAppForm.controls.pcontactid.setValue(event.pContactid);
      this._CoJointmemberService._setfdMembercode(event.pMemberCode, event.pMemberId)
    }
   
  }
  /**
   *Search member changing here and calling (end). 
   */

  /**
    * Applicant Types api to get all applicants (start).
    */
  getApplicantTypes(type) {

    if (type && type != undefined && type != '') {
      this._loanmasterservice.GetApplicanttypes(type, 0).subscribe(json => {
        if (json) {
          this.applicantTypes = json;
        }
      })
    }

  }
  /**
   * Applicant Types api to get all applicants (end).
   */
  /**
     * Applicant type changing
     */
  applicantTypeChange(event) {
    debugger
    if (event) {
      this.applicantTypeId = Number(event.target.value);
      this.applicantType = event.target.options[event.target.selectedIndex].text;
      this.shareAppForm.controls.pApplicanttype.setValue(this.applicantType);
      this.shareAppForm.controls['preferenceno'].setValue('');
      this.getShareNames(this.memberType, this.applicantType);

    }
  }
  /**
   * Applicant type changing here and calling (end).
   */


  getShareNames(Membertype, Applicanttype) {
    debugger
    this.shareCapitalNames = [];
    this.shareAppForm.controls.ptotalamount.setValue('');
    this.shareAppForm.controls.pshareconfigid.setValue('');
    this.selectedShareCapitalName='';
    try {
      this._ShareapplicationService.getShareNames(Membertype, Applicanttype).subscribe(res => {
        if (res) {
          this.shareCapitalNames = res;
        }
      });
    } catch (error) {
      this.showErrorMessage(error);
    }
  }
  /**
     * Share capital name changing
     */
  shareCapitalNameChange(event) {
    if (event) {
      debugger;
      this.shareAppForm.controls.pnoofsharesissued.setValue('');
      this.shareAppForm.controls.ptotalamount.setValue('');
      this.shareAppForm.controls['preferenceno'].setValue('');
      this.shareAppErrorMessage.pnoofsharesissued='';
      this.selectedShareCapitalConfigId = Number(event.target.value);
      this.selectedShareCapitalName = event.target.options[event.target.selectedIndex].text;
      this.shareAppForm.controls.pshareconfigid.setValue(this.selectedShareCapitalConfigId);
      this.shareAppForm.controls.pShareName.setValue(this.selectedShareCapitalName);
      this.getSharconfigdetails(this.selectedShareCapitalConfigId, this.applicantType,this.memberType);
    }
  }
  getSharconfigdetails(shareconfigid, Applicanttype, Membertype) {
    
    try {
     this.Multiplesharesarr=[];
      this._ShareapplicationService.getSharconfigdetails(shareconfigid, Applicanttype, Membertype).subscribe(res => {
        if (res) {
          this.Sharconfigdetails = res;
          this.faceValueofShare = this.Sharconfigdetails[0]['pFacevalue'];
          this.shareAppForm.controls.pfacevalue.setValue(this.faceValueofShare);
          this.Maxshare = this.Sharconfigdetails[0]['pMaxshare'];
          this.Minshare = this.Sharconfigdetails[0]['pMinshare'];
          this.IsmultiplesharesNotApplicable=this.Sharconfigdetails[0]['pIsmultiplesharesNotApplicable'];
          this.Multipleshares=this.Sharconfigdetails[0]['pMultipleshares'];
          if(this.IsmultiplesharesNotApplicable==false){
          let Multiplesharesvalus=0;
        for(let i=0;i<this.Maxshare+1;i++){
          Multiplesharesvalus=Multiplesharesvalus+this.Multipleshares
          if(Multiplesharesvalus<=this.Maxshare){
            this.Multiplesharesarr=[...[{'Multiplesharesvalus':Multiplesharesvalus}],...this.Multiplesharesarr];
          }
          else{
            return;
          }
        }
        }
      }
      });
    } catch (error) {
      this.showErrorMessage(error);
    }
  }

  /**
  * Calculation of Toatl face value of Share (start).
  * Multiplication of face value of share and no. of shares issued.
  */
  calculateToatlFaceValueofShare() {
    debugger;
    let pnoofsharesissued = this.shareAppForm.value.pnoofsharesissued ? Number(this.shareAppForm.value.pnoofsharesissued.replace(/,/g, "")) : 1;
    if (this.Minshare > pnoofsharesissued || this.Maxshare < pnoofsharesissued) {
      this.commonService.showWarningMessage('Shares must be between ' + this.Minshare + ' - ' + this.Maxshare);
      this.shareAppForm.controls.pnoofsharesissued.setValue('');
      this.shareAppForm.controls.ptotalamount.setValue('');
      this.toatlFaceValueofShare = '';
      return;
    }
    if(this.IsmultiplesharesNotApplicable==false){
      if(this.Multipleshares>pnoofsharesissued){
        this.commonService.showWarningMessage('Shares must be Multiple' + this.Multipleshares);
      this.shareAppForm.controls.pnoofsharesissued.setValue('');
      this.shareAppForm.controls.ptotalamount.setValue('');
      this.toatlFaceValueofShare = '';
      return;
      }
      else{
        let data = this.Multiplesharesarr.filter(function (debit) {
          return debit.Multiplesharesvalus == pnoofsharesissued;
      })
      if(data==''){
        this.commonService.showWarningMessage('No.of  Shares Issued must be Multiple of  ' + this.Multipleshares );
        this.shareAppForm.controls.pnoofsharesissued.setValue('');
        this.shareAppForm.controls.ptotalamount.setValue('');
        this.toatlFaceValueofShare = '';
        return;
      }
      }
    }

    this.toatlFaceValueofShare = this.faceValueofShare * pnoofsharesissued;
    let TotalAmount = this.toatlFaceValueofShare < 0 ? '(' + this.commonService.currencyformat(Math.abs(this.toatlFaceValueofShare)) + ')' : this.commonService.currencyformat(this.toatlFaceValueofShare);

    this.shareAppForm.controls.ptotalamount.setValue(TotalAmount);
    //this.shareAppForm.controls.pnoofsharesissued.setValue(pnoofsharesissued);
  }
 
  /**
   * Api to save the share app data with appropriate DTO structure (start).
   */
  saveShareApplication() {
    debugger
    let pnoofsharesissueda = parseFloat(this.shareAppForm.value.pnoofsharesissued.toString().replace(/,/g, ""));
    if(pnoofsharesissueda==0 && this.selectedShareCapitalName!='' && this.searchMemberName!=''){
      this.commonService.showWarningMessage("No. of shares Enter");
      return;
    }
    this.loading = true;
    let isValid = true;
    if (this.checkValidations(this.shareAppForm, isValid)) {

      if (this.searchMemberId == '') {
        this.loading = false;
        this.commonService.showErrorMessage("Select Member");
        return;
      }
      else {
        this.shareAppForm.controls.pmemberid.setValue(this.searchMemberId);
        this.shareAppForm.controls.pmembername.setValue(this.searchMemberName);
        this.shareAppForm.controls.ptotalamount.setValue(this.toatlFaceValueofShare);
        this.shareAppForm.controls.pnoofsharesissued.setValue(pnoofsharesissueda);
        let formdata = '';
        formdata = this.shareAppForm.value;
        let jsondata = JSON.stringify(formdata);
        this._ShareapplicationService.SaveShareApplication(jsondata).subscribe(res => {
          this.commonService.showInfoMessage('Saved Successfully');
          let resdata = { accountId: res['pshareapplicationid'], accountNo: res['pShareAccountNo'] };
          this._CoJointmemberService._SetShareAccountdata(resdata);
          let str = "add-joint-member"
          $('.nav-item a[href="#' + str + '"]').tab('show');
          
            this._rdtranscationservice.GetMemberNomineeDetails(this.Membercode).subscribe(json => {
              debugger
      
              this.Nomineedetails = [];
              this._CoJointmemberService.sendMemberNomineeDetails(this.Nomineedetails);
              this.Nomineedetails = json;
               this._CoJointmemberService.sendMemberNomineeDetails(this.Nomineedetails);
           
      
            });
         

        });

      }

    }
    else {
      this.loading = false;
    }

  }
  ReferenceNo(){
    debugger
    let preferenceno= this.shareAppForm.controls.preferenceno.value;
    if(preferenceno==0){
    this.shareAppForm.controls.preferenceno.setValue('');
    }

  }

  /**
   * Api to save the share app data with appropriate DTO structure (end).
   */
  cleadata() {
    this.allSearchMembers = [];
    this.memberTypeId = '';
    this.memberType = '';
    this.searchMemberId = '';
    this.applicantTypes = [];
    this.shareCapitalNames = [];
    //this.memberTypeDetails=[];
    this.shareAppForm.controls.pmembertype.setValue('');
    this.shareAppForm.controls.pmembername.setValue('');
    this.shareAppForm.controls.pmembertypeid.setValue('');
    this.shareAppForm.controls.pTransdate.setValue(new Date());
    this.shareAppForm.controls.psharedate.setValue(new Date());
    this.shareAppForm.controls.pshareissuedate.setValue(new Date());
    
    this.shareAppForm.controls.pApplicanttype.setValue('');
    this.shareAppForm.controls.pShareName.setValue('');
    this.shareAppForm.controls.pnoofsharesissued.setValue('');
    this.shareAppForm.controls.ptotalamount.setValue('');
    this.shareAppForm.controls.preferenceno.setValue('');
    this.memberType = '';
    this.searchMemberName = '';
    this.applicantType = '';
    this.selectedShareCapitalName = '';
    this.Maxshare = '';
    this.Minshare = '';
    this.toatlFaceValueofShare = '';
    this.faceValueofShare = '';
    this.shareAppErrorMessage={};
  }
  cleaShareAppForm(){
    this.cleadata();
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
  checkValidations(group: FormGroup, isValid: boolean): boolean {

    try {

      Object.keys(group.controls).forEach((key: string) => {

        isValid = this.GetValidationByControl(group, key, isValid);
      })

    }
    catch (e) {

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
          this.shareAppErrorMessage[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;

            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;

            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this.commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.shareAppErrorMessage[key] += errormessage + ' ';
                isValid = false;
              }
            }

          }
        }
      }
    }
    catch (e) {

      return false;
    }
    return isValid;
  }
  /**
   * Share capital name changing here and calling (end).
   */
  showErrorMessage(errormsg: string) {
    this.commonService.showErrorMessage(errormsg);
  }
  showInfoMessage(errormsg: string) {
    this.commonService.showInfoMessage(errormsg);
  }

  back() {
    debugger;
    this.router.navigate(['/ShareApplication']);
  }
}
