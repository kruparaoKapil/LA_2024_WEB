import { Component, OnInit, ViewChild, DoCheck, NgZone, Output, EventEmitter, AfterViewInit, Input } from '@angular/core';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Toast, ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/Services/common.service';
import { SelectableSettings } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { LoansmasterService } from 'src/app/Services/Loans/Masters/loansmaster.service';
import { ShareconfigService } from 'src/app/Services/Banking/shareconfig.service';
declare let $: any
@Component({
  selector: 'app-share-capital',
  templateUrl: './share-capital.component.html',
  styleUrls: []
})
export class ShareCapitalComponent implements OnInit {
 @Input() sharenameedit:any;
  constructor(private formbuilder: FormBuilder, public Toast: ToastrService, private _loanmasterservice: LoansmasterService, private _route: ActivatedRoute, private _commonService: CommonService, private shareconfigservice: ShareconfigService) { }
  public ShareCapitalValidationErrors: any;
  public memberdetails: any = [];
  ApplicantTypes: any = [];
  Tab1details: any;
  buttontype: any;
  editdata: any;
  public Buttonlabel: any = 'Add';
  applicanttype: any = [];
  savebutton="Save & Continue";
  disablesavebutton=false;
  membertype: any = [];
  shareconfigdata: any;
  saveconfigdata: any;
  public ShowApplicant: boolean = false;
  ShareCapitalForm: FormGroup;
  ShareCapitalDetails: any = [];
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10
  };
  ngOnInit() {

    debugger
    this.ShareCapitalDetails = [];
    this.Buttonlabel = "Add";
    this.savebutton="Save & Continue";
    this.disablesavebutton=false;
    this.GetFormgroupData();
    this.GetMemberDetails();
    this.getApplicantTypes("Individual");
    this.BlurEventAllControll(this.ShareCapitalForm)
 
 if(this.sharenameedit){
    this.buttontype = this.shareconfigservice.Newstatus();
 }
 else{
    this.buttontype ='New';
 }
    if (this.buttontype == "edit") {
      this.editdata = this.shareconfigservice.SetTab2data();
      if(this.editdata){
      this.ShareCapitalDetails = this.editdata.lstShareconfigDetailsDTO

      this.ShareCapitalForm.controls.psharename.setValue(this.editdata.psharename)
      this.ShareCapitalForm.controls.pshareconfigid.setValue(this.editdata.pshareconfigid)
      this.ShareCapitalForm.controls.psharecode.setValue(this.editdata.psharecode)
      if (this.editdata.lstShareconfigDetailsDTO != 0) {
        this.editdata.lstShareconfigDetailsDTO.filter(item => {

          item.pTypeofOperation = 'UPDATE'
        })
      }
      }


      console.log(this.editdata)
    }


  }

  GetFormgroupData() {
    this.ShareCapitalValidationErrors = {}
    this.ShareCapitalForm = this.formbuilder.group({
      precordid: [0],
      pshareconfigid: [0],
      psharename: [''],
      psharecode: [''],
      pmembertypeid: ['', Validators.required],
      pmembertype: [''],
      papplicanttype: ['', Validators.required],
      pfacevalue: ['', Validators.required],
      pminshares: ['', Validators.required],
      pmaxshares: ['', Validators.required],
      pismultipleshares: [true],
      pmultipleshares: [0],
      pisdivedend: [false],
      pdivedendpayout: [''],
      psharetransfer: [false],
      pTypeofOperation: [this._commonService.ptypeofoperation]
    });
    this.CheckShareMultiple(true);
    this.CheckDividend(false)
  }

  public GetMemberDetails() {
    this._commonService.Getmemberdetails('member').subscribe(json => {
      this.memberdetails = json;
    });
  }

  getApplicantTypes(type) {

    if (type && type != undefined && type != '') {
      this._loanmasterservice.GetApplicanttypes(type, 0).subscribe(json => {
        if (json) {
          this.ApplicantTypes = json
        }
      })
    }
  }
  Getnameandcodedetails() {

    this.Tab1details = this.shareconfigservice.Sendsharenameandcodedetails()
    console.log(this.Tab1details)
  }
  public CheckDividend(event) {

    let check
    if (event == true || event == false) {
      check = event
    }
    else {
      check = event.target.checked
    }
    if (check == true) {
      this.ShowApplicant = true;
      this.ShareCapitalForm.controls['pdivedendpayout'].setValue('Monthly');
    }
    else {
      this.ShowApplicant = false;
      this.ShareCapitalForm.controls['pdivedendpayout'].setValue('');
    }
  }

  public CheckShareMultiple(check) {
    debugger
    if (check == true) {
      this.ShareCapitalForm.controls['pmultipleshares'].setValue(0);
      this.ShareCapitalForm.controls['pmultipleshares'].disable();
       this.ShareCapitalForm.controls['pmultipleshares'].clearValidators();
      this.ShareCapitalForm.controls['pmultipleshares'].updateValueAndValidity();
    }
    else {
      this.ShareCapitalForm.controls['pmultipleshares'].setValue(0);
      this.ShareCapitalForm.controls['pmultipleshares'].enable();
      this.ShareCapitalForm.controls['pmultipleshares'].setValidators(Validators.required);
      this.ShareCapitalForm.controls['pmultipleshares'].updateValueAndValidity();

    }
    this.BlurEventAllControll(this.ShareCapitalForm);
  }

  public CheckMaxMinValues() {
    debugger
    let minvalue = +this.ShareCapitalForm.controls['pminshares'].value;
    let maxvalue = +this.ShareCapitalForm.controls['pmaxshares'].value
    if (maxvalue < minvalue) {
      this.ShareCapitalForm.controls['pmaxshares'].setValue('');
    }

  }
  minShareChange(event) {
    debugger
    if (event.target.value) {
      this.ShareCapitalValidationErrors.pminshares='';
    }
    else {
      this.ShareCapitalForm.controls['pminshares'].setValue('');
    }
    this.validate();
  }

  maxShareChange(event) {
    debugger;
    if (event.target.value) {
         this.ShareCapitalValidationErrors.pmaxshares='';
    }
    else {
        this.ShareCapitalForm.controls['pmaxshares'].setValue('');
    }
    this.validate();
  }

  validate():boolean{
    debugger
    let minshares = this.ShareCapitalForm.controls['pminshares'].value;
    let maxshares =this.ShareCapitalForm.controls['pmaxshares'].value;
    if (isNullOrEmptyString(minshares)) {
      minshares = 0;
    }
    else {
      minshares = parseFloat(minshares.toString().replace(/,/g, ""));
    }
    if (isNullOrEmptyString(maxshares)) {
      maxshares = 0;
    }
    else {
      maxshares = parseFloat(maxshares.toString().replace(/,/g, ""));
    }
    if (maxshares > 0) {
      if (minshares >maxshares) {
        this.ShareCapitalValidationErrors.pmaxshares="Maximum Shares must be Greater than Minimum Shares";
        return false;
      }
     else {
       if(maxshares!=0){
           this.ShareCapitalValidationErrors.pmaxshares="";
           return true;
       }
      //  else{
      //    this.ShareCapitalValidationErrors.pminshares="Minimum Required";
      //  }
      }
    }
  }

  public Checksharemultiples() {
    debugger;
    let minvalue = +this.ShareCapitalForm.controls['pminshares'].value;
    let maxvalue = +this.ShareCapitalForm.controls['pmaxshares'].value;
    let sharemultiples = +this.ShareCapitalForm.controls['pmultipleshares'].value;
    let sharemultiple= parseInt(this.ShareCapitalForm.controls['pmultipleshares'].value);
    let pismultipleshares=this.ShareCapitalForm.controls['pismultipleshares'].value
    if(pismultipleshares==false){
    if(sharemultiple==0){
      this.ShareCapitalForm.controls['pmultipleshares'].setValue('');
      this._commonService.showWarningMessage('Multiples of Must be greater than Zero');
      return;
    }
    }
    // if (minvalue > sharemultiples || maxvalue < sharemultiples) {
    if (maxvalue < sharemultiples) {
      this.ShareCapitalForm.controls['pmultipleshares'].setValue('');
       this._commonService.showWarningMessage('Should not be greater than Maximum Shares');
    }
  }
  ApplicanttypeChange($event) {
    this.applicanttype = [];
    if ($event.length > 0) {
      $event.reduce((acc, item) => {
        this.applicanttype.push({ applicanttype: item.pApplicanttype })
      }, []);

    }
  }
  MemberTypeChange($event) {
    debugger;
    this.membertype = [];
    if ($event.length > 0) {
      $event.reduce((acc, item) => {
        this.membertype.push({ membertypeid: item.pmembertypeid, membertypename: item.pmembertype })
      }, []);
      //const MemberTypename = $event.target.options[$event.target.selectedIndex].text;
      //  this.SavingAccountConfigurationform.controls.pMembertype.setValue(MemberTypename);
    }
  }
  AddorUpdatedata() {
    debugger
    let isValid = true;
    console.log(this.ShareCapitalForm.getRawValue())
    this.Getnameandcodedetails()
    if (this.ShareCapitalForm.controls.pismultipleshares.value == false && this.ShareCapitalForm.controls.pmultipleshares.value == "") {
      this.ShareCapitalForm.controls.pmultipleshares.setValue(0)

    }
   
    if (this.checkValidations(this.ShareCapitalForm, isValid ) && this.validate()){
       ;
      if (this.Buttonlabel == "Add") {
        debugger;
         let sharemultiple= parseInt(this.ShareCapitalForm.controls['pmultipleshares'].value);
       let pismultipleshares=this.ShareCapitalForm.controls['pismultipleshares'].value
       if(pismultipleshares==false){
       if(sharemultiple==0){
         this.ShareCapitalForm.controls['pmultipleshares'].setValue('');
          this._commonService.showWarningMessage('Multiples of Must be greater than Zero');
         return;
    }
    }
      let facevalue=this.ShareCapitalForm.controls.pfacevalue.value;        
      facevalue = parseFloat(facevalue.toString().replace(/,/g, ""));
      if(facevalue<=0){
          this.ShareCapitalForm.controls.pfacevalue.setValue('');
           this._commonService.showWarningMessage('Face Value of Share Must be Greater Than Zero.');
           return;
      }
        if (this.membertype.length != 0 && this.applicanttype.length != 0) {
          this.membertype.reduce((acc, memberitem) => {
            for (let i = 0; i < this.applicanttype.length; i++) {
              debugger;
              const Checkexistcount = this.ShareCapitalDetails.filter(s => s.pmembertype == memberitem.membertypename && s.papplicanttype == this.applicanttype[i].applicanttype).length;
              if (Checkexistcount == 0) {
                this.ShareCapitalForm.controls.pmembertypeid.setValue(memberitem.membertypeid);
                this.ShareCapitalForm.controls.pmembertype.setValue(memberitem.membertypename);
                this.ShareCapitalForm.controls.papplicanttype.setValue(this.applicanttype[i].applicanttype);
                let facevalue = this._commonService.removeCommasForEntredNumber(this.ShareCapitalForm.controls['pfacevalue'].value)
                let minlimit=this._commonService.removeCommasForEntredNumber(this.ShareCapitalForm.controls['pminshares'].value)
                let maxlimit=this._commonService.removeCommasForEntredNumber(this.ShareCapitalForm.controls['pmaxshares'].value)
                this.ShareCapitalForm.controls['pfacevalue'].setValue(facevalue)
                this.ShareCapitalForm.controls['pminshares'].setValue(minlimit)
                this.ShareCapitalForm.controls['pmaxshares'].setValue(maxlimit)
                this.ShareCapitalDetails.push(this.ShareCapitalForm.getRawValue());
                

              }
              else{
          
                this._commonService.showWarningMessage("Member Type Already Exist.")
              }
            }
            this.ShareCapitalForm.controls['pmultipleshares'].disable();
          }, []);

        }
         
      }
      this.Reset();
      this.ShareCapitalValidationErrors = {}

    }


  }
  Reset() {
    this.GetFormgroupData()
    this.ShowApplicant = false;
     this.ShareCapitalForm.controls['pmultipleshares'].disable();
    // this.ShareCapitalForm.controls.pshareconfigid.setValue(0)
    // this.ShareCapitalForm.controls.pismultipleshares.setValue(true)
    // this.ShareCapitalForm.controls.pmultipleshares.setValue(0)
    // this.ShareCapitalForm.controls.psharecode.setValue("")
    // this.ShareCapitalForm.controls.psharename.setValue("")
    // this.ShareCapitalForm.controls.precordid.setValue(0)
    // this.ShareCapitalForm.controls.pTypeofOperation.setValue('CREATE')

  }
  removeHandler(event) {
    this.ShareCapitalDetails.splice(event.rowIndex, 1);
  }
  saveshareconfigform() {
    debugger
    if (this.ShareCapitalDetails.length != 0) {
      
      if (this.buttontype == "New") {
        this.saveconfigdata = {
          lstShareconfigDetailsDTO: this.ShareCapitalDetails, pCreatedby: this._commonService.pCreatedby, pshareconfigid:
            this.Tab1details.pshareconfigid, psharename: this.Tab1details.psharename, psharecode: this.Tab1details.psharecode
        }

      }
      else {
        this.saveconfigdata = {
          lstShareconfigDetailsDTO: this.ShareCapitalDetails, pCreatedby: this._commonService.pCreatedby, pshareconfigid:
            this.editdata.pshareconfigid, psharename: this.editdata.psharename, psharecode: this.editdata.psharecode
        }
       
        this.ShareCapitalDetails.filter(item => {
          item.pshareconfigid = this.editdata.pshareconfigid,
          item.psharename=this.editdata.psharename
          item.psharecode=this.editdata.psharecode
         
        })
      }
     
      let data = JSON.stringify(this.saveconfigdata)
      console.log(data)
     this.savebutton="Processing";
     this.disablesavebutton=true;
      this.shareconfigservice.savesharecapitaldetails(data).subscribe(res => {
        if (res) {
          this.savebutton="Save & Continue";
          this.disablesavebutton=false;
          if (this.buttontype == "New") {
            this.shareconfigservice.GetShareConfigurationDetails(this.Tab1details.psharename, this.Tab1details.psharecode).subscribe(res => {
              console.log(res)
              this.shareconfigdata = res
              this.shareconfigservice.Getshareconfigdetails(this.shareconfigdata)
            })
          }

          let str = "referral-commission"
          $('.nav-item a[href="#' + str + '"]').tab('show');

        }

      })
    }
    else {
        //this.AddorUpdatedata();
        this._commonService.showWarningMessage('Add Atleast One Item to Grid');
    }

  }
  clear() {
    this.ngOnInit();
    this.ShareCapitalDetails = []
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
          this.ShareCapitalValidationErrors[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.ShareCapitalValidationErrors[key] += errormessage + ' ';
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
    this._commonService.showErrorMessage(errormsg);
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

}
