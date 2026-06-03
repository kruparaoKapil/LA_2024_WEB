import { Component, OnInit, ViewChild } from '@angular/core';
import { FdnameandcodeComponent } from './fdnameandcode.component';
import { FdconfigurationComponent } from './fdconfiguration.component';
import { FdloanandfacilityComponent } from './fdloanandfacility.component';
import { FdidentificationComponent } from './fdidentification.component';
import { FdrefferalcommisionComponent } from './fdrefferalcommision.component';
import { IdentificationDocumentsComponent } from 'src/app/UI/Common/identification-documents/identification-documents.component';
import { FdRdServiceService } from 'src/app/Services/Banking/fd-rd-service.service';
import { CommonService } from 'src/app/Services/common.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
declare let $: any;

@Component({
  selector: 'app-fdconfig-new',
  templateUrl: './fdconfig-new.component.html',
  styles: []
})
export class FdconfigNewComponent implements OnInit {

  @ViewChild(FdnameandcodeComponent, { static: false }) fdNameAndCode: FdnameandcodeComponent;
  @ViewChild(FdconfigurationComponent, { static: false }) fdConfiguration: FdconfigurationComponent;
  @ViewChild(FdloanandfacilityComponent, { static: false }) fdLoanAndFacility: FdloanandfacilityComponent;
  @ViewChild(FdidentificationComponent, { static: false }) fdIndentification: FdidentificationComponent;
  @ViewChild(FdrefferalcommisionComponent, { static: false }) fdRefferalCommission: FdrefferalcommisionComponent;
  @ViewChild(IdentificationDocumentsComponent, { static: false }) identificationDocComponent: IdentificationDocumentsComponent;

  selectedtype: any;
  Title: any;
  path: any;
  pFdnamecode: any;
  pFdname: any;
  pFdconfigid: any;
  totalData: any;
   buttonStatus='Save';
  forButtons: boolean = true;
  isLoading: boolean = false;
  forDisableTabs: boolean = true;
  maxInterestrateto:any;
  maxinvestmentperiodto:any;

  buttonName: string = 'Save & Continue';

  constructor(private _rdfdservice: FdRdServiceService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private router: Router,
    private _route: ActivatedRoute) {
  }

  ngOnInit()
   {
     debugger;
     this.maxInterestrateto=0;
     this.maxinvestmentperiodto=0;
    this.forDisableTabs = true;
    /**---> Showing default 1st tab. It means FD Name and code */
    this.selectedtype = "FD Name and Code"
    this._rdfdservice.getTitleOnClick(this.selectedtype);
    if (this._route.snapshot.params['id']) {
      this.buttonStatus="Update"
    }
    else{
      this.buttonStatus='Save'
    }

  }

  /**-------(Start)-----When we click on tabs means 1,2 etc.. It will call -------(Start)----------
   * -----> Based on tab title we will call GET API's of that particular tab
   */
  showTitle(title) {
    debugger
    this.selectedtype = title;
    /**-----(Start)--> Here we forButtons boolean for hide buttons in <identifications> component----(Start)--- */
    if (title == 'FD Identification Documents') {
      this.forButtons = false;
      if (this.identificationDocComponent)
        this.identificationDocComponent.forButtons = false;
    }
    else {
      this.forButtons = true;
      if (this.identificationDocComponent)
        this.identificationDocComponent.forButtons = true;
    }
    /**-----(End)--> Here we forButtons boolean for hide buttons in <identifications> component----(End)--- */
    this._rdfdservice.getTitleOnClick(this.selectedtype);

    if (title == 'FD Name and Code') {
      this.getFdNameAndCodeDetails();
    }
    else if (title == 'FD Configuration') {
      this.getFdConfigurationDetails();
    }
    else if (title == 'FD Loan Facility and Pre-Maturity') {
      this.getFdLoanFacilityDetails();
    }
    else if (title == 'FD Identification Documents') {
      this.getFdIdentificationDetails();
    }
    else {
      this.getFdReferralCommissionDetails();
    }
  }
  /**-------(End)-----When we click on tabs means 1,2 etc.. It will call -------(End)---------- */

  /**----(Start)------ This method will call when we will click on right side drop down ----(Start)--- 
   * ---> Here also we will call GET API's of particulat tab based on that particular Tab Title
  */
  testlinks(data, type) {
   debugger
    let str = data

    this.path = data
    this.selectedtype = type;
    this._rdfdservice.getTitleOnClick(this.selectedtype)
    $('.nav-item a[href="#' + str + '"]').tab('show');
    if (type == 'FD Name and Code') {
      this.getFdNameAndCodeDetails();
    }
    else if (type == 'FD Configuration') {
      this.getFdConfigurationDetails();
    }
    else if (type == 'FD Loan Facility and Pre-Maturity') {
      this.getFdLoanFacilityDetails();
    }
    else if (type == 'FD Identification Documents') {
      this.getFdIdentificationDetails();
    }
    else {
      this.getFdReferralCommissionDetails();
    }
  }
  /**----(End)------ This method will call when we will click on right side drop down ----(End)--- */

