import { PartialType } from '@nestjs/mapped-types';
import { CreateMiniUserDto } from './create-mini-user.dto';

export class UpdateMiniUserDto extends PartialType(CreateMiniUserDto) {}
