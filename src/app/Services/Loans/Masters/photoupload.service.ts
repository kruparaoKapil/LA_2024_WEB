import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpParams } from "@angular/common/http"
import { environment } from '../../../../environments/environment';
import { CommonService } from '../../common.service';

@Injectable({
  providedIn: 'root'
})
export class PhotouploadService {



  constructor(private http: HttpClient, private _CommonService: CommonService) { }

  ProfileImageUpload(image) {

    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    });
    sessionStorage.getItem('Employeename');
    let _Details = image
    //console.log("imagepath", _Details)
    let options = {
      headers: httpHeaders,
    };

    //return this.http.post(environment.apiURL + '/ProfileImageSave', _Details, options)
    return this._CommonService.callPostAPI('/ProfileImageSave', _Details)
  }


  GetProfileImage() {
    // let httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'Cache-Control': 'no-cache'
    // });
    // let HttpParams = { 'Email': sessionStorage.getItem('email') }
    // let options = {
    //   headers: httpHeaders,
    //   params: HttpParams
    // };

   // return this.http.get(environment.apiURL + '/GetProfileImage', options)
   const params=new HttpParams().set('Email', sessionStorage.getItem('email'))
    return this._CommonService.callGetAPI('/GetProfileImage', params,'YES')
  }


}
