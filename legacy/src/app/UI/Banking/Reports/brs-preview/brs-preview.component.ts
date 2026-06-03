import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GroupDescriptor, SortDescriptor } from '@progress/kendo-data-query';
import { CommonService } from 'src/app/Services/common.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-brs-preview',
  templateUrl: './brs-preview.component.html',
  styles: []
})
export class BrsPreviewComponent implements OnInit {
  brsData: any = [];
  startDate: any;
  bankname: any;
  pBankBookBalance: any;
  chequesdepositedbutnotcredited: any;
  CHEQUESISSUEDBUTNOTCLEARED: any;
  Balanceasperbankbook: any;
  bankBalance: any;
  public aggregates: any[] = [{ field: 'ptotalreceivedamount', aggregate: 'sum' }];
  public groups: GroupDescriptor[] = [{ field: 'pGroupType', aggregates: this.aggregates }];
  public sort: SortDescriptor[] = [{
    field: 'ptransactiondate',
    dir: 'asc'
  }];
  fileName: any;
  fileType: any;
  path: string;
  branchId: any;
  branchName: any;
  showDocumentFlag: boolean = false;
  croppedImage: string;
  constructor(private activatedroute: ActivatedRoute, private http:HttpClient, private commonService:CommonService) { }

  ngOnInit() {
    debugger
    let branch =JSON.parse(sessionStorage.getItem('SetBranch'));
    this.branchId = branch.pbranch_id;
    this.branchName = branch.pbranch_name;
    let urldata = environment.apiURL;

    this.http.get(urldata).subscribe(res => {       
      let appspath = res[0]['ApiHostUrl'].split("/");
      this.path=appspath[0]+'//'+appspath[2]+'/Upload/'+ this.branchName+ '/Documents/';
      });
    let routeParams = atob(this.activatedroute.snapshot.queryParamMap.get('id'));
    let splitData = routeParams.split("@");
    this.brsData = JSON.parse(splitData[1]);
    this.startDate = splitData[2];
    this.bankname = splitData[3];
    this.pBankBookBalance = splitData[4];
    this.chequesdepositedbutnotcredited = splitData[5];
    this.CHEQUESISSUEDBUTNOTCLEARED = splitData[6];
    this.Balanceasperbankbook = splitData[7];
    this.bankBalance = splitData[8];
    this.fileName = splitData[9];
    this.fileType = splitData[10];

    if(this.fileName != "undefined" && this.fileName != ''){
      this.showDocumentFlag = true;
    }
    else{
      this.showDocumentFlag = false;
    }
  }
  
  functionA(){
    debugger;
    if(this.fileName == "undefined" || this.fileName == ''){
      this.commonService.showWarningMessage('You Havent Uploaded Any Documents At The Time Of BRS Save');
      return
    }
    let openFile  = this.path + this.fileName;

    // if(this.fileType.toLowerCase() != 'png'){
      console.log(openFile);
      window.open(openFile, '_blank')
      
    // }
    // else{
    //   this.commonService.GetImage(openFile).subscribe(res=>{
    //     console.log("imageresponse",res);
    //     this.croppedImage = "data:image/png;base64," + res[0];
    //   })
    // }
    
  }

}
