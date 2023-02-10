import { Global, Module } from '@nestjs/common';
import { MiniGoodsService } from './mini-goods.service';
import { MiniGoodsController } from './mini-goods.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MiniGoodsEntity } from './entities/mini-good.entity';
@Global()
@Module({
  imports: [TypeOrmModule.forFeature([MiniGoodsEntity])],
  controllers: [MiniGoodsController],
  providers: [MiniGoodsService],
  exports: [MiniGoodsService],
})
export class MiniGoodsModule {}
