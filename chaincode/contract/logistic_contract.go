package contract

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type Context contractapi.TransactionContextInterface

type LogisticContract struct {
	contractapi.Contract
}

func (c *LogisticContract) Instantiate() {
	fmt.Print("Instantiating contract")
}

// 订单创建接口
func (c *LogisticContract) CreateOrder(ctx Context, requestData []byte) error {
	var request CreateOrderRequest
	if err := json.Unmarshal(requestData, &request); err != nil {
		return fmt.Errorf("create order failed when unmarshal request data, err: %+v", err)
	}

	// this order shouldn't exist in world state
	if _, err := ctx.GetStub().GetState(string(request.ID)); err == nil {
		return fmt.Errorf("orderer with goods id: %d has been created", request.ID)
	}

	var goodsState GoodsState
	orderCreation := OrderCreate(request)

	goodsState.SetOrderCreated(&orderCreation)
	data, err := json.Marshal(goodsState)
	if err != nil {
		return fmt.Errorf("json marshal failed, err: %+v", err)
	}
	return ctx.GetStub().PutState(string(request.ID), data)
}

// 运输信息录入接口
func (c *LogisticContract) PutTransportInfo(ctx Context, requestData []byte) error {
	var request PutTransportInfoRequest
	if err := json.Unmarshal(requestData, &request); err != nil {
		return fmt.Errorf("put transport info failed when unmarshal request data, err: %+v", err)
	}

	data, err := ctx.GetStub().GetState(string(request.GoodsID))
	if err != nil {
		return err
	}

	var goodsState GoodsState
	if err := json.Unmarshal(data, &goodsState);  err != nil {
		return err
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
	return ctx.GetStub().PutState(string(request.GoodsID), data)
}

// 仓储信息录入接口
func (c *LogisticContract) PutWarehouseInfo(ctx Context, requestData []byte) error {
	var request PutWarehouseInfoRequest
	if err := json.Unmarshal(requestData, &request); err != nil {
		return fmt.Errorf("put warehouse info failed when unmarshal request data, err: %+v", err)
	}

	data, err := ctx.GetStub().GetState(string(request.GoodsID))
	if err != nil {
		return err
	}

	var goodsState GoodsState
	if err := json.Unmarshal(data, &goodsState);  err != nil {
		return err
	}

	if goodsState.State != TRANSPORTING  {
		return fmt.Errorf("goods' state is TRANSPORTING")
	}

	warehouseInfo := WarehouseInfo(request)
	goodsState.SetWarehousing(&warehouseInfo)

	data, err = json.Marshal(goodsState)
	if err != nil {
		return fmt.Errorf("json marshal failed, err: %+v", err)
	}
	return ctx.GetStub().PutState(string(request.GoodsID), data)
}

// 确认收货接口
func (c *LogisticContract) ReceiveGoods(ctx Context, id uint64) error {
	data, err := ctx.GetStub().GetState(string(id))
	if err != nil {
		return err
	}
	var goodsState GoodsState
	if err := json.Unmarshal(data, &goodsState); err != nil {
		return err
	}

	if goodsState.State !=  TRANSPORTING {
		return fmt.Errorf("can't receive goods because goods' state is not TRANSPORTING")
	}
	goodsState.State = RECEIVED
	goodsState.TransportState = nil
	goodsState.OrderCreateState = nil
	goodsState.WarehouseState = nil

	data, err = json.Marshal(goodsState)
	if err != nil {
		return err
	}
	return ctx.GetStub().PutState(string(id), data)
}

// 获取物件当前状态
func (c *LogisticContract) GetGoodsInfo(ctx Context, id uint64) (*GoodsState, error) {
	data, err := ctx.GetStub().GetState(string(id))
	if err != nil {
		return nil, err
	}

	var goodsState GoodsState
	if err := json.Unmarshal(data, &goodsState); err != nil {
		return nil, err
	}

	return &goodsState, nil
}

// 获取物件transaction记录
func (c *LogisticContract) GetGoodsHistory(ctx Context, id uint64) ([]*GoodsState, error) {
	return nil, nil
}
