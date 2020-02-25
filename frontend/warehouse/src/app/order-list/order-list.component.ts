import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {stateMap} from '../common/common';
import {OrderService} from '../services/order-service.service';

export class PeriodicElement {
  goods_id: string;
  name: string;
  status: string;
  placeholder: string;
}

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
  providers: [ OrderService ]
})
export class OrderListComponent implements OnInit {

  displayedColumns: string[] = ['goods_id', 'name', 'status', 'placeholder'];
  dataSource: MatTableDataSource<PeriodicElement>;
  goodsList: PeriodicElement[];
  acceptData: boolean;

  constructor(private orderService: OrderService) {}

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit() {
    this.acceptData = false;
    this.getAllGoods();
  }

  getAllGoods() {
    this.orderService.getAllGoods().subscribe(
      response => {
        try {
          const data = (response as any).data;
          const elements = [];
          for (const goods of data) {
            elements.push({
              goods_id: goods.id,
              name: goods.name,
              status: stateMap.get(goods.state),
            });
          }
          this.goodsList = elements;
          this.acceptData = true;
          this.dataSource = new MatTableDataSource<PeriodicElement>(this.goodsList);
          this.dataSource.sort = this.sort;
        } catch (e) {
          console.error(`getAllGoods failed: ${e}`);
          this.acceptData = true;
        }
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
