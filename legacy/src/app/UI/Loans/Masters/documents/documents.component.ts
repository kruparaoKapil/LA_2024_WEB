import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { DocumentsmasterService } from 'src/app/Services/Loans/Masters/documentsmaster.service';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/Services/common.service';
import { GroupDescriptor,process } from '@progress/kendo-data-query';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
declare let $: any;
@Component({
  selector: 'app-documents',
  templateUrl: './documents.html',
})
//@ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
export class DocumentsComponent implements OnInit {
 
  prooftype: any[] = [];
  public loading = false;
  submitted = false;
  data: any = [];
  documentsData: any[] = [];
  gridData: any[] = [];
  disable=false;
  prooftypevalidation=false;
  buttonname="Add and Save";
  documentId;
  documentGroup;
  documentName;
  modalbuttonname="Save";
  hideprooftype=true;
  gridDatatemp:any[]=[];
  public disablesavebutton = false;
  public disablesavebutton1 = false;
  Documents:FormGroup;
  DocumentsGroup:FormGroup;
  public groups: GroupDescriptor[] = [{ field: 'pDocumentGroup' }];
  public headerCells: any = {
    textAlign: 'center'
  };
  constructor(private dms: DocumentsmasterService, private toastr: ToastrService, private _commonService:CommonService) { }
 

  ngOnInit() { 
    debugger
    this.Documents = new FormGroup({
      pDocumentGroup: new FormControl(''),
      pDocumentName: new FormControl('', Validators.required),
      pStatusname: new FormControl('ACTIVE'),
      pDocumentGroupId: new FormControl('', Validators.required),
      pCreatedby: new FormControl(this._commonService.pCreatedby)
    });
    this.DocumentsGroup = new FormGroup({
      pDocumentGroup: new FormControl('',Validators.required),
      pStatusname: new FormControl('ACTIVE'),
      pCreatedby: new FormControl(this._commonService.pCreatedby)
    })
    this.loading=true;
    this.dms.GetDocumentGroupNames().subscribe(data => { this.prooftype = data; });
   
    this.dms.Getdocumentidprofftypes().subscribe(data => {  
      this.gridData = data;
      this.gridDatatemp=data;
      console.log(this.gridData)
      this.loading=false;
    },error=>{this.toastr.error(error, 'Error')})
  }

  onSubmit() {  
    debugger
    this.submitted = true;
        if( this.buttonname=="Add and Save" && this.Documents.valid==true){
          this.disablesavebutton1 = true;
          this.buttonname = 'Processing';
          let id=0;
          this.dms.checkDocumentsDuplicates(this.Documents.controls.pDocumentGroup.value,this.Documents.controls.pDocumentName.value,id).subscribe(data=>{
            
            if(data)
            {
              this.toastr.info("Already Exists", 'Info');
              this.disablesavebutton1 = false;
              this.buttonname = "Add and Save";
              this.clear();
            }
            else {
              let data=JSON.stringify(this.Documents.value)
              this.dms.SaveIdentificationDocuments(data).subscribe(data => {
                
               
                if (data) {
                  this.toastr.success("Saved Successfully", 'Success');
                  this.clear();
                  this.dms.Getdocumentidprofftypes().subscribe(data => {
                    
                    this.gridData = data;
                  })
                }
                this.disablesavebutton1 = false;
                this.buttonname = "Add and Save";
              },error=>{this.toastr.error(error, 'Error');
              this.disablesavebutton1 = false;
                  this.buttonname = "Add and Save";}) 
            }
          
          },error=>{this.toastr.error(error, 'Error');
          this.disablesavebutton1 = false;
              this.buttonname = "Add and Save";})
         
        }
        if( this.buttonname=="Update" && this.Documents.valid==true){
          this.disablesavebutton1 = true;
          this.buttonname = 'Processing';
          this.submitted = true;
              if(this.Documents.controls.pDocumentName.value!=this.documentName){
                this.dms.checkDocumentsDuplicates(this.documentGroup,this.Documents.controls.pDocumentName.value,this.documentId).subscribe(data=>{
                  
                  if(data)
                  {
                    this.toastr.info("Already Exists", 'Info');
                  }
                  else{

                    this.Documents.value["pDocumentGroup"]=this.documentGroup;
                    this.Documents.value["pDocumentId"]=this.documentId;
                    if(this.Documents.valid==true){
                      this.disablesavebutton1 = true;
                      this.buttonname = 'Processing';
                    let updateddata=JSON.stringify(this.Documents.value);
                    this.dms.updateDocumentsForm(updateddata).subscribe(data=>{
                      
                      this.toastr.success("Updated Successfully", 'Success')
                    
                      this.dms.Getdocumentidprofftypes().subscribe(data => {  
                        this.gridData = data;
                       
                      })
                    },error=>{this.toastr.error(error, 'Error')})
                    this.disablesavebutton1 = false;
                    this.buttonname = "Add and Save";
                    this.clear();
                  }
                  
                  }
                  
                },error=>{this.toastr.error(error, 'Error')
                this.disablesavebutton1 = false;
                this.buttonname = "Add and Save";})
             
            }
            else{
              this.disablesavebutton1 = false;
              this.buttonname = "Add and Save";
              this.clear();
            }
            
        }
  }

