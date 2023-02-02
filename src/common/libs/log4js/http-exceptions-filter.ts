import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger, httpExceptionFormat } from './log4j.util';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const logFormat = httpExceptionFormat(exception, request);
    const errorRespose = <string | { message: string }>exception.getResponse();
    const errorTip =
      typeof errorRespose === 'string'
        ? errorRespose
        : errorRespose?.message || '';
    Logger.error(logFormat);
    response.status(status).json({
      data: null,
      status: status,
      success: false,
      message: `${status >= 500 ? 'Service Error' : 'Client Error'}`,
      error: errorTip,
    });
  }
}
