import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'hidden-innovation-pack-content-card',
  template: `
    <mat-card class='mat-elevation-z3 p-3'>
      <div class='container-fluid p-0'>
        <div class='row'>
          <div class='col-10'>
            <h4 matTooltip='{{name}}'
                class='mat-h4 mb-0 font-weight-bold'>{{name ? (name | maxStringLimit : 35) : '--'}}</h4>
            <h5
              class='mat-h5 text-color__primary--light mb-0 mr-4 font-calibri'>{{(category | titlecase) || '--'}}</h5>
          </div>
          <div class='col-2 d-flex justify-content-end'>
            <button type='button' mat-icon-button [matMenuTriggerFor]='testOption'>
              <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #testOption='matMenu'>
              <button type='button' mat-menu-item (click)='emitDeleteEvent.emit()'>
                <mat-icon>delete</mat-icon>
                <span>Delete</span>
              </button>
            </mat-menu>
          </div>
        </div>
      </div>
    </mat-card>
  `,
  styleUrls: ['./pack-content-card.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PackContentCardComponent {

  @Input() name: string | undefined;
  @Input() category: string | undefined;

  @Output() emitDeleteEvent: EventEmitter<void> = new EventEmitter<void>();

}
