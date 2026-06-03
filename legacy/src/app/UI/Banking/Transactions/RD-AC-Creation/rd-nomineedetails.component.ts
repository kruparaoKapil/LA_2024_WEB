import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { FIIndividualService } from 'src/app/Services/Loans/Transactions/fiindividual.service';
import { FdRdTransactionsService } from 'src/app/Services/Banking/Transactions/fd-rd-transactions.service';
import { isNullOrUndefined } from '@swimlane/ngx-datatable';
declare let $: any

@Component({
  selector: 'app-rd-nomineedetails',
  templateUrl: './rd-nomineedetails.component.html'
})
export class RdNomineedetailsComponent implements OnInit {

  public pdateofbirthConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  @Input() showNominee: any;
  nomineeForm: FormGroup;
  rowindex: any;
  idprooftype:any;
  idproof:any;
  primarynominee: any;
  constructor( private datepipe: DatePipe, 
    private _FormBuilder: FormBuilder, 
    private _commonService: CommonService, 
    private _FIIndividualService: FIIndividualService,private _fdrdtranscationservice:FdRdTransactionsService) 
    {
      this.pdateofbirthConfig.containerClass = 'theme-dark-blue';
      this.pdateofbirthConfig.showWeekNumbers = false;
      this.pdateofbirthConfig.maxDate = new Date();
      this.pdateofbirthConfig.dateInputFormat = 'DD-MM-YYYY'
     }
  
  disablenominee:boolean
  checkedlist:any=[]
  nomineeList = [];
   percentage:any;
  formValidationMessages: any;
  idProofTypeList: any;
  showpercentage:boolean=false
  showpercentageintable:boolean=false
  idProofList: any;
  imageResponse: any;
  referenceno:any;
  recordid:any;
  buttontype:any;
  kycFilePath:any;
  kycFileName:any;
  ngOnInit()
   {
    this.nomineeList = [];
    this.formValidationMessages = {};
    this.formgroup()
    this.BlurEventAllControll(this.nomineeForm);
    this.getidProofTypeList();
    this.disablenominee=false;
    this.referenceno=true
    this.buttontype = this._fdrdtranscationservice.Newstatus();
    this._fdrdtranscationservice.jointMember.subscribe((response)=>
    {
      debugger
      console.log("nominee details",response);
      let a=response;
      if(a !== undefined || a!== null) {
              
          if(a && a.length > 0) {
            // this.nomineeDetails.nomineeList = []
            this.nomineeList = a;
          
            this.showNominee = true;
           //  this.JointMemberAndNomineeForm.controls.pIsNomineesApplicableorNot.setValue(true)
             for(let i=0;i<this.nomineeList.length;i++)
             {
               if(this.nomineeList[i].pisprimarynominee==true)
               {
                 this.nomineeList[i].pisprimarynominee=false
               }
             }

            }      
        
    }
       else {
              this.nomineeList = []
             
             }
  })
   }
  

