import { PartialType } from '@nestjs/mapped-types';
import { CreateMiniGoodDto } from './create-mini-good.dto';

export class UpdateMiniGoodDto extends PartialType(CreateMiniGoodDto) {}
