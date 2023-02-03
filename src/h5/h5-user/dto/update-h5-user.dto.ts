import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateH5UserDto {
  @IsString({ message: 'email类型错误' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString({ message: 'password类型错误' })
  @IsOptional()
  password?: string;
}
