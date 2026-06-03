import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, Validators, FormControl, FormArray } from '@angular/forms';

import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Observable } from 'rxjs/Rx'
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';
import appsettings from '../../assets/appsettings.json';
import { mergeMap } from 'rxjs/operators';
import { Subject } from 'rxjs'
import { DatePipe, formatDate } from '@angular/common';
import { debug } from 'util';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_EXTENSION = '.xlsx';

@Injectable({
    providedIn: 'root'
})
export class CommonService {
    //apiURL = appsettings[0].ApiHostUrl;
    FiTab1Details: any
    searchfilterlength = 3;
    //BankData: any;
    private ActiveTabName = new Subject<any>()
    private FiTab1Data = new Subject<any>();
    private FiTabName: any;
    private BankData = new Subject<any>();
    private BankUpdate = new Subject<any>();
    private KYCData = new Subject<any>();
    private KYCUpdate = new Subject<any>();
    private TDSData = new Subject<any>();
    private TDSUpdate = new Subject<any>();
    private ContactData = new Subject<any>();
    private ContactUpdate = new Subject<any>();
    private UpdateContactData = new Subject<any>();
    public ReferralViewData: any;
    public ReferralId: any;
    public GeneralReceiptView = new Subject<any>();
    public PaymentView = new Subject<any>();
    public UserRightsView = new Subject<any>();
    public reportLableName: any;
    // private dataSource = new BehaviorSubject({});
    // data = this.dataSource.asObservable();
    // FiTab1Details: any
    // private FiTab1Data = new Subject<any>()
    ValidationErrorMessages = {}
    errormessages: any
    datevalue: any;
    year: any;
    month: any;
    day: any;
    newDate: any;
  searchplaceholder = 'Please enter 3 or more characters';
    messageShowTimeOut = 1500;
    pCreatedby: any;
    pStatusname = 'ACTIVE';
    ptypeofoperation = 'CREATE';
    comapnydetails: any;

    private ValidationStatus = new Subject<any>()
    _validationStatus: any;

    pageSize = 10;
    RelationshipData: any = [];
    dateFormat: string;
    public extractData(res: Response) {

        let body = res;
        return body;
    }

    public handleError(error: Response | any) {
        debugger
        console.error(error.message || error);
        return Observable.throw(error.message || error);
    }
    showErrorMessage(errormsg: string) {
        debugger
        this.toastr.error(errormsg, "Error!");
    }
    showErrorMessageForLessTime(errormsg: string) {
        debugger
        this.toastr.error(errormsg, "Error!", { timeOut: 2500 });
    }
    showInfoMessage(errormsg: string) {

        this.toastr.success(errormsg, "Success!");
    }
    constructor(private datepipe: DatePipe, private http: HttpClient, private toastr: ToastrService) {

        this._validationStatus = false;
        let Urc = sessionStorage.getItem("Urc");
        if (Urc == null) {

            this.pCreatedby = 0;

        }
        else {
            this.pCreatedby = JSON.parse(sessionStorage.getItem("Urc"))["pUserID"];
        }

        this.comapnydetails = JSON.parse(sessionStorage.getItem("companydetails"));

        //if (this.comapnydata == null) {
        //    this.pCompanyName = '';
        //    this.pAddress1 = '';
        //    this.pAddress2 = '';
        //    this.pcity = '';
        //    this.pCountry = '';
        //    this.pState = '';
        //    this.pDistrict ='';
        //    this.pPincode ='';
        //    this.pCinNo = '';
        //    this.pGstinNo = '';
        //    this.pBranchname = '';
        //}
        //else {
        //    this.pCompanyName = this.comapnydata['pCompanyName'];
        //    this.pAddress1 = this.comapnydata['pAddress1'];
        //    this.pAddress2 = this.comapnydata['pAddress2'];
        //    this.pcity = this.comapnydata['pcity'];
        //    this.pCountry = this.comapnydata['pCountry'];
        //    this.pState = this.comapnydata['pState'];
        //    this.pDistrict = this.comapnydata['pDistrict'];
        //    this.pPincode = this.comapnydata['pPincode'];
        //    this.pCinNo = this.comapnydata['pCinNo'];
        //    this.pGstinNo = this.comapnydata['pGstinNo'];
        //    this.pBranchname = this.comapnydata['pBranchname'];
        //}
        //
        //this.apiURL = appsettings.ApiHostUrl;
    }
    GetBrowkenDaysandAmountData(disbursementmode, pvchapplicationid, emiday, papprovedloanamount, ploandisbusableamount, intrestrate, tenure, disbursedate, firstinstallmentdate, disbursementstatus, ploanpayin) {

        const params = new HttpParams().set('disbursementmode', disbursementmode).set('applicationid', pvchapplicationid).set('emiday', emiday).set('loanamount', papprovedloanamount).set('disburseamount', ploandisbusableamount).set('intrestrate', intrestrate).set('tenure', tenure).set('disbursedate', disbursedate).set('firstinstallmentdate', firstinstallmentdate).set('disbursementstatus', disbursementstatus).set('ploanpayin', ploanpayin);

        return this.http.get(environment.apiURL).pipe(
            mergeMap(json => this.http.get(json[0]['ApiHostUrl'] + '/loans/Transactions/Disbursement/GetBrowkenDaysandAmount?loanpayin=' + ploanpayin + '&disbursementmode=' + disbursementmode + '&applicationid=' + pvchapplicationid + '&emiday=' + emiday + '&loanamount=' + papprovedloanamount + '&disburseamount=' + ploandisbusableamount + '&intrestrate=' + intrestrate + '&tenure=' + tenure + '&disbursedate=' + disbursedate + '&firstinstallmentdate=' + firstinstallmentdate + '&disbursementstatus=' + disbursementstatus).map(this.extractData).catch(this.handleError)))


        //return this.http.get(appsettings[0].ApiHostUrl+'/loans/Transactions/Disbursement/GetBrowkenDaysandAmount?loanpayin='+ploanpayin+'&disbursementmode='+disbursementmode+'&applicationid='+pvchapplicationid+'&emiday='+emiday+'&loanamount='+papprovedloanamount+'&disburseamount='+ploandisbusableamount+'&intrestrate='+intrestrate+'&tenure='+tenure+'&disbursedate='+disbursedate+'&firstinstallmentdate='+firstinstallmentdate+'&disbursementstatus='+disbursementstatus);
        //this.callGetAPI('/loans/Transactions/Disbursement/GetBrowkenDaysandAmount', params, 'YES');
    }
    _setCompanyDetails() {

        this.comapnydetails = JSON.parse(sessionStorage.getItem("companydetails"));
    }

    _setPcreatedby() {

        this.pCreatedby = JSON.parse(sessionStorage.getItem("Urc"))["pUserID"];
    }
    GetBankList() {
        try {
            return this.callGetAPI('/Accounting/Masters/GetBAnkDetails', ' ', 'NO');
        }
        catch (e) {
            this.showErrorMessage(e);
        }
    }
    GetBankNames() {
        try {
            return this.callGetAPI('/Accounting/Masters/GetBankNames', ' ', 'NO');
        }
        catch (e) {
            this.showErrorMessage(e);
        }
    }
    GetChequeMinDate(formname, ProjectLaunchDate): Observable<any> {
        try {
            const params = new HttpParams().set('formname', formname).set('ProjectLaunchDate', ProjectLaunchDate)
            return this.callGetAPI('/Settings/GetCommonSetting', params, 'YES')
        }
        catch (e) {
            this.showErrorMessage(e);
        }
    }
    getValidationMessage(formcontrol: AbstractControl, errorkey: string, lablename: string, key: string, skipKey: string): string {
        let errormessage;
        //else if
        if (errorkey == 'required')
            errormessage = lablename + ' Required';
        if (errorkey == 'email' || errorkey == 'pattern')
            errormessage = 'Invalid ' + lablename;
        if (errorkey == 'minlength') {

            let length = formcontrol.errors[errorkey].requiredLength;
            errormessage = lablename + ' Must Have ' + length + ' Digits';
        }
        if (errorkey == 'maxlength' && key != skipKey) {

            let length = formcontrol.errors[errorkey].requiredLength;
            errormessage = lablename + ' Must Have ' + length + ' Digits';
        }
        if (errorkey == 'maxlength' && key == skipKey) {

            //let length = formcontrol.errors[errorkey].requiredLength;
            errormessage = 'Invalid ' + lablename;
        }

        return errormessage;
    }

    formatDateFromDDMMYYYY(value: any): Date | null {

        value = value.substr(0, 10);
        if (value != '' && value != null) {
            if (value.indexOf('/') > -1) {
                this.datevalue = value.split('/');
            }
            if (value.indexOf('-') > -1) {
                this.datevalue = value.split('-');
            }
            if (value.indexOf(' ') > -1) {
                this.datevalue = value.split(' ');
            }
            //console.log("this.datevalue : ", this.datevalue);

            this.day = Number(this.datevalue[0]);
            this.month = Number(this.datevalue[1]) - 1;
            this.year = Number(this.datevalue[2]);

            this.newDate = new Date(this.year, this.month, this.day);
            //console.log("this.newDate : ", this.newDate);

            return this.newDate;
        } else {
            return null
        }

    }
    formatDateFromYYYYMMDD(value: any): Date | null {

        value = value.substr(0, 10);
        if (value != '' && value != null) {
            if (value.indexOf('/') > -1) {
                this.datevalue = value.split('/');
            }
            if (value.indexOf('-') > -1) {
                this.datevalue = value.split('-');
            }
            if (value.indexOf(' ') > -1) {
                this.datevalue = value.split(' ');
            }

            this.day = Number(this.datevalue[2]);
            this.month = Number(this.datevalue[1]) - 1;
            this.year = Number(this.datevalue[0]);

            this.newDate = new Date(this.year, this.month, this.day);
            return this.newDate;
        } else {
            return null
        }

    }
    formatDateFromMMDDYYYY(value: any): Date | null {
        //undefined should be provide
        value = value.substr(0, 10);
        if (value != '' && value != null) {
            if (value.indexOf('/') > -1) {
                this.datevalue = value.split('/');
            }
            if (value.indexOf('-') > -1) {
                this.datevalue = value.split('-');
            }
            if (value.indexOf(' ') > -1) {
                this.datevalue = value.split(' ');
            }

            this.day = Number(this.datevalue[1]);
            this.month = Number(this.datevalue[0]) - 1;
            this.year = Number(this.datevalue[2]);

            this.newDate = new Date(this.year, this.month, this.day);
            return this.newDate;
        } else {
            return null
        }

    }
      getFormatDate(dateData: any): string | null {
        let data = this.datepipe.transform(dateData, 'dd/MM/yyyy');
        return data;
    }
    //let data = environment.apiURL;
    //if (parameterStatus.toUpperCase() == 'YES')
    //  return this.http.get(environment.apiURL + apiPath, { params }).map(this.extractData).catch(this.handleError);
    //else
    //  return this.http.get(environment.apiURL + apiPath).map(this.extractData).catch(this.handleError);
    // callGetAPI(apiPath, params, parameterStatus) {
    //     debugger

    //     let brancSelectionData = JSON.parse(sessionStorage.getItem("SetBranch"));
    //     let urldata = environment.apiURL;
    //     if (parameterStatus.toUpperCase() == 'YES')

    //         return this.http.get(urldata).pipe(
    //             mergeMap(json => this.http.get(json[0]['ApiHostUrl'] + apiPath, { params }).map(this.extractData).catch(this.handleError)));
    //     else
    //         return this.http.get(urldata).pipe(
    //             mergeMap(json => this.http.get(json[0]['ApiHostUrl'] + apiPath).map(this.extractData).catch(this.handleError)));

    // }

    callGetAPIWithout(apiPath, params, parameterStatus) {

        //let data = environment.apiURL;
        //if (parameterStatus.toUpperCase() == 'YES')
        //  return this.http.get(environment.apiURL + apiPath, { params }).map(this.extractData).catch(this.handleError);
        //else
        //  return this.http.get(environment.apiURL + apiPath).map(this.extractData).catch(this.handleError);
        let urldata = environment.apiURL;
        if (parameterStatus.toUpperCase() == 'YES')

            return this.http.get(urldata).pipe(
                mergeMap(json => this.http.get(json[0]['ApiHostUrl'] + apiPath, { params }).map(this.extractData).catch(this.handleError)));
        else
            return this.http.get(urldata).pipe(
                mergeMap(json => this.http.get(json[0]['ApiHostUrl'] + apiPath).map(this.extractData).catch(this.handleError)));

    }

    callGetAPI(apiPath, params, parameterStatus) {

        debugger
        let brancSelectionData = JSON.parse(sessionStorage.getItem("SetBranch"));
        let httpHeaders: any;
        if (brancSelectionData != null) {
            httpHeaders = new HttpHeaders({
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'X-Database-Name': brancSelectionData.pbranch_name
            });
        }
        else {
            httpHeaders = new HttpHeaders({
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
            });
        }
        let options = {
            headers: httpHeaders,
        };
        //let data = environment.apiURL;
        //if (parameterStatus.toUpperCase() == 'YES')
        //  return this.http.get(environment.apiURL + apiPath, { params }).map(this.extractData).catch(this.handleError);
        //else
        //  return this.http.get(environment.apiURL + apiPath).map(this.extractData).catch(this.handleError);
        let urldata = environment.apiURL;
        if (parameterStatus.toUpperCase() == 'YES')

            return this.http.get(urldata).pipe(
                mergeMap(json => this.http.get(json[0]['ApiHostUrl'] + apiPath + '?' + params, options).map(this.extractData).catch(this.handleError)));
        else
            return this.http.get(urldata).pipe(
                mergeMap(json => this.http.get(json[0]['ApiHostUrl'] + apiPath, options).map(this.extractData).catch(this.handleError)));

    }

    callPostAPI(apiPath, data) {
        debugger
        let brancSelectionData = JSON.parse(sessionStorage.getItem("SetBranch"));
        let urldata = environment.apiURL;
        let httpHeaders: any;
        if (brancSelectionData != null) {
            httpHeaders = new HttpHeaders({
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'X-Database-Name': brancSelectionData.pbranch_name
            });
        }
        else {
            httpHeaders = new HttpHeaders({
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
            });
        }

        httpHeaders.append('Access-Control-Allow-Origin', '/*');
        //httpHeaders.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');


        let options = {
            headers: httpHeaders
        };
        //console.log("data : ", data);

        //return this.http.post(environment.apiURL + apiPath, data, options).map(this.extractData).catch(this.handleError);
        return this.http.get(urldata).pipe(
            mergeMap(json => this.http.post(json[0]['ApiHostUrl'] + apiPath, data, options).map(this.extractData).catch(this.handleError)));

    }

