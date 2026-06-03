import { Directive,Renderer2, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumbersonly]'
})
export class NumbersonlyDirective {

  constructor(private render: Renderer2, private elRef: ElementRef) { }

  @HostListener('keypress', ['$event']) keyEvent(event) {
 
   
    // console.log(event)
    // const initalValue = this.elRef.nativeElement.value;

    // this.elRef.nativeElement.value = initalValue.replace(/[^0-9]*/g, '');
   
    // if ( initalValue !== this.elRef.nativeElement.value) {
    //   event.stopPropagation();
    // }
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

}
