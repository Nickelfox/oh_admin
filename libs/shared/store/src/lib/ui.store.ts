import {Injectable} from '@angular/core';
import {ComponentStore} from '@ngrx/component-store';
import {GenericDialogPrompt, NavItem, PackContentTypeEnum} from '@hidden-innovation/shared/models';
import {filter, tap} from 'rxjs/operators';
import {Test} from '@hidden-innovation/test/data-access';
import {Observable} from 'rxjs';
import {TestGroup} from '@hidden-innovation/test-group/data-access';
import {QuestionnaireExtended} from '@hidden-innovation/questionnaire/data-access';
import {ContentCore, Lesson, LessonCore, Pack} from '@hidden-innovation/pack/data-access';
import {PromptDialogComponent} from '@hidden-innovation/shared/ui/prompt-dialog';
import {TitleCasePipe} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import {GoalAnswer} from '@hidden-innovation/goals/data-access';
import {SportActivitiesAnswer} from "@hidden-innovation/sports-activities/data-access";

export interface UiState {
  navData: {
    name: string;
    navItems: NavItem[]
  }[];
  isLoading: boolean;
  selectedTests?: Test[];
  selectedTestGroups?: TestGroup[];
  selectedQuestionnaires?: QuestionnaireExtended[];
  selectedPacks?: Pack[];
  selectedLessons?: Lesson[];
  selectedContent?: (ContentCore | LessonCore)[];
  selectedSportActivitiesAns?: SportActivitiesAnswer[];
  selectedGoalAns?: GoalAnswer[];
}

const initialState: UiState = {
  isLoading: false,
  navData: [
    {
      name: 'DashBoard',
      navItems: [
        {label: 'Dashboard', path: '/dashboard', icon: 'dashboard'}
      ]
    },
    {
      name: 'Tests',
      navItems: [
        {label: 'Tests', path: '/tests', icon: 'timer'}
      ]
    },
    {
      name: 'Assessments',
      navItems: [
        {label: 'Assessments', path: '/assessments', icon: 'timeline'}
      ]
    },
    {
      name: 'Questionnaires',
      navItems: [
        {label: 'Questionnaires', path: '/questionnaire', icon: 'comment'}
      ]
    },
    {
      name: 'Packs',
      navItems: [
        {label: 'Packs', path: '/packs', icon: 'collections'}
      ]
    },
    {
      name: 'Featured',
      navItems: [
        {label: 'Featured', path: '/featured', icon: 'star'}
      ]
    },
    {
      name: 'Tags',
      navItems: [
        {label: 'Tags', path: '/tags', icon: 'style'}
      ]
    },

    {
      name: 'Admin',
      navItems: [
        {
          label: 'Users',
          path: `/users`,
          icon: 'supervisor_account'
        },
        // { label: 'Reports', path: '/reports', icon: 'show_chart' },
        // { label: 'App Releases', path: '/app-release', icon: 'file_download' }
      ]
    },
    {
      name: 'User Insights',
      navItems: [
        {label: 'Goals', path: '/goals', icon: 'beenhere'},
        {label: 'Interest', path: '#', icon: 'interests'},
        {label: 'Sport/Activities', path: '/sports-activities', icon: 'sports_score'}
      ]
    },
  ]
};

@Injectable({providedIn: 'root'})
export class UiStore extends ComponentStore<UiState> {
  readonly navItems$ = this.select(({navData}) => navData);
  readonly isLoading$ = this.select(({isLoading}) => isLoading);
  readonly selectedTests$: Observable<Test[]> = this.select(state => state.selectedTests || []);
  readonly selectedPacks$: Observable<Pack[]> = this.select(state => state.selectedPacks || []);
  readonly testsExists$: Observable<boolean> = this.select(state => !!state.selectedTests?.length);
  readonly packsExists$: Observable<boolean> = this.select(state => !!state.selectedPacks?.length);
  readonly selectedTestGroups$: Observable<TestGroup[]> = this.select(state => state.selectedTestGroups || []);
  readonly testGroupsExists$: Observable<boolean> = this.select(state => !!state.selectedTestGroups?.length);
  readonly selectedQuestionnaires$: Observable<QuestionnaireExtended[]> = this.select(state => state.selectedQuestionnaires || []);
  readonly questionnairesExists$: Observable<boolean> = this.select(state => !!state.selectedQuestionnaires?.length);
  readonly selectedLessons$: Observable<Lesson[]> = this.select(state => state.selectedLessons || []);
  readonly lessonsExists$: Observable<boolean> = this.select(state => !!state.selectedLessons?.length);
  readonly selectedContent$: Observable<(ContentCore | LessonCore)[]> = this.select(state => state.selectedContent || []);
  readonly contentsExists$: Observable<boolean> = this.select(state => !!state.selectedContent?.length);
  readonly selectedGoalAns$: Observable<GoalAnswer[]> = this.select(state => state.selectedGoalAns || []);
  readonly sportActivitiesAnswer$: Observable<SportActivitiesAnswer[]> = this.select(state => state.selectedSportActivitiesAns || []);

