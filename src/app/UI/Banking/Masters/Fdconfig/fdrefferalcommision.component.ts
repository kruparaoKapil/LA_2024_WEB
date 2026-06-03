import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TdsdetailsService } from 'src/app/Services/tdsdetails.service';
import { CommonService } from 'src/app/Services/common.service';

@Component({
  selector: 'app-fdrefferalcommision',
  templateUrl: './fdrefferalcommision.component.html',
  styles: []
})
export class FdrefferalcommisionComponent implements OnInit {

  notApplicableFlag: boolean = true;
  refferalForm: FormGroup;
  forFixed: boolean;
  forPercentage: boolean;
  tdsshow: boolean = false;
  TDSsectiondetails = [];

  constructor(private formBuilder: FormBuilder,
    private _TdsService: TdsdetailsService,
    private _commonservice: CommonService) { }

  ngOnInit() {
    this.notApplicableFlag = true;
    this.forFixed = true;
    this.forPercentage = false;
    this.loadInitData();
    this.getTDSsectiondetails();
  }

  loadInitData() {
    this.refferalForm = this.formBuilder.group({
      pFdconfigid: [0],
      pFdname: [""],
      pFdcode: [''],
      pFdnamecode: [""],
      precordid: [0],
      pIsreferralcommissionapplicable: [true],
      pReferralcommissiontype: ["fixed"],
      pCommissionValue: [''],
      pIstdsapplicable: [false],
      pTdsaccountid: [""],
      pTdssection: [""],
      pTdspercentage: [0],
      pTypeofOperation: [""],
      createdby: [0],
      modifiedby: [0],
      pCreatedby: [this._commonservice.pCreatedby],
      pModifiedby: [0],
      pStatusid: [""],
      pStatusname: [this._commonservice.pStatusname],
      pEffectfromdate: [""],
      pEffecttodate: [""],
      ptypeofoperation: [this._commonservice.ptypeofoperation]
    });
  }

  notApplicable(event) {
    this.notApplicableFlag = (event.target.checked);
  }

  onCommissionChange(event) {
    let type = event.target.value;
    if(type == 'fixed') {
      this.forFixed = true;
      this.forPercentage = false;
      this.refferalForm.patchValue({
        pCommissionValue: ''
      })
    }
    else {
      this.forFixed = false;
      this.forPercentage = true;
      this.refferalForm.patchValue({
        pCommissionValue: ''
      })
    }
  }

  tdsCheck(event) {
    this.tdsshow = event.target.checked;
  }

  getTDSsectiondetails() {

    this._TdsService.getTDSsectiondetails().subscribe(
      (json) => {

        if (json != null) {
          this.TDSsectiondetails = json;
        }
      },
      (error) => {

        this._commonservice.showErrorMessage(error);
      }
    );
  }

}
