import { Component, OnInit, ViewChild, OnChanges, SimpleChanges, Input, DoCheck, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { State } from '@progress/kendo-data-query';
import { SavingtranscationService } from 'src/app/Services/Banking/savingtranscation.service';
import { MemberService } from 'src/app/Services/Banking/member.service';
import { FiPersonaldetailsNomineeComponent } from '../../../Loans/Transactions/FIIndividual/PersonalDetails/fi-personaldetails-nominee.component';
import { templateJitUrl } from '@angular/compiler';
import { isNullOrUndefined } from 'util';
import { NomineedetailsComponent } from '../FD-AC-Creation/nomineedetails.component';
import { RdTransactionsService } from 'src/app/Services/Banking/Transactions/rd-transactions.service';
declare let $: any

@Component({
  selector: 'app-rd-jointmember',
  templateUrl: './rd-jointmember.component.html',
  styles: []
})
export class RdJointmemberComponent implements OnInit{
  @ViewChild(NomineedetailsComponent, { static: true }) nomineeDetails: NomineedetailsComponent;
  gridsum: any;
  formatteddata: any;
  constructor(private _fb:FormBuilder,private _commonservice:CommonService,private savingtranscationservice:SavingtranscationService,private _MemberService:MemberService,private _rdtranscationservice:RdTransactionsService) { }
  JointMemberAndNomineeForm:FormGroup;
  Jointmembergrid: any = [];
  Data:any;
  editdata:any;
  newlist=[]
  MemberDetailsListAll: any
  Membercode:any;
  buttontype:any;
  contacttype:any;
  JointMemberErrorMessages: any={}
  rdMembersandContactDetailsList:any=[]
  ContactDetails: any;
  ShowJointmembers: boolean = false;
  ShowJointmemberstable:boolean=false;
  showNominee = false;
  jointMembervalidation: boolean = false;
  ShowSaveClearbuttons: boolean = true;
  showpercentage=false;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10
  };
 
  @Input() status: boolean;
  // ngDoCheck() {
  //   //
  
    

  // }

  // ngOnChanges() {
  //   // if {
  //         if( this.nomineeDetails && this.nomineeDetails.nomineeList && this.nomineeDetails.nomineeList.length === 0) {
  //           this.nomineeDetails.nomineeList = []
  //         }
         
  //       // }
  // }

 

//   ngDoCheck() {
//     // this.nomineeDetails.nomineeList = []
//     if( this.status === true ) {
//       if(this.buttontype ==="edit")
//     {
      
//       this.editdata=this._rdtranscationservice.GetDetailsForEdit()
//       if(this.editdata.pIsNomineesapplicable==false)
//       {
//         this.JointMemberAndNomineeForm.controls.pIsNomineesApplicableorNot.setValue(true)
//         //this.nomineeDetails.nomineeList=[]
//       }
//       if (this.nomineeDetails)
//        {
//         if (this.editdata.pIsNomineesapplicable == true && this.editdata.rdMemberNomineeDetailsList.length > 0) {
//           this.showNominee = true;
//           // this.JointMemberAndNomineeForm.controls.pIsNomineesApplicableorNot.setValue(this.editdata.pIsNomineesapplicable)
//           this.editdata.rdMemberNomineeDetailsList = this.editdata.rdMemberNomineeDetailsList.filter(itm => itm.pisprimarynominee = itm.pisprimarynominee.toString());
//           this.nomineeDetails.nomineeList = this.editdata.rdMemberNomineeDetailsList;
//           let primary=this.nomineeDetails.nomineeList.filter(data=>data.pisprimarynominee=="true")
//           this.nomineeDetails.checkedlist=primary
//           //  this.editdata.rdMemberNomineeDetailsList.filter(item => {
//           //     // if(item.pisprimarynominee==true)
//           //     // {
//           //     //   this.nomineeDetails.nomineeForm['controls']['pTypeChk'].setValue(true);
//           //     // }

//           //   })

//         }
       
     
//     }
      
//     }
//     else
//     {
// //      let a = this._rdtranscationservice._GetNomineeDetails();
// //      this._rdtranscationservice.jointMember.next(a);
   
         
// //        console.log("checking details", this._rdtranscationservice._GetNomineeDetails());
// //       this.nomineeDetails.nomineeList = []
         
          
// // if(a !== undefined || a!== null) {
              
// //            if(a && a.length > 0) {
// //                 // this.nomineeDetails.nomineeList = []
// //                 this.nomineeDetails.nomineeList = a;
              
// //                 this.showNominee = true;
// //                  this.JointMemberAndNomineeForm.controls.pIsNomineesApplicableorNot.setValue(true)
// //                  for(let i=0;i<this.nomineeDetails.nomineeList.length;i++)
// //                  {
// //                    if(this.nomineeDetails.nomineeList[i].pisprimarynominee==true)
// //                    {
// //                      this.nomineeDetails.nomineeList[i].pisprimarynominee=false
// //                    }
// //                  }

                 
// //             }

//             // // else {
//             // //   if( this.nomineeDetails && this.nomineeDetails.nomineeList && this.nomineeDetails.nomineeList.length === null) {
//             // //      this.nomineeDetails.nomineeList = []
//             // //   }
             
//             // }

//             //  else {
//             //  this.nomineeDetails.nomineeList = []
             
//             //  }
            
//            }
//           //  else {
//           //     if( this.nomineeDetails && this.nomineeDetails.nomineeList && this.nomineeDetails.nomineeList.length === null) {
//           //       this.nomineeDetails.nomineeList = []
//           //     }
             
//           //   }
//              // let primary=this.nomineeDetails.nomineeList.filter(data=>data.pisprimarynominee=="true")
//               //this.nomineeDetails.checkedlist=primary
//             //  this.nomineeDetails.nomineeList.filter(itm => itm.pisprimarynominee = itm.pisprimarynominee.toString());
   
           

         
        
 
       
          
//           }
      
//       //console.log("nomine",a)
    
    
//   }

  ngOnInit() 
  {
   
    this.FormGroup();
     this.showNominee=true;
    //this.GetMembers();
    this.GetRDMemberNomineeDetails();
   
    this.contacttype=this._rdtranscationservice._GetTab1Contacttype()
    this.buttontype = this._rdtranscationservice.Newstatus();
   
    if(this.buttontype=="edit")
    {     
      this.Editdata()
    }
    let a = this._rdtranscationservice._GetNomineeDetails();
  //this._rdtranscationservice.jointMember.subscribe
    // TODO
   
   
  }

  FormGroup() {
    this.JointMemberAndNomineeForm = this._fb.group
      ({

        pRdAccountId: 0,
        pRdaccountNo: [''],
    
        //pMemberTypeCode: [],
        pApplicantType: [],
      
        pContactid: [''],
        pContactrefid:[''],
        pMemberId:['',Validators.required],
        pMemberCode:[''],
        precordid:['0'],
        pTypeofOperation: ['CREATE'],
        pIsjointMembersapplicableorNot: false,
           pIsNomineesApplicableorNot: true,
        pCreatedby: [this._commonservice.pCreatedby],

      })
  }
  GetMembers() 
  {
    debugger
     let a=this._rdtranscationservice._Getcontacttype();
    
     this._rdtranscationservice.GetRDallJointMembers(a['membercode'],a['Contacttype']).subscribe(result=>{
       this.MemberDetailsListAll=result
     })
    
  }
  Editdata()
  {
    debugger
    this.editdata=this._rdtranscationservice.GetDetailsForEdit()
    console.log('2nd tab data',this.editdata)
    
    this.JointMemberAndNomineeForm.controls.pTypeofOperation.setValue("UPDATE");
    this.JointMemberAndNomineeForm.controls.pIsNomineesApplicableorNot.setValue(this.editdata.pIsNomineesapplicable)
    if(this.editdata.rdMembersandContactDetailsList.length>0)
    {
      this.ShowJointmemberstable=true;
      this.ShowJointmembers=true;
      this.rdMembersandContactDetailsList=this.editdata.rdMembersandContactDetailsList
      this.JointMemberAndNomineeForm.controls.precordid.setValue(this.editdata['rdMembersandContactDetailsList'].precordid)
      this.JointMemberAndNomineeForm.controls.pIsjointMembersapplicableorNot.setValue(this.editdata.pIsJointMembersapplicable)
    }
    else{
      this.JointMemberAndNomineeForm.controls.pIsNomineesApplicableorNot.setValue(false)
      this.ShowJointmemberstable=false;
      this.ShowJointmembers=false;
      this.rdMembersandContactDetailsList=[]
    }
    if(this.editdata.rdMemberNomineeDetailsList.length>0)
    {
      this.showNominee=true;
      this.JointMemberAndNomineeForm.controls.pIsNomineesApplicableorNot.setValue(true)
      this.showNominee = true;
      // this.JointMemberAndNomineeForm.controls.pIsNomineesApplicableorNot.setValue(this.editdata.pIsNomineesapplicable)
      this.editdata.rdMemberNomineeDetailsList = this.editdata.rdMemberNomineeDetailsList.filter(itm => itm.pisprimarynominee = itm.pisprimarynominee.toString());
      this.newlist.push(this.editdata.rdMemberNomineeDetailsList);
      this.nomineeDetails.nomineeList.push(this.editdata.rdMemberNomineeDetailsList)
      let primary=this.nomineeDetails.nomineeList.filter(data=>data.pisprimarynominee=="true")
      this.nomineeDetails.checkedlist=primary
      
    }
    this.formatteddata=this.JointMemberAndNomineeForm.value
   
  }
  GetMemberdetails()
  {
    debugger
    let member=this._rdtranscationservice._GetMemberdetails();
    this.JointMemberAndNomineeForm.controls.pMemberId.setValue(member['Memeberid'])
    this.JointMemberAndNomineeForm.controls.pMemberCode.setValue(member['MemberCode'])
  }
  GetDataForJointMember()
  {
    debugger
    let a= this._rdtranscationservice._GetDataForJointMember();
    this.JointMemberAndNomineeForm.controls.pRdAccountId.setValue(a['RdAccountId']);
    this.JointMemberAndNomineeForm.controls.pRdaccountNo.setValue(a['Rdaccountno']);
    this.JointMemberAndNomineeForm.controls.pApplicantType.setValue(a['ApplicantType']);
    this.JointMemberAndNomineeForm.controls.pContactid.setValue(a['pContactid']);
    this.JointMemberAndNomineeForm.controls.pContactrefid.setValue(a['pContactrefid']);

  }
  BindMemberForSave()
  {

  }
  GetRDMemberNomineeDetails()
  {

  
   
    
  }
  MemberChange(event) {
       if (event != undefined && event != "" && event != null) 
    {
      this.Data={pMemberName:event.pContactName,pMemberCode:event.pMemberReferenceId,pMemberId:event.pMembertypeId,
        pContactid:event.pContactId,pContactrefid:event.pContactReferenceId,pContacttype:event.pContacttype,pContactNo:event.pContactNo,pTypeofOperation:'CREATE',precordid:0}
     // this.JointMemberAndNomineeForm.controls.pMemberCode.setValue(event.pMemberReferenceId);
      // this.JointMemberAndNomineeForm.controls.pMemberName.setValue(event.pContactName);
      // this.JointMemberAndNomineeForm.controls.pMemberType.setValue(event.pMemberType);
      // this.JointMemberAndNomineeForm.controls.pMembertypeId.setValue(event.pMembertypeId)
      // //this.GetContactDetails(event.pMembertypeId)
      // this.JointMemberAndNomineeForm.controls.pMemberId.setValue(event.pMemberId)
    }

  }
  GetContactDetails(MemberID) {
   
    if (MemberID && MemberID != undefined && MemberID != '') {
      this.savingtranscationservice.GetContactDetails(MemberID).subscribe(json => {
        
        this.ContactDetails = json
        this.JointMemberAndNomineeForm.controls.pContactid.setValue(this.ContactDetails.pContactid);
        this.JointMemberAndNomineeForm.controls.pContacttype.setValue(this.ContactDetails.pContacttype);
        this.JointMemberAndNomineeForm.controls.pContactrefid.setValue(this.ContactDetails.pContactreferenceid);
        this.JointMemberAndNomineeForm.controls.pContactno.setValue(this.ContactDetails.pContactno);  
      })
    }

  }
  AddJointMembers() 
  {
    debugger
    let isValid: boolean = true;
  if(this.checkValidations(this.JointMemberAndNomineeForm,isValid))
  {
    let membeid = this.Data['pMemberId'];
    const Checkexistcount = this.rdMembersandContactDetailsList.filter(s => s.pMemberId == membeid).length;
    if (Checkexistcount == 0) {
   
      this.rdMembersandContactDetailsList.push(this.Data);
      this.JointMemberAndNomineeForm.controls.pMemberId.setValue('');
    
    
  }
    else {
      this._commonservice.showWarningMessage("Member already exists in grid.")
    }
  }
      return isValid
     
    
  }
  JointMemberchange(event) 
  {
     debugger
    if (event.target.checked) {
      this.ShowJointmembers = true;
      this.ShowJointmemberstable=true;  
      this.GetMembers();
      this.jointMembervalidation=true
      //this.JointMembervalidation('GET')
      this.JointMemberAndNomineeForm.controls.pIsjointMembersapplicableorNot.setValue(true)
    }
    else 
    {
      this.jointMembervalidation=false;
      this.ShowJointmembers = false;
      this.ShowJointmemberstable=false     
      this.rdMembersandContactDetailsList=[]
    }
  }
  JointMembervalidation(type)
  {
    debugger
    let pMemberId = <FormGroup>this.JointMemberAndNomineeForm['controls']['pMemberId'];
    if(type=='GET')
    {
      pMemberId.setValidators(Validators.required)
    }
    else{
      pMemberId.clearValidators()
    }
    pMemberId.updateValueAndValidity
  }
  Nomineechange(event) {
    debugger;
    if (event.target.checked) {
      this.showNominee = true;    
      this.JointMemberAndNomineeForm.controls.pIsNomineesApplicableorNot.setValue(true)
    
    }
    else {
      this.showNominee = false   
      this.nomineeDetails.showpercentage=false
     this.nomineeDetails.nomineeList.length=0
     this.JointMemberAndNomineeForm.controls.pIsNomineesApplicableorNot.setValue(false)
     
    }
  }
  getConfigNomineeDetails() 
  {
    
    this.newlist = [];
    let formData;
    if (this.showNominee) {
      if (this.nomineeDetails) {
        let NomineeData = null;
        formData = this.nomineeDetails.nomineeList;
        if (formData && formData.length > 0) {
          for (let i = 0; i < formData.length; i++) {
            NomineeData = this.loadPreviousData(this.showNominee);
            NomineeData = Object.assign(NomineeData, formData[i]);
            this.newlist.push(NomineeData);
          }
        }
       
       // this.FiPersonalinformationModel.PersonalNomineeList = [...remainingData, ...this.loadNewListData()];
      }
    }

    //else {
    //  if (this.showNominee) {
    //    this.FiPersonalinformationModel.PersonalNomineeList.push(NomineeData);
    //  }
    //}
    
  }
 
  loadPreviousData(isapplicable): any 
  {
    
    let rowdata =    this._rdtranscationservice._GetDataForJointMember();
    let pCreatedby = this._commonservice.pCreatedby;
    let data;
    data = { pContactid: rowdata['pContactid'], pContactrefid: rowdata['pContactrefid'], pTypeofoperation: 'CREATE',pStatus:isapplicable, pCreatedby: pCreatedby,pRecordid:0,pPercentage:0}
    return data;
  }
  checkValidations(group: FormGroup, isValid: boolean): boolean 
  {
    debugger
    try {
      Object.keys(group.controls).forEach((key: string) => {
        isValid = this.GetValidationByControl(group, key, isValid);
      })
    }
    catch (e) {
      this.showErrorMessage(e);
      return false;
    }
    return isValid;
  }
  GetValidationByControl(formGroup: FormGroup, key: string, isValid: boolean): boolean 
  {
    debugger
    try {
      let formcontrol;
      formcontrol = formGroup.get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          this.checkValidations(formcontrol, isValid)
        }
        else if (formcontrol.validator) {
          this.JointMemberErrorMessages[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonservice.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.JointMemberErrorMessages[key] += errormessage + ' ';
                isValid = false;
              }
            }
          }
        }
      }
    }
    catch (e) {
      this.showErrorMessage(e);
      return false;
    }
    return isValid;
  }
  showErrorMessage(errormsg: string) {
    this._commonservice.showErrorMessage(errormsg);
  }
  BlurEventAllControll(fromgroup: FormGroup) {
    try {
      Object.keys(fromgroup.controls).forEach((key: string) => {
        this.setBlurEvent(fromgroup, key);
      })
    }
    catch (e) {
      this.showErrorMessage(e);
      return false;
    }
  }
  removeHandler(event)
  {
    this.rdMembersandContactDetailsList.splice(event.rowIndex, 1);
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
      this.showErrorMessage(e);
      return false;
    }
  }
  NextTabclick() {
    debugger;
    this.GetDataForJointMember()
    this.GetMemberdetails()
    let isValid = true
    let fidata = JSON.stringify(this.nomineeDetails.nomineeList)
    this.nomineeDetails.nomineeList;
  
 this.contacttype=this._rdtranscationservice.GetBusinessEntityStatus()
    if(this.contacttype==true)
    {
      this.JointMemberAndNomineeForm.controls.pIsNomineesApplicableorNot.setValue(false)
    }
    debugger
    let status: boolean = false;
    status = (this.jointMembervalidation && this.rdMembersandContactDetailsList.length > 0) ? true : !this.jointMembervalidation ? true : false;
    if (status) {
      if (this.nomineeDetails.nomineeList.length != 0) {
        if (this.validatepercentage()) {
          if (this.checkcount()) {
            this.Save()
          }

        }
      }
      else {
        if (this.JointMemberAndNomineeForm.controls.pIsNomineesApplicableorNot.value == true)
         {
          if (this.nomineeDetails.checkedlist.length != 0) {
            this.Save()
          }
          else 
          {        
            this._commonservice.showWarningMessage("Enter Nominee Details")
          }
        }
        else {
          this.Save()
        }


      }

    }
    else {
      this._commonservice.showWarningMessage("Enter Joint Member")
    }
  
 
  
  // this.loading = true;
  
    
   
  
  }
  validatepercentage()
  {
   
    debugger;
    let isValid=true;
    if(this.nomineeDetails.checkedlist.length>=0)
    {
      let gridsum = 0;
      this.gridsum = this.nomineeDetails.checkedlist.reduce((sum, item) => sum + parseFloat(item.pPercentage), 0);
      if( this.gridsum==0 ||  this.gridsum<100) 
      {
        isValid=false;
        this._commonservice.showWarningMessage("Enter Valid Percentage")
      }
      else if( this.gridsum>100)
      {
        isValid=false;
        this._commonservice.showWarningMessage("Enter Valid Percentage")


      }
     
    }
    return isValid
  }
  checkcount()
  {
    debugger
    let isValid=true
    let count=this.nomineeDetails.checkedlist.filter(data=>data.pPercentage=="0").length
    if(count!=0 && this.gridsum>100)
    {
      
      this._commonservice.showWarningMessage("Enter valid percentage");
     // this.nomineeDetails.nomineeList[0].pPercentage.setValue("")
      isValid=false
    }
    else{
      isValid=true
    }
    return isValid
  
  }
  Save()
  {
    if (this.rdMembersandContactDetailsList.length > 0 || this.nomineeDetails.nomineeList.length > 0) {
      if (this.showNominee) {
        this.getConfigNomineeDetails();
      }
     }
    
     
     debugger
       let contactdetails = { rdMembersandContactDetailsList: this.rdMembersandContactDetailsList }
       
     let contactdetailsform = Object.assign(this.JointMemberAndNomineeForm.value, contactdetails);
    
       let nominedetails = { rdMemberNomineeDetailsList:this.newlist }
     let nomineeform = Object.assign(this.JointMemberAndNomineeForm.value, nominedetails);
    //  if (Object.entries(this.JointMemberAndNomineeForm.value).toString() === Object.entries(this.formatteddata).toString()) {
    // }
       let data=JSON.stringify(nomineeform)
       debugger
      this._rdtranscationservice.SaveRDJointMembersandNomineeData(data).subscribe(json=>{
        if(json)
        {
          this.clear()
         let str = "refferral"
           $('.nav-item a[href="#' + str + '"]').tab('show');
           
        }
      })
  }
  clear()
  {
    this.FormGroup();
    this.nomineeDetails.nomineeList=[];
    this.nomineeDetails.checkedlist=[];
   this.buttontype= this._rdtranscationservice.Newformstatus("new")
    this.ShowJointmembers=false;
    this.ShowJointmemberstable=false;
  }
  
}
