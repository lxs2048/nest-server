import OSS from 'ali-oss';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// oss文档 https://help.aliyun.com/document_detail/111266.html
@Injectable()
export class OssService {
  private client: any;
  constructor(private readonly config: ConfigService) {
    this.client = new OSS({
      // yourRegion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
      region: this.config.get('ali.region'),
      // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
      accessKeyId: this.config.get('ali.accessKeyId'),
      accessKeySecret: this.config.get('ali.accessKeySecret'),
      bucket: this.config.get('ali.bucket'),
    });
  }
  async existFile(filename: string): Promise<boolean> {
    try {
      await this.client.head(filename); // 文件是否存在
      return true;
    } catch (error) {
      return false;
    }
  }
  async delFile(filename: string): Promise<boolean> {
    try {
      await this.client.delete(filename); // 删除文件
      return true;
    } catch (error) {
      return false;
    }
  }
  async copyFile(to: string, from: string): Promise<boolean> {
    try {
      await this.client.copy(to, from); // 删除文件
      return true;
    } catch (error) {
      return false;
    }
  }
  async putBuffer(filename: any, buffer: Buffer) {
    try {
      const result = await this.client.put(filename, buffer); // 上传本地内存 buffer
      const { name, url } = result || {};
      return { name, url };
    } catch (e) {
      return false;
    }
  }
}