    //Not used(Repeated)
    callPostAPIMultipleParameters(apiPath) {
        let urldata = environment.apiURL;
        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        });
        httpHeaders.append('Access-Control-Allow-Origin', '/*');
        // httpHeaders.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');

        let options = {
            headers: httpHeaders
        };
        return this.http.get(urldata).pipe(
            mergeMap(json => this.http.post(json[0]['ApiHostUrl'] + apiPath, options).map(this.extractData).catch(this.handleError)));

    }

    getReportAPI(apiPath, params, parameterStatus) {
        let urldata = environment.apiURL;
        if (parameterStatus.toUpperCase() == "YES")
            return this.http.get(urldata).pipe(
                mergeMap((json) =>
                    this.http
                        .get(json[0]["ApiReportUrl"] + apiPath, { params, responseType: 'blob' })
                        .map(this.extractDatablob)
                        .catch(this.handleError)
                )
            );
        else
            return this.http.get(urldata).pipe(
                mergeMap((json) =>
                    this.http
                        .get(json[0]["ApiReportUrl"] + apiPath, { responseType: 'blob' })
                        .map(this.extractDatablob)
                        .catch(this.handleError)
                )
            );
    }

    public extractDatablob(res: Response | Blob) {
        let body = res;
        return body;
    }


    public currencyformat(value) {
        //
        if (value == null) { value = 0; }
        else {
            value = parseFloat(value.toString().replace(/,/g, ""));
        }
        let withNegativeData: any;
        var result: any;
        //let currencyformat= this.cookieservice.get("savedformat")
        let currencyformat = "India"
        if (currencyformat == "India") {
            if (value < 0) {
                let stringData = value.toString();
                withNegativeData = stringData.substring(1, stringData.length);
                result = withNegativeData.toString().split('.');
            }
            else if (value >= 0) {
                result = value.toString().split('.');
            }
            var lastThree = result[0].substring(result[0].length - 3);
            var otherNumbers = result[0].substring(0, result[0].length - 3);
            if (otherNumbers != '')
                lastThree = ',' + lastThree;
            var output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
            if (result.length > 1) {
                output += "." + result[1];
            }
            if (value >= 0) {
                return output
            }
            else if (value < 0) {
                output = '-' + '' + output;
                return output
            }
            // }
        }
        else {
            // this.symbol = this.cookieservice.get("symbolofcurrency")
            var result = value.toString().split('.');
            var lastThree = result[0].substring(result[0].length - 3);
            var otherNumbers = result[0].substring(0, result[0].length - 3);
            if (otherNumbers != '')
                lastThree = ',' + lastThree;
            var output = otherNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + lastThree;
            if (result.length > 1) {
                output += "." + result[1];
            }
            //return this.symbol+"  "+output
        }

    }
    public functiontoRemoveCommas(value) {
        let a = value.split(',')
        let b = a.join('')
        let c = b
        return c;
    }
    public removeCommasInAmount(value) {
        if (isNullOrEmptyString(value))
            value = 0;
        return parseFloat(value.toString().replace(/,/g, ""))
        // let a = value.split(',')
        // let b = a.join('')
        // let c = b
        // return c;
    }

    GetContactDetails(contacttype: string) {

        const params = new HttpParams().set('contactType', contacttype)
        return this.callGetAPI('/Banking/Masters/FIMember/getContactDetails', params, 'YES')
        //   let httpHeaders = new HttpHeaders({
        //     'Content-Type': 'application/json',
        //     'Cache-Control': 'no-cache'
        //   })
        //   let HttpParams = { 'contactType': contacttype }
        //   let options = {
        //     headers: httpHeaders,
        //     params: HttpParams
        //   };
        // return this.http.get('http://192.168.2.164:9999/api/Settings/ReferralAdvocate/getContactDetails',options)
    }


    GetContactDetailsbyId(ContactId) {

        const params = new HttpParams().set('ContactId', ContactId)
        return this.callGetAPI('/Settings/ReferralAdvocate/GetContactDetailsbyId', params, 'YES')
    }
    ConvertImagepathtobase64(path) {
        const params = new HttpParams().set('strPath', path)
        return this.callGetAPI('/loans/masters/contactmaster/ConvertImagepathtobase64', params, 'YES')
    }

    SetFiTabName(data) {
        this.FiTabName = data;
    }
    GetFiTabName() {
        return this.FiTabName;
    }
    SetFiTab1Data(data) {
        this.FiTab1Details = data
    }
    GetFiTab1Data() {
        return this.FiTab1Details
    }
    _SetFiTab1Data(data) {
        this.FiTab1Data.next(data)
    }
    _GetFiTab1Data(): Observable<any> {
        return this.FiTab1Data.asObservable();
    }

    _SetBankUpdate(data) {
        this.BankUpdate.next(data);
    }
    _GetBankUpdate(): Observable<any> {
        return this.BankUpdate.asObservable();
    }
    _SetBankData(data) {
        this.BankData.next(data);
    }
    _GetBankData(): Observable<any> {
        return this.BankData.asObservable();
    }
    /////mahesh m
    CheckValidationStatus(status) {
        this.ValidationStatus.next(status)
    }
    GetValidationStatus(): Observable<any> {
        return this.ValidationStatus
    }


    _setValidationStatus(data: any) {

        this._validationStatus = data
    }
    _getValidationStatus() {
        return this._validationStatus;
    }

    _checkValidationsBetweenComponents() {
        this.ValidationStatus.next();
    }
    _CheckValidationStatus(): Observable<any> {
        return this.ValidationStatus.asObservable();
    }
    /////
    _SetKYCData(data) {
        this.KYCData.next(data);
    }
    _GetKYCData(): Observable<any> {
        return this.KYCData.asObservable();
    }
    _SetKYCUpdate(data) {
        this.KYCUpdate.next(data);
    }
    _GetKYCUpdate(): Observable<any> {
        return this.KYCUpdate.asObservable();
    }
    _SetTDSData(data) {
        this.TDSData.next(data);
    }
    _GetTDSData(): Observable<any> {
        return this.TDSData.asObservable();
    }

    _SetTDSUpdate(data) {
        this.TDSUpdate.next(data);
    }
    _GetTDSUpdate(): Observable<any> {
        return this.TDSUpdate.asObservable();
    }

    _SetContactData(data) {
        this.ContactData.next(data);
    }
    _GetContactData(): Observable<any> {
        return this.ContactData.asObservable();
    }
    _SetContactUpdate(data) {
        this.ContactUpdate.next(data);
    }
    _GetContactUpdate(): Observable<any> {
        return this.ContactUpdate.asObservable();
    }

    _SetReferralViewData(data) {
        this.ReferralViewData = data;
    }
    _GetReferralViewData() {
        return this.ReferralViewData;
    }


    _SetGeneralReceiptView(data) {
        this.GeneralReceiptView = data
        // this.GeneralReceiptView.next(data);
    }
    _GetGeneralReceiptView() {
        return this.GeneralReceiptView
    }

    _SetPaymentView(data) {
        this.PaymentView = data
    }
    _GetPaymentView() {
        return this.PaymentView
    }


    _SetReferralid(data) {
        this.ReferralId = data;
    }
    _GetReferralid() {
        return this.ReferralId;
    }

    fileUpload(data) {
        let urldata = environment.apiURL;
        return this.http.get(urldata).pipe(
            mergeMap(json => this.http.post(json[0]['ApiHostUrl'] + '/loans/masters/contact/MultiFileUpload', data).map(this.extractData).catch(this.handleError)));
    }

    fileUploadinfolder(foldername, data) {
        debugger;
        let urldata = environment.apiURL;
        let brancSelectionData = JSON.parse(sessionStorage.getItem("SetBranch"));
        return this.http.get(urldata).pipe(
            mergeMap(json => this.http.post(json[0]['ApiHostUrl'] + '/loans/masters/contact/MultiFileUploads?subfoldername=' + foldername + '&Branch=' + brancSelectionData.pbranch_name, data).map(this.extractData).catch(this.handleError)));
    }

    GetImage(strPath) {
        const params = new HttpParams().set('strPath', strPath)
        return this.callGetAPI('/loans/masters/contactmasterNew/ConvertImagepathtobase64', params, 'YES')
    }
    GetContactDetailsforKYC(ContactId) {

        const params = new HttpParams().set('pContactId', ContactId)
        return this.callGetAPI('/Settings/getDocumentstoreDetails', params, 'YES')
    }
    GetDateLockStatus() {
        return this.callGetAPI('/Settings/GetDateLockStatus', '', 'NO')
    }
    removeCommasForEntredNumber(enteredNumber) {
        return parseFloat(enteredNumber.toString().replace(/,/g, ""))
    }

    showWarningMessage(message) {
        this.toastr.warning(message, 'Warning!');
    }
    GetCollectionReport(fromDate, toDate, recordid, fieldname, fieldtype): Observable<any> {
        try {
            const params = new HttpParams().set('fromDate', fromDate).set('toDate', toDate).set('recordid', recordid).set('fieldname', fieldname).set('fieldtype', fieldtype);
            return this.callGetAPI('/CollectionReport/api/Loans/Reports/GetColletionsummary', params, 'YES');
        }
        catch (e) {
            this.showErrorMessage(e);
        }
    }

    GetGroupCreationMemberDetails(): Observable<any> {
        try {
            const params = new HttpParams();
            return this.callGetAPI('/Settings/GroupCreation/getContactDetails', '', 'NO');
        }
        catch (e) {
            this.showErrorMessage(e);
        }
    }
    _SetUserrightsView(data) {
        this.UserRightsView = data
        // this.GeneralReceiptView.next(data);
    }
    _GetUserrightsView() {
        return this.UserRightsView
    }


    GetCollectiondetails(fromDate, toDate, applicationid): Observable<any> {
        try {
            const params = new HttpParams().set('fromDate', fromDate).set('toDate', toDate).set('Applicationid', applicationid)
            return this.callGetAPI('/CollectionReport/api/Loans/Reports/GetColletiondetails', params, 'YES');
        }
        catch (e) {
            this.showErrorMessage(e);
        }
    }


    _setReportLableName(data) {

        this.reportLableName = data;
    }
    _getReportLableName() {

        return this.reportLableName;
    }

    Getmemberdetails(formname): Observable<any> {
        try {
            const params = new HttpParams().set('formname', formname);
            return this.callGetAPI('/Banking/Masters/MemberType/GetMemberDetails', params, 'YES');
        }
        catch (e) {
            this.showErrorMessage(e);
        }
    }
    GetMemberTypeDetails(formname): Observable<any> {
        try {
            const params = new HttpParams().set('formname', formname);
            return this.callGetAPI('/Banking/Masters/MemberType/GetMemberTypeDetails', params, 'YES');
        }
        catch (e) {
            this.showErrorMessage(e);
        }
    }
    Getsharememberdetails(): Observable<any> {
        try {
            return this.callGetAPI('/Banking/Masters/MemberType/GetShareMemberTypeDetails', '', 'NO');
        }
        catch (e) {
            this.showErrorMessage(e);
        }
    }
    ageCalculatorYYYYMMDD(fromDate, Todate): string {
        let Currentage = "";
        if (!isNullOrEmptyString(fromDate) && !isNullOrEmptyString(Todate)) {
            let start = new Date(fromDate);
            let end = new Date(Todate)

            let b_day = start.getDate();
            let b_month = start.getMonth() + 1;
            let b_year = start.getFullYear();

            let c_day = end.getDate();
            let c_month = end.getMonth() + 1;
            let c_year = end.getFullYear();

            if (b_day > c_day) {
                c_day = c_day + this.daysInMonth(c_month - 1, c_year);
                c_month = c_month - 1;
            }
            if (b_month > c_month) {
                c_year = c_year - 1;
                c_month = c_month + 12;
            }

            let calculated_date = c_day - b_day;
            let calculated_month = c_month - b_month;
            let calculated_year = c_year - b_year;

            Currentage = calculated_year + " Year  " + calculated_month + "  Months " + calculated_date + "  Days";

        }
        return Currentage;
    }
    daysInMonth(month, year) {
        if (month < 0)
            return 31;
        return new Date(year, month, 0).getDate();
    }
    ageCalculation(DOB): Number {


        let age;
        let dob = DOB;
        if (dob != '' && dob != null) {
            let currentdate = Date.now();
            //let agedate = new Date(dob);
            let agedate = new Date(dob).getTime();
            let timeDiff = Math.abs(currentdate - agedate);
            if (timeDiff.toString() != 'NaN')
                age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
            else
                age = 0;
        }
        else {
            age = 0;
        }
        return age;

    }
    _downloadReportsPdf(reportName, gridData, gridheaders, colWidthHeight, pagetype) {
        debugger;
        //let Companyreportdetails = this._getCompanyDetails();
        let comapnydata = this.comapnydetails;
        //console.log("company data",this.comapnydata)
        // this.pCompanyName = this.comapnydata['pCompanyName'];
        // this.pAddress1 = this.comapnydata['pAddress1'];
        // this.pAddress2 = this.comapnydata['pAddresspCinNo2'];
        // this.pcity = this.comapnydata['pcity'];
        // this.pCountry = this.comapnydata['pCountry'];
        // this.pState = this.comapnydata['pState'];
        // this.pDistrict = this.comapnydata['pDistrict'];
        // this.pPincode = this.comapnydata['pPincode'];
        // this.pCinNo = this.comapnydata['pCinNo'];
        // this.pGstinNo = this.comapnydata['pGstinNo'];
        // this.pBranchname = this.comapnydata['pBranchname'];
        //let doc = new jsPDF('a4')
        // var doc = new jsPDF();
        //let doc = new jsPDF('lanscape');
        // if(pagetype=="a4")
        // {
        //     let doc = new jsPDF('a4')
        // }
        // else{

        // }
        let doc = new jsPDF(pagetype);
        let totalPagesExp = '{total_pages_count_string}'
        let today = formatDate(new Date(), 'dd-MM-yyyy', 'en-IN');
        //let Easy_chit_Img = this.Easy_chit_Img;

        doc.autoTable({
            columns: gridheaders,
            body: gridData,
            theme: 'grid',//'striped'|'grid'|'plain'|'css' = 'striped'
            //headStyles: { fillColor: [231, 76, 60] }, // Red
            styles: {
                cellWidth: 'wrap',
                rowPageBreak: 'avoid',
                overflow: 'linebreak'
            },

            // Override the default above for the text column
            columnStyles: colWidthHeight,
            startY: 60,
            showHead: 'everyPage',//|'everyPage'|'never' = 'firstPage''
            showFoot: 'lastPage',
            didDrawPage: function (data) {

                let pageSize = doc.internal.pageSize;
                let pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
                let pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
                // Header
                doc.setFontStyle('normal');
                if (doc.internal.getNumberOfPages() == 1) {
                    debugger;
                    doc.setFontSize(15);
                    if (pagetype == "a4") {
                        // doc.addImage(Easy_chit_Img, 'JPEG', 85, 5, 30, 15)
                        doc.setTextColor('black');
                        doc.text(comapnydata.pCompanyName, 60, 27);
                        doc.setFontSize(14);
                        doc.text(reportName, 85, 45);
                        doc.setFontSize(10);
                        doc.text(comapnydata.pAddress1 + "," + comapnydata.pAddress2, 65, 32, 0, 0, 'left');
                        doc.text('CIN : ' + comapnydata.pCinNo + '', 75, 37);

                        //if (betweenorason == "Between") {

                        //    doc.text('Between  : ' + frommonthof + '  And  ' + tomonthof + ' ', 15, 52);
                        //}
                        //else {

                        //    doc.text('As On  : ' + tomonthof + '', 15, 52);
                        //}

                        // doc.text('Printed On : ' + today + '', 15, 57);
                        doc.text('Branch : ' + comapnydata.pBranchname + '', 147, 57);




                    }



                    //a3



                    // if (pagetype == "a1") {
                    //     // doc.addImage(Easy_chit_Img, 'JPEG', 85, 5, 30, 15)
                    //      doc.setTextColor('black');
                    //      doc.text(comapnydata.pCompanyName, 100, 27);
                    //      doc.setFontSize(14);
                    //      doc.text(reportName, 85, 45);
                    //      doc.setFontSize(10);
                    //      doc.text(comapnydata.pAddress1+ "," + comapnydata.pAddress2, 65, 32, 0, 0,'left');
                    //      doc.text('CIN : ' + comapnydata.pCinNo+ '', 75, 37);

                    //      //if (betweenorason == "Between") {

                    //      //    doc.text('Between  : ' + fromdate + '  And  ' + todate + ' ', 15, 52);
                    //      //}
                    //      //else {

                    //      //    doc.text('As On  : ' + fromdate + '', 15, 52);
                    //      //}

                    //      doc.text('Printed On : ' + today + '', 15, 57);
                    //      doc.text('Branch : ' + comapnydata.pBranchname + '', 147, 57);




                    //  }
                    if (pagetype == "landscape") {
                        //doc.addImage(Easy_chit_Img, 'JPEG', 125, 5, 30, 15)
                        doc.setTextColor('black');
                        doc.text(comapnydata.pCompanyName, 100, 27);

                        doc.setFontSize(14);
                        doc.text(reportName, 125, 45);
                        doc.setFontSize(10);
                        doc.text(comapnydata.pAddress1 + "," + comapnydata.pAddress2, 108, 32, 0, 0, 'left');
                        doc.text('CIN : ' + comapnydata.pCinNo + '', 118, 37);

                        //if (betweenorason == "Between") {

                        //    doc.text('Between  : ' + frommonthof + '  And  ' + tomonthof + ' ', 15, 52);
                        //}
                        //else {

                        //    doc.text('As On  : ' + tomonthof + '', 15, 52);
                        //}
                        // doc.text('Printed On : ' + today + '', 15, 57);
                        doc.text('Branch : ' + comapnydata.pBranchname + '', 235, 57);


                    }

                }
                else {

                    data.settings.margin.top = 20;
                    data.settings.margin.bottom = 15;
                }
                debugger;
                var pageCount = doc.internal.getNumberOfPages();
                if (doc.internal.getNumberOfPages() == totalPagesExp) {
                    debugger;

                }
                // Footer
                let page = "Page " + doc.internal.getNumberOfPages()
                // Total page number plugin only available in jspdf v1.0+
                if (typeof doc.putTotalPages === 'function') {
                    debugger;
                    page = page + ' of ' + totalPagesExp
                }
                doc.setFontSize(10);
                doc.text('Printed On : ' + today + '', data.settings.margin.left, pageHeight - 5);
                // doc.text(today, data.settings.margin.left, pageHeight - 5);
                //doc.text(officeCd, pageWidth / 2, pageHeight - 5, 'center');
                doc.text(page, pageWidth - data.settings.margin.right - 10, pageHeight - 5);
            }
        });
        if (typeof doc.putTotalPages === 'function') {
            debugger;
            doc.putTotalPages(totalPagesExp);

        }
        doc.save('' + reportName + '.pdf');

    }

    _downloadReportsPdf1(reportName, gridData, gridheaders, colWidthHeight, pagetype, betweenorason, frommonthof, tomonthof) {
        debugger;
        //let Companyreportdetails = this._getCompanyDetails();
        let comapnydata = this.comapnydetails;
        //console.log("company data",this.comapnydata)
        // this.pCompanyName = this.comapnydata['pCompanyName'];
        // this.pAddress1 = this.comapnydata['pAddress1'];
        // this.pAddress2 = this.comapnydata['pAddresspCinNo2'];
        // this.pcity = this.comapnydata['pcity'];
        // this.pCountry = this.comapnydata['pCountry'];
        // this.pState = this.comapnydata['pState'];
        // this.pDistrict = this.comapnydata['pDistrict'];
        // this.pPincode = this.comapnydata['pPincode'];
        // this.pCinNo = this.comapnydata['pCinNo'];
        // this.pGstinNo = this.comapnydata['pGstinNo'];
        // this.pBranchname = this.comapnydata['pBranchname'];
        //let doc = new jsPDF('a4')
        // var doc = new jsPDF();
        //let doc = new jsPDF('lanscape');
        // if(pagetype=="a4")
        // {
        //     let doc = new jsPDF('a4')
        // }
        // else{

        // }
        let doc = new jsPDF(pagetype);
        let totalPagesExp = '{total_pages_count_string}'
        let today = formatDate(new Date(), 'dd-MM-yyyy', 'en-IN');
        //let Easy_chit_Img = this.Easy_chit_Img;

        doc.autoTable({
            columns: gridheaders,
            body: gridData,
            theme: 'grid',//'striped'|'grid'|'plain'|'css' = 'striped'
            //headStyles: { fillColor: [231, 76, 60] }, // Red
            styles: {
                cellWidth: 'wrap',
                rowPageBreak: 'avoid',
                overflow: 'linebreak'
            },

            // Override the default above for the text column
            columnStyles: colWidthHeight,
            startY: 60,
            showHead: 'everyPage',//|'everyPage'|'never' = 'firstPage''
            showFoot: 'lastPage',
            didDrawPage: function (data) {

                let pageSize = doc.internal.pageSize;
                let pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
                let pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
                // Header
                doc.setFontStyle('normal');
                if (doc.internal.getNumberOfPages() == 1) {
                    debugger;
                    doc.setFontSize(15);
                    if (pagetype == "a4") {
                        // doc.addImage(Easy_chit_Img, 'JPEG', 85, 5, 30, 15)
                        doc.setTextColor('black');
                        doc.text(comapnydata.pCompanyName, 60, 27);
                        doc.setFontSize(14);
                        doc.text(reportName, 85, 45);
                        doc.setFontSize(10);
                        doc.text(comapnydata.pAddress1 + "," + comapnydata.pAddress2, 65, 32, 0, 0, 'left');
                        doc.text('CIN : ' + comapnydata.pCinNo + '', 75, 37);

                        if (betweenorason == "Between") {

                            doc.text('Between  : ' + frommonthof + '  And  ' + tomonthof + ' ', 15, 52);
                        }
                        else {

                            doc.text('As On  : ' + tomonthof + '', 15, 52);
                        }

                        // doc.text('Printed On : ' + today + '', 15, 57);
                        doc.text('Branch : ' + comapnydata.pBranchname + '', 147, 57);




                    }



                    //a3



                    // if (pagetype == "a1") {
                    //     // doc.addImage(Easy_chit_Img, 'JPEG', 85, 5, 30, 15)
                    //      doc.setTextColor('black');
                    //      doc.text(comapnydata.pCompanyName, 100, 27);
                    //      doc.setFontSize(14);
                    //      doc.text(reportName, 85, 45);
                    //      doc.setFontSize(10);
                    //      doc.text(comapnydata.pAddress1+ "," + comapnydata.pAddress2, 65, 32, 0, 0,'left');
                    //      doc.text('CIN : ' + comapnydata.pCinNo+ '', 75, 37);

                    //      //if (betweenorason == "Between") {

                    //      //    doc.text('Between  : ' + fromdate + '  And  ' + todate + ' ', 15, 52);
                    //      //}
                    //      //else {

                    //      //    doc.text('As On  : ' + fromdate + '', 15, 52);
                    //      //}

                    //      doc.text('Printed On : ' + today + '', 15, 57);
                    //      doc.text('Branch : ' + comapnydata.pBranchname + '', 147, 57);




                    //  }
                    if (pagetype == "landscape") {
                        //doc.addImage(Easy_chit_Img, 'JPEG', 125, 5, 30, 15)
                        doc.setTextColor('black');
                        doc.text(comapnydata.pCompanyName, 100, 27);

                        doc.setFontSize(14);
                        doc.text(reportName, 125, 45);
                        doc.setFontSize(10);
                        doc.text(comapnydata.pAddress1 + "," + comapnydata.pAddress2, 108, 32, 0, 0, 'left');
                        doc.text('CIN : ' + comapnydata.pCinNo + '', 118, 37);

                        if (betweenorason == "Between") {

                            doc.text('Between  : ' + frommonthof + '  And  ' + tomonthof + ' ', 15, 52);
                        }
                        else {

                            doc.text('As On  : ' + tomonthof + '', 15, 52);
                        }
                        // doc.text('Printed On : ' + today + '', 15, 57);
                        doc.text('Branch : ' + comapnydata.pBranchname + '', 235, 57);


                    }

                }
                else {

                    data.settings.margin.top = 20;
                    data.settings.margin.bottom = 15;
                }
                debugger;
                var pageCount = doc.internal.getNumberOfPages();
                if (doc.internal.getNumberOfPages() == totalPagesExp) {
                    debugger;

                }
                // Footer
                let page = "Page " + doc.internal.getNumberOfPages()
                // Total page number plugin only available in jspdf v1.0+
                if (typeof doc.putTotalPages === 'function') {
                    debugger;
                    page = page + ' of ' + totalPagesExp
                }
                doc.setFontSize(10);
                doc.text('Printed On : ' + today + '', data.settings.margin.left, pageHeight - 5);
                // doc.text(today, data.settings.margin.left, pageHeight - 5);
                //doc.text(officeCd, pageWidth / 2, pageHeight - 5, 'center');
                doc.text(page, pageWidth - data.settings.margin.right - 10, pageHeight - 5);
            }
        });
        if (typeof doc.putTotalPages === 'function') {
            debugger;
            doc.putTotalPages(totalPagesExp);

        }
        doc.save('' + reportName + '.pdf');

    }
    _downloadReportsPdf11(reportName, gridData, gridheaders, colWidthHeight, pagetype, betweenorason, frommonthof, tomonthof, schemetype, paymenttype, companyname, branchname, type, accountno) {
        debugger;
        //let Companyreportdetails = this._getCompanyDetails();
        let comapnydata = this.comapnydetails;
        //console.log("company data",this.comapnydata)
        // this.pCompanyName = this.comapnydata['pCompanyName'];
        // this.pAddress1 = this.comapnydata['pAddress1'];
        // this.pAddress2 = this.comapnydata['pAddresspCinNo2'];
        // this.pcity = this.comapnydata['pcity'];
        // this.pCountry = this.comapnydata['pCountry'];
        // this.pState = this.comapnydata['pState'];
        // this.pDistrict = this.comapnydata['pDistrict'];
        // this.pPincode = this.comapnydata['pPincode'];
        // this.pCinNo = this.comapnydata['pCinNo'];
        // this.pGstinNo = this.comapnydata['pGstinNo'];
        // this.pBranchname = this.comapnydata['pBranchname'];
        //let doc = new jsPDF('a4')
        // var doc = new jsPDF();
        //let doc = new jsPDF('lanscape');
        // if(pagetype=="a4")
        // {
        //     let doc = new jsPDF('a4')
        // }
        // else{

        // }
        let doc = new jsPDF(pagetype);
        let totalPagesExp = '{total_pages_count_string}'
        let today = formatDate(new Date(), 'dd-MM-yyyy', 'en-IN');
        //let Easy_chit_Img = this.Easy_chit_Img;

        doc.autoTable({
            columns: gridheaders,
            body: gridData,
            theme: 'grid',//'striped'|'grid'|'plain'|'css' = 'striped'
            //headStyles: { fillColor: [231, 76, 60] }, // Red
            styles: {
                cellWidth: 'wrap',
                rowPageBreak: 'avoid',
                overflow: 'linebreak'
            },

            // Override the default above for the text column
            columnStyles: colWidthHeight,
            startY: 60,
            showHead: 'everyPage',//|'everyPage'|'never' = 'firstPage''
            showFoot: 'lastPage',
            didDrawPage: function (data) {

                let pageSize = doc.internal.pageSize;
                let pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
                let pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
                // Header
                doc.setFontStyle('normal');
                if (doc.internal.getNumberOfPages() == 1) {
                    debugger;
                    doc.setFontSize(15);
                    if (pagetype == "a4") {
                        // doc.addImage(Easy_chit_Img, 'JPEG', 85, 5, 30, 15)
                        doc.setTextColor('black');
                        doc.text(comapnydata.pCompanyName, 60, 27);
                        doc.setFontSize(14);
                        doc.text(reportName, 85, 45);
                        doc.setFontSize(10);
                        doc.text(comapnydata.pAddress1 + "," + comapnydata.pAddress2, 65, 32, 0, 0, 'left');
                        doc.text('CIN : ' + comapnydata.pCinNo + '', 75, 37);
                        // doc.text('Scheme:' + schemeid + '', 20, 52);
                        if (betweenorason == "Between") {

                            doc.text('Between  : ' + frommonthof + '  And  ' + tomonthof + ' ', 15, 52);
                        }
                        else {

                            doc.text('As On  : ' + tomonthof + '', 15, 52);
                        }

                        // doc.text('Printed On : ' + today + '', 15, 57);
                        doc.text('Branch : ' + comapnydata.pBranchname + '', 147, 57);




                    }



                    //a3



                    // if (pagetype == "a1") {
                    //     // doc.addImage(Easy_chit_Img, 'JPEG', 85, 5, 30, 15)
                    //      doc.setTextColor('black');
                    //      doc.text(comapnydata.pCompanyName, 100, 27);
                    //      doc.setFontSize(14);
                    //      doc.text(reportName, 85, 45);
                    //      doc.setFontSize(10);
                    //      doc.text(comapnydata.pAddress1+ "," + comapnydata.pAddress2, 65, 32, 0, 0,'left');
                    //      doc.text('CIN : ' + comapnydata.pCinNo+ '', 75, 37);

                    //      //if (betweenorason == "Between") {

                    //      //    doc.text('Between  : ' + fromdate + '  And  ' + todate + ' ', 15, 52);
                    //      //}
                    //      //else {

                    //      //    doc.text('As On  : ' + fromdate + '', 15, 52);
                    //      //}

                    //      doc.text('Printed On : ' + today + '', 15, 57);
                    //      doc.text('Branch : ' + comapnydata.pBranchname + '', 147, 57);




                    //  }
                    if (pagetype == "landscape") {
                        //doc.addImage(Easy_chit_Img, 'JPEG', 125, 5, 30, 15)
                        doc.setTextColor('black');
                        doc.text(comapnydata.pCompanyName, 100, 27);

                        doc.setFontSize(14);
                        doc.text(reportName, 125, 45);
                        doc.setFontSize(10);
                        doc.text(comapnydata.pAddress1 + "," + comapnydata.pAddress2, 108, 32, 0, 0, 'left');
                        doc.text('CIN : ' + comapnydata.pCinNo + '', 118, 37);
                        if (schemetype == "undefined") {
                            //  doc.text('Scheme Id :' + schemeid + '', 15, 45);
                        }
                        else {
                            doc.text('Scheme :' + schemetype + '', 15, 45);
                        }

                        doc.text('Payment Type :' + paymenttype + '', 15, 59);
                        doc.text('Advance Account Number :' + accountno + '', 235, 54);
                        doc.text('Type :' + type + '', 235, 45);

                        doc.text('Company :' + companyname + '', 15, 50);


                        doc.text('Branch :' + branchname + '', 235, 50);

                        if (betweenorason == "Between") {

                            doc.text('Between  : ' + frommonthof + '  And  ' + tomonthof + ' ', 15, 54);
                        }
                        else {

                            doc.text('As On  : ' + tomonthof + '', 15, 54);
                        }
                        // doc.text('Printed On : ' + today + '', 15, 57);
                        doc.text('Branch : ' + comapnydata.pBranchname + '', 235, 59);



                    }

                }
                else {

                    data.settings.margin.top = 20;
                    data.settings.margin.bottom = 15;
                }
                debugger;
                var pageCount = doc.internal.getNumberOfPages();
                if (doc.internal.getNumberOfPages() == totalPagesExp) {
                    debugger;

                }
                // Footer
                let page = "Page " + doc.internal.getNumberOfPages()
                // Total page number plugin only available in jspdf v1.0+
                if (typeof doc.putTotalPages === 'function') {
                    debugger;
                    page = page + ' of ' + totalPagesExp
                }
                doc.setFontSize(10);
                doc.text('Printed On : ' + today + '', data.settings.margin.left, pageHeight - 5);
                // doc.text(today, data.settings.margin.left, pageHeight - 5);
                //doc.text(officeCd, pageWidth / 2, pageHeight - 5, 'center');
                doc.text(page, pageWidth - data.settings.margin.right - 10, pageHeight - 5);
            }
        });
        if (typeof doc.putTotalPages === 'function') {
            debugger;
            doc.putTotalPages(totalPagesExp);

        }
        doc.save('' + reportName + '.pdf');

    }


    _downloadReportsPdfpromotedsalary(reportName, gridData, gridheaders, colWidthHeight, pagetype, betweenorason, frommonthof, tomonthof, agentname, type) {
        debugger;
        //let Companyreportdetails = this._getCompanyDetails();
        let comapnydata = this.comapnydetails;
        //console.log("company data",this.comapnydata)
        // this.pCompanyName = this.comapnydata['pCompanyName'];
        // this.pAddress1 = this.comapnydata['pAddress1'];
        // this.pAddress2 = this.comapnydata['pAddresspCinNo2'];
        // this.pcity = this.comapnydata['pcity'];
        // this.pCountry = this.comapnydata['pCountry'];
        // this.pState = this.comapnydata['pState'];
        // this.pDistrict = this.comapnydata['pDistrict'];
        // this.pPincode = this.comapnydata['pPincode'];
        // this.pCinNo = this.comapnydata['pCinNo'];
        // this.pGstinNo = this.comapnydata['pGstinNo'];
        // this.pBranchname = this.comapnydata['pBranchname'];
        //let doc = new jsPDF('a4')
        // var doc = new jsPDF();
        //let doc = new jsPDF('lanscape');
        // if(pagetype=="a4")
        // {
        //     let doc = new jsPDF('a4')
        // }
        // else{

        // }
        let doc = new jsPDF(pagetype);
        let totalPagesExp = '{total_pages_count_string}'
        let today = formatDate(new Date(), 'dd-MM-yyyy', 'en-IN');
        //let Easy_chit_Img = this.Easy_chit_Img;

        doc.autoTable({
            columns: gridheaders,
            body: gridData,
            theme: 'grid',//'striped'|'grid'|'plain'|'css' = 'striped'
            //headStyles: { fillColor: [231, 76, 60] }, // Red
            styles: {
                cellWidth: 'wrap',
                rowPageBreak: 'avoid',
                overflow: 'linebreak'
            },

            // Override the default above for the text column
            columnStyles: colWidthHeight,
            startY: 60,
            showHead: 'everyPage',//|'everyPage'|'never' = 'firstPage''
            showFoot: 'lastPage',
            didDrawPage: function (data) {

                let pageSize = doc.internal.pageSize;
                let pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
                let pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
                // Header
                doc.setFontStyle('normal');
                if (doc.internal.getNumberOfPages() == 1) {
                    debugger;
                    doc.setFontSize(15);
                    if (pagetype == "a4") {
                        // doc.addImage(Easy_chit_Img, 'JPEG', 85, 5, 30, 15)
                        doc.setTextColor('black');
                        doc.text(comapnydata.pCompanyName, 60, 27);
                        doc.setFontSize(14);
                        doc.text(reportName, 85, 45);
                        doc.setFontSize(10);
                        doc.text(comapnydata.pAddress1 + "," + comapnydata.pAddress2, 65, 32, 0, 0, 'left');
                        doc.text('CIN : ' + comapnydata.pCinNo + '', 75, 37);


                        if (betweenorason == "Between") {

                            doc.text('Between  : ' + frommonthof + '  And  ' + tomonthof + ' ', 15, 52);
                        }
                        else {

                            doc.text('As On  : ' + tomonthof + '', 15, 52);
                        }

                        // doc.text('Printed On : ' + today + '', 15, 57);
                        doc.text('Branch : ' + comapnydata.pBranchname + '', 147, 57);




                    }



                    //a3



                    // if (pagetype == "a1") {
                    //     // doc.addImage(Easy_chit_Img, 'JPEG', 85, 5, 30, 15)
                    //      doc.setTextColor('black');
                    //      doc.text(comapnydata.pCompanyName, 100, 27);
                    //      doc.setFontSize(14);
                    //      doc.text(reportName, 85, 45);
                    //      doc.setFontSize(10);
                    //      doc.text(comapnydata.pAddress1+ "," + comapnydata.pAddress2, 65, 32, 0, 0,'left');
                    //      doc.text('CIN : ' + comapnydata.pCinNo+ '', 75, 37);

                    //      //if (betweenorason == "Between") {

                    //      //    doc.text('Between  : ' + fromdate + '  And  ' + todate + ' ', 15, 52);
                    //      //}
                    //      //else {

                    //      //    doc.text('As On  : ' + fromdate + '', 15, 52);
                    //      //}

                    //      doc.text('Printed On : ' + today + '', 15, 57);
                    //      doc.text('Branch : ' + comapnydata.pBranchname + '', 147, 57);




                    //  }
                    if (pagetype == "landscape") {
                        //doc.addImage(Easy_chit_Img, 'JPEG', 125, 5, 30, 15)
                        doc.setTextColor('black');
                        doc.text(comapnydata.pCompanyName, 100, 27);

                        doc.setFontSize(14);
                        doc.text(reportName, 125, 45);
                        doc.setFontSize(10);
                        doc.text(comapnydata.pAddress1 + "," + comapnydata.pAddress2, 108, 32, 0, 0, 'left');
                        doc.text('CIN : ' + comapnydata.pCinNo + '', 118, 37);
                        if (agentname == "undefined") {

                        }
                        else {
                            doc.text('Agent Name : ' + agentname + '', 14, 58);
                        }
                        doc.text('Type  :' + type + '', 236, 58);
                        if (betweenorason == "Between") {

                            doc.text('Between  : ' + frommonthof + '  And  ' + tomonthof + ' ', 15, 52);
                        }
                        else {

                            doc.text('As On  : ' + tomonthof + '', 15, 52);
                        }
                        // doc.text('Printed On : ' + today + '', 15, 57);
                        doc.text('Branch : ' + comapnydata.pBranchname + '', 235, 52);


                    }

                }
                else {

                    data.settings.margin.top = 20;
                    data.settings.margin.bottom = 15;
                }
                debugger;
                var pageCount = doc.internal.getNumberOfPages();
                if (doc.internal.getNumberOfPages() == totalPagesExp) {
                    debugger;

                }
                // Footer
                let page = "Page " + doc.internal.getNumberOfPages()
                // Total page number plugin only available in jspdf v1.0+
                if (typeof doc.putTotalPages === 'function') {
                    debugger;
                    page = page + ' of ' + totalPagesExp
                }
                doc.setFontSize(10);
                doc.text('Printed On : ' + today + '', data.settings.margin.left, pageHeight - 5);
                // doc.text(today, data.settings.margin.left, pageHeight - 5);
                //doc.text(officeCd, pageWidth / 2, pageHeight - 5, 'center');
                doc.text(page, pageWidth - data.settings.margin.right - 10, pageHeight - 5);
            }
        });
        if (typeof doc.putTotalPages === 'function') {
            debugger;
            doc.putTotalPages(totalPagesExp);

        }
        doc.save('' + reportName + '.pdf');

    }


    _downloadReportsPdfmemberDetailsReport(reportName, gridData, gridheaders, colWidthHeight, pagetype, betweenorason, frommonthof, tomonthof) {
        debugger;
        let comapnydata = this.comapnydetails;
        let doc = new jsPDF(pagetype);
        let totalPagesExp = '{total_pages_count_string}'
        let today = formatDate(new Date(), 'dd-MM-yyyy', 'en-IN');
        //let Easy_chit_Img = this.Easy_chit_Img;

        doc.autoTable({
            columns: gridheaders,
            body: gridData,
            theme: 'grid',
            styles: {
                cellWidth: 'wrap',
                rowPageBreak: 'avoid',
                overflow: 'linebreak'
            },

            // Override the default above for the text column
            columnStyles: colWidthHeight,
            startY: 60,
            showHead: 'everyPage',//|'everyPage'|'never' = 'firstPage''
            showFoot: 'lastPage',
            didDrawPage: function (data) {

                let pageSize = doc.internal.pageSize;
                let pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
                let pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
                // Header
                doc.setFontStyle('normal');
                if (doc.internal.getNumberOfPages() == 1) {
                    debugger;
                    doc.setFontSize(15);
                    if (pagetype == "a4") {
                        // doc.addImage(Easy_chit_Img, 'JPEG', 85, 5, 30, 15)
                        doc.setTextColor('black');
                        doc.text(comapnydata.pCompanyName, 100, 27);
                        doc.setFontSize(14);
                        doc.text(reportName, 85, 45);
                        doc.setFontSize(10);
                        doc.text(comapnydata.pAddress1 + "," + comapnydata.pAddress2, 65, 32, 0, 0, 'left');
                        doc.text('CIN : ' + comapnydata.pCinNo + '', 75, 37);


                        if (betweenorason == "Between") {

                            doc.text('Between  : ' + frommonthof + '  And  ' + tomonthof + ' ', 15, 52);
                        }
                        else {

                            doc.text('As On  : ' + tomonthof + '', 15, 52);
                        }

                        // doc.text('Printed On : ' + today + '', 15, 57);
                        doc.text('Branch : ' + comapnydata.pBranchname + '', 147, 57);




                    }
                    if (pagetype == "landscape") {
                        //doc.addImage(Easy_chit_Img, 'JPEG', 125, 5, 30, 15)
                        doc.setTextColor('black');
                        doc.text(comapnydata.pCompanyName, 100, 27);

                        doc.setFontSize(14);
                        doc.text(reportName, 125, 45);
                        doc.setFontSize(10);
                        doc.text(comapnydata.pAddress1 + "," + comapnydata.pAddress2, 108, 32, 0, 0, 'left');
                        doc.text('CIN : ' + comapnydata.pCinNo + '', 118, 37);
                        if (betweenorason == "Between") {

                            doc.text('Between  : ' + frommonthof + '  And  ' + tomonthof + ' ', 15, 52);
                        }
                        else {

                            doc.text('As On  : ' + tomonthof + '', 15, 52);
                        }
                        // doc.text('Printed On : ' + today + '', 15, 57);
                        doc.text('Branch : ' + comapnydata.pBranchname + '', 235, 52);


                    }

                }
                else {

                    data.settings.margin.top = 20;
                    data.settings.margin.bottom = 15;
                }
                debugger;
                var pageCount = doc.internal.getNumberOfPages();
                if (doc.internal.getNumberOfPages() == totalPagesExp) {
                    debugger;

                }
                // Footer
                let page = "Page " + doc.internal.getNumberOfPages()
                // Total page number plugin only available in jspdf v1.0+
                if (typeof doc.putTotalPages === 'function') {
                    debugger;
                    page = page + ' of ' + totalPagesExp
                }
                doc.setFontSize(10);
                doc.text('Printed On : ' + today + '', data.settings.margin.left, pageHeight - 5);
                doc.text(page, pageWidth - data.settings.margin.right - 10, pageHeight - 5);
            }
        });
        if (typeof doc.putTotalPages === 'function') {
            debugger;
            doc.putTotalPages(totalPagesExp);

        }
        doc.save('' + reportName + '.pdf');

    }

    _downloadReportsPdfmemberwisereceipt(reportName, gridData, gridheaders, colWidthHeight, pagetype, betweenorason, frommonthof, tomonthof, membernameid) {
        debugger;
        //let Companyreportdetails = this._getCompanyDetails();
        let comapnydata = this.comapnydetails;
        //console.log("company data",this.comapnydata)
        // this.pCompanyName = this.comapnydata['pCompanyName'];
        // this.pAddress1 = this.comapnydata['pAddress1'];
        // this.pAddress2 = this.comapnydata['pAddresspCinNo2'];
        // this.pcity = this.comapnydata['pcity'];
        // this.pCountry = this.comapnydata['pCountry'];
        // this.pState = this.comapnydata['pState'];
        // this.pDistrict = this.comapnydata['pDistrict'];
        // this.pPincode = this.comapnydata['pPincode'];
        // this.pCinNo = this.comapnydata['pCinNo'];
        // this.pGstinNo = this.comapnydata['pGstinNo'];
        // this.pBranchname = this.comapnydata['pBranchname'];
        //let doc = new jsPDF('a4')
        // var doc = new jsPDF();
        //let doc = new jsPDF('lanscape');
        // if(pagetype=="a4")
        // {
        //     let doc = new jsPDF('a4')
        // }
        // else{

        // }
        let doc = new jsPDF(pagetype);
        let totalPagesExp = '{total_pages_count_string}'
        let today = formatDate(new Date(), 'dd-MM-yyyy', 'en-IN');
        //let Easy_chit_Img = this.Easy_chit_Img;

        doc.autoTable({
            columns: gridheaders,
            body: gridData,
            theme: 'grid',//'striped'|'grid'|'plain'|'css' = 'striped'
            //headStyles: { fillColor: [231, 76, 60] }, // Red
            styles: {
                cellWidth: 'wrap',
                rowPageBreak: 'avoid',
                overflow: 'linebreak'
            },

            // Override the default above for the text column
            columnStyles: colWidthHeight,
            startY: 60,
            showHead: 'everyPage',//|'everyPage'|'never' = 'firstPage''
            showFoot: 'lastPage',
            didDrawPage: function (data) {

                let pageSize = doc.internal.pageSize;
                let pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
                let pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
                // Header
                doc.setFontStyle('normal');
                if (doc.internal.getNumberOfPages() == 1) {
                    debugger;
                    doc.setFontSize(15);
                    if (pagetype == "a4") {
                        // doc.addImage(Easy_chit_Img, 'JPEG', 85, 5, 30, 15)
                        doc.setTextColor('black');
                        doc.text(comapnydata.pCompanyName, 60, 27);
                        doc.setFontSize(14);
                        doc.text(reportName, 85, 45);
                        doc.setFontSize(10);
                        doc.text(comapnydata.pAddress1 + "," + comapnydata.pAddress2, 65, 32, 0, 0, 'left');
                        doc.text('CIN : ' + comapnydata.pCinNo + '', 75, 37);

                        if (betweenorason == "Between") {

                            doc.text('Between  : ' + frommonthof + '  And  ' + tomonthof + ' ', 15, 52);
                        }
                        else {

                            doc.text('As On  : ' + tomonthof + '', 15, 52);
                        }

                        // doc.text('Printed On : ' + today + '', 15, 57);
                        doc.text('Branch : ' + comapnydata.pBranchname + '', 147, 57);




                    }



                    //a3



                    // if (pagetype == "a1") {
                    //     // doc.addImage(Easy_chit_Img, 'JPEG', 85, 5, 30, 15)
                    //      doc.setTextColor('black');
                    //      doc.text(comapnydata.pCompanyName, 100, 27);
                    //      doc.setFontSize(14);
                    //      doc.text(reportName, 85, 45);
                    //      doc.setFontSize(10);
                    //      doc.text(comapnydata.pAddress1+ "," + comapnydata.pAddress2, 65, 32, 0, 0,'left');
                    //      doc.text('CIN : ' + comapnydata.pCinNo+ '', 75, 37);

                    //      //if (betweenorason == "Between") {

                    //      //    doc.text('Between  : ' + fromdate + '  And  ' + todate + ' ', 15, 52);
                    //      //}
                    //      //else {

                    //      //    doc.text('As On  : ' + fromdate + '', 15, 52);
                    //      //}

                    //      doc.text('Printed On : ' + today + '', 15, 57);
                    //      doc.text('Branch : ' + comapnydata.pBranchname + '', 147, 57);




                    //  }
                    if (pagetype == "landscape") {
                        //doc.addImage(Easy_chit_Img, 'JPEG', 125, 5, 30, 15)
                        doc.setTextColor('black');
                        doc.text(comapnydata.pCompanyName, 100, 27);

                        doc.setFontSize(14);
                        doc.text(reportName, 125, 45);
                        doc.setFontSize(10);
                        doc.text(comapnydata.pAddress1 + "," + comapnydata.pAddress2, 108, 32, 0, 0, 'left');
                        doc.text('CIN : ' + comapnydata.pCinNo + '', 118, 37);
                        if (membernameid == "undefined") {

                        }
                        else {
                            doc.text('Member Name : ' + membernameid + '', 14, 58);
                        }

                        if (betweenorason == "Between") {

                            doc.text('Between  : ' + frommonthof + '  And  ' + tomonthof + ' ', 15, 52);
                        }
                        else {

                            doc.text('As On  : ' + tomonthof + '', 15, 52);
                        }
                        // doc.text('Printed On : ' + today + '', 15, 57);
                        doc.text('Branch : ' + comapnydata.pBranchname + '', 235, 57);


                    }

                }
                else {

                    data.settings.margin.top = 20;
                    data.settings.margin.bottom = 15;
                }
                debugger;
                var pageCount = doc.internal.getNumberOfPages();
                if (doc.internal.getNumberOfPages() == totalPagesExp) {
                    debugger;

                }
                // Footer
                let page = "Page " + doc.internal.getNumberOfPages()
                // Total page number plugin only available in jspdf v1.0+
                if (typeof doc.putTotalPages === 'function') {
                    debugger;
                    page = page + ' of ' + totalPagesExp
                }
                doc.setFontSize(10);
                doc.text('Printed On : ' + today + '', data.settings.margin.left, pageHeight - 5);
                // doc.text(today, data.settings.margin.left, pageHeight - 5);
                //doc.text(officeCd, pageWidth / 2, pageHeight - 5, 'center');
                doc.text(page, pageWidth - data.settings.margin.right - 10, pageHeight - 5);
            }
        });
        if (typeof doc.putTotalPages === 'function') {
            debugger;
            doc.putTotalPages(totalPagesExp);

        }
        doc.save('' + reportName + '.pdf');

    }


    _downloadReportsPdfmaturityintimation(reportName, gridData, gridheaders, colWidthHeight, pagetype, betweenorason, frommonthof, tomonthof, schemetype, branchname) {
        debugger;
        //let Companyreportdetails = this._getCompanyDetails();
        let comapnydata = this.comapnydetails;
        //console.log("company data",this.comapnydata)
        // this.pCompanyName = this.comapnydata['pCompanyName'];
        // this.pAddress1 = this.comapnydata['pAddress1'];
        // this.pAddress2 = this.comapnydata['pAddresspCinNo2'];
        // this.pcity = this.comapnydata['pcity'];
        // this.pCountry = this.comapnydata['pCountry'];
        // this.pState = this.comapnydata['pState'];
        // this.pDistrict = this.comapnydata['pDistrict'];
        // this.pPincode = this.comapnydata['pPincode'];
        // this.pCinNo = this.comapnydata['pCinNo'];
        // this.pGstinNo = this.comapnydata['pGstinNo'];
        // this.pBranchname = this.comapnydata['pBranchname'];
        //let doc = new jsPDF('a4')
        // var doc = new jsPDF();
        //let doc = new jsPDF('lanscape');
        // if(pagetype=="a4")
        // {
        //     let doc = new jsPDF('a4')
        // }
        // else{

        // }
        let doc = new jsPDF(pagetype);
        let totalPagesExp = '{total_pages_count_string}'
        let today = formatDate(new Date(), 'dd-MM-yyyy', 'en-IN');
        //let Easy_chit_Img = this.Easy_chit_Img;

        doc.autoTable({
            columns: gridheaders,
            body: gridData,
            theme: 'grid',//'striped'|'grid'|'plain'|'css' = 'striped'
            //headStyles: { fillColor: [231, 76, 60] }, // Red
            styles: {
                cellWidth: 'wrap',
                rowPageBreak: 'avoid',
                overflow: 'linebreak'
            },

            // Override the default above for the text column
            columnStyles: colWidthHeight,
            startY: 60,
            showHead: 'everyPage',//|'everyPage'|'never' = 'firstPage''
            showFoot: 'lastPage',
            didDrawPage: function (data) {

                let pageSize = doc.internal.pageSize;
                let pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
                let pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
                // Header
                doc.setFontStyle('normal');
                if (doc.internal.getNumberOfPages() == 1) {
                    debugger;
                    doc.setFontSize(15);
                    if (pagetype == "a4") {
                        // doc.addImage(Easy_chit_Img, 'JPEG', 85, 5, 30, 15)
                        doc.setTextColor('black');
                        doc.text(comapnydata.pCompanyName, 60, 27);
                        doc.setFontSize(14);
                        doc.text(reportName, 85, 45);
                        doc.setFontSize(10);
                        doc.text(comapnydata.pAddress1 + "," + comapnydata.pAddress2, 65, 32, 0, 0, 'left');
                        doc.text('CIN : ' + comapnydata.pCinNo + '', 75, 37);

                        if (betweenorason == "Between") {

                            doc.text('Between  : ' + frommonthof + '  And  ' + tomonthof + ' ', 15, 52);
                        }
                        else {

                            doc.text('As On  : ' + tomonthof + '', 15, 52);
                        }

                        // doc.text('Printed On : ' + today + '', 15, 57);
                        doc.text('Branch : ' + comapnydata.pBranchname + '', 147, 57);




                    }



                    //a3



                    // if (pagetype == "a1") {
                    //     // doc.addImage(Easy_chit_Img, 'JPEG', 85, 5, 30, 15)
                    //      doc.setTextColor('black');
                    //      doc.text(comapnydata.pCompanyName, 100, 27);
                    //      doc.setFontSize(14);
                    //      doc.text(reportName, 85, 45);
                    //      doc.setFontSize(10);
                    //      doc.text(comapnydata.pAddress1+ "," + comapnydata.pAddress2, 65, 32, 0, 0,'left');
                    //      doc.text('CIN : ' + comapnydata.pCinNo+ '', 75, 37);

                    //      //if (betweenorason == "Between") {

                    //      //    doc.text('Between  : ' + fromdate + '  And  ' + todate + ' ', 15, 52);
                    //      //}
                    //      //else {

                    //      //    doc.text('As On  : ' + fromdate + '', 15, 52);
                    //      //}

                    //      doc.text('Printed On : ' + today + '', 15, 57);
                    //      doc.text('Branch : ' + comapnydata.pBranchname + '', 147, 57);




                    //  }
                    if (pagetype == "landscape") {
                        //doc.addImage(Easy_chit_Img, 'JPEG', 125, 5, 30, 15)
                        doc.setTextColor('black');
                        doc.text(comapnydata.pCompanyName, 100, 27);

                        doc.setFontSize(14);
                        doc.text(reportName, 125, 45);
                        doc.setFontSize(10);
                        doc.text(comapnydata.pAddress1 + "," + comapnydata.pAddress2, 108, 32, 0, 0, 'left');
                        doc.text('CIN : ' + comapnydata.pCinNo + '', 118, 37);
                        if (schemetype == "undefined") {

                        }
                        else {
                            doc.text('Scheme Name : ' + schemetype + '', 15, 58);
                        }
                        doc.text('Branch Name  :' + branchname + '', 235, 59);

                        if (betweenorason == "Between") {

                            doc.text('Between  : ' + frommonthof + '  And  ' + tomonthof + ' ', 15, 52);
                        }
                        else {

                            doc.text('As On  : ' + tomonthof + '', 15, 52);
                        }
                        // doc.text('Printed On : ' + today + '', 15, 57);
                        doc.text('Branch : ' + comapnydata.pBranchname + '', 235, 53);


                    }

                }
                else {

                    data.settings.margin.top = 20;
                    data.settings.margin.bottom = 15;
                }
                debugger;
                var pageCount = doc.internal.getNumberOfPages();
                if (doc.internal.getNumberOfPages() == totalPagesExp) {
                    debugger;

                }
                // Footer
                let page = "Page " + doc.internal.getNumberOfPages()
                // Total page number plugin only available in jspdf v1.0+
                if (typeof doc.putTotalPages === 'function') {
                    debugger;
                    page = page + ' of ' + totalPagesExp
                }
                doc.setFontSize(10);
                doc.text('Printed On : ' + today + '', data.settings.margin.left, pageHeight - 5);
                // doc.text(today, data.settings.margin.left, pageHeight - 5);
                //doc.text(officeCd, pageWidth / 2, pageHeight - 5, 'center');
                doc.text(page, pageWidth - data.settings.margin.right - 10, pageHeight - 5);
            }
        });
        if (typeof doc.putTotalPages === 'function') {
            debugger;
            doc.putTotalPages(totalPagesExp);

        }
        doc.save('' + reportName + '.pdf');

    }
    _downloadReportsPdflienrelease(reportName, gridData, gridheaders, colWidthHeight, pagetype, betweenorason, frommonthof, tomonthof, branchname) {
        debugger;
        //let Companyreportdetails = this._getCompanyDetails();
        let comapnydata = this.comapnydetails;
        //console.log("company data",this.comapnydata)
        // this.pCompanyName = this.comapnydata['pCompanyName'];
        // this.pAddress1 = this.comapnydata['pAddress1'];
        // this.pAddress2 = this.comapnydata['pAddresspCinNo2'];
        // this.pcity = this.comapnydata['pcity'];
        // this.pCountry = this.comapnydata['pCountry'];
        // this.pState = this.comapnydata['pState'];
        // this.pDistrict = this.comapnydata['pDistrict'];
        // this.pPincode = this.comapnydata['pPincode'];
        // this.pCinNo = this.comapnydata['pCinNo'];
        // this.pGstinNo = this.comapnydata['pGstinNo'];
        // this.pBranchname = this.comapnydata['pBranchname'];
        //let doc = new jsPDF('a4')
        // var doc = new jsPDF();
        //let doc = new jsPDF('lanscape');
        // if(pagetype=="a4")
        // {
        //     let doc = new jsPDF('a4')
        // }
        // else{

        // }
        let doc = new jsPDF(pagetype);
        let totalPagesExp = '{total_pages_count_string}'
        let today = formatDate(new Date(), 'dd-MM-yyyy', 'en-IN');
        //let Easy_chit_Img = this.Easy_chit_Img;

        doc.autoTable({
            columns: gridheaders,
            body: gridData,
            theme: 'grid',//'striped'|'grid'|'plain'|'css' = 'striped'
            //headStyles: { fillColor: [231, 76, 60] }, // Red
            styles: {
                cellWidth: 'wrap',
                rowPageBreak: 'avoid',
                overflow: 'linebreak'
            },

            // Override the default above for the text column
            columnStyles: colWidthHeight,
            startY: 60,
            showHead: 'everyPage',//|'everyPage'|'never' = 'firstPage''
            showFoot: 'lastPage',
            didDrawPage: function (data) {

                let pageSize = doc.internal.pageSize;
                let pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
                let pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
                // Header
                doc.setFontStyle('normal');
                if (doc.internal.getNumberOfPages() == 1) {
                    debugger;
                    doc.setFontSize(15);
                    if (pagetype == "a4") {
                        // doc.addImage(Easy_chit_Img, 'JPEG', 85, 5, 30, 15)
                        doc.setTextColor('black');
                        doc.text(comapnydata.pCompanyName, 60, 27);
                        doc.setFontSize(14);
                        doc.text(reportName, 85, 45);
                        doc.setFontSize(10);
                        doc.text(comapnydata.pAddress1 + "," + comapnydata.pAddress2, 65, 32, 0, 0, 'left');
                        doc.text('CIN : ' + comapnydata.pCinNo + '', 75, 37);

                        if (betweenorason == "Between") {

                            doc.text('Between  : ' + frommonthof + '  And  ' + tomonthof + ' ', 15, 52);
                        }
                        else {

                            doc.text('As On  : ' + tomonthof + '', 15, 52);
                        }

                        // doc.text('Printed On : ' + today + '', 15, 57);
                        doc.text('Branch : ' + comapnydata.pBranchname + '', 147, 57);




                    }



                    //a3



                    // if (pagetype == "a1") {
                    //     // doc.addImage(Easy_chit_Img, 'JPEG', 85, 5, 30, 15)
                    //      doc.setTextColor('black');
                    //      doc.text(comapnydata.pCompanyName, 100, 27);
                    //      doc.setFontSize(14);
                    //      doc.text(reportName, 85, 45);
                    //      doc.setFontSize(10);
                    //      doc.text(comapnydata.pAddress1+ "," + comapnydata.pAddress2, 65, 32, 0, 0,'left');
                    //      doc.text('CIN : ' + comapnydata.pCinNo+ '', 75, 37);

                    //      //if (betweenorason == "Between") {

                    //      //    doc.text('Between  : ' + fromdate + '  And  ' + todate + ' ', 15, 52);
                    //      //}
                    //      //else {

                    //      //    doc.text('As On  : ' + fromdate + '', 15, 52);
                    //      //}

                    //      doc.text('Printed On : ' + today + '', 15, 57);
                    //      doc.text('Branch : ' + comapnydata.pBranchname + '', 147, 57);




                    //  }
                    if (pagetype == "landscape") {
                        //doc.addImage(Easy_chit_Img, 'JPEG', 125, 5, 30, 15)
                        doc.setTextColor('black');
                        doc.text(comapnydata.pCompanyName, 100, 27);

                        doc.setFontSize(14);
                        doc.text(reportName, 125, 45);
                        doc.setFontSize(10);
                        doc.text(comapnydata.pAddress1 + "," + comapnydata.pAddress2, 108, 32, 0, 0, 'left');
                        doc.text('CIN : ' + comapnydata.pCinNo + '', 118, 37);

                        doc.text('Branch Name  :' + branchname + '', 15, 58);

                        if (betweenorason == "Between") {

                            doc.text('Between  : ' + frommonthof + '  And  ' + tomonthof + ' ', 15, 52);
                        }
                        else {

                            doc.text('As On  : ' + tomonthof + '', 15, 52);
                        }
                        // doc.text('Printed On : ' + today + '', 15, 57);
                        doc.text('Branch : ' + comapnydata.pBranchname + '', 235, 57);


                    }

                }
                else {

                    data.settings.margin.top = 20;
                    data.settings.margin.bottom = 15;
                }
                debugger;
                var pageCount = doc.internal.getNumberOfPages();
                if (doc.internal.getNumberOfPages() == totalPagesExp) {
                    debugger;

                }
                // Footer
                let page = "Page " + doc.internal.getNumberOfPages()
                // Total page number plugin only available in jspdf v1.0+
                if (typeof doc.putTotalPages === 'function') {
                    debugger;
                    page = page + ' of ' + totalPagesExp
                }
                doc.setFontSize(10);
                doc.text('Printed On : ' + today + '', data.settings.margin.left, pageHeight - 5);
                // doc.text(today, data.settings.margin.left, pageHeight - 5);
                //doc.text(officeCd, pageWidth / 2, pageHeight - 5, 'center');
                doc.text(page, pageWidth - data.settings.margin.right - 10, pageHeight - 5);
            }
        });
        if (typeof doc.putTotalPages === 'function') {
            debugger;
            doc.putTotalPages(totalPagesExp);

        }
        doc.save('' + reportName + '.pdf');

    }

    _downloadReportsPdfselfadjustment(reportName, gridData, gridheaders, colWidthHeight, pagetype, betweenorason, frommonthof, tomonthof, paymenttype, companyname, branchname) {
        debugger;
        //let Companyreportdetails = this._getCompanyDetails();
        let comapnydata = this.comapnydetails;
        //console.log("company data",this.comapnydata)
        // this.pCompanyName = this.comapnydata['pCompanyName'];
        // this.pAddress1 = this.comapnydata['pAddress1'];
        // this.pAddress2 = this.comapnydata['pAddresspCinNo2'];
        // this.pcity = this.comapnydata['pcity'];
        // this.pCountry = this.comapnydata['pCountry'];
        // this.pState = this.comapnydata['pState'];
        // this.pDistrict = this.comapnydata['pDistrict'];
        // this.pPincode = this.comapnydata['pPincode'];
        // this.pCinNo = this.comapnydata['pCinNo'];
        // this.pGstinNo = this.comapnydata['pGstinNo'];
        // this.pBranchname = this.comapnydata['pBranchname'];
        //let doc = new jsPDF('a4')
        // var doc = new jsPDF();
        //let doc = new jsPDF('lanscape');
        // if(pagetype=="a4")
        // {
        //     let doc = new jsPDF('a4')
        // }
        // else{

        // }
        let doc = new jsPDF(pagetype);
        let totalPagesExp = '{total_pages_count_string}'
        let today = formatDate(new Date(), 'dd-MM-yyyy', 'en-IN');
        //let Easy_chit_Img = this.Easy_chit_Img;

        doc.autoTable({
            columns: gridheaders,
            body: gridData,
            theme: 'grid',//'striped'|'grid'|'plain'|'css' = 'striped'
            //headStyles: { fillColor: [231, 76, 60] }, // Red
            styles: {
                cellWidth: 'wrap',
                rowPageBreak: 'avoid',
                overflow: 'linebreak'
            },

            // Override the default above for the text column
            columnStyles: colWidthHeight,
            startY: 60,
            showHead: 'everyPage',//|'everyPage'|'never' = 'firstPage''
            showFoot: 'lastPage',
            didDrawPage: function (data) {

                let pageSize = doc.internal.pageSize;
                let pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
                let pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
                // Header
                doc.setFontStyle('normal');
                if (doc.internal.getNumberOfPages() == 1) {
                    debugger;
                    doc.setFontSize(15);
                    if (pagetype == "a4") {
                        // doc.addImage(Easy_chit_Img, 'JPEG', 85, 5, 30, 15)
                        doc.setTextColor('black');
                        doc.text(comapnydata.pCompanyName, 60, 27);
                        doc.setFontSize(14);
                        doc.text(reportName, 85, 45);
                        doc.setFontSize(10);
                        doc.text(comapnydata.pAddress1 + "," + comapnydata.pAddress2, 65, 32, 0, 0, 'left');
                        doc.text('CIN : ' + comapnydata.pCinNo + '', 75, 37);

                        if (betweenorason == "Between") {

                            doc.text('Between  : ' + frommonthof + '  And  ' + tomonthof + ' ', 15, 52);
                        }
                        else {

                            doc.text('As On  : ' + tomonthof + '', 15, 52);
                        }

                        // doc.text('Printed On : ' + today + '', 15, 57);
                        doc.text('Branch : ' + comapnydata.pBranchname + '', 147, 57);




                    }



                    //a3



                    // if (pagetype == "a1") {
                    //     // doc.addImage(Easy_chit_Img, 'JPEG', 85, 5, 30, 15)
                    //      doc.setTextColor('black');
                    //      doc.text(comapnydata.pCompanyName, 100, 27);
                    //      doc.setFontSize(14);
                    //      doc.text(reportName, 85, 45);
                    //      doc.setFontSize(10);
                    //      doc.text(comapnydata.pAddress1+ "," + comapnydata.pAddress2, 65, 32, 0, 0,'left');
                    //      doc.text('CIN : ' + comapnydata.pCinNo+ '', 75, 37);

                    //      //if (betweenorason == "Between") {

                    //      //    doc.text('Between  : ' + fromdate + '  And  ' + todate + ' ', 15, 52);
                    //      //}
                    //      //else {

                    //      //    doc.text('As On  : ' + fromdate + '', 15, 52);
                    //      //}

                    //      doc.text('Printed On : ' + today + '', 15, 57);
                    //      doc.text('Branch : ' + comapnydata.pBranchname + '', 147, 57);




                    //  }
                    if (pagetype == "landscape") {
                        //doc.addImage(Easy_chit_Img, 'JPEG', 125, 5, 30, 15)
                        doc.setTextColor('black');
                        doc.text(comapnydata.pCompanyName, 100, 27);

                        doc.setFontSize(14);
                        doc.text(reportName, 125, 45);
                        doc.setFontSize(10);
                        doc.text(comapnydata.pAddress1 + "," + comapnydata.pAddress2, 108, 32, 0, 0, 'left');
                        doc.text('CIN : ' + comapnydata.pCinNo + '', 118, 37);
                        doc.text('Type : ' + paymenttype + '', 15, 55);
                        if (paymenttype == "ADJUSTMENT") {
                            doc.text('Company Name : ' + companyname + '', 15, 59);
                            doc.text('Branch Name  :' + branchname + '', 236, 58);
                        }
                        if (betweenorason == "Between") {

                            doc.text('Between  : ' + frommonthof + '  And  ' + tomonthof + ' ', 15, 49);
                        }
                        else {

                            doc.text('As On  : ' + tomonthof + '', 15, 49);
                        }
                        // doc.text('Printed On : ' + today + '', 15, 57);
                        doc.text('Branch : ' + comapnydata.pBranchname + '', 235, 53);


                    }

                }
                else {

                    data.settings.margin.top = 20;
                    data.settings.margin.bottom = 15;
                }
                debugger;
                var pageCount = doc.internal.getNumberOfPages();
                if (doc.internal.getNumberOfPages() == totalPagesExp) {
                    debugger;

                }
                // Footer
                let page = "Page " + doc.internal.getNumberOfPages()
                // Total page number plugin only available in jspdf v1.0+
                if (typeof doc.putTotalPages === 'function') {
                    debugger;
                    page = page + ' of ' + totalPagesExp
                }
                doc.setFontSize(10);
                doc.text('Printed On : ' + today + '', data.settings.margin.left, pageHeight - 5);
                // doc.text(today, data.settings.margin.left, pageHeight - 5);
                //doc.text(officeCd, pageWidth / 2, pageHeight - 5, 'center');
                doc.text(page, pageWidth - data.settings.margin.right - 10, pageHeight - 5);
            }
        });
        if (typeof doc.putTotalPages === 'function') {
            debugger;
            doc.putTotalPages(totalPagesExp);

        }
        doc.save('' + reportName + '.pdf');

    }


    _getGroupingGridExportData(griddata, groupdcol, isgroupedcolDate) {
        debugger;

        let a = [];
        let keys = [];
        for (var i = 0; i < griddata.length; i++) {
            let Jsongroupcol;
            if (isgroupedcolDate == true) {
                Jsongroupcol = formatDate(griddata[i][groupdcol], 'dd-MM-yyyy', 'en-IN');
            }
            else {
                Jsongroupcol = griddata[i][groupdcol];
            }
            if (!a[Jsongroupcol]) {

                keys.push(Jsongroupcol);
                let k = { ...griddata[i] }
                a[Jsongroupcol] = [k];

            }
            a[Jsongroupcol].push(griddata[i]);

        }

        let final = [];
        for (var j = 0; j < keys.length; j++) {

            let keypair = a[keys[j]]
            for (var k = 0; k < keypair.length; k++) {
                let groupcolHead

                if (k == 0) {
                    if (isgroupedcolDate == true) {
                        groupcolHead = formatDate(keypair[k][groupdcol], 'dd-MM-yyyy', 'en-IN');
                    }
                    else {
                        groupcolHead = keypair[k][groupdcol];
                    }
                    keypair[k]["group"] = {
                        content: '' + groupcolHead + '',
                        colSpan: 15,
                        styles: { halign: 'left', fillColor: "#e6f7ff" },
                    };
                }
                final.push(keypair[k])
            }
        }

        return final;
    }
    Updatemoratoriuminstalments(applicationid, moratoriumdate, moratoriummonthscount, interestmode): Observable<any> {
        return this.http.get(environment.apiURL).pipe(
            mergeMap(json => this.http.get(json[0]['ApiHostUrl'] + '/loans/Transactions/Receipts/Updatemoratoriuminstalments?applicationid=' + applicationid + '&moratoriumdate=' + moratoriumdate + '&moratoriummonthscount=' + moratoriummonthscount + '&interestmode=' + interestmode).map(this.extractData).catch(this.handleError)))


        //return this.http.get(appsettings[0].ApiHostUrl+'/loans/Transactions/Disbursement/GetBrowkenDaysandAmount?loanpayin='+ploanpayin+'&disbursementmode='+disbursementmode+'&applicationid='+pvchapplicationid+'&emiday='+emiday+'&loanamount='+papprovedloanamount+'&disburseamount='+ploandisbusableamount+'&intrestrate='+intrestrate+'&tenure='+tenure+'&disbursedate='+disbursedate+'&firstinstallmentdate='+firstinstallmentdate+'&disbursementstatus='+disbursementstatus);
        //this.callGetAPI('/loans/Transactions/Disbursement/GetBrowkenDaysandAmount', params, 'YES');
    }

    getFormatDateNormal(date: any): string | null {
        if (date != null && date != '' && date != undefined)
            return this.datepipe.transform(date, 'dd/MM/yyyy').toString();
        else
            return null;
    }

    GetRelationshipData() {
        this.RelationshipData = [
            'Mother',
            'Father',
            'Spouse',
            'Son',
            'Daughter',
            'Brother',
            'Sister',
            'Grand father',
            'Grand mother',
            'Father in law',
            'Mother in law',
            'Brother in law',
            'Son in law',
            'Daughter in law',];
        return this.RelationshipData;
    }

    exceptionHandlingMessages(formName: string, methodName: string, errorMessage: string) {
        this.toastr.error(errorMessage, "Error!", { timeOut: 2500 });
    }

    datePickerPropertiesSetup(property) {
        let data;
        if (property == "containerClass") {
            data = "theme-dark-blue"
        }
        else if (property == "dateInputFormat") {
            // data = this.dateFormat;
            //data = sessionStorage.getItem("dateformat");
            data = sessionStorage.getItem("dateformat") || 'DD-MMM-YYYY';
        }

        else if (property == "showWeekNumbers") {
            data = false;
        }
        else if (property == "currencysymbol") {
            //data = this.currencysymbol;
            data = sessionStorage.getItem("currencyformat")
        }
        return data;
    }

    pdfProperties(propertytype) {
        // if (propertytype == "Date") {
        //     let time = formatDate(new Date(), 'dd-MMM-yyyy/h:mm:ss a', 'en-IN').split('/')[1];
        //     let today = (new Date()) + " " + time;
        //     return today;
        // }

              if (propertytype == "Date") {
  return formatDate(new Date(), 'dd-MMM-yyyy h:mm:ss a', 'en-IN');
}
        if (propertytype == "Header Color") {
            return '#0b4093';
        }
        if (propertytype == "Header Color1") {
            return 'white';
        }
        if (propertytype == "Header Alignment") {
            return 'center';
        }
        if (propertytype == "Header Fontsize") {
            return 7;
        }
        if (propertytype == "Cell Fontsize") {
            return 7;
        }
        if (propertytype == "Address Fontsize") {
            return 8;
        }
    }

    //

    getKapilGroupLogo() {

        let img = "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";
        return img;
    }

    setiFrameForPrint(doc) {
        debugger;
        const iframe = document.createElement('iframe');
        iframe.id = "iprint";
        iframe.name = "iprint";
        iframe.src = doc.output('bloburl');
        iframe.setAttribute('style', 'display: none;');
        document.body.appendChild(iframe);
        iframe.contentWindow.print();
    }

    convertAmountToPdfFormat(value) {
        let newvalue = '';
        let newamount = this.removeCommasForEntredNumber(value);
        if (newamount < 0)
            value = Math.abs(newamount);
        let amount = this.currencyformat(value);
        if (newamount < 0)
            amount = '(' + amount + ')';
        // if (this.currencysymbol != "₹") {
        //   return this.currencysymbol + " " + amount
        // } else {
        //   return amount;
        // }

    }

    getFormatDateGlobal(date: any): string | null {

        this.dateFormat = sessionStorage.getItem("dateformat");
        if (this.dateFormat == "MM DD YYYY") {
            return this.datepipe.transform(date, 'MM dd yyyy')
        }
        if (this.dateFormat == "DD MM YYYY") {
            return this.datepipe.transform(date, 'dd MM yyyy')
        }
        if (this.dateFormat == "YYYY MM DD") {
            return this.datepipe.transform(date, 'yyyy MM dd')
        }
        if (this.dateFormat == "DD/MM/YYYY") {
            return this.datepipe.transform(date, 'dd/MM/yyyy')
        }
        if (this.dateFormat == "MM/DD/YYYY") {
            return this.datepipe.transform(date, 'MM/dd/yyyy')
        }
        if (this.dateFormat == "YYYY/MM/DD") {
            return this.datepipe.transform(date, 'yyyy/MM/dd')
        }
        if (this.dateFormat == "DD-MM-YYYY") {
            return this.datepipe.transform(date, 'dd-MM-yyyy')
        }
        if (this.dateFormat == "MM-DD-YYYY") {
            return this.datepipe.transform(date, 'MM-dd-yyyy')
        }
        if (this.dateFormat == "YYYY-MM-DD") {
            return this.datepipe.transform(date, 'yyyy-MM-dd')
        }
        if (this.dateFormat == "DD-MMM-YYYY") {
            return this.datepipe.transform(date, 'dd-MMM-yyyy')
        }
        if (this.dateFormat == "MMM-DD-YYYY") {
            return this.datepipe.transform(date, 'MMM-dd-yyyy')
        }
        if (this.dateFormat == "YYYY-MMM-DD") {
            return this.datepipe.transform(date, 'yyyy-MMM-dd')
        }
        if (this.dateFormat == "YYYY-DD-MMM") {
            return this.datepipe.transform(date, 'dd-MMM-yyyy')
        }
    }

    _getRupeeSymbol() {
        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALgAAAESCAMAAAB5He/JAAAAkFBMVEUAAAD////t7e3u7u7s7Oz29vb09PT5+fn7+/vx8fGbm5vAwMCioqKQkJDNzc3Hx8eysrKoqKiWlpalpaV4eHjX19fh4eG5ubmvr6+BgYGMjIxVVVU6OjpnZ2cXFxfl5eVFRUVwcHAkJCROTk5oaGgyMjJBQUEODg4vLy9fX19ycnIlJSV8fHwdHR0TExNLS0uVx27cAAATPElEQVR4nNVdi3rbKgwOtsEm914SN0m79LK2S9dt7/92BzB2MAZb8iU+4dvGtgL5gyUB0o88IaKEYRjImsv6uFrN0jSdrbI6lfV6vU5nooh6PZulswdR5M8ebm5u5P+J+k7+5eFOFPnDuSh5Ldrk9c18Op3Oi/ruTtbTO/HDW1Hmup6K/xXVQv7sdrFY3Fr1QradWMBD9ntyDSW1gdP7sSGByolkwIMgUsAjPhsbEqxEZCJmO8zFJCH0z9iQQGVKw4mpmAm5DkF5FmBLwMlqbEiwspTAg1y+gyDkn2NDApUFFaCVcnJRElF/jQ0JVH4rnTTN4ZVYlBmzgNOxEcHKCzVmXMn5z7EhwUqUme+Jkm9R4vXYiGAlJUkiMRfm8Dg2Ilh5kljFpJ/t+GlsSLBylFiD8GzH07ERwcqcqhmXdjyO44TRKxGUA4mZKIkAnVkVehgbEqwcpXwHZ3NI52MjgpWplu8C+HZsRLDyqOU7A04pTd7GhgQry0SAFeIdi4pOgpBNx0YEKzsijAkvrErIN2MjgpXXRMo3L+x4yJ7HhgQrK5JE5oyTKxGUn0SJdlEmV7L0TI5hMduZVTm9Ph4Op59fu/3+VvqIpnPtX5qLPxf73W739fT2/to/kj+zpSjSP+arV6Je6XrDDfk+L0CUqlOFWE/VDxNRy6McEctrrBoIE0TYdrm+278cPnr6Fgd9amT56dGsqa5jUUsISWFR8pVT2kW5/iv7KGrqqGUDKvbsROxrEpKE283D4md3+F8kG9mEAIGiGpin/EjOMhO1/IpUCJOci5Iqq2cVZM8qjlbzr8dOyHesJLaRAwpVn+SAYjmERGtRK+ACn2ptGM+g7GiUDzNa7TqAv4lNsQ0cUBRwBxR1kNBfU7cOCuCBbp0LlwVcd0j4dt56c7m0gFegaOAVKGFx5mRSC0QttYIatdQOJhvkDSsdhPCR6KHdfuc3JzUj10Epe2u1cAn5LoTLKYWhrRAh49t9G+QHWh05hxIbUBIbiu0fL8QkFy6uhcsrhblCiA4P73jkU1rRoKQGStmOm2JrtQ5KrSMbuN3hBu993DBTvsFQSr5Dpq29EiqSWX+lFebykNR0EAJ/iwX+Tl2f0Ailasejs3DZxlM1tDuYCiE7HLGOjjumV4iKHT+PXIHSyY5nHUwpVE+d3iCRy32IT4Nq7bhXbLHAdQe6wa1JP6kHeNWOl4EbMSD1NcPMwumvGerWeUOzQ95QDX/uwPkLCvmSV0bOoVgjn6FYUbeK2Eb1dtynEGyHAX5w2PGoYsejYey46lA8zJAuMMg3Xe14b8ADHPKntsA7L/kOg0Ux0hKF6CU/N8th5BXbyG3H/QoRZTqG2DPuzU/gkdeORwPa8UKuwggO/NUniAg73hvwgCPivRs08ABq4RCikisEwihOCWzJz1UtcFsV2/LXWJXSIpTYuv8DCvzAylbFHhlmDgufQO48CC1xAZjDrCE4lPfn2NWOk+1sNpPMps1mu1mKP0JO6TGKsmF5tjiz3OvBmPpihFGWO2JUlKZwj4BPdFvezY4H9Fft+J8/Xn+9Pz4+fvw7nE5P4tfP++/d7lv83kuq1OJ2On9Yr9OHdZpK/9MS7JlcZcC5nprcIZTo/XnhmxIzo6ZGHpZDfTZQ9Vg+0JRF2414wFvxnFcrSWVbzVIxBWm6friRdDPJMFvs93KW7r9e7m1zGI6EG1tSGzhuPzpaeWLW0W05NiJgOYYT0xNDWTdf4MXKmiQlcxijj+jjlJNtx68lOhHZdvw6OFlqX0MmylEuPY0svhLy3ptcjNjZzRw2rJn/m7ItE204vRLNnFr7cX4lTIR3cibaqMjntZDglnFGRMityrVE9Hc0LDuE+HWsmT8KP52ecXYlHKFliWgjhCYYGxGsfJEzCSGzKtdBeP+MQsshdCWauWZlv0pAPsaGBCpPLDRCKZJ/+DA2JFg5UoOIIK0KGxsRrGSBf9Oxj4oejFbemO1XuRLN3HANXM94QlrEsUco00QREGIulVKUSbidZvcAFQ1rPi+u8e1FWYjf39/399/ijxdRvr5eXp5OshwOb//+Pf8Tvz8+HmV5//Xr9+/X36+vf7Ly48ffv5+fKkLexyWdZ1IN0GayQ7UbMCncgUy7A8XCqmvl+6K6TnRNijou/q06cJY9XAY5WT3Ky5Dz+d06na1m6Wy23Gw2S+m6jCIeHKOKS9U4SDQRbSqO/cAXoLV80hTi1btX3zSbw9ylSjlXrmbD230mIuREG5LXWdS/qDN2C9HOF2I01HSYooPdMPfWkBiy058T/8g5lNLIw0XdNPNMdIDcWEz5WESbqhTqkUOQt2bDByXauGgCtREJ+W9IVOKT2QFaGNHGQUDwRv/rOuQNE4OxED8BgJ/ihpErUDpE3aoKoTrYCpFARPzW/ISRiDa2QoA810vzEy5PtHECh2zh/kY+DfITbRzcWg3cw62t2E4Z8VLDnzuYogIJdT4xlxAyx8gGY9/s0QPRpsxYiDjoLlqKItqo+RvajscgTlz4PyLaaOsG2uyfWjM9BxMVBuIJpThOViYqNeawqsr24/FZlaJDDMqsEDXS9y5tDhnIf/DNWvIOh1uAOIj2sWzF9OyTW1sh2oCIAYd23FrVUhMQWMj1zobrnQ3XOxt9JslpH74OoqHeZKmGDDThM8jIFSiDbmtBDpvH2BwZDGVIOw6LKqXMBj4yYTIkoCDHP87tkXMo9Ue37rdSHA1lTWCXPZak5a2UwdwTMAbJk0uDQPeAhrLjIYy5F9WpPs6O19x1c9txx400geMZhDs/srnteO1dNyVUmohAjVoJlVGzvKHdgVodVAPQCXky+SB1I9dC0ValfMnMYTyD/B6Q92IcNaUQGAzbEkNstVVx23FDvod0CAFDBXO3BnWw4/lhD2zHy6dCIO5D9YBateMaStWOUyO7AK2pY1ftaphQ4A2mzwg5cgmKaVUC5yk/8J/yA9cpP4LGHpfcmkQXFP8pv287DuZHrYkttp3teL1fxWHHi3mhwHV+Im9FNI5cP+O0vxKTJZjW9ZJ0/LB6qxI0W5XgrPshnMogCfout1dJg+qtii22Le04ZxxBRjsUN+l6s+MVQ+GccVshEoq6sfymbFVus2AzbkPJyWSszoCaFpZVOohvsEHxXd5YAhu5Dop/dwi1Ksn2DscaeeLcfahxPU//7rCLHRf/z1PsTd9dEnocjWjHPjoTguoQ8+Pq9hmJejK5c2342mRCYDIlCWSLnUf/hYglQj5W+1Z5G2akMrK524dDKVmVPL9KrL0xiTZa0l2TZUEJo+N2drP7aMkreN8y53Gp9pTfZMdnz6eX+93+br1aqhQyx+NR3W+R1XI1Wz9M9/enx05MiG8Z9fOKbVvH/vCJGlO3SyDHg8yEkPspyNCMskNEyi4SWnw00mujOhR2fOhEdjfKHeBzTjV5a2vs+LC89xMHBIzaBWhx99Fx5UdKSL1rt0MmhHg44Lec+XgFOWPBSXGo5UKc7fhQonIfucW2cpu3Kerms+PDAH/aMPPp14Xo2trxVimAGsr9hnJwbLHVQUL06p+ououyy8Sk1icdlBcgjwuu4g082/Geue/v8yMNSwfUxmAxIBOCy473CvywOq/eYQgJGLnMIcyO93d39nGxdYltz8ALUekpOfPf/SosctPheAUQUbEyIUiN6AP4r+8VL4Ut7bCOVzmb/ONV5cwfJumc5fgw3YrNXHuqRVs73gn4r+80cont0MClcP1rifnzsF8dKePOnaqL4tDTkp/vbJI2xP2P/XobMspKZGnfngnNI63fZOUPM8a8Tufz8bSbpxs1Cg2rm8+SdSvMYe/bWtUaxCTVZSWHyWnpTYTJoe14/BcO/NEUWxBjIe/Q49EtZ+sThKRM7hOdOqHhSEvqzr6uw3Jth/JhOX+Y8Kw5ssxZfYAWsQCF5QUIT7TB3WNacihjf3A7jvMIfaoXOgCy8zbzClq64M4eR9xt1INNE/B6Set8mO0oDryUCUE8A9Tiuaf+fVOJsRA2MRZyXgHOzWz66UPUq7rWFER8H9qOS6FCKuiG24wFr9jaQRqYHa8NpZQiRgSVR/QXi+0QE9OhJeaISTljUUaH+uCVPXI5XBgyVIqVL1IT1LOtipOxAA/QVsKFuRRq4cK942BK/w92XH3NMEIp6IrhGAsuXkHLGbeD+wku41TUlUzQtlQDtDgP/wEmtlXGgmMxxNE+qgFahlpBd8RhbS9tx/VyxVEh7gfadsZtscVRm6S8WIYzPqKCgpu4mXUGpTggyGSWKme8AlTiqdekhVUB7w5xRBucgj6NaMdtiirOdzslDl5BfgLykl87uuB8TFzUFncV+3kFTo5vZYuNJwX7iDaINL+iBJjdoe9Q49gdtnjlSIJ6W+fz5e24l2iDS+R0X/VkmQf3JpdAi6sG/hsVCWqL+0B8t0BArpK6hvhXjjxjkG9sKVSTCHBOod1ezYRJXC7YeAQ77nEf4V6ne3LgsPWtjmjT4sqY92YcbgVd2Jf0ziOL/9Yu75bX/6qX9BquRaJW0HVsSqFtx+uCDC2uRfrseE6YfMYg35CL2vHaq78RZov7mPQKHBSR8F22xinoy0DAHTOu/mKFdMu3eVFOottyVBkTLO4/EwJKQVfUnMRL2XFPa9QZ9HhJ4LWigtzivplP3hbCHkUl0H/xXmCSu2eUF/eenjkOGktlZJ9fpQIF4VexzGH2MO8wyB/oyObQlEKUgi6dF78Hcgg1JT96RgB/LZlCCK8AvOSXiTYAmgDfYlbQJ8qrL8hq5BUAoeh0U/nDzL6qey8pnxFFeXEXtMO2NqmBgrPj2SqOUtAZu7Bjv45XgFLQjBMy4NHNjP67cvUZ2QBDTOLpZ2KOnOTZANskJDTTBhYdMJkQcLnV7+lg7gmMHVetGUpB7+iFHft1mRBQCrriYBecL0DbnAlBeWAYZ9oTw7QHpqh19D/BJLT/ZMS4TFUamVZGdjS0oZTTv2Zz4qfDlHy7QRhhFPRUXIzr7GZObCjYG7Q4BV3QC9txI+BhOYJDjlLQlA0WSjFf3u16iXflbd+4l0ttiXdk7yeAoLTIhMBgKUiy8lhzkECHCwOMQ8ghhahXN/yEp+rrbMe9vAJ9jMS9LONGrEONIfF6oo03QIst8AQTsqxI84j40u5ePuodU2IdGoL2kYktNhMCw6ygb5ew47AZF50xdPOdn9oUdM2EgM1qE6NW0JTARwY2bJ9fBeXF3ZJ6+l59JgQg0QaYCSHBXAD9TXq3494ArWP/pj1qugNKQU+9U1TzqH8TE7fKK6CoFXRKQKRgMJROebJQXlx9bxl7yscRbRrtuJZClIIeSf92HBoVtXPBoRT02RrZfQICB2i70QRQZ9B70py/kkGhoE75Dl5BglHQOcN5a1sRbaCZyVBEhRUhfdpxQETCBTzAK+gnJQ473i4iwe3oP8+i/pnD7hz1r/AKmL4yhrrQfzBGjnW6mRIRITE+IW9IHQ27vnJEBRkwZ9AdBUbdOhFtgJnJUAqasgsGaP3AM4VAvbt2k3jEtg/gjsCLM8CQR2owZ9B3XwzIObIrNUgGHBp18waLZUOUk+iJNV1v74VoA8wwiVlBpzQcwo63A456V9mM9xmgjbyiEjWKCsUp6OexXlT8jIWoHKDtI/84w6ygbxC/yoVeHRWiVtDveGQ7XuqAUdAHegmiTcOSXygERkGXvDXRJgNeF/130gRC3ZBXlgiG8eK+Js6RbShexkKvrxxhoJf/6PJEwiZz2AfRBgQ8TDAKekv7dex3eOWImBeMgqasC7dWtZQHUEI0TcDY6nO9g+d6B5839HeIMO+uj4qRK5/QCAXtnvAqRLaKo8IsH2rk/BPaZkIgne24asgweQm+SU92vMOSX6zgMWaLe8O6Em36eeWISuCRYLIRbUjxjhL8K0eQbmbLPVHxqoVHhIL+jdveA+rVjjO8gp4uQ7QhDjte5RWgFHTR0gVnR/99NAGGoQkQjBc3JZ5PqIUCe+VIhE3gwTEKeiyPXECpjbsM9OqoELOC/kp6J9p4A7SNsUUUH+elTShlCIKALCgv7hzPU+j0YtH6BB6Y7KYry161Yex3t+P5QQaTQZF7NKgfog1uxlGJQ95IdYVAZ0LoRhM4d4gxK+iO9JAJoeuLjIrHg1HQG4azKrbY9mPH8w6YLL7LHArGjvf9si6xvqlvyBAK+jchgJWzoKgKkUn0+p/oDYGO+usNQqI3CMl5o+DtEFsdEhoi8j8+kQQOpWuA1rk7NBUC48Vd0AsGaP12XHfAKOiM2VD6JNo0nYBshcCsoBsbiv8E1PuZs9IhQSjoY9xLJoRWp/yqQlDEFveFXtqx77bj2cgYBZ3TgYg2DZ4sd05PjBd3yUFQ8L5DdAfZEHMGzZJuNvoOe/bWuhUClbL6xC4ZoPXb8axDjFDQHR2WaFMFXpebGcPFTSksIoGPAZkdvFdFDRMkG2IUdJNnxW145YgnWIyOutVubChiBX1NWE3UTY18ETuuZ30+nd4uFovb6bmeinpRrW+X9JIB2nrgGcNSbErlv+UluFjXVNfqB1TX8AWobrkCAa+ojws4mKJqT0kFyn+Tw/Kw8v9FnAAAAABJRU5ErkJggg==";
    }
    GetContactDetailsByContactID(contactid) {
        const params = new HttpParams().set('contactid', contactid);
        return this.callGetAPI('/Common/GetContactDetailsByContactID', params, 'YES');
    }

    SaveForm15H(form15Hdetails) {
        return this.callPostAPI('/Banking/Transactions/FdReceipt/SaveForm15H', form15Hdetails);
    }


    // GetContactDetailsById(Contactid): Observable<any> {
    //     debugger;
    //     const params = new HttpParams().set('Contactid', Contactid);
    //     return this.callGetAPI('/Banking/Transactions/FdReceipt/getContactById', params, 'YES');

    // }

