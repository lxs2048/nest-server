import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MiniGoodsService } from './mini-goods.service';
import { CreateMiniGoodDto } from './dto/create-mini-good.dto';
import { UpdateMiniGoodDto } from './dto/update-mini-good.dto';
import { AllowAnon } from 'src/common/decorators/allow-anon.decorator';
import { customException } from 'src/common/utils/customException';
import { PagingQueryDto } from 'src/common/dto/page-query.dto';

@Controller('goods')
export class MiniGoodsController {
  constructor(private readonly miniGoodsService: MiniGoodsService) {}
  // 创建
  @Post()
  create(@Body() createMiniGoodDto: CreateMiniGoodDto) {
    return this.miniGoodsService.create(createMiniGoodDto);
  }
  // 查找全部
  @Post('lists')
  findAll(@Body() body: PagingQueryDto) {
    if (!body.currentPage || !body.pageSize) {
      customException.fail('分页查询参数错误');
    }
    return this.miniGoodsService.findAll(body);
  }
  // 查信息
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.miniGoodsService.findOne(id);
  }
  // 更新
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMiniGoodDto: UpdateMiniGoodDto,
  ) {
    return this.miniGoodsService.update(id, updateMiniGoodDto);
  }
  // 删
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.miniGoodsService.remove(id);
  }
}
