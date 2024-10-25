import { createReducer, on } from '@ngrx/store';
import * as UserActions from './user.actions';
import { PermissionsUser } from '../../interfaces/permissions-user';
import { User } from '../../pages/profile/interfaces/user';

export interface UserState {
  userInfo: User | null;
  permissions: PermissionsUser | null;
  error: string | null;
}

export const initialState: UserState = {
  userInfo: null,
  permissions: null,
  error: null,
};

export const userReducer = createReducer(
  initialState,
  on(UserActions.loadUserInfoSuccess, (state, { userInfo }) => ({ ...state, userInfo })),
  on(UserActions.loadUserInfoFailure, (state, { error }) => ({ ...state, error })),
  on(UserActions.loadUserPermissionsSuccess, (state, { permissions }) => ({ ...state, permissions })),
  on(UserActions.loadUserPermissionsFailure, (state, { error }) => ({ ...state, error }))
);
