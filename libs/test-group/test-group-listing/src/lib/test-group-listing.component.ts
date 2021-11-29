import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'hidden-innovation-test-group-listing',
  templateUrl: './test-group-listing.component.html',
  styleUrls: ['./test-group-listing.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestGroupListingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
