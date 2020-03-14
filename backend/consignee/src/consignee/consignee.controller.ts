import { Controller, Body, Post, createParamDecorator, UseGuards } from '@nestjs/common';
import { Result } from '../common/result';
import { FabricClient } from 'src/application/fabric_client';
import { AuthGuard } from '@nestjs/passport';

export const User = createParamDecorator((data, req) => {
  return req.user;
});

@Controller('api/consignee')
export class ConsigneeController {
  private fabricClient: FabricClient;

  constructor() {
    this.fabricClient = new FabricClient();
  }
  
  @UseGuards(AuthGuard('jwt'))
  @Post("receive")
  async receiveGoods(@Body() body, @User() user): Promise<Result> {
    const goodsID = body.goodsID;
    if (goodsID == undefined) {
      return {code:10001, message: "goodsID needed"};
    }
    console.log(`receiveGoods with: ${goodsID}`);
    try {
      const username = user.username;
      await this.fabricClient.receiveGoods(username, goodsID);
      return {code:200, message: 'ok'};
    } catch (e) {
      return {code: 500, message: `${e}`};
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post("get_info")
  async getGoodsState(@Body() body, @User() user): Promise<Result> {
    const goodsID = body.goodsID;
    if (goodsID == undefined) {
      return {code:10001, message: "goodsID needed"};
    }
    console.log(`getGoodsState with id: ${goodsID}`);
    try {
      const username = user.username;
      const buffer = await this.fabricClient.getGoodsInfo(username, goodsID);
      const response = JSON.parse(buffer.toString());
      return {code: 200, message: "ok", data: response};
    } catch (e) {
      return {code: 500, message: "internal error", data: e};
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post("get_history")
  async getGoodsHistory(@Body() body, @User() user): Promise<Result> {
    const goodsID = body.goodsID;
    if (goodsID == undefined) {
      return {code: 10001, message: "goodsID needed"};
    }
    console.log(`getGoodsHistory with id: ${goodsID}`);
    try {
      const username = user.username;
      const buffer = await this.fabricClient.getGoodsHistory(username, goodsID);
      const response = JSON.parse(buffer.toString());
      return {code: 200, message: "ok", data: response};
    } catch (e) {
      return {code: 500, message: "internal error", data: e};
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post("get_all_goods")
  async getAllGoodsInfo(@User() user): Promise<Result> {
    console.log(`getAllGoodsInfo`);
    try {
      const username = user.username;
      const buffer = await this.fabricClient.getAllGoodsInfo(username);
      const response = JSON.parse(buffer.toString());
      return {code: 200, message: "ok", data: response};
    } catch (e) {
      return {code: 500, message: "internal error", data: e};
    }
  }
}
