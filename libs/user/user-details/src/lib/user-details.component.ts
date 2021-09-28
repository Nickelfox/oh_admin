import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { UserDetailsFacade } from './state/user-details.facade';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'hidden-innovation-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDetailsComponent {

  imageSize: number;

  // form action text
  actionBtnText = {
    edit: 'Edit',
    userBlockState: {
      blocked: 'Unblock',
      unblocked: 'Block'
    },
    delete: 'Delete'
  };

  constructor(
    public facade: UserDetailsFacade,
    private route: ActivatedRoute
  ) {
    const userID = this.route.snapshot.params.id as number;
    this.facade.init(userID);
    this.imageSize = 150;
  }

}
