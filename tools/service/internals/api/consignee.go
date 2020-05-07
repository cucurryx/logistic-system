package api

//func (c *LogisticContract) ReceiveGoods(ctx Context, id string) error {
//	data, err := ctx.GetStub().GetState(id)
//	if err != nil {
//		return err
//	}
//	var goodsState GoodsState
//	if err := json.Unmarshal(data, &goodsState); err != nil {
//		return err
//	}
//
//	if goodsState.State != TRANSPORTING {
//		return fmt.Errorf("can't receive goods because goods' state is not TRANSPORTING")
//	}
//	goodsState.SetReceived()
//
//	data, err = json.Marshal(goodsState)
//	if err != nil {
//		return err
//	}
//	return ctx.GetStub().PutState(string(id), data)
//}

