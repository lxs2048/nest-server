import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { MiniUserService } from './mini-user.service';
import { CreateMiniUserDto } from './dto/create-mini-user.dto';
import { UpdateMiniUserDto } from './dto/update-mini-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { OssService } from 'src/common/libs/oss/oss.service';
import { bucketTopDir } from 'src/common/enums/common.enum';
import { AllowAnon } from 'src/common/decorators/allow-anon.decorator';

@Controller('user')
export class MiniUserController {
  constructor(
    private readonly miniUserService: MiniUserService,
    private readonly ossService: OssService,
  ) {}

  @Post('login')
  @AllowAnon()
  login(@Body() createMiniUserDto: CreateMiniUserDto) {
    return this.miniUserService.login(createMiniUserDto);
  }

  @Post('upload')
  @AllowAnon()
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file) {
    const { originalname, buffer } = file;
    const ret = await this.ossService.putBuffer(
      `${bucketTopDir.AvatarImg}/${originalname}`,
      buffer,
    );
    return ret ? ret.url : '';
  }

  @Get()
  findAll() {
    return this.miniUserService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.miniUserService.findOne(id);
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
