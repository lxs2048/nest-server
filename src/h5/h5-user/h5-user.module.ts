import { Module } from '@nestjs/common';
import { H5UserService } from './h5-user.service';
import { H5UserController } from './h5-user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { H5UserEntity } from './entities/h5-user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Module({
  imports: [
    TypeOrmModule.forFeature([H5UserEntity]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('jwt.secretkey'),
        signOptions: {
          expiresIn: config.get('jwt.expiresin'),
        },
      }),
    }),
  ],
  controllers: [H5UserController],
  providers: [H5UserService],
})
export class H5UserModule {}
