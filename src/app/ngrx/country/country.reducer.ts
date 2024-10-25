import { createReducer, on } from '@ngrx/store';
import { loadCountriesSuccess } from './country.actions';
import { Country } from '../../weco/interfaces/country';

export interface CountryState {
  countries: Country[];
}

export const initialState: CountryState = {
  countries: []
};

export const countryReducer = createReducer(
  initialState,
  on(loadCountriesSuccess, (state, { countries }) => ({
    ...state,
    countries
  }))
);