//  GetContactDetailsById(Contactid: number, fromDate: string, toDate: string): Observable<any> {
//   let params = new HttpParams() .set('Contactid', Contactid.toString()).set('fromdate', fromDate).set('todate', toDate);
//   return this.callGetAPI('/Banking/Transactions/FdReceipt/getContactById', params,'YES' );
// }

  GetContactDetailsById(Contactid: number, fromDate: string, toDate: string): Observable<any> {
  let params = new HttpParams().set('Contactid', Contactid.toString()).set('fromdate', fromDate).set('todate', toDate);
  return this.callGetAPI( '/Banking/Transactions/FdReceipt/getContactById', params,'YES' );
}

    GetCompanynames1() {
        return this.callGetAPI('/Banking/Transactions/FdReceipt/GetCompanyNames', '', 'NO');
    }

    GetContactData(contactType): Observable<any> {
        const params = new HttpParams().set('contactType', contactType)
        return this.callGetAPI('/Settings/ReferralAdvocate/getContactDetails', params, 'YES');
    }

    GetTdsSectionNo(): Observable<any> {
        return this.callGetAPI('/accounting/accountingtransactions/getTdsSectionNo', '', 'NO');
    }

    GetTanNo(pCompanyId) {
        const params = new HttpParams().set('pCompanyId', pCompanyId)
        return this.callGetAPI('/ChitTransactions/GetTanNo', params, 'YES');
    }

    GetForm15hReport(uid): Observable<any> {
        debugger;
        const params = new HttpParams().set('uid', uid);
        return this.callGetAPI('/Banking/Transactions/FdReceipt/GetForm15HReportDetails', params, 'YES');
    }
