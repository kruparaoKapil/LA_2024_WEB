import { Component, OnInit, NgZone, ViewChild } from '@angular/core';

import { FormGroup, FormBuilder, AbstractControl, Validators, FormControl, FormArray } from '@angular/forms';
import { ChargemasterService } from '../../../../Services/Loans/Masters/chargemaster.service';
import { LoansmasterService } from '../../../../Services/Loans/Masters/loansmaster.service';
import { CommonService } from '../../../../Services/common.service'
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';
declare let $: any;
@Component({
    selector: 'app-chargeconfiguration-master',
    templateUrl: './chargeconfiguration-master.component.html',
    styles: []
})
export class ChargeconfigurationMasterComponent implements OnInit {
    editinfo: any;
    chargesForm: FormGroup;
    chargesTypesForm: FormGroup;
    chargesConfigForm: FormGroup;
    gstpercentagelist: any;

    lstChargeTypes: any;
    lstLoanTypes: any;
    lstLoanNames: any;
    lstChargeNames: any;
    lstChargesConfig: any;
    lstTotalChargesConfig: any;
    lstLoanVale: any;
    lstLaonTenure: any;
    lstApplicantTypes: any;
    lstLoanPayIns: any;

    chargesConfigErrorMessage: any;

    chargedetails = '';

    loanChargeTypeColumns: any;
    loanChargeAmountsColumns: any;
    loanChargeConfigColumns: any;

    loanChargeTypeDataTableInfo: any;
    loanChargeAmountsDataTableInfo: any;
    loanChargeConfigDataTableInfo: any;

    showChargeConfig = false;
    showChargeConfigDetails = false;
    showChargedependentOnLoanRange = false;
    showChargenotdependentOnLoanRange = false;
    public loading = false;
    showInclude = false;
    showExclude = false;
    showChargeTypeedit = true;

    showLoanChargeAmountsDataTable = false;
    showLoanChargeConfigDataTable = false;

    setMinLoanAmountorTenureName = 'Min Loan Value';
    setMaxLoanAmountorTenureName = 'Max Loan Value';


    disableexistingdata = false;
    loanAmountsData: any;

    editloanchargeid = 0;

    ChargeTypeRowIndex: any;
    chargeAmountRowIndex: any;
    chargeConfigRowIndex: any;
    chargeConfigButtonName = 'Add Charge'
    showChargeAmountButtons = true;
    showminormaxcharge = true;
    showChargeType = true;
    valuorTenureMaxLength = '9@0';
    newdaterecordstatus = 'NO';


    disablechargetypesavebutton = false;
    chargetypesavebutton = "Add and Save";

    disablechargeconfigsavebutton = false;
    chargeconfigsavebutton = "Submit";

    public pChargeEffectFromConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
    constructor(private datepipe: DatePipe, private zone: NgZone, private _commonService: CommonService, private _ChargemasterService: ChargemasterService, private formbuilder: FormBuilder, private _LoansmasterService: LoansmasterService, private toastr: ToastrService, private _routes: Router) {

        this.pChargeEffectFromConfig.containerClass = 'theme-dark-blue';
        this.pChargeEffectFromConfig.showWeekNumbers = false;
        this.pChargeEffectFromConfig.maxDate = new Date(); // raised by qc team ,bug no :68
        this.pChargeEffectFromConfig.dateInputFormat = 'DD/MM/YYYY';

        window['loanChargeTypedeleteDetails'] = {
            zone: this.zone,
            componentFn: (rowinfo) => this.loanChargeTypedeleteDetails(rowinfo),
            component: this,
        };
        window['loanChargeTypeAddDetails'] = {
            zone: this.zone,
            componentFn: (rowInfo) => this.loanChargeTypeAddDetails(rowInfo),
            component: this,
        };
        window['loanChargeAmountsdeleteDetails'] = {
            zone: this.zone,
            componentFn: (rowinfo) => this.loanChargeAmountsdeleteDetails(rowinfo),
            component: this,
        };
        window['loanChargeConfigdeleteDetails'] = {
            zone: this.zone,
            componentFn: (rowinfo) => this.loanChargeConfigdeleteDetails(rowinfo),
            component: this,
        };
        window['loanChargeConfigeditDetails'] = {
            zone: this.zone,
            componentFn: (rowinfo) => this.loanChargeConfigeditDetails(rowinfo),
            component: this,
        };
        window['currencyformat'] = {
            zone: this.zone,
            componentFn: (value) => this._commonService.currencyformat(value),
            component: this,
        };
    }

    ngOnInit() {
        this.getGstPercentages();
        this.chargesConfigErrorMessage = {};
        this.chargesForm = this.formbuilder.group({
            pLoanchargetypes: this.formbuilder.array([]),
            pLoanchargetypesConfig: this.formbuilder.array([]),
            pStatusname: [this._commonService.pStatusname],
            pCreatedby: [this._commonService.pCreatedby],

        })
        this.chargesTypesForm = this.addChargesTypesFormControls();
        this.chargesConfigForm = this.addChargesConfigFormControls();
        this.loadoanChargeTypeDataTableColumns();
        this.loadoanChargeAmountsDataTableColumns();
        this.loadoanChargeConfigDataTableColumns();

        this.loadoanChargeTypeDataTableData([]);
        this.loadoanChargeAmountsDataTableData([]);
        this.loadoanChargeConfigDataTableData([]);
        this.getLoanTypes();
        this.getChargeNames();
        document.getElementById("ChargeAmountsDataTable").style.display = "none";
        document.getElementById("ChargeConfigDataTable").style.display = "none";
        this.BlurEventAllControll(this.chargesTypesForm);
        this.BlurEventAllControll(this.chargesConfigForm);

        let date = new Date();
        this.chargesConfigForm['controls']['pChargeEffectFrom'].setValue(date);
        this.loadData();
    }

    loadData() {


        this.loadoanChargeTypeDataTableData([]);
        this.loadoanChargeAmountsDataTableData([]);
        this.loadoanChargeConfigDataTableData([]);
        this.editinfo = [];
        this.editinfo = this._ChargemasterService.getEditInformation();
        this._ChargemasterService.editinfo = [];
        if (this.editinfo != null) {
            if (this.editinfo.length > 0) {

                this.chargesTypesForm.patchValue(this.editinfo[0]);
                this.getApplicantTypes();
                this.getLoanPayIns(this.editinfo[0].pApplicanttype);
                this.loanChargeTypeDataTableInfo.row.add(this.editinfo[0]).draw().node();

                this.ChargeTypeRowIndex = 0;
                this.addorremovechargetypesclass();

                this.loadChargeConfigData(this.editinfo[0], 'EDIT');
                this.showChargeTypeedit = false;
            } else {
                this.showChargeTypeedit = true;
            }
        }
    }

    showErrorMessage(errormsg: string) {
        this._commonService.showErrorMessage(errormsg);
    }

    showInfoMessage(errormsg: string) {
        this._commonService.showInfoMessage(errormsg);
    }

    BlurEventAllControll(fromgroup: FormGroup) {

        try {

            Object.keys(fromgroup.controls).forEach((key: string) => {
                this.setBlurEvent(fromgroup, key);
            })

        }
        catch (e) {
            this.showErrorMessage(e);
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
            this.showErrorMessage(e);
            return false;
        }



    }

    addChargesTypesFormControls(): FormGroup {
        return this.formbuilder.group({
            pLoantype: ['', Validators.required],
            pLoantypeid: [''],
            pLoanNmae: ['', Validators.required],
            pLoanid: [''],
            pLoanChargeid: [''],
            pChargeid: [''],
            pChargename: ['', Validators.required],
            pStatusname: [this._commonService.pStatusname],
            pCreatedby: [this._commonService.pCreatedby],
        })
    }

    addChargesConfigFormControls(): FormGroup {
        return this.formbuilder.group({
            precordid: [''],
            ptypeofoperation: [''],
            pLoantype: [''],
            pLoantypeid: [''],
            pLoanNmae: [''],
            pLoanid: [''],
            pLoanChargeid: [''],

            pChargename: [''],
            pChargecalonfield: ['', Validators.required], //Sanctioned Loan amount OR Disbursed Loan amount
            pIsChargedependentOnLoanRange: ['', Validators.required], // Charge is Dependent on loan range Or NOT
            pLoanpayin: ['', Validators.required],
            pApplicanttype: ['', Validators.required],
            pIschargerangeapplicableonvalueortenure: [''],//On Value OR On Tenure
            pMinLoanAmountorTenure: [''],// Min Loan Amount, Min Loan Tenure 
            pMaxLoanAmountorTenure: [''],// Max Loan Amount, Max Loan Tenure , Charge Amount(if Charge is Dependent not on loan range)
            pLoanAmountorTenure: [], // Combination Of ( Min Loan Amount, Min Loan Tenure --> Max Loan Amount, Max Loan Tenure )
            pChargePercentage: [''],
            pChargeTypePercentage: [''],
            // Charge Percentage
            pMinchargesvalue: [''],// Min Charge Amount, Charge Amount(if Charge is Dependent not on loan range)
            pMaxchargesvalue: [''],// Max Charge Amount, Charge Amount(if Charge is Dependent not on loan range)
            pChargeAmount: [''],// Combination Of ( Min Charge Amount, Charge Amount(if Charge is Dependent not on loan range) --> Max Charge Amount, Charge Amount(if Charge is Dependent not on loan range) )


            pGsttype: [''], //GST Type
            pGstvalue: [''],// Gst Percentage

            pIstaxapplicable: [''],// Tax Applicable Or Not

            pChargevaluefixedorpercentage: [''],//Charge Type (FIXED/PERCENTAGE)

            pChargeEffectFrom: ['', Validators.required],
            pChargeEffectTo: [''],
            pIschargewaivedoff: [''],

            pStatusname: [this._commonService.pStatusname],
            pCreatedby: [this._commonService.pCreatedby],
            peditstatus: ['NO'],
        })
    }
    trackByFn(index, item) {
        return index; // or item.id
    }

