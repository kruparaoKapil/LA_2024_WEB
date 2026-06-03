import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SscAgendaService } from 'src/app/Services/HRMS/Transactions/ssc-agenda.service';
import { process } from '@progress/kendo-data-query';

@Component({
  selector: 'app-employee-new-view',
  templateUrl: './employee-new-view.component.html',
  styles: []
})
export class EmployeeNewViewComponent implements OnInit {

  employeeDetails : any = [];
  employeeDetailsArray : any;

  constructor(private _sscAgendaService:SscAgendaService,private router : Router) { }

   ngOnInit() {
    this._sscAgendaService.viewEmployeedetails().subscribe(res =>{
      debugger;
      console.log(res);
      this.employeeDetails = res;
      this.employeeDetailsArray = res;
    });
  }

  newEmployee(){
    debugger;
    this.router.navigate(['/EmployeeNew']);
  }

  public searchRecord(inputValue: string): void {
    this.employeeDetails = process(this.employeeDetailsArray, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'pcontactid',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pcontactname',
            operator: 'contains',
            value: inputValue
          }
        ],
      }
    }).data;
  }


  editEmployeeData(event){
    debugger;
    console.log(event.dataItem);
    this._sscAgendaService._setEmployeeEditDataStatus("");
    this._sscAgendaService._setemployeeEditData("");
    this._sscAgendaService.getEmployeedetailsbyid(event.dataItem.ptblmstemployeeid).subscribe(json =>{
      debugger;
      console.log("Edit Details : ",json);
      const params = event.dataItem.ptblmstemployeeid; 
      var myparams = btoa(params);
      this.router.navigate(['/EmployeeNew',{id :myparams}]);
      this._sscAgendaService._setEmployeeEditDataStatus("edit");
      this._sscAgendaService._setemployeeEditData(event.dataItem);
    });
  }

}
