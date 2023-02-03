import { IsNotEmpty } from 'class-validator';
export class CreateH5UserDto {
  @IsNotEmpty()
  openid: string;
}
