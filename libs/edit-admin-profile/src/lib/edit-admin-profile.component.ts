import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { Validators } from '@angular/forms';
import { FormValidationService } from '@hidden-innovation/shared/form-config';
import { EditAdminProfileRequest } from './models/edit-admin-profile.interface';
import { AuthFacade } from '@hidden-innovation/auth';
import { tap } from 'rxjs/operators';
import { UntilDestroy } from '@ngneat/until-destroy';
import { EditAdminProfileStore } from './edit-admin-profile.store';

@UntilDestroy()
@Component({
  selector: 'hidden-innovation-edit-admin-profile',
  templateUrl: './edit-admin-profile.component.html',
  styleUrls: ['./edit-admin-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditAdminProfileComponent implements OnInit {

  editProfileForm: FormGroup<EditAdminProfileRequest> = new FormGroup<EditAdminProfileRequest>(
    {
      name: new FormControl<string>('', [
        // RxwebValidators.pattern({expression: this.formValidationService.nameRegex }),
        RxwebValidators.alpha({
          allowWhiteSpace: true
        }),
        RxwebValidators.maxLength({
          value: this.formValidationService.FIELD_VALIDATION_VALUES.NAME_LENGTH
        }),
        RxwebValidators.required(),
        Validators.required,
        Validators.pattern(this.formValidationService.fieldRegex)
      ]),
      username: new FormControl<string>('', [
        RxwebValidators.alphaNumeric({
          allowWhiteSpace: false
        }),
        RxwebValidators.maxLength({
          value: this.formValidationService.FIELD_VALIDATION_VALUES.USERNAME_LENGTH
        }),
        RxwebValidators.required(),
        Validators.required
      ])
    }
  );

  constructor(
    public formValidationService: FormValidationService,
    private authFacade: AuthFacade,
    public store: EditAdminProfileStore
  ) {
  }

  ngOnInit(): void {
    this.authFacade.authAdmin$.pipe(
      tap((admin) => {
        if (admin) {
          this.editProfileForm.setValue({
            name: admin.name,
            username: admin.username
          });
        }
      })
    ).subscribe();
  }

  submit(): void {
    if(this.editProfileForm.invalid) {
      return;
    }
    const {name, username} = this.editProfileForm.value;
    this.store.editAdminProfile({
      name,
      username
    });
  }

}
