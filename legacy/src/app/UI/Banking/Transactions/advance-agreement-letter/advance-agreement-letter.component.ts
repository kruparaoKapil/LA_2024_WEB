import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AgentForSaleService } from 'src/app/Services/Banking/Transactions/agent-for-sale.service';
import { CommonService } from 'src/app/Services/common.service';

@Component({
  selector: 'app-advance-agreement-letter',
  templateUrl: './advance-agreement-letter.component.html',
  styles: []
})
export class AdvanceAgreementLetterComponent implements OnInit {
  companyDetails: any = [];
  pcompany_name: any;
  plocation: any;
  pcin: any;
  memberIdForD: string;
  memberData: any = [];
  agee: any;
  pdepositamount: any;
  calDepAmount: number;
  psquareyard: any;
  pmaturitydate: any;
  pdepositdate: any;
  pbuildingname: any;
  accountNo: string;
  today: Date = new Date();
  saveType: string;
  fdAccountId: string;
  pmembername: any;
  blank: any;


  constructor(private _agentforsaleService: AgentForSaleService, private _CommonService: CommonService, private activatedroute: ActivatedRoute) { }

  ngOnInit() {
    let routeParams = atob(this.activatedroute.snapshot.queryParamMap.get('id'));
    let splitData = routeParams.split(",")
    console.log("routeParams", routeParams);
    this.memberIdForD = splitData[0];
    this.accountNo = splitData[2];
    this.saveType = splitData[1];
    this.fdAccountId = splitData[3];

    this.getAggrementCompanyAddress();
    const companydata = this._CommonService.comapnydetails;
    this.pcompany_name = companydata.pCompanyName;
    this.plocation = companydata.pAddress2;
    this.pcin = companydata.pCinNo;

    this.GetAggrementmemberDetails();
  }

  getAggrementCompanyAddress() {
    debugger;
    this._agentforsaleService.getAggrementCompanyAddress().subscribe(data => {
      this.companyDetails = data;
    })
  }

  GetAggrementmemberDetails() {
    debugger;
    this._agentforsaleService.GetAggrementmemberDetails(this.memberIdForD, this.fdAccountId).subscribe(resData => {
      this.memberData = resData;
      console.log('this is agreement letter data:', resData);

      this.agee = this.memberData[0].pdob;
      //  this.pdepositamount =  this.memberData[0].pdepositamount.toString().replace(/,/g, "");
      //bhargavi
      let deposit = this.memberData[0].pdepositamount.split('.');
      this.pdepositamount = deposit[0];
      //bhargavi
      this.calDepAmount = this.memberData[0].psquareyard * 13000;
      this.psquareyard = this.memberData[0].psquareyard;
      this.pdepositdate = this.memberData[0].pdepositdate;
      this.pmaturitydate = this.memberData[0].pmaturitydate;
      this.pmembername = this.memberData[0].pmembername;
    })
  }

  getSaleagreementCompanydetails() {
    debugger;
    this._agentforsaleService.getSaleagreementCompanydetails().subscribe(res => {
      if (res.length > 0) {
        this.pbuildingname = res[0].pbuildingname;
      }
    });
  }

}
