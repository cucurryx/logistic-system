export class ReportTransportRequest {
    public goods_id: string;     // 物品id
    public transport: Transport; // 运输详情
}

export class Transport {
    public principal: string;   //运输负责人
    public start_time: string;  //发货时间
    public car_id: string;      // 货车车牌号
    public source: string;      // 运输出发地
    public destination: string; // 运输目的地
}
