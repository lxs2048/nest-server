import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class LoginUser {
  @IsString({ message: 'email 类型错误' })
  @IsNotEmpty({ message: '账号不能为空' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  readonly email: string;

  @IsString({ message: 'password 类型错误' })
  @IsNotEmpty({ message: '密码不能为空' })
  readonly password: string;
}
