import { Injectable } from '@nestjs/common';
import { CreateMiniGoodDto } from './dto/create-mini-good.dto';
import { UpdateMiniGoodDto } from './dto/update-mini-good.dto';

@Injectable()
export class MiniGoodsService {
  create(createMiniGoodDto: CreateMiniGoodDto) {
    return 'This action adds a new miniGood';
  }

  findAll() {
    return `This action returns all miniGoods`;
  }

  findOne(id: number) {
    return `This action returns a #${id} miniGood`;
  }

  update(id: number, updateMiniGoodDto: UpdateMiniGoodDto) {
    return `This action updates a #${id} miniGood`;
  }

  remove(id: number) {
    return `This action removes a #${id} miniGood`;
  }
}
