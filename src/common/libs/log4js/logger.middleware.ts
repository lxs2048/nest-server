import { NextFunction, Request, Response } from 'express';
import { Logger, accessLogsFormat } from './log4j.util';
// 函数式中间件
export function logger(req: Request, res: Response, next: NextFunction) {
  const code = res.statusCode; // 响应状态码
  next();
  // 组装日志信息
  const logFormat = accessLogsFormat(req, res);
  // 根据状态码，进行日志类型区分
  if (code >= 500) {
    Logger.error(logFormat);
  } else if (code >= 400) {
    Logger.warn(logFormat);
  } else {
    Logger.access(logFormat);
  }
}
