import { Component, OnInit, NgZone } from '@angular/core';
import { LoansmasterService } from 'src/app/Services/Loans/Masters/loansmaster.service';
import { FormBuilder, FormGroup, Validators, NgForm, FormArray } from '@angular/forms';
import { CommonService } from '../../../../Services/common.service';
import { State, process } from '@progress/kendo-data-query';

declare let $: any
@Component({
  selector: 'app-loansinstallmentduedate',
  templateUrl: './loansinstallmentduedate.component.html',
  styles: []
})
export class LoansinstallmentduedateComponent implements OnInit {

  LoanInstallmentDuedateForm: FormGroup
  Loansinstallmentduedate: any;
  Data: any;
  TableColumnsDynamic: any
  DatatableInIt: any;

  InstallmentsData: any;

  fromdisbursedates: any
  todisbursedates: any;

  fixedDateOfMnthShowHide: Boolean;
  installmentDueDateShowHide: Boolean

  count: number = 0
  GridDataInIt: any;
  radiobuttoncheck: any

  applicantTypesPush: any;

  duedates: any
  Instlmday: any
  datatocheckduplicates: any
  submitted = false;

  AddButtonShowHide: Boolean
  UpdateButtonShowHide: Boolean

  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10
  };
  rowIndex: any;

  constructor(private _CommonService: CommonService, private fb: FormBuilder, private _loanmasterservice: LoansmasterService, private zone: NgZone) {

    window['CallingFunctionOutsideAngularEdit'] = {
      zone: this.zone,
      componentFn: (value, rowIndex) => this.datatableclickedit(value, rowIndex),
      component: this,
    };

    window['CallingFunctionOutsideAngularDelete'] = {
      zone: this.zone,
      componentFn: (value, rowIndex) => this.datatableclickdelete(value, rowIndex),
      component: this,
    };

  }

  ngOnInit() {

    this.AddButtonShowHide = true
    this.UpdateButtonShowHide = false

    this.applicantTypesPush = [];
    this.fixedDateOfMnthShowHide = false
    this.installmentDueDateShowHide = false

    this.TableColumnsDynamic = [

      {
        "title": "S.No.", "data": null,
        render: function (data, type, row, meta) {
          return meta.row + meta.settings._iDisplayStart + 1;
        }
      },

      { "title": "From", "data": "pDisbursefromday", className: 'from' },
      { "title": "To", "data": "pDisbursetoday", className: 'to' },
      { "title": "Installment due day", "data": "pInstalmentdueday", className: 'installmentdue' },
      {
        "title": "", "data": "null", "mData": null,
        "bSortable": false,
        "mRender": function (data, type, full) {
          return '<a  src=""><div id="icon-edit"></div></a>';
        }
      },
      {
        "title": "", "data": "null", "mData": null,
        "bSortable": false,
        "mRender": function (data, type, full) {
          return '<a  src=""><div id="icon-delete"></div></a>';
        }
      }


    ];

    let data = []
    this.CalDataTable(data)


    this.Loansinstallmentduedate = [];
    this.LoanInstallmentDuedateForm = this.fb.group({
      pTypeofInstalmentDay: [''],
      pInstalmentdueday: [''],
      instalmentdueday: [''],
      pDisbursefromday: [''],
      pDisbursetoday: [''],
      pStatusname: [''],
     // pCreatedby: [this._CommonService.pCreatedby]

    })


    this._loanmasterservice._FindingValidationsBetweenComponents().subscribe(() => {
      this._loanmasterservice._addDataToLoanMaster(this.applicantTypesPush, "loansinstallmentduedate")
    });


    this.LoanInstallmentDuedateForm.controls.pStatusname.setValue("Active")

    this.fromdisbursedates = [
      { "id": 1, "pDisbursefromday": 1 }, { "id": 2, "pDisbursefromday": 2 }, { "id": 3, "pDisbursefromday": 3 }, { "id": 4, "pDisbursefromday": 4 }, { "id": 5, "pDisbursefromday": 5 },
      { "id": 6, "pDisbursefromday": 6 }, { "id": 7, "pDisbursefromday": 7 }, { "id": 8, "pDisbursefromday": 8 }, { "id": 9, "pDisbursefromday": 9 }, { "id": 10, "pDisbursefromday": 10 },
      { "id": 11, "pDisbursefromday": 11 }, { "id": 12, "pDisbursefromday": 12 }, { "id": 13, "pDisbursefromday": 13 }, { "id": 14, "pDisbursefromday": 14 }, { "id": 15, "pDisbursefromday": 15 },
      { "id": 16, "pDisbursefromday": 16 }, { "id": 17, "pDisbursefromday": 17 }, { "id": 18, "pDisbursefromday": 18 }, { "id": 19, "pDisbursefromday": 19 }, { "id": 20, "pDisbursefromday": 20 },
      { "id": 21, "pDisbursefromday": 21 }, { "id": 22, "pDisbursefromday": 22 }, { "id": 23, "pDisbursefromday": 23 }, { "id": 24, "pDisbursefromday": 24 }, { "id": 25, "pDisbursefromday": 25 },
      { "id": 26, "pDisbursefromday": 26 }, { "id": 27, "pDisbursefromday": 27 }, { "id": 28, "pDisbursefromday": 28 }, { "id": 29, "pDisbursefromday": 29 }, { "id": 30, "pDisbursefromday": 30 }, { "id": 31, "pDisbursefromday": 31 }
    ]

    this.todisbursedates = [
      { "id": 1, "pDisbursetoday": 1 }, { "id": 2, "pDisbursetoday": 2 }, { "id": 3, "pDisbursetoday": 3 }, { "id": 4, "pDisbursetoday": 4 }, { "id": 5, "pDisbursetoday": 5 },
      { "id": 6, "pDisbursetoday": 6 }, { "id": 7, "pDisbursetoday": 7 }, { "id": 8, "pDisbursetoday": 8 }, { "id": 9, "pDisbursetoday": 9 }, { "id": 10, "pDisbursetoday": 10 },
      { "id": 11, "pDisbursetoday": 11 }, { "id": 12, "pDisbursetoday": 12 }, { "id": 13, "pDisbursetoday": 13 }, { "id": 14, "pDisbursetoday": 14 }, { "id": 15, "pDisbursetoday": 15 },
      { "id": 16, "pDisbursetoday": 16 }, { "id": 17, "pDisbursetoday": 17 }, { "id": 18, "pDisbursetoday": 18 }, { "id": 19, "pDisbursetoday": 19 }, { "id": 20, "pDisbursetoday": 20 },
      { "id": 21, "pDisbursetoday": 21 }, { "id": 22, "pDisbursetoday": 22 }, { "id": 23, "pDisbursetoday": 23 }, { "id": 24, "pDisbursetoday": 24 }, { "id": 25, "pDisbursetoday": 25 },
      { "id": 26, "pDisbursetoday": 26 }, { "id": 27, "pDisbursetoday": 27 }, { "id": 28, "pDisbursetoday": 28 }, { "id": 29, "pDisbursetoday": 29 }, { "id": 30, "pDisbursetoday": 30 }, { "id": 31, "pDisbursetoday": 31 }
    ]

    this.radiobuttoncheck = "Based on loan disbursal date"
    this.LoanInstallmentDuedateForm.controls.pInstalmentdueday.setValue(0)
    this.LoanInstallmentDuedateForm.controls.pDisbursefromday.setValue(0)
    this.LoanInstallmentDuedateForm.controls.pDisbursetoday.setValue(0)
    this.LoanInstallmentDuedateForm.controls.pTypeofInstalmentDay.setValue("Based on loan disbursal date")

    this.InstallmentsData = this._loanmasterservice.GetLoanInstallmentDueData()
    if (this.InstallmentsData != "" && this.InstallmentsData != undefined) {
      // this.AddButtonShowHide = false
      // this.UpdateButtonShowHide = true
      this.radiobuttoncheck = this.InstallmentsData[0].pTypeofInstalmentDay
      if (this.radiobuttoncheck == "A fixed date of a month") {
        this.fixedDateOfMnthShowHide = true
        this.installmentDueDateShowHide = false
        document.getElementById("fixeddateofmonth").style.display = "block";
        document.getElementById("installementduedate").style.display = "none";
        this.LoanInstallmentDuedateForm.controls.pTypeofInstalmentDay.setValue("A fixed date of a month")
        this.LoanInstallmentDuedateForm.controls.pInstalmentdueday.setValue(this.InstallmentsData[0].pInstalmentdueday)
        this.LoanInstallmentDuedateForm.controls.pDisbursefromday.setValue(0)
        this.LoanInstallmentDuedateForm.controls.pDisbursetoday.setValue(0)
      }
      else if (this.radiobuttoncheck == "Based on loan disbursal date") {
        this.fixedDateOfMnthShowHide = false
        this.installmentDueDateShowHide = false
        document.getElementById("fixeddateofmonth").style.display = "none";
        document.getElementById("installementduedate").style.display = "none";
        this.LoanInstallmentDuedateForm.controls.pTypeofInstalmentDay.setValue("Based on loan disbursal date")
        this.LoanInstallmentDuedateForm.controls.pDisbursefromday.setValue(0)
        this.LoanInstallmentDuedateForm.controls.pDisbursetoday.setValue(0)
        this.LoanInstallmentDuedateForm.controls.pInstalmentdueday.setValue(0)

      }
      else if (this.radiobuttoncheck == "Installment due date") {
        this.fixedDateOfMnthShowHide = false
        this.installmentDueDateShowHide = true
        document.getElementById("installementduedate").style.display = "block";
        document.getElementById("fixeddateofmonth").style.display = "none";
        this.LoanInstallmentDuedateForm.controls.pTypeofInstalmentDay.setValue("Installment due date")
        //this.LoanInstallmentDuedateForm.controls.pDisbursefromday.setValue(this.InstallmentsData[0].pDisbursefromday)
        //  this.LoanInstallmentDuedateForm.controls.pDisbursetoday.setValue(this.InstallmentsData[0].pDisbursetoday)
        // this.LoanInstallmentDuedateForm.controls.pInstalmentdueday.setValue(this.InstallmentsData[0].pInstalmentdueday)
        this.applicantTypesPush = this.InstallmentsData
        this.datatocheckduplicates = this.applicantTypesPush;

        this.LoanInstallmentDuedateForm.controls.pDisbursefromday.setValue("");
        this.LoanInstallmentDuedateForm.controls.pDisbursetoday.setValue("");
        this.LoanInstallmentDuedateForm.controls.pInstalmentdueday.setValue("");

      }
      this.CalDataTable(this.InstallmentsData)
    }

  }

  NextTabClick() {
    
    this.submitted = true;

    //if (this.LoanInstallmentDuedateForm.controls.pTypeofInstalmentDay.value == "Installment due date") {
    if (this.applicantTypesPush != "") {

      if (this.applicantTypesPush[0].pInstalmentdueday != "" && this.applicantTypesPush[0].pDisbursefromday != "" && this.applicantTypesPush[0].pDisbursetoday != "") {

        this.Loansinstallmentduedate.push(this.LoanInstallmentDuedateForm.value);
        this._loanmasterservice._addDataToLoanMaster(this.applicantTypesPush, "loansinstallmentduedate")

        //Removing Validation for pInstalmentdueday Control
        this.LoanInstallmentDuedateForm.controls.pInstalmentdueday.clearValidators()
        this.LoanInstallmentDuedateForm.controls.pInstalmentdueday.updateValueAndValidity();
        this.RemoveValidationsForInstallmentduedatesControls()
        //
        let str = "penalinterest"
        this._loanmasterservice._SetSelectTitileInLoanCreation("Penal Interest")
        $('.nav-item a[href="#' + str + '"]').tab('show');

      } else {
        this.SetValidationsForInstallmentduedatesControls()
      }

    } else {

      if (this.LoanInstallmentDuedateForm.controls.pTypeofInstalmentDay.value == "Installment due date") {
        if (this.LoanInstallmentDuedateForm.controls.pDisbursefromday.value != "" && this.LoanInstallmentDuedateForm.controls.pDisbursetoday.value != "" && this.LoanInstallmentDuedateForm.controls.pInstalmentdueday.value != "") {
          if (this.applicantTypesPush == "") {
            this.applicantTypesPush.push(this.LoanInstallmentDuedateForm.value);
          }
          this.Loansinstallmentduedate.push(this.LoanInstallmentDuedateForm.value);
          this._loanmasterservice._addDataToLoanMaster(this.applicantTypesPush, "loansinstallmentduedate")
          let str = "penalinterest"
          this._loanmasterservice._SetSelectTitileInLoanCreation("Penal Interest")
          $('.nav-item a[href="#' + str + '"]').tab('show');
        } else {
          this.SetValidationsForInstallmentduedatesControls()
        }
      } else {

        if (this.LoanInstallmentDuedateForm.valid) {
          if (this.applicantTypesPush == "") {
            this.applicantTypesPush.push(this.LoanInstallmentDuedateForm.value);
          }
          this.Loansinstallmentduedate.push(this.LoanInstallmentDuedateForm.value);
          this._loanmasterservice._addDataToLoanMaster(this.applicantTypesPush, "loansinstallmentduedate")
          let str = "penalinterest"
          this._loanmasterservice._SetSelectTitileInLoanCreation("Penal Interest")
          $('.nav-item a[href="#' + str + '"]').tab('show');
        }
      }
    }


  }

  SetValidationsForInstallmentduedatesControls() {
    this.LoanInstallmentDuedateForm.controls.pInstalmentdueday.setValidators([Validators.required])
    this.LoanInstallmentDuedateForm.controls.pInstalmentdueday.updateValueAndValidity();
    this.LoanInstallmentDuedateForm.controls.pDisbursefromday.setValidators([Validators.required])
    this.LoanInstallmentDuedateForm.controls.pDisbursefromday.updateValueAndValidity();
    this.LoanInstallmentDuedateForm.controls.pDisbursetoday.setValidators([Validators.required])
    this.LoanInstallmentDuedateForm.controls.pDisbursetoday.updateValueAndValidity();
  }
  RemoveValidationsForInstallmentduedatesControls() {
    // this.LoanInstallmentDuedateForm.controls.pInstalmentdueday.clearValidators()
    // this.LoanInstallmentDuedateForm.controls.pInstalmentdueday.updateValueAndValidity();
    this.LoanInstallmentDuedateForm.controls.pDisbursefromday.clearValidators()
    this.LoanInstallmentDuedateForm.controls.pDisbursefromday.updateValueAndValidity();
    this.LoanInstallmentDuedateForm.controls.pDisbursetoday.clearValidators()
    this.LoanInstallmentDuedateForm.controls.pDisbursetoday.updateValueAndValidity();
  }

  fixedDateOfMonthClick() {

    this.applicantTypesPush = [];

    this.fixedDateOfMnthShowHide = true
    this.installmentDueDateShowHide = false

    document.getElementById("fixeddateofmonth").style.display = "block";
    document.getElementById("installementduedate").style.display = "none";

    this.LoanInstallmentDuedateForm.controls.pTypeofInstalmentDay.setValue("A fixed date of a month")
    this.LoanInstallmentDuedateForm.controls.pInstalmentdueday.setValue("")
    this.LoanInstallmentDuedateForm.controls.pDisbursefromday.setValue(0)
    this.LoanInstallmentDuedateForm.controls.pDisbursetoday.setValue(0)
    this.LoanInstallmentDuedateForm.controls.pInstalmentdueday.setValidators([Validators.required])
    this.LoanInstallmentDuedateForm.controls.pInstalmentdueday.updateValueAndValidity();
     this.submitted = false
    this.RemoveValidationsForInstallmentduedatesControls()
  }
  BasedOninstallmentDuedateClick() {
    this.applicantTypesPush = [];
    this.fixedDateOfMnthShowHide = false
    this.installmentDueDateShowHide = false
    document.getElementById("fixeddateofmonth").style.display = "none";
    document.getElementById("installementduedate").style.display = "none";
    this.LoanInstallmentDuedateForm.controls.pTypeofInstalmentDay.setValue("Based on loan disbursal date")
    this.LoanInstallmentDuedateForm.controls.pInstalmentdueday.setValue("")
    this.LoanInstallmentDuedateForm.controls.pInstalmentdueday.setValue(0)
    this.LoanInstallmentDuedateForm.controls.pDisbursefromday.setValue(0)
    this.LoanInstallmentDuedateForm.controls.pDisbursetoday.setValue(0)
  }

  installmentDueDateClick() {
    this.applicantTypesPush = [];
    this.datatocheckduplicates=[];
    let data = []
    this.CalDataTable(data)

    this.fixedDateOfMnthShowHide = false
    this.installmentDueDateShowHide = true

    document.getElementById("installementduedate").style.display = "block";
    document.getElementById("fixeddateofmonth").style.display = "none";

    this.LoanInstallmentDuedateForm.controls.pTypeofInstalmentDay.setValue("Installment due date")
    this.submitted = false
    this.SetValidationsForInstallmentduedatesControls()

    // this.LoanInstallmentDuedateForm.controls.pInstalmentdueday.setValue("")
    // this.LoanInstallmentDuedateForm.controls.pDisbursefromday.setValue("Select")
    // this.LoanInstallmentDuedateForm.controls.pDisbursetoday.setValue("Select")
    this.LoanInstallmentDuedateForm.controls.pDisbursefromday.setValue("");
    this.LoanInstallmentDuedateForm.controls.pDisbursetoday.setValue("");
    this.LoanInstallmentDuedateForm.controls.pInstalmentdueday.setValue("");
  }

  AddDataToDataTable() {
    
    this.SetValidationsForInstallmentduedatesControls()
    this.submitted = true;

    if (this.LoanInstallmentDuedateForm.valid) {

      let LoanInstallmentDueDates = { "pTypeofInstalmentDay": "Installment due date", "pInstalmentdueday": this.LoanInstallmentDuedateForm.value["pInstalmentdueday"], "pDisbursefromday": this.LoanInstallmentDuedateForm.value["pDisbursefromday"], "pDisbursetoday": this.LoanInstallmentDuedateForm.value["pDisbursetoday"] };
      if (this.datatocheckduplicates != undefined && this.datatocheckduplicates.length > 0) {

        var dataExist = JSON.stringify(this.datatocheckduplicates).includes(JSON.stringify(LoanInstallmentDueDates));
        this.duedates = false
        for (var r = 0; r < this.datatocheckduplicates.length; r++) {

          let Tfrom = parseFloat(this.datatocheckduplicates[r]["pDisbursefromday"]);
          let Tto = parseFloat(this.datatocheckduplicates[r]["pDisbursetoday"]);

          let Lfrom = parseFloat(LoanInstallmentDueDates["pDisbursefromday"]);
          let LTo = parseFloat(LoanInstallmentDueDates["pDisbursetoday"]);

          let Instlday = parseFloat(LoanInstallmentDueDates["pInstalmentdueday"]);
          let Instlfrmday = parseFloat(LoanInstallmentDueDates["pDisbursefromday"]);
          let Instltoday = parseFloat(LoanInstallmentDueDates["pDisbursetoday"]);



          if (Lfrom != NaN && LTo != NaN && Instltoday != NaN) {

            if (Lfrom >= Tfrom && Lfrom <= Tto || LTo >= Tfrom && LTo <= Tto) {
              this.duedates = true;
            }
            else if (Tfrom > Lfrom && Tfrom < LTo || Tto > Lfrom && Tto < LTo) {
              this.duedates = true;
            }
            else {
              this.Instlmday = false
              if (Instlday >= Instlfrmday && Instlday <= Instltoday) {
                if (Instlday < 0 || Instlday > 28) {
                  alert("Installment Due Day Should Be Between 1 and 28")
                  this.LoanInstallmentDuedateForm.controls.pInstalmentdueday.setValue("")
                }
              }
              else {
                this.Instlmday = true
                alert("Installment due date should be between fromdate and todate")
                this.LoanInstallmentDuedateForm.controls.pInstalmentdueday.setValue("")
              }
            }
          }

        }
        if (dataExist == false && this.duedates == false && this.Instlmday == false) {
          this.applicantTypesPush.push(LoanInstallmentDueDates);
          this.datatocheckduplicates = this.applicantTypesPush;
          this.DatatableInIt.row.add(LoanInstallmentDueDates).draw().node();
          this.submitted = false;
          this.LoanInstallmentDuedateForm.reset();
          this.LoanInstallmentDuedateForm.controls.pDisbursefromday.setValue("");
          this.LoanInstallmentDuedateForm.controls.pDisbursetoday.setValue("");
          this.LoanInstallmentDuedateForm.controls.pInstalmentdueday.setValue("");
        } else {

          this.submitted = false;
          this.LoanInstallmentDuedateForm.reset();
          this.LoanInstallmentDuedateForm.controls.pDisbursefromday.setValue("");
          this.LoanInstallmentDuedateForm.controls.pDisbursetoday.setValue("");
          this.LoanInstallmentDuedateForm.controls.pInstalmentdueday.setValue("");
        }

      }
      else {

        this.applicantTypesPush.push(LoanInstallmentDueDates);
        this.datatocheckduplicates = this.applicantTypesPush;
        this.DatatableInIt.row.add(LoanInstallmentDueDates).draw().node();
        this.submitted = false;
        this.LoanInstallmentDuedateForm.reset();
        this.LoanInstallmentDuedateForm.controls.pDisbursefromday.setValue("");
        this.LoanInstallmentDuedateForm.controls.pDisbursetoday.setValue("");
        this.LoanInstallmentDuedateForm.controls.pInstalmentdueday.setValue("");

      }
    }


  }
  UpdateDataToDataTable() {
    
    this.SetValidationsForInstallmentduedatesControls()
    this.submitted = true;
    let updatedgriddata = [];
    this.datatocheckduplicates = []
    if (this.LoanInstallmentDuedateForm.valid) {

      let LoanInstallmentDueDates = { "pTypeofInstalmentDay": this.LoanInstallmentDuedateForm.value["pTypeofInstalmentDay"], "pInstalmentdueday": this.LoanInstallmentDuedateForm.value["pInstalmentdueday"], "pDisbursefromday": this.LoanInstallmentDuedateForm.value["pDisbursefromday"], "pDisbursetoday": this.LoanInstallmentDuedateForm.value["pDisbursetoday"] };
      if (this.datatocheckduplicates.length > 0) {

        var dataExist = JSON.stringify(this.datatocheckduplicates).includes(JSON.stringify(LoanInstallmentDueDates));



        for (var r = 0; r < this.datatocheckduplicates.length; r++) {

          let Tfrom = parseFloat(this.datatocheckduplicates[r]["pDisbursefromday"]);
          let Tto = parseFloat(this.datatocheckduplicates[r]["pDisbursetoday"]);

          let Lfrom = parseFloat(LoanInstallmentDueDates["pDisbursefromday"]);
          let LTo = parseFloat(LoanInstallmentDueDates["pDisbursetoday"]);

          let Instlday = parseFloat(LoanInstallmentDueDates["pInstalmentdueday"]);
          let Instlfrmday = parseFloat(LoanInstallmentDueDates["pDisbursefromday"]);
          let Instltoday = parseFloat(LoanInstallmentDueDates["pDisbursetoday"]);

          this.duedates = false

          if (Lfrom != NaN && LTo != NaN && Instltoday != NaN) {

            if (Lfrom >= Tfrom && Lfrom <= Tto || LTo >= Tfrom && LTo <= Tto) {
              this.duedates = true;
            }
            else {
              this.Instlmday = false
              if (Instlday >= Instlfrmday && Instlday <= Instltoday) {

                if (Instlday < 0 || Instlday > 28) {
                  alert("Installment Due Day Should Be Between 1 And 28")
                  this.LoanInstallmentDuedateForm.controls.pInstalmentdueday.setValue("")
                }
              }
              else {
                this.Instlmday = true
                alert("Installment Due Date Should Be Between From Date And To Date")
                this.LoanInstallmentDuedateForm.controls.pInstalmentdueday.setValue("")
              }
            }
          }

        }


        if (dataExist == false && this.duedates == false && this.Instlmday == false) {
          this.applicantTypesPush.push(LoanInstallmentDueDates);
          this.datatocheckduplicates = this.applicantTypesPush;
          

          this.datatocheckduplicates[0]["pDisbursefromday"] = LoanInstallmentDueDates["pDisbursefromday"]
          this.datatocheckduplicates[0]["pDisbursetoday"] = LoanInstallmentDueDates["pDisbursetoday"]
          this.datatocheckduplicates[0]["pInstalmentdueday"] = LoanInstallmentDueDates["pInstalmentdueday"]
          this.DatatableInIt.row(this.rowIndex).data(this.datatocheckduplicates[0]).draw();
          //  this.DatatableInIt.row.add(LoanInstallmentDueDates).draw().node();

          this.submitted = false;
          this.LoanInstallmentDuedateForm.reset();
          this.LoanInstallmentDuedateForm.controls.pDisbursefromday.setValue("");
          this.LoanInstallmentDuedateForm.controls.pDisbursetoday.setValue("");
          this.LoanInstallmentDuedateForm.controls.pInstalmentdueday.setValue("");
          this.AddButtonShowHide = true
          this.UpdateButtonShowHide = false
        }
        else {
          alert("Duplicates Are Not aAllowed")
          this.submitted = false;
          this.LoanInstallmentDuedateForm.reset();
          this.LoanInstallmentDuedateForm.controls.pDisbursefromday.setValue("");
          this.LoanInstallmentDuedateForm.controls.pDisbursetoday.setValue("");
          this.LoanInstallmentDuedateForm.controls.pInstalmentdueday.setValue("");
        }
      }
      else {

        let Instlday = parseFloat(LoanInstallmentDueDates["pInstalmentdueday"]);
        let Instlfrmday = parseFloat(LoanInstallmentDueDates["pDisbursefromday"]);
        let Instltoday = parseFloat(LoanInstallmentDueDates["pDisbursetoday"]);

        if (Instlday >= Instlfrmday && Instlday <= Instltoday) {
          // this.applicantTypesPush.push(LoanInstallmentDueDates);
          this.datatocheckduplicates = this.applicantTypesPush;

          this.datatocheckduplicates[0]["pDisbursefromday"] = LoanInstallmentDueDates.pDisbursefromday
          this.datatocheckduplicates[0]["pDisbursetoday"] = LoanInstallmentDueDates.pDisbursetoday
          this.datatocheckduplicates[0]["pInstalmentdueday"] = LoanInstallmentDueDates.pInstalmentdueday

          this.DatatableInIt.row(this.rowIndex).data(this.datatocheckduplicates[0]).draw();
          // this.DatatableInIt.row.add(LoanInstallmentDueDates).draw().node();

          this.submitted = false;
          this.LoanInstallmentDuedateForm.reset();
          this.LoanInstallmentDuedateForm.controls.pDisbursefromday.setValue("");
          this.LoanInstallmentDuedateForm.controls.pDisbursetoday.setValue("");
          this.LoanInstallmentDuedateForm.controls.pInstalmentdueday.setValue("");
          this.AddButtonShowHide = true
          this.UpdateButtonShowHide = false
        } else {
          alert("Installment Due Date Should Be Between From Date And To Date")
          this.LoanInstallmentDuedateForm.controls.pInstalmentdueday.setValue("")
        }


      }
    }
  }

  CalDataTable(TableData) {
    let tablename = '#tableInstallmentduedate'

    if (this.DatatableInIt != null) {
      this.DatatableInIt.destroy();
    }
    $('#tableInstallmentduedate tbody').off('click', 'tr');
    this.DatatableInIt = $(tablename).DataTable({
      language: { searchPlaceholder: "Search leads", search: "" },
      "bDestroy": true,
      'columnDefs': [
        {
          'targets': 0,
          'checkboxes': {
            'selectRow': true
          }


        },
      ],
      "processing": true,
      "bPaginate": true,
      "bInfo": false,
      "bFilter": false,
      //"Sort":false,
      //"bSort": false,
      'select': {
        'style': 'multi',
      },
      responsive: true,
      data: TableData,
      dom: 'Bfrtip',
      columns: this.TableColumnsDynamic,
      initComplete: function () {
        var $buttons = $('.dt-buttons').hide();
      }
    });
    let Newdatatable = this.DatatableInIt

    $('#tableInstallmentduedate tbody').on('click', 'tr', function (e) {

      let rowIndex = Newdatatable.row(this).index();
      let ClickValue = e.target.id;
      if (ClickValue == "icon-edit") {
        var data = Newdatatable.row(this).data();
        window['CallingFunctionOutsideAngularEdit'].componentFn(data, rowIndex)
      }
      else if (ClickValue == "icon-delete") {
        var data = Newdatatable.row(this).data();
        Newdatatable.rows(this).remove().draw();
        window['CallingFunctionOutsideAngularDelete'].componentFn(data, rowIndex)
      }
    });


  }

  CheckInstallmentDate(event) {


    let dfromdate = this.LoanInstallmentDuedateForm.controls.pDisbursefromday.value
    if (dfromdate != "") {

      let dtodate = this.LoanInstallmentDuedateForm.controls.pDisbursetoday.value
      if (dtodate != "") {
        let date = event.currentTarget.value
        if (date != "") {
          let d = +date
          let fdate = this.LoanInstallmentDuedateForm.controls.pDisbursefromday.value
          let tdate = this.LoanInstallmentDuedateForm.controls.pDisbursetoday.value

          let fd = +fdate
          let td = +tdate
          if (d >= fd && d <= td) {

            if (d < 0 || d > 28) {
              alert("Installment Due Day Should Be Between 1 And 28")
              this.LoanInstallmentDuedateForm.controls.pInstalmentdueday.setValue("")
            } else {
              // this.LoanInstallmentDuedateForm.controls.pInstalmentdueday.setValue(d)
            }

          } else {
            alert("Installment Due Date Should Be Between From Date And To Date")
            this.LoanInstallmentDuedateForm.controls.pInstalmentdueday.setValue("")
          }
        } else {
          alert("Enter Installment Due Date")
        }
      } else {
        alert("Select Disbursement To Date ")
        this.LoanInstallmentDuedateForm.controls.pInstalmentdueday.setValue("")
      }
    } else {
      alert("Select Disbursement From Date ")
      this.LoanInstallmentDuedateForm.controls.pInstalmentdueday.setValue("")
    }

  }

  CheckInstallmentDatefixed(event) {
    let date = event.currentTarget.value
    if (date != "") {
      let d = +date
      if (d <= 0 || d > 28) {
        alert("Installment Due Day Should Be Between 1 And 28")
        this.LoanInstallmentDuedateForm.controls.pInstalmentdueday.setValue("")
      }
    }
  }

  SelectDate(event, datetype) {

    if (datetype == "from") {
      let date = event.currentTarget.value
      this.LoanInstallmentDuedateForm.controls.pDisbursefromday.setValue(date)
    } else {

      let date = event.currentTarget.value
      let d = +date
      let fromdate = this.LoanInstallmentDuedateForm.controls.pDisbursefromday.value
      let fd = +fromdate
      if (fd >= d) {
        this.LoanInstallmentDuedateForm.controls.pDisbursetoday.setValue("")
        alert("To Date Should Be Greather Than From Date")

      } else if (datetype == "to") {
        this.LoanInstallmentDuedateForm.controls.pDisbursetoday.setValue(date)
      }


    }
  }


  datatableclickedit(data, rowIndex) {
    
    // this.LoanInstallmentDuedateForm.setValue({ "pTypeofInstalmentDay": data["pTypeofInstalmentDay"], "pInstalmentdueday": data["pInstalmentdueday"], "pDisbursefromday": data["pDisbursefromday"], "pDisbursetoday": data["pDisbursetoday"]});
    this.AddButtonShowHide = false
    this.UpdateButtonShowHide = true
    this.rowIndex = rowIndex;
    this.LoanInstallmentDuedateForm.controls.pDisbursefromday.setValue(data.pDisbursefromday)
    this.LoanInstallmentDuedateForm.controls.pDisbursetoday.setValue(data.pDisbursetoday)
    this.LoanInstallmentDuedateForm.controls.pInstalmentdueday.setValue(data.pInstalmentdueday)
    this.LoanInstallmentDuedateForm.controls.pTypeofInstalmentDay.setValue(data.pTypeofInstalmentDay)

    //   this.LoanInstallmentDuedateForm.controls.pDisbursefromday.setValue(data.pDisbursefromday)
    //  this.LoanInstallmentDuedateForm.controls.pDisbursetoday.setValue(data.pDisbursetoday)
  }

  datatableclickdelete(data, rowIndex) {
    
    let dt = data
    let loanid = dt.pLoanid
    let modifiedby = 1

    this.applicantTypesPush.splice(rowIndex, 1);



    this.AddButtonShowHide = true
    this.UpdateButtonShowHide = false

    this.submitted = false;
    this.LoanInstallmentDuedateForm.reset();
    this.LoanInstallmentDuedateForm.controls.pDisbursefromday.setValue("");
    this.LoanInstallmentDuedateForm.controls.pDisbursetoday.setValue("");
    this.LoanInstallmentDuedateForm.controls.pInstalmentdueday.setValue("");

    this.DatatableInIt.row(rowIndex).data(data).draw();
    // this._loanmasterservice.DataTableRowDeleteClick(loanid, modifiedby).subscribe(count => {

    //   this._loanmasterservice.GetNameCodeData().subscribe(json => {

    //     // this.DisplayData = json
    //     //this.loanid = this.DisplayData[0].pLoanid
    //     //this.CalDataTable(this.DisplayData)
    //   })

    // })


  }

  showInstallementDueDate() {
    document.getElementById("installementduedate").style.display = "block";
    document.getElementById("fixeddateofmonth").style.display = "none";
  }

  Clear() {
    this.submitted=false
    this.LoanInstallmentDuedateForm.reset()
    // this.LoanInstallmentDuedateForm.controls.pDisbursefromday.setValue("");
    // this.LoanInstallmentDuedateForm.controls.pDisbursetoday.setValue("");
    // this.LoanInstallmentDuedateForm.controls.pInstalmentdueday.setValue("");

  }



}
