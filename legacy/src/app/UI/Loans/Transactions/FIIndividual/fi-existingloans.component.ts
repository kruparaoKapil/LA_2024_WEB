import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { ToastrService } from 'ngx-toastr';
import { FIIndividualService } from 'src/app/Services/Loans/Transactions/fiindividual.service';
import { ThrowStmt } from '@angular/compiler';
import { LoansmasterService } from 'src/app/Services/Loans/Masters/loansmaster.service';
import { Router } from '@angular/router';


declare let $: any

@Component({
  selector: 'app-fi-existingloans',
  templateUrl: './fi-existingloans.component.html',
  styles: []
})
export class FiExistingloansComponent implements OnInit {

  @Output() getDataForLoanspecific = new EventEmitter();
  @Output() forGettingSecurityColletralDataEmit = new EventEmitter();
	_FirstInformationTabsData: any = [];
  @Input()
  set FirstInformationTabsData(FirstInformationTabsData: any) {
    this._FirstInformationTabsData = FirstInformationTabsData;
  }
  existingform: FormGroup;

  @Input() forClearButton: boolean;

  calloanFlag: boolean = true;
  calinstallFlag: boolean = true;
  calprincipleFlag: boolean = true;
  loading: boolean = false;
  submitted = false;
  accountno = false;
  public isLoading: boolean = false;
  notApplicableForExistingLoansFlag: boolean = true;
  forCheckBalanceTransfer: boolean = false;

  dropdoenTabname: string;
  pUploadLoanSanctionDocumentResponse: any;
  pUploadEmiChartDocumentResponse: any;
  totalData: any;
  pApplicantid: any;
  EditIndexid: any;
  pContactreferenceid: any;
  pLoanSanctionDocumentfilename: any;
  buttontype: any;
  Vchapplicationid: any;
  pLoanSanctionDocumentpath: any;
  pEmichartDocumentfilename: any;
  pEmichartDocumentpath: any;

  listdata: any = [];
  loanPayinsList = [];
  gridData: any = [];

  sum = 0;
  principlesum = 0;
  principlestandingondate = 0;
  installAmt = 0;
  loanAmt = 0;
  principalAmt = 0;

  buttonname = "Add";
  buttonName = "Save & Continue";

  constructor(private fb: FormBuilder,
    private _CommonService: CommonService,
    private _fiindividual: FIIndividualService,
    private loanMasterServcie: LoansmasterService,
    private toaster: ToastrService,  private router:Router) { }

  ngOnInit() {
    this.getLoanPayIns();
    this._CommonService._GetFiTab1Data().subscribe(res => {
      if (res != null && res != undefined && res != "") {
        this.Vchapplicationid = res.pVchapplicationid;
        this.pApplicantid = res.pApplicantid;
        this.pContactreferenceid = res.pContactreferenceid;
      }
    })
    this.loadInitData();
    this._CommonService._GetFiTab1Data().subscribe(data => {
      setTimeout(() => {
        this.existingform.controls.pContactid.setValue(data.pApplicantid);
        this.existingform.controls.pContactreferenceid.setValue(data.pContactreferenceid);
      }, 0);
    })
  }
  loadInitData() {
    this.existingform = this.fb.group
      ({
        pRecordid: [0],
        pisbalancetransferapplicable: [false],
        pbankorcreditfacilityname: ['', Validators.maxLength(75)],
        pRateofinterest: ['', Validators.maxLength(7)],
        pLoanpayin: ['', Validators.maxLength(15)],
        pInstalmentamount: ['', Validators.maxLength(15)],
        ploanamount: ['', Validators.maxLength(15)],
        pPrincipleoutstanding: ['', Validators.maxLength(15)],
        pLoanno: ['', [Validators.maxLength(20)]],
        pTenureofloan: ['', Validators.maxLength(3)],
        pLoanname: ['', Validators.maxLength(50)],
        premainingTenureofloan: [0],
        pLoansanctiondate: [''],
        pApplicantid: [0],
        pContactid: [this.pApplicantid],
        pContactreferenceid: [this.pContactreferenceid],
        pTypeofLender: ['othercompany'],
        pStatusname: ['Active'],
        ptypeofoperation: ['CREATE'],
        pCreatedby: [this._CommonService.pCreatedby],
        lstApplicationExistingLoanDetails: this.fb.array([]),
        pLoanSanctionDocumentfilename: [''],
        pEmichartDocumentfilename: [''],
        pLoanSanctionDocumentpath: [''],
        pEmichartDocumentpath: ['']
      });
  }