//       getschemaname() {
//     let pschemaname = sessionStorage.getItem("schemaname");
//     return pschemaname.toString();
//   }
    showSuccessMessage() {
    this.toastr.success("Saved successfully", "Success", { timeOut: this.messageShowTimeOut });
  }
    getcreatedby() {
    this.pCreatedby = JSON.parse(sessionStorage.getItem("LoginUserid"))

    return this.pCreatedby.toString();
  }
    // fileUploadS3(formName,data) {
    //   let urldata = environment.apiURL;
    //   return this.http.get(urldata).pipe(
    //     mergeMap(json => this.http.post(json[0]['ApiHostUrl'] + `/uploadFile/${formName}`, data).map(this.extractData).catch(this.handleError)));
    // }

        fileUploadS1(formName,data) {
      let urldata = environment.apiURL;
      return this.http.get(urldata).pipe(
        mergeMap(json => this.http.post(json[0]['ApiHostUrl'] + `/uploadFile1/${formName}`, data).map(this.extractData).catch(this.handleError)));
    }
    fileUpload1(data) {
        let urldata = environment.apiURL;
        return this.http.get(urldata).pipe(
            mergeMap(json => this.http.post(json[0]['ApiHostUrl'] + '/loans/masters/contact/MultiFileUpload', data).map(this.extractData).catch(this.handleError)));
    }
    // DownloadS3files(formName,fileName) {
    //   const params = new HttpParams().set('fileName', fileName)
    //   let urldata = environment.apiURL;
    //   return this.http.get(urldata).pipe(
    //     mergeMap(json => this.http.get(json[0]['ApiHostUrl'] + `/DownloadImage/${formName}/${fileName}`,{responseType:"blob" }).catch(this.handleError)));
    // }
    //     DownloadS3filesI(formName,fileName) {
    //   let urldata = environment.apiURL;
    //   return this.http.get(urldata).pipe(
    //     mergeMap(json => this.http.get(json[0]['ApiHostUrl'] + `/DownloadImage/${formName}/${fileName}`).map(this.extractData).catch(this.handleError)));
    // }
    GetGlobalBankNames() {
        try {
            return this.callGetAPI('/Accounting/Masters/GetBankNamesDistinct', ' ', 'NO');
        }
        catch (e) {
            this.showErrorMessage(e);
        }
    }
    GetBranchname(bankname) {
       const params = new HttpParams().set('bankname', bankname);
        return this.callGetAPI('/Accounting/Masters/GetBankBranchNames', params, 'YES');
    }

   getschemaname() {
    let pschemaname = sessionStorage.getItem("schemaname");
    return pschemaname.toString();
  }

    CheckForm15hContactExist(Contactid, finyear, companyid): Observable<any> {
    const params = new HttpParams().set("Contactid", Contactid).set("finyear", finyear).set("companyid", companyid);
    return this.callGetAPI("/Banking/Transactions/FdReceipt/GetForm15hContactExist", params, 'Yes');
  }

    getFormatDate1(date: any): string | null {
    debugger;
    this.dateFormat = sessionStorage.getItem("dateformat");
    if (this.dateFormat == "DD-MMM-YYYY") {
      return this.datepipe.transform(date, 'dd-MM-yyyy')
    }
  }
    isNullOrEmptyString(value): boolean {
    let isvalid = false;
    if (value == undefined || value == '' || value == null)
      isvalid = true;
    return isvalid;
  }

    getipaddress() {
    let ipaddress = sessionStorage.getItem("ipaddress")
    if (this.isNullOrEmptyString(ipaddress))
      ipaddress = '';
    return ipaddress.toString();

  }

  CheckPanValidForForm15h(Contactid): Observable<any> {
    const params = new HttpParams().set("Contactid", Contactid);
    return this.callGetAPI("/Configuration/GlobalConfiguration/CheckPanValidForForm15h", params, 'Yes');

}
  GetForm15HContactDetails(Contact_id, finyear, companyid): Observable<any> {
    const params = new HttpParams().set('Contact_id', Contact_id).set('finyear', finyear).set('companyid', companyid)
    return this.callGetAPI('/Subscriber/GetForm15HContactDetails', params, 'YES');
  }
    GetForm15HDetailsforEdit(uid): Observable<any> {
    const params = new HttpParams().set('uid', uid)
    return this.callGetAPI('/ContactMaster/GetForm15HDetailsforEdit', params, 'YES');
  }

  GetInterestDelayData(fromdate, todate): Observable<any>{
    try {
            const params = new HttpParams().set('fromdate', fromdate).set('todate', todate)
            return this.callGetAPI('/Banking/Transactions/MaturityPayment/GetDelayInterestData', params, 'YES');
        }
        catch (e) {
            this.showErrorMessage(e);
        }
  }

    GetAttendance(branchschema,fromdate,todate){
    debugger
    try {
      const params = new HttpParams().set('branchschema',branchschema).set('fromdate',fromdate).set('todate',todate);
     // return this.callGetAPI('/Transactions/HRMSTransaction/GetAttendance', params, 'YES');
       return this.callGetAPI('/HRMS/GetAttendance', params, 'YES');
    }
    catch (errormssg) {
      this.showErrorMessage(errormssg);
    }
  }

    getBiometricAttendance(branchschema,fromdate,todate){
    debugger
    try {
      const params = new HttpParams().set('branchschema',branchschema).set('fromdate',fromdate).set('todate',todate);
      // return this.callGetAPI('/Transactions/HRMSTransaction/GetBiometricAttendance', params, 'YES');
        return this.callGetAPI('/HRMS/GetBiometricAttendance', params, 'YES');

    }
    catch (errormssg) {
      this.showErrorMessage(errormssg);
    }
  }


   SendMailGridData(gridData: any){
     try {
      return this.callPostAPI("/HRMS/ExportGridData", gridData);
    }
    catch (errormssg) {
      this.showErrorMessage(errormssg);
    }
  }

    SaveLeaveDetails(formdata) {
    debugger
    try {
      return this.callPostAPI("/HRMS/SaveBiometricattendance", formdata);
    }
    catch (errormssg) {
      this.showErrorMessage(errormssg);
    }
  }

   getleavetypes(){
    debugger
    try {
      return this.callGetAPI('/HRMS/GetLeaveTypes','', 'YES');
    }
    catch (errormssg) {
      this.showErrorMessage(errormssg);
    }
  }

   getcompanyaddress() {

    let Companyreportdetails = this._getCompanyDetails();
    //company address
    let address = '';
    if (Companyreportdetails != null) {
      if (Object.keys(Companyreportdetails.pAddress1).length > 0) {
        address = Companyreportdetails.pAddress1;
      }
      // if (Object.keys(Companyreportdetails.pAddress2).length > 0) {
      //   address = address + Companyreportdetails.pAddress2;
      // }
      address = address.replace(/,\s*$/, "");
      if (address != "") {
        address = address + ".";
      }
    }
    return address;
  }
   _getCompanyDetails() {

    return JSON.parse(sessionStorage.getItem("companydetails"));
  }

    public exportAsExcelFile(json: any[], excelFileName: string): void {

    const myworksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);

    const myworkbook: XLSX.WorkBook = { Sheets: { 'data': myworksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(myworkbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);


  }

   private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_Excel' + EXCEL_EXTENSION);
  }


  getBiometricAttendanceReportData(branchschema,fromdate,todate,leavetype){
    debugger
    try {
      const params = new HttpParams().set('branchschema',branchschema).set('fromdate',fromdate).set('todate',todate).set('leavetype',leavetype);
      return this.callGetAPI('/HRMS/GetBiometricAttendanceReportdata', params, 'YES');
    }
    catch (errormssg) {
      this.showErrorMessage(errormssg);
    }
  }
