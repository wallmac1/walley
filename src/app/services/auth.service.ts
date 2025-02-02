import { Injectable } from '@angular/core';
import { lastValueFrom, Observable, Subject, tap } from 'rxjs';
import { ConnectServerService } from './connect-server.service';
import { Connect } from '../classes/connect'
import { Router } from '@angular/router';

import { User } from '../interfaces/user';
import { CookieService } from 'ngx-cookie-service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  serverError: string = '';
  invalidCredentials = true
  private userSubject = new Subject<User | null>();
  getInfoUserLogged(): Observable<User | null> {
    return this.userSubject.asObservable();
  }

  authorization: string = 'none';

  constructor(private connectServerService: ConnectServerService, private router: Router,
    private cookieService: CookieService) {
  }

  isLoggedIn(): boolean {
    // if (localStorage.getItem('loggedW') && localStorage.getItem('loggedW') == 'ok') {
    //   return true;
    // }
    if (localStorage.getItem('authOk') && localStorage.getItem('authOk') == 'YES') {
        return true;
      }
    return false;
  }

  private async getCsrf(): Promise<any> {
    // const request$ = this.http.get(`/api/sanctum/csrf-cookie`).pipe(take(1));
    const request$ = this.connectServerService.getRequest(Connect.urlServerLara, 'sanctum/csrf-cookie', {});
    return await lastValueFrom<any>(request$);
  }

  async loginServer(email: string, password: string, rememberMe: boolean): Promise<void> {
    this.getCsrf().then(
      (response) => {
        try {
          const response = this.connectServerService.postRequest(Connect.urlServerLara, 'login', {
            email,
            password,
          }).subscribe((response: any) => {
            localStorage.setItem('authOk', 'YES');
            this.invalidCredentials = false;
             // Verifica se il login è riuscito

          this.router.navigate(['generalMenu']);

          });


        } catch (error) {
          console.error('Errore nella chiamata al server:', error);
          this.invalidCredentials = true; // Gestione errore server
        }
      });

  }

  // async loginUser(email_value: string, password_value: string) {
  //   const esito: any = await lastValueFrom(
  //     this.connectServerService.postRequest(Connect.urlServerLaraApi, 'user/login', {
  //       email: email_value,
  //       password: password_value,
  //     })
  //   );

  //   //console.log('esito', esito);
  //   if (esito && esito.data && esito.data.authorization) {
  //     this.setToken(esito.data.authorization.token);
  //     this.setLoginIn('ok');
  //   }
  // }

  logoutServer() {
    this.connectServerService.postRequest(Connect.urlServerLara, 'logout',
      {}).subscribe((esito: any) => {
        // console.log('logout!', esito);
        localStorage.removeItem('authOk');
        // this.cookieService.delete('/');
        this.cookieService.delete('XSRF-TOKEN');
        this.cookieService.deleteAll('/');
        this.router.navigate(['/login']);
      });
  }

  // logoutUser() {
  //   return this.connectServerService.postRequest(Connect.urlServerLaraApi, `user/logout`, {}).subscribe(
  //     (esito: any) => {
  //       // console.log('logout', esito);
  //       this.removeLocalAuth();
  //       this.userSubject.next(null);
  //       //this.urlService.setInfoCurrenPage('home');
  //       this.router.navigate(['login']);
  //     }
  //   );
  // }

  getUser() {
    return this.connectServerService.getRequest<User>(Connect.urlServerLaraApi, 'user/user', {}).subscribe(
      (val: User) => {
        console.log('Response: ', val);
        if (this.isLoggedIn()) {
          // this.user$ = this.userSubject.asObservable();
          this.userSubject.next(val);
        } else {
          // this.user$ = this.userSubject.asObservable();
          this.userSubject.next(null);
        }
      });
  }

  getToken(): string | null {
    if (localStorage) {
      return localStorage.getItem('token') ? localStorage.getItem('token') : null;
    } else {
      return null;
    }
  }

  setToken(val: string) {
    localStorage.setItem('token', val);
  }

  private setLoginIn(val: string) {
    localStorage.setItem('loggedW', val);
  }

  private removeLoginIn() {
    localStorage.removeItem('loggedW');
  }

  private removeToken() {
    localStorage.removeItem('token');
  }
  public removeLocalAuth() {
    this.removeLoginIn();
    this.removeToken();
  }
}
