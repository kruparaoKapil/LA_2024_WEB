import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { State, GroupDescriptor, DataResult, process } from '@progress/kendo-data-query';
import { SelectableSettings } from '@progress/kendo-angular-grid';
import { ReportService } from 'src/app/Services/Accounting/report.service';
import { CommonService } from 'src/app/Services/common.service';
import { DatePipe } from '@angular/common';
import { AccountingMastresService } from 'src/app/Services/Accounting/accounting-mastres.service';
@Component({
  selector: 'app-gst-voucher',
  templateUrl: './gst-voucher.component.html',
  styles: []
})
export class GstVoucherComponent implements OnInit {
 GSTVoucherForm: FormGroup;
  public disablesavebutton = false;
  public savebutton = "Save";
  public dpConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public paymentslist: any = [];
  public gridData: any = [];
  public addGridData: any = [];
  public ledgeraccountslist: any = [];
  public partyDetailslist: any = [];
  public addressDetailslist: any = [];

  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10
  };
  totalAmount: number;
  productValue: number;
  imageResponse: any;
  kycFileName: any;
  kycFilePath: any;
  regFileName: any;
  regFilePath: any;
  invoiceGstCalculation: any;
  invoiceAmount: any;
  totalAmountInvoice: any = 0;
  addressParty: any;
  pstate: any;
  ppanno: any;
  padharno: any;
  pgstno: any;
  partyId: any;
  pstateidCustomer: number;
  sgst_amount: any;
  cgst_amount: any;
  igst_amount: any;
  formValidationMessages: any;
  discountCalculation: any = 0;
  productValueCalculation: any;
  stateIdCOmpany: any;
  stateName: any;
  gstHidden: boolean = true;
  pcontactmailingname: any;
  decimalAmount: number;
  totalAmountFor: any = 0;
  discountOnInvoice: any = 0;
  productNameList: any = [];
  showTDS: boolean = false;
  tdssectionlist: any = [];
  tdsPerentage: any = [];
  tdsAmount: any = 0;
  gstPercentageList: any = [{ gstPercentage: 3 }, { gstPercentage: 5 }, { gstPercentage: 12 }, { gstPercentage: 18 }, { gstPercentage: 28 }];
  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private _ReportService: ReportService, private _CommonService: CommonService, private datePipe: DatePipe, private accountMasterService: AccountingMastresService) {
    this.dpConfig1.containerClass = 'theme-dark-blue';
    this.dpConfig1.dateInputFormat = 'DD/MM/YYYY';
    this.dpConfig1.maxDate = new Date();
    this.dpConfig1.showWeekNumbers = false;
  }

  ngOnInit() {
    debugger
    this.GSTVoucherForm = this.fb.group({
      gstvoucher_date: [new Date()],
      debitparentid: ['', Validators.required],
      invoiceno: ['', Validators.required],
      invoicedate: [new Date()],
      ppartyname: ['', Validators.required],
      gst_Number: [''],
      pStateId: ['', Validators.required],
      paddress: [''],
      ppanno: [''],
      paadharno: [''],
      product_name: ['', Validators.required],
      hsN_code: ['', Validators.required],
      product_qty: [0, Validators.required],
      product_cost: [0, Validators.required],
      product_discount: [0],
      product_value: [0, Validators.required],
      gsT_percentage: ['', Validators.required],
      cgst_percentage: [''],
      igst_percentage: [''],
      gst_amount: ['', Validators.required],
      cgst_amount: [''],
      sgst_amount: [''],
      igst_amount: [''],
      invoice_amount: [''],
      totalGstAmount: [''],
      invoice_total_amount: [''],
      discount_amount: [''],
      pfileName: [''],
      pNarration: [''],
      tdsSectionName: [''],
      tdsSectionID: [''],
      tdsPercentage: [0],
      tdsAmount: [0],
      isTdsapplicable: [false]


    });

    this.getLoadData();
    this.GetPartyDetails();
    this.formValidationMessages = {};
    this.BlurEventAllControll(this.GSTVoucherForm);

    let data = JSON.parse(sessionStorage.getItem("companydetails"));
    console.log(data);
    // this.stateIdCOmpany = Number(data.pstatecode);
    this.stateIdCOmpany = Number(data.pstatecode);
    this.stateName = data.pState;

    // let data = JSON.parse(localStorage.getItem("SetBranch"));
    // this.stateIdCOmpany = Number(data.pstateid);
    // this.stateName = data.pstate;

    this.getProductName();
    this.getTDSsectiondetails();
  }


  public getLoadData() {
    debugger
    this._ReportService.GetAccountledger().subscribe(json => {

      let JSONDATA = json
      if (json != null) {
        this.ledgeraccountslist = json;
      }
    },
      (error) => {
        this._CommonService.showErrorMessage(error);
      });
  }
  getProductName() {
    debugger;
    this.accountMasterService.getProductNames().subscribe(productNames => {
      this.productNameList = productNames;
    })
  }
  sectionNameChange(event) {
    debugger;
    this.GSTVoucherForm.controls.tdsPercentage.setValue('');
    this.GSTVoucherForm.controls.tdsSectionID.setValue(event.precordid);
    this.totalAmountInvoice = this.addGridData.reduce((sum, item) => sum + Number(item.invoice_amount) + Number(item.gst_amount), 0).toFixed(2);
    this.totalAmountFor = this.totalAmountInvoice;
    this.tdsAmount = 0;
    this.accountMasterService.getTdsectionsbyid(event.pSection).subscribe(json => {
      this.tdsPerentage = json;
    })
  }
   percentageChange(event) {
    debugger;
    // this.tdsshowForm.controls.percentage.setValue('');
    this.totalAmountInvoice = this.addGridData.reduce((sum, item) => sum + Number(item.invoice_amount) + Number(item.gst_amount), 0).toFixed(2);
    this.totalAmountFor = this.totalAmountInvoice;
    this.tdsAmount = 0;
    let totalGrossAmount = this._CommonService.removeCommasForEntredNumber(this.invoiceAmount);
    let percentage = this.GSTVoucherForm.controls.tdsPercentage.value / 100;
    let afterTDSAmount = totalGrossAmount * percentage;
    this.tdsAmount = afterTDSAmount;
    let totalAmountInvoice = this._CommonService.removeCommasForEntredNumber(this.totalAmountInvoice);
    let totalAmountFor = this._CommonService.removeCommasForEntredNumber(this.totalAmountFor);
    // this.totalAmountInvoice = this._CommonService.currencyformat(totalAmountInvoice - afterTDSAmount);
    this.totalAmountFor = this._CommonService.currencyformat(totalAmountFor - afterTDSAmount);


  }
   checkInvoiceNo(){
    debugger;
    let invNo = this.GSTVoucherForm.controls.invoiceno.value;
    this.accountMasterService.getInvoiceCount(invNo).subscribe(cnt => {
      let count = cnt['count'];
      if(count > 0){
        this._CommonService.showWarningMessage('Invoice No. already exists');
        this.GSTVoucherForm.controls.invoiceno.setValue('');
        return
      }
    })
  }

  getTDSsectiondetails(): void {
    this.accountMasterService.GetTdssectiondetails().subscribe(
      (json) => {
        if (json != null) {
          console.log("TDS", json)
          this.tdssectionlist = json;
        }
      },
      (error) => {
        this._CommonService.showErrorMessage(error);
      }
    );
  }
  changeProductNames(event) {
    debugger;
    this.GSTVoucherForm.controls.hsN_code.setValue('');
    this.formValidationMessages.hsN_code = '';
    this.accountMasterService.getHSNCodeByProductNames(event.pProductName).subscribe(hsnCode => {
      this.GSTVoucherForm.controls.hsN_code.setValue(hsnCode[0].pHSNCode);
         this.GSTVoucherForm.controls.gsT_percentage.setValue(hsnCode[0].pGstPercentage);
    })
  }

  accountheadChange(event) {
    debugger
  }

  public GetPartyDetails() {
    debugger
    this._ReportService.GetPartyDetails().subscribe(json => {

      if (json != null) {
        this.partyDetailslist = json;
      }
    },
      (error) => {
        this._CommonService.showErrorMessage(error);
      });
  }

  changePartyName(event) {
    debugger;
    this.pcontactmailingname = event.pcontactmailingname;
    this.partyId = event.pcontactid;

    this.GetAddressDocdetails(event.pcontactid);

  }

  GetAddressDocdetails(contactid) {
    debugger;
    //   this.stateIdCOmpany 
    //  this.stateName 
    this._ReportService.GetAddressDocdetails(contactid).subscribe(data => {

      if (data != null) {
        this.my(data);

      }
    },
      (error) => {
        this._CommonService.showErrorMessage(error);
      });
  }


  my(data) {
    this.clearGridData();
    this.addressDetailslist = data;
    this.addressParty = data[0].paddress;
    this.pstate = data[0].pstate;
    this.ppanno = data[0].ppanno;
    this.padharno = data[0].padharno;
    this.pgstno = data[0].pgstno;
    this.pstateidCustomer = data[0].pstateid;
    this.GSTVoucherForm.controls.paddress.setValue(this.addressParty);
    this.GSTVoucherForm.controls.ppanno.setValue(this.ppanno);
    this.GSTVoucherForm.controls.paadharno.setValue(this.padharno);
    this.GSTVoucherForm.controls.gst_Number.setValue(this.pgstno);
    this.GSTVoucherForm.controls.pStateId.setValue(this.pstate);

    if (this.pstateidCustomer == this.stateIdCOmpany) {
      this.gstHidden = true;
    }
    else {
      this.gstHidden = false;
    }



  }


  productCalculation() {
    debugger;
    this.productValueCalculation = Number(this.GSTVoucherForm.controls.product_qty.value) * this._CommonService.removeCommasForEntredNumber(this.GSTVoucherForm.controls.product_cost.value) - this._CommonService.removeCommasForEntredNumber(this.GSTVoucherForm.controls.product_discount.value);

    this.productValue = this.productValueCalculation
    this.GSTVoucherForm.controls.product_value.setValue(this._CommonService.currencyformat(this.productValue));
    this.gstCalculation();
  }
   changeGSTPercentage(event) {
    this.gstCalculation();
  }

  gstCalculation() {
    debugger;
    let gstPercentage = this.GSTVoucherForm.controls.gsT_percentage.value / 100;
    let productCost = this.productValueCalculation;
    let gstAmount = productCost * gstPercentage;
    this.GSTVoucherForm.controls.gst_amount.setValue(Math.round(gstAmount));

    if (this.pstateidCustomer != this.stateIdCOmpany) {
      this.GSTVoucherForm.controls.igst_amount.setValue(Math.round(gstAmount));
      this.GSTVoucherForm.controls.igst_percentage.setValue(this.GSTVoucherForm.controls.gsT_percentage.value);
    }
    else {
      this.GSTVoucherForm.controls.igst_amount.setValue(0);
      this.GSTVoucherForm.controls.igst_percentage.setValue(0);
    }


    let cgst = gstAmount / 2;
    if (this.pstateidCustomer == this.stateIdCOmpany) {
      this.GSTVoucherForm.controls.cgst_amount.setValue(Math.round(cgst));
      this.GSTVoucherForm.controls.sgst_amount.setValue(Math.round(cgst));
      let cgstPer = Number(this.GSTVoucherForm.controls.gsT_percentage.value / 2);
      this.GSTVoucherForm.controls.cgst_percentage.setValue(cgstPer);
    }
    else {
      this.GSTVoucherForm.controls.cgst_amount.setValue(0);
      this.GSTVoucherForm.controls.sgst_amount.setValue(0);
      this.GSTVoucherForm.controls.cgst_percentage.setValue(0);
    }

  }

  addToGrid() {
    debugger;
    // if (this.gridData.length > 0) {
    //   return;
    // }
    this.gridData = [];
    this.addGridData = [];
    let isvalid = true;
    if (this.checkValidations(this.GSTVoucherForm, isvalid)) {
      let totalGridAmount = this.productValueCalculation;
      this.totalAmount = totalGridAmount;
      let invoice_date = this.datePipe.transform(this.GSTVoucherForm.controls.invoicedate.value, 'yyyy/MM/dd');
      let data = {

        "invoice_amount": this.totalAmount,
        "invoice_gstamount": Number(this.GSTVoucherForm.controls.gst_amount.value),
        "invoice_tdsamount": 0,
        "ppartyname": this.pcontactmailingname,
        "Vendor_id": this.GSTVoucherForm.controls.ppartyname.value,
        "Vendorstate": this.pstate,
        "ppanno": this.GSTVoucherForm.controls.ppanno.value,
        "Gst_Number": this.GSTVoucherForm.controls.gst_Number.value,
        "paddress": this.GSTVoucherForm.controls.paddress.value,


        "vendor_id": this.partyId,
        "vendorname": this.pcontactmailingname,
        "pStateId": this.pstateidCustomer,
        "paadharno": this.GSTVoucherForm.controls.paadharno.value,
        "product_name": this.GSTVoucherForm.controls.product_name.value,
        "hsN_code": Number(this.GSTVoucherForm.controls.hsN_code.value),
        "phsnvalue": this.GSTVoucherForm.controls.hsN_code.value,
        "product_qty": Number(this.GSTVoucherForm.controls.product_qty.value),
        "product_cost": this._CommonService.removeCommasForEntredNumber(this.GSTVoucherForm.controls.product_cost.value),
        "product_discount": Number(this.GSTVoucherForm.controls.product_discount.value),
        "product_value": this._CommonService.removeCommasForEntredNumber(this.GSTVoucherForm.controls.product_value.value),
        "gsT_percentage": Number(this.GSTVoucherForm.controls.gsT_percentage.value),
        "cgst_percentage": Number(this.GSTVoucherForm.controls.cgst_percentage.value),
        "sgst_percentage": Number(this.GSTVoucherForm.controls.cgst_percentage.value),
        "igst_percentage": Number(this.GSTVoucherForm.controls.igst_percentage.value),
        "gst_amount": Number(this.GSTVoucherForm.controls.gst_amount.value),
        "tdS_amount": Number(this.GSTVoucherForm.controls.gst_amount.value),
        "cgst_amount": Number(this.GSTVoucherForm.controls.cgst_amount.value),
        "sgst_amount": Number(this.GSTVoucherForm.controls.sgst_amount.value),
        "igst_amount": Number(this.GSTVoucherForm.controls.igst_amount.value),
        "invoice_No": this.GSTVoucherForm.controls.invoiceno.value,
        "invoice_date": invoice_date,
        "discount_amount": Number(this.GSTVoucherForm.controls.product_discount.value),
        "invoice_total_amount": this.totalAmount + Number(this.GSTVoucherForm.controls.gst_amount.value)
      }
      this.addGridData.push(data);
      this.gridData = [...this.addGridData]
      this.invoiceCalculation();
      this.clearGridData();
      this.formValidationMessages = {};
      //this.GSTVoucherForm.reset();
    }
  }

  invoiceCalculation() {
    debugger;
    let invoiceGstCalculation = this.addGridData.reduce((sum, item) => sum + Number(item.gst_amount), 0).toFixed(2);
    //console.log(this.invoiceGstCalculation);
    this.invoiceGstCalculation = this._CommonService.currencyformat(invoiceGstCalculation)

    let invoiceAmount = this.addGridData.reduce((sum, item) => sum + Number(item.invoice_amount), 0).toFixed(2);
    //console.log(this.invoiceAmount);

    this.invoiceAmount = this._CommonService.currencyformat(invoiceAmount)

    let totalAmountInvoice = this.addGridData.reduce((sum, item) => sum + Number(item.invoice_amount) + Number(item.gst_amount), 0).toFixed(2);
    let roundOffAMount = Math.round(totalAmountInvoice);

    let av = totalAmountInvoice - roundOffAMount

    let decimalValue = Math.round(av * 100)
    if (decimalValue >= 50) {
      this.decimalAmount = Math.round((totalAmountInvoice - roundOffAMount) * 100);
    }
    else {
      this.decimalAmount = Math.round((roundOffAMount - totalAmountInvoice) * 100)
        ;
    }

    //console.log(this.invoiceAmount);
    this.totalAmountFor = Math.round(totalAmountInvoice);
    let discountCalculation = this.addGridData.reduce((sum, item) => sum + Number(item.product_discount), 0);
    this.totalAmountInvoice = this._CommonService.currencyformat(totalAmountInvoice);
    this.discountCalculation = this._CommonService.currencyformat(discountCalculation);
    this.sgst_amount = this.addGridData.reduce((sum, item) => sum + Number(item.sgst_amount), 0).toFixed(2);
    this.cgst_amount = this.addGridData.reduce((sum, item) => sum + Number(item.cgst_amount), 0).toFixed(2);
    this.igst_amount = this.addGridData.reduce((sum, item) => sum + Number(item.igst_amount), 0).toFixed(2);

  }


  saveGstVoucher() {
    debugger;
    if (this.gridData.length == 0) {
      this._CommonService.showWarningMessage('No Data To Save');
    }

    if (this.gridData.length == 0) {
      if (confirm("No Data To Save ?")) {

      }

    }
    this.isLoading = true;

    let finalData = this.gridData.map(obj => {
      obj.tds_percentage = +this.GSTVoucherForm.controls.tdsPercentage.value;
      obj.ptypeofoperation = 'CREATE';
      obj.tds_sectionid = this.GSTVoucherForm.controls.tdsSectionID.value;
      obj.tdsSectionName = this.GSTVoucherForm.controls.tdsSectionName.value;
      return obj;
    });
    // "tds_percentage": this.GSTVoucherForm.controls.tdsPercentage.value,
    //     "tds_sectionid":this.GSTVoucherForm.controls.tdsSectionID.value,
    let gstvoucher_date = this.datePipe.transform(this.GSTVoucherForm.controls.gstvoucher_date.value, 'yyyy/MM/dd');
    let invoice_date = this.datePipe.transform(this.GSTVoucherForm.controls.invoicedate.value, 'yyyy/MM/dd');
    let invoiceAmount = this._CommonService.removeCommasForEntredNumber(this.invoiceAmount);
    let invoiceGstCalculation = this._CommonService.removeCommasForEntredNumber(this.invoiceGstCalculation);
    let igst_amount = this._CommonService.removeCommasForEntredNumber(this.igst_amount);
    let cgst_amount = this._CommonService.removeCommasForEntredNumber(this.cgst_amount);
    let sgst_amount = this._CommonService.removeCommasForEntredNumber(this.sgst_amount);
    let totalAmountInvoice = this._CommonService.removeCommasForEntredNumber(this.totalAmountInvoice);
    let discountCalculation = this._CommonService.removeCommasForEntredNumber(this.discountCalculation);

    let json = {
      "gstvoucher_date": gstvoucher_date,
      "pgstvtotalamount": totalAmountInvoice,
      "pgstvtotalgstamount": invoiceGstCalculation,
      "pgstvtotaltdsamount": discountCalculation,
      "amount": invoiceAmount,
      "gstamount": invoiceGstCalculation,
      "tdsamount": 0,
      "pCreatedby": 14,
      "pStatusname": '',
      "ptypeofoperation": 'CREATE',
      "lstgstvoucherdetails": finalData,
      "invoice_amount": invoiceAmount,
      "invoice_gstamount": invoiceGstCalculation,
      "invoice_tdsamount": this.tdsAmount,
      "Vendorid": this.partyId,
      "Vendorstate": this.pstate,
      "GSTno": this.GSTVoucherForm.controls.gst_Number.value,
      "invoiceno": this.GSTVoucherForm.controls.invoiceno.value,
      "invoicedate": invoice_date,
      "total_amount": totalAmountInvoice,
      "state_name": "",
      "discountamount": discountCalculation,
      "Vendorname": this.pcontactmailingname,
      "invoice_igstamount": igst_amount,
      "invoice_cgstamount": cgst_amount,
      "invoice_sgstamount": sgst_amount,
      "debitparentid": this.GSTVoucherForm.controls.debitparentid.value,
      "pfileName": this.regFilePath,
      "tdssection": this.GSTVoucherForm.controls.tdsSectionName.value,
    }

    console.log(json);
    let aaa = JSON.stringify(json)

    if (confirm("Do you want to save ?")) {
      this.accountMasterService.saveGstVoucher(aaa).subscribe(res => {
        console.log(res);
        window.open('/#/JournalvoucherReport?id=' + btoa(res[1] + ',' + 'Journal Voucher'));


        this._CommonService.showInfoMessage('Saved Successfully');
        this.ClearGstVoucher();
        this.isLoading = false;


      })
    }
    else{
      this.isLoading = false;
    }



  }

  clearGridData() {
    debugger;
    // this.GSTVoucherForm.controls.ppartyname.setValue('');
    // this.GSTVoucherForm.controls.gst_Number.setValue('');
    // this.GSTVoucherForm.controls.pStateId.setValue('');
    // this.GSTVoucherForm.controls.paddress.setValue('');
    // this.GSTVoucherForm.controls.ppanno.setValue('');
    // this.GSTVoucherForm.controls.paadharno.setValue('');
    this.GSTVoucherForm.controls.product_name.setValue('');
    this.GSTVoucherForm.controls.hsN_code.setValue('');
    this.GSTVoucherForm.controls.product_qty.setValue(0);
    this.GSTVoucherForm.controls.product_cost.setValue(0);
    this.GSTVoucherForm.controls.product_discount.setValue(0);
    this.GSTVoucherForm.controls.product_value.setValue(0);
    this.GSTVoucherForm.controls.gsT_percentage.setValue('');
    this.GSTVoucherForm.controls.gst_amount.setValue('');
    this.GSTVoucherForm.controls.cgst_amount.setValue('');
    this.GSTVoucherForm.controls.sgst_amount.setValue('');
    this.GSTVoucherForm.controls.igst_amount.setValue('');
    this.formValidationMessages.product_name = '';
    this.formValidationMessages.hsN_code = '';
    this.formValidationMessages.product_qty = '';
    this.formValidationMessages.product_cost = '';
    this.formValidationMessages.product_discount = '';
    this.formValidationMessages.gsT_percentage = '';
    this.formValidationMessages.gst_amount = '';
    this.formValidationMessages.product_value = '';
  }

  addPaymentDetails() {
    debugger
  }

  tdsApplicableChecked(event) {
    debugger;
    if (event.target.checked) {
      this.showTDS = true;
    } else {
      this.showTDS = false;
    }
  }

  ClearGstVoucher() {
   debugger;
    this.clearGridData();
    this.GSTVoucherForm.controls.ppartyname.setValue('');
    this.GSTVoucherForm.controls.gst_Number.setValue('');
    this.GSTVoucherForm.controls.pStateId.setValue('');
    this.GSTVoucherForm.controls.paddress.setValue('');
    this.GSTVoucherForm.controls.ppanno.setValue('');
    this.GSTVoucherForm.controls.paadharno.setValue('');
    this.GSTVoucherForm.controls.gstvoucher_date.setValue(new Date());
    this.GSTVoucherForm.controls.debitparentid.setValue('');
    this.GSTVoucherForm.controls.invoiceno.setValue('');
    this.GSTVoucherForm.controls.invoicedate.setValue(new Date());
    this.GSTVoucherForm.controls.pfileName.setValue('');
    this.GSTVoucherForm.controls.pNarration.setValue(''); 
    this.gridData = [];
    this.invoiceAmount = 0;
    this.invoiceGstCalculation = 0;
    this.totalAmountInvoice = 0;
    this.discountCalculation = 0;
    this.totalAmountFor = 0;
    this.tdsAmount = 0;
    this.showTDS = false;
    this.GSTVoucherForm.controls.tdsSectionName.setValue('');
    this.gstHidden = true;
    this.GSTVoucherForm.controls.isTdsapplicable.setValue(false);

    this.formValidationMessages.ppartyname = '';
    this.formValidationMessages.pStateId = '';
    this.formValidationMessages.debitparentid = '';
    this.formValidationMessages.invoiceno = '';
    this.formValidationMessages.gsT_percentage = '';
    this.formValidationMessages.gst_amount = '';
    this.formValidationMessages.product_value = '';

  }

  // validateFile(fileName) {
  //   debugger
  //   if (fileName == undefined || fileName == "") {
  //       return true
  //   }
  //   else {
  //       var ext = fileName.substring(fileName.lastIndexOf('.') + 1);
  //       if (ext.toLowerCase() == 'exe') {

  //           return false
  //       }
  //   }
  //   return true
  // }

  uploadAndProgress(event: any, files) {
    debugger;
    let file = event.target.files[0];

    if (event && file) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = e => {
        this.imageResponse = {
          name: file.name,
          fileType: "imageResponse",
          contentType: file.type,
          size: file.size,
        };
      };
    }
    //console.log('imageResponse', this.imageResponse)
    let fname = "";
    if (files.length === 0) {
      return;
    }
    var size = 0;
    const formData = new FormData();
    for (var i = 0; i < files.length; i++) {
      size += files[i].size;
      fname = files[i].name
      formData.append(files[i].name, files[i]);
      formData.append('saleagreement', this.GSTVoucherForm.value["saleAgreementForm"] + '.' + files[i]["name"].split('.').pop());
    }
    size = size / 1024;
    this._CommonService.fileUpload(formData).subscribe(data => {

      this.regFileName = data[1];
      if (this.imageResponse)
        this.imageResponse.name = data[1];
      this.regFilePath = data[0];
    })
  }

  gridDataDelete(dataItem, rowIndex) {
    debugger;
    this.addGridData.splice(rowIndex, 1);
    this.gridData = this.addGridData;

    this.clearGridData();
    this.invoiceCalculation();
    
  }


  BlurEventAllControll(fromgroup: FormGroup) {

    try {

      Object.keys(fromgroup.controls).forEach((key: string) => {
        this.setBlurEvent(fromgroup, key);
      })

    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
      return false;
    }
  }
  setBlurEvent(fromgroup: FormGroup, key: string) {

    try {
      let formcontrol;

      formcontrol = fromgroup.get(key);


      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {

          this.BlurEventAllControll(formcontrol)
        }
        else {
          if (formcontrol.validator)
            fromgroup.get(key).valueChanges.subscribe((data) => { this.GetValidationByControl(fromgroup, key, true) })
        }
      }

    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
      return false;
    }



  }

  checkValidations(group: FormGroup, isValid: boolean): boolean {

    try {

      Object.keys(group.controls).forEach((key: string) => {

        isValid = this.GetValidationByControl(group, key, isValid);
      })

    }
    catch (e) {
      //this.showErrorMessage(e);
      return false;
    }
    return isValid;
  }
  GetValidationByControl(formGroup: FormGroup, key: string, isValid: boolean): boolean {

    try {
      let formcontrol;

      formcontrol = formGroup.get(key);
      if (!formcontrol)
        formcontrol = <FormGroup>this.GSTVoucherForm['controls']['ppaymentsslistcontrols'].get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          if (key != 'ppaymentsslistcontrols')
            this.checkValidations(formcontrol, isValid)
        }
        else if (formcontrol.validator) {
          this.formValidationMessages[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;

            let errormessage;

            for (const errorkey in formcontrol.errors) {
              lablename = (document.getElementById(key) as HTMLInputElement).title;

              if (errorkey) {
                errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.formValidationMessages[key] += errormessage + ' ';
                isValid = false;
              }
            }

          }
        }
      }
    }
    catch (e) {
      //this._commonService.showErrorMessage(key);
      return false;
    }
    return isValid;
  }

}