  trackByFn(index, item) {
    return index; // or item.id
  }
  formgroup()
  {
    this.nomineeForm = this._FormBuilder.group({
      precordid: [0],
      pnomineename: ['',Validators.required],
      prelationship: [''],
      pdateofbirth: [''],
      page: [''],
      pcontactno: [''],
      pidprooftype: [''],
      pDocumentGroup: [''],
      pDocumentGroupId: [''],
      pidproofname: [''],
      pDocumentId: [''],
      pPercentage:['0',Validators.required],
      pTypeChk:[''],
      pisprimarynominee: [],
      pDocumentName: [''],
      preferencenumber: [''],
      pdocidproofpath: [''],
      pCreatedby: [this._commonService.pCreatedby],
      pStatusname: ['ACTIVE'],
      ptypeofoperation: ['CREATE'],
    })
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
          this.formValidationMessages[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.formValidationMessages[key] += errormessage + ' ';
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
  validateNominee() 
  {    
    debugger
    let isValid = true;
    if(this.buttontype!="edit")
    {
      let addFlag = false;
      let fullname = this.nomineeForm.controls.pnomineename.value;
      fullname = fullname.trim();
      if(fullname) {
        if(this.nomineeForm.value.pnomineename ||
          this.nomineeForm.value.prelationship ||
          this.nomineeForm.value.pdateofbirth ||
          this.nomineeForm.value.pcontactno ||
          this.nomineeForm.value.pidproofname        
          ) {
            addFlag = true;
            isValid = addFlag;
          }
          else {
            addFlag = false;
            isValid = addFlag;          
          }
          this.formValidationMessages.pnomineename = "";
          this.BlurEventAllControll(this.nomineeForm);
      }
      else {
        addFlag = false;
        isValid = addFlag;
        this.BlurEventAllControll(this.nomineeForm);
        this.formValidationMessages.pnomineename = "Full Name is required";
      }      
         if(addFlag){         
          if(this.nomineeList.length > 0) {    
            for (let i = 0; i < this.nomineeList.length; i++) {     
              if(this.nomineeList[i].pnomineename == this.nomineeForm.value.pnomineename && 
                this.nomineeList[i].prelationship == this.nomineeForm.value.prelationship)  {
                  this._commonService.showWarningMessage("Already existed");
                  isValid = false;
                 break;
                } 
                else {
                  isValid = true;
                } 
                
            }
          }
        }
    }
    
    return isValid;
  }
  /**<-----(end) checking validations of nominee form(end)-------> */

  /**<-----(start) add nominee form data to grid(start)-------> */
  Percentagechange(event)
  {
    debugger
    this.percentage=parseInt(event.target.value)
    // if(this.percentage>100)
    // {
    //   this._commonService.showWarningMessage("proportional should not be greater than 100");
    //   this.nomineeForm.controls.pPercentage.setValue("");
    // }
   this.nomineeForm.controls.pPercentage.setValue(event.target.value);
  }
  validatepercentage()
  {
    let isValid=true
    debugger;
  
    if(this.percentage>100)
    {
      this._commonService.showWarningMessage("Enter Valid Proportional");
      this.nomineeForm.controls.pPercentage.setValue("")
      isValid=false

    }
    else{
      if(this.nomineeList.length>0)
      {
        let gridsum = 0;
       
         
        
       
          gridsum = this.nomineeList.reduce((sum, item) => sum + parseFloat(item.pPercentage), 0);
        
        
         let Availblepercentage=100-gridsum
         if(this.percentage>Availblepercentage)
         {
           this._commonService.showWarningMessage("Enter Valid Proportional")
           this.nomineeForm.controls.pPercentage.setValue("")
           isValid=false
         }
         else{
           isValid=true
  
         }
      }
    }
   
    return isValid
  }
  // datatableclickedit(event)
  // {
  //   debugger;
  //   this.rowindex=event.rowIndex
  //   this.disablenominee=true;
  //   this.recordid=event.dataItem.precordid;
  //   this.primarynominee=event.dataItem.pisprimarynominee
  //   this.nomineeForm.controls.precordid.setValue( this.recordid)
  //   this.nomineeForm.controls.pisprimarynominee.setValue(this.primarynominee)
  //   this.nomineeForm.controls.ptypeofoperation.setValue("UPDATE")
   
  //    console.log(event.dataItem)
  //    this.nomineeForm.patchValue({
  //     pnomineename: event.dataItem.pnomineename,
  //     prelationship:  event.dataItem.prelationship,
  //     pdateofbirth:  event.dataItem.pdateofbirth,
  //     page:  event.dataItem.page,
  //     pcontactno:  event.dataItem.pcontactno,
  //     pidprooftype:  event.dataItem.pidprooftype,
  //     pDocumentGroup:  event.dataItem.pDocumentGroup,
  //     pDocumentGroupId: event.dataItem.pDocumentGroupId,
  //     pidproofname:  event.dataItem.pidproofname,
  //     pDocumentId:  event.dataItem.pDocumentId,
  //     pPercentage: event.dataItem.pPercentage,
  //     pTypeChk: event.dataItem.pTypeChk,
  //     pisprimarynominee:  event.dataItem.pisprimarynominee,
  //     pDocumentName:  event.dataItem.pDocumentName,
  //     preferencenumber:  event.dataItem.preferencenumber,
  //     pdocidproofpath:  event.dataItem.pdocidproofpath,
  //    })
  //    this.nomineeList[this.rowindex] = this.nomineeForm.value;

     
  // }
  addNominee()
   {   
    debugger;
    try {   
      let isValid=true
      if (this.checkValidations(this.nomineeForm, isValid)) 
      {
        if (this.validateNominee()) 
        {      
          if(this.validatepercentage() && this.nomineeForm.controls.pPercentage.value<=100)
          {
            let latest_date = this.nomineeForm.controls.pdateofbirth.value;
            this.nomineeForm['controls']['pdateofbirth'].setValue(latest_date);
            this.nomineeForm['controls']['pdocidproofpath'].setValue(this.kycFilePath);
           // this.nomineeForm['controls']['pidproofname'].setValue(this.kycFileName);
          
              this.nomineeForm['controls']['pTypeChk'].setValue("true");
              this.nomineeForm.controls.pisprimarynominee.setValue("true");
            
           
            //console.log(this.nomineeList.filter(data=>data.pPercentage==0))
           
           
            if(this.nomineeForm.controls.pPercentage.value==0)
            {
              this._commonService.showWarningMessage("Enter Valid Percentage");
              this.nomineeForm.controls.pPercentage.setValue("")
  
            }else
            {
              
                
                this.nomineeList.push(this.nomineeForm.value);
                let count= this.nomineeList.filter(data=>data.pisprimarynominee=="true")
  
                this.checkedlist=count
              
              
              this.nomineeForm.controls.pPercentage.setValue('0');
              this.referenceno=true
             this.nomineeForm.reset();
            this.nomineeForm.controls.pPercentage.setValue('');
             this.kycFileName='';
             this.kycFilePath='';
             this.formValidationMessages = {};
             if(this.imageResponse)
             this.imageResponse.name='';
             $('#fileKycNomineeDetails').val(null);
            // this.formgroup()
             this.nomineeForm = this._FormBuilder.group({
               precordid: [0],
               pnomineename: [''],
               prelationship: [''],
               pdateofbirth: [''],
               page: [''],
               pTypeChk:[''],
               pcontactno: [''],
               pisprimarynominee: [],
               pidprooftype: [''],
               pDocumentGroup: [''],
               pDocumentGroupId: [''],
               pidproofname: [''],
               pDocumentId: [''],
               pDocumentName: [''],
               preferencenumber: [''],
               pdocidproofpath: [''],
               pPercentage:['0'],
     
               pCreatedby: [this._commonService.pCreatedby],
               pStatusname: ['ACTIVE'],
               ptypeofoperation: ['CREATE'],
             })
             this.BlurEventAllControll(this.nomineeForm);
             }
            }
           
          //  else{
          //   this._commonService.showWarningMessage("Enter Valid Percentage");
          //   this.nomineeForm.controls.pPercentage.setValue("")
          //  } 
        }else{
          if ($('#fileKycNomineeDetails').val()) {
            $('#fileKycNomineeDetails').val(null);
            if(this.imageResponse)
            this.imageResponse.name='';
          }
        }
      }
     
    } catch (e) {
    }
  }
  /**<-----(end) add nominee form data to grid(end)-------> */

  /**<-----(start) remove one record to grid(start)-------> */
  removeHandler(event) 
  {
    debugger
    this.nomineeList.splice(event.rowIndex, 1);
    this.checkedlist.splice(event.rowIndex,1)
  }
  /**<-----(end) remove one record to grid(end)-------> */

  /**<-----(start) get id proof type list from api(start)-------> */
   getidProofTypeList() {
    this._FIIndividualService.getDocumentGroupNames().subscribe(json => {
      
      if (json != null) {
        this.idProofTypeList = json
      }
    },
      (error) => {
        this._commonService.showErrorMessage(error);
      });

  }
  Percentagechangeingrid(event,dataItem,rowindex)
  {
    debugger;
   if(dataItem.precordid!=0)
   {
    dataItem.ptypeofoperation="UPDATE"
    //this.checkedlist[rowindex]=
   }
   
    if(event.target.value>100)
    {
      dataItem.pPercentage="";
      this._commonService.showWarningMessage("Percentage should not be Greater than 100")
    }
    else{
      dataItem.pPercentage=event.target.value
    }
    console.log(dataItem)
  }
  /**<-----(end) get id proof type list from api(end)-------> */

  /**<-----(start) change id proof type functionality(start)-------> */
   pidprooftypeChange($event) 
   {
     debugger

     this.idprooftype=$event.target.value
    const pDocumentId = $event.target.value;
    this.idProofList = [];
   this.validationforidproof('GET')
if(this.idproof!=undefined && this.idprooftype!=undefined)
    {
      this.referenceno=false
    }
    if (pDocumentId && pDocumentId != '') {
      const pDocumentGroup = $event.target.options[$event.target.selectedIndex].text;
      this.nomineeForm['controls']['pidprooftype'].setValue(pDocumentGroup);
      this.nomineeForm['controls']['pDocumentGroup'].setValue(pDocumentGroup);
      this.getidProofList(pDocumentId)
    }
    else {
      this.nomineeForm['controls']['pidprooftype'].setValue('');
      this.nomineeForm['controls']['pDocumentGroup'].setValue('');
    }
  }
  /**<-----(end) change id proof type functionality(end)-------> */

  /**<-----(start) get id proof list from api(start)-------> */
  getidProofList(pDocumentId) {
    this._FIIndividualService.getDocumentNames(pDocumentId).subscribe(json => {
      if (json != null) {
        this.idProofList = json
      }
    },
      (error) => {
        this._commonService.showErrorMessage(error);
      });
  }
  /**<-----(end) get id proof list from api(end)-------> */

  /**<-----(start) change id proof functionality(start)-------> */
  validationforidproof(type)
  {
    debugger
    let idproof = <FormGroup>this.nomineeForm['controls']['pDocumentName'];
    let referenceno = <FormGroup>this.nomineeForm['controls']['preferencenumber'];
    if (type == 'GET') {
      idproof.setValidators(Validators.required)
      //referenceno.setValidators(Validators.required)
     
    }

    idproof.updateValueAndValidity();
    //referenceno.updateValueAndValidity();
  }
  pidproofChange($event) 
  {
    debugger
    this.idproof=$event.target.value;
    const pDocumentId = $event.target.value;
    if(this.idproof!=undefined && this.idprooftype!=undefined)
    {
      this.referenceno=false
    }
    if (pDocumentId && pDocumentId != '') {
      const pDocumentGroup = $event.target.options[$event.target.selectedIndex].text;
      this.nomineeForm['controls']['pidproofname'].setValue(pDocumentGroup);
    }
    else {
      this.nomineeForm['controls']['pidproofname'].setValue('');
      this.nomineeForm['controls']['pDocumentName'].setValue('');
    }
  }
  /**<-----(end) change id proof functionality(end)-------> */

  /**<-----(start) age calculation functionality based on year(start)-------> */
  ageCalculation() {
    let age;
    let dob = this.nomineeForm['controls']['pdateofbirth'].value;
    let date=this._commonService.getFormatDate(dob)
    if (dob != '' && dob != null) {
      let currentdate = Date.now();
      let agedate = new Date(dob).getTime();
      let timeDiff = Math.abs(currentdate - agedate);
      if (timeDiff.toString() != 'NaN')
        age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
      else
        age = 0;
    }
    else {
      age = 0;
    }
    this.nomineeForm['controls']['page'].setValue(age);
  }
  /**<-----(end) age calculation functionality based on year(end)-------> */

  /**<-----(start)upload file functionlity(start)-------> */
  uploadAndProgress(event: any, files) {
    let file = event.target.files[0];
    if (event && file) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = e => {
        this.imageResponse = {
          name: file.name,
          fileType: "imageResponse",
          contentType: file.type,
          size: file.size,
        };
      };
    }
    let fname = "";
    if (files.length === 0) {
      return;
    }
    var size = 0;
    const formData = new FormData();
    for (var i = 0; i < files.length; i++) {
      size += files[i].size;
      fname = files[i].name
      formData.append(files[i].name, files[i]);
      formData.append('NewFileName', this.nomineeForm.value["pDocumentName"] + '.' + files[i]["name"].split('.').pop());
    }
    size = size / 1024;
    this._commonService.fileUpload(formData).subscribe(data => {
      this.kycFileName = data[1];
      if(this.imageResponse)
      this.imageResponse.name = data[1];
      this.kycFilePath = data[0];
    })
  }
  /**<-----(end)upload file functionlity(end)-------> */

  loadInitData() {
    this.formValidationMessages = {};
    this.nomineeForm = this._FormBuilder.group({
      precordid: [0],
      pnomineename: [''],
      prelationship: [''],
      pdateofbirth: [''],
      page: [''],
      pcontactno: [''],
      pidprooftype: [''],
      pDocumentGroup: [''],
      pDocumentGroupId: [''],
      pidproofname: [''],
      pDocumentId: [''],
      pisprimarynominee: [],
      pDocumentName: [''],
      preferencenumber: [''],
      pdocidproofpath: [''],
      pCreatedby: [this._commonService.pCreatedby],
      pStatusname: ['ACTIVE'],
      ptypeofoperation: ['CREATE'],
    })
    this.BlurEventAllControll(this.nomineeForm);
  }
  changePriority(event,dataItem, rowIndex) {
    debugger;

    if(event.target.checked==true)
    {
      if(this.buttontype=="edit")
      {
        dataItem.ptypeofoperation='UPDATE'
      }
      this.nomineeList[rowIndex] = dataItem
      dataItem.pisprimarynominee = 'true';
    
     
      if(this.nomineeList.length!=0)
      {
         let count=this.nomineeList.filter(data=>data.pisprimarynominee=='true')
         this.checkedlist=count
  
  
      }
    }
 

    else
    {
      if(this.buttontype=="edit")
      {
        dataItem.ptypeofoperation='UPDATE'
      }
      this.checkedlist.splice(event.rowIndex, 1);
      dataItem.pisprimarynominee = 'false';
      this.nomineeList[rowIndex] = dataItem
    }
  
    
  
   
    

  }

}
