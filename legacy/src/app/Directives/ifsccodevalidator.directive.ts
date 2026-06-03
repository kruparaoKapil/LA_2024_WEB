import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[appIfsccodevalidator]'
})
export class IfsccodevalidatorDirective {

  constructor(private render: Renderer2, private elRef: ElementRef) { }

  @HostListener('input') Input() {
    
    var name = this.elRef.nativeElement.value;
    const regex = new RegExp('^[A-Za-z]{4}[0]{1}[0-9]{6}$');
    if (!regex.test(name)) {     
      let d = this.elRef.nativeElement.value.toUpperCase();
      this.render.setProperty(this.elRef.nativeElement, 'value', d);
    }

  }

}
