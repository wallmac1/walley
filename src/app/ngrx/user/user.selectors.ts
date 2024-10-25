import { createSelector, createFeatureSelector } from '@ngrx/store';
import { UserState } from './user.reducer';

export const selectUserState = createFeatureSelector<UserState>('user');

export const selectUserInfo = createSelector(
  selectUserState,
  (state: UserState) => state.userInfo
);

export const selectUserPermissions = createSelector(
  selectUserState,
  (state: UserState) => state.permissions
);

// Selettore per il campo `lang_code`
export const selectUserLangCode = createSelector(
  selectUserInfo,
  (userInfo) => userInfo?.lang_code || 'en'  // Usa 'en' come fallback se `lang_code` è null
);
