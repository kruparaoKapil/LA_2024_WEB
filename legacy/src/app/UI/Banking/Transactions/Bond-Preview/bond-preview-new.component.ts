import { Component, OnInit, ViewChild } from '@angular/core';
import { FdRdTransactionsService } from 'src/app/Services/Banking/Transactions/fd-rd-transactions.service';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import { DatatableComponent, ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { CommonService } from 'src/app/Services/common.service';
import { ThreeDigitDecimaNumberDirective } from 'src/app/Directives/three-digit-decima-number.directive';
import { Page } from 'src/app/UI/Common/Paging/page'
import { FdTranscationDetailsComponent } from '../FD-AC-Creation/fd-transcation-details.component';
declare let $: any
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { State, GroupDescriptor, process } from '@progress/kendo-data-query';


@Component({
  selector: 'app-bond-preview-new',
  templateUrl: './bond-preview-new.component.html',
  styles: []
})

export class BondPreviewNewComponent implements OnInit
 {
  @ViewChild('myTable', { static: false })
  @ViewChild(FdTranscationDetailsComponent, { static: true }) fdTranscationDetailsComponent: FdTranscationDetailsComponent;
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  allRowsSelected: boolean;
  table: any;
  Savedrow:any=[]
  savedlist: { lstBonds_Print: any; };
  receipt: string;
  constructor(private _fdrdtranscationservice: FdRdTransactionsService,private commomservice:CommonService,private router:Router,private _fb:FormBuilder)
   {
    this.dpConfig.dateInputFormat = 'DD/MM/YYYY'
    this.dpConfig.maxDate = new Date();
    this.dpConfig.minDate = new Date();
    this.dpConfig.showWeekNumbers = false;
    this.allData = this.allData.bind(this);


    }
    selectedvalues:string=""
    selectedrow:any=[]
    check:boolean=false;
    duplicatecheck:boolean;
    selectallcheckbox:boolean
  gridData: any = [];
  Bondpreviewform: FormGroup;
  commencementgridPage = new Page();
  startindex: any;
  endindex: any;
  public columns: Array<object>;
  public ColumnMode = ColumnMode;
  public griddata: any=[]
  public temp: any=[];
  public pageSize = 10;
  public headerCells: any = {
    textAlign: 'center'
  };  ngOnInit() {


    debugger;
    this.commencementgridPage.pageNumber = 0
    this.commencementgridPage.size = 5;
    this.startindex = 0;
    this.endindex = this.commencementgridPage.size;
    this.commencementgridPage.totalElements = 5;
    this.selectallcheckbox=true;
    this.formgroup();
    this.columns = [
      { prop: 'pMembername'},
      { prop: 'pMembercode'},
      { prop: 'pFdname'},
      { prop: 'pFdaccountno'},
      { prop: 'pInterestpayout'},
      { prop: 'pTenor'},
      { prop: 'pDepositdate'},
      { prop: 'pInterestpayable'},
      { prop: 'pMaturitydate'},
      

    ];
   
    
  }

  formgroup()
  {
    this.Bondpreviewform=this._fb.group
    ({
      ptransdate:[new Date()]
    })
  }
  showdetails()
  {
    debugger;
    let date = new Date();
    this._fdrdtranscationservice.GetDataForBondPreview1(date).subscribe(json => {
      debugger;
      this.gridData = json;
     //let a= this.gridData.filter(s=>s.pFdaccountid==null)
     //this.gridData.splice(a,-1)
      this.griddata = this.temp =   this.gridData;
     
      
      this.gridData.filter(function (df) { df.pIscheck = false; });
     // this.gridData.filter(function (df) { df.pFdaccountid = "null"; });
      console.log("grid data",this.gridData)
      if(this.gridData)
      {
        this.selectallcheckbox=false
      }
   

    })
  }
  toggleExpandGroup(group) {
    debugger;
    console.log('Toggled Expand Group!', group);
    this.table.groupHeader.toggleExpandGroup(group);
  }  

  onDetailToggle(event) {
    console.log('Detail Toggled', event);
  }
  
  selectAll(event,row,rowIndex)
  {
     debugger;
     if(event.target.checked)
     {
       if(this.gridData.length!=0)
       {
        this.allRowsSelected=true;
        this.check=true;
        this.duplicatecheck=true;
        this.gridData.filter(function (df) { df.pIscheck = true; });
  
        for(let i=0;i<this.gridData.length;i++)
        {
          this.selectedrow.push(this.gridData[i].pnumappid);
          //this.selectedrow.push(this.gridData[i].pFdaccountid);
          let obj={pDeposit_id:this.gridData[i].pfdaccountid,
            pPrint_Date:this.Bondpreviewform.controls.ptransdate.value,pPrint_Status:"N"}
            this.Savedrow.push(obj);
          
        }
       }
      
     console.log("all selected rows",this.selectedrow)
      this.GeneratingValues()
     }
     else{
       this.check=false;
       this.duplicatecheck=false;
       this.gridData.filter(function (df) { df.pIscheck = false; });
       this.allRowsSelected=false;
       this.selectedrow=[];
       this.selectedvalues=""
     }
    
  }
  selectFdAccountno(event,row,rowIndex)
  {
    debugger;
    if(event.target.checked)
    {
      this.selectedrow.push(row.pnumappid);
      //this.selectedrow.push(row.pFdaccountid);
      let obj={pDeposit_id:row.pfdaccountid,
        pPrint_Date:this.Bondpreviewform.controls.ptransdate.value,pPrint_Status:"N"}
        this.Savedrow.push(obj);
      
       // let saveddata = Object.assign(this.chequemanagementform.value, chequemanagement);
   
    }
    else{
      this.selectedrow.splice(event.rowIndex, 1);
      this.allRowsSelected=false
    }
   console.log("after deleting",this.selectedrow)
    this.GeneratingValues()
    
    

  }
  SaveBondPreview()
  {
    debugger
    this.savedlist = { lstBonds_Print:  this.Savedrow };
    this._fdrdtranscationservice.SaveBondPreview(this.savedlist).subscribe(json=>{
      console.log(json)
      if(json)
      {
        this.GenerateReport();
        this.showdetails();
      }
     
  
    })
   
  }
  GeneratingValues()
  {
    debugger
    this.selectedvalues=""
    for(let i=0;i<this.selectedrow.length;i++){
      this.selectedvalues+='@'+this.selectedrow[i]+'@,';


    }
    this._fdrdtranscationservice.setfdaccountno(this.selectedrow);
    this.selectedvalues=this.selectedvalues.toString().replace(/@/g,"'").slice(0,-1)
    console.log("if all selected gng to api",this.selectedvalues)
  }
  GenerateReport()
  {
    // this.check=false;
    debugger
    //this.check=null;
    this.duplicatecheck = null;
    // this.duplicatecheck = false;
    if(this.selectedvalues!="")
    {
      this.receipt = btoa(this.selectedvalues);
      //this.showdetails();
      this.gridData.filter(function (df) { df.pIscheck = false; });
      window.open('/#/BondPreview?id=' + this.receipt);
      this.allRowsSelected=false;
      this.check=false;
      // this.duplicatecheck = true;
      setTimeout(() => {
        this.duplicatecheck=false;
      }, 200);
      this.selectedvalues="";
      this.selectedrow=[];
      //this.showdetails()
    }
    else if(this.gridData.length==0)
    {
      this.commomservice.showErrorMessage("Please Click on Show Button to View The Data")
    }
    else{
      this.commomservice.showErrorMessage("Please Select Atleast One Checkbox")
    }
   
    // this._fdrdtranscationservice.GetBondPreviewReport(this.selectedrow).subscribe(res=>{
    //   console.log("report result is",res);
    //   let receipt = btoa(this.selectedrow);
    //   // this._routes.navigate(['/GeneralReceiptReports', receipt]);
    //   window.open('/#/BondPreview/?id=' + receipt);
    // })
  }
  GetAccountDetails(DataItem) {
    debugger;

    this.fdTranscationDetailsComponent.BindData(DataItem.pnumappid,DataItem.pfdaccountid);
    $('#add-detail').modal('show');
  }
  updateFilter(event) {
    debugger;
    let val = event.currentTarget.value;
    const value = val.toString().toLowerCase().trim();
    const count = this.columns.length;
    const keys = Object.keys(this.temp[0]);
    this.griddata = this.temp.filter(item => {
      for (let i = 0; i < count; i++) {
        let datagrid = item[keys[i]].toString().toLowerCase().indexOf(value)
        if ((item[keys[i]] && item[keys[i]].toString().toLowerCase().indexOf(value) !== -1) || !value) {
          debugger
          return true;
        }
      }
    });
  }

  public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.griddata, {}).data
    };

    return result;
  }
}
