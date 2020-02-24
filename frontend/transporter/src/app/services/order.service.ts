import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TransportReport, TransportReportComponent} from '../transport-report/transport-report.component';

@Injectable({
  providedIn: 'root'
})
@Injectable()
export class OrderService {

  private url = 'api/transport';

  constructor(private httpClient: HttpClient) { }

  public getAllGoods() {
    return this.httpClient.post(this.url + '/get_all_goods', {});
  }

  public getGoodsHistory(id: string) {
    return this.httpClient.post(this.url + '/get_history', { goodsID: id} );
  }

  public reportTransport(report: TransportReport) {
    return this.httpClient.post(this.url + '/report', report);
  }
}
