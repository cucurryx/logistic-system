# 基于超级账本的分布式物流管理系统 - 区块链网络搭建

## 参与组织

包括**发货方**、**承运方**、**仓储方**和**收货方**，各个org的msp标识符：

| organization |   msp id    |
| :----------: | :---------: |
|    发货方    |   shipper   |
|    承运方    | transporter |
|    仓储方    |  warehouse  |
|    收货方    |  consignee  |


## 网络搭建
```shell
./network.sh generate # 生成证书文件、初始块文件、通道配置文件
./network.sh up # 启动 orderer 各个组织的 peers 的 docker container

```
