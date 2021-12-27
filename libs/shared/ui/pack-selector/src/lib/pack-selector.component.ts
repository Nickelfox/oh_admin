import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'hidden-innovation-pack-selector',
  templateUrl: './pack-selector.component.html',
  styleUrls: ['./pack-selector.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PackSelectorComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
