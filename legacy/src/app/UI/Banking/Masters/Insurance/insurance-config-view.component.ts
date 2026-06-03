import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/Services/common.service';
import { InsuranceService } from 'src/app/Services/Insurance/insurance.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-insurance-config-view',
  templateUrl: './insurance-config-view.component.html',
  styles: []
})
export class InsuranceConfigViewComponent implements OnInit {

  constructor(private commonService: CommonService,
    private insuranceService: InsuranceService,
    private router: Router, private datePipe: DatePipe) { }

  insuranceView: any;
  public gridData = [];
  public gridView = [];
  public mySelection: string[] = [];
  public pageSize = 10;
  public skip = 0;
  public headerCells: any = {
    textAlign: 'center'
  };
  public isVisible: boolean = false;
  public dataItem:any;

  ngOnInit() {
    this.getInsurenceViewDetails();
    this.dataItem ={};
  }

  getInsurenceViewDetails() {
    try {
      this.insuranceService.getInsurenceViewDetails().subscribe(res => {
        if (res) {
          this.insuranceView = (res);
          for (let index = 0; index < this.insuranceView.length; index++) {
            let insuranceData = {
              sno: index + 1,
              pInsurenceconfigid: this.insuranceView[index].pInsurenceconfigid,
              pInsurencename: this.insuranceView[index].pInsurencename,
              pInsurencenamecode: this.insuranceView[index].pInsurencenamecode,
              pstatus: this.insuranceView[index].pstatus
            }
            this.gridData.push(insuranceData);
          }
          this.gridView = this.gridData;
          //  console.log('insurance details',res);
        }
      });
    } catch (error) {
      this.commonService.showErrorMessage(error);
    }
  }

  public removeHandler({ dataItem }) {
    // this.dataItem =dataItem;
    // this.showAlert()
    try {
      const index: number = this.gridView.indexOf(dataItem);
      if (index !== -1) {
        this.gridView.splice(index, 1);

      }
      this.insuranceService.deleteInsuranceConfigData(dataItem.pInsurenceconfigid).subscribe(res => {
        this.commonService.showInfoMessage('Successfully deleted');
      });
    } catch (error) {
      this.commonService.showErrorMessage(error);
    }
  }
  // delete(){
  //   try {
  //     const index: number = this.gridView.indexOf(this.dataItem);
  //     if (index !== -1) {
  //       this.gridView.splice(index, 1);

  //     }
  //     this.insuranceService.deleteInsuranceConfigData(this.dataItem.pInsurenceconfigid).subscribe(res => {
  //       this.commonService.showInfoMessage('Successfully deleted');
  //     });
  //   } catch (error) {
  //     this.commonService.showErrorMessage(error);
  //   }
  // }
  editHandler(event) {
    let objUrl ={
      insurenceName:event.dataItem.pInsurencename,
      insurenceNameCode:event.dataItem.pInsurencenamecode
    }
    this.router.navigateByUrl('/InsuranceConfigNew/'+btoa(JSON.stringify(objUrl)));
  }

  // showAlert() : void {
  //   if (this.isVisible) { 
  //     return;
  //   } 
  //   this.isVisible = true;
  //   // setTimeout(()=> this.isVisible = false,1200000)
  // }

}
