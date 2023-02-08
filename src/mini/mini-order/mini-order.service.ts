import { Injectable } from '@nestjs/common';
import { CreateMiniOrderDto } from './dto/create-mini-order.dto';
import { UpdateMiniOrderDto } from './dto/update-mini-order.dto';

@Injectable()
export class MiniOrderService {
  create(createMiniOrderDto: CreateMiniOrderDto) {
    return 'This action adds a new miniOrder';
  }

  findAll() {
    return `This action returns all miniOrder`;
  }

  findOne(id: number) {
    return `This action returns a #${id} miniOrder`;
  }

  update(id: number, updateMiniOrderDto: UpdateMiniOrderDto) {
    return `This action updates a #${id} miniOrder`;
  }

  remove(id: number) {
    return `This action removes a #${id} miniOrder`;
  }
}
