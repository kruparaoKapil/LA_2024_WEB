import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Rx'
import { environment } from 'src/environments/environment';
import { CommonService } from '../../common.service';

@Injectable({
    providedIn: 'root'
})


export class ChargemasterService {
    editinfo: any;
    ctype: any;
    ButtonType: any;
    httpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
    });
    constructor(private http: HttpClient, private _CommonService: CommonService) {

    }

    getLoanChargeTypes(pLoanid): Observable<any> {


        const params = new HttpParams().set('loanid', pLoanid);
        return this._CommonService.callGetAPI('/loans/masters/ChargesMaster/GetLoanWiseChargesName', params, 'YES');
    }

    saveLoanChargeConfig(data): Observable<any> {

        try {
            return this._CommonService.callPostAPI('/loans/masters/ChargesMaster/UpdateLoanWiseChargeConfig', data);
        }
        catch (e) {
            this._CommonService.showErrorMessage(e);
        }
    }

    getChargeNames(chargeStatus): Observable<any> {

        const params = new HttpParams().set('chargeStatus', chargeStatus);
        return this._CommonService.callGetAPI('/loans/masters/ChargesMaster/GetChargesName', params, 'YES');

    }
    GetApplicanttypes(loanid): Observable<any> {
        const params = new HttpParams().set('loanid', loanid);
        return this._CommonService.callGetAPI('/loans/masters/ChargesMaster/GetLoanWiseApplicantTypes', params, 'YES');
    }
    getLoanpayins(loanid, applicanttype): Observable<any> {
        const params = new HttpParams().set('loanid', loanid).set('applicanttype', applicanttype);
        return this._CommonService.callGetAPI('/loans/masters/ChargesMaster/GetLoanWiseLoanpayin', params, 'YES');
    }
    CheckChargeNameDuplicates(chargename, chargeid) {
        
        const params = new HttpParams().set('ChargeName', chargename).set('chargeid', chargeid);
        //return this._CommonService.callGetAPI('/loans/masters/ChargesMaster/CheckDuplicateChargeNames', params, 'YES');
        return this._CommonService.callGetAPI('/loans/masters/ChargesMaster/CheckDuplicateChargeNames', params, 'YES')
    }




    saveChargesName(data) {
        return this._CommonService.callPostAPI('/loans/masters/ChargesMaster/SaveChargesName', data);
    }
    updateChargesName(updateddata) {
        return this._CommonService.callPostAPI('/loans/masters/ChargesMaster/UpdateChargeName', updateddata);
    }
    deleteChargesName(deletedata) {

        return this._CommonService.callPostAPI('/loans/masters/ChargesMaster/DeleteChargesName', deletedata);
    }
    getLoanChargeConfig(pLoanChargeid): Observable<any> {
        const params = new HttpParams().set('loanChargeid', pLoanChargeid);
        return this._CommonService.callGetAPI('/loans/masters/ChargesMaster/GetLoanWiseChargeConfig', params, 'YES');

    }
    checkLoanChargeTypes(pChargeid, pLoanid): Observable<any> {
        const params = new HttpParams().set('loanid', pLoanid).set('ChargeName', pChargeid);

        return this._CommonService.callGetAPI('/loans/masters/ChargesMaster/CheckDuplicateChargeNamesByLoanid', params, 'YES');
    }
    saveLoanChargeTypes(data): Observable<any> {

        try {
            return this._CommonService.callPostAPI('/loans/masters/ChargesMaster/SaveLoanWiseChargesName', data);

        }
        catch (e) {
            this._CommonService.showErrorMessage(e);
        }
    }

    deleteLoanChargeType(Data: any) {

        return this._CommonService.callPostAPI('/loans/masters/ChargesMaster/DeleteLoanWiseChargeConfig', Data);
    }
    SetButtonType(type) {
        this.ButtonType = type
    }
    GetButtonType() {
        return this.ButtonType
    }

    loadEditInformation(data) {
        this.editinfo = [];
        this.editinfo.push(data);
    }

    getEditInformation(): any {

        return this.editinfo;

    }
    GetChargesAmount(Loanid,ChargeName,Amount):Observable<any>{
        try{
      const params = new HttpParams().set('Loanid', Loanid).set('ChargeName',ChargeName).set('Amount', Amount);

        return this._CommonService.callGetAPI('/loans/Transactions/Receipts/GetChargeAmount', params, 'YES');
        }
        catch(e){
            this._CommonService.showErrorMessage(e);
        }
    }
}
