import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { loadCountries, loadCountriesSuccess } from './country.actions';
import { ConnectServerService } from '../../services/connect-server.service';

@Injectable()
export class CountryEffects {
readonly connectServerService = inject(ConnectServerService);
  loadCountries$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCountries),
      mergeMap(() => this.connectServerService.getRequestCountry().pipe(
        // tap(() => console.log('CountryEffects')),
        map(countries => loadCountriesSuccess({ countries })),
        catchError(() => of({ type: '[Country] Load Countries Failed' }))
      ))
    )
  );

  constructor(private actions$: Actions) {}
}
