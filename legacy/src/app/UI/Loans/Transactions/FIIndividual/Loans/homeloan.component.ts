import { Component, OnInit, ViewChild, Input,OnChanges } from '@angular/core';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/Services/common.service';
import { ContacmasterService } from 'src/app/Services/Loans/Masters/contacmaster.service';
import { AddressComponent } from 'src/app/UI/Common/address/address.component';
import { BsDatepickerConfig } from 'ngx-bootstrap';

@Component({
  selector: 'app-homeloan',
  templateUrl: './homeloan.component.html',
  styles: []
})
export class HomeloanComponent implements OnInit {

  @ViewChild(AddressComponent, { static: false }) addressFormdata: AddressComponent;
	_FirstInformationTabsData: any = [];
  @Input()
  set FirstInformationTabsData(FirstInformationTabsData: any) {
    this._FirstInformationTabsData = FirstInformationTabsData;
  }
  
  HomeloanForm: FormGroup
  prolocationform: FormGroup
  proownerform: FormGroup
  propertytypeform: FormGroup
  purposeForm: FormGroup
  statusofform: FormGroup

  HomeloanErrorMessage: any;
  countryDetails: any;
  stateDetails: any;
  districtDetails: any;
  fileName: any = '';

  fileData = null;
  percentDone: number;
  uploadSuccess: boolean;
  associateConcernsExist: boolean = false;
  associateConcernDetails: boolean = false;
  arrowforprodetails: boolean = true;
  builderdetails: boolean = true;
  arrowforBalance: boolean = true;
  arrowforSources: boolean = true;
  arrowforcostfund: boolean = true;
  arrowforrepairs: boolean = true;
  arrowForHomeLoanAddress: boolean = true;

  proloaction: any = [{ prolocation: 'Metro' }, { prolocation: 'Semiurban' }, { prolocation: 'Rural' }, { prolocation: 'Urban' }]
  proownership: any = [{ proownersship: 'joint ownershp' }, { proownersship: 'single ownership' }]
  propertytypearray: any = [{ typepro: 'Mixed use (Commercial and Residential)' }, { typepro: 'Mixed use (Commercial and Retail)' },
  { typepro: 'New Commercial flat (Part area)' },
  { typepro: 'New Commercial property (Full building)' }, { typepro: 'New Residential Flat' }, { typepro: 'New Residential House/Villa' },
  { typepro: 'Used Commercial flat (Part Area)' }, { typepro: 'Used Commercial Property (Full Building)' }, { typepro: 'Used Residential House/Villa' },
  ]
  purposepro: any = [{ purpose: 'Balance Transfer' }, { purpose: 'Home Extension' }, { purpose: 'Purchase of Property' }, { purpose: 'Reimbursement of Expenditure' }, { purpose: 'Repairs and Renovation' },]
  statusofpro: any = [{ status: 'Partly Rented' }, { status: 'Partly Vacant' }, { status: 'Self Occupied' },]

