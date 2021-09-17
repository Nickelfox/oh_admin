import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'hidden-innovation-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDetailsComponent implements OnInit {

  @Input() imageSize: number;

  // form action text
  actionBtnText = {
    edit: 'Edit',
    userBlockState: {
      blocked: 'Unblock',
      unblocked: 'Block'
    },
    delete: 'Delete'
  };




  constructor() {
    this.imageSize = 150;
  }

  ngOnInit(): void {
  }

}
