import { Pipe, PipeTransform } from '@angular/core';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';

@Pipe({
  name: 'maxStringLimit'
})
export class MaxStringLimitPipe implements PipeTransform {

  numberLimit = 0;

  constructor(private constantDataService: ConstantDataService) {
    this.numberLimit = this.constantDataService.CONST_NUMS.TABLE_TEXT_LIMIT;
  }

  transform(value: string, limit?: number): unknown {
    if (limit) {
      this.numberLimit = limit;
    }
    let rtrnStrng = '';
    rtrnStrng = value ?? '--';
    if (rtrnStrng.length > this.numberLimit) {
      const temp = rtrnStrng;
      rtrnStrng = temp.slice(0, this.numberLimit).concat('...');
    }
    return rtrnStrng;
  }

}
