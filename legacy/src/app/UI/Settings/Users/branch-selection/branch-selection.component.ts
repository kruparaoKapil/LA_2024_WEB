import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/Services/Settings/Users/Users.service';
import { CommonService } from 'src/app/Services/common.service';

@Component({
  selector: 'app-branch-selection',
  templateUrl: './branch-selection.component.html',
  styles: []
})
export class BranchSelectionComponent implements OnInit {

  branchSelectionForm: FormGroup;
  branchSelectionlist: any = [];
  subbranchSelectionlist: any = [];
  isValue: any;
  carddatavalues: any;
  activeclass: boolean;

  constructor(private fb: FormBuilder, private _commonService:CommonService, private router:Router, private userService:UsersService) { }

  ngOnInit() {
    sessionStorage.removeItem('SetBranch');
    this.branchSelectionForm = this.fb.group({
      pbranchid: [0],
      pbranchname: ['']

    });
   
   this.getBranchLocations();
  }

  

  getBranchLocations(){
    debugger;
    this.userService.getBranchLocations().subscribe(result => {
      this.branchSelectionlist = result;
      this.branchSelectionlist.sort((a, b) => a.pbranchlocation.localeCompare(b.pbranchlocation));
    })
  }

  branch_Change(event) {
    debugger;
    event.pbranch_id;
    event.pbranchlocation;
    

    this.getBranchNameDetails(event.pbranchlocation)
    //this.getBranchSelection(event.pbranchid)
  }

  getBranchNameDetails(branchName){
    debugger;
    this.userService.getBranchNameDetails(branchName).subscribe(res => {
      this.subbranchSelectionlist = res;
    })
  }

  clickbranchdata(data){

    debugger
    this.isValue=data.pbranchname
    this.carddatavalues=[];
    this.carddatavalues = {
      'pbranch_id':data.pbranch_id,
      'pbranch_name':data.pbranchname,
      'pbranch_location':data.pbranchlocation,
      // 'pcompany_id':data.pcompany_id,
      // 'pcompanyname':data.pcompanyname,
      // 'pstate':data.pstate,
      // 'pstateid':data.pstateid,
      // 'ptypeofoperation':null,
    };
    //this.carddatavalues.push(carddata)
    this.activeclass = true;
   
  }

  goData(){
    debugger
    let obj = JSON.stringify(this.carddatavalues)
    if( obj !=null){
      sessionStorage.setItem('SetBranch',obj);
      localStorage.setItem('SetBranch',obj)
      this.router.navigate(['/Login'])
    }else{
      this._commonService.showWarningMessage('Please Select the Branch');
    }
  }


}
