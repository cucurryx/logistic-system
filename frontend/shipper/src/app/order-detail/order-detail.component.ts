import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {OrderService} from '../services/order.service';
import {stateMap} from '../common/common';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css'],
  providers: [OrderService]
})
export class OrderDetailComponent implements OnInit {
  transactions: any[];

  constructor(private route: ActivatedRoute, private orderService: OrderService) { }

  ngOnInit(): void {
    this.getGoodsHistory();
  }

  getGoodsHistory() {
    const id = this.route.snapshot.paramMap.get('id');
    this.orderService.getGoodsHistory(id).subscribe(
      response => {
        this.transactions = (response as any).data.transactions;
      }
    );
  }

  transform(state: string) {
    return stateMap.get(state);
  }
}

