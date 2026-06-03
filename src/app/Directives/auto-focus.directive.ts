import { AfterContentInit, Directive, ElementRef, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appAutoFocus]'
})
export class AutoFocusDirective  {

  // @Input() public appAutoFocus: boolean;

  //   public constructor(private el: ElementRef,private control: NgControl) {

  //   }

  //   public ngAfterContentInit() {

  //       setTimeout(() => {

  //           this.el.nativeElement.focus();

  //       }, 500);

  //   }
   @Input() public appAutoFocus: boolean;

  constructor(private element: ElementRef<HTMLInputElement>) {}

  ngAfterContentChecked(): void {
    this.element.nativeElement.focus();
  }

}
