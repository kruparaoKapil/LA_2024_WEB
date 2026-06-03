import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../../../Services/common.service';
import { debug } from 'util';
import { DatePipe, JsonPipe } from '@angular/common';
import { LienEntryService } from '../../../../Services/Banking/lien-entry.service';
import { Router } from '@angular/router';
import { AccountingTransactionsService } from '../../../../Services/Accounting/accounting-transactions.service';

@Component({
    selector: 'app-commission-payement-view',
    templateUrl: './commission-payement-view.component.html',
    styles: []
})
export class CommissionPayementViewComponent implements OnInit {

    CommissionPaymentForm: FormGroup;
    public commissionpaymentlist: any = []
    public CommisionPaymentErrors: any = []


    constructor(private FB: FormBuilder, private _LienEntryService: LienEntryService, private _CommonService: CommonService, private datepipe: DatePipe, private router: Router, private _AccountingTransactionsService: AccountingTransactionsService) { }

    ngOnInit() {
        this.CommissionPaymentForm = this.FB.group({

            pcommissionpaymentlist: this.addpcommisionpaymentsslistcontrols(),


        })
        this.GetViewCommisiondetails()
        this.CommisionPaymentErrors = {};
    }
    addpcommisionpaymentsslistcontrols(): FormGroup {
        return this.FB.group({
            pMembername: ['', Validators.required],
            pSchemeAccountno: ['', Validators.required],
            pCommissionamount: ['', Validators.required],
            pTdsamount: ['', Validators.required],
            ptotalamount: ['', Validators.required],
            pTenor: ['', Validators.required],
            ptransdate: ['', Validators.required],
            pAgentname: ['', Validators.required],
            pDepositamount: ['', Validators.required],
            pCommissionvalue: ['', Validators.required],

        })
    }

    GetViewCommisiondetails() {
        debugger;
        this._LienEntryService.GetViewCommisionpaymentdetails().subscribe(result => {
            debugger;
            this.commissionpaymentlist = result;
            console.log("binding to grid", this.commissionpaymentlist)
        })

       
    }

}

