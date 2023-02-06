import { Injectable } from '@nestjs/common';
import { CreateMiniUserDto } from './dto/create-mini-user.dto';
import { UpdateMiniUserDto } from './dto/update-mini-user.dto';

@Injectable()
export class MiniUserService {
  login(createMiniUserDto: CreateMiniUserDto) {
    return 'This action adds a new miniUser';
  }

  findAll() {
    return `This action returns all miniUser`;
  }

  findOne(id: number) {
    return `This action returns a #${id} miniUser`;
  }

  update(id: number, updateMiniUserDto: UpdateMiniUserDto) {
    return `This action updates a #${id} miniUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} miniUser`;
  }
}
