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
import { TestService } from './test.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { ConfigService } from '@nestjs/config';
import { OssService } from 'src/common/libs/oss/oss.service';
import { bucketTopDir } from 'src/common/enums/common.enum';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('test')
export class TestController {
  constructor(
    private readonly testService: TestService,
    private readonly config: ConfigService,
    private readonly ossService: OssService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file) {
    const { originalname, buffer } = file;
    const ret = await this.ossService.putBuffer(
      `${bucketTopDir.AvatarImg}/${originalname}`,
      buffer,
    );
    return ret ? ret.url : '';
  }

  @Post()
  create(@Body() createTestDto: CreateTestDto) {
    return this.testService.create(createTestDto);
  }

  @Get()
  async findAll() {
    // const data = await this.ossService.existFile(
    //   `${bucketTopDir.AvatarImg}/1111.jpg`,
    // );
    // const data = await this.ossService.copyFile(
    //   `${bucketTopDir.Test}/112.jpg`,
    //   `${bucketTopDir.AvatarImg}/111.jpg`,
    // );
    // const data = await this.ossService.delFile(`${bucketTopDir.Test}/112.jpg`);
    // console.log(data);
    return this.testService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTestDto: UpdateTestDto) {
    return this.testService.update(+id, updateTestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testService.remove(+id);
  }
}
