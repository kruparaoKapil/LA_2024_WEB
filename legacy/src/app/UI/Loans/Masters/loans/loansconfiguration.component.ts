import { Component, OnInit, DoCheck, NgZone } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { LoansmasterService } from 'src/app/Services/Loans/Masters/loansmaster.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common'
import { DatepickerDateCustomClasses } from 'ngx-bootstrap/datepicker';
import { CommonService } from 'src/app/Services/common.service';


declare let $: any

@Component({
    selector: 'app-loansconfiguration',
    templateUrl: './loansconfiguration.component.html',
    styles: []
})
export class LoansconfigurationComponent implements OnInit {

    LoanConfiguration: FormGroup
    button = 'Submit';
    isLoading = false;
    ApplicantTypes: any;
    TableColumnsDynamic: any;
    GridData: any;
    GridDataInIt: any;
    LoanPayinPeriod: any;
    submitted = false;
    test: any;
    LoanconfigData: any;
    Data: any;
    LoanInterestratetypes: any;
    Loanpayins: any;
    applicantTypesPush: any;
    TotalGridData: any;
    rowIndex: any;
    data:any;
    TenureChecked: boolean;
    ShowAddIcon: boolean;
    ShowEditIcon: boolean;
    min = false;
    max = false;
    checkmin = false;
    c = false;
    from = false;
    to = false;
    maxamount = false;
    days = false;
    inlineCheckbox2: boolean;
    inlineCheckbox1: boolean;
    myDateValue: Date;
    bsValue = new Date();
    dateCustomClasses: DatepickerDateCustomClasses[];
    public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
    ContactType: any;

    LoanAmountCheck: boolean;
    TenureCheck: boolean;
    TfromCheck: boolean;
    TLoanAmountCheck: boolean;

    constructor(public datepipe: DatePipe, private _commonservice: CommonService, private formbuilder: FormBuilder, private _loanmasterservice: LoansmasterService, private zone: NgZone) {


        this.dpConfig.containerClass = 'theme-dark-blue';
        this.dpConfig.dateInputFormat = 'DD/MM/YYYY';

        this.dpConfig.maxDate = new Date();   // as per bug no :68

        this.inlineCheckbox1 = false;
        this.inlineCheckbox2 = true;
        window['CallingFunctionOutsideAngular'] = {
            zone: this.zone,
            componentFn: (value, rowIndex) => this.EditDataTable(value, rowIndex),
            component: this,
        };
        window['CallingDeleteFunctionOutsideAngular'] = {
            zone: this.zone,
            componentFn: (value, rowIndex) => this.DeleteRowFromTable(value, rowIndex),
            component: this,
        };
        window['angularComponentReference'] = {
            zone: this.zone,
            componentFn: (value) => this.functiontocurrencyformat(value),
            component: this,
        };
        window['deleteError'] = {
            zone: this.zone,
            componentFn: (value) => this.deleteError(),
            component: this,
        };

        this.dateCustomClasses = [
            { date: this.bsValue, classes: ['date-cst'] }
        ];

    }

    deleteError() {

        this.LoanConfiguration.controls['pApplicanttype'].setErrors(null);

    }
    SetError() {



    }
    ngOnInit() {

debugger
this.data='';
        this.ContactType = "Individual";
        $('#MultiSelctdropdown').on("select2:selecting", function (e) {

            window['deleteError'].componentFn();
        });
        this.LoanAmountCheck = false;
        this.TenureCheck = false;
        this.TfromCheck = false;
        this.TLoanAmountCheck = false;
        this.applicantTypesPush = [];
        this.TotalGridData = [];

        this.ShowAddIcon = true;
        this.ShowEditIcon = false;
        this._loanmasterservice.GetApplicanttypes(this.ContactType, 0).subscribe(json => {

            if (json) {

                this.ApplicantTypes = json

                $("#MultiSelctdropdown").select2({
                    placeholder: "Multi Select",
                    allowClear: true,
                    data: json
                });

            }
        })

debugger
        this._loanmasterservice._FindingValidationsBetweenComponents().subscribe(() => {
            debugger;
            var GridData = $('#LoanConfigurationTable').DataTable().rows().data();
            let Newdata = [];
            debugger
            GridData = GridData.filter(function (Data) { Newdata.push(Data) });
            this._loanmasterservice._addDataToLoanMaster(Newdata, "loansconfiguration")

        });

        this.PageLoad();

        this.LoanConfiguration.controls.pEffectfromdate.setValue(new Date())
    }
    ChangeContactType(type) {

        if (type == "Individual") {
            this.ContactType = type;
            let ApplicantTypes = this.ApplicantTypes
            $("#MultiSelctdropdown").empty();
            $("#MultiSelctdropdown").select2({
                placeholder: "Multi Select",
                allowClear: true,
                data: ApplicantTypes
            });
        } else if (type == "Business Entity") {
            this.ContactType = type;
            var Bdata = [
                {
                    id: "Business Entity",
                    text: 'Business Entity'
                }
            ];
            $("#MultiSelctdropdown").empty();
            $("#MultiSelctdropdown").select2({
                placeholder: "Multi Select",
                allowClear: true,
                data: Bdata
            });
        }

    }

    datechange(value: Date) {

        this.dateCustomClasses = [
            { date: value, classes: ['date-cst'] }
        ];
    }
    changevalue(value) {

        this.LoanPayinPeriod = value;
    }
    GridBinding(griddata) {

debugger
        let tablename = '#LoanConfigurationTable'

        if (this.GridDataInIt != null) {
            this.GridDataInIt.destroy();
        }
        debugger
        $('#LoanConfigurationTable tbody').off('click', 'tr');
        this.GridDataInIt = $(tablename).DataTable({
            language: { searchPlaceholder: "Search leads", search: "" },
            "bDestroy": true,
            'columnDefs': [
                {
                    'targets': [1, 13, 14, 15],
                    "visible": false,
                    "searchable": false

                }
            ],
            "processing": true,
            "bPaginate": false,
            "bInfo": false,
            "bFilter": false,
            'select': {
                'style': 'multi',
            },
            responsive: true,
            data: griddata,
            dom: 'Bfrtip',
            columns: this.TableColumnsDynamic,
            initComplete: function () {

                var $buttons = $('.dt-buttons').hide();
            },
            rowCallback: function (row, data, index) {

                if (data.ptypeofoperation != "OLD") {
                    row.cells[10].style.display = " pointer-events: none;";

                }

            }
        });
        let Newdatatable = this.GridDataInIt
debugger
        $('#LoanConfigurationTable tbody').on('click', 'tr', function (e) {


            let rowIndex = Newdatatable.row(this).index();
            let ClickValue = e.target.id;
            if (ClickValue == "icon-edit") {
                var data = Newdatatable.row(this).data();
                window['CallingFunctionOutsideAngular'].componentFn(data, rowIndex);
            }
            else if (ClickValue == "icon-delete") {

                var data = Newdatatable.row(this).data();
                if (data["ptypeofoperation"] == "CREATE") {
                    Newdatatable.rows(this).remove().draw();
                }
                else {

                    window['CallingDeleteFunctionOutsideAngular'].componentFn(data, rowIndex);
                }
            }
        });


    }
    _validatingMinAndMaxAndFromAndTo() {

        if (this.LoanConfiguration.controls['pMinloanamount'].value != null && this.LoanConfiguration.controls['pMaxloanamount'].value != null) {
            if (this.LoanConfiguration.controls['pMinloanamount'].value.toString().replace(/,/g, "") == "" && this.LoanConfiguration.controls['pMaxloanamount'].value.toString().replace(/,/g, "") == "") {

                this.LoanConfiguration.get("pMinloanamount").setValidators(null);
                this.LoanConfiguration.get("pMinloanamount").updateValueAndValidity();
                this.LoanConfiguration.get("pMaxloanamount").setValidators(null);
                this.LoanConfiguration.get("pMaxloanamount").updateValueAndValidity();

            }
            else {

                if (this.LoanConfiguration.controls['pMinloanamount'].value != null && this.LoanConfiguration.controls['pMaxloanamount'].value != null) {
                    if (parseFloat(this.LoanConfiguration.controls['pMinloanamount'].value.toString().replace(/,/g, "")) >= parseFloat(this.LoanConfiguration.controls['pMaxloanamount'].value.toString().replace(/,/g, "")) || this.LoanConfiguration.controls['pMinloanamount'].value == "" || this.LoanConfiguration.controls['pMinloanamount'].value == 0 && parseFloat(this.LoanConfiguration.controls['pMaxloanamount'].value.toString().replace(/,/g, "")) > 0) {

                        this.LoanConfiguration.get("pMinloanamount").setValue('');
                        this.LoanConfiguration.get("pMaxloanamount").setValue('');
                        this.LoanConfiguration.get("pMinloanamount").setValidators([Validators.required]);
                        this.LoanConfiguration.get("pMinloanamount").updateValueAndValidity();
                    }
                    if (this.LoanConfiguration.controls['pMaxloanamount'].value == "") {

                        this.LoanConfiguration.get("pMaxloanamount").setValidators([Validators.required]);
                        this.LoanConfiguration.get("pMaxloanamount").updateValueAndValidity();
                    }
                }
            }

        }
        else {

            this.LoanConfiguration.get("pMinloanamount").setValidators(null);
            this.LoanConfiguration.get("pMinloanamount").updateValueAndValidity();
            this.LoanConfiguration.get("pMaxloanamount").setValidators(null);
            this.LoanConfiguration.get("pMaxloanamount").updateValueAndValidity();


        }


        if (parseInt(this.LoanConfiguration.controls['pTenurefrom'].value) == 0 && parseInt(this.LoanConfiguration.controls['pTenureto'].value) == 0 || (this.LoanConfiguration.controls['pTenurefrom'].value) == 0 && (this.LoanConfiguration.controls['pTenureto'].value) == 0) {

            this.LoanConfiguration.get("pTenurefrom").setValidators(null);
            this.LoanConfiguration.get("pTenurefrom").updateValueAndValidity();
            this.LoanConfiguration.get("pTenureto").setValidators(null);
            this.LoanConfiguration.get("pTenureto").updateValueAndValidity();

        }
        else {

            if (parseInt(this.LoanConfiguration.controls['pTenurefrom'].value) >= parseInt(this.LoanConfiguration.controls['pTenureto'].value) || this.LoanConfiguration.controls['pTenurefrom'].value == "" || this.LoanConfiguration.controls['pTenurefrom'].value == 0 && this.LoanConfiguration.controls['pTenureto'].value > 0) {

                this.LoanConfiguration.get("pTenurefrom").setValue('');
                this.LoanConfiguration.get("pTenureto").setValue('');
                this.LoanConfiguration.get("pTenurefrom").setValidators([Validators.required]);
                this.LoanConfiguration.get("pTenurefrom").updateValueAndValidity();
            }
            if (this.LoanConfiguration.controls['pTenureto'].value == "") {


                this.LoanConfiguration.get("pTenureto").setValidators([Validators.required]);
                this.LoanConfiguration.get("pTenureto").updateValueAndValidity();
            }

        }

    }


