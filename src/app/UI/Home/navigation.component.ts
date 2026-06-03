import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoansmasterService } from 'src/app/Services/Loans/Masters/loansmaster.service';
import {  DefaultProfileImageService} from 'src/app/Services/Loans/Masters/default-profile-image.service';
import { CommonService } from 'src/app/Services/common.service';
import { Router, NavigationStart } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UsersService } from 'src/app/Services/Settings/Users/Users.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MustMatch } from '../../Services/Settings/Users/_helpers/must-match.validator';
import { Subscription } from 'rxjs';
declare let $: any
export let browserRefresh = false;
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.html',
  styles: []
})
export class NavigationComponent implements OnInit, OnDestroy {
  public TitleData: string = "";
  public loading = false;
  FormTitleData: any
  headerTitle: any
  modeldatalinks: any
  preActiveLink: any
  UsersForms: any;
  UserName: any;
  ChangePassWordForm: FormGroup;
  Searchpath: FormGroup;
  submitted = false;
  MenuName: any;
  SubMenuName: any;
  UrlName: any;
  subscription: Subscription;
  LoginUser: any;
  Imagepath: any;
  userFilter: any = { pFunctionName: '' };
  routertep:any;
  croppedImage:any;
  public routdata:any;
  Branchname: any;
  selectedBranchName: any;
  showModal: boolean = false;
  showModal1: boolean = false;
  pFunctionUrl: any;
  userDetails: any;
  userNameF: any;
  constructor(private _DefaultProfileImageService: DefaultProfileImageService,private _CommonService: CommonService, private formBuilder: FormBuilder, private _loanmasterservice: LoansmasterService, private router: Router, private _CookieService: CookieService, private _userService: UsersService, private toastr: ToastrService) {
    

    browserRefresh = !this.router.navigated;
    if(sessionStorage.nomineeAndReferralStatus!=undefined){
      let curr = JSON.parse(sessionStorage.nomineeAndReferralStatus);
      if(curr==true){
      this._CommonService.showWarningMessage('Please Add Nominee Details');
         return;
      }
      if(sessionStorage.referralStatus!=undefined){
        let curr = JSON.parse(sessionStorage.referralStatus);
        if(curr==true){ 
          this._CommonService.showWarningMessage('Please Add Referral Details');
           return;
        }
      }
      // else{
      //   this.router.navigate(['/FdTransactionView']);
      // }
    }
    if (browserRefresh == true) {

      // this.router.navigate(['/Dashboard']);
      // this.SubMenuName = 'Home';
      // this.UrlName = "Dashboard"
      this.userDetails = JSON.parse(sessionStorage.getItem("currentUser"));
    this.userNameF = this.userDetails.pUserName;
      if(this.userNameF == 'auditor' || this.userNameF == 'admin@kapilit.com'){
      this.router.navigate(['/Dashboard']);
      this.SubMenuName = 'Home';
      this.UrlName = "Dashboard"
      }
      else{
      this.router.navigate(['/DashBoard']);
      this.SubMenuName = 'Home';
      this.UrlName = "DashBoard"
      }
    
    }


  }
  ngOnInit() {
    debugger
    this.Branchname = JSON.parse(sessionStorage.getItem("SetBranch"));
    this.selectedBranchName = this.Branchname.pbranch_name;
    this.croppedImage= "data:image/png;base64," +this._CommonService.comapnydetails['pPhoto'];
    //this.MenuName = "Dashboard";
    this.SubMenuName = 'Home';
    this.UrlName = "Dashboard"
    this.ChangePassWordForm = this.formBuilder.group({
      email: [''],
      activeflag: ['Y'],
      userpassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('userpassword', 'confirmPassword')
    });

    this.Searchpath =this.formBuilder.group({
      urlName:[''],
    });
    var prev_act_id = $('a.main-active').attr('id');
    let user = JSON.parse(sessionStorage.getItem('currentUser'));
    this.loading = true;
    
    this._userService.GetUserForms(user.pUserName).subscribe(data => {
      debugger;
      this.UsersForms = data.moduleDTOList;
      this.routdata=[];
      for(let i=0;this.UsersForms.length>i;i++){
            for(let j=0;this.UsersForms[i]['lstSubModuleDTO'].length>j;j++){
              for(let x=0;this.UsersForms[i]['lstSubModuleDTO'][j]['functionsDTOList'].length>x;x++){
              this.routdata.push(this.UsersForms[i]['lstSubModuleDTO'][j]['functionsDTOList'][x]);
              }
            }
      }
      this.routdata.sort((a,b) => a.pFunctionName.localeCompare(b.pFunctionName));
      this.UserName = data.pUserName;
      this.LoginUser = data.pName;
      //,
      if (data.pImage != null) {
        this.Imagepath = "data:image/jpeg;base64," + data.pImage[0]
      }
      else {
        this.Imagepath = this._DefaultProfileImageService.GetdefaultImage();
      }
     
      let usertype = "";
      let userRole = "";
      if (data.pDesignation == "USER") {
        usertype = 'User'
        userRole = data.pUserName;
      }
      else {
        usertype = 'Designation'
        userRole = data.pDesignation;
      }
      this._userService._getUserForms(usertype, userRole).subscribe(data => {
        
        sessionStorage.setItem('Urc', JSON.stringify(data));
        this._CommonService._setPcreatedby();
        this.loading = false;
      });

    });
    //menu expand and collapse

    $('.btn-expand-collapse').click(function (e) {

      $('.wrapper').toggleClass('collapsed');
    });
    $('.btn-xs-toggle').click(function (e) {

      $('.wrapper').toggleClass('display-content');
    });

    this.routertep = this.router.config[2].children;
    var officersIds = [];
    this.routertep.forEach(function (officer) {
      officersIds.push({'path':officer.path,'componentName':officer.component.name});
    });
    debugger
  this.routdata=officersIds;

    $("#contactsaa").kendoMultiColumnComboBox({
      dataTextField: "path",
      dataValueField: "path",
      height: 400,
      columns: [
      
        { field: "path", title: "Path Name", width: 200 },
        { field: "componentName", title: "Component Name", width: 500 },

      ],
      footerTemplate: 'Total #: instance.dataSource.total() # items found',
      filter: "contains",
      filterFields: ["path"],
      dataSource:officersIds,
      select: this.SelectPath,
     // change: this.onChange,

    });
    debugger
   

  }
  pathChange(event){
    debugger
    if(sessionStorage.nomineeAndReferralStatus!=undefined){
      let curr = JSON.parse(sessionStorage.nomineeAndReferralStatus);
      if(curr==true){ 
        this._CommonService.showWarningMessage('Please Add Nominee Details');
        this.showModal = true; 
         return;
      }
    }
    if(sessionStorage.referralStatus!=undefined){
      let curr = JSON.parse(sessionStorage.referralStatus);
      if(curr==true){ 
        this._CommonService.showWarningMessage('Please Add Referral Details');
         return;
      }
    }

     // 22-10

     if(sessionStorage.nomineeDetailsMP!=undefined){
      let curr = JSON.parse(sessionStorage.nomineeDetailsMP);
      if(curr==true){ 
        //this._CommonService.showWarningMessage('Please Add Nominee Details');
        this.showModal = true; 
         return;
      }
    }
    if(sessionStorage.referralStatusMP!=undefined){
      let curr = JSON.parse(sessionStorage.referralStatusMP);
      if(curr==true){ 
        //this._CommonService.showWarningMessage('Please Add Referral Details');
        this.showModal = true;
         return;
      }
    }

    if(event.pFunctionName == 'Advance Transaction'){
      if(sessionStorage.onlynomineeAndReferralStatus!=undefined){
        let curr = JSON.parse(sessionStorage.onlynomineeAndReferralStatus);
        if(curr==true){ 
          //this._CommonService.showWarningMessage('Please Add Nominee Details');
          this.showModal = true; 
           return;
        }
      }
  
      if(sessionStorage.onlyreferralStatus!=undefined){
        let curr = JSON.parse(sessionStorage.onlyreferralStatus);
        if(curr==true){ 
          //this._CommonService.showWarningMessage('Please Add Referral Details');
          this.showModal1 = true;
           return;
        }
      }
    }

    if(event.pFunctionName == "Maturity Payment"){
      if(sessionStorage.onlyNomineeDetailsMP!=undefined){
        let curr = JSON.parse(sessionStorage.onlyNomineeDetailsMP);
        if(curr==true){ 
          //this._CommonService.showWarningMessage('Please Add Nominee Details');
          this.showModal = true; 
           return;
        }
      }
  
      if(sessionStorage.referralStatusMP!=undefined){
        let curr = JSON.parse(sessionStorage.referralStatusMP);
        if(curr==true){ 
          //this._CommonService.showWarningMessage('Please Add Referral Details');
          this.showModal1 = true; 
           return;
        }
      }
    }

    let url=event['pFunctionUrl'];
    var sub_menu = $('.nav-sub-menu');
    sessionStorage.setItem('pFunctionUrl', event.pFunctionUrl);

    $(".collapse").each(function () {
      $(".collapse").removeClass("show");
      $(this).prev(".card-header").find(".fa").addClass("fa-plus").removeClass("fa-minus");
    });
    $(".collapse").on('show.bs.collapse', function () {
      
      $(this).prev(".card-header").find(".fa").removeClass("fa-plus").addClass("fa-minus");
    }).on('hide.bs.collapse', function () {
      
      $(this).prev(".card-header").find(".fa").removeClass("fa-minus").addClass("fa-plus");
    });

    sub_menu.removeClass('nav-open');
    var prev_act_id = $('a.main-active').attr('id');
    $('#' + prev_act_id + '').removeClass('main-active');
    $('.mimenu'+event['pmoduleid']).addClass("main-active");
    $('#nsm'+event['pmoduleid']).addClass("nav-open");
    $('#mhalltitle'+event['psubmoduleid']).removeClass("collapsed");
    $('#mhtitle'+event['psubmoduleid']).addClass("fa-minus").removeClass("fa-plus");
    $('#collapse'+event['psubmoduleid']).addClass("show");

     $('#menutitle'+event['pFunctionID']).addClass("menutitle-active");
     $('.inner-menu li a').removeClass("active");
     $('#msm'+event['pFunctionID']).addClass("active");


    let MenuNamedata = this.UsersForms.filter(UsersArray => UsersArray.pmoduleid == event['pmoduleid']);
    let SubMenuNamedata = MenuNamedata[0]['lstSubModuleDTO']
    let subMenuNamedata =SubMenuNamedata.filter(UserssubArray => UserssubArray.psubmoduleid == event['psubmoduleid']);
    this.MenuName = MenuNamedata[0]['pmodulename'];
    this.SubMenuName = subMenuNamedata[0]['psubmodulename'];
    this.UrlName =event['pFunctionName'];
    
    this.router.navigate([url]);
  }
  SelectPath(path){
      debugger
      if(sessionStorage.nomineeAndReferralStatus!=undefined){
        let curr = JSON.parse(sessionStorage.nomineeAndReferralStatus);
        if(curr==true){ 
          //this._CommonService.showWarningMessage('Please Add Nominee Details');
          this.showModal = true; 
           return;
        }
      }
      if(sessionStorage.referralStatus!=undefined){
        let curr = JSON.parse(sessionStorage.referralStatus);
        if(curr==true){ 
          //this._CommonService.showWarningMessage('Please Add Referral Details');
          this.showModal = true;
           return;
        }
      }

      // 22-10

      if(sessionStorage.nomineeDetailsMP!=undefined){
        let curr = JSON.parse(sessionStorage.nomineeDetailsMP);
        if(curr==true){ 
          //this._CommonService.showWarningMessage('Please Add Nominee Details');
          this.showModal = true; 
           return;
        }
      }
      if(sessionStorage.referralStatusMP!=undefined){
        let curr = JSON.parse(sessionStorage.referralStatusMP);
        if(curr==true){ 
          //this._CommonService.showWarningMessage('Please Add Referral Details');
          this.showModal = true;
           return;
        }
      }
      let s= this.routdata;
    let url=path.dataItem.path.toString();
    this.router.navigate(['/Dashboard']);

    //this.router.navigate(['/'+url]);    
   }
   closeModal(): void {
    this.showModal = false;
    this.showModal1 = false;
  }
  Urlclick(formname, submenu, menuname,idaddclas,pFunctionUrl) {
    debugger
    // if(sessionStorage.nomineeAndReferralStatus!=undefined){
    //   let curr = JSON.parse(sessionStorage.nomineeAndReferralStatus);
    //   if(curr==true){ 
    //     this._CommonService.showWarningMessage('Please Add Nominee Details');
    //      return;
    //   }
    // }

    if (sessionStorage.nomineeAndReferralStatus != undefined) {
      let curr = JSON.parse(sessionStorage.nomineeAndReferralStatus);
      if (curr === true) {
        //this._CommonService.showWarningMessage('Please Add Nominee Details');
        this.showModal = true;  // Show the popup/modal
        return;
      }
    }

    if(sessionStorage.referralStatus!=undefined){
      let curr = JSON.parse(sessionStorage.referralStatus);
      if(curr==true){ 
        //this._CommonService.showWarningMessage('Please Add Referral Details');
        this.showModal1 = true; 
         return;
      }
    }



    // 22-10

    if (sessionStorage.nomineeDetailsMP != undefined) {
      let curr = JSON.parse(sessionStorage.nomineeDetailsMP);
      if (curr === true) {
        //this._CommonService.showWarningMessage('Please Add Nominee Details');
        this.showModal = true;  // Show the popup/modal
        return;
      }
    }

    if(sessionStorage.referralStatusMP!=undefined){
      let curr = JSON.parse(sessionStorage.referralStatusMP);
      if(curr==true){ 
        //this._CommonService.showWarningMessage('Please Add Referral Details');
        this.showModal1 = true; 
         return;
      }
    }

    

    

    this.MenuName = menuname;
    this.SubMenuName = submenu;
    this.UrlName = formname;
    this.pFunctionUrl = pFunctionUrl;  
    sessionStorage.setItem('pFunctionUrl', this.pFunctionUrl);
    if(this.MenuName == 'Land Advance' && this.UrlName == "Advance Transaction"){
      if(sessionStorage.onlynomineeAndReferralStatus!=undefined){
        let curr = JSON.parse(sessionStorage.onlynomineeAndReferralStatus);
        if(curr==true){ 
          //this._CommonService.showWarningMessage('Please Add Nominee Details');
          this.showModal = true; 
           return;
        }
      }
  
      if(sessionStorage.onlyreferralStatus!=undefined){
        let curr = JSON.parse(sessionStorage.onlyreferralStatus);
        if(curr==true){ 
          //this._CommonService.showWarningMessage('Please Add Referral Details');
          this.showModal1 = true; 
           return;
        }
      }
    }

    if(this.MenuName == 'Land Advance' && this.UrlName == "Maturity Payment"){
      if(sessionStorage.onlyNomineeDetailsMP!=undefined){
        let curr = JSON.parse(sessionStorage.onlyNomineeDetailsMP);
        if(curr==true){ 
          //this._CommonService.showWarningMessage('Please Add Nominee Details');
          this.showModal = true; 
           return;
        }
      }
  
      if(sessionStorage.referralStatusMP!=undefined){
        let curr = JSON.parse(sessionStorage.referralStatusMP);
        if(curr==true){ 
          //this._CommonService.showWarningMessage('Please Add Referral Details');
          this.showModal1 = true; 
           return;
        }
      }
    }

    
    $('.inner-menu li a').removeClass("active");
    $('#msm'+idaddclas).addClass("active");
    this.Searchpath.controls.urlName.setValue('');

    let url='/'+pFunctionUrl
    this.router.navigate([url]);
    

  }
  Signout() {
    this._userService._logout();
  }
  ngOnDestroy() {
  }

