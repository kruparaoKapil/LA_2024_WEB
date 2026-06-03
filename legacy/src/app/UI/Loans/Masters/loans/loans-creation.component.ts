import { Component, OnInit } from '@angular/core';
import { LoansmasterService } from "../../../../Services/Loans/Masters/loansmaster.service";
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
declare let $: any

@Component({
  selector: 'app-loans-creation',
  templateUrl: './Loans-creation.html',
})
export class LoansCreationComponent implements OnInit {
  public loading = false;
  Loanname: string;
  Loancode: string;
  Data: any
  path: any
  selectedtype: any
  LoannameShowHide: Boolean = false
  constructor(private _loanmasterservice: LoansmasterService, private router: Router, private activatedroute: ActivatedRoute) { }

  ngOnInit() {
    

    this.selectedtype = "Loan Creation"
    let title = this._loanmasterservice._GetSelectTitileInLoanCreation().subscribe(title => {
      
      if (title != "" && title != undefined) {
        this.selectedtype = title
      } else {
        this.selectedtype = "Loan Creation"
      }
    })

    this._loanmasterservice._GetLoanNameAndCodeDataInTabs().subscribe(loannamecode => {
      
      if (loannamecode != "" && loannamecode != undefined) {
        this.Data = loannamecode
        this.LoannameShowHide = true
      } else {
        this.LoannameShowHide = false
      }
    })

    // const routeParams = this.activatedroute.snapshot.params['id'];
    // if (routeParams != undefined) {
    //   this._loanmasterservice.GetLoanDataToEdit(routeParams).subscribe(json => {
    //     
    //     let data = json
    //     this._loanmasterservice.SetButtonClickType("Edit")
    //     this._loanmasterservice.SetDatatableRowEditClick(data[0])
    //     this._loanmasterservice.SetLoanInstallmentDueData(data[0].instalmentdatedetailslist)
    //     this._loanmasterservice.SetLoanReferralCommissionData(data[0].referralCommissioLoanList)
    //     this._loanmasterservice.SetIdentificationProofsData(data[0].getidentificationdocumentsList)
    //     this._loanmasterservice._SetIdentificationProofsData(data[0].getidentificationdocumentsList)
        
    //   })
    // }

  }
  ChangeTab(data) {
    let url = "/" + data;
    this.router.navigate([url]);
  }

  testlinks(data, type) {
    let str = data
    this.selectedtype = type
    this._loanmasterservice.SetSelectTitileInLoanCreation(type)
    $('.nav-item a[href="#' + str + '"]').tab('show');
  }

  ShowTitle(type) {
    
    this.selectedtype = type
    this._loanmasterservice.SetSelectTitileInLoanCreation(type)
  }



}
