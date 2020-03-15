import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {OrderInterceptor} from './order.interceptor';

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: OrderInterceptor, multi: true },
];
