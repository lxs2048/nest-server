import { IsNotEmpty, MaxLength } from 'class-validator';
export class CreateMiniUserDto {
  @IsNotEmpty()
  code: string; //登录code
  @IsNotEmpty()
  @MaxLength(16, {
    message: 'nickname is too long',
  })
  nickname: string;
  @IsNotEmpty()
  avatarurl: string;
}
