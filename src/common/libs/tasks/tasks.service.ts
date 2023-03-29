import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Interval, Timeout } from '@nestjs/schedule';
import { RedisUtilService } from '../redis/redis.service';
import axios from 'axios';
@Injectable()
export class TasksService {
  constructor(
    private readonly config: ConfigService,
    private readonly redisService: RedisUtilService,
  ) {}

  // access_token在2小时内有效，过期需要重新获取，但1天内获取次数有限，建议公众号开发者使用中控服务器统一获取和刷新access_token：https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Get_access_token.html
  // 小程序类似
  // 临时获取access_token存储的redis中
  @Timeout(5000) // 要声明一个在指定时间后运行（一次）的方法，使用@Timeout()装饰器前缀。将从应用启动的相关时间偏移量（毫秒）传递给装饰器
  @Interval(1000 * 60 * 60) // 每隔1小时执行一次
  async refreshAccessToken() {
    console.log('==refresh==');
  }

  // 微信小程序access_token与公众号类似：https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/mp-access-token/getAccessToken.html
  @Timeout(5000)
  @Interval(1000 * 60 * 60) //每隔1小时执行一次
  async getXcxAccessToken() {
    const TokenData = await axios
      .get(
        `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${this.config.get(
          'xcx.AppID',
        )}&secret=${this.config.get('xcx.AppSecret')}`,
      )
      .then((res) => res.data);
    if (TokenData.access_token) {
      this.redisService.set(
        'access_token_wx_xcx',
        TokenData.access_token,
        7200,
      );
    }
  }
}
