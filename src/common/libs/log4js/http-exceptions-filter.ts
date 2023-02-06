import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { customExceptionInfo } from 'src/common/utils/helper';
import { Logger, httpExceptionFormat } from './log4j.util';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const errorRespose = <
      { message: string | string[]; statusCode: number; custom?: boolean }
    >exception.getResponse();
    /*
    其他内置HTTP异常方法得到是形如{ statusCode: 400, message: 'Bad Request' }的对象
    通过封装new HttpException('...', status);得到的errorRespose是'...'传对象与之匹配
    */
    const messageInfo =
      errorRespose?.message && typeof errorRespose.message === 'string'
        ? errorRespose.custom
          ? errorRespose.message
          : customExceptionInfo(status, errorRespose?.message || '')
        : Array.isArray(errorRespose.message) && errorRespose.message.length
        ? errorRespose.message[0]
        : '服务端错误，请联系管理员';
    const logFormat = httpExceptionFormat(messageInfo, status, request);
    Logger.error(logFormat);
    response.status(status).json({
      data: null,
      status: status,
      success: false,
      message: messageInfo,
    });
  }
}
