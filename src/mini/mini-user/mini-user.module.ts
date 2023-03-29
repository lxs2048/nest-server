import { Module } from '@nestjs/common';
import { MiniUserService } from './mini-user.service';
import { MiniUserController } from './mini-user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MiniUserEntity } from './entities/mini-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MiniUserEntity])],
  controllers: [MiniUserController],
  providers: [MiniUserService],
})
export class MiniUserModule {}
