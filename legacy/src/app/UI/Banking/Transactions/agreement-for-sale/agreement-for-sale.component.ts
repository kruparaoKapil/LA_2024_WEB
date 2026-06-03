import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PDFExportComponent } from '@progress/kendo-angular-pdf-export';
import { AgentForSaleService } from 'src/app/Services/Banking/Transactions/agent-for-sale.service';
import { CommonService } from 'src/app/Services/common.service';
import { forkJoin } from 'rxjs';
import { FdRdTransactionsService } from 'src/app/Services/Banking/Transactions/fd-rd-transactions.service';

@Component({
  selector: 'app-agreement-for-sale',
  templateUrl: './agreement-for-sale.component.html',
  styles: []
})
export class AgreementForSaleComponent implements OnInit {
  pcompany_name: any;
  plocation: any;
  pcin: any;
  page: any = '50';
  RightsofcompanyoverlandData: any = [];
  pbuildingname: any = "";
  ptotalsft: any = "";
  pparkinglevels: any = "";
  pupperfloors: any = ""; pconstructedland: any = ""; pnorthboundry: any = ""; peastboundry: any = "";
  psouthboundry: any = ""; pwestboundry: any = ""; pbuildingaddress: any = "";
  pAddress1: any;
  pAddress2: any;
  pdistrict: any;
  ppincode: any;
  memberData: any = [];
  companyDetails: any = [];
  agee: any;
  authorizedPersonData: any = [];
  managerName: any;
  pdesignationManager: any;
  pdesignation: any;
  directorName: any;
  pfathernameManager: any;
  pfathernameDirector: any;
  pdobDirector: any;
  pdobManager: any;
  paddressDirector: any;
  paddressManager: any;
  pdocrefnoDirector: any;
  pdocrefnoManager: any;
  directorData: any;
  managerData: any;
  pdobManager1: any;
  pdobDirector1: any;
  pproceedingno: any;
  pocdate: any;
  pocprovidedby: any;
  pdepositamount: any;
  calDepAmount: number;
  plandinsquarefeet: any;
  agreementFloorData: any = [];
  psquareyard: any;
  pfloorundividedarea: any;
  pfloorno: any;
  pdepositdate: any;
  memberIdForD: any;
  pmaturitydate: any;
  directorDesignation: any;
  managerDesignation: any;
  directorContactName: any;
  directorFatherName: any;
  directorAddress: any;
  directorAadhar: any;
  managerContactName: any;
  managerFatherName: any;
  managerAddress: any;
  managerAadhar: any;
  saveType: any;
  pallocatedarea: any;
  pfloorname: any;
  formattedAadhar: string;
  lastFourDigits: any;
  formattedAadharManager: string;
  lastFourDigitsManager: any;
  lastFourDigitsdirector: any;
  formattedAadhardirector: string;
  logInBranchId: any;
  logInBranchName: any;
  occupancyType: any;
  pmembername: any;
  pmemberfathername: any;
  pmemberaddress: any;
  pmemberpan: any;
  pmemberadharno: any;
  fdAccountId: string;
  ptitlename: any;
  today = new Date();
  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  date: number;
  day: string;
  month: string;
  year: string;
  agee1: any;
  jointMemeberData: any = [];
  jointMemeberName: any;
  jointMemeberTitle: any;
  jointMemeberFatherName: any;
  jointMemeberDOB: any;
  jointMemeberAddress: any;
  jointMemeberPan: any;
  jointMemeberAadhar: any;
  //bstrat
  aadharsplit: any;
  jointaadhar: any;
  //bend
  jointMemeberFatNameRelation: any;
  mergeData: any = [];
  dateDeposite: any;
  floorD: any;
  abcd: any = [];
  psquareyardF: any;
  pfdaccountnoF: any;
  fif: number;
  six: number;
  pmaturitydateF: any;
  intPay: any = [];
  nomineeDetails: any = [];
  pmemberfathernameWithout: any;
  extractedName: any;
  splitedFatOrRelName: any;
  nameAfterOf: any;

  pvchgroupticket: any = "";
  liendata: any = [];
  pdepositamount2: any;
  pinterestpayable: number = 0;
  dynSignature: any;
  constructor(private _agentforsaleService: AgentForSaleService, private _CommonService: CommonService, private activatedroute: ActivatedRoute, private _fdrdTransService: FdRdTransactionsService) { }
  @ViewChild('pdf', { static: false }) pdf!: PDFExportComponent; // <-- Add this line

  isExporting = false;

