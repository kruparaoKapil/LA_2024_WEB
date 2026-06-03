import { Injectable } from '@angular/core';
import { CommonService } from 'src/app/Services/common.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApprovalService {

  constructor(private _CommonService: CommonService) { }

  

  GetApprovalsDataByStatus(type){
    const params = new HttpParams().set('Viewtype', type);
    return this._CommonService.callGetAPI('/loans/Transactions/Approval/ViewApplications', params, 'YES');
  }

  GetApprovalDataByID(Applicationid){
    const params = new HttpParams().set('applicationid', Applicationid);
    return this._CommonService.callGetAPI('/loans/Transactions/Approval/ViewApplicationsbyid', params, 'YES');
  }

  GetChargesDatatoGrid(Loanname, Amount, tenor, ApplicantType, loanpayin, transdate, schemeid){   
    const params = new HttpParams().set('Loanname', Loanname).set("Amount", Amount).set("tenor", tenor).set("applicanttype", ApplicantType).set("Loanpayin", loanpayin).set("tranddate", transdate).set("schemeid", schemeid);
    return this._CommonService.callGetAPI('/loans/Transactions/Approval/GetLoanwisecharges', params, 'YES');
  }

  SaveApprovalData(data){
    return this._CommonService.callPostAPI('/loans/Transactions/Approval/Saveapprovedapplications',data);
  }

GetSavingdetails(applicantid){
  const params = new HttpParams().set('Applicationid', applicantid);
  return this._CommonService.callGetAPI('/loans/Transactions/Approval/GetSavingdetails', params, 'YES');
}
GetExstingloandetails(applicantid){
  const params = new HttpParams().set('Applicationid', applicantid);
  return this._CommonService.callGetAPI('/loans/Transactions/Approval/GetExstingloandetails', params, 'YES');
}


}
