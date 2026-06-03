import { Component, OnInit } from '@angular/core';
import { LoansmasterService } from "../../../../Services/Loans/Masters/loansmaster.service";



declare let $: any
@Component({
  selector: 'app-loansidentificationdocuments',
  templateUrl: './loansidentificationdocuments.component.html',
  styles: []
})
export class LoansidentificationdocumentsComponent implements OnInit {

  current: any
  LoanDoucments: any;
  values: any;
  DocumentsRequired: any;
  DocumentsRequiredEdit: any
  Data: any;
  checkedMd: any
  checkedRq: any
  buttontype: any
  filterdata: any
  lfdata: any
  
  ClearButtonclick: any
  constructor(private _loanmasterservice: LoansmasterService) { }

  ngDoCheck() {
    // 
    if (this.ClearButtonclick == "ClearClicked") {
      this._loanmasterservice.GetLoanDoucments("0").subscribe(data => {
        this.LoanDoucments = data
      });
    }
    else {
      let buttontype = this._loanmasterservice.GetButtonClickType()
      if (buttontype != "New") {
        this.DocumentsRequiredEdit = []
        let res = this._loanmasterservice.GetIdentificationProofsData();
        if (res != "" && res != undefined) {
          this.LoanDoucments = res
          let DocumentsRequirededit = []
          this.filterdata = this.LoanDoucments.filter(function (Data) {

            // 
            let datatofilter = Data.pDocumentsList

            datatofilter.filter(function (fdata) {
              //
              // if (fdata.pContactType != "" && (fdata.pDocumentMandatory != false || fdata.pDocumentRequired != false)) {
              //   DocumentsRequirededit.push(fdata);
              // }
              if (fdata.pDocumentMandatory != false || fdata.pDocumentRequired != false) {
                DocumentsRequirededit.push(fdata);
              }
            })

          })
          this.DocumentsRequiredEdit.push(DocumentsRequirededit);
        }
      }
    }
  }
  ngOnInit() {


    this.DocumentsRequired = [];
    this.DocumentsRequiredEdit = [];
    this._loanmasterservice.GetLoanDoucments("0").subscribe(data => {
      this.LoanDoucments = data
    });

    this._loanmasterservice._FindingValidationsBetweenComponents().subscribe(() => {
      this._loanmasterservice._addDataToLoanMaster(this.DocumentsRequired, "loansidentificationdocuments")
    });


   

  }


  OnChange(data) {

    if (data.pDocumentRequired == false) {
      data.pDocumentRequired = true;
      data.pDocumentMandatory = true;

    }
    if (data.pDocumentMandatory == false) {
      data.pDocumentRequired = false;
    }
    this.DocumentsRequired.push(data);
    let len = this.DocumentsRequiredEdit.length
    if (this.DocumentsRequiredEdit.length != 0) {
      for (var j = 0; j < this.DocumentsRequiredEdit[0].length; j++) {
        this.DocumentsRequired.push(this.DocumentsRequiredEdit[0][j])
      }
    }

  }
  documentrequiredchecked(data1) {
    if (data1.pDocumentRequired == false) {
      data1.pDocumentMandatory = false
    }
    this.DocumentsRequired.push(data1);
    let len = this.DocumentsRequiredEdit.length
    if (this.DocumentsRequiredEdit.length != 0) {
      for (var j = 0; j < this.DocumentsRequiredEdit[0].length; j++) {
        this.DocumentsRequired.push(this.DocumentsRequiredEdit[0][j])
      }
    }
  }

  OnChangeRequired(data) {

    if (data.pDocumentRequired == true) {
      data.pDocumentRequired = true;
      data.pDocumentMandatory == false
    }
    this.DocumentsRequired.push(data);
    let len = this.DocumentsRequiredEdit.length
    if (this.DocumentsRequiredEdit.length != 0) {
      for (var j = 0; j < this.DocumentsRequiredEdit[0].length; j++) {
        this.DocumentsRequired.push(this.DocumentsRequiredEdit[0][j])
      }
    }

  }



  ClearButtonClick() {  
   // this.ClearButtonclick = "ClearClicked"   
  }

  NextTabClick() {

    let d = this.DocumentsRequiredEdit
    this.DocumentsRequired = this.DocumentsRequired.filter(function (Data) {
      Data.pContactType = "INDIVIDUAL";
      return Data.pDocumentMandatory != false || Data.pDocumentRequired != false;
    })
    let len = this.DocumentsRequiredEdit.length
    if (this.DocumentsRequiredEdit.length != 0) {
      for (var j = 0; j < this.DocumentsRequiredEdit[0].length; j++) {
        this.DocumentsRequired.push(this.DocumentsRequiredEdit[0][j])
      }
    }
    this._loanmasterservice._addDataToLoanMaster(this.DocumentsRequired, "loansidentificationdocuments")
    let str = "refferral"
    this._loanmasterservice._SetSelectTitileInLoanCreation("Referral Commission")
    $('.nav-item a[href="#' + str + '"]').tab('show');
  }


}
