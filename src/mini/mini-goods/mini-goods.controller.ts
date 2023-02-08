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

@Controller('goods')
export class MiniGoodsController {
  constructor(private readonly miniGoodsService: MiniGoodsService) {}

  @Post()
  create(@Body() createMiniGoodDto: CreateMiniGoodDto) {
    return this.miniGoodsService.create(createMiniGoodDto);
  }

  @Get()
  @AllowAnon()
  findAll() {
    return this.miniGoodsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.miniGoodsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMiniGoodDto: UpdateMiniGoodDto,
  ) {
    return this.miniGoodsService.update(+id, updateMiniGoodDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.miniGoodsService.remove(+id);
  }
}
