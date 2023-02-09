import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PagingQueryDto } from 'src/common/dto/page-query.dto';
import { customException } from 'src/common/utils/customException';
import { Repository } from 'typeorm';
import { CreateMiniOrderDto } from './dto/create-mini-order.dto';
import { UpdateMiniOrderDto } from './dto/update-mini-order.dto';
import { MiniOrdersEntity } from './entities/mini-order.entity';

@Injectable()
export class MiniOrderService {
  constructor(
    @InjectRepository(MiniOrdersEntity)
    private readonly miniOrdersRepository: Repository<MiniOrdersEntity>,
  ) {}
  // 通过订单号与商品id生成默认订单
  async create(createMiniOrderDto: CreateMiniOrderDto) {
    const { goods_id } = createMiniOrderDto || {};
    const out_trade_no = 'suijishengcheng';
    // 订单号与商品id
    try {
      await this.miniOrdersRepository.save({ goods_id, out_trade_no });
      return true;
    } catch (error) {
      return false;
    }
  }

  // 查全部
  async findAll(pageQuery: PagingQueryDto,isAdmin:Boolean) {
    const { pageSize, currentPage } = pageQuery;
    try {
      // 跳过skip条查后面的take个
      let temp = this.miniOrdersRepository.createQueryBuilder("order")
      if(isAdmin){
        temp = temp.leftJoinAndSelect("order.user", "user")
      }
      const queryData = await temp
        .leftJoinAndSelect("order.goods", "goods")
        .skip(pageSize * (currentPage - 1))
        .take(pageSize)
        .getManyAndCount();
      const [records, total] = queryData;
      return {
        pageSize,
        currentPage,
        records,
        total,
        page: Math.ceil(total / pageSize),
      };
    } catch (error) {
      customException.fail('查询失败', 500);
    }
  }

  // 查详情
  async findOne(id: string) {
    const result = await this.miniOrdersRepository.findOneBy({ id });
    if (!result) customException.fail('商品不存在');
    return result;
  }

  update(id: string, updateMiniGoodDto: UpdateMiniOrderDto) {
    return this.miniOrdersRepository.update(id, updateMiniGoodDto);
  }

  // 删除
  remove(id: string) {
    return this.miniOrdersRepository.delete(id);
  }
}
