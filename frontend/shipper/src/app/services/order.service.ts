import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {OrderCreate} from '../order-create/order-create.component';
import {Subscribable} from 'rxjs';

export class Response {
  status: number;
  message: string;
  data: string;
}

@Injectable()
export class OrderService {

  private url: string = "api/order";

  constructor(private httpClient: HttpClient) { }

  public getAllGoods() {
    return this.httpClient.post(this.url + '/get_all_goods', {});
  }

  public createOrder(orderCreate: OrderCreate) {
    return this.httpClient.post(this.url + '/create', orderCreate);
  }

  public getGoodsHistory(id: string): Subscribable<any> {
    return this.httpClient.post(this.url + '/get_history', { goodsID: id} );
  }
}
