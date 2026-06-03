import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { CommonService } from '../common.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyconfigService {
  tabname:any;
  documentdformdata:any;
  promtorsformdata:any;
  constructor(private _commonservice:CommonService)
   {

    }
    private Data = new Subject<any>();
    getTitleOnClick(title)
    {
      debugger
       this.tabname=title;
    }
    sendTitle()
    {
      debugger
      return this.tabname;
    }
    _GetButtonName(): Observable<any> {
      return this.Data.asObservable();
   }
    savecompanyconfig(data)
    {
      debugger;
      return this._commonservice.callPostAPI('/Settings/Company/SaveCompanyDetails', data)
    }
    Getcompanydetails(): Observable<any>
    {
      return this._commonservice.callGetAPI('/Settings/Company/getCompanyDetails','', 'NO')
    }
  
}
