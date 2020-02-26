# 后端接口

- POST /api/warehouse/report 仓储数据上报接口
```http request
POST /api/warehouse/report HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
	"goods_id": "1111",
	"storage_position": {
		"warehouse_id": "仓库id",
		"warehouse_name": "仓库名称",
		"zone_id": "区域id",
		"self_id": "货架id",
		"position": "存储具体位置"
	}
}
```

```json
{
    "code": 200,
    "message": "ok"
}
```

- POST /api/warehouse/get_info 查询物品信息接口
```http request
POST /api/warehouse/get_info HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
	"goodsID": "1111"
}
```

```json
{
    "code": 200,
    "message": "ok",
    "data": {
        "state": "WAREHOUSING",
        "order_create_state": null,
        "transport_state": null,
        "warehouse_state": {
            "goods_id": "1111",
            "storage_position": {
                "warehouse_id": "仓库id",
                "warehouse_name": "仓库名称",
                "zone_id": "区域id",
                "self_id": "货架id",
                "position": "存储具体位置"
            }
        }
    }
}
```

- POST /api/warehouse/get_history 查询物品历史记录接口
```http request
POST /api/warehouse/get_history HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
	"goodsID": "1111"
}
```

```json
{
    "code": 200,
    "message": "ok",
    "data": {
        "transactions": [
            {
                "state": {
                    "state": "WAREHOUSING",
                    "order_create_state": null,
                    "transport_state": null,
                    "warehouse_state": {
                        "goods_id": "1111",
                        "storage_position": {
                            "warehouse_id": "仓库id",
                            "warehouse_name": "仓库名称",
                            "zone_id": "区域id",
                            "self_id": "货架id",
                            "position": "存储具体位置"
                        }
                    }
                },
                "timestamp": "2020-02-22 10:20:17 AM"
            },
            {
                "state": {
                    "state": "TRANSPORTING",
                    "order_create_state": null,
                    "transport_state": {
                        "goods_id": "1111",
                        "transport": {
                            "principal": "运输负责人",
                            "start_time": "开始时间",
                            "car_id": "鄂A66666",
                            "source": "运输出发地",
                            "destination": "运输目的地的"
                        }
                    },
                    "warehouse_state": null
                },
                "timestamp": "2020-02-22 09:09:07 AM"
            },
            {
                "state": {
                    "state": "UNPROCESSED",
                    "order_create_state": {
                        "id": "1111",
                        "client": "client",
                        "receiver": "接收者",
                        "name": "物品名称",
                        "source": "出发地",
                        "destination": " 接收地",
                        "description": "aaa"
                    },
                    "transport_state": null,
                    "warehouse_state": null
                },
                "timestamp": "2020-02-22 09:04:20 AM"
            }
        ]
    }
}
```

