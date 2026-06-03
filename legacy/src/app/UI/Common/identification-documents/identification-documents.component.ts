import { Component, OnInit, Input, Output, EventEmitter, DoCheck } from '@angular/core';
import { LoansmasterService } from '../../../Services/Loans/Masters/loansmaster.service';
import { SavingaccountconfigService } from '../../../Services/Banking/savingaccountconfig.service';
import { CommonService } from '../../../Services/common.service';
import { ToastrService } from 'ngx-toastr';
declare let $: any 
@Component({
  selector: 'app-identification-documents',
  templateUrl: './identification-documents.component.html',
  styles: []
})
export class IdentificationDocumentsComponent implements OnInit, DoCheck {
  @Input() formtype: any;
  @Input() forButtons: boolean;

  @Output() forRdConfigTab = new EventEmitter();
  @Output() forFdConfigTab = new EventEmitter();

  current: any
  LoanDoucments: any=[];
  values: any;
  DocumentsRequired = [];
  DocumentsRequiredEdit = [];
  Data: any;
  SelectedDocumentIndex:any='-1';
  savebutton='Save & Continue';
  disablesavebutton=false;
  checkedMd: any
  checkedRq: any
  buttontype: any
  filterdata: any
  lfdata: any
  savingConfigid: any;
  savingAccname: any;
  public loading = false;
  constructor(private _loanmasterservice: LoansmasterService, private _savingaccountconfigService: SavingaccountconfigService, private _CommonService: CommonService, private toaster: ToastrService) { }


  ngDoCheck() {
    // 
    let buttontype = this._loanmasterservice.GetButtonClickType()
    if (buttontype != "New") {
      this.DocumentsRequiredEdit = []
      let res = this._savingaccountconfigService.GetIdentificationProofsData();
      if (res != "" && res != undefined) {
        this.LoanDoucments = res
        let DocumentsRequirededit = []
        this.filterdata = this.LoanDoucments.filter(function (Data) {

          // 
          let datatofilter = Data.pDocumentsList

          datatofilter.filter(function (fdata) {
            //
            // if (fdata.pContactType != "" && (fdata.pDocumentMandatory != false || fdata.pDocumentRequired != false)) {
            //   DocumentsRequirededit.push(fdata);
            // }
            if (fdata.pDocumentMandatory != false || fdata.pDocumentRequired != false) {
              DocumentsRequirededit.push(fdata);
            }
          })

        })
        this.DocumentsRequiredEdit.push(DocumentsRequirededit);
      }          
      this.forRdConfigTab.emit(this.DocumentsRequired);
      this.forFdConfigTab.emit(this.DocumentsRequired);
    }
  }
  ngOnInit() {

    this.savebutton='Save & Continue';
    this.disablesavebutton=false;
    this.DocumentsRequired = [];
    this.SelectedDocumentIndex='-1';
    this.DocumentsRequiredEdit = [];
    this.GetDocuments();
    this.LoanDoucments = this.LoanDoucments.filter(function (Data) {
            let datatofilter = Data.pDocumentsList
            datatofilter.filter(function (row) {
             row.pDocumentMandatory=false;
             row.pDocumentRequired=false;
            })

          })
    debugger;
    if (this.formtype == "SavingAccountConfig") {

      let buttontype = this._savingaccountconfigService.GetButtonClickType()
      if (buttontype != "New") {
        this.DocumentsRequiredEdit = []
        let res = this._savingaccountconfigService.GetIdentificationProofsData();
        if (res != "" && res != undefined) {
          this.LoanDoucments = res
          let DocumentsRequirededit = []
          this.filterdata = this.LoanDoucments.filter(function (Data) {

            // 
            let datatofilter = Data.pDocumentsList

            datatofilter.filter(function (fdata) {
              //
              // if (fdata.pContactType != "" && (fdata.pDocumentMandatory != false || fdata.pDocumentRequired != false)) {
              //   DocumentsRequirededit.push(fdata);
              // }
              if (fdata.pDocumentMandatory != false || fdata.pDocumentRequired != false) {
                DocumentsRequirededit.push(fdata);
              }
            })

          })
          this.DocumentsRequiredEdit.push(DocumentsRequirededit);
        }
      }

      this._savingaccountconfigService._FindingValidationsBetweenComponents().subscribe(() => {
        this._savingaccountconfigService._addDataToSavingAccountConfigMaster(this.DocumentsRequired, "identificationdocuments")
      });
      this.GetAccountNameAndCode();
    }
   
  }
  GetDocuments(){
    debugger;
    this.SelectedDocumentIndex='-1';
    this._loanmasterservice.GetLoanDoucments("0").subscribe(data => {
debugger;
      this.LoanDoucments = data;
      console.log("LoanDoucments onin it : ",this.LoanDoucments);
      
    });
  }
  DocumentName_Click(index){
    debugger;
    if(parseFloat(this.SelectedDocumentIndex)!=parseFloat(index))
    this.SelectedDocumentIndex=index;
    else{
      this.SelectedDocumentIndex='-1';  
    }
  }
  clear(){
  debugger;
  this.loading=false;
  this.SelectedDocumentIndex='-1';
  this.savebutton='Save & Continue';
  this.disablesavebutton=false;
  this.GetDocuments();
  this.LoanDoucments = this.LoanDoucments.filter(function (Data) {
            let datatofilter = Data.pDocumentsList
            datatofilter.filter(function (row) {
             row.pDocumentMandatory=false;
             row.pDocumentRequired=false;
            })

          })
  this.LoanDoucments=[...this.LoanDoucments];
  }
  OnChange(data) {
    console.log("called",data);
    debugger;
    if (data.pDocumentRequired == false) {
      data.pDocumentRequired = true;
      data.pDocumentMandatory = true;

    }
    if (data.pDocumentMandatory == false) {
      data.pDocumentRequired = false;
    }
    data.ptypeofoperation = this._CommonService.ptypeofoperation;
    data.pCreatedby = this._CommonService.pCreatedby;
    this.DocumentsRequired.push(data);
    let len = this.DocumentsRequiredEdit.length
    if (this.DocumentsRequiredEdit.length != 0) {
      for (var j = 0; j < this.DocumentsRequiredEdit[0].length; j++) {
        this.DocumentsRequired.push(this.DocumentsRequiredEdit[0][j])
      }
    }
    console.log("this.DocumentsRequired : ,",this.DocumentsRequired);
    
  }
  documentrequiredchecked(data1) {
    console.log("data 1 ",data1);
    
    if (data1.pDocumentRequired == false) {
      data1.pDocumentMandatory = false
    }
    data1.ptypeofoperation = this._CommonService.ptypeofoperation;
    data1.pCreatedby = this._CommonService.pCreatedby;
    this.DocumentsRequired.push(data1);
    let len = this.DocumentsRequiredEdit.length
    if (this.DocumentsRequiredEdit.length != 0) {
      for (var j = 0; j < this.DocumentsRequiredEdit[0].length; j++) {
        this.DocumentsRequired.push(this.DocumentsRequiredEdit[0][j])
      }
    }
  }

