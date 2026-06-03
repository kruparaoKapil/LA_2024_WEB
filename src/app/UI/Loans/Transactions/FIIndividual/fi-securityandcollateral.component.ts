import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { PropertyDetailsComponent } from 'src/app/UI/Common/property-details/property-details.component';
import { MovablePropertyDetailsComponent } from 'src/app/UI/Common/movable-property-details/movable-property-details.component';
import { FIIndividualService } from 'src/app/Services/Loans/Transactions/fiindividual.service';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';


declare let $: any
@Component({
  selector: 'app-fi-securityandcollateral',
  templateUrl: './fi-securityandcollateral.component.html',
  styles: []
})
export class FiSecurityandcollateralComponent implements OnInit {

  @ViewChild(PropertyDetailsComponent, { static: false }) propertyDetailsComponent: PropertyDetailsComponent;
  @ViewChild(MovablePropertyDetailsComponent, { static: false }) movablePropertyDetailsComponent: MovablePropertyDetailsComponent;

  @Output() securityColletralPropertyDetails = new EventEmitter();
  @Output() securityColletralmovablePropertyDetails = new EventEmitter();
  @Output() forGettingAndEditingExistingUsersEmit = new EventEmitter();
  @Output() forLoanSpecificData = new EventEmitter();
  @Output() forGettingPersonalDetailsDataEmit = new EventEmitter();

  @Input() forClearButton: boolean;
  _FirstInformationTabsData: any = [];
  @Input()
  set FirstInformationTabsData(FirstInformationTabsData: any) {
    this._FirstInformationTabsData = FirstInformationTabsData;
  }


  applicantReferenceId = null;
  applicantContactId = null;
  securityApplicantId = null;

  bsValue = new Date();


  pContactId: any;
  pContactreferenceId: any;
  pStatusName: any;
  securityConfigErrorMessage: any;
  //<-----File Response----->
  propertyDetailFileResponse: any;
  movablePropertyFileResponse: any;
  depositsAsLienFileResponse: any;
  securityChequeFileResponse: any;
  anyOtherPropertyFileResponse: any
  selectedFiles: any;
  selectedApplicantData: any;
  //<-----Upload file name and path----> 
  propertyDetailFileName: any;
  propertyDetailFilePath: any;
  movablePropertyDetailFileName: any;
  movablePropertyDetailFilePath: any;
  depositAsLienFileName: any;
  depositAsLienFilePath: any;
  securityChequeFileName: any;
  securityChequeFilePath: any;
  anyOtherFileName: any;
  anyOtherFilePath: any;
  pVchapplicationid: any;
  getSecurityCollateralData: any;
  dropdoenTabname: string;

  //<-------Form Name------->
  propertyDetailForm: FormGroup;
  movablePropertyDetailsForm: FormGroup;
  securityChequesForm: FormGroup;
  depositsAsLienForm: FormGroup;
  anyOtherPropertyForm: FormGroup;
  formatDateType = 'dd/MM/yyyy';
  today: Date = new Date();



  tempData1 = [];
  tempData2 = [];
  propertyDetailFormData = [];
  movablePropertyDetailFormData = [];
  securityChequesFormData = [];
  depositsAsLienFormData = [];
  anyOtherPropertyFormData = []
  lstApplicantsandothers = [];
  public propertyGridData: any[] = [];
  public movablePropertyGridData: any[] = [];
  public securityChequesGridData: any[] = [];
  public depositAsLienGridData: any[] = [];
  public anyOtherPropertyGridData: any[] = [];

  loading: boolean = false;
  //<------Final data submit on next button------>
  notApplicableForAll: boolean = true;
  showPropertyDetails = true;
  showMovablePropertyDetails = true;
  showPdcChequesDetails = true;
  showDeposits = true;
  showOtherPropertyDetails = true;
  submittedPropertyDetails = false;
  submittedMovablepropertyDetails = false;
  submittedSecurityCheque = false;
  submittedDepositAsLien = false;
  submittedAnyOtherProperty = false;
  //<------Security and Collateral individual flag----->
  notApplicableForPropertyLoan: boolean = true;
  pIsimmovablepropertyapplicable = false;
  pismovablepropertyapplicable = false;
  pissecuritychequesapplicable = false;
  pisdepositslienapplicable = false;
  pissecuritylienapplicable = false;
  public isLoading: boolean = false;