//3

    getEmployeeDetails(searchtype, BranchId): Observable<any> {
    debugger;
    const params = new HttpParams().set('searchtype', searchtype).set('Branchschema', this.getschemaname()).set('BranchId', BranchId);

    return  this.callGetAPI('/HRMS/GetEmployeeDetails', params, 'YES');

  }


  getBiometricAttendancesumarryReportData(branchschema,empcode,fromdate,todate,leavetype){
    debugger
    try {
      const params = new HttpParams().set('Branchschema',branchschema).set('searchtype',empcode).set('fromdate',fromdate).set('todate',todate).set('leavetype',leavetype);
      return  this.callGetAPI('/HRMS/GetEmployeeAttdencesumaryDetails', params, 'YES');
    }
    catch (errormssg) {
      this.showErrorMessage(errormssg);
    }
  }
  getBiometricAttendanceReportSqlData(branchschema,fromdate,todate){
    debugger;
    try {
      const params = new HttpParams().set('Branchschema',branchschema).set('fromdate',fromdate).set('todate',todate);
      return  this.callGetAPI('/HRMS/GetAttendancebySqlServer', params, 'YES');
    }
    catch (errormssg) {
      this.showErrorMessage(errormssg);
    }
  }

  fileUploadS3(formName, data) {
    let urldata = environment.apiURL;

    let brancSelectionData = JSON.parse(sessionStorage.getItem("SetBranch"));

    let httpHeaders: any;

    if (brancSelectionData != null) {
      httpHeaders = new HttpHeaders({
        'Cache-Control': 'no-cache',
        'X-Database-Name': brancSelectionData.pbranch_name
      });
    } else {
      httpHeaders = new HttpHeaders({
        'Cache-Control': 'no-cache'
      });
    }

    const options = {
      headers: httpHeaders
    };

    return this.http.get(urldata).pipe(
      mergeMap(json =>
        this.http.post(
          json[0]['ApiHostUrl'] + `/uploadFile/${formName}`,data,options)
          .map(this.extractData)
          .catch(this.handleError)
      )
    );
  }

  DownloadS3files(formName, fileName) {
  let urldata = environment.apiURL;

  let brancSelectionData = JSON.parse(sessionStorage.getItem("SetBranch"));

  let httpHeaders: any;

  if (brancSelectionData != null) {
    httpHeaders = new HttpHeaders({
      'Cache-Control': 'no-cache',
      'X-Database-Name': brancSelectionData.pbranch_name
    });
  } else {
    httpHeaders = new HttpHeaders({
      'Cache-Control': 'no-cache'
    });
  }

  const options = {
    headers: httpHeaders
  };

  return this.http.get(urldata).pipe(
    mergeMap(json => this.http.get(json[0]['ApiHostUrl'] + `/DownloadImage/${formName}/${fileName}`, { ...options, responseType: "blob" }).catch(this.handleError)));
}

