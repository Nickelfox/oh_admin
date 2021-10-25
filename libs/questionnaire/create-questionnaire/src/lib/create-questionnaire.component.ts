import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { QuestionTypeEnum } from '../../../../shared/models/src/lib/create-questionnaire.enum';

@Component({
  selector: 'hidden-innovation-create-questionnaire',
  templateUrl: './create-questionnaire.component.html',
  styleUrls: ['./create-questionnaire.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateQuestionnaireComponent implements OnInit {

  choiceType = QuestionTypeEnum;


  showField = false;
  showIcon = false;
  showSentiment = true;
  selected = true;

  constructor() { }

  ngOnInit(): void {

  }


}