  buttonName = "Save & Continue";
  /**(start) Datepicker functionality bsconfig (start) */
  public pdateofestablishmentConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public pMaturityDate: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  /**(end) Datepicker functionality bsconfig (end) */
  permissionData: any = [];
  constructor(private commomService: CommonService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private http: HttpClient,
    private fiIndividualService: FIIndividualService, private router: Router,
    private _route: ActivatedRoute) {
    /**(start) Datepicker functionality bsconfig (start) */
    this.pdateofestablishmentConfig.containerClass = 'theme-dark-blue';
    this.pdateofestablishmentConfig.showWeekNumbers = false;
    this.pdateofestablishmentConfig.maxDate = new Date();
    this.pdateofestablishmentConfig.dateInputFormat = 'DD/MM/YYYY';

    this.pMaturityDate.containerClass = 'theme-dark-blue';
    this.pMaturityDate.showWeekNumbers = false;
    this.pMaturityDate.minDate = new Date();
    this.pMaturityDate.dateInputFormat = 'DD/MM/YYYY';
    /**(end) Datepicker functionality bsconfig (end) */
  }
  ngOnChanges(): void {
    var isPresent = this._FirstInformationTabsData.some(function (el) { return el.pTabsectionname === "Security Collateral" });
    if (isPresent == true) {
      const example = this._FirstInformationTabsData.filter(data => data.pTabsectionname === "Security Collateral");
      this.permissionData = example[0].lstFITabSubsection;
    }
  }
  ngOnInit() {
    this.notApplicableAll(this.notApplicableForAll);
    this.commomService._GetFiTab1Data().subscribe(res => {
      if (this.lstApplicantsandothers && this.lstApplicantsandothers.length > 0) {
        for (let i = 0; i < this.lstApplicantsandothers.length; i++) {
          if (this.lstApplicantsandothers[i].papplicanttype == 'Applicant') {
            this.onChangeSecurityCheques(i);
            break;
          }
        }
      }
      if (res != null && res != undefined && res != "") {
        this.pVchapplicationid = (res.pVchapplicationid);
        this.pContactId = res.pApplicantid;
        this.pContactreferenceId = res.pContactreferenceid;
        this.pStatusName = res.pStatusname;
        if (res.pLoantype == 'Loan Against Deposits' && (res.pLoanname == 'Fd Loan' || res.pLoanname == 'Rd Loan')) {
          this.fiIndividualService.GetFITabFdRdEditDepositsasLien(res.pVchapplicationid, res.pLoanname).subscribe((resposne: any) => {
            console.log('resposne', resposne);
            if (resposne.length > 0) {
              let FilterFdRdTabDetails: any = resposne.filter(function (data) {
                return data.pstatus == true;
              });
              if (this._route.snapshot.params['id']) {
                this.showDeposits = true;
                this.submittedDepositAsLien = true;
                this.pisdepositslienapplicable = true;
              } else {
                this.showDeposits = false;
                this.submittedDepositAsLien = false;
                this.pisdepositslienapplicable = false;
              }
              FilterFdRdTabDetails.forEach((item) => {
                item.pDepositdate = item.pDepositdate.split("/").reverse().join("-");
                item.pMaturitydate = item.pMaturitydate.split("/").reverse().join("-");
              });

              this.depositAsLienGridData = FilterFdRdTabDetails;
            }
            else {
              this.showDeposits = false;
              this.submittedDepositAsLien = false;
              this.pisdepositslienapplicable = false;
            }
          });
        }
      }
    })
    this.securityConfigErrorMessage = {};
    this.securityChequesForm = this.formBuilder.group({
      createdby: 1,
      modifiedby: [0],
      pIsapplicable: true,
      pStatusid: "",
      pRecordid: [0],
      pContactid: [0],
      pApplicanttype: [''],
      pContactreferenceid: [''],
      pTypeofsecurity: [''],
      pBankname: [''],
      pIfsccode: [''],
      pAccountno: [''],
      pChequeno: ['', Validators.maxLength(10)],
      pSecuritychequesdocpath: [''],
      pSecuritychequesdocpathname: [''],
      pCreatedby: [this.commomService.pCreatedby],
      pModifiedby: [0],
      pCreateddate: [this.today],
      pModifieddate: [''],
      pStatusname: ['ACTIVE'],
      pEffectfromdate: "",
      pEffecttodate: "",
      ptypeofoperation: ['CREATE']
    })

    this.depositsAsLienForm = this.formBuilder.group({
      createdby: 1,
      modifiedby: [0],
      pIsapplicable: true,
      pRecordid: [0],
      pContactid: [0],
      pApplicanttype: [''],
      pContactreferenceid: [''],
      pDepositin: ['External'],
      pTypeofdeposit: [''],
      pDepositorbank: [''],
      pDepositaccountno: [''],
      pDepositamount: [''],
      pRateofinterest: [''],
      pDepositdate: [new Date()],
      pTenureofdeposit: [''],
      pDeposittenuretype: ['Days'],
      pMaturitydate: [new Date()],
      pDepositdocpath: [''],
      pDepositdocpathname: [''],
      pCreatedby: [this.commomService.pCreatedby],
      pModifiedby: [0],
      pCreateddate: [this.today],
      pModifieddate: [''],
      pStatusname: ['ACTIVE'],
      pEffectfromdate: "",
      pEffecttodate: "",
      ptypeofoperation: ['CREATE']
    })

    this.anyOtherPropertyForm = this.formBuilder.group({
      createdby: 1,
      modifiedby: [0],
      pIsapplicable: true,
      pRecordid: [0],
      pContactid: [0],
      pContactreferenceid: [''],
      pNameofthesecurity: [''],
      pEstimatedvalue: [''],
      pSecuritydocpath: [''],
      pSecuritydocpathname: [''],
      pCreatedby: [this.commomService.pCreatedby],
      pModifiedby: [0],
      pCreateddate: [this.today],
      pModifieddate: [''],
      pStatusname: ['ACTIVE'],
      pEffectfromdate: "",
      pEffecttodate: "",
      pStatusid: "",
      ptypeofoperation: ['CREATE']
    })
    this.BlurEventAllControll(this.securityChequesForm);
    this.BlurEventAllControll(this.depositsAsLienForm);
    this.BlurEventAllControll(this.anyOtherPropertyForm);
    this.BlurEventAllControll(this.propertyDetailForm);
    this.BlurEventAllControll(this.movablePropertyDetailsForm);
  }
  /**(start) -----upload file functionality------ (start) */
  uploadAndProgressFiles(event, files, type) {
    let file = event.target.files[0];
    if (event && file) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = e => {
        if (type == 'depositsAsLien') {
          this.depositsAsLienFileResponse = {
            name: file.name,
            fileType: "depositsAsLienFileResponse",
            contentType: file.type,
            size: file.size,
          };
        } else if (type == 'anyOtherProperty') {
          this.anyOtherPropertyFileResponse = {
            name: file.name,
            fileType: "anyOtherPropertyFileResponse",
            contentType: file.type,
            size: file.size,
          };
        } else if (type == 'securityCheque') {
          this.securityChequeFileResponse = {
            name: file.name,
            fileType: "securityChequeFileResponse",
            contentType: file.type,
            size: file.size,
          };
        }
      };
    }
    let fname = "";
    if (files.length === 0) {
      return;
    }
    var size = 0;
    const formData = new FormData();
    for (var i = 0; i < files.length; i++) {
      size += files[i].size;
      fname = files[i].name;
      formData.append(files[i].name, files[i]);
      if (type == 'depositsAsLien') {
        formData.append('NewFileName', this.depositsAsLienForm.value["pDepositin"] + '.' + files[i]["name"].split('.').pop());
      } else if (type == 'anyOtherProperty') {
        formData.append('NewFileName', this.anyOtherPropertyForm.value["pNameofthesecurity"] + '.' + files[i]["name"].split('.').pop());
      } else if (type == 'securityCheque') {
        formData.append('NewFileName', this.securityChequesForm.value["pBankname"] + '.' + files[i]["name"].split('.').pop());
      }
    }
    size = size / 1024;
    if (type == 'depositsAsLien') {
      this.commomService.fileUpload(formData).subscribe(data => {
        this.depositAsLienFileName = data[1];
        this.depositAsLienFilePath = data[0];
      });
    } else if (type == 'anyOtherProperty') {
      this.commomService.fileUpload(formData).subscribe(data => {
        this.anyOtherFileName = data[1];
        this.anyOtherFilePath = data[0];
      });
    } else if (type == 'securityCheque') {
      this.commomService.fileUpload(formData).subscribe(data => {

        this.securityChequeFileName = data[1];
        this.securityChequeFilePath = data[0];
      });
    }
  }
  /**(end) -----upload file functionality------ (end) */

  /**(start) -----Add security cheques data to grid ------ (start) */
  addSecurityCheques() {
    let isvalid = true;
    let addFlag: boolean = false;
    if (this.securityChequesForm.value.pBankname ||
      this.securityChequesForm.value.pIfsccode ||
      this.securityChequesForm.value.pAccountno ||
      this.securityChequesForm.value.pChequeno) {
      addFlag = true;
    }
    else {
      addFlag = false;
      if ($('#fileSecurityCheque').val()) {
        $('#fileSecurityCheque').val(null);
        this.securityChequeFileResponse.name = '';
        this.securityChequeFileName = '';
        this.securityChequeFilePath = '';
      }
    }
    if (addFlag) {
      // if (this.checkValidations(this.securityChequesForm, isvalid)) {
      this.securityChequesFormData.push(this.securityChequesForm.getRawValue());
      let mpd = this.securityChequesForm.value;
      for (let i = 0; i < this.lstApplicantsandothers.length; i++) {
        if (this.lstApplicantsandothers[i].papplicanttype == 'Applicant') {
          this.applicantContactId = this.lstApplicantsandothers[i].pcontactid;
          this.applicantReferenceId = this.lstApplicantsandothers[i].pcontactreferenceid;
        }
      }

      let addSecurityChequesDatatoGrid = {
        "pApplicanttype": this.selectedApplicantData.pApplicantype,
        "pApplicantname": this.selectedApplicantData.pApplicantname,
        "pContactid": this.selectedApplicantData.pcontactid
      };
      this.securityChequesForm.controls.pTypeofsecurity.setValue('Security Cheque');
      this.securityChequesForm.controls.pBankname.setValue(this.securityChequesForm.value["pBankname"]);
      this.securityChequesForm.controls.pIfsccode.setValue(this.securityChequesForm.value["pIfsccode"]);
      this.securityChequesForm.controls.pAccountno.setValue(this.securityChequesForm.value["pAccountno"]);
      this.securityChequesForm.controls.pChequeno.setValue(this.securityChequesForm.value["pChequeno"]);
      this.securityChequesForm.controls.pSecuritychequesdocpathname.setValue(this.securityChequeFileName);
      this.securityChequesForm.controls.pSecuritychequesdocpath.setValue(this.securityChequeFilePath);
      if (this.securityApplicantId)
        this.securityChequesForm.controls.pContactreferenceid.setValue(this.securityApplicantId);
      this.securityChequesGridData.push(Object.assign(this.securityChequesForm.value, addSecurityChequesDatatoGrid));
      if (this.securityChequesGridData && this.securityChequesGridData.length > 0) {
        for (let i = 0; i < this.securityChequesGridData.length; i++) {
          let index = this.lstApplicantsandothers.findIndex(item => item.pcontactreferenceid == this.securityChequesGridData[i].pContactreferenceid);
          this.lstApplicantsandothers[index].status = true;
        }
      }
      else {
        for (let i = 0; i < this.lstApplicantsandothers.length; i++) {
          if (this.lstApplicantsandothers[i].pcontactreferenceid == this.selectedApplicantData.pContactreferenceid) {
            this.lstApplicantsandothers[i].status = true;
            break;
          }
        }
      }
      this.submittedSecurityCheque = true;
      this.securityChequeFileName = '';
      this.securityChequeFilePath = '';
      if ($('#fileSecurityCheque').val()) {
        $('#fileSecurityCheque').val(null);
        this.securityChequeFileResponse.name = '';
      }
      this.securityChequesForm = this.formBuilder.group({
        createdby: 1,
        modifiedby: [0],
        pIsapplicable: true,
        pRecordid: [0],
        pContactid: [0],
        pApplicanttype: [''],
        pContactreferenceid: [''],
        pTypeofsecurity: [''],
        pBankname: [''],
        pIfsccode: [''],
        pAccountno: [''],
        pChequeno: ['', Validators.maxLength(10)],
        pSecuritychequesdocpath: [''],
        pSecuritychequesdocpathname: [''],
        pCreatedby: [this.commomService.pCreatedby],
        pModifiedby: [0],
        pCreateddate: [this.today],
        pModifieddate: [''],
        pStatusname: ['ACTIVE'],
        pEffectfromdate: "",
        pEffecttodate: "",
        ptypeofoperation: ['CREATE']

      })
      this.BlurEventAllControll(this.securityChequesForm)

      // }
    }
  }
  /**(end) -----Add security cheques data to grid ------ (end) */

  /**(start) -----Add deposit as lien data to grid ------ (start) */
  addDepositsasLien() {
    let isvalid = true;

    let addFlag: boolean = false;
    if (this.depositsAsLienForm.value.pDepositin ||
      this.depositsAsLienForm.value.pTypeofdeposit ||
      this.depositsAsLienForm.value.pDepositorbank ||
      this.depositsAsLienForm.value.pDepositaccountno ||
      this.depositsAsLienForm.value.pDepositamount ||
      this.depositsAsLienForm.value.pRateofinterest ||
      this.depositsAsLienForm.value.pTenureofdeposit) {
      addFlag = true
    }
    else {
      addFlag = false;
      if ($('#fileDepositsAsLien').val()) {
        $('#fileDepositsAsLien').val(null);
        this.depositsAsLienFileResponse.name = '';
        this.depositAsLienFileName = '';
        this.depositAsLienFilePath = '';
      }
    }
    if (addFlag) {
      // if (this.checkValidations(this.depositsAsLienForm, isvalid)) {
      this.depositsAsLienFormData.push(this.depositsAsLienForm.getRawValue());
      let dal = this.depositsAsLienForm.value;
      for (let i = 0; i < this.lstApplicantsandothers.length; i++) {
        if (this.lstApplicantsandothers[i].papplicanttype == 'Applicant') {
          this.applicantContactId = this.lstApplicantsandothers[i].pcontactid;
          this.applicantReferenceId = this.lstApplicantsandothers[i].pcontactreferenceid;
        }
      }
      //console.log('this.depositsAsLienForm.value["pDepositaccountno"] : ',this.depositsAsLienForm.value["pDepositaccountno"]);

      this.depositsAsLienForm.controls.pDepositin.setValue(this.depositsAsLienForm.value["pDepositin"]);
      this.depositsAsLienForm.controls.pTypeofdeposit.setValue(this.depositsAsLienForm.value["pTypeofdeposit"]);
      this.depositsAsLienForm.controls.pDepositorbank.setValue(this.depositsAsLienForm.value["pDepositorbank"]);
      this.depositsAsLienForm.controls.pDepositaccountno.setValue(this.depositsAsLienForm.value["pDepositaccountno"]);
      this.depositsAsLienForm.controls.pDepositamount.setValue(this.depositsAsLienForm.value["pDepositamount"] ? this.commomService.currencyformat(this.depositsAsLienForm.value["pDepositamount"]) : 0);
      this.depositsAsLienForm.controls.pRateofinterest.setValue(Number(this.depositsAsLienForm.value["pRateofinterest"]));
      this.depositsAsLienForm.controls.pTenureofdeposit.setValue(this.depositsAsLienForm.value["pTenureofdeposit"] ? this.commomService.currencyformat(this.depositsAsLienForm.value["pTenureofdeposit"]) : 0);
      this.depositsAsLienForm.controls.pDeposittenuretype.setValue(this.depositsAsLienForm.value["pDeposittenuretype"]);
      this.depositsAsLienForm.controls.pDepositdate.setValue(this.depositsAsLienForm.value["pDepositdate"], this.formatDateType);
      this.depositsAsLienForm.controls.pMaturitydate.setValue(this.depositsAsLienForm.value["pMaturitydate"], this.formatDateType);
      this.depositsAsLienForm.controls.pDepositdocpathname.setValue(this.depositAsLienFileName);
      this.depositsAsLienForm.controls.pDepositdocpath.setValue(this.depositAsLienFilePath);
      this.depositsAsLienForm.controls.pContactreferenceid.setValue(this.applicantReferenceId);
      this.depositsAsLienForm.controls.pContactid.setValue(this.applicantContactId);
      this.depositAsLienGridData.push(this.depositsAsLienForm.value);
      //console.log("this.depositAsLienGridData",this.depositAsLienGridData);

      this.depositAsLienFileName = '';
      this.depositAsLienFilePath = '';
      if ($('#fileDepositsAsLien').val()) {
        $('#fileDepositsAsLien').val(null);
        this.depositsAsLienFileResponse.name = '';
      }
      this.depositsAsLienForm = this.formBuilder.group({
        createdby: 1,
        modifiedby: [0],
        pIsapplicable: true,
        pRecordid: [0],
        pContactid: [0],
        pApplicanttype: [''],
        pContactreferenceid: [''],
        pDepositin: ['External'],
        // pTypeofdeposit: ['', Validators.required],
        // pDepositorbank: ['', Validators.required],
        // pDepositaccountno: ['', Validators.required],
        pTypeofdeposit: [''],
        pDepositorbank: [''],
        pDepositaccountno: [''],
        pDepositamount: [''],
        pRateofinterest: [''],
        pDepositdate: [new Date()],
        pTenureofdeposit: [''],
        pDeposittenuretype: ['Days'],
        pMaturitydate: [new Date()],
        pDepositdocpath: [''],
        pDepositdocpathname: [''],
        pCreatedby: [this.commomService.pCreatedby],
        pModifiedby: [0],
        pCreateddate: [this.today],
        pModifieddate: [''],
        pStatusname: ['ACTIVE'],
        pEffectfromdate: "",
        pEffecttodate: "",
        ptypeofoperation: ['CREATE']
      })
      this.BlurEventAllControll(this.depositsAsLienForm)
      // }
    }
  }
  /**(end) -----Add deposit as lien data to grid ------ (end) */

  /**(start) -----Add Other Property Details to grid ------ (start) */
  addAnyOthersPropertyDetail() {
    let isvalid = true;
    let addFlag: boolean = false;
    if (this.anyOtherPropertyForm.value.pNameofthesecurity ||
      this.anyOtherPropertyForm.value.pEstimatedvalue) {
      addFlag = true;
    }
    else {
      addFlag = false;
      if ($('#fileAnyOtherProperty').val()) {
        $('#fileAnyOtherProperty').val(null);
        this.anyOtherPropertyFileResponse.name = '';
        this.depositsAsLienForm.controls.pDepositdocpathname.setValue('');
        this.anyOtherFileName = '';
        this.anyOtherFilePath = '';
      }
    }
    if (addFlag) {
      // if (this.checkValidations(this.anyOtherPropertyForm, isvalid)) {
      this.anyOtherPropertyFormData.push(this.anyOtherPropertyForm.getRawValue());
      let aop = this.anyOtherPropertyForm.value;
      for (let i = 0; i < this.lstApplicantsandothers.length; i++) {
        if (this.lstApplicantsandothers[i].papplicanttype == 'Applicant') {
          this.applicantContactId = this.lstApplicantsandothers[i].pcontactid;
          this.applicantReferenceId = this.lstApplicantsandothers[i].pcontactreferenceid;
        }
      }
      this.anyOtherPropertyForm.controls.pNameofthesecurity.setValue(this.anyOtherPropertyForm.value["pNameofthesecurity"]);
      this.anyOtherPropertyForm.controls.pEstimatedvalue.setValue(this.anyOtherPropertyForm.value["pEstimatedvalue"] ? this.commomService.currencyformat(this.anyOtherPropertyForm.value["pEstimatedvalue"]) : 0);
      this.anyOtherPropertyForm.controls.pSecuritydocpathname.setValue(this.anyOtherFileName);
      this.anyOtherPropertyForm.controls.pSecuritydocpath.setValue(this.anyOtherFilePath);
      this.anyOtherPropertyForm.controls.pContactreferenceid.setValue(this.applicantReferenceId);
      this.anyOtherPropertyForm.controls.pContactid.setValue(this.applicantContactId);
      this.anyOtherPropertyGridData.push(this.anyOtherPropertyForm.value);
      this.submittedAnyOtherProperty = true;
      this.anyOtherFileName = '';
      this.anyOtherFilePath = '';
      if ($('#fileAnyOtherProperty').val()) {
        $('#fileAnyOtherProperty').val(null);
        this.anyOtherPropertyFileResponse.name = '';
      }
      this.anyOtherPropertyForm = this.formBuilder.group({
        createdby: 1,
        modifiedby: [0],
        pIsapplicable: true,
        pRecordid: [0],
        pContactid: [0],
        pContactreferenceid: [''],
        pNameofthesecurity: [''],
        pEstimatedvalue: [''],
        pSecuritydocpath: [''],
        pSecuritydocpathname: [''],
        pCreatedby: [this.commomService.pCreatedby],
        pModifiedby: [0],
        pCreateddate: [this.today],
        pModifieddate: [''],
        pStatusname: ['ACTIVE'],
        pEffectfromdate: "",
        pEffecttodate: "",
        pStatusid: "",
        ptypeofoperation: ['CREATE']
      })
      this.BlurEventAllControll(this.anyOtherPropertyForm);
    }
    // }
  }
  /**(end) -----Add Other Property Details to grid ------ (end) */

  /**(start) -----Remove one record in grid based on grid type ------ (start) */
  removeHandler(event, type) {
    if (type == 'securytyCheque') {
      let count = 0;
      if (this.securityChequesGridData && this.securityChequesGridData.length > 0) {
        for (let i = 0; i < this.securityChequesGridData.length; i++) {
          if (this.securityChequesGridData[event.rowIndex].pContactreferenceid == this.securityChequesGridData[i].pContactreferenceid) {
            count++;
          }
        }
        if (count == 1) {
          let index = this.lstApplicantsandothers.findIndex(item => item.pcontactreferenceid == this.securityChequesGridData[event.rowIndex].pContactreferenceid);
          this.lstApplicantsandothers[index].status = false;
        }
      }
      else {
        for (let i = 0; i < this.lstApplicantsandothers.length; i++) {
          this.lstApplicantsandothers[i].status = false;
        }
      }
      this.securityChequesGridData.splice(event.rowIndex, 1);
    }
    else if (type == 'depositAsLien') {
      this.depositAsLienGridData.splice(event.rowIndex, 1);
    }
    else if (type == 'anyOtherProperty') {
      this.anyOtherPropertyGridData.splice(event.rowIndex, 1);
    }

  }
  /**(end) -----Remove one record in grid based on grid type ------ (end) */

  /**(start) -----Radio button changing functionality in securitycheques form ------ (start) */
  onChangeSecurityCheques(index) {
    let applicantObj = this.lstApplicantsandothers[index];
    this.securityApplicantId = applicantObj.pcontactreferenceid;
    this.selectedApplicantData = {
      pcontactid: applicantObj.pcontactid,
      pApplicantname: applicantObj.papplicantname,
      pApplicantype: applicantObj.papplicanttype,
      pContactreferenceid: applicantObj.pcontactreferenceid,
      existedlstKYCDcumentsDetailsDTO: '',
    }
  }
  /**(end) -----Radio button changing functionality in securitycheques form ------ (end) */

  /**(start) -----checking validations based on formGroup ------ (start) */
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
          this.securityConfigErrorMessage[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this.commomService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.securityConfigErrorMessage[key] += errormessage + ' ';
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
  /**(end) -----checking validations based on formGroup ------ (end) */

  /**(start) -----not applicable all functionality ------ (start) */
  notApplicableAll(event) {
    let checked;
    if (event == true || event == false) {
      checked = event;
    }
    else {
      checked = event.target.checked;
    }
    if (checked == true) {

      this.showPropertyDetails = true;
      this.showMovablePropertyDetails = true;
      this.showPdcChequesDetails = true;
      this.showDeposits = true;
      this.showOtherPropertyDetails = true;

      this.pIsimmovablepropertyapplicable = false;
      this.pismovablepropertyapplicable = false;
      this.pissecuritychequesapplicable = false;
      this.pisdepositslienapplicable = false;
      this.pissecuritylienapplicable = false;


    }
    else {
      this.showPropertyDetails = false;
      this.showMovablePropertyDetails = false;
      this.showPdcChequesDetails = false;
      this.showDeposits = false;
      this.showOtherPropertyDetails = false;

      this.pIsimmovablepropertyapplicable = true;
      this.pismovablepropertyapplicable = true;
      this.pissecuritychequesapplicable = true;
      this.pisdepositslienapplicable = true;
      this.pissecuritylienapplicable = true;
    }
    this.securityConfigErrorMessage = {}
  }
  /**(end) -----not applicable all functionality ------ (end) */

  /**(start) -----Individual not applicable functionality based on form type ------ (start) */
  notApplicable(event, type) {

    let checked;
    if (event == true || event == false) {
      checked = event;
    }
    else {
      checked = event.target.checked;
    }
    if (type == 'propertyDetail') {
      if (checked == true) {
        this.showPropertyDetails = true;
        this.submittedPropertyDetails = false;
        this.pIsimmovablepropertyapplicable = false;
      }
      else {
        this.submittedPropertyDetails = true;
        this.showPropertyDetails = false;
        this.pIsimmovablepropertyapplicable = true;
      }
    }
    else if (type == 'movablePropertyDetail') {
      if (checked == true) {
        this.showMovablePropertyDetails = true;
        this.submittedMovablepropertyDetails = false;
        this.pismovablepropertyapplicable = false;
      }
      else {
        this.submittedMovablepropertyDetails = true;
        this.showMovablePropertyDetails = false;
        this.pismovablepropertyapplicable = true;
      }
    }
    else if (type == 'securityCheque') {
      if (checked == true) {
        this.showPdcChequesDetails = true;
        this.submittedSecurityCheque = false;
        this.pissecuritychequesapplicable = false;
      }
      else {
        this.submittedSecurityCheque = true;
        this.showPdcChequesDetails = false;
        this.pissecuritychequesapplicable = true;
      }
    }
    else if (type == 'depositsAsLien') {
      if (checked == true) {
        this.showDeposits = true;
        this.submittedDepositAsLien = false;
        this.pisdepositslienapplicable = false;
      }
      else {
        this.showDeposits = false;
        this.submittedDepositAsLien = true;
        this.pisdepositslienapplicable = true;
      }
    }
    else if (type == 'anyOtherProperty') {
      if (checked == true) {
        this.showOtherPropertyDetails = true;
        this.submittedAnyOtherProperty = false;
        this.pissecuritylienapplicable = false;
      }
      else {
        this.submittedAnyOtherProperty = true;
        this.showOtherPropertyDetails = false;
        this.pissecuritylienapplicable = true;
      }
    }
    this.disableSecurityAndColletral();
  }
  /**(end) -----Individual not applicable functionality based on form type ------ (end) */

  showErrorMessage(errormsg: string) {
    this.commomService.showErrorMessage(errormsg);
  }

  showInfoMessage(errormsg: string) {
    this.commomService.showInfoMessage(errormsg);
  }

  /**(start) -----saving data to api ------ (start) */
  saveSecurityAndCollateral() {
    debugger
    let saveFlag: boolean = false;
    debugger;
    let securityAndCollateralDetails = {
      pApplicationid: 0,
      pVchapplicationid: this.pVchapplicationid,
      pissecurityandcolletralapplicable: !this.notApplicableForAll,
      pContactid: this.pContactId,
      pContactreferenceid: this.pContactreferenceId,
      pStatusname: this.pStatusName,
      pCreatedby: this.commomService.pCreatedby,
      imMovablePropertyDetailsList: [],
      movablePropertyDetailsList: [],
      securitychequesList: [],
      depositsasLienList: [],
      otherPropertyorsecurityDetailsList: []
    };

    let securityAndCollateralIndividualFlag = {
      pIsimmovablepropertyapplicable: !this.showPropertyDetails,
      pismovablepropertyapplicable: !this.showMovablePropertyDetails,
      pissecuritychequesapplicable: !this.showPdcChequesDetails,
      pisdepositslienapplicable: !this.showDeposits,
      pissecuritylienapplicable: !this.showOtherPropertyDetails
    }
    if (this.notApplicableForAll) {
      saveFlag = true;
    }
    else {
      let propertyFlag: boolean = false;
      let movableFlag: boolean = false;
      let securityChequeFlag: boolean = false;
      let depositeFlag: boolean = false;
      let otherProprtyFlag: boolean = false;
      if (!this.showPropertyDetails) {
        if (this.propertyDetailsComponent.propertyGridData && this.propertyDetailsComponent.propertyGridData.length > 0) {
          propertyFlag = true;
        }
        else {
          propertyFlag = false;
        }
      }
      else {
        propertyFlag = true;
      }
      if (!this.showMovablePropertyDetails) {
        if (this.movablePropertyDetailsComponent.movablePropertyGridData && this.movablePropertyDetailsComponent.movablePropertyGridData.length > 0) {
          movableFlag = true;
        }
        else {
          movableFlag = false;
        }
      }
      else {
        movableFlag = true;
      }
      if (!this.showPdcChequesDetails) {
        if (this.securityChequesGridData && this.securityChequesGridData.length > 0) {
          securityChequeFlag = true;
        }
        else {
          securityChequeFlag = false;
        }
      }
      else {
        securityChequeFlag = true;
      }
      if (!this.showDeposits) {
        if (this.depositsAsLienFormData && this.depositsAsLienFormData.length > 0) {
          depositeFlag = true;
        }
        else {
          depositeFlag = false;
        }
      }
      else {
        depositeFlag = true;
      }
      if (!this.showOtherPropertyDetails) {
        if (this.anyOtherPropertyGridData && this.anyOtherPropertyGridData.length > 0) {
          otherProprtyFlag = true;
        }
        else {
          otherProprtyFlag = false;
        }
      }
      else {
        otherProprtyFlag = true;
      }

      // if(propertyFlag && movableFlag && securityChequeFlag && depositeFlag && otherProprtyFlag) {
      saveFlag = true;

      let proprtyArr = JSON.parse(JSON.stringify(this.propertyDetailsComponent.propertyGridData));

      let depositeArr = JSON.parse(JSON.stringify(this.depositAsLienGridData));
      if (proprtyArr && proprtyArr.length != 0) {
        this.submittedPropertyDetails = true;

      }
      if (this.movablePropertyDetailsComponent.movablePropertyGridData && this.movablePropertyDetailsComponent.movablePropertyGridData.length != 0) {
        this.submittedMovablepropertyDetails = true;
      }
      if (proprtyArr && proprtyArr.length > 0) {
        for (let i = 0; i < proprtyArr.length; i++) {
          proprtyArr[i].pCreatedby = this.commomService.pCreatedby,
            proprtyArr[i].pEstimatedmarketvalue = proprtyArr[i].pEstimatedmarketvalue ? Number((proprtyArr[i].pEstimatedmarketvalue.toString()).replace(/,/g, "")) : 0;
        }
      }
      if (this.anyOtherPropertyGridData && this.anyOtherPropertyGridData.length > 0) {
        for (let k = 0; k < this.anyOtherPropertyGridData.length; k++) {
          this.anyOtherPropertyGridData[k].pCreatedby = this.commomService.pCreatedby,
            this.anyOtherPropertyGridData[k].pEstimatedvalue = this.anyOtherPropertyGridData[k].pEstimatedvalue ? Number((this.anyOtherPropertyGridData[k].pEstimatedvalue.toString()).replace(/,/g, "")) : 0;
        }
      }
      if (depositeArr && depositeArr.length > 0) {
        for (let i = 0; i < depositeArr.length; i++) {
          depositeArr[i].pCreatedby = this.commomService.pCreatedby,
            depositeArr[i].pTenureofdeposit = depositeArr[i].pTenureofdeposit ? Number((depositeArr[i].pTenureofdeposit.toString()).replace(/,/g, "")) : 0;
          depositeArr[i].pDepositamount = depositeArr[i].pDepositamount ? Number((depositeArr[i].pDepositamount.toString()).replace(/,/g, "")) : 0;
        }
      }
      if (this.movablePropertyDetailsComponent.movablePropertyGridData && this.movablePropertyDetailsComponent.movablePropertyGridData.length > 0) {
        for (let i = 0; i < this.movablePropertyDetailsComponent.movablePropertyGridData.length; i++) {
          this.movablePropertyDetailsComponent.movablePropertyGridData[i].pCreatedby = this.commomService.pCreatedby,
            this.movablePropertyDetailsComponent.movablePropertyGridData[i].pEstimatedmarketvalue = this.movablePropertyDetailsComponent.movablePropertyGridData[i].pEstimatedmarketvalue ? Number((this.movablePropertyDetailsComponent.movablePropertyGridData[i].pEstimatedmarketvalue.toString()).replace(/,/g, "")) : 0;

        }
      }
      if (this.securityChequesGridData && this.securityChequesGridData.length > 0) {
        for (let i = 0; i < this.securityChequesGridData.length; i++) {
          this.securityChequesGridData[i].pCreatedby = this.commomService.pCreatedby

        }
      }
      securityAndCollateralDetails.imMovablePropertyDetailsList = proprtyArr ? proprtyArr : [];
      securityAndCollateralDetails.movablePropertyDetailsList = this.movablePropertyDetailsComponent.movablePropertyGridData ? this.movablePropertyDetailsComponent.movablePropertyGridData : [];
      securityAndCollateralDetails.securitychequesList = this.securityChequesGridData ? this.securityChequesGridData : [];
      securityAndCollateralDetails.depositsasLienList = depositeArr ? depositeArr : [];
      securityAndCollateralDetails.otherPropertyorsecurityDetailsList = this.anyOtherPropertyGridData ? this.anyOtherPropertyGridData : [];

      // }
      // else {
      //   //console.log("propertyFlag : ",propertyFlag);
      //   //console.log("movableFlag : ",movableFlag);
      //   //console.log("securityChequeFlag : ",securityChequeFlag);
      //   //console.log("depositeFlag : ",depositeFlag);
      //   //console.log("otherProprtyFlag : ",otherProprtyFlag);

      //   if((propertyFlag == false && movableFlag == false && securityChequeFlag == false && 
      //     depositeFlag == false && otherProprtyFlag == false)) {
      //     this.commomService.showWarningMessage("Please add atleast one record for each details");
      //   }
      //   else if(propertyFlag == false) {
      //     this.commomService.showWarningMessage("Please add atleast one record for Property details");
      //   }
      //   else if(movableFlag == false) {
      //     this.commomService.showWarningMessage("Please add atleast one record for Movable Property details");
      //   }
      //   else if(securityChequeFlag == false) {
      //     this.commomService.showWarningMessage("Please add atleast one record for Security Cheques and PDC Cheques");
      //   }
      //   else if(depositeFlag == false) {
      //     this.commomService.showWarningMessage("Please add atleast one record for  Deposits as Lien");
      //   }
      //   else if(otherProprtyFlag == false) {
      //     this.commomService.showWarningMessage("Please add atleast one record for Any other Property or Security as Lien");
      //   }
      //   saveFlag = false;
      // }


      // let proprtyArr = JSON.parse(JSON.stringify(this.propertyGridData));
      // let movableArr = JSON.parse(JSON.stringify(this.depositAsLienGridData));
      // if (proprtyArr.length != 0) {
      //   this.submittedPropertyDetails = true;

      // }
      // if (this.movablePropertyGridData.length != 0) {
      //   this.submittedMovablepropertyDetails = true;
      // }
      // for (let i = 0; i < proprtyArr.length; i++) {
      //   proprtyArr[i].pDeeddate = this.commomService.formatDateFromDDMMYYYY(proprtyArr[i].pDeeddate);
      //   proprtyArr[i].pEstimatedmarketvalue = proprtyArr[i].pEstimatedmarketvalue?  Number((proprtyArr[i].pEstimatedmarketvalue.toString()).replace(/,/g, "")) : 0;
      // }
      // for (let k = 0; k < this.anyOtherPropertyGridData.length; k++) {
      //   this.anyOtherPropertyGridData[k].pEstimatedvalue = this.anyOtherPropertyGridData[k].pEstimatedvalue ?  Number((this.anyOtherPropertyGridData[k].pEstimatedvalue.toString()).replace(/,/g, "")) : 0;
      // }
      // for (let i = 0; i < movableArr.length; i++) {
      //   movableArr[i].pDepositdate = this.commomService.formatDateFromDDMMYYYY(movableArr[i].pDepositdate);
      //   movableArr[i].pMaturitydate = this.commomService.formatDateFromDDMMYYYY(movableArr[i].pMaturitydate);
      //   movableArr[i].pTenureofdeposit = movableArr[i].pTenureofdeposit ? Number((movableArr[i].pTenureofdeposit.toString()).replace(/,/g, "")) : 0;
      //   movableArr[i].pDepositamount = movableArr[i].pDepositamount ? Number((movableArr[i].pDepositamount.toString()).replace(/,/g, "")) : 0;
      // }
      // //console.log("this.securityChequesGridData.length : ",this.securityChequesGridData.length);

      // if((proprtyArr && proprtyArr.length > 0) &&
      //   (this.movablePropertyGridData && this.movablePropertyGridData.length > 0) &&
      //   (this.securityChequesGridData && this.securityChequesGridData.length > 0) &&
      //   (movableArr && movableArr.length > 0) &&
      //   (this.anyOtherPropertyGridData && this.anyOtherPropertyGridData.length > 0) 
      //   ) {
      //     securityAndCollateralDetails.imMovablePropertyDetailsList = proprtyArr;
      //     for (let i = 0; i < this.movablePropertyGridData.length; i++) {
      //       this.movablePropertyGridData[i].pEstimatedmarketvalue = this.movablePropertyGridData[i].pEstimatedmarketvalue ? Number((this.movablePropertyGridData[i].pEstimatedmarketvalue.toString()).replace(/,/g, "")) : 0;

      //     }
      //     securityAndCollateralDetails.movablePropertyDetailsList = this.movablePropertyGridData;
      //     securityAndCollateralDetails.securitychequesList = this.securityChequesGridData;
      //     securityAndCollateralDetails.depositsasLienList = movableArr;
      //     securityAndCollateralDetails.otherPropertyorsecurityDetailsList = this.anyOtherPropertyGridData
      //     saveFlag = true;
      //   }
      //   else {
      //     this.commomService.showWarningMessage("Please add atleast one record for Each Details");
      // if(proprtyArr.length == 0) {
      //   this.commomService.showWarningMessage("Please add atleast one record for Property Details");
      // }
      // else if(this.movablePropertyGridData.length == 0) {
      //   this.commomService.showWarningMessage("Please add atleast one record for Movable Property Details ");
      // }
      // else if(this.securityChequesGridData.length == 0) {
      //   this.commomService.showWarningMessage("Please add atleast one record for Security Cheques and PDC Cheques");
      // }
      // else if(movableArr.length == 0) {
      //   this.commomService.showWarningMessage("Please add atleast one record for Deposits as Lien");
      // }
      // else if(this.anyOtherPropertyGridData.length == 0) {
      //   this.commomService.showWarningMessage("Please add atleast one record for Any other Property or Security as Lien");
      // }

      //   saveFlag = false;
      // }
    }
    if (saveFlag) {

      let httpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      });
      let options = {
        headers: httpHeaders,
      };
      if (this.pVchapplicationid && this.pVchapplicationid != '') {
        this.buttonName = "Processing";
        this.isLoading = true;
        debugger;
        var securityAndCollateralFinalData = Object.assign(securityAndCollateralDetails, securityAndCollateralIndividualFlag);
        debugger;
        let savejson = JSON.stringify(securityAndCollateralFinalData);
        this.fiIndividualService.saveApplicationSecurityCollateral(securityAndCollateralFinalData).subscribe(event => {
          if (event) {
            this.buttonName = "Save & Continue";
            this.isLoading = false;
            // let str = "existing-loans"
            // this.dropdoenTabname="Existing Loans "
            let str;
            let temptabname;
            this.dropdoenTabname = this.commomService.GetFiTabName();
            let tempFirstInformationTabsData = this._FirstInformationTabsData;
            let data = this.fiIndividualService.moevToNextTab(tempFirstInformationTabsData, this.dropdoenTabname);
            str = data.tabId;
            temptabname = data.tabName;
            if (str == '' && temptabname == '') {
              this.buttonName = "Submit";
              this.isLoading = false;
              this.commomService.showInfoMessage('Saved successfully');
              this.router.navigateByUrl('/FiView');
              return
            }
            this.commomService.SetFiTabName(temptabname);
            this.dropdoenTabname = temptabname;
            $('.nav-item a[href="#' + str + '"]').tab('show').addClass('active show');
            this.forGettingAndEditingExistingUsersEmit.emit(true);
          }
          else {
            this.buttonName = "Save & Continue";
            this.isLoading = false;
          }
        }, (error) => {
          this.buttonName = "Save & Continue";
          this.isLoading = false;
        });
      }
    }
  }
  /**(end) -----saving data to api ------ (end) */

  /**(start) -----emit property Details to 8th tab ------ (start) */
  propertyDetailsEmitEvent(event) {
    this.propertyGridData = event;
    let propertyData = JSON.parse(JSON.stringify(event));
    if (propertyData) {
      if (this.propertyDetailsComponent) {
        this.propertyDetailsComponent.lstApplicantsandothers = this.lstApplicantsandothers;
        for (let i = 0; i < propertyData.length; i++) {
          propertyData[i].ptypeofoperation = 'OLD';
        }
        this.securityColletralPropertyDetails.emit(propertyData)
      }
    }
  }
  /**(end) -----emit property Details to 8th tab ------ (end) */

  /**(start) -----emit movable property Details to 8th tab ------ (start) */
  movablepropertyDetailsEmitEvent(event) {
    this.movablePropertyGridData = event;
    let movableData = JSON.parse(JSON.stringify(event));
    if (movableData) {
      if (this.movablePropertyDetailsComponent) {
        this.movablePropertyDetailsComponent.lstApplicantsandothers = this.lstApplicantsandothers;
        for (let i = 0; i < movableData.length; i++) {
          movableData[i].ptypeofoperation = 'OLD';
        }

        this.securityColletralmovablePropertyDetails.emit(movableData);
      }
    }
  }
  /**(end) -----emit movable property Details to 8th tab ------ (end) */

  /**(start) -----disable security and colletral notapplicable toggle ------ (start) */
  disableSecurityAndColletral() {
    if (this.showPropertyDetails == true
      && this.showMovablePropertyDetails == true
      && this.showPdcChequesDetails == true
      && this.showDeposits == true
      && this.showOtherPropertyDetails == true) {
      this.notApplicableForAll = true;
    }
    else {
      this.notApplicableForAll = false;
    }
  }
  /**(end) -----disable security and colletral notapplicable toggle ------ (end) */

  /**(start) -----for edit the existing record of Security Collateral Details------ (start) */
  getSecurityCollateralDetails(applicationid, strapplicationid) {
    try {
      if ((applicationid && applicationid != '') && (strapplicationid && strapplicationid != '')) {
        this.loading = true;
        this.fiIndividualService.getSecurityCollateralDetails(applicationid, strapplicationid).subscribe(response => {
          if (response && response != null) {
            this.getSecurityCollateralData = response;
            for (let index = 0; index < this.getSecurityCollateralData.movablePropertyDetailsList.length; index++) {
              this.movablePropertyGridData = this.getSecurityCollateralData.movablePropertyDetailsList[index];

            }

          }
          this.loading = false;
        });
        this.movablePropertyDetailsComponent.movablePropertyGridData = this.movablePropertyGridData;
      }

    } catch (error) {
      this.loading = false;
    }

  }
  /**(end) -----for edit the existing record of Security Collateral Details------ (end) */

  /**(start) -----for getting data from api (Security Collateral Details)------ (start) */
  getSecurityAndColletralData() {
    this.fiIndividualService.getFiSecurityAndColletralData(this.pContactId, this.pVchapplicationid).subscribe((resposne: any) => {
      if (resposne) {
        this.showPropertyDetails = !(resposne.pIsimmovablepropertyapplicable);
        this.showMovablePropertyDetails = !(resposne.pismovablepropertyapplicable);
        this.showPdcChequesDetails = !(resposne.pissecuritychequesapplicable);
        this.showDeposits = !(resposne.pisdepositslienapplicable);
        this.showOtherPropertyDetails = !(resposne.pissecuritylienapplicable);

        if (!this.showPdcChequesDetails) {
          this.securityChequesGridData = resposne.securitychequesList;
          if (this.securityChequesGridData && this.securityChequesGridData.length > 0) {
            for (let i = 0; i < this.securityChequesGridData.length; i++) {
              let index = this.lstApplicantsandothers.findIndex(item => item.pcontactreferenceid == this.securityChequesGridData[i].pContactreferenceid);
              this.lstApplicantsandothers[index].status = true;
            }
          }
          else {
            for (let i = 0; i < this.lstApplicantsandothers.length; i++) {
              if (this.lstApplicantsandothers[i].pcontactreferenceid == this.selectedApplicantData.pContactreferenceid) {
                this.lstApplicantsandothers[i].status = true;
                break;
              }
            }
          }
        }
        if (!this.showDeposits) {
          for (let i = 0; i < resposne.depositsasLienList.length; i++) {
            resposne.depositsasLienList[i].pDepositamount = resposne.depositsasLienList[i].pDepositamount ? this.commomService.currencyformat(resposne.depositsasLienList[i].pDepositamount) : 0;
          }
          this.depositAsLienGridData = resposne.depositsasLienList;
        }
        if (!this.showOtherPropertyDetails) {
          for (let i = 0; i < resposne.otherPropertyorsecurityDetailsList.length; i++) {
            resposne.otherPropertyorsecurityDetailsList[i].pEstimatedvalue = resposne.otherPropertyorsecurityDetailsList[i].pEstimatedvalue ? this.commomService.currencyformat(resposne.otherPropertyorsecurityDetailsList[i].pEstimatedvalue) : 0;
          }
          this.anyOtherPropertyGridData = resposne.otherPropertyorsecurityDetailsList;
        }
        this.tempData1 = resposne.imMovablePropertyDetailsList ? [...resposne.imMovablePropertyDetailsList] : null;
        this.tempData2 = resposne.movablePropertyDetailsList ? [...resposne.movablePropertyDetailsList] : null;
        if (this.tempData1 && this.tempData1 != null) {
          for (let i = 0; i < this.tempData1.length; i++) {
            this.tempData1[i].pEstimatedmarketvalue = this.tempData1[i].pEstimatedmarketvalue ? this.commomService.currencyformat(this.tempData1[i].pEstimatedmarketvalue) : 0;
          }
        }
        if (this.tempData2 && this.tempData2 != null) {
          for (let i = 0; i < this.tempData2.length; i++) {
            this.tempData2[i].pEstimatedmarketvalue = this.tempData2[i].pEstimatedmarketvalue ? this.commomService.currencyformat(this.tempData2[i].pEstimatedmarketvalue) : 0;
          }
        }
        let data = {
          tempData1: this.tempData1,
          tempData2: this.tempData2,
        }
        if (this.propertyDetailsComponent) {
          this.propertyDetailsComponent.propertyGridData = this.tempData1;
        }
        if (this.movablePropertyDetailsComponent) {
          this.movablePropertyDetailsComponent.movablePropertyGridData = this.tempData2;
        }
        this.forLoanSpecificData.emit(data);
        this.disableSecurityAndColletral();
      }
    })
  }
  /**(end) -----for getting data from api (Security Collateral Details)------ (end) */

  getPropertyData() {
    this.propertyDetailsComponent.propertyGridData = this.tempData1;
  }

  getImmovablePropertyData() {
    this.movablePropertyDetailsComponent.movablePropertyGridData = this.tempData2;
  }

  /**(start) -----validations for entered account number------ (start) */
  enteredAccountNumber(event) {
    let enteredData: string = event.target.value;
    enteredData = enteredData.trim();
    if (enteredData.length == 11) {
      this.depositsAsLienForm.patchValue({
        pDepositaccountno: enteredData
      })
      this.BlurEventAllControll(this.depositsAsLienForm);
    }
  }
  /**(end) -----validations for entered account number------ (end) */

  //  Calculated by Ravi Shankar thrymr team 21st Nov 2019 
  // on the basis of deposit date and deposit tenure calculating meturity date
  //<----------------------------- Start ----------------------------------->
  onValueChange(value: Date): void {
    let data = value;
    this.depositsAsLienForm.controls.pDepositdate.setValue(data);
    this.calculateMaturityDate();
  }

  calculateMaturityDate() {

    let tenureofdeposit = this.depositsAsLienForm.controls.pTenureofdeposit.value;
    let deposittenuretype = this.depositsAsLienForm.controls.pDeposittenuretype.value;
    let depositdate = this.depositsAsLienForm.controls.pDepositdate.value;
    var maturityDate = new Date(depositdate);
    if (deposittenuretype == 'Days') {
      maturityDate.setDate(depositdate.getDate() + Number(tenureofdeposit));
      this.depositsAsLienForm.controls.pMaturitydate.setValue(maturityDate);
    } else if (deposittenuretype == 'Months') {
      maturityDate.setMonth((depositdate.getMonth()) + Number(tenureofdeposit));
      // maturityDate.setDate(maturityDate.getDate()-1);
      this.depositsAsLienForm.controls.pMaturitydate.setValue(maturityDate);
    } else {
      maturityDate.setFullYear(depositdate.getFullYear() + Number(tenureofdeposit));
      // maturityDate.setDate(maturityDate.getDate()-1);
      this.depositsAsLienForm.controls.pMaturitydate.setValue(maturityDate);
    }
  }

  //<----------------------------- End ----------------------------------->

  moveToPreviousTab() {
    // let str = 'personal-details'
    // this.dropdoenTabname = "Personal Details";
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
    this.forGettingPersonalDetailsDataEmit.emit(true);
  }
  /**<-----(start)clear form data functionality---->(start) */
  clearForm() {
    if (this.propertyDetailsComponent) {
      this.propertyDetailsComponent.loadInitData();
    }
    if (this.movablePropertyDetailsComponent) {
      this.movablePropertyDetailsComponent.loadInitData();
    }
    this.securityConfigErrorMessage = {};
    this.securityChequesForm = this.formBuilder.group({
      createdby: 1,
      modifiedby: [0],
      pIsapplicable: true,
      pStatusid: "",
      pRecordid: [0],
      pContactid: [0],
      pApplicanttype: [''],
      pContactreferenceid: [''],
      pTypeofsecurity: [''],
      pBankname: [''],
      pIfsccode: [''],
      // pAccountno: ['',Validators.required],
      // pChequeno: ['',Validators.required],
      pAccountno: [''],
      pChequeno: ['', Validators.maxLength(10)],
      pSecuritychequesdocpath: [''],
      pSecuritychequesdocpathname: [''],
      pCreatedby: [this.commomService.pCreatedby],
      pModifiedby: [0],
      pCreateddate: [this.today],
      pModifieddate: [''],
      pStatusname: ['ACTIVE'],
      pEffectfromdate: "",
      pEffecttodate: "",
      ptypeofoperation: ['CREATE']
    })

    this.depositsAsLienForm = this.formBuilder.group({
      createdby: 1,
      modifiedby: [0],
      pIsapplicable: true,
      pRecordid: [0],
      pContactid: [0],
      pApplicanttype: [''],
      pContactreferenceid: [''],
      pDepositin: ['External'],
      // pTypeofdeposit: ['', Validators.required],
      // pDepositorbank: ['', Validators.required],
      // pDepositaccountno: ['', Validators.required],
      pTypeofdeposit: [''],
      pDepositorbank: [''],
      pDepositaccountno: [''],
      pDepositamount: [''],
      pRateofinterest: [''],
      pDepositdate: [new Date()],
      pTenureofdeposit: [''],
      pDeposittenuretype: ['Days'],
      pMaturitydate: [new Date()],
      pDepositdocpath: [''],
      pDepositdocpathname: [''],
      pCreatedby: [this.commomService.pCreatedby],
      pModifiedby: [0],
      pCreateddate: [this.today],
      pModifieddate: [''],
      pStatusname: ['ACTIVE'],
      pEffectfromdate: "",
      pEffecttodate: "",
      ptypeofoperation: ['CREATE']
    })

    this.anyOtherPropertyForm = this.formBuilder.group({
      createdby: 1,
      modifiedby: [0],
      pIsapplicable: true,
      pRecordid: [0],
      pContactid: [0],
      pContactreferenceid: [''],
      // pNameofthesecurity: ['',Validators.required],
      // pEstimatedvalue: ['',Validators.required],
      pNameofthesecurity: [''],
      pEstimatedvalue: [''],
      pSecuritydocpath: [''],
      pSecuritydocpathname: [''],
      pCreatedby: [this.commomService.pCreatedby],
      pModifiedby: [0],
      pCreateddate: [this.today],
      pModifieddate: [''],
      pStatusname: ['ACTIVE'],
      pEffectfromdate: "",
      pEffecttodate: "",
      pStatusid: "",
      ptypeofoperation: ['CREATE']
    })
    this.BlurEventAllControll(this.securityChequesForm);
    this.BlurEventAllControll(this.depositsAsLienForm);
    this.BlurEventAllControll(this.anyOtherPropertyForm);
  }
  /**<-----(end)clear form data functionality---->(end) */

}