  /**-----(Start)-----Saving each tab (Save button functionality)---------------(Start)------- */
  saveData() 
  {
    debugger
    this.Title = this._rdfdservice.sendTitle();
    /**
     * --------(Start)------Saving 1st tab (FD name and code) ----------(Start)---------
     * -------> Here after saving 1st tab data, we are calling 2nd tab get API.
     *          Because we need pFdconfigid for remianing tabs saving API's.
     */
    if (this.Title == "FD Name and Code") {
      let IsValid: boolean = true;
      if (this.fdNameAndCode.checkValidations(this.fdNameAndCode.fdNameAndCodeform, IsValid)) {
        this.forButtons = true;
        let data = this.fdNameAndCode.fdNameAndCodeform.value;
        let fdconfigid= this.fdNameAndCode.fdNameAndCodeform.value.pFdconfigid;
        this.pFdname = this.fdNameAndCode.fdNameAndCodeform.value.pFdname;
        this.pFdnamecode = this.fdNameAndCode.fdNameAndCodeform.value.pFdnamecode;
        let fdcode= this.fdNameAndCode.fdNameAndCodeform.value.pFdcode;
        if (this.fdNameAndCode.fdNameAndCodeform.valid) {
            this._rdfdservice.CheckFDNameCodeDupllicate(fdconfigid,this.pFdname,fdcode).subscribe(res=>{
              debugger;
              if(Number(res.pSchemeCodeCount)==0 && Number(res.pSchemeCount==0)){
          this.buttonName = 'Processing';
          this.isLoading = true;
          this._rdfdservice.saveFdNameAndCode(data).subscribe((response: any) => {
            this.buttonName = 'Save & Continue';
            this.isLoading = false;
            this.forDisableTabs = true;
            if (response) {
              this._rdfdservice.getFdConfigurationDetails(this.pFdname, this.pFdnamecode).subscribe((response: any) => {
                if (response) {
                  this.pFdconfigid = response.pFdconfigid;
                }
              }, (error) => {
              })
              let str = "fdConfiguration";
              $('.nav-item a[href="#' + str + '"]').tab('show');
              this.selectedtype = "FD Configuration";
              this.Title = "FD Configuration";
              //  $('.nav-item a').removeClass('disableTabs');
              this._rdfdservice.getTitleOnClick(this.selectedtype)
            }
          }, (error) => {
            this.buttonName = 'Save & Continue';
            this.isLoading = false;
          })
          this.totalData = this.fdNameAndCode.totalData;
          /**
           * ----->This totalData is coming from FD name and code component while editing time.
           *       We are getting this data from Router params. By using ViewChild of 1st tab
           *       we are retrieving that data.
           * -----> By using this totalData we are calling next tab(2nd tab) GET API
           */
          if (this.totalData && this.totalData.pFDname && this.totalData.pFdnamecode) {
            this.pFdconfigid = this.totalData.pFDconfigid;
            this.pFdname = this.totalData.pFDname;
            this.pFdnamecode = this.totalData.pFdnamecode;
            this.getFdConfigurationDetails();
          }
        }
        else{
           if(Number(res.pSchemeCodeCount)!=0){
              this.commonService.showWarningMessage("Fixed Deposit Code Already Exists.");
              this.fdNameAndCode.fdNameAndCodeform.controls.pFdcode.setValue("");
              this.fdNameAndCode.fdNameAndCodeform.controls.pFdnamecode.setValue("");
              this.fdNameAndCode.fdNameAndCode="";
            }
           else if(Number(res.pSchemeCount)!=0){
              this.commonService.showWarningMessage("Fixed Deposit Name Already Exists.");
              this.fdNameAndCode.fdNameAndCodeform.controls.pFdcode.setValue("");
              this.fdNameAndCode.fdNameAndCodeform.controls.pFdname.setValue("");
              this.fdNameAndCode.fdNameAndCodeform.controls.pFdnamecode.setValue("");
              this.fdNameAndCode.fdNameAndCode="";
              this.fdNameAndCode.formValidationMessages.pFdcode=null;
           }
        }
        })
        }
      }
     
    }
    /**--------(End)------Saving 1st tab (FD name and code) ----------(End)--------- */

    /**--------(Start)------Saving 2nd tab (FD Configuration) ----------(Start)---------
     * -------> Here 2nd tab is grid type. So here we are chekcing two conditions.
     *          One is if grid length > 0 and another is if grid length is zero
     */
    else if (this.Title == "FD Configuration") 
    {
      debugger
      this.forButtons = true;
      this.maxInterestrateto=0;
      this.maxinvestmentperiodto=0;
      this._rdfdservice.getTitleOnClick(this.selectedtype);
      if(this.fdConfiguration.DepositGridData.length<=0){
        this.commonService.showWarningMessage('Add Atleast One Item to Grid.');
        return;
      }
      if ((this.fdConfiguration.DepositGridData &&
        this.fdConfiguration.DepositGridData.length > 0)) {

        if (this.pFdnamecode && this.pFdname) {

          let obj = {
            pFdnamecode: this.pFdnamecode,
            pFdname: this.pFdname,
            pCreatedby: this.commonService.pCreatedby,
            pStatusname: this.commonService.pStatusname,
            ptypeofoperation: this.commonService.ptypeofoperation,
            pFdconfigid: this.pFdconfigid
          }
          let data = this.fdConfiguration.fdConfigurationForm.value;
          for (let i = 0; i < this.fdConfiguration.DepositGridData.length; i++) {
            this.fdConfiguration.DepositGridData[i].pinterestamount = this.fdConfiguration.DepositGridData[i].pinterestamount ? Number((this.fdConfiguration.DepositGridData[i].pinterestamount.toString()).replace(/,/g, "")) : 0;
            this.fdConfiguration.DepositGridData[i].pdepositamount = this.fdConfiguration.DepositGridData[i].pdepositamount ? Number((this.fdConfiguration.DepositGridData[i].pdepositamount.toString()).replace(/,/g, "")) : 0;
            this.fdConfiguration.DepositGridData[i].pmaturityamount = this.fdConfiguration.DepositGridData[i].pmaturityamount ? Number((this.fdConfiguration.DepositGridData[i].pmaturityamount.toString()).replace(/,/g, "")) : 0;
            this.fdConfiguration.DepositGridData[i].ptenure = this.fdConfiguration.DepositGridData[i].ptenure ? Number((this.fdConfiguration.DepositGridData[i].ptenure.toString()).replace(/,/g, "")) : 0;
            this.fdConfiguration.DepositGridData[i].pPayindenomination = this.fdConfiguration.DepositGridData[i].pPayindenomination ? Number((this.fdConfiguration.DepositGridData[i].pPayindenomination.toString()).replace(/,/g, "")) : 0;
            this.fdConfiguration.DepositGridData[i].pMininstalmentamount = this.fdConfiguration.DepositGridData[i].pMininstalmentamount ? Number((this.fdConfiguration.DepositGridData[i].pMininstalmentamount.toString()).replace(/,/g, "")) : 0;
            this.fdConfiguration.DepositGridData[i].pMaxinstalmentamount = this.fdConfiguration.DepositGridData[i].pMaxinstalmentamount ? Number((this.fdConfiguration.DepositGridData[i].pMaxinstalmentamount.toString()).replace(/,/g, "")) : 0;
          }
          this.fdConfiguration.fdConfigurationForm.value.lstFDConfigartionDetailsDTO = this.fdConfiguration.DepositGridData;

          // getting max interest rate and max investment period form List of records for 3td tab conditions (changes based on KT session on 21-05-2021)
          //start
          this.maxInterestrateto=this.fdConfiguration.DepositGridData.reduce((max, p) => p.pInterestrateto > max ? p.pInterestrateto : max, this.fdConfiguration.DepositGridData[0].pInterestrateto);
          this.fdConfiguration.DepositGridData.filter(function(row){
            if ((row.pInvestmentperiodto.indexOf('D')) > -1 && (row.pInvestmentperiodto.indexOf('M')) > -1 &&(row.pInvestmentperiodto.indexOf('Y') > -1))
              {
              row.Totalnooftodays = ( (row.pInvestmentperiodto.split(' ')[0].slice(0, -1)) * 365)+
             ((row.pInvestmentperiodto.split(' ')[1].slice(0, -1)) * 30)+
            (Number((row.pInvestmentperiodto.split(' ')[2].slice(0, -1))));
          }
           else if ((row.pInvestmentperiodto.indexOf('D') > -1) && (row.pInvestmentperiodto.indexOf('M') > -1))
              {
              row.Totalnooftodays =((row.pInvestmentperiodto.split(' ')[0].slice(0, -1)) * 30)+
            (Number((row.pInvestmentperiodto.split(' ')[1].slice(0, -1))));
          }
          else if ((row.pInvestmentperiodto.indexOf('D') > -1) && (row.pInvestmentperiodto.indexOf('Y') > -1))
              {
              row.Totalnooftodays = ( (row.pInvestmentperiodto.split(' ')[0].slice(0, -1)) * 365)+
            (Number((row.pInvestmentperiodto.split(' ')[1].slice(0, -1))));
          }
          else if ((row.pInvestmentperiodto.indexOf('M')) > -1 &&(row.pInvestmentperiodto.indexOf('Y') > -1))
              {
              row.Totalnooftodays = ( (row.pInvestmentperiodto.split(' ')[0].slice(0, -1)) * 365)+
             ((row.pInvestmentperiodto.split(' ')[1].slice(0, -1)) * 30);
          }
           else if ((row.pInvestmentperiodto.indexOf('D') > -1))
              {
              row.Totalnooftodays =(Number((row.pInvestmentperiodto.split(' ')[0].slice(0, -1))));
          }
           else if ((row.pInvestmentperiodto.indexOf('M') > -1))
              {
              row.Totalnooftodays = Number((row.pInvestmentperiodto.split(' ')[0].slice(0, -1)) * 30);
          }
           else if ((row.pInvestmentperiodto.indexOf('Y') > -1))
              {
              row.Totalnooftodays =(Number((row.pInvestmentperiodto.split(' ')[0].slice(0, -1)) * 365));
          }
          else{
            row.Totalnooftodays=0;
          }
          
          })
          this.maxinvestmentperiodto=this.fdConfiguration.DepositGridData.reduce((max, p) => p.Totalnooftodays > max ? p.Totalnooftodays : max, this.fdConfiguration.DepositGridData[0].Totalnooftodays);

           this.fdLoanAndFacility.maxinvestmentperiodto=this.maxinvestmentperiodto;
          this.fdLoanAndFacility.maxInterestrateto=this.maxInterestrateto;
          //end
          let totalData = { ...data, ...obj };
          this.buttonName = 'Processing';
          this.isLoading = true;
          let str=JSON.stringify(totalData)
          console.log(str)
          //console.log(totalData)
          this._rdfdservice.saveFdConfigurationDetails(totalData).subscribe((response: any) => {
            this.buttonName = 'Save & Continue';
            this.isLoading = false;
            if (response) {
              let str = "fdLoanFacility";
              $('.nav-item a[href="#' + str + '"]').tab('show');
              this.selectedtype = "FD Loan Facility and Pre-Maturity";
              this.Title = "FD Loan Facility and Pre-Maturity";
              this._rdfdservice.getTitleOnClick(this.selectedtype)
            }
          }, (error) => {
            this.buttonName = 'Save & Continue';
            this.isLoading = false;
          })


          if (this.totalData && this.totalData.pFDname && this.totalData.pFdnamecode) {
            /**------>Calling 3rd tab GET API----------- */
            this.getFdLoanFacilityDetails();
          }
        }

      }
      else {
        if (this.pFdnamecode && this.pFdname) {

          let obj = {
            pFdnamecode: this.pFdnamecode,
            pFdconfigid: this.pFdconfigid,
            pFdname: this.pFdname,
            pCreatedby: this.commonService.pCreatedby,
            pStatusname: this.commonService.pStatusname,
            ptypeofoperation: this.commonService.ptypeofoperation
          }
          let data = this.fdConfiguration.fdConfigurationForm.value;
          for (let i = 0; i < this.fdConfiguration.DepositGridData.length; i++) {
            this.fdConfiguration.DepositGridData[i].pinterestamount = this.fdConfiguration.DepositGridData[i].pinterestamount ? Number((this.fdConfiguration.DepositGridData[i].pinterestamount.toString()).replace(/,/g, "")) : 0;
            this.fdConfiguration.DepositGridData[i].pdepositamount = this.fdConfiguration.DepositGridData[i].pdepositamount ? Number((this.fdConfiguration.DepositGridData[i].pdepositamount.toString()).replace(/,/g, "")) : 0;
            this.fdConfiguration.DepositGridData[i].pmaturityamount = this.fdConfiguration.DepositGridData[i].pmaturityamount ? Number((this.fdConfiguration.DepositGridData[i].pmaturityamount.toString()).replace(/,/g, "")) : 0;
            this.fdConfiguration.DepositGridData[i].ptenure = this.fdConfiguration.DepositGridData[i].ptenure ? Number((this.fdConfiguration.DepositGridData[i].ptenure.toString()).replace(/,/g, "")) : 0;
            this.fdConfiguration.DepositGridData[i].pPayindenomination = this.fdConfiguration.DepositGridData[i].pPayindenomination ? Number((this.fdConfiguration.DepositGridData[i].pPayindenomination.toString()).replace(/,/g, "")) : 0;
            this.fdConfiguration.DepositGridData[i].pMininstalmentamount = this.fdConfiguration.DepositGridData[i].pMininstalmentamount ? Number((this.fdConfiguration.DepositGridData[i].pMininstalmentamount.toString()).replace(/,/g, "")) : 0;
            this.fdConfiguration.DepositGridData[i].pMaxinstalmentamount = this.fdConfiguration.DepositGridData[i].pMaxinstalmentamount ? Number((this.fdConfiguration.DepositGridData[i].pMaxinstalmentamount.toString()).replace(/,/g, "")) : 0;
          }
          this.fdConfiguration.fdConfigurationForm.value.lstFDConfigartionDetailsDTO = this.fdConfiguration.DepositGridData;
          let totalData = { ...data, ...obj };
          this.buttonName = 'Processing';
          this.isLoading = true;
          this._rdfdservice.saveFdConfigurationDetails(totalData).subscribe((response: any) => {
            this.buttonName = 'Save & Continue';
            this.isLoading = false;
            if (response) {
              let str = "fdLoanFacility";
              $('.nav-item a[href="#' + str + '"]').tab('show');
              this.selectedtype = "FD Loan Facility and Pre-Maturity";
              this.Title = "FD Loan Facility and Pre-Maturity";
              this._rdfdservice.getTitleOnClick(this.selectedtype)
            }
          }, (error) => {
            this.buttonName = 'Save & Continue';
            this.isLoading = false;
          })
          if (this.totalData && this.totalData.pFDname && this.totalData.pFdnamecode) {
            /**------>Calling 3rd tab GET API----------- */
            this.getFdLoanFacilityDetails();
          }
        }
      }
    }
    /**--------(End)------Saving 2nd tab (FD Configuration) ----------(End)--------- */

    /**--------(Start)------Saving 3rd tab (FD Loan Facility and Pre-Maturity) ----------(Start)--------- */
    else if (this.Title == "FD Loan Facility and Pre-Maturity") 
    {
      debugger
      this.forButtons = true;
      // if(this.fdLoanAndFacility.Griddata.length>0){
      this.fdLoanAndFacility.fdloanfacilityform.value._FixedDepositPrematurityInterestPercentages = this.fdLoanAndFacility.Griddata;
     // }
      let data = this.fdLoanAndFacility.fdloanfacilityform.value;
      // data.pAgeperiod = data.pAgeperiod ? Number((data.pAgeperiod.toString()).replace(/,/g, "")) : 0;
      // data.pPrematuretyageperiod = data.pPrematuretyageperiod ? Number((data.pPrematuretyageperiod.toString()).replace(/,/g, "")) : 0;
      // data.pLatefeepayblevalue = data.pLatefeepayblevalue ? Number((data.pLatefeepayblevalue.toString()).replace(/,/g, "")) : 0;
       data.pAgeperiod = data.pAgeperiod ? Number((data.pAgeperiod.toString()).replace(/,/g, "")) : 0;
      data.pAgeperiodtype = data.pAgeperiodtype ? data.pAgeperiodtype : '';
       data.pLatefeeapplicablefrom = data.pLatefeeapplicablefrom ? data.pLatefeeapplicablefrom : 0;
      data.pPrematuretyageperiodtype = data.pPrematuretyageperiodtype ? data.pPrematuretyageperiodtype : '';
      data.pTypeofOperation = data.pTypeofOperation ? data.pTypeofOperation : 'CREATE';
      data.pPrematuretyageperiod = data.pPrematuretyageperiod ? Number((data.pPrematuretyageperiod.toString()).replace(/,/g, "")) : 0;
      data.pLatefeepayblevalue = data.pLatefeepayblevalue ? Number((data.pLatefeepayblevalue.toString()).replace(/,/g, "")) : 0;
      this.fdLoanAndFacility.Validaations('REMOVE');
        let isValid = true;
      if(this.fdLoanAndFacility.checkValidations(this.fdLoanAndFacility.fdloanfacilityform,isValid)){

        // condition commented as per QC team on 26-05-21

        // let pIsprematuretylockingperiod=this.fdLoanAndFacility.fdloanfacilityform.controls.pIsprematuretylockingperiod.value;
        // if(pIsprematuretylockingperiod){
        // if(this.fdLoanAndFacility.Griddata.length==0){
        //   this.commonService.showWarningMessage('Add Atleast One Item to Grid');
        //   return;
        // }
        // }
      if (this.pFdconfigid && this.pFdname) {

        let obj = {
          pFdnamecode: this.pFdnamecode,
          pFdconfigid: this.pFdconfigid,
          pFdname: this.pFdname,
          pCreatedby: this.commonService.pCreatedby,
          pStatusname: this.commonService.pStatusname,
          ptypeofoperation: this.commonService.ptypeofoperation
        }
        // this.fdLoanAndFacility.fdloanfacilityform.value._FixedDepositPrematurityInterestPercentages = this.fdLoanAndFacility.Griddata;
        let totalData = { ...obj, ...data };
        this.buttonName = 'Processing';
        this.isLoading = true;
        totalData.pEligiblepercentage = totalData.pEligiblepercentage ? totalData.pEligiblepercentage : 0;
       
        let loandata=JSON.stringify(totalData)
        console.log(loandata);
        debugger;
        this._rdfdservice.saveFdLoanFacilityDetails(totalData).subscribe((response: any) => {
          this.buttonName = 'Save';
          this.isLoading = false;
          if (response) {
            let str = "fdIdentification";
            $('.nav-item a[href="#' + str + '"]').tab('show');
            this.selectedtype = "FD Identification Documents";
            this.Title = "FD Identification Documents";
            this._rdfdservice.getTitleOnClick(this.selectedtype)
          }
        }, (error) => {
          this.buttonName = 'Save & Continue';
          this.isLoading = false;
        })
        /**------------ For getting Identification documents (4th tab)---------
           * ----> Here there is no condition for Identification documents. Because we need 
           *       these documents for create time and as well as edit time. 
           * ----> Because this API is only giving Documents for creating. Previously these 
           *       documents are comimg from _savingaccountconfigService this Service.
           *       So in RD we have seperate API for getting documents
           */
        this.getFdIdentificationDetails();
      }
    }
    }
    /**--------(End)------Saving 3rd tab (FD Loan Facility and Pre-Maturity) ----------(End)--------- */

    /**--------(Start)------Saving 4th tab (FD Identification Documents) ----------(Start)--------- */
    else if (this.Title == "FD Identification Documents") 
    {
      debugger
      this.forButtons = false;
      if (this.pFdconfigid && this.pFdname) {

        let tempArr = [];
        let obj = {
          ptypeofoperation: this.commonService.ptypeofoperation,
          pStatusname: this.commonService.pStatusname,
          pCreatedby: this.commonService.pCreatedby,
          pDocumentsList: this.fdIndentification.childIndentificationData
        }
        tempArr.push(obj)

        let data = {
          pFdconfigid: this.pFdconfigid,
          pFdname: this.pFdname,
          pFdnamecode: this.pFdnamecode,
          pCreatedby: this.commonService.pCreatedby,
          identificationdocumentsList: this.fdIndentification.identificationDocComponent.LoanDoucments,
        }
        if (this.identificationDocComponent) {
          this.identificationDocComponent.forButtons = false;
        }

        this.buttonName = 'Processing';
        this.isLoading = true;
        this._rdfdservice.saveFdIndentificationDetails(data).subscribe((response: any) => 
        {
          debugger
          console.log("saved",response)
          this.buttonName = 'Save & Continue';

          this.isLoading = false;
          if (response) 
          {
            if(this.buttonStatus=='Update'){
             this.commonService.showInfoMessage("Updated Succesfully")
            }
            else{
            this.commonService.showInfoMessage("Saved Succesfully")
            }
            this.router.navigateByUrl('/FdView')
            
          }
        }, (error) => {
          this.buttonName = 'Save';
          this.isLoading = false;
        })
        // if (this.totalData && this.totalData.pFDname && this.totalData.pFdnamecode) {
        //   /**------>Calling 5th tab GET API----------- */
        //   //this.getFdReferralCommissionDetails();
        // }
      }
    }
    /**--------(End)------Saving 4th tab (FD Identification Documents) ----------(End)--------- */

    /**--------(Start)------Saving 5th tab (FD Referral Commision) ----------(Start)--------- */
    // else {
    //   this.forButtons = true;
    //   if (this.pFdconfigid && this.pFdname) {
    //     this.fdRefferalCommission.refferalForm.value.pIsreferralcommissionapplicable = !this.fdRefferalCommission.notApplicableFlag;
    //     let data = this.fdRefferalCommission.refferalForm.value;
    //     data.pFdconfigid = this.pFdconfigid;
    //     data.pFdname = this.pFdname;
    //     data.pFdnamecode = this.pFdnamecode;
    //     data.pCommissionValue = data.pCommissionValue ? Number((data.pCommissionValue.toString()).replace(/,/g, "")) : 0;
    //     let obj = {
    //       pCreatedby: this.commonService.pCreatedby,
    //       pStatusname: this.commonService.pStatusname,
    //       ptypeofoperation: this.commonService.ptypeofoperation
    //     }
    //     let totalData = { ...obj, ...data };
    //     this.buttonName = 'Processing';
    //     this.isLoading = true;
    //     totalData.pTdspercentage = totalData.pTdspercentage ? totalData.pTdspercentage : 0;
    //     this._rdfdservice.saveFdRefferalDetails(totalData).subscribe((response: any) => {
    //       this.buttonName = 'Save';
    //       this.isLoading = false;
    //       if (response) {
    //         this.router.navigateByUrl('/FdView')
    //       }
    //     }, (error) => {
    //       this.buttonName = 'Save';
    //       this.isLoading = false;
    //     })
    //   }
    // }
    /**--------(End)------Saving 5th tab (FD Referral Commision) ----------(End)--------- */
  }
  /**-----(End)-----Saving each tab (Save button functionality)---------------(End)------- */

