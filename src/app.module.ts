import { Module } from '@nestjs/common';
import { TestModule } from './system/test/test.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/index';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { RedisModuleOptions } from 'nestjs-redis';
import { RedisUtilModule } from './common/libs/redis/redis.module';
import { TasksModule } from 'src/common/libs/tasks/tasks.module';
import { ScheduleModule } from '@nestjs/schedule';
import { OssModule } from './common/libs/oss/oss.module';
import { H5UserModule } from './h5/h5-user/h5-user.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
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
    // Redis
    RedisUtilModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        return config.get<RedisModuleOptions>('db.redis');
      },
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    OssModule,
    TasksModule,
    TestModule,
    // h5
    H5UserModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
