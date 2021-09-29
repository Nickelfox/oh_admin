import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserDetailsStore } from '@hidden-innovation/user/user-details';
import { ActivatedRoute } from '@angular/router';
import { ConstantDataService, FormValidationService } from '@hidden-innovation/shared/form-config';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { UserUpdateRequest } from './models/user-update.interface';
import { UntilDestroy } from '@ngneat/until-destroy';
import { HotToastService } from '@ngneat/hot-toast';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { Validators } from '@angular/forms';
import { UserGenderEnum, UserStatusEnum } from '@hidden-innovation/shared/models';
import { UserEditStore } from './user-edit.store';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'hidden-innovation-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserEditComponent implements OnInit {

  userForm: FormGroup<UserUpdateRequest> = new FormGroup<UserUpdateRequest>({
    username: new FormControl('', [
      RxwebValidators.alphaNumeric({
        allowWhiteSpace: false
      }),
      RxwebValidators.maxLength({
        value: this.formValidationService.FIELD_VALIDATION_VALUES.USERNAME_LENGTH
      })
    ]),
    name: new FormControl('', [
      RxwebValidators.alpha({
        allowWhiteSpace: true
      }),
      RxwebValidators.maxLength({
        value: this.formValidationService.FIELD_VALIDATION_VALUES.NAME_LENGTH
      }),
      Validators.pattern(this.formValidationService.fieldRegex)
    ]),
    age: new FormControl(0, [
      RxwebValidators.numeric({
        allowDecimal: false
      }),
      Validators.min(1)
    ]),
    email: new FormControl('', [
      RxwebValidators.email(),
      RxwebValidators.required(),
      Validators.required
    ]),
    gender: new FormControl(''),
    height: new FormControl(0, [
      RxwebValidators.numeric({
        allowDecimal: false
      }),
      Validators.min(1)
    ]),
    weight: new FormControl(0, [
      RxwebValidators.numeric({
        allowDecimal: false
      }),
      Validators.min(1)
    ]),
    skinColor: new FormControl('', [
      RxwebValidators.hexColor({
        isStrict: true
      })
    ]),
    status: new FormControl(false)
  });

  public userID: number;
  userGenders = Object.values(UserGenderEnum);
  userStatusEnum = UserStatusEnum;
  private userDetailsToast = 'user-details-populating-toast';

  constructor(
    public userDetailsStore: UserDetailsStore,
    public store: UserEditStore,
    private route: ActivatedRoute,
    public constantDataService: ConstantDataService,
    private toastService: HotToastService,
    public formValidationService: FormValidationService
  ) {
    this.userID = this.route.snapshot.params.id as number;
    this.store.isLoading$.subscribe((loading) => {
      loading ? this.userForm.disable() : this.userForm.enable();
    });
    this.userDetailsStore.state$.pipe().subscribe((state) => {
      if (state.isLoading) {
        this.userForm.disable();
        this.toastService.loading('Populating user details', {
          id: this.userDetailsToast,
          dismissible: false
        });
      } else {
        this.userForm.patchValue({
          name: state.name,
          height: state.height,
          status: state.status,
          gender: state.gender,
          email: state.email,
          age: state.age,
          username: state.username,
          weight: state.weight,
          skinColor: state.skinColor
        });
        this.userForm.enable();
        this.toastService.close(this.userDetailsToast);
      }
    });
  }

  ngOnInit(): void {
    this.userDetailsStore.getUserDetails({
      id: this.userID
    });
  }

  submit() {
    this.userForm.markAllAsTouched();
    if (this.userForm.invalid) {
      return;
    }
    this.store.updateUser({
      id: this.userID,
      obj: this.userForm.value
    });
  }
}
