import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { FeaturedCore } from '@hidden-innovation/featured/data-access';
import { DateTime } from 'luxon';
import { MatTableDataSource } from '@angular/material/table';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';

export enum FeaturedType  {
  SPOTLIGHT = 'SPOTLIGHT',
  FEATURED_PACKS = 'FEATURED_PACKS',
  FEATURED_TESTS = 'FEATURED_TESTS',
  PACKS = 'PACKS'
}

export enum PackType  {
  HOME = 'HOME',
  CARDIO = 'CARDIO',
  LIFESTYLE = 'LIFESTYLE',
  FUNCTION = 'FUNCTION',
  MOVEMENT = 'MOVEMENT',
  STRENGTH = 'STRENGTH'
}

export const dummyFeatured: FeaturedCore[] = [
  {
    name: 'Spotlight',
    screen: PackType.HOME,
    items: 2,
    created_at: DateTime.now().toISODate(),
    deleted_at: DateTime.now().toISODate(),
    updated_at: DateTime.now().toISODate()
  },
  {
    name: 'Feature Packs',
    screen: PackType.HOME,
    items: 2,
    created_at: DateTime.now().toISODate(),
    deleted_at: DateTime.now().toISODate(),
    updated_at: DateTime.now().toISODate()
  },
  {
    name: 'Feature Tests',
    screen: PackType.HOME,
    items: 2,
    created_at: DateTime.now().toISODate(),
    deleted_at: DateTime.now().toISODate(),
    updated_at: DateTime.now().toISODate()
  },
  {
    name: 'Packs',
    screen: PackType.CARDIO,
    items: 2,
    created_at: DateTime.now().toISODate(),
    deleted_at: DateTime.now().toISODate(),
    updated_at: DateTime.now().toISODate()
  },
  {
    name: 'Packs',
    screen: PackType.LIFESTYLE,
    items: 2,
    created_at: DateTime.now().toISODate(),
    deleted_at: DateTime.now().toISODate(),
    updated_at: DateTime.now().toISODate()
  },
  {
    name: 'Packs',
    screen: PackType.FUNCTION,
    items: 2,
    created_at: DateTime.now().toISODate(),
    deleted_at: DateTime.now().toISODate(),
    updated_at: DateTime.now().toISODate()
  },
  {
    name: 'Packs',
    screen: PackType.MOVEMENT,
    items: 2,
    created_at: DateTime.now().toISODate(),
    deleted_at: DateTime.now().toISODate(),
    updated_at: DateTime.now().toISODate()
  },
  {
    name: 'Packs',
    screen: PackType.STRENGTH,
    items: 2,
    created_at: DateTime.now().toISODate(),
    deleted_at: DateTime.now().toISODate(),
    updated_at: DateTime.now().toISODate()
  },

];

@Component({
  selector: 'hidden-innovation-featured-listing',
  templateUrl: './featured-listing.component.html',
  styleUrls: ['./featured-listing.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})





export class FeaturedListingComponent implements OnInit {
  displayedColumns: string[] = ['name','screen','updated_at', 'items'];
  featured: MatTableDataSource<FeaturedCore> = new MatTableDataSource<FeaturedCore>();

  constructor(
    public constantDataService: ConstantDataService
  ) {
    this.featured = new MatTableDataSource<FeaturedCore>(dummyFeatured);
  }

  ngOnInit(): void {

  }
}
