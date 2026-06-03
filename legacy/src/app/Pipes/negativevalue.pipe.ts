import { Pipe, PipeTransform } from '@angular/core';
import { CommonService } from '../Services/common.service';

@Pipe({
  name: 'negativevalue'
})
export class NegativevaluePipe implements PipeTransform {
  constructor(private _CommonService: CommonService) {

  }
  returnvalue: any
  transform(value: any, args?: any): any {
    if(isNaN(value)){
     return;
     }else{
      let ngvalue = value <= 0 ? '(' + this._CommonService.currencyformat(Math.abs(value)) + ')' : this._CommonService.currencyformat(value);
      this.returnvalue = ngvalue;
      return this.returnvalue;
     }

    } 

}
