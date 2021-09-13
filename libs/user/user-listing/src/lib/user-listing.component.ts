import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'hidden-innovation-user-listing',
  templateUrl: './user-listing.component.html',
  styleUrls: ['./user-listing.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class UserListingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
