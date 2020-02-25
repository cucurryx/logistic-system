import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {OrderService} from '../services/order.service';

export class OrderCreate {
  id: string;
  name: string;
  client: string;
  receiver: string;
  source: string;
  destination: string;
  description: string;
}

@Component({
  selector: 'app-order-create',
  templateUrl: './order-create.component.html',
  styleUrls: ['./order-create.component.css'],
  providers: [ OrderService ]
})
export class OrderCreateComponent implements OnInit {

  private orderCreate: OrderCreate;
  constructor(private orderService: OrderService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.orderCreate = new OrderCreate();
  }

  onNoClick(): void {
  }

  onEnter(value: string) {

  }

  onGoodsIdEnter(event: any) {
    this.orderCreate.id = event.target.value;
  }

  onGoodsNameEnter(event: any) {
    this.orderCreate.name = event.target.value;
  }

  onDescriptionEnter(event: any) {
    this.orderCreate.description = event.target.value;
  }

  onClientEnter(event: any) {
    this.orderCreate.client = event.target.value;
  }

  onReceiverEnter(event: any) {
    this.orderCreate.receiver = event.target.value;
  }

  onSourceEnter(event: any) {
    this.orderCreate.source = event.target.value;
  }

  onDestinationEnter(event: any) {
    this.orderCreate.destination = event.target.value;
  }

  onCancelClick() {

  }

  onCreateClick() {
    if (this.orderCreate.id == '' || this.orderCreate.name == '') {
      this.dialog.open(InvalidDataDialog);
    }
    console.log(`${JSON.stringify(this.orderCreate)}`);
    this.orderService.createOrder(this.orderCreate).subscribe(
      response => {
        const code = (response as any).code;
        if (code == 200) {
          console.log('create success');
          this.dialog.open(CreateSuccessDialog);
        } else {
          console.log('create failed');
          this.dialog.open(CreateFailDialog);
        }
      }
    );
  }
}

@Component({
  selector: 'invalid-data-dialog',
  templateUrl: 'invalid-data-dialog.html',
})
export class InvalidDataDialog {
  constructor() {}
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
