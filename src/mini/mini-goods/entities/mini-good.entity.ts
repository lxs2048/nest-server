import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/common/libs/entities/BaseEntity';
import { StatusValue } from 'src/common/enums/common.enum';
@Entity('miniGoods') //数据表的名字
export class MiniGoodsEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: false,
  })
  title: string;
  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
    unique: false,
  })
  desc: string;
  // 99999999.99
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total: number;

  @Column({
    type: 'tinyint',
    default: StatusValue.NORMAL,
    comment: '所属状态[1-有效,0-禁用]',
  })
  status: StatusValue;
}