  ApplicationExistingLoanDetails() {
    return this.fb.group({
      pRecordid: [0],
      pbankorcreditfacilityname: ['', Validators.maxLength(75)],
      pRateofinterest: ['', Validators.maxLength(7)],
      pLoanpayin: ['', Validators.maxLength(15)],
      pInstalmentamount: ['', Validators.maxLength(15)],
      ploanamount: ['', Validators.maxLength(15)],
      pPrincipleoutstanding: ['', Validators.maxLength(15)],
      pLoanno: ['', Validators.maxLength(20)],
      pTenureofloan: ['', Validators.maxLength(3)],
      pLoanname: ['', Validators.maxLength(50)],
      premainingTenureofloan: [0],
      pApplicantid: [0],
      pContactid: [this.pApplicantid],
      pContactreferenceid: [this.pContactreferenceid],
      pVchapplicationid: [this.Vchapplicationid],
      pTypeofLender: ['othercompany'],
      pStatusname: ['Active'],
      ptypeofoperation: ['CREATE'],
      pCreatedby: [this._CommonService.pCreatedby],
    })
  }
  /**<-----(start) Add existing loan details to grid (start)----> */
  addToGrid() {
    if (this.buttonname == "Update") {
      if (this.existingform.valid == true) {

        if (this.gridData[this.EditIndexid]['pPrincipleoutstanding'] !== this.existingform.controls['pPrincipleoutstanding'].value) {
          let ps = this.existingform.controls['pPrincipleoutstanding'].value
          if (ps != "" && ps != null) {

            if (ps.toString().includes(',')) {
              this.principlestandingondate = this.functiontoRemoveCommas(ps);
              this.principlestandingondate = +this.principlestandingondate;
            }
            else {
              this.principlestandingondate = +ps
            }
          }
        }
        this.gridData[this.EditIndexid] = this.existingform.value
        this.loadInitData();
        this.buttonname = "Add"
        this.submitted = false;
      }
    }
    else if (this.buttonname == "Add") {
      let addFlag = false;
      if (this.existingform.value.pbankorcreditfacilityname ||
        this.existingform.value.pLoanno ||
        this.existingform.value.pLoanname ||
        this.existingform.value.pTenureofloan ||
        this.existingform.value.pRateofinterest ||
        this.existingform.value.pLoanpayin ||
        this.existingform.value.pInstalmentamount ||
        this.existingform.value.ploanamount ||
        this.existingform.value.pPrincipleoutstanding) {
        addFlag = true;
      }
      else {
        addFlag = false;
      }
      this.submitted = true;
      if (addFlag) {
        if ((this.calinstallFlag && this.calloanFlag && this.calprincipleFlag)) {

          if (this.existingform.valid == true) {
            this.existingform.value.pContactid = this.pApplicantid;
            this.existingform.value.pRecordid = 0;
            this.existingform.value.pApplicantid = 0;
            this.existingform.value.ptypeofoperation = 'CREATE';
            this.existingform.value.pRateofinterest = this.existingform.value.pRateofinterest ? this.existingform.value.pRateofinterest : 0;
            this.existingform.value.pTenureofloan = this.existingform.value.pTenureofloan ? this._CommonService.currencyformat(this.existingform.value.pTenureofloan) : 0;
            this.existingform.value.pInstalmentamount = this.existingform.value.pInstalmentamount ? this._CommonService.currencyformat(this.existingform.value.pInstalmentamount) : 0;
            this.existingform.value.pPrincipleoutstanding = this.existingform.value.pPrincipleoutstanding ? this._CommonService.currencyformat(this.existingform.value.pPrincipleoutstanding) : 0;
            this.existingform.value.ploanamount = this.existingform.value.ploanamount ? this._CommonService.currencyformat(this.existingform.value.ploanamount) : 0;
            this.existingform.value.pLoanSanctionDocumentfilename = this.pLoanSanctionDocumentfilename;
            this.existingform.value.pEmichartDocumentfilename = this.pEmichartDocumentfilename;
            this.existingform.value.pLoanSanctionDocumentpath = this.pLoanSanctionDocumentpath;
            this.existingform.value.pEmichartDocumentpath = this.pEmichartDocumentpath;
            this.gridData.push(this.existingform.value);
            $('#fileEmiId').val(null);
            $('#fileSanctionId').val(null);
            this.loanAmt = null;
            this.principalAmt = null;
            this.installAmt = null;
            let ps = this.existingform.controls['pPrincipleoutstanding'].value
            if (ps != "" && ps != null) {
              if (ps.toString().includes(',')) {
                this.principlestandingondate = this.functiontoRemoveCommas(ps);
                this.principlestandingondate = +this.principlestandingondate;
              }
              else {
                this.principlestandingondate = +ps
              }
            }
            this.submitted = false;
            this.loadInitData();
          }
        }
        else {
          if (this.calinstallFlag == false && this.calprincipleFlag == false) {
            this._CommonService.showWarningMessage("Loan amount should be greater than Installment and principle amount");
          }
          else if (this.calinstallFlag == false) {
            this._CommonService.showWarningMessage("Loan amount should be greater than Installment amount");
          }
          else if (this.calloanFlag == false) {
            this._CommonService.showWarningMessage("Loan amount should be greater than Installment amount");
          }
          else if (this.calprincipleFlag == false) {
            this._CommonService.showWarningMessage("Principal Amount should be less than Loan amount");
          }
        }
      }
    }
    this.principlesum = 0;
    for (let index = 0; index < this.gridData.length; index++) {

      this.principlesum = this.principlesum + Number(((this.gridData[index].pPrincipleoutstanding).toString()).replace(/,/g, ""));
    }
  }
/**<-----(end) Add existing loan details to grid (end)----> */

/**<-----(start) remove commas in amount field (start)----> */
 public functiontoRemoveCommas(value) {
    let a = value.split(',')
    let b = a.join('')
    let c = b
    return c;
  }
/**<-----(end) remove commas in amount field (end)----> */

/**<-----(start) update data of form   (start)----> */
editdata(event) {
    if (event.dataItem['pTypeofLender'] == "company") {
      this.buttonname = "Add"
    }
    else {
      this.buttonname = "Update"
      if (event.dataItem['pTypeofLender'] == "othercompany") {
        this.existingform.controls['pLoanname'].setValue(event.dataItem['pLoanname'])
        this.existingform.controls['pLoanno'].setValue(event.dataItem['pLoanno'])
        this.existingform.controls['pTenureofloan'].setValue(event.dataItem['pTenureofloan'])
        this.existingform.controls['pInstalmentamount'].setValue(event.dataItem['pInstalmentamount'])
        this.existingform.controls['ploanamount'].setValue(event.dataItem['ploanamount'])
        this.existingform.controls['premainingTenureofloan'].setValue(event.dataItem['premainingTenureofloan'])
        this.existingform.controls['pRateofinterest'].setValue(event.dataItem['pRateofinterest'])
        this.existingform.controls['pbankorcreditfacilityname'].setValue(event.dataItem['pbankorcreditfacilityname'])
        this.existingform.controls['pLoanpayin'].setValue(event.dataItem['pLoanpayin'])
        this.existingform.controls['pPrincipleoutstanding'].setValue(event.dataItem['pPrincipleoutstanding'])
        this.existingform.controls['pRecordid'].setValue(event.dataItem['pRecordid'])
        this.existingform.controls['pCreatedby'].setValue(event.dataItem['pCreatedby'])
        this.existingform.controls['pContactid'].setValue(event.dataItem['pContactid'])
        this.existingform.controls['pApplicantid'].setValue(event.dataItem['pApplicantid'])
        this.existingform.controls['pContactreferenceid'].setValue(event.dataItem['pContactreferenceid'])
        this.existingform.controls['pTypeofLender'].setValue(event.dataItem['pTypeofLender'])
        this.existingform.controls['ptypeofoperation'].setValue("UPDATE")
        this.EditIndexid = event.rowIndex
      }
    }

  }
/**<-----(end) update data of form   (end)----> */

/**<-----(start) save data in api (start)----> */
  saveApplicationELoanDetails() {
    let saveBoolean: boolean = false;
    //console.log("this.existingform.valid :",this.existingform.valid);
    //console.log("this.notApplicableForExistingLoansFlag : ",this.notApplicableForExistingLoansFlag);

    // if(this.notApplicableForExistingLoansFlag) {
    //   saveBoolean = true;
    // }
    // else {
    //   if(this.gridData && this.gridData.length > 0 ) {
    //     saveBoolean = true
    //   }
    //   else {
    //     if(this.gridData.length == 0) {
    //       if(this.existingform.valid) {
    //         saveBoolean = true
    //       }
    //       else {
    //         saveBoolean = false;
    //       }
    //     }
    //   }
    // }
    //console.log("saveBoolean : ",saveBoolean);

    // if(saveBoolean) {
    this.existingform.controls['pCreatedby'].setValue(this._CommonService.pCreatedby);
    this.existingform.controls['ptypeofoperation'].setValue('CREATE');
    console.log("this.gridData : ", this.gridData);
    for (let i = 0; i < this.gridData.length; i++) {
      this.gridData[(this.gridData.length) - 1].pCreatedby = this._CommonService.pCreatedby;
      this.gridData[(this.gridData.length) - 1].premainingTenureofloan = 0;
      this.gridData[(this.gridData.length) - 1].pContactreferenceid = this.pContactreferenceid;
      let Chargescontrol = <FormArray>this.existingform.controls['lstApplicationExistingLoanDetails'];
      Chargescontrol.push(
        this.fb.group
          ({
            pRecordid: [0],
            pisbalancetransferapplicable: [false],
            pbankorcreditfacilityname: ['', Validators.maxLength(75)],
            pRateofinterest: ['', Validators.maxLength(7)],
            pLoanpayin: ['', Validators.maxLength(15)],
            pInstalmentamount: ['', Validators.maxLength(15)],
            ploanamount: ['', Validators.maxLength(15)],
            pPrincipleoutstanding: ['', Validators.maxLength(15)],
            pLoanno: ['', [Validators.maxLength(20)]],
            pTenureofloan: ['', Validators.maxLength(3)],
            pLoanname: ['', Validators.maxLength(50)],
            premainingTenureofloan: [0],
            pLoansanctiondate: [''],
            pApplicantid: [0],
            pContactid: [this.pApplicantid],
            pContactreferenceid: [this.pContactreferenceid],
            pTypeofLender: ['othercompany'],
            pStatusname: ['Active'],
            ptypeofoperation: ['CREATE'],
            pCreatedby: [this._CommonService.pCreatedby],
            lstApplicationExistingLoanDetails: this.fb.array([]),
            pLoanSanctionDocumentfilename: [''],
            pEmichartDocumentfilename: [''],
            pLoanSanctionDocumentpath: [''],
            pEmichartDocumentpath: ['']
          })
      );
      this.existingform['controls']['lstApplicationExistingLoanDetails']['controls'][i].patchValue(this.gridData[i]);

    }
    let appilicableBoolean = {
      pVchapplicationid: this.Vchapplicationid,
      pCreatedby: this._CommonService.pCreatedby,
      pIsexistingloansapplicable: !this.notApplicableForExistingLoansFlag
    }
    let data = Object.assign(this.existingform.value, appilicableBoolean);
    this.totalData = data;
    let Chargescontrol1 = <FormArray>this.existingform.controls['lstApplicationExistingLoanDetails'];

    for (let i = Chargescontrol1.length - 1; i >= 0; i--) {
      Chargescontrol1.removeAt(i)
    }
    if (this.notApplicableForExistingLoansFlag) {
      this.saveExistingLoans();
    }
    else {
      let count = 0;
      if (data.lstApplicationExistingLoanDetails && data.lstApplicationExistingLoanDetails.length > 0) {
        for (let p = 0; p < data.lstApplicationExistingLoanDetails.length; p++) {
          if (data.lstApplicationExistingLoanDetails[p].pisbalancetransferapplicable == false) {
            count++;
          }
        }
        if (count == data.lstApplicationExistingLoanDetails.length) {
          if (confirm("Do you want to proceed without any balance transfer?")) {
            this.saveExistingLoans();
          }
        }
        else {
          this.saveExistingLoans();
        }
      }
      else {
        this.saveExistingLoans();
      }
    }
  }
/**<-----(end) save data in api (end)----> */

/**<-----(start) remove data in grid (start)----> */
  removeHandler(event) {

    this.gridData.splice(event.rowIndex, 1);
    this.principlesum = 0;
    for (let index = 0; index < this.gridData.length; index++) {

      this.principlesum = this.principlesum + Number(((this.gridData[index].pPrincipleoutstanding).toString()).replace(/,/g, ""));
    }
  }
/**<-----(end) remove data in grid (end)----> */

/**<-----(start) checking validation in account number (start)----> */
  checkaccountno(event) {
    if (event.target.value.length < 12 || event.target.value.length > 12) {
      this.accountno = true;
    }
    else {
      this.accountno = false;
    }

  }
/**<-----(end) checking validation in account number (end)----> */

