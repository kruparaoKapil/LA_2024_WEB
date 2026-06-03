import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { ReportService } from 'src/app/Services/Accounting/report.service';
import { debug } from 'util';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { State, process} from '@progress/kendo-data-query';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';

@Component({
  selector: 'app-cheque-enquiry',
  templateUrl: './cheque-enquiry.component.html',
  styles: []
})
export class ChequeEnquiryComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  ChequeEnquiryForm: FormGroup;
  public submitted = false;
  gridData: any = [];
  public ChqNo: any;
  public RadioStatus: any;
  public paymentId: any;
  public dipositdatehide = true;
  public paymentDate: any;
  public paidTo: any;
  public hndepositbankname=true;
  constructor(private _routes: Router, private formbuilder: FormBuilder, private _reportservice: ReportService, private _CommonService: CommonService) {
    this.allData = this.allData.bind(this);
   }

  ngOnInit() {
    //this.submitted = false;
    this.ChequeEnquiryForm = this.formbuilder.group({
      pChequeNo: ['', Validators.required],
      ChkrbtType: ['', Validators.required]
    })
    this.ChequeEnquiryForm.controls.ChkrbtType.setValue('1');
    this.Isseleted();
    this.paymentId = "Payment Id";
  }
  get f() { return this.ChequeEnquiryForm.controls; }

  Isseleted() {
    debugger;
    let rdbType = this.ChequeEnquiryForm.controls.ChkrbtType.value;
    if (rdbType == "1") {
      debugger;
      this.RadioStatus = "Cheque Issued";
      this.paymentId = "Payment Id";
      this.dipositdatehide = true;
      this.hndepositbankname = true;
      this.paymentDate = "Payment Date";
      this.paidTo = "Paid To";
      this.ChequeEnquiryForm.controls.pChequeNo.setValue(null);
      this.gridData = [];
    }
    else {
      this.RadioStatus = "Cheque Received";
      this.paymentId = "Receipt Id";
      this.dipositdatehide = false;
      this.hndepositbankname = false;
      this.paymentDate = "Receipt Date";
      this.paidTo = "Received From";
      this.ChequeEnquiryForm.controls.pChequeNo.setValue(null);
      this.gridData = [];
    }
  }
  GetChequeEnquiryDetails() {
    debugger;
    this.submitted = true;
    this.ChqNo = this.ChequeEnquiryForm.controls.pChequeNo.value;
    if (this.ChequeEnquiryForm.valid) {
      if (this.RadioStatus == "Cheque Issued") {
        this._reportservice.GetIssuedChequesDetails(this.ChqNo).subscribe(res => {
          debugger;
          this.gridData = res;

        })
      }
      else if (this.RadioStatus == "Cheque Received") {
        this._reportservice.GetReceivedChequesDetails(this.ChqNo).subscribe(res => {
          debugger;
          this.gridData = res;

        })
      }
      //this.ChequeEnquiryForm.controls.pChequeNo.setValue('');
    }
    
  }

  public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.gridData,{}).data,
    };
      return result;
   }

}
