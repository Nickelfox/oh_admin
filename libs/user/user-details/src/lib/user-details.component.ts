import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserDetailsStore } from './user-details.store';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';
import { StatusChipType, UserStatusEnum } from '@hidden-innovation/shared/models';

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
    public store: UserDetailsStore,
    public constantDataService: ConstantDataService
  ) {
    this.userID = this.route.snapshot.params.id as number;
    this.store.getUserDetails({
      id: this.userID
    });
    this.imageSize = 150;
  }

}
