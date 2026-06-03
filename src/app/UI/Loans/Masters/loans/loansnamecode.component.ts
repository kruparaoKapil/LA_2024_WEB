import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm, FormArray } from '@angular/forms';
import { LoansmasterService } from "../../../../Services/Loans/Masters/loansmaster.service";
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../Services/common.service';
declare let $: any


@Component({
  selector: 'app-loansnamecode',
  templateUrl: './loansnamecode.component.html',
  styles: []
})
export class LoansnamecodeComponent implements OnInit {

  LoanTypesData: any
  Loansnamescodeform: FormGroup
  loannametype: any
  loans: any
  Ccode: string = ""
  Bcode: string = ""
  Lcode: string = ""
  LNcode: string;
  LNCcode: string;
  Lnamecode: string = ""
  nexttab: string;

  CompanyDetails: any
  DisplayData: any
  DatatableDisplaydata: any
  TableColumnsDynamic: any
  DatatableInIt: any;
  loanname: string
  loanid: any

  checkloanid: any

  loannamecodecount: number

  LoanNameCodeSubscriber: any

  LoanType: string
  Loanname: string

  public loading = false;

  statusShowHide: Boolean
  submitted = false;
  buttontype: any


  LoanTypeDisable: Boolean
  LoanNameDisable: Boolean
  LoanCodeDisable: Boolean
  SeriesDisable: Boolean
  ClearButtonHideShowInEdit: Boolean

  constructor(private _CommonService: CommonService, private toaster: ToastrService, private cookieservice: CookieService, private zone: NgZone, private fb: FormBuilder, private _loanmasterservice: LoansmasterService) {

    window['CallingFunctionOutsideAngular'] = {
      zone: this.zone,
      componentFn: (value) => this.datatableclickedit(value),
      component: this,
    };

  }




