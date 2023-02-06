import { Injectable } from '@nestjs/common';
import { CreateH5UserDto } from './dto/create-h5-user.dto';
import { UpdateH5UserDto } from './dto/update-h5-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { H5UserEntity } from './entities/h5-user.entity';
import { customException } from 'src/common/utils/customException';
import { plainToClass } from 'class-transformer';
import { StatusValue } from 'src/common/enums/common.enum';
import { compareSync } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RedisUtilService } from 'src/common/libs/redis/redis.service';

@Injectable()
export class H5UserService {
  constructor(
    @InjectRepository(H5UserEntity)
    private readonly h5UserRepository: Repository<H5UserEntity>,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisUtilService,
  ) {}

  /**
   * 登录
   * 账号是邮箱
   */
  async login(email: string, password: string) {
    const user = await this.h5UserRepository
      .createQueryBuilder('h5User')
      .addSelect('h5User.password')
      .where('h5User.email=:email', { email })
      .getOne();
    if (!user) customException.fail('用户不存在');
    if (!compareSync(password, user.password)) customException.fail('密码错误');
    if (user.status === StatusValue.FORBIDDEN)
      customException.fail('用户已禁用');
    const token = this.createToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    await this.redisService.set(
      `h5-user-token-${user.id}`,
      token,
      60 * 60 * 24,
    );
    return { token };
  }

  // 生成token
  createToken(user: Partial<H5UserEntity>) {
    return this.jwtService.sign(user);
  }

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
