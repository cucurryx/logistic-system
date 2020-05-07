package api

// 运输信息录入接口
//func (c *LogisticContract) PutTransportInfo(ctx Context, requestData string) error {
//	var request PutTransportInfoRequest
//	if err := json.Unmarshal([]byte(requestData), &request); err != nil {
//		return fmt.Errorf("put transport info failed when unmarshal request data, err: %+v", err)
//	}
//
//	data, err := ctx.GetStub().GetState(request.GoodsID)
//	if err != nil {
//		return fmt.Errorf("PutTransportInfo GetState failed with id: %s, err: %+v", request.GoodsID, err)
//	}
//
//	var goodsState GoodsState
//	if err := json.Unmarshal(data, &goodsState); err != nil {
//		return fmt.Errorf("PutTransportInfo unmarshal goodsState failed, data: %+v, err: %+v", data, err)
//	}
//
//	if goodsState.State != UNPROCESSED && goodsState.State != WAREHOUSING {
//		return fmt.Errorf("goods' state is  UNPROCESSED or WAREHOUSING")
//	}
//
//	transportInfo := TransportInfo(request)
//	goodsState.SetTransporting(&transportInfo)
//
//	data, err = json.Marshal(goodsState)
//	if err != nil {
//		return fmt.Errorf("json marshal failed, err: %+v", err)
//	}
//	return ctx.GetStub().PutState(request.GoodsID, data)
//}