  /**------(Start)---- For 1st tab GET API -------------------(Start)------------- */
  getFdNameAndCodeDetails() {
    if (this.pFdname && this.pFdnamecode) {
      this.buttonName = 'Processing';
      this.isLoading = true;
      this._rdfdservice.getFdNameAndCode(this.pFdname, this.pFdnamecode).subscribe((resposne: any) => {
        this.buttonName = 'Save & Continue';
        this.isLoading = false;
        if (resposne) {
          resposne.pCreatedby = this.commonService.pCreatedby;
          this.fdNameAndCode.fdNameAndCodeform.patchValue(resposne);
          this.fdNameAndCode.fdNameAndCode = resposne.pFdnamecode;
        }
      }, (error) => {
        this.buttonName = 'Save & Continue';
        this.isLoading = false;
      })
    }
  }
  /**------(End)---- For 1st tab GET API -------------------(End)------------- */

  /**------(Start)---- For 2nd tab GET API -------------------(Start)------------- */
  getFdConfigurationDetails() 
  {
    debugger
    if (this.pFdname && this.pFdnamecode) {
      this.buttonName = 'Processing';
      this.isLoading = true;
      this._rdfdservice.getFdConfigurationDetails(this.pFdname, this.pFdnamecode).subscribe((resposne: any) =>
       {
         debugger
         console.log(resposne)
        this.buttonName = 'Save & Continue';
        this.isLoading = false;
        if (resposne) {
          resposne.pCreatedby = this.commonService.pCreatedby;
          for (let i = 0; i < resposne.lstFDConfigartionDetailsDTO.length; i++) {
            resposne.lstFDConfigartionDetailsDTO[i].pinterestamount = resposne.lstFDConfigartionDetailsDTO[i].pinterestamount ? this.commonService.currencyformat(resposne.lstFDConfigartionDetailsDTO[i].pinterestamount) : 0;
            resposne.lstFDConfigartionDetailsDTO[i].pdepositamount = resposne.lstFDConfigartionDetailsDTO[i].pdepositamount ? this.commonService.currencyformat(resposne.lstFDConfigartionDetailsDTO[i].pdepositamount) : 0;
            resposne.lstFDConfigartionDetailsDTO[i].pmaturityamount = resposne.lstFDConfigartionDetailsDTO[i].pmaturityamount ? this.commonService.currencyformat(resposne.lstFDConfigartionDetailsDTO[i].pmaturityamount) : 0;
            resposne.lstFDConfigartionDetailsDTO[i].ptenure = resposne.lstFDConfigartionDetailsDTO[i].ptenure ? this.commonService.currencyformat(resposne.lstFDConfigartionDetailsDTO[i].ptenure) : 0;
            resposne.lstFDConfigartionDetailsDTO[i].pPayindenomination = resposne.lstFDConfigartionDetailsDTO[i].pPayindenomination ? this.commonService.currencyformat(resposne.lstFDConfigartionDetailsDTO[i].pPayindenomination) : 0;
            resposne.lstFDConfigartionDetailsDTO[i].pMininstalmentamount = resposne.lstFDConfigartionDetailsDTO[i].pMininstalmentamount ? this.commonService.currencyformat(resposne.lstFDConfigartionDetailsDTO[i].pMininstalmentamount) : 0;
            resposne.lstFDConfigartionDetailsDTO[i].pMaxinstalmentamount = resposne.lstFDConfigartionDetailsDTO[i].pMaxinstalmentamount ? this.commonService.currencyformat(resposne.lstFDConfigartionDetailsDTO[i].pMaxinstalmentamount) : 0;
            resposne.lstFDConfigartionDetailsDTO[i].pRatepersquareyard = resposne.lstFDConfigartionDetailsDTO[i].pRatepersquareyard ? this.commonService.currencyformat(resposne.lstFDConfigartionDetailsDTO[i].pRatepersquareyard) : 0;
            resposne.lstFDConfigartionDetailsDTO[i].pMultiplesofamount = resposne.lstFDConfigartionDetailsDTO[i].pMultiplesofamount ? this.commonService.currencyformat(resposne.lstFDConfigartionDetailsDTO[i].pMultiplesofamount) : 0;
          }
          this.fdConfiguration.gridViewDeposite = resposne.lstFDConfigartionDetailsDTO;
          this.fdConfiguration.DepositGridData = resposne.lstFDConfigartionDetailsDTO;
        }
      }, (error) => {
        this.buttonName = 'Save & Continue';
        this.isLoading = false;
      })
    }
  }
  /**------(End)---- For 2nd tab GET API -------------------(End)------------- */

