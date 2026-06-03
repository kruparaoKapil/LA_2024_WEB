import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { CommonService } from 'src/app/Services/common.service';
import { process } from '@progress/kendo-data-query';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-rsd-report',
  templateUrl: './rsd-report.component.html',
  styles: []
})
export class RsdReportComponent implements OnInit {

  rsdForm : FormGroup;
  dpConfig : Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  isLoading : boolean = false;
  rsdValidationMessages : any = {};
  schemeNames : any = [];
  adjustmentTypes : any = [];
  rsdData : any = [
    // {'contactName':'Rama','mobileNo':8096864332,'panNo':'HYTRD5555D','address': 'Hyderabad'},
    // {'contactName':'Krishna','mobileNo':8096864888,'panNo':'OOOOO4444D','address': 'Hyderabad'},
    // {'contactName':'Hanumaa','mobileNo':8096864555,'panNo':'HYTRD5555D','address': 'Hyderabad'},
    // {'contactName':'Laxmana','mobileNo':80968643666,'panNo':'OOOOO4444D','address': 'Hyderabad'},
    // {'contactName':'BalaRam','mobileNo':8096864777,'panNo':'HYTRD5555D','address': 'Hyderabad'},
    // {'contactName':'Arjuna','mobileNo':8096864333,'panNo':'OOOOO4444D','address': 'Hyderabad'},
   
  ];
  rsdDataArray : any = [];
  schemename : string;
  monthof : string;
  adjustmenttype : string;

  constructor(private fb:FormBuilder,private _commonService:CommonService,private datepipe : DatePipe) { 
    this.dpConfig.dateInputFormat = 'MMM-YYYY';       
    this.dpConfig.maxDate = new Date();
    this.dpConfig.showWeekNumbers = false;
  }

  ngOnInit() {
    debugger;
    this.rsdForm = this.fb.group({
      schemeName : ['',Validators.required],
      adjustmentType : [''],
      monthOf : ['',Validators.required]
    });

    this.BlurEventAllControll(this.rsdForm);
  }

  mergeContactsByPan() {
    debugger
    const mergedData = this.rsdData.reduce((acc, curr) => {
      // Check if the panNo already exists in the accumulator
      const existingContact = acc.find(item => item.panNo === curr.panNo);

      if (existingContact) {
        // If contact with same panNo exists, merge the data
        existingContact.contactName += ', ' + curr.contactName;
        existingContact.mobileNo = existingContact.mobileNo || curr.mobileNo; // You can merge mobile numbers if needed
        existingContact.address += ', ' + curr.address; // You can merge addresses if needed
      } else {
        // If no contact with same panNo exists, add it as new entry
        acc.push({ ...curr });
      }

      return acc;
    }, []);

    console.log(mergedData);

    this.rsdData = mergedData;
    console.log(this.rsdData);
    
  }


  

  public onOpenCalendar(container) {
    container.monthSelectHandler = (event: any): void => {
        container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
  }

  schemeNameChange(event){
    debugger;
    // this.schemename = event.target.value;
  }

  adjustmentTypeChange(event){
    debugger;
    // this.adjustmenttype = event.target.value;
  }

  monthOfChange(event){
    debugger;
    this.monthof = this.datepipe.transform(event, 'MMM-yyyy');
  }

  showRsdData(){
    debugger;
    if(this.checkValidations(this.rsdForm,true)){
      
    }
  }

  public searchRecord(inputValue: string): void {
    this.rsdData = process(this.rsdDataArray, {
      filter: {
        logic: "or",
        filters: [
          {
            field: '',
            operator: 'contains',
            value: inputValue
          }
        ],
      }
    }).data;
  }

  public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.rsdData,{}).data,
    };
    return result;
  }


  // VALIDATIONS

  checkValidations(group: FormGroup, isValid: boolean): boolean {

    try {
      Object.keys(group.controls).forEach((key: string) => {
        isValid = this.GetValidationByControl(group, key, isValid);
      })
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
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
          this.rsdValidationMessages[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.rsdValidationMessages[key] += errormessage + ' ';
                isValid = false;
              }
            }
          }
        }
      }
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
      return false;
    }
    return isValid;
  }


  BlurEventAllControll(fromgroup: FormGroup) {

    try {

      Object.keys(fromgroup.controls).forEach((key: string) => {
        this.setBlurEvent(fromgroup, key);
      })

    }
    catch (e) {
      this._commonService.showErrorMessage(e);
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
      this._commonService.showErrorMessage(e);
      return false;
    }
  }


}
