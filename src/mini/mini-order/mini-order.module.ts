import { Module } from '@nestjs/common';
import { MiniOrderService } from './mini-order.service';
import { MiniOrderController } from './mini-order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MiniOrdersEntity } from './entities/mini-order.entity';
@Module({
  imports: [TypeOrmModule.forFeature([MiniOrdersEntity])],
  controllers: [MiniOrderController],
  providers: [MiniOrderService],
})
export class MiniOrderModule {}
