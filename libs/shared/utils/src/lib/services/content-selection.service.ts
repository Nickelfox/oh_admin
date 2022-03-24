import { Injectable } from '@angular/core';
import { isEqual, sortBy } from 'lodash-es';

@Injectable()
export class ContentSelectionService {

  isContentEqual(listIds: number[], selectedNums: number[]): boolean {
    try {
      const numRows: number[] = listIds ?? [];
      const commonIds = numRows.filter(i1 => selectedNums.includes(i1));
      const sortedRows = sortBy(numRows);
      const sortedSelection = sortBy(commonIds);
      return isEqual(sortedSelection, sortedRows);
    } catch {
      return false;
    }
  }

}