    AddDataToDataTable() {
        debugger
        this.submitted = true;
        let dropdowndata = $("#MultiSelctdropdown").val();
        if (dropdowndata != null) {
            if (dropdowndata.length > 0) {
                this.LoanConfiguration.controls["pApplicanttype"].setValue(dropdowndata);
            }
            else {
                this.LoanConfiguration.controls["pApplicanttype"].setValue('');
            }
        }
        else {
            this.LoanConfiguration.controls["pApplicanttype"].setValue('');
            this.LoanConfiguration.controls["pApplicanttype"].setValidators([Validators.required]);
        }
        
        this._validatingMinAndMaxAndFromAndTo();
        if(this.LoanConfiguration.controls.pIsamountrangeapplicable.value==false){
             this.LoanConfiguration.get("pMinloanamount").setValidators([Validators.required]);
            this.LoanConfiguration.get("pMinloanamount").updateValueAndValidity();
            this.LoanConfiguration.get("pMaxloanamount").setValidators([Validators.required]);
            this.LoanConfiguration.get("pMaxloanamount").updateValueAndValidity()
        }
        else{
          this.LoanConfiguration.get("pMinloanamount").setValidators(null);
            this.LoanConfiguration.get("pMinloanamount").updateValueAndValidity();
            this.LoanConfiguration.get("pMaxloanamount").setValidators(null);
            this.LoanConfiguration.get("pMaxloanamount").updateValueAndValidity()
        }
        if(this.LoanConfiguration.controls.pIstenurerangeapplicable.value==false){
             this.LoanConfiguration.get("pTenurefrom").setValidators([Validators.required]);
            this.LoanConfiguration.get("pTenurefrom").updateValueAndValidity();
            this.LoanConfiguration.get("pTenureto").setValidators([Validators.required]);
            this.LoanConfiguration.get("pTenureto").updateValueAndValidity();
        }else{
             this.LoanConfiguration.get("pTenurefrom").setValidators(null);
            this.LoanConfiguration.get("pTenurefrom").updateValueAndValidity();
            this.LoanConfiguration.get("pTenureto").setValidators(null);
            this.LoanConfiguration.get("pTenureto").updateValueAndValidity();
        }
        this.ValidateMinMaxRateofInterest();
        if (this.LoanConfiguration.valid) {



            //this.LoanConfiguration.controls["ptypeofoperation"].setValue("CREATE");
            for (var i = 0; i < dropdowndata.length; i++) {
                debugger;
                let latest_date = (this.LoanConfiguration.value["pEffectfromdate"]);
                this.LoanConfiguration.controls.pEffectfromdate.setValue(latest_date)
                let AmountApplicable = this.LoanConfiguration.value["pIsamountrangeapplicable"];
                let TenureApplicable = this.LoanConfiguration.value["pIstenurerangeapplicable"];

                if (this.LoanConfiguration.value["pIsamountrangeapplicable"] == false) { AmountApplicable = true; } else { AmountApplicable = false; }
                if (this.LoanConfiguration.value["pIstenurerangeapplicable"] == false) { TenureApplicable = true; } else { TenureApplicable = false; }

                let LoanConfigstring = { "pApplicanttype": this.LoanConfiguration.value["pLoanpayin"], "pLoanpayin": this.LoanConfiguration.value["pLoanpayin"], "pInteresttype": this.LoanConfiguration.value["pInteresttype"], "pRateofinterest": this.LoanConfiguration.value["pRateofinterest"],"pMininterest": this.LoanConfiguration.value["pMininterest"], "pMinloanamount": this.LoanConfiguration.getRawValue()["pMinloanamount"], "pMaxloanamount": this.LoanConfiguration.getRawValue()["pMaxloanamount"], "pTenurefrom": this.LoanConfiguration.getRawValue()["pTenurefrom"], "pTenureto": this.LoanConfiguration.getRawValue()["pTenureto"], "pEffectfromdate": this.LoanConfiguration.value["pEffectfromdate"], "ptypeofoperation": "CREATE", "pContacttype": this.ContactType, "pEffecttodate": this.LoanConfiguration.value["pEffecttodate"], pLoanconfigid: 0, pIsamountrangeapplicable: AmountApplicable, pIstenurerangeapplicable: TenureApplicable };

                dropdowndata[i] = dropdowndata[i]
                LoanConfigstring["pApplicanttype"] = dropdowndata[i];

                if (LoanConfigstring["pMaxloanamount"] == "" && LoanConfigstring["pMinloanamount"] == "" || LoanConfigstring["pMaxloanamount"] == null && LoanConfigstring["pMinloanamount"] == null) {
                    LoanConfigstring["pMaxloanamount"] = 0;
                    LoanConfigstring["pMinloanamount"] = 0;
                } else {
                    if (LoanConfigstring["pMaxloanamount"].toString().includes(',')) {
                        LoanConfigstring["pMaxloanamount"] = this.functiontoRemoveCommas(LoanConfigstring["pMaxloanamount"])
                    }
                    if (LoanConfigstring["pMinloanamount"].toString().includes(',')) {
                        LoanConfigstring["pMinloanamount"] = this.functiontoRemoveCommas(LoanConfigstring["pMinloanamount"])
                    }
                }
                if (LoanConfigstring["pTenurefrom"] == "" && LoanConfigstring["pTenureto"] == "") { LoanConfigstring["pTenurefrom"] = 0; LoanConfigstring["pTenureto"] = 0; }


                var GridData = this.GridDataInIt.rows().data();
                let griddatapush = [];
                let Grid = GridData.filter(function (data) {

                    if (data["pEffectfromdate"].length > 10) {
                        data["pEffectfromdate"] = data["pEffectfromdate"].substring(0, 10);
                    }
                    let configstring = { "pApplicanttype": data["pApplicanttype"], "pLoanpayin": data["pLoanpayin"], "pInteresttype": data["pInteresttype"], "pRateofinterest": data["pRateofinterest"],"pMininterest":data["pMininterest"], "pMinloanamount": data["pMinloanamount"], "pMaxloanamount": data["pMaxloanamount"], "pTenurefrom": data["pTenurefrom"], "pTenureto": data["pTenureto"], "pEffectfromdate": data["pEffectfromdate"], "ptypeofoperation": data["ptypeofoperation"], "pContacttype": data["pContacttype"], "pEffecttodate": data["pEffecttodate"], pLoanconfigid: 0, pIsamountrangeapplicable: data["pIsamountrangeapplicable"], pIstenurerangeapplicable: data["pIstenurerangeapplicable"] };

                    griddatapush.push(configstring);


                });


                var dataExist = JSON.stringify(griddatapush).includes(JSON.stringify(LoanConfigstring));
                let trueorfalse = false;
                let CheckLoanType = false;
                let CheckInterestRate=false;

                if (griddatapush.length > 0) {



                    for (var h = 0; h < griddatapush.length; h++) {

                        let TAmountApplicable = (griddatapush[h]["pIsamountrangeapplicable"]);
                        let TTenureApplicable = (griddatapush[h]["pIstenurerangeapplicable"]);

                        let Tfrom = parseFloat(griddatapush[h]["pTenurefrom"]);
                        let Tto = parseFloat(griddatapush[h]["pTenureto"]);
                        let TType = (griddatapush[h]["pApplicanttype"]);
                        let TPin = (griddatapush[h]["pLoanpayin"]);
                        let TIntrest = (griddatapush[h]["pInteresttype"]);
                        let TRateofintrest = (griddatapush[h]["pRateofinterest"]);
                        let TRateofintrestmin= (griddatapush[h]["pMininterest"]);
                        let TMaxloanamount = 0;
                        let TMinloanamount = 0;
                        if (griddatapush[h]["pMaxloanamount"] != null) { TMaxloanamount = parseFloat(griddatapush[h]["pMaxloanamount"].toString().replace(/,/g, "")); }
                        if (griddatapush[h]["pMinloanamount"] != null) { TMinloanamount = parseFloat(griddatapush[h]["pMinloanamount"].toString().replace(/,/g, "")); }

                        let Lfrom = parseFloat(LoanConfigstring["pTenurefrom"]);
                        let LTo = parseFloat(LoanConfigstring["pTenureto"]);
                        let LType = (LoanConfigstring["pApplicanttype"]);
                        let LPin = (LoanConfigstring["pLoanpayin"]);
                        let LIntrest = (LoanConfigstring["pInteresttype"]);
                        let LRateofintrest = (LoanConfigstring["pRateofinterest"]);
                        let LRateofintrestmin = (LoanConfigstring["pMininterest"]);
                        let LMaxloanamount = 0;
                        let LMinloanamount = 0;
                        if (LoanConfigstring["pTenurefrom"] == null || LoanConfigstring["pTenurefrom"] == "") { LoanConfigstring["pTenurefrom"] = 0; }
                        if (LoanConfigstring["pTenureto"] == null || LoanConfigstring["pTenureto"] == "") { LoanConfigstring["pTenureto"] = 0; }
                        if (LoanConfigstring["pMaxloanamount"] != null) { LMaxloanamount = parseFloat(LoanConfigstring["pMaxloanamount"].toString().replace(/,/g, "")); }
                        if (LoanConfigstring["pMinloanamount"] != null) { LMinloanamount = parseFloat(LoanConfigstring["pMinloanamount"].toString().replace(/,/g, "")); }


                   if(TType==LType && TIntrest==LIntrest && LPin==TPin){
                        if(this.validateRange(LRateofintrestmin,LRateofintrest,TRateofintrestmin,TRateofintrest)){
                            CheckInterestRate=true;
                        }
                        else{
                            CheckInterestRate=false;
                            }
                     }
                        if (TType == LType && TPin == LPin && TIntrest == LIntrest) {

                            if (Tfrom >= 0 && Tto >= 0 && TAmountApplicable == false && TTenureApplicable == true && Lfrom == 0 && LTo == 0 || Lfrom === undefined && LTo === undefined || Lfrom == null && LTo == null && LMinloanamount > 0 && LMaxloanamount > 0) {

                                CheckLoanType = true;

                            }
                            else {

                                if (TTenureApplicable == true) {

                                    this.LoanAmountCheck = false;
                                    this.TenureCheck = true;
                                }
                                else {
                                    this.LoanAmountCheck = true;
                                    this.TenureCheck = false;
                                }
                            }

                            if (Tfrom == 0 && Tto == 0 && TAmountApplicable == false && TTenureApplicable == true && Lfrom >= 0 && LTo >= 0 || Lfrom === undefined && LTo === undefined || Lfrom == null && LTo == null && LMinloanamount > 0 && LMaxloanamount > 0) {
                                CheckLoanType = true;
                            }
                            else {

                                if (TTenureApplicable == true) {
                                    this.LoanAmountCheck = false;
                                    this.TenureCheck = true;
                                }
                                else {
                                    this.LoanAmountCheck = true;
                                    this.TenureCheck = false;
                                }
                            }


                            if (TAmountApplicable == false && TTenureApplicable == true && LMinloanamount > 0 && LMaxloanamount > 0) {

                                CheckLoanType = true;

                            }
                            else {

                                if (TTenureApplicable == true) {
                                    this.LoanAmountCheck = false;
                                    this.TenureCheck = true;
                                }
                                else {
                                    this.LoanAmountCheck = true;
                                    this.TenureCheck = false;
                                }
                            }

                            if (TMinloanamount >= 0 && TMaxloanamount >= 0 && TTenureApplicable == false && TAmountApplicable == true && LMinloanamount == 0 && LMaxloanamount == 0 || LMinloanamount === undefined && LMaxloanamount === undefined || LMinloanamount == null && LMaxloanamount == null && Lfrom > 0 && LTo > 0) {

                                CheckLoanType = true;

                            }
                            else {

                                if (TAmountApplicable == true) {

                                    this.LoanAmountCheck = true;
                                    this.TenureCheck = false;
                                }
                                else {
                                    this.LoanAmountCheck = false;
                                    this.TenureCheck = true;
                                }
                            }

                            if (TMinloanamount == 0 && TMaxloanamount == 0 && TAmountApplicable == true && TTenureApplicable == false && LMinloanamount >= 0 && LMaxloanamount >= 0 || LMinloanamount === undefined && LMaxloanamount === undefined || LMinloanamount == null && LMaxloanamount == null && Lfrom > 0 && LTo > 0) {
                                CheckLoanType = true;
                            }
                            else {

                                if (TAmountApplicable == true) {

                                    this.LoanAmountCheck = true;
                                    this.TenureCheck = false;
                                }
                                else {
                                    this.LoanAmountCheck = false;
                                    this.TenureCheck = true;
                                }
                            }


                            if (TAmountApplicable == true && TTenureApplicable == false && Lfrom > 0 && LTo > 0) {

                                CheckLoanType = true;

                            }
                            else {


                                if (TAmountApplicable == true) {

                                    this.LoanAmountCheck = true;
                                    this.TenureCheck = false;
                                }
                                else {
                                    this.LoanAmountCheck = false;
                                    this.TenureCheck = true;
                                }
                            }
                            if (TAmountApplicable == true && TTenureApplicable == true) {


                                if (TMinloanamount >= 0 && TMaxloanamount >= 0 && LMinloanamount == 0 && LMaxloanamount == 0) {

                                    CheckLoanType = true;
                                }
                                else {

                                    if (TTenureApplicable == true) {
                                        this.LoanAmountCheck = false;
                                        this.TenureCheck = true;
                                    }
                                    else {
                                        this.LoanAmountCheck = true;
                                        this.TenureCheck = false;
                                    }
                                }

                                if (Tfrom >= 0 && Tto >= 0 && Lfrom == 0 && LTo == 0) {

                                    CheckLoanType = true;
                                }
                                else {

                                    if (TTenureApplicable == true) {
                                        this.LoanAmountCheck = false;
                                        this.TenureCheck = true;
                                    }
                                    else {
                                        this.LoanAmountCheck = true;
                                        this.TenureCheck = false;
                                    }
                                }
                                if (AmountApplicable == true && TenureApplicable == false || AmountApplicable == false && TenureApplicable == true) {

                                    CheckLoanType = true;
                                }
                                else {
                                    if (TTenureApplicable == true) {
                                        this.LoanAmountCheck = false;
                                        this.TenureCheck = true;
                                    }
                                    else {
                                        this.LoanAmountCheck = true;
                                        this.TenureCheck = false;
                                    }
                                }
                            }

                            if (TAmountApplicable == false && TTenureApplicable == false) {

                                if (TMinloanamount >= 0 && TMaxloanamount >= 0 && LMinloanamount >= 0 && LMaxloanamount >= 0) {

                                    CheckLoanType = true;
                                    this.LoanAmountCheck = false;
                                    this.TenureCheck = false;
                                }
                                if (AmountApplicable == true && TenureApplicable == false || AmountApplicable == false && TenureApplicable == true) {

                                    CheckLoanType = true;
                                    this.LoanAmountCheck = false;
                                    this.TenureCheck = false;
                                }

                            }









                            if (LMinloanamount >= TMinloanamount && LMinloanamount <= TMaxloanamount && this.LoanAmountCheck == true) {
                                trueorfalse = true;
                            }
                            if (LMaxloanamount >= TMinloanamount && LMaxloanamount <= TMaxloanamount && this.LoanAmountCheck == true) {
                                trueorfalse = true;
                            }
                            if ((LMaxloanamount) >= (TMaxloanamount) && (LMaxloanamount) <= (TMaxloanamount) && this.LoanAmountCheck == true) {
                                trueorfalse = true;
                            }
                            if ((LMinloanamount) <= (TMinloanamount) && (LMaxloanamount) >= (TMaxloanamount) && this.LoanAmountCheck == true) {
                                trueorfalse = true;
                            }

                            if (LTo >= Tfrom && LTo <= Tto && this.TenureCheck == true) {

                                trueorfalse = true;
                            }
                            if (Lfrom >= Tfrom && Lfrom <= Tto && this.TenureCheck == true) {

                                trueorfalse = true;
                            }
                            if ((LTo) >= (Tto) && (LTo) <= (Tto) && this.TenureCheck == true) {
                                trueorfalse = true;
                            }
                            if ((Lfrom) <= (Tfrom) && (LTo) >= (Tto) && this.TenureCheck == true) {
                                trueorfalse = true;
                            }
                            if ((Lfrom) >= (Tfrom) && (LTo) <= (Tto) && this.TenureCheck == true) {
                                trueorfalse = true;
                            }

                        }


                    }

                    if (dataExist == false && trueorfalse == false && CheckLoanType == false && CheckInterestRate ==false) {
                        LoanConfigstring["pEffectfromdate"] = this._commonservice.getFormatDate(LoanConfigstring["pEffectfromdate"]);

                        this.GridDataInIt.row.add(LoanConfigstring).draw().node();
                        this.TenureCheck = false;
                        this.LoanAmountCheck = false;
                    }
                     else{
                        this._commonservice.showWarningMessage('Already Exists.');
                        return;
                    }



                }

                if (griddatapush.length == 0) {
                    if (dataExist == false && trueorfalse == false && CheckLoanType == false && CheckInterestRate ==false) {
                        debugger;
                        LoanConfigstring["pEffectfromdate"] = this._commonservice.getFormatDate(LoanConfigstring["pEffectfromdate"]);
                        this.GridDataInIt.row.add(LoanConfigstring).draw().node();
                        this.TenureCheck = false;
                        this.LoanAmountCheck = false;
                    }
                    else{
                        this._commonservice.showWarningMessage('Already Exists.');
                        return;
                    }

                }

            }
            $('#MultiSelctdropdown').val(null).trigger('change');
            this.LoanConfiguration.reset();
            $("#inlineCheckbox2").prop('checked', true);
            $("#inlineCheckbox1").prop('checked', true);
            this.CheckBoxCheck1(true);
            this.CheckBoxCheck2(true);
            this.submitted = false;
            this.LoanConfiguration.clearValidators();
            this.LoanConfiguration.controls.pEffectfromdate.setValue(new Date())


            //this.LoanConfiguration.reset();
        }
        else {

        }

    }
    UpdateDataToDataTable() {
        debugger

        this.submitted = true;
        let index = this.rowIndex;
        let Loanconfigid=0;

        let dropdowndata = $("#MultiSelctdropdown").val();
        if (dropdowndata != null) {
            if (dropdowndata.length > 0) {
                this.LoanConfiguration.controls["pApplicanttype"].setValue(dropdowndata);
            }
            else {
                this.LoanConfiguration.controls["pApplicanttype"].setValue('');
            }
        }
        else {
            this.LoanConfiguration.controls["pApplicanttype"].setValue('');
            this.LoanConfiguration.controls["pApplicanttype"].setValidators([Validators.required]);


        }
        this._validatingMinAndMaxAndFromAndTo();
        if (this.LoanConfiguration.valid) {
       if(this.data){
           Loanconfigid=this.data["pLoanconfigid"];
       }

            for (var i = 0; i < dropdowndata.length; i++) {

                let latest_date = (this.LoanConfiguration.value["pEffectfromdate"]);
                this.LoanConfiguration.controls.pEffectfromdate.setValue(latest_date)
                let AmountApplicable;
                let TenureApplicable;

                if (this.LoanConfiguration.value["pIsamountrangeapplicable"] == false) { AmountApplicable = false; } else { AmountApplicable = true; }
                if (this.LoanConfiguration.value["pIstenurerangeapplicable"] == false) { TenureApplicable = false; } else { TenureApplicable = true; }

                let LoanConfigstring = { NewStataus: "", "pApplicanttype": "", "pLoanpayin": this.LoanConfiguration.value["pLoanpayin"], "pInteresttype": this.LoanConfiguration.value["pInteresttype"], "pMininterest": this.LoanConfiguration.value["pMininterest"],"pRateofinterest": this.LoanConfiguration.value["pRateofinterest"], "pMinloanamount": this.LoanConfiguration.getRawValue()["pMinloanamount"], "pMaxloanamount": this.LoanConfiguration.getRawValue()["pMaxloanamount"], "pTenurefrom": this.LoanConfiguration.getRawValue()["pTenurefrom"], "pTenureto": this.LoanConfiguration.getRawValue()["pTenureto"], "pEffectfromdate": this.LoanConfiguration.value["pEffectfromdate"], "ptypeofoperation": "UPDATE", "pContacttype": this.ContactType, "pEffecttodate": this.LoanConfiguration.value["pEffecttodate"], pLoanconfigid:Loanconfigid, pIsamountrangeapplicable: AmountApplicable, pIstenurerangeapplicable: TenureApplicable };
                let LEffectfromdate: any = this.datepipe.transform(LoanConfigstring["pEffectfromdate"], "dd/MM/yyyy");

                if (LEffectfromdate.includes("/") == true) {
                    LEffectfromdate = LEffectfromdate.split('/');
                    LEffectfromdate = LEffectfromdate[0] + '-' + LEffectfromdate[1] + '-' + LEffectfromdate[2]
                }

                dropdowndata[i] = dropdowndata[i]
                LoanConfigstring["pApplicanttype"] = dropdowndata[i];

                if (LoanConfigstring["pMaxloanamount"] == "" && LoanConfigstring["pMinloanamount"] == "" || LoanConfigstring["pMaxloanamount"] == null && LoanConfigstring["pMinloanamount"] == null) {
                    LoanConfigstring["pMaxloanamount"] = 0;
                    LoanConfigstring["pMinloanamount"] = 0;
                } else {
                    if (LoanConfigstring["pMaxloanamount"].toString().includes(',')) {
                        LoanConfigstring["pMaxloanamount"] = this.functiontoRemoveCommas(LoanConfigstring["pMaxloanamount"])
                    }
                    if (LoanConfigstring["pMinloanamount"].toString().includes(',')) {
                        LoanConfigstring["pMinloanamount"] = this.functiontoRemoveCommas(LoanConfigstring["pMinloanamount"])
                    }
                }
                if (LoanConfigstring["pTenurefrom"] == "" && LoanConfigstring["pTenureto"] == "") { LoanConfigstring["pTenurefrom"] = 0; LoanConfigstring["pTenureto"] = 0; }


                var GridData = this.GridDataInIt.rows().data();
               // this.GridDataInIt.rows(this.data).remove().draw();
               
             //   GridData.splice(this.rowIndex,1);
               // this.GridDataInIt.row.add(GridData).draw().node();
               // GridData = this.GridDataInIt.rows().data();
                //this.DeleteRowFromTable(this.data, this.rowIndex)
            //    this.GridDataInIt.rows().data().splice(this.rowIndex,1);
                let griddatapush = [];
                let Grid = GridData.filter(function (data) {
if(data["pEffectfromdate"]!=undefined){



                    if (data["NewStataus"] === undefined) { data["NewStataus"] = "Edit" }
                    data["pEffectfromdate"] = data["pEffectfromdate"].substring(0, 10);
                    let configstring = { "pApplicanttype": data["pApplicanttype"], "pLoanpayin": data["pLoanpayin"], "pInteresttype": data["pInteresttype"], "pRateofinterest": data["pRateofinterest"],"pMininterest": data["pMininterest"], "pMinloanamount": data["pMinloanamount"], "pMaxloanamount": data["pMaxloanamount"], "pTenurefrom": data["pTenurefrom"], "pTenureto": data["pTenureto"], "pEffectfromdate": data["pEffectfromdate"], "ptypeofoperation": data["ptypeofoperation"], "pContacttype": data["pContacttype"], "pEffecttodate": data["pEffecttodate"], "NewStataus": data["NewStataus"], pLoanconfigid:Loanconfigid, pIsamountrangeapplicable: data["pIsamountrangeapplicable"], pIstenurerangeapplicable: data["pIstenurerangeapplicable"] };

                  // if (configstring["pApplicanttype"] == LoanConfigstring["pApplicanttype"] && configstring["NewStataus"] == "Edit") {
                        configstring["NewStataus"] = "Edit";
                      //  griddatapush.push(configstring);

              //      }

            }
                });
          

                var dataExist = JSON.stringify(griddatapush).includes(JSON.stringify(LoanConfigstring));
                let trueorfalse = false;
                let CheckLoanType = false;
                let CheckInterestRate=false;

                if (griddatapush.length > 0) {


                    for (var h = 0; h < griddatapush.length; h++) {


                        let TAmountApplicable = (griddatapush[h]["pIsamountrangeapplicable"]);
                        let TTenureApplicable = (griddatapush[h]["pIstenurerangeapplicable"]);

                        let Tfrom = parseFloat(griddatapush[h]["pTenurefrom"]);
                        let Tto = parseFloat(griddatapush[h]["pTenureto"]);
                        let TType = (griddatapush[h]["pApplicanttype"]);
                        let TPin = (griddatapush[h]["pLoanpayin"]);
                        let TIntrest = (griddatapush[h]["pInteresttype"]);
                        let TRateofintrest = (griddatapush[h]["pRateofinterest"]);
                        let TRateofintrestmin= (griddatapush[h]["pMininterest"]);
                        let TMaxloanamount = 0;
                        let TMinloanamount = 0;
                        if (griddatapush[h]["pMaxloanamount"] != null) { TMaxloanamount = parseFloat(griddatapush[h]["pMaxloanamount"].toString().replace(/,/g, "")); }
                        if (griddatapush[h]["pMinloanamount"] != null) { TMinloanamount = parseFloat(griddatapush[h]["pMinloanamount"].toString().replace(/,/g, "")); }


                        let Ttypeofoperation = (griddatapush[h]["ptypeofoperation"]);
                        let tnewdate = griddatapush[h]["pEffectfromdate"].substr(0, 10).split('/')
                        let newt = '';
                        if (tnewdate[0].length == 1) { tnewdate[0] = '0' + tnewdate[0] }
                        if (tnewdate[1].length == 1) { tnewdate[1] = '0' + tnewdate[1] }
                        newt = tnewdate[2].trim() + '-' + tnewdate[0] + '-' + tnewdate[1]

                        let TEffectfromdate = (newt);

                        let Lfrom = parseFloat(LoanConfigstring["pTenurefrom"]);
                        let LTo = parseFloat(LoanConfigstring["pTenureto"]);
                        let LType = (LoanConfigstring["pApplicanttype"]);
                        let LPin = (LoanConfigstring["pLoanpayin"]);
                        let LIntrest = (LoanConfigstring["pInteresttype"]);
                        let LRateofintrest = (LoanConfigstring["pRateofinterest"]);
                        let LRateofintrestmin = (LoanConfigstring["pMininterest"]);
                        let LEffectfromdate: any = (LoanConfigstring["pEffectfromdate"]);
                        let LMaxloanamount = 0;
                        let LMinloanamount = 0;
                        if (LoanConfigstring["pTenurefrom"] == null || LoanConfigstring["pTenurefrom"] == "") { LoanConfigstring["pTenurefrom"] = 0; }
                        if (LoanConfigstring["pTenureto"] == null || LoanConfigstring["pTenureto"] == "") { LoanConfigstring["pTenureto"] = 0; }
                        if (LoanConfigstring["pMaxloanamount"] != null) { LMaxloanamount = parseFloat(LoanConfigstring["pMaxloanamount"].toString().replace(/,/g, "")); }
                        if (LoanConfigstring["pMinloanamount"] != null) { LMinloanamount = parseFloat(LoanConfigstring["pMinloanamount"].toString().replace(/,/g, "")); }
                        

                        let date = LEffectfromdate.toString().split('-')
                        LEffectfromdate = date[2] + '-' + date[1] + '-' + date[0]
                        LEffectfromdate = new Date(LEffectfromdate);
                        let newTEffectfromdate = new Date(TEffectfromdate);

                           if(TType==LType && TIntrest==LIntrest && LPin==TPin){
                        if(this.validateRange(LRateofintrestmin,LRateofintrest,TRateofintrestmin,TRateofintrest)){
                            CheckInterestRate=true;
                        }
                        else{
                            CheckInterestRate=false;
                            }
                     }

                        if (LEffectfromdate <= newTEffectfromdate) {
                            if (TType == LType && TPin == LPin && TIntrest == LIntrest) {

                                if (Tfrom >= 0 && Tto >= 0 && TAmountApplicable == false && TTenureApplicable == true && Lfrom == 0 && LTo == 0 || Lfrom === undefined && LTo === undefined || Lfrom == null && LTo == null && LMinloanamount > 0 && LMaxloanamount > 0) {

                                    CheckLoanType = true;

                                }
                                else {

                                    if (TTenureApplicable == true) {

                                        this.LoanAmountCheck = false;
                                        this.TenureCheck = true;
                                    }
                                    else {
                                        this.LoanAmountCheck = true;
                                        this.TenureCheck = false;
                                    }
                                }

                                if (Tfrom == 0 && Tto == 0 && TAmountApplicable == false && TTenureApplicable == true && Lfrom >= 0 && LTo >= 0 || Lfrom === undefined && LTo === undefined || Lfrom == null && LTo == null && LMinloanamount > 0 && LMaxloanamount > 0) {
                                    CheckLoanType = true;
                                }
                                else {

                                    if (TTenureApplicable == true) {
                                        this.LoanAmountCheck = false;
                                        this.TenureCheck = true;
                                    }
                                    else {
                                        this.LoanAmountCheck = true;
                                        this.TenureCheck = false;
                                    }
                                }


                                if (TAmountApplicable == false && TTenureApplicable == true && LMinloanamount > 0 && LMaxloanamount > 0) {

                                    CheckLoanType = true;

                                }
                                else {

                                    if (TTenureApplicable == true) {
                                        this.LoanAmountCheck = false;
                                        this.TenureCheck = true;
                                    }
                                    else {
                                        this.LoanAmountCheck = true;
                                        this.TenureCheck = false;
                                    }
                                }

                                if (TMinloanamount >= 0 && TMaxloanamount >= 0 && TTenureApplicable == false && TAmountApplicable == true && LMinloanamount == 0 && LMaxloanamount == 0 || LMinloanamount === undefined && LMaxloanamount === undefined || LMinloanamount == null && LMaxloanamount == null && Lfrom > 0 && LTo > 0) {

                                    CheckLoanType = true;

                                }
                                else {

                                    if (TAmountApplicable == true) {

                                        this.LoanAmountCheck = true;
                                        this.TenureCheck = false;
                                    }
                                    else {
                                        this.LoanAmountCheck = false;
                                        this.TenureCheck = true;
                                    }
                                }

                                if (TMinloanamount == 0 && TMaxloanamount == 0 && TAmountApplicable == true && TTenureApplicable == false && LMinloanamount >= 0 && LMaxloanamount >= 0 || LMinloanamount === undefined && LMaxloanamount === undefined || LMinloanamount == null && LMaxloanamount == null && Lfrom > 0 && LTo > 0) {
                                    CheckLoanType = true;
                                }
                                else {

                                    if (TAmountApplicable == true) {

                                        this.LoanAmountCheck = true;
                                        this.TenureCheck = false;
                                    }
                                    else {
                                        this.LoanAmountCheck = false;
                                        this.TenureCheck = true;
                                    }
                                }


                                if (TAmountApplicable == true && TTenureApplicable == false && Lfrom > 0 && LTo > 0) {

                                    CheckLoanType = true;

                                }
                                else {


                                    if (TAmountApplicable == true) {

                                        this.LoanAmountCheck = true;
                                        this.TenureCheck = false;
                                    }
                                    else {
                                        this.LoanAmountCheck = false;
                                        this.TenureCheck = true;
                                    }
                                }
                                if (TAmountApplicable == true && TTenureApplicable == true) {


                                    if (TMinloanamount >= 0 && TMaxloanamount >= 0 && LMinloanamount == 0 && LMaxloanamount == 0) {

                                        CheckLoanType = true;
                                    }
                                    else {

                                        if (TTenureApplicable == true) {
                                            this.LoanAmountCheck = false;
                                            this.TenureCheck = true;
                                        }
                                        else {
                                            this.LoanAmountCheck = true;
                                            this.TenureCheck = false;
                                        }
                                    }

                                    if (AmountApplicable == true && TenureApplicable == false || AmountApplicable == false && TenureApplicable == true) {

                                        CheckLoanType = true;
                                    }
                                    else {
                                        if (TTenureApplicable == true) {
                                            this.LoanAmountCheck = false;
                                            this.TenureCheck = true;
                                        }
                                        else {
                                            this.LoanAmountCheck = true;
                                            this.TenureCheck = false;
                                        }
                                    }
                                }

                                if (TAmountApplicable == false && TTenureApplicable == false) {

                                    if (TMinloanamount >= 0 && TMaxloanamount >= 0 && LMinloanamount >= 0 && LMaxloanamount >= 0) {

                                        CheckLoanType = true;
                                        this.LoanAmountCheck = false;
                                        this.TenureCheck = false;
                                    }
                                    if (AmountApplicable == true && TenureApplicable == false || AmountApplicable == false && TenureApplicable == true) {

                                        CheckLoanType = true;
                                        this.LoanAmountCheck = false;
                                        this.TenureCheck = false;
                                    }

                                }

                                if (LMinloanamount >= TMinloanamount && LMinloanamount <= TMaxloanamount && this.LoanAmountCheck == true) {
                                    trueorfalse = true;
                                }
                                if (LMaxloanamount >= TMinloanamount && LMaxloanamount <= TMaxloanamount && this.LoanAmountCheck == true) {
                                    trueorfalse = true;
                                }
                                if ((LMaxloanamount) >= (TMaxloanamount) && (LMaxloanamount) <= (TMaxloanamount) && this.LoanAmountCheck == true) {
                                    trueorfalse = true;
                                }
                                if ((LMinloanamount) <= (TMinloanamount) && (LMaxloanamount) >= (TMaxloanamount) && this.LoanAmountCheck == true) {
                                    trueorfalse = true;
                                }

                                if (LTo >= Tfrom && LTo <= Tto && this.TenureCheck == true) {

                                    trueorfalse = true;
                                }
                                if (Lfrom >= Tfrom && Lfrom <= Tto && this.TenureCheck == true) {

                                    trueorfalse = true;
                                }
                                if ((LTo) >= (Tto) && (LTo) <= (Tto) && this.TenureCheck == true) {
                                    trueorfalse = true;
                                }
                                if ((Lfrom) <= (Tfrom) && (LTo) >= (Tto) && this.TenureCheck == true) {
                                    trueorfalse = true;
                                }
                                if ((Lfrom) >= (Tfrom) && (LTo) <= (Tto) && this.TenureCheck == true) {
                                    trueorfalse = true;
                                }

                            }
                        }
                        // if (dataExist == false && trueorfalse == false && CheckLoanType == false && CheckInterestRate ==false) {

                        //     LoanConfigstring["ptypeofoperation"] = "CREATE";
                        //     debugger
                        //     let newEffectTodate = new Date(LoanConfigstring["pEffectfromdate"]);
                        //     newEffectTodate.setDate(newEffectTodate.getDate() - 1);
                        //     let EffectTodate = this.datepipe.transform(newEffectTodate, 'dd/MM/yyyy')
                        //     griddatapush[0]["pEffecttodate"] = EffectTodate;
                        //     griddatapush[0]["ptypeofoperation"] = "UPDATE";
                        //     this.GridDataInIt.row(this.rowIndex).data(griddatapush[0]).draw();
                        //     LoanConfigstring["pEffectfromdate"] = this._commonservice.getFormatDate(LoanConfigstring["pEffectfromdate"]);
                        //     this.GridDataInIt.row.add(LoanConfigstring).draw().node();

                        //     this.TenureCheck = false;
                        //     this.LoanAmountCheck = false;

                        // }
                    //     else{
                    //     this._commonservice.showWarningMessage('Already Exists.');
                    //     return;
                    // }
                    }





                }

                if (griddatapush.length == 0) {
                    let aa=this.GridDataInIt;
                    let aaa=this.GridDataInIt.row;
                    if (dataExist == false && trueorfalse == false && CheckLoanType == false && CheckInterestRate ==false) {
                        LoanConfigstring["pEffectfromdate"] = this._commonservice.getFormatDate(LoanConfigstring["pEffectfromdate"]);
                        this.GridDataInIt.row(this.data).remove().draw();
                        this.GridDataInIt.row.add(LoanConfigstring).draw().node();
                    GridData = this.GridDataInIt.rows().data();
                //    this.DeleteRowFromTable(GridData, this.rowIndex)
                //      this.GridDataInIt.rows().data().splice(this.rowIndex,1);
                //         this.TenureCheck = false;
                //         this.LoanAmountCheck = false;
                    }

                }

            }
            $('#MultiSelctdropdown').val(null).trigger('change');
            this.LoanConfiguration.reset();
            this.submitted = false;
            $("#inlineCheckbox2").prop('checked', false);
            $("#inlineCheckbox1").prop('checked', false);
            this.LoanConfiguration.controls['pMinloanamount'].enable();
            this.LoanConfiguration.controls['pMaxloanamount'].enable();
            this.LoanConfiguration.controls['pTenurefrom'].enable();
            this.LoanConfiguration.controls['pTenureto'].enable();
            this.LoanConfiguration.clearValidators();
            this.ShowEditIcon = false;
            this.ShowAddIcon = true;
            this.LoanConfiguration.controls.pEffectfromdate.setValue(new Date())
        }


    }
    DeleteRowFromTable(Data, rowIndex) {

        Data["ptypeofoperation"] = "DELETE";
        Data["pStatusname"] = "In-Active";
        this.GridDataInIt.row(rowIndex).data(Data).draw();

    }
    public functiontoRemoveCommas(value) {
        let a = value.split(',')
        let b = a.join('')
        let c = b
        return c;
    }
    EditDataTable(data, rowIndex) {
        debugger;
        this.data='';
        this.rowIndex =null;
        this.data=null;
        this.ShowEditIcon = true;
        this.ShowAddIcon = false;
        this.rowIndex = rowIndex;
        this.data=data;
        this.ChangeContactType(data["pContacttype"]);
        if (data["pContacttype"] == "Individual") {
            $("#inlineRadio1").prop("checked", true);
            $("#inlineRadio2").prop("checked", false);
        }
        if (data["pContacttype"] == "Business Entity") {
            $("#inlineRadio2").prop("checked", true);
            $("#inlineRadio1").prop("checked", false);
        }

        var $exampleMulti = $("#MultiSelctdropdown").select2();
        $exampleMulti.val([data["pApplicanttype"]]).trigger("change");
        var GridData = this.GridDataInIt.rows().data();
        GridData[rowIndex]["NewStataus"] = "Edit";
        //let date = data["pEffectfromdate"].substr(0, 10).split('/');

        //date = date[2].trim() + '-' + date[0] + '-' + date[1];

        let date = this._commonservice.formatDateFromDDMMYYYY(data["pEffectfromdate"])
        this.dpConfig.minDate = new Date(date);

        //if (data["pIsamountrangeapplicable"] == false) { data["pIsamountrangeapplicable"] = true } else { data["pIsamountrangeapplicable"] = false; }
        //if (data["pIstenurerangeapplicable"] == false) { data["pIstenurerangeapplicable"] = true; } else { data["pIstenurerangeapplicable"] = false; }
        this.LoanConfiguration.setValue({ "pApplicanttype": data["pApplicanttype"], "pLoanpayin": data["pLoanpayin"], "pInteresttype": data["pInteresttype"],"pMininterest": data["pMininterest"] ?  data["pMininterest"] : 0, "pRateofinterest": data["pRateofinterest"], "pMinloanamount": data["pMinloanamount"], "pMaxloanamount": data["pMaxloanamount"], "pTenurefrom": data["pTenurefrom"], "pTenureto": data["pTenureto"], "pEffectfromdate": date, "ptypeofoperation": "", "pContacttype": data["pContacttype"], "pEffecttodate": data["pEffecttodate"], pIsamountrangeapplicable: data["pIsamountrangeapplicable"], pIstenurerangeapplicable: data["pIstenurerangeapplicable"] });
        if (data["pMinloanamount"] == 0 && data["pMaxloanamount"] == 0) {
            $("#inlineCheckbox2").prop('checked', true);
            this.LoanConfiguration.controls['pMinloanamount'].setValue(0);
            this.LoanConfiguration.controls['pMaxloanamount'].setValue(0);

            this.LoanConfiguration.controls['pMinloanamount'].disable();
            this.LoanConfiguration.controls['pMaxloanamount'].disable();
        }
        else {
            $("#inlineCheckbox2").prop('checked', false);
            this.LoanConfiguration.controls['pMinloanamount'].enable();
            this.LoanConfiguration.controls['pMaxloanamount'].enable();

            if (data["pMaxloanamount"].toString().includes(',')) {
                this.LoanConfiguration.controls['pMaxloanamount'].setValue(this.functiontoRemoveCommas(data["pMaxloanamount"]))

            } else {
                this.LoanConfiguration.controls['pMaxloanamount'].setValue(this.functiontocurrencyformat(data["pMaxloanamount"]))
            }
            if (data["pMinloanamount"].toString().includes(',')) {
                this.LoanConfiguration.controls['pMinloanamount'].setValue(this.functiontoRemoveCommas(data["pMinloanamount"]))
            } else {
                this.LoanConfiguration.controls['pMinloanamount'].setValue(this.functiontocurrencyformat(data["pMinloanamount"]))
            }
        }
        if (data["pTenurefrom"] == 0 && data["pTenureto"] == 0) {

            $("#inlineCheckbox1").prop('checked', true);
            this.LoanConfiguration.controls['pTenurefrom'].setValue(0);
            this.LoanConfiguration.controls['pTenureto'].setValue(0);
            this.LoanConfiguration.controls['pTenurefrom'].disable();
            this.LoanConfiguration.controls['pTenureto'].disable();
        }
        else {
            $("#inlineCheckbox1").prop('checked', false);
            this.LoanConfiguration.controls['pTenurefrom'].enable();
            this.LoanConfiguration.controls['pTenureto'].enable();

        }

    }

