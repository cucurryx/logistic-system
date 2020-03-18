import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class OrderInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const authToken = this.getToken();
    const authReq = request.clone({
      headers: request.headers.set('Authorization', 'Bearer ' + authToken)
    });
    return next.handle(authReq);
  }

  getToken() {
    let token = '';
    if (document.cookie) {
      let arr_cookie = document.cookie.split(';');
      let str_cookie_token = arr_cookie.filter(item => item.indexOf('consignee_token=') > -1);
      if (str_cookie_token.length > 0) {
        console.log(`${str_cookie_token}`);
        token = str_cookie_token[0].split('=')[1]
      }
    } else {}
    console.log(`getToken ${token}`);
    return token;
  }
}
