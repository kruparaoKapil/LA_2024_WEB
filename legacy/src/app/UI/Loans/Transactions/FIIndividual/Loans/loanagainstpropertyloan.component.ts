import { Component, OnInit, EventEmitter, Input, Output, NgZone, ViewChild, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Form, Validators, FormArray } from '@angular/forms'
import { CommonService } from 'src/app/Services/common.service';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { FIIndividualLoanspecficService } from 'src/app/Services/Loans/Transactions/fiindividual-loanspecfic.service';
import { FiLoanspecficComponent } from '../fi-loanspecfic.component';
import { PropertyDetailsComponent } from 'src/app/UI/Common/property-details/property-details.component';
import { MovablePropertyDetailsComponent } from 'src/app/UI/Common/movable-property-details/movable-property-details.component';

@Component({
  selector: 'app-loanagainstpropertyloan',
  templateUrl: './loanagainstpropertyloan.component.html',
  styles: []
})
export class LoanagainstpropertyloanComponent implements OnInit {
  @ViewChild(PropertyDetailsComponent, {static:false}) propertydetailsParent:PropertyDetailsComponent;
  @ViewChild(MovablePropertyDetailsComponent, {static:false}) movablepropertydetailsParent:MovablePropertyDetailsComponent
	_FirstInformationTabsData: any = [];
  @Input()
  set FirstInformationTabsData(FirstInformationTabsData: any) {
    this._FirstInformationTabsData = FirstInformationTabsData;
  }
  
  propertyGridData: any = [];
  movablePropertyGridData:any = [];

  @Output() forSecurityColletralPropertyDetailsEmit = new EventEmitter();
  @Output() forSecurityColletralMovablePropertyDetailsEmit = new EventEmitter();

  nonMovablePropertyLoanForm: FormGroup;
  movablePropertyLoanForm: FormGroup;
  propertyLoanConfigErrorMessage: any;
  showPropertyDetails = true;
  showMovablePropertyDetails = true;
  constructor(private formbuilder: FormBuilder, private _commonService: CommonService, private http: HttpClient, private fiIndividualLoanServices: FIIndividualLoanspecficService) { }

  ngOnInit() {

  }
  /**<-----(start) emit property details to fi-personal details(parent component)(start)----> */
  propertyDetailsEmitEvent(event) {    
    if(event) {
      this.propertyGridData = event;      
      this.forSecurityColletralPropertyDetailsEmit.emit(event);
    }
  }
  /**<-----(end) emit property details to fi-personal details(parent component)(end)-----> */

  /**<-----(start) emit movable property details to fi-personal details(parent component)(start)----> */
  movablepropertyDetailsEmitEvent(event) {
    if(event)
    this.movablePropertyGridData = event;
    this.forSecurityColletralMovablePropertyDetailsEmit.emit(event);
  }
  /**<-----(end) emit movable property details to fi-personal details(parent component)(end)----> */


}