    NextTabClick() {
        debugger
        var GridData = $('#LoanConfigurationTable').DataTable().rows().data();
        //GridData.length

        for (var i = 0; i < GridData.length; i++) {
            let date = GridData[i].pEffectfromdate
            if (date.toString().includes('/')) {
                GridData[i].pEffectfromdate = this._commonservice.formatDateFromDDMMYYYY(date)
            }
        }

        let Newdata = [];
        GridData = GridData.filter(function (Data) { Newdata.push(Data) });
        this._loanmasterservice._addDataToLoanMaster(Newdata, "loansconfiguration")
        let str = "InstallmentdueDate"
        this._loanmasterservice._SetSelectTitileInLoanCreation("Installment Due Date")
        $('.nav-item a[href="#' + str + '"]').tab('show');

    }

    CheckBoxCheck1(Value) {

        var checked = Value
         this.LoanConfiguration.get("pMinloanamount").setValidators(null);
                this.LoanConfiguration.get("pMinloanamount").updateValueAndValidity();
                this.LoanConfiguration.get("pMaxloanamount").setValidators(null);
                this.LoanConfiguration.get("pMaxloanamount").updateValueAndValidity();
        if (checked == true) {
            this.LoanConfiguration.controls['pMinloanamount'].setValue(0);
            this.LoanConfiguration.controls['pMaxloanamount'].setValue(0);

            this.LoanConfiguration.controls['pMinloanamount'].disable();
            this.LoanConfiguration.controls['pMaxloanamount'].disable();
        }
        else {
            this.LoanConfiguration.controls['pMinloanamount'].setValue('');
            this.LoanConfiguration.controls['pMaxloanamount'].setValue('');

            this.LoanConfiguration.controls['pMinloanamount'].enable();
            this.LoanConfiguration.controls['pMaxloanamount'].enable();
        }

    }
    CheckBoxCheck2(Value) {

        var checked = Value
        this.TenureChecked = Value;
        this.LoanConfiguration.get("pTenurefrom").setValidators(null);
                this.LoanConfiguration.get("pTenurefrom").updateValueAndValidity();
                this.LoanConfiguration.get("pTenureto").setValidators(null);
                this.LoanConfiguration.get("pTenureto").updateValueAndValidity();
        if (checked == true) {
            this.LoanConfiguration.controls['pTenurefrom'].setValue(0);
            this.LoanConfiguration.controls['pTenureto'].setValue(0);
            this.LoanConfiguration.controls['pTenurefrom'].disable();
            this.LoanConfiguration.controls['pTenureto'].disable();
        }
        else {
            this.LoanConfiguration.controls['pTenurefrom'].setValue('');
            this.LoanConfiguration.controls['pTenureto'].setValue('');
            this.LoanConfiguration.controls['pTenurefrom'].enable();
            this.LoanConfiguration.controls['pTenureto'].enable();
        }
    }