DownloadS3filesI(formName, fileName) {
  let urldata = environment.apiURL;

  let brancSelectionData = JSON.parse(sessionStorage.getItem("SetBranch"));

  let httpHeaders: any;

  if (brancSelectionData != null) {
    httpHeaders = new HttpHeaders({
      'Cache-Control': 'no-cache',
      'X-Database-Name': brancSelectionData.pbranch_name
    });
  } else {
    httpHeaders = new HttpHeaders({
      'Cache-Control': 'no-cache'
    });
  }

  const options = {
    headers: httpHeaders
  };

  return this.http.get(urldata).pipe(
    mergeMap(json => this.http.get(json[0]['ApiHostUrl'] + `/DownloadImage/${formName}/${fileName}`, options).map(this.extractData).catch(this.handleError)));
}

getloginbranchanme(): string {
  const companyDetailsRaw = sessionStorage.getItem('CompanyDetails');
  if (!companyDetailsRaw) {
    return '';
  }
  const companyDetails = JSON.parse(companyDetailsRaw);
  return (companyDetails && companyDetails.branchName) ? companyDetails.branchName : '';
}

getbranchname(): string {
  return sessionStorage.getItem('loginBranchName') || 'accounts';
}

getCompanyCode(): string {
  return sessionStorage.getItem('companyCode') || '';
}

getBranchCode(): string {
  return sessionStorage.getItem('branchCode') || '';
}

}

