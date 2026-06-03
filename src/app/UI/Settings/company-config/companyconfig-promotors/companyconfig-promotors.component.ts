import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { ContactSelectComponent } from 'src/app/UI/Common/contact-select/contact-select.component';
import { CompanyconfigService } from 'src/app/Services/Settings/companyconfig.service';

@Component({
  selector: 'app-companyconfig-promotors',
  templateUrl: './companyconfig-promotors.component.html',
  styleUrls: ['./companyconfig-promotors.component.css']
})
export class CompanyconfigPromotorsComponent implements OnInit {

  @ViewChild(ContactSelectComponent, { static: false }) ContacttypeComp: ContactSelectComponent;
  @Input() SelectType: any;
  gridData:any=[]
  contactselect:any=[]
  lstCompanyContactDTO:any=[]
  selectedContact: any;
  constructor(private _commonService:CommonService,private _companyconfigservice:CompanyconfigService) { }
  companyconfigpromotorsform = new FormGroup({
    pCompanyId: new FormControl(0),
    pRecordId: new FormControl(0),
    pContactId: new FormControl(''),  
    ptypeofoperation:new FormControl('CREATE')
   
  })
  ngOnInit() 
  {

  }
  GetContactPersonDataInFiOther(data) {
        
   debugger;
      this.selectedContact = data;      
      
  }
  addDataToTable()
  {
    debugger;
    console.log("this.selectedContact : ",this.selectedContact);
    if(this.selectedContact) {

     
      this.companyconfigpromotorsform.controls.pContactId.setValue(this.selectedContact.pContactId)
      //console.log(this.companyconfigpromotorsform.controls.pContactId.value) 
    
      this.ContacttypeComp.refreshContactSelectComponent();
      let documentdata = [];
        documentdata = this.gridData.filter(data => {
        return data.pContactId ==this.selectedContact.pContactId
      })


      if (documentdata.length == 0) {
        this.gridData.push(this.selectedContact)
        this.lstCompanyContactDTO.push(this.companyconfigpromotorsform.value)       
      }
      else{
        this._commonService.showWarningMessage('User already exists')
      }
      this.ContacttypeComp.ShowImageCard = false;
      this.selectedContact=null
    }
    else if(this.selectedContact==undefined)
    {
      this.showWarningMessage('please select contact')
    }
   
  }
  removeHandler(event)
  {
    this.gridData.splice(event.rowIndex, 1);
  }
  showWarningMessage(errormsg: string)
  {
    this._commonService.showWarningMessage(errormsg)
  }
  clear()
  {
    this.gridData=[]
    this.companyconfigpromotorsform.reset()
  }
}
