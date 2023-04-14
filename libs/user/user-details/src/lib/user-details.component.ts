import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';
import { GoalAnswer, NewGoal, StatusChipType, UserPosition, UserStatusEnum } from '@hidden-innovation/shared/models';
import { UserStore } from '@hidden-innovation/user/data-access';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'hidden-innovation-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDetailsComponent implements OnInit {

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
  userPosition = UserPosition;
  UserAnswers?: GoalAnswer[] = [];


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


  getGoalsCount():string{
    return this.UserAnswers?.length.toString() ?? "-"
  }

  getFields(input: NewGoal[] | undefined) {
    if (!input) {
      return;
    }
    for (const answers of input) {
      this.UserAnswers?.push(answers.goalAnswer);
    }
  }

  ngOnInit(): void {
    this.user$.subscribe(res => {
      this.getFields(res?.userGoal);
    });
  }

}
