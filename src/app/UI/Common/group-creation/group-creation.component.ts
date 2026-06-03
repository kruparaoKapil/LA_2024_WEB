import { Component, OnInit, Output, ViewChild, EventEmitter, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm, FormArray, MinLengthValidator } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { FIIndividualService } from 'src/app/Services/Loans/Transactions/fiindividual.service';
import { MemberSelectComponent } from '../member-select/member-select.component';
import { GroupService } from 'src/app/Services/Common/group.service';
import { CommonService } from 'src/app/Services/common.service';
import { Router,ActivatedRoute, NavigationEnd } from '@angular/router';
import { TagListComponent } from '@progress/kendo-angular-dropdowns';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-group-creation',
  templateUrl: './group-creation.component.html',
  styles: []
})

export class GroupCreationComponent implements OnInit {
  @ViewChild(MemberSelectComponent, { static: false }) MemberSelectComponentData: MemberSelectComponent;
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public disableRoleintheGroup: boolean;
  public checkvalue: boolean;
  public CreateGroupform: FormGroup;
  public tempFrom: FormGroup;
  public submitted = false;
  public CreateGroupformArrayview: any = [];
  public CreateGroupformArray: any = [];
  public ListGroupDetails:any=[];
  public view: [];
  public rolename: any;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 100
  };
  public isNew: boolean;
  public savebutton='Save';
  public disablesavebutton=false;
  public ShowContactBusiness: Boolean
  public ApplicantData: any;
  public gContactId: any;
  public memberId:any;
  public gApplicantname: any;
  public gContactreferenceid: any;
  public gContacttype: any;
  public gApplicanttype: any;
  public gApplicantConfigStatus: any;
  public GetContactPersonDataArray: any = [];
  public roleInTheGroupData: any = [];
  public gBusinessEntitycontactNo: any;
  public GroupcreationValidationErrors: any;
  public groupDetails: any;
  public editArraydata: any;
  public editedIds: any;
  public control: any = [];
  previousUrl: string;
