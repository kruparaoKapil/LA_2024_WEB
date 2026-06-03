import { Injectable, Inject, forwardRef } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { UsersService } from 'src/app/Services/Settings/Users/Users.service';
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(@Inject(forwardRef(() => UsersService)) private authenticationService: UsersService, private toastr: ToastrService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401) {
        
        // auto logout if 401 response returned from api
        this.toastr.error("Invalid Credentials", "Error")
        this.authenticationService._logout();
      
      }

      const error = err.error.message || err.statusText;
      return throwError(error);
    }))
  }
}
