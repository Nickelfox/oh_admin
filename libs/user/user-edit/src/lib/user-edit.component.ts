import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserDetailsStore } from '@hidden-innovation/user/user-details';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'hidden-innovation-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserEditComponent implements OnInit {

  public userID: number;

  constructor(
    private store: UserDetailsStore,
    private route: ActivatedRoute
  ) {
    this.userID = this.route.snapshot.params.id as number;
  }

  ngOnInit(): void {
    this.store.getUserDetails({
      id: this.userID,
    });
  }

}
