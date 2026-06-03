import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContacmasterService } from 'src/app/Services/Loans/Masters/contacmaster.service';
import { DefaultProfileImageService } from 'src/app/Services/Loans/Masters/default-profile-image.service';

@Component({
  selector: 'app-contact-new-detailed-new',
  templateUrl: './contact-new-detailed-new.component.html',
  styles: []
})
export class ContactNewDetailedNewComponent implements OnInit {
  ID: string;
  DisplayCardData: any
    pContactType:any;
  contactSubscriberData: any = [];
  showcontactsubscriber = false;
  constructor(private dataRoute: ActivatedRoute, private _contacmasterservice: ContacmasterService, private _defaultimage: DefaultProfileImageService, private _routes: Router) { }

  ngOnInit()
   {
    debugger;
      this.pContactType='';
    this.dataRoute
      .queryParams
      .subscribe(params => {
        this.ID = params['ID'];

      });

    this._contacmasterservice.getContactDetailsrefid(this.ID).subscribe(json => {
      debugger;
      this.DisplayCardData = json;
        this.pContactType=json.pContactType;
      debugger
      if( this.DisplayCardData.pGender=="M")
      {
        this.DisplayCardData.pFatherName="S/o - "+  this.DisplayCardData.pFatherName
      }
      else if(this.DisplayCardData.pGender=="F")
      {
        this.DisplayCardData.pFatherName="D/o - "+  this.DisplayCardData.pFatherName
      }
      if (this.DisplayCardData.pImage != null) {
        this.DisplayCardData.pImage = "data:image/png;base64," + this.DisplayCardData.pImage;
      } else {
        this.DisplayCardData.pImage = this._defaultimage.GetdefaultImage()
      }

    });
  }
  NavigateReferral(RefId) {
    debugger;
    let name = "refferral";
       this._routes.navigate(['/ContactMoreNew'], { queryParams: { ID: RefId, name: name ,contacttype:this.pContactType} })
  }
  NavigateEmployee(RefId) {
    debugger;
    let name = "employee";

    this._routes.navigate(['/ContactMoreNew'], { queryParams: { ID: RefId, name: name ,contacttype:this.pContactType } })
  }
  NavigateSupplier(RefId) {
    let name = "supplier";

    this._routes.navigate(['/ContactMoreNew'], { queryParams: { ID: RefId, name: name  ,contacttype:this.pContactType} })
  }
  NavigateAdovate(RefId) {
    let name = "advocate";

    this._routes.navigate(['configuration/ContactMore'], { queryParams: { ID: RefId, name: name  ,contacttype:this.pContactType} })
  }

}
