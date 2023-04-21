import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TitleCasePipe} from '@angular/common';
import {UiStore} from '@hidden-innovation/shared/store';
import {ConstantDataService, FormValidationService} from '@hidden-innovation/shared/form-config';
import {HotToastService} from '@ngneat/hot-toast';
import {MatDialog} from '@angular/material/dialog';
import {FormArray, FormControl, FormGroup} from '@ngneat/reactive-forms';
import {GoalAnswer, Goals, GoalsCore, GoalStore} from '@hidden-innovation/goals/data-access';
import {RxwebValidators} from '@rxweb/reactive-form-validators';
import {GenericDialogPrompt} from '@hidden-innovation/shared/models';
import {PromptDialogComponent} from '@hidden-innovation/shared/ui/prompt-dialog';
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {ContentCore} from "@hidden-innovation/pack/data-access";

@Component({
  selector: 'hidden-innovation-create-goals',
  templateUrl: './create-goals.component.html',
  styleUrls: ['./create-goals.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateGoalsComponent implements OnInit {

  goalsGroup: FormGroup<GoalsCore> = new FormGroup<GoalsCore>({
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
    goalAnswer: new FormArray([],[
      RxwebValidators.minLength({value:3,message:"Minimum 3 goal answers required"})
    ]),
    id: new FormControl(undefined)
  });

  selectedGoals: GoalAnswer[] = [];


  constructor(
    public router: Router,
    private titleCasePipe: TitleCasePipe,
    public uiStore: UiStore,
    public route: ActivatedRoute,
    public store: GoalStore,
    public constantDataService: ConstantDataService,
    private hotToastService: HotToastService,
    public formValidationService: FormValidationService,
    private matDialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
  }

  get selectedContents(): GoalAnswer[] {
    return this.selectedGoals ?? [];
  }
  get answersCtrl(): FormArray<GoalAnswer> {
    return this.goalsGroup.controls.goalAnswer as FormArray<GoalAnswer>;
  }

  answerFormGroup(i: number): FormGroup<GoalAnswer> {
    return this.answersCtrl.controls[i] as FormGroup<GoalAnswer>;
  }

  addNewAnswer(): void {
    this.answersCtrl.push(this.buildGoalAnswer());
    this.goalsGroup.updateValueAndValidity();
    this.cdr.markForCheck();
  }

  buildGoalAnswer(ans?: GoalAnswer): FormGroup<GoalAnswer> {
    return new FormGroup<GoalAnswer>({
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
        disabled: !this.goalsGroup.controls.showIcon.value
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

  populateGoals(goals: Goals) {
    const {
      question,
      body,
      description,
      header,
      reminder,
      showIcon,
      id,
      goalAnswer
    } = goals;
    this.goalsGroup.patchValue({
      question,
      body,
      description,
      header,
      reminder,
      showIcon,
      id
    });
    this.uiStore.patchState({
      selectedGoalAns: goalAnswer ?? []
    });
    this.goalsGroup.updateValueAndValidity();
    this.cdr.markForCheck();
  }

  removeAnswer(index: number): void {
    const dialogData: GenericDialogPrompt = {
      title: 'Delete Goal?',
      desc: `Are you sure you want to delete this Goal?`,
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
        const answerArray: FormArray<GoalAnswer> = this.goalsGroup.controls.goalAnswer as FormArray<GoalAnswer>;
        this.store.deleteGoalsAnswer(answerArray?.value[index]?.answerId)
        // answerArray.removeAt(index);
        this.cdr.markForCheck();
        this.cdr.detectChanges();
        this.cdr.checkNoChanges();
      }
    });
  }

  goalsDrag($event: CdkDragDrop<GoalAnswer>){
    const selectedGoalAns = this.selectedContents ? [...this.selectedContents] : [];
    moveItemInArray(selectedGoalAns, $event.previousIndex, $event.currentIndex);
    this.uiStore.patchState({
      selectedGoalAns
    });
  }


  ngOnInit(): void {
    this.store.selectedGoal$.subscribe((goal: Goals | undefined) => {
      if (goal) {
        this.populateGoals(goal);
      }
    });
    this.uiStore.selectedGoalAns$.subscribe((ans) => {
      this.selectedGoals = ans.map(({id,order, iconName, answerString, answerId}, i) => {
        return {
          iconName,
          answerString,
          order: order,
          answerId: id,
          id
        };
      });
      this.answersCtrl.clear();
      this.selectedGoals.forEach((a) => {
        this.answersCtrl.push(this.buildGoalAnswer(a));
        this.goalsGroup.updateValueAndValidity();
        this.cdr.markForCheck();
      });
    });
    this.goalsGroup.controls.showIcon.valueChanges.subscribe((isChecked) => {
      this.answersCtrl.controls.forEach((ctrls) => {
        const ansGroup: FormGroup<GoalAnswer> = ctrls as FormGroup<GoalAnswer>;
        !isChecked ? ansGroup.controls.iconName.disable() : ansGroup.controls.iconName.enable();
      });
    });
    this.store.getGoalDetail$();
  }

  submit(): void {
    this.goalsGroup.markAllAsDirty();
    this.goalsGroup.markAllAsTouched();
    if (this.goalsGroup.invalid) {
      this.hotToastService.error(this.formValidationService.formSubmitError);
      return;
    }
    const updatedGoalObj: GoalsCore = {
      ...this.goalsGroup.value,
      goalAnswer: this.goalsGroup.value.goalAnswer.map((a, i) => {
        return {
          ...a,
          order: i + 1
        };
      })
    };
    this.store.updateGoals$(updatedGoalObj);
  }

}
