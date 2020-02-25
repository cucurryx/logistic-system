import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {stateMap} from '../common/common';
import {OrderServiceService} from '../services/order-service.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

export class PeriodicElement {
  goods_id: string;
  name: string;
  status: string;
  placeholder: string;
  placeholder2: string;
}

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
  providers: [ OrderServiceService ]
})
export class OrderListComponent implements OnInit {

  displayedColumns: string[] = ['goods_id', 'name', 'status', 'placeholder', 'placeholder2'];
  dataSource: MatTableDataSource<PeriodicElement>;
  goodsList: PeriodicElement[];
  acceptData: boolean;

  constructor(private orderService: OrderServiceService,
              private dialog: MatDialog) {}

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

  onReceive(id: string) {
    this.orderService.receiveGoods(id).subscribe(
      response => {
        const code = (response as any).code;
        if (code == 200) {
          this.dialog.open(ReceiveSuccessDialog).afterClosed().subscribe(
            _ => this.ngOnInit()
          );
        } else {
          this.dialog.open(ReceiveFailDialog).afterClosed().subscribe(
            _ => this.ngOnInit()
          );
        }
      }
    );
  }
}



@Component({
  selector: 'receive-fail-dialog',
  templateUrl: 'receive-fail-dialog.html',
})
export class ReceiveFailDialog {

  constructor(
    public dialogRef: MatDialogRef<ReceiveFailDialog>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}


@Component({
  selector: 'receive-success-dialog',
  templateUrl: 'receive-success-dialog.html',
})
export class ReceiveSuccessDialog {

  constructor(
    public dialogRef: MatDialogRef<ReceiveSuccessDialog>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
