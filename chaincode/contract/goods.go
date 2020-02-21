package contract

type State string

const (
	UNPROCESSED  State = "UNPROCESSED"
	TRANSPORTING       = "TRANSPORTING"
	WAREHOUSING        = "WAREHOUSING"
	RECEIVED           = "RECEIVED"
)

type GoodsState struct {
	State            State          `json:"state"`
	OrderCreateState *OrderCreate   `json:"order_create_state"`
	TransportState   *TransportInfo `json:"transport_state"`
	WarehouseState   *WarehouseInfo `json:"warehouse_state"`
}

type OrderCreate struct {
	ID          uint64 `json:"id"`          // 物品id，64位整数
	Client      uint64 `json:"client"`      // 发货方名称
	Receiver    uint64 `json:"receiver"`    // 收货方名称
	Name        string `json:"name"`        // 物品名称
	Source      string `json:"source"`      // 出发地
	Destination string `json:"destination"` // 目的地
	Description string `json:"description"` // 物品描述
}

type TransportInfo struct {
	GoodsID   uint64     `json:"goods_id"`
	Transport *Transport `json:"transport"` // 物品经历的运输，Transport结构体中有详细定义
}

type WarehouseInfo struct {
	GoodsID         uint64           `json:"goods_id"`
	StoragePosition *StoragePosition `json:"storage_position"` // 仓储位置，该结构体具体定义在下面
}

type Transport struct {
	Principal   string `json:"principal"`   // 运输负责人
	StartTime   string `json:"start_time"`  // 发货时间
	CarID       string `json:"car_id"`      // 货车车牌号
	Source      string `json:"source"`      // 运输出发地
	Destination string `json:"destination"` // 运输目的地
}

type StoragePosition struct {
	WarehouseID   uint64 `json:"warehouse_id"`   // 仓库id
	WarehouseName uint64 `json:"warehouse_name"` // 仓库名称
	ZoneID        uint64 `json:"zone_id"`        // 仓库区域id
	SelfID        uint64 `json:"self_id"`        // 货架id
	Position      uint64 `json:"position"`       // 具体位置标号
}

func (s *GoodsState) SetOrderCreated(create *OrderCreate) {
	s.State = UNPROCESSED
	s.OrderCreateState = create
}

func (s *GoodsState) SetTransporting(info *TransportInfo) {
	s.State = TRANSPORTING
	s.TransportState = info
	s.OrderCreateState = nil
	s.WarehouseState = nil
}

func (s *GoodsState) SetWarehousing(info *WarehouseInfo) {
	s.State = WAREHOUSING
	s.WarehouseState = info
	s.TransportState = nil
	s.OrderCreateState = nil
}

func (s *GoodsState) SetReceived() {
	s.State = RECEIVED
	s.WarehouseState = nil
	s.OrderCreateState = nil
	s.TransportState = nil
}
