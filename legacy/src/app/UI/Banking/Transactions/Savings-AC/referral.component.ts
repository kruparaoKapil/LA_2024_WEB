import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { SavingtranscationService } from 'src/app/Services/Banking/savingtranscation.service';
import { FIIndividualService } from 'src/app/Services/Loans/Transactions/fiindividual.service';
import { Router } from '@angular/router';
declare let $: any
@Component({
  selector: 'app-referral',
  templateUrl: './referral.component.html',
  styles: []
})
export class ReferralComponent implements OnInit {
  referralAgents: any;
  referralAgentsList: any
  allEmployeeDetails: any;
  referralForm: any;
  referralTypeErrorMessage: any;
  employeeReferenceId: any;
  buttontype: any;
  agentReferenceId: any;

  loading: boolean = false;
  ApplicableForReferralFlag: boolean = false;
  constructor(private fiIndividualService: FIIndividualService, private _fb: FormBuilder, private _commonService: CommonService, private savingtranscationservice: SavingtranscationService, private zone: NgZone, private router: Router) {
    window['CallingFunctionOutsideDisplayDetailsEmployee'] = {
      zone: this.zone,
      componentFn: (value) => this.employeeDetails(value),
      component: this,
    };

    window['CallingFunctionOutsideDisplayDetails'] = {
      zone: this.zone,
      componentFn: (value) => this.referralAgentDetails(value),
      component: this,
    };
  }


  ngOnInit() {
    debugger
    this.referralTypeErrorMessage = {};
    this.FormGroup();
    this.getReferralAgentDetails();
    this.getallEmployeeDetails();
    this.buttontype = this.savingtranscationservice.GetButtonClickType()

    if (this.buttontype == "Edit") {
      this.BindData()

    }
      this.BlurEventAllControll(this.referralForm)
  }
  FormGroup() {
    this.referralForm = this._fb.group({
      pRecordid: [0],
      pSavingaccountid: [''],
      pSavingaccountno: [''],
      pReferralid: [''],
      pReferralname: [''],
      pSalespersonname: [null],
      pIsreferralapplicable: [false],
      ptypeofoperation: ['CREATE'],
      pCreatedby: [this._commonService.pCreatedby]

    });
  }
  getReferralAgentDetails() {
    debugger;

    let type = 'ALL'
    //this.loading = true;
    this.fiIndividualService.getReferralAgentDetails(type).subscribe(response => {
      debugger;

      if (response != null) {

        this.referralAgents = response;
        $("#refcontacts").kendoMultiColumnComboBox({
          dataTextField: "pAdvocateName",
          dataValueField: "pContactId",
          height: 400,
          columns: [
            {
              field: "pAdvocateName", title: "Contact Name", template: "<div class='customer-photo'" +
                "style='background-image: url(../content/web/Customers/#:data.CustomerID#.jpg);'></div>" +
                "<span class='customer-name'>#: pAdvocateName #</span>", width: 200
            },
            { field: "pBusinessEntitycontactNo", title: "Contact Number", width: 200 },
            { field: "pReferenceId", title: "Reference ID", width: 200 },

          ],
          footerTemplate: 'Total #: instance.dataSource.total() # items found',
          filter: "contains",
          filterFields: ["pAdvocateName", "pBusinessEntitycontactNo", "pReferenceId"],
          dataSource: this.referralAgents,
          select: this.SelectReferralAgent,

        });
      }

    });

  }
  SelectReferralAgent(e) {

    if (e.dataItem) {
      var dataItem = e.dataItem;
      window['CallingFunctionOutsideDisplayDetails'].componentFn(dataItem);
    }
  }
  selectallEmployee(e) {
    if (e.dataItem) {
      var dataItem = e.dataItem;
      window['CallingFunctionOutsideDisplayDetailsEmployee'].componentFn(dataItem);
    }
  }
  getallEmployeeDetails() {
    try {
      this.fiIndividualService.getallEmployeeDetails().subscribe(response => {
        if (response != null) {
          this.allEmployeeDetails = response;

          $("#allEmployeecontacts").kendoMultiColumnComboBox({
            dataTextField: "pEmployeeName",
            dataValueField: "pContactId",
            height: 400,
            columns: [
              {
                field: "pEmployeeName", title: "Employee Name", width: 200
              },
              { field: "pEmployeeContactNo", title: "Contact Number", width: 200 },
              { field: "pContactRefNo", title: "Reference ID", width: 200 },

            ],
            footerTemplate: 'Total #: instance.dataSource.total() # items found',
            filter: "contains",
            filterFields: ["pAdvocateName", "pEmployeeContactNo", "pContactRefNo"],
            dataSource: this.allEmployeeDetails,
            select: this.selectallEmployee,

          });
        }

      });
    } catch (error) {

      this.showErrorMessage(error);
    }
  }
  ApplicableAllForReferral(event) {
    debugger;
    this.ngOnInit();
    var checked = event.target.checked
    if (checked == true) {
      this.ApplicableForReferralFlag = true;
      this.referralForm.controls.pIsreferralapplicable.setValue(true);
      this.referralForm.controls.pReferralid.setValidators(Validators.required);
     // this.referralForm.controls.pSalespersonname.setValidators(Validators.required);
      this.referralForm.controls.pReferralid.updateValueAndValidity();
    //  this.referralForm.controls.pSalespersonname.updateValueAndValidity();
      this.BlurEventAllControll(this.referralForm);
      
    }
    else {
      this.ApplicableForReferralFlag = false;
      this.referralForm.controls.pIsreferralapplicable.setValue(false);
    }

   

  }
  //RefferalApplicable() {
  //  let Isreferral = this.referralForm.controls.pIsreferralapplicable.value;
  //  if (Isreferral) {
  //    this.ShowReferral = true;

