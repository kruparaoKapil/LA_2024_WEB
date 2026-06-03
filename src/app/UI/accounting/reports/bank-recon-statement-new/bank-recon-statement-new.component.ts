import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { BankbookService } from 'src/app/Services/Accounting/bankbook.service';
import { ToastrService } from 'ngx-toastr';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BrStatementService } from 'src/app/Services/Accounting/br-statement.service';
import { GroupDescriptor, SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import Rx from 'rxjs/Rx';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';

@Component({
  selector: 'app-bank-recon-statement-new',
  templateUrl: './bank-recon-statement-new.component.html',
  styles: []
})

export class BankReconStatementNewComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  public hdnTranDate = true;
  public loading = false;
  public BRStatmentForm: FormGroup;
  public submitted = false;
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public paymentVouecherServicesData: any;
  public today: Date = new Date();
  public bankData: any;
  public gridView: any;
  public startDate: any;
  public bankname: any;
  public pBankBookBalance = 0;
  public show = false;
  public chequesdepositedbutnotcredited: any;
  public CHEQUESISSUEDBUTNOTCLEARED: any;
  public Balanceasperbankbook: any;
  public savebutton = 'Generate Report';
  public isLoading = false;
  public pBankBookBalancenagitive: any;
  public aggregates: any[] = [{ field: 'ptotalreceivedamount', aggregate: 'sum' }];
  public groups: GroupDescriptor[] = [{ field: 'pGroupType', aggregates: this.aggregates }];
  public sort: SortDescriptor[] = [{
    field: 'ptransactiondate',
    dir: 'asc'
  }];
  buttonName: string = 'Save & Print';
  bankBalance = 10;
  public selectedvalues: any = []
  kycFileName: any;
  kycFilePath: any;
  pDocFileType: any;
  imageResponse: any;
  readonlyPbankBalance = false;
  fromDate: any;
  datetimeimgpath: string;
  datetimeimg: string;

  constructor(private datePipe: DatePipe, private _routes: Router, private formbuilder: FormBuilder, private _CommonService: CommonService, private _bankBookService: BankbookService, public toaster: ToastrService, private brstatement: BrStatementService) {
    this.dpConfig.containerClass = 'theme-dark-blue';
    this.dpConfig.dateInputFormat = 'DD-MM-YYYY';
    this.dpConfig.maxDate = new Date();
    this.dpConfig.showWeekNumbers = false;
    this.allData = this.allData.bind(this);
  }

  ngOnInit() {
    this.submitted = false;
    this.BRStatmentForm = this.formbuilder.group({
      fromDate: [this.today],
      pbankname: ['', Validators.required],
      pbankbalance: [0],
      pDOCSTOREPATH: [''],
    })
    this.bankBookDetails();
  }
  get f() { return this.BRStatmentForm.controls; }

  public showErrorMessage(errormsg: string) {
    this._CommonService.showErrorMessage(errormsg);
  }

  public showInfoMessage(errormsg: string) {
    this._CommonService.showInfoMessage(errormsg);
  }

  //----------------VALIDATION----------------------- //
  public checkValidations(group: FormGroup, isValid: boolean): boolean {
    try {
      Object.keys(group.controls).forEach((key: string) => {
        isValid = this.GetValidationByControl(group, key, isValid);
      })
    }
    catch (e) {
      this.showErrorMessage(e);
      return false;
    }
    return isValid;
  }
  public GetValidationByControl(formGroup: FormGroup, key: string, isValid: boolean): boolean {
    try {
      let formcontrol;
      formcontrol = formGroup.get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          this.checkValidations(formcontrol, isValid)
        }
        else if (formcontrol.validator) {
          this.paymentVouecherServicesData[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.paymentVouecherServicesData[key] += errormessage + ' ';
                isValid = false;
              }
            }
          }
        }
      }
    }
    catch (e) {
      this.showErrorMessage(e);
      return false;
    }
    return isValid;
  }
  public BlurEventAllControll(fromgroup: FormGroup) {
    try {
      Object.keys(fromgroup.controls).forEach((key: string) => {
        this.setBlurEvent(fromgroup, key);
      })
    }
    catch (e) {
      this.showErrorMessage(e);
      return false;
    }
  }
  public setBlurEvent(fromgroup: FormGroup, key: string) {
    try {
      let formcontrol;
      formcontrol = fromgroup.get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          this.BlurEventAllControll(formcontrol)
        }
        else {
          if (formcontrol.validator)
            fromgroup.get(key).valueChanges.subscribe((data) => { this.GetValidationByControl(fromgroup, key, true) })
        }
      }
    }
    catch (e) {
      this.showErrorMessage(e);
      return false;
    }
  }


  public bankBookDetails() {
    this._bankBookService.GetBankNames().subscribe(res => {

      this.bankData = res;
    },
      (error) => {
        this.showErrorMessage(error);
      });
  }

  public getBRStatmentReports() {
    debugger
    this.gridView = [];
    this.bankname = '';
    this.startDate = '';
    this.show = false;
    this.submitted = true;
    if (this.BRStatmentForm.valid) {
      this.loading = true;
      this.isLoading = true;
      this.savebutton = 'Processing';
      try {

        this.BRStatmentForm.value;
        let fromDate = this.BRStatmentForm['controls']['fromDate'].value;
        let pbankname = this.BRStatmentForm['controls']['pbankname'].value;
        let filterResult: any = this.bankData.filter(u =>
          u.pbankaccountid == pbankname);

        this.bankname = filterResult[0].pbankname
        // this.bankname = this.bankData.filter(item => item.pbankaccountid === pbankname);
        fromDate = this.datePipe.transform(fromDate, "yyyy-MM-dd");
        this.startDate = this.datePipe.transform(this.BRStatmentForm['controls']['fromDate'].value, "dd-MMM-yyyy");
        this.brstatement.GetBrStatementReportbyDates1(fromDate, pbankname).subscribe(res => {

          this.gridView = res;
console.log('result of bnk:',res);

          if (this.gridView != '') {
            //this.gridView = this.gridView.filter(x => x.ptransactiondate = this._CommonService.getFormatDate(x.ptransactiondate));
            let TotalAmount = this.gridView[0]['pBankBookBalance'].toFixed(2);
            console.log('total amount:',TotalAmount);

            this.chequesdepositedbutnotcredited = this.gridView.filter(item => item.pGroupType === 'CHEQUES DEPOSITED BUT NOT CREDITED')
              .reduce((chequesdepositedbutnotcredited, current) => chequesdepositedbutnotcredited + current.ptotalreceivedamount, 0);
console.log('chequesdepositedbutnotcredited:',this.chequesdepositedbutnotcredited);

            this.CHEQUESISSUEDBUTNOTCLEARED = this.gridView.filter(item => item.pGroupType === 'CHEQUES ISSUED BUT NOT CLEARED')
              .reduce((CHEQUESISSUEDBUTNOTCLEARED, current) => CHEQUESISSUEDBUTNOTCLEARED + current.ptotalreceivedamount, 0);
            console.log('CHEQUESISSUEDBUTNOTCLEARED:',this.CHEQUESISSUEDBUTNOTCLEARED);

              let bankblnce = TotalAmount - this.chequesdepositedbutnotcredited + this.CHEQUESISSUEDBUTNOTCLEARED;
console.log('bank balance:',bankblnce);

            let Balanceasperbankbook = bankblnce < 0 ? '(' + this._CommonService.currencyformat(Math.abs(bankblnce)) + ')' : this._CommonService.currencyformat(bankblnce);
console.log('Balanceasperbankbook',Balanceasperbankbook);

            if (Balanceasperbankbook.startsWith('(') && Balanceasperbankbook.endsWith(')')) {
              Balanceasperbankbook = Balanceasperbankbook.replace(/[(),]/g, '');

              Balanceasperbankbook = this._CommonService.removeCommasForEntredNumber(Balanceasperbankbook);
              Balanceasperbankbook = Balanceasperbankbook.toFixed(2);
              Balanceasperbankbook = '-' + Balanceasperbankbook;
              let formattedNumber = Balanceasperbankbook < 0 ? `(${Math.abs(Balanceasperbankbook).toLocaleString()})` : Balanceasperbankbook.toLocaleString();

              this.Balanceasperbankbook = formattedNumber;
            }

            else {
              Balanceasperbankbook = this._CommonService.removeCommasForEntredNumber(Balanceasperbankbook);
              this.Balanceasperbankbook = Balanceasperbankbook.toFixed(2);
            }

            this.pBankBookBalance = TotalAmount;

            this.BRStatmentForm['controls']['pbankbalance'].setValue(this.gridView[0]['pbankbalance']);

            this.fromDate = this.datePipe.transform(this.BRStatmentForm['controls']['fromDate'].value, "yyyy/MM/dd");
            const fromDate = new Date(this.fromDate);
            let asOnDate = new Date(this.fromDate)
            const today = new Date();
            const pbankbalance = +this.BRStatmentForm.get('pbankbalance').value;

            let EffectedDate = this.datePipe.transform(this.BRStatmentForm['controls']['fromDate'].value, 'dd/MM/yyyy')
            let effectivefromdate = this._CommonService.formatDateFromDDMMYYYY(EffectedDate);
            // let boardmeetingdate=this.datepipe.transform(this.layoutstandardrateform.controls.boardmeetingdate.value,'dd/MM/yyyy')
            // let finalboardmeetingdate=this._commonservice.formatDateFromDDMMYYYY(boardmeetingdate);

            // if (pbankbalance > 0 && fromDate.toString() !== 'Invalid Date' && asOnDate < today) {
            //   this.readonlyPbankBalance = true;
            // } else {
            //   this.readonlyPbankBalance = false;
            // }

            if (pbankbalance > 0 && fromDate.toString() !== 'Invalid Date' && !this.isSameDate(asOnDate, today) && asOnDate < today){
              this.readonlyPbankBalance = true;
            } else {
              this.readonlyPbankBalance = false;
            }


            this.savebutton = 'Generate Report';
            this.show = true;
            this.isLoading = false;
            this.loading = false;

          } else {
            this.savebutton = 'Generate Report';
            this.show = false;
            this.isLoading = false;
            this.loading = false;
          }

        },
          (error) => {
            this.showErrorMessage(error);
            this.isLoading = false;
            this.savebutton = 'Generate Report';
            this.loading = false;
          });


      } catch (e) {
        this.showErrorMessage(e);
        this.isLoading = false;
        this.savebutton = 'Generate Report';
        this.loading = false;
      }
      // if(this.gridView.length == 0){
      //   let pbankname = this.BRStatmentForm['controls']['pbankname'].value;
      //   this.brstatement.GetBrsamoune(pbankname).subscribe(resss => {
      //     this.show = true;
      //     this.pBankBookBalance = resss['pBankBookBalance'];
      //     this.chequesdepositedbutnotcredited = 0;
      //     this.CHEQUESISSUEDBUTNOTCLEARED = 0;
      //     this.Balanceasperbankbook = this.pBankBookBalance;
      //   })
      // }
    }
  }

  isSameDate(date1, date2) {
    debugger
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.gridView, {
        group: this.groups,
        sort: this.sort
      }).data, group: this.groups
    };
    return result;
  }

  print() {
    let printContents, popupWin;
    printContents = document.getElementById('temp-box').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Bank Reconciliation Report</title>
          <link rel="stylesheet" type="text/css" href="assets/css/bootstrap.min.css"/>
          <link rel="stylesheet" href="http://kendo.cdn.telerik.com/2019.3.917/styles/kendo.common.min.css" />
          <link rel="stylesheet" href="http://kendo.cdn.telerik.com/2019.3.917/styles/kendo.default.min.css" />
          <link rel="stylesheet" href="http://kendo.cdn.telerik.com/2019.3.917/styles/kendo.default.mobile.min.css" />
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

  saveWithPrint() {
    debugger;

    if (this.kycFileName == undefined || this.kycFileName == '') {
      this._CommonService.showWarningMessage('Upload Documents To Save');
      return
    }

    // if(this.BRStatmentForm['controls']['pDOCSTOREPATH'].value == "undefined" || this.BRStatmentForm['controls']['pDOCSTOREPATH'].value == ''){
    //   this._CommonService.showWarningMessage('Upload Documents To Save');
    //   return
    // }

    this.gridView;
    this.selectedvalues = [];
    let date = this.datePipe.transform(this.BRStatmentForm['controls']['fromDate'].value, 'yyyy-MM-dd');

    let newArray = this.gridView.map(obj => {
      delete obj.pparentname;
      delete obj.ptransactionno;
      delete obj.pdescription;
      //delete obj.prebateamount;
      delete obj.popeningbal1;
      delete obj.pclosingbal1;
      delete obj.pdebitamount;
      delete obj.pcreditamount;
      delete obj.popeningbal;
      delete obj.pclosingbal;
      delete obj.pcashtotal;
      delete obj.pchequetotal;
      delete obj.pmodeoftransaction;
      delete obj.paccountname;
      delete obj.paccountid;
      delete obj.pparentid;
      delete obj.pBalanceType;
      delete obj.pgrouprecordid;
      delete obj.precordid;
      delete obj.lstBRSDto;
      delete obj.lstBRSDto1;
      delete obj.pFormName;
      //obj.pdatdate = this.BRStatmentForm['controls']['fromDate'].value;
      return obj;

    });

    this.brstatement.Getbrscount(date).subscribe(res => {
      let count = res;

      if (count == 0) {
        let selectedItemsdata = [];
        //if(newArray.ptransactiondate != null ){
        for (let i = 0; i < newArray.length; i++) {
          if (newArray[i].ptransactiondate != null) {
            let data = {
              "pvchtype": newArray[i].pGroupType,
              "pdatdate": this.datePipe.transform(this._CommonService.formatDateFromDDMMYYYY(newArray[i].ptransactiondate), 'yyyy/MM/dd'),
              "pvchnumber": newArray[i].pChequeNumber,
              "pvchparticulars": newArray[i].pparticulars,
              "pvchbank": newArray[i].pBankName,
              "pvchbranchname": newArray[i].pBranchName,
              "pnumamount": newArray[i].ptotalreceivedamount,
              "pbankid": + this.BRStatmentForm['controls']['pbankname'].value,
              "pbrsdate": this.datePipe.transform(this.BRStatmentForm['controls']['fromDate'].value, 'yyyy-MM-dd'),
              "pbankbalance": this._CommonService.removeCommasForEntredNumber(this.BRStatmentForm['controls']['pbankbalance'].value),
              "pDOCSTOREPATH": this.BRStatmentForm['controls']['pDOCSTOREPATH'].value,
              "filename": this.kycFileName,
              "filetype": this.pDocFileType,
              "ptypeofoperation": 'CREATE',

            }
            selectedItemsdata.push(data);
          }


        }
        //}

        console.log(selectedItemsdata);


        let data = {
          "_BrsDTO": selectedItemsdata
        }
        let brsData = JSON.stringify(data)
        this.brstatement.saveBRS(brsData).subscribe(res => {
          if (res) {
            this.selectedvalues += date + '@' + JSON.stringify(this.gridView) + '@' + this.startDate + '@' + this.bankname + '@' + this.pBankBookBalance + '@' + this.chequesdepositedbutnotcredited + '@' + this.CHEQUESISSUEDBUTNOTCLEARED + '@' + this.Balanceasperbankbook + '@' + this.BRStatmentForm['controls']['pbankbalance'].value + '@' + this.kycFileName + '@' + this.pDocFileType;
            let receipt = btoa(this.selectedvalues);

            window.open('/#/BRSPreview?id=' + receipt);
            //this.print();
            this.BRStatmentForm['controls']['pbankbalance'].setValue(0);
            this._CommonService.showInfoMessage('Saved BRS');
          }

        })
      }

      if (count > 0) {
        let selectedItemsdata = [];
        //if(newArray.ptransactiondate != null){
        for (let i = 0; i < newArray.length; i++) {
          if (newArray[i].ptransactiondate != null) {
            let data = {
              "pvchtype": newArray[i].pGroupType,
              "pdatdate": this.datePipe.transform(this._CommonService.formatDateFromDDMMYYYY(newArray[i].ptransactiondate), 'yyyy/MM/dd'),
              "pvchnumber": newArray[i].pChequeNumber,
              "pvchparticulars": newArray[i].pparticulars,
              "pvchbank": newArray[i].pBankName,
              "pvchbranchname": newArray[i].pBranchName,
              "pnumamount": newArray[i].ptotalreceivedamount,
              "pbankid": + this.BRStatmentForm['controls']['pbankname'].value,
              "pbrsdate": this.datePipe.transform(this.BRStatmentForm['controls']['fromDate'].value, 'yyyy-MM-dd'), "pbankbalance": this._CommonService.removeCommasForEntredNumber(this.BRStatmentForm['controls']['pbankbalance'].value),
              "pDOCSTOREPATH": this.BRStatmentForm['controls']['pDOCSTOREPATH'].value,
              "filename": this.kycFileName,
              "filetype": this.pDocFileType,
              "ptypeofoperation": 'UPDATE',

            }
            selectedItemsdata.push(data)
          }
        }
        //}

        console.log(selectedItemsdata);


        let data = {
          "_BrsDTO": selectedItemsdata
        }
        let brsData = JSON.stringify(data)
        this.brstatement.saveBRS(brsData).subscribe(res => {
          if (res) {

            this.selectedvalues += date + '@' + JSON.stringify(this.gridView) + '@' + this.startDate + '@' + this.bankname + '@' + this.pBankBookBalance + '@' + this.chequesdepositedbutnotcredited + '@' + this.CHEQUESISSUEDBUTNOTCLEARED + '@' + this.Balanceasperbankbook + '@' + this.BRStatmentForm['controls']['pbankbalance'].value + '@' + this.kycFileName + '@' + this.pDocFileType;
            let receipt = btoa(this.selectedvalues);

            window.open('/#/BRSPreview?id=' + receipt);
            //this.print();
            this.BRStatmentForm['controls']['pbankbalance'].setValue(0);
            this.BRStatmentForm['controls']['pDOCSTOREPATH'].setValue('');
            this.imageResponse.name = '';
            this.kycFileName = '';
            this.pDocFileType = '';
            this._CommonService.showInfoMessage('Updated BRS');
          }

        })
      }
    })
  }


  uploadAndProgress(event: any, files) {
    debugger;

    var extention = event.target.value.substring(event.target.value.lastIndexOf('.') + 1);
    if (extention.toLowerCase() != 'jpg' && extention.toLowerCase() != 'png' && extention.toLowerCase() != 'jpeg' && extention.toLowerCase() != 'pdf') {
      this._CommonService.showWarningMessage("Upload jpg or pdf files");
      return
    }
  
    this.datetimeimgpath = '';
    this.datetimeimg = '';
    let file = event.target.files[0];

    if (event && file) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = e => {
        this.imageResponse = {
          name: file.name,
          fileType: "imageResponse",
          contentType: file.type,
          size: file.size,

        };
      };
    }
    let fname = "";
    if (files.length === 0) {
      return;
    }
    var size = 0;
    const formData = new FormData();
    let fileToUpload = <File>files[0];
    for (var i = 0; i < files.length; i++) {
      size += files[i].size;
      fname = files[i].name


      let nameWithoutExt = fname.split('.').slice(0, -1).join('.');

      this.datetimeimg = this.datePipe.transform(new Date(), "ddMMyyyyhmmss") + '-' +
        'ttt' + '.' + extention;
      this.datetimeimgpath = this.datePipe.transform(new Date(), "ddMMyyyyhmmss") + '-' + 'ttt' + '.' + extention;

      this.datetimeimgpath = fname + ' ' + this.datetimeimgpath;
      this.datetimeimg = nameWithoutExt + ' ' + this.datetimeimg;

      formData.append('file', fileToUpload, this.datetimeimg);
      // formData.append(files[i].name, files[i]);
      // formData.append('NewFileName', this.BRStatmentForm.value["pDOCUMENTNAME"] + '.' + files[i]["name"].split('.').pop());
    }
    size = size / 1024;
    console.log(formData);

    this._CommonService.fileUploadS3('BRS', formData).subscribe(data => {
       const uploadedFileName = data[0];      

       this.kycFileName = this.datetimeimg;     
       this.kycFilePath = uploadedFileName;     
       this.pDocFileType = extention;

      if (this.imageResponse)
        this.imageResponse.name = this.datetimeimg;  

        this.BRStatmentForm.controls.pDOCSTOREPATH.setValue(this.datetimeimg); 
      })
  }

  // uploadAndProgress(event: any, files) {
  //   debugger;

  //   var extention = event.target.value.substring(event.target.value.lastIndexOf('.') + 1);
  //   if (extention.toLowerCase() != 'jpg' && extention.toLowerCase() != 'png' && extention.toLowerCase() != 'jpeg' && extention.toLowerCase() != 'pdf') {
  //     this._CommonService.showWarningMessage("Upload jpg or pdf files");
  //     return
  //   }

  //   let file = event.target.files[0];

  //   if (event && file) {
  //     let reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = e => {
  //       this.imageResponse = {
  //         name: file.name,
  //         fileType: "imageResponse",
  //         contentType: file.type,
  //         size: file.size,

  //       };
  //     };
  //   }
  //   let fname = "";
  //   if (files.length === 0) {
  //     return;
  //   }
  //   var size = 0;
  //   const formData = new FormData();
  //   for (var i = 0; i < files.length; i++) {
  //     size += files[i].size;
  //     fname = files[i].name
  //     formData.append(files[i].name, files[i]);
  //     formData.append('NewFileName', this.BRStatmentForm.value["pDOCUMENTNAME"] + '.' + files[i]["name"].split('.').pop());
  //   }
  //   size = size / 1024;
  //   console.log(formData);

  //   this._CommonService.fileUploadinfolder('Documents', formData).subscribe(data => {

  //     this.kycFileName = data[1];
  //     if (this.imageResponse)
  //       this.imageResponse.name = data[1];
  //     this.kycFilePath = data[0];
  //     this.pDocFileType = extention
  //   })
  // }

  // amountValidation(){
  //   debugger;

  //  let bankBalance =  this._CommonService.removeCommasForEntredNumber(this.BRStatmentForm['controls']['pbankbalance'].value);

  //  if(bankBalance > this.CHEQUESISSUEDBUTNOTCLEARED){
  //   this._CommonService.showWarningMessage('Balance Amount' + " " + bankBalance + " " + "Should Not Be Greater Than Cheques Issued But Not Cleared Amount" + " " + this.CHEQUESISSUEDBUTNOTCLEARED);

  //   this.BRStatmentForm['controls']['pbankbalance'].setValue('');

  //  }



  // }
  // (blur)="amountValidation()"

}
