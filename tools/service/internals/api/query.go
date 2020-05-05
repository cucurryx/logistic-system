package api

import (
	"encoding/json"
	"fmt"
)

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
