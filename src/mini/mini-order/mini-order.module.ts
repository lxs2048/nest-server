import { Module } from '@nestjs/common';
import { MiniOrderService } from './mini-order.service';
import { MiniOrderController } from './mini-order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MiniOrdersEntity } from './entities/mini-order.entity';
import { WeChatPayModule } from 'nest-wechatpay-node-v3';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import fs from 'fs';
import { MiniGoodsEntity } from '../mini-goods/entities/mini-good.entity';
import { MiniUserEntity } from '../mini-user/entities/mini-user.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      MiniOrdersEntity,
      MiniGoodsEntity,
      MiniUserEntity,
    ]),
    WeChatPayModule.registerAsync({
      inject: [ConfigService],
      // https://www.npmjs.com/package/wechatpay-node-v3
      // https://www.npmjs.com/package/nest-wechatpay-node-v3
      // 获取证书：https://kf.qq.com/faq/161222NneAJf161222U7fARv.html
      useFactory: async (config: ConfigService) => {
        return {
          appid: config.get('xcx.AppID'), //'直连商户申请的公众号或移动应用appid',
          mchid: config.get('wxshpt.merchantId'), //'商户号',path.resolve(__dirname, "../file.xml")
          publicKey: fs.readFileSync(
            path.resolve(__dirname, '../../config/apiclient_cert.pem'),
          ), // 公钥
          privateKey: fs.readFileSync(
            path.resolve(__dirname, '../../config/apiclient_key.pem'),
          ), // 秘钥
        };
      },
    }),
  ],
  controllers: [MiniOrderController],
  providers: [MiniOrderService],
})
export class MiniOrderModule {}
