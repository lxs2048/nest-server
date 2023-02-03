import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { H5UserService } from './h5-user.service';
import { CreateH5UserDto } from './dto/create-h5-user.dto';
import { UpdateH5UserDto } from './dto/update-h5-user.dto';

@Controller('user')
export class H5UserController {
  constructor(private readonly h5UserService: H5UserService) {}

  @Post()
  create(@Body() createH5UserDto: CreateH5UserDto) {
    return this.h5UserService.create(createH5UserDto);
  }

  @Get()
  findAll() {
    return this.h5UserService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.h5UserService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateH5UserDto: UpdateH5UserDto) {
    return this.h5UserService.update(+id, updateH5UserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.h5UserService.remove(+id);
  }
}
