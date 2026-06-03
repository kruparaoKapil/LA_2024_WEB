import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { UsersService } from 'src/app/Services/Settings/Users/Users.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyDetailsService } from '../../../../Services/Common/company-details.service';
import { CompanyconfigService } from 'src/app/Services/Settings/companyconfig.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styles: []
})
export class UserLoginComponent implements OnInit {

  LoginForm: FormGroup;
  submitted = false;
  showotp: boolean = false;
  showlogin: boolean = true;
  OtpAuthentication: boolean = false;
  UserId: any;
  pPhotodata: any;
  branchName: any;
  selectedBranchName: any;
  hide: boolean = true;
  response: any = [];
  username: any;
  constructor(private _commonService: CommonService, private router: Router, private _UsersService: UsersService, private _route: ActivatedRoute, private toastr: ToastrService, private _CompanyDetailsService: CompanyDetailsService, private _companyconfigservice: CompanyconfigService) {

  }

  ngOnInit() {
    debugger
    this.LoginForm = new FormGroup({
      pUserName: new FormControl('', Validators.required),
      pPassword: new FormControl('', Validators.required),
      pOtp: new FormControl('')

    });
    this.branchName = JSON.parse(sessionStorage.getItem("SetBranch"));
    this.selectedBranchName = this.branchName.pbranch_name;
    console.log(this.branchName);
    
  }

  loginclick() {

    this._companyconfigservice.Getcompanydetails().subscribe(data => {
      this.pPhotodata = data['pPhoto'];
    });
    this.submitted = true;
    if (this.LoginForm.valid) {

      let Logindata = this.LoginForm.value;
      let jsondata = JSON.stringify(this.LoginForm.value);
      this._UsersService._loginUser(Logindata).subscribe(data => {
        debugger;
        this.response = data;
        console.log('user info data:', data);
        let user1 = this.response.pUserName
        this.username = user1
        console.log('username', this.username);

        sessionStorage.setItem('currentUser', JSON.stringify(data));
        this.OtpAuthentication = data["pOtpAuthentication"];
        this.UserId = data["pUserID"];
        if (!this.OtpAuthentication) {
          this.showotp = false;
          this.showlogin = true;

          sessionStorage.setItem('nomineeAndReferralStatus', JSON.stringify(false));
          sessionStorage.setItem('referralStatus', JSON.stringify(false));
          sessionStorage.setItem('nomineeDetailsMP', JSON.stringify(false));
          sessionStorage.setItem('referralStatusMP', JSON.stringify(false));

          this._CompanyDetailsService.GetCompanyData().subscribe(json => {
            this._companyconfigservice.Getcompanydetails().subscribe(data => {
              this.pPhotodata = data['pPhoto'];
              if (json['pPhoto'] == null) {
                json['pPhoto'] = this.pPhotodata;
              }
              sessionStorage.setItem('companydetails', JSON.stringify(json));
              this._commonService._setCompanyDetails();
              //this.router.navigate(['/Dashboard'])
              if (this.username == 'auditor' || this.username == 'admin@kapilit.com') {
                this.router.navigate(['/Dashboard'])
              }
              else {
                this.router.navigate(['/DashBoard'])
              }
            });

          }, (error) => {

            this._commonService.showErrorMessage(error);
          });
        }
        else {
          this.showotp = true;
          this.showlogin = false;
        }




      }, error => {

        this.toastr.error("Invalid Credentials", "Error")
      });
    }

  }
  VerifyOTP() {

    debugger;
    this.submitted = true;
    let status: any;
    if (this.LoginForm.valid) {

      let Logindata = this.LoginForm.value;
      let jsondata = JSON.stringify(this.LoginForm.value);
      this._UsersService._VerifyOTP(Logindata).subscribe(data => {
        debugger;
        sessionStorage.setItem('currentUser', JSON.stringify(data));
        this.OtpAuthentication = data["pOtpAuthentication"];
        this.UserId = data["pUserID"];
        status = data["pStatus"];
        if (status == "True") {
          this.showotp = false;
          // this.showlogin = true;
          this._CompanyDetailsService.GetCompanyData().subscribe(json => {

            sessionStorage.setItem('companydetails', JSON.stringify(json));
            this._commonService._setCompanyDetails();
            this.router.navigate(['/Dashboard'])
          }, (error) => {

            this._commonService.showErrorMessage(error);
          });
        }
        else {
          this._commonService.showWarningMessage(data["pMessage"]);
        }
      }, error => {

        this.toastr.error("Invalid Credentials", "Error")
      });
    }

  }
  ShowPassword() {
    debugger
    this.hide = !this.hide;
  }
}
