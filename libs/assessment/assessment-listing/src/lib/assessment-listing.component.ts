import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';
import { MatTableDataSource } from '@angular/material/table';

export  interface AssessmentCore {
  category: string;
  test: number;
  worstCase: number;
  bestCase: number;
  lockout:number;
}

export const dummyAssessments:AssessmentCore[] = [
  {
  category: 'Strength',
  test: 1,
  worstCase: 2,
  bestCase: 9,
  lockout: 29
  },
  {
    category: 'Cardio',
    test: 3,
    worstCase: 2,
    bestCase: 6,
    lockout: 29
  },
  {
    category: 'Lifestyle',
    test: 6,
    worstCase: -57,
    bestCase: 61,
    lockout: 28
  },
  {
    category: 'Function',
    test: 4,
    worstCase: 1,
    bestCase: 61,
    lockout: 28
  },
  {
    category: 'Mobility',
    test: 8,
    worstCase: 1,
    bestCase: 61,
    lockout: 28
  },

]


@Component({
  selector: 'hidden-innovation-assessment-listing',
  templateUrl: './assessment-listing.component.html',
  styleUrls: ['./assessment-listing.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssessmentListingComponent implements OnInit {
  displayedColumns: string[] = ['category','test','worstCase', 'bestCase', 'lockout'];
  assessments: MatTableDataSource<AssessmentCore> = new MatTableDataSource<AssessmentCore>();

  constructor(
    public constantDataService: ConstantDataService
  ) {
    this.assessments = new MatTableDataSource<AssessmentCore>(dummyAssessments);
  }

  ngOnInit(): void {
    console.log(dummyAssessments);
  }

}
