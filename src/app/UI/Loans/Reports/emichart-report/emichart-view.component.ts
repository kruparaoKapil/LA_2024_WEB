import { Component, OnInit, ViewChild } from '@angular/core';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { DisbusementService } from '../../../../Services/Loans/Transactions/disbusement.service';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { ToastrService } from 'ngx-toastr';
import { State, process } from '@progress/kendo-data-query';
import { EmichartReportComponent } from './emichart-report.component';
@Component({
  selector: 'app-emichart-view',
  templateUrl: './emichart-view.component.html',
  styles: []
})
export class EmichartViewComponent implements OnInit {
  public EmichartData: any[];
  public EmichartList: any;
  public loading = true;
  public Vchapplicationid: any;
  public ShowEmichartReport: any;
  public pageSize = 10;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10
  };
  public headerCells: any = {
    textAlign: 'center'
  };
  @ViewChild(EmichartReportComponent, { static: false }) Emichartreport: EmichartReportComponent;
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  constructor(private Datepipe: DatePipe, private _routes: Router, private formbuilder: FormBuilder, private _CommonService: CommonService, private _DisbusementService: DisbusementService, public toaster: ToastrService, private activatedroute: ActivatedRoute) { }

  ngOnInit() {
    this.GetEmiChartview();
  }
  public GetEmiChartview() {
    
    this._DisbusementService.GetEmiChartViewData().subscribe(data => {
      
      this.EmichartData = data;
      this.EmichartData.filter(function (df) { df.pIsprimaryAccount = false; });
      this.EmichartList = this.EmichartData;

      this.loading = false;
    },
      (error) => {
        this.showErrorMessage(error);
      });
  }
  showErrorMessage(errormsg: string) {
    this._CommonService.showErrorMessage(errormsg);
  }

  showInfoMessage(errormsg: string) {
    this._CommonService.showInfoMessage(errormsg);
  }
  selectEmichartReport(dataItem, row) {
    
    this.EmichartData.filter(x => x.pIsprimaryAccount = false);
    this.EmichartData[row].pIsprimaryAccount = true;
    this.Vchapplicationid = dataItem['pVchapplicationID'];
    this.Emichartreport.Vchapplicationid = this.Vchapplicationid;
    this.Emichartreport.ngOnInit();
    this.ShowEmichartReport = "show";
  }
  onFilter(inputValue: string) {

    this.EmichartData = process(this.EmichartList, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'pVchapplicationID',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pApplicantname',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pApprovedloanamount',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pApplicantMobileNo',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pApplicantEmail',
            operator: 'contains',
            value: inputValue
          }
        ],
      }
    }).data;
    this.dataBinding.skip = 0;
  } 
}