 /** <------(start) not applicable and applicable functionality (start)---->*/
  notApplicableForExistingLoans(event) {
    let checked = event.target.checked;
    if (checked == true) {
      this.notApplicableForExistingLoansFlag = true;
    } else {
      this.notApplicableForExistingLoansFlag = false;
    }
  }
 /** <------(end) not applicable and applicable functionality (end)---->*/

 /** <------(start) Getting data from api (start)---->*/
  getExistingUsersDataForEditingAndGetting() {
    this.loading = true;
    this._fiindividual.getFIExistingUsersData(this.pContactreferenceid, this.Vchapplicationid).subscribe((response: any) => {
      if (response) {
        this.loading = false;
        this.notApplicableForExistingLoansFlag = !(response.pIsexistingloansapplicable);
        let tempArr = response.lstApplicationExistingLoanDetails;
        this.principlesum = 0;
        this.sum = 0;
        if (tempArr && tempArr.length > 0) {
          this.gridData = tempArr;
          for (let i = 0; i < this.gridData.length; i++) {
            this.sum = this.sum + this.gridData[i].pPrincipleoutstanding
            this.gridData[i].pCreatedby = this._CommonService.pCreatedby;
            this.gridData[i].pInstalmentamount = this.gridData[i].pInstalmentamount ? this._CommonService.currencyformat(this.gridData[i].pInstalmentamount) : 0;
            this.gridData[i].pPrincipleoutstanding = this.gridData[i].pPrincipleoutstanding ? this._CommonService.currencyformat(this.gridData[i].pPrincipleoutstanding) : 0;
            this.gridData[i].ploanamount = this.gridData[i].ploanamount ? this._CommonService.currencyformat(this.gridData[i].ploanamount) : 0;
          }
          this.principlesum = this.sum;
        }
      }
      else {
        this.loading = false;
        this._CommonService.showErrorMessage("Somethinf went wrong from server side, please try after sometime!");
      }
    }, (error) => {
      this.loading = false;
    })
  }
 /** <------(end) Getting data from api (end)---->*/

/** <------(start) Getting loan payins data from api (start)---->*/
  getLoanPayIns() {
    this.loanMasterServcie._getLoanpayins().subscribe((response: any) => {
      this.loanPayinsList = response;
    })
  }
/** <------(end) Getting loan payins data from api (end)---->*/

