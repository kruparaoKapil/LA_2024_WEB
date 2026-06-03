import { Component, OnInit, Input } from '@angular/core';
import { timingSafeEqual } from 'crypto';
import { MembrEnquiryService } from 'src/app/Services/Banking/membr-enquiry.service';
declare let $: any;
@Component({
  selector: 'app-member-enquiry-receipts-rd',
  templateUrl: './member-enquiry-receipts-rd.component.html',
  styles: []
})
export class MemberenquiryreceiptsRDComponent implements OnInit {

  constructor(private memberenquiryservice:MembrEnquiryService) { }
  @Input() receiptdetails;
  id:any;
  Receiptdata:any=[];
  Nomineedata:any=[];
  Interestpaymentdata:any=[];
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
    this.memberenquiryservice.GetRDDetailsReport(this.id).subscribe(json=>{
      debugger;
      this.Receiptdata=json[0].lstRdReceiptDetails;
      this.Nomineedata=json[0].lstNomieeDetails;
      this.membermaturitybond=json[0].lstMaturityBondDetails;
      this.memberpaymentgrid=json[0].lstMaturityPaymentsDetails;
      this.promotersalarygrid=json[0].lstPromoterSalarytDetails;
      
      console.log("reecipt details",this.Receiptdata)
    })
  }
  getReceipt(DataItem) {
    console.log(event)
    window.open('/#/GeneralReceiptReports?id=' + btoa(DataItem.pReceiptno + ',' + 'General Receipt'));
  }
}
