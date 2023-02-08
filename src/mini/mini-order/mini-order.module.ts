import { Module } from '@nestjs/common';
import { MiniOrderService } from './mini-order.service';
import { MiniOrderController } from './mini-order.controller';

@Module({
  controllers: [MiniOrderController],
  providers: [MiniOrderService],
})
export class MiniOrderModule {}
