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
  Request,
} from '@nestjs/common';
import { MiniUserService } from './mini-user.service';
import { CreateMiniUserDto } from './dto/create-mini-user.dto';
import { UpdateMiniUserDto } from './dto/update-mini-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { OssService } from 'src/common/libs/oss/oss.service';
import { bucketTopDir } from 'src/common/enums/common.enum';
import { AllowAnon } from 'src/common/decorators/allow-anon.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/common.enum';
import { extname } from 'path';
import { ConfigService } from '@nestjs/config';
@Controller('user')
export class MiniUserController {
  constructor(
    private readonly miniUserService: MiniUserService,
    private readonly ossService: OssService,
    private readonly config: ConfigService,
  ) {}

  /* 登录 */
  @Post('login')
  @AllowAnon()
  login(@Body() createMiniUserDto: CreateMiniUserDto) {
    return this.miniUserService.login(createMiniUserDto);
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

  @Post('getPhone')
  getPhone(@Body() body, @Request() req) {
    return this.miniUserService.getPhone(body.code, req.user);
  }

  /* 获取个人信息 */
  @Get('selfInfo')
  getselfInfo(@Request() req) {
    // 该方法需要登录验证，所以可以使用jwt验证查询到的用户信息
    return req.user || {};
  }

  @Get()
  @Roles(Role.SUPER_ADMIN)
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
