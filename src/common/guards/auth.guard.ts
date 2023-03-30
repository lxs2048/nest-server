import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable } from '@nestjs/common';

import { ALLOW_ANON } from '../decorators/allow-anon.decorator';
import { customException } from '../utils/customException';
import { RedisUtilService } from '../libs/redis/redis.service';
import { MiniUserService } from 'src/mini/mini-user/mini-user.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private readonly miniUserService: MiniUserService,
    private readonly redisService: RedisUtilService,
  ) {
    super();
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    // 函数，类 是否允许无token访问
    const allowAnon = this.reflector.getAllAndOverride<boolean>(ALLOW_ANON, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (allowAnon) return true;
    const req = ctx.switchToHttp().getRequest();
    const accessToken = req.get('Authorization');
    if (!accessToken) customException.fail('请先登录', 401);
    const _Token = accessToken.replace('Bearer ', ''); // Bearer xxx
    const payload = this.miniUserService.verifyToken(_Token);
    if (!payload) customException.fail('当前登录已过期，请重新登录', 401);
    // redis缓存的token
    const cacheToken = await this.redisService.get(
      `mini-user-token-${payload.id}`,
    ); //获取redis的key
    // 如果 token 不匹配，禁止访问
    if (_Token !== cacheToken) {
      customException.fail('您的账号在其他地方登录，请重新登录', 401);
    }
    return this.activate(ctx);
  }

  async activate(ctx: ExecutionContext): Promise<boolean> {
    return super.canActivate(ctx) as Promise<boolean>;
  }
}
