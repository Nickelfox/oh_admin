import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'hidden-innovation-create-sports-activities',
  templateUrl: './create-sports-activities.component.html',
  styleUrls: ['./create-sports-activities.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateSportsActivitiesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
