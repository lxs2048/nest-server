import { Injectable } from '@nestjs/common';
import { CreateMiniUserDto } from './dto/create-mini-user.dto';
import { UpdateMiniUserDto } from './dto/update-mini-user.dto';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { MiniUserEntity } from './entities/mini-user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { RedisUtilService } from 'src/common/libs/redis/redis.service';
import { Jscode2session } from './types/mini-user.type';
import { customException } from 'src/common/utils/customException';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class MiniUserService {
  constructor(
    @InjectRepository(MiniUserEntity)
    private readonly miniUserRepository: Repository<MiniUserEntity>,
    private readonly config: ConfigService,
    private readonly redisService: RedisUtilService,
    private readonly jwtService: JwtService,
  ) {}
  async login(createMiniUserDto: CreateMiniUserDto) {
    const { nickname, code, avatarurl } = createMiniUserDto;
    // 1. 获取openid:
    const loginInfo = (await axios
      .get(
        `https://api.weixin.qq.com/sns/jscode2session?appid=${this.config.get(
          'xcx.AppID',
        )}&secret=${this.config.get(
          'xcx.AppSecret',
        )}&js_code=${code}&grant_type=authorization_code`,
      )
      .then((res) => res.data)) as Jscode2session;
    if (!loginInfo.openid) customException.fail('客户端登录code无效', 400);
    // 2. 是否存在该用户
    const userInfo = await this.miniUserRepository.findOneBy({
      openid: loginInfo.openid,
    });
    let _userInfo = userInfo;
    if (!userInfo) {
      // 保存用户信息
      try {
        const ret = await this.miniUserRepository.save({
          nickname,
          avatarurl,
          openid: loginInfo.openid,
        });
        _userInfo = ret;
      } catch (_) {
        customException.fail('创建用户信息失败', 500);
      }
    } else {
      // 可能需要更新nickname和avatarurl
      try {
        await this.miniUserRepository.update(userInfo.id, {
          nickname,
          avatarurl,
        });
        _userInfo = {
          ...userInfo,
          nickname,
          avatarurl,
        };
      } catch (_) {
        customException.fail('更新用户信息失败', 500);
      }
    }
    // 3. 生成token
    const token = this.createToken(_userInfo);
    // 4. redis缓存
    await this.redisService.set(
      `mini-user-token-${_userInfo.id}`,
      token,
      60 * 60 * 24 * 15,
    );
    return { token };
  }

  // 生成token
  createToken(user: Partial<MiniUserEntity>) {
    const { id, nickname, openid, role } = user;
    return this.jwtService.sign({ id, nickname, openid, role });
  }

  /** 校验 token */
  verifyToken(token: string): MiniUserEntity | null {
    try {
      if (!token) return null;
      const payload = this.jwtService.verify(token);
      return payload;
    } catch (error) {
      return null;
    }
  }

  /* 获取手机号 */
  async getPhone(code: string, user: MiniUserEntity) {
    // 校验code
    if (!code) {
      customException.fail('缺少获取手机号参数code');
    }
    // 获取token
    const AccesstToken = await this.redisService.get('access_token_wx_xcx');
    // 获取手机信息 https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/user-info/phone-number/getPhoneNumber.html
    try {
      const phoneData = await axios
        .post(
          `https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=${AccesstToken}`,
          {
            code,
          },
        )
        .then((res) => res.data);
      const phoneNumber = phoneData['phone_info']['phoneNumber'];
      if (phoneNumber) {
        const { id } = user;
        return this.miniUserRepository.update(id, { phone: phoneNumber });
      }
    } catch (error) {
      customException.fail('更新手机号失败', 500);
    }
  }

  findAll() {
    return `This action returns all miniUser`;
  }

  async findOne(id: string) {
    const result = await this.miniUserRepository.findOneBy({ id });
    if (!result) customException.fail('用户id不存在');
    return result;
  }

  update(id: number, updateMiniUserDto: UpdateMiniUserDto) {
    return `This action updates a #${id} miniUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} miniUser`;
  }
}
