import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'hidden-innovation-pack-selector',
  templateUrl: './pack-selector.component.html',
  styleUrls: ['./pack-selector.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PackSelectorComponent implements OnInit {

  displayedColumns: string[] = ['select', 'name', 'updated_at', 'category','status'];

  constructor() { }

  ngOnInit(): void {
  }

}
