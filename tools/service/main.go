package service

import (
	"github.com/gin-gonic/gin"
	"log"
	"service/internals/api"
)

func main()  {
	r := gin.Default()
	r.POST("/putWarehouseInfo", api.PutWarehouseInfo)
	r.POST("/createOrder", api.CreateOrder)
	r.POST("/putTransportInfo", api.PutTransportInfo)
	r.POST("/receiveGoods", api.ReceiveGoods)
	r.POST("/getAllGoodsInfo", api.GetAllGoodsInfo)
	r.POST("/getGoodsInfo", api.GetGoodsInfo)
	r.POST("/getGoodsHistory", api.GetGoodsHistory)

	if err := r.Run(); err != nil {
		log.Fatalf("err: %+v", err)
	} // listen and serve on 0.0.0.0:8080
}
