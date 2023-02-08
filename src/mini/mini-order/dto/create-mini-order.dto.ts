import { IsNotEmpty } from 'class-validator';
export class CreateMiniOrderDto {
  @IsNotEmpty({ message: '商品id不能为空' })
  goods_id: string;
}
