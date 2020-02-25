import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {WarehouseReport} from '../warehouse-report/warehouse-report.component';


@Injectable({
  providedIn: 'root'
})
@Injectable()
export class OrderService {

  private url = 'api/warehouse';

  constructor(private httpClient: HttpClient) { }

  public getAllGoods() {
    return this.httpClient.post(this.url + '/get_all_goods', {});
  }

  public getGoodsHistory(id: string) {
    return this.httpClient.post(this.url + '/get_history', { goodsID: id} );
  }

  public reportWarehouse(report: WarehouseReport) {
    return this.httpClient.post(this.url + '/report', report);
  }
}
