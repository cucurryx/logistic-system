import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {TransporterInterceptor} from './transporter.interceptor';

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: TransporterInterceptor, multi: true },
];
