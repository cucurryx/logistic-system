export class Transaction {
  timestamp: string;
  state: TransportState;
}

class TransactionState {
  state: string;
  orderCreateState: OrderCreateState;
  transportState: TransportState;
  warehouseState: WarehouseState;
}

export class OrderCreateState {
  id: string;
  name: string;
  client: string;
  receiver: string;
  source: string;
  destination: string;
  description: string;
}

export class TransportState {}

export class WarehouseState {}
