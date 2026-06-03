import { Component, OnInit, Output, EventEmitter } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-contact-new-photoupload',
  templateUrl: './contact-new-photoupload.component.html',
  styles: []
})
export class ContactNewPhotouploadComponent implements OnInit {
  @Output() uploadPhoto: EventEmitter<string> = new EventEmitter<string>();
  constructor() { }
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
  ngOnInit()
   {
    this.croppedImage = "";
  }
  saveImage() {
    debugger;
          
          if (this.croppedImageImageurl) {
              this.uploadPhoto.emit(this.croppedImageImageurl)
    
              //let _Details = JSON.stringify({ ImageString: this.croppedImageImageurl, profileimagename: sessionStorage.getItem('Employeename'), EmailId: sessionStorage.getItem('email') })
    
              //this._profileuploadSer.ProfileImageUpload(_Details).subscribe(json => {
              //  ;
              //  this.croppedImage = json;
              //  console.log(this.croppedImage)
              //  this.UserService.notifImageupdate({ option: 'call_child', value: json });
              this.CloseUploadImageModel();
          }
    
        //});
    
    
      }
    
      CloseUploadImageModel() {
       
        $('#photo').modal('hide');
      }
    
}
