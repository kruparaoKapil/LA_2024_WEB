import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/Services/common.service';
import { CompanyDetailsService } from 'src/app/Services/Common/company-details.service';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styles: []
})
export class CompanyDetailsComponent implements OnInit {

  public comapnydata: any;
  public pCompanyName: any;
  todaydate:any;
  public pAddress1: any;
  public pAddress2: any;
  public pcity: any;
  public pCountry: any;
  public pState: any;
  public pDistrict: any;
  public pPincode: any;
  public pCinNo: any;
  public pGstinNo: any;
  public pBranchname: any
  public croppedImage:any
  constructor(private _CommonService: CommonService, private _companydetails: CompanyDetailsService) { }

    ngOnInit() {
        debugger
    this.getComapnyName();
     
    this.todaydate=new Date()
  }


    public getComapnyName() {
      debugger;
        this.comapnydata = this._CommonService.comapnydetails;;
        this.pCompanyName = this.comapnydata['pCompanyName'];
        this.pAddress1 = this.comapnydata['pAddress1'];
        this.pAddress2 = this.comapnydata['pAddress2'];
        this.pcity = this.comapnydata['pcity'];
        this.pCountry = this.comapnydata['pCountry'];
        this.pState = this.comapnydata['pState'];
        this.pDistrict = this.comapnydata['pDistrict'];
        this.pPincode = this.comapnydata['pPincode'];
        this.pCinNo = this.comapnydata['pCinNo'];
        this.pGstinNo = this.comapnydata['pGstinNo'];
        this.pBranchname = this.comapnydata['pBranchname'];
        this.croppedImage= "data:image/png;base64," +this.comapnydata['pPhoto'];
    //this._companydetails.GetCompanyData().subscribe(res => {
    //  
    //  this.comapnydata = res;
    //  this.pCompanyName = this.comapnydata['pCompanyName'];
    //  this.pAddress1 = this.comapnydata['pAddress1'];
    //  this.pAddress2 = this.comapnydata['pAddress2'];
    //  this.pcity = this.comapnydata['pcity'];
    //  this.pCountry = this.comapnydata['pCountry'];
    //  this.pState = this.comapnydata['pState'];
    //  this.pDistrict = this.comapnydata['pDistrict'];
    //  this.pPincode = this.comapnydata['pPincode'];
    //  this.pCinNo = this.comapnydata['pCinNo'];
    //  this.pGstinNo = this.comapnydata['pGstinNo'];
    //  this.pBranchname = this.comapnydata['pBranchname'];
    //});
  }
  public showErrorMessage(errormsg: string) {
    this._CommonService.showErrorMessage(errormsg);
  }

  public showInfoMessage(errormsg: string) {
    this._CommonService.showInfoMessage(errormsg);
  }

}
