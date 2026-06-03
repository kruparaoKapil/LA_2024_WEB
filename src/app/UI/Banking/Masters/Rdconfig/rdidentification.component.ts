import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { IdentificationDocumentsComponent } from 'src/app/UI/Common/identification-documents/identification-documents.component';

@Component({
  selector: 'app-rdidentification',
  templateUrl: './rdidentification.component.html',
  styles: []
})
export class RdidentificationComponent implements OnInit {
  @ViewChild(IdentificationDocumentsComponent, {static: false}) identificationDocComponent: IdentificationDocumentsComponent;
  @Input() forButtons: boolean;

  @Output() forRdConfigDataForAPISaving = new EventEmitter();

  formtype: string;
  childIndentificationData: any;

  constructor() { }

  ngOnInit() {
    this.formtype = "SavingAccountConfig";
    if(this.identificationDocComponent) {
      this.identificationDocComponent.ngOnInit();
    }
  }

  forRdConfigTab(data) {
    
    this.childIndentificationData = data;
    this.forRdConfigDataForAPISaving.emit(data);
  }

}
