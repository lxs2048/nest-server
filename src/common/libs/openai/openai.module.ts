import { Global, Module } from '@nestjs/common';
import { OpenaiService } from './openai.service';

/**
 * openai module
 */
@Global()
@Module({
  providers: [OpenaiService],
  exports: [OpenaiService],
})
export class OpenaiModule {}
