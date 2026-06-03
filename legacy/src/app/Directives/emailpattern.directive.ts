import { Directive,Renderer2, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appEmailpattern]'
})
export class EmailpatternDirective {

  constructor(private render: Renderer2, private elRef: ElementRef) { }

  @HostListener('keypress', ['$event']) keyEvent(event) {
    
    var i = event.currentTarget.value.length;
    var lastchar = event.currentTarget.value.substr(-1);
    if (event.code == 'Space' && lastchar == " ") {
      event.preventDefault();
      return false;
    }
    else {
      const charCode = (event.which) ? event.which : event.keyCode;
      if (i == 0) {
        var regex = new RegExp("^[a-zA-Z0-90-9._%+-@]+$");
        var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (regex.test(str)) {
          return true;
        }
      }
      if (i != 0) {
        if (lastchar == " ") {
          var regex = new RegExp("^[a-zA-Z0-9._%+-@]+$");
          var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
          str = str.toUpperCase();
          if (regex.test(str)) {
            return true;
          }
        }
        else {
          var regex = new RegExp("^[a-zA-Z0-9._%+-@]+$");
          var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
          if (regex.test(str)) {
            return true;
          }
        }
      }
    }
    event.preventDefault();
    return false;
  }

}
