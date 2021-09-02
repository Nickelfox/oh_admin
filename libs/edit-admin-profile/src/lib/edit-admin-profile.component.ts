import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'hidden-innovation-edit-admin-profile',
  templateUrl: './edit-admin-profile.component.html',
  styleUrls: ['./edit-admin-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditAdminProfileComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
