package service

import (
	"github.com/gin-gonic/gin"
	"log"
)

func main()  {
	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})
	if err := r.Run(); err != nil {
		log.Fatalf("err: %+v", err)
	} // listen and serve on 0.0.0.0:8080
}
