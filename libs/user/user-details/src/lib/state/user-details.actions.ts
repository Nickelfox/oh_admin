import { createAction, props } from '@ngrx/store';
import { UserDetailsStateModel } from '../models/user-details.interface';

export const getUserDetails = createAction('[UserDetails/API] USER_DETAILS', props<{ id: number }>());
export const getUserDetailsSuccess = createAction('[UserDetails/API] USER_DETAILS_SUCCESS', props<UserDetailsStateModel>());
export const getUserDetailsFail = createAction('[UserDetails/API] USER_DETAILS_FAIL', props<Partial<UserDetailsStateModel>>());
