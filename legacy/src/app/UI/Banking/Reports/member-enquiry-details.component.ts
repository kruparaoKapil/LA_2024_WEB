import { Component, OnInit } from '@angular/core';
import { LAReportsService } from 'src/app/Services/Banking/lareports.service';
import { ActivatedRoute } from '@angular/router';
import { DefaultProfileImageService } from 'src/app/Services/Loans/Masters/default-profile-image.service';
import { MembrEnquiryService } from 'src/app/Services/Banking/membr-enquiry.service';


@Component({
  selector: 'app-member-enquiry-details',
  templateUrl: './member-enquiry-details.component.html',
  styles: [
    
  ]
})
export class MemberEnquiryDetailsComponent implements OnInit {

  membername: any;
  membercode: any;
  public type='';
  contactno: any;
  address: any;
  fathername: any;
  bankdetails:any=[]
  fdaccountno: any;
  advanceamount: any;
  advancedate: any;
  calculationmode: any;
  interestpayout: any;
  paidamount: any;
  receivedamount: any;
  schemename: any;
  tenure: any;
  maturitydate: any;
  transcationdate: any;
  interestrate: any;
  interestpayable: any;
  pendingchequeamount: any;
  maturityamount: any;
  applicanttype: any;
  branchname: any;
  interesttype: any;
  contacttype: any;
  constructor(private _LAReportsService:LAReportsService,private _MembrEnquiryService:MembrEnquiryService,private _defaultimage: DefaultProfileImageService,private activatedroute: ActivatedRoute) { }
  Detailsdata:any=[]
  liendetails:any=[]
  transcationdetails:any=[]
  Nomineedata:any=[]
  Receiptdata:any=[]
  Withdrawalsdetails:any=[];
  promotersalarygrid:any=[]
  Interestpaymentdata:any=[]
  memberpaymentgrid:any=[]
  membermaturitybond:any=[]
  croppedImage:any;
  ngOnInit() 
  {
    debugger;
    let routeParams = atob(this.activatedroute.snapshot.queryParamMap.get('id')); 
    let accountno=routeParams.split(',')[0];
    this.type=routeParams.split(',')[1];
      console.log("routeParams",routeParams);
      this.croppedImage = this._defaultimage.GetdefaultImage();
      if(this.type=='FD'){
      this.Get_Fd_receipt_details(accountno);
      }
      else if(this.type=='RD'){
      this. Get_RD_receipt_details(accountno);
      }
      else if(this.type=='SHARE'){
      this.Get_Share_receipt_details(accountno);
      }
      else{
      this.Get_SA_receipt_details(accountno);
      }

  }
  Get_Fd_receipt_details(accountno){
    debugger;
    
    this._LAReportsService.GetMemberEnquiryDetailsReport(accountno).subscribe(result => {
      debugger;
      console.log("print grid",result)
      this.Detailsdata = result;
      if (result[0].pContactImagePath)
      {
        this.croppedImage = "data:image/png;base64," +result[0].pContactImagePath;
      }
      
    else
    {
      this.croppedImage = this._defaultimage.GetdefaultImage();
    }
     
     this.membername=this.Detailsdata[0].lstMemberDetails[0].pMembername
     this.membercode=this.Detailsdata[0].lstMemberDetails[0].pMembercode
     this.contactno=this.Detailsdata[0].lstMemberDetails[0].pMobileno
     this.address=this.Detailsdata[0].lstMemberDetails[0].pAddress
     this.fathername=this.Detailsdata[0].lstMemberDetails[0].pFathername
      this.bankdetails=this.Detailsdata[0].lstMemberBankDetails
      this.Nomineedata=this.Detailsdata[0].lstMemberNomieeDetails
      this.Receiptdata=this.Detailsdata[0].lstMemberReceiptDetails
      this.liendetails=this.Detailsdata[0].lstMemberLientDetails
      this.memberpaymentgrid=this.Detailsdata[0].lstMemberMaturityPaymentsDetails
      this.membermaturitybond=this.Detailsdata[0].lstMemberMaturityBondDetails
      this.Interestpaymentdata=this.Detailsdata[0].lstMemberInterestPaymentDetails
      this.promotersalarygrid=this.Detailsdata[0].lstMemberPromoterSalarytDetails
      this.transcationdetails=this.Detailsdata[0].lstMemberTransactionDetails
      this.fdaccountno=this.Detailsdata[0].lstMemberTransactionDetails[0].pFdaccountno
      this.advanceamount=this.Detailsdata[0].lstMemberTransactionDetails[0].pDepositamount
      this.advancedate=this.Detailsdata[0].lstMemberTransactionDetails[0].pDepositdate
 
      this.calculationmode=this.Detailsdata[0].lstMemberTransactionDetails[0].pFdcalculationmode
      this.interestpayout=this.Detailsdata[0].lstMemberTransactionDetails[0].pInterestpayout
      this.paidamount=this.Detailsdata[0].lstMemberTransactionDetails[0].pPaidamount
      this.receivedamount=this.Detailsdata[0].lstMemberTransactionDetails[0].pReceivedamount
      this.schemename=this.Detailsdata[0].lstMemberTransactionDetails[0].pSchemename
      this.tenure=this.Detailsdata[0].lstMemberTransactionDetails[0].pTenure
      this.maturitydate=this.Detailsdata[0].lstMemberTransactionDetails[0].pMaturitydate
      this.transcationdate=this.Detailsdata[0].lstMemberTransactionDetails[0].pTransactiondate
      this.interestrate=this.Detailsdata[0].lstMemberTransactionDetails[0].pInterestrate
      this.interestpayable=this.Detailsdata[0].lstMemberTransactionDetails[0].pInterestpayable
      this.pendingchequeamount=this.Detailsdata[0].lstMemberTransactionDetails[0].pPendingchequeamount
      this.maturityamount=this.Detailsdata[0].lstMemberTransactionDetails[0].pMaturityamount
      this.applicanttype=this.Detailsdata[0].lstMemberTransactionDetails[0].pApplicanttype
      this.branchname=this.Detailsdata[0].lstMemberTransactionDetails[0].pChitbranchname
      this.interesttype=this.Detailsdata[0].lstMemberTransactionDetails[0].pInteresttype
      this.contacttype=this.Detailsdata[0].lstMemberTransactionDetails[0].pContacttype
      
  })
  }
   Get_RD_receipt_details(accountno){
    debugger;
    
    this._MembrEnquiryService.GetRDDetailsReport(accountno).subscribe(result => {
      debugger;
      console.log("print grid",result)
      this.Detailsdata = result;
    //   if (result[0].pContactImagePath)
    //   {
    //     this.croppedImage = "data:image/png;base64," +result[0].pContactImagePath;
    //   }
      
    // else
    // {
    //   this.croppedImage = this._defaultimage.GetdefaultImage();
    // }
     if(this.Detailsdata[0].lstMaturityBondDetails.length>0){
      this.membermaturitybond=this.Detailsdata[0].lstMaturityBondDetails 
     }
     if(this.Detailsdata[0].lstMaturityPaymentsDetails.length>0){
       this.memberpaymentgrid=this.Detailsdata[0].lstMaturityPaymentsDetails
     }
     if(this.Detailsdata[0].lstNomieeDetails.length>0){
         this.Nomineedata=this.Detailsdata[0].lstNomieeDetails
     }
     if(this.Detailsdata[0].lstPromoterSalarytDetails.length>0){
      this.promotersalarygrid=this.Detailsdata[0].lstPromoterSalarytDetails 
     }
     if(this.Detailsdata[0].lstRdReceiptDetails.length>0){
       this.Receiptdata=this.Detailsdata[0].lstRdReceiptDetails   
     }
    
     this.membername=this.Detailsdata[0].lstMemberDetails[0].pMembername
     this.membercode=this.Detailsdata[0].lstMemberDetails[0].pMembercode
     this.contactno=this.Detailsdata[0].lstMemberDetails[0].pMobileno
     this.address=this.Detailsdata[0].lstMemberDetails[0].pAddress
     this.fathername=this.Detailsdata[0].lstMemberDetails[0].pFathername;
     this.GetImageData(this.Detailsdata[0].lstMemberDetails[0].pMemberid);
      
      
  })
  }
   Get_Share_receipt_details(accountno){
    debugger;
    
    this._MembrEnquiryService.GetMemberShareReceiptDetails(accountno).subscribe(result => {
      debugger;
      console.log("print grid",result)
      this.Detailsdata = result;
    //   if (result[0].pContactImagePath)
    //   {
    //     this.croppedImage = "data:image/png;base64," +result[0].pContactImagePath;
    //   }
      
    // else
    // {
    //   this.croppedImage = this._defaultimage.GetdefaultImage();
    // }
     if(this.Detailsdata[0].lstNomieeDetails.length>0){
      this.Nomineedata=this.Detailsdata[0].lstNomieeDetails
      
       
     }
     if(this.Detailsdata[0].lstReceiptDetails.length>0){
       this.Receiptdata=this.Detailsdata[0].lstReceiptDetails
       
     }
     if(this.Detailsdata[0].lstWithdrwalDetails.length>0){
         this.Withdrawalsdetails=this.Detailsdata[0].lstWithdrwalDetails
     }
     this.membername=this.Detailsdata[0].lstMemberDetails[0].pMembername
     this.membercode=this.Detailsdata[0].lstMemberDetails[0].pMembercode
     this.contactno=this.Detailsdata[0].lstMemberDetails[0].pMobileno
     this.address=this.Detailsdata[0].lstMemberDetails[0].pAddress
     this.fathername=this.Detailsdata[0].lstMemberDetails[0].pFathername;
     this.GetImageData(this.Detailsdata[0].lstMemberDetails[0].pMemberid);
    
      
  })
   }
   Get_SA_receipt_details(accountno){
    debugger;
    
    this._MembrEnquiryService.GetSavinaccountDetailsReport(accountno).subscribe(result => {
      debugger;
      console.log("print grid",result)
      this.Detailsdata = result;
     if(this.Detailsdata[0].lstNomieeDetails.length>0){
      this.Nomineedata=this.Detailsdata[0].lstNomieeDetails
      
       
     }
     if(this.Detailsdata[0].lstReceiptDetails.length>0){
       this.Receiptdata=this.Detailsdata[0].lstReceiptDetails
       
     }
     if(this.Detailsdata[0].lstWithdrwalDetails.length>0){
         this.Withdrawalsdetails=this.Detailsdata[0].lstWithdrwalDetails
     }
     this.membername=this.Detailsdata[0].lstMemberDetails[0].pMembername
     this.membercode=this.Detailsdata[0].lstMemberDetails[0].pMembercode
     this.contactno=this.Detailsdata[0].lstMemberDetails[0].pMobileno
     this.address=this.Detailsdata[0].lstMemberDetails[0].pAddress
     this.fathername=this.Detailsdata[0].lstMemberDetails[0].pFathername
     this.GetImageData(this.Detailsdata[0].lstMemberDetails[0].pMemberid);
      
  })
   }
  getReceipt(DataItem) {
    console.log(event)
    window.open('/#/GeneralReceiptReports?id=' + btoa(DataItem.pReceiptno + ',' + 'General Receipt'));
  }
  getVoucherno(DataItem) {
        debugger;
        window.open('/#/PaymentVoucherReports?id=' + btoa(DataItem.pVoucherno + ',' + 'Payment Voucher'));
        
    }
    GetImageData(memberid){
      debugger;
      this._MembrEnquiryService.GetMemberTransactions(memberid).subscribe(json=>{
         debugger;
           if (json[0].pImage)
            this.croppedImage = "data:image/png;base64," + json[0].pImage;
         else
            this.croppedImage = this._defaultimage.GetdefaultImage();
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
          <title>Member Enquiry</title>
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
