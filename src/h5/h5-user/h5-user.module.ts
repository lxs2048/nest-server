import { Module } from '@nestjs/common';
import { H5UserService } from './h5-user.service';
import { H5UserController } from './h5-user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { H5UserEntity } from './entities/h5-user.entity';
@Module({
  imports: [TypeOrmModule.forFeature([H5UserEntity])],
  controllers: [H5UserController],
  providers: [H5UserService],
})
export class H5UserModule {}
