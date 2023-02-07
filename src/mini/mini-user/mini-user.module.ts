import { Module } from '@nestjs/common';
import { MiniUserService } from './mini-user.service';
import { MiniUserController } from './mini-user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MiniUserEntity } from './entities/mini-user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Module({
  imports: [
    TypeOrmModule.forFeature([MiniUserEntity]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('xcx.jwt.secretkey'),
        signOptions: {
          expiresIn: config.get('xcx.jwt.expiresin'),
        },
      }),
    }),
  ],
  controllers: [MiniUserController],
  providers: [MiniUserService],
})
export class MiniUserModule {}
