import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FdRdServiceService } from 'src/app/Services/Banking/fd-rd-service.service';
import { RdnameandcodeComponent } from './rdnameandcode.component';
import { RdconfigurationComponent } from './rdconfiguration.component';
import { ToastrService } from 'ngx-toastr';
import { RdloanandfacilityComponent } from './rdloanandfacility.component';
import { RdidentificationComponent } from './rdidentification.component';
import { ReferralCommissionComponent } from '../Savings-AC/referral-commission.component';
import { CommonService } from 'src/app/Services/common.service';
import { IdentificationDocumentsComponent } from 'src/app/UI/Common/identification-documents/identification-documents.component';
import { RdrefferalcommisionComponent } from './rdrefferalcommision.component';
import { Router, ActivatedRoute } from '@angular/router';
declare let $: any;
@Component({
  selector: 'app-rdconfig-new',
  templateUrl: './rdconfig-new.component.html',
  styles: []
})
export class RdconfigNewComponent implements OnInit {

  @ViewChild(RdnameandcodeComponent, { static: false }) Rdnameandcode: RdnameandcodeComponent;
  @ViewChild(RdconfigurationComponent, { static: false }) Rdconfiguration: RdconfigurationComponent;
  @ViewChild(RdloanandfacilityComponent, { static: false }) rdLoanAndFacility: RdloanandfacilityComponent;
  @ViewChild(RdidentificationComponent, { static: false }) rdIndentification: RdidentificationComponent;
  @ViewChild(RdrefferalcommisionComponent, { static: false }) rdRefferalCommission: RdrefferalcommisionComponent;
  @ViewChild(IdentificationDocumentsComponent, { static: false }) identificationDocComponent: IdentificationDocumentsComponent;

  selectedtype: any;
  Title: any;
  path: any;
  pRdconfigid: any;
  pRdnamecode: any;
  pRdname: any;
  totalData: any;
buttonStatus='Save';
  forButtons: boolean = true;
  forDisableTabs: boolean = true;
  isLoading: boolean = false;
  maxInterestrateto:any;
  maxinvestmentperiodto:any;

  //buttonName: string = 'Save';
  buttonName: string = 'Save & Continue';
  constructor(private _rdfdservice: FdRdServiceService,
    private commonService: CommonService,
    private toastr: ToastrService,
     private router: Router,
    private _route: ActivatedRoute) {
  }

  ngOnInit() {
    debugger
    this.forDisableTabs = true;
     this.maxInterestrateto=0;
     this.maxinvestmentperiodto=0;
    /**---> Showing default 1st tab. It means RD Name and code */
    this.selectedtype = "RD Name and Code"
    this._rdfdservice.getTitleOnClick(this.selectedtype);
     if (this._route.snapshot.params['id']) {
      this.buttonStatus="Update";
    }
    else{
      this.buttonStatus='Save'
    }
  }