    PageLoad() {




        this.test = "test";
        this.LoanconfigData = [];
        this.LoanConfiguration = new FormGroup({
            pApplicanttype: new FormControl('', Validators.required),
            pLoanpayin: new FormControl('', Validators.required),
            pInteresttype: new FormControl('', Validators.required),
            pMininterest:new FormControl('', Validators.required),
            pRateofinterest: new FormControl('', Validators.required),
            pMinloanamount: new FormControl(''),
            pMaxloanamount: new FormControl(''),
            pTenurefrom: new FormControl(''),
            pTenureto: new FormControl(''),
            pEffectfromdate: new FormControl('', Validators.required),
            ptypeofoperation: new FormControl(),
            pContacttype: new FormControl("Individual"),
            pEffecttodate: new FormControl(null),
            pIsamountrangeapplicable: new FormControl(true),
            pIstenurerangeapplicable: new FormControl(true)


        });

        this.TableColumnsDynamic = [

            {
                "title": "S.No.", "data": null,
                render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },

            { "title": "Type Of Operation", "data": "ptypeofoperation", className: 'ptypeofoperation' },
            { "title": "Applicant type", "data": "pApplicanttype", className: 'loantype' },
            { "title": "Pay in", "data": "pLoanpayin", className: 'loanname' },
            { "title": "Interest Rate Type", "data": "pInteresttype", className: 'cancelloancodedate' },
            { "title": "Min. Interest Rate", "data": "pMininterest", className: 'status' },
            { "title": "Max. Interest Rate", "data": "pRateofinterest", className: 'status' },
            {
                "title": "Min Loan Amt", "data": "pMinloanamount", className: 'loantype', "render": function (data) {
                    return window['angularComponentReference'].componentFn(data)
                }
            },
            {
                "title": "Max Loan Amt", "data": "pMaxloanamount", className: 'loanname', "render": function (data) {
                    return window['angularComponentReference'].componentFn(data)
                }
            },
            { "title": "Tenure from", "data": "pTenurefrom", className: 'cancelloancodedate' },
            { "title": "Tenure to", "data": "pTenureto", className: 'status' },
            {
                "title": "Effective From", type: 'datetime',
                def: function () {

                    return new Date();
                },

                format: 'dd/MM/yyyy', "data": "pEffectfromdate", className: 'status'

            },

            {
                "title": "", "data": "null", "mData": null,
                "bSortable": false,
                "mRender": function (data, type, full) {

                    var str = ''
                    if (data.ptypeofoperation == "OLD" || data.ptypeofoperation == "UPDATE") {

                        str = '<a  src=""><div id="icon-edit"></div></a>';
                    }
                    else {

                        str = '<a  src=""><div id="icon-edit-disable"></div></a>';
                    }
                    return str;
                }
            },
            {
                "title": "", "data": "null", "mData": null,
                "bSortable": false,
                "mRender": function (data, type, full) {

                    var str = ''
                    if (data.ptypeofoperation != "DELETE") {

                        str = '<a  src=""><div id="icon-delete"></div></a>';
                    }
                    else {

                        str = '<a  src=""><div id="icon-edit-disable"></div></a>';
                    }
                    return str;
                    //return '<a (click)="datatableclick()" src=""><div id="icon-delete"></div></a>';
                }
            },
            { "title": "pLoanconfigid", "data": "pLoanconfigid", className: 'pLoanid' },

            { "title": "Amount Applicable", "data": "pIsamountrangeapplicable", className: 'pIsamountrangeapplicable' },

            { "title": "Tenure Applicable", "data": "pIstenurerangeapplicable", className: 'pIstenurerangeapplicable' }
        ];


        this._loanmasterservice._getLoanpayins().subscribe(json => {

            if (json) {
                this.Loanpayins = json

            }
        });
        this._loanmasterservice._getLoanInterestratetypes().subscribe(json => {

            if (json) {
                this.LoanInterestratetypes = json
            }
        });

        let Data = [];
        let type = this._loanmasterservice.GetButtonClickType();
        if (type == "Edit") {

            let Edit_data = this._loanmasterservice.GetDatatableRowEditClick()
            Data = Edit_data.loanconfigurationlist;
            console.log(Data)
            Data.filter(bb => {
                bb.pEffectfromdate = this._commonservice.formatDateFromDDMMYYYY(bb.pEffectfromdate);
                bb.pEffectfromdate = this.datepipe.transform(bb.pEffectfromdate, 'dd/MM/yyyy')
            })
        }
        //this._loanmasterservice.GetNameCodeData().subscribe(json => {
        // 

        //});


        this.GridBinding(Data);
        this.CheckBoxCheck1(true);
        this.CheckBoxCheck2(true);
    }

