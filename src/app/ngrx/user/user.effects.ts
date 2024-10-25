import { Injectable } from '@angular/core';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as UserActions from './user.actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ConnectServerService } from '../../services/connect-server.service';
import { Connect } from '../../classes/connect';

@Injectable()
export class UserEffects {

  loadUserInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUserInfo),
      mergeMap(() => this.connectServerService.getRequest(Connect.urlServerLaraApi, 'user/userInfo',
        {}
      )
        .pipe(
          // tap(() => console.log('loadUserInfo CountryEffects')),
          map((userInfo: any) => UserActions.loadUserInfoSuccess({ userInfo })),
          catchError(error => of(UserActions.loadUserInfoFailure({ error })))
        ))
    )
  );

  loadUserPermissions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUserPermissions),
      mergeMap(() => this.connectServerService.getRequest(Connect.urlServerLaraApi, 'user/authorizations', {})
        .pipe(
          map((permissions: any) => UserActions.loadUserPermissionsSuccess({ permissions })),
          catchError(error => of(UserActions.loadUserPermissionsFailure({ error })))
        ))
    )
  );

  constructor(
    private actions$: Actions,
    private connectServerService: ConnectServerService
  ) { }
}
