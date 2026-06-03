import { Component, OnInit } from '@angular/core';
import { DeliveryorderService } from '../../../../Services/Loans/Transactions/deliveryorder.service';
import { CommonService } from '../../../../Services/common.service';
import { State, process } from '@progress/kendo-data-query';
import { formatDate, DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { from } from 'rxjs';

@Component({
  selector: 'app-deliveryorder-new',
  templateUrl: './deliveryorder-new.component.html',
  styles: []
})
export class DeliveryorderNewComponent implements OnInit {

  constructor(private datepipe: DatePipe, private _DeliveryorderService: DeliveryorderService, private _CommonService: CommonService, private toastr: ToastrService) {

    this.allData = this.allData.bind(this);
  }
  date: any;
  today: any;
  Letter: any;
  loading = false;
  loadingletter = false;
  Savebbutton = false;
  Letterstatus: any;
  deliveryorderdata: any;
  deliveryordercountdata: any;
  DeliveryorderdataByid: any;
  notsend: any;
  send: any;
  deliveryordertempdata: any;


  applicantname: any;
  vehiclemodel: any;
  titlename: any;
  fathername: any;
  address1: any;
  address2: any;
  district: any;
  state: any;
  pincode: any;
  onroadprice: any;
  downpayment: any;
  Requestedamount: any;
  engineno: any;
  chasisno: any;
  yearofmake: any;
  companydata: any;
  companyname: any;
  relationship: any;
  completeAddress: any;




  public pageSize = 10;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10
  };
  public headerCells: any = {
    textAlign: 'center'
  };
  ngOnInit() {
    this.Letter = '';
    this.Letterstatus = 'n';
    this.Savebbutton = true;
    this.GetDeliveryorder(this.Letterstatus);
    this.companydata = this._CommonService.comapnydetails;
    this.companyname = this.companydata['pCompanyName'];
  }
  GetDeliveryorder(letterstatus) {
    this.loading = true;
    this._DeliveryorderService.GetDeliveryorderBystatus(letterstatus).subscribe(data => {
      if (data != null) {
        this.deliveryorderdata = data;

        this.deliveryorderdata.filter(function (df) { df.pIsprimaryAccount = false; });
        this.deliveryordertempdata = this.deliveryorderdata;

      }
      this.loading = false;
    });
    this.GetDeliveryordercount();

  }
  GetDeliveryordercount() {

    this._DeliveryorderService.GetDeliveryorderAllcount().subscribe(data => {
      this.deliveryordercountdata = data;

      if (this.deliveryordercountdata[0]['pStatus'] == 'NOT SENT') {
        this.notsend = this.deliveryordercountdata[0]['pCount'];
        this.send = this.deliveryordercountdata[1]['pCount'];
      }
      else {
        this.notsend = this.deliveryordercountdata[1]['pCount'];
        this.send = this.deliveryordercountdata[0]['pCount'];
      }

    });
  }

  Clicknotsend() {
    this.deliveryorderdata = '';
    this.deliveryordertempdata = '';
    this.Letter = '';
    this.Savebbutton = true;
    this.GetDeliveryorder('n');
  }
  Clicksend() {
    this.deliveryorderdata = '';
    this.deliveryordertempdata = '';
    this.Letter = '';
    this.Savebbutton = false;
    this.GetDeliveryorder('y');
  }
  selectdeliveryorder(dataItem, row) {
    debugger
    let i = -1;
    this.deliveryorderdata.filter(function (df) {
      i++;
      if (row == i) {
        df.pIsprimaryAccount = true;
      }
      else {
        df.pIsprimaryAccount = false;
      }
    });
    let applicationid = dataItem['pVchapplicationID'];
    this.GetDeliveryorderdetails(applicationid);
    this.Letter = 'show';

  }
  GetDeliveryorderdetails(applicationid) {
    this.loadingletter = true;
    this.date = new Date();
    this.today = this.datepipe.transform(this.date, 'dd-MMM-yyyy');

    this._DeliveryorderService.DeliveryorderdetailsByID(applicationid).subscribe(data => {
      this.DeliveryorderdataByid = data;
      this.applicantname = this.DeliveryorderdataByid['pApplicantname'];
      this.vehiclemodel = this.DeliveryorderdataByid['pVehiclemodel'];
      this.titlename = this.DeliveryorderdataByid['pTitlename'];
      this.fathername = this.DeliveryorderdataByid['pfathername'];
      debugger

      this.address1 = this.DeliveryorderdataByid['paddress1'];
      this.address2 = this.DeliveryorderdataByid['paddress2'];
      this.district = this.DeliveryorderdataByid['pdistrict'];
      this.state = this.DeliveryorderdataByid['pstate'];
      this.pincode = this.DeliveryorderdataByid['ppincode'];


      let test = this.DeliveryorderdataByid['paddress1'] +' '+ this.DeliveryorderdataByid['paddress2'] === '' ? 'test' : ',';

      this.completeAddress = (this.DeliveryorderdataByid['paddress1'] === '' ? '     ' : this.DeliveryorderdataByid['paddress1'] + ',') + '          ' + (this.DeliveryorderdataByid['paddress2'] === '' ? '     ' : this.DeliveryorderdataByid['paddress2'] + ',') + '          ' + (this.DeliveryorderdataByid['pstate'] === '' ? '     ' : this.DeliveryorderdataByid['pstate'] + ',') + '          ' + (this.DeliveryorderdataByid['pdistrict'] === '' ? '     ' : this.DeliveryorderdataByid['pdistrict'] + ',') + '          ' + (this.DeliveryorderdataByid['ppincode'] === '' ? '     ' : this.DeliveryorderdataByid['ppincode'] + ',');



      //this.completeAddress = this.DeliveryorderdataByid['paddress1'] + (this.DeliveryorderdataByid['paddress1'] === '' ? '' : ',') + this.DeliveryorderdataByid['paddress2'] + (this.DeliveryorderdataByid['paddress2'] === '' ? '' : ',') + this.DeliveryorderdataByid['pdistrict'] + this.DeliveryorderdataByid['pstate'] === '' ? '' : ',' + this.DeliveryorderdataByid['pstate'] + this.DeliveryorderdataByid['pdistrict'] === '' ? '' : ',' + this.DeliveryorderdataByid['pstate'] === '' ? '' : ',' + this.DeliveryorderdataByid['ppincode'] + this.DeliveryorderdataByid['ppincode'] ? '' : ',';

    
      this.downpayment = this.DeliveryorderdataByid['pDownpayment'].toFixed(2);
      this.Requestedamount = this.DeliveryorderdataByid['pRequestedamount'].toFixed(2);
      this.engineno = this.DeliveryorderdataByid['pengineno'];
      this.chasisno = this.DeliveryorderdataByid['pchasisno'];
      this.yearofmake = this.DeliveryorderdataByid['pyearofmake'];
      this.onroadprice = this.DeliveryorderdataByid['pOnroadprice'].toFixed(2);
      this.relationship = this.DeliveryorderdataByid['pContacttype'].toUpperCase() == 'INDIVIDUAL' ? 'S/o,D/o' : '';
    });
    this.loadingletter = false;
  }

  save() {

    this.DeliveryorderdataByid['pCreatedby'] = this._CommonService.pCreatedby;
    this._DeliveryorderService.SaveDeliveryorderdata(this.DeliveryorderdataByid).subscribe(res => {
      this.deliveryorderdata = "";
      this.GetDeliveryorder(this.Letterstatus);
      this.Letter = '';
      this.Savebbutton = false;
      this.toastr.success("successfully Save", "Success");
    });
  }
  print() {
    let printContents, popupWin;
    printContents = document.getElementById('temp-box').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
          <html>
            <head>
              <title>Delivery Order</title>
              <link rel="stylesheet" type="text/css" href="assets/css/bootstrap.min.css"/>
              <link rel="stylesheet" type="text/css" href="assets/css/custom.css" />
             
              <style>
              //........Customized style.......
              </style>
            </head>
        <body onload="window.print();window.close()">${printContents}</body>
          </html>`
    );
    popupWin.document.close();


  }

  onFilter(inputValue: string) {

    this.deliveryorderdata = process(this.deliveryordertempdata, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'pVchapplicationID',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pApplicantname',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pApprovedloanamount',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pApplicantMobileNo',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pApplicantEmail',
            operator: 'contains',
            value: inputValue
          }
        ],
      }
    }).data;
    // this.dataBinding.skip = 0;
  }
  public allData(): ExcelExportData {

    const result: ExcelExportData = {
      data: process(this.deliveryorderdata, { sort: [{ field: 'pVchapplicationid', dir: 'desc' }] }).data
    };

    return result;
  }
}
