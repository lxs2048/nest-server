import { Module } from '@nestjs/common';
import { MiniUserService } from './mini-user.service';
import { MiniUserController } from './mini-user.controller';

@Module({
  controllers: [MiniUserController],
  providers: [MiniUserService],
})
export class MiniUserModule {}
