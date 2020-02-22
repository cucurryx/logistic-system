import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderCreateRequest } from '../common/request';
import { Result } from 'src/common/result';
import { createOrder } from '../application/create_order';
import { getGoodsInfo } from '../application/get_goods_info';
import { getGoodsHistory } from '../application/get_goods_history';

@Controller('order')
export class OrderController {
    constructor(private orderService: OrderService) { }

    @Post("create")
    async createOrder(@Body() createOrderDto: OrderCreateRequest): Promise<Result> {
      console.log(`createOrder with: ${createOrderDto}`);
      try {
        await createOrder('admin', createOrderDto);
        return {code:200, message: 'ok'};
      } catch (e) {
        return {code: 500, message: `${e}`};
      }
    }
  
    @Post("get_info")
    async getGoodsState(@Body() body): Promise<Result> {
      const goodsID = body.goodsID;
      if (goodsID == undefined) {
        return {code:10001, message: "goodsID needed"};
      }
      console.log(`getGoodsState with id: ${goodsID}`);
      try {
        const buffer = await getGoodsInfo('admin', goodsID);
        const response = JSON.parse(buffer.toString());
        return {code: 200, message: "ok", data: response};
      } catch (e) {
        return {code: 500, message: "internal error", data: e};
      }
    }
  
    @Post("get_history")
    async getGoodsHistory(@Body() body): Promise<Result> {
      const goodsID = body.goodsID;
      if (goodsID == undefined) {
        return {code: 10001, message: "goodsID needed"};
      }
      console.log(`getGoodsHistory with id: ${goodsID}`);
      try {
        const buffer = await getGoodsHistory('admin', goodsID);
        const response = JSON.parse(buffer.toString());
        return {code: 200, message: "ok", data: response};
      } catch (e) {
        return {code: 500, message: "internal error", data: e};
      }
    }
}
