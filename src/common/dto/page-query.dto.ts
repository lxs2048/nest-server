import { IsNotEmpty, Min, IsInt } from 'class-validator';
export class PagingQueryDto {
  @Min(0, { message: 'currentPage必须大于0' })
  @IsInt({ message: 'currentPage必须是整数' })
  @IsNotEmpty({ message: 'currentPage不能为空' })
  currentPage: number;

  @Min(0, { message: 'pageSize必须大于0' })
  @IsInt({ message: 'pageSize必须是整数' })
  @IsNotEmpty({ message: 'pageSize不能为空' })
  pageSize: number;
}
