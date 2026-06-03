import { Directive, Renderer2, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appCharactersonly]'
})
export class CharactersonlyDirective {

  private charCode: number

  constructor(private render: Renderer2, private elRef: ElementRef) { }



  @HostListener('keypress', ['$event']) keyEvent(event) {
    

    var text = event.currentTarget.value.replace(/ +/g, ' ').trimStart()
    event.currentTarget.value = text

    var i = event.currentTarget.value.length;
    var lastchar = event.currentTarget.value.substr(-1);

    var startPos = this.elRef.nativeElement.selectionStart;
    var prePos = startPos - 1
    var nxtPos = startPos
    var data = this.elRef.nativeElement.value.substr(0)
    var prePosdata = data[prePos]
    var nxtPosdata = data[nxtPos]
    this.elRef.nativeElement.focus();

    if (event.code == 'Space' && prePosdata != " " && prePosdata != undefined && nxtPosdata != " " && nxtPosdata != undefined) {
      var regex = new RegExp("^[a-zA-Z ]+$");
      var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
      str = str.toUpperCase();
      if (regex.test(str)) {
        return true;
      }
    }

    if (event.code == 'Space' && lastchar == " ") {
      event.preventDefault();
      return false;
    }
    else {
      const charCode = (event.which) ? event.which : event.keyCode;
      if (i == 0) {
        var regex = new RegExp("^[a-zA-Z]+$");
        var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (regex.test(str)) {
          return true;
        }
      }
      if (i != 0) {
        if (lastchar == " ") {
          var regex = new RegExp("^[a-zA-Z ]+$");
          var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
          str = str.toUpperCase();
          if (regex.test(str)) {
            return true;
          }
        }
        else {
          var regex = new RegExp("^[a-zA-Z ]+$");
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