  ngOnInit() {


    this.buttontype = this._loanmasterservice.GetButtonClickType()
    if (this.buttontype != "New" && this.buttontype != undefined) {
      //Loading Effect Applying Hear
      this.loading = true;
    } else {
      //Loading Effect Removing Hear
      this.loading = false;
    }

    this.LoanTypeDisable = false
    this.LoanNameDisable = false
    this.LoanCodeDisable = false
    this.SeriesDisable = false
    this.ClearButtonHideShowInEdit = true
    this.statusShowHide = false

    this.TableColumnsDynamic = [

      {
        "title": "S.No.", "data": null,
        render: function (data, type, row, meta) {
          return meta.row + meta.settings._iDisplayStart + 1;
        }
      },

      { "title": "Loan Type", "data": "pLoantype", className: 'loantype' },
      { "title": "Loan Name", "data": "pLoanname", className: 'loanname' },
      { "title": "Loan ID", "data": "pLoanidcode", className: 'cancelloancodedate' },

    ];

    this.Loansnamescodeform = this.fb.group({
      pLoantypeid: ['', Validators.required],
      pLoanId: [0],
      pLoanname: ['', [Validators.required]],
      pLoancode: ['', [Validators.required]],
      pCompanycode: [''],
      pBranchcode: [''],
      pSeries: ['00001', [Validators.required]],
      pSerieslength: ['5'],
      pLoanidcode: [''],
      pStatusname: [''],
      pStatusid: [''],

      pModifiedby: [this._CommonService.pCreatedby],


      pCreatedby: [this._CommonService.pCreatedby],
      pLoantype: [],
      pCreateddate: [null],
    })

    this._loanmasterservice.GetLoanMasterLoantypes().subscribe(json => {
      this.loans = json
    })

    this._loanmasterservice.GetCompanyBranchDetails().subscribe(json => {

      this.CompanyDetails = json
      this.Ccode = this.CompanyDetails[0].pEnterprisecode
      this.Bcode = this.CompanyDetails[0].pBranchcode
      this.Loansnamescodeform.controls.pCompanycode.setValue(this.Ccode)
      this.Loansnamescodeform.controls.pBranchcode.setValue(this.Bcode)

    })

    this._loanmasterservice.GetNameCodeData().subscribe(json => {

      this.DisplayData = json

      if (this.DisplayData != "" && this.DisplayData != null) {
        this.loanid = this.DisplayData[0].pLoanid
        this.CalDataTable(this.DisplayData)
      }

      // this.buttontype = this._loanmasterservice.GetButtonClickType()
      if (this.buttontype != "New") {

        let res = this._loanmasterservice.GetDatatableRowEditClick()
        if (res != null) {

          this.statusShowHide = true
          this.LoanTypeDisable = true
          this.LoanNameDisable = true
          this.LoanCodeDisable = true
          this.SeriesDisable = true
          this.ClearButtonHideShowInEdit = false

          this.Loansnamescodeform.controls.pLoanId.setValue(res.pLoanid)
          this.Loansnamescodeform.controls.pLoantypeid.setValue(res.pLoantypeid)
          this.Loansnamescodeform.controls.pLoanname.setValue(res.pLoanname)
          let str = res.pLoantype
          if (str != "") {
            let a = str.split(' ')
            for (var i = 0; i < a.length; i++) {
              this.Lcode += a[i].charAt(0)
            }
          }

          this.Loansnamescodeform.controls.pLoantype.setValue(res.pLoantype)
          let loantypeid = this.Loansnamescodeform.controls.pLoantypeid.value;
          let data = { "Loantype": res.pLoantype, "Loanname": res.pLoanname, "LoannameCode": res.pLoanidcode, "pLoantypeid": loantypeid }
          this._loanmasterservice._SetLoanNameAndCodeToNextTab(data)

          this.Loansnamescodeform.controls.pCompanycode.setValue(res.pCompanycode)
          this.Loansnamescodeform.controls.pBranchcode.setValue(res.pBranchcode)

          this.Loansnamescodeform.controls.pLoancode.setValue(res.pLoancode)
          this.Lnamecode = res.pLoanidcode
          this.LoanType = res.pLoantype
          this.Loanname = res.pLoanname
          this.Loansnamescodeform.controls.pLoanidcode.setValue(res.pLoanidcode)
          this.Loansnamescodeform.controls.pSeries.setValue(res.pSeries)
          this.Loansnamescodeform.controls.pSerieslength.setValue(res.pSerieslength)

          if (res.pStatusname == "Active") {
            this.Loansnamescodeform.controls.pStatusname.setValue("Active")
            this.Loansnamescodeform.controls.pStatusid.setValue("1")
          } else {
            this.Loansnamescodeform.controls.pStatusname.setValue("In-Active")
            this.Loansnamescodeform.controls.pStatusid.setValue("2")
          }


          let datatabledisplay = this.DisplayData
          this.DatatableDisplaydata = datatabledisplay.filter(function (loanname) {
            return loanname.pLoantype == res.pLoantype;
          });
          //sending data to datatable    
          this.CalDataTable(this.DatatableDisplaydata)
          this.loading = false;
        }

      }

    })
    this.Loansnamescodeform.controls.pStatusname.setValue("Active")
    this.Loansnamescodeform.controls.pStatusid.setValue("1")

    this._loanmasterservice._FindingValidationsBetweenComponents().subscribe(() => {

      this.submitted = true;

      if (this.Loansnamescodeform.valid) {
        let loantypeid = this.Loansnamescodeform.controls.pLoantypeid.value;
        let data = { "Loantype": this.LoanType, "Loanname": this.Loanname, "LoannameCode": this.Lnamecode, "pLoantypeid": loantypeid }
        this._loanmasterservice._SetLoanNameAndCodeToNextTab(data)
        this._loanmasterservice._addDataToLoanMaster(this.Loansnamescodeform.value, "loansnamecode");
        this._loanmasterservice._setValidationStatus(true);


      }
      else {

        this._loanmasterservice._setValidationStatus(false);
        let str = "loanname"
        $('.nav-item a[href="#' + str + '"]').tab('show');

      }


    });

  }
  get f() { return this.Loansnamescodeform.controls; }
  GenerateLoanCode(event) {

    if (this.buttontype != "Edit") {
      let loanname = event.currentTarget.value
      this.Loanname = loanname
      let loancode = ""
      if (this.Loansnamescodeform.controls.pLoanId.value != "" && this.Loansnamescodeform.controls.pLoanId.value != undefined) {
        this.checkloanid = this.Loansnamescodeform.controls.pLoanId.value
      }
      else {
        this.checkloanid = 0
      }
      let checkparamtype = "loanname"
      if (loanname != "" && loanname != " ") {
        this._loanmasterservice.CheckLoannameAndCodeDuplicate(loanname, loancode, checkparamtype, this.checkloanid).subscribe(count => {

          if (!count) {
            this.LNcode = ""
            let str = event.target.value
            if (str != "") {
              let a = str.split(' ')
              for (var i = 0; i < a.length; i++) {
                this.LNcode += a[i].charAt(0)
              }
              this.LNCcode = this.Lcode + this.LNcode
              this.Loansnamescodeform.controls.pLoancode.setValue(this.LNCcode)

              let loanname = ""
              let loancode = this.Loansnamescodeform.controls.pLoancode.value
              let checkparamtype = "loancode"
              if (this.Loansnamescodeform.controls.pLoanId.value != "" && this.Loansnamescodeform.controls.pLoanId.value != undefined) {
                this.checkloanid = this.Loansnamescodeform.controls.pLoanId.value
              }
              else {
                this.checkloanid = 0
              } if (loancode != "" && loancode != " ") {
                this._loanmasterservice.CheckLoannameAndCodeDuplicate(loanname, loancode, checkparamtype, this.checkloanid).subscribe(count => {

                  if (!count) {

                    if (this.Loansnamescodeform.controls.pLoanname.value != "") {
                      this.Lnamecode = this.LNCcode + this.Ccode + this.Bcode + this.Loansnamescodeform.controls.pSeries.value
                      this.Lnamecode = this.Lnamecode.toUpperCase();
                      let loantypeid = this.Loansnamescodeform.controls.pLoantypeid.value;
                      this.Loansnamescodeform.controls.pLoanidcode.setValue(this.Lnamecode.toUpperCase())
                      let data = { "Loantype": this.LoanType, "Loanname": this.Loanname, "LoannameCode": this.Lnamecode, "pLoantypeid": loantypeid }
                      this._loanmasterservice._SetLoanNameAndCodeToNextTab(data)
                    }
                  }
                  else {
                    alert("Loan Code Already Exists")
                    this.Loansnamescodeform.controls.pLoancode.setValue("")
                    this.Lnamecode = ""
                  }
                });
              }
            } else {
              this.Loansnamescodeform.controls.pLoanidcode.setValue("")
            }
          } else {
            alert("Loan Name Already Exists")
            this.Loansnamescodeform.controls.pLoanname.setValue("")
          }
        })
      }
    }
    else {
      let loanname = event.currentTarget.value
      let loancode = ""
      if (this.Loansnamescodeform.controls.pLoanId.value != "" && this.Loansnamescodeform.controls.pLoanId.value != undefined) {
        this.checkloanid = this.Loansnamescodeform.controls.pLoanId.value
      }
      else {
        this.checkloanid = 0
      }
      let checkparamtype = "loanname"
      if (loanname != "" && loanname != " ") {
        this._loanmasterservice.CheckLoannameAndCodeDuplicate(loanname, loancode, checkparamtype, this.checkloanid).subscribe(count => {

          if (!count) {
            this.LNcode = ""
            let str = event.target.value
            if (str != "") {
              let a = str.split(' ')
              for (var i = 0; i < a.length; i++) {
                this.LNcode += a[i].charAt(0)
              }
              this.LNCcode = this.Lcode + this.LNcode
              this.Loansnamescodeform.controls.pLoancode.setValue(this.LNCcode)

              let loanname = ""
              let loancode = this.Loansnamescodeform.controls.pLoancode.value
              let checkparamtype = "loancode"
              let loanid = this.Loansnamescodeform.controls.pLoanId.value
              if (loancode != "" && loancode != " ") {
                this._loanmasterservice.CheckLoannameAndCodeDuplicate(loanname, loancode, checkparamtype, this.checkloanid).subscribe(count => {

                  if (!count) {

                    if (this.Loansnamescodeform.controls.pLoanname.value != "") {
                      let loantypeid = this.Loansnamescodeform.controls.pLoantypeid.value;
                      this.Lnamecode = this.LNCcode + this.Ccode + this.Bcode + this.Loansnamescodeform.controls.pSeries.value
                      this.Loansnamescodeform.controls.pLoanidcode.setValue(this.Lnamecode.toUpperCase())
                      let data = { "Loantype": this.LoanType, "Loanname": this.Loanname, "LoannameCode": this.Lnamecode, "pLoantypeid": loantypeid }
                      this._loanmasterservice._SetLoanNameAndCodeToNextTab(data)
                    }
                  }
                  else {
                    alert("Loan Code Already Exists")
                    this.Loansnamescodeform.controls.pLoancode.setValue("")
                    this.Lnamecode = ""
                  }
                });
              }
            } else {
              this.Loansnamescodeform.controls.pLoanidcode.setValue("")
            }
          } else {
            alert("Loan Name Already Exists")
            this.Loansnamescodeform.controls.pLoanname.setValue("")
          }
        })
      }
    }

  }

