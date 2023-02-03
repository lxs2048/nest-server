import { Module } from '@nestjs/common';
import { H5UserService } from './h5-user.service';
import { H5UserController } from './h5-user.controller';

@Module({
  controllers: [H5UserController],
  providers: [H5UserService],
})
export class H5UserModule {}
