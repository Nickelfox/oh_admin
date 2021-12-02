import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'hidden-innovation-pack-listing',
  templateUrl: './pack-listing.component.html',
  styleUrls: ['./pack-listing.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PackListingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
