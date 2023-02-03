import { BeforeUpdate, Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/common/libs/entities/BaseEntity';
import { StatusValue, Role } from 'src/common/enums/common.enum';
import { genSaltSync, hashSync } from 'bcryptjs';
import { Exclude } from 'class-transformer';
@Entity('h5User') //数据表的名字
export class H5UserEntity extends BaseEntity {
  @Exclude({ toPlainOnly: true })
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    select: false,
    update: false,
    unique: true,
    comment: 'openId',
  })
  openid: string;

  @Column({
    type: 'varchar',
    length: 30,
    nullable: true,
    unique: true,
  })
  nickname: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  headimgurl: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    unique: true,
    comment: '邮箱',
  })
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    select: false,
    comment: '密码',
  })
  password: string;

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

  @BeforeUpdate()
  async encryptPwd() {
    if (this.password) {
      this.password = hashSync(this.password, genSaltSync(10));
    }
  }
}
