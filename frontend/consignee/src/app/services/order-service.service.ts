import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderServiceService {

  private url = 'api/consignee';

  constructor(private httpClient: HttpClient) { }

  public getAllGoods() {
    return this.httpClient.post(this.url + '/get_all_goods', {});
  }

  public getGoodsHistory(id: string) {
    return this.httpClient.post(this.url + '/get_history', { goodsID: id });
  }

  public receiveGoods(id: string) {
    return this.httpClient.post(this.url + '/receive', { goodsID: id });
  }
}
