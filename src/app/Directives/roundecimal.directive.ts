import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[appRoundecimal]'
})
export class RoundecimalDirective {

    @Input('appRoundecimal') amountInfo: any;
    // Allow decimal numbers and negative values
    private regex: RegExp = new RegExp("^[0-9.]+$");
    // Allow key codes for special events. Reflect :
    // Backspace, tab, end, home
    private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];
    //private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];

    constructor(private el: ElementRef) {
    }
    @HostListener('keypress', ['$event'])
    onKeyDown(event: KeyboardEvent) {


        let info = this.amountInfo.split('@');
        let roundLength = info[0];
        let decimallength = info[1];

        let newroundvalue = '0';
        //console.log(this.el.nativeElement.value);
        // Allow Backspace, tab, end, and home keys
        if (this.specialKeys.indexOf(event.key) !== -1) {
            return;
        }


        let controlValue: string = this.el.nativeElement.value.toString().replace(/,/g, "");

        const position = this.el.nativeElement.selectionStart;
        let newcontrolValue = [controlValue.slice(0, position), event.key == 'Decimal' ? '.' : event.key, controlValue.slice(position)].join('');


        if (!(controlValue.indexOf('.') > -1)) {
            if (controlValue.length > roundLength) {
                event.preventDefault();
            }
            else if (controlValue.length == roundLength) {
                if (event.key != '.')
                    event.preventDefault();
            }
        }
        else {

            let decimaIinfo = controlValue.split('.')[1];
            let roundIinfo = controlValue.split('.')[0];
            //if (newcontrolValue.indexOf('.') > -1) {
            newroundvalue = newcontrolValue.split('.')[0];
            //}
            if (parseFloat(roundIinfo) != parseFloat(newroundvalue)) {

                if (newroundvalue.length > roundLength) {
                    event.preventDefault();
                }
                else if (newroundvalue.length == roundLength) {
                    if (event.key == '.')
                        event.preventDefault();
                }

            }
            else {
                if (decimaIinfo.length >= decimallength) {
                    event.preventDefault();
                }
            }
        }

        //const position = this.el.nativeElement.selectionStart;
        //controlValue = [controlValue.slice(0, position), event.key == 'Decimal' ? '.' : event.key, controlValue.slice(position)].join('');
        if (newcontrolValue != "." && newcontrolValue != "00" && !(newcontrolValue.indexOf('..') > -1)) {
            if (newcontrolValue && !String(newcontrolValue).match(this.regex)) {
                event.preventDefault();
            }
        }
        else {
            event.preventDefault();
        }

        if (event.key == '.' && decimallength == 0)
            event.preventDefault();

    }

}
