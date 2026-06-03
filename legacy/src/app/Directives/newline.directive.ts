import { Directive, Renderer2, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNewline]'
})
export class NewlineDirective {

  constructor(private render: Renderer2, private elRef: ElementRef) { }

  @HostListener('keypress', ['$event']) keyEvent(event) {
    
   // var i = event.currentTarget.value.length;
   // var lastchar = event.currentTarget.value.substr(-1);

    if (event.keyCode == 13) {
      event.preventDefault();
      event.stopImmediatePropagation();
      var _val = event.target.value;
      event.target.value = _val + '\n';
    }

   // event.preventDefault();
   // return false;
  }

}
