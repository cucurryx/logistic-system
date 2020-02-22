import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConsigneeController } from './consignee/consignee.controller';

@Module({
  imports: [],
  controllers: [AppController, ConsigneeController],
  providers: [AppService],
})
export class AppModule {}
