import { PartialType } from '@nestjs/mapped-types';
import { CreateMiniOrderDto } from './create-mini-order.dto';

export class UpdateMiniOrderDto extends PartialType(CreateMiniOrderDto) {}
