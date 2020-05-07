package api

import (
	"encoding/json"
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
	storage := Storage()
	data, err := storage.GetStateByKey(req.GoodsID)
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{"error": "can't get goods"})
		return
	}
	var goodsState entity.GoodsState
	if err := json.Unmarshal([]byte(data.Value()), &goodsState); err != nil {
		ctx.JSON(http.StatusOK, gin.H{"error": "unmarshal failed"})
		return
	}
	if goodsState.State != entity.TRANSPORTING {
		ctx.JSON(http.StatusOK, gin.H{"error": "goods' state is TRANSPORTING"})
		return
	}

	warehouseInfo := entity.WarehouseInfo(req)
	goodsState.SetWarehousing(&warehouseInfo)
	jsonStr, err := json.Marshal(goodsState)
	if err := Storage().PutStateByKey(req.GoodsID, string(jsonStr)); err != nil {
		ctx.JSON(http.StatusOK, gin.H{"error": "putStateByKey failed"})
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "ok"})
}

