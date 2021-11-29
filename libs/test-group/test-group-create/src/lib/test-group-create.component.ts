import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'hidden-innovation-test-group-create',
  templateUrl: './test-group-create.component.html',
  styleUrls: ['./test-group-create.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestGroupCreateComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
