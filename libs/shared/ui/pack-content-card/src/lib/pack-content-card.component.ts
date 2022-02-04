import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { PackContentTypeEnum } from '@hidden-innovation/shared/models';

@Component({
  selector: 'hidden-innovation-pack-content-card',
  template: `
    <mat-card class='mat-elevation-z3 p-3'>
      <div class='container-fluid p-0'>
        <div class='row'>
          <div class='col-6'>
            <h4 matTooltip='{{name}}'
                class='mat-h4 mb-0 font-weight-bold'>{{name ? (name | maxStringLimit : 35) : '--'}}</h4>
            <h5
              class='mat-h5 mb-0 mr-4 font-calibri'
              [ngStyle]='{"color": getTypeColor(category)}'>{{(category | titlecase) || '--'}}</h5>
          </div>
          <div class='col-6 d-flex justify-content-end'>
            <div class='d-flex align-items-center justify-content-end w-100'>
              <div *ngIf='showScore'>
                <div class='d-flex align-items-center mr-3'>
                  <div class='d-flex align-items-center'>
                    <mat-icon class='mr-3 text-color__success' color='primary'>sentiment_satisfied_alt</mat-icon>
                    <h3 class='m-0 mat-h3 text-color__success'>20</h3>
                  </div>
                  <div class='d-flex align-items-center ml-4'>
                    <mat-icon class='mr-3 text-color__error' color='primary'>sentiment_very_dissatisfied</mat-icon>
                    <h3 class='m-0 mat-h3 text-color__error'>0</h3>
                  </div>
                </div>
              </div>
              <div>
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
  @Input() category: PackContentTypeEnum | undefined;
  @Input() showScore = false;

  @Output() emitDeleteEvent: EventEmitter<void> = new EventEmitter<void>();

  getTypeColor(type: PackContentTypeEnum | undefined): string {
    switch (type) {
      case PackContentTypeEnum.LESSON:
        return '#6394E2';
      case PackContentTypeEnum.SINGLE:
        return '#FFC107';
      case PackContentTypeEnum.GROUP:
        return '#FFC107';
      case PackContentTypeEnum.QUESTIONNAIRE:
        return '#4DB6AC';
      case PackContentTypeEnum.PACK:
        return '#A259FF';
      default:
        return '#c4c6cc';
    }
  }
}
