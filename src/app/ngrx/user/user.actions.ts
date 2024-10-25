import { createAction, props } from '@ngrx/store';
import { PermissionsUser } from '../../interfaces/permissions-user';
import { User } from '../../pages/profile/interfaces/user';

export const loadUserInfo = createAction('[User] Load User Info');
export const loadUserInfoSuccess = createAction('[User] Load User Info Success', props<{ userInfo: User }>());
export const loadUserInfoFailure = createAction('[User] Load User Info Failure', props<{ error: any }>());

export const loadUserPermissions = createAction('[User] Load User Permissions');
export const loadUserPermissionsSuccess = createAction('[User] Load User Permissions Success', props<{ permissions: PermissionsUser }>());
export const loadUserPermissionsFailure = createAction('[User] Load User Permissions Failure', props<{ error: any }>());
