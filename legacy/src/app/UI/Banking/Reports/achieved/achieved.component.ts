import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { LAReportsService } from 'src/app/Services/Banking/lareports.service';
import { CommonService } from 'src/app/Services/common.service';
import { UsersService } from 'src/app/Services/Settings/Users/Users.service';

@Component({
  selector: 'app-achieved',
  templateUrl: './achieved.component.html',
  styles: []
})
export class AchievedComponent implements OnInit {

  AchievedForm: FormGroup;
  selectedmonth: any;
  ProjectionReprintErrors: any;
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  // Month Picker
  minDate: Date;
  month: string;
  noRecords: boolean = false;
  months: any[] = [];
  savebutton = "Generate Report"
  today = new Date();
  tabledisable: boolean = false;
  savedisable: boolean = false;
  previewDataArray: any = [];

  monthPickerContainer: ElementRef;
  Data: any = []
  projData: any[] = [];
  @ViewChild('monthPickerContainer', { static: false })

  public isLoading = false;
  formattedmonth: string;
  schemenames: any[] = [];

  constructor(private fb: FormBuilder, private _usersService: UsersService,
    private _LAReportsService: LAReportsService, private datepipe: DatePipe,
    private _CommonService: CommonService) {
    this.dpConfig.showWeekNumbers = false;
    this.dpConfig.maxDate = new Date();
    this.dpConfig.minMode = 'month';
    this.dpConfig.dateInputFormat = 'MMM-YYYY';
  }

  ngOnInit() {

    let date = this.datepipe.transform(this.today, 'MMM-yyyy')
    console.log('latest date:', date);
    this.AchievedForm = this.fb.group({
      selectedMonth: [date],

    });

  }


  DateChange($event) {
    this.selectedmonth = this.datepipe.transform($event, 'MMM-yyyy');
  }

  onOpenCalendar(container) {
    if (container && container.setViewMode) {
      container.setViewMode('month');
    }
  }
  GetProjectData() {
    debugger;
    this.projData = [];

    this.formattedmonth = this.AchievedForm.controls.selectedMonth.value;
    this.selectedmonth = this.datepipe.transform(this.formattedmonth, 'MMM-yyyy');
    this._LAReportsService.GetProdAchievedData(this.selectedmonth).subscribe(res => {
      this.projData = res;
      console.log(this.projData);

      if (this.projData.length < 2) {
        this.noRecords = true;
        this._CommonService.showWarningMessage("No Records");
        this.tabledisable = false;
        this.savedisable = false;
        return;
      }
      this.tabledisable = true;
      this.savedisable = true;

    });
  }




  saveform() {
    debugger;

    const saveData = [];
    const allRequests = [];
    this.previewDataArray = []; // store all data for preview
    let id = 0;

    console.log(this.projData);

    this.projData.forEach((item, index) => {
      if (index === 0) return;

      saveData.push({
        id: id++,
        selectedMonth: this.selectedmonth,
        schemename: item.pschemename,
        targetmonth: this.projData[0].column1,
        targetamount: Number(item.column1),
        achievedamount: Number(item.achievedColumn1) || "0",
        variance: (Number(item.achievedColumn1) || 0) - (Number(item.column1) || 0)
      });
      saveData.push({
        id: id++,
        selectedMonth: this.selectedmonth,
        schemename: item.pschemename,
        targetmonth: this.projData[0].column2,
        targetamount: Number(item.column2),
        achievedamount: Number(item.achievedColumn2) || "0",
        variance: (Number(item.achievedColumn2) || 0) - (Number(item.column2) || 0)

      });

      saveData.push({
        id: id++,
        selectedMonth: this.selectedmonth,
        schemename: item.pschemename,
        targetmonth: this.projData[0].column3,
        targetamount: Number(item.column3),
        achievedamount: Number(item.achievedColumn3) || "0",
        variance: (Number(item.achievedColumn3) || 0) - (Number(item.column3) || 0)

      });
    });

    console.log('Save Payload:', saveData);
    this.previewDataArray.push(saveData); // collect all data
    allRequests.push(saveData);

    sessionStorage.setItem('previewAchievedData', JSON.stringify(saveData));

    this._usersService.SaveProjectionAchievedReport(saveData).subscribe(
      (res) => {
        console.log('Saved projection:', res);
        this._CommonService.showInfoMessage('Data saved');

        window.open('/#/Achievedpreview', '_blank');
        this.previewDataArray = []
        sessionStorage.setItem('previewHeadingData', JSON.stringify(this.projData));
        sessionStorage.setItem('previewAchievedData', JSON.stringify(this.previewDataArray));
      },
      (err) => {
        //console.error('Error saving projection:', err);
       // window.open('/#/Achievedpreview', '_blank');
        this._CommonService.showErrorMessage('Achieved Data already Exists for selected Month, \n Please take Reprint from ProjectionVsAcheived Form');
        sessionStorage.setItem('previewHeadingData', JSON.stringify(this.projData));
        sessionStorage.setItem('previewAchievedData', JSON.stringify(this.previewDataArray));
      }
    );
    this.tabledisable = false;
    this.savedisable = false;


  }
}