  /**------(Start)---- For 3rd tab GET API -------------------(Start)------------- */
  getFdLoanFacilityDetails() 
  {
    debugger
    if (this.pFdname && this.pFdnamecode) {
      this.buttonName = 'Processing';
      this.isLoading = true;
      this._rdfdservice.getFdLoanAndFacilityDetails(this.pFdname, this.pFdnamecode).subscribe((resposne: any) => {
        this.buttonName = 'Save & Continue';
        debugger
        console.log(resposne)
        this.isLoading = false;
        if (resposne) 
        {

        
          resposne.pCreatedby = this.commonService.pCreatedby;
          if (resposne.pIsloanfacilityapplicable) {
            this.fdLoanAndFacility.isloanage = true;
          }
          else {
            this.fdLoanAndFacility.isloanage = false;
          }
          // if (resposne.pIsloanageperiod) {
          //   this.fdLoanAndFacility.isloanage = true;
          // }
          // else {
          //   this.fdLoanAndFacility.isloanage = false;
          // }
          if (resposne.pIsprematuretylockingperiod) {
            this.fdLoanAndFacility.islockin = true;
            this.fdLoanAndFacility.islockintest=true;
            this.fdLoanAndFacility.Griddata= resposne._FixedDepositPrematurityInterestPercentages
          }
          else {
            this.fdLoanAndFacility.islockin = false;
          }
          if (resposne.pIslatefeepayble) {
            this.fdLoanAndFacility.islatefeeapplicable = true;
          }
          else {
            this.fdLoanAndFacility.islatefeeapplicable = false;
          }
          resposne.pAgeperiod = resposne.pAgeperiod ? this.commonService.currencyformat(resposne.pAgeperiod) : 0;
          resposne.pPrematuretyageperiod = resposne.pPrematuretyageperiod ? this.commonService.currencyformat(resposne.pPrematuretyageperiod) : 0;
          resposne.pLatefeepayblevalue = resposne.pLatefeepayblevalue ? this.commonService.currencyformat(resposne.pLatefeepayblevalue) : 0;
          if (resposne.pLatefeepaybletype == 'comfixed' || resposne.pLatefeepaybletype == null) {
            this.fdLoanAndFacility.forFixed = true;
            this.fdLoanAndFacility.forPercentage = false;
          }
          else {
            this.fdLoanAndFacility.forFixed = false;
            this.fdLoanAndFacility.forPercentage = true;
          }
          this.fdLoanAndFacility.maxinvestmentperiodto=this.maxinvestmentperiodto;
          this.fdLoanAndFacility.maxInterestrateto=this.maxInterestrateto;
          this.fdLoanAndFacility.fdloanfacilityform.patchValue(resposne);
          this.fdLoanAndFacility.ValidateLoanFacility();
          this.fdLoanAndFacility.ValidateLockinperiod();
          this.fdLoanAndFacility.ValidateLateFeeApplicable();
        }
      }, (error) => {
        this.buttonName = 'Save & Continue';
        this.isLoading = false;
      })
    }
  }
  /**------(End)---- For 3rd tab GET API -------------------(End)------------- */

