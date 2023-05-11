import {Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TitleCasePipe} from '@angular/common';
import {UiStore} from '@hidden-innovation/shared/store';
import {ConstantDataService, FormValidationService} from '@hidden-innovation/shared/form-config';
import {HotToastService} from '@ngneat/hot-toast';
import {MatDialog} from '@angular/material/dialog';
import {FormArray, FormControl, FormGroup} from '@ngneat/reactive-forms';
import {RxwebValidators} from '@rxweb/reactive-form-validators';
import {
  SportActivities,
  SportActivitiesAnswer,
  SportActivitiesCore,
  SportActivitiesStore
} from '@hidden-innovation/sports-activities/data-access';
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {GenericDialogPrompt} from "@hidden-innovation/shared/models";
import {PromptDialogComponent} from "@hidden-innovation/shared/ui/prompt-dialog";

@Component({
  selector: 'hidden-innovation-create-sports-activities',
  templateUrl: './create-sports-activities.component.html',
  styleUrls: ['./create-sports-activities.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateSportsActivitiesComponent implements OnInit {
  sportsActivitiesGroup: FormGroup<SportActivitiesCore> = new FormGroup<SportActivitiesCore>({
    question: new FormControl('', [
      ...this.formValidationService.requiredFieldValidation,
      RxwebValidators.maxLength({value: 100})
    ]),
    body: new FormControl('', [
      ...this.formValidationService.requiredFieldValidation,
      RxwebValidators.maxLength({value: 300})
    ]),
    description: new FormControl('', [
      ...this.formValidationService.requiredFieldValidation,
      RxwebValidators.maxLength({value: 300})
    ]),
    header: new FormControl('', [
      ...this.formValidationService.requiredFieldValidation,
      RxwebValidators.maxLength({value: 120})
    ]),
    reminder: new FormControl(undefined, [
      ...this.formValidationService.requiredFieldValidation,
      RxwebValidators.numeric({
        allowDecimal: false
      }),
      RxwebValidators.notEmpty(),
      RxwebValidators.required(),
      RxwebValidators.minNumber({
        value: 0
      })
    ]),
    showIcon: new FormControl(false),
    activityAnswer: new FormArray([], [
      RxwebValidators.minLength({value: 3, message: "Minimum 3  answers required"})
    ]),
    id: new FormControl(undefined)
  });

  selectedSportActivitiesAnswer: SportActivitiesAnswer[] = [];

  constructor(
    public router: Router,
    private titleCasePipe: TitleCasePipe,
    public uiStore: UiStore,
    public route: ActivatedRoute,
    public store: SportActivitiesStore,
    public constantDataService: ConstantDataService,
    private hotToastService: HotToastService,
    public formValidationService: FormValidationService,
    private matDialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
  }

  get selectedContents(): SportActivitiesAnswer[] {
    return this.selectedSportActivitiesAnswer ?? [];
  }

  get answersCtrl(): FormArray<SportActivitiesAnswer> {
    return this.sportsActivitiesGroup.controls.activityAnswer as FormArray<SportActivitiesAnswer>;
  }

  answerFormGroup(i: number): FormGroup<SportActivitiesAnswer> {
    return this.answersCtrl.controls[i] as FormGroup<SportActivitiesAnswer>;
  }

  addNewAnswer() {
    this.answersCtrl.insert(0, this.buildGoalAnswer());
    this.sportsActivitiesGroup.updateValueAndValidity();
    this.cdr.markForCheck();
  }

  buildGoalAnswer(ans?: SportActivitiesAnswer): FormGroup<SportActivitiesAnswer> {
    return new FormGroup<SportActivitiesAnswer>({
      answerId: new FormControl(ans?.answerId ?? undefined),
      answerString: new FormControl(ans?.answerString ?? '', [
        RxwebValidators.required(),
        RxwebValidators.notEmpty(),
        RxwebValidators.unique(),
        RxwebValidators.maxLength({
          value: this.formValidationService.FIELD_VALIDATION_VALUES.ANSWER_LENGTH
        })
      ]),
      order: new FormControl(ans?.order ?? undefined),
      iconName: new FormControl({
        value: ans?.iconName ?? '',
        disabled: !this.sportsActivitiesGroup.controls.showIcon.value
      }, [
        RxwebValidators.required(),
        RxwebValidators.notEmpty()
      ]),
      id: new FormControl({
        value: undefined,
        disabled: true
      })
    });
  }

  sportsDrag($event: CdkDragDrop<SportActivitiesAnswer>) {
    const selectedSportActivitiesAns = this.selectedContents ? [...this.selectedContents] : [];
    moveItemInArray(selectedSportActivitiesAns, $event.previousIndex, $event.currentIndex);
    this.uiStore.patchState({
      selectedSportActivitiesAns
    });
  }

  populateSportActivities(sportActivities: SportActivities) {
    const {
      question,
      body,
      description,
      header,
      reminder,
      showIcon,
      id,
      activityAnswer
    } = sportActivities;
    this.sportsActivitiesGroup.patchValue({
      question,
      body,
      description,
      header,
      reminder,
      showIcon,
      id
    });
    this.uiStore.patchState({
      selectedSportActivitiesAns: activityAnswer ?? []
    });
    this.sportsActivitiesGroup.updateValueAndValidity();
    this.cdr.markForCheck();
  }

  removeAnswer(index: number): void {
    const dialogData: GenericDialogPrompt = {
      title: 'Delete Sports and Activities?',
      desc: `Are you sure you want to delete this answer?`,
      action: {
        posTitle: 'Yes',
        negTitle: 'No',
        type: 'mat-primary'
      }
    };
    const dialogRef = this.matDialog.open(PromptDialogComponent, {
      data: dialogData,
      minWidth: '25rem'
    });
    dialogRef.afterClosed().subscribe((proceed: boolean) => {
      if (proceed) {
        // const goal: FormGroup<GoalAnswer> = this.answerFormGroup(index);
        const answerArray: FormArray<SportActivitiesAnswer> = this.sportsActivitiesGroup.controls.activityAnswer as FormArray<SportActivitiesAnswer>;
        // answerArray.removeAt(index);
        if (answerArray?.value[index]?.answerId) {
          this.store.deleteSportActivityAnswer(answerArray?.value[index]?.answerId)
        } else {
          answerArray?.removeAt(index);
        }
        this.cdr.markForCheck();
        this.cdr.detectChanges();
        this.cdr.checkNoChanges();

      }
    });
  }


  ngOnInit(): void {
    this.store.selectedSportActivities$.subscribe((sport: SportActivities | undefined) => {
      if (sport) {
        this.populateSportActivities(sport);
      }
    });

    this.uiStore.sportActivitiesAnswer$.subscribe((ans) => {
      this.selectedSportActivitiesAnswer = ans.map(({id, order, iconName, answerString, answerId}, i) => {
        return {
          iconName,
          answerString,
          order: order,
          answerId: id,
          id
        };
      });
      this.answersCtrl.clear();
      this.selectedSportActivitiesAnswer.forEach((a) => {
        this.answersCtrl.push(this.buildGoalAnswer(a));
        this.sportsActivitiesGroup.updateValueAndValidity();
        this.cdr.markForCheck();
      });
    });
    this.sportsActivitiesGroup.controls.showIcon.valueChanges.subscribe((isChecked) => {
      this.answersCtrl.controls.forEach((ctrls) => {
        const ansGroup: FormGroup<SportActivitiesAnswer> = ctrls as FormGroup<SportActivitiesAnswer>;
        !isChecked ? ansGroup.controls.iconName.disable() : ansGroup.controls.iconName.enable();
      });
    });
    this.store.getSportsActivities$();

  }

  submit(): void {
    this.sportsActivitiesGroup.markAllAsDirty();
    this.sportsActivitiesGroup.markAllAsTouched();
    if (this.sportsActivitiesGroup.invalid) {
      this.hotToastService.error(this.formValidationService.formSubmitError);
      return;
    }
    const updatedSportsObj: SportActivitiesCore = {
      ...this.sportsActivitiesGroup.value,
      activityAnswer: this.sportsActivitiesGroup.value.activityAnswer.map((a, i) => {
        return {
          ...a,
          order: i + 1
        };
      })
    };
    this.store.updateSportsActivities$(updatedSportsObj);
  }


}
