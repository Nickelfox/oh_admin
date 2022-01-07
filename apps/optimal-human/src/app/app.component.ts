import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthFacade } from '@hidden-innovation/auth';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { PromptDialogComponent } from '@hidden-innovation/shared/ui/prompt-dialog';
import { GenericDialogPrompt } from '@hidden-innovation/shared/models';
import { UiStore } from '@hidden-innovation/shared/store';
import { BreadcrumbDefinition, BreadcrumbService } from 'xng-breadcrumb';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'hidden-innovation-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  sideBarOpen = true;
  isLoading = false;
  isTablet = false;
  isSliding = false;
  routerActiveLinkOptions = {
    exact: true
  };

  constructor(
    public breakpointObserver: BreakpointObserver,
    public authFacade: AuthFacade,
    private matDialog: MatDialog,
    public uiStore: UiStore,
    private router: Router,
    public breadcrumbService: BreadcrumbService,
    private cdr: ChangeDetectorRef
  ) {
    breakpointObserver.observe([
      Breakpoints.Tablet,
      Breakpoints.Handset
    ]).subscribe(result => {
      this.sideBarOpen = !result.matches;
      this.isTablet = result.matches;
      this.cdr.markForCheck();
    });
  }

  sideBarToggle(): void {
    if (!this.isSliding) {
      this.sideBarOpen = !this.sideBarOpen;
    }
  }

  getPageTitle(breadCrumbThread: BreadcrumbDefinition[]): string {
    if (!breadCrumbThread.length) {
      return '--';
    }
    if (breadCrumbThread.length < 2) {
      return <string>breadCrumbThread[0].label || 'N/A';
    }
    if (breadCrumbThread.length > 1) {
      return <string>breadCrumbThread[1].label || 'N/A';
    }
    return 'N/A';
  }

  logoutPrompt(): void {
    const dialogData: GenericDialogPrompt = {
      title: 'Log Out',
      desc: 'Are you sure you want to log out?',
      action: {
        posTitle: 'Yes',
        negTitle: 'No',
        type: 'mat-primary'
      }
    };
    const dialogRef = this.matDialog.open(PromptDialogComponent, {
      data: dialogData,
      minWidth: '25rem'
    });
    dialogRef.afterClosed().subscribe((shouldUpdate: boolean) => {
      if (shouldUpdate) {
        this.authFacade.logoutLocal();
      }
    });
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.uiStore.toggleGlobalLoading(true);
          break;
        }
        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.uiStore.toggleGlobalLoading(false);
          break;
        }
        default:
          break;
      }
    });
  }
}