public today: Date = new Date();
  constructor(private fb: FormBuilder, private toaster: ToastrService, private _FIIndividualService: FIIndividualService, private _GroupService: GroupService, private _commonService: CommonService, private router: Router,private ActRoute: ActivatedRoute) {

     this.dpConfig.dateInputFormat = 'DD/MM/YYYY'
    this.dpConfig.maxDate = new Date();
    this.dpConfig.showWeekNumbers = false;

    router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe(e => {
        //this.previousUrl = e['url'];
        //console.log('prev:', this.previousUrl);
      });
  }

  ngOnInit() {
    
    // check group head selected or not
    this.checkvalue = false;
    this.GroupcreationValidationErrors = {}
    this.disableRoleintheGroup = false;
    this.ApplicantData = {};
    this.savebutton='Save';
    this.disablesavebutton=false;
    this.ShowContactBusiness = false;
    this.CreateFormControls();
    this.ListGroupDetails=[];
    this.BlurEventAllControll(this.CreateGroupform);
    /** Get Group Role Inthe Group */
    this.getGroupService();

    /**Edit Form */
    this.editedIds = this._GroupService.GetGroupRowEditClick();
    if (this.ActRoute.snapshot.params['id']) {
      debugger
      this.editedIds = atob(this.ActRoute.snapshot.params['id']);
    if (this.editedIds != undefined) {
      this._GroupService.GroupCreateEdit(parseInt(this.editedIds)).subscribe(res => {
        debugger;
        this.savebutton='Update';
        this.editArraydata = res[0];
      //  for (let i = 0; i < this.editArraydata['pListGroupDetails'].length; i++) {
      //    this.control = <FormArray>this.CreateGroupform.controls['pListGroupDetails'];
      //     this.control.push(this.getUnit());
      //     this.CreateGroupform.controls['pListGroupDetails']["controls"][0]["controls"]["pContactID"].setValue(this.editArraydata['pListGroupDetails'][i].pContactID); 
      //     this.CreateGroupform.controls['pListGroupDetails']["controls"][0]["controls"]["pMemberId"].setValue(this.editArraydata['pListGroupDetails'][i].pMemberId);
      //     this.CreateGroupform.controls['pListGroupDetails']["controls"][0]["controls"]["pContactName"].setValue(this.editArraydata['pListGroupDetails'][i].pContactName);
      //     this.CreateGroupform.controls['pListGroupDetails']["controls"][0]["controls"]["pContactRefId"].setValue(this.editArraydata['pListGroupDetails'][i].pContactRefId);
      //     this.CreateGroupform.controls['pListGroupDetails']["controls"][0]["controls"]["pContactNo"].setValue(this.editArraydata['pListGroupDetails'][i].pContactNo);
      //     this.CreateGroupform.controls['pListGroupDetails']["controls"][0]["controls"]["pGrouproleID"].setValue(this.editArraydata['pListGroupDetails'][i].pGrouproleID);
      //     this.CreateGroupform.controls['pListGroupDetails']["controls"][0]["controls"]["pRoleInGroup"].setValue(this.editArraydata['pListGroupDetails'][i].pRoleInGroup);
      //     this.CreateGroupform.controls['pListGroupDetails']["controls"][0]["controls"]["pTypeofOperation"].setValue('update');
      //     this.CreateGroupform.controls['pListGroupDetails']["controls"][0]["controls"]["pRecordId"].setValue(this.editArraydata['pListGroupDetails'][i].pRecordId);
      //  }
       this.CreateGroupform.value.pListGroupDetails=this.editArraydata['pListGroupDetails'];
        this.CreateGroupformArrayview = this.CreateGroupform.value.pListGroupDetails;
        this.ListGroupDetails=this.editArraydata['pListGroupDetails'];
        this.CreateGroupform.controls.pGroupCode.setValue(this.editArraydata['pGroupCode']);
        this.CreateGroupform.controls.pGroupName.setValue(this.editArraydata['pGroupName']);
        this.CreateGroupform.controls.pMembersCount.setValue(this.editArraydata['pMembersCount']);
        this.CreateGroupform.controls.pGroupType.setValue(this.editArraydata['pGroupType']);
        this.CreateGroupform.controls.ptypeofoperation.setValue('update');
        this.CreateGroupform.controls.pGroupID.setValue(this.editArraydata['pGroupID']);
        },
        (error) => {
          this.showErrorMessage(error);
        });
    }
  }
  }

  private getUnit() {

    return this.fb.group({
      pContactID: [''],
      pContactName: [''],
      pContactRefId: [''],
      pMemberId: [0],
      pContactNo: [''],
      pGrouproleID: [''],
      pRoleInGroup: [''],
      pTypeofOperation: [''],
      pRecordId: [0]
    });

  }
