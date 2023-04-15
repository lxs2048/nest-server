import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class ChatgptService {
  constructor(private readonly config: ConfigService) {}
}
