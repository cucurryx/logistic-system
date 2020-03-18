import { Inject, Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { CanActivate, Router } from '@angular/router';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {
   httpOptions = {
     headers: new HttpHeaders({
       'Content-Type':  'application/json',
       'Authorization': 'my-auth-token'
     })
   };

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  canActivate(): Observable<boolean> | boolean {
    if (document.cookie.indexOf('transporter_token=') > -1) {
      return true;
    } else {
      this.router.navigate(['/login']).then(r => console.log(`${r}`));
      return false;
    }
  }

  login(data: any): Observable<any> {
    const loginUrl = '/api/login';
    return this.http.post(loginUrl, data).pipe(catchError(AuthService.handleError));
  }

  logout() {
    const logoutUrl = '/api/logout';
    this.http.post(logoutUrl, {});
    this.removeToken();
    this.router.navigate(['/login']).then(r => console.log(`${r}`));
  }

  register(data: any): Observable<any> {
    const registerUrl = '/api/register';
    return this.http.post(registerUrl, data);
  }

  setToken(t: string) {
    document.cookie = `transporter_token=${t}`;
    this.httpOptions.headers.set('Authorization', 'Bear ' + t);
  }

  getCurrUser() {
    const getCurrUserUrl = '/api/curr';
    return this.http.post(getCurrUserUrl, {});
  }

  getToken() {
    let token = '';
    if (document.cookie) {
      let arr_cookie = document.cookie.split(';');
      let str_cookie_token = arr_cookie.filter(item => item.indexOf('transporter_token=') > -1);
      if (str_cookie_token.length > 0) {
        token = str_cookie_token[0].split('=')[1]
      }
    } else {}
    return token;
  }

  removeToken() {
    document.cookie = "transporter_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }

  private static handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      `error: ${error.error}`);
  };
}