  GenerateSeries(event) {

    let str = event.currentTarget.value
    if (str != "") {
      if (this.Loansnamescodeform.controls.pLoantypeid.value != "" && this.Loansnamescodeform.controls.pLoanname.value != "" && this.Loansnamescodeform.controls.pLoancode.value != "") {
        this.Lnamecode = this.Loansnamescodeform.controls.pLoancode.value + this.Ccode + this.Bcode + str
        this.Lnamecode = this.Lnamecode.toUpperCase();
        this.Loansnamescodeform.controls.pSerieslength.setValue(str.length)
        let loantypeid = this.Loansnamescodeform.controls.pLoantypeid.value;
        // this.Loansnamescodeform.controls.pCompanycode.setValue(this.Ccode)
        // this.Loansnamescodeform.controls.pBranchcode.setValue(this.Bcode)
        this.Loansnamescodeform.controls.pLoanidcode.setValue(this.Lnamecode)
        let data = { "Loantype": this.LoanType, "Loanname": this.Loanname, "LoannameCode": this.Lnamecode, "pLoantypeid": loantypeid }
        this._loanmasterservice._SetLoanNameAndCodeToNextTab(data)
      }
    }
  }

  ChangeLoanType(args) {

    this.Lcode = ""
    // let  = event.currentTarget.value
    let str = args.target.options[args.target.selectedIndex].text
    this.LoanType = str
    this.submitted = false
    this._loanmasterservice._SetLoanNameAndCodeToNextTab("")
    if (str != "") {
      let a = str.split(' ')
      for (var i = 0; i < a.length; i++) {
        this.Lcode += a[i].charAt(0)
      }
    }
    this.Loansnamescodeform.controls.pLoantype.setValue(str);

    this.Loansnamescodeform.controls.pLoanname.setValue("");
    this.Loansnamescodeform.controls.pLoancode.setValue("");
    // this.Loansnamescodeform.controls.pSeries.setValue("");
    this.Loansnamescodeform.controls.pLoanidcode.setValue("");
    this.Lnamecode = "";


    let datatabledisplay = this.DisplayData
    this.DatatableDisplaydata = datatabledisplay.filter(function (loanname) {
      return loanname.pLoantype == str;
    });

    //sending data to datatable    
    this.CalDataTable(this.DatatableDisplaydata)


  }

