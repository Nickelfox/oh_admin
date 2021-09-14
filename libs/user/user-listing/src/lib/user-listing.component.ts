import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserListingEntity } from '@hidden-innovation/user/user-listing';



export interface UserElement {
  firstName: string;
  lastName:string;
  email:string;
  country:string;
  date_of_joining:string;
  status:string;
}

const ELEMENT_DATA: UserElement[] = [
  {firstName: 'Deepak', lastName: 'Kumar', email: 'deepak@nickelfox.co', country: 'India', date_of_joining: 'Dec 15, 2020', status: 'Active'},

];


@Component({
  selector: 'hidden-innovation-user-listing',
  templateUrl: './user-listing.component.html',
  styleUrls: ['./user-listing.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class UserListingComponent implements OnInit {

  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'country', 'date_of_joining', 'status', 'action'];
  dataSource = ELEMENT_DATA;



  constructor() { }

  ngOnInit(): void {

  }

}
