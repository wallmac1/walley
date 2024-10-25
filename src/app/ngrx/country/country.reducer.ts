import { createReducer, on } from '@ngrx/store';
import { Country } from '../../interfaces/country';
import { loadCountriesSuccess } from './country.actions';

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
