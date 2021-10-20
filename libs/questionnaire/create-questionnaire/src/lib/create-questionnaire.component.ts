import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'hidden-innovation-create-questionnaire',
  templateUrl: './create-questionnaire.component.html',
  styleUrls: ['./create-questionnaire.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateQuestionnaireComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
