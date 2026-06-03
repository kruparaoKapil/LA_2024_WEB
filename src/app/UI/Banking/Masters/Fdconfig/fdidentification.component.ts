import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { IdentificationDocumentsComponent } from 'src/app/UI/Common/identification-documents/identification-documents.component';

@Component({
  selector: 'app-fdidentification',
  templateUrl: './fdidentification.component.html',
  styles: []
})
export class FdidentificationComponent implements OnInit {

    @ViewChild(IdentificationDocumentsComponent, {static: false}) identificationDocComponent: IdentificationDocumentsComponent;
    @Input() forButtons: boolean;
  
    @Output() forFdConfigDataForAPISaving = new EventEmitter();
  
    formtype: string;
    childIndentificationData: any;
  
    constructor() { }
  
    ngOnInit() {
      this.formtype = "SavingAccountConfig";
      if(this.identificationDocComponent) {
        this.identificationDocComponent.ngOnInit();
      }
    }
  
    forFdConfigTab(data) {
      
      this.childIndentificationData = data;
      this.forFdConfigDataForAPISaving.emit(data);
    }

}
