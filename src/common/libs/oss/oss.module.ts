import { Global, Module } from '@nestjs/common';
import { OssService } from './oss.service';

/**
 * oss module
 * 当前模块是对 ali-oss 的一个简单封装
 */
@Global()
@Module({
  providers: [OssService],
  exports: [OssService],
})
export class OssModule {}
