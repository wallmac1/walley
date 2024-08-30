import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CookieService } from 'ngx-cookie-service';


// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   const authService = inject(AuthService);
//   const newReq = req.clone({
//     setHeaders:{
//       Accept: 'application/json',
//       Authorization: `Bearer ${authService.getToken()}`
//     },
//   });
//   //console.log('headers:', req.headers);
//   return next(newReq);
// };

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(CookieService);
  const token = cookieService.get('XSRF-TOKEN');
  //console.log('token', token);
  const newReq = req.clone({
    setHeaders:{
      Accept: 'application/json', // Aggiungi l'header desiderato
      'X-XSRF-TOKEN': token,
    },
    withCredentials: true, // Abilita l'invio di credenziali
  });
  //console.log('headers:', req.headers);
  return next(newReq);
};
