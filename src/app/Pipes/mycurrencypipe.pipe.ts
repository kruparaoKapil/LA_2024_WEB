import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mycurrencypipe'
})
export class MycurrencypipePipe implements PipeTransform {

  data: any
  symbol: any;
  returnvalue: any

  transform(value: any, args?: any): any {
    
    if (value == 0) {
      value = "0"
    }

    // this.data = this.cookieservice.get("savedformat")
    this.data = "India"
    if (this.data == "India") {
      // this.symbol = this.cookieservice.get("symbolofcurrency")
      // console.log("value : ",value);

      if (value != "" && value != undefined) {
        var result = value.toString().split('.');


        var lastThree = result[0].substring(result[0].length - 3);
        var otherNumbers = result[0].substring(0, result[0].length - 3);
        if (otherNumbers != '' && otherNumbers != "-"  && otherNumbers != "(")
          lastThree = ',' + lastThree;
      
          var output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
        if (result.length > 1) {
          output += "." + result[1];
        }
        // this.returnvalue = this.symbol + ' ' + output
        this.returnvalue = output;
        // this.soldform.controls.dealvalue.setValue(output); 
      }
    }
    else {
      // this.symbol = this.cookieservice.get("symbolofcurrency")
      if (value != "" && value != undefined) {
        var result = value.toString().split('.');
        var lastThree = result[0].substring(result[0].length - 3);
        var otherNumbers = result[0].substring(0, result[0].length - 3);
        if (otherNumbers != '')
          lastThree = ',' + lastThree;
        var output = otherNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + lastThree;
        if (result.length > 1) {
          output += "." + result[1];
        }
        // this.returnvalue = this.symbol + ' ' + output
        this.returnvalue = output;
        // this.soldform.controls.dealvalue.setValue(output);
      }
    }


    return this.returnvalue;

  }

}
