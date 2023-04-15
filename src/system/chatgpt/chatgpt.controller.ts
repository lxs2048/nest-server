import { Controller, Post, Body } from '@nestjs/common';
import { ChatgptService } from './chatgpt.service';
import { CreateImgChatgptDto } from './dto/createImg-chatgpt.dto';
import { DialogueChatgptDto } from './dto/dialogue-chatgpt.dto';
import { OpenaiService } from 'src/common/libs/openai/openai.service';
import { customException } from 'src/common/utils/customException';
@Controller('chatgpt')
export class ChatgptController {
  constructor(
    private readonly chatgptService: ChatgptService,
    private readonly openaiService: OpenaiService,
  ) {}

  @Post('generateImg')
  async generateImg(@Body() createImgChatgptDto: CreateImgChatgptDto) {
    const ret = await this.openaiService.createImg(createImgChatgptDto);
    if (ret) return ret;
    customException.fail('连接异常', 500);
  }

  @Post('dialogue')
  async dialogue(@Body() dialogueChatgptDto: DialogueChatgptDto) {
    const { question } = dialogueChatgptDto;
    const ret = await this.openaiService.dialogue(question);
    if (ret) return ret;
    customException.fail('连接异常', 500);
  }
}
