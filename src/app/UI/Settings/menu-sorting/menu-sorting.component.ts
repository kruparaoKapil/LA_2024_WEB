import { Component, OnInit } from '@angular/core';
import { GroupDescriptor, DataResult, process, SortDescriptor } from '@progress/kendo-data-query';
import { CommonService } from 'src/app/Services/common.service';
//import { MenuModulesService } from 'src/app/Services/Common/menu-modules.service';
import { MenuModulesService } from '../../../Services/Settings/menu-modules.service';
import { UsersService } from 'src/app/Services/Settings/Users/Users.service';
@Component({
  selector: 'app-menu-sorting',
  templateUrl: './menu-sorting.component.html',
  styles: []
})
export class MenuSortingComponent implements OnInit {
  public groups: GroupDescriptor[] = [{ field: 'pmodulename' }, { field: 'psubmodulename' }];
  loading: boolean;
  public sort: SortDescriptor[] = [{
    field: 'pfunctionsortorder',
    dir: 'asc'
  }];
  Navigationdata: any;
  Navigationtempdata: any;
  functionid: any;
  btnShow: boolean = false;

  constructor(private _UsersService: MenuModulesService,private commonService : CommonService, private uservice:UsersService) { }

  ngOnInit() {
this.GetNavigation('','');
  }
  GetNavigation(Type, UserOrDesignation) {
    
    this.loading = true;
    this.uservice.GetNavigation(Type, UserOrDesignation).subscribe(data => {
      this.Navigationdata = data['functionsDTOList'];
      this.Navigationtempdata = this.Navigationdata;
      this.loading = false;
this.functionid = data['pFunctionID'];
    });
  }

ChangeInput(data,$event){

if($event.target.value==null ||$event.target.value=="" ||$event.target.value<0){
this.commonService.showWarningMessage("Invalid Input for sorting");
this.btnShow=false;
}
else{
  let j=$event.target.value;
  data.pfunctionsortorder = j;
  this.btnShow=true;
}

  }

UpdateSortOrder(){
  debugger
  let TempArray = [];
  for(let i=0;i<this.Navigationdata.length;i++){
    TempArray.push({'pfunctionid':this.Navigationdata[i].pFunctionID, 'psortorder': this.Navigationdata[i].pfunctionsortorder})
    
  }
  //let pCreateby = this.commonService.pCreatedby;
       
        let datab = { sortOrderandQuicklinksList: TempArray };
         let sortingData = JSON.stringify(datab);
        console.log(sortingData);
    this._UsersService.UpdateFunctionSortOrder(sortingData).subscribe(data=>{
      
      if(data!=null ){
        this.commonService.showInfoMessage("Menu Sorted Successfully");
      }
      location.reload()
    });    
  }
  onFilter(inputValue: string) {
    this.Navigationdata = process(this.Navigationtempdata, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'pmodulename',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'psubmodulename',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pFunctionName',
            operator: 'contains',
            value: inputValue
          }
        ],
      }
    }).data;
  }
}
