import { createAction, props } from '@ngrx/store';
import { Country } from '../../weco/interfaces/country';

export const loadCountries = createAction('[Country] Load Countries');
export const loadCountriesSuccess = createAction(
  '[Country] Load Countries Success',
  props<{ countries: Country[] }>()
);
