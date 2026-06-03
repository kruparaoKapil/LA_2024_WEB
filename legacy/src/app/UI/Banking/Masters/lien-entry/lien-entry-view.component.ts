import { Component, OnInit, ViewChild } from '@angular/core';
import { LienEntryService } from 'src/app/Services/Banking/lien-entry.service';
import { CommonService } from 'src/app/Services/common.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FdTranscationDetailsComponent } from '../../Transactions/FD-AC-Creation/fd-transcation-details.component';
import { process } from '@progress/kendo-data-query';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { FdReceiptService } from 'src/app/Services/Banking/Transactions/fd-receipt.service';
import { ContacmasterService } from 'src/app/Services/Loans/Masters/contacmaster.service';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
declare let $: any
@Component({
  selector: 'app-lien-entry-view',
  templateUrl: './lien-entry-view.component.html',
  styles: []
})
export class LienEntryViewComponent implements OnInit
 {
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  @ViewChild(FdTranscationDetailsComponent, { static: true }) fdTranscationDetailsComponent: FdTranscationDetailsComponent;
  LienGridlist: any;
  LienDataForEdit: any;
  pdfData: any = [];
  pMembername: any;
  public comapnydata: any;
  public pCompanyName: any;
 
  public pAddress1: any;
  public pAddress2: any;
  public pcity: any;
  public pCountry: any;
  public pState: any;
  public pDistrict: any;
  public pPincode: any;
  public pCinNo: any;
  public pGstinNo: any;
  public pBranchname: any
  companyName: string;
  pLiendate: any;
  pCompanybranch: any;
  pDepositamount: any;
  pLienadjuestto: any;
  companyNameDet: Response;
  pFdaccountno: any;
  pLienamount: any;
  addtessStatic: any;
  pAddress: any;
  lienEntryList: any =[];
  public newDate: Date = new Date();
  constructor(private router: Router,private datePipe: DatePipe,private _LienEntryService: LienEntryService,private _commonservice: CommonService, private _FdReceiptService:FdReceiptService, private _contacmasterservice:ContacmasterService) { 
    this.allData = this.allData.bind(this);

  }
  gridview:any;
  ngOnInit() {
    this.BindData();
    this.getComapnyName() ;

  }
  NewButtonClick(type) {
    debugger
    this._LienEntryService.SetButtonClickType(type)
  }
BindData(){
this._LienEntryService.GetLienMaingridView().subscribe(res=>{
  this.LienGridlist=res;
 // this.gridData = json
      this.gridview = this.LienGridlist
//  if (this.LienGridlist.length>0){
//    this.LienGridlist = this.LienGridlist.filter(x => x.pLiendate =this.datePipe.transform(x.pLiendate, "dd-MMM-yyyy"));
//}
});
  }
  datatableclickedit(event) {
    debugger;
    let LienId = event.dataItem.pLienid;
    this._LienEntryService.SetButtonClickType('Edit')
    this._LienEntryService.GetLienEntryData(LienId).subscribe(json => {
      debugger;
      if (json) {

        this.LienDataForEdit = json;
        this._LienEntryService.SetLienEntryDataForEdit(this.LienDataForEdit);
        var myparams = btoa(LienId);
        this.router.navigate(['/LienEntryNew', { id: myparams }]);
       // this.router.navigateByUrl('/LienEntryNew')
      }
    });
  }
  GetAccountDetails(DataItem) {
    debugger;

    this.fdTranscationDetailsComponent.BindData(DataItem.pFdaccountno,DataItem.pFdaccountID);
    $('#add-detail').modal('show');
  }

  selectAllStudentsChange(event,DataItem){
    debugger;
    // this.pdfData = DataItem;
    // this.pMembername = this.pdfData.pMembername;
    // this.pLiendate = this.pdfData.pLiendate;
    // this.pCompanybranch = this.pdfData.pCompanybranch;
    // this.pDepositamount = this.pdfData.pDepositamount;
    // this.pLienadjuestto = this.pdfData.pLienadjuestto;
    // this.pLienamount = this.pdfData.pLienamount;

    // this._FdReceiptService.GetFdDetailsById(DataItem.pFdaccountno,DataItem.pFdaccountID).subscribe(jjjj => {
    //   this.companyNameDet = jjjj[0].pCompanyName;
    //   this.pFdaccountno = jjjj[0].pFdaccountno;
    //   this.pAddress = jjjj[0].pAddress;
    // })

    // this._contacmasterservice.getContactDetailsByID(181).subscribe(json =>{
    //   this.addtessStatic = json.pAddressList[0].pAddress1;
      
    // })

    this.GetLienentryById(DataItem.pLienid)

    DataItem.pLienid

  }

  GetLienentryById(id){
    debugger
    this._LienEntryService.GetLienentryById(id).subscribe(data => {
      this.lienEntryList = data;
    //let aaa = data['pAddress'] ? data['pAddress'].toString().replace(/@/g, "'"): '';
    // this.pAddress = aaa;

      this.pAddress1 = data['pAddress1'];
      this.pAddress2 = data['pAddress2'];
      this.pcity = data['city'];
      this.pState = data['state'];
      this.pPincode =  data['pincode'];
      this.pMembername = data['pMembername'];
      this.companyNameDet = data['pCompanyname'];
      this.pCompanybranch = data['pCompanybranch'];
      this.pLienadjuestto = data['pLienadjuestto'];
      this.pFdaccountno = data['pFdaccountno'];
      this.pDepositamount = data['pDepositamount'];
      this.pLienamount = data['pLienamount'];
      this.pLiendate = data['pLiendate'];

    })

  }

  

  removeHandler(event) {
    debugger;
    let data = event.dataItem
    let LienId = data.pLienid;

    this._LienEntryService.DeleteLienEntry(LienId).subscribe(json => {
      debugger;
      if (json) {
        this.BindData();
      }


    })
  }
  onFilter(inputValue: string) {
   debugger
    this.gridview = process(this.LienGridlist, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'pLiendate',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pMembername',
            operator: 'contains',
            value: inputValue
          }, {
            field: 'pDepositdate',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pFdaccountno',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pDepositamount',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pLienamount',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pCompanybranch',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pLienadjuestto',
            operator: 'contains',
            value: inputValue
          }
        ],
      }
    }).data;
    this.dataBinding.skip = 0;
  }

  public getComapnyName() {
    debugger;
      this.comapnydata = this._commonservice.comapnydetails;
      this.pCompanyName = this.comapnydata['pCompanyName'];
      this.pAddress1 = this.comapnydata['pAddress1'];
      this.pAddress2 = this.comapnydata['pAddress2'];
      this.pcity = this.comapnydata['pcity'];
      this.pCountry = this.comapnydata['pCountry'];
      this.pState = this.comapnydata['pState'];
      this.pDistrict = this.comapnydata['pDistrict'];
      this.pPincode = this.comapnydata['pPincode'];
      this.pCinNo = this.comapnydata['pCinNo'];
      this.pGstinNo = this.comapnydata['pGstinNo'];
      this.pBranchname = this.comapnydata['pBranchname'];
  }

  print() {
    debugger;
    let printContents, popupWin;
    printContents = document.getElementById('lienpdf').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Lien Entry</title>
          <link rel="stylesheet" type="text/css" href="assets/css/bootstrap.min.css"/>
          
           <link rel="stylesheet" href="http://kendo.cdn.telerik.com/2019.3.917/styles/kendo.common.min.css" />
           <link rel="stylesheet" href="http://kendo.cdn.telerik.com/2019.3.917/styles/kendo.default.min.css" />
           <link rel="stylesheet" href="http://kendo.cdn.telerik.com/2019.3.917/styles/kendo.default.mobile.min.css" />
         <link rel="stylesheet" type="text/css" href="assets/css/custom.css" />
          <style>
              @media print {
                @page {
                  size:A4;
                  margin:1cm;
                  width:210mm;
                  height:297mm;
                }
                p {
                  font-size:20px !important;
                }
              }
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }


  public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.gridview, {
        sort: [{ field: "pDepositdate", dir: "asc" }],
      }).data,
    };

    return result;
  }
  
}