  /**------(Start)---- For 4th tab GET API -------------------(Start)------------- */
  getFdIdentificationDetails() {
    if (this.pFdname && this.pFdnamecode) {
      this.buttonName = 'Processing';
      this.isLoading = true;
      this._rdfdservice.getFdIdentificationDetails(this.pFdname, this.pFdnamecode).subscribe((resposne: any) => {
        this.buttonName = 'Save';
        this.isLoading = false;
        if (resposne) {
          resposne.pCreatedby = this.commonService.pCreatedby;
          this.fdIndentification.childIndentificationData = resposne.identificationdocumentsList[0].pDocumentsList;
          this.fdIndentification.identificationDocComponent.LoanDoucments = resposne.identificationdocumentsList;
        }
      }, (error) => {
        this.buttonName = 'Save';
        this.isLoading = false;
      })
    }
  }
  /**------(End)---- For 4th tab GET API -------------------(End)------------- */

  /**------(Start)---- For 5th tab GET API -------------------(Start)------------- */
  getFdReferralCommissionDetails() {
    if (this.pFdname && this.pFdnamecode) {
      this.buttonName = 'Processing';
      this.isLoading = true;
      this._rdfdservice.getFdReferralDetails(this.pFdname, this.pFdnamecode).subscribe((resposne: any) => {
        this.buttonName = 'Save';
        this.isLoading = false;
        if (resposne) {
          resposne.pCreatedby = this.commonService.pCreatedby;
          resposne.pCommissionValue = resposne.pCommissionValue ? this.commonService.currencyformat(resposne.pCommissionValue) : 0;
          this.fdRefferalCommission.notApplicableFlag = !resposne.pIsreferralcommissionapplicable;
          this.fdRefferalCommission.tdsshow = resposne.pIstdsapplicable;
          if (resposne.pReferralcommissiontype == "percentage") {
            this.fdRefferalCommission.forPercentage = true;
            this.fdRefferalCommission.forFixed = false;
          }
          else {
            this.fdRefferalCommission.forPercentage = false;
            this.fdRefferalCommission.forFixed = true;
          }
          this.fdRefferalCommission.refferalForm.patchValue(resposne);
        }
      }, (error) => {
        this.buttonName = 'Save';
        this.isLoading = false;
      })
    }
  }
  /**------(End)---- For 5th tab GET API -------------------(End)------------- */

  /**------(Start)---- For clear button -------------------(Start)------------- */
  forClear() {
    if (this.selectedtype == "FD Name and Code") {
      this.fdNameAndCode.ngOnInit();
    }
    else if (this.selectedtype == 'FD Configuration') {
      this.fdConfiguration.ngOnInit();
    }
    else if (this.selectedtype == 'FD Loan Facility and Pre-Maturity') {
      this.fdLoanAndFacility.ngOnInit();
    }
    else if (this.selectedtype == 'FD Identification Documents') {
      this.fdIndentification.ngOnInit();
    }
    else {
      this.fdRefferalCommission.ngOnInit();
    }
  }
  /**------(End)---- For clear button -------------------(End)------------- */

  back(){
    debugger;
    this.router.navigate(['/FdView']);
  }
}


