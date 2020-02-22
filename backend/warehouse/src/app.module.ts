import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WarehouseController } from './warehouse/warehouse.controller';

@Module({
  imports: [],
  controllers: [AppController, WarehouseController],
  providers: [AppService],
})
export class AppModule {}
