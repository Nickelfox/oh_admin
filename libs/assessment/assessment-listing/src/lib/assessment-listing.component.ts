import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';
import { MatTableDataSource } from '@angular/material/table';
import { AssessmentListState, AssessmentStore } from '@hidden-innovation/assessment/data-access';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


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
  noData: Observable<boolean>;

  constructor(
    public constantDataService: ConstantDataService,
    public store: AssessmentStore,
    private cdr: ChangeDetectorRef
  ) {
    this.noData = this.assessment.connect().pipe(map(data => data.length === 0));
    this.refreshList();
  }

  refreshList(): void {
    this.store.getAssessmentList$();
  }

  ngOnInit(): void {
    this.store.assessmentList$.subscribe(
      (res) => {
        this.assessment = new MatTableDataSource<AssessmentListState>(res);
        this.noData = this.assessment.connect().pipe(map(data => data.length === 0));
        this.cdr.markForCheck();
      }
    );
  }

}