  removeContent$ = this.effect<ContentCore | LessonCore>(origin$ =>
    origin$.pipe(
      filter(content => !!this.get().selectedContent?.find(value => value.contentId === content.contentId && value.type === content.type)),
      tap((content) => {
        const selectedContent = this.get().selectedContent?.find(value => value.contentId === content.contentId && value.type === content.type);
        if (selectedContent) {
          this.patchState({
            selectedContent: [
              ...this.get().selectedContent?.filter(c => c.contentId !== selectedContent.contentId || c.type !== selectedContent.type) ?? []
            ]
          });
        }
      })
    )
  );

  removeTest$ = this.effect<number>(origin$ =>
    origin$.pipe(
      filter(id => !!this.get().selectedTests?.find(value => value.id === id)),
      tap((id) => {
        const selectedTest = this.get().selectedTests?.find(value => value.id === id);
        if (selectedTest) {
          this.patchState({
            selectedTests: [
              ...this.get().selectedTests?.filter(t => t.id !== selectedTest.id) ?? []
            ]
          });
        }
      })
    )
  );

  removeTestGroup$ = this.effect<number>(origin$ =>
    origin$.pipe(
      filter(id => !!this.get().selectedTestGroups?.find(value => value.id === id)),
      tap((id) => {
        const selectedTestGroup = this.get().selectedTestGroups?.find(value => value.id === id);
        if (selectedTestGroup) {
          this.patchState({
            selectedTestGroups: [
              ...this.get().selectedTestGroups?.filter(tg => tg.id !== selectedTestGroup.id) ?? []
            ]
          });
        }
      })
    )
  );

  removeQuestionnaire$ = this.effect<number>(origin$ =>
    origin$.pipe(
      filter(id => !!this.get().selectedQuestionnaires?.find(value => value.id === id)),
      tap((id) => {
        const selectedQ = this.get().selectedQuestionnaires?.find(value => value.id === id);
        if (selectedQ) {
          this.patchState({
            selectedQuestionnaires: [
              ...this.get().selectedQuestionnaires?.filter(q => q.id !== selectedQ.id) ?? []
            ]
          });
        }
      })
    )
  );

  removePack$ = this.effect<number>(origin$ =>
    origin$.pipe(
      filter(id => !!this.get().selectedPacks?.find(value => value.id === id)),
      tap((id) => {
        const selectedPack = this.get().selectedPacks?.find(value => value.id === id);
        if (selectedPack) {
          this.patchState({
            selectedPacks: [
              ...this.get().selectedPacks?.filter(pack => pack.id !== selectedPack.id) ?? []
            ]
          });
        }
      })
    )
  );


  toggleGlobalLoading = this.effect<boolean>(origin$ =>
    origin$.pipe(
      tap((input) => {
        this.patchState({
          isLoading: !!input
        });
      })
    )
  );

  constructor(
    private titleCasePipe: TitleCasePipe,
    private matDialog: MatDialog
  ) {
    super(initialState);
  }

  deleteContentPrompt(type: PackContentTypeEnum, id: number): void {
    const contentType: string = type === PackContentTypeEnum.SINGLE ? 'TEST SINGLE' : type;
    const dialogData: GenericDialogPrompt = {
      title: `Remove ${this.titleCasePipe.transform(contentType)}?`,
      desc: `Are you sure you want to remove this ${this.titleCasePipe.transform(contentType)} item from Pack?`,
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
    dialogRef.afterClosed().subscribe((proceed: boolean) => {
      if (proceed) {
        switch (type) {
          case PackContentTypeEnum.SINGLE:
            this.removeTest$(id);
            break;
          case PackContentTypeEnum.GROUP:
            this.removeTestGroup$(id);
            break;
          case PackContentTypeEnum.QUESTIONNAIRE:
            this.removeQuestionnaire$(id);
            break;
          case PackContentTypeEnum.PACK:
            this.removePack$(id);
        }
      }
    });
  }

  deleteSelectedContentPrompt(content: ContentCore | LessonCore): void {
    const contentType: string = content.type === PackContentTypeEnum.SINGLE ? 'TEST SINGLE' : content.type;
    const dialogData: GenericDialogPrompt = {
      title: `Remove ${contentType}`,
      desc: `Are you sure you want to remove this ${this.titleCasePipe.transform(contentType)}?`,
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
    dialogRef.afterClosed().subscribe((proceed: boolean) => {
      if (proceed) {
        this.removeContent$(content);
      }
    });
  }
}