  //  }
  //  else {
  //    this.ShowReferral = false;
  //  }
  //}
  showErrorMessage(errormsg: string) {
    this._commonService.showErrorMessage(errormsg);
  }
  employeeDetails(data) {
    this.employeeReferenceId = data.pContactRefNo;
    this.referralForm.controls.pSalespersonname.setValue(data.pEmployeeName);
  }
  referralAgentDetails(data) {
    debugger
    this.referralForm.controls.pReferralname.setValue(data.pAdvocateName);
    this.referralForm.controls.pReferralid.setValue(data.pContactId);
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
          this.referralTypeErrorMessage[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {

            let errormessage;

            for (const errorkey in formcontrol.errors) {
              if (errorkey) {

                let lablename;

                lablename = (document.getElementById(key) as HTMLInputElement).title;
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
      this._commonService.showErrorMessage(key);
      return false;
    }
    return isValid;
  }

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
  SaveReferral() {
    debugger;
    this.loading = true;
    
      let isValid: boolean = true;
      if (this.checkValidations(this.referralForm, isValid)) {
        let savingAccountDetails = this.savingtranscationservice.GetAccountNoAndId();
        this.referralForm.controls.pSavingaccountid.setValue(savingAccountDetails.pSavingaccountid);
        this.referralForm.controls.pSavingaccountno.setValue(savingAccountDetails.pSavingaccountno);
        //pReferralid
        if(this.referralForm.controls.pIsreferralapplicable.value == false){
          this.referralForm.controls.pReferralid.setValue(0);
        }
        let data = JSON.stringify(this.referralForm.value);
        this.savingtranscationservice.SaveReferral(data).subscribe(res => {
          debugger;
          this.loading = false;
          if (res) {
            let SavingAccounttransdetails = null;
            this.loading = false;
            //SavingAccounttransdetails = Object.assign(this.ContactDetails, res);
            //this.savingtranscationservice.SetAccountNoAndId(SavingAccounttransdetails);
            this.router.navigateByUrl("/SavingsTransactionsView")
          }
        }, err => {
          this.loading = false;
          this._commonService.showErrorMessage("Error while saving")
        });
      }
      else {
        this.loading = false;
      }
   
  }

  BindData() {
    debugger;
    let EditData = this.savingtranscationservice.GetSavingTransactionDetailsForEdit();
    let savingTransData = EditData[0].savingAccountTransactionlist;
    let Referrallist = EditData[0].referrallist;

    if (savingTransData.pIsreferralapplicable) {
      this.ApplicableForReferralFlag = true;

    }

    this.referralForm.patchValue({
      ptypeofoperation: "UPDATE",
      pSavingaccountid: savingTransData.pSavingaccountid,
      pSavingaccountno: savingTransData.pSavingaccountno,
      pReferralid: Referrallist.pReferralid,
      pReferralname: Referrallist.pReferralname,
      pSalespersonname: Referrallist.pSalespersonname,
      pIsreferralapplicable: savingTransData.pIsreferralapplicable
    });
    //debugger;
    //this.SelectedMembertypeid = savingTransData.pMembertypeid;
    //this.contactType = savingTransData.pContacttype;
    //this.Applicanttype = savingTransData.pApplicanttype;
    //let savingaccobj = ({ pSavingaccname: savingTransData.pSavingaccname, pSavingconfigid: savingTransData.pSavingconfigid })
    //this.SavingAccChange(savingaccobj);




  }


}
