import {
  MaxLength,
  IsNumber,
  Min,
  Max,
  IsOptional,
  IsIn,
} from 'class-validator';
import { StatusValue } from 'src/common/enums/common.enum';
export class UpdateMiniGoodDto {
  @MaxLength(50, {
    message: '商品名称最长50个字符',
  })
  @IsOptional()
  title: string; //登录code

  @MaxLength(200, {
    message: '商品简述最长200个字符',
  })
  @IsOptional()
  desc: string;

  @Max(99999999.99, { message: '金额不大于99999999.99' })
  @Min(0, { message: '金额必须大于0' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message: '金额必须是数字且小数位不超过2',
    },
  )
  @IsOptional()
  total: number;

  @IsIn([StatusValue.NORMAL, StatusValue.FORBIDDEN], {
    message: 'status 可选值0/1，分别表示禁用/可用',
  })
  @IsNumber({}, { message: 'status 类型错误' })
  @IsOptional()
  status?: StatusValue;
}
