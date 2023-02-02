import { Module } from '@nestjs/common';
import { TestModule } from './system/test/test.module';
@Module({
  imports: [TestModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
