import { IsNotEmpty } from 'class-validator';
export class CreateMiniUserDto {
  @IsNotEmpty()
  loginCode: string; //登录code
  @IsNotEmpty()
  phoneCode: string; //手机号code
}