Liability_Change(type){
  debugger;
  this.Clear();
  this.CreateGroupform.controls.pGroupType.setValue(type);
}
  ngAfterViewInit() {
    this.MemberSelectComponentData.refreshContactSelectComponent();
  }

  showErrorMessage(errormsg: string) {
    this._commonService.showErrorMessage(errormsg);
  }

  showInfoMessage(errormsg: string) {
    this._commonService.showInfoMessage(errormsg);
  }

  //----------------VALIDATION----------------------- //
  checkValidations(group: FormGroup, isValid: boolean): boolean {
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
  GetValidationByControl(formGroup: FormGroup, key: string, isValid: boolean): boolean {
    try {
      let formcontrol;
      formcontrol = formGroup.get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          this.checkValidations(formcontrol, isValid)
        }
        else if (formcontrol.validator) {
          this.GroupcreationValidationErrors[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.GroupcreationValidationErrors[key] += errormessage + ' ';
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

  //----------------VALIDATION----------------------- //

  /** Get Group Role Inthe Group */
  public getGroupService() {

    this._GroupService.GetRoles().subscribe(res => {
      this.roleInTheGroupData = res;
    },
      (error) => {
        this.showErrorMessage(error);
      });
  }


  get f() { return this.CreateGroupform.controls; }

  /**
   * 
   * Get  Contact Person Data
   */
GroupNameCode_Change(){
  debugger;
  let GroupName=this.CreateGroupform.controls.pGroupName.value;
  let Groupid=this.CreateGroupform.controls.pGroupID.value;
  let GroupCode=this.CreateGroupform.controls.pGroupCode.value;
  this._GroupService.CheckDuplicateGroupName(parseInt(Groupid),GroupName,GroupCode).subscribe(result=>{
    if(result){
      // if(result.pGroupNameCount!=0 && result.pGroupCodeCount!=0){
      //   this.CreateGroupform.controls.pGroupName.setValue('');
      //    this.CreateGroupform.controls.pGroupCode.setValue('');
      //   this._commonService.showWarningMessage('Group Name and Group Code Already Exists.');
      // }
     if(result.pGroupNameCount!=0){
        this.CreateGroupform.controls.pGroupName.setValue('');
        this._commonService.showWarningMessage('Group Name Already Exists.');
      }
    //  else if(result.pGroupCodeCount!=0){
    //     this.CreateGroupform.controls.pGroupCode.setValue('');
    //     this._commonService.showWarningMessage('Group Code Already Exists.');
    //   }
    }
  })
}
  public GetContactPersonData(data) {
    debugger;
    if (data) {
      this.gContactId = data.pContactId;
      this.memberId=data.pMemberId;
      this.gApplicantname = data.pContactName;
      this.gContactreferenceid = data.pReferenceId;
      this.gBusinessEntitycontactNo = data.pBusinessEntitycontactNo;
      this.gApplicantConfigStatus = 'NO';
      this._FIIndividualService.getApplicantandOthersData.emit();
    }
    else{
       this.gContactId ='';
       this.memberId='';
      this.gApplicantname = '';
      this.gContactreferenceid ='';
      this.gBusinessEntitycontactNo = '';
      this.gApplicantConfigStatus = '';
    }
  }
  /**
   * Temporary Create Group Save 
   */
  public submitCreateGroupform() {
    debugger
    let isValid = true;

    if (this.checkValidations(this.CreateGroupform, isValid)) {

      if (this.gContactId == '' || this.gContactId == undefined) {
        this._commonService.showWarningMessage('Please Select Member');
        return;
      }

      // let abc = this.CreateGroupform.value.pListGroupDetails.filter(
      //   m => m.pTypeofOperation == '' || m.pTypeofOperation != 'Delete'
      // );
      //  let abc = this.ListGroupDetails.filter(
      //   m => m.pTypeofOperation == '' || m.pTypeofOperation != 'Delete'
      // );
      if (this.CreateGroupform.controls.pMembersCount.value <= this.ListGroupDetails.length) {
        this._commonService.showWarningMessage('Enter below of Member Count ...!');
        return;
      }

      // if (this.CreateGroupform.value.pListGroupDetails != '') {
      //   if (abc.find(ob => ob['pContactRefId'] === this.gContactreferenceid)) {
      //     this._commonService.showWarningMessage('Contact name alraedy exists...!');
      //     return;
      //   }
      // }
      let pGrouproleIDs = this.CreateGroupform.controls.pGrouproleID.value;
      let role = this.roleInTheGroupData.find(function (element) {
        return element['pGroupRoleId'] == pGrouproleIDs;
      });
      this.rolename = role['pGroupRoleName'];

       if (this.ListGroupDetails != '') {
        if (this.ListGroupDetails.find(ob => ob['pContactRefId'] === this.gContactreferenceid)) {
          this._commonService.showWarningMessage('Member Name already Exists.');
          return;
        }     
      if (this.CreateGroupform.controls.pGrouproleID.value == 2) {
        this.checkvalue = true;
        if (this.ListGroupDetails.find(ob => ob['pRoleInGroup'] === 'Group Head / Lead')) {
          this.toaster.info('Group Head / Lead alredy selected...!');
          return;
        }
      }
      }
      this.CreateGroupform.controls['pListGroupDetails']["controls"]["pContactID"].setValue(this.gContactId);
       this.CreateGroupform.controls['pListGroupDetails']["controls"] ["pMemberId"].setValue(this.memberId);
      this.CreateGroupform.controls['pListGroupDetails']["controls"] ["pContactName"].setValue(this.gApplicantname);
     this.CreateGroupform.controls['pListGroupDetails']["controls"] ["pContactRefId"].setValue(this.gContactreferenceid);
       this.CreateGroupform.controls['pListGroupDetails']["controls"] ["pContactNo"].setValue(this.gBusinessEntitycontactNo);     
       this.CreateGroupform.controls['pListGroupDetails']["controls"] ["pGrouproleID"].setValue(pGrouproleIDs);
       this.CreateGroupform.controls['pListGroupDetails']["controls"] ["pRoleInGroup"].setValue(this.rolename);
      if(this.CreateGroupform.controls.ptypeofoperation.value == 'update'){
         this.CreateGroupform.controls['pListGroupDetails']["controls"] ["pTypeofOperation"].setValue('create');
      }

      if(this.CreateGroupform.controls.ptypeofoperation.value == ''){
        this.CreateGroupform.controls['pListGroupDetails']["controls"] ["pTypeofOperation"].setValue('');
      }

       this.CreateGroupform.controls['pListGroupDetails']["controls"] ["pRecordId"].setValue(0);
      this.ListGroupDetails=[...this.ListGroupDetails,...this.CreateGroupform.value.pListGroupDetails];
      this.CreateGroupformArrayview = this.ListGroupDetails;
      this.ngAfterViewInit();
      this.submitted = false;
      this.gContactId ='';
      this.memberId='';
      this.control='';
      this.gApplicantname = '';
      this.gContactreferenceid ='';
      this.gBusinessEntitycontactNo = '';
      this.gApplicantConfigStatus = '';
      this.CreateGroupform.controls.pGrouproleID.setValue("");
      this.GroupcreationValidationErrors={};
      this.CreateGroupform.value.pListGroupDetails='';
    }
  }
  public saveGroupArray() {
    debugger;
    if(this.ListGroupDetails.length<=0){
      this._commonService.showWarningMessage('Add Members to the Grid');
      return;
    }
      this.checkvalue = false;
       this.checkvalue=this.ListGroupDetails.filter(function(row){
       if(row.pGrouproleID==2){
         return true;
         }
       })
    if (this.checkvalue == false) {
      this._commonService.showWarningMessage('Please select Group Head / Lead...!');
      return;
    }
    let abc = this.ListGroupDetails.filter(
      m => m.pTypeofOperation == '' || m.pTypeofOperation != 'Delete'
    );
    let pMembersCount = this.CreateGroupform.controls.pMembersCount.value;
    let pListGroupDetails = abc.length;
    if (pMembersCount != pListGroupDetails) {
      this._commonService.showWarningMessage('Group Member details should be equal to Member Count ');
      return;
    }
    this.ListGroupDetails.filter(row=>row.pGrouproleID=parseInt(row.pGrouproleID));
    this.CreateGroupform.value.pListGroupDetails=this.ListGroupDetails;
    if (this.CreateGroupform.controls.ptypeofoperation.value == 'update') {
      this.savebutton='Processing';
      this.disablesavebutton=true;
      let savedata = JSON.stringify(this.CreateGroupform.value);
      this._GroupService.updateDeleteGroupConfig(savedata).subscribe(json => {
        if (json == true) {
          this.Clear();
            this.savebutton='Save';
            this.disablesavebutton=false;
            this.CreateGroupformArrayview = [];
            this.checkvalue == false;
            this._commonService.showInfoMessage('Updated Successfully')
            let url = "/GroupView"
            this.router.navigate([url]);
        }
      },
            (error) => {
              this.showErrorMessage(error);
               this.savebutton='Save';
            this.disablesavebutton=false;
            });
    }
    debugger;
    if (this.CreateGroupform.controls.ptypeofoperation.value == '') {
      this.savebutton='Processing';
      this.disablesavebutton=true;
      let saveGroupJsonData = JSON.stringify(this.CreateGroupform.value);
      this._GroupService.saveGroupConfig(saveGroupJsonData).subscribe(json => {
        if (json == true) {
          this._GroupService.GetallGroupDetails().subscribe(res => {
            this.groupDetails = res;
            this.Clear();
            this.savebutton='Save';
            this.disablesavebutton=false;
            this._commonService.showInfoMessage('Saved Successfully')
            this.CreateGroupformArrayview = [];
            this.checkvalue == false
            let url = "/GroupView"
            this.router.navigate([url]);
          },
            (error) => {
              this.showErrorMessage(error);
               this.savebutton='Save';
            this.disablesavebutton=false;
            });
        }
      });
    }

  }
  CreateFormControls(){
    debugger;
    this.CreateGroupform = this.fb.group({
      createdby: [0],
      modifiedby: [0],
      pGroupID: [0],
      pTransdate:this.today,
      pGroupType: ['Individual Liability'],
      pGroupName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      pGroupCode: [''],
      pMembersCount: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(2)]],
      pGroupSeries: [0],
      pGroupNo: [''],
      pGroupMembersRole: [''],
      pContactNo: [''],
      pTransactionType: [''],
      pCreatedby: [this._commonService.pCreatedby],
      pModifiedby: [0],
      pCreateddate: [''],
      pModifieddate: [''],
      pStatusid: [''],
      pStatusname: [''],
      pEffectfromdate: [''],
      pEffecttodate: [''],
      ptypeofoperation: [''],
      pGrouproleID: ['', Validators.required],
      pListGroupDetails: this.getUnit(),
    });
  }

  Clear(){
    debugger;
   this.CreateFormControls();
    //  const arr = <FormArray>this.CreateGroupform.controls.pListGroupDetails;
    // arr.controls = [];
    // this.CreateGroupform.value.pListGroupDetails=this.fb.array([]);  
    
   // this.CreateGroupform.value.pListGroupDetails= this.getUnit();
    this.ListGroupDetails=[];
    this.savebutton='Save';
    this.disablesavebutton=false;
    this.checkvalue = false;
    this.getGroupService();
    this.ngAfterViewInit();
    this.disableRoleintheGroup = false;
    this.ApplicantData = {};
    this.CreateGroupformArrayview=[];
    this.ShowContactBusiness = false;
    this.GroupcreationValidationErrors = {};
    this.BlurEventAllControll(this.CreateGroupform);

  }
  public removeHandler({ dataItem }) {
    debugger;
    let pGroupID = this.CreateGroupform.controls.pGroupID.value;
    let pRecordId = dataItem.pRecordId;
    let pMemberId = dataItem.pMemberId;
    let pGroupName =  this.CreateGroupform.controls.pGroupName.value;
    let pTypeofOperation = dataItem.pTypeofOperation;
    //  const indexs = this.CreateGroupform.value.pListGroupDetails.indexOf(dataItem, 0);
    //  if (indexs > -1) {
    //    this.CreateGroupform.value.pListGroupDetails.splice(indexs, 1);
    // }
       const index = this.ListGroupDetails.indexOf(dataItem, 0);
      if (index > -1) {
        this.ListGroupDetails.splice(index, 1);
      }
    if (pTypeofOperation == 'UPDATE') {
      let deleteData = {
      "pGroupID": pGroupID,
      "pMemberId":pMemberId ,
      "pTransactionType": "DELETE",
      "pGroupName": pGroupName,
      "pCreatedby": this._commonService.pCreatedby,
      "pTypeofoperation": "EDIT"
    };
    let deleteDatas = JSON.stringify(deleteData);
    this._GroupService.DeleteGroupDetails(deleteDatas).subscribe(json => {
      debugger;
      if (json == true) {
        this.MemberSelectComponentData.GetGroupCreationMembers();
      } 
    });
      // dataItem.pTypeofOperation = 'Delete';
      // this.CreateGroupform.value.pListGroupDetails = this.CreateGroupform.value.pListGroupDetails.filter(
      //   m => m.pTypeofOperation == '' || m.pTypeofOperation != 'Delete'
      // );
    }
    // const i = this.CreateGroupformArrayview.indexOf(dataItem, 0);
    // if (i > -1) {
    //   this.CreateGroupformArrayview.splice(i, 1);
    // }

    //  const index = this.CreateGroupform.value.pListGroupDetails.indexOf(dataItem, 0);
    // if (index > -1) {
    //    this.CreateGroupform.value.pListGroupDetails.splice(index, 1);
    //  }
    //   const index = this.ListGroupDetails.indexOf(dataItem, 0);
    // if (index > -1) {
    //    this.ListGroupDetails.splice(index, 1);
    //  }
     this.ListGroupDetails=[...this.ListGroupDetails];
  }
}