import { Module } from '@nestjs/common';
import { TestModule } from './system/test/test.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/index';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      cache: true,
      load: [configuration],
      isGlobal: true,
    }),
    // 数据库
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'mysql',
          autoLoadEntities: true, //自动加载实体
          keepConnectionAlive: true,
          ...config.get('db.mysql'),
        } as TypeOrmModuleOptions;
      },
    }),
    TestModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
