import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MiniUserService } from './mini-user.service';
import { CreateMiniUserDto } from './dto/create-mini-user.dto';
import { UpdateMiniUserDto } from './dto/update-mini-user.dto';

@Controller('user')
export class MiniUserController {
  constructor(private readonly miniUserService: MiniUserService) {}

  @Post('login')
  login(@Body() createMiniUserDto: CreateMiniUserDto) {
    return this.miniUserService.login(createMiniUserDto);
  }

  @Get()
  findAll() {
    return this.miniUserService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.miniUserService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMiniUserDto: UpdateMiniUserDto,
  ) {
    return this.miniUserService.update(+id, updateMiniUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.miniUserService.remove(+id);
  }
}
