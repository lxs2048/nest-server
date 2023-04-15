import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration, OpenAIApi } from 'openai';
import { createImageSize } from 'src/common/enums/common.enum';
type CreateImg = {
  prompt?: string;
  number?: number;
  sizeType?: string;
};

@Injectable()
export class OpenaiService {
  /*
    两个实例的原因：
    官网聊天接口：https://api.openai.com/v1/chat/completions
    官网图片接口：https://api.openai.com/v1/images/generations
    使用统一的basePath，包拼接的方式不一样
    聊天拼接basePath/completions,图片拼接聊天拼接basePath/images/generations
    所以创建通用和特殊类型的实例...
  */
  private openai: any;
  private openai_chat: any;
  constructor(private readonly config: ConfigService) {
    // 通用
    const configuration = new Configuration({
      basePath: `${this.config.get('chatGpt.basePath')}/v1`,
      apiKey: this.config.get('chatGpt.apiKey'),
    });
    this.openai = new OpenAIApi(configuration);
    // 聊天
    const chatConfiguration = new Configuration({
      basePath: `${this.config.get('chatGpt.basePath')}/v1/chat`,
      apiKey: this.config.get('chatGpt.apiKey'),
    });
    this.openai_chat = new OpenAIApi(chatConfiguration);
  }
  async createImg(params: CreateImg) {
    const {
      prompt = 'A cute baby cat',
      number: n = 1,
      sizeType = createImageSize.sm,
    } = params || {};
    try {
      const { data } = await this.openai.createImage({
        prompt: prompt,
        n,
        size: createImageSize[sizeType] || createImageSize.sm, // Must be one of 256x256, 512x512, or 1024x1024
      });
      return data?.data || undefined;
    } catch (error) {
      return undefined;
    }
  }
  /*
    当前接口是一次性对话方式
    扩展：
    场景1：翻译，content + '把翻译这句话翻译为中文'
    场景2：学习，content + '这段话对应的中文是什么，对应的语法知识有哪些，有哪些拼写错误...'
    场景3：交流，联系上下文
    messages格式如下：【重点：记录上下文】
    [
      {
          "role": "system",
          "content": "You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible.\nKnowledge cutoff: 2021-09-01\nCurrent date: 2023-04-15"
      },//初始的prompt
      {
          "role": "user",
          "content": "在nestjs中封装使用openai库"
      },//用户提问1
      {
          "role": "assistant",
          "content": "在 NestJS 中封装使用 OpenAI 库，你可以先安装 ..."
      },//接口回复1
      {
          "role": "user",
          "content": "通过module来注入openai"
      },//用户提问1
      {
          "role": "assistant",
          "content": "要通过模块（module）来注入 OpenAI，..."
      },//接口回复2
      {
          "role": "user",
          "content": "最新提问内容"
      },//用户提问3
    ]
  */
  async dialogue(content: string) {
    try {
      const completion = await this.openai_chat.createCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: content || 'hello' }],
      });
      return completion.data || undefined;
    } catch (error) {
      console.log(error, '33');

      return undefined;
    }
  }
}
