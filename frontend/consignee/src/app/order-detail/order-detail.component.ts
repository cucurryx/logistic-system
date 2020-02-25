import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {stateMap} from '../common/common';
import {OrderServiceService} from '../services/order-service.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css'],
  providers: [OrderServiceService]
})
export class OrderDetailComponent implements OnInit {
  transactions: any[];
  shouldSpinner: boolean;

  constructor(private route: ActivatedRoute, private orderService: OrderServiceService) { }

  ngOnInit(): void {
    this.getGoodsHistory();
    this.shouldSpinner = true;
  }

  getGoodsHistory() {
    const id = this.route.snapshot.paramMap.get('id');
    this.orderService.getGoodsHistory(id).subscribe(
      response => {
        this.shouldSpinner = false;
        this.transactions = (response as any).data.transactions;
      }
    );
  }

  transform(state: string) {
    return stateMap.get(state);
  }
}