    public functiontocurrencyformat(value) {

        if (value == null) { value = 0; }
        //let currencyformat= this.cookieservice.get("savedformat")
        let currencyformat = "India"
        if (currencyformat == "India") {


            // this.symbol = this.cookieservice.get("symbolofcurrency")
            var result = value.toString().split('.');
            var lastThree = result[0].substring(result[0].length - 3);
            var otherNumbers = result[0].substring(0, result[0].length - 3);
            if (otherNumbers != '')
                lastThree = ',' + lastThree;
            var output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
            if (result.length > 1) {
                output += "." + result[1];
            }
            return output
            // return  this.symbol+"  "+output
        }
        else {
            // this.symbol = this.cookieservice.get("symbolofcurrency")
            var result = value.toString().split('.');
            var lastThree = result[0].substring(result[0].length - 3);
            var otherNumbers = result[0].substring(0, result[0].length - 3);
            if (otherNumbers != '')
                lastThree = ',' + lastThree;
            var output = otherNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + lastThree;
            if (result.length > 1) {
                output += "." + result[1];
            }
            //return this.symbol+"  "+output
        }

    }

    ClearForm() {

        $('#MultiSelctdropdown').val(null).trigger('change');
        this.LoanConfiguration.reset();
        $("#inlineCheckbox2").prop('checked', false);
        $("#inlineCheckbox1").prop('checked', false);
        this.LoanConfiguration.controls['pMinloanamount'].enable();
        this.LoanConfiguration.controls['pMaxloanamount'].enable();
        this.LoanConfiguration.controls['pTenurefrom'].enable();
        this.LoanConfiguration.controls['pTenureto'].enable();
        this.submitted = false;
        this.LoanConfiguration.clearValidators();
        $('#LoanConfigurationTable').DataTable().clear().destroy();
        this.GridDataInIt=null;
    }
MinRate_Change(event){
    debugger;
    if(event.target.value && event.target.value>0 ){

    }
    else{
       this.LoanConfiguration.controls.pMininterest.setValue('');
        this.LoanConfiguration.controls.pMininterest.errors.required=true;
        return; 
    }
}
MaxRate_Change(event){
    debugger;
    if(event.target.value && event.target.value>0 ){

    }
    else{
        this.LoanConfiguration.controls.pRateofinterest.setValue('');
        this.LoanConfiguration.controls.pRateofinterest.errors.required=true;
        return; 
    }
}

ValidateMinMaxRateofInterest(){
    debugger;
    let maxRateofInterest:any=0;
    let MinRateofInterest:any=0;
    if(parseFloat(this.LoanConfiguration.controls.pRateofinterest.value)>0){
      maxRateofInterest=this.LoanConfiguration.controls.pRateofinterest.value;
    }
    else{
    maxRateofInterest=0;
    }
     if(parseFloat(this.LoanConfiguration.controls.pMininterest.value)>0){
      MinRateofInterest=this.LoanConfiguration.controls.pMininterest.value;
    }
    else{
    MinRateofInterest=0;
    }
    if(this.LoanConfiguration.controls.pRateofinterest.value){
    if(parseFloat(this.LoanConfiguration.controls.pRateofinterest.value)>0){  
    if(parseFloat(MinRateofInterest)>parseFloat(maxRateofInterest)){
        this._commonservice.showWarningMessage('Max. Rate of Interest must be greater than or equal to Min. Rate of Interest.')
        this.LoanConfiguration.controls.pMininterest.setValue('');
        this.LoanConfiguration.controls.pMininterest.errors.required=true;
        return;
    }
    }
    else{
        this._commonservice.showWarningMessage('Max. Rate of Interest must be greater than Zero.')
        this.LoanConfiguration.controls.pRateofinterest.setValue('');
        this.LoanConfiguration.controls.pRateofinterest.errors.required=true;
        return; 
    }
    }
}

validateRange(entered1, entered2, previous1, previous2) {
    debugger;
    let isValid = false;
    if ((entered1) >= (previous1) && (entered1) <= (previous2)) {
      isValid = true;
    }
    else if ((entered2) >= (previous1) && (entered2) <= (previous2)) {
      isValid = true;
    }
    else if ((entered1) <= (previous1) && (entered2) >= (previous2)) {
      isValid = true;
    }
  else if ((entered1) >= (previous1) && (entered2) <= (previous2)) {
     
      isValid = true;
    }
    else if ((entered1) >= (previous1) && (entered1) <= (previous2) && (entered2) >= (previous2)) {
      isValid = true;
    }
    else if ((entered1) <= (previous1) && (entered2) <= (previous2) && (entered2) >= (previous1)) {
      isValid = true;
    }
    else {
      isValid = false;
    }
    return isValid;
  }

}
