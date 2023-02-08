import { IsNotEmpty, MaxLength, IsNumber, Min, Max } from 'class-validator';
export class CreateMiniGoodDto {
  @MaxLength(50, {
    message: '商品名称最长50个字符',
  })
  @IsNotEmpty({ message: '商品名称不能为空' })
  title: string; //登录code

  @MaxLength(200, {
    message: '商品简述最长200个字符',
  })
  @IsNotEmpty({ message: '商品简述不能为空' })
  desc: string;

  @Max(99999999.99, { message: '金额不大于99999999.99' })
  @Min(0, { message: '金额必须大于0' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message: '金额必须是数字且小数位不超过2',
    },
  )
  @IsNotEmpty({ message: '商品金额不能为空' })
  total: number;
}
