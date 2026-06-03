import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[ThreeDigitDecimalNumber]'
})
export class ThreeDigitDecimaNumberDirective {
  // Allow decimal numbers and negative values
  private regex: RegExp = new RegExp(/^\d*\.?\d{0,3}$/g);
  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home
  private specialKeys: Array<string> = ['Backspace','Tab', 'End', 'Home', '-', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];

  constructor(private el: ElementRef) {
  }
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    
    //console.log(this.el.nativeElement.value);
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      if (event.key != "Backspace") {
        event.preventDefault();
      }
      return;
    }
    let current: string = this.el.nativeElement.value;
    const position = this.el.nativeElement.selectionStart;
    const next: string = [current.slice(0, position), event.key == 'Decimal' ? '.' : event.key, current.slice(position)].join('');
    if (next != ".") {
      if (next && !String(next).match(this.regex)) {
        event.preventDefault();
      }
    }
    else {
      event.preventDefault();
    }
    if (next != "00") {
      if (next && !String(next).match(this.regex)) {
        event.preventDefault();
      }
    }
    else {
      event.preventDefault();
    }
    let dotExist = next.includes(".");
    if (next.length == 3 && dotExist != true) {

      if (next.length == 3 && event.key != ".") {
        event.preventDefault();
      }
    }


  }
}
