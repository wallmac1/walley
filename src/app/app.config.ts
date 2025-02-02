import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClient, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';
import { provideStore } from '@ngrx/store';
import { userReducer } from './ngrx/user/user.reducer';
import { countryReducer } from './ngrx/country/country.reducer';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
// import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { environment } from '../environments/environment';
import { provideNativeDateAdapter } from '@angular/material/core';

// required for AoT
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideNativeDateAdapter(),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])) ,
    provideStore({ user: userReducer, countries: countryReducer }),
    importProvidersFrom(TranslateModule.forRoot({
      defaultLanguage: 'it',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })),
    // importProvidersFrom(RecaptchaV3Module),  // Importa il modulo V3
    // {
    //   provide: RECAPTCHA_V3_SITE_KEY,
    //   useValue: environment.recaptcha.siteKey,  // Fornisci la chiave di reCAPTCHA
    // }
  ]
};


