import { Component, OnInit, ViewChild} from '@angular/core';
import { formatDate, DatePipe } from '@angular/common';
import { AcknowledgementsService } from '../../../../Services/Loans/Transactions/acknowledgements.service';
import { CommonService } from '../../../../Services/common.service';
import { State, process } from '@progress/kendo-data-query';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { ToastrService } from 'ngx-toastr';
import { from } from 'rxjs';


import { Router } from '@angular/router';

@Component({
  selector: 'app-acknowledgements-new',
  templateUrl: './acknowledgements-new.component.html',
  styles: []
})
export class AcknowledgementsNewComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  constructor(private datepipe: DatePipe, private _AcknowledgementsService: AcknowledgementsService, private _CommonService: CommonService,private toastr: ToastrService) {

    this.allData = this.allData.bind(this);
   }
  AcknowledgementLetter: any;
  loading=false;
  loadingletters=false;
  Savebbutton=false;
  date: any;
  today: any;
  yettosend: any;
  send: any;
  ApplicantId: any;
  ApplicantName: any;
  ApplicantEmail: any;
  ApplicantMobileno: any;
  Loanname: any;
  Loanamount: any;
  Loanid: any;
  Vchapplicationid: any;
  Titlename: any;
  Applicationdate: any;
  public pageSize = 10;
  AcknowledgementLetterData: any
  AcknowledgementLetterIdData: any = [];
  AcknowledgementLettersemdData: any = [];
  AcknowledgementLetternotsendData: any = [];
  AcknowledgementLettersemdtempData: any = [];
  AcknowledgementLetternotsendtempData: any = [];
  ALetterData: any = [];
  allroters:any=[];
  routertep:any=[];
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10
  };
  public headerCells: any = {
    textAlign: 'center'
  };
  ngOnInit() {
    this.Savebbutton=true;
    this.date = new Date();
    this.today = this.datepipe.transform(this.date, 'd/MM/y');
    
    this.AcknowledgementLetter = '';
    this.GetAllAcknowledgementLetter();
  }
  
  GetAllAcknowledgementLetter() {
    this.loading=true;
    this._AcknowledgementsService.GetAcknowledgementLetter().subscribe(data => {
      this.AcknowledgementLetterData = data;

      this.AcknowledgementLetterData.filter(function (df) { df.pIsprimaryAccount = false; });

      this.AcknowledgementLetternotsendData = this.AcknowledgementLetterData.filter(c => c.pSentstatus == "Not Sent");
      this.yettosend = this.AcknowledgementLetternotsendData.length;
      this.AcknowledgementLetternotsendtempData = this.AcknowledgementLetternotsendData;
      this.ALetterData=this.AcknowledgementLetternotsendData;
      this.AcknowledgementLettersemdData = this.AcknowledgementLetterData.filter(c => c.pSentstatus == "Sent");
      this.AcknowledgementLettersemdtempData = this.AcknowledgementLettersemdData;
      this.send = this.AcknowledgementLettersemdData.length;
      this.loading=false;
    });
  }
  Clicknotsend(){
    this.Savebbutton=true;
    this.AcknowledgementLetternotsendData='';
    this.ALetterData='';
    this.AcknowledgementLetter = '';
    this.GetAllAcknowledgementLetter();
  }
  Clicksend(){
    
    this.Savebbutton=false;
    this.AcknowledgementLettersemdData='';
    this.AcknowledgementLetter = '';
    this.ALetterData='';
    this.GetAllAcknowledgementLetter();
  }
  radioselectedtosend(dataItem, row, typedata) {
    debugger
    this.loadingletters=true;
    //console.log(event)
    if (typedata == 'notsend') {

      let i = -1;
      this.AcknowledgementLetternotsendData.filter(function (df) {
        i++;
        if (row == i) {
          df.pIsprimaryAccount = true;
        }
        else {
          df.pIsprimaryAccount = false;
        }
      });
    }
    else {
      let i = -1;
      this.AcknowledgementLettersemdData.filter(function (df) {
        i++;
        if (row == i) {
          df.pIsprimaryAccount = true;
        }
        else {
          df.pIsprimaryAccount = false;
        }
      });
    }

    debugger;
    this.AcknowledgementLetterIdData=dataItem;
    this.Loanid = dataItem.pLoanid;
    this.Loanname = dataItem.pLoanname;
    this.ApplicantId = dataItem.pApplicantid;
    this.ApplicantName = dataItem.pApplicantname;
    this.ApplicantEmail = dataItem.pEmail;
    this.ApplicantMobileno = dataItem.pMobileno;
    this.Loanname = dataItem.pLoanname;
    this.Vchapplicationid = dataItem.pVchapplicationid;
    this.Loanamount = dataItem.pLoanamount;
    this.Titlename = dataItem.pTitlename;
    this.Applicationdate =dataItem.pApplicationdate;
    this.AcknowledgementLetter = 'show';
    this.loadingletters=false;

  }
  sendtoemail() {
   let transDate = this.datepipe.transform(this.date, 'y-M-d');
    let data = { "pApplicantid": this.ApplicantId, "pVchapplicationid": this.Vchapplicationid, "pApplicantname": this.ApplicantName, "pLoanamount": this.Loanamount, "pSentto": this.ApplicantEmail, "pSentstatus": 'Sent', "pTransDate": transDate, "psentthrough": "Email", "pCreatedby": this._CommonService.pCreatedby };

    this._AcknowledgementsService.SendAcknowledgementLetter(JSON.stringify(data)).subscribe(res => {
      this.GetAllAcknowledgementLetter();
    });
    this.AcknowledgementLetter = '';

  }

  sendtoSMS() {
    let transDate = this.datepipe.transform(this.date, 'y-M-d');
    let a = { "pApplicantid": this.ApplicantId, "pVchapplicationid": this.Vchapplicationid, "pApplicantname": this.ApplicantName,"pLoanid": this.Loanid,"pLoanname":this.Loanname,"pMobileno": this.ApplicantMobileno,"pEmail": this.ApplicantEmail,"pLoanamount": this.Loanamount, "pSentto": this.ApplicantMobileno, "pSentstatus": 'Sent', "pTransDate": transDate, "psentthrough": "Save", "pCreatedby": this._CommonService.pCreatedby };

    this._AcknowledgementsService.SendAcknowledgementLetter(JSON.stringify(a)).subscribe(res => {
      this.GetAllAcknowledgementLetter();
    });
    this.AcknowledgementLetter = '';

  }

  save(){
    
    let transDate = this.datepipe.transform(this.date, 'y-M-d');
    this.AcknowledgementLetterIdData['pTransDate']=transDate;
    this.AcknowledgementLetterIdData['psentthrough']='Save';
    this.AcknowledgementLetterIdData['pCreatedby']=this._CommonService.pCreatedby;
    this.AcknowledgementLetterIdData['pSentto']='Save';
    this.AcknowledgementLetterIdData['pSentstatus']='Sent';
    this._AcknowledgementsService.SendAcknowledgementLetter(JSON.stringify(this.AcknowledgementLetterIdData)).subscribe(res => {
      this.toastr.success("successfully Save", "Success");

      this.GetAllAcknowledgementLetter();
    });
    this.AcknowledgementLetter = '';
  }

  print() {

    let printContents, popupWin;
    printContents = document.getElementById('temp-box').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Acknowledgement Letter</title>
          <link rel="stylesheet" type="text/css" href="assets/css/bootstrap.min.css"/>
          <link rel="stylesheet" type="text/css" href="assets/css/custom.css" />
         
          <style>
          //........Customized style.......
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();


  }

  tab() {
    this.GetAllAcknowledgementLetter();
    this.ApplicantName = '';
    this.ApplicantEmail = '';
    this.ApplicantMobileno = '';
    this.Loanname = '';
    this.Vchapplicationid = '';
    this.Loanamount = '';
    this.AcknowledgementLetter = '';
  }
  onFilterNotsend(inputValue: string) {

    this.AcknowledgementLetternotsendData = process(this.AcknowledgementLetternotsendtempData, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'pVchapplicationid',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pApplicantname',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pLoanamount',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pMobileno',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pEmail',
            operator: 'contains',
            value: inputValue
          }
        ],
      }
    }).data;
    this.dataBinding.skip = 0;
  }
  onFiltersend(inputValue: string) {
    this.AcknowledgementLettersemdData = process(this.AcknowledgementLettersemdtempData, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'pVchapplicationid',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pApplicantname',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pLoanamount',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pMobileno',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pEmail',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'psentthrough',
            operator: 'contains',
            value: inputValue
          }
        ],
      }
    }).data;
    this.dataBinding.skip = 0;
  }


  public allData(): ExcelExportData {
    if(this.Savebbutton==true){
    this.ALetterData=this.AcknowledgementLetternotsendData;
  }else{
    this.ALetterData=this.AcknowledgementLettersemdData;
  }
    const result: ExcelExportData = {
      data: process(this.ALetterData, {  sort: [{ field: 'pVchapplicationid', dir: 'desc' }] }).data
    };

    return result;
  }
}
