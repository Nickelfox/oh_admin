import {createAction, props} from '@ngrx/store';

export const persistLoadState = createAction('[Settings] Persist Load',
  props<{ loaded: boolean }>()
)
