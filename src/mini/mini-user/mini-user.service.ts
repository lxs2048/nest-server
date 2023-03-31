import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisUtilService } from 'src/common/libs/redis/redis.service';
import { customException } from 'src/common/utils/customException';
import { Repository } from 'typeorm';
import axios from 'axios';
import { CreateMiniUserDto } from './dto/create-mini-user.dto';
import { UpdateMiniUserDto } from './dto/update-mini-user.dto';
import { MiniUserEntity } from './entities/mini-user.entity';
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
    const { loginCode, phoneCode } = createMiniUserDto;
    const phoneNumber = await this.getPhone(phoneCode);
    // 查看手机号是否存在
    const user = await this.findBy({ phone: phoneNumber });
    let _user = null;
    if (!user) {
      // 创建用户
      _user = {};
      // 保存用户信息
      try {
        // 1. 获取openid:
        const loginData = await axios.get(
          `https://api.weixin.qq.com/sns/jscode2session?appid=${this.config.get(
            'xcx.AppID',
          )}&secret=${this.config.get(
            'xcx.AppSecret',
          )}&js_code=${loginCode}&grant_type=authorization_code`,
        );
        const loginInfo = loginData['data'] || {};
        if (!loginInfo.openid) customException.fail('客户端登录code无效', 400);
        const ret = await this.miniUserRepository.save({
          phone: phoneNumber,
          openid: loginInfo.openid,
        });
        _user = ret;
      } catch (_) {
        customException.fail('创建用户信息失败', 500);
      }
    } else {
      _user = user;
    }
    // 处理登录
    // 生成token
    const token = this.createToken(_user);
    // redis缓存
    await this.redisService.set(
      `mini-user-token-${_user.id}`,
      token,
      60 * 60 * 24 * 15,
    );
    return {
      token,
      userInfo: _user,
    };
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

  /* 修改基本信息 */
  async modifyBasic(
    updateMiniUserDto: UpdateMiniUserDto,
    user: MiniUserEntity,
  ) {
    const { nickname, avatarurl } = updateMiniUserDto;
    await this.miniUserRepository.update(user.id, {
      nickname,
      avatarurl,
    });
    const data = await this.findBy({ id: user.id });
    return data;
  }

  /* 校验token */
  verifyToken(token: string): MiniUserEntity | null {
    try {
      if (!token) return null;
      const payload = this.jwtService.verify(token);
      return payload;
    } catch (error) {
      return null;
    }
  }

  /* 条件查找 */
  async findBy(data: any) {
    return this.miniUserRepository.findOneBy(data);
  }

  /* 生成token */
  createToken(user: Partial<MiniUserEntity>) {
    const { id, openid, role } = user;
    return this.jwtService.sign({ id, openid, role });
  }
  /* 获取手机号 */
  async getPhone(phoneCode: string) {
    // 校验code
    if (!phoneCode) {
      customException.fail('缺少获取手机号参数code');
    }
    // 获取token
    const AccesstToken = await this.redisService.get('access_token_wx_xcx');
    if (!AccesstToken) {
      customException.fail('服务端微信token不存在', 500);
    }
    // 获取手机信息 https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/user-info/phone-number/getPhoneNumber.html
    try {
      const phoneData = await axios.post(
        `https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=${AccesstToken}`,
        {
          code: phoneCode,
        },
      );
      const phoneInfo = phoneData['data']['phone_info'];
      const { phoneNumber, countryCode } = phoneInfo;
      return `(${countryCode})${phoneNumber}`;
    } catch (error) {
      customException.fail('获取手机号失败', 500);
    }
  }
}
