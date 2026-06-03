import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-projections-preview',
  templateUrl: './projections-preview.component.html',
  styles: []
})


export class ProjectionsPreviewComponent implements OnInit {

  previewData: any[] = [];
  groupedData: any[] = [];
  nextMonths: string[] = [];
  totals: { [key: string]: number } = {};

  ngOnInit() {

    const data = sessionStorage.getItem('previewData');
    this.previewData = data ? JSON.parse(data) : [];

    console.log('Preview Data:', this.previewData);

    sessionStorage.removeItem('previewData');

    if (this.previewData.length === 0) {
      return;
    }
    this.nextMonths = Array.from(
      new Set(this.previewData.map(d => d.projectionMonth)));

    const grouped: { [key: string]: any } = {};

    this.previewData.forEach(item => {
      if (!grouped[item.productName]) {
        grouped[item.productName] = {
          name: item.productName,
          projections: {}
        };
      }
      grouped[item.productName].projections[item.projectionMonth] =
        Number(item.projectionAmount) || 0;
    });

    this.groupedData = Object.values(grouped);

    this.calculateColumnTotals();
  }

  calculateColumnTotals() {
     this.totals = {};
    this.nextMonths.forEach(month => {
      let sum = 0;
      this.groupedData.forEach(row => {
        sum += Number(row.projections[month]) || 0;
      });
      this.totals[month] = sum;
    });
    console.log('Column Totals:', this.totals);
}
}


  // previewData: any[] = [];
  // groupedData: any[] = [];
  // nextMonths: string[] = [];
  //  totalRow: { [key: string]: number } = {}; 
  // totals: {};

  // ngOnInit() {
  //   const data = sessionStorage.getItem('previewData');
  //   this.previewData = data ? JSON.parse(data) : [];

  //   console.log("Preview Data:", this.previewData);
  //   sessionStorage.removeItem('previewData')
  //   //  Group data by product name
  //   const grouped: { [key: string]: any } = {};
  //   this.previewData.forEach(item => {
  //     if (!grouped[item.productName]) {
  //       grouped[item.productName] = { name: item.productName, projections: {} };
  //     }
  //     grouped[item.productName].projections[item.projectionMonth] = item.projectionAmount;
  //   });

  //   this.groupedData = Object.values(grouped);

  //   //  Extract all unique months (sorted)
  //   const monthSet = new Set(this.previewData.map(d => d.projectionMonth));
  //   this.nextMonths = Array.from(monthSet);
  //   //  Calculate totals for each column (month)
  //   this.calculateColumnTotals();
  // }
    
  //   //  ADD THIS BLOCK to calculate total per month
  // //  
  //  calculateColumnTotals() {
  //   this.totals = {};
  //   this.nextMonths.forEach(month => {
  //     let sum = 0;
  //     this.groupedData.forEach(row => {
  //       sum += Number(row.projections[month]) || 0;
  //     });
  //     this.totals[month] = sum;
  //   });
  //   console.log('Column Totals:', this.totals);
  // }
  
//}





 