  Clear() {

    this.Loansnamescodeform.reset()
    this.Lnamecode = ""
    this.Loansnamescodeform.controls.pSeries.setValue("00001")
    //this.Loansnamescodeform.controls.loannamecode.setValue("")
    // this.Loansnamescodeform.controls.loantype.setValue("")
    this.Loansnamescodeform.controls.pStatusname.setValue("Active")
    this.Loansnamescodeform.controls.pStatusid.setValue("1")
    this.Loansnamescodeform.controls.pLoantypeid.setValue('')
    this.Loansnamescodeform.controls.pCompanycode.setValue(this.Ccode)
    this.Loansnamescodeform.controls.pBranchcode.setValue(this.Bcode)
    this.Loansnamescodeform.controls.pCreatedby.setValue(this._CommonService.pCreatedby)
    this.Loansnamescodeform.controls.pModifiedby.setValue(this._CommonService.pCreatedby)
    this.Loansnamescodeform.controls.pLoanId.setValue(0)
    this.Loansnamescodeform.controls.pSerieslength.setValue(5)
    this._loanmasterservice._SetLoanNameAndCodeToNextTab("")
  }


  NextTabClick() {
    debugger
    this.submitted = true;

    let loanname = ""
    let loancode = this.Loansnamescodeform.controls.pLoancode.value
    let loantypeid = this.Loansnamescodeform.controls.pLoantypeid.value;
    let checkparamtype = "loancode"
    if (this.Loansnamescodeform.controls.pLoanId.value != "" && this.Loansnamescodeform.controls.pLoanId.value != undefined) {
      this.checkloanid = this.Loansnamescodeform.controls.pLoanId.value
    }
    else {
      this.checkloanid = 0
    }
    //  this._loanmasterservice.CheckLoannameAndCodeDuplicate(loanname, loancode, checkparamtype).subscribe(count => {

    // if (count == 0) {
    if (this.Loansnamescodeform.valid) {
      debugger
      let data = { "Loantype": this.LoanType, "Loanname": this.Loanname, "LoannameCode": this.Lnamecode, "pLoantypeid": loantypeid }
      this._loanmasterservice._SetLoanNameAndCodeToNextTab(data)
      console.log("1-tab Data",this.Loansnamescodeform.value)
      this._loanmasterservice._addDataToLoanMaster(this.Loansnamescodeform.value, "loansnamecode");
      this._loanmasterservice._setValidationStatus(true);
      let str = "loanconfig"
      // this._loanmasterservice.SetSelectTitileInLoanCreation("Loan Configuration")
      this._loanmasterservice._SetSelectTitileInLoanCreation("Loan Configuration")
      $('.nav-item a[href="#' + str + '"]').tab('show');
    } else {
      this._loanmasterservice._setValidationStatus(false);
      let str = "loanname"
      // this._loanmasterservice.SetSelectTitileInLoanCreation("Loan Creation")
      this._loanmasterservice._SetSelectTitileInLoanCreation("Loan Creation")
      $('.nav-item a[href="#' + str + '"]').tab('show');


    }
    // }
    // else {
    //  alert("loan code already exists")
    //  this.Loansnamescodeform.controls.pLoancode.setValue("")
    //}
    // })

    if (this.buttontype != "New" && this.buttontype != undefined) {

      if (this.Loansnamescodeform.valid) {

        let data = { "Loantype": this.LoanType, "Loanname": this.Loanname, "LoannameCode": this.Lnamecode, "pLoantypeid": loantypeid }
        this._loanmasterservice._SetLoanNameAndCodeToNextTab(data)
        this._loanmasterservice._addDataToLoanMaster(this.Loansnamescodeform.value, "loansnamecode");
        this._loanmasterservice._setValidationStatus(true);
        let str = "loanconfig"
        //this._loanmasterservice.SetSelectTitileInLoanCreation("Loan Configuration")
        this._loanmasterservice._SetSelectTitileInLoanCreation("Loan Configuration")
        $('.nav-item a[href="#' + str + '"]').tab('show');
      } else {
        this._loanmasterservice._setValidationStatus(false);
        let str = "loanname"
        this._loanmasterservice._SetSelectTitileInLoanCreation("Loan Creation")
        $('.nav-item a[href="#' + str + '"]').tab('show');

      }

    } else {
      this._loanmasterservice.CheckLoannameAndCodeDuplicate(loanname, loancode, checkparamtype, this.checkloanid).subscribe(count => {
        if (!count) {
          if (this.Loansnamescodeform.valid) {
            let loantypeid = this.Loansnamescodeform.controls.pLoantypeid.value;
            let data = { "Loantype": this.LoanType, "Loanname": this.Loanname, "LoannameCode": this.Lnamecode, "pLoantypeid": loantypeid }
            this._loanmasterservice._SetLoanNameAndCodeToNextTab(data)
            this._loanmasterservice._addDataToLoanMaster(this.Loansnamescodeform.value, "loansnamecode");
            this._loanmasterservice._setValidationStatus(true);
            let str = "loanconfig"
            this._loanmasterservice._SetSelectTitileInLoanCreation("Loan Configuration")
            $('.nav-item a[href="#' + str + '"]').tab('show');
          } else {
            this._loanmasterservice._setValidationStatus(false);
            let str = "loanname"
            this._loanmasterservice.SetSelectTitileInLoanCreation("Loan Creation")
            $('.nav-item a[href="#' + str + '"]').tab('show');

          }
        }
        else {
          alert("Loan Code Already Exists")
          this.Loansnamescodeform.controls.pLoancode.setValue("")
        }
      })

    }



  }

