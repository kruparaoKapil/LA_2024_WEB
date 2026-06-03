import { Component, OnInit, EventEmitter, Input, Output,NgZone } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../../../../Services/common.service'
import { FIIndividualLoanspecficService } from 'src/app/Services/Loans/Transactions/fiindividual-loanspecfic.service';
import { FIIndividualService } from 'src/app/Services/Loans/Transactions/fiindividual.service';
declare let $: any


@Component({
  selector: 'app-vehicle-loan',
  templateUrl: './vehicle-loan.component.html',
  styles: []
})
export class VehicleLoanComponent implements OnInit {
  _FirstInformationTabsData: any = [];
  @Input()
  set FirstInformationTabsData(FirstInformationTabsData: any) {
    this._FirstInformationTabsData = FirstInformationTabsData;
  }
  
  //Forms declarations 
  vehicleForm : FormGroup;
  addDownPayment: boolean = false;
  addOnRoadPrice: boolean = false;
  addActualCost: boolean = false;
  
  vehicleLoanErrorMessage :any;
  showroom:any;
  model: any;
  isEditable: boolean;
  addFlagForCost = true;

  //declartion of grid data
  vehicleData=[]

  constructor(private formbuilder: FormBuilder,private commonService : CommonService,
    private fiindividualservice:FIIndividualLoanspecficService,
    private fiIndividualService: FIIndividualService,
    private zone: NgZone) {

      window['CallingFunctionOutsideDisplayDetailsForShowRoom'] = {
        zone: this.zone,
        componentFn: (value) => this.showRoomDetails(value),
        component: this,
      };

     }
  
  ngOnInit() {
    /** <-----(start)getting models from fiindividual service for drop down arrays(start)---->*/
    this.getShowRoomDetails();
    this.model= JSON.parse(JSON.stringify(this.fiindividualservice.vehiclemodel));
    /** <-----(end)getting models from fiindividual service for drop down arrays(end)---->*/

   /** <-----(start)validations for vehicle form (start)---->*/
    this.vehicleLoanErrorMessage = {};
    this.vehicleForm = this.vehicleForms();
    this.BlurEventAllControll(this.vehicleForm);
  }
    vehicleForms(): FormGroup{
    return this.formbuilder.group({
      pShowroomName: [''],
      pVehicleManufacturer: [''],
      pVehicleModel: [''],
      pActualcostofVehicle: [''],
      pDownPayment: [''],
      pOnroadprice: [''],
      pRequestedLoanAmount: [''],
      pEngineNo: [''],
      pChassisNo: [''],
      pRegistrationNo: [''],
      pYearofMake: [''],
      pAnyotherRemarks: [''],

  
    });
  } 
/** <-----(end) validations for vehicle form (end)---->*/

