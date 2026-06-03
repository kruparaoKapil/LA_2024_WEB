import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { process } from '@progress/kendo-data-query';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { CommonService } from 'src/app/Services/common.service';
import { AccountingMastresService } from 'src/app/Services/Accounting/accounting-mastres.service';
@Component({
  selector: 'app-hsn-codes',
  templateUrl: './hsn-codes.component.html',
  styles: []
})
export class HsnCodesComponent implements OnInit {
  // hsnarray:any=[''];
  // hsnData:any=[];
  // statusFalse:boolean=false;
  // hsnData2:any=[];
  hsnForm: FormGroup;
  gstList: any = [];
  hsnSearchData: any = [];
  hsnCodes: any = [];
  ErrorMessages: { [key: string]: string } = {};

  constructor(private fB: FormBuilder, private _commonService: CommonService, private _accountingmasterservice: AccountingMastresService) {
    this.allData = this.allData.bind(this);
  }

  ngOnInit() {
    this.hsnForm = this.fB.group({
      productName: ['', Validators.required],
      hsnCode: ['', Validators.required],
      hsnGst: ['', Validators.required],
      status: [true],
    })
    this.gstList = [
      { "id": 1, "gst": 3 },
      { "id": 2, "gst": 5 },
      { "id": 3, "gst": 12 },
      { "id": 4, "gst": 18 },
    ]
    this.BlurEventAllControll(this.hsnForm);
    this.getHsnCodes();
  }


  getHsnCodes() {
    this._accountingmasterservice.getHsnCodes().subscribe(res => {
      this.hsnCodes = res;
      this.hsnSearchData = this.hsnCodes;
      console.log(this.hsnCodes);
    }
    )
  }

  removeProducts(event) {
    debugger;
    const index: number = event.rowIndex;
    this.hsnCodes[index].pProductName = '';
    this.hsnCodes[index].pHsnCode = '';
    this.hsnCodes[index].pGstPercentage = '';
    this.hsnCodes[index].pStatus = false;

  }
  //  const index: number = event.rowIndex;

  //   if (index !== -1 && this.hsnarray[index]) {

  //     this.hsnarray[index].status = false;
  //     this.hsnarray[index].nameOfProduct = '';
  //     this.hsnarray[index].hsncode = '';
  //     this.hsnarray[index].hsngst = '';
  //   }
  //   this.hsnData = [...this.hsnarray];
  // }
  saveData() {
    debugger;
    // console.log(this.hsnForm.value);
    if (this.checkValidations(this.hsnForm, true)) {
      let data = {
        "pProductName": this.hsnForm.controls.productName.value,
        "pHsnCode": this.hsnForm.controls.hsnCode.value,
        "pGstPercentage": Number(this.hsnForm.controls.hsnGst.value),
        "pStatus": this.hsnForm.controls.status.value,
      }
      // this.hsnarray.push(data);
      // this.hsnData = [...this.hsnarray];
      // this.hsnSearchData=this.hsnData;
      // this.hsnForm.reset();
      // this.ErrorMessages={};
      // this.hsnForm.controls.status.setValue(true);
      console.log('this is normal data:', data);
      this._accountingmasterservice.saveHsnCodes(data).subscribe(res => {
        console.log('this is saved data:', res)
        this._commonService.showInfoMessage("saved successsfuly");
        this.hsnForm.reset();
        this.ErrorMessages = {};
        this.hsnForm.controls.status.setValue(true);
        this.getHsnCodes();

      })

    }
    // else{
    // alert("hooooooi")
    // }
  }

  // saveData() {
  //   debugger;

  //   if (this.checkValidations(this.hsnForm, true)) {
  //     const data = {
  //       pProductName: this.hsnForm.controls.productName.value,
  //       pHsnCode: this.hsnForm.controls.hsnCode.value,
  //       pGstPercentage: Number(this.hsnForm.controls.hsnGst.value),
  //       pStatus: this.hsnForm.controls.status.value
  //     };

  //     console.log('This is form data:', data);

  //     this._accountingmasterservice.saveHsnCodes(data).subscribe(res => {
  //       console.log('Response from API:', res);

  //       this.hsnData.push(res);
  //       this.hsnData = [...this.hsnData]; 
  //       this.hsnSearchData = this.hsnData;

  //       this._commonService.showInfoMessage("Saved successfully");

  //       this.hsnForm.reset();
  //       this.ErrorMessages = {};
  //       this.hsnForm.controls.status.setValue(true);
  //     });
  //   }
  // }


  clearDetails() {
    debugger;
    //  if (confirm("do you want to clear the data?")){
    this.hsnForm.controls.productName.setValue('');
    this.hsnForm.controls.hsnCode.setValue('');
    this.hsnForm.controls.hsnGst.setValue(' ');
    this.hsnForm.controls.status.setValue('');
    console.log('this is cleared data:', this.hsnForm.value)
    //  }
  }

  status(data: any) {
    debugger
    let status = data.pStatus;
    let userid = data.pRecordId
    if (status == true) {
      status = false;
    }
    else {
      status = true;
    }
  }

  //search

  SearchRecord(inputValue: string) {

    debugger;
    this.hsnCodes = process(this.hsnSearchData, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'pProductName',
            operator: 'contains',
            value: inputValue
          },
        ],
      }
    }).data;
  }
  //excel
  public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.hsnCodes, {
        sort: [{ field: "pProductName", dir: "asc" }],
      }).data,
    };

    return result;
  }


  //validations
  BlurEventAllControll(fromgroup: FormGroup): boolean {
    debugger;
    try {
      debugger
      Object.keys(fromgroup.controls).forEach((key: string) => {
        this.setBlurEvent(fromgroup, key);
      })
      return true;
    }
    catch (e) {
      debugger
      this._commonService.showErrorMessage(e);
      return false;
    }
  }


  setBlurEvent(fromgroup: FormGroup, key: string): boolean {
    debugger;
    try {
      debugger
      let formcontrol;
      formcontrol = fromgroup.get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          debugger;
          this.BlurEventAllControll(formcontrol)
        }
        else {
          if (formcontrol.validator)
            fromgroup.get(key).valueChanges.subscribe((data) => { this.GetValidationByControl(fromgroup, key, true) })
        }
      }
      return true;
    }
    catch (e) {
      debugger;
      this._commonService.showErrorMessage(e);
      return false;
    }
  }


  checkValidations(group: FormGroup, isValid: boolean): boolean {
    debugger
    try {
      Object.keys(group.controls).forEach((key: string) => {
        isValid = this.GetValidationByControl(group, key, isValid);
      });
    }
    catch (e) {
      this.showErrorMessage(e);
      return false;
    }
    return isValid;
  }


  GetValidationByControl(formGroup: FormGroup, key: string, isValid: boolean): boolean {
    debugger;
    try {
      const formcontrol = formGroup.get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          this.checkValidations(formcontrol, isValid);
        }
        else if (formcontrol.validator) {
          this.ErrorMessages[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            const element = document.getElementById(key);
            const lablename = element ? element.title : key;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.ErrorMessages[key] += errormessage + ' ';
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


  showErrorMessage(errormsg: any) {
    debugger
    this._commonService.showErrorMessage(errormsg);
  }
}
