
export class WarehouseReportRequest {
    public goods_id: string;
    public storage_position: StoragePosition;
}

class StoragePosition {
    public warehouse_id: string;
    public warehouse_name: string;
    public zone_id: string;
    public self_id: string;
    public position: string;
}