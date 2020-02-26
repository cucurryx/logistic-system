import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort, Sort} from '@angular/material/sort';
import {OrderService} from '../services/order.service';
import {stateMap} from '../common/common';

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
            })
          }
          this.goodsList = elements;
          this.dataSource = new MatTableDataSource<PeriodicElement>(this.goodsList);
          this.acceptData = true;
          this.dataSource.sort = this.sort;
        } catch (e) {
          this.acceptData = true;
        }
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onDetail() {
    console.log(`Detail`)
  }

  // sortData(sort: Sort) {
  //   const data = this.goodsList;
  //   if (!sort.active || sort.direction == '') {
  //     this.sortedData = data;
  //   }
  //   // @ts-ignore
  //   this.sortedData = data.sort(function(a, b) {
  //     const isAsc = sort.direction === 'asc';
  //     switch (sort.active) {
  //       case 'goods_id': return compare(a.goods_id, b.goods_id, isAsc);
  //       case 'name': return compare(a.name, b.name, isAsc);
  //       case 'status': return compare(a.status, b.status, isAsc);
  //       default: return false;
  //     }
  //   });
  // }
}
//
// function compare(a: string, b: string, isAsc: boolean) {
//   return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
// }
