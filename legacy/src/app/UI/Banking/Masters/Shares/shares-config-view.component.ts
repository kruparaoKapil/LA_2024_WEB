import { Component, OnInit, ViewChild } from '@angular/core';
import { ShareconfigService } from 'src/app/Services/Banking/shareconfig.service';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/Services/common.service';
import { forkJoin } from 'rxjs';
import { State, process } from '@progress/kendo-data-query';
import { DataBindingDirective, SelectableSettings } from '@progress/kendo-angular-grid';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';

@Component({
  selector: 'app-shares-config-view',
  templateUrl: './shares-config-view.component.html',
  styles: []
})
export class SharesConfigViewComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  public selectableSettings: SelectableSettings;
  constructor(private shareconfigservice:ShareconfigService,private router:Router,private _commonservice:CommonService) {
      this.allData = this.allData.bind(this);
   }
 gridData:any=[];
 sharelist:any;
 public gridState: State = { 
  sort: [],
  skip: 0,
  take: 10
};
  ngOnInit()
   {
     
     this.Getviewdata()
  }
  Getviewdata()
  {
    debugger
    this.shareconfigservice.GetShareConfigViewDetails().subscribe(res=>{
      debugger
      this.sharelist=res
      this.gridData=this.sharelist
      console.log(this.gridData)
    })
  }
  editHandler(event)
  {
    debugger
   this.BindingShareformData(event.dataItem.psharename,event.dataItem.psharecode);
   this.shareconfigservice.Newformstatus("edit")
    
  }
  removeHandler(event)
  {
    debugger
    console.log(event.dataItem.pshareconfigid)
    this.shareconfigservice.DeleteShareConfig(event.dataItem.pshareconfigid,event.dataItem.psharename).subscribe(res=>{
      debugger
      if(res)
      {
        this._commonservice.showInfoMessage('Record Deleted Successfully');
        this.Getviewdata()
      }
    })
    

  }
  Newform() {
    // this.newform="new";
    this.shareconfigservice.Newformstatus("New")
  }
  public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.sharelist, {}).data
    };

    return result;
  }
  status(data: any) {
  debugger
    let status = data.pstatus
    if (data.pstatus==true) {
      data.pstatus=false;
      status = false;
    }
    else 
    {
      data.pstatus=true
      status = true;
      
    }

    this.shareconfigservice.DeleteShareConfig(data.pshareconfigid,data.psharename).subscribe(res => {

      this.Getviewdata();
     

    });
  }
  BindingShareformData(sharename,sharecode)
  {
    debugger
    let GetNamecodedetails = this.shareconfigservice.GetShareNameAndCodeDetails(sharename,sharecode)
    let Getshareconfigdetails = this.shareconfigservice.GetShareConfigurationDetails(sharename,sharecode)
    let GetVerificationdetails = this.shareconfigservice.GetShareConfigurationReferralDetails(sharename,sharecode)
   
    forkJoin([GetNamecodedetails, Getshareconfigdetails, GetVerificationdetails]).subscribe(result => 
        {
          debugger
            
             this.shareconfigservice.Getdataforedit(result)
            var myparams = btoa(sharename);
             this.router.navigate(['/SharesConfigNew', { name: myparams }]);
            // this.router.navigate(['/SharesConfigNew']);
             
             
        })
  }
  SearchRecord(inputValue: string) {

    this.gridData = process(this.sharelist, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'psharename',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'psharenamecode',
            operator: 'contains',
            value: inputValue
          }
        ],
      }
    }).data;
    this.dataBinding.skip = 0;
  }
}
