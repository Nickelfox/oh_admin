import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';


@Component({
  selector: 'hidden-innovation-test-create',
  templateUrl: './test-create.component.html',
  styleUrls: ['./test-create.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class TestCreateComponent implements OnInit {

  constructor() {

  }


  ngOnInit(): void {
  }

}
