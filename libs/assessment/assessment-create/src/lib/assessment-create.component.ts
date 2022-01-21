import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import {ContentSelectorComponent} from "@hidden-innovation/shared/ui/content-selector";
import {MatDialog} from "@angular/material/dialog";
import {PackStore} from "@hidden-innovation/pack/data-access";
import {UiStore} from "@hidden-innovation/shared/store";
import {HotToastService} from "@ngneat/hot-toast";
import {ActivatedRoute} from "@angular/router";
import {ConstantDataService, FormValidationService} from "@hidden-innovation/shared/form-config";
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import {Assessment, AssessmentCore} from "@hidden-innovation/assessment/data-access";
import {NumericValueType, RxwebValidators} from "@rxweb/reactive-form-validators";

@Component({
  selector: 'hidden-innovation-assessment-create',
  templateUrl: './assessment-create.component.html',
  styleUrls: ['./assessment-create.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssessmentCreateComponent implements OnInit {

  assessmentGroup: FormGroup<AssessmentCore> = new FormGroup<AssessmentCore>({
    name: new FormControl<string>(undefined,[...this.formValidationService.requiredFieldValidation]),
    about: new FormControl<string>('',[...this.formValidationService.requiredFieldValidation]),
    whatYouWillGetOutOfIt: new FormControl<string>('',[...this.formValidationService.requiredFieldValidation]),
    whatYouWillNeed: new FormControl<string>('',[...this.formValidationService.requiredFieldValidation]),
    lockout: new FormControl<number>(undefined,[...this.formValidationService.requiredFieldValidation]),
    howItWorks: new FormControl<string>('',[...this.formValidationService.requiredFieldValidation]),
    whyAreWeAskingQuestion: new FormControl<string>('',[...this.formValidationService.requiredFieldValidation]),
    imageId: new FormControl<number>(undefined,[
      RxwebValidators.required(),
      RxwebValidators.numeric({
        allowDecimal: false,
        acceptValue: NumericValueType.PositiveNumber
      })
    ]),
    testGroupIds: new FormControl([]),
    singleTestIds: new FormControl([]),
    questionnaireIds: new FormControl([])
  })

  constructor(
    public constantDataService: ConstantDataService,
    private matDialog: MatDialog,
    public store: PackStore,
    public uiStore: UiStore,
    public formValidationService: FormValidationService
  ) {

  }

  ngOnInit(): void {
  }

  // populateAssessment(assessment: Assessment):void{
  //   const {
  //     name,
  //     about,
  //     whatYouWillGetOutOfIt,
  //     whatYouWillNeed,
  //     lockout,
  //     howItWorks,
  //     whyAreWeAskingQuestion,
  //     imageId,
  //     testGroupIds,
  //     singleTestIds,
  //     questionnaireIds
  //   } = assessment
  // }


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
}
