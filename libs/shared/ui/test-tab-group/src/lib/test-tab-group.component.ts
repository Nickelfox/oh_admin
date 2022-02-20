import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { paginatorData } from '@hidden-innovation/user/data-access';

@Component({
  selector: 'hidden-innovation-test-tab-group',
  template: `
    <mat-card class='p-0 mat-elevation-z0'>
      <div class='container-fluid p-0'>
        <div class='row'>
          <div class='col-2 px-0'>
            <button mat-button
                    routerLinkActive='active'
                    [routerLink]='["/tests", "listing"]'
                    class='w-100 py-2 tab-border-button'>Single
            </button>
            <mat-divider class='tab-border-bottom'></mat-divider>
          </div>
          <div class='col-2 px-0'>
            <button mat-button
                    routerLinkActive='active'
                    [routerLink]='["/tests-group", "listing"]'
                    class='w-100  py-2 tab-border-button'>Group
            </button>
            <mat-divider class='tab-border-bottom'></mat-divider>
          </div>
          <div class='col'></div>
        </div>
      </div>
    </mat-card>
  `,
  styleUrls: ['./test-tab-group.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestTabGroupComponent {
  @Input() activeIndex: 0 | 1 = 0;
  pagination = paginatorData;
}