  ngOnInit() {
    debugger;

    let routeParams = atob(this.activatedroute.snapshot.queryParamMap.get('id'));
    let splitData = routeParams.split(",")
    console.log("routeParams", routeParams);
    this.pvchgroupticket = "";
    this.memberIdForD = splitData[0];
    this.saveType = splitData[1];
    this.fdAccountId = splitData[3];
    // this.pvchgroupticket = '@'+splitData[2]+'@,';
    //this.pvchgroupticket = splitData[5];
    for (let k = splitData.length - 1; k >= 4; k--) {
      this.pvchgroupticket += splitData[k];
      if (k > 4) {
        this.pvchgroupticket += ", ";
      }
    }

    let branch = JSON.parse(sessionStorage.getItem('SetBranch'));
    this.logInBranchId = branch.pbranch_id;
    this.logInBranchName = branch.pbranch_name;

    this.date = this.today.getDate();

    this.day = this.getOrdinal(this.date);
    this.month = this.months[this.today.getMonth()];
    this.year = this.today.getFullYear().toString();

    if (this.logInBranchName == 'HOTELSPACE-BVM-CENTRALOFFICE') {
      this.occupancyType = 'Hotel occupancy';
    }
    else {
      this.occupancyType = 'business occupancy'
    }





    this.getSaleagreementCompanydetails();
    const companydata = this._CommonService.comapnydetails;
    this.pcompany_name = companydata.pCompanyName;
    this.plocation = companydata.pAddress2;
    this.pcin = companydata.pCinNo;
    //this.ppan = 
    //this.pdirector = 
    //this.pfather = 
    //this.page = 
    //this.phouse = 
    //this.padhar = 
    //this.pmember =
    //this.wifeOF = 
    this.GetAggrementmemberDetails();
    this.getAggrementCompanyAddress();
    this.GetAuthorizedpersons();
    this.GetAggrementFloorInventory();
    this.forHS();
    this.GetSaleaggrementNominee();

  }

  getOrdinal(n: number): string {
    debugger
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    const suffix = (v >= 11 && v <= 13) ? 'th' : suffixes[(v % 10)] || 'th';
    return `${n}${suffix}`;
  }

  exportPDF() {
    this.isExporting = true;

    setTimeout(() => {
      this.pdf.saveAs('Sale Agreement.pdf');

      // Remove the class after exporting
      setTimeout(() => {
        this.isExporting = false;
      }, 1000);
    }, 500);
  }

  getAggrementCompanyAddress() {
    debugger;
    this._agentforsaleService.getAggrementCompanyAddress().subscribe(data => {
      this.companyDetails = data;
    })
  }

  GetAuthorizedpersons() {
    debugger;
    this._agentforsaleService.GetAuthorizedpersons().subscribe(data => {
      this.authorizedPersonData = data;

      this.directorData = this.authorizedPersonData.filter(assetsInformationobj => assetsInformationobj.pdesignation == "Director");

      let directorData = this.directorData;

      if(this.logInBranchName == 'OFFICESPACE-DAKSHININFRA-CENTRALOFFICE-N'){
        this.managerData = this.authorizedPersonData.filter(assetsInformationobj => assetsInformationobj.pdesignation == "Authorised Signatory");
        this.dynSignature = 'Authorised Signatory'
      }
      else{
        this.managerData = this.authorizedPersonData.filter(assetsInformationobj => assetsInformationobj.pdesignation == "Manager");
        this.dynSignature = 'Manager';
      }

      

      // this.managerData = this.authorizedPersonData.filter(assetsInformationobj => assetsInformationobj.pdesignation == "Manager");

      let managerData = this.managerData;

      if (this.directorData.length != 0) {


        this.pdobDirector1 = this.directorData[0].pdob;

        this.directorDesignation = this.directorData[0].pdesignation;
        this.directorContactName = this.directorData[0].pcontactname;
        this.directorFatherName = this.directorData[0].pfathername;
        this.directorAddress = this.directorData[0].paddress;
        this.directorAadhar = this.directorData[0].pdocrefno;

        this.lastFourDigitsdirector = this.directorAadhar.slice(-4);
        const hiddenAadhardirector = 'xxxx xxxx  ' + this.lastFourDigitsdirector;
        this.formattedAadhardirector = hiddenAadhardirector;
        this.getAgeDirector();
      }

      if (this.managerData.length != 0) {

        this.managerDesignation = this.managerData[0].pdesignation;
        this.managerContactName = this.managerData[0].pcontactname;
        this.managerFatherName = this.managerData[0].pfathername;
        this.managerAddress = this.managerData[0].paddress;
        this.managerAadhar = this.managerData[0].pdocrefno;

        this.pdobManager1 = this.managerData[0].pdob;


        this.lastFourDigitsManager = this.managerAadhar.slice(-4);
        const hiddenAadharManager = 'xxxx xxxx  ' + this.lastFourDigitsManager;
        this.formattedAadharManager = hiddenAadharManager;
        this.getAgeManager();
      }






    })



  }

