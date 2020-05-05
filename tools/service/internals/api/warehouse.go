package api

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"service/internals/entity"
)

func PutWarehouseInfo(ctx *gin.Context) {
	var req entity.PutWarehouseInfoRequest
	if err := ctx.BindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{})
		return
	}
	storage := Storage();
	if _, err := storage.GetStateByKey(req.GoodsID); err != nil {
		ctx.JSON(http.StatusOK, gin.H{})
	}
	Storage().PutStateByKey(req.GoodsID, )
}

// 仓储信息录入接口
//func (c *LogisticContract) PutWarehouseInfo(ctx Context, requestData string) error {
//	var request PutWarehouseInfoRequest
//	if err := json.Unmarshal([]byte(requestData), &request); err != nil {
//		return fmt.Errorf("put warehouse info failed when unmarshal request data, err: %+v", err)
//	}
//
//	data, err := ctx.GetStub().GetState(request.GoodsID)
//	if err != nil {
//		return fmt.Errorf("PutWarehouseInfo GetState failed with id: %s, err: %+v", request.GoodsID, err)
//	}
//
//	var goodsState GoodsState
//	if err := json.Unmarshal(data, &goodsState); err != nil {
//		return fmt.Errorf("PutTransportInfo unmarshal failed, data: %+v, err: %+v", data, err)
//	}
//
//	if goodsState.State != TRANSPORTING {
//		return fmt.Errorf("goods' state is TRANSPORTING")
//	}
//
//	warehouseInfo := WarehouseInfo(request)
//	goodsState.SetWarehousing(&warehouseInfo)
//
//	data, err = json.Marshal(goodsState)
//	if err != nil {
//		return fmt.Errorf("json marshal failed, err: %+v", err)
//	}
//	return ctx.GetStub().PutState(request.GoodsID, data)
//}

