import { Injectable } from '@angular/core';
import {GoodsInfo} from './goods';
import {HttpClient} from '@angular/common/http';

export class Response {
  status: number;
  message: string;
  data: string;
}

@Injectable()
export class OrderService {

  private url: string = "https://127.0.0.1:3000";

  constructor(private httpClient: HttpClient) { }

  public getAllGoods() {
    return this.httpClient.get<Response>(this.url + 'order' + '/get_all_goods');
  }

  public createOrder() {
    return null;
  }

  public getGoodsHistory() {
    return null;
  }
}
