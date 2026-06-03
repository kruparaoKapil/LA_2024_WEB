import { Component, OnInit } from '@angular/core';
import { AgentForSaleService } from '../agent-for-sale.service';
import { State, process } from '@progress/kendo-data-query';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { CommonService } from 'src/app/Services/common.service';

@Component({
  selector: 'app-authorized-persons',
  templateUrl: './authorized-persons.component.html',
  styles: []
})
export class AuthorizedPersonsComponent implements OnInit {
  Usersdata: any = [];
  Userstempdata: any = [];
  loading: boolean = false;
  public pageSize = 10;


  constructor(private _agentforsaleService: AgentForSaleService, private commonService: CommonService) {
    this.allData = this.allData.bind(this);

  }

  ngOnInit() {
    debugger;
    this.getAuthorizedPersons();
  }

  getAuthorizedPersons() {
    this.loading = true;
    this._agentforsaleService.GetAuthorizedpersons1().subscribe(res => {
      this.Usersdata = res;
      this.Userstempdata = this.Usersdata;
      this.loading = false;

    })
  }


  status(data: any) {
    debugger;
    let status = data.pstatusid;
    if (status == 1) {
      status = 2;
    }
    else {
      status = 1;
    }

    let data1 = {
      "pcontactname": data.pcontactname,
      "pdesignation": "",
      "prolename": "",
      "pfathername": "",
      "pdob": "",
      "paddress": "",
      "pdocrefno": "",
      "pstatusid": status

    };

    this._agentforsaleService.saveAuthorizedPersons(data1).subscribe(resp => {
      this.commonService.showInfoMessage('Nominee Saved Successfully');
    })




  }

  onFilter(inputValue: string) {
    this.Usersdata = process(this.Userstempdata, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'pcontactname',
            operator: 'contains',
            value: inputValue
          }
        ],
      }
    }).data;
  }

  public allData(): ExcelExportData {

    const result: ExcelExportData = {
      data: process(this.Usersdata, { sort: [{ field: 'pcontactname', dir: 'desc' }] }).data
    };

    return result;
  }


}
