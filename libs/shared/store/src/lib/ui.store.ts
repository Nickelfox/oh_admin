import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { NavItem } from '@hidden-innovation/shared/models';
import { filter, tap } from 'rxjs/operators';
import { Test } from '@hidden-innovation/test/data-access';
import { Observable } from 'rxjs';
import { TestGroup } from '@hidden-innovation/test-group/data-access';
import { QuestionnaireExtended } from '@hidden-innovation/questionnaire/data-access';
import { ContentCore, Lesson, LessonCore } from '@hidden-innovation/pack/data-access';

export interface UiState {
  navData: {
    name: string;
    navItems: NavItem[]
  }[];
  isLoading: boolean;
  selectedTests?: Test[];
  selectedTestGroups?: TestGroup[];
  selectedQuestionnaires?: QuestionnaireExtended[];
  selectedLessons?: Lesson[];
  selectedContent?: (ContentCore | LessonCore)[];
}

@Injectable({ providedIn: 'root' })
export class UiStore extends ComponentStore<UiState> {
  readonly navItems$ = this.select(({ navData }) => navData);
  readonly isLoading$ = this.select(({ isLoading }) => isLoading);
  readonly selectedTests$: Observable<Test[]> = this.select(state => state.selectedTests || []);
  readonly testsExists$: Observable<boolean> = this.select(state => !!state.selectedTests?.length);
  readonly selectedTestGroups$: Observable<TestGroup[]> = this.select(state => state.selectedTestGroups || []);
  readonly testGroupsExists$: Observable<boolean> = this.select(state => !!state.selectedTestGroups?.length);
  readonly selectedQuestionnaires$: Observable<QuestionnaireExtended[]> = this.select(state => state.selectedQuestionnaires || []);
  readonly questionnairesExists$: Observable<boolean> = this.select(state => !!state.selectedQuestionnaires?.length);
  readonly selectedLessons$: Observable<Lesson[]> = this.select(state => state.selectedLessons || []);
  readonly lessonsExists$: Observable<boolean> = this.select(state => !!state.selectedLessons?.length);
  readonly selectedContent$: Observable<(ContentCore | LessonCore)[]> = this.select(state => state.selectedContent || []);
  readonly contentsExists$: Observable<boolean> = this.select(state => !!state.selectedContent?.length);

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

  toggleGlobalLoading = this.effect<boolean>(origin$ =>
    origin$.pipe(
      tap((input) => {
        this.patchState({
          isLoading: !!input
        });
      })
    )
  );

  constructor() {
    super({
      isLoading: false,
      navData: [
        {
          name: 'DashBoard',
          navItems: [
            { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' }
          ]
        },
        {
          name: 'Tests',
          navItems: [
            { label: 'Tests', path: '/tests', icon: 'timer' }
          ]
        },
        {
          name: 'Assessments',
          navItems: [
            { label: 'Assessments', path: '/assessments', icon: 'timeline' }
          ]
        },
        {
          name: 'Questionnaires',
          navItems: [
            { label: 'Questionnaires', path: '/questionnaire', icon: 'comment' }
          ]
        },
        {
          name: 'Packs',
          navItems: [
            { label: 'Packs', path: '/packs', icon: 'collections' }
          ]
        },
        {
          name: 'Featured',
          navItems: [
            { label: 'Featured', path: '/featured', icon: 'star' }
          ]
        },
        {
          name: 'Tags',
          navItems: [
            { label: 'Tags', path: '/tags', icon: 'style' }
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
            { label: 'Reports', path: '/reports', icon: 'show_chart' },
            { label: 'App Releases', path: '/app-release', icon: 'file_download' }
          ]
        }
      ]
    });
  }
}
