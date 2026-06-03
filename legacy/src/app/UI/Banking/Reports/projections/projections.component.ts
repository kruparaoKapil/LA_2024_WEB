
import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { UsersService } from 'src/app/Services/Settings/Users/Users.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';
import { debug } from 'console';
import { CommonService } from 'src/app/Services/common.service';
@Component({
  selector: 'app-projections',
  templateUrl: './projections.component.html',
  styles: []
})

export class ProjectionsComponent implements OnInit {

  projectionForm: FormGroup;
  // productList: string[] = ['Sale Advance', 'Sale Advance-HB', 'Plot Advance', 'Farm Lands', 'Lip'];
  //productList: string[] = ['Land Advance', 'Sale of Units', 'Sale of Farm Lands', 'Chits', 'Chit Advance-CO Chits', 'LLP'];
  nextMonths: string[] = [];
  productList: any[] =  [];
  productTable: any[] = [];
  savedData: any[] = [];
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  // Month Picker
  showMonthPicker = false;
  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  selectedMonthIndex = new Date().getMonth();
  selectedYear = new Date().getFullYear();
  displayMonth = '';
  pickerPosition = { top: 40, left: 0 };
  pickerWidth = 0;
  today = new Date();
  @ViewChild('monthPickerContainer', { static: false })
  monthPickerContainer: ElementRef;
  Data: any = []
  tabledisable: boolean = false;
  savedisable: boolean = false;
  PlotsLayoutsValidationErrors: any;
  previewDataArray: any = [];


  constructor(private fb: FormBuilder, private _usersService: UsersService, private datepipe: DatePipe, private _CommonService: CommonService) {
    // this.dpConfig.containerClass = 'theme-dark-blue';
    // this.dpConfig.dateInputFormat = 'DD-MM-YYYY';
    // this.dpConfig.maxDate = new Date();
    // this.dpConfig.showWeekNumbers = false;

    this.dpConfig.containerClass = 'theme-dark-blue';
    this.dpConfig.showWeekNumbers = false;
    this.dpConfig.maxDate = new Date();
    this.dpConfig.minMode = 'month';
    this.dpConfig.dateInputFormat = 'MMM-YYYY';
  }

  ngOnInit() {
    debugger;
    this.tabledisable = true;
    //this.savedisable = true;
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    // const defaultMonth = `${year}-${month}`;
    let date = this.datepipe.transform(this.today, 'MMM-yyyy')
    console.log('latest date:', date);
    this.projectionForm = this.fb.group({
      selectedMonth: [date],
      selectedProduct: [''],
    });

    this.updateDisplayMonth();
    this.onMonthChange();
    this.GetProductList();
  }

  DateChange(event: Date) {
    if (event) {
      const formatted = this.datepipe.transform(event, 'MMM-yyyy'); // use '-' instead of '/'
      this.projectionForm.patchValue({ selectedMonth: formatted });
      this.onMonthChange(); // auto-refresh table months after selection
      console.log('Selected Month-Year:', formatted);
    }
  }

  onOpenCalendar(container) {
    if (container && container.setViewMode) {
      container.setViewMode('month');
    }
  }

  GetProductList() {
    debugger;
    this._usersService.GetProductList().subscribe(result => {
      console.log('res:',result);
      this.productList = result;
      console.log('list:',this.productList);

    })
  }

  /////////////////////
  toggleMonthPicker(event: MouseEvent) {
    event.stopPropagation();
    this.showMonthPicker = !this.showMonthPicker;

    if (this.showMonthPicker && this.monthPickerContainer) {
      const rect = this.monthPickerContainer.nativeElement
        .querySelector('input')
        .getBoundingClientRect();
      this.pickerPosition = {
        top: rect.height + 5,
        left: 0
      };
      this.pickerWidth = rect.width;
    }
  }

  prevYear() {
    this.selectedYear--;
  }

  nextYear() {
    this.selectedYear++;
  }

  selectMonth(index: number) {
    this.selectedMonthIndex = index;
    const month = (index + 1).toString().padStart(2, '0');
    const value = `${this.selectedYear}-${month}`;

    const selectedMonthControl = this.projectionForm.get('selectedMonth');
    if (selectedMonthControl) {
      selectedMonthControl.setValue(value);
    }

    this.updateDisplayMonth();
    this.showMonthPicker = false;
    this.onMonthChange();
  }