  addProofType() {
   
    debugger
    
    if(this.DocumentsGroup.controls.pDocumentGroup.value!="" && this.DocumentsGroup.controls.pDocumentGroup.value!=null){
      this.disablesavebutton = true;
      this.modalbuttonname = 'Processing';
    this.dms.checkProofTypeDuplicates(this.DocumentsGroup.controls.pDocumentGroup.value).subscribe(data=>{
      
      if(data){
        this.toastr.info(" ProofType Already Exists", 'Info');
        this.disablesavebutton = false;
        this.modalbuttonname = "Save";
        this.clearProofType();
      }
      else{
     
        this.data =JSON.stringify(this.DocumentsGroup.value);
          this.dms.SaveDocumentGroup(this.data).subscribe(data => {
            
            if (data) {
              this.dms.GetDocumentGroupNames().subscribe(data => { this.prooftype = data; });
              this.disablesavebutton = false;
              this.modalbuttonname = "Save";
            }
          },error=>{this.toastr.error(error, 'Error');
          this.disablesavebutton = false;
          this.modalbuttonname = "Save";})
        
          $('#add-detail').modal('hide');
          this.clearProofType();
          
      }
    },error=>{this.toastr.error(error, 'Error');
    this.disablesavebutton = false;
    this.modalbuttonname = "Save";})
  }
  else{
    this.prooftypevalidation=true;
  }
}

editHandler(event){
    if(event.dataItem.pStatusname=="Active"){
      this.documentId=event.dataItem.pDocumentId;
      this.documentGroup=event.dataItem.pDocumentGroup;
      this.documentName=event.dataItem.pDocumentName;
      this.buttonname="Update";
      this.Documents.controls.pDocumentName.setValue(this.documentName);
      this.Documents.controls.pDocumentGroupId.setValue(event.dataItem.pDocumentGroupId);
      this.disable=true;
    }  
    else{
      this.clear();
    }
  }

  deleteData={};

  removeHandler(event){
   
    this.deleteData["pDocumentId"]=event.dataItem.pDocumentId;
    
    if(event.dataItem.pStatusname=="Active"){
      this.deleteData["pStatusname"]="In-Active";
    }
    else{
      this.deleteData["pStatusname"]="Active";
    }
    
    let datatobedeleted=JSON.stringify(this.deleteData);
    this.dms.deleteDocuments(datatobedeleted).subscribe(data=>{
      
      if(data){
        this.dms.Getdocumentidprofftypes().subscribe(data => {  
          this.gridData = data;
        })
      }
    },error=>{this.toastr.error(error, 'Error')})
    


  }

  selectProofType(args) {
     
    let str = args.target.options[args.target.selectedIndex].text
    this.Documents.controls.pDocumentGroup.setValue(str);
  }
  clearProofType(){
    this.DocumentsGroup.reset();
    this.DocumentsGroup.controls.pCreatedby.setValue(this._commonService.pCreatedby);
    this.DocumentsGroup.controls.pDocumentGroup.setValue("");
    this.DocumentsGroup.controls.pStatusname.setValue("ACTIVE");
  }

  clear()
  {
    this.buttonname="Add and Save";
    this.submitted=false;
     this.Documents.reset();
     this.disable=false;
    this.Documents.controls.pDocumentGroupId.setValue("");
    this.Documents.controls.pStatusname.setValue("ACTIVE");
    this.ngOnInit();
  }
  clickToAddProofType(){
    
    this.DocumentsGroup.controls.pDocumentGroup.setValue("")
    this.DocumentsGroup.controls.pStatusname.setValue("ACTIVE");
    this.prooftypevalidation=false;
  }

  SearchRecord(inputValue: string) {
        
    this.gridData = process(this.gridDatatemp, {
        filter: {
            logic: "or",
            filters: [
                {
                    field: 'ppDocumentGroup',
                    operator: 'contains',
                    value: inputValue
                },
                {
                    field: 'pDocumentName',
                    operator: 'contains',
                    value: inputValue
                },
                
            ],
        }
    }).data;
    //this.dataBinding.skip = 0;
}
}


