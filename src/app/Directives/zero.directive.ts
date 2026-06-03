import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appZero]'
})
export class ZeroDirective {

  constructor(private _el: ElementRef) { }
  @HostListener('input') Input(){
   
    const initalValue = this._el.nativeElement.value;
    this._el.nativeElement.value = initalValue.toString().replace(/,/g, "").replace(/^0+/, '');
    if ( initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
}
}