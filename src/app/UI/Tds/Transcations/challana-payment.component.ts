import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { AccountingTransactionsService } from 'src/app/Services/Accounting/accounting-transactions.service';
import { DatePipe, JsonPipe } from '@angular/common';
import { CommonService } from 'src/app/Services/common.service';
import { Router } from '@angular/router';
import { LienEntryService } from 'src/app/Services/Banking/lien-entry.service';
import { TdsreportService } from 'src/app/Services/Tds/tdsreport.service';
import { toJSON } from '@progress/kendo-angular-grid/dist/es2015/filtering/operators/filter-operator.base';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { State, process, GroupDescriptor, SortDescriptor } from '@progress/kendo-data-query';

@Component({
  selector: 'app-challana-payment',
  templateUrl: './challana-payment.component.html',
  styles: []
})
export class ChallanaPaymentComponent implements OnInit {
    ChallanaPaymentForm: FormGroup
  showCheque: any;
  showOnline: any;
  showdebitcard: any;
  public ShowAgentnames: any = []
  showupi: any;
  upiidlist: any;
  upinameslist: any;
  chequenumberslist: any;
  clickedRowItem: any;
  gridData:any=[];
  savebutton = "Save";
  disablesavebutton = false;
  pcommissionpaymentlist: any;
  public total: number = 0;
  public today: Date = new Date();
  asondate: any;
  agentid: any;
  pmembername: any;
  pagentname: any;
  pfdname: any;
  pfdaccountno: any;
  ptransdate: any;
  ptenortype: any;
  ptenor: any;
  pdepositamount: any;
  pinteresttype: any;
  pinterestrate: any;
  pmaturityamount: any;
  pinterestpayable: any;
  pdepositdate: any;
  pmaturitydate: any;
  psalespersonname: any;
  pcommsssionvalue: any;

  CommisionPaymentErrors: any;
  pCommissionpaymentDate: any;
  formValidationMessages: any;
  public allSelectedModels: any = []
 
  public banklist: any[]
  public banklist1: any[]
  public debitcardlist: any[]
  public typeofpaymentlist: any[]
  public modeoftransactionslist: any[]
  public cashBalance: number = 0;
  public bankBalance: number = 0;
  JSONdataItem: any = [];
 
  public ShowAgentDetails: any = []
  public pageSize = 5;
  public skip = 0;
 
  public commissionpaymentlist: any = []
  public agentcontactlist: any = []
  allStudentsSelected: boolean = false;
  challanalist:any=[]
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
    challanano: any;
    FromDate:any;
  ToDate: any;
  Section: any;
  netPaidAmount: number = 0;
  netActualTdsAmount: number = 0;
  netTdsAmount: number = 0;
  constructor(private CommissionFormBuilder: FormBuilder, private tdsreportservice:TdsreportService,private _LienEntryService: LienEntryService, private _CommonService: CommonService, private datepipe: DatePipe, private router: Router, private _AccountingTransactionsService: AccountingTransactionsService)
   {
    this.dpConfig.dateInputFormat = "DD/MM/YYYY";
    //this.dpConfig.minDate = new Date();
    this.dpConfig.maxDate = new Date();
    this.dpConfig.showWeekNumbers = false;

    this.allData = this.allData.bind(this);

    }

  ngOnInit()
   {
    this.ChallanaPaymentForm = this.CommissionFormBuilder.group({

     
      
      pTotalpaymentamount: [''],
      pnarration: ['', Validators.required],
      ppaymentid: [''],
      pModeofreceipt: ['BANK'],
      ptranstype: ['CHEQUE'],
      pCreatedby: [this._CommonService.pCreatedby],
      pChallanaNo:['',Validators.required],
      pFromDate:[''],
      pToDate:[''],
      pCommissionpaymentDate:[this.today],
      pbankid: ['', Validators.required],
      pbankname: [''],
      pbranchname: ['', Validators.required],
      pchequeno: ['', Validators.required],

      ptypeofpayment: ['', Validators.required],
      preferencenoonline: ['', Validators.required],
      pUpiname: ['', Validators.required],
      pUpiid: ['', Validators.required],
      pdebitcard: ['', Validators.required],
      pfinancialservice: ['', Validators.required],
      preferencenodcard: ['', Validators.required],

      pIscheck: [''],


      pcommissionpaymentlist: this.CommissionFormBuilder.array([]),
  })
  this.showCheque = true;
  this.showOnline = false;
  this.showdebitcard = false;
  this.asondate = this.today
  this.GetChallananumbers();
  this.getLoadData();
  this.CommisionPaymentErrors = {};
  this.BlurEventAllControll(this.ChallanaPaymentForm);


  }

