import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { anyExceptionFormat, Logger } from './log4j.util';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const logFormat = anyExceptionFormat(exception, request, status);
    Logger.error(logFormat);
    response.status(status).json({
      data: null,
      status: status,
      success: false,
      message: 'Service Error',
      error: exception.toString(),
    });
  }
}
