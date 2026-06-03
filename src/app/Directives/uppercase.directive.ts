import { Directive, Renderer2, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appUppercase]'
})
export class UppercaseDirective {

  constructor(private render: Renderer2, private elRef: ElementRef, private control: NgControl) { }


  @HostListener('input', ['$event']) onEvent($event) {
    
    let str: string = this.control.value;
    this.control.control.setValue(str.toUpperCase());
  }
  // @HostListener('input') Input() {
  //   
  //   let d = this.elRef.nativeElement.value.toUpperCase();
  //   this.render.setProperty(this.elRef.nativeElement, 'value', d);
  // }

}
