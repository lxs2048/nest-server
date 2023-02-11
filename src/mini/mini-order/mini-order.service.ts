import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { WECHAT_PAY_MANAGER } from 'nest-wechatpay-node-v3';
import WxPay from 'wechatpay-node-v3';
import { PagingQueryDto } from 'src/common/dto/page-query.dto';
import { customException } from 'src/common/utils/customException';
import { Repository } from 'typeorm';
import { MiniGoodsService } from '../mini-goods/mini-goods.service';
import { MiniUserEntity } from '../mini-user/entities/mini-user.entity';
import { CreateMiniOrderDto } from './dto/create-mini-order.dto';
import { UpdateMiniOrderDto } from './dto/update-mini-order.dto';
import { MiniOrdersEntity } from './entities/mini-order.entity';
import {
  IParsePayCbOption,
  IPayCbOption,
  TradeState,
} from 'src/common/types/order';
import { Role, StatusValue } from 'src/common/enums/common.enum';
import { RedisUtilService } from 'src/common/libs/redis/redis.service';

@Injectable()
export class MiniOrderService {
  constructor(
    @InjectRepository(MiniOrdersEntity)
    private readonly miniOrdersRepository: Repository<MiniOrdersEntity>,
    private readonly miniGoodsService: MiniGoodsService,
    private readonly config: ConfigService,
    private readonly redisService: RedisUtilService,
    @Inject(WECHAT_PAY_MANAGER) private wxPay: WxPay,
  ) {}

  // 通过订单号与商品id生成默认订单
  async create(
    createMiniOrderDto: CreateMiniOrderDto,
    userInfo: MiniUserEntity,
  ) {
    // 1.获取当前用户的openId
    const { openid, id } = userInfo;
    // 2.判断外部订单号是否存在=》同一个订单号发起统一支付接口只能一次，可以把取消的订单号重新生成一个即可
    const _out_trade_no = `${
      new Date().getTime() + Math.random().toString(36).slice(-7)
    }`; //生成随机订单id
    const { goods_id, out_trade_no } = createMiniOrderDto || {};
    if (out_trade_no) {
      // 取消支付的订单支付
      const prepay = await this.redisService.hGetAll('prepay_' + out_trade_no);
      if (prepay) {
        return prepay;
      }
      try {
        await this.miniOrdersRepository
          .createQueryBuilder()
          .update()
          .set({ out_trade_no: _out_trade_no })
          .where('out_trade_no = :out_trade_no', { out_trade_no })
          .execute();
      } catch (error) {
        customException.fail('更新订单失败');
      }
    }
    // 3.商品id获取商品信息
    const goods = await this.miniGoodsService.findOne(goods_id);
    const { title, total } = goods; //拿出title作为支付的描述
    // 4.拼接参数来获取小程序调用支付的必要参数
    const params = {
      appid: this.config.get('xcx.AppID'),
      mchid: this.config.get('wxshpt.merchantId'),
      description: title,
      amount: {
        total: Number(total) * 100,
        currency: 'CNY',
      },
      notify_url: `${this.config.get('wxshpt.websiteCb')}/order/payCb`, //支付成功通知地址
      payer: {
        openid,
      },
      out_trade_no: _out_trade_no,
    };
    try {
      // 5.保存订单
      if (!out_trade_no) {
        await this.miniOrdersRepository.save({
          goods_id,
          out_trade_no: _out_trade_no,
          user_id: id,
        });
      }
      // 6.获取参数
      const result = await this.wxPay.transactions_jsapi(params);
      await this.redisService.hmset('prepay_' + _out_trade_no, result, 7200);
      return result;
    } catch (error) {
      customException.fail('创建订单失败', 500);
    }
  }

  async verifyPayRet(paycbOption: IPayCbOption) {
    // 参数解密：https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_5_5.shtml
    // 封装：https://github.com/klover2/wechatpay-node-v3-ts/blob/master/docs/transactions_h5.md
    const {
      resource: { ciphertext, associated_data, nonce },
    } = paycbOption;
    const APIv3 = this.config.get('wxshpt.apiv3');
    const parsePayCbOption: IParsePayCbOption = this.wxPay.decipher_gcm(
      ciphertext,
      associated_data,
      nonce,
      APIv3,
    );
    const { out_trade_no, trade_state } = parsePayCbOption;
    const failObj = {
      code: 'FAIL',
      message: '失败',
    };
    try {
      if (trade_state === TradeState.SUCCESS) {
        await this.miniOrdersRepository
          .createQueryBuilder()
          .update()
          .set({ pay_status: StatusValue.NORMAL })
          .where('out_trade_no = :out_trade_no', { out_trade_no })
          .execute();
        await this.redisService.hdelAll('prepay_' + out_trade_no);
        return '';
      }
    } catch (error) {
      return failObj;
    }
  }

  // 查全部
  async findAll(pageQuery: PagingQueryDto, userInfo: MiniUserEntity) {
    const { role, id } = userInfo;
    const { pageSize, currentPage } = pageQuery;
    try {
      // 跳过skip条查后面的take个
      let temp = this.miniOrdersRepository.createQueryBuilder('order');
      if (role === Role.ORDINARY_USER) {
        temp = temp.where('order.user_id = :id', { id });
      } else {
        temp = temp.leftJoinAndSelect('order.user', 'user');
      }
      const queryData = await temp
        .orderBy('order.created_at', 'DESC')
        .leftJoinAndSelect('order.goods', 'goods')
        .skip(pageSize * (currentPage - 1))
        .take(pageSize)
        .getManyAndCount();
      const [records, total] = queryData;
      return {
        pageSize,
        currentPage,
        records,
        total,
        page: Math.ceil(total / pageSize),
      };
    } catch (error) {
      console.log(error);

      customException.fail('查询失败', 500);
    }
  }

  // 查详情
  async findOne(id: string) {
    const result = await this.miniOrdersRepository.findOneBy({ id });
    if (!result) customException.fail('商品不存在');
    return result;
  }

  updatePayStatus(id: string, updateMiniOrderDto: UpdateMiniOrderDto) {
    const { pay_status } = updateMiniOrderDto;
    return this.miniOrdersRepository.update(id, { pay_status });
  }

  // 删除
  remove(id: string) {
    return this.miniOrdersRepository.delete(id);
  }
}
