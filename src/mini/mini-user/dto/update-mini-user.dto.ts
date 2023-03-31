import { IsNotEmpty } from 'class-validator';
export class UpdateMiniUserDto {
  @IsNotEmpty()
  nickname: string; //登录code
  @IsNotEmpty()
  avatarurl: string; //手机号code
}
