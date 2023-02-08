import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/common/libs/entities/BaseEntity';
import { StatusValue } from 'src/common/enums/common.enum';
@Entity('miniOrders') //数据表的名字
export class MiniOrdersEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    unique: true,
  })
  out_trade_no: string; //订单id

  @Column({
    type: 'varchar',
    length: 36,
    nullable: false,
    unique: false,
  })
  goods_id: string; //商品id

  @Column({
    type: 'varchar',
    length: 36,
    nullable: false,
    unique: false,
  })
  user_id: string; //用户id

  @Column({
    type: 'tinyint',
    default: StatusValue.FORBIDDEN,
    comment: '所属状态[1-已支付,0-未支付]，默认未支付',
  })
  pay_status: StatusValue; //支付状态
}
