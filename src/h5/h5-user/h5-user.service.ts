import { Injectable } from '@nestjs/common';
import { CreateH5UserDto } from './dto/create-h5-user.dto';
import { UpdateH5UserDto } from './dto/update-h5-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { H5UserEntity } from './entities/h5-user.entity';
import { customException } from 'src/common/utils/customException';
import { plainToClass } from 'class-transformer';

@Injectable()
export class H5UserService {
  constructor(
    @InjectRepository(H5UserEntity)
    private readonly h5UserRepository: Repository<H5UserEntity>,
  ) {}
  async create(createH5UserDto: CreateH5UserDto) {
    const createUser = plainToClass(H5UserEntity, createH5UserDto);
    return this.addVxUser(createUser);
  }

  async addVxUser(createH5UserDto: CreateH5UserDto) {
    const { openid } = createH5UserDto;
    const result = await this.h5UserRepository.findOne({ where: { openid } });
    if (result) customException.fail('用户已存在');
    return this.h5UserRepository.save(createH5UserDto);
  }

  findAll() {
    return `This action returns all h5User`;
  }

  async findOne(id: string) {
    const result = await this.h5UserRepository.findOneBy({ id });
    if (!result) customException.fail('用户id不存在');
    return result;
  }

  async update(id: string, updateH5UserDto: UpdateH5UserDto) {
    // todo 限制更新内容
    const updateUser = plainToClass(H5UserEntity, updateH5UserDto);
    const user = await this.findOne(id);
    const ret = await this.h5UserRepository.update(user.id, updateUser);
    return ret;
  }

  remove(id: number) {
    return `This action removes a #${id} h5User`;
  }
}
