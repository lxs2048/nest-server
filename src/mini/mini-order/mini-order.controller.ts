import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MiniOrderService } from './mini-order.service';
import { CreateMiniOrderDto } from './dto/create-mini-order.dto';
import { UpdateMiniOrderDto } from './dto/update-mini-order.dto';
import { AllowAnon } from 'src/common/decorators/allow-anon.decorator';

@Controller('order')
export class MiniOrderController {
  constructor(private readonly miniOrderService: MiniOrderService) {}

  @Post()
  create(@Body() createMiniOrderDto: CreateMiniOrderDto) {
    return this.miniOrderService.create(createMiniOrderDto);
  }

  @Get()
  @AllowAnon()
  findAll() {
    return this.miniOrderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.miniOrderService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMiniOrderDto: UpdateMiniOrderDto,
  ) {
    return this.miniOrderService.update(+id, updateMiniOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.miniOrderService.remove(+id);
  }
}
