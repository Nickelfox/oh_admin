import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { UiStore } from '@hidden-innovation/shared/store';
import { ConstantDataService, FormValidationService } from '@hidden-innovation/shared/form-config';
import { HotToastService } from '@ngneat/hot-toast';
import { MatDialog } from '@angular/material/dialog';
import { FormArray, FormControl, FormGroup } from '@ngneat/reactive-forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { SportActivitiesCore } from '@hidden-innovation/sports-activities/data-access';

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
    goalAnswer: new FormArray([],[
      RxwebValidators.minLength({value:1,message:"Minimum 1 goal answers required"})
    ]),
    id: new FormControl(undefined)
  });

  constructor(
    public router: Router,
    private titleCasePipe: TitleCasePipe,
    public uiStore: UiStore,
    public route: ActivatedRoute,
    public constantDataService: ConstantDataService,
    private hotToastService: HotToastService,
    public formValidationService: FormValidationService,
    private matDialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }

  submit(): void {
    console.log(this.sportsActivitiesGroup.value)
  }



}
