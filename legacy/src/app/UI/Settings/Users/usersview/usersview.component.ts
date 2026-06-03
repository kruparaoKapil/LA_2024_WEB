import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../../Services/common.service';
import { UsersService } from '../../../../Services/Settings/Users/Users.service';
import { State, process } from '@progress/kendo-data-query';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
@Component({
  selector: 'app-usersview',
  templateUrl: './usersview.component.html',
  styleUrls: ['./usersview.component.css']
})
export class UsersviewComponent implements OnInit {

  constructor(private _CommonService: CommonService,private _UsersService:UsersService,private toastr: ToastrService, private _router:Router) { 
    
    this.allData = this.allData.bind(this);
  }
  Usersdata:any; 
  loading=false;
  Userstempdata:any;
  public pageSize = 10;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10
  };
  public headerCells: any = {
    textAlign: 'center'
  };
  ngOnInit() {
    this.GetUsers();
  }

  GetUsers(){

    this.loading=true;
    this._UsersService.Selectuserview().subscribe(data => {
      this.Usersdata = data;
      this.Userstempdata=this.Usersdata;
      this.loading=false;
    });
  }

  Resetpassword(data:any){
let UserName=data.pUserName;
this._UsersService.Resetpassword(UserName).subscribe(data => {
  this.toastr.success("Successfully Password Reset", "Success");
});
  }
  Userrights(data:any){
    let UserName='';
    let UserorDesignation=data.pUserorDesignation;
    if(UserorDesignation=='Designation'){
       UserName=data.pRoleName;
    }
    else{
       UserName=data.pUserName;
    }
    let Userdata={'Type':UserorDesignation,'UserName':UserName}
     this._router.navigate(['/UserRights']);
     this._CommonService._SetUserrightsView(Userdata);
  }

  status(data:any)
  {
    
let status=data.pActiveorInactive;
let userid=data.pUserID
if(status==true){
  status=false;
}
else{
  status=true;
}
 this._UsersService.Status(userid,status).subscribe(data => {
  this.GetUsers();
this.toastr.success("Successfully Status Updated", "Success");
});


  }
  onFilter(inputValue: string) {
    this.Usersdata = process(this.Userstempdata, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'pEmployeeName',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pUserName',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pUserID',
            operator: 'contains',
            value: inputValue
          }
        ],
      }
    }).data;
  }
  
  public allData(): ExcelExportData {

    const result: ExcelExportData = {
      data: process(this.Usersdata, {  sort: [{ field: 'pUserName', dir: 'desc' }] }).data
    };

    return result;
  }

}
