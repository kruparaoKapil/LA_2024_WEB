import { Component, OnInit } from '@angular/core';
import { MoratoriumService } from 'src/app/Services/Loans/Transactions/moratorium.service';

@Component({
  selector: 'app-moratorium-view',
  templateUrl: './moratorium-view.component.html'
})
export class MoratoriumViewComponent implements OnInit {
  loanReceiptData = [];

  constructor(private _moratorimaServices:MoratoriumService) { }

  ngOnInit() {
    this.loanReceiptData=[];
    this._moratorimaServices.ViewMoratoriumLoanDetails().subscribe(json=>{
      this.loanReceiptData=json;
    })
  }

}
