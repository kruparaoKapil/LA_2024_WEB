import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../../Services/common.service';
import { ToastrService } from 'ngx-toastr';
import { debug } from 'util';
import { DatePipe, JsonPipe } from '@angular/common';
import { LienEntryService } from '../../../Services/Banking/lien-entry.service';
import { LAReportsService } from '../../../Services/Banking/lareports.service';
import { Router } from '@angular/router';
import { AccountingTransactionsService } from '../../../Services/Accounting/accounting-transactions.service';
import { ExportAsService, ExportAsConfig, SupportedExtensions } from 'ngx-export-as';
import { FdReceiptService } from 'src/app/Services/Banking/Transactions/fd-receipt.service';
import { GroupDescriptor, DataResult, process } from '@progress/kendo-data-query';
@Component({
  selector: 'app-trend-report',
  templateUrl: './trend-report.component.html',
  styles: []
})
export class TrendReportComponent implements OnInit {
     public groups: GroupDescriptor[] = [{field:'pDepositype'}];
    MaturityTrendForm: FormGroup;   
    public savebutton = 'Show';
    public today: Date = new Date();
    returndata: any[];
    AsOn: any;  
    gridData: any = [];
    gridData1: any = [];
    //resultColumns: any[];
    resultColumns: any[] = [];
    validation = false;
    formValidationMessages: any;
    MaturityTrendErrors: any;
    table: any;
    public betweenorason = "Between";
    frommonthof: any;
   
    tomonthof: any;
    currentmonth: any;
    Detailsdata: any=[];
    showdetails: boolean = false
    public totalpcurrentmonth: any;
    public totalpcurrentmonth1: any;
    public totalpcurrentmonth2: any;
    public totalpcurrentmonth3: any;
    public totalpcurrentmonth4: any;
    public totalpcurrentmonth5: any;
    public totalpcurrentmonth6: any;
    public totalpcurrentmonth7: any;
    public totalpcurrentmonth8: any;
    public totalpcurrentmonth9: any;
    public totalpcurrentmonth10: any;
    public totalpcurrentmonth11: any;
    public totalpcurrentmonth12: any;
    public totalmaturityamount: any;
    showmonth: any;
    public dpAsOnConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();

    
    public aggregates: any[] = [{ field: "pcurrentmonth", aggregate: "sum" }, { field: "pcurrentmonth1", aggregate: "sum" }, { field: "pcurrentmonth2", aggregate: "sum" }, { field: "pcurrentmonth3", aggregate: "sum" }, { field: "pcurrentmonth4", aggregate: "sum" }, { field: "pcurrentmonth5", aggregate: "sum" }, { field: "pcurrentmonth6", aggregate: "sum" }, { field: "pcurrentmonth7", aggregate: "sum" }, { field: "pcurrentmonth8", aggregate: "sum" }, { field: "pcurrentmonth9", aggregate: "sum" }, { field: "pcurrentmonth10", aggregate: "sum" }, { field: "pcurrentmonth11", aggregate: "sum" }, { field: "pcurrentmonth12", aggregate: "sum" }];
    receipt: string;
    date: any;

       

    constructor(private FB: FormBuilder, private _CommonService: CommonService, private _LAReportsService: LAReportsService, private _FdReceiptService: FdReceiptService, private datepipe: DatePipe, private router: Router, private toastr: ToastrService, private exportAsService: ExportAsService) {
        this.dpAsOnConfig.dateInputFormat = 'MMM-YYYY'
        this.dpAsOnConfig.maxDate = new Date();
        this.dpAsOnConfig.showWeekNumbers = false;

       
    }

    ngOnInit() {
        debugger;
        this.MaturityTrendForm = this.FB.group({
            pAsOn: [this.today],
            
            

        })
        debugger;
        this.MaturityTrendErrors = {};
        this.ShowMaturityTrendGridHeader();
        this.showdetails = false;
       
    }
    