  ActivateDash() {

    var prev_act_id = $('a.main-active').attr('id');
    $('#' + prev_act_id + '').removeClass('main-active');
    $('#a').addClass("main-active");
    this.MenuName = '';
    this.SubMenuName = 'Home';
    this.UrlName = "Dashboard"
    this.Searchpath.controls.urlName.setValue('');
  }


  contactclick() {
    debugger;
    this.MenuName = 'Contact';
    this.SubMenuName = 'Contact Configuration';
    this.UrlName = "Contact"
    let b=this.routdata;
    let MenuNamedata = this.routdata.filter(UsersArrayName => UsersArrayName.pFunctionName == this.MenuName);
    this.pathChange(MenuNamedata[0]);

  }


  Menuclick($event, menu) {
    //menuFunction
    debugger
    var sub_parent = $(".nav-sub-parent > a");
    var sub_menu = $('.nav-sub-menu');


    sub_menu.removeClass('nav-open');
    var that = $($event.currentTarget); //cache when you can
    var parent_menu = that.parents('.menu');
    var menu_index = parent_menu.index();
    var current_item = that.next('.nav-sub-menu');
    $('.wrapper').removeClass('collapsed');
    //console.log(parent_menu);
    parent_menu.addClass('nav-l1-open');
    current_item.addClass('nav-open');
    var prev_act_id = $('a.main-active').attr('id');
    $('#' + prev_act_id + '').removeClass('main-active');
    $('#' + $event.currentTarget.id + '').addClass("main-active");

    var sub_back = $('.nav-left-back');
    sub_back.click(function () {
      var that = $(this);
      var menuIndex = that.parent().index();
      var currentItem = that.parent('.nav-sub-menu');
      var parent_menu = that.parents('.menu');
      currentItem.removeClass('nav-open');
      parent_menu.removeClass('nav-l1-open');
    });

    // Add minus icon for collapse element which is open by default
    $(".collapse").each(function () {
      $(".collapse").removeClass("show");
      $(this).prev(".card-header").find(".fa").addClass("fa-plus").removeClass("fa-minus");
    });


    // $(".card-header").on('click', function () {
    //   $(".card>a.collapse").removeClass("show");
    //   $(".fa").removeClass("fa-minus");
    //   $(".fa").addClass("fa-plus");
    // });
    // Toggle plus minus icon on show hide of collapse element
    $(".collapse").on('show.bs.collapse', function () {
      
      $(this).prev(".card-header").find(".fa").removeClass("fa-plus").addClass("fa-minus");
    }).on('hide.bs.collapse', function () {
      
      $(this).prev(".card-header").find(".fa").removeClass("fa-minus").addClass("fa-plus");
    });



    // navigation add end////////////////////////////////////////////








  }
  get f() { return this.ChangePassWordForm.controls; }
  openpop() {
    $('#ChangePassmodel').modal('show');
  }
  trackByFn(index, item) {

    return index; // or item.id
  }
  ChangePassWord() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.ChangePassWordForm.valid) {
      var ep = this.ChangePassWordForm.controls.userpassword.value
      var cp = this.ChangePassWordForm.controls.confirmPassword.value

      this._userService.UpdatePass(this.UserName, cp).subscribe(data => {

        this.submitted = false;
        //this.toastr.success("")
        $('#ChangePassmodel').modal('hide');
        this._userService._logout();

      });

    }

  }



    downloadFile(){
    debugger
    const fileUrl = 'assets/images/USER_MANUAL_REMO.pdf';

    window.open(fileUrl, '_blank');
  }
}
