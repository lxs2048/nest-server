import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import express from 'express';
import { logger } from './common/libs/log4js/logger.middleware';
import { TransformInterceptor } from './common/libs/log4js/transform.interceptor';
import { AllExceptionsFilter } from './common/libs/log4js/exceptions-filter';
import { HttpExceptionFilter } from './common/libs/log4js/http-exceptions-filter';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 日志
  app.use(express.json()); // For parsing application/json
  app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
  app.use(logger); // 监听所有的请求路由，并打印日志
  app.useGlobalInterceptors(new TransformInterceptor()); // 使用全局拦截器打印出参
  app.useGlobalFilters(new AllExceptionsFilter()); // AllExceptionsFilter要在HttpExceptionFilter的上面，否则HttpExceptionFilter就不生效了，全被AllExceptionsFilter捕获了
  app.useGlobalFilters(new HttpExceptionFilter()); // 过滤处理 HTTP 异常
  app.useGlobalPipes(new ValidationPipe()); //管道验证
  await app.listen(3000);
}
bootstrap();