    public onOpenCalendar(container) {
        container.monthSelectHandler = (event: any): void => {
            container._store.dispatch(container._actions.select(event.date));
        };
        container.setViewMode('month');
    }
    ShowMaturityTrendGridHeader() {
        debugger;
        let isValid: boolean = true;        
        
        this.gridData.empty;
        this.gridData = [];
        this._LAReportsService.ShowMaturityTrendGridHeader().subscribe(result => {
            debugger;
            this.gridData = result;           
                       
        })
      
    }
    GetPrintMaturityTrend()
    {
        let a=this.datepipe.transform(this.MaturityTrendForm.controls.pAsOn.value,'MMM-yyyy')
        this.date=this.MaturityTrendForm.controls.pAsOn.value
        this.receipt = btoa(a);
       window.open('/#/Maturitytrenddetails?id='+ this.receipt)
       
    }
    GetShowMaturityTrend() {
        debugger;
        let isValid: boolean = true;
        this.showdetails = false;
        //if (this.showbtnvalidation) {
            this.gridData1.empty;
            this.gridData1 = [];
            this._LAReportsService.ShowMaturityTrendReport().subscribe(result => {
                debugger;
                this.gridData1 = result;
                
                console.log(this.gridData1);
                this.getColumnWisetotals();
                
            })
        //}
    }
    getMaturityDetails(DataItem, currentmonth) {
        debugger;
        this.showmonth = [];
        this.showmonth = currentmonth;
        this.Detailsdata.empty;
        this.Detailsdata = [];       
        this._LAReportsService.ShowShemeAndDatewiseDetails(DataItem.pschemename, currentmonth).subscribe(result => {
            debugger;
            this.Detailsdata = result;
            this.showdetails = true;
            this.getDetailsColumnWisetotals();
            
        })
    }
    getMaturityTotalDetails(currentmonth) {
        debugger;
        this.showmonth = [];
        this.showmonth = currentmonth;
        this.Detailsdata.empty;
        this.Detailsdata = [];
        this._LAReportsService.ShowGrandTotalDatewiseDetails(currentmonth).subscribe(result => {
            debugger;
            this.Detailsdata = result;
            this.showdetails = true;
            this.getDetailsColumnWisetotals();

        })
    }
    getDetailsColumnWisetotals() {
        if (this.Detailsdata.length > 0) {
            this.totalmaturityamount = this.Detailsdata.reduce((sum, c) => sum + c.pMaturityamount, 0);
            this.totalmaturityamount = parseFloat(this.totalmaturityamount)


        }
        else {
            this.totalmaturityamount = 0;

        }
    }
    getColumnWisetotals() {
        if (this.gridData1.length > 0) {
            this.totalpcurrentmonth = this.gridData1.reduce((sum, c) => sum + c.pcurrentmonth, 0);
            this.totalpcurrentmonth = parseFloat(this.totalpcurrentmonth)

            this.totalpcurrentmonth1 = this.gridData1.reduce((sum, c) => sum + c.pcurrentmonth1, 0);
            this.totalpcurrentmonth1 = parseFloat(this.totalpcurrentmonth1)

            this.totalpcurrentmonth2 = this.gridData1.reduce((sum, c) => sum + c.pcurrentmonth2, 0);
            this.totalpcurrentmonth2 = parseFloat(this.totalpcurrentmonth2)

            this.totalpcurrentmonth3 = this.gridData1.reduce((sum, c) => sum + c.pcurrentmonth3, 0);
            this.totalpcurrentmonth3 = parseFloat(this.totalpcurrentmonth3)

            this.totalpcurrentmonth4 = this.gridData1.reduce((sum, c) => sum + c.pcurrentmonth4, 0);
            this.totalpcurrentmonth4 = parseFloat(this.totalpcurrentmonth4)

            this.totalpcurrentmonth5 = this.gridData1.reduce((sum, c) => sum + c.pcurrentmonth5, 0);
            this.totalpcurrentmonth5 = parseFloat(this.totalpcurrentmonth5)

            this.totalpcurrentmonth6 = this.gridData1.reduce((sum, c) => sum + c.pcurrentmonth6, 0);
            this.totalpcurrentmonth6 = parseFloat(this.totalpcurrentmonth6)

            this.totalpcurrentmonth7 = this.gridData1.reduce((sum, c) => sum + c.pcurrentmonth7, 0);
            this.totalpcurrentmonth7 = parseFloat(this.totalpcurrentmonth7)

            this.totalpcurrentmonth8 = this.gridData1.reduce((sum, c) => sum + c.pcurrentmonth8, 0);
            this.totalpcurrentmonth8 = parseFloat(this.totalpcurrentmonth8)

            this.totalpcurrentmonth9 = this.gridData1.reduce((sum, c) => sum + c.pcurrentmonth9, 0);
            this.totalpcurrentmonth9 = parseFloat(this.totalpcurrentmonth9)

            this.totalpcurrentmonth10 = this.gridData1.reduce((sum, c) => sum + c.pcurrentmonth10, 0);
            this.totalpcurrentmonth10 = parseFloat(this.totalpcurrentmonth10)

            this.totalpcurrentmonth11 = this.gridData1.reduce((sum, c) => sum + c.pcurrentmonth11, 0);
            this.totalpcurrentmonth11 = parseFloat(this.totalpcurrentmonth11)

            this.totalpcurrentmonth12 = this.gridData1.reduce((sum, c) => sum + c.pcurrentmonth12, 0);
            this.totalpcurrentmonth12 = parseFloat(this.totalpcurrentmonth12)
        }
        else {
            this.totalpcurrentmonth = 0;
            this.totalpcurrentmonth1 = 0;
            this.totalpcurrentmonth2 = 0;
            this.totalpcurrentmonth3 = 0;
            this.totalpcurrentmonth4 = 0;
            this.totalpcurrentmonth5 = 0;
            this.totalpcurrentmonth6 = 0;
            this.totalpcurrentmonth7 = 0;
            this.totalpcurrentmonth8 = 0;
            this.totalpcurrentmonth9 = 0;
            this.totalpcurrentmonth10 = 0;
            this.totalpcurrentmonth11 = 0;
            this.totalpcurrentmonth12 = 0;
        }
    }
    pdf() {
        debugger;
        let temp;
        let rows = [];
        let reportname = "Maturity Trend";
        

        let colWidthHeight = {
            paccountname: { cellWidth: 'auto' }, ledger: { cellWidth: 'auto' }, popeningbal: { cellWidth: 'auto' }, pdebitamount: { cellWidth: 'auto' }, pcreditamount: { cellWidth: 'auto' }, pclosingbal: { cellWidth: 'auto' }
        }

        let data = "true"
        if (data == "true") {
            this.returndata = this._CommonService._getGroupingGridExportData(this.gridData1, "pschemename", false)
        }
        else {
            this.returndata = this.gridData1
        }
        let gridheaders = [this.gridData1[0]["pschemename"], this.gridData1[0]["pcurrentmonth"]];
        this.returndata.forEach(element => {
            debugger;
            let releasedate;

            if (element.group !== undefined) {
                temp = [element.group, element.pschemename, element.pcurrentmonth, element.pcurrentmonth1, element.pcurrentmonth2, element.pcurrentmonth3, element.pcurrentmonth4, element.pcurrentmonth5, element.pcurrentmonth6, element.pcurrentmonth7, element.pcurrentmonth8, element.pcurrentmonth9, element.pcurrentmonth10, element.pcurrentmonth11, element.pcurrentmonth12];



            }
            else {
                temp = [element.pschemename, element.pcurrentmonth, element.pcurrentmonth1, element.pcurrentmonth2, element.pcurrentmonth3, element.pcurrentmonth4, element.pcurrentmonth5, element.pcurrentmonth6, element.pcurrentmonth7, element.pcurrentmonth8, element.pcurrentmonth9, element.pcurrentmonth10, element.pcurrentmonth11, element.pcurrentmonth12];
            }

            rows.push(temp);
        });
        // pass Type of Sheet Ex : a4 or lanscspe  
        this._CommonService._downloadReportsPdf(reportname, rows, gridheaders, colWidthHeight, "landscape");

    }


    onDetailToggle(event) {
        console.log('Detail Toggled', event);
    }
    toggleExpandGroup(group) {
        console.log('Toggled Expand Group!', group);
        this.table.groupHeader.toggleExpandGroup(group);
    }  

   

}
