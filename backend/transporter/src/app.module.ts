import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransportController } from './transport/transport.controller';

@Module({
  imports: [],
  controllers: [AppController, TransportController],
  providers: [AppService],
})
export class AppModule {}
