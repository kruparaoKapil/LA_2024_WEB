import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FdRdTransactionsService } from 'src/app/Services/Banking/Transactions/fd-rd-transactions.service';
import { JsonPipe } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';

@Component({
  selector: 'app-bond-preview',
  templateUrl: './bond-preview.component.html',
  styles: []
})
export class BondPreviewComponent implements OnInit {
  data2: any;
  data1: any=[]
  ShowData:any=[];
  //shownominee:boolean;
  todaydate:any;
  //showlien:boolean;
  certificateno: any;
  ratepersquareyard: any;
  constructor(private activatedroute: ActivatedRoute,private _fdrdtranscationservice:FdRdTransactionsService) { }
  receiptName:any;
  griddata:any=[];
  
  ngOnInit() 
  {
    debugger;
   // this.showlien=false;
  //  this.shownominee=false;
    this.todaydate=new Date()
    let routeParams = atob(this.activatedroute.snapshot.queryParamMap.get('id')); 
    console.log("routeParams",routeParams);
    
    // let splitData = routeParams.split(",");
    // this.receiptName = splitData[1];
    // console.log(routeParams)
    this._fdrdtranscationservice.GetBondPreviewReport(routeParams).subscribe(res=>{
   debugger;
    let data=JSON.stringify(res);
    console.log(res['_BondsPreviewDTOLst'])
    //this.ShowData=res['_BondsPreviewDTOLst'];
    this.ShowData=res;
    this.ShowData.filter(data=>data.pSquareyard=isNullOrEmptyString(data.pSquareyard)?0:data.pSquareyard)
    // if(this.ShowData.pSquareyard!=null && this.ShowData.pSquareyard!=undefined)
    // {
    //   this.ratepersquareyard=this.ShowData.pSquareyard
    // }
   
    //this.certificateno=res['_BondsPreviewDTOLst'].pFdaccountno
    for( let i=0;i<this.ShowData.length;i++)
    {
    
      if(res['_BondsPreviewDTOLst'][i].plstNomieeDetails.length!=0)
      {
        this.griddata=res['_BondsPreviewDTOLst'][i].plstNomieeDetails;
       // this.shownominee=true;
       
      }
      else{
       // this.shownominee=false;
      }
      if(res['_BondsPreviewDTOLst'][i].plstLienDetails.length!=0)
      {
        this.data1=res['_BondsPreviewDTOLst'][i].plstLienDetails
        //this.showlien=true;
       
      }
      else{
      //  this.showlien=false;
      }
     
     
      //this.certificateno=res['_BondsPreviewDTOLst'][i].pFdaccountno
      
    }
   
    
    //this.data2=res['_BondsPreviewDTOLst'][0].plstLienDetails[1].pLiento;
    console.log("report result is",this.data1);

    })
  }
  print() {
    let printContents, popupWin;
    printContents = document.getElementById('temp-box').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Bond Preview</title>
          <link rel="stylesheet" type="text/css" href="assets/css/bootstrap.min.css"/>
           <link rel="stylesheet" href="http://kendo.cdn.telerik.com/2019.3.917/styles/kendo.common.min.css" />
           <link rel="stylesheet" href="http://kendo.cdn.telerik.com/2019.3.917/styles/kendo.default.min.css" />
           <link rel="stylesheet" href="http://kendo.cdn.telerik.com/2019.3.917/styles/kendo.default.mobile.min.css" />
         <link rel="stylesheet" type="text/css" href="assets/css/custom.css" />
          <style>
          //........Customized style.......
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }
}
