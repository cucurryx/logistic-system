# 后端接口

- POST /login 登陆接口
```http request
POST /login HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
	"username": "admin",
	"password": "adminpw"
}
```

```json
{
    "code": 200,
    "message": "ok"
}
```
- POST /transport/report 上报运输信息
```http request
POST /transport/report HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
	"goods_id": "1111",
	"transport": {
		"principal": "运输负责人",
		 "start_time": "开始时间",
		 "car_id": "鄂A66666",
		 "source": "运输出发地",
		 "destination": "运输目的地"
	}
}
```

```json
{
    "code": 200,
    "message": "ok"
}
```
- POST /transport/get_info 查询某个物品的当前运输信息
```http request
POST /transport/get_info HTTP/1.1
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
    }
}
```

- POST /transport/get_history 查询某个物品的历史运输记录
```http request
POST /transport/get_history HTTP/1.1
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

- POST /transport/get_all_goods 查询所有物品信息
```http request

```

```json

```
