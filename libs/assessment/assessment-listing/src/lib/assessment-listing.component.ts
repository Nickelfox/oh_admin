import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ConstantDataService} from '@hidden-innovation/shared/form-config';
import {MatTableDataSource} from '@angular/material/table';
import {AssessmentLocalState, AssessmentStore} from "@hidden-innovation/assessment/data-access";
import {TagCategoryEnum} from "@hidden-innovation/shared/models";
import {FeaturedLocalState} from "@hidden-innovation/featured/data-access";


@Component({
  selector: 'hidden-innovation-assessment-listing',
  templateUrl: './assessment-listing.component.html',
  styleUrls: ['./assessment-listing.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssessmentListingComponent implements OnInit {

  private _dummyAssessment:AssessmentLocalState[] = [
    {
      category: TagCategoryEnum.STRENGTH,
      test: 0,
      worstCase: 0,
      bestCase: 0,
      lockout: 0
    },
    {
      category: TagCategoryEnum.CARDIO,
      test: 0,
      worstCase: 0,
      bestCase: 0,
      lockout: 0
    },
    {
      category: TagCategoryEnum.LIFESTYLE,
      test: 0,
      worstCase: 0,
      bestCase: 0,
      lockout: 0
    },
    {
      category: TagCategoryEnum.FUNCTION,
      test: 0,
      worstCase: 0,
      bestCase: 0,
      lockout: 0
    },
    {
      category: TagCategoryEnum.MOBILE,
      test: 0,
      worstCase: 0,
      bestCase: 0,
      lockout: 0
    },

  ]

  displayedColumns: string[] = ['category','test','worstCase', 'bestCase', 'lockout', 'action'];
  assessment: MatTableDataSource<AssessmentLocalState> = new MatTableDataSource<AssessmentLocalState>();

  constructor(
    public constantDataService: ConstantDataService,
    public store: AssessmentStore,
    private cdr: ChangeDetectorRef,
  ) {
    this.refreshList();
  }

  refreshList(): void {
    this.store.getAssessmentList$();
  }


  get localData(): AssessmentLocalState[] {
    return this._dummyAssessment;
  }

  set localData(assessment: AssessmentLocalState[]) {
    this._dummyAssessment = [...assessment];
    this.assessment = new MatTableDataSource<AssessmentLocalState>(this.localData);
  }



  ngOnInit(): void {
    this.store.assessmentList$.subscribe(
      (res) => {
        res.forEach(assessment => this.localData = this.localData.map(data => {
            if (data.category === assessment.category) {
              return {
                ...data,
                id: assessment.id ?? undefined,
                lockout: assessment.lockout,
                bestCase: assessment.bestCase,
                worstCase: assessment.worstCase
              };
            } else {
              return data;
            }
          })
        );
        this.cdr.markForCheck();
      }
    );
  }

}
