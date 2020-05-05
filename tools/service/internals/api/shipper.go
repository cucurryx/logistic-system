package api

import (
	"encoding/json"
	"fmt"
	"github.com/golang/protobuf/ptypes/timestamp"
	"strings"
	"time"
)

type Transaction struct {
	State     *GoodsState `json:"state"`
	Timestamp string      `json:"timestamp"`
}
type HistoryResponse struct {
	Transactions []*Transaction `json:"transactions"`
}

// 订单创建接口
//func (c *LogisticContract) CreateOrder(ctx Context, requestData string) error {
//	var request CreateOrderRequest
//	if err := json.Unmarshal([]byte(requestData), &request); err != nil {
//		return fmt.Errorf("create order failed when unmarshal request data, err: %+v", err)
//	}
//
//	if value, _ := ctx.GetStub().GetState(request.ID); value != nil {
//		return fmt.Errorf("orderer with goods id: %s has been created", request.ID)
//	}
//
//	var goodsState GoodsState
//	orderCreation := OrderCreate(request)
//
//	goodsState.SetOrderCreated(&orderCreation)
//	data, err := json.Marshal(goodsState)
//	if err != nil {
//		return fmt.Errorf("json marshal failed, err: %+v", err)
//	}
//	return ctx.GetStub().PutState(request.ID, data)
//}
//


func timestampToStr(ts *timestamp.Timestamp) string {
	timeStr := time.Unix(ts.Seconds, 0).UTC().Add(8 * time.Hour).Format(time.RFC3339)
	result := strings.ReplaceAll(timeStr, "T", " ")
	result = strings.ReplaceAll(result, "Z", " ")
	return result
}
