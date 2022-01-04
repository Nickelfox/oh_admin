import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import {ContentSelectorComponent} from "@hidden-innovation/shared/ui/content-selector";
import {MatDialog} from "@angular/material/dialog";
import {PackStore} from "@hidden-innovation/pack/data-access";
import {UiStore} from "@hidden-innovation/shared/store";
import {HotToastService} from "@ngneat/hot-toast";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'hidden-innovation-assessment-create',
  templateUrl: './assessment-create.component.html',
  styleUrls: ['./assessment-create.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssessmentCreateComponent implements OnInit {

  constructor(
    private matDialog: MatDialog,
    public store: PackStore,
    public uiStore: UiStore,
  ) { }

  ngOnInit(): void {
  }
  openContentSelectorDialog(): void {
    this.matDialog.open(ContentSelectorComponent, {
      height: '100%',
      width: '100%',
      maxHeight: '100%',
      maxWidth: '100%',
      role: 'dialog'
    });
    // testGroupDialog.afterClosed().subscribe((tgs: TestGroup[] | undefined) => {
    // });
  }
}