  GetChallananumbers()
  {
      let isValid=true
      
        this.tdsreportservice.GetChallanaNumbers().subscribe(json=>{
            this.challanalist=json;
           
        })
      
     
  }
  challanachange(event)
  {
      debugger;
      this.gridData=[]
      this.challanano=event.pChallanaNo
      this.FromDate=event.pFromdate;
    this.ToDate = event.pTodate
    this.Section = event.pSection
      this.ChallanaPaymentForm.controls.pFromDate.setValue(event.pFromdate)
    this.ChallanaPaymentForm.controls.pToDate.setValue(event.pTodate)

  }
  GetChallanaPaymentDetails()
  {
    debugger;
    this.netPaidAmount = 0;
    this.netActualTdsAmount = 0;
    this.netTdsAmount = 0;
  
    this.GetValidationByControl(this.ChallanaPaymentForm, 'pChallanaNo', true);
    
      this.tdsreportservice.GetChallanaPaymentDetails(this.challanano,this.Section).subscribe(res=>{
          console.log("payment grid",res);
          this.gridData=res;
         // this.total += (this.gridData[i].pActualTdsAmount);
          this.total = this.gridData.reduce((sum, c) => sum + parseFloat((c.pActualTdsAmount)), 0);
          this.ChallanaPaymentForm.controls.pTotalpaymentamount.setValue(this.total);
          this.netPaidAmount = this.gridData.reduce((sum, item) => sum + Number(item.pAmount), 0).toFixed(2);
          this.netActualTdsAmount = this.gridData.reduce((sum, item) => sum + Number(item.pActualTdsAmount), 0).toFixed(2);
          this.netTdsAmount = this.gridData.reduce((sum, item) => sum + Number(item.pTdsAmount), 0).toFixed(2);
      })
    
  }
  addCommissionpaymentlistcontrols(): FormGroup {
    return this.CommissionFormBuilder.group({
       
        pChallanaDetailsId:[''],
        ptotalamount: [''],
        pdebitaccountid: [''],
        pChallanaId: [''],

    })

}
checkValidations(group: FormGroup, isValid: boolean): boolean {

  try {

      Object.keys(group.controls).forEach((key: string) => {

          isValid = this.GetValidationByControl(group, key, isValid);
      })

  }
  catch (e) {
      return false;
  }
  return isValid;
}
GetValidationByControl(formGroup: FormGroup, key: string, isValid: boolean): boolean {

  try {
      let formcontrol;
      formcontrol = formGroup.get(key);
      if (formcontrol) {
          if (formcontrol instanceof FormGroup) {
              this.checkValidations(formcontrol, isValid)
          }
          else if (formcontrol.validator) {
              this.CommisionPaymentErrors[key] = '';
              if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
                  let lablename;
                  lablename = (document.getElementById(key) as HTMLInputElement).title;
                  let errormessage;
                  for (const errorkey in formcontrol.errors) {
                      if (errorkey) {
                          errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                          this.CommisionPaymentErrors[key] += errormessage + ' ';
                          isValid = false;
                      }
                  }
              }
          }
      }
  }
  catch (e) {
      // this.showErrorMessage(e);
      // return false;
  }
  return isValid;
}
showErrorMessage(errormsg: string) {
  this._CommonService.showErrorMessage(errormsg);
}
BlurEventAllControll(fromgroup: FormGroup) {
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
setBlurEvent(fromgroup: FormGroup, key: string) {
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
getLoadData() {
  debugger;
  this._AccountingTransactionsService.GetReceiptsandPaymentsLoadingData('PAYMENT VOUCHER').subscribe(json => {
      debugger;
      console.log(json)
      if (json != null) {

          console.log("cashbalance", json)
          this.banklist = json.banklist;
          this.banklist1 = json.banklist;
          this.modeoftransactionslist = json.modeofTransactionslist;
          this.debitcardlist = json.bankdebitcardslist;
          this.setBalances('BANK', json.bankbalance);
          this.setBalances('CASH', json.cashbalance);


      }
      this.typeofpaymentlist = this.gettypeofpaymentdata();
  },
      (error) => {

          this._CommonService.showErrorMessage(error);
      });
}
setBalances(balancetype, balanceamount) {

  let balancedetails;
  if (parseFloat(balanceamount) < 0) {
      balancedetails = this._CommonService.currencyformat(Math.abs(balanceamount)) + ' Cr';
  }
  else if (parseFloat(balanceamount) >= 0) {
      balancedetails = this._CommonService.currencyformat(balanceamount) + ' Dr';
  }
  if (balancetype == 'CASH')
      this.cashBalance = balancedetails;
  if (balancetype == 'BANK')
      this.bankBalance = balancedetails;

}
gettypeofpaymentdata(): any {
  debugger;
  let data = this.modeoftransactionslist.filter(function (payment) {
      return payment.ptranstype != payment.ptypeofpayment;
  });
  return data;
}
selectAllStudentsChange($event: any, dataItem, rowIndex) {
  debugger
  this.total = 0;
  if ($event.target.checked) {
      this.allStudentsSelected = true;
      for (let i = 0; i < this.gridData.length; i++) {
          this.gridData[i].add = true;
          this.total += (this.gridData[i].pActualTdsAmount);
          //this.total += parseFloat(dataItem.ptotalamount);
          this.allSelectedModels.push(this.gridData[i]);
      }
      console.log("selecting all",this.allSelectedModels)
  }
   else {
      this.allStudentsSelected = false;
      for (let i = 0; i < this.gridData.length; i++) {
          this.gridData[i].add = false;

          this.total = 0;
          this.allSelectedModels.splice(rowIndex, 1)
      }
  }
  this.ChallanaPaymentForm.controls.pTotalpaymentamount.setValue(this.total);

}


clickselectforpayments($event: any, dataItem, rowIndex) {
  debugger;
  if (this.gridData.length == 1) {
      this.allStudentsSelected = true;
  }
  //else {
  //    this.allStudentsSelected = false;
  //}
  if ($event.target.checked) {
      this.total += parseFloat(dataItem.pActualTdsAmount);
      this.allSelectedModels.push(dataItem);
  }
  else {

      if (this.total > parseFloat(dataItem.pActualTdsAmount)) {
          this.total -= parseFloat(dataItem.pActualTdsAmount);
      }
      else {
          this.total = parseFloat(dataItem.pActualTdsAmount) - this.total;
      }
      this.allSelectedModels.splice(rowIndex, 1)
      this.allStudentsSelected = false;

  }
  this.ChallanaPaymentForm.controls.pTotalpaymentamount.setValue(this.total);



}
transofPaymentChange(type) {
  debugger;

  if (type == "CHEQUE") {
      this.showCheque = true;
      this.showOnline = false;
      this.showdebitcard = false;

  }
  else if (type == "ONLINE") {
      this.showOnline = true;
      this.showCheque = false;
      this.showdebitcard = false;


  }
  else if (type == "DEBIT CARD") {
      this.showdebitcard = true;
      this.showCheque = false;
      this.showOnline = false;

  }
  else {
      this.showdebitcard = false;
      this.showCheque = false;
      this.showOnline = false;
  }
  this.modeofpaymentvalidation(type);
  this.clearmodeofpaymentDetails();

}

typeofPaymentChange() {
  debugger;
  let UpinameControl = <FormGroup>this.ChallanaPaymentForm['controls']['pUpiname'];
  let UpiidControl = <FormGroup>this.ChallanaPaymentForm['controls']['pUpiid'];
  if (this.ChallanaPaymentForm.controls.ptypeofpayment.value == 'UPI') {
      this.showupi = true;
      UpinameControl.setValidators(Validators.required);
      UpiidControl.setValidators(Validators.required);
  }
  else {
      this.showupi = false;
      UpinameControl.clearValidators();
      UpiidControl.clearValidators();
  }
  UpinameControl.updateValueAndValidity();
  UpiidControl.updateValueAndValidity();
  this.GetValidationByControl(this.ChallanaPaymentForm, 'ptypeofpayment', true);
}

GetBankDetailsbyId(pbankid) {
  debugger;
  this._AccountingTransactionsService.GetBankDetailsbyId(pbankid).subscribe(json => {

      if (json != null) {
          this.upinameslist = json.bankupilist;
          this.chequenumberslist = json.chequeslist;

      }
  },
      (error) => {

          this._CommonService.showErrorMessage(error);
      });
}
upiName_Change($event: any): void {

  debugger
  const districtid = $event.target.value;

  if (districtid && districtid != '') {
      const districtname = $event.target.options[$event.target.selectedIndex].text;
      let data1 = this.upinameslist.filter(x => x.pUpiname == districtname);
      this.upiidlist = data1;


  }
  else {
      this.upiidlist = [];
      this.ChallanaPaymentForm['controls']['pUpiid'].setValue('');
      //this.contactForm['controls']['pAddressControls']['controls']['pDistrict'].setValue('');
  }
  this.GetValidationByControl(this.ChallanaPaymentForm, 'pUpiname', true);
}
upid_change() {
  this.GetValidationByControl(this.ChallanaPaymentForm, 'pUpiid', true);

}
modeofpaymentvalidation(type) {
  debugger
  this.CommisionPaymentErrors = {}
  let pbankid = <FormGroup>this.ChallanaPaymentForm['controls']['pbankid'];
  let pbranchname = <FormGroup>this.ChallanaPaymentForm['controls']['pbranchname'];
  let pchequeno = <FormGroup>this.ChallanaPaymentForm['controls']['pchequeno'];
  // let pbankidonline = <FormGroup>this.InterestPaymentForm['controls']['pbankid'];
  let ptypeofpayment = <FormGroup>this.ChallanaPaymentForm['controls']['ptypeofpayment'];
  const ptypeofpayment1 = <FormGroup>this.ChallanaPaymentForm['controls']['ptypeofpayment'];

  let preferencenoonline = <FormGroup>this.ChallanaPaymentForm['controls']['preferencenoonline'];
  let pUpiname = <FormGroup>this.ChallanaPaymentForm['controls']['pUpiname'];
  let pUpiid = <FormGroup>this.ChallanaPaymentForm['controls']['pUpiid'];
  let pdebitcard = <FormGroup>this.ChallanaPaymentForm['controls']['pdebitcard'];
  let pfinancialservice = <FormGroup>this.ChallanaPaymentForm['controls']['pfinancialservice'];
  let preferencenodcard = <FormGroup>this.ChallanaPaymentForm['controls']['preferencenodcard'];
  let pTotalpaymentamount = <FormGroup>this.ChallanaPaymentForm['controls']['pTotalpaymentamount'];

  pTotalpaymentamount.setValidators(Validators.required)

  if (type == 'CHEQUE') {
      pbankid.setValidators(Validators.required)
      pbranchname.setValidators(Validators.required)
      pchequeno.setValidators(Validators.required)

      ptypeofpayment.clearValidators()
      preferencenoonline.clearValidators()

      pdebitcard.clearValidators()
      pfinancialservice.clearValidators()
      preferencenodcard.clearValidators()

  }
  else if (type == 'ONLINE') {
      pbankid.setValidators(Validators.required)
      ptypeofpayment.setValidators(Validators.required)
      preferencenoonline.setValidators(Validators.required)


      if (this.showupi) {
          pUpiname.setValidators(Validators.required);
          pUpiid.setValidators(Validators.required);
      }
      else {
          pUpiname.clearValidators();
          pUpiid.clearValidators();
      }

      pbranchname.clearValidators()
      pchequeno.clearValidators()

      pdebitcard.clearValidators()
      pfinancialservice.clearValidators()
      preferencenodcard.clearValidators()

  }
  else if (type == 'DEBIT CARD') {
      pdebitcard.setValidators(Validators.required)
      pfinancialservice.setValidators(Validators.required)
      preferencenodcard.setValidators(Validators.required)

      pbankid.clearValidators()
      pbranchname.clearValidators()
      pchequeno.clearValidators()

      ptypeofpayment.clearValidators()
      preferencenoonline.clearValidators()

  }

  pbankid.updateValueAndValidity()
  pbranchname.updateValueAndValidity()
  pchequeno.updateValueAndValidity()

  pbankid.updateValueAndValidity()
  ptypeofpayment.updateValueAndValidity()
  preferencenoonline.updateValueAndValidity()

  pdebitcard.updateValueAndValidity()
  pfinancialservice.updateValueAndValidity()
  preferencenodcard.updateValueAndValidity()



}
clearmodeofpaymentDetails() {
  debugger
  this.chequenumberslist = [];
  this.ChallanaPaymentForm['controls']['pbankid'].setValue('');
  this.ChallanaPaymentForm['controls']['pbankname'].setValue('');
  this.ChallanaPaymentForm['controls']['pbranchname'].setValue('');
  this.ChallanaPaymentForm['controls']['pchequeno'].setValue('');

  this.ChallanaPaymentForm['controls']['ptypeofpayment'].setValue('');
  this.ChallanaPaymentForm['controls']['preferencenoonline'].setValue('');
  this.ChallanaPaymentForm['controls']['pUpiname'].setValue('');

  this.ChallanaPaymentForm['controls']['pUpiid'].setValue('');
  this.ChallanaPaymentForm['controls']['pdebitcard'].setValue('');
  this.ChallanaPaymentForm['controls']['pfinancialservice'].setValue('');
  this.ChallanaPaymentForm['controls']['preferencenodcard'].setValue('');


  this.CommisionPaymentErrors = {};

}
clearCommisionPayment() {

  try {
      this.agentcontactlist = [];
      this.gridData = [];
      this.ChallanaPaymentForm.reset();
      this.ChallanaPaymentForm['controls']['ptranstype'].setValue('CHEQUE');
      this.ChallanaPaymentForm['controls']['pModeofreceipt'].setValue('BANK');
      this.clearmodeofpaymentDetails();
      this.clearCommisionPaymentDetails();
      let date = new Date();
      this.ChallanaPaymentForm['controls']['pCommissionpaymentDate'].setValue(date);
    this.ChallanaPaymentForm['controls']['pTotalpaymentamount'].setValue('');
    this.ChallanaPaymentForm['controls']['pCreatedby'].setValue(this._CommonService.pCreatedby);
   
      this.CommisionPaymentErrors = {};
      this.pcommissionpaymentlist = {};

      this.disablesavebutton = false;
      this.savebutton = "Save";
      this.transofPaymentChange('CHEQUE');
      this.gridData = []
      this.total = 0;
      this.pagentname = ['']

  } catch (e) {
      this._CommonService.showErrorMessage(e);
  }
}
clearCommisionPaymentDetails() {

  const formControl = <FormGroup>this.ChallanaPaymentForm['controls']['pcommissionpaymentlist'];
  formControl.reset();

  this.total=0
//   this.ChallanaPaymentForm['controls']['pcommissionpaymentlist']['controls']['pdebitaccountid'].setValue("");
//   this.ChallanaPaymentForm['controls']['pcommissionpaymentlist']['controls']['pChallanaDetailsId'].setValue("");
//   this.ChallanaPaymentForm['controls']['pcommissionpaymentlist']['controls']['ptotalamount'].setValue("");

  this.CommisionPaymentErrors = {};

}
bankName_Change($event: any): void {
  debugger;
  const pbankid = $event.target.value;
  this.upinameslist = [];
  this.chequenumberslist = [];
  //this.CommissionPaymentForm['controls']['pchequeno'].setValue('');
  //this.CommissionPaymentForm['controls']['pUpiname'].setValue('');
  //this.CommissionPaymentForm['controls']['pUpiid'].setValue('');
  if (pbankid && pbankid != '' && pbankid != 'Select') {
      const bankname = $event.target.options[$event.target.selectedIndex].text;
      this.GetBankDetailsbyId(pbankid);
      this.getBankBranchName(pbankid);
      this.ChallanaPaymentForm['controls']['pbankname'].setValue(bankname);

  }
  else {

      //this.CommissionPaymentForm['controls']['pbankname'].setValue('');
  }

  //this.GetValidationByControl(this.CommissionPaymentForm, 'pbankname', true);
  //this.formValidationMessages['pchequeno'] = '';
}
chequenumber_Change() {

  this.GetValidationByControl(this.ChallanaPaymentForm, 'pchequeno', true);
}
debitCard_Change() {

  let data = this.getbankname(this.ChallanaPaymentForm.controls.pdebitcard.value);
  this.ChallanaPaymentForm['controls']['pbankname'].setValue(data.pbankname);
  this.ChallanaPaymentForm['controls']['pbankid'].setValue(data.pbankid);
  this.ChallanaPaymentForm['controls']['pfinancialservice'].setValue(data.pbankname);
  this.GetValidationByControl(this.ChallanaPaymentForm, 'pCardNumber', true);
}
getBankBranchName(pbankid) {

  let data = this.banklist.filter(function (bank) {
      return bank.pbankid == pbankid;
  });
  this.ChallanaPaymentForm['controls']['pbranchname'].setValue(data[0].pbranchname);
}
getbankname(cardnumber) {
  try {
      let data = this.debitcardlist.filter(function (debit) {
          return debit.pCardNumber == cardnumber;
      })[0];
      this.getBankBranchName(data.pbankid);
      return data;
  } catch (e) {
      this._CommonService.showErrorMessage(e);
  }
}

gridUserSelectionChange(gridUser, selection) {
  debugger;
  // let selectedData = gridUser.data.data[selection.index];
  const selectedData = selection.selectedRows[0].dataItem;
  console.log(selectedData);
}
saveChallanaPayment()
{
    debugger
    this.disablesavebutton = true;
    this.savebutton = 'Processing';
    let isValid = true;
        if (this.checkValidations(this.ChallanaPaymentForm, isValid))
         {
             debugger
           if(this.gridData.length>0)
           {
            for(let i=0;i<this.gridData.length;i++)
            {
                debugger
                let Chargescontrolbankadress = <FormArray>this.ChallanaPaymentForm.controls['pcommissionpaymentlist'];
                Chargescontrolbankadress.push(this.addCommissionpaymentlistcontrols());
               
                this.ChallanaPaymentForm.value['pcommissionpaymentlist']
                [i].pChallanaDetailsId=this.gridData[i].pChallanaDetailsId
               
                this.ChallanaPaymentForm.value['pcommissionpaymentlist']
                [i].ptotalamount=this.gridData[i].pActualTdsAmount;
                
                this.ChallanaPaymentForm.value['pcommissionpaymentlist']
                [i].pdebitaccountid=this.gridData[i].pAccountId

                this.ChallanaPaymentForm.value['pcommissionpaymentlist']
                [i].pChallanaId=this.gridData[i].pChallanaId

                
            }
           // let challana = { pcommissionpaymentlist: this.allSelectedModels }


           let data=JSON.stringify(this.ChallanaPaymentForm.value)
            console.log("challana payment form",data)
            
            this.tdsreportservice.SaveChallanaPayment(data).subscribe(res=>{
               
                if(res)
                {  
                    debugger
                    console.log("res is",res);
                    this.disablesavebutton = false;
                    this.savebutton = 'Save';
                    this._CommonService.showInfoMessage("Saved Sucessfully")
                window.open('/#/PaymentVoucherReports?id=' + btoa(res['pvoucherid'] + ',' + 'Payment Voucher'));
                window.open('/#/Challanapaymentreport?id=' + btoa(this.challanano));
                this.allStudentsSelected=false;
                this.FromDate="";
                this.ToDate=""
                this.clearCommisionPayment();

                }
              
            },
            (error) => {

                this._CommonService.showErrorMessage(error);
                this.disablesavebutton = false;
                this.savebutton = 'Save';
            })
            let Chargescontrolbankdebitcard1 = <FormArray>this.ChallanaPaymentForm.controls['pcommissionpaymentlist'];
            for (let i = Chargescontrolbankdebitcard1.length - 1; i >= 0; i--) {
              Chargescontrolbankdebitcard1.removeAt(i)
            }
           
           }
           else{
               this._CommonService.showWarningMessage("There are no records in grid")
           }
           
        }
        else {
            this.disablesavebutton = false;
            this.savebutton = 'Save';
          }
}

public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.gridData, {
        // sort: [{ field: "pDepositdate", dir: "asc" }],
      }).data,
    };

    return result;
  }

}