  changeLoanPayIn(event) {
  }

/** <------(start) Cheking validation of amount fields(installment amount, principle amount and loan amount) (start)---->*/
installAmount(event) {

    this.installAmt = event.target.value;
    if ((this.loanAmt)) {
      if ((this.loanAmt ? Number(((this.loanAmt).toString()).replace(/,/g, "")) : 0) < (this.installAmt ? Number(((this.installAmt).toString()).replace(/,/g, "")) : 0)) {
        this._CommonService.showWarningMessage("InstallAmount should be less than Loan amount");
        this.calinstallFlag = false;
      }
      else {
        this.calinstallFlag = true;
        this.calloanFlag = true;
      }
    }
    else {
      this.calinstallFlag = true;
    }
  }
  loanAmount(event) {
    this.loanAmt = event.target.value;
    if (Number(((this.loanAmt).toString()).replace(/,/g, "")) == 0 || this.loanAmt == undefined || this.loanAmt == null) {
      this.calloanFlag = true;
    } else {
      if ((this.loanAmt ? Number(((this.loanAmt).toString()).replace(/,/g, "")) : 0) < (this.installAmt ? Number(((this.installAmt).toString()).replace(/,/g, "")) : 0)) {
        this._CommonService.showWarningMessage("Loan amount should be greater than Installment  amount");
        this.calloanFlag = false;
      }
      else if ((this.loanAmt ? Number(((this.loanAmt).toString()).replace(/,/g, "")) : 0) < (this.principalAmt ? Number(((this.principalAmt).toString()).replace(/,/g, "")) : 0)) {
        this._CommonService.showWarningMessage("Loan amount should be greater than principle amount");
        this.calloanFlag = false;
      }
      else {
        this.calloanFlag = true;
        this.calinstallFlag = true;
        this.calprincipleFlag = true;
      }
    }
  }
  principalAmount(event) {
    this.principalAmt = event.target.value;
    if (this.loanAmt) {

      if ((this.loanAmt ? Number(((this.loanAmt).toString()).replace(/,/g, "")) : 0) < (this.principalAmt ? Number(((this.principalAmt).toString()).replace(/,/g, "")) : 0)) {
        this._CommonService.showWarningMessage("Principal Amount should be less than Loan amount");
        this.calprincipleFlag = false;

      }
      else {
        this.calprincipleFlag = true;
      }
    }
    else {
      this.calprincipleFlag = true;
    }
  }
/** <------(end) Cheking validation of amount fields(installment amount, principle amount and loan amount) (end)---->*/

