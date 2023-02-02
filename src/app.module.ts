import { Module } from '@nestjs/common';
import { TestModule } from './system/test/test.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/index';
@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      cache: true,
      load: [configuration],
      isGlobal: true,
    }),
    TestModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
