import {ChangeDetectionStrategy, Component, OnDestroy} from '@angular/core';
import {AuthFacade} from "@hidden-innovation/auth";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {MatDialog} from "@angular/material/dialog";
import {PromptDialogComponent} from "@hidden-innovation/shared/ui/prompt-dialog";
import {GenericDialogPrompt} from "@hidden-innovation/shared/models";
import {Subject} from "rxjs";
import {takeUntil} from 'rxjs/operators';
import {UiStore} from "@hidden-innovation/shared/store";

@Component({
  selector: 'hidden-innovation-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnDestroy {

  sideBarOpen = true;
  isLoading = false;
  isTablet = false;
  isSliding = false;
  private readonly destroy$ = new Subject();

  constructor(
    public breakpointObserver: BreakpointObserver,
    public authFacade: AuthFacade,
    private matDialog: MatDialog,
    public uiStore: UiStore
  ) {
    breakpointObserver.observe([
      Breakpoints.Tablet,
      Breakpoints.Handset
    ]).subscribe(result => {
      this.sideBarOpen = !result.matches;
      this.isTablet = result.matches;
    });
  }

  sideBarToggle(): void {
    if (!this.isSliding) {
      this.sideBarOpen = !this.sideBarOpen;
    }
  }

  logoutPrompt(): void {
    const dialogData: GenericDialogPrompt = {
      title: 'Log Out',
      desc: 'Are you sure you want to log out?',
      action: {
        posTitle: 'Yes',
        negTitle: 'No',
        type: 'mat-primary',
      }
    };
    const dialogRef = this.matDialog.open(PromptDialogComponent, {
      data: dialogData,
      minWidth: '25rem'
    })
    dialogRef.afterClosed().pipe(
      takeUntil(this.destroy$)
    ).subscribe((shouldUpdate: boolean) => {
      if (shouldUpdate) {
        this.authFacade.logoutLocal();
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
