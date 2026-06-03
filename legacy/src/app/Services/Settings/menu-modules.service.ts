import { Injectable } from '@angular/core';
import { CommonService } from '../../Services/common.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class MenuModulesService {

  constructor(private commonService: CommonService) { }
  GetModules(){
    try {
      return this.commonService.callGetAPI('/Settings/Users/RolesCreation/GetallRolesModules', '', 'NO');
    }
    catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }
  GetNavigation(){
    try {
      return this.commonService.callGetAPI('/Settings/Users/RolesCreation/GetMenuandSubmenuDetails', '', 'NO');
    }
    catch (e) {
      this.commonService.showErrorMessage(e);
    }
  }
  saveModuleTitle(data){
    
    try {
      return this.commonService.callPostAPI('/Settings/Users/RolesCreation/SaveRoleModule', data);
      }
     catch (e){
      this.commonService.showErrorMessage(e);
       }
  
    }
    CheckDuplicatesModule(Modulename){
    const params = new HttpParams().set('Modulename', Modulename);
    return this.commonService.callGetAPI('/Settings/Users/RolesCreation/GetModulecount', params, 'YES');
    
  }  
  SubModuleTitle(data){
    try {
      const params = new HttpParams().set('Moduleid', data);
      return this.commonService.callGetAPI('/Settings/Users/RolesCreation/GetRolesSubModulesbyModule',params, 'YES');
      }
     catch (e){
      this.commonService.showErrorMessage(e);
       }
  }
  saveSubModuleTitle(data){
    
    try {
      return this.commonService.callPostAPI('/Settings/Users/RolesCreation/SaveRoleSubModule', data);
      }
     catch (e){
      this.commonService.showErrorMessage(e);
       }
  
    }
    CheckDuplicatesSubModule(Modulename,Submodulename){
    try {
      const params = new HttpParams().set('Modulename', Modulename).set('Submodulename',Submodulename);
      return this.commonService.callGetAPI('/Settings/Users/RolesCreation/GetSubmenucountbyMenu',params, 'YES');
      }
     catch (e){
      this.commonService.showErrorMessage(e);
       }

    }
    saveMenu(data){
      try {
        return this.commonService.callPostAPI('/Settings/Users/RolesCreation/SaveRoleFunction', data);
        }
       catch (e){
        this.commonService.showErrorMessage(e);
         }
    }
    DeleteMenu(data){
      try {
        return this.commonService.callPostAPI('/Settings/Users/RolesCreation/SaveRoleFunction', data);
        }
       catch (e){
        this.commonService.showErrorMessage(e);
         }
    }

    GetNavigation1(Type, UserOrDesignation) {
      try {
        const params = new HttpParams().set('Type', Type).set('UserOrDesignation', UserOrDesignation);
        return this.commonService.callGetAPI('/Settings/Users/UserRights/GetUserRights', params, 'YES');
      }
      catch (e) {
        this.commonService.showErrorMessage(e);
      }
    }

    UpdateFunctionSortOrder(data) {
      try {
        let Url = '/Settings/Users/UserRights/UpdateFunctionSortOrder';
        return this.commonService.callPostAPI(Url, data);
      }
      catch (e) {
        this.commonService.showErrorMessage(e);
      }
    }
}