  moveToPreviousTab() {
    // let str = 'security-collateral'
    // this.dropdoenTabname = "Security and Collateral";
    // $('.nav-item a[href="#' + str + '"]').tab('show');
    let str;
    let temptabname;
    this.dropdoenTabname = this._CommonService.GetFiTabName();
    let tempFirstInformationTabsData = this._FirstInformationTabsData;
    for (let i = 0; i < tempFirstInformationTabsData.length; i++) {
      let pTabsectionname = tempFirstInformationTabsData[i].pTabsectionname;
      if (pTabsectionname == this.dropdoenTabname) {
        str = tempFirstInformationTabsData[i - 1].pTabsectionid;
        temptabname = tempFirstInformationTabsData[i - 1].pTabsectionname;
        this._CommonService.SetFiTabName(temptabname);
      }
    }
    this.dropdoenTabname = temptabname;
    $('.nav-item a[href="#' + str + '"]').tab('show').addClass('active show');
    this.forGettingSecurityColletralDataEmit.emit(true);
  }

  checkStatus(data) {
    let status = data.pisbalancetransferapplicable;

    if (status == false) {
      data.pisbalancetransferapplicable = true;
    }
    else {
      data.pisbalancetransferapplicable = false;
    }
    console.log("gridData : ", this.gridData);
  }

/** <------(start) upload file functionality (start)---->*/
  uploadAndProgressFiles(event, files, type) {
    let file = event.target.files[0];
    if (event && file) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = e => {
        if (type == 'sanction') {
          this.pUploadLoanSanctionDocumentResponse = {
            name: file.name,
            fileType: "pUploadLoanSanctionDocumentResponse",
            contentType: file.type,
            size: file.size,
          };
        }
        else if (type == 'emi') {
          this.pUploadEmiChartDocumentResponse = {
            name: file.name,
            fileType: "pUploadEmiChartDocumentResponse",
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
      if (type == 'sanction') {
        formData.append('NewFileName', this.existingform.value["pLoanSanctionDocumentfilename "] + '.' + files[i]["name"].split('.').pop());
      }
      else if (type == 'emi') {
        formData.append('NewFileName', this.existingform.value["pEmichartDocumentfilename "] + '.' + files[i]["name"].split('.').pop());
      }
    }
    size = size / 1024;
    if (type == 'sanction') {
      this._CommonService.fileUpload(formData).subscribe(data => {
        this.pLoanSanctionDocumentfilename = data[1];
        this.pLoanSanctionDocumentpath = data[0];
        console.log("------>", this.pLoanSanctionDocumentfilename, this.pLoanSanctionDocumentpath);

      });
    }
    else if (type == 'emi') {
      this._CommonService.fileUpload(formData).subscribe(data => {
        this.pEmichartDocumentfilename = data[1];
        this.pEmichartDocumentpath = data[0];
      });
    }
  }
/** <------(end) upload file functionality (end)---->*/

/** <------(start) functionality of balance transfer model(popup) (start)---->*/
   forBalanceTransfer() {
    $('#balanceTransferModal').modal('hide');
    this.saveExistingLoans();
  }
/** <------(end) functionality of balance transfer model(popup) (end)---->*/

/** <------(start) saving data to api (start)---->*/
  saveExistingLoans() {
    debugger
    this.buttonName = "Processing";
    this.isLoading = true;
    for (let p = 0; p < this.totalData.lstApplicationExistingLoanDetails.length; p++) {
      this.totalData.lstApplicationExistingLoanDetails[p].pInstalmentamount = this.totalData.lstApplicationExistingLoanDetails[p].pInstalmentamount ? Number(((this.totalData.lstApplicationExistingLoanDetails[p].pInstalmentamount).toString()).replace(/,/g, "")) : 0;
      this.totalData.lstApplicationExistingLoanDetails[p].pPrincipleoutstanding = this.totalData.lstApplicationExistingLoanDetails[p].pPrincipleoutstanding ? Number(((this.totalData.lstApplicationExistingLoanDetails[p].pPrincipleoutstanding).toString()).replace(/,/g, "")) : 0;
      this.totalData.lstApplicationExistingLoanDetails[p].ploanamount = this.totalData.lstApplicationExistingLoanDetails[p].ploanamount ? Number(((this.totalData.lstApplicationExistingLoanDetails[p].ploanamount).toString()).replace(/,/g, "")) : 0;
      this.totalData.lstApplicationExistingLoanDetails[p].pTenureofloan = this.totalData.lstApplicationExistingLoanDetails[p].pTenureofloan ? Number(((this.totalData.lstApplicationExistingLoanDetails[p].pTenureofloan).toString()).replace(/,/g, "")) : 0;
    }
    this._fiindividual.SaveApplicationExistingLoanDetails(this.totalData).subscribe(saveddata => {
      if (saveddata == true) {
        this.buttonName = "Save & Continue";
        this.isLoading = false;
        // let str = "loan-specific";
        // this.dropdoenTabname = "Loan Specific Fields";

        // $('.nav-item a[href="#' + str + '"]').tab('show');

          
			let str;
      let temptabname;
      this.dropdoenTabname = this._CommonService.GetFiTabName();
      let tempFirstInformationTabsData = this._FirstInformationTabsData;
      let datas = this._fiindividual.moevToNextTab(tempFirstInformationTabsData, this.dropdoenTabname);
      str = datas.tabId;
      temptabname = datas.tabName;
      if(str=='' && temptabname==''){
        this.buttonName = "Submit";
        this.isLoading = false;
        this._CommonService.showInfoMessage('Saved successfully');
        this.router.navigateByUrl('/FiView');
      }
      this._CommonService.SetFiTabName(temptabname);
      this.dropdoenTabname = temptabname;
      $('.nav-item a[href="#' + str + '"]').tab('show').addClass('active show');

        let data = {
          flag: true,
          Vchapplicationid: this.Vchapplicationid
        }
        this.getDataForLoanspecific.emit(data)
      }
      else {
        this.buttonName = "Save & Continue";
        this.isLoading = false;
      }
    }, (error) => {
      this.buttonName = "Save & Continue";
      this.isLoading = false;
    })
  }
/** <------(end) saving data to api (end)---->*/

  clearForm() {
    this.loadInitData();
  }
}
