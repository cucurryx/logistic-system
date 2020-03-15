import { TestBed } from '@angular/core/testing';

import { OrderInterceptor } from './order.interceptor';

describe('OrderInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      OrderInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: OrderInterceptor = TestBed.inject(OrderInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
