import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AuthFacade } from '@hidden-innovation/auth';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { PromptDialogComponent } from '@hidden-innovation/shared/ui/prompt-dialog';
import { GenericDialogInfo, GenericDialogPrompt } from '@hidden-innovation/shared/models';
import { UiStore } from '@hidden-innovation/shared/store';
import { BreadcrumbDefinition, BreadcrumbService } from 'xng-breadcrumb';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';
import { CreateHotToastRef, HotToastService } from '@ngneat/hot-toast';
import { fromEvent, merge, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { InfoDialogComponent } from '@hidden-innovation/shared/ui/info-dialog';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'hidden-innovation-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {

  sideBarOpen = true;
  isLoading = false;
  isTablet = false;
  isSliding = false;
  routerActiveLinkOptions = {
    exact: true
  };

  networkStatus$: Subscription = Subscription.EMPTY;
  private networkStatus: unknown;
  private toastRef?: CreateHotToastRef<unknown>;

  constructor(
    public breakpointObserver: BreakpointObserver,
    public authFacade: AuthFacade,
    private matDialog: MatDialog,
    private hotToastService: HotToastService,
    public uiStore: UiStore,
    private router: Router,
    public breadcrumbService: BreadcrumbService,
    private cdr: ChangeDetectorRef,
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

  ngOnDestroy(): void {
    this.networkStatus$.unsubscribe();
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
    this.checkNetworkStatus();
  }

  checkNetworkStatus() {
    this.networkStatus = navigator.onLine;
    this.networkStatus$ = merge(
      of(null),
      fromEvent(window, 'online'),
      fromEvent(window, 'offline')
    )
      .pipe(map(() => navigator.onLine))
      .subscribe(status => {
        this.networkStatus = status;
        if (this.networkStatus) {
          this.toastRef?.close();
          this.toastRef = this.hotToastService.success('Network Online', {
            dismissible: true,
            role: 'status'
          });
        } else {
          this.toastRef?.close();
          this.toastRef = this.hotToastService.error('Network Offline', {
            dismissible: false,
            role: 'status',
            duration: undefined
          });
        }
      });
  }


}
