import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/libs/entities/BaseEntity';
import { StatusValue, Role } from 'src/common/enums/common.enum';
import { MiniOrdersEntity } from 'src/mini/mini-order/entities/mini-order.entity';

@Entity('miniUser') //数据表的名字
export class MiniUserEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 28,
    nullable: false,
    unique: true,
    select: true, //放开，其他地方用到
    update: false,
    comment: 'openId',
  })
  openid: string;

  @Column({
    type: 'varchar',
    length: 16,
    nullable: false,
    unique: false,
  })
  nickname: string;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
    unique: false,
  })
  avatarurl: string;

  @Column({
    type: 'varchar',
    length: 11,
    nullable: true,
    unique: true,
  })
  phone: string;

  @Column({
    type: 'tinyint',
    default: Role.ORDINARY_USER,
    comment: '帐号类型[0-超管,1-普通用户]',
  })
  role: Role;

  @Column({
    type: 'tinyint',
    default: StatusValue.NORMAL,
    comment: '所属状态[1-有效,0-禁用]',
  })
  status: StatusValue;
  @OneToMany(() => MiniOrdersEntity, (order) => order.user_id)
  orders: MiniOrdersEntity[];
}
