import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { UsersService } from 'src/app/Services/Settings/Users/Users.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: UsersService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    
    let routeRequested = this.authenticationService._getRoles();
    routeRequested = JSON.parse(routeRequested);
    //console.log(routeRequested);
    const currentUser = this.authenticationService._getUser();

    if (currentUser !== undefined && currentUser != null) {
      if (routeRequested !== undefined && routeRequested != null) {
        let routeExist = routeRequested["functionsDTOList"].filter(function (key) {
          return key.pFunctionUrl === '/' + route.routeConfig.path && key.pIsviewpermission == true;
        });

        if (route.routeConfig.path != "Dashboard") {
          // check if route is restricted by role
          if (routeExist.length == 0) {
            // role not authorised so redirect to home page
            
            this.router.navigate(['/Dashboard']);
            return false;
          }
        }
      }

      // authorised so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
