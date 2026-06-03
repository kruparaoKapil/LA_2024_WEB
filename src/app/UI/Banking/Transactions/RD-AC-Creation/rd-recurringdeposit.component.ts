import { Component, OnInit } from '@angular/core';
import { FdRdTransactionsService } from '../../../../Services/Banking/Transactions/fd-rd-transactions.service'


declare let $: any
@Component({
  selector: 'app-rd-recurringdeposit',
  templateUrl: './rd-recurringdeposit.component.html',
  styleUrls: []
})
export class RdRecurringdepositComponent implements OnInit {

  RdTransTab1DataToSave: any

  constructor(private _FdRdTransactionsService: FdRdTransactionsService) { }

  ngOnInit() {

    this._FdRdTransactionsService._GetRdTransTab1Data().subscribe(res => {
      if (res != undefined) {
        this.RdTransTab1DataToSave = res
        console.log("Rd Tab 1 Data-->",JSON.stringify(this.RdTransTab1DataToSave))
      }
    })

  }


  NextTabClick() {
    let str = "add-joint-member"
    $('.nav-item a[href="#' + str + '"]').tab('show');
  }
}
