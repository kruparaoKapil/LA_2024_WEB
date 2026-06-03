import { Component, OnInit,ViewChild } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../../../Services/common.service';
import { debug } from 'util';
import { DatePipe, JsonPipe } from '@angular/common';
import { LienEntryService } from '../../../../Services/Banking/lien-entry.service';
import { Router } from '@angular/router';
import { AccountingTransactionsService } from '../../../../Services/Accounting/accounting-transactions.service';
import { FdTranscationDetailsComponent } from '../FD-AC-Creation/fd-transcation-details.component';
declare let $: any
@Component({
  selector: 'app-interestpayment-view',
  templateUrl: './interestpayment-view.component.html',
  styles: []
})
export class InterestpaymentViewComponent implements OnInit {
  @ViewChild(FdTranscationDetailsComponent, { static: true }) fdTranscationDetailsComponent: FdTranscationDetailsComponent;
    InterestPaymentForm: FormGroup;
    public Showmembers: any = []
    public InterestPaymentErrors:any=[]


    constructor(private FB: FormBuilder, private _LienEntryService: LienEntryService, private _CommonService: CommonService, private datepipe: DatePipe, private router: Router, private _AccountingTransactionsService: AccountingTransactionsService)
    { }

    ngOnInit() {
        this.InterestPaymentForm = this.FB.group({

            pintrestpaymentlist: this.addpinterestpaymentsslistcontrols(),
            
          
        })
        this.GetShowmemberdetails()
        this.InterestPaymentErrors = {};
  }
    addpinterestpaymentsslistcontrols(): FormGroup {
        return this.FB.group({
            pMembername: ['',Validators.required],
            pFdaccountno: ['',Validators.required],
            pPaymenttype: ['',Validators.required],
            pIntrestamount: ['',Validators.required],
            pTdsamount: ['',Validators.required],
            ptotalamount: ['',Validators.required],

        })
    }
  GetAccountDetails(DataItem) {
    debugger;

    this.fdTranscationDetailsComponent.BindData(DataItem.pFdaccountno,DataItem.pFdaccountid);
    $('#add-detail').modal('show');
  }
    GetShowmemberdetails() {
        debugger;
        //if (this.InterestPaymentForm.valid) {
       
        debugger;
        this._LienEntryService.GetShowInterestpaymentdetailsforview().subscribe(result => {
            debugger;
            this.Showmembers = result;
            console.log("binding to grid",this.Showmembers)
        })

        // }
    }

}
