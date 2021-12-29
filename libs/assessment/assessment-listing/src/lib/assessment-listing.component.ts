import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';


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
  }
]


@Component({
  selector: 'hidden-innovation-assessment-listing',
  templateUrl: './assessment-listing.component.html',
  styleUrls: ['./assessment-listing.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssessmentListingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
