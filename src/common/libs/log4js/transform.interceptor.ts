import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Logger, outLogsFormat } from './log4j.util';
import { checkInNoFormatRoute } from 'src/common/enums/common.enum';
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.getArgByIndex(1).req;
    const {
      route: { path },
    } = req;
    const excludeFormat = checkInNoFormatRoute(path, req.method);
    return next.handle().pipe(
      map((data) => {
        const logFormat = outLogsFormat(req, data);
        Logger.info(logFormat);
        if (excludeFormat) return data;
        return {
          data,
          status: 0,
          success: true,
          message: 'Success',
        };
      }),
    );
  }
}
