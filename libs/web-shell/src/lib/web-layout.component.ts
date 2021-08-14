import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'oh-web-layout',
  templateUrl: './web-layout.component.html',
  styleUrls: ['./web-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WebLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