  CheckStatus(event) {

    var id = event.currentTarget.id
    var name = event.currentTarget.value
    this.Loansnamescodeform.controls.pStatusname.setValue(name)
    this.Loansnamescodeform.controls.pStatusid.setValue(id)
  }


  ngOnDestroy() {

  }

  datatableclickedit(data) {



    let dt = data
    this.Loansnamescodeform.controls.pLoantypeid.setValue(dt.pLoantypeid)
    this.Loansnamescodeform.controls.pLoanname.setValue(dt.pLoanname)
    let str = dt.pLoantype
    if (str != "") {
      let a = str.split(' ')
      for (var i = 0; i < a.length; i++) {
        this.Lcode += a[i].charAt(0)
      }
    }
    this.Loansnamescodeform.controls.pLoancode.setValue(dt.pLoancode)
    this.Lnamecode = dt.pLoanidcode
    this.LoanType = dt.pLoantype
    this.Loanname = dt.pLoanname
  }

  CalDataTable(TableData) {
    let tablename = '#Transfer'

    if (this.DatatableInIt != null) {
      this.DatatableInIt.destroy();
    }

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

    $('#Transfer tbody').on('click', 'tr', function (e) {

      let ClickValue = e.target.id;
      if (ClickValue == "icon-edit" || ClickValue == "icon-delete") {
        var data = Newdatatable.row(this).data();
        window['CallingFunctionOutsideAngular'].componentFn(data)

      }
    });


  }

