import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  HttpCode,
} from '@nestjs/common';
import { MiniOrderService } from './mini-order.service';
import { CreateMiniOrderDto } from './dto/create-mini-order.dto';
import { UpdateMiniOrderDto } from './dto/update-mini-order.dto';
import { PagingQueryDto } from 'src/common/dto/page-query.dto';
import { customException } from 'src/common/utils/customException';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/common.enum';
import { AllowAnon } from 'src/common/decorators/allow-anon.decorator';
@Controller('order')
export class MiniOrderController {
  constructor(private readonly miniOrderService: MiniOrderService) {}

  /* 小程序支付参考：https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_5_1.shtml */
  // 微信支付回调
  @Post('payCb')
  @AllowAnon()
  @HttpCode(200)
  payCb(@Body() body) {
    return this.miniOrderService.verifyPayRet(body);
  }

  // 创建订单
  @Post('create')
  create(@Body() createMiniOrderDto: CreateMiniOrderDto, @Request() req) {
    return this.miniOrderService.create(createMiniOrderDto, req.user);
  }

  // 查找全部
  @Post('lists')
  findAll(@Body() body: PagingQueryDto, @Request() req) {
    if (!body.currentPage || !body.pageSize) {
      customException.fail('分页查询参数错误');
    }
    return this.miniOrderService.findAll(body, req.user);
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
    return this.miniOrderService.updatePayStatus(id, updateMiniOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.miniOrderService.remove(id);
  }
}
