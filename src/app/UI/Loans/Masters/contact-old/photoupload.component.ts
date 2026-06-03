import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { PhotouploadService } from '../../../../Services/Loans/Masters/photoupload.service';
import { debug } from 'util';

declare var $: any;
@Component({
  selector: 'app-photoupload',
  templateUrl: './photoupload.component.html',
  styles: []
})
export class PhotouploadComponent implements OnInit {

  @Output() uploadPhoto: EventEmitter<string> = new EventEmitter<string>();


  constructor(private http: HttpClient, private _profileuploadSer: PhotouploadService) { }
  imageChangedEvent: any = '';
  croppedImage: any = '';
  croppedImageImageurl: any;
  generatedImage: any;
  ProfileUploadSubscriber: any
  fileChangeEvent(event: any): void {

    
    this.imageChangedEvent = event;
  }
  imageCropped(image: string) {
    ;
    this.croppedImage = image["base64"];
    this.croppedImageImageurl = this.croppedImage.substr(this.croppedImage.indexOf(',') + 1)
  }

  imageLoaded() {
    // show cropper
    ;
  }
  loadImageFailed() {
    // show message
    ;
  }
  ngOnInit() {

    this.croppedImage = "";

  }
  saveImage() {
debugger
      
      if (this.croppedImageImageurl) {
          this.uploadPhoto.emit(this.croppedImageImageurl)

          let _Details = JSON.stringify({ ImageString: this.croppedImageImageurl, profileimagename: sessionStorage.getItem('Employeename'), EmailId: sessionStorage.getItem('email') })

          this._profileuploadSer.ProfileImageUpload(_Details).subscribe(json => {
           ;
           this.croppedImage = json;
           console.log(this.croppedImage)
          // this.UserService.notifImageupdate({ option: 'call_child', value: json });
         this.CloseUploadImageModel();
     

    });
  }

  }

  CloseUploadImageModel() {
   
    $('#photo').modal('hide');
  }


}
