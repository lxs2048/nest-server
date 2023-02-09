import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request
} from '@nestjs/common';
import { MiniOrderService } from './mini-order.service';
import { CreateMiniOrderDto } from './dto/create-mini-order.dto';
import { UpdateMiniOrderDto } from './dto/update-mini-order.dto';
import { PagingQueryDto } from 'src/common/dto/page-query.dto';
import { customException } from 'src/common/utils/customException';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/common.enum';
@Controller('order')
export class MiniOrderController {
  constructor(private readonly miniOrderService: MiniOrderService) {}

  // 创建订单
  @Post()
  create(@Body() createMiniOrderDto: CreateMiniOrderDto) {
    return this.miniOrderService.create(createMiniOrderDto);
  }

  // 查找全部
  @Post('lists')
  findAll(@Body() body: PagingQueryDto,@Request() req) {
    if (!body.currentPage || !body.pageSize) {
      customException.fail('分页查询参数错误');
    }
    const isAdmin = req.user?.role === Role.SUPER_ADMIN
    return this.miniOrderService.findAll(body,isAdmin);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.miniOrderService.findOne(id);
  }

  // 注意：创建工单不能外部调用，更新默认一样，但是需要预留系统管理员改状态
  @Patch(':id')
  @Roles(Role.SUPER_ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateMiniOrderDto: UpdateMiniOrderDto,
  ) {
    return this.miniOrderService.update(id, updateMiniOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.miniOrderService.remove(id);
  }
}
