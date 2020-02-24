import { Controller, Post, Body } from '@nestjs/common';
import { ReportTransportRequest } from '../common/request';
import { reportTransport } from '../application/report_transport';
import { Result } from '../common/result';
import { getGoodsInfo } from '../application/get_goods_info';
import { getGoodsHistory } from '../application/get_goods_history';
import { getAllGoodsInfo } from '../application/get_all_goods_info';

@Controller('api/transport')
export class TransportController {

  @Post("report")
  async reportTransport(@Body() reportTransportDto: ReportTransportRequest): Promise<Result> {
    console.log(`createOrder with: ${reportTransportDto}`);
    try {
      await reportTransport('admin', reportTransportDto);
      return {code:200, message: 'ok'};
    } catch (e) {
      return {code: 500, message: `${e}`};
    }
  }

  @Post("get_info")
  async getTransportInfo(@Body() body): Promise<Result> {
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
  async getTransportHistory(@Body() body): Promise<Result> {
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

  @Post("get_all_goods")
  async getAllGoodsInfo(): Promise<Result> {
    console.log(`getAllGoodsInfo`);
    try {
      const buffer = await getAllGoodsInfo('admin');
      const response = JSON.parse(buffer.toString());
      return {code: 200, message: "ok", data: response};
    } catch (e) {
      return {code: 500, message: "internal error", data: e};
    }
  }
}