    loadoanChargeTypeDataTableColumns(): void {
        this.loanChargeTypeColumns = [
            {
                "title": "S.No.", "data": null,
                render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            { "title": "Loan Charge ID", "data": "pLoanChargeid", "visible": false, className: 'pLoanChargeid' },
            { "title": "Loan Type ID", "data": "pLoantypeid", "visible": false, className: 'pLoantypeid' },
            { "title": "Loan Type", "data": "pLoantype", className: 'pLoantype' },
            { "title": "Loan ID", "data": "pLoanid", "visible": false, className: 'pLoanid' },
            { "title": "Loan Name", "data": "pLoanNmae", className: 'pLoanNmae' },

            { "title": "Charge / Fee", "data": "pChargename", className: 'pChargename' },
            {
                "title": "", "data": "null", "mData": null,
                "bSortable": false,
                "mRender": function (data, type, full) {
                    return '<a class="btn btn-lg-icon pt-1 pb-0 pr-2 ml-1"  role="button" aria-expanded="true" aria-controls="family"><div id="icon-edit-config" class="ml-0"></div><span style="padding:2px; position:relative; top:-5px;"> Config </span> </a>';
                }
            },
            {
                "title": "", "data": "null", "mData": null,
                "bSortable": false,
                "mRender": function (data, type, full) {
                    return '<a><div id ="icon-delete"></div></a>';
                }
            },
        ];
    }
    loadoanChargeTypeDataTableData(jasonData): void {

        //console.log(json)
        if (jasonData != null) {

            //this.lstContactTotalDetails = json as string
            //this.lstContactTotalDetails = eval("(" + this.lstContactTotalDetails + ')');
            //this.lstContactTotalDetails = this.lstContactTotalDetails.FT;

            let tablename = '#loanChargeTypeDataTable'
            if (this.loanChargeTypeDataTableInfo != null) {
                this.loanChargeTypeDataTableInfo.destroy();
            }
            $('#loanChargeTypeDataTable tbody').off('click', 'tr');
            this.loanChargeTypeDataTableInfo = $(tablename).DataTable({
                language: { searchPlaceholder: "Search Contact", search: "" },
                "bDestroy": true,
                'columnDefs': [
                    {
                        'targets': 0,
                        'checkboxes': {
                            'selectRow': true
                        }
                    }
                ],
                "processing": true,
                "bPaginate": false,
                "bInfo": false,
                "bFilter": false,
                //"Sort":false,
                //"bSort": false,
                'select': {
                    'style': 'multi',
                },
                responsive: true,
                data: jasonData,
                dom: 'Bfrtip',
                columns: this.loanChargeTypeColumns,
                initComplete: function () {
                    var $buttons = $('.dt-buttons').hide();
                }
            });
            let dataTableInfo = this.loanChargeTypeDataTableInfo

            $('#loanChargeTypeDataTable tbody').on('click', 'tr', function (e) {

                let ClickValue = e.target.id;
                //let row = this.loanChargeTypeDataTableInfo.row(this);



                if (ClickValue == "icon-delete") {

                    window['loanChargeTypedeleteDetails'].componentFn(this)
                }

                if (ClickValue == "icon-edit-config") {

                    window['loanChargeTypeAddDetails'].componentFn(this)

                }
            });
        }


    }
    loanChargeTypedeleteDetails(rowinfo) {

        let rowIndex = this.loanChargeTypeDataTableInfo.row(rowinfo).index();
        let data = this.loanChargeTypeDataTableInfo.row(rowinfo).data();
        let chargeTypeDetails = {
            'precordid': 0, 'pCreatedby': this._commonService.pCreatedby, 'pStatusname': 'IN-ACTIVE', 'pLoanid': data.pLoanid, 'pLoanChargeid': data.pLoanChargeid
        }
        let jsonData = JSON.stringify(chargeTypeDetails);
        this._ChargemasterService.deleteLoanChargeType(jsonData).subscribe(json => {

            //console.log(json)
            if (json != null) {

                this.loanChargeTypeDataTableInfo.rows(rowinfo).remove().draw();
                let loanChargeConfigData = this.loanChargeConfigDataTableInfo.rows().data();

                if (loanChargeConfigData != null) {

                    if (loanChargeConfigData.length > 0) {
                        loanChargeConfigData = loanChargeConfigData.filter(function (loanname) {
                            return loanname.pLoanChargeid != data.pLoanChargeid;
                        });


                        this.loadoanChargeConfigDataTableData(loanChargeConfigData);
                        this.clearLoanChargeTypesConfig();
                    }
                    else {
                        this.showChargeConfig = false;
                        document.getElementById("ChargeAmountsDataTable").style.display = "none";
                        document.getElementById("ChargeConfigDataTable").style.display = "none";
                    }
                }
                else {

                    this.showChargeConfig = false;
                    document.getElementById("ChargeAmountsDataTable").style.display = "none";
                    document.getElementById("ChargeConfigDataTable").style.display = "none";
                }

                ////this.lstLoanNames = json;
                ////this.titleDetails = json as string
                ////this.titleDetails = eval("(" + this.titleDetails + ')');
                ////this.titleDetails = this.titleDetails.FT;
                //this.getLoanChargeTypes(data.pLoanid);
            }
        },
            (error) => {

                this.showErrorMessage(error);
            });

    }
    loanChargeTypeAddDetails(rowInfo) {

        try {
            let rowIndex = this.loanChargeTypeDataTableInfo.row(rowInfo).index();

            let data = this.loanChargeTypeDataTableInfo.row(rowInfo).data();

            this.ChargeTypeRowIndex = rowIndex;
            this.addorremovechargetypesclass();

            this.loadChargeConfigData(data, 'SAVE');
            //disabledependentloanrange
        } catch (e) {
            this._commonService.showErrorMessage(e);
        }
    }
    addorremovechargetypesclass() {
        var table = $('#loanChargeTypeDataTable').DataTable();

        let totalloanChargeTypeDataTable = this.loanChargeTypeDataTableInfo.rows().data();

        for (let i = 0; i < totalloanChargeTypeDataTable.length; i++) {
            if (i == this.ChargeTypeRowIndex) {
                table.row(i).nodes().to$().addClass('chargeconfig-rowselection');
            }
            else {
                table.row(i).nodes().to$().removeClass('chargeconfig-rowselection');
            }
        }
    }
    loadChargeConfigData(data, type) {
        debugger;
        this.chargesConfigForm.patchValue(data);
        this.clearLoanChargeTypesAmountsAllControls();
        this.loanAmountsData = data;
        this.chargedetails = data.pLoantype + '-' + data.pLoanNmae + '-' + data.pChargename;

        let loanChargeConfigData = this.loanChargeConfigDataTableInfo.rows().data();
        loanChargeConfigData = loanChargeConfigData.filter(x => x.pLoanChargeid == data.pLoanChargeid)
        if (loanChargeConfigData.length == 0) {
            this.editloanchargeid = data.pLoanChargeid;
            this.getLoanChargeConfig(data.pLoanChargeid, type)
        }
    }

    loadoanChargeAmountsDataTableColumns(): void {
        this.loanChargeAmountsColumns = [
            {
                "title": "S.No.", "data": null,
                render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            { "title": "Record Id", "data": "precordid", "visible": false, className: 'precordid' },
            { "title": "type Of Operation", "data": "ptypeofoperation", "visible": false, className: 'ptypeofoperation' },
            { "title": "Loan Charge ID", "data": "pLoanChargeid", "visible": false, className: 'pLoanChargeid' },
            { "title": "Loan Type ID", "data": "pLoantypeid", "visible": false, className: 'pLoantypeid' },
            { "title": "Loan Type", "data": "pLoantype", "visible": false, className: 'pLoantype' },
            { "title": "Loan ID", "data": "pLoanid", "visible": false, className: 'pLoanid' },
            { "title": "Loan Name", "data": "pLoanNmae", "visible": false, className: 'pLoanNmae' },

            { "title": "Charge / Fee", "data": "pChargename", "visible": false, className: 'pChargename' },

            { "title": "Dependent on Loan Range", "data": "pIsChargedependentOnLoanRange", "visible": false, className: 'pIsChargedependentOnLoanRange' },
            { "title": "Applicant Type", "data": "pApplicanttype", className: 'pApplicanttype' },
            { "title": "Loan pay-in", "data": "pLoanpayin", className: 'pLoanpayin' },
            { "title": "Charge Applicable On", "data": "pIschargerangeapplicableonvalueortenure", "visible": false, className: 'pIschargerangeapplicableonvalueortenure' },
            {
                "title": "Min. Loan Value / Tenure", "data": "pMinLoanAmountorTenure", className: 'pMinLoanAmountorTenure text-right', "render": function (data) {

                    return window['currencyformat'].componentFn(data)
                }
            },
            {
                "title": "Max. Loan Value / Tenure", "data": "pMaxLoanAmountorTenure", className: 'pMaxLoanAmountorTenure text-right', "render": function (data) {
                    return window['currencyformat'].componentFn(data)
                }
            },
            { "title": "Value / Tenure", "data": "pLoanAmountorTenure", "visible": false, className: 'pLoanAmountorTenure text-right' },

            { "title": "Charge / Fee Type", "data": "pChargevaluefixedorpercentage", "visible": false, className: 'pChargevaluefixedorpercentage' },

            { "title": "Percentage (%)", "data": "pChargePercentage", className: 'text-right pChargePercentage' },
            {
                "title": "Min. Charge / Fee", "data": "pMinchargesvalue", className: 'pMinchargesvalue text-right', "render": function (data) {
                    return window['currencyformat'].componentFn(data)
                }
            },
            {
                "title": "Max. Charge / Fee", "data": "pMaxchargesvalue", className: 'pMaxchargesvalue text-right', "render": function (data) {
                    return window['currencyformat'].componentFn(data)
                }
            },
            { "title": "Min - Max. Charge / Fee", "data": "pChargeAmount", "visible": false, className: 'pChargeAmount text-right' },
            { "title": "Charge Calculated", "data": "pChargecalonfield", "visible": false, className: 'pChargecalonfield' },

            { "title": "GST Type", "data": "pGsttype", "visible": false, className: 'pGsttype' },
            { "title": "GST Percentage (%)", "data": "pGstvalue", "visible": false, className: 'pGstvalue text-right' },
            {
                "title": "", "data": "null", "mData": null,
                "bSortable": false,
                "mRender": function (data, type, full) {
                    return '<a  src=""><div id="icon-delete"></div></a>';
                }
            }
        ];
    }
    loadoanChargeAmountsDataTableData(jasonData): void {

        //console.log(json)
        if (jasonData != null) {

            //this.lstContactTotalDetails = json as string
            //this.lstContactTotalDetails = eval("(" + this.lstContactTotalDetails + ')');
            //this.lstContactTotalDetails = this.lstContactTotalDetails.FT;

            let tablename = '#loanChargeAmountsDataTable'
            if (this.loanChargeAmountsDataTableInfo != null) {
                this.loanChargeAmountsDataTableInfo.destroy();
            }
            $('#loanChargeAmountsDataTable tbody').off('click', 'tr');
            this.loanChargeAmountsDataTableInfo = $(tablename).DataTable({
                language: { searchPlaceholder: "Search Contact", search: "" },
                "bDestroy": true,
                'columnDefs': [
                    {
                        'targets': 0,
                        'checkboxes': {
                            'selectRow': true
                        }
                    }
                ],
                "processing": true,
                "bPaginate": false,
                "bInfo": false,
                "bFilter": false,
                //"Sort":false,
                //"bSort": false,
                'select': {
                    'style': 'multi',
                },
                responsive: true,
                data: jasonData,
                dom: 'Bfrtip',
                columns: this.loanChargeAmountsColumns,
                initComplete: function () {
                    var $buttons = $('.dt-buttons').hide();
                }
            });
            let dataTableInfo = this.loanChargeAmountsDataTableInfo

            $('#loanChargeAmountsDataTable tbody').on('click', 'tr', function (e) {

                let ClickValue = e.target.id;
                if (ClickValue == "icon-delete") {
                    window['loanChargeAmountsdeleteDetails'].componentFn(this);

                }
            });
        }


    }

    loanChargeAmountsdeleteDetails(rowinfo) {

        try {


            let rowIndex = this.loanChargeConfigDataTableInfo.row(rowinfo).index();
            this.loanChargeConfigDataTableInfo.rows(rowinfo).remove().draw();
            let loanChargeAmountsData = this.loanChargeAmountsDataTableInfo.rows().data();
            if (loanChargeAmountsData != null) {
                if (loanChargeAmountsData.length > 0) {
                    loanChargeAmountsData.splice(rowIndex, 1);
                    this.loadoanChargeAmountsDataTableData(loanChargeAmountsData);
                    if (loanChargeAmountsData.length == 0) {
                        this.clearLoanChargeTypesAmounts();
                    }
                }
            }
        } catch (e) {
            this._commonService.showErrorMessage(e);
        }
    }

    loadoanChargeConfigDataTableColumns(): void {
        this.loanChargeConfigColumns = [
            {
                "title": "S.No.", "data": null,
                render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            { "title": "Record Id", "data": "precordid", "visible": false, className: 'precordid' },
            { "title": "type Of Operation", "data": "ptypeofoperation", "visible": false, className: 'ptypeofoperation' },

            { "title": "Loan Charge ID", "data": "pLoanChargeid", "visible": false, className: 'pLoanChargeid' },
            { "title": "Loan Type ID", "data": "pLoantypeid", "visible": false, className: 'pLoantypeid' },
            { "title": "Loan Type", "data": "pLoantype", className: 'pLoantype' },
            { "title": "Loan ID", "data": "pLoanid", "visible": false, className: 'pLoanid' },
            { "title": "Loan Name", "data": "pLoanNmae", className: 'pLoanNmae' },

            { "title": "Charge / Fee", "data": "pChargename", className: 'pChargename' },

            { "title": "Dependent on Loan Range", "data": "pIsChargedependentOnLoanRange", className: 'pIsChargedependentOnLoanRange' },
            { "title": "Applicant Type", "data": "pApplicanttype", className: 'pApplicanttype' },
            { "title": "Loan pay-in", "data": "pLoanpayin", className: 'pLoanpayin' },
            { "title": "Charge Applicable On", "data": "pIschargerangeapplicableonvalueortenure", className: 'pIschargerangeapplicableonvalueortenure' },
            {
                "title": "Min. Loan Value", "data": "pMinLoanAmountorTenure", className: 'pMinLoanAmountorTenure text-right', "render": function (data) {
                    return window['currencyformat'].componentFn(data)
                }
            },
            {
                "title": "Max. Loan Value", "data": "pMaxLoanAmountorTenure", className: 'pMaxLoanAmountorTenure text-right', "render": function (data) {
                    return window['currencyformat'].componentFn(data)
                }
            },
            //{ "title": "Value / Tenure", "data": "pLoanAmountorTenure", "visible": false, className: 'pLoanAmountorTenure' },

            { "title": "Charge / Fee Type", "data": "pChargevaluefixedorpercentage", className: 'pChargevaluefixedorpercentage' },

            { "title": "Percentage (%)", "data": "pChargePercentage", className: 'text-right pChargePercentage' },
            {
                "title": "Min. Charge / Fee", "data": "pMinchargesvalue", className: 'pMinchargesvalue text-right', "render": function (data) {
                    return window['currencyformat'].componentFn(data)
                }
            },
            {
                "title": "Max. Charge / Fee", "data": "pMaxchargesvalue", className: 'pMaxchargesvalue text-right', "render": function (data) {
                    return window['currencyformat'].componentFn(data)
                }
            },
            //{ "title": "Min - Max. Charge / Fee", "data": "pChargeAmount", "visible": false, className: 'pChargeAmount' },
            { "title": "Charge Calculated", "data": "pChargecalonfield", className: 'pChargecalonfield' },

            { "title": "GST Type", "data": "pGsttype", className: 'pGsttype' },
            { "title": "GST Percentage (%)", "data": "pGstvalue", className: 'pGstvalue text-right' },
            { "title": "Effective From", "data": "pChargeEffectFrom", className: 'pChargeEffectFrom' },
            { "title": "Effective To", "data": "pChargeEffectTo", className: 'pChargeEffectTo' },
            { "title": "Edit Status", "data": "peditstatus", "visible": false, className: 'pChargeEffectTo' },
            {

                "title": "", "data": "null", "mData": null,
                "bSortable": false,
                "mRender": function (data, type, full) {

                    if (data.peditstatus == 'YES') {
                        return '<a  src=""><div id="icon-edit"></div></a> '
                    }
                    else {
                        return '';
                    }
                }
            },
            {
                "title": "", "data": "configdelete", "mData": null,
                "bSortable": false,
                "mRender": function (data, type, full) {
                    return '<a  src=""><div id="icon-delete"></div></a>';
                }
            }
        ];
    }

    loadoanChargeConfigDataTableData(jasonData): void {

        //console.log(json)
        if (jasonData != null) {

            //this.lstContactTotalDetails = json as string
            //this.lstContactTotalDetails = eval("(" + this.lstContactTotalDetails + ')');
            //this.lstContactTotalDetails = this.lstContactTotalDetails.FT;

            let tablename = '#loanChargeConfigDataTable'
            if (this.loanChargeConfigDataTableInfo != null) {
                this.loanChargeConfigDataTableInfo.destroy();
            }
            $('#loanChargeConfigDataTable tbody').off('click', 'tr');
            this.loanChargeConfigDataTableInfo = $(tablename).DataTable({
                language: { searchPlaceholder: "Search Contact", search: "" },
                "bDestroy": true,
                'columnDefs': [
                    {
                        'targets': 0,
                        'checkboxes': {
                            'selectRow': true
                        }
                    }
                ],
                "processing": true,
                "bPaginate": false,
                "bInfo": false,
                "bFilter": false,
                //"Sort":false,
                //"bSort": false,
                'select': {
                    'style': 'multi',
                },
                responsive: true,
                data: jasonData,
                dom: 'Bfrtip',
                columns: this.loanChargeConfigColumns,
                initComplete: function () {
                    var $buttons = $('.dt-buttons').hide();
                }
            });
            let dataTableInfo = this.loanChargeConfigDataTableInfo

            $('#loanChargeConfigDataTable tbody').on('click', 'tr', function (e) {


                let ClickValue = e.target.id;
                var column = dataTableInfo.column($(this).attr('configdelete'));

                var table = $('#loanChargeConfigDataTable').DataTable();
                if ($(this).hasClass('selected')) {
                    $(this).removeClass('selected');
                }
                else {
                    table.$('tr.selected').removeClass('selected');
                    $(this).addClass('selected');
                }

                if (ClickValue == "icon-delete") {
                    let status = window['loanChargeConfigdeleteDetails'].componentFn(this);

                }
                if (ClickValue == "icon-edit") {
                    column.visible(false);
                    window['loanChargeConfigeditDetails'].componentFn(this)
                }
            });

        }


    }
    loanChargeConfigdeleteDetails(rowinfo): any {

        let rowIndex = this.loanChargeConfigDataTableInfo.row(rowinfo).index();
        let data = this.loanChargeConfigDataTableInfo.row(rowinfo).data();

        let status = false;
        if (data.ptypeofoperation != 'CREATE') {
            let chargeTypeDetails = {
                'precordid': data.precordid, 'pCreatedby': this._commonService.pCreatedby, 'pStatusname': 'IN-ACTIVE', 'pLoanid': data.pLoanid, 'pLoanChargeid': data.pLoanChargeid
            }
            let jsonData = JSON.stringify(chargeTypeDetails);

            this._ChargemasterService.deleteLoanChargeType(jsonData).subscribe((json: Response) => {

                if (json) {
                    this.loanChargeConfigDataTableInfo.rows(rowinfo).remove().draw();
                    this.clearLoanChargeTypesConfig();
                }
            },
                (error) => {

                    this.showErrorMessage(error);
                });
        }
        else {
            this.loanChargeConfigDataTableInfo.rows(rowinfo).remove().draw();
            this.clearLoanChargeTypesConfig();
        }
        return status;
    }
    loanChargeConfigeditDetails(rowinfo) {

        let rowIndex = this.loanChargeConfigDataTableInfo.row(rowinfo).index();
        let data = this.loanChargeConfigDataTableInfo.row(rowinfo).data();
        this.chargeConfigRowIndex = rowIndex;
        this.chargeConfigButtonName = 'Update Charge';
        this.showChargeAmountButtons = false;
        this.chargesConfigForm.patchValue(data);

        this.getLoanPayIns(data.pApplicanttype);
        let date = this._commonService.formatDateFromDDMMYYYY(data.pChargeEffectFrom);
        this.chargesConfigForm['controls']['pChargeEffectFrom'].setValue(date);

        this.chargesConfigForm['controls']['pChargeTypePercentage'].setValue(data.pChargePercentage);
        this.chargesConfigForm['controls']['pChargeAmount'].setValue(data.pMinchargesvalue);


        //this.loanChargeConfigDataTableInfo.row(rowinfo).cells['configdelete'].style.display = " pointer-events: none;";
        //document.getElementById("icon-delete").style.display = "none";
        this.chargedependentOnLoanRangeChange('EDIT');
        this.taxTypeChange();
        this.chargeTypeChange();
        //this.chargeApplicableOnChange();  
        document.getElementById("ChargeAmountsDataTable").style.display = "none";

        this.addorremovechargeConfigclass();

    }

    addorremovechargeConfigclass() {

        var table = $('#loanChargeConfigDataTable').DataTable();

        let totalloanChargeconfigDataTable = this.loanChargeConfigDataTableInfo.rows().data();

        for (let i = 0; i < totalloanChargeconfigDataTable.length; i++) {

            if (this.chargeConfigRowIndex != null) {
                if (i == this.chargeConfigRowIndex) {
                    table.row(i).nodes().to$().addClass('chargeconfig-rowselection');
                }
                else {
                    table.row(i).nodes().to$().removeClass('chargeconfig-rowselection');
                }
            }
            else {
                table.row(i).nodes().to$().removeClass('chargeconfig-rowselection');
            }
        }
    }

    getLoanTypes(): void {

        this._LoansmasterService.GetLoanMasterLoantypes().subscribe(json => {

            //console.log(json)
            if (json != null) {
                this.lstLoanTypes = json
                //this.titleDetails = json as string
                //this.titleDetails = eval("(" + this.titleDetails + ')');
                //this.titleDetails = this.titleDetails.FT;
            }
        },
            (error) => {

                this.showErrorMessage(error);
            });

    }
    getGstPercentages(): void {

        this._LoansmasterService.getGstPercentages().subscribe(json => {

            //console.log(json)
            if (json != null) {
                this.gstpercentagelist = json;

                this.gstpercentagelist = this.gstpercentagelist.filter(x => x.pgstpercentage > 0)

                this.gstpercentagelist = this.gstpercentagelist.filter(x => x.pGstvalue = x.pgstpercentage)
            }
        },
            (error) => {

                this.showErrorMessage(error);
            });

    }
    pLoantype_Change($event: any): void {

        this.loadoanChargeTypeDataTableData([]);
        this.lstLoanNames = [];
        this.chargesTypesForm['controls']['pLoanid'].setValue('');
        this.chargesTypesForm['controls']['pLoanNmae'].setValue('');
        this.chargesTypesForm['controls']['pChargename'].setValue('');
        this.chargesTypesForm['controls']['pChargeid'].setValue('');
        this.chargesConfigErrorMessage['pChargename'] = '';
        this.showChargeConfig = false;
        document.getElementById("ChargeAmountsDataTable").style.display = "none";
        document.getElementById("ChargeConfigDataTable").style.display = "none";
        const loanTypeId = $event.target.value;
        if (loanTypeId && loanTypeId != '') {
            const loanType = $event.target.options[$event.target.selectedIndex].text;
            this.chargesTypesForm['controls']['pLoantype'].setValue(loanType);
            this.getLoanNames(loanTypeId);
        }
        else {
            this.chargesTypesForm['controls']['pLoantype'].setValue('');
        }
        this.chargesConfigErrorMessage = {};
    }
    getLoanNames(loanTypeId): void {

        this._LoansmasterService.getLoanMasterLoanNames(loanTypeId).subscribe(json => {
debugger;
            //console.log(json)
            if (json != null) {
                this.lstLoanNames = json
                //this.titleDetails = json as string
                //this.titleDetails = eval("(" + this.titleDetails + ')');
                //this.titleDetails = this.titleDetails.FT;
            }
        },
            (error) => {

                this.showErrorMessage(error);
            });

    }

    pLoanNmae_Change($event: any): void {
        debugger;
        this.loadoanChargeTypeDataTableData([]);
        this.chargesTypesForm['controls']['pChargeid'].setValue('');
        this.chargesTypesForm['controls']['pChargename'].setValue('');
        this.chargesConfigErrorMessage['pChargename'] = '';
        document.getElementById("ChargeAmountsDataTable").style.display = "none";
        document.getElementById("ChargeConfigDataTable").style.display = "none";
        const pLoanid = $event.target.value;
        if (pLoanid && pLoanid != '') {
            const loanName = $event.target.options[$event.target.selectedIndex].text;
            this.chargesTypesForm['controls']['pLoanNmae'].setValue(loanName);

            this.getApplicantTypes();

            this.getLoanChargeTypes(pLoanid);
        }
        else {
            this.chargesTypesForm['controls']['pLoanNmae'].setValue('');
        }
    }
    pChargename_Change($event: any): void {
        const pChargeid = $event.target.value;
        if (pChargeid && pChargeid != '') {
            const Chargename = $event.target.options[$event.target.selectedIndex].text;
            this.chargesTypesForm['controls']['pChargename'].setValue(Chargename);

        }
        else {
            this.chargesTypesForm['controls']['pChargename'].setValue('');
        }
    }

    getLoanChargeTypes(pLoanid): void {

        this._ChargemasterService.getLoanChargeTypes(pLoanid).subscribe(json => {
   debugger;
            //console.log(json)
            if (json != null) {
                this.lstChargeTypes = json;
                this.loadoanChargeTypeDataTableData(this.lstChargeTypes)
                //this.titleDetails = json as string
                //this.titleDetails = eval("(" + this.titleDetails + ')');
                //this.titleDetails = this.titleDetails.FT;
            }
        },
            (error) => {

                this.showErrorMessage(error);
            });
    }
    getLoanChargeConfig(pLoanChargeid, type): void {

        this._ChargemasterService.getLoanChargeConfig(pLoanChargeid).subscribe(json => {


            if (json != null) {
                for (let i = 0; i < json.length; i++) {

                    this.loanChargeConfigDataTableInfo.row.add(json[i]).draw().node();
                }

                if (json.length > 0) {
                    this.chargesConfigForm['controls']['pChargecalonfield'].setValue(json[0].pChargecalonfield);
                    this.chargesConfigForm['controls']['pIsChargedependentOnLoanRange'].setValue(json[0].pIsChargedependentOnLoanRange);
                    this.chargesConfigForm['controls']['pIschargerangeapplicableonvalueortenure'].setValue(json[0].pIschargerangeapplicableonvalueortenure);
                    this.chargesConfigForm['controls']['pChargevaluefixedorpercentage'].setValue(json[0].pChargevaluefixedorpercentage);
                    this.chargesConfigForm['controls']['pGsttype'].setValue(json[0].pGsttype);
                    this.disableexistingdata = true;
                    this.chargedependentOnLoanRangeChange(type);
                    this.chargeApplicableOnChange();

                    this.taxTypeChange();
                    this.chargeTypeChange();
                }
                else {
                    if (type == 'EDIT') {
                        this.showChargeConfig = false;
                        document.getElementById("ChargeAmountsDataTable").style.display = "none";
                        document.getElementById("ChargeConfigDataTable").style.display = "none";
                    }
                }
            }
        },
            (error) => {

                this.showErrorMessage(error);
            });
    }
    getChargeNames(): void {

        this._ChargemasterService.getChargeNames('ACTIVE').subscribe(json => {

            //console.log(json)
            if (json != null) {
                this.lstChargeNames = json
                //this.titleDetails = json as string
                //this.titleDetails = eval("(" + this.titleDetails + ')');
                //this.titleDetails = this.titleDetails.FT;
            }
        },
            (error) => {

                this.showErrorMessage(error);
            });

    }
    getApplicantTypes(): void {

        let loanid = this.chargesTypesForm.controls.pLoanid.value;

        this._ChargemasterService.GetApplicanttypes(loanid).subscribe(json => {
   debugger;
            //console.log(json)
            if (json != null) {
                this.lstApplicantTypes = json
                //this.titleDetails = json as string
                //this.titleDetails = eval("(" + this.titleDetails + ')');
                //this.titleDetails = this.titleDetails.FT;
            }
        },
            (error) => {

                this.showErrorMessage(error);
            });

    }
    getLoanPayIns(applicanttype): void {

        let loanid = this.chargesTypesForm.controls.pLoanid.value;
        this._ChargemasterService.getLoanpayins(loanid, applicanttype).subscribe(json => {

            //console.log(json)
            if (json != null) {
                this.lstLoanPayIns = json
                //this.titleDetails = json as string
                //this.titleDetails = eval("(" + this.titleDetails + ')');
                //this.titleDetails = this.titleDetails.FT;
            }
        },
            (error) => {

                this.showErrorMessage(error);
            });

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

            if (formcontrol) {
                if (formcontrol instanceof FormGroup) {
                    this.checkValidations(formcontrol, isValid)
                }
                else if (formcontrol.validator) {
                    this.chargesConfigErrorMessage[key] = '';
                    if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
                        let lablename;

                        //if (key == 'pTitleName')
                        //  lablename = 'Title';
                        //else
                        lablename = (document.getElementById(key) as HTMLInputElement).title;
                        let errormessage;

                        for (const errorkey in formcontrol.errors) {
                            if (errorkey) {
                                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                                this.chargesConfigErrorMessage[key] += errormessage + ' ';
                                isValid = false;
                            }
                        }

                    }
                }
            }
        }
        catch (e) {
            //this.showErrorMessage(key);

            this.disablechargetypesavebutton = false;
            this.chargetypesavebutton = "Add and Save";

            this.disablechargeconfigsavebutton = false;
            this.chargeconfigsavebutton = "Submit";
            return false;
        }
        return isValid;
    }
    validateLoanChargeTypes(): boolean {
debugger;
        let isValid: boolean = true;
        try {
            isValid = this.checkValidations(this.chargesTypesForm, isValid)
            let chargename = this.chargesTypesForm.controls.pChargename.value;
            let loanType = this.chargesTypesForm.controls.pLoantype.value;

            let loanNmae = this.chargesTypesForm.controls.pLoanNmae.value;
            let griddata = this.loanChargeTypeDataTableInfo.rows().data();

            let count = 0;
            if (griddata != null) {
                for (let i = 0; i < griddata.length; i++) {
                    if (griddata[i].pChargename == chargename && griddata[i].pLoantype == loanType && griddata[i].pLoanNmae == loanNmae) {
                        count = 1;
                        break;
                    }

                }
            }
            if (count == 1) {
                //this.showErrorMessage('Loan type, loan name and charge name already exists in grid');
                isValid = false;
            }
        } catch (e) {
            this.disablechargetypesavebutton = false;
            this.chargetypesavebutton = "Add and Save";
            this.showErrorMessage(e);
        }


        return isValid;
    }
    saveLoanChargeTypes() {
        try {

            debugger;
            this.disablechargetypesavebutton = true;
            this.chargetypesavebutton = "Processing";

            this.chargesTypesForm['controls']['pCreatedby'].setValue(this._commonService.pCreatedby);
            this.chargesTypesForm['controls']['pStatusname'].setValue(this._commonService.pStatusname);
            this.chargesTypesForm['controls']['pLoanChargeid'].setValue('0');
            this.chargesForm['controls']['pCreatedby'].setValue(this._commonService.pCreatedby);
            this.chargesForm['controls']['pStatusname'].setValue(this._commonService.pStatusname);
            if (this.validateLoanChargeTypes()) {
                let control = <FormArray>this.chargesForm.controls['pLoanchargetypes'];

                control.push(this.addChargesTypesFormControls());

                this.chargesForm['controls']['pLoanchargetypes']['controls'][0].patchValue(this.chargesTypesForm.value);

                let data = JSON.stringify(this.chargesForm.value);

                control = <FormArray>this.chargesForm.controls['pLoanchargetypes'];
                for (let i = control.length - 1; i >= 0; i--) {
                    control.removeAt(i)
                }

                this._ChargemasterService.checkLoanChargeTypes(this.chargesTypesForm.controls.pChargeid.value, this.chargesTypesForm.controls.pLoanid.value).subscribe(res => {

                    if (res == 0) {
                        this._ChargemasterService.saveLoanChargeTypes(data).subscribe(res => {
                            this.disablechargetypesavebutton = false;
                            this.chargetypesavebutton = "Add and Save";
                            if (res > 0) {

                                this.getLoanChargeTypes(this.chargesTypesForm.controls.pLoanid.value);
                                this.chargesTypesForm['controls']['pChargeid'].setValue('');
                                this.chargesTypesForm['controls']['pChargename'].setValue('');
                                this.chargesConfigErrorMessage['pChargename'] = '';
                            }
                        },
                            (error) => {
                                this.disablechargetypesavebutton = false;
                                this.chargetypesavebutton = "Add and Save";
                                this.showErrorMessage(error);
                            });
                    }
                    else {
                        //this.showErrorMessage('Loan type, loan name and charge name already exists');
                    }

                }, error => {
                    this.disablechargetypesavebutton = false;
                    this.chargetypesavebutton = "Add and Save";
                    this.showErrorMessage(error);
                })
            }
            else {
                this._commonService.showWarningMessage('Already Exists.');
                this.disablechargetypesavebutton = false;
                this.chargetypesavebutton = "Add and Save";
            }

        } catch (e) {
            this.disablechargetypesavebutton = false;
            this.chargetypesavebutton = "Add and Save";
            this.showErrorMessage(e);
        }
    }
    chargedependentOnLoanRangeChange(type) {

        let data = this.chargesConfigForm.controls.pIsChargedependentOnLoanRange.value;
        this.showChargeConfigDetails = true;
        if (data == 'YES') {
            this.showChargedependentOnLoanRange = true;
            this.showChargenotdependentOnLoanRange = false;
            if (this.chargeConfigButtonName != 'Update Charge') {
                if (type == 'SAVE')
                    this.chargesConfigForm['controls']['pIschargerangeapplicableonvalueortenure'].setValue('Amount');
                document.getElementById("ChargeAmountsDataTable").style.display = "block";
            }
            else {
                document.getElementById("ChargeAmountsDataTable").style.display = "none";
            }
        }
        else {
            document.getElementById("ChargeAmountsDataTable").style.display = "none";
            this.showChargedependentOnLoanRange = false;
            this.showChargenotdependentOnLoanRange = true;
        }
        this.chargeApplicableOnChange();
        this.addLoanRangeValidations();
    }
    chargeApplicableOnChange() {

        if (this.chargeConfigButtonName != 'Update Charge') {
            this.chargesConfigForm['controls']['pMinLoanAmountorTenure'].setValue('');
            this.chargesConfigForm['controls']['pMaxLoanAmountorTenure'].setValue('');
            this.chargesConfigForm['controls']['pChargePercentage'].setValue('');
            this.chargesConfigForm['controls']['pMaxchargesvalue'].setValue('');
            this.chargesConfigForm['controls']['pMinchargesvalue'].setValue('');
        }
        let data = this.chargesConfigForm.controls.pIschargerangeapplicableonvalueortenure.value;

        if (data == 'Amount') {
            this.setMinLoanAmountorTenureName = 'Min Loan Value';
            this.setMaxLoanAmountorTenureName = 'Max Loan Value';
            this.showminormaxcharge = true;

            this.valuorTenureMaxLength = '9@0';
        }
        else {
            this.setMinLoanAmountorTenureName = 'Min Loan Tenure';
            this.setMaxLoanAmountorTenureName = 'Max Loan Tenure';
            this.showminormaxcharge = false;
            this.chargesConfigForm['controls']['pMinchargesvalue'].setValue(0);
            this.chargesConfigForm['controls']['pMaxchargesvalue'].setValue(0);
            this.valuorTenureMaxLength = '3@0';
        }
    }
    ValidateMinMaxCharges(){
    debugger;
    let maxCharge:any=0;
    let minCharge:any=0;
    if(Number((this.chargesConfigForm.controls.pMaxchargesvalue.value).toString().replace(/,/g, ""))>0){
      maxCharge=Number((this.chargesConfigForm.controls.pMaxchargesvalue.value).toString().replace(/,/g, ""));
    }
    else{
    maxCharge=0;
    }
     if(Number((this.chargesConfigForm.controls.pMinchargesvalue.value).toString().replace(/,/g,""))>0){
      minCharge=Number((this.chargesConfigForm.controls.pMinchargesvalue.value).toString().replace(/,/g,""));
    }
    else{
    minCharge=0;
    }
    if(Number((this.chargesConfigForm.controls.pMaxchargesvalue.value).toString().replace(/,/g, ""))){
    if(Number(minCharge)>Number(maxCharge)){
        this._commonService.showWarningMessage('Max. Charge must be greater than or equal to Min. Charge.')
        this.chargesConfigForm.controls.pMinchargesvalue.setValue(0);
        return;
    }
    }
}
    taxTypeChange() {
        if (this.chargeConfigButtonName != 'Update Charge') {
            this.chargesConfigForm['controls']['pGstvalue'].setValue('');
        }
        let data = this.chargesConfigForm.controls.pGsttype.value;

        if (data == 'Include') {
            this.showInclude = true;
            this.showExclude = false;
        }
        else if (data == 'Exclude') {
            this.showInclude = false;
            this.showExclude = true;
        }
        else {
            this.chargesConfigForm['controls']['pGstvalue'].setValue(0);
            this.showInclude = false;
            this.showExclude = false;
        }
        this.GetValidationByControl(this.chargesConfigForm, 'pGsttype', true);
        this.GetValidationByControl(this.chargesConfigForm, 'pGstvalue', true);
    }
    applicanttype_Change($event: any): void {

        const applicanttype = $event.target.value;
        this.lstLoanPayIns = [];
        this.chargesConfigForm['controls']['pLoanpayin'].setValue('');
        this.chargesConfigErrorMessage['pLoanpayin']='';

        if (applicanttype && applicanttype != '') {
            const ledgername = $event.target.options[$event.target.selectedIndex].text;

            this.getLoanPayIns(applicanttype);

        }

    }
    chargeTypeChange() {


        let data = this.chargesConfigForm.controls.pChargevaluefixedorpercentage.value;
        if (this.chargeConfigButtonName != 'Update Charge') {
            this.chargesConfigForm['controls']['pChargeAmount'].setValue('');
            this.chargesConfigForm['controls']['pChargeTypePercentage'].setValue('');
        }

        if (data == 'Fixed') {
            this.showChargeType = true;
        }
        else {
            this.showChargeType = false;
        }
        this.addLoanRangeValidations();
    }
    chargeTypeTextChange() {


        let data = this.chargesConfigForm.controls.pChargevaluefixedorpercentage.value;

        if (data == 'Fixed') {
            let value = this.chargesConfigForm.controls.pChargeAmount.value;
            this.chargesConfigForm['controls']['pMinchargesvalue'].setValue(value);
            this.chargesConfigForm['controls']['pMaxchargesvalue'].setValue(value);
            this.chargesConfigForm['controls']['pChargePercentage'].setValue(0);
        }
        else {
            let value = this.chargesConfigForm.controls.pChargeTypePercentage.value;
            this.chargesConfigForm['controls']['pChargePercentage'].setValue(value);
            this.chargesConfigForm['controls']['pMinchargesvalue'].setValue(0);
            this.chargesConfigForm['controls']['pMaxchargesvalue'].setValue(0);
        }
    }

    loanAmountorTenureChange(isValid): boolean {

        try {
            this.GetValidationByControl(this.chargesConfigForm, 'pMinLoanAmountorTenure', true);
            this.GetValidationByControl(this.chargesConfigForm, 'pMaxLoanAmountorTenure', true);

            let minloanorTenure = parseFloat(this.chargesConfigForm.controls.pMinLoanAmountorTenure.value.toString().replace(/,/g, ""));
            let maxloanorTenure = parseFloat(this.chargesConfigForm.controls.pMaxLoanAmountorTenure.value.toString().replace(/,/g, ""));
            if ((minloanorTenure > maxloanorTenure) && minloanorTenure != 0) {
                //this.showErrorMessage(this.setMinLoanAmountorTenureName + ' should be less than or equal to ' + this.setMaxLoanAmountorTenureName);
                isValid = false;

            }
            //this.loanChargeAmountCalculation();
        } catch (e) {
            isValid = false;
            this.showErrorMessage(e);
        }
        return isValid;

    }
    loanChargeChange(isValid): boolean {

        try {
            let valuorTenure = this.chargesConfigForm.controls.pIschargerangeapplicableonvalueortenure.value;
            let minChargeAmount = 0;
            let minloanorTenure = 0;
            let maxloanorTenure = 0;
            let maxChargeAmount = 0;
            if (valuorTenure == 'Amount') {
                let chargePercentage = parseFloat(this.chargesConfigForm.controls.pChargePercentage.value.toString().replace(/,/g, ""));
                if (isNaN(chargePercentage))
                    chargePercentage = 0;
                minloanorTenure = parseFloat(this.chargesConfigForm.controls.pMinLoanAmountorTenure.value.toString().replace(/,/g, ""));
                maxloanorTenure = parseFloat(this.chargesConfigForm.controls.pMaxLoanAmountorTenure.value.toString().replace(/,/g, ""));
                minChargeAmount = Math.round((minloanorTenure * chargePercentage) / 100);
                maxChargeAmount = Math.round((maxloanorTenure * chargePercentage) / 100);
            }


            this.GetValidationByControl(this.chargesConfigForm, 'pMinchargesvalue', true);
            this.GetValidationByControl(this.chargesConfigForm, 'pMaxchargesvalue', true);

            let minCharge = parseFloat(this.chargesConfigForm.controls.pMinchargesvalue.value.toString().replace(/,/g, ""));
            let maxCharge = parseFloat(this.chargesConfigForm.controls.pMaxchargesvalue.value.toString().replace(/,/g, ""));

            if (minCharge < minChargeAmount) {
                minCharge = minChargeAmount;
                this.chargesConfigForm['controls']['pMinchargesvalue'].setValue(this._commonService.currencyformat(minCharge));
            }
            if (maxCharge > maxChargeAmount) {
                maxCharge = maxChargeAmount;
                this.chargesConfigForm['controls']['pMaxchargesvalue'].setValue(this._commonService.currencyformat(maxCharge));
            }

            if ((minCharge > maxCharge) && minCharge != 0) {
                //this.showErrorMessage('Min charge should be less than or equal to max charge');
                isValid = false;
            }

        } catch (e) {
            isValid = false;
            this.showErrorMessage(e);
        }
        return isValid;
    }
    loanChargeAmountCalculation() {
        try {

            this.GetValidationByControl(this.chargesConfigForm, 'pChargePercentage', true);
            let valuorTenure = this.chargesConfigForm.controls.pIschargerangeapplicableonvalueortenure.value;
            let minChargeAmount = 0;
            let maxChargeAmount = 0;
            if (valuorTenure == 'Amount') {
                let chargePercentage = parseFloat(this.chargesConfigForm.controls.pChargePercentage.value.toString().replace(/,/g, ""));
                if (isNaN(chargePercentage))
                    chargePercentage = 0;
                let minloanorTenure = parseFloat(this.chargesConfigForm.controls.pMinLoanAmountorTenure.value.toString().replace(/,/g, ""));
                let maxloanorTenure = parseFloat(this.chargesConfigForm.controls.pMaxLoanAmountorTenure.value.toString().replace(/,/g, ""));
                minChargeAmount = Math.round((minloanorTenure * chargePercentage) / 100);
                maxChargeAmount = Math.round((maxloanorTenure * chargePercentage) / 100);
            }

            if (minChargeAmount > 0) {

                this.chargesConfigForm['controls']['pMinchargesvalue'].setValue(this._commonService.currencyformat(minChargeAmount));
            }
            else
                this.chargesConfigForm['controls']['pMinchargesvalue'].setValue('0');

            if (maxChargeAmount > 0) {

                this.chargesConfigForm['controls']['pMaxchargesvalue'].setValue(this._commonService.currencyformat(maxChargeAmount));
            }
            else
                this.chargesConfigForm['controls']['pMaxchargesvalue'].setValue('0');
        } catch (e) {
            this.showErrorMessage(e);
        }

    }
    addLoanRangeValidations() {
        let dependentOnLoanRange = this.chargesConfigForm.controls.pIsChargedependentOnLoanRange.value;

        let valueorTenureControl = <FormGroup>this.chargesConfigForm['controls']['pIschargerangeapplicableonvalueortenure'];
        let minLoanAmountorTenureControl = <FormGroup>this.chargesConfigForm['controls']['pMinLoanAmountorTenure'];
        let maxLoanAmountorTenure = <FormGroup>this.chargesConfigForm['controls']['pMaxLoanAmountorTenure'];
        let chargePercentage = <FormGroup>this.chargesConfigForm['controls']['pChargePercentage'];
        //let maxchargesvalue = <FormGroup>this.chargesConfigForm['controls']['pMaxchargesvalue'];
        //let minchargesvalue = <FormGroup>this.chargesConfigForm['controls']['pMinchargesvalue'];
        let chargeTypePercentage = <FormGroup>this.chargesConfigForm['controls']['pChargeTypePercentage'];
        let chargeAmount = <FormGroup>this.chargesConfigForm['controls']['pChargeAmount'];

        let FixedorPercentageControl = <FormGroup>this.chargesConfigForm['controls']['pChargevaluefixedorpercentage'];

        if (dependentOnLoanRange == 'YES') {
            valueorTenureControl.setValidators(Validators.required);
            minLoanAmountorTenureControl.setValidators(Validators.required);
            maxLoanAmountorTenure.setValidators(Validators.required);
            chargePercentage.setValidators(Validators.required);
            //maxchargesvalue.setValidators(Validators.required);
            //minchargesvalue.setValidators(Validators.required);
            FixedorPercentageControl.clearValidators();
            chargeTypePercentage.clearValidators();
            chargeAmount.clearValidators();
        }
        else {
            let fixedorpercentage = this.chargesConfigForm.controls.pChargevaluefixedorpercentage.value;
            valueorTenureControl.clearValidators();
            minLoanAmountorTenureControl.clearValidators();
            maxLoanAmountorTenure.clearValidators();
            //maxchargesvalue.clearValidators();
            //minchargesvalue.clearValidators();
            chargePercentage.clearValidators();

            if (fixedorpercentage == 'Percentage') {

                chargeTypePercentage.setValidators(Validators.required);
                chargeAmount.clearValidators();
            } else {

                chargeAmount.setValidators(Validators.required);

                chargeTypePercentage.clearValidators();
            }
            FixedorPercentageControl.setValidators(Validators.required);
        }

        valueorTenureControl.updateValueAndValidity();
        minLoanAmountorTenureControl.updateValueAndValidity();
        maxLoanAmountorTenure.updateValueAndValidity();
        chargePercentage.updateValueAndValidity();
        //maxchargesvalue.updateValueAndValidity();
        //minchargesvalue.updateValueAndValidity();
        FixedorPercentageControl.updateValueAndValidity();
    }

    addAmountorTenur(type) {

        let minLoanAmountorTenureControl = <FormGroup>this.chargesConfigForm['controls']['pMinLoanAmountorTenure'];
        let maxLoanAmountorTenure = <FormGroup>this.chargesConfigForm['controls']['pMaxLoanAmountorTenure'];
        let chargePercentage = <FormGroup>this.chargesConfigForm['controls']['pChargePercentage'];
        //let maxchargesvalue = <FormGroup>this.chargesConfigForm['controls']['pMaxchargesvalue'];
        //let minchargesvalue = <FormGroup>this.chargesConfigForm['controls']['pMinchargesvalue'];




        if (type == 'LOAD') {

            minLoanAmountorTenureControl.setValidators(Validators.required);
            maxLoanAmountorTenure.setValidators(Validators.required);
            chargePercentage.setValidators(Validators.required);
            //maxchargesvalue.setValidators(Validators.required);
            //minchargesvalue.setValidators(Validators.required);

        }
        else {

            minLoanAmountorTenureControl.clearValidators();
            maxLoanAmountorTenure.clearValidators();
            //maxchargesvalue.clearValidators();
            //minchargesvalue.clearValidators();
            chargePercentage.clearValidators();
        }


        minLoanAmountorTenureControl.updateValueAndValidity();
        maxLoanAmountorTenure.updateValueAndValidity();
        chargePercentage.updateValueAndValidity();
        //maxchargesvalue.updateValueAndValidity();
        //minchargesvalue.updateValueAndValidity();

    }

    addGstValidations(type) {
        let Gsttype = this.chargesConfigForm.controls.pGsttype.value;
        let gstType = <FormGroup>this.chargesConfigForm['controls']['pGsttype'];
        let gstValue = <FormGroup>this.chargesConfigForm['controls']['pGstvalue'];
        if (type == 'GET') {
            gstType.setValidators(Validators.required);
            if (Gsttype == 'NO') {
                gstValue.clearValidators();
            }
            else {
                gstValue.setValidators(Validators.required);

            }
        }
        else {
            gstValue.clearValidators();
            gstType.clearValidators();
        }
        gstValue.updateValueAndValidity();
        gstType.updateValueAndValidity();
    }
    validateNewExistingData(isValid, type): boolean {

        let existingDatainfo;
        let newDatainfo;

        let Applicanttype = this.chargesConfigForm.controls.pApplicanttype.value;
        let Loanpayin = this.chargesConfigForm.controls.pLoanpayin.value;
        let loanchargeid = this.chargesConfigForm.controls.pLoanChargeid.value;

        let minLoanValue;
        let maxLoanValue;
        if (this.chargesConfigForm.controls.pMinLoanAmountorTenure.value != null)
            minLoanValue = parseFloat(this.chargesConfigForm.controls.pMinLoanAmountorTenure.value.toString().replace(/,/g, ""));
        else
            minLoanValue = 0;
        if (this.chargesConfigForm.controls.pMaxLoanAmountorTenure.value != null)
            maxLoanValue = parseFloat(this.chargesConfigForm.controls.pMaxLoanAmountorTenure.value.toString().replace(/,/g, ""));
        else
            maxLoanValue = 0;




        if (this.chargesConfigForm.controls.pIsChargedependentOnLoanRange.value.toUpperCase() == 'YES') {
            if (this.chargesConfigForm.controls.pIschargerangeapplicableonvalueortenure.value.toUpperCase() == 'AMOUNT') {
                newDatainfo = 'AMOUNT';
            }
            else {
                newDatainfo = 'TENURE';
            }
        }
        else {
            if (this.chargesConfigForm.controls.pChargevaluefixedorpercentage.value.toUpperCase() == 'FIXED') {
                newDatainfo = 'FIXED';
            }
            else {
                newDatainfo = 'PERCENTAGE';
            }
        }

        let data;

        if (type == 'AMOUNTS DETAILS') {

            let loanChargeConfigData = this.loanChargeAmountsDataTableInfo.rows().data();
            if (loanChargeConfigData.length > 0) {
                loanChargeConfigData = loanChargeConfigData.filter(c => c.pLoanChargeid == loanchargeid);
            }
            if (loanChargeConfigData != null) {
                if (loanChargeConfigData.length > 0) {
                    data = loanChargeConfigData[0].pIsChargedependentOnLoanRange;
                    if (data && data != null)
                        data = data.toUpperCase();
                    else
                        isValid = false;
                    if (data == 'YES') {

                        data = loanChargeConfigData[0].pIschargerangeapplicableonvalueortenure;
                        if (data && data != null)
                            data = data.toUpperCase();
                        else
                            isValid = false;
                        if (data == 'AMOUNT') {
                            existingDatainfo = 'AMOUNT';
                        }
                        else {
                            existingDatainfo = 'TENURE';
                        }
                    }
                    else {

                        data = loanChargeConfigData[0].pChargevaluefixedorpercentage;
                        if (data && data != null)
                            data = data.toUpperCase();
                        else
                            isValid = false;

                        if (loanChargeConfigData[0].pChargevaluefixedorpercentage.toString().toUpperCase() == 'FIXED') {
                            existingDatainfo = 'FIXED';
                        }
                        else {
                            existingDatainfo = 'PERCENTAGE';
                        }
                    }
                }
                else {
                    existingDatainfo = newDatainfo;
                }
            }
            else {
                existingDatainfo = newDatainfo;
            }
        }
        if (type == 'CHARGE CONFIG') {

            let loanChargeConfigData = this.loanChargeConfigDataTableInfo.rows().data();
            if (this.chargeConfigButtonName == 'Update Charge') {

                let newdata = loanChargeConfigData.filter(c => c.pLoanChargeid == loanchargeid && c.pApplicanttype == Applicanttype && c.pLoanpayin == Loanpayin && c.pMinLoanAmountorTenure == minLoanValue && c.pMaxLoanAmountorTenure == maxLoanValue)

                if (newdata != null) {
                    if (newdata.length > 0) {
                        loanChargeConfigData.splice(this.chargeConfigRowIndex, 1);
                    }
                }
            }
            if (loanChargeConfigData.length > 0) {
                loanChargeConfigData = loanChargeConfigData.filter(c => c.pLoanChargeid == loanchargeid);
            }
            if (loanChargeConfigData != null) {
                if (loanChargeConfigData.length > 0) {
                    data = loanChargeConfigData[0].pIsChargedependentOnLoanRange;
                    if (data && data != null)
                        data = data.toUpperCase();
                    else
                        isValid = false;
                    if (data == 'YES') {

                        data = loanChargeConfigData[0].pIschargerangeapplicableonvalueortenure;
                        if (data && data != null)
                            data = data.toUpperCase();
                        else
                            isValid = false;
                        if (data == 'AMOUNT') {
                            existingDatainfo = 'AMOUNT';
                        }
                        else {
                            existingDatainfo = 'TENURE';
                        }
                    }
                    else {
                        data = loanChargeConfigData[0].pChargevaluefixedorpercentage;
                        if (data && data != null)
                            data = data.toUpperCase();
                        else
                            isValid = false;
                        if (data == 'FIXED') {
                            existingDatainfo = 'FIXED';
                        }
                        else {
                            existingDatainfo = 'PERCENTAGE';
                        }
                    }
                }
                else {
                    existingDatainfo = newDatainfo;
                }
            }
            else {
                existingDatainfo = newDatainfo;
            }
        }

        if (newDatainfo != existingDatainfo) {
            isValid = false;
        }
        return isValid;
    }
    validateLoanChargeTypesAmounts(): boolean {
        this.addAmountorTenur('LOAD');
        let isValid: boolean = true;
        isValid = this.checkValidations(this.chargesConfigForm, isValid);

        if (isValid)
            isValid = this.loanAmountorTenureChange(isValid);
        if (isValid)
            isValid = this.loanChargeChange(isValid);
        if (isValid) {
            isValid = this.validateNewExistingData(isValid, 'AMOUNTS DETAILS')
        }
        if (isValid) {
            let dependentOnLoanRange = this.chargesConfigForm.controls.pIsChargedependentOnLoanRange.value;

            let minLoanValue;
            let maxLoanValue;
            if (this.chargesConfigForm.controls.pMinLoanAmountorTenure.value != null)
                minLoanValue = parseFloat(this.chargesConfigForm.controls.pMinLoanAmountorTenure.value.toString().replace(/,/g, ""));
            if (this.chargesConfigForm.controls.pMaxLoanAmountorTenure.value != null)
                maxLoanValue = parseFloat(this.chargesConfigForm.controls.pMaxLoanAmountorTenure.value.toString().replace(/,/g, ""));

            let Applicanttype = this.chargesConfigForm.controls.pApplicanttype.value;
            let Loanpayin = this.chargesConfigForm.controls.pLoanpayin.value;

            let loanChargeAmountsData = this.loanChargeAmountsDataTableInfo.rows().data();
            if (loanChargeAmountsData != null) {
                for (let i = 0; i < loanChargeAmountsData.length; i++) {

                    let gridMinLoanValue;
                    let gridMaxLoanValue;
                    if (loanChargeAmountsData[i].pMinLoanAmountorTenure != null)
                        gridMinLoanValue = parseFloat(loanChargeAmountsData[i].pMinLoanAmountorTenure.toString().replace(/,/g, ""));
                    if (loanChargeAmountsData[i].pMaxLoanAmountorTenure != null)
                        gridMaxLoanValue = parseFloat(loanChargeAmountsData[i].pMaxLoanAmountorTenure.toString().replace(/,/g, ""));

                    let gridApplicanttype = loanChargeAmountsData[i].pApplicanttype;
                    let gridLoanpayin = loanChargeAmountsData[i].pLoanpayin;
                    if (gridApplicanttype == Applicanttype && gridLoanpayin == Loanpayin) {

                        if (parseFloat(minLoanValue) >= parseFloat(gridMinLoanValue) && parseFloat(minLoanValue) <= parseFloat(gridMaxLoanValue)) {
                            //this.showErrorMessage('Given range already exists');
                            isValid = false;
                            break;
                        }
                        if (parseFloat(maxLoanValue) >= parseFloat(gridMinLoanValue) && parseFloat(maxLoanValue) <= parseFloat(gridMaxLoanValue)) {
                            //this.showErrorMessage('Given range already exists');
                            isValid = false;
                            break;
                        }
                        if (parseFloat(minLoanValue) <= parseFloat(gridMinLoanValue) && parseFloat(maxLoanValue) >= parseFloat(gridMaxLoanValue)) {
                            //this.showErrorMessage('Given range already exists');
                            isValid = false;
                            break;
                        }
                        if (parseFloat(minLoanValue) >= parseFloat(gridMinLoanValue) && parseFloat(maxLoanValue) <= parseFloat(gridMaxLoanValue)) {
                            //this.showErrorMessage('Given range already exists');
                            isValid = false;
                            break;
                        }

                    }

                }
            }
        }
        return isValid;
    }
    clearLoanChargeTypesAmountsControls() {

        this.chargesConfigForm['controls']['pMinLoanAmountorTenure'].setValue('');
        this.chargesConfigForm['controls']['pMaxLoanAmountorTenure'].setValue('');
        this.chargesConfigForm['controls']['pChargePercentage'].setValue('');
        this.chargesConfigForm['controls']['pMinchargesvalue'].setValue('');
        this.chargesConfigForm['controls']['pMaxchargesvalue'].setValue('');


    }
    clearLoanChargeTypesAmountsAllControls() {

        this.showChargeConfig = true;
        this.showLoanChargeAmountsDataTable = true;
        this.showLoanChargeConfigDataTable = true;
        this.chargesConfigForm['controls']['pIsChargedependentOnLoanRange'].setValue('YES');
        this.chargesConfigForm['controls']['pChargecalonfield'].setValue('Sanctioned Loan amount');
        this.chargesConfigForm['controls']['pGsttype'].setValue('Exclude');
        this.chargesConfigForm['controls']['pGstvalue'].setValue('');
        this.chargesConfigForm['controls']['pChargevaluefixedorpercentage'].setValue('Percentage');

        this.chargedependentOnLoanRangeChange('SAVE');
        this.taxTypeChange();
        this.chargeTypeChange();
        this.showLoanChargeAmountsDataTable = true;
        document.getElementById("ChargeAmountsDataTable").style.display = "block";
        document.getElementById("ChargeConfigDataTable").style.display = "block";
        if (this.chargesConfigForm.controls.pApplicanttype.value != '')
            this.chargesConfigForm['controls']['pApplicanttype'].setValue('');
        if (this.chargesConfigForm.controls.pLoanpayin.value != '')
            this.chargesConfigForm['controls']['pLoanpayin'].setValue('');
        this.lstLoanPayIns = [];
        this.loadoanChargeAmountsDataTableData([]);
        this.disableexistingdata = false;


    }
    clearLoanChargeTypesAmounts() {
        this.chargesConfigForm.reset();
        this.clearLoanChargeTypesAmountsAllControls();
        this.chargesConfigForm.patchValue(this.loanAmountsData);
        let date = new Date();
        this.chargesConfigForm['controls']['pChargeEffectFrom'].setValue(date);

    }
    clearLoanChargeTypesConfig() {

        this.chargesConfigForm.reset();
        this.clearLoanChargeTypesAmountsAllControls();
        this.chargesConfigForm.patchValue(this.loanAmountsData);
        this.loadoanChargeAmountsDataTableData([]);
        this.chargesConfigErrorMessage = {};
        this.chargeConfigButtonName = 'Add Charge';
        document.getElementById("ChargeAmountsDataTable").style.display = "block";
        let date = new Date();
        this.chargesConfigForm['controls']['pChargeEffectFrom'].setValue(date);
        this.chargeConfigRowIndex = null;
        this.addorremovechargeConfigclass();
    }
    addLoanChargeTypesAmounts() {
debugger;
        try {
            if (this.validateLoanChargeTypesAmounts()) {

                this.chargesConfigForm['controls']['precordid'].setValue(0);
                this.chargesConfigForm['controls']['ptypeofoperation'].setValue('CREATE');
                this.chargesConfigForm['controls']['pStatusname'].setValue(this._commonService.pStatusname);
                this.chargesConfigForm['controls']['pCreatedby'].setValue(this._commonService.pCreatedby);
                if (this.chargesConfigForm.controls.pIschargerangeapplicableonvalueortenure.value == 'Tenure') {
                    this.chargesConfigForm['controls']['pMinchargesvalue'].setValue(0);
                    this.chargesConfigForm['controls']['pMaxchargesvalue'].setValue(0);
                }
                let loanChargeAmountsData = this.chargesConfigForm.value;
                this.loanChargeAmountsDataTableInfo.row.add(loanChargeAmountsData).draw().node();
                this.clearLoanChargeTypesAmountsControls();

                loanChargeAmountsData = this.loanChargeAmountsDataTableInfo.rows().data();
                if (loanChargeAmountsData != null) {
                    if (loanChargeAmountsData.length > 0)
                        this.disableexistingdata = true;
                }
            }
        } catch (e) {
            this.showErrorMessage(e);
        }
    }
    addchargevalidation(isValid): boolean {

        if (isValid && this.chargesConfigForm.controls.pIsChargedependentOnLoanRange.value == 'YES') {

            let editstatus = true;
            let loanChargeAmountsData = this.loanChargeAmountsDataTableInfo.rows().data();

            if (this.chargeConfigButtonName == 'Add Charge') {

                if (loanChargeAmountsData != null) {
                    if (loanChargeAmountsData.length == 0) {
                        isValid = false;
                        editstatus = false
                        //this.showErrorMessage('Enter charge details');
                    }
                }


                if (editstatus) {
                    for (let j = 0; j < loanChargeAmountsData.length; j++) {

                        let minLoanValue;
                        let maxLoanValue;
                        if (loanChargeAmountsData[j].pMinLoanAmountorTenure != null)
                            minLoanValue = parseFloat(loanChargeAmountsData[j].pMinLoanAmountorTenure.toString().replace(/,/g, ""));
                        if (loanChargeAmountsData[j].pMaxLoanAmountorTenure != null)
                            maxLoanValue = parseFloat(loanChargeAmountsData[j].pMaxLoanAmountorTenure.toString().replace(/,/g, ""));

                        let Applicanttype = loanChargeAmountsData[j].pApplicanttype;
                        let Loanpayin = loanChargeAmountsData[j].pLoanpayin;
                        let LoanChargeid = loanChargeAmountsData[j].pLoanChargeid;
                        let Percentage = loanChargeAmountsData[j].pChargePercentage;
                        let EffectFromDate = this.chargesConfigForm.controls.pChargeEffectFrom.value;


                        let loanChargeConfigData = this.loanChargeConfigDataTableInfo.rows().data();
                        loanChargeConfigData = loanChargeConfigData.filter(function (loanname) {
                            return loanname.pLoanChargeid == LoanChargeid;
                        });
                        if (loanChargeConfigData != null) {
                            for (let i = 0; i < loanChargeConfigData.length; i++) {
                                let status = true;
                                if (this.chargeConfigButtonName != 'Add Charge') {
                                    if (i != this.chargeConfigRowIndex) {
                                        status = false;
                                    }
                                }
                                if (status) {

                                    let gridMinLoanValue;;
                                    let gridMaxLoanValue;;
                                    if (loanChargeConfigData[i].pMinLoanAmountorTenure != null)
                                        gridMinLoanValue = parseFloat(loanChargeConfigData[i].pMinLoanAmountorTenure.toString().replace(/,/g, ""));
                                    if (loanChargeConfigData[i].pMaxLoanAmountorTenure != null)
                                        gridMaxLoanValue = parseFloat(loanChargeConfigData[i].pMaxLoanAmountorTenure.toString().replace(/,/g, ""));

                                    let gridApplicanttype = loanChargeConfigData[i].pApplicanttype;
                                    let gridLoanpayin = loanChargeConfigData[i].pLoanpayin;
                                    let gridLoanChargeid = loanChargeConfigData[i].pLoanChargeid;
                                    let gridPercentage = loanChargeConfigData[i].pChargePercentage;
                                    let gridEffectFromDate = this._commonService.formatDateFromDDMMYYYY(loanChargeConfigData[i].pChargeEffectFrom);

                                    if (gridApplicanttype == Applicanttype && gridLoanpayin == Loanpayin && gridLoanChargeid == LoanChargeid) {
                                        //if (minLoanValue == gridMinLoanValue && maxLoanValue == gridMaxLoanValue) {

                                        //    let date1 = new Date(EffectFromDate);
                                        //    let date2 = new Date(gridEffectFromDate);
                                        //    if (new Date(EffectFromDate) != new Date(gridEffectFromDate)) {
                                        //        if (new Date(EffectFromDate) > new Date(gridEffectFromDate)) {
                                        //            let newDate = this.datepipe.transform(date1.setDate(date1.getDate() - 1), 'dd/MM/yyyy');
                                        //            loanChargeConfigData[j].pChargeEffectTo = newDate;
                                        //            this.loanChargeConfigDataTableInfo.row(j).data(loanChargeConfigData[j]).draw();
                                        //        }
                                        //        else {
                                        //            isValid = false;
                                        //            break;
                                        //        }
                                        //    } else {

                                        //        isValid = false;
                                        //        break;
                                        //    }
                                        //}
                                        //else {
                                        if (parseFloat(minLoanValue) >= parseFloat(gridMinLoanValue) && parseFloat(minLoanValue) <= parseFloat(gridMaxLoanValue)) {
                                            //this.showErrorMessage('Given range already exists');
                                            isValid = false;
                                            break;
                                        }
                                        if (parseFloat(maxLoanValue) >= parseFloat(gridMinLoanValue) && parseFloat(maxLoanValue) <= parseFloat(gridMaxLoanValue)) {
                                            //this.showErrorMessage('Given range already exists');
                                            isValid = false;
                                            break;
                                        }
                                        if (parseFloat(minLoanValue) <= parseFloat(gridMinLoanValue) && parseFloat(maxLoanValue) >= parseFloat(gridMaxLoanValue)) {
                                            //this.showErrorMessage('Given range already exists');
                                            isValid = false;
                                            break;
                                        }
                                        if (parseFloat(minLoanValue) >= parseFloat(gridMinLoanValue) && parseFloat(maxLoanValue) <= parseFloat(gridMaxLoanValue)) {
                                            //this.showErrorMessage('Given range already exists');
                                            isValid = false;
                                            break;
                                        }
                                        //}
                                    }

                                }
                            }
                        }
                    }
                }
            }


        }
        if (this.chargesConfigForm.controls.pIsChargedependentOnLoanRange.value == 'NO') {

            let Applicanttype = this.chargesConfigForm.controls.pApplicanttype.value;
            let Loanpayin = this.chargesConfigForm.controls.pLoanpayin.value;
            let LoanChargeid = this.chargesConfigForm.controls.pLoanChargeid.value;
            let loanChargeConfigData = this.loanChargeConfigDataTableInfo.rows().data();
            loanChargeConfigData = loanChargeConfigData.filter(function (loanname) {
                return loanname.pLoanChargeid == LoanChargeid;
            });
            if (loanChargeConfigData != null) {
                for (let i = 0; i < loanChargeConfigData.length; i++) {

                    let gridApplicanttype = loanChargeConfigData[i].pApplicanttype;
                    let gridLoanpayin = loanChargeConfigData[i].pLoanpayin;
                    let gridLoanChargeid = loanChargeConfigData[i].pLoanChargeid;

                    if (gridApplicanttype == Applicanttype && gridLoanpayin == Loanpayin && gridLoanChargeid == LoanChargeid) {
                        isValid = false;
                        break;
                    }

                }
            }
        }
        return isValid;
    }
    updatechargevalidation(isValid): boolean {
debugger
        if (isValid && this.chargesConfigForm.controls.pIsChargedependentOnLoanRange.value == 'YES') {

            //let editstatus = true;
            //let loanChargeAmountsData = this.loanChargeAmountsDataTableInfo.rows().data();

            let minLoanValue;
            let maxLoanValue;
            if (this.chargesConfigForm.controls.pMinLoanAmountorTenure.value != null)
                minLoanValue = parseFloat(this.chargesConfigForm.controls.pMinLoanAmountorTenure.value.toString().replace(/,/g, ""));
            if (this.chargesConfigForm.controls.pMaxLoanAmountorTenure != null)
                maxLoanValue = parseFloat(this.chargesConfigForm.controls.pMaxLoanAmountorTenure.value.toString().replace(/,/g, ""));

            let Applicanttype = this.chargesConfigForm.controls.pApplicanttype.value;
            let Loanpayin = this.chargesConfigForm.controls.pLoanpayin.value;
            let LoanChargeid = this.chargesConfigForm.controls.pLoanChargeid.value;
            let Percentage = this.chargesConfigForm.controls.pChargePercentage.value;
            let EffectFromDate = this.chargesConfigForm.controls.pChargeEffectFrom.value;


            let loanChargeConfigData = this.loanChargeConfigDataTableInfo.rows().data();
            loanChargeConfigData = loanChargeConfigData.filter(function (loanname) {
                return loanname.pLoanChargeid == LoanChargeid;
            });
            if (loanChargeConfigData != null) {
                for (let i = 0; i < loanChargeConfigData.length; i++) {
                    let status = true;
                    if (this.chargeConfigButtonName != 'Add Charge') {
                        if (i == this.chargeConfigRowIndex) {
                            status = false;
                        }
                    }
                    if (status) {

                        let gridMinLoanValue;;
                        let gridMaxLoanValue;;
                        if (loanChargeConfigData[i].pMinLoanAmountorTenure != null)
                            gridMinLoanValue = parseFloat(loanChargeConfigData[i].pMinLoanAmountorTenure.toString().replace(/,/g, ""));
                        if (loanChargeConfigData[i].pMaxLoanAmountorTenure != null)
                            gridMaxLoanValue = parseFloat(loanChargeConfigData[i].pMaxLoanAmountorTenure.toString().replace(/,/g, ""));

                        let gridApplicanttype = loanChargeConfigData[i].pApplicanttype;
                        let gridLoanpayin = loanChargeConfigData[i].pLoanpayin;
                        let gridLoanChargeid = loanChargeConfigData[i].pLoanChargeid;
                        let gridPercentage = loanChargeConfigData[i].pChargePercentage;
                        let gridEffectFromDate = this._commonService.formatDateFromDDMMYYYY(loanChargeConfigData[i].pChargeEffectFrom);
                        let gridEffecttoDate = this._commonService.formatDateFromDDMMYYYY(loanChargeConfigData[i].pChargeEffectFrom);

                        if (gridApplicanttype == Applicanttype && gridLoanpayin == Loanpayin && gridLoanChargeid == LoanChargeid) {
                            if (minLoanValue == gridMinLoanValue && maxLoanValue == gridMaxLoanValue) {

                                let date1 = new Date(EffectFromDate);
                                let date2 = new Date(gridEffectFromDate);

                                if (new Date(date1) > new Date(date2)) {

                                    if (gridEffecttoDate == null) {
                                        let newDate = this.datepipe.transform(date1.setDate(date1.getDate() - 1), 'DD/MM/YYYY');
                                        loanChargeConfigData[i].pChargeEffectTo = newDate;
                                        loanChargeConfigData[i].ptypeofoperation = 'UPDATE';
                                        loanChargeConfigData[i].peditstatus = 'NO';
                                        this.loanChargeConfigDataTableInfo.row(this.chargeConfigRowIndex).data(loanChargeConfigData[i]).draw();
                                        this.newdaterecordstatus = 'YES';
                                    }
                                    else {
                                       // isValid = false;
                                     //   break;
                                    }
                                }
                                else {
                                    if (new Date(date1) <= new Date(date2)) {
                                     //   isValid = false;
                                     //   break;
                                    }
                                }

                            }
                            else {
                                if (parseFloat(minLoanValue) >= parseFloat(gridMinLoanValue) && parseFloat(minLoanValue) <= parseFloat(gridMaxLoanValue)) {
                                    //this.showErrorMessage('Given range already exists');
                                    isValid = false;
                                    break;
                                }
                                if (parseFloat(maxLoanValue) >= parseFloat(gridMinLoanValue) && parseFloat(maxLoanValue) <= parseFloat(gridMaxLoanValue)) {
                                    //this.showErrorMessage('Given range already exists');
                                    isValid = false;
                                    break;
                                }
                                if (parseFloat(minLoanValue) <= parseFloat(gridMinLoanValue) && parseFloat(maxLoanValue) >= parseFloat(gridMaxLoanValue)) {
                                    //this.showErrorMessage('Given range already exists');
                                    isValid = false;
                                    break;
                                }
                                if (parseFloat(minLoanValue) >= parseFloat(gridMinLoanValue) && parseFloat(maxLoanValue) <= parseFloat(gridMaxLoanValue)) {



                                    //this.showErrorMessage('Given range already exists');
                                    isValid = false;
                                    break;
                                }
                            }
                        }

                    }
                }
            }
        }
        if (this.chargesConfigForm.controls.pIsChargedependentOnLoanRange.value == 'NO') {

            let Applicanttype = this.chargesConfigForm.controls.pApplicanttype.value;
            let Loanpayin = this.chargesConfigForm.controls.pLoanpayin.value;
            let LoanChargeid = this.chargesConfigForm.controls.pLoanChargeid.value;
            let EffectFromDate = this.chargesConfigForm.controls.pChargeEffectFrom.value;
            let loanChargeConfigData = this.loanChargeConfigDataTableInfo.rows().data();
            loanChargeConfigData = loanChargeConfigData.filter(function (loanname) {
                return loanname.pLoanChargeid == LoanChargeid;
            });
            if (loanChargeConfigData != null) {
                for (let i = 0; i < loanChargeConfigData.length; i++) {

                    let gridApplicanttype = loanChargeConfigData[i].pApplicanttype;
                    let gridLoanpayin = loanChargeConfigData[i].pLoanpayin;
                    let gridLoanChargeid = loanChargeConfigData[i].pLoanChargeid;
                    let gridEffectFromDate = this._commonService.formatDateFromDDMMYYYY(loanChargeConfigData[i].pChargeEffectFrom);
                    if (gridApplicanttype == Applicanttype && gridLoanpayin == Loanpayin && gridLoanChargeid == LoanChargeid) {
                        let date1 = new Date(EffectFromDate);
                        let date2 = new Date(gridEffectFromDate);
                        if (new Date(date1) != new Date(date2)) {
                            if (new Date(date1) > new Date(date2)) {
                                let newDate = this.datepipe.transform(date1.setDate(date1.getDate() - 1), 'DD/MM/YYYY');
                                loanChargeConfigData[i].pChargeEffectTo = newDate;

                                loanChargeConfigData[i].ptypeofoperation = 'UPDATE';
                                loanChargeConfigData[i].peditstatus = 'NO';
                                this.loanChargeConfigDataTableInfo.row(this.chargeConfigRowIndex).data(loanChargeConfigData[i]).draw();
                                this.newdaterecordstatus = 'YES';
                            }
                            else {
                                isValid = false;
                                break;
                            }
                        } else {

                            isValid = false;
                            break;
                        }
                    }

                }
            }
        }
        return isValid;
    }
    validationsLoanChargeTypesConfig(): boolean {
        debugger;
        let isValid: boolean = true;
        this.addGstValidations('GET');
        this.addAmountorTenur('GET');
        isValid = this.checkValidations(this.chargesConfigForm, isValid);
        if (isValid) {
            isValid = this.validateNewExistingData(isValid, 'CHARGE CONFIG')
        }
        if (isValid) {
            if (this.chargeConfigButtonName == 'Update Charge') {
                isValid = this.loanAmountorTenureChange(isValid);
            }
        }
        this.addGstValidations('LOAD');

        if (this.chargeConfigButtonName != 'Update Charge') {
            isValid = this.addchargevalidation(isValid);
        }
        else {
            isValid = this.updatechargevalidation(isValid);
        }
        return isValid;
    }
    addLoanChargeTypesConfig() {
        try {

            if (this.validationsLoanChargeTypesConfig()) {

                if (this.chargesConfigForm.controls.pIsChargedependentOnLoanRange.value == 'YES') {

                    if (this.chargeConfigButtonName == 'Update Charge') {
                        //console.log(this.chargesConfigForm.value)


                        let date = this.chargesConfigForm.controls.pChargeEffectFrom.value;
                        //if (date.length > 12) {
                        let latest_date = this._commonService.getFormatDate(this.chargesConfigForm.controls.pChargeEffectFrom.value);

                        this.chargesConfigForm['controls']['pChargeEffectFrom'].setValue(latest_date);
                        //}
                        if (this.chargesConfigForm.controls.pIschargerangeapplicableonvalueortenure.value == 'Tenure') {
                            this.chargesConfigForm['controls']['pMinchargesvalue'].setValue(0);
                            this.chargesConfigForm['controls']['pMaxchargesvalue'].setValue(0);
                        }

                        if (this.newdaterecordstatus == 'NO') {
                            this.chargesConfigForm['controls']['ptypeofoperation'].setValue('Update');
                            this.loanChargeConfigDataTableInfo.row(this.chargeConfigRowIndex).data(this.chargesConfigForm.value).draw();
                        }
                        else {
                            this.chargesConfigForm['controls']['precordid'].setValue(0);
                            this.chargesConfigForm['controls']['ptypeofoperation'].setValue('CREATE');
                            this.loanChargeConfigDataTableInfo.row.add(this.chargesConfigForm.value).draw().node();
                            this.newdaterecordstatus = 'NO';
                        }
                    }
                    else {
                        let loanAmountsdata = this.chargesConfigForm.value;
                        let loanChargeAmountsData = this.loanChargeAmountsDataTableInfo.rows().data();
                        if (loanChargeAmountsData != null) {
                            for (let i = 0; i < loanChargeAmountsData.length; i++) {


                                loanChargeAmountsData[i].pChargevaluefixedorpercentage = 'Percentage';
                                if (loanAmountsdata.pGsttype == 'NO') {
                                    loanChargeAmountsData[i].pIstaxapplicable = 'NO';
                                }
                                else {
                                    loanChargeAmountsData[i].pIstaxapplicable = 'YES';
                                }
                                loanChargeAmountsData[i].pGstvalue = loanAmountsdata.pGstvalue;
                                loanChargeAmountsData[i].pGsttype = loanAmountsdata.pGsttype;

                                let latest_date = this._commonService.getFormatDate(this.chargesConfigForm.controls.pChargeEffectFrom.value);

                                loanChargeAmountsData[i].pChargeEffectFrom = latest_date;
                                if (this.chargeConfigButtonName != 'Add Charge') {
                                    loanChargeAmountsData[i].pChargeEffectFrom = latest_date;
                                    loanChargeAmountsData[i].ptypeofoperation = 'Update';
                                }

                                this.loanChargeConfigDataTableInfo.row.add(loanChargeAmountsData[i]).draw().node();
                            }
                        }
                    }



                }
                else {

                    this.chargesConfigForm['controls']['pMinLoanAmountorTenure'].setValue(0);
                    this.chargesConfigForm['controls']['pMaxLoanAmountorTenure'].setValue(0);

                    if (this.chargeConfigButtonName == 'Update Charge') {

                        this.chargesConfigForm['controls']['ptypeofoperation'].setValue('Update');
                    }
                    else {
                        this.chargesConfigForm['controls']['precordid'].setValue(0);
                        this.chargesConfigForm['controls']['ptypeofoperation'].setValue('CREATE');
                    }

                    if (this.chargesConfigForm.controls.pChargevaluefixedorpercentage.value.toUpperCase() == 'FIXED') {
                        this.chargesConfigForm['controls']['pChargePercentage'].setValue(0);
                        this.chargesConfigForm['controls']['pMinchargesvalue'].setValue(this.chargesConfigForm.controls.pChargeAmount.value);
                        this.chargesConfigForm['controls']['pMaxchargesvalue'].setValue(this.chargesConfigForm.controls.pChargeAmount.value);
                    }
                    else {
                        this.chargesConfigForm['controls']['pChargePercentage'].setValue(this.chargesConfigForm.controls.pChargeTypePercentage.value);
                        this.chargesConfigForm['controls']['pMinchargesvalue'].setValue(0);
                        this.chargesConfigForm['controls']['pMaxchargesvalue'].setValue(0);
                    }


                    this.chargesConfigForm['controls']['pStatusname'].setValue(this._commonService.pStatusname);
                    this.chargesConfigForm['controls']['pCreatedby'].setValue(this._commonService.pCreatedby);
                    if (this.chargesConfigForm.controls.pGsttype.value == 'NO') {
                        this.chargesConfigForm['controls']['pIstaxapplicable'].setValue('NO');

                    }
                    else {
                        this.chargesConfigForm['controls']['pIstaxapplicable'].setValue('YES');

                    }


                    let loanChargeAmountsData = this.chargesConfigForm.value;



                    let latest_date = this._commonService.getFormatDate(this.chargesConfigForm.controls.pChargeEffectFrom.value);

                    loanChargeAmountsData.pChargeEffectFrom = latest_date;

                    loanChargeAmountsData.pIschargerangeapplicableonvalueortenure = '';

                    if (this.chargeConfigButtonName == 'Update Charge') {
                        this.loanChargeConfigDataTableInfo.row(this.chargeConfigRowIndex).data(loanChargeAmountsData).draw();
                    }
                    else {
                        this.loanChargeConfigDataTableInfo.row.add(loanChargeAmountsData).draw().node();
                    }
                }
                this.clearLoanChargeTypesConfig();
            }

        } catch (e) {
            this.showErrorMessage(e);
        }

    }
    clearLoanChargeConfig() {
        //this.clearLoanChargeTypesConfig();
        this.chargesForm.reset();


        this.chargesTypesForm.reset();
        this.lstLoanNames = [];
        this.chargesTypesForm['controls']['pLoantypeid'].setValue('');
        this.chargesTypesForm['controls']['pLoanid'].setValue('');
        this.chargesTypesForm['controls']['pChargeid'].setValue('');
        //this.chargesConfigForm.reset();

        this.loadoanChargeTypeDataTableData([]);
        this.loadoanChargeAmountsDataTableData([]);
        this.loadoanChargeConfigDataTableData([]);
        this.showChargeConfig = false;
        this.chargesConfigErrorMessage = {};
        this.showChargeTypeedit = true;
        document.getElementById("ChargeAmountsDataTable").style.display = "none";
        document.getElementById("ChargeConfigDataTable").style.display = "none";
        //this.BlurEventAllControll(this.chargesTypesForm);
        //this.BlurEventAllControll(this.chargesConfigForm);

        let date = new Date();
        this.chargesConfigForm['controls']['pChargeEffectFrom'].setValue(date);


    }
    validateLoanChargeConfig(): boolean {
        let isValid: boolean = true;


        let loanChargeConfigData = this.loanChargeConfigDataTableInfo.rows().data();
        if (loanChargeConfigData != null) {
            if (loanChargeConfigData.length == 0) {
                isValid = false;
                //this.showErrorMessage('Enter charge config details');
            }
        }

        return isValid;
    }
    saveLoanChargeConfig() {

        try {

            debugger;
            this.disablechargeconfigsavebutton = true;
            this.chargeconfigsavebutton = "Processing";

            if (this.validateLoanChargeConfig()) {
                this.chargesForm['controls']['pCreatedby'].setValue(this._commonService.pCreatedby);
                this.chargesForm['controls']['pStatusname'].setValue(this._commonService.pStatusname);
                let control = <FormArray>this.chargesForm.controls['pLoanchargetypesConfig'];
                let loanChargeConfigData = this.loanChargeConfigDataTableInfo.rows().data();
                if (loanChargeConfigData != null) {
                    for (let i = 0; i < loanChargeConfigData.length; i++) {


                        if (loanChargeConfigData[i].pIschargewaivedoff == '') {
                            loanChargeConfigData[i].pIschargewaivedoff = null;
                        }
                        control.push(this.addChargesConfigFormControls());
                        if (loanChargeConfigData[i].pIsChargedependentOnLoanRange == 'YES') {

                            if (loanChargeConfigData[i].pMinLoanAmountorTenure != null && loanChargeConfigData[i].pMinLoanAmountorTenure != '')
                                loanChargeConfigData[i].pMinLoanAmountorTenure = parseFloat(loanChargeConfigData[i].pMinLoanAmountorTenure.toString().replace(/,/g, ""));
                            if (loanChargeConfigData[i].pMaxLoanAmountorTenure != null && loanChargeConfigData[i].pMaxLoanAmountorTenure != '')
                                loanChargeConfigData[i].pMaxLoanAmountorTenure = parseFloat(loanChargeConfigData[i].pMaxLoanAmountorTenure.toString().replace(/,/g, ""));

                            if (loanChargeConfigData[i].pMinchargesvalue != null && loanChargeConfigData[i].pMinchargesvalue != '')
                                loanChargeConfigData[i].pMinchargesvalue = parseFloat(loanChargeConfigData[i].pMinchargesvalue.toString().replace(/,/g, ""));

                            if (loanChargeConfigData[i].pMaxchargesvalue != null && loanChargeConfigData[i].pMaxchargesvalue != '')
                                loanChargeConfigData[i].pMaxchargesvalue = parseFloat(loanChargeConfigData[i].pMaxchargesvalue.toString().replace(/,/g, ""));



                            loanChargeConfigData[i].pIsChargedependentOnLoanRange = 'Y';

                        }
                        else {
                            loanChargeConfigData[i].pIsChargedependentOnLoanRange = 'N';
                            loanChargeConfigData[i].pLoanAmountorTenure = 0;
                            loanChargeConfigData[i].pMinLoanAmountorTenure = 0;
                            loanChargeConfigData[i].pMaxLoanAmountorTenure = 0;
                            if (loanChargeConfigData[i].pChargevaluefixedorpercentage == 'Percentage') {
                                loanChargeConfigData[i].pMinchargesvalue = 0;
                                loanChargeConfigData[i].pMaxchargesvalue = 0;
                            }
                            else {
                                loanChargeConfigData[i].pChargePercentage = 0;
                            }

                        }

                        if (loanChargeConfigData[i].pChargeEffectFrom != null) {
                            if (loanChargeConfigData[i].pChargeEffectFrom.length <= 12) {
                                loanChargeConfigData[i].pChargeEffectFrom = this._commonService.formatDateFromDDMMYYYY(loanChargeConfigData[i].pChargeEffectFrom);
                            }
                        }
                        //loanChargeConfigData[i].pChargeEffectFrom = this._commonService.getFormatDate(loanChargeConfigData[i].pChargeEffectFrom);

                        this.chargesForm['controls']['pLoanchargetypesConfig']['controls'][i].patchValue(loanChargeConfigData[i]);


                        //this.chargesForm['controls']['pLoanchargetypesConfig']['controls'][i]['controls']['pChargeEffectTo'].setValue(null);
                        this.chargesForm['controls']['pLoanchargetypesConfig']['controls'][i]['controls']['pIschargewaivedoff'].setValue(0);
                    }
                }

                let data = JSON.stringify(this.chargesForm.value);

                control = <FormArray>this.chargesForm.controls['pLoanchargetypesConfig'];
                for (let i = control.length - 1; i >= 0; i--) {
                    control.removeAt(i)
                }

                this._ChargemasterService.saveLoanChargeConfig(data).subscribe(res => {

                    debugger
                    this.disablechargeconfigsavebutton = false;
                    this.chargeconfigsavebutton = "Submit";

                    if (res > 0) {


                        this.showInfoMessage("Saved sucessfully");
                        this._routes.navigate(['/ChargeconfigurationView'])
                    }
                },
                    (error) => {

                        this.showErrorMessage(error);
                    });
            }
            else {
                this.disablechargeconfigsavebutton = false;
                this.chargeconfigsavebutton = "Submit";
            }
        } catch (e) {
            this.disablechargeconfigsavebutton = false;
            this.chargeconfigsavebutton = "Submit";
            this._commonService.showErrorMessage(e);
        }
    }

}
