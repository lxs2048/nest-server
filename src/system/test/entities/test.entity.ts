import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('test') //数据表的名字
export class TestEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  title: string; // 名称

  @Column()
  desc: string; // 描述
}
