import { Component, Injectable,OnInit, Output, ViewChild, EventEmitter, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm, FormArray } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GridDataResult, RowArgs, DataStateChangeEvent, PageChangeEvent, ColumnReorderEvent, ColumnResizeArgs } from '@progress/kendo-angular-grid';
import { State, process, SortDescriptor, GroupDescriptor, orderBy, filterBy } from '@progress/kendo-data-query';
import { FIIndividualService } from 'src/app/Services/Loans/Transactions/fiindividual.service';
import { ContactSelectComponent } from '../contact-select/contact-select.component';
import { GroupService } from 'src/app/Services/Common/group.service';
import { CommonService } from 'src/app/Services/common.service';
import { Router } from '@angular/router';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
 @Injectable()

@Component({
  selector: 'app-group-view',
  templateUrl: './group-view.component.html',
  styles: []
})
export class GroupViewComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  public editId:number;
  @Output() editIdEvent = new EventEmitter<any>();
  public view: [];
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 100
  };
  public GroupcreationValidationErrors: any;
  public GetallGroupDetailsData: any;
  public gridView:any;
  
  
  constructor(private fb: FormBuilder, private toaster: ToastrService, private _FIIndividualService: FIIndividualService, private _GroupService: GroupService, private _commonService: CommonService, private router: Router) { }

  ngOnInit() {
    this.gridView=[];
    this.GetallGroupDetails();
  }

 

  showErrorMessage(errormsg: string) {
    this._commonService.showErrorMessage(errormsg);
  }

  showInfoMessage(errormsg: string) {
    this._commonService.showInfoMessage(errormsg);
  }

  //----------------VALIDATION----------------------- //
  checkValidations(group: FormGroup, isValid: boolean): boolean {
    try {
      Object.keys(group.controls).forEach((key: string) => {
        isValid = this.GetValidationByControl(group, key, isValid);
      })
    }
    catch (e) {
      this.showErrorMessage(e);
      return false;
    }
    return isValid;
  }
  GetValidationByControl(formGroup: FormGroup, key: string, isValid: boolean): boolean {
    try {
      let formcontrol;
      formcontrol = formGroup.get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          this.checkValidations(formcontrol, isValid)
        }
        else if (formcontrol.validator) {
          this.GroupcreationValidationErrors[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.GroupcreationValidationErrors[key] += errormessage + ' ';
                isValid = false;
              }
            }
          }
        }
      }
    }
    catch (e) {
      this.showErrorMessage(e);
      return false;
    }
    return isValid;
  }
  BlurEventAllControll(fromgroup: FormGroup) {
    try {
      Object.keys(fromgroup.controls).forEach((key: string) => {
        this.setBlurEvent(fromgroup, key);
      })
    }
    catch (e) {
      this.showErrorMessage(e);
      return false;
    }
  }
  setBlurEvent(fromgroup: FormGroup, key: string) {
    try {
      let formcontrol;
      formcontrol = fromgroup.get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          this.BlurEventAllControll(formcontrol)
        }
        else {
          if (formcontrol.validator)
            fromgroup.get(key).valueChanges.subscribe((data) => { this.GetValidationByControl(fromgroup, key, true) })
        }
      }
    }
    catch (e) {
      this.showErrorMessage(e);
      return false;
    }
  }

  /** Get all Group Details */
  public GetallGroupDetails() {
    
    this._GroupService.GetGroupDetails().subscribe(res => {
      debugger;
      this.GetallGroupDetailsData =this.gridView= res;
    },
      (error) => {
        this.showErrorMessage(error);
      });
  }

  public editHandler(data) {
     let editIds = data.dataItem['pGroupid'];
    // this._GroupService.editData(editIds)  
    this._GroupService.SetGroupRowEditClick(editIds)
    // let url = "/GroupCreation"
    // this.router.navigate([url]);
     var myparams = btoa(data.dataItem['pGroupid']);
       this.router.navigate(['/GroupCreation', { id: myparams }]);
  }
public onFilter(inputValue: string): void {
    this.GetallGroupDetailsData = process(this.gridView, {
      filter: {
        logic: "or",
        filters: [

          {
            field: 'pGroupname',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pGroupcode',
            operator: 'contains',
            value: inputValue
          },
           {
            field: 'pGrouptype',
            operator: 'contains',
            value: inputValue
          },
            {
            field: 'pMembercount',
            operator: 'contains',
            value: inputValue
          },

        ],
      }
    }).data;
    this.dataBinding.skip = 0;
  }
  public removeHandler(data) {
    debugger;
   let pCreatedby = this._commonService.pCreatedby;
    let pGroupID = data.dataItem['pGroupid']
    let pGroupName = data.dataItem['pGroupname']
    
    let deleteData = {
      "pGroupID": pGroupID,
      "pMemberId": 0,
      "pTransactionType": "DELETE",
      "pGroupName": pGroupName,
      "pCreatedby": pCreatedby,
      "pTypeofoperation": "VIEW"
    };
    let deleteDatas = JSON.stringify(deleteData);
    this._GroupService.DeleteGroupDetails(deleteDatas).subscribe(json => {
      debugger;
      if (json == true) {
          this.GetallGroupDetails();
          this._commonService.showInfoMessage('Record Deleted Successfully')
      } 
    });
  }
  

}
