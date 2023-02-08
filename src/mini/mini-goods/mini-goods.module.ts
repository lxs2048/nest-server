import { Module } from '@nestjs/common';
import { MiniGoodsService } from './mini-goods.service';
import { MiniGoodsController } from './mini-goods.controller';

@Module({
  controllers: [MiniGoodsController],
  providers: [MiniGoodsService],
})
export class MiniGoodsModule {}
