import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appNumberRange]'
})
export class NumberRangeDirective {

  constructor() { }

  @Input() inputRefObject: {inputRef: any, minValue: number, maxValue: number};

  @HostListener('keyup', ['$event'])
  restrictNumberRange() {

    const {inputRef, minValue, maxValue} = this.inputRefObject;

    if(inputRef.value > maxValue) {
      inputRef.value = maxValue;
    } else if(inputRef.value < minValue) {
      inputRef.value = minValue
    } else {
      // Do nothing, or perhaps do something else...
      return;
    }
  }
}