import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';
import { StatusChipType, UserStatusEnum } from '@hidden-innovation/shared/models';
import { UserStore } from '@hidden-innovation/user/data-access';

@Component({
  selector: 'hidden-innovation-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDetailsComponent {

  imageSize: number;

  public userID: number;
  user$ = this.store.selectedUser$;

  chartOptions = {
    responsive: true
  };

  statusChipType = StatusChipType;


  chartLabels = [
    ['Download', 'Sales'],
    ['In', 'Store', 'Sales'],
    'Mail Sales'
  ];

  chartColors = [
    {
      backgroundColor: ['red', '#0F0', 'rgba(41, 182, 246,0.75)'],
      borderColor: ['rgb(250,120,100)', 'green', '#0086c3']
    }
  ];

  chartData = [67];
  chartLegend = true;

  userStatusEnum = UserStatusEnum;

  constructor(
    private route: ActivatedRoute,
    public store: UserStore,
    public constantDataService: ConstantDataService
  ) {
    this.userID = this.route.snapshot.params.id as number;
    this.store.getUserDetails$({
      id: this.userID
    });
    this.imageSize = 150;
  }

}
