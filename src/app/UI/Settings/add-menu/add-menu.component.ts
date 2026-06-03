import { Component, OnInit ,ViewChild} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, ControlContainer } from '@angular/forms';
import { CommonService } from '../../../Services/common.service';
import { MenuModulesService } from '../../../Services/Settings/menu-modules.service';
import { from } from 'rxjs';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';
import { Router, Route } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { Alert } from 'selenium-webdriver';
import { State, process } from '@progress/kendo-data-query';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { IfStmt } from '@angular/compiler';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';

declare let $: any
@Component({
  selector: 'app-add-menu',
  templateUrl: './add-menu.component.html',
  styles: []
})
export class AddMenuComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  constructor(private fb: FormBuilder, private _CommonService: CommonService, private _MenuModulesService: MenuModulesService, private router: Router, private toastr: ToastrService) {
    
    this.allData = this.allData.bind(this);
   }
  loading=false;
  AddModuleForm: FormGroup;
  ModuleForm: FormGroup;
  SubModuleForm: FormGroup;
  IsCapsWarning: Boolean;
  Modulesdata: any;
  Navigationdata:any;
  Navigationtempdata:any;
  SubModulesdata:any;
  routertep: any = [];
  allroters: any = [];
  modalid:any;
  modalname: any;
  submodalid:any;
  submodalname: any;
  submitted=false;
  issubmitted=false;
  public pageSize = 10;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10
  };
  public headerCells: any = {
    textAlign: 'center'
  };
  ngOnInit() {
    this.submitted=false;
    this.AddModuleForm = this.fb.group({
      pModulename: ['',Validators.required],
      pModuleId:[''],
      pSubmoduleId:[''],
      pSubmodulename:['',Validators.required],
      pFunctionname:['',Validators.required],
      pFunctionurl:[''],
      pIsfunctionshowinNavigation:[''],
      pIsFunctionshowinRoles:[''],
      ptypeofoperation:[''],
      pCreatedby: ['']
    });

    this.ModuleForm = this.fb.group({
      pModulename: ['', Validators.required],
      pCreatedby: ['']
    });

    this.SubModuleForm = this.fb.group({
      pCreatedby:[''],
      pSubmodulename:['',Validators.required],
      pModuleId:[''],
      pModulename: ['']
     
    });
    
    this.GetallModules();
    this.GetNavigation();
    this.routertep = this.router.config[2].children;
    var officersIds = [];
    this.routertep.forEach(function (officer) {
      officersIds.push({'path':officer.path,'componentName':officer.component.name});
    });
    $("#contactsaa").kendoMultiColumnComboBox({
      dataTextField: "path",
      dataValueField: "path",
      height: 400,
      columns: [
      
        { field: "path", title: "Path Name", width: 200 },
        { field: "componentName", title: "Component Name", width: 500 },

      ],
      footerTemplate: 'Total #: instance.dataSource.total() # items found',
      filter: "contains",
      filterFields: ["path"],
      dataSource:officersIds,
      select: this.SelectPath,
     // change: this.onChange,

    });

  }
  GetallModules() {
    
    this._MenuModulesService.GetModules().subscribe(data => {
      this.Modulesdata = data;
    });
  }
  GetNavigation(){
    this.loading=true;
   this._MenuModulesService.GetNavigation().subscribe(data => {
      this.Navigationdata = data;
      this.Navigationtempdata=this.Navigationdata;
      this.loading=false;
    });
  }

  OpenModel() {
    this.submitted=false;
    this.issubmitted = false;
    this.ModuleForm.reset();
    $('#add-detail').modal('show');
  }
  ModelSave() {
    this.issubmitted = true;
    if (this.ModuleForm.valid) {
    this.ModuleForm.controls.pCreatedby.setValue(this._CommonService.pCreatedby);
    var data = JSON.stringify(this.ModuleForm.value);
    let ModuleTitle = this.ModuleForm.value.pModulename;
    this._MenuModulesService.CheckDuplicatesModule(ModuleTitle).subscribe(count => {
      if (count) {
        this.toastr.info("Module name already exist", "Info");
        this.ModuleForm.reset();
     
      // $('#add-detail').modal('hide');
      // this.toastr.error("Module Name Already Exist", "Exist");
      }
      else{

    this._MenuModulesService.saveModuleTitle(data).subscribe(res => {
      this.GetallModules();
      this.toastr.success("Saved Successfully", "Success");
      $('#add-detail').modal('hide');
    });

      }
    
     });
    }
   

  }
  SelectModule(modaldata :any){
  this.modalid = modaldata.target.value;
  this.modalname= modaldata.target.options[modaldata.target.selectedIndex].text;
  this.loadSubModule(this.modalid);
  }

  OpenSubModel() {
    this.issubmitted = false;
    this.submitted=false;
    this.SubModuleForm.reset();
    if (this.modalname == '' || typeof this.modalname==='undefined') {
      this.toastr.info("Please select module name", "Info");
     
    }
    else {
    this.SubModuleForm.controls.pModuleId.setValue(this.modalid);
    this.SubModuleForm.controls.pModulename.setValue(this.modalname);
    this.SubModuleForm.controls.pCreatedby.setValue(this._CommonService.pCreatedby);
    $('#add-submodule').modal('show');
    }

  }
  loadSubModule(modalnameid){
   this._MenuModulesService.SubModuleTitle(modalnameid).subscribe(res => {
    this.SubModulesdata = res;
    });
  }
  SubModelSave(){
    debugger
    this.issubmitted = true;
    if (this.SubModuleForm.valid) {
    var data = JSON.stringify(this.SubModuleForm.value);
    let Modulename= this.SubModuleForm.value.pModulename;
    let Submodulename= this.SubModuleForm.value.pSubmodulename;
    this._MenuModulesService.CheckDuplicatesSubModule(Modulename,Submodulename).subscribe(count => {
      if (count) {
        this.toastr.info("Sub module name already exist", "Info");
       
        this.SubModuleForm.controls.pSubmodulename.reset();
       
      }
      else{

    this._MenuModulesService.saveSubModuleTitle(data).subscribe(res => {
    this.loadSubModule(this.modalid);
      this.toastr.success("Saved Successfully", "Success")
      $('#add-submodule').modal('hide');
    });
      }
    
     });
    
    }
  }

  SelectsubModule(submodaldata :any){
    this.submodalid = submodaldata.target.value;
    this.submodalname= submodaldata.target.options[submodaldata.target.selectedIndex].text;
   
    }
    selectedValue:any
    SelectPath(path){
      
      if(path.dataItem!=undefined){
        this.selectedValue=path.dataItem.path.toString();
        localStorage.setItem('Value',this.selectedValue);
      }
      else{
        localStorage.setItem('Value','');
      }
      
     }
    
  AddMenu(){
    debugger
    this.submitted = true;
    if (this.AddModuleForm.valid) {
      this.AddModuleForm.controls.pCreatedby.setValue(this._CommonService.pCreatedby);
      this.AddModuleForm.controls.pModuleId.setValue(this.modalid);
      this.AddModuleForm.controls.pModulename.setValue(this.modalname);
      this.AddModuleForm.controls.pSubmoduleId.setValue(this.submodalid);
      this.AddModuleForm.controls.pSubmodulename.setValue(this.submodalname);
      var pathname =localStorage.getItem('Value');
      if(pathname!=''){
        pathname='/'+pathname;
        this.AddModuleForm.controls.pFunctionurl.setValue(pathname);
        localStorage.setItem('Value','');
        let ShowinNavigation=this.AddModuleForm.value['pIsfunctionshowinNavigation'];
        if(ShowinNavigation==''){
          this.AddModuleForm.controls.pIsfunctionshowinNavigation.setValue(false);
        }
        let AllowRoles=this.AddModuleForm.value['pIsFunctionshowinRoles'];
        if(AllowRoles==''){
          this.AddModuleForm.controls.pIsFunctionshowinRoles.setValue(false);
        }
        this.AddModuleForm.controls.ptypeofoperation.setValue('create');
        var data = JSON.stringify(this.AddModuleForm.value);
        console.log('saveJSon',data);
        
        this._MenuModulesService.saveMenu(data).subscribe(res => {
          this.AddModuleForm.reset();
          this.submitted = false;
          this.toastr.success("Saved Successfully", "Success")
          this.GetNavigation();    
        });
      }
      else{
        this.toastr.info("Select Form Url", "Info");
      }

  }
  }

  NavigationDelete(dataItem){
    debugger;
  let createdby=this._CommonService.pCreatedby;
  let pFunctionId=dataItem.pFunctionId;
  let ptypeofoperation='delete';
  let data = JSON.stringify({ "pCreatedby":createdby,"pFunctionId": pFunctionId, "ptypeofoperation": ptypeofoperation});
  console.log('Delete',data);
  
  this._MenuModulesService.DeleteMenu(data).subscribe(res => {
    this.toastr.success("Tenant registration successfully", "Success");
    this.GetNavigation();    
  });
  }
  ClearAddMenu(){
    this.submitted=false;
    this.issubmitted = false;
    this.modalname ='';
    this.ModuleForm.reset();
    this.SubModuleForm.reset();
    this.AddModuleForm.reset();
  }
  ModuleTitle(event) {
    if (event.getModifierState("CapsLock")) {
      this.IsCapsWarning = true
    } else {
      this.IsCapsWarning = false
    }
  }


  get errorsModuleForm() { return this.ModuleForm.controls; }
  get errorsSubModuleForm() { return this.SubModuleForm.controls; }
  get errorsAddModuleForm() { return this.AddModuleForm.controls; }
  CloseModel() {
    this.ModuleForm.reset()
    this.SubModuleForm.reset();
    $('#add-detail').modal('hide');
    $('#add-submodule').modal('hide');
  }

  Clear() {
    this.submitted=false;
    this.issubmitted = false;
    this.ModuleForm.reset();
    this.SubModuleForm.reset();
  }
  onFilter(inputValue: string) {
    this.Navigationdata = process(this.Navigationtempdata, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'pModulename',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pSubmodulename',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'pFunctionname',
            operator: 'contains',
            value: inputValue
          }
        ],
      }
    }).data;
    this.dataBinding.skip = 0;
  }

  public allData(): ExcelExportData {
  
    const result: ExcelExportData = {
      data: process(this.Navigationdata, {  sort: [{ field: 'pVchapplicationid', dir: 'desc' }] }).data
    };

    return result;
  }
}
