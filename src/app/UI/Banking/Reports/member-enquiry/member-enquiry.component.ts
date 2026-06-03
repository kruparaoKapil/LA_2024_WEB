import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MembrEnquiryService } from 'src/app/Services/Banking/membr-enquiry.service';
import { DefaultProfileImageService } from 'src/app/Services/Loans/Masters/default-profile-image.service';
import { isNull } from '@angular/compiler/src/output/output_ast';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
declare let $: any;
@Component({
  selector: 'app-member-enquiry',
  templateUrl: './member-enquiry.component.html',
  styleUrls: ['./member-enquiry.component.css']
})
export class MemberEnquiryComponent implements OnInit {
  memberid: any;
  fdaccountno: any;

  constructor(private _fb:FormBuilder, private _defaultimage: DefaultProfileImageService,private memberenquiryservice:MembrEnquiryService) { }
  MemberEnquiryform: FormGroup;
  memberdetails:any=[];
  showdetails:boolean=false
  Bankdetails:any=[]
  RdAccountDetalis:any=[];
  Transcationdetails:any=[]
  Memberid:any;
  sharedetails:any=[];
  MemberCode:any;
  Fathername:any;
  Address:any;
  DetailsType="";
  Contactdetails:any;
  croppedImage:any;
  ngOnInit()
 {
   this.showdetails=false;
   this.sharedetails=[];
   this.RdAccountDetalis=[];
   this.MemberEnquiryform=this._fb.group({
    pMembercode:new FormControl(''),
    pMembername:new FormControl(null)
   })
   this.croppedImage = this._defaultimage.GetdefaultImage();
    this.Getmembers();
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
  Getmembers()
  {
    
     this.memberenquiryservice.GetMemberDetailsList().subscribe(json=>{
       this.memberdetails=json;
       console.log("members list",this.memberdetails)
     })
  }
  
  print_FD_RD_SA_Share(dataItem,type)
  {
    debugger;
    let paccountno;
    console.log("dataItem",dataItem)
    if(type=='FD'){
     paccountno=btoa(dataItem.pFdaccountno +','+ type)
    }
    else{
    paccountno=btoa(dataItem.paccountno +','+ type);
    }
    window.open('/#/MemberEnquirydetails?id='+ paccountno)
  }
  MemberChanges(event)
  {
    debugger
    if(event!=null && event!=undefined)
    {
      this.showdetails=true
      this.MemberCode=event.pMembercode;
      this.Address=event.pAddress;
      this.Contactdetails=event.pMobileno;
      this.memberid=event.pMemberid;
      this.Fathername=event.pFathername;
       $(document).ready(function () {
      //Toggle plus minus icon on show hide of collapse element
      $(".collapse").on('show.bs.collapse', function () {
        $(this).prev(".card-header").find(".fa").removeClass("fa-plus").addClass("fa-minus");
      }).on('hide.bs.collapse', function () {
        $(this).prev(".card-header").find(".fa").removeClass("fa-minus").addClass("fa-plus");
      });

    });
      this.GetMemberFDTransactions();
      this.GetMemberShareDetails();
      this.GetSavingAccountDetails();
      this.GetRDAccountDetails();
    }
    else{
      this.showdetails=false
      this.MemberCode='';
      this.Address='';
      this.Contactdetails='';
      this.memberid='';
      this.Fathername='';
      this.Transcationdetails=[];
      this.sharedetails=[];
      this.Bankdetails=[];
      this.RdAccountDetalis=[];
      this.croppedImage = this._defaultimage.GetdefaultImage();
    }
  
  }
  //bhargavi start
  // customSearchFn(term: string, item: any) {
  //   debugger;
  //   console.log(item)
  //   term = term.toLowerCase();
  //   if (isNullOrEmptyString(item.pMobileno)) {
  //     return item.pMembername.toLowerCase().indexOf(term) > -1 || item.pMembercode.toLowerCase().indexOf(term) > -1 ;
  //   }
  //   else {
  //     return item.pMembername.toLowerCase().indexOf(term) > -1 || item.pMembercode.toLowerCase().indexOf(term) > -1 || item.pMobileno.toString().toLowerCase().indexOf(term) > -1;
  //   }
    
  // }

  customSearchFn(term: string, item: any) {
    debugger
    console.log(item)
    term = term.toLowerCase();
    
    const contactName = item.pMembername ? item.pMembername.toLowerCase() : '';
    const contactreferenceid = item.pMembercode ? item.pMembercode.toLowerCase() : '';
    const contactNumber = item.pMobileno ? item.pMobileno.toString().toLowerCase() : '';
  
    return contactName.indexOf(term) > -1 || contactreferenceid.indexOf(term) > -1 || contactNumber.indexOf(term) > -1;
  }

  //bhargavi end
  GetMemberShareDetails(){
    debugger;
      this.memberenquiryservice.GetMemberShareDetails(this.memberid).subscribe(json=>{
        debugger;
           console.log("Share details",json);
           this.sharedetails=json
       })
  }
  GetMemberFDTransactions()
  {
    debugger
       this.memberenquiryservice.GetMemberTransactions(this.memberid).subscribe(json=>{
         debugger;
           this.Transcationdetails=json[0].lstMemberTransactionDetails;
           console.log('thid is gris data after memeber change:',this.Transcationdetails);
           
           if (json[0].pImage)
           this.croppedImage = "data:image/png;base64," + json[0].pImage;
         else
           this.croppedImage = this._defaultimage.GetdefaultImage();
       })

  }
  GetSavingAccountDetails(){
    debugger;
    this.memberenquiryservice.GetMemberSavingAccountDetails(this.memberid).subscribe(json=>{
         debugger;
         if(json){
           this.Bankdetails=json;
         }
       })
  }
   GetRDAccountDetails(){
    debugger;
    this.memberenquiryservice.GetRDAccountDetails(this.memberid).subscribe(json=>{
         debugger;
         if(json){
           this.RdAccountDetalis=json;
         }
       })
  }
}
