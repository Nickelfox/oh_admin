import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'hidden-innovation-questionnaire-core',
  templateUrl: './questionnaire-core.component.html',
  styleUrls: ['./questionnaire-core.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionnaireCoreComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
