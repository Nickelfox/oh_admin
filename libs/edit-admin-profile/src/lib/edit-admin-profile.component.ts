import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { Validators } from '@angular/forms';
import { FormValidationService } from '@hidden-innovation/shared/form-config';
import { EditAdminProfileRequest } from './models/edit-admin-profile.interface';

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
        RxwebValidators.maxLength({ value: 150 }),
        RxwebValidators.required(),
        Validators.required
      ]),
      email: new FormControl<string>('', [
        RxwebValidators.email(),
        RxwebValidators.required(),
        Validators.required
      ])
    }
  );

  constructor(
    public formValidationService: FormValidationService
  ) {
  }

  ngOnInit(): void {
    console.log('edit profile');
  }

}
