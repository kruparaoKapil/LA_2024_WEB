import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountingMastresService } from 'src/app/Services/Accounting/accounting-mastres.service';
import { State, GroupDescriptor, process } from '@progress/kendo-data-query';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/Services/common.service';
import { DataBindingDirective } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-chequemanagement-view',
  templateUrl: './chequemanagement-view.component.html',
  styles: []
})
export class ChequemanagementViewComponent implements OnInit 
{
  
 @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  public mySelection: string[] = [];
  updategrid: any = [];
  cheque:any=[]
  public gridState: State = {
    sort: [],
    take: 10
  };
  public headerCells: any = {
    textAlign: 'center'
  };
  public pageSize = 10;
  public loading = false;
  gridData: any = [];
  gridView: any = [];
  public groups: GroupDescriptor[] = [{ field: 'pBankname' }];
  constructor(private _accountingservice: AccountingMastresService, private toaster: ToastrService,private _commonservice:CommonService) { }

  ngOnInit() 
  {
    this.loading = true;
    
    this._accountingservice.ViewChequeManagementDetails().subscribe(data => {
      this.loading = false;
      this.gridView = data;
      this.gridData = this.gridView;
     
    })
  }



  editClick(event) {
    // console.log(event.dataItem)
    
    if (event.dataItem['pChqegeneratestatus'] == "InActive")
     {
      
      this.cheque.push(event.dataItem)
      // this.cheque['pChqegeneratestatus'] = "Active"
    
      // this.cheque['ptypeofoperation'] = "UPDATE"
      // this.cheque['pCreatedby']=this._commonservice.pCreatedby
      let updated =  this.cheque
      updated[0].pChqegeneratestatus="Active"
      updated[0].ptypeofoperation="UPDATE"
      updated[0].pCreatedby=this._commonservice.pCreatedby
      this.updategrid=updated
      let chequemanagement = { lstChequemanagementDTO: this.updategrid }

      //console.log(chequemanagement)
      let data = JSON.stringify(chequemanagement)
      this._accountingservice.SaveChequeManagement(data).subscribe(updateddata => {
        //console.log(updateddata)
        if (updateddata) 
        {
          event.dataItem['pChqegeneratestatus']="Active"
          
          this.toaster.success("Updated Successfully", 'Success');

        }

      })

    }
  }

  public onFilter(inputValue: string): void {
    this.gridData = process(this.gridView, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'pChqbookid',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pNoofcheques',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pChequefrom',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pChequeto',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pChqegeneratestatus',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pBankname',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pAccountnumber',
            operator: 'contains',
            value: inputValue
          }
        ],
      }
    }).data;

     this.dataBinding.skip = 0;
  }
}
