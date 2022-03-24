import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { UiStore } from '@hidden-innovation/shared/store';
import { ConstantDataService, FormValidationService } from '@hidden-innovation/shared/form-config';
import { HotToastService } from '@ngneat/hot-toast';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'hidden-innovation-create-goals',
  templateUrl: './create-goals.component.html',
  styleUrls: ['./create-goals.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateGoalsComponent implements OnInit {

  constructor(
    public router: Router,
    private titleCasePipe: TitleCasePipe,
    public uiStore: UiStore,
    public route: ActivatedRoute,
    public constantDataService: ConstantDataService,
    private hotToastService: HotToastService,
    public formValidationService: FormValidationService,
    private matDialog: MatDialog,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
  }

}
