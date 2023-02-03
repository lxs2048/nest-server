import { PartialType } from '@nestjs/mapped-types';
import { CreateH5UserDto } from './create-h5-user.dto';

export class UpdateH5UserDto extends PartialType(CreateH5UserDto) {}
