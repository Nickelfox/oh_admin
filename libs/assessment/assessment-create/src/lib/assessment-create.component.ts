import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { ContentSelectorComponent } from '@hidden-innovation/shared/ui/content-selector';
import { MatDialog } from '@angular/material/dialog';
import { UiStore } from '@hidden-innovation/shared/store';
import { HotToastService } from '@ngneat/hot-toast';
import { ActivatedRoute } from '@angular/router';
import { ConstantDataService, FormValidationService } from '@hidden-innovation/shared/form-config';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { Assessment, AssessmentCore, AssessmentStore } from '@hidden-innovation/assessment/data-access';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { map, switchMap } from 'rxjs/operators';
import { AspectRatio, Media } from '@hidden-innovation/media';
import { Observable } from 'rxjs';
import { TagCategoryEnum } from '@hidden-innovation/shared/models';
import { BreadcrumbService } from 'xng-breadcrumb';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'hidden-innovation-assessment-create',
  templateUrl: './assessment-create.component.html',
  styleUrls: ['./assessment-create.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssessmentCreateComponent implements OnInit, OnDestroy {

  assessmentGroup: FormGroup<AssessmentCore> = new FormGroup<AssessmentCore>({
    name: new FormControl(undefined, [...this.formValidationService.requiredFieldValidation]),
    about: new FormControl('', [...this.formValidationService.requiredFieldValidation]),
    count: new FormControl(undefined),
    whatYouWillGetOutOfIt: new FormControl('', [...this.formValidationService.requiredFieldValidation]),
    whatYouWillNeed: new FormControl('', [...this.formValidationService.requiredFieldValidation]),
    lockout: new FormControl(undefined, [...this.formValidationService.requiredFieldValidation]),
    howItWorks: new FormControl('', [...this.formValidationService.requiredFieldValidation]),
    imageId: new FormControl(undefined, [
      RxwebValidators.required(),
      RxwebValidators.numeric({
        allowDecimal: false,
        acceptValue: NumericValueType.PositiveNumber
      })
    ]),
    testGroupIds: new FormControl([]),
    singleTestIds: new FormControl([]),
    questionnaireIds: new FormControl([])
  });

  aspectRatio = AspectRatio;
  assessmentCat?: TagCategoryEnum;
  selectedAssessment: Assessment | undefined;


  constructor(
    public constantDataService: ConstantDataService,
    private matDialog: MatDialog,
    private hotToastService: HotToastService,
    public store: AssessmentStore,
    public route: ActivatedRoute,
    public uiStore: UiStore,
    public formValidationService: FormValidationService,
    private breadcrumbService: BreadcrumbService,
    private cdr: ChangeDetectorRef,
    private titleCasePipe: TitleCasePipe
  ) {
    this.route.data.pipe(
      switchMap(_ => this.route.params)
    ).subscribe((res) => {
      this.assessmentCat = res['category'] as TagCategoryEnum;
      if (!this.assessmentCat) {
        this.hotToastService.error('Error occurred while fetching details');
        return;
      }
      this.breadcrumbService.set('/assessments/edit/:category', this.titleCasePipe.transform(this.assessmentCat) + ' Assessment');
      this.store.selectedAssessment$.subscribe((assess) => {
        if (assess) {
          this.populateAssessment(assess);
        }
      });
      this.store.getAssessmentDetails$(this.assessmentCat);
    });

  }

  get imageIDctrl(): FormControl<number | undefined> {
    return this.assessmentGroup.controls.imageId;
  }

  get selectedImageData(): Observable<Media | undefined> {
    return this.store.selectedAssessment$.pipe(
      map(assess => assess?.image)
    );
  }

  ngOnInit(): void {
  }

  populateAssessment(assessment: Assessment): void {
    const {
      name,
      about,
      whatYouWillGetOutOfIt,
      whatYouWillNeed,
      lockout,
      howItWorks,
      image,
      testGroupIds,
      singleTestIds,
      questionnaireIds
    } = assessment;
    this.selectedAssessment = assessment;
    this.assessmentGroup.patchValue({
      about,
      whatYouWillGetOutOfIt,
      howItWorks,
      whatYouWillNeed,
      lockout,
      imageId: image?.id
    });
  }


  openContentSelectorDialog(): void {
    this.matDialog.open(ContentSelectorComponent, {
      height: '100%',
      width: '100%',
      maxHeight: '100%',
      maxWidth: '100%',
      role: 'dialog'
    });
    // testGroupDialog.afterClosed().subscribe((tgs: TestGroup[] | undefined) => {
    // });
  }

  ngOnDestroy(): void {
    this.store.patchState({
      selectedAssessment: undefined
    });
  }
}
