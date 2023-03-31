import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { MiniUserService } from './mini-user.service';
import { CreateMiniUserDto } from './dto/create-mini-user.dto';
import { UpdateMiniUserDto } from './dto/update-mini-user.dto';
import { AllowAnon } from 'src/common/decorators/allow-anon.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/common.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { OssService } from 'src/common/libs/oss/oss.service';
import { bucketTopDir } from 'src/common/enums/common.enum';
import { ConfigService } from '@nestjs/config';
@Controller('user')
export class MiniUserController {
  constructor(
    private readonly miniUserService: MiniUserService,
    private readonly ossService: OssService,
    private readonly config: ConfigService,
  ) {}

  @Post('hello')
  @Roles(Role.SUPER_ADMIN)
  hello(@Body() body) {
    return body.hello;
  }

  @Post('login')
  @AllowAnon()
  login(@Body() createMiniUserDto: CreateMiniUserDto) {
    return this.miniUserService.login(createMiniUserDto);
  }

  @Post('modifyBasic')
  modifyBasic(@Body() updateMiniUserDto: UpdateMiniUserDto, @Request() req) {
    return this.miniUserService.modifyBasic(updateMiniUserDto, req.user);
  }

  /* 上传头像 */
  @Post('upload')
  @AllowAnon()
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file) {
    const { buffer } = file;
    const fileName = `${
      new Date().getTime() +
      Math.random().toString(36).slice(-7) +
      extname(file.originalname)
    }`;
    const ret = await this.ossService.putBuffer(
      `${bucketTopDir.AvatarImg}/${fileName}`,
      buffer,
    );
    const website = this.config.get('ali.website');
    return ret ? `${website}/${ret.name}` : '';
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
