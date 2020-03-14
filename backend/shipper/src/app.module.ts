import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';
import { AuthModule } from './auth/auth.module';

@Module({
  controllers: [AppController, OrderController],
  providers: [AppService, OrderService],
  imports: [AuthModule],
})
export class AppModule {}
