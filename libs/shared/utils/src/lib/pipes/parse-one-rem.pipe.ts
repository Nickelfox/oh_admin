import { Pipe, PipeTransform } from '@angular/core';
import { TestInputTypeEnum } from '@hidden-innovation/shared/models';

@Pipe({
  name: 'parseOneRem'
})
export class ParseOneRemPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) {
      return value;
    }
    return value === TestInputTypeEnum.ONE_RM ? '1RM' : value;
  }
}
