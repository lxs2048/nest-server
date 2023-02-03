import { Injectable } from '@nestjs/common';
import { CreateH5UserDto } from './dto/create-h5-user.dto';
import { UpdateH5UserDto } from './dto/update-h5-user.dto';

@Injectable()
export class H5UserService {
  create(createH5UserDto: CreateH5UserDto) {
    return 'This action adds a new h5User';
  }

  findAll() {
    return `This action returns all h5User`;
  }

  findOne(id: number) {
    return `This action returns a #${id} h5User`;
  }

  update(id: number, updateH5UserDto: UpdateH5UserDto) {
    return `This action updates a #${id} h5User`;
  }

  remove(id: number) {
    return `This action removes a #${id} h5User`;
  }
}
