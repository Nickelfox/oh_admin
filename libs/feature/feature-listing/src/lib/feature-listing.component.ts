import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { FeatureCore } from '@hidden-innovation/feature/data-access';
import { DateTime } from 'luxon';
import { MatTableDataSource } from '@angular/material/table';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';


export const dummyFeature: FeatureCore[] = [
  {
    name: 'Spotlight',
    screen: 'Home',
    items: 2,
    created_at: DateTime.now().toISODate(),
    deleted_at: DateTime.now().toISODate(),
    updated_at: DateTime.now().toISODate()
  },
  {
    name: 'Feature Packs',
    screen: 'Cardio(Library)',
    items: 2,
    created_at: DateTime.now().toISODate(),
    deleted_at: DateTime.now().toISODate(),
    updated_at: DateTime.now().toISODate()
  }
];

@Component({
  selector: 'hidden-innovation-feature-listing',
  templateUrl: './feature-listing.component.html',
  styleUrls: ['./feature-listing.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})





export class FeatureListingComponent implements OnInit {
  displayedColumns: string[] = ['name','screen','updated_at', 'items'];
  feature: MatTableDataSource<FeatureCore> = new MatTableDataSource<FeatureCore>();

  constructor(
    public constantDataService: ConstantDataService
  ) {
    this.feature = new MatTableDataSource<FeatureCore>(dummyFeature);
  }

  ngOnInit(): void {
    console.log(dummyFeature);
  }

}
