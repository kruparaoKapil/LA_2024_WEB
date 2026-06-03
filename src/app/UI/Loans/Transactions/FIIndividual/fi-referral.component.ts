import { Component, OnInit, NgZone, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { FIIndividualService } from 'src/app/Services/Loans/Transactions/fiindividual.service';
import { retry } from 'rxjs-compat/operator/retry';
import { Router } from '@angular/router';
declare let $: any
@Component({
  selector: 'app-fi-referral',
  templateUrl: './fi-referral.component.html',
  styles: []
})
export class FiReferralComponent implements OnInit {

  _FirstInformationTabsData: any = [];
  @Input()
  set FirstInformationTabsData(FirstInformationTabsData: any) {
    this._FirstInformationTabsData = FirstInformationTabsData;
  }

  /**
   * Sending flag to retrive 9th tab ((References)) data.
   */
  @Output() forGettingReferencesDataEmit = new EventEmitter();
  
  /**
   * Flag to not show the clear button while edit.
   */
  @Input() forClearButton: boolean;
  
  salesPersonnelModelForm: FormGroup;
  referralModelForm: FormGroup;
  referralForm: FormGroup;
  
  isAllFormDisable = false;
  notApplicableForReferralFlag: boolean = true;
  loading: boolean = false;
  public isLoading: boolean = false;
  
  referralTypeErrorMessage: any;
  loadDetailsData: any;
  referralAgents: any;
  allEmployeeDetails: any;
  oldData: any;
  employeeReferenceId: any;
  agentReferenceId: any;
  dropdoenTabname: any;

  buttonName = "Submit";

  constructor(private formBuilder: FormBuilder, private commomService: CommonService,
    private fiIndividualService: FIIndividualService, private zone: NgZone,
    private router:Router ) {
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
    /**
     * To get the pVchapplicationid from backend By Ravi shanakr Thrymr Software team.
     */
    this.getpVchapplicationid();

    /**
     * To get the pVchapplicationid from backend By Ravi shanakr Thrymr Software team.
     */
    this.getReferralAgentDetails();


    /**
     * To get the pVchapplicationid from backend By Ravi shanakr Thrymr Software team.
     */
    this.getallEmployeeDetails();

    /**
     * Object to bind the error messages. 
     */
    this.referralTypeErrorMessage = {};

    /**
     * Initialization of Referral Form.
     */
    this.referralForm = this.formBuilder.group({
      pReferralname: [''],
      pSalespersonname: ['']
    });

    /**
     * To make blur calling function using form.
     */
    this.BlurEventAllControll(this.referralForm);

    this.salesPersonnelModelForm = this.formBuilder.group({
      selectAgent: ['']
    });

    this.referralModelForm = this.formBuilder.group({
      selectReferral: ['']
    });
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
          this.referralTypeErrorMessage[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;

            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this.commomService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.referralTypeErrorMessage[key] += errormessage + ' ';
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
      return false;
    }
  }



  /**
   * Applicable all and not aplicable tab functionality .
   */ 
  notApplicableAllForReferral(event) {
    var checked = event.target.checked
    if (checked == true) {
      this.notApplicableForReferralFlag = true;
    }
    else {
      this.notApplicableForReferralFlag = false;
    }

    this.ngOnInit();

  }

  /**
   * Error message .
   */
  showErrorMessage(errormsg: string) {
    this.commomService.showErrorMessage(errormsg);
  }

  /**
   * Info message .
   */
  showInfoMessage(errormsg: string) {
    this.commomService.showInfoMessage(errormsg);
  }

  /**
   * To get pVchapplicationid which is generated after saving second tab.
   */
  getpVchapplicationid() {
    debugger
    this.commomService._GetFiTab1Data().subscribe(res => {
      this.oldData = res;
      this.loadDetailsData = res;
    });
  }

  /**
   * Selected dropdown data for ReferralAgent. 
   */
  employeeDetails(data) {
    console.log('a',data)
    this.employeeReferenceId = data.pContactRefNo;
    this.referralForm.controls.pSalespersonname.setValue(data.pEmployeeName);
  }

  /**
   * Selected dropdown data. 
   */
  referralAgentDetails(data) {
    console.log('b',data)
    this.agentReferenceId = data.pReferenceId;
    this.referralForm.controls.pReferralname.setValue(data.pAdvocateName);
  }


  /**
   * Selected data from dropdown table for ReferralAgent .
   */
  SelectReferralAgent(e) {

    if (e.dataItem) {
      var dataItem = e.dataItem;
      window['CallingFunctionOutsideDisplayDetails'].componentFn(dataItem);
    }
  }

  /**
   * Selected data from dropdown table for all Employee.
   */
  selectallEmployee(e) {
    if (e.dataItem) {
      var dataItem = e.dataItem;
      window['CallingFunctionOutsideDisplayDetailsEmployee'].componentFn(dataItem);
    }
  }

 /**
  * Content reset and refresh after saving data.
  */ 
  refreshContactSelectComponent() {
    var multicolumncomboboxRefral = $("#refcontacts").data("kendoMultiColumnComboBox");
    var multicolumncomboboxemployee = $("#allEmployeecontacts").data("kendoMultiColumnComboBox");
    if(multicolumncomboboxRefral){
      multicolumncomboboxRefral.value("");
    }
    if(multicolumncomboboxemployee){
      multicolumncomboboxemployee.value("");
    }
    this.referralForm = this.formBuilder.group({
      pReferralname: [''],
      pSalespersonname: ['']
    });
    this.BlurEventAllControll(this.referralForm);
    this.referralForm.reset();
  }
  
  /**
   * Table dropdown data for Select Referral/Channel Partner/Agent.
   */
  getReferralAgentDetails() {
    try {
      let type = 'ALL'
      this.loading = true;
      this.fiIndividualService.getReferralAgentDetails(type).subscribe(response => {
        if (response != null) {
          this.referralAgents = response;
        }

     /**
      * Dropdown table generation using kendo grid for Select Referral/Channel Partner/Agent.
      */

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
        this.loading = false;
      });
    } catch (error) {
      this.loading = false;
      this.showErrorMessage(error);
    }
  }

  /**
   * Table dropdown data for Select Sales Personnel.
   */
  getallEmployeeDetails() {
    try {
      this.fiIndividualService.getallEmployeeDetails().subscribe(response => {
        if (response != null) {
          this.allEmployeeDetails = response;
          this.allEmployeeDetails.forEach(element => {
            element.pEmployeeName =element.pEmployeeName +" "+element.pEmployeeSurName;
          });
        }

        /**
         * Dropdown table generation using kendo grid for Select Sales Personnel.
         */

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

      });
    } catch (error) {
      this.showErrorMessage(error);
    }
  }

  /**
   * Saving data to api for firstinformationSaveapplication. ((Start))
   */

  firstinformationSaveapplication() {
    debugger
    try {
      
      let isvalid = true;

      
      /**
       *  Appropriate DTO structure for data saving.
       */
      let firstinformationDTO = {
        "firstinformationDTO": {
          "pReferralname":this.referralForm.controls.pReferralname.value,
          "preferralcontactrefid": this.agentReferenceId,
          "psalespersoncontactrefid": this.employeeReferenceId,
          "pSalespersonname":this.referralForm.controls.pSalespersonname.value,
          "pVchapplicationid": this.oldData.pVchapplicationid,
          "pLoantypeid": this.oldData.pLoantypeid,
          "pLoanid": this.oldData.pLoanid,
          "pContacttype": this.oldData.pContacttype,
          "pContactreferenceid": this.oldData.pContactreferenceid,
          "pApplicanttype": this.oldData.pApplicanttype,
          "pLoantype": this.oldData.pLoantype,
          "pLoanname": this.oldData.pLoanname,
          "pBusinessEntitycontactNo": this.oldData.pBusinessEntitycontactNo,
          "pApplicantname": this.oldData.pApplicantname,
          "pApplicantid": this.oldData.pApplicantid,
          "ptypeofoperation": "UPDATE",
          "pCreatedby": this.oldData.pCreatedby,
          "pStatusname": this.oldData.pStatusname,
          "pVchapplicantstatus": this.oldData.pVchapplicantstatus,
          "pDateofapplication": this.oldData.pDateofapplication,
          "pAmountrequested": this.oldData.pAmountrequested,
          "pPurposeofloan": this.oldData.pPurposeofloan,
          "pInteresttype": this.oldData.pInteresttype,
          "pLoanpayin": this.oldData.pLoanpayin,
          "pTenureofloan": this.oldData.pTenureofloan,
          "pTenuretype": this.oldData.pTenuretype,
          "pRateofinterest": this.oldData.pRateofinterest,
          "pIsschemesapplicable": this.oldData.pIsschemesapplicable,
          "pLoaninstalmentpaymentmode": this.oldData.pLoaninstalmentpaymentmode,
          "pSchemename": this.oldData.pSchemename,
          "pSchemecode": this.oldData.pSchemecode,
          "pInstalmentamount": this.oldData.pInstalmentamount,
          "pIsreferralapplicable": !this.notApplicableForReferralFlag,
          "pPartprinciplepaidinterval": this.oldData.pPartprinciplepaidinterval,
          "firstinformationDTO": [

          ]
        }

      }

      if ((this.notApplicableForReferralFlag != true)) {
        if(this.checkValidations(this.referralForm, isvalid)){
          if (this.oldData != null) {
            this.buttonName = "Processing";
            this.isLoading = true;
            debugger
            let abc = JSON.stringify(firstinformationDTO);
            this.fiIndividualService.firstinformationSaveapplication(firstinformationDTO).subscribe(response => {
              if(response) {
                this.buttonName = "Submit";
                this.isLoading = false;
                this.showInfoMessage('Saved successfully');
                this.router.navigateByUrl('/FiView');
                this.referralForm = this.formBuilder.group({
                  pReferralname: [''],
                  pSalespersonname: ['']
                });
                this.BlurEventAllControll(this.referralForm);
              }
              else {
                this.buttonName = "Submit";
                this.isLoading = false;
              }
            }, (error) => {
              this.buttonName = "Submit";
              this.isLoading = false;
            });
          } else {
            this.showErrorMessage('Data not found');
          }
        } 
      } else {
        if (this.oldData != null) {
          this.buttonName = "Processing";
          this.isLoading = true;
          this.fiIndividualService.firstinformationSaveapplication(firstinformationDTO).subscribe(response => {
            if(response) {
              this.buttonName = "Submit";
              this.isLoading = false;
              this.showInfoMessage('Saved successfully');
              this.router.navigateByUrl('/FiView');
              this.refreshContactSelectComponent();
              this.referralForm = this.formBuilder.group({
                pReferralname: [''],
                pSalespersonname: ['']
              });
              this.BlurEventAllControll(this.referralForm);
            }
            else {
              this.buttonName = "Submit";
              this.isLoading = false;
            }
          }, (error) => {
            this.buttonName = "Submit";
            this.isLoading = false;
          });
        } 
      }
    } catch (error) {
      this.showInfoMessage(error);
    }
  }
  
  /**
   * Saving data to api for firstinformationSaveapplication. ((End))
   */


  /**
   * Clearing form data. 
   */
  clearFormData(){

    /**
     * Object to bind the error messages. 
     */
    this.referralTypeErrorMessage = {};

    /**
     * Initialization of Referral Form.
     */
    this.referralForm = this.formBuilder.group({
      pReferralname: [''],
      pSalespersonname: ['']
    });

    /**
     * To make blur calling function using form.
     */
    this.BlurEventAllControll(this.referralForm);

    /**
     * To clear the kendo table drop down in referral form.
     */
    this.refreshContactSelectComponent();
  }

  /**
   * Moving previous tab from current tab.
   */
  moveToPreviousTab() {
    // let str = 'references';
    // this.dropdoenTabname = "References";
    // $('.nav-item a[href="#' + str + '"]').tab('show');
    let str;
    let temptabname;
    this.dropdoenTabname = this.commomService.GetFiTabName();
    let tempFirstInformationTabsData = this._FirstInformationTabsData;
    for (let i = 0; i < tempFirstInformationTabsData.length; i++) {
      let pTabsectionname = tempFirstInformationTabsData[i].pTabsectionname;
      if (pTabsectionname == this.dropdoenTabname) {
        str = tempFirstInformationTabsData[i - 1].pTabsectionid;
        temptabname = tempFirstInformationTabsData[i - 1].pTabsectionname;
        this.commomService.SetFiTabName(temptabname);
      }
    }
    this.dropdoenTabname = temptabname;
    $('.nav-item a[href="#' + str + '"]').tab('show').addClass('active show');
    this.forGettingReferencesDataEmit.emit(true);
  }

}
