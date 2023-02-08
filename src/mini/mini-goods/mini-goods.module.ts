import { Module } from '@nestjs/common';
import { MiniGoodsService } from './mini-goods.service';
import { MiniGoodsController } from './mini-goods.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MiniGoodsEntity } from './entities/mini-good.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MiniGoodsEntity])],
  controllers: [MiniGoodsController],
  providers: [MiniGoodsService],
})
export class MiniGoodsModule {}
