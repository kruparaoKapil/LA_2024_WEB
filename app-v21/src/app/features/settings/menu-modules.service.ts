import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClient } from '../../core/api/api-client.service';

export interface MenuModule {
  pModuleID: number;
  pModulename: string;
  pSortOrder?: number;
  [key: string]: unknown;
}

export interface MenuItem {
  pFunctionID: number;
  pFunctionName: string;
  pFunctionUrl: string;
  pSubModuleID?: number;
  pModuleID?: number;
  pSortOrder?: number;
  [key: string]: unknown;
}

@Injectable({ providedIn: 'root' })
export class MenuModulesService {
  private readonly api = inject(ApiClient);

  getModules(): Observable<MenuModule[]> {
    return this.api.get<MenuModule[]>(
      '/Settings/Users/RolesCreation/GetallRolesModules',
    );
  }

  getNavigation(): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Settings/Users/RolesCreation/GetMenuandSubmenuDetails',
    );
  }

  saveModuleTitle(data: unknown): Observable<unknown> {
    return this.api.post('/Settings/Users/RolesCreation/SaveRoleModule', data);
  }

  checkDuplicateModule(moduleName: string): Observable<number> {
    return this.api.get<number>(
      '/Settings/Users/RolesCreation/GetModulecount',
      { Modulename: moduleName },
    );
  }

  getSubModules(moduleId: number): Observable<unknown[]> {
    return this.api.get<unknown[]>(
      '/Settings/Users/RolesCreation/GetRolesSubModulesbyModule',
      { Moduleid: moduleId },
    );
  }

  saveSubModule(data: unknown): Observable<unknown> {
    return this.api.post(
      '/Settings/Users/RolesCreation/SaveRoleSubModule',
      data,
    );
  }

  checkDuplicateSubModule(
    moduleName: string,
    subModuleName: string,
  ): Observable<number> {
    return this.api.get<number>(
      '/Settings/Users/RolesCreation/GetSubmenucountbyMenu',
      { Modulename: moduleName, Submodulename: subModuleName },
    );
  }

  saveMenuFunction(data: unknown): Observable<unknown> {
    return this.api.post(
      '/Settings/Users/RolesCreation/SaveRoleFunction',
      data,
    );
  }

  /** Legacy alias — same endpoint as `saveMenuFunction`. */
  deleteMenuFunction(data: unknown): Observable<unknown> {
    return this.api.post(
      '/Settings/Users/RolesCreation/SaveRoleFunction',
      data,
    );
  }

  updateFunctionSortOrder(data: unknown): Observable<unknown> {
    return this.api.post(
      '/Settings/Users/UserRights/UpdateFunctionSortOrder',
      data,
    );
  }
}
