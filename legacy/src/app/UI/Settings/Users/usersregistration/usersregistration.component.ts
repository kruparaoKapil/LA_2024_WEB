import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/Services/common.service';
import { UsersService } from 'src/app/Services/Settings/Users/Users.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-usersregistration',
  templateUrl: './usersregistration.component.html',
  styleUrls: ['./usersregistration.component.css']
})
export class UsersregistrationComponent implements OnInit {

  Users: any;
  RegistrationForm: FormGroup;
  submitted = false;
  Roles: any;
  constructor(private _commonService: CommonService, private router: Router, private _UsersService: UsersService, private _route: ActivatedRoute, private toastr: ToastrService) { }

  ngOnInit() {
    
    this._UsersService.GetUsers().subscribe(data => {
      
      this.Users = data;
    });
    this._UsersService.GetRoles().subscribe(data => {
      
      this.Roles = data;
    });
    this.RegistrationForm = new FormGroup({

      pEmployeeName: new FormControl('', Validators.required),
      pUserName: new FormControl('', Validators.required),
      pRoleName: new FormControl('', Validators.required),
      pUserType: new FormControl('Web', Validators.required),
      pstatusid: new FormControl(0),
      pCreatedby: new FormControl(this._commonService.pCreatedby),
      pRoleid: new FormControl(0),
      pContactRefID: new FormControl('')

    });

  }
  getrole(event) {
    
    let value = event.currentTarget.value;
    let selectedOption = this.Users[event.currentTarget.selectedIndex - 1];
    let roleId = 0;
    this.Roles.filter(function (x) { if (x.prolename == selectedOption.pRoleName) { roleId = x.proleid } });
    this.RegistrationForm.patchValue({ pRoleid: roleId, pRoleName: selectedOption.pRoleName, pContactRefID: selectedOption.pContactRefID })
    if (selectedOption.pRoleName.length > 0) {

      this.RegistrationForm.controls['pRoleName'].disable();    
      let RegistrationData = this.RegistrationForm.getRawValue();
      
    }
    else {

      this.RegistrationForm.controls['pRoleName'].enable();
    }
  }
  getroleId(event) {
    
    let value = event.currentTarget.value;
    let selectedOption = this.Roles[event.currentTarget.selectedIndex - 1];
    this.RegistrationForm.patchValue({ pRoleid: selectedOption.proleid, pRoleName: selectedOption.prolename })
  }
  SaveRegistration() {
    
    this.submitted = true;
    if (this.RegistrationForm.valid) {

      let RegistrationData = this.RegistrationForm.getRawValue();
      let jsondata = JSON.stringify(this.RegistrationForm.value);

      this._UsersService.CheckContactId(this.RegistrationForm.value["pContactRefID"]).subscribe(data => {
        
        if (data == 0) {
          this._UsersService.CheckUserName(this.RegistrationForm.value["pUserName"]).subscribe(data => {
            if (data == 0) {
              this._UsersService.SaveRegistaration(RegistrationData).subscribe(data => {
                
                this.submitted = false;
                this.RegistrationForm.reset();
                this.RegistrationForm.clearValidators();
                this.toastr.success('Success', 'User Registered Successfully !');

                this.RegistrationForm.patchValue({ pUserType: 'Web' });
                this._UsersService.GetUsers().subscribe(data => {
                  
                  this.Users = data;
                });

              });
            }
            else {
              this.toastr.warning('warning', 'User Name alredy Exist!');
            }
          });
        }
        else {

          this.toastr.warning('warning', 'Contact alredy Exist!');

        }

      });

  


    }

  }
}
