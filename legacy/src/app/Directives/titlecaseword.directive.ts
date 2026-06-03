import { Directive, Renderer2, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appTitlecaseword]'
})
export class TitlecasewordDirective {


  private regex: RegExp = new RegExp("^[a-zA-Z ]+$");
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home'];

  private charCode: number

  constructor(private render: Renderer2, private elRef: ElementRef,private control: NgControl) { }


   @HostListener('input', ['$event']) Input(event){    
     let e = event
     let str = this.elRef.nativeElement.value;
     var i = event.currentTarget.value.length - 1;
     var lastchar = event.currentTarget.value.substr(-1);
     this.charCode = lastchar.charCodeAt(0)
     var a = String.fromCharCode(this.charCode);
     if (this.regex.test(a)) {
       let data = str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });  
       this.render.setProperty(this.elRef.nativeElement, 'value', data);
     }
  
   }


  @HostListener('input', ['$event']) onEvent($event) {
    
    let str: string = this.control.value;
    let data = str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });  
    
    this.control.control.setValue(data);
  }
 


}