  updateDisplayMonth() {
    const shortMonth = this.monthNames[this.selectedMonthIndex].substring(0, 3);
    this.displayMonth = `${shortMonth}-${this.selectedYear}`;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!this.monthPickerContainer || !this.monthPickerContainer.nativeElement.contains(target)) {
      this.showMonthPicker = false;
    }
  }



  onMonthChange() {
    debugger;
    const selectedMonth = this.projectionForm.get('selectedMonth')!.value;
    if (!selectedMonth) return;

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Handle format like "Dec-2025" or "MMM-yyyy"
    const parts = selectedMonth.split('-');
    const monthAbbr = parts[0];
    const year = parseInt(parts[1], 10);

    const monthIndex = monthNames.findIndex(
      m => m.toLowerCase() === monthAbbr.toLowerCase()
    );

    if (monthIndex === -1 || isNaN(year)) {
      console.error("Invalid month-year format:", selectedMonth);
      return;
    }

    //  Start from selected month itself
    this.nextMonths = [];
    for (let i = 0; i < 6; i++) {
      const idx = (monthIndex + i) % 12;
      const newYear = year + Math.floor((monthIndex + i) / 12);
      this.nextMonths.push(`${monthNames[idx]}-${newYear}`);
      console.log('next 3 months:', this.nextMonths);

    }

    //  Start from selected month itself
    // this.nextMonths = [];
    // for (let i = 0; i < 3; i++) {
    //   const idx = (monthIndex + i) % 12;
    //   const newYear = year + Math.floor((monthIndex + i) / 12);
    //   this.nextMonths.push(`${monthNames[idx]}-${newYear}`);
    //   console.log('next 3 months:', this.nextMonths);

    // }
    //  Update form controls for each product row
    this.productTable.forEach((item) => {
      this.nextMonths.forEach((m) => {
        if (!item.form.contains(m)) {
          item.form.addControl(m, new FormControl(''));
        }
      });
    });

    console.log('Next Months:', this.nextMonths);
  }

  public FromDateChange(event) {
    debugger
    this.dpConfig.maxDate = event;
  }

  // addProduct() {
  //   this.tabledisable = true;
  //   this.savedisable = true;
  //   const product = this.projectionForm.get('selectedProduct')!.value;

  //   if (!product) return;

  //   const exists = this.productTable.some((p) => p.name === product);
  //   if (!exists) {
  //     const controls: any = {};
  //     this.nextMonths.forEach((m) => (controls[m] = new FormControl('')));
  //     const form = this.fb.group(controls);
  //     this.productTable.push({ name: product, form: form });
  //   }

  //   // Clear selected product safely
  //   if (this.projectionForm.get('selectedProduct')) {
  //     this.projectionForm.get('selectedProduct')!.setValue('');
  //   }
  // }
  addProduct() {
    debugger;

    const selectedMonth = this.projectionForm.controls['selectedMonth'].value;
    const product = this.projectionForm.get('selectedProduct')!.value;

    if (!product) return;

    this._usersService.getCount(selectedMonth, product).subscribe(
      (res: any[]) => {
        console.log('count:', res);
        if (res && res.length > 0) {
          this._CommonService.showErrorMessage(`${selectedMonth} Projections already entered for selected product`);
          this.savedisable = false;
          this.tabledisable = false;
          return;
        }
        else {
          this.tabledisable = true;
          this.savedisable = true;
          const exists = this.productTable.some((p) => p.name === product);
          if (!exists) {
            const controls: any = {};
            this.nextMonths.forEach((m) => (controls[m] = new FormControl('')));

            const form = this.fb.group(controls);
            this.productTable.push({ name: product, form: form });
          }
        }
      }
    );
  }


  saveData() {
    debugger;
    const selectedMonth = this.projectionForm.controls['selectedMonth'].value;
    const selectedProduct = this.projectionForm.controls['selectedProduct'].value;

    if (!selectedMonth) {
      this._CommonService.showWarningMessage('Please select a Month before saving.');
      return;
    }

    if (this.productTable.length === 0) {
      this._CommonService.showWarningMessage('Please add at least one Product before saving.');
      return;
    }

    if (selectedProduct && !this.productTable.some(p => p.name === selectedProduct)) {
      this._CommonService.showWarningMessage('Please click "Add Product" after selecting a product.');
      return;
    }
    debugger;
    debugger;
    let isvalid = true;

    const allRequests = [];
    this.previewDataArray = []; // store all data for preview

    this.productTable.forEach((p) => {
      this.nextMonths.forEach((m) => {
        const value = (p.form.get(m) && p.form.get(m).value) || '';

        const data = {
          id: 0,
          selectedMonth: this.datepipe.transform(this.projectionForm.controls['selectedMonth'].value, 'MMM-yyyy'),
          productName: p.name,
          projectionMonth: m,
          projectionAmount: value
        };
        console.log('this is projections data:', data);
        this.previewDataArray.push(data); // collect all data
        allRequests.push(data);

      });
    });
    sessionStorage.removeItem('previewData');
    sessionStorage.setItem('previewData', JSON.stringify(this.previewDataArray));

    console.log('Session data', JSON.parse(sessionStorage.getItem('previewData')!));
    const data = JSON.stringify(this.previewDataArray);
    this._usersService.SaveProjection(data).subscribe(
      (res) => {
        console.log('Saved projection:', res);
        window.open('/#/projectionsPreview', '_blank');
        this.tabledisable = false;
        this.savedisable = false;
        this.productTable = [];
      },
      (err) => {
        console.error('Save error:', err);
       // this._CommonService.showErrorMessage('Projection Data already Exists for selected Month , \n please take Reprint from  Projection-Reprint Form');
        this.tabledisable = false;
        this.savedisable = false;
        this.productTable = [];
      });

    // window.open('/#/projectionsPreview', '_blank');
    // this.tabledisable = false;
    // this.productTable = [];
    // this.projectionForm.controls['selectedMonth'].setValue('');


  }

  // saveData() {
  //   debugger;
  //   const selectedMonth = this.projectionForm.controls['selectedMonth'].value;
  //   const selectedProduct = this.projectionForm.controls['selectedProduct'].value;

  //   if (!selectedMonth || selectedMonth.trim() === '') {
  //     this._CommonService.showWarningMessage('Please select a Month before saving.');
  //     return;
  //   }

  //   if (this.productTable.length === 0) {
  //     this._CommonService.showWarningMessage('Please add at least one Product before saving.');
  //     return;
  //   }

  //   if (selectedProduct && !this.productTable.some(p => p.name === selectedProduct)) {
  //     this._CommonService.showWarningMessage('Please click "Add Product" after selecting a product.');
  //     return;
  //   }
  //   debugger;
  //   debugger;
  //   let isvalid = true;

  //   const allRequests = [];
  //   this.previewDataArray = []; // store all data for preview

  //   this.productTable.forEach((p) => {
  //     this.nextMonths.forEach((m) => {
  //       const value = (p.form.get(m) && p.form.get(m).value) || '';

  //       const data = {
  //         id: 0,
  //         selectedMonth: this.projectionForm.controls['selectedMonth'].value,
  //         productName: p.name,
  //         projectionMonth: m,
  //         projectionAmount: value
  //       };
  //       console.log('this is projections data:', data);
  //       this.previewDataArray.push(data); // collect all data
  //       allRequests.push(data);

  //     });
  //   });
  //   let data = JSON.stringify(this.previewDataArray);
  //   this._usersService.SaveProjection(data).subscribe((res) => {
  //     console.log('Saved projection:', res);

  //   });

  //    window.open('/#/projectionsPreview', '_blank');
  //     this.tabledisable = false;
  //       // this.previewDataArray=[]
  //       this.productTable = [];
  //       this.projectionForm.controls.selectedMonth.setValue(''); 
  //       sessionStorage.setItem('previewData', JSON.stringify(this.previewDataArray));

  // Open preview page



  // allRequests.forEach((req) =>
  //   req.subscribe(
  //     (res) => console.log('Saved projection:', res),
  //     (err) => console.error('Error saving projection:', err)
  //   )
  // );



  // Save ALL preview data


  //}


  /* validations */

  BlurEventAllControll(fromgroup: FormGroup) {
    try {
      Object.keys(fromgroup.controls).forEach((key: string) => {
        this.setBlurEvent(fromgroup, key);
      })
    }
    catch (e) {
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
      return false;
    }
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
          this.PlotsLayoutsValidationErrors[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {

            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                let lablename;
                lablename = (document.getElementById(key) as HTMLInputElement).title;
                errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.PlotsLayoutsValidationErrors[key] += errormessage + ' ';
                isValid = false;
              }
            }
          }
        }
      }
    }
    catch (e) {
      return false;
    }
    return isValid;
  }

}