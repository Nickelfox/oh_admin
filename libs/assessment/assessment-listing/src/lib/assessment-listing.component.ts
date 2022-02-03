import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';
import { MatTableDataSource } from '@angular/material/table';
import { AssessmentListState, AssessmentStore } from '@hidden-innovation/assessment/data-access';


@Component({
  selector: 'hidden-innovation-assessment-listing',
  templateUrl: './assessment-listing.component.html',
  styleUrls: ['./assessment-listing.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssessmentListingComponent implements OnInit {

  displayedColumns: string[] = ['category', 'test', 'lockout', 'action'];
  assessment: MatTableDataSource<AssessmentListState> = new MatTableDataSource<AssessmentListState>([]);

  constructor(
    public constantDataService: ConstantDataService,
    public store: AssessmentStore,
    private cdr: ChangeDetectorRef
  ) {
    this.refreshList();
  }

  refreshList(): void {
    this.store.getAssessmentList$();
  }

  ngOnInit(): void {
    this.store.assessmentList$.subscribe(
      (res) => {
        console.log(res);
        this.assessment = new MatTableDataSource<AssessmentListState>(res);
        this.cdr.markForCheck();
      }
    );
  }

}
