import { Injectable } from '@angular/core';
import { lastValueFrom, Observable, Subject, tap } from 'rxjs';
import { ConnectServerService } from './connect-server.service';
import { Connect } from '../classes/connect'
import { Router } from '@angular/router';

import { User } from '../interfaces/user';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject = new Subject<User | null>();
  getInfoUserLogged(): Observable<User | null> {
    return this.userSubject.asObservable();
  }

  authorization: string = 'none';

  constructor(private connectServerService: ConnectServerService, private router: Router,
    private cookieService: CookieService) {
  }

  isLoggedIn(): boolean {
    if (localStorage.getItem('loggedW') && localStorage.getItem('loggedW') == 'ok') {
      return true;
    }
    return false;
  }

  private async getCsrf(): Promise<any> {
    // const request$ = this.http.get(`/api/sanctum/csrf-cookie`).pipe(take(1));
    const request$ = this.connectServerService.getRequest(Connect.urlServerLara, 'sanctum/csrf-cookie', {});
    return await lastValueFrom<any>(request$);
  }

  loginServer(email_send: string, password_send: string, rememberme: boolean) {
    this.getCsrf().then(
      (response) => {
        // console.log('prima risposta:', response);
        // this.http.post(`${this.urlServerWall}/register`, {
        this.connectServerService.postRequest(Connect.urlServerLara, 'login', {
          email: email_send,
          password: password_send,
        }).subscribe((esito: any) => {
          // console.log('login!', esito);
          localStorage.setItem('authOk', 'YES');
          this.router.navigate(['/newTicket']);
        });
      }
    );
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
