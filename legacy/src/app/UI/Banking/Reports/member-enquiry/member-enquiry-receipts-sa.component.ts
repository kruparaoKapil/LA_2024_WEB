import { Component, OnInit, Input } from '@angular/core';
import { timingSafeEqual } from 'crypto';
import { MembrEnquiryService } from 'src/app/Services/Banking/membr-enquiry.service';
declare let $: any;
@Component({
  selector: 'app-member-enquiry-receipts-sa',
  templateUrl: './member-enquiry-receipts-sa.component.html',
  styles: []
})
export class MemberenquiryreceiptsSAComponent implements OnInit {

  constructor(private memberenquiryservice:MembrEnquiryService) { }
  @Input() receiptdetails;
  id:any;
  Receiptdata:any=[];
  Nomineedata:any=[];
  lstwithdrawalDetails:any=[];
  promotersalarygrid:any=[];
  membermaturitybond:any=[];
  memberpaymentgrid:any=[]
  liengrid:any=[];
  type:any;
  ngOnInit() 
  {
    debugger;
    console.log(this.receiptdetails);
    this.id=this.receiptdetails.paccountno;
    $(document).ready(function () {
     // Add minus icon for collapse element which is open by default
      //$(".collapse.show").each(function () {
      // $(this).prev(".card-header").find(".fa").addClass("fa-minus").removeClass("fa-plus");
      //});

      //Toggle plus minus icon on show hide of collapse element
      $(".collapse").on('show.bs.collapse', function () {
        $(this).prev(".card-header").find(".fa").removeClass("fa-plus").addClass("fa-minus");
      }).on('hide.bs.collapse', function () {
        $(this).prev(".card-header").find(".fa").removeClass("fa-minus").addClass("fa-plus");
      });

    });
    this.GetMemberReceiptDetails();
  }
  GetMemberReceiptDetails()
  {
    this.memberenquiryservice.GetSavinaccountDetailsReport(this.id).subscribe(json=>{
        debugger
       this.Nomineedata=json[0].lstNomieeDetails;
       this.receiptdetails=json[0].lstReceiptDetails ;
       this.lstwithdrawalDetails=json[0].lstWithdrwalDetails 
      console.log("reecipt details",this.Receiptdata)
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
}
