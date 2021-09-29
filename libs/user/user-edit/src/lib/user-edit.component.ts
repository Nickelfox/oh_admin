import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserDetailsStore } from '@hidden-innovation/user/user-details';
import { ActivatedRoute } from '@angular/router';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { UserUpdateRequest } from './models/user-update.interface';
import { UntilDestroy } from '@ngneat/until-destroy';
import { HotToastService } from '@ngneat/hot-toast';
import { RxwebValidators } from '@rxweb/reactive-form-validators';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'hidden-innovation-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserEditComponent implements OnInit {

  userForm: FormGroup = new FormGroup<UserUpdateRequest>({
    name: new FormControl<string>('', [
      RxwebValidators.required(),
      RxwebValidators.notEmpty(),
    ]),
    age: new FormControl<number>(0),
    email: new FormControl<string>(''),
    gender: new FormControl<string>(''),
    height: new FormControl<number>(0),
    weight: new FormControl<number>(0),
    skinColor: new FormControl<string>(''),
    status: new FormControl<boolean>(false),
    username: new FormControl<string>('')
  });

  public userID: number;
  private userDetailsToast = 'user-details-populating-toast';

  constructor(
    public store: UserDetailsStore,
    private route: ActivatedRoute,
    public constantDataService: ConstantDataService,
    private toastService: HotToastService
  ) {
    this.userID = this.route.snapshot.params.id as number;
    this.store.isLoading$.subscribe(isLoading => {
      if (isLoading) {
        this.userForm.disable();
        this.toastService.loading('Populating user details', {
          id: this.userDetailsToast,
          dismissible: false
        });
        return;
      }
      this.userForm.enable();
      this.toastService.close(this.userDetailsToast);
    });
  }

  ngOnInit(): void {
    this.store.getUserDetails({
      id: this.userID
    });
  }

}
