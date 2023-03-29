import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/common/libs/entities/BaseEntity';
import { StatusValue, Role } from 'src/common/enums/common.enum';
@Entity('miniUser') //数据表的名字
export class MiniUserEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 28,
    nullable: false, //允许为空
    unique: true, //唯一
    update: false, //不许更新
    comment: 'openId',
  })
  openid: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    unique: true,
    update: false,
    comment: '手机号',
  })
  phone: string;

  @Column({
    type: 'varchar',
    length: 32,
    comment: '昵称',
    nullable: true,
  })
  nickname: string;

  @Column({
    type: 'varchar',
    length: 150,
    comment: '头像',
    nullable: true,
  })
  avatarurl: string;

  @Column({
    type: 'tinyint',
    default: Role.ORDINARY_USER,
    comment: '帐号类型', //[0-超管,1-普通用户]
  })
  role: Role;

  @Column({
    type: 'tinyint',
    default: StatusValue.NORMAL,
    comment: '所属状态', //[1-有效,0-禁用]
  })
  status: StatusValue;
}
