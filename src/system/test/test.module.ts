import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestEntity } from './entities/test.entity';
import { EventsModule } from '../events/events.module';
@Module({
  imports: [TypeOrmModule.forFeature([TestEntity]), EventsModule],
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}