  GetAggrementFloorInventory() {
    debugger;
    this._agentforsaleService.GetAggrementFloorInventory().subscribe(datas => {
      this.agreementFloorData = datas;
      this.pfloorno = this.agreementFloorData.pfloorno;
      this.pfloorname = this.agreementFloorData.pfloorname;
      this.pfloorundividedarea = this.agreementFloorData.pfloorundividedarea;
      this.pallocatedarea = this.agreementFloorData.pallocatedarea;

    })
  }



  getSaleagreementCompanydetails() {
    debugger;
    this._agentforsaleService.getSaleagreementCompanydetails().subscribe(res => {
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
        this.pAddress1 = res[0].paddress1;
        this.pAddress2 = res[0].paddress2;
        this.pdistrict = res[0].pdistrict;
        this.ppincode = res[0].ppincode;
        this.pproceedingno = res[0].pocproceedingno;
        this.pocdate = res[0].pocdate;
        this.pocprovidedby = res[0].pocprovidedby;
        this.plandinsquarefeet = res[0].pconstructedland * 9;
        this.getRightsofcompanyoverland(res[0].pbuildingid);
      }
    });
  }

  getRightsofcompanyoverland(buildingid) {
    debugger;
    this._agentforsaleService.getRightsofcompanyoverland(buildingid).subscribe(res => {
      this.RightsofcompanyoverlandData = res;

      console.log(this.RightsofcompanyoverlandData);


      for (let index = 0; index < this.RightsofcompanyoverlandData.length; index++) {
        let acres = this.RightsofcompanyoverlandData[index].pacers;
        let guntas = this.RightsofcompanyoverlandData[index].pguntas;

        if (acres < 10) {
          this.RightsofcompanyoverlandData[index].pacers = String(acres).padStart(2, '0');
        }

        if (guntas < 10) {
          this.RightsofcompanyoverlandData[index].pguntas = String(guntas).padStart(2, '0');
        }
      }
    });
  }

  GetAggrementmemberDetails() {
    debugger;
    this._agentforsaleService.GetAggrementmemberDetails(this.memberIdForD, this.fdAccountId).subscribe(resData => {
      this.memberData = resData;
      console.log('this is memberdata:', this.memberData);

      this.agee = this.memberData[0].pdob;
      // this.pdepositamount = this.memberData[0].pdepositamount.toString().replace(/,/g, "");
      // this.pdepositamount = (this.pdepositamount);
      //bhargavi strat
      let deposit = this.memberData[0].pdepositamount.split('.');
      this.pdepositamount = deposit[0];
      //bhargavi
      this.calDepAmount = this.memberData[0].psquareyard * 13000;
      this.psquareyard = this.memberData[0].psquareyard;
      this.pdepositdate = this.memberData[0].pdepositdate;
      this.pmaturitydate = this.memberData[0].pmaturitydate;
      this.pmembername = this.memberData[0].pmembername;
      this.pmemberfathername = this.memberData[0].pfathernamewithrelation;
      this.pmemberaddress = this.memberData[0].paddress;
      this.pmemberpan = this.memberData[0].ppanno;
      this.pmemberadharno = this.memberData[0].padharno;
      this.ptitlename = this.memberData[0].ptitlename;
      // bstart
      this.aadharsplit = this.pmemberadharno.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3')
      console.log('this is splitted aadhar no:', this.aadharsplit);

      //bend
      if (this.agee == "0001/01/01") {
        this.agee = null;
      }
      //this.agee1 =  this.memberData[0].pdob;

      if (this.memberData[0].jointMemberlist.length > 0) {

        this.jointMemeberData = this.memberData[0].jointMemberlist;

        this.jointMemeberName = this.jointMemeberData[0].pmembername;
        this.jointMemeberTitle = this.jointMemeberData[0].ptitle;
        this.jointMemeberFatherName = this.jointMemeberData[0].pfathername;
        this.jointMemeberDOB = this.jointMemeberData[0].pdob
        this.jointMemeberAddress = this.jointMemeberData[0].paddress
        this.jointMemeberPan = this.jointMemeberData[0].ppanno;
        this.jointMemeberAadhar = this.jointMemeberData[0].padharno
        //bhargavi
        this.jointaadhar = this.jointMemeberAadhar.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
        console.log('this is joint aadhar:', this.jointaadhar);

        //bhargavi
        this.jointMemeberFatNameRelation = this.jointMemeberData[0].pfathernamewithrelation
        this.agee1 = this.jointMemeberData[0].pdob;
        this.getAgeMember1();
      }
      if (this.agee != null) {
        this.getAgeMember();
      }

    });

    //this.pvchgroupticket=this.pvchgroupticket.toString().replace(/@/g,"'").slice(0,-1);
    // console.log("my selcted no is :",this.pvchgroupticket);
    console.log("my selcted no  is :", this.pvchgroupticket);
    //   this.pvchgroupticket = this.pvchgroupticket.split(',').map(item => item.trim().replace(/\s*-\s*/g, '-')).filter(item => item).join(',');
    // //this.pvchgroupticket = (this.pvchgroupticket || '').replace(/^[\s,]+/, '');
    //  console.log("my selcted no  is2 :",this.pvchgroupticket);
    // // this._fdrdTransService.GetBondPreviewReport(this.pvchgroupticket).subscribe(res => {
    // //   debugger;
    // //   this.liendata = res;
    //       console.log("lien data is:", this.liendata);
    //      if(this.liendata.length ===0){
    //        this.liendata = [{pvchgroupticket : null}];
    //      }
    //      else{
    //       this.liendata = this.liendata.map(item => ({
    //         ...item,
    //         pvchgroupticket: (item.pvchgroupticket || '').replace(/^[\s,]+/, '')
    //      }));
    //     //  this.liendata = this.liendata.find(item =>{
    //     //   return item.pnumappid == this.advanceAccNo
    //     //  });
    //      console.log("new lien is : ",this.liendata);
    //       }
    //   //  });
  }


  GetSaleaggrementNominee() {
    debugger;
    this._agentforsaleService.GetSaleaggrementNominee(this.fdAccountId).subscribe(data => {
      this.nomineeDetails = data;
      console.log("nominee data is: ", this.nomineeDetails);
    })
  }

  forHS() {
    debugger;
    let memberDataToGrid = this._agentforsaleService.GetAggrementmemberDetails(this.memberIdForD, this.fdAccountId)

    let floorData = this._agentforsaleService.GetAggrementFloorInventory()

    forkJoin([memberDataToGrid, floorData]).subscribe(res => {
      this.mergeData = res;
      this.dateDeposite = this.mergeData[0][0].pdepositdate;
      this.psquareyardF = this.mergeData[0][0].psquareyard;
      this.pfdaccountnoF = this.mergeData[0][0].pfdaccountno;
      this.pmaturitydateF = this.mergeData[0][0].pmaturitydate;
      this.pdepositamount2 = this._CommonService.currencyformat(this.mergeData[0][0].pdepositamount);
      this.pinterestpayable = this._CommonService.currencyformat(this.mergeData[0][0].pinterestpayable);


      this.fif = this.mergeData[0][0].psquareyard * 50000;
      this.six = this.mergeData[0][0].psquareyard * 13000;

      this.floorD = this.mergeData[1].pfloorname;
      console.log("my merged data is : ", res);
      console.log(this.dateDeposite);
      console.log(this.floorD);

      let selectedItemsdata = [];
      let data = {
        "dateDeposite": this.dateDeposite,
        "floorD": this.floorD,
        "psquareyardF": this.psquareyardF,
        "pfdaccountnoF": this.pfdaccountnoF,
        "pmaturitydateF": this.pmaturitydateF,
        "sixty": this.six,
        "fifty": this.fif,
        "pdepositamount": this.pdepositamount2
      }
      selectedItemsdata.push(data)

      this.abcd = selectedItemsdata;
      console.log('aaa', this.abcd);
      let originalDate = new Date(this.mergeData[0][0].pdepositdate); // "2025/04/11"
      originalDate.setFullYear(originalDate.getFullYear() + 5);

      // Format to MM-yyyy
      // let formattedDate = `${(originalDate.getMonth() + 1).toString().padStart(2, '0')}-${originalDate.getFullYear()}`;
      // console.log(formattedDate);
      // let newDate = originalDate.toISOString().split('T')[0];
      // let pmat = `${(this.pmaturitydateF.getMonth() + 1).toString().padStart(2, '0')}-${this.pmaturitydateF.getFullYear()}`

      let json = [{ "intAmount": this.pinterestpayable, "mpdate": this.pmaturitydateF }]

      this.intPay = json;




    })
  }
  // calculateAge(dob: string): number {
  //   const birthDate = new Date(dob);
  //   const currentDate = new Date();

  //   let age = currentDate.getFullYear() - birthDate.getFullYear();
  //   const monthDifference = currentDate.getMonth() - birthDate.getMonth();

  //   // Adjust age if the birthday hasn't occurred yet this year
  //   if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())) {
  //     age--;
  //   }
  //   return age;
  // }

  calculateAge(dob: string | null | undefined): number | null {
    if (!dob) {
      return null; // dob is null, undefined, or empty
    }

    const birthDate = new Date(dob);

    if (isNaN(birthDate.getTime())) {
      return null; // dob is an invalid date string
    }

    const currentDate = new Date();
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDifference = currentDate.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  getAgeMember(): number {
    return this.calculateAge(this.agee);
  }

  getAgeMember1(): number {
    return this.calculateAge(this.agee1);
  }

  getAgeDirector(): number {
    return this.calculateAge(this.pdobDirector1);
  }

  getAgeManager(): number {
    return this.calculateAge(this.pdobManager1);
  }

}
