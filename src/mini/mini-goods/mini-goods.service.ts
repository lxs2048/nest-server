import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PagingQueryDto } from 'src/common/dto/page-query.dto';
import { customException } from 'src/common/utils/customException';
import { Repository } from 'typeorm';
import { CreateMiniGoodDto } from './dto/create-mini-good.dto';
import { UpdateMiniGoodDto } from './dto/update-mini-good.dto';
import { MiniGoodsEntity } from './entities/mini-good.entity';

@Injectable()
export class MiniGoodsService {
  constructor(
    @InjectRepository(MiniGoodsEntity)
    private readonly miniGoodsRepository: Repository<MiniGoodsEntity>,
  ) {}
  // 创建商品
  create(createMiniGoodDto: CreateMiniGoodDto) {
    return this.miniGoodsRepository.save(createMiniGoodDto);
  }
  // 查找商品
  async findAll(pageQuery: PagingQueryDto) {
    const { pageSize, currentPage } = pageQuery;
    try {
      // 跳过skip条查后面的take个
      const queryData = await this.miniGoodsRepository
        .createQueryBuilder()
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
  // 商品信息
  async findOne(id: string) {
    const result = await this.miniGoodsRepository.findOneBy({ id });
    if (!result) customException.fail('商品不存在');
    return result;
  }
  // 更新
  update(id: string, updateMiniGoodDto: UpdateMiniGoodDto) {
    return this.miniGoodsRepository.update(id, updateMiniGoodDto);
  }
  // 删除
  remove(id: string) {
    return this.miniGoodsRepository.delete(id);
  }
}
