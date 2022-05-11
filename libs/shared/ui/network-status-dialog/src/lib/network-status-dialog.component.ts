import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'hidden-innovation-network-status-dialog',
  template: `
    <mat-list class='pt-0'>
      <mat-list-item>
        <mat-icon color='warn' mat-list-icon>wifi_off</mat-icon>
        <div mat-line>
          <h3 class='mat-h3 m-0'>Network Offline</h3>
        </div>
      </mat-list-item>
    </mat-list>
  `,
  styleUrls: ['./network-status-dialog.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NetworkStatusDialogComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
