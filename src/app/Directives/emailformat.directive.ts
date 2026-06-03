import { Directive, Renderer2, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appEmailFormat]'
})
export class EmailFormatDirective {


  private regex: RegExp = new RegExp("^[a-zA-Z ]+$");
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home'];

  private charCode: number

  constructor(private render: Renderer2, private elRef: ElementRef) { }


  @HostListener('input', ['$event']) Input(event) {

    let e = event
    let str = this.elRef.nativeElement.value;

    var i = event.currentTarget.value.length - 1;
    var lastchar = event.currentTarget.value.substr(-1);
    this.charCode = lastchar.charCodeAt(0)

    var a = String.fromCharCode(this.charCode);
    if (this.regex.test(a)) {

      let data = str.replace(/\w\S*/g, function (txt) {
        return  txt.toLowerCase();
      });
      this.render.setProperty(this.elRef.nativeElement, 'value', data);

    } else {
      event.stopPropagation();
      event.preventDefault();
      // return false
    }

  }
}
