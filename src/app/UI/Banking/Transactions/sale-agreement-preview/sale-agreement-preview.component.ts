import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { AgentForSaleService } from 'src/app/Services/Banking/Transactions/agent-for-sale.service';
import { CommonService } from 'src/app/Services/common.service';
import { Page } from 'src/app/UI/Common/Paging/page'
import { GroupDescriptor, process } from '@progress/kendo-data-query';

@Component({
  selector: 'app-sale-agreement-preview',
  templateUrl: './sale-agreement-preview.component.html',
  styles: []
})
export class SaleAgreementPreviewComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;

  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();

  saleAgreementpreviewform: FormGroup
  gridData: any = [];
  gridview: any = [];
  griddata: any = [];
  temp: any = [];
  selectallcheckbox: boolean
  selectedvalues: string = ""
  selectedrow: any = []
  check: boolean = false;
  duplicatecheck: boolean;
  Bondpreviewform: FormGroup;
  commencementgridPage = new Page();
  startindex: any;
  endindex: any;
  public columns: Array<object>;
  public ColumnMode = ColumnMode;
  public pageSize = 10;
  public headerCells: any = {
    textAlign: 'center'
  };
  allRowsSelected: boolean;
  table: any;
  Savedrow: any = []
  savedlist: { lstBonds_Print: any; };
  receipt: string;
  memberId: any;
  memberDataDetails: any = [];
  pmembername: any;
  pfathername: any;
  ppanno: any;
  padharno: any = 0;
  paddress: any;
  companyDetails: any = [];
  pdepositamount: any;
  pdepositdate: any;
  pmaturitydate: any;
  agreementFloorData: any;
  pfloorno: any;
  pfloorundividedarea: any;
  pfloorname: any;
  companyname: any;
  companyppanno: any;
  pcinnumber: any;
  paddress1: string;
  pbuildingname: any;
  pAddress2: any;
  ptotalsft: any;
  pconstructedland: any;
  authorizedPersonData: any = [];
  directorData: any;
  managerData: any;
  pdobManager1: any;
  pdobDirector1: any;
  directorDesignation: any;
  directorContactName: any;
  directorFatherName: any;
  directorAddress: any;
  directorAadhar: any = 0;
  managerDesignation: any;
  managerContactName: any;
  managerFatherName: any;
  managerAddress: any;
  managerAadhar: any = 0;
  pproceedingno: any;
  pocdate: any;
  pocprovidedby: any;
  pparkinglevels: any;
  pupperfloors: any;
  pnorthboundry: any;
  peastboundry: any;
  psouthboundry: any;
  pwestboundry: any;
  fdAccountId: any;
  fdAccountNo: any;
  psquareyard: any = 0;
  calDepAmount: number;
  selectedRowIndex: number | null = null;
  isPreviewClicked: boolean = false;
  pallocatedarea: any;
  branchId: any;
  branchName: any;
  company_Name: any;
  pvchgroupticket: string = "";




  constructor(private _fb: FormBuilder, private saleAgreementService: AgentForSaleService, private commomservice: CommonService) {
    this.dpConfig.dateInputFormat = 'DD/MM/YYYY'
    this.dpConfig.maxDate = new Date();
    this.dpConfig.minDate = new Date();
    this.dpConfig.showWeekNumbers = false;
  }

  ngOnInit() {
    this.saleAgreementpreviewform = this._fb.group({
      ptransdate: [new Date()]
    })

    this.memberId = "";
    this.fdAccountId = "";
    this.getAggrementCompanyAddress();
    this.GetAggrementFloorInventory();
    this.getSaleagreementCompanydetails();
    this.GetAuthorizedpersons();

    let branch = JSON.parse(sessionStorage.getItem('SetBranch'));
    this.branchId = branch.pbranch_id;
    this.branchName = branch.pbranch_name;
    let company = JSON.parse(sessionStorage.getItem('companydetails'));
    this.company_Name = company.pCompanyName;
  }

  showdetails() {
    debugger;
    this.memberId = "";
    this.fdAccountId = "";
    this.selectedRowIndex = null;
    this.isPreviewClicked = false;
    let date = this.saleAgreementpreviewform.controls.ptransdate.value;
    this.saleAgreementService.GetSaleaggrementDetails(date).subscribe(json => {
      this.gridData = json;
      //let a= this.gridData.filter(s=>s.pFdaccountid==null)
      //this.gridData.splice(a,-1)
      this.griddata = json;
      this.gridview = json;


      this.gridData.filter(function (df) { df.pIscheck = false; });
      // this.gridData.filter(function (df) { df.pFdaccountid = "null"; });
      console.log("grid data", this.gridData)
      if (this.gridData) {
        this.selectallcheckbox = false
      }
    })
  }

  selectAll(event, row, rowIndex) {
    debugger;
    this.pvchgroupticket = row.pvchgroupticket;
    if (event.target.checked) {
      if (this.gridData.length != 0) {
        this.allRowsSelected = true;
        this.check = true;
        this.duplicatecheck = true;
        this.gridData.filter(function (df) { df.pIscheck = true; });

        // for(let i=0;i<this.gridData.length;i++)
        // {
        //   this.selectedrow.push(this.gridData[i].pnumappid);
        //   //this.selectedrow.push(this.gridData[i].pFdaccountid);
        //   let obj={pDeposit_id:this.gridData[i].pfdaccountid,
        //     pPrint_Date:this.Bondpreviewform.controls.ptransdate.value,pPrint_Status:"N"}
        //     this.Savedrow.push(obj);

        // }

        this.memberId = row.pmemberid;
        this.fdAccountId = row.pfdaccountid;
        this.fdAccountNo = row.pnumappid;

        this.GetAggrementmemberDetails();
      }

      console.log("all selected rows", this.selectedrow)
    }
    else {
      this.check = false;
      this.duplicatecheck = false;
      this.gridData.filter(function (df) { df.pIscheck = false; });
      this.allRowsSelected = false;
      this.selectedrow = [];
      this.selectedvalues = ""
    }

  }

  selectFdAccountno(event, row, rowIndex) {
    debugger;
    this.memberId = "";
    this.fdAccountId = "";
    this.pvchgroupticket = "";
    this.selectedRowIndex = null;
    this.isPreviewClicked = false;
    let groupTicketNo = row.pvchgroupticket;

    this.pvchgroupticket = row.pvchgroupticket;
    console.log("list of liens before are : ", this.pvchgroupticket);
    this.pvchgroupticket = groupTicketNo.split(',').map(item => item.trim().replace(/\s*-\s*/g, '-')).filter(item => item).join(',');
    console.log("list of liens are : ", this.pvchgroupticket);
    if (event.target.checked) {
      this.selectedrow.push(row.pnumappid);
      //this.selectedrow.push(row.pFdaccountid);
      let obj = {
        pDeposit_id: row.pfdaccountid,
        pPrint_Date: this.saleAgreementpreviewform.controls.ptransdate.value, pPrint_Status: "N"
      }

      this.selectedRowIndex = rowIndex;
      this.Savedrow.push(obj);

      // let saveddata = Object.assign(this.chequemanagementform.value, chequemanagement);
      this.memberId = row.pmemberid;
      this.fdAccountId = row.pfdaccountid;
      this.fdAccountNo = row.pnumappid;

      this.GetAggrementmemberDetails();
    }
    else {
      this.selectedrow.splice(event.rowIndex, 1);
      this.allRowsSelected = false
    }
    console.log("after deleting", this.selectedrow)



  }

  GenerateReport() {
    // this.check=false;
    debugger
    //this.check=null;
    this.duplicatecheck = null;
    // this.duplicatecheck = false;
    if (this.memberId == "") {
      this.commomservice.showErrorMessage("Please Select Atleast One Checkbox")
      return
    }
    if (this.memberId != "" || this.memberId != undefined) {
      this.selectedvalues = this.memberId + ',' + 'saveSaleAgreement';
      this.receipt = btoa(this.selectedvalues,);
      //this.showdetails();
      this.gridData.filter(function (df) { df.pIscheck = false; });
      window.open('/#/AgreementForSale?id=' + this.receipt);
      this.allRowsSelected = false;
      this.check = false;
      // this.duplicatecheck = true;
      setTimeout(() => {
        this.duplicatecheck = false;
      }, 200);
      this.selectedvalues = "";
      this.selectedrow = [];
      //this.showdetails()
    }
    else if (this.gridData.length == 0) {
      this.commomservice.showErrorMessage("Please Click on Show Button to View The Data")
    }
    else {
      this.commomservice.showErrorMessage("Please Select Atleast One Checkbox")
    }


  }

  GetAggrementmemberDetails() {
    debugger;
    this.saleAgreementService.GetAggrementmemberDetails(this.memberId, this.fdAccountId).subscribe(resData => {
      this.memberDataDetails = resData;
      this.pmembername = this.memberDataDetails[0].pmembername;
      this.pfathername = this.memberDataDetails[0].pfathername;
      this.ppanno = this.memberDataDetails[0].ppanno;
      this.padharno = this.memberDataDetails[0].padharno;
      this.paddress = this.memberDataDetails[0].paddress;
      this.pdepositamount = this.memberDataDetails[0].pdepositamount.toString().replace(/,/g, "");
      this.calDepAmount = this.memberDataDetails[0].psquareyard * 13000;

      this.pdepositdate = this.memberDataDetails[0].pdepositdate;
      this.pmaturitydate = this.memberDataDetails[0].pmaturitydate;
      this.psquareyard = this.memberDataDetails[0].psquareyard;

      if (this.memberDataDetails[0].padharno == '') {
        this.padharno = 0;
      }

    })
  }

  getAggrementCompanyAddress() {
    debugger;
    this.saleAgreementService.getAggrementCompanyAddress().subscribe(data => {
      this.companyDetails = data;
      this.companyname = this.companyDetails.pnameofenterprise;
      this.companyppanno = this.companyDetails.ppanno;
      this.pcinnumber = this.companyDetails.pcinnumber;
      this.paddress1 = this.companyDetails.paddress1 + ' ' + this.companyDetails.paddress2;
      // this.paddress  = this.companyDetails.paddress;
      // this.paddress  = this.companyDetails.paddress;
      // this.paddress  = this.companyDetails.paddress;
      // this.paddress  = this.companyDetails.paddress;
      // this.paddress  = this.companyDetails.paddress;
      // this.paddress  = this.companyDetails.paddress;

    })
  }

  GetAggrementFloorInventory() {
    debugger;
    this.saleAgreementService.GetAggrementFloorInventory().subscribe(datas => {
      this.agreementFloorData = datas;
      this.pfloorno = this.agreementFloorData.pfloorno;
      this.pfloorname = this.agreementFloorData.pfloorname;
      this.pfloorundividedarea = this.agreementFloorData.pfloorundividedarea;
      this.pallocatedarea = this.agreementFloorData.pallocatedarea;


    })
  }

  getSaleagreementCompanydetails() {
    debugger;
    this.saleAgreementService.getSaleagreementCompanydetails().subscribe(res => {
      if (res.length > 0) {
        this.pbuildingname = res[0].pbuildingname;
        this.ptotalsft = res[0].ptotalsft;
        this.pparkinglevels = res[0].pparkinglevels;
        this.pupperfloors = res[0].pupperfloors;
        this.pconstructedland = res[0].pconstructedland;
        this.pnorthboundry = res[0].pnorthboundry;
        this.peastboundry = res[0].peastboundry;
        this.psouthboundry = res[0].psouthboundry;
        this.pwestboundry = res[0].pwestboundry;
        // this.pAddress1 = res[0].paddress1;
        this.pAddress2 = res[0].paddress2;
        // this.pdistrict = res[0].pdistrict;
        // this.ppincode = res[0].ppincode;
        this.pproceedingno = res[0].pocproceedingno;
        this.pocdate = res[0].pocdate;
        this.pocprovidedby = res[0].pocprovidedby;
        // this.plandinsquarefeet = res[0].pconstructedland * 9;
        // this.getRightsofcompanyoverland(res[0].pbuildingid);
      }
    });
  }

  GetAuthorizedpersons() {
    debugger;
    this.saleAgreementService.GetAuthorizedpersons().subscribe(data => {
      this.authorizedPersonData = data;

      this.directorData = this.authorizedPersonData.filter(assetsInformationobj => assetsInformationobj.pdesignation == "Director");

      this.managerData = this.authorizedPersonData.filter(assetsInformationobj => assetsInformationobj.pdesignation == "Manager");

      this.pdobManager1 = this.managerData[0].pdob;
      this.pdobDirector1 = this.directorData[0].pdob;

      this.directorDesignation = this.directorData[0].pdesignation;
      this.directorContactName = this.directorData[0].pcontactname;
      this.directorFatherName = this.directorData[0].pfathername;
      this.directorAddress = this.directorData[0].paddress;
      this.directorAadhar = this.directorData[0].pdocrefno;

      this.managerDesignation = this.managerData[0].pdesignation;
      this.managerContactName = this.managerData[0].pcontactname;
      this.managerFatherName = this.managerData[0].pfathername;
      this.managerAddress = this.managerData[0].paddress;
      this.managerAadhar = this.managerData[0].pdocrefno;

    })

  }

  onPreviewClick() {
    this.isPreviewClicked = true; // Hide Preview button and show Print button
    this.saveSaleAgreementPreview(); // Call the existing function
  }

  saveSaleAgreementPreview() {
    debugger;

    if (this.memberId == "") {
      this.commomservice.showErrorMessage("Please Select Atleast One Checkbox");
      return;
    }

    if (this.memberId != "" || this.memberId != undefined) {

      //this.showdetails()


      let data = {
        // "paggrementid": 0,
        "pmemberid": this.memberId,
        "pmembername": this.pmembername,
        "pmemberfdaccountno": this.fdAccountNo,
        "pmemberfdaccountid": this.fdAccountId,
        "pmemberpanno": this.ppanno,
        "pmemberadharno": this.padharno,
        "pmemberaddress": this.paddress,
        "pmemberfatherwife": this.pfathername,
        "pcompany": this.companyname,
        "pcompanypan": this.companyppanno,
        "pcompanycin": this.pcinnumber,
        "pcompanyaddress": this.paddress1,
        "ppurchasesft": this.psquareyard,
        "pdepositeamount": this.pdepositamount,
        "psaleconsiderationamount": this.calDepAmount,
        "pdepositedate": this.pdepositdate,
        "pmaturitydate": this.pmaturitydate,
        "pfloorno": this.pfloorno,
        "pfloorname": this.pfloorname,
        "pbuildingname": this.pbuildingname,
        "pbuildingaddress": this.pAddress2,
        "ptotalbuildingsft": this.ptotalsft,
        "ptotalconstructedsft": this.pconstructedland,
        "pauthorizeddirector": this.directorContactName,
        "pauthorizeddirectoraddress": this.directorAddress,
        "pauthorizeddirectoradhar": this.directorAadhar,
        "pauthorizedmanager": this.managerContactName,
        "pauthorizedmanageraddress": this.managerAddress,
        "pauthorizedmanageradhar": this.managerAadhar,
        "pproceedingno": this.pproceedingno,
        "pproceedingdate": this.pocdate,
        "pproceedingprovidedby": this.pocprovidedby,
        "pparkingfloors": this.pparkinglevels,
        "pupperfloors": this.pupperfloors,
        "pbuildingnorthboundry": this.pnorthboundry,
        "pbuildingeastboundry": this.peastboundry,
        "pbuildingsouthboundry": this.psouthboundry,
        "pbuildingwestboundry": this.pwestboundry,
        "pcreatedby": this.commomservice.pCreatedby
      }
      let jsonData = JSON.stringify(data)
      console.log(jsonData);
      this.saleAgreementService.saveSaleAgreementPreview(jsonData).subscribe(res => {
        this.commomservice.showInfoMessage('Data Previewed');
        this.selectedvalues = this.memberId + ',' + 'saleAgreementPreview' + ',' + this.fdAccountNo + ',' + this.fdAccountId + ',' + this.pvchgroupticket;
        this.receipt = btoa(this.selectedvalues,);
        this.gridData.filter(function (df) { df.pIscheck = false; });
        // if(this.branchName != 'HOTELSPACE-BVM-CENTRALOFFICE'){
        //   window.open('/#/AgreementForSale?id=' + this.receipt);
        //   window.open('/#/AdvanceAgreementLetter?id=' + this.receipt);
        //   }
        // if(this.branchName == 'HOTELSPACE-BVM-CENTRALOFFICE'){
        // window.open('/#/AgreementForSaleHotelSpace?id=' + this.receipt);
        // }
        if (this.branchName == 'HOTELSPACE-BVM-CENTRALOFFICE') {
          window.open('/#/AgreementForSaleHotelSpace?id=' + this.receipt);
          window.open('/#/AdvanceAgreementLetter?id=' + this.receipt);

        }
        else if (this.branchName == 'OFFICESPACE-DAKSHININFRA-CENTRALOFFICE-K' || this.branchName == 'OFFICESPACE-DAKSHININFRA-CENTRALOFFICE-N') {
          window.open('/#/AgreementForSaleDhakshin?id=' + this.receipt);
          window.open('/#/AdvanceAgreementLetter?id=' + this.receipt);
        }
        //   else if (this.branchName == 'test_office_dhakshin_central_k_14_08_2025') {
        //   window.open('/#/AgreementForSaleDhakshin?id=' + this.receipt);
        //   window.open('/#/AdvanceAgreementLetter?id=' + this.receipt);
          
        // }

        else if (this.company_Name == 'KAUSALYA INFRA PROJECTS  PRIVATE LIMITED') {
          window.open('/#/AgreementForSaleKousalyaInfra?id=' + this.receipt);
          window.open('/#/AdvanceAgreementLetter?id=' + this.receipt);
        }
        else {
          window.open('/#/AgreementForSale?id=' + this.receipt);
          window.open('/#/AdvanceAgreementLetter?id=' + this.receipt);
        }

        this.allRowsSelected = false;
        this.check = false;
        // this.duplicatecheck = true;
        setTimeout(() => {
          this.duplicatecheck = false;
        }, 200);
        this.selectedvalues = "";
        this.selectedrow = [];
        // this.memberId = "";
        // this.selectedRowIndex = null;


      })

    }
    else if (this.gridData.length == 0) {
      this.commomservice.showErrorMessage("Please Click on Show Button to View The Data")
    }
    else {
      this.commomservice.showErrorMessage("Please Select Atleast One Checkbox")
    }
  }


  saveSaleAgreement() {
    debugger;

    if (this.memberId == "") {
      this.commomservice.showErrorMessage("Please Select Atleast One Checkbox");
      return;
    }

    this.saleAgreementService.getSaleaggrementCount(this.fdAccountId, this.memberId).subscribe(data => {
      let countOfSaleAgreement = data['count'];
      if (countOfSaleAgreement > 0) {
        this.commomservice.showWarningMessage('Print has been done already with the Member Name' + ' ' + this.pmembername);
        return
      }
      else {
        if (this.memberId != "" || this.memberId != undefined) {

          //this.showdetails()


          let data = {
            // "paggrementid": 0,
            "pmemberid": this.memberId,
            "pmembername": this.pmembername,
            "pmemberfdaccountno": this.fdAccountNo,
            "pmemberfdaccountid": this.fdAccountId,
            "pmemberpanno": this.ppanno,
            "pmemberadharno": this.padharno,
            "pmemberaddress": this.paddress,
            "pmemberfatherwife": this.pfathername,
            "pcompany": this.companyname,
            "pcompanypan": this.companyppanno,
            "pcompanycin": this.pcinnumber,
            "pcompanyaddress": this.paddress1,
            "ppurchasesft": this.psquareyard,
            "pdepositeamount": this.pdepositamount,
            "psaleconsiderationamount": this.calDepAmount,
            "pdepositedate": this.pdepositdate,
            "pmaturitydate": this.pmaturitydate,
            "pfloorno": this.pfloorno,
            "pfloorname": this.pfloorname,
            "pbuildingname": this.pbuildingname,
            "pbuildingaddress": this.pAddress2,
            "ptotalbuildingsft": this.ptotalsft,
            "ptotalconstructedsft": this.pconstructedland,
            "pauthorizeddirector": this.directorContactName,
            "pauthorizeddirectoraddress": this.directorAddress,
            "pauthorizeddirectoradhar": this.directorAadhar,
            "pauthorizedmanager": this.managerContactName,
            "pauthorizedmanageraddress": this.managerAddress,
            "pauthorizedmanageradhar": this.managerAadhar,
            "pproceedingno": this.pproceedingno,
            "pproceedingdate": this.pocdate,
            "pproceedingprovidedby": this.pocprovidedby,
            "pparkingfloors": this.pparkinglevels,
            "pupperfloors": this.pupperfloors,
            "pbuildingnorthboundry": this.pnorthboundry,
            "pbuildingeastboundry": this.peastboundry,
            "pbuildingsouthboundry": this.psouthboundry,
            "pbuildingwestboundry": this.pwestboundry,
            "pcreatedby": this.commomservice.pCreatedby
          }
          let jsonData = JSON.stringify(data)
          console.log(jsonData);

          this.saleAgreementService.saveSaleAggrement(jsonData).subscribe(res => {
            this.commomservice.showInfoMessage('Data Printed');
            this.selectedvalues = this.memberId + ',' + 'saveSaleAgreement' + ',' + this.fdAccountNo + ',' + this.fdAccountId + ',' + this.pvchgroupticket;

            this.receipt = btoa(this.selectedvalues,);
            this.gridData.filter(function (df) { df.pIscheck = false; });
            // if(this.branchName != '31STOFFICEHYD'){
            // window.open('/#/AgreementForSale?id=' + this.receipt);
            // window.open('/#/AdvanceAgreementLetter?id=' + this.receipt);
            // }
            // if(this.branchName == '31STOFFICEHYD'){
            //   window.open('/#/AgreementForSaleHotelSpace?id=' + this.receipt);
            //   }
            //     if(this.branchName != 'HOTELSPACE-BVM-CENTRALOFFICE'){
            //   window.open('/#/AgreementForSale?id=' + this.receipt);
            //   window.open('/#/AdvanceAgreementLetter?id=' + this.receipt);
            //   }
            // if(this.branchName == 'HOTELSPACE-BVM-CENTRALOFFICE'){
            // window.open('/#/AgreementForSaleHotelSpace?id=' + this.receipt);
            // }
            if (this.branchName == 'HOTELSPACE-BVM-CENTRALOFFICE') {
              window.open('/#/AgreementForSaleHotelSpace?id=' + this.receipt);
            }
            else if (this.branchName == 'OFFICESPACE-DAKSHININFRA-CENTRALOFFICE-K' || this.branchName == 'OFFICESPACE-DAKSHININFRA-CENTRALOFFICE-N') {
              window.open('/#/AgreementForSaleDhakshin?id=' + this.receipt);
              window.open('/#/AdvanceAgreementLetter?id=' + this.receipt);
            }
        //       else if (this.branchName == 'Test_Dhakshin_17-07-2025') {
        //   window.open('/#/AgreementForSaleDhakshin?id=' + this.receipt);
        //   window.open('/#/AdvanceAgreementLetter?id=' + this.receipt);
          
        // }

            else if (this.company_Name == 'KAUSALYA INFRA PROJECTS  PRIVATE LIMITED') {
              window.open('/#/AgreementForSaleKousalyaInfra?id=' + this.receipt);
              window.open('/#/AdvanceAgreementLetter?id=' + this.receipt);
            }
            else {
              window.open('/#/AgreementForSale?id=' + this.receipt);
              window.open('/#/AdvanceAgreementLetter?id=' + this.receipt);
            }

            this.allRowsSelected = false;
            this.check = false;
            // this.duplicatecheck = true;
            setTimeout(() => {
              this.duplicatecheck = false;
            }, 200);
            this.selectedvalues = "";
            this.memberId = "";
            this.selectedRowIndex = null;
            this.selectedrow = [];
            this.isPreviewClicked = false;
          })

        }
        else if (this.gridData.length == 0) {
          this.commomservice.showErrorMessage("Please Click on Show Button to View The Data")
        }
        else {
          this.commomservice.showErrorMessage("Please Select Atleast One Checkbox")
        }
      }
    })


  }

  onFilter(inputValue: string) {
    debugger
    this.griddata = process(this.gridview, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'pvchname',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pnumamount',
            operator: 'contains',
            value: inputValue
          }, {
            field: 'pnumappid',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pnumintper',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pnumamount',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pmvalue',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pvchperiodmode',
            operator: 'contains',
            value: inputValue
          },
          //  {
          //    field: 'pLienadjuestto',
          //    operator: 'contains',
          //    value: inputValue
          //  }
        ],
      }
    }).data;
    this.dataBinding.skip = 0;
  }


}