  /**-------(Start)-----When we click on tabs means 1,2 etc.. It will call -------(Start)----------
   * -----> Based on tab title we will call GET API's of that particular tab
   */
  ShowTitle(title) {
    this.selectedtype = title;
    /**-----(Start)--> Here we forButtons boolean for hide buttons in <identifications> component----(Start)--- */
    if (title == 'Identification Documents') {
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
    if (title == 'RD Name and Code') {
      this.getRdNameAndCodeDetails();
    }
    else if (title == 'RD Configuration') {
      this.getRdConfigurationDetails();
    }
    else if (title == 'Loan Facility and Pre-Maturity') {
      this.getRdLoanFacilityDetails();
    }
    else if (title == 'Identification Documents') {
      this.getRdIdentificationDetails();
    }
    else {
      this.getRdReferralCommissionDetails();
    }
  }
  /**-------(End)-----When we click on tabs means 1,2 etc.. It will call -------(End)---------- */

  /**----(Start)------ This method will call when we will click on right side drop down ----(Start)--- 
   * ---> Here also we will call GET API's of particulat tab based on that particular Tab Title
  */
  testlinks(data, type) {
    let str = data

    this.path = data
    this.selectedtype = type;
    this._rdfdservice.getTitleOnClick(this.selectedtype)
    $('.nav-item a[href="#' + str + '"]').tab('show');
    if (type == 'RD Name and Code') {
      this.getRdNameAndCodeDetails();
    }
    else if (type == 'RD Configuration') {
      this.getRdConfigurationDetails();
    }
    else if (type == 'Loan Facility and Pre-Maturity') {
      this.getRdLoanFacilityDetails();
    }
    else if (type == 'Identification Documents') {
      this.getRdIdentificationDetails();
    }
    else {
      this.getRdReferralCommissionDetails();
    }
  }
  /**----(End)------ This method will call when we will click on right side drop down ----(End)--- */

  /**-----(Start)-----Saving each tab (Save button functionality)---------------(Start)------- */
  nextClick() {
    debugger;
    this.Title = this._rdfdservice.sendTitle();
    /**
     * --------(Start)------Saving 1st tab (RD name and code) ----------(Start)---------
     * -------> Here after saving 1st tab data, we are calling 2nd tab get API.
     *          Because we need pRdconfigid for remianing tabs saving API's.
     */
    if (this.Title == "RD Name and Code") {
      this.forButtons = true;
      let data = this.Rdnameandcode.Rdnameandcodeform.value;
      this.pRdname = this.Rdnameandcode.Rdnameandcodeform.value.pRdname;
      this.pRdnamecode = this.Rdnameandcode.Rdnameandcodeform.value.pRdnamecode;
      let RDconfigid=this.Rdnameandcode.Rdnameandcodeform.value.pRdconfigid;
      let RdCode=this.Rdnameandcode.Rdnameandcodeform.value.pRdcode;
       let isValid = true;
      if(this.Rdnameandcode.checkValidations(this.Rdnameandcode.Rdnameandcodeform,isValid)){
      if (this.Rdnameandcode.Rdnameandcodeform.valid) {
         this._rdfdservice.CheckRDNameCodeDuplicate(RDconfigid,this.pRdname,RdCode).subscribe(res=>{
           if(res.pSchemeCount==0 && res.pSchemeCodeCount==0){
        this.buttonName = 'Processing';
        this.isLoading = true;
        this._rdfdservice.saveRdNameAndCode(data).subscribe((response: any) => {
          this.buttonName = 'Save & Continue';
          this.isLoading = false;
          this.forDisableTabs = true;
          if (response) {
            this._rdfdservice.getRdConfigurationDetails(this.pRdname, this.pRdnamecode).subscribe((response: any) => {
              if (response) {
                this.pRdconfigid = response.pRdconfigid;
              }
            })
            let str = "rdconfig";
            $('.nav-item a[href="#' + str + '"]').tab('show');
            this.selectedtype = "RD Configuration";
            this.Title = "RD Configuration";
            this._rdfdservice.getTitleOnClick(this.selectedtype);
          }
        }, (error) => {
          this.buttonName = 'Save & Continue';
          this.isLoading = false;
          this.toastr.error("Something went wrong from server side, Please try after sometime", "Error!");
        });

        this.totalData = this.Rdnameandcode.totalData;
        /**
         * ----->This totalData is coming from RD name and code component while editing time.
         *       We are getting this data from Router params. By using ViewChild of 1st tab
         *       we are retrieving that data.
         * -----> By using this totalData we are calling next tab(2nd tab) GET API
         */
        if (this.totalData && this.totalData.pRdname && this.totalData.pRdnamecode) {
          this.pRdconfigid = this.totalData.pRdconfigid;
          this.pRdname = this.totalData.pRdname;
          this.pRdnamecode = this.totalData.pRdnamecode;
          this.getRdConfigurationDetails();
        }
           }
           else{
             if(res.pSchemeCodeCount!=0 ){
           this.commonService.showWarningMessage('Recurring Deposit Code Already Exists.')
           this.Rdnameandcode.Rdnameandcodeform.controls.pSeries.setValue('00001');
           this.Rdnameandcode.Rdnameandcodeform.controls.pRdcode.setValue('');
           this.Rdnameandcode.rdnameandcode="";
             }
             else if(res.pSchemeCount!=0 ){
           this.commonService.showWarningMessage('Recurring Deposit Name Already Exists.')
           this.Rdnameandcode.Rdnameandcodeform.controls.pSeries.setValue('00001');
           this.Rdnameandcode.Rdnameandcodeform.controls.pRdcode.setValue('');
           this.Rdnameandcode.Rdnameandcodeform.controls.pRdcode.clearValidators();
           this.Rdnameandcode.Rdnameandcodeform.controls.pRdcode.updateValueAndValidity();
           this.Rdnameandcode.rdnameandcode="";
             }

           }
        });
      }
    }
    }
    /**--------(End)------Saving 1st tab (RD name and code) ----------(End)--------- */

    /**--------(Start)------Saving 2nd tab (RD Configuration) ----------(Start)---------
     * -------> Here 2nd tab is grid type. So here we are chekcing two conditions.
     *          One is if grid length > 0 and another is if grid length is zero
     */
    else if (this.Title == "RD Configuration") {
      this.forButtons = true;
       this.maxInterestrateto=0;
      this.maxinvestmentperiodto=0;
      if(this.Rdconfiguration.DepositGridData.length<=0){
        this.commonService.showWarningMessage('Add Atleast One Item to Grid');
        return;
      }
      if ((this.Rdconfiguration.DepositGridData &&
        this.Rdconfiguration.DepositGridData.length > 0)) {
        if (this.pRdnamecode && this.pRdname) {
          let obj = {
            pRdconfigid: this.pRdconfigid,
            pRdname: this.pRdname,
            pRdnamecode: this.pRdnamecode,
            pCreatedby: this.commonService.pCreatedby,
            pStatusname: this.commonService.pStatusname,
            ptypeofoperation: this.commonService.ptypeofoperation
          }
          let data = this.Rdconfiguration.Rdconfigurationform.value;

          for (let i = 0; i < this.Rdconfiguration.DepositGridData.length; i++) {
            this.Rdconfiguration.DepositGridData[i].pInterestamount = this.Rdconfiguration.DepositGridData[i].pInterestamount ? Number((this.Rdconfiguration.DepositGridData[i].pInterestamount.toString()).replace(/,/g, "")) : 0;
            this.Rdconfiguration.DepositGridData[i].pDepositamount = this.Rdconfiguration.DepositGridData[i].pDepositamount ? Number((this.Rdconfiguration.DepositGridData[i].pDepositamount.toString()).replace(/,/g, "")) : 0;
            this.Rdconfiguration.DepositGridData[i].pMaturityamount = this.Rdconfiguration.DepositGridData[i].pMaturityamount ? Number((this.Rdconfiguration.DepositGridData[i].pMaturityamount.toString()).replace(/,/g, "")) : 0;
            this.Rdconfiguration.DepositGridData[i].pTenure = this.Rdconfiguration.DepositGridData[i].pTenure ? Number((this.Rdconfiguration.DepositGridData[i].pTenure.toString()).replace(/,/g, "")) : 0;
            this.Rdconfiguration.DepositGridData[i].pPayindenomination = this.Rdconfiguration.DepositGridData[i].pPayindenomination ? Number((this.Rdconfiguration.DepositGridData[i].pPayindenomination.toString()).replace(/,/g, "")) : 0;
            this.Rdconfiguration.DepositGridData[i].pMininstalmentamount = this.Rdconfiguration.DepositGridData[i].pMininstalmentamount ? Number((this.Rdconfiguration.DepositGridData[i].pMininstalmentamount.toString()).replace(/,/g, "")) : 0;
            this.Rdconfiguration.DepositGridData[i].pMaxinstalmentamount = this.Rdconfiguration.DepositGridData[i].pMaxinstalmentamount ? Number((this.Rdconfiguration.DepositGridData[i].pMaxinstalmentamount.toString()).replace(/,/g, "")) : 0;
            this.Rdconfiguration.DepositGridData[i].pPenaltyvalue = this.Rdconfiguration.DepositGridData[i].pPenaltyvalue ? Number((this.Rdconfiguration.DepositGridData[i].pPenaltyvalue.toString()).replace(/,/g, "")) : 0;
            // if(this.Rdconfiguration.DepositGridData[i].pTypeofOperation=='OLD')
            // {
            //   this.Rdconfiguration.DepositGridData[i].pTypeofOperation='UPDATE'
            // }
          }
          
          this.Rdconfiguration.Rdconfigurationform.value.lstRdConfigartionDetails = this.Rdconfiguration.DepositGridData;

           // getting max interest rate and max investment period form List of records for 3td tab conditions (changes based on KT session on 21-05-2021)
          //start
          this.maxInterestrateto=this.Rdconfiguration.DepositGridData.reduce((max, p) => p.pInterestrateto > max ? p.pInterestrateto : max, this.Rdconfiguration.DepositGridData[0].pInterestrateto);
          this.Rdconfiguration.DepositGridData.filter(function(row){
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
          this.maxinvestmentperiodto=this.Rdconfiguration.DepositGridData.reduce((max, p) => p.Totalnooftodays > max ? p.Totalnooftodays : max, this.Rdconfiguration.DepositGridData[0].Totalnooftodays);

           this.rdLoanAndFacility.maxInterestrateto=this.maxInterestrateto;
          this.rdLoanAndFacility.maxinvestmentperiodto=this.maxinvestmentperiodto;
          //end
          let totalData = { ...this.Rdconfiguration.Rdconfigurationform.value, ...obj }
          this.buttonName = 'Processing';
          this.isLoading = true;
          let dataresult=JSON.stringify(totalData)
          this._rdfdservice.saveRdConfigurationDetails(totalData).subscribe((response: any) => {
            this.buttonName = 'Save & Continue';
            this.isLoading = false;
            if (response) {
              let str = "loanfacility";
              $('.nav-item a[href="#' + str + '"]').tab('show');
              this.selectedtype = "Loan Facility and Pre-Maturity";
              this.Title = "Loan Facility and Pre-Maturity";
              this._rdfdservice.getTitleOnClick(this.selectedtype);
            }
          }, (error) => {
            this.buttonName = 'Save & Continue';
            this.isLoading = false;
          });
          if (this.totalData && this.totalData.pRdname && this.totalData.pRdnamecode) {
            /**------>Calling 3rd tab GET API----------- */
            this.getRdLoanFacilityDetails();
          }
        }
      }
      else {
        if (this.pRdnamecode && this.pRdname) {
          let obj = {
            pRdconfigid: this.pRdconfigid,
            pRdname: this.pRdname,
            pRdnamecode: this.pRdnamecode,
            pCreatedby: this.commonService.pCreatedby,
            pStatusname: this.commonService.pStatusname,
            ptypeofoperation: this.commonService.ptypeofoperation
          }
          let data = this.Rdconfiguration.Rdconfigurationform.value;
          for (let i = 0; i < this.Rdconfiguration.DepositGridData.length; i++) {
            this.Rdconfiguration.DepositGridData[i].pInterestamount = this.Rdconfiguration.DepositGridData[i].pInterestamount ? Number((this.Rdconfiguration.DepositGridData[i].pInterestamount.toString()).replace(/,/g, "")) : 0;
            this.Rdconfiguration.DepositGridData[i].pDepositamount = this.Rdconfiguration.DepositGridData[i].pDepositamount ? Number((this.Rdconfiguration.DepositGridData[i].pDepositamount.toString()).replace(/,/g, "")) : 0;
            this.Rdconfiguration.DepositGridData[i].pMaturityamount = this.Rdconfiguration.DepositGridData[i].pMaturityamount ? Number((this.Rdconfiguration.DepositGridData[i].pMaturityamount.toString()).replace(/,/g, "")) : 0;
            this.Rdconfiguration.DepositGridData[i].pTenure = this.Rdconfiguration.DepositGridData[i].pTenure ? Number((this.Rdconfiguration.DepositGridData[i].pTenure.toString()).replace(/,/g, "")) : 0;
            this.Rdconfiguration.DepositGridData[i].pPayindenomination = this.Rdconfiguration.DepositGridData[i].pPayindenomination ? Number((this.Rdconfiguration.DepositGridData[i].pPayindenomination.toString()).replace(/,/g, "")) : 0;
          }
          this.Rdconfiguration.Rdconfigurationform.value.lstDepositCalculationTables = this.Rdconfiguration.DepositGridData;
          for (let i = 0; i < this.Rdconfiguration.gridViewConfig.length; i++) {
            this.Rdconfiguration.gridViewConfig[i].pMininstalmentamount = this.Rdconfiguration.gridViewConfig[i].pMininstalmentamount ? Number((this.Rdconfiguration.gridViewConfig[i].pMininstalmentamount.toString()).replace(/,/g, "")) : 0;
            this.Rdconfiguration.gridViewConfig[i].pMaxinstalmentamount = this.Rdconfiguration.gridViewConfig[i].pMaxinstalmentamount ? Number((this.Rdconfiguration.gridViewConfig[i].pMaxinstalmentamount.toString()).replace(/,/g, "")) : 0;
          }
          this.Rdconfiguration.Rdconfigurationform.value.lstRdConfigartionDetails = this.Rdconfiguration.gridViewConfig;
          let totalData = { ...data, ...obj }
          this.buttonName = 'Processing';
          this.isLoading = true;
          debugger;
        let dataresult=JSON.stringify(totalData)
          this._rdfdservice.saveRdConfigurationDetails(totalData).subscribe((response: any) => {
            this.buttonName = 'Save & Continue';
            this.isLoading = false;
            if (response) {
              let str = "loanfacility";
              $('.nav-item a[href="#' + str + '"]').tab('show');
              this.selectedtype = "Loan Facility and Pre-Maturity";
              this.Title = "Loan Facility and Pre-Maturity";
              this._rdfdservice.getTitleOnClick(this.selectedtype);
              if (this.totalData && this.totalData.pRdname && this.totalData.pRdnamecode) {
                this.getRdLoanFacilityDetails();
              }
            }
          }, (error) => {
            this.buttonName = 'Save & Continue';
            this.isLoading = false;
          })
        }
      }
    }
    /**--------(End)------Saving 2nd tab (RD Configuration) ----------(End)--------- */

    /**--------(Start)------Saving 3rd tab (RD Loan Facility and Pre-Maturity) ----------(Start)--------- */
    else if (this.Title == "Loan Facility and Pre-Maturity") {
      debugger
      this.forButtons = true;
     // if(this.rdLoanAndFacility.Griddata.length>0){
       this.rdLoanAndFacility.Rdloanfacilityform.value._RecurringDepositPrematurityInterestPercentages = this.rdLoanAndFacility.Griddata;
    //  }
      let data = this.rdLoanAndFacility.Rdloanfacilityform.value;
      data.pAgeperiod = data.pAgeperiod ? Number((data.pAgeperiod.toString()).replace(/,/g, "")) : 0;
      data.pAgeperiodtype = data.pAgeperiodtype ? data.pAgeperiodtype : '';
       data.pLatefeeapplicablefrom = data.pLatefeeapplicablefrom ? data.pLatefeeapplicablefrom : 0;
      data.pPrematuretyageperiodtype = data.pPrematuretyageperiodtype ? data.pPrematuretyageperiodtype : '';
      data.pTypeofOperation = data.pTypeofOperation ? data.pTypeofOperation : 'CREATE';
       
      
      data.pPrematuretyageperiod = data.pPrematuretyageperiod ? Number((data.pPrematuretyageperiod.toString()).replace(/,/g, "")) : 0;
      data.pLatefeepayblevalue = data.pLatefeepayblevalue ? Number((data.pLatefeepayblevalue.toString()).replace(/,/g, "")) : 0;
       let isValid = true;
       this.rdLoanAndFacility.Validaations('REMOVE');
      if(this.rdLoanAndFacility.checkValidations(this.rdLoanAndFacility.Rdloanfacilityform,isValid)){
        // condition commented as per QC team on 26-05-21

        // let pIsprematuretylockingperiod=this.rdLoanAndFacility.Rdloanfacilityform.controls.pIsprematuretylockingperiod.value;
        // if(pIsprematuretylockingperiod){
        // if(this.rdLoanAndFacility.Griddata.length==0){
        //   this.commonService.showWarningMessage('Add Atleast One Item to Grid');
        //   return;
        // }
        // }
      if (this.pRdnamecode && this.pRdname) {

        let obj = {
          pRdconfigid: this.pRdconfigid,
          pRdname: this.pRdname,
          pRdnamecode: this.pRdnamecode,
          pCreatedby: this.commonService.pCreatedby,
          pStatusname: this.commonService.pStatusname,
          ptypeofoperation: this.commonService.ptypeofoperation
        }
        // this.rdLoanAndFacility.Rdloanfacilityform.value._RecurringDepositPrematurityInterestPercentages = this.rdLoanAndFacility.Griddata;
        let totalData = { ...obj, ...data };
        this.buttonName = 'Processing';
        this.isLoading = true;
        totalData.pEligiblepercentage = totalData.pEligiblepercentage ? totalData.pEligiblepercentage : 0;
        this._rdfdservice.saveRdConfigurationFacilityDetails(totalData).subscribe((response: any) => {
          this.buttonName = 'Save';
          this.isLoading = false;
          if (response) {
            let str = "mandatorykyc";
            $('.nav-item a[href="#' + str + '"]').tab('show');
            this.selectedtype = "Identification Documents";
            this.Title = "Identification Documents";
            this._rdfdservice.getTitleOnClick(this.selectedtype);

          }
        }, (error) => {
          this.buttonName = 'Save & Continue';
          this.isLoading = false;
        });
        /**------------ For getting Identification documents (4th tab)---------
            * ----> Here there is no condition for Identification documents. Because we need 
            *       these documents for create time and as well as edit time. 
            * ----> Because this API is only giving Documents for creating. Previously these 
            *       documents are comimg from _savingaccountconfigService this Service.
            *       So in RD we have seperate API for getting documents
            */
        this.getRdIdentificationDetails();
      }
      }
    }
    /**--------(End)------Saving 3rd tab (RD Loan Facility and Pre-Maturity) ----------(End)--------- */

    /**--------(Start)------Saving 4th tab (RD Identification Documents) ----------(Start)--------- */
    else if (this.Title == "Identification Documents") {
      this.forButtons = false;
      if (this.pRdnamecode && this.pRdname) {
        let tempArr = [];
        let obj = {
          ptypeofoperation: this.commonService.ptypeofoperation,
          pStatusname: this.commonService.pStatusname,
          pCreatedby: this.commonService.pCreatedby,
          pDocumentsList: this.rdIndentification.childIndentificationData
        }
        tempArr.push(obj)

        let data = {
          pRdconfigid: this.pRdconfigid,
          pRdname: this.pRdname,
          pRdnamecode: this.pRdnamecode,
          pCreatedby: this.commonService.pCreatedby,
          identificationdocumentsList: tempArr,
        }
        if (this.identificationDocComponent) {
          this.identificationDocComponent.forButtons = false;
        }
        this.buttonName = 'Processing';
        this.isLoading = true;
        let jsondata = JSON.stringify(data);
        this._rdfdservice.saveRdIndentificationDocuments(jsondata).subscribe((response: any) => {
          // this.buttonName = 'Next';
          // this.isLoading = false;
          // if (response) {
          //   let str = "refferral";
          //   $('.nav-item a[href="#' + str + '"]').tab('show');
          //   this.selectedtype = "Referral Commission";
          //   this.Title = "Referral Commission";
          //   this._rdfdservice.getTitleOnClick(this.selectedtype);
          // }
          this.buttonName = 'Save & Continue';
          this.isLoading = false;
          if (response) {
            if(this.buttonStatus=='Update')
{
     this.commonService.showInfoMessage("Updated Succesfully")
}   
else{
  this.commonService.showInfoMessage("Saved Succesfully")
}
         
            this.router.navigateByUrl('/RdView')
          }
        }, (error) => {
          this.buttonName = 'Save';
          this.isLoading = false;
        });
        // if (this.totalData && this.totalData.pRdname && this.totalData.pRdnamecode) {
        //   /**------>Calling 5th tab GET API----------- */
        //   this.getRdReferralCommissionDetails();
        // }
      }
    }
    /**--------(End)------Saving 4th tab (RD Identification Documents) ----------(End)--------- */

    /**--------(Start)------Saving 5th tab (RD Referral Commision) ----------(Start)--------- */
    else {
      this.forButtons = true;
      if (this.pRdnamecode && this.pRdname) {
        this.rdRefferalCommission.rdRefferalForm.value.pIsreferralcommissionapplicable = !this.rdRefferalCommission.notApplicableFlag;
        let data = this.rdRefferalCommission.rdRefferalForm.value;
        data.pRdconfigid = this.pRdconfigid;
        data.pRdname = this.pRdname;
        data.pRdnamecode = this.pRdnamecode;
        data.pCommissionValue = data.pCommissionValue ? Number((data.pCommissionValue.toString()).replace(/,/g, "")) : 0;
        let obj = {
          pCreatedby: this.commonService.pCreatedby,
          pStatusname: this.commonService.pStatusname,
          ptypeofoperation: this.commonService.ptypeofoperation
        }
        let totalData = { ...obj, ...data };
        this.buttonName = 'Processing';
        this.isLoading = true;
        totalData.pTdspercentage = totalData.pTdspercentage ? totalData.pTdspercentage : 0;
        this._rdfdservice.saveRefferalDetails(totalData).subscribe((response: any) => {
          this.buttonName = 'Save & Continue';
          this.isLoading = false;
          if (response) {
            this.router.navigateByUrl('/RdView')
          }
        }, (error) => {
          this.buttonName = 'Save & Continue';
          this.isLoading = false;
        })
      }
    }
    /**--------(End)------Saving 5th tab (RD Referral Commision) ----------(End)--------- */
  }
  /**-----(End)-----Saving each tab (Save button functionality)---------------(End)------- */

  /**------(Start)---- For 1st tab GET API -------------------(Start)------------- */
  getRdNameAndCodeDetails() {
    if (this.pRdname && this.pRdnamecode) {
      this.buttonName = 'Processing';
      this.isLoading = true;
      this._rdfdservice.getFdNameAndCode(this.pRdname, this.pRdnamecode).subscribe((resposne: any) => {
        this.buttonName = 'Save & Continue';
        this.isLoading = false;
        if (resposne) {
          resposne.pCreatedby = this.commonService.pCreatedby;
          this.Rdnameandcode.Rdnameandcodeform.patchValue(resposne);
          this.Rdnameandcode.rdnameandcode = resposne.pRdnamecode;
        }
      }, (error) => {
        this.buttonName = 'Save & Continue';
        this.isLoading = false;
      })
    }
  }
  /**------(End)---- For 1st tab GET API -------------------(End)------------- */

  /**------(Start)---- For 2nd tab GET API -------------------(Start)------------- */
  getRdConfigurationDetails() {
    if (this.pRdname && this.pRdnamecode) {
      this.buttonName = 'Processing';
      this.isLoading = true;
      this._rdfdservice.getRdConfigurationDetails(this.pRdname, this.pRdnamecode).subscribe(
       (resposne: any) => {
          debugger;
        this.buttonName = 'Save & Continue';
        this.isLoading = false;
        if (resposne) {
          resposne.pCreatedby = this.commonService.pCreatedby;
          for (let i = 0; i < resposne.lstRdConfigartionDetails.length; i++) {
            resposne.lstRdConfigartionDetails[i].pInterestamount = resposne.lstRdConfigartionDetails[i].pInterestamount ? this.commonService.currencyformat(resposne.lstRdConfigartionDetails[i].pInterestamount) : 0;
            resposne.lstRdConfigartionDetails[i].pDepositamount = resposne.lstRdConfigartionDetails[i].pDepositamount ? this.commonService.currencyformat(resposne.lstRdConfigartionDetails[i].pDepositamount) : 0;
            resposne.lstRdConfigartionDetails[i].pMaturityamount = resposne.lstRdConfigartionDetails[i].pMaturityamount ? this.commonService.currencyformat(resposne.lstRdConfigartionDetails[i].pMaturityamount) : 0;
            resposne.lstRdConfigartionDetails[i].pTenure = resposne.lstRdConfigartionDetails[i].pTenure ? this.commonService.currencyformat(resposne.lstRdConfigartionDetails[i].pTenure) : 0;
            resposne.lstRdConfigartionDetails[i].pPayindenomination = resposne.lstRdConfigartionDetails[i].pPayindenomination ? this.commonService.currencyformat(resposne.lstRdConfigartionDetails[i].pPayindenomination) : 0;
            resposne.lstRdConfigartionDetails[i].pMininstalmentamount = resposne.lstRdConfigartionDetails[i].pMininstalmentamount ? this.commonService.currencyformat(resposne.lstRdConfigartionDetails[i].pMininstalmentamount) : 0;
            resposne.lstRdConfigartionDetails[i].pMaxinstalmentamount = resposne.lstRdConfigartionDetails[i].pMaxinstalmentamount ? this.commonService.currencyformat(resposne.lstRdConfigartionDetails[i].pMaxinstalmentamount) : 0;
            resposne.lstRdConfigartionDetails[i].pPenaltyvalue = resposne.lstRdConfigartionDetails[i].ppenaltyvalue ? this.commonService.currencyformat(resposne.lstRdConfigartionDetails[i].ppenaltyvalue) : 0;
            resposne.lstRdConfigartionDetails[i].pPenaltytype = resposne.lstRdConfigartionDetails[i].ppenaltytype;
            
            
            
          }
          this.Rdconfiguration.DepositGridData = resposne.lstRdConfigartionDetails;
          this.Rdconfiguration.gridViewDeposite = resposne.lstRdConfigartionDetails;
        }
      }, (error) => {
        this.buttonName = 'Save & Continue';
        this.isLoading = false;
      })
    }
  }
  /**------(End)---- For 2nd tab GET API -------------------(End)------------- */

  /**------(Start)---- For 3rd tab GET API -------------------(Start)------------- */
  getRdLoanFacilityDetails() {
    debugger
    if (this.pRdname && this.pRdnamecode) {
      this.buttonName = 'Processing';
      this.isLoading = true;
      this._rdfdservice.getRdLoanAndFacilityDetails(this.pRdname, this.pRdnamecode).subscribe((resposne: any) => {
        this.buttonName = 'Save & Continue';
        this.isLoading = false;
        if (resposne) {
          resposne.pCreatedby = this.commonService.pCreatedby;
          if (resposne.pIsloanfacilityapplicable) {
            this.rdLoanAndFacility.isloanfacilityaplicable = true;
          }
          else {
            this.rdLoanAndFacility.isloanfacilityaplicable = false;
          }
          if (resposne.pIsloanageperiod) {
            this.rdLoanAndFacility.isloanage = true;
          }
          else {
            this.rdLoanAndFacility.isloanage = false;
          }
          if (resposne.pIsprematuretylockingperiod) {
            this.rdLoanAndFacility.islockin = true;
            this.rdLoanAndFacility.Griddata= resposne._RecurringDepositPrematurityInterestPercentages
          }
          else {
            this.rdLoanAndFacility.islockin = false;
          }
          if (resposne.pIslatefeepayble) {
            this.rdLoanAndFacility.islatefeeapplicable = true;
          }
          else {
            this.rdLoanAndFacility.islatefeeapplicable = false;
          }
          resposne.pAgeperiod = resposne.pAgeperiod ? this.commonService.currencyformat(resposne.pAgeperiod) : 0;
          resposne.pPrematuretyageperiod = resposne.pPrematuretyageperiod ? this.commonService.currencyformat(resposne.pPrematuretyageperiod) : 0;
          resposne.pLatefeepayblevalue = resposne.pLatefeepayblevalue ? this.commonService.currencyformat(resposne.pLatefeepayblevalue) : 0;
          resposne._RecurringDepositPrematurityInterestPercentages=resposne._RecurringDepositPrematurityInterestPercentages ? resposne._RecurringDepositPrematurityInterestPercentages : [];
          if (resposne.pLatefeepaybletype == 'comfixed' || resposne.pLatefeepaybletype == null) {
            this.rdLoanAndFacility.forFixed = true;
            this.rdLoanAndFacility.forPercentage = false;
          }
          else {
            this.rdLoanAndFacility.forFixed = false;
            this.rdLoanAndFacility.forPercentage = true;
          }
          this.rdLoanAndFacility.maxInterestrateto=this.maxInterestrateto;
          this.rdLoanAndFacility.maxinvestmentperiodto=this.maxinvestmentperiodto;
          this.rdLoanAndFacility.Rdloanfacilityform.patchValue(resposne);
          this.rdLoanAndFacility.LatefeeapplicableEdit();
          this.rdLoanAndFacility.ValidateLockinPeriod();
          this.rdLoanAndFacility.ValidateLoanFacility();
        }
      }, (error) => {
        this.buttonName = 'Save & Continue';
        this.isLoading = false;
      })
    }
  }
  /**------(End)---- For 3rd tab GET API -------------------(End)------------- */

  /**------(Start)---- For 4th tab GET API -------------------(Start)------------- */
  getRdIdentificationDetails() {
    if (this.pRdname && this.pRdnamecode) {
      this.buttonName = 'Processing';
      this.isLoading = true;
      this._rdfdservice.getRdIdentificationDetails(this.pRdname, this.pRdnamecode).subscribe((resposne: any) => {
        this.buttonName = 'Save';
        this.isLoading = false;
        if (resposne) {
          resposne.pCreatedby = this.commonService.pCreatedby;
          this.rdIndentification.childIndentificationData = resposne.identificationdocumentsList[0].pDocumentsList;
          this.rdIndentification.identificationDocComponent.LoanDoucments = resposne.identificationdocumentsList;
        }
      }, (error) => {
        this.buttonName = 'Save';
        this.isLoading = false;
      })
    }
  }
  /**------(End)---- For 4th tab GET API -------------------(End)------------- */

  /**------(Start)---- For 5th tab GET API -------------------(Start)------------- */
  getRdReferralCommissionDetails() {
    this.buttonName = 'Processing';
    this.isLoading = true;
    if (this.pRdname && this.pRdnamecode) {
      this._rdfdservice.getRdReferralDetails(this.pRdname, this.pRdnamecode).subscribe((resposne: any) => {
        this.buttonName = 'Save & Continue';
        this.isLoading = false;
        if (resposne) {
          resposne.pCreatedby = this.commonService.pCreatedby;
          resposne.pCommissionValue = resposne.pCommissionValue ? this.commonService.currencyformat(resposne.pCommissionValue) : 0;
          this.rdRefferalCommission.rdRefferalForm.patchValue(resposne);
          this.rdRefferalCommission.notApplicableFlag = !resposne.pIsreferralcommissionapplicable;
          this.rdRefferalCommission.tdsshow = resposne.pIstdsapplicable;
          if (resposne.pReferralcommissiontype == "percentage") {
            this.rdRefferalCommission.forPercentage = true;
            this.rdRefferalCommission.forFixed = false;
          }
          else {
            this.rdRefferalCommission.forPercentage = false;
            this.rdRefferalCommission.forFixed = true;
          }
        }
      }, (error) => {
        this.buttonName = 'Save & Continue';
        this.isLoading = false;
      })
    }
  }
  /**------(End)---- For 5th tab GET API -------------------(End)------------- */

  /**------(Start)---- For clear button -------------------(Start)------------- */
  forClear() {
    if (this.selectedtype == "RD Name and Code") {
      this.Rdnameandcode.ngOnInit();
    }
    else if (this.selectedtype == 'RD Configuration') {
      this.Rdconfiguration.ngOnInit();
    }
    else if (this.selectedtype == 'Loan Facility and Pre-Maturity') {
      this.rdLoanAndFacility.ngOnInit();
    }
    else if (this.selectedtype == 'Identification Documents') {
      this.rdIndentification.ngOnInit();
    }
    else {
      this.rdRefferalCommission.ngOnInit();
    }
  }
  /**------(End)---- For clear button -------------------(End)------------- */

  back(){
    debugger;
    this.router.navigate(['/RdView']);
  }
}
