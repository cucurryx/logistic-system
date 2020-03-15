import { TestBed } from '@angular/core/testing';

import { TransporterInterceptor } from './transporter.interceptor';

describe('TransporterInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      TransporterInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: TransporterInterceptor = TestBed.inject(TransporterInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