  CheckLoanCodeDuplicate() {

    if (this.buttontype != "Edit") {
      let loanname = ""
      if (this.Loansnamescodeform.controls.pLoanId.value != "" && this.Loansnamescodeform.controls.pLoanId.value != undefined) {
        this.checkloanid = this.Loansnamescodeform.controls.pLoanId.value
      }
      else {
        this.checkloanid = 0
      }
      let loancode = this.Loansnamescodeform.controls.pLoancode.value
      let checkparamtype = "loancode"
      if (loancode != "" && loancode != " ") {
        this._loanmasterservice.CheckLoannameAndCodeDuplicate(loanname, loancode, checkparamtype, this.checkloanid).subscribe(count => {

          if (count) {
            alert("Loan Code Already Exists")
            this.Loansnamescodeform.controls.pLoancode.setValue("")
          } else {
            if (this.Loansnamescodeform.controls.pLoanname.value != "") {
              this.Lnamecode = this.Loansnamescodeform.controls.pLoancode.value + this.Ccode + this.Bcode + this.Loansnamescodeform.controls.pSeries.value
              this.Lnamecode = this.Lnamecode.toUpperCase();
              this.Loansnamescodeform.controls.pLoanidcode.setValue(this.Lnamecode.toUpperCase())
              let loantypeid = this.Loansnamescodeform.controls.pLoantypeid.value;
              let data = { "Loantype": this.LoanType, "Loanname": this.Loanname, "LoannameCode": this.Lnamecode.toUpperCase(), "pLoantypeid": loantypeid }
              this._loanmasterservice._SetLoanNameAndCodeToNextTab(data)
            }
          }
        })
      }
    }
    else {
      let loanname = ""
      let loancode = this.Loansnamescodeform.controls.pLoancode.value
      let checkparamtype = "loancode"

      if (this.Loansnamescodeform.controls.pLoanId.value != "" && this.Loansnamescodeform.controls.pLoanId.value != undefined) {
        this.checkloanid = this.Loansnamescodeform.controls.pLoanId.value
      }
      else {
        this.checkloanid = 0
      }


      this.Lnamecode = this.Loansnamescodeform.controls.pLoancode.value.toUpperCase() + this.Ccode + this.Bcode + this.Loansnamescodeform.controls.pSeries.value
      this.Lnamecode = this.Lnamecode.toUpperCase();
      this.Loansnamescodeform.controls.pLoanidcode.setValue(this.Lnamecode.toUpperCase())
      let loantypeid = this.Loansnamescodeform.controls.pLoantypeid.value;
      let data = { "Loantype": this.LoanType, "Loanname": this.Loanname, "LoannameCode": this.Lnamecode, "pLoantypeid": loantypeid }
      this._loanmasterservice._SetLoanNameAndCodeToNextTab(data)

    }
  }

  trackByFn(index, item) {
    return item.id;
  }

}
