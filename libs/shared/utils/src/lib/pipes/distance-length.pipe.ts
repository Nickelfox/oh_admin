import { Pipe, PipeTransform } from '@angular/core';
import { ProfileInputTypeEnum } from '@hidden-innovation/shared/models';

@Pipe({
  name: 'distanceLength'
})
export class DistanceLengthPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) {
      return value;
    }
    return value === ProfileInputTypeEnum.LENGTH ? 'DISTANCE/LENGTH' : value;
  }

}