  public pDateOfBookingConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public pDateOfLikelyCompletionConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public pDateOfBookingOccupancyDateConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    private _contacmasterservice: ContacmasterService,
    private _commonService: CommonService) {
    /**<-----(start) bsconfig functionalities of date picker (start)----->*/
    this.pDateOfBookingConfig.containerClass = 'theme-dark-blue';
    this.pDateOfBookingConfig.showWeekNumbers = false;
    this.pDateOfBookingConfig.dateInputFormat = 'DD/MM/YYYY';

    this.pDateOfLikelyCompletionConfig.containerClass = 'theme-dark-blue';
    this.pDateOfLikelyCompletionConfig.showWeekNumbers = false;
    this.pDateOfLikelyCompletionConfig.dateInputFormat = 'DD/MM/YYYY';

    this.pDateOfBookingOccupancyDateConfig.containerClass = 'theme-dark-blue';
    this.pDateOfBookingOccupancyDateConfig.showWeekNumbers = false;
    this.pDateOfBookingOccupancyDateConfig.dateInputFormat = 'DD/MM/YYYY';
    /**<-----(end) bsconfig functionalities of date picker (end)----->*/

  }

  ngOnInit() {
    /**<-----(start) add field's of dropdown form group validations (start)----->*/
    this.prolocationform = this.formBuilder.group({
      prolocation: ['', Validators.required]
    })
    this.proownerform = this.formBuilder.group({
      proownersship: ['', Validators.required]
    })
    this.propertytypeform = this.formBuilder.group({
      typepro: ['', Validators.required]
    })
    this.purposeForm = this.formBuilder.group({
      purpose: ['', Validators.required]
    })
    this.statusofform = this.formBuilder.group({
      status: ['', Validators.required]
    })
    /**<-----(end) add field's of dropdown form group validations (end)----->*/

    this.HomeloanErrorMessage = {};
    this.HomeloanForm = this.formBuilder.group({
      pRecordid: [0],
      pinitialpayment: [''],
      ppropertylocation: [''],
      ppropertyownershiptype: [''],
      ppropertytype: [''],

      ppurpose: [''],
      ppropertystatus: [''],
      pbuildertieup: ['no'],
      pprojectname: [''],
      pownername: [''],
      pselleraddress: [''],
      pbuildingname: [''],
      pblockname: [''],
      pbuiltupareain: [''],
      pplotarea: [''],
      pundividedshare: [''],
      pplintharea: [''],
      pbookingdate: [''],
      pcompletiondate: [''],
      poccupancycertificatedate: [''],
      pactualcost: [''],
      psaleagreementvalue: [''],

      ptotalvalueofproperty: [0],
      pstampdutycharges: [''],
      potheramenitiescharges: [''],
      potherincidentalexpenditure: [''],
      ptotalvalue: [0],
      pageofbuilding: [''],
      poriginalcostofproperty: [''],
      pestimatedvalueofrepairs: [''],
      BankCreditFacilityName: [''],
      LoanDate: [''],
      LoanAmount: [''],
      LoanacNumber: [''],
      AgeofBLoanAmountuilding: [''],
      AsonDateOutstanding: [''],
      Installmentamount: [''],
      TotalTenureofLoan: [''],
      RemainingTenureofloan: [''],
      UploadLoanSanctionDocument: [''],
      UploadEMIChart: [''],
      pamountalreadyspent: [0],
      potherborrowings: [0],
      paddress1: [''],
      paddress2: [''],
      pcity: [''],
      pState: [''],
      pDistrict: [''],
      pCountry: [''],

      pStateId: [''],
      pDistrictId: [''],
      pCountryId: [''],
      ppincode: [''],
    })
    this.BlurEventAllControll(this.HomeloanForm);
    this.getCountryDetails();
  }
  /**<-----(start) rotation of arrow functionalities of accordians  (start)----->*/

  arrowChangeforprodetails() {
    this.arrowforprodetails = !this.arrowforprodetails
  }
  arrowChangeforcostfund() {
    this.arrowforcostfund = !this.arrowforcostfund
  }
  arrowChangeforrepairs() {
    this.arrowforrepairs = !this.arrowforrepairs
  }
  arrowChangeforSources() {
    this.arrowforSources = !this.arrowforSources
  }
  arrowChangeforBalance() {
    this.arrowforBalance = !this.arrowforBalance
  }
  arrowChangeForAddress() {
    this.arrowForHomeLoanAddress = !this.arrowForHomeLoanAddress;
  }
  /**<-----(end) rotation of arrow functionalities of accordians  (end)----->*/

  associateConcernsChange(event) {
    //console.log(event.target.value);
    // let type = event.target ?  event.target.value : event;
    // if(type == 'yes'){
    //   this.builderdetails=true
    // }else{
    //   this.builderdetails=false
    // }
  }

  /**<-----(start) upload file functionality  (start)----->*/
  upload(files: File[]) {
    this.uploadAndProgress(files);
  }
  upload2(files: File[]) {
    this.uploadAndProgress2(files);
  }
  uploadAndProgress(files: File[]) {
    this.fileName = files[0].name;
    var formData = new FormData();
    Array.from(files).forEach(f => formData.append('file', f))

    this.http.post('https://file.io', formData, { reportProgress: true, observe: 'events' })
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.percentDone = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          this.uploadSuccess = true;
        }
      });
  }
  uploadAndProgress2(files: File[]) {
    this.fileName = files[0].name;
    var formData = new FormData();
    Array.from(files).forEach(f => formData.append('file', f))

    this.http.post('https://file.io', formData, { reportProgress: true, observe: 'events' })
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.percentDone = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          this.uploadSuccess = true;
        }
      });
  }
  /**<-----(end) upload file functionality  (end)----->*/

  /**<-----(start) saving add field's data of dropdown (start)----->*/
  savestatusofpro() {
    this.statusofpro[0] = this.statusofform.value;
  }
  savepurposepro() {
    this.purposepro[0] = this.purposeForm.value;
  }
  savepropertytype() {
    this.propertytypearray[0] = this.propertytypeform.value;
  }
  saveproownersship() {
    this.proownership[0] = this.proownerform.value;
  }
  saveprolocation() {
    this.proloaction[0] = this.prolocationform.value;
  }
  /**<-----(end) saving add field's data of dropdown (end)----->*/

  /**<-----(start) cheking validations based on formgroup (start)----->*/
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
          this.HomeloanErrorMessage[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;

            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.HomeloanErrorMessage[key] += errormessage + ' ';
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
  /**<-----(end) cheking validations based on formgroup (end)----->*/

  /**<-----(start) Getting addressform data at the time of init loading (start)----->*/
  ngAfterViewInit() {
    if (this.addressFormdata)
      this.addressFormdata.addressForm;
  }
  /**<-----(end) Getting addressform data at the time of init loading (end)----->*/

  Submit() {
    if (this.addressFormdata.addressForm) {
      this.addressFormdata.checkValidations(this.addressFormdata.addressForm, true);
      let isvalid = true;
      if (this.checkValidations(this.HomeloanForm, isvalid)) {
      }
    }
  }

  /**<-----(start) changing country name functionality(after selecting country name) (start)----->*/
  pCountry_Change($event: any): void {

    const countryid = $event.target.value;
    if (countryid && countryid != '') {
      this.getSateDetails(countryid);
      const countryName = $event.target.options[$event.target.selectedIndex].text;
      this.HomeloanForm['controls']['pCountry'].setValue(countryName);
      this.HomeloanForm['controls']['pCountryId'].setValue(countryid);
      //this.branchConfigform.controls['pAddressType'].setValue('')
      //this.HomeloanForm.
  }
    else {
      this.stateDetails = [];
      this.districtDetails = [];

      this.HomeloanForm['controls']['pStateId'].setValue('');
      this.HomeloanForm['controls']['pDistrictId'].setValue('');
      this.HomeloanForm['controls']['pCountry'].setValue('');

    }
  }
  /**<-----(end) changing country name functionality(after selecting country name) (end)----->*/

  /**<-----(start) changing state name functionality(after selecting state name) (start)----->*/
  pState_Change($event: any): void {
    const stateid = $event.target.value;
    if (stateid && stateid != '') {
      const statename = $event.target.options[$event.target.selectedIndex].text;
      this.HomeloanForm['controls']['pState'].setValue(statename);
      this.HomeloanForm['controls']['pStateId'].setValue(stateid);
      this.getDistrictDetails(stateid);

    }
    else {
      this.districtDetails = [];
      this.HomeloanForm['controls']['pState'].setValue('');
    }
  }
  /**<-----(end) changing state name functionality(after selecting state name) (end)----->*/

  /**<-----(start) showing error messages (start)----->*/
  showErrorMessage(errormsg: string) {
    this._commonService.showErrorMessage(errormsg);
  }
  /**<-----(end) showing error messages (end)----->*/

  /**<-----(start) getting country details (start)----->*/
  getCountryDetails(): void {
    this._contacmasterservice.getCountryDetails().subscribe(json => {
      if (json != null) {
        this.countryDetails = json;
      }
    },
      (error) => {
        this.showErrorMessage(error);
      });
  }
  /**<-----(end) getting country details (end)----->*/

  /**<-----(start) getting state details based on country details (start)----->*/
  getSateDetails(countryid) {
    this._contacmasterservice.getSateDetails(countryid).subscribe(json => {
      this.stateDetails = json;
    },
      (error) => {

        this.showErrorMessage(error);
      });
  }
  /**<-----(end) getting state details based on country details (end)----->*/

  /**<-----(start) getting district details based on state details (start)----->*/
  getDistrictDetails(stateid) {
    this._contacmasterservice.getDistrictDetails(stateid).subscribe(json => {
      this.districtDetails = json;
    },
      (error) => {

        this.showErrorMessage(error);
      });
  }
  /**<-----(end) getting district details based on state details (end)----->*/

  /**<-----(start) changing district name functionality(after selecting district name) (start)----->*/
  pDistrict_Change($event: any): void {

    const districtid = $event.target.value;

    if (districtid && districtid != '') {
      const districtname = $event.target.options[$event.target.selectedIndex].text;

      this.HomeloanForm['controls']['pDistrict'].setValue(districtname);
      this.HomeloanForm['controls']['pDistrictId'].setValue(districtid);

    }
    else {

      this.HomeloanForm['controls']['pDistrict'].setValue('');
    }
  }
  /**<-----(end) changing district name functionality(after selecting district name) (end)----->*/

  /**<-----(start) date of booking validations to date of completion and date of occupancy (start)----->*/
  onDateOfBookingChange(event) {
    this.pDateOfLikelyCompletionConfig.minDate = this.HomeloanForm.value.pbookingdate;
    this.pDateOfBookingOccupancyDateConfig.minDate = this.HomeloanForm.value.pcompletiondate ? this.HomeloanForm.value.pcompletiondate : this.HomeloanForm.value.pbookingdate;
    this.HomeloanForm.patchValue({
      pcompletiondate: '',
      poccupancycertificatedate: ''
    })
  }
  /**<-----(end) date of booking validations to date of completion and date of occupancy (end)----->*/

  /**<-----(start) date of onlikely validations to date of occupancy (start)----->*/
  onLikelyDateChange(event) {
    this.pDateOfBookingOccupancyDateConfig.minDate = this.HomeloanForm.value.pcompletiondate ? this.HomeloanForm.value.pcompletiondate : this.HomeloanForm.value.pbookingdate;
    this.HomeloanForm.patchValue({
      poccupancycertificatedate: ''
    })
  }
  /**<-----(end) date of onlikely validations to date of occupancy (end)----->*/

  /**<-----(start) calculations of total propery purchase (start)----->*/
  totalPropertyPurchase() {
    this.HomeloanForm.patchValue({
      ptotalvalueofproperty: 0
    })
    let totalValue = 0;
    totalValue = (this.HomeloanForm.value.ptotalvalueofproperty ? Number((this.HomeloanForm.value.ptotalvalueofproperty.toString()).replace(/,/g, "")) : 0) +
      (this.HomeloanForm.value.psaleagreementvalue ? Number((this.HomeloanForm.value.psaleagreementvalue.toString()).replace(/,/g, "")) : 0) +
      (this.HomeloanForm.value.pstampdutycharges ? Number((this.HomeloanForm.value.pstampdutycharges.toString()).replace(/,/g, "")) : 0) +
      (this.HomeloanForm.value.potheramenitiescharges ? Number((this.HomeloanForm.value.potheramenitiescharges.toString()).replace(/,/g, "")) : 0) +
      (this.HomeloanForm.value.potherincidentalexpenditure ? Number((this.HomeloanForm.value.potherincidentalexpenditure.toString()).replace(/,/g, "")) : 0)

    this.HomeloanForm.patchValue({
      ptotalvalueofproperty: totalValue ? this._commonService.currencyformat(totalValue) : 0
    })
  }
  /**<-----(end) calculations of total propery purchase (end)----->*/

}
