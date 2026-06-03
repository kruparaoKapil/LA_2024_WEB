import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-achievedpreview',
  templateUrl: './achievedpreview.component.html',
  styles: []
})
export class AchievedpreviewComponent implements OnInit {
projectData: any[] = [];
  previewData: any[] = [];
  achiData: any[] = [];
  groupedData: any[] = [];
  nextMonths: string[] = [];
  totalRow: { [key: string]: number } = {};

  constructor() { }

  ngOnInit() {
    debugger;
    const data = sessionStorage.getItem('previewHeadingData');
    this.projectData = data ? JSON.parse(data) : [];
    const data1 = sessionStorage.getItem('previewAchievedData');
    this.achiData = data1 ? JSON.parse(data1) : [];
    console.log("Projection Data:", this.projectData);
    console.log("Achieved Data:", this.achiData);

    const grouped: { [key: string]: any } = {};

    this.achiData.forEach(item => {
      if (!grouped[item.schemename]) {
        grouped[item.schemename] = { name: item.schemename, projections: {} };
      }

      grouped[item.schemename].projections[item.targetmonth] = {
        projection: item.targetamount,
        achieved: item.achievedamount,
        variance: item.variance,
      };
    });


    this.groupedData = Object.values(grouped);

    //  Extract all unique months (sorted)
    const monthSet = new Set(this.achiData.map(d => d.targetmonth));
   this.nextMonths = Array.from(monthSet);

  }

}







