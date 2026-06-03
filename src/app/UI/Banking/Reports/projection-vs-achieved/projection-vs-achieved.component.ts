import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BrStatementService } from 'src/app/Services/Accounting/br-statement.service';
import { LAReportsService } from 'src/app/Services/Banking/lareports.service';
import { CommonService } from 'src/app/Services/common.service';
import { ProfessionaltaxService } from 'src/app/Services/HRMS/Reports/professionaltax.service';
import { UsersService } from 'src/app/Services/Settings/Users/Users.service';

@Component({
  selector: 'app-projection-vs-achieved',
  templateUrl: './projection-vs-achieved.component.html',
  styles: []
})
export class ProjectionVsAchievedComponent implements OnInit {
  projectionReprintForm: FormGroup;
  savebutton: string = 'Generate Report';
  isLoading: boolean = false;
  tabledisable: boolean = false;
  responseData: any = [];
  noRecords: boolean = false;
  groupedData: any[] = [];
  today: Date = new Date();
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  nextMonths: any = [];
  months: any = [];
  monthDataMap: any = {};
  //totals:{};
  totals: any = [];
  Math = Math;
  projectionsAndAchievements: any = {};
  saleOfUnitsRow: any;

  constructor(private fb: FormBuilder, private datepipe: DatePipe, private _LAReportsService: LAReportsService,
    private _usersService: UsersService, private _CommonService: CommonService, private _ptaxservice: ProfessionaltaxService) {
    this.dpConfig.showWeekNumbers = false;
    this.dpConfig.maxDate = new Date();
    this.dpConfig.minMode = 'month';
    this.dpConfig.dateInputFormat = 'MMM-YYYY';
  }

  ngOnInit() {
    let date = this.datepipe.transform(this.today, 'MMM-yyyy')
    console.log('latest date:', date);
    this.projectionReprintForm = this.fb.group({
      Month: [date, Validators.required]

    });
  }

  DateChange($event) {
    const selectedMonth = this.datepipe.transform($event, 'MMM-yyyy');
    console.log('Selected Month:', selectedMonth);
  }

  onOpenCalendar(container) {
    if (container && container.setViewMode) {
      container.setViewMode('month');
    }
  }

  GenerateReport() {
    debugger;
    this.isLoading = true;
    this.nextMonths = [];
    const selectedMonth = this.projectionReprintForm.value.Month;
    const selectedmonth = this.datepipe.transform(selectedMonth, 'MMM-yyyy');
    this._LAReportsService.GetProductionTargetData(selectedmonth).subscribe(
      (res) => {
        this.responseData = res;
        this.isLoading = false;
        console.log('Response:', this.responseData);

        if (this.responseData.length === 0) {
          this.noRecords = true;
          this._CommonService.showWarningMessage("No Records");
          this.tabledisable = false;
          return;
        }

        this.tabledisable = true;
        this.months = Array.from(new Set(this.responseData.map(x => x.ptargetmonth)));

        // group by scheme
        const grouped: any = {};

        this.responseData.forEach(x => {
          if (!grouped[x.pschemename]) {
            grouped[x.pschemename] = { name: x.pschemename, data: {} };
          }

          grouped[x.pschemename].data[x.ptargetmonth] = {
            projection: x.projection,
            achieved: x.achieved,
            variance: x.variance,
          };
        });

        this.groupedData = Object.values(grouped);

        const saleOfUnitsRow = this.groupedData.find(x => x.name === 'Sale of Units');
        this.groupedData = this.groupedData.filter(x => x.name !== 'Sale of Units');
        this.saleOfUnitsRow = saleOfUnitsRow;

        this.calculateColumnTotals();
      },
    );
  }
  calculateColumnTotals() {
    this.totals = { projection: {}, achieved: {}, variance: {} };
    this.months.forEach(month => {
      let projectionSum = 0;
      let achievedSum = 0;
      let varianceSum = 0;

      this.groupedData.forEach(row => {

        if (row.name === 'Sale of Units') {
          return;
        }
        projectionSum += Number(row.data[month].projection) || 0;
        achievedSum += Number(row.data[month].achieved) || 0;
        varianceSum += Number(row.data[month].variance) || 0;
      });

    this.totals.projection[month] = projectionSum;
    this.totals.achieved[month] = achievedSum;
    this.totals.variance[month] = varianceSum;
  });

    console.log('Column Totals:', this.totals);
  }
}



