 /** <-----(start) checking validations for vehicle loan (start) ---->*/
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
          this.vehicleLoanErrorMessage[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;

            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;

            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this.commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.vehicleLoanErrorMessage[key] += errormessage + ' ';
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
 /** <-----(end) checking validations for vehicle loan (end) ---->*/

 /** <-----(start) showing error messages (start) ---->*/
 showErrorMessage(errormsg: string) {
    this.commonService.showErrorMessage(errormsg);
  }
  showInfoMessage(errormsg: string) {
    this.commonService.showInfoMessage(errormsg);
  }
 /** <-----(end) showing error messages (end) ---->*/

  
 /** <-----(start) update for vehicle loan form(start) ---->*/
  patchVehicle() {    
    this.isEditable = true;
  for (let i = 0; i < this.vehicleData.length; i++) {
    this.vehicleForm.patchValue({
      pShowroomName: this.vehicleData[i].pShowroomName,
      pVehicleManufacturer: this.vehicleData[i].pVehicleManufacturer,
      pVehicleModel: this.vehicleData[i].pVehicleModel,
      pActualcostofVehicle: this.vehicleData[i].pActualcostofVehicle,
      pDownPayment: this.vehicleData[i].pDownPayment,
      pOnroadprice: this.vehicleData[i].pOnroadprice,
      pRequestedLoanAmount: this.vehicleData[i].pRequestedLoanAmount,
      pEngineNo: this.vehicleData[i].pEngineNo,
      pChassisNo: this.vehicleData[i].pChassisNo,
      pRegistrationNo: this.vehicleData[i].pRegistrationNo,
      pYearofMake: this.vehicleData[i].pYearofMake,
      pAnyotherRemarks: this.vehicleData[i].pAnyotherRemarks,   
  })
    }
    // this.deleteturnover(this.indexValue);
  }
 /** <-----(end) update for vehicle loan form(end) ---->*/

  showRoomDetails(data) {
    this.vehicleForm.controls.pShowroomName.setValue(data.pAdvocateName)
    let a = data;
  }

 /** <-----(start) functionality for kendo dropdown(vehicle model)(start) ---->*/
  selectShowRoom(e) {
    if (e.dataItem) {
      var dataItem = e.dataItem;
      window['CallingFunctionOutsideDisplayDetailsForShowRoom'].componentFn(dataItem)
    }
  }
  getShowRoomDetails(){
    try {
      let type = 'Business Entity'
      this.fiIndividualService.getReferralAgentDetails(type).subscribe(response => {
        if (response != null) {
          this.showroom = response;
       
        $("#showRoomContacts").kendoMultiColumnComboBox({
          dataTextField: "pAdvocateName",
          dataValueField: "pContactId",
          height: 400,
          columns: [
            {
              field: "pAdvocateName", title: "Contact Name", width: 200
            },
            { field: "pBusinessEntitycontactNo", title: "Contact Number", width: 200 },
            { field: "pReferenceId", title: "Reference ID", width: 200 },

          ],
          footerTemplate: 'Total #: instance.dataSource.total() # items found',
          filter: "contains",
          filterFields: ["pAdvocateName", "pBusinessEntitycontactNo", "pReferenceId"],
          dataSource: this.showroom,
          select: this.selectShowRoom,

        });
      }
      });
    } catch (error) {
      this.showErrorMessage(error);
    }
    }
 /** <-----(end) functionality for kendo dropdown(vehicle model)(end) ---->*/

 /** <-----(start)cheking validations for entered value of down payment price(start) ---->*/
   onEnteredDownPayment() {
    let actualCost = Number((this.vehicleForm.value.pActualcostofVehicle).replace(/,/g, ""));
    let downCost = Number((this.vehicleForm.value.pDownPayment).replace(/,/g, "")) ;
    if( (actualCost !=0 && downCost!=0) && (actualCost < downCost )){
      this.commonService.showWarningMessage("Downpayment cost can not be greter than actual cost");
      // this.addFlagForCost = false;
      this.addDownPayment = true;
    }else {
      this.addDownPayment = false;
    }
  }
 /** <-----(end)cheking validations for entered value of down payment price(end) ---->*/

 /** <-----(start)cheking validations for entered value of road price(start) ---->*/
onEnteredOnRoadPrice() {
    let actualCost = Number((this.vehicleForm.value.pActualcostofVehicle).replace(/,/g, ""));
    let onRoadPrice =  Number((this.vehicleForm.value.pOnroadprice).replace(/,/g, ""));
    if((onRoadPrice < actualCost ) && (onRoadPrice !=0 && actualCost !=0 )){
      this.commonService.showWarningMessage("Onroadprice cost can not be less than actual cost");
      this.addOnRoadPrice = true;
    }
    else {
      this.addOnRoadPrice = false;
    }
  }
 /** <-----(end)cheking validations for entered value of road price(end) ---->*/

 /** <-----(start)cheking validations for entered of actual cost(start) ---->*/
   onEnteredActualCost() {
    let actualCost = Number((this.vehicleForm.value.pActualcostofVehicle).replace(/,/g, ""));
    let downCost = Number((this.vehicleForm.value.pDownPayment).replace(/,/g, "")) ;
    if( (actualCost !=0 && downCost!=0) && (actualCost < downCost )){
      this.commonService.showWarningMessage("Actual cost should be greter than Downpayment cost");
      // this.addFlagForCost = false;
      this.addActualCost = true;
    }else {
      this.addActualCost = false;
    }
  }
 /** <-----(end)cheking validations for entered of value actual cost(end) ---->*/

}
