import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TdsreportService } from 'src/app/Services/Tds/tdsreport.service';

@Component({
  selector: 'app-challana-payment-report',
  templateUrl: './challana-payment-report.component.html',
  styles: []
})
export class ChallanaPaymentReportComponent implements OnInit {

  constructor(private activatedroute: ActivatedRoute,private tdsservice:TdsreportService) { }

  companyaddress:any;
  companyname:any;
  amount:any;
  Tanno:any;
  CurrentYear:string;
  section:any;
  cy1:any;
  shownoncompany:boolean=false;
  showcompany:boolean=false
  cy2:any;
  cy3:any;
  cy4:any;
  nextyear:any;
  ny1:any;
  ny2:any;
  ngOnInit()
   {
     debugger
    let routeParams = atob(this.activatedroute.snapshot.queryParamMap.get('id')); 
    console.log("routeParams",routeParams);

     this.tdsservice.GetChallanaPaymentReport(routeParams).subscribe(res=>{
       if(res)
       {
         console.log("challana payment report is",res)
         this.companyname=res['pCompanyName'];
         if(res['pCompanyType']=="Non-Company")
         {
           this.shownoncompany=true;
           this.showcompany=false;
         }
         else
         {
          this.shownoncompany=false;
          this.showcompany=true;
         }
         this.companyaddress=res['pAddress'];
         this.Tanno=res['pTanNo'];
         this.amount=res['pActualTdsAmount'];
         this.section=res['pSection']
         this.CurrentYear=res['pCurrentYear'];
         this.nextyear=res['pNextYear']
         debugger;
         this.cy1=this.CurrentYear.toString().charAt(0)
         this.cy2=this.CurrentYear.toString().charAt(1)
         this.cy3=this.CurrentYear.toString().charAt(2)
         this.cy4=this.CurrentYear.toString().charAt(3)
         this.ny1=this.nextyear.toString().charAt(2)
         this.ny2=this.nextyear.toString().charAt(3)
       }
     })
  }

}
