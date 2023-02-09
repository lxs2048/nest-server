import { Module } from '@nestjs/common';
import { MiniOrderService } from './mini-order.service';
import { MiniOrderController } from './mini-order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MiniOrdersEntity } from './entities/mini-order.entity';
import { MiniGoodsEntity } from '../mini-goods/entities/mini-good.entity';
import { MiniUserEntity } from '../mini-user/entities/mini-user.entity';
@Module({
  imports: [TypeOrmModule.forFeature([MiniOrdersEntity,MiniGoodsEntity,MiniUserEntity])],
  controllers: [MiniOrderController],
  providers: [MiniOrderService],
})
export class MiniOrderModule {}
