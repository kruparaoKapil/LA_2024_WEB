import { Component, OnInit } from '@angular/core';
import { LAReportsService } from 'src/app/Services/Banking/lareports.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-application-form-report',
  templateUrl: './application-form-report.component.html',
  styles: []
})
export class ApplicationFormReportComponent implements OnInit {
  companyname: any;
  companyaddress: any;
  age: any;
  dateofbirth: any;
  memberaddress: any;
  mobileno: any;
  mailid: any;
  receiptdate: any;
  receiptno: any;
  nominees: any;
  membername: any;
  titlename: any;
  female:boolean=false
  male:boolean=false
  checkmale:boolean=false
  checkfemale:boolean=false
  constructor(private _LAReportsService:LAReportsService,private activatedroute: ActivatedRoute) { }

  ngOnInit()
   {
    let routeParams = atob(this.activatedroute.snapshot.queryParamMap.get('id')); 
    console.log("routeParams",routeParams);
    this.male=true;
    this.female=true;
    this.checkfemale=false;
    this.checkmale=false;

    this._LAReportsService.GetApplicationFormDetails(routeParams).subscribe(json=>{
      if(json)
      {
        console.log(json)
        this.companyname=json['pCompanyName']
        this.companyaddress=json['pCompanyAddress']
        this.age=json['pAge']
        this.dateofbirth=json['pDob']
        this.memberaddress=json['pMemberAddress']
        this.mobileno=json['pMobileNo']
        this.mailid=json['pMailId']
        this.receiptdate=json['pReceiptDate'];
        this.receiptno=json['pReceiptNo']
        this.nominees=json['pNominee'];
        this.membername=json['pMemberName'];
        this.titlename=json['pTitleName'];
        if(json['pGender']=='M')
        {
          this.checkmale=true;
          this.checkfemale=false
        }
        else if(json['pGender']=='F'){
          this.checkfemale=true;
          this.checkmale=false
        }
      }
    })
  }

}