  // OnChangeRequired(data) {

  //   if (data.pDocumentRequired == true) {
  //     data.pDocumentRequired = true;
  //     data.pDocumentMandatory == false
  //   }
  //   this.DocumentsRequired.push(data);
  //   let len = this.DocumentsRequiredEdit.length
  //   if (this.DocumentsRequiredEdit.length != 0) {
  //     for (var j = 0; j < this.DocumentsRequiredEdit[0].length; j++) {
  //       this.DocumentsRequired.push(this.DocumentsRequiredEdit[0][j])
  //     }
  //   }

  // }
  NextTabClick() {

    debugger;
    let d = this.DocumentsRequiredEdit
    
    this.DocumentsRequired = this.DocumentsRequired.filter(function (Data) {
      Data.pContactType = "INDIVIDUAL";
      return Data.pDocumentMandatory != false || Data.pDocumentRequired != false;
    })

    let len = this.DocumentsRequiredEdit.length
    if (this.DocumentsRequiredEdit.length != 0) {
      for (var j = 0; j < this.DocumentsRequiredEdit[0].length; j++) {
        this.DocumentsRequired.push(this.DocumentsRequiredEdit[0][j])
      }
    }
    if (this.formtype == "SavingAccountConfig") {
      let buttontype = this._savingaccountconfigService.GetButtonClickType()
      if (buttontype != "New") {
        let Edit_data = this._savingaccountconfigService.GetDatatableRowEditClick();
        if(Edit_data){
        this.savingConfigid = Edit_data.savingAccountNameandCodelist.pSavingAccountid;
        this.savingAccname = Edit_data.savingAccountNameandCodelist.pSavingAccountname;
        }
      }
      
      let savingConfigid = this.savingConfigid;
      let createdby = this._CommonService.pCreatedby;
      // function (df) { df.pIsprimaryAccount = false; }
      this.DocumentsRequired.filter(function (Data) {
      
       
        Data.pCreatedby = createdby;
        Data.pModifiedby = createdby;
        
      });
     // if (this.DocumentsRequired.length > 0) {
        let formdata = ({ pSavingConfigid: this.savingConfigid, pSavingAccname: this.savingAccname, ptypeofoperation: "CREATE", identificationdocumentsList: this.DocumentsRequired })
        let jsondata = JSON.stringify(formdata);
        this.loading = true;
        debugger;
        this.savebutton='Processing';
        this.disablesavebutton=true;
        this._savingaccountconfigService.SaveIdentificationdocuments(jsondata).subscribe(res => {
          debugger;
          this.loading = false;
          if (res) {
                this.savebutton='Save & Continue';
                this.disablesavebutton=false;
            this._savingaccountconfigService._addDataToSavingAccountConfigMaster(this.DocumentsRequired, "loansidentificationdocuments")
            let str = "refferral"

            $('.nav-item a[href="#' + str + '"]').tab('show');
          }
        }, err => {
          this.savebutton='Save & Continue';
          this.disablesavebutton=false;
          this.toaster.error("Error while saving")
                    this.loading = false;
        });
      // }
      // else {
      //   let str = "refferral"

      //   $('.nav-item a[href="#' + str + '"]').tab('show');
      // }
      
    }
    


  }
  public GetAccountNameAndCode() {
    this._savingaccountconfigService._GetAccountNameAndCode().subscribe(res => {
      if (res != null && res != undefined && res != "") {
        debugger;
        //console.log("LoanDetails : ",res);
        this.savingConfigid = res.Accountconfigid;
        this.savingAccname = res.AccName;
        //console.log("res in master", res);

      }
    })
  }
}
