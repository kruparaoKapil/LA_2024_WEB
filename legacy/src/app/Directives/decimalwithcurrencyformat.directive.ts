import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';
import { CommonService } from '../Services/common.service';
import { CookieService } from 'ngx-cookie-service';

@Directive({
  selector: '[appDecimalwithcurrencyformat]'
})
export class DecimalwithcurrencyformatDirective {

  data: any;
  constructor(private _el: ElementRef,private commonService : CommonService,
    private cookieservice:CookieService,private render: Renderer2, private elRef: ElementRef) { }

  @HostListener('input') Input(){
   
    const initalValue = this._el.nativeElement.value;
    // this._el.nativeElement.value = initalValue.toString().replace(/,/g, "").replace(/^0+/, '');
    if ( initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }

    let d = this.elRef.nativeElement.value;

    let s = d.split(',');
    let n = s.join('')
    d = n;
    if(d==0){
      d=""
    }
    if (d != '') {  

    //  this.data = this.cookieservice.get("savedformat")
      this.data="India"
      if (this.data == "India") {       
        var result = d.toString().split('.');
        var lastThree = result[0].substring(result[0].length - 3);
        var otherNumbers = result[0].substring(0, result[0].length - 3);
        if (otherNumbers != '')
          lastThree = ',' + lastThree;
        var output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
        if (result.length > 1) {
          output += "." + result[1];
        }      
        d = output;
        this.render.setProperty(this.elRef.nativeElement, 'value', d);
      }
      else {      
        var result = d.toString().split('.');
        var lastThree = result[0].substring(result[0].length - 3);
        var otherNumbers = result[0].substring(0, result[0].length - 3);
        if (otherNumbers != '')
          lastThree = ',' + lastThree;
        var output = otherNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + lastThree;
        if (result.length > 1) {
          output += "." + result[1];
        }      
        d = output;
        this.render.setProperty(this.elRef.nativeElement, 'value', d);
      }

    }

  }

}
