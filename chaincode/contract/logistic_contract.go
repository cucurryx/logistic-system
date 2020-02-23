package contract

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/golang/protobuf/ptypes/timestamp"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type Context contractapi.TransactionContextInterface

type LogisticContract struct {
	contractapi.Contract
}

type Transaction struct {
	State     *GoodsState `json:"state"`
	Timestamp string      `json:"timestamp"`
}
type HistoryResponse struct {
	Transactions []*Transaction `json:"transactions"`
}

func (c *LogisticContract) Instantiate() {
	fmt.Print("Instantiating contract")
}

// 订单创建接口
func (c *LogisticContract) CreateOrder(ctx Context, requestData string) error {
	var request CreateOrderRequest
	if err := json.Unmarshal([]byte(requestData), &request); err != nil {
		return fmt.Errorf("create order failed when unmarshal request data, err: %+v", err)
	}

	if value, _ := ctx.GetStub().GetState(request.ID); value != nil {
		return fmt.Errorf("orderer with goods id: %s has been created", request.ID)
	}

	var goodsState GoodsState
	orderCreation := OrderCreate(request)

	goodsState.SetOrderCreated(&orderCreation)
	data, err := json.Marshal(goodsState)
	if err != nil {
		return fmt.Errorf("json marshal failed, err: %+v", err)
	}
	return ctx.GetStub().PutState(request.ID, data)
}

// 运输信息录入接口
func (c *LogisticContract) PutTransportInfo(ctx Context, requestData string) error {
	var request PutTransportInfoRequest
	if err := json.Unmarshal([]byte(requestData), &request); err != nil {
		return fmt.Errorf("put transport info failed when unmarshal request data, err: %+v", err)
	}

	data, err := ctx.GetStub().GetState(request.GoodsID)
	if err != nil {
		return fmt.Errorf("PutTransportInfo GetState failed with id: %s, err: %+v", request.GoodsID, err)
	}

	var goodsState GoodsState
	if err := json.Unmarshal(data, &goodsState); err != nil {
		return fmt.Errorf("PutTransportInfo unmarshal goodsState failed, data: %+v, err: %+v", data, err)
	}

	if goodsState.State != UNPROCESSED && goodsState.State != WAREHOUSING {
		return fmt.Errorf("goods' state is  UNPROCESSED or WAREHOUSING")
	}

	transportInfo := TransportInfo(request)
	goodsState.SetTransporting(&transportInfo)

	data, err = json.Marshal(goodsState)
	if err != nil {
		return fmt.Errorf("json marshal failed, err: %+v", err)
	}
	return ctx.GetStub().PutState(request.GoodsID, data)
}

// 仓储信息录入接口
func (c *LogisticContract) PutWarehouseInfo(ctx Context, requestData string) error {
	var request PutWarehouseInfoRequest
	if err := json.Unmarshal([]byte(requestData), &request); err != nil {
		return fmt.Errorf("put warehouse info failed when unmarshal request data, err: %+v", err)
	}

	data, err := ctx.GetStub().GetState(request.GoodsID)
	if err != nil {
		return fmt.Errorf("PutWarehouseInfo GetState failed with id: %s, err: %+v", request.GoodsID, err)
	}

	var goodsState GoodsState
	if err := json.Unmarshal(data, &goodsState); err != nil {
		return fmt.Errorf("PutTransportInfo unmarshal failed, data: %+v, err: %+v", data, err)
	}

	if goodsState.State != TRANSPORTING {
		return fmt.Errorf("goods' state is TRANSPORTING")
	}

	warehouseInfo := WarehouseInfo(request)
	goodsState.SetWarehousing(&warehouseInfo)

	data, err = json.Marshal(goodsState)
	if err != nil {
		return fmt.Errorf("json marshal failed, err: %+v", err)
	}
	return ctx.GetStub().PutState(request.GoodsID, data)
}

// 确认收货接口
func (c *LogisticContract) ReceiveGoods(ctx Context, id string) error {
	data, err := ctx.GetStub().GetState(id)
	if err != nil {
		return err
	}
	var goodsState GoodsState
	if err := json.Unmarshal(data, &goodsState); err != nil {
		return err
	}

	if goodsState.State != TRANSPORTING {
		return fmt.Errorf("can't receive goods because goods' state is not TRANSPORTING")
	}
	goodsState.SetReceived()

	data, err = json.Marshal(goodsState)
	if err != nil {
		return err
	}
	return ctx.GetStub().PutState(string(id), data)
}

// 获取物件当前状态
func (c *LogisticContract) GetGoodsInfo(ctx Context, id string) (GoodsState, error) {
	data, err := ctx.GetStub().GetState(id)
	if err != nil {
		return GoodsState{}, fmt.Errorf("GetGoodsInfo GetState failed, id: %s, err: %+v", id, err)
	}
	var goodsState GoodsState
	if err := json.Unmarshal(data, &goodsState); err != nil {
		return GoodsState{}, fmt.Errorf("GetGoodsInfo unmarshal json failed, data: %+v, err: %+v", data, err)
	}
	return goodsState, nil
}

// 获取物件transaction记录
func (c *LogisticContract) GetGoodsHistory(ctx Context, id string) (HistoryResponse, error) {
	histories, err := ctx.GetStub().GetHistoryForKey(id)
	if err != nil {
		return HistoryResponse{}, fmt.Errorf("GetGoodsHistory GetHistoryForKey failed, id: %s, err: %+v", id, err)
	}

	var response HistoryResponse
	for histories.HasNext() {
		history, err := histories.Next()
		if err != nil {
			return HistoryResponse{}, err
		}

		var goodsState GoodsState
		if err := json.Unmarshal(history.GetValue(), &goodsState); err != nil {
			return HistoryResponse{}, err
		}

		response.Transactions = append(response.Transactions,
			&Transaction{
				State:     &goodsState,
				Timestamp: timestampToStr(history.GetTimestamp()),
			})
	}
	return response, nil
}

func (c *LogisticContract) GetAllGoodsInfo(ctx Context) ([]GoodsState, error) {
	iter, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, fmt.Errorf("GetAllGoodsInfo failed, err: %+v", err)
	}

	var goodsList []GoodsState
	for iter.HasNext() {
		result, err := iter.Next()
		if err != nil {
			return nil, fmt.Errorf("GetAllGoodsInfo iter.Next() failed, err: %+v", err)
		}

		var goodsState GoodsState
		if err := json.Unmarshal(result.GetValue(), &goodsState); err != nil {
			return nil, fmt.Errorf("GetAllGoodsInfo unmarshal value failed, key:%s, value:%+v, err: %+v", result.GetKey(), result.GetValue, err)
		}

		goodsList = append(goodsList, goodsState)
	}

	return goodsList, nil
}

func (c *LogisticContract) GetState(ctx Context, key string) (string, error) {
	value, err := ctx.GetStub().GetState(key)
	if err != nil {
		return "", fmt.Errorf("GetState error, err: %+v", err)
	}
	return string(value), nil
}

func (c *LogisticContract) PutState(ctx Context, key, value string) error {
	if err := ctx.GetStub().PutState(key, []byte(value)); err != nil {
		return fmt.Errorf("PutState error, err: %+v", err)
	} else {
		return nil
	}
}

func timestampToStr(ts *timestamp.Timestamp) string {
	tm := time.Unix(ts.Seconds, 0)
	return tm.Format("2006-01-02 03:04:05 PM")
}
