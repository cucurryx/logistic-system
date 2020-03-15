import { Component, OnInit } from '@angular/core';
import {OrderService} from '../services/order-service.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-warehouse-report',
  templateUrl: './warehouse-report.component.html',
  styleUrls: ['./warehouse-report.component.css'],
  providers: [OrderService]
})
export class WarehouseReportComponent implements OnInit {

  report: WarehouseReport;

  constructor(private orderService: OrderService,
              private dialog: MatDialog) {
    this.report = new WarehouseReport();
    this.report.storage_position = new StoragePosition();
  }

  ngOnInit(): void {
  }

  onGoodsIdEnter(event: any) {
    this.report.goods_id = event.target.value;
  }

  onWarehouseIdEnter(event: any) {
    this.report.storage_position.warehouse_id = event.target.value;
  }

  onWarehouseNameEnter(event: any) {
    this.report.storage_position.warehouse_name = event.target.value;
  }

  onZoneIdEnter(event: any) {
    this.report.storage_position.zone_id = event.target.value;

  }

  onSelfIdEnter(event: any) {
    this.report.storage_position.self_id = event.target.value;

  }

  onPositionEnter(event: any) {
    this.report.storage_position.position = event.target.value;
  }

  onReport() {
    this.orderService.reportWarehouse(this.report).subscribe(
      response => {
        const code = (response as any).code;
        if (code == 200) {
          this.dialog.open(CreateSuccessDialog);
        } else {
          this.dialog.open(CreateFailDialog);
        }
      }
    )
  }
}

export class WarehouseReport {
  goods_id: string;
  storage_position: StoragePosition;
}

export class StoragePosition {
  warehouse_id: string;
  warehouse_name: string;
  zone_id: string;
  self_id: string;
  position: string;
}

@Component({
  selector: 'create-fail-dialog',
  templateUrl: 'create-fail-dialog.html',
})
export class CreateFailDialog {

  constructor(
    public dialogRef: MatDialogRef<CreateFailDialog>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}


@Component({
  selector: 'create-success-dialog',
  templateUrl: 'create-success-dialog.html',
})
export class CreateSuccessDialog {

  constructor(
    public dialogRef: MatDialogRef<CreateSuccessDialog>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
