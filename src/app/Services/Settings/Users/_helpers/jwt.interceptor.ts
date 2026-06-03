import { Injectable, forwardRef, Inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import appsettings from 'src/assets/appsettings.json';
import { UsersService } from 'src/app/Services/Settings/Users/Users.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(@Inject(forwardRef(() => UsersService)) private authenticationService: UsersService) { }
 
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add auth header with jwt if user is logged in and request is to api url
  
    
    const currentUser = this.authenticationService._getUser();
    const isLoggedIn = currentUser && currentUser.pToken;
    const isApiUrl = request.url.startsWith(appsettings[0].ApiHostUrl);
    if (isLoggedIn) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.pToken}`
        }
      });
    }

    return next.handle(request);
  }
}
