import { Injectable } from '@angular/core';
import { CommonService } from '../common.service';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareconfigService {

  constructor(private _CommonService:CommonService) { }
  sharenameandcodedetails;
  Tab1dataforedit:any;
  Tab2dataforedit:any;
  Tab3dataforedit:any;
  sharenamedetailsforedit:any;
  shareconfigurationdetails
  status:any;
  savesharenameandcode(data)
  {
    debugger
    return this._CommonService.callPostAPI('/Banking/Masters/ShareConfig/SaveShareNameAndCode', data);
  }
  Getsharenameandcodedetails(data)
  {
    
    this.sharenameandcodedetails=data
  }
  Sendsharenameandcodedetails()
  {
    
    return this.sharenameandcodedetails
  }
  savesharecapitaldetails(data)
  {
    return this._CommonService.callPostAPI('/Banking/Masters/ShareConfig/SaveShareConfigurationDeatils', data);
  }
  GetShareNameAndCodeDetails(ShareName,ShareCode)
  {
    
    const params = new HttpParams().set('ShareName', ShareName).set('ShareCode', ShareCode);
    return this._CommonService.callGetAPI('/Banking/Masters/ShareConfig/GetShareNameAndCodeDetails',params,'Yes')
  }
  
CheckDuplicateShareName(ShareName)
{
  
  const params = new HttpParams().set('ShareName', ShareName)
  return this._CommonService.callGetAPI('/Banking/Masters/ShareConfig/CheckDuplicateShareName',params,'Yes')
}
GetShareConfigurationDetails(ShareName,ShareCode)
{
debugger;
  const params = new HttpParams().set('ShareName', ShareName).set('ShareCode', ShareCode);
  return this._CommonService.callGetAPI('/Banking/Masters/ShareConfig/GetShareConfigurationDetails',params,'Yes')
}
Getshareconfigdetails(data)
{
  this.shareconfigurationdetails=data
}
sendshareconfigdetails()
{
  return this.shareconfigurationdetails
}
SaveShareConfigurationReferralDeatils(data)
{
  return this._CommonService.callPostAPI('/Banking/Masters/ShareConfig/SaveShareConfigurationReferralDeatils', data);
}
GetShareConfigurationReferralDetails(ShareName,ShareCode)
{
  
  const params = new HttpParams().set('ShareName', ShareName).set('ShareCode', ShareCode);
  return this._CommonService.callGetAPI('/Banking/Masters/ShareConfig/GetShareConfigurationReferralDetails',params,'Yes')
}
GetShareConfigViewDetails()
{
  return this._CommonService.callGetAPI('/Banking/Masters/ShareConfig/GetShareConfigViewDetails', '', 'NO')
}
DeleteShareConfig(ShareconfigID,ShareName)
{
  debugger
  let path = '/Banking/Masters/ShareConfig/DeleteShareConfig?ShareconfigID=' + ShareconfigID + '&ShareName=' + ShareName ;
 
  return this._CommonService.callPostAPIMultipleParameters(path);
}
CheckShareNameShareCodeDuplicate(shareid,ShareName,ShareCode): Observable<any> {
  try{
 const params = new HttpParams().set('shareid', shareid).set('ShareName', ShareName).set('ShareCode', ShareCode);
  return this._CommonService.callGetAPI('/Banking/Masters/ShareConfig/CheckDuplicatShareNameCode',params,'Yes')
  }
  catch(e){
    this._CommonService.showWarningMessage(e);
  }

}
Getdataforedit(data)
{
  debugger
   this.Tab1dataforedit=data[0]
   this.Tab2dataforedit=data[1]
   this.Tab3dataforedit=data[2]
}
SetTab1data()
{
  return  this.Tab1dataforedit
}
SetTab2data()
{
  return this.Tab2dataforedit
}
SetTab3data()
{
  return this.Tab3dataforedit
}
Newformstatus(status)
{
  this.status = status
}
Newstatus() {
  return this.status
}
}
