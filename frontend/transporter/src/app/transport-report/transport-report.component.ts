import { Component, OnInit } from '@angular/core';
import {OrderService} from '../services/order.service';
import {FormControl} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

export class TransportReport {
  goods_id: string;
  transport: ReportDetail;
}

export class ReportDetail {
  principal: string;
  start_time: string;
  car_id: string;
  source: string;
  destination: string;
}

@Component({
  selector: 'app-transport-report',
  templateUrl: './transport-report.component.html',
  styleUrls: ['./transport-report.component.css'],
  providers: [OrderService]
})
export class TransportReportComponent implements OnInit {

  transportReport: TransportReport;
  start_date = new FormControl(new Date());

  constructor(private orderService: OrderService,
              private dialog: MatDialog) {
    this.transportReport = new TransportReport();
    this.transportReport.transport = new ReportDetail();
  }

  ngOnInit(): void {
  }

  onGoodsIdEnter(event: any) {
    this.transportReport.goods_id = event.target.value;
  }

  onPrincipalEnter(event: any) {
    this.transportReport.transport.principal = event.target.value;
  }

  onCarIdEnter(event: any) {
    this.transportReport.transport.car_id = event.target.value;
  }

  onDestinationEnter(event: any) {
    this.transportReport.transport.destination = event.target.value;
  }

  onSourceEnter(event: any) {
    this.transportReport.transport.source = event.target.value;
  }

  onCreateClick() {
    this.transportReport.transport.start_time = this.start_date.value.toString();
    this.orderService.reportTransport(this.transportReport).subscribe(
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
    public dialogRef: MatDialogRef<CreateFailDialog>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
