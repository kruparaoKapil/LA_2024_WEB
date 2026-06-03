import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeService } from 'src/app/Services/Settings/employee.service';
import { Router } from '@angular/router';
import { State, process } from '@progress/kendo-data-query';
import { CommonService } from 'src/app/Services/common.service';

import { DataBindingDirective } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-employee-view',
  templateUrl: './employee-view.component.html',
  styles: []
})

export class EmployeeViewComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;

  EmployeeData;
  public GridData: any;
  public gridState: State = {
    sort: [],
    take: 10
  };
  public pageSize = 10;
 public loading=false;
 public headerCells: any = {
  textAlign: 'center'
};
  constructor(private _Employee:EmployeeService, private router:Router, private _commonService:CommonService) { }

  ngOnInit() {
    
   this.getEmployeeViewDetails();  
  }
  
getEmployeeViewDetails(){
  this.loading=true;
  this._Employee.GetEmployeeDetails().subscribe(data=>{
    
    this.GridData = data;
    console.log("grid data",this.GridData)
    this.EmployeeData = this.GridData;
    for(let i=0;i<this.EmployeeData.length;i++){
      if(this.EmployeeData[i].pEmployeeTitleName==null){
        this.EmployeeData[i].employeefullname=this.EmployeeData[i].pEmployeeName+' '+this.EmployeeData[i].pEmployeeSurName;
      }
      else{
        this.EmployeeData[i].employeefullname=this.EmployeeData[i].pEmployeeTitleName+' '+this.EmployeeData[i].pEmployeeName+' '+this.EmployeeData[i].pEmployeeSurName;
      }
    }  
    this.loading=false;
  })
}
  editHandler(event){
    
    this.router.navigate(['/EmployeeMaster/:id']);
    this._Employee.GetEmployeeIdForUpdate(event.dataItem.pEmployeeId);    
  }

  removeHandler(event){
      this.loading = true;
    event.dataItem['pMainTransactionType']="DELETE";
    event.dataItem['pCreatedby']=this._commonService.pCreatedby
    let deletedata=JSON.stringify(event.dataItem);
    //console.log(deletedata)
    this._Employee.UpdateEmployeeForm(deletedata).subscribe(value=>{
      
      if(value){
        this.getEmployeeViewDetails();  
        }
        this.loading = false;
    })

  }

  newContact(){
   
    this.router.navigate(["/EmployeeMaster"])
  }


  public onFilter(inputValue: string): void {
    this.EmployeeData = process(this.GridData, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'employeefullname',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pEmploymentDesignation',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pEmploymentRoleName',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pEmployeeContactNo',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pEmployeeContactEmail',
            operator: 'contains',
            value: inputValue
          }
        ],
      }
    }).data;

     this.dataBinding.skip = 0;
  }

}
