import { Component, OnInit, Input } from '@angular/core';
import { timingSafeEqual } from 'crypto';
import { MembrEnquiryService } from 'src/app/Services/Banking/membr-enquiry.service';
declare let $: any;
@Component({
  selector: 'app-memberenquiryreceipts',
  templateUrl: './memberenquiryreceipts.component.html',
  styles: []
})
export class MemberenquiryreceiptsComponent implements OnInit {

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
    this.id=this.receiptdetails.pFdaccountno;
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
  }
  GetMemberReceiptDetails()
  {
    this.memberenquiryservice.GetMemberReceiptDetails(this.id).subscribe(json=>{
      this.Receiptdata=json;
      console.log("reecipt details",this.Receiptdata)
    })
  }
  getReceipt(DataItem) {
    console.log(event)
    window.open('/#/GeneralReceiptReports?id=' + btoa(DataItem.pReceiptno + ',' + 'General Receipt'));
  }
  GetMemberNomineeDetails()
  {
    this.memberenquiryservice.GetMemberNomineeDetails(this.id).subscribe(json=>{
      this.Nomineedata=json;
      console.log("nomminee details",this.Nomineedata)
    })
  }
  GetMemberInterestPaymentDetails()
  {
    this.memberenquiryservice.GetMemberInterestPaymentDetails(this.id).subscribe(json=>{
      this.Interestpaymentdata=json;
      console.log("interestpayment details",this.Interestpaymentdata)
    })
  }
  GetMemberPromoterSalaryDetails()
  {
    this.memberenquiryservice.GetMemberPromoterSalaryDetails(this.id).subscribe(json=>{
      this.promotersalarygrid=json;
      console.log("promotersalary details",this.promotersalarygrid)
    })
  }
  GetMemberLiensDetails()
  {
    this.memberenquiryservice.GetMemberLiensDetails(this.id).subscribe(json=>{
      this.liengrid=json;
      console.log("liengrid details",this.liengrid)
    })
  }
  GetMemberMaturityBondsDetails()
  {
    this.memberenquiryservice.GetMemberMaturityBondsDetails(this.id).subscribe(json=>{
      this.membermaturitybond=json;
      console.log("membermaturitybond details",this.membermaturitybond)
    })
  }
  GetMemberMaturityPaymentsDetails()
  {
    this.memberenquiryservice.GetMemberMaturityPaymentsDetails(this.id).subscribe(json=>{
      this.memberpaymentgrid=json;
      console.log("memberpaymentgrid details",this.memberpaymentgrid)
    })
  }
}
