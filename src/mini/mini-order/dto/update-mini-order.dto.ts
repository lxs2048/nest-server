import { IsNumber, IsOptional, IsIn } from 'class-validator';
import { StatusValue } from 'src/common/enums/common.enum';
export class UpdateMiniOrderDto {
  @IsIn([StatusValue.NORMAL, StatusValue.FORBIDDEN], {
    message: 'pay_status可选值0/1，分别表示禁用/可用',
  })
  @IsNumber({}, { message: 'pay_status类型错误' })
  @IsOptional()
  pay_status?: StatusValue;
}
